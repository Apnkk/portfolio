import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { GithubIcon } from './icons/BrandIcons';
import { 
  X, 
  ExternalLink, 
  CheckCircle, 
  Layers, 
  Activity 
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const { language } = useLanguage();

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
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full max-w-2xl bg-[#06060a] border border-white/[0.1] rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 my-8 overflow-hidden text-left"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Top subtle crimson gradient aura */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-[#ff1e38]/18 via-[#ff1e38]/5 to-transparent opacity-70 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-[#ff1e38] text-[#b8b3a8] hover:text-white transition-all border border-white/10 z-20 cursor-pointer"
            aria-label="Fermer la modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="relative z-10 pt-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#ff1e38]/15 border border-[#ff1e38]/30 text-[#ff1e38] text-xs font-mono font-semibold shadow-[0_0_12px_rgba(255,30,56,0.3)]">
                {project.categoryLabel[language]}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#c2bdb3] text-xs font-mono">
                {project.statusLabel[language]}
              </span>
              {project.metrics && (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#f5f3ef] text-xs font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#ff1e38]" />
                  {project.metrics[language]}
                </span>
              )}
            </div>

            <h3 id="modal-title" className="text-2xl sm:text-4xl font-extrabold text-[#f5f3ef] tracking-tight">
              {project.title}
            </h3>
            <p className="text-[#ff1e38] text-sm sm:text-base font-medium mt-1">
              {project.tagline[language]}
            </p>
          </div>

          {/* Modal Content */}
          <div className="relative z-10 mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {/* Project Image Preview */}
            {project.image && (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top filter brightness-95"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}

            {/* Detailed Description */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#726d64] mb-2 font-semibold">
                {language === 'fr' ? 'Présentation détaillée' : 'Detailed Overview'}
              </h4>
              <p className="text-[#b8b3a8] text-sm leading-relaxed">
                {project.longDescription[language]}
              </p>
            </div>

            {/* Architecture Section */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center gap-2 text-white text-xs font-bold font-mono uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4 text-[#ff1e38]" />
                <span>{language === 'fr' ? 'Architecture technique' : 'Technical Architecture'}</span>
              </div>
              <p className="text-[#b8b3a8] text-xs sm:text-sm leading-relaxed">
                {project.architecture[language]}
              </p>
            </div>

            {/* Key Features List */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#726d64] mb-3 font-semibold">
                {language === 'fr' ? 'Fonctionnalités clés & Réalisations' : 'Key Features & Accomplishments'}
              </h4>
              <ul className="space-y-2.5">
                {project.features[language].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#f5f3ef]">
                    <CheckCircle className="w-4 h-4 text-[#ff1e38] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Tags */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#726d64] mb-2.5 font-semibold">
                {language === 'fr' ? 'Technologies utilisées' : 'Technologies Used'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[#c2bdb3] font-mono text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer / CTAs */}
          <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--crimson py-2.5 px-4 text-xs font-mono"
                >
                  <span>{language === 'fr' ? 'Voir en direct' : 'Live Demo'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost py-2.5 px-4 text-xs font-mono"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Code GitHub</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs text-[#726d64] hover:text-[#f5f3ef] transition-colors font-mono cursor-pointer"
            >
              {language === 'fr' ? 'Fermer [Échap]' : 'Close [Esc]'}
            </button>
          </div>
        </motion.div>
      </div>
  );
};
