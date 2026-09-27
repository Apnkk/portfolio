import { useState, useEffect, useRef, type FormEvent } from 'react';
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
  Activity,
  CornerDownLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutputLine {
  cmd?: string;
  res: string | React.ReactNode;
}

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

  // Mini CLI state
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<OutputLine[]>([
    {
      res: (
        <span className="text-[#ff1e38]">
          &gt; Ares Engineering Lab v3.0 [OLED Black &amp; Crimson]
          <br />
          <span className="text-[#726d64] text-xs">
            Tapez 'help' ou cliquez sur une commande ci-dessous.
          </span>
        </span>
      ),
    },
  ]);
  const cliScrollRef = useRef<HTMLDivElement>(null);
  const eqCanvasRef = useRef<HTMLCanvasElement>(null);
  const eqAnimFrame = useRef<number | null>(null);

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

      // Fetch real Web Audio frequency bins if playing
      const analyser = audioEngine.getAnalyser();
      let freqData: Uint8Array | null = null;
      if (analyser && playerState.isPlaying) {
        freqData = new Uint8Array(analyser.frequencyBinCount);
        (analyser as unknown as { getByteFrequencyData: (d: Uint8Array) => void }).getByteFrequencyData(freqData);
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

  useEffect(() => {
    cliScrollRef.current?.scrollTo({ top: cliScrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [cliHistory]);

  const handleCommand = (cmd: string) => {
    const raw = cmd.trim().toLowerCase();
    if (!raw) return;

    let res: React.ReactNode = '';

    switch (raw) {
      case 'help':
        res = (
          <div className="space-y-1 text-xs text-[#c2bdb3]">
            <p className="text-[#ff1e38] font-bold">Commandes reconnues :</p>
            <p><span className="text-white">skills</span> : Voir les stacks principales</p>
            <p><span className="text-white">projects</span> : Lister les projets récents</p>
            <p><span className="text-white">play</span> : Lancer la musique</p>
            <p><span className="text-white">pause</span> : Mettre en pause</p>
            <p><span className="text-white">contact</span> : Email &amp; contact direct</p>
            <p><span className="text-white">clear</span> : Effacer la console</p>
          </div>
        );
        break;

      case 'skills':
        res = (
          <div className="text-xs text-[#c2bdb3] space-y-1">
            <p className="text-[#ff1e38] font-semibold">&gt; Racks Technologiques :</p>
            <p>• Frontend : React 19, TypeScript strict, Next.js, Tailwind v4</p>
            <p>• Mobile : iOS Sideloading, Feather, AltStore, Liquid Glass UI</p>
            <p>• Backend : Node 22, API Reverse, WebSockets, Python FastAPI</p>
            <p>• Infra : Docker, Redis, Cloudflare Edge, Linux</p>
          </div>
        );
        break;

      case 'projects':
        res = (
          <div className="text-xs text-[#c2bdb3] space-y-1">
            <p className="text-[#ff1e38] font-semibold">&gt; Applications en production :</p>
            <p>1. ShopCore — Plateforme e-commerce d'abonnements (shopcore.buzz)</p>
            <p>2. Z-Flix Desktop — Hub de streaming séries/films/animés</p>
            <p>3. Z-Launcher — Launcher de bureau avec auto-updater</p>
            <p>4. Z-Music — Streaming audio haute fidélité &amp; paroles</p>
            <p>5. Spoti Liquid Glass — UI tweak iOS dépoli sans jailbreak</p>
          </div>
        );
        break;

      case 'play':
        void audioEngine.play();
        res = <span className="text-[#2ee59d]">&gt; Lecture du morceau en cours...</span>;
        break;

      case 'pause':
        audioEngine.pause();
        res = <span className="text-[#ff1e38]">&gt; Musique en pause.</span>;
        break;

      case 'contact':
        res = (
          <div className="text-xs text-[#c2bdb3]">
            <p>&gt; Email : <span className="text-[#ff1e38] font-mono">contact@shopcore.buzz</span></p>
            <p>&gt; GitHub : <span className="text-white">github.com/Apnkk</span></p>
            <p>&gt; Discord : <span className="text-white">498671450996342794</span></p>
          </div>
        );
        break;

      case 'clear':
        setCliHistory([]);
        return;

      case 'matrix':
      case 'synth':
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#ff1e38', '#ffffff', '#ff334b'],
        });
        res = <span className="text-[#ff1e38] font-bold">&gt; PROTOCOLE SYNTHESIS DÉCLENCHÉ !</span>;
        break;

      default:
        res = (
          <span className="text-[#726d64] text-xs">
            Commande '{cmd}' inconnue. Tapez <span className="text-[#ff1e38]">'help'</span>.
          </span>
        );
    }

    setCliHistory((prev) => [...prev, { cmd, res }]);
  };

  const onCliSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    handleCommand(cliInput);
    setCliInput('');
  };

  const getCategorySkills = () => {
    const found = portfolioData.skills.find((s) => s.id === activeCategory);
    return found ? found.skills : portfolioData.skills[0].skills;
  };

  return (
    <section
      id="lab"
      className="py-20 sm:py-32 px-5 sm:px-10 md:px-14 max-w-7xl mx-auto text-left relative"
      aria-labelledby="lab-heading"
    >
      {/* Section Head */}
      <div className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]" />
          <p className="mono text-[#ff1e38] font-semibold text-xs tracking-widest">
            02 / THE LAB
          </p>
        </div>
        <h2
          id="lab-heading"
          className="font-display font-semibold text-[clamp(2.4rem,6vw,5rem)] text-[#f5f3ef] tracking-tight leading-none"
        >
          {language === 'fr' ? (
            <>
              Ingénierie, Audio <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> Console
            </>
          ) : (
            <>
              Engineering, Audio <em className="text-[#ff1e38] not-italic font-serif">&amp;</em> Console
            </>
          )}
        </h2>
        <p className="text-[#b8b3a8] text-sm sm:text-base mt-3 max-w-xl font-normal leading-relaxed">
          {language === 'fr'
            ? 'Explorez l’atelier en direct : console interactive, lecteur musical immersif et matrices technologiques complètes.'
            : 'Interactive workshop: direct CLI terminal, ambient audio deck, and production skill matrices.'}
        </p>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        
        {/* CARD 1: Interactive Live Dev Console (7 Cols) */}
        <div className="lg:col-span-7 oled-card p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl">
          <div className="vu-bar" aria-hidden="true" />
          
          <div>
            {/* Window Topbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff1e38]/80 shadow-[0_0_8px_rgba(255,30,56,0.6)]" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="mono text-[0.7rem] text-[#726d64] ml-2">ares@lab:~$</span>
              </div>
              <div className="flex items-center gap-1.5 mono text-[0.66rem] text-[#ff1e38]">
                <Activity className="w-3.5 h-3.5" />
                <span>INTERACTIVE CLI</span>
              </div>
            </div>

            {/* Console Log Area */}
            <div
              ref={cliScrollRef}
              className="space-y-3 font-mono text-xs sm:text-sm h-52 overflow-y-auto pr-1 select-text scroll-smooth"
            >
              {cliHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  {item.cmd && (
                    <div className="flex items-center gap-2 text-[#f5f3ef]">
                      <span className="text-[#ff1e38] font-bold">&gt;</span>
                      <span>{item.cmd}</span>
                    </div>
                  )}
                  <div className="text-[#b8b3a8] pl-3 leading-relaxed">{item.res}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Console Input & Quick Chips */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            {/* Quick Command Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['skills', 'projects', 'play', 'pause', 'contact', 'clear'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleCommand(chip)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-[#ff1e38] hover:text-white border border-white/[0.08] text-[0.68rem] font-mono text-[#b8b3a8] transition-all cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Line */}
            <form onSubmit={onCliSubmit} className="flex items-center gap-2">
              <span className="text-[#ff1e38] font-mono font-bold">&gt;</span>
              <input
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder={language === 'fr' ? "Tapez 'skills', 'projects', 'play'..." : "Type 'help'..."}
                className="flex-1 bg-transparent border-0 outline-none text-[#f5f3ef] font-mono text-xs sm:text-sm placeholder:text-[#726d64]"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-[#ff1e38] text-[#c2bdb3] hover:text-white transition-colors cursor-pointer"
                title="Exécuter"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* CARD 2: Live Sound Deck & Waveform Equalizer (5 Cols) */}
        <div className="lg:col-span-5 oled-card p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="vu-bar" aria-hidden="true" />
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="mono text-xs text-[#ff1e38] font-semibold tracking-wider">
                  AUDIO SYNTH STATION
                </span>
              </div>
              <span
                className={`mono text-[0.66rem] px-2 py-0.5 rounded-full border ${
                  playerState.isPlaying
                    ? 'border-[#ff1e38]/50 text-[#ff1e38] bg-[#ff1e38]/10'
                    : 'border-white/10 text-[#726d64]'
                }`}
              >
                {playerState.isPlaying ? 'BROADCASTING' : 'IDLE'}
              </span>
            </div>

            {/* Current Track Info */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] mb-4">
              <p className="mono text-[0.66rem] text-[#726d64] uppercase mb-1">
                ORIGINAL TRACK 0{playerState.currentTrackIndex + 1}
              </p>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f5f3ef] truncate">
                {playerState.currentTrack.title}
              </h3>
              <p className="text-xs text-[#ff1e38] font-mono mt-0.5">
                Compositeur &amp; Master : Ares
              </p>
            </div>

            {/* Real-time Visualizer Canvas */}
            <div className="relative w-full h-20 px-2 py-2 bg-black/50 rounded-xl border border-white/[0.08] mb-4 flex items-center justify-center overflow-hidden">
              <canvas
                ref={eqCanvasRef}
                width={420}
                height={76}
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

        {/* CARD 3: Technology Racks Matrix (8 Cols) */}
        <div className="lg:col-span-8 oled-card p-6 sm:p-7 flex flex-col justify-between shadow-2xl">
          <div className="vu-bar" aria-hidden="true" />
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="mono text-xs text-[#ff1e38] font-semibold tracking-wider">
                  TECHNOLOGY RACKS
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f5f3ef] mt-1">
                  {language === 'fr' ? 'Compétences & Maîtrise Technique' : 'Core Stack & Mastery'}
                </h3>
              </div>

              {/* Category Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/[0.08]">
                {[
                  { id: 'frontend', label: 'Frontend', icon: Layers },
                  { id: 'mobile-ios', label: 'iOS / Mobile', icon: Smartphone },
                  { id: 'backend-systems', label: 'Backend', icon: Server },
                  { id: 'devops-infra', label: 'DevOps', icon: Cloud },
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

            {/* Skills List with Progress Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getCategorySkills().map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.06] hover:border-[#ff1e38]/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-medium text-sm text-[#f5f3ef] group-hover:text-[#ff1e38] transition-colors">
                      {skill.name}
                    </span>
                    <span className="mono text-[0.66rem] text-[#726d64] font-semibold">
                      {skill.level}%
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: sIdx * 0.05 }}
                      className="h-full rounded-full bg-gradient-to-r from-[#ff1e38] to-[#ff4d61]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#726d64] font-mono">
            <span>// ARCHITECTURE STRICTE &amp; PERFORMANCES DE POINTE</span>
            <span className="text-[#ff1e38]">SOLO TESTED</span>
          </div>
        </div>

        {/* CARD 4: Live Delivery Metrics & Vibe-Coding (4 Cols) */}
        <div className="lg:col-span-4 oled-card p-6 sm:p-7 flex flex-col justify-between shadow-2xl">
          <div className="vu-bar" aria-hidden="true" />
          
          <div>
            <span className="mono text-xs text-[#ff1e38] font-semibold tracking-wider">
              DELIVERY STATS
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-[#f5f3ef] mt-1 mb-5">
              {language === 'fr' ? 'Vélocité de production' : 'Shipping Velocity'}
            </h3>

            <div className="space-y-3.5">
              {[
                {
                  value: '48h',
                  label: language === 'fr' ? 'Du prototype au premier déploiement' : 'Prototype to first live deploy',
                  sub: 'Vibe-coding & AI copilot',
                },
                {
                  value: '< 50ms',
                  label: language === 'fr' ? 'Temps de réponse APIs backend' : 'Backend API response latency',
                  sub: 'Caches Redis & Fast routes',
                },
                {
                  value: '100%',
                  label: language === 'fr' ? 'Autonomie complète' : 'End-to-end solo autonomy',
                  sub: 'Frontend, backend, iOS, infra',
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
                  <p className="mono text-[0.62rem] text-[#726d64] mt-1">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] mono text-[0.66rem] text-[#726d64]">
            AVAILABLE FOR CONTRACTS 2026
          </div>
        </div>

      </div>
    </section>
  );
};
