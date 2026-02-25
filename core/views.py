from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import date
from .forms import SignUpForm
from .models import Event, OrganizerProfile, VendorProfile, Request, CustomUser, Ticket, AttendeeProfile
import json
import random
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse


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
        elif request.user.role == 'ATTENDEE':  # <--- THIS WAS MISSING
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
            login(request, user)

            # --- EXPLICIT REDIRECT LOGIC ---
            # We redirect directly here to avoid routing issues
            if user.role == 'ATTENDEE':
                return redirect('attendee_dashboard')
            elif user.role == 'ORGANIZER':
                return redirect('organizer_dashboard')
            elif user.role == 'SCEGA_ADMIN':
                return redirect('scega_dashboard')

            return redirect('dashboard')
        else:
            messages.error(request, "Invalid credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'core/login.html', {'form': form})


# 1. The Page View (Just renders the file)
@login_required
def attendee_dashboard(request):
    if request.user.role != 'ATTENDEE':
        return redirect('home')
    return render(request, 'core/attendee-dashboard.html')


@login_required
@login_required
def api_attendee_data(request):
    if request.user.role != 'ATTENDEE':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    today = date.today()

    # 1. Fetch Events & Tickets
    all_events = Event.objects.filter(status='APPROVED').order_by('date')
    user_tickets = Ticket.objects.filter(attendee=request.user).select_related('event')
    ticket_map = {t.event.id: t for t in user_tickets}
    registered_event_ids = list(ticket_map.keys())

    # 2. Fetch Broadcasts (ONLY for registered events)
    from .models import Broadcast
    broadcasts = Broadcast.objects.filter(event__id__in=registered_event_ids).order_by('-timestamp')

    # 3. Format Events
    events_data = []
    for event in all_events:
        events_data.append({
            'id': str(event.id),
            'title': event.title or 'Untitled Event',
            'category': event.category or 'Other',
            'date': event.date.strftime('%Y-%m-%d') if event.date else 'TBD',
            'time': event.time.strftime('%H:%M') if event.time else 'TBD',
            'location': event.location or 'TBD',
            'description': event.description or '',
            'price': float(event.ticket_price) if event.ticket_price else 0.0,
            'status': 'upcoming' if (event.date and event.date >= today) else 'past'
        })

    # 4. Format Registrations (Tickets)
    regs_data = []
    for t in user_tickets:
        regs_data.append({
            'id': str(t.id),
            'eventId': str(t.event.id),
            'ticketType': t.ticket_type,
            'ticketPrice': float(t.amount_paid),
            'registeredDate': t.purchase_date.strftime('%Y-%m-%d'),
            'ticketCode': f"EVT-{t.event.id}-TKT-{t.id}",
            'attended': t.attended,
            'rating': t.rating,
            'feedback': t.feedback,
            'feedbackDate': t.purchase_date.strftime('%Y-%m-%d') if t.feedback else None
        })

    # 5. Format Broadcasts
    broadcasts_data = [{
        'id': str(b.id),
        'eventId': str(b.event.id),
        'message': b.message,
        'timestamp': b.timestamp.isoformat()
    } for b in broadcasts]

    return JsonResponse({
        'events': events_data,
        'registrations': regs_data,
        'broadcasts': broadcasts_data,
        'profile': {
            'firstName': request.user.first_name or request.user.username,
            'lastName': request.user.last_name or '',
            'email': request.user.email,
        }
    })

@login_required
def api_attendee_register_json(request, event_id):
    """Silently handles the mock payment success"""
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
    """Saves rating/feedback without reloading the page"""
    if request.method == 'POST':
        data = json.loads(request.body)
        ticket = get_object_or_404(Ticket, id=reg_id, attendee=request.user)
        ticket.rating = data.get('rating')
        ticket.feedback = data.get('feedback')
        ticket.save()
        return JsonResponse({'success': True})

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
            login(request, user)
            if user.role == 'ORGANIZER':
                return redirect('organizer_dashboard')
            elif user.role == 'VENDOR':
                return redirect('vendor_dashboard')
            elif user.role == 'SCEGA_ADMIN':
                return redirect('scega_dashboard')
            return redirect('dashboard')
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

    try:
        vendor_profile = request.user.vendor_profile
        incoming_requests = Request.objects.filter(vendor=vendor_profile, sent_by='ORGANIZER').order_by('-created_at')
        outgoing_requests = Request.objects.filter(vendor=vendor_profile, sent_by='VENDOR').order_by('-created_at')

        # Pending incoming invitations
        pending_invitations_count = incoming_requests.filter(status='PENDING').count()
        today = date.today()

        approved_requests = Request.objects.filter(vendor=vendor_profile, status='APPROVED')
        active_events_count = approved_requests.filter(event__date__gte=today).count()
        completed_events_count = approved_requests.filter(event__date__lt=today).count()

        my_events = approved_requests.order_by('event__date')

         # Removed date__gte=today so older test events can still show up during development
        all_upcoming_events = Event.objects.filter(status='APPROVED').order_by('date')

        applied_event_ids = list(incoming_requests.values_list('event_id', flat=True)) + list(outgoing_requests.values_list('event_id', flat=True))

    except Exception as e:
        incoming_requests = []
        outgoing_requests = []
        pending_invitations_count = 0
        active_events_count = 0
        completed_events_count = 0
        my_events = []
        all_upcoming_events = []
        applied_event_ids = []

    context = {
        'incoming_requests': incoming_requests,
        'outgoing_requests': outgoing_requests,
        'pending_invitations_count': pending_invitations_count,
        'active_events_count': active_events_count,
        'completed_events_count': completed_events_count,
        'my_events': my_events,
        'all_upcoming_events': all_upcoming_events,
        'applied_event_ids': applied_event_ids,
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

        # Vendor Marketplace Data
        vendors = VendorProfile.objects.all().order_by('organization_name', 'user__username')

        # Requests Data
        outgoing_requests = Request.objects.filter(event__organizer=organizer_profile, sent_by='ORGANIZER').order_by('-created_at')
        incoming_requests = Request.objects.filter(event__organizer=organizer_profile, sent_by='VENDOR').order_by('-created_at')

    except OrganizerProfile.DoesNotExist:
        my_events = []
        vendors = []
        outgoing_requests = []
        incoming_requests = []

    context = {
        'events': my_events,
        'vendors': vendors,
        'outgoing_requests': outgoing_requests,
        'incoming_requests': incoming_requests,
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

from django.http import HttpResponse

def debug_user_role(request):
    if not request.user.is_authenticated:
        return HttpResponse("<h1>You are NOT logged in.</h1><a href='/login/'>Log In</a>")

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

    User = get_user_model()

def password_recovery(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            action = data.get('action')

            # --- STEP 1: Find User & Send OTP ---
            if action == 'send_otp':
                identifier = data.get('identifier')
                # Try finding by email or username
                user = User.objects.filter(email=identifier).first() or User.objects.filter(username=identifier).first()

                if user:
                    # Generate a 6-digit OTP
                    otp = str(random.randint(100000, 999999))
                    request.session['recovery_otp'] = otp
                    request.session['recovery_user_id'] = user.id

                    # 🔴 IN DEVELOPMENT: Print OTP to terminal so you can test it
                    print(f"\n" + "="*40)
                    print(f" PASSWORD RECOVERY OTP FOR: {user.username}")
                    print(f" CODE: {otp}")
                    print("="*40 + "\n")

                    return JsonResponse({'status': 'success'})
                else:
                    return JsonResponse({'status': 'error', 'message': 'No account found with that email/username.'})

            # --- STEP 2: Verify OTP ---
            elif action == 'verify_otp':
                otp_input = data.get('otp')
                session_otp = request.session.get('recovery_otp')

                if session_otp and otp_input == session_otp:
                    return JsonResponse({'status': 'success'})
                else:
                    return JsonResponse({'status': 'error', 'message': 'Invalid or expired verification code.'})

            # --- STEP 3: Reset Password ---
            elif action == 'reset_password':
                new_password = data.get('password')
                user_id = request.session.get('recovery_user_id')

                if user_id:
                    user = User.objects.get(id=user_id)
                    user.set_password(new_password)
                    user.save()

                    # Security: Clear the session data
                    if 'recovery_otp' in request.session:
                        del request.session['recovery_otp']
                    if 'recovery_user_id' in request.session:
                        del request.session['recovery_user_id']

                    return JsonResponse({'status': 'success'})
                else:
                    return JsonResponse({'status': 'error', 'message': 'Session expired. Please start over.'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred.'})

    # For GET requests, just render the page
    return render(request, 'core/password-recovery.html')
