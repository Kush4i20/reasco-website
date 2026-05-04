(function () {
  'use strict';

  /* ── Nav scroll state ─────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    const update = () => header.classList.toggle('is-scrolled', window.scrollY > 48);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Mobile drawer ────────────────────────────────── */
  const hamburger = document.querySelector('.nav__hamburger');
  const drawer    = document.querySelector('.mobile-drawer');
  if (hamburger && drawer) {
    const overlay = drawer.querySelector('.mobile-drawer__overlay');
    const close   = drawer.querySelector('.mobile-drawer__close');

    const open  = () => { drawer.classList.add('is-open'); hamburger.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
    const shut  = () => { drawer.classList.remove('is-open'); hamburger.classList.remove('is-open'); document.body.style.overflow = ''; };

    hamburger.addEventListener('click', open);
    if (close)   close.addEventListener('click', shut);
    if (overlay) overlay.addEventListener('click', shut);
    document.addEventListener('keydown', e => e.key === 'Escape' && shut());
  }

  /* ── Scroll reveal ────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ── Counter animation ────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.dataset.count, 10);
        const sfx = el.dataset.suffix || '';
        const dur = 1600;
        const t0  = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * end) + sfx;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }

  /* ── FAQ accordion ────────────────────────────────── */
  document.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* ── Contact form ─────────────────────────────────── */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      if (!form.action || form.action.includes(window.location.hostname)) {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet…'; }
        setTimeout(() => {
          form.innerHTML = `
            <div class="form-success is-visible">
              <div class="form-success__icon">✓</div>
              <h3>Nachricht gesendet!</h3>
              <p>Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von 1–2 Werktagen bei Ihnen.</p>
            </div>`;
        }, 700);
      }
    });
  }

  /* ── Active nav link ──────────────────────────────── */
  const path = window.location.pathname.replace(/\/?$/, '/');
  document.querySelectorAll('.nav__link, .mobile-drawer__link').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/?$/, '/');
    if (href && path.endsWith(href)) { a.classList.add('is-active'); a.ariaCurrent = 'page'; }
  });

  /* ── Smooth anchor scroll ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const tgt = document.getElementById(id);
      if (!tgt) return;
      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 12;
      window.scrollTo({ top: tgt.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ── Parallax on mood sections & hero ────────────── */
  const parallaxEls = document.querySelectorAll('.mood-section__bg, .hero__bg');
  if (parallaxEls.length && window.matchMedia('(min-width: 769px)').matches) {
    const onScroll = () => {
      parallaxEls.forEach(el => {
        const rect  = el.closest('section, .hero')?.getBoundingClientRect();
        if (!rect) return;
        const ratio = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        el.style.transform = `translateY(${(ratio - 0.5) * 60}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Image fade-in on load ────────────────────────── */
  document.querySelectorAll('.img-reveal').forEach(img => {
    if (img.complete) {
      img.classList.add('is-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('is-loaded'));
    }
  });

  /* ── Gallery item keyboard accessibility ──────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter') item.querySelector('a')?.click();
    });
  });
})();
