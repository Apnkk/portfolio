import { useLanguage } from '../context/LanguageContext';

export const AboutSection = () => {
  const { language } = useLanguage();

  return (
    <section id="about" className="py-24 sm:py-32 px-6 sm:px-12 md:px-16 max-w-5xl mx-auto text-left" aria-labelledby="about-title">
      {/* Section Head */}
      <header className="mb-12 sm:mb-16">
        <p className="mono text-[#f2a33c] mb-3">05 / ABOUT</p>
        <h2 id="about-title" className="font-display font-semibold text-[clamp(2.4rem,6vw,4.8rem)] text-[#ede8dd] tracking-tight leading-none">
          {language === 'fr' ? 'Salut, je suis Ares' : "Hi, I'm Ares"}
        </h2>
      </header>

      {/* Editorial Body */}
      <div className="space-y-8 font-display font-medium text-[clamp(1.2rem,2.5vw,1.85rem)] text-[#ede8dd] leading-[1.4] tracking-tight">
        <p>
          {language === 'fr' ? (
            <>
              Je suis un développeur full-stack basé en France qui aborde chaque projet comme un véritable produit. Je suis un <em className="text-[#f2a33c] not-italic">vibe coder</em> — je conçois vite avec l’IA à mes côtés — puis j’industrialise sérieusement : typage strict TypeScript, vraies bases de données, architectures distribuées et micro-interactions ultra-fluides.
            </>
          ) : (
            <>
              I'm a full-stack developer based in France who treats projects like living products. I'm a <em className="text-[#f2a33c] not-italic">vibe coder</em> — I build fast with AI by my side — then I engineer it properly: strict TypeScript, production databases, distributed architectures, and buttery smooth micro-interactions.
            </>
          )}
        </p>

        <p className="text-[#b9b3a4]">
          {language === 'fr' ? (
            <>
              Tout ce que je livre vit au croisement de la <strong className="text-[#f2a33c] font-medium">performance, des médias et du web moderne</strong> : workflows d'IA avec NexusFlow, suivi biométrique mobile avec PulseTrack, IDE cloud collaboratif avec DevStudio. J'aime les interfaces qui vibrent dès la première seconde.
            </>
          ) : (
            <>
              Everything I ship lives at the intersection of <strong className="text-[#f2a33c] font-medium">performance, media, and the modern web</strong>: AI orchestration with NexusFlow, native biometric health with PulseTrack, collaborative cloud workspaces with DevStudio. I love software that feels alive the instant you open it.
            </>
          )}
        </p>

        <p className="text-[#837e6f] text-[clamp(1rem,1.8vw,1.35rem)]">
          {language === 'fr' ? (
            <>
              Et sous le capot : <strong className="text-[#ede8dd] font-medium">l'automatisation & l'ingénierie inverse</strong>. APIs résilientes, scraping intelligent, synchronisation temps réel, caches Redis. Si un système a des données ou des processus qui en valent la peine, c'est branché, testé et déployé.
            </>
          ) : (
            <>
              And underneath it all: <strong className="text-[#ede8dd] font-medium">automation & reverse-engineering</strong>. Resilient APIs, smart scraping pipelines, realtime WebSockets sync, multi-layer caching. If a system holds data or value worth tapping, it's parsed, cached, and serving requests by the weekend.
            </>
          )}
        </p>

        <p className="mono text-xs text-[#837e6f] pt-4 font-normal">
          {language === 'fr'
            ? '— actuellement en train d’écouter du son et de coder, quelque part en France'
            : '— currently listening & building, somewhere in France'}
        </p>
      </div>
    </section>
  );
};
