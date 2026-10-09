import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './motion/ScrollReveal';
import { MagneticButton } from './motion/MagneticButton';
import confetti from 'canvas-confetti';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';

const EMAIL = 'contact@shopcore.buzz';

const SOCIALS = [
  {
    id: 'github',
    label: 'GitHub',
    value: '@Apnkk',
    href: 'https://github.com/Apnkk',
  },
  {
    id: 'discord',
    label: 'Discord',
    value: 'ares',
    href: 'https://discord.com/users/498671450996342794',
  },
] as const;

export const ContactSection = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff1e38', '#f5eeee', '#b3a9a9'],
    });
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
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
      <div className="max-w-6xl mx-auto">
        <ScrollReveal y={40} blur={8} amount={0.25}>
          <div className="text-center">
            <div className="font-mono text-[0.72rem] tracking-widest text-[var(--amber)] uppercase mb-6">
              06 / CONTACT
            </div>

            <h2 className="font-display font-semibold leading-[0.95] tracking-[-0.03em] text-[var(--cream)] uppercase select-none mb-8">
              <span className="block mb-4 font-medium text-[clamp(0.9rem,2vw,1.4rem)] tracking-[0.22em] text-[var(--cream-dim)]">
                {isFr ? 'Un projet en tête ?' : 'Got a project in mind?'}
              </span>
              <span className="block outline-amber font-normal italic text-[clamp(2rem,8.5vw,8rem)] leading-[0.92] text-balance">
                {isFr ? 'Construisons-le.' : "Let's build it."}
              </span>
            </h2>

            <p className="mx-auto max-w-md text-[var(--cream-dim)] text-[clamp(0.95rem,1.4vw,1.1rem)] leading-relaxed mb-10">
              {isFr
                ? 'Décris-moi ton idée en deux lignes, on voit ensuite ce qui est possible.'
                : 'Describe your idea in two lines, then we figure out what is possible.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Primary action */}
        <ScrollReveal
          as="div"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          delay={0.1}
          amount={0.3}
        >
          <MagneticButton>
            <a
              href={`mailto:${EMAIL}`}
              className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--amber)]"
            >
              <Mail className="w-4 h-4" aria-hidden="true" />
              <span>{isFr ? 'Écrire un mail' : 'Send an email'}</span>
            </a>
          </MagneticButton>

          <button
            type="button"
            onClick={() => void copyEmail()}
            className="btn btn--ghost focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--amber)]"
            aria-label={isFr ? `Copier l'adresse ${EMAIL}` : `Copy address ${EMAIL}`}
          >
            <span className="normal-case tracking-normal">{EMAIL}</span>
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4 opacity-70" aria-hidden="true" />
            )}
          </button>
          <span className="sr-only" role="status" aria-live="polite">
            {copied ? (isFr ? 'Adresse copiée' : 'Address copied') : ''}
          </span>
        </ScrollReveal>

        {/* Socials */}
        <ScrollReveal
          as="div"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20"
          delay={0.2}
          amount={0.3}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-6 py-5 transition-colors duration-200 hover:border-[rgba(255,30,56,0.4)] hover:bg-[rgba(255,30,56,0.05)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--amber)]"
            >
              <span className="flex flex-col gap-1 min-w-0">
                <span className="font-mono text-[0.68rem] tracking-widest uppercase text-[var(--muted)]">
                  {s.label}
                </span>
                <span className="font-display text-[clamp(1.1rem,2vw,1.5rem)] text-[var(--cream)] truncate">
                  {s.value}
                </span>
              </span>
              <ArrowUpRight
                className="w-6 h-6 shrink-0 text-[var(--cream-dim)] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--amber)]"
                aria-hidden="true"
              />
            </a>
          ))}
        </ScrollReveal>

        {/* Footer meta bar */}
        <div className="pt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[0.68rem] tracking-wider text-[var(--muted)] uppercase">
          <div>© 2026 ARES</div>

          <div className="text-[var(--cream-dim)]">
            REACT 19 · THREE.JS · WEB AUDIO
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-[var(--cream)] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--amber)]"
          >
            {isFr ? 'HAUT DE PAGE ↑' : 'BACK TO TOP ↑'}
          </button>
        </div>
      </div>
    </section>
  );
};