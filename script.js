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

  /* ---- Mobile: smooth collapsible pricing feature lists (open on desktop) ---- */
  (function () {
    var details = document.querySelectorAll('.price-details');
    if (!details.length || !window.matchMedia) return;
    var mq = window.matchMedia('(max-width: 768px)');

    function apply() {
      details.forEach(function (d) { d.open = !mq.matches; });
    }
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply);

    details.forEach(function (d) {
      var sum = d.querySelector('summary');
      var wrap = d.querySelector('.price-feats-wrap');
      if (!sum || !wrap) return;

      sum.addEventListener('click', function (e) {
        if (!mq.matches) return;             // desktop: features always shown
        e.preventDefault();
        if (wrap.dataset.animating) return;
        wrap.dataset.animating = '1';

        function onEnd(done) {
          wrap.addEventListener('transitionend', function te(ev) {
            if (ev.propertyName !== 'height') return;
            wrap.removeEventListener('transitionend', te);
            delete wrap.dataset.animating;
            done();
          });
        }

        if (d.open) {
          wrap.style.height = wrap.scrollHeight + 'px';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { wrap.style.height = '0px'; });
          });
          onEnd(function () { d.open = false; wrap.style.height = ''; });
        } else {
          d.open = true;
          var target = wrap.scrollHeight;
          wrap.style.height = '0px';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { wrap.style.height = target + 'px'; });
          });
          onEnd(function () { wrap.style.height = ''; });
        }
      });
    });
  })();

  /* ---- Hero: interactive floating SPSS/stats elements ---- */
  (function () {
    var layer = document.getElementById('heroFloat');
    var hero = document.getElementById('hero');
    if (!layer || !hero) return;

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isTouch = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

    var TERMS = [
      { t: 'SPSS', c: 'hf-b', s: 2.3 }, { t: 'IA', c: 'hf-t', s: 2.0 },
      { t: '\u03C7\u00B2', c: 'hf-t', s: 1.6 }, { t: 't-test', c: 'hf-b', s: 1.35 },
      { t: 'p < 0.05', c: 'hf-t', s: 1.5 }, { t: 'ANOVA', c: 'hf-b', s: 1.35 },
      { t: 'R\u00B2', c: 'hf-t', s: 1.7 }, { t: '\u03A3', c: 'hf-b', s: 2.1 },
      { t: 'r\u00E9gression', c: 'hf-b', s: 1.2 }, { t: 'Alpha de Cronbach', c: 'hf-t', s: 1.1 },
      { t: 'corr\u00E9lation', c: 'hf-b', s: 1.25 }, { t: '\u03C3', c: 'hf-t', s: 1.9 },
      { t: 'Q&A', c: 'hf-b', s: 1.45 }, { t: 'm\u00E9diane', c: 'hf-t', s: 1.15 },
      { t: '\u00B5', c: 'hf-b', s: 1.8 }, { t: 'histogramme', c: 'hf-t', s: 1.1 },
      { t: 'hypoth\u00E8se', c: 'hf-b', s: 1.2 }, { t: '\u0251 = .87', c: 'hf-t', s: 1.3 },
      { t: 'questionnaire', c: 'hf-b', s: 1.1 }, { t: 'F-test', c: 'hf-t', s: 1.3 },
      { t: '\u00E9cart-type', c: 'hf-b', s: 1.15 }, { t: 'n = 384', c: 'hf-t', s: 1.4 },
      { t: 'fiabilit\u00E9', c: 'hf-b', s: 1.15 }, { t: 'p-value', c: 'hf-t', s: 1.35 }
    ];

    var count = isTouch ? 13 : TERMS.length;
    var W = hero.clientWidth, H = hero.clientHeight;
    var items = [];
    var rand = function (a, b) { return a + Math.random() * (b - a); };

    for (var i = 0; i < count; i++) {
      var spec = TERMS[i % TERMS.length];
      var el = document.createElement('span');
      el.className = 'hf ' + spec.c;
      el.textContent = spec.t;
      el.style.fontSize = spec.s + 'rem';
      layer.appendChild(el);
      var w = el.offsetWidth, h = el.offsetHeight;
      items.push({
        el: el, w: w, h: h,
        x: rand(0, Math.max(1, W - w)), y: rand(0, Math.max(1, H - h)),
        vx: rand(-0.35, 0.35) || 0.2, vy: rand(-0.35, 0.35) || 0.2,
        ox: 0, oy: 0
      });
    }

    // pointer / tilt / scroll state
    var pointer = { x: -9999, y: -9999, active: false };
    var tilt = { ax: 0, ay: 0 };
    var scrollKick = 0, lastScroll = window.pageYOffset;
    var REPEL_R = 130, REPEL_F = 0.9;

    function place(it) {
      it.el.style.transform = 'translate3d(' + (it.x + it.ox) + 'px,' + (it.y + it.oy) + 'px,0)';
    }

    if (reduced) {
      // static, no motion
      items.forEach(place);
      return;
    }

    function tick() {
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        // drift + tilt acceleration
        it.vx += tilt.ax;
        it.vy += tilt.ay + scrollKick;
        // gentle damping + keep a minimum life
        it.vx *= 0.992; it.vy *= 0.992;
        if (Math.abs(it.vx) < 0.05) it.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(it.vy) < 0.05) it.vy += (Math.random() - 0.5) * 0.05;
        // clamp speed
        var sp = Math.hypot(it.vx, it.vy), MAX = 1.7;
        if (sp > MAX) { it.vx = it.vx / sp * MAX; it.vy = it.vy / sp * MAX; }

        it.x += it.vx; it.y += it.vy;

        // bounce off section edges (roam everywhere)
        if (it.x < 0) { it.x = 0; it.vx = Math.abs(it.vx); }
        else if (it.x > W - it.w) { it.x = W - it.w; it.vx = -Math.abs(it.vx); }
        if (it.y < 0) { it.y = 0; it.vy = Math.abs(it.vy); }
        else if (it.y > H - it.h) { it.y = H - it.h; it.vy = -Math.abs(it.vy); }

        // mouse repel (desktop)
        var tox = 0, toy = 0;
        if (pointer.active) {
          var cx = it.x + it.w / 2, cy = it.y + it.h / 2;
          var dx = cx - pointer.x, dy = cy - pointer.y;
          var dist = Math.hypot(dx, dy);
          if (dist < REPEL_R && dist > 0.01) {
            var force = (1 - dist / REPEL_R) * REPEL_R * REPEL_F;
            tox = (dx / dist) * force; toy = (dy / dist) * force;
          }
        }
        // smooth the offset
        it.ox += (tox - it.ox) * 0.12;
        it.oy += (toy - it.oy) * 0.12;

        place(it);
      }
      scrollKick *= 0.9;
      if (Math.abs(scrollKick) < 0.002) scrollKick = 0;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // ----- desktop: mouse interaction -----
    if (!isTouch) {
      hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
        pointer.active = true;
      });
      hero.addEventListener('mouseleave', function () { pointer.active = false; });
    }

    // ----- scroll interaction (stirs the elements) -----
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset;
      var d = y - lastScroll; lastScroll = y;
      scrollKick += Math.max(-0.5, Math.min(0.5, d * 0.02));
    }, { passive: true });

    // ----- mobile: device tilt -----
    function onTilt(e) {
      var g = e.gamma || 0; // left-right [-90,90]
      var b = e.beta || 0;  // front-back [-180,180]
      tilt.ax = Math.max(-1, Math.min(1, g / 45)) * 0.06;
      tilt.ay = Math.max(-1, Math.min(1, (b - 45) / 45)) * 0.06;
    }
    function enableTilt() {
      window.addEventListener('deviceorientation', onTilt, true);
    }
    if (isTouch && window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ needs a gesture-triggered permission request
        var ask = function () {
          DeviceOrientationEvent.requestPermission().then(function (state) {
            if (state === 'granted') enableTilt();
          }).catch(function () {});
          window.removeEventListener('touchend', ask);
        };
        window.addEventListener('touchend', ask, { once: true });
      } else {
        enableTilt();
      }
    }

    // ----- keep bounds on resize -----
    window.addEventListener('resize', function () {
      W = hero.clientWidth; H = hero.clientHeight;
      items.forEach(function (it) {
        if (it.x > W - it.w) it.x = Math.max(0, W - it.w);
        if (it.y > H - it.h) it.y = Math.max(0, H - it.h);
      });
    });
  })();

})();
