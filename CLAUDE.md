# Move in Fleurus — Site one-page

Contexte et règles du projet. Claude Code lit ce fichier à chaque session : ne pas
réexpliquer le contexte à chaque fois, tout est ici.

## Le projet

Site vitrine **one-page** pour « Move in Fleurus », l'application de mobilité douce
de la **Ville de Fleurus**. L'appli récompense les déplacements durables (à pied, à
vélo, en trottinette) : chaque kilomètre rapporte des points, **100 km = un chèque de
10 €** à dépenser chez les commerçants partenaires. Il existe **deux applications** :
une pour les **citoyens**, une pour les **commerçants**.

Objectif du site : présenter le concept et pousser au **téléchargement** des deux applis.

## Exigences techniques (non négociables)

- **Mobile-first**, puis desktop.
- **Fluid responsive** : tout en `clamp()`, pas de cassures brutales entre breakpoints.
  ⚠️ **Il y a maintenant DEUX maquettes**, toutes deux à jour (03/09/2026) :
  `maquette/Maquette desktop 1440.png` (1440 × 4882) et
  `maquette/Maquette Mobile 390px.png` (390 × 4140), plus leurs variantes « zone grille ».
  - **Bornes d'interpolation : 390 → 900**, et non 390 → 1440. Au-delà de 900 le site passe
    en homothétie (`--px`), donc la branche mobile ne sert jamais au-dessus de 899. On
    l'ancre sur la valeur que l'homothétie prendra à 900 (= valeur 1440 × **0,80**, le
    plancher de `--px`) : **aucune cassure au franchissement du breakpoint** (vérifié à
    899 / 901). Toutes les échelles mobiles sont recalculées avec ce facteur — si le
    plancher change un jour, il faut TOUTES les refaire.
  - Certaines échelles décroissent encore un peu de 390 à 900 (le mobile est un poster
    pleine largeur, le desktop range les mêmes mots en colonne), mais l'écart est devenu
    faible : le chapô et Bougez/Cumulez/Profitez sont désormais quasi constants.
  - Les écarts verticaux propres à l'empilement mobile restent **constants** de 390 à 900 :
    la typo y rétrécit quand la fenêtre s'élargit, faire grandir les blancs casserait le rythme.
- 🚨 **LES TROIS FICHIERS DÉPLOYÉS N'ONT PLUS AUCUN COMMENTAIRE** (décision Sylvain,
  06/09/2026). `index.html` l'était déjà depuis le 05/09 (27 commentaires, 5,1 Ko) ;
  **`styles.css` et `script.js` l'ont rejoint** — 265 commentaires retirés de la feuille
  de style, qui passe de 75,8 à **29,4 Ko** (7,4 Ko compressée), et le JS de 8,0 à 4,3 Ko.
  - ⚠️ **La version commentée vit dans `commentaires/`**, et elle NE SE RÉGÉNÈRE PAS TOUTE
    SEULE : il n'y a pas de build. **Toute modification de fond doit être reportée dans
    `commentaires/`**, sinon la documentation ment. Chaque fichier déployé porte en tête
    une ligne de rappel vers sa version commentée — c'est le seul commentaire qui reste,
    et il est là exprès.
  - ⚠️ **Ce fichier-ci et `commentaires/` sont désormais les DEUX seules sources du
    « pourquoi ».** Ne pas réintroduire de commentaires dans les fichiers de la racine
    sans le demander — mais consigner ici, ou dans la copie, tout ce qui aurait mérité
    un commentaire.
  - Méthode de travail conseillée : **éditer la copie commentée, puis en dépouiller les
    commentaires vers la racine** (`perl -0pe 's{/*.*?*/}{}gs'` pour le CSS, à la main
    pour le JS à cause des `//` dans les URL). L'inverse — éditer la racine puis recommenter —
    fait perdre le raisonnement à chaque passe.
- **Trois fichiers** : `index.html` + **`styles.css`** + **`script.js`**, tous liés
  (le JS était inline en fin de `<body>` jusqu'au 05/09/2026, Sylvain l'a voulu à part).
  `script.js` est appelé **en `defer` depuis le `<head>`** : il s'exécute une fois le DOM
  construit, donc bien avant qu'un clic soit possible, et il ne bloque pas l'affichage.
  Il contient deux blocs — le **menu burger** et le **routage vers le bon store**.
  Pas de framework, pas de build.
- **CSS moderne** : variables CSS natives (`:root { --… }`) + **nesting natif avec `&`**.
  **Pas de SASS.**
- **Un seul breakpoint dur** dans tout le projet : `@media (min-width: 900px)`. Il ne sert
  qu'à deux choses — basculer la grille de 4 → 12 colonnes, et passer du burger à la nav
  desktop. Tout le reste (typo, marges, espacements) est fluide en `clamp()`.
- **Animations — en deux phases :**
  - **Phase 1 (build actuel)** : site statique, pas d'animations hormis les **effets de
    survol** (hover) — **et l'ouverture du menu mobile** (voir « Header » plus bas).
    On stabilise d'abord le layout et la fidélité à la maquette.
  - **Phase 2 (à venir)** : ajouter des animations **en CSS de préférence** (transitions,
    `@keyframes`, apparitions au scroll via `animation-timeline: view()`), le **JS seulement
    si le CSS ne suffit pas** (compteurs, séquences complexes). Voir la liste « Phase 2 » en
    bas de fichier.
- **Accessible** : contrastes corrects, `alt` sur les images utiles, `aria-label` sur les
  liens/boutons icônes, focus visible, navigation clavier (menu burger fermable au clavier).
- **Respecte `prefers-reduced-motion`** : couper / réduire toutes les animations pour les
  personnes qui l'ont activé (obligatoire, y compris en Phase 2).

## Charte — couleurs

```
--jaune:  #ffdd0d   /* couleur de marque */
--noir:   #2a292e   /* noir chaud, texte et sections sombres */
--creme:  #fffbf0   /* blanc cassé très clair — cartes d'étapes, section "En savoir plus" */
--sable:  #f7dd7e   /* CONFIRMÉ — titres des piliers (Attirer/Fidéliser/Contribuer) + leurs pictos */
--blanc:  #FFFFFF
```

⚠️ **Il y a TROIS jaunes, pas un.** Relevés au pixel, la maquette est au 1:1 et en sRGB :

| Token | Valeur | Où |
|---|---|---|
| `--jaune` | `#ffdd0d` | numéros 01–04 des cartes (relevé exact — c'est bien la couleur de marque) |
| `--degrade-a` → `--degrade-b` | `#ffe330` → `#ffea63` | **fond de la bande jaune : un dégradé diagonal**, pas un aplat |
| `--jaune-fonce` | `#ffd405` | traits de la trame de rues + pastille App Store |

Le dégradé va du **bas-gauche vers le haut-droite** (`linear-gradient(to top right, …)`) : vérifié,
les deux autres coins tombent tous deux sur `#ffe646`, la valeur médiane.

Autres relevés confirmés : crème `#FFFBF0` ✅ · noir `#2A292E` ✅.

## Charte — typographie

Deux polices, **toutes deux gratuites via Google Fonts** — aucun besoin d'Adobe, rien à
self-hoster (Lufga abandonnée) :

- **Inter** → tout le **texte courant** : paragraphes, labels / eyebrows, **titres de carte
  (h3)**, et tout contenu lisible.
- **Barlow Condensed** → uniquement les **gros titres display** (Rejoignez le Move,
  Bougez / Cumulez / Profitez, Fidéliser vos clients, En savoir plus, titres des piliers)
  **et les numéros de carte (01–04)**.

**Règle : la police suit le RÔLE, pas la balise HTML.** Un gros titre reste en Barlow
Condensed même si c'est un `<h2>` ; un titre de carte reste en Inter même si c'est un `<h3>`.

- ⚠️ **L'ITALIQUE N'EST PLUS UTILISÉ NULLE PART** (constaté et retiré le 06/09/2026).
  La règle d'origine mettait les titres « poster » (Rejoignez le Move, Fidéliser vos
  clients) en Barlow Condensed **italique** 800 penché. Or « Rejoignez le Move » est
  devenu un **SVG vectorisé** et « Fidéliser vos clients » est **droit** : plus une seule
  déclaration `italic` dans le CSS, le HTML ou le JS. La graisse italique a donc été
  **retirée du lien Google Fonts**. Pour réintroduire un titre penché il faudra la
  remettre dans l'URL (`Barlow+Condensed:ital,wght@1,800`).
- Titres display upright (Bougez/Cumulez/Profitez, En savoir plus, piliers) : Barlow Condensed
  800, majuscules.
- Numéros de carte (01–04) : Barlow Condensed 800, jaune plein.

## Grille & valeurs (Illustrator / Figma)

**Grille**
- Desktop : 12 colonnes · gouttière 12 px · marges latérales 65 px · largeur max contenu 1440 px
- Mobile  : 4 colonnes · gouttière 16 px · marges latérales 20 px

Grille **vérifiée au pixel** sur `maquette/Maquette desktop 1440-zone grille.png` :
12 colonnes de **98,17 px**, gouttière **12 px**, contenu de **65 à 1374 px**, bandeau
header **160 px pile**. Le conteneur qui porte les marges + le plafond 1440 px est la
classe **`.container`** (la `<section>` porte le fond pleine largeur, `.container` les marges).

### ⭐ Le desktop est une HOMOTHÉTIE de la maquette

C'est **la** décision structurante du projet, à reconduire pour toutes les sections
restantes. Plutôt que d'interpoler chaque valeur séparément — ce qui faisait dériver les
éléments les uns par rapport aux autres — tout est exprimé en « pixels de maquette » :

```css
--px: calc(clamp(1152px, 100vw, 1440px) / 1440);   /* 1px à 1440 · plancher à 0,80 */
```

⚠️ **Plancher à 0,80** (décision Sylvain, 03/09/2026). Sans lui `--px` tombait à **0,625**
à 900 px : le desktop y était une miniature à 62,5 %, et comme toute la branche mobile est
ancrée dessus pour éviter une marche, elle s'étranglait en approchant de 900 (badges à 197,
chapô à 12,5). Le rendu **à 1440 est strictement inchangé** — seule la zone 900 → 1150
cesse de rétrécir. Le passage du breakpoint est désormais **invisible** : à 899 comme à
901, badges 120, chapô 16, Bougez 62,4, titre de carte 16.

Une valeur relevée s'écrit alors telle quelle : `margin-top: calc(160 * var(--px))`,
`font-size: calc(120 * var(--px))`. **De 900 px à 1440 px, le rendu est un zoom exact de la
maquette** ; au-delà de 1440 tout se fige. (Référence donnée par Sylvain :
la section « Featured News » de basicagency.com.)

