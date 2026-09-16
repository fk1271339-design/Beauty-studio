/* ==========================================================================
   ARIA LAURENT — ULTRA-LUXURY SCROLL MOTION & INTERACTIVE JS ENGINE
   Includes: Lenis Smooth Scroll, GSAP ScrollTrigger 5-Step Image Stack,
   Non-glitchy Custom Golden Cursor, Interactive Modals, INR (₹) Currency Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Preloader Animation
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');
  let loadProgress = 0;

  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 25) + 15;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);
      if (preloaderBar) preloaderBar.style.width = '100%';
      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
        initScrollAnimations();
      }, 400);
    } else {
      if (preloaderBar) preloaderBar.style.width = loadProgress + '%';
    }
  }, 100);

  // 3. Custom Golden Magnetic Cursor (Strict Desktop Only)
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024;

  if (cursorDot && cursorRing && !isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const hoverables = document.querySelectorAll('button, a, .gallery-thumb, input, select, label, .mini-service-box, .pill-card, .spa-card');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  } else {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  // 4. Initialize Lenis Smooth Scroll
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // 5. Scroll Animations & GSAP 5-Section Crossfade Engine
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded, falling back to Intersection Observer');
      fallbackIntersectionObserver();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0, 0);
    }

    const sections = document.querySelectorAll('.cinematic-section');
    const bgSlides = document.querySelectorAll('.bg-slide');
    const navItems = document.querySelectorAll('.nav-item');
    const hudBar = document.getElementById('hudBar');
    const hudCurrent = document.getElementById('hudCurrent');
    const hudLabel = document.getElementById('hudLabel');
    const navbar = document.getElementById('navbar');

    const sectionTitles = [
      'THE SALON',
      'THE ENTRANCE',
      'THE CRAFT',
      'THE SPA',
      'PORTFOLIO'
    ];

    // Navbar Scroll Background Change
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Create ScrollTrigger per section
    sections.forEach((sec, idx) => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => activateSection(idx),
        onEnterBack: () => activateSection(idx),
      });
    });

    function activateSection(index) {
      // Update background slides crossfade
      bgSlides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update section contents reveal
      sections.forEach((sec, i) => {
        if (i === index) {
          sec.classList.add('section-active');
        } else {
          sec.classList.remove('section-active');
        }
      });

      // Update Nav active indicator
      navItems.forEach((item, i) => {
        if (i === index) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Update HUD Indicator
      if (hudBar) {
        hudBar.style.top = `${(index / 4) * 80}%`;
      }
      if (hudCurrent) {
        hudCurrent.textContent = `0${index + 1}`;
      }
      if (hudLabel && sectionTitles[index]) {
        hudLabel.textContent = sectionTitles[index];
      }
    }

    // Set Section 0 as default active
    activateSection(0);
  }

  // Fallback Intersection Observer if GSAP is blocked
  function fallbackIntersectionObserver() {
    const sections = document.querySelectorAll('.cinematic-section');
    const bgSlides = document.querySelectorAll('.bg-slide');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.getAttribute('data-index'), 10);
          bgSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
          });
          entry.target.classList.add('section-active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(sec => observer.observe(sec));
  }

  // 6. Navigation Smooth Scroll Links
  const allNavAnchors = document.querySelectorAll('a[href^="#"]');
  allNavAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetSection, { offset: 0, duration: 1.4 });
          } else {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
          closeMobileDrawer();
        }
      }
    });
  });

  // 7. Interactive Modals Logic (Booking & Menu Drawers)
  const bookingModal = document.getElementById('bookingModal');
  const menuModal = document.getElementById('menuModal');
  const lightboxModal = document.getElementById('lightboxModal');
  const mobileDrawer = document.getElementById('mobileDrawer');

  const openBookingBtns = document.querySelectorAll('.btn-glowing-gold, .trigger-booking, #mobileBookBtn');
  const openMenuBtns = document.querySelectorAll('#openMenuBtn, .trigger-menu');

  const closeBookingBtn = document.getElementById('closeBookingBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const closeMobileDrawerBtn = document.getElementById('closeMobileDrawer');
  const mobileToggle = document.getElementById('mobileToggle');

  // Open Booking
  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (bookingModal) bookingModal.classList.add('open');
      closeMobileDrawer();
    });
  });

  // Open Menu
  openMenuBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (menuModal) menuModal.classList.add('open');
      closeMobileDrawer();
    });
  });

  // Close Modals
  if (closeBookingBtn) closeBookingBtn.addEventListener('click', () => bookingModal.classList.remove('open'));
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', () => menuModal.classList.remove('open'));
  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', () => lightboxModal.classList.remove('open'));

  [bookingModal, menuModal, lightboxModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }
  });

  // Mobile Drawer Toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.toggle('open');
    });
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
  }

  if (closeMobileDrawerBtn) closeMobileDrawerBtn.addEventListener('click', closeMobileDrawer);

  // 8. Menu Modal Tabs
  const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
  const menuTabContents = document.querySelectorAll('.menu-tab-content');

  menuTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      menuTabBtns.forEach(b => b.classList.remove('active'));
      menuTabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) activeContent.classList.add('active');
    });
  });

  // 9. Gallery Lightbox Preview
  const galleryThumbs = document.querySelectorAll('.trigger-lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  galleryThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const imgSrc = thumb.getAttribute('data-img');
      const caption = thumb.getAttribute('data-caption');
      if (lightboxImg && imgSrc) {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption || 'ARIA LAURENT VIP Suite';
        lightboxModal.classList.add('open');
      }
    });
  });

  // 10. Form Submissions & Toast Notifications
  window.handleFullBooking = function(e) {
    e.preventDefault();
    const bookingName = document.getElementById('bookingName')?.value || 'Valued Guest';
    if (bookingModal) bookingModal.classList.remove('open');
    showToast('VIP Booking Confirmed', `Thank you, ${bookingName}. Concierge will confirm your INR (₹) booking request within 1 hour.`);
  };

  window.showBookingSuccess = function() {
    showToast('Enquiry Received', 'Thank you for reaching out to ARIA LAURENT. Our team will contact you shortly.');
  };

  function showToast(title, message) {
    const toast = document.getElementById('toastNotif');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4500);
    }
  }

  // Set default minimum booking date to today
  const bookingDateInput = document.getElementById('bookingDate');
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;
  }

  // 11. Category Filter Pill Toggle (Section 3 "The Craft")
  const catPills = document.querySelectorAll('.cat-pill');
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // 12. Global showToast for newsletter form
  window.showToast = showToast;
});
