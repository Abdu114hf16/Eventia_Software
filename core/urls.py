from django.urls import path
from django.shortcuts import redirect
from . import views



urlpatterns = [
    # --- Debugging ---
    path('debug-me/', views.debug_user_role, name='debug_user_role'),

    # --- Home & Dashboard ---
    path('', views.dashboard_view, name='home'),
    path('landing/', views.landing_page, name='landing_page'),
    path('dashboard/', views.dashboard_view, name='dashboard'),

    # --- Auth Routes ---
    path('login/', views.login_attendee, name='login'),
    path('login/attendee/', views.login_attendee, name='login_attendee'),
    path('login/business/', views.login_business, name='login_business'),
    path('password-recovery/', views.password_recovery, name='password_recovery'),
    path('signup/', views.signup_attendee, name='signup_attendee'),
    path('signup/business/', views.signup_business, name='signup_business'),
    path('logout/', views.logout_view, name='logout'),

    # --- SCEGA Admin Routes ---
    path('scega/', lambda request: redirect('scega_login')),
    path('scega/login/', views.login_scega, name='scega_login'),
    path('dashboard/scega/', views.scega_dashboard, name='scega_dashboard'),
    path('dashboard/scega/logout/', views.logout_scega, name='logout_scega'),

    # --- Organizer Routes ---
    path('dashboard/organizer/', views.organizer_dashboard, name='organizer_dashboard'),
    path('dashboard/organizer/delete/<int:event_id>/', views.delete_event, name='delete_event'),
    path('dashboard/organizer/accept_request/<int:req_id>/', views.organizer_accept_request, name='organizer_accept_request'),
    path('dashboard/organizer/reject_request/<int:req_id>/', views.organizer_reject_request, name='organizer_reject_request'),
    path('event/<int:event_id>/', views.event_details, name='event_details'),

    # --- Vendor Routes ---
    path('dashboard/vendor/', views.vendor_dashboard, name='vendor_dashboard'),
    path('dashboard/vendor/accept_request/<int:req_id>/', views.accept_request, name='accept_request'),
    path('dashboard/vendor/reject_request/<int:req_id>/', views.reject_request, name='reject_request'),
    path('dashboard/vendor/withdraw_request/<int:req_id>/', views.withdraw_request, name='withdraw_request'),
    path('dashboard/vendor/apply_for_event/', views.apply_for_event, name='apply_for_event'),

    # Attendee Dashboard (The Page)
    path('dashboard/attendee/', views.attendee_dashboard, name='attendee_dashboard'),

    # Attendee API (The Data Pipeline)
    path('api/attendee/data/', views.api_attendee_data, name='api_attendee_data'),

    # Actions (Register/Cancel)
    path('dashboard/attendee/register/<int:event_id>/', views.attendee_register, name='attendee_register'),
    path('dashboard/attendee/cancel/<int:ticket_id>/', views.attendee_cancel, name='attendee_cancel'),
]