import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { ArrowUp, Terminal } from 'lucide-react';

interface FooterProps {
  onOpenTerminal?: () => void;
}

export const Footer = ({ onOpenTerminal }: FooterProps) => {
  const { language } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/5 py-12 px-4 max-w-6xl mx-auto mt-20 text-neutral-400 text-xs font-mono">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Made with */}
        <div className="flex flex-col sm:items-start items-center gap-1.5 text-center sm:text-left">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>{portfolioData.personal.name}</span>
          </div>
          <p className="text-neutral-500 text-[11px]">
            {language === 'fr'
              ? 'Conçu & Développé avec React 19, Tailwind CSS v4 & Motion'
              : 'Designed & Engineered with React 19, Tailwind CSS v4 & Motion'}
          </p>
        </div>

        {/* Quick Links & Terminal trigger */}
        <div className="flex items-center gap-4">
          {onOpenTerminal && (
            <button
              onClick={onOpenTerminal}
              className="flex items-center gap-1.5 text-neutral-400 hover:text-cyan-300 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Dev CLI</span>
            </button>
          )}

          <a
            href="#projects"
            className="hover:text-white transition-colors"
          >
            {language === 'fr' ? 'Projets' : 'Projects'}
          </a>

          <a
            href="#contact"
            className="hover:text-white transition-colors"
          >
            Contact
          </a>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors border border-white/10 ml-2"
            title={language === 'fr' ? 'Retour en haut' : 'Back to top'}
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 text-center text-[10px] text-neutral-600 flex items-center justify-center gap-1">
        <span>© {new Date().getFullYear()} {portfolioData.personal.name}.</span>
        <span>•</span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  );
};
