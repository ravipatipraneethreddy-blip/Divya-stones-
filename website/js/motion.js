// ============================================================================
// DIVYA STONES — 3D MOTION ENGINE
// Premium scroll-driven animations, 3D tilt effects, parallax, and cinematic
// text reveals. Built with GSAP + ScrollTrigger + Lenis smooth scroll.
// ============================================================================

(function () {
  'use strict';

  // Wait for GSAP and ScrollTrigger to be available
  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return setTimeout(init, 50);
    }

    gsap.registerPlugin(ScrollTrigger);

    // ========================================================================
    // 1. LENIS SMOOTH SCROLL
    // ========================================================================
    let lenis;
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Sync Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // ========================================================================
    // 2. CINEMATIC HERO ENTRANCE
    // ========================================================================
    const hero = document.querySelector('.hero');
    if (hero) {
      const heroContent = hero.querySelector('.hero-content');
      const heroH1 = hero.querySelector('h1');
      const heroP = hero.querySelector('p');
      const heroBtns = hero.querySelector('.hero-btns');
      const heroTrust = hero.querySelector('[style*="margin-top: 16px"]');

      // Initial state
      gsap.set([heroH1, heroP, heroBtns, heroTrust].filter(Boolean), {
        opacity: 0,
        y: 60,
        rotateX: 15,
      });

      // Staggered reveal
      const heroTl = gsap.timeline({ delay: 0.3 });
      if (heroH1) heroTl.to(heroH1, { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'power3.out' });
      if (heroP) heroTl.to(heroP, { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power3.out' }, '-=0.7');
      if (heroBtns) heroTl.to(heroBtns, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
      if (heroTrust) heroTl.to(heroTrust, { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');

      // Hero parallax on scroll
      gsap.to(hero, {
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        backgroundPositionY: '40%',
        ease: 'none',
      });

      // Hero content fades as you scroll past
      if (heroContent) {
        gsap.to(heroContent, {
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '60% top',
            scrub: true,
          },
          opacity: 0,
          y: -80,
          scale: 0.95,
          ease: 'none',
        });
      }
    }

    // ========================================================================
    // 3. SECTION HEADINGS — SPLIT TEXT REVEAL
    // ========================================================================
    document.querySelectorAll('h2').forEach((heading) => {
      // Wrap each word in a span for individual animation
      const words = heading.textContent.split(' ');
      heading.innerHTML = words
        .map((word) => `<span class="motion-word" style="display:inline-block;overflow:hidden;"><span style="display:inline-block;">${word}</span></span>`)
        .join(' ');

      const innerSpans = heading.querySelectorAll('.motion-word > span');

      gsap.set(innerSpans, { y: '110%', rotateX: -60, opacity: 0 });

      gsap.to(innerSpans, {
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: '0%',
        rotateX: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.06,
      });
    });

    // ========================================================================
    // 4. STAT COUNTERS — 3D FLIP-IN
    // ========================================================================
    document.querySelectorAll('.stat-item').forEach((stat, i) => {
      gsap.set(stat, { opacity: 0, y: 40, rotateY: -30, scale: 0.9 });

      gsap.to(stat, {
        scrollTrigger: {
          trigger: stat,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        rotateY: 0,
        scale: 1,
        duration: 1,
        delay: i * 0.12,
        ease: 'power3.out',
      });
    });

    // ========================================================================
    // 5. PRODUCT CARDS — 3D TILT ON HOVER
    // ========================================================================
    document.querySelectorAll('.product-card').forEach((card) => {
      card.style.transformStyle = 'preserve-3d';
      card.style.perspective = '800px';
      card.style.transition = 'none';

      // Scroll reveal
      gsap.set(card, { opacity: 0, y: 80, rotateX: 10 });
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // 3D tilt on mousemove
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          scale: 1.04,
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });

    // ========================================================================
    // 6. FEATURE CARDS — STAGGERED 3D ENTRANCE
    // ========================================================================
    document.querySelectorAll('.feature-card').forEach((card, i) => {
      gsap.set(card, { opacity: 0, y: 60, rotateX: 12, scale: 0.95 });

      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.9,
        delay: i * 0.08,
        ease: 'power3.out',
      });

      // Magnetic hover
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
        gsap.to(card, { x: x, y: y - 4, duration: 0.3, ease: 'power2.out' });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    });

    // ========================================================================
    // 7. TESTIMONIAL CARDS — SLIDE IN FROM SIDES
    // ========================================================================
    document.querySelectorAll('.testimonial-card').forEach((card, i) => {
      const direction = i % 2 === 0 ? -80 : 80;
      gsap.set(card, { opacity: 0, x: direction, rotateY: direction > 0 ? 8 : -8 });

      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 1.1,
        delay: i * 0.1,
        ease: 'power3.out',
      });
    });

    // ========================================================================
    // 8. TRUST BADGES — ORBIT-IN EFFECT
    // ========================================================================
    document.querySelectorAll('.trust-badge').forEach((badge, i) => {
      gsap.set(badge, { opacity: 0, scale: 0.5, y: 30, rotateZ: -15 + i * 5 });

      gsap.to(badge, {
        scrollTrigger: {
          trigger: badge,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        scale: 1,
        y: 0,
        rotateZ: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'back.out(1.7)',
      });
    });

    // ========================================================================
    // 9. CTA SECTION — DRAMATIC SCALE REVEAL
    // ========================================================================
    const ctaSection = document.querySelector('.section-dark.text-center');
    if (ctaSection) {
      const ctaContainer = ctaSection.querySelector('.container');
      if (ctaContainer) {
        gsap.set(ctaContainer, { opacity: 0, scale: 0.85, y: 40 });

        gsap.to(ctaContainer, {
          scrollTrigger: {
            trigger: ctaSection,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        });
      }
    }

    // ========================================================================
    // 10. HORIZONTAL SCROLL PARALLAX FOR SECTIONS
    // ========================================================================
    document.querySelectorAll('.section-grey').forEach((section) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        backgroundPositionX: '20%',
        ease: 'none',
      });
    });

    // ========================================================================
    // 11. GALLERY THUMBNAILS — CASCADE REVEAL
    // ========================================================================
    document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
      gsap.set(thumb, { opacity: 0, scale: 0.8, y: 20 });

      gsap.to(thumb, {
        scrollTrigger: {
          trigger: thumb,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        delay: (i % 6) * 0.07,
        ease: 'power2.out',
      });
    });

    // ========================================================================
    // 12. BUTTONS — MAGNETIC CURSOR PULL
    // ========================================================================
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        gsap.to(btn, { x: x, y: y, duration: 0.3, ease: 'power2.out' });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });

    // ========================================================================
    // 13. FOOTER — ELEGANT REVEAL
    // ========================================================================
    const footer = document.querySelector('.footer');
    if (footer) {
      const footerGrid = footer.querySelector('.footer-grid');
      if (footerGrid) {
        gsap.set(footerGrid.children, { opacity: 0, y: 40 });

        gsap.to(footerGrid.children, {
          scrollTrigger: {
            trigger: footer,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }
    }

    // ========================================================================
    // 14. CURSOR GLOW EFFECT (Desktop only)
    // ========================================================================
    if (window.matchMedia('(pointer: fine)').matches) {
      const cursor = document.createElement('div');
      cursor.className = 'motion-cursor';
      document.body.appendChild(cursor);

      let cursorX = 0, cursorY = 0;
      let currentX = 0, currentY = 0;

      document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
      });

      function animateCursor() {
        currentX += (cursorX - currentX) * 0.15;
        currentY += (cursorY - currentY) * 0.15;
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      // Grow cursor on interactive elements
      document.querySelectorAll('a, button, .product-card, .feature-card').forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('motion-cursor-active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('motion-cursor-active'));
      });
    }

    // ========================================================================
    // 15. VIDEO PLACEHOLDER — PULSE + 3D HOVER
    // ========================================================================
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
      gsap.set(videoPlaceholder, { opacity: 0, scale: 0.9, rotateX: 8 });

      gsap.to(videoPlaceholder, {
        scrollTrigger: {
          trigger: videoPlaceholder,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      // Play icon pulse
      const playIcon = videoPlaceholder.querySelector('.play-icon');
      if (playIcon) {
        gsap.to(playIcon, {
          scale: 1.15,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      }
    }

    // Override default fade-in/slide-up classes since GSAP now handles animations
    document.querySelectorAll('.fade-in, .slide-up').forEach((el) => {
      el.classList.add('visible');
    });

    console.log('✦ Divya Stones Motion Engine — Loaded');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
