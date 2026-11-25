/* =========================================================
   AnnaChronique - script partagé
   - en-tête, menu mobile, pied de page (injectés sur chaque page)
   - sélecteur « Où en es-tu dans ta lecture ? » (anti-spoiler)
   - ambiance sonore optionnelle (générée, coupée par défaut)
   - apparitions au défilement (GSAP si disponible)
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) document.documentElement.classList.add('reduced-motion');

  /* ---------- Pages du site ---------- */
  const PAGES = [
    { href: 'index.html', label: 'Accueil' },
    { href: 'saga.html', label: 'La saga' },
    { href: 'personnages.html', label: 'Personnages' },
    { href: 'lieux.html', label: 'Lieux' },
    { href: 'objets.html', label: 'Objets' },
	{ href: 'histoire.html', label: 'Histoire' },
    { href: 'lexique.html', label: 'Dictionnaire' },
    { href: 'vlog.html', label: 'Vlog' },
    { href: 'auteur.html', label: "L'auteur" }
	
  ];

  /* ---------- Niveaux de lecture (anti-spoiler) ----------
     Chaque élément sensible porte data-tome="N".
     Il est masqué si N est supérieur au niveau choisi par le lecteur. */
  const LEVELS = [
    { n: 1, title: 'Exil 1135 · Tome 1', sub: 'Partie 1 disponible' },
    { n: 2, title: 'Exil 1135 · Tome 2', sub: 'À venir' },
    { n: 3, title: 'Exil 1135 · Tome 3', sub: 'À venir' },
    { n: 4, title: 'The Truth Seekers', sub: 'À venir' },
    { n: 5, title: 'Mathilde', sub: 'À venir' },
    { n: 99, title: 'Tout afficher', sub: 'Je ne crains pas les spoilers' }
  ];
  const STORE_KEY = 'annachronique-lecture';

  function getLevel() {
    try {
      const v = parseInt(localStorage.getItem(STORE_KEY), 10);
      return LEVELS.some(l => l.n === v) ? v : 1;
    } catch (e) { return 1; }
  }
  function setLevel(n) {
    try { localStorage.setItem(STORE_KEY, String(n)); } catch (e) { /* stockage indisponible */ }
    applySpoilers(n);
    updateReadingLabel(n);
  }
  function levelTitle(n) {
    const l = LEVELS.find(x => x.n === n);
    return l ? l.title : '';
  }

  function applySpoilers(level) {
    document.querySelectorAll('[data-tome]').forEach(function (el) {
      const t = parseInt(el.getAttribute('data-tome'), 10) || 0;
      const veil = el.querySelector(':scope > .spoiler-veil');
      if (t > level && !el.dataset.forceShow) {
        el.classList.add('is-spoiler');
        if (!veil) {
          // le texte « nu » doit être dans une balise pour pouvoir être flouté
          Array.from(el.childNodes).forEach(function (node) {
            if (node.nodeType === 3 && node.textContent.trim()) {
              const span = document.createElement('span');
              node.parentNode.insertBefore(span, node);
              span.appendChild(node);
            }
          });
          const v = document.createElement('div');
          v.className = 'spoiler-veil';
          // un <span role="button"> plutôt qu'un <button> : le bloc masqué peut lui-même être un lien ou un bouton
          v.innerHTML =
            '<span class="label">Spoiler · révélé dans ' + levelTitle(t) + '</span>' +
            '<span class="veil-btn" role="button" tabindex="0">Afficher quand même</span>';
          const reveal = function (e) {
            e.preventDefault(); e.stopPropagation();
            el.dataset.forceShow = '1';
            el.classList.remove('is-spoiler');
            v.remove();
          };
          const btn = v.querySelector('.veil-btn');
          btn.addEventListener('click', reveal);
          btn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') reveal(e); });
          v.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); });
          el.appendChild(v);
          if (el.offsetHeight && el.offsetHeight < 110) v.classList.add('is-compact');
        }
      } else {
        el.classList.remove('is-spoiler');
        if (veil) veil.remove();
      }
    });
  }

  /* ---------- En-tête ---------- */
  const current = (location.pathname.split('/').pop() || 'index.html');
  const navHTML = PAGES.map(p =>
    '<li><a href="' + p.href + '"' + (p.href === current ? ' aria-current="page"' : '') + '>' + p.label + '</a></li>'
  ).join('');

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML =
    '<a class="brand" href="index.html" aria-label="AnnaChronique - accueil">Anna<span>Chronique</span></a>' +
    '<nav aria-label="Navigation principale"><ul class="nav-links">' + navHTML + '</ul></nav>' +
    '<div class="header-tools">' +
      '<button type="button" class="pill-btn reading-btn" aria-haspopup="dialog">' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V21h16"/></svg>' +
        '<span class="reading-current"></span></button>' +
      '<button type="button" class="pill-btn sound-btn" aria-pressed="false" aria-label="Activer l\'ambiance sonore">' +
        '<span class="sound-bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="sound-label">Son</span></button>' +
      '<button type="button" class="pill-btn menu-btn" aria-expanded="false" aria-controls="menu-overlay">Menu</button>' +
    '</div>';
  document.body.prepend(header);

  const menu = document.createElement('div');
  menu.className = 'menu-overlay';
  menu.id = 'menu-overlay';
  menu.innerHTML =
    '<button type="button" class="pill-btn menu-close">Fermer</button>' +
    '<ol>' + PAGES.map(p => '<li><a href="' + p.href + '">' + p.label + '</a></li>').join('') + '</ol>';
  document.body.appendChild(menu);

  const menuBtn = header.querySelector('.menu-btn');
  function toggleMenu(open) {
    menu.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', () => toggleMenu(true));
  menu.querySelector('.menu-close').addEventListener('click', () => toggleMenu(false));

  // en-tête clair au-dessus des sections de nuit (ouverture de l'accueil)
  const darkHero = document.querySelector('.hero.theme-dark');
  const darkPage = document.body.classList.contains('theme-dark');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
    header.classList.toggle('theme-dark', darkPage || (!!darkHero && window.scrollY < darkHero.offsetHeight - 72));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Fenêtre « Où en es-tu ? » ---------- */
  const dialog = document.createElement('div');
  dialog.className = 'reading-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'reading-title');
  dialog.innerHTML =
    '<div class="reading-panel">' +
      '<span class="label gold">Protection anti-spoiler</span>' +
      '<h2 id="reading-title">Où en es-tu dans ta lecture ?</h2>' +
      '<p>Tout ce qui se passe après ce point sera flouté sur le site. Tu pourras toujours l\'afficher au cas par cas.</p>' +
      '<div class="reading-options">' +
        LEVELS.map(l => '<button type="button" class="reading-option" data-level="' + l.n + '"><span>' + l.title + '</span><small>' + l.sub + '</small></button>').join('') +
      '</div>' +
      '<button type="button" class="pill-btn reading-close">Fermer</button>' +
    '</div>';
  document.body.appendChild(dialog);

  function openDialog() {
    const lvl = getLevel();
    dialog.querySelectorAll('.reading-option').forEach(b => b.classList.toggle('is-active', +b.dataset.level === lvl));
    dialog.classList.add('is-open');
    const active = dialog.querySelector('.reading-option.is-active') || dialog.querySelector('.reading-option');
    active.focus();
  }
  function closeDialog() { dialog.classList.remove('is-open'); }
  dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(); });
  dialog.querySelector('.reading-close').addEventListener('click', closeDialog);
  dialog.querySelectorAll('.reading-option').forEach(b => b.addEventListener('click', function () {
    setLevel(+b.dataset.level);
    closeDialog();
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDialog(); toggleMenu(false); }
  });
  header.querySelector('.reading-btn').addEventListener('click', openDialog);
  document.querySelectorAll('[data-open-reading]').forEach(b => b.addEventListener('click', openDialog));

  function updateReadingLabel(n) {
    const l = LEVELS.find(x => x.n === n);
    header.querySelector('.reading-current').textContent = n === 99 ? 'Sans filtre' : 'Lecture : ' + l.title.replace('Exil 1135 · ', '');
    document.querySelectorAll('[data-reading-label]').forEach(el => { el.textContent = l.title; });
  }

  /* ---------- Pied de page ---------- */
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
    '<div class="container">' +
      '<div class="footer-grid">' +
        '<div><a class="brand" href="index.html">Anna<span>Chronique</span></a>' +
        '<p class="lead" style="margin:0.4rem 0 0;font-size:0.95rem">Le compagnon de lecture de la saga.</p></div>' +
        '<nav aria-label="Pied de page">' + PAGES.map(p => '<a href="' + p.href + '">' + p.label + '</a>').join('') + '</nav>' +
      '</div>' +
      '<p class="footer-note">© AnnaChronique · Tous droits réservés</p>' +
    '</div>';
  document.body.appendChild(footer);

  /* ---------- Ambiance sonore (générée, sans fichier) ---------- */
  let audio = null;
  const soundBtn = header.querySelector('.sound-btn');
  function startSound() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    // bourdon grave (deux notes en quinte)
    [55, 82.4].forEach(function (f, i) {
      const o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = i ? 0.05 : 0.08;
      o.connect(g); g.connect(master); o.start();
    });
    // souffle de vent filtré
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true;
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 420;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 220;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();
    const ng = ctx.createGain(); ng.gain.value = 0.05;
    noise.connect(filter); filter.connect(ng); ng.connect(master); noise.start();
    master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 2);
    audio = { ctx: ctx, master: master };
  }
  soundBtn.addEventListener('click', function () {
    const on = soundBtn.getAttribute('aria-pressed') !== 'true';
    try {
      if (on) {
        if (!audio) startSound(); else { audio.ctx.resume(); audio.master.gain.linearRampToValueAtTime(0.6, audio.ctx.currentTime + 1); }
      } else if (audio) {
        audio.master.gain.linearRampToValueAtTime(0, audio.ctx.currentTime + 0.6);
        setTimeout(() => audio && audio.ctx.suspend(), 700);
      }
    } catch (e) { /* son refusé par le navigateur */ }
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.classList.toggle('sound-on', on);
    soundBtn.setAttribute('aria-label', on ? "Couper l'ambiance sonore" : "Activer l'ambiance sonore");
  });

  /* ---------- Initialisation ---------- */
  const level = getLevel();
  applySpoilers(level);
  updateReadingLabel(level);

  /* ---------- Apparitions au défilement ---------- */
  function initReveals() {
    const items = document.querySelectorAll('.reveal');
    if (reduced) { items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; }); return; }
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      items.forEach(function (el) {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          delay: parseFloat(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });
    } else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.style.transition = 'opacity 900ms cubic-bezier(.16,1,.3,1), transform 900ms cubic-bezier(.16,1,.3,1)';
            en.target.style.opacity = 1; en.target.style.transform = 'none';
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      items.forEach(el => io.observe(el));
    } else {
      items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    }
  }
  initReveals();

  // utilitaires exposés pour les scripts de page
  window.AnnaChronique = { getLevel: getLevel, applySpoilers: applySpoilers, reduced: reduced };
})();
