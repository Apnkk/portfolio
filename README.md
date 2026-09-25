# ⚡ Ares — Full-Stack Developer & Creative Builder

Portfolio moderne, éditorial et immersif d'ingénieur logiciel et développeur Full-Stack Web & Mobile, combinant une direction artistique forte (palette sombre chaude, typographie d'affiche *Clash Display*, grain argentique, curseur magnétique et ambiance sonore Web Audio API intégrée).

---

## ✨ Points Forts & Direction Artistique

- **Ambiance Visuelle Unique** :
  - Noirs chauds profonds (`#0a0908`), touches d'ambre vif (`#f2a33c`), accents carmin (`#ff3d2e`) et typographie texturée crème (`#ede8dd`).
  - Typographies premium : **Clash Display** (titrages monumentaux), **Satoshi** (corps éditorial) et **JetBrains Mono** (accents techniques).
  - Texture de film argentique subtile (`.noise`) et curseur magnétique interactif avec halo ambré réactif aux éléments cliquables.

- **Expérience Audio Immersive (« Listen while browsing »)** :
  - **Dock audio persistant en bas à droite** propulsé par l'API Web Audio native (génération d'accords lo-fi et synthwave chauds en direct, 0 fichier externe lourd, 0 problème de droits d'auteur).
  - Égaliseur visuel en temps réel sur canvas interactif et disque vinyle tournant dans la barre de navigation quand la musique est active.

- **Structure Éditoriale Numérotée** :
  - **01 / WORK** : Grands titres au survol (`① NexusFlow AI ↗`, `② PulseTrack Mobile ↗`, etc.), cartes visuelles avec balayage d'effet cathodique (*scanlines*), métriques réelles et modale complète d'architecture logicielle.
  - **02 / NEXT** : Teaser grand format (*The next record*) avec oscillographe d'onde sinusoïdale en direct sur canvas.
  - **03 / STACK** : Grille de 6 domaines d'ingénierie (*Frontend*, *Backend*, *Data*, *Systems & Cloud*, *Motion/UI*, *Product & Velocity*) avec vu-mètre interactif au survol de chaque cellule.
  - **04 / METHOD** : Les 5 étapes de développement (*Idée*, *Prototype*, *Architecture*, *Finition*, *Livraison*) reliées par une ligne temporelle continue.
  - **05 / ABOUT** : Manifeste de développement, philosophie de code rapide combinée à la rigueur d'ingénierie et automatisation.
  - **06 / CONTACT** : Titre XXL percutant (*Got a project that needs volume?*), bouton de copie d'email en un clic avec confettis, formulaire direct intégré et liens réseaux sociaux.

- **Bilingue Instantané (FR / EN)** :
  - Sélecteur rapide dans l'en-tête permettant de basculer la totalité du contenu entre Français et Anglais.

- **CLI Dev Interactif** :
  - Accédez au mini-terminal intégré (`$ help`, `projects`, `skills`, `bio`, `contact`) depuis le bouton terminal.

---

## 🛠️ Stack Technique

- **Framework** : [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Typage** : [TypeScript](https://www.typescriptlang.org/) (mode strict)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations** : [Framer Motion](https://motion.dev/)
- **Audio & Visualizer** : Web Audio API & Canvas 2D
- **Qualité de code** : `oxlint` (0 erreurs, 0 avertissements)

---

## 🚀 Lancement Local

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Compiler pour la production
npm run build
```

---

## ✏️ Personnalisation de vos Informations

Toutes vos données (nom, bio, email, liens de réseaux, projets, compétences, parcours) sont modifiables dans un seul fichier :

📁 [`src/data/portfolioData.ts`](./src/data/portfolioData.ts)
