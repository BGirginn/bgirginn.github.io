/**
 * Global Animation System - Anime.js v4
 * Portfolio site unified motion language
 * 
 * Features:
 * - Character/word split text animation
 * - Scroll-synced section reveals
 * - SVG circuit trace drawing
 * - Magnetic hover effect
 * - Accordion animations
 * - Reduced motion support
 */

// ===========================
// ANIMATION CONFIG
// ===========================
const AnimationConfig = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    durations: {
        fast: 300,
        normal: 600,
        slow: 900,
        heroEntry: 800
    },
    easings: {
        smooth: 'easeOutQuad',
        bounce: 'easeOutBack',
        snappy: 'easeOutExpo',
        elastic: 'easeOutElastic(1, .6)'
    }
};

// Update reduced motion preference on change
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    AnimationConfig.reducedMotion = e.matches;
});

// ===========================
// SCROLL OBSERVER FACTORY
// ===========================
class ScrollAnimationObserver {
    constructor(options = {}) {
        this.threshold = options.threshold || 0.15;
        this.rootMargin = options.rootMargin || '0px 0px -50px 0px';
        this.once = options.once !== false;

        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            { threshold: this.threshold, rootMargin: this.rootMargin }
        );

        this.callbacks = new Map();
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            const callback = this.callbacks.get(entry.target);
            if (entry.isIntersecting && callback) {
                callback(entry.target, entry);
                if (this.once) {
                    this.observer.unobserve(entry.target);
                    this.callbacks.delete(entry.target);
                }
            }
        });
    }

    observe(element, callback) {
        this.callbacks.set(element, callback);
        this.observer.observe(element);
    }

    disconnect() {
        this.observer.disconnect();
        this.callbacks.clear();
    }
}

const scrollObserver = new ScrollAnimationObserver();

// ===========================
// TEXT SPLIT ANIMATION
// ===========================
function splitTextToChars(element) {
    const spans = element.querySelectorAll('span');
    const allChars = [];

    spans.forEach(span => {
        const text = span.textContent;
        span.innerHTML = '';
        span.setAttribute('aria-label', text);

        text.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char === ' ' ? '\u00A0' : char;
            charSpan.className = 'char';
            charSpan.style.display = 'inline-block';
            charSpan.style.opacity = '0';
            charSpan.style.transform = 'translateY(30px)';
            span.appendChild(charSpan);
            allChars.push(charSpan);
        });
    });

    return allChars;
}

// ===========================
// HERO ENTRY ANIMATION
// ===========================
function initHeroEntry() {
    const heroContent = document.querySelector('[data-animate="hero-entry"]');
    if (!heroContent) return;

    const title = heroContent.querySelector('[data-animate-text="chars"]');
    const tagline = heroContent.querySelector('.hero-tagline');
    const subtitle = heroContent.querySelector('.hero-subtitle');
    const cta = heroContent.querySelector('.hero-cta');
    const circuitSvg = document.querySelector('.circuit-bg svg');

    // Set initial states
    if (tagline) { tagline.style.opacity = '0'; tagline.style.transform = 'translateY(20px)'; }
    if (subtitle) { subtitle.style.opacity = '0'; subtitle.style.transform = 'translateY(20px)'; }
    if (cta) {
        Array.from(cta.children).forEach(btn => {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
        });
    }

    if (AnimationConfig.reducedMotion) {
        // Instant show for reduced motion
        if (title) title.querySelectorAll('span').forEach(s => s.style.opacity = '1');
        if (tagline) { tagline.style.opacity = '1'; tagline.style.transform = 'none'; }
        if (subtitle) { subtitle.style.opacity = '1'; subtitle.style.transform = 'none'; }
        if (cta) Array.from(cta.children).forEach(btn => { btn.style.opacity = '1'; btn.style.transform = 'none'; });
        return;
    }

    // Create timeline
    const timeline = anime.timeline({
        easing: AnimationConfig.easings.smooth
    });

    // Animate circuit traces first
    if (circuitSvg) {
        const paths = circuitSvg.querySelectorAll('path');
        paths.forEach(path => {
            if (path.getTotalLength) {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
            }
        });

        timeline.add({
            targets: paths,
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 1500,
            delay: anime.stagger(30),
            easing: 'easeInOutSine'
        }, 0);
    }

    // Character split animation for title
    if (title) {
        const chars = splitTextToChars(title);

        timeline.add({
            targets: chars,
            opacity: [0, 1],
            translateY: [30, 0],
            duration: AnimationConfig.durations.heroEntry,
            delay: anime.stagger(25, { start: 200 }),
            easing: AnimationConfig.easings.snappy
        }, 200);
    }

    // Tagline
    if (tagline) {
        timeline.add({
            targets: tagline,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: AnimationConfig.durations.normal
        }, '-=400');
    }

    // Subtitle
    if (subtitle) {
        timeline.add({
            targets: subtitle,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: AnimationConfig.durations.normal
        }, '-=300');
    }

    // CTA buttons
    if (cta) {
        timeline.add({
            targets: Array.from(cta.children),
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.9, 1],
            duration: AnimationConfig.durations.normal,
            delay: anime.stagger(100),
            easing: AnimationConfig.easings.bounce
        }, '-=200');
    }

    return timeline;
}

// ===========================
// MAGNETIC HOVER - DISABLED for cleaner style
// ===========================
function initMagneticHover() {
    // Disabled - keeping interactions minimal and professional
    // Original effect moved cursor-following buttons
    return;
}

