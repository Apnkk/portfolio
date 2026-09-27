import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Volume2 } from 'lucide-react';

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
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = ['hero', 'work', 'lab', 'method', 'about', 'contact'];
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
    { href: '#work', id: 'work', label: language === 'fr' ? 'Projets' : 'Work' },
    { href: '#lab', id: 'lab', label: language === 'fr' ? 'Le Lab' : 'The Lab' },
    { href: '#method', id: 'method', label: language === 'fr' ? 'Méthode' : 'Method' },
    { href: '#about', id: 'about', label: language === 'fr' ? 'Bio' : 'About' },
    { href: '#contact', id: 'contact', label: 'Contact', isContact: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[900] transition-all duration-500 py-3 sm:py-4 px-4 sm:px-8 lg:px-10 flex items-center pointer-events-none ${
          scrolled ? 'pt-2.5 sm:pt-3' : 'pt-4 sm:pt-6'
        }`}
      >
        <div className="w-full relative flex items-center justify-between">
          {/* Top Left: Logo / Monogram Brand with Glowing Disc */}
          <a
            href="#hero"
            className="pointer-events-auto inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.8)] font-mono text-[0.82rem] tracking-wider text-[#f5f3ef] uppercase group select-none hover:border-[#ff1e38]/50 transition-all duration-300"
            aria-label="Ares — retour au début"
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border-2 border-[#ff1e38] relative flex items-center justify-center shadow-[0_0_10px_rgba(255,30,56,0.6)] ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '2.5s' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d46]" />
            </span>
            <span className="font-bold tracking-tight text-[#f5f3ef] group-hover:text-white transition-colors">
              ares<sup className="text-[#ff1e38] font-normal text-[0.65em] ml-0.5">®</sup>
            </span>
          </a>

          {/* Perfectly Centered: Floating Navigation Pill (Desktop PC >= lg) */}
          <nav
            className="pointer-events-auto hidden lg:flex items-center gap-1 xl:gap-1.5 p-1.5 rounded-full bg-black/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.9)] font-mono text-[0.68rem] xl:text-[0.72rem] tracking-wider uppercase select-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
            aria-label="Navigation principale"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'text-[#f5f3ef] font-semibold bg-white/[0.07] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                      : link.isContact
                      ? 'text-[#ff1e38] hover:text-white hover:bg-[#ff1e38]/15'
                      : 'text-[#b8b3a8] hover:text-[#f5f3ef] hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full border border-[#ff1e38]/40 shadow-[0_0_12px_rgba(255,30,56,0.25)] pointer-events-none"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Top Right: Sound EQ + Language Switcher */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Audio Mini Pulse Trigger */}
            {onTogglePlay && (
              <button
                type="button"
                onClick={onTogglePlay}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-xl border border-white/[0.08] hover:border-[#ff1e38]/50 text-[#b8b3a8] hover:text-[#f5f3ef] transition-all text-xs font-mono select-none cursor-pointer"
                title={isPlaying ? 'Pause audio' : 'Play audio'}
                aria-label="Contrôle audio"
              >
                {isPlaying ? (
                  <div className="flex items-end gap-[2px] h-3.5 w-3.5 text-[#ff1e38]">
                    <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-1" />
                    <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-2" />
                    <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-3" />
                  </div>
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#726d64]" />
                )}
                <span className="text-[0.68rem] tracking-wider font-semibold">
                  {isPlaying ? 'AUDIO ON' : 'AUDIO OFF'}
                </span>
              </button>
            )}

            {/* Language Switcher Pill: EN / FR */}
            <div className="inline-flex items-center p-1 rounded-full bg-black/75 backdrop-blur-xl border border-white/[0.08] font-mono text-[0.68rem] select-none">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#ff1e38] text-white font-bold shadow-[0_0_12px_rgba(255,30,56,0.6)]'
                    : 'text-[#726d64] hover:text-[#f5f3ef]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('fr')}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  language === 'fr'
                    ? 'bg-[#ff1e38] text-white font-bold shadow-[0_0_12px_rgba(255,30,56,0.6)]'
                    : 'text-[#726d64] hover:text-[#f5f3ef]'
                }`}
              >
                FR
              </button>
            </div>

            {/* Mobile / Tablet Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex flex-col items-center justify-center w-9 h-9 rounded-full bg-black/80 backdrop-blur-xl border border-white/[0.1] text-[#f5f3ef] cursor-pointer"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={`w-4 h-[1.5px] bg-[#f5f3ef] transition-transform duration-300 ${
                  mobileMenuOpen ? 'translate-y-[4.5px] rotate-45 bg-[#ff1e38]' : ''
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-[#f5f3ef] my-1 transition-opacity duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-4 h-[1.5px] bg-[#f5f3ef] transition-transform duration-300 ${
                  mobileMenuOpen ? '-translate-y-[4.5px] -rotate-45 bg-[#ff1e38]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={language === 'fr' ? 'Menu de navigation mobile' : 'Mobile navigation menu'}
            className="fixed inset-0 z-[850] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 pt-24"
          >
            {/* Crimson Atmospheric Glow */}
            <div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#ff1e38]/10 blur-[100px] pointer-events-none"
              aria-hidden="true"
            />

            <nav className="flex flex-col gap-2 relative z-10">
              <span className="mono text-xs text-[#ff1e38] tracking-widest mb-2 font-semibold">
                // NAVIGATION
              </span>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display font-semibold text-3xl sm:text-4xl text-[#f5f3ef] py-2.5 border-b border-white/[0.06] hover:text-[#ff1e38] transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-[#ff1e38] text-lg opacity-60">↗</span>
                </a>
              ))}
            </nav>

            <div className="relative z-10 space-y-4 pt-6 border-t border-white/[0.08]">
              {/* Mobile Audio Toggle */}
              {onTogglePlay && (
                <button
                  type="button"
                  onClick={onTogglePlay}
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl bg-white/[0.05] border border-white/10 font-mono text-xs text-[#f5f3ef] hover:border-[#ff1e38]/50 transition-colors"
                >
                  {isPlaying ? (
                    <div className="flex items-end gap-[2px] h-3.5 w-3.5 text-[#ff1e38]">
                      <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-1" />
                      <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-2" />
                      <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-3" />
                    </div>
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#726d64]" />
                  )}
                  <span>{isPlaying ? 'AUDIO ON (PLAYING)' : 'AUDIO OFF (MUTED)'}</span>
                </button>
              )}

              <p className="font-mono text-xs text-[#b8b3a8] flex items-center gap-2 justify-center">
                <span className="status-dot shrink-0" />
                <span>France · Full-Stack &amp; Creative Builder</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
