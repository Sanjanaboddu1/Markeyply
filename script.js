document.addEventListener('DOMContentLoaded', () => {
    
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // --- Navigation Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Hero Animations ---
    const heroTl = gsap.timeline();

    // Background slow zoom (15s)
    gsap.to('.hero-bg', {
        scale: 1.08,
        duration: 15,
        ease: 'none',
        repeat: -1,
        yoyo: true
    });

    // Mouse Parallax for hero bg
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');
    if (hero && heroBg && window.innerWidth > 992) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20; // 20px movement
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            gsap.to(heroBg, {
                x: x,
                y: y,
                duration: 1,
                ease: 'power1.out'
            });
        });
    }

    // Hero Text Animations
    heroTl.fromTo('.hero-title', 
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }
    )
    .fromTo('.hero-desc', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out' },
        "-=0.7" // Starts 0.3s after title begins
    )
    .fromTo('.hero-btn', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out' },
        "-=0.7" // Starts 0.6s after title begins
    );

    // --- Scroll Animations (Reusable) ---

    // Fade Up Text
    gsap.utils.toArray('.gs_fade_up').forEach(element => {
        gsap.fromTo(element, 
            { opacity: 0, y: 40 },
            { 
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                ease: 'expo.out' 
            }
        );
    });

    // About Section Left/Right Slide
    gsap.fromTo('.gs_reveal_left',
        { opacity: 0, x: -50 },
        {
            scrollTrigger: { trigger: '.about-section', start: "top 80%" },
            opacity: 1, x: 0, duration: 1, ease: 'power3.out'
        }
    );
    gsap.fromTo('.gs_reveal_right',
        { opacity: 0, x: 50, scale: 1.05 },
        {
            scrollTrigger: { trigger: '.about-section', start: "top 80%" },
            opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out'
        }
    );

    // Services Cards Stagger
    gsap.fromTo('.gs_card',
        { opacity: 0, y: 40 },
        {
            scrollTrigger: { trigger: '.services-grid', start: "top 80%" },
            opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'expo.out'
        }
    );

    // Full Width Parallax Section
    gsap.to('.parallax-img', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".full-parallax",
            start: "top bottom", 
            end: "bottom top",
            scrub: true
        } 
    });

    // --- Custom Carousel Logic ---
    const track = document.querySelector('.custom-carousel-track');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');

    function updateVideoStates() {
        if (!track) return;
        const slides = Array.from(track.children);
        slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (video) {
                if (index === 2) {
                    // Center active slide: play
                    video.play().catch(e => console.log("Autoplay prevented:", e));
                } else {
                    // Inactive side slides: pause
                    video.pause();
                }
            }
        });
    }

    if (track && nextBtn && prevBtn) {
        // Initial setup
        updateVideoStates();

        nextBtn.addEventListener('click', () => {
            track.appendChild(track.firstElementChild);
            updateVideoStates();
        });
        
        prevBtn.addEventListener('click', () => {
            track.insertBefore(track.lastElementChild, track.firstElementChild);
            updateVideoStates();
        });

        track.addEventListener('click', (e) => {
            const slide = e.target.closest('.video-slide');
            if (!slide) return;
            const slides = Array.from(track.children);
            const index = slides.indexOf(slide);
            
            if (index === 0) {
                track.insertBefore(track.lastElementChild, track.firstElementChild);
                track.insertBefore(track.lastElementChild, track.firstElementChild);
            } else if (index === 1) {
                track.insertBefore(track.lastElementChild, track.firstElementChild);
            } else if (index === 3) {
                track.appendChild(track.firstElementChild);
            } else if (index === 4) {
                track.appendChild(track.firstElementChild);
                track.appendChild(track.firstElementChild);
            }
            updateVideoStates();
        });
    }

    // --- Statistics Counter Logic ---
    const counters = document.querySelectorAll('.counter');
    let counted = false;

    ScrollTrigger.create({
        trigger: '.stats-section',
        start: 'top 80%',
        onEnter: () => {
            if(!counted) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    
                    // Animate via GSAP obj
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate: () => {
                            counter.innerText = Math.ceil(obj.val);
                        }
                    });
                });
                counted = true;
            }
        }
    });


});
