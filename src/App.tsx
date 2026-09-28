import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkSection } from './components/WorkSection';
import { StackSection } from './components/StackSection';
import { MethodSection } from './components/MethodSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { AudioPlayer } from './components/AudioPlayer';
import { audioEngine } from './utils/audioSynth';
import { ArrowUp } from 'lucide-react';

function PortfolioApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scroll progress bar at the very top
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    restDelta: 0.0005,
  });

  // Track scroll percentage for the back-to-top indicator
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

    // Intercept in-page anchor links for smooth scrolling
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

  // Sync audio playback state
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
    <div className="relative min-h-screen bg-black text-[#f4f4f5] selection:bg-[#ff1e38] selection:text-white">
      {/* Top Hairline Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-[1.5px] z-[970] pointer-events-none bg-white/[0.04]">
        <motion.div
          className="h-full bg-[#ff1e38] origin-left"
          style={{ scaleX: smoothProgress }}
        />
      </div>

      {/* Top Navigation Bar */}
      <Navbar isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />

      {/* Persistent Audio Player Dock (Bottom Right on desktop, Mini dock on mobile) */}
      <AudioPlayer isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />

      {/* Floating Scroll Percentage / Return to Top Pill */}
      {scrollPercent > 10 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-[800] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#09090b]/90 backdrop-blur-xl border border-white/[0.1] hover:border-white/30 text-[#a1a1aa] hover:text-white transition-all shadow-[0_8px_30px_rgba(0,0,0,0.8)] cursor-pointer select-none group"
          title="Retour en haut"
          aria-label="Retour en haut de page"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#ff1e38] group-hover:-translate-y-0.5 transition-transform" />
          <span className="font-mono text-[0.66rem] font-semibold text-white">
            {scrollPercent}%
          </span>
        </motion.button>
      )}

      {/* Main Single-Page Scrollytelling Architecture */}
      <main id="main" className="pb-24 sm:pb-0">
        <Hero />
        <WorkSection />
        <StackSection />
        <MethodSection />
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
