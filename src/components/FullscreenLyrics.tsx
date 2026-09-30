import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Track } from '../utils/audioSynth';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
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

export const FullscreenLyrics = ({
  isOpen,
  onClose,
  isPlaying,
  onTogglePlay,
  currentTrack,
  currentTime,
  duration,
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

  // Anti-hijack: pause automatic follow when the user physically scrolls
  const isUserInteractingRef = useRef(false);
  const userInteractionTimeoutRef = useRef<number | null>(null);

  // Format mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const durationSec = duration > 0 ? duration : 237;

  // -------------------------------------------------------------------------
  // Temps interpolé à 60 fps : currentTime n'arrive que ~4-10 fois/s depuis
  // l'audioEngine, ce qui fait saccader le balayage. On extrapole le temps
  // entre deux mises à jour avec requestAnimationFrame, en se resynchronisant
  // à chaque vrai currentTime reçu.
  // -------------------------------------------------------------------------
  const [smoothTime, setSmoothTime] = useState(currentTime);
  const rafRef = useRef<number | null>(null);
  // Ancre de resynchronisation : { temps audio reçu, timestamp perf au moment de la réception }
  const syncRef = useRef<{ base: number; at: number }>({ base: currentTime, at: performance.now() });

  useEffect(() => {
    // Nouveau currentTime réel : on recale l'ancre d'extrapolation
    syncRef.current = { base: currentTime, at: performance.now() };
  }, [currentTime]);

  useEffect(() => {
    if (!isOpen) return;

    if (!isPlaying) {
      // À l'arrêt, on colle strictement au temps réel (pas d'extrapolation)
      setSmoothTime(currentTime);
      return;
    }

    const tick = () => {
      const { base, at } = syncRef.current;
      const elapsed = (performance.now() - at) / 1000;
      // On extrapole mais on plafonne court (+0.12 s) : juste de quoi lisser
      // entre deux timeupdate, sans jamais anticiper la ligne suivante.
      const projected = base + Math.min(elapsed, 0.12);
      setSmoothTime(Math.min(projected, durationSec));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, isPlaying, currentTime, durationSec]);

  const progressRatio = durationSec > 0 ? Math.min(1, smoothTime / durationSec) : 0;

  // -------------------------------------------------------------------------
  // Index actif dérivé du MÊME temps lissé que le balayage (smoothTime), et
  // non de la prop currentLyricIndex (calculée sur le currentTime brut de
  // l'audio). Ainsi l'index de ligne et le remplissage karaoké partagent une
  // seule horloge : ils ne peuvent plus diverger (l'avance/retard venait de
  // ces deux horloges désynchronisées).
  // -------------------------------------------------------------------------
  const lyrics = currentTrack.lyrics;
  const activeIndex = useMemo(() => {
    if (!lyrics || lyrics.length === 0) return -1;
    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (smoothTime >= lyrics[i].time) idx = i;
      else break;
    }
    return idx;
  }, [lyrics, smoothTime]);

  const activeLine = activeIndex >= 0 ? lyrics[activeIndex] : undefined;
  const nextLineTime =
    activeIndex >= 0 && activeIndex + 1 < lyrics.length
      ? lyrics[activeIndex + 1].time
      : durationSec;
  const lineStart = activeLine ? activeLine.time : 0;
  const lineSpan = Math.max(0.4, nextLineTime - lineStart);
  const rawLineProgress = activeLine
    ? Math.max(0, Math.min(1, (smoothTime - lineStart) / lineSpan))
    : 0;

  // Easing léger (easeInOutSine) : le balayage démarre et finit en douceur
  // au lieu d'avancer de façon parfaitement linéaire.
  const lineProgress = 0.5 - Math.cos(rawLineProgress * Math.PI) / 2;

  // Découpe la ligne active en caractères une seule fois (mémoïsé), en gardant
  // les frontières de mots pour ne pas casser un mot en fin de ligne.
  const activeChars = useMemo(() => {
    if (!activeLine) return [];
    const text = activeLine.text;
    const words = text.split(' ');
    const out: { ch: string; wordIndex: number; nbsp: boolean }[] = [];
    words.forEach((word, wIdx) => {
      for (const ch of word) out.push({ ch, wordIndex: wIdx, nbsp: false });
      if (wIdx < words.length - 1) out.push({ ch: '\u00A0', wordIndex: wIdx, nbsp: true });
    });
    return out;
  }, [activeLine]);

  // Center active lyric smoothly in the viewport
  const scrollToActiveLyric = useCallback((smooth = true) => {
    const container = containerRef.current;
    const activeEl = lyricRefs.current[activeIndex];
    if (!container || !activeEl) return;

    const containerHeight = container.clientHeight;
    const activeTop = activeEl.offsetTop;
    const activeHeight = activeEl.offsetHeight;

    const targetScroll = Math.max(0, activeTop - (containerHeight / 2) + (activeHeight / 2));

    container.scrollTo({
      top: targetScroll,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [activeIndex]);

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
    }, 40);

    return () => window.clearTimeout(timer);
  }, [isOpen, activeIndex, scrollToActiveLyric]);

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

  // Pause Lenis smooth scroll while fullscreen lyrics is open
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
          aria-label={`Paroles : ${currentTrack.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="immersive is-open select-none"
        >
          {/* Liquid warm mesh gradient background identical to mysticsaba.com */}
          <div
            className="immersive__bg"
            style={{
              '--track-a': 'rgba(255, 30, 56, 0.55)',
              '--track-b': 'rgba(150, 12, 26, 0.50)',
            } as React.CSSProperties}
            aria-hidden="true"
          />

          {/* Saturated Blurred Album Cover Backdrop */}
          {currentTrack.coverImage && (
            <img
              src={currentTrack.coverImage}
              alt=""
              aria-hidden="true"
              className="immersive__bg-img"
            />
          )}

          {/* Header */}
          <header className="immersive__head">
            <div className="immersive__trackmeta">
              {currentTrack.coverImage && (
                <img
                  src={currentTrack.coverImage}
                  alt={currentTrack.title}
                  className="immersive__cover"
                />
              )}
              <div className="min-w-0">
                <p className="immersive__title truncate">{currentTrack.title}</p>
                <p className="immersive__artist mono">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Circular Close Button with Esc shortcut */}
            <button
              type="button"
              onClick={onClose}
              className="immersive__close"
              aria-label="Fermer les paroles (Échap)"
            >
              ✕
            </button>
          </header>

          {/* Central Lyrics Viewport */}
          <main
            ref={containerRef}
            onWheel={handleUserWheelOrTouch}
            onTouchMove={handleUserWheelOrTouch}
            data-lenis-prevent
            className="immersive__scroll"
          >
            <div className="immersive__lines mx-auto">
              {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                currentTrack.lyrics.map((line, idx) => {
                  const isCurrent = idx === activeIndex;
                  const isDots = line.text === '• • •' || line.text === '...';

                  if (isDots) {
                    return (
                      <div
                        key={idx}
                        ref={(el) => {
                          lyricRefs.current[idx] = el;
                        }}
                        onClick={() => handleLyricClick(line.time)}
                        className={`line musical-line ${isCurrent ? 'Active' : 'NotSung'}`}
                      >
                        <div className="dotGroup">
                          <span className={`word dot ${isCurrent ? 'animate-pulse' : ''}`}>•</span>
                          <span className={`word dot ${isCurrent ? 'animate-pulse delay-100' : ''}`}>•</span>
                          <span className={`word dot ${isCurrent ? 'animate-pulse delay-200' : ''}`}>•</span>
                        </div>
                      </div>
                    );
                  }

                  // Distance à la ligne active pour l'effet de profondeur (flou/opacité progressifs)
                  const dist = Math.abs(idx - activeIndex);
                  const isPast = idx < activeIndex;

                  if (isCurrent) {
                    // Ligne active : karaoké caractère-par-caractère avec un
                    // balayage lumineux continu (bord de remplissage adouci).
                    const total = activeChars.length || 1;
                    // Position du front de balayage en "caractères" (continu),
                    // avec un léger dépassement pour que le dernier caractère
                    // finisse bien à 100 %.
                    const head = lineProgress * (total + 0.5);
                    return (
                      <div
                        key={idx}
                        ref={(el) => {
                          lyricRefs.current[idx] = el;
                        }}
                        onClick={() => handleLyricClick(line.time)}
                        className="line Active karaoke"
                      >
                        {activeChars.map((c, cIdx) => {
                          // Remplissage continu du caractère : 0 → 1 sur ~1.6
                          // caractère de large, ce qui crée un dégradé mou qui
                          // glisse au lieu d'un saut binaire.
                          const sung = Math.max(0, Math.min(1, (head - cIdx) / 1.6));
                          return (
                            <span
                              key={cIdx}
                              className={`karaoke__char${c.nbsp ? ' is-space' : ''}`}
                              style={{ '--sung': sung } as React.CSSProperties}
                            >
                              {c.ch}
                            </span>
                          );
                        })}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      ref={(el) => {
                        lyricRefs.current[idx] = el;
                      }}
                      onClick={() => handleLyricClick(line.time)}
                      className={`line NotSung ${isPast ? 'is-past' : 'is-upcoming'}`}
                      style={{ '--dist': Math.min(dist, 6) } as React.CSSProperties}
                    >
                      {line.text}
                    </div>
                  );
                })
              ) : (
                <div className="py-24 text-center text-white/50 font-mono text-sm">
                  Paroles indisponibles pour ce morceau.
                </div>
              )}
            </div>
          </main>

          {/* Bottom Playback Control Bar */}
          <footer className="immersive__foot">
            {/* Seek Bar */}
            <div className="immersive__seekrow">
              <span className="immersive__time mono">{formatTime(currentTime)}</span>

              <div
                onClick={handleSeek}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setHoverRatio((e.clientX - rect.left) / rect.width);
                }}
                onMouseLeave={() => setHoverRatio(null)}
                className="immersive__progress relative group"
              >
                <div className="w-full h-1 bg-[rgba(245,238,238,0.2)] rounded-full relative overflow-hidden group-hover:h-1.5 transition-all">
                  {hoverRatio !== null && (
                    <div
                      className="absolute inset-y-0 left-0 bg-[rgba(245,238,238,0.35)] pointer-events-none"
                      style={{ width: `${hoverRatio * 100}%` }}
                    />
                  )}
                  <div
                    className="absolute inset-y-0 left-0 bg-[var(--amber)] shadow-[0_0_12px_rgba(255,30,56,0.8)] rounded-full"
                    style={{ width: `${progressRatio * 100}%` }}
                  />
                </div>
              </div>

              <span className="immersive__time mono">
                {durationSec > 0 ? formatTime(durationSec) : currentTrack.defaultDuration}
              </span>
            </div>

            {/* Playback Action Buttons */}
            <div className="immersive__controls">
              <button
                type="button"
                onClick={onPrevious}
                className="ctrl"
                aria-label="Piste précédente"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onTogglePlay}
                className="ctrl ctrl--main"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={onNext}
                className="ctrl"
                aria-label="Piste suivante"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Volume Slider with Mute Toggle */}
              <div className="immersive__vol hidden sm:flex">
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="text-[var(--cream-dim)] hover:text-[var(--cream)] transition-colors cursor-pointer p-1"
                  aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-[var(--amber)]" />
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
                  className="w-20 h-1 bg-[rgba(245,238,238,0.2)] accent-[var(--amber)] rounded-lg appearance-none cursor-pointer"
                  aria-label="Volume"
                />
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
