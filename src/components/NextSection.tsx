import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Play, Pause } from 'lucide-react';

interface NextSectionProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const NextSection = ({ isPlaying, onTogglePlay }: NextSectionProps) => {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isPlaying ? '#f2a33c' : 'rgba(237, 232, 221, 0.3)';

      const waves = isPlaying ? 3 : 1;

      for (let w = 0; w < waves; w++) {
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const freq = 0.015 + w * 0.005;
          const amp = isPlaying ? (20 + w * 6) * Math.sin(phase * 0.8 + x * 0.005) : 8;
          const y = mid + Math.sin(x * freq + phase + w) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += isPlaying ? 0.045 : 0.015;
      animFrame.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [isPlaying]);

  return (
    <section id="next" className="relative py-28 sm:py-36 px-6 sm:px-12 bg-[#121008] border-y border-[rgba(237,232,221,0.1)] overflow-hidden text-center">
      {/* Background Amber Glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isPlaying ? 'opacity-100' : 'opacity-40'
        }`}
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 60%, rgba(242, 163, 60, 0.12), transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Index */}
        <p className="mono text-[#f2a33c] mb-3">02 / NEXT</p>
        <h2 className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-[#ede8dd] tracking-tight leading-none mb-10">
          {language === 'fr' ? 'La prochaine sortie' : 'The next release'}
        </h2>

        {/* Coming Soon Pill */}
        <p className="mono text-[#f2a33c] tracking-[0.3em] text-xs mb-3">
          — {language === 'fr' ? 'BIENTÔT DISPONIBLE' : 'COMING SOON'} —
        </p>

        {/* Giant Outlined Wordmark */}
        <h3
          className={`font-display font-bold text-[clamp(3.8rem,16vw,13rem)] leading-[0.92] tracking-tight transition-all duration-500 select-none ${
            isPlaying ? 'stroke-amber' : 'stroke-cream'
          }`}
          style={{
            textShadow: isPlaying ? '0 0 80px rgba(242, 163, 60, 0.35)' : 'none',
          }}
        >
          SYNTHESIS
        </h3>

        {/* Sine Wave Visualizer */}
        <div className="w-full max-w-[680px] h-20 my-6 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={680}
            height={80}
            className="w-full h-full"
            aria-hidden="true"
          />
        </div>

        {/* Pitch */}
        <p className="text-[#ede8dd] font-display text-[clamp(1.05rem,1.8vw,1.35rem)] max-w-2xl font-medium leading-relaxed">
          {language === 'fr' ? (
            <>
              Un espace de travail multi-agents IA autonome dans la lignée de mes précédents produits.
              <br />
              Streaming temps réel, mémoire locale, des outils que l’on <em className="text-[#f2a33c] not-italic">ressent</em>.
            </>
          ) : (
            <>
              An autonomous AI multi-agent workspace in the same bloodline as my core products.
              <br />
              Realtime streaming, local-first memory, tools you can <em className="text-[#f2a33c] not-italic">feel</em>.
            </>
          )}
        </p>

        {/* Audio Engine Hint */}
        <p className="mono text-xs text-[#837e6f] mt-4">
          {language === 'fr'
            ? 'Le synthétiseur Web Audio en bas à droite est le premier prototype — testez-le.'
            : 'The Web Audio synthesizer in the bottom dock is the live prototype — try it.'}
        </p>

        {/* Play CTA */}
        <button
          onClick={onTogglePlay}
          className="btn btn--solid mt-8 group"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>{language === 'fr' ? 'Pause ambiance' : 'Pause audio'}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>{language === 'fr' ? 'Lancer la musique' : 'Press play'}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
