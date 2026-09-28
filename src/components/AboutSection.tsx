import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { MapPin } from 'lucide-react';

export const AboutSection = () => {
  const { language } = useLanguage();

  return (
    <section
      id="about"
      className="py-24 sm:py-32 px-5 sm:px-10 lg:px-16 max-w-6xl mx-auto text-left relative"
      aria-labelledby="about-title"
    >
      {/* Section Head */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            04 / BIOGRAPHIE &amp; PARCOURS
          </p>
        </div>
        <h2
          id="about-title"
          className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight mb-6"
        >
          {language === 'fr' ? 'À propos' : 'About'}
        </h2>

        {/* Short, Punchy Bio (No essay) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="font-display font-medium text-[clamp(1.15rem,2.2vw,1.6rem)] text-white leading-relaxed tracking-tight max-w-2xl mx-auto text-balance"
        >
          {language === 'fr' ? (
            <>
              Développeur full-stack basé en France. Je conçois des produits web, des clients iOS et des architectures logicielles axés sur la vitesse, l'automatisation et la simplicité.
            </>
          ) : (
            <>
              Full-stack software engineer based in France. I build web platforms, native iOS tools, and systems architectures focused on speed, automation, and craft.
            </>
          )}
        </motion.p>
      </div>

      {/* Experience Milestones - Clean & Scannable */}
      <div className="space-y-6">
        <h3 className="font-mono text-xs text-[#71717a] font-semibold tracking-wider uppercase mb-6 text-center sm:text-left">
          // EXPÉRIENCES &amp; PARCOURS
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {portfolioData.experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-[#ff1e38]/40 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
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

                <h4 className="font-display font-semibold text-lg text-white mb-1">
                  {exp.role[language]}
                </h4>
                <p className="text-xs text-[#a1a1aa] font-mono mb-3">
                  {exp.company}
                </p>

                <p className="text-[#a1a1aa] text-xs leading-relaxed mb-4">
                  {exp.description[language]}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/[0.06]">
                {exp.technologies.slice(0, 4).map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[0.65rem] font-mono text-[#71717a] group-hover:text-[#a1a1aa] transition-colors"
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
