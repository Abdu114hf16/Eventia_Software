from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from .models import User
from django.contrib import messages
import datetime


def signup_view(request):
    if request.method == 'POST':
        role = request.POST.get('role')
        email = request.POST.get('email')
        password = request.POST.get('password')
        phone = request.POST.get('phone')

        # Basic validation check
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists")
            return redirect('signup')

        try:
            # Create Base User
            user = User.objects.create_user(username=email, email=email, password=password)
            user.role = role
            user.phone_number = phone

            # Handle Role Specifics
            if role == 'organizer':
                # Use first_name for full name for simplicity
                user.first_name = request.POST.get('full_name')

            elif role == 'vendor':
                user.organization_name = request.POST.get('org_name')
                user.service_type = request.POST.get('service_type')

            elif role == 'attendee':
                user.first_name = request.POST.get('first_name')
                user.last_name = request.POST.get('last_name')
                user.username = request.POST.get('username')  # Override email as username if desired
                user.gender = request.POST.get('gender')

                # Construct Date
                day = request.POST.get('day')
                month = request.POST.get('month')
                year = request.POST.get('year')
                if day and month and year:
                    user.birthday = datetime.date(int(year), int(month), int(day))

            user.save()
            login(request, user)
            return redirect('dashboard')  # Redirect to main page after signup

        except Exception as e:
            messages.error(request, f"Error: {e}")
            return redirect('signup')

    return render(request, 'accounts/signup.html')


def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, "Invalid credentials")

    return render(request, 'accounts/login.html')


def dashboard(request):
    return render(request, 'index.html')