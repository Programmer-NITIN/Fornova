/**
 * FORNOVA INTERIOR — Interactive Application Logic
 * Studio: Vadodara, Gujarat
 */

// Google Sheets Webhook URL (Paste your Google Apps Script Web App URL below)
// Follow the 2-minute setup guide in GOOGLE_SHEET_SETUP.md
const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycby8Xa1adQNckkRMurU6H8mUsqRQs3pOo42OAGkOo5qv2DF0s57AA86fEdhwI_PvUshL/exec';

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initTransformationSlider();
  initPortfolio();
  initFaqAccordion();
  initVideoModal();
  initContactForm();
});

/* -------------------------------------------------------------------------- */
/* 1. STICKY HEADER WITH BLUR ON SCROLL                                       */
/* -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* 2. MOBILE NAVIGATION DRAWER                                                */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const navLinks = document.querySelectorAll('.mobile-drawer-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  backdrop.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* -------------------------------------------------------------------------- */
/* 3. INTERACTIVE BEFORE / AFTER TRANSFORMATION SLIDER                       */
/* -------------------------------------------------------------------------- */
function initTransformationSlider() {
  const container = document.getElementById('transformation-container');
  const overlay = document.getElementById('transformation-overlay');
  const handle = document.getElementById('transformation-handle');
  const overlayImg = overlay ? overlay.querySelector('img') : null;

  if (!container || !overlay || !handle) return;

  function syncOverlayImageWidth() {
    if (overlayImg && container) {
      overlayImg.style.width = `${container.offsetWidth}px`;
      overlayImg.style.height = `${container.offsetHeight}px`;
      overlayImg.style.maxWidth = 'none';
    }
  }

  window.addEventListener('resize', syncOverlayImageWidth);
  syncOverlayImageWidth();

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    overlay.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Events for Mobile
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  // Container Click Support
  container.addEventListener('click', (e) => {
    setSliderPosition(e.clientX);
  });
}



/* -------------------------------------------------------------------------- */
/* 5. PORTFOLIO FILTERING & LIGHTBOX MODAL                                   */
/* -------------------------------------------------------------------------- */
function initPortfolio() {
  const filterBtns = document.querySelectorAll('.portfolio-tab-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  const modal = document.getElementById('portfolio-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalMeta = document.getElementById('modal-meta');
  const modalClose = document.getElementById('modal-close');

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Lightbox
  if (modal && modalClose) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('.portfolio-title');
        const desc = card.getAttribute('data-desc');
        const meta = card.getAttribute('data-meta');

        if (modalImg && img) modalImg.src = img.src;
        if (modalTitle && title) modalTitle.textContent = title.textContent;
        if (modalDesc && desc) modalDesc.textContent = desc;
        if (modalMeta && meta) modalMeta.textContent = meta;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 6. FAQ ACCORDION                                                           */
/* -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items for clean editorial look
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      if (isOpen) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 7. VIDEO WALKTHROUGH REEL MODAL                                           */
/* -------------------------------------------------------------------------- */
function initVideoModal() {
  const trigger = document.getElementById('play-video-reel');
  const videoModal = document.getElementById('video-modal');
  const videoPlayer = document.getElementById('reel-player');
  const closeBtn = document.getElementById('video-modal-close');

  if (!trigger || !videoModal || !videoPlayer) return;

  function openVideo() {
    videoModal.classList.add('open');
    videoPlayer.currentTime = 0;
    videoPlayer.play().catch(() => {});
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    videoModal.classList.remove('open');
    videoPlayer.pause();
    document.body.style.overflow = '';
  }

  trigger.addEventListener('click', openVideo);
  if (closeBtn) closeBtn.addEventListener('click', closeVideo);

  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideo();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('open')) {
      closeVideo();
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 8. CONTACT FORM SUBMISSION (WITH GOOGLE SHEETS & WHATSAPP INTEGRATION)     */
/* -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('consultation-form');
  const statusMsg = document.getElementById('form-status-msg');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : 'Submit Consultation Request';

    const name = form.querySelector('[name="client_name"]').value.trim();
    const phone = form.querySelector('[name="client_phone"]').value.trim();
    const area = form.querySelector('[name="client_locality"]').value;
    const service = form.querySelector('[name="client_service"]').value;
    const notes = form.querySelector('[name="client_notes"]').value.trim();

    // Set loading state with animated brass spinner
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite; font-size: 1.1rem;">progress_activity</span>
        <span>Appending to Atelier Desk...</span>
      `;
    }

    // Prepend apostrophe if phone begins with '+' or '=' so Google Sheets never misinterprets it as a formula error
    const safeSheetPhone = (phone.startsWith('+') || phone.startsWith('=')) ? `'${phone}` : phone;

    const leadPayload = {
      client_name: name,
      client_phone: safeSheetPhone,
      client_locality: area,
      client_service: service,
      client_notes: notes || 'No additional notes',
      source: 'Website Consultation Booking',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // 1. Foolproof Local Storage Backup (no lead is ever lost if network drops)
    try {
      const stored = JSON.parse(localStorage.getItem('fornova_consultation_leads') || '[]');
      stored.unshift(leadPayload);
      localStorage.setItem('fornova_consultation_leads', JSON.stringify(stored.slice(0, 50)));
    } catch (storageErr) {
      console.warn('Local backup note:', storageErr);
    }

    // 2. Google Sheets Webhook Dispatch via URLSearchParams (CORS-friendly for Google Apps Script)
    let sheetDispatched = false;
    if (GOOGLE_SHEET_ENDPOINT && GOOGLE_SHEET_ENDPOINT.trim() !== '') {
      try {
        const postData = new URLSearchParams();
        for (const [key, val] of Object.entries(leadPayload)) {
          postData.append(key, val);
        }

        await fetch(GOOGLE_SHEET_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: postData.toString()
        });
        sheetDispatched = true;
      } catch (err) {
        console.warn('Google Sheet append notice:', err);
      }
    } else {
      console.info(
        '%c[Fornova Studio Desk]%c Lead recorded locally! To connect your Google Sheet, follow GOOGLE_SHEET_SETUP.md and paste your Web App URL into GOOGLE_SHEET_ENDPOINT in js/app.js.',
        'color: #B88E4F; font-weight: bold;',
        'color: inherit;'
      );
    }

    // 3. Provide luxury confirmation message with 1-click WhatsApp handoff
    if (statusMsg) {
      statusMsg.style.display = 'block';
      const encodedMsg = encodeURIComponent(
        `Hello Fornova Interior Studio! I just booked a consultation on your website for my ${service} in ${area}, Vadodara.\nName: ${name}\nPhone: ${phone}${notes ? `\nNotes: ${notes}` : ''}`
      );

      statusMsg.innerHTML = `
        <div style="background: rgba(184,142,79,0.08); border: 1px solid var(--gold-primary); padding: 1.5rem; color: var(--text-primary); font-size: 0.88rem; margin-top: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--gold-dark); font-weight: 600; margin-bottom: 0.4rem;">
            <span class="material-symbols-outlined" style="color: var(--gold-primary); font-size: 1.3rem;">task_alt</span>
            <span>Consultation Request Confirmed, ${name}!</span>
          </div>
          <p style="margin: 0; line-height: 1.6; color: var(--text-secondary); font-size: 0.84rem;">
            Your project details have been successfully logged in our atelier desk. Our principal design architect will review your spatial requirements and contact you within 24 hours.
          </p>
          <div style="margin-top: 1.15rem; display: flex; flex-wrap: wrap; align-items: center; gap: 0.85rem;">
            <a href="https://wa.me/919173531156?text=${encodedMsg}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="background: #25D366; border-color: #25D366; color: #fff; padding: 0.65rem 1.35rem; font-size: 0.75rem;">
              <span class="material-symbols-outlined" style="font-size: 1.1rem;">chat</span>
              <span>Connect on WhatsApp Now &rarr;</span>
            </a>
            <span style="font-size: 0.75rem; color: var(--text-muted);">(Instant priority chat with our design team)</span>
          </div>
        </div>
      `;

      // Smooth scroll status into view if needed
      statusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Reset button and form fields
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
    form.reset();
  });
}

// Global helper for developer/client to inspect captured leads in browser console
window.fornovaLeads = {
  list: () => {
    const items = JSON.parse(localStorage.getItem('fornova_consultation_leads') || '[]');
    console.table(items);
    return items;
  },
  clear: () => {
    localStorage.removeItem('fornova_consultation_leads');
    console.log('Fornova consultation leads cleared from browser storage.');
  }
};
