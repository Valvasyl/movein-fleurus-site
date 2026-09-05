<div align="center" id="haut">

<img src="assets/logos/logo-move-in-jaune-noir.svg" alt="Move in Fleurus" height="90">

# MOVE IN FLEURUS

**Site vitrine de l'application de mobilité douce de la Ville de Fleurus.**

[![Voir le site](https://img.shields.io/badge/%E2%86%92_VOIR_LE_SITE-ffdd0d?style=for-the-badge&labelColor=2a292e)](https://valvasyl.github.io/movein-fleurus-site/)

</div>

---

## À propos

- **Auteur** : Sylvain Valvassori
- **Client** : Ville de Fleurus
- **En ligne** : 👉 [valvasyl.github.io/movein-fleurus-site](https://valvasyl.github.io/movein-fleurus-site/) 👈
- **Maquettes** : Illustrator, deux planches — 390 px et 1440 px

**Contexte** : Move in Fleurus récompense les déplacements durables. Chaque kilomètre
parcouru à pied, à vélo ou en trottinette rapporte des points ; **100 km = un chèque de
10 €** à dépenser chez les commerçants partenaires. Il existe deux applications, une pour
les citoyens et une pour les commerçants. Ce site présente le concept et pousse à leur
téléchargement.

## Objectifs

- Reproduire les deux maquettes **au pixel** — chaque valeur est relevée, pas estimée
- Mobile-first, puis desktop
- **Fluid responsive** : tout en `clamp()`, aucune cassure entre les tailles d'écran
- **Un seul point de bascule** dans tout le projet : `@media (min-width: 900px)`
- Au-delà de 1440 px, le desktop devient une **homothétie exacte** de la maquette
- CSS moderne : variables natives et nesting avec `&`, **sans SASS**
- Accessible : contrastes, `alt`, navigation clavier, `prefers-reduced-motion`
- Animations d'apparition au scroll, **sans dépendance**

## Ce qu'il y a dans le dépôt

| | |
|---|---|
| `index.html` | la page, entière |
| `styles.css` | toute la mise en forme, en 14 sections numérotées |
| `script.js` | menu burger, choix du store, apparitions au scroll, header escamotable |
| `assets/` | images, logos et icônes |
| `CLAUDE.md` | le carnet de bord : relevés, décisions, pièges rencontrés |

**Aucun framework, aucun build, aucune dépendance.** Les deux seules ressources externes
sont les polices Google — Inter et Barlow Condensed.

## Le lancer en local

```bash
npx http-server -p 8000 -c-1
```

Puis <http://localhost:8000>. Le `-c-1` coupe le cache du navigateur : sans lui, on croit
que ses modifications ne sont pas prises en compte.

## Ce qui reste à trancher

- Les URL **Facebook**, **Instagram**, **politique de vie privée** et **conditions
  générales** — aujourd'hui en `href="#"`
- **Cinq contrastes** hérités de la maquette sont sous le seuil WCAG (titres blancs ou
  sable sur fond clair) — enjeu réglementaire pour un site public
- Le **logo Move in** est à réexporter : le « e » est tronqué dans le fichier source
- `robots.txt` bloque l'indexation tant que le site est en test — **à supprimer à la mise
  en ligne**

## Fait avec

![HTML5](https://img.shields.io/badge/HTML5-2a292e?style=for-the-badge&logo=html5&logoColor=ffdd0d)
![CSS3](https://img.shields.io/badge/CSS3-2a292e?style=for-the-badge&logo=css3&logoColor=ffdd0d)
![JavaScript](https://img.shields.io/badge/JAVASCRIPT-2a292e?style=for-the-badge&logo=javascript&logoColor=ffdd0d)

<div align="center">

☝️ [Retour en haut](#haut)

</div>
