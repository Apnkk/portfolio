import { useState } from 'react';
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
        <Hero isPlaying={isPlaying} onTogglePlay={handleTogglePlay} />
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
