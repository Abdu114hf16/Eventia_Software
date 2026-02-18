from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ORGANIZER', 'Organizer'),
        ('VENDOR', 'Vendor'),
        ('ATTENDEE', 'Attendee'),
        ('SCEGA_ADMIN', 'SCEGA Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='ATTENDEE')
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username

# --- PROFILES ---

class OrganizerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='organizer_profile')
    organization_name = models.CharField(max_length=100)

    def __str__(self):
        return self.organization_name

class VendorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='vendor_profile')
    organization_name = models.CharField(max_length=100, blank=True, null=True)
    service_type = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.service_type}"

class AttendeeProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='attendee_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female')], blank=True, null=True)

    def __str__(self):
        return self.user.username

class Ticket(models.Model):
    attendee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='tickets')
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='tickets')
    purchase_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='ACTIVE')

    def __str__(self):
        return f"{self.attendee.username} - {self.event.title}"


# --- EVENT MODEL ---
class Event(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Published'),
        ('REJECTED', 'Rejected'),
    )
    APPROVAL_CHOICES = (
        ('PENDING', 'Pending License'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected')
    )

    organizer = models.ForeignKey(OrganizerProfile, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    rejection_reason = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    age_restriction = models.PositiveIntegerField(default=0, help_text="Minimum age required (0 for no restriction)")

    date = models.DateField()
    time = models.TimeField()

    # REMOVED DUPLICATE APPROVAL FIELD HERE
    approval = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='PENDING')
    location = models.CharField(max_length=255)
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