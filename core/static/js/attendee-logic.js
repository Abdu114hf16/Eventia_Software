/**
 * ATTENDEE PAGE LOGIC (API CONNECTED)
 * Replaces LocalStorage with Django Backend API
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
            console.log("API Data Loaded:", API_DATA);

            // Once data is ready, render the page
            renderAll();
            loadProfile();
        } catch (error) {
            console.error("API Error:", error);
            showToast("Error loading data. Please refresh the page.");
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
            if (e.status === 'past') return false; // Show only upcoming in browse
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
            // Price Display
            const priceDisplay = evt.price > 0 ? `From ${evt.price} SAR` : 'Free';

            // Action Button Logic
            let actionBtn = '';
            if (evt.isRegistered) {
                actionBtn = `<button class="btn btn-sm" style="background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; cursor: default;" disabled><i class="fa-solid fa-check"></i> Registered</button>`;
            } else {
                // IMPORTANT: Links to Django Register URL
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

    // --- 4. RENDER MY TICKETS ---
    function renderMyTickets() {
        const container = document.getElementById('my-tickets-container');
        if (!container) return;

        const events = getEvents();
        // Filter events where user is registered AND date is upcoming
        const myTickets = events.filter(e => e.isRegistered && e.status === 'upcoming');

        if (myTickets.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">No upcoming tickets.</div>`;
            return;
        }

        container.innerHTML = myTickets.map(evt => {
            const gradient = categoryGradients[evt.category] || categoryGradients['Other'];
            // IMPORTANT: Links to Django Cancel URL
            return `
                <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e8e8e8;">
                    <div style="background: ${gradient}; padding: 1.25rem; color: white;">
                        <h3 style="margin: 0 0 0.5rem; font-size: 1.1rem;">${evt.title}</h3>
                        <div style="font-size: 0.85rem; opacity: 0.9;">
                             <i class="fa-regular fa-calendar"></i> ${evt.date} &nbsp; ${evt.time}
                        </div>
                    </div>
                    <div style="padding: 1.25rem;">
                        <div style="background: #f8f9fa; padding: 1rem; border-radius: 10px; text-align: center; margin-bottom: 1rem;">
                            <div style="font-size: 0.7rem; color: #888; text-transform: uppercase;">Ticket Status</div>
                            <div style="font-weight: 700; color: #2e7d32;">CONFIRMED</div>
                        </div>
                        <a href="/dashboard/attendee/cancel/${evt.ticketId}/" class="btn btn-outline" style="width:100%; border-color:#ef5350; color:#ef5350; display:block; text-align:center; text-decoration:none;" onclick="return confirm('Cancel this ticket?')">Cancel Ticket</a>
                    </div>
                </div>
            `;
        }).join('');
    }

    // --- 5. RENDER HISTORY ---
    function renderHistory() {
        const container = document.getElementById('history-container');
        if (!container) return;

        const events = getEvents();
        // Filter events where user is registered AND date is past
        const history = events.filter(e => e.isRegistered && e.status === 'past');

        if (history.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 4rem; color: #888;">No past events.</div>`;
            return;
        }

        container.innerHTML = history.map(evt => {
            return `
                <div style="background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #e8e8e8; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0; font-size: 1.1rem; font-weight: 600;">${evt.title}</h4>
                        <div style="color: #666; font-size: 0.9rem; margin-top: 5px;">${evt.date}</div>
                    </div>
                    <span style="background: #e8f5e9; color: #2e7d32; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Attended</span>
                </div>
            `;
        }).join('');
    }

    // --- 6. PROFILE & STATS ---
    function loadProfile() {
        const profile = getProfile();
        // Update DOM elements if they exist
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

    function updateStats() {
        const events = getEvents();
        const registeredCount = events.filter(e => e.isRegistered).length;
        const upcomingCount = events.filter(e => e.isRegistered && e.status === 'upcoming').length;
        const attendedCount = events.filter(e => e.isRegistered && e.status === 'past').length;

        const setStat = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
        setStat('stat-registered', registeredCount);
        setStat('stat-upcoming-count', upcomingCount);
        setStat('stat-attended', attendedCount);
    }

    // --- 7. NAVIGATION ---
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

    // Listeners
    document.querySelectorAll('.att-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchAttendeeView(link.dataset.view, link.dataset.scroll);
        });
    });

    // --- INIT ---
    window.viewEventDetails = function(id) { alert("Details for event " + id); }; // Placeholder for detail modal
    function renderAll() {
        renderBrowseEvents();
        renderMyTickets();
        renderHistory();
        updateStats();
    }

    // Start Fetching Data
    await initData();

})();