/* ==========================================================================
   ARIA LAURENT — HAUTE MAKEUP & BEAUTY STUDIO
   Application Logic & Micro-Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Custom Magnetic Cursor
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');

  if (cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;

      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect for interactive elements
    const hoverables = document.querySelectorAll('a, button, input, select, textarea, .portfolio-card, .service-card, .social-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
    });
  }

  // 3. Header Scroll Glassmorphism Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 4. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // 5. Interactive Before & After Transformation Slider
  const baContainer = document.getElementById('baSlider');
  const baAfter = document.getElementById('baAfter');
  const baHandle = document.getElementById('baHandle');

  if (baContainer && baAfter && baHandle) {
    let isDragging = false;

    const setSliderPosition = (x) => {
      const rect = baContainer.getBoundingClientRect();
      let position = x - rect.left;

      if (position < 0) position = 0;
      if (position > rect.width) position = rect.width;

      const percentage = (position / rect.width) * 100;
      baAfter.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    };

    baContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    baContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // 6. Portfolio Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 7. Lightbox Modal
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBookBtn = document.getElementById('lightboxBookBtn');

  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const category = card.querySelector('.portfolio-category')?.textContent || 'Haute Look';

      lightboxImg.src = img;
      lightboxTitle.textContent = title;
      lightboxCategory.textContent = category;
      lightboxModal.classList.add('active');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxBookBtn) {
    lightboxBookBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
    const quizModal = document.getElementById('quizModal');
    if (e.target === quizModal) {
      quizModal.classList.remove('active');
    }
  });

  // 8. Style Finder Quiz Modal
  const openQuizBtn = document.getElementById('openQuizBtn');
  const quizModal = document.getElementById('quizModal');
  const quizClose = document.getElementById('quizClose');
  const quizOpts = document.querySelectorAll('.quiz-opt');
  const quizStep1 = document.getElementById('quizStep1');
  const quizResult = document.getElementById('quizResult');

  if (openQuizBtn && quizModal) {
    openQuizBtn.addEventListener('click', () => {
      quizStep1.style.display = 'block';
      quizResult.style.display = 'none';
      quizModal.classList.add('active');
    });
  }

  if (quizClose) {
    quizClose.addEventListener('click', () => {
      quizModal.classList.remove('active');
    });
  }

  quizOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      const type = opt.getAttribute('data-type');
      let title = "Signature Royal Glam";
      let desc = "Our 24k Gold HD Airbrush finish paired with Hollywood soft waves.";

      if (type === 'bridal') {
        title = "Royal Luxury Bridal Glam";
        desc = "Full airbrush 24k gold skin prep, mink lash customization, and veil draping.";
      } else if (type === 'engagement') {
        title = "Sunset Romance Soft Glam";
        desc = "Luminous glass skin with warm rose-gold eyeshadow and glossy nude lips.";
      } else if (type === 'gala') {
        title = "Red Carpet Couture Smokey Look";
        desc = "Dramatic smokey champagne eyes, sculpted contouring, and velvet setting.";
      }

      document.getElementById('quizResultTitle').textContent = title;
      document.getElementById('quizResultDesc').textContent = desc;

      quizStep1.style.display = 'none';
      quizResult.style.display = 'block';
    });
  });

  const quizBookBtn = document.getElementById('quizBookBtn');
  if (quizBookBtn) {
    quizBookBtn.addEventListener('click', () => {
      quizModal.classList.remove('active');
    });
  }

  // 9. Booking Price Calculator
  const serviceTypeSelect = document.getElementById('serviceType');
  const guestCountSelect = document.getElementById('guestCount');
  const bookingCalcSummary = document.getElementById('bookingCalcSummary');

  function updateBookingTotal() {
    if (!serviceTypeSelect || !guestCountSelect || !bookingCalcSummary) return;

    const basePrice = parseInt(serviceTypeSelect.value) || 450;
    const guestAddon = parseInt(guestCountSelect.value) || 0;
    const serviceName = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text.split(' (')[0];

    const total = basePrice + guestAddon;
    bookingCalcSummary.textContent = `${serviceName} ($${total.toLocaleString()})`;
  }

  if (serviceTypeSelect && guestCountSelect) {
    serviceTypeSelect.addEventListener('change', updateBookingTotal);
    guestCountSelect.addEventListener('change', updateBookingTotal);
    updateBookingTotal();
  }

  // 10. Booking Form Submission
  const bookingForm = document.getElementById('bookingForm');
  const toastNotification = document.getElementById('toastNotification');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value;

      if (toastNotification) {
        document.getElementById('toastTitle').textContent = `Thank You, ${name}!`;
        document.getElementById('toastMsg').textContent = `Your appointment request has been received. Our concierge will reach out within 24h.`;
        toastNotification.classList.add('active');

        setTimeout(() => {
          toastNotification.classList.remove('active');
        }, 5000);
      }

      bookingForm.reset();
      updateBookingTotal();
    });
  }

  // 11. Animated Statistics Counters
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function checkStatsScroll() {
    if (animated) return;
    const triggerBottom = window.innerHeight * 0.85;

    statNumbers.forEach(stat => {
      const rect = stat.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        animated = true;
        const target = parseInt(stat.getAttribute('data-target')) || 0;
        let count = 0;
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / target));

        const timer = setInterval(() => {
          count += Math.ceil(target / 40);
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          if (stat.textContent.includes('%')) {
            stat.textContent = `${count}%`;
          } else if (stat.textContent.includes('+')) {
            stat.textContent = `${count}+`;
          } else {
            stat.textContent = count;
          }
        }, stepTime || 30);
      }
    });
  }

  window.addEventListener('scroll', checkStatsScroll);
  checkStatsScroll();
});
