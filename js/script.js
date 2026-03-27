// ===========================
// DEBUG MODE
// ===========================
const DEBUG = false; // Set to false for production

function readStoredValue(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStoredValue(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Ignore storage failures in private mode or restricted environments.
    }
}

function getThemeToggleCheckbox() {
    return document.getElementById('themeToggleCheckbox');
}

function syncThemeCheckbox(theme) {
    const checkbox = getThemeToggleCheckbox();
    if (checkbox) {
        checkbox.checked = theme === 'light';
    }
}

// ===========================
// THEME TOGGLE WITH VIEW TRANSITION API
// ===========================
function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = readStoredValue('theme');
    const theme = savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : (prefersDark ? 'dark' : 'light');

    applyTheme(theme);
}

function updateThemeIcon(theme) {
    document.querySelectorAll('#themeIcon').forEach(icon => {
        icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    writeStoredValue('theme', theme);
    syncThemeCheckbox(theme);
    updateThemeIcon(theme);
}

// Initialize theme on load
initTheme();

function handleThemeToggleChange(event) {
    const target = event.currentTarget;
    const newTheme = target.checked ? 'light' : 'dark';
    const toggleSwitch = target.closest('.toggle-switch');
    const targetElement = toggleSwitch || target;
    const rect = targetElement.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (!document.startViewTransition) {
        applyTheme(newTheme);
        return;
    }

    const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
        applyTheme(newTheme);
    });

    transition.ready.then(() => {
        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${endRadius}px at ${x}px ${y}px)`
                ],
            },
            {
                duration: 500,
                easing: 'ease-out',
                pseudoElement: '::view-transition-new(root)',
            }
        );
    }).catch(() => {
        // Ignore aborted transitions.
    });
}

const themeToggleCheckbox = getThemeToggleCheckbox();
if (themeToggleCheckbox) {
    themeToggleCheckbox.addEventListener('change', handleThemeToggleChange);
    syncThemeCheckbox(document.documentElement.getAttribute('data-theme') || 'light');
}

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
    writeStoredValue('language', newLang);

    // Update all text
    translatePage(newLang);

    // Update button text on all pages
    document.querySelectorAll('#langToggle').forEach(btn => {
        btn.textContent = newLang === 'en' ? 'TR' : 'EN';
    });
}

// Initialize language
const savedLang = readStoredValue('language') === 'tr' ? 'tr' : 'en';
document.documentElement.setAttribute('lang', savedLang);

function updateLanguageButtons(lang) {
    document.querySelectorAll('#langToggle').forEach(btn => {
        btn.textContent = lang === 'en' ? 'TR' : 'EN';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    translatePage(savedLang);
    updateLanguageButtons(savedLang);

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
        this.connectionDistanceSq = this.connectionDistance * this.connectionDistance;
        this.cachedTheme = null;
        this.cachedParticleColor = null;
        this.cachedParticleColorChannels = null;

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

    getParticleColorState() {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';

        if (this.cachedTheme !== theme) {
            this.cachedTheme = theme;
            this.cachedParticleColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--particle-color').trim();
            const channels = this.cachedParticleColor.match(/\d+/g);
            this.cachedParticleColorChannels = channels && channels.length >= 3
                ? channels.slice(0, 3)
                : null;
        }

        return {
            channels: this.cachedParticleColorChannels,
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const { channels: particleColorChannels } = this.getParticleColorState();

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
                const distanceSq = dx * dx + dy * dy;

                if (distanceSq < this.connectionDistanceSq && particleColorChannels) {
                    const distance = Math.sqrt(distanceSq);
                    const opacity = (1 - distance / this.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(${particleColorChannels[0]}, ${particleColorChannels[1]}, ${particleColorChannels[2]}, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
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
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

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
    if (cvBlocks.length === 0 || cvNavLinks.length === 0) return;

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

    cvNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

const cvBlocks = document.querySelectorAll('.cv-block[id]');
const cvNavLinks = document.querySelectorAll('.cv-nav a');
// Update CV nav on scroll
if (cvNavLinks.length > 0) {
    window.addEventListener('scroll', updateCVNav, { passive: true });
    setTimeout(updateCVNav, 100);

    // Update on nav click
    cvNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(updateCVNav, 300);
        });
    });
}

// ===========================
// SCROLL REVEAL - HANDLED BY animations.js
// ===========================
// Scroll reveal animations are now unified in js/animations.js
// This removes duplicate logic that was targeting different selectors

// ===========================
// SMOOTH SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.getElementById(href.slice(1));
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

    // Custom Loader Logic
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // Transition duration
        }, 800); // Minimal display time
    }
});

// ===========================
// PARALLAX SCROLL EFFECT
// ===========================
const parallaxElements = document.querySelectorAll('.parallax');
if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = Number(element.dataset.speed) || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, { passive: true });
}

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
    // Create back to top button (Uiverse style)
    // Create back to top button (Icon Only)
    if (document.querySelector('.back-to-top-wrapper')) {
        return;
    }

    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top-wrapper';
    backToTop.innerHTML = `
        <button class="back-to-top-btn" aria-label="Back to top">
            <svg
                width="32"
                height="32"
                stroke-width="3"
                stroke="currentColor"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 19V5M5 12l7-7 7 7"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                ></path>
            </svg>
        </button>
    `;
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
    toggleBackToTop();

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();
