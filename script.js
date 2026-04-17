// ============================================
// URBEQ - Interactive Features
// ============================================

// ============================================
// 1. Mobile Menu Toggle
// ============================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.btn-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

// ============================================
// 2. Global Mobile Nav + Logo Normalization
// ============================================
function initGlobalNavAndLogos() {
    const iconByPath = [
        { match: 'index.html', icon: 'home' },
        { match: 'proyectos.html', icon: 'domain' },
        { match: 'nosotros.html', icon: 'groups' },
        { match: 'educacion.html', icon: 'school' },
        { match: 'cotizacion.html', icon: 'request_quote' }
    ];

    // Ensure all nav links have icon + label spans for mobile app-like view.
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.querySelector('.nav-icon')) return;

        const href = (link.getAttribute('href') || '').toLowerCase();
        const linkText = (link.textContent || '').trim();
        const iconEntry = iconByPath.find(entry => href.includes(entry.match));
        const iconName = iconEntry ? iconEntry.icon : 'apps';

        link.textContent = '';

        const icon = document.createElement('span');
        icon.className = 'material-symbols-outlined nav-icon';
        icon.textContent = iconName;

        const label = document.createElement('span');
        label.className = 'nav-label';
        label.textContent = linkText;

        link.appendChild(icon);
        link.appendChild(label);
    });

    function ensureLogoSet(anchorSelector, classPrefix) {
        const anchor = document.querySelector(anchorSelector);
        if (!anchor) return;

        const isFooterLogo = classPrefix === 'footer-logo';
        const logoDefaultSrc = isFooterLogo ? 'img/LOGO BLANCO NARANJA.png' : 'img/PNG NARANJA Y GRIS.png';
        const logoDarkSrc = 'img/LOGO BLANCO NARANJA.png';
        const logoMobileSrc = isFooterLogo ? 'img/LOGO BLANCO NARANJA.png' : 'img/ISOTIPO NARANJA.png';

        let logoDefault = anchor.querySelector(`.${classPrefix}-default`);
        let logoDark = anchor.querySelector(`.${classPrefix}-dark`);
        let logoMobile = anchor.querySelector(`.${classPrefix}-mobile`);

        if (!logoDefault || !logoDark || !logoMobile) {
            anchor.innerHTML = '';

            logoDefault = document.createElement('img');
            logoDefault.className = `${classPrefix}-default`;
            logoDefault.alt = 'URBEQ';
            logoDefault.src = logoDefaultSrc;
            logoDefault.style.display = 'block';

            logoDark = document.createElement('img');
            logoDark.className = `${classPrefix}-dark`;
            logoDark.alt = 'URBEQ';
            logoDark.src = logoDarkSrc;
            logoDark.style.display = 'none';

            logoMobile = document.createElement('img');
            logoMobile.className = `${classPrefix}-mobile`;
            logoMobile.alt = 'URBEQ';
            logoMobile.src = logoMobileSrc;
            logoMobile.style.display = 'none';

            anchor.appendChild(logoDefault);
            anchor.appendChild(logoDark);
            anchor.appendChild(logoMobile);
        } else {
            logoDefault.src = logoDefaultSrc;
            logoDark.src = logoDarkSrc;
            logoMobile.src = logoMobileSrc;
        }
    }

    ensureLogoSet('.logo a', 'logo');
    ensureLogoSet('.footer-logo a', 'footer-logo');

    // Mark mobile header/nav as ready to prevent flash of legacy markup.
    document.body.classList.add('mobile-nav-ready');
}

