# archive/ — ne fait pas partie du site

Ce dossier contient les fichiers graphiques **qui ne sont utilisés nulle part** dans
`index.html`, `styles.css` ou `script.js`. Ils sont conservés parce qu'ils peuvent
resservir, mais **rien ici n'est chargé par le site**.

> **Aux développeurs** : ce dossier peut être exclu de la mise en ligne sans aucune
> conséquence. Il ne représente que 197 Ko, il est donc laissé dans le dépôt pour ne pas
> perdre les variantes, mais il n'a rien à faire sur le serveur de production.

## Ce qu'on y trouve

| Fichiers | Pourquoi ils ne servent plus |
|---|---|
| `icons/badge-app-store-*.svg`, `icons/badge-google-play-*.svg` | Les deux pastilles de magasin ont été remplacées le 05/09/2026 par un **bouton unique** « Télécharger l'appli ». À ressortir si la charte revient aux badges officiels. |
| `icons/icone-facebook-*.svg`, `icone-instagram.svg`, `icone-web.svg` | Ce sont les **sources** des trois bulles du pied de page. Celles-ci sont désormais *inline* dans `index.html` (sprite `<symbol>` + `<use>`), parce qu'elles doivent changer de couleur au survol — ce qu'un SVG chargé en `<img>` ne permet pas. |
| `icons/icone-marche.svg`, `icone-velo.svg`, `icone-trottinette*.svg`, `icone-skateboard.svg` | Pictogrammes de mobilité d'une version antérieure de la maquette. Les personnages équivalents sont aujourd'hui **dessinés dans** `illustration-skyline.svg`. |
| `icons/pin-*.svg` | Pictogrammes de carte, jamais entrés dans la maquette finale. |
| `logos/*-blanc.svg`, `logos/*-jaune*.svg` | Variantes claires des logos, pour fond sombre. Le bandeau partenaires est passé sur fond **crème** le 05/09/2026 : ce sont les variantes noires qui servent. ⚠️ Les versions noires de Ville de Fleurus, Wallonie et Shop In ont été **fabriquées** à partir de ces blancs (`#fff` → `#2a292e`) — c'est ici qu'il faut revenir si un partenaire livre un nouveau logo. |

## Convention

Si l'un de ces fichiers redevient utile, il repart dans `assets/` (et pas l'inverse) :
`assets/` ne doit contenir **que** ce qui est réellement servi.
