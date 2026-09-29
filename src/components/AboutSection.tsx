import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight
} from 'lucide-react';
import { TiltCard } from './motion/TiltCard';

export const AboutSection = () => {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [parisTime, setParisTime] = useState('');

  // Live Paris Time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('fr-FR', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setParisTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
      className="scroll-mt-24 sm:scroll-mt-28 py-24 sm:py-32 px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto text-left relative"
      aria-labelledby="about-title"
    >
      {/* Section Head */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            {language === 'fr' ? 'PARCOURS & PHILOSOPHIE' : 'ABOUT & BACKGROUND'}
          </p>
        </div>
        <h2
          id="about-title"
          className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
        >
          {language === 'fr' ? (
            <>
              Créateur de produits <span className="text-[#ff1e38]">&amp;</span> ingénieur
            </>
          ) : (
            <>
              Product builder <span className="text-[#ff1e38]">&amp;</span> software engineer
            </>
          )}
        </h2>
        <p className="text-[#a1a1aa] text-sm sm:text-base mt-3 max-w-xl font-normal leading-relaxed">
          {language === 'fr'
            ? 'Une approche orientée produit, vitesse d’exécution et rigueur architecturale.'
            : 'Product-driven execution with strict engineering fundamentals.'}
        </p>
      </div>

      {/* Bento About Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
        {/* Card 1: Core Bio & Philosophy (8 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] flex flex-col justify-between shadow-2xl relative overflow-hidden group"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full bg-[#ff1e38]/10 text-[#ff1e38] font-mono text-xs font-semibold">
                BIO
              </span>
              <span className="font-mono text-xs text-[#71717a]">
                Ares · Full-Stack Builder
              </span>
            </div>

            <h3 className="font-display font-semibold text-2xl sm:text-3xl text-white tracking-tight mb-4">
              {language === 'fr' ? (
                <>
                  « Je traite chaque projet comme un produit vivant. Pas de blabla inutile, du code qui tourne en prod. »
                </>
              ) : (
                <>
                  "I treat every build like a living product. No corporate fluff, just code running in production."
                </>
              )}
            </h3>

            <p className="text-[#a1a1aa] text-sm sm:text-base leading-relaxed font-normal mb-4">
              {portfolioData.personal.fullBio[language]}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/[0.08] font-mono text-xs">
            <div className="p-3 rounded-2xl bg-white/[0.02]">
              <span className="text-[#71717a] block text-[0.65rem] uppercase">Mindset</span>
              <span className="text-white font-semibold">Produit d'abord</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02]">
              <span className="text-[#71717a] block text-[0.65rem] uppercase">Qualité</span>
              <span className="text-[#ff1e38] font-semibold">TypeScript Strict</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.02]">
              <span className="text-[#71717a] block text-[0.65rem] uppercase">Rendu</span>
              <span className="text-emerald-400 font-semibold">120 FPS Fluidity</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Live Paris Clock & Location (4 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#09090b] border border-white/[0.08] flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[#d4d4d8] font-mono text-xs">
                LOCATION &amp; TIME
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[0.68rem]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </span>
            </div>

            <div className="my-4">
              <div className="font-mono text-3xl sm:text-4xl font-bold text-white tracking-wider">
                {parisTime || '12:00:00'}
              </div>
              <p className="font-mono text-xs text-[#71717a] mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ff1e38]" />
                <span>Europe/Paris (CET / UTC+1)</span>
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/[0.08] font-mono text-xs text-[#a1a1aa]">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#ff1e38]" />
                <span className="text-white">France (Remote friendly)</span>
              </p>
              <p className="text-[0.72rem] text-[#71717a]">
                {language === 'fr' 
                  ? 'Disponible pour collaborations, missions freelance ou projets ambitieux.'
                  : 'Open for engineering contracts, client software, and ambitious builds.'}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.08]">
            <a
              href="#contact"
              className="w-full btn btn--ghost py-2.5 text-xs flex items-center justify-center gap-2"
            >
              <span>{language === 'fr' ? 'Démarrer une discussion' : 'Start a Conversation'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Experience Milestones */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-mono text-xs text-[#71717a] font-semibold tracking-wider uppercase">
            {language === 'fr' ? 'EXPÉRIENCES & JALONS MAJEURS' : 'CAREER & KEY MILESTONES'}
          </h3>
          <span className="font-mono text-xs text-[#71717a]">
            2023 — 2026
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {portfolioData.experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                type: 'spring',
                visualDuration: 0.45,
                bounce: 0.12,
                delay: shouldReduceMotion ? 0 : idx * 0.08,
              }}
            >
              <TiltCard
                scale={1.02}
                spotlightColor="rgba(255, 30, 56, 0.14)"
                className="p-6 sm:p-7 rounded-3xl bg-[#09090b] border border-white/[0.08] hover:border-[#ff1e38]/40 transition-colors flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.6)] group h-full"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs text-[#ff1e38] font-bold tracking-wider">
                      {exp.period[language]}
                    </span>
                    <span className="font-mono text-[0.68rem] text-[#71717a] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </span>
                  </div>

                  <h4 className="font-display font-semibold text-xl text-white mb-1 group-hover:text-[#ff1e38] transition-colors">
                    {exp.role[language]}
                  </h4>
                  <p className="text-xs text-[#a1a1aa] font-mono mb-3">
                    {exp.company}
                  </p>

                  <p className="text-[#a1a1aa] text-xs sm:text-sm leading-relaxed mb-4 font-normal">
                    {exp.description[language]}
                  </p>

                  {/* Key Achievements */}
                  {exp.achievements && (
                    <ul className="space-y-1.5 mb-5 font-sans text-xs text-[#d4d4d8]">
                      {exp.achievements[language].map((ach, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ff1e38] shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                  {exp.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] text-[0.66rem] font-mono text-[#71717a] group-hover:text-[#d4d4d8] transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
