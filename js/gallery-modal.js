/**
 * PCB Gallery Modal
 * Handles opening/closing modal and tab switching
 */
(function () {
    const modal = document.getElementById('pcbModal');
    if (!modal) return;

    const galleryItems = document.querySelectorAll('.gallery-item');
    const closeButtons = modal.querySelectorAll('[data-close-modal]');
    const tabs = modal.querySelectorAll('.modal-tab');
    const panels = modal.querySelectorAll('.modal-panel');
    const modalTitle = document.getElementById('modalTitle');

    // Store previously focused element for accessibility
    let previousFocus = null;

    /**
     * Open modal with board data
     */
    function openModal(boardName) {
        previousFocus = document.activeElement;

        if (modalTitle) {
            modalTitle.textContent = boardName || 'PCB Details';
        }

        modal.hidden = false;
        document.body.style.overflow = 'hidden';

        // Focus first focusable element
        const firstFocusable = modal.querySelector('button, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }

        // Add escape listener
        document.addEventListener('keydown', handleEscape);
    }

    /**
     * Close modal
     */
    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);

        // Restore focus
        if (previousFocus) {
            previousFocus.focus();
        }
    }

    /**
     * Handle escape key
     */
    function handleEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    }

    /**
     * Switch tabs
     */
    function switchTab(tabName) {
        tabs.forEach(tab => {
            const isActive = tab.dataset.tab === tabName;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        panels.forEach(panel => {
            panel.classList.toggle('active', panel.dataset.panel === tabName);
        });
    }

    // Gallery item click handlers
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('h3')?.textContent || 'PCB Details';
            openModal(title);
        });

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });

    // Close button handlers
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Tab click handlers
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Focus trap (basic)
    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const focusables = modal.querySelectorAll('button:not([hidden]), [tabindex]:not([tabindex="-1"])');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    console.log('✨ PCB Gallery modal initialized');
})();
