/**
 * VENDOR DASHBOARD LOGIC
 * All data comes from /api/vendor/data/ — zero localStorage usage.
 */

const SAR_ICON = '<img src="' + (window.STATIC_URL || '/static/') + 'assets/sar_symbol.svg" class="sar-icon" alt="SAR">';
const SAR_WHITE = '<img src="' + (window.STATIC_URL || '/static/') + 'assets/sar_white.svg" class="sar-icon" alt="SAR">';

function t(key) {
    const lang = localStorage.getItem('eventia_lang') || 'en';
    const dict = window.I18N && window.I18N[lang];
    if (dict && dict[key] != null && dict[key] !== '') return dict[key];
    const en = window.I18N && window.I18N.en;
    if (en && en[key] != null) return en[key];
    return key;
}

/** Icon + label row: correct icon edge for Latin/ambiguous text when the page is Arabic (RTL). */
function vendorDashboardMetaChip(iconClass, textChunk, rtl, iconExtraStyle) {
    const extra = iconExtraStyle ? '; ' + iconExtraStyle : '';
    const icon = `<i class="${iconClass}" style="flex-shrink: 0${extra}" aria-hidden="true"></i>`;
    const dir = rtl ? 'rtl' : 'ltr';
    return `<span class="vendor-dash-meta-chip" style="direction: ${dir};">${icon}<span dir="auto">${textChunk}</span></span>`;
}

