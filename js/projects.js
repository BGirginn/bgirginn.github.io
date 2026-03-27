/**
 * Projects Filter System
 * Tag-based filtering with animated transitions
 */

(function () {
    const REDUCE_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const filterContainer = document.getElementById('projectFilters');
    const accordionItems = document.querySelectorAll('.accordion-item');
    const projectItems = document.querySelectorAll('.accordion-item[data-tags]');

    if (accordionItems.length === 0) return;

    const tagsByItem = new WeakMap();
    const transitionTimers = new WeakMap();
    const allTags = new Set();

    function getItemTags(item) {
        if (!tagsByItem.has(item)) {
            const tags = item.dataset.tags?.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) || [];
            tagsByItem.set(item, tags);
        }

        return tagsByItem.get(item);
    }

    projectItems.forEach(item => {
        getItemTags(item).forEach(tag => allTags.add(tag));
    });

    let activeFilter = 'all';

    function clearTransitionTimer(item) {
        const timerId = transitionTimers.get(item);
        if (timerId) {
            clearTimeout(timerId);
            transitionTimers.delete(item);
        }
    }

    /**
     * Create filter chips UI
     */
    function createFilterChips() {
        if (!filterContainer || allTags.size === 0) return;

        const allChip = createChip('all', 'All', true);
        filterContainer.appendChild(allChip);

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
        chip.setAttribute('aria-pressed', String(isActive));

        chip.addEventListener('click', () => {
            if (activeFilter === value) return;

            if (filterContainer) {
                filterContainer.querySelectorAll('.filter-chip').forEach(c => {
                    c.classList.remove('active');
                    c.setAttribute('aria-pressed', 'false');
                });
                chip.classList.add('active');
                chip.setAttribute('aria-pressed', 'true');
            }

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
            clearTransitionTimer(item);

            const tags = getItemTags(item);
            const shouldShow = filter === 'all' || tags.includes(filter);

            if (REDUCE_MOTION) {
                item.style.display = shouldShow ? '' : 'none';
                item.style.opacity = shouldShow ? '1' : '';
                item.style.transform = shouldShow ? 'none' : '';
                return;
            }

            if (shouldShow) {
                item.style.display = '';
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px) scale(0.98)';

                const timerId = window.setTimeout(() => {
                    item.style.transition = 'opacity var(--dur-3) var(--ease-out), transform var(--dur-3) var(--ease-out)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                    transitionTimers.delete(item);
                }, index * 50);

                transitionTimers.set(item, timerId);
            } else {
                item.style.transition = 'opacity var(--dur-2) var(--ease-out), transform var(--dur-2) var(--ease-out)';
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px) scale(0.98)';

                const timerId = window.setTimeout(() => {
                    if (item.style.opacity === '0') {
                        item.style.display = 'none';
                    }
                    transitionTimers.delete(item);
                }, 180);

                transitionTimers.set(item, timerId);
            }
        });
    }

    /**
     * Initialize accordion expand/collapse
     */
    function initAccordion() {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            if (!header || !content) return;

            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('tabindex', '0');

            header.addEventListener('click', () => toggleAccordion(item, content, header));

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
            item.classList.add('open');
            header.setAttribute('aria-expanded', 'true');

            if (REDUCE_MOTION) {
                content.style.height = 'auto';
                content.style.opacity = '1';
            } else {
                content.style.transition = 'height var(--dur-3) var(--ease-out), opacity var(--dur-3) var(--ease-out)';
                content.style.height = content.scrollHeight + 'px';
                content.style.opacity = '1';

                window.setTimeout(() => {
                    if (item.classList.contains('open')) {
                        content.style.height = 'auto';
                    }
                }, 260);
            }
        }
    }

    if (filterContainer && projectItems.length > 0) {
        createFilterChips();
    }

    initAccordion();
})();
