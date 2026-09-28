import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { MapPin, Check } from 'lucide-react';

export const AboutSection = () => {
  const { language } = useLanguage();

  return (
    <section
      id="about"
      className="py-24 sm:py-32 px-5 sm:px-10 lg:px-16 max-w-6xl mx-auto text-left relative"
      aria-labelledby="about-title"
    >
      {/* Section Head */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            04 / BIOGRAPHIE &amp; PARCOURS
          </p>
        </div>
        <h2
          id="about-title"
          className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
        >
          {language === 'fr' ? 'À propos de moi' : 'Behind the Craft'}
        </h2>
      </div>

      {/* Editorial Narrative */}
      <div className="space-y-6 sm:space-y-8 font-display font-medium text-[clamp(1.15rem,2.2vw,1.75rem)] text-white leading-relaxed tracking-tight max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
        >
          {language === 'fr' ? (
            <>
              Je suis un développeur full-stack basé en France qui aborde chaque logiciel comme un véritable produit vivant. Je conçois et prototype rapidement pour valider l'expérience, puis j’industrialise rigoureusement : typage strict TypeScript, architectures modulaires, builds iOS propres et automatisation.
            </>
          ) : (
            <>
              I am a full-stack software engineer based in France who approaches every build as a living product. I prototype fast to validate real user experience, then engineer strictly: strict TypeScript, modular architectures, clean native iOS builds, and automated pipelines.
            </>
          )}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[#a1a1aa]"
        >
          {language === 'fr' ? (
            <>
              Mes créations se situent au confluent de la <strong className="text-white font-semibold">performance, des médias et du web moderne</strong> : plateforme e-commerce ShopCore, écosystème de streaming Z-Flix &amp; Z-Launcher, lecteur musical Z-Music, UI Liquid Glass pour Spoti.
            </>
          ) : (
            <>
              My work focuses on the intersection of <strong className="text-white font-semibold">performance, media streaming, and modern web</strong>: ShopCore subscription e-commerce, Z-Flix &amp; Z-Launcher streaming suite, Z-Music audio client, and Liquid Glass UI tweak for Spoti.
            </>
          )}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="text-[#71717a] text-[clamp(1rem,1.7vw,1.25rem)]"
        >
          {language === 'fr' ? (
            <>
              Sous le capot : <strong className="text-[#a1a1aa] font-medium">l’automatisation et l’ingénierie inverse</strong>. Rétro-ingénierie d’APIs, protocoles de contournement, synchronisation temps réel, caches distribués. Pas de blabla superficiel : du code propre qui fonctionne en conditions réelles.
            </>
          ) : (
            <>
              Underneath: <strong className="text-[#a1a1aa] font-medium">automation and reverse-engineering</strong>. Resilient API reverse, streaming protocols, realtime sync, and distributed caching. Clean code running in real-world production.
            </>
          )}
        </motion.p>
      </div>

      {/* Experience Milestones */}
      <div className="mt-16 sm:mt-24 space-y-6">
        <h3 className="font-mono text-xs text-[#71717a] font-semibold tracking-wider uppercase mb-6">
          // EXPÉRIENCES &amp; PROJETS MAJEURS
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {portfolioData.experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="p-6 sm:p-7 rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-[#ff1e38]/40 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
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

                <h4 className="font-display font-semibold text-lg text-white mb-1 group-hover:text-white transition-colors">
                  {exp.role[language]}
                </h4>
                <p className="text-xs text-[#ff1e38] font-mono mb-4">
                  {exp.company}
                </p>

                <p className="text-[#a1a1aa] text-xs leading-relaxed mb-4">
                  {exp.description[language]}
                </p>

                <ul className="space-y-2 mb-4">
                  {exp.achievements[language].map((item, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-2 text-xs text-[#d4d4d8]">
                      <Check className="w-3.5 h-3.5 text-[#ff1e38] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                {exp.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[0.66rem] font-mono text-[#71717a] group-hover:text-[#a1a1aa] transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
