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
    initGradientTextAnimations();
});

// ==========================================
// GRADIENT TEXT ANIMATIONS (Letter-by-Letter Color Change)
// ==========================================

function initGradientTextAnimations() {
    // Select all headings and subheadings
    const headings = document.querySelectorAll('.section-title, .section-tag, .dish-name, .spice-info h4');

    headings.forEach(heading => {
        // Skip if already processed
        if (heading.dataset.animated) return;
        heading.dataset.animated = 'true';

        // Split text into spans for individual letter animation
        const originalText = heading.textContent;
        heading.innerHTML = originalText
            .split('')
            .map(char =>
                char === ' '
                    ? `<span class="letter-span">&nbsp;</span>`
                    : `<span class="letter-span">${char}</span>`
            )
            .join('');

        // Select all letter spans
        const letters = heading.querySelectorAll('.letter-span');

        // Set initial color (sunset orange)
        gsap.set(letters, {
            color: '#FF512F',
        });

        // Letter-by-letter color change animation tied to scroll
        gsap.to(letters, {
            color: '#FFF8E7',  // End color (cream/white)
            stagger: 0.1,     // Each letter animates one by one
            ease: 'none',
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%',
                end: 'top 30%',
                scrub: true,  // Tied to scroll position
            },
        });
    });
}

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

    // Stats counter animation (countup from 0 - replays every time)
    gsap.utils.toArray('.stat-number').forEach(stat => {
        const value = stat.textContent;
        const number = parseInt(value);

        // Store original value
        stat.dataset.target = number;

        // Set initial value to 0
        stat.textContent = '0+';

        // Function to play countup animation
        const playCountup = () => {
            const target = parseInt(stat.dataset.target);
            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 2.5,
                ease: 'power2.out',
                onUpdate: () => {
                    stat.textContent = Math.floor(obj.val) + '+';
                }
            });
        };

        // Function to reset to 0
        const resetCount = () => {
            stat.textContent = '0+';
        };

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            end: 'bottom 15%',
            onEnter: playCountup,       // Play when scrolling down into view
            onEnterBack: playCountup,   // Play when scrolling up into view
            onLeave: resetCount,        // Reset when leaving from bottom
            onLeaveBack: resetCount,    // Reset when leaving from top
        });
    });

    // Section titles reveal (removed - handled by gradient animation)
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
