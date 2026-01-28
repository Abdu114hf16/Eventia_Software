from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Roles
    ROLE_CHOICES = (
        ('organizer', 'Organizer'),
        ('vendor', 'Vendor'),
        ('attendee', 'Attendee'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    # Vendor Specific
    organization_name = models.CharField(max_length=100, blank=True, null=True)
    SERVICE_TYPES = (
        ('catering', 'Catering'),
        ('venue', 'Venue'),
        ('photography', 'Photography'),
        ('decoration', 'Decoration'),
        ('other', 'Other'),
    )
    service_type = models.CharField(max_length=50, choices=SERVICE_TYPES, blank=True, null=True)

    # Attendee Specific
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')], blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.username