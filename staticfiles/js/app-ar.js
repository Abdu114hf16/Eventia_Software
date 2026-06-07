// =============================
// Language Switcher
// =============================
const I18N = {
    en: {
    // ======================
    // Common
    // ======================
        "search.placeholder": "Search for events, workshops, conferences...",
        "search.allCities": "All Cities",
        "city.riyadh": "Riyadh",
        "city.jeddah": "Jeddah",
        "city.dammam": "Dammam",
        "city.mecca": "Mecca",
        "city.alula": "Al Ula",
        "city.dhahran": "Dhahran",
        "city.kaust": "KAUST",
        "city.kfupm": "KFUPM",
        "search.button": "Search",

        "cat.all": "All Events",
        "cat.tech": "Tech",
        "cat.technology": "Technology",
        "cat.art": "Art",
        "cat.business": "Business",
        "cat.music": "Music",
        "cat.education": "Education",
        "cat.sports": "Sports",
        "cat.other": "Other",
        "cat.conference": "Conference",
        "cat.exhibition": "Exhibition",
        "cat.entertainment": "Entertainment",
        "cat.workshop": "Workshop",
        "cat.foodCulture": "Food & Culture",
        "cat.culture": "Culture",
        "cat.family": "Family",
        "cat.shopping": "Shopping",
        "cat.gaming": "Gaming",
        "cat.automotive": "Automotive",
        "events.upcoming": "Upcoming Events",
        "events.subtitle": "Don't miss out on these exciting upcoming events across Saudi Arabia",
        "events.loadMore": "Load More Events",

        "landing.resetFilters": "Reset Filters",
        "landing.noEventsEmpty": "No events found. Check back later!",
        "landing.noSearchResults": "No events match your search. Try different keywords.",
        "landing.price.from": "From",

        "footer.brandDesc": "Saudi Arabia's leading event management platform. Connecting organizers, vendors, and attendees for exceptional experiences.",
        "footer.platform": "Platform",
        "footer.quickLinks": "Quick Links",
        "footer.browseEvents": "Browse Events",
        "footer.createAccount": "Create Account",
        "footer.forOrganizers": "For Organizers",
        "footer.forVendors": "For Vendors",
        "footer.cities": "Cities",
        "footer.copyright": "© 2026 Eventia. All rights reserved.",
        "footer.madeWith": "Made with",
        "footer.inSaudi": "in Saudi Arabia",

        "common.catering": "Catering",
        "common.venues": "Venues",
        "common.photography": "Photography",
        "common.decoration": "Decoration",
        "common.av": "AV & Sound",
        "common.entertainment": "Entertainment",
        "common.security": "Security",
        "common.transport": "Transport",
        "common.floral": "Floral",
        "common.traditional": "Traditional",
        "common.government": "Government",
        "common.allCategories": "All Categories",
        "common.bakeryDesserts": "Bakery & Desserts",
        "common.beverages": "Beverages",
        "common.foodTrucks": "Food Trucks",
        "common.venue": "Venue",
        "common.conferenceHall": "Conference Hall",
        "common.outdoorVenue": "Outdoor Venue",
        "common.avEquipment": "AV Equipment",
        "common.audioLighting": "Audio & Lighting",
        "common.ledScreens": "LED Screens",
        "common.stageRigging": "Stage & Rigging",
        "common.liveStreaming": "Live Streaming",
        "common.floralDesign": "Floral Design",
        "common.balloonDecor": "Balloon Decor",
        "common.eventLighting": "Event Lighting",
        "common.aerialPhotography": "Aerial Photography",
        "common.photoBooth": "Photo Booth",
        "common.dj": "DJ Services",
        "common.liveEntertainment": "Live Entertainment",
        "common.kidsEntertainment": "Kids Entertainment",
        "common.traditionalMusic": "Traditional Music",
        "common.fireworks": "Fireworks & Pyro",
        "common.transportation": "Transportation",
        "common.shuttle": "Shuttle Services",
        "common.valet": "Valet Parking",
        "common.vipSecurity": "VIP Security",
        "common.medical": "Medical Services",
        "common.eventStaff": "Event Staff",
        "common.translation": "Translation",
        "common.mcHosting": "MC & Hosting",
        "common.tents": "Tent Rentals",
        "common.furniture": "Furniture Rentals",
        "common.tableChair": "Table/Chair Rentals",
        "common.power": "Power Supply",
        "common.printing": "Printing",
        "common.bookSales": "Book Sales",
        "common.connectivityServices": "Connectivity Services",
        "common.foodBeverages": "Food & Beverages",
        "common.printingSignage": "Printing & Signage",
        "common.photographyVideo": "Photography & Video",
        "common.securityServices": "Security Services",
        "common.socialMedia": "Social Media Marketing",
        "common.influencer": "Influencer Marketing",
        "common.governmentPermits": "Government Permits",
        "common.safetyPermits": "Safety Permits",
        "common.sponsors": "Sponsors",
        "common.brandPartners": "Brand Partners",
        "common.henna": "Henna Artists",
        "common.falconry": "Falconry Shows",
        "common.horseShows": "Horse Shows",
        "common.perfumes": "Arabian Perfumes",
        "common.calligraphy": "Arabic Calligraphy",
        "common.vrAr": "VR/AR Experiences",
        "common.eco": "Eco-Friendly Services",
        "common.gifts": "Gifts & Giveaways",
        "common.audioVisual": "Audio Visual",
        "common.florists": "Florists",
        "common.cleaning": "Cleaning",
        "common.professionalServices": "Professional Services",
        "common.eventDecoration": "Event Decoration",
        "common.permitsLicensing": "Permits & Licensing",
        "common.facilities": "Facilities",
        "common.specialEffects": "Special Effects",
        "common.childrenServices": "Children Services",
        "common.technology": "Technology",
        "common.viewAll": "View All",
        "common.cancel": "Cancel",
        "common.allStatus": "All Status",
        "common.searchEvents": "Search events...",
        "common.date": "Date",
        "common.actions": "Actions",
        "common.categories": "Categories:",
        "common.category": "Category",
        "common.description": "Description",
        "common.allLocations": "All Locations",
        "common.all": "All",
        "common.overview": "Overview",
        "common.pending": "Pending",
        "common.notSet": "Not Set",
        "common.dashNotSet": "— Not Set",
        "common.title": "Title",
        "common.save": "Save",
        "common.edit": "Edit",
        "common.delete": "Delete",
        "common.close": "Close",
        "common.view": "View",
        "common.viewDetails": "View Details",
        "common.download": "Download",
        "common.vendor": "Vendor",
        "common.name": "Name:",
        "common.email": "Email:",
        "common.service": "Service",
        "common.servicecolon": "Service:",
        "common.allEvents": "All Events",
        "common.eventDetails": "Event Details",
        "common.approved": "Approved",
        "common.message": "Message",
        "common.messageStar": "Message *",
        "common.optional": "(optional)",
        "common.approve": "Approve",
        "common.reject": "Reject",
        "common.firstName": "First Name",
        "common.lastName": "Last Name",
        "common.emailAddress": "Email Address",
        "common.phoneNumber": "Phone Number",
        "common.password": "Password",
        "common.confirmPassword": "Confirm Password",
        "common.free": "Free",
        "common.from": "From",
        "common.currencySar": "SAR",
        "common.status": "Status",
        "common.details": "Details",
        "common.notAvailable": "N/A",
        "common.tbd": "TBD",
        "common.unknown": "Unknown",
        "common.today": "Today",
        "common.ended": "Ended",
        "common.you": "You",
        "common.unknownEvent": "Unknown Event",
        "common.time": "Time",
        "common.location": "Location",
        "common.description": "Description",
        "common.general": "General",
        "common.event": "Event",
        "policy.flexible": "Flexible",
        "policy.moderate": "Moderate",
        "policy.strict": "Strict",
        "policy.nonRefundable": "Non-refundable",
        "policy.moderate14days": "Moderate (14 days)",
        "policy.strict30days": "Strict (30 days)",


        "nav.home": "Home",
        "nav.login": "Log In",
        "nav.signup": "Sign Up",
        "lang.switch.aria": "Switch language",
        "landing.nav.dashboard": "Dashboard",
        "landing.nav.logout": "Logout",
        "hero.title": "Discover & Manage <br><span class=\"hero-title-gradient\">Exceptional Events</span>",
        "hero.desc":
            "The centralized platform for seamless event management in Saudi Arabia. Connect with organizers, vendors, and attendees in one place.",
        "hero.browse": "Browse Events",
        "hero.create": "Create Event",
        "hero.premium": "Premium Events",
        "event.viewDetails": "View Details",
        "login.title": "Welcome Back",
        "login.subtitle.attendee": "Login as an Attendee",
        "login.emailOrPhone": "Email Address or Phone Number",
        "login.password": "Password",
        "login.forgot": "Forgot Password?",
        "login.remember": "Remember me",
        "login.signin": "Sign In",
        "login.vendorOrg.q": "Are you a vendor or organizer?",
        "login.vendorOrg.btn": "Sign in as Vendor or Organizer",
        "login.new": "New to Eventia?",
        "login.create": "Create an account",
        "common.backHome": "Back to Home",
        "bLogin.title": "Business Login",
        "bLogin.subtitle": "Access your vendor or organizer dashboard",
        "bLogin.roleLabel": "I am a(n):",
        "bLogin.vendor": "Vendor",
        "bLogin.organizer": "Organizer",
        "bLogin.signInAs": "Sign In as",
        "bLogin.attendQuestion": "Just looking to attend events?",
        "bLogin.signInAttendee": "Sign in as Attendee",
        "bLogin.newTo": "New to Eventia?",
        "bLogin.createBusiness": "Create a business account",
        "signup.bizPrompt": "Want to host or provide services?",
        "signup.bizBtn": "Sign up as Vendor or Organizer",
        "signup.haveAccount": "Already have an account?",
        "signup.login": "Log in",
        "signup.subtitle": "Join Eventia as an Attendee",

        "signup.form.username": "Username",
        "signup.form.vendorName": "Vendor Name",
        "signup.form.serviceType": "Service Type",
        "signup.form.selectServiceType": "Select Service Type",
        "signup.form.gender": "Gender",
        "signup.form.selectGender": "Select Gender",
        "signup.form.birthday": "Birthday",
        "signup.form.month": "Month",
        "signup.form.day": "Day",
        "signup.form.year": "Year",
        "signup.gender.male": "Male",
        "signup.gender.female": "Female",
        "signup.validation.invalidEmail": "Please enter a valid email address",
        "signup.validation.passwordPolicy": "Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.",
        "signup.validation.passwordsNoMatch": "Passwords do not match",
        "signup.placeholder.strongPassword": "Create a strong password",
        "signup.placeholder.reenterPassword": "Re-enter password",
        "signup.service.venueHall": "Venue / Hall",
        "signup.vendor.ogFood": "Food & Beverages",
        "signup.vendor.ogVenues": "Venues",
        "signup.vendor.ogAv": "AV & Technology",
        "signup.vendor.ogDecor": "Decoration & Design",
        "signup.vendor.ogPhoto": "Photography & Media",
        "signup.vendor.ogEnt": "Entertainment",
        "signup.vendor.ogTransport": "Transportation",
        "signup.vendor.ogSecurity": "Security & Safety",
        "signup.vendor.ogStaff": "Staffing & Services",
        "signup.vendor.ogRentals": "Rentals & Equipment",
        "signup.vendor.ogMarketing": "Marketing & Promotion",
        "signup.vendor.ogGov": "Government & Permits",
        "signup.vendor.ogSponsors": "Sponsors & Partners",
        "signup.vendor.ogSaudi": "Saudi Cultural",
        "signup.vendor.ogSpecial": "Specialized Services",
        "signup.month.1": "January",
        "signup.month.2": "February",
        "signup.month.3": "March",
        "signup.month.4": "April",
        "signup.month.5": "May",
        "signup.month.6": "June",
        "signup.month.7": "July",
        "signup.month.8": "August",
        "signup.month.9": "September",
        "signup.month.10": "October",
        "signup.month.11": "November",
        "signup.month.12": "December",

        "biz.registerAsLabel": "Register as:",
        "biz.attendPrompt": "Just want to attend events?",
        "biz.attendBtn": "Sign up as Attendee",
        "biz.signupTitle": "Business Account",
        "biz.signupSubtitle": "Register as a Vendor or Organizer",
        "biz.signUpAs": "Sign Up as",

        "msg.invalidCredentials": "Invalid credentials.",
        "msg.invalidBusinessCredentials": "Invalid business credentials.",
        "msg.validationFailed": "Signup failed. Please check your information.",
        "msg.loggedOutSuccessfully": "You have been successfully logged out.",
        "msg.scegaAccessDenied": "Access Denied. SCEGA Admins only.",
        "login.error.emptyUsername": "Please enter your username.",
        "login.error.emptyPassword": "Please enter your password.",
        "signup.error.strength.prefix": "Password must include: ",
        "signup.error.atLeast8": "at least 8 characters",
        "signup.error.uppercase": "1 uppercase letter",
        "signup.error.lowercase": "1 lowercase letter",
        "signup.error.number": "1 number",
        "signup.error.special": "1 special character",

    // ======================
    // Organizer page
    // ======================
        "org.page.overviewTitle": "Dashboard Overview",
        "org.page.createEventTitle": "Create New Event",
        "org.page.eventsListTitle": "My Events",
        "org.page.eventManageTitle": "Event Management",
        "org.page.vendorsTitle": "Vendor Marketplace",
        "org.page.requestsTitle": "Manage Requests",
        "org.page.analyticsTitle": "Event Analytics",
        "org.page.profileTitle": "My Profile",
        "org.page.dashboardFallback": "Dashboard",
        "org.nav.overview": "Dashboard",
        "org.nav.createEvent": "Create Event",
        "org.nav.eventsList": "Events List",
        "org.nav.vendors": "Vendors",
        "org.nav.requests": "Requests",
        "org.nav.analytics": "Analytics",
        "org.empty.noEventsFull": "No upcoming events yet. Create one and wait for SCEGA approval.",
        "org.nav.logout": "Logout",

        "org.stats.totalEvents": "Total Events",
        "org.stats.upcoming": "Upcoming",
        "org.section.recentEvents": "Recent Events",
        "org.empty.noEvents": "No events created yet.",
        "org.events.emptyListBanner": "No events found. Create your first event!",

        "org.form.basicInfo": "Basic Information",
        "org.form.dateLocation": "Date & Location",
        "org.form.tickets": "Tickets",
        "org.form.eventTitle": "Event Title *",
        "org.form.category": "Category *",
        "org.form.selectCategory": "Select a category",
        "org.form.date": "Date *",
        "org.form.time": "Time *",
        "org.form.venue": "Venue / Location *",
        "org.form.description": "Description *",
        "org.form.ticketCategories": "Ticket Categories *",
        "org.form.totalEventCapacity": "Total Event Capacity *",
        "org.form.totalEventCapacityHelp": "Maximum total number of attendees allowed for this event.",
        "org.btn.addCategory": "Add Another Category",
        "org.form.banner": "Event Banner",
        "org.upload.hint": "Click to upload banner",
        "org.form.bannerRemove": "Remove banner",
        "org.upload.fileTooLarge": "File is too large. Please choose an image under 5 MB.",
        "org.upload.formats": "PNG, JPG, WEBP — up to 5MB",
        "org.validation.selectEventTime": "Please select an event time.",
        "org.btn.publish": "Publish Event",
        "org.btn.create": "+ Create",

        "org.ph.eventTitle": "e.g. Annual Tech Summit 2026",
        "org.ph.eventDate": "dd/mm/yyyy",
        "org.ph.eventTime": "--:-- --",
        "org.aria.pickTime": "Choose event time",
        "org.ph.eventCapacity": "e.g. 500",
        "org.form.venuePh": "e.g. Riyadh Front Exhibition Center, Hall A",
        "org.form.descriptionPh": "Describe your event, what attendees can expect, key highlights, speakers, etc...",
        "org.form.ticketDefaultName": "Standard",
        "org.ticket.namePh": "Name (e.g. General)",
        "org.ticket.pricePh": "Price",
        "org.ticket.capacityPh": "Max Attendees",
        "org.ph.vendorSearch": "Search vendors by name or service...",
        "org.scegaApproval": "SCEGA Approval",

        "org.vendors.heroTitle": "Find Your Perfect Vendors",
        "org.vendors.heroDesc": "Explore categories, compare options, and send requests to top-rated vendors",
        "org.nav.profile": "Profile",
        "org.profile.role": "Organizer",

        "org.form.withdrawalPolicies": "Withdrawal Policies",

        "org.policy.vendorLabel": "Vendor Policy *",
        "org.policy.vendorChoose": "Choose vendor policy...",
        "org.policy.vendor.flexibleDesc": "Flexible — Vendors can withdraw up to 7 days before event",
        "org.policy.vendor.moderateDesc": "Moderate — Up to 14 days before event",
        "org.policy.vendor.strictDesc": "Strict — Up to 30 days before event",
        "org.policy.vendor.nonRefundableDesc": "Non-refundable — No withdrawal allowed",
        "org.policy.vendor.notConfigured": "No vendor withdrawal policy has been configured for this event.",
        "org.policy.vendor.help": "Applies to vendors participating in the event.",
        "org.policy.vendor.helpEvent": "Applies to vendors participating in this event.",

        "org.policy.attendeeLabel": "Attendee Policy *",
        "org.policy.attendeeChoose": "Choose attendee policy...",
        "org.policy.attendee.flexibleDesc": "Flexible — Full refund up to 1 day before",
        "org.policy.attendee.moderateDesc": "Moderate — Full refund up to 7 days before",
        "org.policy.attendee.strictDesc": "Strict — Full refund up to 30 days before",
        "org.policy.attendee.nonRefundableDesc": "Non-refundable — No refunds allowed",
        "org.policy.attendee.notConfigured": "No attendee refund policy has been configured for this event.",
        "org.policy.attendee.help": "Applies to attendees buying tickets to the event.",
        "org.policy.attendee.helpShort": "Applies to attendees purchasing tickets.",

        "status.pendingApproval": "Pending Approval",
        "status.ongoing": "Ongoing",
        "status.past": "Past",
        "status.upcoming": "Upcoming",
        "status.rejected": "Rejected",
        "status.approved": "Approved",
        "status.pendingReview": "Pending Review",

        "org.em.eventTitle": "Event Title",
        "org.em.eventStatus": "Event Status",
        "org.em.totalVendors": "Total Vendors",
        "org.em.attendees": "Attendees",
        "org.em.daysLeft": "Days Left",
        "org.em.tab.vendors": "Vendors",
        "org.em.tab.communication": "Communication",
        "org.em.editDescription": "Edit description",
        "org.em.ticketTiers": "Ticket Tiers",
        "org.em.inviteVendor": "Invite Vendor",
        "org.em.vendorsCountDefault": "0 vendors",
        "org.em.vendorMessages": "Vendor Messages",
        "org.em.attendeeBroadcast": "Attendee Broadcast",
        "org.em.newBroadcast": "New Broadcast to All Attendees",
        "org.em.broadcastPh": "Type your announcement for all attendees...",
        "org.em.sendBroadcast": "Send Broadcast",
        "org.em.pastBroadcasts": "Past Broadcasts",
        "org.em.editEvent": "Edit Event",
        "org.em.editEventDesc": "Modify event details, tickets, policies, and more.",
        "org.em.deleteEvent": "Delete Event",
        "org.em.deleteEventDesc": "Permanently remove this event and all associated data.",
        "org.em.vendorName": "Vendor Name",
        "org.em.chatPh": "Type a message...",
        "org.em.vendorStatus": "Vendor Status",
        "org.em.noTicketTiers": "No ticket tiers defined.",
        "org.em.deleteConfirm": "Are you sure you want to delete this event? This action cannot be undone.",
        "org.em.deleteSuccess": "Event deleted successfully.",
        "org.em.descriptionEmpty": "Description cannot be empty.",
        "org.em.descriptionUpdated": "Description updated successfully!",
        "org.em.vendorSingular": "vendor",
        "org.em.vendorPlural": "vendors",
        "org.em.noVendorsAssigned": "No vendors assigned yet. Invite vendors from the marketplace.",
        "org.em.updateRequested": "Update Requested",
        "org.em.updateAlreadyRequested": "Update already requested",
        "org.em.requested": "Requested",
        "org.em.askVendorUpdate": "Ask vendor to update their status",
        "org.em.requestUpdate": "Request Update",
        "org.em.removeVendorConfirm": "Remove this vendor from the event?",
        "org.em.vendorRemoved": "Vendor removed from event.",
        "org.em.updateRequestSent": "Update request sent to vendor!",
        "org.em.noVendorConversations": "No vendor conversations yet.",
        "org.em.noMessagesYet": "No messages yet",
        "org.em.noChatMessages": "No messages yet. Start the conversation!",
        "org.em.noBroadcasts": "No broadcasts sent yet.",
        "org.em.broadcast": "Broadcast",
        "org.em.broadcastSent": "Broadcast sent to all attendees!",

        "vendor.preparation": "Preparation",
        "vendor.prep.pending": "Pending",
        "vendor.prep.preparing": "Start preparing at premises",
        "vendor.prep.inTransit": "Finish preparing at premises",
        "vendor.prep.settingUp": "Setting up in location",
        "vendor.prep.ready": "Ready",
        "vendor.status.confirmed": "Confirmed",

        "org.policy.vendorLabelPlain": "Vendor Policy",
        "org.policy.attendeeLabelPlain": "Attendee Policy",

        "org.vendors.searchPh": "Search vendors by name or service...",

        "org.requests.outgoing": "Outgoing Requests",
        "org.requests.sentToVendors": "Sent to vendors",
        "org.requests.incoming": "Incoming Requests",
        "org.requests.fromVendors": "From vendors",
        "org.requests.showRequestsFor": "Show requests for:",
        "org.requests.noOutgoing": "No outgoing requests yet",
        "org.requests.noOutgoingDesc": "Browse the Vendor Marketplace to find and invite vendors to your events",
        "org.requests.browseVendors": "Browse Vendors",
        "org.requests.noIncoming": "No incoming requests",
        "org.requests.noIncomingDesc": "Vendors will appear here when they apply to join your events",
        "org.requests.requestDetails": "Request Details",
        "org.requests.vendorAttachment": "Vendor attachment",
        "org.requests.attachmentDesc": "Company brochure or details shared by the vendor",
        "org.requests.rejectionReasonFromVendor": "Rejection reason (from vendor)",
        "org.requests.sendRequest": "Send Request",
        "org.requests.sendingRequestTo": "You are sending a request to",
        "org.requests.selectEvent": "Select Event *",
        "org.requests.chooseEvent": "Choose an event...",
        "org.requests.chooseEventHelp": "Choose the event you want to link this request to.",
        "org.requests.messagePh": "Describe your requirements (e.g. guest count, dates, preferences)...",
        "org.requests.fullMessage": "Full Message",
        "org.requests.rejectRequest": "Reject Request",
        "org.requests.rejectNotify": "This action will notify the vendor",
        "org.requests.rejectionReason": "Rejection Reason",
        "org.requests.rejectionReasonPh": "Enter the reason for rejection...",
        "org.requests.vendorWillSee": "The vendor will see this message.",
        "org.requests.sent": "Sent",
        "org.requests.received": "Received",
        "org.requests.eventDate": "Event date",
        "org.requests.location": "Location",
        "org.requests.yourInvitation": "Your invitation",
        "org.requests.vendorProposal": "Vendor's proposal",
        "org.requests.applicationDetails": "Application Details",
        "org.requests.unknownEvent": "Unknown Event",

        "org.analytics.title": "Event Analytics",
        "org.analytics.desc": "Deep insights into your event performance, attendee demographics, and ticket sales.",
        "org.analytics.pageViews": "Page Views",
        "org.analytics.conversion": "Conversion",
        "org.analytics.revenue": "Revenue",
        "org.analytics.tab.overview": "Overview",
        "org.analytics.tab.eventReport": "Event Report",
        "org.analytics.tab.attendees": "Attendees",
        "org.analytics.tab.vendors": "Vendors",
        "org.analytics.tab.marketInsights": "Market Insights",

        "org.analytics.kpi.totalEvents": "Total Events",
        "org.analytics.kpi.totalAttendees": "Total Attendees",
        "org.analytics.kpi.totalRevenue": "Est. Revenue",
        "org.analytics.kpi.avgAttendance": "Avg. Attendance",
        "org.analytics.kpi.vendorWithdrawals": "Vendor Withdrawals",
        "org.analytics.kpi.attendeeWithdrawals": "Attendee Withdrawals",

        "org.analytics.highlight.topEvent": "Top Event",
        "org.analytics.highlight.topService": "Most Booked Service",
        "org.analytics.highlight.topCategory": "Best Category",
        "org.analytics.highlight.avgSatisfaction": "Avg. Satisfaction",

        "org.analytics.chart.attendance": "Attendance",
        "org.analytics.chart.revenue": "Revenue",
        "org.analytics.chart.servicesDistribution": "Services Distribution",
        "org.analytics.chart.categories": "Categories",
        "org.analytics.chart.ageGroups": "Age Groups",
        "org.analytics.chart.categoryDistribution": "Category Distribution",

        "org.analytics.exportOverview": "Export Overview PDF",
        "org.analytics.exportOverviewTitle": "Export Overview as PDF",

        "org.analytics.att.total": "Total Attendees",
        "org.analytics.att.confirmed": "Confirmed Attendees",
        "org.analytics.att.withdrawn": "Withdrawn",
        "org.analytics.att.retention": "Retention Rate",

        "org.analytics.att.ticketTypes": "Ticket Types",
        "org.analytics.att.satisfactionCategory": "Satisfaction by Category",
        "org.analytics.att.loyalty": "Loyalty",

        "org.analytics.att.loyalAttendees": "Loyal Attendees",
        "org.analytics.att.loyalDesc": "Attendees who registered for multiple events — your most dedicated supporters.",

        "org.analytics.att.export": "Export Attendees PDF",
        "org.analytics.att.exportTitle": "Export Attendees Report as PDF",

        "org.analytics.eventReportTitle": "Event Report",
        "org.analytics.selectEventLabel": "Select Event",
        "org.analytics.selectEventPlaceholder": "— Choose an event —",

        "org.analytics.event.dateLabel": "Date",
        "org.analytics.event.categoryLabel": "Category",
        "org.analytics.event.statusLabel": "Status",

        "org.analytics.exportEvent": "Export PDF",
        "org.analytics.exportEventTitle": "Export as PDF",

        "org.analytics.event.kpi.attendees": "Attendees",
        "org.analytics.event.kpi.revenue": "Total Revenue",
        "org.analytics.event.kpi.retention": "Retention Rate",
        "org.analytics.event.kpi.vendors": "Vendors",
        "org.analytics.event.kpi.vendorWithdrawals": "Vendor Withdrawals",
        "org.analytics.event.kpi.attendeeWithdrawals": "Attendee Withdrawals",
        "org.analytics.event.kpi.satisfaction": "Satisfaction",

        "org.analytics.event.chart.revenueTier": "Revenue by Tier",
        "org.analytics.event.chart.ageGroups": "Age Groups",
        "org.analytics.event.chart.registrationTimeline": "Registration Timeline",
        "org.analytics.event.chart.vendorServices": "Vendor Services",

        "org.analytics.event.placeholder": "Select an event above to view its detailed report.",

        "org.analytics.market.eventsByMonth": "Events by Month",
        "org.analytics.market.avgPrice": "Avg. Ticket Price",
        "org.analytics.market.revenuePotential": "Revenue Potential",
        "org.analytics.market.allTiers": "All Tiers",

        "org.analytics.market.export": "Export Market Insights PDF",
        "org.analytics.market.exportTitle": "Export Market Insights as PDF",

        "org.analytics.vendors.title": "Vendor Analytics",
        "org.analytics.vendors.total": "Total Vendors",
        "org.analytics.vendors.declinedWithdrawn": "Declined / Withdrawn",
        "org.analytics.vendors.acceptanceRate": "Acceptance Rate",

        "org.analytics.vendors.topVendor": "Most Booked Vendor",
        "org.analytics.vendors.topRated": "Highest Rated Vendor",
        "org.analytics.vendors.avgPerEvent": "Avg. Vendors per Event",

        "org.analytics.vendors.statusBreakdown": "Status Breakdown",
        "org.analytics.vendors.perEvent": "Vendors per Event",
        "org.analytics.vendors.allVendors": "All Vendors",
        "org.analytics.vendors.allVendorsDesc": "Complete list of vendors ordered by number of event participations.",

        "org.analytics.vendors.export": "Export Vendors PDF",
        "org.analytics.vendors.exportTitle": "Export Vendors Report as PDF",

        // ----- organizer-analytics.js dynamic strings -----
        "org.analytics.common.attendees": "Attendees",
        "org.analytics.common.attendee": "attendee",
        "org.analytics.common.attendeesLower": "attendees",
        "org.analytics.common.events": "Events",
        "org.analytics.common.event": "Event",
        "org.analytics.common.eventLower": "event",
        "org.analytics.common.eventsLower": "events",
        "org.analytics.common.vendors": "Vendors",
        "org.analytics.common.vendor": "vendor",
        "org.analytics.common.bookings": "bookings",
        "org.analytics.common.booking": "booking",
        "org.analytics.common.assignments": "assignments",
        "org.analytics.common.assignment": "assignment",
        "org.analytics.common.responses": "responses",
        "org.analytics.common.response": "response",
        "org.analytics.common.registrations": "registrations",
        "org.analytics.common.registration": "registration",
        "org.analytics.common.totalRegSingular": "total registration",
        "org.analytics.common.totalRegPlural": "total registrations",
        "org.analytics.common.noDataYet": "No data yet",
        "org.analytics.common.noDate": "No date",
        "org.analytics.common.uncategorized": "Uncategorized",
        "org.analytics.common.active": "Active",
        "org.analytics.common.confirmed": "Confirmed",
        "org.analytics.common.declined": "Declined",
        "org.analytics.common.pending": "Pending",
        "org.analytics.common.confirmedLower": "confirmed",
        "org.analytics.common.pendingLower": "pending",
        "org.analytics.common.other": "Other",

        "org.analytics.age.under18": "Under 18",
        "org.analytics.age.18_24": "18–24",
        "org.analytics.age.25_34": "25–34",
        "org.analytics.age.35_44": "35–44",
        "org.analytics.age.45_54": "45–54",
        "org.analytics.age.55plus": "55+",

        "org.analytics.month.jan": "Jan",
        "org.analytics.month.feb": "Feb",
        "org.analytics.month.mar": "Mar",
        "org.analytics.month.apr": "Apr",
        "org.analytics.month.may": "May",
        "org.analytics.month.jun": "Jun",
        "org.analytics.month.jul": "Jul",
        "org.analytics.month.aug": "Aug",
        "org.analytics.month.sep": "Sep",
        "org.analytics.month.oct": "Oct",
        "org.analytics.month.nov": "Nov",
        "org.analytics.month.dec": "Dec",

        "org.analytics.axis.numAttendees": "Number of Attendees",
        "org.analytics.axis.numEvents": "Events",
        "org.analytics.axis.numVendors": "Number of Vendors",
        "org.analytics.axis.totalAttendees": "Total Attendees",
        "org.analytics.axis.totalRegistrations": "Total Registrations",
        "org.analytics.axis.month": "Month",
        "org.analytics.axis.date": "Date",
        "org.analytics.axis.ageGroup": "Age Group",
        "org.analytics.axis.eventCategory": "Event Category",
        "org.analytics.axis.category": "Category",
        "org.analytics.axis.ticketTier": "Ticket Tier",
        "org.analytics.axis.event": "Event",
        "org.analytics.axis.revenueSar": "Revenue (SAR)",
        "org.analytics.axis.avgPriceSar": "Avg. Price (SAR)",
        "org.analytics.axis.avgRevenuePerEvent": "Avg. Revenue / Event (SAR)",
        "org.analytics.axis.avgScore": "Avg. Score (out of 5)",
        "org.analytics.axis.avgSatisfaction": "Avg. Satisfaction",
        "org.analytics.axis.confirmedVendors": "Confirmed Vendors",

        "org.analytics.title.attendanceByEvent": "Attendance by Event",
        "org.analytics.title.revenueByEvent": "Revenue by Event",
        "org.analytics.title.attendeesByCategory": "Attendees by Category",
        "org.analytics.title.attendeesByAgeGroup": "Attendees by Age Group",
        "org.analytics.title.revenueByTier": "Revenue by Ticket Tier",
        "org.analytics.title.regTimeline": "Registration Timeline",
        "org.analytics.title.eventsByMonth": "Number of Events by Month",
        "org.analytics.title.avgPriceByCategory": "Average Ticket Price by Category",
        "org.analytics.title.avgPriceByCategoryFmt": "Average \"{tier}\" Price by Category",
        "org.analytics.title.avgRevenueByCategory": "Avg. Revenue Potential per Event by Category",
        "org.analytics.title.satisfactionByCategory": "Average Satisfaction by Event Category",
        "org.analytics.title.confirmedVendorsPerEvent": "Confirmed Vendors per Event",

        "org.analytics.loyalty.gold": "Gold",
        "org.analytics.loyalty.silver": "Silver",
        "org.analytics.loyalty.bronze": "Bronze",
        "org.analytics.loyalty.loyal": "Loyal",
        "org.analytics.loyalty.empty": "No repeat attendees found yet.",
        "org.analytics.vendors.empty": "No vendors available.",

        "org.analytics.pdf.kpiSection": "Key Performance Indicators",
        "org.analytics.pdf.highlightsSection": "Highlights",
        "org.analytics.pdf.overviewTitle": "Eventia — Overview Report",
        "org.analytics.pdf.attendeesTitle": "Eventia — Attendees Report",
        "org.analytics.pdf.vendorsTitle": "Eventia — Vendor Analytics Report",
        "org.analytics.pdf.marketTitle": "Eventia — Market Insights Report",
        "org.analytics.pdf.eventTitleFallback": "Event Report",
        "org.analytics.pdf.generatedOn": "Generated on ",
        "org.analytics.pdf.noChartData": "No data available for this chart.",
        "org.analytics.pdf.generating": "Generating…",
        "org.analytics.pdf.fileError": "PDF export does not work when you open the page as a local file (address bar shows file:///…).\n\nRun a small web server in your project folder, then use http://localhost instead. Example:\n\n  cd your-project-folder\n  python3 -m http.server 8080\n\nOpen: http://localhost:8080/organizer-dashboard.html",
        "org.analytics.pdf.libError": "PDF library did not load. Check your network, refresh the page, and open the site over http(s), not file://.",
        "org.analytics.pdf.h2cError": "Screenshot helper did not load. Refresh the page and try again.",
        "org.analytics.pdf.timeout": "Screenshot timed out.",
        "org.analytics.pdf.cantBuild": "Could not build report.",
        "org.analytics.pdf.emptyShot": "Empty screenshot.",
        "org.analytics.pdf.cantRead": "Could not read the page image (often blocked when opening the file directly).",
        "org.analytics.pdf.cantGenerate": "Could not generate PDF. If the address bar shows file:///, serve the project over http://localhost instead.",
        "org.analytics.pdf.cantStart": "Could not start export. See console for details.",
        "org.analytics.pdf.detailsPrefix": "\n\nDetails: ",

        "org.analytics.pdf.section.attendanceByEvent": "Attendance by Event",
        "org.analytics.pdf.section.revenueByEvent": "Revenue by Event",
        "org.analytics.pdf.section.servicesDistribution": "Services Distribution",
        "org.analytics.pdf.section.eventCategories": "Event Categories",
        "org.analytics.pdf.section.revenueByTier": "Revenue by Tier",
        "org.analytics.pdf.section.ageGroups": "Age Groups",
        "org.analytics.pdf.section.regTimeline": "Registration Timeline",
        "org.analytics.pdf.section.vendorServices": "Vendor Services",
        "org.analytics.pdf.section.attByAgeGroup": "Attendees by Age Group",
        "org.analytics.pdf.section.ticketTypes": "Ticket Type Distribution",
        "org.analytics.pdf.section.satByCategory": "Satisfaction by Event Category",
        "org.analytics.pdf.section.categoryDist": "Category Distribution",
        "org.analytics.pdf.section.statusBreakdown": "Status Breakdown",
        "org.analytics.pdf.section.vendorsPerEvent": "Vendors per Event",
        "org.analytics.pdf.section.eventsByMonth": "Number of Events by Month",
        "org.analytics.pdf.section.avgPriceByCat": "Average Ticket Price by Category",
        "org.analytics.pdf.section.avgPriceByCatFmt": "Average Ticket Price by Category ({tier})",
        "org.analytics.pdf.section.revenuePotential": "Revenue Potential per Event by Category",

        "org.profile.roleFull": "Event Organizer",
        "org.profile.organizationName": "Organization Name",
        "org.profile.passwordKeepPlaceholder": "Leave blank to keep current",
        // ======================
        // Organizer logic
        // ======================
            "org.manage.title": "Event Management",
            "org.manage.manage": "Manage",
            "org.em.updateEvent": "Update Event",
            "org.ticket.general": "General",

            "org.scegaApproved": "SCEGA Approved",

            "org.toast.updated": "Event Updated Successfully!",
            "org.toast.submitted": "Event Submitted for Approval! SCEGA will review your event shortly.",
            "org.toast.ticketRequired": "At least one ticket category is required.",
            "org.error.loadingData": "Error loading data from server.",
            "org.error.savingEvent": "Error saving event.",
            "org.error.deletingEvent": "Error deleting event.",
            "org.error.sendingRequest": "Error sending request.",
            "org.error.rejectingRequest": "Error rejecting request.",
            "org.error.approvingRequest": "Error approving request.",
            "org.error.updatingDescription": "Error updating description.",
            "org.error.sendingMessage": "Error sending message.",
            "org.error.sendingBroadcast": "Error sending broadcast.",
            "org.error.requestingUpdate": "Error requesting update.",
            "org.error.generic": "Error: {detail}",

            "org.events.noneFound": "No events found.",

            "org.vendors.resultsFull": "{count} vendors found in {category}",
            "org.vendors.resultsAll": "{count} vendors found",
            "org.vendors.noResults": "No vendors found matching your criteria.",
            "org.vendors.clearFilters": "Clear Filters",

            "org.requests.sentSuccess": "Request sent successfully!",
            "org.requests.sentSuccessTo": "Request sent to {vendor} successfully!",
            "org.requests.duplicate": "A request for this vendor and event already exists.",
            "org.requests.rejectedSuccess": "Request rejected.",
            "org.requests.rejectedFrom": "Request from {vendor} rejected.",
            "org.requests.approvedSuccess": "Request approved!",
            "org.requests.approvedFrom": "Request from {vendor} approved!",
            "org.profile.updated": "Profile updated successfully!",
            "org.requests.requestSingular": "request",
            "org.requests.requestsPlural": "requests",
            "org.requests.unlinkedEvent": "Unlinked Event",
            "org.requests.unknownVendor": "Unknown Vendor",

            "vendor.preparation": "Preparation",
            "vendor.history.updatedByVendor": "Updated by vendor",
            "vendor.history.system": "System",
            "vendor.history.updated": "Updated",
            "vendor.history.awaitingStep": "Awaiting this step",

            "vendor.group.foodBeverages": "Food & Beverages",
            "vendor.group.venues": "Venues",
            "vendor.group.avTechnology": "AV & Technology",
            "vendor.group.decorationDesign": "Decoration & Design",
            "vendor.group.photographyMedia": "Photography & Media",
            "vendor.group.entertainment": "Entertainment",
            "vendor.group.transportation": "Transportation",
            "vendor.group.securitySafety": "Security & Safety",
            "vendor.group.staffingServices": "Staffing & Services",
            "vendor.group.rentalsEquipment": "Rentals & Equipment",
            "vendor.group.marketingPromotion": "Marketing & Promotion",
            "vendor.group.governmentPermits": "Government & Permits",
            "vendor.group.sponsorsPartners": "Sponsors & Partners",
            "vendor.group.saudiCultural": "Saudi Cultural",
            "vendor.group.specializedServices": "Specialized Services",

    // ======================
    // Vendor page
    // ======================
        "vendor.brand": "EVENTIA VENDOR",
        "vendor.nav.overview": "Dashboard",
        "vendor.nav.myEvents": "My Events",
        "vendor.nav.invitations": "Invitations",
        "vendor.nav.browseEvents": "Browse Events",
        "vendor.nav.profile": "Profile",
        "vendor.nav.logout": "Logout",

        "vendor.page.dashboard": "Vendor Dashboard",
        "vendor.page.invitations": "Manage Invitations",
        "vendor.page.browseEvents": "Browse Events",
        "vendor.page.myEvents": "My Events",
        "vendor.page.eventManage": "Event Management",
        "vendor.page.profile": "Vendor Profile",

        "vendor.role": "Vendor",
        "vendor.stats.pendingInvites": "Pending Invites",
        "vendor.stats.activeEvents": "Active Events",
        "vendor.stats.completedEvents": "Completed Events",

        "vendor.overview.upcoming": "My Upcoming Events",

        "vendor.requests.myApplications": "My Applications",
        "vendor.requests.sentToOrganizers": "Sent to organizers",
        "vendor.requests.invitations": "Invitations",
        "vendor.requests.fromOrganizers": "From organizers",
        "vendor.requests.filterByStatus": "Filter by Status:",
        "vendor.requests.allApplications": "All Applications",
        "vendor.requests.allInvitations": "All Invitations",
        "vendor.requests.noApplications": "No applications yet",
        "vendor.requests.noApplicationsDesc": "Browse events and send proposals to organizers",
        "vendor.requests.noInvitations": "No invitations",
        "vendor.requests.noInvitationsDesc": "Organizers will send you event invitations here",
        "vendor.requests.organizer": "Organizer",
        "vendor.requests.accept": "Accept",
        "vendor.requests.readMore": "Read more",
        "vendor.requests.fullMessage": "Full Message",
        "vendor.requests.messageFromOrganizer": "Message from organizer",

        "vendor.browse.heroTitle": "Find Events to Apply To",
        "vendor.browse.heroDesc": "Explore upcoming events, filter by category, and send your proposals to organizers",
        "vendor.browse.searchPh": "Search events by name or location...",
        "vendor.browse.resultsNone": "No events found.",
        "vendor.browse.resultsFound": "{count} event(s) found.",

        "vendor.myEvents.heroTitle": "My Events",
        "vendor.myEvents.heroDesc": "Events you’re confirmed for. Manage your schedule and withdraw if needed.",
        "vendor.myEvents.searchPh": "Search by event name or location...",
        "vendor.myEvents.eventDetails": "Event Details",
        "vendor.myEvents.actions": "Actions",
        "vendor.myEvents.organizer": "Organizer",
        "vendor.myEvents.yourService": "Your Service",
        "vendor.myEvents.attendees": "Attendees",
        "vendor.myEvents.daysLeft": "Days Left",
        "vendor.myEvents.yourRole": "Your Role",
        "vendor.myEvents.overview": "Overview",
        "vendor.myEvents.communication": "Communication",
        "vendor.myEvents.actionsTab": "Actions",
        "vendor.myEvents.dateLocation": "Date & Location",
        "vendor.myEvents.withdrawPolicy": "Vendor Withdrawal Policy",
        "vendor.myEvents.ticketTiers": "Ticket Tiers",
        "vendor.myEvents.noMessages": "No messages yet",
        "vendor.myEvents.withdrawTitle": "Withdraw from Event",
        "vendor.myEvents.withdrawDesc": "Cancel your participation in this event. The organizer will be notified.",
        "vendor.myEvents.withdrawBtn": "Withdraw",

        "vendor.profile.changePhoto": "Click to change photo",
        "vendor.profile.title": "Eventia Vendor",
        "vendor.profile.businessName": "Business Name",
        "vendor.profile.username": "Username",
        "vendor.profile.contactPerson": "Contact Person",
        "vendor.profile.serviceCategory": "Service Category",
        "vendor.profile.serviceDescription": "Service Description",
        "vendor.profile.saveChanges": "Save Changes",

        "vendor.modal.importantNotice": "Important Notice",
        "vendor.modal.rejectTitle": "Reject Invitation",
        "vendor.modal.rejectNotify": "This action will notify the organizer",
        "vendor.modal.rejectingInvitationFor": "You are about to reject the invitation for:",
        "vendor.modal.rejectionReason": "Reason for Rejection",
        "vendor.modal.rejectionReasonPh": "Please provide a reason for rejection...",
        "vendor.modal.organizerWillSee": "The organizer will see this message in their dashboard.",
        "vendor.modal.rejectInvitation": "Reject Invitation",

        "vendor.modal.withdrawTitle": "Withdraw from Event",
        "vendor.modal.withdrawNotify": "This action will notify the organizer",
        "vendor.modal.withdrawingFrom": "You are about to withdraw from:",
        "vendor.modal.withdrawReason": "Reason for Withdrawal",
        "vendor.modal.withdrawReasonPh": "Please provide a reason for your withdrawal...",
        "vendor.modal.confirmWithdrawal": "Confirm Withdrawal",

        "vendor.modal.applyTitle": "Apply for Event",
        "vendor.modal.applySubtitle": "Send a proposal to the organizer with your services and details.",
        "vendor.modal.serviceType": "Your Service Type",
        "vendor.modal.messageProposal": "Message / Proposal",
        "vendor.modal.messageProposalPh": "Describe what you can offer, pricing, and why you're a good fit...",
        "vendor.modal.attachmentLabel": "Attachment (optional)",
        "vendor.modal.attachmentHint": "PDF, Word, or images — company brochure or details (max 5MB).",
        "vendor.modal.chooseFile": "Choose file",
        "vendor.modal.noFileChosen": "No file chosen",
        "vendor.modal.remove": "Remove",
        "vendor.modal.removeAttachment": "Remove attachment",
        "vendor.modal.sendProposal": "Send Proposal",

        "vendor.chat.organizer": "Organizer",
        "vendor.chat.organizerFallback": "Event Organizer",
        "vendor.chat.youPrefix": "You: ",
        "vendor.chat.noMessagesPreview": "No messages yet",
        "vendor.chat.noMessages": "No messages yet",
        "vendor.chat.event": "Event",
        "vendor.chat.typeMessage": "Type a message...",
        "vendor.chat.sendFailed": "Failed to send message.",

        "vendor.status.updateTitle": "Update Preparation Status",
        "vendor.status.progressNote": "Progress Note",
        "vendor.status.progressNotePh": "Describe your current progress, e.g., 'Food truck dispatched, ETA 2 hours...'",
        "vendor.status.advanceStatus": "Advance Status",

        "vendor.cat.foodBeverage": "Food & Beverage",
        "vendor.cat.healthWellness": "Health & Wellness",
        "vendor.cat.culture": "Culture",
        "vendor.cat.fashion": "Fashion",
        "vendor.cat.charity": "Charity",
        "vendor.cat.innovation": "Innovation",
        "vendor.cat.startup": "Startup",
        "vendor.cat.design": "Design",
        "vendor.cat.conference": "Conference",
        "vendor.cat.networking": "Networking",
        "vendor.cat.tradeShow": "Trade Show",
        "vendor.cat.concert": "Concert",
        "vendor.cat.festival": "Festival",
        "vendor.cat.theater": "Theater",
        "vendor.cat.workshop": "Workshop",
        "vendor.cat.training": "Training",
        "vendor.cat.seminar": "Seminar",
        "vendor.cat.marathon": "Marathon",
        "vendor.cat.tournament": "Tournament",
        "vendor.cat.fitness": "Fitness",
        "vendor.cat.food": "Food",
        "vendor.cat.culinary": "Culinary",
        "vendor.cat.wineTasting": "Wine Tasting",
        "vendor.cat.foodFestival": "Food Festival",
        "vendor.cat.health": "Health",
        "vendor.cat.wellness": "Wellness",
        "vendor.cat.yoga": "Yoga",
        "vendor.cat.meditation": "Meditation",
        "vendor.cat.fundraising": "Fundraising",
        "vendor.cat.community": "Community",
        "vendor.cat.social": "Social",
        "vendor.cat.expo": "Expo",
        "vendor.cat.fair": "Fair",
        "vendor.cat.celebration": "Celebration",

        // ======================
        // Vendor logic
        // ======================
            "vendor.upcoming.emptyTitle": "You have no upcoming events",
            "vendor.upcoming.emptyDesc": "Browse events and apply to participate",

            "vendor.myEvents.emptySearchTitle": "No events match your search",
            "vendor.myEvents.emptySearchDesc": "Try a different search term or clear the search.",
            "vendor.myEvents.emptyTitle": "You haven't joined any events yet",
            "vendor.myEvents.emptyDesc": "Browse events and apply to get confirmed for upcoming events.",
            "vendor.myEvents.manage": "Manage",
            "vendor.browse.noUpcomingMatch": "No upcoming events found matching your criteria.",
            "vendor.browse.applyNow": "Apply Now",
            "vendor.browse.applied": "Applied",

            "vendor.invitation.accepted": "Invitation accepted!",
            "vendor.invitation.acceptFailed": "Could not accept the invitation.",
            "vendor.invitation.eventReview": "Event Review",
            "vendor.invitation.noDescription": "No description provided.",
            "vendor.invitation.ticketsPricing": "Tickets & Pricing",
            "vendor.invitation.rejected": "Invitation rejected.",
            "vendor.invitation.rejectFailed": "Could not reject the invitation.",

            "vendor.policy.flexibleDesc": "Flexible — Up to 7 days before event",
            "vendor.policy.moderateDesc": "Moderate — Up to 14 days before event",
            "vendor.policy.strictDesc": "Strict — Up to 30 days before event",
            "vendor.policy.nonRefundableDesc": "Non-refundable — No withdrawal allowed",
            "vendor.policy.notSet": "No policy set",

            "vendor.withdraw.reason.nonRefundable": "This request has a non-refundable withdrawal policy. You cannot withdraw.",
            "vendor.withdraw.reason.strict": "Withdrawal deadline has passed. Policy requires at least 30 days before the event ({days} days remaining).",
            "vendor.withdraw.reason.moderate": "Withdrawal deadline has passed. Policy requires at least 14 days before the event ({days} days remaining).",
            "vendor.withdraw.reason.flexible": "Withdrawal deadline has passed. Policy requires at least 7 days before the event ({days} days remaining).",
            "vendor.withdraw.policyTitle": "Withdrawal Policy",
            "vendor.withdraw.notAllowedPlaceholder": "Withdrawal is not allowed under the current policy.",
            "vendor.withdraw.reasonPlaceholder": "Please provide a reason for your withdrawal...",
            "vendor.withdraw.blocked": "Withdrawal blocked by policy.",
            "vendor.withdraw.byVendorPrefix": "Withdrawn by Vendor",
            "vendor.withdraw.success": "Withdrawn from event",
            "vendor.withdraw.failed": "Withdrawal failed.",
            "vendor.apply.fileTooLarge": "File too large. Max {max}MB.",
            "vendor.apply.sentSuccess": "Application sent successfully!",
            "vendor.apply.failed": "Application failed.",
            "vendor.apply.attachmentTooLarge": "Attachment must be under {max}MB.",
            "vendor.categories.modalTitle": "All Event Categories",
            "vendor.preparationStatus.title": "Your Preparation Status",
            "vendor.preparationStatus.updateButton": "Update Status",
            "vendor.updateRequest.title": "Status update requested!",
            "vendor.updateRequest.desc": "The event organizer would like you to update your preparation progress.",
            "vendor.updateRequest.updateNow": "Update Now",

            "vendor.prep.finalStatus": "You are already at the final status: {status}!",
            "vendor.prep.advanceTo": "Advance to \"{status}\"",
            "vendor.prep.noteRequired": "Please provide a progress note.",
            "vendor.prep.updatedTo": "Status updated to \"{status}\"!",
            "vendor.prep.statusUpdateFailed": "Status update failed.",
            "vendor.eventManage.organizerFallback": "Event Organizer",
            "vendor.eventManage.eventEnded": "Event Ended",
            "vendor.eventManage.withdraw": "Withdraw",

            "vendor.policy.badgeFlexible": "✦ Flexible",
            "vendor.policy.badgeModerate": "✦ Moderate",
            "vendor.policy.badgeStrict": "✦ Strict",
            "vendor.policy.badgeNonRefundable": "✦ Non-refundable",

            "vendor.policy.descFlexible": "Withdrawal allowed up to 7 days before the event.",
            "vendor.policy.descModerate": "Withdrawal allowed up to 14 days before the event.",
            "vendor.policy.descStrict": "Withdrawal allowed up to 30 days before the event.",
            "vendor.policy.descNonRefundable": "No withdrawal or cancellations permitted once confirmed.",

            "vendor.categories.techInnovation": "Technology & Innovation",
            "vendor.categories.artsCulture": "Arts & Culture",
            "vendor.categories.businessProfessional": "Business & Professional",
            "vendor.categories.entertainment": "Entertainment",
            "vendor.categories.educationLearning": "Education & Learning",
            "vendor.categories.sportsFitness": "Sports & Fitness",
            "vendor.categories.foodBeverage": "Food & Beverage",
            "vendor.categories.healthWellness": "Health & Wellness",
            "vendor.categories.communitySocial": "Community & Social",
            "vendor.categories.otherGroup": "Other",

    // ======================
    // Scega dashboard
    // ======================
        "scega.brand": "SCEGA ADMIN",
        "scega.nav.overview": "Dashboard",
        "scega.nav.history": "History",
        "scega.nav.logout": "Logout",

        "scega.login.pageTitle": "SCEGA Admin Login | Eventia",
        "scega.login.portal": "SCEGA Portal",
        "scega.login.restricted": "Restricted Access",
        "scega.login.logIn": "Log In",
        "scega.login.backToEventia": "Back to Eventia",

        "scega.page.dashboard": "Admin Dashboard",
        "scega.page.dashboardOverview": "Dashboard Overview",
        "scega.page.pendingRequests": "Pending Requests",
        "scega.page.history": "Approval History",

        "scega.profile.role": "Administrator",

        "scega.stats.pending": "Pending Requests",
        "scega.stats.approved": "Approved Events",
        "scega.stats.rejected": "Rejected Events",

        "scega.section.pendingQueue": "Pending Events Queue",

        "scega.modal.rejectTitle": "Reject Event",
        "scega.modal.rejectNotify": "This action will notify the organizer",
        "scega.modal.rejectionReason": "Rejection Reason",
        "scega.modal.rejectionReasonPh": "Enter the reason for rejection...",
        "scega.modal.organizerWillSee": "The organizer will see this message in their dashboard.",
        "scega.modal.rejectBtn": "Reject Event",
        // ======================
        // Scega logic
        // ======================
            "scega.modal.eventReview": "Event Review",

            "scega.actions.approve": "Approve",
            "scega.actions.readMore": "Read more",

            "scega.confirm.approve": "Are you sure you want to approve this event?",
            "scega.alert.approved": "Event Approved Successfully!",
            "scega.alert.rejected": "Event Rejected.",

            "scega.empty.noPending": "No pending requests.",
            "scega.empty.noPendingNow": "No pending requests at the moment",
            "scega.empty.allCaughtUp": "All caught up! 🎉",
            "scega.empty.noHistory": "No history yet",
            "scega.empty.noDescription": "No description provided.",

            "scega.common.general": "General",
            "scega.page.dashboardOverview": "Dashboard Overview",
            "scega.page.pendingRequests": "Pending Requests",
            "scega.page.history": "Approval History",

            "scega.common.tbd": "TBD",

            "scega.ticket.freeEvent": "Free Event",
            "scega.ticket.pricing": "Tickets & Pricing",

    // ======================
    // Landing page
    // ======================
        "hero.tagline": "Find events. Book tickets. Enjoy the experience.",
        "hero.explore": "Explore Events",
        "hero.join": "Join Now",

        "hiw.title": "Get Started in 3 Steps",
        "hiw.desc": "From browsing to attending — it's that easy",
        "hiw.step1.title": "Discover",
        "hiw.step1.desc": "Browse hundreds of events across Saudi Arabia — from tech summits to art exhibitions and beyond.",
        "hiw.step2.title": "Register",
        "hiw.step2.desc": "Choose your ticket tier, secure your spot, and get instant confirmation delivered to your inbox.",
        "hiw.step3.title": "Attend",
        "hiw.step3.desc": "Show up, enjoy the event, network with like-minded people, and create memorable experiences.",
        "hiw.cta.q": "Ready to discover your next event?",
        "hiw.cta.btn": "Create Free Account",
        "hiw.cta.haveAccount": "Already have an account?",
        "hiw.cta.login": "Log in",

        "cta.title": "Ready to Create Your Own Event?",
        "cta.desc": "Join hundreds of organizers who trust Eventia to manage everything from small meetups to large-scale conferences.",
        "cta.organizerBtn": "Start Organizing",
        "cta.vendorBtn": "Become a Vendor",

    // ======================
    // Attendee Page
    // ======================
        "att.nav.browse": "Browse",
        "att.tickets": "My Tickets",
        "att.nav.history": "History",
        "att.nav.profile": "Profile",
        "att.nav.logout": "Logout",
        "att.nav.notifications": "Notifications",
        "att.menu.open": "Open menu",
        "att.menu.close": "Close menu",

        "att.hero.welcome": "Welcome back",
        "att.hero.title": "Hello,",
        "att.hero.tagline": "Discover events. Book tickets. Enjoy the experience.",
        "att.hero.explore": "Explore Events",
        "att.tickets.desc": "Your registered events and digital tickets",
        "att.ticketType": "Ticket type",
        "att.registeredOn": "Registered",
        "att.showBadge": "Show my badge",
        "att.withdraw": "Withdraw Registration",
        "att.noTickets": "No upcoming tickets",
        "att.noTicketsDesc": "Browse events above and register to get your digital tickets.",

        "att.notifications.title": "Notifications",
        "att.notifications.desc": "Updates and broadcasts from your event organizers",
        "att.notifications.markAll": "Mark all as read",

        "att.history.title": "Event History",
        "att.history.desc": "Past events you attended with your ratings and feedback",

        "att.profile.title": "My Profile",
        "att.profile.desc": "Manage your personal information and preferences",
        "att.profile.member": "Eventia Member",
        "att.profile.changePhoto": "Click to change photo",

        "att.profile.firstName": "First Name",
        "att.profile.lastName": "Last Name",
        "att.profile.email": "Email Address",
        "att.profile.phone": "Phone Number",
        "att.profile.jobTitle": "Job Title",
        "att.profile.optional": "(optional)",
        "att.profile.jobPlaceholder": "e.g. Software Engineer",

        "att.profile.password": "Password",
        "att.profile.confirmPassword": "Confirm Password",

        "att.profile.save": "Save Changes",
        // ======================
        // Attendee Logic Page
        // ======================
            "att.tbd": "TBD",
            "att.event.default": "Event",
            "att.ticket.vip": "VIP",
            "att.ticket.standard": "Standard",
            "att.ticket.executive": "Executive",
            "att.ticket.participant": "Participant",

            "att.browse.noEvents": "No events found",
            "att.browse.tryFilters": "Try adjusting your search or filters.",
            "att.browse.viewDetails": "View Details",
            "att.browse.registered": "Registered",
            "att.browse.register": "Register",

            "att.details.title": "Event Details",
            "att.details.freeEvent": "Free Event",
            "att.details.alreadyRegistered": "Already Registered",
            "att.details.registerNow": "Register Now",
            "att.details.date": "DATE",
            "att.details.time": "TIME",
            "att.details.location": "LOCATION",
            "att.details.description": "DESCRIPTION",
            "att.details.noDescription": "No description.",
            "att.details.ticketsPricing": "TICKETS & PRICING",

            "event.details.aboutTitle": "About This Event",
            "event.details.readyAttend": "Ready to attend?",
            "event.details.loginAsAttendee": "Please log in as an Attendee to register.",
            "event.details.switchAccount": "Log Out & Switch Account",
            "event.details.loginToRegister": "Log In to Register",
            "event.details.dateTimeRow": "Date & Time",
            "event.details.capacityStat": "Capacity",
            "event.details.capacitySuffix": "attendees",
            "event.details.ticketStat": "Ticket",
            "event.details.eventVendors": "Event Vendors",
            "event.details.noVendorsYet": "No vendors have been confirmed for this event yet.",
            "event.details.vendorCountZero": "0 vendors",
            "event.details.vendorCountOne": "1 vendor",
            "event.details.vendorCountMany": "{{n}} vendors",
            "event.details.organizedBy": "Organized By",
            "event.details.verifiedOrganizer": "Verified Organizer",
            "event.details.secureRegistration": "Secure registration",
            "event.details.switchAccountShort": "Switch Account",
            "event.details.freeSecureSignup": "Free & secure to sign up",
            "event.details.fullyBooked": "Fully booked",
            "event.details.spotsRemainOne": "1 spot remaining ({{pct}}% filled)",
            "event.details.spotsRemainMany": "{{n}} spots remaining ({{pct}}% filled)",

            "att.common.cancel": "Cancel",
            "att.common.continue": "Continue",
            "att.common.done": "Done",
            "att.common.of": "of",

            "att.reg.alreadyRegisteredToast": "You are already registered for this event.",
            "att.reg.standard": "Standard",
            "att.reg.selectTicket": "Select Your Ticket",
            "att.reg.selectTicketType": "Select Ticket Type",
            "att.reg.ticketPrice": "Ticket Price",
            "att.reg.demoPayment": "Demo payment — no real charge will be made",
            "att.reg.creditCard": "Credit Card",
            "att.reg.mada": "Mada",
            "att.reg.applePay": "Apple Pay",
            "att.reg.cardholderName": "Name on Card",
            "att.reg.cardholderNamePlaceholder": "Name on Card",
            "att.reg.cardNumber": "CARD NUMBER",
            "att.reg.expiryDate": "EXPIRY DATE",
            "att.reg.cvv": "CVV",
            "att.reg.serviceFee": "Service fee",
            "att.reg.total": "Total",
            "att.reg.ticket": "ticket",
            "att.reg.payConfirm": "Pay & Confirm",
            "att.reg.processing": "Processing Payment...",
            "att.reg.processingDesc": "Please wait while we confirm your booking",
            "att.reg.success": "Payment Successful!",
            "att.reg.successDesc": "Your ticket has been confirmed",
            "att.reg.paymentDetails": "Payment Details",
            "att.reg.securing": "Securing Payment...",
            "att.reg.bookingConfirmed": "Booking Confirmed!",
            "att.reg.successToast": "Registration successful! Your ticket:",
            "att.reg.receipt.event": "Event",
            "att.reg.receipt.ticketType": "TICKET TYPE",
            "att.reg.receipt.amountPaid": "AMOUNT PAID",
            "att.reg.receipt.ticketCode": "TICKET CODE",
            "att.reg.ticketReady": "Your ticket is ready! Head to the My Tickets tab to view your digital ticket and badge.",

            "att.badge.title": "Event Badge",
            "att.badge.print": "Print",
            "att.badge.sendEmail": "Send to my email",
            "att.badge.emailSubject": "Your event badge –",
            "att.badge.addEmail": "Add your email in Profile to use this option.",
            "att.badge.emailHello": "Hello",
            "att.badge.emailIntro": "Your event badge details for",

            "att.history.noPastEvents": "No past events",
            "att.history.noPastEventsDesc": "Events you attend will appear here with options to leave feedback.",
            "att.history.yourFeedback": "Your Feedback",
            "att.history.submitted": "Submitted",
            "att.history.rateFeedback": "Rate & Leave Feedback",
            "att.history.attended": "Attended",

            "att.feedback.title": "Rate & Review",
            "att.feedback.overallRating": "Overall Rating",
            "att.feedback.yourFeedback": "Your Feedback",
            "att.feedback.placeholder": "Share your experience...",
            "att.feedback.submit": "Submit",
            "att.feedback.selectRating": "Please select a rating.",
            "att.feedback.writeFeedback": "Please write your feedback.",
            "att.feedback.thanks": "Thank you for your feedback!",

            "att.withdraw.title": "Withdraw Registration",
            "att.withdraw.confirmText": "Are you sure you want to withdraw from this event? This action cannot be undone.",
            "att.withdraw.confirmBtn": "Confirm Withdrawal",
            "att.withdraw.success": "You have successfully withdrawn from this event.",
            "att.withdraw.flexible": "Flexible",
            "att.withdraw.flexibleDesc": "Full refund available up to 1 day before the event.",
            "att.withdraw.moderate": "Moderate",
            "att.withdraw.moderateDesc": "Full refund available up to 7 days before the event.",
            "att.withdraw.strict": "Strict",
            "att.withdraw.strictDesc": "Full refund available up to 30 days before the event.",
            "att.withdraw.nonRefundable": "Non-refundable",
            "att.withdraw.nonRefundableDesc": "No refunds allowed once tickets are purchased.",
            "att.withdraw.refundPolicy": "Refund Policy",
            "att.withdraw.noPolicy": "No refund policy set for this event. Please contact the organizer.",

            "att.profile.fallbackName": "Attendee",
            "att.profile.updated": "Profile updated successfully!",

            "att.notifications.unread": "unread",
            "att.notifications.messages": "messages",
            "att.notifications.badgeNew": "NEW",
            "att.notifications.markRead": "Mark as read",
            "att.notifications.read": "Read",
            "att.notifications.emptyTitle": "No updates yet",
            "att.notifications.emptyDesc": "When organizers send broadcasts for your registered events, they'll appear here.",
        
        // ======================
        // Password Recovery
        // ======================
        "recovery.step1.title": "Forgot Password",
        "recovery.step1.desc": "Enter your email or username to receive a recovery code.",
        "recovery.methodLabel": "Email Address or Username",
        "recovery.method.placeholder": "e.g. user@eventia.com or organizer123",
        "recovery.step1.button": "Send Recovery Code",
        "recovery.rememberPassword": "Remember your password?",
        "recovery.loading.checking": "Checking...",
        "recovery.loading.verifying": "Verifying...",
        "recovery.loading.saving": "Saving...",
        "recovery.error.passwordMismatch": "Passwords do not match.",

        "recovery.step2.title": "Verify Code",
        "recovery.step2.desc": "Enter the 6-digit code sent to your email.",
        "recovery.codeLabel": "Verification Code",
        "recovery.step2.button": "Verify Code",
        "recovery.back": "Back",
        "recovery.code.placeholder": "••••••",
        "recovery.password.placeholder": "••••••••",

        "recovery.step3.title": "Reset Password",
        "recovery.step3.desc": "Create a secure new password.",
        "recovery.newPassword": "New Password",
        "recovery.step3.button": "Reset Password",

        "recovery.step4.title": "Password Reset!",
        "recovery.step4.desc": "Your password has been changed successfully. You can now log in.",
        "recovery.step4.button": "Go to Log In",

        // ======================
        // AI Assistant
        // ======================
        "ai.time.justNow": "Just now",
        "ai.time.minutesAgo": "{m}m ago",
        "ai.time.hoursAgo": "{h}h ago",
        "ai.time.daysAgo": "{d}d ago",
        "ai.time.yesterday": "Yesterday",
        "ai.newConversation": "New conversation",

        // Header / chrome
        "ai.assistant.title": "Eventia AI",
        "ai.assistant.badge": "Beta",
        "ai.assistant.status": "Online",
        "ai.btn.close": "Close",
        "ai.btn.reset": "New conversation",
        "ai.btn.history": "History",
        "ai.input.placeholder": "Ask me anything about events…",
        "ai.input.send": "Send",
        "ai.footnote": "AI suggestions, not real bookings.",
        "ai.sparkle.tooltip": "Ask Eventia AI",
        "ai.nudge.text": "Try AI search!",
        "ai.nudge.close": "Dismiss",

        // Attendee search bar AI sparkle button + hint
        "att.ai.aria": "AI Assistant — find your perfect event",
        "att.ai.label": "AI Assistant",
        "att.ai.tooltip": "Let AI find your event",
        "att.ai.nudge": "Not sure what to attend? Let AI help you!",
        "att.ai.hint.before": "Can't find what you're looking for? Try our ",
        "att.ai.hint.after": " — describe what you're in the mood for and let it find the perfect event for you.",

        // Attendee AI assistant panel
        "att.aiPanel.aria": "Eventia AI assistant",
        "att.aiPanel.badge": "Assistant",
        "att.aiPanel.status": "Your event discovery guide",
        "att.aiPanel.close": "Close assistant",
        "att.aiPanel.welcome": "Hi, I'm the ",
        "att.aiPanel.welcomeAccent": "Eventia AI Assistant",
        "att.aiPanel.welcomeSubtitle": "Tell me about your interests and I'll find the best events for you.",
        "att.aiPanel.inputPlaceholder": "Tell me what you're interested in...",
        "att.aiPanel.inputAria": "Ask the Eventia AI about events",
        "att.aiPanel.sendAria": "Send message",

        // Welcome / empty state
        "ai.welcome.title": "Hey there! I'm Eventia AI",
        "ai.welcome.subtitle": "Tell me what you're in the mood for and I'll suggest the perfect events.",
        "ai.suggested.title": "Try one of these to start:",

        // History view
        "ai.history.title": "Past conversations",
        "ai.history.clearAll": "Clear all",
        "ai.history.empty.title": "No past conversations yet",
        "ai.history.empty.desc": "Once you start chatting, your conversations will appear here so you can pick up where you left off.",
        "ai.history.messageOne": "message",
        "ai.history.messageMany": "messages",
        "ai.history.deleteLabel": "Delete conversation",
        "ai.history.confirmClear": "Clear all past conversations? This cannot be undone.",
        "ai.history.defaultTitle": "Conversation",

        // Summary phrases
        "ai.summary.events": "events",
        "ai.summary.in": "in",
        "ai.summary.or": "or",
        "ai.summary.today": "happening <strong>today</strong>",
        "ai.summary.thisWeekend": "<strong>this weekend</strong>",
        "ai.summary.thisWeek": "<strong>this week</strong>",
        "ai.summary.nextWeek": "<strong>next week</strong>",
        "ai.summary.free": "that are <strong>free</strong>",
        "ai.summary.under": "under <strong>{price} SAR</strong>",
        "ai.summary.notFound": "I couldn't find {bits} matching that yet.",
        "ai.summary.foundOne": "I found <strong>1</strong> match &mdash; {bits}.",
        "ai.summary.foundMany": "I found <strong>{n}</strong> {bits}.",

        // Follow-up chips (label shown to user)
        "ai.followup.showMore": "Show more",
        "ai.followup.onlyFree": "Only free ones",
        "ai.followup.inRiyadh": "In Riyadh only",
        "ai.followup.thisWeekend": "This weekend",
        "ai.followup.surpriseMe": "Surprise me",

        // Follow-up prompts (sent to interpreter when chip is clicked)
        "ai.followup.prompt.showMore": "(show more)",
        "ai.followup.prompt.free": "free only",
        "ai.followup.prompt.riyadh": "in Riyadh",
        "ai.followup.prompt.weekend": "this weekend",
        "ai.followup.prompt.surprise": "surprise me with something fun",

        // Empty-state suggestions
        "ai.empty.removeCategory": "removing the category filter",
        "ai.empty.tryDifferentCity": "trying a different city",
        "ai.empty.widenBudget": "widening your budget",
        "ai.empty.laterDate": "looking at a later date",
        "ai.empty.tryDescribing": "Try describing what you enjoy &mdash; a category, a mood, or a city.",
        "ai.empty.wantTry": "Want to try {alternatives}?",

        // Event cards
        "ai.event.free": "Free",
        "ai.event.view": "View",
        "ai.event.tbd": "TBD",
        "ai.event.eventLabel": "Event",

        // Typing indicator
        "ai.typing.aria": "Eventia AI is typing",

        // Error
        "ai.error.generic": "Something went wrong on my side. Mind trying again?",
    },
    ar: {
    // ======================
    // Common
    // ======================
        "search.placeholder": "ابحث عن فعاليات، ورش عمل، مؤتمرات...",
        "search.allCities": "كل المدن",
        "city.riyadh": "الرياض",
        "city.jeddah": "جدة",
        "city.dammam": "الدمام",
        "city.mecca": "مكة",
        "city.alula": "العلا",
        "city.dhahran": "الظهران",
        "city.kaust": "جامعة الملك عبدالله للعلوم والتقنية",
        "city.kfupm": "جامعة الملك فهد للبترول والمعادن",
        "search.button": "بحث",

        "cat.all": "كل الفعاليات",
        "cat.tech": "تقنية",
        "cat.technology": "التقنية",
        "cat.art": "فن",
        "cat.business": "أعمال",
        "cat.music": "موسيقى",
        "cat.education": "تعليم",
        "cat.sports": "رياضة",
        "cat.other": "أخرى",
        "cat.conference": "مؤتمر",
        "cat.exhibition": "معرض",
        "cat.entertainment": "ترفيه",
        "cat.workshop": "ورشة عمل",
        "cat.foodCulture": "طعام وثقافة",
        "cat.culture": "ثقافة",
        "cat.family": "العائلة",
        "cat.shopping": "تسوق",
        "cat.gaming": "ألعاب إلكترونية",
        "cat.automotive": "سيارات",
        "events.upcoming": "الفعاليات القادمة",
        "events.subtitle": "لا تفوت هذه الفعاليات القادمة المميزة في أنحاء المملكة العربية السعودية",
        "events.loadMore": "عرض المزيد من الفعاليات",

        "landing.resetFilters": "إعادة ضبط الفلاتر",
        "landing.noEventsEmpty": "لا توجد فعاليات حالياً. تفضّل بزيارتنا لاحقاً!",
        "landing.noSearchResults": "لا توجد فعاليات مطابقة لبحثك. جرّب كلمات مختلفة.",
        "landing.price.from": "يبدأ من",

        "footer.brandDesc": "المنصة الرائدة لإدارة الفعاليات في المملكة العربية السعودية، تربط بين المنظمين ومزودي الخدمات والحضور لتجارب استثنائية.",
        "footer.platform": "المنصة",
        "footer.quickLinks": "روابط سريعة",
        "footer.browseEvents": "تصفح الفعاليات",
        "footer.createAccount": "إنشاء حساب",
        "footer.forOrganizers": "للمنظمين",
        "footer.forVendors": "لمزودي الخدمات",
        "footer.cities": "المدن",
        "footer.copyright": "© 2026 Eventia. جميع الحقوق محفوظة.",
        "footer.madeWith": "صُنع ب",
        "footer.inSaudi": "في المملكة العربية السعودية",

        "common.catering": "ضيافة",
        "common.venues": "قاعات",
        "common.photography": "تصوير",
        "common.decoration": "ديكور",
        "common.av": "صوتيات وشاشات",
        "common.entertainment": "ترفيه",
        "common.security": "أمن",
        "common.transport": "نقل",
        "common.floral": "زهور",
        "common.traditional": "تراثي",
        "common.government": "تصاريح حكومية",
        "common.viewAll": "عرض الكل",
        "common.allCategories": "كل الفئات",
        "common.bakeryDesserts": "مخابز وحلويات",
        "common.beverages": "مشروبات",
        "common.foodTrucks": "عربات طعام",
        "common.venue": "قاعة",
        "common.conferenceHall": "قاعة مؤتمرات",
        "common.outdoorVenue": "موقع خارجي",
        "common.avEquipment": "معدات صوت وصورة",
        "common.audioLighting": "صوتيات وإضاءة",
        "common.ledScreens": "شاشات LED",
        "common.stageRigging": "منصات وتجهيزات",
        "common.liveStreaming": "بث مباشر",
        "common.floralDesign": "تنسيق زهور",
        "common.balloonDecor": "ديكور بالونات",
        "common.eventLighting": "إضاءة فعاليات",
        "common.aerialPhotography": "تصوير جوي",
        "common.photoBooth": "كشك تصوير",
        "common.dj": "خدمات DJ",
        "common.liveEntertainment": "عروض مباشرة",
        "common.kidsEntertainment": "ترفيه للأطفال",
        "common.traditionalMusic": "موسيقى شعبية",
        "common.fireworks": "ألعاب نارية",
        "common.transportation": "نقل",
        "common.shuttle": "نقل جماعي",
        "common.valet": "صف السيارات",
        "common.vipSecurity": "أمن VIP",
        "common.medical": "خدمات طبية",
        "common.eventStaff": "طاقم فعاليات",
        "common.translation": "ترجمة",
        "common.mcHosting": "تقديم الحفل",
        "common.tents": "خيام",
        "common.furniture": "أثاث",
        "common.tableChair": "طاولات وكراسي",
        "common.power": "كهرباء",
        "common.printing": "طباعة",
        "common.bookSales": "بيع الكتب",
        "common.connectivityServices": "خدمات الاتصال والشبكات",
        "common.foodBeverages": "طعام ومشروبات",
        "common.printingSignage": "طباعة ولافتات",
        "common.photographyVideo": "تصوير وفيديو",
        "common.securityServices": "خدمات أمنية",
        "common.socialMedia": "تسويق المواقع الاجتماعية",
        "common.influencer": "تسويق مؤثرين",
        "common.governmentPermits": "تصاريح حكومية",
        "common.safetyPermits": "تصاريح سلامة",
        "common.sponsors": "رعاة",
        "common.brandPartners": "شركاء",
        "common.henna": "حناء",
        "common.falconry": "عروض صقور",
        "common.horseShows": "عروض خيل",
        "common.perfumes": "عطور عربية",
        "common.calligraphy": "خط عربي",
        "common.vrAr": "تجارب VR/AR",
        "common.eco": "خدمات بيئية",
        "common.gifts": "هدايا",
        "common.audioVisual": "سمعي ومرئي",
        "common.florists": "زهور",
        "common.cleaning": "تنظيف",
        "common.professionalServices": "خدمات مهنية",
        "common.eventDecoration": "ديكور الفعاليات",
        "common.permitsLicensing": "تصاريح وتراخيص",
        "common.facilities": "مرافق",
        "common.specialEffects": "مؤثرات خاصة",
        "common.childrenServices": "خدمات الأطفال",
        "common.technology": "تقنية",
        "common.cancel": "إلغاء",
        "common.allStatus": "كل الحالات",
        "common.searchEvents": "ابحث عن فعالية...",
        "common.date": "التاريخ",
        "common.actions": "الإجراءات",
        "common.categories": "التصنيفات:",
        "common.category": "التصنيف",
        "common.description": "الوصف",
        "common.allLocations": "كل المواقع",
        "common.all": "الكل",
        "common.overview": "نظرة عامة",
        "common.pending": "قيد الانتظار",
        "common.notSet": "غير محددة",
        "common.dashNotSet": "— غير محددة",
        "common.title": "العنوان",
        "common.save": "حفظ",
        "common.edit": "تعديل",
        "common.delete": "حذف",
        "common.close": "إغلاق",
        "common.view": "عرض",
        "common.viewDetails": "عرض التفاصيل",
        "common.download": "تنزيل",
        "common.vendor": "مزود الخدمة",
        "common.name": "الاسم:",
        "common.email": "البريد الإلكتروني:",
        "common.service": "الخدمة",
        "common.servicecolon": "الخدمة:",
        "common.categories": "الفئات:",
        "common.allEvents": "كل الفعاليات",
        "common.eventDetails": "تفاصيل الفعالية",
        "common.approved": "مقبول",
        "common.message": "الرسالة",
        "common.messageStar": "الرسالة *",
        "common.optional": "(اختياري)",
        "common.approve": "قبول",
        "common.reject": "رفض",
        "common.firstName": "الاسم الأول",
        "common.lastName": "الاسم الأخير",
        "common.emailAddress": "البريد الإلكتروني",
        "common.phoneNumber": "رقم الجوال",
        "common.password": "كلمة المرور",
        "common.confirmPassword": "تأكيد كلمة المرور",
        "common.free": "مجاني",
        "common.from": "ابتداءً من",
        "common.currencySar": "ر.س",
        "common.status": "الحالة",
        "common.details": "التفاصيل",
        "common.notAvailable": "غير متاح",
        "common.tbd": "يحدد لاحقاً",
        "common.unknown": "غير معروف",
        "common.today": "اليوم",
        "common.ended": "انتهى",
        "common.you": "أنت",
        "common.unknownEvent": "فعالية غير معروفة",
        "common.time": "الوقت",
        "common.location": "الموقع",
        "common.description": "الوصف",
        "common.general": "عام",
        "common.event": "فعالية",
        "policy.flexible": "مرنة",
        "policy.moderate": "متوسطة",
        "policy.strict": "صارمة",
        "policy.nonRefundable": "غير قابلة للاسترداد",
        "policy.moderate14days": "متوسطة (14 يومًا)",
        "policy.strict30days": "صارمة (30 يومًا)",


        "nav.home": "الرئيسية",
        "nav.login": "تسجيل الدخول",
        "nav.signup": "إنشاء حساب",
        "lang.switch.aria": "تغيير اللغة",
        "landing.nav.dashboard": "لوحة التحكم",
        "landing.nav.logout": "تسجيل الخروج",
        "hero.title": "اكتشف وأدر <br><span class=\"hero-title-gradient\">أفضل الفعاليات</span>",
        "hero.desc":
            "المنصة المركزية لإدارة الفعاليات بسهولة في المملكة العربية السعودية. تواصل مع المنظمين، مزودي الخدمات، والمشاركين في مكان واحد.",
        "hero.browse": "تصفح الفعاليات",
        "hero.create": "إنشاء فعالية",
        "hero.premium": "فعاليات مميزة",
        "event.viewDetails": "عرض التفاصيل",
        "login.title": "مرحبًا بعودتك",
        "login.subtitle.attendee": "تسجيل الدخول كزائر",
        "login.emailOrPhone": "البريد الإلكتروني أو رقم الهاتف",
        "login.password": "كلمة المرور",
        "login.forgot": "نسيت كلمة المرور؟",
        "login.remember": "تذكرني",
        "login.signin": "تسجيل الدخول",
        "login.vendorOrg.q": "هل أنت مزود خدمة أو منظم؟",
        "login.vendorOrg.btn": "تسجيل الدخول كمزود خدمة أو منظم",
        "login.new": "جديد في Eventia؟",
        "login.create": "إنشاء حساب",
        "common.backHome": "العودة للرئيسية",
        "bLogin.title": "تسجيل دخول الأعمال",
        "bLogin.subtitle": "الدخول إلى لوحة تحكم مزود الخدمة أو المنظم",
        "bLogin.roleLabel": "أنا:",
        "bLogin.vendor": "مزود خدمة",
        "bLogin.organizer": "منظم",
        "bLogin.signInAs": "تسجيل الدخول ك",
        "bLogin.attendQuestion": "هل ترغب فقط بحضور الفعاليات؟",
        "bLogin.signInAttendee": "تسجيل الدخول كمشارك",
        "bLogin.newTo": "جديد في Eventia؟",
        "bLogin.createBusiness": "إنشاء حساب أعمال",
        "signup.bizPrompt": "هل ترغب في الاستضافة أو تقديم خدمات؟",
        "signup.bizBtn": "إنشاء حساب كمزود خدمة أو منظم",
        "signup.haveAccount": "لديك حساب بالفعل؟",
        "signup.login": "تسجيل الدخول",
        "signup.subtitle": "انضم إلى Eventia كزائر",

        "signup.form.username": "اسم المستخدم",
        "signup.form.vendorName": "اسم مزود الخدمة",
        "signup.form.serviceType": "نوع الخدمة",
        "signup.form.selectServiceType": "اختر نوع الخدمة",
        "signup.form.gender": "الجنس",
        "signup.form.selectGender": "اختر الجنس",
        "signup.form.birthday": "تاريخ الميلاد",
        "signup.form.month": "الشهر",
        "signup.form.day": "اليوم",
        "signup.form.year": "السنة",
        "signup.gender.male": "ذكر",
        "signup.gender.female": "أنثى",
        "signup.validation.invalidEmail": "يرجى إدخال بريد إلكتروني صحيح",
        "signup.validation.passwordPolicy": "يجب أن تحتوي كلمة المرور على: 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص.",
        "signup.validation.passwordsNoMatch": "كلمتا المرور غير متطابقتين",
        "signup.placeholder.strongPassword": "أنشئ كلمة مرور قوية",
        "signup.placeholder.reenterPassword": "أعد إدخال كلمة المرور",
        "signup.service.venueHall": "قاعة / موقع",
        "signup.vendor.ogFood": "الأطعمة والمشروبات",
        "signup.vendor.ogVenues": "القاعات والمواقع",
        "signup.vendor.ogAv": "الصوتيات والتقنية",
        "signup.vendor.ogDecor": "الديكور والتصميم",
        "signup.vendor.ogPhoto": "التصوير والإعلام",
        "signup.vendor.ogEnt": "الترفيه",
        "signup.vendor.ogTransport": "النقل",
        "signup.vendor.ogSecurity": "الأمن والسلامة",
        "signup.vendor.ogStaff": "الكوادر والخدمات",
        "signup.vendor.ogRentals": "التأجير والمعدات",
        "signup.vendor.ogMarketing": "التسويق والترويج",
        "signup.vendor.ogGov": "الجهات والتصاريح",
        "signup.vendor.ogSponsors": "الرعاة والشركاء",
        "signup.vendor.ogSaudi": "الخدمات التراثية السعودية",
        "signup.vendor.ogSpecial": "خدمات متخصصة",
        "signup.month.1": "يناير",
        "signup.month.2": "فبراير",
        "signup.month.3": "مارس",
        "signup.month.4": "أبريل",
        "signup.month.5": "مايو",
        "signup.month.6": "يونيو",
        "signup.month.7": "يوليو",
        "signup.month.8": "أغسطس",
        "signup.month.9": "سبتمبر",
        "signup.month.10": "أكتوبر",
        "signup.month.11": "نوفمبر",
        "signup.month.12": "ديسمبر",

        "biz.registerAsLabel": "التسجيل كـ:",
        "biz.attendPrompt": "هل تريد حضور الفعاليات فقط؟",
        "biz.attendBtn": "إنشاء حساب كمشارك",
        "biz.signupTitle": "حساب أعمال",
        "biz.signupSubtitle": "سجّل كمزود خدمة أو منظم",
        "biz.signUpAs": "التسجيل كـ",

        "msg.invalidCredentials": "بيانات الاعتماد غير صحيحة.",
        "msg.invalidBusinessCredentials": "بيانات الاعتماد التجارية غير صحيحة.",
        "msg.validationFailed": "فشل التسجيل. يرجى مراجعة بياناتك.",
        "msg.loggedOutSuccessfully": "تم تسجيل الخروج بنجاح.",
        "msg.scegaAccessDenied": "تم رفض الوصول. مخصص لمديري الهيئة فقط.",
        "login.error.emptyUsername": "يرجى إدخال اسم المستخدم.",
        "login.error.emptyPassword": "يرجى إدخال كلمة المرور.",
        "signup.error.strength.prefix": "يجب أن تحتوي كلمة المرور على: ",
        "signup.error.atLeast8": "8 أحرف على الأقل",
        "signup.error.uppercase": "حرف كبير واحد",
        "signup.error.lowercase": "حرف صغير واحد",
        "signup.error.number": "رقم واحد",
        "signup.error.special": "رمز خاص واحد",

    // ======================
    // Organizer page
    // ======================
        "org.page.overviewTitle": "نظرة عامة",
        "org.page.createEventTitle": "إنشاء فعالية جديدة",
        "org.page.eventsListTitle": "فعالياتي",
        "org.page.eventManageTitle": "إدارة الفعالية",
        "org.page.vendorsTitle": "سوق مزودي الخدمات",
        "org.page.requestsTitle": "إدارة الطلبات",
        "org.page.analyticsTitle": "تحليلات الفعاليات",
        "org.page.profileTitle": "ملفي الشخصي",
        "org.page.dashboardFallback": "لوحة التحكم",
        "org.nav.overview": "لوحة التحكم",
        "org.nav.createEvent": "إنشاء فعالية",
        "org.nav.eventsList": "قائمة الفعاليات",
        "org.nav.vendors": "مزودو الخدمات",
        "org.nav.requests": "الطلبات",
        "org.nav.analytics": "التحليلات",
        "org.empty.noEventsFull": "لا توجد فعاليات قادمة أو جارية. أنشئ فعالية وانتظر موافقة الهيئه العامه للمعارض و المؤتمرات.",
        "org.nav.logout": "تسجيل الخروج",

        "org.stats.totalEvents": "إجمالي الفعاليات",
        "org.stats.upcoming": "القادمة",
        "org.section.recentEvents": "أحدث الفعاليات",
        "org.empty.noEvents": "لا توجد فعاليات تم إنشاؤها بعد.",
        "org.events.emptyListBanner": "لم يتم العثور على فعاليات. أنشئ فعاليتك الأولى!",

        "org.form.basicInfo": "معلومات أساسية",
        "org.form.dateLocation": "التاريخ والموقع",
        "org.form.tickets": "التذاكر",
        "org.form.eventTitle": "عنوان الفعالية *",
        "org.form.category": "التصنيف *",
        "org.form.selectCategory": "اختر تصنيفًا",
        "org.form.date": "التاريخ *",
        "org.form.time": "الوقت *",
        "org.form.venue": "الموقع / المكان *",
        "org.form.description": "الوصف *",
        "org.form.ticketCategories": "فئات التذاكر *",
        "org.form.totalEventCapacity": "السعة الإجمالية للفعالية *",
        "org.form.totalEventCapacityHelp": "الحد الأقصى لإجمالي عدد الحضور المسموح به لهذه الفعالية.",
        "org.btn.addCategory": "إضافة فئة أخرى",
        "org.form.banner": "صورة الفعالية",
        "org.upload.hint": "انقر لرفع شعار الفعالية",
        "org.form.bannerRemove": "إزالة شعار الفعالية",
        "org.upload.fileTooLarge": "الملف كبير جدًا. يُرجى اختيار صورة أقل من 5 م.ب.",
        "org.upload.formats": "PNG أو JPG أو WEBP — حتى 5 م.ب.",
        "org.validation.selectEventTime": "يرجى اختيار وقت الفعالية.",
        "org.btn.publish": "نشر الفعالية",
        "org.btn.create": "+ إنشاء",

        "org.ph.eventTitle": "مثال: Annual Tech Summit 2026",
        "org.ph.eventDate": "يوم/شهر/سنة",
        "org.ph.eventTime": "--:-- --",
        "org.aria.pickTime": "اختيار وقت الفعالية",
        "org.ph.eventCapacity": "مثال: 500",
        "org.ph.vendorSearch": "ابحث عن مزودي الخدمة بالاسم أو الخدمة...",
        "org.form.venuePh": "مثال: Riyadh Front Exhibition Center, Hall A",
        "org.form.descriptionPh": "صف فعاليّتك، ماذا يتوقع الحضور، أبرز النقاط، المتحدثين، إلخ...",
        "org.form.ticketDefaultName": "قياسي",
        "org.ticket.namePh": "الاسم (مثال: General)",
        "org.ticket.pricePh": "السعر",
        "org.ticket.capacityPh": "الحد الأقصى للحضور",
        "org.scegaApproval": "موافقة الهيئه العامه للمعارض و المؤتمرات",

        "org.vendors.heroTitle": "اعثر على مزودي الخدمات المناسبين",
        "org.vendors.heroDesc": "استكشف التصنيفات، قارن الخيارات، وأرسل طلبات لأفضل مزودي الخدمات",
        "org.nav.profile": "الملف الشخصي",
        "org.profile.role": "منظم",

        "org.form.withdrawalPolicies": "سياسات الانسحاب",

        "org.policy.vendorLabel": "سياسة مزود الخدمة *",
        "org.policy.vendorChoose": "اختر سياسة مزود الخدمة...",
        "org.policy.vendor.flexibleDesc": "مرنة — يمكن لمزودي الخدمة الانسحاب حتى 7 أيام قبل الفعالية",
        "org.policy.vendor.moderateDesc": "متوسطة — حتى 14 يومًا قبل الفعالية",
        "org.policy.vendor.strictDesc": "صارمة — حتى 30 يومًا قبل الفعالية",
        "org.policy.vendor.nonRefundableDesc": "غير قابلة للاسترجاع — لا يُسمح بالانسحاب",
        "org.policy.vendor.notConfigured": "لم يتم إعداد سياسة انسحاب مزود الخدمة لهذه الفعالية.",
        "org.policy.vendor.help": "تنطبق على مزودي الخدمة المشاركين في الفعالية.",
        "org.policy.vendor.helpEvent": "تنطبق على مزودي الخدمة المشاركين في هذه الفعالية.",

        "org.policy.attendeeLabel": "سياسة الحضور *",
        "org.policy.attendeeChoose": "اختر سياسة الحضور...",
        "org.policy.attendee.flexibleDesc": "مرنة — استرداد كامل حتى يوم واحد قبل الفعالية",
        "org.policy.attendee.moderateDesc": "متوسطة — استرداد كامل حتى 7 أيام قبل الفعالية",
        "org.policy.attendee.strictDesc": "صارمة — استرداد كامل حتى 30 يومًا قبل الفعالية",
        "org.policy.attendee.nonRefundableDesc": "غير قابلة للاسترجاع — لا يُسمح بأي استرداد",
        "org.policy.attendee.notConfigured": "لم يتم إعداد سياسة استرداد الحضور لهذه الفعالية.",
        "org.policy.attendee.help": "تنطبق على الحضور الذين يشترون تذاكر للفعالية.",
        "org.policy.attendee.helpShort": "تنطبق على الحضور الذين يشترون التذاكر.",

        "status.pendingApproval": "بانتظار الموافقة",
        "status.ongoing": "جارية",
        "status.upcoming": "قادمة",
        "status.past": "سابقة",
        "status.rejected": "مرفوضة",
        "status.approved": "تمت الموافقة",
        "status.pendingReview": "قيد المراجعة",

        "org.em.eventTitle": "عنوان الفعالية",
        "org.em.eventStatus": "حالة الفعالية",
        "org.em.totalVendors": "إجمالي مزودي الخدمة",
        "org.em.attendees": "الحضور",
        "org.em.daysLeft": "الأيام المتبقية",
        "org.em.tab.communication": "التواصل",
        "org.em.tab.vendors": "مزودين الخدمة",
        "org.em.editDescription": "تعديل الوصف",
        "org.em.ticketTiers": "فئات التذاكر",
        "org.em.inviteVendor": "دعوة مزود خدمة",
        "org.em.vendorsCountDefault": "0 مزودين",
        "org.em.vendorMessages": "رسائل مزودي الخدمة",
        "org.em.attendeeBroadcast": "إشعار للحضور",
        "org.em.newBroadcast": "إشعار جديد لجميع الحضور",
        "org.em.broadcastPh": "اكتب إشعارك لجميع الحضور...",
        "org.em.sendBroadcast": "إرسال الإشعار",
        "org.em.pastBroadcasts": "الإشعارات السابقة",
        "org.em.editEvent": "تعديل الفعالية",
        "org.em.editEventDesc": "عدّل تفاصيل الفعالية والتذاكر والسياسات والمزيد.",
        "org.em.deleteEvent": "حذف الفعالية",
        "org.em.deleteEventDesc": "احذف هذه الفعالية وجميع البيانات المرتبطة بها نهائيًا.",
        "org.em.vendorName": "اسم مزود الخدمة",
        "org.em.chatPh": "اكتب رسالة...",
        "org.em.vendorStatus": "حالة مزود الخدمة",
        "org.em.noTicketTiers": "لم يتم تحديد فئات تذاكر.",
        "org.em.deleteConfirm": "هل أنت متأكد أنك تريد حذف هذه الفعالية؟ لا يمكن التراجع عن هذا الإجراء.",
        "org.em.deleteSuccess": "تم حذف الفعالية بنجاح.",
        "org.em.descriptionEmpty": "لا يمكن أن يكون الوصف فارغًا.",
        "org.em.descriptionUpdated": "تم تحديث الوصف بنجاح!",
        "org.em.vendorSingular": "مزود خدمة",
        "org.em.vendorPlural": "مزودي خدمة",
        "org.em.noVendorsAssigned": "لا يوجد مزودو خدمة مضافون بعد. قم بدعوة مزودي الخدمة من السوق.",
        "org.em.updateRequested": "تم طلب تحديث",
        "org.em.updateAlreadyRequested": "تم طلب التحديث مسبقًا",
        "org.em.requested": "تم طلب التحديث",
        "org.em.askVendorUpdate": "اطلب من مزود الخدمة تحديث حالته",
        "org.em.requestUpdate": "طلب تحديث",
        "org.em.removeVendorConfirm": "هل تريد إزالة مزود الخدمة من الفعالية؟",
        "org.em.vendorRemoved": "تمت إزالة مزود الخدمة من الفعالية.",
        "org.em.updateRequestSent": "تم إرسال طلب التحديث إلى مزود الخدمة!",
        "org.em.noVendorConversations": "لا توجد محادثات مع مزودي الخدمة بعد.",
        "org.em.noMessagesYet": "لا توجد رسائل بعد",
        "org.em.noChatMessages": "لا توجد رسائل بعد. ابدأ المحادثة!",
        "org.em.noBroadcasts": "لم يتم إرسال أي إعلانات بعد.",
        "org.em.broadcast": "إعلان",
        "org.em.broadcastSent": "تم إرسال الإعلان إلى جميع الحضور!",

        "vendor.preparation": "التحضير",
        "vendor.prep.pending": "قيد الانتظار",
        "vendor.prep.preparing": "بدء التحضير في الموقع",
        "vendor.prep.inTransit": "إنهاء التحضير قبل الوصول",
        "vendor.prep.settingUp": "التركيب في موقع الفعالية",
        "vendor.prep.ready": "جاهز",        
        "vendor.status.confirmed": "مؤكد",

        "org.policy.vendorLabelPlain": "سياسة مزود الخدمة",
        "org.policy.attendeeLabelPlain": "سياسة الحضور",

        "org.vendors.searchPh": "ابحث عن مزودي الخدمة بالاسم أو الخدمة...",

        "org.requests.outgoing": "الطلبات الصادرة",
        "org.requests.sentToVendors": "المرسلة إلى مزودي الخدمة",
        "org.requests.incoming": "الطلبات الواردة",
        "org.requests.fromVendors": "من مزودي الخدمة",
        "org.requests.showRequestsFor": "عرض الطلبات الخاصة بـ:",
        "org.requests.noOutgoing": "لا توجد طلبات صادرة بعد",
        "org.requests.noOutgoingDesc": "تصفح سوق مزودي الخدمة للعثور على مزودين ودعوتهم إلى فعالياتك",
        "org.requests.browseVendors": "تصفح مزودي الخدمة",
        "org.requests.noIncoming": "لا توجد طلبات واردة",
        "org.requests.noIncomingDesc": "سيظهر مزودو الخدمة هنا عندما يتقدمون للانضمام إلى فعالياتك",
        "org.requests.requestDetails": "تفاصيل الطلب",
        "org.requests.vendorAttachment": "مرفق مزود الخدمة",
        "org.requests.attachmentDesc": "بروشور الشركة أو التفاصيل التي شاركها مزود الخدمة",
        "org.requests.rejectionReasonFromVendor": "سبب الرفض (من مزود الخدمة)",
        "org.requests.sendRequest": "إرسال طلب",
        "org.requests.sendingRequestTo": "أنت ترسل طلبًا إلى",
        "org.requests.selectEvent": "اختر الفعالية *",
        "org.requests.chooseEvent": "اختر فعالية...",
        "org.requests.chooseEventHelp": "اختر الفعالية التي تريد ربط هذا الطلب بها.",
        "org.requests.messagePh": "صف متطلباتك مثل عدد الضيوف والتواريخ والتفضيلات...",
        "org.requests.fullMessage": "الرسالة كاملة",
        "org.requests.rejectRequest": "رفض الطلب",
        "org.requests.rejectNotify": "سيتم إشعار مزود الخدمة بهذا الإجراء",
        "org.requests.rejectionReason": "سبب الرفض",
        "org.requests.rejectionReasonPh": "أدخل سبب الرفض...",
        "org.requests.vendorWillSee": "سيرى مزود الخدمة هذه الرسالة.",
        "org.requests.sent": "تم الإرسال",
        "org.requests.received": "تم الاستلام",
        "org.requests.eventDate": "تاريخ الفعالية",
        "org.requests.location": "الموقع",
        "org.requests.yourInvitation": "دعوتك",
        "org.requests.vendorProposal": "عرض مزود الخدمة",
        "org.requests.applicationDetails": "تفاصيل الطلب",
        "org.requests.unknownEvent": "فعالية غير معروفة",

        "org.analytics.title": "تحليلات الفعالية",
        "org.analytics.desc": "رؤى تفصيلية حول أداء الفعالية وبيانات الحضور ومبيعات التذاكر.",
        "org.analytics.pageViews": "مشاهدات الصفحة",
        "org.analytics.conversion": "التحويل",
        "org.analytics.revenue": "الإيرادات",
        "org.analytics.tab.overview": "نظرة عامة",
        "org.analytics.tab.eventReport": "تقرير الفعالية",
        "org.analytics.tab.attendees": "الحضور",
        "org.analytics.tab.vendors": "مزودو الخدمة",
        "org.analytics.tab.marketInsights": "تحليلات السوق",

        "org.analytics.kpi.totalEvents": "إجمالي الفعاليات",
        "org.analytics.kpi.totalAttendees": "إجمالي الحضور",
        "org.analytics.kpi.totalRevenue": "الإيرادات التقديرية",
        "org.analytics.kpi.avgAttendance": "متوسط الحضور",
        "org.analytics.kpi.vendorWithdrawals": "انسحابات مزودي الخدمة",
        "org.analytics.kpi.attendeeWithdrawals": "انسحابات الحضور",

        "org.analytics.highlight.topEvent": "أفضل فعالية",
        "org.analytics.highlight.topService": "الخدمة الأكثر حجزًا",
        "org.analytics.highlight.topCategory": "أفضل فئة",
        "org.analytics.highlight.avgSatisfaction": "متوسط الرضا",

        "org.analytics.chart.attendance": "الحضور",
        "org.analytics.chart.revenue": "الإيرادات",
        "org.analytics.chart.servicesDistribution": "توزيع الخدمات",
        "org.analytics.chart.categories": "الفئات",
        "org.analytics.chart.ageGroups": "الفئات العمرية",
        "org.analytics.chart.categoryDistribution": "توزيع الفئات",

        "org.analytics.exportOverview": "تصدير نظرة عامة PDF",
        "org.analytics.exportOverviewTitle": "تصدير النظرة العامة كملف PDF",

        "org.analytics.att.total": "إجمالي الحضور",
        "org.analytics.att.confirmed": "الحضور المؤكد",
        "org.analytics.att.withdrawn": "المنسحبون",
        "org.analytics.att.retention": "معدل الاحتفاظ",

        "org.analytics.att.ticketTypes": "أنواع التذاكر",
        "org.analytics.att.satisfactionCategory": "الرضا حسب الفئة",
        "org.analytics.att.loyalty": "الولاء",

        "org.analytics.att.loyalAttendees": "الحضور الأكثر ولاءً",
        "org.analytics.att.loyalDesc": "الحضور الذين سجلوا في عدة فعاليات — الأكثر تفاعلًا وولاءً.",

        "org.analytics.att.export": "تصدير تقرير الحضور PDF",
        "org.analytics.att.exportTitle": "تصدير تقرير الحضور كملف PDF",

        "org.analytics.eventReportTitle": "تقرير الفعالية",
        "org.analytics.selectEventLabel": "اختر فعالية",
        "org.analytics.selectEventPlaceholder": "— اختر فعالية —",

        "org.analytics.event.dateLabel": "التاريخ",
        "org.analytics.event.categoryLabel": "الفئة",
        "org.analytics.event.statusLabel": "الحالة",

        "org.analytics.exportEvent": "تصدير PDF",
        "org.analytics.exportEventTitle": "تصدير كملف PDF",

        "org.analytics.event.kpi.attendees": "عدد الحضور",
        "org.analytics.event.kpi.revenue": "إجمالي الإيرادات",
        "org.analytics.event.kpi.retention": "معدل الاحتفاظ",
        "org.analytics.event.kpi.vendors": "مزودو الخدمة",
        "org.analytics.event.kpi.vendorWithdrawals": "انسحابات المزودين",
        "org.analytics.event.kpi.attendeeWithdrawals": "انسحابات الحضور",
        "org.analytics.event.kpi.satisfaction": "مستوى الرضا",

        "org.analytics.event.chart.revenueTier": "الإيرادات حسب الفئة",
        "org.analytics.event.chart.ageGroups": "الفئات العمرية",
        "org.analytics.event.chart.registrationTimeline": "تسلسل التسجيل",
        "org.analytics.event.chart.vendorServices": "خدمات المزودين",

        "org.analytics.event.placeholder": "اختر فعالية أعلاه لعرض تقريرها التفصيلي",

        "org.analytics.market.eventsByMonth": "الفعاليات حسب الشهر",
        "org.analytics.market.avgPrice": "متوسط سعر التذكرة",
        "org.analytics.market.revenuePotential": "الإيرادات المتوقعة",
        "org.analytics.market.allTiers": "جميع الفئات",

        "org.analytics.market.export": "تصدير تحليلات السوق PDF",
        "org.analytics.market.exportTitle": "تصدير تحليلات السوق كملف PDF",

        "org.analytics.vendors.title": "تحليلات مزودي الخدمة",
        "org.analytics.vendors.total": "إجمالي مزودي الخدمة",
        "org.analytics.vendors.declinedWithdrawn": "مرفوض / منسحب",
        "org.analytics.vendors.acceptanceRate": "معدل القبول",

        "org.analytics.vendors.topVendor": "أكثر مزود خدمة حجزًا",
        "org.analytics.vendors.topRated": "أعلى مزود تقييمًا",
        "org.analytics.vendors.avgPerEvent": "متوسط عدد المزودين لكل فعالية",

        "org.analytics.vendors.statusBreakdown": "توزيع الحالات",
        "org.analytics.vendors.perEvent": "المزودون لكل فعالية",
        "org.analytics.vendors.allVendors": "جميع مزودي الخدمة",
        "org.analytics.vendors.allVendorsDesc": "قائمة كاملة بمزودي الخدمة مرتبة حسب عدد مشاركاتهم في الفعاليات",

        "org.analytics.vendors.export": "تصدير تقرير مزودي الخدمة PDF",
        "org.analytics.vendors.exportTitle": "تصدير تقرير مزودي الخدمة كملف PDF",

        // ----- organizer-analytics.js dynamic strings -----
        "org.analytics.common.attendees": "الحضور",
        "org.analytics.common.attendee": "حاضر",
        "org.analytics.common.attendeesLower": "حاضر",
        "org.analytics.common.events": "فعاليات",
        "org.analytics.common.event": "فعالية",
        "org.analytics.common.eventLower": "فعالية",
        "org.analytics.common.eventsLower": "فعاليات",
        "org.analytics.common.vendors": "مزودو الخدمة",
        "org.analytics.common.vendor": "مزود",
        "org.analytics.common.bookings": "حجوزات",
        "org.analytics.common.booking": "حجز",
        "org.analytics.common.assignments": "تعيينات",
        "org.analytics.common.assignment": "تعيين",
        "org.analytics.common.responses": "ردود",
        "org.analytics.common.response": "رد",
        "org.analytics.common.registrations": "تسجيلات",
        "org.analytics.common.registration": "تسجيل",
        "org.analytics.common.totalRegSingular": "إجمالي تسجيل",
        "org.analytics.common.totalRegPlural": "إجمالي التسجيلات",
        "org.analytics.common.noDataYet": "لا توجد بيانات بعد",
        "org.analytics.common.noDate": "بدون تاريخ",
        "org.analytics.common.uncategorized": "غير مصنف",
        "org.analytics.common.active": "نشط",
        "org.analytics.common.confirmed": "مؤكد",
        "org.analytics.common.declined": "مرفوض",
        "org.analytics.common.pending": "قيد الانتظار",
        "org.analytics.common.confirmedLower": "مؤكد",
        "org.analytics.common.pendingLower": "قيد الانتظار",
        "org.analytics.common.other": "أخرى",

        "org.analytics.age.under18": "أقل من 18",
        "org.analytics.age.18_24": "18–24",
        "org.analytics.age.25_34": "25–34",
        "org.analytics.age.35_44": "35–44",
        "org.analytics.age.45_54": "45–54",
        "org.analytics.age.55plus": "55+",

        "org.analytics.month.jan": "يناير",
        "org.analytics.month.feb": "فبراير",
        "org.analytics.month.mar": "مارس",
        "org.analytics.month.apr": "أبريل",
        "org.analytics.month.may": "مايو",
        "org.analytics.month.jun": "يونيو",
        "org.analytics.month.jul": "يوليو",
        "org.analytics.month.aug": "أغسطس",
        "org.analytics.month.sep": "سبتمبر",
        "org.analytics.month.oct": "أكتوبر",
        "org.analytics.month.nov": "نوفمبر",
        "org.analytics.month.dec": "ديسمبر",

        "org.analytics.axis.numAttendees": "عدد الحضور",
        "org.analytics.axis.numEvents": "الفعاليات",
        "org.analytics.axis.numVendors": "عدد المزودين",
        "org.analytics.axis.totalAttendees": "إجمالي الحضور",
        "org.analytics.axis.totalRegistrations": "إجمالي التسجيلات",
        "org.analytics.axis.month": "الشهر",
        "org.analytics.axis.date": "التاريخ",
        "org.analytics.axis.ageGroup": "الفئة العمرية",
        "org.analytics.axis.eventCategory": "فئة الفعالية",
        "org.analytics.axis.category": "الفئة",
        "org.analytics.axis.ticketTier": "فئة التذكرة",
        "org.analytics.axis.event": "الفعالية",
        "org.analytics.axis.revenueSar": "الإيرادات (ريال)",
        "org.analytics.axis.avgPriceSar": "متوسط السعر (ريال)",
        "org.analytics.axis.avgRevenuePerEvent": "متوسط الإيرادات/فعالية (ريال)",
        "org.analytics.axis.avgScore": "متوسط التقييم (من 5)",
        "org.analytics.axis.avgSatisfaction": "متوسط الرضا",
        "org.analytics.axis.confirmedVendors": "المزودون المؤكدون",

        "org.analytics.title.attendanceByEvent": "الحضور حسب الفعالية",
        "org.analytics.title.revenueByEvent": "الإيرادات حسب الفعالية",
        "org.analytics.title.attendeesByCategory": "الحضور حسب الفئة",
        "org.analytics.title.attendeesByAgeGroup": "الحضور حسب الفئة العمرية",
        "org.analytics.title.revenueByTier": "الإيرادات حسب فئة التذكرة",
        "org.analytics.title.regTimeline": "الجدول الزمني للتسجيل",
        "org.analytics.title.eventsByMonth": "عدد الفعاليات حسب الشهر",
        "org.analytics.title.avgPriceByCategory": "متوسط سعر التذكرة حسب الفئة",
        "org.analytics.title.avgPriceByCategoryFmt": "متوسط سعر \"{tier}\" حسب الفئة",
        "org.analytics.title.avgRevenueByCategory": "متوسط الإيرادات المتوقعة لكل فعالية حسب الفئة",
        "org.analytics.title.satisfactionByCategory": "متوسط الرضا حسب فئة الفعالية",
        "org.analytics.title.confirmedVendorsPerEvent": "المزودون المؤكدون لكل فعالية",

        "org.analytics.loyalty.gold": "ذهبي",
        "org.analytics.loyalty.silver": "فضي",
        "org.analytics.loyalty.bronze": "برونزي",
        "org.analytics.loyalty.loyal": "وفي",
        "org.analytics.loyalty.empty": "لم يتم العثور على حضور متكررين بعد.",
        "org.analytics.vendors.empty": "لا توجد مزودي خدمة متاحين.",

        "org.analytics.pdf.kpiSection": "مؤشرات الأداء الرئيسية",
        "org.analytics.pdf.highlightsSection": "أبرز النقاط",
        "org.analytics.pdf.overviewTitle": "إيفينتيا — تقرير النظرة العامة",
        "org.analytics.pdf.attendeesTitle": "إيفينتيا — تقرير الحضور",
        "org.analytics.pdf.vendorsTitle": "إيفينتيا — تقرير تحليلات مزودي الخدمة",
        "org.analytics.pdf.marketTitle": "إيفينتيا — تقرير تحليلات السوق",
        "org.analytics.pdf.eventTitleFallback": "تقرير الفعالية",
        "org.analytics.pdf.generatedOn": "تاريخ الإنشاء: ",
        "org.analytics.pdf.noChartData": "لا تتوفر بيانات لهذا الرسم البياني.",
        "org.analytics.pdf.generating": "جارٍ الإنشاء...",
        "org.analytics.pdf.fileError": "تصدير PDF لا يعمل عند فتح الصفحة كملف محلي (شريط العنوان يعرض ‎file:///…‎).\n\nقم بتشغيل خادم ويب صغير في مجلد المشروع، ثم استخدم http://localhost بدلاً من ذلك. مثال:\n\n  cd your-project-folder\n  python3 -m http.server 8080\n\nافتح: http://localhost:8080/organizer-dashboard.html",
        "org.analytics.pdf.libError": "لم يتم تحميل مكتبة PDF. تحقق من الشبكة، وأعد تحميل الصفحة، وافتح الموقع عبر http(s) وليس عبر file://.",
        "org.analytics.pdf.h2cError": "لم يتم تحميل أداة لقطة الشاشة. أعد تحميل الصفحة وحاول مجدداً.",
        "org.analytics.pdf.timeout": "انتهت مهلة لقطة الشاشة.",
        "org.analytics.pdf.cantBuild": "تعذر إنشاء التقرير.",
        "org.analytics.pdf.emptyShot": "لقطة الشاشة فارغة.",
        "org.analytics.pdf.cantRead": "تعذر قراءة صورة الصفحة (يحدث عادة عند فتح الملف مباشرة).",
        "org.analytics.pdf.cantGenerate": "تعذر إنشاء ملف PDF. إذا كان شريط العنوان يعرض ‎file:///‎، فقم بتقديم المشروع عبر http://localhost بدلاً من ذلك.",
        "org.analytics.pdf.cantStart": "تعذر بدء التصدير. راجع وحدة التحكم للحصول على التفاصيل.",
        "org.analytics.pdf.detailsPrefix": "\n\nالتفاصيل: ",

        "org.analytics.pdf.section.attendanceByEvent": "الحضور حسب الفعالية",
        "org.analytics.pdf.section.revenueByEvent": "الإيرادات حسب الفعالية",
        "org.analytics.pdf.section.servicesDistribution": "توزيع الخدمات",
        "org.analytics.pdf.section.eventCategories": "فئات الفعاليات",
        "org.analytics.pdf.section.revenueByTier": "الإيرادات حسب الفئة",
        "org.analytics.pdf.section.ageGroups": "الفئات العمرية",
        "org.analytics.pdf.section.regTimeline": "الجدول الزمني للتسجيل",
        "org.analytics.pdf.section.vendorServices": "خدمات المزودين",
        "org.analytics.pdf.section.attByAgeGroup": "الحضور حسب الفئة العمرية",
        "org.analytics.pdf.section.ticketTypes": "توزيع أنواع التذاكر",
        "org.analytics.pdf.section.satByCategory": "الرضا حسب فئة الفعالية",
        "org.analytics.pdf.section.categoryDist": "توزيع الفئات",
        "org.analytics.pdf.section.statusBreakdown": "تفصيل الحالات",
        "org.analytics.pdf.section.vendorsPerEvent": "المزودون لكل فعالية",
        "org.analytics.pdf.section.eventsByMonth": "عدد الفعاليات حسب الشهر",
        "org.analytics.pdf.section.avgPriceByCat": "متوسط سعر التذكرة حسب الفئة",
        "org.analytics.pdf.section.avgPriceByCatFmt": "متوسط سعر التذكرة حسب الفئة ({tier})",
        "org.analytics.pdf.section.revenuePotential": "الإيرادات المتوقعة لكل فعالية حسب الفئة",

        "org.profile.roleFull": "منظم فعاليات",
        "org.profile.organizationName": "اسم الجهة",
        "org.profile.passwordKeepPlaceholder": "اتركه فارغًا للإبقاء على الحالية",

        // ======================
        // Organizer logic
        // ======================
            "org.manage.title": "إدارة الفعالية",
            "org.manage.manage": "إدارة",
            "org.em.updateEvent": "تحديث الفعالية",
            "org.ticket.general": "عام",

            "org.scegaApproved": "موافقة الهيئة العامة للمعارض والمؤتمرات",

            "org.toast.updated": "تم تحديث الفعالية بنجاح",
            "org.toast.submitted": "تم إرسال الفعالية للموافقة، ستتم مراجعتها من قبل الهيئة قريبًا",
            "org.toast.ticketRequired": "يجب وجود فئة تذاكر واحدة على الأقل",
            "org.error.loadingData": "حدث خطأ أثناء تحميل البيانات من الخادم.",
            "org.error.savingEvent": "حدث خطأ أثناء حفظ الفعالية.",
            "org.error.deletingEvent": "حدث خطأ أثناء حذف الفعالية.",
            "org.error.sendingRequest": "حدث خطأ أثناء إرسال الطلب.",
            "org.error.rejectingRequest": "حدث خطأ أثناء رفض الطلب.",
            "org.error.approvingRequest": "حدث خطأ أثناء الموافقة على الطلب.",
            "org.error.updatingDescription": "حدث خطأ أثناء تحديث الوصف.",
            "org.error.sendingMessage": "حدث خطأ أثناء إرسال الرسالة.",
            "org.error.sendingBroadcast": "حدث خطأ أثناء إرسال الإشعار.",
            "org.error.requestingUpdate": "حدث خطأ أثناء طلب التحديث.",
            "org.error.generic": "خطأ: {detail}",

            "org.events.noneFound": "لم يتم العثور على فعاليات.",

            "org.vendors.resultsFull": "تم العثور على {count} مزود خدمة في {category}",
            "org.vendors.resultsAll": "تم العثور على {count} مزود خدمة",
            "org.vendors.inCategory": "في",
            "org.vendors.noResults": "لم يتم العثور على مزودي خدمة يطابقون معاييرك.",
            "org.vendors.clearFilters": "مسح الفلاتر",

            "org.requests.sentSuccess": "تم إرسال الطلب بنجاح",
            "org.requests.sentSuccessTo": "تم إرسال الطلب إلى {vendor} بنجاح",
            "org.requests.duplicate": "يوجد طلب مسبق لهذا المزود والفعالية.",
            "org.requests.rejectedSuccess": "تم رفض الطلب",
            "org.requests.rejectedFrom": "تم رفض طلب {vendor}",
            "org.requests.approvedSuccess": "تمت الموافقة على الطلب",
            "org.requests.approvedFrom": "تمت الموافقة على طلب {vendor}",
            "org.profile.updated": "تم تحديث الملف الشخصي بنجاح",
            "org.requests.requestSingular": "طلب",
            "org.requests.requestsPlural": "طلبات",
            "org.requests.unlinkedEvent": "فعالية غير مرتبطة",
            "org.requests.unknownVendor": "مزود خدمة غير معروف",

            "vendor.preparation": "التحضير",
            "vendor.history.updatedByVendor": "تم التحديث بواسطة مزود الخدمة",
            "vendor.history.system": "النظام",
            "vendor.history.updated": "تم التحديث",
            "vendor.history.awaitingStep": "بانتظار هذه المرحلة",

            "vendor.group.foodBeverages": "الأطعمة والمشروبات",
            "vendor.group.venues": "القاعات والمواقع",
            "vendor.group.avTechnology": "التقنيات والصوتيات",
            "vendor.group.decorationDesign": "الديكور والتصميم",
            "vendor.group.photographyMedia": "التصوير والإعلام",
            "vendor.group.entertainment": "الترفيه",
            "vendor.group.transportation": "النقل",
            "vendor.group.securitySafety": "الأمن والسلامة",
            "vendor.group.staffingServices": "الطاقم والخدمات",
            "vendor.group.rentalsEquipment": "التأجير والمعدات",
            "vendor.group.marketingPromotion": "التسويق والترويج",
            "vendor.group.governmentPermits": "التصاريح الحكومية",
            "vendor.group.sponsorsPartners": "الرعاة والشركاء",
            "vendor.group.saudiCultural": "الخدمات الثقافية السعودية",
            "vendor.group.specializedServices": "الخدمات المتخصصة",

    // ======================
    // Vendor page
    // ======================
        "vendor.brand": "Eventia مزود الخدمة",
        "vendor.nav.overview": "لوحة التحكم",
        "vendor.nav.myEvents": "فعالياتي",
        "vendor.nav.invitations": "الدعوات",
        "vendor.nav.browseEvents": "تصفح الفعاليات",
        "vendor.nav.profile": "الملف الشخصي",
        "vendor.nav.logout": "تسجيل الخروج",

        "vendor.page.dashboard": "لوحة تحكم مزود الخدمة",
        "vendor.page.invitations": "إدارة الدعوات",
        "vendor.page.browseEvents": "تصفح الفعاليات",
        "vendor.page.myEvents": "فعالياتي",
        "vendor.page.eventManage": "إدارة الفعالية",
        "vendor.page.profile": "ملف مزود الخدمة",

        "vendor.role": "مزود خدمة",
        "vendor.stats.pendingInvites": "الدعوات المعلقة",
        "vendor.stats.activeEvents": "الفعاليات النشطة",
        "vendor.stats.completedEvents": "الفعاليات المكتملة",

        "vendor.overview.upcoming": "فعالياتي القادمة",

        "vendor.requests.myApplications": "طلباتي",
        "vendor.requests.sentToOrganizers": "المرسلة إلى المنظمين",
        "vendor.requests.invitations": "الدعوات",
        "vendor.requests.fromOrganizers": "الواردة من المنظمين",
        "vendor.requests.filterByStatus": "تصفية حسب الحالة:",
        "vendor.requests.allApplications": "كل الطلبات",
        "vendor.requests.allInvitations": "كل الدعوات",
        "vendor.requests.noApplications": "لا توجد طلبات بعد",
        "vendor.requests.noApplicationsDesc": "تصفح الفعاليات وأرسل عروضك إلى المنظمين",
        "vendor.requests.noInvitations": "لا توجد دعوات",
        "vendor.requests.noInvitationsDesc": "سيُرسل المنظمون دعوات الفعاليات هنا",
        "vendor.requests.organizer": "المنظم",
        "vendor.requests.accept": "قبول",
        "vendor.requests.readMore": "قراءة المزيد",
        "vendor.requests.fullMessage": "الرسالة الكاملة",
        "vendor.requests.messageFromOrganizer": "رسالة من المنظم",

        "vendor.browse.heroTitle": "اعثر على فعاليات للتقديم عليها",
        "vendor.browse.heroDesc": "استكشف الفعاليات القادمة، صفِّها حسب الفئة، وأرسل عروضك إلى المنظمين",
        "vendor.browse.searchPh": "ابحث عن فعالية بالاسم أو الموقع...",
        "vendor.browse.resultsNone": "لم يتم العثور على فعاليات.",
        "vendor.browse.resultsFound": "تم العثور على {count} فعالية.",

        "vendor.myEvents.heroTitle": "فعالياتي",
        "vendor.myEvents.heroDesc": "الفعاليات التي تم تأكيد مشاركتك فيها. أدِر جدولك الزمني وانسحب عند الحاجة.",
        "vendor.myEvents.searchPh": "ابحث باسم الفعالية أو الموقع...",
        "vendor.myEvents.eventDetails": "تفاصيل الفعالية",
        "vendor.myEvents.actions": "الإجراءات",
        "vendor.myEvents.organizer": "المنظم",
        "vendor.myEvents.yourService": "خدمتك",
        "vendor.myEvents.attendees": "الحضور",
        "vendor.myEvents.daysLeft": "الأيام المتبقية",
        "vendor.myEvents.yourRole": "دورك",
        "vendor.myEvents.overview": "نظرة عامة",
        "vendor.myEvents.communication": "التواصل",
        "vendor.myEvents.actionsTab": "الإجراءات",
        "vendor.myEvents.dateLocation": "التاريخ والموقع",
        "vendor.myEvents.withdrawPolicy": "سياسة انسحاب مزود الخدمة",
        "vendor.myEvents.ticketTiers": "فئات التذاكر",
        "vendor.myEvents.noMessages": "لا توجد رسائل بعد",
        "vendor.myEvents.withdrawTitle": "الانسحاب من الفعالية",
        "vendor.myEvents.withdrawDesc": "ألغِ مشاركتك في هذه الفعالية. سيتم إشعار المنظم.",
        "vendor.myEvents.withdrawBtn": "انسحب",

        "vendor.profile.changePhoto": "اضغط لتغيير الصورة",
        "vendor.profile.title": "مزود خدمة Eventia",
        "vendor.profile.businessName": "اسم النشاط التجاري",
        "vendor.profile.username": "اسم المستخدم",
        "vendor.profile.contactPerson": "الشخص المسؤول",
        "vendor.profile.serviceCategory": "فئة الخدمة",
        "vendor.profile.serviceDescription": "وصف الخدمة",
        "vendor.profile.saveChanges": "حفظ التغييرات",

        "vendor.modal.importantNotice": "ملاحظة مهمة",
        "vendor.modal.rejectTitle": "رفض الدعوة",
        "vendor.modal.rejectNotify": "سيتم إشعار المنظم بهذا الإجراء",
        "vendor.modal.rejectingInvitationFor": "أنت على وشك رفض الدعوة الخاصة بـ:",
        "vendor.modal.rejectionReason": "سبب الرفض",
        "vendor.modal.rejectionReasonPh": "يرجى كتابة سبب الرفض...",
        "vendor.modal.organizerWillSee": "سيظهر هذا السبب للمنظم في لوحة التحكم.",
        "vendor.modal.rejectInvitation": "رفض الدعوة",

        "vendor.modal.withdrawTitle": "الانسحاب من الفعالية",
        "vendor.modal.withdrawNotify": "سيتم إشعار المنظم بهذا الإجراء",
        "vendor.modal.withdrawingFrom": "أنت على وشك الانسحاب من:",
        "vendor.modal.withdrawReason": "سبب الانسحاب",
        "vendor.modal.withdrawReasonPh": "يرجى كتابة سبب انسحابك...",
        "vendor.modal.confirmWithdrawal": "تأكيد الانسحاب",

        "vendor.modal.applyTitle": "التقديم على فعالية",
        "vendor.modal.applySubtitle": "أرسل عرضًا إلى المنظم يتضمن خدماتك وتفاصيلك.",
        "vendor.modal.serviceType": "نوع خدمتك",
        "vendor.modal.messageProposal": "الرسالة / العرض",
        "vendor.modal.messageProposalPh": "اشرح ما الذي يمكنك تقديمه، والتسعير، ولماذا أنت مناسب...",
        "vendor.modal.attachmentLabel": "مرفق (اختياري)",
        "vendor.modal.attachmentHint": "PDF أو Word أو صور — نبذة عن الشركة أو تفاصيل إضافية (الحد الأقصى 5MB).",
        "vendor.modal.chooseFile": "اختيار ملف",
        "vendor.modal.noFileChosen": "لم يُختر ملف",
        "vendor.modal.remove": "إزالة",
        "vendor.modal.removeAttachment": "إزالة المرفق",
        "vendor.modal.sendProposal": "إرسال العرض",

        "vendor.chat.organizer": "المنظم",
        "vendor.chat.organizerFallback": "منظم الفعالية",
        "vendor.chat.youPrefix": "أنت: ",
        "vendor.chat.noMessagesPreview": "لا توجد رسائل بعد",
        "vendor.chat.noMessages": "لا توجد رسائل بعد",
        "vendor.chat.event": "فعالية",
        "vendor.chat.typeMessage": "اكتب رسالة...",
        "vendor.chat.sendFailed": "فشل إرسال الرسالة.",

        "vendor.status.updateTitle": "تحديث حالة التجهيز",
        "vendor.status.progressNote": "ملاحظة التقدم",
        "vendor.status.progressNotePh": "اشرح تقدمك الحالي، مثال: تم تحريك عربة الطعام، ووقت الوصول ساعتان...",
        "vendor.status.advanceStatus": "تحديث الحالة",

        "vendor.cat.foodBeverage": "طعام ومشروبات",
        "vendor.cat.healthWellness": "الصحة",
        "vendor.cat.culture": "ثقافة",
        "vendor.cat.fashion": "أزياء",
        "vendor.cat.charity": "خيري",
        "vendor.cat.innovation": "ابتكار",
        "vendor.cat.startup": "شركة ناشئة",
        "vendor.cat.design": "تصميم",
        "vendor.cat.conference": "مؤتمر",
        "vendor.cat.networking": "شبكات وعلاقات",
        "vendor.cat.tradeShow": "معرض تجاري",
        "vendor.cat.concert": "حفل",
        "vendor.cat.festival": "مهرجان",
        "vendor.cat.theater": "مسرح",
        "vendor.cat.workshop": "ورشة عمل",
        "vendor.cat.training": "تدريب",
        "vendor.cat.seminar": "ندوة",
        "vendor.cat.marathon": "ماراثون",
        "vendor.cat.tournament": "بطولة",
        "vendor.cat.fitness": "لياقة",
        "vendor.cat.food": "طعام",
        "vendor.cat.culinary": "فن الطهي",
        "vendor.cat.wineTasting": "تذوق مشروبات",
        "vendor.cat.foodFestival": "مهرجان طعام",
        "vendor.cat.health": "صحة",
        "vendor.cat.wellness": "العافية",
        "vendor.cat.yoga": "يوغا",
        "vendor.cat.meditation": "تأمل",
        "vendor.cat.fundraising": "جمع تبرعات",
        "vendor.cat.community": "مجتمع",
        "vendor.cat.social": "اجتماعي",
        "vendor.cat.expo": "إكسبو",
        "vendor.cat.fair": "معرض",
        "vendor.cat.celebration": "احتفال",

        // ======================
        // Vendor logic
        // ======================
            "vendor.upcoming.emptyTitle": "لا توجد لديك فعاليات قادمة",
            "vendor.upcoming.emptyDesc": "تصفح الفعاليات وقدّم للمشاركة",

            "vendor.myEvents.emptySearchTitle": "لا توجد فعاليات تطابق بحثك",
            "vendor.myEvents.emptySearchDesc": "جرّب كلمات بحث مختلفة أو قم بمسح البحث",
            "vendor.myEvents.emptyTitle": "لم تنضم إلى أي فعاليات بعد",
            "vendor.myEvents.emptyDesc": "تصفح الفعاليات وقدّم للمشاركة في الفعاليات القادمة",
            "vendor.myEvents.manage": "إدارة",
            "vendor.browse.noUpcomingMatch": "لا توجد فعاليات قادمة مطابقة لبحثك.",
            "vendor.browse.applyNow": "قدّم الآن",
            "vendor.browse.applied": "تم التقديم",

            "vendor.invitation.accepted": "تم قبول الدعوة!",
            "vendor.invitation.acceptFailed": "تعذر قبول الدعوة.",
            "vendor.invitation.eventReview": "مراجعة الفعالية",
            "vendor.invitation.noDescription": "لم يتم تقديم وصف لهذه الفعالية.",
            "vendor.invitation.ticketsPricing": "التذاكر والأسعار",
            "vendor.invitation.rejected": "تم رفض الدعوة.",
            "vendor.invitation.rejectFailed": "تعذر رفض الدعوة.",

            "vendor.policy.flexibleDesc": "مرنة — يمكن الانسحاب حتى 7 أيام قبل الفعالية",
            "vendor.policy.moderateDesc": "متوسطة — يمكن الانسحاب حتى 14 يومًا قبل الفعالية",
            "vendor.policy.strictDesc": "صارمة — يمكن الانسحاب حتى 30 يومًا قبل الفعالية",
            "vendor.policy.nonRefundableDesc": "غير قابلة للاسترداد — لا يُسمح بالانسحاب",
            "vendor.policy.notSet": "لم يتم تحديد سياسة",

            "vendor.withdraw.reason.nonRefundable": "هذا الطلب لديه سياسة انسحاب غير قابلة للاسترداد. لا يمكنك الانسحاب.",
            "vendor.withdraw.reason.strict": "انتهت مهلة الانسحاب. تتطلب السياسة الانسحاب قبل 30 يومًا على الأقل من الفعالية (متبقي {days} يومًا).",
            "vendor.withdraw.reason.moderate": "انتهت مهلة الانسحاب. تتطلب السياسة الانسحاب قبل 14 يومًا على الأقل من الفعالية (متبقي {days} يومًا).",
            "vendor.withdraw.reason.flexible": "انتهت مهلة الانسحاب. تتطلب السياسة الانسحاب قبل 7 أيام على الأقل من الفعالية (متبقي {days} يومًا).",
            "vendor.withdraw.policyTitle": "سياسة الانسحاب",
            "vendor.withdraw.notAllowedPlaceholder": "الانسحاب غير مسموح بموجب السياسة الحالية.",
            "vendor.withdraw.reasonPlaceholder": "يرجى توضيح سبب انسحابك...",
            "vendor.withdraw.blocked": "تم منع الانسحاب بسبب السياسة.",
            "vendor.withdraw.byVendorPrefix": "تم الانسحاب بواسطة مزود الخدمة",
            "vendor.withdraw.success": "تم الانسحاب من الفعالية",
            "vendor.withdraw.failed": "فشل الانسحاب.",
            "vendor.apply.fileTooLarge": "الملف كبير جدًا. الحد الأقصى {max}MB.",
            "vendor.apply.sentSuccess": "تم إرسال الطلب بنجاح!",
            "vendor.apply.failed": "فشل إرسال الطلب.",
            "vendor.apply.attachmentTooLarge": "يجب أن يكون حجم المرفق أقل من {max}MB.",
            "vendor.categories.modalTitle": "جميع فئات الفعاليات",
            "vendor.preparationStatus.title": "حالة تجهيزك",
            "vendor.preparationStatus.updateButton": "تحديث الحالة",
            "vendor.updateRequest.title": "تم طلب تحديث الحالة!",
            "vendor.updateRequest.desc": "يرغب منظم الفعالية في أن تقوم بتحديث تقدم التجهيز الخاص بك.",
            "vendor.updateRequest.updateNow": "حدّث الآن",

            "vendor.prep.finalStatus": "أنت بالفعل في الحالة النهائية: {status}!",
            "vendor.prep.advanceTo": "الانتقال إلى \"{status}\"",
            "vendor.prep.noteRequired": "يرجى إدخال ملاحظة عن التقدم.",
            "vendor.prep.updatedTo": "تم تحديث الحالة إلى \"{status}\"!",
            "vendor.prep.statusUpdateFailed": "فشل تحديث الحالة.",

            "vendor.eventManage.organizerFallback": "منظم الفعالية",
            "vendor.eventManage.eventEnded": "انتهت الفعالية",
            "vendor.eventManage.withdraw": "انسحاب",

            "vendor.policy.badgeFlexible": "✦ مرنة",
            "vendor.policy.badgeModerate": "✦ متوسطة",
            "vendor.policy.badgeStrict": "✦ صارمة",
            "vendor.policy.badgeNonRefundable": "✦ غير قابلة للاسترداد",

            "vendor.policy.descFlexible": "يسمح بالانسحاب حتى 7 أيام قبل الفعالية.",
            "vendor.policy.descModerate": "يسمح بالانسحاب حتى 14 يومًا قبل الفعالية.",
            "vendor.policy.descStrict": "يسمح بالانسحاب حتى 30 يومًا قبل الفعالية.",
            "vendor.policy.descNonRefundable": "لا يُسمح بالانسحاب أو الإلغاء بعد التأكيد.",

            "vendor.categories.techInnovation": "التقنية والابتكار",
            "vendor.categories.artsCulture": "الفنون والثقافة",
            "vendor.categories.businessProfessional": "الأعمال والمجال المهني",
            "vendor.categories.entertainment": "الترفيه",
            "vendor.categories.educationLearning": "التعليم والتعلّم",
            "vendor.categories.sportsFitness": "الرياضة واللياقة",
            "vendor.categories.foodBeverage": "الطعام والمشروبات",
            "vendor.categories.healthWellness": "الصحة والعافية",
            "vendor.categories.communitySocial": "المجتمع والأنشطة الاجتماعية",
            "vendor.categories.otherGroup": "أخرى",


    // ======================
    // SCEGA dashboard
    // ======================
        "scega.brand": "إدارة الهيئة",
        "scega.nav.overview": "لوحة التحكم",
        "scega.nav.history": "السجل",
        "scega.nav.logout": "تسجيل الخروج",

        "scega.login.pageTitle": "تسجيل دخول إدارة الهيئة العامة للمعارض والمؤتمرات | Eventia",
        "scega.login.portal": "بوابة الهيئة العامة للمعارض والمؤتمرات",
        "scega.login.restricted": "وصول مقيد",
        "scega.login.logIn": "تسجيل الدخول",
        "scega.login.backToEventia": "العودة إلى Eventia",

        "scega.page.dashboard": "لوحة تحكم الإدارة",
        "scega.page.dashboardOverview": "نظرة عامة على اللوحة",
        "scega.page.pendingRequests": "الطلبات المعلقة",
        "scega.page.history": "سجل الموافقات",

        "scega.profile.role": "مدير النظام",

        "scega.stats.pending": "الطلبات المعلقة",
        "scega.stats.approved": "الفعاليات الموافق عليها",
        "scega.stats.rejected": "الفعاليات المرفوضة",

        "scega.section.pendingQueue": "قائمة الفعاليات المعلقة",

        "scega.modal.rejectTitle": "رفض الفعالية",
        "scega.modal.rejectNotify": "سيتم إشعار المنظم بهذا الإجراء",
        "scega.modal.rejectionReason": "سبب الرفض ",
        "scega.modal.rejectionReasonPh": "أدخل سبب الرفض...",
        "scega.modal.organizerWillSee": "سيتمكن المنظم من رؤية هذه الرسالة في لوحته.",
        "scega.modal.rejectBtn": "رفض الفعالية",
        // ======================
        // SCEGA logic
        // ======================
            "scega.modal.eventReview": "مراجعة الفعالية",

            "scega.actions.approve": "موافقة",
            "scega.actions.readMore": "قراءة المزيد",

            "scega.confirm.approve": "هل أنت متأكد أنك تريد الموافقة على هذه الفعالية؟",
            "scega.alert.approved": "تمت الموافقة على الفعالية بنجاح!",
            "scega.alert.rejected": "تم رفض الفعالية.",

            "scega.empty.noPending": "لا توجد طلبات معلقة.",
            "scega.empty.noPendingNow": "لا توجد طلبات معلقة حاليًا",
            "scega.empty.allCaughtUp": "تم الانتهاء من كل شيء! 🎉",
            "scega.empty.noHistory": "لا يوجد سجل بعد",
            "scega.empty.noDescription": "لا يوجد وصف مضاف.",

            "scega.common.general": "عام",
            "scega.page.dashboardOverview": "نظرة عامة على لوحة التحكم",
            "scega.page.pendingRequests": "الطلبات المعلقة",
            "scega.page.history": "سجل الموافقات",

            "scega.common.tbd": "يحدد لاحقًا",

            "scega.ticket.freeEvent": "فعالية مجانية",
            "scega.ticket.pricing": "التذاكر والأسعار",

    // ======================
    // Landing page
    // ======================
        "hero.tagline": "اعثر على الفعاليات. احجز التذاكر. واستمتع بالتجربة.",
        "hero.explore": "استكشف الفعاليات",
        "hero.join": "انضم الآن",

        "hiw.title": "ابدأ في 3 خطوات",
        "hiw.desc": "من التصفح إلى الحضور — الأمر بهذه السهولة",
        "hiw.step1.title": "اكتشف",
        "hiw.step1.desc": "تصفح مئات الفعاليات في أنحاء المملكة العربية السعودية — من القمم التقنية إلى المعارض الفنية وغيرها.",
        "hiw.step2.title": "سجّل",
        "hiw.step2.desc": "اختر فئة التذكرة المناسبة، احجز مقعدك، واحصل على تأكيد فوري يصل إلى بريدك الإلكتروني.",
        "hiw.step3.title": "احضر",
        "hiw.step3.desc": "احضر الفعالية، استمتع بالتجربة، تواصل مع أشخاص يشاركونك الاهتمامات، واصنع لحظات مميزة.",
        "hiw.cta.q": "هل أنت جاهز لاكتشاف فعاليتك القادمة؟",
        "hiw.cta.btn": "أنشئ حسابًا مجانيًا",
        "hiw.cta.haveAccount": "لديك حساب بالفعل؟",
        "hiw.cta.login": "سجّل الدخول",

        "cta.title": "جاهز لإنشاء فعاليتك الخاصة؟",
        "cta.desc": "انضم إلى مئات المنظمين الذين يثقون في Eventia لإدارة كل شيء من اللقاءات الصغيرة إلى المؤتمرات الكبيرة.",
        "cta.organizerBtn": "ابدأ التنظيم",
        "cta.vendorBtn": "سجّل كمزود خدمة",

    // ======================
    // Attendee Page
    // ======================
        "att.nav.browse": "استكشف",
        "att.tickets": "تذاكري",
        "att.nav.history": "السجل",
        "att.nav.profile": "الملف الشخصي",
        "att.nav.logout": "تسجيل الخروج",
        "att.nav.notifications": "الإشعارات",
        "att.menu.open": "فتح القائمة",
        "att.menu.close": "إغلاق القائمة",

        "att.hero.welcome": "مرحباً بعودتك",
        "att.hero.title": "أهلاً،",
        "att.hero.tagline": "اكتشف الفعاليات، احجز التذاكر، واستمتع بالتجربة",
        "att.hero.explore": "استكشف الفعاليات",
        "att.tickets.desc": "فعالياتك المسجلة وتذاكرك الرقمية",
        "att.ticketType": "نوع التذكرة",
        "att.registeredOn": "تاريخ التسجيل",
        "att.showBadge": "اعرض بطاقتي",
        "att.withdraw": "إلغاء التسجيل",
        "att.noTickets": "لا توجد تذاكر قادمة",
        "att.noTicketsDesc": "استعرض الفعاليات بالأعلى وسجّل للحصول على تذاكرك الرقمية.",
        "att.tbd": "يحدد لاحقاً",

        "att.notifications.title": "الإشعارات",
        "att.notifications.desc": "تحديثات ورسائل من منظمي الفعاليات",
        "att.notifications.markAll": "تحديد الكل كمقروء",

        "att.history.title": "سجل الفعاليات",
        "att.history.desc": "الفعاليات السابقة التي حضرتها مع تقييماتك وملاحظاتك",

        "att.profile.title": "ملفي الشخصي",
        "att.profile.desc": "إدارة معلوماتك الشخصية وتفضيلاتك",
        "att.profile.member": "عضو في Eventia",
        "att.profile.changePhoto": "اضغط لتغيير الصورة",

        "att.profile.firstName": "الاسم الأول",
        "att.profile.lastName": "اسم العائلة",
        "att.profile.email": "البريد الإلكتروني",
        "att.profile.phone": "رقم الهاتف",
        "att.profile.jobTitle": "المسمى الوظيفي",
        "att.profile.optional": "(اختياري)",
        "att.profile.jobPlaceholder": "مثال: مهندس برمجيات",

        "att.profile.password": "كلمة المرور",
        "att.profile.confirmPassword": "تأكيد كلمة المرور",

        "att.profile.save": "حفظ التغييرات",
        // ======================
        // Attendee Logic Page
        // ======================
            "att.event.default": "فعالية",
            "att.ticket.vip": "كبار الشخصيات",
            "att.ticket.standard": "عادي",
            "att.ticket.executive": "تنفيذي",
            "att.ticket.participant": "مشارك",

            "att.browse.noEvents": "لا توجد فعاليات",
            "att.browse.tryFilters": "حاول تعديل البحث أو الفلاتر",
            "att.browse.viewDetails": "عرض التفاصيل",
            "att.browse.registered": "مسجل",
            "att.browse.register": "تسجيل",

            "att.details.title": "تفاصيل الفعالية",
            "att.details.freeEvent": "فعالية مجانية",
            "att.details.alreadyRegistered": "تم التسجيل مسبقاً",
            "att.details.registerNow": "سجل الآن",
            "att.details.date": "التاريخ",
            "att.details.time": "الوقت",
            "att.details.location": "الموقع",
            "att.details.description": "الوصف",
            "att.details.noDescription": "لا يوجد وصف",
            "att.details.ticketsPricing": "التذاكر والأسعار",

            "event.details.aboutTitle": "عن هذه الفعالية",
            "event.details.readyAttend": "مستعد للحضور؟",
            "event.details.loginAsAttendee": "يرجى تسجيل الدخول كمشارك للتسجيل في الفعالية.",
            "event.details.switchAccount": "تسجيل الخروج وتبديل الحساب",
            "event.details.loginToRegister": "سجّل الدخول للتسجيل",
            "event.details.dateTimeRow": "التاريخ والوقت",
            "event.details.capacityStat": "السعة",
            "event.details.capacitySuffix": "حضور",
            "event.details.ticketStat": "التذكرة",
            "event.details.eventVendors": "مزودو خدمات الفعالية",
            "event.details.noVendorsYet": "لم يتم تأكيد مزودي خدمة لهذه الفعالية بعد.",
            "event.details.vendorCountZero": "مزودين خدمة 0",
            "event.details.vendorCountOne": "مزود خدمة 1",
            "event.details.vendorCountMany": "مزودين خدمة {{n}}",
            "event.details.organizedBy": "التنظيم",
            "event.details.verifiedOrganizer": "منظّم موثّق",
            "event.details.secureRegistration": "تسجيل آمن",
            "event.details.switchAccountShort": "تبديل الحساب",
            "event.details.freeSecureSignup": "التسجيل مجاني وآمن",
            "event.details.fullyBooked": "مكتمل العدد",
            "event.details.spotsRemainOne": "متبقٍ مكان واحد ({{pct}}% ممتلئ)",
            "event.details.spotsRemainMany": "متبقٍ {{n}} أماكن ({{pct}}% ممتلئ)",

            "att.common.cancel": "إلغاء",
            "att.common.continue": "متابعة",
            "att.common.done": "تم",
            "att.common.of": "من",

            "att.reg.alreadyRegisteredToast": "أنت مسجل بالفعل في هذه الفعالية",
            "att.reg.standard": "عادي",
            "att.reg.selectTicket": "اختر تذكرتك",
            "att.reg.selectTicketType": "اختر نوع التذكرة",
            "att.reg.ticketPrice": "سعر التذكرة",
            "att.reg.demoPayment": "دفع تجريبي — لن يتم خصم أي مبلغ فعلي",
            "att.reg.creditCard": "بطاقة ائتمانية",
            "att.reg.mada": "مدى",
            "att.reg.applePay": "آبل باي",
            "att.reg.cardholderName": "اسم حامل البطاقة",
            "att.reg.cardholderNamePlaceholder": "الاسم على البطاقة",
            "att.reg.cardNumber": "رقم البطاقة",
            "att.reg.expiryDate": "تاريخ الانتهاء",
            "att.reg.cvv": "رمز CVV",
            "att.reg.serviceFee": "رسوم الخدمة",
            "att.reg.total": "الإجمالي",
            "att.reg.ticket": "تذكرة",
            "att.reg.payConfirm": "ادفع وأكد",
            "att.reg.processing": "جاري معالجة الدفع...",
            "att.reg.processingDesc": "يرجى الانتظار أثناء تأكيد الحجز",
            "att.reg.success": "تم الدفع بنجاح!",
            "att.reg.successDesc": "تم تأكيد تذكرتك",
            "att.reg.paymentDetails": "تفاصيل الدفع",
            "att.reg.securing": "جاري تأمين الدفع...",
            "att.reg.bookingConfirmed": "تم تأكيد الحجز!",
            "att.reg.successToast": "تم التسجيل بنجاح! تذكرتك:",
            "att.reg.receipt.event": "الفعالية",
            "att.reg.receipt.ticketType": "نوع التذكرة",
            "att.reg.receipt.amountPaid": "المبلغ المدفوع",
            "att.reg.receipt.ticketCode": "رمز التذكرة",
            "att.reg.ticketReady": "تذكرتك جاهزة! انتقل إلى تبويب (تذاكري) لعرض التذكرة والبطاقة.",

            "att.badge.title": "بطاقة الفعالية",
            "att.badge.print": "طباعة",
            "att.badge.sendEmail": "إرسال إلى بريدي",
            "att.badge.emailSubject": "بطاقة فعاليتك -",
            "att.badge.addEmail": "أضف بريدك الإلكتروني في الملف الشخصي لاستخدام هذه الميزة",
            "att.badge.emailHello": "مرحباً",
            "att.badge.emailIntro": "تفاصيل بطاقة فعاليتك الخاصة بـ",

            "att.history.noPastEvents": "لا توجد فعاليات سابقة",
            "att.history.noPastEventsDesc": "ستظهر الفعاليات التي حضرتها هنا مع إمكانية إضافة تقييم",
            "att.history.yourFeedback": "تقييمك",
            "att.history.submitted": "تم الإرسال",
            "att.history.rateFeedback": "قيّم واترك ملاحظاتك",
            "att.history.attended": "تم الحضور",

            "att.feedback.title": "التقييم والمراجعة",
            "att.feedback.overallRating": "التقييم العام",
            "att.feedback.yourFeedback": "ملاحظاتك",
            "att.feedback.placeholder": "شارك تجربتك...",
            "att.feedback.submit": "إرسال",
            "att.feedback.selectRating": "يرجى اختيار تقييم",
            "att.feedback.writeFeedback": "يرجى كتابة ملاحظاتك",
            "att.feedback.thanks": "شكراً لملاحظاتك!",

            "att.withdraw.title": "إلغاء التسجيل",
            "att.withdraw.confirmText": "هل أنت متأكد أنك تريد إلغاء تسجيلك في هذه الفعالية؟ لا يمكن التراجع عن هذا الإجراء",
            "att.withdraw.confirmBtn": "تأكيد الإلغاء",
            "att.withdraw.success": "تم إلغاء تسجيلك بنجاح",
            "att.withdraw.flexibleDesc": "استرداد كامل متاح حتى يوم واحد قبل الفعالية.",
            "att.withdraw.moderateDesc": "استرداد كامل متاح حتى 7 أيام قبل الفعالية.",
            "att.withdraw.strictDesc": "استرداد كامل متاح حتى 30 يوماً قبل الفعالية.",
            "att.withdraw.nonRefundableDesc": "لا يُسمح بالاسترداد بعد شراء التذاكر.",
            "att.withdraw.refundPolicy": "سياسة الاسترداد",
            "att.withdraw.noPolicy": "لا توجد سياسة استرداد محددة لهذه الفعالية. يرجى التواصل مع المنظم.",

            "att.profile.fallbackName": "مشارك",
            "att.profile.updated": "تم تحديث الملف الشخصي بنجاح",

            "att.notifications.unread": "غير مقروء",
            "att.notifications.messages": "رسائل",
            "att.notifications.badgeNew": "جديد",
            "att.notifications.markRead": "تحديد كمقروء",
            "att.notifications.read": "مقروء",
            "att.notifications.emptyTitle": "لا توجد تحديثات",
            "att.notifications.emptyDesc": "ستظهر هنا إشعارات المنظمين عند توفرها",

        // ======================
        // Password Recovery
        // ======================
        "recovery.step1.title": "استعادة كلمة المرور",
        "recovery.step1.desc": "أدخل بريدك الإلكتروني أو اسم المستخدم لاستلام رمز الاستعادة.",
        "recovery.methodLabel": "البريد الإلكتروني أو اسم المستخدم",
        "recovery.method.placeholder": "مثال: user@eventia.com أو organizer123",
        "recovery.step1.button": "إرسال رمز الاستعادة",
        "recovery.rememberPassword": "تتذكر كلمة المرور؟",
        "recovery.loading.checking": "جارٍ التحقق...",
        "recovery.loading.verifying": "جارٍ التحقق من الرمز...",
        "recovery.loading.saving": "جارٍ الحفظ...",
        "recovery.error.passwordMismatch": "كلمتا المرور غير متطابقتين.",

        "recovery.step2.title": "التحقق من الرمز",
        "recovery.step2.desc": "أدخل الرمز المكوّن من 6 أرقام المرسل إلى بريدك الإلكتروني.",
        "recovery.codeLabel": "رمز التحقق",
        "recovery.code.placeholder": "••••••",
        "recovery.step2.button": "تحقق من الرمز",
        "recovery.back": "رجوع",

        "recovery.step3.title": "إعادة تعيين كلمة المرور",
        "recovery.step3.desc": "أنشئ كلمة مرور جديدة وآمنة.",
        "recovery.newPassword": "كلمة المرور الجديدة",
        "recovery.password.placeholder": "••••••••",
        "recovery.step3.button": "إعادة تعيين كلمة المرور",

        "recovery.step4.title": "تمت إعادة تعيين كلمة المرور!",
        "recovery.step4.desc": "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
        "recovery.step4.button": "الذهاب إلى تسجيل الدخول",

        // ======================
        // AI Assistant
        // ======================
        "ai.time.justNow": "الآن",
        "ai.time.minutesAgo": "قبل {m} دقيقة",
        "ai.time.hoursAgo": "قبل {h} ساعة",
        "ai.time.daysAgo": "قبل {d} يوم",
        "ai.time.yesterday": "أمس",
        "ai.newConversation": "محادثة جديدة",

        // Header / chrome
        "ai.assistant.title": "Eventia AI",
        "ai.assistant.badge": "تجريبي",
        "ai.assistant.status": "متصل",
        "ai.btn.close": "إغلاق",
        "ai.btn.reset": "محادثة جديدة",
        "ai.btn.history": "السجل",
        "ai.input.placeholder": "اسألني أي شيء عن الفعاليات…",
        "ai.input.send": "إرسال",
        "ai.footnote": "اقتراحات من الذكاء الاصطناعي، وليست حجوزات فعلية.",
        "ai.sparkle.tooltip": "اسأل Eventia AI",
        "ai.nudge.text": "جرّب البحث بالذكاء الاصطناعي!",
        "ai.nudge.close": "إغلاق",

        // Attendee search bar AI sparkle button + hint
        "att.ai.aria": "المساعد الذكي — اعثر على الفعالية المثالية لك",
        "att.ai.label": "المساعد الذكي",
        "att.ai.tooltip": "دع الذكاء الاصطناعي يجد فعاليتك",
        "att.ai.nudge": "لست متأكداً ممّا تحضر؟ دع الذكاء الاصطناعي يساعدك!",
        "att.ai.hint.before": "لا تجد ما تبحث عنه؟ جرّب ",
        "att.ai.hint.after": " — صف ما ترغب بحضوره ودعه يجد لك الفعالية المثالية.",

        // Attendee AI assistant panel
        "att.aiPanel.aria": "مساعد Eventia AI",
        "att.aiPanel.badge": "مساعد",
        "att.aiPanel.status": "دليلك لاكتشاف الفعاليات",
        "att.aiPanel.close": "إغلاق المساعد",
        "att.aiPanel.welcome": "مرحباً، أنا ",
        "att.aiPanel.welcomeAccent": "مساعد Eventia AI",
        "att.aiPanel.welcomeSubtitle": "أخبرني عن اهتماماتك وسأجد لك أفضل الفعاليات.",
        "att.aiPanel.inputPlaceholder": "أخبرني عمّا يثير اهتمامك...",
        "att.aiPanel.inputAria": "اسأل Eventia AI عن الفعاليات",
        "att.aiPanel.sendAria": "إرسال الرسالة",

        // Welcome / empty state
        "ai.welcome.title": "مرحبًا! أنا Eventia AI",
        "ai.welcome.subtitle": "أخبرني بما تشعر به وسأقترح عليك الفعاليات المثالية.",
        "ai.suggested.title": "جرّب أحد هذه الاقتراحات للبدء:",

        // History view
        "ai.history.title": "المحادثات السابقة",
        "ai.history.clearAll": "حذف الكل",
        "ai.history.empty.title": "لا توجد محادثات سابقة بعد",
        "ai.history.empty.desc": "بمجرد أن تبدأ بالدردشة، ستظهر محادثاتك هنا حتى تتمكن من متابعتها لاحقًا.",
        "ai.history.messageOne": "رسالة",
        "ai.history.messageMany": "رسائل",
        "ai.history.deleteLabel": "حذف المحادثة",
        "ai.history.confirmClear": "هل تريد حذف جميع المحادثات السابقة؟ لا يمكن التراجع عن هذا الإجراء.",
        "ai.history.defaultTitle": "محادثة",

        // Summary phrases
        "ai.summary.events": "فعاليات",
        "ai.summary.in": "في",
        "ai.summary.or": "أو",
        "ai.summary.today": "تحدث <strong>اليوم</strong>",
        "ai.summary.thisWeekend": "<strong>نهاية هذا الأسبوع</strong>",
        "ai.summary.thisWeek": "<strong>هذا الأسبوع</strong>",
        "ai.summary.nextWeek": "<strong>الأسبوع القادم</strong>",
        "ai.summary.free": "<strong>مجانية</strong>",
        "ai.summary.under": "بأقل من <strong>{price} ريال</strong>",
        "ai.summary.notFound": "لم أتمكن من إيجاد {bits} تطابق ذلك بعد.",
        "ai.summary.foundOne": "وجدت نتيجة <strong>واحدة</strong> &mdash; {bits}.",
        "ai.summary.foundMany": "وجدت <strong>{n}</strong> {bits}.",

        // Follow-up chips (label shown to user)
        "ai.followup.showMore": "عرض المزيد",
        "ai.followup.onlyFree": "المجانية فقط",
        "ai.followup.inRiyadh": "في الرياض فقط",
        "ai.followup.thisWeekend": "نهاية هذا الأسبوع",
        "ai.followup.surpriseMe": "فاجئني",

        // Follow-up prompts (sent to interpreter when chip is clicked)
        "ai.followup.prompt.showMore": "(عرض المزيد)",
        "ai.followup.prompt.free": "مجاني فقط",
        "ai.followup.prompt.riyadh": "في الرياض",
        "ai.followup.prompt.weekend": "نهاية الأسبوع",
        "ai.followup.prompt.surprise": "فاجئني بشيء ممتع",

        // Empty-state suggestions
        "ai.empty.removeCategory": "إزالة فلتر التصنيف",
        "ai.empty.tryDifferentCity": "تجربة مدينة مختلفة",
        "ai.empty.widenBudget": "توسيع الميزانية",
        "ai.empty.laterDate": "البحث في تاريخ لاحق",
        "ai.empty.tryDescribing": "حاول وصف ما تستمتع به &mdash; تصنيف، مزاج، أو مدينة.",
        "ai.empty.wantTry": "هل تريد {alternatives}؟",

        // Event cards
        "ai.event.free": "مجاني",
        "ai.event.view": "عرض",
        "ai.event.tbd": "يحدد لاحقاً",
        "ai.event.eventLabel": "فعالية",

        // Typing indicator
        "ai.typing.aria": "Eventia AI يكتب",

        // Error
        "ai.error.generic": "حدث خطأ من جانبي. هل يمكنك المحاولة مرة أخرى؟",
    },
};
window.I18N = I18N;

