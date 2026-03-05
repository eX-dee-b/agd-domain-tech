/* ============================================
   AYYA GSM DOMAIN (AGD TECH) - JAVASCRIPT
   Mobile Repair Website Functionality
   
   WHAT THIS FILE DOES:
   - Generates unique order codes
   - Handles form submission
   - Sends data to WhatsApp
   - Shows toast notifications
   - Manages scroll animations
   - Copies order code to clipboard
   
   FOR NEW DEVELOPERS:
   - Each function has clear comments
   - Variables have descriptive names
   - No complex patterns, just vanilla JavaScript
   - Edit the WhatsApp number in confirmWhatsApp function
   
   MAINTENANCE:
   - To change WhatsApp number: Search for "2348071234567"
   - To add new service: Edit the <select> in HTML
   - To change animations: Edit the timing values
   ============================================ */

// ============================================
// CONFIGURATION
// Edit these values to customize functionality
// ============================================

const CONFIG = {
    // WhatsApp number (EDIT THIS)
    whatsappNumber: '2347086689554', // Format: 2348071234567 (no spaces, no +)
    
    // Toast notification duration (in milliseconds)
    toastDuration: 3000,
    
    // Form processing delay (simulates server processing)
    processingDelay: 1000,
    
    // Scroll offset for header shadow
    scrollOffset: 50
};

// ============================================
// UTILITY FUNCTIONS
// Helper functions used throughout the code
// ============================================

/**
 * Generate unique order code
 * Format: AGD-YYMMDD-XXXX
 * 
 * Example output: AGD-240305-A1B2
 * 
 * HOW IT WORKS:
 * 1. Gets current date
 * 2. Formats as YYMMDD
 * 3. Generates 4 random characters
 * 4. Combines into order code
 * 
 * @returns {string} Order code
 */
function generateOrderCode() {
    const date = new Date();
    // Get date in YYMMDD format (e.g., 240305 for March 5, 2024)
    const dateStr = date.toISOString().slice(2,10).replace(/-/g,'');
    // Generate 4 random uppercase letters/numbers
    const random = Math.random().toString(36).substr(2,4).toUpperCase();
    // Combine: AGD-240305-A1B2
    return `AGD-${dateStr}-${random}`;
}

/**
 * Show toast notification
 * Displays pop-up message to user
 * 
 * USAGE:
 * showToast('Success!', 'success');
 * showToast('Error occurred', 'error');
 * showToast('Processing...');
 * 
 * @param {string} message - Text to display
 * @param {string} type - 'success', 'error', or '' (default)
 */
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    // Set classes: 'toast' + 'success' or 'error'
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    // Auto-hide after specified duration
    setTimeout(() => {
        toast.classList.remove('show');
    }, CONFIG.toastDuration);
}

/**
 * Format number as Nigerian Naira currency
 * Converts 5000 to ₦5,000
 * 
 * USAGE:
 * formatCurrency(5000) → "₦5,000"
 * formatCurrency(10000) → "₦10,000"
 * 
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
    return `₦${parseInt(amount).toLocaleString()}`;
}

// ============================================
// SCROLL ANIMATIONS
// Makes service cards appear when scrolling
// ============================================

/**
 * Observe elements and add 'visible' class when in viewport
 * Uses modern IntersectionObserver API
 * 
 * HOW IT WORKS:
 * 1. Watches for service cards entering viewport
 * 2. When card is 10% visible, adds 'visible' class
 * 3. CSS animation makes card fade in
 * 4. Stops watching after animation (saves resources)
 * 
 * NEW DEVELOPERS: Don't change this unless needed
 */
const observeElements = () => {
    // Create observer with options
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If element is visible in viewport
            if (entry.isIntersecting) {
                // Add 'visible' class (triggers CSS animation)
                entry.target.classList.add('visible');
                // Stop watching this element (performance optimization)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,              // Trigger when 10% visible
        rootMargin: '0px 0px -50px 0px'  // Start slightly before entering view
    });

    // Watch all service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
};

