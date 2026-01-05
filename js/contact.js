/**
 * Contact Form Handler
 * Handles form submission with fetch API, proper error handling,
 * and success/loading states.
 */
(function () {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    /**
     * Toggle loading state on submit button
     */
    function setLoading(isLoading) {
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;

        btn.disabled = isLoading;
        btn.setAttribute('aria-busy', String(isLoading));

        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');

        if (btnText && btnLoader) {
            btnText.style.display = isLoading ? 'none' : 'inline';
            btnLoader.style.display = isLoading ? 'inline-flex' : 'none';
        }
    }

    /**
     * Show success message with animation and auto-hide
     */
    function showSuccess() {
        if (!successMessage) return;

        // Trigger SVG animation if it exists
        const svg = successMessage.querySelector('.success-check');
        if (svg) {
            svg.classList.remove('animate');
            // Trigger reflow to restart animation
            void svg.offsetWidth;
            svg.classList.add('animate');
        }

        successMessage.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    }

    /**
     * Handle form submission
     */
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Hide any previous success message
        if (successMessage) {
            successMessage.classList.remove('show');
        }

        // Get form action URL
        const action = form.getAttribute('action') || '';

        // Check for placeholder endpoint
        if (action.includes('YOUR_FORM_ID')) {
            alert('⚠️ Formspree endpoint henüz yapılandırılmamış.\n\ncontact.html dosyasındaki YOUR_FORM_ID yerine gerçek Formspree ID\'nizi koyun.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData(form);

            const response = await fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                showSuccess();
            } else {
                const data = await response.json().catch(() => ({}));
                const errorMsg = data.error || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.';
                alert('❌ ' + errorMsg);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('❌ Ağ hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    });
})();
