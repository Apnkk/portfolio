import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Play, Pause } from 'lucide-react';

interface NextSectionProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const NextSection = ({ isPlaying, onTogglePlay }: NextSectionProps) => {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrame = useRef<number | null>(null);
  const velocityRef = useRef(0);

  // Scrollytelling Dolly & Breathing transforms
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.08, 0.9]);
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -40]);

  // Sine Wave Visualizer with velocity modulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    let smoothedSpeed = 0;

    const onScrollEvent = (e: Event) => {
      const custom = e as CustomEvent<{ velocity: number }>;
      if (custom.detail?.velocity !== undefined) {
        velocityRef.current = custom.detail.velocity;
      }
    };
    window.addEventListener('portfolio-scroll', onScrollEvent);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      // React to scroll velocity like a reactive audio scrub
      smoothedSpeed += (Math.abs(velocityRef.current) * 0.08 - smoothedSpeed) * 0.15;
      velocityRef.current *= 0.9;

      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = isPlaying ? '#f2a33c' : 'rgba(237, 232, 221, 0.35)';

      const waves = isPlaying ? 3 : 2;
      const velocityAmpBoost = smoothedSpeed * 35;

      for (let w = 0; w < waves; w++) {
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const freq = 0.015 + w * 0.005;
          const amp = isPlaying
            ? (20 + w * 6 + velocityAmpBoost) * Math.sin(phase * 0.8 + x * 0.005)
            : 8 + velocityAmpBoost * 0.5;
          const y = mid + Math.sin(x * freq + phase + w) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += (isPlaying ? 0.045 : 0.015) + smoothedSpeed * 0.5;
      animFrame.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('portfolio-scroll', onScrollEvent);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [isPlaying]);

  return (
    <section
      ref={sectionRef}
      id="next"
      className="relative py-16 sm:py-36 px-5 sm:px-12 bg-[#050506] border-y border-[rgba(237,232,221,0.08)] overflow-hidden text-center"
    >
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

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center w-full">
        {/* Section Index */}
        <p className="mono text-[#f2a33c] mb-3">02 / NEXT</p>
        <h2 className="font-display font-semibold text-[clamp(2.2rem,5vw,4.2rem)] text-[#ede8dd] tracking-tight leading-none mb-10">
          {language === 'fr' ? 'La prochaine sortie' : 'The next release'}
        </h2>

        {/* Coming Soon Pill */}
        <p className="mono text-[#f2a33c] tracking-[0.3em] text-xs mb-3">
          — {language === 'fr' ? 'BIENTÔT DISPONIBLE' : 'COMING SOON'} —
        </p>

        {/* Giant Outlined Wordmark with Parallax & Dolly Zoom - Responsive clamp to prevent mobile overflow */}
        <motion.h3
          style={{
            scale: titleScale,
            y: titleY,
            textShadow: isPlaying ? '0 0 80px rgba(242, 163, 60, 0.35)' : 'none',
          }}
          className={`font-display font-bold text-[clamp(2.2rem,11.5vw,13rem)] leading-[0.92] tracking-tight transition-[color,text-shadow] duration-500 select-none will-change-transform w-full text-center origin-center whitespace-nowrap ${
            isPlaying ? 'stroke-amber' : 'stroke-cream'
          }`}
        >
          SYNTHESIS
        </motion.h3>

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

        {/* Audio Player Hint */}
        <p className="mono text-xs text-[#837e6f] mt-4">
          {language === 'fr'
            ? 'Le lecteur audio en bas à droite diffuse mes morceaux — testez-le.'
            : 'The audio player in the bottom dock plays my original tracks — check it out.'}
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
