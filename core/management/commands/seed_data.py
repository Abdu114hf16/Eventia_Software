"""
Management command to seed the database with fictional data.
Usage:
    python manage.py seed_data          # seed (skips if already seeded)
    python manage.py seed_data --flush  # wipe seed data and re-seed
"""

import random
from datetime import date, time, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from core.models import (
    OrganizerProfile, VendorProfile, AttendeeProfile,
    Event, Ticket, Request, Message, Broadcast,
)

User = get_user_model()

PASSWORD = 'Test1234!'

# ───────────────────────── RAW DATA ─────────────────────────

ORGANIZERS = [
    ('org_prod_a',       'Productions A'),
    ('org_prod_b',       'Productions B'),
    ('org_prod_c',       'Productions C'),
    ('org_exhibit_a',    'Exhibitions A'),
    ('org_exhibit_b',    'Exhibitions B'),
    ('org_entertain_a',  'Entertainment A'),
    ('org_entertain_b',  'Entertainment B'),
    ('org_conference_a', 'Conferences A'),
    ('org_conference_b', 'Conferences B'),
    ('org_sports_a',     'Sports Events A'),
]

VENDORS = [
    ('vendor_bookstore_a',  'Bookstore A',          'Book Sales',           'We provide a wide selection of books for events and fairs.'),
    ('vendor_bookstore_b',  'Bookstore B',          'Book Sales',           'Specialized in educational and children\'s books.'),
    ('vendor_bookstore_c',  'Bookstore C',          'Book Sales',           'Premium book retail and author signing services.'),
    ('vendor_telecom_a',    'Telecom A',            'Connectivity Services', 'Wi-Fi hotspots and event connectivity solutions.'),
    ('vendor_telecom_b',    'Telecom B',            'Connectivity Services', 'Mobile charging stations and network coverage.'),
    ('vendor_catering_a',   'Catering A',           'Food & Beverages',     'Full-service event catering with Saudi and international cuisine.'),
    ('vendor_catering_b',   'Catering B',           'Food & Beverages',     'Coffee bars, juice stations, and light refreshments.'),
    ('vendor_catering_c',   'Catering C',           'Food & Beverages',     'Large-scale banquet and buffet services.'),
    ('vendor_audio_a',      'Audio Services A',     'Audio & Lighting',     'Professional sound systems and stage lighting.'),
    ('vendor_audio_b',      'Audio Services B',     'Audio & Lighting',     'DJ equipment and ambient event lighting.'),
    ('vendor_printing_a',   'Printing Services A',  'Printing & Signage',   'Banners, flyers, and on-site badge printing.'),
    ('vendor_decor_a',      'Decor Services A',     'Event Decoration',     'Stage setup, floral arrangements, and themed decor.'),
    ('vendor_decor_b',      'Decor Services B',     'Event Decoration',     'Balloon arches, lighting rigs, and custom backdrops.'),
    ('vendor_photo_a',      'Photography A',        'Photography & Video',  'Event photography, drone shots, and highlight reels.'),
    ('vendor_security_a',   'Security Services A',  'Security Services',    'Crowd management, access control, and on-site safety.'),
]

