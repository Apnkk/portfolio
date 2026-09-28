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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        visualDuration: 0.4,
        bounce: 0.12,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-32 sm:pt-40 pb-12 px-5 sm:px-10 lg:px-16 text-center bg-black overflow-hidden"
      aria-label="Introduction"
    >
      {/* Subtle top spotlight (Linear / Vercel style) */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] pointer-events-none"
        style={{
          opacity: spotlightOpacity,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 30, 56, 0.2), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto my-auto flex flex-col items-center"
      >
        {/* Understated Status Badge with live pulsing radar ring */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6 sm:mb-8 hover:border-white/20 transition-colors"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e38] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]" />
          </span>
          <span className="font-mono text-xs text-[#a1a1aa] tracking-wide">
            {language === 'fr'
              ? 'Développeur Full-Stack & Systèmes'
              : 'Full-Stack & Systems Engineer'}
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          variants={itemVariants}
          className="font-display font-semibold text-[clamp(2.4rem,6.5vw,5.2rem)] text-white tracking-tight leading-[1.08] text-balance mb-6"
        >
          {language === 'fr' ? (
            <>
              Ares <span className="text-[#71717a] font-normal">—</span> Développeur full-stack <span className="text-[#ff1e38]">&amp;</span> créateur de produits.
            </>
          ) : (
            <>
              Ares <span className="text-[#71717a] font-normal">—</span> Full-stack <span className="text-[#ff1e38]">&amp;</span> product engineer.
            </>
          )}
        </motion.h1>

        {/* Value Proposition Statement - Concise */}
        <motion.p
          variants={itemVariants}
          className="text-[#a1a1aa] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8 sm:mb-10 text-balance font-normal"
        >
          {language === 'fr'
            ? "Créateur d'applications de streaming, d'outils iOS et d'interfaces web rapides et réactives."
            : 'Building streaming applications, native iOS tools, and high-performance web products.'}
        </motion.p>

        {/* Action Buttons with Magnetic cursor pull & spring taps */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-14 sm:mb-16"
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
          className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl"
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
              className="p-4 rounded-xl bg-[#09090b] border border-white/[0.08] hover:border-[#ff1e38]/30 transition-colors text-left group cursor-default relative overflow-hidden"
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
        <motion.div
          variants={itemVariants}
          className="mt-8 sm:mt-10 flex flex-col items-center gap-2 text-[#71717a] select-none"
        >
          <span className="font-mono text-[0.6rem] tracking-[0.22em] uppercase">
            {language === 'fr' ? 'DÉFILER VERS LE BAS' : 'SCROLL TO EXPLORE'}
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-3.5 h-6 rounded-full border border-white/[0.15] flex items-start justify-center p-1"
          >
            <div className="w-1 h-1.5 rounded-full bg-[#ff1e38]" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Hero Bottom Meta Strip */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#71717a]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
          <span>PRODUCTION STACK</span>
        </div>
        <div className="text-center sm:text-right text-[#a1a1aa] text-[0.68rem] tracking-wider uppercase">
          REACT 19 · TYPESCRIPT · NEXT.JS · IOS · DOCKER · TAILWIND 4
        </div>
      </div>
    </section>
  );
};
