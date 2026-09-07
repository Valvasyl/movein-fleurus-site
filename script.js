/* Move in Fleurus — version commentée : commentaires/script.js */

(() => {
  const burger = document.querySelector('.burger');
  const menu   = document.getElementById('menu-mobile');
  const close  = document.querySelector('.menu__close');
  if (!burger || !menu) return;

  const focusables = () => menu.querySelectorAll('a[href], button');
  const isOpen = () => menu.classList.contains('is-open');

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

  menu.addEventListener('click', e => {
    if (e.target.closest('a')) shut({ refocus: false });
  });

  document.addEventListener('keydown', e => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { shut(); return; }
    if (e.key !== 'Tab') return;
    const items = focusables();
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  matchMedia('(min-width: 900px)').addEventListener('change', e => {
    if (e.matches && isOpen()) shut({ refocus: false });
  });
})();


(() => {
  const btns = document.querySelectorAll('.btn-dl[data-store-ios]');
  if (!btns.length) return;

  const ua = navigator.userAgent;
  const tactileMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  const pomme = /iPhone|iPad|iPod/.test(ua) || tactileMac || /Macintosh|Mac OS X/.test(ua);
  const android = /Android/.test(ua);

  if (!android && !pomme) return;

  btns.forEach(btn => {
    const url = android ? btn.dataset.storeAndroid : btn.dataset.storeIos;
    if (url) btn.href = url;
  });
})();


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
      observateur.unobserve(entree.target);
    }
  }, {
    rootMargin: '0px 0px -15% 0px',
    threshold: 0,
  });

  cibles.forEach(cible => observateur.observe(cible));
})();


(() => {
  const marquee = document.querySelector('.marquee');
  const piste = document.querySelector('.marquee__piste');
  if (!marquee || !piste) return;

  const VITESSE = 50;

  const regler = () => {
    const distance = piste.getBoundingClientRect().width;
    if (distance > 0) marquee.style.setProperty('--part-duree', (distance / VITESSE).toFixed(2) + 's');
  };

  regler();
  if ('ResizeObserver' in window) new ResizeObserver(regler).observe(marquee);
})();


(() => {
  const header = document.querySelector('.header');
  const menu = document.getElementById('menu-mobile');
  if (!header) return;

  const MARGE = 6;
  let dernier = window.scrollY;
  let enAttente = false;

  const mettreAJour = () => {
    enAttente = false;
    const y = window.scrollY;
    const hauteur = header.offsetHeight;

    header.classList.toggle('header--pose', y > 8);

    const menuOuvert = menu && menu.classList.contains('is-open');
    if (y < hauteur * 1.5 || menuOuvert) {
      header.classList.remove('header--cache');
    } else if (y > dernier + MARGE) {
      header.classList.add('header--cache');
    } else if (y < dernier - MARGE) {
      header.classList.remove('header--cache');
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
