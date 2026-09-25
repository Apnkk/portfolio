import { useState, type FormEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { Check, Copy, ArrowUp, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactSection = () => {
  const { language } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopiedEmail(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f2a33c', '#ff3d2e', '#ede8dd'],
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const copyDiscord = () => {
    navigator.clipboard.writeText('ares.dev');
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f2a33c', '#3dd68c', '#ede8dd'],
      });
      setFormState({ name: '', email: '', message: '' });
    }, 700);
  };

  return (
    <section id="contact" className="pt-24 sm:pt-32 pb-0 px-6 sm:px-12 md:px-16 bg-[#121008] border-t border-[rgba(237,232,221,0.1)] text-center" aria-labelledby="contact-title">
      <div className="max-w-5xl mx-auto">
        {/* Section Index */}
        <p className="mono text-[#f2a33c] mb-3">06 / CONTACT</p>

        {/* Big Impact Title */}
        <h2 id="contact-title" className="font-display font-semibold text-[clamp(2.4rem,8vw,6.5rem)] text-[#ede8dd] tracking-tight leading-[1.02] mb-10 select-none">
          <span className="block">{language === 'fr' ? 'Un projet' : 'Got a project'}</span>
          <span className="block">
            {language === 'fr' ? 'qui veut du ' : 'that needs '}
            <em className="stroke-amber not-italic">{language === 'fr' ? 'volume ?' : 'volume?'}</em>
          </span>
        </h2>

        {/* Large Interactive Email Pill Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={copyEmail}
            className="group inline-flex items-center gap-3 font-mono text-[clamp(0.95rem,2.4vw,1.45rem)] tracking-wider py-4 sm:py-5 px-7 sm:px-10 rounded-full border border-[rgba(237,232,221,0.22)] bg-transparent hover:border-[#f2a33c] hover:text-[#f2a33c] transition-all duration-300 hover:shadow-[0_0_40px_rgba(242,163,60,0.22)] active:scale-[0.98]"
            title="Copier l'adresse email"
          >
            <span>{portfolioData.personal.email}</span>
            {copiedEmail ? (
              <Check className="w-5 h-5 text-[#3dd68c]" />
            ) : (
              <Copy className="w-5 h-5 text-[#837e6f] group-hover:text-[#f2a33c] transition-colors" />
            )}
          </button>

          {/* Toggle Direct Form */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="mono text-xs text-[#837e6f] hover:text-[#ede8dd] transition-colors underline underline-offset-4 mt-2"
          >
            {showForm
              ? language === 'fr'
                ? 'Masquer le formulaire direct'
                : 'Hide direct message form'
              : language === 'fr'
              ? 'Ou envoyer un message direct via le formulaire ↓'
              : 'Or send a direct message via form ↓'}
          </button>
        </div>

        {/* Direct Message Form (Expandable) */}
        {showForm && (
          <div className="mt-8 max-w-lg mx-auto p-6 sm:p-8 rounded-2xl bg-[#0a0908] border border-[rgba(237,232,221,0.15)] text-left shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-[#3dd68c] font-display font-semibold text-lg">
                  {language === 'fr' ? 'Message envoyé avec succès.' : 'Message sent successfully.'}
                </p>
                <p className="text-xs text-[#b9b3a4]">
                  {language === 'fr' ? 'Je vous répondrai sous 24h.' : 'I will get back to you within 24 hours.'}
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mono text-xs text-[#f2a33c] hover:underline pt-2 inline-block"
                >
                  {language === 'fr' ? 'Envoyer un autre message' : 'Send another note'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mono text-[10px] text-[#837e6f] mb-1.5 uppercase">
                    {language === 'fr' ? 'Nom' : 'Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Alex"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#15120d] border border-[rgba(237,232,221,0.12)] text-[#ede8dd] text-xs font-mono focus:border-[#f2a33c] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block mono text-[10px] text-[#837e6f] mb-1.5 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="alex@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#15120d] border border-[rgba(237,232,221,0.12)] text-[#ede8dd] text-xs font-mono focus:border-[#f2a33c] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block mono text-[10px] text-[#837e6f] mb-1.5 uppercase">
                    Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder={
                      language === 'fr'
                        ? 'Votre projet, vos besoins, calendrier estimé...'
                        : 'Your project, scope, estimated timeline...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#15120d] border border-[rgba(237,232,221,0.12)] text-[#ede8dd] text-xs font-mono focus:border-[#f2a33c] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn btn--solid w-full justify-center text-xs py-3"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {status === 'submitting'
                      ? language === 'fr'
                        ? 'Envoi...'
                        : 'Sending...'
                      : language === 'fr'
                      ? 'Envoyer le message'
                      : 'Send Message'}
                  </span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Social Links Row */}
        <ul className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mt-12 sm:mt-16 mono text-xs text-[#b9b3a4]" aria-label="Réseaux sociaux">
          <li>
            <a
              href="https://github.com/Apnkk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f2a33c] transition-colors flex items-center gap-1"
            >
              <span>GITHUB</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <button
              onClick={copyDiscord}
              className={`hover:text-[#f2a33c] transition-colors flex items-center gap-1 ${
                copiedDiscord ? 'text-[#3dd68c]' : ''
              }`}
            >
              <span>DISCORD — ARES.DEV</span>
              <span aria-hidden="true" className="text-[10px]">{copiedDiscord ? '[COPIED]' : '[COPY]'}</span>
            </button>
          </li>
          <li>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f2a33c] transition-colors flex items-center gap-1"
            >
              <span>LINKEDIN</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f2a33c] transition-colors flex items-center gap-1"
            >
              <span>X / TWITTER</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>

        {/* Footer Bar */}
        <footer className="mt-24 sm:mt-32 py-7 border-t border-[rgba(237,232,221,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 mono text-xs text-[#837e6f]">
          <span>© 2026 ARES DEV</span>
          <span className="text-[#b9b3a4]">REACT 19 · TAILWIND 4 · WEB AUDIO</span>
          <button
            onClick={scrollToTop}
            className="hover:text-[#f2a33c] transition-colors flex items-center gap-1.5"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </footer>
      </div>
    </section>
  );
};
