import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { GithubIcon, LinkedinIcon, TwitterXIcon } from './icons/BrandIcons';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  ArrowUpRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactSection = () => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: 'fullstack',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#8b5cf6', '#3b82f6'],
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const getSocialIcon = (name: string) => {
    switch (name) {
      case 'GitHub':
        return <GithubIcon className="w-4 h-4" />;
      case 'LinkedIn':
        return <LinkedinIcon className="w-4 h-4" />;
      case 'X / Twitter':
        return <TwitterXIcon className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setErrorMessage(
        language === 'fr'
          ? 'Veuillez remplir tous les champs obligatoires.'
          : 'Please fill in all required fields.'
      );
      setStatus('error');
      return;
    }

    if (!formState.email.includes('@') || !formState.email.includes('.')) {
      setErrorMessage(
        language === 'fr'
          ? 'Veuillez saisir une adresse email valide.'
          : 'Please enter a valid email address.'
      );
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#6366f1'],
      });
      setFormState({ name: '', email: '', projectType: 'fullstack', message: '' });
      setErrorMessage('');
    }, 900);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-medium mb-3">
          <Mail className="w-3.5 h-3.5" />
          <span>{language === 'fr' ? 'Démarrons un projet' : 'Get in Touch'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {language === 'fr' ? 'Échangeons sur vos ambitions' : "Let's Build Something Great"}
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-3">
          {language === 'fr'
            ? 'Vous avez un projet web/mobile, une mission freelance ou une opportunité d’ingénierie ? Contactez-moi directement.'
            : 'Have a web/mobile product idea, freelance mission, or engineering role? Reach out directly.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info & Social Channels */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Availability Status Card */}
          <div className="p-6 rounded-3xl glass-panel relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider">
                {portfolioData.personal.availability.text[language]}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {language === 'fr' ? 'Prêt à relever de nouveaux défis' : 'Ready for New Challenges'}
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
              {language === 'fr'
                ? 'Disponible pour des missions full-stack, architectures web & mobiles, développement de MVP et consulting.'
                : 'Available for full-stack contracts, web & mobile architecture, MVP development, and technical consulting.'}
            </p>

            {/* Direct Email Copy Box */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10 group">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono text-xs sm:text-sm text-neutral-200 truncate">
                  {portfolioData.personal.email}
                </span>
              </div>
              <button
                onClick={copyEmail}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors shrink-0 border border-white/5"
                title={language === 'fr' ? 'Copier' : 'Copy'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Social Channels Card */}
          <div className="p-6 rounded-3xl glass-panel">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-4">
              {language === 'fr' ? 'Réseaux & Plateformes' : 'Networks & Profiles'}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {portfolioData.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 hover:border-cyan-500/30 text-neutral-300 hover:text-white transition-all duration-150 group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 group-hover:scale-110 transition-transform">
                      {getSocialIcon(social.name)}
                    </span>
                    <span className="text-xs font-medium">{social.name}</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden border border-white/10"
        >
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {language === 'fr' ? 'Envoyer un message direct' : 'Send a Direct Message'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              {language === 'fr'
                ? 'Réponse habituelle sous 24 heures.'
                : 'Typical response time within 24 hours.'}
            </p>
          </div>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {language === 'fr' ? 'Message envoyé avec succès !' : 'Message Sent Successfully!'}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-sm">
                {language === 'fr'
                  ? 'Merci pour votre intérêt. Je reviens vers vous dans les plus brefs délais.'
                  : 'Thank you for reaching out. I will get back to you as soon as possible.'}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors"
              >
                {language === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                    {language === 'fr' ? 'Votre nom *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder={language === 'fr' ? 'Alex Dupont' : 'John Doe'}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-xs sm:text-sm placeholder:text-neutral-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                    {language === 'fr' ? 'Votre email *' : 'Your Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-xs sm:text-sm placeholder:text-neutral-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  {language === 'fr' ? 'Type de projet / sujet' : 'Project Subject'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'fullstack', label: 'Full-Stack' },
                    { id: 'mobile', label: 'Mobile App' },
                    { id: 'ai', label: 'AI & Data' },
                    { id: 'other', label: language === 'fr' ? 'Autre' : 'Other' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormState({ ...formState, projectType: p.id })}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        formState.projectType === p.id
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                          : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/5'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                  {language === 'fr' ? 'Votre message *' : 'Your Message *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder={
                    language === 'fr'
                      ? 'Parlez-moi de vos besoins, objectifs et calendrier estimé...'
                      : 'Tell me about your project goals, scope, and estimated timeline...'
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-xs sm:text-sm placeholder:text-neutral-600 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <span>{language === 'fr' ? 'Envoi en cours...' : 'Sending...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{language === 'fr' ? 'Envoyer le message' : 'Send Message'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
