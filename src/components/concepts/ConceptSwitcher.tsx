import { motion } from 'framer-motion';
import { Layers, Film, Droplets, Grid } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type ConceptId = 'cad' | '35mm' | 'sapphire' | 'showcase';

interface ConceptSwitcherProps {
  activeConcept: ConceptId;
  onSelectConcept: (concept: ConceptId) => void;
  isEmbedded?: boolean;
  className?: string;
}

export const ConceptSwitcher = ({
  activeConcept,
  onSelectConcept,
  isEmbedded = false,
  className = '',
}: ConceptSwitcherProps) => {
  const { language } = useLanguage();

  const concepts: {
    id: ConceptId;
    labelShort: string;
    labelFull: string;
    tag: string;
    icon: typeof Layers;
  }[] = [
    {
      id: 'cad',
      labelShort: '01 CAD',
      labelFull: '01 CAD DISSECTION',
      tag: language === 'fr' ? '3D ISOMÉTRIQUE' : '3D ISOMETRIC',
      icon: Layers,
    },
    {
      id: '35mm',
      labelShort: '02 35MM',
      labelFull: '02 35MM MASTER',
      tag: language === 'fr' ? 'CHRONO-SCRUBBER' : 'CHRONO-SCRUBBER',
      icon: Film,
    },
    {
      id: 'sapphire',
      labelShort: '03 SAPPHIRE',
      labelFull: '03 LIQUID SAPPHIRE',
      tag: language === 'fr' ? 'PRISME FERROFLUIDE' : 'FERROFLUID PRISM',
      icon: Droplets,
    },
    {
      id: 'showcase',
      labelShort: language === 'fr' ? 'VITRINE' : 'SHOWCASE',
      labelFull: language === 'fr' ? 'VITRINE' : 'SHOWCASE',
      tag: 'DEFAULT',
      icon: Grid,
    },
  ];

  const content = (
    <div
      className={`relative p-1 sm:p-1.5 rounded-full bg-black/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_45px_rgba(0,0,0,0.92)] flex items-center justify-between sm:justify-center gap-1 overflow-x-auto no-scrollbar pointer-events-auto ${className}`}
      role="tablist"
      aria-label="Sélecteur d'univers créatifs"
    >
      {/* Subtle crimson laser scan line inside switcher */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff1e38]/10 to-transparent animate-pulse" />
      </div>

      {concepts.map((c) => {
        const isActive = activeConcept === c.id;
        const Icon = c.icon;

        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectConcept(c.id)}
            className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-mono text-[0.62rem] sm:text-[0.72rem] uppercase tracking-wider transition-all duration-300 cursor-pointer select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff1e38] ${
              isActive
                ? 'text-white font-semibold'
                : 'text-[#b8b3a8] hover:text-[#f5f3ef] hover:bg-white/[0.04]'
            }`}
            title={`${c.labelFull} — ${c.tag}`}
          >
            {isActive && (
              <motion.div
                layoutId="active-concept-pill"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff1e38] via-[#e6162f] to-[#ff1e38] shadow-[0_0_24px_rgba(255,30,56,0.7)]"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-1.5">
              <Icon
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 ${
                  isActive ? 'text-white scale-110' : 'text-[#ff1e38] opacity-75'
                }`}
              />
              <span className="hidden xl:inline font-mono">{c.labelFull}</span>
              <span className="inline xl:hidden font-mono">{c.labelShort}</span>
            </span>

            {isActive && (
              <span className="relative z-10 hidden 2xl:inline-block ml-1 text-[0.56rem] px-1.5 py-0.5 rounded-full bg-black/40 text-white/90 border border-white/20 tracking-widest font-sans">
                {c.tag}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div
      className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-[940] w-[95%] sm:w-auto max-w-[96vw] pointer-events-auto"
      role="region"
      aria-label="Sélecteur d'univers créatifs"
    >
      {content}
    </div>
  );
};
