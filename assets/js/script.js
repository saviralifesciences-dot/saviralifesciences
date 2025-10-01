/* Path: assets/js/script.js */

document.addEventListener('DOMContentLoaded', () => {
    
    // ===========================================
    // MAKE.COM WEBHOOK CONFIGURATION
    // ⚠️ IMPORTANT: REPLACE THIS PLACEHOLDER URL 
    // WITH YOUR ACTUAL MAKE.COM WEBHOOK ADDRESS
    // ===========================================
    const MAKE_COM_WEBHOOK_URL = 'https://hook.eu2.make.com/hi692dbcro02tdqp4p23m9lgdp8x1giw'; // PASTE YOUR URL HERE

    // -------------------------------------------
    // 1. Mobile Menu Functionality
    // -------------------------------------------
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    menuButton.addEventListener('click', () => {
        // Toggle 'hidden' class for visibility
        mobileMenu.classList.toggle('hidden');
        // Toggle transform classes for slide effect (Tailwind utility classes)
        mobileMenu.classList.toggle('-translate-y-2');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.add('-translate-y-2');
            }
        });
    });

    // -------------------------------------------
    // 2. Contact Form Submission (Make.com Integration)
    // -------------------------------------------
    const contactForm = document.getElementById('contact-form-main');
    const customModal = document.getElementById('custom-modal');
    const modalCloseButton = document.getElementById('modal-close-button');
    const submitButton = document.getElementById('submit-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    const formError = document.getElementById('form-error');

    // Helper functions for modal visibility
    const showModal = () => {
        customModal.classList.remove('opacity-0', 'pointer-events-none');
        customModal.querySelector('div').classList.remove('scale-90');
    };

    const closeModal = () => {
        customModal.classList.add('opacity-0', 'pointer-events-none');
        customModal.querySelector('div').classList.add('scale-90');
    };

    // Form submission handler
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.classList.add('hidden');

        // 1. Prepare UI for submission
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        loadingSpinner.classList.remove('hidden');

        // 2. Collect form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        try {
            // 3. Send data to Make.com Webhook
            const response = await fetch(MAKE_COM_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // 4. Handle response
            if (response.ok) {
                showModal(); 
                contactForm.reset();
            } else {
                // Handle non-OK status codes (e.g., 400, 500)
                formError.classList.remove('hidden');
            }
        } catch (error) {
            // Handle network errors
            console.error('Error submitting form:', error);
            formError.classList.remove('hidden');
        } finally {
            // 5. Reset UI
            submitButton.disabled = false;
            submitButton.textContent = 'Send Professional Inquiry';
            loadingSpinner.classList.add('hidden');
        }
    });

    // Close modal handlers
    modalCloseButton.addEventListener('click', closeModal);
    customModal.addEventListener('click', (e) => {
        if (e.target === customModal) {
            closeModal();
        }
    });


    // -------------------------------------------
    // 3. Product Modal Functionality 
    // -------------------------------------------
    const productModal = document.getElementById('product-modal');
    const productModalTitle = document.getElementById('product-modal-title');
    const productModalMessage = document.getElementById('product-modal-message');
    const productModalCloseButton = document.getElementById('product-modal-close-button');

    window.showProductModal = (title, message) => {
        productModalTitle.textContent = title;
        productModalMessage.innerHTML = message;

        productModal.classList.remove('opacity-0', 'pointer-events-none');
        productModal.querySelector('div').classList.remove('scale-90');
    };

    const closeProductModal = () => {
        productModal.classList.add('opacity-0', 'pointer-events-none');
        productModal.querySelector('div').classList.add('scale-90');
    };

    productModalCloseButton.addEventListener('click', closeProductModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });

    // -------------------------------------------
    // 4. Scroll Reveal Animations (Intersection Observer)
    // -------------------------------------------
    
    // Main observer for standard fade-up (scroll-reveal class)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing standard elements once they are visible
                if (!entry.target.matches('[class^="custom-reveal-"]')) {
                     observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.15 
    });

    // Target all elements with the 'scroll-reveal' class
    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });
    
    // Target and observe the first element of the sequential group
    const sequentialObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When the container of the sequential elements is visible, start the sequence
                
                // Get all four elements in the sequence
                const elements = [
                    document.querySelector('.custom-reveal-1'),
                    document.querySelector('.custom-reveal-2'),
                    document.querySelector('.custom-reveal-3'),
                    document.querySelector('.custom-reveal-4')
                ].filter(el => el); // Filter out nulls just in case

                // Apply 'visible' class sequentially with a delay
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 200); // 200ms delay between each card
                });

                // Stop observing the container once the animation is triggered
                obs.unobserve(entry.target);
            }
        });
    }, {
        // Adjust threshold lower for the sequential animation to start early
        threshold: 0.1 
    });

    // We observe the parent element of the 4 cards to trigger the sequence
    const nutrientSection = document.querySelector('#nutrivira .lg\\:w-1\\/2:nth-child(2)');
    if (nutrientSection) {
        sequentialObserver.observe(nutrientSection);
    }


    // Handle immediate animations in the Hero section
    document.querySelectorAll('.animate-fade-in-up').forEach(el => {
        el.style.opacity = 1;
    });

    // The 'Life Sciences' word uses CSS keyframes and doesn't need JS to trigger.
});