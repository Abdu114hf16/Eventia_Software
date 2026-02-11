from django.urls import path
from . import views
from django.shortcuts import redirect

urlpatterns = [
    # Homepage
    path('', views.dashboard_view, name='home'),
    path('dashboard/', views.dashboard_view, name='dashboard'),

    # Specific Dashboards
    path('dashboard/organizer/', views.organizer_dashboard, name='organizer_dashboard'),
    path('dashboard/scega/', views.scega_dashboard, name='scega_dashboard'),
    path('scega/', lambda request: redirect('scega_dashboard')),

    # Auth Routes
    path('signup/', views.signup_attendee, name='signup_attendee'),
    path('login/', views.login_attendee, name='login_attendee'),
    path('signup/business/', views.signup_business, name='signup_business'),
    path('login/business/', views.login_business, name='login_business'),
    path('logout/', views.logout_view, name='logout'),

    # --- SCEGA ADMIN ROUTES ---
    # 1. Redirect root /scega to the login page
    path('scega/', lambda request: redirect('scega_login')),

    # 2. The Login Page
    path('scega/login/', views.login_scega, name='scega_login'),
]