// ============================================
// 3. Theme Toggle (Light/Dark)
// ============================================
function initThemeToggle() {
    const whatsappBtn = document.querySelector('.floating-btn');
    if (!whatsappBtn) return;

    let themeBtn = document.querySelector('.floating-theme-btn');

    if (!themeBtn) {
        themeBtn = document.createElement('button');
        themeBtn.type = 'button';
        themeBtn.className = 'floating-theme-btn';
        themeBtn.setAttribute('aria-label', 'Debug: alternar tema');
        themeBtn.setAttribute('title', 'Debug: alternar tema');
        themeBtn.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
        whatsappBtn.insertAdjacentElement('afterend', themeBtn);
    }

    const root = document.documentElement;
    const icon = themeBtn.querySelector('.material-symbols-outlined');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        themeBtn.setAttribute('aria-pressed', String(theme === 'light'));

        if (icon) {
            icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
        }

        // Update logo based on theme and device
        updateLogo(theme);

        // Dispatch theme change event
        window.dispatchEvent(new Event('themechange'));
        window.dispatchEvent(new Event('scroll'));
    }

    // Function to update logo based on theme and device
    function updateLogo(theme) {
        // Header logos
        const logoDefault = document.querySelector('.logo-default');
        const logoDark = document.querySelector('.logo-dark');
        const logoMobile = document.querySelector('.logo-mobile');
        
        // Footer logos
        const footerLogoDefault = document.querySelector('.footer-logo-default');
        const footerLogoDark = document.querySelector('.footer-logo-dark');
        const footerLogoMobile = document.querySelector('.footer-logo-mobile');
        
        // Check if mobile device
        const isMobile = window.innerWidth <= 767;
        
        // Hide all logos first
        if (logoDefault) logoDefault.style.display = 'none';
        if (logoDark) logoDark.style.display = 'none';
        if (logoMobile) logoMobile.style.display = 'none';
        
        if (footerLogoDefault) footerLogoDefault.style.display = 'none';
        if (footerLogoDark) footerLogoDark.style.display = 'none';
        if (footerLogoMobile) footerLogoMobile.style.display = 'none';
        
        // Show appropriate logos
        if (isMobile) {
            // Mobile: always use vertical logo
            if (logoMobile) logoMobile.style.display = 'block';
            if (footerLogoMobile) footerLogoMobile.style.display = 'block';
        } else {
            // Desktop: use theme-based logo
            if (theme === 'dark') {
                if (logoDark) logoDark.style.display = 'block';
                if (footerLogoDark) footerLogoDark.style.display = 'block';
            } else {
                if (logoDefault) logoDefault.style.display = 'block';
                if (footerLogoDefault) footerLogoDefault.style.display = 'block';
            }
        }
    }

    // Default theme: light on load
    applyTheme('light');

    themeBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
    });

    // Update logo on window resize
    window.addEventListener('resize', () => {
        const currentTheme = root.getAttribute('data-theme') || 'dark';
        updateLogo(currentTheme);
    });
}

// ============================================
// 3. Smooth Scroll for Navigation Links
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ============================================
// 5. Testimonials Carousel (CSS-only marquee)
// ============================================
// The testimonials carousel is now handled purely via CSS animation
// (@keyframes marquee-scroll). No JavaScript is needed.
function initTestimonialsCarousel() {
    // CSS-only — nothing to do here
}

