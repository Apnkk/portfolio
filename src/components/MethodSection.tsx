import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const MethodSection = () => {
  const { language } = useLanguage();

  const steps = [
    {
      num: '01',
      name: language === 'fr' ? 'Idée' : 'Idea',
      desc:
        language === 'fr'
          ? "Trouver le problème qui vaut la peine d'être résolu. Si je l'utiliserais tous les jours, ça vaut la peine d'être créé."
          : "Find the itch worth scratching. If I'd use it daily, it's worth building.",
    },
    {
      num: '02',
      name: language === 'fr' ? 'Prototype' : 'Prototype',
      desc:
        language === 'fr'
          ? "Vibe-coder une version fonctionnelle rapidement avec l'IA comme copilote. L'élan et la vélocité priment au départ."
          : 'Vibe-code a working version fast, AI as copilot. Momentum beats perfection — at first.',
    },
    {
      num: '03',
      name: language === 'fr' ? 'Architecture' : 'Architecture',
      desc:
        language === 'fr'
          ? 'Puis structurer proprement : typage strict TypeScript, vrais schémas de données, tests et sécurité renforcée.'
          : 'Then get serious: strict types, real data models, tests, security passes.',
    },
    {
      num: '04',
      name: language === 'fr' ? 'Finition' : 'Polish',
      desc:
        language === 'fr'
          ? 'Micro-interactions, fluidité de navigation, typographie et cas limites. Les 10 derniers % font le produit.'
          : 'Motion, typography, edge cases. The last 10% is the product.',
    },
    {
      num: '05',
      name: language === 'fr' ? 'Livraison' : 'Ship',
      desc:
        language === 'fr'
          ? 'Docker, CDN edge, monitoring en temps réel — en ligne sur un vrai domaine, utilisé par de vraies personnes.'
          : 'Docker, CDN, monitoring — live on a real domain, used by real people.',
    },
  ];

  return (
    <section
      id="method"
      className="py-16 sm:py-32 px-5 sm:px-12 md:px-16 bg-black border-y border-white/[0.08] text-left relative overflow-hidden"
      aria-labelledby="method-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Head */}
        <header className="mb-10 sm:mb-20">
          <p className="mono text-[#ff2a3b] mb-2 sm:mb-3 font-semibold">04 / METHOD</p>
          <h2 id="method-title" className="font-display font-semibold text-[clamp(2.1rem,6vw,4.8rem)] text-[#f4f2ee] tracking-tight leading-none">
            {language === 'fr' ? (
              <>
                Du bruit <em className="text-[#ff2a3b] not-italic font-serif">au</em> signal
              </>
            ) : (
              <>
                From static <em className="text-[#ff2a3b] not-italic font-serif">to</em> signal
              </>
            )}
          </h2>
          <p className="text-[#797368] text-xs sm:text-base mt-3 sm:mt-4 max-w-lg font-normal leading-relaxed">
            {language === 'fr'
              ? "Une boucle d'itération rapide qui transforme une intuition en logiciel fiable et élégant."
              : 'A rapid iteration loop turning raw ideas into dependable, polished software.'}
          </p>
        </header>

        {/* Steps Grid with Smooth Timeline Rail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-7 lg:gap-6 relative">
          {/* Base Horizontal Track (Desktop) */}
          <div className="hidden lg:block absolute top-[7px] left-0 right-0 h-[1px] bg-white/10 pointer-events-none" />

          {/* Animated Connecting Crimson Pulse Line (Desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block absolute top-[7px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff2a3b] via-[#ff6b78] to-[#ff2a3b] origin-left pointer-events-none shadow-[0_0_12px_rgba(255,42,59,0.7)] z-0"
          />

          {/* Vertical Track (Mobile) */}
          <div className="lg:hidden absolute left-[6px] top-3 bottom-3 w-[1px] bg-white/10 pointer-events-none">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full bg-[#ff2a3b] origin-top shadow-[0_0_8px_rgba(255,42,59,0.7)]"
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative pl-7 lg:pl-0 lg:pt-8 flex flex-col z-10 group"
            >
              {/* Dot on line (Desktop) */}
              <div className="hidden lg:flex absolute top-0 left-0 w-3.5 h-3.5 rounded-full border border-[#ff2a3b] bg-black items-center justify-center shadow-[0_0_10px_rgba(255,42,59,0.6)] group-hover:scale-125 transition-transform duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff2a3b]" />
              </div>

              {/* Dot on line (Mobile) */}
              <div className="lg:hidden absolute left-0 top-1 w-3.5 h-3.5 rounded-full border border-[#ff2a3b] bg-black flex items-center justify-center shadow-[0_0_10px_rgba(255,42,59,0.6)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff2a3b]" />
              </div>

              <span className="mono text-[#ff2a3b] font-semibold text-xs mb-1.5">{step.num}</span>
              <h3 className="font-display font-semibold text-lg sm:text-2xl text-[#f4f2ee] mb-1.5 sm:mb-2 tracking-tight group-hover:text-[#ff2a3b] transition-colors">
                {step.name}
              </h3>
              <p className="text-[#b8b3a8] text-xs sm:text-sm leading-relaxed font-normal">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
