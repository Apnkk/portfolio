import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { GithubIcon } from './icons/BrandIcons';
import { 
  FolderGit2, 
  ExternalLink, 
  ArrowUpRight, 
  Activity, 
  Eye 
} from 'lucide-react';

export const ProjectsSection = () => {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'fullstack' | 'mobile' | 'ai' | 'tools'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filterTabs = [
    { id: 'all', label: language === 'fr' ? 'Tous les projets' : 'All Projects' },
    { id: 'fullstack', label: 'Full-Stack Web' },
    { id: 'mobile', label: language === 'fr' ? 'Mobile & App' : 'Mobile & Apps' },
    { id: 'ai', label: language === 'fr' ? 'IA & Automatisation' : 'AI & Systems' },
    { id: 'tools', label: language === 'fr' ? 'Outils & Systèmes' : 'Tools & Systems' },
  ];

  const filteredProjects = portfolioData.projects.filter((project) => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  return (
    <section id="projects" className="py-20 sm:py-28 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium mb-3">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'Réalisations & Code' : 'Featured Work'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {language === 'fr' ? 'Projets Récents & Cas d\'Usage' : 'Selected Projects & Case Studies'}
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-3">
          {language === 'fr'
            ? 'Applications concrètes en production, architectures scalables et code open source.'
            : 'Production applications, scalable software architectures, and open source tooling.'}
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`relative px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                filter === tab.id
                  ? 'text-white shadow-md'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              }`}
            >
              {filter === tab.id && (
                <motion.div
                  layoutId="activeFilterTab"
                  className="absolute inset-0 bg-white/10 border border-white/15 rounded-xl"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group relative rounded-3xl glass-panel p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
            >
              {/* Top ambient glow */}
              <div
                className={`absolute top-0 right-0 left-0 h-40 bg-gradient-to-b ${project.gradient} opacity-20 rounded-t-3xl pointer-events-none group-hover:opacity-35 transition-opacity`}
              />

              <div className="relative z-10">
                {/* Meta Badges */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
                      {project.categoryLabel[language]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 text-[11px] font-mono">
                      {project.statusLabel[language]}
                    </span>
                  </div>

                  {project.metrics && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <Activity className="w-3 h-3" />
                      {project.metrics[language]}
                    </span>
                  )}
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-cyan-400" />
                </h3>
                <p className="text-cyan-200/80 text-xs sm:text-sm font-medium mt-1">
                  {project.tagline[language]}
                </p>

                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mt-3">
                  {project.description[language]}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/8 text-[11px] font-mono text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="relative z-10 flex items-center justify-between mt-6 pt-5 border-t border-white/5">
                {/* View Details Button */}
                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all active:scale-[0.98]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Détails du projet' : 'Project Details'}</span>
                </button>

                {/* External Links */}
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors"
                      title={language === 'fr' ? 'Voir le code sur GitHub' : 'View Code'}
                      aria-label="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-cyan-300 border border-white/10 transition-colors"
                      title={language === 'fr' ? 'Voir le site en direct' : 'Live Preview'}
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
