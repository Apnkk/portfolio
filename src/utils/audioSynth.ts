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
    accentColor: '#f2a33c',
    coverImage: 'data:image/jpeg;base64,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',
    waveform: [
      0.45, 0.65, 0.85, 0.95, 0.78, 0.82, 0.68, 0.9, 0.75, 0.88, 0.92, 0.7, 0.85, 0.95, 0.8, 0.6,
      0.75, 0.9, 0.85, 0.7, 0.65, 0.8, 0.95, 0.88, 0.72, 0.65, 0.82, 0.9, 0.78, 0.65, 0.75, 0.85,
    ],
    lyrics: [
      { time: 0, text: "• • •" },
      { time: 5.27, text: "Gone a little far" },
      { time: 7.50, text: "Gone a little far this time with something" },
      { time: 14.95, text: "How was I to know?" },
      { time: 17.24, text: "How was I to know? This high came rushing" },
      { time: 24.55, text: "We're on the borderline" },
      { time: 27.37, text: "Dangerously fine and unforgiving" },
      { time: 34.68, text: "Possibly a sign" },
      { time: 36.84, text: "I'm gonna have the strangest night on Sunday" },
      { time: 46.27, text: "Here I go" },
      { time: 48.57, text: "Quite a show for a loner in LA" },
      { time: 53.98, text: "I wonder how I managed to end up in this place" },
      { time: 60.83, text: "Where I couldn't get away" },
      { time: 63.73, text: "We're on the borderline" },
      { time: 66.39, text: "Caught between the tides of pain and rapture" },
      { time: 73.76, text: "Then I saw the time" },
      { time: 76.12, text: "Watched it speedin' by like a train" },
      { time: 80.57, text: "Like a train..." },
      { time: 90.22, text: "Will I be known and loved?" },
      { time: 92.86, text: "Is there one that I trust?" },
      { time: 94.90, text: "Starting to sober up" },
      { time: 97.67, text: "Has it been long enough?" },
      { time: 100.03, text: "Will I be known and loved?" },
      { time: 102.66, text: "Any closer, close enough" },
      { time: 105.16, text: "I'm a loser, loosen up" },
      { time: 107.21, text: "Setting free, must be tough" },
      { time: 109.89, text: "Will I be known and loved?" },
      { time: 112.23, text: "Is there one that I trust?" },
      { time: 114.72, text: "Starting to sober up" },
      { time: 117.27, text: "Has it been long enough?" },
      { time: 119.52, text: "Will I be so in love?" },
      { time: 122.23, text: "Any closer, close enough" },
      { time: 124.54, text: "Shout out to what is done" },
      { time: 126.93, text: "R.I.P. here comes the sun" },
      { time: 137.89, text: "Here comes the sun..." },
      { time: 140.00, text: "Gone a little far" },
      { time: 142.39, text: "Gone a little far this time with something" },
      { time: 149.66, text: "Rudi said it's fine" },
      { time: 151.97, text: "They used to do this all the time in college" },
      { time: 158.93, text: "And we're on the borderline" },
      { time: 161.95, text: "Caught between the tides of pain and rapture" },
      { time: 169.14, text: "Then I saw the time" },
      { time: 171.62, text: "Watched it speedin' by like a train" },
      { time: 176.17, text: "Will I be known and loved?" },
      { time: 178.38, text: "Is there one that I trust?" },
      { time: 180.70, text: "Starting to sober up" },
      { time: 183.44, text: "Has it been long enough?" },
      { time: 185.80, text: "Will I be known and loved?" },
      { time: 188.17, text: "Any closer, close enough" },
      { time: 190.86, text: "I'm a loser, loosen up" },
      { time: 193.17, text: "Setting free, must be tough" },
      { time: 195.57, text: "Will I be known and loved?" },
      { time: 197.93, text: "Is there one that I trust?" },
      { time: 200.20, text: "Starting to sober up" },
      { time: 202.93, text: "Has it been long enough?" },
      { time: 205.30, text: "Will I be so in love?" },
      { time: 207.82, text: "Any closer, close enough" },
      { time: 210.13, text: "Shout out to what is done" },
      { time: 212.74, text: "R.I.P. here comes the sun" },
      { time: 223.44, text: "Here comes the sun..." },
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
    ],
    lyrics: [
      { time: 0, text: "♪ (Hoodtrap 808 & Hi-Hats) ♪" },
      { time: 14.0, text: "And Jane, you're early" },
      { time: 17.5, text: "Your life's work is dirtied by the" },
      { time: 21.0, text: "Fools who adore you" },
      { time: 24.5, text: "Only to find, only to find you out" },
      { time: 28.0, text: "They saw you dressing in the backroom" },
      { time: 32.0, text: "Now they'll pay what they owe you" },
      { time: 36.0, text: "It's only small change, red on the green, green grass" },
      { time: 43.5, text: "Won't the devil take you back for more" },
      { time: 47.0, text: "To open-closed doors" },
      { time: 50.5, text: "And keep the bull from the brave" },
      { time: 54.0, text: "Taste of the violence, trying to silence her head" },
      { time: 62.0, text: "♪ (808 Bassline Roll) ♪" },
      { time: 74.0, text: "And Jane, you're early" },
      { time: 77.5, text: "Your life's work is dirtied by the fools who adore you" },
      { time: 84.0, text: "Biding your time, biding your time to strike" },
      { time: 89.0, text: "Surely, the poison makes a portrait of your face" },
      { time: 94.5, text: "In the mirror, smiling with fright" },
      { time: 104.0, text: "♪ (Heavy Bassline Drop) ♪" },
      { time: 118.0, text: "And Jane, you're early" },
      { time: 122.0, text: "Your life's work is dirtied by the fools who adore you" },
      { time: 128.0, text: "Only to find you out..." },
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
    ],
    lyrics: [
      { time: 0, text: "♪ (West Coast Intro) ♪" },
      { time: 2.16, text: "Yeah, what up? This is Dr. Dre" },
      { time: 4.75, text: "The party's goin' on" },
      { time: 9.07, text: "Thank God it's Friday" },
      { time: 11.71, text: "Buck, buck, buck, buck, booyaka shan!" },
      { time: 19.95, text: "Keep their heads ringin'" },
      { time: 21.63, text: "Ring, ding-dong, ring-a-ding, ding, ding-dong" },
      { time: 25.24, text: "Keep their heads ringin'" },
      { time: 26.90, text: "Ring, ding-dong, ring-a-ding, ding, ding-dong" },
      { time: 31.28, text: "Hey you, sittin' over there (say what?)" },
      { time: 33.84, text: "You better get up out of your chair (that's right)" },
      { time: 36.59, text: "And work your body down (yeah)" },
      { time: 39.13, text: "No time to funk around 'cause we gon'" },
      { time: 42.18, text: "Funk you right on up" },
      { time: 44.31, text: "So get up, get a move on, and get your groove on" },
      { time: 47.86, text: "It's the D-R-E the spectacular" },
      { time: 50.05, text: "In a party, I go for your neck so call me 'Blacula'" },
      { time: 53.16, text: "As I drain a jugular vein" },
      { time: 55.12, text: "And maintain to leave blood stains so don't complain" },
      { time: 57.85, text: "Just chill, listen to the beats I spill" },
      { time: 60.43, text: "Keepin' it real, enables me to make another meal" },
      { time: 63.32, text: "Still, niggas run up and try to kill at will" },
      { time: 65.74, text: "But get popped like a pimple, so call me Clearasil" },
      { time: 68.30, text: "I wipe niggas off the face of the Earth since birth" },
      { time: 70.90, text: "I been a bad nigga, now let me tell you what I'm worth" },
      { time: 74.01, text: "More than a stealth bomber, I cause drama" },
      { time: 76.32, text: "The enforcer, music flows like a flying saucer" },
      { time: 79.93, text: "Or a 747 jet, never forget" },
      { time: 82.19, text: "I'm that brother that keeps the hoes panties wet" },
      { time: 84.58, text: "The mic gets smoked, once you hear the beat kick" },
      { time: 87.17, text: "With grooves so funky, they come with a Speed Stick" },
      { time: 90.15, text: "So check the flavor that I'm bringin'" },
      { time: 91.80, text: "The D-R-E, I keep their heads ringin'" },
      { time: 95.23, text: "Ring, ding-dong, ring-a-ding, ding, ding-dong" },
      { time: 99.54, text: "Keep their heads ringin'" },
      { time: 101.66, text: "Ring, ding-dong, ring-a-ding, ding, ding-dong" },
      { time: 105.49, text: "One, two for the crew, three, four for the dough" },
      { time: 108.18, text: "Five for the hoes, six, seven, eight for Death Row" },
      { time: 110.70, text: "Mad minds about to feel the full effect of intellect" },
      { time: 113.69, text: "So I can collect respect, plus a check" },
      { time: 116.16, text: "Now, I fin' to, get into to my mental" },
      { time: 118.24, text: "Will take care of this business, I need to attend to" },
      { time: 121.99, text: "And this rap shit's my meal ticket" },
      { time: 123.99, text: "So you goddamn right I'ma kick it" },
      { time: 127.23, text: "I bring terror like Stephen King" },
      { time: 128.90, text: "A black Casanova, runnin' people over like Christine" },
      { time: 132.26, text: "When I rock the spot with the flavor I got" },
      { time: 137.37, text: "As I blast past another that thought he was strong" },
      { time: 140.39, text: "When I flow, people know, it's time to take a hike" },
      { time: 145.40, text: "'Cause I grab the mic and flip" },
      { time: 147.91, text: "I got rhymes to keep you enchanted" },
      { time: 153.61, text: "So check the flavor that I'm bringin'" },
      { time: 155.42, text: "The D-R-E, I keep their heads ringin'" },
      { time: 159.80, text: "Ring, ding-dong, ring-a-ding, ding, ding-dong" },
      { time: 163.14, text: "Keep their heads ringin'" },
      { time: 165.85, text: "Ring, ding-dong, ring-a-ding, ding, ding-dong" },
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

    // High-resolution ticker (every 50ms) for millisecond-accurate lyric synchronization
    setInterval(() => {
      if (this.isPlaying && this.audio && !this.audio.paused) {
        this.notify();
      }
    }, 50);
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

  private freqData: Uint8Array<ArrayBuffer> | null = null;

  public getBands(): { bass: number; mid: number; treble: number; level: number } {
    if (!this.analyser || !this.isPlaying) {
      return { bass: 0, mid: 0, treble: 0, level: 0 };
    }
    if (!this.freqData || this.freqData.length !== this.analyser.frequencyBinCount) {
      this.freqData = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
    }
    this.analyser.getByteFrequencyData(this.freqData);

    const len = this.freqData.length;
    const bassCount = Math.max(1, Math.floor(len * 0.05));
    let bassSum = 0;
    for (let i = 0; i < bassCount; i++) bassSum += this.freqData[i];

    const midCount = Math.max(1, Math.floor(len * 0.25));
    let midSum = 0;
    for (let i = bassCount; i < bassCount + midCount; i++) midSum += this.freqData[i];

    const trebleCount = Math.max(1, Math.floor(len * 0.4));
    let trebleSum = 0;
    for (let i = bassCount + midCount; i < Math.min(len, bassCount + midCount + trebleCount); i++) {
      trebleSum += this.freqData[i];
    }

    const bass = bassSum / (bassCount * 255);
    const mid = midSum / (midCount * 255);
    const treble = trebleSum / (trebleCount * 255);
    const level = bass * 0.5 + mid * 0.3 + treble * 0.2;

    return { bass, mid, treble, level };
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
