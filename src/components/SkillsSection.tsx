import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { 
  Wrench, 
  Layout, 
  Server, 
  Smartphone, 
  Cloud, 
  Cpu, 
  Zap
} from 'lucide-react';

export const SkillsSection = () => {
  const { language } = useLanguage();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('frontend');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-4 h-4" />;
      case 'Server':
        return <Server className="w-4 h-4" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'Cloud':
        return <Cloud className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      default:
        return <Wrench className="w-4 h-4" />;
    }
  };

  const activeCategory =
    portfolioData.skills.find((c) => c.id === activeCategoryId) || portfolioData.skills[0];

  return (
    <section id="skills" className="py-20 sm:py-28 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono font-medium mb-3">
          <Wrench className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'Stack & Savoir-faire' : 'Stack & Competencies'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {language === 'fr' ? 'Compétences Techniques & Outils' : 'Technical Skills & Tooling'}
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-3">
          {language === 'fr'
            ? 'Maîtrise approfondie des technologies modernes pour concevoir des applications résilientes et véloces.'
            : 'Deep proficiency across modern technologies to engineer resilient, lightning-fast applications.'}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        {portfolioData.skills.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategoryId(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? 'bg-indigo-500/15 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/15'
                  : 'bg-white/[0.03] border-white/8 text-neutral-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className={isActive ? 'text-cyan-400' : 'text-neutral-400'}>
                {getIcon(category.icon)}
              </span>
              <span>{category.title[language]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Skills Grid */}
      <motion.div
        key={activeCategoryId}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
      >
        {activeCategory.skills.map((skill, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl glass-panel relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </span>
                {skill.tag && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                    {skill.tag}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-neutral-400 font-semibold">
                {skill.level}%
              </span>
            </div>

            {/* Progress Bar with Glow */}
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 relative"
              >
                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/40 blur-[2px]" />
              </motion.div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Tooling Manifesto Callout */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-left">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white mb-1">
            {language === 'fr' ? 'Standards de qualité & écosystème' : 'Engineering Standard & Ecosystem'}
          </h4>
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            {language === 'fr'
              ? 'Typage strict TypeScript, découpage d’état précis (Server vs Client state), conformité accessibilité WCAG 2.2 AA, et tests automatisés pour livrer du code durable.'
              : 'Strict TypeScript typing, separated server/client state architecture, WCAG 2.2 AA accessibility compliance, and automated test suites for durable delivery.'}
          </p>
        </div>
      </div>
    </section>
  );
};
