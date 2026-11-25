/* =========================================================
   AnnaChronique - dossiers des personnages
   Les données sont dans js/personnages-data.js (window.PERSONNAGES, window.DOCUMENTS).
   ========================================================= */
(function () {
  'use strict';

  const DATA = window.PERSONNAGES || [];
  const DOCS = window.DOCUMENTS || {};

  const GROUPS = {
    voyageurs: { label: 'Voyageurs & équipe', long: 'Les voyageurs du XXIe siècle', accent: 'var(--tertiary)', stamp: 'Voyageur' },
    xii: { label: 'XIIe siècle', long: 'Saint-Marcel, Périgord & Aquitaine', accent: 'var(--primary)', stamp: 'Archives 1135' },
    jullian: { label: 'Dynastie Jullian', long: 'La dynastie Jullian (1137–1240)', accent: 'var(--crimson)', stamp: 'Maison Jullian' },
    '2032': { label: 'Enquête 2032', long: "L'enquête contemporaine (2032)", accent: '#5e4c37', stamp: 'Dossier 2032' }
  };

  const byId = {};
  DATA.forEach(c => { byId[c.id] = c; });

  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const tomeAttr = t => (t && t > 1 ? ' data-tome="' + t + '"' : '');
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const level = () => window.AnnaChronique.getLevel();
  const refresh = () => window.AnnaChronique.applySpoilers(level());

  /* ---------- Registre ---------- */
  let currentGroup = 'voyageurs';
  const tabs = document.getElementById('registre-tabs');
  const list = document.getElementById('registre-list');
  const search = document.getElementById('registre-search');
  const ORDER = ['voyageurs', 'xii', 'jullian', '2032'];

  tabs.innerHTML = ORDER.map(k =>
    '<button type="button" class="reg-tab" data-group="' + k + '" style="--accent:' + GROUPS[k].accent + '">' + GROUPS[k].label +
    ' <small>' + DATA.filter(c => c.group === k).length + '</small></button>').join('');

  function renderList() {
    const q = norm(search.value.trim());
    const rows = DATA.filter(c => q ? norm(c.name + ' ' + c.role).includes(q) : c.group === currentGroup);
    list.innerHTML = rows.map(c => {
      // On prend la toute 1ère image grâce à .at(0)
      const thumb = Array.isArray(c.portrait) ? c.portrait.at(0) : c.portrait;
      return '<div class="reg-item-wrap"' + tomeAttr(c.min) + '><button type="button" class="reg-item" data-id="' + c.id + '" style="--accent:' + GROUPS[c.group].accent + '">' +
        (thumb ? '<img class="reg-thumb" src="' + esc(thumb) + '" alt="">' : '<span class="crest crest-sm" data-initial="' + esc(c.initial) + '"></span>') +
        '<span><strong>' + esc(c.name) + '</strong><small>' + esc(c.role) + '</small></span></button></div>';
    }).join('') || '<p class="reg-empty">Aucun personnage trouvé.</p>';
    tabs.querySelectorAll('.reg-tab').forEach(b => b.classList.toggle('is-active', !q && b.dataset.group === currentGroup));
    markActive();
    refresh();
  }

  function markActive() {
    list.querySelectorAll('.reg-item').forEach(b => {
      const on = b.dataset.id === currentId;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-current', on ? 'true' : 'false');
    });
  }

  tabs.addEventListener('click', e => {
    const b = e.target.closest('.reg-tab'); if (!b) return;
    currentGroup = b.dataset.group; search.value = ''; renderList();
  });
  search.addEventListener('input', renderList);

  /* ---------- Illustrations dessinées ---------- */
  function silhouette() {
    return '<svg viewBox="0 0 200 240" class="silhouette" aria-hidden="true">' +
      '<rect width="200" height="240" fill="#d9c49a"/>' +
      '<path d="M100 40 C128 40 142 62 142 88 C142 118 124 140 100 140 C76 140 58 118 58 88 C58 62 72 40 100 40 Z M30 240 C34 186 64 160 100 160 C136 160 166 186 170 240 Z" fill="#3b2a1a" opacity="0.8"/>' +
      '<text x="100" y="104" text-anchor="middle" font-family="EB Garamond, serif" font-size="52" fill="#d9c49a" opacity="0.6">?</text></svg>';
  }

  const XG = '<defs><filter id="xg"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  const BONE = 'fill="#0d181e" stroke="rgba(160,230,240,0.85)" stroke-width="2" filter="url(#xg)"';
  const CRACK = 'stroke="#ff5a63" stroke-width="2.5" fill="none" stroke-linecap="round"';

  const XRAY = {
    jambe: XG + '<g ' + BONE + '><path d="M110 0 L122 0 L120 260 L108 260 Z"/><path d="M132 0 L140 0 L136 260 L132 0 Z"/><path d="M142 10 L148 10 L150 260 L142 260 Z" opacity="0.6"/></g>' +
      '<path d="M96 120 L112 112 L104 126 L124 118 L118 132 L136 126" ' + CRACK + '/><circle cx="116" cy="122" r="26" fill="none" stroke="#ff5a63" stroke-dasharray="4 3"/>',
    bras: XG + '<g ' + BONE + '><path d="M60 20 C74 10 92 14 96 28 L104 120 C110 130 104 142 94 140 C86 140 80 132 84 122 L74 34 C70 30 62 28 60 20 Z"/>' +
      '<path d="M96 138 L176 222 L168 230 L88 148 Z"/><path d="M88 148 L164 238 L156 244 L82 156 Z" opacity="0.7"/></g>' +
      '<path d="M86 70 L96 78 L88 84 L98 92" ' + CRACK + '/><circle cx="92" cy="80" r="22" fill="none" stroke="#ff5a63" stroke-dasharray="4 3"/>',
    visage: XG + '<g ' + BONE + '><path d="M120 24 C170 24 196 62 194 106 C192 136 178 150 170 164 L166 196 C150 210 128 214 110 206 L102 180 C86 178 72 168 68 150 L58 140 L68 124 C60 96 64 60 84 40 C94 30 106 24 120 24 Z"/>' +
      '<ellipse cx="146" cy="104" rx="16" ry="13" fill="#0b1114"/><path d="M104 140 L116 150 L108 156" fill="none"/></g>' +
      '<path d="M156 128 L168 136 L160 142 L172 150" ' + CRACK + '/><circle cx="164" cy="140" r="22" fill="none" stroke="#ff5a63" stroke-dasharray="4 3"/>'
  };

  const xray = type => '<svg viewBox="0 0 240 260" class="xray-svg" aria-hidden="true">' + (XRAY[type] || XRAY.jambe) + '</svg>';

  /* ---------- Rendu d'un dossier ---------- */
  const view = document.getElementById('dossier');
  let currentId = null;

  function paragraphs(items) {
    return items.map(p => '<div class="para"' + tomeAttr(p[1]) + '><p>' + esc(p) + '</p></div>').join('');
  }

  function render(id) {
    const c = byId[id] || DATA;
    currentId = c.id;
    const G = GROUPS[c.group];
    const wanted = c.poster === 'recherche';
    const num = 'AC-' + String(c.n).padStart(2, '0');
     const portraits = Array.isArray(c.portrait) ? c.portrait : (c.portrait ? [c.portrait] : []);
    let portrait = silhouette();
    if (portraits.length > 1) {
      portrait = '<div class="portrait-slider" data-idx="0">' +
        portraits.map((src, i) =>
          '<button type="button" class="poster-img slide-item ' + (i === 0 ? 'is-active' : '') + '" data-zoom="' + esc(src) + '" data-caption="' + esc(c.name) + '">' +
            '<img src="' + esc(src) + '" alt="Portrait de ' + esc(c.name) + '">' +
          '</button>'
        ).join('') +
        '<button type="button" class="slider-btn prev">‹</button>' +
        '<button type="button" class="slider-btn next">›</button>' +
      '</div>';
    } else if (portraits.length === 1) {
      portrait = '<button type="button" class="poster-img" data-zoom="' + esc(portraits[0]) + '" data-caption="' + esc(c.name) + '"><img src="' + esc(portraits[0]) + '" alt="Portrait de ' + esc(c.name) + '"></button>';
    }

    const hasStar = c.ident.some(r => String(r[1]).includes('*'));

    /* État civil à droite avec le style épuré */
    const civil = c.ident.map(f => '<div class="poster-field"' + tomeAttr(f[2]) + '><span class="civil-lbl">' + esc(f[0]) + '</span><b class="civil-val">' + esc(f[1]) + '</b></div>').join('');

    /* Bloc Radio OU Image d'illustration alternative */
    let radioHtml = '';

    if (c.radio && c.radio.length) {
      // Cas 1 : Présence d'une blessure documentée -> Affichage de la radiographie
      radioHtml = '<section class="radio-block"><h3 class="label">Radiographie</h3>' +
        c.radio.map(r => 
          '<div class="xray"' + tomeAttr(r.tome) + '>' +
            '<div class="xray-film">' + xray(r.type) + '<span class="xray-tag">' + esc(r.zone.toUpperCase()) + '</span></div>' +
            '<div class="xray-notes"><span class="label">' + esc(r.zone) + ' · ' + esc(r.date) + '</span><p>' + esc(r.desc) + '</p></div>' +
          '</div>'
        ).join('') +
      '</section>';
    } else if (c.altImage) {
      // Cas 2 : Pas de blessure, mais une image alternative est définie (avec son titre)
      radioHtml = '<section class="alt-image-block card">' +
        '<h3 class="label">' + esc(c.altImage.title || 'Illustration') + '</h3>' +
        '<figure class="alt-figure">' +
          '<button type="button" data-zoom="' + esc(c.altImage.src) + '" data-caption="' + esc(c.altImage.title || '') + '">' +
            '<img src="' + esc(c.altImage.src) + '" alt="' + esc(c.altImage.title || '') + '" loading="lazy">' +
          '</button>' +
        '</figure>' +
      '</section>';
    }
      const rel = (c.rel || []).map(r => {
      const o = byId[r];
      if (!o) return '';
      // On prend aussi la 1ère image pour la vignette de relation
      const thumbRel = Array.isArray(o.portrait) ? o.portrait.at(0) : o.portrait;
      return '<button type="button" class="rel-chip"' + tomeAttr(r[1]) + ' data-jump="' + o.id + '">' +
        (thumbRel
          ? '<img class="rel-thumb" src="' + esc(thumbRel) + '" alt="">'
          : '<span class="crest crest-xs" data-initial="' + esc(o.initial) + '"></span>') +
        '<span>' + esc(r[2]) + ' <strong>' + esc(o.name) + '</strong></span>' +
      '</button>';
    }).join('');

    const time = c.parcours.map(e => '<li' + tomeAttr(e[2]) + '>' + (e ? '<span class="label">' + esc(e) + '</span>' : '') + '<p>' + esc(e[1]) + '</p></li>').join('');

    const pieces = c.pieces.filter(p => DOCS[p]).map(p =>
      '<div class="piece-wrap"' + tomeAttr(DOCS[p].tome) + '><button type="button" class="piece" data-doc="' + p + '"><span class="piece-icon" aria-hidden="true"></span><span>' + esc(DOCS[p].title) + '</span></button></div>').join('');

     /* ---------- Illustrations de la fiche ---------- */
    const illus = (c.illus || []).map(il => {
      // Si "il" est un tableau [image, légende, tome], on extrait chaque valeur
      const src = Array.isArray(il) ? il.at(0) : il;
      const leg = Array.isArray(il) && il.at(1) ? il.at(1) : '';
      const tome = Array.isArray(il) && il.at(2) ? il.at(2) : null;

      return '<div class="illu"' + tomeAttr(tome) + '>' +
        '<button type="button" class="illu-btn" data-zoom="' + esc(src) + '" data-caption="' + esc(leg) + '">' +
          '<img src="' + esc(src) + '" alt="' + esc(leg) + '" loading="lazy">' +
        '</button>' +
        (leg ? '<p class="illu-caption">' + esc(leg) + '</p>' : '') +
      '</div>';
    }).join('');

    view.innerHTML =
      '<div class="dossier-inner"' + tomeAttr(c.min) + ' style="--accent:' + G.accent + '">' +
        '<header class="dossier-head">' +
          '<span class="label" style="color:' + G.accent + '">' + G.long + ' · Dossier ' + num + '</span>' +
          '<h2>' + esc(c.name) + '</h2><p class="dossier-role">' + esc(c.role) + '</p>' +
          (c.link ? '<a class="btn btn-ghost" href="' + c.link + '">' + esc(c.link[1]) + '</a>' : '') +
        '</header>' +
        '<div class="dossier-grid">' +
          /* Colonne de gauche : portrait seul, épuré de tout doublon */
          '<figure class="poster ' + (wanted ? 'is-wanted' : '') + '">' +
            '<p class="poster-title">' + (wanted ? 'Avis de recherche' : 'Signalement') + '</p>' +
            '<p class="poster-sub">' + (wanted ? 'Personne disparue en juillet 2023' : 'Archives AnnaChronique') + '</p>' +
            '<div class="poster-portrait">' + portrait + '</div>' +
            '<p class="poster-name">' + esc(c.name) + '</p>' +
            '<span class="poster-stamp">' + esc(c.stamp || (['sylvie', 'laura'].includes(c.id) ? 'Équipe de recherche' : G.stamp)) + '</span>' +
            '<figcaption class="poster-foot">AnnaChronique · ' + num + '</figcaption>' +
          '</figure>' +
          /* Colonne de droite : état civil avec la classe poster-fields */
          '<div class="dossier-side">' +
            '<section class="civil card"><h3 class="label">État civil</h3><div class="poster-fields">' + civil + '</div>' +
              (hasStar ? '<p class="star-note">* Reconstitution déduite, non canonique.</p>' : '') + '</section>' +
            radioHtml +
          '</div>' +
        '</div>' +
        '<div class="dossier-text">' +
          '<section><h3 class="label">Description physique</h3>' + paragraphs(c.physique) + '</section>' +
          '<section><h3 class="label">Personnalité</h3>' + paragraphs(c.perso) + '</section>' +
        '</div>' +
        '<div class="dossier-bottom">' +
          '<section><h3 class="label">Parcours</h3><ol class="dossier-timeline">' + time + '</ol></section>' +
          '<section>' +
            (rel ? '<h3 class="label">Relations</h3><div class="rel-grid">' + rel + '</div>' : '') +
            (pieces ? '<h3 class="label sub">Pièces du dossier</h3><div class="pieces">' + pieces + '</div>' : '') +
          '</section>' +
        '</div>' +
        (illus ? '<div class="card card-illus"><h3 class="label">Illustrations</h3><div class="illus-grid">' + illus + '</div></div>' : '');

    markActive();
    refresh();

    if (window.gsap && !window.AnnaChronique.reduced) {
      gsap.fromTo('.dossier-head, .dossier-side, .dossier-text, .dossier-bottom', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05 });
      gsap.fromTo('.poster', { opacity: 0, y: -30, rotate: -6 }, { opacity: 1, y: 0, rotate: -1.5, duration: 0.9, ease: 'back.out(1.4)' });
    }
  }
  view.querySelectorAll('.slider-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const slider = btn.closest('.portrait-slider');
        const slides = slider.querySelectorAll('.slide-item');
        let idx = parseInt(slider.dataset.idx, 10);
        slides[idx].classList.remove('is-active');
        if (btn.classList.contains('next')) {
          idx = (idx + 1) % slides.length;
        } else {
          idx = (idx - 1 + slides.length) % slides.length;
        }
        slider.dataset.idx = idx;
        slides[idx].classList.add('is-active');
      });
    });

  function open(id, push) {
    if (!byId[id]) id = DATA.id;
    const c = byId[id];
    if (c.group !== currentGroup && !search.value) { currentGroup = c.group; renderList(); }
    render(id);
    if (push) {
      history.replaceState(null, '', '#' + id);
      const top = view.getBoundingClientRect().top + window.scrollY - 90;
      if (window.innerWidth < 900 || window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  /* ---------- Fenêtres : documents et images ---------- */
  const modal = document.getElementById('doc-modal');
  const modalBody = document.getElementById('doc-modal-body');
  let lastFocus = null;

  function showModal(htmlStr, cls) {
    lastFocus = document.activeElement;
    modalBody.className = 'doc-modal-body ' + (cls || '');
    modalBody.innerHTML = htmlStr;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.doc-close').focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  modal.querySelector('.doc-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });

  document.addEventListener('click', function (e) {
	   /* Défilement carrousel portraits */
    const arrow = e.target.closest('.slider-btn');
    if (arrow) {
      e.preventDefault();
      e.stopPropagation();
      const slider = arrow.closest('.portrait-slider');
      if (slider) {
        const slides = slider.querySelectorAll('.slide-item');
        let idx = parseInt(slider.dataset.idx || '0', 10);
        slides[idx].classList.remove('is-active');
        if (arrow.classList.contains('next')) {
          idx = (idx + 1) % slides.length;
        } else {
          idx = (idx - 1 + slides.length) % slides.length;
        }
        slider.dataset.idx = idx;
        slides[idx].classList.add('is-active');
      }
      return;
    }
    const b = e.target.closest('.reg-item, .rel-chip');
    if (b) { open(b.dataset.id, true); return; }
    const d = e.target.closest('[data-doc]');
    if (d) { const doc = DOCS[d.dataset.doc]; showModal('<article class="doc doc-' + doc.type + '"><h2 id="doc-title" class="doc-title">' + esc(doc.title) + '</h2>' + doc.html + '</article>', 'is-doc'); return; }
    const z = e.target.closest('[data-zoom]');
    if (z) showModal('<figure class="zoom"><img src="' + z.dataset.zoom + '" alt="' + esc(z.dataset.caption || '') + '"><figcaption>' + esc(z.dataset.caption || '') + '</figcaption></figure>', 'is-zoom');
  });

  window.addEventListener('hashchange', () => open(location.hash.slice(1), false));
  renderList();
  open(location.hash.slice(1) || 'anne', false);
})();