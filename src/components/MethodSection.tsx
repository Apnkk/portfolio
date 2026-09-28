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
      name: language === 'fr' ? 'Idée' : 'Concept',
      desc: language === 'fr' ? 'Cibler un vrai besoin utile au quotidien.' : 'Pinpoint a genuine daily need.',
    },
    {
      num: '02',
      icon: Rocket,
      name: language === 'fr' ? 'Prototype' : 'Prototype',
      desc: language === 'fr' ? "Valider vite l'expérience et le rendu." : 'Fast validation of feel and UX.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      name: language === 'fr' ? 'Architecture' : 'Architecture',
      desc: language === 'fr' ? 'Typage strict et modularité résiliente.' : 'Strict types and resilient design.',
    },
    {
      num: '04',
      icon: Sparkles,
      name: language === 'fr' ? 'Finition' : 'Polish',
      desc: language === 'fr' ? 'Fluidité 120 FPS et micro-interactions.' : '120 FPS motion and micro-details.',
    },
    {
      num: '05',
      icon: Send,
      name: language === 'fr' ? 'Livraison' : 'Ship',
      desc: language === 'fr' ? 'Docker, Edge CDN et production live.' : 'Docker, Edge CDN, and live users.',
    },
  ];

  return (
    <section
      id="method"
      className="py-24 sm:py-32 px-5 sm:px-10 lg:px-16 bg-black border-y border-white/[0.08] text-left relative"
      aria-labelledby="method-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Head */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
            <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
              {language === 'fr' ? 'MÉTHODOLOGIE & PROCESS' : 'ENGINEERING PROCESS'}
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
                From spark <span className="text-[#ff1e38]">to</span> reliable software
              </>
            )}
          </h2>
          <p className="text-[#a1a1aa] text-sm mt-3 max-w-lg font-normal leading-relaxed">
            {language === 'fr'
              ? 'Un cycle direct de l’intuition technique au produit déployé.'
              : 'A direct loop from technical spark to production release.'}
          </p>
        </div>

        {/* Steps Grid with Flow Connector and traveling pulse */}
        <div className="relative">
          {/* Subtle desktop horizontal connecting flow line with traveling laser pulse */}
          {!shouldReduceMotion && (
            <div
              className="hidden lg:block absolute top-10 left-[8%] right-[8%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none overflow-hidden"
              aria-hidden="true"
            >
              <motion.div
                animate={{ x: ['-100%', '800%'] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="w-28 h-full bg-gradient-to-r from-transparent via-[#ff1e38] to-transparent shadow-[0_0_8px_#ff1e38]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    type: 'spring',
                    visualDuration: 0.35,
                    bounce: 0.12,
                    delay: shouldReduceMotion ? 0 : idx * 0.07,
                  }}
                >
                  <TiltCard
                    scale={1.02}
                    spotlightColor="rgba(255, 30, 56, 0.12)"
                    className="p-6 rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-[#ff1e38]/40 transition-colors flex flex-col justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.4)] h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono font-bold text-xs text-[#ff1e38] group-hover:drop-shadow-[0_0_8px_rgba(255,30,56,0.6)] transition-all">
                          {step.num}
                        </span>
                        <Icon className="w-4 h-4 text-[#71717a] group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-display font-semibold text-lg text-white mb-2 tracking-tight">
                        {step.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                        {step.desc}
                      </p>
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
