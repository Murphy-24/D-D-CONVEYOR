// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    setupDashboardFunctionality();
});

// Authentication check
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isLoggedIn || !userEmail) {
        // Redirect to login page if not authenticated
        window.location.href = 'index.html';
        return;
    }
    
    // Update welcome message with user email
    updateWelcomeMessage(userEmail);
}

// Update welcome message
function updateWelcomeMessage(email) {
    const welcomeTitle = document.querySelector('.welcome-content h2');
    if (welcomeTitle) {
        const name = localStorage.getItem('profileName') || email.split('@')[0];
        welcomeTitle.textContent = `Welcome back, ${name}!`;
    }
}

// Setup dashboard functionality
function setupDashboardFunctionality() {
    // Setup logout functionality
    const logoutBtn = document.querySelector('.nav-link.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Setup navigation links
    setupNavigation();
    
    // Setup action buttons
    setupActionButtons();
    
    // Setup feature buttons
    setupFeatureButtons();

    // Open settings modal
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.textContent.trim().includes('Settings')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('settingsModal').style.display = 'flex';
            });
        }
    });
    // Close modal
    document.getElementById('closeSettingsModal').onclick = closeSettings;
    document.getElementById('cancelSettingsBtn').onclick = closeSettings;
    function closeSettings() {
        document.getElementById('settingsModal').style.display = 'none';
    }
    // Save settings
    document.getElementById('settingsForm').onsubmit = function(e) {
        e.preventDefault();
        // You can add logic to save settings to localStorage or backend here
        closeSettings();
        alert('Settings saved!');
    };
    // Change Password button
    document.getElementById('changePasswordBtn').onclick = function() {
        alert('Password change feature coming soon!');
    };
}

// Handle logout
function handleLogout() {
    // Clear authentication data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    // Show logout notification
    showNotification('Logging out...', 'info');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link:not(.logout)');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default and show notification for #
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                link.classList.add('active');
                // Show notification for now (in a real app, this would navigate to different sections)
                const pageName = link.textContent.trim();
                showNotification(`${pageName} page coming soon!`, 'info');
            }
            // Otherwise, let the browser navigate normally
        });
    });
}

// Setup action buttons
function setupActionButtons() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const actionName = btn.querySelector('span').textContent;
            showNotification(`${actionName} feature coming soon!`, 'info');
        });
    });
}

// Setup feature buttons
function setupFeatureButtons() {
    // These functions will be called by the onclick handlers in HTML
    window.openSignToText = () => {
        window.location.href = 'sign-to-text.html';
    };
    
    window.openTextToSign = () => {
        window.location.href = 'text-to-sign.html';
    };
    
    window.openLearningModule = () => {
        showNotification('Opening Learning Module...', 'info');
        // In a real app, this would open the learning interface
        setTimeout(() => {
            showNotification('Learning Module loaded with 50+ lessons!', 'success');
        }, 1000);
    };
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.dashboard-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `dashboard-notification notification-${type}`;
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
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea'};
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
}

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

// Add vibration feedback for mobile devices
function vibrate(pattern = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Add visual feedback for interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('button, .nav-link, .action-btn, .feature-btn')) {
        vibrate();
    }
});

// Add hover effects for feature cards
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Accessibility: Announce dashboard load to screen readers
window.addEventListener('load', () => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Sign Language Connect dashboard loaded. Use tab to navigate through features.';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 3000);
}); 