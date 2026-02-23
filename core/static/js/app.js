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
    const roleFields = {
        organizer: `
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
        `,
        vendor: `
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
                    <optgroup label="Food & Beverages">
                        <option value="Catering">Catering</option>
                        <option value="Bakery & Desserts">Bakery & Desserts</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Food Trucks">Food Trucks</option>
                    </optgroup>
                    <optgroup label="Venues">
                        <option value="Venue">Venue / Hall</option>
                        <option value="Conference Hall">Conference Hall</option>
                        <option value="Outdoor Venue">Outdoor Venue</option>
                    </optgroup>
                    <optgroup label="AV & Technology">
                        <option value="AV Equipment">AV Equipment</option>
                        <option value="LED Screens">LED Screens</option>
                        <option value="Stage & Rigging">Stage & Rigging</option>
                        <option value="Live Streaming">Live Streaming</option>
                    </optgroup>
                    <optgroup label="Decoration & Design">
                        <option value="Decoration">Decoration</option>
                        <option value="Floral Design">Floral Design</option>
                        <option value="Balloon Decor">Balloon Decor</option>
                        <option value="Event Lighting">Event Lighting</option>
                    </optgroup>
                    <optgroup label="Photography & Media">
                        <option value="Photography">Photography</option>
                        <option value="Aerial Photography">Aerial Photography</option>
                        <option value="Photo Booth">Photo Booth</option>
                    </optgroup>
                    <optgroup label="Entertainment">
                        <option value="DJ Services">DJ Services</option>
                        <option value="Live Entertainment">Live Entertainment</option>
                        <option value="Kids Entertainment">Kids Entertainment</option>
                        <option value="Traditional Music">Traditional Music</option>
                        <option value="Fireworks & Pyro">Fireworks & Pyro</option>
                    </optgroup>
                    <optgroup label="Transportation">
                        <option value="Transportation">Transportation</option>
                        <option value="Shuttle Services">Shuttle Services</option>
                        <option value="Valet Parking">Valet Parking</option>
                    </optgroup>
                    <optgroup label="Security & Safety">
                        <option value="Security">Security</option>
                        <option value="VIP Security">VIP Security</option>
                        <option value="Medical Services">Medical Services</option>
                    </optgroup>
                    <optgroup label="Staffing & Services">
                        <option value="Event Staff">Event Staff</option>
                        <option value="Translation">Translation</option>
                        <option value="MC & Hosting">MC & Hosting</option>
                    </optgroup>
                    <optgroup label="Rentals & Equipment">
                        <option value="Tent Rentals">Tent Rentals</option>
                        <option value="Furniture Rentals">Furniture Rentals</option>
                        <option value="Table/Chair Rentals">Table/Chair Rentals</option>
                        <option value="Power Supply">Power Supply</option>
                    </optgroup>
                    <optgroup label="Marketing & Promotion">
                        <option value="Printing">Printing</option>
                        <option value="Social Media Marketing">Social Media Marketing</option>
                        <option value="Influencer Marketing">Influencer Marketing</option>
                    </optgroup>
                    <optgroup label="Government & Permits">
                        <option value="Government Permits">Government Permits</option>
                        <option value="Safety Permits">Safety Permits</option>
                    </optgroup>
                    <optgroup label="Sponsors & Partners">
                        <option value="Sponsors">Sponsors</option>
                        <option value="Brand Partners">Brand Partners</option>
                    </optgroup>
                    <optgroup label="Saudi Cultural">
                        <option value="Henna Artists">Henna Artists</option>
                        <option value="Falconry Shows">Falconry Shows</option>
                        <option value="Horse Shows">Horse Shows</option>
                        <option value="Arabian Perfumes">Arabian Perfumes</option>
                        <option value="Arabic Calligraphy">Arabic Calligraphy</option>
                    </optgroup>
                    <optgroup label="Specialized Services">
                        <option value="VR/AR Experiences">VR/AR Experiences</option>
                        <option value="Eco-Friendly Services">Eco-Friendly Services</option>
                        <option value="Gifts & Giveaways">Gifts & Giveaways</option>
                    </optgroup>
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
        `,
        attendee: `
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
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div class="input-group">
                <label>Birthday</label>
                <div class="date-inputs-wrapper">
                    <select name="month" class="date-select month-select" required>
                        <option value="" disabled selected>Month</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    <select name="day" class="date-select day-select" required>
                        <option value="" disabled selected>Day</option>
                        <option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                        <option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option>
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


    // FIXED: Form Submit Logic
    // Login form simply submits to Django normally now. The preventDefault mock is gone.
    const loginForm = document.getElementById('login-form');
    // We do NOT add a submit event listener to loginForm, so it naturally POSTs.

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
                    let errors = [];
                    if (password.length < 8) errors.push("At least 8 characters");
                    if (!/[A-Z]/.test(password)) errors.push("1 uppercase letter");
                    if (!/[a-z]/.test(password)) errors.push("1 lowercase letter");
                    if (!/[0-9]/.test(password)) errors.push("1 number");
                    if (!/[^A-Za-z0-9]/.test(password)) errors.push("and 1 special character");
                    return errors;
                }

                const pwd = passwordInput.value;
                const confirm = confirmInput.value;
                const strengthError = signupDynamicContainer.querySelector('.password-strength-error');
                const matchError = signupDynamicContainer.querySelector('.password-match-error');

                const strengthErrors = checkStrength(pwd);
                if (strengthErrors.length > 0) {
                    strengthError.textContent = "Password must include: " + strengthErrors.join(", ");
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

        let currentEditingId = null;

        function showToast(message) {
            const existing = document.querySelectorAll('.toast-notification');
            existing.forEach(t => t.remove());

            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.innerHTML = `
                <div class="toast-icon"><i class="fa-solid fa-check"></i></div>
                <div class="toast-message">${message}</div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => { toast.classList.add('show'); }, 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => { toast.remove(); }, 400);
            }, 3000);
        }

        window.showFullRejectionReason = function (encodedReason) {
            const reason = decodeURIComponent(encodedReason);
            const existing = document.getElementById('rejection-comment-modal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'rejection-comment-modal';
            modal.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px);">
                    <div style="background: white; padding: 2rem; border-radius: 16px; width: 90%; max-width: 500px; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0; color: #c62828;"><i class="fa-solid fa-circle-xmark" style="margin-right: 0.5rem;"></i> Rejection Reason</h3>
                            <button class="btn btn-sm btn-outline" onclick="document.getElementById('rejection-comment-modal').remove()">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div style="background: #ffebee; padding: 1rem; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; color: #c62828; max-height: 300px; overflow-y: auto;">${reason}</div>
                        <button class="btn btn-primary" style="margin-top: 1.5rem; width: 100%;" onclick="document.getElementById('rejection-comment-modal').remove()">Close</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        window.switchView = function (viewId) {
            sidebarItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.view === viewId) {
                    item.classList.add('active');
                }
            });

            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === `view-${viewId}`) {
                    sec.classList.add('active');
                }
            });

            const titles = {
                'overview': 'Dashboard Overview',
                'create-event': 'Create New Event',
                'events-list': 'My Events',
                'vendors': 'Vendor Marketplace',
                'analytics': 'Event Analytics'
            };
            if (pageTitle) pageTitle.textContent = titles[viewId] || 'Dashboard';

            if (window.innerWidth < 992) {
                sidebar.classList.remove('open');
            }

            if (viewId === 'overview' || viewId === 'events-list') {
                renderEvents();
                updateStats();
            } else if (viewId === 'vendors') {
                renderVendors();
            }
        };

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

        const categoryPills = document.querySelectorAll('.category-pill');
        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
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

                const vendorFilterSelect = document.getElementById('vendor-category-select');
                if (vendorFilterSelect) {
                    vendorFilterSelect.value = pill.dataset.category;
                }
                renderVendors();
            });
        });

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

        const vendorLocationFilter = document.getElementById('vendor-location-filter');
        if (vendorLocationFilter) {
            vendorLocationFilter.addEventListener('change', () => {
                renderVendors();
            });
        }

        const showAllCategoriesBtn = document.getElementById('show-all-categories');
        if (showAllCategoriesBtn) {
            showAllCategoriesBtn.addEventListener('click', () => {
                showAllCategoriesModal();
            });
        }

        function showAllCategoriesModal() {
            const existing = document.getElementById('categories-modal');
            if (existing) existing.remove();

            const categories = [
                { group: 'Food & Beverages', items: ['Catering', 'Bakery & Desserts', 'Beverages', 'Food Trucks'] },
                { group: 'Venues', items: ['Venue', 'Conference Hall', 'Outdoor Venue'] },
                { group: 'AV & Technology', items: ['AV Equipment', 'LED Screens', 'Stage & Rigging', 'Live Streaming'] },
                { group: 'Decoration & Design', items: ['Decoration', 'Floral Design', 'Balloon Decor', 'Event Lighting'] },
                { group: 'Photography & Media', items: ['Photography', 'Aerial Photography', 'Photo Booth'] },
                { group: 'Entertainment', items: ['DJ Services', 'Live Entertainment', 'Kids Entertainment', 'Traditional Music', 'Fireworks & Pyro'] },
                { group: 'Transportation', items: ['Transportation', 'Shuttle Services', 'Valet Parking'] },
                { group: 'Security & Safety', items: ['Security', 'VIP Security', 'Medical Services'] },
                { group: 'Staffing & Services', items: ['Event Staff', 'Translation', 'MC & Hosting'] },
                { group: 'Rentals & Equipment', items: ['Tent Rentals', 'Furniture Rentals', 'Table/Chair Rentals', 'Power Supply'] },
                { group: 'Marketing & Promotion', items: ['Printing', 'Social Media Marketing', 'Influencer Marketing'] },
                { group: 'Government & Permits', items: ['Government Permits', 'Safety Permits'] },
                { group: 'Sponsors & Partners', items: ['Sponsors', 'Brand Partners'] },
                { group: 'Saudi Cultural', items: ['Henna Artists', 'Falconry Shows', 'Horse Shows', 'Arabian Perfumes', 'Arabic Calligraphy'] },
                { group: 'Specialized Services', items: ['VR/AR Experiences', 'Eco-Friendly Services', 'Gifts & Giveaways'] }
            ];

            let categoriesHTML = '';
            categories.forEach(cat => {
                categoriesHTML += `
                    <div style="margin-bottom: 1rem;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 0.5rem; font-size: 0.9rem;">${cat.group}</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${cat.items.map(item => `
                                <button class="modal-category-btn" data-category="${item}"
                                    style="padding: 6px 14px; border: 1px solid #e0e0e0; border-radius: 16px; background: white; cursor: pointer; font-size: 0.8rem; transition: all 0.2s ease;">
                                    ${item}
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
                        <div style="background: linear-gradient(135deg, #004e92, #4dabf7); color: white; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                            <h3 style="margin: 0; font-size: 1.1rem;">
                                <i class="fa-solid fa-grid-2" style="margin-right: 0.5rem;"></i>All Categories
                            </h3>
                            <button onclick="document.getElementById('categories-modal').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer;">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div style="padding: 1.5rem; overflow-y: auto; max-height: 60vh;">
                            ${categoriesHTML}
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelectorAll('.modal-category-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const category = btn.dataset.category;
                    const vendorFilterSelect = document.getElementById('vendor-category-select');
                    if (vendorFilterSelect) vendorFilterSelect.value = category;

                    const pills = document.querySelectorAll('.category-pill');
                    pills.forEach(p => {
                        p.classList.remove('active');
                        p.style.background = 'white';
                        p.style.color = '#333';
                        p.style.border = '1px solid #e0e0e0';
                    });

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

        function resetCreateForm() {
            currentEditingId = null;
            if (createEventForm) {
                createEventForm.reset();
                const btn = createEventForm.querySelector('button[type="submit"]');
                if (btn) btn.textContent = 'Publish Event';

                const formHeader = document.querySelector('#view-create-event .section-header h2');
                if (formHeader) formHeader.textContent = 'Create New Event';

                const container = document.getElementById('ticket-categories-container');
                if (container) {
                    container.innerHTML = `
                        <div class="ticket-row" style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="text" class="ticket-name" placeholder="Name (e.g. General)" value="Standard" required style="flex: 2;">
                            <input type="number" class="ticket-price" placeholder="Price (SAR)" min="0" required style="flex: 1;">
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

            if (pageTitle) pageTitle.textContent = 'Edit Event';
            const formHeader = document.querySelector('#view-create-event .section-header h2');
            if (formHeader) formHeader.textContent = 'Edit Event';

            document.getElementById('event-title').value = evt.title;
            document.getElementById('event-category').value = evt.category;
            document.getElementById('event-date').value = evt.date;
            document.getElementById('event-time').value = evt.time;
            document.getElementById('event-location').value = evt.location;
            document.getElementById('event-description').value = evt.description;

            const container = document.getElementById('ticket-categories-container');
            container.innerHTML = ''; 

            let ticketsToLoad = evt.tickets || [];
            if (ticketsToLoad.length === 0 && evt.price !== undefined) {
                ticketsToLoad.push({ name: 'Standard', price: evt.price });
            }

            if (ticketsToLoad.length === 0) {
                ticketsToLoad.push({ name: 'General', price: '' });
            }

            ticketsToLoad.forEach(ticket => {
                const row = document.createElement('div');
                row.className = 'ticket-row';
                row.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
                row.innerHTML = `
                    <input type="text" class="ticket-name" placeholder="Name (e.g. General)" value="${ticket.name}" required style="flex: 2;">
                    <input type="number" class="ticket-price" placeholder="Price (SR)" value="${ticket.price}" min="0" required style="flex: 1;">
                    <button type="button" class="btn btn-sm btn-outline remove-ticket-btn" style="color: var(--danger-color); border-color: var(--danger-color);"><i class="fa-solid fa-trash"></i></button>
                `;
                container.appendChild(row);
            });

            const btn = createEventForm.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Update Event';
        }

        const EVENTS_DB_KEY = 'eventia_events_db';
        const VENDORS_DB_KEY = 'eventia_vendors_db';

        function getEvents() {
            const stored = localStorage.getItem(EVENTS_DB_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        function getVendors() {
            const stored = localStorage.getItem(VENDORS_DB_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        function setupTicketHandlers() {
            const container = document.getElementById('ticket-categories-container');
            const addBtn = document.getElementById('add-ticket-btn');

            if (addBtn && container) {
                addBtn.addEventListener('click', () => {
                    const row = document.createElement('div');
                    row.className = 'ticket-row';
                    row.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
                    row.innerHTML = `
                        <input type="text" class="ticket-name" placeholder="Name (e.g. General)" required style="flex: 2;">
                        <input type="number" class="ticket-price" placeholder="Price (SR)" min="0" required style="flex: 1;">
                        <button type="button" class="btn btn-sm btn-outline remove-ticket-btn" style="color: var(--danger-color); border-color: var(--danger-color);"><i class="fa-solid fa-trash"></i></button>
                    `;
                    container.appendChild(row);
                });

                container.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-ticket-btn')) {
                        const row = e.target.closest('.ticket-row');
                        if (container.querySelectorAll('.ticket-row').length > 1) {
                            row.remove();
                        } else {
                            row.querySelector('.ticket-name').value = '';
                            row.querySelector('.ticket-price').value = '';
                            showToast('At least one ticket category is required.');
                        }
                    }
                });
            }
        }
        setupTicketHandlers(); 

        function saveEvent(eventData) {
            const events = getEvents();
            if (currentEditingId) {
                const index = events.findIndex(e => e.id === currentEditingId);
                if (index !== -1) {
                    events[index] = { ...events[index], ...eventData, id: currentEditingId };
                }
            } else {
                events.push(eventData);
            }
            localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(events));
        }

        function deleteEvent(eventId) {
            const events = getEvents();
            const updated = events.filter(e => e.id !== eventId);
            localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(updated));
            renderEvents();
            updateStats();
        }

        function updateEventStatuses() {
            const events = getEvents();
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            let changed = false;

            const updatedEvents = events.map(evt => {
                if (evt.status === 'Pending' || evt.status === 'Rejected') {
                    return evt; 
                }

                let newStatus = evt.status;

                if (evt.date === todayStr) {
                    newStatus = 'Ongoing';
                } else if (evt.date > todayStr) {
                    newStatus = 'Upcoming';
                } else {
                    newStatus = 'Past';
                }

                if (newStatus !== evt.status) {
                    changed = true;
                    return { ...evt, status: newStatus };
                }
                return evt;
            });

            if (changed) {
                localStorage.setItem(EVENTS_DB_KEY, JSON.stringify(updatedEvents));
            }
        }

        const createEventForm = document.getElementById('create-event-form');
        if (createEventForm) {
            createEventForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const ticketRows = document.querySelectorAll('.ticket-row');
                const tickets = [];
                ticketRows.forEach(row => {
                    const name = row.querySelector('.ticket-name').value;
                    const price = row.querySelector('.ticket-price').value;
                    if (name && price !== '') {
                        tickets.push({ name, price });
                    }
                });

                const prices = tickets.map(t => parseFloat(t.price));
                const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

                const newEvent = {
                    id: Date.now().toString(), 
                    title: document.getElementById('event-title').value,
                    category: document.getElementById('event-category').value,
                    date: document.getElementById('event-date').value,
                    time: document.getElementById('event-time').value,
                    location: document.getElementById('event-location').value,
                    description: document.getElementById('event-description').value,
                    price: minPrice, 
                    tickets: tickets, 
                    status: 'Pending', 
                    attendees: 0 
                };

                if (currentEditingId) {
                    const existing = getEvents().find(e => e.id === currentEditingId);
                    if (existing) {
                        if (existing.status === 'Rejected') {
                            newEvent.status = 'Pending';
                            newEvent.rejectionReason = null;
                        } else {
                            newEvent.status = existing.status;
                        }
                        newEvent.attendees = existing.attendees;
                    }
                }

                saveEvent(newEvent);

                const msg = currentEditingId
                    ? 'Event Updated Successfully!'
                    : 'Event Submitted for Approval! SCEGA will review your event shortly.';

                showToast(msg);
                resetCreateForm();
                switchView('overview');
            });
        }

        function renderEvents() {
            updateEventStatuses();
            const events = getEvents();
            const recentContainer = document.getElementById('recent-events-list');
            if (recentContainer) {
                const todayStr = new Date().toISOString().split('T')[0];
                const activeEvents = events.filter(e =>
                    (e.status === 'Upcoming' || e.status === 'Ongoing') ||
                    (e.status !== 'Pending' && e.status !== 'Rejected' && e.date >= todayStr)
                );

                if (activeEvents.length === 0) {
                    recentContainer.innerHTML = '<p class="text-muted" style="text-align: center; padding: 2rem;">No upcoming or ongoing events. Create an event and wait for SCEGA approval.</p>';
                } else {
                    const sorted = activeEvents.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
                    recentContainer.innerHTML = sorted.map(evt => createDashboardEventItem(evt)).join('');
                }
            }

            const allContainer = document.getElementById('all-events-container');
            const filterSelect = document.getElementById('event-filter-select');
            const filterValue = filterSelect ? filterSelect.value : 'all';

            if (allContainer) {
                let displayedEvents = events;

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
                    const todayStr = new Date().toISOString().split('T')[0];

                    const getEventPriority = (evt) => {
                        if (evt.date === todayStr) return 0; 
                        if (evt.date > todayStr) return 1;   
                        return 2;                            
                    };

                    const sorted = displayedEvents.slice().sort((a, b) => {
                        const priorityDiff = getEventPriority(a) - getEventPriority(b);
                        if (priorityDiff !== 0) return priorityDiff;
                        if (getEventPriority(a) === 2) {
                            return new Date(b.date) - new Date(a.date); 
                        }
                        return new Date(a.date) - new Date(b.date); 
                    });

                    allContainer.innerHTML = sorted.map(evt => createEventListItem(evt)).join('');
                }
            }
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

            if (filterSelect && filterSelect.value !== 'all') {
                const selectedCategory = filterSelect.value;
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

            if (locationFilter && locationFilter.value !== 'all') {
                filtered = filtered.filter(v => v.location === locationFilter.value || v.location === 'Any' || v.location === 'Global');
            }

            if (searchInput && searchInput.value.trim() !== '') {
                const term = searchInput.value.toLowerCase();
                filtered = filtered.filter(v =>
                    v.name.toLowerCase().includes(term) ||
                    v.description.toLowerCase().includes(term) ||
                    v.category.toLowerCase().includes(term) ||
                    v.location.toLowerCase().includes(term)
                );
            }

            if (resultsCount) {
                const categoryLabel = filterSelect && filterSelect.value !== 'all' ? filterSelect.value : 'all categories';
                resultsCount.innerHTML = `<strong>${filtered.length}</strong> vendors found${filterSelect && filterSelect.value !== 'all' ? ` in ${categoryLabel}` : ''}`;
            }

            if (filtered.length === 0) {
                grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fa-solid fa-store-slash" style="font-size: 3rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <p style="color: #888; margin: 0;">No vendors found matching your criteria.</p>
                    <button onclick="document.getElementById('vendor-search').value=''; document.getElementById('vendor-category-select').value='all'; document.querySelectorAll('.category-pill').forEach(p => { p.classList.remove('active'); p.style.background='white'; p.style.color='#333'; p.style.border='1px solid #e0e0e0'; }); document.querySelector('.category-pill[data-category=\\'all\\']').classList.add('active'); document.querySelector('.category-pill[data-category=\\'all\\']').style.background='#004e92'; document.querySelector('.category-pill[data-category=\\'all\\']').style.color='white'; renderVendors();"
                        style="margin-top: 1rem; padding: 8px 16px; border: 1px solid #004e92; border-radius: 8px; background: white; color: #004e92; cursor: pointer; font-size: 0.85rem;">
                        Clear Filters
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
                        <div class="vendor-category">${vendor.category}</div>
                        <h3>${vendor.name}</h3>
                        <div class="vendor-location">
                            <i class="fa-solid fa-location-dot"></i> ${vendor.location}
                        </div>
                        <p class="vendor-description">${vendor.description}</p>

                        <div class="vendor-footer">
                            <span class="vendor-price">${vendor.priceRange}</span>
                            <button class="btn btn-sm btn-outline send-request-btn" data-id="${vendor.id}" data-name="${vendor.name}">Send Request</button>
                        </div>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.send-request-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const vendorId = e.target.dataset.id;
                    const vendorName = e.target.dataset.name;
                    openRequestModal(vendorId, vendorName);
                });
            });
        }

        function attachActionListeners() {
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    if (confirm('Are you sure you want to delete this event?')) {
                        deleteEvent(btn.dataset.id);
                    }
                });
            });

            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openEditView(btn.dataset.id);
                });
            });
        }

        function createDashboardEventItem(evt) {
            const dateObj = new Date(evt.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();

            let priceDisplay = 'Free';
            if (evt.price > 0) {
                priceDisplay = `${evt.price} SAR`;
                if (evt.tickets && evt.tickets.length > 1) {
                    priceDisplay = `From ${evt.price} SAR`;
                }
            }

            const todayStr = new Date().toISOString().split('T')[0];
            let stateColor, stateBg;
            if (evt.date === todayStr) {
                stateColor = '#2e7d32'; 
                stateBg = 'rgba(46, 125, 50, 0.15)';
            } else if (evt.date > todayStr) {
                stateColor = '#7b1fa2'; 
                stateBg = 'rgba(123, 31, 162, 0.15)';
            } else {
                stateColor = '#757575'; 
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
                            <span style="padding: 2px 8px; border-radius: 12px; background: ${stateBg}; color: ${stateColor}; font-weight: 500; font-size: 0.75rem;">${evt.status}</span>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-sm btn-outline edit-btn" data-id="${evt.id}"><i class="fa-solid fa-pen"></i> Edit</button>
                    </div>
                </div>
            `;
        }

        function createEventListItem(evt) {
            const dateObj = new Date(evt.date);
            const month = dateObj.toLocaleString('default', { month: 'short' });
            const day = dateObj.getDate();

            let priceDisplay = 'Free';
            if (evt.price > 0) {
                priceDisplay = `${evt.price} SAR`;
                if (evt.tickets && evt.tickets.length > 1) {
                    priceDisplay = `From ${evt.price} SAR`;
                }
            }

            const todayStr = new Date().toISOString().split('T')[0];
            let eventState, stateColor, stateBg;
            if (evt.date === todayStr) {
                eventState = 'Ongoing';
                stateColor = '#2e7d32'; 
                stateBg = 'rgba(46, 125, 50, 0.15)';
            } else if (evt.date > todayStr) {
                eventState = 'Upcoming';
                stateColor = '#7b1fa2';
                stateBg = 'rgba(123, 31, 162, 0.15)';
            } else {
                eventState = 'Past';
                stateColor = '#757575';
                stateBg = 'rgba(117, 117, 117, 0.15)';
            }
            const eventStateBadge = `<span style="font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; background: ${stateBg}; color: ${stateColor}; font-weight: 500; margin-left: 8px;">${eventState}</span>`;

            let scegaStatusIcon, scegaStatusColor, scegaStatusBg, scegaStatusText;
            switch (evt.status) {
                case 'Pending':
                    scegaStatusIcon = 'fa-clock';
                    scegaStatusColor = '#ff9800';
                    scegaStatusBg = 'rgba(255, 152, 0, 0.1)';
                    scegaStatusText = 'Pending Review';
                    break;
                case 'Rejected':
                    scegaStatusIcon = 'fa-circle-xmark';
                    scegaStatusColor = '#c62828';
                    scegaStatusBg = 'rgba(198, 40, 40, 0.1)';
                    scegaStatusText = 'Rejected';
                    break;
                default: 
                    scegaStatusIcon = 'fa-circle-check';
                    scegaStatusColor = '#2e7d32';
                    scegaStatusBg = 'rgba(46, 125, 50, 0.1)';
                    scegaStatusText = 'Approved';
            }

            let rejectionInfo = '';
            if (evt.status === 'Rejected' && evt.rejectionReason) {
                const maxLen = 40;
                if (evt.rejectionReason.length <= maxLen) {
                    rejectionInfo = `
                        <div style="font-size: 0.75rem; color: #c62828; margin-top: 0.25rem;">
                            <i class="fa-solid fa-comment"></i> ${evt.rejectionReason}
                        </div>
                    `;
                } else {
                    const truncated = evt.rejectionReason.substring(0, maxLen) + '...';
                    rejectionInfo = `
                        <div style="font-size: 0.75rem; color: #c62828; margin-top: 0.25rem;">
                            <i class="fa-solid fa-comment"></i> ${truncated}
                            <button class="btn btn-sm" style="padding: 1px 6px; font-size: 0.65rem; margin-left: 4px; background: #c62828; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="showFullRejectionReason('${encodeURIComponent(evt.rejectionReason)}')">
                                <i class="fa-solid fa-eye"></i> View
                            </button>
                        </div>
                    `;
                }
            }

            let actionButtons = `
                <button class="btn btn-sm btn-outline edit-btn" data-id="${evt.id}"><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="btn btn-sm btn-outline delete-btn" data-id="${evt.id}" style="color: #c62828; border-color: #c62828;"><i class="fa-solid fa-trash"></i></button>
            `;
            if (evt.status === 'Rejected') {
                actionButtons = `
                    <button class="btn btn-sm btn-success edit-btn" data-id="${evt.id}"><i class="fa-solid fa-rotate"></i> Resubmit</button>
                    <button class="btn btn-sm btn-outline delete-btn" data-id="${evt.id}" style="color: #c62828; border-color: #c62828;"><i class="fa-solid fa-trash"></i></button>
                `;
            }

            return `
                <div class="event-list-item" style="display: grid; grid-template-columns: 80px 1fr 140px 120px; align-items: center; gap: 1.5rem;">
                    <div class="event-date-box">
                        <span class="date-month">${month}</span>
                        <span class="date-day">${day}</span>
                    </div>

                    <div class="event-details-text">
                        <h4 style="margin: 0 0 0.25rem 0;">${evt.title} ${eventStateBadge}</h4>
                        <div class="event-meta-info" style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--text-muted);">
                            <span><i class="fa-regular fa-clock"></i> ${evt.time}</span>
                            <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
                            <span><i class="fa-solid fa-ticket"></i> ${priceDisplay}</span>
                        </div>
                    </div>

                    <div class="scega-status-column" style="text-align: center; min-width: 120px;">
                        <div style="background: ${scegaStatusBg}; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid ${scegaStatusColor}20;">
                            <i class="fa-solid ${scegaStatusIcon}" style="font-size: 1.25rem; color: ${scegaStatusColor}; display: block; margin-bottom: 0.25rem;"></i>
                            <span style="font-size: 0.75rem; font-weight: 600; color: ${scegaStatusColor};">${scegaStatusText}</span>
                            ${rejectionInfo}
                        </div>
                    </div>

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

            const totalEl = document.getElementById('stat-total-events');
            if (totalEl) totalEl.textContent = total;

            const upcomingEl = document.getElementById('stat-upcoming');
            if (upcomingEl) upcomingEl.textContent = upcoming;

            const pendingEl = document.getElementById('stat-pending');
            if (pendingEl) pendingEl.textContent = pending;
        }

        const filterSelect = document.getElementById('event-filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                renderEvents();
            });
        }

        renderEvents();
        updateStats();

        window.deleteEvent = deleteEvent;

        // --- REQUESTS LOGIC ---
        const REQUESTS_DB_KEY = 'eventia_requests_db';

        function getRequests() {
            const stored = localStorage.getItem(REQUESTS_DB_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        function saveRequest(request) {
            const requests = getRequests();
            requests.push(request);
            localStorage.setItem(REQUESTS_DB_KEY, JSON.stringify(requests));
        }

        function renderRequests() {
            const requests = getRequests();
            const vendors = getVendors();
            const events = getEvents();
            const tableBody = document.getElementById('requests-table-body');
            const noMsg = document.getElementById('no-requests-msg');
            const statusFilter = document.getElementById('request-status-filter');
            const tableEl = document.getElementById('requests-table');

            if (!tableBody) return;

            let filtered = requests;
            if (statusFilter && statusFilter.value !== 'all') {
                filtered = filtered.filter(r => r.status === statusFilter.value);
            }

            if (filtered.length === 0) {
                tableBody.innerHTML = '';
                if (noMsg) noMsg.style.display = 'block';
                if (tableEl) tableEl.style.display = 'none';
                return;
            }

            if (noMsg) noMsg.style.display = 'none';
            if (tableEl) tableEl.style.display = 'table';

            filtered.sort((a, b) => new Date(b.dateSent) - new Date(a.dateSent));

            tableBody.innerHTML = filtered.map(req => {
                const vendor = vendors.find(v => v.id === req.vendorId) || { name: 'Unknown Vendor', category: 'N/A' };
                const evt = events.find(e => e.id === req.eventId) || { title: 'Unlinked Event' };

                let statusClass = '';
                let statusIcon = '';
                if (req.status === 'Pending') {
                    statusClass = 'status-pending';
                    statusIcon = '<i class="fa-solid fa-clock"></i>';
                } else if (req.status === 'Approved') {
                    statusClass = 'status-approved';
                    statusIcon = '<i class="fa-solid fa-check-circle"></i>';
                } else if (req.status === 'Rejected') {
                    statusClass = 'status-rejected';
                    statusIcon = '<i class="fa-solid fa-circle-xmark"></i>';
                }

                const dateObj = new Date(req.dateSent);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                return `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #e0e7ff, #c7d2fe); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i class="fa-solid fa-store" style="color: #4f46e5; font-size: 0.9rem;"></i>
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: #1e293b; font-size: 0.9rem;">${vendor.name}</div>
                                    <div style="font-size: 0.8rem; color: #64748b;">${vendor.category}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div style="color: #475569; font-size: 0.9rem;">
                                ${req.message.substring(0, 35)}${req.message.length > 35 ? '...' : ''}
                                ${req.message.length > 35 ? `<a href="#" onclick="event.preventDefault(); openMessageModal('${req.message.replace(/'/g, "\\'").replace(/\n/g, ' ')}')" style="color: #3b82f6; font-size: 0.8rem; margin-left: 6px; text-decoration: none;">Read more</a>` : ''}
                            </div>
                        </td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-calendar" style="color: #94a3b8; font-size: 0.8rem;"></i>
                                <span style="color: #334155;">${evt.title}</span>
                            </div>
                        </td>
                        <td>
                            <span style="color: #64748b; font-size: 0.85rem;">${formattedDate}</span>
                        </td>
                        <td><span class="status-badge ${statusClass}">${statusIcon}${req.status}</span></td>
                    </tr>
                `;
            }).join('');
        }

        const requestModal = document.getElementById('request-modal');
        const closeModalBtns = document.querySelectorAll('.close-modal-btn');
        const requestForm = document.getElementById('send-request-form');

        function openRequestModal(vendorId, vendorName) {
            if (!requestModal) return;

            document.getElementById('request-vendor-id').value = vendorId;
            document.getElementById('modal-vendor-name').textContent = vendorName;

            const eventSelect = document.getElementById('request-event-select');
            const events = getEvents().filter(e => e.status === 'Upcoming' || e.status === 'Ongoing');

            eventSelect.innerHTML = '<option value="" disabled selected>Choose an event...</option>';
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
            requestForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const vendorId = document.getElementById('request-vendor-id').value;
                const eventId = document.getElementById('request-event-select').value;
                const message = document.getElementById('request-message').value;
                const now = new Date();

                const newRequest = {
                    id: 'r' + Date.now(),
                    vendorId: vendorId,
                    eventId: eventId,
                    message: message,
                    status: 'Pending',
                    dateSent: now.toISOString().split('T')[0]
                };

                saveRequest(newRequest);
                showToast("Request sent successfully!");
                if (requestModal) requestModal.classList.add('hidden');
                requestForm.reset();
                renderRequests();
            });
        }

        const INCOMING_REQUESTS_KEY = 'eventia_incoming_requests';

        function getIncomingRequests() {
            return JSON.parse(localStorage.getItem(INCOMING_REQUESTS_KEY)) || [];
        }

        function saveIncomingRequests(requests) {
            localStorage.setItem(INCOMING_REQUESTS_KEY, JSON.stringify(requests));
        }

        function renderIncomingRequests() {
            const requests = getIncomingRequests();
            const events = getEvents();
            const tableBody = document.getElementById('incoming-requests-table-body');
            const noMsg = document.getElementById('no-incoming-requests-msg');
            const statusFilter = document.getElementById('incoming-status-filter');
            const tableEl = document.getElementById('incoming-requests-table');
            const badge = document.getElementById('incoming-badge');

            if (!tableBody) return;

            const pendingCount = requests.filter(r => r.status === 'Pending').length;
            if (badge) {
                if (pendingCount > 0) {
                    badge.textContent = pendingCount;
                    badge.style.display = 'inline';
                } else {
                    badge.style.display = 'none';
                }
            }

            let filtered = requests;
            if (statusFilter && statusFilter.value !== 'all') {
                filtered = filtered.filter(r => r.status === statusFilter.value);
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
                const evt = events.find(e => e.id === req.eventId) || { title: 'Unknown Event' };

                let statusClass = '';
                let actionButtons = '';
                if (req.status === 'Pending') {
                    statusClass = 'status-upcoming';
                    actionButtons = `
                        <div style="display: flex; gap: 6px; justify-content: center;">
                            <button class="btn btn-sm" style="padding: 6px 12px; font-size: 0.8rem; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; border-radius: 6px;" onclick="handleIncomingRequest('${req.id}', 'approve')">
                                <i class="fa-solid fa-check"></i> Approve
                            </button>
                            <button class="btn btn-sm" style="padding: 6px 12px; font-size: 0.8rem; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 6px;" onclick="handleIncomingRequest('${req.id}', 'reject')">
                                <i class="fa-solid fa-xmark"></i> Reject
                            </button>
                        </div>
                    `;
                } else if (req.status === 'Approved') {
                    statusClass = 'status-approved';
                    actionButtons = `<span style="color: #2e7d32; font-size: 0.85rem; font-weight: 500; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-check-circle"></i>Approved</span>`;
                } else if (req.status === 'Rejected') {
                    statusClass = 'status-rejected';
                    actionButtons = `<span style="color: #c62828; font-size: 0.85rem; font-weight: 500; display: inline-flex; align-items: center; gap: 4px;"><i class="fa-solid fa-circle-xmark"></i>Rejected</span>`;
                }

                const dateObj = new Date(req.dateReceived);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                return `
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                    <i class="fa-solid fa-user-tie" style="color: #d97706; font-size: 0.9rem;"></i>
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: #1e293b; font-size: 0.9rem;">${req.vendorName}</div>
                                    <div style="font-size: 0.8rem; color: #64748b;">${req.vendorEmail || 'No email'}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span style="background: #f1f5f9; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; color: #475569;">${req.serviceType}</span>
                        </td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-calendar" style="color: #94a3b8; font-size: 0.8rem;"></i>
                                <span style="color: #334155;">${evt.title}</span>
                            </div>
                        </td>
                        <td>
                            <span style="color: #64748b; font-size: 0.85rem;">${formattedDate}</span>
                        </td>
                        <td>
                            <div style="color: #475569; font-size: 0.85rem;">
                                ${req.message.substring(0, 25)}${req.message.length > 25 ? '...' : ''}
                                ${req.message.length > 25 ? `<a href="#" onclick="event.preventDefault(); openMessageModal('${req.message.replace(/'/g, "\\'").replace(/\n/g, ' ')}')" style="color: #3b82f6; font-size: 0.8rem; margin-left: 6px; text-decoration: none;">Read more</a>` : ''}
                            </div>
                        </td>
                        <td style="text-align: center;">${actionButtons}</td>
                    </tr>
                `;
            }).join('');
        }

        window.handleIncomingRequest = function (requestId, action) {
            const requests = getIncomingRequests();
            const requestIndex = requests.findIndex(r => r.id === requestId);

            if (requestIndex !== -1) {
                requests[requestIndex].status = action === 'approve' ? 'Approved' : 'Rejected';
                saveIncomingRequests(requests);
                renderIncomingRequests();
                showToast(action === 'approve' ? 'Request approved!' : 'Request rejected.');
            }
        };

        const requestTabs = document.querySelectorAll('.request-tab');
        requestTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                requestTabs.forEach(t => {
                    t.classList.remove('active');
                    t.style.border = '2px solid #e0e0e0';
                    t.style.background = 'white';
                    t.style.boxShadow = 'none';
                    const iconContainer = t.querySelector('div:first-child');
                    if (iconContainer) {
                        iconContainer.style.background = 'linear-gradient(135deg, #f0f4f8, #e3e8ed)';
                        const icon = iconContainer.querySelector('i');
                        if (icon) icon.style.color = '#1565c0';
                    }
                    const textContainer = t.querySelector('div:nth-child(2)');
                    if (textContainer) {
                        const title = textContainer.querySelector('div:first-child');
                        const subtitle = textContainer.querySelector('div:last-child');
                        if (title) title.style.color = '#333';
                        if (subtitle) subtitle.style.color = '#666';
                    }
                });

                tab.classList.add('active');
                tab.style.border = 'none';
                tab.style.background = 'linear-gradient(135deg, #1565c0, #0d47a1)';
                tab.style.boxShadow = '0 4px 15px rgba(21, 101, 192, 0.3)';
                const activeIconContainer = tab.querySelector('div:first-child');
                if (activeIconContainer) {
                    activeIconContainer.style.background = 'rgba(255,255,255,0.2)';
                    const activeIcon = activeIconContainer.querySelector('i');
                    if (activeIcon) activeIcon.style.color = 'white';
                }
                const activeTextContainer = tab.querySelector('div:nth-child(2)');
                if (activeTextContainer) {
                    const title = activeTextContainer.querySelector('div:first-child');
                    const subtitle = activeTextContainer.querySelector('div:last-child');
                    if (title) title.style.color = 'white';
                    if (subtitle) subtitle.style.color = 'rgba(255,255,255,0.8)';
                }

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

        const reqFilter = document.getElementById('request-status-filter');
        if (reqFilter) {
            reqFilter.addEventListener('change', renderRequests);
        }

        const incomingFilter = document.getElementById('incoming-status-filter');
        if (incomingFilter) {
            incomingFilter.addEventListener('change', renderIncomingRequests);
        }

        const originalSwitchView = window.switchView;
        window.switchView = function (viewId) {
            sidebarItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.view === viewId) {
                    item.classList.add('active');
                }
            });

            sections.forEach(sec => {
                sec.classList.remove('active');
                if (sec.id === `view-${viewId}`) {
                    sec.classList.add('active');
                }
            });

            const titles = {
                'overview': 'Dashboard Overview',
                'create-event': 'Create New Event',
                'events-list': 'My Events',
                'vendors': 'Vendor Marketplace',
                'requests': 'Manage Requests',
                'analytics': 'Event Analytics'
            };
            if (pageTitle) pageTitle.textContent = titles[viewId] || 'Dashboard';

            if (window.innerWidth < 992) {
                sidebar.classList.remove('open');
            }

            if (viewId === 'overview' || viewId === 'events-list') {
                renderEvents();
                updateStats();
            } else if (viewId === 'vendors') {
                renderVendors();
            } else if (viewId === 'requests') {
                renderRequests();
            }
        };

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
                if (e.target === messageModal) {
                    closeMessageModal();
                }
            });
        }
    }

});