import { useState, useEffect } from 'react';
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

  const handleTogglePlay = () => {
    const nextState = audioEngine.toggle();
    setIsPlaying(nextState);
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
      {/* Magnetic Creative Cursor */}
      <CustomCursor />

      {/* Persistent Audio Player Dock (Bottom Right) */}
      <AudioPlayer isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />

      {/* Top Navbar */}
      <Navbar
        isPlaying={isPlaying}
        onToggleTerminal={() => setTerminalOpen((prev) => !prev)}
      />

      {/* Main Editorial Content */}
      <main id="main">
        <Hero />
        <MarqueeTicker />
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
