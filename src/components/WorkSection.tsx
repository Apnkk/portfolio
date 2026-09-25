import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';

interface ProjectRowItemProps {
  project: Project;
  idx: number;
  onSelect: (project: Project) => void;
}

const ProjectRowItem = ({ project, idx, onSelect }: ProjectRowItemProps) => {
  const { language } = useLanguage();
  const rowRef = useRef<HTMLElement>(null);

  // Scrollytelling Parallax tracking for this individual project card
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });

  // Parallax camera track inside the image viewport (like a moving window)
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);

  // Subtle 3D physical pitch on desktop
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0, -2]);

  const getVisualGradients = (category: string) => {
    switch (category) {
      case 'ai':
        return {
          bg: 'radial-gradient(ellipse 80% 90% at 75% 15%, rgba(242, 163, 60, 0.25), transparent 60%), linear-gradient(140deg, #1a1409, #0c0a07 70%)',
          accent: '#f2a33c',
        };
      case 'mobile':
        return {
          bg: 'radial-gradient(ellipse 80% 90% at 25% 85%, rgba(61, 214, 140, 0.2), transparent 60%), linear-gradient(220deg, #0d1912, #070c0a 70%)',
          accent: '#3dd68c',
        };
      case 'fullstack':
        return {
          bg: 'radial-gradient(ellipse 80% 90% at 70% 80%, rgba(255, 61, 46, 0.2), transparent 60%), linear-gradient(160deg, #1a0f0d, #0c0807 70%)',
          accent: '#ff3d2e',
        };
      default:
        return {
          bg: 'radial-gradient(ellipse 80% 90% at 50% 50%, rgba(99, 102, 241, 0.2), transparent 60%), linear-gradient(140deg, #12101c, #0a0910 70%)',
          accent: '#818cf8',
        };
    }
  };

  const getRomanNumber = (i: number) => {
    const nums = ['①', '②', '③', '④', '⑤', '⑥'];
    return nums[i] || `[0${i + 1}]`;
  };

  const { bg } = getVisualGradients(project.category);

  return (
    <motion.article
      ref={rowRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: idx * 0.05 }}
      className="py-7 sm:py-14 group will-change-transform"
      style={{ perspective: 1200 }}
    >
      {/* Row Header with Huge Interactive Title - Mobile Scaled */}
      <div
        onClick={() => onSelect(project)}
        className="cursor-pointer flex items-baseline justify-between gap-3 sm:gap-8 group-hover:text-[#f2a33c] transition-colors select-none"
      >
        <div className="flex items-baseline gap-3 sm:gap-6 min-w-0">
          <span className="mono text-base sm:text-xl text-[#837e6f] group-hover:text-[#f2a33c] transition-colors shrink-0">
            {getRomanNumber(idx)}
          </span>
          <h3 className="font-display font-semibold text-[clamp(1.7rem,5.5vw,5.2rem)] text-[#ede8dd] tracking-tight leading-none group-hover:translate-x-2 transition-all duration-300 truncate">
            {project.title}
          </h3>
        </div>
        <span className="text-lg sm:text-3xl text-[#837e6f] group-hover:text-[#f2a33c] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0">
          ↗
        </span>
      </div>

      {/* Row Body: 3D Visual Card on Left + Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-12 mt-5 sm:mt-8 items-start">
        {/* Visual Art Preview Card (3D Tilt on desktop & clean frame on mobile) */}
        <motion.div
          style={{ rotateX }}
          onClick={() => onSelect(project)}
          className="lg:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden border border-[rgba(237,232,221,0.12)] cursor-pointer group-hover:border-[rgba(242,163,60,0.5)] transition-colors duration-500 shadow-xl bg-black transform-gpu will-change-transform"
        >
          {project.image ? (
            <div className="relative w-full h-full overflow-hidden">
              <motion.img
                src={project.image}
                alt={project.title}
                style={{ y: imgY, scale: imgScale }}
                className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.05] group-hover:scale-105 group-hover:brightness-100 transition-[filter] duration-500 will-change-transform"
                loading="lazy"
              />
              {/* Gradient vignettes for cinematic depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />
            </div>
          ) : (
            /* Code pattern mockup inside if no image */
            <div
              className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between font-mono text-[11px] text-[#ede8dd]/60 select-none"
              style={{ background: bg }}
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#f2a33c] uppercase text-[10px] sm:text-xs">{project.categoryLabel[language]}</span>
                <span className="text-[9px] sm:text-[10px] text-[#837e6f]">STATUS: 200 OK</span>
              </div>

              <div className="space-y-1 text-[11px] text-[#ede8dd]/80">
                <p className="text-white font-bold text-sm tracking-tight">{project.title}</p>
                <p className="line-clamp-2 text-xs text-[#b9b3a4]">{project.tagline[language]}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#837e6f]">
                <span>{project.metrics ? project.metrics[language] : 'PRODUCTION'}</span>
                <span className="text-white group-hover:text-[#f2a33c] transition-colors">VOIR PROJET →</span>
              </div>
            </div>
          )}

          {/* Scanline Sweep Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(237,232,221,0.08)] to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Top Category Badge */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            <span className="mono text-[9px] sm:text-[10px] text-[#ede8dd] tracking-wider py-0.5 sm:py-1 px-2 sm:px-2.5 rounded-md bg-black/80 backdrop-blur-md border border-[rgba(237,232,221,0.12)]">
              {project.categoryLabel[language].toUpperCase()}
            </span>
            <span className="mono text-[9px] sm:text-[10px] text-[#3dd68c] tracking-wider py-0.5 sm:py-1 px-2 rounded-md bg-black/80 backdrop-blur-md border border-[rgba(61,214,140,0.25)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3dd68c]" />
              <span>{project.statusLabel[language].toUpperCase()}</span>
            </span>
          </div>

          {/* Bottom Visual Label */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            <span className="mono text-[9px] sm:text-[10px] text-[#ede8dd] tracking-wider py-0.5 sm:py-1 px-2 rounded-md bg-black/85 backdrop-blur-md border border-[rgba(237,232,221,0.08)] truncate max-w-[130px] sm:max-w-none">
              {project.title.toUpperCase()}
            </span>
            <span className="mono text-[9px] sm:text-[10px] text-[#f2a33c] tracking-wider py-0.5 sm:py-1 px-2 rounded-md bg-black/85 backdrop-blur-md border border-[rgba(242,163,60,0.3)] shrink-0">
              {language === 'fr' ? 'APERÇU →' : 'PREVIEW →'}
            </span>
          </div>
        </motion.div>

        {/* Project Info, Tags & Actions on Right */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5">
          <p className="text-[#b9b3a4] text-[0.88rem] sm:text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed max-w-xl font-normal line-clamp-3 sm:line-clamp-none">
            {project.description[language]}
          </p>

          {/* Tech Stack Pills */}
          <ul className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5 font-mono text-[0.64rem] sm:text-[0.68rem] uppercase" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full border border-[rgba(237,232,221,0.1)] text-[#b9b3a4] group-hover:border-[rgba(237,232,221,0.22)] transition-colors"
              >
                {tag}
              </li>
            ))}
          </ul>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-3">
            <button
              onClick={() => onSelect(project)}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#ede8dd] hover:text-[#f2a33c] transition-colors py-1.5 px-3 rounded-lg bg-white/[0.04] sm:bg-transparent border border-white/10 sm:border-transparent active:scale-95"
            >
              <span>{language === 'fr' ? 'Détails & Architecture' : 'Details & Architecture'}</span>
              <span>→</span>
            </button>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#837e6f] hover:text-[#ede8dd] transition-colors py-1.5 px-2 active:scale-95"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#837e6f] hover:text-[#ede8dd] transition-colors py-1.5 px-2 active:scale-95"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}
          </div>

          {/* Meta Note */}
          <p className="mono text-[0.64rem] sm:text-[0.68rem] text-[#837e6f] pt-0.5">
            ROLE — DESIGN, FULL-STACK, INFRA · {project.metrics ? project.metrics[language].toUpperCase() : 'PRODUCTION GRADE'}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

export const WorkSection = () => {
  const { language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects = portfolioData.projects;

  return (
    <section id="work" className="py-16 sm:py-32 px-5 sm:px-12 md:px-16 max-w-7xl mx-auto text-left" aria-labelledby="work-title">
      {/* Section Head */}
      <header className="mb-10 sm:mb-20">
        <p className="mono text-[#f2a33c] mb-2 sm:mb-3">01 / WORK</p>
        <h2 id="work-title" className="font-display font-semibold text-[clamp(2.1rem,6vw,4.8rem)] text-[#ede8dd] tracking-tight leading-none">
          {language === 'fr' ? (
            <>
              Projets, récents <em className="text-[#f2a33c] not-italic font-serif">&amp;</em> en production
            </>
          ) : (
            <>
              Projects, past <em className="text-[#f2a33c] not-italic font-serif">&amp;</em> present
            </>
          )}
        </h2>
        <p className="text-[#837e6f] text-xs sm:text-base mt-3 sm:mt-4 max-w-lg font-normal leading-relaxed">
          {language === 'fr'
            ? 'Des produits en ligne aux architectures complexes — conçus, développés et déployés de bout en bout.'
            : 'From live products to complex architectures — designed, built and deployed end-to-end.'}
        </p>
      </header>

      {/* Editorial Numbered Rows with 3D Scrollytelling Cards */}
      <div className="divide-y divide-[rgba(237,232,221,0.08)] border-y border-[rgba(237,232,221,0.08)]">
        {projects.map((project, idx) => (
          <ProjectRowItem
            key={project.id}
            project={project}
            idx={idx}
            onSelect={setSelectedProject}
          />
        ))}
      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
