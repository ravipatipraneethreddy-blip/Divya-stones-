document.addEventListener('DOMContentLoaded', () => {
  // ======================================================================
  // Sticky Header
  // ======================================================================
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ======================================================================
  // Mobile Menu Toggle
  // ======================================================================
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // ======================================================================
  // Active Navigation Highlight
  // ======================================================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ======================================================================
  // Scroll Animations (Intersection Observer)
  // ======================================================================
  const animatedEls = document.querySelectorAll('.fade-in, .slide-up');

  if (animatedEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  }

  // ======================================================================
  // Animated Stats Counter
  // ======================================================================
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2000;
          const startTime = performance.now();

          function updateCount(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = target + suffix;
            }
          }

          requestAnimationFrame(updateCount);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // ======================================================================
  // Back to Top Button
  // ======================================================================
  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ======================================================================
  // Form Submission (Formspree AJAX)
  // ======================================================================
  document.querySelectorAll('form[data-formspree]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const resp = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (resp.ok) {
          form.style.display = 'none';
          const successEl = form.nextElementSibling;
          if (successEl && successEl.classList.contains('form-success')) {
            successEl.classList.add('show');
          }
        } else {
          alert('Something went wrong. Please try again or contact us via WhatsApp.');
          btn.textContent = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        alert('Network error. Please try again or contact us via WhatsApp.');
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  });

  // ======================================================================
  // Product Tabs
  // ======================================================================
  document.querySelectorAll('.product-tabs button').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      const parent = tab.closest('.section, .product-detail-hero')?.parentElement || document;

      // Deactivate all tabs in same group
      tab.parentElement.querySelectorAll('button').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show target content
      const tabGroup = tab.closest('[data-tab-group]') || tab.closest('.container');
      tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const targetEl = tabGroup.querySelector('#' + target);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  // ======================================================================
  // Gallery Thumbnail Click
  // ======================================================================
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const mainImg = thumb.closest('.container')?.querySelector('.product-main-img');
      if (mainImg) {
        mainImg.src = thumb.src;
        mainImg.alt = thumb.alt;
      }
      thumb.parentElement.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
});
