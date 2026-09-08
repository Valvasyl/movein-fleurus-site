<div align="center" id="haut">

<img src="assets/logos/apple-touch-icon.png" alt="Move in Fleurus" height="90">

# MOVE IN FLEURUS

**Site vitrine de l'application de mobilité douce de la Ville de Fleurus.**

[![Voir le site](https://img.shields.io/badge/%E2%86%92_VOIR_LA_RECETTE-ffdd0d?style=for-the-badge&labelColor=2a292e)](https://valvasyl.github.io/movein-fleurus-site/)

`HTML` · `CSS natif` · `JavaScript vanilla` · zéro dépendance · zéro build · zéro requête tierce

**Vous mettez ce site en ligne ?** → [**LIVRAISON.md**](LIVRAISON.md)

</div>

---

## À propos

Move in Fleurus récompense les déplacements durables. Chaque kilomètre parcouru à pied, à
vélo ou en trottinette rapporte des points ; **100 km = un bon d'achat de 10 €** à dépenser
chez les commerçants partenaires de la ville. Deux applications coexistent — une pour les
**citoyens**, une pour les **commerçants**.

Ce dépôt contient le **site vitrine one-page** qui présente le dispositif et oriente le
visiteur vers le téléchargement de l'application qui le concerne.

| | |
|---|---|
| **Client** | Ville de Fleurus |
| **Type** | Site vitrine one-page, statique |
| **Destination** | `https://movein.fleurus.be/app-store/` — il **remplace** la page qui s'y trouve |
| **Recette** | [valvasyl.github.io/movein-fleurus-site](https://valvasyl.github.io/movein-fleurus-site/) — GitHub Pages, publication automatique à chaque push sur `main` |
| **Source de vérité** | Deux maquettes Illustrator, **390 px** et **1440 px** |
| **Poids du code** | 60 Ko (23 + 33 + 4) · **~10 Ko une fois compressé** |
| **Poids des médias** | 1,3 Mo, dont 1 Mo pour deux photos |
| **Dépendances** | aucune |

---

## En un coup d'œil

- **Trois fichiers, pas un de plus** : `index.html`, `styles.css`, `script.js`. Pas de
  framework, pas de préprocesseur, pas d'étape de compilation. Le dépôt se déploie tel quel.
- **Mobile-first et fluide** : tout est en `clamp()`. **Un seul breakpoint dur dans tout le
  projet** — `@media (min-width: 900px)` — et il ne sert qu'à deux choses : passer la grille
  de 4 à 12 colonnes, et remplacer le burger par la navigation desktop.
- **CSS moderne natif** : variables CSS, nesting avec `&`, `:is()`, `clamp()`, `aspect-ratio`,
  `overflow: clip`, `inert`. Aucun SASS.
- **Fidélité au pixel** : chaque valeur du site est **relevée sur la maquette**, jamais
  estimée à l'œil. Le relevé s'est fait par scripts (recadrage, pipette, bounding box,
  différence entre planches) plutôt qu'à la souris.

---

## Architecture

```
move-in-fleurus/
├── index.html          Structure — 10 sections, un seul <h1>
├── styles.css          Toute la mise en forme, organisée en 16 sections numérotées
├── script.js           5 blocs autonomes, chacun en IIFE
├── robots.txt
│
├── LIVRAISON.md        ★ Tout ce qu'il faut pour mettre le site en ligne
├── README.md           Ce fichier
├── CLAUDE.md           Mémoire technique du projet (voir « Documentation »)
├── commentaires/       Copie intégralement commentée des 3 fichiers de code
├── archive/            Fichiers graphiques inutilisés, conservés pour mémoire
├── maquette/           Planches Illustrator de référence (hors dépôt, non déployées)
│
└── assets/
    ├── fonts/          Inter et Barlow Condensed en .woff2, + leurs licences SIL OFL
    ├── logos/          Move in, Ville de Fleurus, Wallonie, Shop In, DigitalWallonia, favicons
    ├── icons/          Les 3 pictogrammes des piliers
    └── images/         Mockup, photos, trame de rues, titre vectorisé, skyline, image de partage
```

Les chemins sont **tous relatifs** : le site fonctionne à la racine d'un domaine comme dans
un sous-dossier.

---

## Partis pris techniques

Ce sont les décisions qui expliquent la forme du code. Chacune est documentée en détail dans
`CLAUDE.md` et commentée dans `commentaires/styles.css`.

### Le desktop est une homothétie de la maquette

C'est **la** décision structurante. Plutôt que d'interpoler chaque valeur indépendamment —
ce qui fait dériver les éléments les uns par rapport aux autres — toutes les dimensions sont
exprimées en « pixels de maquette » :

```css
--px: calc(clamp(1152px, 100vw, 1440px) / 1440);
```

Une valeur relevée s'écrit alors telle quelle : `margin-top: calc(160 * var(--px))`. **De
900 px à 1440 px, le rendu est un zoom exact de la maquette** ; au-delà, tout se fige.

Le plancher de `0,80` est essentiel : sans lui, `--px` tomberait à `0,625` à 900 px et le
desktop y serait une miniature. Toute la branche mobile est **ancrée sur cette valeur**, si
bien que le franchissement du breakpoint est invisible — vérifié à 899 px et à 901 px.

### Une charte relevée au pixel

La maquette contient **trois jaunes**, pas un :

| Rôle | Valeur |
|---|---|
| Couleur de marque (numéros de carte, bande Commerçant) | `#ffdd0d` |
| Fond du hero — **un dégradé diagonal**, pas un aplat | `#ffe330` → `#ffea63` |
| Trame de rues, pastille App Store | `#ffd405` |

Deux polices : **Inter** pour tout le texte lisible, **Barlow Condensed** pour les gros
titres display et les numéros de carte. **La police suit le rôle, pas la balise** : un titre
de carte reste en Inter même si c'est un `<h3>`.

### Des polices auto-hébergées

Elles étaient chargées depuis les serveurs de Google. Sur le site d'une administration
publique, cela transmet l'adresse IP de chaque visiteur à un tiers — le point RGPD classique
des Google Fonts. Elles sont **installées localement** depuis le 09/09/2026, sous licence
**SIL Open Font License 1.1** qui l'autorise explicitement (les licences sont livrées avec
les fichiers).

Quatre `.woff2` seulement, et **deux sont chargés en pratique** : chaque famille est
découpée en sous-ensembles `latin` et `latin-ext` avec leur `unicode-range`, et le navigateur
ne télécharge `latin-ext` que si un caractère de cette plage apparaît — ce qui n'arrive pas
sur une page en français. Coût réel : **69 Ko**, deux requêtes, aucune vers un tiers.

Inter est servi en **police variable** : un seul fichier couvre les graisses 400, 700 et 800.
Barlow Condensed n'est chargé qu'en 800 droit. Avant d'utiliser une nouvelle graisse dans le
CSS, il faut donc vérifier qu'elle est bien couverte — et pour Barlow Condensed, télécharger
le fichier correspondant.

### Header sticky escamotable

Transparent en haut de page, il **s'efface vers le haut quand on descend et revient dès
qu'on remonte**. Le JavaScript ne pose que des classes, toute l'animation est en CSS.

Il est en `position: sticky` et **surtout pas `fixed`** : l'élément garde sa place dans le
flux, ce qui permet au hero de remonter sous lui via une marge négative et de faire courir le
dégradé depuis `y = 0`. En `fixed`, toute la page se serait décalée.

Une fois la page quittée du haut, le fond apparaît sous la forme d'une **barre arrondie en
retrait** — 32,5 px sur les côtés, 30 px en haut et en bas, rayon 20 à 1440. Ces trois
valeurs sont dérivées, pas interpolées : le retrait horizontal vaut la **moitié de la marge
de page**, le retrait vertical **30 % de l'air disponible autour du logo** (avec un minimum
garanti), et le rayon **20 % de la hauteur de la barre**.

### Une trame de rues dimensionnée par la hauteur

Le fond du hero superpose un SVG de plan de ville au dégradé. Il est piloté par la
**hauteur**, non par la largeur :

```css
background-size: auto max(100%, calc(var(--trame-w) * 1.2));
```

Piloté par la largeur, il devenait plus court que la bande en mobile — où celle-ci fait le
double de haut — et le haut du hero se retrouvait sans dessin.

### Un bandeau partenaires à vitesse constante

Le défilement infini repose sur **deux pistes identiques côte à côte**, chacune en
`min-width: 100%`, translatées de `-100 %` : quand la première sort à droite, la seconde est
exactement à sa place, quelle que soit la largeur de l'écran.

La vitesse est **constante à 50 px/s sur tous les écrans**. C'est impossible en CSS pur — il
n'existe aucune conversion longueur → temps — donc `script.js` calcule `durée = largeur ÷ 50`
et la réécrit à chaque redimensionnement via un `ResizeObserver`. La valeur CSS reste le repli
si le script ne s'exécute pas. Le défilement se met en pause au survol et au focus clavier.

### Routage vers le bon magasin d'applications

Les boutons de téléchargement portent leurs deux URL en `data-store-ios` /
`data-store-android`. Le script réécrit le `href` **au chargement, pas au clic** : le lien
reste un vrai lien — clic milieu, « copier l'adresse », navigation clavier — et il est déjà
correct avant la première interaction. Le `href` du HTML sert de repli sur les plateformes
sans magasin évident. iPadOS 13+ se déclarant « Macintosh », il est démasqué par
`maxTouchPoints`.

### Apparitions au scroll

Un `IntersectionObserver` pose une classe à l'entrée dans le champ, puis **oublie l'élément** :
l'effet ne se rejoue pas au scroll inverse. Toute l'animation est ensuite une transition CSS,
donc fluide quel que soit le rythme de la molette — contrairement aux animations pilotées par
le scroll, qui avancent par à-coups.

La classe qui active l'état initial (opacité 0) est **posée par le script, pas écrite dans le
HTML** : si le JavaScript ne s'exécute pas, rien n'est masqué. Elle n'est pas posée du tout
lorsque `prefers-reduced-motion` est demandé.

---

## Accessibilité

Un site d'administration publique wallonne relève de la directive **UE 2016/2102**
(WCAG 2.1 niveau AA).

**En place** : un seul `<h1>`, hiérarchie de titres cohérente (avec des `<h2>` en lecteur
d'écran pour les sections sans titre visible), `lang="fr"`, textes alternatifs sur toutes les
images utiles, aucun lien sans nom accessible, focus systématiquement visible, lien
d'évitement, menu mobile `inert` quand il est fermé et fermable au clavier,
`prefers-reduced-motion` respecté partout.

**Écarts connus, à trancher** : cinq combinaisons de couleurs héritées de la maquette
descendent à ~1,3:1 là où 3:1 ou 4,5:1 sont exigés — du blanc et du sable posés sur des fonds
clairs (voir *Étapes à suivre*). Le texte courant, lui, est entre 10:1 et 14:1.

---

## Développement local

Aucune installation n'est nécessaire, mais le fichier ne doit pas être ouvert directement
depuis le disque (`file://`) : les polices et le SVG de fond ne se chargeraient pas.

```bash
npx http-server -p 8000 -c-1
```

> **`-c-1` n'est pas optionnel.** Il envoie `no-cache, no-store, must-revalidate`. Sans
> en-tête de cache, le navigateur conserve l'ancienne feuille de style et des corrections
> pourtant bien en place semblent ne pas fonctionner.

Le site est ensuite servi sur `http://localhost:8000`.

---

## Déploiement

**Recette** — GitHub Pages, branche `main`, racine du dépôt. Un push suffit ; la mise en
ligne prend une à deux minutes.

```bash
git add -A
git commit -m "…"
git push
```

**Production** — voir **[LIVRAISON.md](LIVRAISON.md)** : ce qu'il faut déployer et ce qu'il
faut laisser, les types MIME à vérifier, la compression, le cache, les en-têtes de sécurité,
et le piège du `robots.txt` dans un sous-dossier.

Dans les deux cas : aucune étape de compilation, aucun artefact à générer. **Ce qui est dans
le dépôt est ce qui est servi.**

---

## Documentation

Le projet suit une discipline documentaire inhabituelle, née de sa contrainte principale :
**chaque valeur du CSS est un relevé**, et un nombre sans son relevé est un nombre qu'on ne
peut plus vérifier ni reprendre.

### `CLAUDE.md` — la mémoire du projet

Ce site a été développé avec **[Claude Code](https://claude.com/claude-code)**, l'agent de
développement en ligne de commande d'Anthropic. `CLAUDE.md` est le fichier de contexte qu'il
lit au début de chaque session : contraintes non négociables, charte, grille, relevés
maquette, décisions prises et **pourquoi**, pièges rencontrés, questions en attente d'arbitrage.

Il est utile bien au-delà de l'outil qui l'a produit : c'est le seul endroit où l'on trouve
la raison d'être de chaque nombre. **À tenir à jour à chaque modification de fond.**

### `commentaires/` — la version commentée du code

Les fichiers déployés sont **volontairement dépourvus de commentaires** : ceux-ci
représentaient 57 % de la feuille de style, soit environ 17 Ko supplémentaires à télécharger à
chaque première visite.

`commentaires/` contient une copie intégralement commentée des trois fichiers — le
raisonnement derrière chaque valeur, les pièges, les décisions.

> ⚠️ **Cette copie ne se régénère pas toute seule** : il n'y a pas d'étape de compilation.
> Toute modification de fond doit être reportée dans `commentaires/`, faute de quoi la
> documentation ment. Chaque fichier déployé porte en tête un rappel vers sa version commentée.

---

## Étapes à suivre

### 1. Avant toute communication publique

- [ ] ⚠️ **`https://fleurus.be/move-in-fleurus/commercant/` renvoie un 404** — c'est la cible
      du bouton « En savoir plus » de la section Commerçant. Créer la page ou corriger le lien.
- [ ] **Publier la déclaration d'accessibilité** et la lier depuis le pied de page. Elle est
      **obligatoire** pour un organisme public (directive UE 2016/2102) et n'existe pas encore.
- [ ] **Arbitrer les cinq écarts de contraste** hérités de la maquette. Trois options,
      à trancher globalement plutôt qu'au cas par cas :
      *(a)* les assumer et les lister dans la déclaration d'accessibilité,
      *(b)* foncer les couleurs concernées — ce qui modifie l'identité visuelle,
      *(c)* ne corriger que le texte non décoratif et assumer les grands titres.

### 2. Performance

- [ ] **Réexporter `photo-commercants.webp`** — 552 Ko en 4232 × 5948 px, alors que 2560 px
      de large suffisent largement. Avec `visuel-commercant.webp` (432 Ko), ces deux fichiers
      représentent à eux seuls 75 % du poids du site. Tous deux sont chargés en différé, donc
      non bloquants, mais c'est le dernier vrai gisement d'optimisation.
      *À réexporter depuis les sources plutôt qu'à recompresser : ce sont déjà des WebP.*

### 3. Contenu et finition

- [ ] **Bandeau partenaires** : le défilement se met en pause au survol et au focus, ce qui
      couvre l'essentiel de WCAG 2.2.2. La lettre de la norme demande un moyen d'arrêt
      explicite pour tout contenu animé de plus de 5 secondes — un bouton pause reste à arbitrer.
- [ ] **Fleurus Shop In** n'a ni site ni page : son logo est le seul du bandeau partenaires à
      ne pas être un lien. À rebasculer en `<a href>` le jour où l'URL existe (une balise à
      changer dans `index.html`, rien à toucher dans le CSS).
- [ ] **Phase 2 — animations** : les apparitions au scroll sont en place. Restent le point qui
      parcourt la route de l'illustration finale et un léger mouvement du mockup à l'entrée.
      **CSS de préférence, JavaScript en dernier recours, `prefers-reduced-motion` toujours respecté.**

---

## Conventions

- **Aucun accent dans les identifiants** — `id`, classes, variables CSS : `#mobilite`,
  `.fidelite`, `--mobilite-pb`. Les accents ne vivent que dans le texte visible.
- **Assets en minuscules kebab-case**, sans espace ni accent.
- **SVG inline uniquement s'il doit être recoloré par CSS**, sinon `<img>`. Le logo Move in
  est déclaré une seule fois en `<symbol>` puis appelé par `<use>`.
- **Un SVG inline reçoit toujours une largeur explicite** calculée depuis le ratio de son
  `viewBox` : en `width: auto`, il se fait rogner par la règle globale `svg { max-width: 100% }`.

---

<div align="center">

**Ville de Fleurus** · Développé avec [Claude Code](https://claude.com/claude-code)

</div>
