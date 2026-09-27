import { useState, useRef, useEffect } from 'react';
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
  isDesktop: boolean;
}

const ProjectRowItem = ({ project, idx, onSelect, isDesktop }: ProjectRowItemProps) => {
  const { language } = useLanguage();
  const rowRef = useRef<HTMLElement>(null);

  // Scrollytelling Parallax tracking for this individual project card
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });

  // Parallax camera track inside the image viewport (active on desktop, subtle on mobile)
  const imgY = useTransform(scrollYProgress, [0, 1], isDesktop ? ['-6%', '6%'] : ['0%', '0%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], isDesktop ? [1.08, 1.02, 1.08] : [1, 1, 1]);

  // Subtle 3D physical pitch on desktop only (disabled on mobile for 120fps smoothness)
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], isDesktop ? [2, 0, -2] : [0, 0, 0]);

  const getVisualGradients = (category: string) => {
    switch (category) {
      case 'ai':
        return {
          bg: 'radial-gradient(ellipse 80% 90% at 75% 15%, rgba(255, 42, 59, 0.2), transparent 60%), linear-gradient(140deg, #18090b, #0c0506 70%)',
          accent: '#ff2a3b',
        };
      case 'mobile':
        return {
          bg: 'radial-gradient(ellipse 80% 90% at 25% 85%, rgba(46, 229, 157, 0.18), transparent 60%), linear-gradient(220deg, #091510, #050c09 70%)',
          accent: '#2ee59d',
        };
      case 'fullstack':
        return {
          bg: 'radial-gradient(ellipse 80% 90% at 70% 80%, rgba(255, 42, 59, 0.25), transparent 60%), linear-gradient(160deg, #1a080a, #0b0405 70%)',
          accent: '#ff2a3b',
        };
      default:
        return {
          bg: 'radial-gradient(ellipse 80% 90% at 50% 50%, rgba(255, 60, 80, 0.2), transparent 60%), linear-gradient(140deg, #160a10, #090508 70%)',
          accent: '#ff3c50',
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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: idx * 0.05 }}
      className="py-7 sm:py-14 group will-change-transform"
      style={isDesktop ? { perspective: 1200 } : undefined}
    >
      {/* Row Header with Interactive Title */}
      <div
        onClick={() => onSelect(project)}
        className="cursor-pointer flex items-baseline justify-between gap-3 sm:gap-8 group-hover:text-[#ff2a3b] transition-colors select-none"
      >
        <div className="flex items-baseline gap-3 sm:gap-6 min-w-0">
          <span className="mono text-base sm:text-xl text-[#797368] group-hover:text-[#ff2a3b] transition-colors shrink-0">
            {getRomanNumber(idx)}
          </span>
          <h3 className="font-display font-semibold text-[clamp(1.7rem,5.5vw,5.2rem)] text-[#f4f2ee] tracking-tight leading-none group-hover:translate-x-2 transition-all duration-300 truncate">
            {project.title}
          </h3>
        </div>
        <span className="text-lg sm:text-3xl text-[#797368] group-hover:text-[#ff2a3b] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0">
          ↗
        </span>
      </div>

      {/* Row Body: Visual Card on Left + Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-12 mt-5 sm:mt-8 items-start">
        {/* Visual Art Preview Card with Crimson Laser Hover */}
        <motion.div
          style={isDesktop ? { rotateX } : undefined}
          onClick={() => onSelect(project)}
          className="lg:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden border border-white/[0.1] cursor-pointer group-hover:border-[#ff2a3b]/60 group-hover:shadow-[0_0_30px_rgba(255,42,59,0.22)] transition-all duration-500 shadow-xl bg-black transform-gpu will-change-transform"
        >
          {project.image ? (
            <div className="relative w-full h-full overflow-hidden">
              <motion.img
                src={project.image}
                alt={project.title}
                style={{ y: imgY, scale: imgScale }}
                className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.05] group-hover:scale-105 group-hover:brightness-100 transition-[filter] duration-500 will-change-transform"
                loading="lazy"
                decoding="async"
              />
              {/* Gradient vignettes for OLED depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />
            </div>
          ) : (
            /* Code pattern mockup inside if no image */
            <div
              className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between font-mono text-[11px] text-[#f4f2ee]/60 select-none"
              style={{ background: bg }}
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[#ff2a3b] uppercase text-[10px] sm:text-xs">{project.categoryLabel[language]}</span>
                <span className="text-[9px] sm:text-[10px] text-[#797368]">STATUS: 200 OK</span>
              </div>

              <div className="space-y-1 text-[11px] text-[#f4f2ee]/80">
                <p className="text-white font-bold text-sm tracking-tight">{project.title}</p>
                <p className="line-clamp-2 text-xs text-[#b8b3a8]">{project.tagline[language]}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#797368]">
                <span>{project.metrics ? project.metrics[language] : 'PRODUCTION'}</span>
                <span className="text-white group-hover:text-[#ff2a3b] transition-colors">VOIR PROJET →</span>
              </div>
            </div>
          )}

          {/* Scanline Sweep Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(255,42,59,0.12)] to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Top Category Badge */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            <span className="mono text-[9px] sm:text-[10px] text-[#f4f2ee] tracking-wider py-0.5 sm:py-1 px-2 sm:px-2.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10">
              {project.categoryLabel[language].toUpperCase()}
            </span>
            <span className="mono text-[9px] sm:text-[10px] text-[#ff2a3b] tracking-wider py-0.5 sm:py-1 px-2 rounded-md bg-black/80 backdrop-blur-md border border-[#ff2a3b]/30 flex items-center gap-1.5 shadow-[0_0_8px_rgba(255,42,59,0.25)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a3b] animate-pulse" />
              <span>{project.statusLabel[language].toUpperCase()}</span>
            </span>
          </div>

          {/* Bottom Visual Label */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            <span className="mono text-[9px] sm:text-[10px] text-[#f4f2ee] tracking-wider py-0.5 sm:py-1 px-2 rounded-md bg-black/85 backdrop-blur-md border border-white/[0.08] truncate max-w-[130px] sm:max-w-none">
              {project.title.toUpperCase()}
            </span>
            <span className="mono text-[9px] sm:text-[10px] text-[#ff2a3b] tracking-wider py-0.5 sm:py-1 px-2 rounded-md bg-black/85 backdrop-blur-md border border-[#ff2a3b]/40 shrink-0">
              {language === 'fr' ? 'APERÇU →' : 'PREVIEW →'}
            </span>
          </div>
        </motion.div>

        {/* Project Info, Tags & Actions on Right */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5">
          <p className="text-[#b8b3a8] text-[0.88rem] sm:text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed max-w-xl font-normal line-clamp-3 sm:line-clamp-none">
            {project.description[language]}
          </p>

          {/* Tech Stack Pills */}
          <ul className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5 font-mono text-[0.64rem] sm:text-[0.68rem] uppercase" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full border border-white/[0.08] text-[#b8b3a8] group-hover:border-[#ff2a3b]/40 transition-colors"
              >
                {tag}
              </li>
            ))}
          </ul>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-3">
            <button
              onClick={() => onSelect(project)}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#f4f2ee] hover:text-[#ff2a3b] transition-colors py-1.5 px-3 rounded-lg bg-white/[0.04] sm:bg-transparent border border-white/10 sm:border-transparent active:scale-95"
            >
              <span>{language === 'fr' ? 'Détails & Architecture' : 'Details & Architecture'}</span>
              <span>→</span>
            </button>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#797368] hover:text-[#f4f2ee] transition-colors py-1.5 px-2 active:scale-95"
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
                className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[#797368] hover:text-[#f4f2ee] transition-colors py-1.5 px-2 active:scale-95"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Code</span>
              </a>
            )}
          </div>

          {/* Meta Note */}
          <p className="mono text-[0.64rem] sm:text-[0.68rem] text-[#797368] pt-0.5">
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
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const projects = portfolioData.projects;

  return (
    <section id="work" className="py-16 sm:py-32 px-5 sm:px-12 md:px-16 max-w-7xl mx-auto text-left" aria-labelledby="work-title">
      {/* Section Head */}
      <header className="mb-10 sm:mb-20">
        <p className="mono text-[#ff2a3b] mb-2 sm:mb-3 font-semibold">01 / WORK</p>
        <h2 id="work-title" className="font-display font-semibold text-[clamp(2.1rem,6vw,4.8rem)] text-[#f4f2ee] tracking-tight leading-none">
          {language === 'fr' ? (
            <>
              Projets, récents <em className="text-[#ff2a3b] not-italic font-serif">&amp;</em> en production
            </>
          ) : (
            <>
              Projects, past <em className="text-[#ff2a3b] not-italic font-serif">&amp;</em> present
            </>
          )}
        </h2>
        <p className="text-[#797368] text-xs sm:text-base mt-3 sm:mt-4 max-w-lg font-normal leading-relaxed">
          {language === 'fr'
            ? 'Des produits en ligne aux architectures complexes — conçus, développés et déployés de bout en bout.'
            : 'From live products to complex architectures — designed, built and deployed end-to-end.'}
        </p>
      </header>

      {/* Editorial Numbered Rows with Crimson Hover Highlights */}
      <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {projects.map((project, idx) => (
          <ProjectRowItem
            key={project.id}
            project={project}
            idx={idx}
            onSelect={setSelectedProject}
            isDesktop={isDesktop}
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