// ===========================
// SCROLL REVEAL
// ===========================
function initScrollReveal() {
    const sections = document.querySelectorAll('[data-animate="scroll-reveal"]');

    sections.forEach(section => {
        if (!AnimationConfig.reducedMotion) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(24px)';
        }

        scrollObserver.observe(section, (el) => {
            if (AnimationConfig.reducedMotion) {
                el.style.opacity = '1';
                el.style.transform = 'none';
                return;
            }

            anime({
                targets: el,
                opacity: [0, 1],
                translateY: [24, 0],
                duration: AnimationConfig.durations.normal,
                easing: AnimationConfig.easings.smooth
            });
        });
    });
}

// ===========================
// STAGGER CARDS
// ===========================
function initCardStagger() {
    const cardContainers = document.querySelectorAll('[data-animate="stagger-cards"]');

    cardContainers.forEach(container => {
        const cards = container.children;

        if (!AnimationConfig.reducedMotion) {
            Array.from(cards).forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
            });
        }

        scrollObserver.observe(container, () => {
            if (AnimationConfig.reducedMotion) {
                Array.from(cards).forEach(card => {
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                });
                return;
            }

            anime({
                targets: cards,
                opacity: [0, 1],
                translateY: [30, 0],
                delay: anime.stagger(80),
                duration: AnimationConfig.durations.normal,
                easing: AnimationConfig.easings.smooth
            });
        });
    });
}

// ===========================
// SCROLL INDICATOR
// ===========================
function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    let hasScrolled = false;

    window.addEventListener('scroll', () => {
        if (hasScrolled) return;

        if (window.scrollY > 100) {
            hasScrolled = true;

            if (AnimationConfig.reducedMotion) {
                indicator.style.opacity = '0';
            } else {
                anime({
                    targets: indicator,
                    opacity: 0,
                    translateY: 20,
                    duration: AnimationConfig.durations.fast,
                    easing: AnimationConfig.easings.smooth
                });
            }
        }
    }, { passive: true });
}

// ===========================
// SCROLL PROGRESS BAR
// ===========================
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

// ===========================
// ACCORDION
// ===========================
function initAccordions() {
    const accordions = document.querySelectorAll('.accordion-item');

    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');

        if (!header || !content) return;

        header.addEventListener('click', () => {
            const isOpen = accordion.classList.contains('open');

            // Close all others
            accordions.forEach(acc => {
                if (acc !== accordion && acc.classList.contains('open')) {
                    acc.classList.remove('open');
                    const accContent = acc.querySelector('.accordion-content');
                    anime({
                        targets: accContent,
                        height: 0,
                        opacity: 0,
                        duration: AnimationConfig.durations.normal,
                        easing: AnimationConfig.easings.smooth
                    });
                }
            });

            if (isOpen) {
                accordion.classList.remove('open');
                anime({
                    targets: content,
                    height: 0,
                    opacity: 0,
                    duration: AnimationConfig.durations.normal,
                    easing: AnimationConfig.easings.smooth
                });
            } else {
                accordion.classList.add('open');
                const fullHeight = content.scrollHeight;
                anime({
                    targets: content,
                    height: [0, fullHeight],
                    opacity: [0, 1],
                    duration: AnimationConfig.durations.normal,
                    easing: AnimationConfig.easings.smooth
                });
            }
        });
    });
}

// ===========================
// TIMELINE REVEAL (CV)
// ===========================
function initTimelineReveal() {
    const timelineItems = document.querySelectorAll('[data-animate="timeline-reveal"]');

    timelineItems.forEach((item, index) => {
        if (!AnimationConfig.reducedMotion) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
        }

        scrollObserver.observe(item, (el) => {
            if (AnimationConfig.reducedMotion) {
                el.style.opacity = '1';
                el.style.transform = 'none';
                return;
            }

            anime({
                targets: el,
                opacity: [0, 1],
                translateX: [-20, 0],
                duration: AnimationConfig.durations.fast, // Faster animation
                delay: index * 30, // Reduced delay for quicker loading
                easing: AnimationConfig.easings.smooth
            });
        });
    });
}

// ===========================
// FORM ANIMATIONS - REMOVED
// ===========================
// Contact page uses email links only, no form present.
// Form animations removed to prevent console errors.

// ===========================
// SUCCESS CHECKMARK - KEPT FOR FUTURE USE
// ===========================
function animateSuccessCheck(container) {
    const successMsg = container || document.querySelector('.success-message');
    if (!successMsg) return;

    // Create SVG checkmark
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'success-check');
    svg.setAttribute('viewBox', '0 0 52 52');
    svg.innerHTML = `
        <circle class="check-circle" cx="26" cy="26" r="25"/>
        <path class="check-path" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    `;

    successMsg.insertBefore(svg, successMsg.firstChild);
    successMsg.classList.add('show');

    if (!AnimationConfig.reducedMotion) {
        svg.classList.add('animate');
    }
}

// ===========================
// PCB EXPLODED VIEW - HANDLED BY gallery-explode.js
// ===========================
// PCB exploded view animation is now handled by GSAP in gallery-explode.js
// This removes duplicate/conflicting anime.js logic

// ===========================
// INITIALIZATION
// ===========================
function initGlobalAnimations() {
    if (typeof anime === 'undefined') {
        console.warn('Anime.js not loaded');
        return;
    }

    // Hero entry (includes circuit draw)
    initHeroEntry();

    // Interactive effects
    initMagneticHover();

    // Scroll-based animations
    initScrollReveal();
    initCardStagger();
    initScrollIndicator();
    initScrollProgress();
    initTimelineReveal();
    // PCB exploded view handled by gallery-explode.js (GSAP)

    // Accordion only (form removed - no form on contact page)
    initAccordions();

    console.log('✨ Animations initialized', AnimationConfig.reducedMotion ? '(reduced motion)' : '');
}

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalAnimations);
} else {
    initGlobalAnimations();
}

// Export
window.AnimationSystem = {
    config: AnimationConfig,
    animateSuccessCheck,
    splitTextToChars
};

