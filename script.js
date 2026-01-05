// ===========================
// DEBUG MODE
// ===========================
const DEBUG = false; // Set to false for production

// ===========================
// THEME TOGGLE WITH VIEW TRANSITION API
// ===========================
function initTheme() {
    // Check system preference first
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    document.querySelectorAll('#themeIcon').forEach(icon => {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    });
}

function performThemeSwitch() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Initialize theme on load
initTheme();

// Theme toggle with circular reveal from button position
document.addEventListener('click', (event) => {
    const toggleBtn = event.target.closest('#themeToggle');
    if (!toggleBtn) return;

    // Fallback for browsers without View Transition API
    if (!document.startViewTransition) {
        performThemeSwitch();
        return;
    }

    // Get click position
    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    );

    // Start View Transition
    const transition = document.startViewTransition(() => {
        performThemeSwitch();
    });

    // Animate circular reveal from click position
    transition.ready.then(() => {
        // ARTIK TERS ÇEVİRME YOK: Her zaman küçükten büyüğe açıl
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
        ];

        document.documentElement.animate(
            {
                clipPath: clipPath,
            },
            {
                duration: 500,
                easing: 'ease-in',
                // Her zaman YENİ gelen görüntüyü animasyonla aç
                pseudoElement: '::view-transition-new(root)',
            }
        );
    });
});

// ===========================
// LANGUAGE TOGGLE
// ===========================
function translatePage(lang) {
    document.querySelectorAll('[data-en][data-tr]').forEach(el => {
        // CRITICAL: Skip hero-title to keep "Bora Girgin" unchanged
        if (el.closest('.hero-title')) {
            return;
        }

        const text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-tr');
        if (text) {
            el.textContent = text;
        }
    });
}

function toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const newLang = currentLang === 'en' ? 'tr' : 'en';

    document.documentElement.setAttribute('lang', newLang);
    localStorage.setItem('language', newLang);

    // Update all text
    translatePage(newLang);

    // Update button text on all pages
    document.querySelectorAll('#langToggle').forEach(btn => {
        btn.textContent = newLang === 'en' ? 'TR' : 'EN';
    });
}

// Initialize language
const savedLang = localStorage.getItem('language') || 'en';
document.documentElement.setAttribute('lang', savedLang);

// Translate on page load
document.addEventListener('DOMContentLoaded', () => {
    translatePage(savedLang);

    // Update button text
    document.querySelectorAll('#langToggle').forEach(btn => {
        btn.textContent = savedLang === 'en' ? 'TR' : 'EN';
    });
});

// Add event listener to all language toggles
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#langToggle').forEach(btn => {
        btn.addEventListener('click', toggleLanguage);
    });
});

// ===========================
// PARTICLE ANIMATION
// ===========================
// Utility: Debounce function
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

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;

        this.resize();
        this.init();
        this.animate();

        // Debounce resize to prevent performance issues (200ms)
        const debouncedResize = debounce(() => this.resize(), 200);
        window.addEventListener('resize', debouncedResize);
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    getParticleColor() {
        // Read particle color from CSS variable
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--particle-color').trim();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const particleColor = this.getParticleColor();

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particleColor;
            this.ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    // Extract RGB from particle color and apply opacity
                    const baseColor = particleColor.match(/\d+/g);
                    if (baseColor && baseColor.length >= 3) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        this.ctx.strokeStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${opacity})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system (with reduced motion check)
const particleCanvas = document.getElementById('particleCanvas');
const prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (particleCanvas && !prefersReducedMotion) {
    new ParticleSystem(particleCanvas);
}

// ===========================
// NAVIGATION
// ===========================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// Mobile nav toggle with scroll lock
if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Update aria-expanded for accessibility
        navToggle.setAttribute('aria-expanded', String(isActive));

        // Lock/unlock body scroll on mobile
        if (isActive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Keyboard support for nav toggle
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navToggle.click();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });

    // Close menu when clicking a link
    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
}

