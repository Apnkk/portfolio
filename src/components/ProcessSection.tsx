import { useLanguage } from '../context/LanguageContext';

export const ProcessSection = () => {
  const { language } = useLanguage();

  const steps = [
    {
      num: '01',
      name: language === 'fr' ? 'Concept & Cadrage' : 'Concept & Scope',
      desc: language === 'fr' 
        ? "Définir le problème réel, isoler le flux utilisateur principal, zéro fluff." 
        : 'Define the real problem, isolate the core user loop, zero fluff.',
    },
    {
      num: '02',
      name: language === 'fr' ? 'Prototype Rapide' : 'Rapid Prototype',
      desc: language === 'fr'
        ? "Vibe coding assisté par IA, maquettage en direct dans le navigateur pour valider le feeling."
        : 'AI-assisted vibe coding, live prototyping directly in the browser to validate the feel.',
    },
    {
      num: '03',
      name: language === 'fr' ? 'Architecture Robuste' : 'Solid Architecture',
      desc: language === 'fr'
        ? "TypeScript strict, schémas DB rigides, gestion d'erreurs infaillible et APIs sub-50ms."
        : 'Strict TypeScript, rigid DB schemas, foolproof error boundaries, and sub-50ms APIs.',
    },
    {
      num: '04',
      name: language === 'fr' ? 'Finitions & Shaders' : 'Polish & Shaders',
      desc: language === 'fr'
        ? "Micro-interactions 120 FPS, WebGL réactif, feedback sonore et soin maniaque des détails."
        : '120 FPS micro-interactions, responsive WebGL, audio feedback, and obsessive detail polish.',
    },
    {
      num: '05',
      name: language === 'fr' ? 'Ship & Production' : 'Ship & Deploy',
      desc: language === 'fr'
        ? "Déploiement automatisé, observabilité, monitoring en temps réel et itération sur les retours."
        : 'Automated CI/CD release, telemetry, realtime monitoring, and fast feedback iteration.',
    },
  ];

  return (
    <section
      id="process"
      className="relative z-10 py-[clamp(60px,9vh,110px)] px-[var(--pad)] bg-[var(--bg-2)] border-y border-[var(--line)]"
      aria-label="Méthode de travail"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-[clamp(32px,5vh,64px)]">
          <div className="font-mono text-[0.72rem] tracking-widest text-[var(--amber)] uppercase mb-3">
            04 / PROCESS
          </div>
          <h2 className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-tight text-[var(--cream)]">
            De la maquette au terminal
          </h2>
        </div>

        {/* 5-Step Timeline Grid with Top Line */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[clamp(24px,3vw,36px)] pt-8">
          {/* Continuous Horizontal Line */}
          <div
            className="hidden lg:block absolute top-[7px] left-0 w-full h-[1px] bg-[var(--line)] pointer-events-none"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div key={i} className="relative group pt-2">
              {/* Timeline Dot Node */}
              <div
                className="hidden lg:flex items-center justify-center absolute top-[-29px] left-0 w-[15px] h-[15px] rounded-full border border-[var(--amber)] bg-[var(--bg-2)]"
                aria-hidden="true"
              >
                <div className="w-[5px] h-[5px] rounded-full bg-[var(--amber)]" />
              </div>

              {/* Step Number */}
              <span className="font-mono text-[0.72rem] text-[var(--muted)] block mb-2 tracking-widest">
                {step.num}
              </span>

              {/* Step Title */}
              <h3 className="font-display font-semibold text-lg sm:text-xl text-[var(--cream)] mb-2 group-hover:text-[var(--amber)] transition-colors">
                {step.name}
              </h3>

              {/* Step Desc */}
              <p className="text-[var(--cream-dim)] text-[0.88rem] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
