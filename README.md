# Move in Fleurus — site vitrine

Site **one-page** de présentation de *Move in Fleurus*, l'application de mobilité douce de
la Ville de Fleurus. Chaque kilomètre parcouru à pied, à vélo ou en trottinette rapporte des
points ; 100 km = un chèque de 10 € à dépenser chez les commerçants partenaires.
Le site présente le concept et pousse au téléchargement des deux applications (citoyen et
commerçant).

## Ce qu'il y a dans le dépôt

```
index.html     la page, entière
styles.css     toute la mise en forme (CSS natif : variables + nesting, pas de SASS)
script.js      menu burger, choix du store, apparitions au scroll, header escamotable
assets/        images, logos et icônes
CLAUDE.md      le carnet de bord du projet : relevés, décisions, pièges
```

**Pas de framework, pas de build, aucune dépendance.** Les deux seules ressources externes
sont les polices Google (Inter et Barlow Condensed).

## Le regarder en local

Il suffit de servir le dossier :

```bash
npx http-server -p 8000 -c-1
```

puis d'ouvrir <http://localhost:8000>. Le `-c-1` désactive le cache du navigateur — sans
lui, on croit que ses modifications ne sont pas prises en compte.

## État

Les neuf sections sont en place et conformes aux maquettes (relevés au pixel, consignés
dans `CLAUDE.md`). Restent à trancher, côté Ville de Fleurus :

- les URL Facebook, Instagram, politique de vie privée et conditions générales
  (aujourd'hui en `href="#"`) ;
- cinq contrastes hors normes WCAG hérités de la maquette (titres blancs ou sable sur fond
  clair) — enjeu réglementaire pour un site public ;
- le logo Move in à réexporter : le « e » est tronqué dans le fichier source lui-même.

`robots.txt` bloque l'indexation tant que le site est en test : **à supprimer à la mise en
ligne**.
