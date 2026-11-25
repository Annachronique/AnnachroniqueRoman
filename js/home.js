/* =========================================================
   AnnaChronique - animations de la page d'accueil
   ========================================================= */
(function () {
  'use strict';
  const reduced = window.AnnaChronique && window.AnnaChronique.reduced;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Ciel étoilé ---------- */
  const canvas = document.getElementById('stars');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(canvas.offsetWidth * canvas.offsetHeight / 4200);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight * 0.75,
        r: Math.random() * 1.2 + 0.2,
        p: Math.random() * Math.PI * 2,
        s: 0.4 + Math.random() * 1.2
      }));
    }
    function draw(t) {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const st of stars) {
        const a = reduced ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(st.p + t / 1000 * st.s));
        ctx.fillStyle = 'rgba(244, 235, 217,' + a.toFixed(2) + ')';
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduced) requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
  }

  /* ---------- Chargement : compteur d'années jusqu'à 1135 ---------- */
  const loader = document.getElementById('loader');
  const yearEl = document.getElementById('loader-year');
  const fill = document.getElementById('loader-fill');
  let seen = false;
  try { seen = sessionStorage.getItem('annachronique-intro') === '1'; } catch (e) { /* ignore */ }

  function heroIntro() {
    if (!hasGsap || reduced) return;
    gsap.from('.hero-title .line > span', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.12 });
    gsap.from('.hero-kicker, .hero-sub, .hero-actions', { opacity: 0, y: 24, duration: 1.1, ease: 'expo.out', stagger: 0.1, delay: 0.35 });
    gsap.from('.hero-bg img', { scale: 1.15, duration: 2.2, ease: 'expo.out' });
  }

  if (!loader || seen || reduced || !hasGsap) {
    if (loader) loader.remove();
    heroIntro();
  } else {
    document.body.style.overflow = 'hidden';
    const now = new Date().getFullYear();
    const counter = { y: now };
    yearEl.textContent = now;
    gsap.timeline({
      onComplete: function () {
        try { sessionStorage.setItem('annachronique-intro', '1'); } catch (e) { /* ignore */ }
        document.body.style.overflow = '';
        loader.remove();
        ScrollTrigger.refresh();
      }
    })
      .to(counter, {
        y: 1135, duration: 2.2, ease: 'power3.inOut',
        onUpdate: () => { yearEl.textContent = Math.round(counter.y); }
      }, 0)
      .to(fill, { clipPath: 'inset(0 0% 0 0)', duration: 2.2, ease: 'power3.inOut' }, 0)
      .to('.loader-inner', { scale: 1.06, opacity: 0, duration: 0.6, ease: 'power2.in' }, 2.5)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, 2.7)
      .add(heroIntro, 2.85);
  }

  /* ---------- Parallaxe du paysage ---------- */
  if (hasGsap && !reduced) {
    const parallax = [['.hero-bg img', 14], ['.hero-content', 22]];
    parallax.forEach(function (p) {
      gsap.to(p[0], { yPercent: p[1], ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  /* ---------- Le livre au centre, les étapes autour ---------- */
  const story = document.querySelector('.book-story');
  const steps = document.querySelectorAll('.story-step');
  const dots = document.querySelectorAll('.story-dots button');

  function setDot(i) { dots.forEach((d, k) => d.classList.toggle('is-active', k === i)); }

  if (!hasGsap || reduced) {
    story.classList.add('static-story');
  } else {
    setDot(0);
    const n = steps.length;
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      scrollTrigger: {
        trigger: '.book-stage',
        start: 'top top',
        end: '+=' + (n * 85) + '%',
        pin: true,
        scrub: 0.8,
        onUpdate: function (self) { setDot(Math.min(n - 1, Math.floor(self.progress * n * 0.999))); }
      }
    });
    // rotation continue du livre pendant tout le passage
    tl.fromTo('#book',
      { rotateY: -32, rotateX: 8, y: 20 },
      { rotateY: 28, rotateX: -4, y: -10, duration: n, ease: 'none' }, 0);
    // fondu entre les étapes
    for (let i = 1; i < n; i++) {
      tl.to(steps[i - 1], { autoAlpha: 0, y: -40, duration: 0.35 }, i - 0.45)
        .fromTo(steps[i], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35 }, i - 0.2);
    }
    // clic sur les pastilles
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        const st = tl.scrollTrigger;
        const target = st.start + (st.end - st.start) * ((i + 0.05) / n);
        window.scrollTo({ top: target, behavior: 'smooth' });
      });
    });
  }

  /* ---------- Image de l'accroche : parallaxe dans son cadre ---------- */
  if (hasGsap && !reduced) {
    gsap.fromTo('#tagline-img', { yPercent: -12 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.tagline-band', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.from('.tagline-frame', { clipPath: 'inset(12% 12% 12% 12% round 14px)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.tagline-frame', start: 'top 80%' } });
  }

  /* ---------- Galerie : défilement horizontal (grand écran) ---------- */
  if (hasGsap && !reduced) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', function () {
      const track = document.getElementById('cast-track');
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: '.cast',
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });
    });
  }

  /* ---------- Carnet de croquis : agrandissement ---------- */
  const zm = document.getElementById('zoom-modal');
  if (zm) {
    const close = () => { zm.classList.remove('is-open'); document.body.style.overflow = ''; };
    document.addEventListener('click', function (e) {
      const z = e.target.closest('[data-zoom]');
      if (z) {
        document.getElementById('zoom-img').src = z.dataset.zoom;
        document.getElementById('zoom-img').alt = z.dataset.caption || '';
        document.getElementById('zoom-cap').textContent = z.dataset.caption || '';
        zm.classList.add('is-open'); document.body.style.overflow = 'hidden';
        zm.querySelector('.zoom-close').focus();
      }
    });
    zm.addEventListener('click', e => { if (e.target === zm) close(); });
    zm.querySelector('.zoom-close').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // recalcul après chargement des polices
  if (hasGsap && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();