# (title, organizer_index, category, price, status, date_offset_days, time_str, capacity, location, rejection_reason)
# date_offset_days from today (30-60 range for approved/pending, past for some attended)
EVENTS = [
    # ── APPROVED (20) ──
    ('Book Fair 2026',              0, 'Exhibition',     50,  'APPROVED', 32, '09:00', 500, 'Riyadh Front', None),
    ('Tech Summit A',               7, 'Conference',    150,  'APPROVED', 34, '10:00', 300, 'Riyadh Convention Center', None),
    ('Music Night A',               5, 'Entertainment', 200,  'APPROVED', 36, '20:00', 800, 'King Abdullah Park', None),
    ('Startup Pitch A',             1, 'Business',        0,  'APPROVED', 38, '17:00', 200, 'Digital City Hub', None),
    ('Wellness Expo A',             3, 'Exhibition',     30,  'APPROVED', 40, '08:00', 400, 'Jeddah Hilton Hall', None),
    ('Coffee Festival A',           2, 'Food & Culture', 40,  'APPROVED', 42, '10:00', 600, 'Boulevard Riyadh City', None),
    ('Photography Workshop A',      6, 'Workshop',       90,  'APPROVED', 33, '14:00', 100, 'Art District Studio', None),
    ('Marathon 2026',               9, 'Sports',          0,  'APPROVED', 44, '06:00', 2000,'King Fahd Road', None),
    ('Marketing Forum A',           8, 'Conference',    120,  'APPROVED', 35, '09:00', 250, 'Crowne Plaza Riyadh', None),
    ('Children Art Day A',          4, 'Family',         25,  'APPROVED', 46, '10:00', 350, 'Riyadh Park Mall', None),
    ('Food Truck Rally A',          0, 'Food & Culture', 35,  'APPROVED', 37, '16:00', 450, 'Waterfront Jeddah', None),
    ('Heritage Fair A',             3, 'Culture',        60,  'APPROVED', 48, '09:00', 300, 'Diriyah Gate', None),
    ('Coding Bootcamp A',           7, 'Workshop',      180,  'APPROVED', 39, '08:00', 150, 'KAUST Innovation Hub', None),
    ('Film Screening A',            5, 'Entertainment',  70,  'APPROVED', 41, '19:00', 200, 'VOX Cinemas Riyadh', None),
    ('Robotics Expo A',             4, 'Technology',     95,  'APPROVED', 50, '10:00', 400, 'Dhahran Expo Center', None),
    ('Poetry Evening A',            1, 'Culture',         0,  'APPROVED', 43, '19:00', 180, 'King Abdulaziz Library', None),
    ('Fitness Challenge A',         9, 'Sports',         45,  'APPROVED', 52, '07:00', 500, 'Jeddah Corniche', None),
    ('Design Conference A',         8, 'Conference',    130,  'APPROVED', 45, '09:00', 220, 'Hyatt Regency Riyadh', None),
    ('Night Market A',              2, 'Shopping',       20,  'APPROVED', 54, '18:00', 700, 'Al Nakheel Mall Grounds', None),
    ('Science Fair A',              3, 'Education',      15,  'APPROVED', 47, '08:00', 600, 'KFUPM Exhibition Hall', None),

    # ── PENDING (6) ──
    ('AI Workshop A',               7, 'Workshop',      120,  'PENDING', 55, '09:00', 120, 'STC Conference Room', None),
    ('Outdoor Cinema A',            6, 'Entertainment',  80,  'PENDING', 56, '20:00', 350, 'Edge of the World Site', None),
    ('Handicrafts Market A',        4, 'Exhibition',     45,  'PENDING', 57, '10:00', 250, 'Souq Okaz Grounds', None),
    ('E-Sports Tournament A',       5, 'Gaming',        100,  'PENDING', 58, '14:00', 500, 'Gamers Arena Riyadh', None),
    ('Women In Tech A',             8, 'Conference',      0,  'PENDING', 53, '10:00', 200, 'Princess Noura University', None),
    ('Cooking Contest A',           2, 'Food & Culture', 55,  'PENDING', 59, '11:00', 300, 'Culinary Academy Hall', None),

    # ── REJECTED (4) ──
    ('Unapproved Car Meet A',       9, 'Automotive',     50, 'REJECTED', 31, '15:00', 400, 'Open Desert Area',
     'This event was rejected because the organizer did not provide a valid venue safety license as required by SCEGA regulations.'),
    ('Late Gala Submission A',      6, 'Entertainment', 300, 'REJECTED', 33, '20:00', 250, 'Palace Ballroom',
     'This event was rejected because the application was received after the SCEGA review deadline for this quarter. Please resubmit in the next review cycle.'),
    ('Incomplete Proposal A',       0, 'Business',       75, 'REJECTED', 35, '10:00', 150, 'Office Tower B',
     'This event was rejected because the proposal is missing critical details including the emergency evacuation plan and crowd management strategy required by SCEGA.'),
    ('Budget Review Pending A',     3, 'Exhibition',     80, 'REJECTED', 37, '09:00', 200, 'Exhibition Hall C',
     'This event was rejected because the submitted financial plan does not meet SCEGA minimum requirements. The budget lacks a clear breakdown of safety and insurance costs.'),
]

# Saudi first names and family names
MALE_FIRST = [
    'Faisal', 'Khalid', 'Omar', 'Tariq', 'Youssef', 'Abdulaziz', 'Fahad', 'Nawaf',
    'Sultan', 'Mansour', 'Badr', 'Hamad', 'Turki', 'Saud', 'Nasser', 'Bandar',
    'Majed', 'Waleed', 'Saad', 'Ibrahim', 'Mohammed', 'Abdullah', 'Rakan', 'Anas',
    'Muhannad', 'Ziyad', 'Thamir', 'Mishal', 'Raed', 'Aws', 'Hatim', 'Naif',
    'Saleh', 'Bader', 'Hatem', 'Faris', 'Adel', 'Thamer', 'Yazeed', 'Talal',
]

