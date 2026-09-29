import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Lightbulb, Rocket, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { TiltCard } from './motion/TiltCard';

export const MethodSection = () => {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  const steps = [
    {
      num: '01',
      icon: Lightbulb,
      name: language === 'fr' ? 'Intuition & Ciblage' : 'Concept & Target',
      desc: language === 'fr' ? 'Identifier un besoin quotidien réel sans sur-ingénierie.' : 'Pinpoint a genuine everyday need without over-engineering.',
      detail: language === 'fr' ? 'Recherche utilisateurs & benchmark technique.' : 'User insight & technical benchmark.',
    },
    {
      num: '02',
      icon: Rocket,
      name: language === 'fr' ? 'Prototype Express' : 'Fast Prototype',
      desc: language === 'fr' ? "Sortir rapidement une version fonctionnelle entre les mains." : 'Ship a working build quickly into hands to test feel.',
      detail: language === 'fr' ? 'Validation UX, flux réels & ergonomie.' : 'UX validation, real streams & ergonomics.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      name: language === 'fr' ? 'Architecture Stricte' : 'Strict Architecture',
      desc: language === 'fr' ? 'Consolider : TypeScript strict, gestion des erreurs et modularité.' : 'Harden: strict TypeScript, resilient fallback & modularity.',
      detail: language === 'fr' ? 'Zéro "any", latence < 50ms, sécurité.' : 'Zero "any", sub-50ms latency, security.',
    },
    {
      num: '04',
      icon: Sparkles,
      name: language === 'fr' ? 'Finition & Micro-détails' : 'Polish & Micro-UI',
      desc: language === 'fr' ? 'Fluidité 120 FPS, physique de ressorts, son et accessibilité.' : '120 FPS motion, spring physics, sound & accessibility.',
      detail: language === 'fr' ? 'Respect WCAG 2.2 AA & retours haptiques.' : 'WCAG 2.2 AA compliant & haptic feedback.',
    },
    {
      num: '05',
      icon: Send,
      name: language === 'fr' ? 'Livraison & Production' : 'Deploy & Ship',
      desc: language === 'fr' ? 'Conteneurs Docker, Edge CDN Cloudflare et monitoring live.' : 'Docker containers, Cloudflare Edge CDN & live observability.',
      detail: language === 'fr' ? 'CI/CD automatisée & releases GitHub.' : 'Automated CI/CD & GitHub releases.',
    },
  ];

  return (
    <section
      id="method"
      className="scroll-mt-24 sm:scroll-mt-28 py-24 sm:py-32 px-5 sm:px-10 lg:px-16 bg-black border-y border-white/[0.08] text-left relative overflow-hidden"
      aria-labelledby="method-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Head */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
            <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
              {language === 'fr' ? 'MÉTHODOLOGIE D’INGÉNIERIE' : 'ENGINEERING PROCESS'}
            </p>
          </div>
          <h2
            id="method-title"
            className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
          >
            {language === 'fr' ? (
              <>
                De l’intuition <span className="text-[#ff1e38]">au</span> logiciel éprouvé
              </>
            ) : (
              <>
                From spark <span className="text-[#ff1e38]">to</span> production software
              </>
            )}
          </h2>
          <p className="text-[#a1a1aa] text-sm sm:text-base mt-3 max-w-xl font-normal leading-relaxed">
            {language === 'fr'
              ? 'Un cycle pragmatique et direct pour transformer un problème complexe en produit simple, rapide et élégant.'
              : 'A pragmatic loop designed to turn complex challenges into simple, rapid, and refined production software.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connecting Flow Pulse */}
          {!shouldReduceMotion && (
            <div
              className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none overflow-hidden"
              aria-hidden="true"
            >
              <motion.div
                animate={{ x: ['-100%', '800%'] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="w-32 h-full bg-gradient-to-r from-transparent via-[#ff1e38] to-transparent shadow-[0_0_10px_#ff1e38]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    type: 'spring',
                    visualDuration: 0.4,
                    bounce: 0.12,
                    delay: shouldReduceMotion ? 0 : idx * 0.08,
                  }}
                >
                  <TiltCard
                    scale={1.02}
                    spotlightColor="rgba(255, 30, 56, 0.14)"
                    className="p-6 rounded-3xl bg-[#09090b] border border-white/[0.08] hover:border-[#ff1e38]/40 transition-colors flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.6)] h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono font-bold text-xs text-[#ff1e38] group-hover:drop-shadow-[0_0_8px_rgba(255,30,56,0.6)] transition-all">
                          {step.num}
                        </span>
                        <div className="p-2 rounded-xl bg-white/[0.04] text-[#71717a] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="font-display font-semibold text-lg text-white mb-2 tracking-tight group-hover:text-[#ff1e38] transition-colors">
                        {step.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed mb-4">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] font-mono text-[0.65rem] text-[#71717a] group-hover:text-[#d4d4d8] transition-colors">
                      {step.detail}
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
