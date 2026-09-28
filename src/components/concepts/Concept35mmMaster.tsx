import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useMotionValue, type MotionValue } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { portfolioData } from '../../data/portfolioData';
import {
  ExternalLink,
  Clock,
  Copy,
  Check,
} from 'lucide-react';
import { GithubIcon } from '../icons/BrandIcons';

interface FilmScene {
  id: string;
  timecode: string;
  reelProgress: number; // 0 to 1
  sceneNumber: string;
  takeNumber: string;
  title: string;
  subtitle: { fr: string; en: string };
  location: string;
  focalLength: string;
  aspectRatio: string;
  description: { fr: string; en: string };
  specs: { label: string; value: string }[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

function TimecodeHud({ progress }: { progress: MotionValue<number> }) {
  const [timecodeStr, setTimecodeStr] = useState('00:00:00:00');
  const [tapeSpeed, setTapeSpeed] = useState('1.0x PLAY');

  useEffect(() => {
    let lastProgress = 0;
    let lastTime = performance.now();

    return progress.on('change', (latest) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dp = latest - lastProgress;
      const velocity = (dp / dt) * 1000;
      lastProgress = latest;
      lastTime = now;

      // Reel speed calculation
      if (Math.abs(velocity) < 0.02) {
        setTapeSpeed('1.0x PLAY');
      } else if (velocity > 0.02) {
        setTapeSpeed(`+${(1 + Math.abs(velocity) * 8).toFixed(1)}x FWD`);
      } else {
        setTapeSpeed(`-${(1 + Math.abs(velocity) * 8).toFixed(1)}x REW`);
      }

      // Timecode Calculation (00:00:00:00 to 00:05:00:00)
      const totalSeconds = latest * 300;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const frames = Math.floor((totalSeconds % 1) * 24);

      const tc = `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
        2,
        '0'
      )}:${String(frames).padStart(2, '0')}`;
      setTimecodeStr(tc);
    });
  }, [progress]);

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Clock className="w-3.5 h-3.5 text-[#ff1e38]" />
      <div className="mono text-sm sm:text-base font-bold tracking-widest text-[#f5f3ef]">
        TC: <span className="text-[#ff1e38]">{timecodeStr}</span>
      </div>
      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 mono text-[0.6rem] text-[#b8b3a8]">
        {tapeSpeed}
      </span>
    </div>
  );
}

function VuMetersHud({ progress }: { progress: MotionValue<number> }) {
  const [vuLeft, setVuLeft] = useState(6);
  const [vuRight, setVuRight] = useState(5);

  useEffect(() => {
    let lastProgress = 0;
    let lastTime = performance.now();

    return progress.on('change', (latest) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dp = latest - lastProgress;
      const velocity = (dp / dt) * 1000;
      lastProgress = latest;
      lastTime = now;

      const baseVu = 4 + Math.round(Math.abs(velocity) * 14);
      setVuLeft(Math.min(10, Math.max(2, baseVu + Math.round(Math.sin(now * 0.01) * 2))));
      setVuRight(Math.min(10, Math.max(2, baseVu + Math.round(Math.cos(now * 0.01) * 2))));
    });
  }, [progress]);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-1.5">
        <span className="mono text-[0.58rem] text-[#726d64]">CH.L</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 sm:w-1.5 h-3 rounded-xs transition-colors duration-100 ${
                i < vuLeft
                  ? i > 7
                    ? 'bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]'
                    : 'bg-[#2ee59d]'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="mono text-[0.58rem] text-[#726d64]">CH.R</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 sm:w-1.5 h-3 rounded-xs transition-colors duration-100 ${
                i < vuRight
                  ? i > 7
                    ? 'bg-[#ff1e38] shadow-[0_0_6px_#ff1e38]'
                    : 'bg-[#2ee59d]'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const Concept35mmMaster = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Active scene state
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const lastSceneIndexRef = useRef(0);

  // Anamorphic flare motion values (GPU transforms, zero React re-renders)
  const flareX = useMotionValue(0);
  const flareY = useMotionValue(0);
  const smoothFlareX = useSpring(flareX, { stiffness: 180, damping: 24 });
  const smoothFlareY = useSpring(flareY, { stiffness: 180, damping: 24 });

  // Scroll binding
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    restDelta: 0.0005,
  });

