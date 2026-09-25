import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const AboutSection = () => {
  const { language } = useLanguage();

  return (
    <section id="about" className="py-24 sm:py-32 px-6 sm:px-12 md:px-16 max-w-5xl mx-auto text-left" aria-labelledby="about-title">
      {/* Section Head */}
      <header className="mb-12 sm:mb-16">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mono text-[#f2a33c] mb-3"
        >
          05 / ABOUT
        </motion.p>
        <motion.h2
          id="about-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="font-display font-semibold text-[clamp(2.4rem,6vw,4.8rem)] text-[#ede8dd] tracking-tight leading-none"
        >
          {language === 'fr' ? 'Salut, je suis Ares' : "Hi, I'm Ares"}
        </motion.h2>
      </header>

      {/* Editorial Body */}
      <div className="space-y-8 font-display font-medium text-[clamp(1.2rem,2.5vw,1.85rem)] text-[#ede8dd] leading-[1.4] tracking-tight">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {language === 'fr' ? (
            <>
              Je suis un développeur full-stack basé en France qui aborde chaque projet comme un véritable produit. Je suis un <em className="text-[#f2a33c] not-italic">vibe coder</em> — je conçois vite avec l’IA à mes côtés — puis j’industrialise sérieusement : typage strict TypeScript, vraies bases de données, architectures distribuées et micro-interactions ultra-fluides.
            </>
          ) : (
            <>
              I'm a full-stack developer based in France who treats projects like living products. I'm a <em className="text-[#f2a33c] not-italic">vibe coder</em> — I build fast with AI by my side — then I engineer it properly: strict TypeScript, production databases, distributed architectures, and buttery smooth micro-interactions.
            </>
          )}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-[#b9b3a4]"
        >
          {language === 'fr' ? (
            <>
              Tout ce que je livre vit au croisement de la <strong className="text-[#f2a33c] font-medium">performance, du web moderne et des médias</strong> : plateforme e-commerce ShopCore, écosystème de streaming Z-Flix &amp; Z-Launcher, client musical Z-Music, UI Liquid Glass pour Spoti. J'aime les interfaces qui vibrent dès la première seconde.
            </>
          ) : (
            <>
              Everything I ship lives at the intersection of <strong className="text-[#f2a33c] font-medium">performance, modern web, and media</strong>: ShopCore e-commerce platform, Z-Flix &amp; Z-Launcher streaming suite, Z-Music audio client, Liquid Glass UI for Spoti. I love software that feels alive the instant you open it.
            </>
          )}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#837e6f] text-[clamp(1rem,1.8vw,1.35rem)]"
        >
          {language === 'fr' ? (
            <>
              Et sous le capot : <strong className="text-[#ede8dd] font-medium">l'automatisation & l'ingénierie inverse</strong>. APIs résilientes, scraping intelligent, synchronisation temps réel, caches Redis. Si un système a des données ou des processus qui en valent la peine, c'est branché, testé et déployé.
            </>
          ) : (
            <>
              And underneath it all: <strong className="text-[#ede8dd] font-medium">automation & reverse-engineering</strong>. Resilient APIs, smart scraping pipelines, realtime WebSockets sync, multi-layer caching. If a system holds data or value worth tapping, it's parsed, cached, and serving requests by the weekend.
            </>
          )}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mono text-xs text-[#837e6f] pt-4 font-normal"
        >
          {language === 'fr'
            ? '— actuellement en train d’écouter du son et de coder, quelque part en France'
            : '— currently listening & building, somewhere in France'}
        </motion.p>
      </div>
    </section>
  );
};