// ===========================
// FOOTER YEAR AUTO-UPDATE
// ===========================
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ===========================
// CV NAVIGATION SCROLL TRACKING
// ===========================
function updateCVNav() {
    const cvBlocks = document.querySelectorAll('.cv-block[id]');
    const navLinks = document.querySelectorAll('.cv-nav a');

    if (cvBlocks.length === 0 || navLinks.length === 0) return;

    let currentSection = 'summary';
    let minDistance = Infinity;

    cvBlocks.forEach(block => {
        const rect = block.getBoundingClientRect();
        const distance = Math.abs(rect.top - 120);

        if (distance < minDistance && rect.top < window.innerHeight / 2) {
            minDistance = distance;
            currentSection = block.id;
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update CV nav on scroll
if (document.querySelector('.cv-nav')) {
    window.addEventListener('scroll', updateCVNav, { passive: true });
    setTimeout(updateCVNav, 100);

    // Update on nav click
    document.querySelectorAll('.cv-nav a').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(updateCVNav, 300);
        });
    });
}

// ===========================
// SCROLL ANIMATIONS (Enhanced with Motion Tokens)
// ===========================

// Global motion preference
const REDUCE_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Initialize scroll reveal system
 * Uses CSS classes for animation to respect motion tokens
 */
function initScrollReveal() {
    // Elements that should reveal on scroll
    const revealElements = document.querySelectorAll('[data-aos], [data-reveal], .reveal');

    if (revealElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply stagger delay if in a group
                const container = entry.target.closest('[data-reveal-stagger]');
                if (container && !REDUCE_MOTION) {
                    const siblings = Array.from(container.querySelectorAll('[data-aos], [data-reveal], .reveal'));
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 60}ms`;
                }

                // Add revealed class
                entry.target.classList.add('aos-animate', 'revealed');

                // Stop observing once revealed
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        // Set initial state (CSS handles this, but ensure consistency)
        if (!REDUCE_MOTION && !el.classList.contains('aos-animate')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(var(--lift, 10px))';
        }
        revealObserver.observe(el);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initScrollReveal);

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===========================
// PAGE LOAD ANIMATION
// ===========================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===========================
// PARALLAX SCROLL EFFECT
// ===========================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, { passive: true });

// ===========================
// AUTOMATED DIAGNOSTICS
// ===========================
window.addEventListener('load', function () {
    if (!DEBUG) return; // Skip diagnostics in production

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🔧 SYSTEM DIAGNOSTICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Check 1: Ghost layer (pointer-events)
    const menu = document.querySelector('.nav-menu');
    const menuStyle = menu ? getComputedStyle(menu) : null;
    if (menuStyle) {
        const pointerEvents = menuStyle.pointerEvents;
        const isActive = menu.classList.contains('active');
        if (!isActive && pointerEvents !== 'none') {
            console.error('❌ FAIL: Menu blocking buttons (pointer-events:', pointerEvents, ')');
        } else {
            console.log('✅ PASS: Ghost layer removed (pointer-events:', pointerEvents, ')');
        }
    }

    // Check 2: Button z-index
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        console.log('✅ PASS: Theme button exists');
        const btnParent = themeBtn.parentElement;
        if (btnParent) {
            const parentZ = getComputedStyle(btnParent).zIndex;
            console.log('ℹ️  INFO: Button container z-index:', parentZ);
        }
    } else {
        console.error('❌ FAIL: Theme button not found');
    }

    // Check 3: Horizontal scroll detection
    if (document.body.scrollWidth > window.innerWidth) {
        console.warn('⚠️  WARN: Horizontal overflow detected (', document.body.scrollWidth, 'px)');
    } else {
        console.log('✅ PASS: No horizontal scroll');
    }

    // Check 4: Critical elements
    const criticalIds = ['navbar', 'themeToggle', 'langToggle'];
    criticalIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
            console.error('❌ FAIL: Missing element #' + id);
        }
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Diagnostics Complete');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// ===========================
// BACK TO TOP BUTTON
// ===========================
(function () {
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.setAttribute('title', 'Back to top');
    document.body.appendChild(backToTop);

    // Show/hide based on scroll position
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();
