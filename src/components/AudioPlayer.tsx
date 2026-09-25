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

  // Peak hold meters for 36 spectrum bands
  const peaksRef = useRef<number[]>(new Array(36).fill(0));
  const peakDecayRef = useRef<number[]>(new Array(36).fill(0));

  // Subscribe to audio engine updates
  useEffect(() => {
    return audioEngine.subscribe((next) => {
      setPlayerState({ ...next });
    });
  }, []);

  // Ensure AudioContext is resumed on user gesture anywhere on the player
  const handleUserInteraction = () => {
    audioEngine.resumeContext();
  };

  // High-fidelity spectrum visualizer loop
  useEffect(() => {
    const draw = () => {
      const analyser = audioEngine.getAnalyser();
      const canvas = canvasRef.current;
      const panelCanvas = panelCanvasRef.current;

      // 1. Panel Visualizer (Expanded Studio Spectrum Analyzer)
      if (panelCanvas) {
        const ctx = panelCanvas.getContext('2d');
        if (ctx) {
          const width = panelCanvas.width;
          const height = panelCanvas.height;
          ctx.clearRect(0, 0, width, height);

          // Subtle pro-audio grid lines
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.beginPath();
          [height * 0.25, height * 0.5, height * 0.7].forEach((gridY) => {
            ctx.moveTo(0, gridY);
            ctx.lineTo(width, gridY);
          });
          ctx.stroke();

          // Frequency data extraction
          const barCount = 36;
          const gap = 3;
          const totalGap = gap * (barCount - 1);
          const barWidth = Math.max(3, (width - totalGap) / barCount);
          const baselineY = Math.floor(height * 0.72);
          const maxBarHeight = baselineY - 4;

          let dataArray: Uint8Array | null = null;
          let hasRealEnergy = false;

          if (analyser) {
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray as any);
            let sum = 0;
            for (let k = 0; k < dataArray.length; k++) {
              sum += dataArray[k];
            }
            const avg = sum / dataArray.length;
            hasRealEnergy = isPlaying && avg > 1.5;
          }

          const nowSec = performance.now() / 1000;
          const crestPoints: { x: number; y: number }[] = [];

          for (let i = 0; i < barCount; i++) {
            let magnitude = 0; // 0 to 255

            if (hasRealEnergy && dataArray) {
              // Logarithmic perceptual scale mapping
              const binIdx = Math.min(
                dataArray.length - 1,
                Math.floor(Math.pow(i / barCount, 1.45) * (dataArray.length - 1))
              );
              const raw = dataArray[binIdx] || 0;
              // High-frequency treble boost for balanced visuals
              const boost = 1.0 + (i / barCount) * 0.85;
              magnitude = Math.min(255, raw * boost);
            } else if (isPlaying) {
              // Musical harmonic rhythm fallback (ensures energetic dance even if browser restricts media stream)
              const kick = Math.pow(Math.sin(nowSec * 7.2), 4) * 110;
              const bassRoll = (1 - (i / barCount) * 0.65) * kick;
              const midWave = Math.sin(nowSec * 3.8 + i * 0.38) * 45;
              const hiHat = Math.sin(nowSec * 14.5 + i * 0.9) * 35 * (i / barCount);
              magnitude = Math.max(14, Math.min(245, 52 + bassRoll + midWave + hiHat));
            } else {
              // Calm idle breathing wave
              magnitude = 10 + Math.sin(nowSec * 1.8 + i * 0.3) * 6;
            }

            const barH = Math.max(3, (magnitude / 255) * maxBarHeight);
            const x = i * (barWidth + gap);
            const y = baselineY - barH;

            // Peak cap physics (fast rise, smooth gravity decay)
            if (barH >= peaksRef.current[i]) {
              peaksRef.current[i] = barH;
              peakDecayRef.current[i] = 0;
            } else {
              peakDecayRef.current[i] += 0.22;
              peaksRef.current[i] = Math.max(barH, peaksRef.current[i] - peakDecayRef.current[i]);
            }

            // Upward Main Frequency Bar (Amber to Hot Coral gradient)
            const barGrad = ctx.createLinearGradient(0, baselineY, 0, y);
            barGrad.addColorStop(0, 'rgba(242, 163, 60, 0.45)');
            barGrad.addColorStop(0.55, '#f2a33c');
            barGrad.addColorStop(0.85, '#ff5722');
            barGrad.addColorStop(1, '#ff2a55');

            ctx.fillStyle = barGrad;
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barH, [3, 3, 0, 0]);
            ctx.fill();

            // Floating Peak Cap (Neon dot above the bar)
            const peakY = Math.max(2, baselineY - peaksRef.current[i] - 2);
            ctx.fillStyle = isPlaying ? '#fff7ed' : 'rgba(237, 232, 221, 0.4)';
            ctx.fillRect(x, peakY, barWidth, 1.5);

            // Downward Mirrored Reflection (Glassmorphism look)
            const reflectH = barH * 0.32;
            const refGrad = ctx.createLinearGradient(0, baselineY, 0, baselineY + reflectH);
            refGrad.addColorStop(0, 'rgba(242, 163, 60, 0.3)');
            refGrad.addColorStop(1, 'rgba(242, 163, 60, 0.0)');
            ctx.fillStyle = refGrad;
            ctx.beginPath();
            ctx.roundRect(x, baselineY + 2, barWidth, reflectH, [0, 0, 2, 2]);
            ctx.fill();

            crestPoints.push({ x: x + barWidth / 2, y });
          }

          // Glowing Envelope Crest Line over the peaks
          if (isPlaying && crestPoints.length > 1) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(crestPoints[0].x, crestPoints[0].y);
            for (let j = 1; j < crestPoints.length; j++) {
              const prev = crestPoints[j - 1];
              const curr = crestPoints[j];
              const midX = (prev.x + curr.x) / 2;
              const midY = (prev.y + curr.y) / 2;
              ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
            }
            ctx.lineTo(crestPoints[crestPoints.length - 1].x, crestPoints[crestPoints.length - 1].y);
            ctx.strokeStyle = 'rgba(255, 230, 180, 0.55)';
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#f2a33c';
            ctx.shadowBlur = 8;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 2. Compact Dock Pill Mini EQ (14 bars)
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barCount = 14;
          const barWidth = 3;
          const gap = 3;

          let dataArray: Uint8Array | null = null;
          let hasRealEnergy = false;

          if (analyser) {
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray as any);
            let sum = 0;
            for (let k = 0; k < dataArray.length; k++) sum += dataArray[k];
            hasRealEnergy = isPlaying && sum / dataArray.length > 1.5;
          }

          const nowSec = performance.now() / 1000;

          for (let i = 0; i < barCount; i++) {
            let val = 0;
            if (hasRealEnergy && dataArray) {
              const bin = Math.min(dataArray.length - 1, i * 4);
              val = dataArray[bin] || 0;
            } else if (isPlaying) {
              val = 60 + Math.sin(nowSec * 6 + i * 0.5) * 45 + Math.cos(nowSec * 3 + i * 0.3) * 30;
            } else {
              val = 15;
            }

            const barHeight = Math.max(2, (val / 255) * canvas.height);
            const x = i * (barWidth + gap);
            const y = canvas.height - barHeight;

            ctx.fillStyle = isPlaying ? '#f2a33c' : 'rgba(237, 232, 221, 0.2)';
            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barHeight, [1.5, 1.5, 0, 0]);
            ctx.fill();
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
      onClick={handleUserInteraction}
    >
      {/* Expanded Control Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-[340px] sm:w-[380px] p-4 rounded-2xl bg-[#0a0a0ce6] border border-[rgba(237,232,221,0.14)] backdrop-blur-2xl shadow-2xl shadow-black/90 flex flex-col gap-3.5 font-sans text-left"
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

            {/* High-Tech Spectrum Analyzer Deck */}
            <div className="w-full rounded-xl bg-gradient-to-b from-[#121218]/95 via-[#09090e]/95 to-[#050508] border border-white/10 p-2.5 overflow-hidden flex flex-col gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.6)]">
              {/* Header metrics */}
              <div className="flex items-center justify-between text-[9px] font-mono select-none px-0.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      isPlaying
                        ? 'bg-[#22c55e] shadow-[0_0_6px_#22c55e]'
                        : 'bg-[#837e6f]'
                    }`}
                  />
                  <span className={`tracking-wider uppercase font-semibold ${isPlaying ? 'text-[#f2a33c]' : 'text-[#837e6f]'}`}>
                    {isPlaying ? 'SPECTRUM ANALYZER' : 'STANDBY'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#837e6f] tracking-widest uppercase">
                  <span className="hidden sm:inline text-white/30">36 BANDS</span>
                  <span className="text-[#f2a33c]/90 font-bold bg-[#f2a33c]/10 px-1.5 py-0.5 rounded border border-[#f2a33c]/20">
                    REALTIME
                  </span>
                </div>
              </div>

              {/* Canvas Spectrum Display */}
              <div className="h-16 w-full overflow-hidden flex items-center justify-center">
                <canvas
                  ref={panelCanvasRef}
                  width={340}
                  height={64}
                  className="w-full h-full"
                />
              </div>
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
