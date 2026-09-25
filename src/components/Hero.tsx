import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Play, Pause, ArrowDownRight } from 'lucide-react';

interface HeroProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const Hero = ({ isPlaying, onTogglePlay }: HeroProps) => {
  const { language } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] sm:min-h-screen flex flex-col justify-end overflow-hidden pt-28 pb-0 text-left"
      aria-label="Introduction"
    >
      {/* Ambient Radial Gradients */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 75% 25%, rgba(242, 163, 60, 0.12), transparent 60%),
            radial-gradient(ellipse 60% 45% at 20% 75%, rgba(255, 61, 46, 0.07), transparent 65%)
          `,
        }}
      />

      <div className="relative z-10 px-6 sm:px-12 md:px-16 mb-8 sm:mb-14">
        {/* Status Kicker */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mono text-[#b9b3a4] flex items-center gap-2 mb-4 sm:mb-6"
        >
          <span className="status-dot" aria-hidden="true" />
          <span>
            {language === 'fr'
              ? 'disponible pour missions & projets ambitieux — vibe coder en France'
              : 'available for contracts & full-stack builds — vibe coder in France'}
          </span>
        </motion.p>

        {/* Giant Clash Display Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold uppercase tracking-tight leading-[0.88] select-none text-[clamp(3.8rem,14vw,11.5rem)] mb-6 sm:mb-8"
        >
          <span className="block text-[#ede8dd]">ARES</span>
          <span className="block stroke-amber">DEV</span>
        </motion.h1>

        {/* Subtitle & Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl text-left"
        >
          <p className="font-display font-medium text-[clamp(1.15rem,2.4vw,1.6rem)] text-[#ede8dd] tracking-tight">
            {language === 'fr' ? (
              <>
                Développeur full-stack <em className="text-[#f2a33c] not-italic font-serif">&amp;</em> creative builder.
              </>
            ) : (
              <>
                Full-stack developer <em className="text-[#f2a33c] not-italic font-serif">&amp;</em> creative builder.
              </>
            )}
          </p>

          <p className="text-[#b9b3a4] text-[clamp(0.95rem,1.5vw,1.1rem)] mt-2 font-normal leading-relaxed">
            {language === 'fr'
              ? 'Je conçois des produits web & mobiles haute performance — véloces, soignés et avec du caractère.'
              : 'I build streaming-grade web & mobile products — fast, polished, and a little bit loud.'}
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-3.5 sm:gap-4 mt-8 sm:mt-10"
        >
          <a href="#work" className="btn btn--solid group">
            <span>{language === 'fr' ? 'Voir les projets' : 'View work'}</span>
            <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a href="#contact" className="btn btn--ghost">
            <span>{language === 'fr' ? 'Me contacter' : 'Contact me'}</span>
          </a>

          <button
            onClick={onTogglePlay}
            className={`btn btn--play ${isPlaying ? 'is-playing' : ''}`}
            aria-label={isPlaying ? 'Mettre en pause' : 'Écouter la musique'}
          >
            <span className="play-icon-box">
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </span>
            <span>
              {isPlaying
                ? language === 'fr'
                  ? 'Ambiance audio active'
                  : 'Music playing'
                : language === 'fr'
                ? 'Écouter en naviguant'
                : 'Listen while browsing'}
            </span>
          </button>
        </motion.div>
      </div>

      {/* Hero Bottom Meta Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-6 sm:px-12 md:px-16 py-4 border-t border-[rgba(237,232,221,0.1)] text-[#837e6f] font-mono text-[0.72rem] tracking-wider uppercase">
        <span>{language === 'fr' ? 'EN PRODUCTION DEPUIS 2023 →' : 'SHIPPING SINCE 2023 →'}</span>
        <span className="hidden sm:inline-block text-[#b9b3a4]">
          NEXUSFLOW · PULSETRACK · DEVSTUDIO · SYNTHESIS
        </span>
        <span className="inline-flex items-center gap-2.5">
          <span>SCROLL</span>
          <span className="w-10 h-[1px] bg-[rgba(237,232,221,0.25)] relative overflow-hidden inline-block">
            <span className="absolute inset-0 bg-[#f2a33c] animate-[scrollhint_2.2s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
          </span>
        </span>
      </div>
    </section>
  );
};