  const scenes: FilmScene[] = [
    {
      id: 'shopcore',
      timecode: '00:00:15:00',
      reelProgress: 0.08,
      sceneNumber: 'SCENE 01',
      takeNumber: 'TAKE 04',
      title: 'ShopCore // Automated Transaction Engine',
      subtitle: {
        fr: 'INT. SERVEURS HAUT DE DÉBIT — JOUR',
        en: 'INT. HIGH-THROUGHPUT TRANSACTION VAULT — DAY',
      },
      location: 'shopcore.buzz // Stripe & Crypto Gateways',
      focalLength: '35mm ANAMORPHIC T1.5',
      aspectRatio: '2.39:1 SCOPE',
      description: {
        fr: 'Plateforme e-commerce haute disponibilité dédiée aux abonnements numériques. Passerelle de paiement hybride (Stripe + multi-crypto), provisionnement instantané en moins de 60 secondes et architecture Next.js optimisée pour la conversion.',
        en: 'High-availability automated commerce platform engineered for digital subscriptions. Hybrid Stripe + multi-currency crypto gateways, sub-60s instant automated fulfillment, and high-conversion Next.js architecture.',
      },
      specs: [
        { label: 'DELIVERY TIME', value: '< 60 SECONDS' },
        { label: 'GATEWAYS', value: 'STRIPE + CRYPTO' },
        { label: 'GUARANTEE', value: '24H AUTO REPLACEMENT' },
        { label: 'STACK', value: 'NEXT.JS / TS / WEBHOOKS' },
      ],
      tags: ['Next.js', 'TypeScript', 'Stripe API', 'Crypto', 'E-Commerce'],
      liveUrl: 'https://shopcore.buzz',
    },
    {
      id: 'zflix',
      timecode: '00:01:25:00',
      reelProgress: 0.32,
      sceneNumber: 'SCENE 02',
      takeNumber: 'TAKE 01',
      title: 'Z-Flix Desktop // 4K Streaming Engine',
      subtitle: {
        fr: 'EXT. CLUSTER VIDÉO HLS — NUIT',
        en: 'EXT. HLS STREAMING CLUSTER — NIGHT',
      },
      location: 'github.com/Apnkk/Z-FLIX-app // HLS Resolver',
      focalLength: '50mm ANAMORPHIC T1.8',
      aspectRatio: '2.39:1 SCOPE',
      description: {
        fr: 'Client de streaming média unifié pour séries, films et animés. Lecteur HLS personnalisé sans publicité, agrégation de hubs studios (Netflix, Disney+, HBO Max, Marvel, DC) et gestion fluide des pistes VF / VOSTFR.',
        en: 'Unified media streaming client for movies, series, and anime. Custom ad-free HLS player, studio hub aggregation (Netflix, Disney+, HBO Max, Marvel, DC), and instant multi-audio/subtitle switching.',
      },
      specs: [
        { label: 'BUFFER', value: '< 15ms LATENCY' },
        { label: 'STREAMS', value: 'HLS AD-FREE' },
        { label: 'STUDIOS', value: 'NETFLIX / DISNEY+ / HBO' },
        { label: 'PLAYBACK', value: 'AUTO-RESUME PERSISTENCE' },
      ],
      tags: ['React', 'TypeScript', 'HLS Player', 'Video Demuxer', 'Desktop'],
      liveUrl: 'https://github.com/Apnkk/Z-FLIX-app',
      githubUrl: 'https://github.com/Apnkk/Z-FLIX-app',
    },
    {
      id: 'spoti',
      timecode: '00:02:35:00',
      reelProgress: 0.56,
      sceneNumber: 'SCENE 03',
      takeNumber: 'TAKE 02',
      title: 'Spoti Liquid Glass // ARM64 Dylib Injection',
      subtitle: {
        fr: 'INT. MACHINE VIRTUELLE iOS — NUIT',
        en: 'INT. iOS RUNTIME ENVIRONMENT — NIGHT',
      },
      location: 'github.com/Apnkk/spoti.pw // Sideload Framework',
      focalLength: '85mm ANAMORPHIC T2.0',
      aspectRatio: '2.39:1 SCOPE',
      description: {
        fr: 'Injection de code et refonte complète de l’interface Spotify iOS avec composants dépolis Liquid Glass. 100% exécutable sans jailbreak grâce à la compilation dylib ARM64 et aux sideloaders modernes (Feather, AltStore, TrollStore).',
        en: 'Dynamic code injection and complete UI overhaul for Spotify iOS with frosted Liquid Glass elements. 100% executable without jailbreak via compiled ARM64 dylib and modern sideloaders (Feather, AltStore, TrollStore).',
      },
      specs: [
        { label: 'JAILBREAK', value: 'NOT REQUIRED (0-JAILBREAK)' },
        { label: 'ARCHITECTURE', value: 'ARM64 / ARM64e' },
        { label: 'RENDERING', value: '60 FPS LIQUID GLASS' },
        { label: 'INSTALLER', value: 'FEATHER / ALTSTORE' },
      ],
      tags: ['iOS Modding', 'Liquid Glass', 'Objective-C/Swift', 'Dylib', 'Sideloading'],
      liveUrl: 'https://github.com/Apnkk/spoti.pw',
      githubUrl: 'https://github.com/Apnkk/spoti.pw',
    },
    {
      id: 'zlauncher',
      timecode: '00:03:45:00',
      reelProgress: 0.78,
      sceneNumber: 'SCENE 04',
      takeNumber: 'TAKE 03',
      title: 'Z-Launcher // PC Desktop Gateway',
      subtitle: {
        fr: 'EXT. TERMINAL WINDOWS PC — AUBE',
        en: 'EXT. WINDOWS SYSTEM KERNEL — DAWN',
      },
      location: 'github.com/Apnkk/zflix-launcher // Windows IPC',
      focalLength: '40mm ANAMORPHIC T1.6',
      aspectRatio: '2.39:1 SCOPE',
      description: {
        fr: 'Launcher de bureau Windows avec interface néo-cyberpunk. Vérification d’intégrité binaire par checksum SHA-256, téléchargement des deltas de mise à jour et lancement direct de Z-Movies et Z-Animes.',
        en: 'Windows desktop client featuring neo-cyberpunk styling. Binary checksum verification via SHA-256, asynchronous release updates, and direct hardware-accelerated launching of Z-Movies and Z-Animes.',
      },
      specs: [
        { label: 'PLATFORM', value: 'WINDOWS 10 & 11' },
        { label: 'SECURITY', value: 'SHA-256 INTEGRITY CHECK' },
        { label: 'UPDATES', value: 'BACKGROUND DELTA SYNC' },
        { label: 'STARTUP', value: '< 200ms COLD BOOT' },
      ],
      tags: ['Windows Tool', 'TypeScript', 'Auto-Updater', 'Desktop App'],
      liveUrl: 'https://github.com/Apnkk/zflix-launcher',
      githubUrl: 'https://github.com/Apnkk/zflix-launcher',
    },
    {
      id: 'master-credits',
      timecode: '00:04:55:00',
      reelProgress: 0.98,
      sceneNumber: 'SCENE 05',
      takeNumber: 'ROLL FIN',
      title: 'Ares // Lead Full-Stack Builder Suite',
      subtitle: {
        fr: 'FIN DE BANDE // TRANSMISSION DIRECTE',
        en: 'END OF REEL // DIRECT TRANSMISSION',
      },
      location: 'contact@shopcore.buzz // France / Remote',
      focalLength: '35mm ANAMORPHIC T1.5',
      aspectRatio: '2.39:1 SCOPE',
      description: {
        fr: 'Ingénieur et builder autonome : streaming vidéo, applications de bureau et mobile iOS, reverse engineering d’APIs et interfaces rapides qui ont du caractère. Disponible pour projets et missions techniques.',
        en: 'Solo builder and software engineer: media streaming, desktop and iOS native software, API reverse engineering, and fast web products with character. Available for contract builds and consulting.',
      },
      specs: [
        { label: 'DEVELOPER', value: 'ARES (APNKK)' },
        { label: 'LOCATION', value: 'FRANCE (REMOTE FRIENDLY)' },
        { label: 'STACK', value: 'REACT 19 / TS / NODE 22' },
        { label: 'STATUS', value: 'DISPONIBLE // MISSIONS' },
      ],
      tags: ['Lead Builder', 'Full-Stack', 'iOS Modding', 'Streaming', 'Reverse APIs'],
      liveUrl: 'mailto:contact@shopcore.buzz',
    },
  ];

