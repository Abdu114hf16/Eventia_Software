from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import date
from .forms import SignUpForm
from .models import Event, OrganizerProfile, VendorProfile, Request, CustomUser, Ticket, AttendeeProfile


# --- GENERAL NAVIGATION & AUTH ---

def dashboard_view(request):
    """Redirects users to their specific dashboard based on role."""
    if request.user.is_authenticated:
        # --- DEBUG MESSAGE: This will appear on screen if redirect fails ---
        print(f"DEBUG: User={request.user.username}, Role={request.user.role}")

        if request.user.role == 'ORGANIZER':
            return redirect('organizer_dashboard')
        elif request.user.role == 'SCEGA_ADMIN':
            return redirect('scega_dashboard')
        elif request.user.role == 'ATTENDEE':
            return redirect('attendee_dashboard')
        else:
            # If we get here, the role is unknown or missing
            messages.warning(request,
                             f"Debug: Logged in as '{request.user.username}' but Role is '{request.user.role}' (Expected: 'ATTENDEE').")

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
            # Double check role
            if user.role != 'ATTENDEE':
                user.role = 'ATTENDEE'
                user.save()
            login(request, user)
            return redirect('attendee_dashboard')
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


@login_required
def attendee_dashboard(request):
    # If the user reaches here but isn't an Attendee, bounce them back
    if request.user.role != 'ATTENDEE':
        return redirect('home')

    today = date.today()
    user_tickets = Ticket.objects.filter(attendee=request.user).select_related('event')

    my_tickets = []
    history_events = []
    ticket_event_ids = []

    for ticket in user_tickets:
        ticket_event_ids.append(ticket.event.id)
        if ticket.event.date >= today:
            my_tickets.append(ticket)
        else:
            history_events.append(ticket)

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
    ticket.delete()
    messages.info(request, "Registration cancelled.")
    return redirect('attendee_dashboard')


# --- OTHER VIEWS (Keep existing ones) ---
def signup_business(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            if user.role == 'ORGANIZER': return redirect('organizer_dashboard')
            return redirect('dashboard')
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
        form = AuthenticationForm()
    return render(request, 'core/login-business.html', {'form': form})


def login_scega(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            if user.user.role == 'SCEGA_ADMIN':
                login(request, user)
                return redirect('scega_dashboard')
    else:
        form = AuthenticationForm()
    return render(request, 'core/scega-login.html', {'form': form})


def logout_scega(request):
    logout(request)
    return redirect('scega_login')


@login_required
def scega_dashboard(request):
    if request.user.role != 'SCEGA_ADMIN': return redirect('home')
    if request.method == 'POST':
        event = get_object_or_404(Event, id=request.POST.get('event_id'))
        action = request.POST.get('action')
        if action == 'approve':
            event.status = 'APPROVED'
        elif action == 'reject':
            event.status = 'REJECTED'
            event.rejection_reason = request.POST.get('rejection_reason', '')
        event.save()
        return redirect('scega_dashboard')

    context = {
        'pending_events': Event.objects.filter(status='PENDING').order_by('date'),
        'history_events': Event.objects.filter(status__in=['APPROVED', 'REJECTED']).order_by('-date'),
        'pending_count': Event.objects.filter(status='PENDING').count(),
        'approved_count': Event.objects.filter(status='APPROVED').count(),
        'rejected_count': Event.objects.filter(status='REJECTED').count(),
    }
    return render(request, 'core/scega-dashboard.html', context)


@login_required
def organizer_dashboard(request):
    if request.user.role != 'ORGANIZER': return redirect('home')
    # ... (Keep existing organizer logic) ...
    try:
        my_events = Event.objects.filter(organizer=request.user.organizer_profile).order_by('-id')
    except OrganizerProfile.DoesNotExist:
        my_events = []
    return render(request, 'core/organizer-dashboard.html', {'events': my_events})


@login_required
def delete_event(request, event_id):
    if request.user.role != 'ORGANIZER': return redirect('home')
    event = get_object_or_404(Event, id=event_id)
    event.delete()
    return redirect('organizer_dashboard')