function translateText(lang) {
    const dict = I18N[lang] || I18N.en;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const val = dict[key];
        if (val != null) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
        const key = el.getAttribute("data-i18n-html");
        const val = dict[key];
        if (val != null) el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        const val = dict[key];
        if (val != null) el.setAttribute("placeholder", val);
    });

    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.dataset.i18nTitle;
        if (I18N[lang] && I18N[lang][key]) {
            el.title = I18N[lang][key];
        }
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(el => {
        const key = el.dataset.i18nAriaLabel;
        if (I18N[lang] && I18N[lang][key]) {
            el.setAttribute("aria-label", I18N[lang][key]);
        }
    });

    document.querySelectorAll("[data-i18n-label]").forEach((el) => {
        const key = el.getAttribute("data-i18n-label");
        const val = dict[key];
        if (val != null) el.setAttribute("label", val);
    });

    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
        const key = titleEl.getAttribute("data-i18n");
        const val = dict[key];
        if (val != null) titleEl.textContent = val;
    }
}

/** Map backend Event.category strings to i18n keys (same as attendee-logic attendeeCategoryLabel). */
const LANDING_EVENT_CATEGORY_KEYS = {
    Conference: "cat.conference",
    Technology: "cat.technology",
    Exhibition: "cat.exhibition",
    Entertainment: "cat.entertainment",
    Workshop: "cat.workshop",
    Sports: "cat.sports",
    Business: "cat.business",
    "Food & Culture": "cat.foodCulture",
    Education: "cat.education",
    Culture: "cat.culture",
    Family: "cat.family",
    Shopping: "cat.shopping",
    Gaming: "cat.gaming",
    Automotive: "cat.automotive",
    Other: "cat.other",
    General: "scega.common.general",
    Event: "att.event.default",
};

