from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ORGANIZER', 'Organizer'),
        ('VENDOR', 'Vendor'),
        ('ATTENDEE', 'Attendee'),
        ('SCEGA_ADMIN', 'SCEGA Admin'),  # 1. Added Role
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ATTENDEE')
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username


# --- PROFILES ---

class OrganizerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='organizer_profile')
    organization_name = models.CharField(max_length=100)
    # Bio/Website can go here if needed later

    def __str__(self):
        return self.organization_name


class VendorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='vendor_profile')
    organization_name = models.CharField(max_length=100, blank=True, null=True)
    service_type = models.CharField(max_length=100)
    description = models.TextField(blank=True) # Description is already here

    def __str__(self):
        return f"{self.user.username} - {self.service_type}"


class AttendeeProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='attendee_profile')

    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)

    # Added Preferences field
    #preferences = models.TextField(blank=True, null=True, help_text="User preferences for event types, dietary restrictions, etc.")

    def __str__(self):
        return self.user.username


# --- EVENT MODEL ---

class Event(models.Model):

    # Choices for Approval
    STATUS_CHOICES = (
        ('PENDING', 'Pending Approval'),  # Default when created
        ('APPROVED', 'Published'),  # After SCEGA approves
        ('REJECTED', 'Rejected'),  # After SCEGA rejects
    )
    APPROVAL_CHOICES = (
        ('PENDING', 'Pending License'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected')
    )

    organizer = models.ForeignKey('OrganizerProfile', on_delete=models.CASCADE, related_name='events')
    approval = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='PENDING')  # Default is Pending
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    rejection_reason = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100)


    capacity = models.PositiveIntegerField()
    age_restriction = models.PositiveIntegerField(default=0, help_text="Minimum age required (0 for no restriction)")

    date = models.DateField()
    time = models.TimeField()

    approval = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='PENDING')
    location = models.CharField(max_length=255) # Can be an address or Google Maps link

    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.title
# --- REQUEST MODEL ---

class Request(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='requests')
    vendor = models.ForeignKey(VendorProfile, on_delete=models.CASCADE, related_name='requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    message = models.TextField()
    sent_by = models.CharField(max_length=20, choices=[('ORGANIZER', 'Organizer'), ('VENDOR', 'Vendor')], default='ORGANIZER')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request for {self.event.title} to {self.vendor}"