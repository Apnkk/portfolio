import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine, TRACKS, type AudioPlayerState } from '../utils/audioSynth';
import { FullscreenLyrics } from './FullscreenLyrics';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  VolumeX, 
} from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AudioPlayer = ({ isPlaying, onTogglePlay }: AudioPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreenLyrics, setIsFullscreenLyrics] = useState(false);
  const [playerState, setPlayerState] = useState<AudioPlayerState>(() => audioEngine.getState());
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

  const dockCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Subscribe to audio engine updates
  useEffect(() => {
    return audioEngine.subscribe((next) => {
      setPlayerState({ ...next });
    });
  }, []);

  // Format mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentTrack = playerState.currentTrack;
  const durationSec = playerState.duration > 0 ? playerState.duration : 237;
  const progressRatio = durationSec > 0 ? Math.min(1, playerState.currentTime / durationSec) : 0;

  // Active lyric index based on timestamps
  const currentLyricIndex = currentTrack.lyrics?.reduce((acc, lyric, idx) => {
    if (playerState.currentTime >= lyric.time) {
      return idx;
    }
    return acc;
  }, 0) ?? 0;

  const prevLyric = currentTrack.lyrics?.[currentLyricIndex - 1]?.text || '';
  const nowLyric = currentTrack.lyrics?.[currentLyricIndex]?.text || currentTrack.title;
  const nextLyric = currentTrack.lyrics?.[currentLyricIndex + 1]?.text || '';

  // Draw audio equalizer bars on dock & panel
  useEffect(() => {
    const dockCanvas = dockCanvasRef.current;

    // If not playing, draw resting dormant baseline once and do not loop RAF
    if (!isPlaying) {
      if (dockCanvas) {
        const ctx = dockCanvas.getContext('2d');
        if (ctx) {
          const w = dockCanvas.width;
          const h = dockCanvas.height;
          ctx.clearRect(0, 0, w, h);
          const barCount = 18;
          const barWidth = 3;
          const gap = (w - barCount * barWidth) / (barCount - 1);
          ctx.fillStyle = 'rgba(237, 232, 221, 0.15)';
          for (let i = 0; i < barCount; i++) {
            const x = i * (barWidth + gap);
            ctx.fillRect(x, h - 2, barWidth, 2);
          }
        }
      }
      return;
    }

    const draw = () => {
      const analyser = audioEngine.getAnalyser();
      let data: Uint8Array<ArrayBuffer> | null = null;

      if (analyser && isPlaying) {
        const buffer = new ArrayBuffer(analyser.frequencyBinCount);
        data = new Uint8Array(buffer);
        analyser.getByteFrequencyData(data);
      }

      // Draw dock active spectrum bars
      if (dockCanvas) {
        const ctx = dockCanvas.getContext('2d');
        if (ctx) {
          const w = dockCanvas.width;
          const h = dockCanvas.height;
          ctx.clearRect(0, 0, w, h);
          const barCount = 18;
          const barWidth = 3;
          const gap = (w - barCount * barWidth) / (barCount - 1);
          const time = performance.now() / 1000;

          for (let i = 0; i < barCount; i++) {
            const freqVal = data ? (data[i * 2] || 0) / 255 : Math.sin(time * 3 + i * 0.4) * 0.4 + 0.5;
            const barH = Math.max(3, freqVal * h);
            const x = i * (barWidth + gap);
            const y = h - barH;

            ctx.fillStyle = '#f2a33c';
            ctx.fillRect(x, y, barWidth, barH);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioEngine.seek(ratio * durationSec);
  };

  return (
    <>
      {/* Floating Bottom-Right Audio Dock & Expanded Panel */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        {/* Expanded Panel (MysticSaba .panel style) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="panel"
              role="dialog"
              aria-label="Lecteur audio complet"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`panel ${isPlaying ? 'is-playing' : ''}`}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="panel__close"
                aria-label="Réduire le lecteur"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Track Info with Spinning Vinyl Record */}
              <div className="panel__now">
                <div className="panel__art">
                  <span className="panel__art-disc" />
                  {currentTrack.coverImage && (
                    <img
                      src={currentTrack.coverImage}
                      alt={currentTrack.title}
                      className="panel__cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="panel__title">{currentTrack.title}</p>
                  <p className="panel__artist">{currentTrack.artist}</p>
                </div>
              </div>

              {/* Lyric Peek Box with PAROLES ⤢ Button */}
              <div className="panel__lyricpeek">
                <p className="panel__lyricline">{prevLyric}</p>
                <p className="panel__lyricline panel__lyricline--active">{nowLyric}</p>
                <p className="panel__lyricline">{nextLyric}</p>

                <button
                  type="button"
                  onClick={() => {
                    setIsFullscreenLyrics(true);
                  }}
                  className="panel__immersive mono"
                  aria-label="Ouvrir les paroles en plein écran"
                >
                  PAROLES ⤢
                </button>
              </div>

              {/* Seek Bar */}
              <div className="panel__seek">
                <span className="panel__time mono">{formatTime(playerState.currentTime)}</span>

                <div
                  onClick={handleSeek}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoverRatio((e.clientX - rect.left) / rect.width);
                  }}
                  onMouseLeave={() => setHoverRatio(null)}
                  className="flex-1 h-3 flex items-center cursor-pointer relative group"
                >
                  <div className="w-full h-1 bg-[rgba(237,232,221,0.15)] rounded-full relative overflow-hidden group-hover:h-1.5 transition-all">
                    {hoverRatio !== null && (
                      <div
                        className="absolute inset-y-0 left-0 bg-[rgba(237,232,221,0.25)] pointer-events-none"
                        style={{ width: `${hoverRatio * 100}%` }}
                      />
                    )}
                    <div
                      className="absolute inset-y-0 left-0 bg-[var(--amber)] rounded-full"
                      style={{ width: `${progressRatio * 100}%` }}
                    />
                  </div>
                </div>

                <span className="panel__time mono">
                  {durationSec > 0 ? formatTime(durationSec) : currentTrack.defaultDuration}
                </span>
              </div>

              {/* Controls (Prev, Main Play, Next, Volume) */}
              <div className="panel__controls">
                <button
                  type="button"
                  onClick={() => audioEngine.previous()}
                  className="ctrl"
                  aria-label="Titre précédent"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onTogglePlay}
                  className="ctrl ctrl--main"
                  aria-label={isPlaying ? 'Pause' : 'Lecture'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => audioEngine.next()}
                  className="ctrl"
                  aria-label="Titre suivant"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Volume Slider */}
                <div className="panel__vol">
                  <button
                    type="button"
                    onClick={() => audioEngine.toggleMute()}
                    className="text-[var(--muted)] hover:text-white transition-colors cursor-pointer"
                    aria-label={playerState.isMuted ? 'Activer le son' : 'Couper le son'}
                  >
                    {playerState.isMuted || playerState.volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5 text-[var(--amber)]" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={playerState.isMuted ? 0 : playerState.volume}
                    onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
                    className="w-16 h-1 bg-[rgba(237,232,221,0.2)] accent-[var(--amber)] rounded-lg appearance-none cursor-pointer"
                    aria-label="Volume"
                  />
                </div>
              </div>

              {/* Tracklist List */}
              <ul className="panel__list" aria-label="Liste des morceaux">
                {TRACKS.map((t, idx) => {
                  const isCurrent = playerState.currentTrackIndex === idx;
                  return (
                    <li
                      key={t.id}
                      className={`panel__item ${isCurrent ? 'is-current' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => audioEngine.setTrack(idx, true)}
                        aria-label={`Lire ${t.title} — ${t.artist}`}
                      >
                        <span className="panel__item-num mono">0{idx + 1}</span>
                        <span className="panel__item-name">
                          {t.title}
                          <small>{t.artist}</small>
                        </span>
                        {isCurrent && isPlaying ? (
                          <span className="panel__item-eq" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                          </span>
                        ) : (
                          <span className="panel__item-dur mono">{t.defaultDuration}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimalist Floating Audio Dock (.dock) */}
        <div className={`dock ${isPlaying ? 'is-playing' : 'is-dormant'}`}>
          {/* Circular Play Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="dock__play"
            aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Middle Track Title + Audio Spectrum Bars */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="dock__mid cursor-pointer"
          >
            <div className="dock__title-row">
              <span
                className={`dock__pulse-dot ${isPlaying ? 'dock__pulse-dot--active' : ''}`}
                aria-hidden="true"
              />
              <p className="dock__track">
                <span>{`${currentTrack.artist} — ${currentTrack.title}`}</span>
              </p>
            </div>
            <canvas
              ref={dockCanvasRef}
              width={138}
              height={14}
              className="dock__bars"
              aria-hidden="true"
            />
          </div>

          {/* Hairline Progress on Bottom Edge */}
          <div className="dock__progress" aria-hidden="true">
            <span style={{ width: `${progressRatio * 100}%` }} />
          </div>

          {/* Expand Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="dock__expand"
            aria-label={isExpanded ? 'Réduire le lecteur' : 'Ouvrir le lecteur'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen Immersive Lyrics View */}
      <FullscreenLyrics
        isOpen={isFullscreenLyrics}
        onClose={() => setIsFullscreenLyrics(false)}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        currentTrack={currentTrack}
        currentTime={playerState.currentTime}
        duration={playerState.duration}
        currentLyricIndex={currentLyricIndex}
        onSeek={(time) => audioEngine.seek(time)}
        onNext={() => audioEngine.next()}
        onPrevious={() => audioEngine.previous()}
        volume={playerState.volume}
        isMuted={playerState.isMuted}
        onVolumeChange={(vol) => audioEngine.setVolume(vol)}
        onToggleMute={() => audioEngine.toggleMute()}
      />
    </>
  );
};
