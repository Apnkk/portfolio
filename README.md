# Ares — Full-Stack Developer & Creative Builder

Portfolio personnel d'Ares (Apnkk) : direction artistique sombre et chaude, typographie Clash Display, grain argentique, lecteur Web Audio integre et mise en avant de l'ecosysteme de projets (Z-Flix iOS, Z-Flix PC Launcher, Spoti Liquid Glass, Z-Automation).

---

## Architecture & Points Cles

- Direction Artistique :
  - Noirs chauds (#0a0908), ambre (#f2a33c), accents carmin (#ff3d2e) et texte creme (#ede8dd).
  - Typographies : Clash Display, Satoshi et JetBrains Mono.
  - Curseur magnetique interactif avec anneau ambre et texture de grain argentique (.noise).

- Ambiance Audio ("Listen while browsing") :
  - Synthetiseur d'accords ambiants Web Audio API sans fichier audio externe lourd.
  - Visualiseur d'ondes et egaliseur canvas reactif en direct.
  - Disque vinyle anime dans la navigation lors de la lecture.

- Structure Editoriale :
  - 01 / WORK : Projets Z-Flix iOS, Z-Flix PC Launcher, Spoti Liquid Glass, Z-Automation.
  - 02 / NEXT : Annonce du projet Synthesis OS avec oscillographe canvas en direct.
  - 03 / STACK : 6 domaines techniques (Frontend, Backend, Data, Systems, Motion/UI, Product) avec vu-metres au survol.
  - 04 / METHOD : Les 5 etapes du process (Idee, Prototype, Architecture, Finition, Livraison).
  - 05 / ABOUT : Presentation personnelle sans langue de bois.
  - 06 / CONTACT : Copie d'email en un clic, formulaire direct et liens vers GitHub (@Apnkk) et Discord.

- Bilingue Francais / Anglais :
  - Commutateur instantane EN / FR dans la barre de navigation.

- CLI Integree :
  - Terminal developpeur interactif accessible avec les commandes : help, bio, projects, skills, contact, email, clear, sudo.

---

## Stack Technique

- Framework : React 19 + Vite
- Langage : TypeScript strict
- Styles : Tailwind CSS v4
- Animations : Framer Motion
- Audio : Web Audio API native + Canvas 2D
- Linters : oxlint

---

## Commandes

```bash
# Installation
npm install

# Developpement
npm run dev

# Build de production
npm run build

# Verification lint
npm run lint
```

---

## Configuration des Donnees

Toutes les informations (projets, liens, bio, stack, contact) sont centralisees dans :

`src/data/portfolioData.ts`
