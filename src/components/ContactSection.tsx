import { useState, type FormEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { Check, Copy, ArrowUp, Send, Loader2, Mail, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactSection = () => {
  const { language } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'needs_activation' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopiedEmail(true);
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.8 },
      colors: ['#ff1e38', '#ff4d61', '#ffffff'],
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { duration?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://formsubmit.co/ajax/contact@shopcore.buzz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          _subject: `Nouveau message Portfolio Ares de ${formState.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === 'true' || data.success === true)) {
        setStatus('success');
        confetti({
          particleCount: 85,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ff1e38', '#ff4d61', '#ffffff'],
        });
        setFormState({ name: '', email: '', message: '' });
      } else if (data.message && data.message.includes('Activation')) {
        setStatus('needs_activation');
        setFormState({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(
          data.message ||
            (language === 'fr'
              ? "Une erreur est survenue lors de l'envoi."
              : 'Failed to send message.')
        );
      }
    } catch (err: unknown) {
      console.error('Email dispatch error:', err);
      setStatus('error');
      setErrorMessage(
        language === 'fr'
          ? "Impossible de contacter le serveur d'envoi. Vous pouvez m'écrire directement par email."
          : 'Unable to reach the email server. You can email me directly.'
      );
    }
  };

  return (
    <section
      id="contact"
      className="pt-20 sm:pt-36 pb-0 px-5 sm:px-10 md:px-14 bg-black border-t border-white/[0.08] text-center select-none relative"
      aria-labelledby="contact-title"
    >
      {/* Background Subtle Red Aurora */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff1e38]/10 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Index */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]" />
          <p className="mono text-[#ff1e38] font-semibold text-xs tracking-widest">
            06 / CONTACT
          </p>
        </div>

        {/* Big Impact Title */}
        <h2
          id="contact-title"
          className="font-display font-semibold text-[clamp(2.4rem,8vw,6.8rem)] text-[#f5f3ef] tracking-tight leading-[1.04] mb-6 sm:mb-10 select-none"
        >
          <span className="block">{language === 'fr' ? 'Un projet' : 'Got a project'}</span>
          <span className="block">
            {language === 'fr' ? 'qui veut du ' : 'that needs '}
            <em className="stroke-red not-italic">{language === 'fr' ? 'volume ?' : 'volume?'}</em>
          </span>
        </h2>

        {/* Large Interactive Email Pill Button */}
        <div className="flex flex-col items-center max-w-full px-2 mb-10">
          <button
            onClick={copyEmail}
            className="group inline-flex items-center justify-center gap-2.5 sm:gap-3 font-mono text-[clamp(0.78rem,3.2vw,1.35rem)] tracking-wider py-3.5 sm:py-4 px-6 sm:px-10 rounded-full border border-white/20 bg-black/80 hover:border-[#ff1e38] hover:text-[#ff1e38] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,30,56,0.35)] active:scale-[0.98] select-none max-w-full truncate cursor-pointer shadow-2xl"
            title="Copier l'adresse email"
          >
            <span className="truncate">{portfolioData.personal.email}</span>
            {copiedEmail ? (
              <Check className="w-4 h-4 text-[#ff1e38] shrink-0" />
            ) : (
              <Copy className="w-4 h-4 text-[#726d64] group-hover:text-[#ff1e38] transition-colors shrink-0" />
            )}
          </button>
        </div>

        {/* Direct Message Form */}
        <div className="max-w-lg mx-auto p-6 sm:p-8 oled-card text-left shadow-2xl">
          <div className="vu-bar" aria-hidden="true" />
          
          {status === 'success' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#ff1e38]/15 text-[#ff1e38] flex items-center justify-center mx-auto border border-[#ff1e38]/30 shadow-[0_0_15px_rgba(255,30,56,0.3)]">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-[#f5f3ef] font-display font-semibold text-lg">
                {language === 'fr' ? 'Message envoyé avec succès !' : 'Message sent successfully!'}
              </p>
              <p className="text-xs text-[#b8b3a8] leading-relaxed max-w-sm mx-auto">
                {language === 'fr'
                  ? 'Votre message a bien été transmis à contact@shopcore.buzz. Je vous répondrai sous 24h.'
                  : 'Your message has been delivered to contact@shopcore.buzz. I will get back to you within 24 hours.'}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mono text-xs text-[#ff1e38] hover:underline pt-2 inline-block cursor-pointer font-medium"
              >
                {language === 'fr' ? 'Envoyer un autre message' : 'Send another note'}
              </button>
            </div>
          ) : status === 'needs_activation' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#ff1e38]/15 text-[#ff1e38] flex items-center justify-center mx-auto border border-[#ff1e38]/30">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-[#ff1e38] font-display font-semibold text-lg">
                {language === 'fr' ? 'Activation requise' : 'Activation required'}
              </p>
              <p className="text-xs text-[#b8b3a8] leading-relaxed max-w-sm mx-auto">
                {language === 'fr'
                  ? "Un email d'activation vient d'être envoyé à contact@shopcore.buzz. Cliquez une seule fois sur 'Activate Form' dans votre boîte mail pour autoriser la réception."
                  : "An activation email was just sent to contact@shopcore.buzz. Click 'Activate Form' once in your inbox to enable incoming messages."}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mono text-xs text-[#ff1e38] hover:underline pt-2 inline-block cursor-pointer"
              >
                {language === 'fr' ? 'Retour au formulaire' : 'Back to form'}
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#ff1e38]/15 text-[#ff1e38] flex items-center justify-center mx-auto border border-[#ff1e38]/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-[#ff1e38] font-display font-semibold text-lg">
                {language === 'fr' ? "Erreur lors de l'envoi" : 'Error sending message'}
              </p>
              <p className="text-xs text-[#b8b3a8] leading-relaxed max-w-sm mx-auto">
                {errorMessage}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <a
                  href={`mailto:${portfolioData.personal.email}?subject=${encodeURIComponent(
                    `Contact depuis Portfolio Ares (${formState.name || 'Visiteur'})`
                  )}&body=${encodeURIComponent(formState.message || '')}`}
                  className="btn btn--crimson py-2.5 px-4 text-xs font-mono"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Écrire directement par email' : 'Open in Email Client'}</span>
                </a>
                <button
                  onClick={() => setStatus('idle')}
                  className="mono text-xs text-[#b8b3a8] hover:text-[#ff1e38] py-2 cursor-pointer transition-colors"
                >
                  {language === 'fr' ? 'Modifier le message' : 'Edit message'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mono text-[11px] text-[#726d64] mb-2 uppercase tracking-wider font-medium">
                  {language === 'fr' ? 'Nom complet' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Alex"
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-[#f5f3ef] text-xs font-mono focus:border-[#ff1e38] focus:ring-1 focus:ring-[#ff1e38]/40 focus:outline-none transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block mono text-[11px] text-[#726d64] mb-2 uppercase tracking-wider font-medium">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="alex@domain.com"
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-[#f5f3ef] text-xs font-mono focus:border-[#ff1e38] focus:ring-1 focus:ring-[#ff1e38]/40 focus:outline-none transition-all disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block mono text-[11px] text-[#726d64] mb-2 uppercase tracking-wider font-medium">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder={
                    language === 'fr'
                      ? 'Votre projet, vos besoins, calendrier estimé...'
                      : 'Your project, scope, estimated timeline...'
                  }
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-[#f5f3ef] text-xs font-mono focus:border-[#ff1e38] focus:ring-1 focus:ring-[#ff1e38]/40 focus:outline-none transition-all resize-none leading-relaxed disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 rounded-full btn--crimson font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer uppercase mt-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'fr' ? 'Envoi en cours...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'fr' ? 'Envoyer le message' : 'Send message'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Social Links Row */}
        <ul className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mt-12 sm:mt-16 mono text-xs text-[#b8b3a8]" aria-label="Réseaux sociaux">
          <li>
            <a
              href="https://github.com/Apnkk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff1e38] transition-colors flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#ff1e38]/40"
            >
              <span>GITHUB (@Apnkk)</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a
              href="https://discord.com/users/498671450996342794"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff1e38] transition-colors flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#ff1e38]/40"
            >
              <span>DISCORD (Ares)</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>

        {/* Footer Bar */}
        <footer className="mt-20 sm:mt-32 py-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 mono text-xs text-[#726d64]">
          <span>© 2026 ARES — FULL-STACK &amp; CREATIVE BUILDER</span>
          <span className="text-[#b8b3a8]">REACT 19 · TAILWIND 4 · OLED NOIR &amp; CRIMSON</span>
          <button
            onClick={scrollToTop}
            className="hover:text-[#ff1e38] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </footer>
      </div>
    </section>
  );
};
