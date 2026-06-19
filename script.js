/* ===================================================
   Course Bedarija — Interactions
=================================================== */
(function () {
  'use strict';

  /* ---- Sticky header shadow ---- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  // close menu on link click (mobile)
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // slight stagger within a row
          var delay = (entry.target.dataset.delay || 0);
          setTimeout(function () { entry.target.classList.add('in'); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      // stagger siblings inside the same grid
      var parent = el.parentElement;
      var siblings = Array.prototype.slice.call(parent.querySelectorAll(':scope > .reveal'));
      var idx = siblings.indexOf(el);
      if (idx > -1) el.dataset.delay = (idx % 3) * 80;
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Close other FAQ items when one opens (accordion behaviour) ---- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Dark / light theme toggle ---- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---- Lead form -> WhatsApp ---- */
  var leadForm = document.getElementById('leadForm');
  if (leadForm) {
    var WHATSAPP_NUMBER = '212601521671'; // <-- بدّل الرقم هنا إيلا تبدّل
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameEl = document.getElementById('leadName');
      var phoneEl = document.getElementById('leadPhone');
      var offerEl = document.getElementById('leadOffer');

      var name = (nameEl && nameEl.value || '').trim();
      var phone = (phoneEl && phoneEl.value || '').trim();
      var offer = (offerEl && offerEl.value || '').trim();

      // بسيطة: تحقق من تعمير الخانات الأساسية
      if (!name) { nameEl.focus(); return; }
      if (!phone) { phoneEl.focus(); return; }

      var msg =
        'السلام، بغيت نطلب تكوين 👇\n' +
        '• الاسم: ' + name + '\n' +
        '• الهاتف: ' + phone + '\n' +
        '• العرض: ' + offer;

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank');
    });
  }

  /* ---- Screenshot lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.getElementById('lightboxClose');

    function openLightbox(src) {
      lightboxImg.setAttribute('src', src);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.setAttribute('src', '');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.tst-shot-thumb').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLightbox(btn.getAttribute('data-full'));
      });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  }

})();
