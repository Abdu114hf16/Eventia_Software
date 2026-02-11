from django.urls import path
from django.shortcuts import redirect
from . import views

urlpatterns = [
    # --- Home & Dashboard ---
    path('', views.dashboard_view, name='home'),
    path('dashboard/', views.dashboard_view, name='dashboard'),

    # --- Auth Routes ---
    path('login/', views.login_attendee, name='login'),
    path('login/attendee/', views.login_attendee, name='login_attendee'),
    path('login/business/', views.login_business, name='login_business'),
    path('signup/', views.signup_attendee, name='signup_attendee'),
    path('signup/business/', views.signup_business, name='signup_business'),
    path('logout/', views.logout_view, name='logout'),

    # --- SCEGA Admin Routes ---
    path('scega/', lambda request: redirect('scega_login')),
    path('scega/login/', views.login_scega, name='scega_login'),
    path('dashboard/scega/', views.scega_dashboard, name='scega_dashboard'),

    # NEW: Specific Logout for SCEGA that redirects to SCEGA Login
    path('dashboard/scega/logout/', views.logout_scega, name='logout_scega'),

    # --- Organizer Routes ---
    path('dashboard/organizer/', views.organizer_dashboard, name='organizer_dashboard'),

    # NEW: Delete Event URL
    path('dashboard/organizer/delete/<int:event_id>/', views.delete_event, name='delete_event'),
]
]