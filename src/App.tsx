import { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { BackgroundGlow } from './components/BackgroundGlow';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BentoAbout } from './components/BentoAbout';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TerminalDrawer } from './components/TerminalDrawer';

function PortfolioContent() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <div className="relative min-h-screen text-neutral-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background torch and subtle grid */}
      <BackgroundGlow />

      {/* Floating pill navigation */}
      <Navbar onToggleTerminal={() => setTerminalOpen((prev) => !prev)} />

      {/* Main Content Sections */}
      <main className="relative z-10 flex-1">
        <Hero />
        <BentoAbout />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenTerminal={() => setTerminalOpen(true)} />

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
      <PortfolioContent />
    </LanguageProvider>
  );
}

export default App;
