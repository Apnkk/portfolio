import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  Code2, 
  Smartphone, 
  Server, 
  Cloud, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Check 
} from 'lucide-react';

export const StackSection = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('frontend');

  const categories = [
    {
      id: 'frontend',
      label: 'Frontend',
      icon: Code2,
      headline: {
        fr: 'Interfaces modernes, React 19 & typage strict',
        en: 'Modern Interfaces, React 19 & Strict Types',
      },
      description: {
        fr: 'Architecture de composants isolés, fluidité 120 FPS, accessibilité native et découpage optimal du rendu.',
        en: 'Isolated component architecture, 120 FPS motion, native accessibility, and zero redundant re-renders.',
      },
      skills: [
        'React 19 & Server Actions',
        'TypeScript strict (zero any)',
        'Next.js (App Router)',
        'Tailwind CSS v4 & CSS Modern',
        'TanStack Query & Zustand',
        'Framer Motion & Web Audio API',
      ],
    },
    {
      id: 'mobile-ios',
      label: 'Mobile iOS',
      icon: Smartphone,
      headline: {
        fr: 'Écosystème iOS, Sideloading & Modding UI',
        en: 'iOS Ecosystem, Sideloading & UI Modding',
      },
      description: {
        fr: 'Développement et injection de tweaks natifs sans jailbreak pour iPhone, packaging IPA et signature pour AltStore/Feather.',
        en: 'Native tweak development and injection without jailbreak, IPA packaging, and signing for AltStore/Feather.',
      },
      skills: [
        'iOS Sideloading (Feather / AltStore)',
        'Dylib Injection & Runtime Hooks',
        'Swift & Objective-C tweaks',
        'React Native cross-platform',
        'Liquid Glass UI design',
        'IPA Packaging & Certificate Signing',
      ],
    },
    {
      id: 'backend-systems',
      label: language === 'fr' ? 'Backend & Reverse' : 'Backend & Reverse',
      icon: Server,
      headline: {
        fr: 'APIs privées, Reverse Engineering & Streaming',
        en: 'Private APIs, Reverse Engineering & Streaming',
      },
      description: {
        fr: 'Rétro-ingénierie d’APIs tierces, protocoles de contournement résilients, WebSockets temps réel et latence < 50ms.',
        en: 'Reverse-engineering third-party APIs, resilient fallback protocols, realtime WebSockets, and sub-50ms latency.',
      },
      skills: [
        'Node.js 22 & NestJS / Express',
        'API Reverse Engineering & Scraping',
        'FastAPI & Python micro-services',
        'WebSockets & SSE Streaming',
        'Redis distributed caching',
        'PostgreSQL, Supabase & Drizzle',
      ],
    },
    {
      id: 'devops-infra',
      label: 'DevOps & Cloud',
      icon: Cloud,
      headline: {
        fr: 'Conteneurisation, Edge CDN & Automatisation',
        en: 'Containerization, Edge CDN & Automation',
      },
      description: {
        fr: 'Conteneurs Docker légers, distribution mondiale Cloudflare et intégration continue GitHub Actions.',
        en: 'Lightweight Docker containers, global Cloudflare edge caching, and automated GitHub Actions pipelines.',
      },
      skills: [
        'Docker & Multi-stage builds',
        'Cloudflare Workers & Edge DNS',
        'GitHub Actions CI/CD',
        'Linux VPS & Nginx reverse proxy',
        'Security hardening & Environment isolation',
        'Automated release dispatching',
      ],
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section
      id="stack"
      className="py-24 sm:py-32 px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto text-left relative"
      aria-labelledby="stack-heading"
    >
      {/* Section Head */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            02 / STACK &amp; SYSTÈMES
          </p>
        </div>
        <h2
          id="stack-heading"
          className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
        >
          {language === 'fr' ? (
            <>
              Architecture technique <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> boîte à outils
            </>
          ) : (
            <>
              Technical architecture <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> core stack
            </>
          )}
        </h2>
        <p className="text-[#a1a1aa] text-base mt-3 max-w-xl font-normal leading-relaxed">
          {language === 'fr'
            ? 'Une sélection réfléchie de technologies éprouvées en production pour bâtir des logiciels rapides, robustes et maintenables.'
            : 'A deliberate selection of production-tested tools to build fast, resilient, and maintainable software.'}
        </p>
      </div>

      {/* Main Interactive Stack Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl bg-[#09090b] border border-white/[0.08] p-6 sm:p-8 lg:p-10 mb-10 shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
      >
        {/* Category Selector Tabs - Centered */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pb-6 border-b border-white/[0.08] w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-stack-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-white/[0.1] border border-white/[0.14] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <Icon className={`relative z-10 w-3.5 h-3.5 ${isActive ? 'text-[#ff1e38]' : ''}`} />
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Details View */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="pt-8"
        >
          <div className="max-w-2xl mb-8">
            <h3 className="font-display font-semibold text-2xl sm:text-3xl text-white tracking-tight mb-2">
              {currentCategory.headline[language]}
            </h3>
            <p className="text-[#a1a1aa] text-sm sm:text-base leading-relaxed">
              {currentCategory.description[language]}
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentCategory.skills.map((skill, sIdx) => (
              <motion.div
                key={sIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: sIdx * 0.03 }}
                whileHover={{ scale: 1.01, borderColor: 'rgba(255, 30, 56, 0.3)' }}
                className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] transition-colors flex items-center gap-3 cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shrink-0" />
                <span className="font-mono text-xs sm:text-sm text-[#d4d4d8] truncate">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Engineering Principles Bento (3 Pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: language === 'fr' ? 'Typage strict & Intégrité' : 'Strict Types & Integrity',
            desc:
              language === 'fr'
                ? 'TypeScript configuré en mode strict, validation runtime des schémas (Zod) et zéro type any toléré en production.'
                : 'Strict TypeScript compiler settings, unified runtime schema validation (Zod), and zero any types tolerated.',
          },
          {
            icon: Zap,
            title: language === 'fr' ? 'Latence basse (<50ms)' : 'Sub-50ms Latency',
            desc:
              language === 'fr'
                ? 'Stratégies de cache Redis multi-niveaux, edge CDN distribué et découpage minutieux des flux pour des réponses instantanées.'
                : 'Multi-layer Redis caching strategies, distributed edge CDN, and streaming responses engineered for speed.',
          },
          {
            icon: Cpu,
            title: language === 'fr' ? 'Reverse & Résilience' : 'Resilient Engineering',
            desc:
              language === 'fr'
                ? 'Compréhension intime des protocoles réseau, gestion élégante des interruptions et maintien continu de la disponibilité.'
                : 'Deep inspection of network protocols, graceful degradation, and continuous stream availability under heavy loads.',
          },
        ].map((pillar, pIdx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pIdx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: pIdx * 0.1 }}
              className="p-6 rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#ff1e38] mb-4">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-display font-semibold text-lg text-white mb-2">
                  {pillar.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[0.66rem] text-[#71717a]">
                <span>STANDARDS DE QUALITÉ</span>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
