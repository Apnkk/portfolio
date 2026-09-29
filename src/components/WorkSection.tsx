import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';
import { ProjectModal } from './ProjectModal';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../types';

export const WorkSection = () => {
  const { language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectsData = [
    {
      id: 'z-flix',
      num: '01',
      title: 'Z-Flix Desktop',
      badge: 'STREAMING DESKTOP V2 — PRODUCTION',
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&q=80',
      gradient: 'radial-gradient(ellipse 80% 90% at 75% 15%, rgba(242,163,60,0.22), transparent 60%), linear-gradient(140deg, #1a1409, #0c0a07 70%)',
      desc: {
        fr: "Plateforme de streaming vidéo pour desktop (macOS & Windows), made in France et 100% autonome. Moteur de lecture vidéo customisé avec support HLS multi-qualités, synchronisation en temps réel de watch-parties, et scraping automatisé de catalogues haute définition.",
        en: "Autonomous cross-platform desktop streaming application (macOS & Windows). Custom video engine with multi-bitrate HLS streams, real-time watch-party synchronization via WebSockets, and automated metadata scraping.",
      },
      tags: ['REACT 19', 'TAURI / RUST', 'TYPESCRIPT', 'HLS STREAMING', 'TAILWIND 4', 'NODE 22', 'FFMPEG'],
      meta: {
        fr: 'RÔLE — DESIGN, FRONT, BACK, INFRA · CANAL OFFICIEL — T.ME/ZFLIX_APP',
        en: 'ROLE — DESIGN, FRONT, BACK, REVERSE INFRA · OFFICIAL — T.ME/ZFLIX_APP',
      },
    },
    {
      id: 'shopcore',
      num: '02',
      title: 'ShopCore',
      badge: 'SAAS E-COMMERCE & AUTOMATION',
      image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200&q=80',
      gradient: 'radial-gradient(ellipse 80% 90% at 25% 85%, rgba(255,61,46,0.2), transparent 60%), linear-gradient(220deg, #190d0a, #0c0807 70%)',
      desc: {
        fr: "Plateforme e-commerce automatisée de distribution numérique. Intégration de paiements sécurisés Stripe, génération instantanée de clés de licence chiffrées, système anti-fraude, webhooks et portail client temps réel.",
        en: "Automated digital distribution and e-commerce SaaS. Instant delivery of encrypted license keys, Stripe webhooks integration, anti-fraud telemetry, and real-time customer dashboard.",
      },
      tags: ['REACT 19', 'TYPESCRIPT', 'STRIPE', 'DRIZZLE ORM', 'MYSQL', 'REDIS', 'WEBHOOKS'],
      meta: {
        fr: 'RÔLE — ARCHITECTURE SYSTÈME, FRONT & PAIEMENTS · LIVE — SHOPCORE.BUZZ',
        en: 'ROLE — SYSTEM ARCHITECTURE, FRONT & BILLING · LIVE — SHOPCORE.BUZZ',
      },
    },
    {
      id: 'spoti-liquid',
      num: '03',
      title: 'Spoti Liquid Glass',
      badge: 'IOS TWEAK & NATIVE MODDING',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
      gradient: 'radial-gradient(ellipse 80% 90% at 70% 80%, rgba(61,214,140,0.18), transparent 60%), linear-gradient(160deg, #0a1410, #070c0a 70%)',
      desc: {
        fr: "Tweak iOS natif développé en Objective-C et Swift. Injection dynamique de flous d’arrière-plan Liquid Glass en temps réel dans l'interface de lecture, sans dégradation de batterie et à 120 FPS constants via CoreAnimation.",
        en: "Native iOS tweak engineered in Objective-C and Swift. Dynamic injection of real-time Liquid Glass backdrop blurs in the player view, preserving battery health at a steady 120 FPS.",
      },
      tags: ['SWIFT', 'OBJECTIVE-C', 'THEOS / CYDIA', 'COREANIMATION', 'IOS 16-18', 'JAILBREAK / TROLLSTORE'],
      meta: {
        fr: 'RÔLE — REVERSE ENGINEERING, TWEAK DEV · REPO — GITHUB.COM/APNKK',
        en: 'ROLE — REVERSE ENGINEERING, TWEAK DEV · REPO — GITHUB.COM/APNKK',
      },
    },
    {
      id: 'z-launcher',
      num: '04',
      title: 'Z-Launcher',
      badge: 'CROSS-PLATFORM DESKTOP LAUNCHER',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80',
      gradient: 'radial-gradient(ellipse 80% 90% at 40% 20%, rgba(242,163,60,0.15), transparent 60%), linear-gradient(130deg, #14120c, #0a0908 70%)',
      desc: {
        fr: "Launcher desktop moderne pour jeux et modpacks. Téléchargements concurrents ultra-rapides, vérification d'intégrité de fichiers par hash SHA-256, injection de mods et profils utilisateurs isolés.",
        en: "Modern desktop game launcher and modpack manager. Concurrent high-throughput file streaming, SHA-256 integrity verification, mod injection, and isolated user configurations.",
      },
      tags: ['TAURI', 'RUST', 'REACT 19', 'TYPESCRIPT', 'LOCAL PROCESS IPC', 'TAILWIND 4'],
      meta: {
        fr: 'RÔLE — CONCEPTION, RUNTIME RUST & UI · STATUS — PRODUCTION',
        en: 'ROLE — CONCEPTION, RUST RUNTIME & UI · STATUS — PRODUCTION',
      },
    },
  ];

  const handleOpenProject = (projectId: string) => {
    const found = portfolioData.projects.find((p: Project) => p.id === projectId);
    if (found) setSelectedProject(found);
  };

  return (
    <section
      id="work"
      className="relative z-10 pt-[clamp(60px,9vh,110px)] pb-16 px-[var(--pad)] bg-[var(--bg)]"
      aria-label="Projets"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-[clamp(32px,5vh,64px)]">
          <div className="font-mono text-[0.72rem] tracking-widest text-[var(--amber)] uppercase mb-3">
            01 / PROJETS
          </div>
          <h2 className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-tight text-[var(--cream)]">
            Projets, passés <em className="text-[var(--amber)] not-italic">&amp;</em> présents
          </h2>
          <p className="text-[var(--cream-dim)] text-[0.95rem] max-w-xl mt-3 leading-relaxed">
            {language === 'fr'
              ? 'Des produits en ligne aux projets archivés — pensés, codés et déployés de A à Z.'
              : 'From shipped production apps to archived experiments — conceived, coded, and deployed end-to-end.'}
          </p>
        </div>

        {/* Project Rows */}
        <div className="flex flex-col border-b border-[var(--line)]">
          {projectsData.map((project) => (
            <div
              key={project.id}
              className="work__row group py-[clamp(26px,4vh,44px)] border-t border-[var(--line)] cursor-pointer"
              onClick={() => handleOpenProject(project.id)}
            >
              {/* Row Header: Number, Title, Arrow */}
              <div className="flex items-baseline gap-[clamp(14px,3vw,30px)] w-full mb-[clamp(18px,3vh,30px)]">
                <span className="font-mono text-base text-[var(--muted)] shrink-0">
                  {project.num}
                </span>

                <h3 className="font-display font-semibold text-[clamp(2.2rem,6.5vw,5.5rem)] leading-none tracking-[-0.025em] text-[var(--cream)] group-hover:text-[var(--amber)] group-hover:translate-x-3 transition-all duration-300">
                  {project.title}
                </h3>

                <span className="ml-auto text-[clamp(1.4rem,2.8vw,2.4rem)] text-[var(--muted)] group-hover:text-[var(--amber)] group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-all duration-300">
                  ↗
                </span>
              </div>

              {/* Row Body: 5fr / 7fr Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(20px,4vw,56px)] items-start">
                {/* Left: Device/Mockup Visual Container (5 cols) */}
                <div className="lg:col-span-5 rounded-[14px] overflow-hidden border border-[var(--line)] relative group-hover:border-[var(--line-strong)] transition-colors">
                  <div
                    className="relative aspect-[16/10] overflow-hidden flex items-center justify-center p-3"
                    style={{ background: project.gradient }}
                  >
                    {/* Badge top tag */}
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/80 border border-white/10 font-mono text-[0.62rem] text-[var(--cream)] uppercase tracking-wider backdrop-blur-md">
                      {project.badge}
                    </div>

                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  </div>
                </div>

                {/* Right: Technical Info, Description & Pills (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between h-full pt-1">
                  <div>
                    <p className="text-[var(--cream-dim)] text-[0.95rem] leading-relaxed mb-5">
                      {project.desc[language]}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[0.68rem] font-mono tracking-wider text-[var(--cream-dim)] uppercase group-hover:border-[var(--amber)]/30 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-4 border-t border-[var(--line)] font-mono text-[0.68rem] tracking-wider text-[var(--muted)] uppercase">
                    {project.meta[language]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};
