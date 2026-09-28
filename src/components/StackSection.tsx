import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  Code2, 
  Smartphone, 
  Server, 
  Cloud 
} from 'lucide-react';
import { BorderBeam } from './motion/BorderBeam';

export const StackSection = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('frontend');
  const shouldReduceMotion = useReducedMotion();

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
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            {language === 'fr' ? 'STACK TECHNIQUE' : 'CORE STACK'}
          </p>
        </div>
        <h2
          id="stack-heading"
          className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
        >
          {language === 'fr' ? (
            <>
              Architecture technique <span className="text-[#ff1e38]">&amp;</span> outils
            </>
          ) : (
            <>
              Technical architecture <span className="text-[#ff1e38]">&amp;</span> tools
            </>
          )}
        </h2>
        <p className="text-[#a1a1aa] text-sm mt-3 max-w-lg font-normal leading-relaxed">
          {language === 'fr'
            ? 'Technologies et architectures éprouvées en production.'
            : 'Production-tested stack and resilient architecture.'}
        </p>
      </div>

      {/* Main Interactive Stack Matrix with BorderBeam */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-2xl bg-[#09090b] border border-white/[0.08] p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
      >
        <BorderBeam duration={14} borderWidth={1.5} colorFrom="#ff1e38" colorTo="rgba(255, 30, 56, 0.2)" />

        {/* Category Selector Tabs - Centered with Shared Element layoutId */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 pb-6 border-b border-white/[0.08] w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-stack-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-white/[0.1] border border-white/[0.14] shadow-[0_0_15px_rgba(255,255,255,0.06)]"
                    transition={{
                      type: 'spring',
                      visualDuration: shouldReduceMotion ? 0.01 : 0.28,
                      bounce: 0.15,
                    }}
                  />
                )}
                <Icon className={`relative z-10 w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#ff1e38]' : ''}`} />
                <span className="relative z-10">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Category Details View with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 pt-8"
          >
            <div className="max-w-2xl mb-6">
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-white tracking-tight">
                {currentCategory.headline[language]}
              </h3>
              <p className="text-[#a1a1aa] text-xs sm:text-sm mt-2 font-normal leading-relaxed">
                {currentCategory.description[language]}
              </p>
            </div>

            {/* Skills Grid with orchestrated stagger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentCategory.skills.map((skill, sIdx) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    visualDuration: 0.3,
                    bounce: 0.12,
                    delay: shouldReduceMotion ? 0 : sIdx * 0.035,
                  }}
                  whileHover={{ scale: 1.025, y: -2, borderColor: 'rgba(255, 30, 56, 0.4)' }}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] hover:bg-white/[0.03] transition-colors flex items-center gap-3 cursor-default shadow-sm group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38] shrink-0 group-hover:scale-125 transition-transform" />
                  <span className="font-mono text-xs sm:text-sm text-[#d4d4d8] group-hover:text-white transition-colors truncate">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
