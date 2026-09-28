import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';

interface ProjectCardProps {
  project: Project;
  isWide: boolean;
  idx: number;
  onOpenModal: (project: Project) => void;
}

const ProjectCard = ({ project, isWide, idx, onOpenModal }: ProjectCardProps) => {
  const { language } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const colSpan = isWide ? 'lg:col-span-6' : 'lg:col-span-4';

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`${colSpan} group relative rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.6)]`}
    >
      {/* Interactive mouse-tracking spotlight (Linear / Web Design Flow) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
        style={{
          background: isHovered
            ? `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 30, 56, 0.12), transparent 70%)`
            : undefined,
        }}
        aria-hidden="true"
      />

      {/* Top Viewport / Image Container */}
      <div
        onClick={() => onOpenModal(project)}
        className="relative aspect-[16/10] overflow-hidden bg-black cursor-pointer group/img"
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top filter brightness-[0.92] group-hover/img:scale-[1.04] group-hover/img:brightness-100 transition-all duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-[#71717a] font-mono text-xs">
            {project.title}
          </div>
        )}

        {/* Subtle vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges: Category, Real Year, Metrics */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/[0.1] text-white font-mono text-[0.66rem] tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
              {project.categoryLabel[language]}
            </span>

            {project.year && (
              <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/[0.1] text-[#e4e4e7] font-mono text-[0.66rem] font-semibold tracking-wider shadow-sm">
                {project.year}
              </span>
            )}
          </div>

          {project.metrics && (
            <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/[0.1] text-[#a1a1aa] font-mono text-[0.66rem] tracking-wide shadow-sm">
              {project.metrics[language]}
            </span>
          )}
        </div>
      </div>

      {/* Card Details */}
      <div className="p-6 flex flex-col justify-between flex-1 relative z-20">
        <div>
          {/* Status and Year Indicator */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[0.68rem] text-[#a1a1aa] uppercase tracking-wider">
                {project.statusLabel[language]}
              </span>
            </div>

            {project.year && (
              <span className="font-mono text-[0.68rem] text-[#71717a] font-medium">
                {project.year}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenModal(project)}
            className="font-display font-semibold text-2xl text-white tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center justify-between"
          >
            <span>{project.title}</span>
            <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-[#ff1e38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </h3>

          {/* Description */}
          <p className="text-[#a1a1aa] text-sm mt-2.5 line-clamp-2 leading-relaxed">
            {project.tagline[language]}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tags.slice(0, 4).map((tag, tIdx) => (
              <span
                key={tIdx}
                className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[0.65rem] text-[#d4d4d8]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={() => onOpenModal(project)}
            className="flex-1 py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white font-mono text-[0.7rem] uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
          >
            <span>{language === 'fr' ? 'Détails' : 'Case Study'}</span>
          </button>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-white transition-colors"
              title={language === 'fr' ? 'Visiter le site en ligne' : 'Visit live platform'}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-white transition-colors"
              title="Code GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
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
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            01 / PROJETS
          </p>
        </div>
        <h2
          id="work-heading"
          className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
        >
          {language === 'fr' ? (
            <>
              Travaux récents <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> logiciels en production
            </>
          ) : (
            <>
              Featured work <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> production software
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
