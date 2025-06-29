// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const emailIndicator = document.getElementById('email-indicator');
const passwordIndicator = document.getElementById('password-indicator');

// Authentication credentials
const VALID_USERS = [
  { email: 'ayhtas777@gmail.com', password: 'cap@1920' },
  { email: 'perarasu1012@gmail.com', password: 'karthi@2005' }
];

// Form validation and visual feedback
class AccessibilityForm {
    constructor() {
        this.initializeForm();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupVisualIndicators();
    }

    initializeForm() {
        // Add ARIA labels and descriptions
        emailInput.setAttribute('aria-describedby', 'email-help');
        passwordInput.setAttribute('aria-describedby', 'password-help');
        
        // Create help text elements
        this.createHelpText();
        
        // Set focus management
        this.setupFocusManagement();
    }

    createHelpText() {
        // Email help text
        const emailHelp = document.createElement('div');
        emailHelp.id = 'email-help';
        emailHelp.className = 'sr-only';
        emailHelp.textContent = 'Enter a valid email address. Visual indicator will show green for valid format.';
        emailInput.parentNode.appendChild(emailHelp);

        // Password help text
        const passwordHelp = document.createElement('div');
        passwordHelp.id = 'password-help';
        passwordHelp.className = 'sr-only';
        passwordHelp.textContent = 'Password must be at least 8 characters long. Visual indicator will show green when requirements are met.';
        passwordInput.parentNode.appendChild(passwordHelp);
    }

    setupEventListeners() {
        // Form submission
        loginForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        emailInput.addEventListener('input', () => this.validateEmail());
        passwordInput.addEventListener('input', () => this.validatePassword());

        // Password toggle
        togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());

        // Alternative login buttons
        document.querySelectorAll('.alt-login-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAlternativeLogin(e));
        });

        // Checkbox accessibility
        const rememberCheckbox = document.getElementById('remember');
        rememberCheckbox.addEventListener('change', (e) => this.handleCheckboxChange(e));
    }

    setupKeyboardNavigation() {
        // Tab navigation with visual focus indicators
        const focusableElements = loginForm.querySelectorAll(
            'input, button, a, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && element.tagName === 'INPUT') {
                    e.preventDefault();
                    this.moveToNextField(element);
                }
            });

            element.addEventListener('focus', () => {
                this.showFocusIndicator(element);
            });

            element.addEventListener('blur', () => {
                this.hideFocusIndicator(element);
            });
        });
    }

    setupVisualIndicators() {
        // Create visual feedback system
        this.indicators = {
            email: emailIndicator,
            password: passwordIndicator
        };
    }

    setupFocusManagement() {
        // Ensure proper focus order
        const focusOrder = [
            emailInput,
            passwordInput,
            document.getElementById('remember'),
            document.querySelector('.login-btn'),
            document.querySelector('.alt-login-btn.google'),
            document.querySelector('.alt-login-btn.facebook')
        ];

        focusOrder.forEach((element, index) => {
            if (element) {
                element.setAttribute('tabindex', index + 1);
            }
        });
    }

    validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        this.updateVisualIndicator('email', isValid, email);
        this.updateAriaLive('email', isValid);
        
        return isValid;
    }

    validatePassword() {
        const password = passwordInput.value;
        const isValid = password.length >= 8;

        this.updateVisualIndicator('password', isValid, password);
        this.updateAriaLive('password', isValid);
        
        return isValid;
    }

    updateVisualIndicator(field, isValid, value) {
        const indicator = this.indicators[field];
        
        if (!indicator) return;

        // Clear previous classes
        indicator.classList.remove('valid', 'invalid');
        
        if (value.length === 0) {
            indicator.style.background = '#e1e5e9';
            return;
        }

        if (isValid) {
            indicator.classList.add('valid');
            indicator.setAttribute('aria-label', `${field} is valid`);
        } else {
            indicator.classList.add('invalid');
            indicator.setAttribute('aria-label', `${field} is invalid`);
        }
    }

    updateAriaLive(field, isValid) {
        // Create or update aria-live region for screen readers
        let liveRegion = document.getElementById('aria-live');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }

        const message = isValid 
            ? `${field} validation passed` 
            : `${field} validation failed`;
        
        liveRegion.textContent = message;
    }

    togglePasswordVisibility() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const icon = togglePasswordBtn.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        
        // Update aria-label
        togglePasswordBtn.setAttribute('aria-label', 
            type === 'password' ? 'Show password' : 'Hide password'
        );
    }

    moveToNextField(currentField) {
        const fields = [emailInput, passwordInput];
        const currentIndex = fields.indexOf(currentField);
        
        if (currentIndex < fields.length - 1) {
            fields[currentIndex + 1].focus();
        } else {
            // If on last field, submit form
            this.handleSubmit(new Event('submit'));
        }
    }

    showFocusIndicator(element) {
        element.style.transform = 'scale(1.02)';
        element.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.3)';
    }

    hideFocusIndicator(element) {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            this.showError('Please correct the errors before submitting.');
            return;
        }

        // Check authentication for any valid user
        const isAuthenticated = VALID_USERS.some(user => user.email === email && user.password === password);
        if (isAuthenticated) {
            // Show loading state
            this.showLoadingState();
            
            // Simulate login process
            setTimeout(() => {
                this.showSuccess('Login successful! Redirecting to dashboard...');
                
                // Store login state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 2000);
        } else {
            this.showError('Invalid email or password. Please try again.');
            // Clear password field for security
            passwordInput.value = '';
            this.validatePassword();
        }
    }

    handleAlternativeLogin(e) {
        e.preventDefault();
        const provider = e.currentTarget.classList.contains('google') ? 'Google' : 'Facebook';
        this.showInfo(`Redirecting to ${provider} login...`);
    }

    handleCheckboxChange(e) {
        const isChecked = e.target.checked;
        const message = isChecked ? 'Remember me option selected' : 'Remember me option deselected';
        this.updateAriaLive('checkbox', isChecked);
    }

    showLoadingState() {
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        loginBtn.disabled = true;
        
        // Store original text to restore later
        loginBtn.dataset.originalText = originalText;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 
                    type === 'error' ? 'fas fa-exclamation-circle' : 
                    'fas fa-info-circle';
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#667eea'
        };
        notification.style.background = colors[type];

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityForm();
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            margin-left: auto;
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
});

// Add vibration feedback for mobile devices (if supported)
function vibrate(pattern = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Add visual feedback for interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('button, input[type="submit"], .alt-login-btn')) {
        vibrate();
    }
});

// Handle form field changes with visual feedback
document.addEventListener('input', (e) => {
    if (e.target.matches('input')) {
        // Add subtle visual feedback
        e.target.style.transform = 'scale(1.01)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    }
});

// Accessibility: Announce page load to screen readers
window.addEventListener('load', () => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Sign Language Connect login page loaded. Use tab to navigate through form fields.';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 3000);
}); 