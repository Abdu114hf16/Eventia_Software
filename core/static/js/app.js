document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & View Management ---
    const heroBrowseBtn = document.getElementById('hero-browse-btn');
    if (heroBrowseBtn) {
        heroBrowseBtn.addEventListener('click', () => {
            const grid = document.querySelector('.events-container');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Role Management (Login & Signup) ---
    const roleFields = {
        organizer: \`
            <input type="hidden" name="role" value="ORGANIZER">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="organizer123" required>
            </div>
            <div class="input-group">
                <label>Organization Name</label>
                <input type="text" name="organization_name" placeholder="" required>
            </div>
            <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="signup-email" placeholder="name@company.org" required>
                <div class="error-message email-error">Please enter a valid email address</div>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" class="signup-password" placeholder="Create a strong password" required>
                <div class="password-policy-text">
                    Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.
                </div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" class="signup-confirm-password" placeholder="Re-enter password" required>
                <div class="error-message password-match-error">Passwords do not match</div>
            </div>
        \`,
        vendor: \`
            <input type="hidden" name="role" value="VENDOR">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="vendor123" required>
            </div>
            <div class="input-group">
                <label>Vendor Name</label>
                <input type="text" name="organization_name" placeholder="Event Services Ltd." required>
            </div>
            <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Service Type</label>
                <select name="service_type" required>
                    <option value="" disabled selected>Select Service Type</option>
                    <option value="catering">Catering</option>
                    <option value="venue">Venue</option>
                    <option value="photography">Photography</option>
                    <option value="decoration">Decoration</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="signup-email" placeholder="contact@vendor.com" required>
                <div class="error-message email-error">Please enter a valid email address</div>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" class="signup-password" placeholder="Create a strong password" required>
                <div class="password-policy-text">
                    Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.
                </div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" class="signup-confirm-password" placeholder="Re-enter password" required>
                <div class="error-message password-match-error">Passwords do not match</div>
            </div>
        \`,
        attendee: \`
            <div class="form-row">
                <div class="input-group">
                    <label>First Name</label>
                    <input type="text" name="first_name" placeholder="" required>
                </div>
                <div class="input-group">
                    <label>Last Name</label>
                    <input type="text" name="last_name" placeholder="" required>
                </div>
            </div>
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="abdulrahman123" required>
            </div>
            <div class="input-group">
                <label>Email Address</label>
                <input type="email" name="email" class="signup-email" placeholder="name@example.com" required>
                <div class="error-message email-error">Please enter a valid email address</div>
            </div>
            <div class="input-group">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" placeholder="+966 5x xxx xxxx" required>
            </div>
            <div class="input-group">
                <label>Gender</label>
                <select name="gender" required>
                    <option value="" disabled selected>Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
            </div>
            <div class="input-group">
                <label>Birthday</label>
                <div class="date-inputs-wrapper">
                    <select name="month" class="date-select month-select" required>
                        <option value="" disabled selected>Month</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    <select name="day" class="date-select day-select" required>
                        <option value="" disabled selected>Day</option>
                        <option value="01">1</option><option value="02">2</option><option value="03">3</option><option value="04">4</option><option value="05">5</option>
                        <option value="06">6</option><option value="07">7</option><option value="08">8</option><option value="09">9</option><option value="10">10</option>
                        <option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option>
                        <option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option>
                        <option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option>
                        <option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option>
                        <option value="31">31</option>
                    </select>
                    <select name="year" class="date-select year-select" required>
                        <option value="" disabled selected>Year</option>
                    </select>
                </div>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" class="signup-password" placeholder="Create a strong password" required>
                <div class="password-policy-text">
                    Password must include: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character.
                </div>
                <div class="error-message password-strength-error"></div>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" class="signup-confirm-password" placeholder="Re-enter password" required>
                <div class="error-message password-match-error">Passwords do not match</div>
            </div>
        \`
    };

    const roleTabs = document.querySelectorAll('.role-tab');
    const signupDynamicContainer = document.getElementById('signup-dynamic-fields');
    const signupForm = document.getElementById('signup-form');

    // Initialize Signup Fields
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
                if (btnSpan) btnSpan.textContent = role.charAt(0).toUpperCase() + role.slice(1);
            }

            if (targetForm === 'signup' && signupDynamicContainer) {
                updateSignupFields(role);
            }
        });
    });

    function updateSignupFields(role) {
        if (!signupDynamicContainer) return;
        signupDynamicContainer.style.opacity = '0';
        setTimeout(() => {
            signupDynamicContainer.innerHTML = roleFields[role] || '';
            signupDynamicContainer.style.opacity = '1';

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
        const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
        const matchError = signupDynamicContainer.querySelector('.password-match-error');

        if (!passwordInput || !confirmInput) return;

        function checkStrength(password) {
            let errors = [];
            if (password.length < 8) errors.push("At least 8 characters");
            if (!/[A-Z]/.test(password)) errors.push("1 uppercase letter");
            if (!/[a-z]/.test(password)) errors.push("1 lowercase letter");
            if (!/[0-9]/.test(password)) errors.push("1 number");
            if (!/[^A-Za-z0-9]/.test(password)) errors.push("and 1 special character");
            return errors;
        }

        function validate() {
            const pwd = passwordInput.value;
            const confirm = confirmInput.value;
            let isValid = true;

            const strengthErrors = checkStrength(pwd);
            if (pwd && strengthErrors.length > 0) {
                strengthError.textContent = "Password must include: " + strengthErrors.join(", ");
                strengthError.classList.add('visible');
                passwordInput.classList.add('input-error');
                passwordInput.classList.remove('input-success');
                isValid = false;
            } else {
                strengthError.classList.remove('visible');
                if (pwd) {
                    passwordInput.classList.remove('input-error');
                    passwordInput.classList.add('input-success');
                } else {
                    passwordInput.classList.remove('input-success');
                }
            }

            if (confirm && pwd !== confirm) {
                matchError.classList.add('visible');
                confirmInput.classList.add('input-error');
                confirmInput.classList.remove('input-success');
                isValid = false;
            } else {
                matchError.classList.remove('visible');
                if (confirm) {
                    confirmInput.classList.remove('input-error');
                    confirmInput.classList.add('input-success');
                } else {
                    confirmInput.classList.remove('input-success');
                }
            }
            return isValid;
        }

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
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            // REMOVE the global e.preventDefault() here.
            // We want the form to submit naturally unless there's an error.

            const passwordInput = signupDynamicContainer.querySelector('.signup-password');
            const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');
            const emailInput = signupDynamicContainer.querySelector('.signup-email');

            let isValid = true;

            // Email Validation
            if (emailInput) {
                const email = emailInput.value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    emailInput.classList.add('input-error');
                    isValid = false;
                }
            }

            // Password Match Validation
            if (passwordInput && confirmInput) {
                if (passwordInput.value !== confirmInput.value) {
                    confirmInput.classList.add('input-error');
                    isValid = false;
                }
            }

            // ONLY prevent default if validation FAILS
            if (!isValid) {
                e.preventDefault();
                // Optional: Show an alert or error message here
            }
            // Otherwise, let Django handle the POST request
        });
    }

    // --- DASHBOARD LOGIC (Keep as is) ---
    if (document.body.classList.contains('dashboard-body')) {
        initDashboard();
    }
    
    // ... (Keep the rest of your dashboard InitDashboard function exactly as it was) ...
    function initDashboard() {
        // Elements
        const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
        const sections = document.querySelectorAll('.content-section');
        const pageTitle = document.getElementById('page-title');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');

        // Sidebar Toggle (Mobile)
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
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

            // Update Header Title
            const titles = {
                'overview': 'Dashboard Overview',
                'create-event': 'Create New Event',
                'events-list': 'My Events',
                'vendors': 'Vendor Marketplace',
                'analytics': 'Event Analytics'
            };
            if (pageTitle) pageTitle.textContent = titles[viewId] || 'Dashboard';

            // Close sidebar on mobile after selection
            if (window.innerWidth < 992) {
                sidebar.classList.remove('open');
            }

            // Refresh data if needed
            if (viewId === 'overview' || viewId === 'events-list') {
                renderEvents();
                updateStats();
            }
        };

        // Attach Click Handlers to Sidebar
        sidebarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                if (view) switchView(view);
            });
        });

        // --- CRUD Operations ---
        const EVENTS_DB_KEY = 'eventia_events_db';

        function getEvents() {
            const stored = localStorage.getItem(EVENTS_DB_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        function saveEvent(eventData) {
            const events = getEvents();
            events.push(eventData);
            localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(events));
        }

        function deleteEvent(eventId) {
            const events = getEvents();
            const updated = events.filter(e => e.id !== eventId);
            localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(updated));
            renderEvents();
            updateStats();
        }

        // Form Handling
        const createEventForm = document.getElementById('create-event-form');
        if (createEventForm) {
            createEventForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const newEvent = {
                    id: Date.now().toString(), // Simple ID generation
                    title: document.getElementById('event-title').value,
                    category: document.getElementById('event-category').value,
                    date: document.getElementById('event-date').value,
                    time: document.getElementById('event-time').value,
                    location: document.getElementById('event-location').value,
                    description: document.getElementById('event-description').value,
                    price: document.getElementById('event-price').value,
                    status: 'Upcoming', // Default status
                    attendees: 0
                };

                saveEvent(newEvent);

                // Reset form
                createEventForm.reset();

                // Show success (simple alert for now)
                alert('Event Created Successfully!');

                // Return to overview
                switchView('overview');
            });
        }

        // Render Functions
        function renderEvents() {
            const events = getEvents();

            // 1. Render in Overview (Recent Events)
            const recentContainer = document.getElementById('recent-events-list');
            if (recentContainer) {
                if (events.length === 0) {
                    recentContainer.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem;">No events created yet.</p>';
                } else {
                    const recentEvents = events.slice(-3).reverse(); // Last 3 events
                    recentContainer.innerHTML = recentEvents.map(evt => createEventListItem(evt)).join('');
                }
            }

            // 2. Render in All Events List
            const allContainer = document.getElementById('all-events-container');
            if (allContainer) {
                if (events.length === 0) {
                    allContainer.innerHTML = `
                        <div style="text-align: center; padding: 4rem;">
                            <i class="fa-regular fa-calendar-xmark" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                            <p class="text-muted">No events found. Create your first event!</p>
                        </div>`;
                } else {
                    allContainer.innerHTML = events.slice().reverse().map(evt => createEventListItem(evt)).join('');
                }
            }

            // Attach Delete Listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering other clicks
                    if (confirm('Are you sure you want to delete this event?')) {
                        deleteEvent(btn.dataset.id);
                    }
                });
            });
        }

        function createEventListItem(evt) {
            const dateObj = new Date(evt.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();

            return `
                <div class="event-list-item">
                    <div class="event-info-main">
                        <div class="event-date-box">
                            <span class="date-month">${month}</span>
                            <span class="date-day">${day}</span>
                        </div>
                        <div class="event-details-text">
                            <h4>${evt.title}</h4>
                            <div class="event-meta-info">
                                <span><i class="fa-regular fa-clock"></i> ${evt.time}</span>
                                <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
                                <span class="status-badge status-${evt.status.toLowerCase()}">${evt.status}</span>
                            </div>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-sm btn-outline"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button class="btn btn-sm btn-outline delete-btn" data-id="${evt.id}" style="color: #c62828; border-color: #c62828;"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
        }

        function updateStats() {
            const events = getEvents();
            const total = events.length;
            const upcoming = events.filter(e => e.status === 'Upcoming').length;

            // Safe Update
            const totalEl = document.getElementById('stat-total-events');
            if (totalEl) totalEl.textContent = total;

            const upcomingEl = document.getElementById('stat-upcoming');
            if (upcomingEl) upcomingEl.textContent = upcoming;
        }

        // Initial Load
        renderEvents();
        updateStats();

        // Make functions global for inline onclicks if needed
        window.deleteEvent = deleteEvent;
    }
});