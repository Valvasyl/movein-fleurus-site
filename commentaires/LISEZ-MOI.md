# Version commentée du code — référence

Les trois fichiers de la racine sont **déployés sans aucun commentaire** (décision du
06/09/2026 : ils représentaient 57 % de la feuille de style, soit ~17 Ko à télécharger à
chaque première visite). Ce dossier en conserve la **version intégralement commentée** : le
raisonnement derrière chaque valeur relevée sur les maquettes, les pièges rencontrés, les
décisions prises et leur motif.

| fichier | déployé | ici, commenté |
|---|---|---|
| `styles.css` | 29,4 Ko · 1 265 lignes | **75,8 Ko · 1 810 lignes** |
| `script.js`  | 4,3 Ko · 145 lignes    | **8,0 Ko · 194 lignes** |
| `index.html` | 21,2 Ko · 329 lignes   | identique — il n'a jamais eu de commentaires |

⚠️ **`accessibilite.html` n'est PAS copié ici**, et c'est volontaire : comme `index.html`
il ne contient aucun commentaire, une copie n'apporterait rien et ferait un fichier de plus
à tenir synchronisé. Sa mise en forme, elle, est documentée dans la **section 15** de
`commentaires/styles.css`.

## Règles d'usage

⚠️ **Cette copie ne se régénère pas toute seule : il n'y a pas d'étape de compilation.**
Toute modification de fond doit être reportée ici, sinon la documentation ment.

**Méthode conseillée : éditer ici, puis dépouiller vers la racine.** L'inverse — modifier la
racine puis tenter de recommenter — fait perdre le raisonnement à chaque passe.

```bash
# CSS : le dépouillement est mécanique et sûr (aucun /* dans une chaîne)
perl -0pe 's{/\*.*?\*/}{}gs' commentaires/styles.css > /tmp/x.css
```

⚠️ **Le JavaScript se dépouille à la main**, jamais par expression régulière : les `//` d'une
URL sont indiscernables d'un début de commentaire pour un remplacement naïf.

Chaque fichier de la racine porte en tête une ligne de rappel vers sa version commentée.
C'est le seul commentaire qui subsiste, et il est là exprès.

L'historique du projet, lui, est dans Git — pas dans ce dossier.