const LANDING_EVENT_CATEGORY_KEYS_LC = Object.create(null);
Object.keys(LANDING_EVENT_CATEGORY_KEYS).forEach((k) => {
    LANDING_EVENT_CATEGORY_KEYS_LC[k.toLowerCase()] = LANDING_EVENT_CATEGORY_KEYS[k];
});

function landingEventCategoryLabel(lang, categoryRaw) {
    const dict = I18N[lang] || I18N.en;
    const cat = (categoryRaw || "").trim();
    if (!cat) return dict["att.event.default"] != null ? dict["att.event.default"] : "Event";
    const key = LANDING_EVENT_CATEGORY_KEYS[cat] || LANDING_EVENT_CATEGORY_KEYS_LC[cat.toLowerCase()];
    if (key && dict[key]) return dict[key];
    return cat;
}

/** SCEGA dashboard: pending queue + history category pills. */
function localizeScegaEventCategories(lang) {
    document.querySelectorAll(".scega-event-category[data-event-category]").forEach((el) => {
        const raw = el.getAttribute("data-event-category") || "";
        el.textContent = landingEventCategoryLabel(lang, raw);
    });
}

/** SCEGA dashboard: pending queue date badges + history dates (Django HTML defaults to English). */
function localizeScegaEventDates(lang) {
    const locale = lang === "ar" ? "ar-SA-u-nu-latn" : "en-US";

    document.querySelectorAll(".scega-date-month[data-date]").forEach((el) => {
        const iso = el.getAttribute("data-date");
        if (!iso) return;
        const d = new Date(iso + "T12:00:00");
        if (Number.isNaN(d.getTime())) return;
        const month = d.toLocaleString(locale, { month: "short" });
        el.textContent = lang === "ar" ? month : month.toUpperCase();
    });

    document.querySelectorAll(".scega-date-day[data-date]").forEach((el) => {
        const iso = el.getAttribute("data-date");
        if (!iso) return;
        const d = new Date(iso + "T12:00:00");
        if (Number.isNaN(d.getTime())) return;
        el.textContent = String(d.getDate());
    });

    document.querySelectorAll(".scega-history-date[data-date]").forEach((el) => {
        const iso = el.getAttribute("data-date");
        if (!iso) return;
        const d = new Date(iso + "T12:00:00");
        if (Number.isNaN(d.getTime())) return;
        el.textContent = d.toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    });
}

