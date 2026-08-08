# NutriSuivi — recompiler le site (pour Claude Code)

Le code lisible est **NutriSuivi.jsx**. Le fichier envoyé en ligne est **app.bundle.js** (compilé).
On ne modifie jamais app.bundle.js à la main : on édite NutriSuivi.jsx, puis on recompile.

**Depuis le 08/08/2026 : le code source et le dépôt GitHub sont fusionnés dans un seul dossier**
(`Documents/GitHub/nutrisuivi`). Plus de copier-coller entre deux dossiers — `npm run build`
génère `app.bundle.js` directement à côté d'`index.html`.

## Fichiers du build (tous dans le même dossier que le dépôt GitHub)
- `NutriSuivi.jsx` — code source de l'app.
- `main.jsx` — point d'entrée : IndexedDB + Firebase (auth/sync) + montage React + service-worker. Importe `./app-src.jsx`.
- `app-src.jsx` — copie de `NutriSuivi.jsx` utilisée par le build.
- `package.json` — dépendances + script de build.

## Étapes (une seule fois)
1. Installer Node.js (nodejs.org).
2. Dans le dossier : `npm install`

## À chaque modif
1. Éditer `NutriSuivi.jsx`.
2. Le copier en `app-src.jsx` :  `cp NutriSuivi.jsx app-src.jsx`
3. Compiler :  `npm run build`   → régénère `app.bundle.js` sur place.
4. GitHub Desktop : commit + push (le dépôt est déjà le dossier de travail).

## Commande de build complète (si besoin sans npm script)
esbuild main.jsx --bundle --minify --format=iife --jsx=transform --define:process.env.NODE_ENV='"production"' --outfile=app.bundle.js

## Vérifier que ça compile (sans bundler Firebase/React)
esbuild NutriSuivi.jsx --bundle --format=esm --external:react --external:recharts --outfile=/tmp/out.js

## Fichiers du site (versionnés dans le dépôt GitHub)
- `index.html` (contient la config Firebase)
- `app.bundle.js` (généré par le build — ne pas éditer à la main)
- `service-worker.js` (network-first + auto-update — mettre à jour quand la logique de cache change)
- `manifest.json`, `icon-192.png`, `icon-512.png`
- `firestore.rules`
- `.gitignore` — exclut `node_modules/` (ne doit jamais être poussé sur GitHub)

## Système de mise à jour (depuis v1.6)
- Constante `VERSION` dans NutriSuivi.jsx — à bumper à chaque changement visible.
- `CACHE` dans service-worker.js — à bumper aussi (invalide l'ancien cache).
- Le SW installe la nouvelle version en tâche de fond puis recharge automatiquement l'app au démarrage suivant.
- Bouton « Rechercher une mise à jour » dans Profil pour forcer la vérification manuellement.

## Décisions clés du projet (contexte pour continuer)
- Modèle d'activité en 2 axes : NEAT (métier) + fréquence de sport → maintenance (Mifflin-St Jeor).
- Crédit du sport en calories : OFF par défaut (déconseillé en perte) ; la balance sur plusieurs semaines est le juge.
- Sources d'ajout : liste officielle (CIQUAL, valeurs vérifiées) > code-barres (Open Food Facts) > saisie libre IA > photo IA.
- Saisie libre : cherche d'abord dans la liste officielle ; ce qui manque = estimé IA, signalé, NON ajouté à la liste.
- Firebase projet : nutrisuivi-633a3 (Auth email + Firestore, règles users/{uid}/kv/{docId}).
- Palette : bg #F4F6F1, vert #2C6E49, ambre #E0912F, turquoise #3E9CA8 (sport), plum #6B4EA8 (IA), encre #17241C. Polices Space Grotesk + Inter.
- Recettes maison : stockées dans `customFoods` avec un champ `ingredients: [{foodId, grams}]`. Les macros /100g sont recalculées à partir des ingrédients.

## IMPORTANT — fonctions IA sur le site public
La saisie libre et la photo appellent api.anthropic.com. Ça marche gratuitement dans l'aperçu Claude,
mais PAS sur le site public (pas de clé). Pour les activer en ligne : mettre un "pont" serveur (ex. Cloud
Function Firebase ou Cloudflare Worker) qui détient la clé Anthropic. Coût ~1-3 €/mois en usage perso.
Tant que ce pont n'existe pas, ces deux boutons échouent en ligne ; le reste fonctionne.

## État des chantiers
FAIT : hydratation, fibres/sucres, ajout multiple, assistant de 1er réglage, onglet Semaine, export CSV,
système de mise à jour auto, recettes maison.
À FAIRE :
  - Pont serveur (Cloud Function ou Cloudflare Worker) pour activer la saisie libre IA et la photo IA en ligne.
