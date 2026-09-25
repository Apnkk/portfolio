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
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f2a33c', '#ff3d2e', '#ede8dd'],
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0);
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
      // Direct email dispatch to contact@shopcore.buzz via FormSubmit AJAX service
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
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f2a33c', '#3dd68c', '#ede8dd'],
        });
        setFormState({ name: '', email: '', message: '' });
      } else if (data.message && data.message.includes('Activation')) {
        // First-time setup notification sent to contact@shopcore.buzz
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
    <section id="contact" className="pt-16 sm:pt-32 pb-0 px-5 sm:px-12 md:px-16 bg-[#050506] border-t border-[rgba(237,232,221,0.08)] text-center" aria-labelledby="contact-title">
      <div className="max-w-5xl mx-auto">
        {/* Section Index */}
        <p className="mono text-[#f2a33c] mb-2 sm:mb-3">06 / CONTACT</p>

        {/* Big Impact Title */}
        <h2 id="contact-title" className="font-display font-semibold text-[clamp(2.1rem,7.5vw,6.5rem)] text-[#ede8dd] tracking-tight leading-[1.05] mb-6 sm:mb-10 select-none">
          <span className="block">{language === 'fr' ? 'Un projet' : 'Got a project'}</span>
          <span className="block">
            {language === 'fr' ? 'qui veut du ' : 'that needs '}
            <em className="stroke-amber not-italic">{language === 'fr' ? 'volume ?' : 'volume?'}</em>
          </span>
        </h2>

        {/* Large Interactive Email Pill Button */}
        <div className="flex flex-col items-center max-w-full px-2">
          <button
            onClick={copyEmail}
            className="group inline-flex items-center justify-center gap-2.5 sm:gap-3 font-mono text-[clamp(0.78rem,3.2vw,1.35rem)] tracking-wider py-3 sm:py-4 px-5 sm:px-9 rounded-full border border-[rgba(237,232,221,0.2)] bg-black/60 hover:border-[#f2a33c] hover:text-[#f2a33c] transition-all duration-300 hover:shadow-[0_0_35px_rgba(242,163,60,0.18)] active:scale-[0.98] select-none max-w-full truncate"
            title="Copier l'adresse email"
          >
            <span className="truncate">{portfolioData.personal.email}</span>
            {copiedEmail ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3dd68c] shrink-0" />
            ) : (
              <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#837e6f] group-hover:text-[#f2a33c] transition-colors shrink-0" />
            )}
          </button>
        </div>

        {/* Direct Message Form (Dispatches to contact@shopcore.buzz) */}
        <div className="mt-7 sm:mt-8 max-w-lg mx-auto p-5 sm:p-8 rounded-2xl bg-[#0a0a0c] border border-[rgba(237,232,221,0.12)] text-left shadow-2xl">
          {status === 'success' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#3dd68c]/15 text-[#3dd68c] flex items-center justify-center mx-auto border border-[#3dd68c]/30">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-[#3dd68c] font-display font-semibold text-lg">
                {language === 'fr' ? 'Message envoyé avec succès !' : 'Message sent successfully!'}
              </p>
              <p className="text-xs text-[#b9b3a4] leading-relaxed max-w-sm mx-auto">
                {language === 'fr'
                  ? 'Votre message a bien été transmis à contact@shopcore.buzz. Je vous répondrai sous 24h.'
                  : 'Your message has been delivered to contact@shopcore.buzz. I will get back to you within 24 hours.'}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mono text-xs text-[#f2a33c] hover:underline pt-2 inline-block cursor-pointer"
              >
                {language === 'fr' ? 'Envoyer un autre message' : 'Send another note'}
              </button>
            </div>
          ) : status === 'needs_activation' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f2a33c]/15 text-[#f2a33c] flex items-center justify-center mx-auto border border-[#f2a33c]/30">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-[#f2a33c] font-display font-semibold text-lg">
                {language === 'fr' ? 'Activation requise' : 'Activation required'}
              </p>
              <p className="text-xs text-[#b9b3a4] leading-relaxed max-w-sm mx-auto">
                {language === 'fr'
                  ? "Un email d'activation vient d'être envoyé à contact@shopcore.buzz. Cliquez une seule fois sur 'Activate Form' dans votre boîte mail pour autoriser la réception."
                  : "An activation email was just sent to contact@shopcore.buzz. Click 'Activate Form' once in your inbox to enable incoming messages."}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mono text-xs text-[#f2a33c] hover:underline pt-2 inline-block cursor-pointer"
              >
                {language === 'fr' ? 'Retour au formulaire' : 'Back to form'}
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#ff3d2e]/15 text-[#ff3d2e] flex items-center justify-center mx-auto border border-[#ff3d2e]/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-[#ff3d2e] font-display font-semibold text-lg">
                {language === 'fr' ? "Erreur lors de l'envoi" : 'Error sending message'}
              </p>
              <p className="text-xs text-[#b9b3a4] leading-relaxed max-w-sm mx-auto">
                {errorMessage}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`mailto:contact@shopcore.buzz?subject=${encodeURIComponent(
                    `Projet Portfolio Ares - ${formState.name}`
                  )}&body=${encodeURIComponent(formState.message)}`}
                  className="btn btn--solid text-xs py-2.5 px-4"
                >
                  <Mail className="w-3.5 h-3.5 mr-1" />
                  <span>{language === 'fr' ? 'Ouvrir mon mail' : 'Send via email client'}</span>
                </a>
                <button
                  onClick={() => setStatus('idle')}
                  className="mono text-xs text-[#837e6f] hover:text-[#ede8dd] py-2"
                >
                  {language === 'fr' ? 'Réessayer' : 'Try again'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mono text-[11px] text-[#837e6f] mb-2 uppercase tracking-wider font-medium">
                  {language === 'fr' ? 'Nom' : 'Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Alex"
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-[rgba(237,232,221,0.1)] text-[#ede8dd] text-xs font-mono focus:border-[#f2a33c] focus:outline-none transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block mono text-[11px] text-[#837e6f] mb-2 uppercase tracking-wider font-medium">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="alex@domain.com"
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-[rgba(237,232,221,0.1)] text-[#ede8dd] text-xs font-mono focus:border-[#f2a33c] focus:outline-none transition-colors disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block mono text-[11px] text-[#837e6f] mb-2 uppercase tracking-wider font-medium">
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
                  className="w-full px-4 py-3 rounded-xl bg-black border border-[rgba(237,232,221,0.1)] text-[#ede8dd] text-xs font-mono focus:border-[#f2a33c] focus:outline-none transition-colors resize-none leading-relaxed disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 rounded-full bg-[#ede8dd] hover:bg-[#f2a33c] text-black font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] shadow-lg disabled:opacity-60 cursor-pointer uppercase mt-2"
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
            <a
              href="https://discord.com/users/498671450996342794"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f2a33c] transition-colors flex items-center gap-1"
            >
              <span>DISCORD</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>

        {/* Footer Bar */}
        <footer className="mt-20 sm:mt-32 py-7 border-t border-[rgba(237,232,221,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 mono text-xs text-[#837e6f]">
          <span>© 2026 ARES</span>
          <span className="text-[#b9b3a4]">REACT 19 · TAILWIND 4 · WEB AUDIO</span>
          <button
            onClick={scrollToTop}
            className="hover:text-[#f2a33c] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </footer>
      </div>
    </section>
  );
};