FEMALE_FIRST = [
    'Nora', 'Sara', 'Lina', 'Hana', 'Reem', 'Maha', 'Dalal', 'Amira',
    'Layla', 'Wafa', 'Ghada', 'Salma', 'Nouf', 'Arwa', 'Yara', 'Dana',
    'Joud', 'Shahad', 'Abeer', 'Lamia', 'Aisha', 'Munira', 'Bashayer', 'Atheer',
    'Hadeel', 'Rahaf', 'Deema', 'Lujain', 'Aseel', 'Taif', 'Waad', 'Raneem',
    'Haneen', 'Njoud', 'Razan', 'Bayan', 'Afnan', 'Renad', 'Janan', 'Dania',
]

FAMILY_NAMES = [
    'Al-Rashid', 'Al-Dosari', 'Al-Otaibi', 'Al-Harbi', 'Al-Ghamdi', 'Al-Shehri',
    'Al-Zahrani', 'Al-Qahtani', 'Al-Malki', 'Al-Subai', 'Al-Mutairi', 'Al-Tamimi',
    'Al-Shahrani', 'Al-Ajmi', 'Al-Dawsari', 'Al-Sulaiman', 'Al-Yami', 'Al-Anazi',
    'Al-Bishi', 'Al-Khaldi', 'Al-Juhani', 'Al-Ruwaili', 'Al-Marri', 'Al-Fadhli',
    'Al-Harthy', 'Al-Shamrani', 'Al-Asiri', 'Al-Dossary', 'Al-Buainain', 'Al-Salem',
]

JOB_TITLES = [
    'Software Engineer', 'Graphic Designer', 'Accountant', 'Marketing Manager',
    'University Student', 'Dentist', 'Teacher', 'Architect', 'Civil Engineer',
    'Pharmacist', 'Business Analyst', 'Journalist', 'Freelancer', 'Interior Designer',
    'IT Specialist', 'HR Manager', 'Mechanical Engineer', 'Nutritionist', 'Lawyer',
    'Data Analyst', 'Pilot', 'Professor', 'Entrepreneur', 'Translator', 'Chef',
    'Doctor', 'Nurse', 'Photographer', 'Writer', 'Financial Advisor',
    None, None, None, None, None, None, None, None,  # ~20% null
]

FEEDBACK_POOL = [
    'Great event, very well organized!',
    'Enjoyed every moment, will definitely come again.',
    'Good experience overall, the venue was excellent.',
    'Wonderful atmosphere and friendly staff.',
    'Exceeded my expectations, highly recommended.',
    'The event was informative and engaging.',
    'Loved the variety of activities available.',
    'Well planned, smooth entry and exit process.',
    'Amazing speakers and great networking opportunities.',
    'The food options were excellent.',
    'Would recommend this to friends and family.',
    'Very professional organization from start to finish.',
    'The location was perfect for this type of event.',
    'Had a fantastic time, looking forward to next year.',
    'Good value for the ticket price.',
    'Some areas were crowded but otherwise great.',
    'The workshops were very hands-on and useful.',
    'Beautiful venue and great event layout.',
    'Learned a lot, very educational experience.',
    'Fun for the whole family, kids loved it too.',
]

VENDOR_MESSAGES = [
    'We would like to offer our services for this event.',
    'Our team has experience with similar events and can deliver high-quality service.',
    'We are available on the event date and ready to participate.',
    'Please consider us for this event, we have all required permits.',
    'We can provide a customized package for your event needs.',
    'Our equipment is top-of-the-line and fully maintained.',
    'We have served over 50 events in the region successfully.',
    'Happy to discuss specific requirements for this event.',
]

ORGANIZER_MESSAGES = [
    'Can you confirm your setup time?',
    'Please send us your updated price list.',
    'We need you on-site by 7 AM for setup.',
    'How many staff members will you bring?',
    'Please confirm the equipment list.',
    'Do you need power outlets at your station?',
]

VENDOR_REPLY_MESSAGES = [
    'We will be there by 7 AM as requested.',
    'Price list has been sent to your email.',
    'Our team of 5 will handle the setup.',
    'All equipment confirmed and ready.',
    'We have our own power generators, no outlets needed.',
    'Everything is on track, see you on event day.',
]

