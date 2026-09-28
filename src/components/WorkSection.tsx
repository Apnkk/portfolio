import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { ExternalLink, ArrowUpRight, Check, Lock, Sparkles } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';
import { TiltCard } from './motion/TiltCard';
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

  const projects = portfolioData.projects;
  const zflix = projects.find((p) => p.id === 'zflix-desktop') || projects[0];
  const shopcore = projects.find((p) => p.id === 'shopcore') || projects[1];
  const spoti = projects.find((p) => p.id === 'spoti-liquid-glass') || projects[2];
  const launcher = projects.find((p) => p.id === 'zflix-launcher') || projects[3];
  const zmusic = projects.find((p) => p.id === 'zmusic') || projects[4];

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

  return (
    <section
      id="work"
      className="py-24 sm:py-32 px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto text-left relative"
      aria-labelledby="work-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
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
            ? 'Architecture, développement système et applications déployées en production.'
            : 'Software engineering, systems development, and production applications.'}
        </p>

        {/* Minimalist Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-xl bg-[#09090b] border border-white/[0.08]">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
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
                <span className={`text-[0.68rem] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#ff1e38]/20 text-[#ff1e38] font-bold' : 'bg-white/[0.04] text-[#71717a]'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Showcase: When 'all', display Asymmetric Next-Gen Bento Grid */}
      {filter === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* =========================================================================
              CARD 1: FLAGSHIP HERO (Z-Flix Desktop) - lg:col-span-8
          ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 md:col-span-2 col-span-1"
          >
            <TiltCard
              scale={1.012}
              spotlightColor="rgba(255, 30, 56, 0.15)"
              className="group h-full rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative"
            >
              {/* Crimson laser border beam */}
              <BorderBeam duration={12} borderWidth={1.5} colorFrom="#ff1e38" colorTo="rgba(255, 30, 56, 0.2)" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 h-full">
                {/* Left Info Column */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <div>
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#ff1e38]/10 border border-[#ff1e38]/25 text-[#ff1e38] font-mono text-[0.66rem] font-medium tracking-wider uppercase flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff1e38] opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff1e38]" />
                        </span>
                        {language === 'fr' ? 'APPLICATION PHARE' : 'FLAGSHIP SUITE'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono text-[0.66rem] text-[#a1a1aa] tracking-wider">
                        {zflix.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setActiveProject(zflix)}
                      className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <span>{zflix.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-[#71717a] group-hover:text-[#ff1e38] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </h3>

                    {/* Tagline */}
                    <p className="text-[#a1a1aa] text-sm mt-3 leading-relaxed font-normal">
                      {zflix.tagline[language]}
                    </p>

                    {/* Key Highlights */}
                    <ul className="mt-5 space-y-2 font-mono text-xs text-[#d4d4d8]/90">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#ff1e38] shrink-0" />
                        <span>{language === 'fr' ? 'Hubs Netflix, Disney+, HBO Max & Marvel' : 'Dedicated Netflix, Disney+ & HBO hubs'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#ff1e38] shrink-0" />
                        <span>{language === 'fr' ? 'Lecteur vidéo HLS 4K sans interruption' : 'Ad-free 4K HLS streaming engine'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#ff1e38] shrink-0" />
                        <span>{language === 'fr' ? 'Reprise automatique de lecture & watchlist' : 'Playback resume & personal watchlist'}</span>
                      </li>
                    </ul>

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {zflix.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] font-mono text-[0.65rem] text-[#d4d4d8]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-7 pt-5 border-t border-white/[0.08]">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveProject(zflix)}
                      className="flex-1 py-2.5 px-4 rounded-xl btn--crimson font-mono text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Étude de cas complète' : 'View Case Study'}</span>
                    </motion.button>

                    {zflix.githubUrl && (
                      <motion.a
                        whileTap={{ scale: 0.92 }}
                        href={zflix.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
                        title="GitHub Repository"
                        aria-label="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Right macOS Window Mockup */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <div
                    onClick={() => setActiveProject(zflix)}
                    className="relative rounded-xl overflow-hidden bg-black/90 border border-white/[0.12] shadow-2xl group/mockup cursor-pointer transition-all duration-300 group-hover:border-white/25"
                  >
                    {/* Window Header */}
                    <div className="px-3.5 py-2.5 bg-[#121214] border-b border-white/[0.08] flex items-center justify-between">
                      <WindowTrafficLights />
                      <span className="font-mono text-[0.64rem] text-[#71717a] truncate max-w-[160px]">
                        zflix-desktop.app — 4K Stream
                      </span>
                      <span className="text-[0.6rem] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {zflix.statusLabel[language]}
                      </span>
                    </div>

                    {/* Window Content */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={zflix.image}
                        alt={zflix.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-top filter brightness-[0.95] group-hover/mockup:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Hover Overlay Pill */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/mockup:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <span className="px-3.5 py-1.5 rounded-full bg-black/90 border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 shadow-lg">
                          <span>{language === 'fr' ? 'Agrandir l’aperçu' : 'Expand preview'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#ff1e38]" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* =========================================================================
              CARD 2: SECONDARY FLAGSHIP (ShopCore) - lg:col-span-4
          ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 md:col-span-2 col-span-1"
          >
            <TiltCard
              scale={1.015}
              spotlightColor="rgba(16, 185, 129, 0.14)"
              className="group h-full rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative"
            >
              {/* Emerald laser border beam */}
              <BorderBeam duration={14} borderWidth={1.5} colorFrom="#10b981" colorTo="rgba(16, 185, 129, 0.15)" />

              <div className="p-6 sm:p-7 flex flex-col justify-between h-full">
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[0.66rem] font-medium tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                      {shopcore.categoryLabel[language]}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono text-[0.66rem] text-[#a1a1aa]">
                      {shopcore.year}
                    </span>
                  </div>

                  {/* Browser Mockup */}
                  <div
                    onClick={() => setActiveProject(shopcore)}
                    className="relative rounded-xl overflow-hidden bg-black/90 border border-white/[0.1] shadow-xl group/mockup cursor-pointer my-4 group-hover:border-white/20 transition-all"
                  >
                    <div className="px-3 py-2 bg-[#121214] border-b border-white/[0.08] flex items-center gap-2">
                      <WindowTrafficLights />
                      <div className="flex-1 px-2.5 py-0.5 rounded bg-black/60 border border-white/[0.06] flex items-center gap-1.5 text-[0.62rem] font-mono text-[#a1a1aa] truncate">
                        <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span className="truncate">https://shopcore.buzz</span>
                      </div>
                    </div>

                    <div className="relative aspect-[16/10] overflow-hidden bg-black flex items-center justify-center">
                      {/* Ambient emerald backlight */}
                      <div className="absolute inset-0 bg-radial-gradient from-emerald-500/15 via-transparent to-transparent pointer-events-none" />
                      <img
                        src={shopcore.image}
                        alt={shopcore.title}
                        loading="lazy"
                        className="w-full h-full object-cover filter brightness-[0.95] group-hover/mockup:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3
                    onClick={() => setActiveProject(shopcore)}
                    className="font-display font-bold text-2xl text-white tracking-tight group-hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-between mt-3"
                  >
                    <span>{shopcore.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-emerald-400 transition-colors" />
                  </h3>

                  <p className="text-[#a1a1aa] text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                    {shopcore.tagline[language]}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {shopcore.tags.slice(0, 4).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[0.65rem] text-[#d4d4d8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/[0.08]">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveProject(shopcore)}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white font-mono text-[0.7rem] uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>{language === 'fr' ? 'Détails' : 'Case Study'}</span>
                  </motion.button>

                  {shopcore.liveUrl && (
                    <motion.a
                      whileTap={{ scale: 0.92 }}
                      href={shopcore.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition-colors"
                      title="Visiter shopcore.buzz"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* =========================================================================
              CARD 3: SPOTI LIQUID GLASS (iOS Modding) - lg:col-span-4
          ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 col-span-1"
          >
            <TiltCard
              scale={1.015}
              spotlightColor="rgba(20, 184, 166, 0.15)"
              className="group h-full rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-[0.66rem] font-medium tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#14b8a6]" />
                      {spoti.categoryLabel[language]}
                    </span>
                    <span className="font-mono text-[0.66rem] text-[#a1a1aa] px-2 py-0.5 rounded bg-white/[0.04]">
                      {spoti.metrics ? spoti.metrics[language] : spoti.year}
                    </span>
                  </div>

                  {/* Smartphone / Island Frame Mockup */}
                  <div
                    onClick={() => setActiveProject(spoti)}
                    className="relative rounded-xl overflow-hidden bg-black/95 border border-white/[0.1] shadow-xl group/mockup cursor-pointer my-3 group-hover:border-white/20 transition-all"
                  >
                    <div className="px-3 py-2 bg-[#121214] border-b border-white/[0.08] flex items-center justify-between">
                      <span className="font-mono text-[0.62rem] text-[#71717a]">iOS Dynamic Glass</span>
                      <div className="w-12 h-2.5 rounded-full bg-white/[0.15] mx-auto" />
                      <span className="font-mono text-[0.62rem] text-teal-400">60 FPS</span>
                    </div>

                    <div className="relative aspect-[16/11] overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={spoti.image}
                        alt={spoti.title}
                        loading="lazy"
                        className="w-full h-full object-cover filter brightness-[0.95] group-hover/mockup:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                  </div>

                  <h3
                    onClick={() => setActiveProject(spoti)}
                    className="font-display font-semibold text-xl text-white tracking-tight group-hover:text-teal-400 transition-colors cursor-pointer flex items-center justify-between mt-3"
                  >
                    <span>{spoti.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-teal-400 transition-colors" />
                  </h3>

                  <p className="text-[#a1a1aa] text-xs mt-2 leading-relaxed font-normal">
                    {spoti.tagline[language]}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {spoti.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[0.65rem] text-[#d4d4d8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.08]">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveProject(spoti)}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white font-mono text-[0.7rem] uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>{language === 'fr' ? 'Détails' : 'Case Study'}</span>
                  </motion.button>

                  {spoti.githubUrl && (
                    <motion.a
                      whileTap={{ scale: 0.92 }}
                      href={spoti.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* =========================================================================
              CARD 4: Z-LAUNCHER (Desktop Launcher) - lg:col-span-4
          ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 col-span-1"
          >
            <TiltCard
              scale={1.015}
              spotlightColor="rgba(255, 30, 56, 0.12)"
              className="group h-full rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[0.66rem] font-medium tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_6px_#ef4444]" />
                      {launcher.categoryLabel[language]}
                    </span>
                    <span className="font-mono text-[0.66rem] text-[#a1a1aa] px-2 py-0.5 rounded bg-white/[0.04]">
                      {launcher.year}
                    </span>
                  </div>

                  {/* Desktop App Mockup */}
                  <div
                    onClick={() => setActiveProject(launcher)}
                    className="relative rounded-xl overflow-hidden bg-black/95 border border-white/[0.1] shadow-xl group/mockup cursor-pointer my-3 group-hover:border-white/20 transition-all"
                  >
                    <div className="px-3 py-2 bg-[#121214] border-b border-white/[0.08] flex items-center justify-between">
                      <WindowTrafficLights />
                      <span className="font-mono text-[0.62rem] text-[#71717a]">z-launcher.exe — Desktop</span>
                      <span className="font-mono text-[0.6rem] text-red-400">IPC</span>
                    </div>

                    <div className="relative aspect-[16/11] overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={launcher.image}
                        alt={launcher.title}
                        loading="lazy"
                        className="w-full h-full object-cover filter brightness-[0.95] group-hover/mockup:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                  </div>

                  <h3
                    onClick={() => setActiveProject(launcher)}
                    className="font-display font-semibold text-xl text-white tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center justify-between mt-3"
                  >
                    <span>{launcher.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-[#ff1e38] transition-colors" />
                  </h3>

                  <p className="text-[#a1a1aa] text-xs mt-2 leading-relaxed font-normal">
                    {launcher.tagline[language]}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {launcher.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[0.65rem] text-[#d4d4d8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.08]">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveProject(launcher)}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white font-mono text-[0.7rem] uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>{language === 'fr' ? 'Détails' : 'Case Study'}</span>
                  </motion.button>

                  {launcher.githubUrl && (
                    <motion.a
                      whileTap={{ scale: 0.92 }}
                      href={launcher.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* =========================================================================
              CARD 5: Z-MUSIC (Audio & Streaming) - lg:col-span-4
          ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 col-span-1"
          >
            <TiltCard
              scale={1.015}
              spotlightColor="rgba(245, 158, 11, 0.14)"
              className="group h-full rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[0.66rem] font-medium tracking-wider uppercase flex items-center gap-1.5">
                      {/* Animated audio EQ bars */}
                      <div className="flex items-end gap-0.5 h-2.5" aria-hidden="true">
                        <span className="w-0.5 h-2 bg-amber-400 animate-pulse" />
                        <span className="w-0.5 h-3 bg-amber-400 animate-pulse" style={{ animationDelay: '120ms' }} />
                        <span className="w-0.5 h-1.5 bg-amber-400 animate-pulse" style={{ animationDelay: '240ms' }} />
                      </div>
                      {zmusic.categoryLabel[language]}
                    </span>
                    <span className="font-mono text-[0.66rem] text-[#a1a1aa] px-2 py-0.5 rounded bg-white/[0.04]">
                      {zmusic.year}
                    </span>
                  </div>

                  {/* Audio Player Dock Mockup */}
                  <div
                    onClick={() => setActiveProject(zmusic)}
                    className="relative rounded-xl overflow-hidden bg-black/95 border border-white/[0.1] shadow-xl group/mockup cursor-pointer my-3 group-hover:border-white/20 transition-all"
                  >
                    <div className="px-3 py-2 bg-[#121214] border-b border-white/[0.08] flex items-center justify-between">
                      <WindowTrafficLights />
                      <span className="font-mono text-[0.62rem] text-[#71717a] truncate max-w-[130px]">
                        z-music.app — Hi-Fi Audio
                      </span>
                      <span className="font-mono text-[0.6rem] text-amber-400">WebAudio</span>
                    </div>

                    <div className="relative aspect-[16/11] overflow-hidden bg-black flex items-center justify-center">
                      <img
                        src={zmusic.image}
                        alt={zmusic.title}
                        loading="lazy"
                        className="w-full h-full object-cover filter brightness-[0.95] group-hover/mockup:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                  </div>

                  <h3
                    onClick={() => setActiveProject(zmusic)}
                    className="font-display font-semibold text-xl text-white tracking-tight group-hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-between mt-3"
                  >
                    <span>{zmusic.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-amber-400 transition-colors" />
                  </h3>

                  <p className="text-[#a1a1aa] text-xs mt-2 leading-relaxed font-normal">
                    {zmusic.tagline[language]}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {zmusic.tags.slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[0.65rem] text-[#d4d4d8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.08]">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveProject(zmusic)}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white font-mono text-[0.7rem] uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <span>{language === 'fr' ? 'Détails' : 'Case Study'}</span>
                  </motion.button>

                  {zmusic.githubUrl && (
                    <motion.a
                      whileTap={{ scale: 0.92 }}
                      href={zmusic.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
                      title="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      ) : (
        /* Filtered Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
            >
              <TiltCard
                scale={1.015}
                spotlightColor="rgba(255, 30, 56, 0.12)"
                className="group h-full rounded-2xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between overflow-hidden shadow-xl"
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#ff1e38] font-mono text-[0.66rem] font-medium tracking-wider uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
                        {project.categoryLabel[language]}
                      </span>
                      <span className="font-mono text-[0.66rem] text-[#a1a1aa]">
                        {project.year}
                      </span>
                    </div>

                    <div
                      onClick={() => setActiveProject(project)}
                      className="relative rounded-xl overflow-hidden bg-black/95 border border-white/[0.1] cursor-pointer my-3 group-hover:border-white/20 transition-all aspect-[16/10]"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover filter brightness-[0.95] group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <h3
                      onClick={() => setActiveProject(project)}
                      className="font-display font-semibold text-xl text-white tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center justify-between mt-3"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-[#ff1e38] transition-colors" />
                    </h3>

                    <p className="text-[#a1a1aa] text-xs mt-2 leading-relaxed">
                      {project.tagline[language]}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3.5">
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

                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setActiveProject(project)}
                      className="flex-1 py-2 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white font-mono text-[0.7rem] uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <span>{language === 'fr' ? 'Détails' : 'Case Study'}</span>
                    </button>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-white transition-colors"
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
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      )}

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