// ============================================
// HEADER SCROLL EFFECT
// Adds shadow to header when scrolling down
// ============================================

/**
 * Add shadow to header when page scrolls
 * 
 * HOW IT WORKS:
 * - When scroll > 50px, adds 'scrolled' class
 * - CSS applies shadow to header
 * - Creates depth effect on scroll
 */
window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    
    if (window.scrollY > CONFIG.scrollOffset) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============================================
// FORM HANDLING
// Processes customer quote requests
// ============================================

// Get form elements (cached for performance)
const orderForm = document.getElementById('orderForm');
const orderSummary = document.getElementById('orderSummary');
const submitBtn = document.getElementById('submitBtn');

/**
 * Handle form submission
 * 
 * PROCESS:
 * 1. Validate all fields
 * 2. Generate order code
 * 3. Show loading state
 * 4. Display summary with order details
 * 5. Store data for WhatsApp message
 * 
 * NEW DEVELOPERS: This is the main form logic
 */
orderForm.addEventListener('submit', function(e) {
    // Prevent page reload
    e.preventDefault();
    
    // STEP 1: Validate form
    if (!this.checkValidity()) {
        showToast('Please fill all required fields', 'error');
        // Focus first invalid field
        const firstInvalid = this.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
    }
    
    // STEP 2: Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const device = document.getElementById('device').value;
    
    // Get selected service
    const serviceSelect = document.getElementById('service');
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
    const servicePrice = serviceSelect.options[serviceSelect.selectedIndex].dataset.price;
    
    const details = document.getElementById('details').value;
    
    // STEP 3: Generate unique order code
    const orderCode = generateOrderCode();
    
    // STEP 4: Show loading state
    document.getElementById('submitText').style.display = 'none';
    document.getElementById('submitLoading').style.display = 'inline-block';
    submitBtn.disabled = true;
    
    // STEP 5: Simulate processing (feels more professional)
    setTimeout(() => {
        // Fill in summary fields
        document.getElementById('summaryService').textContent = serviceName;
        document.getElementById('summaryDevice').textContent = device;
        document.getElementById('summaryPrice').textContent = 
            servicePrice === "0" ? "To be quoted" : `From ${formatCurrency(servicePrice)}`;
        document.getElementById('orderCode').textContent = orderCode;
        
        // Show summary section with animation
        orderSummary.classList.add('show');
        orderSummary.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
        
        // Reset button state
        document.getElementById('submitText').style.display = 'inline';
        document.getElementById('submitLoading').style.display = 'none';
        submitBtn.disabled = false;
        
        // STEP 6: Store order data globally for WhatsApp
        window.currentOrder = {
            name, 
            phone, 
            device, 
            serviceName, 
            servicePrice, 
            details, 
            orderCode
        };
        
        // Show success message
        showToast('Quote ready! Click confirm to send via WhatsApp', 'success');
        
    }, CONFIG.processingDelay);
});

// ============================================
// COPY ORDER CODE
// Copies order code to clipboard
// ============================================

/**
 * Copy order code to clipboard
 * 
 * HOW IT WORKS:
 * 1. Gets order code text
 * 2. Uses Clipboard API to copy
 * 3. Shows success message
 * 4. Changes button text temporarily
 * 
 * FALLBACK: If Clipboard API not supported, shows code in toast
 */
document.getElementById('copyCodeBtn').addEventListener('click', function() {
    const orderCode = document.getElementById('orderCode').textContent;
    
    // Try modern Clipboard API
    if (navigator.clipboard) {
        navigator.clipboard.writeText(orderCode).then(() => {
            // Success: Change button text
            this.textContent = '✓ Copied!';
            showToast('Order code copied to clipboard', 'success');
            
            // Reset button text after 2 seconds
            setTimeout(() => {
                this.textContent = '📋 Copy Code';
            }, 2000);
        });
    } else {
        // Fallback: Show code in toast
        showToast('Order code: ' + orderCode, 'success');
    }
});

