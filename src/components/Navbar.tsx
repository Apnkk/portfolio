import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#work', label: language === 'fr' ? 'PROJETS' : 'PROJECTS' },
    { href: '#z-music', label: 'Z-MUSIC' },
    { href: '#stack', label: 'STACK' },
    { href: '#about', label: language === 'fr' ? 'À PROPOS' : 'ABOUT' },
    { href: '#contact', label: 'CONTACT', isAccent: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-[var(--pad)] py-4 flex items-center justify-between ${
          scrolled
            ? 'bg-[rgba(10,9,8,0.85)] backdrop-blur-md border-b border-[var(--line)] py-3'
            : 'bg-transparent'
        }`}
      >
        {/* Left: Brand Monogram */}
        <a
          href="#top"
          className="flex items-center gap-2 select-none group"
          aria-label="Ares — Accueil"
        >
          {/* Amber Ring Mark */}
          <span className="w-3.5 h-3.5 rounded-full border-[1.5px] border-[var(--amber)] flex items-center justify-center shrink-0">
            <span className="w-1 h-1 rounded-full bg-[var(--amber)]" />
          </span>
          <span className="font-display font-semibold text-sm tracking-tight text-[var(--cream)] group-hover:text-[var(--amber)] transition-colors">
            ares®
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-7 font-mono text-[0.72rem] tracking-widest uppercase select-none"
          aria-label="Navigation principale"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                link.isAccent
                  ? 'text-[var(--amber)] hover:text-white font-medium'
                  : 'text-[var(--cream-dim)] hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="text-[var(--muted)] hover:text-white transition-colors cursor-pointer pl-2"
          >
            <span className={language === 'en' ? 'text-[var(--cream)] font-bold' : ''}>EN</span>
            <span className="mx-1 opacity-40">/</span>
            <span className={language === 'fr' ? 'text-[var(--cream)] font-bold' : ''}>FR</span>
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="font-mono text-xs text-[var(--cream-dim)]"
          >
            {language.toUpperCase()}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 text-[var(--cream)]"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--bg)] flex flex-col justify-center items-center gap-6 p-6 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`font-display font-semibold text-2xl tracking-tight ${
                link.isAccent ? 'text-[var(--amber)]' : 'text-[var(--cream)]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
};
