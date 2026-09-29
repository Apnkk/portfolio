import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  Code2, 
  Smartphone, 
  Server, 
  Cloud,
  Cpu,
  Zap,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { BorderBeam } from './motion/BorderBeam';

export const StackSection = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('frontend');
  const shouldReduceMotion = useReducedMotion();

  const categories = [
    {
      id: 'frontend',
      label: 'Frontend & UI',
      icon: Code2,
      headline: {
        fr: 'Interfaces fluides 120 FPS, React 19 & typage strict',
        en: '120 FPS Interfaces, React 19 & Strict Types',
      },
      description: {
        fr: 'Architecture de composants isolés, fluidité WAAPI matérielle, accessibilité native WCAG 2.2 AA et zéro re-render inutile.',
        en: 'Isolated component architecture, hardware WAAPI fluidity, native WCAG 2.2 AA accessibility, and zero redundant re-renders.',
      },
      stats: { label: language === 'fr' ? 'Standard UI' : 'UI Standard', value: 'React 19 + Tailwind v4' },
      skills: [
        { name: 'React 19 & Server Actions', level: 'Expert', hot: true },
        { name: 'TypeScript strict (zero any)', level: 'Expert', hot: true },
        { name: 'Tailwind CSS v4 & @theme', level: 'Expert', hot: true },
        { name: 'Next.js App Router', level: 'Avancé' },
        { name: 'Motion / Framer Motion', level: 'Avancé' },
        { name: 'TanStack Query & Zustand', level: 'Avancé' },
        { name: 'Web Audio API (Synth & Analyser)', level: 'Spécialiste', hot: true },
        { name: 'Container Queries & Subgrid', level: 'Avancé' },
      ],
    },
    {
      id: 'mobile-ios',
      label: 'Mobile iOS & Modding',
      icon: Smartphone,
      headline: {
        fr: 'Écosystème iOS, Sideloading & Liquid Glass UI',
        en: 'iOS Ecosystem, Sideloading & Liquid Glass UI',
      },
      description: {
        fr: 'Développement de tweaks natifs sans jailbreak pour iPhone, packaging IPA et signature pour AltStore/Feather.',
        en: 'Native tweak development without jailbreak for iPhone, IPA packaging, and signing for AltStore/Feather.',
      },
      stats: { label: language === 'fr' ? 'Architecture' : 'Target Architecture', value: 'ARM64 Native' },
      skills: [
        { name: 'iOS Sideloading (Feather / AltStore)', level: 'Expert', hot: true },
        { name: 'Dylib Injection & Runtime Hooks', level: 'Expert', hot: true },
        { name: 'Liquid Glass Design (Frosted iOS UI)', level: 'Expert', hot: true },
        { name: 'Swift & Objective-C runtime', level: 'Avancé' },
        { name: 'IPA Packaging & Certificate Signing', level: 'Avancé' },
        { name: 'React Native & Mobile tooling', level: 'Avancé' },
      ],
    },
    {
      id: 'backend-systems',
      label: 'Backend & Reverse APIs',
      icon: Server,
      headline: {
        fr: 'Rétro-ingénierie d’APIs privées, WebSockets & Streaming',
        en: 'Private API Reverse Engineering & Streaming',
      },
      description: {
        fr: 'Rétro-ingénierie d’APIs tierces, protocoles de contournement résilients, WebSockets temps réel et latence < 50ms.',
        en: 'Reverse-engineering third-party APIs, resilient fallback protocols, realtime WebSockets, and sub-50ms latency.',
      },
      stats: { label: language === 'fr' ? 'Objectif Latence' : 'Latency Target', value: '< 50ms' },
      skills: [
        { name: 'Node.js 22 & NestJS / Express', level: 'Expert', hot: true },
        { name: 'API Reverse Engineering & Scraping', level: 'Expert', hot: true },
        { name: 'WebSockets & SSE Streaming', level: 'Expert', hot: true },
        { name: 'FastAPI & Python micro-services', level: 'Avancé' },
        { name: 'Redis distributed caching', level: 'Avancé' },
        { name: 'PostgreSQL, Supabase & Drizzle ORM', level: 'Avancé' },
      ],
    },
    {
      id: 'devops-infra',
      label: 'DevOps & Cloud',
      icon: Cloud,
      headline: {
        fr: 'Conteneurisation Docker, Edge CDN & Automatisation',
        en: 'Docker Containers, Edge CDN & Automation',
      },
      description: {
        fr: 'Conteneurs Docker multi-stages légers, distribution Edge Cloudflare et intégration continue GitHub Actions.',
        en: 'Lightweight multi-stage Docker containers, global Cloudflare Edge distribution, and automated GitHub Actions CI/CD.',
      },
      stats: { label: language === 'fr' ? 'Déploiement' : 'Deployment', value: '100% Automatisé' },
      skills: [
        { name: 'Docker & Multi-stage builds', level: 'Expert', hot: true },
        { name: 'Cloudflare Workers & Edge Proxies', level: 'Avancé', hot: true },
        { name: 'GitHub Actions CI/CD Pipelines', level: 'Avancé' },
        { name: 'Linux VPS & Nginx Reverse Proxy', level: 'Avancé' },
        { name: 'Security Hardening & Tokens', level: 'Avancé' },
      ],
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section
      id="stack"
      className="scroll-mt-24 sm:scroll-mt-28 py-24 sm:py-32 px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto text-left relative"
      aria-labelledby="stack-heading"
    >
      {/* Section Head */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            {language === 'fr' ? 'ARSENAL TECHNIQUE' : 'ENGINEERING ARSENAL'}
          </p>
        </div>
        <h2
          id="stack-heading"
          className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
        >
          {language === 'fr' ? (
            <>
              Stack moderne <span className="text-[#ff1e38]">&amp;</span> expertise éprouvée
            </>
          ) : (
            <>
              Modern stack <span className="text-[#ff1e38]">&amp;</span> production expertise
            </>
          )}
        </h2>
        <p className="text-[#a1a1aa] text-sm sm:text-base mt-3 max-w-xl font-normal leading-relaxed">
          {language === 'fr'
            ? 'Des technologies sélectionnées pour leur rapidité, leur résilience et leur ergonomie développeur.'
            : 'Technologies hand-picked for velocity, resilience, and developer ergonomics.'}
        </p>
      </div>

      {/* Main Interactive Stack Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-[#09090b] border border-white/[0.08] p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        <BorderBeam duration={14} borderWidth={1.5} colorFrom="#ff1e38" colorTo="rgba(255, 30, 56, 0.2)" />

        {/* Category Selector Tabs */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 pb-6 border-b border-white/[0.08] w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer select-none ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#71717a] hover:text-[#d4d4d8] hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-stack-tab-indicator"
                    className="absolute inset-0 rounded-2xl bg-white/[0.1] border border-white/[0.14] shadow-sm"
                    transition={{
                      type: 'spring',
                      visualDuration: shouldReduceMotion ? 0.01 : 0.28,
                      bounce: 0.15,
                    }}
                  />
                )}
                <Icon className={`relative z-10 w-4 h-4 transition-colors ${isActive ? 'text-[#ff1e38]' : ''}`} />
                <span className="relative z-10">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Category Details View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 pt-8"
          >
            {/* Domain Headline & Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-4xl mb-8">
              <div>
                <h3 className="font-display font-semibold text-xl sm:text-2xl text-white tracking-tight">
                  {currentCategory.headline[language]}
                </h3>
                <p className="text-[#a1a1aa] text-xs sm:text-sm mt-2 font-normal leading-relaxed max-w-2xl">
                  {currentCategory.description[language]}
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/[0.08] shrink-0 font-mono text-xs">
                <span className="text-[#71717a] block text-[0.62rem] uppercase">{currentCategory.stats.label}</span>
                <span className="text-white font-semibold">{currentCategory.stats.value}</span>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {currentCategory.skills.map((skill, sIdx) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : sIdx * 0.03 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.06] hover:border-[#ff1e38]/30 hover:bg-white/[0.03] transition-all flex flex-col justify-between group cursor-default shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
                    {skill.hot && (
                      <span className="px-1.5 py-0.5 rounded bg-[#ff1e38]/10 text-[#ff1e38] font-mono text-[0.6rem] font-bold">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-mono text-xs sm:text-sm text-white font-medium group-hover:text-[#ff1e38] transition-colors">
                      {skill.name}
                    </p>
                    <p className="font-mono text-[0.65rem] text-[#71717a] mt-1">
                      {skill.level}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Engineering Principles Strip */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 mt-10 border-t border-white/[0.08]">
          {[
            {
              icon: ShieldCheck,
              title: 'TypeScript Strict',
              desc: language === 'fr' ? 'Zéro "any", contrats d’APIs typés de bout en bout' : 'Zero "any", end-to-end typed API contracts',
            },
            {
              icon: Zap,
              title: '< 50ms Latency',
              desc: language === 'fr' ? 'Streaming vidéo HLS, caching Redis & WebSockets' : 'HLS streaming, Redis caching & WebSockets',
            },
            {
              icon: Sparkles,
              title: '120 FPS Fluidity',
              desc: language === 'fr' ? 'Moteur WAAPI matériel, physique de ressorts naturelle' : 'Hardware WAAPI engine, natural spring physics',
            },
            {
              icon: Cpu,
              title: 'No Jailbreak Needed',
              desc: language === 'fr' ? 'Tweaks iOS injectés proprement via dylibs ARM64' : 'Clean ARM64 dylib injection for iOS sideloading',
            },
          ].map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]">
                <div className="p-2 rounded-lg bg-white/[0.05] text-[#ff1e38] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-semibold text-white">
                    {principle.title}
                  </h4>
                  <p className="font-sans text-xs text-[#a1a1aa] mt-0.5 leading-snug">
                    {principle.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
