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
    email: "contact@shopcore.buzz",
    resumeUrl: "#contact"
  },
  stats: [
    {
      value: "10+",
      label: { fr: "Repositories publics & privés", en: "Public & Private Repos" },
      subtext: { fr: "Ecosystème Z-Flix, ShopCore & Outils", en: "Z-Flix, ShopCore & Tools" }
    },
    {
      value: "Web & PC",
      label: { fr: "Plateformes supportées", en: "Platforms Supported" },
      subtext: { fr: "Web, Windows & iOS", en: "Web, Windows & iOS" }
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
      id: "shopcore",
      title: "ShopCore",
      category: "fullstack",
      categoryLabel: { fr: "E-Commerce & Abonnements", en: "E-Commerce & SaaS" },
      tagline: {
        fr: "Plateforme e-commerce d'abonnements et comptes premium avec livraison automatisée.",
        en: "Premium accounts and subscription e-commerce platform with automated delivery."
      },
      description: {
        fr: "Plateforme e-commerce complète avec paiements Stripe & Crypto, livraison instantanée en quelques minutes, système de gestion des stocks et garantie 24h.",
        en: "Full-stack e-commerce marketplace featuring Stripe & Crypto checkout, instant automated fulfillment, inventory tracking, and 24h guarantee."
      },
      longDescription: {
        fr: "ShopCore est une plateforme de vente en ligne conçue pour la distribution automatisée d'abonnements numériques. Le système intègre un pipeline de paiement hybride (Stripe + Crypto), un provisionnement instantané et un espace client fluide développé sous Next.js moderne.",
        en: "ShopCore is an automated e-commerce web platform engineered for digital subscriptions. Features a hybrid payment engine (Stripe + Crypto gateways), real-time order fulfillment, and a high-performance Next.js storefront."
      },
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe API", "Crypto Payments", "E-Commerce"],
      image: "/projects/shopcore.png",
      metrics: { fr: "shopcore.buzz", en: "shopcore.buzz" },
      featured: true,
      status: "production",
      statusLabel: { fr: "En production", en: "Live Platform" },
      liveUrl: "https://shopcore.buzz",
      gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
      features: {
        fr: [
          "Paiement unique sécurisé Stripe et passerelle Crypto multi-devises",
          "Livraison instantanée automatisée des accès par email et webhook",
          "Interface responsive ultra-rapide sous Next.js et Tailwind CSS",
          "Gestion automatique des stocks et garantie 24h intégrée"
        ],
        en: [
          "Secure Stripe checkout and multi-currency Crypto gateway",
          "Automated instant fulfillment via email and webhooks",
          "Ultra-fast responsive UI built on Next.js and Tailwind CSS",
          "Automated inventory management with built-in 24h guarantee"
        ]
      },
      architecture: {
        fr: "Architecture Next.js App Router full-stack, intégration Stripe Checkout et webhooks pour la délivrance asynchrone des commandes.",
        en: "Full-stack Next.js App Router architecture, Stripe Checkout and resilient webhooks for asynchronous order processing."
      }
    },
    {
      id: "zflix-desktop",
      title: "Z-Flix Desktop",
      category: "fullstack",
      categoryLabel: { fr: "Streaming & Médias", en: "Streaming & Media" },
      tagline: {
        fr: "Application de streaming média avec hubs de contenus, lecteur vidéo et catalogue unifié.",
        en: "Media streaming application with studio hubs, high-performance video player, and unified catalog."
      },
      description: {
        fr: "Client streaming pour séries, films et animés avec intégration de hubs (Netflix, Disney+, HBO Max, Marvel, DC), lecteur HLS sans coupure et interface sombre cinématique.",
        en: "Streaming client for movies, series, and anime featuring studio hubs (Netflix, Disney+, HBO Max, Marvel, DC), seamless HLS player, and cinematic dark UI."
      },
      longDescription: {
        fr: "Z-Flix Desktop offre une expérience de streaming fluide sans publicité. L'application agrège et indexe les catalogues de plusieurs plateformes majeures, propose un sélecteur de sources vidéo résilient et un lecteur avec reprise de lecture automatique.",
        en: "Z-Flix Desktop delivers an ad-free streaming experience. Aggregates and indexes multi-platform catalogs, resilient stream resolvers, and hardware-accelerated playback with resume state."
      },
      tags: ["Desktop & Web", "React", "TypeScript", "Video Player", "HLS", "Cinematic UI"],
      image: "/projects/zflix-desktop.png",
      metrics: { fr: "Z-Movies & Z-Animes", en: "Z-Movies & Z-Animes" },
      featured: true,
      status: "production",
      statusLabel: { fr: "En production", en: "In Production" },
      githubUrl: "https://github.com/Apnkk/Z-FLIX-app",
      liveUrl: "https://github.com/Apnkk/Z-FLIX-app",
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      features: {
        fr: [
          "Hubs dédiés (Netflix, Disney+, HBO, Marvel, DC, Apple TV, Prime Video)",
          "Lecteur vidéo avec choix des pistes VF et VOSTFR",
          "Reprise de lecture automatique et gestion de liste personnelle",
          "Interface sombre cinématique ultra-fluide"
        ],
        en: [
          "Dedicated studio hubs (Netflix, Disney+, HBO, Marvel, DC, Apple TV, Prime Video)",
          "Video player supporting multiple audio and subtitle tracks",
          "Automatic playback resume and personal watchlist",
          "Ultra-smooth cinematic dark UI"
        ]
      },
      architecture: {
        fr: "Frontend réactif avec passerelle d'agrégation de flux vidéo HLS et distribution optimisée.",
        en: "Reactive frontend with HLS stream aggregation gateway and optimized playback pipeline."
      }
    },
    {
      id: "zflix-launcher",
      title: "Z-Launcher",
      category: "tools",
      categoryLabel: { fr: "Launcher Desktop", en: "Desktop Launcher" },
      tagline: {
        fr: "Launcher de bureau PC pour lancer, mettre à jour et gérer Z-Movies et Z-Animes.",
        en: "PC desktop launcher to launch, update, and manage Z-Movies and Z-Animes."
      },
      description: {
        fr: "Application de bureau Windows avec interface thématique nuit cyberpunk, bouton de lancement instantané, vérification d'intégrité et mises à jour automatiques.",
        en: "Windows desktop launcher with cyberpunk night aesthetic, instant launch button, integrity checks, and automatic release updates."
      },
      longDescription: {
        fr: "Z-Launcher est le point d'entrée pour l'écosystème de bureau Z-Flix. Il gère l'installation propre des composants, vérifie les versions disponibles et lance les applications en mode optimisé.",
        en: "Z-Launcher is the central gateway for the desktop Z-Flix suite. Handles component installation, checks remote release versions, and launches the software with hardware optimization."
      },
      tags: ["Windows", "TypeScript", "Desktop Tool", "Auto-Updater", "Cyberpunk UI"],
      image: "/projects/zlauncher.png",
      metrics: { fr: "PC Desktop Launcher", en: "PC Desktop Launcher" },
      featured: true,
      status: "production",
      statusLabel: { fr: "En production", en: "In Production" },
      githubUrl: "https://github.com/Apnkk/zflix-launcher",
      liveUrl: "https://github.com/Apnkk/zflix-launcher",
      gradient: "from-red-500/20 via-orange-500/10 to-transparent",
      features: {
        fr: [
          "Lancement instantané de Z-Movies et Z-Animes",
          "Vérification automatique des mises à jour au démarrage",
          "Interface sombre immersive avec visuels soignés",
          "Système de vérification des fichiers et désinstallation propre"
        ],
        en: [
          "Instant one-click launch for Z-Movies and Z-Animes",
          "Automatic update checks on startup",
          "Immersive dark aesthetic with high-end visuals",
          "File integrity verification and clean uninstaller"
        ]
      },
      architecture: {
        fr: "Client desktop Windows avec communication inter-processus et gestion des flux de releases.",
        en: "Windows desktop client with IPC bridges and remote release pipeline."
      }
    },
    {
      id: "zmusic",
      title: "Z-Music",
      category: "mobile",
      categoryLabel: { fr: "Audio & Streaming", en: "Audio & Streaming" },
      tagline: {
        fr: "Client de streaming musical sans limites avec lecteur dépoli et gestion des playlists.",
        en: "Limitless music streaming client with frosted audio dock and playlist management."
      },
      description: {
        fr: "Application de streaming musical inspirée de Spotify avec lecture audio en continu, gestion de playlists, titres likés, paroles synchronisées et dock de lecture flottant.",
        en: "Music streaming application featuring continuous playback, custom playlists, liked tracks, synced lyrics, and floating audio player dock."
      },
      longDescription: {
        fr: "Z-Music offre un univers musical sans limites : recherche instantanée d'artistes et de morceaux, lecture haute fidélité, affichage des paroles, gestion de bibliothèque personnelle et lecteur audio avec barre de progression interactive.",
        en: "Z-Music delivers limitless music streaming: instant artist and track search, high-fidelity playback, lyrics display, library management, and an interactive playback dock."
      },
      tags: ["Desktop & Web", "Audio Engine", "TypeScript", "Playlists", "Lyrics", "Modern UI"],
      image: "/projects/zmusic.png",
      metrics: { fr: "Stream Audio", en: "Audio Streaming" },
      featured: true,
      status: "production",
      statusLabel: { fr: "En production", en: "In Production" },
      githubUrl: "https://github.com/Apnkk",
      liveUrl: "https://github.com/Apnkk",
      gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
      features: {
        fr: [
          "Recherche rapide de morceaux, albums et artistes",
          "Gestion de playlists personnalisées et favoris",
          "Lecteur audio flottant avec contrôles complets et volume",
          "Paroles synchronisées et suggestions d'albums iconiques"
        ],
        en: [
          "Rapid search across tracks, albums, and artists",
          "Personalized playlist and favorites management",
          "Floating audio player dock with full playback controls and volume",
          "Synchronized lyrics and iconic album recommendations"
        ]
      },
      architecture: {
        fr: "Moteur audio Web Audio / HTML5 avec mise en mémoire tampon dynamique et interface réactive.",
        en: "Web Audio / HTML5 audio engine with dynamic stream buffering and responsive UI."
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
      image: "/projects/spoti-now-playing.webp",
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
