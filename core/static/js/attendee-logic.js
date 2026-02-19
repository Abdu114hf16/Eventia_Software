/**
 * ATTENDEE PAGE LOGIC (API CONNECTED)
 * Features:
 * 1. Digital Ticket Design (No Cancellation)
 * 2. Square Details Modal
 * 3. Real Django Data
 */

(async function () {
    console.log("Initializing Dashboard with Django API...");

    // --- GLOBAL DATA STORE ---
    let API_DATA = { events: [], profile: {} };

    // --- 1. DATA ACCESS (API) ---
    async function initData() {
        try {
            const response = await fetch('/api/attendee/data/');
            if (!response.ok) throw new Error('Failed to load data');
            API_DATA = await response.json();

            // Once data is ready, render the page
            renderAll();
            loadProfile();
        } catch (error) {
            console.error("API Error:", error);
            // Fallback for demo purposes if API fails
            showToast("Error loading data. Please refresh.");
        }
    }

    function getEvents() {
        return API_DATA.events || [];
    }

    function getProfile() {
        return API_DATA.profile || {};
    }

    // --- 2. UTILS ---
    const categoryGradients = {
        'Tech': 'linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)',
        'Art': 'linear-gradient(135deg, #8E2DE2, #4A00E0)',
        'Business': 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)',
        'Music': 'linear-gradient(135deg, #eb3349, #f45c43)',
        'Education': 'linear-gradient(135deg, #11998e, #38ef7d)',
        'Sports': 'linear-gradient(135deg, #fc4a1a, #f7b733)',
        'Other': 'linear-gradient(135deg, #636363, #a2ab58)'
    };

    const categoryIcons = {
        'Tech': 'fa-laptop-code',
        'Art': 'fa-palette',
        'Business': 'fa-briefcase',
        'Music': 'fa-music',
        'Education': 'fa-graduation-cap',
        'Sports': 'fa-futbol',
        'Other': 'fa-calendar'
    };

    // --- 3. RENDER BROWSE EVENTS ---
    function renderBrowseEvents() {
        const events = getEvents();
        const grid = document.getElementById('landing-events-grid');
        if (!grid) return;

        // Search Filters
        const searchVal = (document.getElementById('landing-search')?.value || '').toLowerCase();
        const locVal = document.getElementById('landing-location-filter')?.value || 'all';
        const catVal = document.querySelector('.cat-pill.active')?.dataset.category || 'all';

        let filtered = events.filter(e => {
            if (e.status === 'past') return false;
            const matchesCat = catVal === 'all' || e.category === catVal;
            const matchesLoc = locVal === 'all' || (e.location && e.location.includes(locVal));
            const matchesSearch = !searchVal ||
                e.title.toLowerCase().includes(searchVal) ||
                (e.description && e.description.toLowerCase().includes(searchVal));
            return matchesCat && matchesLoc && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">No events found.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(evt => {
            const gradient = categoryGradients[evt.category] || categoryGradients['Other'];
            const icon = categoryIcons[evt.category] || 'fa-calendar';
            const priceDisplay = evt.price > 0 ? `From ${evt.price} SAR` : 'Free';

            let actionBtn = '';
            if (evt.isRegistered) {
                actionBtn = `<button class="btn btn-sm" style="background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; cursor: default;" disabled><i class="fa-solid fa-check"></i> Registered</button>`;
            } else {
                actionBtn = `<a href="/dashboard/attendee/register/${evt.id}/" class="btn btn-sm" style="background: #e3f2fd; color: #1565c0; border: 1px solid #bbdefb;"><i class="fa-solid fa-ticket"></i> Register</a>`;
            }

            return `
                <div class="lp-event-card reveal-on-scroll revealed">
                    <div class="lp-card-image" style="background: ${gradient};">
                        <i class="fa-solid ${icon}"></i>
                        <div class="lp-card-badge">${evt.category}</div>
                        <div class="lp-card-price">${priceDisplay}</div>
                    </div>
                    <div class="lp-card-body">
                        <h3 class="lp-card-title">${evt.title}</h3>
                        <div class="lp-card-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${evt.date}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
                        </div>
                        <p class="lp-card-desc">${(evt.description || '').substring(0, 80)}...</p>
                        <div class="lp-card-footer" style="display: flex; gap: 0.5rem;">
                             <button class="btn btn-primary btn-sm lp-view-btn" onclick="viewEventDetails('${evt.id}')">View Details</button>
                            ${actionBtn}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // --- 4. RENDER MY TICKETS (CANCEL BUTTON REMOVED) ---
    function renderMyTickets() {
        const container = document.getElementById('my-tickets-container');
        if (!container) return;

        const events = getEvents();
        const myTickets = events.filter(e => e.isRegistered && e.status === 'upcoming');

        if (myTickets.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">No upcoming tickets.</div>`;
            return;
        }

        container.innerHTML = myTickets.map(evt => {
            const gradient = categoryGradients[evt.category] || categoryGradients['Other'];
            const eventDate = new Date(evt.date);
            const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();
            const ticketCode = `EVT-${evt.id}-TKT-${evt.ticketId}`;

            return `
                <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;">
                    <div style="background: ${gradient}; padding: 1.25rem; color: white; position: relative;">
                        <div style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; backdrop-filter: blur(4px);">${evt.category}</div>
                        <h3 style="margin: 0 0 0.5rem; font-size: 1.1rem;">${evt.title}</h3>
                        <div style="font-size: 0.85rem; opacity: 0.9;">
                             <i class="fa-regular fa-calendar"></i> ${month} ${day} &nbsp;
                             <i class="fa-regular fa-clock"></i> ${evt.time} &nbsp;
                             <i class="fa-solid fa-location-dot"></i> ${evt.location}
                        </div>
                    </div>
                    <div style="padding: 1.25rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px dashed #e0e0e0;">
                            <div>
                                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; font-weight: 600;">Ticket Type</div>
                                <div style="font-weight: 600; color: #333;">Standard Admission</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; font-weight: 600;">Price</div>
                                <div style="font-weight: 600; color: #004e92;">${evt.price > 0 ? evt.price + ' SAR' : 'Free'}</div>
                            </div>
                        </div>
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; text-align: center;">
                            <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Digital Ticket Code</div>
                            <div style="font-family: monospace; font-size: 1.2rem; font-weight: 700; color: #1565c0; letter-spacing: 2px;">${ticketCode}</div>
                            <div style="font-size: 0.75rem; color: #999; margin-top: 4px;">Date: ${evt.date}</div>
                        </div>
                        <div style="margin-top: 1rem; text-align: center;">
                            <span style="display: inline-block; padding: 6px 12px; background: #e8f5e9; color: #2e7d32; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                                <i class="fa-solid fa-check-circle"></i> Booking Confirmed
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // --- 5. VIEW EVENT DETAILS (SQUARE MODAL) ---
    window.viewEventDetails = function(eventId) {
        const events = getEvents();
        // Loose comparison for ID
        const evt = events.find(e => e.id == eventId);
        if (!evt) return;

        // Remove existing modal if any
        const existing = document.getElementById('event-detail-modal');
        if (existing) existing.remove();

        const priceDisplay = evt.price > 0 ? `${evt.price} SAR` : 'Free';
        const actionBtn = evt.isRegistered
            ? `<button style="width:100%; padding: 12px; background: #e8f5e9; color: #2e7d32; border: none; border-radius: 8px; font-weight: 600;" disabled>Registered</button>`
            : `<a href="/dashboard/attendee/register/${evt.id}/" style="display:block; text-align:center; width:100%; padding: 12px; background: #004e92; color: white; border: none; border-radius: 8px; font-weight: 600; text-decoration:none;">Register Now</a>`;

        const modal = document.createElement('div');
        modal.id = 'event-detail-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);" onclick="if(event.target === this) this.parentElement.remove()">
                <div style="background: white; border-radius: 16px; width: 90%; max-width: 500px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: fadeIn 0.3s ease;">
                    <div style="background: linear-gradient(135deg, #004e92, #4dabf7); padding: 1.5rem; color: white; display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; display: inline-block; margin-bottom: 0.5rem;">${evt.category}</div>
                            <h2 style="margin: 0; font-size: 1.4rem;">${evt.title}</h2>
                        </div>
                        <button onclick="this.closest('#event-detail-modal').remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div style="padding: 1.5rem;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px;">
                                <div style="font-size: 0.75rem; color: #666; text-transform: uppercase;">Date</div>
                                <div style="font-weight: 600;">${evt.date}</div>
                            </div>
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px;">
                                <div style="font-size: 0.75rem; color: #666; text-transform: uppercase;">Time</div>
                                <div style="font-weight: 600;">${evt.time}</div>
                            </div>
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px;">
                                <div style="font-size: 0.75rem; color: #666; text-transform: uppercase;">Location</div>
                                <div style="font-weight: 600;">${evt.location}</div>
                            </div>
                            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px;">
                                <div style="font-size: 0.75rem; color: #666; text-transform: uppercase;">Price</div>
                                <div style="font-weight: 600; color: #004e92;">${priceDisplay}</div>
                            </div>
                        </div>
                        <div style="margin-bottom: 2rem;">
                            <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem; color: #333;">About Event</h4>
                            <p style="color: #666; line-height: 1.6; font-size: 0.95rem;">${evt.description}</p>
                        </div>
                        ${actionBtn}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    // --- 6. RENDER HISTORY ---
    function renderHistory() {
        const container = document.getElementById('history-container');
        if (!container) return;
        const events = getEvents();
        const history = events.filter(e => e.isRegistered && e.status === 'past');
        if (history.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 4rem; color: #888;">No past events.</div>`;
            return;
        }
        container.innerHTML = history.map(evt => {
            return `
                <div style="background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #e8e8e8; display: flex; justify-content: space-between; align-items: center;">
                    <div><h4 style="margin: 0;">${evt.title}</h4><div style="color: #666; font-size: 0.9rem;">${evt.date}</div></div>
                    <span style="background: #e8f5e9; color: #2e7d32; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Attended</span>
                </div>`;
        }).join('');
    }

    // --- 7. PROFILE ---
    function loadProfile() {
        const profile = getProfile();
        const fields = {
            'profile-firstname': profile.firstName,
            'profile-lastname': profile.lastName,
            'profile-email': profile.email,
            'profile-phone': profile.phone,
            'attendee-hero-name': profile.firstName
        };
        for (const [id, val] of Object.entries(fields)) {
            const el = document.getElementById(id);
            if (el) {
                if(el.tagName === 'INPUT') el.value = val || '';
                else el.textContent = val || '';
            }
        }
    }

    // --- 8. NAVIGATION ---
    function switchAttendeeView(viewName, scrollTo) {
        document.querySelectorAll('.attendee-view').forEach(v => v.style.display = 'none');
        const target = document.getElementById('view-' + viewName);
        if (target) target.style.display = '';

        document.querySelectorAll('.nav-links .att-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === viewName && !link.dataset.scroll) link.classList.add('active');
        });

        if (scrollTo) {
            setTimeout(() => {
                const el = document.getElementById(scrollTo);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    document.querySelectorAll('.att-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchAttendeeView(link.dataset.view, link.dataset.scroll);
        });
    });

    // --- 9. HELPERS ---
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #333; color: white; padding: 14px 28px; border-radius: 10px; z-index: 10000;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function renderAll() {
        renderBrowseEvents();
        renderMyTickets();
        renderHistory();
    }

    // Init
    await initData();

})();