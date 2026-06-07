// ============================================================
// ORGANIZER DASHBOARD LOGIC
// All organizer-specific logic extracted from app.js
// for better file organisation.
// Loaded by organizer-dashboard.html only.
// ============================================================

const SAR_ICON = '<img src="' + (window.STATIC_URL || '/static/') + 'assets/sar_symbol.svg" class="sar-icon" alt="SAR">';

document.addEventListener('DOMContentLoaded', () => {

    function t(key) {
        const lang = localStorage.getItem('eventia_lang') || 'en';
        if (window.I18N && window.I18N[lang] && window.I18N[lang][key]) {
            return window.I18N[lang][key];
        }
        if (window.I18N && window.I18N.en && window.I18N.en[key]) {
            return window.I18N.en[key];
        }
        return key;
    }

    function translateFlashMessage(tags, text) {
        const match = String(tags || '').match(/i18n:([\w.]+)/);
        if (!match) {
            return text || '';
        }
        let msg = t(match[1]);
        if (text) {
            msg = msg.replace('{vendor}', text).replace('{detail}', text);
        }
        return msg;
    }

    function formatOrganizerRequestCount(n) {
        const lang = typeof window.getLang === 'function' ? window.getLang() : (localStorage.getItem('eventia_lang') || 'en');
        const word = t(n > 1 ? 'org.requests.requestsPlural' : 'org.requests.requestSingular');
        return lang === 'ar' ? `${word} ${n}` : `${n} ${word}`;
    }

    function statusKey(status) {
        const map = {
            Pending: 'vendor.prep.pending',
            Approved: 'status.approved',
            Confirmed: 'vendor.status.confirmed',
            Rejected: 'status.rejected',
            Upcoming: 'status.upcoming',
            Ongoing: 'status.ongoing',
            Past: 'status.past'
        };
        return t(map[status] || status);
    }

    const prepKeyMap = {
        'Pending': 'vendor.prep.pending',
        'Preparing': 'vendor.prep.preparing',
        'In Transit': 'vendor.prep.inTransit',
        'Setting Up': 'vendor.prep.settingUp',
        'Ready': 'vendor.prep.ready'
    };

    const statusKeyMap = {
        'Pending': 'vendor.prep.pending',
        'Confirmed': 'vendor.status.confirmed',
        'Rejected': 'status.rejected'
    };

    const categoryMap = {
        "Catering": "common.catering",
        "Bakery & Desserts": "common.bakeryDesserts",
        "Beverages": "common.beverages",
        "Food Trucks": "common.foodTrucks",
        "Venue": "common.venue",
        "Conference Hall": "common.conferenceHall",
        "Outdoor Venue": "common.outdoorVenue",
        "AV Equipment": "common.avEquipment",
        "Audio & Lighting": "common.audioLighting",
        "LED Screens": "common.ledScreens",
        "Stage & Rigging": "common.stageRigging",
        "Live Streaming": "common.liveStreaming",
        "Decoration": "common.decoration",
        "Event Decoration": "common.eventDecoration",
        "Floral Design": "common.floralDesign",
        "Balloon Decor": "common.balloonDecor",
        "Event Lighting": "common.eventLighting",
        "Photography": "common.photography",
        "Photography & Video": "common.photographyVideo",
        "Aerial Photography": "common.aerialPhotography",
        "Photo Booth": "common.photoBooth",
        "DJ Services": "common.dj",
        "Live Entertainment": "common.liveEntertainment",
        "Kids Entertainment": "common.kidsEntertainment",
        "Traditional Music": "common.traditionalMusic",
        "Fireworks & Pyro": "common.fireworks",
        "Transportation": "common.transportation",
        "Shuttle Services": "common.shuttle",
        "Valet Parking": "common.valet",
        "Security": "common.security",
        "Security Services": "common.securityServices",
        "VIP Security": "common.vipSecurity",
        "Medical Services": "common.medical",
        "Event Staff": "common.eventStaff",
        "Translation": "common.translation",
        "MC & Hosting": "common.mcHosting",
        "Tent Rentals": "common.tents",
        "Furniture Rentals": "common.furniture",
        "Table/Chair Rentals": "common.tableChair",
        "Power Supply": "common.power",
        "Printing": "common.printing",
        "Printing & Signage": "common.printingSignage",
        "Book Sales": "common.bookSales",
        "Connectivity Services": "common.connectivityServices",
        "Food & Beverages": "common.foodBeverages",
        "Entertainment": "common.entertainment",
        "Audio Visual": "common.audioVisual",
        "Florists": "common.florists",
        "Cleaning": "common.cleaning",
        "Professional Services": "common.professionalServices",
        "Furniture Rental": "common.furniture",
        "Permits & Licensing": "common.permitsLicensing",
        "Facilities": "common.facilities",
        "Special Effects": "common.specialEffects",
        "Children Services": "common.childrenServices",
        "Technology": "common.technology",
        "Other": "cat.other",
        "Social Media Marketing": "common.socialMedia",
        "Influencer Marketing": "common.influencer",
        "Government Permits": "common.governmentPermits",
        "Safety Permits": "common.safetyPermits",
        "Sponsors": "common.sponsors",
        "Brand Partners": "common.brandPartners",
        "Henna Artists": "common.henna",
        "Falconry Shows": "common.falconry",
        "Horse Shows": "common.horseShows",
        "Arabian Perfumes": "common.perfumes",
        "Arabic Calligraphy": "common.calligraphy",
        "VR/AR Experiences": "common.vrAr",
        "Eco-Friendly Services": "common.eco",
        "Gifts & Giveaways": "common.gifts"
    };

    const categoryMapInsensitive = Object.create(null);
    Object.keys(categoryMap).forEach((k) => {
        categoryMapInsensitive[k.toLowerCase()] = categoryMap[k];
    });

    function translateServiceTypeLabel(raw) {
        if (raw == null || raw === '') return '';
        const trimmed = String(raw).trim();
        let key = categoryMap[trimmed];
        if (!key) key = categoryMapInsensitive[trimmed.toLowerCase()];
        return key ? t(key) : trimmed;
    }

    /** Event catalogue labels (organizer events) → i18n keys — distinct from vendor service-type categoryMap above. */
    const eventCategoryMap = {
        'Conference': 'cat.conference',
        'Entertainment': 'cat.entertainment',
        'Exhibition': 'cat.exhibition',
        'Technology': 'cat.technology',
        'Tech': 'cat.tech',
        'Art': 'cat.art',
        'Business': 'cat.business',
        'Music': 'cat.music',
        'Education': 'cat.education',
        'Sports': 'cat.sports',
        'Workshop': 'cat.workshop',
        'Food & Culture': 'cat.foodCulture',
        'Culture': 'cat.culture',
        'Family': 'cat.family',
        'Shopping': 'cat.shopping',
        'Gaming': 'cat.gaming',
        'Automotive': 'cat.automotive',
        'Other': 'cat.other',
        'Innovation': 'vendor.cat.innovation',
        'Startup': 'vendor.cat.startup',
        'Fashion': 'vendor.cat.fashion',
        'Design': 'vendor.cat.design',
        'Networking': 'vendor.cat.networking',
        'Trade Show': 'vendor.cat.tradeShow',
        'Concert': 'vendor.cat.concert',
        'Festival': 'vendor.cat.festival',
        'Theater': 'vendor.cat.theater',
        'Training': 'vendor.cat.training',
        'Seminar': 'vendor.cat.seminar',
        'Marathon': 'vendor.cat.marathon',
        'Tournament': 'vendor.cat.tournament',
        'Fitness': 'vendor.cat.fitness',
        'Food': 'vendor.cat.foodBeverage',
        'Culinary': 'vendor.cat.culinary',
        'Wine Tasting': 'vendor.cat.wineTasting',
        'Food Festival': 'vendor.cat.foodFestival',
        'Health': 'vendor.cat.health',
        'Wellness': 'vendor.cat.wellness',
        'Yoga': 'vendor.cat.yoga',
        'Meditation': 'vendor.cat.meditation',
        'Charity': 'vendor.cat.charity',
        'Fundraising': 'vendor.cat.fundraising',
        'Community': 'vendor.cat.community',
        'Social': 'vendor.cat.social',
        'Expo': 'vendor.cat.expo',
        'Fair': 'vendor.cat.fair',
        'Celebration': 'vendor.cat.celebration'
    };

    const eventCategoryMapInsensitive = Object.create(null);
    Object.keys(eventCategoryMap).forEach((k) => {
        eventCategoryMapInsensitive[k.toLowerCase()] = eventCategoryMap[k];
    });

    function translateEventCategory(raw) {
        if (raw == null || raw === '') return '';
        const trimmed = String(raw).trim();
        let i18nKey = eventCategoryMap[trimmed] || eventCategoryMapInsensitive[trimmed.toLowerCase()];
        if (i18nKey) return t(i18nKey);
        const slugKey = `cat.${trimmed.toLowerCase()}`;
        const viaSlug = t(slugKey);
        if (viaSlug !== slugKey) return viaSlug;
        return trimmed;
    }

    // --- DASHBOARD LOGIC ---
    if (document.body.classList.contains('dashboard-body')) {
        initDashboard();
    }

    function initDashboard() {
        // Elements
        const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
        const sections = document.querySelectorAll('.content-section');
        const pageTitle = document.getElementById('page-title');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');

        function applyOrganizerPageTitle(viewId) {
            if (!pageTitle) return;
            const titleKeys = {
                overview: 'org.page.overviewTitle',
                'create-event': 'org.page.createEventTitle',
                'events-list': 'org.page.eventsListTitle',
                'event-manage': 'org.page.eventManageTitle',
                vendors: 'org.page.vendorsTitle',
                requests: 'org.page.requestsTitle',
                analytics: 'org.page.analyticsTitle',
                profile: 'org.page.profileTitle',
            };
            const fallbackEn = {
                overview: 'Dashboard Overview',
                'create-event': 'Create New Event',
                'events-list': 'My Events',
                'event-manage': 'Event Management',
                vendors: 'Vendor Marketplace',
                requests: 'Manage Requests',
                analytics: 'Event Analytics',
                profile: 'My Profile',
            };
            const key = titleKeys[viewId];
            const lang = typeof window.getLang === 'function' ? window.getLang() : (localStorage.getItem('eventia_lang') || 'en');
            if (!key) {
                pageTitle.removeAttribute('data-i18n');
                pageTitle.textContent = fallbackEn[viewId] || 'Dashboard';
            } else {
                pageTitle.setAttribute('data-i18n', key);
                pageTitle.textContent = window.I18N?.[lang]?.[key] ?? window.I18N?.en?.[key] ?? fallbackEn[viewId] ?? 'Dashboard';
            }
        }

        let currentEditingId = null; // State for Edit Mode
        let currentView = 'overview';

        // Toast Notification Helper
        function showToast(message) {
            // Remove existing toasts
            const existing = document.querySelectorAll('.toast-notification');
            existing.forEach(t => t.remove());

            // Create new toast
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `
                <div class="toast-icon"><i class="fa-solid fa-check"></i></div>
                <div class="toast-message">${message}</div>
            `;

            document.body.appendChild(toast);

            // Animate in
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);

            // Remove after 3s
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 400);
            }, 3000);
        }

        function showOrganizerFlashMessages() {
            const dataEl = document.getElementById('organizer-flash-data');
            if (!dataEl || !dataEl.textContent.trim()) return;
            try {
                const items = JSON.parse(dataEl.textContent);
                items.forEach((item) => {
                    const msg = translateFlashMessage(item.tags, item.text);
                    if (msg) showToast(msg);
                });
            } catch (e) {
                console.error('Flash message parse error:', e);
            }
        }

        showOrganizerFlashMessages();

        // Show full rejection reason in a modal popup
        window.showFullRejectionReason = function (encodedReason) {
            const reason = decodeURIComponent(encodedReason);

            // Remove existing modal if any
            const existing = document.getElementById('rejection-comment-modal');
            if (existing) existing.remove();

            // Create modal
            const modal = document.createElement('div');
            modal.id = 'rejection-comment-modal';
            modal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px);">
                    <div style="background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 500px; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0; color: #c62828;"><i class="fa-solid fa-circle-xmark" style="margin-right: 0.5rem;"></i> ${t('org.requests.rejectionReason')}</h3>
                            <button class="btn btn-sm btn-outline" onclick="document.getElementById('rejection-comment-modal').remove()">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div style="background: #ffebee; padding: 1rem; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; color: #c62828; max-height: 300px; overflow-y: auto;">${reason}</div>
                        <button class="btn btn-primary" style="margin-top: 1.5rem; width: 100%;" onclick="document.getElementById('rejection-comment-modal').remove()">${t('common.close')}</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        // Sidebar Toggle (Mobile)
        const sidebarClose = document.getElementById('sidebar-close');
        const sidebarBackdrop = document.getElementById('sidebar-backdrop');

        function openSidebar() {
            sidebar.classList.add('open');
            if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
        }
        function closeSidebar() {
            sidebar.classList.remove('open');
            if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                if (sidebar.classList.contains('open')) closeSidebar();
                else openSidebar();
            });
        }
        if (sidebarClose) {
            sidebarClose.addEventListener('click', closeSidebar);
        }
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', closeSidebar);
        }

        // View Switching Logic
        window.switchView = function (viewId) {
            // Update Sidebar Active State
            sidebarItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.view === viewId) {
                    item.classList.add('active');
                }
            });

            // Show Target Section
            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === `view-${viewId}`) {
                    sec.classList.add('active');
                }
            });

            applyOrganizerPageTitle(viewId);

            // Close sidebar on mobile after selection
            if (window.innerWidth < 992) {
                closeSidebar();
            }

            // Refresh data if needed
            if (viewId === 'overview' || viewId === 'events-list') {
                renderEvents();
                updateStats();
            } else if (viewId === 'vendors') {
                renderVendors();
            }
        };

        // Attach Click Handlers to Sidebar
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                if (view) {
                    if (view === 'create-event') {
                        resetCreateForm();
                    }
                    switchView(view);
                }
            });
        });

        // Initialize Vendor Category Pills
        const categoryPills = document.querySelectorAll('.category-pill');
        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active state
                categoryPills.forEach(p => {
                    p.classList.remove('active');
                    p.style.background = 'white';
                    p.style.color = '#333';
                    p.style.border = '1px solid #e0e0e0';
                });
                pill.classList.add('active');
                pill.style.background = '#004e92';
                pill.style.color = 'white';
                pill.style.border = 'none';

                // Update hidden select and render
                const vendorFilterSelect = document.getElementById('vendor-category-select');
                if (vendorFilterSelect) {
                    vendorFilterSelect.value = pill.dataset.category;
                }
                renderVendors();
            });
        });

        // Initialize Vendor Filter Listener (hidden select for programmatic use)
        const vendorFilterSelect = document.getElementById('vendor-category-select');
        if (vendorFilterSelect) {
            vendorFilterSelect.addEventListener('change', () => {
                renderVendors();
            });
        }

        const vendorSearchInput = document.getElementById('vendor-search');
        if (vendorSearchInput) {
            vendorSearchInput.addEventListener('input', () => {
                renderVendors();
            });
        }

        // Location filter
        const vendorLocationFilter = document.getElementById('vendor-location-filter');
        if (vendorLocationFilter) {
            vendorLocationFilter.addEventListener('change', () => {
                renderVendors();
            });
        }

        // View All Categories Modal
        const showAllCategoriesBtn = document.getElementById('show-all-categories');
        if (showAllCategoriesBtn) {
            showAllCategoriesBtn.addEventListener('click', () => {
                showAllCategoriesModal();
            });
        }

        function showAllCategoriesModal() {
            // Remove existing modal
            const existing = document.getElementById('categories-modal');
            if (existing) existing.remove();

            const categories = [
                {
                    group: t('vendor.group.foodBeverages'),
                    items: [
                        { value: 'Catering', label: t('common.catering') },
                        { value: 'Bakery & Desserts', label: t('common.bakeryDesserts') },
                        { value: 'Beverages', label: t('common.beverages') },
                        { value: 'Food Trucks', label: t('common.foodTrucks') }
                    ]
                },
                {
                    group: t('vendor.group.venues'),
                    items: [
                        { value: 'Venue', label: t('common.venue') },
                        { value: 'Conference Hall', label: t('common.conferenceHall') },
                        { value: 'Outdoor Venue', label: t('common.outdoorVenue') }
                    ]
                },
                {
                    group: t('vendor.group.avTechnology'),
                    items: [
                        { value: 'AV Equipment', label: t('common.avEquipment') },
                        { value: 'LED Screens', label: t('common.ledScreens') },
                        { value: 'Stage & Rigging', label: t('common.stageRigging') },
                        { value: 'Live Streaming', label: t('common.liveStreaming') }
                    ]
                },
                {
                    group: t('vendor.group.decorationDesign'),
                    items: [
                        { value: 'Decoration', label: t('common.decoration') },
                        { value: 'Floral Design', label: t('common.floralDesign') },
                        { value: 'Balloon Decor', label: t('common.balloonDecor') },
                        { value: 'Event Lighting', label: t('common.eventLighting') }
                    ]
                },
                {
                    group: t('vendor.group.photographyMedia'),
                    items: [
                        { value: 'Photography', label: t('common.photography') },
                        { value: 'Aerial Photography', label: t('common.aerialPhotography') },
                        { value: 'Photo Booth', label: t('common.photoBooth') }
                    ]
                },
                {
                    group: t('vendor.group.entertainment'),
                    items: [
                        { value: 'DJ Services', label: t('common.dj') },
                        { value: 'Live Entertainment', label: t('common.liveEntertainment') },
                        { value: 'Kids Entertainment', label: t('common.kidsEntertainment') },
                        { value: 'Traditional Music', label: t('common.traditionalMusic') },
                        { value: 'Fireworks & Pyro', label: t('common.fireworks') }
                    ]
                },
                {
                    group: t('vendor.group.transportation'),
                    items: [
                        { value: 'Transportation', label: t('common.transportation') },
                        { value: 'Shuttle Services', label: t('common.shuttle') },
                        { value: 'Valet Parking', label: t('common.valet') }
                    ]
                },
                {
                    group: t('vendor.group.securitySafety'),
                    items: [
                        { value: 'Security', label: t('common.security') },
                        { value: 'VIP Security', label: t('common.vipSecurity') },
                        { value: 'Medical Services', label: t('common.medical') }
                    ]
                },
                {
                    group: t('vendor.group.staffingServices'),
                    items: [
                        { value: 'Event Staff', label: t('common.eventStaff') },
                        { value: 'Translation', label: t('common.translation') },
                        { value: 'MC & Hosting', label: t('common.mcHosting') }
                    ]
                },
                {
                    group: t('vendor.group.rentalsEquipment'),
                    items: [
                        { value: 'Tent Rentals', label: t('common.tents') },
                        { value: 'Furniture Rentals', label: t('common.furniture') },
                        { value: 'Table/Chair Rentals', label: t('common.tableChair') },
                        { value: 'Power Supply', label: t('common.power') }
                    ]
                },
                {
                    group: t('vendor.group.marketingPromotion'),
                    items: [
                        { value: 'Printing', label: t('common.printing') },
                        { value: 'Book Sales', label: t('common.bookSales') },
                        { value: 'Social Media Marketing', label: t('common.socialMedia') },
                        { value: 'Influencer Marketing', label: t('common.influencer') }
                    ]
                },
                {
                    group: t('vendor.group.governmentPermits'),
                    items: [
                        { value: 'Government Permits', label: t('common.governmentPermits') },
                        { value: 'Safety Permits', label: t('common.safetyPermits') }
                    ]
                },
                {
                    group: t('vendor.group.sponsorsPartners'),
                    items: [
                        { value: 'Sponsors', label: t('common.sponsors') },
                        { value: 'Brand Partners', label: t('common.brandPartners') }
                    ]
                },
                {
                    group: t('vendor.group.saudiCultural'),
                    items: [
                        { value: 'Henna Artists', label: t('common.henna') },
                        { value: 'Falconry Shows', label: t('common.falconry') },
                        { value: 'Horse Shows', label: t('common.horseShows') },
                        { value: 'Arabian Perfumes', label: t('common.perfumes') },
                        { value: 'Arabic Calligraphy', label: t('common.calligraphy') }
                    ]
                },
                {
                    group: t('vendor.group.specializedServices'),
                    items: [
                        { value: 'VR/AR Experiences', label: t('common.vrAr') },
                        { value: 'Eco-Friendly Services', label: t('common.eco') },
                        { value: 'Gifts & Giveaways', label: t('common.gifts') }
                    ]
                }
            ];

            let categoriesHTML = '';
            categories.forEach(cat => {
                categoriesHTML += `
                    <div style="margin-bottom: 1rem;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; font-size: 0.9rem;">${cat.group}</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${cat.items.map(item => `
                                <button class="modal-category-btn" data-category="${item.value}"
                                    style="padding: 6px 14px; border: 1px solid #e0e0e0; border-radius: 16px; background: white; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;">
                                    ${item.label}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            });

            const modal = document.createElement('div');
            modal.id = 'categories-modal';
            modal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px);" onclick="if(event.target === this) this.parentElement.remove()">
                    <div style="background: white; border-radius: 16px; width: 90%; max-width: 700px; max-height: 80vh; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
                        <div style="position: relative; background: linear-gradient(135deg, #004e92, #4dabf7); color: white; padding: 1.25rem 1.5rem 1.25rem 3.25rem;">
                            <h3 dir="auto" style="margin: 0; font-size: 1.1rem; text-align: start;">
                                <i class="fa-solid fa-grid-2" style="margin-inline-end: 0.5rem;"></i>
                                <span>${t('common.allCategories')}</span>
                            </h3>
                            <button type="button" onclick="document.getElementById('categories-modal').remove()" style="position: absolute; top: 50%; left: 1.25rem; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; padding: 0; display: inline-flex; align-items: center; justify-content: center; line-height: 0; z-index: 1;" aria-label="Close">
                                <i class="fa-solid fa-xmark" style="font-size: 0.9rem; line-height: 1; display: block; transform: translateY(0.08em);" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div style="padding: 1.5rem; overflow-y: auto; max-height: 60vh;">
                            ${categoriesHTML}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add click handlers to modal category buttons
            modal.querySelectorAll('.modal-category-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const category = btn.dataset.category;
                    // Update hidden select
                    const vendorFilterSelect = document.getElementById('vendor-category-select');
                    if (vendorFilterSelect) vendorFilterSelect.value = category;

                    // Update pills active state
                    const pills = document.querySelectorAll('.category-pill');
                    pills.forEach(p => {
                        p.classList.remove('active');
                        p.style.background = 'white';
                        p.style.color = '#333';
                        p.style.border = '1px solid #e0e0e0';
                    });

                    // Try to find matching pill
                    const matchingPill = document.querySelector(`.category-pill[data-category="${category}"]`);
                    if (matchingPill) {
                        matchingPill.classList.add('active');
                        matchingPill.style.background = '#004e92';
                        matchingPill.style.color = 'white';
                        matchingPill.style.border = 'none';
                    }

                    modal.remove();
                    renderVendors();
                });

                // Hover effect
                btn.addEventListener('mouseenter', () => {
                    btn.style.background = '#004e92';
                    btn.style.color = 'white';
                    btn.style.border = '1px solid #004e92';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.background = 'white';
                    btn.style.color = '#333';
                    btn.style.border = '1px solid #e0e0e0';
                });
            });
        }

        function setCreateFormSubmitButton(btn, i18nKey) {
            if (!btn) return;
            const label = t(i18nKey);
            btn.innerHTML = `<span data-i18n="${i18nKey}">${label}</span>`;
        }

        function resetCreateForm() {
            currentEditingId = null;
            if (createEventForm) {
                createEventForm.reset();
                if (window.organizerEventDatePickerInstance) {
                    window.organizerEventDatePickerInstance.clear();
                }
                if (typeof window.refreshOrganizerEventTimePicker === 'function') {
                    window.refreshOrganizerEventTimePicker();
                }
                const btn = createEventForm.querySelector('button[type="submit"]');
                setCreateFormSubmitButton(btn, 'org.btn.publish');

                // Reset Headings
                const formHeader = document.querySelector('#view-create-event .section-header h2');
                if (formHeader) formHeader.textContent = 'Create New Event';

                // Reset Ticket Categories to Default
                const container = document.getElementById('ticket-categories-container');
                if (container) {
                    container.innerHTML = `
                        <div class="ticket-row" style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" class="ticket-name" data-i18n-placeholder="org.ticket.namePh" placeholder="${t('org.ticket.namePh')}" value="Standard" required style="flex: 2;">
                            <input type="number" class="ticket-price" data-i18n-placeholder="org.ticket.pricePh" placeholder="${t('org.ticket.pricePh')}" min="0" required style="flex: 1;">
                            <input type="number" class="ticket-capacity" data-i18n-placeholder="org.ticket.capacityPh" placeholder="${t('org.ticket.capacityPh')}" min="1" style="flex: 1;">
                            <button type="button" class="btn btn-sm btn-outline remove-ticket-btn" style="color: var(--danger-color); border-color: var(--danger-color);"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    `;
                }
            }
        }

        function openEditView(id) {
            const events = getEvents();
            const evt = events.find(e => e.id === id);
            if (!evt) return;

            currentEditingId = id;
            switchView('create-event');

            // Override Page Title
            if (pageTitle) {
                pageTitle.setAttribute('data-i18n', 'org.em.editEvent');
                const lg = typeof window.getLang === 'function' ? window.getLang() : (localStorage.getItem('eventia_lang') || 'en');
                pageTitle.textContent =
                    window.I18N?.[lg]?.['org.em.editEvent'] ??
                    window.I18N?.en?.['org.em.editEvent'] ??
                    'Edit Event';
            }

            // Override Form Header
            const formHeader = document.querySelector('#view-create-event .section-header h2');
            if (formHeader) formHeader.textContent = t('org.em.editEvent');
            // Populate Form
            document.getElementById('event-title').value = evt.title;
            document.getElementById('event-category').value = evt.category;
            const dateInput = document.getElementById('event-date');
            if (evt.date) {
                dateInput.value = evt.date;
                if (window.organizerEventDatePickerInstance) {
                    window.organizerEventDatePickerInstance.setDate(evt.date, false);
                }
            } else {
                dateInput.value = '';
                if (window.organizerEventDatePickerInstance) {
                    window.organizerEventDatePickerInstance.clear();
                }
            }
            const pTime = organizerParseHm(evt.time);
            document.getElementById('event-time').value = pTime
                ? `${String(pTime.h).padStart(2, '0')}:${String(pTime.min).padStart(2, '0')}`
                : '';
            if (typeof window.refreshOrganizerEventTimePicker === 'function') {
                window.refreshOrganizerEventTimePicker();
            }
            document.getElementById('event-location').value = evt.location;
            document.getElementById('event-description').value = evt.description;
            // Also repopulate withdrawal policies
            const vendorPolicyEl = document.getElementById('event-withdrawal-policy');
            if (vendorPolicyEl && evt.withdrawalPolicy) vendorPolicyEl.value = evt.withdrawalPolicy;
            const attendeePolicyEl = document.getElementById('event-attendee-withdrawal-policy');
            if (attendeePolicyEl && evt.attendeeWithdrawalPolicy) attendeePolicyEl.value = evt.attendeeWithdrawalPolicy;

            // Handle Tickets
            const container = document.getElementById('ticket-categories-container');
            container.innerHTML = ''; // Clear default

            let ticketsToLoad = evt.tickets || [];
            if (ticketsToLoad.length === 0 && evt.price !== undefined) {
                // Backward compatibility for old single-price events
                ticketsToLoad.push({ name: 'Standard', price: evt.price });
            }

            if (ticketsToLoad.length === 0) {
                // Fallback for completely empty (shouldn't happen but safe)
                ticketsToLoad.push({ name: 'General', price: '' });
            }

            ticketsToLoad.forEach(ticket => {
                const row = document.createElement('div');
                row.className = 'ticket-row';
                row.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
                row.innerHTML = `
                    <input type="text" class="ticket-name" data-i18n-placeholder="org.ticket.namePh" placeholder="${t('org.ticket.namePh')}" value="${ticket.name}" required style="flex: 2;">
                    <input type="number" class="ticket-price" data-i18n-placeholder="org.ticket.pricePh" placeholder="${t('org.ticket.pricePh')}" value="${ticket.price}" min="0" required style="flex: 1;">
                    <input type="number" class="ticket-capacity" data-i18n-placeholder="org.ticket.capacityPh" placeholder="${t('org.ticket.capacityPh')}" value="${ticket.capacity || ''}" min="1" style="flex: 1;">
                    <button type="button" class="btn btn-sm btn-outline remove-ticket-btn" style="color: var(--danger-color); border-color: var(--danger-color);"><i class="fa-solid fa-trash"></i></button>
                `;
                container.appendChild(row);
            });

            // Update Button
            const btn = createEventForm.querySelector('button[type="submit"]');
            setCreateFormSubmitButton(btn, 'org.em.updateEvent');
        }

        // --- API DATA ACCESS ---
        let API_DATA = {
            events: [], vendors: [], outgoingRequests: [], incomingRequests: [],
            eventVendors: [], messages: [], broadcasts: []
        };

        async function initData() {
            try {
                const response = await fetch('/api/organizer/data/', { credentials: 'same-origin' });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                API_DATA = await response.json();

                // Refresh the UI with real data
                if (typeof renderEvents === 'function') renderEvents();
                if (typeof updateStats === 'function') updateStats();
            } catch (error) {
                console.error("API Error:", error);
                showToast(t('org.error.loadingData'));
            }
        }

        // Start pulling data immediately
        initData();

        function getEvents() { return API_DATA.events || []; }
        function getVendors() { return API_DATA.vendors || []; }

        // Logic to setup Ticket UI handlers
        function setupTicketHandlers() {
            const container = document.getElementById('ticket-categories-container');
            const addBtn = document.getElementById('add-ticket-btn');

            if (addBtn && container) {
                // Check if listener already attached to avoid duplicates? 
                // A simple way is to clone and replace or just use a flag. 
                // Since initDashboard runs once, we are safe.

                addBtn.addEventListener('click', () => {
                    const row = document.createElement('div');
                    row.className = 'ticket-row';
                    row.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
                    row.innerHTML = `
                        <input type="text" class="ticket-name" data-i18n-placeholder="org.ticket.namePh" placeholder="${t('org.ticket.namePh')}" required style="flex: 2;">
                        <input type="number" class="ticket-price" data-i18n-placeholder="org.ticket.pricePh" placeholder="${t('org.ticket.pricePh')}" min="0" required style="flex: 1;">
                        <input type="number" class="ticket-capacity" data-i18n-placeholder="org.ticket.capacityPh" placeholder="${t('org.ticket.capacityPh')}" min="1" style="flex: 1;">
                        <button type="button" class="btn btn-sm btn-outline remove-ticket-btn" style="color: var(--danger-color); border-color: var(--danger-color);"><i class="fa-solid fa-trash"></i></button>
                    `;
                    container.appendChild(row);
                });

                container.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-ticket-btn')) {
                        const row = e.target.closest('.ticket-row');
                        // Ensure at least one row remains
                        if (container.querySelectorAll('.ticket-row').length > 1) {
                            row.remove();
                        } else {
                            // Optionally clear values instead of removing
                            row.querySelector('.ticket-name').value = '';
                            row.querySelector('.ticket-price').value = '';
                            showToast(t('org.toast.ticketRequired'));
                        }
                    }
                });
            }
        }
        setupTicketHandlers(); // Call it

        function refreshOrganizerEventDatePicker() {
            const el = document.getElementById('event-date');
            if (!el || typeof flatpickr === 'undefined') return;

            const wrap = el.closest('.organizer-date-input-wrap');
            const lang = typeof window.getLang === 'function' ? window.getLang() : (localStorage.getItem('eventia_lang') || 'en');
            const preserved = el.value;

            if (window.organizerEventDatePickerInstance) {
                try {
                    window.organizerEventDatePickerInstance.destroy();
                } catch (e) { /* noop */ }
                window.organizerEventDatePickerInstance = null;
            }

            el.setAttribute('type', 'text');
            el.setAttribute('autocomplete', 'off');

            const fpOpts = {
                dateFormat: 'Y-m-d',
                altInput: true,
                altFormat: 'd/m/Y',
                altInputClass: 'organizer-event-date-alt flatpickr-input',
                allowInput: false,
                disableMobile: true,
                appendTo: document.body,
                positionElement: wrap || el,
                position: 'below auto',
                onReady: function (_d, _s, inst) {
                    const alt = inst.altInput;
                    if (alt) {
                        alt.classList.add('organizer-event-date-alt');
                        const lg = typeof window.getLang === 'function' ? window.getLang() : 'en';
                        const dict = (window.I18N && window.I18N[lg]) || (window.I18N && window.I18N.en) || {};
                        alt.setAttribute('placeholder', dict['org.ph.eventDate'] || 'dd/mm/yyyy');
                    }
                    if (inst.calendarContainer) {
                        inst.calendarContainer.classList.add('eventia-organizer-fp');
                        inst.calendarContainer.classList.toggle('eventia-organizer-fp--ar',
                            lang === 'ar');
                        inst.calendarContainer.setAttribute('dir', 'ltr');
                        inst.calendarContainer.style.direction = 'ltr';
                    }
                    const iconEl = wrap ? wrap.querySelector('.organizer-date-cal-icon') : null;
                    if (iconEl) {
                        iconEl.style.pointerEvents = 'auto';
                        iconEl.style.cursor = 'pointer';
                        iconEl.onclick = function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            inst.toggle();
                        };
                    }
                },
            };
            if (lang === 'ar' && flatpickr.l10ns && flatpickr.l10ns.ar) {
                fpOpts.locale = flatpickr.l10ns.ar;
            }

            window.organizerEventDatePickerInstance = flatpickr(el, fpOpts);

            if (preserved) {
                window.organizerEventDatePickerInstance.setDate(preserved, false);
            }
        }
        window.refreshOrganizerEventDatePicker = refreshOrganizerEventDatePicker;
        refreshOrganizerEventDatePicker();

        /* --- Event time: 12h scroll columns (hours | minutes | period), EN + AR same layout --- */
        const ORG_TIME_ITEM_H = 40;
        const westernToArabicIndic = (() => {
            const map = { '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩' };
            return (s) => String(s).replace(/[0-9]/g, (d) => map[d] || d);
        })();

        function organizerTimeLang() {
            return typeof window.getLang === 'function' ? window.getLang() : (localStorage.getItem('eventia_lang') || 'en');
        }

        function organizerParseHm(v) {
            if (v == null || v === '' || v === 'TBD') return null;
            const m = /^(\d{1,2}):(\d{2})/.exec(String(v).trim());
            if (!m) return null;
            const h = parseInt(m[1], 10);
            const min = parseInt(m[2], 10);
            if (Number.isNaN(h) || Number.isNaN(min) || h > 23 || min > 59) return null;
            return { h, min };
        }

        function organizerFromH24(h24) {
            const isPm = h24 >= 12;
            let h12 = h24 % 12;
            if (h12 === 0) h12 = 12;
            return { h12, isPm };
        }

        function organizerToH24(h12, isPm) {
            if (h12 === 12) return isPm ? 12 : 0;
            return h12 + (isPm ? 12 : 0);
        }

        function organizerFormatTimeDisplay(h24, min, lang) {
            const { h12, isPm } = organizerFromH24(h24);
            const hh = String(h12).padStart(2, '0');
            const mm = String(min).padStart(2, '0');
            const clock = lang === 'ar' ? `${westernToArabicIndic(hh)}:${westernToArabicIndic(mm)}` : `${hh}:${mm}`;
            if (lang === 'ar') {
                const ap = isPm ? 'م' : 'ص';
                return `${clock} ${ap}`;
            }
            return `${clock} ${isPm ? 'PM' : 'AM'}`;
        }

        function setupOrganizerEventTimePicker() {
            const hidden = document.getElementById('event-time');
            const wrap = document.querySelector('.organizer-time-input-wrap');
            if (!hidden || !wrap) return;

            const display = document.getElementById('event-time-display');
            if (!display) return;

            let popover = document.getElementById('eventia-organizer-time-popover');
            if (!popover) {
                popover = document.createElement('div');
                popover.id = 'eventia-organizer-time-popover';
                popover.className = 'eventia-organizer-time-popover';
                popover.setAttribute('role', 'dialog');
                popover.setAttribute('aria-modal', 'true');
                popover.innerHTML = `
                    <div class="eventia-time-picker-shell">
                        <div class="eventia-time-picker-highlight" aria-hidden="true"></div>
                        <div class="eventia-time-picker-cols">
                            <div class="eventia-time-col" data-role="hour"></div>
                            <div class="eventia-time-col" data-role="minute"></div>
                            <div class="eventia-time-col" data-role="ampm"></div>
                        </div>
                    </div>`;
                document.body.appendChild(popover);
            }

            const colHour = popover.querySelector('[data-role="hour"]');
            const colMin = popover.querySelector('[data-role="minute"]');
            const colAmpm = popover.querySelector('[data-role="ampm"]');

            let open = false;
            let syncingScroll = false;
            let teardownOutside = null;
            let activeIdx = { hour: 0, minute: 0, ampm: 1 };

            function fillColumns() {
                const lang = organizerTimeLang();
                colHour.innerHTML = '';
                for (let h = 1; h <= 12; h++) {
                    const label = lang === 'ar' ? westernToArabicIndic(String(h).padStart(2, '0')) : String(h).padStart(2, '0');
                    colHour.appendChild(makeOpt(label, String(h)));
                }
                colMin.innerHTML = '';
                for (let m = 0; m <= 59; m++) {
                    const key = String(m).padStart(2, '0');
                    const label = lang === 'ar' ? westernToArabicIndic(key) : key;
                    colMin.appendChild(makeOpt(label, key));
                }
                colAmpm.innerHTML = '';
                if (lang === 'ar') {
                    colAmpm.appendChild(makeOpt('ص', '0'));
                    colAmpm.appendChild(makeOpt('م', '1'));
                } else {
                    colAmpm.appendChild(makeOpt('AM', '0'));
                    colAmpm.appendChild(makeOpt('PM', '1'));
                }
            }

            function makeOpt(labelText, val) {
                const el = document.createElement('div');
                el.className = 'eventia-time-option';
                el.textContent = labelText;
                el.dataset.value = val;
                el.setAttribute('role', 'option');
                return el;
            }

            function readIndicesFromCols() {
                return {
                    hour: Math.min(11, Math.max(0, Math.round(colHour.scrollTop / ORG_TIME_ITEM_H))),
                    minute: Math.min(59, Math.max(0, Math.round(colMin.scrollTop / ORG_TIME_ITEM_H))),
                    ampm: Math.min(1, Math.max(0, Math.round(colAmpm.scrollTop / ORG_TIME_ITEM_H))),
                };
            }

            function applyIndicesToHidden() {
                const hour12 = activeIdx.hour + 1;
                const min = activeIdx.minute;
                const isPm = activeIdx.ampm === 1;
                const h24 = organizerToH24(hour12, isPm);
                hidden.value = `${String(h24).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                syncDisplayOnly();
                markSelectedOpts();
            }

            function indicesFromHm(h24, min) {
                const { h12, isPm } = organizerFromH24(h24);
                return {
                    hour: Math.max(0, Math.min(11, h12 - 1)),
                    minute: Math.max(0, Math.min(59, min)),
                    ampm: isPm ? 1 : 0,
                };
            }

            function scrollColTo(col, idx) {
                syncingScroll = true;
                col.scrollTop = idx * ORG_TIME_ITEM_H;
                requestAnimationFrame(() => {
                    syncingScroll = false;
                });
            }

            function markSelectedOpts() {
                [colHour, colMin, colAmpm].forEach((col) => {
                    const idx = Math.round(col.scrollTop / ORG_TIME_ITEM_H);
                    col.querySelectorAll('.eventia-time-option').forEach((opt, i) => {
                        opt.classList.toggle('is-selected', i === idx);
                    });
                });
            }

            function syncDisplayOnly() {
                const lang = organizerTimeLang();
                const parsed = organizerParseHm(hidden.value);
                if (!parsed) {
                    display.value = '';
                    display.removeAttribute('value');
                    return;
                }
                display.value = organizerFormatTimeDisplay(parsed.h, parsed.min, lang);
            }

            function syncFromHiddenToPicker() {
                const parsed = organizerParseHm(hidden.value);
                if (!parsed) {
                    activeIdx = { hour: 11, minute: 0, ampm: 0 };
                } else {
                    activeIdx = indicesFromHm(parsed.h, parsed.min);
                }
                scrollColTo(colHour, activeIdx.hour);
                scrollColTo(colMin, activeIdx.minute);
                scrollColTo(colAmpm, activeIdx.ampm);
                markSelectedOpts();
            }

            function positionPopover() {
                const rect = wrap.getBoundingClientRect();
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                popover.style.maxWidth = 'min(272px, calc(100vw - 24px))';
                const pw = Math.min(272, vw - 24);
                let left = rect.left + (rect.width - pw) / 2;
                left = Math.max(12, Math.min(left, vw - pw - 12));
                let top = rect.bottom + 6;
                const ph = popover.offsetHeight || 216;
                if (top + ph > vh - 12) top = Math.max(12, rect.top - ph - 6);
                popover.style.left = `${left}px`;
                popover.style.top = `${top}px`;
                popover.style.width = `${pw}px`;
            }

            function openPicker() {
                if (open) return;
                fillColumns();
                syncFromHiddenToPicker();
                popover.classList.add('is-open');
                positionPopover();
                open = true;
                display.setAttribute('aria-expanded', 'true');

                const docEscHandler = (e) => {
                    if (e.key === 'Escape') closePicker();
                };
                document.addEventListener('keydown', docEscHandler);
                teardownOutside = (e) => {
                    if (wrap.contains(e.target) || popover.contains(e.target)) return;
                    closePicker();
                };
                teardownOutside._esc = docEscHandler;
                setTimeout(() => {
                    document.addEventListener('mousedown', teardownOutside, true);
                }, 0);
            }

            function closePicker() {
                if (!open) return;
                popover.classList.remove('is-open');
                open = false;
                display.setAttribute('aria-expanded', 'false');
                if (teardownOutside) {
                    document.removeEventListener('mousedown', teardownOutside, true);
                    if (teardownOutside._esc) {
                        document.removeEventListener('keydown', teardownOutside._esc);
                    }
                    teardownOutside = null;
                }
            }

            function onColScroll(col) {
                if (syncingScroll) return;
                const role = col.getAttribute('data-role');
                const max = role === 'hour' ? 11 : role === 'minute' ? 59 : 1;
                let idx = Math.round(col.scrollTop / ORG_TIME_ITEM_H);
                idx = Math.max(0, Math.min(max, idx));
                if (Math.abs(col.scrollTop - idx * ORG_TIME_ITEM_H) > 1) {
                    scrollColTo(col, idx);
                }
                activeIdx = readIndicesFromCols();
                applyIndicesToHidden();
            }

            const scrollTimers = { hour: null, minute: null, ampm: null };

            [colHour, colMin, colAmpm].forEach((col) => {
                col.addEventListener('scroll', () => {
                    const role = col.getAttribute('data-role');
                    if (!role || !Object.prototype.hasOwnProperty.call(scrollTimers, role)) return;
                    if (scrollTimers[role]) clearTimeout(scrollTimers[role]);
                    scrollTimers[role] = setTimeout(() => onColScroll(col), 50);
                }, { passive: true });
                col.addEventListener('click', (e) => {
                    const opt = e.target.closest('.eventia-time-option');
                    if (!opt || !col.contains(opt)) return;
                    const i = Array.prototype.indexOf.call(col.children, opt);
                    if (i < 0) return;
                    scrollColTo(col, i);
                    activeIdx = readIndicesFromCols();
                    applyIndicesToHidden();
                });
            });

            display.addEventListener('click', (e) => {
                e.preventDefault();
                if (open) closePicker();
                else openPicker();
            });
            display.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (open) closePicker();
                    else openPicker();
                }
                if (e.key === 'Escape' && open) {
                    e.preventDefault();
                    closePicker();
                }
            });

            window.addEventListener('resize', () => {
                if (open) positionPopover();
            });

            function refreshOrganizerEventTimePicker() {
                fillColumns();
                syncDisplayOnly();
                if (open) {
                    syncFromHiddenToPicker();
                    positionPopover();
                }
            }
            window.refreshOrganizerEventTimePicker = refreshOrganizerEventTimePicker;

            syncDisplayOnly();
        }
        setupOrganizerEventTimePicker();

        async function deleteEvent(eventId) {
            try {
                const response = await fetch('/dashboard/organizer/delete/' + eventId + '/', {
                    method: 'POST',
                    headers: { 'X-CSRFToken': window.CSRF_TOKEN },
                    credentials: 'same-origin'
                });
                if (response.ok || response.redirected) {
                    await initData();
                    renderEvents();
                    updateStats();
                } else {
                    showToast(t('org.error.deletingEvent'));
                }
            } catch (err) {
                console.error('Delete error:', err);
                showToast(t('org.error.deletingEvent'));
            }
        }

        function updateEventStatuses() {
            // Statuses are computed server-side, no-op
        }

        // Form Handling — submit to Django via POST
        const createEventForm = document.getElementById('create-event-form');
        if (createEventForm) {
            createEventForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const timeHidden = document.getElementById('event-time');
                if (!timeHidden || !String(timeHidden.value || '').trim()) {
                    showToast(t('org.validation.selectEventTime'));
                    return;
                }

                // Collect ticket price from the first ticket row
                const ticketRows = document.querySelectorAll('.ticket-row');
                const prices = [];
                ticketRows.forEach(row => {
                    const price = row.querySelector('.ticket-price').value;
                    if (price !== '') prices.push(parseFloat(price));
                });
                const ticketPrice = prices.length > 0 ? Math.min(...prices) : 0;

                const formData = new FormData();
                if (currentEditingId) formData.append('event_id', currentEditingId);
                formData.append('title', document.getElementById('event-title').value);
                formData.append('category', document.getElementById('event-category').value);
                formData.append('date', document.getElementById('event-date').value);
                formData.append('time', document.getElementById('event-time').value);
                formData.append('location', document.getElementById('event-location').value);
                formData.append('description', document.getElementById('event-description').value);
                formData.append('capacity', document.getElementById('event-capacity') ? document.getElementById('event-capacity').value : '');
                formData.append('ticket_price', ticketPrice);
                formData.append('withdrawal_policy', document.getElementById('event-withdrawal-policy').value);
                formData.append('attendee_withdrawal_policy', document.getElementById('event-attendee-withdrawal-policy').value);

                // Banner file
                const bannerInput = document.getElementById('event-banner');
                if (bannerInput && bannerInput.files.length > 0) {
                    formData.append('banner', bannerInput.files[0]);
                }

                try {
                    const response = await fetch('/dashboard/organizer/', {
                        method: 'POST',
                        headers: { 'X-CSRFToken': window.CSRF_TOKEN },
                        credentials: 'same-origin',
                        body: formData
                    });

                    if (response.ok || response.redirected) {
                        const msg = currentEditingId
                            ? t('org.toast.updated')
                            : t('org.toast.submitted');
                        showToast(msg);
                        resetCreateForm();
                        await initData();
                        switchView('overview');
                    } else {
                        showToast(t('org.error.savingEvent'));
                    }
                } catch (err) {
                    console.error('Save error:', err);
                    showToast(t('org.error.savingEvent'));
                }
            });
        }

        // Render Functions
        function renderEvents() {
            // 1. Update Statuses first
            updateEventStatuses();

            const events = getEvents();

            // 2. Render in Overview (Recent Events) - ONLY APPROVED EVENTS (Ongoing/Upcoming, no Past)
            const recentContainer = document.getElementById('recent-events-list');
            if (recentContainer) {
                // Dashboard only shows approved events that are ongoing or upcoming (not Past)
                const todayStr = new Date().toISOString().split('T')[0];
                const activeEvents = events.filter(e =>
                    (e.status === 'Upcoming' || e.status === 'Ongoing') ||
                    (e.status !== 'Pending' && e.status !== 'Rejected' && e.date >= todayStr)
                );

                if (activeEvents.length === 0) {
                    recentContainer.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem;">No upcoming or ongoing events. Create an event and wait for SCEGA approval.</p>';
                } else {
                    // Sort by Date and show only 3
                    const sorted = activeEvents.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
                    recentContainer.innerHTML = sorted.map(evt => createDashboardEventItem(evt)).join('');
                }
            }

            // 3. Render in All Events List - WITH FILTER INPUT
            const allContainer = document.getElementById('all-events-container');
            const filterSelect = document.getElementById('event-filter-select');
            const filterValue = filterSelect ? filterSelect.value : 'all';

            if (allContainer) {
                let displayedEvents = events;

                if (filterValue !== 'all') {
                    displayedEvents = events.filter(e => e.status === filterValue);
                }

                if (filterValue !== 'all') {
                    displayedEvents = events.filter(e => e.status === filterValue);
                }

                if (displayedEvents.length === 0) {
                    allContainer.innerHTML = `
                        <div style="text-align: center; padding: 4rem;">
                            <i class="fa-regular fa-calendar-xmark" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                            <p class="text-muted">No ${filterValue !== 'all' ? filterValue.toLowerCase() : ''} events found.</p>
                        </div>`;
                } else {
                    // Sort by event state: Ongoing first, then Upcoming, then Past
                    // Within each group, sort by date
                    const todayStr = new Date().toISOString().split('T')[0];

                    const getEventPriority = (evt) => {
                        if (evt.date === todayStr) return 0; // Ongoing
                        if (evt.date > todayStr) return 1;   // Upcoming
                        return 2;                            // Past
                    };

                    const sorted = displayedEvents.slice().sort((a, b) => {
                        const priorityDiff = getEventPriority(a) - getEventPriority(b);
                        if (priorityDiff !== 0) return priorityDiff;
                        // Within same priority, sort by date (nearest first for Ongoing/Upcoming, latest first for Past)
                        if (getEventPriority(a) === 2) {
                            return new Date(b.date) - new Date(a.date); // Past: latest first
                        }
                        return new Date(a.date) - new Date(b.date); // Others: earliest first
                    });

                    allContainer.innerHTML = sorted.map(evt => createEventListItem(evt)).join('');
                    // Patch per-event unread badges after DOM is updated
                    setTimeout(() => { if (typeof window.patchAllUnreadBadges === 'function') window.patchAllUnreadBadges(); }, 0);
                }
            }

            // Attach listeners (Delete/Edit) - Logic remains same
            attachActionListeners();
        }

        function renderVendors() {
            const vendors = getVendors();
            const grid = document.getElementById('vendors-grid');
            const filterSelect = document.getElementById('vendor-category-select');
            const searchInput = document.getElementById('vendor-search');
            const locationFilter = document.getElementById('vendor-location-filter');
            const resultsCount = document.getElementById('vendor-results-count');

            if (!grid) return;

            let filtered = vendors;

            // Category Filter
            if (filterSelect && filterSelect.value !== 'all') {
                const selectedCategory = filterSelect.value;
                // Also match parent categories (e.g., "Entertainment" matches "DJ Services", "Live Entertainment", etc.)
                const entertainmentCategories = ['DJ Services', 'Live Entertainment', 'Kids Entertainment', 'Traditional Music', 'Fireworks & Pyro'];
                const venueCategories = ['Venue', 'Conference Hall', 'Outdoor Venue'];

                if (selectedCategory === 'Entertainment') {
                    filtered = filtered.filter(v => entertainmentCategories.includes(v.category) || v.category === 'Entertainment');
                } else if (selectedCategory === 'Venue') {
                    filtered = filtered.filter(v => venueCategories.includes(v.category));
                } else {
                    filtered = filtered.filter(v => v.category === selectedCategory);
                }
            }

            // Location Filter
            if (locationFilter && locationFilter.value !== 'all') {
                filtered = filtered.filter(v => v.location === locationFilter.value || v.location === 'Any' || v.location === 'Global');
            }

            // Search Filter
            if (searchInput && searchInput.value.trim() !== '') {
                const term = searchInput.value.toLowerCase();
                filtered = filtered.filter(v =>
                    v.name.toLowerCase().includes(term) ||
                    v.description.toLowerCase().includes(term) ||
                    v.category.toLowerCase().includes(term) ||
                    v.location.toLowerCase().includes(term)
                );
            }

            // Update results count
            if (resultsCount) {
                const categoryLabel = (filterSelect && filterSelect.value !== 'all')
                    ? translateServiceTypeLabel(filterSelect.value)
                    : '';

                if (filterSelect && filterSelect.value !== 'all') {
                    resultsCount.innerHTML = t('org.vendors.resultsFull')
                        .replace('{count}', filtered.length)
                        .replace('{category}', categoryLabel);
                } else {
                    resultsCount.innerHTML = t('org.vendors.resultsAll')
                        .replace('{count}', filtered.length);
                }
            }

            if (filtered.length === 0) {
                grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fa-solid fa-store-slash" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <p style="color: #888; margin: 0;">${t('org.vendors.noResults')}</p>
                    <button onclick="document.getElementById('vendor-search').value=''; document.getElementById('vendor-category-select').value='all'; document.querySelectorAll('.category-pill').forEach(p => { p.classList.remove('active'); p.style.background='white'; p.style.color='#333'; p.style.border='1px solid #e0e0e0'; }); document.querySelector('.category-pill[data-category=\\'all\\']').classList.add('active'); document.querySelector('.category-pill[data-category=\\'all\\']').style.background='#004e92'; document.querySelector('.category-pill[data-category=\\'all\\']').style.color='white'; renderVendors();" 
                        style="margin-top: 1rem; padding: 8px 16px; border: 1px solid #004e92; border-radius: 8px; background: white; color: #004e92; cursor: pointer; font-size: 0.85rem;">
                        ${t('org.vendors.clearFilters')}
                    </button>
                </div>`;
                return;
            }

            grid.innerHTML = filtered.map(vendor => `
                <div class="vendor-card">
                    <div class="vendor-image">
                        <i class="fa-solid ${vendor.image || 'fa-store'}"></i>
                        <div class="vendor-rating">
                            <i class="fa-solid fa-star"></i> ${vendor.rating}
                        </div>
                    </div>
                    <div class="vendor-details">
                        <div class="vendor-category">${translateServiceTypeLabel(vendor.category)}</div>
                        <h3>${vendor.name}</h3>
                        <div class="vendor-location">
                            <i class="fa-solid fa-location-dot"></i> ${vendor.location}
                        </div>
                        <p class="vendor-description">${vendor.description}</p>
                        
                        <div class="vendor-footer">
                            <span class="vendor-price">${vendor.priceRange}</span>
                            <button class="btn btn-sm btn-outline send-request-btn" data-id="${vendor.id}" data-name="${vendor.name}">${t('org.requests.sendRequest')}</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Attach listeners to new buttons
            document.querySelectorAll('.send-request-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const vendorId = e.target.dataset.id;
                    const vendorName = e.target.dataset.name;
                    openRequestModal(vendorId, vendorName);
                });
            });
        }

        // Attach listeners for event list action buttons
        function attachActionListeners() {
            // Manage button is handled via event delegation in the all-events-container click listener
        }

        // Simplified event item for Dashboard Overview (no SCEGA status column)
        function createDashboardEventItem(evt) {
            const dateObj = new Date(evt.date);
            const currentLang = localStorage.getItem('eventia_lang') || 'en';
            const month = dateObj.toLocaleString(
                currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US',
                { month: 'short' }
            ).toUpperCase();
            const day = dateObj.getDate();

            // Price Display Logic
            let priceDisplay = t('common.free');
            if (evt.price > 0) {
                priceDisplay = `${evt.price} ${SAR_ICON}`;
                if (evt.tickets && evt.tickets.length > 1) {
                    priceDisplay = `${t('common.from')} ${evt.price} ${SAR_ICON}`;
                }
            }

            // Calculate Event State with consistent colors
            const todayStr = new Date().toISOString().split('T')[0];
            let stateColor, stateBg;
            if (evt.date === todayStr) {
                stateColor = '#2e7d32'; // Green for Ongoing
                stateBg = 'rgba(46, 125, 50, 0.15)';
            } else if (evt.date > todayStr) {
                stateColor = '#7b1fa2'; // Purple for Upcoming
                stateBg = 'rgba(123, 31, 162, 0.15)';
            } else {
                stateColor = '#757575'; // Grey for Past
                stateBg = 'rgba(117, 117, 117, 0.15)';
            }

            return `
                <div class="event-list-item" style="display: flex; align-items: center; gap: 1rem;">
                    <div class="event-date-box">
                        <span class="date-month">${month}</span>
                        <span class="date-day">${day}</span>
                    </div>
                    <div class="event-details-text" style="flex: 1;">
                        <h4 style="margin: 0 0 0.25rem 0;">${evt.title}</h4>
                        <div class="event-meta-info" style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--text-muted);">
                            <span><i class="fa-regular fa-clock"></i> ${evt.time}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
                            <span><i class="fa-solid fa-ticket"></i> ${priceDisplay}</span>
                            <span style="padding: 2px 8px; border-radius: 12px; background: ${stateBg}; color: ${stateColor}; font-weight: 500; font-size: 0.75rem;">${statusKey(evt.status)}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        function createEventListItem(evt) {
            const dateObj = new Date(evt.date);
            const currentLang = localStorage.getItem('eventia_lang') || 'en';
            const month = dateObj.toLocaleString(
                currentLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US',
                { month: 'short' }
            ).toUpperCase();
            const day = dateObj.getDate();

            // Price Display Logic
            let priceDisplay = t('common.free');
            if (evt.price > 0) {
                priceDisplay = `${evt.price} ${SAR_ICON}`;
                if (evt.tickets && evt.tickets.length > 1) {
                    priceDisplay = `${t('common.from')} ${evt.price} ${SAR_ICON}`;
                }
            }

            // Calculate Event State badge — SCEGA status takes priority for non-approved events
            const todayStr = new Date().toISOString().split('T')[0];
            let eventState, stateColor, stateBg;
            if (evt.scegaStatus === 'PENDING') {
                eventState = t('common.pending');
                stateColor = '#ff9800';
                stateBg = 'rgba(255, 152, 0, 0.15)';
            } else if (evt.scegaStatus === 'REJECTED') {
                eventState = t('status.rejected');
                stateColor = '#c62828';
                stateBg = 'rgba(198, 40, 40, 0.15)';
            } else if (evt.date === todayStr) {
                eventState = t('status.ongoing');
                stateColor = '#2e7d32';
                stateBg = 'rgba(46, 125, 50, 0.15)';
            } else if (evt.date > todayStr) {
                eventState = t('status.upcoming');
                stateColor = '#7b1fa2';
                stateBg = 'rgba(123, 31, 162, 0.15)';
            } else {
                eventState = t('status.past');
                stateColor = '#757575';
                stateBg = 'rgba(117, 117, 117, 0.15)';
            }
            const eventStateBadge = `<span style="font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; background: ${stateBg}; color: ${stateColor}; font-weight: 500; margin-left: 8px;">${eventState}</span>`;

            // SCEGA Approval Status Column — driven by scegaStatus (PENDING/APPROVED/REJECTED)
            let scegaStatusIcon, scegaStatusColor, scegaStatusBg, scegaStatusText;
            switch (evt.scegaStatus) {
                case 'PENDING':
                    scegaStatusIcon = 'fa-clock';
                    scegaStatusColor = '#ff9800';
                    scegaStatusBg = 'rgba(255, 152, 0, 0.1)';
                    scegaStatusText = t('status.pendingReview');
                    break;
                case 'REJECTED':
                    scegaStatusIcon = 'fa-circle-xmark';
                    scegaStatusColor = '#c62828';
                    scegaStatusBg = 'rgba(198, 40, 40, 0.1)';
                    scegaStatusText = t('status.rejected');
                    break;
                default: // APPROVED
                    scegaStatusIcon = 'fa-circle-check';
                    scegaStatusColor = '#2e7d32';
                    scegaStatusBg = 'rgba(46, 125, 50, 0.1)';
                    scegaStatusText = t('status.approved');
            }

            // Rejection reason note — shown for any REJECTED event (past or future)
            let rejectionInfo = '';
            if (evt.scegaStatus === 'REJECTED' && evt.rejectionReason) {
                const maxLen = 40;
                if (evt.rejectionReason.length <= maxLen) {
                    rejectionInfo = `
                        <div class="scega-rejection-note">
                            <i class="fa-solid fa-comment"></i> ${evt.rejectionReason}
                        </div>
                    `;
                } else {
                    const truncated = evt.rejectionReason.substring(0, maxLen) + '...';
                    rejectionInfo = `
                        <div class="scega-rejection-note">
                            <i class="fa-solid fa-comment"></i> ${truncated}
                            <button class="btn btn-sm" style="padding: 1px 6px; font-size: 0.65rem; margin-left: 4px; background: #c62828; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="showFullRejectionReason('${encodeURIComponent(evt.rejectionReason)}')">
                                <i class="fa-solid fa-eye"></i> <span>${t('common.view')}</span>
                            </button>
                        </div>
                    `;
                }
            }

            // Single Manage button — edit & delete accessed inside the manage view
            const actionButtons = `
                <button class="btn btn-sm btn-primary manage-btn" data-id="${evt.id}"><i class="fa-solid fa-sliders"></i> <span>${t('org.manage.manage')}</span></button>
            `;

            return `
                <div class="event-list-item" style="display: grid; grid-template-columns: 80px 1fr 140px 120px; align-items: center; gap: 1.5rem;">
                    <!-- Date Column -->
                    <div class="event-date-box">
                        <span class="date-month">${month}</span>
                        <span class="date-day">${day}</span>
                    </div>
                    
                    <!-- Event Info Column -->
                    <div class="event-details-text">
                        <h4 style="margin: 0 0 0.25rem 0;">${evt.title} ${eventStateBadge}</h4>
                        <div class="event-meta-info" style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--text-muted);">
                            <span><i class="fa-regular fa-clock"></i> ${evt.time}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
                            <span><i class="fa-solid fa-ticket"></i> ${priceDisplay}</span>
                        </div>
                    </div>
                    
                    <!-- SCEGA Approval Status Column -->
                    <div class="scega-status-column" style="text-align: center; min-width: 120px;">
                        <div style="background: ${scegaStatusBg}; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid ${scegaStatusColor}20;">
                            <i class="fa-solid ${scegaStatusIcon}" style="font-size: 1.25rem; color: ${scegaStatusColor}; display: block; margin-bottom: 0.25rem;"></i>
                            <span style="font-size: 0.75rem; font-weight: 600; color: ${scegaStatusColor};">${scegaStatusText}</span>
                            ${rejectionInfo}
                        </div>
                    </div>
                    
                    <!-- Actions Column -->
                    <div class="event-actions" style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${actionButtons}
                    </div>
                </div>
            `;
        }

        function updateStats() {
            const events = getEvents();
            const total = events.length;
            const upcoming = events.filter(e => e.status === 'Upcoming').length;
            const pending = events.filter(e => e.status === 'Pending').length;

            // Safe Update
            const totalEl = document.getElementById('stat-total-events');
            if (totalEl) totalEl.textContent = total;

            const upcomingEl = document.getElementById('stat-upcoming');
            if (upcomingEl) upcomingEl.textContent = upcoming;

            const pendingEl = document.getElementById('stat-pending');
            if (pendingEl) pendingEl.textContent = pending;
        }

        // Filter Change Listener
        const filterSelect = document.getElementById('event-filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                renderEvents();
            });
        }

        // Initial Load
        renderEvents();
        updateStats();

        // Make functions global for inline onclicks if needed
        window.deleteEvent = deleteEvent;

        // --- REQUESTS LOGIC ---
        function invitationStatusLabel(status) {
            return status === 'Approved' ? 'Confirmed' : status;
        }

        function getRequests() { return API_DATA.outgoingRequests || []; }

        function populateRequestEventFilters() {
            const events = getEvents();
            const outgoingSelect = document.getElementById('request-event-filter');
            const incomingSelect = document.getElementById('incoming-event-filter');
            const optionHtml = `<option value="all">${t('common.allEvents')}</option>` + (events || []).map(e => `<option value="${e.id}">${e.title}</option>`).join('');
            if (outgoingSelect) outgoingSelect.innerHTML = optionHtml;
            if (incomingSelect) incomingSelect.innerHTML = optionHtml;
        }

        function renderRequests() {
            const requests = getRequests();
            const vendors = getVendors();
            const events = getEvents();
            const container = document.getElementById('outgoing-requests-tables');
            const noMsg = document.getElementById('no-requests-msg');
            const statusFilter = document.getElementById('request-status-filter');
            const eventFilter = document.getElementById('request-event-filter');
            const countLabel = document.getElementById('outgoing-count');

            if (!container) return;

            let filtered = requests;
            if (statusFilter && statusFilter.value !== 'all') filtered = filtered.filter(r => r.status === statusFilter.value);

            // Group by eventId
            const byEvent = {};
            filtered.forEach(r => {
                const eid = r.eventId || 'unknown';
                if (!byEvent[eid]) byEvent[eid] = [];
                byEvent[eid].push(r);
            });

            // If one event selected, only that event
            const eventIds = eventFilter && eventFilter.value !== 'all' ? [eventFilter.value] : Object.keys(byEvent);

            if (countLabel) countLabel.textContent = filtered.length ? formatOrganizerRequestCount(filtered.length) : '';

            if (filtered.length === 0 || eventIds.length === 0) {
                container.innerHTML = '';
                if (noMsg) noMsg.style.display = 'block';
                return;
            }

            if (noMsg) noMsg.style.display = 'none';

            // Sort event IDs by event title
            const eventList = eventIds.map(eid => ({ id: eid, evt: events.find(e => e.id === eid) || { title: t('org.requests.unlinkedEvent') } }));
            eventList.sort((a, b) => (a.evt.title || '').localeCompare(b.evt.title || ''));

            container.innerHTML = eventList.map(({ id: eventId, evt }) => {
                const rows = (byEvent[eventId] || []).sort((a, b) => new Date(b.dateSent) - new Date(a.dateSent));
                const rowsHtml = rows.map(req => {
                    const vendor = vendors.find(v => v.id === req.vendorId) || { name: 'Unknown Vendor', category: 'N/A' };
                    let statusClass = 'status-pending';
                    let statusIcon = '<i class="fa-solid fa-clock"></i>';
                    if (req.status === 'Approved') { statusClass = 'status-approved'; statusIcon = '<i class="fa-solid fa-check-circle"></i>'; }
                    else if (req.status === 'Rejected') { statusClass = 'status-rejected'; statusIcon = '<i class="fa-solid fa-circle-xmark"></i>'; }
                    return `
                        <tr>
                            <td>
                                <div class="req-table-vendor">
                                    <span class="req-table-vendor-name">${vendor.name}</span>
                                    <span class="req-table-vendor-cat">${translateServiceTypeLabel(vendor.category)}</span>
                                </div>
                            </td>
                            <td><span class="status-badge ${statusClass}">${statusIcon} ${statusKey(invitationStatusLabel(req.status))}</span></td>
                            <td class="req-table-details-cell">
                                <div class="req-table-details-wrap">
                                <button type="button" class="btn btn-sm btn-outline req-btn-view" onclick="openRequestDetailModal('${req.id}', 'outgoing')">
                                    <i class="fa-solid fa-eye"></i> <span>${t('common.view')}</span>
                                </button>
                                </div>
                            </td>
                        </tr>`;
                }).join('');

                return `
                    <div class="req-event-block">
                        <h3 class="req-event-header"><i class="fa-solid fa-calendar-days"></i> ${evt.title}</h3>
                        <div class="table-container">
                            <table class="data-table req-table">
                                <thead>
                                    <tr>
                                        <th class="req-th-vendor">${t('common.vendor')}</th>
                                        <th class="req-th-status">${t('common.status')}</th>
                                        <th class="req-th-details">${t('common.details')}</th>
                                    </tr>
                                </thead>
                                <tbody>${rowsHtml}</tbody>
                            </table>
                        </div>
                    </div>`;
            }).join('');
        }

        // Request Modal Logic
        const requestModal = document.getElementById('request-modal');
        const closeModalBtns = document.querySelectorAll('.close-modal-btn');
        const requestForm = document.getElementById('send-request-form');

        function openRequestModal(vendorId, vendorName) {
            if (!requestModal) return;

            document.getElementById('request-vendor-id').value = vendorId;
            document.getElementById('modal-vendor-name').textContent = vendorName;

            const eventSelect = document.getElementById('request-event-select');
            const events = getEvents().filter(e => e.status === 'Upcoming' || e.status === 'Ongoing');

            eventSelect.innerHTML = `<option value="" disabled selected>${t('org.requests.chooseEvent')}</option>`;
            events.forEach(evt => {
                const option = document.createElement('option');
                option.value = evt.id;
                option.textContent = evt.title;
                eventSelect.appendChild(option);
            });

            requestModal.classList.remove('hidden');
        }

        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (requestModal) requestModal.classList.add('hidden');
            });
        });

        if (requestForm) {
            requestForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const vendorId = document.getElementById('request-vendor-id').value;
                const eventId = document.getElementById('request-event-select').value;
                const message = document.getElementById('request-message').value;

                const formData = new URLSearchParams();
                formData.append('create_request', 'true');
                formData.append('vendor_id', vendorId);
                formData.append('event_id', eventId);
                formData.append('message', message);

                try {
                    const response = await fetch('/dashboard/organizer/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-CSRFToken': window.CSRF_TOKEN
                        },
                        credentials: 'same-origin',
                        body: formData.toString()
                    });

                    if (response.ok || response.redirected) {
                        showToast(t('org.requests.sentSuccess'));
                        if (requestModal) requestModal.classList.add('hidden');
                        requestForm.reset();
                        await initData();
                        renderRequests();
                    } else {
                        throw new Error('Failed');
                    }
                } catch (err) {
                    showToast(t('org.error.sendingRequest'));
                }
            });
        }

        // Incoming Requests Functions
        function getIncomingRequests() { return API_DATA.incomingRequests || []; }

        function renderIncomingRequests() {
            const requests = getIncomingRequests();
            const events = getEvents();
            const container = document.getElementById('incoming-requests-tables');
            const noMsg = document.getElementById('no-incoming-requests-msg');
            const statusFilter = document.getElementById('incoming-status-filter');
            const eventFilter = document.getElementById('incoming-event-filter');
            const badge = document.getElementById('incoming-badge');
            const countLabel = document.getElementById('incoming-count');

            if (!container) return;

            const pendingCount = requests.filter(r => r.status === 'Pending').length;
            if (badge) {
                badge.textContent = pendingCount;
                badge.style.display = pendingCount > 0 ? 'inline' : 'none';
            }

            let filtered = requests;
            if (statusFilter && statusFilter.value !== 'all') filtered = filtered.filter(r => r.status === statusFilter.value);

            const byEvent = {};
            filtered.forEach(r => {
                const eid = r.eventId || 'unknown';
                if (!byEvent[eid]) byEvent[eid] = [];
                byEvent[eid].push(r);
            });

            const eventIds = eventFilter && eventFilter.value !== 'all' ? [eventFilter.value] : Object.keys(byEvent);

            if (countLabel) countLabel.textContent = filtered.length ? formatOrganizerRequestCount(filtered.length) : '';

            if (filtered.length === 0 || eventIds.length === 0) {
                container.innerHTML = '';
                if (noMsg) noMsg.style.display = 'block';
                return;
            }

            if (noMsg) noMsg.style.display = 'none';

            const eventList = eventIds.map(eid => ({ id: eid, evt: events.find(e => e.id === eid) || { title: t('org.requests.unknownEvent') } }));
            eventList.sort((a, b) => (a.evt.title || '').localeCompare(b.evt.title || ''));

            container.innerHTML = eventList.map(({ id: eventId, evt }) => {
                const rows = (byEvent[eventId] || []).sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived));
                const rowsHtml = rows.map(req => {
                    let statusClass = 'status-pending';
                    let statusIcon = '<i class="fa-solid fa-clock"></i>';
                    if (req.status === 'Approved') { statusClass = 'status-approved'; statusIcon = '<i class="fa-solid fa-check-circle"></i>'; }
                    else if (req.status === 'Rejected') { statusClass = 'status-rejected'; statusIcon = '<i class="fa-solid fa-circle-xmark"></i>'; }
                    const isPending = req.status === 'Pending';
                    const actionsHtml = isPending
                        ? `
                            <button type="button" class="btn btn-sm btn-success" onclick="handleIncomingRequest('${req.id}', 'approve')"><i class="fa-solid fa-check"></i> ${t('common.approve')}</button>
                            <button type="button" class="btn btn-sm btn-danger" onclick="handleIncomingRequest('${req.id}', 'reject')"><i class="fa-solid fa-xmark"></i> ${t('common.reject')}</button>
                        `
                        : '<span class="req-table-no-action">—</span>';
                    return `
                        <tr>
                            <td>
                                <div class="req-table-vendor">
                                    <span class="req-table-vendor-name">${req.vendorName}</span>
                                    <span class="req-table-vendor-cat">${req.vendorEmail || '—'}</span>
                                </div>
                            </td>
                            <td><span class="status-badge ${statusClass}">${statusIcon} ${statusKey(req.status)}</span></td>
                            <td class="req-table-details-cell">
                                <div class="req-table-details-wrap">
                                <button type="button" class="btn btn-sm btn-outline req-btn-view" onclick="openRequestDetailModal('${req.id}', 'incoming')">
                                    <i class="fa-solid fa-eye"></i> <span>${t('common.view')}</span>
                                </button>
                                </div>
                            </td>
                            <td class="req-table-actions-cell"><div class="req-table-actions-wrap">${actionsHtml}</div></td>
                        </tr>`;
                }).join('');

                return `
                    <div class="req-event-block">
                        <h3 class="req-event-header"><i class="fa-solid fa-calendar-days"></i> ${evt.title}</h3>
                        <div class="table-container">
                            <table class="data-table req-table">
                                <thead>
                                    <tr>
                                        <th class="req-th-vendor">${t('common.vendor')}</th>
                                        <th class="req-th-status">${t('common.status')}</th>
                                        <th class="req-th-details">${t('common.details')}</th>
                                        <th class="req-th-actions">${t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>${rowsHtml}</tbody>
                            </table>
                        </div>
                    </div>`;
            }).join('');
        }

        window.openRequestDetailModal = function (requestId, type) {
            const modal = document.getElementById('request-detail-modal');
            if (!modal) return;

            modal.dataset.requestId = requestId;
            modal.dataset.requestType = type;

            const events = getEvents();
            const titleEl = document.getElementById('request-detail-modal-title');
            const eventTitleEl = document.getElementById('request-detail-event-title');
            const categoryEl = document.getElementById('request-detail-event-category');
            const vendorWrap = document.getElementById('request-detail-vendor-wrap');
            const chipsEl = document.getElementById('request-detail-chips');
            const messageLabelEl = document.getElementById('request-detail-message-label');
            const messageEl = document.getElementById('request-detail-message');
            const rejectionWrap = document.getElementById('request-detail-rejection-wrap');
            const rejectionEl = document.getElementById('request-detail-rejection');
            const statusEl = document.getElementById('request-detail-status');

            const localeLang = localStorage.getItem('eventia_lang') || 'en';
            const dateLocale = localeLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

            if (vendorWrap) vendorWrap.style.display = 'none';
            const attachmentWrapEl = document.getElementById('request-detail-attachment-wrap');
            if (attachmentWrapEl) attachmentWrapEl.style.display = 'none';

            if (type === 'outgoing') {
                const requests = getRequests();
                const req = requests.find(r => r.id === requestId);
                if (!req) return;
                const evt = events.find(e => e.id === req.eventId) || {};
                const vendors = getVendors();
                const vendor = vendors.find(v => v.id === req.vendorId) || { name: 'Unknown Vendor' };

                titleEl.textContent = t('org.requests.requestDetails');
                eventTitleEl.textContent = evt.title || t('org.requests.unlinkedEvent');
                categoryEl.textContent = evt.category ? translateEventCategory(evt.category) : '';
                categoryEl.style.display = evt.category ? 'inline-block' : 'none';

                const sentDate = new Date(req.dateSent).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' });
                const eventDate = evt.date ? new Date(evt.date).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                const policyLabels = { 'flexible': t('policy.flexible'), 'moderate': t('policy.moderate'), 'strict': t('policy.strict'), 'non-refundable': t('policy.nonRefundable') };
                const policyColors = { 'flexible': '#2e7d32', 'moderate': '#ff9800', 'strict': '#e65100', 'non-refundable': '#c62828' };
                const pol = evt.withdrawalPolicy;
                const policyLabel = policyLabels[pol] || t('common.notSet');
                const policyColor = policyColors[pol] || '#666';

                chipsEl.innerHTML = `
                    <div class="req-chip"><i class="fa-regular fa-clock"></i><div class="req-chip-inner"><span class="req-chip-label">${t('org.requests.sent')}</span><span class="req-chip-value">${sentDate}</span></div></div>
                    <div class="req-chip"><i class="fa-solid fa-calendar-days"></i><div class="req-chip-inner"><span class="req-chip-label">${t('org.requests.eventDate')}</span><span class="req-chip-value">${eventDate}</span></div></div>
                    <div class="req-chip"><i class="fa-solid fa-location-dot"></i><div class="req-chip-inner"><span class="req-chip-label">${t('common.location')}</span><span class="req-chip-value">${evt.location || '—'}</span></div></div>
                    ${pol ? `<div class="req-chip"><i class="fa-solid fa-shield-halved" style="color: ${policyColor}"></i><div class="req-chip-inner"><span class="req-chip-label">${t('org.policy.vendorLabelPlain')}</span><span class="req-chip-value" style="color: ${policyColor}; font-weight: 600;">${policyLabel}</span></div></div>` : ''}
                `;

                messageLabelEl.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> <span dir="auto">' + t('org.requests.yourInvitation') + '</span>';
                messageEl.textContent = req.message || '—';

                if (req.status === 'Rejected' && (req.rejectionReason || '').trim()) {
                    rejectionWrap.style.display = 'block';
                    rejectionEl.textContent = req.rejectionReason;
                } else {
                    rejectionWrap.style.display = 'none';
                }

                let statusClass = 'status-pending';
                let statusIcon = '<i class="fa-solid fa-clock"></i>';
                if (req.status === 'Approved') { statusClass = 'status-approved'; statusIcon = '<i class="fa-solid fa-check-circle"></i>'; }
                else if (req.status === 'Rejected') { statusClass = 'status-rejected'; statusIcon = '<i class="fa-solid fa-circle-xmark"></i>'; }
                statusEl.className = 'status-badge ' + statusClass;
                statusEl.innerHTML = statusIcon + ' ' + statusKey(invitationStatusLabel(req.status));
            } else {
                const requests = getIncomingRequests();
                const req = requests.find(r => r.id === requestId);
                if (!req) return;
                const evt = events.find(e => e.id === req.eventId) || {};

                titleEl.textContent = t('org.requests.applicationDetails');
                eventTitleEl.textContent = evt.title || t('org.requests.unknownEvent');
                categoryEl.textContent = evt.category ? translateEventCategory(evt.category) : '';
                categoryEl.style.display = evt.category ? 'inline-block' : 'none';

                if (vendorWrap) {
                    vendorWrap.style.display = 'block';
                    document.getElementById('request-detail-vendor-name').textContent = req.vendorName || '—';
                    document.getElementById('request-detail-vendor-email').textContent = req.vendorEmail || '—';
                    document.getElementById('request-detail-vendor-service').textContent = req.serviceType ? translateServiceTypeLabel(req.serviceType) : '—';
                }

                const receivedDate = new Date(req.dateReceived).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' });
                const eventDateIncoming = evt.date ? new Date(evt.date).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                chipsEl.innerHTML = `
                    <div class="req-chip"><i class="fa-regular fa-clock"></i><div class="req-chip-inner"><span class="req-chip-label">${t('org.requests.received')}</span><span class="req-chip-value">${receivedDate}</span></div></div>
                    <div class="req-chip"><i class="fa-solid fa-calendar-days"></i><div class="req-chip-inner"><span class="req-chip-label">${t('org.requests.eventDate')}</span><span class="req-chip-value">${eventDateIncoming}</span></div></div>
                    <div class="req-chip"><i class="fa-solid fa-location-dot"></i><div class="req-chip-inner"><span class="req-chip-label">${t('common.location')}</span><span class="req-chip-value">${evt.location || '—'}</span></div></div>
                `;

                messageLabelEl.innerHTML = '<i class="fa-solid fa-message" aria-hidden="true"></i> <span dir="auto">' + t('org.requests.vendorProposal') + '</span>';
                messageEl.textContent = req.message || '—';

                // Show vendor attachment if present (card layout with View / Download)
                const attachmentWrap = document.getElementById('request-detail-attachment-wrap');
                const attachmentNameEl = document.getElementById('request-detail-attachment-name');
                const attachmentView = document.getElementById('request-detail-attachment-view');
                const attachmentDownload = document.getElementById('request-detail-attachment-download');
                const attachmentIcon = document.getElementById('request-detail-attachment-icon');
                const attachmentIconWrap = document.getElementById('request-detail-attachment-icon-wrap');
                if (attachmentWrap && attachmentNameEl && attachmentView && attachmentDownload && attachmentIcon && attachmentIconWrap) {
                    if (req.attachmentFileName && req.attachmentData) {
                        attachmentWrap.style.display = 'block';
                        attachmentNameEl.textContent = req.attachmentFileName;
                        const mime = (req.attachmentMimeType || 'application/octet-stream').toLowerCase();
                        const dataUrl = 'data:' + (req.attachmentMimeType || 'application/octet-stream') + ';base64,' + req.attachmentData;
                        attachmentView.href = dataUrl;
                        attachmentDownload.href = dataUrl;
                        attachmentDownload.download = req.attachmentFileName;
                        var ext = (req.attachmentFileName || '').split('.').pop().toLowerCase();
                        var isPdf = mime.indexOf('pdf') !== -1 || ext === 'pdf';
                        var isWord = mime.indexOf('word') !== -1 || mime.indexOf('document') !== -1 || ['doc', 'docx'].indexOf(ext) !== -1;
                        var isImage = mime.indexOf('image') !== -1 || ['jpg', 'jpeg', 'png', 'gif', 'webp'].indexOf(ext) !== -1;
                        attachmentIcon.className = 'fa-solid ' + (isPdf ? 'fa-file-pdf' : isWord ? 'fa-file-word' : isImage ? 'fa-file-image' : 'fa-file-lines');
                        attachmentIconWrap.className = 'req-detail-attachment-icon-wrap' + (isPdf ? ' req-detail-attachment-icon-pdf' : isWord ? ' req-detail-attachment-icon-word' : isImage ? ' req-detail-attachment-icon-image' : '');
                    } else {
                        attachmentWrap.style.display = 'none';
                    }
                }

                rejectionWrap.style.display = 'none';

                let statusClass = 'status-pending';
                let statusIcon = '<i class="fa-solid fa-clock"></i>';
                if (req.status === 'Approved') { statusClass = 'status-approved'; statusIcon = '<i class="fa-solid fa-check-circle"></i>'; }
                else if (req.status === 'Rejected') { statusClass = 'status-rejected'; statusIcon = '<i class="fa-solid fa-circle-xmark"></i>'; }
                statusEl.className = 'status-badge ' + statusClass;
                statusEl.innerHTML = statusIcon + ' ' + statusKey(req.status);
            }

            modal.classList.remove('hidden');
        };

        window.closeRequestDetailModal = function () {
            const modal = document.getElementById('request-detail-modal');
            if (modal) modal.classList.add('hidden');
        };

        // Handle incoming request approval/rejection
        // Rejection Modal Logic
        let currentRejectionId = null;

        window.openRejectionModal = function (requestId) {
            currentRejectionId = requestId;
            const modal = document.getElementById('rejection-modal');
            if (modal) {
                modal.style.display = 'flex';
                document.getElementById('rejection-reason').value = '';
            }
        };

        window.closeRejectionModal = function () {
            currentRejectionId = null;
            const modal = document.getElementById('rejection-modal');
            if (modal) modal.style.display = 'none';
        };

        window.confirmRejection = async function () {
            if (!currentRejectionId) return;
            try {
                const response = await fetch('/dashboard/organizer/reject_request/' + currentRejectionId + '/', {
                    method: 'POST',
                    headers: { 'X-CSRFToken': window.CSRF_TOKEN },
                    credentials: 'same-origin'
                });
                if (response.ok || response.redirected) {
                    await initData();
                    renderIncomingRequests();
                    showToast(t('org.requests.rejectedSuccess'));
                    closeRejectionModal();
                } else {
                    showToast(t('org.error.rejectingRequest'));
                }
            } catch (err) {
                showToast(t('org.error.rejectingRequest'));
            }
        };

        // Handle incoming request approval
        window.handleIncomingRequest = async function (requestId, action) {
            if (action === 'reject') {
                openRejectionModal(requestId);
                return;
            }

            if (action === 'approve') {
                try {
                    const response = await fetch('/dashboard/organizer/accept_request/' + requestId + '/', {
                        method: 'POST',
                        headers: { 'X-CSRFToken': window.CSRF_TOKEN },
                        credentials: 'same-origin'
                    });
                    if (response.ok || response.redirected) {
                        await initData();
                        renderIncomingRequests();
                        showToast(t('org.requests.approvedSuccess'));
                    } else {
                        showToast(t('org.error.approvingRequest'));
                    }
                } catch (err) {
                    showToast(t('org.error.approvingRequest'));
                }
            }
        };

        // Tab switching for Requests page
        const requestTabs = document.querySelectorAll('.request-tab');
        requestTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Reset all tabs to inactive (white card with border)
                requestTabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.border = '2px solid #e0e0e0';
                    t.style.background = 'white';
                    t.style.boxShadow = 'none';
                    // Reset icon container and text
                    const iconContainer = t.querySelector('div:first-child');
                    if (iconContainer) {
                        iconContainer.style.background = 'linear-gradient(135deg, #f0f4f8, #e3e8ed)';
                        const icon = iconContainer.querySelector('i');
                        if (icon) icon.style.color = '#1565c0';
                    }
                    // Reset text colors
                    const textContainer = t.querySelector('div:nth-child(2)');
                    if (textContainer) {
                        const title = textContainer.querySelector('div:first-child');
                        const subtitle = textContainer.querySelector('div:last-child');
                        if (title) title.style.color = '#333';
                        if (subtitle) subtitle.style.color = '#666';
                    }
                });

                // Style active tab (blue gradient)
                tab.classList.add('active');
                tab.style.border = '2px solid transparent';
                tab.style.background = 'linear-gradient(135deg, #1565c0, #0d47a1)';
                tab.style.boxShadow = '0 4px 15px rgba(21, 101, 192, 0.3)';
                // Style active icon container
                const activeIconContainer = tab.querySelector('div:first-child');
                if (activeIconContainer) {
                    activeIconContainer.style.background = 'rgba(255,255,255,0.2)';
                    const activeIcon = activeIconContainer.querySelector('i');
                    if (activeIcon) activeIcon.style.color = 'white';
                }
                // Style active text colors
                const activeTextContainer = tab.querySelector('div:nth-child(2)');
                if (activeTextContainer) {
                    const title = activeTextContainer.querySelector('div:first-child');
                    const subtitle = activeTextContainer.querySelector('div:last-child');
                    if (title) title.style.color = 'white';
                    if (subtitle) subtitle.style.color = 'rgba(255,255,255,0.8)';
                }

                // Show correct section
                const outgoingSection = document.getElementById('outgoing-requests-section');
                const incomingSection = document.getElementById('incoming-requests-section');

                if (tab.dataset.tab === 'outgoing') {
                    if (outgoingSection) outgoingSection.style.display = 'block';
                    if (incomingSection) incomingSection.style.display = 'none';
                    renderRequests();
                } else {
                    if (outgoingSection) outgoingSection.style.display = 'none';
                    if (incomingSection) incomingSection.style.display = 'block';
                    renderIncomingRequests();
                }
            });
        });

        // Listeners for Request View
        const reqStatusFilter = document.getElementById('request-status-filter');
        if (reqStatusFilter) reqStatusFilter.addEventListener('change', renderRequests);

        const reqEventFilter = document.getElementById('request-event-filter');
        if (reqEventFilter) reqEventFilter.addEventListener('change', renderRequests);

        const incomingStatusFilter = document.getElementById('incoming-status-filter');
        if (incomingStatusFilter) incomingStatusFilter.addEventListener('change', renderIncomingRequests);

        const incomingEventFilter = document.getElementById('incoming-event-filter');
        if (incomingEventFilter) incomingEventFilter.addEventListener('change', renderIncomingRequests);

        // Update SwitchView to handle requests
        const originalSwitchView = window.switchView;
        window.switchView = function (viewId) {
            currentView = viewId;

            // Update Sidebar Active State
            sidebarItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.view === viewId) {
                    item.classList.add('active');
                }
            });

            // Show Target Section
            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === `view-${viewId}`) {
                    sec.classList.add('active');
                }
            });

            applyOrganizerPageTitle(viewId);

            // Close sidebar on mobile
            if (window.innerWidth < 992) {
                closeSidebar();
            }

            // Data Refresh
            if (viewId === 'overview' || viewId === 'events-list') {
                renderEvents();
                updateStats();
            } else if (viewId === 'vendors') {
                renderVendors();
            } else if (viewId === 'requests') {
                if (typeof populateRequestEventFilters === 'function') populateRequestEventFilters();
                renderRequests();
                renderIncomingRequests();
            } else if (viewId === 'analytics') {
                if (typeof window.renderAnalytics === 'function') window.renderAnalytics();
            } else if (viewId === 'event-manage') {
                // Data is loaded by openEventManage before switching
            }
        };

        // Message Modal Logic
        window.openMessageModal = function (message) {
            const modal = document.getElementById('message-modal');
            const content = document.getElementById('full-message-content');
            if (modal && content) {
                content.textContent = message;
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
            }
        };

        window.closeMessageModal = function () {
            const modal = document.getElementById('message-modal');
            if (modal) {
                modal.classList.add('hidden');
                setTimeout(() => { modal.style.display = 'none'; }, 300);
            }
        };

        const messageModal = document.getElementById('message-modal');
        if (messageModal) {
            messageModal.addEventListener('click', (e) => {
                if (e.target === messageModal) closeMessageModal();
            });
        }

        const requestDetailModal = document.getElementById('request-detail-modal');
        if (requestDetailModal) {
            requestDetailModal.addEventListener('click', (e) => {
                if (e.target === requestDetailModal) closeRequestDetailModal();
            });
        }

        // ===================================================================
        // EVENT MANAGEMENT MODULE
        // ===================================================================
        let currentManagedEventId = null;

        function getEventVendors() { return API_DATA.eventVendors || []; }
        function getMessages() { return API_DATA.messages || []; }
        function getBroadcasts() { return API_DATA.broadcasts || []; }

        // --- Open Event Management ---
        window.openEventManage = function (eventId) {
            const events = getEvents();
            const evt = events.find(e => e.id === eventId);
            if (!evt) return;

            currentManagedEventId = eventId;
            window._currentEventManageId = eventId;

            // Populate Header
            document.getElementById('em-event-title').textContent = evt.title;

            // State badge
            const todayStr = new Date().toISOString().split('T')[0];
            let stateTxt, stateColor, stateBg;
            if (evt.date === todayStr) { stateTxt = t('status.ongoing'); stateColor = '#2e7d32'; stateBg = 'rgba(46,125,50,0.2)'; }
            else if (evt.date > todayStr) { stateTxt = t('status.upcoming'); stateColor = '#7b1fa2'; stateBg = 'rgba(123,31,162,0.2)'; }
            else { stateTxt = t('status.past'); stateColor = '#757575'; stateBg = 'rgba(117,117,117,0.2)'; }
            const stateBadge = document.getElementById('em-event-state-badge');
            stateBadge.textContent = stateTxt;
            stateBadge.style.background = stateBg;
            stateBadge.style.color = stateColor;

            // SCEGA badge — use scegaStatus (PENDING/APPROVED/REJECTED) not temporal status
            let scegaTxt, scegaColor, scegaBg;
            if (evt.scegaStatus === 'PENDING') { scegaTxt = `⏳ ${t('status.pendingApproval')}`; scegaColor = '#e65100'; scegaBg = 'rgba(255,152,0,0.2)'; }
            else if (evt.scegaStatus === 'REJECTED') { scegaTxt = `❌ ${t('status.rejected')}`; scegaColor = '#c62828'; scegaBg = 'rgba(198,40,40,0.2)'; }
            else { scegaTxt = `✅ ${t('org.scegaApproved')}`; scegaColor = '#2e7d32'; scegaBg = 'rgba(46,125,50,0.2)'; }
            const scegaBadge = document.getElementById('em-scega-badge');
            scegaBadge.textContent = scegaTxt;
            scegaBadge.style.background = scegaBg;
            scegaBadge.style.color = scegaColor;

            // Stats
            const evVendors = getEventVendors().filter(v => v.eventId === eventId);
            document.getElementById('em-stat-vendors').textContent = evVendors.length;
            document.getElementById('em-stat-pending-vendors').textContent = evVendors.filter(v => v.status === 'Pending').length;
            document.getElementById('em-stat-attendees').textContent = evt.attendees || 0;

            // Countdown
            const diffMs = new Date(evt.date) - new Date(todayStr);
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const countdownEl = document.getElementById('em-stat-countdown');
            if (diffDays > 0) countdownEl.textContent = diffDays;
            else if (diffDays === 0) countdownEl.textContent = t('common.today');
            else countdownEl.textContent = t('common.ended');

            // Overview tab data
            document.getElementById('em-ov-title').textContent = evt.title;
            document.getElementById('em-ov-category').textContent = evt.category ? (t(`cat.${evt.category.toLowerCase()}`) || evt.category) : '';
            document.getElementById('em-ov-description').textContent = evt.description;
            const ovLang = localStorage.getItem('eventia_lang') || 'en';
            const ovLocale = ovLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

            const dateFormatted = new Date(evt.date).toLocaleDateString(ovLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('em-ov-date').textContent = dateFormatted;
            document.getElementById('em-ov-time').textContent = evt.time;
            document.getElementById('em-ov-location').textContent = evt.location;

            // Tickets
            const ticketsEl = document.getElementById('em-ov-tickets');
            if (evt.tickets && evt.tickets.length > 0) {
                ticketsEl.innerHTML = '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">' +
                    evt.tickets.map(ticket => `
                        <div class="em-ticket-tier"><span class="tier-name">${ticket.name}</span>
                        <span class="tier-price">${ticket.price > 0 ? ticket.price + ' ' + SAR_ICON : t('common.free')}</span></div>`).join('') + '</div>';
            } else {
                ticketsEl.innerHTML = `<p style="color:#888;margin:0;">${t('org.em.noTicketTiers')}</p>`;
            }

            // Withdrawal Policies
            const policyMeta = {
                'flexible': { label: `✦ ${t('policy.flexible')}`, css: 'em-policy-flexible', desc: t('org.policy.vendor.flexibleDesc') },
                'moderate': { label: `✦ ${t('policy.moderate')}`, css: 'em-policy-moderate', desc: t('org.policy.vendor.moderateDesc') },
                'strict': { label: `✦ ${t('policy.strict')}`, css: 'em-policy-strict', desc: t('org.policy.vendor.strictDesc') },
                'non-refundable': { label: `✦ ${t('policy.nonRefundable')}`, css: 'em-policy-non-refundable', desc: t('org.policy.vendor.nonRefundableDesc') }
            };
            const attendeePolicyMeta = {
                'flexible': { label: `✦ ${t('policy.flexible')}`, css: 'em-policy-flexible', desc: t('org.policy.attendee.flexibleDesc') },
                'moderate': { label: `✦ ${t('policy.moderate')}`, css: 'em-policy-moderate', desc: t('org.policy.attendee.moderateDesc') },
                'strict': { label: `✦ ${t('policy.strict')}`, css: 'em-policy-strict', desc: t('org.policy.attendee.strictDesc') },
                'non-refundable': { label: `✦ ${t('policy.nonRefundable')}`, css: 'em-policy-non-refundable', desc: t('org.policy.attendee.nonRefundableDesc') }
            };

            const vendorBadgeEl = document.getElementById('em-ov-vendor-policy-badge');
            const vendorDescEl = document.getElementById('em-ov-vendor-policy-desc');
            const vendorPol = evt.withdrawalPolicy ? policyMeta[evt.withdrawalPolicy] : null;
            vendorBadgeEl.className = 'em-policy-badge ' + (vendorPol ? vendorPol.css : 'em-policy-none');
            vendorBadgeEl.textContent = vendorPol ? vendorPol.label : t('common.dashNotSet');
            vendorDescEl.textContent = vendorPol ? vendorPol.desc : t('org.policy.vendor.notConfigured');

            const attendeeBadgeEl = document.getElementById('em-ov-attendee-policy-badge');
            const attendeeDescEl = document.getElementById('em-ov-attendee-policy-desc');
            const attendeePol = evt.attendeeWithdrawalPolicy ? attendeePolicyMeta[evt.attendeeWithdrawalPolicy] : null;
            attendeeBadgeEl.className = 'em-policy-badge ' + (attendeePol ? attendeePol.css : 'em-policy-none');
            attendeeBadgeEl.textContent = attendeePol ? attendeePol.label : t('common.dashNotSet');
            attendeeDescEl.textContent = attendeePol ? attendeePol.desc : t('org.policy.attendee.notConfigured');

            // Render sub-sections
            renderEventManageVendors(eventId);
            renderEventManageConversations(eventId);
            renderEventManageBroadcasts(eventId);

            // Setup action buttons
            document.getElementById('em-edit-btn').onclick = function () { openEditView(eventId); };
            document.getElementById('em-delete-btn').onclick = function () {
                if (confirm(t('org.em.deleteConfirm'))) {
                    deleteEvent(eventId);
                    switchView('events-list');
                    showToast(t('org.em.deleteSuccess'));
                }
            };

            // --- Inline description edit ---
            const descDisplayEl = document.getElementById('em-description-display');
            const descEditEl = document.getElementById('em-description-edit');
            const descTextEl = document.getElementById('em-ov-description');
            const descTextarea = document.getElementById('em-desc-textarea');
            const editDescBtn = document.getElementById('em-edit-desc-btn');
            const saveDescBtn = document.getElementById('em-save-desc-btn');
            const cancelDescBtn = document.getElementById('em-cancel-desc-btn');

            // Reset to display mode each time manage opens
            descDisplayEl.style.display = 'flex';
            descEditEl.style.display = 'none';

            editDescBtn.onclick = function () {
                descTextarea.value = descTextEl.textContent.trim();
                descDisplayEl.style.display = 'none';
                descEditEl.style.display = 'flex';
                descTextarea.focus();
            };

            cancelDescBtn.onclick = function () {
                descDisplayEl.style.display = 'flex';
                descEditEl.style.display = 'none';
            };

            saveDescBtn.onclick = async function () {
                const newDesc = descTextarea.value.trim();
                if (!newDesc) { showToast(t('org.em.descriptionEmpty')); return; }
                const evt = getEvents().find(e => e.id === eventId);
                if (!evt) return;

                const formData = new FormData();
                formData.append('event_id', eventId);
                formData.append('title', evt.title);
                formData.append('category', evt.category);
                formData.append('date', evt.date);
                formData.append('time', evt.time);
                formData.append('location', evt.location);
                formData.append('description', newDesc);
                formData.append('capacity', evt.capacity || '');
                formData.append('ticket_price', evt.price || 0);
                formData.append('withdrawal_policy', evt.withdrawalPolicy || '');
                formData.append('attendee_withdrawal_policy', evt.attendeeWithdrawalPolicy || '');

                try {
                    const response = await fetch('/dashboard/organizer/', {
                        method: 'POST',
                        headers: { 'X-CSRFToken': window.CSRF_TOKEN },
                        credentials: 'same-origin',
                        body: formData
                    });
                    if (response.ok || response.redirected) {
                        descTextEl.textContent = newDesc;
                        descDisplayEl.style.display = 'flex';
                        descEditEl.style.display = 'none';
                        showToast(t('org.em.descriptionUpdated'));
                        await initData();
                    } else {
                        showToast(t('org.error.updatingDescription'));
                    }
                } catch (err) {
                    showToast(t('org.error.updatingDescription'));
                }
            };

            // Reset to Overview tab
            document.querySelectorAll('.em-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.em-tab-content').forEach(tc => tc.classList.remove('active'));
            document.querySelector('.em-tab[data-emtab="overview"]').classList.add('active');
            document.getElementById('em-tab-overview').classList.add('active');

            // Reset comm sub-tabs
            document.querySelectorAll('.em-comm-subtab').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.em-comm-panel').forEach(p => p.classList.remove('active'));
            document.querySelector('.em-comm-subtab[data-commtab="vendor-msgs"]').classList.add('active');
            document.getElementById('em-comm-vendor-msgs').classList.add('active');

            switchView('event-manage');

            // Patch communication tab badge for this event
            setTimeout(() => { if (typeof window.patchAllUnreadBadges === 'function') window.patchAllUnreadBadges(); }, 0);
        };

        // --- Tab Switching ---
        document.querySelectorAll('.em-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.em-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.em-tab-content').forEach(tc => tc.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById('em-tab-' + tab.dataset.emtab).classList.add('active');
            });
        });

        // Communication sub-tabs
        document.querySelectorAll('.em-comm-subtab').forEach(st => {
            st.addEventListener('click', () => {
                document.querySelectorAll('.em-comm-subtab').forEach(s => s.classList.remove('active'));
                document.querySelectorAll('.em-comm-panel').forEach(p => p.classList.remove('active'));
                st.classList.add('active');
                document.getElementById('em-comm-' + st.dataset.commtab).classList.add('active');
            });
        });

        // --- Preparation Status Config ---
        const PREP_STATUSES = ['Pending', 'Preparing', 'In Transit', 'Setting Up', 'Ready'];
        const PREP_ICONS = {
            'Pending': 'fa-clock',
            'Preparing': 'fa-wrench',
            'In Transit': 'fa-truck',
            'Setting Up': 'fa-tools',
            'Ready': 'fa-check'
        };
        const PREP_COLORS = {
            'Pending': '#e65100',
            'Preparing': '#1565c0',
            'In Transit': '#7b1fa2',
            'Setting Up': '#ff8f00',
            'Ready': '#2e7d32'
        };
        function prepStatusLabel(key) {
            return t(prepKeyMap[key] || key);
        }

        // Helper: ensure vendor has preparation data
        function ensurePreparationData(ev) {
            if (!ev.preparationStatus) {
                ev.preparationStatus = 'Pending';
            }
            if (!ev.statusHistory) {
                ev.statusHistory = [{
                    status: 'Pending',
                    note: 'Vendor confirmed for the event.',
                    timestamp: new Date().toISOString(),
                    source: 'system'
                }];
            }
            return ev;
        }

        // --- Render Vendors for Event ---
        function renderEventManageVendors(eventId) {
            let evVendors = getEventVendors().filter(v => v.eventId === eventId);
            const allVendors = getVendors();
            const listEl = document.getElementById('em-vendors-list');
            const countEl = document.getElementById('em-vendors-count');

            countEl.textContent = evVendors.length + ' vendor' + (evVendors.length !== 1 ? 's' : '');

            if (evVendors.length === 0) {
                listEl.innerHTML = '<div class="em-empty-state"><i class="fa-solid fa-store-slash"></i><p>No vendors assigned yet. Invite vendors from the marketplace.</p></div>';
                return;
            }

            // Ensure all vendors have preparation data defaults
            evVendors.forEach(ev => { ensurePreparationData(ev); });

            listEl.innerHTML = evVendors.map(ev => {
                const vendor = allVendors.find(v => v.id === ev.vendorId) || { name: 'Unknown', category: 'N/A', image: 'fa-store' };
                const statusClass = ev.status.toLowerCase();
                const prepStatus = ev.preparationStatus || 'Pending';
                const isConfirmed = ev.status === 'Confirmed';

                // Build timeline stepper HTML for confirmed vendors
                let timelineHtml = '';
                if (isConfirmed) {
                    const currentIdx = PREP_STATUSES.indexOf(prepStatus);
                    const steps = PREP_STATUSES.map((s, i) => {
                        let stepClass = 'upcoming';
                        if (i < currentIdx) stepClass = 'completed';
                        else if (i === currentIdx) stepClass = (i === PREP_STATUSES.length - 1) ? 'completed' : 'active';
                        const icon = PREP_ICONS[s];
                        return `<div class="em-timeline-step ${stepClass}">
                            <div class="em-timeline-circle"><i class="fa-solid ${icon}"></i></div>
                            <span class="em-timeline-label">${prepStatusLabel(s)}</span>
                        </div>`;
                    }).join('');

                    // Connector lines
                    let connectors = '';
                    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
                    for (let i = 0; i < PREP_STATUSES.length - 1; i++) {
                        let connClass = 'upcoming';
                        if (i < currentIdx) connClass = 'completed';
                        else if (i === currentIdx) connClass = 'active';
                        // Position: each step is (100 / n)% wide, connector spans between centers
                        const stepW = 100 / PREP_STATUSES.length;
                        const offset = (stepW * i + stepW / 2);
                        const width = stepW;
                        const posAttr = isRtl ? `right:${offset}%` : `left:${offset}%`;
                        connectors += `<div class="em-timeline-connector ${connClass}" style="${posAttr};width:${width}%;"></div>`;
                    }

                    // Update requested badge
                    const updateBadge = ev.updateRequested
                        ? `<span class="em-update-requested-badge"><i class="fa-solid fa-bell"></i> ${t('org.em.updateRequested')}</span>`
                        : '';

                    // Latest vendor note
                    const history = ev.statusHistory || [];
                    const latestVendorEntry = [...history].reverse().find(h => h.source === 'vendor');
                    let latestNoteHtml = '';
                    if (latestVendorEntry && latestVendorEntry.note) {
                        const vnLang = localStorage.getItem('eventia_lang') || 'en';
                        const vnLocale = vnLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
                        const noteTime = new Date(latestVendorEntry.timestamp).toLocaleString(vnLocale, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        });
                        latestNoteHtml = `
                            <div style="margin-top: 0.65rem; padding: 0.6rem 0.85rem; background: #f5f7fa; border-radius: 10px; border-inline-start: 3px solid ${PREP_COLORS[latestVendorEntry.status]};">
                                <div style="display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.25rem;">
                                    <i class="fa-solid fa-quote-left" style="font-size: 0.6rem; color: ${PREP_COLORS[latestVendorEntry.status]};"></i>
                                    <span style="font-size: 0.7rem; font-weight: 700; color: ${PREP_COLORS[latestVendorEntry.status]};">${prepStatusLabel(latestVendorEntry.status)}</span>
                                    <span style="font-size: 0.65rem; color: #aaa; margin-left: auto;">${noteTime}</span>
                                </div>
                                <p style="margin: 0; font-size: 0.8rem; color: #555; line-height: 1.45;">${latestVendorEntry.note}</p>
                            </div>`;
                    }

                    timelineHtml = `
                        <div class="em-vendor-timeline-wrap">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-size: 0.72rem; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.03em;">${t('vendor.preparation')}</span>
                                    ${updateBadge}
                                </div>
                                <button class="em-view-timeline-btn" onclick="event.stopPropagation(); openVendorStatusModal('${eventId}', '${ev.vendorId}')">
                                    <i class="fa-solid fa-timeline"></i> ${t('common.viewDetails')}
                                </button>
                            </div>
                            <div class="em-vendor-timeline" style="position: relative;">
                                ${connectors}
                                ${steps}
                            </div>
                            ${latestNoteHtml}
                        </div>`;
                }

                // Request update button for confirmed vendors
                const requestUpdateBtn = isConfirmed
                    ? (ev.updateRequested
                        ? `<button class="em-request-update-btn requested" title="Update already requested"><i class="fa-solid fa-bell"></i> Requested</button>`
                        : `<button class="em-request-update-btn" onclick="requestVendorUpdate('${eventId}', '${ev.vendorId}')" title="Ask vendor to update their status"><i class="fa-solid fa-bell"></i> Request Update</button>`)
                    : '';

                return `
                    <div class="em-vendor-card">
                        <div class="em-vendor-avatar"><i class="fa-solid ${vendor.image || 'fa-store'}"></i></div>
                        <div class="em-vendor-info">
                            <h4>${vendor.name}</h4>
                            <span>${vendor.category} · ${vendor.location || 'N/A'}</span>
                        </div>
                        <span class="em-vendor-status ${statusClass}">${t(statusKeyMap[ev.status] || ev.status)}</span>
                        <div class="em-vendor-actions">
                            ${requestUpdateBtn}
                            <button class="btn btn-sm btn-outline" onclick="openVendorChat('${eventId}', '${ev.vendorId}')" title="Message"><i class="fa-solid fa-comment"></i></button>
                            <button class="btn btn-sm btn-outline" onclick="removeEventVendor('${eventId}', '${ev.vendorId}')" title="Remove" style="color:#c62828;border-color:#c62828;"><i class="fa-solid fa-user-minus"></i></button>
                        </div>
                        ${timelineHtml}
                    </div>`;
            }).join('');
        }

        // --- Remove Vendor ---
        window.removeEventVendor = async function (eventId, vendorId) {
            if (!confirm('Remove this vendor from the event?')) return;
            // Find the request for this event-vendor pair and reject it
            const allRequests = [...getRequests(), ...getIncomingRequests()];
            const req = allRequests.find(r => String(r.eventId) === String(eventId) && String(r.vendorId) === String(vendorId));
            if (req) {
                try {
                    await fetch('/dashboard/organizer/reject_request/' + req.id + '/', {
                        method: 'POST',
                        headers: { 'X-CSRFToken': window.CSRF_TOKEN },
                        credentials: 'same-origin'
                    });
                } catch (err) { /* fallthrough */ }
            }
            await initData();
            renderEventManageVendors(eventId);
            const remaining = getEventVendors().filter(v => v.eventId === eventId);
            document.getElementById('em-stat-vendors').textContent = remaining.length;
            document.getElementById('em-stat-pending-vendors').textContent = remaining.filter(v => v.status === 'Pending').length;
            showToast(t('org.em.vendorRemoved'));
        };

        // --- Request Vendor Update ---
        window.requestVendorUpdate = async function (eventId, vendorId) {
            try {
                const response = await fetch('/api/request_vendor_update/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': window.CSRF_TOKEN
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({ event_id: eventId, vendor_id: vendorId })
                });
                if (response.ok) {
                    await initData();
                    renderEventManageVendors(eventId);
                    showToast(t('org.em.updateRequestSent'));
                } else {
                    showToast(t('org.error.requestingUpdate'));
                }
            } catch (err) {
                showToast(t('org.error.requestingUpdate'));
            }
        };

        // --- Open Vendor Status Detail Modal ---
        window.openVendorStatusModal = function (eventId, vendorId) {
            window._emOpenStatusVendorId = vendorId;

            const evVendors = getEventVendors();
            const ev = evVendors.find(v => v.eventId === eventId && v.vendorId === vendorId);
            if (!ev) return;

            const allVendors = getVendors();
            const vendor = allVendors.find(v => v.id === vendorId) || { name: 'Unknown' };

            document.getElementById('em-status-modal-vendor-name').textContent = vendor.name + ' — ' + t('vendor.preparation');

            const bodyEl = document.getElementById('em-status-modal-body');
            const prepStatus = ev.preparationStatus || 'Pending';
            const currentIdx = PREP_STATUSES.indexOf(prepStatus);
            const history = ev.statusHistory || [];

            // Build vertical history timeline
            let historyHtml = '<div class="em-history-timeline">';
            PREP_STATUSES.forEach((status, i) => {
                let itemClass = 'upcoming';
                let dotClass = 'upcoming';
                if (i < currentIdx) { itemClass = 'completed'; dotClass = 'completed'; }
                else if (i === currentIdx) { itemClass = 'active'; dotClass = 'active'; }

                const icon = PREP_ICONS[status];
                const historyEntry = history.find(h => h.status === status);

                let noteHtml = '';
                let timeHtml = '';
                if (historyEntry) {
                    if (historyEntry.note) {
                        noteHtml = `<div class="em-history-note">${historyEntry.note}</div>`;
                    }
                    const histLang = localStorage.getItem('eventia_lang') || 'en';
                    const histLocale = histLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
                    const time = new Date(historyEntry.timestamp).toLocaleString(histLocale, {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    });
                    const source = historyEntry.source === 'vendor' ? t('vendor.history.updatedByVendor') : (historyEntry.source === 'system' ? 'System' : 'Updated');
                    timeHtml = `<div class="em-history-timestamp"><i class="fa-regular fa-clock"></i> ${time} · ${source}</div>`;
                } else if (itemClass === 'upcoming') {
                    noteHtml = `<div style="font-size: 0.78rem; color: #bbb; font-style: italic;">Awaiting this step</div>`;
                }

                historyHtml += `
                    <div class="em-history-item ${itemClass}">
                        <div class="em-history-dot ${dotClass}"><i class="fa-solid ${icon}"></i></div>
                        <div class="em-history-card">
                            <div class="em-history-status" style="color: ${PREP_COLORS[status]}">${prepStatusLabel(status)}</div>
                            ${noteHtml}
                            ${timeHtml}
                        </div>
                    </div>`;
            });
            historyHtml += '</div>';

            bodyEl.innerHTML = historyHtml;

            const modal = document.getElementById('em-status-modal');
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
        };

        // --- Close Vendor Status Modal ---
        window.closeVendorStatusModal = function () {
            delete window._emOpenStatusVendorId;

            const modal = document.getElementById('em-status-modal');
            modal.classList.add('hidden');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        };

        // Status modal backdrop close
        const statusModal = document.getElementById('em-status-modal');
        if (statusModal) {
            statusModal.addEventListener('click', (e) => {
                if (e.target === statusModal) closeVendorStatusModal();
            });
        }

        // --- Render Conversations ---
        function renderEventManageConversations(eventId) {
            const evVendors = getEventVendors().filter(v => v.eventId === eventId);
            const allVendors = getVendors();
            const allMessages = getMessages();
            const convEl = document.getElementById('em-vendor-conversations');

            if (evVendors.length === 0) {
                convEl.innerHTML = '<div class="em-empty-state"><i class="fa-solid fa-comments"></i><p>No vendor conversations yet.</p></div>';
                return;
            }

            convEl.innerHTML = evVendors.map(ev => {
                const vendor = allVendors.find(v => v.id === ev.vendorId) || { name: 'Unknown', category: 'N/A', image: 'fa-store' };
                const msgs = allMessages.filter(m => m.eventId === eventId && m.vendorId === ev.vendorId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
                const lastMsgText = lastMsg ? (lastMsg.sender === 'organizer' ? 'You: ' : '') + lastMsg.text : 'No messages yet';
                const convLang = localStorage.getItem('eventia_lang') || 'en';
                const convLocale = convLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
                const lastTime = lastMsg ? new Date(lastMsg.timestamp).toLocaleDateString(convLocale, { month: 'short', day: 'numeric' }) : '';
                const msgCount = msgs.filter(m => m.sender === 'vendor').length;

                return `
                    <div class="em-conversation-item" onclick="openVendorChat('${eventId}', '${ev.vendorId}')">
                        <div class="em-conv-avatar"><i class="fa-solid ${vendor.image || 'fa-store'}"></i></div>
                        <div class="em-conv-info">
                            <h4>${vendor.name}</h4>
                            <p>${lastMsgText}</p>
                        </div>
                        <div class="em-conv-meta">
                            <span class="em-conv-time">${lastTime}</span>
                            ${msgCount > 0 ? '<span class="em-conv-count">' + msgCount + '</span>' : ''}
                        </div>
                    </div>`;
            }).join('');
        }

        // ================================================================
        // UNREAD MESSAGE BADGE SYSTEM
        // Updates three surfaces:
        //   1. Sidebar "Events List" nav badge (total across all events)
        //   2. "Communication" tab badge (total for current managed event)
        //   3. Each event-list-item row badge (per-event unread count)
        // ================================================================

        /**
         * Compute unread vendor-sent messages for a given event,
         * respecting the chatReadTracker that lives in the HTML file's inline script.
         */
        function getUnreadCountForEvent(eventId) {
            const messages = getMessages();
            const eventVendors = getEventVendors().filter(v => v.eventId === eventId);
            const tracker = (typeof window._chatReadTracker === 'function')
                ? window._chatReadTracker()
                : (window.chatReadTracker || {});

            let total = 0;
            eventVendors.forEach(ev => {
                const trackKey = `${eventId}_${ev.vendorId}`;
                const lastRead = tracker[trackKey] || null;
                const vendorMsgs = messages.filter(
                    m => String(m.eventId) === String(eventId) &&
                         String(m.vendorId) === String(ev.vendorId) &&
                         m.sender === 'vendor'
                );
                if (lastRead) {
                    total += vendorMsgs.filter(m => new Date(m.timestamp) > new Date(lastRead)).length;
                } else {
                    total += vendorMsgs.length;
                }
            });
            return total;
        }

        /** Total unread across ALL events */
        function getTotalUnreadCount() {
            const events = getEvents();
            return events.reduce((sum, evt) => sum + getUnreadCountForEvent(evt.id), 0);
        }

        /**
         * Badge helper: set text + show/hide.
         * Animation only triggers on first appearance (wasHidden), never re-fires on every poll.
         */
        function _applyBadge(el, count) {
            if (!el) return;
            if (count <= 0) {
                el.style.display = 'none';
                el.classList.remove('badge-pulse');
                return;
            }
            const label = count > 99 ? '99+' : String(count);
            const wasHidden = el.style.display === 'none' || el.style.display === '';
            el.textContent = label;
            el.style.display = 'inline-flex';
            // Only add pulse class on first appearance — never reset animation mid-life
            if (wasHidden) {
                el.classList.add('badge-pulse');
            }
        }

        /**
         * Patch the "Communication" tab badge for the currently managed event.
         */
        function patchCommunicationTabBadge() {
            const badge = document.getElementById('em-comm-tab-badge');
            if (!badge || !currentManagedEventId) return;
            const count = getUnreadCountForEvent(currentManagedEventId);
            _applyBadge(badge, count);
        }

        /**
         * Patch the sidebar "Events List" nav item badge with total unread.
         */
        function patchNavEventsBadge() {
            const badge = document.getElementById('nav-events-unread-badge');
            _applyBadge(badge, getTotalUnreadCount());
        }

        /**
         * Patch per-event unread badges in the events list (#all-events-container).
         * Red circle badge sits on the top-right corner of the Manage button.
         * Animation is NEVER reset on poll — badge just sits still once created.
         */
        function patchEventListBadges() {
            const container = document.getElementById('all-events-container');
            if (!container) return;

            container.querySelectorAll('.event-list-item').forEach(item => {
                const manageBtn = item.querySelector('.manage-btn[data-id]');
                if (!manageBtn) return;
                const eventId = manageBtn.dataset.id;
                const count = getUnreadCountForEvent(eventId);

                // Ensure button is inside a position:relative wrapper
                let wrap = manageBtn.closest('.manage-btn-wrap');
                if (!wrap) {
                    wrap = document.createElement('div');
                    wrap.className = 'manage-btn-wrap';
                    manageBtn.parentNode.insertBefore(wrap, manageBtn);
                    wrap.appendChild(manageBtn);
                }

                // Find or create the corner badge
                let badge = wrap.querySelector('.manage-btn-badge');
                if (count > 0) {
                    const label = count > 99 ? '99+' : String(count);
                    if (!badge) {
                        // First appearance — create and let CSS pop-in animation run once
                        badge = document.createElement('span');
                        badge.className = 'manage-btn-badge';
                        badge.title = 'Unread vendor messages';
                        badge.textContent = label;
                        wrap.appendChild(badge);
                    } else {
                        // Already showing — just update the number, never touch animation
                        badge.textContent = label;
                        badge.style.display = 'flex';
                    }
                } else {
                    if (badge) badge.style.display = 'none';
                }
            });
        }

        /**
         * Master refresh — call this any time data or read-state changes.
         * Exposed globally so the background poller in the HTML can call it.
         */
        window.patchAllUnreadBadges = function() {
            patchNavEventsBadge();
            patchCommunicationTabBadge();
            patchEventListBadges();
        };

        // --- Vendor Chat ---
        let currentChatVendorId = null;
        let currentChatEventId = null;

        window.openVendorChat = function (eventId, vendorId) {
            currentChatEventId = eventId;
            currentChatVendorId = vendorId;
            const vendor = getVendors().find(v => v.id === vendorId) || { name: 'Unknown', category: 'N/A', image: 'fa-store' };

            document.getElementById('em-chat-vendor-name').textContent = vendor.name;
            document.getElementById('em-chat-vendor-cat').textContent = vendor.category;

            renderChatMessages(eventId, vendorId);

            const modal = document.getElementById('em-chat-modal');
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
        };

        window.closeVendorChat = function () {
            const modal = document.getElementById('em-chat-modal');
            modal.classList.add('hidden');
            setTimeout(() => { modal.style.display = 'none'; }, 300);
            // Refresh conversations list
            if (currentManagedEventId) renderEventManageConversations(currentManagedEventId);
            // Update all badge surfaces now that messages have been read
            setTimeout(() => { if (typeof window.patchAllUnreadBadges === 'function') window.patchAllUnreadBadges(); }, 50);
        };

        function renderChatMessages(eventId, vendorId) {
            const msgs = getMessages().filter(m => m.eventId === eventId && m.vendorId === vendorId).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            const body = document.getElementById('em-chat-body');

            if (msgs.length === 0) {
                body.innerHTML = '<div class="em-empty-state" style="margin:auto;"><i class="fa-solid fa-comments"></i><p>No messages yet. Start the conversation!</p></div>';
            } else {
                const chatLang = localStorage.getItem('eventia_lang') || 'en';
                const chatLocale = chatLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
                body.innerHTML = msgs.map(m => {
                    const cls = m.sender === 'organizer' ? 'sent' : 'received';
                    const time = new Date(m.timestamp).toLocaleString(chatLocale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    return `<div class="em-chat-msg ${cls}">${m.text}<span class="em-chat-msg-time">${time}</span></div>`;
                }).join('');
            }

            // Auto-scroll to bottom
            setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);
        }

        // Send Chat Message
        const chatSendBtn = document.getElementById('em-chat-send-btn');
        const chatInput = document.getElementById('em-chat-input');
        if (chatSendBtn && chatInput) {
            async function sendChatMessage() {
                const text = chatInput.value.trim();
                if (!text || !currentChatEventId || !currentChatVendorId) return;

                try {
                    const response = await fetch('/api/send_message/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': window.CSRF_TOKEN
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({
                            event_id: currentChatEventId,
                            vendor_id: currentChatVendorId,
                            sender: 'organizer',
                            text: text
                        })
                    });

                    if (response.ok) {
                        chatInput.value = '';
                        await initData();
                        renderChatMessages(currentChatEventId, currentChatVendorId);
                    } else {
                        showToast(t('org.error.sendingMessage'));
                    }
                } catch (err) {
                    showToast(t('org.error.sendingMessage'));
                }
            }

            chatSendBtn.addEventListener('click', sendChatMessage);
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); sendChatMessage(); }
            });
        }

        // Chat modal backdrop close
        const chatModal = document.getElementById('em-chat-modal');
        if (chatModal) {
            chatModal.addEventListener('click', (e) => {
                if (e.target === chatModal) closeVendorChat();
            });
        }

        // --- Broadcasts ---
        function renderEventManageBroadcasts(eventId) {
            const broadcasts = getBroadcasts().filter(b => b.eventId === eventId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const listEl = document.getElementById('em-broadcasts-list');

            if (broadcasts.length === 0) {
                listEl.innerHTML = '<div class="em-empty-state"><i class="fa-solid fa-bullhorn"></i><p>No broadcasts sent yet.</p></div>';
                return;
            }

            listEl.innerHTML = broadcasts.map(b => {
                const bcLang = localStorage.getItem('eventia_lang') || 'en';
                const bcLocale = bcLang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
                const time = new Date(b.timestamp).toLocaleString(bcLocale, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                return `
                    <div class="em-broadcast-item">
                        <div class="em-broadcast-item-header">
                            <span><i class="fa-solid fa-bullhorn"></i> Broadcast</span>
                            <span><i class="fa-regular fa-clock"></i> ${time}</span>
                        </div>
                        <p>${b.message}</p>
                    </div>`;
            }).join('');
        }

        // Send Broadcast
        const broadcastSendBtn = document.getElementById('em-send-broadcast-btn');
        const broadcastTextarea = document.getElementById('em-broadcast-text');
        if (broadcastSendBtn && broadcastTextarea) {
            broadcastSendBtn.addEventListener('click', async () => {
                const msg = broadcastTextarea.value.trim();
                if (!msg || !currentManagedEventId) return;

                try {
                    const response = await fetch('/api/send_broadcast/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': window.CSRF_TOKEN
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({ event_id: currentManagedEventId, message: msg })
                    });

                    if (response.ok) {
                        broadcastTextarea.value = '';
                        await initData();
                        renderEventManageBroadcasts(currentManagedEventId);
                        showToast(t('org.em.broadcastSent'));
                    } else {
                        showToast(t('org.error.sendingBroadcast'));
                    }
                } catch (err) {
                    showToast(t('org.error.sendingBroadcast'));
                }
            });
        }

        // --- Manage button handler in events list ---
        document.addEventListener('click', (e) => {
            const manageBtn = e.target.closest('.manage-btn');
            if (manageBtn) {
                const eventId = manageBtn.dataset.id;
                if (eventId) openEventManage(eventId);
            }
        });

        /* Re-run dynamic organisers views when language switches (applyLang in app-ar.js calls window.renderAll). */
        function renderAll() {
            renderEvents();
            updateStats();
            renderVendors();
            if (typeof populateRequestEventFilters === 'function') populateRequestEventFilters();
            renderRequests();
            renderIncomingRequests();

            if (typeof window.switchView === 'function') {
                window.switchView(currentView || 'overview');
            }

            if (currentManagedEventId) {
                openEventManage(currentManagedEventId);
            }

            const chatModal = document.getElementById('em-chat-modal');
            if (
                chatModal &&
                !chatModal.classList.contains('hidden') &&
                currentChatEventId &&
                currentChatVendorId
            ) {
                openVendorChat(currentChatEventId, currentChatVendorId);
            }

            const requestDetailModal = document.getElementById('request-detail-modal');
            if (requestDetailModal && !requestDetailModal.classList.contains('hidden')) {
                const requestId = requestDetailModal.dataset.requestId;
                const requestType = requestDetailModal.dataset.requestType;
                if (requestId && requestType) {
                    window.openRequestDetailModal(requestId, requestType);
                }
            }

            const statusModal = document.getElementById('em-status-modal');
            if (
                statusModal &&
                !statusModal.classList.contains('hidden') &&
                currentManagedEventId &&
                window._emOpenStatusVendorId
            ) {
                openVendorStatusModal(currentManagedEventId, window._emOpenStatusVendorId);
            }
        }
        window.renderAll = renderAll;
    }


});