function initVendorDashboard() {
    console.log("Initializing Vendor Dashboard...");

    // --- IN-MEMORY DATA STORE (populated from API) ---
    let API_DATA = {
        events: [],
        invitations: [],
        applications: [],
        eventVendors: [],
        messages: [],
        appliedEventIds: [],
        stats: { pendingInvites: 0, activeEvents: 0, completedEvents: 0 }
    };

    /** Raw category strings stored on events → i18n keys (never show DB text in UI). */
    const categoryMap = {
        // Catalogue / seeded event categories (canonical cat.* keys)
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

        // Extra organizer-facing labels
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

    function translateEventCategory(rawCategory) {
        const key = categoryMap[rawCategory];
        return key ? t(key) : t('cat.other');
    }

    const serviceTypeMap = {
        'Catering': 'common.catering',
        'Bakery & Desserts': 'common.bakeryDesserts',
        'Beverages': 'common.beverages',
        'Food Trucks': 'common.foodTrucks',
        'Venue': 'common.venue',
        'Conference Hall': 'common.conferenceHall',
        'Outdoor Venue': 'common.outdoorVenue',
        'AV Equipment': 'common.avEquipment',
        'Audio & Lighting': 'common.audioLighting',
        'LED Screens': 'common.ledScreens',
        'Stage & Rigging': 'common.stageRigging',
        'Live Streaming': 'common.liveStreaming',
        'Decoration': 'common.decoration',
        'Floral Design': 'common.floralDesign',
        'Balloon Decor': 'common.balloonDecor',
        'Event Lighting': 'common.eventLighting',
        'Photography': 'common.photography',
        'Aerial Photography': 'common.aerialPhotography',
        'Photo Booth': 'common.photoBooth',
        'DJ Services': 'common.dj',
        'Live Entertainment': 'common.liveEntertainment',
        'Kids Entertainment': 'common.kidsEntertainment',
        'Traditional Music': 'common.traditionalMusic',
        'Fireworks & Pyro': 'common.fireworks',
        'Transportation': 'common.transportation',
        'Shuttle Services': 'common.shuttle',
        'Valet Parking': 'common.valet',
        'Security': 'common.security',
        'VIP Security': 'common.vipSecurity',
        'Medical Services': 'common.medical',
        'Event Staff': 'common.eventStaff',
        'Translation': 'common.translation',
        'MC & Hosting': 'common.mcHosting',
        'Tent Rentals': 'common.tents',
        'Furniture Rentals': 'common.furniture',
        'Table/Chair Rentals': 'common.tableChair',
        'Power Supply': 'common.power',
        'Printing': 'common.printing',
        'Social Media Marketing': 'common.socialMedia',
        'Influencer Marketing': 'common.influencer',
        'Government Permits': 'common.governmentPermits',
        'Safety Permits': 'common.safetyPermits',
        'Sponsors': 'common.sponsors',
        'Brand Partners': 'common.brandPartners',
        'Henna Artists': 'common.henna',
        'Falconry Shows': 'common.falconry',
        'Horse Shows': 'common.horseShows',
        'Arabian Perfumes': 'common.perfumes',
        'Arabic Calligraphy': 'common.calligraphy',
        'VR/AR Experiences': 'common.vrAr',
        'Eco-Friendly Services': 'common.eco',
        'Gifts & Giveaways': 'common.gifts'
    };

    async function loadData() {
        try {
            const response = await fetch('/api/vendor/data/', { credentials: 'same-origin' });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            API_DATA = await response.json();
        } catch (error) {
            console.error("API Error:", error);
            showToast("Error loading dashboard data.");
        }
    }
    // Expose so vendor-dashboard.html's customSendMessage can refresh API_DATA
    // without triggering the heavy renderAllAfterFetch (which resets the active tab).
    window.vendorLoadData = loadData;

    // Data accessors
    function getEvents() { return API_DATA.events || []; }
    function getInvitations() { return API_DATA.invitations || []; }
    function getApplications() { return API_DATA.applications || []; }
    function getEventVendors() { return API_DATA.eventVendors || []; }
    function getMessages() { return API_DATA.messages || []; }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = msg;
        toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #333; color: white; padding: 12px 24px; border-radius: 8px; z-index: 9999;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Elements
    const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    /** Display label for invitation request status. */
    function invitationStatusLabel(status) {
        if (status === 'Approved') return t('vendor.status.confirmed');
        if (status === 'Rejected') return t('status.rejected');
        return status;
    }

    // --- VIEW SWITCHING ---
    window.switchView = function (viewId) {
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewId) item.classList.add('active');
        });

        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === `view-${viewId}`) sec.classList.add('active');
        });

        const titles = {
            'overview': t('vendor.page.dashboard'),
            'invitations': t('vendor.page.invitations'),
            'browse-events': t('vendor.page.browseEvents'),
            'my-events': t('vendor.page.myEvents'),
            'event-manage': t('vendor.page.eventManage'),
            'profile': t('vendor.page.profile')
        };
        if (pageTitle) pageTitle.textContent = titles[viewId] || t('vendor.page.dashboard');

        if (viewId === 'overview') { renderUpcomingEvents(); updateStats(); }
        if (viewId === 'invitations') { renderMyApplications(); renderInvitations(); }
        if (viewId === 'browse-events') renderBrowseEvents();
        if (viewId === 'my-events') renderMyEvents();
        if (viewId !== 'overview') updateStats();

        if (window.innerWidth < 992) closeSidebar();
    };

    // Sidebar Click Listeners
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            if (view && view !== 'logout') switchView(view);
        });
    });

    // Sidebar Toggle
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

    if (sidebarToggle) sidebarToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) closeSidebar(); else openSidebar();
    });
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    // --- DATA RENDERING ---

    function renderMyApplications() {
        const myApplications = getApplications();
        const events = getEvents();

        const tableBody = document.getElementById('applications-table-body');
        const noMsg = document.getElementById('no-applications-msg');
        const statusFilterEl = document.getElementById('applications-status-filter');
        const tableEl = document.getElementById('applications-table');

        if (!tableBody) return;

        let filtered = myApplications;
        if (statusFilterEl && statusFilterEl.value !== 'all') {
            filtered = filtered.filter(r => r.status === statusFilterEl.value);
        }

        if (filtered.length === 0) {
            tableBody.innerHTML = '';
            if (noMsg) noMsg.style.display = 'block';
            if (tableEl) tableEl.style.display = 'none';
            return;
        }

        if (noMsg) noMsg.style.display = 'none';
        if (tableEl) tableEl.style.display = 'table';

        filtered.sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived));

        tableBody.innerHTML = filtered.map(req => {
            const event = events.find(e => String(e.id) === String(req.eventId));
            const eventTitle = event ? event.title : t('common.unknown');
            const organizerName = (event && event.organizer) ? event.organizer : t('vendor.chat.organizerFallback');
            const rawMsg = req.message || '';
            const msgSnippet = rawMsg.substring(0, 35) + (rawMsg.length > 35 ? '...' : '');
            const msgEscaped = rawMsg.replace(/'/g, "\\'").replace(/\n/g, ' ');
            const readMoreLink = rawMsg.length > 35
                ? `<a href="#" onclick="event.preventDefault(); openMessageModal('${msgEscaped}')" style="color: #3b82f6; font-size: 0.8rem; margin-left: 6px; text-decoration: none;">${t('vendor.requests.readMore')}</a>`
                : '';

            let statusClass = req.status === 'Pending' ? 'status-pending' : req.status === 'Approved' ? 'status-approved' : 'status-rejected';
            const statusText = req.status === 'Pending' ? t('common.pending') : req.status === 'Approved' ? t('common.approved') : t('status.rejected');
            const lang = localStorage.getItem('eventia_lang') || 'en';
            const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
            const dateStr = req.dateReceived ? new Date(req.dateReceived).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

            const svcRaw = req.serviceType || '';
            const svcLabel = svcRaw ? (t(serviceTypeMap[svcRaw]) || svcRaw) : '\u2014';

            return `
                <tr>
                    <td><div style="display: flex; align-items: center; gap: 6px;"><i class="fa-solid fa-calendar" style="color: #94a3b8; font-size: 0.8rem;"></i><span style="color: #334155;">${eventTitle}</span></div></td>
                    <td><div style="font-weight: 500; color: #1e293b;">${organizerName}</div></td>
                    <td><span style="color: #64748b; font-size: 0.9rem;">${svcLabel}</span></td>
                    <td><span style="color: #64748b; font-size: 0.85rem;">${dateStr}</span></td>
                    <td><div style="color: #475569; font-size: 0.9rem;">${msgSnippet}${readMoreLink}</div></td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                </tr>
            `;
        }).join('');
    }

    function renderInvitations() {
        const myInvitations = getInvitations();
        const events = getEvents();
        const pendingRequests = myInvitations.filter(r => r.status === 'Pending');

        const container = document.getElementById('invitations-cards-container');
        const inviteFilterEl = document.getElementById('invite-filter');

        if (container) {
            const filter = inviteFilterEl ? inviteFilterEl.value : 'all';
            let displayRequests = filter !== 'all' ? myInvitations.filter(r => r.status === filter) : myInvitations;

            displayRequests.sort((a, b) => new Date(b.dateSent) - new Date(a.dateSent));

            if (displayRequests.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem; background: #f8f9fa; border-radius: 12px; color: #666;">
                        <i class="fa-regular fa-envelope" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem; display: block;"></i>
                        <p style="margin: 0; font-size: 1rem;">${t('vendor.requests.noInvitations')}</p>
                        <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #999;">${t('vendor.requests.noInvitationsDesc')}</p>
                    </div>`;
            } else {
                container.innerHTML = displayRequests.map(req => {
                    const event = events.find(e => String(e.id) === String(req.eventId));
                    if (!event) return '';

                    const lang = localStorage.getItem('eventia_lang') || 'en';
                    const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
                    const rtlChip = lang === 'ar';

                    const eventDate = new Date(event.date);
                    const month = eventDate.toLocaleString(locale, { month: 'short' }).toUpperCase();
                    const day = eventDate.getDate();

                    let actionButtons = '';
                    if (req.status === 'Pending') {
                        actionButtons = `
                            <button onclick="viewInvitationDetails('${req.id}')" class="btn btn-sm" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; font-size: 0.8rem; cursor: pointer; color: #555; font-weight: 500;">
                                <i class="fa-solid fa-eye" aria-hidden="true" style="font-size: 0.9em; line-height: 1;"></i><span>${t('common.view')}</span>
                            </button>
                            <button onclick="acceptInvitation('${req.id}')" class="btn btn-sm btn-success" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; font-weight: 500;">
                                <i class="fa-solid fa-check" aria-hidden="true" style="font-size: 0.9em; line-height: 1;"></i><span>${t('vendor.requests.accept')}</span>
                            </button>
                            <button onclick="openRejectModal('${req.id}')" class="btn btn-sm btn-danger" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; font-weight: 500;">
                                <i class="fa-solid fa-xmark" aria-hidden="true" style="font-size: 0.9em; line-height: 1;"></i><span>${t('common.reject')}</span>
                            </button>
                        `;
                    } else {
                        const statusColor = req.status === 'Approved' ? '#2e7d32' : '#c62828';
                        const statusBg = req.status === 'Approved' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(198, 40, 40, 0.1)';
                        actionButtons = `<span style="padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: ${statusBg}; color: ${statusColor};">${invitationStatusLabel(req.status)}</span>`;
                    }

                    return `
                        <div style="background: white; border: 1px solid #e8e8e8; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem; transition: all 0.2s ease;">
                            <div class="blue-date-box"><span class="date-month">${month}</span><span class="date-day">${day}</span></div>
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                    <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #222;">${event.title}</h4>
                                    <span style="background: #e8f0fe; color: #1a73e8; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500;">${translateEventCategory(event.category)}</span>
                                </div>
                                <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
                                    ${vendorDashboardMetaChip('fa-regular fa-clock', event.time || t('common.tbd'), rtlChip, '')}
                                    ${vendorDashboardMetaChip('fa-solid fa-location-dot', event.location || t('common.tbd'), rtlChip, '')}
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">${actionButtons}</div>
                        </div>
                    `;
                }).join('');
            }
        }

        // Sidebar badge
        const sidebarBadge = document.getElementById('sidebar-invite-badge');
        if (sidebarBadge) {
            sidebarBadge.textContent = pendingRequests.length;
            sidebarBadge.style.display = pendingRequests.length > 0 ? 'inline-block' : 'none';
        }
        const tabBadge = document.getElementById('invitations-tab-badge');
        if (tabBadge) {
            tabBadge.textContent = pendingRequests.length;
            tabBadge.style.display = pendingRequests.length > 0 ? 'inline-block' : 'none';
        }
    }

    window.openMessageModal = function (content) {
        const modal = document.getElementById('message-modal');
        const el = document.getElementById('full-message-content');
        if (modal && el) {
            el.textContent = content ? content.replace(/\\'/g, "'") : '';
            modal.classList.remove('hidden');
        }
    };

    window.closeMessageModal = function () {
        const modal = document.getElementById('message-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.viewInvitationDetails = function (requestId) {
        const req = getInvitations().find(r => String(r.id) === String(requestId));
        if (!req) return;

        const events = getEvents();
        const event = events.find(e => String(e.id) === String(req.eventId));
        if (!event) return;

        const lang = localStorage.getItem('eventia_lang') || 'en';
        const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

        const existing = document.getElementById('invitation-details-modal');
        if (existing) existing.remove();

        let ticketInfo = `<div style="display: flex; align-items: center; gap: 6px; color: #2e7d32; font-weight: 600; font-size: 1.1rem;"><i class="fa-solid fa-ticket" aria-hidden="true" style="font-size: 0.95em; line-height: 1; flex-shrink: 0;"></i><span>${t('common.free')}</span></div>`;
        if (event.price && parseFloat(event.price) > 0) {
            ticketInfo = `<div style="display: flex; align-items: center; gap: 6px; color: #1976d2; font-weight: 600; font-size: 1.1rem;"><i class="fa-solid fa-ticket" aria-hidden="true" style="font-size: 0.95em; line-height: 1; flex-shrink: 0;"></i><span>${event.price} ${SAR_ICON}</span></div>`;
        }

        let actionButtons = '';
        if (req.status === 'Pending') {
            actionButtons = `
                <div style="display: flex; gap: 12px; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb;">
                    <button onclick="document.getElementById('invitation-details-modal').remove(); acceptInvitation('${req.id}')" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; background: #2e7d32; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                        <i class="fa-solid fa-check" aria-hidden="true" style="font-size: 0.95em; line-height: 1; flex-shrink: 0;"></i><span>${t('vendor.requests.accept')}</span>
                    </button>
                    <button onclick="document.getElementById('invitation-details-modal').remove(); openRejectModal('${req.id}')" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 12px; background: #c62828; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">
                        <i class="fa-solid fa-xmark" aria-hidden="true" style="font-size: 0.95em; line-height: 1; flex-shrink: 0;"></i><span>${t('common.reject')}</span>
                    </button>
                </div>`;
        } else {
            actionButtons = `
                <div style="padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb;">
                    <button onclick="document.getElementById('invitation-details-modal').remove()" style="width: 100%; padding: 12px; background: #004e92; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">${t('common.close')}</button>
                </div>`;
        }

        let dateFormatted = '';
        try {
            if (event.date) {
                dateFormatted = new Date(event.date).toLocaleDateString(locale, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
        } catch (e) { dateFormatted = event.date || ''; }
        if (!dateFormatted) dateFormatted = String(event.date || '');

        const modal = document.createElement('div');
        modal.id = 'invitation-details-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);" onclick="if(event.target === this) this.parentElement.remove()">
                <div style="background: white; border-radius: 16px; width: 90%; max-width: 520px; max-height: 85vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div style="background: linear-gradient(135deg, #3C50C8, #004e92); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 1.2rem; font-weight: 600;"><i class="fa-solid fa-file-lines" style="margin-right: 8px;"></i><span>${t('vendor.invitation.eventReview')}</span></h2>
                        <button onclick="document.getElementById('invitation-details-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem;"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div style="padding: 1.5rem; max-height: 55vh; overflow-y: auto;">
                        <div style="margin-bottom: 1.25rem;">
                            <h3 style="margin: 0 0 8px 0; font-size: 1.4rem; color: #222;">${event.title}</h3>
                            <span style="display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 4px 12px; border-radius: 16px; font-size: 0.8rem; font-weight: 500;">${translateEventCategory(event.category)}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 1.25rem;">
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-regular fa-calendar" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">${t('common.date')}</div>
                                <div style="font-weight: 600; font-size: 0.85rem;">${dateFormatted}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-regular fa-clock" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">${t('common.time')}</div>
                                <div style="font-weight: 600; font-size: 0.85rem;">${event.time || t('common.tbd')}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-solid fa-location-dot" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">${t('common.location')}</div>
                                <div style="font-weight: 600; font-size: 0.75rem; word-break: break-word;">${event.location || t('common.tbd')}</div>
                            </div>
                        </div>
                        <div style="margin-bottom: 1.25rem;">
                            <div style="font-size: 0.8rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">${t('common.description')}</div>
                            <p style="margin: 0; line-height: 1.6; color: #333;">${event.description || t('vendor.invitation.noDescription')}</p>
                        </div>
                        ${(function () {
                            const policyLabels = {
                                'flexible': t('org.policy.vendor.flexibleDesc'),
                                'moderate': t('org.policy.vendor.moderateDesc'),
                                'strict': t('org.policy.vendor.strictDesc'),
                                'non-refundable': t('org.policy.vendor.nonRefundableDesc')
                            };
                            const policyIcons = { 'flexible': 'fa-unlock', 'moderate': 'fa-clock', 'strict': 'fa-lock', 'non-refundable': 'fa-ban' };
                            const policyColors = { 'flexible': '#2e7d32', 'moderate': '#ff9800', 'strict': '#e65100', 'non-refundable': '#c62828' };
                            const policyBgs = { 'flexible': '#e8f5e9', 'moderate': '#fff3e0', 'strict': '#fbe9e7', 'non-refundable': '#ffebee' };
                            const pol = event.withdrawalPolicy;
                            if (!pol || !policyLabels[pol]) return '';
                            return `
                            <div style="margin-bottom: 1.25rem; background: ${policyBgs[pol]}; padding: 1rem; border-radius: 10px; border-inline-start: 4px solid ${policyColors[pol]};">
                                <div style="font-size: 0.8rem; color: ${policyColors[pol]}; text-transform: uppercase; font-weight: 600; margin-bottom: 6px;">
                                    <i class="fa-solid fa-shield-halved" style="margin-right: 4px;"></i><span>${t('vendor.myEvents.withdrawPolicy')}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <i class="fa-solid ${policyIcons[pol]}" style="font-size: 1.2rem; color: ${policyColors[pol]};"></i>
                                    <span style="font-weight: 600; color: #333; font-size: 0.95rem;">${policyLabels[pol]}</span>
                                </div>
                            </div>`;
                        })()}
                        ${req.message ? `
                        <div style="margin-bottom: 1.25rem; background: #e8f0fe; padding: 1rem; border-radius: 8px; border-inline-start: 3px solid #1a73e8;">
                            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #1565c0; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;"><i class="fa-solid fa-envelope" aria-hidden="true" style="font-size: 0.95em; line-height: 1; flex-shrink: 0;"></i><span>${t('vendor.requests.messageFromOrganizer')}</span></div>
                            <p style="margin: 0; line-height: 1.6; color: #333;">${req.message}</p>
                        </div>` : ''}
                        <div>
                            <div style="font-size: 0.8rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">${t('vendor.invitation.ticketsPricing')}</div>
                            ${ticketInfo}
                        </div>
                    </div>
                    ${actionButtons}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    function renderUpcomingEvents() {
        const container = document.getElementById('upcoming-events-container');
        if (!container) return;

        const eventVendors = getEventVendors();
        const events = getEvents();
        const upcomingEvents = eventVendors
            .map(ev => {
                const event = events.find(e => String(e.id) === String(ev.eventId));
                return event && new Date(event.date) >= new Date() ? { ev, event } : null;
            })
            .filter(item => item !== null)
            .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));

        if (upcomingEvents.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; background: #f8f9fa; border-radius: 12px; color: #666;">
                    <i class="fa-regular fa-calendar" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem; display: block;"></i>
                    <p style="margin: 0; font-size: 1rem;">${t('vendor.upcoming.emptyTitle')}</p>
                    <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #999;">${t('vendor.upcoming.emptyDesc')}</p>
                </div>`;
            return;
        }

        container.innerHTML = upcomingEvents.slice(0, 3).map(({ ev, event }) => {
            const lang = localStorage.getItem('eventia_lang') || 'en';
            const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
            const rtlChip = lang === 'ar';
            const eventDate = new Date(event.date);
            const month = eventDate.toLocaleString(locale, { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();
            return `
                <div style="background: white; border: 1px solid #e8e8e8; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 1rem;">
                    <div class="blue-date-box" style="min-width: 60px;"><span class="date-month">${month}</span><span class="date-day">${day}</span></div>
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #222;">${event.title}</h4>
                            <span style="background: #e8f0fe; color: #1a73e8; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500;">${translateEventCategory(event.category)}</span>
                        </div>
                        <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.8rem; color: #666;">
                            ${vendorDashboardMetaChip('fa-regular fa-clock', event.time || t('common.tbd'), rtlChip, '')}
                            ${vendorDashboardMetaChip('fa-solid fa-location-dot', event.location || t('common.tbd'), rtlChip, '')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderMyEvents() {
        const myEventsContainer = document.getElementById('my-events-container');
        if (!myEventsContainer) return;

        const searchEl = document.getElementById('my-events-search');
        const searchTerm = (searchEl && searchEl.value.trim()) ? searchEl.value.toLowerCase() : '';
        const events = getEvents();
        let approvedVendors = getEventVendors();

        if (searchTerm) {
            approvedVendors = approvedVendors.filter(ev => {
                const event = events.find(e => String(e.id) === String(ev.eventId));
                if (!event) return false;
                return (event.title || '').toLowerCase().includes(searchTerm) || (event.location || '').toLowerCase().includes(searchTerm);
            });
        }

        if (approvedVendors.length === 0) {
            const isSearch = !!searchTerm;
            myEventsContainer.innerHTML = `
                <div class="vendor-my-events-empty">
                    <div class="vendor-my-events-empty-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
                    <h4 class="vendor-my-events-empty-title">${isSearch ? t('vendor.myEvents.emptySearchTitle') : t('vendor.myEvents.emptyTitle')}</h4>
                    <p class="vendor-my-events-empty-desc">${isSearch ? t('vendor.myEvents.emptySearchDesc') : t('vendor.myEvents.emptyDesc')}</p>
                    ${!isSearch ? `<button type="button" class="btn btn-primary" onclick="switchView('browse-events')"><i class="fa-solid fa-earth-americas"></i> <span>${t('vendor.nav.browseEvents')}</span></button>` : ''}
                </div>`;
            return;
        }

        myEventsContainer.innerHTML = approvedVendors.map(ev => {
            const event = events.find(e => String(e.id) === String(ev.eventId));
            if (!event) return '';

            const lang = localStorage.getItem('eventia_lang') || 'en';
            const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
            const rtlChip = lang === 'ar';
            const isPast = new Date(event.date) < new Date();
            const statusLabel = isPast ? t('status.past') : t('status.upcoming');
            const monthShort = new Date(event.date).toLocaleString(locale, { month: 'short' }).toUpperCase();
            const dayNum = new Date(event.date).getDate();

            return `
                <div class="event-card-horizontal">
                    <div class="blue-date-box" style="min-width: 60px;"><span class="date-month">${monthShort}</span><span class="date-day">${dayNum}</span></div>
                    <div>
                        <h3>${event.title}</h3>
                        <div class="vendor-my-events-meta">
                            ${vendorDashboardMetaChip('fa-solid fa-location-dot', event.location || t('common.tbd'), rtlChip, '')}
                            ${vendorDashboardMetaChip('fa-regular fa-clock', event.time || t('common.tbd'), rtlChip, '')}
                        </div>
                    </div>
                    <div class="vendor-my-events-cell-status"><span class="status-badge status-${isPast ? 'past' : 'upcoming'}">${statusLabel}</span></div>
                    <div class="vendor-my-events-cell-actions"><div class="manage-btn-wrap"><button class="btn btn-sm btn-primary vendor-manage-btn" data-event-id="${ev.eventId}" onclick="openVendorEventManage('${ev.eventId}', '${ev.requestId}')" style="font-size: 0.78rem;"><i class="fa-solid fa-sliders"></i> <span>${t('vendor.myEvents.manage')}</span></button></div></div>
                </div>`;
        }).join('');
    }

    function renderBrowseEvents() {
        const container = document.getElementById('browse-events-container');
        if (!container) return;

        const filter = document.getElementById('browse-events-filter') ? document.getElementById('browse-events-filter').value : 'all';
        const search = document.getElementById('browse-events-search') ? document.getElementById('browse-events-search').value.toLowerCase() : '';
        const events = getEvents();
        const appliedIds = API_DATA.appliedEventIds || [];

        let displayEvents = events.filter(e => {
            const isUpcoming = new Date(e.date) >= new Date();
            const matchesCategory = filter === 'all' || e.category === filter;
            const matchesSearch = (e.title || '').toLowerCase().includes(search) || (e.location || '').toLowerCase().includes(search);
            return isUpcoming && matchesCategory && matchesSearch;
        });

        const resultsCountEl = document.getElementById('browse-events-results-count');
        if (resultsCountEl) resultsCountEl.textContent = displayEvents.length === 0 ? t('vendor.browse.resultsNone') : t('vendor.browse.resultsFound').replace('{count}', displayEvents.length);

        if (displayEvents.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">${t('vendor.browse.noUpcomingMatch')}</div>`;
            return;
        }

        container.innerHTML = displayEvents.map(event => {
            const hasApplied = appliedIds.includes(String(event.id));
            let actionBtn = hasApplied
                ? `<button class="btn btn-outline" style="width: 100%; cursor: default; background: #e3f2fd; color: #1976d2; border-color: #e3f2fd;" disabled><span>${t('vendor.browse.applied')}</span> <i class="fa-solid fa-check"></i></button>`
                : `<button class="btn btn-primary" style="width: 100%;" onclick="openApplyModal('${event.id}')">${t('vendor.browse.applyNow')}</button>`;

            const lang = localStorage.getItem('eventia_lang') || 'en';
            const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
            const rtlChip = lang === 'ar';
            const translatedCategory = translateEventCategory(event.category);
            const rawDesc = (event.description || '').trim();
            const descTrimmed = rawDesc.length > 80 ? rawDesc.substring(0, 80) + '...' : rawDesc;

            return `
                <div class="event-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; display: flex; flex-direction: column;">
                    <div style="height: 140px; background: linear-gradient(135deg, #004e92, #4dabf7); display: flex; align-items: center; justify-content: center; color: white; position: relative;">
                         <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem;">${translatedCategory}</div>
                         <i class="fa-solid fa-calendar-days" style="font-size: 3rem; opacity: 0.3;"></i>
                    </div>
                    <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column;">
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${event.title}</h3>
                        <p style="margin: 0 0 1rem 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; flex: 1;">${descTrimmed || t('common.notAvailable')}</p>
                        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; font-size: 0.85rem; color: #555;">
                            ${vendorDashboardMetaChip('fa-solid fa-location-dot', event.location || t('common.tbd'), rtlChip, 'color: var(--primary-color);')}
                            ${vendorDashboardMetaChip('fa-regular fa-clock', event.date ? new Date(event.date).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }) : t('common.notAvailable'), rtlChip, 'color: var(--primary-color);')}
                        </div>
                        ${actionBtn}
                    </div>
                </div>
            `;
        }).join('');
    }

    function updateStats() {
        const stats = API_DATA.stats || {};
        const el1 = document.getElementById('stat-pending-invites');
        const el2 = document.getElementById('stat-active-events');
        const el3 = document.getElementById('stat-completed-events');
        if (el1) el1.textContent = stats.pendingInvites || 0;
        if (el2) el2.textContent = stats.activeEvents || 0;
        if (el3) el3.textContent = stats.completedEvents || 0;
    }

    // --- ACTIONS (API-backed) ---

    window.acceptInvitation = function (requestId) {
        fetch('/dashboard/vendor/accept_request/' + requestId + '/', {
            method: 'POST',
            headers: { 'X-CSRFToken': window.CSRF_TOKEN },
            credentials: 'same-origin'
        }).then(async () => {
            showToast(t('vendor.invitation.accepted'));
            await loadData();
            renderInvitations();
            renderMyEvents();
            renderUpcomingEvents();
            updateStats();
        }).catch(err => { console.error(err); showToast(t('vendor.invitation.acceptFailed')); });
    };

    // Reject Logic
    window.openRejectModal = function (requestId) {
        const req = getInvitations().find(r => String(r.id) === String(requestId));
        if (!req) return;
        const events = getEvents();
        const event = events.find(e => String(e.id) === String(req.eventId));
        const eventTitle = event ? event.title : t('common.unknownEvent');

        document.getElementById('reject-request-id').value = requestId;
        document.getElementById('reject-event-title').value = eventTitle;
        document.getElementById('reject-event-name-display').textContent = eventTitle;
        const modal = document.getElementById('reject-modal');
        if (modal) modal.style.display = 'flex';
    };

    window.closeRejectModal = function () {
        const modal = document.getElementById('reject-modal');
        if (modal) modal.style.display = 'none';
        document.getElementById('reject-form').reset();
    };

    const rejectForm = document.getElementById('reject-form');
    if (rejectForm) {
        rejectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const requestId = document.getElementById('reject-request-id').value;
            const reason = document.getElementById('reject-reason').value;

            const formData = new FormData();
            formData.append('reason', reason);

            fetch('/dashboard/vendor/reject_request/' + requestId + '/', {
                method: 'POST',
                headers: { 'X-CSRFToken': window.CSRF_TOKEN },
                credentials: 'same-origin',
                body: formData
            }).then(async () => {
                showToast(t('vendor.invitation.rejected'));
                closeRejectModal();
                await loadData();
                renderInvitations();
                updateStats();
            }).catch(err => { console.error(err); showToast(t('vendor.invitation.rejectFailed')); });
        });
    }

    // Withdraw Logic
    function getWithdrawalPolicyInfo(policy, eventDate) {
        const normalized = typeof policy === 'string' ? policy.trim().toLowerCase().replace(/\s+/g, '-') : policy;
        const policyLabels = { 'flexible': t('vendor.policy.flexibleDesc'), 'moderate': t('vendor.policy.moderateDesc'), 'strict': t('vendor.policy.strictDesc'), 'non-refundable': t('vendor.policy.nonRefundableDesc') };
        const policyColors = { 'flexible': '#2e7d32', 'moderate': '#ff9800', 'strict': '#e65100', 'non-refundable': '#c62828' };
        const policyBgs = { 'flexible': '#e8f5e9', 'moderate': '#fff3e0', 'strict': '#fbe9e7', 'non-refundable': '#ffebee' };
        const policyIcons = { 'flexible': 'fa-unlock', 'moderate': 'fa-clock', 'strict': 'fa-lock', 'non-refundable': 'fa-ban' };

        const label = policyLabels[normalized] || t('vendor.policy.notSet');
        const color = policyColors[normalized] || '#666';
        const bg = policyBgs[normalized] || '#f5f5f5';
        const icon = policyIcons[normalized] || 'fa-shield';

        let allowed = true;
        let reason = '';
        const now = new Date();
        const evtDate = new Date(eventDate);
        const daysUntilEvent = Math.ceil((evtDate - now) / (1000 * 60 * 60 * 24));

        if (normalized === 'non-refundable') {
            allowed = false;
            reason = t('vendor.withdraw.reason.nonRefundable');
        } else if (normalized === 'strict' && daysUntilEvent < 30) {
            allowed = false;
            reason = t('vendor.withdraw.reason.strict').replace('{days}', daysUntilEvent);
        } else if (normalized === 'moderate' && daysUntilEvent < 14) {
            allowed = false;
            reason = t('vendor.withdraw.reason.moderate').replace('{days}', daysUntilEvent);
        } else if (normalized === 'flexible' && daysUntilEvent < 7) {
            allowed = false;
            reason = t('vendor.withdraw.reason.flexible').replace('{days}', daysUntilEvent);
        }

        return { label, color, bg, icon, allowed, reason, daysUntilEvent };
    }

    window.openWithdrawModal = function (requestId) {
        const evVendor = getEventVendors().find(ev => String(ev.requestId) === String(requestId));
        if (!evVendor) return;

        const events = getEvents();
        const event = events.find(e => String(e.id) === String(evVendor.eventId));
        const eventTitle = event ? event.title : t('common.unknownEvent');
        const eventDate = event ? event.date : null;
        const policy = event ? event.withdrawalPolicy : null;
        const policyInfo = getWithdrawalPolicyInfo(policy, eventDate);

        const policyBanner = document.getElementById('withdraw-policy-banner');
        if (policyBanner) {
            if (policy) {
                policyBanner.style.display = 'block';
                policyBanner.style.background = policyInfo.bg;
                policyBanner.style.borderInlineStart = `4px solid ${policyInfo.color}`;
                policyBanner.innerHTML = `
                <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                    <i class="fa-solid fa-shield-halved" style="color: ${policyInfo.color}; font-size: 1.1rem; margin-top: 2px; flex-shrink: 0;"></i>
                    <div style="min-width: 0; flex: 1;">
                        <strong style="color: ${policyInfo.color}; display: block; margin-bottom: 4px;">${t('vendor.withdraw.policyTitle')}</strong>
                        <p style="margin: 0; color: #555; font-size: 0.85rem; line-height: 1.5; display: flex; align-items: center; gap: 0.4rem;">
                            <i class="fa-solid ${policyInfo.icon}" style="color: ${policyInfo.color}; font-size: 1em; line-height: 1; flex-shrink: 0;"></i>
                            <span>${policyInfo.label}</span>
                        </p>
                        ${!policyInfo.allowed ? `<p style="margin: 6px 0 0; color: ${policyInfo.color}; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem;"><i class="fa-solid fa-circle-exclamation" style="flex-shrink: 0;"></i><span>${policyInfo.reason}</span></p>` : ''}
                    </div>
                </div>`;
            } else {
                policyBanner.style.display = 'none';
            }
        }

        const submitBtn = document.querySelector('#withdraw-form button[type="submit"]');
        const reasonField = document.getElementById('withdraw-reason');
        if (!policyInfo.allowed) {
            if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.5'; submitBtn.style.cursor = 'not-allowed'; }
            if (reasonField) { reasonField.disabled = true; reasonField.placeholder = t('vendor.withdraw.notAllowedPlaceholder'); reasonField.required = false; }
        } else {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; submitBtn.style.cursor = 'pointer'; }
            if (reasonField) { reasonField.disabled = false; reasonField.placeholder = t('vendor.withdraw.reasonPlaceholder'); reasonField.required = true; }
        }

        document.getElementById('withdraw-request-id').value = requestId;
        document.getElementById('withdraw-event-title').value = eventTitle;
        document.getElementById('withdraw-event-name-display').textContent = eventTitle;

        const modal = document.getElementById('withdraw-modal');
        if (modal) modal.style.display = 'flex';
    };

    window.closeWithdrawModal = function () {
        const modal = document.getElementById('withdraw-modal');
        if (modal) modal.style.display = 'none';
        document.getElementById('withdraw-form').reset();
    };

    const withdrawForm = document.getElementById('withdraw-form');
    if (withdrawForm) {
        withdrawForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const requestId = document.getElementById('withdraw-request-id').value;
            const reason = document.getElementById('withdraw-reason').value;

            const evVendor = getEventVendors().find(ev => String(ev.requestId) === String(requestId));
            const evt = evVendor ? getEvents().find(e => String(e.id) === String(evVendor.eventId)) : null;
            const policyInfo = getWithdrawalPolicyInfo(evt ? evt.withdrawalPolicy : null, evt ? evt.date : null);
            if (!policyInfo.allowed) {
                showToast(t('vendor.withdraw.blocked'));
                return;
            }

            const formData = new FormData();
            formData.append('reason', reason);

            fetch('/dashboard/vendor/withdraw_request/' + requestId + '/', {
                method: 'POST',
                headers: { 'X-CSRFToken': window.CSRF_TOKEN },
                credentials: 'same-origin',
                body: formData
            }).then(async () => {
                showToast(t('vendor.withdraw.success'));
                closeWithdrawModal();
                await loadData();
                renderMyEvents();
                renderUpcomingEvents();
                updateStats();
            }).catch(err => { console.error(err); showToast(t('vendor.withdraw.failed')); });
        });
    }

    // Apply Modal Logic
    window.openApplyModal = function (eventId) {
        document.getElementById('apply-event-id').value = eventId;

        const events = getEvents();
        const event = events.find(e => String(e.id) === String(eventId));
        const policyBanner = document.getElementById('apply-policy-banner');
        if (event && policyBanner && event.withdrawalPolicy) {
            const policyInfo = getWithdrawalPolicyInfo(event.withdrawalPolicy, event.date);
            policyBanner.style.display = 'block';
            policyBanner.style.background = policyInfo.bg;
            policyBanner.style.borderInlineStart = `4px solid ${policyInfo.color}`;
            policyBanner.innerHTML = `
                <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                    <i class="fa-solid fa-shield-halved" style="color: ${policyInfo.color}; font-size: 1.1rem; margin-top: 2px; flex-shrink: 0;"></i>
                    <div style="min-width: 0; flex: 1;">
                        <strong style="color: ${policyInfo.color}; display: block; margin-bottom: 4px;">${t('vendor.withdraw.policyTitle')}</strong>
                        <p style="margin: 0; color: #555; font-size: 0.85rem; line-height: 1.5; display: flex; align-items: center; gap: 0.4rem;">
                            <i class="fa-solid ${policyInfo.icon}" style="color: ${policyInfo.color}; font-size: 1em; line-height: 1; flex-shrink: 0;"></i>
                            <span>${policyInfo.label}</span>
                        </p>
                    </div>
                </div>
            `;
        } else if (policyBanner) {
            policyBanner.style.display = 'none';
        }

        document.getElementById('apply-modal').classList.remove('hidden');
    };

    window.closeApplyModal = function () {
        document.getElementById('apply-modal').classList.add('hidden');
        document.getElementById('apply-form').reset();
        clearApplyAttachment();
    };

    window.clearApplyAttachment = function () {
        const fileInput = document.getElementById('apply-attachment');
        if (fileInput) fileInput.value = '';
        const preview = document.getElementById('apply-attachment-preview');
        if (preview) preview.style.display = 'none';
        const filenameEl = document.getElementById('apply-attachment-filename');
        if (filenameEl) filenameEl.textContent = '';
        const errorEl = document.getElementById('apply-attachment-error');
        if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }
    };

    const applyAttachmentInput = document.getElementById('apply-attachment');
    if (applyAttachmentInput) {
        applyAttachmentInput.addEventListener('change', function () {
            const preview = document.getElementById('apply-attachment-preview');
            const filenameEl = document.getElementById('apply-attachment-filename');
            const errorEl = document.getElementById('apply-attachment-error');
            if (!preview || !filenameEl || !errorEl) return;

            errorEl.style.display = 'none';
            errorEl.textContent = '';

            if (this.files && this.files[0]) {
                const file = this.files[0];
                const maxMb = 5;
                if (file.size > maxMb * 1024 * 1024) {
                    errorEl.textContent = t('vendor.apply.fileTooLarge').replace('{max}', maxMb);
                    errorEl.style.display = 'flex';
                    this.value = '';
                    preview.style.display = 'none';
                    filenameEl.textContent = '';
                } else {
                    filenameEl.textContent = '\u2713 ' + file.name;
                    preview.style.display = 'flex';
                }
            } else {
                preview.style.display = 'none';
                filenameEl.textContent = '';
            }
        });
    }

    const applyForm = document.getElementById('apply-form');
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const eventId = document.getElementById('apply-event-id').value;
            const service = document.getElementById('apply-service-type').value;
            const message = document.getElementById('apply-message').value;

            const formData = new FormData();
            formData.append('event_id', eventId);
            formData.append('service_type', service);
            formData.append('message', message);
            const applyFileInput = document.getElementById('apply-attachment');
            if (applyFileInput && applyFileInput.files && applyFileInput.files[0]) {
                formData.append('attachment', applyFileInput.files[0]);
            }

            fetch('/dashboard/vendor/apply_for_event/', {
                method: 'POST',
                headers: { 'X-CSRFToken': window.CSRF_TOKEN },
                credentials: 'same-origin',
                body: formData
            }).then(async () => {
                showToast(t('vendor.apply.sentSuccess'));
                closeApplyModal();
                await loadData();
                renderBrowseEvents();
                renderMyApplications();
            }).catch(err => { console.error(err); showToast(t('vendor.apply.failed')); });
        });
    }

    // Tab switching for Invitations view
    const requestTabs = document.querySelectorAll('.request-tab');
    requestTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            requestTabs.forEach(t => {
                t.classList.remove('active');
                t.style.border = '2px solid #e0e0e0'; t.style.background = 'white'; t.style.boxShadow = 'none';
                const iconContainer = t.querySelector('div:first-child');
                if (iconContainer) { iconContainer.style.background = 'linear-gradient(135deg, #f0f4f8, #e3e8ed)'; const icon = iconContainer.querySelector('i'); if (icon) icon.style.color = '#1565c0'; }
                const textContainer = t.querySelector('div:nth-child(2)');
                if (textContainer) { const title = textContainer.querySelector('div:first-child'); const subtitle = textContainer.querySelector('div:last-child'); if (title) title.style.color = '#333'; if (subtitle) subtitle.style.color = '#666'; }
            });

            tab.classList.add('active');
            tab.style.border = 'none'; tab.style.background = 'linear-gradient(135deg, #1565c0, #0d47a1)'; tab.style.boxShadow = '0 4px 15px rgba(21, 101, 192, 0.3)';
            const activeIconContainer = tab.querySelector('div:first-child');
            if (activeIconContainer) { activeIconContainer.style.background = 'rgba(255,255,255,0.2)'; const activeIcon = activeIconContainer.querySelector('i'); if (activeIcon) activeIcon.style.color = 'white'; }
            const activeTextContainer = tab.querySelector('div:nth-child(2)');
            if (activeTextContainer) { const title = activeTextContainer.querySelector('div:first-child'); const subtitle = activeTextContainer.querySelector('div:last-child'); if (title) title.style.color = 'white'; if (subtitle) subtitle.style.color = 'rgba(255,255,255,0.8)'; }

            const applicationsSection = document.getElementById('my-applications-section');
            const invitationsSection = document.getElementById('invitations-section');

            if (tab.dataset.tab === 'applications') {
                if (applicationsSection) applicationsSection.style.display = 'block';
                if (invitationsSection) invitationsSection.style.display = 'none';
                renderMyApplications();
            } else {
                if (applicationsSection) applicationsSection.style.display = 'none';
                if (invitationsSection) invitationsSection.style.display = 'block';
                renderInvitations();
            }
        });
    });

    // Filter Listeners
    const inviteFilter = document.getElementById('invite-filter');
    if (inviteFilter) inviteFilter.addEventListener('change', renderInvitations);
    const applicationsFilter = document.getElementById('applications-status-filter');
    if (applicationsFilter) applicationsFilter.addEventListener('change', renderMyApplications);
    const myEventsSearch = document.getElementById('my-events-search');
    if (myEventsSearch) myEventsSearch.addEventListener('input', renderMyEvents);
    const browseSearch = document.getElementById('browse-events-search');
    if (browseSearch) browseSearch.addEventListener('input', renderBrowseEvents);
    const browseFilter = document.getElementById('browse-events-filter');
    if (browseFilter) browseFilter.addEventListener('change', renderBrowseEvents);

    // Browse Events category pills
    const browsePills = document.querySelectorAll('.browse-category-pill');
    browsePills.forEach(pill => {
        pill.addEventListener('click', () => {
            browsePills.forEach(p => { p.classList.remove('active'); p.style.background = 'white'; p.style.color = '#333'; p.style.border = '1px solid #e0e0e0'; });
            pill.classList.add('active'); pill.style.background = '#004e92'; pill.style.color = 'white'; pill.style.border = 'none';
            const category = pill.dataset.category || 'all';
            if (browseFilter) browseFilter.value = category;
            renderBrowseEvents();
        });
    });

    // ===================================================================
    // VENDOR EVENT MANAGEMENT MODULE
    // ===================================================================
    const PREP_STATUSES = ['Pending', 'Preparing', 'In Transit', 'Setting Up', 'Ready'];
    const PREP_ICONS = { 'Pending': 'fa-clock', 'Preparing': 'fa-wrench', 'In Transit': 'fa-truck', 'Setting Up': 'fa-tools', 'Ready': 'fa-check' };
    const PREP_COLORS = { 'Pending': '#e65100', 'Preparing': '#1565c0', 'In Transit': '#7b1fa2', 'Setting Up': '#ff8f00', 'Ready': '#2e7d32' };
    const PREP_LABELS = {
        'Pending': 'vendor.prep.pending',
        'Preparing': 'vendor.prep.preparing',
        'In Transit': 'vendor.prep.inTransit',
        'Setting Up': 'vendor.prep.settingUp',
        'Ready': 'vendor.prep.ready'
    };

    function prepStatusLabel(status) {
        const key = PREP_LABELS[status];
        return key ? t(key) : status;
    }

    function normalizeWithdrawalPolicyKey(p) {
        if (!p || typeof p !== 'string') return null;
        return p.trim().toLowerCase().replace(/\s+/g, '-');
    }

    let currentManagedEventId = null;
    let currentManagedRequestId = null;

    function messagesForVendorEvent(eventId) {
        const all = getMessages();
        const row = getEventVendors().find(v => String(v.eventId) === String(eventId));
        const vid = row && row.vendorId != null ? String(row.vendorId) : null;
        return all
            .filter(m => {
                if (String(m.eventId) !== String(eventId)) return false;
                if (vid != null && m.vendorId != null && String(m.vendorId) !== vid) return false;
                return true;
            })
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    function renderVendorPreparationCard(eventId) {
        const container = document.getElementById('vem-preparation-card');
        if (!container) return;

        const evVendors = getEventVendors();
        const ev = evVendors.find(v => String(v.eventId) === String(eventId));
        if (!ev || ev.status !== 'Confirmed') { container.innerHTML = ''; return; }

        const prepStatus = ev.preparationStatus || 'Pending';
        const currentIdx = PREP_STATUSES.indexOf(prepStatus);
        const isReady = prepStatus === 'Ready';

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

        let connectors = '';
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
        for (let i = 0; i < PREP_STATUSES.length - 1; i++) {
            let connClass = 'upcoming';
            if (i < currentIdx) connClass = 'completed';
            else if (i === currentIdx) connClass = 'active';
            const stepW = 100 / PREP_STATUSES.length;
            const offset = stepW * i + stepW / 2;
            const posAttr = isRtl ? `right:${offset}%` : `left:${offset}%`;
            connectors += `<div class="em-timeline-connector ${connClass}" style="${posAttr};width:${stepW}%;"></div>`;
        }

        container.innerHTML = `
            <div class="em-detail-card em-card-blue" style="border-inline-start: 4px solid ${PREP_COLORS[prepStatus]};">
                <div class="em-detail-card-header">
                    <i class="fa-solid fa-timeline"></i>
                    <span>${t('vendor.preparationStatus.title')}</span>
                    <div style="margin-inline-start: auto; display: flex; gap: 0.5rem;">
                        ${isReady
                            ? `<span style="font-size: 0.78rem; font-weight: 600; color: #2e7d32; background: rgba(46,125,50,0.1); padding: 4px 12px; border-radius: 12px;"><i class="fa-solid fa-check-circle"></i> <span>${prepStatusLabel('Ready')}</span></span>`
                            : `<button type="button" class="vem-update-status-btn" onclick="openVendorStatusUpdateModal()"><i class="fa-solid fa-arrow-up-right-dots"></i> <span>${t('vendor.preparationStatus.updateButton')}</span></button>`}
                    </div>
                </div>
                <div class="em-detail-card-body">
                    <div class="em-vendor-timeline" style="position: relative; padding: 0.5rem 0;">
                        ${connectors}
                        ${steps}
                    </div>
                </div>
            </div>`;
    }

    function renderUpdateRequestBanner(eventId) {
        const container = document.getElementById('vem-update-banner-container');
        if (!container) return;

        const evVendors = getEventVendors();
        const ev = evVendors.find(v => String(v.eventId) === String(eventId));

        if (ev && ev.updateRequested) {
            container.innerHTML = `
                <div class="vem-update-banner">
                    <div class="vem-update-banner-icon"><i class="fa-solid fa-bell"></i></div>
                    <div class="vem-update-banner-text">
                        <strong>${t('vendor.updateRequest.title')}</strong><br>
                        ${t('vendor.updateRequest.desc')}
                    </div>
                    <button type="button" class="vem-update-banner-btn" onclick="openVendorStatusUpdateModal()">
                        <i class="fa-solid fa-arrow-up-right-dots"></i>
                        <span>${t('vendor.updateRequest.updateNow')}</span>
                    </button>
                </div>`;
        } else {
            container.innerHTML = '';
        }
    }

    window.openVendorStatusUpdateModal = function () {
        const evVendors = getEventVendors();
        const ev = evVendors.find(v => String(v.eventId) === String(currentManagedEventId));
        if (!ev) return;

        const prepStatus = ev.preparationStatus || 'Pending';
        const currentIdx = PREP_STATUSES.indexOf(prepStatus);
        const nextStatus = currentIdx < PREP_STATUSES.length - 1 ? PREP_STATUSES[currentIdx + 1] : null;

        if (!nextStatus) {
            showToast(t('vendor.prep.finalStatus').replace('{status}', prepStatusLabel('Ready')));
            return;
        }

        const rtlDoc = document.documentElement.getAttribute('dir') === 'rtl';
        const flowArrowHtml = `<div dir="ltr" aria-hidden="true" style="color: #bbb; font-size: 1rem;"><i class="fa-solid fa-arrow-${rtlDoc ? 'left' : 'right'}"></i></div>`;
        const submitArrowHtml = rtlDoc
            ? `<span dir="ltr" aria-hidden="true"><i class="fa-solid fa-arrow-left"></i></span>`
            : `<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>`;

        const displayEl = document.getElementById('vem-status-current-display');
        displayEl.innerHTML = `
            <div class="vem-status-current-dot" style="background: ${PREP_COLORS[prepStatus]};"></div>
            <div class="vem-status-current-label">${prepStatusLabel(prepStatus)}</div>
            ${flowArrowHtml}
            <div class="vem-status-current-dot" style="background: ${PREP_COLORS[nextStatus]};"></div>
            <div class="vem-status-current-label" style="color: ${PREP_COLORS[nextStatus]};">${prepStatusLabel(nextStatus)}</div>
        `;

        document.getElementById('vem-status-note').value = '';
        const submitBtn = document.getElementById('vem-submit-status-btn');
        submitBtn.innerHTML = `${submitArrowHtml}
            <span>${t('vendor.prep.advanceTo').replace('{status}', prepStatusLabel(nextStatus))}</span>`;

        const modal = document.getElementById('vem-status-update-modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
    };

    window.closeVendorStatusUpdateModal = function () {
        const modal = document.getElementById('vem-status-update-modal');
        modal.classList.add('hidden');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    };

    window.submitVendorStatusUpdate = function () {
        const note = document.getElementById('vem-status-note').value.trim();
        if (!note) { showToast(t('vendor.prep.noteRequired')); return; }

        const evVendors = getEventVendors();
        const ev = evVendors.find(v => String(v.eventId) === String(currentManagedEventId));
        if (!ev) return;

        const currentIdx = PREP_STATUSES.indexOf(ev.preparationStatus || 'Pending');
        const nextStatus = currentIdx < PREP_STATUSES.length - 1 ? PREP_STATUSES[currentIdx + 1] : null;
        if (!nextStatus) return;

        fetch('/api/update_vendor_status/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.CSRF_TOKEN },
            credentials: 'same-origin',
            body: JSON.stringify({
                event_id: currentManagedEventId,
                vendor_id: ev.vendorId,
                status: nextStatus,
                note: note
            })
        }).then(async () => {
            closeVendorStatusUpdateModal();
            await loadData();
            renderVendorPreparationCard(currentManagedEventId);
            renderUpdateRequestBanner(currentManagedEventId);
            showToast(t('vendor.prep.updatedTo').replace('{status}', prepStatusLabel(nextStatus)));
        }).catch(err => { console.error(err); showToast(t('vendor.prep.statusUpdateFailed')); });
    };

    const vemStatusModal = document.getElementById('vem-status-update-modal');
    if (vemStatusModal) vemStatusModal.addEventListener('click', (e) => { if (e.target === vemStatusModal) closeVendorStatusUpdateModal(); });

    // --- Open Vendor Event Management ---
    window.openVendorEventManage = function (eventId, requestId) {
        const events = getEvents();
        const evt = events.find(e => String(e.id) === String(eventId));
        if (!evt) return;

        const evVendor = getEventVendors().find(ev => String(ev.requestId) === String(requestId));
        const reqApp = getApplications().find(r => String(r.id) === String(requestId));
        const reqInv = getInvitations().find(r => String(r.id) === String(requestId));

        currentManagedEventId = eventId;
        currentManagedRequestId = requestId;

        document.getElementById('vem-event-title').textContent = evt.title;

        const todayStr = new Date().toISOString().split('T')[0];
        let stateTxt, stateColor, stateBg;
        if (evt.date === todayStr) { stateTxt = t('status.ongoing'); stateColor = '#2e7d32'; stateBg = 'rgba(46,125,50,0.2)'; }
        else if (evt.date > todayStr) { stateTxt = t('status.upcoming'); stateColor = '#7b1fa2'; stateBg = 'rgba(123,31,162,0.2)'; }
        else { stateTxt = t('status.past'); stateColor = '#757575'; stateBg = 'rgba(117,117,117,0.2)'; }
        const stateBadge = document.getElementById('vem-event-state-badge');
        stateBadge.textContent = stateTxt;
        stateBadge.style.background = stateBg;
        stateBadge.style.color = stateColor;

        const svcRaw = (evVendor && evVendor.serviceType)
            || (reqApp && reqApp.serviceType)
            || (reqInv && reqInv.serviceType)
            || '';

        const roleBadge = document.getElementById('vem-role-badge');
        if (roleBadge) roleBadge.textContent = t('vendor.role');

        document.getElementById('vem-stat-organizer').textContent = evt.organizer || t('vendor.eventManage.organizerFallback');
        document.getElementById('vem-stat-service').textContent = svcRaw
            ? (t(serviceTypeMap[svcRaw]) || svcRaw)
            : '\u2014';
        document.getElementById('vem-stat-attendees').textContent = evt.attendees || 0;

        const diffMs = new Date(evt.date) - new Date(todayStr);
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const countdownEl = document.getElementById('vem-stat-countdown');
        if (diffDays > 0) countdownEl.textContent = diffDays;
        else if (diffDays === 0) countdownEl.textContent = t('common.today');
        else countdownEl.textContent = t('common.ended');

        document.getElementById('vem-ov-title').textContent = evt.title;
        document.getElementById('vem-ov-category').textContent = translateEventCategory(evt.category);

        document.getElementById('vem-ov-description').textContent =
            evt.description ? String(evt.description) : '';

        const lang = localStorage.getItem('eventia_lang') || 'en';
        const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

        document.getElementById('vem-ov-date').textContent = new Date(evt.date).toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        document.getElementById('vem-ov-time').textContent = evt.time || t('common.tbd');
        document.getElementById('vem-ov-location').textContent = evt.location || t('common.tbd');

        const ticketsEl = document.getElementById('vem-ov-tickets');
        if (evt.tickets && evt.tickets.length > 0) {
            ticketsEl.innerHTML =
                '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">' +
                evt.tickets.map(tk =>
                    `<div class="em-ticket-tier"><span class="tier-name">${tk.name}</span><span class="tier-price">${parseFloat(tk.price) > 0 ? tk.price + ' ' + SAR_ICON : t('common.free')}</span></div>`
                ).join('') +
                '</div>';
        } else {
            ticketsEl.innerHTML = `<p style="color:#888;margin:0;">${t('org.em.noTicketTiers')}</p>`;
        }

        const policyMeta = {
            'flexible': { label: t('vendor.policy.badgeFlexible'), css: 'em-policy-flexible', desc: t('vendor.policy.descFlexible') },
            'moderate': { label: t('vendor.policy.badgeModerate'), css: 'em-policy-moderate', desc: t('vendor.policy.descModerate') },
            'strict': { label: t('vendor.policy.badgeStrict'), css: 'em-policy-strict', desc: t('vendor.policy.descStrict') },
            'non-refundable': { label: t('vendor.policy.badgeNonRefundable'), css: 'em-policy-non-refundable', desc: t('vendor.policy.descNonRefundable') }
        };
        const np = normalizeWithdrawalPolicyKey(evt.withdrawalPolicy);
        const vendorPol = np ? policyMeta[np] : null;
        const vendorBadgeEl = document.getElementById('vem-ov-vendor-policy-badge');
        const vendorDescEl = document.getElementById('vem-ov-vendor-policy-desc');
        vendorBadgeEl.className = 'em-policy-badge ' + (vendorPol ? vendorPol.css : 'em-policy-none');
        vendorBadgeEl.textContent = vendorPol ? vendorPol.label : t('common.dashNotSet');
        vendorDescEl.textContent = vendorPol ? vendorPol.desc : t('org.policy.vendor.notConfigured');

        renderVendorOrgConversation(eventId);
        renderVendorPreparationCard(eventId);
        renderUpdateRequestBanner(eventId);

        const isPast = new Date(evt.date) < new Date();
        const withdrawBtn = document.getElementById('vem-withdraw-btn');
        if (isPast) {
            withdrawBtn.disabled = true;
            withdrawBtn.style.opacity = '0.5';
            withdrawBtn.style.cursor = 'not-allowed';
            withdrawBtn.textContent = t('vendor.eventManage.eventEnded');
        } else {
            withdrawBtn.disabled = false;
            withdrawBtn.style.opacity = '1';
            withdrawBtn.style.cursor = 'pointer';
            withdrawBtn.innerHTML = `<i class="fa-solid fa-xmark"></i> <span>${t('vendor.eventManage.withdraw')}</span>`;
            withdrawBtn.onclick = function () { openWithdrawModal(requestId); };
        }

        document.querySelectorAll('[data-vemtab]').forEach(tabEl => tabEl.classList.remove('active'));
        document.querySelectorAll('[id^="vem-tab-"]').forEach(tc => {
            if (tc.classList.contains('em-tab-content')) tc.classList.remove('active');
        });
        const overviewTab = document.querySelector('[data-vemtab="overview"]');
        if (overviewTab) overviewTab.classList.add('active');
        const overviewContent = document.getElementById('vem-tab-overview');
        if (overviewContent) overviewContent.classList.add('active');

        switchView('event-manage');
    };

    /** Re-render event-manage metrics when language changes (applyLang refreshes DOM text from t()). */
    window.refreshVendorEventManageIfOpen = function () {
        if (!currentManagedEventId || !currentManagedRequestId) return;
        const eventManageView = document.getElementById('view-event-manage');
        if (!eventManageView || !eventManageView.classList.contains('active')) return;
        openVendorEventManage(currentManagedEventId, currentManagedRequestId);
    };

    // Tab switching for vendor event manage
    document.querySelectorAll('[data-vemtab]').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('[data-vemtab]').forEach(t => t.classList.remove('active'));
            document.getElementById('vem-tab-overview').classList.remove('active');
            document.getElementById('vem-tab-communication').classList.remove('active');
            document.getElementById('vem-tab-actions').classList.remove('active');
            tab.classList.add('active');
            document.getElementById('vem-tab-' + tab.dataset.vemtab).classList.add('active');
        });
    });

    // --- Render organizer conversation preview ---
    function renderVendorOrgConversation(eventId) {
        const msgs = messagesForVendorEvent(eventId);
        const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

        const events = getEvents();
        const evt = events.find(e => String(e.id) === String(eventId));
        const orgName = (evt && evt.organizer) || t('vendor.chat.organizerFallback');

        const convNameEl = document.getElementById('vem-org-conv-name');
        const convMsgEl = document.getElementById('vem-org-conv-last-msg');
        const convTimeEl = document.getElementById('vem-org-conv-time');
        const convCountEl = document.getElementById('vem-org-conv-count');

        const lang = localStorage.getItem('eventia_lang') || 'en';
        const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

        if (convNameEl) convNameEl.textContent = orgName;
        if (lastMsg) {
            const lastMsgText = (lastMsg.sender === 'vendor' ? t('vendor.chat.youPrefix') : '') + lastMsg.text;
            if (convMsgEl) convMsgEl.textContent = lastMsgText;
            if (convTimeEl) {
                convTimeEl.textContent = new Date(lastMsg.timestamp).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
            }
        } else {
            if (convMsgEl) convMsgEl.textContent = t('vendor.chat.noMessagesPreview');
            if (convTimeEl) convTimeEl.textContent = '';
        }

        const orgMsgCount = msgs.filter(m => m.sender === 'organizer').length;
        if (convCountEl) {
            if (orgMsgCount > 0) { convCountEl.textContent = orgMsgCount; convCountEl.style.display = 'flex'; }
            else { convCountEl.style.display = 'none'; }
        }

        const convItem = document.getElementById('vem-organizer-conv');
        if (convItem) convItem.onclick = function () { openOrganizerChat(eventId); };
    }

    // --- Organizer Chat ---
    window.openOrganizerChat = function (eventId) {
        currentManagedEventId = eventId;
        const events = getEvents();
        const evt = events.find(e => String(e.id) === String(eventId));
        const orgName = (evt && evt.organizer) || t('vendor.chat.organizerFallback');

        document.getElementById('vem-chat-org-name').textContent = orgName;
        document.getElementById('vem-chat-event-name').textContent = evt ? evt.title : t('common.event');

        renderVendorChatMessages(eventId);

        const modal = document.getElementById('vem-chat-modal');
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
    };

    window.closeOrganizerChat = function () {
        const modal = document.getElementById('vem-chat-modal');
        modal.classList.add('hidden');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
        if (currentManagedEventId) renderVendorOrgConversation(currentManagedEventId);
    };

    function renderVendorChatMessages(eventId) {
        const msgs = messagesForVendorEvent(eventId);
        const body = document.getElementById('vem-chat-body');

        const lang = localStorage.getItem('eventia_lang') || 'en';
        const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';

        if (msgs.length === 0) {
            body.innerHTML = `<div class="em-empty-state" style="margin:auto;"><i class="fa-solid fa-comments"></i><p>${t('vendor.chat.noMessages')}</p></div>`;
        } else {
            body.innerHTML = msgs.map(m => {
                const cls = m.sender === 'vendor' ? 'sent' : 'received';
                const time = new Date(m.timestamp).toLocaleString(locale, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                return `<div class="em-chat-msg ${cls}">${m.text}<span class="em-chat-msg-time">${time}</span></div>`;
            }).join('');
        }
        setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);
    }
    // Expose so vendor-dashboard.html's customSendMessage can re-render after
    // reloading API_DATA, without triggering the heavy full-dashboard refresh.
    window.renderVendorChatMessages = renderVendorChatMessages;

    // Send chat message as vendor
    const vemChatSendBtn = document.getElementById('vem-chat-send-btn');
    const vemChatInput = document.getElementById('vem-chat-input');
    if (vemChatSendBtn && vemChatInput) {
        function sendVendorChatMessage() {
            const text = vemChatInput.value.trim();
            if (!text || !currentManagedEventId) return;

            const evVendor = getEventVendors().find(v => String(v.eventId) === String(currentManagedEventId));
            if (!evVendor) return;

            fetch('/api/send_message/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.CSRF_TOKEN },
                credentials: 'same-origin',
                body: JSON.stringify({
                    event_id: currentManagedEventId,
                    vendor_id: evVendor.vendorId,
                    sender: 'vendor',
                    text: text
                })
            }).then(async () => {
                vemChatInput.value = '';
                await loadData();
                renderVendorChatMessages(currentManagedEventId);
            }).catch(err => { console.error(err); showToast(t('vendor.chat.sendFailed')); });
        }

        vemChatSendBtn.addEventListener('click', sendVendorChatMessage);
        vemChatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendVendorChatMessage(); } });
    }

    const vemChatModal = document.getElementById('vem-chat-modal');
    if (vemChatModal) vemChatModal.addEventListener('click', (e) => { if (e.target === vemChatModal) closeOrganizerChat(); });

    // ================================================================
    // VENDOR UNREAD MESSAGE BADGE SYSTEM
    // Updates three surfaces:
    //   1. "My Events" nav badge (sidebar) — total unread across all events
    //   2. "Communication" tab badge — unread for the currently managed event
    //   3. Per-event manage button corner badge in the My Events list
    // ================================================================

    // Read-tracker: keyed by eventId, stores ISO timestamp of last read
    let vendorChatReadTracker = JSON.parse(localStorage.getItem('eventia_vendor_chat_read_v1') || '{}');
    function saveVendorChatTracker() {
        localStorage.setItem('eventia_vendor_chat_read_v1', JSON.stringify(vendorChatReadTracker));
    }

    // Count unread organizer messages for a given event
    function getVendorUnreadForEvent(eventId) {
        const msgs = messagesForVendorEvent(eventId);
        const lastRead = vendorChatReadTracker[String(eventId)] || null;
        const orgMsgs = msgs.filter(m => m.sender === 'organizer');
        if (!lastRead) return orgMsgs.length;
        return orgMsgs.filter(m => new Date(m.timestamp) > new Date(lastRead)).length;
    }

    // Total unread across all vendor events
    function getVendorTotalUnread() {
        return getEventVendors().reduce((sum, ev) => sum + getVendorUnreadForEvent(ev.eventId), 0);
    }

    // Patch sidebar "My Events" nav badge
    function patchVendorNavBadge() {
        const badge = document.getElementById('nav-my-events-unread-badge');
        if (!badge) return;
        const count = getVendorTotalUnread();
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : String(count);
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // Patch "Communication" tab badge for the currently open event manage view
    function patchVendorCommTabBadge() {
        const badge = document.getElementById('vem-comm-tab-badge');
        if (!badge || !currentManagedEventId) return;
        const count = getVendorUnreadForEvent(currentManagedEventId);
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : String(count);
            badge.style.display = 'inline-flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // Patch per-event manage button corner badges in My Events list
    function patchVendorMyEventsBadges() {
        const container = document.getElementById('my-events-container');
        if (!container) return;

        container.querySelectorAll('.vendor-manage-btn[data-event-id]').forEach(btn => {
            const eventId = btn.dataset.eventId;
            const count = getVendorUnreadForEvent(eventId);

            let wrap = btn.closest('.manage-btn-wrap');
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.className = 'manage-btn-wrap';
                btn.parentNode.insertBefore(wrap, btn);
                wrap.appendChild(btn);
            }

            let badge = wrap.querySelector('.manage-btn-badge');
            if (count > 0) {
                const label = count > 99 ? '99+' : String(count);
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'manage-btn-badge';
                    badge.title = 'Unread messages from organizer';
                    badge.textContent = label;
                    wrap.appendChild(badge);
                } else {
                    badge.textContent = label;
                    badge.style.display = 'flex';
                }
            } else {
                if (badge) badge.style.display = 'none';
            }
        });
    }

    // Master refresh — called after every data load and on polling
    window.patchVendorAllUnreadBadges = function () {
        patchVendorNavBadge();
        patchVendorCommTabBadge();
        patchVendorMyEventsBadges();
    };

    // Mark an event's messages as read when chat is opened
    const _origOpenOrgChat = window.openOrganizerChat;
    window.openOrganizerChat = function (eventId) {
        vendorChatReadTracker[String(eventId)] = new Date().toISOString();
        saveVendorChatTracker();
        if (_origOpenOrgChat) _origOpenOrgChat(eventId);
        patchVendorCommTabBadge();
        patchVendorMyEventsBadges();
        patchVendorNavBadge();
    };

    const _origCloseOrgChat = window.closeOrganizerChat;
    window.closeOrganizerChat = function () {
        if (currentManagedEventId) {
            vendorChatReadTracker[String(currentManagedEventId)] = new Date().toISOString();
            saveVendorChatTracker();
        }
        if (_origCloseOrgChat) _origCloseOrgChat();
        window.patchVendorAllUnreadBadges();
    };

    function renderAllAfterFetch() {
        renderUpcomingEvents();
        renderMyApplications();
        renderInvitations();
        renderMyEvents();
        renderBrowseEvents();
        updateStats();
        const activeView = document.querySelector('.content-section.active');
        if (activeView) {
            const viewId = activeView.id.replace('view-', '');
            switchView(viewId);
        }
        const eventManageView = document.getElementById('view-event-manage');
        if (
            eventManageView &&
            eventManageView.classList.contains('active') &&
            currentManagedEventId &&
            currentManagedRequestId
        ) {
            openVendorEventManage(currentManagedEventId, currentManagedRequestId);
        }
        // Patch all badge surfaces after every render
        setTimeout(() => { if (typeof window.patchVendorAllUnreadBadges === 'function') window.patchVendorAllUnreadBadges(); }, 0);
    }

    window.renderAll = async function () {
        return loadData().then(() => renderAllAfterFetch());
    };

    loadData().then(() => renderAllAfterFetch());
}
