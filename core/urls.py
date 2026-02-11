from django.urls import path
from . import views

urlpatterns = [
    # Homepage
    path('', views.dashboard_view, name='home'),
    path('dashboard/', views.dashboard_view, name='dashboard'),

    # Specific Dashboards
    path('dashboard/organizer/', views.organizer_dashboard, name='organizer_dashboard'),
    path('dashboard/scega/', views.scega_dashboard, name='scega_dashboard'),

    # Auth Routes
    path('signup/', views.signup_attendee, name='signup_attendee'),
    path('login/', views.login_attendee, name='login_attendee'),
    path('signup/business/', views.signup_business, name='signup_business'),
    path('login/business/', views.login_business, name='login_business'),
]