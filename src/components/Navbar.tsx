import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { VolumeX, Menu, X } from 'lucide-react';
import { MagneticButton } from './motion/MagneticButton';

interface NavbarProps {
  isPlaying?: boolean;
  onTogglePlay?: () => void;
}

export const Navbar = ({ isPlaying, onTogglePlay }: NavbarProps) => {
  const { language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['hero', 'work', 'stack', 'method', 'about', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#work', id: 'work', label: language === 'fr' ? 'Projets' : 'Projects' },
    { href: '#stack', id: 'stack', label: language === 'fr' ? 'Stack' : 'Stack' },
    { href: '#method', id: 'method', label: language === 'fr' ? 'Méthode' : 'Process' },
    { href: '#about', id: 'about', label: language === 'fr' ? 'Bio' : 'About' },
    { href: '#contact', id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[960] transition-all duration-300 py-3 sm:py-4 px-4 sm:px-8 lg:px-12 flex items-center justify-between pointer-events-none ${
          scrolled ? 'pt-2.5 sm:pt-3' : 'pt-4 sm:pt-6'
        }`}
      >
        {/* Left: Brand Monogram with Magnetic pull */}
        <div className="pointer-events-auto flex items-center gap-3">
          <MagneticButton pullFactor={0.2}>
            <a
              href="#hero"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/[0.08] text-white hover:border-white/20 transition-all select-none"
              aria-label="Ares — retour au début"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]" />
              <span className="font-mono text-xs font-semibold tracking-tight uppercase">
                ares
              </span>
            </a>
          </MagneticButton>
        </div>

        {/* Center: Minimalist Desktop Navigation - Geometrically Centered */}
        <nav
          className="pointer-events-auto hidden md:flex items-center gap-1 p-1 rounded-full bg-black/75 backdrop-blur-xl border border-white/[0.08] font-mono text-[0.7rem] uppercase tracking-wider select-none shadow-[0_8px_30px_rgba(0,0,0,0.8)] absolute left-1/2 -translate-x-1/2"
          aria-label="Navigation principale"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full transition-colors duration-200 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.1] border border-white/[0.12] shadow-[0_0_12px_rgba(255,255,255,0.05)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Audio Control + Language Switcher + Mobile Menu Trigger */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Audio Button with Magnetic Pull */}
          {onTogglePlay && (
            <MagneticButton pullFactor={0.2}>
              <button
                type="button"
                onClick={onTogglePlay}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 text-[#a1a1aa] hover:text-white transition-all text-xs font-mono select-none cursor-pointer"
                title={isPlaying ? 'Pause audio' : 'Play audio'}
                aria-label="Contrôle audio"
              >
                {isPlaying ? (
                  <>
                    <div className="flex items-end gap-[2px] h-3 w-3 text-[#ff1e38]">
                      <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-1" />
                      <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-2" />
                      <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-3" />
                    </div>
                    <span className="text-[0.66rem] font-semibold text-white tracking-wider">
                      SOUND ON
                    </span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#71717a]" />
                    <span className="text-[0.66rem] tracking-wider">SOUND</span>
                  </>
                )}
              </button>
            </MagneticButton>
          )}

          {/* Language Switcher Pill */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/[0.08] font-mono text-[0.66rem] select-none">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white/[0.12] text-white font-bold'
                  : 'text-[#71717a] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 rounded-full transition-all cursor-pointer ${
                language === 'fr'
                  ? 'bg-white/[0.12] text-white font-bold'
                  : 'text-[#71717a] hover:text-white'
              }`}
            >
              FR
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-black/80 backdrop-blur-xl border border-white/[0.1] text-white cursor-pointer"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[950] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 pt-24 pb-12"
          >
            <nav className="flex flex-col gap-3">
              <span className="font-mono text-xs text-[#71717a] tracking-wider uppercase mb-2">
                Navigation
              </span>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display font-medium text-2xl text-white py-2 border-b border-white/[0.06] hover:text-[#ff1e38] transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-[#71717a] text-sm">↗</span>
                </a>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/[0.08]">
              <p className="font-mono text-xs text-[#71717a]">
                France · Full-Stack &amp; Systems Developer
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
