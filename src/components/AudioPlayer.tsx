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

  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
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

  // Apple Music / Siri-style fluid multi-harmonic sound wave canvas loop
  useEffect(() => {
    const draw = () => {
      const canvas = waveCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Measure real audio frequency energy if playing
      const analyser = audioEngine.getAnalyser();
      let energy = 0;
      if (analyser && isPlaying) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data as any);
        let sum = 0;
        for (let k = 0; k < data.length; k++) sum += data[k];
        energy = sum / (data.length * 255);
      }

      const time = performance.now() / 1000;
      const midY = height / 2;

      // 4 harmonic waves layered for liquid light effect
      const waves = [
        { freq: 0.018, speed: 3.2, color: '#f2a33c', alpha: 0.95, width: 2.2, blur: 12 },
        { freq: 0.026, speed: -2.6, color: '#ff6b3d', alpha: 0.75, width: 1.8, blur: 8 },
        { freq: 0.014, speed: 4.0, color: '#ffd166', alpha: 0.55, width: 1.4, blur: 6 },
        { freq: 0.034, speed: -3.6, color: 'rgba(255, 245, 235, 0.45)', alpha: 0.4, width: 1.0, blur: 4 },
      ];

      // Dynamic amplitude scaling based on live audio energy
      const ampBase = isPlaying ? Math.max(10, (0.25 + energy * 0.85) * (height * 0.44)) : 4;

      waves.forEach((w) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.width;
        ctx.globalAlpha = w.alpha;
        ctx.shadowColor = w.color;
        ctx.shadowBlur = isPlaying ? w.blur : 0;

        const step = 4;
        for (let x = 0; x <= width; x += step) {
          // Hanning window function: anchors wave smoothly at edges and lets center dance
          const normalizedX = x / width;
          const windowFunc = Math.sin(normalizedX * Math.PI);

          const phase = time * w.speed;
          const yOffset =
            (Math.sin(x * w.freq + phase) * ampBase +
              Math.cos(x * w.freq * 1.6 - phase * 0.8) * (ampBase * 0.45)) *
            windowFunc;

          const y = midY + yOffset;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetDuration = playerState.duration || 0;
    if (targetDuration > 0) {
      audioEngine.seek(ratio * targetDuration);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    setHoverRatio(ratio);
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
            className="w-[340px] sm:w-[380px] p-5 rounded-3xl bg-[#0a0a0cf5] border border-white/[0.12] backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col gap-4 font-sans text-left"
          >
            {/* Header: Authentic Micro-groove Vinyl & Track Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* Realistic Spinning Vinyl Disc */}
                <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-white/10 to-white/5 shadow-md flex items-center justify-center shrink-0 select-none">
                  {/* Ambient Halo Glow */}
                  <div
                    className={`absolute inset-0 rounded-full transition-opacity duration-500 blur-md pointer-events-none ${
                      isPlaying ? 'opacity-70 bg-[#f2a33c]/30' : 'opacity-0'
                    }`}
                  />

                  {/* Vinyl Record Body */}
                  <div
                    className={`relative w-full h-full rounded-full bg-[#0d0d10] border border-white/10 flex items-center justify-center overflow-hidden ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{
                      animationDuration: '4s',
                      backgroundImage: `
                        radial-gradient(circle, #1c1c22 0%, #0d0d10 25%, #181820 30%, #0a0a0d 50%, #15151c 65%, #08080a 85%, #050507 100%)
                      `,
                    }}
                  >
                    {/* Micro-groove light sheen reflection */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none opacity-40"
                      style={{
                        background: `conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.12) 60deg, transparent 120deg, rgba(255,255,255,0.12) 240deg, transparent 300deg)`,
                      }}
                    />

                    {/* Center Spindle Label with Track Number */}
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#f2a33c] to-[#ff5722] border border-black/40 flex items-center justify-center shadow-inner relative z-10">
                      <span className="font-mono text-[7px] font-black text-black">
                        0{playerState.currentTrackIndex + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Track Metadata */}
                <div>
                  <h4 className="text-[15px] font-bold text-[#ede8dd] tracking-tight">
                    {currentTrack.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs font-mono text-[#837e6f]">
                      {currentTrack.artist}
                    </p>
                    {isPlaying && (
                      <span className="flex items-end gap-[2px] h-2.5">
                        <span className="w-[1.5px] h-full bg-[#f2a33c] animate-pulse" />
                        <span className="w-[1.5px] h-2/3 bg-[#f2a33c] animate-pulse delay-75" />
                        <span className="w-[1.5px] h-4/5 bg-[#f2a33c] animate-pulse delay-150" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Collapse Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 text-[#b9b3a4] hover:text-[#ede8dd] rounded-xl hover:bg-white/5 transition-colors"
                aria-label="Réduire le lecteur"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Apple Music / Siri Fluid Sound Ribbon */}
            <div className="relative w-full h-14 overflow-hidden flex items-center justify-center select-none pointer-events-none">
              <canvas
                ref={waveCanvasRef}
                width={340}
                height={56}
                className="w-full h-full"
              />
            </div>

            {/* Hairline Interactive Scrubber Bar */}
            <div className="flex flex-col gap-1.5 -mt-1">
              <div
                onClick={handleSeek}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverRatio(null)}
                className="relative w-full py-2 cursor-pointer group select-none"
                role="slider"
                aria-label="Position de lecture"
                aria-valuemin={0}
                aria-valuemax={playerState.duration || 100}
                aria-valuenow={playerState.currentTime}
                tabIndex={0}
              >
                <div className="h-[3px] w-full bg-white/10 group-hover:h-1 rounded-full overflow-hidden relative transition-all">
                  <div
                    className="h-full bg-gradient-to-r from-[#f2a33c] to-[#ff5722] rounded-full relative"
                    style={{ width: `${progressRatio * 100}%` }}
                  />
                  {hoverRatio !== null && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/50 pointer-events-none"
                      style={{ left: `${hoverRatio * 100}%` }}
                    />
                  )}
                </div>
              </div>

              {/* Time display: Elapsed and Total */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#837e6f] select-none px-0.5">
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
                          <span className="w-[1.5px] h-full bg-[#f2a33c] animate-pulse" />
                          <span className="w-[1.5px] h-2/3 bg-[#f2a33c] animate-pulse delay-75" />
                          <span className="w-[1.5px] h-4/5 bg-[#f2a33c] animate-pulse delay-150" />
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
        className={`flex items-center gap-3 p-1.5 pr-4 rounded-full bg-[#0a0a0cf0] border backdrop-blur-2xl transition-all shadow-2xl shadow-black/80 ${
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
