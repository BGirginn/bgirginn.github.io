/**
 * Projects Filter System
 * Tag-based filtering with animated transitions
 */

(function () {
    const REDUCE_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Find filter container and project items
    const filterContainer = document.getElementById('projectFilters');
    const projectItems = document.querySelectorAll('.accordion-item[data-tags]');

    if (!filterContainer || projectItems.length === 0) return;

    // Collect unique tags from all projects
    const allTags = new Set();
    projectItems.forEach(item => {
        const tags = item.dataset.tags?.split(',').map(t => t.trim().toLowerCase()) || [];
        tags.forEach(tag => allTags.add(tag));
    });

    // Current active filter
    let activeFilter = 'all';

    /**
     * Create filter chips UI
     */
    function createFilterChips() {
        // Create "All" chip
        const allChip = createChip('all', 'All', true);
        filterContainer.appendChild(allChip);

        // Create tag chips
        allTags.forEach(tag => {
            const chip = createChip(tag, formatTagLabel(tag), false);
            filterContainer.appendChild(chip);
        });
    }

    /**
     * Create a single filter chip button
     */
    function createChip(value, label, isActive) {
        const chip = document.createElement('button');
        chip.className = `filter-chip${isActive ? ' active' : ''}`;
        chip.textContent = label;
        chip.dataset.filter = value;
        chip.type = 'button';
        chip.setAttribute('aria-pressed', isActive);

        chip.addEventListener('click', () => {
            if (activeFilter === value) return;

            // Update active states
            filterContainer.querySelectorAll('.filter-chip').forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-pressed', 'false');
            });
            chip.classList.add('active');
            chip.setAttribute('aria-pressed', 'true');

            activeFilter = value;
            filterProjects(value);
        });

        return chip;
    }

    /**
     * Format tag label for display
     */
    function formatTagLabel(tag) {
        const labels = {
            'lora': 'LoRa',
            'esp32': 'ESP32',
            'stm32': 'STM32',
            'pcb': 'PCB',
            'firmware': 'Firmware',
            'raspberry pi': 'Raspberry Pi',
            'c++': 'C++',
            'python': 'Python',
            'iot': 'IoT',
            'industrial iot': 'Industrial IoT'
        };
        return labels[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
    }

    /**
     * Filter projects with animation
     */
    function filterProjects(filter) {
        projectItems.forEach((item, index) => {
            const tags = item.dataset.tags?.split(',').map(t => t.trim().toLowerCase()) || [];
            const shouldShow = filter === 'all' || tags.includes(filter);

            if (REDUCE_MOTION) {
                // Instant show/hide for reduced motion
                item.style.display = shouldShow ? '' : 'none';
            } else {
                // Animated transition
                if (shouldShow) {
                    item.style.display = '';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px) scale(0.98)';

                    // Stagger the reveal
                    setTimeout(() => {
                        item.style.transition = 'opacity var(--dur-3) var(--ease-out), transform var(--dur-3) var(--ease-out)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, index * 50);
                } else {
                    item.style.transition = 'opacity var(--dur-2) var(--ease-out), transform var(--dur-2) var(--ease-out)';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-10px) scale(0.98)';

                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 180); // Match --dur-2
                }
            }
        });
    }

    /**
     * Initialize accordion expand/collapse
     */
    function initAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            if (!header || !content) return;

            // Set initial aria attributes
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('tabindex', '0');

            // Click handler
            header.addEventListener('click', () => toggleAccordion(item, content, header));

            // Keyboard handler
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAccordion(item, content, header);
                }
            });
        });
    }

    /**
     * Toggle accordion item
     */
    function toggleAccordion(item, content, header) {
        const isOpen = item.classList.contains('open');

        if (isOpen) {
            // Close
            if (REDUCE_MOTION) {
                content.style.height = '0';
                content.style.opacity = '0';
            } else {
                content.style.height = content.scrollHeight + 'px';
                content.offsetHeight; // Force reflow
                content.style.transition = 'height var(--dur-3) var(--ease-out), opacity var(--dur-3) var(--ease-out)';
                content.style.height = '0';
                content.style.opacity = '0';
            }
            item.classList.remove('open');
            header.setAttribute('aria-expanded', 'false');
        } else {
            // Open
            item.classList.add('open');
            header.setAttribute('aria-expanded', 'true');

            if (REDUCE_MOTION) {
                content.style.height = 'auto';
                content.style.opacity = '1';
            } else {
                content.style.transition = 'height var(--dur-3) var(--ease-out), opacity var(--dur-3) var(--ease-out)';
                content.style.height = content.scrollHeight + 'px';
                content.style.opacity = '1';

                // Remove fixed height after animation
                setTimeout(() => {
                    if (item.classList.contains('open')) {
                        content.style.height = 'auto';
                    }
                }, 260);
            }
        }
    }

    // Initialize
    createFilterChips();
    initAccordion();
})();

