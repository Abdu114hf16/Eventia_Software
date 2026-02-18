(function () {
    console.log("Initializing Attendee Dashboard Logic...");

    // --- DATA ACCESS (MODIFIED FOR DJANGO) ---
    // Instead of LocalStorage, we use the injected window variables
    const eventsData = window.DJANGO_EVENTS || [];
    const profileData = window.DJANGO_PROFILE || {};

    // --- DOM ELEMENTS ---
    const navLinks = document.querySelectorAll('.att-nav-link');
    const sections = document.querySelectorAll('.view-section');
    const myTicketsGrid = document.getElementById('my-tickets-grid');
    const browseGrid = document.getElementById('browse-grid');
    const historyList = document.getElementById('history-list');
    const profileCard = document.getElementById('profile-card');
    const searchInput = document.getElementById('event-search-input');

    // --- RENDER FUNCTIONS ---

    function createCard(evt, isBrowse) {
        // Gradient Logic (Preserved from UI Team)
        let grad = 'linear-gradient(135deg, #004e92, #2a5298)';
        if(evt.category === 'Art') grad = 'linear-gradient(135deg, #e84393, #6c5ce7)';
        if(evt.category === 'Tech') grad = 'linear-gradient(135deg, #0984e3, #00cec9)';
        if(isBrowse) grad = 'linear-gradient(135deg, #667eea, #764ba2)';

        // Button Logic (Connected to Django URLs)
        let btnHtml = '';
        if (isBrowse) {
            if (evt.isRegistered) {
                btnHtml = `<button class="btn btn-sm" style="border: 1px solid #27ae60; color: #27ae60; background:none; cursor:default;">Registered</button>`;
            } else {
                // Link to Django Register URL
                btnHtml = `<a href="/dashboard/attendee/register/${evt.id}/" class="btn btn-primary" style="background: #004e92; color: white; border: none; padding: 8px 20px; border-radius: 8px; text-decoration: none;">Register</a>`;
            }
        } else {
            // Link to Django Cancel URL
            btnHtml = `<a href="/dashboard/attendee/cancel/${evt.ticketId}/" class="btn btn-outline" onclick="return confirm('Cancel this ticket?')" style="width: 100%; border: 1px solid #ef5350; color: #ef5350; text-align:center; padding: 8px; border-radius: 8px; text-decoration:none;">Cancel Ticket</a>`;
        }

        const d = new Date(evt.date);
        const day = d.getDate();
        const month = d.toLocaleString('default', { month: 'short' });

        return `
        <div class="ticket-card" style="background: white; border: 1px solid #eee; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.03); transition: transform 0.2s; display: flex; flex-direction: column;">
            <div class="ticket-header" style="padding: 1.5rem; height: 100px; position: relative; background: ${grad};">
                <span style="background: rgba(255,255,255,0.2); color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 600;">${evt.category}</span>
            </div>
            <div class="ticket-body" style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column;">
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.2rem;">${evt.title}</h3>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;"><i class="fa-solid fa-location-dot"></i> ${evt.location}</p>

                <div style="display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 1rem;">
                    <div><strong style="color: #333;">${day} ${month}</strong></div>
                    <div><strong style="color: #333;">${evt.time}</strong></div>
                </div>

                ${isBrowse ? `<p style="font-size:0.85rem; color:#666; margin-bottom:1rem; height:40px; overflow:hidden;">${evt.description.substring(0,80)}...</p>` : ''}

                <div style="margin-top: auto; display:flex; justify-content:space-between; align-items:center;">
                    ${isBrowse ? `<span style="font-weight:700; color:#004e92;">${evt.price == 0 ? 'Free' : evt.price + ' SAR'}</span>` : ''}
                    ${btnHtml}
                </div>
            </div>
        </div>`;
    }

    function renderHome() {
        const myTickets = eventsData.filter(e => e.isRegistered && e.status === 'upcoming');
        if(myTicketsGrid) {
            if(myTickets.length === 0) {
                myTicketsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: white; border-radius: 16px; border: 2px dashed #eee; color:#999;">No upcoming tickets.</div>`;
            } else {
                myTicketsGrid.innerHTML = myTickets.map(e => createCard(e, false)).join('');
            }
        }

        const browseEvents = eventsData.filter(e => e.status === 'upcoming');
        if(browseGrid) {
            if(browseEvents.length === 0) {
                browseGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666;">No events available.</p>`;
            } else {
                browseGrid.innerHTML = browseEvents.map(e => createCard(e, true)).join('');
            }
        }
    }

    function renderHistory() {
        if(!historyList) return;
        const history = eventsData.filter(e => e.isRegistered && e.status === 'past');

        if(history.length === 0) {
            historyList.innerHTML = `<div style="padding: 3rem; text-align: center; color: #999;">No past events found.</div>`;
            return;
        }

        historyList.innerHTML = history.map(evt => {
            const d = new Date(evt.date);
            return `
            <div style="display: flex; padding: 1.5rem; border-bottom: 1px solid #eee; align-items: center; justify-content: space-between;">
                <div style="display: flex; gap: 1.5rem; align-items: center;">
                    <div style="background: #f1f3f5; width: 60px; height: 60px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <span style="font-weight: 700; color: #999; font-size: 1.2rem;">${d.getDate()}</span>
                        <span style="font-size: 0.7rem; color: #999; text-transform: uppercase;">${d.toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 5px 0; font-size: 1.1rem; color: #666;">${evt.title}</h4>
                        <p style="margin: 0; color: #999; font-size: 0.9rem;">${evt.location}</p>
                    </div>
                </div>
                <span style="background: #e8f5e9; color: #2e7d32; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Attended</span>
            </div>`;
        }).join('');
    }

    function renderProfile() {
        if(!profileCard) return;
        profileCard.innerHTML = `
        <div style="max-width: 600px; background: white; padding: 2rem; border-radius: 16px; border: 1px solid #eee; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
            <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;">
                <div style="width: 80px; height: 80px; background: #004e92; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700;">
                    ${profileData.initial}
                </div>
                <div>
                    <h3 style="margin: 0;">${profileData.username}</h3>
                    <p style="color: #666; margin: 0;">${profileData.email}</p>
                </div>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555;">Username</label>
                <input type="text" value="${profileData.username}" disabled style="width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555;">Email</label>
                <input type="text" value="${profileData.email}" disabled style="width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #555;">Role</label>
                <input type="text" value="${profileData.role}" disabled style="width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 8px; background: #f9f9f9;">
            </div>
        </div>`;
    }

    // --- NAVIGATION LOGIC ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const view = link.dataset.view;
            if(view) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById('view-' + view).classList.add('active');

                if(view === 'history') renderHistory();
                if(view === 'profile') renderProfile();
            }
        });
    });

    // --- SEARCH ---
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('#browse-grid .ticket-card');
            cards.forEach(card => {
                const title = card.querySelector('h3').innerText.toLowerCase();
                card.style.display = title.includes(term) ? 'flex' : 'none';
            });
        });
    }

    // Init
    renderHome();
    renderProfile();

})();