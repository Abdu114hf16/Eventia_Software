from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, get_user_model
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib import messages
from datetime import date
from django.db.models import Count, Sum, Avg, Q, F, Prefetch
from .forms import SignUpForm
from .models import Event, OrganizerProfile, VendorProfile, Request, CustomUser, Ticket, AttendeeProfile, Broadcast, Message, VendorStatusUpdate
import google.generativeai as genai
import os
import json
import random
import time
from django.core.cache import cache
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings


# --- GENERAL NAVIGATION & AUTH ---

def dashboard_view(request):
    if request.user.is_authenticated:
        if request.user.role == 'ORGANIZER':
            return redirect('organizer_dashboard')
        elif request.user.role == 'VENDOR':
            return redirect('vendor_dashboard')
        elif request.user.role == 'SCEGA_ADMIN':
            return redirect('scega_dashboard')
        elif request.user.role == 'ATTENDEE':
            return redirect('attendee_dashboard')

    events = Event.objects.filter(status='APPROVED').order_by('date')
    return render(request, 'core/index.html', {'events': events})

def landing_page(request):
    events = Event.objects.filter(status='APPROVED').order_by('date')
    return render(request, 'core/index.html', {'events': events})

def logout_view(request):
    logout(request)
    return redirect('home')


# --- ATTENDEE VIEWS ---

def signup_attendee(request):
    if request.method == 'POST':
        data = request.POST.copy()
        data['role'] = 'ATTENDEE'

        day = data.get('day')
        month = data.get('month')
        year = data.get('year')
        if day and month and year:
            data['date_of_birth'] = f"{year}-{month}-{day}"

        form = SignUpForm(data)
        if form.is_valid():
            user = form.save()
            if user.role != 'ATTENDEE':
                user.role = 'ATTENDEE'
                user.save()

            login(request, user)
            return redirect('attendee_dashboard')
        else:
            messages.error(request, f"Validation Failed: {form.errors}")
    else:
        form = SignUpForm()
    return render(request, 'core/signup.html', {'form': form})