Ces overrides sont posés dans le `@media (min-width: 900px)` : `--marge` 65, `--gutter` 12,
`--header-h` 160, `--logo-h` 60, `--nav-gap` 28, plus toute la typo du hero.
**Seule entorse**, assumée : un plancher `max(12px, …)` sur les deux plus petits labels
(`--fs-nav`, `--fs-eyebrow-sm`), sinon ils tomberaient à 8,75 px à 900. Il n'agit qu'en
dessous de ~1235 px.

En dessous de 900 px, on repasse aux `clamp()` mobile-first classiques.

### Piège : la demi-interligne

Positionner un bloc de titre au `margin-top` mesuré le place **trop bas**. Le haut de la
boîte de ligne n'est pas le haut des lettres. Pour Barlow Condensed 800 à 120 px avec un
interligne de 111 px, la hauteur de capitale démarre **18 px plus bas** que la boîte
(ascender hhea ≈ 1,12 em, capHeight 0,72 em). Toujours retrancher cet écart.

**Espacements**
- Padding vertical de section : desktop 60 px / mobile 20 px
- Gouttière entre cartes/colonnes : 12 px
- Hauteur de la barre de nav : **160 px max** (fluide 72 → 160)

**Typo — valeurs.** Les valeurs Illustrator sont en **pt** ; sur un plan de travail web à
72 ppi 1 pt = 1 px, donc reprises telles quelles. Sinon, relevé à la **hauteur de capitale**
sur la maquette, divisée par le ratio de la fonte (Inter capHeight = **0,7275 em**,
Barlow Condensed = **0,723 em**) — la maquette est en Lufga, donc **on cale sur la hauteur,
jamais sur la chasse**.

| Rôle | 390 | 1440 | Source |
|---|---|---|---|
| Titre hero « Rejoignez le Move » (SVG) | **350** = pleine largeur | **877** = taille naturelle | relevé |
| Bougez / Cumulez / Profitez | **62** / interligne 58 | **78** / interligne 70 | cap 45 / 56 |
| Eyebrow (« Mobilité », « Fidélité ») | **20** | **20** | Illustrator, Inter **Bold** 20pt |
| « Téléchargez maintenant » | **20** | **16** | 16 relevé (cap 12) ; 20 en mobile pour qu'il remplisse la grille moins 16 de marge |
| Chapô (lead) | **16** / 19,2 | **20** / 24 | cap 12 / 15 |
| Titre de carte h3 | **20** / 22 | **20** / 22 | Illustrator, Inter **ExtraBold** 20pt |
| Corps de carte | **14** / 16 | **14** / 16 | Illustrator, Inter Regular 14pt |
| Note « * » de la carte 01 | **10** | **10** | Illustrator, Inter Regular 10pt |
| Numéros de carte (01–04) | **100** | **100** | Barlow Condensed 800 |
| « En savoir plus » | **33,2** | **117,6** | cap 24 / 85 — `--fs-esp-titre` |
| Paragraphe « En savoir plus » | **16** / 19 | **27,5** / 30,5 | cap 12 / 20 — interligne en px |
| Pastille « fleurus.be » | **16,5** | **18** | cap 12 / 13 |
| Titre de pilier (Attirer…) | **26,3** | **38,7** | cap 19 / 28 — `--fs-display-s` |
| Texte de pilier | **14** / 16 | **14** / 16 | = corps de carte (la maquette mobile descend à 9,6 : refusé) |
| Liens de nav | — | **14** | cap 10 |
| « Scrollez pour découvrir » | masqué | **30** | choix Sylvain (la maquette relève 15) |

⚠️ Inter **800 (ExtraBold)** est chargé dans le lien Google Fonts — ne pas l'enlever.
⚠️ **Le lien a été dégraissé le 06/09/2026** : il chargeait **7 fichiers de police, dont 3
  morts** — Inter **500** et **600** (jamais déclarés : le site n'utilise que 400, 700 et
  800) et **Barlow Condensed italique** (plus aucun italique, cf. plus haut). L'URL est
  maintenant `family=Barlow+Condensed:wght@800&family=Inter:wght@400;700;800`. Avant
  d'ajouter une graisse dans le CSS, l'ajouter dans l'URL — et l'inverse aussi.
