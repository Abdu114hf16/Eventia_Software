from django.urls import path
from . import views

urlpatterns = [
    # 1. Add this Empty Path for the Homepage
    path('', views.dashboard_view, name='index'),

    # Dashboard
    #path('dashboard/', views.dashboard_view, name='dashboard'),

    # Attendee Routes
    path('signup/', views.signup_attendee, name='signup_attendee'),
    path('login/', views.login_attendee, name='login_attendee'),

    # Business Routes
    path('signup/business/', views.signup_business, name='signup_business'),
    path('login/business/', views.login_business, name='login_business'),

    # The main hub
    path('dashboard/', views.dashboard_redirect, name='dashboard_redirect'),

    # Specific Dashboards
    path('dashboard/organizer/', views.organizer_dashboard, name='organizer_dashboard'),
    path('dashboard/vendor/', views.vendor_dashboard, name='vendor_dashboard'),

    # Event Actions
    path('dashboard/event/create/', views.create_event, name='create_event'),
    path('dashboard/event/delete/<int:event_id>/', views.delete_event, name='delete_event'),

    # SCEGA & Admin
    path('dashboard/scega/', views.scega_dashboard, name='scega_dashboard'),
    path('dashboard/event/<int:event_id>/approve/', views.approve_event, name='approve_event'),
    path('dashboard/event/<int:event_id>/reject/', views.reject_event, name='reject_event'),

    # Attendee
    path('dashboard/attendee/', views.attendee_dashboard, name='attendee_dashboard'),
]