  // Pointer & Touch listener for anamorphic optical flare
  useEffect(() => {
    const handlePointer = (e: MouseEvent) => {
      flareX.set((e.clientX / window.innerWidth - 0.5) * 40);
      flareY.set((e.clientY / window.innerHeight - 0.5) * 20);
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        flareX.set((t.clientX / window.innerWidth - 0.5) * 40);
        flareY.set((t.clientY / window.innerHeight - 0.5) * 20);
      }
    };

    window.addEventListener('mousemove', handlePointer, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointer);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [flareX, flareY]);

  // Sync active scene index on key milestones (avoiding re-renders per scroll tick)
  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      let curScene = 0;
      for (let i = 0; i < scenes.length; i++) {
        if (latest >= (i / scenes.length) * 0.85) {
          curScene = i;
        }
      }
      if (curScene !== lastSceneIndexRef.current) {
        lastSceneIndexRef.current = curScene;
        setActiveSceneIndex(curScene);
      }
    });
  }, [smoothProgress, scenes.length]);

  // Interactive jog-shuttle scrubber click/drag
  const handleTimelineScrub = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targetY = containerRef.current.offsetTop + ratio * scrollHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // Jump to Keyframe Scene
  const jumpToScene = (sceneIndex: number) => {
    if (!containerRef.current) return;
    const targetProgress = scenes[sceneIndex].reelProgress;
    const scrollHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targetY = containerRef.current.offsetTop + targetProgress * scrollHeight;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const activeScene = scenes[activeSceneIndex];

  return (
    <div
      ref={containerRef}
      className="relative min-h-[500vh] bg-black text-[#f5f3ef] font-sans selection:bg-[#ff1e38] selection:text-white"
    >
      {/* 2.39:1 CINEMASCOPE TOP LETTERBOX BAR */}
      <div className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-black z-40 border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-8 select-none pointer-events-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff1e38] shadow-[0_0_10px_#ff1e38] animate-pulse" />
          <span className="mono text-[0.66rem] font-bold text-[#f5f3ef]">
            MASTER MONITOR // 2.39:1 ANAMORPHIC SCOPE
          </span>
          <span className="hidden md:inline mono text-[0.6rem] text-[#726d64]">
            | RED MONSTRO 8K VV // T1.5
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 mono text-[0.64rem] text-[#b8b3a8]">
          <span className="hidden sm:inline text-[#2ee59d]">REC.709 CALIBRATED</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-bold">
            24.000 FPS
          </span>
        </div>
      </div>

      {/* HORIZONTAL RAZOR-SHARP CRIMSON ANAMORPHIC FLARE STREAK */}
      <motion.div
        className="fixed top-1/2 left-0 right-0 -translate-y-1/2 h-[3px] pointer-events-none z-30 opacity-75"
        style={{
          y: smoothFlareY,
        }}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#ff1e38] to-transparent shadow-[0_0_35px_rgba(255,30,56,0.9),0_0_80px_rgba(255,30,56,0.6)]" />
        {/* Optical Anamorphic Hotspot Flare Core */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-80 h-10 rounded-full blur-xl pointer-events-none bg-[#ff1e38]/30"
          style={{
            x: smoothFlareX,
          }}
        />
      </motion.div>

      {/* STICKY 35MM CINEMA STAGE & SCENE DISPLAY */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none z-20 py-16 sm:py-20">
        <div className="relative w-full max-w-6xl h-full flex flex-col justify-between px-4 sm:px-8 py-6">
          {/* Cinema Frame Crosshair Grid (Fincher Neo-Noir) */}
          <div className="absolute inset-x-6 inset-y-10 border border-white/[0.04] pointer-events-none rounded-xl">
            {/* Viewfinder crosshairs */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#ff1e38]/60" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#ff1e38]/60" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#ff1e38]/60" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#ff1e38]/60" />

            {/* Center optical target */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-white/20 rounded-full flex items-center justify-center opacity-40">
              <div className="w-1 h-1 bg-[#ff1e38] rounded-full" />
            </div>
          </div>

          {/* Top Info Bar inside frame */}
          <div className="relative z-10 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#ff1e38]/20 border border-[#ff1e38]/50 text-[#ff1e38] mono text-[0.66rem] font-bold">
                {activeScene.sceneNumber}
              </span>
              <span className="mono text-[0.66rem] text-white/70">
                {activeScene.takeNumber}
              </span>
              <span className="hidden sm:inline mono text-[0.62rem] text-[#726d64]">
                // {activeScene.focalLength}
              </span>
            </div>

            <div className="mono text-[0.62rem] sm:text-[0.68rem] text-[#b8b3a8]">
              {activeScene.location}
            </div>
          </div>

          {/* Main Cinematic Scene Dossier (Chiaroscuro Neo-Noir presentation) */}
          <div className="relative z-10 max-w-3xl my-auto pointer-events-auto">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="p-6 sm:p-10 rounded-2xl bg-black/90 backdrop-blur-3xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            >
              <div className="mono text-[0.66rem] text-[#ff1e38] tracking-widest uppercase">
                {activeScene.subtitle[language]}
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#f5f3ef] mt-2 font-display">
                {activeScene.title}
              </h2>

              <p className="text-sm sm:text-base text-[#b8b3a8] mt-4 leading-relaxed font-sans">
                {activeScene.description[language]}
              </p>

              {/* Master Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-white/10">
                {activeScene.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                  >
                    <span className="mono text-[0.56rem] text-[#726d64] block">
                      {spec.label}
                    </span>
                    <span className="mono text-[0.68rem] sm:text-[0.72rem] font-bold text-[#f5f3ef] mt-0.5 block truncate">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tags and Action CTAs */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeScene.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 mono text-[0.6rem] text-[#c2bdb3]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2.5">
                  {activeScene.liveUrl && (
                    <a
                      href={activeScene.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ff1e38] hover:bg-[#ff2d46] text-white mono text-[0.7rem] font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,30,56,0.4)]"
                    >
                      <span>{language === 'fr' ? 'Projeter' : 'Screen Scene'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {activeScene.githubUrl && (
                    <a
                      href={activeScene.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#f5f3ef] mono text-[0.7rem] tracking-wider transition-all"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  {activeScene.id === 'master-credits' && (
                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-[#ff1e38]/20 border border-white/20 hover:border-[#ff1e38] text-[#f5f3ef] mono text-[0.7rem] tracking-wider transition-all cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2ee59d]" />
                          <span className="text-[#2ee59d]">
                            {language === 'fr' ? 'Email copié !' : 'Email Copied!'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#ff1e38]" />
                          <span>{portfolioData.personal.email}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Scene Markers */}
          <div className="relative z-10 flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-2">
              {scenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => jumpToScene(idx)}
                  className={`px-2.5 py-1 rounded-md mono text-[0.62rem] transition-all cursor-pointer ${
                    activeSceneIndex === idx
                      ? 'bg-[#ff1e38] text-white font-bold shadow-[0_0_12px_rgba(255,30,56,0.6)]'
                      : 'bg-white/5 hover:bg-white/10 text-white/50'
                  }`}
                >
                  {scene.sceneNumber}
                </button>
              ))}
            </div>

            <span className="mono text-[0.6rem] text-[#726d64] hidden sm:inline">
              Fincher Neo-Noir // High Dynamic Range Master
            </span>
          </div>
        </div>
      </div>

      {/* 2.39:1 CINEMASCOPE BOTTOM LETTERBOX BAR WITH CHRONO-SCRUBBER HUD */}
      <div className="fixed bottom-0 left-0 right-0 h-20 sm:h-24 bg-black z-40 border-t border-white/[0.08] flex flex-col justify-between px-4 sm:px-8 py-2 select-none pointer-events-auto shadow-[0_-15px_40px_rgba(0,0,0,0.9)]">
        {/* Top Scrubber Row: Timecode, Speed, Audio Meters */}
        <div className="flex items-center justify-between">
          {/* SMPTE Master Timecode */}
          <TimecodeHud progress={smoothProgress} />

          {/* Stereo Decibel Peak VU Meters */}
          <VuMetersHud progress={smoothProgress} />
        </div>

        {/* Bottom Scrubber Timeline Bar with Keyframe Markers */}
        <div
          onClick={handleTimelineScrub}
          onTouchMove={handleTimelineScrub}
          className="relative w-full h-5 flex items-center group cursor-pointer"
        >
          {/* Background Timeline track */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ff1e38] to-[#ff4d61] shadow-[0_0_12px_#ff1e38]"
              style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
            />
          </div>

          {/* Keyframe Snap Nodes */}
          {scenes.map((scene, i) => (
            <button
              key={scene.id}
              onClick={(e) => {
                e.stopPropagation();
                jumpToScene(i);
              }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group/node cursor-pointer z-10"
              style={{ left: `${scene.reelProgress * 100}%` }}
              title={`${scene.timecode} — ${scene.title}`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-transform duration-200 ${
                  activeSceneIndex === i
                    ? 'bg-[#ff1e38] ring-2 ring-white scale-125'
                    : 'bg-white/40 hover:bg-white'
                }`}
              />
              <span className="hidden group-hover/node:block absolute -top-6 mono text-[0.55rem] bg-black px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap text-white z-20">
                {scene.timecode}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 5 SCROLL SEGMENTS TO DRIVE THE CHRONO SCRUBBER */}
      <div className="relative z-0 pointer-events-none">
        {scenes.map((scene) => (
          <section
            key={scene.id}
            className="h-screen w-full flex items-end justify-center pb-28 px-6"
            aria-label={scene.title}
          >
            <div className="mono text-[0.66rem] text-white/10 uppercase tracking-widest select-none">
              // REEL TIMECODE {scene.timecode} — {scene.sceneNumber}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
