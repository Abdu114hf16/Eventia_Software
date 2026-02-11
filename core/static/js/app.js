document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation & View Management ---
    const heroBrowseBtn = document.getElementById('hero-browse-btn');
    if (heroBrowseBtn) {
        heroBrowseBtn.addEventListener('click', () => {
            const grid = document.querySelector('.events-container');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Role Management (Dynamic Fields) ---
    // These templates now include the 'name' attributes required by Django
    const roleFields = {
        organizer: `
            <input type="hidden" name="role" value="ORGANIZER">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="organizer123" required>
            </div>
            <div class="input-group">
                <label>Organization Name</label>
                <input type="text" name="organization_name" placeholder="Company Name" required>
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
                    </optgroup>
                    <option value="Other">Other</option>
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
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
            </div>
            <div class="input-group">
                <label>Birthday</label>
                <div class="date-inputs-wrapper">
                    <select name="month" class="date-select month-select" required>
                        <option value="" disabled selected>Month</option>
                        <option value="01">January</option><option value="02">February</option><option value="03">March</option>
                        <option value="04">April</option><option value="05">May</option><option value="06">June</option>
                        <option value="07">July</option><option value="08">August</option><option value="09">September</option>
                        <option value="10">October</option><option value="11">November</option><option value="12">December</option>
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
        `
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
            const role = tab.dataset.role;
            const targetForm = tab.dataset.target; // 'signup'

            // Update Active State
            const parent = tab.parentElement;
            if (parent) {
                parent.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
            }
            tab.classList.add('active');

            // Update Button Text
            const formContainer = document.getElementById(`${targetForm}-form-container`);
            if (formContainer) {
                const btnSpan = formContainer.querySelector('.current-role-text');
                if (btnSpan) btnSpan.textContent = role.charAt(0).toUpperCase() + role.slice(1);
            }

            // Update Fields
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

            // Special logic for Attendee Birthday Year
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
            // Re-attach validators since we just replaced the HTML
            attachPasswordValidators();
            attachEmailCleaners();
        }, 200);
    }

    function attachEmailCleaners() {
        const emailInput = signupDynamicContainer.querySelector('.signup-email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                emailInput.classList.remove('input-error');
                const error = signupDynamicContainer.querySelector('.email-error');
                if (error) error.classList.remove('visible');
            });
        }
    }

    function attachPasswordValidators() {
        const passwordInput = signupDynamicContainer.querySelector('.signup-password');
        const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');

        if (!passwordInput || !confirmInput) return;

        function validate() {
            const pwd = passwordInput.value;
            const confirm = confirmInput.value;

            // Just basic visual cleanup on input
            if (pwd) passwordInput.classList.remove('input-error');
            if (confirm) confirmInput.classList.remove('input-error');
        }

        passwordInput.addEventListener('input', validate);
        confirmInput.addEventListener('input', validate);
    }

    // --- FORM SUBMISSION ---
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            // Only prevent default if validation FAILS.
            // Otherwise, let Django handle it.

            const passwordInput = signupDynamicContainer.querySelector('.signup-password');
            const confirmInput = signupDynamicContainer.querySelector('.signup-confirm-password');
            const emailInput = signupDynamicContainer.querySelector('.signup-email');
            let isValid = true;

            // Simple Email Regex
            if (emailInput) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    emailInput.classList.add('input-error');
                    isValid = false;
                }
            }

            // Password Match
            if (passwordInput && confirmInput) {
                if (passwordInput.value !== confirmInput.value) {
                    confirmInput.classList.add('input-error');
                    isValid = false;
                }
                if (passwordInput.value.length < 8) {
                    passwordInput.classList.add('input-error');
                    isValid = false;
                }
            }

            if (!isValid) {
                e.preventDefault(); // Stop submission
                alert("Please correct the errors before submitting.");
            }
            // If valid, do NOTHING. Let the form submit to Django.
        });
    }

    // --- DASHBOARD INITIALIZATION ---
    if (document.body.classList.contains('dashboard-body')) {
        // Only run dashboard logic if initDashboard is defined
        if (typeof initDashboard === 'function') {
            initDashboard();
        } else if (typeof initScegaDashboard === 'function') {
            initScegaDashboard();
        }
    }
});