import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  ExternalLink, 
  Activity, 
  Check, 
  Layers, 
  Cpu, 
  Sparkles
} from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';
import { BorderBeam } from './motion/BorderBeam';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const { language } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    return () => {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  const galleryImages = project.gallery && project.gallery.length > 0 
    ? project.gallery 
    : project.image ? [project.image] : [];

  const currentImage = galleryImages[activeImageIndex] || project.image;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', visualDuration: 0.32, bounce: 0.12 }}
        className="relative w-full max-w-4xl lg:max-w-5xl bg-[#09090b] border border-white/[0.12] rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] z-10 my-6 overflow-hidden text-left flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <BorderBeam duration={16} borderWidth={1.5} colorFrom="#ff1e38" colorTo="rgba(255, 30, 56, 0.2)" />

        {/* Header Bar */}
        <div className="p-5 sm:p-7 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-[#0d0d10] shrink-0">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white text-[0.68rem] font-mono uppercase tracking-wider">
                {project.categoryLabel[language]}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[0.68rem] font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                {project.statusLabel[language]}
              </span>
              {project.metrics && (
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[#d4d4d8] text-[0.68rem] font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#ff1e38]" />
                  {project.metrics[language]}
                </span>
              )}
            </div>

            <h3 id="modal-title" className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">
              {project.title}
            </h3>
            <p className="text-[#a1a1aa] text-xs sm:text-sm font-normal max-w-2xl leading-relaxed">
              {project.tagline[language]}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer shrink-0 border border-white/[0.08]"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-8 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
          {/* Media Stage */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/[0.1] bg-black shadow-2xl flex items-center justify-center">
              {project.video ? (
                <video
                  src={project.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              ) : currentImage ? (
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={project.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover object-top filter brightness-[0.98]"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Gallery Thumbnails if multiple images */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                {galleryImages.map((imgUrl, gIdx) => (
                  <button
                    key={gIdx}
                    type="button"
                    onClick={() => setActiveImageIndex(gIdx)}
                    className={`relative aspect-[16/10] w-20 sm:w-24 rounded-xl overflow-hidden border transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === gIdx
                        ? 'border-[#ff1e38] ring-2 ring-[#ff1e38]/40 scale-105'
                        : 'border-white/[0.1] opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${gIdx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Deep Case Study Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Long Story & Features */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h4 className="font-display font-semibold text-lg text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff1e38]" />
                  <span>{language === 'fr' ? 'Contexte & Solution' : 'Context & Solution'}</span>
                </h4>
                <p className="text-sm text-[#d4d4d8] leading-relaxed font-normal">
                  {project.longDescription[language]}
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="font-display font-semibold text-lg text-white mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'fr' ? 'Fonctionnalités clés' : 'Key Features'}</span>
                </h4>
                <ul className="space-y-2">
                  {project.features[language].map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#a1a1aa] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shrink-0 mt-1.5 shadow-[0_0_4px_#ff1e38]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architecture overview */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08]">
                <h5 className="font-mono text-xs text-[#a1a1aa] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#ff1e38]" />
                  <span>{language === 'fr' ? 'Architecture système' : 'System Architecture'}</span>
                </h5>
                <p className="font-mono text-xs text-white/90 leading-relaxed">
                  {project.architecture[language]}
                </p>
              </div>
            </div>

            {/* Right Column: Tech Specs & Direct Links */}
            <div className="lg:col-span-5 space-y-6">
              {/* Technologies */}
              <div className="p-5 rounded-2xl bg-[#111115] border border-white/[0.08] space-y-4">
                <h4 className="font-mono text-xs text-[#a1a1aa] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#ff1e38]" />
                  <span>{language === 'fr' ? 'Technologies utilisées' : 'Technologies'}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/[0.08] text-xs font-mono text-[#d4d4d8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Meta Card */}
              <div className="p-5 rounded-2xl bg-[#111115] border border-white/[0.08] space-y-3 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-[#71717a]">Année</span>
                  <span className="text-white">{project.year || '2024 - 2026'}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-[#71717a]">Statut</span>
                  <span className="text-emerald-400 font-semibold">{project.statusLabel[language]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">Licence / Accès</span>
                  <span className="text-white">Production</span>
                </div>
              </div>

              {/* Call to action links */}
              <div className="space-y-2 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn btn--crimson py-3 px-5 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <span>{language === 'fr' ? 'Accéder au produit en ligne' : 'Visit Live Platform'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn btn--ghost py-3 px-5 text-xs font-mono flex items-center justify-center gap-2"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Consulter le code source' : 'View Source Code'}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
