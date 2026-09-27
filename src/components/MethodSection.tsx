import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Lightbulb, Rocket, ShieldCheck, Sparkles, Send } from 'lucide-react';

export const MethodSection = () => {
  const { language } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: Lightbulb,
      name: language === 'fr' ? 'Idée' : 'Idea',
      desc:
        language === 'fr'
          ? "Identifier le problème qui vaut la peine d'être résolu. Si je l'utiliserais tous les jours, ça vaut la peine d'être créé."
          : "Find the itch worth scratching. If I'd use it daily, it's worth building.",
    },
    {
      num: '02',
      icon: Rocket,
      name: language === 'fr' ? 'Prototype' : 'Prototype',
      desc:
        language === 'fr'
          ? "Développer une première version fonctionnelle rapidement pour tester et valider l'expérience. L'élan et la vélocité priment au départ."
          : 'Build a working interactive version fast to test and validate the experience. Momentum beats perfection — at first.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      name: language === 'fr' ? 'Architecture' : 'Architecture',
      desc:
        language === 'fr'
          ? 'Puis structurer proprement : typage strict TypeScript, vrais schémas de données, tests et sécurité renforcée.'
          : 'Then engineer strictly: strict types, real data schemas, tests, and resilient security.',
    },
    {
      num: '04',
      icon: Sparkles,
      name: language === 'fr' ? 'Finition' : 'Polish',
      desc:
        language === 'fr'
          ? 'Micro-interactions, fluidité 120 FPS, typographie soignée et cas limites. Les 10 derniers % font le produit.'
          : 'Micro-interactions, 120 FPS motion, typography, and edge cases. The last 10% is the product.',
    },
    {
      num: '05',
      icon: Send,
      name: language === 'fr' ? 'Livraison' : 'Ship',
      desc:
        language === 'fr'
          ? 'Docker, CDN edge, monitoring en temps réel — en ligne sur un vrai domaine, utilisé par de vraies personnes.'
          : 'Docker, Edge CDN, real-time monitoring — live on a real domain, serving real traffic.',
    },
  ];

  return (
    <section
      id="method"
      className="py-20 sm:py-32 px-5 sm:px-10 md:px-14 bg-black border-y border-white/[0.08] text-left relative overflow-hidden select-none"
      aria-labelledby="method-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Head */}
        <header className="mb-12 sm:mb-20">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]" />
            <p className="mono text-[#ff1e38] font-semibold text-xs tracking-widest">
              04 / METHOD
            </p>
          </div>
          <h2
            id="method-title"
            className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] text-[#f5f3ef] tracking-tight leading-none"
          >
            {language === 'fr' ? (
              <>
                Du bruit <em className="text-[#ff1e38] not-italic font-serif">au</em> signal
              </>
            ) : (
              <>
                From static <em className="text-[#ff1e38] not-italic font-serif">to</em> signal
              </>
            )}
          </h2>
          <p className="text-[#b8b3a8] text-sm sm:text-base mt-3 max-w-lg font-normal leading-relaxed">
            {language === 'fr'
              ? "Une boucle d'itération rapide qui transforme une intuition en logiciel robuste, ultra-fluide et élégant."
              : 'A rapid iteration loop turning raw ideas into dependable, fluid, and polished software.'}
          </p>
        </header>

        {/* Steps Grid with Smooth Timeline Rail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {/* Base Horizontal Track (Desktop) */}
          <div className="hidden lg:block absolute top-[14px] left-6 right-6 h-[1px] bg-white/10 pointer-events-none" />

          {/* Animated Connecting Crimson Pulse Line (Desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block absolute top-[14px] left-6 right-6 h-[2px] bg-gradient-to-r from-[#ff1e38] via-[#ff4d61] to-[#ff1e38] origin-left pointer-events-none shadow-[0_0_12px_rgba(255,30,56,0.7)] z-0"
          />

          {/* Vertical Track (Mobile) */}
          <div className="lg:hidden absolute left-[15px] top-4 bottom-4 w-[1px] bg-white/10 pointer-events-none">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full bg-[#ff1e38] origin-top shadow-[0_0_8px_rgba(255,30,56,0.7)]"
            />
          </div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-10 lg:pl-0 lg:pt-10 flex flex-col z-10 group"
              >
                {/* Dot on line (Desktop) */}
                <div className="hidden lg:flex absolute top-[6px] left-6 w-4 h-4 rounded-full border border-[#ff1e38] bg-black items-center justify-center shadow-[0_0_10px_rgba(255,30,56,0.6)] group-hover:scale-125 transition-transform duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
                </div>

                {/* Dot on line (Mobile) */}
                <div className="lg:hidden absolute left-[9px] top-1.5 w-3.5 h-3.5 rounded-full border border-[#ff1e38] bg-black flex items-center justify-center shadow-[0_0_10px_rgba(255,30,56,0.6)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
                </div>

                {/* Step Card */}
                <div className="oled-card p-5 sm:p-6 flex flex-col justify-between flex-1 group-hover:border-[#ff1e38]/50 transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="mono text-[#ff1e38] font-bold text-xs">{step.num}</span>
                      <Icon className="w-4 h-4 text-[#726d64] group-hover:text-[#ff1e38] transition-colors" />
                    </div>
                    <h3 className="font-display font-semibold text-lg sm:text-xl text-[#f5f3ef] mb-2 tracking-tight group-hover:text-[#ff1e38] transition-colors">
                      {step.name}
                    </h3>
                    <p className="text-[#b8b3a8] text-xs sm:text-sm leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
