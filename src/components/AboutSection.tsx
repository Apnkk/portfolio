import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './motion/ScrollReveal';

export const AboutSection = () => {
  const { language } = useLanguage();

  return (
    <section
      id="about"
      className="relative z-10 py-[clamp(70px,11vh,130px)] px-[var(--pad)] bg-[var(--bg)]"
      aria-label="À propos"
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal y={40} blur={8}>
          {/* Section Kicker */}
          <div className="font-mono text-[0.72rem] tracking-widest text-[var(--amber)] uppercase mb-3">
            05 / À PROPOS
          </div>

          {/* Section Headline */}
          <h2 className="font-display font-semibold text-[clamp(2.4rem,6vw,5.5rem)] leading-tight tracking-tight text-[var(--cream)] mb-10">
            {language === 'fr' ? "Salut, moi c'est Ares" : "Hey, I'm Ares"}
          </h2>
        </ScrollReveal>

        {/* Candid Builder Narrative */}
        <div className="space-y-7 text-[clamp(1.05rem,1.8vw,1.3rem)] leading-relaxed text-[var(--cream)] font-normal">
          <ScrollReveal delay={0.05} amount={0.3}>
          <p>
            {language === 'fr' ? (
              <>
                Développeur full-stack en France, je traite mes side projects comme de véritables produits. Je suis un <em className="text-[var(--amber)] italic">vibe coder</em> — je construis vite avec l'IA à mes côtés — puis je l'ingénière proprement : TypeScript strict, vraies bases de données, du natif et du Rust quand ça compte.
              </>
            ) : (
              <>
                Full-stack developer based in France, treating my side projects as real-world production products. I am an authentic <em className="text-[var(--amber)] italic">vibe coder</em> — moving fast with AI by my side — then engineering strictly: tight TypeScript types, resilient databases, and native Swift/Rust where performance matters.
              </>
            )}
          </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1} amount={0.3}>
          <p>
            {language === 'fr' ? (
              <>
                Tout ce que je sors vit au croisement du <em className="text-[var(--amber)] not-italic underline decoration-[var(--amber)]/40 underline-offset-4">média et du web</em> : la vidéo avec Z-Flix, le SaaS et la distribution avec ShopCore, le modding iOS avec Spoti Liquid Glass — et le son, bientôt, avec Z-Music. J'aime les produits qui semblent vivants dès qu'on les ouvre.
              </>
            ) : (
              <>
                Everything I release lives at the intersection of <em className="text-[var(--amber)] not-italic underline decoration-[var(--amber)]/40 underline-offset-4">media and the web</em>: streaming video with Z-Flix, digital licensing with ShopCore, iOS modding with Spoti Liquid Glass — and audio with Z-Music. I love products that feel alive the second you open them.
              </>
            )}
          </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15} amount={0.3}>
          <p className="text-[var(--cream-dim)] text-[clamp(0.95rem,1.5vw,1.15rem)]">
            {language === 'fr' ? (
              <>
                Et sous tout ça : <em className="text-[var(--amber)] not-italic">l'automatisation</em>. Je reverse et scrape les APIs privées, flux vidéo HLS, formats de médias et métadonnées que je normalise dans des architectures légères, sub-50ms et fiables en production.
              </>
            ) : (
              <>
                And underneath it all: <em className="text-[var(--amber)] not-italic">automation</em>. Reverse-engineering private APIs, protected HLS streams, media protocols, and normalizing them into lightweight, sub-50ms architectures that stay up in production.
              </>
            )}
          </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
