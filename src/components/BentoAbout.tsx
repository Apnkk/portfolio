import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { 
  User, 
  MapPin, 
  Clock, 
  Sparkles, 
  Activity, 
  Compass, 
  Cpu, 
  CheckCircle2
} from 'lucide-react';

export const BentoAbout = () => {
  const { language } = useLanguage();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('fr-FR', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-16 sm:py-24 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'À propos de moi' : 'About Me'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {language === 'fr' ? 'Ingénieur logiciel & Créateur numérique' : 'Software Engineer & Digital Craftsman'}
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-3">
          {language === 'fr'
            ? "Concevoir des expériences numériques remarquables, de l'architecture serveur aux micro-interactions pixel-perfect."
            : 'Crafting remarkable digital experiences, from resilient backend architectures to pixel-perfect micro-interactions.'}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Card 1: Core Story (Large 2 Cols x 2 Rows on Desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 lg:col-span-2 md:row-span-2 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col justify-between group hover:border-cyan-500/40 transition-colors"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-cyan-500/15 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400/80 px-2.5 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/15">
                {language === 'fr' ? 'Philosophie' : 'Philosophy'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4">
              {language === 'fr'
                ? "L'obsession de la clarté, de la vitesse et de l'élégance."
                : 'Obsessed with clarity, speed, and refined elegance.'}
            </h3>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-4">
              {portfolioData.personal.fullBio[language]}
            </p>

            <p className="text-neutral-400 text-sm leading-relaxed">
              {language === 'fr'
                ? "Chaque ligne de code est écrite pour être maintenable, testable et performante. Je refuse les compromis entre une UX captivante et une base technique saine."
                : 'Every line of code is crafted to be maintainable, testable, and blazing fast. I refuse to compromise between captivating UX and solid engineering.'}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Clean Architecture
            </span>
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Design System
            </span>
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Web Vitals 100
            </span>
          </div>
        </motion.div>

        {/* Card 2: Interactive Paris Local Time & Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1 lg:col-span-2 p-6 rounded-3xl glass-panel relative overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CET (UTC+1)</span>
            </div>
          </div>

          <div className="my-4">
            <div className="text-neutral-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>{language === 'fr' ? 'Heure Locale (Paris)' : 'Local Time (Paris)'}</span>
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-wider text-purple-200">
              {time || '--:--:--'}
            </div>
            <p className="text-neutral-400 text-xs mt-2">
              {portfolioData.personal.location}
            </p>
          </div>

          <div className="text-xs text-neutral-500 border-t border-white/5 pt-3">
            {language === 'fr'
              ? '🌍 Collaboration fluide à distance avec les équipes internationales.'
              : '🌍 Seamless remote collaboration across global teams.'}
          </div>
        </motion.div>

        {/* Card 3: Interactive Stats (Grid of 4) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1 lg:col-span-2 p-6 rounded-3xl glass-panel relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              {language === 'fr' ? 'Indicateurs clés' : 'Key Metrics'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 my-auto">
            {portfolioData.stats.map((stat, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="font-mono text-xl sm:text-2xl font-black text-white tracking-tight bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-neutral-300 mt-0.5">
                  {stat.label[language]}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  {stat.subtext[language]}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card 4: Interests & Current Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-3 lg:col-span-4 p-6 sm:p-7 rounded-3xl glass-panel relative overflow-hidden hover:border-indigo-500/40 transition-colors"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {language === 'fr' ? 'Veille active & Domaines de recherche actuels' : 'Current Research & Active Exploration'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {language === 'fr' ? 'Toujours en train de tester les dernières avancées du secteur' : 'Always testing edge technology advancements'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-4">
            {portfolioData.interests[language].map((interest, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/40 text-neutral-300 hover:text-white text-xs font-medium transition-all duration-150 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>{interest}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
