/* ========================================
   ZAMZAM HOTEL - JavaScript Functionality
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Dynamic Current Year
    // ==========================================
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ==========================================
    // 2. Header Scroll Effect
    // ==========================================
    const header = document.getElementById('header');
    const handleScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ==========================================
    // 3. Mobile Navigation
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    const toggleNav = () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        navOverlay.classList.toggle('show');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleNav);
    navOverlay.addEventListener('click', toggleNav);

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) toggleNav();
        });
    });

    // ==========================================
    // 4. Active Navigation Highlight
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = navLinks.querySelectorAll('a:not(.nav-book-btn)');

    const highlightNav = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(a => a.classList.remove('active'));
                const activeLink = navLinks.querySelector(`a[href="#${id}"]`);
                if (activeLink && !activeLink.classList.contains('nav-book-btn')) {
                    activeLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', highlightNav);

    // ==========================================
    // 5. Smooth Scrolling
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ==========================================
    // 6. Scroll Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 7. Room Filtering
    // ==========================================
    const filterBtns = document.querySelectorAll('.room-filter-btn');
    const roomCards = document.querySelectorAll('.room-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            roomCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.5s ease both';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 8. Booking Form Validation
    // ==========================================
    const bookingForm = document.getElementById('bookingForm');
    const bookingModal = document.getElementById('bookingModal');
    const closeBookingModal = document.getElementById('closeBookingModal');

    const showError = (inputId, errorId) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        input.classList.add('error');
        error.classList.add('show');
    };

    const clearError = (inputId, errorId) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        input.classList.remove('error');
        error.classList.remove('show');
    };

    // Clear errors on input
    ['fullName', 'email', 'phone', 'roomType', 'checkIn', 'checkOut', 'guests'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => clearError(id, id + 'Error'));
            el.addEventListener('change', () => clearError(id, id + 'Error'));
        }
    });

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    if (checkInInput) checkInInput.setAttribute('min', today);
    if (checkOutInput) checkOutInput.setAttribute('min', today);

    // Auto-update checkout min when checkin changes
    checkInInput.addEventListener('change', () => {
        if (checkInInput.value) {
            const nextDay = new Date(checkInInput.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.setAttribute('min', nextDay.toISOString().split('T')[0]);
            if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
                checkOutInput.value = '';
            }
        }
    });

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate full name
        const fullName = document.getElementById('fullName').value.trim();
        if (!fullName) { showError('fullName', 'fullNameError'); isValid = false; }
        else clearError('fullName', 'fullNameError');

        // Validate email
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) { showError('email', 'emailError'); isValid = false; }
        else clearError('email', 'emailError');

        // Validate phone
        const phone = document.getElementById('phone').value.trim();
        if (!phone) { showError('phone', 'phoneError'); isValid = false; }
        else clearError('phone', 'phoneError');

        // Validate room type
        const roomType = document.getElementById('roomType').value;
        if (!roomType) { showError('roomType', 'roomTypeError'); isValid = false; }
        else clearError('roomType', 'roomTypeError');

        // Validate check-in
        const checkIn = document.getElementById('checkIn').value;
        if (!checkIn) { showError('checkIn', 'checkInError'); isValid = false; }
        else clearError('checkIn', 'checkInError');

        // Validate check-out
        const checkOut = document.getElementById('checkOut').value;
        if (!checkOut || checkOut <= checkIn) { showError('checkOut', 'checkOutError'); isValid = false; }
        else clearError('checkOut', 'checkOutError');

        // Validate guests
        const guests = document.getElementById('guests').value;
        if (!guests) { showError('guests', 'guestsError'); isValid = false; }
        else clearError('guests', 'guestsError');

        if (!isValid) return;

        // Build confirmation details
        const detailsEl = document.getElementById('bookingDetails');
        detailsEl.innerHTML = `
      <div class="detail-row"><span>Guest Name</span> <strong>${fullName}</strong></div>
      <div class="detail-row"><span>Email</span> <strong>${email}</strong></div>
      <div class="detail-row"><span>Phone</span> <strong>${phone}</strong></div>
      <div class="detail-row"><span>Room Type</span> <strong>${roomType}</strong></div>
      <div class="detail-row"><span>Check-in</span> <strong>${formatDate(checkIn)}</strong></div>
      <div class="detail-row"><span>Check-out</span> <strong>${formatDate(checkOut)}</strong></div>
      <div class="detail-row"><span>Guests</span> <strong>${guests}</strong></div>
    `;

        bookingModal.classList.add('show');
        bookingForm.reset();
    });

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    closeBookingModal.addEventListener('click', () => {
        bookingModal.classList.remove('show');
    });

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) bookingModal.classList.remove('show');
    });

    // ==========================================
    // 9. Gallery Lightbox
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentLightboxIndex = 0;

    const galleryImages = [];
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.dataset.caption || '';
        galleryImages.push({ src: img.src.replace('w=600', 'w=1200'), caption });

        item.addEventListener('click', () => {
            currentLightboxIndex = index;
            openLightbox();
        });
    });

    const openLightbox = () => {
        const { src, caption } = galleryImages[currentLightboxIndex];
        lightboxImage.src = src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox();
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        openLightbox();
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') { currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length; openLightbox(); }
        if (e.key === 'ArrowRight') { currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length; openLightbox(); }
    });

    // ==========================================
    // 10. Testimonial Slider
    // ==========================================
    const track = document.getElementById('testimonialTrack');
    const testimonialCards = track.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    let autoSlideInterval;

    // Create dots
    testimonialCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const updateDots = () => {
        dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };

    const goToSlide = (index) => {
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        goToSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + testimonialCards.length) % testimonialCards.length;
        goToSlide(currentSlide);
    };

    nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

    // Auto-slide
    const startAutoSlide = () => { autoSlideInterval = setInterval(nextSlide, 5000); };
    const resetAutoSlide = () => { clearInterval(autoSlideInterval); startAutoSlide(); };
    startAutoSlide();

    // Touch support for slider
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoSlide();
        }
    }, { passive: true });

    // ==========================================
    // 11. Back to Top Button
    // ==========================================
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('show', window.scrollY > 500);
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // 12. Contact Form (Frontend Only)
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }

        // Simple success animation
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>&nbsp; Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        btn.style.color = '#fff';
        btn.disabled = true;

        contactForm.reset();

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
        }, 3000);
    });

});
