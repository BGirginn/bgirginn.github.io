/**
 * PCB Gallery Exploded View
 * Scroll-driven animation using GSAP ScrollTrigger
 * Creates a "exploded view" effect where PCB components separate on scroll
 */

(function () {
    // Check for reduced motion preference
    const REDUCE_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Find exploded view container
    const container = document.querySelector('.exploded-pcb');
    if (!container) return;

    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Get component layers
    const layers = container.querySelectorAll('.pcb-layer');
    if (layers.length === 0) return;

    // If reduced motion, show static exploded state
    if (REDUCE_MOTION) {
        layers.forEach((layer, i) => {
            const offset = (i - Math.floor(layers.length / 2)) * 30;
            layer.style.transform = `translateY(${offset}px)`;
        });
        return;
    }

    // Create GSAP timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1,
            // markers: true, // Debug
        }
    });

    // Animate each layer outward
    layers.forEach((layer, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        const offset = (i + 1) * 25;

        tl.to(layer, {
            y: offset * direction,
            opacity: 0.9,
            duration: 1,
        }, 0);
    });

    // Animate callouts appearing
    const callouts = container.querySelectorAll('.pcb-callout');
    if (callouts.length > 0) {
        callouts.forEach((callout, i) => {
            tl.fromTo(callout,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.3 },
                0.2 + i * 0.1
            );
        });
    }

    console.log('✨ PCB exploded view initialized');
})();
