import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { portfolioData } from '../data/portfolioData';
import { audioEngine, TRACKS, type AudioPlayerState } from '../utils/audioSynth';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Layers, 
  Smartphone, 
  Server, 
  Cloud, 
  ShieldCheck, 
  Cpu, 
  Zap,
  Sliders,
  Radio,
  CheckCircle2
} from 'lucide-react';

export const LabBentoSection = () => {
  const { language } = useLanguage();

  // Audio state
  const [playerState, setPlayerState] = useState<AudioPlayerState>(() => audioEngine.getState());

  useEffect(() => {
    return audioEngine.subscribe((next) => {
      setPlayerState({ ...next });
    });
  }, []);

  // Skill category state
  const [activeCategory, setActiveCategory] = useState<string>('frontend');
  const eqCanvasRef = useRef<HTMLCanvasElement>(null);
  const eqAnimFrame = useRef<number | null>(null);
  const freqBufferRef = useRef<Uint8Array | null>(null);

  // Real-time 60/120 FPS high-tech canvas audio equalizer visualizer
  useEffect(() => {
    const canvas = eqCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const barCount = 28;
    const barHeights = new Float32Array(barCount);

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Fetch real Web Audio frequency bins ONLY if playing (prevents early AudioContext warning)
      let freqData: Uint8Array | null = null;
      if (playerState.isPlaying) {
        const analyser = audioEngine.getAnalyser();
        if (analyser) {
          if (!freqBufferRef.current || freqBufferRef.current.length !== analyser.frequencyBinCount) {
            freqBufferRef.current = new Uint8Array(analyser.frequencyBinCount);
          }
          (analyser as unknown as { getByteFrequencyData: (d: Uint8Array) => void }).getByteFrequencyData(
            freqBufferRef.current
          );
          freqData = freqBufferRef.current;
        }
      }

      const totalBars = barCount;
      const gap = 3;
      const totalGaps = (totalBars - 1) * gap;
      const barWidth = Math.max(3, (width - totalGaps) / totalBars);

      for (let i = 0; i < totalBars; i++) {
        let targetH = 0;

        if (playerState.isPlaying) {
          if (freqData && freqData.length > 0) {
            const dataIndex = Math.min(freqData.length - 1, Math.floor((i / totalBars) * 36));
            const rawVal = freqData[dataIndex] / 255;
            targetH = Math.max(0.12, rawVal * 0.95);
          } else {
            // High-fidelity fallback beat simulation
            const wave1 = Math.sin(time * 3 + i * 0.3) * 0.35 + 0.5;
            const wave2 = Math.cos(time * 2.2 - i * 0.4) * 0.25;
            targetH = Math.max(0.12, Math.min(0.98, wave1 + wave2));
          }
        } else {
          // Resting waveform preview
          const wf = playerState.currentTrack.waveform;
          targetH = (wf[i % wf.length] || 0.3) * 0.65;
        }

        // Smooth physics interpolation
        barHeights[i] += (targetH - barHeights[i]) * 0.25;
        const currentH = Math.max(4, barHeights[i] * height);
        const x = i * (barWidth + gap);
        const y = height - currentH;

        // Draw pill-shaped glowing crimson equalizer bar
        const isVivid = i % 2 === 0;
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        if (playerState.isPlaying) {
          gradient.addColorStop(0, '#ff4d61');
          gradient.addColorStop(0.3, isVivid ? '#ff1e38' : '#e61932');
          gradient.addColorStop(1, '#a80f21');
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        const radius = barWidth / 2;
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, barWidth, currentH, [radius, radius, 1, 1]);
        } else {
          ctx.rect(x, y, barWidth, currentH);
        }
        ctx.fill();

        // Glowing cap dot when playing
        if (playerState.isPlaying && currentH > 12) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y + 2, Math.min(1.5, radius * 0.7), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      eqAnimFrame.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (eqAnimFrame.current) {
        cancelAnimationFrame(eqAnimFrame.current);
      }
    };
  }, [playerState.isPlaying, playerState.currentTrack]);

  const getCategorySkills = () => {
    const found = portfolioData.skills.find((s) => s.id === activeCategory);
    return found ? found.skills : portfolioData.skills[0].skills;
  };

  const categoryDetails: Record<
    string,
    { title: { fr: string; en: string }; insight: { fr: string; en: string }; highlightTag: string }
  > = {
    frontend: {
      title: { fr: 'Frontend & UI Moderne', en: 'Modern Frontend & UI' },
      insight: {
        fr: 'Composants React 19 optimisés, compilation sans re-renders superflus, typage strict sans concession et fluidité 120 FPS.',
        en: 'React 19 optimized components, zero unnecessary re-renders, strict typing without compromise, and fluid 120 FPS motion.',
      },
      highlightTag: 'React 19 · Strict TS',
    },
    'mobile-ios': {
      title: { fr: 'Écosystème iOS & Sideloading', en: 'iOS Ecosystem & Sideloading' },
      insight: {
        fr: "Injection de vues Liquid Glass, packaging IPA et déploiement sans jailbreak via sideloaders (Feather / AltStore) pour iPhone.",
        en: 'Liquid Glass view injection, IPA packaging, and jailbreak-free deployment via sideloaders (Feather / AltStore) on iPhone.',
      },
      highlightTag: 'iOS ARM64 · Sideloading',
    },
    'backend-systems': {
      title: { fr: 'Systèmes Backend & Reverse APIs', en: 'Backend Systems & API Reverse' },
      insight: {
        fr: "Rétro-ingénierie d'APIs tierces, protocoles de contournement résilients, flux WebSockets bidirectionnels et latence < 50ms.",
        en: 'Reverse-engineering private APIs, resilient fallback protocols, bidirectional WebSockets, and sub-50ms latency.',
      },
      highlightTag: 'Reverse APIs · <50ms',
    },
    'devops-infra': {
      title: { fr: 'Infrastructure Cloud & Déploiement', en: 'Cloud Infrastructure & Deploy' },
      insight: {
        fr: 'Conteneurisation Docker déterministe, edge CDN mondial Cloudflare et pipelines automatisés GitHub Actions.',
        en: 'Deterministic Docker containerization, worldwide Cloudflare edge CDN, and automated GitHub Actions pipelines.',
      },
      highlightTag: 'Docker · Edge CDN',
    },
  };

  const currentCategoryDetail = categoryDetails[activeCategory] || categoryDetails.frontend;

  return (
    <section
      id="lab"
      className="py-20 sm:py-32 px-5 sm:px-10 md:px-14 max-w-7xl mx-auto relative"
      aria-labelledby="lab-heading"
    >
      {/* Section Head (Centered) */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]" />
          <p className="mono text-[#ff1e38] font-semibold text-xs tracking-widest">
            {language === 'fr' ? '02 / LE LAB' : '02 / THE LAB'}
          </p>
        </div>
        <h2
          id="lab-heading"
          className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] text-[#f5f3ef] tracking-tight leading-none"
        >
          {language === 'fr' ? (
            <>
              Architecture, Systèmes <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> Craft
            </>
          ) : (
            <>
              Architecture, Systems <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> Craft
            </>
          )}
        </h2>
        <p className="text-[#b8b3a8] text-sm sm:text-base mt-3 max-w-2xl font-normal leading-relaxed">
          {language === 'fr'
            ? "Un atelier axé sur la rigueur d'ingénierie : développement multiplateforme natif, reverse APIs résilient, banc audio et principes de production stricts."
            : 'An engineering-focused workshop: native cross-platform development, resilient API reverse, studio audio deck, and strict production principles.'}
        </p>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* CARD 1: Interactive Technology & Architecture Matrix (7 Cols) */}
        <div className="lg:col-span-7 oled-card p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="vu-bar" aria-hidden="true" />
          
          <div>
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-white/[0.08]">
              <div>
                <span className="mono text-[0.68rem] text-[#ff1e38] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>ARCHITECTURE &amp; STACK</span>
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f5f3ef] mt-1">
                  {currentCategoryDetail.title[language]}
                </h3>
              </div>

              {/* Category Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-black/70 p-1 rounded-xl border border-white/[0.08]">
                {[
                  { id: 'frontend', label: 'Frontend', icon: Layers },
                  { id: 'mobile-ios', label: 'iOS / Mobile', icon: Smartphone },
                  { id: 'backend-systems', label: 'Backend', icon: Server },
                  { id: 'devops-infra', label: 'Infra', icon: Cloud },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategory(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[0.7rem] uppercase transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#ff1e38] text-white font-bold shadow-[0_0_12px_rgba(255,30,56,0.4)]'
                          : 'text-[#726d64] hover:text-[#f5f3ef]'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Architecture Insight Note */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-5 text-xs text-[#b8b3a8] leading-relaxed flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shrink-0 mt-1.5" />
              <span>{currentCategoryDetail.insight[language]}</span>
            </div>

            {/* Skills List with Progress Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {getCategorySkills().map((skill, sIdx) => (
                <div
                  key={`${activeCategory}-${skill.name}`}
                  className="p-3 rounded-xl bg-black/50 border border-white/[0.06] hover:border-[#ff1e38]/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-medium text-xs sm:text-sm text-[#f5f3ef] group-hover:text-[#ff1e38] transition-colors truncate">
                      {skill.name}
                    </span>
                    <span className="mono text-[0.66rem] text-[#726d64] font-semibold shrink-0 ml-2">
                      {skill.level}%
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.6, delay: sIdx * 0.04 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#ff1e38] to-[#ff4d61]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[0.68rem] text-[#726d64] font-mono">
            <span>// ARCHITECTURE ÉPROUVÉE EN PRODUCTION</span>
            <span className="text-[#ff1e38] font-semibold tracking-wider">
              {currentCategoryDetail.highlightTag}
            </span>
          </div>
        </div>

        {/* CARD 2: Studio Audio Deck & Waveform Equalizer (5 Cols) */}
        <div className="lg:col-span-5 oled-card p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="vu-bar" aria-hidden="true" />
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#ff1e38]" />
                <span className="mono text-xs text-[#ff1e38] font-semibold tracking-wider">
                  STUDIO AUDIO DECK
                </span>
              </div>
              <span
                className={`mono text-[0.66rem] px-2 py-0.5 rounded-full border ${
                  playerState.isPlaying
                    ? 'border-[#ff1e38]/50 text-[#ff1e38] bg-[#ff1e38]/10'
                    : 'border-white/10 text-[#726d64]'
                }`}
              >
                {playerState.isPlaying ? 'BROADCASTING' : 'STANDBY'}
              </span>
            </div>

            {/* Current Track Info */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] mb-4">
              <p className="mono text-[0.66rem] text-[#726d64] uppercase mb-1">
                ORIGINAL TRACK 0{playerState.currentTrackIndex + 1} · 24-BIT / 48KHZ
              </p>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f5f3ef] truncate">
                {playerState.currentTrack.title}
              </h3>
              <p className="text-xs text-[#ff1e38] font-mono mt-0.5">
                Composition originale &amp; Mastering : Ares
              </p>
            </div>

            {/* Real-time Visualizer Canvas */}
            <div className="relative w-full h-24 px-2 py-2 bg-black/50 rounded-xl border border-white/[0.08] mb-4 flex items-center justify-center overflow-hidden">
              <canvas
                ref={eqCanvasRef}
                width={420}
                height={88}
                className="w-full h-full"
                aria-label="Spectre audio dynamique"
              />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
            {/* Track Switcher */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => audioEngine.previous()}
                className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#c2bdb3] hover:text-white transition-colors cursor-pointer"
                title="Morceau précédent"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => audioEngine.toggle()}
                className="p-3 rounded-full bg-[#ff1e38] hover:bg-[#ff2d46] text-white shadow-[0_0_20px_rgba(255,30,56,0.6)] transition-all cursor-pointer"
                title={playerState.isPlaying ? 'Pause' : 'Lecture'}
              >
                {playerState.isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => audioEngine.next()}
                className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#c2bdb3] hover:text-white transition-colors cursor-pointer"
                title="Morceau suivant"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Track Selection Chips */}
            <div className="flex items-center gap-1">
              {TRACKS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => audioEngine.setTrack(idx)}
                  className={`w-7 h-7 rounded-lg font-mono text-[0.68rem] transition-all cursor-pointer ${
                    playerState.currentTrackIndex === idx
                      ? 'bg-[#ff1e38] text-white font-bold shadow-[0_0_10px_rgba(255,30,56,0.5)]'
                      : 'bg-white/[0.04] text-[#726d64] hover:text-[#f5f3ef]'
                  }`}
                  title={t.title}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 3: Engineering Principles Pillars (8 Cols) */}
        <div className="lg:col-span-8 oled-card p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="vu-bar" aria-hidden="true" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="mono text-xs text-[#ff1e38] font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>STANDARDS DE DÉVELOPPEMENT</span>
              </span>
              <span className="mono text-[0.66rem] text-[#726d64]">
                QUALITY-FIRST ENGINE
              </span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f5f3ef] mb-6">
              {language === 'fr' ? 'Piliers de conception & fiabilité' : 'Core Engineering Pillars'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: CheckCircle2,
                  title: language === 'fr' ? 'Typage strict' : 'Strict Types',
                  desc:
                    language === 'fr'
                      ? 'TypeScript strict, schémas de données validés (Zod), aucun any toléré. Du code prédictible.'
                      : 'Strict TypeScript, unified Zod schema validation, zero any types. Predictable runtimes.',
                },
                {
                  icon: Zap,
                  title: language === 'fr' ? 'Latence ultra-basse' : 'Sub-50ms Latency',
                  desc:
                    language === 'fr'
                      ? 'Caches Redis distribués, compression edge CDN et pipelines taillés pour des réponses immédiates.'
                      : 'Distributed Redis caching, edge CDN compression, and pipelines built for instant response.',
                },
                {
                  icon: Cpu,
                  title: language === 'fr' ? 'Reverse résilient' : 'Resilient Reverse',
                  desc:
                    language === 'fr'
                      ? 'Rétro-ingénierie d’APIs fermées, proxies tournants et maintien continu de la disponibilité des flux.'
                      : 'Reverse-engineering private APIs, proxy rotation, and continuous stream uptime.',
                },
              ].map((pillar, pIdx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pIdx}
                    className="p-4 rounded-2xl bg-black/50 border border-white/[0.06] hover:border-[#ff1e38]/30 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#ff1e38] mb-3 group-hover:bg-[#ff1e38] group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-display font-semibold text-sm sm:text-base text-[#f5f3ef] mb-1.5 group-hover:text-[#ff1e38] transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-[#b8b3a8] leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#726d64] font-mono">
            <span>// SHIPPER DU CODE PROPRE DE BOUT EN BOUT</span>
            <span className="text-[#ff1e38] font-semibold">ZERO COMPROMISE</span>
          </div>
        </div>

        {/* CARD 4: Shipping Velocity & Delivery Stats (4 Cols) */}
        <div className="lg:col-span-4 oled-card p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="vu-bar" aria-hidden="true" />
          
          <div>
            <span className="mono text-xs text-[#ff1e38] font-semibold tracking-wider uppercase">
              DELIVERY METRICS
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f5f3ef] mt-1 mb-5">
              {language === 'fr' ? 'Vélocité & Autonomie' : 'Shipping Track Record'}
            </h3>

            <div className="space-y-3">
              {[
                {
                  value: '10+',
                  label: language === 'fr' ? 'Applications & outils livrés' : 'Shipped apps & tools',
                  sub: 'ShopCore, Z-Flix, Z-Launcher, Z-Music',
                },
                {
                  value: '< 50ms',
                  label: language === 'fr' ? 'Temps de réponse APIs moyen' : 'Average API response latency',
                  sub: 'Caches Redis & Fast routes',
                },
                {
                  value: '100%',
                  label: language === 'fr' ? 'Autonomie de bout en bout' : 'End-to-end solo autonomy',
                  sub: 'Frontend, backend, iOS & infra',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.06] hover:border-[#ff1e38]/30 transition-all"
                >
                  <div className="font-display font-bold text-2xl text-[#ff1e38] mb-0.5">
                    {item.value}
                  </div>
                  <p className="text-xs text-[#f5f3ef] font-medium leading-snug">
                    {item.label}
                  </p>
                  <p className="mono text-[0.62rem] text-[#726d64] mt-0.5">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] mono text-[0.66rem] text-[#726d64] flex items-center justify-between">
            <span>// SHIPPER DU CODE PROPRE</span>
            <span className="flex items-center gap-1.5 text-[#ff1e38]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38]" />
              <span className="font-semibold">PRODUCTION READY</span>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
