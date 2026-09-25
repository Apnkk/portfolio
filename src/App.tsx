import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { CustomCursor } from './components/CustomCursor';
import { AudioPlayer } from './components/AudioPlayer';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarqueeTicker } from './components/MarqueeTicker';
import { WorkSection } from './components/WorkSection';
import { NextSection } from './components/NextSection';
import { StackSection } from './components/StackSection';
import { MethodSection } from './components/MethodSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { TerminalDrawer } from './components/TerminalDrawer';
import { audioEngine } from './utils/audioSynth';

function PortfolioApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Cinematic Scrubber Timeline (Video Progress Bar)
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.0005,
  });

  // Initialize Lenis Inertial Smooth Scrolling (like a fluid camera dolly)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Track scroll velocity for velocity-linked cinematic effects
    lenis.on('scroll', (e: { velocity: number }) => {
      setScrollVelocity(e.velocity);
      window.dispatchEvent(new CustomEvent('portfolio-scroll', { detail: e }));
    });

    // Intercept in-page hash links for cinematic Lenis scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -24, duration: 1.3 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
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
      const events = ['click', 'pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'];
      events.forEach((evt) => {
        window.removeEventListener(evt, startAudio);
        document.removeEventListener(evt, startAudio);
      });
    };

    // 1. Immediate autoplay on site entrance
    void startAudio();

    // 2. Gesture fallback in case browser policy requires first interaction
    const events = ['click', 'pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'];
    events.forEach((evt) => {
      window.addEventListener(evt, startAudio, { once: true, passive: true });
      document.addEventListener(evt, startAudio, { once: true, passive: true });
    });

    return () => {
      active = false;
      cleanup();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-[#ede8dd] selection:bg-[#f2a33c] selection:text-black">
      {/* 35mm Analog Film Grain Texture */}
      <div className="noise" aria-hidden="true" />

      {/* Cinematic Video Timeline Scrubber Bar (Top) */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-[rgba(237,232,221,0.06)]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#f2a33c] via-[#ff3d2e] to-[#f2a33c] origin-left shadow-[0_0_12px_rgba(242,163,60,0.6)]"
          style={{ scaleX: smoothProgress }}
        />
      </div>

      {/* Magnetic Creative Cursor */}
      <CustomCursor />

      {/* Persistent Audio Player Dock (Bottom Right) */}
      <AudioPlayer isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />

      {/* Top Navbar */}
      <Navbar
        isPlaying={isPlaying}
        onToggleTerminal={() => setTerminalOpen((prev) => !prev)}
      />

      {/* Main Editorial Scrollytelling Content */}
      <main id="main">
        <Hero scrollVelocity={scrollVelocity} />
        <MarqueeTicker scrollVelocity={scrollVelocity} />
        <WorkSection />
        <NextSection isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
        <StackSection />
        <MethodSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Dev Interactive Terminal */}
      <TerminalDrawer
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />
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
