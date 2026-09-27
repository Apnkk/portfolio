import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const StackSection = () => {
  const { language } = useLanguage();

  const cells = [
    {
      domain: 'FRONTEND',
      items: 'React 19 · TypeScript strict · Next.js · Vite · Tailwind CSS v4 · TanStack Query · Zustand',
    },
    {
      domain: 'BACKEND',
      items: 'Node 22 · Express & NestJS · FastAPI (Python) · Socket.IO & WebSockets · REST APIs · SSE Streaming',
    },
    {
      domain: 'DATA',
      items: 'PostgreSQL · Supabase · Redis caching · Drizzle ORM · Prisma · pgvector · Search indexing',
    },
    {
      domain: language === 'fr' ? 'SYSTÈMES & CLOUD' : 'SYSTEMS & CLOUD',
      items: 'Docker · Cloudflare Workers · Rust → WebAssembly · CI/CD GitHub Actions · Nginx · AWS S3/RDS',
    },
    {
      domain: 'MOTION / UI',
      items: 'Framer Motion · Web Audio API · Design systems · Responsive Bento layouts · Typography · Micro-interactions',
    },
    {
      domain: language === 'fr' ? 'PRODUIT & VÉLOCITÉ' : 'PRODUCT & VELOCITY',
      items:
        language === 'fr'
          ? 'Idée → Produit en production, en solo · Auth Passkeys · Paiements Stripe · i18n · Optimisation Core Web Vitals'
          : 'Idea → shipped, solo · Passkeys Auth · Stripe Billing · i18n · Core Web Vitals performance tuning',
    },
  ];

  return (
    <section id="stack" className="py-16 sm:py-32 px-5 sm:px-12 md:px-16 max-w-7xl mx-auto text-left" aria-labelledby="stack-title">
      {/* Section Head */}
      <header className="mb-10 sm:mb-20">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-white/[0.08] bg-black/60 backdrop-blur-sm font-mono text-[9px] text-[#797368] tracking-widest uppercase select-none">
          <span className="text-[#ff2a3b] font-semibold">SCENE 04</span>
          <span>//</span>
          <span className="text-[#f4f2ee]">MATRIX</span>
          <span>·</span>
          <span>RACK UNITS 01-06</span>
          <span>·</span>
          <span>PRODUCTION</span>
        </div>
        <p className="mono text-[#ff2a3b] mb-2 sm:mb-3 font-semibold">03 / STACK</p>
        <h2 id="stack-title" className="font-display font-semibold text-[clamp(2.1rem,6vw,4.8rem)] text-[#f4f2ee] tracking-tight leading-none">
          {language === 'fr' ? (
            <>
              Full-stack, plein <em className="text-[#ff2a3b] not-italic font-serif">volume</em>
            </>
          ) : (
            <>
              Full-stack, full <em className="text-[#ff2a3b] not-italic font-serif">volume</em>
            </>
          )}
        </h2>
        <p className="text-[#797368] text-xs sm:text-base mt-3 sm:mt-4 max-w-lg font-normal leading-relaxed">
          {language === 'fr'
            ? 'Une boîte à outils moderne forgée par des dizaines de milliers de lignes de code en production.'
            : 'A modern engineering toolkit forged through tens of thousands of production code lines.'}
        </p>
      </header>

      {/* Grid of Cells with Borders and Hover VU meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/[0.08]">
        {cells.map((cell, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: idx * 0.06 }}
            className="group relative p-5 sm:p-11 border-r border-b border-white/[0.08] hover:bg-[#07070a] transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="mono text-[11px] sm:text-xs text-[#ff2a3b] tracking-widest font-medium">
                  {cell.domain}
                </h3>
                <span className="mono text-[8px] sm:text-[9px] text-[#797368] px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5">
                  RACK 0{idx + 1}
                </span>
              </div>
              <p className="text-[#f4f2ee] text-sm sm:text-base font-medium leading-relaxed max-w-[34ch]">
                {cell.items}
              </p>
            </div>

            {/* Crimson VU Meter Bar across bottom */}
            <div className="vu-bar" aria-hidden="true" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};
