import { useState, useEffect, useRef, type ReactNode, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { Terminal as TerminalIcon, X, CornerDownLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandOutput {
  command: string;
  output: ReactNode;
}

export const TerminalDrawer = ({ isOpen, onClose }: TerminalDrawerProps) => {
  const { language } = useLanguage();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>(() => [
    {
      command: 'welcome',
      output: (
        <div className="text-[#b8b3a8] space-y-1">
          <p className="text-[#ff2a3b] font-bold">
            &gt; {portfolioData.personal.name} ~ dev-cli v2.4 [OLED Crimson]
          </p>
          <p className="text-[#797368] text-xs">
            {language === 'fr'
              ? "Tapez 'help' pour voir les commandes disponibles ou cliquez sur une suggestion ci-dessous."
              : "Type 'help' to inspect available commands or click a chip below."}
          </p>
        </div>
      ),
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let res: React.ReactNode = null;

    switch (trimmed) {
      case 'help':
        res = (
          <div className="space-y-1 text-xs text-[#b8b3a8]">
            <p><span className="text-[#ff2a3b] font-bold">bio</span> - {language === 'fr' ? 'Présentation personnelle' : 'Short bio'}</p>
            <p><span className="text-[#ff2a3b] font-bold">projects</span> - {language === 'fr' ? 'Liste des réalisations' : 'List featured projects'}</p>
            <p><span className="text-[#ff2a3b] font-bold">skills</span> - {language === 'fr' ? 'Stack technique' : 'Technical stack'}</p>
            <p><span className="text-[#ff2a3b] font-bold">music</span> - {language === 'fr' ? 'Morceaux audio' : 'Original tracks'}</p>
            <p><span className="text-[#ff2a3b] font-bold">contact</span> - {language === 'fr' ? 'Canaux de communication' : 'Get contact channels'}</p>
            <p><span className="text-[#ff2a3b] font-bold">email</span> - {language === 'fr' ? "Copie l'email" : 'Copy email to clipboard'}</p>
            <p><span className="text-[#ff2a3b] font-bold">clear</span> - {language === 'fr' ? "Efface l'écran" : 'Clear screen'}</p>
            <p><span className="text-[#ff2a3b] font-bold">exit</span> - {language === 'fr' ? 'Ferme le terminal' : 'Close terminal'}</p>
          </div>
        );
        break;

      case 'bio':
        res = (
          <p className="text-xs text-[#b8b3a8] leading-relaxed">
            {portfolioData.personal.fullBio[language]}
          </p>
        );
        break;

      case 'projects':
        res = (
          <div className="space-y-2 text-xs">
            {portfolioData.projects.map((p, i) => (
              <div key={p.id} className="flex flex-col">
                <span className="text-[#ff4d5a] font-semibold">{i + 1}. {p.title} ({p.tags.slice(0, 3).join(', ')})</span>
                <span className="text-[#797368]">{p.tagline[language]}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'skills':
        res = (
          <div className="space-y-1.5 text-xs">
            {portfolioData.skills.map((c) => (
              <div key={c.id}>
                <span className="text-[#ff2a3b] font-mono font-bold">[{c.title[language]}]</span>{' '}
                <span className="text-[#b8b3a8]">{c.skills.map(s => s.name).join(' • ')}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'music':
      case 'audio':
      case 'songs':
      case 'tracks':
        res = (
          <div className="space-y-1.5 text-xs text-[#b8b3a8]">
            <p className="text-[#ff2a3b] font-bold font-mono">
              &gt; Ares Soundlab ~ Tracks
            </p>
            <div className="space-y-1 pl-2">
              <p className="text-neutral-200">01. <span className="text-white font-semibold">DEAR BLACK</span> <span className="text-[#797368] font-mono">(0:21)</span></p>
              <p className="text-neutral-200">02. <span className="text-white font-semibold">JANE YOUR EARLY</span> <span className="text-[#797368] font-mono">(0:23)</span></p>
              <p className="text-neutral-200">03. <span className="text-white font-semibold">SEGA</span> <span className="text-[#797368] font-mono">(0:12)</span></p>
            </div>
            <p className="text-[#797368] text-[11px] pt-1">
              {language === 'fr'
                ? '🎧 Écoutez les morceaux via le lecteur audio en bas à droite.'
                : '🎧 Listen to tracks via the audio dock player at bottom right.'}
            </p>
          </div>
        );
        break;

      case 'contact':
        res = (
          <div className="space-y-1 text-xs">
            <p className="text-[#2ee59d] font-semibold">{portfolioData.personal.availability.text[language]}</p>
            <p className="text-[#b8b3a8]">Email: {portfolioData.personal.email}</p>
            <p className="text-[#b8b3a8]">GitHub: {portfolioData.socials.find(s => s.name === 'GitHub')?.url}</p>
            <p className="text-[#b8b3a8]">Discord: {portfolioData.socials.find(s => s.name === 'Discord')?.url}</p>
          </div>
        );
        break;

      case 'email':
        navigator.clipboard.writeText(portfolioData.personal.email);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 }, colors: ['#ff2a3b', '#ff6b78', '#ffffff'] });
        res = (
          <p className="text-[#2ee59d] text-xs font-mono">
            [OK] {language === 'fr' ? 'Email copié dans le presse-papiers :' : 'Email copied to clipboard:'} {portfolioData.personal.email}
          </p>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        onClose();
        return;

      case 'sudo':
        res = (
          <p className="text-[#ff2a3b] text-xs font-mono">
            {language === 'fr'
              ? 'Bien tenté ! Vous possédez déjà tous les privilèges invités sur ce portfolio.'
              : 'Nice try! You already have full guest root privileges.'}
          </p>
        );
        break;

      default:
        res = (
          <p className="text-[#ff4d5a] text-xs">
            {language === 'fr'
              ? `Commande inconnue: '${trimmed}'. Tapez 'help' pour voir les commandes disponibles.`
              : `Unknown command: '${trimmed}'. Type 'help' for available commands.`}
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: cmd, output: res }]);
    setInputVal('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    handleCommand(inputVal);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#060608] border border-[#ff2a3b]/30 rounded-2xl shadow-[0_20px_60px_rgba(255,42,59,0.15)] overflow-hidden z-10 flex flex-col font-mono text-xs sm:text-sm text-[#f4f2ee]"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d12] border-b border-white/10 select-none">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff2a3b]" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="ml-2 text-[#b8b3a8] text-xs flex items-center gap-1.5 font-medium">
                <TerminalIcon className="w-3.5 h-3.5 text-[#ff2a3b]" />
                ares-shell ~ zsh
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-[#797368] hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick command pills */}
          <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex flex-wrap gap-1.5">
            {['help', 'bio', 'projects', 'skills', 'contact', 'email', 'clear'].map((c) => (
              <button
                key={c}
                onClick={() => handleCommand(c)}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-[#ff2a3b]/20 text-[#b8b3a8] hover:text-[#ff4d5a] text-[11px] transition-colors border border-white/5 cursor-pointer"
              >
                ${c}
              </button>
            ))}
          </div>

          {/* Terminal Body */}
          <div className="p-4 sm:p-5 h-[340px] overflow-y-auto space-y-4">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#ff2a3b] font-bold">
                  <span>ares@portfolio:~$</span>
                  <span className="text-white font-normal">{item.command}</span>
                </div>
                <div className="pl-4">{item.output}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Command Prompt Input */}
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 px-4 py-3 bg-[#0a0a0f] border-t border-white/10"
          >
            <span className="text-[#ff2a3b] font-bold select-none">ares@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={language === 'fr' ? "Tapez une commande (ex: 'projects', 'help')..." : "Type a command (e.g. 'projects', 'help')..."}
              className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs sm:text-sm placeholder:text-[#555]"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-[#ff2a3b]/20 hover:bg-[#ff2a3b]/30 text-[#ff4d5a] transition-colors cursor-pointer"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
