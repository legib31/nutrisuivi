# NutriSuivi — application installable (PWA)

App autonome : tout tourne dans le navigateur, données stockées **sur l'appareil** (IndexedDB), fonctionne **hors-ligne**. En option, tu peux activer des **comptes + synchro entre appareils** avec Firebase.

## Fichiers (à garder ensemble dans le même dossier)
- `index.html` — page d'entrée (+ la config Firebase à remplir)
- `app.bundle.js` — l'application (React + graphiques + Firebase, autonome)
- `manifest.json`, `service-worker.js` — installation + hors-ligne
- `icon-192.png`, `icon-512.png` — icônes
- `firestore.rules` — règles de sécurité (à coller dans Firebase)

## 1) Mettre en ligne (GitHub Pages)
1. Crée un dépôt (ex. `nutrisuivi`), dépose **tous** ces fichiers à la racine.
2. **Settings → Pages → Deploy from a branch → `main` → `/root`** → Save.
3. ~1 min plus tard : `https://<ton-pseudo>.github.io/nutrisuivi/`.

## 2) Installer sur le téléphone
- **Android/Chrome** : ouvre l'URL → menu ⋮ → « Ajouter à l'écran d'accueil ».
- **iPhone/Safari** : Partager → « Sur l'écran d'accueil ».

## 3) (Optionnel) Comptes + synchro téléphone ↔ PC — Firebase
Sans config, l'app reste locale. Pour la donner à plusieurs personnes et synchroniser :

1. **console.firebase.google.com** → **Add project** (nom au choix, Analytics non requis).
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable → Save.**
3. **Build → Firestore Database → Create database → Production mode → région (europe-west) → Enable.**
4. **Firestore → Rules** : colle le contenu de `firestore.rules` → **Publish**.
5. **Project settings (⚙️) → General → Your apps → Web `</>`** : enregistre l'app, copie l'objet `firebaseConfig`.
6. Ouvre `index.html`, colle les valeurs dans `window.FIREBASE_CONFIG` (décommente les lignes).
7. Repousse sur GitHub. L'app affiche maintenant **connexion / création de compte**.

### Ce que ça donne
- Chaque personne crée son compte (e-mail + mot de passe) et ne voit **que ses données** (règles de sécurité).
- À la connexion, l'app charge les données du compte ; ensuite chaque ajout s'écrit **en local (rapide, hors-ligne) et dans le cloud**.
- La même personne peut encoder sur son GSM **et** son PC : elle retrouve tout en se reconnectant. En cas de modif simultanée sur 2 appareils : **le dernier enregistrement gagne**.

## Sauvegarde / réinitialisation
**Profil → Sauvegarde** : Exporter (.json), Importer, Réinitialiser. Pense à **exporter avant** de passer en mode compte (le cloud repart d'un espace vierge par utilisateur, tu réimporteras ton .json).

## Notes
- Le scan code-barres et l'estimation photo (IA) nécessitent connexion + autorisation caméra ; ils marchent sur l'URL HTTPS déployée.
- Firestore limite chaque enregistrement à 1 Mo : pour un usage perso c'est large, mais si tu accumules **beaucoup de photos**, l'entrée qui les regroupe pourrait s'en approcher. On pourra alors basculer les photos vers Firebase Storage.
- Un outil de suivi ne remplace pas un professionnel de santé.
