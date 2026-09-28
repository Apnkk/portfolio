import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { portfolioData } from '../../data/portfolioData';
import {
  ExternalLink,
  Droplets,
  Eye,
  Zap,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { GithubIcon } from '../icons/BrandIcons';

interface SapphireSlab {
  id: string;
  number: string;
  title: string;
  tagline: { fr: string; en: string };
  category: { fr: string; en: string };
  description: { fr: string; en: string };
  metrics: { label: string; value: string }[];
  tags: string[];
  disassemblyCode: string;
  liveUrl?: string;
  githubUrl?: string;
}

export const ConceptLiquidSapphire = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active inspected slab
  const [activeSlabIndex, setActiveSlabIndex] = useState(0);
  const [isInsideViewport, setIsInsideViewport] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Lens motion values for 120 FPS GPU translation without state lag
  const lensX = useMotionValue(-500);
  const lensY = useMotionValue(-500);
  const smoothLensX = useSpring(lensX, { stiffness: 400, damping: 30 });
  const smoothLensY = useSpring(lensY, { stiffness: 400, damping: 30 });

  // Scroll binding
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  const slabs: SapphireSlab[] = [
    {
      id: 'shopcore',
      number: '01',
      title: 'ShopCore // Liquid Transaction Gateway',
      tagline: {
        fr: 'Plateforme e-commerce d’abonnements avec paiement hybride Stripe & Crypto.',
        en: 'Subscription e-commerce platform with hybrid Stripe & Crypto gateways.',
      },
      category: { fr: 'Full-Stack & E-Commerce', en: 'Full-Stack & E-Commerce' },
      description: {
        fr: 'Infrastructure de vente automatisée à haute conversion. Pipeline d’approvisionnement instantané par webhooks asynchrones, gestion des stocks en temps réel et garantie 24h intégrée.',
        en: 'High-conversion automated commerce infrastructure. Real-time fulfillment via asynchronous webhooks, atomic inventory mutex locks, and built-in 24h warranty guarantee.',
      },
      metrics: [
        { label: 'DISPATCH', value: '< 60s' },
        { label: 'FRAME BUDGET', value: '11.2ms' },
        { label: 'UPTIME', value: '99.98%' },
        { label: 'GATEWAYS', value: 'STRIPE + CRYPTO' },
      ],
      tags: ['Next.js', 'TypeScript', 'Stripe API', 'Crypto', 'Webhooks'],
      disassemblyCode: `// ShopCore Kernel Webhook Dispatcher
async function fulfillOrder(session: Stripe.Checkout.Session) {
  const hmac = verifyHeader(session.sig, env.STRIPE_SECRET);
  if (!hmac.valid) throw new SecurityFault("INVALID_SIG");
  await db.transaction(async (tx) => {
    const item = await tx.inventory.acquireLock(session.sku);
    await mailer.dispatchInstantKey(session.customer_email, item.key);
  });
  return { status: "FULFILLED", latencyMs: 14.2 };
}`,
      liveUrl: 'https://shopcore.buzz',
    },
    {
      id: 'zflix',
      number: '02',
      title: 'Z-Flix // Deep Sapphire Video Prism',
      tagline: {
        fr: 'Client de streaming média haute fidélité avec agrégation multi-studios sans pub.',
        en: 'High-fidelity media streaming client with multi-studio aggregation, ad-free.',
      },
      category: { fr: 'Streaming & Média HLS', en: 'Streaming & Media HLS' },
      description: {
        fr: 'Expérience de streaming sans compromis. Résolveur de flux vidéo HLS sans coupure, hubs de studios unifiés (Netflix, Disney+, HBO, Marvel, DC), double piste audio VF/VOSTFR et reprise automatique.',
        en: 'Uncompromised media streaming engine. Resilient HLS video stream resolver, unified studio hubs (Netflix, Disney+, HBO, Marvel, DC), dual audio/subtitle tracks, and resume state.',
      },
      metrics: [
        { label: 'BUFFER LATENCY', value: '< 14ms' },
        { label: 'FRAME BUDGET', value: '10.8ms' },
        { label: 'AUDIO TRACKS', value: 'VF / VOSTFR' },
        { label: 'STREAM CODEC', value: 'H.264 / H.265' },
      ],
      tags: ['React', 'TypeScript', 'HLS Demux', 'Video Player', 'Desktop'],
      disassemblyCode: `// Z-Flix HLS Demuxer & Chunk Resolver
class HlsSegmentResolver {
  private bufferQueue: Uint8Array[] = [];
  async demuxChunk(chunkUri: string): Promise<FrameBuffer> {
    const raw = await fetchSegment(chunkUri, { cache: "force-cache" });
    const demuxed = await WebAssembly.instantiate(wasmDemuxer, { buffer: raw });
    this.bufferQueue.push(demuxed.videoTracks);
    return { pts: demuxed.timestamp, ready: true };
  }
}`,
      liveUrl: 'https://github.com/Apnkk/Z-FLIX-app',
      githubUrl: 'https://github.com/Apnkk/Z-FLIX-app',
    },
    {
      id: 'spoti',
      number: '03',
      title: 'Spoti Liquid Glass // Ferrofluid iOS Hook',
      tagline: {
        fr: 'Refonte de l’UI Spotify sur iOS avec rendu Liquid Glass sans aucun jailbreak.',
        en: 'Custom Liquid Glass UI overhaul for Spotify on iOS, zero jailbreak required.',
      },
      category: { fr: 'iOS Modding & Reverse', en: 'iOS Modding & Reverse' },
      description: {
        fr: 'Projet de personnalisation esthétique poussé. Injection dynamique d’une dylib compilée ARM64 pour injecter des vues dépolies Liquid Glass, lecteur audio personnalisé et support complet des sideloaders modernes.',
        en: 'High-end UI customization project. Dynamic ARM64 compiled dylib injection delivering frosted Liquid Glass views, bespoke player dock, and full sideloading support (Feather, AltStore).',
      },
      metrics: [
        { label: 'JAILBREAK', value: '0-JAILBREAK' },
        { label: 'FRAME BUDGET', value: '16.2ms' },
        { label: 'REFRESH RATE', value: '60/120 FPS' },
        { label: 'TARGET OS', value: 'iOS 16 - 18' },
      ],
      tags: ['iOS Dylib', 'Liquid Glass', 'Objective-C/Swift', 'Sideloading'],
      disassemblyCode: `// Spoti Liquid Glass - ARM64 Hook
__attribute__((constructor)) static void initLiquidGlass() {
  Class target = objc_getClass("SPTNowPlayingViewController");
  SEL original = @selector(viewDidLoad);
  Method origMethod = class_getInstanceMethod(target, original);
  method_setImplementation(origMethod, imp_implementationWithBlock(^(id self) {
    applyFrostedGlassCompositor(self.view);
  }));
}`,
      liveUrl: 'https://github.com/Apnkk/spoti.pw',
      githubUrl: 'https://github.com/Apnkk/spoti.pw',
    },
    {
      id: 'ares-core',
      number: '04',
      title: 'Ares // Liquid Sapphire Core Blueprint',
      tagline: {
        fr: 'Matrice de compétences de l’ingénieur Ares : streaming, iOS et architecture.',
        en: 'Ares’ core engineering matrix: streaming systems, iOS, and full-stack builds.',
      },
      category: { fr: 'Builder Autonome & Contact', en: 'Solo Builder & Contact' },
      description: {
        fr: 'Développement de bout en bout de produits vivants et rapides. TypeScript strict, WebSockets, reverse d’APIs privées et déploiements en production sans compromis. Disponible pour missions techniques.',
        en: 'End-to-end shipping of high-performance live software products. Strict TypeScript, WebSockets, private API reverse engineering, and production deployments. Open for contract missions.',
      },
      metrics: [
        { label: 'DELIVERY RATE', value: '100% SOLO' },
        { label: 'FRAME BUDGET', value: '8.3ms' },
        { label: 'HARDWARE FPS', value: '120.0 FPS' },
        { label: 'AVAILABILITY', value: 'DISPONIBLE' },
      ],
      tags: ['React 19', 'TypeScript Strict', 'Node.js 22', 'Tailwind v4', 'Reverse APIs'],
      disassemblyCode: `// Ares Core Architecture Spec
export const BuilderManifest = {
  architect: "Ares (Apnkk)",
  mantra: "Inspect -> Understand -> Plan -> Modify -> Verify -> Ship",
  capabilities: ["HLS Video Pipelines", "iOS Runtime Tweaks", "Stripe + Crypto E-Com"],
  contact: "contact@shopcore.buzz",
  status: "AVAILABLE_FOR_CONTRACTS"
};`,
      liveUrl: 'mailto:contact@shopcore.buzz',
    },
  ];

  // Ripple simulation in Ferrofluid canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      amplitude: number;
      decay: number;
      crimsonMix: number;
    }

    const ripples: Ripple[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Add ripples on pointer move
    let lastRippleTime = 0;
    const addRipple = (x: number, y: number, isStrong: boolean) => {
      ripples.push({
        x,
        y,
        radius: isStrong ? 8 : 4,
        maxRadius: isStrong ? 280 : 180,
        amplitude: isStrong ? 1.4 : 0.8,
        decay: isStrong ? 0.97 : 0.965,
        crimsonMix: Math.random() > 0.4 ? 1 : 0.4,
      });
    };

    const handleMove = (e: MouseEvent) => {
      lensX.set(e.clientX);
      lensY.set(e.clientY);
      setIsInsideViewport(true);

      const now = performance.now();
      if (now - lastRippleTime > 65) {
        lastRippleTime = now;
        addRipple(e.clientX, e.clientY, false);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY, true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        lensX.set(t.clientX);
        lensY.set(t.clientY);
        setIsInsideViewport(true);

        const now = performance.now();
        if (now - lastRippleTime > 65) {
          lastRippleTime = now;
          addRipple(t.clientX, t.clientY, false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        addRipple(t.clientX, t.clientY, true);
      }
    };

    const handleLeave = () => {
      setIsInsideViewport(false);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    // Periodic ambient ferrofluid magnetic pulse from center
    let ambientTimer = 0;

    const render = () => {
      ambientTimer += 0.02;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Ambient concentric magnetic waves
      if (Math.sin(ambientTimer) > 0.985 && ripples.length < 18) {
        ripples.push({
          x: width * 0.5 + Math.sin(ambientTimer * 2) * 120,
          y: height * 0.5 + Math.cos(ambientTimer * 2) * 80,
          radius: 10,
          maxRadius: 360,
          amplitude: 0.6,
          decay: 0.98,
          crimsonMix: 0.8,
        });
      }

      // Render concentric ripples with hydrodynamic specular gradient
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 2.2;
        r.amplitude *= r.decay;

        if (r.amplitude < 0.01 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw outer ripple ring
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.lineWidth = 1.5;
        const alpha = Math.min(1, r.amplitude * 0.35);

        if (r.crimsonMix > 0.7) {
          ctx.strokeStyle = `rgba(255, 30, 56, ${alpha})`;
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
        }
        ctx.stroke();

        // Inner caustic reflection ring
        if (r.radius > 20) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius - 12, 0, Math.PI * 2);
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(255, 30, 56, ${alpha * 0.25})`;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(animId);
    };
  }, [lensX, lensY]);

  // Sync scroll to active slab
  useEffect(() => {
    return smoothProgress.on('change', (latest) => {
      const idx = Math.min(
        slabs.length - 1,
        Math.floor(latest * slabs.length * 1.05)
      );
      setActiveSlabIndex((prev) => (prev !== idx ? idx : prev));
    });
  }, [smoothProgress, slabs.length]);

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const activeSlab = slabs[activeSlabIndex];

  return (
    <div
      ref={containerRef}
      className="relative min-h-[450vh] bg-black text-[#f5f3ef] font-sans selection:bg-[#ff1e38] selection:text-white"
    >
      {/* Background Hydrodynamic Ferrofluid Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Top Telemetry Bar */}
      <header className="fixed top-16 sm:top-20 left-0 right-0 z-40 px-4 sm:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
            <Droplets className="w-3.5 h-3.5 text-[#ff1e38] animate-pulse" />
            <span className="mono text-[0.66rem] text-[#f5f3ef] font-bold">
              FERROFLUID PRISM // HYDRODYNAMIC FIELD
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
            <Zap className="w-3.5 h-3.5 text-[#ff1e38]" />
            <span className="mono text-[0.66rem] text-[#2ee59d]">
              &lt; 16ms LATENCY // 120 FPS VSYNC
            </span>
          </div>
        </div>
      </header>

      {/* INTERACTIVE CURSOR INSPECTION LENS (X-Ray HUD following pointer) */}
      {isInsideViewport && (
        <motion.div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block"
          style={{
            x: smoothLensX,
            y: smoothLensY,
          }}
        >
          <div className="relative w-44 h-44 rounded-full border border-[#ff1e38]/70 shadow-[0_0_35px_rgba(255,30,56,0.4)] flex items-center justify-center backdrop-blur-md bg-black/40">
            {/* Loupe Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#ff1e38]/40" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#ff1e38]/40" />
            <div className="w-12 h-12 rounded-full border border-[#ff1e38]/50 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#ff1e38] rounded-full shadow-[0_0_10px_#ff1e38]" />
            </div>

            {/* Live Disassembly Peek & Metrics attached to lens */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/90 border border-[#ff1e38]/60 mono text-[0.58rem] text-[#2ee59d] whitespace-nowrap shadow-lg">
              LATENCY &lt; 16ms // 120 FPS VSYNC
            </div>

            {/* Inspection Lens Hex Code Snippet */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-white/20 mono text-[0.52rem] text-[#ff1e38] whitespace-nowrap">
              0x7FFE_{activeSlab.id.slice(0, 4).toUpperCase()} // X-RAY
            </div>
          </div>
        </motion.div>
      )}

      {/* STICKY STAGE WITH FLOATING TRANSLUCENT FROSTED SAPPHIRE SLABS */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none z-20 py-20 px-4 sm:px-8">
        <div className="relative w-full max-w-6xl h-full flex flex-col lg:flex-row items-center justify-between gap-8 my-auto">
          {/* Left: Monolithic Sapphire Crystal Slab */}
          <div className="w-full lg:w-1/2 max-w-xl pointer-events-auto">
            <motion.div
              key={activeSlab.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
              className="relative p-6 sm:p-10 rounded-3xl bg-black/80 backdrop-blur-3xl border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden"
              style={{
                boxShadow:
                  '0 25px 50px -12px rgba(0,0,0,0.95), inset 0 0 30px rgba(255,30,56,0.12)',
              }}
            >
              {/* Internal Crimson Laser Caustic Edge */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff1e38] to-transparent shadow-[0_0_15px_#ff1e38]" />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff1e38] to-transparent" />

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#ff1e38]/20 border border-[#ff1e38]/60 flex items-center justify-center mono text-xs font-bold text-[#ff1e38]">
                    {activeSlab.number}
                  </span>
                  <span className="mono text-[0.66rem] text-[#b8b3a8]">
                    {activeSlab.category[language]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mono text-[0.62rem] text-[#2ee59d]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ee59d] animate-pulse" />
                  PRISM REFRAC
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#f5f3ef] mt-4 font-display">
                {activeSlab.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#ff1e38] mt-1 font-mono">
                {activeSlab.tagline[language]}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#b8b3a8] mt-3 leading-relaxed font-sans">
                {activeSlab.description[language]}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/10">
                {activeSlab.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]"
                  >
                    <span className="mono text-[0.55rem] text-[#726d64] block">
                      {m.label}
                    </span>
                    <span className="mono text-[0.68rem] sm:text-xs font-bold text-[#f5f3ef] mt-0.5 block truncate">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-white/10">
                <div className="flex flex-wrap items-center gap-1.5">
                  {activeSlab.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 mono text-[0.6rem] text-[#b8b3a8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {activeSlab.liveUrl && (
                    <a
                      href={activeSlab.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ff1e38] hover:bg-[#ff2d46] text-white mono text-[0.7rem] font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,30,56,0.4)]"
                    >
                      <span>{language === 'fr' ? 'Accéder' : 'Launch'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {activeSlab.githubUrl && (
                    <a
                      href={activeSlab.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#f5f3ef] mono text-[0.7rem] tracking-wider transition-all"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}

                  {activeSlab.id === 'ares-core' && (
                    <button
                      onClick={copyEmail}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.08] hover:bg-[#ff1e38]/20 border border-white/20 hover:border-[#ff1e38] text-[#f5f3ef] mono text-[0.7rem] tracking-wider transition-all cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#2ee59d]" />
                          <span className="text-[#2ee59d]">
                            {language === 'fr' ? 'Copié !' : 'Copied!'}
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

          {/* Right: X-Ray Disassembly Terminal Inspection Window */}
          <div className="w-full lg:w-1/2 max-w-xl pointer-events-auto">
            <div className="p-5 sm:p-7 rounded-3xl bg-black/85 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-[#ff1e38]" />
                  <span className="mono text-[0.66rem] font-bold text-[#f5f3ef]">
                    X-RAY INSPECTOR // MEMORY REVEAL
                  </span>
                </div>
                <div className="mono text-[0.6rem] text-[#2ee59d]">
                  LATENCY &lt; 16ms
                </div>
              </div>

              {/* Code Disassembly Window */}
              <div className="mt-4 p-4 rounded-xl bg-black/90 border border-white/10 overflow-x-auto no-scrollbar font-mono text-[0.68rem] leading-relaxed text-[#c2bdb3]">
                <pre className="text-white/80 whitespace-pre">
                  <code>{activeSlab.disassemblyCode}</code>
                </pre>
              </div>

              {/* Telemetry Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between mono text-[0.6rem] text-[#726d64]">
                <span>HEAP: 4.8MB // GC: 0.0ms</span>
                <span className="text-[#ff1e38]">SPECTRAL REFRACTION: ACTIVE</span>
              </div>
            </div>

            {/* Quick Slabs Selector */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-2">
                {slabs.map((slab, i) => (
                  <button
                    key={slab.id}
                    onClick={() => setActiveSlabIndex(i)}
                    className={`px-3 py-1 rounded-full mono text-[0.62rem] transition-all cursor-pointer ${
                      activeSlabIndex === i
                        ? 'bg-[#ff1e38] text-white font-bold shadow-[0_0_12px_rgba(255,30,56,0.6)]'
                        : 'bg-white/5 hover:bg-white/10 text-white/50'
                    }`}
                  >
                    SLAB {slab.number}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 mono text-[0.6rem] text-[#726d64]">
                <span>{language === 'fr' ? 'Défilez pour naviguer' : 'Scroll to explore'}</span>
                <ChevronDown className="w-3 h-3 text-[#ff1e38] animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 SCROLL SECTIONS FOR PROGRESS TRACKING */}
      <div className="relative z-0 pointer-events-none">
        {slabs.map((slab) => (
          <section
            key={slab.id}
            className="h-screen w-full flex items-end justify-center pb-24 px-6"
            aria-label={slab.title}
          >
            <div className="mono text-[0.66rem] text-white/10 uppercase tracking-widest select-none">
              // LIQUID SAPPHIRE SLAB {slab.number} — {slab.id}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
