import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, type MotionValue } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { portfolioData } from '../../data/portfolioData';
import {
  ExternalLink,
  Cpu,
  Radio,
  Activity,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { GithubIcon } from '../icons/BrandIcons';

interface CadLayer {
  id: string;
  actNumber: string;
  title: string;
  codeName: string;
  category: string;
  zOffsetDefault: number;
  zOffsetExploded: number;
  description: { fr: string; en: string };
  specs: { label: string; value: string }[];
  telemetry: {
    coords: string;
    freq: string;
    power: string;
    status: string;
  };
  features: { fr: string[]; en: string[] };
  githubUrl?: string;
  liveUrl?: string;
}

interface CadWaferProps {
  layer: CadLayer;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
  explosionFactor: MotionValue<number>;
}

function CadWafer({
  layer,
  index,
  isSelected,
  onSelect,
  explosionFactor,
}: CadWaferProps) {
  const currentZOffset = useTransform(
    explosionFactor,
    [0, 1],
    [layer.zOffsetDefault, layer.zOffsetExploded]
  );

  return (
    <motion.div
      onClick={() => onSelect(index)}
      style={{
        transformStyle: 'preserve-3d',
        z: currentZOffset,
      }}
      className={`absolute inset-0 rounded-2xl cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-2 border-[#ff1e38] shadow-[0_0_35px_rgba(255,30,56,0.65)]'
          : 'border border-white/20 hover:border-[#ff1e38]/70 hover:shadow-[0_0_20px_rgba(255,30,56,0.3)]'
      }`}
    >
      {/* Wafer Surface Plate with Integrated Circuit Matrix */}
      <div
        className={`w-full h-full rounded-2xl relative p-4 sm:p-6 backdrop-blur-xl overflow-hidden flex flex-col justify-between transition-colors duration-300 ${
          isSelected
            ? 'bg-black/90 ring-1 ring-[#ff1e38]/60'
            : 'bg-black/70 hover:bg-black/85'
        }`}
      >
        {/* Silicon Micro-Traces (Circuit Pattern) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 30, 56, 0.3) 1px, transparent 1px),
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 24px 24px, 24px 24px',
          }}
        />

        {/* Laser Edge Highlights */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff1e38] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff1e38] to-transparent" />

        {/* Header in Wafer */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="mono text-[0.62rem] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#f5f3ef]">
            {layer.actNumber}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isSelected ? 'bg-[#ff1e38] shadow-[0_0_8px_#ff1e38]' : 'bg-white/40'
              }`}
            />
            <span className="mono text-[0.58rem] text-white/60">
              {layer.telemetry.power}
            </span>
          </div>
        </div>

        {/* Center Circuit Die */}
        <div className="relative z-10 my-auto text-center py-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[#ff1e38]/20 to-black border border-[#ff1e38]/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,30,56,0.3)]">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff1e38]" />
          </div>
          <h4 className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#f5f3ef]">
            {layer.title.split('//')[0].trim()}
          </h4>
          <p className="mono text-[0.6rem] text-[#ff1e38] mt-0.5 tracking-widest">
            {layer.codeName}
          </p>
        </div>

        {/* Footer Telemetry on Wafer */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 mono text-[0.58rem] text-[#b8b3a8]">
          <span>{layer.specs[0].label}: {layer.specs[0].value}</span>
          <span className="text-[#2ee59d]">{layer.telemetry.status}</span>
        </div>
      </div>
    </motion.div>
  );
}

export const ConceptCadDissection = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active highlighted layer (0 to 4)
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Smooth mouse motion values for 120 FPS GPU transforms (no state re-renders)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const mousePosRef = useRef({ x: 0, y: 0 });

  const rotateX = useTransform(smoothMouseY, [-1, 1], [70, 46]);
  const rotateZ = useTransform(smoothMouseX, [-1, 1], [-50, -22]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-8, 8]);

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Dynamic explosion factor derived from scroll (0 = compact monolith, 1 = fully exploded)
  const explosionFactor = useTransform(smoothScroll, [0.05, 0.85], [0, 1]);

  // CAD Layers Data representing Ares' projects & engineering core
  const layers: CadLayer[] = [
    {
      id: 'zflix-core',
      actNumber: 'ACT 01',
      title: 'Z-Flix Streaming Core & HLS Pipeline',
      codeName: 'WAFER_04 // HLS_VIDEO_DEMUXER',
      category: language === 'fr' ? 'Pipeline Vidéo & Streaming' : 'Video Pipeline & Streaming',
      zOffsetDefault: 120,
      zOffsetExploded: 320,
      description: {
        fr: 'Moteur de streaming vidéo haute performance sans publicité. Résolveur de flux HLS résilient, agrégation de catalogues multi-studios (Netflix, Disney+, HBO, Marvel, DC) et lecteur à reprise automatique.',
        en: 'High-throughput ad-free streaming engine. Resilient HLS stream resolvers, unified multi-studio indexing (Netflix, Disney+, HBO, Marvel, DC), and hardware-accelerated playback with auto-resume.',
      },
      specs: [
        { label: 'BUFFER LATENCY', value: '< 12ms' },
        { label: 'CHUNK DEMUX', value: 'HLS TS/MP4' },
        { label: 'RESOLUTION', value: '4K HDR / 1080p' },
        { label: 'FPS TARGET', value: '60 FPS STABLE' },
      ],
      telemetry: {
        coords: 'X: 128.40 // Y: 44.12 // Z: +320mm',
        freq: '5.2 GHz BUS',
        power: '0.85W DRAIN',
        status: 'STREAM_RESOLVED_OK',
      },
      features: {
        fr: [
          'Hubs studio unifiés (Netflix, Disney+, HBO, Marvel, DC)',
          'Lecteur vidéo avec gestion VF / VOSTFR instantanée',
          'Reprise de lecture automatique et persistance locale',
        ],
        en: [
          'Unified studio hubs (Netflix, Disney+, HBO, Marvel, DC)',
          'Instant audio & subtitle track switcher (VF / VOSTFR)',
          'Automatic playback state resume & zero-latency sync',
        ],
      },
      githubUrl: 'https://github.com/Apnkk/Z-FLIX-app',
      liveUrl: 'https://github.com/Apnkk/Z-FLIX-app',
    },
    {
      id: 'spoti-dylib',
      actNumber: 'ACT 02',
      title: 'Spoti Liquid Glass // ARM64 Dylib Hook',
      codeName: 'WAFER_03 // IOS_RUNTIME_HOOK',
      category: language === 'fr' ? 'iOS Modding & Reverse Engineering' : 'iOS Modding & Reverse Engineering',
      zOffsetDefault: 60,
      zOffsetExploded: 190,
      description: {
        fr: 'Injection dynamique de dylib ARM64 dans le bundle iOS officiel Spotify. Remplacement de l’interface par des composants dépolis Liquid Glass ultra-fluides, 100% fonctionnel sans aucun jailbreak.',
        en: 'Dynamic ARM64 dylib runtime injection into native iOS Spotify bundle. Injects fluid frosted Liquid Glass UI components and custom playback docks without jailbreak.',
      },
      specs: [
        { label: 'ARCH', value: 'ARM64 / ARM64e' },
        { label: 'INJECTION', value: 'DYLIB RUNTIME' },
        { label: 'SIDELOAD', value: 'FEATHER / ALTSTORE' },
        { label: 'BATTERY IMPACT', value: '< 0.04% / HR' },
      ],
      telemetry: {
        coords: 'X: 114.28 // Y: 56.88 // Z: +190mm',
        freq: 'MACH-O 64b',
        power: 'PASSIVE HOOK',
        status: 'INJECTION_STABLE',
      },
      features: {
        fr: [
          'Fonctionnement sans jailbreak via signature standard',
          'Rendu Liquid Glass dépoli à 60 FPS constants',
          'Compatible TrollStore, AltStore, Feather et Scarlet',
        ],
        en: [
          'Zero-jailbreak execution via standard sideload signing',
          'Frosted Liquid Glass rendering locked at 60 FPS',
          'Full support for TrollStore, AltStore, Feather, and Scarlet',
        ],
      },
      githubUrl: 'https://github.com/Apnkk/spoti.pw',
      liveUrl: 'https://github.com/Apnkk/spoti.pw',
    },
    {
      id: 'shopcore-engine',
      actNumber: 'ACT 03',
      title: 'ShopCore Transaction & Fulfillment Engine',
      codeName: 'WAFER_02 // STRIPE_CRYPTO_CORE',
      category: language === 'fr' ? 'E-Commerce & Passerelle Hybride' : 'E-Commerce & Hybrid Gateway',
      zOffsetDefault: 0,
      zOffsetExploded: 50,
      description: {
        fr: 'Moteur de vente automatisé haute disponibilité. Intégration hybride Stripe + Crypto multi-devises, validation instantanée par webhooks cryptographiques, distribution automatisée des accès et garantie 24h.',
        en: 'High-availability automated commerce engine. Hybrid Stripe + Crypto multi-currency checkout, cryptographic webhook validation, automated real-time license provisioning, and 24h guarantee.',
      },
      specs: [
        { label: 'CHECKOUT', value: 'STRIPE + CRYPTO' },
        { label: 'DISPATCH', value: 'INSTANT (< 60s)' },
        { label: 'STACK', value: 'NEXT.JS APP ROUTER' },
        { label: 'STOCK LOCK', value: 'ATOMIC MUTEX' },
      ],
      telemetry: {
        coords: 'X: 98.72 // Y: 72.10 // Z: +50mm',
        freq: 'REST / WEBHOOKS',
        power: '24/7 PRODUCTION',
        status: 'SHOPCORE_BUZZ_LIVE',
      },
      features: {
        fr: [
          'Double passerelle de paiement Stripe et Crypto automatisée',
          'Délivrance asynchrone sécurisée par signature webhook HMAC',
          'Gestion des stocks en temps réel sans survente',
        ],
        en: [
          'Dual automated Stripe and Crypto checkout gateways',
          'Asynchronous order fulfillment secured by HMAC webhook signatures',
          'Real-time inventory locks preventing overselling',
        ],
      },
      liveUrl: 'https://shopcore.buzz',
    },
    {
      id: 'zlauncher-tool',
      actNumber: 'ACT 04',
      title: 'Z-Launcher // Windows Desktop Gateway',
      codeName: 'WAFER_01 // DESKTOP_IPC_BRIDGE',
      category: language === 'fr' ? 'Outil Desktop & Auto-Updater' : 'Desktop Tool & Auto-Updater',
      zOffsetDefault: -60,
      zOffsetExploded: -80,
      description: {
        fr: 'Application de bureau Windows servant de hub d’accès centralisé pour l’écosystème Z-Flix. Vérification d’intégrité des binaires, mises à jour asynchrones et lancement matériellement optimisé.',
        en: 'Windows desktop client acting as the central gateway for the Z-Flix suite. Binary checksum verification, remote auto-updating pipeline, and hardware-accelerated execution.',
      },
      specs: [
        { label: 'TARGET OS', value: 'WINDOWS 10/11' },
        { label: 'INTEGRITY', value: 'SHA-256 CHECKSUM' },
        { label: 'IPC', value: 'NAMED PIPES' },
        { label: 'UPDATER', value: 'DELTA PATCHING' },
      ],
      telemetry: {
        coords: 'X: 84.15 // Y: 88.04 // Z: -80mm',
        freq: 'LOCAL IPC',
        power: 'ZERO-IDLE',
        status: 'INTEGRITY_VERIFIED',
      },
      features: {
        fr: [
          'Lancement en 1 clic avec contrôle d’intégrité',
          'Vérification des releases distantes au boot',
          'Désinstallation propre et isolation du cache',
        ],
        en: [
          'One-click launch with binary integrity checks',
          'Remote release delta verification on startup',
          'Clean uninstaller and isolated cache sandbox',
        ],
      },
      githubUrl: 'https://github.com/Apnkk/zflix-launcher',
      liveUrl: 'https://github.com/Apnkk/zflix-launcher',
    },
    {
      id: 'ares-substrate',
      actNumber: 'ACT 05',
      title: 'Substrate 00 // Full-Stack Builder Matrix',
      codeName: 'BASE_00 // ARES_SYSTEM_FOUNDATION',
      category: language === 'fr' ? 'Matrice de Compétences & Contact' : 'Core Competencies & Contact',
      zOffsetDefault: -120,
      zOffsetExploded: -220,
      description: {
        fr: 'Socle architectural de l’ingénieur Ares : conception d’architectures réactives en TypeScript strict, intégration de modèles de distribution streaming, reverse engineering et exécution de produits de bout en bout.',
        en: 'Ares’ core engineering foundation: reactive full-stack architectures in strict TypeScript, high-throughput streaming systems, reverse engineering, and end-to-end product delivery.',
      },
      specs: [
        { label: 'STACK', value: 'REACT 19 / TS STRICT' },
        { label: 'BACKEND', value: 'NODE.JS 22 / FASTAPI' },
        { label: 'PERF BUDGET', value: '< 16.6ms / 120 FPS' },
        { label: 'AVAILABILITY', value: 'DISPONIBLE // MISSIONS' },
      ],
      telemetry: {
        coords: 'X: 00.00 // Y: 00.00 // Z: -220mm',
        freq: 'PARIS // UTC+2',
        power: 'MAX_BANDWIDTH',
        status: 'CONTACT_READY',
      },
      features: {
        fr: [
          'Autonomie de livraison 100% de l’idée au déploiement en prod',
          'Expertise concrète sur le streaming HLS et l’écosystème iOS',
          'Code typé strictly, propre et sans dépendances superflues',
        ],
        en: [
          '100% solo shipping from concept to production deploy',
          'Hands-on expertise in HLS video streaming and iOS internals',
          'Strictly typed, clean architecture with zero unnecessary bloat',
        ],
      },
      liveUrl: 'mailto:contact@shopcore.buzz',
    },
  ];

  // Mouse & Touch Parallax listener for 120 FPS performance
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(nx);
      mouseY.set(ny);
      mousePosRef.current = { x: nx, y: ny };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const { innerWidth, innerHeight } = window;
        const nx = (t.clientX / innerWidth - 0.5) * 2;
        const ny = (t.clientY / innerHeight - 0.5) * 2;
        mouseX.set(nx);
        mouseY.set(ny);
        mousePosRef.current = { x: nx, y: ny };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [mouseX, mouseY]);

  // Animated CAD Blueprint Canvas (runs continuously at 60/120 FPS without effect re-runs)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Grid spacing
      const gridSize = 45;
      ctx.lineWidth = 0.5;

      // Draw subtle CAD coordinate grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Sweeping crimson laser radar scanline
      const scanY = (Math.sin(time * 0.8) * 0.5 + 0.5) * height;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, 'rgba(255, 30, 56, 0)');
      scanGrad.addColorStop(0.5, 'rgba(255, 30, 56, 0.18)');
      scanGrad.addColorStop(1, 'rgba(255, 30, 56, 0)');

      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, width, 60);

      ctx.strokeStyle = 'rgba(255, 30, 56, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // Laser telemetry target crosshair around center
      const centerX = width * 0.5 + mousePosRef.current.x * 25;
      const centerY = height * 0.45 + mousePosRef.current.y * 25;

      ctx.strokeStyle = 'rgba(255, 30, 56, 0.35)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.moveTo(centerX - 100, centerY);
      ctx.lineTo(centerX + 100, centerY);
      ctx.moveTo(centerX, centerY - 100);
      ctx.lineTo(centerX, centerY + 100);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Sync active layer index with scroll position
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const index = Math.min(
        layers.length - 1,
        Math.floor(latest * (layers.length + 0.1))
      );
      setSelectedLayerIndex(index);
    });
  }, [scrollYProgress, layers.length]);

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const activeLayer = layers[selectedLayerIndex];

  return (
    <div
      ref={containerRef}
      className="relative min-h-[500vh] bg-black text-[#f5f3ef] font-sans selection:bg-[#ff1e38] selection:text-white"
    >
      {/* Background Interactive CAD Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Floating CAD HUD Header Telemetry */}
      <header className="fixed top-16 sm:top-20 left-0 right-0 z-40 px-4 sm:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Top Left: Telemetry & Act Indicator */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
            <Radio className="w-3.5 h-3.5 text-[#ff1e38] animate-pulse" />
            <span className="mono text-[0.66rem] text-[#f5f3ef] font-bold">
              CAD_DISSECTION // {activeLayer.actNumber}
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline mono text-[0.62rem] text-[#b8b3a8]">
              {activeLayer.telemetry.coords}
            </span>
          </div>

          {/* Top Right: Status & FPS */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
            <Activity className="w-3.5 h-3.5 text-[#ff1e38]" />
            <span className="mono text-[0.62rem] sm:text-[0.66rem] text-[#2ee59d]">
              120 FPS // VSYNC OK
            </span>
            <span className="mono text-[0.62rem] text-white/50 hidden md:inline">
              ISO: 58° / -36°
            </span>
          </div>
        </div>
      </header>

      {/* STICKY 3D ISOMETRIC VIEWPORT (Desktop and Mobile) */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none z-10">
        <div
          className="relative w-full max-w-6xl h-full flex flex-col lg:flex-row items-center justify-between px-4 sm:px-8 py-20"
          style={{ perspective: '1400px' }}
        >
          {/* 3D Exploded Monolith Core Stage */}
          <div className="relative w-full lg:w-1/2 h-[420px] sm:h-[520px] flex items-center justify-center pointer-events-auto select-none">
            {/* 3D Isometric Rotating Group */}
            <motion.div
              className="relative w-[280px] sm:w-[360px] h-[280px] sm:h-[360px]"
              style={{
                transformStyle: 'preserve-3d',
                rotateX,
                rotateZ,
                rotateY,
              }}
            >
              {/* Central laser vertical datum axis */}
              <div
                className="absolute left-1/2 top-1/2 w-[2px] h-[650px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255,30,56,0) 0%, rgba(255,30,56,0.85) 50%, rgba(255,30,56,0) 100%)',
                  boxShadow: '0 0 20px #ff1e38',
                  transform: 'rotateX(-90deg)',
                }}
              />

              {/* Silicon Circuit Wafers Stack */}
              {layers.map((layer, index) => (
                <CadWafer
                  key={layer.id}
                  layer={layer}
                  index={index}
                  isSelected={selectedLayerIndex === index}
                  onSelect={setSelectedLayerIndex}
                  explosionFactor={explosionFactor}
                />
              ))}
            </motion.div>
          </div>

          {/* Interactive CAD Dossier Inspector (Right Column on Desktop, Bottom Card on Mobile) */}
          <div className="w-full lg:w-1/2 max-w-xl pointer-events-auto mt-4 lg:mt-0">
            <motion.div
              key={activeLayer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative p-6 sm:p-8 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            >
              {/* Laser Corner Brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#ff1e38]" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#ff1e38]" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#ff1e38]" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#ff1e38]" />

              {/* Dossier Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#ff1e38]/20 border border-[#ff1e38]/60 text-[#ff1e38] mono text-[0.62rem] font-bold">
                    {activeLayer.actNumber}
                  </span>
                  <span className="mono text-[0.66rem] text-[#b8b3a8]">
                    {activeLayer.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mono text-[0.62rem] text-[#2ee59d]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ee59d] animate-ping" />
                  ONLINE
                </div>
              </div>

              {/* Dossier Title */}
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f5f3ef] mt-3">
                {activeLayer.title}
              </h3>
              <p className="mono text-[0.68rem] text-[#ff1e38] mt-0.5">
                {activeLayer.codeName}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#b8b3a8] mt-3 leading-relaxed">
                {activeLayer.description[language]}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                {activeLayer.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="p-2 sm:p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                  >
                    <span className="mono text-[0.58rem] text-[#726d64] block">
                      {spec.label}
                    </span>
                    <span className="mono text-[0.72rem] sm:text-xs font-semibold text-[#f5f3ef] mt-0.5 block">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Key Architecture Features */}
              <div className="mt-4 space-y-1.5">
                {activeLayer.features[language].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#b8b3a8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#ff1e38] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-white/10">
                {activeLayer.liveUrl && (
                  <a
                    href={activeLayer.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff1e38] hover:bg-[#ff2d46] text-white mono text-[0.7rem] font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,30,56,0.4)]"
                  >
                    <span>{language === 'fr' ? 'Accéder au Projet' : 'Launch Project'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {activeLayer.githubUrl && (
                  <a
                    href={activeLayer.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[#f5f3ef] mono text-[0.7rem] tracking-wider transition-all"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}

                {activeLayer.id === 'ares-substrate' && (
                  <button
                    onClick={copyEmail}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-[#ff1e38]/20 border border-white/20 hover:border-[#ff1e38] text-[#f5f3ef] mono text-[0.7rem] tracking-wider transition-all cursor-pointer"
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
            </motion.div>

            {/* Quick Wafer Selector Navigation Bar */}
            <div className="flex items-center justify-between mt-3 px-2">
              <div className="flex items-center gap-1.5">
                {layers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedLayerIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      selectedLayerIndex === idx
                        ? 'w-8 bg-[#ff1e38] shadow-[0_0_10px_#ff1e38]'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Inspecter Wafer ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 mono text-[0.62rem] text-[#726d64]">
                <Layers className="w-3 h-3 text-[#ff1e38]" />
                <span>{language === 'fr' ? 'Défilez pour déconstruire' : 'Scroll to explode'}</span>
                <ChevronDown className="w-3 h-3 animate-bounce text-[#ff1e38]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5-ACT SCROLL SECTIONS (Guides the scrollytelling length) */}
      <div className="relative z-0 pointer-events-none">
        {layers.map((layer, index) => (
          <section
            key={layer.id}
            className="h-screen w-full flex items-end justify-center pb-24 px-6"
            aria-label={`Acte ${index + 1} - ${layer.title}`}
          >
            <div className="mono text-[0.66rem] text-white/10 uppercase tracking-widest select-none">
              // SCROLL STAGE 0{index + 1} — {layer.codeName}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
