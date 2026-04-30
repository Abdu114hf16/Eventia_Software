from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, get_user_model
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib import messages
from datetime import date
from django.db.models import Count, Sum, Avg, Q, F
from .forms import SignUpForm
from .models import Event, OrganizerProfile, VendorProfile, Request, CustomUser, Ticket, AttendeeProfile, Broadcast, Message, VendorStatusUpdate
import json
import random
import time
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse
from django.core.mail import send_mail


# --- GENERAL NAVIGATION & AUTH ---

def dashboard_view(request):
    """Redirects users to their specific dashboard based on role."""
    if request.user.is_authenticated:
        if request.user.role == 'ORGANIZER':
            return redirect('organizer_dashboard')
        elif request.user.role == 'VENDOR':
            return redirect('vendor_dashboard')
        elif request.user.role == 'SCEGA_ADMIN':
            return redirect('scega_dashboard')
        elif request.user.role == 'ATTENDEE':
            return redirect('attendee_dashboard')

    # Default for guests: Show Homepage
    events = Event.objects.filter(status='APPROVED').order_by('date')
    return render(request, 'core/index.html', {'events': events})

def landing_page(request):
    """Renders the landing page (index.html) without redirection."""
    events = Event.objects.filter(status='APPROVED').order_by('date')
    return render(request, 'core/index.html', {'events': events})

def logout_view(request):
    logout(request)
    return redirect('home')


# --- ATTENDEE VIEWS ---

def signup_attendee(request):
    if request.method == 'POST':
        # FORCE role to be ATTENDEE regardless of form tampering
        data = request.POST.copy()
        data['role'] = 'ATTENDEE'

        # Date logic construction
        day = data.get('day')
        month = data.get('month')
        year = data.get('year')
        if day and month and year:
            data['date_of_birth'] = f"{year}-{month}-{day}"

        form = SignUpForm(data)
        if form.is_valid():
            user = form.save()
            # Double check role is saved
            if user.role != 'ATTENDEE':
                user.role = 'ATTENDEE'
                user.save()

            login(request, user)
            return redirect('attendee_dashboard')
        else:
            print("ATTENDEE SIGNUP ERRORS:", form.errors)
            messages.error(request, f"Validation Failed: {form.errors}")
    else:
        form = SignUpForm()
    return render(request, 'core/signup.html', {'form': form})


