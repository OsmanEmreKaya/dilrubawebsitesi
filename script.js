document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // Header scroll behavior
    // ============================================
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        header.classList.toggle('scrolled', scrollY > 50);
        backToTop.classList.toggle('visible', scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // Mobile Navigation
    // ============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Mobile dropdown handling
    const dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });

    // ============================================
    // Active nav link on scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // ============================================
    // Hero Slider
    // ============================================
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    const goToSlide = (index) => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % slides.length);
    };

    const startSlider = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    const resetSlider = () => {
        clearInterval(slideInterval);
        startSlider();
    };

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
            resetSlider();
        });
    });

    if (slides.length > 1) {
        startSlider();
    }

    // ============================================
    // Animated Counters
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;

        const statsSection = document.querySelector('.story-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;
            statNumbers.forEach(num => {
                const target = parseInt(num.dataset.target);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        num.textContent = target;
                        clearInterval(counter);
                    } else {
                        num.textContent = Math.floor(current);
                    }
                }, 16);
            });
        }
    };

    window.addEventListener('scroll', animateCounters, { passive: true });

    // ============================================
    // FAQ Accordion
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ============================================
    // Gallery Lightbox (Galeri + Hizmet Alanları)
    // ============================================
    const mainGalleryItems = document.querySelectorAll('.gallery-item');
    const facilityItems = document.querySelectorAll('.facility-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentGalleryIndex = 0;
    let currentGalleryList = [];

    const buildImageList = (nodeList) =>
        Array.from(nodeList).map(item => {
            const img = item.querySelector('img');
            return { src: img.src, alt: img.alt };
        });

    const openLightbox = (list, index) => {
        currentGalleryList = buildImageList(list);
        currentGalleryIndex = index;
        lightboxImage.src = currentGalleryList[index].src;
        lightboxImage.alt = currentGalleryList[index].alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    mainGalleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(mainGalleryItems, index));
    });

    facilityItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(facilityItems, index));
    });

    // Galeri ana görselini tıklanan küçük görsel ile güncelle
    const galleryMainImage = document.getElementById('galleryMainImage');
    const galleryMainPrev = document.getElementById('galleryMainPrev');
    const galleryMainNext = document.getElementById('galleryMainNext');
    let currentMainIndex = 0;

    const updateMainImage = (index) => {
        const item = mainGalleryItems[index];
        if (!item) return;
        const img = item.querySelector('img');
        if (!img || !galleryMainImage) return;
        galleryMainImage.src = img.src;
        galleryMainImage.alt = img.alt;
        mainGalleryItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentMainIndex = index;
    };

    if (galleryMainImage && mainGalleryItems.length) {
        // Thumb click
        mainGalleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                updateMainImage(index);
            });
        });

        // Arrow buttons
        if (galleryMainPrev) {
            galleryMainPrev.addEventListener('click', () => {
                const nextIndex = (currentMainIndex - 1 + mainGalleryItems.length) % mainGalleryItems.length;
                updateMainImage(nextIndex);
            });
        }

        if (galleryMainNext) {
            galleryMainNext.addEventListener('click', () => {
                const nextIndex = (currentMainIndex + 1) % mainGalleryItems.length;
                updateMainImage(nextIndex);
            });
        }

        // Ana görsele tıklayınca lightbox aç
        galleryMainImage.addEventListener('click', () => {
            openLightbox(mainGalleryItems, currentMainIndex);
        });

        // Ensure initial state matches first item
        updateMainImage(0);
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!currentGalleryList.length) return;
        currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
        lightboxImage.src = currentGalleryList[currentGalleryIndex].src;
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!currentGalleryList.length) return;
        currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryList.length;
        lightboxImage.src = currentGalleryList[currentGalleryIndex].src;
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // ============================================
    // Scroll Animations
    // ============================================
    const animateElements = () => {
        const elements = document.querySelectorAll(
            '.badge-item, .story-image, .story-content, .mv-card, .value-item, ' +
            '.service-card, .step, .faq-item, .contact-card, .gallery-item'
        );

        elements.forEach(el => {
            if (!el.classList.contains('animate-on-scroll')) {
                el.classList.add('animate-on-scroll');
            }
        });
    };

    animateElements();

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // Form Handling
    // ============================================
    const showToast = (message) => {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    };

    const validateForm = (form) => {
        let isValid = true;
        const required = form.querySelectorAll('[required]');
        required.forEach(field => {
            field.classList.remove('error');
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            }
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    field.classList.add('error');
                    isValid = false;
                }
            }
        });
        return isValid;
    };

    // Remove error state on input
    document.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', () => field.classList.remove('error'));
    });

    const admissionForm = document.getElementById('admissionForm');
    if (admissionForm) {
        admissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(admissionForm)) {
                showToast('Önkabul başvurunuz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.');
                admissionForm.reset();
            }
        });
    }

    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(jobForm)) {
                showToast('İş başvurunuz başarıyla alınmıştır. Değerlendirme sonucunda sizinle iletişime geçeceğiz.');
                jobForm.reset();
            }
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(contactForm)) {
                showToast('Mesajınız başarıyla gönderilmiştir. Teşekkür ederiz!');
                contactForm.reset();
            }
        });
    }

    // ============================================
    // Smooth scroll for anchor links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = header.offsetHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

});
