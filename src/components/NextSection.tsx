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
  const isVisibleRef = useRef(false);

  // Scrollytelling Dolly transforms
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.06, 0.92]);
  const titleY = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);

  // Sine Wave Visualizer with velocity modulation & IntersectionObserver pause
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
    window.addEventListener('portfolio-scroll', onScrollEvent, { passive: true });

    const render = () => {
      if (!isVisibleRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      smoothedSpeed += (Math.abs(velocityRef.current) * 0.08 - smoothedSpeed) * 0.15;
      velocityRef.current *= 0.9;

      ctx.beginPath();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = isPlaying ? '#ff1e38' : 'rgba(245, 243, 239, 0.25)';

      const waves = isPlaying ? 3 : 2;
      const velocityAmpBoost = smoothedSpeed * 30;

      for (let w = 0; w < waves; w++) {
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const freq = 0.015 + w * 0.005;
          const amp = isPlaying
            ? (22 + w * 6 + velocityAmpBoost) * Math.sin(phase * 0.8 + x * 0.005)
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

    // Pause offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            if (!animFrame.current) animFrame.current = requestAnimationFrame(render);
          } else {
            if (animFrame.current) {
              cancelAnimationFrame(animFrame.current);
              animFrame.current = null;
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    render();

    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0) {
        canvas.width = rect.width;
        canvas.height = 80;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('portfolio-scroll', onScrollEvent);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [isPlaying]);

  return (
    <section
      ref={sectionRef}
      id="next"
      className="relative py-20 sm:py-36 px-5 sm:px-12 bg-black border-y border-white/[0.08] overflow-hidden text-center select-none"
    >
      {/* Background Crimson Glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isPlaying ? 'opacity-100' : 'opacity-35'
        }`}
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 60%, rgba(255, 30, 56, 0.15), transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center w-full">
        {/* Section Index */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]" />
          <p className="mono text-[#ff1e38] font-semibold text-xs tracking-widest">
            03 / NEXT
          </p>
        </div>

        <h2 className="font-display font-semibold text-[clamp(2.2rem,5vw,4.5rem)] text-[#f5f3ef] tracking-tight leading-none mb-4">
          {language === 'fr' ? 'La prochaine sortie' : 'The next release'}
        </h2>

        {/* Coming Soon Pill */}
        <p className="mono text-[#ff1e38] tracking-[0.25em] text-xs mb-4 font-semibold uppercase">
          — {language === 'fr' ? 'PROCHAINE PRODUCTION' : 'NEXT RELEASE'} —
        </p>

        {/* Giant Outlined Wordmark with Crimson Glow */}
        <div className="w-full max-w-full overflow-hidden flex justify-center py-2">
          <motion.h3
            style={{
              scale: titleScale,
              y: titleY,
              textShadow: isPlaying ? '0 0 80px rgba(255, 30, 56, 0.6)' : 'none',
            }}
            className={`font-display font-bold text-[clamp(1.85rem,9.8vw,11.5rem)] leading-[0.9] tracking-tight transition-[color,text-shadow] duration-500 select-none will-change-transform w-full text-center origin-center whitespace-nowrap ${
              isPlaying ? 'stroke-red' : 'stroke-cream'
            }`}
          >
            SYNTHESIS
          </motion.h3>
        </div>

        {/* Sine Wave Visualizer */}
        <div className="w-full max-w-[680px] h-20 my-6 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            aria-hidden="true"
          />
        </div>

        {/* Pitch */}
        <p className="text-[#f5f3ef] font-display text-[clamp(1.05rem,1.8vw,1.35rem)] max-w-2xl font-medium leading-relaxed">
          {language === 'fr' ? (
            <>
              Un environnement de travail créatif et autonome dans la lignée de mes précédents produits.
              <br />
              Streaming temps réel, mémoire locale, des outils que l’on <em className="text-[#ff1e38] not-italic">ressent</em>.
            </>
          ) : (
            <>
              A creative, autonomous workspace in the same bloodline as my core products.
              <br />
              Realtime streaming, local-first memory, tools you can <em className="text-[#ff1e38] not-italic">feel</em>.
            </>
          )}
        </p>

        {/* Play CTA */}
        <button
          onClick={onTogglePlay}
          className="btn btn--crimson mt-8 group cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>{language === 'fr' ? 'Pause ambiance sonore' : 'Pause audio'}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>{language === 'fr' ? 'Lancer la bande sonore' : 'Press play'}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
