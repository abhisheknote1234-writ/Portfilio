/**
 * Abhishek Kumar Gupta — Research Portfolio
 * Core GSAP & ScrollTrigger Animation Engine
 * Inspired by COSMOS — 60fps+ Hardware Accelerated Architecture
 * Animates ONLY transform and opacity with zero layout thrashing
 */

(function () {
  'use strict';

  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not detected.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ─────────────────────────────────────────────────────────────
  // 0. LENIS RESPONSIVE HARDWARE SMOOTH SCROLL (Snappy 60fps)
  // ─────────────────────────────────────────────────────────────
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(500, 33);
  }

  // Always enable smooth animations
  const prefersReducedMotion = false;

  // ─────────────────────────────────────────────────────────────
  // 1. DESKTOP CUSTOM PRECISION CURSOR (gsap.quickTo for zero lag)
  // ─────────────────────────────────────────────────────────────
  const cursor = document.getElementById('customCursor');
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    // Center alignment handled via GSAP transform
    gsap.set(cursor, { x: -100, y: -100, opacity: 0 });

    const quickX = gsap.quickTo(cursor, "x", { duration: 0.16, ease: "power3.out" });
    const quickY = gsap.quickTo(cursor, "y", { duration: 0.16, ease: "power3.out" });

    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      quickX(e.clientX);
      quickY(e.clientY);

      if (!isVisible) {
        gsap.to(cursor, { opacity: 1, duration: 0.25, overwrite: "auto" });
        isVisible = true;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      gsap.to(cursor, { opacity: 0, duration: 0.25, overwrite: "auto" });
      isVisible = false;
    });

    // Hover detection on interactive elements
    const interactiveSelectors = 'a, button, .project-card, .timeline-card, .filter-tab, .flagship-showcase, .flagship-btn, video, .proof-slot, .skill-card, .vision-card, .social-icon, .hero-btn';
    
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursor.classList.remove('is-hovering');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 2. HERO SECTION CHOREOGRAPHY (#hero)
  // ─────────────────────────────────────────────────────────────

  // 2a. ECG Line: Animated stroke draw-in on load
  const ecgPath = document.querySelector('.hero-ecg-line svg path');
  if (ecgPath) {
    const totalLength = ecgPath.getTotalLength();
    gsap.set(ecgPath, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength
    });

    gsap.to(ecgPath, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: "power2.inOut",
      delay: 0.15
    });
  }

  // 2b. Hero Content: Smooth minimal reveal on load
  if (!prefersReducedMotion) {
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.95 } });
    heroTl
      .fromTo('.hero-badge', { y: 18, opacity: 0 }, { y: 0, opacity: 1 }, 0.08)
      .fromTo('.hero-name', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05 }, 0.2)
      .fromTo('.hero-tagline', { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, 0.36)
      .fromTo('.hero-actions-group', { y: 15, opacity: 0 }, { y: 0, opacity: 1 }, 0.5)
      .fromTo('.hero-avatar-circle', { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0 }, 0.22)
      .fromTo('.scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 1.0 }, 0.8);
  }

  // 2c. Hero Geometric Parallax: Outward push & fade out on scroll scrub
  const heroSection = document.getElementById('hero');
  if (heroSection && !prefersReducedMotion) {
    const shapeTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3
      }
    });

    shapeTimeline
      .to('.hero-intro-col', { y: 80, opacity: 0, ease: 'none' }, 0)
      .to('.hero-avatar-circle', { y: 50, opacity: 0, ease: 'none' }, 0);
  }

  // ─────────────────────────────────────────────────────────────
  // 3. RESEARCH JOURNEY CHOREOGRAPHY (#journey)
  // ─────────────────────────────────────────────────────────────
  const journeySection = document.getElementById('journey');
  const progressBar = document.getElementById('timelineProgress');
  const timelineContainer = document.querySelector('#journey .timeline');

  // 3a. Progress bar scrub downward via GPU scaleY (avoids height reflow)
  if (progressBar && timelineContainer && !prefersReducedMotion) {
    gsap.fromTo(progressBar, 
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineContainer,
          start: 'top 65%',
          end: 'bottom 75%',
          scrub: 0.2
        }
      }
    );
  }

  // 3b. Timeline Node Choreography: Fast one-shot GPU reveal with zero layout thrashing
  const timelineNodes = document.querySelectorAll('.timeline-node');
  timelineNodes.forEach((node) => {
    const dot = node.querySelector('.timeline-dot');
    const card = node.querySelector('.timeline-card');

    if (card && !prefersReducedMotion) {
      gsap.fromTo(card,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            start: "top 88%",
            once: true
          }
        }
      );
    }

    if (dot && !prefersReducedMotion) {
      ScrollTrigger.create({
        trigger: node,
        start: "top 60%",
        end: "bottom 40%",
        toggleClass: { targets: dot, className: "is-active" }
      });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 4. PROJECTS SECTION CHOREOGRAPHY (#projects)
  // ─────────────────────────────────────────────────────────────



  // 4b. Masonry Grid: Staggered scroll entrance (y: 100 to 0) + Parallax depth
  const projectCards = gsap.utils.toArray('.project-card');
  if (projectCards.length && !prefersReducedMotion) {
    // Staggered entrance upward from bottom of screen
    gsap.fromTo(projectCards,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power2.out",
        stagger: {
          amount: 0.4,
          from: "start"
        },
        scrollTrigger: {
          trigger: '.masonry-grid',
          start: "top 82%",
          toggleActions: "play none none none"
        },
        onComplete: () => {
          // Once entrance completes, activate subtle scroll parallax for depth
          initProjectParallax();
        }
      }
    );

    function initProjectParallax() {
      projectCards.forEach((card, idx) => {
        // Varying parallax translation gives organic depth to the grid
        const parallaxSpeed = (idx % 2 === 0) ? -24 : -48;
        gsap.to(card, {
          y: parallaxSpeed,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1
          }
        });
      });
    }
  }

  // 4c. Filter Tabs Interaction
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      projectCards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category.includes(filter);
        if (matches) {
          card.classList.remove('hidden');
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => card.classList.add('hidden')
          });
        }
      });

      // Refresh ScrollTrigger calculations after grid size shifts
      setTimeout(() => ScrollTrigger.refresh(), 350);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 5. SKILLS & VISION SECTIONS CHOREOGRAPHY
  // ─────────────────────────────────────────────────────────────

  // 5a. Staggered Entrance of .skill-card Elements
  const skillCards = gsap.utils.toArray('.skill-card');
  if (skillCards.length && !prefersReducedMotion) {
    gsap.fromTo(skillCards,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.skills-grid',
          start: "top 82%",
          toggleActions: "play none none none"
        }
      }
    );
  }

  // 5b. Vision Card: ScrollTrigger float-in + 3D mouse tilt
  const visionCard = document.querySelector('.vision-card');
  if (visionCard && !prefersReducedMotion) {
    // Float into view on scroll
    gsap.fromTo(visionCard,
      { y: 65, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: visionCard,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    // 3D tilt effect tied to mouse movement
    const tiltX = gsap.quickTo(visionCard, "rotationX", { duration: 0.28, ease: "power1.out" });
    const tiltY = gsap.quickTo(visionCard, "rotationY", { duration: 0.28, ease: "power1.out" });

    visionCard.addEventListener('mousemove', (e) => {
      const rect = visionCard.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      tiltY(normX * 12);  // gentle 6-degree 3D tilt
      tiltX(-normY * 12);
    });

    visionCard.addEventListener('mouseleave', () => {
      tiltX(0);
      tiltY(0);
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 6. FLOATING HUD NAVIGATION & SCROLL MAPPING
  // ─────────────────────────────────────────────────────────────
  const floatingNav = document.getElementById('floatingNav');
  if (floatingNav) {
    if (heroSection) {
      // Show HUD nav once scrolled past hero
      ScrollTrigger.create({
        trigger: heroSection,
        start: "bottom 140px",
        onEnter: () => floatingNav.classList.add('visible'),
        onLeaveBack: () => floatingNav.classList.remove('visible')
      });

      // Active Section Tracking for Nav Links on index page
      const sections = document.querySelectorAll('.section');
      const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

      sections.forEach(sec => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) {
              navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === sec.id);
              });
            }
          }
        });
      });
    } else {
      // Dedicated subpages: Always display floating HUD navigation
      floatingNav.classList.add('visible');
    }
  }

  // Smooth Anchor Navigation via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -20, duration: 1.4 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 7. CARD CURSOR SPOTLIGHT (GPU Property Update)
  // ─────────────────────────────────────────────────────────────
  const interactiveCards = document.querySelectorAll('.project-card, .timeline-card, .flagship-showcase, .skill-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, { passive: true });
  });

})();
