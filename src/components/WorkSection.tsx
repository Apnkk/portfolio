import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { ExternalLink, ArrowUpRight, ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';
import { BorderBeam } from './motion/BorderBeam';

type FilterCategory = 'all' | 'desktop' | 'web' | 'mobile';

// macOS traffic light window dots
const WindowTrafficLights = () => (
  <div className="flex items-center gap-1.5" aria-hidden="true">
    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 border border-black/20" />
    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 border border-black/20" />
    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 border border-black/20" />
  </div>
);

export const WorkSection = () => {
  const { language } = useLanguage();
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);
  const projects = portfolioData.projects;

  const filterTabs: { id: FilterCategory; label: { fr: string; en: string }; count: number }[] = [
    { id: 'all', label: { fr: 'Tous les projets', en: 'All Projects' }, count: 5 },
    { id: 'desktop', label: { fr: 'Desktop & Streaming', en: 'Desktop & Streaming' }, count: 2 },
    { id: 'web', label: { fr: 'E-Commerce & SaaS', en: 'E-Commerce & SaaS' }, count: 1 },
    { id: 'mobile', label: { fr: 'Systèmes & Audio', en: 'Systems & Audio' }, count: 2 },
  ];

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'desktop') return p.id === 'zflix-desktop' || p.id === 'zflix-launcher';
    if (filter === 'web') return p.id === 'shopcore';
    if (filter === 'mobile') return p.id === 'spoti-liquid-glass' || p.id === 'zmusic';
    return true;
  });

  const checkScrollState = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Calculate which item is most visible
    const items = trackRef.current.children;
    if (items.length > 0) {
      let active = 0;
      let minDiff = Infinity;
      for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLElement;
        const diff = Math.abs(item.offsetLeft - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          active = i;
        }
      }
      setCurrentIndex(active);
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScrollState, { passive: true });
    checkScrollState();
    return () => el.removeEventListener('scroll', checkScrollState);
  }, [filter, filteredProjects.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const { clientWidth } = trackRef.current;
    const amount = clientWidth * 0.72;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (idx: number) => {
    if (!trackRef.current) return;
    const items = trackRef.current.children;
    if (items[idx]) {
      const item = items[idx] as HTMLElement;
      trackRef.current.scrollTo({
        left: item.offsetLeft - 16,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="work"
      className="py-20 sm:py-28 px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto text-left relative overflow-hidden"
      aria-labelledby="work-heading"
    >
      {/* Top Header: Title + Filter + Carousel Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
            <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
              {language === 'fr' ? 'PROJETS & LOGICIELS' : 'FEATURED PROJECTS'}
            </p>
          </div>
          <h2
            id="work-heading"
            className="font-display font-semibold text-[clamp(2.2rem,4vw,3.6rem)] text-white tracking-tight leading-tight"
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
          <p className="text-[#a1a1aa] text-sm mt-2 max-w-lg font-normal leading-relaxed">
            {language === 'fr'
              ? 'Défilement horizontal interactif : parcourez les projets à votre rythme ou continuez vers le bas.'
              : 'Interactive horizontal showcase: browse through projects at your pace or scroll past.'}
          </p>
        </div>

        {/* Carousel Counter & Arrow Navigation Controls */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="font-mono text-xs text-[#71717a] flex items-center gap-1.5 bg-[#09090b] px-3.5 py-2 rounded-xl border border-white/[0.08]">
            <span className="text-white font-semibold">0{Math.min(currentIndex + 1, filteredProjects.length)}</span>
            <span>/</span>
            <span>0{filteredProjects.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-3 rounded-xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm hover:bg-white/[0.05]"
              title={language === 'fr' ? 'Projet précédent' : 'Previous project'}
              aria-label={language === 'fr' ? 'Projet précédent' : 'Previous project'}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-3 rounded-xl bg-[#09090b] border border-white/[0.08] hover:border-[#ff1e38]/50 text-white hover:text-[#ff1e38] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm hover:bg-white/[0.05]"
              title={language === 'fr' ? 'Projet suivant' : 'Next project'}
              aria-label={language === 'fr' ? 'Projet suivant' : 'Next project'}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setFilter(tab.id);
                if (trackRef.current) trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
              }}
              className={`relative px-3.5 py-1.5 rounded-lg font-mono text-xs transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                isActive ? 'text-white' : 'text-[#71717a] hover:text-[#d4d4d8]'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeFilterBubble"
                  className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.12] -z-10"
                  transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.15 }}
                />
              )}
              <span>{tab.label[language]}</span>
              <span className={`text-[0.66rem] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#ff1e38]/20 text-[#ff1e38] font-bold' : 'bg-white/[0.04] text-[#71717a]'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Scroll Track (The Carousel) */}
      <div
        ref={trackRef}
        className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {filteredProjects.map((project) => {
          const isFlagship = project.id === 'zflix-desktop';
          const isSaaS = project.id === 'shopcore';

          return (
            <div
              key={project.id}
              className="w-[86vw] sm:w-[480px] lg:w-[540px] shrink-0 snap-start flex flex-col"
            >
              <div
                className="group relative h-full rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.85)]"
              >
                {/* Dynamic Laser Beam for Flagship */}
                {isFlagship && (
                  <BorderBeam duration={12} borderWidth={1.5} colorFrom="#ff1e38" colorTo="rgba(255, 30, 56, 0.2)" />
                )}
                {isSaaS && (
                  <BorderBeam duration={14} borderWidth={1.5} colorFrom="#10b981" colorTo="rgba(16, 185, 129, 0.2)" />
                )}

                <div className="p-6 sm:p-7 flex flex-col justify-between h-full">
                  <div>
                    {/* Top Bar with Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[0.66rem] font-medium tracking-wider uppercase flex items-center gap-1.5 ${
                        isFlagship
                          ? 'bg-[#ff1e38]/10 border border-[#ff1e38]/25 text-[#ff1e38]'
                          : isSaaS
                          ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
                          : 'bg-white/[0.05] border border-white/[0.08] text-white'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isFlagship ? 'bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]' : isSaaS ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-[#a1a1aa]'
                        }`} />
                        {project.categoryLabel[language]}
                      </span>

                      <div className="flex items-center gap-2">
                        {project.metrics && (
                          <span className="font-mono text-[0.66rem] text-[#d4d4d8] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                            {project.metrics[language]}
                          </span>
                        )}
                        <span className="font-mono text-[0.66rem] text-[#71717a] px-2 py-0.5 rounded bg-white/[0.03]">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    {/* Window Frame Mockup */}
                    <div
                      onClick={() => setActiveProject(project)}
                      className="relative rounded-xl overflow-hidden bg-black/90 border border-white/[0.1] shadow-2xl group/mockup cursor-pointer my-4 group-hover:border-white/25 transition-all"
                    >
                      <div className="px-3.5 py-2.5 bg-[#121214] border-b border-white/[0.08] flex items-center justify-between">
                        <WindowTrafficLights />
                        <span className="font-mono text-[0.64rem] text-[#71717a] truncate max-w-[170px]">
                          {isSaaS ? 'https://shopcore.buzz' : `${project.id}.app`}
                        </span>
                        <span className="text-[0.6rem] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.05] text-[#a1a1aa]">
                          {project.statusLabel[language]}
                        </span>
                      </div>

                      <div className="relative aspect-[16/10] overflow-hidden bg-black flex items-center justify-center">
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-top filter brightness-[0.95] group-hover/mockup:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/mockup:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                          <span className="px-3.5 py-1.5 rounded-full bg-black/90 border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 shadow-lg">
                            <span>{language === 'fr' ? 'Détails du projet' : 'View case study'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#ff1e38]" />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setActiveProject(project)}
                      className="font-display font-bold text-2xl text-white tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center justify-between mt-4"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-[#ff1e38] transition-colors" />
                    </h3>

                    {/* Tagline */}
                    <p className="text-[#a1a1aa] text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                      {project.tagline[language]}
                    </p>

                    {/* Key features if flagship */}
                    {isFlagship && (
                      <ul className="mt-4 space-y-1.5 font-mono text-[0.72rem] text-[#d4d4d8]/90">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#ff1e38]" />
                          <span>{language === 'fr' ? 'Hubs Netflix, Disney+, HBO & Marvel' : 'Dedicated Netflix, Disney+ & HBO hubs'}</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-[#ff1e38]" />
                          <span>{language === 'fr' ? 'Lecteur HLS 4K sans pub & multi-pistes' : 'Ad-free 4K HLS player with multi-audio'}</span>
                        </li>
                      </ul>
                    )}

                    {/* Tech Pills */}
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

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/[0.08]">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveProject(project)}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-mono text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                        isFlagship ? 'btn--crimson' : 'bg-white/[0.06] hover:bg-white/[0.1] text-white'
                      }`}
                    >
                      {isFlagship && <Sparkles className="w-3.5 h-3.5" />}
                      <span>{language === 'fr' ? 'Étude de cas' : 'Case Study'}</span>
                    </motion.button>

                    {project.liveUrl && (
                      <motion.a
                        whileTap={{ scale: 0.92 }}
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
                        title={language === 'fr' ? 'Visiter en ligne' : 'Visit live platform'}
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
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
                        title="Code GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Track Controls & Pagination Indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-white/[0.06] font-mono text-xs text-[#71717a]">
        <div className="flex items-center gap-2">
          {filteredProjects.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-[#ff1e38]' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={`Projet ${idx + 1}`}
              aria-label={`Aller au projet ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 text-[#71717a] text-[0.72rem]">
          <span>←</span>
          <span>{language === 'fr' ? 'Faites glisser pour explorer ou descendez pour continuer' : 'Swipe to explore or scroll down to continue'}</span>
          <span>→</span>
        </div>
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
