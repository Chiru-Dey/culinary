// ==========================================
// GSAP ANIMATIONS & INTERACTIONS
// ==========================================

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initScrollAnimations();
    initNavigation();
    initDishCardInteractions();
});

// ==========================================
// HERO SECTION ANIMATIONS
// ==========================================

function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-title', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.3
    })
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 1,
        }, '-=0.6')
        .to('.cta-button', {
            opacity: 1,
            y: 0,
            duration: 1,
        }, '-=0.6');
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations() {
    // Dish cards stagger animation
    gsap.utils.toArray('.dish-card').forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1,
            },
            delay: index * 0.1
        });
    });

    // Spice items animation
    gsap.utils.toArray('.spice-item').forEach((item, index) => {
        gsap.to(item, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1,
            },
            delay: index * 0.1
        });
    });

    // Spices image animation
    gsap.to('.spices-image', {
        opacity: 1,
        x: 0,
        duration: 1.2,
        scrollTrigger: {
            trigger: '.spices-image',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
        }
    });

    // Heritage section parallax
    gsap.to('.heritage-image', {
        y: -50,
        scrollTrigger: {
            trigger: '.heritage-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
        }
    });

    // Stats counter animation
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const value = stat.textContent;
        const number = parseInt(value);

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(stat, {
                    innerHTML: number,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    onUpdate: function () {
                        stat.innerHTML = Math.ceil(this.targets()[0].innerHTML) + '+';
                    }
                });
            },
            once: true
        });
    });

    // Section titles reveal
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            opacity: 0,
            y: 30,
            duration: 1,
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 1,
            }
        });
    });
}

// ==========================================
// NAVIGATION
// ==========================================

function initNavigation() {
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: targetSection,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            gsap.to(navbar, {
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                duration: 0.3
            });
        } else {
            gsap.to(navbar, {
                backgroundColor: 'rgba(26, 26, 26, 0.85)',
                duration: 0.3
            });
        }
    });
}

// ==========================================
// DISH CARD INTERACTIONS
// ==========================================

function initDishCardInteractions() {
    const dishCards = document.querySelectorAll('.dish-card');

    dishCards.forEach(card => {
        const image = card.querySelector('.dish-image');
        const overlay = card.querySelector('.dish-overlay');
        const info = card.querySelector('.dish-info');

        card.addEventListener('mouseenter', () => {
            gsap.to(image, {
                scale: 1.1,
                duration: 0.6,
                ease: 'power2.out'
            });

            gsap.to(overlay, {
                opacity: 1,
                duration: 0.4
            });

            gsap.to(card, {
                y: -12,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(image, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });

            gsap.to(overlay, {
                opacity: 0,
                duration: 0.4
            });

            gsap.to(card, {
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
}

// ==========================================
// CTA BUTTON INTERACTION
// ==========================================

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: '#dishes',
                offsetY: 80
            },
            ease: 'power3.inOut'
        });
    });
}

// ==========================================
// PARALLAX EFFECTS
// ==========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');

    if (heroContent && scrolled < window.innerHeight) {
        gsap.to(heroContent, {
            y: scrolled * 0.5,
            opacity: 1 - (scrolled / window.innerHeight) * 1.5,
            duration: 0
        });
    }
});
