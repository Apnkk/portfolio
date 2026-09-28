import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Track } from '../utils/audioSynth';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Music2 
} from 'lucide-react';

interface FullscreenLyricsProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTrack: Track;
  currentTime: number;
  duration: number;
  currentLyricIndex: number;
  onSeek: (time: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

// Track-specific ambient mesh gradient color palettes
const TRACK_THEMES: Record<
  string,
  {
    bgDark: string;
    orb1: string;
    orb2: string;
    orb3: string;
    orb4: string;
    accent: string;
  }
> = {
  borderline: {
    bgDark: '#120705',
    orb1: 'rgba(220, 38, 38, 0.75)',    // crimson flame
    orb2: 'rgba(234, 88, 12, 0.70)',    // burnt orange
    orb3: 'rgba(180, 83, 9, 0.65)',     // terracotta amber
    orb4: 'rgba(254, 215, 170, 0.40)',  // warm sand glow
    accent: '#f59e0b',
  },
  'jane-hoodtrap': {
    bgDark: '#0e0717',
    orb1: 'rgba(168, 85, 247, 0.75)',   // deep violet
    orb2: 'rgba(192, 38, 211, 0.65)',   // electric magenta
    orb3: 'rgba(79, 70, 229, 0.70)',    // indigo
    orb4: 'rgba(233, 213, 255, 0.35)',  // lilac glow
    accent: '#a855f7',
  },
  'ring-ding-dong': {
    bgDark: '#04110b',
    orb1: 'rgba(5, 150, 105, 0.75)',    // emerald
    orb2: 'rgba(16, 185, 129, 0.65)',   // jade
    orb3: 'rgba(217, 119, 6, 0.60)',    // golden amber
    orb4: 'rgba(110, 231, 183, 0.35)',  // mint glow
    accent: '#10b981',
  },
};

export const FullscreenLyrics = ({
  isOpen,
  onClose,
  isPlaying,
  onTogglePlay,
  currentTrack,
  currentTime,
  duration,
  currentLyricIndex,
  onSeek,
  onNext,
  onPrevious,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: FullscreenLyricsProps) => {
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

  const theme = TRACK_THEMES[currentTrack.id] || TRACK_THEMES.borderline;

  // Format mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const durationSec = duration > 0 ? duration : 180;
  const progressRatio = durationSec > 0 ? Math.min(1, currentTime / durationSec) : 0;

  // Smooth auto-scroll keeping active lyric centered
  useEffect(() => {
    if (isOpen && activeLyricRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isOpen, currentLyricIndex]);

  // Keyboard shortcut: Escape to close, Space to toggle play
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        onTogglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onTogglePlay]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * durationSec);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Paroles en direct : ${currentTrack.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[1000] flex flex-col justify-between overflow-hidden bg-black select-none pointer-events-auto"
        >
          {/* Animated Atmospheric Fluid Mesh Gradient Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {/* Deep dark tone base */}
            <div
              className="absolute inset-0 transition-colors duration-1000"
              style={{ background: theme.bgDark }}
            />

            {/* Orb 1: Top-Right Flame (Rich Terracotta / Crimson) */}
            <motion.div
              animate={{
                x: [0, 40, -30, 0],
                y: [0, -40, 30, 0],
                scale: [1, 1.15, 0.95, 1],
              }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-24 -right-24 w-[65vw] h-[65vw] rounded-full blur-[100px] sm:blur-[130px] opacity-80 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb1 }}
            />

            {/* Orb 2: Center-Right Deep Flame Glow */}
            <motion.div
              animate={{
                x: [0, -50, 40, 0],
                y: [0, 35, -45, 0],
                scale: [1, 0.92, 1.08, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 right-1/6 w-[55vw] h-[55vw] rounded-full blur-[110px] sm:blur-[140px] opacity-75 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb2 }}
            />

            {/* Orb 3: Bottom-Center Warm Terracotta / Sand Pool */}
            <motion.div
              animate={{
                x: [0, 45, -40, 0],
                y: [0, -25, 30, 0],
                scale: [1, 1.18, 0.96, 1],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-28 left-1/4 w-[60vw] h-[60vw] rounded-full blur-[120px] sm:blur-[150px] opacity-70 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb3 }}
            />

            {/* Orb 4: Top-Left Ambient Sand / Slate Light */}
            <motion.div
              animate={{
                x: [0, -35, 35, 0],
                y: [0, 45, -25, 0],
                scale: [1, 1.06, 0.94, 1],
              }}
              transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-16 -left-16 w-[45vw] h-[45vw] rounded-full blur-[90px] sm:blur-[120px] opacity-55 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb4 }}
            />

            {/* Dark Vignette Overlay for Crisp Typography Contrast */}
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[10px]" />
            <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%]" />
          </div>

          {/* Top Bar Header */}
          <header className="relative z-20 flex items-center justify-between w-full px-6 sm:px-12 md:px-20 pt-6 sm:pt-10 select-none">
            {/* Left: Album cover thumbnail + Title + Artist + Ring detail */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-2xl border border-white/20 shrink-0">
                {currentTrack.coverImage ? (
                  <img
                    src={currentTrack.coverImage}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <Music2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <h2 className="font-display font-bold text-white text-base sm:text-lg tracking-tight leading-tight">
                  {currentTrack.title}
                </h2>
                <p className="font-mono text-[0.68rem] sm:text-xs text-white/70 uppercase tracking-widest leading-none mt-1">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Amber Dot & Concentric Ring Detail (Matches User Reference Image) */}
              <div className="hidden sm:flex items-center gap-2 ml-4">
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                <span className="w-5 h-5 rounded-full border border-amber-500/40" />
              </div>
            </div>

            {/* Right: Minimalist Frosted Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white/80 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
              aria-label="Fermer les paroles en plein écran"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </header>

          {/* Main Lyrics Viewport (Apple Music Sing / Spotify Lyrics) */}
          <main className="relative z-20 flex-1 flex flex-col justify-center overflow-hidden max-w-4xl w-full mx-auto px-6 sm:px-12 md:px-20 lg:px-24">
            <div
              ref={containerRef}
              className="h-[58vh] sm:h-[64vh] overflow-y-auto scroll-smooth py-20 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
              }}
            >
              {/* Intro preamble dots */}
              <div className="text-white/40 font-mono text-2xl sm:text-3xl tracking-[0.3em] py-4 select-none">
                • • •
              </div>

              {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                currentTrack.lyrics.map((line, idx) => {
                  const isCurrent = idx === currentLyricIndex;

                  return (
                    <motion.div
                      key={idx}
                      ref={isCurrent ? activeLyricRef : null}
                      onClick={() => onSeek(line.time)}
                      className={`transition-all duration-300 cursor-pointer select-none origin-left ${
                        isCurrent
                          ? 'text-white font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] leading-[1.18] tracking-tight drop-shadow-[0_4px_30px_rgba(255,255,255,0.45)] py-2.5 sm:py-3.5 scale-100 opacity-100'
                          : 'text-white/30 hover:text-white/75 font-display font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.22] tracking-tight py-2 sm:py-3 blur-[0.4px] hover:blur-0 opacity-40 hover:opacity-90'
                      }`}
                    >
                      <span>{line.text}</span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-24 text-center text-white/50 font-mono text-sm">
                  Paroles indisponibles pour ce morceau.
                </div>
              )}
            </div>
          </main>

          {/* Bottom Playback Control Bar (Matches User Reference Image) */}
          <footer className="relative z-20 w-full max-w-xl sm:max-w-2xl mx-auto px-6 pb-8 sm:pb-12 pt-2 flex flex-col items-center gap-3.5 select-none">
            {/* Progress Scrubber Bar */}
            <div className="w-full flex items-center gap-3">
              <span className="font-mono text-xs text-white/70 w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>

              <div
                onClick={handleSeek}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoverRatio((e.clientX - rect.left) / rect.width);
                }}
                onMouseLeave={() => setHoverRatio(null)}
                className="relative flex-1 h-1.5 hover:h-2.5 bg-white/20 rounded-full transition-all cursor-pointer overflow-hidden group"
              >
                {/* Hover preview ghost bar */}
                {hoverRatio !== null && (
                  <div
                    className="absolute inset-y-0 left-0 bg-white/30 pointer-events-none"
                    style={{ width: `${hoverRatio * 100}%` }}
                  />
                )}
                {/* Active progress fill */}
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-100 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                  style={{ width: `${progressRatio * 100}%` }}
                />
              </div>

              <span className="font-mono text-xs text-white/70 w-10 text-left tabular-nums">
                {durationSec > 0 ? formatTime(durationSec) : currentTrack.defaultDuration}
              </span>
            </div>

            {/* Playback Action Buttons */}
            <div className="flex items-center justify-center gap-6 w-full relative">
              {/* Skip Previous */}
              <button
                type="button"
                onClick={onPrevious}
                className="p-2 text-white/80 hover:text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                aria-label="Piste précédente"
              >
                <SkipBack className="w-5 h-5 fill-white/20" />
              </button>

              {/* Big White Circular Play/Pause Button */}
              <button
                type="button"
                onClick={onTogglePlay}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_4px_25px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-black text-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                )}
              </button>

              {/* Skip Next */}
              <button
                type="button"
                onClick={onNext}
                className="p-2 text-white/80 hover:text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                aria-label="Piste suivante"
              >
                <SkipForward className="w-5 h-5 fill-white/20" />
              </button>

              {/* Volume Slider (Right on Desktop) */}
              <div className="hidden sm:flex items-center gap-2 absolute right-0">
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.02}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-white/20 accent-white rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
