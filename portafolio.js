document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    /* ==========================================
       1. MENÚ DE NAVEGACIÓN MÓVIL
       ========================================== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    function closeMenu() {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('show-menu');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
    }

    function openMenu() {
        if (!navMenu || !navToggle) return;
        navMenu.classList.add('show-menu');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Cerrar menú');
    }

    if (navToggle && navMenu) {
        navToggle.setAttribute('role', 'button');
        navToggle.setAttribute('tabindex', '0');
        navToggle.setAttribute('aria-controls', 'nav-menu');
        navToggle.setAttribute('aria-expanded', 'false');

        navToggle.addEventListener('click', () => {
            navMenu.classList.contains('show-menu') ? closeMenu() : openMenu();
        });

        // Permite usar el control con teclado si el HTML lo mantiene como div.
        navToggle.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                navMenu.classList.contains('show-menu') ? closeMenu() : openMenu();
            }
        });
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Cierra el menú con Escape y al pasar a escritorio.
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    const mobileQuery = window.matchMedia('(min-width: 769px)');
    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener('change', (event) => {
            if (event.matches) closeMenu();
        });
    } else if (mobileQuery.addListener) {
        mobileQuery.addListener((event) => {
            if (event.matches) closeMenu();
        });
    }

    /* ==========================================
       2. EFECTO DE TIPEO EN EL HERO
       ========================================== */
    const typingText = document.getElementById('typing-text');
    const roles = [
        'Desarrollador Web',
        'Estudiante de Informática',
        'Programador C++ / Python',
        'Gestor de Bases de Datos'
    ];

    if (typingText && roles.length > 0) {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingTimer;

        // Respeta la preferencia del usuario por movimiento reducido.
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduceMotion) {
            typingText.textContent = roles[0];
        } else {
            function typeEffect() {
                const currentRole = roles[roleIndex];

                if (isDeleting) {
                    charIndex--;
                    typingText.textContent = currentRole.substring(0, charIndex);
                } else {
                    charIndex++;
                    typingText.textContent = currentRole.substring(0, charIndex);
                }

                let speed = isDeleting ? 40 : 80;

                if (!isDeleting && charIndex >= currentRole.length) {
                    charIndex = currentRole.length;
                    speed = 1800;
                    isDeleting = true;
                } else if (isDeleting && charIndex <= 0) {
                    charIndex = 0;
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    speed = 400;
                }

                typingTimer = window.setTimeout(typeEffect, speed);
            }

            typeEffect();

            // Evita mantener el temporizador si la página queda oculta.
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    window.clearTimeout(typingTimer);
                } else {
                    window.clearTimeout(typingTimer);
                    typingTimer = window.setTimeout(typeEffect, 250);
                }
            });
        }
    }

    /* ==========================================
       3. INDICADOR DE SECCIÓN ACTIVA AL HACER SCROLL
       ========================================== */
    const sections = document.querySelectorAll('section[id]');

    function scrollActive() {
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const marker = scrollY + headerHeight + 100;
        let activeId = '';

        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top + scrollY;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (marker >= sectionTop && marker < sectionBottom) {
                activeId = section.id;
            }
        });

        // En el final de la página, marca la última sección visible.
        if ((window.innerHeight + scrollY) >= document.documentElement.scrollHeight - 2) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) activeId = lastSection.id;
        }

        navLinks.forEach((link) => {
            const target = link.getAttribute('href');
            const isActive = target === `#${activeId}`;
            link.classList.toggle('active-link', Boolean(activeId) && isActive);
            if (isActive && activeId) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                scrollActive();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', scrollActive);
    window.addEventListener('load', scrollActive);
    scrollActive();
});
