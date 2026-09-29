import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { 
  Check, 
  Copy, 
  Send, 
  Loader2, 
  Mail, 
  AlertCircle, 
  MessageSquare
} from 'lucide-react';
import { GithubIcon } from './icons/BrandIcons';
import { MagneticButton } from './motion/MagneticButton';
import { BorderBeam } from './motion/BorderBeam';
import confetti from 'canvas-confetti';

export const ContactSection = () => {
  const { language } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'needs_activation' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopiedEmail(true);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.85 } });
    setTimeout(() => setCopiedEmail(false), 2500);
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
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
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
      className="scroll-mt-32 pt-28 sm:pt-40 pb-0 px-5 sm:px-10 lg:px-16 bg-black border-t border-white/[0.08] text-center relative overflow-hidden bg-grid"
      aria-labelledby="contact-title"
    >
      {/* Background ambient spotlight */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Index */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]" />
          <p className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
            {language === 'fr' ? 'CONTACT & COLLABORATION' : 'GET IN TOUCH'}
          </p>
        </div>

        {/* Heading */}
        <h2
          id="contact-title"
          className="font-display font-semibold text-[clamp(2.2rem,6vw,4.5rem)] text-white tracking-tight leading-tight mb-4"
        >
          {language === 'fr' ? (
            <>
              Construisons ensemble votre <span className="text-[#ff1e38]">prochain</span> produit.
            </>
          ) : (
            <>
              Let's engineer your <span className="text-[#ff1e38]">next</span> release.
            </>
          )}
        </h2>

        <p className="text-[#a1a1aa] text-sm sm:text-base max-w-lg mx-auto mb-10 leading-relaxed font-normal">
          {language === 'fr'
            ? 'Un projet de streaming, une application web ou un tweak iOS ? Écrivez-moi directement.'
            : 'Looking to build a media app, SaaS platform, or custom iOS software? Reach out directly.'}
        </p>

        {/* Direct Email Action Pill */}
        <div className="flex flex-col items-center mb-12">
          <MagneticButton>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
              onClick={copyEmail}
              className="group inline-flex items-center justify-center gap-3 font-mono text-sm sm:text-base tracking-wide py-3.5 px-6 sm:px-8 rounded-full border border-white/[0.12] bg-[#09090b]/90 hover:border-[#ff1e38]/50 text-white transition-all cursor-pointer shadow-2xl backdrop-blur-xl"
              title="Copier l'adresse email"
            >
              <Mail className="w-4 h-4 text-[#ff1e38]" />
              <span>{portfolioData.personal.email}</span>
              {copiedEmail ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold ml-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Copié !' : 'Copied!'}</span>
                </span>
              ) : (
                <Copy className="w-3.5 h-3.5 text-[#71717a] group-hover:text-white transition-colors ml-1" />
              )}
            </motion.button>
          </MagneticButton>
        </div>

        {/* Message Form */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', visualDuration: 0.45, bounce: 0.12 }}
          className="relative overflow-hidden max-w-lg mx-auto p-6 sm:p-8 rounded-3xl bg-[#09090b]/95 border border-white/[0.08] text-left shadow-2xl backdrop-blur-2xl"
        >
          <BorderBeam duration={16} borderWidth={1.5} colorFrom="#ff1e38" colorTo="rgba(255, 30, 56, 0.2)" />

          {status === 'success' ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Check className="w-6 h-6" />
              </div>
              <p className="text-white font-display font-semibold text-xl">
                {language === 'fr' ? 'Message transmis avec succès' : 'Message delivered'}
              </p>
              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed max-w-sm mx-auto">
                {language === 'fr'
                  ? 'Merci pour votre message ! Je vous répondrai sous 24 heures.'
                  : 'Thanks for reaching out! I will respond within 24 hours.'}
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="font-mono text-xs text-[#ff1e38] hover:underline pt-3 inline-block cursor-pointer font-medium"
              >
                {language === 'fr' ? 'Envoyer un autre message' : 'Send another note'}
              </button>
            </div>
          ) : status === 'needs_activation' ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/[0.05] text-[#ff1e38] flex items-center justify-center mx-auto border border-white/[0.1]">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-white font-display font-semibold text-xl">
                {language === 'fr' ? 'Confirmation requise' : 'Activation required'}
              </p>
              <p className="text-xs sm:text-sm text-[#a1a1aa] leading-relaxed max-w-sm mx-auto">
                {language === 'fr'
                  ? "Un email de confirmation vient d'être envoyé. Merci de valider la réception une seule fois."
                  : 'An activation email was sent. Confirm once in your inbox to enable submissions.'}
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="font-mono text-xs text-[#ff1e38] hover:underline pt-3 inline-block cursor-pointer font-medium"
              >
                {language === 'fr' ? 'Revenir au formulaire' : 'Return to form'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[#ff1e38] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-1.5"
                >
                  {language === 'fr' ? 'Votre nom' : 'Your Name'}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Alexandre..."
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/[0.1] text-white text-xs font-mono focus:border-[#ff1e38] focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-1.5"
                >
                  {language === 'fr' ? 'Votre email' : 'Your Email'}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="contact@exemple.com"
                  disabled={status === 'submitting'}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/[0.1] text-white text-xs font-mono focus:border-[#ff1e38] focus:outline-none transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-1.5"
                >
                  {language === 'fr' ? 'Votre message' : 'Your Message'}
                </label>
                <textarea
                  id="contact-message"
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
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/[0.1] text-white text-xs font-mono focus:border-[#ff1e38] focus:outline-none transition-colors resize-none leading-relaxed disabled:opacity-50"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === 'submitting'}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
                className="w-full py-3.5 rounded-xl btn--crimson font-mono font-medium text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer uppercase mt-3"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'fr' ? 'Envoi en cours...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Envoyer le message' : 'Send message'}</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Social Badges Row */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-12 font-mono text-xs text-[#a1a1aa]">
          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
            href="https://github.com/Apnkk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:text-white transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GitHub (@Apnkk)</span>
            <span className="text-[#71717a]">↗</span>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
            href="https://discord.com/users/498671450996342794"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:text-white transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#5865F2]" />
            <span>Discord (Ares)</span>
            <span className="text-[#71717a]">↗</span>
          </motion.a>
        </div>

        {/* Footer */}
        <footer className="mt-24 sm:mt-32 py-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 items-center gap-4 font-mono text-xs text-[#71717a]">
          <div className="text-center sm:text-left">
            <span>© 2026 ARES — FRANCE</span>
          </div>
          <div className="text-center text-[#a1a1aa]">
            <span>REACT 19 · TYPESCRIPT · TAILWIND 4 · MOTION</span>
          </div>
          <div className="text-center sm:text-right text-[#71717a]">
            <span>120 FPS FLUIDITY</span>
          </div>
        </footer>
      </div>
    </section>
  );
};
