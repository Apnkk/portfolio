import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { audioEngine } from '../utils/audioSynth';
import { Play } from 'lucide-react';

export const MusixSection = () => {
  const { language } = useLanguage();

  const handlePlayMusic = () => {
    void audioEngine.play();
  };

  return (
    <section
      id="musix"
      className="relative z-10 py-[clamp(70px,11vh,130px)] px-[var(--pad)] bg-[var(--bg-2)] border-y border-[var(--line)] overflow-hidden text-center"
      aria-label="Musix Teaser"
    >
      {/* Ambient center radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-20 bg-[var(--amber)]"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Kicker */}
        <div className="font-mono text-[0.72rem] tracking-widest text-[var(--amber)] uppercase mb-3">
          02 / LA SUITE
        </div>

        {/* Title */}
        <h2 className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-tight text-[var(--cream)] mb-6">
          {language === 'fr' ? 'Le prochain disque' : 'The Next Record'}
        </h2>

        {/* Sub-kicker */}
        <div className="font-mono text-[0.68rem] tracking-[0.25em] text-[var(--amber)] uppercase mb-4">
          — {language === 'fr' ? 'BIENTÔT' : 'SOON'} —
        </div>

        {/* Giant Outlined Typography: Z-MUSIC */}
        <div className="my-[clamp(20px,4vh,44px)] select-none">
          <span className="font-display font-bold text-[clamp(4.2rem,16vw,14rem)] leading-none tracking-tight outline-amber opacity-90 block drop-shadow-[0_0_40px_rgba(242,163,60,0.18)]">
            Z-MUSIC
          </span>
        </div>

        {/* Undulating Audio Waveform Line */}
        <div className="w-full max-w-lg mx-auto h-8 my-6 flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 500 40"
            className="w-full h-full stroke-[var(--amber)] fill-none"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 0 20 Q 50 0 100 20 T 200 20 T 300 20 T 400 20 T 500 20"
              strokeWidth="1.75"
              strokeLinecap="round"
              animate={{
                d: [
                  "M 0 20 Q 50 2 100 20 T 200 20 T 300 20 T 400 20 T 500 20",
                  "M 0 20 Q 50 38 100 20 T 200 20 T 300 20 T 400 20 T 500 20",
                  "M 0 20 Q 50 2 100 20 T 200 20 T 300 20 T 400 20 T 500 20",
                ],
              }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        {/* Description */}
        <p className="text-[var(--cream)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mt-4">
          {language === 'fr' ? (
            <>
              Une expérience musicale dans la lignée de Z-Flix &amp; ShopCore. Lecture Hi-Fi, paroles vivantes, du son qu'on peut <em className="text-[var(--amber)] italic">voir</em>.
            </>
          ) : (
            <>
              A music experience following Z-Flix &amp; ShopCore. Hi-Fi streaming, living lyrics, sound you can <em className="text-[var(--amber)] italic">see</em>.
            </>
          )}
        </p>

        <p className="font-mono text-[0.68rem] tracking-wider text-[var(--muted)] uppercase mt-3 mb-8">
          {language === 'fr'
            ? 'LE LECTEUR SUR CETTE PAGE EST LE PREMIER PROTOTYPE — ESSAIE-LE.'
            : 'THE PLAYER ON THIS PAGE IS THE FIRST PROTOTYPE — TRY IT.'}
        </p>

        {/* Play Button */}
        <div>
          <button
            type="button"
            onClick={handlePlayMusic}
            className="btn btn--primary inline-flex items-center gap-2.5 px-7 py-3.5 shadow-xl hover:scale-105 transition-transform"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'fr' ? 'APPUIE SUR PLAY' : 'HIT PLAY'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
