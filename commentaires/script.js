/* =============================================================
   MOVE IN FLEURUS — le seul JavaScript du site
   Vanilla, pas de dépendance, pas de build. Chargé en `defer` :
   il s'exécute une fois le DOM construit, avant tout clic possible.
   -------------------------------------------------------------
   1. Menu mobile (burger) — le JS ne fait que poser une classe,
      toute l'animation est en CSS.
   2. Bouton « Télécharger l'appli » — route vers le bon store.
   ============================================================= */


/* ============ 1. MENU MOBILE ============ */
(() => {
  const burger = document.querySelector('.burger');
  const menu   = document.getElementById('menu-mobile');
  const close  = document.querySelector('.menu__close');
  if (!burger || !menu) return;

  const focusables = () => menu.querySelectorAll('a[href], button');
  const isOpen = () => menu.classList.contains('is-open');

  // Le JS ne fait que basculer une classe : toute la transition est en CSS.
  const open = () => {
    menu.classList.add('is-open');
    menu.removeAttribute('inert');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    close.focus();
  };

  const shut = ({ refocus = true } = {}) => {
    menu.classList.remove('is-open');
    menu.setAttribute('inert', '');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    if (refocus) burger.focus();
  };

  burger.addEventListener('click', open);
  close.addEventListener('click', () => shut());

  // Clic sur un lien : on ferme sans repiéger le focus sur le burger
  menu.addEventListener('click', e => {
    if (e.target.closest('a')) shut({ refocus: false });
  });

  document.addEventListener('keydown', e => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { shut(); return; }
    if (e.key !== 'Tab') return;
    // Piège à focus
    const items = focusables();
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Si on repasse en desktop menu ouvert, on referme
  matchMedia('(min-width: 900px)').addEventListener('change', e => {
    if (e.matches && isOpen()) shut({ refocus: false });
  });
})();

/* ============ 2. BOUTON « TÉLÉCHARGER L'APPLI » ============
   On route vers le bon store.
   Le href du HTML (Google Play) sert de repli pour tout ce qui n'est ni iOS ni
   Android — un PC Windows / Linux n'a pas de « bon » store. On le remplace au
   chargement plutôt qu'au clic : le lien reste un vrai lien (clic milieu, copie
   de l'adresse, clavier) et il est déjà correct avant même le premier clic. */
(() => {
  // Il y en a plusieurs : l'appli citoyen (hero) et l'appli commerçant. Chacun
  // porte SES deux URL en data-*, on les traite donc tous, pas seulement le 1er.
  // ⚠️ On filtre sur `[data-store-ios]` et pas sur `.btn-dl` seul : la pastille
  // « fleurus.be » de la section En savoir plus est le même composant mais ne
  // pointe aucun store.
  const btns = document.querySelectorAll('.btn-dl[data-store-ios]');
  if (!btns.length) return;

  const ua = navigator.userAgent;
  // iPadOS 13+ se déclare « Macintosh » : on le démasque par l'écran tactile.
  const tactileMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  const pomme = /iPhone|iPad|iPod/.test(ua) || tactileMac || /Macintosh|Mac OS X/.test(ua);
  const android = /Android/.test(ua);

  if (!android && !pomme) return;       // PC : on garde le repli du HTML

  btns.forEach(btn => {
    const url = android ? btn.dataset.storeAndroid : btn.dataset.storeIos;
    if (url) btn.href = url;
  });
})();


/* ============ 3. APPARITIONS AU SCROLL ============
   Un IntersectionObserver pose `.est-visible` quand l'élément entre dans le champ ;
   toute l'animation est ensuite une transition CSS (section 14 de la feuille de
   style), donc fluide quel que soit le rythme du scroll.
   ⚠️ La classe `.js-anim` est posée ICI, pas dans le HTML : c'est elle qui active
   l'état de départ (opacité 0). Si ce script ne tourne pas, rien n'est masqué.
   ⚠️ Et on ne la pose pas du tout si l'utilisateur a demandé moins d'animations.
   ⚠️ On observe le TITRE `.lignes` et non ses lignes intérieures : celles-ci sont
   translatées hors de leur masque, et WebKit calcule l'intersection APRÈS le recadrage
   des ancêtres — elles n'entraient donc jamais dans le champ sur iOS et les trois
   titres masqués ne réapparaissaient pas (corrigé le 07/09/2026). Le conteneur, lui,
   est un bloc normal jamais transformé : son intersection est toujours calculable. */
(() => {
  if (!('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cibles = document.querySelectorAll('.apparait, .carte, .lignes');
  if (!cibles.length) return;

  document.documentElement.classList.add('js-anim');

  const observateur = new IntersectionObserver((entrees) => {
    for (const entree of entrees) {
      if (!entree.isIntersecting) continue;
      entree.target.classList.add('est-visible');
      observateur.unobserve(entree.target);   // une seule fois, puis on oublie
    }
  }, {
    // On déclenche quand l'élément a franchi 15 % du bas de l'écran : assez tard
    // pour qu'on ait le temps de voir l'animation se jouer.
    rootMargin: '0px 0px -15% 0px',
    threshold: 0,
  });

  cibles.forEach(cible => observateur.observe(cible));
})();


/* ============ 4. BANDEAU PARTENAIRES : VITESSE CONSTANTE ============
   La piste fait 100 % de la largeur de l'écran et l'animation la translate de
   -100 %. À durée fixe, la vitesse dépendrait donc de la largeur du viewport :
   deux fois plus rapide sur un 2560 que sur un 1280. Or on ne peut PAS calculer
   une durée à partir d'une largeur en CSS (aucune conversion longueur → temps).
   D'où ce calcul en JS : durée = distance ÷ vitesse, recalculée au redimensionnement.
   ⚠️ La valeur CSS de --part-duree reste le repli si ce script ne tourne pas. */
(() => {
  const marquee = document.querySelector('.marquee');
  const piste = document.querySelector('.marquee__piste');
  if (!marquee || !piste) return;

  const VITESSE = 50;   // pixels par seconde, quelle que soit la largeur d'écran

  const regler = () => {
    const distance = piste.getBoundingClientRect().width;
    if (distance > 0) marquee.style.setProperty('--part-duree', (distance / VITESSE).toFixed(2) + 's');
  };

  regler();
  if ('ResizeObserver' in window) new ResizeObserver(regler).observe(marquee);
})();


/* ============ 5. HEADER QUI SE DÉROBE ============
   Il se retire vers le haut quand on descend, revient dès qu'on remonte un peu
   (comportement de klarna.com). Le CSS fait l'animation, le JS ne pose que des
   classes — comme pour le burger.
   ⚠️ Deux garde-fous : on ne cache jamais le header tant qu'on est dans les
   premiers écrans (sinon il clignote au moindre à-coup près du haut), et jamais
   non plus quand le menu mobile est ouvert. */
(() => {
  const header = document.querySelector('.header');
  const menu = document.getElementById('menu-mobile');
  if (!header) return;

  const MARGE = 6;        // px de scroll ignorés : évite le tremblement du trackpad
  let dernier = window.scrollY;
  let enAttente = false;

  const mettreAJour = () => {
    enAttente = false;
    const y = window.scrollY;
    const hauteur = header.offsetHeight;

    // Fond jaune dès qu'on a quitté le tout haut de la page
    header.classList.toggle('header--pose', y > 8);

    const menuOuvert = menu && menu.classList.contains('is-open');
    if (y < hauteur * 1.5 || menuOuvert) {
      header.classList.remove('header--cache');
    } else if (y > dernier + MARGE) {
      header.classList.add('header--cache');       // on descend : il s'efface
    } else if (y < dernier - MARGE) {
      header.classList.remove('header--cache');    // on remonte : il revient
    }

    dernier = y;
  };

  addEventListener('scroll', () => {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(mettreAJour);
  }, { passive: true });

  mettreAJour();
})();