def login_attendee(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.role != 'ATTENDEE':
                messages.error(request, "Access Denied. Organizers and Vendors must use the Business Login page.")
                return render(request, 'core/login.html', {'form': form})
            login(request, user)
            return redirect('attendee_dashboard')
        else:
            messages.error(request, "Invalid credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'core/login.html', {'form': form})


@login_required
def attendee_dashboard(request):
    if request.user.role != 'ATTENDEE': return redirect('home')
    events = Event.objects.filter(status='APPROVED').order_by('date')
    user_tickets = Ticket.objects.filter(attendee=request.user)
    registered_event_ids = list(user_tickets.values_list('event_id', flat=True))

    return render(request, 'core/attendee-dashboard.html', {
        'events': events,
        'registered_event_ids': registered_event_ids,
    })


@login_required
def api_attendee_data(request):
    if request.user.role != 'ATTENDEE':
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    today = date.today()
    all_events = Event.objects.filter(status='APPROVED').order_by('date')
    user_tickets = Ticket.objects.filter(attendee=request.user).select_related('event')
    ticket_map = {t.event.id: t for t in user_tickets}
    registered_event_ids = list(ticket_map.keys())

    try:
        broadcasts = Broadcast.objects.filter(event__id__in=registered_event_ids).order_by('-timestamp')
    except Exception:
        broadcasts = []

    events_data = []
    for event in all_events:
        events_data.append({
            'id': str(event.id),
            'title': event.title or 'Untitled Event',
            'category': event.category or 'Other',
            'date': event.date.strftime('%Y-%m-%d') if event.date else 'TBD',
            'time': event.time.strftime('%H:%M') if event.time else 'TBD',
            'location': event.location or 'TBD',
            'price': float(event.ticket_price) if getattr(event, 'ticket_price', None) else 0.0,
            'description': event.description or '',
            'status': 'upcoming' if (event.date and event.date >= today) else 'past',
            'banner': event.banner.url if bool(event.banner) else None
        })

    regs_data = []
    for t in user_tickets:
        regs_data.append({
            'id': str(t.id),
            'eventId': str(t.event.id),
            'ticketType': getattr(t, 'ticket_type', 'Standard'),
            'ticketPrice': float(getattr(t, 'amount_paid', 0.0)),
            'registeredDate': t.purchase_date.strftime('%Y-%m-%d'),
            'ticketCode': f"EVT-{t.event.id}-TKT-{t.id}",
            'attended': getattr(t, 'attended', False),
            'rating': getattr(t, 'rating', None),
            'feedback': getattr(t, 'feedback', None),
            'feedbackDate': t.purchase_date.strftime('%Y-%m-%d') if getattr(t, 'feedback', None) else None
        })

    broadcasts_data = [{
        'id': str(b.id),
        'eventId': str(b.event.id),
        'message': b.message,
        'timestamp': b.timestamp.isoformat()
    } for b in broadcasts]

    try:
        job_title = request.user.attendee_profile.job_title or ''
    except Exception:
        job_title = ''

    return JsonResponse({
        'events': events_data,
        'registrations': regs_data,
        'broadcasts': broadcasts_data,
        'profile': {
            'firstName': request.user.first_name or request.user.username,
            'lastName': request.user.last_name or '',
            'email': request.user.email,
            'phone': request.user.phone_number or '',
            'jobTitle': job_title,
            'avatar': request.user.profile_picture.url if request.user.profile_picture else None,
        }
    })


@login_required
def api_attendee_register_json(request, event_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        event = get_object_or_404(Event, id=event_id)
        if not Ticket.objects.filter(attendee=request.user, event=event).exists():
            Ticket.objects.create(
                attendee=request.user,
                event=event,
                status='ACTIVE',
                ticket_type=data.get('ticketType', 'Standard'),
                amount_paid=data.get('ticketPrice', 0.0)
            )
            return JsonResponse({'success': True})
        return JsonResponse({'error': 'Already registered'}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)


@login_required
def api_attendee_feedback_json(request, reg_id):
    if request.method == 'POST':
        data = json.loads(request.body)
        ticket = get_object_or_404(Ticket, id=reg_id, attendee=request.user)
        ticket.rating = data.get('rating')
        ticket.feedback = data.get('feedback')
        ticket.save()
        return JsonResponse({'success': True})


@login_required
def attendee_register(request, event_id):
    return redirect('attendee_dashboard')


@login_required
def attendee_cancel(request, ticket_id):
    if request.user.role != 'ATTENDEE':
        return redirect('home')
    ticket = get_object_or_404(Ticket, id=ticket_id, attendee=request.user)
    ticket.delete()
    messages.info(request, "Registration cancelled.")
    return redirect('attendee_dashboard')


# --- BUSINESS VIEWS ---

def signup_business(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            if user.role == 'ORGANIZER':
                return redirect('organizer_dashboard')
            elif user.role == 'VENDOR':
                return redirect('vendor_dashboard')
            return redirect('dashboard')
        else:
            messages.error(request, f"Validation Failed: {form.errors}")
    else:
        form = SignUpForm()
    return render(request, 'core/signup-business.html', {'form': form})


def login_business(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.role not in ['ORGANIZER', 'VENDOR']:
                messages.error(request, "Access Denied. Attendees must use the standard login page.")
                return render(request, 'core/login-business.html', {'form': form})
            login(request, user)
            if user.role == 'ORGANIZER':
                return redirect('organizer_dashboard')
            elif user.role == 'VENDOR':
                return redirect('vendor_dashboard')
        else:
            messages.error(request, "Invalid business credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'core/login-business.html', {'form': form})


# --- SCEGA ADMIN VIEWS ---

@login_required
def vendor_dashboard(request):
    if request.user.role != 'VENDOR':
        return redirect('home')

    incoming_requests = Request.objects.none()
    outgoing_requests = Request.objects.none()
    approved_requests = Request.objects.none()
    pending_invitations_count = 0
    active_events_count = 0
    completed_events_count = 0
    my_events = []
    all_upcoming_events = []
    applied_event_ids = []
    requests_data = []
    messages_data = []

    try:
        vendor_profile = request.user.vendor_profile
        today = date.today()

        incoming_requests = Request.objects.filter(vendor=vendor_profile, sent_by='ORGANIZER').order_by('-created_at')
        outgoing_requests = Request.objects.filter(vendor=vendor_profile, sent_by='VENDOR').order_by('-created_at')
        approved_requests = Request.objects.filter(vendor=vendor_profile, status='APPROVED')

        pending_invitations_count = incoming_requests.filter(status='PENDING').count()
        active_events_count = approved_requests.filter(event__date__gte=today).count()
        completed_events_count = approved_requests.filter(event__date__lt=today).count()

        my_events = approved_requests.order_by('event__date')
        all_upcoming_events = Event.objects.filter(status='APPROVED').order_by('date')
        applied_event_ids = list(incoming_requests.values_list('event_id', flat=True)) + \
                            list(outgoing_requests.values_list('event_id', flat=True))

        requests_data = [{
            'id': r.id,
            'eventId': r.event.id,
            'vendorId': r.vendor.id,
            'status': r.status,
            'preparationStatus': getattr(r, 'preparation_status', 'Pending'),
            'updateRequested': getattr(r, 'update_requested', False)
        } for r in approved_requests]

        messages_data = [{
            'id': m.id,
            'eventId': m.event.id,
            'vendorId': m.vendor.id,
            'sender': m.sender,
            'text': m.text,
            'timestamp': m.timestamp.isoformat()
        } for m in Message.objects.filter(vendor=vendor_profile)]

    except Exception as e:
        print(f"Dashboard Error: {e}")

    context = {
        'incoming_requests': incoming_requests,
        'outgoing_requests': outgoing_requests,
        'pending_invitations_count': pending_invitations_count,
        'active_events_count': active_events_count,
        'completed_events_count': completed_events_count,
        'my_events': my_events,
        'all_upcoming_events': all_upcoming_events,
        'applied_event_ids': applied_event_ids,
        'requests_json': json.dumps(requests_data, cls=DjangoJSONEncoder),
        'messages_json': json.dumps(messages_data, cls=DjangoJSONEncoder),
    }

    return render(request, 'core/vendor-dashboard.html', context)

def login_scega(request):
    storage = messages.get_messages(request)
    for _ in storage: pass

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.role == 'SCEGA_ADMIN':
                login(request, user)
                return redirect('scega_dashboard')
            else:
                messages.error(request, "Access Denied. SCEGA Admins only.")
    else:
        form = AuthenticationForm()
    return render(request, 'core/scega-login.html', {'form': form})


def logout_scega(request):
    logout(request)
    messages.info(request, "You have been successfully logged out.")
    return redirect('scega_login')


@login_required
def scega_dashboard(request):
    if request.user.role != 'SCEGA_ADMIN':
        return redirect('home')

    if request.method == 'POST':
        event_id = request.POST.get('event_id')
        action = request.POST.get('action')
        reason = request.POST.get('rejection_reason', '')
        event = get_object_or_404(Event, id=event_id)

        if action == 'approve':
            event.status = 'APPROVED'
            event.rejection_reason = ""
            messages.success(request, f"Event '{event.title}' Published.")
        elif action == 'reject':
            event.status = 'REJECTED'
            event.rejection_reason = reason
            messages.warning(request, f"Event '{event.title}' Rejected.")

        event.save()
        return redirect('scega_dashboard')

    pending_events = Event.objects.filter(status='PENDING').order_by('date')
    history_events = Event.objects.filter(status__in=['APPROVED', 'REJECTED']).order_by('-date')

    context = {
        'pending_events': pending_events,
        'history_events': history_events,
        'pending_count': pending_events.count(),
        'approved_count': Event.objects.filter(status='APPROVED').count(),
        'rejected_count': Event.objects.filter(status='REJECTED').count(),
    }
    return render(request, 'core/scega-dashboard.html', context)


# --- ORGANIZER DASHBOARD ---

@login_required
def organizer_dashboard(request):
    if request.user.role != 'ORGANIZER':
        return redirect('home')

    if request.method == 'POST':
        try:
            if request.POST.get('create_request') == 'true':
                vendor_id = request.POST.get('vendor_id')
                event_id = request.POST.get('event_id')
                message = request.POST.get('message')

                vendor = get_object_or_404(VendorProfile, id=vendor_id)
                event = get_object_or_404(Event, id=event_id, organizer=request.user.organizer_profile)

                if Request.objects.filter(event=event, vendor=vendor).exists():
                    messages.warning(request, "A request for this vendor and event already exists.")
                else:
                    Request.objects.create(
                        event=event,
                        vendor=vendor,
                        message=message,
                        sent_by='ORGANIZER',
                        status='PENDING'
                    )
                    messages.success(request, f"Request sent to {vendor.user.username} successfully!")
                return redirect('organizer_dashboard')

            event_id = request.POST.get('event_id')
            banner_file = request.FILES.get('banner')

            if event_id:
                event = get_object_or_404(Event, id=event_id, organizer=request.user.organizer_profile)
                event.title = request.POST.get('title')
                event.category = request.POST.get('category')
                event.date = request.POST.get('date')
                event.time = request.POST.get('time')
                event.location = request.POST.get('location')
                event.description = request.POST.get('description')
                event.capacity = int(request.POST.get('capacity') or event.capacity or 100)
                event.ticket_price = request.POST.get('ticket_price', 0)
                event.withdrawal_policy = request.POST.get('withdrawal_policy', '')
                event.attendee_withdrawal_policy = request.POST.get('attendee_withdrawal_policy', '')

                if banner_file:
                    event.banner = banner_file

                event.status = 'PENDING'
                event.save()
                messages.success(request, "Event updated successfully!")
            else:
                Event.objects.create(
                    organizer=request.user.organizer_profile,
                    title=request.POST.get('title'),
                    category=request.POST.get('category'),
                    date=request.POST.get('date'),
                    time=request.POST.get('time'),
                    location=request.POST.get('location'),
                    description=request.POST.get('description'),
                    capacity=int(request.POST.get('capacity') or 100),
                    ticket_price=request.POST.get('ticket_price', 0),
                    withdrawal_policy=request.POST.get('withdrawal_policy', ''),
                    attendee_withdrawal_policy=request.POST.get('attendee_withdrawal_policy', ''),
                    banner=banner_file,
                    status='PENDING'
                )
                messages.success(request, "Event created! Waiting for approval.")
            return redirect('organizer_dashboard')
        except Exception as e:
            messages.error(request, f"Error: {str(e)}")
            return redirect('organizer_dashboard')

    try:
        organizer_profile = request.user.organizer_profile
        my_events = Event.objects.filter(organizer=organizer_profile).order_by('-id')
        vendors = VendorProfile.objects.all().order_by('organization_name', 'user__username')
        outgoing_requests = Request.objects.filter(event__organizer=organizer_profile, sent_by='ORGANIZER').order_by('-created_at')
        incoming_requests = Request.objects.filter(event__organizer=organizer_profile, sent_by='VENDOR').order_by('-created_at')

    except OrganizerProfile.DoesNotExist:
        my_events = []
        vendors = []
        outgoing_requests = []
        incoming_requests = []

    # --- Server-side stats ---
    today = date.today()
    total_events   = len(my_events) if isinstance(my_events, list) else my_events.count()
    pending_count  = sum(1 for e in my_events if e.status == 'PENDING')
    upcoming_count = sum(1 for e in my_events if e.status == 'APPROVED' and e.date >= today)

    # --- Annotate each event with its computed display state ---
    annotated_events = []
    for e in my_events:
        if e.date < today:
            e._state = 'Past'
        elif e.status == 'REJECTED':
            e._state = 'Rejected'
        elif e.status == 'PENDING':
            e._state = 'Pending'
        else:
            e._state = 'Upcoming'
        annotated_events.append(e)

    # Recent events for the overview panel (approved, upcoming/today, max 3, nearest first)
    recent_events = sorted(
        [e for e in annotated_events if e._state in ('Upcoming',)],
        key=lambda e: e.date
    )[:3]

    # --- Serialize events to JSON so the JS has real data on first render ---
    events_json_list = []
    for e in annotated_events:
        active_count = Ticket.objects.filter(event=e, status='ACTIVE').count()
        events_json_list.append({
            'id': str(e.id),
            'title': e.title,
            'category': e.category or 'Other',
            'date': e.date.strftime('%Y-%m-%d'),
            'time': e.time.strftime('%H:%M') if e.time else '',
            'location': e.location or '',
            'description': e.description or '',
            'price': str(e.ticket_price),
            'tickets': [{'name': 'Standard', 'price': str(e.ticket_price)}],
            'status': e._state,
            'withdrawalPolicy': e.withdrawal_policy or 'flexible',
            'attendeeWithdrawalPolicy': e.attendee_withdrawal_policy or 'flexible',
            'attendees': active_count,
            'rejectionReason': e.rejection_reason or '',
            'banner': e.banner.url if bool(e.banner) else None,
            'capacity': e.capacity,
        })
    events_json = json.dumps(events_json_list, cls=DjangoJSONEncoder)

    context = {
        'events': annotated_events,
        'recent_events': recent_events,
        'vendors': vendors,
        'outgoing_requests': outgoing_requests,
        'incoming_requests': incoming_requests,
        # Stats for server-side rendering of the dashboard cards
        'total_events': total_events,
        'pending_count': pending_count,
        'upcoming_count': upcoming_count,
        # JSON blob injected into the page so JS renders immediately (no blank flash)
        'events_json': events_json,
    }
    return render(request, 'core/organizer-dashboard.html', context)


@login_required
def organizer_accept_request(request, req_id):
    if request.user.role != 'ORGANIZER':
        return redirect('home')
    req = get_object_or_404(Request, id=req_id, event__organizer=request.user.organizer_profile)
    req.status = 'APPROVED'
    req.save()
    messages.success(request, f"Request from {req.vendor.user.username} approved!")
    return redirect('organizer_dashboard')


@login_required
def organizer_reject_request(request, req_id):
    if request.user.role != 'ORGANIZER':
        return redirect('home')
    req = get_object_or_404(Request, id=req_id, event__organizer=request.user.organizer_profile)
    req.status = 'REJECTED'
    req.save()
    messages.warning(request, f"Request from {req.vendor.user.username} rejected.")
    return redirect('organizer_dashboard')


@login_required
def delete_event(request, event_id):
    if request.user.role != 'ORGANIZER':
        return redirect('home')
    event = get_object_or_404(Event, id=event_id, organizer=request.user.organizer_profile)
    event.delete()
    messages.success(request, "Event deleted successfully.")
    return redirect('organizer_dashboard')


def debug_user_role(request):
    if not request.user.is_authenticated:
        from django.http import HttpResponse
        return HttpResponse("<h1>You are NOT logged in.</h1><a href='/login/'>Log In</a>")

    from django.http import HttpResponse
    return HttpResponse(f"""
        <h1>User Debugger</h1>
        <ul>
            <li><strong>Username:</strong> '{request.user.username}'</li>
            <li><strong>Role (Raw Value):</strong> '{request.user.role}'</li>
            <li><strong>Is 'ATTENDEE'?:</strong> {request.user.role == 'ATTENDEE'}</li>
        </ul>
    """)


def event_details(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    return render(request, 'core/event_details.html', {'event': event})


@login_required
def accept_request(request, req_id):
    if request.user.role != 'VENDOR':
        return redirect('home')
    req = get_object_or_404(Request, id=req_id, vendor=request.user.vendor_profile)
    req.status = 'APPROVED'
    req.save()
    messages.success(request, "Invitation accepted!")
    return redirect('vendor_dashboard')


@login_required
def reject_request(request, req_id):
    if request.user.role != 'VENDOR':
        return redirect('home')
    if request.method == 'POST':
        reason = request.POST.get('reason', '')
        req = get_object_or_404(Request, id=req_id, vendor=request.user.vendor_profile)
        req.status = 'REJECTED'
        req.message += f"\n[Rejected]: {reason}"
        req.save()
        messages.success(request, "Invitation rejected!")
    return redirect('vendor_dashboard')


@login_required
def withdraw_request(request, req_id):
    if request.user.role != 'VENDOR':
        return redirect('home')
    if request.method == 'POST':
        reason = request.POST.get('reason', '')
        req = get_object_or_404(Request, id=req_id, vendor=request.user.vendor_profile)
        event = req.event

        days_until = (event.date - date.today()).days
        policy = event.withdrawal_policy
        allowed = True
        if policy == 'non-refundable': allowed = False
        elif policy == 'strict' and days_until < 30: allowed = False
        elif policy == 'moderate' and days_until < 14: allowed = False
        elif policy == 'flexible' and days_until < 7: allowed = False

        if not allowed:
            messages.error(request, "Withdrawal blocked by event policy.")
            return redirect('vendor_dashboard')

        req.status = 'REJECTED'
        req.message += f"\n[Withdrawn]: {reason}"
        req.save()
        messages.success(request, "Withdrawn from event!")
    return redirect('vendor_dashboard')


@login_required
def apply_for_event(request):
    if request.user.role != 'VENDOR':
        return redirect('home')
    if request.method == 'POST':
        event_id = request.POST.get('event_id')
        service_type = request.POST.get('service_type', '')
        message = request.POST.get('message', '')
        event = get_object_or_404(Event, id=event_id)
        Request.objects.create(
            event=event,
            vendor=request.user.vendor_profile,
            message=f"[{service_type}] {message}",
            sent_by='VENDOR'
        )
        messages.success(request, "Application sent!")
    return redirect('vendor_dashboard')


def password_recovery(request):
    User = get_user_model()
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = data.get('action')

            if action == 'send_otp':
                identifier = data.get('identifier')
                user = User.objects.filter(email=identifier).first() or User.objects.filter(username=identifier).first()

                if user:
                    if not user.email:
                         return JsonResponse({'status': 'error', 'message': 'No email address associated with this account.'})
                    otp = str(random.randint(100000, 999999))
                    request.session['recovery_otp'] = otp
                    request.session['recovery_user_id'] = user.id
                    request.session['recovery_otp_time'] = time.time()
                    request.session['recovery_attempts'] = 0

                    try:
                        send_mail(
                            subject="Your Eventia Password Recovery Code",
                            message=f"Your verification code is: {otp}\n\nThis code will expire in 10 minutes.",
                            from_email=None,
                            recipient_list=[user.email],
                            fail_silently=False,
                        )
                        return JsonResponse({'status': 'success'})
                    except Exception as e:
                        return JsonResponse({'status': 'error', 'message': 'Email service failed.'})
                else:
                    return JsonResponse({'status': 'error', 'message': 'No account found.'})

            elif action == 'verify_otp':
                otp_input = data.get('otp')
                session_otp = request.session.get('recovery_otp')
                session_time = request.session.get('recovery_otp_time')
                attempts = request.session.get('recovery_attempts', 0)

                if not session_otp or not session_time:
                     return JsonResponse({'status': 'error', 'message': 'Session expired. Please request a new code.'})
                if attempts >= 3:
                     del request.session['recovery_otp']
                     return JsonResponse({'status': 'error', 'message': 'Too many failed attempts. Request a new code.'})
                if time.time() - session_time > 600:
                     del request.session['recovery_otp']
                     return JsonResponse({'status': 'error', 'message': 'Verification code expired. Request a new code.'})

                if otp_input == session_otp:
                    return JsonResponse({'status': 'success'})
                else:
                    request.session['recovery_attempts'] = attempts + 1
                    return JsonResponse({'status': 'error', 'message': f'Invalid verification code. {3 - attempts - 1} attempts left.'})

            elif action == 'reset_password':
                new_password = data.get('password')
                user_id = request.session.get('recovery_user_id')

                if user_id:
                    user = User.objects.get(id=user_id)
                    try:
                        validate_password(new_password, user)
                    except ValidationError as e:
                        return JsonResponse({'status': 'error', 'message': e.messages[0]})

                    user.set_password(new_password)
                    user.save()

                    for key in ['recovery_otp', 'recovery_user_id', 'recovery_otp_time', 'recovery_attempts']:
                        if key in request.session:
                            del request.session[key]
                    return JsonResponse({'status': 'success'})
                else:
                    return JsonResponse({'status': 'error', 'message': 'Session expired. Please start over.'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred.'})

    return render(request, 'core/password-recovery.html')

@login_required
def update_profile(request):
    if request.method == 'POST':
        user = request.user
        if 'username' in request.POST: user.username = request.POST.get('username')
        if 'email' in request.POST: user.email = request.POST.get('email')
        if 'phone_number' in request.POST: user.phone_number = request.POST.get('phone_number')
        if 'first_name' in request.POST: user.first_name = request.POST.get('first_name')
        if 'last_name' in request.POST: user.last_name = request.POST.get('last_name')

        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']

        password = request.POST.get('password')
        confirm_password = request.POST.get('password_confirm')
        if password and password == confirm_password:
            user.set_password(password)
            update_session_auth_hash(request, user)
        user.save()

        if user.role == 'ORGANIZER':
            profile = user.organizer_profile
            if 'organization_name' in request.POST: profile.organization_name = request.POST.get('organization_name')
            profile.save()
        elif user.role == 'VENDOR':
            profile = user.vendor_profile
            if 'organization_name' in request.POST: profile.organization_name = request.POST.get('organization_name')
            if 'service_type' in request.POST: profile.service_type = request.POST.get('service_type')
            if 'description' in request.POST: profile.description = request.POST.get('description')
            profile.save()
        elif user.role == 'ATTENDEE':
            try: profile = user.attendee_profile
            except AttendeeProfile.DoesNotExist: profile = AttendeeProfile.objects.create(user=user)
            if 'job_title' in request.POST: profile.job_title = request.POST.get('job_title')
            profile.save()

        messages.success(request, "Profile updated successfully!")
        referer = request.META.get('HTTP_REFERER')
        if referer: return redirect(referer)
        return redirect('dashboard')


@login_required
def api_send_message(request):
    data = json.loads(request.body)
    event = Event.objects.get(id=data['event_id'])
    vendor = VendorProfile.objects.get(id=data['vendor_id'])
    msg = Message.objects.create(event=event, vendor=vendor, sender=data['sender'], text=data['text'])
    return JsonResponse({'status': 'ok', 'id': msg.id, 'timestamp': msg.timestamp.isoformat()})

@login_required
def api_update_vendor_status(request):
    data = json.loads(request.body)
    req = Request.objects.get(event_id=data['event_id'], vendor_id=data['vendor_id'])
    req.preparation_status = data['status']
    req.update_requested = False
    req.save()
    VendorStatusUpdate.objects.create(request=req, status=data['status'], note=data['note'], source='vendor')
    return JsonResponse({'status': 'ok'})

@login_required
def api_request_vendor_update(request):
    data = json.loads(request.body)
    req = Request.objects.get(event_id=data['event_id'], vendor_id=data['vendor_id'])
    req.update_requested = True
    req.save()
    return JsonResponse({'status': 'ok'})

@login_required
def api_send_broadcast(request):
    data = json.loads(request.body)
    bc = Broadcast.objects.create(event_id=data['event_id'], message=data['message'])
    return JsonResponse({'status': 'ok', 'timestamp': bc.timestamp.isoformat()})


# --- ORGANIZER DASHBOARD DATA API ---

@login_required
def api_organizer_data(request):
    if request.user.role != 'ORGANIZER': return JsonResponse({'error': 'Unauthorized'}, status=403)
    try: organizer_profile = request.user.organizer_profile
    except OrganizerProfile.DoesNotExist: return JsonResponse({'error': 'No organizer profile'}, status=404)

    today = date.today()
    my_events = Event.objects.filter(organizer=organizer_profile).order_by('-id')

    events_data = []
    for evt in my_events:
        active_count = Ticket.objects.filter(event=evt, status='ACTIVE').count()
        status_label = 'Past' if evt.date < today else ('Rejected' if evt.status == 'REJECTED' else ('Pending' if evt.status == 'PENDING' else 'Upcoming'))
        events_data.append({
            'id': str(evt.id), 'title': evt.title, 'category': evt.category or 'Other',
            'date': evt.date.strftime('%Y-%m-%d'), 'time': evt.time.strftime('%H:%M') if evt.time else '',
            'location': evt.location or '', 'description': evt.description or '',
            'price': str(evt.ticket_price), 'tickets': [{'name': 'Standard', 'price': str(evt.ticket_price)}],
            'status': status_label, 'withdrawalPolicy': evt.withdrawal_policy or 'flexible',
            'attendeeWithdrawalPolicy': evt.attendee_withdrawal_policy or 'flexible',
            'attendees': active_count, 'rejectionReason': evt.rejection_reason or '',
            'banner': evt.banner.url if bool(evt.banner) else None, 'capacity': evt.capacity,
        })

    vendors_data = []
    for v in VendorProfile.objects.select_related('user').all():
        vendors_data.append({
            'id': str(v.id), 'name': v.organization_name or v.user.get_full_name() or v.user.username,
            'category': v.service_type or 'Other', 'location': '', 'rating': 0, 'priceRange': '$$',
            'image': 'fa-briefcase', 'description': v.description or '',
        })

    all_org_requests = Request.objects.filter(event__organizer=organizer_profile).select_related('event', 'vendor', 'vendor__user').order_by('-created_at')

    outgoing_requests_data = []
    for r in all_org_requests.filter(sent_by='ORGANIZER'):
        rejection_reason = ''
        if r.status == 'REJECTED' and '[Rejected]:' in r.message: rejection_reason = r.message.split('[Rejected]:')[-1].strip()
        if r.status == 'REJECTED' and '[Withdrawn]:' in r.message: rejection_reason = 'Withdrawn by Vendor: ' + r.message.split('[Withdrawn]:')[-1].strip()
        outgoing_requests_data.append({
            'id': str(r.id), 'vendorId': str(r.vendor.id), 'eventId': str(r.event.id),
            'status': r.status.capitalize(), 'dateSent': r.created_at.strftime('%Y-%m-%d'),
            'message': r.message, 'rejectionReason': rejection_reason,
        })

    incoming_requests_data = []
    for r in all_org_requests.filter(sent_by='VENDOR'):
        incoming_requests_data.append({
            'id': str(r.id), 'vendorName': r.vendor.organization_name or r.vendor.user.username,
            'vendorEmail': r.vendor.user.email, 'serviceType': r.vendor.service_type,
            'eventId': str(r.event.id), 'status': r.status.capitalize(),
            'dateReceived': r.created_at.strftime('%Y-%m-%d'), 'message': r.message,
        })

    event_vendors_data = []
    for r in all_org_requests.filter(status='APPROVED'):
        history = [{'status': su.status, 'note': su.note, 'timestamp': su.timestamp.isoformat(), 'source': su.source} for su in VendorStatusUpdate.objects.filter(request=r).order_by('timestamp')]
        event_vendors_data.append({
            'eventId': str(r.event.id), 'vendorId': str(r.vendor.id),
            'status': 'Confirmed', 'assignedDate': r.created_at.strftime('%Y-%m-%d'),
            'preparationStatus': r.preparation_status or 'Pending',
            'updateRequested': r.update_requested, 'statusHistory': history,
        })

    messages_data = [{'id': str(m.id), 'eventId': str(m.event.id), 'vendorId': str(m.vendor.id), 'sender': m.sender, 'text': m.text, 'timestamp': m.timestamp.isoformat()} for m in Message.objects.filter(event__in=my_events).order_by('timestamp')]
    broadcasts_data = [{'id': str(b.id), 'eventId': str(b.event.id), 'message': b.message, 'timestamp': b.timestamp.isoformat()} for b in Broadcast.objects.filter(event__in=my_events).order_by('-timestamp')]

    return JsonResponse({'events': events_data, 'vendors': vendors_data, 'outgoingRequests': outgoing_requests_data, 'incomingRequests': incoming_requests_data, 'eventVendors': event_vendors_data, 'messages': messages_data, 'broadcasts': broadcasts_data})


# --- VENDOR DASHBOARD DATA API ---

@login_required
def api_vendor_data(request):
    if request.user.role != 'VENDOR': return JsonResponse({'error': 'Unauthorized'}, status=403)
    try: vendor_profile = request.user.vendor_profile
    except VendorProfile.DoesNotExist: return JsonResponse({'error': 'No vendor profile'}, status=404)

    today = date.today()
    incoming_requests = Request.objects.filter(vendor=vendor_profile, sent_by='ORGANIZER').order_by('-created_at')
    outgoing_requests = Request.objects.filter(vendor=vendor_profile, sent_by='VENDOR').order_by('-created_at')
    approved_requests = Request.objects.filter(vendor=vendor_profile, status='APPROVED')
    all_events = Event.objects.filter(status='APPROVED').order_by('date')
    applied_event_ids = list(Request.objects.filter(vendor=vendor_profile).values_list('event_id', flat=True))

    events_data = [{'id': str(evt.id), 'title': evt.title, 'category': evt.category or 'Other', 'date': evt.date.strftime('%Y-%m-%d'), 'time': evt.time.strftime('%H:%M') if evt.time else 'TBD', 'location': evt.location or 'TBD', 'description': evt.description or '', 'price': str(evt.ticket_price), 'tickets': [{'name': 'Standard', 'price': str(evt.ticket_price)}], 'withdrawalPolicy': evt.withdrawal_policy or '', 'attendees': Ticket.objects.filter(event=evt, status='ACTIVE').count(), 'organizer': evt.organizer.organization_name if evt.organizer else 'Event Organizer'} for evt in all_events]

    invitations_data = [{'id': str(r.id), 'eventId': str(r.event.id), 'vendorId': str(r.vendor.id), 'status': r.get_status_display(), 'message': r.message, 'serviceType': '', 'dateSent': r.created_at.strftime('%Y-%m-%d')} for r in incoming_requests]
    applications_data = [{'id': str(r.id), 'eventId': str(r.event.id), 'vendorId': str(r.vendor.id), 'status': r.get_status_display(), 'message': r.message, 'serviceType': r.message.split(']')[0].replace('[', '') if r.message.startswith('[') else '', 'dateReceived': r.created_at.strftime('%Y-%m-%d')} for r in outgoing_requests]

    event_vendors_data = []
    for r in approved_requests:
        history = [{'status': su.status, 'note': su.note, 'timestamp': su.timestamp.isoformat(), 'source': su.source} for su in VendorStatusUpdate.objects.filter(request=r).order_by('timestamp')]
        event_vendors_data.append({'requestId': str(r.id), 'eventId': str(r.event.id), 'vendorId': str(r.vendor.id), 'status': 'Confirmed', 'preparationStatus': r.preparation_status or 'Pending', 'updateRequested': r.update_requested, 'statusHistory': history})

    messages_list = [{'id': str(m.id), 'eventId': str(m.event.id), 'vendorId': str(m.vendor.id), 'sender': m.sender, 'text': m.text, 'timestamp': m.timestamp.isoformat()} for m in Message.objects.filter(vendor=vendor_profile).order_by('timestamp')]

    return JsonResponse({'events': events_data, 'invitations': invitations_data, 'applications': applications_data, 'eventVendors': event_vendors_data, 'messages': messages_list, 'appliedEventIds': [str(eid) for eid in applied_event_ids], 'stats': {'pendingInvites': incoming_requests.filter(status='PENDING').count(), 'activeEvents': approved_requests.filter(event__date__gte=today).count(), 'completedEvents': approved_requests.filter(event__date__lt=today).count()}})


# --- ORGANIZER ANALYTICS API ---

@login_required
def api_organizer_analytics(request):
    if request.user.role != 'ORGANIZER': return JsonResponse({'error': 'Unauthorized'}, status=403)
    try: organizer_profile = request.user.organizer_profile
    except OrganizerProfile.DoesNotExist: return JsonResponse({'error': 'No organizer profile'}, status=404)

    today = date.today()
    my_events = Event.objects.filter(organizer=organizer_profile)

    events_data = [{'id': str(evt.id), 'title': evt.title, 'category': evt.category or 'Other', 'date': evt.date.strftime('%Y-%m-%d'), 'time': evt.time.strftime('%H:%M') if evt.time else '', 'location': evt.location or '', 'description': evt.description or '', 'price': str(evt.ticket_price), 'tickets': [{'name': 'Standard', 'price': str(evt.ticket_price)}], 'status': 'Past' if evt.date < today else ('Rejected' if evt.status == 'REJECTED' else ('Pending' if evt.status == 'PENDING' else 'Upcoming')), 'withdrawalPolicy': evt.withdrawal_policy or 'flexible', 'attendeeWithdrawalPolicy': evt.attendee_withdrawal_policy or 'flexible', 'attendees': Ticket.objects.filter(event=evt, status='ACTIVE').count(), 'rejectionReason': evt.rejection_reason or ''} for evt in my_events]

    vendors_data = [{'id': str(v.id), 'name': v.organization_name or v.user.get_full_name() or v.user.username, 'category': v.service_type or 'Other', 'location': '', 'rating': 0, 'priceRange': '$$', 'image': 'fa-briefcase', 'description': v.description or ''} for v in VendorProfile.objects.select_related('user').all()]

    event_vendors_data = []
    for req in Request.objects.filter(event__organizer=organizer_profile, status='APPROVED').select_related('event', 'vendor'):
        history = [{'status': su.status, 'note': su.note, 'timestamp': su.timestamp.isoformat(), 'source': su.source} for su in VendorStatusUpdate.objects.filter(request=req).order_by('timestamp')]
        event_vendors_data.append({'eventId': str(req.event.id), 'vendorId': str(req.vendor.id), 'status': 'Confirmed', 'assignedDate': req.created_at.strftime('%Y-%m-%d'), 'preparationStatus': req.preparation_status or 'Pending', 'updateRequested': req.update_requested, 'statusHistory': history})

    for req in Request.objects.filter(event__organizer=organizer_profile, status='PENDING').select_related('event', 'vendor'): event_vendors_data.append({'eventId': str(req.event.id), 'vendorId': str(req.vendor.id), 'status': 'Pending', 'assignedDate': req.created_at.strftime('%Y-%m-%d')})
    for req in Request.objects.filter(event__organizer=organizer_profile, status='REJECTED').select_related('event', 'vendor'): event_vendors_data.append({'eventId': str(req.event.id), 'vendorId': str(req.vendor.id), 'status': 'Declined', 'assignedDate': req.created_at.strftime('%Y-%m-%d')})

    requests_data = []
    for req in Request.objects.filter(event__organizer=organizer_profile).select_related('event', 'vendor').order_by('-created_at'):
        rejection_reason = ''
        if req.status == 'REJECTED' and '[Rejected]:' in req.message: rejection_reason = req.message.split('[Rejected]:')[-1].strip()
        if req.status == 'REJECTED' and '[Withdrawn]:' in req.message: rejection_reason = 'Withdrawn by Vendor: ' + req.message.split('[Withdrawn]:')[-1].strip()
        requests_data.append({'id': str(req.id), 'vendorId': str(req.vendor.id), 'eventId': str(req.event.id), 'status': req.status.capitalize(), 'dateSent': req.created_at.strftime('%Y-%m-%d'), 'message': req.message, 'rejectionReason': rejection_reason})

    registrations_data = []
    for t in Ticket.objects.filter(event__organizer=organizer_profile).select_related('attendee', 'event'):
        birthday = ''
        try:
            if t.attendee.attendee_profile.date_of_birth: birthday = t.attendee.attendee_profile.date_of_birth.strftime('%Y-%m-%d')
        except AttendeeProfile.DoesNotExist: pass
        reg_entry = {'id': str(t.id), 'eventId': str(t.event.id), 'name': t.attendee.get_full_name() or t.attendee.username, 'birthday': birthday, 'ticketType': t.ticket_type or 'Standard', 'ticketPrice': str(t.amount_paid), 'registeredDate': t.purchase_date.strftime('%Y-%m-%d'), 'status': 'Active' if t.status == 'ACTIVE' else 'Withdrawn', 'withdrawnDate': ''}
        if t.rating is not None: reg_entry['satisfactionScore'] = t.rating
        registrations_data.append(reg_entry)

    messages_data = [{'id': str(m.id), 'eventId': str(m.event.id), 'vendorId': str(m.vendor.id), 'sender': m.sender, 'text': m.text, 'timestamp': m.timestamp.isoformat()} for m in Message.objects.filter(event__organizer=organizer_profile).select_related('event', 'vendor').order_by('timestamp')]
    broadcasts_data = [{'id': str(b.id), 'eventId': str(b.event.id), 'message': b.message, 'timestamp': b.timestamp.isoformat()} for b in Broadcast.objects.filter(event__organizer=organizer_profile).select_related('event').order_by('-timestamp')]

    return JsonResponse({'events': events_data, 'vendors': vendors_data, 'eventVendors': event_vendors_data, 'requests': requests_data, 'registrations': registrations_data, 'messages': messages_data, 'broadcasts': broadcasts_data})


# --- NEW: GEMINI AI ASSISTANT ---

_gemini_configured = False

def _ensure_gemini_configured():
    global _gemini_configured
    if not _gemini_configured and getattr(settings, 'GEMINI_API_KEY', None):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        _gemini_configured = True

# Cache key for the events context string
_EVENTS_CACHE_KEY = 'ai_events_context_v1'
_EVENTS_CACHE_TTL = 300  # 5 minutes


# ── CACHE INVALIDATION SIGNAL ─────────────────────────────────────────────────
# Whenever any Event is saved (approved, created, edited) the cache is cleared
# automatically so the AI always sees fresh data without waiting 5 minutes.
@receiver(post_save, sender=Event)
def invalidate_events_cache(sender, **kwargs):
    cache.delete(_EVENTS_CACHE_KEY)


def _build_events_context():
    """
    Builds the event context string for the system prompt.
    Called only on a cache miss (first request, or after an event changes).
    """
    approved_vendors_prefetch = Prefetch(
        'requests',
        queryset=Request.objects.filter(status='APPROVED').select_related('vendor', 'vendor__user'),
        to_attr='prefetched_vendors'
    )

    events = (
        Event.objects
        .filter(status='APPROVED')
        .select_related('organizer')
        .prefetch_related(approved_vendors_prefetch)
        # Only pull the columns we actually use — skips banner, rejection_reason, etc.
        .only(
            'id', 'title', 'category', 'date', 'time', 'location',
            'ticket_price', 'capacity', 'age_restriction', 'description',
            'organizer__organization_name',
        )
    )

    events_info = []
    for evt in events:
        price_str = "Free" if evt.ticket_price == 0 else f"{evt.ticket_price} SAR"
        desc = (evt.description or "").replace("\n", " ").replace('"', "'")[:300]
        org_name = evt.organizer.organization_name if evt.organizer else "Unknown Organizer"
        vendor_names = [
            r.vendor.organization_name or r.vendor.user.get_full_name() or r.vendor.user.username
            for r in evt.prefetched_vendors
        ]
        vendors_str = ", ".join(vendor_names) if vendor_names else "None listed"
        age = f"{evt.age_restriction}+" if evt.age_restriction else "All ages"

        events_info.append(
            f"[ID:{evt.id}] \"{evt.title}\" | Category:{evt.category} | "
            f"Date:{evt.date} {evt.time} | Location:{evt.location} | "
            f"Price:{price_str} | Capacity:{evt.capacity} | Age:{age} | "
            f"Organizer:{org_name} | Vendors:{vendors_str} | "
            f"About:{desc}"
        )

    return "\n".join(events_info) if events_info else "No approved events available right now."


# --- NEW: GEMINI AI ASSISTANT ---

@csrf_exempt
def ai_assistant_chat(request):
    """Handles chat requests by forwarding them to the Gemini API."""
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method. Expected POST.'}, status=405)

    # ── Fast input validation FIRST (before any DB or API work) ────────────────
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body.'}, status=400)

    user_message = data.get('message', '').strip()
    frontend_history = data.get('history', [])

    if not user_message:
        return JsonResponse({'error': 'Message is required'}, status=400)

    if not getattr(settings, 'GEMINI_API_KEY', None):
        return JsonResponse({'error': 'Gemini API key is not configured.'}, status=500)

    try:
        # ── 1. CONFIGURE GEMINI (once per process, not per request) ────────────
        _ensure_gemini_configured()

        # ── 2. BUILD EVENT CONTEXT (cached — DB hit only on cache miss) ────────
        events_context = cache.get(_EVENTS_CACHE_KEY)
        if events_context is None:
            events_context = _build_events_context()
            cache.set(_EVENTS_CACHE_KEY, events_context, _EVENTS_CACHE_TTL)

        # ── 3. USER CONTEXT ────────────────────────────────────────────────────
        if request.user.is_authenticated:
          name = request.user.first_name or request.user.username
          role = request.user.role

          if role == 'ATTENDEE':
              registered_ids = list(
                  Ticket.objects.filter(attendee=request.user, status='ACTIVE')
                  .values_list('event_id', flat=True)
              )
              registered_str = ", ".join(str(i) for i in registered_ids) if registered_ids else "none"
              user_context = (
                  f"User is logged in as {role} '{name}'. "
                  f"They are already registered for event IDs: [{registered_str}]. "
                  f"When they ask for events they are NOT registered in, EXCLUDE those IDs from event_ids and do not mention them."
              )
          else:
              user_context = f"User is logged in as {role} '{name}'."
        else:
            user_context = "User is browsing as a guest."


        # ── 4. SYSTEM INSTRUCTION (unchanged — exact same prompt as before) ────
        system_instruction = f"""You are the Eventia AI Assistant — a smart, friendly, human-like event guide built into the Eventia platform.

=== LIVE EVENT DATABASE ===
{events_context}

=== USER CONTEXT ===
{user_context}

=== YOUR RULES ===
RULE 1 – BE HUMAN FIRST:
  - Greetings ("hey", "hi", "hello", "how are you", "what's up", etc.) get a warm, natural reply.
  - Example: "Hey there! 👋 I'm your Eventia AI — here to help you find the perfect event. What are you in the mood for?"
  - NEVER say "I couldn't find events matching that" for a greeting.
  - NEVER dump event cards for a casual greeting.

RULE 2 – ANSWER PRECISELY:
  - "Who organized X?" → give the Organizer name only. Be concise.
  - "What vendors are at X?" → list the vendors for that event only.
  - "Describe X" → summarize the description in 2–3 sentences, naturally.
  - "Price of X?" → state the price. That's it. Don't list the whole event.
  - "Free events?" → list only events where Price is Free.
  - "Find me a tech event" → recommend relevant events with cards.
  - Answer what was ASKED. Don't add unsolicited info.

RULE 3 – USE CONVERSATION HISTORY:
  - You can see previous messages in this conversation. Use them for context.
  - If the user said "tell me more" you know what they were talking about.

RULE 4 – JSON OUTPUT ONLY:
  Always respond with ONLY a single JSON object, no markdown, no extra text:
  {{"reply": "your response here", "event_ids": []}}

RULE 5 – EVENT CARDS (event_ids):
  - Put integer event IDs in event_ids ONLY when you are recommending or listing events for the user to browse.
  - For greetings, single-fact questions (price, organizer, vendor check), or general chat → event_ids must be [].
  - For "show me events" / "find me X events" type queries → include the relevant IDs.

RULE 6 – HONESTY:
  - If something isn't in the database, say so. Don't invent vendors, organizers, or events.
  - NEVER use the word "database" in your replies. Say "our listings", "what we have", or "our events" instead.
  - NEVER mention event IDs or REF numbers in your replies. They are internal references only.

FORMATTING: Use <strong>, <em>, <br> inside "reply" for emphasis when it helps clarity."""

        # ── 5. CONVERT FRONTEND HISTORY TO GEMINI FORMAT ───────────────────────
        gemini_history = []
        recent = frontend_history[-6:]
        for msg in recent:
            role = 'user' if msg.get('role') == 'user' else 'model'
            text = msg.get('text', '').strip()
            if text:
                gemini_history.append({"role": role, "parts": [text]})

        # ── 6. CALL GEMINI ─────────────────────────────────────────────────────
        model = genai.GenerativeModel(
            'gemini-3.1-flash-lite',
            system_instruction=system_instruction,
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 2.0,
                "max_output_tokens": 300,
            }
        )

        chat_session = model.start_chat(history=gemini_history)
        response = chat_session.send_message(user_message)

        # ── 7. PARSE RESPONSE ──────────────────────────────────────────────────
        raw_text = response.text.strip()
        if raw_text.startswith('```'):
            raw_text = raw_text.split('\n', 1)[-1].rsplit('```', 1)[0].strip()

        response_data = json.loads(raw_text)

        if 'reply' not in response_data:
            response_data['reply'] = "I'm not sure how to answer that. Try asking about a specific event!"
        if 'event_ids' not in response_data:
            response_data['event_ids'] = []

        return JsonResponse(response_data)

    except json.JSONDecodeError as e:
        print(f"AI JSON Parse Error: {e} | Raw: {raw_text if 'raw_text' in dir() else 'N/A'}")
        return JsonResponse({'reply': "I ran into a small hiccup — please try again!", 'event_ids': []})
    except Exception as e:
        print(f"AI Assistant Error: {e}")
        return JsonResponse({'error': 'An internal error occurred.'}, status=500)