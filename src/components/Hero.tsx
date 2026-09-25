import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { 
  ArrowDown, 
  Copy, 
  Check, 
  Sparkles, 
  Code2,
  Terminal,
  Zap,
  Smartphone,
  Layers,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Hero = () => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopied(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#8b5cf6', '#3b82f6']
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const stackPills = [
    { label: "React 19", icon: Code2, color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" },
    { label: "Next.js 15", icon: Zap, color: "text-white border-white/20 bg-white/5" },
    { label: "TypeScript", icon: Terminal, color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
    { label: "React Native", icon: Smartphone, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
    { label: "Node & FastAPI", icon: Layers, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
    { label: "PostgreSQL & Supabase", icon: Database, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5" },
  ];

  return (
    <section id="hero" className="relative pt-32 sm:pt-40 pb-20 md:pb-28 px-4 max-w-5xl mx-auto flex flex-col items-center text-center">
      {/* Availability Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium mb-6 sm:mb-8 shadow-sm shadow-emerald-500/10 hover:border-emerald-500/40 transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>{portfolioData.personal.availability.text[language]}</span>
      </motion.div>

      {/* Main Fluid Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fluid-h1 font-black tracking-tight text-white max-w-4xl"
      >
        {language === 'fr' ? (
          <>
            Concevoir des produits <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">web & mobiles</span> d'exception.
          </>
        ) : (
          <>
            Architecting scalable <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">web & mobile</span> software.
          </>
        )}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fluid-sub text-neutral-400 mt-6 max-w-2xl font-normal"
      >
        {portfolioData.personal.shortBio[language]}
      </motion.p>

      {/* Call to Actions & Copy Email */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-8 sm:mt-10"
      >
        {/* Explore Projects Button */}
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-950 font-semibold text-sm hover:bg-neutral-100 transition-all duration-150 active:scale-[0.98] shadow-lg shadow-white/10 group"
        >
          <span>{language === 'fr' ? 'Explorer les projets' : 'View Projects'}</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </a>

        {/* Contact CTA */}
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-white font-medium text-sm border border-white/10 hover:border-white/20 transition-all duration-150 active:scale-[0.98] backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{language === 'fr' ? 'Me contacter' : 'Get in touch'}</span>
        </a>

        {/* Copy Email Button with instant feedback */}
        <button
          onClick={copyEmail}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 font-mono text-xs border border-white/10 hover:border-cyan-500/40 transition-all duration-150 active:scale-[0.98]"
          title={language === 'fr' ? "Copier l'adresse email" : 'Copy email address'}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">{language === 'fr' ? 'Email copié !' : 'Copied!'}</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-neutral-400" />
              <span>{portfolioData.personal.email}</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Floating Tech Stack Ticker / Badges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-14 sm:mt-16 w-full"
      >
        <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 mb-4">
          {language === 'fr' ? 'Stack technique de pointe' : 'Core Technologies & Tools'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto">
          {stackPills.map((pill) => {
            const Icon = pill.icon;
            return (
              <div
                key={pill.label}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono font-medium backdrop-blur-sm transition-transform hover:scale-105 duration-150 ${pill.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{pill.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};
