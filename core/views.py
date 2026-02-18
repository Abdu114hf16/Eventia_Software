from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from datetime import date
from .models import Ticket
from django.contrib import messages
from .forms import SignUpForm
from .models import Event, OrganizerProfile, VendorProfile, Request, CustomUser



# --- GENERAL NAVIGATION & AUTH ---

def dashboard_view(request):
    """Redirects users to their specific dashboard based on role."""
    if request.user.is_authenticated:
        if request.user.role == 'ORGANIZER':
            return redirect('organizer_dashboard')
        elif request.user.role == 'SCEGA_ADMIN':
            return redirect('scega_dashboard')
        elif request.user.role == 'ATTENDEE':  # <--- ADD THIS CHECK
            return redirect('attendee_dashboard')

    # Default for guests: Show Homepage
    events = Event.objects.filter(status='APPROVED').order_by('date')
    return render(request, 'core/index.html', {'events': events})

    # Default for guests and attendees: Show Homepage with Events
    events = Event.objects.filter(status='APPROVED').order_by('date')
    return render(request, 'core/index.html', {'events': events})


def landing_page(request):
    """Renders the landing page (index.html) without redirection."""
    events = Event.objects.filter(status='APPROVED').order_by('date')
    return render(request, 'core/index.html', {'events': events})


def logout_view(request):
    """Logs out the user and redirects to home."""
    logout(request)
    return redirect('home')


def event_details(request, event_id):
    """Displays detailed information about a specific event."""
    event = get_object_or_404(Event, id=event_id)
    return render(request, 'core/event-details.html', {'event': event})


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
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()
    return render(request, 'core/signup.html', {'form': form})


def login_attendee(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'core/login.html', {'form': form})


# --- BUSINESS VIEWS (Organizer/Vendor) ---

def signup_business(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            if user.role == 'ORGANIZER':
                return redirect('organizer_dashboard')
            return redirect('dashboard')
        else:
            messages.error(request, "Please correct the errors below.")
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
            elif user.role == 'SCEGA_ADMIN':
                return redirect('scega_dashboard')
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid business credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'core/login-business.html', {'form': form})


# --- SCEGA ADMIN VIEWS ---

def login_scega(request):
    """Restricted login for SCEGA Admins only."""

    # SECURITY FIX: Clear any old messages (like 'Event Published')
    # so they don't show up on the login screen.
    storage = messages.get_messages(request)
    for _ in storage:
        pass  # Iterating clears them from the session

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.role == 'SCEGA_ADMIN':
                login(request, user)
                return redirect('scega_dashboard')
            else:
                # Add a fresh error message just for this failure
                messages.error(request, "Access Denied. SCEGA Admins only.")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()

    return render(request, 'core/scega-login.html', {'form': form})


@login_required
def scega_dashboard(request):
    if request.user.role != 'SCEGA_ADMIN':
        return redirect('home')

    if request.method == 'POST':
        event_id = request.POST.get('event_id')
        action = request.POST.get('action')
        reason = request.POST.get('rejection_reason', '')  # Get reason

        event = get_object_or_404(Event, id=event_id)

        if action == 'approve':
            event.status = 'APPROVED'
            # Clear any previous rejection reason if approved
            event.rejection_reason = ""
            messages.success(request, f"Event '{event.title}' Published.")

        elif action == 'reject':
            event.status = 'REJECTED'
            event.rejection_reason = reason  # Save the reason
            messages.warning(request, f"Event '{event.title}' Rejected.")

        event.save()
        return redirect('scega_dashboard')

    # Data for the dashboard
    pending_events = Event.objects.filter(status='PENDING').order_by('date')
    history_events = Event.objects.filter(status__in=['APPROVED', 'REJECTED']).order_by('-date')

    # Counts
    pending_count = pending_events.count()
    approved_count = Event.objects.filter(status='APPROVED').count()
    rejected_count = Event.objects.filter(status='REJECTED').count()

    context = {
        'pending_events': pending_events,
        'history_events': history_events,
        'pending_count': pending_count,
        'approved_count': approved_count,
        'rejected_count': rejected_count,
    }
    return render(request, 'core/scega-dashboard.html', context)


# --- ORGANIZER DASHBOARD ---

# ... imports ...

