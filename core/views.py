from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import SignUpForm
from .models import Event, OrganizerProfile


# --- GENERAL NAVIGATION & AUTH ---

def dashboard_view(request):
    """Redirects users based on their role."""
    if not request.user.is_authenticated:
        return render(request, 'core/index.html')

    if request.user.role == 'ORGANIZER':
        return redirect('organizer_dashboard')
    elif request.user.role == 'SCEGA_ADMIN':
        return redirect('scega_dashboard')

    # Default for attendees or others
    return render(request, 'core/index.html')


def logout_view(request):
    """Logs out the user and redirects to home."""
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

@login_required
def organizer_dashboard(request):
    if request.user.role != 'ORGANIZER':
        return redirect('home')

    if request.method == 'POST':
        try:
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
            messages.success(request, "Event requested! Waiting for SCEGA approval.")
            return redirect('organizer_dashboard')
        except Exception as e:
            messages.error(request, f"Error: {str(e)}")
            return redirect('organizer_dashboard')

    # Fetch Organizer's Events
    try:
        my_events = Event.objects.filter(organizer=request.user.organizer_profile).order_by('-date')
    except OrganizerProfile.DoesNotExist:
        my_events = []

    return render(request, 'core/organizer-dashboard.html', {'events': my_events})

def logout_scega(request):
    """
    Specific logout for SCEGA admins.
    Redirects to SCEGA login with a confirmation message.
    """
    logout(request)
    messages.info(request, "You have been successfully logged out.")
    return redirect('scega_login')