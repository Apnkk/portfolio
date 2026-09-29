import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import type { Project } from '../types';
import { ProjectModal } from './ProjectModal';
import { 
  ExternalLink, 
  ArrowUpRight, 
  Sparkles, 
  Check, 
  Globe
} from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';
import { BorderBeam } from './motion/BorderBeam';

type FilterCategory = 'all' | 'desktop' | 'web' | 'mobile';

interface WorkSectionProps {
  activeProjectId?: string | null;
  onSelectProject?: (project: Project | null) => void;
}

export const WorkSection = ({ activeProjectId, onSelectProject }: WorkSectionProps) => {
  const { language } = useLanguage();
  const [internalActiveProject, setInternalActiveProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [spotiMockupIndex, setSpotiMockupIndex] = useState(0);

  const activeProject = activeProjectId 
    ? portfolioData.projects.find(p => p.id === activeProjectId) || internalActiveProject 
    : internalActiveProject;

  const handleSetActive = (project: Project | null) => {
    setInternalActiveProject(project);
    if (onSelectProject) onSelectProject(project);
  };

  const projects = portfolioData.projects;

  const filterTabs: { id: FilterCategory; label: { fr: string; en: string }; count: number }[] = [
    { id: 'all', label: { fr: 'Tous les projets', en: 'All Projects' }, count: 5 },
    { id: 'desktop', label: { fr: 'Desktop & Streaming', en: 'Desktop & Streaming' }, count: 2 },
    { id: 'web', label: { fr: 'E-Commerce & SaaS', en: 'E-Commerce & SaaS' }, count: 1 },
    { id: 'mobile', label: { fr: 'iOS & Audio', en: 'iOS & Audio' }, count: 2 },
  ];

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'desktop') return p.id === 'zflix-desktop' || p.id === 'zflix-launcher';
    if (filter === 'web') return p.id === 'shopcore';
    if (filter === 'mobile') return p.id === 'spoti-liquid-glass' || p.id === 'zmusic';
    return true;
  });

  const zflix = projects.find((p) => p.id === 'zflix-desktop')!;
  const shopcore = projects.find((p) => p.id === 'shopcore')!;
  const spoti = projects.find((p) => p.id === 'spoti-liquid-glass')!;
  const zlauncher = projects.find((p) => p.id === 'zflix-launcher')!;
  const zmusic = projects.find((p) => p.id === 'zmusic')!;

  const spotiScreenshots = [
    { label: '3D Mockup', src: '/projects/spoti-liquid-glass-3d.webp' },
    { label: 'Now Playing', src: '/projects/spoti/now-playing.webp' },
    { label: 'Live Activity', src: '/projects/spoti/live-activity.webp' },
    { label: 'Home View', src: '/projects/spoti/home.webp' },
  ];

  return (
    <section
      id="work"
      className="scroll-mt-24 sm:scroll-mt-28 py-24 sm:py-32 px-5 sm:px-10 lg:px-16 max-w-7xl mx-auto text-left relative"
      aria-labelledby="work-heading"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 border-b border-white/[0.08] pb-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
            <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
              {language === 'fr' ? 'PROJETS & LOGICIELS' : 'FEATURED WORKS'}
            </p>
          </div>
          <h2
            id="work-heading"
            className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-white tracking-tight leading-tight"
          >
            {language === 'fr' ? (
              <>
                Logiciels phares <span className="text-[#ff1e38]">&amp;</span> réalisations
              </>
            ) : (
              <>
                Flagship software <span className="text-[#ff1e38]">&amp;</span> products
              </>
            )}
          </h2>
          <p className="text-[#a1a1aa] text-sm sm:text-base mt-2 max-w-xl font-normal leading-relaxed">
            {language === 'fr'
              ? 'Des applications complètes déployées pour de vrais utilisateurs : streaming média, e-commerce automatisé et modding iOS.'
              : 'Complete production applications built for real users: media streaming, automated e-commerce, and native iOS modding.'}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-xl font-mono text-xs transition-colors duration-200 cursor-pointer flex items-center gap-2 ${
                  isActive ? 'text-white font-semibold' : 'text-[#71717a] hover:text-[#d4d4d8]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeFilterBubble"
                    className="absolute inset-0 rounded-xl bg-white/[0.1] border border-white/[0.14] -z-10 shadow-sm"
                    transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.15 }}
                  />
                )}
                <span>{tab.label[language]}</span>
                <span
                  className={`text-[0.66rem] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-[#ff1e38]/20 text-[#ff1e38] font-bold'
                      : 'bg-white/[0.04] text-[#71717a]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid Showcase */}
      {filter === 'all' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Z-Flix Desktop (Large Focal Bento Card - 8 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-8 group relative rounded-3xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            <BorderBeam duration={12} borderWidth={1.5} colorFrom="#ff1e38" colorTo="rgba(255, 30, 56, 0.2)" />

            <div className="p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                {/* Meta Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full font-mono text-[0.68rem] font-semibold tracking-wider uppercase bg-[#ff1e38]/10 border border-[#ff1e38]/25 text-[#ff1e38] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
                      {zflix.categoryLabel[language]}
                    </span>
                    <span className="px-2.5 py-1 rounded-full font-mono text-[0.65rem] bg-white/[0.04] border border-white/[0.06] text-[#d4d4d8]">
                      {zflix.statusLabel[language]}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#71717a]">
                    {zflix.year}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 
                  onClick={() => handleSetActive(zflix)}
                  className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{zflix.title}</span>
                  <ArrowUpRight className="w-6 h-6 text-[#71717a] group-hover:text-[#ff1e38] transition-colors" />
                </h3>
                <p className="text-[#a1a1aa] text-sm sm:text-base mt-2 font-normal leading-relaxed max-w-2xl">
                  {zflix.tagline[language]}
                </p>

                {/* High-Resolution Media Stage with macOS Frame */}
                <div
                  onClick={() => handleSetActive(zflix)}
                  className="relative mt-6 rounded-2xl overflow-hidden bg-black/95 border border-white/[0.1] shadow-2xl group/stage cursor-pointer hover:border-white/30 transition-all"
                >
                  <div className="px-4 py-2.5 bg-[#121214] border-b border-white/[0.08] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="font-mono text-[0.65rem] text-[#71717a]">
                      zflix-desktop.app · HLS 4K Player
                    </span>
                    <span className="font-mono text-[0.65rem] text-[#ff1e38] font-semibold">
                      v2.4 Live
                    </span>
                  </div>

                  <div className="relative aspect-[16/9] overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={zflix.image}
                      alt={zflix.title}
                      className="w-full h-full object-cover object-top filter brightness-[0.96] group-hover/stage:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Hover Callout */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/stage:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                      <span className="px-4 py-2 rounded-full bg-black/90 border border-white/20 text-white font-mono text-xs flex items-center gap-2 shadow-2xl">
                        <Sparkles className="w-4 h-4 text-[#ff1e38]" />
                        <span>{language === 'fr' ? "Ouvrir l'étude de cas" : 'Open Case Study'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features Checkpoints */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 font-mono text-[0.72rem] text-[#d4d4d8]">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#ff1e38] shrink-0" />
                    <span>{language === 'fr' ? 'Hubs Netflix, Disney+, HBO Max & Marvel' : 'Dedicated Netflix, Disney+ & HBO hubs'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#ff1e38] shrink-0" />
                    <span>{language === 'fr' ? 'Lecteur HLS 4K sans pub & multi-pistes' : 'Ad-free 4K HLS player with dual audio'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/[0.08]">
                <div className="flex flex-wrap gap-1.5">
                  {zflix.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[0.66rem] text-[#d4d4d8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSetActive(zflix)}
                    className="btn btn--crimson py-2 px-4 text-xs"
                  >
                    <span>{language === 'fr' ? 'Détails' : 'Details'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </motion.button>
                  {zflix.githubUrl && (
                    <motion.a
                      whileTap={{ scale: 0.92 }}
                      href={zflix.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-white transition-colors"
                      title="GitHub"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Spoti Liquid Glass (Vertical Bento Card - 4 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-4 group relative rounded-3xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            <div className="p-6 sm:p-7 flex flex-col justify-between h-full">
              <div>
                {/* Meta Top Bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full font-mono text-[0.68rem] font-semibold tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                    {spoti.categoryLabel[language]}
                  </span>
                  <span className="font-mono text-xs text-[#71717a]">
                    {spoti.year}
                  </span>
                </div>

                <h3 
                  onClick={() => handleSetActive(spoti)}
                  className="font-display font-bold text-2xl text-white tracking-tight group-hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{spoti.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-[#71717a] group-hover:text-emerald-400 transition-colors" />
                </h3>
                <p className="text-[#a1a1aa] text-xs sm:text-sm mt-1.5 font-normal leading-relaxed">
                  {spoti.tagline[language]}
                </p>

                {/* Interactive iPhone Mockup Switcher */}
                <div className="mt-4 relative rounded-2xl overflow-hidden bg-black/95 border border-white/[0.1] shadow-2xl">
                  {/* Switcher tabs */}
                  <div className="flex items-center gap-1 p-1 bg-[#121214] border-b border-white/[0.08] overflow-x-auto text-[0.62rem] font-mono">
                    {spotiScreenshots.map((shot, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setSpotiMockupIndex(sIdx)}
                        className={`px-2 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                          spotiMockupIndex === sIdx
                            ? 'bg-emerald-500/20 text-emerald-400 font-semibold'
                            : 'text-[#71717a] hover:text-white'
                        }`}
                      >
                        {shot.label}
                      </button>
                    ))}
                  </div>

                  {/* Screenshot display */}
                  <div 
                    onClick={() => handleSetActive(spoti)}
                    className="relative aspect-[4/5] overflow-hidden bg-black flex items-center justify-center cursor-pointer group/spoti"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={spotiScreenshots[spotiMockupIndex].src}
                        src={spotiScreenshots[spotiMockupIndex].src}
                        alt="Spoti Liquid Glass"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full object-cover filter brightness-[0.96] group-hover/spoti:scale-105 transition-transform duration-500"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                <div className="mt-4 space-y-1 font-mono text-[0.7rem] text-[#d4d4d8]">
                  <p className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sans jailbreak (Feather / AltStore)</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Dylib Swift &amp; Objective-C native</span>
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/[0.08]">
                <span className="font-mono text-[0.65rem] text-emerald-400 uppercase font-semibold">
                  ARM64 iOS
                </span>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSetActive(spoti)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] font-mono text-xs text-white transition-colors cursor-pointer"
                  >
                    {language === 'fr' ? 'Étude' : 'Study'}
                  </motion.button>
                  {spoti.githubUrl && (
                    <motion.a
                      whileTap={{ scale: 0.92 }}
                      href={spoti.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-white"
                      title="GitHub"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: ShopCore (Full-Width / 12 Cols Bento Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="lg:col-span-12 group relative rounded-3xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            <BorderBeam duration={14} borderWidth={1.5} colorFrom="#6366f1" colorTo="rgba(99, 102, 241, 0.2)" />

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full font-mono text-[0.68rem] font-semibold tracking-wider uppercase bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_#6366f1]" />
                      {shopcore.categoryLabel[language]}
                    </span>
                    <span className="font-mono text-xs text-[#71717a]">
                      {shopcore.year}
                    </span>
                  </div>

                  <h3 
                    onClick={() => handleSetActive(shopcore)}
                    className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight group-hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <span>{shopcore.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-[#71717a] group-hover:text-indigo-400 transition-colors" />
                  </h3>

                  <p className="text-[#a1a1aa] text-sm sm:text-base mt-2 font-normal leading-relaxed">
                    {shopcore.longDescription[language]}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5 font-mono text-[0.72rem] text-[#d4d4d8]">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{language === 'fr' ? 'Paiement hybride Stripe API & Crypto' : 'Hybrid Stripe & Crypto gateway'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{language === 'fr' ? 'Délivrance instantanée 100% webhook' : '100% automated webhook fulfillment'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {shopcore.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] font-mono text-[0.66rem] text-[#d4d4d8]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/[0.08]">
                  {shopcore.liveUrl && (
                    <motion.a
                      whileTap={{ scale: 0.95 }}
                      href={shopcore.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--crimson py-2.5 px-5 text-xs flex items-center gap-2"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{language === 'fr' ? 'Visiter shopcore.buzz' : 'Visit shopcore.buzz'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </motion.a>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSetActive(shopcore)}
                    className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] font-mono text-xs text-white transition-colors cursor-pointer"
                  >
                    {language === 'fr' ? 'Étude technique' : 'Case study'}
                  </motion.button>
                </div>
              </div>

              {/* Browser Preview Chrome */}
              <div 
                onClick={() => handleSetActive(shopcore)}
                className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-black border border-white/[0.1] shadow-2xl group/chrome cursor-pointer hover:border-white/25 transition-all"
              >
                <div className="px-4 py-2.5 bg-[#121214] border-b border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="font-mono text-[0.65rem] text-[#71717a]">
                    https://shopcore.buzz
                  </span>
                  <span className="font-mono text-[0.62rem] text-emerald-400">
                    SSL 200 OK
                  </span>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden bg-black">
                  <img
                    src={shopcore.image}
                    alt="ShopCore Platform"
                    className="w-full h-full object-cover object-top filter brightness-[0.97] group-hover/chrome:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cards 4 & 5: Z-Launcher and Z-Music (6 Cols each) */}
          {[zlauncher, zmusic].map((proj, pIdx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: pIdx * 0.1 }}
              className="lg:col-span-6 group relative rounded-3xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-6 sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full font-mono text-[0.68rem] font-semibold tracking-wider uppercase bg-white/[0.05] border border-white/[0.08] text-white">
                    {proj.categoryLabel[language]}
                  </span>
                  <span className="font-mono text-xs text-[#71717a]">
                    {proj.year}
                  </span>
                </div>

                <h3
                  onClick={() => handleSetActive(proj)}
                  className="font-display font-bold text-2xl text-white tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{proj.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-[#71717a] group-hover:text-[#ff1e38] transition-colors" />
                </h3>

                <p className="text-[#a1a1aa] text-xs sm:text-sm mt-1.5 font-normal leading-relaxed">
                  {proj.tagline[language]}
                </p>

                <div
                  onClick={() => handleSetActive(proj)}
                  className="relative mt-4 aspect-[16/9] rounded-xl overflow-hidden bg-black/90 border border-white/[0.08] cursor-pointer group/sub"
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover object-top filter brightness-[0.95] group-hover/sub:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/[0.08]">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white/[0.04] font-mono text-[0.65rem] text-[#a1a1aa]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSetActive(proj)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] font-mono text-xs text-white transition-colors cursor-pointer"
                >
                  {language === 'fr' ? 'Détails' : 'Details'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Filtered Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="group rounded-3xl bg-[#09090b] border border-white/[0.08] hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between shadow-xl p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full font-mono text-[0.66rem] uppercase tracking-wider bg-white/[0.05] text-[#d4d4d8]">
                    {project.categoryLabel[language]}
                  </span>
                  <span className="font-mono text-xs text-[#71717a]">
                    {project.year}
                  </span>
                </div>

                <h3
                  onClick={() => handleSetActive(project)}
                  className="font-display font-bold text-xl text-white tracking-tight group-hover:text-[#ff1e38] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#71717a] group-hover:text-[#ff1e38] transition-colors" />
                </h3>

                <p className="text-[#a1a1aa] text-xs sm:text-sm mt-1.5 font-normal leading-relaxed">
                  {project.tagline[language]}
                </p>

                <div
                  onClick={() => handleSetActive(project)}
                  className="relative mt-4 aspect-[16/10] rounded-xl overflow-hidden bg-black/90 border border-white/[0.08] cursor-pointer group/thumb"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top filter brightness-[0.95] group-hover/thumb:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/[0.08]">
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 2).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-white/[0.04] font-mono text-[0.62rem] text-[#71717a]">
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleSetActive(project)}
                  className="btn btn--crimson py-1.5 px-3 text-[0.7rem]"
                >
                  {language === 'fr' ? 'Consulter' : 'View'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Case Study Modal Dialog */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            key={activeProject.id}
            project={activeProject}
            onClose={() => handleSetActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
