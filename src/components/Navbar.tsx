import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { Globe, Menu, X, Terminal, ArrowUpRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onToggleTerminal?: () => void;
}

export const Navbar = ({ onToggleTerminal }: NavbarProps) => {
  const { language, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { href: '#about', label: language === 'fr' ? 'À propos' : 'About', id: 'about' },
    { href: '#projects', label: language === 'fr' ? 'Projets' : 'Projects', id: 'projects' },
    { href: '#skills', label: language === 'fr' ? 'Compétences' : 'Skills', id: 'skills' },
    { href: '#experience', label: language === 'fr' ? 'Parcours' : 'Journey', id: 'experience' },
    { href: '#contact', label: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Simple active section detection
      const sections = ['hero', 'about', 'projects', 'skills', 'experience', 'contact'];
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 pointer-events-none">
      <nav
        className={`pointer-events-auto w-full max-w-5xl transition-all duration-300 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border ${
          scrolled
            ? 'bg-[#0d0d14]/85 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/60'
            : 'bg-[#0e0e16]/60 backdrop-blur-md border-white/8'
        }`}
        aria-label="Navigation principale"
      >
        {/* Monogram / Brand */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg py-1 px-1.5"
        >
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-mono font-bold text-white text-sm shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span>A</span>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0d0d14] animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              {portfolioData.personal.name}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline-block">
              {language === 'fr' ? 'Full-Stack Dev' : 'Full-Stack Eng.'}
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <ul className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full px-3 py-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/15"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right Actions: Lang, Terminal, Contact */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Interactive Terminal shortcut */}
          {onToggleTerminal && (
            <button
              onClick={onToggleTerminal}
              className="p-2 text-neutral-400 hover:text-cyan-300 hover:bg-white/5 rounded-full transition-colors border border-transparent hover:border-white/10"
              title={language === 'fr' ? 'Ouvrir le terminal dev' : 'Open dev terminal'}
              aria-label="Terminal"
            >
              <Terminal className="w-4 h-4" />
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-neutral-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full transition-all hover:border-cyan-500/40"
            title={language === 'fr' ? 'Passer en anglais' : 'Switch to French'}
            aria-label="Changer de langue"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase">{language}</span>
          </button>

          {/* Quick Contact CTA */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/25 transition-all shadow-sm shadow-cyan-500/10 active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'fr' ? 'Collaborer' : "Let's talk"}</span>
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white rounded-full hover:bg-white/5 border border-white/5"
            aria-label="Menu mobile"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto md:hidden absolute top-20 left-4 right-4 bg-[#0d0d14]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 z-50"
          >
            <div className="flex flex-col gap-1 pb-3 border-b border-white/5">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === link.id
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'text-neutral-300 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-400">
                {language === 'fr' ? 'Langue du site :' : 'Site language:'}
              </span>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-white bg-white/10 rounded-lg border border-white/10"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="uppercase">{language === 'fr' ? 'Français' : 'English'}</span>
              </button>
            </div>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25"
            >
              <span>{language === 'fr' ? 'Me contacter' : 'Contact me'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
