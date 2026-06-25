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

  /* ---- Live-sync with OS theme (only when user hasn't manually chosen) ---- */
  if (window.matchMedia) {
    var schemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    var onSchemeChange = function (e) {
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    if (schemeMq.addEventListener) schemeMq.addEventListener('change', onSchemeChange);
    else if (schemeMq.addListener) schemeMq.addListener(onSchemeChange);
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
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: offer });
      window.open(url, '_blank');
    });
  }

  /* ---- Screenshot carousel + lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');

  function openLightbox(src) {
    if (!lightbox) return;
    lightboxImg.setAttribute('src', src);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.setAttribute('src', '');
    document.body.style.overflow = '';
  }

  if (lightbox) {
    var lightboxClose = document.getElementById('lightboxClose');
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  }

  var track = document.getElementById('tstTrack');
  if (track) {
    function step() {
      var slide = track.querySelector('.tst-slide');
      var gap = 16;
      return slide ? (slide.getBoundingClientRect().width + gap) : 250;
    }
    // arrows (RTL: scrollLeft goes negative toward later items)
    var prevBtn = document.getElementById('tstPrev');
    var nextBtn = document.getElementById('tstNext');
    if (nextBtn) nextBtn.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (prevBtn) prevBtn.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });

    // drag to scroll (mouse)
    var isDown = false, startX = 0, startScroll = 0, moved = false;
    track.addEventListener('mousedown', function (e) {
      isDown = true; moved = false; startX = e.pageX; startScroll = track.scrollLeft;
      track.classList.add('dragging');
    });
    window.addEventListener('mouseup', function () { isDown = false; track.classList.remove('dragging'); });
    window.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      var walk = e.pageX - startX;
      if (Math.abs(walk) > 5) moved = true;
      track.scrollLeft = startScroll - walk;
    });

    // click slide -> open lightbox (unless it was a drag)
    track.querySelectorAll('.tst-slide').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (moved) { e.preventDefault(); return; }
        openLightbox(btn.getAttribute('data-full'));
      });
    });
  }

  /* ---- Offers floating CTA (show on scroll, hide on pricing) ---- */
  var offersFloat = document.getElementById('offersFloat');
  if (offersFloat) {
    var pricingSec = document.getElementById('pricing');
    var pricingVisible = false;
    var pricingSeen = false;

    function updateOffersFloat() {
      var scrolledEnough = window.scrollY > 300;
      if (scrolledEnough && !pricingVisible) offersFloat.classList.add('show');
      else offersFloat.classList.remove('show');
    }

    if ('IntersectionObserver' in window && pricingSec) {
      new IntersectionObserver(function (entries) {
        pricingVisible = entries[0].isIntersecting;
        if (pricingVisible && !pricingSeen) {
          pricingSeen = true;
          if (typeof window.fbq === 'function') window.fbq('trackCustom', 'ViewPricing');
        }
        updateOffersFloat();
      }, { threshold: 0.12 }).observe(pricingSec);
    }

    window.addEventListener('scroll', updateOffersFloat, { passive: true });
    updateOffersFloat();
  }

  /* ---- Hero video: lazy-load YouTube only on click (keeps LP fast) ---- */
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    var ytId = heroVideo.getAttribute('data-yt');
    // show the real video thumbnail as the facade background (if id provided)
    if (ytId) {
      heroVideo.style.backgroundImage = "url('https://img.youtube.com/vi/" + ytId + "/hqdefault.jpg')";
      heroVideo.style.backgroundSize = 'cover';
      heroVideo.style.backgroundPosition = 'center';
    }
    function loadHeroVideo() {
      var id = heroVideo.getAttribute('data-yt');
      if (!id) return; // مازال ما تحطّش معرّف الفيديو
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      iframe.title = 'فيديو تعريفي بالتكوين';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      heroVideo.innerHTML = '';
      heroVideo.appendChild(iframe);
      if (typeof window.fbq === 'function') window.fbq('trackCustom', 'VideoPlay');
    }
    heroVideo.addEventListener('click', loadHeroVideo);
    heroVideo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadHeroVideo(); }
    });
  }

  /* ---- Meta Pixel: detailed event tracking ---- */
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (typeof window.fbq !== 'function') return;
      if (a.classList.contains('price-btn')) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: a.getAttribute('data-offer') || '',
          value: parseFloat(a.getAttribute('data-value')) || 0,
          currency: 'MAD'
        });
      } else {
        window.fbq('track', 'Contact');
      }
    });
  });

  /* ---- Countdown timer (real deadline) ---- */
  var cd = document.getElementById('countdown');
  if (cd) {
    var endTime = new Date(cd.getAttribute('data-end')).getTime();
    var pad = function (v) { return (v < 10 ? '0' : '') + v; };
    var setCd = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = pad(v); };
    var tick = function () {
      var diff = endTime - Date.now();
      if (diff <= 0) {
        cd.innerHTML = '<span class="cd-ended">انتهى العرض الخاص — رجعات الأثمنة للعادي</span>';
        clearInterval(cdTimer);
        return;
      }
      setCd('cd-days', Math.floor(diff / 86400000));
      setCd('cd-hours', Math.floor((diff % 86400000) / 3600000));
      setCd('cd-mins', Math.floor((diff % 3600000) / 60000));
      setCd('cd-secs', Math.floor((diff % 60000) / 1000));
    };
    tick();
    var cdTimer = setInterval(tick, 1000);
  }

  /* ---- Touch / click glow ripple ---- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    document.addEventListener('pointerdown', function (e) {
      var g = document.createElement('div');
      g.className = 'touch-glow';
      g.style.left = e.clientX + 'px';
      g.style.top = e.clientY + 'px';
      document.body.appendChild(g);
      setTimeout(function () { g.remove(); }, 950);
    }, { passive: true });
  }

  /* ---- Stats count-up ---- */
  var statNums = document.querySelectorAll('.stat-num[data-count]');
  if (statNums.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400, start = null;
      var fmt = function (v) {
        return prefix + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      };
      var animate = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased);
        if (p < 1) requestAnimationFrame(animate);
        else el.textContent = fmt(target);
      };
      requestAnimationFrame(animate);
    };
    if ('IntersectionObserver' in window) {
      var statIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCount(entry.target); statIO.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      statNums.forEach(function (el) { statIO.observe(el); });
    } else {
      statNums.forEach(runCount);
    }
  }

  /* ---- WhatsApp helper bubble (pops up after 10s + notification sound) ---- */
  var waBubble = document.getElementById('waBubble');
  if (waBubble) {
    var waBubbleClose = document.getElementById('waBubbleClose');
    var bubbleDismissed = false;
    try { bubbleDismissed = sessionStorage.getItem('waBubbleDismissed') === '1'; } catch (e) {}

    // --- audio: unlock on first user gesture (browser autoplay policy) ---
    var audioCtx = null;
    var ensureAudio = function () {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
      } catch (e) { audioCtx = null; }
    };
    ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) {
      window.addEventListener(ev, ensureAudio, { once: true, passive: true });
    });
    var playNotif = function () {
      if (!audioCtx || audioCtx.state !== 'running') return;
      try {
        var now = audioCtx.currentTime;
        [{ f: 880, t: 0 }, { f: 1318.5, t: 0.12 }].forEach(function (n) {
          var osc = audioCtx.createOscillator();
          var gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.value = n.f;
          osc.connect(gain); gain.connect(audioCtx.destination);
          var s = now + n.t;
          gain.gain.setValueAtTime(0.0001, s);
          gain.gain.exponentialRampToValueAtTime(0.16, s + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, s + 0.33);
          osc.start(s);
          osc.stop(s + 0.38);
        });
      } catch (e) {}
    };

    var hideBubble = function () {
      waBubble.classList.remove('show');
      waBubble.setAttribute('aria-hidden', 'true');
      try { sessionStorage.setItem('waBubbleDismissed', '1'); } catch (e) {}
    };

    if (!bubbleDismissed) {
      setTimeout(function () {
        waBubble.classList.add('show');
        waBubble.setAttribute('aria-hidden', 'false');
        ensureAudio();
        playNotif();
      }, 10000);
    }

    if (waBubbleClose) {
      waBubbleClose.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation(); hideBubble();
      });
    }
    var bubbleLink = waBubble.querySelector('.wa-bubble-link');
    if (bubbleLink) bubbleLink.addEventListener('click', hideBubble);
  }

  /* ---- Track program PDF downloads (Pixel) ---- */
  document.querySelectorAll('.price-pdf').forEach(function (a) {
    a.addEventListener('click', function () {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'DownloadProgram', { content_name: a.getAttribute('data-offer') || '' });
      }
    });
  });

  /* ---- Scroll-depth + key-section tracking (find where visitors drop off) ---- */
  (function () {
    function fire(name, params) {
      if (typeof window.fbq === 'function') window.fbq('trackCustom', name, params || {});
    }

    /* Scroll depth: 25 / 50 / 75 / 90 % — each fired once */
    var marks = [25, 50, 75, 90], hit = {};
    function onDepth() {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var pct = (window.scrollY / scrollable) * 100;
      for (var i = 0; i < marks.length; i++) {
        if (pct >= marks[i] && !hit[marks[i]]) {
          hit[marks[i]] = true;
          fire('ScrollDepth', { percent: marks[i] });
        }
      }
      if (Object.keys(hit).length === marks.length) {
        window.removeEventListener('scroll', onDepth);
      }
    }
    window.addEventListener('scroll', onDepth, { passive: true });
    onDepth();

    /* Key funnel sections actually reached — each fired once */
    if ('IntersectionObserver' in window) {
      var ids = ['comparison', 'testimonials', 'faq', 'register'];
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            fire('ViewSection', { section: en.target.id });
            obs.unobserve(en.target);
          }
        });
      }, { threshold: 0.35 });
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) obs.observe(el);
      });
    }
  })();

})();
