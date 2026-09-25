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
    <section id="method" className="py-24 sm:py-32 px-6 sm:px-12 md:px-16 bg-[#121008] border-y border-[rgba(237,232,221,0.1)] text-left" aria-labelledby="method-title">
      <div className="max-w-7xl mx-auto">
        {/* Section Head */}
        <header className="mb-14 sm:mb-20">
          <p className="mono text-[#f2a33c] mb-3">04 / METHOD</p>
          <h2 id="method-title" className="font-display font-semibold text-[clamp(2.4rem,6vw,4.8rem)] text-[#ede8dd] tracking-tight leading-none">
            {language === 'fr' ? (
              <>
                Du bruit <em className="text-[#f2a33c] not-italic font-serif">au</em> signal
              </>
            ) : (
              <>
                From static <em className="text-[#f2a33c] not-italic font-serif">to</em> signal
              </>
            )}
          </h2>
          <p className="text-[#837e6f] text-sm sm:text-base mt-4 max-w-lg font-normal">
            {language === 'fr'
              ? "Une boucle d'itération rapide qui transforme une intuition en logiciel fiable et élégant."
              : 'A rapid iteration loop turning raw ideas into dependable, polished software.'}
          </p>
        </header>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative">
          {/* Top Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[7px] left-0 right-0 h-[1px] bg-[rgba(237,232,221,0.1)] pointer-events-none" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative lg:pt-8 flex flex-col">
              {/* Dot on line */}
              <div className="hidden lg:flex absolute top-0 left-0 w-3.5 h-3.5 rounded-full border border-[#f2a33c] bg-[#121008] items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f2a33c]" />
              </div>

              <span className="mono text-[#837e6f] text-xs mb-2">{step.num}</span>
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-[#ede8dd] mb-2 tracking-tight">
                {step.name}
              </h3>
              <p className="text-[#837e6f] text-xs sm:text-sm leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
