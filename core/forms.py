from django import forms
from django.contrib.auth import get_user_model
from .models import OrganizerProfile, VendorProfile, AttendeeProfile, Event

User = get_user_model()


class SignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)
    role = forms.ChoiceField(choices=User.ROLE_CHOICES)

    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    gender = forms.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')], required=False)

    organization_name = forms.CharField(required=False)
    service_type = forms.CharField(required=False)
    date_of_birth = forms.DateField(required=False, widget=forms.DateInput(attrs={'type': 'date'}))

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'role', 'first_name', 'last_name']

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")
        role = cleaned_data.get("role")

        if password != confirm_password:
            raise forms.ValidationError("Passwords do not match")

        if role == 'ORGANIZER' and not cleaned_data.get('organization_name'):
            self.add_error('organization_name', 'Organization Name is required for Organizers.')

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])

        user.first_name = self.cleaned_data.get("first_name", "")
        user.last_name = self.cleaned_data.get("last_name", "")

        if commit:
            user.save()
            role = self.cleaned_data.get('role')

            if role == 'ORGANIZER':
                profile, created = OrganizerProfile.objects.get_or_create(user=user)
                profile.organization_name = self.cleaned_data.get('organization_name')
                profile.save()

            elif role == 'VENDOR':
                profile, created = VendorProfile.objects.get_or_create(user=user)
                profile.service_type = self.cleaned_data.get('service_type')
                profile.organization_name = self.cleaned_data.get('organization_name')
                profile.save()

            elif role == 'ATTENDEE':
                profile, created = AttendeeProfile.objects.get_or_create(user=user)
                profile.date_of_birth = self.cleaned_data.get('date_of_birth')
                profile.gender = self.cleaned_data.get('gender')
                profile.save()

        return user
        class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ['title', 'category', 'date', 'time', 'location', 'description']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
            'time': forms.TimeInput(attrs={'type': 'time'}),
            'description': forms.Textarea(attrs={'rows': 5, 'placeholder': 'Describe your event...'}),
        }
