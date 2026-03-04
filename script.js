/**
 * Mangalam HDPE Pipes – Main Interaction Script
 * -----------------------------------------------
 * Purpose : Handles all client-side interactivity for the landing page.
 * Sections :
 *   1. Sticky Header  – Shows a fixed header after the user scrolls past 150px.
 *   2. Image Carousel – Slide-based image gallery with prev/next navigation and thumbnail sync.
 *   3. FAQ Accordion  – Toggles open/close state of FAQ items.
 *   4. Resize Handler – Re-syncs carousel position on window resize.
 *
 * Tech     : Vanilla JavaScript (ES6+), no external libraries.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STICKY HEADER
    // Shows the fixed sticky header once the user
    // scrolls more than 150px from the top of the page.
    // The class 'visible' triggers a CSS transition (opacity + translateY).
    // ==========================================
    const stickyHeader = document.getElementById('stickyHeader');

    const handleScroll = () => {
        if (window.scrollY > 150) {
            stickyHeader.classList.add('visible');
        } else {
            stickyHeader.classList.remove('visible');
        }
    };

    // 'passive: true' improves scroll performance by telling the browser
    // this listener will not call preventDefault().
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on load in case the page is pre-scrolled


    // ==========================================
    // 2. IMAGE CAROUSEL
    // A CSS-transform-based slider. The track element
    // is shifted left by (currentIndex * 100%) to reveal
    // the correct slide. Each slide is exactly 100% wide.
    // Thumbnails stay in sync by highlighting the active one.
    // ==========================================
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const items = Array.from(track.children); // All carousel-item elements
    const thumbs = Array.from(document.querySelectorAll('.thumb'));

    let currentIndex = 0;
    const maxIndex = items.length - 1; // Zero-based last-slide index

    // Thumbnail preview images – mirrors the carousel slide image sources
    const imageUrls = [
        'product-hdpe-pipe-hero.jpg',   // Slide 1 – hero product shot
        'product-hdpe-coil-close.jpg',   // Slide 2 – coil close-up
        'product-hdpe-pipe-hero.jpg',   // Slide 3 – hero repeat
        'product-hdpe-coil-close.jpg',   // Slide 4 – coil repeat
        'product-hdpe-pipe-hero.jpg',   // Slide 5 – hero repeat
    ];

    // Apply background images to each thumbnail and attach click handlers
    thumbs.forEach((thumb, index) => {
        if (imageUrls[index]) {
            thumb.style.backgroundImage = `url(${imageUrls[index]})`;
            thumb.style.backgroundSize = 'cover';
            thumb.style.backgroundPosition = 'center';
        }

        // Clicking a thumbnail jumps directly to that slide
        thumb.addEventListener('click', () => {
            currentIndex = Math.min(index, maxIndex);
            updateCarousel();
        });
    });

    /**
     * updateThumbs()
     * Adds the 'active' CSS class only to the thumbnail
     * that matches the current slide index.
     */
    const updateThumbs = () => {
        thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentIndex);
        });
    };

    /**
     * updateCarousel()
     * Core render function – called whenever the slide changes.
     * 1. Translates the track so the correct slide is visible.
     * 2. Updates active thumbnail highlight.
     * 3. Disables prev/next buttons at the boundaries.
     */
    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateThumbs();
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
    };

    // Previous slide button
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    // Next slide button
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });


    // ==========================================
    // 3. FAQ ACCORDION
    // Each .faq-item gets a click listener on its question.
    // Clicking toggles the 'open' class which CSS uses to
    // show/hide the .faq-answer panel with display:block/none.
    // Only one item can be open at a time (single-open accordion).
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Close all items before re-opening the clicked one
            faqItems.forEach(i => i.classList.remove('open'));
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });


    // ==========================================
    // 4. RESIZE HANDLER
    // Recalculates carousel transform on window resize
    // to prevent layout drift (e.g. when orientation changes).
    // Uses a 150ms debounce to avoid firing on every pixel change.
    // ==========================================
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCarousel();
        }, 150);
    });


    // --- Initial render call ---
    updateCarousel();
});
