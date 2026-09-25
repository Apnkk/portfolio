import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-[#0a0a0c] border border-[rgba(237,232,221,0.14)] rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden text-left"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header gradient banner */}
          <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${project.gradient} opacity-40 pointer-events-none`} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors border border-white/10 z-20"
            aria-label="Fermer la modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="relative z-10 pt-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
                {project.categoryLabel[language]}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono">
                {project.statusLabel[language]}
              </span>
              {project.metrics && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {project.metrics[language]}
                </span>
              )}
            </div>

            <h3 id="modal-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h3>
            <p className="text-cyan-300/90 text-sm sm:text-base font-medium mt-1">
              {project.tagline[language]}
            </p>
          </div>

          {/* Modal Content */}
          <div className="relative z-10 mt-6 space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            {/* Project Image Preview */}
            {project.image && (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-top filter brightness-95"
                />
              </div>
            )}

            {/* Detailed Description */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                {language === 'fr' ? 'Présentation détaillée' : 'Detailed Overview'}
              </h4>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {project.longDescription[language]}
              </p>
            </div>

            {/* Architecture Section */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8">
              <div className="flex items-center gap-2 text-white text-xs font-bold font-mono uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{language === 'fr' ? 'Architecture technique' : 'Technical Architecture'}</span>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                {project.architecture[language]}
              </p>
            </div>

            {/* Key Features List */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                {language === 'fr' ? 'Fonctionnalités clés & Réalisations' : 'Key Features & Accomplishments'}
              </h4>
              <ul className="space-y-2.5">
                {project.features[language].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Tags */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2.5">
                {language === 'fr' ? 'Technologies utilisées' : 'Technologies Used'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300 font-mono text-xs"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-xs hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
                >
                  <span>{language === 'fr' ? 'Voir la démo live' : 'Live Demo'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/10 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Code source</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              {language === 'fr' ? 'Fermer (Échap)' : 'Close (Esc)'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