/** Gregorian dates + categories on landing event cards (Django HTML defaults to English). */
function localizeLandingEventCards(lang) {
    document.querySelectorAll(".lp-card-badge[data-event-category]").forEach((el) => {
        const raw = el.getAttribute("data-event-category") || "";
        el.textContent = landingEventCategoryLabel(lang, raw);
    });

    document.querySelectorAll(".lp-card-date").forEach((el) => {
        const iso = el.getAttribute("data-date");
        if (!iso) return;
        const d = new Date(iso + "T12:00:00");
        if (Number.isNaN(d.getTime())) return;
        const locale = lang === "ar" ? "ar-SA-u-nu-latn" : "en-US";
        el.textContent = d.toLocaleDateString(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    });
}

function getLang() {
    return localStorage.getItem("eventia_lang") || "en";
}

function applyLang(lang) {
    localStorage.setItem("eventia_lang", lang);
    translateText(lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    localizeLandingEventCards(lang);
    localizeScegaEventCategories(lang);
    localizeScegaEventDates(lang);

    if (typeof window.refreshOrganizerEventDatePicker === "function") {
        window.refreshOrganizerEventDatePicker();
    }
    if (typeof window.refreshOrganizerEventTimePicker === "function") {
        window.refreshOrganizerEventTimePicker();
    }

    const langBtn = document.getElementById("lang-switch");
    if (langBtn) {
        const flagEl  = document.getElementById('lang-toggle-flag');
        const codeEl  = document.getElementById('lang-toggle-code');
        const labelEl = document.getElementById('lang-toggle-label');

        if (flagEl || codeEl || labelEl) {
            // Rich flag button (event_details page)
            const saFlag = langBtn.dataset.flagSa || '';
            const gbFlag = langBtn.dataset.flagGb || '';
            if (lang === 'ar') {
                if (flagEl)  { flagEl.src = gbFlag; flagEl.alt = 'GB'; }
                if (codeEl)  codeEl.textContent  = 'EN';
                if (labelEl) labelEl.textContent = 'English';
            } else {
                if (flagEl)  { flagEl.src = saFlag; flagEl.alt = 'SA'; }
                if (codeEl)  codeEl.textContent  = 'AR';
                if (labelEl) labelEl.textContent = 'العربية';
            }
        } else {
            // Simple text button fallback (index / landing page)
            langBtn.textContent = lang === "ar" ? "EN" : "AR";
        }
    }

    // Refresh dynamic signup fields (safe)
    const signupDynamicContainerEl = document.getElementById("signup-dynamic-fields");
    const signupFormEl = document.getElementById("signup-form");
    const activeTab = document.querySelector(".role-tab.active");
    const role = activeTab?.dataset.role || signupFormEl?.dataset.role || "attendee";

    // Only call updateSignupFields if it exists in this scope
    if (signupDynamicContainerEl && typeof updateSignupFields === "function") {
        updateSignupFields(role);
    }

    // Update business submit button role text
    document.querySelectorAll(".current-role-text").forEach((span) => {
        const container = span.closest('[id$="-form-container"]');
        const active = container?.querySelector(".role-tab.active");
        const r = active?.dataset.role;
        if (!r) return;

        const map = {
            organizer: lang === "ar" ? "منظم" : "Organizer",
            vendor: lang === "ar" ? "مزود خدمة" : "Vendor",
        };
        span.textContent = map[r] || span.textContent;
    });

    if (typeof renderAll === "function") {
        renderAll();
    }

    if (typeof window.localizeEventDetailsPage === "function") {
        window.localizeEventDetailsPage(lang);
    }

    // Re-localize the AI Assistant's live UI (chips, welcome, history view, typing indicator)
    // so a language toggle takes effect immediately even while the panel is open.
    if (window.AIAssistant && typeof window.AIAssistant.relocalize === "function") {
        window.AIAssistant.relocalize();
    }
}

window.getLang = getLang;
window.applyLang = applyLang;
window.landingEventCategoryLabel = landingEventCategoryLabel;

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & View Management ---
    const isScegaDashboard = document.querySelector('.sidebar-brand') && document.querySelector('.sidebar-brand').textContent.includes('SCEGA');
    const isOrganiserDashboard = document.querySelector('.sidebar-brand') && document.querySelector('.sidebar-brand').textContent.includes('EVENTIA');

    const heroBrowseBtn = document.getElementById('hero-browse-btn');

    if (heroBrowseBtn) {
        heroBrowseBtn.addEventListener('click', () => {
            const grid = document.querySelector('.events-container');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Role Management (Login & Signup) ---
    // FIXED: Added name="..." attributes to all inputs so Django can read the data!
    // --- Role Management (Login & Signup) ---
    const roleFields = {
        organizer: `
            <input type="hidden" name="role" value="ORGANIZER">
            <div class="input-group">
                <label data-i18n="signup.form.username">Username</label>
                <input type="text" name="username" dir="ltr" placeholder="organizer123" required>
            </div>
            <div class="input-group">
                <label data-i18n="org.profile.organizationName">Organization Name</label>
                <input type="text" name="organization_name" placeholder="" required>
            </div>
            <div class="input-group">
                <label data-i18n="common.phoneNumber">Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label data-i18n="common.emailAddress">Email Address</label>
                <input type="email" name="email" class="signup-email" dir="ltr" placeholder="name@company.org" required>
                <div class="error-message email-error" data-i18n="signup.validation.invalidEmail">Please enter a valid email address</div>
            </div>
            <div class="input-group">
                <label data-i18n="common.password">Password</label>
                <input type="password" name="password" class="signup-password" data-i18n-placeholder="signup.placeholder.strongPassword" placeholder="Create a strong password" required>
                <div class="password-policy-text" data-i18n="signup.validation.passwordPolicy">
                    Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.
                </div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label data-i18n="common.confirmPassword">Confirm Password</label>
                <input type="password" name="confirm_password" class="signup-confirm-password" data-i18n-placeholder="signup.placeholder.reenterPassword" placeholder="Re-enter password" required>
                <div class="error-message password-match-error" data-i18n="signup.validation.passwordsNoMatch">Passwords do not match</div>
            </div>
        `,
        vendor: `
            <input type="hidden" name="role" value="VENDOR">
            <div class="input-group">
                <label data-i18n="signup.form.username">Username</label>
                <input type="text" name="username" dir="ltr" placeholder="vendor123" required>
            </div>
            <div class="input-group">
                <label data-i18n="signup.form.vendorName">Vendor Name</label>
                <input type="text" name="organization_name" dir="ltr" placeholder="Event Services Ltd." required>
            </div>
            <div class="input-group">
                <label data-i18n="common.phoneNumber">Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label data-i18n="signup.form.serviceType">Service Type</label>
                <select name="service_type" required>
                    <option value="" disabled selected data-i18n="signup.form.selectServiceType">Select Service Type</option>
                    <optgroup data-i18n-label="signup.vendor.ogFood" label="Food & Beverages">
                        <option value="Catering" data-i18n="common.catering">Catering</option>
                        <option value="Bakery & Desserts" data-i18n="common.bakeryDesserts">Bakery & Desserts</option>
                        <option value="Beverages" data-i18n="common.beverages">Beverages</option>
                        <option value="Food Trucks" data-i18n="common.foodTrucks">Food Trucks</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogVenues" label="Venues">
                        <option value="Venue" data-i18n="signup.service.venueHall">Venue / Hall</option>
                        <option value="Conference Hall" data-i18n="common.conferenceHall">Conference Hall</option>
                        <option value="Outdoor Venue" data-i18n="common.outdoorVenue">Outdoor Venue</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogAv" label="AV & Technology">
                        <option value="AV Equipment" data-i18n="common.avEquipment">AV Equipment</option>
                        <option value="LED Screens" data-i18n="common.ledScreens">LED Screens</option>
                        <option value="Stage & Rigging" data-i18n="common.stageRigging">Stage & Rigging</option>
                        <option value="Live Streaming" data-i18n="common.liveStreaming">Live Streaming</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogDecor" label="Decoration & Design">
                        <option value="Decoration" data-i18n="common.decoration">Decoration</option>
                        <option value="Floral Design" data-i18n="common.floralDesign">Floral Design</option>
                        <option value="Balloon Decor" data-i18n="common.balloonDecor">Balloon Decor</option>
                        <option value="Event Lighting" data-i18n="common.eventLighting">Event Lighting</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogPhoto" label="Photography & Media">
                        <option value="Photography" data-i18n="common.photography">Photography</option>
                        <option value="Aerial Photography" data-i18n="common.aerialPhotography">Aerial Photography</option>
                        <option value="Photo Booth" data-i18n="common.photoBooth">Photo Booth</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogEnt" label="Entertainment">
                        <option value="DJ Services" data-i18n="common.dj">DJ Services</option>
                        <option value="Live Entertainment" data-i18n="common.liveEntertainment">Live Entertainment</option>
                        <option value="Kids Entertainment" data-i18n="common.kidsEntertainment">Kids Entertainment</option>
                        <option value="Traditional Music" data-i18n="common.traditionalMusic">Traditional Music</option>
                        <option value="Fireworks & Pyro" data-i18n="common.fireworks">Fireworks & Pyro</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogTransport" label="Transportation">
                        <option value="Transportation" data-i18n="common.transportation">Transportation</option>
                        <option value="Shuttle Services" data-i18n="common.shuttle">Shuttle Services</option>
                        <option value="Valet Parking" data-i18n="common.valet">Valet Parking</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogSecurity" label="Security & Safety">
                        <option value="Security" data-i18n="common.security">Security</option>
                        <option value="VIP Security" data-i18n="common.vipSecurity">VIP Security</option>
                        <option value="Medical Services" data-i18n="common.medical">Medical Services</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogStaff" label="Staffing & Services">
                        <option value="Event Staff" data-i18n="common.eventStaff">Event Staff</option>
                        <option value="Translation" data-i18n="common.translation">Translation</option>
                        <option value="MC & Hosting" data-i18n="common.mcHosting">MC & Hosting</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogRentals" label="Rentals & Equipment">
                        <option value="Tent Rentals" data-i18n="common.tents">Tent Rentals</option>
                        <option value="Furniture Rentals" data-i18n="common.furniture">Furniture Rentals</option>
                        <option value="Table/Chair Rentals" data-i18n="common.tableChair">Table/Chair Rentals</option>
                        <option value="Power Supply" data-i18n="common.power">Power Supply</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogMarketing" label="Marketing & Promotion">
                        <option value="Printing" data-i18n="common.printing">Printing</option>
                        <option value="Book Sales" data-i18n="common.bookSales">Book Sales</option>
                        <option value="Social Media Marketing" data-i18n="common.socialMedia">Social Media Marketing</option>
                        <option value="Influencer Marketing" data-i18n="common.influencer">Influencer Marketing</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogGov" label="Government & Permits">
                        <option value="Government Permits" data-i18n="common.governmentPermits">Government Permits</option>
                        <option value="Safety Permits" data-i18n="common.safetyPermits">Safety Permits</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogSponsors" label="Sponsors & Partners">
                        <option value="Sponsors" data-i18n="common.sponsors">Sponsors</option>
                        <option value="Brand Partners" data-i18n="common.brandPartners">Brand Partners</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogSaudi" label="Saudi Cultural">
                        <option value="Henna Artists" data-i18n="common.henna">Henna Artists</option>
                        <option value="Falconry Shows" data-i18n="common.falconry">Falconry Shows</option>
                        <option value="Horse Shows" data-i18n="common.horseShows">Horse Shows</option>
                        <option value="Arabian Perfumes" data-i18n="common.perfumes">Arabian Perfumes</option>
                        <option value="Arabic Calligraphy" data-i18n="common.calligraphy">Arabic Calligraphy</option>
                    </optgroup>
                    <optgroup data-i18n-label="signup.vendor.ogSpecial" label="Specialized Services">
                        <option value="VR/AR Experiences" data-i18n="common.vrAr">VR/AR Experiences</option>
                        <option value="Eco-Friendly Services" data-i18n="common.eco">Eco-Friendly Services</option>
                        <option value="Gifts & Giveaways" data-i18n="common.gifts">Gifts & Giveaways</option>
                    </optgroup>
                </select>
            </div>
            <div class="input-group">
                <label data-i18n="common.emailAddress">Email Address</label>
                <input type="email" name="email" class="signup-email" dir="ltr" placeholder="contact@vendor.com" required>
                <div class="error-message email-error" data-i18n="signup.validation.invalidEmail">Please enter a valid email address</div>
            </div>
            <div class="input-group">
                <label data-i18n="common.password">Password</label>
                <input type="password" name="password" class="signup-password" data-i18n-placeholder="signup.placeholder.strongPassword" placeholder="Create a strong password" required>
                <div class="password-policy-text" data-i18n="signup.validation.passwordPolicy">
                    Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.
                </div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label data-i18n="common.confirmPassword">Confirm Password</label>
                <input type="password" name="confirm_password" class="signup-confirm-password" data-i18n-placeholder="signup.placeholder.reenterPassword" placeholder="Re-enter password" required>
                <div class="error-message password-match-error" data-i18n="signup.validation.passwordsNoMatch">Passwords do not match</div>
            </div>
        `,
        attendee: `
            <input type="hidden" name="role" value="ATTENDEE">
            <div class="form-row">
                <div class="input-group">
                    <label data-i18n="common.firstName">First Name</label>
                    <input type="text" name="first_name" placeholder="" required>
                </div>
                <div class="input-group">
                    <label data-i18n="common.lastName">Last Name</label>
                    <input type="text" name="last_name" placeholder="" required>
                </div>
            </div>
            <div class="input-group">
                <label data-i18n="signup.form.username">Username</label>
                <input type="text" name="username" dir="ltr" placeholder="abdulrahman123" required>
            </div>
            <div class="input-group">
                <label data-i18n="common.emailAddress">Email Address</label>
                <input type="email" name="email" class="signup-email" dir="ltr" placeholder="name@example.com" required>
                <div class="error-message email-error" data-i18n="signup.validation.invalidEmail">Please enter a valid email address</div>
            </div>
            <div class="input-group">
                <label data-i18n="common.phoneNumber">Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label data-i18n="signup.form.gender">Gender</label>
                <select name="gender" required>
                    <option value="" disabled selected data-i18n="signup.form.selectGender">Select Gender</option>
                    <option value="M" data-i18n="signup.gender.male">Male</option>
                    <option value="F" data-i18n="signup.gender.female">Female</option>
                </select>
            </div>
            <div class="input-group">
                <label data-i18n="signup.form.birthday">Birthday</label>
                <div class="date-inputs-wrapper">
                    <select name="month" class="date-select month-select" required>
                        <option value="" disabled selected data-i18n="signup.form.month">Month</option>
                        <option value="1" data-i18n="signup.month.1">January</option>
                        <option value="2" data-i18n="signup.month.2">February</option>
                        <option value="3" data-i18n="signup.month.3">March</option>
                        <option value="4" data-i18n="signup.month.4">April</option>
                        <option value="5" data-i18n="signup.month.5">May</option>
                        <option value="6" data-i18n="signup.month.6">June</option>
                        <option value="7" data-i18n="signup.month.7">July</option>
                        <option value="8" data-i18n="signup.month.8">August</option>
                        <option value="9" data-i18n="signup.month.9">September</option>
                        <option value="10" data-i18n="signup.month.10">October</option>
                        <option value="11" data-i18n="signup.month.11">November</option>
                        <option value="12" data-i18n="signup.month.12">December</option>
                    </select>
                    <select name="day" class="date-select day-select" required>
                        <option value="" disabled selected data-i18n="signup.form.day">Day</option>
                        <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                        <option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>
                        <option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option>
                        <option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option>
                        <option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option>
                        <option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option>
                        <option value="31">31</option>
                    </select>
                    <select name="year" class="date-select year-select" required>
                        <option value="" disabled selected data-i18n="signup.form.year">Year</option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label data-i18n="common.password">Password</label>
                <input type="password" name="password" class="signup-password" data-i18n-placeholder="signup.placeholder.strongPassword" placeholder="Create a strong password" required>
                <div class="password-policy-text" data-i18n="signup.validation.passwordPolicy">
                    Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.
                </div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label data-i18n="common.confirmPassword">Confirm Password</label>
                <input type="password" name="confirm_password" class="signup-confirm-password" data-i18n-placeholder="signup.placeholder.reenterPassword" placeholder="Re-enter password" required>
                <div class="error-message password-match-error" data-i18n="signup.validation.passwordsNoMatch">Passwords do not match</div>
            </div>
        `
    };
    const roleTabs = document.querySelectorAll('.role-tab');
    const signupDynamicContainer = document.getElementById('signup-dynamic-fields');
    const signupForm = document.getElementById('signup-form');

    if (signupDynamicContainer) {
        const activeTab = document.querySelector('.role-tab.active');
        const initialRole = activeTab?.dataset.role || signupForm?.dataset.role || 'attendee';
        updateSignupFields(initialRole);
    }

    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.dataset.target;
            const role = tab.dataset.role;

            const parent = tab.parentElement;
            if (parent) {
                parent.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
            }
            tab.classList.add('active');

            const formContainer = document.getElementById(`${targetForm}-form-container`);
            if (formContainer) {
                const btnSpan = formContainer.querySelector('.current-role-text');
                if (btnSpan) {
                    const lang = getLang();
                    const roleLabels = {
                        organizer: lang === "ar" ? "منظم" : "Organizer",
                        vendor: lang === "ar" ? "مزود خدمة" : "Vendor",
                    };
                    btnSpan.textContent = roleLabels[role] ?? role.charAt(0).toUpperCase() + role.slice(1);
                }
            }

            if (targetForm === 'signup' && signupDynamicContainer) {
                updateSignupFields(role);
            }

            if (targetForm === 'login') {
                const loginRoleInput = document.getElementById('login-role-input');
                if (loginRoleInput) loginRoleInput.value = role;
            }
        });
    });

    function updateSignupFields(role) {
        if (!signupDynamicContainer) return;
        signupDynamicContainer.style.opacity = '0';
        setTimeout(() => {
            signupDynamicContainer.innerHTML = roleFields[role] || '';
            signupDynamicContainer.style.opacity = '1';

            translateText(getLang());

            if (role === 'attendee') {
                const yearSelect = signupDynamicContainer.querySelector('.year-select');
                if (yearSelect) {
                    const currentYear = new Date().getFullYear();
                    const startYear = 1900;
                    for (let i = currentYear; i >= startYear; i--) {
                        const option = document.createElement('option');
                        option.value = i;
                        option.textContent = i;
                        yearSelect.appendChild(option);
                    }
                }
            }

            attachPasswordValidators();
            attachEmailCleaners();

        }, 200);
    }

    function attachEmailCleaners() {
        const emailInput = signupDynamicContainer.querySelector('.signup-email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                if (emailInput.classList.contains('input-error')) {
                    const emailError = signupDynamicContainer.querySelector('.email-error');
                    if (emailError) emailError.classList.remove('visible');
                    emailInput.classList.remove('input-error');
                }
            });
        }
    }

    function attachPasswordValidators() {
        const passwordInput = signupDynamicContainer.querySelector('.signup-password');
        const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');
        const form = document.getElementById('signup-form');

        if (!passwordInput || !confirmInput) return;

        passwordInput.addEventListener('input', () => {
            if (passwordInput.classList.contains('input-error')) {
                const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
                strengthError.classList.remove('visible');
                passwordInput.classList.remove('input-error');
            }
        });

        confirmInput.addEventListener('input', () => {
            if (confirmInput.classList.contains('input-error')) {
                const matchError = signupDynamicContainer.querySelector('.password-match-error');
                matchError.classList.remove('visible');
                confirmInput.classList.remove('input-error');
            }
        });

        if (form) {
            form.setAttribute('novalidate', true);
        }
    }


    // --- Login Form Client-Side Validation ---
    // Handles all 5 cases before POSTing to Django:
    //   1. Both fields empty
    //   2. Only username filled (password missing)
    //   3. Only password filled (username missing)
    //   4. Username looks invalid (not an email or phone-like string)
    //   5. Both filled → submit; server handles wrong-password and returns messages
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        const usernameInput = loginForm.querySelector('#login-email');
        const passwordInput = loginForm.querySelector('#login-password');
        const usernameError = loginForm.querySelector('#login-username-error');
        const passwordError = loginForm.querySelector('#login-password-error');

        function clearLoginError(input, errorEl) {
            if (!input || !errorEl) return;
            input.classList.remove('input-error');
            errorEl.classList.remove('visible');
        }

        function showLoginError(input, errorEl, msg) {
            if (!input || !errorEl) return;
            errorEl.textContent = msg;
            errorEl.classList.add('visible');
            input.classList.add('input-error');
        }

        // Clear errors on user input
        if (usernameInput) {
            usernameInput.addEventListener('input', () => clearLoginError(usernameInput, usernameError));
        }
        if (passwordInput) {
            passwordInput.addEventListener('input', () => clearLoginError(passwordInput, passwordError));
        }

        loginForm.addEventListener('submit', (e) => {
            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';
            let isValid = true;

            // Reset errors first
            clearLoginError(usernameInput, usernameError);
            clearLoginError(passwordInput, passwordError);

            // Case 1 & 3: username empty
            if (!username) {
                const _d = (window.I18N || {})[getLang()] || (window.I18N || {}).en || {};
                showLoginError(usernameInput, usernameError, _d['login.error.emptyUsername'] || 'Please enter your username.');
                isValid = false;
            }

            // Case 1 & 2: password empty
            if (!password) {
                const _d = (window.I18N || {})[getLang()] || (window.I18N || {}).en || {};
                showLoginError(passwordInput, passwordError, _d['login.error.emptyPassword'] || 'Please enter your password.');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
                // Scroll to first visible error
                const firstError = loginForm.querySelector('.input-error');
                if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            // Case 5: valid format + wrong password → Django handles it and returns messages
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {

            const passwordInput = signupDynamicContainer.querySelector('.signup-password');
            const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');
            const emailInput = signupDynamicContainer.querySelector('.signup-email');

            let isValid = true;

            // Email Validation
            if (emailInput) {
                const email = emailInput.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const emailError = signupDynamicContainer.querySelector('.email-error');

                if (!emailRegex.test(email)) {
                    if (emailError) emailError.classList.add('visible');
                    emailInput.classList.add('input-error');
                    isValid = false;
                }
            }

            // Password Validation
            if (passwordInput && confirmInput) {
                function checkStrength(password) {
                    const _lang = getLang();
                    const _d = (window.I18N || {})[_lang] || (window.I18N || {}).en || {};
                    let errors = [];
                    if (password.length < 8) errors.push(_d['signup.error.atLeast8'] || "at least 8 characters");
                    if (!/[A-Z]/.test(password)) errors.push(_d['signup.error.uppercase'] || "1 uppercase letter");
                    if (!/[a-z]/.test(password)) errors.push(_d['signup.error.lowercase'] || "1 lowercase letter");
                    if (!/[0-9]/.test(password)) errors.push(_d['signup.error.number'] || "1 number");
                    if (!/[^A-Za-z0-9]/.test(password)) errors.push(_d['signup.error.special'] || "1 special character");
                    return errors;
                }

                const pwd = passwordInput.value;
                const confirm = confirmInput.value;
                const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
                const matchError = signupDynamicContainer.querySelector('.password-match-error');

                const strengthErrors = checkStrength(pwd);
                if (strengthErrors.length > 0) {
                    const _lang = getLang();
                    const _d = (window.I18N || {})[_lang] || (window.I18N || {}).en || {};
                    const _prefix = _d['signup.error.strength.prefix'] || "Password must include: ";
                    const _sep = _lang === 'ar' ? '، ' : ', ';
                    strengthError.textContent = _prefix + strengthErrors.join(_sep);
                    strengthError.classList.add('visible');
                    passwordInput.classList.add('input-error');
                    isValid = false;
                }

                if (pwd !== confirm) {
                    matchError.classList.add('visible');
                    confirmInput.classList.add('input-error');
                    isValid = false;
                }
            }

            // ONLY prevent submission if there are validation errors!
            if (!isValid) {
                e.preventDefault();
            }
            // If isValid is true, we do nothing and let the browser POST data to Django naturally!
        });
    }

    const langBtn = document.getElementById("lang-switch");

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            const current = getLang();
            const newLang = current === "en" ? "ar" : "en";
            applyLang(newLang);

            const noMsg = document.querySelector(".no-events-state p");
            if (noMsg && window.I18N && !noMsg.hasAttribute("data-i18n")) {
                const dict = window.I18N[getLang()] || {};
                const v = dict["landing.noSearchResults"];
                if (v != null && v !== "") noMsg.textContent = v;
            }

            // 🔥 IMPORTANT: re-render attendee UI
            if (window.renderBrowseEvents) window.renderBrowseEvents();
            if (window.renderMyTickets) window.renderMyTickets();
            if (window.renderHistory) window.renderHistory();
            if (window.renderNotifList) window.renderNotifList();

            // Vendor dashboard: JS-built HTML uses t(); re-run active view after lang change
            if (typeof window.switchView === 'function') {
                const activeSection = document.querySelector('.content-section.active');
                if (activeSection && activeSection.id && activeSection.id.startsWith('view-')) {
                    window.switchView(activeSection.id.slice(5));
                }
            }
            if (typeof window.refreshVendorEventManageIfOpen === 'function') {
                window.refreshVendorEventManageIfOpen();
            }
        });
    }

    // --- RENDER ALL (Signup pages only) ---
    function renderAll() {
        const signupDynamicContainerEl = document.getElementById("signup-dynamic-fields");
        const signupFormEl = document.getElementById("signup-form");
        const activeTab = document.querySelector(".role-tab.active");
        const role = activeTab?.dataset.role || signupFormEl?.dataset.role || "attendee";

        if (signupDynamicContainerEl && typeof updateSignupFields === "function") {
            updateSignupFields(role);
        }

        const lang = localStorage.getItem("eventia_lang") || "en";

        document.querySelectorAll(".current-role-text").forEach((span) => {
            const container = span.closest('[id$="-form-container"]');
            const active = container?.querySelector(".role-tab.active");
            const r = active?.dataset.role;
            if (!r) return;

            const map = {
                organizer: lang === "ar" ? "منظم" : "Organizer",
                vendor: lang === "ar" ? "مزود خدمة" : "Vendor",
                attendee: lang === "ar" ? "مشارك" : "Attendee",
            };

            span.textContent = map[r] || span.textContent;
        });
    }
    window.renderAll = renderAll;

    // set initial language on load
    applyLang(getLang());


});

// --- SCEGA DASHBOARD LOGIC ---
// REMOVED: initScegaDashboard is now in scega-logic.js
// This comment prevents app.js from overwriting the updated function
