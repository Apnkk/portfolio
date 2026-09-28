import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, ExternalLink, Activity } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const { language } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [project]);

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

  const currentImage =
    project.gallery && project.gallery[activeImageIndex]
      ? project.gallery[activeImageIndex]
      : project.image;

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        aria-hidden="true"
      />

      {/* Modal Dialog: Cinematic Lightbox */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl lg:max-w-5xl bg-[#09090b] border border-white/[0.12] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 my-6 overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-7 border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white text-[0.68rem] font-mono uppercase tracking-wider">
                {project.categoryLabel[language]}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[0.68rem] font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                {project.statusLabel[language]}
              </span>
              {project.metrics && (
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#a1a1aa] text-[0.68rem] font-mono flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-[#ff1e38]" />
                  {project.metrics[language]}
                </span>
              )}
            </div>

            <h3 id="modal-title" className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              {project.title}
            </h3>
            <p className="text-[#a1a1aa] text-xs sm:text-sm font-normal max-w-2xl leading-relaxed">
              {project.tagline[language]}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer shrink-0 border border-white/[0.08]"
            aria-label={language === 'fr' ? 'Fermer la boîte de dialogue' : 'Close dialog'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cinematic Media Stage (Full Focus) */}
        <div className="p-4 sm:p-6 bg-black/60">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.1] bg-black shadow-2xl flex items-center justify-center">
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
              <img
                src={currentImage}
                alt={project.title}
                className="w-full h-full object-cover object-top filter brightness-[0.98] transition-all duration-300"
                loading="eager"
              />
            ) : null}
          </div>

          {/* Interactive Gallery Thumbnails (if available, e.g. Spoti Liquid Glass) */}
          {project.gallery && project.gallery.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pt-3 pb-1">
              {project.gallery.map((imgUrl, gIdx) => (
                <button
                  key={gIdx}
                  type="button"
                  onClick={() => setActiveImageIndex(gIdx)}
                  className={`relative aspect-[16/10] w-20 sm:w-24 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                    activeImageIndex === gIdx
                      ? 'border-[#ff1e38] ring-2 ring-[#ff1e38]/40 scale-105'
                      : 'border-white/[0.1] opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Preview ${gIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Compact Spec Strip & Quick Action Bar */}
        <div className="p-5 sm:p-6 bg-[#09090b] border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Tech Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#d4d4d8] font-mono text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Direct Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--crimson py-2.5 px-5 text-xs font-mono font-medium tracking-wider uppercase flex items-center gap-2"
              >
                <span>{language === 'fr' ? 'Accéder au produit' : 'Live Platform'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost py-2.5 px-4 text-xs font-mono font-medium flex items-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="text-xs text-[#71717a] hover:text-white transition-colors font-mono cursor-pointer ml-1 hidden sm:inline-block"
            >
              [Échap]
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
