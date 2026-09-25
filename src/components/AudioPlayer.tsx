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
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Subscribe to audio engine updates
  useEffect(() => {
    return audioEngine.subscribe((next) => {
      setPlayerState({ ...next });
    });
  }, []);

  const handleUserInteraction = () => {
    audioEngine.resumeContext();
  };

  const handleVolumeChange = (newVol: number) => {
    audioEngine.setVolume(newVol);
  };

  const toggleMute = () => {
    audioEngine.toggleMute();
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
  const progressRatio =
    playerState.duration > 0 ? Math.min(1, playerState.currentTime / playerState.duration) : 0;

  // Real SoundCloud / Apple Music style interactive waveform canvas loop
  useEffect(() => {
    const draw = () => {
      const canvas = waveformCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const waveform = currentTrack.waveform || [];
      const barCount = waveform.length || 42;
      const gap = 3;
      const totalGap = gap * (barCount - 1);
      const barWidth = Math.max(3, (width - totalGap) / barCount);
      const midY = height / 2;

      // Extract real audio frequency energy if playing
      const analyser = audioEngine.getAnalyser();
      let energy = 0;
      if (analyser && isPlaying) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data as any);
        let sum = 0;
        for (let k = 0; k < data.length; k++) sum += data[k];
        energy = sum / (data.length * 255);
      }

      const nowSec = performance.now() / 1000;
      const activeBarIndex = Math.floor(progressRatio * barCount);
      const hoverBarIndex = hoverRatio !== null ? Math.floor(hoverRatio * barCount) : null;

      for (let i = 0; i < barCount; i++) {
        const baseH = waveform[i] || 0.5;
        // Subtle organic bounce on currently playing and nearby bars
        let bounce = 0;
        if (isPlaying) {
          const distToHead = Math.abs(i - activeBarIndex);
          if (distToHead <= 4) {
            const beatPulse = Math.sin(nowSec * 8 + i * 0.4) * 0.15;
            bounce = (beatPulse + energy * 0.25) * (1 - distToHead / 5);
          } else {
            bounce = Math.sin(nowSec * 3 + i * 0.3) * 0.04;
          }
        }

        const barFraction = Math.max(0.18, Math.min(1.0, baseH + bounce));
        const barH = Math.max(6, barFraction * (height - 8));
        const x = i * (barWidth + gap);
        const y = midY - barH / 2;

        const isPlayed = i <= activeBarIndex;
        const isHovered = hoverBarIndex !== null && i <= hoverBarIndex;

        // SoundCloud / Apple Music color scheme:
        // Played = vibrant warm amber/orange gradient; Unplayed = muted translucent cream
        if (isPlayed) {
          const grad = ctx.createLinearGradient(0, y, 0, y + barH);
          grad.addColorStop(0, '#f2a33c');
          grad.addColorStop(1, '#ff6b3d');
          ctx.fillStyle = grad;
        } else if (isHovered) {
          ctx.fillStyle = 'rgba(242, 163, 60, 0.45)';
        } else {
          ctx.fillStyle = 'rgba(237, 232, 221, 0.2)';
        }

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, barWidth / 2);
        ctx.fill();
      }

      // Draw subtle playhead needle at exact position
      if (progressRatio > 0 && progressRatio < 1) {
        const needleX = progressRatio * width;
        ctx.fillStyle = '#fff4e6';
        ctx.shadowColor = '#f2a33c';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(Math.max(0, needleX - 1), 2, 2, height - 4, 1);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentTrack, progressRatio, isPlaying, hoverRatio]);

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetDuration = playerState.duration || 0;
    if (targetDuration > 0) {
      audioEngine.seek(ratio * targetDuration);
    }
  };

  const handleWaveformMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    setHoverRatio(ratio);
  };

  // Distinctive, human-crafted EP Cover Artwork for each track
  const renderAlbumCover = (trackId: string) => {
    switch (trackId) {
      case 'dear-black':
        return (
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#22222a] via-[#121216] to-[#070709] border border-white/10 flex flex-col justify-between p-2 shadow-lg shrink-0 overflow-hidden select-none">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] text-[#f2a33c] tracking-widest uppercase font-bold">ARES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f2a33c]" />
            </div>
            <div className="font-display font-black text-[9px] tracking-tight leading-none text-[#ede8dd]">
              DEAR<br /><span className="text-[#837e6f]">BLACK</span>
            </div>
            <span className="font-mono text-[7px] text-white/30">01</span>
          </div>
        );
      case 'jane-your-early':
        return (
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#2e1a12] via-[#160c08] to-[#070709] border border-white/10 flex flex-col justify-between p-2 shadow-lg shrink-0 overflow-hidden select-none">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] text-[#ff7a45] tracking-widest uppercase font-bold">ARES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a45]" />
            </div>
            <div className="font-display font-black text-[9px] tracking-tight leading-none text-[#ede8dd]">
              JANE<br /><span className="text-[#ff7a45]">EARLY</span>
            </div>
            <span className="font-mono text-[7px] text-white/30">02</span>
          </div>
        );
      case 'sega':
        return (
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#0e1d2c] via-[#070e17] to-[#070709] border border-white/10 flex flex-col justify-between p-2 shadow-lg shrink-0 overflow-hidden select-none">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[7px] text-[#38bdf8] tracking-widest uppercase font-bold">ARES</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
            </div>
            <div className="font-display font-black text-[9px] tracking-tight leading-none text-[#ede8dd]">
              SEGA<br /><span className="text-[#38bdf8]">1994</span>
            </div>
            <span className="font-mono text-[7px] text-white/30">03</span>
          </div>
        );
      default:
        return null;
    }
  };

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
            className="w-[340px] sm:w-[380px] p-4 rounded-2xl bg-[#0d0d10f2] border border-[rgba(237,232,221,0.14)] backdrop-blur-2xl shadow-2xl shadow-black/95 flex flex-col gap-4 font-sans text-left"
          >
            {/* Header info with authentic EP cover art */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderAlbumCover(currentTrack.id)}
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

            {/* Interactive SoundCloud / Apple Music Waveform Player */}
            <div className="flex flex-col gap-1.5">
              <div
                onClick={handleWaveformClick}
                onMouseMove={handleWaveformMouseMove}
                onMouseLeave={() => setHoverRatio(null)}
                className="relative w-full h-14 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 transition-colors p-2 flex items-center justify-center cursor-pointer select-none group"
                role="slider"
                aria-label="Progression du morceau"
                aria-valuemin={0}
                aria-valuemax={playerState.duration || 100}
                aria-valuenow={playerState.currentTime}
                tabIndex={0}
              >
                <canvas
                  ref={waveformCanvasRef}
                  width={340}
                  height={56}
                  className="w-full h-full"
                />
              </div>

              {/* Time display: Elapsed and Total */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#837e6f] px-1 select-none">
                <span className="text-[#ede8dd] font-medium">{formatTime(playerState.currentTime)}</span>
                <span>{currentDuration}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between pt-1">
              {/* Prev / Play / Next Track */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => audioEngine.previous()}
                  className="p-2 text-[#b9b3a4] hover:text-[#ede8dd] rounded-full transition-colors active:scale-90"
                  aria-label="Morceau précédent"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={onTogglePlay}
                  className="w-11 h-11 rounded-full bg-[#ede8dd] hover:bg-[#f2a33c] text-black flex items-center justify-center shadow-lg transition-all active:scale-95"
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
            <div className="border-t border-white/10 pt-2.5 space-y-1">
              {TRACKS.map((t, idx) => {
                const isCurrent = playerState.currentTrackIndex === idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => audioEngine.setTrack(idx, true)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                      isCurrent
                        ? 'bg-white/10 text-[#f2a33c] font-medium'
                        : 'text-[#b9b3a4] hover:bg-white/5 hover:text-[#ede8dd]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-[10px] text-[#837e6f]">0{idx + 1}</span>
                      <span className="truncate">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isCurrent && isPlaying && (
                        <span className="flex items-end gap-[2px] h-3">
                          <span className="w-[2px] h-full bg-[#f2a33c] animate-pulse" />
                          <span className="w-[2px] h-2/3 bg-[#f2a33c] animate-pulse delay-75" />
                          <span className="w-[2px] h-4/5 bg-[#f2a33c] animate-pulse delay-150" />
                        </span>
                      )}
                      <span className="font-mono text-[10px] text-[#837e6f]">{t.defaultDuration}</span>
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
        className={`flex items-center gap-3 p-1.5 pr-4 rounded-full bg-[#0a0a0ce6] border backdrop-blur-xl transition-all shadow-xl shadow-black/80 ${
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

        {/* Track info & subtle 4-bar equalizer wave */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer flex items-center gap-3 min-w-0 pr-1 select-none"
        >
          <div className="flex flex-col justify-center min-w-0">
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#ede8dd] truncate max-w-[110px] sm:max-w-[130px]">
              {currentTrack.title}
            </span>
            <span className="font-mono text-[9px] text-[#837e6f]">
              {currentTrack.artist}
            </span>
          </div>

          {/* Mini 4-bar equalizer indicator */}
          <div className="flex items-end gap-[2px] h-3.5 px-0.5">
            {[0.65, 1, 0.45, 0.85].map((h, i) => (
              <span
                key={i}
                className={`w-[2px] rounded-full transition-all duration-200 ${
                  isPlaying ? 'bg-[#f2a33c] animate-pulse' : 'bg-white/20'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(25, h * 100)}%` : '30%',
                  animationDelay: `${i * 120}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 rounded-full flex items-center justify-center text-[#837e6f] hover:text-[#f2a33c] transition-colors"
          aria-label="Afficher les contrôles audio"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  );
};
