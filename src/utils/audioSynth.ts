// Audio Engine for Ares Portfolio
// Plays high-fidelity original music tracks with Web Audio API Analyser visualizer support.

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  defaultDuration: string;
  waveform: number[];
}

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTrackIndex: number;
  currentTrack: Track;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

export const TRACKS: Track[] = [
  {
    id: 'dear-black',
    title: 'DEAR BLACK',
    artist: 'Ares',
    src: '/music/DEAR%20BLACK.mp3',
    defaultDuration: '0:21',
    waveform: [
      0.95, 0.45, 0.55, 0.68, 0.72, 0.58, 0.65, 0.82, 0.9, 0.75, 0.62, 0.78, 0.88, 0.92, 0.7, 0.65,
      0.85, 0.95, 0.8, 0.6, 0.75, 0.9, 0.85, 0.7, 0.65, 0.8, 0.95, 0.88, 0.72, 0.65, 0.82, 0.9,
      0.78, 0.65, 0.75, 0.85, 0.7, 0.6, 0.55, 0.48, 0.38, 0.25,
    ],
  },
  {
    id: 'jane-your-early',
    title: 'JANE YOUR EARLY',
    artist: 'Ares',
    src: '/music/JANE%20YOUR%20EARLY.mp3',
    defaultDuration: '0:23',
    waveform: [
      0.93, 0.57, 0.73, 0.72, 0.63, 0.81, 0.59, 0.51, 0.75, 0.81, 0.59, 0.8, 0.45, 0.7, 0.67, 0.4,
      0.55, 0.67, 0.61, 0.59, 1.0, 0.75, 0.58, 0.67, 0.7, 0.59, 0.65, 0.72, 0.8, 0.55, 0.68, 0.71,
      0.52, 0.64, 0.68, 0.69, 0.53, 0.48, 0.57, 0.53, 0.38, 0.28,
    ],
  },
  {
    id: 'sega',
    title: 'SEGA',
    artist: 'Ares',
    src: '/music/SEGA.mp3',
    defaultDuration: '0:12',
    waveform: [
      0.68, 0.71, 0.63, 0.69, 0.74, 0.65, 0.79, 1.0, 0.89, 0.84, 0.95, 0.74, 0.91, 0.65, 0.86, 0.81,
      0.67, 0.73, 0.83, 0.73, 0.65, 0.81, 0.9, 0.79, 0.71, 0.76, 0.82, 0.7, 0.89, 0.76, 0.85, 0.91,
      0.89, 0.96, 0.87, 0.78, 0.79, 0.75, 0.88, 0.69, 0.55, 0.3,
    ],
  },
];

class PortfolioAudioEngine {
  private tracks: Track[] = TRACKS;
  private currentTrackIndex = 0;
  private isPlaying = false;
  private volume = 0.5;
  private isMuted = false;

  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private isGraphConnected = false;

  private listeners = new Set<(state: AudioPlayerState) => void>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentTrackIndex = this.getRandomTrackIndex();
      this.initAudio();
    }
  }

  private getRandomTrackIndex(): number {
    if (this.tracks.length <= 1) return 0;
    try {
      const lastTrack = sessionStorage.getItem('ares_last_track_id');
      const eligible = this.tracks
        .map((t, idx) => ({ track: t, idx }))
        .filter((item) => item.track.id !== lastTrack);
      const chosen =
        eligible.length > 0
          ? eligible[Math.floor(Math.random() * eligible.length)]
          : { idx: Math.floor(Math.random() * this.tracks.length) };
      sessionStorage.setItem('ares_last_track_id', this.tracks[chosen.idx].id);
      return chosen.idx;
    } catch {
      return Math.floor(Math.random() * this.tracks.length);
    }
  }

  private initAudio() {
    if (this.audio) return;
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.crossOrigin = 'anonymous';
    this.audio.src = this.tracks[this.currentTrackIndex].src;
    this.audio.volume = this.volume;

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      if (typeof document !== 'undefined') {
        document.body.classList.add('is-playing');
      }
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      if (typeof document !== 'undefined') {
        document.body.classList.remove('is-playing');
      }
      this.notify();
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.notify();
    });

    this.audio.addEventListener('durationchange', () => {
      this.notify();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.notify();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio playback notice:', e);
      this.isPlaying = false;
      this.notify();
    });
  }

  private initContext() {
    if (this.isGraphConnected || typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      if (!this.ctx) {
        this.ctx = new AudioContextClass();
      }
      if (!this.analyser) {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.78;
        this.analyser.minDecibels = -85;
        this.analyser.maxDecibels = -10;
      }
      if (!this.gainNode) {
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      }

      if (this.audio && !this.sourceNode) {
        this.sourceNode = this.ctx.createMediaElementSource(this.audio);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        this.isGraphConnected = true;
      }
    } catch (e) {
      console.warn('Web Audio Graph initialization note:', e);
    }
  }

  public resumeContext(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audio;
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  public getState(): AudioPlayerState {
    const currentTrack = this.tracks[this.currentTrackIndex] || this.tracks[0];
    return {
      isPlaying: this.isPlaying,
      currentTrackIndex: this.currentTrackIndex,
      currentTrack,
      currentTime: this.audio?.currentTime || 0,
      duration: this.audio?.duration && !isNaN(this.audio.duration) ? this.audio.duration : 0,
      volume: this.volume,
      isMuted: this.isMuted,
    };
  }

  public subscribe(listener: (state: AudioPlayerState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (err) {
        console.error('Audio subscriber error:', err);
      }
    });
  }

  public async play(): Promise<boolean> {
    this.initAudio();
    this.initContext();

    if (!this.audio) return false;

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // Awaiting gesture
      }
    }

    try {
      await this.audio.play();
      this.isPlaying = true;
      if (typeof document !== 'undefined') {
        document.body.classList.add('is-playing');
      }
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    if (typeof document !== 'undefined') {
      document.body.classList.remove('is-playing');
    }
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      void this.play();
      return true;
    }
  }

  public setTrack(index: number, autoPlay = true): void {
    this.initAudio();
    this.currentTrackIndex = (index + this.tracks.length) % this.tracks.length;
    const track = this.tracks[this.currentTrackIndex];
    try {
      sessionStorage.setItem('ares_last_track_id', track.id);
    } catch {
      // ignore
    }
    if (this.audio) {
      const wasPlaying = this.isPlaying;
      this.audio.src = track.src;
      this.audio.currentTime = 0;
      if (autoPlay || wasPlaying) {
        void this.play();
      } else {
        this.notify();
      }
    }
  }

  public next(): void {
    this.setTrack(this.currentTrackIndex + 1, true);
  }

  public previous(): void {
    if (this.audio && this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      void this.play();
    } else {
      this.setTrack(this.currentTrackIndex - 1, true);
    }
  }

  public seek(seconds: number): void {
    if (this.audio && !isNaN(seconds)) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration || 0));
      this.notify();
    }
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
    }
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    const effectiveVol = this.isMuted ? 0 : this.volume;
    if (this.audio) {
      this.audio.volume = effectiveVol;
    }
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
    }
    this.notify();
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getTracks(): Track[] {
    return this.tracks;
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  public getCurrentTrack(): Track {
    return this.tracks[this.currentTrackIndex] || this.tracks[0];
  }
}

export const audioEngine = new PortfolioAudioEngine();
