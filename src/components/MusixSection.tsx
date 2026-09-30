import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './motion/ScrollReveal';
import { Play, Pause } from 'lucide-react';

interface MusixSectionProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const MusixSection = ({ isPlaying, onTogglePlay }: MusixSectionProps) => {
  const { language } = useLanguage();

  return (
    <section
      id="z-music"
      className={`musix relative z-10 py-[clamp(70px,11vh,130px)] px-[var(--pad)] bg-[var(--bg-2)] border-y border-[var(--line)] overflow-hidden text-center transition-[background,border-color] duration-700 ${
        isPlaying ? 'musix--on' : 'musix--off'
      }`}
      aria-label="Z-Music Teaser"
    >
      {/* Ambient center radial glow — dim when off, bright red when on */}
      <div
        className="musix__glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full blur-[140px] pointer-events-none bg-[var(--amber)] transition-opacity duration-700"
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal y={40} blur={8} amount={0.3}>
          {/* Kicker */}
          <div className="font-mono text-[0.72rem] tracking-widest text-[var(--amber)] uppercase mb-3">
            {language === 'fr' ? '02 / LA SUITE' : "02 / WHAT'S NEXT"}
          </div>

          {/* Title */}
          <h2 className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-tight text-[var(--cream)] mb-6">
            {language === 'fr' ? 'Le prochain disque' : 'The Next Record'}
          </h2>
        </ScrollReveal>

        {/* Sub-kicker — reflects the on/off state */}
        <div className="font-mono text-[0.68rem] tracking-[0.25em] text-[var(--amber)] uppercase mb-4">
          — {isPlaying
            ? (language === 'fr' ? 'EN LECTURE' : 'NOW PLAYING')
            : (language === 'fr' ? 'BIENTÔT' : 'SOON')} —
        </div>

        {/* Giant Outlined Typography: Z-MUSIC — glows red only when playing */}
        <div className="my-[clamp(20px,4vh,44px)] select-none flex items-center justify-center overflow-hidden">
          <span
            className={`musix__wordmark font-display font-bold text-[clamp(2.6rem,8.8vw,7.6rem)] leading-none tracking-normal outline-amber block whitespace-nowrap transition-[opacity,filter,text-shadow] duration-700 ${
              isPlaying ? 'musix__wordmark--on' : 'musix__wordmark--off'
            }`}
          >
            Z-MUSIC
          </span>
        </div>

        {/* Undulating Audio Waveform Line — flat when off, alive when on */}
        <div className="w-full max-w-lg mx-auto h-8 my-6 flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 500 40"
            className={`w-full h-full stroke-[var(--amber)] fill-none transition-opacity duration-700 ${
              isPlaying ? 'opacity-100' : 'opacity-25'
            }`}
            preserveAspectRatio="none"
          >
            <motion.path
              strokeWidth="1.75"
              strokeLinecap="round"
              animate={
                isPlaying
                  ? {
                      d: [
                        'M 0 20 Q 50 2 100 20 T 200 20 T 300 20 T 400 20 T 500 20',
                        'M 0 20 Q 50 38 100 20 T 200 20 T 300 20 T 400 20 T 500 20',
                        'M 0 20 Q 50 2 100 20 T 200 20 T 300 20 T 400 20 T 500 20',
                      ],
                    }
                  : { d: 'M 0 20 L 500 20' }
              }
              transition={
                isPlaying
                  ? { repeat: Infinity, duration: 4.5, ease: 'easeInOut' }
                  : { duration: 0.6, ease: 'easeOut' }
              }
            />
          </svg>
        </div>

        {/* Description */}
        <p className="text-[var(--cream)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mt-4">
          {language === 'fr' ? (
            <>
              Une expérience musicale dans la lignée de Z-Flix & ShopCore. Lecture Hi-Fi, paroles vivantes, du son qu'on peut <em className="text-[var(--amber)] italic">voir</em>.
            </>
          ) : (
            <>
              A music experience following Z-Flix & ShopCore. Hi-Fi streaming, living lyrics, sound you can <em className="text-[var(--amber)] italic">see</em>.
            </>
          )}
        </p>

        <p className="font-mono text-[0.68rem] tracking-wider text-[var(--muted)] uppercase mt-3 mb-8">
          {language === 'fr'
            ? 'LE LECTEUR SUR CETTE PAGE EST LE PREMIER PROTOTYPE — ESSAIE-LE.'
            : 'THE PLAYER ON THIS PAGE IS THE FIRST PROTOTYPE — TRY IT.'}
        </p>

        {/* Play / Pause Button — toggles on & off */}
        <div>
          <button
            type="button"
            onClick={onTogglePlay}
            aria-pressed={isPlaying}
            className={`btn inline-flex items-center gap-2.5 px-7 py-3.5 shadow-xl hover:scale-105 transition-transform ${
              isPlaying ? 'btn--play musix__cta--on' : 'btn--primary'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'fr' ? 'EN LECTURE — STOP' : 'PLAYING — STOP'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'fr' ? 'APPUIE SUR PLAY' : 'HIT PLAY'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
