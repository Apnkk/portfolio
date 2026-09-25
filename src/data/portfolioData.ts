import type { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  personal: {
    name: "Ares Dev",
    role: {
      fr: "Développeur Full-Stack Web & Mobile",
      en: "Full-Stack Web & Mobile Developer"
    },
    shortBio: {
      fr: "Je conçois des applications web et mobiles performantes, esthétiques et intuitives avec React, Next.js, Node.js et React Native.",
      en: "I build high-performance, beautiful, and intuitive web and mobile applications using React, Next.js, Node.js, and React Native."
    },
    fullBio: {
      fr: "Passionné par l'intersection entre ingénierie logicielle robuste et design d'interaction soigné, je développe des solutions scalables de bout en bout. De l'architecture backend distribuée aux micro-interactions frontend fluides, je transforme des idées complexes en produits numériques d'exception.",
      en: "Passionate about the intersection of robust software engineering and polished interaction design, I build scalable end-to-end solutions. From distributed backend architectures to fluid frontend micro-interactions, I turn complex ideas into standout digital products."
    },
    location: "Paris, France (Disponible en remote)",
    timezone: "Europe/Paris",
    availability: {
      status: "available",
      text: {
        fr: "Disponible pour de nouvelles opportunités & missions",
        en: "Available for new projects & opportunities"
      }
    },
    email: "contact.ares.dev@gmail.com",
    resumeUrl: "#contact"
  },
  stats: [
    {
      value: "3+",
      label: { fr: "Années d'expérience", en: "Years Experience" },
      subtext: { fr: "En production logicielle", en: "In production software" }
    },
    {
      value: "25+",
      label: { fr: "Projets livrés", en: "Projects Shipped" },
      subtext: { fr: "Web, Mobile & APIs", en: "Web, Mobile & APIs" }
    },
    {
      value: "99.9%",
      label: { fr: "Uptime & Fiabilité", en: "Uptime & Reliability" },
      subtext: { fr: "Architecture testée", en: "Battle-tested arch" }
    },
    {
      value: "100%",
      label: { fr: "Satisfaction Client", en: "Client Satisfaction" },
      subtext: { fr: "Focus qualité & vitesse", en: "Quality & speed focus" }
    }
  ],
  socials: [
    {
      name: "GitHub",
      url: "https://github.com",
      icon: "Github",
      handle: "@ares-dev"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "Linkedin",
      handle: "in/ares-dev"
    },
    {
      name: "X / Twitter",
      url: "https://x.com",
      icon: "Twitter",
      handle: "@ares_code"
    },
    {
      name: "Discord",
      url: "https://discord.com",
      icon: "MessageSquare",
      handle: "ares.dev"
    }
  ],
  projects: [
    {
      id: "nexusflow-ai",
      title: "NexusFlow AI",
      category: "ai",
      categoryLabel: { fr: "IA & Automatisation", en: "AI & Automation" },
      tagline: {
        fr: "Plateforme d'orchestration de workflows IA autonomes et traitement multimodal.",
        en: "Autonomous AI workflow orchestration platform and multimodal processing engine."
      },
      description: {
        fr: "Application SaaS permettant aux équipes de connecter des LLMs, bases vectorielles et APIs tierces via un éditeur visuel nodale en temps réel.",
        en: "SaaS application enabling engineering teams to connect LLMs, vector databases, and third-party APIs via a real-time nodal visual builder."
      },
      longDescription: {
        fr: "NexusFlow AI est une solution complète conçue pour rationaliser l'intégration d'agents d'intelligence artificielle dans les processus métier. Elle intègre un éditeur de graphes interactif avec rendu instantané, un moteur d'exécution asynchrone capable de traiter des milliers d'événements par seconde, ainsi qu'une passerelle de streaming SSE avec tolérance aux pannes.",
        en: "NexusFlow AI is an end-to-end solution designed to streamline the integration of AI agents into enterprise workflows. It features a reactive node canvas with instant rendering, an asynchronous execution engine handling thousands of events per second, and an SSE streaming gateway with automated fallback."
      },
      tags: ["Next.js 15", "TypeScript", "FastAPI", "LangChain", "PostgreSQL", "Tailwind CSS"],
      metrics: { fr: "+12 000 requêtes / jour", en: "+12,000 queries / day" },
      featured: true,
      status: "production",
      statusLabel: { fr: "En production", en: "In Production" },
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      features: {
        fr: [
          "Éditeur nodale visuel avec React Flow et drag-and-drop fluide",
          "Streaming de réponses LLM en direct avec gestion d'interruption",
          "Indexation vectorielle avec Pinecone et embeddings dynamiques",
          "Authentification sécurisée avec RBAC et abonnements Stripe"
        ],
        en: [
          "Interactive visual node builder with React Flow and fluid drag-and-drop",
          "Real-time LLM response streaming with interruption handling",
          "Vector indexing with Pinecone and dynamic embeddings pipeline",
          "Secure authentication with granular RBAC and Stripe subscription tiers"
        ]
      },
      architecture: {
        fr: "Architecture micro-services hybride avec Next.js 15 en frontend, FastAPI pour les pipelines d'IA intensifs, et PostgreSQL managé avec pgvector pour le stockage unifié des données et embeddings.",
        en: "Hybrid microservices architecture featuring Next.js 15 on the edge, FastAPI for compute-heavy AI pipelines, and managed PostgreSQL with pgvector for unified relational data and embeddings."
      }
    },
    {
      id: "pulsetrack-mobile",
      title: "PulseTrack Mobile",
      category: "mobile",
      categoryLabel: { fr: "Mobile & Santé", en: "Mobile & Health" },
      tagline: {
        fr: "Application mobile cross-platform de suivi biométrique et fitness personnalisé.",
        en: "Cross-platform mobile app for biometric tracking and personalized fitness analytics."
      },
      description: {
        fr: "Application iOS & Android conçue avec React Native et Expo, offrant des graphiques temps réel, synchronisation offline-first et synchronisation avec Apple Health & Google Fit.",
        en: "iOS & Android app built with React Native and Expo, offering realtime charts, offline-first sync, and native sync with Apple Health & Google Fit."
      },
      longDescription: {
        fr: "PulseTrack permet aux sportifs et coachs d'analyser leurs performances physiologiques avec une précision clinique. L'application intègre un moteur de synchronisation locale basé sur WatermelonDB garantissant un fonctionnement fluide même sans connexion Internet, synchronisant automatiquement les données dès la reconnexion.",
        en: "PulseTrack enables athletes and coaches to analyze biometric data with clinical precision. Built with a local-first engine using WatermelonDB, the app guarantees smooth 60fps operation even in offline conditions, seamlessly reconciling updates upon reconnection."
      },
      tags: ["React Native", "Expo", "TypeScript", "Supabase", "Reanimated", "Tailwind Native"],
      metrics: { fr: "4.9/5 étoiles (5k+ dl)", en: "4.9/5 stars (5k+ dl)" },
      featured: true,
      status: "production",
      statusLabel: { fr: "App Store & Play Store", en: "App Store & Play Store" },
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      features: {
        fr: [
          "Interface fluide 60 FPS propulsée par React Native Reanimated 3",
          "Synchronisation bidirectionnelle Apple HealthKit et Google Fit",
          "Architecture Offline-First avec résolution automatique des conflits",
          "Widgets d'accueil iOS & Android interactifs"
        ],
        en: [
          "Silky smooth 60 FPS UI powered by React Native Reanimated 3",
          "Bidirectional sync with Apple HealthKit and Google Fit APIs",
          "Offline-First data layer with conflict resolution algorithms",
          "Interactive iOS & Android home screen widgets"
        ]
      },
      architecture: {
        fr: "Codebase unifiée TypeScript avec Expo EAS, backend Supabase avec Row Level Security (RLS) et fonctions Edge sans serveur.",
        en: "Unified TypeScript codebase using Expo EAS, backed by Supabase with Row Level Security (RLS) and serverless Edge Functions."
      }
    },
    {
      id: "devstudio-cloud",
      title: "DevStudio Cloud",
      category: "fullstack",
      categoryLabel: { fr: "Full-Stack Web", en: "Full-Stack Web" },
      tagline: {
        fr: "Environnement de développement collaboratif en ligne avec conteneurs éphémères.",
        en: "Cloud-native collaborative IDE with instant ephemeral container environments."
      },
      description: {
        fr: "Éditeur de code dans le navigateur avec support multi-curseur, terminal WebRTC interactif, exécution de code sandboxée et prévisualisation instantanée.",
        en: "In-browser code editor featuring live multi-cursor pairing, interactive WebRTC terminal, sandboxed code execution, and instant live preview."
      },
      longDescription: {
        fr: "DevStudio Cloud résout le problème de configuration locale pour les équipes de dev. En un clic, un développeur peut lancer un environnement complet avec VSCode dans le navigateur, synchroniser son code avec ses pairs via des CRDTs (Yjs) et compiler son application dans un conteneur sécurisé.",
        en: "DevStudio Cloud eliminates local environment setup hurdles. In a single click, developers spin up isolated workspaces, collaborate live using conflict-free replicated data types (CRDTs / Yjs), and compile code inside hardened micro-containers."
      },
      tags: ["React 19", "Node.js", "WebSockets", "Docker", "Monaco Editor", "Redis"],
      metrics: { fr: "<80ms latence sync", en: "<80ms sync latency" },
      featured: true,
      status: "opensource",
      statusLabel: { fr: "Open Source", en: "Open Source" },
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
      features: {
        fr: [
          "Collaboration en temps réel multi-utilisateurs avec Yjs et WebSockets",
          "Émulateur de terminal interactif via xterm.js et protocoles PTY",
          "Orchestration dynamique de conteneurs Docker éphémères",
          "Système de fichiers virtuel performant et persistance cloud"
        ],
        en: [
          "Real-time multi-user live code pairing via Yjs and WebSockets",
          "Interactive browser terminal powered by xterm.js and PTY streams",
          "Dynamic orchestration of ephemeral Docker worker containers",
          "Fast in-memory virtual file system with background cloud snapshots"
        ]
      },
      architecture: {
        fr: "Frontend React 19 avec Monaco Editor, cluster de passerelles WebSocket Node.js avec pub/sub Redis et workers de conteneurs Docker isolés.",
        en: "React 19 frontend with Monaco Editor, clustered Node.js WebSocket gateways with Redis pub/sub, and isolated Docker container worker fleet."
      }
    },
    {
      id: "synthetix-commerce",
      title: "Synthetix Commerce",
      category: "fullstack",
      categoryLabel: { fr: "E-Commerce Headless", en: "Headless E-Commerce" },
      tagline: {
        fr: "Boutique en ligne headless ultra-optimisée avec score de performance 100/100.",
        en: "Ultra-optimized headless commerce storefront with 100/100 Core Web Vitals."
      },
      description: {
        fr: "Plateforme e-commerce moderne conçue pour une vitesse maximale : navigation instantanée, transitions de vue fluides, panier persistant et checkout Stripe intégré.",
        en: "Modern e-commerce platform built for extreme speed: instantaneous navigation, smooth view transitions, persistent cart, and Stripe Checkout."
      },
      longDescription: {
        fr: "Synthetix Commerce illustre les standards de performance web les plus exigeants : temps de chargement sous la seconde, Interaction to Next Paint (INP) inférieur à 50ms, et navigation sans aucun rechargement grâce à l'API View Transitions.",
        en: "Synthetix Commerce exemplifies bleeding-edge web performance standards: sub-second initial paint, INP under 50ms, and zero-reload navigation via the native View Transitions API."
      },
      tags: ["Next.js App Router", "Tailwind CSS v4", "TanStack Query", "Stripe API", "Zustand"],
      metrics: { fr: "100/100 Lighthouse", en: "100/100 Lighthouse" },
      featured: false,
      status: "production",
      statusLabel: { fr: "En production", en: "In Production" },
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      features: {
        fr: [
          "Score Lighthouse 100/100 en Performance, SEO et Accessibilité",
          "Moteur de recherche instantané à tolérance de fautes",
          "Paiement 1-click avec Apple Pay, Google Pay et Stripe",
          "Gestion globale de l'état panier avec Zustand et persistance locale"
        ],
        en: [
          "100/100 Lighthouse scores in Performance, SEO, and Accessibility",
          "Instant fuzzy product search with client-side indexing",
          "One-click checkout with Apple Pay, Google Pay, and Stripe",
          "Global cart state management with Zustand and persistent storage"
        ]
      },
      architecture: {
        fr: "Next.js App Router avec rendu hybride statique/dynamique (ISR), API GraphQL Shopify/Medusa, et mise en cache distribuée sur Vercel Edge Network.",
        en: "Next.js App Router with hybrid ISR caching, headless commerce GraphQL endpoints, and distributed edge caching via Vercel Edge Network."
      }
    },
    {
      id: "ciphervault",
      title: "CipherVault",
      category: "tools",
      categoryLabel: { fr: "Sécurité & Cryptographie", en: "Security & Crypto" },
      tagline: {
        fr: "Gestionnaire de secrets d'équipe Zero-Knowledge avec authentification Passkeys.",
        en: "Zero-Knowledge team secrets manager with biometric Passkeys authentication."
      },
      description: {
        fr: "Application sécurisée de partage de variables d'environnement et certificats chiffrés de bout en bout avec WebCrypto API et WebAuthn.",
        en: "Secure end-to-end encrypted secret and certificate manager using WebCrypto API and biometric WebAuthn."
      },
      longDescription: {
        fr: "CipherVault garantit que le serveur ne connaît jamais les clés privées ni les mots de passe des utilisateurs. Le chiffrement AES-256-GCM s'effectue intégralement dans le navigateur côté client avant tout envoi réseau.",
        en: "CipherVault ensures the server never possesses master keys or user credentials. High-grade AES-256-GCM encryption occurs entirely inside the client browser prior to any network transmission."
      },
      tags: ["TypeScript", "React", "Rust", "WebCrypto API", "WebAuthn", "Tailwind CSS"],
      metrics: { fr: "Chiffrement AES-GCM 256", en: "AES-GCM 256 Encryption" },
      featured: false,
      status: "opensource",
      statusLabel: { fr: "Open Source", en: "Open Source" },
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
      features: {
        fr: [
          "Authentification biométrique sans mot de passe via Passkeys (WebAuthn)",
          "Chiffrement Zero-Knowledge côté client avec WebCrypto",
          "Partage sécurisé de secrets avec révocation instantanée",
          "Audit trail immuable pour chaque accès aux identifiants"
        ],
        en: [
          "Passwordless biometric authentication via Passkeys (WebAuthn)",
          "Client-side Zero-Knowledge encryption with WebCrypto API",
          "Secure secret sharing with granular instant revocation",
          "Tamper-proof audit logs for all credential access events"
        ]
      },
      architecture: {
        fr: "Frontend React avec primitives WebCrypto, microservice d'audit écrit en Rust pour un maximum de sûreté mémoire et PostgreSQL chiffré.",
        en: "React frontend leveraging WebCrypto primitives, hardened audit microservice in Rust for memory safety, and encrypted PostgreSQL store."
      }
    },
    {
      id: "aura-ui",
      title: "Aura UI Kit",
      category: "tools",
      categoryLabel: { fr: "Design System & UI", en: "Design System & UI" },
      tagline: {
        fr: "Collection de composants React haut de gamme, accessibles et micro-animés.",
        en: "Premium, accessible, and micro-animated React UI component system."
      },
      description: {
        fr: "Design system open source pour développeurs exigeants : boutons tactiles, modales accessibles (WCAG 2.2 AA), bento grids et animations fluides.",
        en: "Open source design system for discerning developers: tactile buttons, WCAG 2.2 AA compliant modal dialogs, bento grids, and fluid motion."
      },
      longDescription: {
        fr: "Aura UI est né du besoin de composants frontend modernes combinant esthétique Linear/Apple, conformité stricte aux standards d'accessibilité (European Accessibility Act) et zéro surcoût de bundle grâce à Tailwind CSS v4.",
        en: "Aura UI was born from the need for modern frontend components merging Linear/Apple aesthetics with strict accessibility compliance (EAA & WCAG 2.2 AA) and minimal bundle overhead via Tailwind CSS v4."
      },
      tags: ["React 19", "Tailwind CSS v4", "Framer Motion", "Radix UI", "Accessibility"],
      metrics: { fr: "100% WCAG 2.2 AA", en: "100% WCAG 2.2 AA" },
      featured: false,
      status: "opensource",
      statusLabel: { fr: "Composants npm", en: "npm Package" },
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      gradient: "from-cyan-500/20 via-indigo-500/10 to-transparent",
      features: {
        fr: [
          "Navigation clavier complète et pièges de focus optimisés pour lecteurs d'écran",
          "Compatible avec Tailwind CSS v4 et variables CSS natives",
          "Animations fluides propulsées par des ressorts physiques (spring physics)",
          "Prise en charge native des thèmes sombres et clairs"
        ],
        en: [
          "Full keyboard navigation and screen-reader focus traps",
          "Native Tailwind CSS v4 support with CSS design tokens",
          "Organic spring-physics animations powered by Motion",
          "First-class dark and light theme token synchronization"
        ]
      },
      architecture: {
        fr: "Architecture headless basée sur Radix UI Primitives, stylée avec Tailwind CSS v4 et packagée avec Rollup / tsup pour un tree-shaking parfait.",
        en: "Headless architecture built atop Radix UI Primitives, styled with Tailwind CSS v4, and packaged with tsup for optimal tree-shaking."
      }
    }
  ],
  skills: [
    {
      id: "frontend",
      title: { fr: "Frontend & UI/UX", en: "Frontend & UI/UX" },
      icon: "Layout",
      skills: [
        { name: "React 19", level: 95, highlight: true, tag: "Expert" },
        { name: "Next.js (App Router)", level: 92, highlight: true, tag: "Expert" },
        { name: "TypeScript", level: 94, highlight: true, tag: "Expert" },
        { name: "Tailwind CSS v4", level: 95, highlight: true, tag: "Expert" },
        { name: "Framer Motion", level: 88, highlight: false },
        { name: "TanStack Query", level: 90, highlight: false },
        { name: "HTML5 / WCAG 2.2 AA", level: 92, highlight: false }
      ]
    },
    {
      id: "backend",
      title: { fr: "Backend & Architectures", en: "Backend & Systems" },
      icon: "Server",
      skills: [
        { name: "Node.js & Express", level: 92, highlight: true, tag: "Expert" },
        { name: "NestJS", level: 85, highlight: false },
        { name: "Python & FastAPI", level: 86, highlight: true },
        { name: "PostgreSQL & Supabase", level: 90, highlight: true },
        { name: "REST & GraphQL", level: 88, highlight: false },
        { name: "Redis & Caching", level: 84, highlight: false },
        { name: "Prisma & Drizzle ORM", level: 89, highlight: false }
      ]
    },
    {
      id: "mobile",
      title: { fr: "Mobile & Cross-Platform", en: "Mobile & Apps" },
      icon: "Smartphone",
      skills: [
        { name: "React Native", level: 90, highlight: true, tag: "Avancé" },
        { name: "Expo & EAS", level: 92, highlight: true },
        { name: "Reanimated 3", level: 85, highlight: false },
        { name: "Offline-First Sync", level: 86, highlight: false },
        { name: "iOS & Android Builds", level: 84, highlight: false }
      ]
    },
    {
      id: "cloud-devops",
      title: { fr: "DevOps & Cloud", en: "DevOps & Cloud" },
      icon: "Cloud",
      skills: [
        { name: "Docker & Conteneurs", level: 88, highlight: true },
        { name: "CI/CD GitHub Actions", level: 86, highlight: false },
        { name: "Vercel / Cloudflare", level: 92, highlight: true },
        { name: "AWS (S3, Lambda, RDS)", level: 80, highlight: false },
        { name: "Linux & Bash", level: 85, highlight: false }
      ]
    },
    {
      id: "ai-tooling",
      title: { fr: "IA & Productivité", en: "AI & Modern Tooling" },
      icon: "Cpu",
      skills: [
        { name: "OpenAI & Anthropic APIs", level: 90, highlight: true },
        { name: "LangChain & RAG", level: 84, highlight: false },
        { name: "Vector DBs (Pinecone/pgvector)", level: 85, highlight: false },
        { name: "Git & GitFlow", level: 95, highlight: true },
        { name: "Figma (Dev Mode)", level: 88, highlight: false }
      ]
    }
  ],
  experiences: [
    {
      id: "exp-1",
      role: {
        fr: "Développeur Full-Stack Senior / Lead",
        en: "Senior / Lead Full-Stack Developer"
      },
      company: "TechScale Solutions",
      period: { fr: "2024 - Présent", en: "2024 - Present" },
      location: "Paris / Remote",
      description: {
        fr: "Direction technique de la refonte des plateformes web et mobiles de l'entreprise. Implémentation d'une architecture Next.js / TypeScript / PostgreSQL et mise en place des bonnes pratiques CI/CD.",
        en: "Technical leadership for the redesign of the company's core web and mobile platforms. Architected Next.js / TypeScript / PostgreSQL stack and automated CI/CD pipelines."
      },
      achievements: {
        fr: [
          "Réduction de 45% des temps de chargement LCP grâce à une stratégie d'optimisation Next.js",
          "Conception et livraison de l'application mobile en React Native (Expo) en 4 mois",
          "Mentorat d'une équipe de 4 développeurs et mise en place de revues de code rigoureuses"
        ],
        en: [
          "Reduced LCP load times by 45% through advanced Next.js caching and asset optimization",
          "Architected and shipped production cross-platform React Native app in 4 months",
          "Mentored 4 software engineers and established high-standard code review culture"
        ]
      },
      technologies: ["React 19", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS"],
      type: "work"
    },
    {
      id: "exp-2",
      role: {
        fr: "Développeur Full-Stack & Mobile",
        en: "Full-Stack & Mobile Developer"
      },
      company: "NovaPulse Studio",
      period: { fr: "2022 - 2024", en: "2022 - 2024" },
      location: "France / Remote",
      description: {
        fr: "Développement d'applications SaaS et mobiles pour des startups à forte croissance. Création d'APIs REST/GraphQL performantes et d'interfaces web ultra-réactives.",
        en: "Engineered scalable SaaS web applications and companion mobile apps for high-growth startups. Built resilient REST/GraphQL backends and reactive user interfaces."
      },
      achievements: {
        fr: [
          "Développement de plus de 10 micro-services avec Node.js et FastAPI",
          "Création d'un design system interne réutilisé sur 5 applications différentes",
          "Intégration de solutions de paiement Stripe et abonnements récurrents sécurisés"
        ],
        en: [
          "Shipped over 10 microservices with Node.js and FastAPI",
          "Created reusable internal design system adopted across 5 product teams",
          "Integrated Stripe billing, webhooks, and recurring multi-tier subscriptions"
        ]
      },
      technologies: ["React", "React Native", "TypeScript", "FastAPI", "Supabase", "Redis", "Tailwind CSS"],
      type: "work"
    },
    {
      id: "exp-3",
      role: {
        fr: "Master en Ingénierie Logicielle & Systèmes d'Information",
        en: "Master's Degree in Software Engineering & Information Systems"
      },
      company: "École d'Ingénieurs en Informatique",
      period: { fr: "2019 - 2022", en: "2019 - 2022" },
      location: "France",
      description: {
        fr: "Spécialisation en architectures logicielles distribuées, développement web et mobile avancé, bases de données relationnelles et non relationnelles, et sécurité applicative.",
        en: "Specialization in distributed software architectures, advanced web and mobile engineering, modern databases, and application security."
      },
      achievements: {
        fr: [
          "Major de promotion sur le projet de fin d'études en architecture cloud",
          "Hackathons remportés : 1ère place hackathon FinTech & Web3"
        ],
        en: [
          "Top graduation honors for capstone distributed cloud architecture project",
          "Winner: 1st place in FinTech innovation hackathon"
        ]
      },
      technologies: ["Algorithms", "Software Architecture", "Distributed Systems", "Database Design", "Security"],
      type: "education"
    }
  ],
  interests: {
    fr: [
      "Intelligence Artificielle & Agents autonomes",
      "Design d'interaction & Micro-animations",
      "Performance Web & Optimisation Core Web Vitals",
      "Open Source & Partage technique",
      "Musique & Design sonore"
    ],
    en: [
      "Artificial Intelligence & Autonomous Agents",
      "Interaction Design & Micro-animations",
      "Web Performance & Core Web Vitals optimization",
      "Open Source contribution & Dev Community",
      "Electronic Music & Audio Synthesis"
    ]
  }
};
