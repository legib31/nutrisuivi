# Handoff : Refonte visuelle de NutriSuivi (Agenda + Graphique)

## Vue d'ensemble
Refonte du design de l'application de suivi nutritionnel **NutriSuivi** (dépôt `legib31/nutrisuivi`, React + recharts).
L'appli existante fonctionne mais son style faisait « brut / généré ». Ce handoff définit une nouvelle
direction visuelle **moderne, sobre et partageable** (style « Modernist ») et l'illustre sur deux écrans :
**Agenda / Aujourd'hui** et **Graphique**.

L'objectif : appliquer ce look à l'appli React existante **sans perdre aucune fonctionnalité**. Le code
métier (calcul des cibles Mifflin, base d'aliments FOODS, sport MET, stockage `window.storage`, PWA, etc.)
reste inchangé — seule la couche de présentation (styles + structure JSX des écrans) est retravaillée.

## À propos des fichiers de design
Les fichiers de ce paquet sont des **références de design en HTML** — des prototypes qui montrent
l'apparence et le comportement voulus, **pas du code de production à copier tel quel**. Ils sont écrits
dans un format de composant (`.dc.html`) propre à l'outil de design et dépendent de `support.js`.
**Ne pas** essayer d'intégrer ces fichiers dans l'appli. La tâche est de **recréer ces écrans dans
l'environnement existant** du dépôt (React + les styles inline objet `S` déjà utilisés dans `NutriSuivi.jsx`),
en reprenant fidèlement les valeurs de design ci-dessous.

## Fidélité
**Haute fidélité (hifi).** Couleurs, typographie, espacements et interactions sont définitifs.
Reproduire l'UI au pixel près avec les patterns du codebase.

---

## Direction visuelle (design tokens)

**Principe** : plat, architectural, aligné à gauche, angles droits (0 radius), filets nets de 2px entre
les sections, une seule couleur d'accent. « Rien ne flotte, rien n'est décoré » — l'alignement et la
force des filets organisent la page.

### Couleurs
| Rôle | Valeur | Usage |
| --- | --- | --- |
| Accent (bleu ardoise) | `#235C86` | Grand chiffre, jauges, repères de repas, liens, onglet actif, bouton segmenté actif |
| Accent foncé (hover/pressed) | `#184863` | `:hover` des liens et actions |
| Accent clair (tint) | `#E4EDF3` | Fond de survol de ligne, `::selection` |
| Fond | `#F3F2F2` | Fond de toute l'appli |
| Surface | blanc / `#FFFFFF` | Champs, boutons secondaires |
| Texte encre | `#201E1D` | Texte principal |
| Texte atténué | `color-mix(#201E1D 52%, transparent)` | Légendes, unités, méta |
| Filet / divider | gris clair (token `--color-divider`) | Filets 1px internes, filets 2px de section |
| Positif (perte de poids) | `#2C6E49` (vert) | Stat « depuis le début » négative = bien |
| Négatif (prise de poids) | `#C0562B` (terracotta) | Stat positive = alerte |

> Remarque : l'appli d'origine utilisait 4 couleurs de repas criardes (`MEAL_COLORS`). Elles sont
> **abandonnées** au profit d'un repère monochrome : un petit carré plein `#235C86` (9×9px) devant chaque repas.

### Typographie
- **Une seule famille : Archivo** (titres et corps). Charger via Google Fonts ou l'avoir en local.
- Poids : 800 pour titres/chiffres (avec `letter-spacing:-0.01em`), 600 pour semi-gras, 400 corps.
- Kicker / label : 11–12px, `text-transform:uppercase`, `letter-spacing:.06em–.14em`.
- Grand chiffre (« kcal restantes », moyenne) : 64–112px, `line-height:.82–.85`, en accent.

### Espacement & structure
- Padding de section : ~38–46px horizontal.
- Filets de section : `2px solid var(--color-divider)`. Filets de ligne internes : `1px`.
- **Aucun arrondi** (`border-radius:0` partout). **Aucune ombre portée** décorative (sauf modale).
- Tout est aligné à gauche, y compris les labels dans les boutons larges.
- Icônes : **Lucide** (`copy`, `plus`, `x`, `waves`, `chevron-left/right`…).

---

## Écran 1 — Agenda / Aujourd'hui
Fichier de réf : `NutriSuivi.dc.html` (onglet Agenda). Explorations initiales : `NutriSuivi Agenda (explorations).dc.html`.

**But** : consulter et éditer les repas du jour, voir en un coup d'œil les calories restantes et les macros.

**Layout** : barre supérieure (marque + onglets + date), puis une grille **2 colonnes** :
- **Colonne gauche (≈460px, filet 2px à droite)** — panneau récap :
  - Kicker « AUJOURD'HUI » en accent + trait de 44×3px.
  - Grand chiffre `kcal restantes` (112px, accent) ; sous-titre « X sur Y kcal consommées · Z % ».
  - Jauge horizontale (hauteur 8px, remplissage accent).
  - 3 macros (Protéines / Glucides / Lipides) : label uppercase, valeur 24px, mini-jauge 4px.
- **Colonne droite** — repas du jour :
  - Titre « Repas du jour » + lien « Copier la veille » (icône `copy`).
  - Un bloc par repas (Déjeuner / Collation / Dîner / Souper), séparé par filet 2px :
    - En-tête : carré accent 9×9 + nom (19px, gras) + moment (uppercase atténué) + total kcal à droite.
    - Chaque aliment sur une ligne (filet 1px) : nom (14px, 600) à gauche ; à droite groupe d'actions
      **[ – ] quantité · kcal [ + ] [ × ]**. Boutons ± = carré 30×30, bord divider, hover accent.
    - Lien « + Ajouter à <repas> » (accent).
  - Bloc Sport (icône `waves`) puis « + Ajouter du sport ».

**Interactions** :
- **± quantité** : incrémente/décrémente de 10 g (unités g/ml) ou 1 (pièces), minimum 1. Recalcule kcal
  de l'aliment, total du repas, total consommé, restantes, jauge et macros — instantané.
- **× supprimer** : retire l'aliment ; recalcul complet.
- **+ Ajouter** : ouvre une **modale de recherche** (voir plus bas), pré-ciblée sur le repas cliqué.
- **Copier la veille** : ajoute les repas du jour précédent (dans l'appli réelle : `duplicatePrevDay()` existe déjà).

**Modale d'ajout d'aliment** :
- Overlay sombre `rgba(20,18,17,.42)`, carte centrée max 520px, bord 2px encre, ombre portée.
- En-tête : « AJOUTER À » + nom du repas + bouton `×`.
- Champ recherche (focus = bord accent + outline 2px accent).
- Liste de résultats filtrée sur le nom (insensible casse/accents — utiliser `norm()` du codebase) ;
  chaque ligne : nom + « N kcal / 100 g » + icône `plus`. Clic = ajoute l'aliment (quantité par défaut 100 g)
  et ferme. Dans l'appli réelle, la source est `catalog` (= `FOODS` + `customFoods`) avec ses portions `PORT`.

---

## Écran 2 — Graphique
Fichier de réf : `NutriSuivi.dc.html` (onglet Graphique). Correspond à la fonction `Graphique()` du dépôt (~L2525).

**But** : visualiser l'évolution dans le temps.

**Layout** :
- Kicker « STATISTIQUES » + trait.
- **Deux contrôles segmentés** (filet 1px, option active = fond accent, texte blanc) :
  - **Mesure** : Calories · Net · Poids · Sport.
  - **Période** : Semaine · Mois. (Le codebase gère aussi un `span` ; conserver la logique existante.)
- **Bandeau chiffre-clé** : grand nombre (64px accent) + unité, puis 1–2 stats secondaires
  (ex. « Cible 2174 », « Jours sous cible 5/7 » ; pour Poids : « Depuis le début −0.8 kg » en vert,
  « Par semaine »).
- **Zone graphique** (hauteur ~320px, axes = filets bas + gauche 1px) :
  - Calories / Net / Sport → **barres verticales** (remplissage accent ; Net en accent foncé), valeur au-dessus
    de chaque barre, label de période dessous.
  - Une **ligne de référence pointillée en accent** = la **cible** (Calories/Net) — au-dessus = surplus, en dessous = déficit.
    Sport : pas de ligne de référence.
  - Poids → **courbe** (polyline accent 2.5px) + **ligne pointillée = objectif** (80 kg), labels de période.

**Comportement / données** (dans l'appli réelle, ne pas réinventer) :
- Métriques calculées depuis `diary` (repas) et `sport` par jour, agrégées par `gran` (semaine/mois) — voir
  les helpers existants `poidsDataFn`, `sommeMacros`, `sommeSport`, `creditedKcal`.
- Net = mangé − dépense sport. Cible = `cible` (issue de Mifflin + déficit). Objectif = `profil.objectif`.
- Le prototype utilise des **données d'exemple** ; brancher sur les vraies séries du store.
- Recharts est déjà une dépendance : garder `BarChart`/`LineChart` avec `ReferenceLine`, juste **restylés**
  aux tokens ci-dessus (barres accent, pas d'arrondi, grille discrète, police Archivo).

---

## Navigation
Barre supérieure : marque « NutriSuivi » (800, -0.02em) à gauche ; onglets au centre
(Agenda · Semaine · Liste · Graphique · Profil) — onglet actif en accent avec **soulignement 2px accent** ;
date + objectif à droite. Sur mobile, l'appli d'origine met la nav en bas : conserver ce comportement
responsive (la barre du prototype est la version desktop).

## États à ne pas oublier
- Hover : liens → accent foncé ; boutons ± → bord + texte accent ; lignes de la modale → fond `#E4EDF3`.
- Focus clavier : `outline:2px solid #235C86; outline-offset:2px` (jamais le bleu par défaut du navigateur).
- Repas vide (Souper) : afficher « À compléter. » atténué.
- Disabled : opacité 45 %.

## Assets
- Police **Archivo** (Google Fonts).
- Icônes **Lucide** (déjà adaptées ; le dépôt utilise des glyphes texte — les remplacer par Lucide est optionnel mais recommandé).
- Aucune image bitmap requise pour ces deux écrans.

## Fichiers de ce paquet
- `NutriSuivi.dc.html` — prototype hifi **interactif** des écrans Agenda + Graphique (référence principale).
- `NutriSuivi Agenda (explorations).dc.html` — 3 directions initiales + déclinaisons de couleur (contexte ; la direction retenue est le bleu ardoise).
- `support.js` — runtime du format de prototype (ne pas porter ; présent seulement pour que les .dc.html s'ouvrent).

Pour visualiser un prototype : l'ouvrir dans un navigateur. Le `.dc.html` charge `support.js` et se rend seul.

## Captures (dossier `screenshots/`)
- `agenda.png` — écran Agenda / Aujourd'hui complet.
- `agenda-modale-ajout.png` — modale de recherche/ajout d'aliment.
- `graph-calories.png` — Graphique, mesure Calories (barres + ligne de cible).
- `graph-poids.png` — Graphique, mesure Poids (courbe + ligne d'objectif).
