import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowDownRight, Terminal, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenTerminal?: () => void;
}

export const Hero = ({ onOpenTerminal }: HeroProps) => {
  const { language } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrame = useRef<number | null>(null);
  const velocityRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const isVisibleRef = useRef(true);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // Framer Motion Parallax Camera Push
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.8], [1, isMobile ? 1.08 : 1.25]);
  const titleY = useTransform(scrollYProgress, [0, 0.8], [0, isMobile ? 30 : 90]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65, 0.9], [1, 0.85, 0]);

  const subtitleY = useTransform(scrollYProgress, [0, 0.6], [0, isMobile ? -15 : -35]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const cardsY = useTransform(scrollYProgress, [0, 0.6], [0, isMobile ? 15 : 30]);
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  // High-performance 3D Crimson Constellation & Particle Engine
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
    window.addEventListener('resize', onResize, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onScrollEvent = (e: Event) => {
      const custom = e as CustomEvent<{ velocity: number }>;
      if (custom.detail?.velocity !== undefined) {
        velocityRef.current = custom.detail.velocity;
      }
    };
    window.addEventListener('portfolio-scroll', onScrollEvent, { passive: true });

    // Particles tuned for high framerate: 45 on mobile, 90 on desktop
    const count = width < 640 ? 45 : 90;
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      isCrimson: boolean;
    }

    const particles: Particle[] = [];
    const colors = ['#ff1e38', '#ff334b', '#ffffff', '#e50914'];

    for (let i = 0; i < count; i++) {
      const isCrimson = Math.random() > 0.35;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: isCrimson ? Math.random() * 2 + 1.2 : Math.random() * 1.5 + 0.8,
        color: isCrimson ? colors[Math.floor(Math.random() * 2)] : colors[2],
        alpha: Math.random() * 0.6 + 0.25,
        isCrimson,
      });
    }

    let smoothedSpeed = 0;

    const render = () => {
      if (!isVisibleRef.current) return;

      // Mouse smooth interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Scroll velocity influence
      smoothedSpeed += (velocityRef.current * 0.8 - smoothedSpeed) * 0.1;
      velocityRef.current *= 0.92;

      ctx.clearRect(0, 0, width, height);

      const maxConnectDist = width < 640 ? 75 : 110;

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy - smoothedSpeed * 1.2;

        // Wrap edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Gentle mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          p.x -= (dx / dist) * force * 1.2;
          p.y -= (dy / dist) * force * 1.2;
        }

        // Draw particle dot with high-speed halo glow (avoids expensive shadowBlur)
        if (p.isCrimson) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#ff1e38';
          ctx.globalAlpha = p.alpha * 0.3;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Connect nearby particles with subtle laser lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < maxConnectDist) {
            const lineAlpha = (1 - dist2 / maxConnectDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.isCrimson || p2.isCrimson ? '#ff1e38' : 'rgba(255, 255, 255, 0.4)';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animFrame.current = requestAnimationFrame(render);
    };

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
      { threshold: 0.05 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    render();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('portfolio-scroll', onScrollEvent);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[95vh] sm:min-h-screen flex flex-col justify-between overflow-hidden pt-24 sm:pt-32 pb-0 text-center bg-black select-none"
      aria-label="Introduction"
    >
      {/* 3D Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-85"
        aria-hidden="true"
      />

      {/* OLED Pure Dark Gradients & Crimson Atmospheric Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 45% at 50% 32%, rgba(255, 30, 56, 0.16), transparent 70%),
            radial-gradient(ellipse 80% 60% at 50% 75%, rgba(168, 15, 33, 0.08), transparent 75%),
            radial-gradient(circle at 50% 50%, transparent 40%, #000000 95%),
            linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, #000000 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <div className="relative z-10 px-5 sm:px-12 md:px-16 my-auto py-8 sm:py-12 flex flex-col items-center max-w-5xl mx-auto w-full">
        {/* Availability Pill with Pulsing LED */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/[0.1] hover:border-[#ff1e38]/50 shadow-[0_4px_20px_rgba(0,0,0,0.8)] mb-6 sm:mb-8 transition-colors cursor-default"
        >
          <span className="status-dot shrink-0" aria-hidden="true" />
          <span className="mono text-[0.68rem] sm:text-[0.74rem] text-[#c2bdb3] tracking-wider uppercase font-medium">
            {language === 'fr' ? (
              <>
                <span className="sm:hidden">Disponible · Vibe Coder en France</span>
                <span className="hidden sm:inline">Disponible pour missions &amp; builds — vibe coder en France</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">Available · Vibe Coder in France</span>
                <span className="hidden sm:inline">Available for contracts &amp; builds — vibe coder in France</span>
              </>
            )}
          </span>
        </motion.div>

        {/* Monumental Sculptural Typography: "ARES" with Backlight Glow */}
        <motion.div
          style={{
            scale: titleScale,
            y: titleY,
            opacity: titleOpacity,
          }}
          className="relative will-change-transform mb-3 sm:mb-6"
        >
          {/* Subtle Ambient Red Glow Behind Title */}
          <div
            className="absolute -inset-4 sm:-inset-8 rounded-full bg-[#ff1e38]/12 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <h1 className="relative font-display font-bold uppercase tracking-[-0.04em] leading-[0.85] select-none text-[clamp(3.6rem,20vw,14.5rem)] text-center">
            <span className="block text-[#f5f3ef] drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)]">
              ARES
            </span>
          </h1>
        </motion.div>

        {/* Subtitle & Role */}
        <motion.div
          style={{
            y: subtitleY,
            opacity: subtitleOpacity,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl text-center mx-auto flex flex-col items-center will-change-transform space-y-3"
        >
          <p className="font-display font-medium text-[clamp(1.15rem,2.8vw,1.95rem)] text-[#f5f3ef] tracking-tight">
            {language === 'fr' ? (
              <>
                Développeur full-stack <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> creative builder.
              </>
            ) : (
              <>
                Full-stack developer <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> creative builder.
              </>
            )}
          </p>

          <p className="text-[#b8b3a8] text-[clamp(0.85rem,1.5vw,1.1rem)] font-normal leading-relaxed max-w-xl mx-auto">
            {language === 'fr'
              ? 'Je conçois des applications de streaming, du mobile iOS, du reverse d’APIs et des interfaces rapides qui ont du caractère.'
              : 'I engineer streaming-grade web & iOS software, reverse-engineered APIs, and fast digital products with character.'}
          </p>
        </motion.div>

        {/* Interactive Quick Metrics Bar */}
        <motion.div
          style={{
            y: cardsY,
            opacity: cardsOpacity,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-8 sm:mt-10 w-full max-w-3xl will-change-transform"
        >
          {[
            { value: '10+', label: language === 'fr' ? 'Projets live' : 'Shipped Projects' },
            { value: 'Web & iOS', label: language === 'fr' ? 'Multiplateforme' : 'Cross-Platform' },
            { value: '<50ms', label: language === 'fr' ? 'Latence APIs' : 'Fast API Latency' },
            { value: '100%', label: language === 'fr' ? 'Solo shipping' : 'Solo Autonomy' },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/[0.08] hover:border-[#ff1e38]/40 transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-lg sm:text-2xl text-[#f5f3ef] group-hover:text-[#ff1e38] transition-colors">
                  {stat.value}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]/50 group-hover:bg-[#ff1e38] transition-colors shadow-[0_0_8px_rgba(255,30,56,0.6)]" />
              </div>
              <p className="mono text-[0.62rem] sm:text-[0.68rem] text-[#726d64] uppercase tracking-wider truncate">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 will-change-transform"
        >
          <a
            href="#work"
            className="btn btn--crimson group py-3 px-6 sm:py-3.5 sm:px-7 text-[0.74rem] sm:text-[0.78rem]"
          >
            <span>{language === 'fr' ? 'Explorer les projets' : 'Explore Projects'}</span>
            <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a
            href="#contact"
            className="btn btn--ghost py-3 px-6 sm:py-3.5 sm:px-7 text-[0.74rem] sm:text-[0.78rem]"
          >
            <span>{language === 'fr' ? 'Me contacter' : 'Get in Touch'}</span>
          </a>

          {onOpenTerminal && (
            <button
              type="button"
              onClick={onOpenTerminal}
              className="btn btn--ghost py-3 px-4 sm:py-3.5 text-[0.74rem] sm:text-[0.78rem] text-[#b8b3a8] hover:text-[#ff1e38]"
              title="Terminal Dev"
            >
              <Terminal className="w-3.5 h-3.5 text-[#ff1e38]" />
              <span className="hidden sm:inline">CLI</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Hero Bottom Meta Bar */}
      <div className="relative z-10 flex items-center justify-between gap-3 px-5 sm:px-12 md:px-16 py-3 sm:py-4 border-t border-white/[0.08] text-[#726d64] font-mono text-[0.66rem] sm:text-[0.72rem] tracking-wider uppercase bg-black/85 backdrop-blur-md select-none">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#ff1e38]" />
          <span>{language === 'fr' ? 'PRODUCTION SHIPPER' : 'PRODUCTION SHIPPER'}</span>
        </span>
        <span className="hidden md:inline-block text-[#b8b3a8]">
          SHOPCORE · Z-FLIX · Z-LAUNCHER · Z-MUSIC · SPOTI LIQUID GLASS
        </span>
        <span className="inline-flex items-center gap-2">
          <span>SCROLL</span>
          <span className="w-8 sm:w-12 h-[1px] bg-white/20 relative overflow-hidden inline-block">
            <span className="absolute inset-0 bg-[#ff1e38] animate-[scrollhint_2.2s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
          </span>
        </span>
      </div>
    </section>
  );
};
