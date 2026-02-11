from django.urls import path
from django.shortcuts import redirect
from . import views

urlpatterns = [
    # --- Home & Dashboard ---
    path('', views.dashboard_view, name='home'),
    path('dashboard/', views.dashboard_view, name='dashboard'),

    # --- Auth Routes ---
    # 1. Default Login (Fixes 'NoReverseMatch' error)
    path('login/', views.login_attendee, name='login'),

    # 2. Specific Logins
    path('login/attendee/', views.login_attendee, name='login_attendee'),
    path('login/business/', views.login_business, name='login_business'),

    # 3. Signups
    path('signup/', views.signup_attendee, name='signup_attendee'),
    path('signup/business/', views.signup_business, name='signup_business'),

    # 4. Logout (Fixes 'AttributeError' if view exists)
    path('logout/', views.logout_view, name='logout'),

    # --- SCEGA Admin Routes ---
    path('scega/', lambda request: redirect('scega_login')),  # Redirect root /scega to login
    path('scega/login/', views.login_scega, name='scega_login'),
    path('dashboard/scega/', views.scega_dashboard, name='scega_dashboard'),

    # --- Organizer Routes ---
    path('dashboard/organizer/', views.organizer_dashboard, name='organizer_dashboard'),
]