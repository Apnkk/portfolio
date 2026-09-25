import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine, TRACKS, type AudioPlayerState } from '../utils/audioSynth';
import { Volume2, VolumeX, ChevronUp, ChevronDown, Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AudioPlayer = ({ isPlaying, onTogglePlay }: AudioPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playerState, setPlayerState] = useState<AudioPlayerState>(() => audioEngine.getState());
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const mobileWaveCanvasRef = useRef<HTMLCanvasElement>(null);
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
    if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentTrack = playerState.currentTrack;
  const currentDuration =
    playerState.duration > 0 && playerState.duration < 180
      ? formatTime(playerState.duration)
      : currentTrack.defaultDuration;

  const getDurationSeconds = () => {
    if (playerState.duration > 0 && playerState.duration < 180) {
      return playerState.duration;
    }
    const parts = currentTrack.defaultDuration.split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 20);
  };

  const durationSec = getDurationSeconds();
  const progressRatio = durationSec > 0 ? Math.min(1, playerState.currentTime / durationSec) : 0;

  // Fluid multi-harmonic sound wave canvas loop (draws to both desktop & mobile canvases if open)
  useEffect(() => {
    if (!isExpanded) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const draw = () => {
      const canvases = [waveCanvasRef.current, mobileWaveCanvasRef.current].filter(Boolean) as HTMLCanvasElement[];
      if (canvases.length === 0) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      // Measure real audio frequency energy
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

      canvases.forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        const midY = height / 2;
        const dynamicAmp = isPlaying ? 3 + energy * 26 : 2;

        const layers = [
          { color: 'rgba(242, 163, 60, 0.95)', lineWidth: 2, freq: 0.035, speed: 3.2, phase: 0 },
          { color: 'rgba(255, 61, 46, 0.75)', lineWidth: 1.5, freq: 0.045, speed: -2.8, phase: 1.8 },
          { color: 'rgba(237, 232, 221, 0.45)', lineWidth: 1.2, freq: 0.025, speed: 2.2, phase: 3.4 },
        ];

        layers.forEach((layer) => {
          ctx.beginPath();
          ctx.lineWidth = layer.lineWidth;
          ctx.strokeStyle = layer.color;

          for (let x = 0; x < width; x++) {
            const envelope = Math.sin((x / width) * Math.PI);
            const y =
              midY +
              Math.sin(x * layer.freq + time * layer.speed + layer.phase) *
                dynamicAmp *
                envelope;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        });
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isExpanded, isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    if (durationSec > 0) {
      audioEngine.seek(ratio * durationSec);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    setHoverRatio(ratio);
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE EXPERIENCE: Bottom Mini-Island & Slide-up Sheet
          ───────────────────────────────────────────────────────────── */}
      
      {/* Mobile Mini Island Dock (Docked at bottom of phone screens) */}
      <div
        className="sm:hidden fixed bottom-3 left-3 right-3 z-40 flex items-center justify-between px-3 py-2 h-14 rounded-full bg-[#0a0a0cf5] border border-white/15 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] select-none pointer-events-auto"
        onClick={handleUserInteraction}
      >
        {/* Left: Mini Spinning Vinyl or Play Button */}
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full bg-[#f2a33c] text-black flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-transform"
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Center: Song info & live equalizer (taps open full sheet) */}
        <div
          onClick={() => setIsExpanded(true)}
          className="flex-1 min-w-0 px-3 cursor-pointer flex items-center justify-between"
        >
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-xs font-bold text-[#ede8dd] truncate">
              {currentTrack.title}
            </span>
            <span className="font-mono text-[10px] text-[#837e6f]">
              {currentTrack.artist}
            </span>
          </div>

          {/* Mini 4-bar equalizer indicator */}
          <div className="flex items-end gap-[2px] h-3.5 px-2 shrink-0">
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

        {/* Right: Expand to Full Player Sheet */}
        <button
          onClick={() => setIsExpanded(true)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#837e6f] hover:text-[#ede8dd] active:scale-90"
          aria-label="Agrandir le lecteur"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Slide-Up Full Player Bottom Sheet */}
      <AnimatePresence>
        {isExpanded && (
          <div
            className="sm:hidden fixed inset-0 z-[1050] flex flex-col justify-end bg-black/80 backdrop-blur-md"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-h-[90vh] overflow-y-auto rounded-t-[32px] bg-[#0c0c0f] border-t border-white/15 p-6 pb-10 shadow-2xl flex flex-col gap-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Pill Handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto -mt-2 mb-1" />

              {/* Sheet Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f2a33c] animate-pulse" />
                  <span className="mono text-[11px] text-[#ede8dd] font-bold tracking-wider uppercase">
                    Ares Soundtrack · 0{playerState.currentTrackIndex + 1}
                  </span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full bg-white/5 text-[#b9b3a4] hover:text-white"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Big Realistic Spinning Vinyl on Mobile */}
              <div className="py-2 flex flex-col items-center justify-center select-none">
                <div className="relative w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-white/15 to-white/5 shadow-2xl flex items-center justify-center">
                  {/* Halo Glow */}
                  <div
                    className={`absolute inset-0 rounded-full transition-opacity duration-500 blur-xl pointer-events-none ${
                      isPlaying ? 'opacity-80 bg-[#f2a33c]/30' : 'opacity-0'
                    }`}
                  />
                  {/* Vinyl Record */}
                  <div
                    className={`relative w-full h-full rounded-full bg-[#0d0d10] border border-white/10 flex items-center justify-center overflow-hidden ${
                      isPlaying ? 'animate-spin' : ''
                    }`}
                    style={{
                      animationDuration: '4s',
                      backgroundImage: `radial-gradient(circle, #1c1c22 0%, #0d0d10 25%, #181820 30%, #0a0a0d 50%, #15151c 65%, #08080a 85%, #050507 100%)`,
                    }}
                  >
                    {/* Light sheen */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none opacity-40"
                      style={{
                        background: `conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.15) 60deg, transparent 120deg, rgba(255,255,255,0.15) 240deg, transparent 300deg)`,
                      }}
                    />
                    {/* Center Label */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f2a33c] to-[#ff5722] border-2 border-black flex items-center justify-center shadow-inner relative z-10">
                      <span className="font-mono text-[9px] font-black text-black">
                        0{playerState.currentTrackIndex + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Track Name */}
                <h3 className="text-xl font-bold font-display text-[#ede8dd] mt-4 tracking-tight">
                  {currentTrack.title}
                </h3>
                <p className="text-xs font-mono text-[#837e6f] mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Sound Ribbon Canvas on Mobile */}
              <div className="relative w-full h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden flex items-center justify-center p-1 select-none pointer-events-none">
                <canvas
                  ref={mobileWaveCanvasRef}
                  width={340}
                  height={40}
                  className="w-full h-full"
                />
              </div>

              {/* Scrubber Bar */}
              <div className="flex flex-col gap-1.5">
                <div
                  onClick={handleSeek}
                  className="relative w-full py-2 cursor-pointer select-none"
                  role="slider"
                  aria-label="Position de lecture"
                  aria-valuemin={0}
                  aria-valuemax={durationSec || 100}
                  aria-valuenow={playerState.currentTime}
                >
                  <div className="h-[4px] w-full bg-white/10 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#f2a33c] to-[#ff5722] rounded-full"
                      style={{ width: `${progressRatio * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-[#837e6f]">
                  <span className="text-[#ede8dd] font-medium">{formatTime(playerState.currentTime)}</span>
                  <span>{currentDuration}</span>
                </div>
              </div>

              {/* Main Playback Controls on Mobile */}
              <div className="flex items-center justify-center gap-6 py-2">
                <button
                  onClick={() => audioEngine.previous()}
                  className="p-3 text-[#b9b3a4] hover:text-[#ede8dd] rounded-full transition-colors active:scale-90"
                  aria-label="Morceau précédent"
                >
                  <SkipBack className="w-6 h-6" />
                </button>

                <button
                  onClick={onTogglePlay}
                  className="w-14 h-14 rounded-full bg-[#f2a33c] text-black flex items-center justify-center shadow-[0_0_25px_rgba(242,163,60,0.4)] active:scale-95 transition-transform"
                  aria-label={isPlaying ? 'Pause' : 'Lecture'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => audioEngine.next()}
                  className="p-3 text-[#b9b3a4] hover:text-[#ede8dd] rounded-full transition-colors active:scale-90"
                  aria-label="Morceau suivant"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>

              {/* Volume Slider on Mobile */}
              <div className="flex items-center justify-center gap-3 pt-1 pb-2">
                <button
                  onClick={toggleMute}
                  className="text-[#837e6f] hover:text-[#ede8dd]"
                  aria-label="Volume"
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
                  className="w-48 accent-[#f2a33c] h-1.5 bg-white/15 rounded-lg cursor-pointer"
                  aria-label="Volume"
                />
              </div>

              {/* Tracklist on Mobile */}
              <div className="border-t border-white/10 pt-3 space-y-1">
                {TRACKS.map((t, idx) => {
                  const isCurrent = playerState.currentTrackIndex === idx;
                  return (
                    <button
                      key={t.id}
                      onClick={() => audioEngine.setTrack(idx, true)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors ${
                        isCurrent
                          ? 'bg-white/10 text-[#f2a33c] font-medium'
                          : 'text-[#b9b3a4] hover:bg-white/5 hover:text-[#ede8dd]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
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
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP EXPERIENCE: Floating Dock Pill & Popover
          ───────────────────────────────────────────────────────────── */}
      <aside
        className="hidden sm:flex fixed right-6 bottom-6 z-[1000] flex-col items-end gap-3 pointer-events-auto select-none"
        aria-label="Lecteur audio d'ambiance"
        onClick={handleUserInteraction}
      >
        {/* Desktop Expanded Control Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-[360px] p-4 rounded-3xl bg-[#0a0a0cf5] border border-white/[0.12] backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col gap-3 font-sans text-left"
            >
              {/* Header: Authentic Micro-groove Vinyl & Track Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Realistic Spinning Vinyl Disc */}
                  <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-white/10 to-white/5 shadow-md flex items-center justify-center shrink-0 select-none">
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
                      <div className="w-4.5 h-4.5 rounded-full bg-gradient-to-br from-[#f2a33c] to-[#ff5722] border border-black/40 flex items-center justify-center shadow-inner relative z-10">
                        <span className="font-mono text-[7px] font-black text-black">
                          0{playerState.currentTrackIndex + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Track Metadata */}
                  <div>
                    <h4 className="text-sm font-bold text-[#ede8dd] tracking-tight">
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
                  className="p-1.5 text-[#b9b3a4] hover:text-[#ede8dd] rounded-xl hover:bg-white/5 transition-colors"
                  aria-label="Réduire le lecteur"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Apple Music / Siri Fluid Sound Ribbon Container */}
              <div className="relative w-full h-11 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden flex items-center justify-center p-1 select-none pointer-events-none">
                <canvas
                  ref={waveCanvasRef}
                  width={320}
                  height={40}
                  className="w-full h-full"
                />
              </div>

              {/* Hairline Interactive Scrubber Bar */}
              <div className="flex flex-col gap-1 -mt-0.5">
                <div
                  onClick={handleSeek}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoverRatio(null)}
                  className="relative w-full py-1.5 cursor-pointer group select-none"
                  role="slider"
                  aria-label="Position de lecture"
                  aria-valuemin={0}
                  aria-valuemax={durationSec || 100}
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
              <div className="flex items-center justify-between pt-0.5">
                {/* Prev / Play / Next Track */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => audioEngine.previous()}
                    className="p-2 text-[#b9b3a4] hover:text-[#ede8dd] rounded-full transition-colors active:scale-90"
                    aria-label="Morceau précédent"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onTogglePlay}
                    className="w-10 h-10 rounded-full bg-[#ede8dd] hover:bg-[#f2a33c] text-black flex items-center justify-center shadow-lg transition-all active:scale-95"
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
              <div className="border-t border-white/10 pt-2 space-y-0.5">
                {TRACKS.map((t, idx) => {
                  const isCurrent = playerState.currentTrackIndex === idx;
                  return (
                    <button
                      key={t.id}
                      onClick={() => audioEngine.setTrack(idx, true)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                        isCurrent
                          ? 'bg-white/10 text-[#f2a33c] font-medium'
                          : 'text-[#b9b3a4] hover:bg-white/5 hover:text-[#ede8dd]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
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

        {/* Desktop Compact Dock Pill */}
        <div
          className={`flex items-center gap-3 p-1.5 pr-4 rounded-full bg-[#0a0a0cf0] border backdrop-blur-2xl transition-all shadow-xl shadow-black/80 ${
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
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#ede8dd] truncate max-w-[130px]">
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
    </>
  );
};
