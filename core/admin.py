from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, OrganizerProfile, VendorProfile, AttendeeProfile, Event


# 1. Custom User Admin (Enhanced for Role Management)
class CustomUserAdmin(UserAdmin):
    # Added 'role' and 'is_active' to list_display
    list_display = ('username', 'email', 'role', 'phone_number', 'is_staff', 'is_active')

    # Added filters so you can quickly see all Organizers vs SCEGA Admins
    list_filter = ('role', 'is_staff', 'is_active')

    search_fields = ('username', 'email', 'phone_number')

    # Allow editing Role and Phone in the admin form
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone_number')}),
    )


# ... (Keep OrganizerProfileAdmin, VendorProfileAdmin, AttendeeProfileAdmin as they are) ...

class OrganizerProfileAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'get_username', 'get_email', 'get_phone')
    search_fields = ('organization_name', 'user__username')

    def get_username(self, obj): return obj.user.username

    def get_email(self, obj): return obj.user.email

    def get_phone(self, obj): return obj.user.phone_number


class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ('organization_name', 'service_type', 'get_username')
    list_filter = ('service_type',)
    search_fields = ('organization_name', 'user__username')

    def get_username(self, obj): return obj.user.username


class AttendeeProfileAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'gender', 'date_of_birth')

    def get_username(self, obj): return obj.user.username


# 5. Event Admin (Keep as is)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'status', 'category', 'capacity', 'date', 'time', 'approval', 'ticket_price')
    list_filter = ('status', 'approval', 'category', 'date')
    search_fields = ('title', 'category', 'organizer__organization_name')
    list_editable = ('status', 'approval')


# Registration
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(OrganizerProfile, OrganizerProfileAdmin)
admin.site.register(VendorProfile, VendorProfileAdmin)
admin.site.register(AttendeeProfile, AttendeeProfileAdmin)
admin.site.register(Event, EventAdmin)