import { useState, type FormEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { Check, Copy, ArrowUp, Send, Loader2, Mail, AlertCircle, MessageSquare } from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';

export const ContactSection = () => {
  const { language } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'needs_activation' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { duration?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.0 });
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
          _subject: `Message Portfolio Ares de ${formState.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === 'true' || data.success === true)) {
        setStatus('success');
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
      className="pt-24 sm:pt-36 pb-0 px-5 sm:px-10 lg:px-16 bg-black border-t border-white/[0.08] text-center relative"
      aria-labelledby="contact-title"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Index */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            05 / CONTACT
          </p>
        </div>

        {/* Clean Typographic Heading */}
        <h2
          id="contact-title"
          className="font-display font-semibold text-[clamp(2.2rem,6vw,4.5rem)] text-white tracking-tight leading-tight mb-4"
        >
          {language === 'fr' ? (
            <>
              Construisons ensemble votre <em className="text-[#ff1e38] not-italic font-serif">prochain</em> produit.
            </>
          ) : (
            <>
              Let's engineer your <em className="text-[#ff1e38] not-italic font-serif">next</em> release.
            </>
          )}
        </h2>

        <p className="text-[#a1a1aa] text-sm max-w-md mx-auto mb-10 leading-relaxed font-normal">
          {language === 'fr'
            ? 'Un projet, une opportunité ou une question ? Écrivez-moi directement.'
            : 'Have a project, opportunity, or inquiry? Reach out directly.'}
        </p>

        {/* Direct Email Pill Button */}
        <div className="flex flex-col items-center mb-12">
          <button
            type="button"
            onClick={copyEmail}
            className="group inline-flex items-center justify-center gap-3 font-mono text-sm sm:text-base tracking-wide py-3.5 px-6 sm:px-8 rounded-full border border-white/[0.12] bg-[#09090b] hover:border-white/30 text-white transition-all cursor-pointer shadow-lg active:scale-[0.98]"
            title="Copier l'adresse email"
          >
            <Mail className="w-4 h-4 text-[#ff1e38]" />
            <span>{portfolioData.personal.email}</span>
            {copiedEmail ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold ml-1">
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Copié' : 'Copied'}</span>
              </span>
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#71717a] group-hover:text-white transition-colors ml-1" />
            )}
          </button>
        </div>

        {/* Clean Direct Message Form */}
        <div className="max-w-lg mx-auto p-6 sm:p-8 rounded-2xl bg-[#09090b] border border-white/[0.08] text-left shadow-2xl">
          {status === 'success' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-white font-display font-semibold text-lg">
                {language === 'fr' ? 'Message envoyé' : 'Message delivered'}
              </p>
              <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-sm mx-auto">
                {language === 'fr'
                  ? 'Votre message a bien été transmis. Je vous répondrai dans les plus brefs délais.'
                  : 'Your note has been dispatched. I will follow up shortly.'}
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="font-mono text-xs text-[#ff1e38] hover:underline pt-2 inline-block cursor-pointer font-medium"
              >
                {language === 'fr' ? 'Envoyer un autre message' : 'Send another note'}
              </button>
            </div>
          ) : status === 'needs_activation' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-white/[0.05] text-[#ff1e38] flex items-center justify-center mx-auto border border-white/[0.1]">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-white font-display font-semibold text-lg">
                {language === 'fr' ? 'Confirmation requise' : 'Activation required'}
              </p>
              <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-sm mx-auto">
                {language === 'fr'
                  ? "Un email de confirmation vient d'être envoyé. Merci de valider la réception une seule fois."
                  : 'An activation email was sent. Confirm once in your inbox to enable submissions.'}
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="font-mono text-xs text-[#ff1e38] hover:underline pt-2 inline-block cursor-pointer"
              >
                {language === 'fr' ? 'Retour au formulaire' : 'Back to form'}
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-[#ff1e38] flex items-center justify-center mx-auto border border-red-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-white font-display font-semibold text-lg">
                {language === 'fr' ? "Erreur d'envoi" : 'Error sending note'}
              </p>
              <p className="text-xs text-[#a1a1aa] leading-relaxed max-w-sm mx-auto">
                {errorMessage}
              </p>
              <div className="pt-3">
                <a
                  href={`mailto:${portfolioData.personal.email}`}
                  className="btn btn--crimson py-2 px-4 text-xs font-mono"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Écrire directement par email' : 'Open email client'}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-[#71717a] mb-1.5 uppercase tracking-wider font-medium">
                  {language === 'fr' ? 'Nom complet' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Alex Dupont"
                  disabled={status === 'submitting'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-white/[0.1] text-white text-xs font-mono focus:border-white/40 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#71717a] mb-1.5 uppercase tracking-wider font-medium">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="alex@domain.com"
                  disabled={status === 'submitting'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-white/[0.1] text-white text-xs font-mono focus:border-white/40 focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[#71717a] mb-1.5 uppercase tracking-wider font-medium">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder={
                    language === 'fr'
                      ? 'Parlez-moi de votre projet, vos objectifs et vos délais...'
                      : 'Tell me about your project, goals, and timeline...'
                  }
                  disabled={status === 'submitting'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-white/[0.1] text-white text-xs font-mono focus:border-white/40 focus:outline-none transition-colors resize-none leading-relaxed disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 rounded-lg btn--crimson font-mono font-medium text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer uppercase mt-2"
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
        <div className="flex flex-wrap justify-center items-center gap-4 mt-12 font-mono text-xs text-[#a1a1aa]">
          <a
            href="https://github.com/Apnkk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:text-white transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub (@Apnkk)</span>
            <span className="text-[#71717a]">↗</span>
          </a>
          <a
            href="https://discord.com/users/498671450996342794"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:text-white transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discord (Ares)</span>
            <span className="text-[#71717a]">↗</span>
          </a>
        </div>

        {/* Footer Bar */}
        <footer className="mt-24 sm:mt-32 py-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#71717a]">
          <span>© 2026 ARES — FULL-STACK &amp; SYSTEMS DEVELOPER</span>
          <span className="text-[#a1a1aa]">REACT 19 · TYPESCRIPT · TAILWIND CSS</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>RETOUR EN HAUT</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </footer>
      </div>
    </section>
  );
};
