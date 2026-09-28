import { useEffect, useRef, useState, useCallback } from 'react';
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

// Deep, velvet-like OLED ambient mesh gradient palettes (Clean & Minimalist)
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
    bgDark: '#0e0503',
    orb1: 'rgba(185, 28, 28, 0.45)',   // deep wine red
    orb2: 'rgba(194, 65, 12, 0.40)',   // warm terracotta
    orb3: 'rgba(146, 64, 14, 0.35)',   // burnt amber
    orb4: 'rgba(253, 186, 116, 0.20)', // soft sand glow
    accent: '#f59e0b',
  },
  'jane-hoodtrap': {
    bgDark: '#090310',
    orb1: 'rgba(126, 34, 206, 0.45)',  // deep royal violet
    orb2: 'rgba(147, 51, 234, 0.38)',  // electric magenta
    orb3: 'rgba(67, 56, 202, 0.35)',   // midnight indigo
    orb4: 'rgba(216, 180, 254, 0.20)', // soft lilac glow
    accent: '#a855f7',
  },
  'ring-ding-dong': {
    bgDark: '#020d06',
    orb1: 'rgba(5, 120, 85, 0.40)',    // deep forest emerald
    orb2: 'rgba(4, 90, 65, 0.35)',     // dark pine jade
    orb3: 'rgba(161, 98, 7, 0.28)',    // subtle golden amber
    orb4: 'rgba(16, 185, 129, 0.20)',  // soft emerald aura
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
  const containerRef = useRef<HTMLDivElement>(null);
  const lyricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

  // Position and height of the single unified gliding indicator bar
  const [indicatorY, setIndicatorY] = useState(0);
  const [indicatorHeight, setIndicatorHeight] = useState(32);
  const [indicatorVisible, setIndicatorVisible] = useState(false);

  // Anti-hijack: pause automatic follow ONLY when the user physically wheels or touches
  const isUserInteractingRef = useRef(false);
  const userInteractionTimeoutRef = useRef<number | null>(null);

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

  // Direct container scroll computation to guarantee centering
  const scrollToActiveLyric = useCallback((smooth = true) => {
    const container = containerRef.current;
    const activeEl = lyricRefs.current[currentLyricIndex];
    if (!container || !activeEl) return;

    const containerHeight = container.clientHeight;
    const activeTop = activeEl.offsetTop;
    const activeHeight = activeEl.offsetHeight;

    // Center the active element precisely in the view
    const targetScroll = Math.max(0, activeTop - (containerHeight / 2) + (activeHeight / 2));

    container.scrollTo({
      top: targetScroll,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [currentLyricIndex]);

  // Update gliding bar coordinates whenever active lyric or window size changes
  useEffect(() => {
    if (!isOpen) return;

    const updateIndicator = () => {
      const activeEl = lyricRefs.current[currentLyricIndex];
      if (activeEl) {
        setIndicatorY(activeEl.offsetTop + 6);
        setIndicatorHeight(Math.max(28, activeEl.offsetHeight - 12));
        setIndicatorVisible(true);
      } else {
        setIndicatorVisible(false);
      }
    };

    updateIndicator();
    const timer = window.setTimeout(updateIndicator, 40);
    window.addEventListener('resize', updateIndicator);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [isOpen, currentLyricIndex, currentTrack]);

  // Handle genuine user wheel/touch interaction
  const handleUserWheelOrTouch = () => {
    isUserInteractingRef.current = true;
    if (userInteractionTimeoutRef.current) {
      window.clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = window.setTimeout(() => {
      isUserInteractingRef.current = false;
      scrollToActiveLyric(true);
    }, 2800);
  };

  // Follow active lyric on index change (unless actively scrolling)
  useEffect(() => {
    if (!isOpen) return;
    if (isUserInteractingRef.current) return;

    const timer = window.setTimeout(() => {
      scrollToActiveLyric(true);
    }, 30);

    return () => window.clearTimeout(timer);
  }, [isOpen, currentLyricIndex, scrollToActiveLyric]);

  // Center active lyric immediately on modal open
  useEffect(() => {
    if (isOpen) {
      isUserInteractingRef.current = false;
      const timer = window.setTimeout(() => {
        scrollToActiveLyric(false);
      }, 60);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, scrollToActiveLyric]);

  // Pause Lenis smooth scroll while fullscreen lyrics is open to avoid conflicts
  useEffect(() => {
    if (!isOpen) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    return () => {
      lenis?.start();
    };
  }, [isOpen]);

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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (userInteractionTimeoutRef.current) {
        window.clearTimeout(userInteractionTimeoutRef.current);
      }
    };
  }, [isOpen, onClose, onTogglePlay]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * durationSec);
  };

  const handleLyricClick = (time: number) => {
    isUserInteractingRef.current = false;
    if (userInteractionTimeoutRef.current) {
      window.clearTimeout(userInteractionTimeoutRef.current);
    }
    onSeek(time);
    window.setTimeout(() => scrollToActiveLyric(true), 40);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          data-lenis-prevent
          aria-label={`Paroles en direct : ${currentTrack.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[1000] flex flex-col justify-between overflow-hidden bg-black select-none pointer-events-auto"
        >
          {/* Animated Atmospheric Fluid Mesh Gradient Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <div
              className="absolute inset-0 transition-colors duration-1000"
              style={{ background: theme.bgDark }}
            />

            {/* Orb 1: Top-Right Flame Aura */}
            <motion.div
              animate={{
                x: [0, 40, -30, 0],
                y: [0, -35, 25, 0],
                scale: [1, 1.12, 0.96, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-32 -right-32 w-[70vw] h-[70vw] rounded-full blur-[140px] sm:blur-[200px] opacity-70 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb1 }}
            />

            {/* Orb 2: Center-Right Deep Flame Glow */}
            <motion.div
              animate={{
                x: [0, -45, 35, 0],
                y: [0, 30, -40, 0],
                scale: [1, 0.94, 1.06, 1],
              }}
              transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 right-1/6 w-[60vw] h-[60vw] rounded-full blur-[150px] sm:blur-[220px] opacity-65 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb2 }}
            />

            {/* Orb 3: Bottom-Center Warm Glow Pool */}
            <motion.div
              animate={{
                x: [0, 40, -35, 0],
                y: [0, -20, 25, 0],
                scale: [1, 1.15, 0.98, 1],
              }}
              transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-36 left-1/4 w-[65vw] h-[65vw] rounded-full blur-[150px] sm:blur-[220px] opacity-60 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb3 }}
            />

            {/* Orb 4: Top-Left Ambient Light */}
            <motion.div
              animate={{
                x: [0, -30, 30, 0],
                y: [0, 40, -20, 0],
                scale: [1, 1.05, 0.95, 1],
              }}
              transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-20 -left-20 w-[50vw] h-[50vw] rounded-full blur-[120px] sm:blur-[180px] opacity-50 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb4 }}
            />

            <div className="absolute inset-0 bg-black/40 backdrop-blur-[8px]" />
            <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%]" />
          </div>

          {/* Top Bar Header */}
          <header className="relative z-20 flex items-center justify-between w-full px-6 sm:px-12 md:px-16 lg:px-24 pt-6 sm:pt-10 select-none">
            {/* Left: Track Info & Live Sync Pill */}
            <div className="flex items-center gap-3.5">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-2xl border border-white/15 shrink-0">
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
                <p className="font-mono text-[0.68rem] sm:text-xs text-white/60 uppercase tracking-widest leading-none mt-1">
                  {currentTrack.artist}
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] backdrop-blur-md ml-3">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse shadow-sm"
                  style={{ background: theme.accent }}
                />
                <span className="font-mono text-[0.62rem] text-white/70 uppercase tracking-wider">
                  Live Sync
                </span>
              </div>
            </div>

            {/* Right: Minimalist Close Button */}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              aria-label="Fermer les paroles en plein écran"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </header>

          {/* Main Lyrics Viewport (Broadened & Centered Scroll Tracking) */}
          <main className="relative z-20 flex-1 flex flex-col justify-center overflow-hidden max-w-5xl lg:max-w-6xl xl:max-w-7xl w-full mx-auto px-6 sm:px-12 md:px-16 lg:px-24">
            <div
              ref={containerRef}
              onWheel={handleUserWheelOrTouch}
              onTouchMove={handleUserWheelOrTouch}
              data-lenis-prevent
              className="h-[58vh] sm:h-[64vh] overflow-y-auto scroll-smooth py-24 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
              }}
            >
              {/* Lyrics List Container with Single True Gliding Bar */}
              <div className="relative pl-6 sm:pl-8 select-none">
                {/* The Single True Gliding Indicator Bar (Physically moves, 0 Lag, 0 Stray) */}
                <motion.div
                  initial={false}
                  animate={{
                    y: indicatorY,
                    height: indicatorHeight,
                    opacity: indicatorVisible ? 1 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    visualDuration: 0.32,
                    bounce: 0.12,
                  }}
                  className="absolute left-0 w-1.5 rounded-full pointer-events-none shadow-[0_0_18px_rgba(255,255,255,0.85)] z-10"
                  style={{ background: theme.accent }}
                />

                {/* Intro preamble dots */}
                <div className="text-white/35 font-mono text-2xl sm:text-3xl tracking-[0.3em] py-4">
                  • • •
                </div>

                {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                  currentTrack.lyrics.map((line, idx) => {
                    const isCurrent = idx === currentLyricIndex;

                    return (
                      <motion.div
                        key={idx}
                        ref={(el) => {
                          lyricRefs.current[idx] = el;
                        }}
                        onClick={() => handleLyricClick(line.time)}
                        initial={false}
                        animate={{
                          scale: isCurrent ? 1.02 : 0.98,
                          opacity: isCurrent ? 1 : 0.28,
                          x: isCurrent ? 8 : 0,
                          filter: isCurrent ? 'blur(0px)' : 'blur(0.5px)',
                        }}
                        whileHover={{
                          scale: isCurrent ? 1.02 : 1.0,
                          opacity: isCurrent ? 1 : 0.75,
                          filter: 'blur(0px)',
                          x: isCurrent ? 8 : 4,
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: 'spring',
                          visualDuration: 0.35,
                          bounce: 0.12,
                        }}
                        className={`py-3.5 sm:py-4.5 cursor-pointer select-none origin-left transition-colors ${
                          isCurrent ? 'text-white' : 'text-white/60'
                        }`}
                      >
                        {/* Lyric Text */}
                        <span
                          className={`font-display font-black tracking-tight leading-[1.24] text-2xl sm:text-3xl md:text-4xl lg:text-[2.85rem] xl:text-[3.35rem] transition-all duration-300 break-normal ${
                            isCurrent
                              ? 'text-white drop-shadow-[0_4px_35px_rgba(255,255,255,0.45)]'
                              : 'text-white/40 hover:text-white/80'
                          }`}
                        >
                          {line.text}
                        </span>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="py-24 text-center text-white/50 font-mono text-sm">
                    Paroles indisponibles pour ce morceau.
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Bottom Playback Control Bar */}
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
                {hoverRatio !== null && (
                  <div
                    className="absolute inset-y-0 left-0 bg-white/30 pointer-events-none"
                    style={{ width: `${hoverRatio * 100}%` }}
                  />
                )}
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
              <motion.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
                onClick={onPrevious}
                className="p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Piste précédente"
              >
                <SkipBack className="w-5 h-5 fill-white/20" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.2 }}
                onClick={onTogglePlay}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_4px_25px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-black text-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black text-black ml-0.5" />
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
                onClick={onNext}
                className="p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Piste suivante"
              >
                <SkipForward className="w-5 h-5 fill-white/20" />
              </motion.button>

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
