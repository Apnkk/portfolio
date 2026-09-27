import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { MapPin, CheckCircle2 } from 'lucide-react';

export const AboutSection = () => {
  const { language } = useLanguage();

  return (
    <section
      id="about"
      className="py-20 sm:py-32 px-5 sm:px-10 md:px-14 max-w-6xl mx-auto text-left relative select-none"
      aria-labelledby="about-title"
    >
      {/* Section Head */}
      <header className="mb-12 sm:mb-20">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]" />
          <p className="mono text-[#ff1e38] font-semibold text-xs tracking-widest">
            05 / ABOUT
          </p>
        </div>
        <h2
          id="about-title"
          className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] text-[#f5f3ef] tracking-tight leading-none"
        >
          {language === 'fr' ? 'À propos de moi' : "Behind the Builds"}
        </h2>
      </header>

      {/* Editorial Narrative */}
      <div className="space-y-6 sm:space-y-8 font-display font-medium text-[clamp(1.1rem,2.4vw,1.85rem)] text-[#f5f3ef] leading-[1.4] tracking-tight">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          {language === 'fr' ? (
            <>
              Je suis un développeur full-stack basé en France qui aborde chaque projet comme un véritable produit vivant. Je conçois et prototype avec vélocité, puis j’industrialise rigoureusement : typage strict TypeScript, architectures scalables, builds iOS propres et pipelines d’automatisation.
            </>
          ) : (
            <>
              I'm a full-stack developer based in France who treats software like a living product. I build and prototype rapidly, then engineer strictly: strict TypeScript, scalable architectures, solid iOS builds, and automated delivery pipelines.
            </>
          )}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#b8b3a8]"
        >
          {language === 'fr' ? (
            <>
              Tout ce que je livre vit au croisement de la <strong className="text-[#ff1e38] font-medium">performance, du web moderne et des médias</strong> : plateforme e-commerce ShopCore, écosystème de streaming Z-Flix &amp; Z-Launcher, client musical Z-Music, UI Liquid Glass pour Spoti.
            </>
          ) : (
            <>
              Everything I ship lives at the intersection of <strong className="text-[#ff1e38] font-medium">performance, modern web, and media</strong>: ShopCore e-commerce marketplace, Z-Flix &amp; Z-Launcher streaming suite, Z-Music audio client, and Liquid Glass UI for Spoti.
            </>
          )}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-[#726d64] text-[clamp(1rem,1.8vw,1.35rem)]"
        >
          {language === 'fr' ? (
            <>
              Et sous le capot : <strong className="text-[#f5f3ef] font-medium">l'automatisation & l'ingénierie inverse</strong>. APIs résilientes, scraping intelligent, synchronisation temps réel, caches Redis. Si un système a des données ou des processus qui en valent la peine, c'est branché, testé et déployé.
            </>
          ) : (
            <>
              And underneath it all: <strong className="text-[#f5f3ef] font-medium">automation & reverse-engineering</strong>. Resilient APIs, smart scraping pipelines, realtime WebSockets sync, and multi-layer caching.
            </>
          )}
        </motion.p>
      </div>

      {/* Experience Milestones Cards */}
      <div className="mt-16 sm:mt-24 space-y-6">
        <h3 className="mono text-xs text-[#ff1e38] font-semibold tracking-wider mb-6">
          // PARCOURS &amp; EXPÉRIENCES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioData.experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="oled-card p-6 sm:p-7 flex flex-col justify-between"
            >
              <div className="vu-bar" aria-hidden="true" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="mono text-xs text-[#ff1e38] font-bold">
                    {exp.period[language]}
                  </span>
                  <span className="mono text-[0.66rem] text-[#726d64] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {exp.location}
                  </span>
                </div>

                <h4 className="font-display font-bold text-xl sm:text-2xl text-[#f5f3ef] mb-1">
                  {exp.role[language]}
                </h4>
                <p className="text-xs sm:text-sm text-[#ff1e38] font-mono mb-4">
                  {exp.company}
                </p>

                <p className="text-[#b8b3a8] text-xs sm:text-sm leading-relaxed mb-4">
                  {exp.description[language]}
                </p>

                <ul className="space-y-2 mb-4">
                  {exp.achievements[language].map((item, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2 text-xs text-[#c2bdb3]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ff1e38] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                {exp.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[0.66rem] font-mono text-[#726d64]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Focus & Interests Tags */}
      <div className="mt-12 sm:mt-16 p-6 sm:p-8 oled-card">
        <h4 className="mono text-xs text-[#726d64] uppercase tracking-wider mb-4 font-semibold">
          {language === 'fr' ? 'Domaines de prédilection' : 'Areas of Passion'}
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {portfolioData.interests[language].map((interest, iIdx) => (
            <span
              key={iIdx}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#ff1e38]/15 hover:border-[#ff1e38]/40 border border-white/[0.08] font-mono text-xs text-[#f5f3ef] transition-colors"
            >
              ✦ {interest}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