def login_attendee(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()

            # Prevent non-attendees from logging in here
            if user.role != 'ATTENDEE':
                messages.error(request, "Access Denied. Organizers and Vendors must use the Business Login page.")
                return render(request, 'core/login.html', {'form': form})

            # If they are an attendee, log them in
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

    # Get events and tickets
    all_events = Event.objects.filter(status='APPROVED').order_by('date')
    user_tickets = Ticket.objects.filter(attendee=request.user).select_related('event')
    ticket_map = {t.event.id: t for t in user_tickets}
    registered_event_ids = list(ticket_map.keys())

    # Get broadcasts (Safely)
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


# Legacy fallback so urls.py doesn't crash
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
            print("BUSINESS SIGNUP ERRORS:", form.errors)
            messages.error(request, f"Validation Failed: {form.errors}")
    else:
        form = SignUpForm()
    return render(request, 'core/signup-business.html', {'form': form})


def login_business(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()

            # Prevent attendees (or SCEGA admins) from logging in here
            if user.role not in ['ORGANIZER', 'VENDOR']:
                messages.error(request, "Access Denied. Attendees must use the standard login page.")
                return render(request, 'core/login-business.html', {'form': form})

            # Log them in and redirect based on their specific business role
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

    # 1. Initialize variables with default empty values
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

        # Fetch QuerySets
        incoming_requests = Request.objects.filter(vendor=vendor_profile, sent_by='ORGANIZER').order_by('-created_at')
        outgoing_requests = Request.objects.filter(vendor=vendor_profile, sent_by='VENDOR').order_by('-created_at')
        approved_requests = Request.objects.filter(vendor=vendor_profile, status='APPROVED')

        # Stats
        pending_invitations_count = incoming_requests.filter(status='PENDING').count()
        active_events_count = approved_requests.filter(event__date__gte=today).count()
        completed_events_count = approved_requests.filter(event__date__lt=today).count()

        # Lists for template
        my_events = approved_requests.order_by('event__date')
        all_upcoming_events = Event.objects.filter(status='APPROVED').order_by('date')
        applied_event_ids = list(incoming_requests.values_list('event_id', flat=True)) + \
                            list(outgoing_requests.values_list('event_id', flat=True))

        # JSON Data for JS Modals
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

    # 2. Build Context using the variables defined above
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
            # Handle Vendor Request Creation
            if request.POST.get('create_request') == 'true':
                vendor_id = request.POST.get('vendor_id')
                event_id = request.POST.get('event_id')
                message = request.POST.get('message')

                vendor = get_object_or_404(VendorProfile, id=vendor_id)
                event = get_object_or_404(Event, id=event_id, organizer=request.user.organizer_profile)

                # Check if request already exists
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

            # Handle Event Creation/Update
            event_id = request.POST.get('event_id')
            banner_file = request.FILES.get('banner')  # <-- GET THE UPLOADED FILE

            if event_id:
                # Update Logic
                event = get_object_or_404(Event, id=event_id, organizer=request.user.organizer_profile)
                event.title = request.POST.get('title')
                event.category = request.POST.get('category')
                event.date = request.POST.get('date')
                event.time = request.POST.get('time')
                event.location = request.POST.get('location')
                event.description = request.POST.get('description')
                event.capacity = request.POST.get('capacity')
                event.ticket_price = request.POST.get('ticket_price', 0)
                event.withdrawal_policy = request.POST.get('withdrawal_policy', '')
                event.attendee_withdrawal_policy = request.POST.get('attendee_withdrawal_policy', '')

                # <-- UPDATE BANNER ONLY IF A NEW ONE IS UPLOADED
                if banner_file:
                    event.banner = banner_file

                event.status = 'PENDING'
                event.save()
                messages.success(request, "Event updated successfully!")
            else:
                # Create Logic
                Event.objects.create(
                    organizer=request.user.organizer_profile,
                    title=request.POST.get('title'),
                    category=request.POST.get('category'),
                    date=request.POST.get('date'),
                    time=request.POST.get('time'),
                    location=request.POST.get('location'),
                    description=request.POST.get('description'),
                    capacity=request.POST.get('capacity'),
                    ticket_price=request.POST.get('ticket_price', 0),
                    withdrawal_policy=request.POST.get('withdrawal_policy', ''),
                    attendee_withdrawal_policy=request.POST.get('attendee_withdrawal_policy', ''),
                    banner=banner_file,  # <-- SAVE BANNER ON CREATION
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

    context = {
        'events': my_events, 'vendors': vendors,
        'outgoing_requests': outgoing_requests, 'incoming_requests': incoming_requests,
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
            <li><strong>Length of Role:</strong> {len(request.user.role)}</li>
        </ul>
        <p>If "Is ATTENDEE" is False, the redirect will fail.</p>
    """)


def event_details(request, event_id):
    """Renders the details page for a specific event."""
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

        # Enforce Withdrawal Policy on the Backend
        days_until = (event.date - date.today()).days
        policy = event.withdrawal_policy

        allowed = True
        if policy == 'non-refundable':
            allowed = False
        elif policy == 'strict' and days_until < 30:
            allowed = False
        elif policy == 'moderate' and days_until < 14:
            allowed = False
        elif policy == 'flexible' and days_until < 7:
            allowed = False

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

           # --- STEP 1: Find User & Send OTP ---
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
                        print(f"Resend Error: {e}")
                        return JsonResponse({'status': 'error', 'message': 'Email service failed.'})
                else:
                    return JsonResponse({'status': 'error', 'message': 'No account found.'})

            # --- STEP 2: Verify OTP ---
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

            # --- STEP 3: Reset Password ---
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
            print(f"Password recovery error: {e}")
            return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred.'})

    return render(request, 'core/password-recovery.html')

@login_required
def update_profile(request):
    if request.method == 'POST':
        user = request.user

        if 'username' in request.POST:
            user.username = request.POST.get('username')
        if 'email' in request.POST:
            user.email = request.POST.get('email')
        if 'phone_number' in request.POST:
            user.phone_number = request.POST.get('phone_number')
        if 'first_name' in request.POST:
            user.first_name = request.POST.get('first_name')
        if 'last_name' in request.POST:
            user.last_name = request.POST.get('last_name')

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
            if 'organization_name' in request.POST:
                profile.organization_name = request.POST.get('organization_name')
            profile.save()

        elif user.role == 'VENDOR':
            profile = user.vendor_profile
            if 'organization_name' in request.POST:
                profile.organization_name = request.POST.get('organization_name')
            if 'service_type' in request.POST:
                profile.service_type = request.POST.get('service_type')
            if 'description' in request.POST:
                profile.description = request.POST.get('description')
            profile.save()

        elif user.role == 'ATTENDEE':
            try:
                profile = user.attendee_profile
            except AttendeeProfile.DoesNotExist:
                profile = AttendeeProfile.objects.create(user=user)

            if 'job_title' in request.POST:
                profile.job_title = request.POST.get('job_title')
            profile.save()

        messages.success(request, "Profile updated successfully!")
        referer = request.META.get('HTTP_REFERER')
        if referer:
            return redirect(referer)
        return redirect('dashboard')


@login_required
def api_send_message(request):
    data = json.loads(request.body)
    event = Event.objects.get(id=data['event_id'])
    vendor = VendorProfile.objects.get(id=data['vendor_id'])
    msg = Message.objects.create(
        event=event, vendor=vendor, sender=data['sender'], text=data['text']
    )
    return JsonResponse({'status': 'ok', 'id': msg.id, 'timestamp': msg.timestamp.isoformat()})

@login_required
def api_update_vendor_status(request):
    data = json.loads(request.body)
    req = Request.objects.get(event_id=data['event_id'], vendor_id=data['vendor_id'])
    req.preparation_status = data['status']
    req.update_requested = False
    req.save()
    VendorStatusUpdate.objects.create(
        request=req, status=data['status'], note=data['note'], source='vendor'
    )
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
    """Returns all dashboard data for the organizer, replacing localStorage."""
    if request.user.role != 'ORGANIZER':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    try:
        organizer_profile = request.user.organizer_profile
    except OrganizerProfile.DoesNotExist:
        return JsonResponse({'error': 'No organizer profile'}, status=404)

    today = date.today()
    my_events = Event.objects.filter(organizer=organizer_profile).order_by('-id')

    # --- EVENTS ---
    events_data = []
    for evt in my_events:
        active_count = Ticket.objects.filter(event=evt, status='ACTIVE').count()
        status_label = 'Past' if evt.date < today else (
            'Rejected' if evt.status == 'REJECTED' else (
            'Pending' if evt.status == 'PENDING' else 'Upcoming'))

        events_data.append({
            'id': str(evt.id),
            'title': evt.title,
            'category': evt.category or 'Other',
            'date': evt.date.strftime('%Y-%m-%d'),
            'time': evt.time.strftime('%H:%M') if evt.time else '',
            'location': evt.location or '',
            'description': evt.description or '',
            'price': str(evt.ticket_price),
            'tickets': [{'name': 'Standard', 'price': str(evt.ticket_price)}],
            'status': status_label,
            'withdrawalPolicy': evt.withdrawal_policy or 'flexible',
            'attendeeWithdrawalPolicy': evt.attendee_withdrawal_policy or 'flexible',
            'attendees': active_count,
            'rejectionReason': evt.rejection_reason or '',
            'banner': evt.banner.url if bool(evt.banner) else None,
            'capacity': evt.capacity,
        })

    # --- VENDORS ---
    vendors_data = []
    all_vendors = VendorProfile.objects.select_related('user').all()
    for v in all_vendors:
        vendors_data.append({
            'id': str(v.id),
            'name': v.organization_name or v.user.get_full_name() or v.user.username,
            'category': v.service_type or 'Other',
            'location': '',
            'rating': 0,
            'priceRange': '$$',
            'image': 'fa-briefcase',
            'description': v.description or '',
        })

    # --- OUTGOING REQUESTS ---
    all_org_requests = Request.objects.filter(
        event__organizer=organizer_profile
    ).select_related('event', 'vendor', 'vendor__user').order_by('-created_at')

    outgoing_requests_data = []
    for r in all_org_requests.filter(sent_by='ORGANIZER'):
        rejection_reason = ''
        if r.status == 'REJECTED' and '[Rejected]:' in r.message:
            parts = r.message.split('[Rejected]:')
            if len(parts) > 1:
                rejection_reason = parts[-1].strip()
        if r.status == 'REJECTED' and '[Withdrawn]:' in r.message:
            parts = r.message.split('[Withdrawn]:')
            if len(parts) > 1:
                rejection_reason = 'Withdrawn by Vendor: ' + parts[-1].strip()
        outgoing_requests_data.append({
            'id': str(r.id), 'vendorId': str(r.vendor.id), 'eventId': str(r.event.id),
            'status': r.status.capitalize(), 'dateSent': r.created_at.strftime('%Y-%m-%d'),
            'message': r.message, 'rejectionReason': rejection_reason,
        })

    # --- INCOMING REQUESTS ---
    incoming_requests_data = []
    for r in all_org_requests.filter(sent_by='VENDOR'):
        incoming_requests_data.append({
            'id': str(r.id), 'vendorName': r.vendor.organization_name or r.vendor.user.username,
            'vendorEmail': r.vendor.user.email, 'serviceType': r.vendor.service_type,
            'eventId': str(r.event.id), 'status': r.status.capitalize(),
            'dateReceived': r.created_at.strftime('%Y-%m-%d'), 'message': r.message,
        })

    # --- EVENT-VENDOR ASSIGNMENTS ---
    event_vendors_data = []
    for r in all_org_requests.filter(status='APPROVED'):
        history = [{
            'status': su.status, 'note': su.note,
            'timestamp': su.timestamp.isoformat(), 'source': su.source
        } for su in VendorStatusUpdate.objects.filter(request=r).order_by('timestamp')]
        event_vendors_data.append({
            'eventId': str(r.event.id), 'vendorId': str(r.vendor.id),
            'status': 'Confirmed', 'assignedDate': r.created_at.strftime('%Y-%m-%d'),
            'preparationStatus': r.preparation_status or 'Pending',
            'updateRequested': r.update_requested, 'statusHistory': history,
        })

    # --- MESSAGES ---
    messages_data = [{
        'id': str(m.id), 'eventId': str(m.event.id), 'vendorId': str(m.vendor.id),
        'sender': m.sender, 'text': m.text, 'timestamp': m.timestamp.isoformat()
    } for m in Message.objects.filter(event__in=my_events).order_by('timestamp')]

    # --- BROADCASTS ---
    broadcasts_data = [{
        'id': str(b.id), 'eventId': str(b.event.id),
        'message': b.message, 'timestamp': b.timestamp.isoformat()
    } for b in Broadcast.objects.filter(event__in=my_events).order_by('-timestamp')]

    return JsonResponse({
        'events': events_data,
        'vendors': vendors_data,
        'outgoingRequests': outgoing_requests_data,
        'incomingRequests': incoming_requests_data,
        'eventVendors': event_vendors_data,
        'messages': messages_data,
        'broadcasts': broadcasts_data,
    })


# --- VENDOR DASHBOARD DATA API ---

@login_required
def api_vendor_data(request):
    """Returns all dashboard data for the vendor, replacing localStorage."""
    if request.user.role != 'VENDOR':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    try:
        vendor_profile = request.user.vendor_profile
    except VendorProfile.DoesNotExist:
        return JsonResponse({'error': 'No vendor profile'}, status=404)

    today = date.today()

    # Incoming requests (sent by organizer TO this vendor)
    incoming_requests = Request.objects.filter(vendor=vendor_profile, sent_by='ORGANIZER').order_by('-created_at')
    # Outgoing requests (sent by this vendor TO organizer)
    outgoing_requests = Request.objects.filter(vendor=vendor_profile, sent_by='VENDOR').order_by('-created_at')
    # Approved requests (from either side)
    approved_requests = Request.objects.filter(vendor=vendor_profile, status='APPROVED')

    # All upcoming events for browsing
    all_events = Event.objects.filter(status='APPROVED').order_by('date')

    # Already applied event IDs
    applied_event_ids = list(
        Request.objects.filter(vendor=vendor_profile).values_list('event_id', flat=True)
    )

    # Build events data
    events_data = []
    for evt in all_events:
        events_data.append({
            'id': str(evt.id),
            'title': evt.title,
            'category': evt.category or 'Other',
            'date': evt.date.strftime('%Y-%m-%d'),
            'time': evt.time.strftime('%H:%M') if evt.time else 'TBD',
            'location': evt.location or 'TBD',
            'description': evt.description or '',
            'price': str(evt.ticket_price),
            'tickets': [{'name': 'Standard', 'price': str(evt.ticket_price)}],
            'withdrawalPolicy': evt.withdrawal_policy or '',
            'attendees': Ticket.objects.filter(event=evt, status='ACTIVE').count(),
            'organizer': evt.organizer.organization_name if evt.organizer else 'Event Organizer',
        })

    # Build invitations (organizer -> vendor)
    invitations_data = []
    for r in incoming_requests:
        invitations_data.append({
            'id': str(r.id),
            'eventId': str(r.event.id),
            'vendorId': str(r.vendor.id),
            'status': r.get_status_display(),
            'message': r.message,
            'serviceType': '',
            'dateSent': r.created_at.strftime('%Y-%m-%d'),
        })

    # Build applications (vendor -> organizer)
    applications_data = []
    for r in outgoing_requests:
        applications_data.append({
            'id': str(r.id),
            'eventId': str(r.event.id),
            'vendorId': str(r.vendor.id),
            'status': r.get_status_display(),
            'message': r.message,
            'serviceType': r.message.split(']')[0].replace('[', '') if r.message.startswith('[') else '',
            'dateReceived': r.created_at.strftime('%Y-%m-%d'),
        })

    # Build approved event-vendor data (for event management)
    event_vendors_data = []
    for r in approved_requests:
        history = [{
            'status': su.status, 'note': su.note,
            'timestamp': su.timestamp.isoformat(), 'source': su.source
        } for su in VendorStatusUpdate.objects.filter(request=r).order_by('timestamp')]
        event_vendors_data.append({
            'requestId': str(r.id),
            'eventId': str(r.event.id),
            'vendorId': str(r.vendor.id),
            'status': 'Confirmed',
            'preparationStatus': r.preparation_status or 'Pending',
            'updateRequested': r.update_requested,
            'statusHistory': history,
        })

    # Messages
    messages_list = [{
        'id': str(m.id),
        'eventId': str(m.event.id),
        'vendorId': str(m.vendor.id),
        'sender': m.sender,
        'text': m.text,
        'timestamp': m.timestamp.isoformat()
    } for m in Message.objects.filter(vendor=vendor_profile).order_by('timestamp')]

    return JsonResponse({
        'events': events_data,
        'invitations': invitations_data,
        'applications': applications_data,
        'eventVendors': event_vendors_data,
        'messages': messages_list,
        'appliedEventIds': [str(eid) for eid in applied_event_ids],
        'stats': {
            'pendingInvites': incoming_requests.filter(status='PENDING').count(),
            'activeEvents': approved_requests.filter(event__date__gte=today).count(),
            'completedEvents': approved_requests.filter(event__date__lt=today).count(),
        }
    })


# --- ORGANIZER ANALYTICS API ---

@login_required
def api_organizer_analytics(request):
    """Returns all analytics data for the logged-in organizer, matching
    the shape that organizer-analytics.js expects from loadData()."""
    if request.user.role != 'ORGANIZER':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    try:
        organizer_profile = request.user.organizer_profile
    except OrganizerProfile.DoesNotExist:
        return JsonResponse({'error': 'No organizer profile'}, status=404)

    today = date.today()
    my_events = Event.objects.filter(organizer=organizer_profile)

    # --- EVENTS ---
    events_data = []
    for evt in my_events:
        active_tickets = Ticket.objects.filter(event=evt, status='ACTIVE').count()
        status_label = 'Past' if evt.date < today else (
            'Rejected' if evt.status == 'REJECTED' else (
            'Pending' if evt.status == 'PENDING' else 'Upcoming'))

        events_data.append({
            'id': str(evt.id),
            'title': evt.title,
            'category': evt.category or 'Other',
            'date': evt.date.strftime('%Y-%m-%d'),
            'time': evt.time.strftime('%H:%M') if evt.time else '',
            'location': evt.location or '',
            'description': evt.description or '',
            'price': str(evt.ticket_price),
            'tickets': [{'name': 'Standard', 'price': str(evt.ticket_price)}],
            'status': status_label,
            'withdrawalPolicy': evt.withdrawal_policy or 'flexible',
            'attendeeWithdrawalPolicy': evt.attendee_withdrawal_policy or 'flexible',
            'attendees': active_tickets,
            'rejectionReason': evt.rejection_reason or '',
        })

    # --- VENDORS ---
    vendors_data = []
    all_vendors = VendorProfile.objects.select_related('user').all()
    for v in all_vendors:
        vendors_data.append({
            'id': str(v.id),
            'name': v.organization_name or v.user.get_full_name() or v.user.username,
            'category': v.service_type or 'Other',
            'location': '',
            'rating': 0,
            'priceRange': '$$',
            'image': 'fa-briefcase',
            'description': v.description or '',
        })

    # --- EVENT-VENDOR ASSIGNMENTS (approved requests) ---
    event_vendors_data = []
    approved_requests = Request.objects.filter(
        event__organizer=organizer_profile, status='APPROVED'
    ).select_related('event', 'vendor')
    for req in approved_requests:
        status_updates = VendorStatusUpdate.objects.filter(
            request=req
        ).order_by('timestamp')

        history = []
        for su in status_updates:
            history.append({
                'status': su.status,
                'note': su.note,
                'timestamp': su.timestamp.isoformat(),
                'source': su.source,
            })

        event_vendors_data.append({
            'eventId': str(req.event.id),
            'vendorId': str(req.vendor.id),
            'status': 'Confirmed',
            'assignedDate': req.created_at.strftime('%Y-%m-%d'),
            'preparationStatus': req.preparation_status or 'Pending',
            'updateRequested': req.update_requested,
            'statusHistory': history,
        })

    # Also include pending requests as "Pending" assignments
    pending_requests = Request.objects.filter(
        event__organizer=organizer_profile, status='PENDING'
    ).select_related('event', 'vendor')
    for req in pending_requests:
        event_vendors_data.append({
            'eventId': str(req.event.id),
            'vendorId': str(req.vendor.id),
            'status': 'Pending',
            'assignedDate': req.created_at.strftime('%Y-%m-%d'),
        })

    # Declined/rejected requests
    rejected_requests = Request.objects.filter(
        event__organizer=organizer_profile, status='REJECTED'
    ).select_related('event', 'vendor')
    for req in rejected_requests:
        event_vendors_data.append({
            'eventId': str(req.event.id),
            'vendorId': str(req.vendor.id),
            'status': 'Declined',
            'assignedDate': req.created_at.strftime('%Y-%m-%d'),
        })

    # --- REQUESTS (outgoing + incoming) ---
    all_requests = Request.objects.filter(
        event__organizer=organizer_profile
    ).select_related('event', 'vendor').order_by('-created_at')
    requests_data = []
    for req in all_requests:
        rejection_reason = ''
        if req.status == 'REJECTED' and '[Rejected]:' in req.message:
            parts = req.message.split('[Rejected]:')
            if len(parts) > 1:
                rejection_reason = parts[-1].strip()
        if req.status == 'REJECTED' and '[Withdrawn]:' in req.message:
            parts = req.message.split('[Withdrawn]:')
            if len(parts) > 1:
                rejection_reason = 'Withdrawn by Vendor: ' + parts[-1].strip()

        requests_data.append({
            'id': str(req.id),
            'vendorId': str(req.vendor.id),
            'eventId': str(req.event.id),
            'status': req.status.capitalize(),
            'dateSent': req.created_at.strftime('%Y-%m-%d'),
            'message': req.message,
            'rejectionReason': rejection_reason,
        })

    # --- REGISTRATIONS (all tickets across organizer's events) ---
    registrations_data = []
    all_tickets = Ticket.objects.filter(
        event__organizer=organizer_profile
    ).select_related('attendee', 'event')

    for t in all_tickets:
        # Get attendee birthday from profile
        birthday = ''
        try:
            profile = t.attendee.attendee_profile
            if profile.date_of_birth:
                birthday = profile.date_of_birth.strftime('%Y-%m-%d')
        except AttendeeProfile.DoesNotExist:
            pass

        attendee_name = t.attendee.get_full_name() or t.attendee.username

        reg_entry = {
            'id': str(t.id),
            'eventId': str(t.event.id),
            'name': attendee_name,
            'birthday': birthday,
            'ticketType': t.ticket_type or 'Standard',
            'ticketPrice': str(t.amount_paid),
            'registeredDate': t.purchase_date.strftime('%Y-%m-%d'),
            'status': 'Active' if t.status == 'ACTIVE' else 'Withdrawn',
        }

        if t.rating is not None:
            reg_entry['satisfactionScore'] = t.rating

        reg_entry['withdrawnDate'] = ''

        registrations_data.append(reg_entry)

    # --- MESSAGES ---
    messages_list = Message.objects.filter(
        event__organizer=organizer_profile
    ).select_related('event', 'vendor').order_by('timestamp')
    messages_data = []
    for m in messages_list:
        messages_data.append({
            'id': str(m.id),
            'eventId': str(m.event.id),
            'vendorId': str(m.vendor.id),
            'sender': m.sender,
            'text': m.text,
            'timestamp': m.timestamp.isoformat(),
        })

    # --- BROADCASTS ---
    broadcasts_list = Broadcast.objects.filter(
        event__organizer=organizer_profile
    ).select_related('event').order_by('-timestamp')
    broadcasts_data = []
    for b in broadcasts_list:
        broadcasts_data.append({
            'id': str(b.id),
            'eventId': str(b.event.id),
            'message': b.message,
            'timestamp': b.timestamp.isoformat(),
        })

    return JsonResponse({
        'events': events_data,
        'vendors': vendors_data,
        'eventVendors': event_vendors_data,
        'requests': requests_data,
        'registrations': registrations_data,
        'messages': messages_data,
        'broadcasts': broadcasts_data,
    })