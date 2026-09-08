# Livraison — Move in Fleurus

Document destiné à **l'équipe qui met le site en ligne**. Tout ce qu'il faut savoir tient
ici ; le reste du dépôt est de la documentation de conception.

---

## 1. Ce qu'est ce site

Un **site vitrine statique** : une page d'accueil one-page, plus une page de déclaration
d'accessibilité. Aucune dépendance, aucun framework, **aucune étape de compilation** : ce
qui est dans le dépôt est exactement ce qui doit être servi.

| | |
|---|---|
| **Technologie** | HTML + CSS natif + JavaScript vanilla |
| **Build** | aucun |
| **Runtime serveur** | aucun — n'importe quel serveur de fichiers statiques suffit |
| **Base de données** | aucune |
| **Cookies** | aucun |
| **Requêtes vers des tiers** | **aucune** (voir §6) |
| **Poids** | ~60 Ko de code, ~1,3 Mo de médias |

Il **remplace la page existante** :

```
https://movein.fleurus.be/app-store/
```

⚠️ **Cette URL ne doit pas changer.** Elle est déjà diffusée (QR codes, communication de la
Ville, liens depuis les applications). Le site est prévu pour vivre dans ce sous-dossier.

---

## 2. Ce qu'il faut mettre en ligne

**À déployer** — le contenu servi :

```
index.html
accessibilite.html  déclaration d'accessibilité (obligation légale, voir §7)
styles.css
script.js
robots.txt          (voir §5 — il ne sert à rien à cette adresse, mais il ne gêne pas)
assets/
    fonts/          4 fichiers .woff2 + les 2 licences SIL OFL
    icons/          3 pictogrammes
    images/         6 fichiers
    logos/          7 fichiers
```

**À NE PAS déployer** — documentation et archives, sans effet sur le rendu :

```
README.md           présentation du projet
LIVRAISON.md        ce document
CLAUDE.md           mémoire technique détaillée (l'origine de chaque valeur du CSS)
commentaires/       copie intégralement commentée des 3 fichiers de code
archive/            fichiers graphiques inutilisés, conservés pour mémoire
.editorconfig
.gitignore
```

Rien n'empêche de tout copier — ce sont des fichiers texte inertes — mais un déploiement
propre s'arrête à la première liste.

**Tous les chemins internes sont relatifs.** Le site fonctionne indifféremment à la racine
d'un domaine ou dans un sous-dossier, sans rien modifier.

---

## 3. Le seul point à vérifier si le chemin change

Quelques valeurs du `<head>` sont des **URL absolues** — c'est obligatoire pour le
référencement et les aperçus de partage, qui n'acceptent pas de chemin relatif :

```html
<!-- index.html -->
<link rel="canonical" href="https://movein.fleurus.be/app-store/">
<meta property="og:url"   content="https://movein.fleurus.be/app-store/">
<meta property="og:image" content="https://movein.fleurus.be/app-store/assets/images/partage-move-in-fleurus.jpg">
<!-- + les deux URL du bloc application/ld+json juste en dessous -->

<!-- accessibilite.html -->
<link rel="canonical" href="https://movein.fleurus.be/app-store/accessibilite.html">
```

> **Si l'adresse finale diffère de `https://movein.fleurus.be/app-store/`, ce sont les
> seules lignes à corriger.** Tout le reste suit automatiquement.

⚠️ **Le corps de `accessibilite.html` cite aussi l'adresse du site** (« La présente
déclaration s'applique au site movein.fleurus.be/app-store/ ») : à reprendre également.

---

## 4. Configuration serveur recommandée

Le site fonctionne sans aucune configuration. Les points ci-dessous ne sont pas des
prérequis : ce sont les réglages qui font la différence entre « ça marche » et « c'est
propre ».

### 4.1 Types MIME — le seul réglage réellement bloquant

Certains serveurs anciens (IIS en particulier, et quelques Apache) ne connaissent pas ces
types. Sans eux, **les polices ne se chargent pas et les images ne s'affichent pas**, sans
message d'erreur explicite :

| Extension | Type MIME |
|---|---|
| `.woff2` | `font/woff2` |
| `.webp` | `image/webp` |
| `.svg` | `image/svg+xml` |

### 4.2 Compression

À activer sur `text/html`, `text/css`, `application/javascript`, `image/svg+xml`.
Le gain est important : la feuille de style passe de 33 Ko à environ 8 Ko.

**Ne pas compresser** `.woff2`, `.webp`, `.jpg`, `.png` : ils sont déjà compressés, la
recompression ne fait que consommer du CPU.

