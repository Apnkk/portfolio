import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  CheckCircle2, 
  Milestone 
} from 'lucide-react';

export const ExperienceSection = () => {
  const { language } = useLanguage();

  return (
    <section id="experience" className="py-20 sm:py-28 px-4 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium mb-3">
          <Milestone className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'Expériences & Formation' : 'Career & Education'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {language === 'fr' ? 'Parcours Professionnel' : 'Experience & Background'}
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-3">
          {language === 'fr'
            ? 'Mon évolution technique à travers des projets ambitieux et des équipes d’ingénierie dynamiques.'
            : 'My technical growth through high-impact products and dynamic engineering teams.'}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-white/10 ml-4 sm:ml-8 space-y-12 sm:space-y-14">
        {portfolioData.experiences.map((item, index) => {
          const isWork = item.type === 'work';
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-6 sm:pl-10 group"
            >
              {/* Timeline Marker Node */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#0a0a0f] border-2 border-cyan-500 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-500/20 group-hover:scale-110 group-hover:border-white transition-all">
                {isWork ? <Briefcase className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
              </div>

              {/* Experience Card */}
              <div className="p-6 sm:p-7 rounded-3xl glass-panel group-hover:border-cyan-500/40 transition-all duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-medium">
                      {item.period[language]}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {isWork ? (language === 'fr' ? 'Expérience Pro' : 'Work Experience') : (language === 'fr' ? 'Formation' : 'Education')}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.role[language]}
                </h3>
                <h4 className="text-sm font-semibold text-neutral-300 mb-3">
                  {item.company}
                </h4>

                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-4">
                  {item.description[language]}
                </p>

                {/* Achievements List */}
                <div className="space-y-2 mb-5">
                  {item.achievements[language].map((achievement, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-lg bg-white/[0.03] border border-white/8 text-[11px] font-mono text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
