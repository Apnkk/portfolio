import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { X, ExternalLink, Check, Layers, Activity } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';

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

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#09090b] border border-white/[0.12] rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-10 my-8 overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer z-20"
          aria-label={language === 'fr' ? 'Fermer la boîte de dialogue' : 'Close dialog'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white text-xs font-mono font-medium">
              {project.categoryLabel[language]}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {project.statusLabel[language]}
            </span>
            {project.metrics && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#a1a1aa] text-xs font-mono flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-[#ff1e38]" />
                {project.metrics[language]}
              </span>
            )}
          </div>

          <h3 id="modal-title" className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
            {project.title}
          </h3>
          <p className="text-[#a1a1aa] text-sm mt-1.5">
            {project.tagline[language]}
          </p>
        </div>

        {/* Modal Scrollable Content */}
        <div className="mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {/* Media Viewport (Video or Screenshot with Gallery support) */}
          {project.video ? (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.08] bg-black">
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : (project.gallery && project.gallery.length > 0) || project.image ? (
            <div className="space-y-3">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/[0.08] bg-black">
                <img
                  src={
                    project.gallery && project.gallery[activeImageIndex]
                      ? project.gallery[activeImageIndex]
                      : project.image
                  }
                  alt={project.title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Gallery Thumbnails Selector */}
              {project.gallery && project.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {project.gallery.map((imgUrl, gIdx) => (
                    <button
                      key={gIdx}
                      type="button"
                      onClick={() => setActiveImageIndex(gIdx)}
                      className={`relative aspect-[16/10] w-20 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                        activeImageIndex === gIdx
                          ? 'border-[#ff1e38] ring-2 ring-[#ff1e38]/30 scale-105'
                          : 'border-white/[0.1] opacity-60 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Preview ${gIdx + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* Detailed Overview */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#71717a] mb-2 font-medium">
              {language === 'fr' ? 'Présentation' : 'Overview'}
            </h4>
            <p className="text-[#d4d4d8] text-sm leading-relaxed">
              {project.longDescription[language]}
            </p>
          </div>

          {/* Technical Architecture */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2 text-white text-xs font-medium font-mono uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-[#ff1e38]" />
              <span>{language === 'fr' ? 'Architecture technique' : 'Technical Architecture'}</span>
            </div>
            <p className="text-[#a1a1aa] text-xs sm:text-sm leading-relaxed">
              {project.architecture[language]}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#71717a] mb-3 font-medium">
              {language === 'fr' ? 'Fonctionnalités clés' : 'Key Features'}
            </h4>
            <ul className="space-y-2">
              {project.features[language].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#d4d4d8]">
                  <Check className="w-4 h-4 text-[#ff1e38] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#71717a] mb-2 font-medium">
              {language === 'fr' ? 'Technologies' : 'Technologies'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[#d4d4d8] font-mono text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--crimson py-2 px-4 text-xs font-mono"
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
                className="btn btn--ghost py-2 px-4 text-xs font-mono"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-xs text-[#71717a] hover:text-white transition-colors font-mono cursor-pointer"
          >
            {language === 'fr' ? 'Fermer [Échap]' : 'Close [Esc]'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
