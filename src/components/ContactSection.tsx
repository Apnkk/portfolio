import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './motion/ScrollReveal';
import confetti from 'canvas-confetti';
import { Copy, Check, ExternalLink } from 'lucide-react';

export const ContactSection = () => {
  const { language } = useLanguage();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f2a33c', '#ede8dd', '#ff3d2e'],
    });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="contact"
      className="relative z-10 pt-[clamp(80px,13vh,160px)] pb-12 px-[var(--pad)] bg-[var(--bg)] border-t border-[var(--line)]"
      aria-label="Contact"
    >
      <div className="max-w-6xl mx-auto text-center">
        <ScrollReveal y={40} blur={8} amount={0.25}>
          {/* Kicker */}
          <div className="font-mono text-[0.72rem] tracking-widest text-[var(--amber)] uppercase mb-6">
            06 / CONTACT
          </div>

          {/* Giant Headline */}
          <h2 className="font-display font-semibold text-[clamp(2.8rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.03em] text-[var(--cream)] uppercase select-none mb-12">
            <span className="block">Un projet</span>
            <span className="block">qui demande du</span>
            <span className="block outline-amber font-normal italic">
              volume ?
            </span>
          </h2>
        </ScrollReveal>

        {/* Action Link Pills */}
        <ScrollReveal as="div" className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-[0.75rem] tracking-widest uppercase mb-20 text-[var(--cream-dim)]" delay={0.1} amount={0.3}>
          <a
            href="https://github.com/Apnkk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[var(--amber)] transition-colors py-2 px-3 rounded-md hover:bg-[var(--surface)]"
          >
            <span>GITHUB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => copyToClipboard('ares', 'discord')}
            className="flex items-center gap-2 hover:text-[var(--amber)] transition-colors py-2 px-3 rounded-md hover:bg-[var(--surface)] cursor-pointer"
          >
            <span>DISCORD — ARES</span>
            {copiedItem === 'discord' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-60" />
            )}
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard('contact@shopcore.buzz', 'email')}
            className="flex items-center gap-2 hover:text-[var(--amber)] transition-colors py-2 px-3 rounded-md hover:bg-[var(--surface)] cursor-pointer"
          >
            <span>EMAIL — CONTACT@SHOPCORE.BUZZ</span>
            {copiedItem === 'email' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-60" />
            )}
          </button>
        </ScrollReveal>

        {/* Footer Meta Bar */}
        <div className="pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[0.68rem] tracking-wider text-[var(--muted)] uppercase">
          <div>
            © 2026 ARES
          </div>

          <div className="text-[var(--cream-dim)]">
            REACT 19 · THREE.JS · WEB AUDIO
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-[var(--cream)] transition-colors cursor-pointer"
          >
            {language === 'fr' ? 'HAUT DE PAGE ↑' : 'BACK TO TOP ↑'}
          </button>
        </div>
      </div>
    </section>
  );
};
