import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Terminal } from 'lucide-react';

interface NavbarProps {
  onToggleTerminal?: () => void;
  isPlaying?: boolean;
}

export const Navbar = ({ onToggleTerminal, isPlaying }: NavbarProps) => {
  const { language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#work', label: language === 'fr' ? 'Projets' : 'Work' },
    { href: '#next', label: language === 'fr' ? 'À venir' : 'Next' },
    { href: '#stack', label: 'Stack' },
    { href: '#method', label: language === 'fr' ? 'Méthode' : 'Method' },
    { href: '#about', label: language === 'fr' ? 'À propos' : 'About' },
    { href: '#contact', label: 'Contact', isContact: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[900] flex items-center justify-between px-6 sm:px-12 py-5 transition-all duration-400 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-md border-b border-white/[0.08]'
            : 'bg-transparent'
        }`}
      >
        {/* Logo / Monogram with spinning disc in Crimson */}
        <a
          href="#hero"
          className="inline-flex items-center gap-2.5 font-mono text-[0.82rem] tracking-wider text-[#f4f2ee] uppercase group select-none"
          aria-label="Ares — retour en haut"
        >
          <span
            className={`w-3.5 h-3.5 rounded-full border-2 border-[#ff2a3b] relative flex items-center justify-center shadow-[0_0_8px_rgba(255,42,59,0.5)] ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '2.4s' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff172d]" />
          </span>
          <span className="font-bold tracking-tight">
            ares<sup className="text-[#ff2a3b] font-normal text-[0.65em] ml-0.5">®</sup>
          </span>
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-7 font-mono text-[0.72rem] tracking-widest uppercase" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative py-1 transition-colors group ${
                link.isContact
                  ? 'text-[#ff2a3b] font-semibold hover:text-[#ff2a3b]'
                  : 'text-[#b8b3a8] hover:text-[#f4f2ee]'
              }`}
            >
              <span>{link.label}</span>
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#ff2a3b] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left shadow-[0_0_6px_rgba(255,42,59,0.8)]" />
            </a>
          ))}

          {/* Dev Terminal Icon Button */}
          {onToggleTerminal && (
            <button
              onClick={onToggleTerminal}
              className="p-1.5 text-[#797368] hover:text-[#ff2a3b] transition-colors cursor-pointer"
              title="CLI Dev"
              aria-label="Terminal CLI"
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Language Switcher: EN / FR */}
          <div className="flex items-center gap-1.5 text-[#797368] font-mono text-[0.72rem] ml-2 border-l border-white/10 pl-4">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`transition-colors hover:text-[#f4f2ee] cursor-pointer ${
                language === 'en' ? 'text-[#ff2a3b] font-bold' : 'text-[#797368]'
              }`}
            >
              EN
            </button>
            <span className="text-white/20">/</span>
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`transition-colors hover:text-[#f4f2ee] cursor-pointer ${
                language === 'fr' ? 'text-[#ff2a3b] font-bold' : 'text-[#797368]'
              }`}
            >
              FR
            </button>
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 text-[#f4f2ee]"
          aria-label="Menu"
          aria-expanded={mobileMenuOpen}
        >
          <span
            className={`w-6 h-[2px] bg-[#f4f2ee] transition-transform duration-300 ${
              mobileMenuOpen ? 'translate-y-2 rotate-45 bg-[#ff2a3b]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-[#f4f2ee] transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-[#f4f2ee] transition-transform duration-300 ${
              mobileMenuOpen ? '-translate-y-2 -rotate-45 bg-[#ff2a3b]' : ''
            }`}
          />
        </button>
      </header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[850] bg-black/95 backdrop-blur-2xl flex flex-col justify-center px-8 sm:px-16"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display font-semibold text-3xl sm:text-5xl text-[#f4f2ee] py-2 border-b border-white/[0.08] hover:text-[#ff2a3b] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4 mt-8 font-mono text-base text-[#797368]">
              <span>Lang:</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'text-[#ff2a3b] font-bold' : ''}
              >
                EN
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={language === 'fr' ? 'text-[#ff2a3b] font-bold' : ''}
              >
                FR
              </button>
            </div>

            <p className="mt-8 font-mono text-xs text-[#797368] flex items-center gap-2">
              <span className="status-dot" />
              <span>FR — Remote friendly · Open to contracts & builds</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
