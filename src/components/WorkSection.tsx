import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { ExternalLink, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';

export const WorkSection = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: language === 'fr' ? 'Tous les projets' : 'All Projects' },
    { id: 'fullstack', label: language === 'fr' ? 'Full-Stack & E-Com' : 'Full-Stack & E-Com' },
    { id: 'streaming', label: language === 'fr' ? 'Streaming & Médias' : 'Streaming & Media' },
    { id: 'tools', label: language === 'fr' ? 'Desktop & iOS' : 'Desktop & iOS' },
  ];

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return portfolioData.projects;
    if (selectedCategory === 'streaming') {
      return portfolioData.projects.filter(
        (p) => p.id === 'zflix-desktop' || p.id === 'zmusic'
      );
    }
    if (selectedCategory === 'fullstack') {
      return portfolioData.projects.filter((p) => p.id === 'shopcore');
    }
    if (selectedCategory === 'tools') {
      return portfolioData.projects.filter(
        (p) => p.id === 'zflix-launcher' || p.id === 'spoti-liquid-glass'
      );
    }
    return portfolioData.projects;
  }, [selectedCategory]);

  return (
    <section
      id="work"
      className="py-20 sm:py-32 px-5 sm:px-10 md:px-14 max-w-7xl mx-auto text-left relative"
      aria-labelledby="work-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]" />
            <p className="mono text-[#ff1e38] font-semibold text-xs tracking-widest">
              01 / SHOWCASE
            </p>
          </div>
          <h2
            id="work-heading"
            className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] text-[#f5f3ef] tracking-tight leading-none"
          >
            {language === 'fr' ? (
              <>
                Projets récents <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> live
              </>
            ) : (
              <>
                Featured work <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> live
              </>
            )}
          </h2>
          <p className="text-[#b8b3a8] text-sm sm:text-base mt-3 max-w-lg font-normal leading-relaxed">
            {language === 'fr'
              ? 'Des applications complètes, de la conception à la mise en production, testées et utilisées en conditions réelles.'
              : 'End-to-end applications from architecture to production, deployed and running in the wild.'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-xl">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-3.5 py-1.5 rounded-xl font-mono text-[0.72rem] tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'text-white font-bold bg-[#ff1e38] shadow-[0_0_15px_rgba(255,30,56,0.5)]'
                    : 'text-[#726d64] hover:text-[#f5f3ef] hover:bg-white/[0.04]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, idx) => {
            // Featured large cards for top projects
            const isWide = idx === 0 || idx === 1;
            const colSpan = isWide ? 'lg:col-span-6' : 'lg:col-span-4';

            return (
              <motion.article
                layout
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className={`${colSpan} group relative rounded-3xl bg-[#06060a] border border-white/[0.08] hover:border-[#ff1e38]/50 transition-all duration-500 overflow-hidden flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_15px_50px_rgba(255,30,56,0.15)] will-change-transform`}
              >
                {/* Crimson Laser Hover Bar */}
                <div className="vu-bar" aria-hidden="true" />

                {/* Card Top / Visual Viewport */}
                <div
                  onClick={() => setActiveProject(project)}
                  className="relative aspect-[16/10] overflow-hidden bg-black/90 cursor-pointer group/img"
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.05] group-hover/img:scale-105 group-hover/img:brightness-100 transition-all duration-700 will-change-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c0c14] to-black text-[#ff1e38]">
                      <Layers className="w-12 h-12 opacity-40" />
                    </div>
                  )}

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-transparent to-black/40 pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/[0.1] text-[#f5f3ef] font-mono text-[0.66rem] tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
                      {project.categoryLabel[language]}
                    </span>

                    {project.metrics && (
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/[0.1] text-[#b8b3a8] font-mono text-[0.66rem] tracking-wider">
                        {project.metrics[language]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                  <div>
                    {/* Status Pill */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="mono text-[0.68rem] text-[#ff1e38] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ff1e38]" />
                        {project.statusLabel[language]}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setActiveProject(project)}
                      className="font-display font-bold text-2xl sm:text-3xl text-[#f5f3ef] tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-[#726d64] group-hover:text-[#ff1e38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h3>

                    {/* Tagline */}
                    <p className="text-[#b8b3a8] text-sm mt-2.5 line-clamp-2 leading-relaxed">
                      {project.tagline[language]}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[0.65rem] text-[#c2bdb3]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => setActiveProject(project)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-[#ff1e38] hover:text-white text-[#f5f3ef] font-mono text-[0.7rem] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>{language === 'fr' ? 'Détails & Code' : 'Deep Dive'}</span>
                    </button>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#b8b3a8] hover:text-[#ff1e38] transition-colors"
                        title={language === 'fr' ? 'Visiter le site' : 'Open live preview'}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#b8b3a8] hover:text-white transition-colors"
                        title="Dépôt GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
