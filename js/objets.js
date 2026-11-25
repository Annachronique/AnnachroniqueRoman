/* =========================================================
   AnnaChronique - l'inventaire des objets
   Pour ajouter un objet : une entrée de plus dans OBJETS.
   - cat : voyageurs (inventé/construit par les voyageurs) | xxie (rapporté du XXIe siècle) | moyenage
   - img : chemin d'une vraie image (assets/objets/...) ; sinon svg : nom d'une illustration ci-dessous
   - book : [texte, tome] ou liste de [texte, tome]   - dict : ancre d'un mot du dictionnaire
   ========================================================= */
(function () {
  'use strict';

  const CATS = {
    voyageurs: { label: 'Inventé ou construit par les voyageurs', short: 'Invention des voyageurs', color: 'var(--tertiary)' },
    xxie: { label: 'Rapporté du XXIe siècle', short: 'Venu du XXIe siècle', color: 'var(--crimson)' },
    moyenage: { label: 'Objet du Moyen Âge', short: 'Moyen Âge', color: 'var(--primary)' }
  };

  /* ---------- Illustrations (gravures dessinées en SVG) ---------- */
  const INK = '#3b2a1a', WOOD = '#b07c42', WOOD2 = '#8a5a2b', PAPER = '#efe0bd', METAL = '#a9b0b2', COPPER = '#c07a3e';
  const g = (inner) => '<svg viewBox="0 0 200 160" class="obj-svg" aria-hidden="true" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  const hatch = (x1, y1, x2, y2, n, dx, dy) => Array.from({ length: n }, (_, i) => '<path d="M' + (x1 + i * dx) + ' ' + (y1 + i * dy) + ' L' + (x2 + i * dx) + ' ' + (y2 + i * dy) + '" stroke-width="1" opacity="0.5"/>').join('');

  const SVG = {
    brouette: g(
      '<path d="M44 66 H150 L136 104 H62 Z" fill="' + WOOD + '"/>' + hatch(60, 70, 52, 100, 8, 11, 0) +
      '<path d="M134 96 L192 124 M142 86 L196 110" stroke-width="4" stroke="' + WOOD2 + '"/><path d="M134 96 L192 124 M142 86 L196 110"/>' +
      '<path d="M124 104 L128 142 M98 104 L96 142"/>' +
      '<circle cx="56" cy="118" r="26" fill="' + PAPER + '"/><circle cx="56" cy="118" r="5" fill="' + INK + '"/>' +
      [0, 45, 90, 135].map(a => '<path d="M56 118 L' + (56 + 26 * Math.cos(a * Math.PI / 180)).toFixed(1) + ' ' + (118 + 26 * Math.sin(a * Math.PI / 180)).toFixed(1) + ' M56 118 L' + (56 - 26 * Math.cos(a * Math.PI / 180)).toFixed(1) + ' ' + (118 - 26 * Math.sin(a * Math.PI / 180)).toFixed(1) + '" stroke-width="1.6"/>').join('') +
      '<path d="M78 104 L62 112"/>'),
    telescope: g(
      '<g transform="rotate(-18 100 80)"><rect x="34" y="66" width="112" height="22" rx="3" fill="' + COPPER + '"/>' +
      '<rect x="146" y="61" width="24" height="32" rx="3" fill="' + COPPER + '"/><rect x="18" y="70" width="18" height="14" rx="2" fill="' + COPPER + '"/>' +
      '<path d="M70 66 V88 M110 66 V88" stroke-width="3"/><path d="M40 72 H140" stroke="#fff3" stroke-width="3"/>' +
      '<ellipse cx="170" cy="77" rx="3" ry="16" fill="#cfe7ec"/></g>' +
      '<path d="M98 92 L70 152 M100 92 L100 152 M102 92 L132 152" stroke-width="3" stroke="' + WOOD2 + '"/><path d="M98 92 L70 152 M100 92 L100 152 M102 92 L132 152"/>'),
    moulin: g(
      '<path d="M22 64 L70 30 L118 64" fill="' + WOOD2 + '"/><rect x="28" y="64" width="84" height="66" fill="' + PAPER + '"/>' +
      hatch(30, 66, 30, 128, 6, 14, 0) + '<rect x="58" y="96" width="20" height="34" fill="' + WOOD + '"/><rect x="40" y="76" width="12" height="12"/>' +
      '<circle cx="148" cy="98" r="36" fill="' + WOOD + '"/><circle cx="148" cy="98" r="24" fill="' + PAPER + '"/><circle cx="148" cy="98" r="5" fill="' + INK + '"/>' +
      Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return '<path d="M' + (148 + 24 * Math.cos(a)).toFixed(1) + ' ' + (98 + 24 * Math.sin(a)).toFixed(1) + ' L' + (148 + 40 * Math.cos(a)).toFixed(1) + ' ' + (98 + 40 * Math.sin(a)).toFixed(1) + '" stroke-width="3"/>'; }).join('') +
      '<path d="M4 140 q12 -6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#2f7f8c"/><path d="M14 150 q12 -6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#2f7f8c"/>'),
    sac: g(
      '<path d="M86 30 q14 -14 28 0" stroke-width="4"/>' +
      '<rect x="56" y="34" width="88" height="112" rx="26" fill="#3f6f8a"/>' +
      '<path d="M60 70 q40 -18 80 0" fill="none"/><rect x="72" y="90" width="56" height="44" rx="10" fill="#355f77"/>' +
      '<path d="M76 100 H124" stroke="#e5b454" stroke-width="2.5"/><circle cx="122" cy="100" r="3" fill="#e5b454" stroke="none"/>' +
      '<path d="M56 60 q-16 30 -6 74 M144 60 q16 30 6 74" stroke-width="5" stroke="#2c4e61"/>'),
    tranchoir: g(
      '<rect x="20" y="108" width="160" height="26" rx="6" fill="' + WOOD + '"/>' + hatch(30, 112, 40, 130, 10, 15, 0) +
      '<path d="M40 104 q0 -40 60 -42 q60 2 60 42 Z" fill="#d9a35c"/><path d="M50 102 q2 -30 50 -32 q48 2 50 32 Z" fill="#f0d39a"/>' +
      '<path d="M70 92 q30 -14 60 0" stroke-width="1.4" opacity="0.6"/><path d="M150 60 L186 30" stroke-width="3"/><path d="M146 66 L156 56" stroke-width="6" stroke="' + WOOD2 + '"/>'),
    ecuelle: g(
      '<path d="M40 70 q60 80 120 0" fill="' + WOOD + '"/><ellipse cx="100" cy="70" rx="60" ry="14" fill="' + WOOD2 + '"/><ellipse cx="100" cy="72" rx="50" ry="9" fill="#6b4320"/>' +
      '<path d="M40 70 q-18 -4 -18 8 q0 8 18 4 M160 70 q18 -4 18 8 q0 8 -18 4" fill="' + WOOD + '"/>' + hatch(60, 92, 66, 112, 7, 12, 0) +
      '<path d="M100 66 q4 -20 -6 -30 q14 6 12 28" stroke-width="1.4" opacity="0.6"/>'),
    hanap: g(
      '<path d="M66 40 H134 L128 84 q-28 18 -56 0 Z" fill="' + METAL + '"/><path d="M70 50 H130" stroke-width="1.4"/><path d="M72 62 H128" stroke-width="1.2" opacity="0.6"/>' +
      '<path d="M62 40 q38 -24 76 0 Z" fill="' + METAL + '"/><circle cx="100" cy="22" r="6" fill="' + METAL + '"/>' +
      '<path d="M96 96 V126 M104 96 V126" /><path d="M94 104 H106 M94 116 H106" stroke-width="1.6"/>' +
      '<path d="M70 140 q30 -20 60 0 Z" fill="' + METAL + '"/>'),
    chandelle: g(
      '<path d="M100 18 q-10 16 0 28 q10 -12 0 -28 Z" fill="#f2b84b"/><path d="M100 34 v10" stroke-width="1.6"/>' +
      '<rect x="88" y="44" width="24" height="70" rx="3" fill="#f3ead2"/><path d="M90 52 q-4 10 0 18" stroke-width="1.4" opacity="0.6"/>' +
      '<path d="M50 126 q50 -18 100 0 q-50 18 -100 0 Z" fill="' + COPPER + '"/><rect x="84" y="112" width="32" height="10" fill="' + COPPER + '"/>' +
      '<path d="M150 124 q22 -4 22 10 q0 10 -18 6" stroke-width="3"/>'),
    tablette: g(
      '<rect x="24" y="40" width="72" height="92" rx="4" fill="' + WOOD + '"/><rect x="104" y="40" width="72" height="92" rx="4" fill="' + WOOD + '"/>' +
      '<rect x="32" y="48" width="56" height="76" fill="#3d2b17"/><rect x="112" y="48" width="56" height="76" fill="#3d2b17"/>' +
      '<path d="M38 60 h40 M38 72 h44 M38 84 h34 M118 60 h42 M118 72 h38" stroke="#d9a35c" stroke-width="1.6"/>' +
      '<path d="M96 56 h8 M96 112 h8" stroke-width="3"/><path d="M128 120 L184 24" stroke-width="4" stroke="' + METAL + '"/><path d="M128 120 L184 24"/>'),
    plume: g(
      '<path d="M30 60 h120 v70 h-120 Z" fill="' + PAPER + '"/><ellipse cx="30" cy="95" rx="10" ry="35" fill="#e0cc9e"/><ellipse cx="150" cy="95" rx="10" ry="35" fill="#e0cc9e"/>' +
      '<path d="M50 80 h80 M50 92 h70 M50 104 h76 M50 116 h50" stroke-width="1.4" opacity="0.7"/>' +
      '<path d="M120 120 C140 70 170 40 192 18 C186 52 160 88 120 120 Z" fill="#f6f1e4"/><path d="M120 120 L178 36" stroke-width="1.4"/>' +
      '<path d="M120 120 L114 132" stroke-width="2.6"/>'),
    quenouille: g(
      '<path d="M62 150 L74 30" stroke-width="4" stroke="' + WOOD2 + '"/><path d="M62 150 L74 30"/>' +
      '<path d="M74 34 q-26 6 -22 34 q4 24 26 22 q24 -4 20 -30 q-4 -26 -24 -26 Z" fill="#f3ead2"/>' +
      '<path d="M60 48 q14 8 30 0 M58 62 q16 8 36 0 M62 76 q14 6 28 0" stroke-width="1.2" opacity="0.6"/>' +
      '<path d="M92 70 C120 80 130 60 140 56" stroke-width="1.2"/>' +
      '<path d="M140 40 L144 150" stroke-width="3" stroke="' + WOOD2 + '"/><path d="M140 40 L144 150"/><ellipse cx="143" cy="120" rx="14" ry="5" fill="' + WOOD + '"/>' +
      '<path d="M141 60 q6 4 0 8 q-6 4 0 8 q6 4 0 8" stroke-width="1.4"/>'),
    araire: g(
      '<path d="M20 50 L120 108" stroke-width="5" stroke="' + WOOD2 + '"/><path d="M20 50 L120 108"/>' +
      '<path d="M110 102 L172 126 L118 126 Z" fill="' + WOOD + '"/><path d="M172 126 L192 132 L170 136 Z" fill="' + METAL + '"/>' +
      '<path d="M128 104 L150 40" stroke-width="5" stroke="' + WOOD2 + '"/><path d="M128 104 L150 40"/><path d="M140 44 L162 36" stroke-width="3"/>' +
      '<path d="M0 142 H200" stroke-width="1.4" opacity="0.5"/>'),
    fleau: g(
      '<path d="M20 140 L120 50" stroke-width="5" stroke="' + WOOD2 + '"/><path d="M20 140 L120 50"/>' +
      '<path d="M120 50 q8 -8 14 -2" stroke-width="2"/><path d="M134 48 L184 108" stroke-width="7" stroke="' + WOOD + '"/><path d="M134 48 L184 108"/>' +
      '<path d="M150 140 l6 -10 l6 10 M164 144 l6 -10 l6 10 M136 146 l6 -10 l6 10" stroke-width="1.6" stroke="#c99a3a"/>'),
    aumoniere: g(
      '<path d="M100 26 q-8 14 -30 18 M100 26 q8 14 30 18" stroke-width="1.8"/>' +
      '<path d="M60 52 q40 -14 80 0 l-6 70 q-34 18 -68 0 Z" fill="#9e1b26"/>' +
      '<path d="M60 52 q40 30 80 0 q-40 10 -80 0 Z" fill="#7a1420"/><circle cx="100" cy="72" r="6" fill="#e5b454"/>' +
      '<path d="M74 100 q26 12 52 0" stroke="#e5b454" stroke-width="1.6"/><path d="M80 112 q20 8 40 0" stroke="#e5b454" stroke-width="1.2"/>' +
      '<path d="M84 124 l-4 22 M100 128 v22 M116 124 l4 22" stroke-width="1.6"/>'),
    fermail: g(
      '<circle cx="100" cy="80" r="46" fill="#e5b454"/><circle cx="100" cy="80" r="30" fill="' + PAPER + '"/>' +
      Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return '<circle cx="' + (100 + 38 * Math.cos(a)).toFixed(1) + '" cy="' + (80 + 38 * Math.sin(a)).toFixed(1) + '" r="4" fill="#9e1b26"/>'; }).join('') +
      '<path d="M72 98 L132 58" stroke-width="4" stroke="' + METAL + '"/><path d="M72 98 L132 58"/><circle cx="72" cy="98" r="3" fill="' + INK + '"/>'),
    sceau: g(
      '<path d="M52 20 h24 l-4 46 h-16 Z" fill="' + WOOD + '"/><circle cx="64" cy="82" r="22" fill="' + METAL + '"/><circle cx="64" cy="82" r="15"/>' +
      '<circle cx="134" cy="104" r="36" fill="#b3202e"/><path d="M98 104 q-6 -6 -2 -12 M170 104 q6 6 2 12" stroke="#b3202e" stroke-width="6"/>' +
      '<circle cx="134" cy="104" r="26" stroke="#e8b0a8" stroke-width="1.6"/><path d="M134 86 v36 M116 104 h36" stroke="#e8b0a8" stroke-width="2.4"/>'),
    epieu: g(
      '<path d="M12 150 L140 40" stroke-width="5" stroke="' + WOOD2 + '"/><path d="M12 150 L140 40"/>' +
      '<path d="M140 40 C150 18 176 8 192 6 C190 22 180 48 158 58 Z" fill="' + METAL + '"/><path d="M146 50 L188 10" stroke-width="1.2"/>' +
      '<path d="M122 44 L146 68" stroke-width="5"/><path d="M60 110 l10 8 M50 118 l10 8" stroke-width="1.4"/>')
  };

  Object.assign(SVG, {
    eolienne: g('<path d="M92 150 L100 60 L108 150 Z" fill="' + WOOD2 + '"/>' + [0, 90, 180, 270].map(a => '<g transform="rotate(' + (a + 20) + ' 100 60)"><path d="M100 60 L104 8 L118 12 L106 60 Z" fill="' + PAPER + '"/><path d="M104 14 L108 56" stroke-width="1" opacity="0.6"/></g>').join('') + '<circle cx="100" cy="60" r="6" fill="' + INK + '"/><path d="M60 150 H140" stroke-width="3"/>'),
    filtre: g('<path d="M60 20 H140 L132 120 H68 Z" fill="' + PAPER + '"/><path d="M63 50 H137 M65 74 H135 M67 98 H133" stroke-width="1.6"/>' + '<rect x="63" y="50" width="74" height="24" fill="#d9c49a" stroke="none" opacity="0.7"/><rect x="65" y="74" width="70" height="24" fill="#3b2a1a" stroke="none" opacity="0.7"/><rect x="67" y="98" width="66" height="22" fill="#c9a86a" stroke="none" opacity="0.7"/>' + '<path d="M60 20 H140 L132 120 H68 Z"/><path d="M100 120 V138" stroke="#2f7f8c" stroke-width="3"/><path d="M78 140 q22 18 44 0 Z" fill="#9fd3dc"/><path d="M70 10 q30 -10 60 0" stroke="#2f7f8c" stroke-width="3"/>'),
    epee: g('<path d="M100 8 L108 22 L106 116 L94 116 L92 22 Z" fill="#d7dde0"/><path d="M100 14 V112" stroke-width="1"/><path d="M62 116 H138" stroke-width="7" stroke="' + INK + '"/><rect x="95" y="120" width="10" height="26" fill="' + WOOD2 + '"/><circle cx="100" cy="150" r="7" fill="#c9a86a"/>' + '<path d="M114 40 l8 -4 M116 60 l8 -4" stroke="#3fd0dc" stroke-width="1.6"/>'),
    trebuchet: g('<path d="M40 150 L80 60 L120 150" stroke-width="5" stroke="' + WOOD2 + '"/><path d="M40 150 L80 60 L120 150"/><path d="M20 150 H180" stroke-width="4"/>' + '<path d="M80 62 L180 22" stroke-width="5" stroke="' + WOOD + '"/><path d="M80 62 L180 22"/><path d="M80 62 L52 74" stroke-width="5"/><rect x="34" y="74" width="34" height="34" fill="' + WOOD2 + '"/>' + '<path d="M180 22 q-8 30 -30 56" stroke-width="1.4"/><circle cx="150" cy="80" r="7" fill="#9aa3a6"/>'),
    emaux: g('<rect x="40" y="24" width="120" height="112" rx="6" fill="' + COPPER + '"/><rect x="52" y="36" width="96" height="88" rx="4" fill="#1f5a8a"/>' + '<circle cx="100" cy="80" r="26" fill="#2f9fb0"/><path d="M100 54 L106 74 L126 80 L106 86 L100 106 L94 86 L74 80 L94 74 Z" fill="#e5b454"/>' + '<circle cx="64" cy="48" r="5" fill="#b3202e"/><circle cx="136" cy="48" r="5" fill="#b3202e"/><circle cx="64" cy="112" r="5" fill="#b3202e"/><circle cx="136" cy="112" r="5" fill="#b3202e"/>'),
    caisse: g('<path d="M30 60 L100 40 L170 60 L100 80 Z" fill="' + WOOD + '"/><path d="M30 60 V130 L100 150 V80 Z" fill="' + WOOD2 + '"/><path d="M170 60 V130 L100 150 V80 Z" fill="' + WOOD + '"/>' + '<path d="M44 76 V122 L88 136 V90 Z" fill="#7a6a58" opacity="0.6"/>' + [0, 1, 2].map(i => '<rect x="' + (120 + i * 14) + '" y="' + (92 - i * 4) + '" width="8" height="4" fill="' + INK + '"/>').join('') + '<path d="M120 120 q10 -14 22 -6" stroke-width="1.2"/>'),
    cabecou: g('<ellipse cx="100" cy="120" rx="84" ry="22" fill="#6c8a3a"/><path d="M30 118 q70 -30 140 0" stroke-width="1.2"/>' + [[70, 100], [112, 98], [92, 80]].map(c => '<ellipse cx="' + c[0] + '" cy="' + (c[1] + 10) + '" rx="26" ry="8" fill="#e8e0cc"/><rect x="' + (c[0] - 26) + '" y="' + c[1] + '" width="52" height="10" fill="#f3ede0" stroke="none"/><ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="26" ry="8" fill="#fbf7ee"/><path d="M' + (c[0] - 26) + ' ' + c[1] + ' V' + (c[1] + 10) + ' M' + (c[0] + 26) + ' ' + c[1] + ' V' + (c[1] + 10) + '"/>').join('')),
    bic: g('<g transform="rotate(-35 100 80)"><rect x="86" y="10" width="28" height="130" rx="10" fill="#f6f6f2"/><path d="M90 140 L100 156 L110 140 Z" fill="#9aa3a6"/>' + ['#1d4ea8', '#c4202c', '#2b8a3e', '#1a1a1a'].map((c, i) => '<rect x="' + (88 + i * 6) + '" y="2" width="5" height="18" rx="2" fill="' + c + '"/>').join('') + '<rect x="96" y="30" width="8" height="70" fill="#1d4ea8" opacity="0.15" stroke="none"/></g>'),
    enceinte: g('<rect x="44" y="40" width="112" height="84" rx="40" fill="#2e3440"/><circle cx="100" cy="82" r="28" fill="#3b4252"/><circle cx="100" cy="82" r="14" fill="#4c566a"/>' + Array.from({ length: 5 }, (_, i) => '<circle cx="' + (70 + i * 15) + '" cy="54" r="2" fill="#88c0d0" stroke="none"/>').join('') + '<path d="M164 70 q10 12 0 24 M174 62 q18 20 0 40" stroke="#14b8c8" stroke-width="2"/>'),
    montre: g('<rect x="84" y="10" width="32" height="40" fill="#6b4a2b"/><rect x="84" y="110" width="32" height="40" fill="#6b4a2b"/><circle cx="100" cy="80" r="34" fill="#d9c49a"/><circle cx="100" cy="80" r="26" fill="#fbf7ee"/>' + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return '<path d="M' + (100 + 22 * Math.cos(a)).toFixed(1) + ' ' + (80 + 22 * Math.sin(a)).toFixed(1) + ' L' + (100 + 25 * Math.cos(a)).toFixed(1) + ' ' + (80 + 25 * Math.sin(a)).toFixed(1) + '" stroke-width="1.4"/>'; }).join('') + '<path d="M100 80 L100 62 M100 80 L112 86" stroke-width="2.4"/><rect x="134" y="76" width="6" height="8" fill="#d9c49a"/>'),
    gousset: g('<path d="M100 14 q20 0 20 16" stroke-width="2"/><circle cx="100" cy="20" r="8"/><circle cx="100" cy="88" r="52" fill="#c0c6c8"/><circle cx="100" cy="88" r="42" fill="#fbf7ee"/>' + '<text x="100" y="98" text-anchor="middle" font-family="EB Garamond, serif" font-size="30" fill="#3b2a1a" stroke="none">E</text>' + '<path d="M100 88 L84 66 M100 88 L122 96" stroke-width="2.2"/><path d="M60 150 q40 10 80 0" stroke-width="1.2" stroke-dasharray="3 3"/>'),
    antibio: g('<rect x="40" y="70" width="70" height="70" rx="6" fill="#fbf7ee"/><rect x="40" y="70" width="70" height="20" fill="#c4202c"/><path d="M60 110 H90 M75 95 V125" stroke="#c4202c" stroke-width="5"/>' + '<rect x="122" y="40" width="34" height="100" rx="8" fill="#f2f2ee"/><rect x="122" y="40" width="34" height="22" rx="6" fill="#1d4ea8"/><path d="M128 84 H150 M128 96 H150 M128 108 H144" stroke-width="1.2"/>' + '<rect x="58" y="26" width="40" height="18" rx="9" fill="#e5b454"/><path d="M78 26 V44" stroke-width="1.4"/>')
  });

  const OBJETS = [
    /* ---- Inventé ou construit par les voyageurs ---- */
    { id: 'brouette', name: 'La brouette', cat: 'voyageurs', svg: 'brouette', tome: 2,
      short: "Une caisse en frêne, une roue, deux brancards : un seul homme transporte les pierres de taille.",
      what: "Sur le chantier des fortifications de Paussac, tout se transporte encore à dos d'homme ou sur des civières à deux porteurs. Une seule personne peut désormais faire le travail de deux.",
      book: [["Sidéré par le chantier de Paussac, Maxime conçoit un modèle rudimentaire en frêne, à une roue et deux brancards, qui double instantanément la vitesse de transport des pierres de taille.", 2]],
      fact: "100 % synchrone ! La brouette apparaît en Europe occidentale entre le milieu du XIIe et le début du XIIIe siècle, probablement importée de Chine ou réinventée sur place. Maxime est en parfaite harmonie avec l'Histoire." },
    { id: 'longue-vue', name: 'La longue-vue', cat: 'voyageurs', img: 'assets/objets/lunette_approche.jpg', tome: 1,
      short: "Un tube d'optique et deux lentilles de cristal bombé.",
      what: "Un tube muni de lentilles qui rapproche ce qui est loin : un pouvoir presque magique en 1135.",
      book: [["Acculé par le vicomte Raoul, Julien propose de fabriquer un tube d'optique. Il fait souffler des lentilles de cristal bombé par un maître verrier du Puy-Saint-Front. L'appareil permet au vicomte d'observer les cratères de la Lune et les satellites de Jupiter.", 1]],
      fact: "Avance de 470 ans : la lunette d'approche est inventée aux Pays-Bas en 1608, et Galilée l'utilise pour observer les lunes de Jupiter en 1610." },
    { id: 'moulin', name: 'Le grand moulin de la Dronne', cat: 'voyageurs', svg: 'moulin', tome: 1,
      short: "Une roue à aubes optimisée et des engrenages de précision.",
      what: "Une colossale roue à aubes en chêne, aux pales incurvées et inclinées pour capter le maximum de force du courant. L'arbre est couplé à des engrenages en bois graissés au suif : la meule produit deux fois plus de farine en deux fois moins de temps.",
      book: [["Pour soulager la peine des laboureurs et asseoir l'autorité de Dame Isabelle, Maxime conçoit le grand moulin de la Dronne, autour du bief.", 1],
             ["Secret du futur : des capteurs de charge électroniques, issus du matériel du laboratoire, sont cachés dans la charpente pour surveiller la résistance de l'édifice.", 2]],
      fact: "En 1136, le Périgord compte déjà de nombreux moulins à eau, souvent rustiques ; ailleurs, on broie encore le grain à la main. Le moulin rapporte gros au seigneur : c'est la « banalité »." },
    { id: 'eolienne', name: "L'éolienne du manoir", cat: 'voyageurs', svg: 'eolienne', tome: 1,
      short: "Quatre ailes et des soupapes de cuir pour faire monter l'eau.",
      what: "Une roue à quatre ailes, couplée à des soupapes de cuir, qui pompe l'eau courante jusqu'aux étages du manoir.",
      book: [["Maxime pense le mouvement du moulin pour l'associer à une éolienne et amener l'eau courante dans le manoir de Saint-Marcel.", 1]],
      fact: "Les premiers moulins à vent apparaissent en Europe vers la fin du XIIe siècle." },
    { id: 'filtre', name: 'Le filtre à eau', cat: 'voyageurs', svg: 'filtre', tome: 1,
      short: "Des couches de sable et de charbon contre le « mal rampant ».",
      what: "Un filtre public fait de couches de sable et de charbon, qui retient la vase et ce que les villageois appellent le « mal rampant » de l'eau.",
      book: [["Maxime installe un filtre public dans le bourg de Saint-Marcel.", 1],
             ["À Ribérac, Jean-Marc applique ses cours de microbiologie : il fait bouillir l'eau d'un baquet avec du thym et du romarin pour sauver des enfants malades.", 3]],
      fact: "Avance de 700 ans : la filtration au sable est ancienne, mais le charbon actif et la théorie des germes (prouvée par Pasteur) datent du XIXe siècle." },
    { id: 'escal-liber', name: "L'épée Escal Liber", cat: 'voyageurs', svg: 'epee', tome: 2,
      short: "Une lame en acier allié, inoxydable et d'une dureté exceptionnelle.",
      what: "Une épée forgée dans un alliage au manganèse et au chrome, bien plus dure et résistante que les lames de l'époque.",
      book: [["Maxime commande à un camelot de la pyrolusite (manganèse) et de la chromite. En modifiant la forge d'Éloi avec un double soufflet et de l'argile réfractaire, ils forgent ensemble l'épée Escal Liber.", 2]],
      fact: "Avance de 750 ans : les aciers alliés modernes et l'acier inoxydable au chrome datent de la fin du XIXe et du début du XXe siècle." },
    { id: 'trebuchet', name: 'Le trébuchet à contrepoids', cat: 'voyageurs', svg: 'trebuchet', tome: 2,
      short: "La précision des poids alliée à la puissance des leviers.",
      what: "Une machine de siège dont le bras est actionné par un lourd contrepoids, bien plus précise et puissante que les catapultes à traction.",
      book: [["Pour négocier son départ du château de Bourdeilles, Maxime propose au baron Géraud de bâtir cette machine.", 2]],
      fact: "Avance de 50 ans : les premiers grands trébuchets à contrepoids n'apparaissent en France que vers 1180-1190." },
    { id: 'emaux', name: 'Les émaux de Limoges', cat: 'voyageurs', svg: 'emaux', tome: 3,
      short: "La couleur fondue dans le cuivre plutôt que dans l'or.",
      what: "La technique du champlevé : on creuse des cavités dans le métal pour y fondre de l'émail coloré.",
      book: [["Lors d'une halte à Limoges, Maxime suggère à un artisan d'utiliser le cuivre plutôt que l'or ou l'argent. Pierre le surnomme en plaisantant « le père de l'émail de Limoges ».", 3]],
      fact: "100 % synchrone ! L'émaillerie limousine sur cuivre, l'« Œuvre de Limoges », prend son essor vers 1150." },
    { id: 'caisses', name: 'Les caisses isothermes', cat: 'voyageurs', svg: 'caisse', tome: 2,
      short: "Double paroi, feutre humide et évents pour voyager au frais.",
      what: "Des coffres à double paroi, isolés avec du feutre humide et percés d'évents pour régler le courant d'air.",
      book: [["Pour exporter le cabécou vers la chaleur de l'Espagne, Pierre demande à Maxime de concevoir ces caisses.", 2]],
      fact: "Avance de 750 ans : le transport isotherme ventilé est une invention industrielle de la fin du XIXe siècle." },
    { id: 'cabecou', name: 'Le Cabécou de Saint-Marcel', cat: 'voyageurs', svg: 'cabecou', tome: 1,
      short: "Le petit fromage de chèvre de Pierre.",
      what: "Un petit fromage de chèvre au lait cru, à pâte molle et croûte fine, moulé à la louche, salé, égoutté puis affiné.",
      book: [["Avec les chèvres du paysan Jean à Cercles, Pierre formalise la recette, le moulage et l'affinage en cave du Cabécou de Saint-Marcel.", 1]],
      fact: "« Cabécou » vient de l'occitan cabra, la chèvre : c'est littéralement un « petit fromage de chèvre » d'environ 50 à 60 g. Celui de Rocamadour a obtenu son appellation d'origine en 1996." },
    { id: 'boule-facettes', name: 'La boule à facettes', cat: 'voyageurs', img: 'assets/objets/boule-facettes.jpg', tome: 2,
      short: "De petits miroirs qui font tourner la lumière sur la carole.",
      what: "Une boule couverte de petits miroirs suspendue dans la grande salle, qui fait danser la lumière pendant la carole.",
      book: [["Illustration du tome 2.", 2]],
      fact: "La carole, ronde où l'on se tient par la main en chantant, est la danse la plus populaire du Moyen Âge." },

    /* ---- Rapporté du XXIe siècle ---- */
    { id: 'carnet-rose', name: 'Le Carnet Rose', cat: 'xxie', img: 'assets/objets/carnet-rose-bic.jpg', tome: 1,
      short: "Le cahier rose d'Élise, « Too Cute to Care », tenu avec sa mère.",
      what: "Le cahier Seyès rose d'Élise, avec son chaton et sa phrase « Too Cute to Care ». Anne y écrit la première, puis mère et fille le tiennent ensemble : médecine, hygiène, chiffres arabes, algèbre, principes d'égalité.",
      book: [["Élise y écrit avec son stylo BIC 4 couleurs ; on l'aperçoit sur la couverture du tome 2, partie 2.", 1],
             ["Avant de partir, Anne le confie en secret à Marguerite la guérisseuse, avec la consigne de le cacher.", 3],
             ["En 1137, Mathilde le sauve de l'incendie de Saint-Marcel : il devient le trésor secret de la dynastie Jullian.", 5]],
      fact: "Au XIIe siècle, on écrit sur du parchemin, une peau d'animal préparée et très coûteuse. Le papier est encore inconnu en Périgord." },
    { id: 'bic', name: 'Le stylo BIC 4 couleurs', cat: 'xxie', svg: 'bic', tome: 1,
      short: "Bleu, rouge, vert, noir : quatre encres dans un seul tube.",
      what: "Le stylo d'Élise, avec lequel elle remplit le Carnet Rose.",
      book: [["Élise écrit dans le Carnet Rose avec son stylo BIC 4 couleurs.", 1],
             ["Joullan Jullian le vide jusqu'à la dernière goutte pour écrire un message ; en 1204, Sœur Beatriz le scelle dans le gisant d'Aliénor à Fontevraud.", 5]],
      fact: "Le stylo à bille ne se répand qu'après la Seconde Guerre mondiale ; le célèbre BIC 4 couleurs date de 1970." },
    { id: 'smartphone', name: 'Le smartphone', cat: 'xxie', img: 'assets/objets/smartphone-tranchoirs.jpg', tome: 1,
      short: "Un écran noir posé entre les tranchoirs et la chandelle.",
      what: "Un téléphone du XXIe siècle, objet de stupeur pour les gens de Saint-Marcel.",
      book: [["Élise montre son téléphone à Dame Isabelle.", 1]],
      fact: "Le tout premier SMS a été envoyé en 1992." },
    { id: 'enceinte', name: "L'enceinte Bluetooth d'Élise", cat: 'xxie', svg: 'enceinte', tome: 2,
      short: "De la musique pop et du rap au XIIe siècle.",
      what: "La petite enceinte d'Élise, qui diffuse les refrains du XXIe siècle lors des veillées.",
      book: [["Marie compare naïvement les poèmes des chevaliers aux morceaux de rap de l'enceinte Bluetooth d'Élise.", 2]],
      fact: "Le Bluetooth doit son nom à un roi danois du Xe siècle, Harald « à la dent bleue »." },
    { id: 'sacs', name: 'Les sacs à dos', cat: 'xxie', svg: 'sac', tome: 1,
      short: "Tissu synthétique, fermetures éclair, bretelles rembourrées.",
      what: "Les sacs que portaient les voyageurs le jour de la sortie dans la Forêt des Genêts.",
      book: [["François portait un sac à dos technique garni de carnets de notes et d'un télémètre laser.", 1]],
      fact: "La fermeture éclair n'a été inventée qu'au début du XXe siècle, et le nylon dans les années 1930." },
    { id: 'antibiotiques', name: 'Les antibiotiques de Léa', cat: 'xxie', svg: 'antibio', tome: 2,
      short: "Des caisses de secours chirurgical venues de 2023.",
      what: "Le matériel médical apporté par l'équipe de secours : de quoi opérer proprement et soigner les infections.",
      book: [["Léa pratique des amputations propres et traite les infections aux antibiotiques, au grand choc du Père Étienne.", 2]],
      fact: "La pénicilline, premier antibiotique, est découverte par Alexander Fleming en 1928." },
    { id: 'montre-jean-marc', name: 'La montre suisse de Jean-Marc', cat: 'xxie', svg: 'montre', tome: 2,
      short: "Une montre mécanique… qui attire les convoitises.",
      what: "La montre mécanique suisse du physicien Jean-Marc Marchand.",
      book: [["Jean-Marc arrive en 1135 avec l'équipe de secours.", 2], ["À La Souterraine, Garin de Rochefort l'assassine pour lui voler sa montre.", 3]],
      fact: "Les premières horloges mécaniques à poids n'apparaissent en Europe qu'à la fin du XIIIe siècle." },
    { id: 'gousset', name: "La montre de gousset d'Ernest", cat: 'xxie', svg: 'gousset', tome: 2,
      short: "Une montre de 1897, gravée d'un E, aux aiguilles qui tournent à l'envers.",
      what: "Une montre de gousset en argent, retrouvée près des ossements d'un explorateur du XIXe siècle.",
      book: [["Maxime et Julien découvrent la dépouille d'Ernest, projeté seul au Moyen Âge en 1897, et sa montre dont les aiguilles tournent à l'envers : la preuve que la faille s'ouvre selon des cycles.", 2]],
      fact: "La montre de gousset est l'accessoire chic du XIXe siècle, avant que la montre-bracelet ne s'impose au XXe." },
    { id: 'paiement', name: 'Le paiement de Maxime', cat: 'xxie', img: 'assets/objets/paiement-maxime.jpg', tome: 2,
      short: "Une montre du futur parmi les deniers et un acte scellé.",
      what: "Une montre du XXIe siècle posée à côté de deniers d'argent et d'un acte au sceau vert.",
      book: [["Illustration du tome 2.", 2]],
      fact: "Au XIIe siècle, on paie en deniers d'argent, mais beaucoup d'échanges se font encore en nature." },

    /* ---- Objets du Moyen Âge ---- */
    { id: 'epieu', name: "L'épieu", cat: 'moyenage', svg: 'epieu', dict: 'epieu', tome: 1,
      short: "Une lance courte et solide pour la chasse au gros gibier.",
      what: "Un long manche de bois, un fer large en forme de feuille et une traverse juste en dessous.",
      book: [["Raoul le Jeune entraîne Julien dans une chasse sauvage au sanglier.", 1]],
      fact: "La traverse sous la lame empêche l'animal blessé de remonter le long du manche jusqu'au chasseur." },
    { id: 'tranchoir', name: 'Le tranchoir', cat: 'moyenage', svg: 'tranchoir', dict: 'tranchoir', tome: 1,
      short: "Une épaisse tranche de pain rassis qui sert d'assiette.",
      what: "On pose la viande et la sauce sur une grosse tranche de pain dur, elle-même posée sur une planche.",
      book: [["Anne verse le gruau sur une épaisse tranche de pain noir lors du premier repas avec Moreau et Jean-Marc.", 2]],
      fact: "Après le repas, le tranchoir imbibé de sauce est souvent donné aux pauvres ou aux chiens." },
    { id: 'ecuelle', name: "L'écuelle", cat: 'moyenage', svg: 'ecuelle', tome: 1,
      short: "Un petit bol creux en bois ou en terre cuite.",
      what: "On y sert les soupes, les bouillies et les potages. Certaines ont deux petites « oreilles » pour la tenir.",
      fact: "Pendant le repas, on la partage souvent à deux." },
    { id: 'hanap', name: 'Le hanap', cat: 'moyenage', svg: 'hanap', dict: 'hanap', tome: 1,
      short: "Une grande coupe à boire, souvent sur pied.",
      what: "La coupe des seigneurs. Les paysans boivent dans du bois ou de la terre cuite ; les nobles, dans l'étain, l'argent ou l'or.",
      book: [["Le vicomte Raoul y boit son vin clairet.", 1]],
      fact: "Le mot vient du francique hnapp." },
    { id: 'chandelle', name: 'La chandelle de suif', cat: 'moyenage', svg: 'chandelle', tome: 1,
      short: "Une bougie faite de graisse animale.",
      what: "La lumière de tous les jours, posée sur un bougeoir de métal.",
      fact: "Elle fume et sent fort. Les chandelles en cire d'abeille, bien plus chères, sont réservées aux églises et aux riches." },
    { id: 'tablette', name: 'La tablette de cire', cat: 'moyenage', svg: 'tablette', tome: 1,
      short: "Le brouillon du Moyen Âge.",
      what: "Deux planchettes de bois creusées et remplies de cire, sur lesquelles on écrit avec une pointe : le stylet.",
      fact: "Pour effacer, on lisse la cire avec l'autre bout du stylet, puis on recommence." },
    { id: 'plume', name: "La plume d'oie et le parchemin", cat: 'moyenage', svg: 'plume', tome: 1,
      short: "Pour écrire à l'encre, sur de la peau d'animal.",
      what: "On taille une plume d'oie en pointe, on la trempe dans l'encre et on écrit sur du parchemin.",
      fact: "Pour un seul grand livre, il faut parfois les peaux de dizaines, voire de centaines d'animaux." },
    { id: 'quenouille', name: 'La quenouille et le fuseau', cat: 'moyenage', svg: 'quenouille', tome: 1,
      short: "Les outils pour filer la laine.",
      what: "La quenouille tient la laine brute ; le fuseau, que l'on fait tourner, la tord pour en faire du fil.",
      fact: "On file en marchant, en gardant les bêtes ou en bavardant : c'est une tâche de tous les instants." },
    { id: 'araire', name: "L'araire", cat: 'moyenage', svg: 'araire', tome: 1,
      short: "Une charrue simple, tirée par des bœufs.",
      what: "Elle griffe la terre pour l'ouvrir, sans la retourner.",
      fact: "Plus légère que la charrue, elle convient bien aux sols légers du sud de la France." },
    { id: 'fleau', name: 'Le fléau', cat: 'moyenage', svg: 'fleau', tome: 1,
      short: "Deux bâtons reliés pour battre les céréales.",
      what: "On frappe les épis étalés au sol pour en faire tomber les grains.",
      fact: "Le battage se fait à plusieurs, en rythme, sur l'aire de battage." },
    { id: 'aumoniere', name: "L'aumônière", cat: 'moyenage', svg: 'aumoniere', tome: 1,
      short: "Une petite bourse accrochée à la ceinture.",
      what: "En tissu brodé ou en cuir, elle remplace nos poches.",
      fact: "Son nom vient de l'aumône : on y garde les pièces à donner aux pauvres." },
    { id: 'fermail', name: 'Le fermail', cat: 'moyenage', svg: 'fermail', tome: 1,
      short: "Une broche qui ferme le manteau.",
      what: "Une agrafe ronde, munie d'une épingle, qui retient le manteau sur la poitrine.",
      fact: "Chez les nobles, il est en or ou en argent, parfois serti de pierres." },
    { id: 'sceau', name: 'Le sceau', cat: 'moyenage', svg: 'sceau', tome: 1,
      short: "La signature des puissants.",
      what: "Un cachet gravé que l'on presse dans la cire chaude pour authentifier un acte ou fermer une lettre.",
      book: [["Dame Isabelle appose son sceau sur l'acte d'affranchissement de Marie.", 3]],
      fact: "Peu de gens savent écrire : le sceau tient lieu de signature." }
  ];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const visual = o => o.img ? '<img src="' + o.img + '" alt="" class="obj-img">' : SVG[o.svg];
  const grid = document.getElementById('obj-grid');
  let cat = 'all';

  function render() {
    const q = document.getElementById('obj-search').value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const rows = OBJETS.filter(o => (cat === 'all' || o.cat === cat) && (!q || (o.name + ' ' + o.short).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(q)));
    grid.innerHTML = rows.map(o => {
      const n = String(OBJETS.indexOf(o) + 1).padStart(2, '0');
      return '<div class="obj-wrap"' + (o.tome > 1 ? ' data-tome="' + o.tome + '"' : '') + '><button type="button" class="obj-card" data-id="' + o.id + '" style="--c:' + CATS[o.cat].color + '">' +
        '<span class="obj-frame">' + visual(o) + '</span>' +
        '<span class="obj-label"><span class="obj-num">N° ' + n + '</span><strong>' + esc(o.name) + '</strong>' +
        '<span class="obj-cat">' + CATS[o.cat].short + '</span><span class="obj-short">' + esc(o.short) + '</span></span></button></div>';
    }).join('');
    document.getElementById('obj-empty').style.display = rows.length ? 'none' : 'block';
    window.AnnaChronique.applySpoilers(window.AnnaChronique.getLevel());
  }

  /* ---------- Fiche détaillée ---------- */
  const modal = document.getElementById('obj-modal');
  const body = document.getElementById('obj-modal-body');
  let lastFocus = null;
  function openObj(id) {
    const o = OBJETS.find(x => x.id === id); if (!o) return;
    lastFocus = document.activeElement;
    const books = (o.book || []).map(b => '<div class="obj-book"' + (b[1] > 1 ? ' data-tome="' + b[1] + '"' : '') + '><p>' + esc(b[0]) + '</p></div>').join('');
    body.innerHTML =
      '<div class="obj-modal-visual">' + visual(o) + '</div>' +
      '<div class="obj-modal-text">' +
        '<span class="label" style="color:' + CATS[o.cat].color + '">' + CATS[o.cat].label + '</span>' +
        '<h2 id="obj-modal-title">' + esc(o.name) + '</h2>' +
        '<h3 class="label">C\'est quoi ?</h3><p>' + esc(o.what) + '</p>' +
        (books ? '<h3 class="label">Dans le roman</h3>' + books : '') +
        '<div class="obj-fact"><h3 class="label">Le savais-tu ?</h3><p>' + esc(o.fact) + '</p></div>' +
        (o.dict ? '<a class="btn btn-ghost" href="lexique.html#' + o.dict + '">Voir dans le dictionnaire</a>' : '') +
      '</div>';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    window.AnnaChronique.applySpoilers(window.AnnaChronique.getLevel());
    modal.querySelector('.obj-close').focus();
    if (window.gsap && !window.AnnaChronique.reduced) {
      gsap.fromTo('.obj-modal-panel', { y: 40, opacity: 0, rotate: -1 }, { y: 0, opacity: 1, rotate: 0, duration: 0.6, ease: 'expo.out' });
    }
  }
  function closeObj() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  grid.addEventListener('click', e => { const c = e.target.closest('.obj-card'); if (c) openObj(c.dataset.id); });
  modal.addEventListener('click', e => { if (e.target === modal) closeObj(); });
  modal.querySelector('.obj-close').addEventListener('click', closeObj);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeObj(); });

  document.getElementById('obj-search').addEventListener('input', render);
  document.querySelectorAll('[data-objcat]').forEach(b => b.addEventListener('click', function () {
    cat = b.dataset.objcat;
    document.querySelectorAll('[data-objcat]').forEach(x => x.classList.toggle('is-active', x === b));
    render();
  }));
  render();
  if (location.hash && OBJETS.some(o => o.id === location.hash.slice(1))) openObj(location.hash.slice(1));
})();
