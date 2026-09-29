import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { 
  ArrowDownRight, 
  Mail, 
  Terminal, 
  Copy, 
  Check
} from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';
import { MagneticButton } from './motion/MagneticButton';
import confetti from 'canvas-confetti';

interface HeroProps {
  onOpenCommandPalette?: () => void;
}

export const Hero = ({ onOpenCommandPalette }: HeroProps) => {
  const { language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.7], [0, shouldReduceMotion ? 0 : -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15]);
  const spotlightOpacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 0.05]);

  const copyConfigSnippet = () => {
    const code = `const ares = {
  role: "Full-Stack Developer & Creative Builder",
  location: "France",
  focus: ["Streaming", "iOS Modding", "Reverse APIs", "E-Commerce"],
  stack: ["React 19", "TypeScript", "Next.js", "Swift", "Tailwind 4", "Node 22"],
  contact: "contact@shopcore.buzz"
};`;
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        visualDuration: 0.45,
        bounce: 0.12,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[96vh] sm:min-h-screen flex flex-col justify-between pt-24 sm:pt-32 pb-10 sm:pb-12 px-5 sm:px-10 lg:px-16 text-center bg-black overflow-hidden bg-grid"
      aria-label="Introduction"
    >
      {/* Ambient background glows */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none"
        style={{
          opacity: spotlightOpacity,
          background: 'radial-gradient(ellipse at 50% 10%, rgba(255, 30, 56, 0.25), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/3 -left-48 w-96 h-96 rounded-full bg-red-600/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-amber-500/10 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Hero Column */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl lg:max-w-6xl mx-auto my-auto flex flex-col items-center justify-center w-full"
      >
        {/* Availability & Role Status Pill */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#09090b]/80 border border-white/[0.1] backdrop-blur-md mb-6 shadow-sm group hover:border-[#ff1e38]/40 transition-colors cursor-default"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[0.68rem] text-[#d4d4d8] tracking-wider uppercase">
            {language === 'fr' 
              ? 'Disponible pour projets & missions' 
              : 'Available for contracts & builds'}
          </span>
          <span className="text-white/20 select-none">|</span>
          <span className="font-mono text-[0.65rem] text-[#ff1e38] font-semibold tracking-wider">
            FRANCE
          </span>
        </motion.div>

        {/* Hero Title - Ares Typographic Icon */}
        <motion.h1
          variants={itemVariants}
          className="font-display text-center relative"
        >
          <span className="block font-bold text-[clamp(5.5rem,18vw,15.5rem)] text-white tracking-tighter leading-[0.84] select-none drop-shadow-[0_20px_60px_rgba(255,255,255,0.14)]">
            Ares
          </span>
          <span className="block font-semibold text-[clamp(1.5rem,3.4vw,2.85rem)] text-white/95 tracking-tight leading-[1.2] max-w-3xl mx-auto text-balance mt-4 sm:mt-6">
            {language === 'fr' ? (
              <>
                Développeur full-stack <span className="text-[#ff1e38] font-bold">&amp;</span> créateur de produits.
              </>
            ) : (
              <>
                Full-stack developer <span className="text-[#ff1e38] font-bold">&amp;</span> creative builder.
              </>
            )}
          </span>
        </motion.h1>

        {/* Subtitle bio */}
        <motion.p
          variants={itemVariants}
          className="text-[#a1a1aa] text-sm sm:text-base max-w-2xl mx-auto mt-4 font-normal leading-relaxed text-balance"
        >
          {language === 'fr' ? (
            <>
              Je conçois des applications de streaming vidéo (Z-Flix), des plateformes e-commerce à haute conversion (ShopCore) et des tweaks iOS natifs en Liquid Glass. Du code propre, rapide et éprouvé en production.
            </>
          ) : (
            <>
              Engineering high-volume streaming platforms (Z-Flix), automated SaaS e-commerce (ShopCore), and native iOS Liquid Glass tweaks. Strict types, sub-50ms APIs, and 120 FPS fluidity.
            </>
          )}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 mb-8"
        >
          <MagneticButton>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
              href="#work"
              className="btn btn--crimson group py-3 px-6 text-xs sm:text-[0.78rem]"
            >
              <span>{language === 'fr' ? 'Explorer les projets' : 'Explore Projects'}</span>
              <ArrowDownRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </motion.a>
          </MagneticButton>

          {onOpenCommandPalette && (
            <MagneticButton>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
                onClick={onOpenCommandPalette}
                className="btn btn--ghost py-3 px-5 text-xs sm:text-[0.78rem] flex items-center gap-2 group"
                title="Ouvrir la console de commandes (Cmd+K)"
              >
                <Terminal className="w-3.5 h-3.5 text-[#ff1e38] group-hover:rotate-12 transition-transform" />
                <span>Console</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/[0.08] text-[0.62rem] text-[#a1a1aa] font-mono">
                  ⌘K
                </kbd>
              </motion.button>
            </MagneticButton>
          )}

          <MagneticButton>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
              href="#contact"
              className="btn btn--ghost py-3 px-6 text-xs sm:text-[0.78rem]"
            >
              <Mail className="w-3.5 h-3.5 text-[#a1a1aa]" />
              <span>{language === 'fr' ? 'Me contacter' : 'Contact'}</span>
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
              title="GitHub — @Apnkk"
              aria-label="Profil GitHub"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </motion.a>
          </MagneticButton>
        </motion.div>

        {/* Interactive Developer Snippet Card */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl mx-auto rounded-2xl bg-[#09090b]/90 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden text-left mb-8 group hover:border-white/20 transition-colors"
        >
          {/* Terminal Window Header */}
          <div className="px-4 py-2.5 bg-[#121214] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 border border-black/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 border border-black/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 border border-black/20" />
              </div>
              <span className="font-mono text-[0.66rem] text-[#71717a] ml-2">
                ares.config.ts
              </span>
            </div>

            <button
              type="button"
              onClick={copyConfigSnippet}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-[0.65rem] font-mono text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
              title="Copier le snippet"
            >
              {copiedSnippet ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code Content */}
          <div className="p-4 sm:p-5 font-mono text-[0.72rem] sm:text-xs leading-relaxed text-[#d4d4d8] overflow-x-auto">
            <p>
              <span className="text-[#ff1e38]">const</span> <span className="text-amber-400">ares</span> = &#123;
            </p>
            <p className="pl-4">
              <span className="text-[#a1a1aa]">role:</span> <span className="text-emerald-400">"Full-Stack Developer &amp; Creative Builder"</span>,
            </p>
            <p className="pl-4">
              <span className="text-[#a1a1aa]">focus:</span> [<span className="text-emerald-400">"Streaming Media"</span>, <span className="text-emerald-400">"iOS Liquid Glass"</span>, <span className="text-emerald-400">"Reverse APIs"</span>, <span className="text-emerald-400">"SaaS"</span>],
            </p>
            <p className="pl-4">
              <span className="text-[#a1a1aa]">stack:</span> [<span className="text-cyan-400">"React 19"</span>, <span className="text-cyan-400">"TypeScript"</span>, <span className="text-cyan-400">"Next.js"</span>, <span className="text-cyan-400">"Swift"</span>, <span className="text-cyan-400">"Tailwind 4"</span>, <span className="text-cyan-400">"Docker"</span>],
            </p>
            <p className="pl-4">
              <span className="text-[#a1a1aa]">status:</span> <span className="text-emerald-400">"Shipping production software"</span>
            </p>
            <p>&#125;;</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero Bottom Group: Metrics & Tech strip */}
      <div className="relative z-10 w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-col items-center">
        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl mb-6 sm:mb-8"
        >
          {[
            {
              value: '10+',
              label: language === 'fr' ? 'Projets livrés' : 'Shipped Projects',
              desc: language === 'fr' ? 'Web, desktop & iOS' : 'Web, desktop & iOS',
            },
            {
              value: '< 50ms',
              label: language === 'fr' ? 'Latence APIs' : 'API Latency',
              desc: language === 'fr' ? 'Streaming & Reverse' : 'Streaming & Reverse',
            },
            {
              value: '120 FPS',
              label: language === 'fr' ? 'Fluidité visuelle' : 'UI Fluidity',
              desc: language === 'fr' ? 'Motion & Spring physics' : 'Motion & Springs',
            },
            {
              value: '100%',
              label: language === 'fr' ? 'Autonomie de livraison' : 'Solo Shipping',
              desc: language === 'fr' ? 'De l’idée au déploiement' : 'Idea to live release',
            },
          ].map((metric, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.15 }}
              className="p-4 sm:p-5 rounded-xl bg-[#09090b]/80 border border-white/[0.08] hover:border-[#ff1e38]/30 transition-colors text-left group cursor-default relative overflow-hidden backdrop-blur-sm"
            >
              <div className="font-display font-bold text-xl sm:text-2xl text-white mb-0.5 group-hover:text-[#ff1e38] transition-colors">
                {metric.value}
              </div>
              <div className="font-mono text-[0.66rem] text-white/90 uppercase tracking-wider font-semibold">
                {metric.label}
              </div>
              <div className="font-mono text-[0.6rem] text-[#71717a] mt-0.5">
                {metric.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.a
          href="#work"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center gap-2 text-[#71717a] hover:text-white transition-colors cursor-pointer select-none group mb-4"
          aria-label={language === 'fr' ? 'Défiler vers les projets' : 'Scroll to explore'}
        >
          <span className="font-mono text-[0.62rem] tracking-[0.24em] pl-[0.24em] uppercase group-hover:text-[#a1a1aa] transition-colors">
            {language === 'fr' ? 'DÉCOUVRIR LES PROJETS' : 'EXPLORE PROJECTS'}
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-3.5 h-6 rounded-full border border-white/[0.15] group-hover:border-[#ff1e38]/50 flex items-start justify-center p-1 transition-colors"
          >
            <div className="w-1 h-1.5 rounded-full bg-[#ff1e38]" />
          </motion.div>
        </motion.a>

        {/* Bottom Tech Bar */}
        <div className="w-full pt-4 border-t border-white/[0.08] flex items-center justify-center text-center font-mono">
          <div className="text-[#a1a1aa] text-[0.68rem] sm:text-xs tracking-wider uppercase">
            REACT 19 · TYPESCRIPT STRICT · NEXT.JS · SWIFT · LIQUID GLASS · DOCKER · TAILWIND 4
          </div>
        </div>
      </div>
    </section>
  );
};