// ============================================
// 5. Form Validation
// ============================================
function initFormValidation() {
    const form = document.querySelector('.contact-form form');

    if (!form) return;

    const inputs = {
        name: form.querySelector('input[type="text"]:first-of-type'),
        dni: form.querySelectorAll('input[type="text"]')[1],
        email: form.querySelector('input[type="email"]'),
        phone: form.querySelector('input[type="tel"]'),
        project: form.querySelector('select')
    };

    // Validation rules
    const validators = {
        name: (value) => {
            if (!value || value.trim().length < 3) {
                return 'El nombre debe tener al menos 3 caracteres';
            }
            return null;
        },
        dni: (value) => {
            const dniPattern = /^\d{8}$/;
            if (!dniPattern.test(value)) {
                return 'DNI debe tener 8 dígitos';
            }
            return null;
        },
        email: (value) => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                return 'Correo electrónico inválido';
            }
            return null;
        },
        phone: (value) => {
            const phonePattern = /^(\+51)?\s?\d{9}$/;
            if (!phonePattern.test(value.replace(/\s/g, ''))) {
                return 'Teléfono debe tener 9 dígitos';
            }
            return null;
        }
    };

    // Show error message
    function showError(input, message) {
        // Remove existing error
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (message) {
            input.style.borderBottom = '2px solid #ba1a1a';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ba1a1a';
            errorDiv.style.fontSize = '0.75rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = message;
            input.parentElement.appendChild(errorDiv);
        } else {
            input.style.borderBottom = '2px solid #16a34a';
        }
    }

    // Validate field
    function validateField(fieldName, value) {
        const validator = validators[fieldName];
        if (validator) {
            const error = validator(value);
            showError(inputs[fieldName], error);
            return error === null;
        }
        return true;
    }

    // Add blur validation
    Object.keys(inputs).forEach(fieldName => {
        const input = inputs[fieldName];
        if (input && validators[fieldName]) {
            input.addEventListener('blur', () => {
                validateField(fieldName, input.value);
            });

            input.addEventListener('input', () => {
                if (input.style.borderBottom) {
                    validateField(fieldName, input.value);
                }
            });
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Validate all fields
        Object.keys(inputs).forEach(fieldName => {
            const input = inputs[fieldName];
            if (input && validators[fieldName]) {
                const valid = validateField(fieldName, input.value);
                if (!valid) isValid = false;
            }
        });

        if (isValid) {
            // Show success message
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '✓ Solicitud Enviada';
            submitBtn.style.background = '#16a34a';

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                form.reset();

                // Clear validation styles
                Object.values(inputs).forEach(input => {
                    if (input) {
                        input.style.borderBottom = '';
                        const error = input.parentElement.querySelector('.error-message');
                        if (error) error.remove();
                    }
                });
            }, 3000);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ============================================
// 6. Scroll Animations (Intersection Observer)
// ============================================
function initScrollAnimations() {
    // Select animated elements from ALL pages
    const animatedElements = document.querySelectorAll(
        '.project-card, .testimonial-card, .education-card, .feature, ' +
        '.why-us-image, .why-us-content, .stats-card, .stat-item, ' +
        '.pf-card, .pricing-card, .gallery-main, .gallery-thumbs, ' +
        '.calc-form, .calc-summary, .article-body h2, .article-body .article-tip, ' +
        '.section-header, .education-header, .footer-grid, ' +
        '.animate-on-scroll'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((element, index) => {
        // Delay is set via CSS variables for cleaner markup
        element.style.setProperty('--anim-delay', `${(index % 4) * 0.1}s`);
        observer.observe(element);
    });

    // Hero entrance animation
    const hero = document.querySelector('.project-detail-hero, .article-hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transition = 'opacity 0.8s ease';
        requestAnimationFrame(() => {
            hero.style.opacity = '1';
        });
    }
}

// ============================================
// 7. Project Filters
// ============================================
function initProjectFilters() {
    const projectsSection = document.querySelector('.featured-projects');
    if (!projectsSection) return;

    // Create filter buttons
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    `;

    const filters = [
        { label: 'Todos', value: 'all' },
        { label: 'Pimentel', value: 'pimentel' },
        { label: 'Reque', value: 'reque' }
    ];

    filters.forEach(filter => {
        const btn = document.createElement('button');
        btn.textContent = filter.label;
        btn.className = 'filter-btn';
        btn.dataset.filter = filter.value;
        btn.style.cssText = `
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            border: 2px solid rgba(242, 106, 27, 0.32);
            background: ${filter.value === 'all' ? 'var(--primary)' : 'transparent'};
            color: ${filter.value === 'all' ? 'var(--on-primary)' : 'var(--primary)'};
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
        `;

        btn.addEventListener('click', () => {
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.style.background = 'transparent';
                b.style.color = 'var(--primary)';
            });
            btn.style.background = 'var(--primary)';
            btn.style.color = 'var(--on-primary)';

            // Filter projects
            filterProjects(filter.value);
        });

        filterContainer.appendChild(btn);
    });

    const projectsGrid = projectsSection.querySelector('.projects-grid');
    projectsSection.insertBefore(filterContainer, projectsGrid);

    // Add data attributes to project cards
    const projectCards = projectsGrid.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        const location = card.querySelector('.project-location').textContent.toLowerCase();
        if (location.includes('pimentel')) {
            card.dataset.location = 'pimentel';
        } else if (location.includes('reque')) {
            card.dataset.location = 'reque';
        } else if (location.includes('lambayeque')) {
            card.dataset.location = 'lambayeque';
        }
    });

    function filterProjects(filterValue) {
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.dataset.location === filterValue) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// 7. Floating WhatsApp Button with Tooltip
// ============================================
function initFloatingButton() {
    const floatingBtn = document.querySelector('.floating-btn');

    if (floatingBtn) {
        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.textContent = '¿Necesitas ayuda? Chatea con nosotros';
        tooltip.style.cssText = `
            position: absolute;
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            background: var(--on-surface);
            color: var(--surface);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            white-space: nowrap;
            margin-right: 1rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        `;

        floatingBtn.appendChild(tooltip);

        floatingBtn.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });

        floatingBtn.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        // Update href for WhatsApp
        floatingBtn.href = 'https://wa.me/51987654321?text=Hola%20URBEQ,%20quiero%20información%20sobre%20lotes%20y%20casas';
        floatingBtn.target = '_blank';
    }
}

// ============================================
// 9. Search Bar Functionality
// ============================================
function initSearchBar() {
    const searchBtn = document.querySelector('.btn-search');
    const searchQueryInput = document.getElementById('searchQuery');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const location = document.querySelector('.search-field select').value;
            const queryValue = searchQueryInput && searchQueryInput.value.trim()
                ? searchQueryInput.value.trim()
                : 'Sin término específico';

            // Scroll to projects section
            const projectsSection = document.querySelector('.featured-projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }

            // Show notification
            showNotification(`Ubicación: ${location} | Búsqueda: ${queryValue}`);
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: var(--primary);
        color: var(--on-primary);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-popular);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// ============================================
// 10. Sticky Navigation Background
// ============================================
function initStickyNav() {
    const nav = document.querySelector('.top-nav');
    if (!nav) return;

    function updateNavStyle() {
        const rootStyles = getComputedStyle(document.documentElement);
        const navSurface = rootStyles.getPropertyValue('--nav-surface').trim() || '#1C1C1C';
        const navShadowRest = rootStyles.getPropertyValue('--nav-shadow-rest').trim() || '0 4px 20px -10px rgba(242, 106, 27, 0.22)';
        const navShadowScrolled = rootStyles.getPropertyValue('--nav-shadow-scrolled').trim() || '0 4px 20px -5px rgba(242, 106, 27, 0.35)';

        nav.style.backgroundColor = navSurface;
        nav.style.boxShadow = window.scrollY > 50 ? navShadowScrolled : navShadowRest;
    }

    window.addEventListener('scroll', updateNavStyle);
    // Also update when theme changes
    window.addEventListener('themechange', updateNavStyle);
    updateNavStyle();
}

// ============================================
// 10. Project Image Hover Slideshow
// ============================================
function initProjectImageHover() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const img = card.querySelector('.project-image img');
        if (!img) return;

        const src = img.getAttribute('src') || img.src;
        if (!src) return;

        // Detección más flexible: cualquier cosa que termine en _numero.extension (ej. Palma_real_1.webp)
        const match = src.match(/(.*_)(\d+)(\.\w+)$/i);
        if (!match) {
            console.log("Mini-Galería: Formato no compatible en", src);
            return;
        }

        const basePath = match[1]; // ruta base hasta el guión bajo
        const suffix = match[3];   // extensión
        
        // Determinar maxImages sin importar mayúsculas
        let maxImages = 1;
        if (basePath.toLowerCase().includes('palma_real')) maxImages = 5;
        if (basePath.toLowerCase().includes('requemar')) maxImages = 4;
        
        if (maxImages <= 1) return;

        let currentIndex = 1;
        let intervalId;

        // Precargar siguientes imágenes
        for(let i = 2; i <= maxImages; i++) {
            const preload = new Image();
            preload.src = `${basePath}${i}${suffix}`;
        }

        card.addEventListener('mouseenter', () => {
            // Empezar a ciclar las imágenes de 1 en 1
            intervalId = setInterval(() => {
                currentIndex++;
                if (currentIndex > maxImages) {
                    currentIndex = 1;
                }
                img.src = `${basePath}${currentIndex}${suffix}`;
            }, 800);
        });

        card.addEventListener('mouseleave', () => {
             // Reset al quitar el mouse
            clearInterval(intervalId);
            currentIndex = 1;
            img.src = `${basePath}1${suffix}`;
        });
    });
}

// ============================================
// 11. Project Card Full Click Navigation
// ============================================
function initProjectImageLinks() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // Encontrar el enlace dentro de la tarjeta (sea la imagen o el botón)
        const link = card.querySelector('a');
        if (!link) return;

        const targetHref = link.getAttribute('href');
        
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
            // Si el usuario hizo clic en un botón que ya es un link, dejar que el navegador lo maneje
            if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') return;
            
            window.location.href = targetHref;
        });
    });
}

// ============================================
// 10. Auto-playing Project Gallery
// ============================================
function initProjectGallery() {
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    if (galleryThumbs.length === 0) return;

    let currentIndex = 0;
    let intervalId;
    
    // Configurar tiempo de transición (en milisegundos)
    const slideDuration = 3500;

    function nextSlide() {
        // Encontrar índice actual
        const thumbsArray = Array.from(galleryThumbs);
        currentIndex = thumbsArray.findIndex(t => t.classList.contains('active'));
        
        // Siguiente índice (volver a 0 si es el último)
        currentIndex = (currentIndex + 1) % galleryThumbs.length;
        
        // Simular clic en el thumbnail para cambiar imagen usando la función existente
        galleryThumbs[currentIndex].click();
    }

    function startAutoPlay() {
        intervalId = setInterval(nextSlide, slideDuration);
    }

    function stopAutoPlay() {
        clearInterval(intervalId);
    }

    // Iniciar autoplay
    startAutoPlay();

    // Pausar si el usuario pone el mouse sobre la galería
    const gallerySection = document.querySelector('.project-gallery');
    if (gallerySection) {
        gallerySection.addEventListener('mouseenter', stopAutoPlay);
        gallerySection.addEventListener('mouseleave', startAutoPlay);
    }
}

// ============================================
// Initialize All Features
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏘️ URBEQ - Initializing...');

    const safeInit = (initializer, label) => {
        try {
            initializer();
        } catch (error) {
            console.error(`❌ URBEQ - ${label} failed`, error);
        }
    };

    // Prioridad: Carrusel Hero (Debug activado)
    safeInit(initHeroCarousel, 'initHeroCarousel');
    safeInit(initMobileMenu, 'initMobileMenu');
    safeInit(initGlobalNavAndLogos, 'initGlobalNavAndLogos');
    safeInit(initThemeToggle, 'initThemeToggle');
    safeInit(initSmoothScroll, 'initSmoothScroll');
    safeInit(initTestimonialsCarousel, 'initTestimonialsCarousel');
    safeInit(initFormValidation, 'initFormValidation');
    safeInit(initScrollAnimations, 'initScrollAnimations');
    safeInit(initProjectFilters, 'initProjectFilters');
    safeInit(initFloatingButton, 'initFloatingButton');
    safeInit(initSearchBar, 'initSearchBar');
    safeInit(initProjectImageLinks, 'initProjectImageLinks');
    safeInit(initProjectImageHover, 'initProjectImageHover');
    safeInit(initStickyNav, 'initStickyNav');
    safeInit(initProjectGallery, 'initProjectGallery');

    console.log('✅ URBEQ - All features loaded!');
});

// ============================================
// 11. Hero Carousel (Video + Images) - MANUAL & AUTO
// ============================================
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const btnPrev = document.querySelector('.hero-prev');
    const btnNext = document.querySelector('.hero-next');
    
    if (slides.length === 0) return;

    let currentIndex = 0;
    let timeoutId = null;

    function showSlide(index) {
        // Limpiar timeout pendiente para evitar cambios dobles
        if (timeoutId) clearTimeout(timeoutId);

        console.log('Hero: Cambiando de', currentIndex, 'a', index);

        // Pausar video actual si existe
        const currentVideo = slides[currentIndex].querySelector('video');
        if (currentVideo) currentVideo.pause();

        // Cambiar clases
        slides[currentIndex].classList.remove('active');
        currentIndex = index;
        slides[currentIndex].classList.add('active');

        // Reiniciar video si el nuevo slide tiene uno
        const nextVideo = slides[currentIndex].querySelector('video');
        if (nextVideo) {
            nextVideo.currentTime = 0;
            nextVideo.play().catch(e => console.warn('Hero: Play bloqueado', e));
        }

        // Programar siguiente cambio automático
        const duration = parseInt(slides[currentIndex].getAttribute('data-duration') || 5000);
        timeoutId = setTimeout(() => {
            const nextIdx = (currentIndex + 1) % slides.length;
            showSlide(nextIdx);
        }, duration);
    }

    // Eventos Manuales
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            const nextIdx = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(nextIdx);
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            const nextIdx = (currentIndex + 1) % slides.length;
            showSlide(nextIdx);
        });
    }

    // Clic en el slide completo para avanzar
    slides.forEach((slide) => {
        slide.style.cursor = 'pointer';
        slide.addEventListener('click', () => {
            const nextIdx = (currentIndex + 1) % slides.length;
            showSlide(nextIdx);
        });
    });

    // Iniciar con el primer slide
    const initialDuration = parseInt(slides[0].getAttribute('data-duration') || 5000);
    timeoutId = setTimeout(() => {
        showSlide(1);
    }, initialDuration);
}

// Optional: Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
