from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import date
from .forms import SignUpForm
from .models import Event, OrganizerProfile, VendorProfile, Request, CustomUser, Ticket, AttendeeProfile
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse


# --- GENERAL NAVIGATION & AUTH ---

def dashboard_view(request):
    """Redirects users to their specific dashboard based on role."""
    if request.user.is_authenticated:
        if request.user.role == 'ORGANIZER':
            return redirect('organizer_dashboard')
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
def api_attendee_data(request):
    if request.user.role != 'ATTENDEE':
        return JsonResponse({'error': 'Unauthorized'}, status=403)

    today = date.today()

    # Fetch Data
    all_events = Event.objects.filter(status='APPROVED').order_by('date')
    user_tickets = Ticket.objects.filter(attendee=request.user).select_related('event')
    ticket_map = {t.event.id: t.id for t in user_tickets}

    # Format Events
    events_data = []
    for event in all_events:
        is_registered = event.id in ticket_map

        # --- SAFE DATA EXTRACTION ---
        # Prevents Server 500 errors if an event is missing a date, time, or price
        evt_date = event.date.strftime('%Y-%m-%d') if event.date else 'TBD'
        evt_time = event.time.strftime('%H:%M') if event.time else 'TBD'
        evt_price = float(event.ticket_price) if event.ticket_price else 0.0
        evt_status = 'upcoming' if (event.date and event.date >= today) else 'past'

        events_data.append({
            'id': event.id,
            'title': event.title or 'Untitled Event',
            'category': event.category or 'Other',
            'date': evt_date,
            'time': evt_time,
            'location': event.location or 'TBD',
            'description': event.description or '',
            'price': evt_price,
            'image': 'assets/event-placeholder.jpg',
            'isRegistered': is_registered,
            'ticketId': ticket_map.get(event.id),
            'status': evt_status
        })

    # Format Profile
    profile_data = {
        'username': request.user.username,
        'email': request.user.email,
        'role': 'Attendee',
        'firstName': request.user.first_name or request.user.username,
        'lastName': request.user.last_name or '',
        'phone': getattr(request.user, 'phone_number', ''),
        'initial': request.user.username[0].upper() if request.user.username else 'A'
    }

    return JsonResponse({
        'events': events_data,
        'profile': profile_data
    })

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


# --- BUSINESS VIEWS ---

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
        my_events = Event.objects.filter(organizer=request.user.organizer_profile).order_by('-id')
    except OrganizerProfile.DoesNotExist:
        my_events = []

    return render(request, 'core/organizer-dashboard.html', {'events': my_events})


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