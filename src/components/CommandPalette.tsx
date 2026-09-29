import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { audioEngine } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import {
  Terminal,
  FolderGit2,
  Sparkles,
  Mail,
  Music,
  CornerDownLeft,
  X,
  User,
  Activity,
  Layers
} from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProject?: (projectId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
  keywords?: string[];
}

interface CommandPaletteContentProps {
  onClose: () => void;
  onOpenProject?: (projectId: string) => void;
}

const CommandPaletteContent = ({ onClose, onOpenProject }: CommandPaletteContentProps) => {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToSection = (id: string) => {
    onClose();
    const el = document.getElementById(id);
    if (el) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: HTMLElement, options?: { offset?: number; duration?: number }) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(el, { offset: -40, duration: 0.9 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    onClose();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const commands: CommandItem[] = [
    {
      id: 'work',
      title: language === 'fr' ? 'Explorer les projets & études de cas' : 'Explore projects & case studies',
      category: language === 'fr' ? 'Navigation' : 'Navigation',
      icon: FolderGit2,
      action: () => scrollToSection('work'),
      badge: '5 apps',
      keywords: ['projects', 'projets', 'zflix', 'shopcore', 'spoti', 'work'],
    },
    {
      id: 'stack',
      title: language === 'fr' ? 'Architecture technique & compétences' : 'Technical stack & competencies',
      category: language === 'fr' ? 'Navigation' : 'Navigation',
      icon: Layers,
      action: () => scrollToSection('stack'),
      badge: 'React 19 / TS',
      keywords: ['stack', 'technologies', 'skills', 'react', 'node', 'swift'],
    },
    {
      id: 'method',
      title: language === 'fr' ? 'Méthodologie & Process de livraison' : 'Engineering process & workflow',
      category: language === 'fr' ? 'Navigation' : 'Navigation',
      icon: Activity,
      action: () => scrollToSection('method'),
      badge: '120 FPS',
      keywords: ['process', 'method', 'methode', 'conception', 'architecture'],
    },
    {
      id: 'about',
      title: language === 'fr' ? 'À propos d’Ares & Expériences' : 'About Ares & Experiences',
      category: language === 'fr' ? 'Navigation' : 'Navigation',
      icon: User,
      action: () => scrollToSection('about'),
      badge: 'France',
      keywords: ['about', 'bio', 'experience', 'parcours'],
    },
    {
      id: 'contact',
      title: language === 'fr' ? 'Contacter Ares / Démarrer un projet' : 'Get in touch / Start a project',
      category: language === 'fr' ? 'Navigation' : 'Navigation',
      icon: Mail,
      action: () => scrollToSection('contact'),
      badge: 'Disponible',
      keywords: ['contact', 'email', 'hire', 'message'],
    },
    {
      id: 'project-zflix',
      title: 'Z-Flix Desktop — Streaming & Hubs média',
      category: language === 'fr' ? 'Projets phares' : 'Featured Projects',
      icon: FolderGit2,
      action: () => {
        scrollToSection('work');
        if (onOpenProject) onOpenProject('zflix-desktop');
      },
      badge: 'Electron',
      keywords: ['zflix', 'streaming', 'video', 'desktop', 'hls'],
    },
    {
      id: 'project-shopcore',
      title: 'ShopCore — SaaS & E-Commerce Automatisé',
      category: language === 'fr' ? 'Projets phares' : 'Featured Projects',
      icon: FolderGit2,
      action: () => {
        scrollToSection('work');
        if (onOpenProject) onOpenProject('shopcore');
      },
      badge: 'Next.js',
      keywords: ['shopcore', 'stripe', 'crypto', 'ecommerce', 'saas'],
    },
    {
      id: 'project-spoti',
      title: 'Spoti Liquid Glass — Modding UI iOS',
      category: language === 'fr' ? 'Projets phares' : 'Featured Projects',
      icon: FolderGit2,
      action: () => {
        scrollToSection('work');
        if (onOpenProject) onOpenProject('spoti-liquid-glass');
      },
      badge: 'Swift / iOS',
      keywords: ['spotify', 'spoti', 'liquid glass', 'ios', 'swift', 'sideloading'],
    },
    {
      id: 'action-music',
      title: language === 'fr' ? 'Lecteur audio : Play / Pause' : 'Audio Player: Toggle Playback',
      category: language === 'fr' ? 'Actions interactives' : 'Interactive Actions',
      icon: Music,
      action: () => {
        audioEngine.toggle();
        onClose();
      },
      badge: 'Synth Engine',
      keywords: ['music', 'audio', 'sound', 'play', 'pause', 'son'],
    },
    {
      id: 'action-email',
      title: language === 'fr' ? "Copier l'adresse email (contact@shopcore.buzz)" : 'Copy email address',
      category: language === 'fr' ? 'Actions interactives' : 'Interactive Actions',
      icon: Mail,
      action: copyEmail,
      badge: 'Copy',
      keywords: ['copy', 'copier', 'email', 'contact'],
    },
    {
      id: 'action-github',
      title: 'GitHub — @Apnkk (10+ Repositories)',
      category: 'Socials',
      icon: GithubIcon,
      action: () => {
        window.open('https://github.com/Apnkk', '_blank');
        onClose();
      },
      badge: 'External',
      keywords: ['github', 'code', 'open source', 'git'],
    },
    {
      id: 'action-confetti',
      title: language === 'fr' ? 'Lancer les confettis ! 🎉' : 'Trigger confetti celebration! 🎉',
      category: language === 'fr' ? 'Fun' : 'Fun',
      icon: Sparkles,
      action: () => {
        triggerConfetti();
        onClose();
      },
      badge: 'Fun',
      keywords: ['confetti', 'party', 'fun', 'celebrate'],
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords?.some((k) => k.includes(q))
    );
  });

  const handleKeyDownInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const rawCmd = query.trim().toLowerCase();

      if (rawCmd === 'clear') {
        setTerminalOutput([]);
        setQuery('');
        return;
      }
      if (rawCmd === 'help') {
        setTerminalOutput([
          'Commandes CLI disponibles :',
          '  projects    - Aller à la section projets',
          '  stack       - Afficher l’arsenal technique',
          '  music       - Lancer ou couper la musique',
          '  email       - Copier l’email d’Ares',
          '  confetti    - Déclencher l’effet confetti',
          '  github      - Ouvrir le profil GitHub',
          '  clear       - Effacer l’historique',
        ]);
        setQuery('');
        return;
      }
      if (rawCmd === 'confetti') {
        triggerConfetti();
        setTerminalOutput((prev) => [...prev, '🎉 Confettis déclenchés !']);
        setQuery('');
        return;
      }
      if (rawCmd === 'music') {
        audioEngine.toggle();
        setTerminalOutput((prev) => [...prev, '🎵 Bascule de la musique effectuée']);
        setQuery('');
        return;
      }
      if (rawCmd === 'email') {
        copyEmail();
        setTerminalOutput((prev) => [...prev, '✓ Email contact@shopcore.buzz copié dans le presse-papier']);
        setQuery('');
        return;
      }

      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-16 sm:pt-28 px-4 pointer-events-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        aria-hidden="true"
      />

      {/* Palette Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ type: 'spring', visualDuration: 0.28, bounce: 0.12 }}
        className="relative w-full max-w-2xl bg-[#09090b] border border-white/[0.14] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Palette de commandes"
      >
        {/* Top Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-black/50">
          <Terminal className="w-5 h-5 text-[#ff1e38] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownInput}
            placeholder={
              language === 'fr'
                ? 'Tapez une commande ou cherchez (ex: projects, stack, music, help)...'
                : 'Type a command or search (e.g. projects, stack, music, help)...'
            }
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#71717a] font-mono focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#71717a] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Output history if any */}
        {terminalOutput.length > 0 && (
          <div className="p-3 bg-black/90 border-b border-white/[0.08] font-mono text-xs text-[#a1a1aa] space-y-1 max-h-36 overflow-y-auto">
            {terminalOutput.map((line, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#ff1e38] select-none">&gt;</span>
                <span className="text-white/90">{line}</span>
              </div>
            ))}
          </div>
        )}

        {/* List of matches */}
        <div
          ref={listRef}
          className="max-h-[360px] overflow-y-auto p-2 space-y-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-[#71717a] font-mono text-xs">
              {language === 'fr'
                ? 'Aucun résultat trouvé. Essayez "projects", "stack", "contact" ou "help".'
                : 'No results. Try typing "projects", "stack", "contact", or "help".'}
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer font-sans ${
                    isSelected
                      ? 'bg-[#ff1e38]/15 border border-[#ff1e38]/30 text-white'
                      : 'bg-transparent border border-transparent text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-[#ff1e38] text-white shadow-[0_0_8px_rgba(255,30,56,0.6)]'
                          : 'bg-white/[0.05] text-[#a1a1aa]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-medium text-white truncate">
                        {cmd.title}
                      </p>
                      <p className="font-mono text-[0.62rem] text-[#71717a] uppercase tracking-wider">
                        {cmd.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {cmd.badge && (
                      <span className="font-mono text-[0.62rem] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-[#a1a1aa]">
                        {cmd.badge}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-[#ff1e38]" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="px-4 py-2.5 bg-black/60 border-t border-white/[0.08] flex items-center justify-between font-mono text-[0.68rem] text-[#71717a]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[0.6rem]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[0.6rem]">↓</kbd>
              <span>naviguer</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[0.6rem]">↵</kbd>
              <span>exécuter</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-white text-[0.6rem]">esc</kbd>
              <span>quitter</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[#ff1e38]">
            <span>Ares Dev Console</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const CommandPalette = ({ isOpen, onClose, onOpenProject }: CommandPaletteProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <CommandPaletteContent onClose={onClose} onOpenProject={onOpenProject} />
      )}
    </AnimatePresence>
  );
};
