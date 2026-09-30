import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './motion/ScrollReveal';

export const StackSection = () => {
  const { language } = useLanguage();

  const domains = [
    {
      domain: 'FRONTEND',
      items: 'React 19 · TypeScript strict · Vite · Tailwind 4 · Next.js · TanStack Query · Zustand',
    },
    {
      domain: 'BACKEND',
      items: 'Node 22 · Express & Hono · Socket.IO realtime · REST at scale · Python tooling',
    },
    {
      domain: 'DATA',
      items: 'MySQL · Redis · Drizzle ORM · caching & streaming pipelines · search indexing',
    },
    {
      domain: 'SYSTEMS',
      items: 'Rust → WebAssembly · Tauri · WebSockets · Cloudflare Workers & proxies · Docker · Linux',
    },
    {
      domain: 'MOTION / UI',
      items: 'Three.js · GLSL Shaders · Web Audio API · design systems · typography · micro-interactions',
    },
    {
      domain: 'PRODUCT',
      items: language === 'fr' 
        ? "Idée → livré, en solo · streaming vidéo · anti-fraude & licences · i18n · itération guidée par l'usage" 
        : 'Idea → shipped solo · video streaming · anti-fraud & licensing · i18n · usage-driven iteration',
    },
  ];

  return (
    <section
      id="stack"
      className="relative z-10 py-[clamp(60px,9vh,110px)] px-[var(--pad)] bg-[var(--bg)]"
      aria-label="Stack technique"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <ScrollReveal className="mb-[clamp(32px,5vh,64px)]" y={40} blur={8}>
          <div className="font-mono text-[0.72rem] tracking-widest text-[var(--amber)] uppercase mb-3">
            03 / STACK
          </div>
          <h2 className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-tight text-[var(--cream)]">
            Full-stack, plein <em className="text-[var(--amber)] italic font-normal">volume</em>
          </h2>
        </ScrollReveal>

        {/* 6-Cell Grid with fine lines & VU hover line */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[var(--line)]">
          {domains.map((d, i) => (
            <ScrollReveal
              key={i}
              as="div"
              y={40}
              blur={5}
              delay={(i % 3) * 0.08 + Math.floor(i / 3) * 0.04}
              amount={0.2}
              className="stack__cell group relative p-[clamp(24px,3.5vw,44px)] border-r border-b border-[var(--line)] overflow-hidden transition-colors duration-300 hover:bg-[var(--surface)] cursor-default"
            >
              {/* Domain Name */}
              <div className="font-mono text-[0.72rem] tracking-widest text-[var(--amber)] uppercase mb-3.5">
                {d.domain}
              </div>

              {/* Items List */}
              <p className="text-[var(--cream-dim)] text-[0.95rem] leading-relaxed max-w-[34ch]">
                {d.items}
              </p>

              {/* Animated VU meter gradient line on hover */}
              <div
                className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-[var(--amber)] to-[var(--red)] scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                aria-hidden="true"
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
