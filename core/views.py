from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from .forms import SignUpForm, EventForm
from .models import Event, TicketCategory

# --- ATTENDEE VIEWS ---

def signup_attendee(request):
    """Handles signup for Attendees only (signup.html)"""
    if request.method == 'POST':
        # Create a copy of the POST data to modify it
        data = request.POST.copy()

        # 1. Force the role
        data['role'] = 'ATTENDEE'

        # 2. Combine Day/Month/Year into YYYY-MM-DD
        day = data.get('day')
        month = data.get('month')
        year = data.get('year')

        if day and month and year:
            data['date_of_birth'] = f"{year}-{month}-{day}"

        form = SignUpForm(data)
        if form.is_valid():
            user = form.save()
            # Login only if guest
            if not request.user.is_authenticated:
                login(request, user)
                messages.success(request, f"Welcome, {user.username}!")
            else:
                messages.info(request, f"Attendee {user.username} created.")
            return redirect('attendee_dashboard')
        else:
            # Pass the errors back to the template
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()

    return render(request, 'signup.html', {'form': form})


def login_attendee(request):
    """Handles login for Attendees (login.html)"""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('attendee_dashboard')
        else:
            messages.error(request, "Invalid credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})


# --- BUSINESS VIEWS ---

def signup_business(request):
    """Handles signup for Organizers & Vendors (signup-business.html)"""
    if request.method == 'POST':
        # The 'role' is coming from the hidden input in app.js (ORGANIZER or VENDOR)
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            if not request.user.is_authenticated:
                login(request, user)
                messages.success(request, f"Welcome, {user.username}!")
            else:
                messages.info(request, f"Business account {user.username} created.")
            return redirect('dashboard_redirect')
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = SignUpForm()

    return render(request, 'signup-business.html', {'form': form})


def login_business(request):
    """Handles login for Organizers & Vendors (login-business.html)"""
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard_redirect')
        else:
            messages.error(request, "Invalid business credentials.")
    else:
        form = AuthenticationForm()
    return render(request, 'login-business.html', {'form': form})


def dashboard_view(request):
    return render(request, 'index.html')

    # --- DASHBOARD REDIRECTION ---

@login_required
def dashboard_redirect(request):
    """
    Acts as the traffic controller. 
    Redirects users based on their role to the specific dashboard view.
    """
    user = request.user
    if user.role == 'ORGANIZER':
        return redirect('organizer_dashboard')
    elif user.role == 'VENDOR':
        return redirect('vendor_dashboard')
    elif user.role == 'SCEGA':
        return redirect('scega_dashboard')
    elif user.role == 'ATTENDEE':
        return redirect('attendee_dashboard')
    else:
        # Default fallback
        return redirect('index') 


# --- ORGANIZER DASHBOARD ---

@login_required
def organizer_dashboard(request):
    # Security check
    if request.user.role != 'ORGANIZER':
        return redirect('dashboard_redirect')
    
    # Get the profile
    try:
        organizer_profile = request.user.organizer_profile
    except:
        messages.error(request, "Organizer profile not found.")
        return redirect('index')

    # Fetch events for THIS organizer only
    events = Event.objects.filter(organizer=organizer_profile).order_by('-date')

    # Stats
    context = {
        'events': events,
        'total_events': events.count(),
        'upcoming_events': events.filter(status='UPCOMING').count(),
        'pending_approval': events.filter(approval='PENDING').count(),
    }
    return render(request, 'organizer-dashboard.html', context)


@login_required
def create_event(request):
    if request.user.role != 'ORGANIZER':
        return redirect('index')

    if request.method == 'POST':
        form = EventForm(request.POST, request.FILES)
        if form.is_valid():
            # 1. Create Event but don't save to DB yet
            event = form.save(commit=False)
            event.organizer = request.user.organizer_profile
            
            # Auto-set status based on date
            if event.date < timezone.now().date():
                event.status = 'PAST'
            else:
                event.status = 'UPCOMING'
                
            event.save()

            # 2. Handle Dynamic Tickets
            # We explicitly pull the lists from the HTML inputs named 'ticket_name' and 'ticket_price'
            names = request.POST.getlist('ticket_name')
            prices = request.POST.getlist('ticket_price')

            for name, price in zip(names, prices):
                if name and price:
                    TicketCategory.objects.create(event=event, name=name, price=price)

            messages.success(request, "Event created successfully!")
            return redirect('organizer_dashboard')
        else:
            messages.error(request, "Please correct the errors in the form.")
    
    return redirect('organizer_dashboard')


@login_required
def delete_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    # Ensure ownership
    if event.organizer.user == request.user:
        event.delete()
        messages.success(request, "Event deleted.")
    return redirect('organizer_dashboard')


# --- VENDOR DASHBOARD (Placeholder) ---

@login_required
def vendor_dashboard(request):
    if request.user.role != 'VENDOR':
        return redirect('dashboard_redirect')
    return render(request, 'vendor-dashboard.html')


@login_required
def attendee_dashboard(request):
    if request.user.role != 'ATTENDEE':
        return redirect('dashboard_redirect')
    return render(request, 'attendee-dashboard.html')


# --- SCEGA DASHBOARD ---

@login_required
def scega_dashboard(request):
    if request.user.role != 'SCEGA':
        return redirect('dashboard_redirect')
    
    # Logic for SCEGA Dashboard
    pending_events = Event.objects.filter(approval='PENDING').order_by('date')
    
    context = {
        'pending_events': pending_events,
        'pending_count': Event.objects.filter(approval='PENDING').count(),
        'approved_count': Event.objects.filter(approval='APPROVED').count(),
        'rejected_count': Event.objects.filter(approval='REJECTED').count(),
    }
    return render(request, 'scega-dashboard.html', context)


@login_required
def approve_event(request, event_id):
    if request.user.role != 'SCEGA':
        return redirect('index')
        
    event = get_object_or_404(Event, id=event_id)
    event.approval = 'APPROVED'
    event.save()
    messages.success(request, f"Event '{event.title}' approved.")
    return redirect('scega_dashboard')


@login_required
def reject_event(request, event_id):
    if request.user.role != 'SCEGA':
        return redirect('index')
    
    if request.method == 'POST':
        event = get_object_or_404(Event, id=event_id)
        reason = request.POST.get('rejection_reason', '')
        event.approval = 'REJECTED'
        event.rejection_reason = reason
        event.save()
        messages.warning(request, f"Event '{event.title}' rejected.")
        
    return redirect('scega_dashboard')
