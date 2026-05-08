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
  // Form Submission (AJAX - Works with Netlify & Formspree)
  // ======================================================================
  document.querySelectorAll('form').forEach(form => {
    // Target contact and catalog forms specifically since Netlify strips the data-netlify attribute
    const formName = form.getAttribute('name');
    if (formName !== 'contact' && formName !== 'catalog') return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      if (btn.disabled) return; // Prevent duplicate submissions
      
      const originalText = btn.textContent;
      btn.textContent = formName === 'catalog' ? 'Preparing Catalog...' : 'Sending...';
      btn.disabled = true;

      const formData = new FormData(form);
      
      // ====================================================================
      // WEB3FORMS INTEGRATION FOR CLOUDFLARE PAGES
      // IMPORTANT: Replace the string below with your Web3Forms access key
      // Get it free at https://web3forms.com/ (linked to sales@divyastones.in)
      // ====================================================================
      const WEB3FORMS_ACCESS_KEY = "862b060f-4348-42d8-a1f7-8f373e258b90";
      
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      if (formName) {
        formData.append('subject', `New Inquiry from Divya Stones (${formName})`);
      }

      // Force action URL to Web3Forms API since Netlify handling is disabled
      const actionUrl = 'https://api.web3forms.com/submit';

      try {
        const resp = await fetch(actionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });

        if (resp.ok) {
          // Clear form fields automatically
          form.reset();
          
          // Smooth fade out
          form.style.transition = 'opacity 0.3s ease';
          form.style.opacity = '0';
          
          setTimeout(() => {
            form.style.display = 'none';
            
            // Create and show clean success message
            const successDiv = document.createElement('div');
            successDiv.style.backgroundColor = 'var(--color-light)';
            successDiv.style.borderLeft = '4px solid #28a745';
            successDiv.style.padding = '32px';
            successDiv.style.borderRadius = '4px';
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.5s ease';
            
            if (formName === 'catalog') {
              successDiv.innerHTML = `
                <h3 style="color: var(--color-dark); margin-bottom: 16px; font-size: 20px;">✓ Catalog Request Received Successfully</h3>
                <p style="color: var(--color-grey-dark); line-height: 1.6; font-size: 16px;">Your premium export catalog is opening automatically.</p>
              `;
              
              // After 1 second, trigger Catalog actions
              setTimeout(() => {
                const catalogUrl = 'digital-catalog.html';
                // Open in new tab with print trigger
                window.open(catalogUrl + '?print=true', '_blank');
                
                // Trigger download of the HTML file
                const downloadLink = document.createElement('a');
                downloadLink.href = catalogUrl;
                downloadLink.download = 'Divya-Stones-Export-Catalog.html';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
              }, 1000);
              
            } else {
              successDiv.innerHTML = `
                <h3 style="color: var(--color-dark); margin-bottom: 16px; font-size: 20px;">✓ Request received successfully</h3>
                <p style="color: var(--color-grey-dark); line-height: 1.6; font-size: 16px;">Thank you! Our export team will send the details to your email within 12 hours.</p>
              `;
            }
            
            form.parentNode.insertBefore(successDiv, form.nextSibling);
            
            // Fade in the success message
            setTimeout(() => {
              successDiv.style.opacity = '1';
            }, 50);
          }, 300);
          
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
  // Gallery Thumbnail Click & Caption
  // ======================================================================
  function updateCaption(mainImg, altText) {
    let caption = mainImg.parentElement.querySelector('.main-img-caption');
    if (!caption) {
      caption = document.createElement('p');
      caption.className = 'main-img-caption';
      caption.style.textAlign = 'center';
      caption.style.marginTop = '12px';
      caption.style.fontWeight = '600';
      caption.style.color = 'var(--color-dark)';
      caption.style.textTransform = 'capitalize';
      caption.style.fontSize = '16px';
      mainImg.parentElement.insertBefore(caption, mainImg.nextSibling);
    }
    // Clean up the text a bit for display
    caption.textContent = altText.replace('—', '-');
  }

  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const mainImg = thumb.closest('.container')?.querySelector('.product-main-img');
      if (mainImg) {
        mainImg.src = thumb.src;
        mainImg.alt = thumb.alt;
        updateCaption(mainImg, thumb.alt);
      }
      thumb.parentElement.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Initialize captions on page load for the default active thumbnails
  document.querySelectorAll('.gallery-thumb.active').forEach(thumb => {
    const mainImg = thumb.closest('.container')?.querySelector('.product-main-img');
    if (mainImg) {
      updateCaption(mainImg, thumb.alt);
    }
  });
});
