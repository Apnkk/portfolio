import type { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  personal: {
    name: "Ares",
    role: {
      fr: "Développeur Full-Stack & Creative Builder",
      en: "Full-Stack Developer & Creative Builder"
    },
    shortBio: {
      fr: "Je développe des applications de streaming, du mobile iOS, du reverse d'APIs et des interfaces rapides qui ont du caractère.",
      en: "I build streaming-grade apps, iOS software, reverse-engineered APIs, and fast web products with character."
    },
    fullBio: {
      fr: "Je traite chaque projet comme un produit vivant. Je vibe-code vite pour sortir des prototypes fonctionnels, puis je consolide proprement : TypeScript strict, architectures scalables, builds iOS propres et pipelines d'automatisation. Pas de blabla inutile, du code qui tourne en prod.",
      en: "I treat every build like a living product. I vibe-code fast to get working prototypes in users' hands, then engineer it properly: strict TypeScript, scalable architectures, solid iOS builds, and automated pipelines. No corporate fluff, just code running in production."
    },
    location: "France (Remote friendly)",
    timezone: "Europe/Paris",
    availability: {
      status: "available",
      text: {
        fr: "Disponible pour projets & missions — vibe coder en France",
        en: "Available for contracts & full-stack builds — vibe coder in France"
      }
    },
    email: "contact.ares.dev@gmail.com",
    resumeUrl: "#contact"
  },
  stats: [
    {
      value: "10+",
      label: { fr: "Repositories publics & privés", en: "Public & Private Repos" },
      subtext: { fr: "Ecosystème Z-Flix & Outils", en: "Z-Flix Ecosystem & Tools" }
    },
    {
      value: "iOS & PC",
      label: { fr: "Plateformes supportées", en: "Platforms Supported" },
      subtext: { fr: "Mobile, Desktop & Web", en: "Mobile, Desktop & Web" }
    },
    {
      value: "WASM / TS",
      label: { fr: "Stack de prédilection", en: "Primary Toolset" },
      subtext: { fr: "Performance & typage strict", en: "Performance & strict types" }
    },
    {
      value: "100%",
      label: { fr: "Autonomie de livraison", en: "Solo Shipping" },
      subtext: { fr: "De l'idée au déploiement", en: "From idea to live deploy" }
    }
  ],
  socials: [
    {
      name: "GitHub",
      url: "https://github.com/Apnkk",
      icon: "Github",
      handle: "@Apnkk"
    },
    {
      name: "Discord",
      url: "https://discord.com",
      icon: "MessageSquare",
      handle: "ares.dev"
    },
    {
      name: "X / Twitter",
      url: "https://x.com",
      icon: "Twitter",
      handle: "@ares_code"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com",
      icon: "Linkedin",
      handle: "in/ares-dev"
    }
  ],
  projects: [
    {
      id: "z-flix-ios",
      title: "Z-Flix iOS",
      category: "mobile",
      categoryLabel: { fr: "iOS & Streaming", en: "iOS & Streaming" },
      tagline: {
        fr: "Application de streaming pour iOS avec Liquid Glass UI, optimisée pour Feather et AltStore.",
        en: "Streaming-grade media app for iOS with Liquid Glass UI for Feather and AltStore."
      },
      description: {
        fr: "Client mobile complet pour la lecture de films et animés sans jailbreak. Intègre un lecteur natif optimisé, reprise de lecture et interface Liquid Glass fluide.",
        en: "Full-featured mobile client for movies and anime streaming without jailbreak. Native media player, resume state, and liquid-smooth glass interactions."
      },
      longDescription: {
        fr: "Z-Flix iOS a été pensé pour offrir une expérience fluide sans passer par l'App Store officiel, via les systèmes de signature Feather et AltStore. L'architecture sépare le moteur de résolution de sources vidéo du rendu graphique pour garantir du 60 FPS constant sur iPhone et iPad.",
        en: "Z-Flix iOS is designed for smooth non-App Store distribution via modern sideloaders like Feather and AltStore. The architecture decouples video source resolvers from the rendering layer to deliver consistent 60 FPS performance across iPhone and iPad devices."
      },
      tags: ["iOS", "Liquid Glass UI", "AltStore", "Feather", "Video Engine", "TypeScript"],
      metrics: { fr: "Z-Movies & Z-Animes", en: "Z-Movies & Z-Animes" },
      featured: true,
      status: "production",
      statusLabel: { fr: "Releases Officielles", en: "Official Releases" },
      githubUrl: "https://github.com/Apnkk/Z-Flix-iOS-Releases",
      liveUrl: "https://github.com/Apnkk/Z-Flix-iOS-Releases",
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      features: {
        fr: [
          "Interface Liquid Glass avec effets de transparence et micro-animations",
          "Compatibilité totale sideloading Feather, AltStore et Sideloadly",
          "Catalogue unifié Z-Movies & Z-Animes avec recherche instantanée",
          "Lecteur vidéo matériel avec accélération et reprise automatique"
        ],
        en: [
          "Liquid Glass interface with custom blur layers and micro-interactions",
          "Complete sideloading support for Feather, AltStore, and Sideloadly",
          "Unified Z-Movies & Z-Animes catalog with instant title search",
          "Hardware-accelerated video player with automatic playback resume"
        ]
      },
      architecture: {
        fr: "Structure orientée composants avec passerelle de parsing de sources vidéo, cache local des métadonnées et distribution par paquets IPA signés.",
        en: "Component-based architecture featuring isolated video resolver modules, local metadata caching, and signed IPA distribution pipeline."
      }
    },
    {
      id: "zflix-launcher",
      title: "Z-Flix Launcher & PC",
      category: "fullstack",
      categoryLabel: { fr: "Desktop & Outils", en: "Desktop & Tooling" },
      tagline: {
        fr: "Launcher desktop PC pour installer, lancer et mettre à jour l'écosystème Z-Flix.",
        en: "PC desktop launcher to install, launch, and automatically update the Z-Flix suite."
      },
      description: {
        fr: "Application de bureau permettant la gestion automatique des versions, le téléchargement des mises à jour et le lancement fluide des applications Movies & Animes sur PC.",
        en: "Desktop tool managing automated version checks, release downloads, and seamless execution of Movies & Animes on Windows."
      },
      longDescription: {
        fr: "Le launcher résout le problème de distribution des versions desktop. Il vérifie l'intégrité des fichiers au démarrage, interroge l'API GitHub pour récupérer les dernières builds et applique les patchs sans intervention de l'utilisateur.",
        en: "The launcher streamlines desktop distribution. It verifies local integrity on boot, queries GitHub release endpoints for latest builds, and applies patch updates automatically without manual user steps."
      },
      tags: ["Desktop App", "TypeScript", "Node.js", "GitHub Releases API", "Auto-Updater"],
      metrics: { fr: "PC Desktop Releases", en: "PC Desktop Releases" },
      featured: true,
      status: "production",
      statusLabel: { fr: "En production", en: "In Production" },
      githubUrl: "https://github.com/Apnkk/zflix-launcher",
      liveUrl: "https://github.com/Apnkk/zflix-launcher",
      gradient: "from-red-500/20 via-orange-500/10 to-transparent",
      features: {
        fr: [
          "Mise à jour en un clic avec vérification des checksums",
          "Lancement instantané de Z-Flix Animes et Z-Flix Movies",
          "Interface sobre, rapide et sans lourdeur",
          "Gestion des erreurs réseau avec reprise de téléchargement"
        ],
        en: [
          "One-click updates with checksum verification",
          "Instant launching for Z-Flix Animes and Z-Flix Movies",
          "Minimalist, lightweight, and responsive desktop UI",
          "Resilient download manager with connection resume"
        ]
      },
      architecture: {
        fr: "Architecture desktop légère en TypeScript, communication par processus isolés et interaction directe avec les flux de releases GitHub.",
        en: "Lightweight TypeScript desktop architecture, isolated worker processes, and direct integration with GitHub release streams."
      }
    },
    {
      id: "spoti-liquid-glass",
      title: "Spoti Liquid Glass",
      category: "tools",
      categoryLabel: { fr: "iOS Modding & UI", en: "iOS Modding & UI" },
      tagline: {
        fr: "Refonte de l'interface utilisateur pour l'application Spotify sur iOS avec Liquid Glass UI.",
        en: "Custom Liquid Glass user interface tweak for the Spotify iOS app, no jailbreak."
      },
      description: {
        fr: "Projet de personnalisation esthétique intégrant des composants dépolis modernes et des transitions fluides sur iOS sans nécessiter de jailbreak.",
        en: "UI enhancement project injecting modern frosted glass styling, custom playback docks, and responsive controls on non-jailbroken iOS devices."
      },
      longDescription: {
        fr: "Spoti Liquid Glass démontre la faisabilité d'injecter des modifications d'interface avancées dans des applications iOS existantes tout en conservant la compatibilité avec les sideloaders modernes (AltStore, Feather, TrollStore).",
        en: "Spoti Liquid Glass proves the feasibility of injecting high-end UI customizations into existing iOS app bundles while maintaining native stability and full sideloading support."
      },
      tags: ["iOS Tweaks", "Liquid Glass", "Objective-C / Swift", "UI Modding", "Sideloading"],
      metrics: { fr: "No Jailbreak Needed", en: "No Jailbreak Needed" },
      featured: true,
      status: "opensource",
      statusLabel: { fr: "Open Source", en: "Open Source" },
      githubUrl: "https://github.com/Apnkk/spoti.pw",
      liveUrl: "https://github.com/Apnkk/spoti.pw",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      features: {
        fr: [
          "Interface Liquid Glass sur le lecteur et les menus",
          "Fonctionnement sans jailbreak via injection de dylib propre",
          "Consommation batterie optimisée et fluidité 60 FPS",
          "Code source auditable et ouvert sur GitHub"
        ],
        en: [
          "Liquid Glass UI applied across player and navigation views",
          "Jailbreak-free operation via clean dylib injection",
          "Optimized battery consumption and constant 60 FPS rendering",
          "Open source and auditable on GitHub"
        ]
      },
      architecture: {
        fr: "Injection dynamique de vues et surcharge des styles système via dylib compilée pour architectures ARM64 iOS.",
        en: "Dynamic view injection and runtime styling hooks bundled inside an ARM64 compiled dylib for iOS."
      }
    },
    {
      id: "z-automation-core",
      title: "Z-Automation & Streaming Core",
      category: "ai",
      categoryLabel: { fr: "Backend & Reverse", en: "Backend & Reverse" },
      tagline: {
        fr: "Serveur d'agrégation de flux, scraping d'APIs et mise en cache haute vitesse.",
        en: "Stream aggregation gateway, reverse API scrapers, and high-speed caching."
      },
      description: {
        fr: "Backend d'automatisation capable de parser des dizaines de sources vidéo, contourner les protections d'accès et délivrer des flux propres en moins de 50ms.",
        en: "Automation backend parsing multiple video providers, bypassing challenge screens, and serving clean normalized streams under 50ms."
      },
      longDescription: {
        fr: "La colonne vertébrale technique de mes applications : reverse engineering des protocoles de diffusion, résolveurs de liens directs, gestion du rate-limiting et cache Redis distribué.",
        en: "The technical backbone behind my streaming apps: reverse-engineered video protocols, direct stream resolvers, rate-limiting avoidance, and distributed Redis caching."
      },
      tags: ["Node.js 22", "TypeScript", "Reverse Engineering", "FastAPI", "Redis", "Docker"],
      metrics: { fr: "< 50ms temps de réponse", en: "< 50ms response time" },
      featured: false,
      status: "production",
      statusLabel: { fr: "Backend Actif", en: "Active Backend" },
      githubUrl: "https://github.com/Apnkk",
      liveUrl: "https://github.com/Apnkk",
      gradient: "from-cyan-500/20 via-indigo-500/10 to-transparent",
      features: {
        fr: [
          "Résolution instantanée de flux vidéo multi-sources",
          "Contournement automatique des verrous de protection et bots",
          "Cache mémoire multi-niveaux avec Redis et Node 22",
          "Endpoints REST stricts et documentés"
        ],
        en: [
          "Instant resolution across multiple video source providers",
          "Automated challenge bypass and header forgery handling",
          "Multi-tier in-memory caching with Redis and Node 22",
          "Strict and documented REST API endpoints"
        ]
      },
      architecture: {
        fr: "Cluster Node 22 / FastAPI conteneurisé sous Docker avec proxy reverse Cloudflare et surveillance de santé en temps réel.",
        en: "Containerized Node 22 / FastAPI Docker cluster behind Cloudflare reverse proxies with live health monitoring."
      }
    }
  ],
  skills: [
    {
      id: "frontend",
      title: { fr: "Frontend & UI", en: "Frontend & UI" },
      icon: "Layout",
      skills: [
        { name: "React 19", level: 95, highlight: true, tag: "Expert" },
        { name: "TypeScript strict", level: 94, highlight: true, tag: "Expert" },
        { name: "Tailwind CSS v4", level: 95, highlight: true, tag: "Expert" },
        { name: "Next.js", level: 90, highlight: false },
        { name: "Framer Motion", level: 88, highlight: false },
        { name: "Zustand & TanStack Query", level: 90, highlight: false }
      ]
    },
    {
      id: "mobile-ios",
      title: { fr: "Mobile & iOS", en: "Mobile & iOS" },
      icon: "Smartphone",
      skills: [
        { name: "iOS Sideloading (Feather/AltStore)", level: 95, highlight: true, tag: "Expert" },
        { name: "React Native", level: 88, highlight: true },
        { name: "Liquid Glass Design", level: 92, highlight: true },
        { name: "IPA Packaging & Signing", level: 90, highlight: false },
        { name: "Dylib Injection & Tweaks", level: 85, highlight: false }
      ]
    },
    {
      id: "backend-systems",
      title: { fr: "Backend & Reverse", en: "Backend & Reverse" },
      icon: "Server",
      skills: [
        { name: "Node.js 22", level: 92, highlight: true, tag: "Expert" },
        { name: "API Reverse Engineering", level: 94, highlight: true, tag: "Expert" },
        { name: "FastAPI / Python", level: 86, highlight: false },
        { name: "WebSockets & Streaming", level: 88, highlight: true },
        { name: "Redis Caching", level: 88, highlight: false },
        { name: "PostgreSQL & Supabase", level: 88, highlight: false }
      ]
    },
    {
      id: "devops-infra",
      title: { fr: "DevOps & Déploiement", en: "DevOps & Cloud" },
      icon: "Cloud",
      skills: [
        { name: "Docker", level: 90, highlight: true },
        { name: "GitHub Actions & CI/CD", level: 88, highlight: false },
        { name: "Cloudflare & Proxies", level: 90, highlight: true },
        { name: "Linux & Bash", level: 86, highlight: false }
      ]
    }
  ],
  experiences: [
    {
      id: "exp-1",
      role: {
        fr: "Créateur & Développeur Lead",
        en: "Creator & Lead Developer"
      },
      company: "Écosystème Z-Flix (iOS & Desktop)",
      period: { fr: "2024 - Présent", en: "2024 - Present" },
      location: "France / Remote",
      description: {
        fr: "Conception, développement et maintenance de la suite Z-Flix : application iOS signée pour Feather/AltStore, application PC desktop et launcher de mise à jour automatique.",
        en: "Architected, built, and shipped the Z-Flix ecosystem: sideloaded iOS client for Feather/AltStore, desktop Windows client, and automated launcher."
      },
      achievements: {
        fr: [
          "Mise en place d'une interface Liquid Glass fluide et adaptée aux appareils mobiles",
          "Création d'un pipeline de mise à jour automatique via l'API GitHub Releases",
          "Reverse engineering de plusieurs résolveurs de streaming pour garantir la disponibilité des flux"
        ],
        en: [
          "Built smooth Liquid Glass UI tailored for mobile devices",
          "Created automated launcher updater querying GitHub Release APIs",
          "Reverse engineered multiple streaming resolvers for maximum uptime"
        ]
      },
      technologies: ["iOS", "TypeScript", "Node.js", "Liquid Glass", "Docker", "Reverse Engineering"],
      type: "work"
    },
    {
      id: "exp-2",
      role: {
        fr: "Développeur Full-Stack & Tooling",
        en: "Full-Stack & Tooling Developer"
      },
      company: "Projets Open Source & Outils Indépendants",
      period: { fr: "2023 - 2024", en: "2023 - 2024" },
      location: "France",
      description: {
        fr: "Création d'outils web, de bots d'automatisation, de tweaks iOS (Spoti Liquid Glass) et de micro-services backend orientés haute performance.",
        en: "Built web utilities, automation bots, custom iOS tweaks (Spoti Liquid Glass), and high-performance backend microservices."
      },
      achievements: {
        fr: [
          "Publication et maintenance de dépôts open source suivis par la communauté",
          "Conception d'APIs strictes avec temps de réponse sous les 50ms",
          "Développement d'outils d'automatisation et de contournement de protections"
        ],
        en: [
          "Published and maintained open source repositories used by active communities",
          "Designed strict API contracts with sub-50ms response times",
          "Engineered automation tooling and challenge bypass bots"
        ]
      },
      technologies: ["React 19", "Node.js", "TypeScript", "Python", "Redis", "Sideloading"],
      type: "work"
    }
  ],
  interests: {
    fr: [
      "Streaming audio & vidéo haute performance",
      "Reverse engineering et contournement d'APIs",
      "Liquid Glass UI & Design d'interaction soigné",
      "Écosystème iOS, sideloading et tweaks",
      "Automatisation de bout en bout et vitesse d'exécution"
    ],
    en: [
      "High-performance audio and video streaming",
      "Reverse engineering and API scraping",
      "Liquid Glass UI and tactile interaction design",
      "iOS ecosystem, sideloading, and custom tweaks",
      "End-to-end automation and rapid execution"
    ]
  }
};