Planchers de lisibilité (seule entorse à l'homothétie) : 12 px sur `--fs-nav`,
`--fs-eyebrow-sm` et `--fs-card-text`, 9 px sur `--fs-card-note`.

## Structure du site (dans l'ordre)

1. **Header** — ✅ FAIT. ⚠️ **DÉCISION INVERSÉE le 05/09/2026 : il est maintenant STICKY
   et se dérobe au scroll** (d'après klarna.com). L'ancienne consigne « `position: relative`,
   pas de sticky, ne pas le remettre » ne vaut plus. Comportement : transparent en haut de
   page ; **il s'escamote vers le haut quand on descend et revient dès qu'on remonte un
   peu**, avec un **fond jaune** dès qu'on a quitté le haut — sans ce fond, les liens noirs
   passeraient sur les sections claires sans rien pour les porter.
   - ⚠️ **`sticky` et surtout pas `fixed`** : l'élément garde sa place dans le flux, donc
     le `margin-top` négatif du hero (qui le fait remonter sous le header) continue de
     fonctionner tel quel. En `fixed`, toute la page se serait décalée de 160 px.
   - Trois classes posées par `script.js` (bloc 5) : rien / `.header--pose` / `.header--cache`
     (escamoté). Le CSS fait toute l'animation (`--t-header`, 300 ms).
   - ⚠️ **`--pose` n'est PLUS une bande jaune pleine largeur : c'est une BARRE ARRONDIE
     EN RETRAIT** (maquette Sylvain, 06/09/2026). Relevé au pixel sur une planche
     1440 × 160 : barre de **x=32,5 à 1407,5** (1375 de large) et de **y=30 à 130**
     (100 de haut), **rayon 20**.
     - Retrait horizontal = **`--marge / 2`**. Les 32,5 relevés sont exactement la moitié
       de la marge de 65, et la formule tient aussi sous 900 (marge 20 → retrait 10) :
       rien à interpoler, aucune cassure au breakpoint.
     - Retrait vertical = **`--header-bar-y`**. ⚠️ Ce n'est PAS une interpolation de plus,
       c'est **l'air laissée autour du logo** : `(--header-h − --logo-h) × 0,3`, borné par
       un minimum de `--header-bar-pad` (8) entre le logo et le bord. La formule vaut à
       toutes les largeurs — **rien à redéfinir dans le bloc ≥900** — et retombe pile sur
       le relevé : 30 à 1440, 24 à 900. En dessous : 14,6 à 594, 6 à 390.
       ⚠️ **Le minimum de 8 ne mord qu'en dessous de ~508 px**, mais il est indispensable :
       le header mobile (72 à 390) est bien plus serré autour du logo (44) que la maquette
       desktop (160/60), et la 1re branche seule ne laissait plus que **0,5 px** — le logo
       touchait le bord de la barre (signalé par Sylvain, fenêtre de 594, 06/09/2026).
       Air obtenue : 20 à 1440, 16 à 900, 11,9 à 700, 9,8 à 594, 8 de 508 à 320.
     - Rayon = **`--header-bar-r`**, un **ratio** : `20 % de la hauteur de la barre`
       (demande Sylvain — l'alternative proposée était un 10 px en dur). Il retombe sur
       **20 à 1440** et **16 à 900**, soit exactement l'ancien `--r-card` aux deux bornes,
       mais il continue de **descendre** en dessous (13 à 594, 12 à 390) au lieu de
       remonter à 20 : la barre n'a plus l'air d'une pilule quand elle ne fait que 60 de
       haut. Pour repasser à une valeur fixe, une seule ligne à changer.
     - ⚠️ **Plafonnée à 1375 au-delà de 1440** (`max-width: --content-max - --marge` +
       `margin-inline: auto`). Sans ça la barre aurait suivi la fenêtre (2495 à 2560)
       alors que le logo et les liens sont plafonnés par `.container` à 1310 centrés.
     - ⚠️ **Le logo et les liens NE BOUGENT PAS** (demande Sylvain) : ils restent portés
       par `.header__inner.container`, calés sur la marge de 65 ; la barre passe derrière.
       C'est un `::before` en `z-index: -1` — il ne prend aucune place, et `.header` étant
       un contexte d'empilement (sticky + `z-index: 100`) le -1 reste enfermé dedans.
   - Garde-fous : jamais escamoté dans les 1,5 premières hauteurs de header (sinon il
     clignote près du haut), jamais non plus quand le menu mobile est ouvert, et une marge
     morte de 6 px de scroll pour ne pas trembler au trackpad. Hauteur 160 px max.
   - ⚠️ **LOGO INVERSÉ le 06/09/2026 (demande du client) : NOIR au repos, BLANC au survol.**
     C'était l'inverse depuis le début. La surcharge est portée par **`.header__logo`** et
     surtout pas par le rôle `.logo` : celui-ci sert aussi au menu mobile et au footer, tous
     deux sur fond noir, où le logo doit rester blanc (vérifié : les deux sont bien restés
     blancs). Spécificité (0,2,0) contre (0,1,0), l'ordre dans le fichier n'entre pas en jeu.
     Effet de bord bienvenu : sur le jaune le logo passe de **1,3:1 à ≈11:1** et s'aligne
     enfin sur les liens de nav, déjà en `--noir`. ⚠️ En revanche le **survol** devient du
     blanc sur jaune (1,3:1) : le logo s'efface presque le temps du survol — conséquence
     assumée de l'inversion, pas un bug.
   - Liens Mobilité · Fidélité · Commerçant · En savoir plus à droite (4 liens depuis le
     03/09), soulignement qui se déploie au survol — rôle **`.souligne`**, partagé depuis le
     05/09 avec les liens légaux du footer et, depuis le 06/09, avec le menu mobile. **Sous 900 px : burger** → menu **plein écran** noir :
   - le panneau se déroule **en rideau du haut vers le bas** (`clip-path`, 620 ms) ;
   - les 3 titres sont **alignés à gauche** et **remontent en cascade** ;
   - le **logo est repris dans le menu**, à la même place qu'au header (même `--header-h`) ;
   - fermable au **clic / Échap / croix**, croix sans rotation ;
   - tout est en CSS, le JS ne pose qu'une classe `.is-open` ; `inert` quand fermé.
2. **Hero** — ✅ FAIT (refait le 03/09/2026 d'après les deux nouvelles maquettes).
   Jaune + trame de rues en filigrane. Titre « Rejoignez le Move » en SVG vectorisé ;
   mockup iPhone au centre (**sans** QR) ; « Bougez / Cumulez / Profitez » à droite —
   **Bougez blanc, Cumulez NOIR, Profitez BLANC**.
   - ⚠️ **Ordre des blocs de la colonne gauche** : indicateur de scroll → bouton
     « Télécharger l'appli » → « Mobilité » + chapô. Le bouton est **au-dessus** du chapô
     (c'était l'inverse avant le 03/09). Depuis le 05/09 le label « Téléchargez maintenant »
     et les deux badges sont remplacés par ce bouton unique — cf. « Bouton de téléchargement ».
   - Sous 900 px, `.hero__gauche` passe en **`display: contents`** : ses trois blocs
     redeviennent des cases de la grille, ce qui permet aux mots de s'intercaler entre les
     bouton et le chapô — l'ordre de la maquette mobile : titre → mockup → bouton →
     Bougez/Cumulez/Profitez → Mobilité → chapô. Le bloc de téléchargement y est **centré**.
   - Le cue de scroll est **masqué sous 900 px** (absent de la maquette mobile).
   - **La bande jaune remonte sous le header** (`margin-top: calc(-1 * var(--header-h))`
     + `padding-top` équivalent) et le header est **transparent** : le dégradé et la trame
     sont ainsi continus depuis `y=0`, comme sur la maquette où le header flotte sur le fond.
   - **Trame de rues** en `background-image` (pas en `<img>`) : le SVG n'a pas de rectangle
     de fond, ses traits `#ffd405` se posent directement sur le dégradé.
     ⚠️ **Elle est dimensionnée par la HAUTEUR, pas par la largeur** :
     `background-size: auto max(100%, calc(var(--trame-w) * 1.2))`.
     Le SVG est en portrait (125 × 150, donc hauteur = largeur × 1,2). Pilotée par la
     largeur, elle devenait plus **courte** que la bande en mobile — où celle-ci fait le
     double de haut, les 4 cartes étant empilées — et le `center 60%` la repoussait vers
     le bas : **tout le haut du hero se retrouvait sans carte** (bug vu sur iPhone 14 Pro,
     03/09/2026). Le `max(100%, …)` garantit qu'elle couvre toujours la bande.
     ⚠️ **`--trame-w` est une largeur RÉELLE en px**, plus un nombre de pixels de maquette :
     **3500 en mobile comme en desktop**, pour que les routes aient exactement la même
     taille apparente — la carte déborde alors largement de l'écran, c'est voulu (validé
     par Sylvain, 03/09/2026). La valeur redescend vers 2187,5 à 900 pour rejoindre
     l'homothétie sans cassure. Reste le seul chiffre à toucher pour régler le zoom.
   - **Bouton de téléchargement** : un seul, blanc/texte noir, le noir monte au survol.
     Détails et détection du store dans la section « Bouton de téléchargement ».
   - **Indicateur « Scrollez pour découvrir »** : une piste fine et fixe + une barre blanche
     plus large qui la **traverse** de haut en bas. Elle part entièrement au-dessus et finit
     entièrement en dessous ; l'`overflow: hidden` de la piste la masque aux deux bouts, donc
     la boucle est invisible **sans recourir à l'opacité** (refusée par Sylvain).
     Deux animations séparées sur `translate` et `scale` — propriétés distinctes, donc deux
     courbes de Bézier indépendantes : descente en ease-out marqué, étirement en
     squash & stretch avec `transform-origin: center`.
     ⚠️ Ne PAS animer depuis un bord fixe (`transform-origin: top` + `scale` croissant) :
     ça reproduit exactement le soulignement de la nav. Durée dans `--t-cue`.
3. **Mobilité** (suite jaune) — ✅ FAIT. 4 **cartes crème** dans un `<ol>`, numéros
   **01–04 en jaune plein**, titres noirs, corps noir (`#2a292e`, pas gris : relevé au
   pixel), note en pied de carte 1.
   - **Géométrie desktop (Illustrator)** : **318,4998 × 270**, **rayon 20**, padding **20**
     (bas 20), fond `--creme` `#fffbf0` — soit 3 colonnes sur 12 + la gouttière de 12,
     de `y = 1310` à `1579`. La bande jaune s'arrête **59 px** sous les cartes (`y = 1638`).
   - **Sous 900 px la grille des cartes est INTRINSÈQUE**, pas calée sur les 4 colonnes :
     `grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr))`. Les cartes
     passent donc de **1 par rangée** (téléphone) à **2 × 2** (à partir de ~700 px) sans le
     moindre breakpoint, puis à **4 de front** au-dessus de 900. La typo garde ses valeurs
     nominales (titre 20, corps 14, note 10) à 390 — à 2 par rangée sur la maquette mobile
     le corps tombait à 8 px et la note à 6 px, illisible.
   - ⚠️ **Les trois espacements verticaux sont des écarts entre BOÎTES DE LIGNE**, pas des
     espaces optiques : **33** (numéro → titre), **17** (titre → corps), **11** (corps →
     note) — c'est cette somme qui fait retomber la carte sur ses 270 px. La demi-interligne
     est déjà retranchée, cf. le piège plus haut. Le numéro porte un `margin-top` négatif
     égal au padding : en `line-height: 1` la boîte de Barlow Condensed dépasse de ~18 px
     au-dessus des chiffres.
   - Les titres 02, 03 et 04 portent un `<br class="br-lg">`, comme sur la maquette.
     Neutralisé sous 900 px.
4. **Fidélité** — ✅ FAIT (05/09/2026). ⚠️ Rien à voir avec ce que décrivait l'ancienne
   version de ce fichier : c'est une **photo pleine largeur** (l'échange du QR code au
   comptoir), et **« Fidéliser vos clients » appartient à la section 5, Commerçant**.
   - Relevés (maquette 1440) : la bande photo va de **y=1640 à y=2772**, soit **1440 × 1133**.
     Sur la maquette 390 : **y=1405 → 2501** (390 × 1097).
   - Contenu : eyebrow « FIDÉLITÉ » (blanc) → titre **« Achetez local / et cumulez / des
     points »** en 3 lignes (Barlow Condensed 800 DROIT, 78/70 à 1440, 37,3/33,5 à 390 —
     le seul rôle display qui ne suit pas `--fs-display-xl`, d'où `--fs-fid-titre`) →
     paragraphe `.lead` **sous le titre, à gauche** → **4 cartes crème** 318,5 × **220**
     (numéro + titre seulement, ni corps ni note).
   - **Aucun voile sombre** : la comparaison au pixel entre la maquette et la photo source
     montre un écart de ±10/255, c'est-à-dire rien. Ce que l'ancienne note prenait pour un
     voile est l'éclairage de la photo elle-même.
   - ⚠️ **LE PARAGRAPHE A ÉTÉ DÉPLACÉ le 06/09/2026** (demande Sylvain, capture annotée) :
     la maquette le pose dans les **colonnes 9-12**, en bas à droite de la bande ; il est
     désormais **sous le h2, dans la colonne de gauche** (1-6, largeur plafonnée à 539 comme
     celui de Commerçant), avec **l'écart titre → paragraphe de la section Commerçant**
     (`--fid-texte-mt` = `--com-texte-mt` : 63,3 en desktop, 55,3 à 390).
     Conséquence : il est **blanc aux deux tailles**. L'ancienne règle « noir en desktop,
     blanc sous 900 » ne vaut plus — il ne tombe plus sur la table claire mais sur la photo,
     comme le titre. En mobile rien ne bouge : il suivait déjà le titre.
   - **Photo** : `assets/images/photo-commercants.webp` (4232 × 5948, 539 Ko), posée en
     `<img>` absolu + `object-fit: cover`, `object-position: center 74%` (cadrage relevé).
     Sous 900 la bande est bien plus haute que large : `cover` y montre **toute la hauteur**
     et rogne les côtés — exactement le cadrage de la maquette mobile —, le 74 % n'y joue plus.
   - ⚠️ **Les cartes passent à 2 par rangée dès 390**, contrairement à celles de Mobilité qui
     s'empilent. Raison : la bande est une photo. Empiler les 4 cartes doublerait sa hauteur
     et `cover` rognerait la photo à outrance (on ne verrait plus qu'un tiers de sa largeur).
     La typo des cartes est donc réduite pour cette section (numéro 56, titre 14 à 390) via
     des overrides de tokens portés par `.fidelite`, **annulés dans le bloc ≥900**. Elle
     reste lisible — la maquette, elle, descend à 9,6 px de titre.
   - La 1re rangée de la grille desktop a une **hauteur figée** (`643 * var(--px)`) : si le
     paragraphe gagnait une ligne, les cartes ne bougeraient pas de leur y=2493.
   - ⚠️ **AU-DELÀ DE 1440 CETTE BANDE GRANDIT — c'est la seule hauteur du site qui ne se
     fige pas, et c'est voulu** (05/09/2026, écran 2560 × 1440 de Sylvain). La photo est en
     `cover` et son ratio (0,7115) est bien plus étroit que celui de la bande : `cover` la
     cale donc sur la **largeur** et rogne la **hauteur**. Bande figée à 1133 + largeur qui
     grandit = zoom pur — à 2560 on ne voyait plus que **31 %** de la hauteur de la photo
     (56 % sur la maquette) : les téléphones débordaient de leur place et le titre blanc
     atterrissait sur l'écran QR, illisible. La hauteur suit maintenant la largeur
     (**1133/1440**), donc le cadrage est une **homothétie exacte de la maquette à toute
     largeur**. Le supplément de hauteur est le token **`--fid-rab`**
     (`max(0px, calc(100vw * 1133 / 1440 - 1133px))`, **nul jusqu'à 1440**, donc rien ne
     change de 900 à 1440) ; il est ajouté à la **1re rangée**, si bien que les cartes restent
     collées au bas de la bande et le bloc titre + paragraphe en haut. Le blanc supplémentaire tombe au milieu, sur la photo.
     La typo, elle, **reste figée** à 1440 : le titre devient simplement plus petit par
     rapport à la photo, et il retombe sur le fond flou (plantes / étagère).
5. **Commerçant** — ✅ FAIT (05/09/2026). Bande jaune de **y=2773 à 3543** (1440 × **771**)
   en desktop, **y=2502 à 3025** (390 × **524**) en mobile.
   - ⚠️ **Le jaune y est un APLAT `--jaune` `#ffdd0d`**, relevé aux quatre coins — **ni le
     dégradé du hero, ni la trame de rues, ni voile**. Le token `--voile` qui traînait dans
     la feuille (hérité de l'ancienne description de cette section) a été supprimé.
   - Contenu : eyebrow « COMMERÇANT » (blanc) → **« Fidéliser / vos clients »** en blanc,
     Barlow Condensed 800 **DROIT** — c'est le **même rôle** que « Achetez local » de la
     section Fidélité, d'où la classe partagée **`.titre-section`** et le token renommé
     **`--fs-titre-section`** (ex-`--fs-fid-titre`) → paragraphe `.lead` **noir** `#2a292e`
     → **bouton unique** « Télécharger l'appli », qui remplace le label + les deux badges
     de la maquette et **démarre là où le label démarrait** (même règle que le hero).
   - Relevés desktop (capitales, band top = 0) : eyebrow **68**, titre **168** (2 lignes,
     interligne 70), paragraphe **365** (3 lignes de 24), label 484, badges 514 → 564.
     En boîtes de ligne (demi-interligne retranchée) : `--com-pt` **62**,
     `--com-titre-mt` **69**, `--com-texte-mt` **63,3**, `--com-dl-mt` **47,1**,
     `--com-pb` **240,8**. Mobile : 37,3 / 49,6 / 55,3 / 98,3 / 51,7.
   - Le paragraphe tient dans les **colonnes 1-5** (`max-width: 539`) : il retombe sur les
     3 lignes de la maquette (4 en mobile, pleine largeur).
   - Sous 900 le bloc de téléchargement est **centré**, comme dans le hero.
   - ⚠️ `.commercants__dl` est en **`display: flex`**, pas en `text-align: center` : le
     bouton est un `inline-block`, il s'asseyait sinon sur la ligne de base et sa boîte
     prenait 6,4 px de plus — la bande finissait à 777 au lieu de 771.
   - ⚠️ **La moitié droite de la bande est VIDE** (zéro pixel non jaune au-delà de x=800,
     vérifié) **et il reste 240 px de jaune sous le bouton** en desktop, contre 52 en
     mobile. Repris tel quel, mais c'est sans doute là que devait aller un mockup :
     cf. la question posée à Sylvain.
6. **Piliers** — ✅ FAIT (05/09/2026). Fond **blanc pur** `#ffffff` (relevé, pas le crème),
   **y=3544 → 3753** (210 de haut) en desktop, **y=3027 → 3438** (412) en mobile.
   Attirer / Fidéliser / Contribuer : picto sable **40 × 40** (`picto-magasin` /
   `picto-cadeau` / `picto-trajet`), titre en `--sable` (Barlow Condensed 800, cap 28 →
   **38,7**), puis deux lignes de texte **NOIR `#2a292e`** — l'ancienne note « texte gris »
   était fausse, relevé au pixel le plus sombre. Le token `--gris-texte` inutilisé a été
   supprimé.
   - ⚠️ **Les colonnes sont les TIERS DE LA PAGE, pas la grille de 12** : les deux traits
     verticaux tombent pile sur **x=480 et x=960**. Le bloc est donc plafonné à 1440 et
     centré, **sans les marges de 65 du `.container`**.
   - ⚠️ **Le TITRE SEUL est centré ; le picto déborde à sa gauche.** Les trois titres ont
     leur milieu exactement sur 240 / 720 / 1200, alors que le groupe picto+titre est
     décalé de **28,5 = (40 + 17) / 2**. D'où le picto en `position: absolute` sur
     `right: 100%` du titre, et non un flex centré. Écart picto → titre : **17** (12 à 390).
   - Traits : **2 × 60** en desktop, posés à cheval sur la limite de colonne, de y=3619 à
     3678 (soit 35 sous le haut du pilier). En mobile ils passent à l'**horizontale**,
     **60 × 1**, centrés entre deux piliers (36,5 dessus, 37 dessous).
   - Rythme desktop (boîtes) : `--pil-pt` **40**, titre 38,7, `--pil-texte-mt` **30,4**,
     texte 2 × 16, `--pil-pb` **68,9** → 210 pile. Mobile : 35 / 26,3 / 14,8 / 38,5.
   - ⚠️ **Le texte reprend le rôle du corps de carte** (Inter **14 / 16**, `--fs-card-text`,
     plancher 12) : la maquette mobile descend à **9,6 px**, refusé — même arbitrage que
     pour les cartes. Conséquence assumée : la bande mobile fait **~442** au lieu de 412.
   - ⚠️ `.pilier` est une **colonne flex** (`align-items: center`) et non un bloc en
     `text-align: center` : le titre est un `inline-block`, il s'asseyait sinon sur la ligne
     de base et le texte descendait de 1,8 px de trop (même piège que le bouton Commerçant).
   - Le `<br>` du texte reproduit la coupure des DEUX maquettes, identique en mobile et en
     desktop ; il n'empêche pas le repli naturel si la fenêtre devient très étroite.
6 bis. **Nos partenaires** — ✅ FAIT (05/09/2026). **Section HORS MAQUETTE**, demandée par
   Sylvain d'après la bande « slice » de maneuver.be, placée **entre les Piliers et En
   savoir plus**. Bandeau de **200 de haut** (160 sous 900 = 0,80 × 200, donc continu au
   breakpoint), eyebrow « Nos partenaires » centrée, logos en **défilement infini doux de
   la gauche vers la droite** (28 s par tour).
   - ⚠️ **Les logos ont été RETIRÉS du footer** pour venir ici. Le footer ne garde que les
     bulles et les mentions, et retombe à **211** de haut (au lieu de 227).
   - ⚠️ **2e passe le 05/09/2026** : fond **crème**, logos **noirs** à **60 de haut**,
     titre en **sable**, écart titre → logos doublé (**60**), et défilement inversé
     (**de la droite vers la gauche**). **3e passe** : logos à **100** de haut (63 à 390) et
     bandeau à **300** (240 à 390) — 26 + 60 + 100 = 186 centrés dans 300, soit 57 d'air
     au-dessus du titre, ce que Sylvain demandait. Les assets n'existaient qu'en blanc : les fichiers
     `logo-ville-de-fleurus-noir.svg`, `logo-wallonie-noir.svg` et `logo-shop-in-noir.svg`
     ont été **fabriqués** à partir des blancs en remplaçant `#fff` par `#2a292e`
     (digitalwallonia avait déjà sa version foncée). Refaire de même si un partenaire
     livre un nouveau logo.
   - ⚠️ **Le bandeau et « En savoir plus » sont désormais du même crème** : il n'y a plus
     de rupture visible entre les deux, ils se lisent comme un seul bloc clair. C'est le
     choix de Sylvain ; si une séparation est voulue, il faudra un filet ou un fond blanc.
   - Le titre sable sur crème est à **1,35:1** — il rejoint la liste des contrastes hors
     normes (question 16).
   - ⚠️ **Mécanique : DEUX pistes identiques côte à côte**, chacune en `min-width: 100%`,
     et on translate l'ensemble de **−100 %** (= exactement une piste). Quand la première
     sort à droite, la seconde est pile à sa place. C'est ce qui rend le bandeau
     indépendant de la largeur de l'écran — une piste unique translatée de −50 % laisserait
     des trous dès que l'écran dépasse la moitié de la piste. La seconde piste est en
     `aria-hidden` : les partenaires ne doivent pas être lus deux fois.
   - ⚠️ **La VITESSE est constante sur tous les écrans : 50 px/s** (demande Sylvain,
     05/09/2026). Impossible en CSS pur — aucune conversion longueur → temps — donc
     `script.js` (bloc 4) calcule `durée = largeur ÷ 50` et la réécrit à chaque
     redimensionnement (ResizeObserver). Mesuré : 10,9 s à 390, 28,5 s à 1440, 50,9 s à
     2560, soit exactement 50 px/s partout. La valeur CSS `--part-duree: 28s` ne sert plus
     que de repli si le JS ne tourne pas.
   - Le défilement se met en **pause au survol et au focus clavier**. ⚠️ WCAG 2.2.2 exige
     un moyen de mettre en pause tout contenu qui bouge seul plus de 5 s ; un bouton pause
     explicite serait plus strict — question 18.
7. **En savoir plus** — ✅ FAIT (05/09/2026), hors illustration. Fond **crème** `#fffbf0`,
   **y=3754 → 4648** en desktop, à partir de **y=3439** en mobile. Tout est **centré**.
   - Titre « En savoir plus » en `--jaune`, Barlow Condensed 800 droit, **cap 85 → 117,6**
     (33,2 à 390) — c'est le plus gros texte du site après le titre SVG du hero, d'où un
     token à lui, `--fs-esp-titre`.
   - Paragraphe **noir**, **27,5 / interligne 30,5** en desktop (16 / 19 à 390) : ni le
     chapô (20/24) ni le corps de carte, encore un rôle à part → `--fs-esp-texte` +
     `--lh-esp-texte` (interligne **en px**, pas en ratio : les deux bouts n'ont pas le
     même). Largeur **6 colonnes = 649** : c'est elle qui redonne les 3 lignes du relevé
     (4 en mobile), aux mêmes coupures de mots.
   - Pastille **fleurus.be** : le composant `.btn-dl` en variante `--jaune` (fond jaune,
     texte noir, même noir qui remonte au survol). Relevé 180 × 38 (168 × 34 à 390) ;
     paddings **37 / 7,3**. ⚠️ Rendue elle fait **196 de large** : Inter est plus large que
     la Lufga de la maquette. Conforme à la règle « on cale sur la HAUTEUR, jamais sur la
     chasse » — la hauteur, elle, tombe pile (38).
   - Rythme (boîtes) : `--esp-pt` **126**, titre 117,6, `--esp-texte-mt` **44,15**,
     paragraphe 3 × 30,5, `--esp-cta-mt` **24,75**, pastille 38. Mobile : 72,8 / 40,3 / 36,7.
   - ⚠️ **Écart pastille → skyline augmenté à 170** (150 à 390) le 05/09/2026, contre 94
     au relevé : la maquette manquait d'air à cet endroit (demande Sylvain).
   - ⚠️ L'enveloppe de l'illustration a un `margin-bottom: -1px` : le recadrage tombait
     rarement sur un pixel entier et laissait un filet plus clair sur toute la largeur,
     entre la colline et le footer.
   - ⚠️ `--esp-pb` (**119**) n'est pas le bas de la bande : c'est l'écart relevé entre la
     pastille et le **sommet de l'illustration skyline** (y=4314 en desktop, 3821 en
     mobile), qui occupe toute la hauteur restante et reste **à faire**.
8. **Skyline + route** — ✅ FAIT (05/09/2026). `assets/images/illustration-skyline.svg`, posé
   en `<img>` **pleine largeur** au bas de la bande crème, **hors du `.container`**.
   - ⚠️ **Le SVG contient déjà le footer.** Son viewBox fait 859,11 × 355,11 : les
     **217,81 premières unités** sont la colline (un masque interne du fichier), les
     **137,3 restantes un aplat noir `#2a292e`**. On n'en garde donc que le masque —
     `aspect-ratio: 859.11 / 217.81` sur une enveloppe en `overflow: hidden` — et le vrai
     footer prend le relais exactement là où l'aplat commençait. Les deux noirs étant le
     même, la couture est invisible.
   - ⚠️ **Le dessin déborde très largement du viewBox** (bbox réelle : x de −436 à 1295) :
     la colline est un cercle énorme que le viewBox recadre. Ne pas s'étonner d'un
     `getBBox()` géant, et ne jamais recadrer le fichier sur son contenu.
   - Modèle vérifié sur les deux maquettes : l'illustration est **dessinée à 100 % de la
     page**. À 1440, haut du viewBox **y=4290**, pointe du clocher 4314 (= 14,4 unités plus
     bas), aplat noir à 4655 (footer relevé à 4652) ; à 390 : 3814,5 / 3821 / 3913
     (footer 3911). L'écart pastille → haut du viewBox est `--illu-mt` : **94** (83,5 à 390).
   - Elle **continue de grandir au-delà de 1440** (100 % de la page, comme la photo de
     Fidélité) : c'est ce qui garantit que l'arc de la colline touche toujours les deux
     coins. À 2560 elle est donc 1,8 × plus haute — c'est le comportement voulu d'une
     illustration pleine largeur, mais **à valider avec Sylvain**.
   - `aspect-ratio` et non une hauteur en `vw` : `vw` inclut la barre de défilement.
9. **Footer** — ✅ FAIT (05/09/2026). ⚠️ **Le logo Move in blanc occupe la place des
   anciens logos partenaires, à gauche** (demande Sylvain, 2e passe) : 65 de haut à 1440,
   44 à 390, repris du sprite `#logo-move-in` (donc recolorable).
   ⚠️ **Sa largeur est EXPLICITE en CSS** (`height × 1,19945`, le ratio du viewBox) **ET
   il porte des attributs `width`/`height`** comme celui du header : en `width: auto` il
   se faisait rogner par le `svg { max-width: 100% }` global et le logo était coupé au
   « e » de Move. Les attributs sont la ceinture en plus des bretelles — ils donnent au SVG
   une taille intrinsèque, donc même une feuille de style ancienne ou absente ne peut plus
   l'écraser. C'est exactement le piège déjà noté plus bas dans
   « Organisation des fichiers » — il s'est représenté, ne pas l'oublier une 3e fois. Les bulles restent à
   droite ; sous 900 la rangée s'empile et se centre. Le footer fait maintenant **240** à
   1440 au lieu de 211. Noir `#2a292e`, **227 de haut sur LES DEUX maquettes**
   (desktop y=4655 → 4882, mobile 3913 → 4140). Il démarre pile là où l'illustration est
   coupée : même noir, couture invisible.
   - ⚠️ **Marges latérales de 120**, et non les 65 du reste du site : bulles et mentions
     s'alignent sur x=120 et x=1320, relevé aux deux bouts. D'où `.footer__inner`, qui ne
     réutilise pas `.container`.
   - Rangée 1 : **logos à gauche, bulles à droite** en desktop ; sous 900 les **bulles
     passent AU-DESSUS** des logos (`order: -1`) et tout est centré, comme sur la maquette.
   - Logos à leur **taille naturelle** à 1440 (boîte de 51,6 pour Ville de Fleurus,
     Wallonie et Shop In ; 39,01 pour digitalwallonia), 0,63 × à 390. Écart **53**.
     ⚠️ Le logo Shop In utilisé est **`logo-shop-in-blanc.svg`**, une version tout-blanc
     livrée par Sylvain le 05/09/2026 — les variantes `blanc-noir` et `blanc-jaune`
     embarquent une seconde couleur (le noir se fondait dans le fond, le jaune serait
     apparu à tort).
   - Bulles : **36** de diamètre, écart **12**, **icône 20** — valeurs **Illustrator** données
     par Sylvain (05/09/2026), et elles retombent pile sur le relevé : 3 × 36 + 2 × 12 = 132,
     soit le bloc 1188 → 1320. (Mon relevé au pixel disait 37 / 11 / 26,5 : l'antialiasing
     ajoutait un pixel au cercle, et j'avais supposé à tort que l'icône était à sa taille
     naturelle de 26,51. **En cas de doute, la valeur Illustrator prime.**)
     ⚠️ **En mobile les bulles sont DOUBLÉES par rapport au relevé** : **40** au lieu des
     20 mesurés à 390, écart **14**, icône **22,2** (demande Sylvain, 05/09/2026 — à 20 px
     elles étaient minuscules au pouce). Tout le groupe est doublé, la proportion 20/36 de
     la maquette est donc conservée, et les trois échelles redescendent vers l'homothétie
     à 900 (28,8 / 9,6 / 16) : rien ne saute au breakpoint. Effet de bord bienvenu, la
     cible tactile passe de 20 à 40 px — au-dessus du minimum de 24 px de WCAG 2.2.
     Le footer mobile fait donc **269** au lieu de 249.
     Blanches à icône noire au repos ; **fond jaune + icône blanche au survol** — c'est
     exactement l'état que montre la bulle Facebook de la maquette, dessinée en survol.
     Les trois icônes sont **inline** (sprite `<symbol>` + `<use>`, `fill: currentColor`) :
     aucune classe interne dans ces fichiers, donc rien à préfixer.
   - Mentions : Inter Bold **14** majuscules (cap 10 relevé), blanches, © à gauche et les
     deux liens à droite. **« Politique vie privée » et « Conditions générales » ont le
     MÊME soulignement animé que la nav** (demande Sylvain, 05/09/2026) : l'effet a été
     sorti dans un rôle partagé **`.souligne`** (section 03 de la feuille de style), que
     portent désormais les liens de la nav comme ceux du footer. `.nav-link` ne garde que
     sa typo. Le trait est un `::after` absolu : il ne prend aucune place, la rangée de
     mentions reste à 157 et le footer à 227. ⚠️ La maquette mobile descend à **9 px** pour les tenir sur une
     seule ligne : refusé, on garde **12** et la ligne se replie en deux — le footer mobile
     fait donc **250** au lieu de 227.
   - ⚠️ Notre rangée de logos est calée sur la marge (x=120) alors que la maquette la
     décale de 13 px vers la droite, sans raison identifiable ; les logos s'alignent ainsi
     avec le « © » du dessous. Le 4e logo est à 481 au lieu de 472 (écart uniforme de 53
     plutôt que les 53 / 53 / 44 relevés).

## Bouton de téléchargement

⚠️ **La charte a de nouveau changé (05/09/2026) — les badges stores sont supprimés.**
Décision Sylvain : plus de label « Téléchargez maintenant », plus de deux pastilles, mais
**un seul bouton pilule** portant le texte **« Télécharger l'appli »** (`.btn-dl`).

- **Repos** : fond **blanc**, texte **noir**. **Survol** : le **noir** remonte du bas vers
  le haut (`scaleY` depuis `transform-origin: bottom`, la mécanique des anciens badges) et
  le texte passe au **blanc**. Pas d'ombre, pas de déplacement.
- Typo : Inter **Bold**, **majuscules**, `--fs-eyebrow-sm` (20 à 390 · 16 à 1440) et le
  tracking `--ls-label`. `text-indent: var(--ls-label)` recentre le texte, le tracking
  ajoutant un blanc après la dernière lettre.
- **Le bouton prend sa taille au CONTENU**, mobile comme desktop : rien à interpoler pour
  la largeur, elle suit la typo et les paddings — donc **aucune cassure au breakpoint**.
  Paddings `--btn-dl-py` / `--btn-dl-px` : **18 / 32** à 390, **12 / 25,6** à 900
  (= 15 / 32 × 0,80, le plancher de `--px`), **15 / 32** en pixels de maquette au-dessus.
  Hauteur à 1440 : 16 × 1,3 + 2 × 15 ≈ **50**, celle des anciennes pastilles.
- **Détection du store, en JS** (fin de `<body>`) : le `href` du HTML pointe le **Google
  Play** et sert de **repli** (PC Windows / Linux : pas de « bon » store) ; le script le
  remplace par l'**App Store** sur iPhone / iPad / Mac, par le **Play Store** sur Android.
  Les deux URL sont portées par `data-store-ios` / `data-store-android`.
  ⚠️ On réécrit le `href` **au chargement**, pas au clic : le lien reste un vrai lien
  (clic milieu, « copier l'adresse », clavier) et il est déjà correct avant le premier clic.
  iPadOS 13+ se déclarant « Macintosh », il est démasqué par `maxTouchPoints > 1`.
- ⚠️ **Le `text-indent` de recentrage vaut la MOITIÉ du tracking**, pas sa totalité :
  le tracking n'ajoute un blanc qu'après la DERNIÈRE lettre, il faut donc rattraper la
  moitié de ce blanc. L'ancienne valeur (tracking entier) poussait le texte 1,1 px trop à
  droite — écart mesuré sur la pastille « fleurus.be », signalé par Sylvain.
- ⚠️ **Il y a maintenant DEUX boutons de téléchargement** (hero = appli citoyen, section
  Commerçant = appli commerçant) : le script fait un `querySelectorAll` et traite **chacun
  avec SES propres** `data-store-*`. Ne pas revenir à un `querySelector` — le second bouton
  pointerait alors vers la mauvaise appli.
- ⚠️ …et un **TROISIÈME `.btn-dl` qui n'est pas un bouton de store** : la pastille
  « fleurus.be » de la section En savoir plus (`.btn-dl--jaune`). Le script filtre donc sur
  **`.btn-dl[data-store-ios]`** et non sur `.btn-dl` seul.
- Les liens des quatre stores sont **renseignés**, cf. « Liens réels ».
- Les SVG `badge-*.svg` restent dans `assets/icons/` mais **ne sont plus utilisés** ; les
  règles CSS `.badges` / `.badge` et leurs tokens ont été supprimées.
- ✅ **Reconduit en section Commerçant** (05/09/2026) : même bouton, même mécanique, les
  URL de l'appli commerçant.

## Liens réels

- « En savoir plus » → `https://fleurus.be/move-in-fleurus/`
- Réseaux / site appli → `https://movein.fleurus.be`
- Appli **citoyen** — App Store `id6751238428` · Google Play `be.fleurus.rwb`
- Appli **commerçant** — App Store `id6751838735` · Google Play `be.fleurus.rwb**c**`
  (donnés par Sylvain le 05/09/2026 ; attention au `c` final côté Android, c'est le seul
  caractère qui distingue les deux applis)

## Organisation des fichiers

```
move-in-fleurus/
├── index.html
├── styles.css
├── script.js     (burger + routage des stores — chargé en `defer`)
├── commentaires/ (copie de référence des 3 fichiers, cf. « Copie commentée » plus bas)
├── CLAUDE.md
├── maquette/     (Maquette desktop 1440.png — 1440 × 3908, seule référence)
└── assets/
    ├── logos/    (Move in noir/blanc/jaune, Ville de Fleurus, Wallonie, Shop In, digitalwallonia)
    ├── icons/    (badges stores, réseaux, pictos mobilité, pictos piliers, pins)
    └── images/   (mockup iPhone hero, photo commerçants, skyline+route, trame de rues, titre hero)
```

- **Chemins relatifs** (`assets/…`), jamais de base64 en production.
- ✅ **Tous les assets ont été renommés** en minuscules kebab-case, sans espaces ni accents.
  Repères : `logo-move-in-blanc.svg` · `badge-app-store-noir.svg` · `badge-google-play-blanc.svg` ·
  `picto-{trajet,magasin,cadeau}-sable.svg` · `carte-fleurus-jaune.svg` ·
  `titre-rejoignez-le-move.svg` · `mockup-iphone-hero.png` · `photo-commercants.webp` ·
  `illustration-skyline.svg`.
  ✅ **Plus rien à renommer** : `Mockup iPhone - Mobilité - 02.webp`, le dernier fichier
  hors convention, a été **supprimé par Sylvain** le 06/09/2026. `assets/images/` ne
  contient plus que des fichiers utilisés, tous en kebab-case, pour **816 Ko au total**.
- ✅ **Le poids des photos est réglé.** Les deux JPG pleine définition (18,5 et 20,3 Mo)
  ont disparu du dossier ; Sylvain a livré des **WebP** à leur place. `Mockup Iphone -
  Commercant.webp` (539 Ko) a été **renommé `photo-commercants.webp`** le 05/09/2026 pour
  respecter la convention kebab-case — c'est la photo de la section Fidélité.
- **Pas d'accent dans les identifiants** (ids, classes, noms de variables CSS) : `#mobilite`,
  `.mobilite`, `--mobilite-pb`, `#fidelite`. Les accents restent dans le TEXTE visible.
- SVG inline uniquement quand il faut les recolorer via CSS ; sinon `<img>`.
  → C'est le cas du **logo Move in** (survol blanc → noir) : il est déclaré **une seule fois**
  en `<symbol id="logo-move-in">` dans un sprite invisible en haut du `<body>`, puis appelé
  par `<use>` (header + menu). Ses `fill` en dur sont remplacés par `fill: currentColor`.
- Attention : plusieurs SVG exportés partagent des classes internes (`.cls-1`…). Si tu en
  inlines plusieurs, **préfixer/namespacer** ces classes pour éviter qu'ils se recolorent
  entre eux. (Concerné notamment : `illustration-skyline.svg`.)
- Piège rencontré : un SVG inline en `width: auto` se fait rogner par le `svg { max-width: 100% }`
  global. Toujours donner une **largeur explicite** calculée depuis le ratio du `viewBox`.

## Rôles partagés et tokens communs (passe DRY du 06/09/2026)

La feuille de style avait plusieurs fois la même valeur à deux endroits. Rien n'a bougé
à l'écran (vérifié : **54 repères mesurés dans le navigateur, un seul écart, volontaire**,
cf. le dernier point). Ce qui a changé, c'est **où vit la valeur** :

- **`.logo` est le seul endroit où le logo Move in est dimensionné.** Le SVG du footer
  porte maintenant `class="logo footer__logo"` et `.footer__logo` ne fait plus qu'une
  chose : `--logo-h: var(--foot-logo-move)`. ⚠️ Ce n'est pas cosmétique — la largeur
  explicite et le ratio **1,19945** qui empêchent le « e » de Move d'être rogné n'existent
  plus qu'à UN seul endroit. Deux copies, c'étaient deux occasions de perdre le garde-fou.
- **`:is(.header__inner, .menu__top)`** — une seule règle pour le bandeau du header et
  celui du menu mobile. C'est elle qui garantit que le logo ne bouge pas d'un pixel à
  l'ouverture du menu ; s'ils doivent diverger un jour, les redissocier ici plutôt que
  d'ajouter une surcharge ailleurs.
- **`.souligne` est réglable** : `bottom: var(--souligne-bottom, 0)`. Le menu mobile avait
  sa propre copie du `::after`, identique au pixel sauf ce `bottom` ; il porte maintenant
  la classe et pose `--souligne-bottom: .06em`. Le rôle sert donc à **trois** endroits :
  nav desktop, liens légaux du footer, liens du menu.
- **`.display` est porté dans le HTML** par « Bougez / Cumulez / Profitez » et par les
  liens du menu, au lieu d'être recopié. ⚠️ Les surcharges de `.hero__mots`
  (`--fs-display-xl` / `--lh-xl` au lieu de `--fs-display-l` / `--lh-tight`) ne tiennent
  que parce que la règle est **plus bas dans le fichier** : même spécificité, c'est
  l'ordre qui tranche. Ne pas remonter `.hero__mots` au-dessus de `.display`.
- **`--carte-pb` supprimé** : il valait toujours `--carte-p`, aux quatre endroits où il
  était défini. `.carte` est en `padding: var(--carte-p)` tout court. Si le bas doit un
  jour différer, le recréer.
- **`--lh-card-text` (1,1429)** : l'interligne du corps de carte, partagée avec le texte
  des piliers — les deux valeurs de ce rôle (`--fs-card-text` + celle-ci) ont maintenant
  une source unique, ce que le fichier disait déjà en prose sans le faire en code.
- **`--titre-texte-mt` et `--lead-w`** remplacent `--fid-texte-mt` / `--com-texte-mt`
  (qui étaient devenus le même nombre) et les deux `max-width: calc(539 * var(--px))`.
  Fidélité et Commerçant ont exactement les mêmes relevés : même titre
  (`--fs-titre-section`), même écart titre → paragraphe, même largeur de paragraphe.
  Les trois tokens sont groupés dans le `:root` desktop de Fidélité.
- **Les deux `:root` consécutifs** du `@media` du hero sont fusionnés.
- ⚠️ **Le seul changement visible, assumé** : les liens du menu mobile gagnent le
  `letter-spacing: .005em` du rôle `.display`, qu'ils n'avaient pas — **0,34 px par
  lettre** à 68 px, soit 2,7 px sur « Mobilité ». C'est la valeur du rôle et ce sont bien
  des titres display. Pour l'annuler : `letter-spacing: normal` sur `.menu__list a`.

**Ce qui n'a PAS été touché**, et pourquoi : les **11 blocs `@media (min-width: 900px)`**
séparés. C'est l'organisation par section — chaque section garde ses tokens à côté de ses
règles — et le navigateur les fusionne de toute façon. Les regrouper coûterait en
lisibilité pour zéro gain.

## Copie commentée (`commentaires/`)

`commentaires/` contient une copie de `index.html`, `styles.css` et `script.js` **tels
qu'ils sont écrits**, avec tous leurs commentaires, plus un `LISEZ-MOI.md`. Demandée par
Sylvain le 06/09/2026, avant la passe d'optimisation.

⚠️ **Cette copie ne se met pas à jour toute seule et il n'y a pas de build pour la
régénérer.** Elle a été resynchronisée après la passe DRY ; à refaire à chaque
modification de fond, sinon elle ment. C'est Git qui tient l'historique, pas ce dossier.

✅ **Décision prise le 06/09/2026 : les commentaires ont été retirés des fichiers déployés.**
Mesures avant / après :

| | brut | gzip (ce que GitHub Pages envoie) |
|---|---|---|
| `styles.css` commenté (→ `commentaires/`) | 75,8 Ko | ~25 Ko |
| `styles.css` déployé | **29,4 Ko** | **7,4 Ko** |
| `script.js` commenté (→ `commentaires/`) | 8,0 Ko | — |
| `script.js` déployé | **4,3 Ko** | **1,5 Ko** |

Les commentaires faisaient **57 % de la feuille de style**, soit ~17 Ko sur le fil à chaque
première visite. Le code déployé pèse maintenant **55 Ko au total, 9 Ko compressé**.

⚠️ **Vérifié, pas supposé** : les 54 repères de rendu ont été remesurés dans le navigateur
en basculant la feuille de style entre les deux versions — **strictement identiques**,
hauteur de page comprise. Le JS a été retranscrit à la main (les `//` dans les URL rendent
un dépouillement automatique dangereux) puis comparé ligne à ligne, commentaires neutralisés :
**111 lignes de code identiques des deux côtés**.

## Dépôt et mise en ligne

Le site est publié sur **https://valvasyl.github.io/movein-fleurus-site/** à chaque push sur
`main` (GitHub Pages, branche `main`, racine). Comptez une à deux minutes après le push.
Vérifié au déploiement : 16 ressources, aucune en échec, 738 Ko au total, toutes les
sections aux bonnes hauteurs. Les chemins sont tous relatifs, le site fonctionne donc dans
son sous-dossier.

## Workflow

- **Une tâche à la fois**, montrer le résultat avant de continuer.
- ⚠️ **Servir avec `npx http-server -p 8000 -c-1`, PAS avec `npx serve`.** `serve`
  n'envoie pas d'en-tête `Cache-Control` : le navigateur de Sylvain gardait l'ancienne
  feuille de style et il voyait des corrections « qui ne marchent pas » alors qu'elles
  étaient bien en place (arrivé deux fois le 05/09/2026 : le smooth scroll et le logo du
  footer). `-c-1` envoie `no-cache, no-store, must-revalidate`.
- Aperçu local : **Python n'est pas installé sur cette machine**, `python3 -m http.server`
  ne marche pas. On sert le dossier avec **Node** (petit serveur statique) sur
  `localhost:8000`. Sylvain regarde le rendu **en direct dans son navigateur** — inutile
  de produire des captures.
- Pour mesurer la maquette au pixel plutôt qu'à l'œil, des scripts PowerShell
  (`crop.ps1` / `pick.ps1` / `scan.ps1`, dans le scratchpad de session) permettent de
  recadrer une zone, relever une couleur et sortir la bounding box d'un élément.

## Ordre de construction

| # | Section | État |
|---|---------|------|
| 0 | Socle : tokens, `.container`, `.grid`, rôles typo | ✅ fait |
| 1 | Header + burger + menu mobile | ✅ fait |
| 2 | Hero | ✅ fait |
| 3 | Mobilité (4 cartes) | ✅ fait |
| 4 | Fidélité (photo + 4 cartes) | ✅ fait |
| 5 | Commerçant (bande jaune) | ✅ fait |
| 6 | Piliers | ✅ fait |
| 7 | En savoir plus (texte) | ✅ fait |
| 8 | Skyline + route | ✅ fait |
| 9 | Footer | ✅ fait |
| 10 | Passe finale : a11y, contrastes, 320→1920, poids des images | ⏳ suivant |

**Point d'arrêt du 05/09/2026.** Header, hero, cartes Mobilité et section **Fidélité**
conformes aux deux maquettes. La fidélité a été vérifiée dans le navigateur, pas seulement
sur le papier : eyebrow à y=95, titre à 190, paragraphe à 642, cartes à 853, section de
1132 de haut — soit les relevés au pixel près (1133). À 390 : 39 / 120 / 274 / 810.
Le bloc de téléchargement du hero est passé au **bouton unique**.

**Point d'arrêt du 05/09/2026 (soir).** La section **Commerçant** est faite et vérifiée dans
le navigateur : à 1440+ la bande fait **770,9** de haut (relevé 771), eyebrow 62, titre 157,
paragraphe 360,2 (3 lignes), bouton 479,3 ; à 390 elle fait **523,8** (relevé 524), 37,3 /
112,9 / 235,1 (4 lignes) / 410,1. Le **cadrage de la photo Fidélité au-delà de 1440** a été
corrigé le même jour (`--fid-rab`, cf. section 4).
Les **Piliers** ont suivi : bande de **210** au pixel en desktop (relevé 210), titres centrés
sur 240 / 720 / 1200, traits à 480 et 960 ; **441,8** en mobile au lieu de 412, écart assumé
(texte à 14 px et non aux 9,6 de la maquette).
**En savoir plus** a suivi (texte seul) : titre à 126, paragraphe à 287,7 en **3 lignes**
comme la maquette, pastille à 404 et haute de 38 pile ; à 390 : 72,8 / 146,3 (4 lignes) / 259.
L'**illustration skyline** a suivi : bande crème de **897** à 1440 (relevé 894, l'écart tient
à la couture noire, invisible) et **471,6** à 390 (relevé 472).
Le **footer** a suivi : **227** de haut au pixel en desktop, 250 en mobile (la ligne de
mentions s'y replie en deux, cf. section 9). La cale de dev `.dev-spacer` a été **supprimée**
du HTML comme de la feuille de style.

🎉 **LE SITE STATIQUE EST COMPLET** — les neuf sections y sont, des deux maquettes.
Il reste la **passe finale** (étape 10) : a11y et contrastes, tenue de 320 à 1920, poids des
images, puis la **Phase 2 — animations**. Et il manque **quatre URL** (Facebook, Instagram,
politique vie privée, conditions générales) : elles sont en `href="#"` avec un `TODO` dans
le HTML, cf. la question 14.

## Relevés déjà faits pour les sections suivantes

⚠️ Ces relevés datent de l'ANCIENNE maquette 1440 × 3908. La maquette actuelle fait
**1440 × 4882** : les `y` ci-dessous ne valent plus rien, seules les tailles d'objets
restent utilisables. Les `y` à jour sont dans « Structure du site ».

- ~~**Fin de la bande jaune** : `y = 1777`~~ → **1639** sur la maquette actuelle.
- **Badges** (obsolète depuis le 05/09/2026, conservé pour mémoire) : relevé maquette =
  pastille **133 × 45**, rayon plein, padding 20 × 11, SVG à sa taille naturelle
  (92,68 × 22,18), écart de 17. La section commerçants reprend désormais le **bouton
  unique** `.btn-dl`, pas les badges.

### Méthode de mesure

Ne pas estimer à l'œil sur une capture réduite : écrire de petits scripts PowerShell
(`System.Drawing`) qui recadrent une zone, relèvent la couleur d'un pixel, sortent la
bounding box des pixels sombres/blancs/non-jaunes d'une région, ou **diffèrent les deux
maquettes** (avec et sans grille) pour isoler l'overlay de colonnes. C'est ce qui a permis
de trouver les trois jaunes, le dégradé et les tailles réelles.

⚠️ **L'ancre `#mobilite` est sur le bloc `.hero__intro`** (l'eyebrow « MOBILITÉ » + le
chapô), et non sur la section des cartes : le lien de nav atterrissait sinon directement
sur les cartes, ce que Sylvain trouvait « trop bas ».
⚠️ Et ce bloc porte **`scroll-margin-top: var(--mobilite-air)`** = **200** à 1440 (160 sous
900) : c'est l'air demandé AU-DESSUS du mot « Mobilité », qui se collait sinon au bord haut
de l'écran. Vérifié : 199 px à 1440 et à 2560, 160 à 390 et 900. Le défilement est bien **progressif**
(`scroll-behavior: smooth`, vérifié : 685 px parcourus à 200 ms sur 1014 au total).

⚠️ **Les ancres de la nav calent le HAUT DE LA CIBLE sur le haut du viewport** :
`scroll-padding-top: 0` (demande Sylvain, 05/09/2026). Il valait `var(--header-h)`, une
réserve qui n'a pas lieu d'être puisque le header n'est pas sticky et ne recouvre rien.

## Passe finale (étape 10) — état au 05/09/2026

**Poids — ✅ réglé pour l'essentiel.** Le hero chargeait ~3 Mo, il en charge **143 Ko**.
- `mockup-iphone-hero.png` (2,72 Mo) → **`.webp` 84,6 Ko**, converti par Sylvain, HTML mis à jour.
- `carte-fleurus-jaune.svg` (la trame) : **222 → 101 Ko** via `svgo --precision=1`. Vérifié en
  rasterisant l'avant/après à l'échelle réelle d'affichage (3500 px) : 2,5 % de pixels
  diffèrent, uniquement de l'antialiasing de bord, invisible à l'œil sur un motif jaune sur
  jaune. L'original reste récupérable dans l'historique OneDrive.
- ✅ **RÉGLÉ le 06/09/2026 : plus aucun fichier lourd inutilisé.** Les deux PNG
  (`mockup-iphone-hd.png` 8,2 Mo et `mockup-iphone-hero.png` 2,72 Mo) avaient déjà disparu ;
  `Mockup iPhone - Mobilité - 02.webp` (687 Ko) a été **supprimé par Sylvain** le même jour.
  `assets/images/` fait désormais **816 Ko**, tout est utilisé.
- Piste restante : `photo-commercants.webp` (551 Ko, 4232 × 5948) est deux fois plus grande
  que nécessaire (2560 de large suffirait). Chargement différé, donc moins critique.

**Responsive — ✅ vérifié** de 320 à 1920 (320 · 360 · 480 · 700 · 899 · 901 · 1100 · 1440 ·
1920) : aucun débordement horizontal, aucun élément qui sort du cadre. Les sauts de hauteur
à 900 (hero −395, piliers −314, footer −81) sont le **changement de mise en page** (empilé →
colonnes), pas une cassure de typo : celle-ci reste continue, cf. l'ancrage à 0,80.

**Accessibilité — ✅ la structure est saine** : un seul `<h1>` (le SVG du hero, `alt`
« Rejoignez le Move »), hiérarchie h2/h3 cohérente avec des `h2` en `.sr-only` pour les
sections sans titre visible, `lang="fr"`, tous les `alt` présents, aucun lien sans nom
accessible, focus visible (`outline: 3px currentColor`), `prefers-reduced-motion` respecté,
skip-link, menu mobile `inert` quand fermé.

**Contrastes — ❌ 5 points sous le seuil, TOUS venus de la maquette.** Le texte courant est
irréprochable (10:1 à 14:1) ; ce sont les jeux blanc/sable/jaune sur fond clair qui tombent :

| Élément | Contraste | Exigé |
|---|---|---|
| « Bougez » / « Profitez » blancs sur le dégradé | **1,29:1** | 3:1 (grand texte) |
| « Scrollez pour découvrir » blanc sur le dégradé | **1,29:1** | 4,5:1 |
| Commerçant — eyebrow + « Fidéliser vos clients » blancs sur jaune | **1,35:1** | 4,5 / 3:1 |
| Piliers — titres sable sur blanc | **1,35:1** | 3:1 |
| En savoir plus — titre jaune sur crème | **1,30:1** | 3:1 |

⚠️ **Enjeu réglementaire, pas seulement esthétique** : le site d'une administration publique
wallonne est soumis à la directive UE 2016/2102 (WCAG 2.1 AA). **Décision Sylvain requise**,
cf. questions 1, 8, 13 et 16.

## ✅ LE LOGO N'EST PAS AMPUTÉ — diagnostic ERRONÉ, corrigé le 06/09/2026

⚠️ **Cette section disait exactement le contraire jusqu'au 06/09/2026.** Elle affirmait que
le « e » de Move était coupé net dans les quatre `logo-move-in-*.svg` et demandait de les
réexporter. **C'était faux.** Sylvain a rouvert les fichiers, ils sont intacts. Vérifié
ensuite de mon côté, deux fois :

- **Rendu du fichier seul** (`logo-move-in-noir.svg` affiché à 300 px de haut, cadre du
  viewBox tracé en rouge) : le « e » est **entier**, panse fermée, terminaison arrondie qui
  revient vers l'intérieur. Rien ne manque.
- **Bounding box des 14 tracés recopiés dans un viewBox élargi** — le seul test qui prouve
  qu'aucune encre ne déborde : `x -0,000 → 223,670` pour un viewBox de `0 0 223,66 186,48`.
  Soit **0,01 unité de dépassement, du pur arrondi**. Le dessin est **jointif au plan de
  travail**, ce qui est le résultat normal d'un export « ajusté à l'illustration ».

**D'où venait l'erreur.** Le logo A ÉTÉ visiblement coupé sur le site à un moment — mais la
cause était le **CSS**, pas l'asset : un SVG inline en `width: auto` se fait rogner par la
règle globale `svg { max-width: 100% }`. C'est le piège consigné dans « Organisation des
fichiers », et il est corrigé depuis (largeur explicite calculée sur le ratio du viewBox).
En cherchant ensuite dans le fichier, j'ai lu `getBBox() ≈ largeur du viewBox` comme la
preuve d'un tracé tronqué. **C'est une lecture fausse : un recadrage serré n'est pas une
troncature.** Une bbox égale au viewBox est ce qu'on attend d'un export propre.

⚠️ **Rien à réexporter, rien à changer dans le code.** Et surtout, ne pas relancer ce
diagnostic : le « logo intact » que je croyais voir dans `mockup-iphone-hero.webp` est le
même logo, simplement plus grand.

**Le dessin est jointif au plan de travail — c'est voulu, et il faut le garder ainsi** :

- La boîte du SVG **est** le logo. Il se cale donc exactement sur la marge de 65, sans
  compensation. Avec une marge intérieure dans l'asset, le bord visible du logo ne serait
  plus sur la colonne et il faudrait la rattraper en CSS.
- Le ratio **1,19945** de `.logo` est dérivé du viewBox. Ajouter de la marge dans l'export
  oblige à le recalculer.
- Seule contrepartie, cosmétique : la colonne de pixels extérieure tombe pile sur la limite
  du viewport SVG, donc un moteur de rendu peut raboter un cheveu d'antialiasing à certaines
  tailles. Si on voulait vraiment s'en prémunir, ~0,5 % de marge dans le plan de travail
  suffirait — **mais il faudrait alors reprendre le 1,19945**. Non nécessaire.

## Questions en attente de Sylvain

1. **Contraste de « Scrollez pour découvrir »** : blanc pur sur jaune = **~1,15:1**, très en
   dessous du 4,5:1 exigé. Sylvain a demandé de **garder la taille de 30 px** (la maquette
   relève 15). Options restantes : passer en `--noir`, l'assumer comme purement décoratif,
   ou le retirer.
2. ✅ **Résolu** — la note de la carte 01 est à **10 px** (valeur Illustrator) et tient sur
   une ligne dans une carte de 318,5.
3. ✅ **Résolu** — les deux badges ont le même comportement : blanc/logo noir au repos,
   noir/logo blanc au survol. La pastille noire de l'App Store de la maquette n'est pas suivie.
4. ✅ **Résolu** — les liens des stores sont renseignés.
5. ✅ **Résolu** — les JPG lourds ont été remplacés par des WebP (moins de 700 Ko).
6. **Pas de dépôt Git** sur ce projet pour l'instant — proposer un `git init` si Sylvain veut
   un historique.
7. **Logo du header en desktop** : il démarre à `x = 78` sur la maquette alors que la grille
   commence à 65. Volontaire ou décalage de la maquette ? Le site l'aligne sur 65.
8. **Contraste du titre « Achetez local » sur la photo** : le blanc tombe par endroits sur un
   fond très clair (luminance relevée jusqu'à 230/255 sur la maquette, soit ~1,2:1). C'est le
   rendu de la maquette, repris tel quel. Options : un voile sombre dégradé depuis la gauche,
   ou l'assumer. **À trancher avec Sylvain.**
9. **Coquille de la maquette** : « Les points sont cumulés lors de vos **achat**. » Le site
   écrit « **achats** ». À confirmer.
11. **Moitié droite vide de la section Commerçant** : sur les deux maquettes le contenu tient
   dans les colonnes 1-5 et il reste **240 px de jaune sous le bouton** en desktop (52 en
   mobile). Repris tel quel. Est-ce qu'un **mockup** devait y aller ? Si oui, il suffit de le
   poser à droite ; la hauteur de bande (771) est déjà la bonne.
   ⚠️ **Le candidat évident n'existe plus** : `Mockup iPhone - Mobilité - 02.webp` a été
   supprimé par Sylvain le 06/09/2026. Il faudra donc un nouvel asset si la réponse est oui.
12. ✅ **Réglé (05/09/2026)** — le paragraphe de la section Commerçant reprenait mot pour mot
   le chapô du hero sur les deux maquettes (un copier-coller : il parlait de trajets, pas de
   commerce). **Texte fourni par Sylvain le 05/09/2026** : « Devenez partenaire de Move in et
   donnez à vos clients une bonne raison de revenir. À chaque achat, ils cumulent des points
   qu'ils peuvent ensuite utiliser dans votre commerce. »
   ⚠️ **Ce texte fait une ligne de plus que celui de la maquette**, et la bande n'a pas de
   hauteur figée : elle est la somme de ses blocs. Elle mesure donc **794,9** au lieu des
   771 relevés en desktop (4 lignes au lieu de 3) et **546** au lieu de 524 à 390 (5 lignes
   au lieu de 4) ; le bouton descend de 479 à 503. **Assumé** — le supplément tombe dans les
   240 px de jaune vide du bas. Pour retrouver 771 au pixel il suffirait de retrancher 24 à
   `--com-pb` (et 19,2 côté mobile), à demander à Sylvain.
   Repère pour un futur texte : **~145 caractères** = 3 lignes à 1440 (boîte de 539,
   Inter 20/24) et 4 à 390.
13. **Blanc sur jaune, section Commerçant** : l'eyebrow et le titre sont blancs sur `#ffdd0d`,
   soit **~1,15:1** — même problème que « Scrollez pour découvrir » (question 1), mais cette
   fois sur un titre de 78 px. C'est la maquette. Options : passer en `--noir`, ou assumer.
14. **Quatre URL manquantes** (footer) : **Facebook**, **Instagram**, **politique vie privée**
   et **conditions générales**. Elles sont en `href="#"` avec un commentaire `TODO` dans le
   HTML — à remplacer avant toute mise en ligne. Le globe pointe déjà `movein.fleurus.be`.
16. **Les cinq contrastes hors normes** (cf. « Passe finale ») : blanc et sable sur fond clair,
   1,3:1 là où il en faut 3 à 4,5. Trois pistes, à trancher globalement plutôt qu'au cas par
   cas — (a) assumer et publier une déclaration d'accessibilité qui liste les écarts,
   (b) foncer les couleurs concernées (le sable et le jaune des titres passeraient en
   `--noir`, ce qui change le poster), (c) ne corriger que le texte NON décoratif
   (« Scrollez pour découvrir », l'eyebrow « COMMERÇANT ») et assumer les gros titres.
18. **Bandeau partenaires — bouton pause ?** Le défilement se met en pause au survol et au
   focus clavier, ce qui couvre l'essentiel de WCAG 2.2.2, mais la lettre de la norme
   demande un **moyen explicite** de l'arrêter pour un contenu qui bouge seul plus de 5 s.
   Faut-il ajouter un petit bouton pause dans le bandeau ? (Il n'est pas dans la maquette,
   et pour cause : la section non plus.)
19. **Versions foncées des logos partenaires** : Ville de Fleurus, Wallonie et Shop In
   n'existent qu'en blanc. Tant qu'il en est ainsi, le bandeau doit rester sur fond sombre.
17. ✅ **Résolu (06/09/2026)** — les trois fichiers lourds inutilisés ont disparu, le dernier
   (`Mockup iPhone - Mobilité - 02.webp`, 687 Ko) supprimé par Sylvain lui-même.
   `assets/images/` fait 816 Ko et ne contient plus que des fichiers servis. ⚠️ Voir la
   question 11 : ce fichier était le candidat pour la moitié droite vide de Commerçant.
15. **Les logos du footer sont-ils des liens ?** Aujourd'hui non (de simples `<img>`).
   S'ils doivent l'être : fleurus.be, wallonie.be, digitalwallonia.be… à confirmer.
10. ✅ **Résolu (05/09/2026)** — cadrage de la photo au-delà de 1440. Sur l'écran 2560 × 1440
   de Sylvain les téléphones montaient sur le titre : la bande gardait ses 1133 de haut
   pendant que la largeur croissait, donc `cover` zoomait. La hauteur suit désormais la
   largeur (`--fid-rab`), le cadrage est une homothétie exacte de la maquette. Cf. section 4.
   Reste à valider : la bande fait alors **2015 px de haut à 2560** (contre 1133 à 1440) —
   c'est la proportion de la maquette, mais ça fait beaucoup de scroll sur un grand écran.
   Si Sylvain la trouve trop haute, on peut plafonner `--fid-rab` (au prix d'un léger
   recadrage qui réintroduit le problème, en plus doux).

### Respiration du bloc de téléchargement en mobile

Réglée à la main avec Sylvain (03/09/2026), la maquette étant jugée trop timide :
mockup → bloc de téléchargement **64** (`--dl-mt`), constante de 390 à 900 (cf. la règle
sur les écarts d'empilement). ⚠️ Depuis la suppression du label (05/09) le bouton commence
là où le label commençait : il est donc remonté d'environ **34 px** à 1440. **Position validée
telle quelle par Sylvain (05/09/2026)** — ne pas la rectifier.

## À vérifier plus tard

- **Dégradé de la bande jaune en mobile** : la maquette mobile descend jusqu'à un
  `#ffde0c` plat à partir de ~y 900, alors que le CSS s'arrête à `--degrade-a` `#ffe330`.
  Le dégradé desktop, lui, est confirmé au pixel (`#ffe330` → `#ffea63`, diagonale).
  Sylvain a dit « le reste fonctionne » — à retoucher seulement s'il le demande.

## Consignes déjà données pour les sections à venir

- ✅ **Bulles réseaux sociaux (footer)** — appliqué le 05/09/2026 : le survol est
  **uniquement un changement de couleur** — fond blanc → **jaune**, icône noire →
  **blanche**. Pas de déplacement, pas d'ombre. (Consigne Sylvain, 03/09/2026.)
- **Cartes de la section Fidélité** : 318,4998 × 220, rayon 20, mêmes valeurs de titre
  que les cartes Mobilité (cf. section 4 plus haut).

## Phase 2 — animations (plus tard)

À faire seulement une fois le site statique validé. **CSS de préférence**, JS en dernier
recours, `prefers-reduced-motion` respecté.

**Apparitions — 3 versions successives le 05/09/2026, garder la 3e.**
1. Fondu simple piloté par le scroll → « un peu léger ».
2. Rideau et dévoilement en `clip-path`, toujours pilotés par le scroll → mieux, mais
   **saccadé** : l'animation avançait au rythme exact de la molette.
3. ✅ **Déclenchées par un IntersectionObserver, jouées en transition CSS de 800 ms.**
   « L'effet où les éléments apparaissent tout seuls comme sur les autres sites. »

| Rôle | Sur quoi | Effet |
|---|---|---|
| `.lignes` | titres display | chaque **ligne monte de derrière son masque**, décalée de 120 ms |
| — | `.carte` (× 8) | fondu + montée de 48 px, décalées de 120 ms |
| `.apparait` | eyebrows, chapôs, blocs de bouton | fondu + montée de 48 px |

- Le JS (`script.js`, bloc 3) pose `.est-visible` à l'entrée dans le champ, puis
  **oublie l'élément** (`unobserve`) : ça ne se rejoue pas au scroll inverse.
  Déclenchement à **15 % du bas de l'écran** (`rootMargin: 0 0 -15% 0`).
- ⚠️ **`.js-anim` est posée par le JS, pas dans le HTML** : c'est elle qui active l'état
  de départ (opacité 0). Si le script ne tourne pas, **rien n'est masqué**. Même garde-fou
  que l'ancien `@supports`, mais qui marche maintenant sur TOUS les navigateurs — la
  version scroll-driven ne fonctionnait que sur Chrome.
- ⚠️ Le JS ne pose pas `.js-anim` du tout si `prefers-reduced-motion` est demandé.
- ⚠️ **AUCUNE animation dans le bloc des piliers** (ni les colonnes, ni leurs textes) :
  demande Sylvain, deux fois plutôt qu'une.

Pistes restantes (à compléter / valider avec Sylvain) :
- ~~Apparition en douceur des cartes d'étapes au scroll~~ ✅ fait.
- Le point qui repart le long de la route (skyline) — en CSS.
- Léger mouvement du mockup iPhone du hero à l'entrée.
- Micro-interactions au survol (déjà en place) : badges, boutons, cartes.
- _[ajouter ici les idées de Sylvain]_
