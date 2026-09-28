import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioEngine, TRACKS, type AudioPlayerState } from '../utils/audioSynth';
import { 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Mic2, 
  Music2, 
  ListMusic 
} from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AudioPlayer = ({ isPlaying, onTogglePlay }: AudioPlayerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue'>('player');
  const [playerState, setPlayerState] = useState<AudioPlayerState>(() => audioEngine.getState());
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);

  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Subscribe to audio engine updates
  useEffect(() => {
    return audioEngine.subscribe((next) => {
      setPlayerState({ ...next });
    });
  }, []);

  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentTrack = playerState.currentTrack;
  const currentDuration =
    playerState.duration > 0
      ? formatTime(playerState.duration)
      : currentTrack.defaultDuration;

  const durationSec = playerState.duration > 0 ? playerState.duration : 180;
  const progressRatio = durationSec > 0 ? Math.min(1, playerState.currentTime / durationSec) : 0;

  // Active lyric index based on current playback time
  const currentLyricIndex = currentTrack.lyrics?.reduce((acc, lyric, idx) => {
    if (playerState.currentTime >= lyric.time) {
      return idx;
    }
    return acc;
  }, 0) ?? 0;

  // Auto-scroll lyrics smoothly when current lyric line changes
  useEffect(() => {
    if (activeTab === 'lyrics' && activeLyricRef.current && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const activeEl = activeLyricRef.current;
      const targetScroll = activeEl.offsetTop - container.clientHeight / 2 + activeEl.clientHeight / 2;
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [currentLyricIndex, activeTab]);

  // Audio frequency wave visualizer loop
  useEffect(() => {
    if (!isExpanded || activeTab !== 'player') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Measure real audio frequency energy from Web Audio analyser
      const analyser = audioEngine.getAnalyser();
      let energy = 0;
      if (analyser && isPlaying) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let k = 0; k < data.length; k++) sum += data[k];
        energy = sum / (data.length * 255);
      }

      const time = performance.now() / 1000;
      const midY = height / 2;
      const dynamicAmp = isPlaying ? 3 + energy * 24 : 2;

      const layers = [
        { color: currentTrack.accentColor || '#ff1e38', lineWidth: 2, freq: 0.035, speed: 2.8, phase: 0 },
        { color: 'rgba(255, 255, 255, 0.45)', lineWidth: 1.2, freq: 0.045, speed: -2.2, phase: 1.8 },
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

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isExpanded, isPlaying, activeTab, currentTrack]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioEngine.seek(ratio * durationSec);
  };

  return (
    <>
      {/* Expanded Floating Music Player (Desktop & Mobile) */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[980] flex items-end sm:items-auto justify-center sm:justify-start pointer-events-auto">
            {/* Mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="sm:hidden fixed inset-0 bg-black/80 backdrop-blur-md"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', visualDuration: 0.32, bounce: 0.15 }}
              className="relative w-full sm:w-[400px] max-h-[85vh] sm:max-h-[580px] bg-[#09090b]/92 backdrop-blur-2xl border border-white/[0.12] rounded-t-3xl sm:rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden"
              style={{
                boxShadow: `0 20px 50px -10px ${currentTrack.accentColor}25, 0 10px 30px rgba(0,0,0,0.8)`,
              }}
            >
              {/* Dynamic ambient color glow in background */}
              <div
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none blur-3xl opacity-35 transition-colors duration-700"
                style={{ background: currentTrack.accentColor }}
                aria-hidden="true"
              />

              {/* Player Header */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/[0.08]">
                {/* Mode Tabs */}
                <div className="flex items-center gap-1 p-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[0.68rem] font-mono select-none">
                  <button
                    type="button"
                    onClick={() => setActiveTab('player')}
                    className={`relative px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'player' ? 'text-white font-semibold' : 'text-[#71717a] hover:text-white'
                    }`}
                  >
                    {activeTab === 'player' && (
                      <motion.div
                        layoutId="active-player-tab"
                        className="absolute inset-0 rounded-full bg-white/[0.12]"
                        transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.15 }}
                      />
                    )}
                    <Music2 className="w-3 h-3 relative z-10" />
                    <span className="relative z-10">Lecteur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('lyrics')}
                    className={`relative px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'lyrics' ? 'text-white font-semibold' : 'text-[#71717a] hover:text-white'
                    }`}
                  >
                    {activeTab === 'lyrics' && (
                      <motion.div
                        layoutId="active-player-tab"
                        className="absolute inset-0 rounded-full bg-white/[0.12]"
                        transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.15 }}
                      />
                    )}
                    <Mic2 className="w-3 h-3 relative z-10" />
                    <span className="relative z-10">Paroles</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('queue')}
                    className={`relative px-3 py-1 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'queue' ? 'text-white font-semibold' : 'text-[#71717a] hover:text-white'
                    }`}
                  >
                    {activeTab === 'queue' && (
                      <motion.div
                        layoutId="active-player-tab"
                        className="absolute inset-0 rounded-full bg-white/[0.12]"
                        transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.15 }}
                      />
                    )}
                    <ListMusic className="w-3 h-3 relative z-10" />
                    <span className="relative z-10">Tracks</span>
                  </button>
                </div>

                {/* Close / Minimize button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
                  aria-label="Réduire le lecteur"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="relative z-10 my-auto py-4 overflow-hidden">
                {activeTab === 'player' && (
                  <motion.div
                    key="player-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center text-center space-y-4"
                  >
                    {/* Vinyl / Cover Art with spinning animation on play */}
                    <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-white/[0.15] shadow-2xl group">
                      {currentTrack.coverImage ? (
                        <img
                          src={currentTrack.coverImage}
                          alt={currentTrack.title}
                          className={`w-full h-full object-cover transition-transform duration-700 ${
                            isPlaying ? 'scale-105' : 'scale-100'
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white">
                          <Music2 className="w-10 h-10 text-[#ff1e38]" />
                        </div>
                      )}

                      {/* Subtle vinyl groove shine overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/20 pointer-events-none" />

                      {/* Playing radar pulse */}
                      {isPlaying && (
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/[0.1] text-[0.62rem] font-mono text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>128K AAC</span>
                        </div>
                      )}
                    </div>

                    {/* Track Title & Artist */}
                    <div>
                      <h3 className="font-display font-semibold text-xl text-white tracking-tight">
                        {currentTrack.title}
                      </h3>
                      <p className="font-mono text-xs text-[#a1a1aa] mt-0.5">
                        {currentTrack.artist}
                      </p>
                    </div>

                    {/* Real-time Web Audio Harmonic Wave Canvas */}
                    <div className="w-full h-12 rounded-xl bg-black/40 border border-white/[0.06] overflow-hidden flex items-center justify-center p-1">
                      <canvas
                        ref={canvasRef}
                        width={350}
                        height={48}
                        className="w-full h-full"
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'lyrics' && (
                  <motion.div
                    key="lyrics-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-64 sm:h-72 flex flex-col"
                  >
                    <div className="text-left mb-2 flex items-center justify-between">
                      <span className="font-mono text-[0.65rem] text-[#71717a] uppercase tracking-wider">
                        Synchronisation en direct · Cliquez pour naviguer
                      </span>
                      <span
                        className="w-2 h-2 rounded-full shadow-sm"
                        style={{ background: currentTrack.accentColor }}
                      />
                    </div>

                    <div
                      ref={lyricsContainerRef}
                      className="flex-1 overflow-y-auto space-y-3.5 pr-1 scroll-smooth select-none text-left py-4"
                    >
                      {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                        currentTrack.lyrics.map((line, lIdx) => {
                          const isCurrent = lIdx === currentLyricIndex;
                          const isPast = lIdx < currentLyricIndex;

                          return (
                            <motion.div
                              key={lIdx}
                              ref={isCurrent ? activeLyricRef : null}
                              onClick={() => audioEngine.seek(line.time)}
                              whileHover={{ x: 4 }}
                              transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.1 }}
                              className={`transition-all duration-300 cursor-pointer rounded-xl px-2 py-1.5 ${
                                isCurrent
                                  ? 'text-white font-display font-semibold text-lg sm:text-xl leading-snug drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] bg-white/[0.04]'
                                  : isPast
                                  ? 'text-[#71717a] font-normal text-sm leading-relaxed opacity-50 hover:opacity-90'
                                  : 'text-[#a1a1aa] font-normal text-sm leading-relaxed opacity-70 hover:opacity-100'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                {isCurrent && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 animate-ping"
                                    style={{ background: currentTrack.accentColor }}
                                  />
                                )}
                                <span>{line.text}</span>
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="text-center py-12 text-[#71717a] font-mono text-xs">
                          Paroles instrumentales
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'queue' && (
                  <motion.div
                    key="queue-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-64 sm:h-72 overflow-y-auto space-y-2 text-left"
                  >
                    <span className="font-mono text-[0.65rem] text-[#71717a] uppercase tracking-wider block mb-2">
                      Playlist Ares
                    </span>
                    {TRACKS.map((t, idx) => {
                      const isSelected = playerState.currentTrackIndex === idx;
                      return (
                        <motion.button
                          key={t.id}
                          type="button"
                          onClick={() => audioEngine.setTrack(idx, true)}
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-white/[0.08] border-white/20 text-white shadow-md'
                              : 'bg-black/30 border-white/[0.06] text-[#a1a1aa] hover:bg-white/[0.04] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-mono text-xs ${
                                isSelected ? 'text-white font-bold' : 'text-[#71717a]'
                              }`}
                            >
                              0{idx + 1}
                            </span>
                            <div className="truncate">
                              <p className="font-display font-medium text-sm text-white truncate">
                                {t.title}
                              </p>
                              <p className="font-mono text-[0.65rem] text-[#71717a] truncate">
                                {t.artist}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelected && isPlaying && (
                              <div className="flex items-end gap-[2px] h-3 w-3 text-[#ff1e38]">
                                <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-1" />
                                <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-2" />
                                <span className="w-[2px] bg-[#ff1e38] rounded-full eq-bar-3" />
                              </div>
                            )}
                            <span className="font-mono text-xs text-[#71717a]">
                              {t.defaultDuration}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              {/* Player Controls & Scrubber */}
              <div className="relative z-10 pt-3 border-t border-white/[0.08] space-y-3">
                {/* Time & Scrubber */}
                <div>
                  <div
                    onClick={handleSeek}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoverRatio((e.clientX - rect.left) / rect.width);
                    }}
                    onMouseLeave={() => setHoverRatio(null)}
                    className="relative w-full h-2 rounded-full bg-white/[0.08] hover:h-2.5 transition-all cursor-pointer overflow-hidden group"
                  >
                    {/* Hover ghost scrubber */}
                    {hoverRatio !== null && (
                      <div
                        className="absolute inset-y-0 left-0 bg-white/20 pointer-events-none"
                        style={{ width: `${hoverRatio * 100}%` }}
                      />
                    )}
                    {/* Active progress fill */}
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-100 rounded-full"
                      style={{
                        width: `${progressRatio * 100}%`,
                        background: currentTrack.accentColor || '#ff1e38',
                        boxShadow: `0 0 10px ${currentTrack.accentColor || '#ff1e38'}80`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between font-mono text-[0.65rem] text-[#71717a] mt-1.5">
                    <span>{formatTime(playerState.currentTime)}</span>
                    <span>{currentDuration}</span>
                  </div>
                </div>

                {/* Tactile Playback Action Bar */}
                <div className="flex items-center justify-between">
                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => audioEngine.toggleMute()}
                      className="p-1.5 rounded-lg text-[#a1a1aa] hover:text-white transition-colors cursor-pointer"
                      title={playerState.isMuted ? 'Activer le son' : 'Couper le son'}
                    >
                      {playerState.isMuted || playerState.volume === 0 ? (
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
                      value={playerState.isMuted ? 0 : playerState.volume}
                      onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
                      className="w-16 h-1 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-[#ff1e38]"
                    />
                  </div>

                  {/* Previous / Play / Next */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => audioEngine.previous()}
                      className="p-2 rounded-full text-[#a1a1aa] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                      aria-label="Piste précédente"
                    >
                      <SkipBack className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={onTogglePlay}
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform"
                      style={{
                        background: currentTrack.accentColor || '#ff1e38',
                        boxShadow: `0 0 20px ${currentTrack.accentColor || '#ff1e38'}60`,
                      }}
                      aria-label={isPlaying ? 'Pause' : 'Lecture'}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-white" />
                      ) : (
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      )}
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => audioEngine.next()}
                      className="p-2 rounded-full text-[#a1a1aa] hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                      aria-label="Piste suivante"
                    >
                      <SkipForward className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Mode badge */}
                  <span className="font-mono text-[0.62rem] text-[#71717a] uppercase tracking-wider">
                    HD AUDIO
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mini Dock (Bottom Right on Desktop / Bottom Center on Mobile) */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', visualDuration: 0.28, bounce: 0.15 }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[950] pointer-events-auto"
        >
          <div
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-3 p-2 pr-3.5 rounded-full bg-[#09090b]/90 backdrop-blur-xl border border-white/[0.12] hover:border-white/30 text-white shadow-[0_10px_35px_rgba(0,0,0,0.85)] cursor-pointer group transition-all"
            style={{
              boxShadow: isPlaying
                ? `0 0 25px -5px ${currentTrack.accentColor}40, 0 10px 30px rgba(0,0,0,0.8)`
                : undefined,
            }}
          >
            {/* Spinning Album Disc Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePlay();
              }}
              className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-white/[0.15] shadow-sm"
              style={{ background: currentTrack.accentColor || '#ff1e38' }}
              title={isPlaying ? 'Pause' : 'Lecture'}
            >
              {currentTrack.coverImage ? (
                <img
                  src={currentTrack.coverImage}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '6s' }}
                />
              ) : null}

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 text-white fill-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                )}
              </div>
            </motion.div>

            {/* Track Info */}
            <div className="text-left select-none max-w-[120px] sm:max-w-[160px] truncate">
              <p className="font-display font-medium text-xs text-white truncate group-hover:text-[#ff1e38] transition-colors">
                {currentTrack.title}
              </p>
              <p className="font-mono text-[0.62rem] text-[#71717a] truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Equalizer Wave Bars */}
            {isPlaying ? (
              <div className="flex items-end gap-[2px] h-3.5 w-3 text-[#ff1e38] shrink-0">
                <span className="w-[2px] rounded-full eq-bar-1" style={{ background: currentTrack.accentColor }} />
                <span className="w-[2px] rounded-full eq-bar-2" style={{ background: currentTrack.accentColor }} />
                <span className="w-[2px] rounded-full eq-bar-3" style={{ background: currentTrack.accentColor }} />
              </div>
            ) : (
              <span className="font-mono text-[0.62rem] text-[#71717a] shrink-0">
                OFF
              </span>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};
