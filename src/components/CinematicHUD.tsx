import { useState } from 'react';
import { useScroll, useMotionValueEvent, useSpring } from 'framer-motion';

export const CinematicHUD = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  const [sceneInfo, setSceneInfo] = useState({
    num: '01',
    name: 'OVERTURE // HERO',
    timecode: '00:00:00:00',
    percent: 0,
  });

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const percent = Math.min(100, Math.max(0, Math.round(latest * 100)));

    // Virtual 120-second cinematic showreel timecode calculation (24 fps)
    const totalFrames = Math.round(latest * 120 * 24);
    const frames = totalFrames % 24;
    const totalSeconds = Math.floor(totalFrames / 24);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    const timecode = `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;

    let num = '01';
    let name = 'OVERTURE // HERO';

    if (latest >= 0.12 && latest < 0.42) {
      num = '02';
      name = 'SHOWREEL // FEATURED WORK';
    } else if (latest >= 0.42 && latest < 0.58) {
      num = '03';
      name = 'SYNTHESIS // OS PREVIEW';
    } else if (latest >= 0.58 && latest < 0.72) {
      num = '04';
      name = 'MATRIX // TECHNICAL STACK';
    } else if (latest >= 0.72 && latest < 0.86) {
      num = '05';
      name = 'PROTOCOL // METHODOLOGY';
    } else if (latest >= 0.86 && latest < 0.94) {
      num = '06';
      name = 'BIOGRAPHY // ABOUT ARES';
    } else if (latest >= 0.94) {
      num = '07';
      name = 'TRANSMISSION // CONTACT';
    }

    setSceneInfo({ num, name, timecode, percent });
  });

  return (
    <>
      {/* 4 Corner Viewfinder Camera Brackets (Cinema ARRI/RED Monitor Aesthetic) */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none z-[45] select-none p-5" aria-hidden="true">
        {/* Top-Left Bracket */}
        <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-[#ff2a3b]/40 rounded-tl-sm transition-opacity duration-300" />
        {/* Top-Right Bracket */}
        <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-[#ff2a3b]/40 rounded-tr-sm transition-opacity duration-300" />
        {/* Bottom-Left Bracket */}
        <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-[#ff2a3b]/40 rounded-bl-sm transition-opacity duration-300" />
        {/* Bottom-Right Bracket */}
        <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-[#ff2a3b]/40 rounded-br-sm transition-opacity duration-300" />

        {/* Center Crosshairs on Edges */}
        <div className="absolute top-1/2 left-3 -translate-y-1/2 font-mono text-[9px] text-white/20 tracking-tighter">
          +
        </div>
        <div className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[9px] text-white/20 tracking-tighter">
          +
        </div>

        {/* Subtle Cinema Scope Specs (Bottom Left) */}
        <div className="absolute bottom-6 left-14 font-mono text-[9px] text-[#797368]/60 tracking-widest uppercase">
          RAW 4K · 2.39:1 · 24 FPS · SHUTTER 180°
        </div>
      </div>

      {/* Floating Director Telemetry HUD Strip (Top Right under Navbar) */}
      <div
        className="hidden md:flex fixed top-[72px] right-6 z-40 items-center gap-3.5 px-3.5 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-md font-mono text-[10px] tracking-wider text-[#b8b3a8] select-none pointer-events-none shadow-[0_8px_32px_rgba(0,0,0,0.85)]"
        aria-hidden="true"
      >
        {/* Blinking REC beacon */}
        <div className="flex items-center gap-1.5 text-[#ff2a3b] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#ff2a3b] animate-ping" />
          <span>REC</span>
        </div>

        <span className="text-white/20">|</span>

        {/* Live Running Timecode */}
        <span className="text-[#f4f2ee] font-medium tracking-widest min-w-[78px]">
          [{sceneInfo.timecode}]
        </span>

        <span className="text-white/20">|</span>

        {/* Current Active Scene & Percent */}
        <div className="flex items-center gap-2">
          <span className="text-[#ff4d5a] font-semibold">{sceneInfo.num}</span>
          <span className="text-[#f4f2ee] uppercase max-w-[170px] truncate">{sceneInfo.name}</span>
          <span className="text-[#797368] font-light">({sceneInfo.percent}%)</span>
        </div>
      </div>
    </>
  );
};
