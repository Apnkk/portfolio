import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { CustomCursor } from './components/CustomCursor';
import { AudioPlayer } from './components/AudioPlayer';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeTicker } from './components/MarqueeTicker';
import { WorkSection } from './components/WorkSection';
import { LabBentoSection } from './components/LabBentoSection';
import { NextSection } from './components/NextSection';
import { MethodSection } from './components/MethodSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { TerminalDrawer } from './components/TerminalDrawer';
import { audioEngine } from './utils/audioSynth';
import { ArrowUp } from 'lucide-react';

function PortfolioApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Cinematic Scrubber Timeline (Video Progress Bar)
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.0005,
  });

  // Track scroll percentage
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  // Initialize Lenis Inertial Smooth Scrolling with native mobile touch momentum
  useEffect(() => {
    const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const lenis = new Lenis({
      duration: isTouch ? 0.95 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      syncTouch: false, // Preserves hardware-accelerated 120Hz native touch momentum on mobile
    });
    lenisRef.current = lenis;
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Dispatch velocity event from Lenis
    lenis.on('scroll', (e: { velocity: number }) => {
      window.dispatchEvent(new CustomEvent('portfolio-scroll', { detail: e }));
    });

    // Native scroll velocity fallback for mobile touch momentum
    let lastY = window.scrollY;
    let lastTime = performance.now();
    const handleNativeScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      lastTime = now;
      const velocity = dy / dt;
      window.dispatchEvent(new CustomEvent('portfolio-scroll', { detail: { velocity } }));
    };
    window.addEventListener('scroll', handleNativeScroll, { passive: true });

    // Intercept in-page hash links for cinematic Lenis scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -35, duration: 1.1 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('scroll', handleNativeScroll);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  useEffect(() => {
    return audioEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
    });
  }, []);

  const handleTogglePlay = () => {
    audioEngine.toggle();
  };

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let active = true;

    const startAudio = async () => {
      if (!active) return;
      try {
        const started = await audioEngine.play();
        if (started && active) {
          setIsPlaying(true);
          cleanup();
        }
      } catch {
        // Awaiting browser gesture
      }
    };

    const cleanup = () => {
      const events = ['pointerdown', 'keydown', 'touchstart'];
      events.forEach((evt) => {
        window.removeEventListener(evt, startAudio);
      });
    };

    // 1. Initial attempt
    void startAudio();

    // 2. Direct user interaction gesture fallback (no spam on scroll/wheel)
    const events = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((evt) => {
      window.addEventListener(evt, startAudio, { once: true, passive: true });
    });

    return () => {
      active = false;
      cleanup();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-[#f5f3ef] selection:bg-[#ff1e38] selection:text-white">
      {/* 35mm Analog Film Grain Texture */}
      <div className="noise" aria-hidden="true" />

      {/* Crimson Laser Scrubber Bar (Top) */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[950] pointer-events-none bg-white/[0.04]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#ff1e38] via-[#ff4d61] to-[#ff1e38] origin-left shadow-[0_0_14px_rgba(255,30,56,0.9)]"
          style={{ scaleX: smoothProgress }}
        />
      </div>

      {/* Magnetic Creative Cursor */}
      <CustomCursor />

      {/* Persistent Audio Player Dock (Bottom Right) */}
      <AudioPlayer isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />

      {/* Floating Scroll Progress / Back to Top (Bottom Left) */}
      {scrollPercent > 8 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-[800] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/[0.1] hover:border-[#ff1e38]/60 text-[#b8b3a8] hover:text-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)] cursor-pointer select-none group"
          title="Retour en haut"
          aria-label="Retour en haut de page"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#ff1e38] group-hover:-translate-y-0.5 transition-transform" />
          <span className="mono text-[0.66rem] font-semibold text-[#f5f3ef]">
            {scrollPercent}%
          </span>
        </motion.button>
      )}

      {/* Top Navbar */}
      <Navbar
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onToggleTerminal={() => setTerminalOpen((prev) => !prev)}
      />

      {/* Main Scrollytelling Content */}
      <main id="main" className="pb-24 sm:pb-0">
        <Hero onOpenTerminal={() => setTerminalOpen(true)} />
        <MarqueeTicker />
        <WorkSection />
        <LabBentoSection />
        <NextSection isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
        <MethodSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Full Developer Terminal Drawer with AnimatePresence */}
      <AnimatePresence>
        {terminalOpen && (
          <TerminalDrawer
            isOpen={terminalOpen}
            onClose={() => setTerminalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <PortfolioApp />
    </LanguageProvider>
  );
}

export default App;