@login_required
def organizer_dashboard(request):
    if request.user.role != 'ORGANIZER':
        return redirect('home')

    organizer_profile = request.user.organizer_profile

    if request.method == 'POST':
        # --- Handle Request Creation ---
        if 'create_request' in request.POST:
            try:
                event_id = request.POST.get('event_id')
                vendor_id = request.POST.get('vendor_id')
                message = request.POST.get('message')

                event = get_object_or_404(Event, id=event_id, organizer=organizer_profile)
                vendor = get_object_or_404(VendorProfile, id=vendor_id)

                Request.objects.create(
                    event=event,
                    vendor=vendor,
                    message=message,
                    sent_by='ORGANIZER',
                    status='PENDING'
                )
                messages.success(request, f"Request sent to {vendor.user.username}!")
            except Exception as e:
                messages.error(request, f"Error sending request: {str(e)}")
            return redirect('organizer_dashboard')

        try:
            # Check if we are updating an existing event
            event_id = request.POST.get('event_id')

            if event_id:
                # --- UPDATE LOGIC ---
                event = get_object_or_404(Event, id=event_id, organizer=organizer_profile)
                event.title = request.POST.get('title')
                event.category = request.POST.get('category')
                event.date = request.POST.get('date')
                event.time = request.POST.get('time')
                event.location = request.POST.get('location')
                event.description = request.POST.get('description')
                event.capacity = request.POST.get('capacity')
                event.ticket_price = request.POST.get('ticket_price', 0)
                # Reset status to PENDING on edit so SCEGA can re-review
                event.status = 'PENDING'
                event.save()
                messages.success(request, "Event updated successfully!")
            else:
                # --- CREATE LOGIC ---
                Event.objects.create(
                    organizer=organizer_profile,
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

    # Fetch events (Newest first)
    try:
        my_events = Event.objects.filter(organizer=request.user.organizer_profile).order_by('-id')
    except OrganizerProfile.DoesNotExist:
        my_events = []

    # Fetch Vendors
    vendors = VendorProfile.objects.all()

    # Fetch Requests
    outgoing_requests = Request.objects.filter(event__organizer=organizer_profile, sent_by='ORGANIZER').order_by(
        '-created_at')
    incoming_requests = Request.objects.filter(event__organizer=organizer_profile, sent_by='VENDOR').order_by(
        '-created_at')

    context = {
        'events': my_events,
        'vendors': vendors,
        'outgoing_requests': outgoing_requests,
        'incoming_requests': incoming_requests,
    }

    return render(request, 'core/organizer-dashboard.html', context)


# --- NEW DELETE VIEW ---
@login_required
def delete_event(request, event_id):
    if request.user.role != 'ORGANIZER':
        return redirect('home')

    event = get_object_or_404(Event, id=event_id, organizer=request.user.organizer_profile)
    event.delete()
    messages.success(request, "Event deleted successfully.")
    return redirect('organizer_dashboard')


def logout_scega(request):
    """
    Specific logout for SCEGA admins.
    Redirects to SCEGA login with a confirmation message.
    """
    logout(request)
    messages.info(request, "You have been successfully logged out.")
    return redirect('scega_login')


@login_required
def attendee_dashboard(request):
    if request.user.role != 'ATTENDEE':
        return redirect('home')

    today = date.today()

    # 1. Fetch User's Tickets
    user_tickets = Ticket.objects.filter(attendee=request.user).select_related('event')

    # Separate into Upcoming (My Tickets) and Past (History)
    my_tickets = []
    history_events = []
    ticket_event_ids = []

    for ticket in user_tickets:
        ticket_event_ids.append(ticket.event.id)
        if ticket.event.date >= today:
            my_tickets.append(ticket)
        else:
            history_events.append(ticket)

    # 2. Fetch "Browse Events" (Upcoming, Approved, Not already registered)
    browse_events = Event.objects.filter(
        status='APPROVED',
        date__gte=today
    ).exclude(id__in=ticket_event_ids).order_by('date')

    context = {
        'my_tickets': my_tickets,
        'history_events': history_events,
        'browse_events': browse_events,
        'user': request.user
    }
    return render(request, 'core/attendee-dashboard.html', context)


@login_required
def attendee_register(request, event_id):
    if request.user.role != 'ATTENDEE':
        return redirect('home')

    event = get_object_or_404(Event, id=event_id)

    # Check if already registered
    if not Ticket.objects.filter(attendee=request.user, event=event).exists():
        Ticket.objects.create(attendee=request.user, event=event, status='ACTIVE')
        messages.success(request, f"Successfully registered for {event.title}!")
    else:
        messages.warning(request, "You are already registered for this event.")

    return redirect('attendee_dashboard')


@login_required
def attendee_cancel(request, ticket_id):
    if request.user.role != 'ATTENDEE':
        return redirect('home')

    ticket = get_object_or_404(Ticket, id=ticket_id, attendee=request.user)
    ticket.delete()  # Or set status='CANCELLED' if you prefer soft delete
    messages.info(request, "Registration cancelled.")
    return redirect('attendee_dashboard')