BROADCAST_MESSAGES = [
    'Reminder: The event starts at the scheduled time. Please arrive 30 minutes early.',
    'Parking is available at Gate B. Follow the signs from the main road.',
    'Welcome! Please check in at the registration desk upon arrival.',
    'Weather update: The event will proceed as planned. Light refreshments provided.',
    'Thank you for registering! Your e-ticket has been confirmed.',
    'Important: Please bring a valid ID for entry verification.',
    'We are excited to see you! Share your experience with #EventName on social media.',
    'Last chance to register — limited spots remaining!',
    'Schedule update: The keynote session has been moved to Hall B.',
    'Thank you for attending! We hope you enjoyed the event.',
]


class Command(BaseCommand):
    help = 'Seed the database with fictional data for testing'

    def add_arguments(self, parser):
        parser.add_argument('--flush', action='store_true', help='Wipe seed data before re-seeding')

    def handle(self, *args, **options):
        if options['flush']:
            self.stdout.write('Flushing seed data...')
            self._flush()

        if User.objects.filter(username='org_prod_a').exists():
            self.stdout.write(self.style.WARNING('Seed data already exists. Use --flush to re-seed.'))
            return

        self.stdout.write('Seeding database...')

        organizer_profiles = self._create_organizers()
        vendor_profiles = self._create_vendors()
        events = self._create_events(organizer_profiles)
        attendee_users = self._create_attendees(300)

        approved_events = [e for e in events if e.status == 'APPROVED']
        self._create_tickets(attendee_users, approved_events)
        self._create_vendor_requests(vendor_profiles, approved_events)
        self._create_messages(approved_events)
        self._create_broadcasts(approved_events)

        self.stdout.write(self.style.SUCCESS('Seeding complete!'))
        self._print_summary()

    # ───────────────── CREATORS ─────────────────

    def _create_organizers(self):
        profiles = []
        for username, org_name in ORGANIZERS:
            user = User.objects.create_user(
                username=username,
                password=PASSWORD,
                email=f'{username}@example.com',
                first_name=org_name.split()[0],
                last_name=org_name.split()[-1],
                role='ORGANIZER',
            )
            # Signal auto-creates OrganizerProfile, so update it
            profile = user.organizer_profile
            profile.organization_name = org_name
            profile.save()
            profiles.append(profile)
            self.stdout.write(f'  Organizer: {org_name}')
        return profiles

    def _create_vendors(self):
        profiles = []
        for username, org_name, service, desc in VENDORS:
            user = User.objects.create_user(
                username=username,
                password=PASSWORD,
                email=f'{username}@example.com',
                first_name=org_name.split()[0],
                last_name=org_name.split()[-1],
                role='VENDOR',
            )
            profile = VendorProfile.objects.create(
                user=user,
                organization_name=org_name,
                service_type=service,
                description=desc,
            )
            profiles.append(profile)
            self.stdout.write(f'  Vendor: {org_name} ({service})')
        return profiles

    def _create_events(self, organizer_profiles):
        events = []
        today = date.today()
        for row in EVENTS:
            title, org_idx, category, price, status, day_offset, t, cap, loc, reason = row
            hour, minute = map(int, t.split(':'))
            evt = Event.objects.create(
                organizer=organizer_profiles[org_idx],
                title=title,
                description=f'{title} is an exciting event in the {category.lower()} category, '
                            f'taking place at {loc}. Join us for a memorable experience!',
                status=status,
                rejection_reason=reason,
                category=category,
                capacity=cap,
                date=today + timedelta(days=day_offset),
                time=time(hour, minute),
                location=loc,
                ticket_price=Decimal(str(price)),
                approval='APPROVED' if status == 'APPROVED' else 'PENDING',
            )
            events.append(evt)
            self.stdout.write(f'  Event: {title} [{status}]')
        return events

    def _create_attendees(self, count):
        users = []
        used_usernames = set()
        for i in range(count):
            if i % 2 == 0:
                first = random.choice(MALE_FIRST)
                gender = 'M'
            else:
                first = random.choice(FEMALE_FIRST)
                gender = 'F'
            last = random.choice(FAMILY_NAMES)

            base = f'{first.lower()}.{last.lower().replace("-", "").replace("al", "", 1).strip()}'
            username = base
            suffix = 1
            while username in used_usernames:
                username = f'{base}{suffix}'
                suffix += 1
            used_usernames.add(username)

            job = random.choice(JOB_TITLES)
            dob_year = random.randint(1975, 2004)
            dob_month = random.randint(1, 12)
            dob_day = random.randint(1, 28)

            user = User.objects.create_user(
                username=username,
                password=PASSWORD,
                email=f'{username}@example.com',
                first_name=first,
                last_name=last,
                role='ATTENDEE',
            )
            # Signal auto-creates AttendeeProfile, so update it
            profile = user.attendee_profile
            profile.date_of_birth = date(dob_year, dob_month, dob_day)
            profile.gender = gender
            profile.job_title = job
            profile.save()
            users.append(user)

        self.stdout.write(f'  Created {count} attendees')
        return users

    def _create_tickets(self, attendees, approved_events):
        count = 0
        for attendee in attendees:
            num_events = random.randint(2, 5)
            chosen = random.sample(approved_events, min(num_events, len(approved_events)))
            for evt in chosen:
                attended = random.random() < 0.4
                rating = random.randint(3, 5) if attended else None
                feedback = random.choice(FEEDBACK_POOL) if attended else None

                Ticket.objects.create(
                    attendee=attendee,
                    event=evt,
                    status='ACTIVE',
                    ticket_type='Standard',
                    amount_paid=evt.ticket_price,
                    attended=attended,
                    rating=rating,
                    feedback=feedback,
                )
                count += 1

        self.stdout.write(f'  Created {count} tickets/registrations')

    def _create_vendor_requests(self, vendor_profiles, approved_events):
        count = 0
        statuses = ['APPROVED', 'APPROVED', 'APPROVED', 'PENDING', 'PENDING', 'REJECTED']
        prep_statuses = ['Preparing', 'In Transit', 'Setting Up', 'Ready']

        for evt in approved_events:
            num_vendors = random.randint(1, 3)
            chosen_vendors = random.sample(vendor_profiles, min(num_vendors, len(vendor_profiles)))
            for vendor in chosen_vendors:
                status = random.choice(statuses)
                req = Request.objects.create(
                    event=evt,
                    vendor=vendor,
                    status=status,
                    message=random.choice(VENDOR_MESSAGES),
                    sent_by='VENDOR',
                    preparation_status=random.choice(prep_statuses) if status == 'APPROVED' else 'Pending',
                )
                count += 1

        self.stdout.write(f'  Created {count} vendor requests')

    def _create_messages(self, approved_events):
        count = 0
        for evt in approved_events:
            approved_requests = Request.objects.filter(event=evt, status='APPROVED')
            for req in approved_requests:
                if random.random() < 0.5:
                    continue
                Message.objects.create(
                    event=evt, vendor=req.vendor, sender='organizer',
                    text=random.choice(ORGANIZER_MESSAGES),
                )
                Message.objects.create(
                    event=evt, vendor=req.vendor, sender='vendor',
                    text=random.choice(VENDOR_REPLY_MESSAGES),
                )
                count += 2

        self.stdout.write(f'  Created {count} messages')

    def _create_broadcasts(self, approved_events):
        count = 0
        for evt in approved_events:
            num = random.randint(0, 2)
            for _ in range(num):
                Broadcast.objects.create(
                    event=evt,
                    message=random.choice(BROADCAST_MESSAGES),
                )
                count += 1

        self.stdout.write(f'  Created {count} broadcasts')

    # ───────────────── FLUSH ─────────────────

    def _flush(self):
        seed_usernames = [u for u, _ in ORGANIZERS] + [u for u, _, _, _ in VENDORS]
        Broadcast.objects.all().delete()
        Message.objects.all().delete()
        Request.objects.all().delete()
        Ticket.objects.all().delete()
        Event.objects.all().delete()
        AttendeeProfile.objects.all().delete()
        VendorProfile.objects.all().delete()
        OrganizerProfile.objects.all().delete()
        User.objects.filter(username__in=seed_usernames).delete()
        User.objects.filter(role='ATTENDEE').delete()
        self.stdout.write('  Flushed all seed data.')

    def _print_summary(self):
        self.stdout.write('\n--- Summary ---')
        self.stdout.write(f'  Users:        {User.objects.count()}')
        self.stdout.write(f'  Organizers:   {OrganizerProfile.objects.count()}')
        self.stdout.write(f'  Vendors:      {VendorProfile.objects.count()}')
        self.stdout.write(f'  Attendees:    {AttendeeProfile.objects.count()}')
        self.stdout.write(f'  Events:       {Event.objects.count()}')
        self.stdout.write(f'  Tickets:      {Ticket.objects.count()}')
        self.stdout.write(f'  Requests:     {Request.objects.count()}')
        self.stdout.write(f'  Messages:     {Message.objects.count()}')
        self.stdout.write(f'  Broadcasts:   {Broadcast.objects.count()}')
