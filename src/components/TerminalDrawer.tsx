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
        <div className="text-neutral-300 space-y-1">
          <p className="text-cyan-400 font-bold">
            🚀 {portfolioData.personal.name} - Interactive CLI v2.4
          </p>
          <p className="text-neutral-400 text-xs">
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
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
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
          <div className="space-y-1 text-xs text-neutral-300">
            <p><span className="text-cyan-400 font-bold">bio</span> - {language === 'fr' ? 'Présentation personnelle' : 'Short bio'}</p>
            <p><span className="text-cyan-400 font-bold">projects</span> - {language === 'fr' ? 'Liste des réalisations' : 'List featured projects'}</p>
            <p><span className="text-cyan-400 font-bold">skills</span> - {language === 'fr' ? 'Stack technique' : 'Technical stack'}</p>
            <p><span className="text-cyan-400 font-bold">contact</span> - {language === 'fr' ? 'Canaux de communication' : 'Get contact channels'}</p>
            <p><span className="text-cyan-400 font-bold">email</span> - {language === 'fr' ? "Copie l'email" : 'Copy email to clipboard'}</p>
            <p><span className="text-cyan-400 font-bold">clear</span> - {language === 'fr' ? "Efface l'écran" : 'Clear screen'}</p>
            <p><span className="text-cyan-400 font-bold">exit</span> - {language === 'fr' ? 'Ferme le terminal' : 'Close terminal'}</p>
          </div>
        );
        break;

      case 'bio':
        res = (
          <p className="text-xs text-neutral-300 leading-relaxed">
            {portfolioData.personal.fullBio[language]}
          </p>
        );
        break;

      case 'projects':
        res = (
          <div className="space-y-2 text-xs">
            {portfolioData.projects.map((p, i) => (
              <div key={p.id} className="flex flex-col">
                <span className="text-cyan-300 font-semibold">{i + 1}. {p.title} ({p.tags.slice(0, 3).join(', ')})</span>
                <span className="text-neutral-400">{p.tagline[language]}</span>
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
                <span className="text-purple-400 font-mono font-bold">[{c.title[language]}]</span>{' '}
                <span className="text-neutral-300">{c.skills.map(s => s.name).join(' • ')}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        res = (
          <div className="space-y-1 text-xs">
            <p className="text-emerald-400 font-semibold">{portfolioData.personal.availability.text[language]}</p>
            <p className="text-neutral-300">Email: {portfolioData.personal.email}</p>
            <p className="text-neutral-300">GitHub: {portfolioData.socials.find(s => s.name === 'GitHub')?.url}</p>
            <p className="text-neutral-300">LinkedIn: {portfolioData.socials.find(s => s.name === 'LinkedIn')?.url}</p>
          </div>
        );
        break;

      case 'email':
        navigator.clipboard.writeText(portfolioData.personal.email);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
        res = (
          <p className="text-emerald-400 text-xs">
            ✔ {language === 'fr' ? 'Email copié dans le presse-papiers :' : 'Email copied to clipboard:'} {portfolioData.personal.email}
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
          <p className="text-amber-400 text-xs font-mono">
            {language === 'fr'
              ? 'Bien tenté ! Vous possédez déjà tous les privilèges invités sur ce portfolio.'
              : 'Nice try! You already have full guest root privileges.'}
          </p>
        );
        break;

      default:
        res = (
          <p className="text-rose-400 text-xs">
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
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#09090f] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col font-mono text-xs sm:text-sm text-neutral-300"
        >
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#11111a] border-b border-white/10 select-none">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-neutral-400 text-xs flex items-center gap-1.5 font-medium">
                <TerminalIcon className="w-3.5 h-3.5 text-cyan-400" />
                portfolio-shell ~ zsh
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors"
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
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-neutral-400 hover:text-cyan-300 text-[11px] transition-colors border border-white/5"
              >
                ${c}
              </button>
            ))}
          </div>

          {/* Terminal Body */}
          <div className="p-4 sm:p-5 h-[340px] overflow-y-auto space-y-4">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
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
            className="flex items-center gap-2 px-4 py-3 bg-[#0d0d16] border-t border-white/10"
          >
            <span className="text-cyan-400 font-bold select-none">ares@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={language === 'fr' ? "Tapez une commande (ex: 'projects', 'help')..." : "Type a command (e.g. 'projects', 'help')..."}
              className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs sm:text-sm placeholder:text-neutral-600"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
