/**
 * ATTENDEE PAGE LOGIC (API CONNECTED)
 * Handles Browse, Dummy Payments, Tickets, Feedback, and Broadcasts
 */

(async function () {
    console.log("Initializing Dashboard with Django API...");

    // --- GLOBAL DATA STORE ---
    let API_DATA = { events: [], registrations: [], profile: {}, broadcasts: [] };
    const READ_NOTIFS_KEY = 'eventia_read_notifs'; // Keeps Read/Unread state locally

    // --- DATA ACCESS (API) ---
    async function initData(fullRender = true) {
        try {
            const response = await fetch('/api/attendee/data/');
            if (!response.ok) throw new Error('Failed to load data');
            API_DATA = await response.json();

            if (fullRender) {
                renderAll();
                initNotifications();
                loadProfile();
            }
        } catch (error) {
            console.error("API Error:", error);
            showToast("Error loading data.");
        }
    }

    function getEvents() { return API_DATA.events || []; }
    function getRegistrations() { return API_DATA.registrations || []; }
    function getProfile() { return API_DATA.profile || {}; }
    function getBroadcasts() { return API_DATA.broadcasts || []; }
    function getReadNotifIds() { return JSON.parse(localStorage.getItem(READ_NOTIFS_KEY)) || []; }
    function saveReadNotifIds(ids) { localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(ids)); }

    // --- GRADIENT MAP ---
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
        'Tech': 'fa-laptop-code', 'Art': 'fa-palette', 'Business': 'fa-briefcase',
        'Music': 'fa-music', 'Education': 'fa-graduation-cap', 'Sports': 'fa-futbol',
        'Other': 'fa-calendar'
    };

    // --- RENDER BROWSE EVENTS ---
    function renderBrowseEvents() {
        const events = getEvents();
        const registrations = getRegistrations();
        const grid = document.getElementById('landing-events-grid');
        if (!grid) return;

        const searchVal = (document.getElementById('landing-search')?.value || '').toLowerCase();
        const locVal = document.getElementById('landing-location-filter')?.value || 'all';
        const catVal = document.querySelector('.cat-pill.active')?.dataset.category || 'all';

        let filtered = events.filter(e => {
            if (e.status === 'past') return false;
            const matchesCat = catVal === 'all' || e.category === catVal;
            const matchesLoc = locVal === 'all' || (e.location && e.location.includes(locVal));
            const matchesSearch = !searchVal || e.title.toLowerCase().includes(searchVal) || (e.description && e.description.toLowerCase().includes(searchVal));
            return matchesCat && matchesLoc && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #888;">
                <i class="fa-regular fa-calendar-xmark" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: #ccc;"></i>
                <h3 style="margin: 0 0 0.5rem; color: #555;">No events found</h3>
            </div>`;
            return;
        }

        grid.innerHTML = filtered.map(evt => {
            const gradient = categoryGradients[evt.category] || categoryGradients['Other'];
            const icon = categoryIcons[evt.category] || 'fa-calendar';
            const isRegistered = registrations.some(r => r.eventId === evt.id);
            const priceDisplay = evt.price > 0 ? `From ${evt.price} SR` : 'Free';

            return `
                <div class="lp-event-card reveal-on-scroll revealed" data-category="${evt.category}">
                    <div class="lp-card-image" style="background: ${gradient};">
                        <i class="fa-solid ${icon}"></i>
                        <div class="lp-card-badge">${evt.category || 'Event'}</div>
                        <div class="lp-card-price">${priceDisplay}</div>
                    </div>
                    <div class="lp-card-body">
                        <h3 class="lp-card-title">${evt.title}</h3>
                        <div class="lp-card-meta">
                            <span><i class="fa-regular fa-calendar"></i> ${evt.date}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
                        </div>
                        <p class="lp-card-desc">${(evt.description || '').substring(0, 100)}...</p>
                        <div class="lp-card-footer" style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-primary btn-sm lp-view-btn" onclick="viewEventDetails('${evt.id}')">View Details</button>
                            ${isRegistered
                    ? `<button class="btn btn-sm" style="background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;" disabled><i class="fa-solid fa-check"></i> Registered</button>`
                    : `<button class="btn btn-sm" style="background: #e3f2fd; color: #1565c0; border: 1px solid #bbdefb;" onclick="openRegisterModal('${evt.id}')"><i class="fa-solid fa-ticket"></i> Register</button>`
                }
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // --- VIEW DETAILS MODAL ---
    window.viewEventDetails = function (eventId) {
        const evt = getEvents().find(e => e.id === eventId);
        if (!evt) return;
        const isRegistered = getRegistrations().some(r => r.eventId === evt.id);

        const existing = document.getElementById('event-detail-modal');
        if (existing) existing.remove();

        let actionBtn = isRegistered
            ? `<button style="flex: 1; padding: 12px; background: #e8f5e9; color: #2e7d32; border: none; border-radius: 8px; font-weight: 600;" disabled><i class="fa-solid fa-check-circle"></i> Already Registered</button>`
            : `<button onclick="document.getElementById('event-detail-modal').remove(); openRegisterModal('${evt.id}')" style="flex: 1; padding: 12px; background: #004e92; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;"><i class="fa-solid fa-ticket"></i> Register Now</button>`;

        const modal = document.createElement('div');
        modal.id = 'event-detail-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);" onclick="if(event.target === this) this.parentElement.remove()">
                <div style="background: white; border-radius: 16px; width: 90%; max-width: 520px; max-height: 85vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div style="background: linear-gradient(135deg, #3C50C8, #004e92); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 1.2rem; font-weight: 600;"><i class="fa-solid fa-file-lines" style="margin-right: 8px;"></i>Event Details</h2>
                        <button onclick="document.getElementById('event-detail-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem;"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <div style="padding: 1.5rem; max-height: 55vh; overflow-y: auto;">
                        <div style="margin-bottom: 1.25rem;">
                            <h3 style="margin: 0 0 8px 0; font-size: 1.4rem; color: #222;">${evt.title}</h3>
                            <span style="display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 4px 12px; border-radius: 16px; font-size: 0.8rem; font-weight: 500;">${evt.category}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 1.25rem;">
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-regular fa-calendar" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">DATE</div>
                                <div style="font-weight: 600; font-size: 0.85rem;">${evt.date}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-regular fa-clock" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">TIME</div>
                                <div style="font-weight: 600; font-size: 0.85rem;">${evt.time}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: #f8f9fa; border-radius: 10px;">
                                <i class="fa-solid fa-location-dot" style="color: #5f6368; font-size: 1.25rem;"></i>
                                <div style="font-size: 0.7rem; color: #5f6368; margin-top: 4px;">LOCATION</div>
                                <div style="font-weight: 600; font-size: 0.75rem;">${evt.location}</div>
                            </div>
                        </div>
                        <div style="margin-bottom: 1.25rem;">
                            <div style="font-size: 0.8rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">DESCRIPTION</div>
                            <p style="margin: 0; line-height: 1.6; color: #333;">${evt.description}</p>
                        </div>
                        <div>
                            <div style="font-size: 0.8rem; color: #5f6368; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">PRICING</div>
                            <div style="color: #1976d2; font-weight: 600;"><i class="fa-solid fa-ticket" style="margin-right: 6px;"></i>${evt.price > 0 ? evt.price + ' SAR' : 'Free Event'}</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; padding: 1rem 1.5rem; border-top: 1px solid #e5e7eb;">
                        ${actionBtn}
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    // --- DUMMY PAYMENT FLOW & API REGISTRATION ---
    window.openRegisterModal = function (eventId) {
        const evt = getEvents().find(e => e.id === eventId);
        if (!evt) return;

        const existing = document.getElementById('register-modal');
        if (existing) existing.remove();

        const basePrice = evt.price || 0;
        const ticketOptions = basePrice > 0
            ? `<option value="Standard|${basePrice}">Standard - ${basePrice} SAR</option>`
            : `<option value="Standard|0">Standard - Free</option>`;

        const modal = document.createElement('div');
        modal.id = 'register-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.55); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px);" onclick="if(event.target === this) document.getElementById('register-modal').remove()">
                <div style="background: white; border-radius: 20px; width: 92%; max-width: 500px; overflow: hidden; box-shadow: 0 24px 70px rgba(0,0,0,0.35);">
                    <div id="reg-step-indicator" style="background: linear-gradient(135deg, #004e92, #4dabf7); padding: 1.75rem 2rem 1.25rem;">
                        <div style="text-align:center;">
                            <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.75rem;">
                                <i id="reg-header-icon" class="fa-solid fa-ticket" style="font-size:1.5rem;color:white;"></i>
                            </div>
                            <h3 id="reg-header-title" style="color:white;font-size:1.15rem;margin:0;font-weight:700;">Select Your Ticket</h3>
                            <p style="color:rgba(255,255,255,0.85);margin:0.4rem 0 0;font-size:0.85rem;">${evt.title}</p>
                        </div>
                    </div>

                    <div id="reg-step-1" style="padding: 1.75rem 2rem;">
                        <div style="margin-bottom: 1.25rem;">
                            <select id="reg-ticket-select" style="width:100%;padding:12px 14px;border:2px solid #e0e0e0;border-radius:10px;font-size:0.95rem;">
                                ${ticketOptions}
                            </select>
                        </div>
                        <div style="display:flex;gap:0.75rem;">
                            <button onclick="document.getElementById('register-modal').remove()" style="flex:1;padding:12px;background:white;color:#555;border:2px solid #e0e0e0;border-radius:10px;font-weight:600;">Cancel</button>
                            <button onclick="regGoToStep2('${evt.id}')" style="flex:1;padding:12px;background:linear-gradient(135deg,#004e92,#4dabf7);color:white;border:none;border-radius:10px;font-weight:700;">Continue</button>
                        </div>
                    </div>

                    <div id="reg-step-2" style="padding:1.75rem 2rem;display:none;">
                        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:0.75rem 1rem;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;">
                            <i class="fa-solid fa-shield-halved" style="color:#f59e0b;font-size:1rem;"></i>
                            <span style="font-size:0.8rem;color:#78350f;font-weight:500;">Demo payment — no real charge will be made</span>
                        </div>
                        <div style="margin-bottom:1rem;">
                            <label style="display:block;font-size:0.82rem;font-weight:600;color:#444;margin-bottom:0.35rem;">CARD NUMBER</label>
                            <input type="text" placeholder="4242 4242 4242 4242" style="width:100%;padding:11px 14px;border:2px solid #e0e0e0;border-radius:10px;">
                        </div>
                        <div style="display:flex;gap:0.75rem;">
                            <button onclick="document.getElementById('reg-step-2').style.display='none'; document.getElementById('reg-step-1').style.display='block';" style="padding:12px 16px;background:white;color:#555;border:2px solid #e0e0e0;border-radius:10px;font-weight:600;"><i class="fa-solid fa-arrow-left"></i></button>
                            <button onclick="regProcessPayment('${evt.id}')" style="flex:1;padding:12px;background:linear-gradient(135deg,#16a34a,#22c55e);color:white;border:none;border-radius:10px;font-weight:700;"><i class="fa-solid fa-lock" style="margin-right:6px;"></i>Pay & Confirm</button>
                        </div>
                    </div>

                    <div id="reg-step-3" style="padding:3rem 2rem;text-align:center;display:none;">
                        <div style="width:80px;height:80px;border:6px solid #e8f0fe;border-top-color:#004e92;border-radius:50%;animation:regSpin 0.9s linear infinite;margin:0 auto 1.5rem;"></div>
                        <h3 style="margin:0 0 0.5rem;color:#222;font-size:1.15rem;">Processing Payment...</h3>
                    </div>

                    <div id="reg-step-4" style="padding:1.75rem 2rem;display:none;">
                        <div style="text-align:center;margin-bottom:1.5rem;">
                            <i class="fa-solid fa-circle-check" style="font-size:3rem;color:#16a34a;margin-bottom:1rem;"></i>
                            <h3 style="margin:0 0 0.5rem;color:#166534;font-size:1.2rem;">Payment Successful!</h3>
                        </div>
                        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:1rem;margin-bottom:1.25rem;text-align:center;">
                            <p style="margin:0;font-size:0.9rem;color:#166534;">Your ticket code is generated.</p>
                            <h2 id="rc-code" style="margin:10px 0 0; color:#004e92; font-family:monospace; letter-spacing:2px;"></h2>
                        </div>
                        <button onclick="document.getElementById('register-modal').remove()" style="width:100%;padding:13px;background:linear-gradient(135deg,#004e92,#4dabf7);color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;">Done</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        if (!document.getElementById('reg-pay-styles')) {
            const s = document.createElement('style');
            s.id = 'reg-pay-styles';
            s.textContent = `@keyframes regSpin { to { transform: rotate(360deg); } }`;
            document.head.appendChild(s);
        }
    };

    window.regGoToStep2 = function () {
        document.getElementById('reg-step-1').style.display = 'none';
        document.getElementById('reg-step-2').style.display = 'block';
        document.getElementById('reg-header-title').textContent = 'Payment Details';
    };

    window.regProcessPayment = async function (eventId) {
        document.getElementById('reg-step-2').style.display = 'none';
        document.getElementById('reg-step-3').style.display = 'block';
        document.getElementById('reg-header-title').textContent = 'Securing Payment...';

        const sel = document.getElementById('reg-ticket-select');
        const [ticketName, ticketPrice] = (sel ? sel.value : 'Standard|0').split('|');

        try {
            // SILENT DJANGO API CALL TO REGISTER
            const response = await fetch(`/api/attendee/register-json/${eventId}/`, {
                method: 'POST',
                headers: { 'X-CSRFToken': window.CSRF_TOKEN, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketType: ticketName, ticketPrice: ticketPrice })
            });

            if (!response.ok) throw new Error("Registration Failed");

            // Pull fresh data quietly to get the new ticket info
            await initData(false);
            const freshReg = getRegistrations().find(r => r.eventId === eventId);
            const code = freshReg ? freshReg.ticketCode : "EVT-SUCCESS";

            setTimeout(() => {
                document.getElementById('rc-code').textContent = code;
                document.getElementById('reg-step-3').style.display = 'none';
                document.getElementById('reg-step-4').style.display = 'block';
                document.getElementById('reg-header-title').textContent = 'Booking Confirmed!';
                renderAll();
            }, 1200); // Fake processing delay for UX

        } catch (err) {
            showToast("Server error during registration.");
            document.getElementById('register-modal').remove();
        }
    };

    // --- RENDER MY TICKETS ---
    function renderMyTickets() {
        const container = document.getElementById('my-tickets-container');
        if (!container) return;

        const events = getEvents();
        const registrations = getRegistrations();

        if (registrations.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #888;">
                <i class="fa-regular fa-ticket" style="font-size: 3rem; margin-bottom: 1rem; display: block; color: #ccc;"></i>
                <h3 style="margin: 0 0 0.5rem; color: #555;">No upcoming tickets</h3>
            </div>`;
            return;
        }

        container.innerHTML = registrations.map(reg => {
            const evt = events.find(e => e.id === reg.eventId);
            if (!evt) return '';

            const gradient = categoryGradients[evt.category] || categoryGradients['Other'];
            const barcodeId = 'ticket-barcode-' + reg.id;

            return `
                <div class="ticket-card">
                    <div class="ticket-card-header ticket-card-header-gradient" style="background: ${gradient};">
                        <div class="ticket-card-header-inner">
                            <div class="ticket-card-category-pill">${evt.category}</div>
                            <h3 class="ticket-card-title">${evt.title}</h3>
                            <div class="ticket-card-meta">
                                <span><i class="fa-regular fa-calendar"></i> ${evt.date}</span>
                                <span><i class="fa-regular fa-clock"></i> ${evt.time}</span>
                            </div>
                        </div>
                    </div>
                    <div class="ticket-card-body">
                        <div class="ticket-card-type-row" style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                            <span style="font-size:0.7rem; color:#888; text-transform:uppercase; font-weight:700;">Ticket Type<br><span style="font-size:1rem; color:#222;">${reg.ticketType}</span></span>
                            <span style="font-size:0.7rem; color:#888; text-transform:uppercase; font-weight:700; text-align:right;">Price<br><span style="font-size:1rem; color:#004e92;">${reg.ticketPrice > 0 ? reg.ticketPrice + ' SAR' : 'Free'}</span></span>
                        </div>
                        <div class="ticket-barcode-box" style="text-align:center; background:#f8f9fa; padding:1rem; border-radius:10px;">
                            <div style="font-size:0.7rem; color:#888; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Ticket Code</div>
                            <div style="font-family:monospace; font-size:1.2rem; font-weight:700; color:#1565c0; letter-spacing:2px;">${reg.ticketCode}</div>
                        </div>
                        <button type="button" class="btn btn-primary btn-sm" onclick="openBadgeModal('${reg.id}')" style="width: 100%; margin-top: 1rem;">
                            <i class="fa-solid fa-id-card"></i> Show my badge
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // --- RENDER EVENT HISTORY & FEEDBACK ---
    function renderHistory() {
        const container = document.getElementById('history-container');
        if (!container) return;
        const pastRegs = getRegistrations(); // Usually filtered by date, keeping simple for demo

        if (pastRegs.length === 0) {
            container.innerHTML = `<div style="text-align: center; padding: 4rem 2rem; color: #888;">No history found.</div>`;
            return;
        }

        container.innerHTML = pastRegs.map(reg => {
            const evt = getEvents().find(e => e.id === reg.eventId);
            if (!evt) return '';

            let starsHTML = '';
            if (reg.rating) {
                for (let i = 1; i <= 5; i++) {
                    starsHTML += `<i class="fa-solid fa-star" style="color: ${i <= reg.rating ? '#ffc107' : '#e0e0e0'}; font-size: 1rem;"></i>`;
                }
            }

            const feedbackSection = reg.feedback
                ? `<div style="margin-top: 1rem; background: #f0f4f8; padding: 1rem; border-radius: 8px; border-left: 3px solid #004e92;">
                        <div style="margin-bottom: 0.5rem;">${starsHTML}</div>
                        <p style="margin: 0; color: #333; font-size: 0.9rem;">${reg.feedback}</p>
                   </div>`
                : `<div style="margin-top: 1rem;">
                        <button class="btn btn-primary btn-sm" onclick="openFeedbackModal('${reg.id}', '${evt.id}')" style="width: 100%;">
                            <i class="fa-solid fa-star"></i> Rate Event
                        </button>
                   </div>`;

            return `
                <div style="background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e8e8e8;">
                    <h4 style="margin: 0 0 0.5rem; font-size: 1.1rem; color: #222;">${evt.title}</h4>
                    <span style="background: #e8f5e9; color: #2e7d32; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: 500;">Attended</span>
                    ${feedbackSection}
                </div>
            `;
        }).join('');
    }

    // --- API FEEDBACK ---
    window.openFeedbackModal = function (regId, eventId) {
        const evt = getEvents().find(e => e.id === eventId);
        if (!evt) return;

        const existing = document.getElementById('feedback-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'feedback-modal';
        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(3px);" onclick="if(event.target === this) this.parentElement.remove()">
                <div style="background: white; border-radius: 16px; width: 90%; max-width: 480px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    <div style="background: linear-gradient(135deg, #004e92, #4dabf7); padding: 2rem; text-align: center; color: white;">
                        <h3>Rate & Review</h3>
                        <p>${evt.title}</p>
                    </div>
                    <div style="padding: 2rem;">
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <div id="star-rating" style="display: flex; justify-content: center; gap: 0.5rem;">
                                ${[1, 2, 3, 4, 5].map(i => `<i class="fa-regular fa-star feedback-star" data-rating="${i}" style="font-size: 2rem; color: #ffc107; cursor: pointer;"></i>`).join('')}
                            </div>
                            <input type="hidden" id="feedback-rating" value="0">
                        </div>
                        <textarea id="feedback-text" rows="4" placeholder="Share your experience..." style="width: 100%; border: 2px solid #e0e0e0; padding: 1rem; border-radius: 12px; margin-bottom: 1rem;"></textarea>
                        <button onclick="submitFeedback('${regId}')" style="width: 100%; padding: 12px; background: #004e92; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Submit</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelectorAll('.feedback-star').forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                document.getElementById('feedback-rating').value = rating;
                modal.querySelectorAll('.feedback-star').forEach((s, idx) => {
                    s.classList.remove('fa-regular', 'fa-solid');
                    s.classList.add(idx < rating ? 'fa-solid' : 'fa-regular');
                });
            });
        });
    };

    window.submitFeedback = async function (regId) {
        const rating = parseInt(document.getElementById('feedback-rating').value);
        const text = document.getElementById('feedback-text').value.trim();

        if (rating === 0) return showToast('Please select a rating.');

        try {
            await fetch(`/api/attendee/feedback/${regId}/`, {
                method: 'POST',
                headers: { 'X-CSRFToken': window.CSRF_TOKEN, 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: rating, feedback: text })
            });
            document.getElementById('feedback-modal').remove();
            showToast('Thank you for your feedback!');
            initData(); // Refresh UI
        } catch (err) { showToast("Failed to save feedback."); }
    };

    // --- BROADCAST NOTIFICATIONS ---
    function initNotifications() {
        const broadcasts = getBroadcasts();
        const readIds = getReadNotifIds();
        const unreadCount = broadcasts.filter(b => !readIds.includes(b.id)).length;

        const badge = document.getElementById('notif-badge');
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                badge.style.display = 'flex';
            } else { badge.style.display = 'none'; }
        }
        renderNotifList();
    }

    function renderNotifList() {
        const list = document.getElementById('notif-list');
        if (!list) return;
        const broadcasts = getBroadcasts();
        const readIds = getReadNotifIds();

        if (broadcasts.length === 0) {
            list.innerHTML = `<div style="padding:4rem; text-align:center; color:#9ca3af;">No updates yet</div>`;
            return;
        }

        list.innerHTML = broadcasts.map(b => {
            const isRead = readIds.includes(b.id);
            const evt = getEvents().find(e => e.id === b.eventId) || {title: 'Event'};
            const ts = new Date(b.timestamp).toLocaleDateString();

            return `
                <div style="background:white; border-radius:14px; margin-bottom:1rem; padding:1.25rem; border:1px solid ${isRead ? '#e5e7eb' : '#bfdbfe'};">
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                        <strong style="color:#004e92;">${evt.title} ${!isRead ? '<span style="color:red; font-size:0.7rem;">NEW</span>' : ''}</strong>
                        <span style="font-size:0.75rem; color:#999;">${ts}</span>
                    </div>
                    <p style="margin:0 0 1rem; font-size:0.95rem;">${b.message}</p>
                    ${!isRead ? `<button onclick="markNotifRead('${b.id}')" style="background:transparent; border:1.5px solid #004e92; color:#004e92; border-radius:8px; padding:5px 14px; cursor:pointer; font-size:0.8rem;">Mark as read</button>` : ''}
                </div>
            `;
        }).join('');
    }

    window.markNotifRead = function (id) {
        const readIds = getReadNotifIds();
        if (!readIds.includes(id)) readIds.push(id);
        saveReadNotifIds(readIds);
        initNotifications();
    };

    // --- PROFILE ---
    function loadProfile() {
        const p = getProfile();
        const setText = (id, val) => { const el = document.getElementById(id); if (el) { el.tagName === 'INPUT' ? el.value = val : el.textContent = val; } };
        setText('profile-firstname', p.firstName); setText('profile-email', p.email);
        setText('attendee-hero-name', p.firstName);
    }

    // --- NAVIGATION ---
    function switchAttendeeView(viewName) {
        document.querySelectorAll('.attendee-view').forEach(v => v.style.display = 'none');
        const target = document.getElementById('view-' + viewName);
        if (target) target.style.display = '';

        document.querySelectorAll('.nav-links .att-nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links .att-nav-link[data-view="${viewName}"]`);
        if (activeLink) activeLink.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelectorAll('.att-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); switchAttendeeView(link.dataset.view);
        });
    });

    // Helper Toast
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #333; color: white; padding: 14px 28px; border-radius: 10px; z-index: 9999; animation: modalSlideIn 0.3s ease;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function renderAll() {
        renderBrowseEvents();
        renderMyTickets();
        renderHistory();
    }

    window.openBadgeModal = function (regId) { showToast('Digital Badge requires JsBarcode library.'); }

    // Start App
    await initData();

})();