import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Lightbulb, Rocket, ShieldCheck, Sparkles, Send } from 'lucide-react';

export const MethodSection = () => {
  const { language } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: Lightbulb,
      name: language === 'fr' ? 'Idée' : 'Concept',
      desc:
        language === 'fr'
          ? "Identifier le problème qui mérite d'être résolu. Si je l'utiliserais tous les jours, cela vaut la peine d'être développé."
          : "Identify a real friction point worth eliminating. If I would use it every single day, it is worth engineering.",
    },
    {
      num: '02',
      icon: Rocket,
      name: language === 'fr' ? 'Prototype' : 'Prototype',
      desc:
        language === 'fr'
          ? "Développer une première version interactive pour valider l'expérience et le ressenti utilisateur au plus tôt."
          : 'Build an interactive working proof of concept to validate real feel, latency, and viability early.',
    },
    {
      num: '03',
      icon: ShieldCheck,
      name: language === 'fr' ? 'Architecture' : 'Architecture',
      desc:
        language === 'fr'
          ? 'Industrialiser rigoureusement : typage TypeScript strict, validation de schémas (Zod), modularité et gestion des erreurs.'
          : 'Engineer strictly: strict TypeScript, runtime schema validation (Zod), modular boundaries, and resilient error handling.',
    },
    {
      num: '04',
      icon: Sparkles,
      name: language === 'fr' ? 'Finition' : 'Polish',
      desc:
        language === 'fr'
          ? 'Micro-interactions, fluidité 120 FPS, typographie soignée et gestion des cas limites. Les 10 derniers % font le produit.'
          : 'Micro-interactions, 120 FPS fluidity, typographic hierarchy, and edge cases. The last 10% defines the product.',
    },
    {
      num: '05',
      icon: Send,
      name: language === 'fr' ? 'Livraison' : 'Ship',
      desc:
        language === 'fr'
          ? 'Conteneurisation Docker, Edge CDN, monitoring continu — déployé en production et utilisé par de vraies personnes.'
          : 'Docker containerization, Edge CDN, continuous observability — live in production with real users.',
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
            <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
              03 / MÉTHODE &amp; PROCESS
            </p>
          </div>
          <h2
            id="method-title"
            className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
          >
            {language === 'fr' ? (
              <>
                De l’intuition <em className="text-[#ff1e38] not-italic font-serif">au</em> logiciel éprouvé
              </>
            ) : (
              <>
                From idea <em className="text-[#ff1e38] not-italic font-serif">to</em> reliable software
              </>
            )}
          </h2>
          <p className="text-[#a1a1aa] text-base mt-3 max-w-xl font-normal leading-relaxed">
            {language === 'fr'
              ? 'Un processus de travail direct et itératif pour transformer une intuition technique en logiciel fiable et élégant.'
              : 'A direct, iterative loop turning technical ideas into dependable, fluid, and polished software.'}
          </p>
        </div>

        {/* Steps Grid with Flow Connector */}
        <div className="relative">
          {/* Subtle desktop horizontal connecting flow line */}
          <div
            className="hidden lg:block absolute top-10 left-[8%] right-[8%] h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="p-6 rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-[#ff1e38]/40 transition-colors flex flex-col justify-between group shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
