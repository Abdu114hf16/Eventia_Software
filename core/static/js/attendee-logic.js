/**
 * ATTENDEE PAGE LOGIC
 * Integrated with Django Backend
 */

(function () {
    // --- DATA ACCESS (Updated for Django) ---

    // Instead of LocalStorage, we use the data injected by Django into the window object
    function getEvents() {
        return window.DJANGO_EVENTS || [];
    }

    function getProfile() {
        return window.DJANGO_PROFILE || {
            username: 'Guest',
            email: '--',
            role: 'Attendee',
            initial: 'G'
        };
    }

    // --- DOM ELEMENTS ---
    const mainContent = document.querySelector('main');
    const navLinks = document.querySelectorAll('.att-nav-link');

    // --- HELPER: CREATE EVENT CARD ---
    function createEventCard(evt, isBrowseMode = true) {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        card.style.animation = 'modalSlideIn 0.4s ease'; // Use your animation

        // Dynamic Badge Color based on Category
        let badgeColor = '#004e92';
        if(evt.category === 'Art') badgeColor = '#e84393';
        if(evt.category === 'Tech') badgeColor = '#0984e3';

        const actionButton = isBrowseMode
            ? (evt.isRegistered
                ? `<button class="btn btn-sm btn-outline disabled" style="border-color: #2ecc71; color: #2ecc71;">Registered</button>`
                : `<a href="/dashboard/attendee/register/${evt.id}/" class="btn btn-sm btn-primary">Register</a>`)
            : `<a href="/dashboard/attendee/cancel/${evt.ticketId}/" class="btn btn-sm btn-outline" style="color: #c62828; border-color: #c62828;">Cancel</a>`;

        card.innerHTML = `
            <div class="ticket-header" style="background: linear-gradient(135deg, ${badgeColor}, #2d3436);">
                <span style="background: rgba(255,255,255,0.9); color: ${badgeColor}; padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 0.75rem;">
                    ${evt.category}
                </span>
            </div>
            <div class="ticket-body">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin: 0 0 5px 0; font-size: 1.1rem; font-weight: 700;">${evt.title}</h3>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">
                            <i class="fa-solid fa-location-dot"></i> ${evt.location}
                        </p>
                    </div>
                    <div style="text-align: center; background: #f8f9fa; padding: 5px 10px; border-radius: 8px; border: 1px solid #eee;">
                        <div style="font-weight: 700; font-size: 1.2rem; color: #004e92; line-height: 1;">${new Date(evt.date).getDate()}</div>
                        <div style="font-size: 0.7rem; text-transform: uppercase; color: #666;">${new Date(evt.date).toLocaleString('default', { month: 'short' })}</div>
                    </div>
                </div>

                <p style="font-size: 0.9rem; color: #555; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${evt.description}
                </p>

                <div style="display: flex; gap: 10px; margin-top: auto; align-items: center; justify-content: space-between;">
                    <span style="font-weight: 700; color: #2d3436;">${evt.price == 0 ? 'Free' : evt.price + ' SAR'}</span>
                    ${actionButton}
                </div>
            </div>
        `;
        return card;
    }

    // --- RENDER VIEWS ---

    function renderHome() {
        const events = getEvents();
        // Filter for "My Tickets" (Registered + Upcoming)
        const myTickets = events.filter(e => e.isRegistered && e.status === 'upcoming');

        let html = `
            <div style="background: linear-gradient(135deg, #004e92, #4dabf7); padding: 3rem; border-radius: 20px; color: white; margin-bottom: 3rem; text-align: center;">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">Find Your Next Experience</h1>
                <div class="search-bar" style="max-width: 600px; margin: 0 auto; position: relative;">
                    <input type="text" placeholder="Search events..." style="width: 100%; padding: 15px 20px; border-radius: 50px; border: none;">
                </div>
            </div>

            <div id="my-tickets-section" style="margin-bottom: 3rem;">
                <div class="section-header" style="display:flex; justify-content:space-between; margin-bottom: 1.5rem;">
                    <h2 style="font-size: 1.8rem; color: #333;">My Upcoming Tickets</h2>
                </div>
                <div class="tickets-grid" id="my-tickets-grid"></div>
            </div>

            <div id="browse-section">
                <h2 style="font-size: 1.8rem; color: #333; margin-bottom: 1.5rem;">Browse Events</h2>
                <div class="tickets-grid" id="browse-grid"></div>
            </div>
        `;

        document.getElementById('view-home').innerHTML = html;

        // Populate Grids
        const ticketGrid = document.getElementById('my-tickets-grid');
        const browseGrid = document.getElementById('browse-grid');

        // My Tickets
        if (myTickets.length === 0) {
            ticketGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:#888;">No upcoming tickets.</div>`;
        } else {
            myTickets.forEach(evt => ticketGrid.appendChild(createEventCard(evt, false)));
        }

        // Browse (All Upcoming Events)
        const browseEvents = events.filter(e => e.status === 'upcoming');
        browseEvents.forEach(evt => browseGrid.appendChild(createEventCard(evt, true)));
    }

    function renderHistory() {
        const events = getEvents();
        const history = events.filter(e => e.isRegistered && e.status === 'past');

        let html = `<h2 style="margin-bottom: 1.5rem;">Event History</h2><div style="background: white; border-radius: 12px; border: 1px solid #eee;">`;

        if(history.length === 0) {
            html += `<div style="padding: 3rem; text-align: center; color: #999;">No past events found.</div>`;
        } else {
            history.forEach(evt => {
                html += `
                <div style="display: flex; padding: 1.5rem; border-bottom: 1px solid #eee; align-items: center; justify-content: space-between;">
                    <div style="display: flex; gap: 1.5rem; align-items: center;">
                        <div style="background: #f1f3f5; width: 60px; height: 60px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                            <span style="font-weight: 700;">${new Date(evt.date).getDate()}</span>
                            <span style="font-size: 0.7rem;">${new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div>
                            <h4 style="margin: 0;">${evt.title}</h4>
                            <span style="font-size: 0.9rem; color: #666;">${evt.location}</span>
                        </div>
                    </div>
                    <span class="status-badge" style="background: #e8f5e9; color: #2e7d32; padding: 5px 12px; border-radius: 15px; font-size: 0.8rem;">Attended</span>
                </div>`;
            });
        }
        html += `</div>`;
        document.getElementById('view-history').innerHTML = html;
    }

    function renderProfile() {
        const profile = getProfile();
        const html = `
            <div style="max-width: 600px; background: white; padding: 2rem; border-radius: 12px; border: 1px solid #eee;">
                <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;">
                    <div style="width: 80px; height: 80px; background: #004e92; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                        ${profile.initial}
                    </div>
                    <div>
                        <h2 style="margin: 0;">${profile.username}</h2>
                        <p style="color: #666; margin: 0;">${profile.email}</p>
                    </div>
                </div>
                <div class="input-group" style="margin-bottom: 1rem;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Role</label>
                    <input type="text" value="${profile.role}" disabled style="width:100%; padding:10px; border:1px solid #eee; border-radius:8px; background:#f9f9f9;">
                </div>
            </div>
        `;
        document.getElementById('view-profile').innerHTML = html;
    }

    // --- NAVIGATION LOGIC ---
    function switchView(viewName) {
        // Hide all sections
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        // Show target
        const target = document.getElementById('view-' + viewName);
        if(target) target.classList.add('active');

        // Update Nav
        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.dataset.view === viewName) link.classList.add('active');
        });

        // Render Content
        if(viewName === 'home') renderHome();
        if(viewName === 'history') renderHistory();
        if(viewName === 'profile') renderProfile();
    }

    // Init
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.dataset.view;
            if(view) switchView(view);
        });
    });

    // Initial Load
    renderHome();

})();