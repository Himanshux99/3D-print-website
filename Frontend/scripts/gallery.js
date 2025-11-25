// ===================================
// GALLERY PAGE JAVASCRIPT
// Lightbox and image interactions
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // === LIGHTBOX/MODAL FUNCTIONALITY ===
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Open modal when clicking gallery item
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const imageSrc = this.querySelector('img').src;
            const imageAlt = this.querySelector('img').alt;

            modalImage.src = imageSrc;
            modalImage.alt = imageAlt;
            modal.classList.add('active');

            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when clicking close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the image
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';

        // Clear image after animation
        setTimeout(() => {
            modalImage.src = '';
        }, 300);
    }

    // === LAZY LOADING FOR IMAGES ===
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('.gallery-item img').forEach(img => {
        imageObserver.observe(img);
    });

    // === GALLERY ITEM HOVER EFFECT ===
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });
    });

    // === KEYBOARD NAVIGATION IN MODAL ===
    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        alt: item.querySelector('img').alt
    }));

    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            updateModalImage();
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateModalImage();
        }
    });

    function updateModalImage() {
        modalImage.style.opacity = '0';
        setTimeout(() => {
            modalImage.src = images[currentImageIndex].src;
            modalImage.alt = images[currentImageIndex].alt;
            modalImage.style.opacity = '1';
        }, 150);
    }

    // Update current index when clicking gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            currentImageIndex = index;
        });
    });

});