### 4.3 Cache

```
index.html, accessibilite.html  Cache-Control: no-cache          (revalidation à chaque visite)
styles.css, script.js           Cache-Control: max-age=3600      (1 h, le temps d'une mise à jour)
assets/**                       Cache-Control: max-age=31536000, immutable
```

Les fichiers d'`assets/` ne changent jamais sans changer de nom : ils peuvent être mis en
cache un an sans risque. `index.html`, lui, doit être revalidé, sinon une correction reste
invisible pour les visiteurs déjà venus.

### 4.4 En-têtes de sécurité

Aucun n'est indispensable, tous sont recommandés pour un site public :

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000            (si HTTPS partout — c'est le cas)
Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self';
                         style-src 'self'; script-src 'self'; base-uri 'self';
                         form-action 'none'; frame-ancestors 'none'
```

> Cette politique CSP est **directement applicable** : le site n'a ni style *inline*, ni
> script *inline* exécutable, ni ressource externe. Le bloc `application/ld+json` du `<head>`
> n'est pas du script exécutable et n'est donc pas concerné.
> Elle devra être assouplie le jour où un outil de mesure d'audience sera ajouté.

---

## 5. Le piège du `robots.txt`

`robots.txt` **n'est lu qu'à la racine d'un domaine**. Le site étant servi depuis
`/app-store/`, les moteurs de recherche liront `https://movein.fleurus.be/robots.txt` et
**jamais** `https://movein.fleurus.be/app-store/robots.txt`.

Le fichier livré est donc **inerte à cette adresse**. Il est conservé comme modèle et comme
documentation de l'intention. Ce qui pilote réellement l'indexation, c'est le
`<link rel="canonical">` du `<head>`.

**Si la Ville veut ajuster l'indexation**, c'est le `robots.txt` de la racine de
`movein.fleurus.be` qu'il faut modifier.

Le `canonical` remplit au passage un second rôle : il désigne cette adresse comme la
version de référence, ce qui évite que la copie de recette hébergée sur GitHub Pages ne soit
indexée comme un doublon.

---

## 6. Vie privée — zéro requête vers un tiers

**Le site ne contacte aucun serveur extérieur.** C'est un choix, pas un hasard :

- **Les polices sont auto-hébergées** (`assets/fonts/`). Elles étaient chargées depuis les
  serveurs de Google, ce qui transmettait l'adresse IP de chaque visiteur à un tiers — le
  point RGPD classique des Google Fonts sur un site d'administration publique. Elles ont été
  téléchargées et installées localement le 09/09/2026. Licence **SIL Open Font License 1.1**
  pour les deux familles (Inter et Barlow Condensed), les fichiers de licence sont livrés
  avec les polices ; l'auto-hébergement est explicitement autorisé.
- **Aucun cookie, aucun stockage local, aucune mesure d'audience.**
- Les seules adresses externes du site sont des **liens sur lesquels le visiteur clique**
  (fleurus.be, les deux magasins d'applications, Facebook, Instagram, les sites des
  partenaires). Rien n'est chargé tant qu'il ne clique pas.

> **Conséquence pratique** : en l'état, le site n'a pas besoin de bandeau de consentement.
> **Ce serait à réévaluer** si un outil de mesure d'audience était ajouté par la suite.

---

## 7. Accessibilité

Le site relève de la **directive UE 2016/2102** (WCAG 2.1 niveau AA), qui s'applique aux
organismes publics.

**Ce qui est en place** : structure de titres cohérente avec un seul `<h1>`, `lang="fr"`,
textes alternatifs sur toutes les images porteuses de sens, aucun lien sans nom accessible,
focus toujours visible, lien d'évitement, menu mobile inerte quand il est fermé et fermable
au clavier, `prefers-reduced-motion` respecté partout, cibles tactiles au-dessus du minimum.

**La déclaration d'accessibilité est publiée** : `accessibilite.html`, liée depuis le pied
de page des deux pages. Elle suit le modèle de la décision d'exécution (UE) 2018/1523 :
état de conformité, contenus non accessibles, méthode d'évaluation, mécanisme de retour
d'information, voie de recours.

**Le site est déclaré « partiellement conforme »** — sept combinaisons de couleurs héritées
de la charte descendent entre **1,22:1 et 1,35:1** là où **3:1** est exigé (du blanc, du
jaune et du sable sur fonds clairs). Toutes relèvent du seuil de 3:1 et non de 4,5:1,
s'agissant de *grand texte* ou de contenu non textuel. Elles sont listées nommément dans la
déclaration, avec leur rapport mesuré. Le texte courant, lui, est entre 10,7:1 et 14,4:1.

⚠️ **Ces écarts sont un choix assumé de la Ville** (décision du 09/09/2026) : la charte
graphique n'est pas modifiée, et les écarts sont déclarés — c'est la voie prévue par la
directive. **Il ne faut donc pas les « corriger » de votre côté** : toute retouche des
couleurs rendrait la déclaration inexacte.

⚠️ **Trois points restent à la charge de la Ville avant la mise en ligne :**

1. **Remplir les coordonnées de contact** dans `accessibilite.html` — trois placeholders en
   majuscules (`ADRESSE@fleurus.be`, `NUMÉRO`, `SERVICE`). Le mécanisme de retour
   d'information est une exigence de la directive : sans lui la déclaration n'est pas valide.
2. **Faire confirmer par le service juridique** la référence légale wallonne exacte et les
   coordonnées complètes de la voie de recours (nous n'avons pu vérifier que le nom,
   l'adresse et le site du Médiateur de la Wallonie et de la Fédération Wallonie-Bruxelles).
3. **Programmer un audit par un organisme tiers.** La déclaration repose aujourd'hui sur une
   auto-évaluation, ce qu'elle indique explicitement.

⚠️ **Les deux applications mobiles Move in Fleurus sont soumises à la même obligation** et
demandent chacune leur propre déclaration. Elles sortent du périmètre de ce site, mais le
point mérite d'être remonté : la directive couvre les applications mobiles des organismes
publics depuis le 23 juin 2021.

---

## 8. À vérifier avant la mise en ligne

- [ ] ⚠️ **`https://fleurus.be/move-in-fleurus/commercant/` est protégée par un mot de passe.**
      La page existe désormais, mais le bouton « En savoir plus » de la section Commerçant
      mène à un formulaire de mot de passe. **À rendre publique avant la mise en ligne**,
      sinon le lien est cassé pour le visiteur — vérifié le 09/09/2026.
- [ ] **Coordonnées de contact** remplies dans `accessibilite.html` (§7) — trois placeholders.
- [ ] **Référence légale et voie de recours** confirmées par le service juridique (§7).
- [x] ~~**Contrastes** : arbitrage rendu~~ — assumés, déclarés, aucune couleur à modifier (§7).
- [ ] **Types MIME** `.woff2` / `.webp` / `.svg` confirmés sur le serveur cible (§4.1).
- [ ] **Aperçu de partage** testé sur Facebook et LinkedIn une fois en ligne — l'image
      `assets/images/partage-move-in-fleurus.jpg` (1200 × 630) n'est joignable qu'à l'adresse
      de production.
- [ ] **Redirection** : si l'ancienne page `/app-store/` avait des sous-pages ou des ancres
      diffusées, prévoir les redirections correspondantes.

---

## 9. Compatibilité

Testé et vérifié de **320 px à 2560 px** de large, sans débordement horizontal à aucune
largeur.

Le CSS utilise des fonctionnalités modernes mais toutes largement disponibles :
`clamp()`, variables CSS, imbrication native avec `&`, `:is()`, `aspect-ratio`,
`overflow: clip`, `inert`, `IntersectionObserver`, `ResizeObserver`. Cela correspond à
**Chrome / Edge 117+, Firefox 117+, Safari 17.2+** (fin 2023).

Sur un navigateur plus ancien, la page reste **lisible et navigable** — c'est du HTML avec
des styles — mais la mise en page fluide se dégrade. Les deux mécanismes qui dépendent du
JavaScript ont un repli explicite : sans script, rien n'est masqué (les animations
d'apparition ne se déclenchent simplement pas) et le bandeau partenaires affiche des logos
immobiles au lieu de défiler.

---

## 10. Où trouver le reste

| Fichier | Contenu |
|---|---|
| `README.md` | Présentation du projet, partis pris techniques, développement local |
| `CLAUDE.md` | **La mémoire du projet** — l'origine et la justification de chaque valeur du CSS, les pièges rencontrés, les décisions et leur pourquoi |
| `commentaires/` | Copie intégralement commentée des trois fichiers de code |

> Les fichiers déployés sont **volontairement sans commentaires** : ceux-ci représentaient
> 57 % de la feuille de style. Le raisonnement vit dans `commentaires/`, qui est une copie
> maintenue à la main — **toute modification de fond doit y être reportée**, il n'y a pas de
> génération automatique.

---

*Ville de Fleurus — dernière mise à jour : 9 septembre 2026*
