// ===== ZOHO FLOW CONFIGURATION =====
const ZOHO_FLOW_WEBHOOK = "https://flow.zoho.eu/20108451502/flow/webhook/incoming?zapikey=1001.eb9b404861107089ba667a27ac5308c4.fa4699e069b31dc6b0a723fbb962567a&isdebug=true";

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZATION =====
function initializeApp() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupRevealAnimations();
    setupReverseScrollReveal();
    setupFormHandling();
    setupHeaderScroll();
    setupImageModal();
    setupRefreshScrollToTop();
    setupSmartNavbar();
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileToggle || !nav) return;
    
    mobileToggle.addEventListener('click', function() {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu state
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        nav.classList.toggle('nav-open');
        
        // Toggle hamburger animation
        const spans = mobileToggle.querySelectorAll('span');
        if (!isExpanded) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
        
        // Trap focus when menu is open
        if (!isExpanded) {
            trapFocus(nav);
        }
    });
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const spans = mobileToggle?.querySelectorAll('span');
    
    if (mobileToggle && nav) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav-open');
        
        if (spans) {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (firstElement) {
        firstElement.focus();
    }
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Global scroll functions for onclick handlers
function scrollToContact() {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== PAGE TRANSITION FUNCTION =====
function transitionToForm(event) {
    event.preventDefault();
    const transition = document.getElementById('pageTransition');
    const targetUrl = event.target.href;
    
    // Show transition overlay
    transition.classList.add('active');
    
    // Navigate after transition starts
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 300);
}

function scrollToResults() {
    const resultsSection = document.querySelector('#results');
    if (resultsSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = resultsSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== REVEAL ANIMATIONS =====
function setupRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove visible class when element goes out of view
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with reveal class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== REVERSE SCROLL REVEAL (Bottom to Top) =====
function setupReverseScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const reverseObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove visible class when element goes out of view
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with reverse-reveal class
    const reverseRevealElements = document.querySelectorAll('.reverse-reveal');
    reverseRevealElements.forEach(element => {
        reverseObserver.observe(element);
    });
}

// ===== REFRESH SCROLL TO TOP =====
function setupRefreshScrollToTop() {
    // Override browser's default refresh behavior
    window.addEventListener('beforeunload', function() {
        // Scroll to top before page unloads
        window.scrollTo(0, 0);
    });
    
    // Also handle page load to ensure we start at top
    window.addEventListener('load', function() {
        window.scrollTo(0, 0);
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        window.scrollTo(0, 0);
    });
}

// ===== HEADER SCROLL EFFECT =====
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===== ZOHO FLOW HELPER =====
function forwardToZoho(formData) {
    const payload = {
        name: formData.get("name") || "",
        email: formData.get("email") || "",
        company: formData.get("company") || "",
        phone: formData.get("phone") || "",
        message: formData.get("message") || "",
        source: "AIAnchor Website",
        submittedAt: new Date().toISOString()
    };
    
    fetch(ZOHO_FLOW_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).catch(() => {});
}

// ===== FORM HANDLING =====
function setupFormHandling() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Check honeypot
    const honeypot = form.querySelector('#website');
    if (honeypot && honeypot.value.trim() !== '') {
        showAlert('Spam detected. Please try again.', 'error');
        return;
    }
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        // Prepare form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Add source field for tracking
        data.source = 'AIAnchor Website Contact Form';
        data.timestamp = new Date().toISOString();
        
        // Send to both Formspree and custom webhook
        const promises = [
            // Send to Formspree
            fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            }),
            
            // Send to custom webhook for automated replies
            fetch('https://aianchor-webhook-service.onrender.com/webhook/4d0fe820-6feb-4aeb-96b6-1b980dcf7b83', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
        ];
        
        // Wait for both requests to complete
        const responses = await Promise.allSettled(promises);
        
        // Check if at least one submission was successful
        const formspreeSuccess = responses[0].status === 'fulfilled' && responses[0].value.ok;
        const webhookSuccess = responses[1].status === 'fulfilled' && responses[1].value.ok;
        
        if (formspreeSuccess || webhookSuccess) {
            showAlert('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            form.reset();
            
            // Scroll to alert
            setTimeout(() => {
                const alertContainer = document.getElementById('alertContainer');
                if (alertContainer) {
                    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        } else {
            throw new Error('Both form submissions failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showAlert('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
}

// ===== ALERT SYSTEM =====
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.setAttribute('role', type === 'success' ? 'status' : 'alert');
    alert.textContent = message;
    
    // Add to container
    alertContainer.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.opacity = '0';
            alert.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }
    }, 5000);
    
    // Remove on click
    alert.addEventListener('click', function() {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events
const throttledScrollHandler = throttle(function() {
    // Any scroll-based functionality can be added here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Debounce resize events
const debouncedResizeHandler = debounce(function() {
    // Any resize-based functionality can be added here
}, 250);

window.addEventListener('resize', debouncedResizeHandler);

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Add skip link functionality
function setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--brand);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize skip links
setupSkipLinks();

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// ===== PWA SUPPORT (BASIC) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration can be added here
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ===== ANALYTICS READY =====
// Google Analytics or other tracking can be added here
function trackEvent(eventName, eventData = {}) {
    // Example: trackEvent('button_click', { button: 'cta', section: 'hero' });
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    // Add other analytics providers as needed
}

// ===== HERO ROI POPOVER (scoped, safe) =====
(function(){
    const EURO = n => '€' + Math.round(+n || 0).toLocaleString();
    const $ = id => document.getElementById(id);

    const pop = $('roi-pop'), openBtn = $('roi-open'), closeBtn = $('roi-close');
    const navROI = $('nav-roi');
    const niche = $('roi-niche'), leads = $('roi-leads'), leadsVal = $('roi-leads-val'), leadsNum = $('roi-leads-num');
    const rev = $('roi-rev'), revVal = $('roi-rev-val'), revNum = $('roi-rev-num');
    const miss = $('roi-miss'), missVal = $('roi-miss-val'), missNum = $('roi-miss-num');
    const closeRate = $('roi-close'), closeSlider = $('roi-close-slider'), closeVal = $('roi-close-val');
    const out = $('roi-number'), advTgl = $('roi-adv-toggle'), advBox = $('roi-advanced');

    if (!pop || !niche) return;

    // Presets
    const PRESETS = {
        real_estate:   { rev: 3000, miss: 18, close: 20 },
        dental:        { rev: 500,  miss: 20, close: 18 },
        clinic_medspa: { rev: 400,  miss: 20, close: 22 },
        auto_repair:   { rev: 250,  miss: 15, close: 30 },
        home_services: { rev: 650,  miss: 18, close: 25 },
        fitness:       { rev: 350,  miss: 12, close: 35 },
        legal:         { rev: 2000, miss: 20, close: 14 },
        restaurant:    { rev: 60,   miss: 10, close: 6  },
        ecommerce:     { rev: 75,   miss: 12, close: 3  },
        saas:          { rev: 800,  miss: 18, close: 12 },
        education:     { rev: 500,  miss: 16, close: 20 },
        hospitality:   { rev: 300,  miss: 15, close: 18 },
        beauty:        { rev: 120,  miss: 18, close: 30 },
        veterinary:    { rev: 180,  miss: 15, close: 28 },
    };
    const RECOVERY = 0.60;

    function applyPreset(key){
        const p = PRESETS[key] || PRESETS.dental;
        leads.value = 100;
        leadsVal.textContent = '100';
        leadsNum.value = 100;
        rev.value = p.rev;
        revVal.textContent = '€' + p.rev;
        revNum.value = p.rev;
        miss.value = p.miss;
        missVal.textContent = p.miss + '%';
        missNum.value = p.miss;
        closeRate.value = p.close;
        closeSlider.value = p.close;
        closeVal.textContent = p.close + '%';
        calc();
        try { localStorage.setItem('aianchor_last_niche', key); } catch(_) {}
    }

    function calc(){
        const L = (+leads.value || 0);
        const R = (+rev.value   || 0);
        const M = (+miss.value  || 0) / 100;
        const C = (+closeRate.value || 0) / 100;

        const recovered = L * M * RECOVERY * C * R;
        out.textContent = EURO(recovered);
    }

    // Open/close
    function openPop(){
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.add('expanded');
        }
        pop.classList.add('show');
        pop.setAttribute('aria-hidden','false');
        setTimeout(()=> pop.scrollIntoView({behavior:'smooth', block:'nearest'}), 100);
    }
    function closePop(){
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.classList.remove('expanded');
        }
        pop.classList.remove('show');
        pop.setAttribute('aria-hidden','true');
    }

    openBtn && openBtn.addEventListener('click', openPop);
    navROI && navROI.addEventListener('click', (e)=>{ e.preventDefault(); openPop(); });
    closeBtn && closeBtn.addEventListener('click', closePop);
    document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closePop(); });

    // Bind
    [leads, rev, miss, closeRate, closeSlider, leadsNum, revNum, missNum].forEach(el=>{
        el && el.addEventListener('input', ()=>{
            if (el === leads) {
                leadsVal.textContent = leads.value;
                leadsNum.value = leads.value;
            }
            if (el === leadsNum) {
                leads.value = leadsNum.value;
                leadsVal.textContent = leadsNum.value;
            }
            if (el === rev) {
                revVal.textContent = '€' + rev.value;
                revNum.value = rev.value;
            }
            if (el === revNum) {
                rev.value = revNum.value;
                revVal.textContent = '€' + revNum.value;
            }
            if (el === miss) {
                missVal.textContent = miss.value + '%';
                missNum.value = miss.value;
            }
            if (el === missNum) {
                miss.value = missNum.value;
                missVal.textContent = missNum.value + '%';
            }
            if (el === closeSlider) {
                closeVal.textContent = closeSlider.value + '%';
                closeRate.value = closeSlider.value;
            }
            if (el === closeRate) {
                closeSlider.value = closeRate.value;
                closeVal.textContent = closeRate.value + '%';
            }
            calc();
        });
    });
    niche.addEventListener('change', ()=> applyPreset(niche.value));

    // Advanced toggle
    advTgl && advTgl.addEventListener('click', ()=>{
        const isHidden = advBox.hasAttribute('hidden');
        if (isHidden) { 
            // Show advanced section
            advBox.removeAttribute('hidden'); 
            advTgl.setAttribute('aria-expanded','true'); 
        } else { 
            // Hide advanced section
            advBox.setAttribute('hidden',''); 
            advTgl.setAttribute('aria-expanded','false'); 
        }
    });


    // Init
    const saved = (()=>{ try { return localStorage.getItem('aianchor_last_niche'); } catch(_){ return null; }})();
    const startKey = saved || niche.value;
    niche.value = startKey;
    applyPreset(startKey);
    calc();

    // Auto-inject summary into message textarea if present
    window.addEventListener('load', ()=>{
        const saved = localStorage.getItem('aianchor_roi');
        const msg = document.getElementById('message');
        if (saved && msg && !msg.value) {
            const d = JSON.parse(saved);
            msg.value = `Niche: ${d.niche}, Monthly leads: ${d.leads}, Avg ticket: €${d.rev}, Missed: ${d.miss}%, Close: ${d.close}%. Want a plan to recover this?`;
        }
    });
})();


// ===== CTA ANALYTICS =====
(function(){
    const ctas = document.querySelectorAll('.cta-button');
    ctas.forEach(btn=>{
        btn.addEventListener('click', ()=>{
            window.__aianchor_events = window.__aianchor_events || [];
            window.__aianchor_events.push({ type:'cta_click', label: btn.textContent.trim(), ts: Date.now() });
        });
    });
})();

// ===== EXPORT FOR GLOBAL USE =====
// ===== IMAGE MODAL FUNCTIONALITY =====
function setupImageModal() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.image-modal-close');
    
    // Close modal when clicking the X button
    closeBtn.addEventListener('click', closeImageModal);
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
            closeImageModal();
        }
    });
    
}

function openImageModal(imgElement) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    modal.style.display = 'flex';
    modalImg.src = imgElement.src;
    modalImg.alt = imgElement.alt;
    modalCaption.textContent = imgElement.alt;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// ===== FAQ FUNCTIONALITY =====
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current item
    faqItem.classList.toggle('active');
}

// Make functions globally available
window.scrollToTop = scrollToTop;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;
window.toggleFAQ = toggleFAQ;

// ===== SMART NAVBAR =====
function setupSmartNavbar() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Always show at top
        if (currentScrollY < 50) {
            header.classList.remove('navbar-hidden');
            header.classList.add('navbar-visible');
        }
        // Hide when scrolling down, show when scrolling up
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('navbar-hidden');
            header.classList.remove('navbar-visible');
        } else if (currentScrollY < lastScrollY) {
            header.classList.remove('navbar-hidden');
            header.classList.add('navbar-visible');
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}


window.AIAnchor = {
    scrollToContact,
    scrollToResults,
    scrollToTop,
    showAlert,
    trackEvent,
    openImageModal,
    closeImageModal,
    toggleFAQ
};


