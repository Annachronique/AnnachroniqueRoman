# AnnaChronique - site compagnon de la saga

Site statique (HTML, CSS, JavaScript), sans installation : ouvrir `index.html` dans un navigateur.

## Pages
- `index.html` : accueil immersif (chargement « saut temporel », livre 3D au défilement, galerie)
- `saga.html` : les trois cycles et l'ordre de lecture
- `personnages.html` : dossiers des personnages (registre, avis de recherche, état civil, radiographie, relations, chronologie). Données dans `js/dossiers.js`
- `personnage-raoul.html` : fiche dossier complète de Raoul (modèle pour d'autres fiches longues)
- `lieux.html` : carte interactive + frise histoire réelle / roman
- `objets.html` : l'inventaire illustré (inventions des voyageurs, objets du XXIe siècle, objets du Moyen Âge). Données et illustrations dans `js/objets.js`
- `vlog.html` : le vlog de François. Ajouter les épisodes dans le tableau `EPISODES`
- `lexique.html` : dictionnaire façon vieux livre, avec recherche et index alphabétique (mots et expressions dans le tableau `WORDS`)
- `auteur.html` : auteur et points de vente

## Données
- `js/personnages-data.js` : les 63 personnages (générés depuis la « Bible des personnages ») et les documents d'archive
- `js/vlog-data.js` : les 6 épisodes du vlog et les 2 cours de François
- `js/objets.js` : l'inventaire (inventions des voyageurs, objets du XXIe siècle, objets du Moyen Âge)
- Images : `assets/portraits/`, `assets/scenes/`, `assets/objets/`, `assets/couvertures/`

## Fichiers partagés
- `css/style.css` : couleurs, typographies, en-tête, anti-spoiler
- `css/home.css`, `css/pages.css`, `css/dictionnaire.css`, `css/dossiers.css` : styles par page
- `assets/parchemin.jpg` : texture de fond (raccordable)
- Portraits : ajouter `assets/portraits/<id>.jpg` puis `portrait:` dans `js/dossiers.js`
- `js/main.js` : en-tête, menu, pied de page, son d'ambiance, filtre anti-spoiler
- `js/home.js` : animations de l'accueil (GSAP + ScrollTrigger, dans `js/vendor/`)

## Filtre anti-spoiler
Tout élément avec `data-tome="N"` est flouté si le lecteur n'a pas atteint ce niveau :
1 = Exil 1135 T1 · 2 = T2 · 3 = T3 · 4 = The Truth Seekers · 5 = Mathilde.
Les niveaux actuels sont une première proposition, à faire valider par l'auteur.
`*` dans un dossier = reconstitution déduite (non canonique), selon la convention de la bible.

## À compléter
- Couverture du tome 3 (page `saga.html`)
- Photo et présentation de l'auteur (`auteur.html`)
- Résumé de The Truth Seekers (`saga.html`), ISBN et lien éditeur (`auteur.html`)
