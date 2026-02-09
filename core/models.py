from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('ORGANIZER', 'Organizer'),
        ('VENDOR', 'Vendor'),
        ('ATTENDEE', 'Attendee'),
        ('SCEGA', 'SCEGA'),
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
    # Choices for Status
    STATUS_CHOICES = (
        ('UPCOMING', 'Upcoming'),
        ('ONGOING', 'Ongoing'),
        ('PAST', 'Past'), #completed
        ('CANCELLED', 'Cancelled'),
    )

    # Choices for Approval
    APPROVAL_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    CATEGORY_CHOICES = (
        ('Tech', 'Tech'), ('Art', 'Art'), ('Business', 'Business'),
        ('Music', 'Music'), ('Education', 'Education'), ('Sports', 'Sports'), ('Other', 'Other'),
    )

    # Event_ID is handled automatically by Django as the primary key 'id'

    # We link the event to an Organizer (assuming only organizers create events)
    organizer = models.ForeignKey(OrganizerProfile, on_delete=models.CASCADE, related_name='events')

    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPCOMING')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)

    capacity = models.PositiveIntegerField()
    age_restriction = models.PositiveIntegerField(default=0, help_text="Minimum age required (0 for no restriction)")

    date = models.DateField()
    time = models.TimeField()

    approval = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='PENDING')
    location = models.CharField(max_length=255) # Can be an address or Google Maps link

    rejection_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

 @property
    def min_price(self):
        """Helper to display 'From X SAR'"""
        tickets = self.tickets.all()
        if tickets.exists():
            return min([t.price for t in tickets])
        return 0

class TicketCategory(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='tickets')
    name = models.CharField(max_length=100) # e.g. "VIP", "General"
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} - {self.price}"
