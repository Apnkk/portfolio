import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Track } from '../utils/audioSynth';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Music2,
  Sparkles
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

// Deep, velvet-like OLED ambient mesh gradient palettes (Pure minimalism)
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
    bgDark: '#0a0302',
    orb1: 'rgba(239, 68, 68, 0.40)',   // vibrant crimson
    orb2: 'rgba(249, 115, 22, 0.35)',  // amber flame
    orb3: 'rgba(185, 28, 28, 0.30)',   // deep wine
    orb4: 'rgba(251, 146, 60, 0.20)',  // warm peach aura
    accent: '#ff1e38',
  },
  'jane-hoodtrap': {
    bgDark: '#07020d',
    orb1: 'rgba(168, 85, 247, 0.42)',  // electric violet
    orb2: 'rgba(236, 72, 153, 0.35)',  // neon magenta
    orb3: 'rgba(99, 102, 241, 0.30)',  // deep indigo
    orb4: 'rgba(192, 132, 252, 0.20)', // soft lilac
    accent: '#a855f7',
  },
  'ring-ding-dong': {
    bgDark: '#010a05',
    orb1: 'rgba(16, 185, 129, 0.40)',  // emerald
    orb2: 'rgba(20, 184, 166, 0.35)',  // teal
    orb3: 'rgba(5, 150, 105, 0.30)',   // forest
    orb4: 'rgba(110, 231, 183, 0.20)', // mint glow
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
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const lyricRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

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

  // Direct container scroll computation to guarantee optical centering
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
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[1000] flex flex-col justify-between overflow-hidden bg-black select-none pointer-events-auto"
        >
          {/* Atmospheric Fluid Mesh Gradient Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <div
              className="absolute inset-0 transition-colors duration-1000"
              style={{ background: theme.bgDark }}
            />

            {/* Orb 1: Pulsing Flame Aura */}
            <motion.div
              animate={shouldReduceMotion ? undefined : {
                x: [0, 60, -40, 0],
                y: [0, -50, 40, 0],
                scale: [1, 1.25, 0.9, 1],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-32 -right-32 w-[75vw] h-[75vw] rounded-full blur-[140px] sm:blur-[220px] opacity-75 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb1 }}
            />

            {/* Orb 2: Deep Core Glow */}
            <motion.div
              animate={shouldReduceMotion ? undefined : {
                x: [0, -60, 50, 0],
                y: [0, 45, -55, 0],
                scale: [1, 0.88, 1.15, 1],
              }}
              transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 right-1/6 w-[65vw] h-[65vw] rounded-full blur-[150px] sm:blur-[240px] opacity-70 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb2 }}
            />

            {/* Orb 3: Bottom Pool */}
            <motion.div
              animate={shouldReduceMotion ? undefined : {
                x: [0, 50, -45, 0],
                y: [0, -35, 30, 0],
                scale: [1, 1.2, 0.95, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-36 left-1/4 w-[70vw] h-[70vw] rounded-full blur-[160px] sm:blur-[240px] opacity-65 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb3 }}
            />

            {/* Orb 4: Ambient Aura */}
            <motion.div
              animate={shouldReduceMotion ? undefined : {
                x: [0, -40, 40, 0],
                y: [0, 50, -30, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-20 -left-20 w-[55vw] h-[55vw] rounded-full blur-[130px] sm:blur-[200px] opacity-55 mix-blend-screen transition-colors duration-1000"
              style={{ background: theme.orb4 }}
            />

            {/* Contrast Overlay & Vignette */}
            <div className="absolute inset-0 bg-black/45 backdrop-blur-[12px]" />
            <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_20%,rgba(0,0,0,0.85)_100%]" />
          </div>

          {/* Top Bar Header with Spinning Vinyl Artwork & Live Equalizer */}
          <header className="relative z-20 flex items-center justify-between w-full px-6 sm:px-12 md:px-16 lg:px-24 pt-6 sm:pt-10 select-none">
            {/* Left: Track Info + Spinning Vinyl + Equalizer */}
            <div className="flex items-center gap-4">
              {/* Spinning Vinyl Record Container */}
              <div className="relative flex items-center">
                {/* Vinyl Disc Peaking Out */}
                <motion.div
                  animate={isPlaying && !shouldReduceMotion ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#111] border border-white/20 shadow-2xl flex items-center justify-center -mr-5 pointer-events-none relative z-0"
                  style={{
                    boxShadow: '0 0 15px rgba(0,0,0,0.8), inset 0 0 6px rgba(255,255,255,0.15)',
                  }}
                >
                  <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  </div>
                </motion.div>

                {/* Album Cover Sleeve */}
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-2xl border border-white/20 shrink-0 z-10 bg-black">
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
              </div>

              {/* Title, Artist & Live Spectrum Bars */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-display font-bold text-white text-base sm:text-lg tracking-tight leading-tight">
                    {currentTrack.title}
                  </h2>

                  {/* Live Equalizer Animation */}
                  <div className="flex items-end gap-1 h-3.5" aria-hidden="true">
                    {[0.5, 1, 0.6, 0.85, 0.4].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={
                          isPlaying && !shouldReduceMotion
                            ? { height: ['25%', `${h * 100}%`, '30%'] }
                            : { height: '25%' }
                        }
                        transition={{
                          duration: 0.4 + i * 0.08,
                          repeat: Infinity,
                          repeatType: 'mirror',
                          ease: 'easeInOut',
                        }}
                        className="w-1 rounded-full shadow-[0_0_6px_currentColor]"
                        style={{ background: theme.accent, color: theme.accent }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono text-[0.68rem] sm:text-xs text-white/60 uppercase tracking-widest leading-none">
                    {currentTrack.artist}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="font-mono text-[0.62rem] text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                    Hi-Fi Master
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Minimalist Close Button with spring hover */}
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

          {/* Main Lyrics Viewport with Pure Apple Music Typography */}
          <main className="relative z-20 flex-1 flex flex-col justify-center overflow-hidden w-full max-w-[94vw] sm:max-w-[90vw] md:max-w-5xl lg:max-w-6xl xl:max-w-[1380px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-10 md:px-14 lg:px-16 xl:px-20">
            <div
              ref={containerRef}
              onWheel={handleUserWheelOrTouch}
              onTouchMove={handleUserWheelOrTouch}
              data-lenis-prevent
              className="h-[62vh] sm:h-[68vh] lg:h-[72vh] overflow-y-auto scroll-smooth py-28 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
              }}
            >
              {/* Pure Typography Lyrics List (No sidebar, no vertical bar) */}
              <div className="relative select-none">
                {/* Subtle synchronized tag */}
                <div className="flex items-center gap-2 py-3 mb-4 select-none opacity-60">
                  <Sparkles className="w-3.5 h-3.5 text-white/80" />
                  <span className="font-mono text-[0.68rem] text-white/70 uppercase tracking-widest">
                    Paroles synchronisées en direct
                  </span>
                </div>

                {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                  currentTrack.lyrics.map((line, idx) => {
                    const isCurrent = idx === currentLyricIndex;
                    const distance = Math.abs(idx - currentLyricIndex);

                    // Refined Apple Music depth of field & hierarchy
                    let targetOpacity = 0.08;
                    let targetBlur = 'blur(3.5px)';
                    let targetScale = 0.92;

                    if (isCurrent) {
                      targetOpacity = 1;
                      targetBlur = 'blur(0px)';
                      targetScale = 1.04;
                    } else if (distance === 1) {
                      targetOpacity = 0.38;
                      targetBlur = 'blur(0.8px)';
                      targetScale = 0.98;
                    } else if (distance === 2) {
                      targetOpacity = 0.18;
                      targetBlur = 'blur(2px)';
                      targetScale = 0.95;
                    }

                    return (
                      <motion.div
                        key={idx}
                        ref={(el) => {
                          lyricRefs.current[idx] = el;
                        }}
                        onClick={() => handleLyricClick(line.time)}
                        initial={false}
                        animate={{
                          scale: targetScale,
                          opacity: targetOpacity,
                          filter: targetBlur,
                        }}
                        whileHover={{
                          scale: isCurrent ? 1.04 : 1.015,
                          opacity: isCurrent ? 1 : 0.85,
                          filter: 'blur(0px)',
                        }}
                        whileTap={{ scale: 0.985 }}
                        transition={{
                          type: 'spring',
                          visualDuration: 0.35,
                          bounce: 0.1,
                        }}
                        className={`py-4 sm:py-5 lg:py-6 cursor-pointer select-none origin-left transition-colors ${
                          isCurrent ? 'text-white' : 'text-white/40'
                        }`}
                      >
                        {/* Pure, Sharp & Prestigious Apple Music Typography */}
                        <p
                          className={`font-display font-extrabold tracking-tight leading-[1.22] text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] 2xl:text-[3.75rem] transition-all duration-300 break-normal ${
                            isCurrent
                              ? 'text-white drop-shadow-[0_2px_24px_rgba(255,255,255,0.45)]'
                              : 'text-white/40 hover:text-white/80'
                          }`}
                          style={
                            isCurrent
                              ? {
                                  textShadow:
                                    '0 0 25px rgba(255, 255, 255, 0.5), 0 0 50px rgba(255, 255, 255, 0.2)',
                                }
                              : undefined
                          }
                        >
                          {line.text}
                        </p>
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
          <footer className="relative z-20 w-full max-w-xl sm:max-w-2xl mx-auto px-6 pb-8 sm:pb-12 pt-2 flex flex-col items-center gap-4 select-none">
            {/* Progress Scrubber Bar with Tactile Glow */}
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
                  className="absolute inset-y-0 left-0 transition-all duration-100 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.95)]"
                  style={{ width: `${progressRatio * 100}%` }}
                />
              </div>

              <span className="font-mono text-xs text-white/70 w-10 text-left tabular-nums">
                {durationSec > 0 ? formatTime(durationSec) : currentTrack.defaultDuration}
              </span>
            </div>

            {/* Playback Action Buttons */}
            <div className="flex items-center justify-center gap-7 w-full relative">
              <motion.button
                type="button"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.2 }}
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
                transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.25 }}
                onClick={onTogglePlay}
                className="w-13 h-13 rounded-full bg-white text-black flex items-center justify-center shadow-[0_4px_30px_rgba(255,255,255,0.45)] transition-all cursor-pointer"
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
                transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.2 }}
                onClick={onNext}
                className="p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Piste suivante"
              >
                <SkipForward className="w-5 h-5 fill-white/20" />
              </motion.button>

              {/* Volume Slider with Mute Toggle */}
              <div className="hidden sm:flex items-center gap-2 absolute right-0">
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="text-white/70 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-[#ff1e38]" />
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
                  className="w-20 h-1 bg-white/20 accent-[#ff1e38] rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
