import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowDownRight } from 'lucide-react';

interface HeroProps {
  scrollVelocity?: number;
}

export const Hero = ({ scrollVelocity = 0 }: HeroProps) => {
  const { language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrame = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Keep velocityRef in sync with prop and event
  useEffect(() => {
    velocityRef.current = scrollVelocity;
  }, [scrollVelocity]);

  // Framer Motion Scrollytelling Dolly-Zoom Camera Push
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Monumental Title Dolly Zoom - toned down on mobile to avoid overwhelming small displays
  const titleScale = useTransform(scrollYProgress, [0, 0.8], [1, isMobile ? 1.14 : 1.38]);
  const titleY = useTransform(scrollYProgress, [0, 0.8], [0, isMobile ? 45 : 130]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 0.85, 0]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.55, 0.85], ['blur(0px)', 'blur(1px)', 'blur(8px)']);

  // Foregrounds / Subtitle Parallax Separation
  const kickerOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const kickerY = useTransform(scrollYProgress, [0, 0.25], [0, isMobile ? -12 : -25]);

  const subY = useTransform(scrollYProgress, [0, 0.65], [0, isMobile ? -20 : -45]);
  const subOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const ctaY = useTransform(scrollYProgress, [0, 0.5], [0, isMobile ? 15 : 25]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // 3D Cinematic Starfield Warp & Hyperspace Speed Lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // High frequency scroll event listener
    const onScrollEvent = (e: Event) => {
      const custom = e as CustomEvent<{ velocity: number }>;
      if (custom.detail?.velocity !== undefined) {
        velocityRef.current = custom.detail.velocity;
      }
    };
    window.addEventListener('portfolio-scroll', onScrollEvent);

    // 3D Starfield particles with depth Z (lighter on mobile for battery and smoothness)
    const numStars = width < 640 ? 55 : 110;
    const maxZ = 1200;
    const focalLength = width < 640 ? 280 : 360;

    interface Star {
      x: number;
      y: number;
      z: number;
      prevZ: number;
      size: number;
      colorType: number; // 0: amber, 1: red, 2: cream
      baseAlpha: number;
    }

    const stars: Star[] = [];
    for (let i = 0; i < numStars; i++) {
      const z = Math.random() * maxZ + 1;
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z,
        prevZ: z,
        size: Math.random() * 1.5 + 0.8,
        colorType: Math.random() > 0.35 ? 0 : Math.random() > 0.4 ? 1 : 2,
        baseAlpha: Math.random() * 0.5 + 0.3,
      });
    }

    let smoothedVelocity = 0;

    const render = () => {
      // Gentle decay of velocity
      smoothedVelocity += (Math.abs(velocityRef.current) - smoothedVelocity) * 0.12;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const speed = 0.7 + smoothedVelocity * (width < 640 ? 4.5 : 7.5);
      const isWarping = smoothedVelocity > 0.6;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.prevZ = star.z;
        star.z -= speed;

        // Recycle star when it passes the camera or goes out of bounds
        if (star.z <= 2) {
          star.z = maxZ;
          star.prevZ = maxZ;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        // Project 3D coordinates to 2D screen
        const k = focalLength / star.z;
        const sx = cx + star.x * k;
        const sy = cy + star.y * k;

        // Check screen bounds
        if (sx < -100 || sx > width + 100 || sy < -100 || sy > height + 100) {
          star.z = maxZ;
          continue;
        }

        const depthFade = Math.min(1, Math.max(0.1, (1 - star.z / maxZ) * 1.2));
        const alpha = star.baseAlpha * depthFade;

        let color = `rgba(242, 163, 60, ${alpha})`;
        if (star.colorType === 1) color = `rgba(255, 61, 46, ${alpha * 0.9})`;
        if (star.colorType === 2) color = `rgba(237, 232, 221, ${alpha * 0.8})`;

        if (isWarping) {
          // Draw motion blur / warp light streak towards camera
          const prevK = focalLength / Math.max(2, star.prevZ);
          const prevSx = cx + star.x * prevK;
          const prevSy = cy + star.y * prevK;

          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.min(2.4, star.size * k * 0.9);
          ctx.lineCap = 'round';
          ctx.moveTo(prevSx, prevSy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          // Draw ambient glowing particle
          const r = Math.max(0.6, star.size * k * 0.6);
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      animFrame.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('portfolio-scroll', onScrollEvent);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[90vh] sm:min-h-screen flex flex-col justify-between overflow-hidden pt-20 sm:pt-28 pb-0 text-center bg-black"
      aria-label="Introduction"
    >
      {/* 3D Warp & Starfield Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
        aria-hidden="true"
      />

      {/* Nuanced OLED Dark Gradients & Atmospheric Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 50% 38%, rgba(242, 163, 60, 0.08), transparent 52%),
            radial-gradient(circle at 50% 64%, rgba(255, 61, 46, 0.04), transparent 56%),
            radial-gradient(ellipse 90% 80% at 50% 50%, transparent 25%, #000000 92%),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 35%, #000000 100%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-5 sm:px-12 md:px-16 my-auto py-6 sm:py-14 flex flex-col items-center text-center max-w-5xl mx-auto w-full">
        {/* Status Kicker with Parallax Fade (Responsive concise on mobile) */}
        <motion.p
          style={{ opacity: kickerOpacity, y: kickerY }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mono text-[#b9b3a4] flex items-center justify-center gap-2 mb-3 sm:mb-6 text-center text-[0.7rem] sm:text-[0.82rem] tracking-wider uppercase will-change-transform"
        >
          <span className="status-dot shrink-0" aria-hidden="true" />
          <span>
            {language === 'fr' ? (
              <>
                <span className="sm:hidden">Disponible · Vibe Coder en France</span>
                <span className="hidden sm:inline">disponible pour missions &amp; projets ambitieux — vibe coder en France</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">Available · Vibe Coder in France</span>
                <span className="hidden sm:inline">available for contracts &amp; full-stack builds — vibe coder in France</span>
              </>
            )}
          </span>
        </motion.p>

        {/* Monumental Title Dolly-Zoom Camera Push: ONLY "ARES" */}
        <motion.h1
          style={{
            scale: titleScale,
            y: titleY,
            opacity: titleOpacity,
            filter: titleBlur,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-bold uppercase tracking-[-0.035em] leading-[0.86] sm:leading-[0.82] select-none text-[clamp(3.6rem,19vw,14rem)] mb-4 sm:mb-8 text-center origin-center will-change-transform"
        >
          <span className="block text-[#ede8dd] drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
            ARES
          </span>
        </motion.h1>

        {/* Subtitle & Role with Parallax Drift */}
        <motion.div
          style={{
            y: subY,
            opacity: subOpacity,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-center mx-auto flex flex-col items-center will-change-transform"
        >
          <p className="font-display font-medium text-[clamp(1.1rem,2.5vw,1.8rem)] text-[#ede8dd] tracking-tight text-center">
            {language === 'fr' ? (
              <>
                Développeur full-stack <em className="text-[#f2a33c] not-italic font-serif">&amp;</em> creative builder.
              </>
            ) : (
              <>
                Full-stack developer <em className="text-[#f2a33c] not-italic font-serif">&amp;</em> creative builder.
              </>
            )}
          </p>

          <p className="text-[#b9b3a4] text-[clamp(0.85rem,1.5vw,1.15rem)] mt-2 sm:mt-3 font-normal leading-relaxed max-w-xl text-center mx-auto">
            {language === 'fr'
              ? 'Je conçois des produits web & mobiles haute performance — véloces, soignés et avec du caractère.'
              : 'I build streaming-grade web & mobile products — fast, polished, and a little bit loud.'}
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          style={{
            y: ctaY,
            opacity: ctaOpacity,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-10 will-change-transform"
        >
          <a href="#work" className="btn btn--solid group py-3 px-5 sm:py-3.5 sm:px-6 text-[0.72rem] sm:text-[0.78rem]">
            <span>{language === 'fr' ? 'Voir les projets' : 'View work'}</span>
            <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a href="#contact" className="btn btn--ghost py-3 px-5 sm:py-3.5 sm:px-6 text-[0.72rem] sm:text-[0.78rem]">
            <span>{language === 'fr' ? 'Me contacter' : 'Contact me'}</span>
          </a>
        </motion.div>
      </div>

      {/* Hero Bottom Meta Bar - Clean Single-line Bar on Mobile */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 sm:px-12 md:px-16 py-3 sm:py-4 border-t border-[rgba(237,232,221,0.08)] text-[#837e6f] font-mono text-[0.66rem] sm:text-[0.72rem] tracking-wider uppercase bg-black/60 backdrop-blur-sm select-none">
        <span>{language === 'fr' ? 'EN PROD DEPUIS 2023 →' : 'SHIPPING SINCE 2023 →'}</span>
        <span className="hidden sm:inline-block text-[#b9b3a4]">
          SHOPCORE · Z-FLIX · Z-LAUNCHER · Z-MUSIC · SPOTI
        </span>
        <span className="inline-flex items-center gap-2">
          <span>SCROLL</span>
          <span className="w-8 sm:w-10 h-[1px] bg-[rgba(237,232,221,0.2)] relative overflow-hidden inline-block">
            <span className="absolute inset-0 bg-[#f2a33c] animate-[scrollhint_2.2s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
          </span>
        </span>
      </div>
    </section>
  );
};
