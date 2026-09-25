import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine, TRACKS, type AudioPlayerState } from '../utils/audioSynth';
import { Volume2, VolumeX, ChevronUp, ChevronDown, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AudioPlayer = ({ isPlaying, onTogglePlay }: AudioPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playerState, setPlayerState] = useState<AudioPlayerState>(() => audioEngine.getState());

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Subscribe to audio engine updates
  useEffect(() => {
    return audioEngine.subscribe((next) => {
      setPlayerState({ ...next });
    });
  }, []);

  // Visualizer loop for canvas (both compact dock EQ and expanded waveform)
  useEffect(() => {
    const draw = () => {
      const analyser = audioEngine.getAnalyser();
      const canvas = canvasRef.current;
      const panelCanvas = panelCanvasRef.current;

      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barCount = 14;
          const barWidth = 3;
          const gap = 3;

          if (analyser && isPlaying) {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);

            for (let i = 0; i < barCount; i++) {
              const val = dataArray[i * 2] || 0;
              const barHeight = Math.max(3, (val / 255) * canvas.height);
              ctx.fillStyle = '#f2a33c';
              ctx.fillRect(i * (barWidth + gap), canvas.height - barHeight, barWidth, barHeight);
            }
          } else {
            // Idle bars
            for (let i = 0; i < barCount; i++) {
              ctx.fillStyle = 'rgba(237, 232, 221, 0.2)';
              ctx.fillRect(i * (barWidth + gap), canvas.height - 3, barWidth, 3);
            }
          }
        }
      }

      if (panelCanvas) {
        const ctx = panelCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, panelCanvas.width, panelCanvas.height);
          if (analyser && isPlaying) {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteTimeDomainData(dataArray);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#f2a33c';
            ctx.beginPath();
            const sliceWidth = panelCanvas.width / dataArray.length;
            let x = 0;
            for (let i = 0; i < dataArray.length; i++) {
              const v = dataArray[i] / 128.0;
              const y = (v * panelCanvas.height) / 2;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
              x += sliceWidth;
            }
            ctx.stroke();
          } else {
            // Idle flat wave with subtle center pulse
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(242, 163, 60, 0.25)';
            ctx.beginPath();
            ctx.moveTo(0, panelCanvas.height / 2);
            ctx.lineTo(panelCanvas.width, panelCanvas.height / 2);
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleVolumeChange = (newVol: number) => {
    audioEngine.setVolume(newVol);
  };

  const toggleMute = () => {
    audioEngine.toggleMute();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetDuration = playerState.duration || 0;
    if (targetDuration > 0) {
      audioEngine.seek(ratio * targetDuration);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentTrack = playerState.currentTrack;
  const currentDuration =
    playerState.duration > 0 ? formatTime(playerState.duration) : currentTrack.defaultDuration;
  const progressPercent =
    playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0;

  return (
    <aside
      className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[1000] flex flex-col items-end gap-3 pointer-events-auto"
      aria-label="Lecteur audio d'ambiance"
    >
      {/* Expanded Control Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[340px] sm:w-[380px] p-4 rounded-2xl bg-[#0a0a0ce6] border border-[rgba(237,232,221,0.14)] backdrop-blur-2xl shadow-2xl shadow-black/90 flex flex-col gap-3 font-sans text-left"
          >
            {/* Header info with rotating vinyl disc */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#18181b] to-[#09090b] border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                  <div
                    className={`w-7 h-7 rounded-full border-2 border-[rgba(237,232,221,0.8)] relative flex items-center justify-center ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '3s' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#ff3d2e]" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#ede8dd] tracking-tight">
                    {currentTrack.title}
                  </h4>
                  <p className="text-[11px] font-mono text-[#837e6f]">
                    {currentTrack.artist} • Track 0{playerState.currentTrackIndex + 1}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 text-[#b9b3a4] hover:text-[#ede8dd] rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Réduire le lecteur"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Live waveform canvas */}
            <div className="h-9 w-full bg-white/[0.02] border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
              <canvas
                ref={panelCanvasRef}
                width={340}
                height={36}
                className="w-full h-full"
              />
            </div>

            {/* Interactive Progress Bar */}
            <div
              className="w-full py-1 cursor-pointer group"
              onClick={handleSeek}
              role="slider"
              aria-label="Position de lecture"
              aria-valuemin={0}
              aria-valuemax={playerState.duration || 100}
              aria-valuenow={playerState.currentTime}
              tabIndex={0}
            >
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative group-hover:h-2 transition-all">
                <div
                  className="h-full bg-gradient-to-r from-[#f2a33c] to-[#ff3d2e] rounded-full relative"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Time progress */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#837e6f]">
              <span>{formatTime(playerState.currentTime)}</span>
              <span className="text-[#f2a33c] text-[10px] tracking-wider uppercase font-semibold">
                {isPlaying ? 'NOW PLAYING' : 'AUDIO TRACK'}
              </span>
              <span>{currentDuration}</span>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-1">
              {/* Prev / Play / Next Track */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => audioEngine.previous()}
                  className="p-2 text-[#b9b3a4] hover:text-[#ede8dd] rounded-full transition-colors active:scale-90"
                  aria-label="Morceau précédent"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={onTogglePlay}
                  className="w-10 h-10 rounded-full bg-[#ede8dd] hover:bg-[#f2a33c] text-black flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  aria-label={isPlaying ? 'Pause' : 'Lecture'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => audioEngine.next()}
                  className="p-2 text-[#b9b3a4] hover:text-[#ede8dd] rounded-full transition-colors active:scale-90"
                  aria-label="Morceau suivant"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-[#837e6f] hover:text-[#ede8dd] transition-colors"
                  aria-label={playerState.isMuted || playerState.volume === 0 ? 'Activer le son' : 'Couper le son'}
                >
                  {playerState.isMuted || playerState.volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={playerState.isMuted ? 0 : playerState.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 accent-[#f2a33c] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  aria-label="Volume"
                />
              </div>
            </div>

            {/* Tracklist selection */}
            <div className="border-t border-white/10 pt-2 space-y-1">
              {TRACKS.map((t, idx) => {
                const isCurrent = playerState.currentTrackIndex === idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      audioEngine.setTrack(idx, true);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isCurrent
                        ? 'bg-white/10 text-[#f2a33c]'
                        : 'text-[#b9b3a4] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-[#837e6f]">0{idx + 1}</span>
                      <span className="font-medium truncate max-w-[200px]">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isCurrent && isPlaying && (
                        <span className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 h-full bg-[#f2a33c] animate-pulse" />
                          <span className="w-0.5 h-2/3 bg-[#f2a33c] animate-pulse delay-75" />
                          <span className="w-0.5 h-4/5 bg-[#f2a33c] animate-pulse delay-150" />
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-[#837e6f]">
                        {isCurrent && playerState.duration > 0
                          ? formatTime(playerState.duration)
                          : t.defaultDuration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Dock Pill */}
      <div
        className={`flex items-center gap-3 p-1.5 pr-3 rounded-full bg-[#0a0a0ce0] border backdrop-blur-xl transition-all shadow-xl shadow-black/70 ${
          isPlaying
            ? 'border-[#f2a33c80] shadow-[0_0_24px_rgba(242,163,60,0.18)]'
            : 'border-[rgba(237,232,221,0.14)] hover:border-[#f2a33c80]'
        }`}
      >
        {/* Play/Pause round button */}
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full bg-[#f2a33c] text-black flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Track info & mini EQ canvas */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer flex flex-col justify-center min-w-0 pr-1 select-none"
        >
          <div className="font-mono text-[10px] tracking-wider uppercase text-[#ede8dd] flex items-center gap-1.5">
            <span className="truncate max-w-[110px] sm:max-w-[140px] font-semibold">
              {currentTrack.title}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <canvas
              ref={canvasRef}
              width={90}
              height={12}
              className="h-3 w-[90px]"
            />
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-7 h-7 rounded-full border border-[rgba(237,232,221,0.12)] flex items-center justify-center text-[#b9b3a4] hover:text-[#f2a33c] hover:border-[#f2a33c80] transition-colors"
          aria-label="Afficher les contrôles audio"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
};
