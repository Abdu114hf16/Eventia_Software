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
    const roleFields = {
        organizer: `
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
        `,
        vendor: `
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
            <input type="hidden" name="role" value="ATTENDEE">
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

            // Sync the active role with our new hidden input field for the backend to verify
            if (targetForm === 'login') {
                const loginRoleInput = document.getElementById('login-role-input');
                if (loginRoleInput) {
                    loginRoleInput.value = role;
                }
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

    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {

            const passwordInput = signupDynamicContainer.querySelector('.signup-password');
            const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');
            const emailInput = signupDynamicContainer.querySelector('.signup-email');

            let isValid = true;

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

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

});