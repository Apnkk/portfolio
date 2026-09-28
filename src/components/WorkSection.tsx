import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';
import { TiltCard } from './motion/TiltCard';
import { BorderBeam } from './motion/BorderBeam';

interface ProjectCardProps {
  project: Project;
  isWide: boolean;
  idx: number;
  onOpenModal: (project: Project) => void;
}

const ProjectCard = ({ project, isWide, idx, onOpenModal }: ProjectCardProps) => {
  const { language } = useLanguage();
  const colSpan = isWide ? 'lg:col-span-6' : 'lg:col-span-4';
  const hasBorderBeam = idx < 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={colSpan}
    >
      <TiltCard
        scale={1.015}
        spotlightColor="rgba(255, 30, 56, 0.12)"
        className="group h-full rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-colors duration-300 flex flex-col justify-between overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
      >
        {/* Animated laser border beam on top 2 primary products */}
        {hasBorderBeam && (
          <BorderBeam
            duration={10 + idx * 3}
            borderWidth={1.5}
            colorFrom="#ff1e38"
            colorTo="rgba(255, 30, 56, 0.25)"
          />
        )}

        {/* Top Viewport / Image Container */}
        <div
          onClick={() => onOpenModal(project)}
          className="relative aspect-[16/10] overflow-hidden bg-black cursor-pointer group/img"
        >
          {project.video ? (
            <video
              src={project.video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center filter brightness-[0.95] group-hover/img:scale-[1.04] transition-all duration-500 ease-out"
            />
          ) : project.image ? (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-[0.94] group-hover/img:scale-[1.04] group-hover/img:brightness-100 transition-all duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-[#71717a] font-mono text-xs">
              {project.title}
            </div>
          )}

          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/30 pointer-events-none" />

          {/* Top Badges: Category & Metrics */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
            <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/[0.1] text-white font-mono text-[0.66rem] tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
              {project.categoryLabel[language]}
            </span>

            {project.metrics && (
              <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/[0.1] text-[#d4d4d8] font-mono text-[0.66rem] tracking-wide shadow-sm">
                {project.metrics[language]}
              </span>
            )}
          </div>
        </div>

        {/* Card Details */}
        <div className="p-6 flex flex-col justify-between flex-1 relative z-20">
          <div>
            {/* Status and Year Indicator */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-mono text-[0.68rem] text-[#a1a1aa] uppercase tracking-wider">
                  {project.statusLabel[language]}
                </span>
              </div>

              {project.year && (
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono text-[0.68rem] text-[#a1a1aa] font-medium tracking-wider">
                  {project.year}
                </span>
              )}
            </div>

            {/* Title with spring hover */}
            <h3
              onClick={() => onOpenModal(project)}
              className="font-display font-semibold text-2xl text-white tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>{project.title}</span>
              <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-[#ff1e38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </h3>

            {/* Description */}
            <p className="text-[#a1a1aa] text-sm mt-2.5 leading-relaxed font-normal">
              {project.tagline[language]}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.tags.slice(0, 4).map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[0.65rem] text-[#d4d4d8] hover:border-white/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Actions with tactile clicks */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/[0.06]">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onOpenModal(project)}
              className="flex-1 py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white font-mono text-[0.7rem] uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
            >
              <span>{language === 'fr' ? 'Détails' : 'Case Study'}</span>
            </motion.button>

            {project.liveUrl && (
              <motion.a
                whileTap={{ scale: 0.92 }}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-white transition-colors"
                title={language === 'fr' ? 'Visiter le site en ligne' : 'Visit live platform'}
              >
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            )}

            {project.githubUrl && (
              <motion.a
                whileTap={{ scale: 0.92 }}
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-white transition-colors"
                title="Code GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </motion.a>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

export const WorkSection = () => {
  const { language } = useLanguage();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section
      id="work"
      className="py-24 sm:py-32 px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto text-left relative"
      aria-labelledby="work-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            {language === 'fr' ? 'PROJETS & LOGICIELS' : 'FEATURED PROJECTS'}
          </p>
        </div>
        <h2
          id="work-heading"
          className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
        >
          {language === 'fr' ? (
            <>
              Travaux récents <span className="text-[#ff1e38]">&amp;</span> logiciels
            </>
          ) : (
            <>
              Featured work <span className="text-[#ff1e38]">&amp;</span> software
            </>
          )}
        </h2>
        <p className="text-[#a1a1aa] text-sm mt-3 max-w-md font-normal leading-relaxed">
          {language === 'fr'
            ? 'Sélection de logiciels et applications déployés en production.'
            : 'Selected production-tested software and applications.'}
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
        {portfolioData.projects.map((project, idx) => {
          const isWide = idx < 2;
          return (
            <ProjectCard
              key={project.id}
              project={project}
              isWide={isWide}
              idx={idx}
              onOpenModal={(p) => setActiveProject(p)}
            />
          );
        })}
      </div>

      {/* Project Detail Modal */}
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