// ============================================
// WHATSAPP CONFIRMATION
// Sends order details via WhatsApp
// ============================================

/**
 * Send order to WhatsApp with pre-filled message
 * 
 * IMPORTANT: Edit WhatsApp number in CONFIG at top of file
 * 
 * HOW IT WORKS:
 * 1. Gets stored order data
 * 2. Formats message with all details
 * 3. Encodes message for URL
 * 4. Opens WhatsApp with pre-filled message
 * 
 * TO CHANGE WHATSAPP NUMBER:
 * - Edit CONFIG.whatsappNumber at top of this file
 * - Format: 2348071234567 (no spaces, no +)
 */
document.getElementById('confirmWhatsApp').addEventListener('click', function() {
    // Get stored order data
    const o = window.currentOrder;
    
    // Create formatted message
    const message = `Hi AGD Tech! 👋

I need a repair quote:

📱 Device: ${o.device}
🔧 Problem: ${o.serviceName}
💰 Estimated: ${o.servicePrice === "0" ? "To be quoted" : "From " + formatCurrency(o.servicePrice)}

📋 Order Code: ${o.orderCode}

👤 Name: ${o.name}
📞 Phone: ${o.phone}

${o.details ? '📝 Details: ' + o.details : ''}

When can I bring it in?`;

    // Create WhatsApp URL with encoded message
    const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new window
    window.open(whatsappURL, '_blank');
    
    // Show feedback
    showToast('Opening WhatsApp...', 'success');
});

// ============================================
// PAYMENT METHOD SELECTION
// Highlights selected payment method
// ============================================

/**
 * Handle payment method selection
 * 
 * HOW IT WORKS:
 * 1. Click on any payment method
 * 2. Removes 'selected' from all methods
 * 3. Adds 'selected' to clicked method
 * 4. CSS shows checkmark on selected method
 */
document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', function() {
        // Remove selected class from all
        document.querySelectorAll('.payment-method').forEach(m => 
            m.classList.remove('selected')
        );
        // Add selected class to clicked method
        this.classList.add('selected');
    });
});

// ============================================
// INITIALIZATION
// Runs when page loads
// ============================================

/**
 * Initialize on page load
 * 
 * RUNS:
 * - Scroll animations
 * - Any other startup code
 */
document.addEventListener('DOMContentLoaded', function() {
    // Start observing service cards for scroll animation
    observeElements();
    
    // Log for debugging (remove in production)
    console.log('AGD Tech website loaded successfully');
    console.log('WhatsApp number:', CONFIG.whatsappNumber);
});

// ============================================
// PERFORMANCE MONITORING (Optional)
// Logs page load time for optimization
// ============================================

/**
 * Log page load performance
 * Helps identify slow loading issues
 * 
 * NEW DEVELOPERS: You can remove this if not needed
 */
window.addEventListener('load', function() {
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - 
                        window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // If load time > 3 seconds, log warning
        if (loadTime > 3000) {
            console.warn('Page load time is slow. Consider optimization.');
        }
    }
});

/* ============================================
   END OF JAVASCRIPT
   
   TIPS FOR NEW DEVELOPERS:
   1. Edit CONFIG object to change settings
   2. Test form on mobile devices
   3. Check browser console for errors
   4. Update WhatsApp number before deploying
   5. Keep backup before major changes
   
   COMMON TASKS:
   - Change WhatsApp number: Edit CONFIG.whatsappNumber
   - Add new service: Edit <select> in HTML (no JS change needed)
   - Change colors: Edit styles.css (not this file)
   - Adjust timing: Edit CONFIG.toastDuration or CONFIG.processingDelay
   
   NEED HELP?
   - Check browser console for error messages
   - Test one feature at a time
   - Ask experienced developer if stuck
   ============================================ */