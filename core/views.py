from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import SignUpForm


# --- ATTENDEE VIEWS ---

def signup_attendee(request):
    """Handles signup for Attendees only"""
    if request.method == 'POST':
        data = request.POST.copy()
        data['role'] = 'ATTENDEE'

        # Combine Day/Month/Year from frontend
        day = data.get('day')
        month = data.get('month')
        year = data.get('year')
        if day and month and year:
            data['date_of_birth'] = f"{year}-{month}-{day}"

        form = SignUpForm(data)
        if form.is_valid():
            user = form.save()
            if not request.user.is_authenticated:
                login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()

    # FIX: Point to 'core/signup.html'
    return render(request, 'core/signup.html', {'form': form})


def login_attendee(request):
    """Handles login for Attendees"""
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
    # FIX: Point to 'core/login.html'
    return render(request, 'core/login.html', {'form': form})


# --- BUSINESS VIEWS ---

def signup_business(request):
    """Handles signup for Organizers & Vendors"""
    if request.method == 'POST':
        # The 'role' is injected by app.js hidden input
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            if not request.user.is_authenticated:
                login(request, user)

            # Redirect to specific dashboard based on role
            if user.role == 'ORGANIZER':
                return redirect('organizer_dashboard')
            # Add Vendor redirect here if/when you have a vendor dashboard
            return redirect('dashboard')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()

    # FIX: Point to 'core/signup-business.html'
    return render(request, 'core/signup-business.html', {'form': form})


def login_business(request):
    """Handles login for Organizers & Vendors"""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)

            # Smart Redirect based on Role
            if user.role == 'ORGANIZER':
                return redirect('organizer_dashboard')
            elif user.role == 'SCEGA_ADMIN':
                return redirect('scega_dashboard')
            else:
                return redirect('dashboard')
        else:
            messages.error(request, "Invalid business credentials.")
    else:
        form = AuthenticationForm()
    # FIX: Point to 'core/login-business.html'
    return render(request, 'core/login-business.html', {'form': form})


def dashboard_view(request):
    # FIX: Point to 'core/index.html'
    return render(request, 'core/index.html')


# --- DASHBOARD VIEWS ---

@login_required
def organizer_dashboard(request):
    if request.user.role != 'ORGANIZER':
        return redirect('home')
    if request.method == 'POST':
        # ... fetch data (title, date, etc) ...
        Event.objects.create(
            organizer=request.user.organizer_profile,
            title=request.POST.get('title'),
            # ... other fields ...
            status='PENDING'  # 2) & 3) Saved as Pending
        )
        messages.success(request, "Event requested! Waiting for SCEGA approval.")
        return redirect('organizer_dashboard')
    my_events = Event.objects.filter(organizer=request.user.organizer_profile).order_by('-date')
    return render(request, 'core/organizer-dashboard.html', {'events': my_events})


@login_required
def scega_dashboard(request):
    if request.user.role != 'SCEGA_ADMIN':
        return redirect('home')

        # 5) SCEGA Chooses Approve or Reject
    if request.method == 'POST':
        event_id = request.POST.get('event_id')
        action = request.POST.get('action')
        event = get_object_or_404(Event, id=event_id)

        if action == 'approve':
            event.status = 'APPROVED'
            messages.success(request, f"Event '{event.title}' Published.")
        elif action == 'reject':
            event.status = 'REJECTED'
            messages.warning(request, f"Event '{event.title}' Rejected.")

        event.save()
        return redirect('scega_dashboard')

        # 4) SCEGA Receives Requests (Filter by Pending)
    pending_events = Event.objects.filter(status='PENDING').order_by('date')

    # 6) History Tab (Approved or Rejected)
    history_events = Event.objects.filter(status__in=['APPROVED', 'REJECTED']).order_by('-date')

    return render(request, 'core/scega-dashboard.html', {
        'pending_events': pending_events,
        'history_events': history_events
    })

def logout_view(request):
    logout(request)
    return redirect('home')