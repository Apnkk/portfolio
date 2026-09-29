import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ParticleTerrainGL } from './canvas/ParticleTerrainGL';
import { audioEngine } from '../utils/audioSynth';
import { Play } from 'lucide-react';

interface HeroProps {
  onOpenCommandPalette?: () => void;
}

export const Hero = ({ onOpenCommandPalette: _onOpenCommandPalette }: HeroProps) => {
  const { language } = useLanguage();

  const handlePlayMusic = () => {
    void audioEngine.play();
  };

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-[var(--bg)]"
      aria-label="Introduction"
    >
      {/* Three.js Audio-Reactive 3D Particle Wave Canvas */}
      <ParticleTerrainGL />

      {/* Atmospheric Gradient Fades */}
      <div
        className="absolute inset-0 pointer-events-none z-1 bg-gradient-to-b from-[rgba(10,9,8,0.45)] via-transparent via-55% to-[var(--bg)] to-96%"
        aria-hidden="true"
      />

      {/* Hero Content Inner */}
      <div className="relative z-10 px-[var(--pad)] mb-[clamp(28px,5vh,64px)] pointer-events-none max-w-7xl w-full">
        {/* Status Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 text-[var(--cream-dim)] font-mono text-[0.68rem] tracking-wider uppercase mb-[clamp(14px,2.5vh,28px)] pointer-events-auto"
        >
          <span className="status-dot" aria-hidden="true" />
          <span>
            {language === 'fr'
              ? "TRÈS OCCUPÉ ENTRE LES ÉTUDES, LA FAMILLE, LES PROJETS PERSO, ETC. — VIBE CODER EN FRANCE"
              : "VERY BUSY BETWEEN STUDIES, FAMILY, SIDE PROJECTS — VIBE CODER IN FRANCE"}
          </span>
        </motion.div>

        {/* Huge Typographic Hero Title: ARES / DEV */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-semibold text-[clamp(3.8rem,14.5vw,12.5rem)] leading-[0.88] tracking-[-0.03em] uppercase mb-[clamp(18px,3vh,36px)] select-none"
        >
          <span className="block text-[var(--cream)] overflow-hidden">
            ARES
          </span>
          <span className="block outline-amber overflow-hidden">
            DEV
          </span>
        </motion.h1>

        {/* Subtitle & Role */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[580px] pointer-events-auto"
        >
          <p className="font-display font-medium text-[clamp(1.15rem,2.4vw,1.6rem)] tracking-[-0.01em] text-[var(--cream)] leading-snug">
            {language === 'fr' ? (
              <>
                Développeur full-stack <em className="text-[var(--amber)] not-italic">&amp;</em> créatif qui ship.
              </>
            ) : (
              <>
                Full-stack developer <em className="text-[var(--amber)] not-italic">&amp;</em> creative builder.
              </>
            )}
          </p>

          <p className="text-[var(--cream-dim)] mt-2 text-[clamp(0.92rem,1.6vw,1.05rem)] leading-relaxed">
            {language === 'fr'
              ? "Je construis des produits web calibre streaming — rapides, léchés, un peu bruyants."
              : "I build streaming-grade web products — ultra-fast, polished, and loud."}
          </p>
        </motion.div>

        {/* 3 CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-3.5 mt-[clamp(22px,3.5vh,40px)] pointer-events-auto"
        >
          <a href="#work" className="btn btn--primary group">
            <span>{language === 'fr' ? 'VOIR LES PROJETS' : 'VIEW PROJECTS'}</span>
            <span className="text-base group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">↘</span>
          </a>

          <a href="#contact" className="btn btn--ghost">
            <span>{language === 'fr' ? 'ME CONTACTER' : 'CONTACT ME'}</span>
          </a>

          <button
            type="button"
            onClick={handlePlayMusic}
            className="btn btn--play group flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-[var(--amber)] fill-current group-hover:scale-110 transition-transform" />
            <span>{language === 'fr' ? 'ÉCOUTER EN NAVIGUANT' : 'LISTEN WHILE BROWSING'}</span>
          </button>
        </motion.div>
      </div>

      {/* Bottom Meta Strip */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-4 py-4 px-[var(--pad)] border-t border-[var(--line)] text-[var(--muted)] font-mono text-[0.68rem] tracking-wider uppercase select-none">
        <div className="flex items-center gap-2">
          <span>{language === 'fr' ? 'EN LIGNE DEPUIS 2024' : 'ONLINE SINCE 2024'}</span>
          <span>→</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[var(--cream-dim)]">
          <span>Z-FLIX</span>
          <span className="text-[var(--amber)]">·</span>
          <span>SHOPCORE</span>
          <span className="text-[var(--amber)]">·</span>
          <span>SPOTI LIQUID GLASS</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span>SCROLL</span>
          <div className="w-11 h-[1px] bg-[var(--line-strong)] relative overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              className="absolute inset-0 bg-[var(--amber)] w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
