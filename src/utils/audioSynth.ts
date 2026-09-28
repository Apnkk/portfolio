// Audio Engine for Ares Portfolio
// Plays high-fidelity original music tracks with Web Audio API Analyser visualizer support & Synchronized Lyrics.

export interface LyricLine {
  time: number; // In seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
  defaultDuration: string;
  accentColor: string;
  coverImage?: string;
  waveform: number[];
  lyrics: LyricLine[];
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
    id: 'borderline',
    title: 'Borderline',
    artist: 'Tame Impala',
    src: '/music/borderline.m4a',
    defaultDuration: '3:57',
    accentColor: '#ff1e38',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80',
    waveform: [
      0.45, 0.65, 0.85, 0.95, 0.78, 0.82, 0.68, 0.9, 0.75, 0.88, 0.92, 0.7, 0.85, 0.95, 0.8, 0.6,
      0.75, 0.9, 0.85, 0.7, 0.65, 0.8, 0.95, 0.88, 0.72, 0.65, 0.82, 0.9, 0.78, 0.65, 0.75, 0.85,
      0.7, 0.6, 0.55, 0.48, 0.38, 0.25, 0.45, 0.6,
    ],
    lyrics: [
      { time: 0, text: "♪ (Intro - Synth Groove) ♪" },
      { time: 14, text: "Gone a little far" },
      { time: 17, text: "Gone a little far this time for something" },
      { time: 21, text: "How was I to know?" },
      { time: 24, text: "How was I to know this high came rushing?" },
      { time: 28, text: "We're on the borderline" },
      { time: 32, text: "Caught between the tides of pain and rapture" },
      { time: 36, text: "Then I saw the time" },
      { time: 39, text: "Watched it speedin' by like a train" },
      { time: 43, text: "Like a train..." },
      { time: 48, text: "How was I to know?" },
      { time: 51, text: "How was I to know this dark emotion?" },
      { time: 56, text: "Maybe I'm the one" },
      { time: 59, text: "Maybe I'm the one who's lost in something" },
      { time: 63, text: "Shout out to what is done" },
      { time: 66, text: "Shout out to what is done for nothing" },
      { time: 70, text: "How was I to know?" },
      { time: 73, text: "How was I to know this high came rushing?" },
      { time: 78, text: "We're on the borderline" },
      { time: 82, text: "Dangerously far and all forgiven" },
      { time: 85, text: "Possibly a sign" },
      { time: 89, text: "I'm gonna have the strangest night on Sunday" },
      { time: 93, text: "Coming from their eyes" },
      { time: 96, text: "Coming from their eyes is all I'm hearing" },
      { time: 100, text: "Oh, and I couldn't get away" },
      { time: 107, text: "Will I be known and loved?" },
      { time: 111, text: "Is there one that I trust?" },
      { time: 115, text: "Has it been long enough?" },
      { time: 118, text: "Will I be known and loved?" },
      { time: 122, text: "Will I be known and loved?" },
      { time: 126, text: "Is there one that I trust?" },
      { time: 130, text: "Has it been long enough?" },
      { time: 133, text: "Will I be so in love?" },
    ],
  },
  {
    id: 'jane-hoodtrap',
    title: 'Jane! (Hoodtrap)',
    artist: 'Qura & pipenpodol',
    src: '/music/jane.m4a',
    defaultDuration: '2:18',
    accentColor: '#a855f7',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&q=80',
    waveform: [
      0.93, 0.57, 0.73, 0.72, 0.63, 0.81, 0.59, 0.51, 0.75, 0.81, 0.59, 0.8, 0.45, 0.7, 0.67, 0.4,
      0.55, 0.67, 0.61, 0.59, 1.0, 0.75, 0.58, 0.67, 0.7, 0.59, 0.65, 0.72, 0.8, 0.55, 0.68, 0.71,
      0.52, 0.64, 0.68, 0.69, 0.53, 0.48, 0.57, 0.53,
    ],
    lyrics: [
      { time: 0, text: "♪ (Hoodtrap 808 & Hi-Hats) ♪" },
      { time: 8, text: "And Jane, you're early" },
      { time: 12, text: "Your life's work is dirtied by the" },
      { time: 16, text: "Fools who adore you" },
      { time: 20, text: "Only to find, only to find you out" },
      { time: 24, text: "They saw you dressing in the backroom" },
      { time: 28, text: "Now they'll pay what they owe you" },
      { time: 32, text: "It's only small change, red on the green, green grass" },
      { time: 40, text: "Won't the devil take you back for more" },
      { time: 44, text: "To open-closed doors" },
      { time: 47, text: "And keep the bull from the brave" },
      { time: 51, text: "Taste of the violence, trying to silence her head" },
      { time: 57, text: "And Jane, you're early" },
      { time: 61, text: "Your life's work is dirtied by the fools who adore you" },
      { time: 66, text: "Biding your time, biding your time to strike" },
      { time: 70, text: "Surely, the poison makes a portrait of your" },
      { time: 75, text: "Face in the mirror, smiling with fright" },
      { time: 82, text: "♪ (Heavy Bassline Drop) ♪" },
      { time: 98, text: "And Jane, you're early" },
      { time: 102, text: "Your life's work is dirtied by the fools who adore you" },
      { time: 107, text: "Only to find you out..." },
    ],
  },
  {
    id: 'ring-ding-dong',
    title: "Keep Their Heads Ringin'",
    artist: 'Dr. Dre',
    src: '/music/ring-ding-dong.m4a',
    defaultDuration: '5:05',
    accentColor: '#10b981',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
    waveform: [
      0.68, 0.71, 0.63, 0.69, 0.74, 0.65, 0.79, 1.0, 0.89, 0.84, 0.95, 0.74, 0.91, 0.65, 0.86, 0.81,
      0.67, 0.73, 0.83, 0.73, 0.65, 0.81, 0.9, 0.79, 0.71, 0.76, 0.82, 0.7, 0.89, 0.76, 0.85, 0.91,
      0.89, 0.96, 0.87, 0.78, 0.79, 0.75, 0.88, 0.69,
    ],
    lyrics: [
      { time: 0, text: "♪ Ring ding dong, ring-a-ding ding ding dong ♪" },
      { time: 5, text: "Keep their heads ringin'" },
      { time: 9, text: "Ring ding dong, ring-a-ding ding ding dong" },
      { time: 14, text: "Keep their heads ringin'" },
      { time: 18, text: "Hey you, sittin' over there" },
      { time: 20, text: "Say what? You're starin' like you wanna rap or somethin'" },
      { time: 23, text: "Party people in the place, get down" },
      { time: 26, text: "Just grab a partner and move to the sound" },
      { time: 30, text: "1, 2, 3, and to the 4" },
      { time: 32, text: "Dr. Dre is at the door, ready to make an entrance" },
      { time: 36, text: "So back on up, 'cause I'm about to blow" },
      { time: 39, text: "Shit, you'd probably thought I wouldn't flow no more" },
      { time: 43, text: "Now take a seat in the back and observe" },
      { time: 46, text: "I'm about to get the hype that you all deserve" },
      { time: 49, text: "Ring ding dong, ring-a-ding ding ding dong" },
      { time: 54, text: "Keep their heads ringin'..." },
      { time: 58, text: "Ring ding dong, ring-a-ding ding ding dong" },
    ],
  },
];

class PortfolioAudioEngine {
  private tracks: Track[] = TRACKS;
  private currentTrackIndex = 0;
  private isPlaying = false;
  private volume = 0.35;
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
      this.currentTrackIndex = 0;
      this.initAudio();
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
        this.audio.volume = 1;
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
    const effectiveVol = this.isMuted ? 0 : this.volume;
    if (this.isGraphConnected && this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
      if (this.audio) this.audio.volume = 1;
    } else if (this.audio) {
      this.audio.volume = effectiveVol;
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    const effectiveVol = this.isMuted ? 0 : this.volume;
    if (this.isGraphConnected && this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
      if (this.audio) this.audio.volume = 1;
    } else if (this.audio) {
      this.audio.volume = effectiveVol;
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
