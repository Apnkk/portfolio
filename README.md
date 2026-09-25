# 🚀 Portfolio Moderne Web & Mobile (React 19 + Tailwind CSS v4)

Portfolio d'ingénieur logiciel et développeur Full-Stack Web & Mobile avec design ultra-moderne (esthétique Linear / Vercel Dark), micro-interactions soignées, grille Bento interactive, CLI intégrée et support bilingue FR/EN.

---

## ✨ Fonctionnalités Clés

- **Direction Artistique Linear Dark** : Noirs profonds (`#07070a`), bordures fines 1px, accents lumineux (cyan, violet, indigo) et fond avec grille subtile.
- **Éclairage d'Ambiance Réactif** : Torche lumineuse dynamique qui suit le curseur en douceur via des ressorts physiques (`framer-motion`).
- **Barre de Navigation Flottante (Dock Pill)** : Glassmorphism, détection automatique de la section active, toggle de langue bilingue (FR/EN) et raccourci terminal.
- **Grille Bento "À Propos"** :
  - Philosophie & Clean Architecture
  - Horloge interactive en direct de Paris / Europe (`CET / UTC+1`)
  - Compteurs métriques clés (années d'expérience, projets livrés, uptime, satisfaction)
  - Veille active & domaines d'exploration actuels
- **Showcase de Projets Filtrable** :
  - Filtres instantanés : *Tous*, *Full-Stack*, *Mobile*, *IA & Automatisation*, *Outils*
  - Badges de statut (*En production*, *Open Source*) et métriques clés
  - **Modal de détail complet** : Architecture technique, réalisations détaillées, stack complète et liens Live / GitHub. Support de la touche `Échap` et clic extérieur.
- **Matrice de Compétences Interactive** : Onglets par domaine (Frontend, Backend, Mobile, Cloud/DevOps, IA & Outils) avec jauges de maîtrise animées.
- **Parcours & Expériences** : Chronologie interactive des expériences pro et du parcours académique.
- **Terminal Développeur Interactif (`CLI`)** :
  - Mini émulateur de terminal interactif accessible via la navbar ou le footer.
  - Commandes supportées : `help`, `bio`, `projects`, `skills`, `contact`, `email`, `clear`, `sudo`, `exit`.
- **Formulaire de Contact Moderne** :
  - Validation instantanée côté client
  - Effet de célébration confetti (`canvas-confetti`) à l'envoi
  - Bouton de copie en 1-clic de l'adresse email avec animation de confirmation
  - Liens directs vers GitHub, LinkedIn, X et Discord
- **Support Bilingue Natif (FR / EN)** :
  - Bascule instantanée entre Français et Anglais sur l'intégralité du site sans rechargement.

---

## 🛠️ Stack Technique

- **Framework** : [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Typage** : [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/) avec architecture CSS-first
- **Animations** : [Framer Motion](https://motion.dev/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Effets** : `canvas-confetti`
- **Qualité de code** : `oxlint` (0 erreurs, 0 avertissements)

---

## 🚀 Démarrage Rapide

```bash
# 1. Cloner ou ouvrir le projet
cd p:\Portofolio

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Construire pour la production
npm run build
```

---

## ✏️ Personnaliser vos Informations

Toutes vos données (nom, bio, emails, liens de réseaux, projets, compétences, parcours) sont centralisées dans un seul fichier :

📁 [`src/data/portfolioData.ts`](./src/data/portfolioData.ts)

Il vous suffit de modifier les valeurs dans ce fichier pour mettre à jour instantanément tout le contenu de votre portfolio en Français et en Anglais !
