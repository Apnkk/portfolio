import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowDownRight, Mail } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';
import { MagneticButton } from './motion/MagneticButton';

export const Hero = () => {
  const { language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, shouldReduceMotion ? 0 : -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 0.7], [1, shouldReduceMotion ? 1 : 0.98]);
  const spotlightOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 0.05]);

  // Motion UI orchestrated variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        visualDuration: 0.45,
        bounce: 0.14,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8 px-5 sm:px-10 lg:px-16 text-center bg-black overflow-hidden"
      aria-label="Introduction"
    >
      {/* Ambient crimson halo spotlight behind Ares */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] pointer-events-none"
        style={{
          opacity: spotlightOpacity,
          background: 'radial-gradient(ellipse at 50% 15%, rgba(255, 30, 56, 0.22), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl lg:max-w-6xl mx-auto my-auto flex flex-col items-center justify-center w-full"
      >
        {/* Hero Title - Ares Centered & Iconic */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-center"
        >
          <span className="block font-bold text-[clamp(6.8rem,19vw,16.8rem)] text-white tracking-tighter leading-[0.88] select-none drop-shadow-[0_25px_70px_rgba(255,255,255,0.16)]">
            Ares
          </span>
          <span className="block font-semibold text-[clamp(1.65rem,3.6vw,3.15rem)] text-white/90 tracking-tight leading-[1.2] max-w-4xl mx-auto text-balance mt-6 sm:mt-8">
            {language === 'fr' ? (
              <>
                Développeur full-stack <span className="text-[#ff1e38] font-bold">&amp;</span> créateur de produits.
              </>
            ) : (
              <>
                Full-stack <span className="text-[#ff1e38] font-bold">&amp;</span> product engineer.
              </>
            )}
          </span>
        </motion.h1>
      </motion.div>

      {/* Hero Bottom Group: Actions, Metrics, Scroll Indicator & Meta Strip */}
      <div className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-col items-center">
        {/* Action Buttons with Magnetic cursor pull & spring taps */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <MagneticButton>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
              href="#work"
              className="btn btn--crimson group py-3 px-6 text-xs sm:text-[0.78rem]"
            >
              <span>{language === 'fr' ? 'Explorer les projets' : 'View Projects'}</span>
              <ArrowDownRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </motion.a>
          </MagneticButton>

          <MagneticButton>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
              href="#contact"
              className="btn btn--ghost py-3 px-6 text-xs sm:text-[0.78rem]"
            >
              <Mail className="w-3.5 h-3.5 text-[#a1a1aa]" />
              <span>{language === 'fr' ? 'Me contacter' : 'Get in Touch'}</span>
            </motion.a>
          </MagneticButton>

          <MagneticButton>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
              href="https://github.com/Apnkk"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost py-3 px-4 text-xs"
              title="Profil GitHub"
              aria-label="Profil GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </motion.a>
          </MagneticButton>
        </motion.div>

        {/* Clean Metrics Strip with spring physics */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mb-6 sm:mb-8"
        >
          {[
            {
              value: '10+',
              label: language === 'fr' ? 'Projets livrés' : 'Shipped',
            },
            {
              value: '< 50ms',
              label: language === 'fr' ? 'Latence APIs' : 'API Latency',
            },
            {
              value: 'Web & iOS',
              label: language === 'fr' ? 'Plateformes' : 'Platforms',
            },
            {
              value: '100%',
              label: language === 'fr' ? 'Autonomie' : 'End-to-End',
            },
          ].map((metric, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.15 }}
              className="p-4 sm:p-5 rounded-xl bg-[#09090b] border border-white/[0.08] hover:border-[#ff1e38]/30 transition-colors text-left group cursor-default relative overflow-hidden"
            >
              <div className="font-display font-semibold text-xl sm:text-2xl text-white mb-1 group-hover:text-[#ff1e38] transition-colors">
                {metric.value}
              </div>
              <div className="font-mono text-[0.66rem] text-[#71717a] uppercase tracking-wider leading-snug">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Subtle Web Design Flow Scroll Indicator */}
        <motion.a
          href="#work"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center gap-2 text-[#71717a] hover:text-white transition-colors cursor-pointer select-none group mb-4 sm:mb-5"
          aria-label={language === 'fr' ? 'Défiler vers les projets' : 'Scroll to explore'}
        >
          <span className="font-mono text-[0.62rem] tracking-[0.22em] pl-[0.22em] uppercase group-hover:text-[#a1a1aa] transition-colors">
            {language === 'fr' ? 'DÉFILER VERS LE BAS' : 'SCROLL TO EXPLORE'}
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-3.5 h-6 rounded-full border border-white/[0.15] group-hover:border-[#ff1e38]/50 flex items-start justify-center p-1 transition-colors"
          >
            <div className="w-1 h-1.5 rounded-full bg-[#ff1e38]" />
          </motion.div>
        </motion.a>

        {/* Hero Bottom Meta Strip - Centered Tech Stack */}
        <div className="w-full pt-4 sm:pt-5 border-t border-white/[0.08] flex items-center justify-center text-center font-mono">
          <div className="text-[#a1a1aa] text-[0.68rem] sm:text-xs tracking-wider uppercase">
            REACT 19 · TYPESCRIPT · NEXT.JS · IOS · DOCKER · TAILWIND 4
          </div>
        </div>
      </div>
    </section>
  );
};



