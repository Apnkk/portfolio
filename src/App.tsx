import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { WorkSection } from './components/WorkSection';
import { MusixSection } from './components/MusixSection';
import { StackSection } from './components/StackSection';
import { ProcessSection } from './components/ProcessSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { AudioPlayer } from './components/AudioPlayer';
import { CustomCursor } from './components/CustomCursor';
import { audioEngine } from './utils/audioSynth';
import { ArrowUp } from 'lucide-react';

function PortfolioApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Top amber hairline scroll progress
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.0005,
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  // Lenis Inertial Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.082,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.6,
      syncTouch: false,
    });
    lenisRef.current = lenis;
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Intercept in-page anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -40, duration: 1.0 });
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

  // Sync audio state
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
      lenisRef.current.scrollTo(0, { duration: 1.0 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="relative min-h-screen bg-[var(--bg)] text-[var(--cream)] selection:bg-[var(--amber)] selection:text-[var(--bg)]">
      {/* Analogue Noise Grain Texture */}
      <div className="noise" aria-hidden="true" />

      {/* Amber Custom Cursor */}
      <CustomCursor />

      {/* Top Hairline Amber Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-[1.5px] z-[970] pointer-events-none bg-[var(--line)]">
        <motion.div
          className="h-full bg-[var(--amber)] origin-left"
          style={{ scaleX: smoothProgress }}
        />
      </div>

      {/* Top Navigation */}
      <Navbar />

      {/* Persistent Audio Player Dock */}
      <AudioPlayer isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />

      {/* Floating Scroll Indicator */}
      {scrollPercent > 10 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-[800] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] backdrop-blur-xl border border-[var(--line)] hover:border-[var(--amber)] text-[var(--cream-dim)] hover:text-[var(--cream)] transition-all shadow-[0_8px_30px_rgba(0,0,0,0.8)] cursor-pointer select-none group"
          title="Retour en haut"
          aria-label="Retour en haut de page"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[var(--amber)] group-hover:-translate-y-0.5 transition-transform" />
          <span className="font-mono text-[0.66rem] font-semibold text-[var(--cream)]">
            {scrollPercent}%
          </span>
        </motion.button>
      )}

      {/* Main Content Architecture identical to mysticsaba.com */}
      <main id="main">
        <Hero />
        <Marquee />
        <WorkSection />
        <MusixSection isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
        <StackSection />
        <ProcessSection />
        <AboutSection />
        <ContactSection />
      </main>
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
