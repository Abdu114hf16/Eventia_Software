/**
 * ATTENDEE PAGE LOGIC (API CONNECTED)
 * Features:
 * 1. Digital Ticket Design (Clean Footer)
 * 2. Square Details Modal
 * 3. Real Django Data
 * 4. Search & Filter Triggers
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
            // Ensure we don't show past events in the browse section
            if (e.status === 'past') return false;

            const matchesCat = catVal === 'all' || e.category === catVal;
            const matchesLoc = locVal === 'all' || (e.location && e.location.includes(locVal));
            const matchesSearch = !searchVal ||
                e.title.toLowerCase().includes(searchVal) ||
                (e.description && e.description.toLowerCase().includes(searchVal));

            return matchesCat && matchesLoc && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #888;">No events found matching your criteria.</div>`;
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

    // --- 4. RENDER MY TICKETS ---
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
            const month = isNaN(eventDate) ? '' : eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            const day = isNaN(eventDate) ? '' : eventDate.getDate();
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
                    </div>
                </div>
            `;
        }).join('');
    }

    const modalStyle = document.createElement('style');
    modalStyle.innerHTML = `
        .eventia-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); animation: fadeIn 0.2s ease; padding: 20px; box-sizing: border-box; }
        .eventia-modal { background: white; width: 100%; max-width: 450px; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.25); display: flex; flex-direction: column; max-height: 90vh; position: relative; animation: slideUp 0.3s ease; }

        /* Details Modal */
        .em-header { position: relative; height: 220px; background: #f0f4f8; }
        .em-header-img { width: 100%; height: 100%; object-fit: cover; }
        .em-back-btn { position: absolute; top: 20px; left: 20px; width: 40px; height: 40px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; justify-content: center; align-items: center; border: none; cursor: pointer; color: #333; font-size: 1.2rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: 0.2s; }
        .em-back-btn:hover { background: white; transform: scale(1.05); }
        .em-content { padding: 24px; overflow-y: auto; flex: 1; }
        .em-badge { display: inline-block; padding: 6px 14px; background: #e3f2fd; color: #004e92; border-radius: 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase; }
        .em-title { font-size: 1.6rem; font-weight: 800; color: #111; margin: 0 0 20px 0; line-height: 1.3; }

        .em-info-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .em-icon-box { width: 48px; height: 48px; min-width: 48px; border-radius: 14px; background: #f4f6f9; display: flex; align-items: center; justify-content: center; color: #004e92; font-size: 1.2rem; }
        .em-info-text h4 { margin: 0 0 4px 0; font-size: 0.95rem; color: #111; font-weight: 700; }
        .em-info-text p { margin: 0; font-size: 0.85rem; color: #666; line-height: 1.4; }

        .em-about h3 { font-size: 1.1rem; font-weight: 700; margin: 24px 0 10px 0; color: #111; }
        .em-about p { font-size: 0.95rem; color: #555; line-height: 1.6; margin: 0; }

        .em-footer { padding: 20px 24px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: white; }

        /* Registration Modal */
        .reg-header { padding: 20px 24px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .reg-header h2 { margin: 0; font-size: 1.2rem; font-weight: 700; }
        .reg-close { background: none; border: none; font-size: 1.2rem; color: #888; cursor: pointer; }
        .reg-body { padding: 24px; overflow-y: auto; flex: 1; }

        .ticket-card { border: 2px solid #eee; border-radius: 16px; padding: 16px; margin-bottom: 16px; transition: all 0.2s; }
        .ticket-card.selected { border-color: #004e92; background: #f8fbff; }
        .ticket-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .ticket-title { font-weight: 700; font-size: 1.1rem; color: #111; margin: 0 0 4px 0; }
        .ticket-desc { font-size: 0.8rem; color: #666; margin: 0; }
        .ticket-price { font-weight: 800; font-size: 1.1rem; color: #004e92; }

        .qty-controls { display: inline-flex; align-items: center; gap: 12px; background: #f4f6f9; padding: 6px; border-radius: 30px; }
        .qty-btn { width: 32px; height: 32px; border-radius: 50%; border: none; background: white; color: #111; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.08); font-size: 1.2rem; }
        .qty-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .qty-val { font-weight: 700; font-size: 1rem; width: 20px; text-align: center; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    `;
    document.head.appendChild(modalStyle);

    // --- 5. VIEW EVENT DETAILS & REGISTRATION MODALS (SCREENSHOT STYLE) ---

    // Inject Custom CSS matching the screenshots exactly
    const modalStyle = document.createElement('style');
    modalStyle.innerHTML = `
        .eventia-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); padding: 16px; animation: fadeIn 0.2s ease; }
        .eventia-modal { background: #fff; width: 100%; max-width: 420px; border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; box-shadow: 0 24px 48px rgba(0,0,0,0.2); position: relative; font-family: 'Inter', sans-serif; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

        /* Details UI */
        .em-hero { height: 220px; background-size: cover; background-position: center; position: relative; background-color: #f0f4f8; }
        .em-back { position: absolute; top: 20px; left: 20px; width: 40px; height: 40px; background: rgba(255,255,255,0.95); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; font-size: 1.1rem; color: #111; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: 0.2s; }
        .em-back:hover { transform: scale(1.05); }
        .em-body { padding: 24px; overflow-y: auto; flex: 1; }
        .em-badge { display: inline-block; background: #e8f0fe; color: #004e92; padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 0.5px; }
        .em-title { font-size: 1.6rem; font-weight: 800; color: #111; margin: 0 0 24px 0; line-height: 1.3; }
        .em-row { display: flex; gap: 16px; margin-bottom: 24px; align-items: flex-start; }
        .em-icon { width: 48px; height: 48px; border-radius: 14px; background: #f4f7fb; color: #004e92; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
        .em-text h4 { margin: 0 0 4px 0; font-size: 0.95rem; color: #111; font-weight: 700; }
        .em-text p { margin: 0; font-size: 0.85rem; color: #666; line-height: 1.4; }
        .em-about h4 { font-size: 1.1rem; font-weight: 700; color: #111; margin: 0 0 10px 0; }
        .em-about p { font-size: 0.95rem; color: #555; line-height: 1.6; margin: 0; }

        /* Footer UI */
        .em-footer { padding: 20px 24px; background: #fff; border-top: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
        .em-price-label { font-size: 0.75rem; color: #888; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
        .em-price-val { font-size: 1.4rem; font-weight: 800; color: #111; }
        .em-btn { background: #004e92; color: #fff; border: none; padding: 14px 28px; border-radius: 16px; font-weight: 700; font-size: 1rem; display: flex; align-items: center; gap: 10px; cursor: pointer; text-decoration: none; transition: 0.2s; box-shadow: 0 4px 15px rgba(0,78,146,0.25); }
        .em-btn:hover { background: #003b73; transform: translateY(-2px); }
        .em-btn:disabled { background: #e8f5e9; color: #2e7d32; box-shadow: none; transform: none; cursor: default; }

        /* Ticket Selection UI */
        .ts-header { padding: 24px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; }
        .ts-header h2 { margin: 0; font-size: 1.3rem; font-weight: 700; color: #111; }
        .ts-close { background: #f4f7fb; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 1.1rem; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .ts-body { padding: 24px; overflow-y: auto; flex: 1; }
        .ts-card { border: 2px solid #f0f0f0; border-radius: 20px; padding: 20px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; transition: 0.2s; background: #fff; }
        .ts-card.active { border-color: #004e92; background: #f8fbff; }
        .ts-card-info h3 { margin: 0 0 6px 0; font-size: 1.05rem; color: #111; font-weight: 700; }
        .ts-card-info p { margin: 0; font-size: 0.85rem; color: #666; line-height: 1.4; max-width: 90%; }
        .ts-card-price { font-size: 1.1rem; font-weight: 800; color: #004e92; margin-top: 10px; }
        .ts-qty { display: flex; align-items: center; gap: 14px; background: #f4f7fb; padding: 6px; border-radius: 30px; }
        .ts-qty-btn { width: 32px; height: 32px; border-radius: 50%; border: none; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #111; box-shadow: 0 2px 5px rgba(0,0,0,0.05); font-size: 1rem; }
        .ts-qty-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .ts-qty-val { font-weight: 700; font-size: 1.05rem; width: 24px; text-align: center; color: #111; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    `;
    document.head.appendChild(modalStyle);

    // 5A. VIEW DETAILS MODAL
    window.viewEventDetails = function(eventId) {
        const events = getEvents();
        const evt = events.find(e => e.id == eventId);
        if (!evt) return;

        const existing = document.getElementById('eventia-modal-container');
        if (existing) existing.remove();

        const priceDisplay = evt.price > 0 ? `${evt.price} SAR` : 'Free';

        // Placeholder images matching categories
        const imageMap = {
            'Tech': 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800',
            'Art': 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=800',
            'Business': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
            'Other': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'
        };
        const bgImage = imageMap[evt.category] || imageMap['Other'];

        const actionBtn = evt.isRegistered
            ? `<button class="em-btn" disabled>Registered <i class="fa-solid fa-check"></i></button>`
            : `<button class="em-btn" onclick="openRegistrationModal('${evt.id}')">Register <i class="fa-solid fa-arrow-right"></i></button>`;

        const modalHtml = `
            <div id="eventia-modal-container" class="eventia-overlay" onclick="if(event.target === this) this.remove()">
                <div class="eventia-modal">
                    <div class="em-hero" style="background-image: url('${bgImage}');">
                        <button class="em-back" onclick="document.getElementById('eventia-modal-container').remove()">
                            <i class="fa-solid fa-arrow-left"></i>
                        </button>
                    </div>
                    <div class="em-body">
                        <div class="em-badge">${evt.category}</div>
                        <h2 class="em-title">${evt.title}</h2>

                        <div class="em-row">
                            <div class="em-icon"><i class="fa-regular fa-calendar-days"></i></div>
                            <div class="em-text">
                                <h4>Date & Time</h4>
                                <p>${evt.date} • ${evt.time}</p>
                            </div>
                        </div>

                        <div class="em-row">
                            <div class="em-icon"><i class="fa-solid fa-location-dot"></i></div>
                            <div class="em-text">
                                <h4>Location</h4>
                                <p>${evt.location}</p>
                            </div>
                        </div>

                        <div class="em-about">
                            <h4>About Event</h4>
                            <p>${evt.description || 'Join us for this amazing event to learn, connect, and grow.'}</p>
                        </div>
                    </div>
                    <div class="em-footer">
                        <div>
                            <div class="em-price-label">Price</div>
                            <div class="em-price-val">${priceDisplay}</div>
                        </div>
                        ${actionBtn}
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    // 5B. TICKET SELECTION MODAL
    window.openRegistrationModal = function(eventId) {
        const events = getEvents();
        const evt = events.find(e => e.id == eventId);
        if (!evt) return;

        const detailsModal = document.getElementById('eventia-modal-container');
        if (detailsModal) detailsModal.remove();

        const basePrice = evt.price || 0;
        const vipPrice = basePrice > 0 ? basePrice * 2.5 : 150;

        const modalHtml = `
            <div id="eventia-modal-container" class="eventia-overlay" onclick="if(event.target === this) this.remove()">
                <div class="eventia-modal">
                    <div class="ts-header">
                        <h2>Select Tickets</h2>
                        <button class="ts-close" onclick="document.getElementById('eventia-modal-container').remove()">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="ts-body">
                        <div class="ts-card active" id="tc-std">
                            <div class="ts-card-info">
                                <h3>General Admission</h3>
                                <p>Access to all main stages and networking areas.</p>
                                <div class="ts-card-price">${basePrice > 0 ? basePrice + ' SAR' : 'Free'}</div>
                            </div>
                            <div class="ts-qty">
                                <button class="ts-qty-btn" onclick="updateQty('std', -1)" id="btn-minus-std" disabled><i class="fa-solid fa-minus"></i></button>
                                <span class="ts-qty-val" id="qty-std">1</span>
                                <button class="ts-qty-btn" onclick="updateQty('std', 1)"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>

                        <div class="ts-card" id="tc-vip">
                            <div class="ts-card-info">
                                <h3>VIP Pass</h3>
                                <p>Front row seating, exclusive lounge, and catering.</p>
                                <div class="ts-card-price">${vipPrice} SAR</div>
                            </div>
                            <div class="ts-qty">
                                <button class="ts-qty-btn" onclick="updateQty('vip', -1)" id="btn-minus-vip" disabled><i class="fa-solid fa-minus"></i></button>
                                <span class="ts-qty-val" id="qty-vip">0</span>
                                <button class="ts-qty-btn" onclick="updateQty('vip', 1)"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                    </div>

                    <div class="em-footer">
                        <div>
                            <div class="em-price-label">Total Amount</div>
                            <div class="em-price-val" id="total-price">${basePrice > 0 ? basePrice + ' SAR' : 'Free'}</div>
                        </div>
                        <a href="/dashboard/attendee/register/${evt.id}/" class="em-btn" style="text-decoration: none;">
                            Confirm <i class="fa-solid fa-check"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // State Management for UI updates
        window.ticketState = { std: 1, vip: 0, pStd: basePrice, pVip: vipPrice };

        window.updateQty = function(type, change) {
            let newVal = window.ticketState[type] + change;
            if (newVal < 0) newVal = 0;
            if (newVal > 10) newVal = 10;
            window.ticketState[type] = newVal;

            // Update Text & Buttons
            document.getElementById(`qty-${type}`).innerText = newVal;
            document.getElementById(`btn-minus-${type}`).disabled = (newVal === 0);

            // Highlight Active Cards
            document.getElementById(`tc-${type}`).classList.toggle('active', newVal > 0);

            // Update Total Price
            let total = (window.ticketState.std * window.ticketState.pStd) + (window.ticketState.vip * window.ticketState.pVip);
            document.getElementById('total-price').innerText = total > 0 ? `${total} SAR` : 'Free';
        }
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

    // --- 9. EVENT LISTENERS & TRIGGERS ---

    // View Navigation Listeners
    document.querySelectorAll('.att-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.getAttribute('href') !== '#') return; // Let actual links pass
            e.preventDefault();
            switchAttendeeView(link.dataset.view, link.dataset.scroll);
        });
    });

    // Search and Filter Listeners
    const searchInput = document.getElementById('landing-search');
    const locationSelect = document.getElementById('landing-location-filter');
    const searchBtn = document.getElementById('landing-search-btn');

    if (searchInput) searchInput.addEventListener('input', renderBrowseEvents);
    if (locationSelect) locationSelect.addEventListener('change', renderBrowseEvents);
    if (searchBtn) searchBtn.addEventListener('click', renderBrowseEvents);

    // Category Pill Listeners
    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            renderBrowseEvents();
        });
    });

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

    // --- INITIALIZE ---
    await initData();

})(); // <-- FIX: Properly closes and invokes the function!