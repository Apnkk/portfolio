// Web Audio API Ambient Synthesizer for "Listen while browsing"
// Generates warm, lush ambient lo-fi chords in real time without external mp3 dependencies.

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private timer: number | null = null;
  private step = 0;
  private volume = 0.5;

  private chords = [
    [220.00, 261.63, 329.63, 392.00], // Am7
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [130.81, 164.81, 196.00, 246.94], // Cmaj7
    [196.00, 246.94, 293.66, 349.23], // G7
  ];

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
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

  public async play(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        // Suspended pending user interaction
      }
    }

    if (this.isPlaying) return true;

    this.isPlaying = true;
    document.body.classList.add('is-playing');
    this.scheduleNextChord();
    return true;
  }

  public pause() {
    this.isPlaying = false;
    document.body.classList.remove('is-playing');
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private scheduleNextChord() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const chord = this.chords[this.step % this.chords.length];
    const now = this.ctx.currentTime;
    const duration = 4.0; // 4 seconds per chord

    // Play chord voices with soft attack and warm decay
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq * (idx === 0 ? 0.5 : 1), now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + Math.sin(this.step) * 200, now);
      filter.Q.setValueAtTime(2, now);

      // Envelope: swell in and fade smoothly
      const noteVol = 0.08 / chord.length;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(noteVol, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });

    this.step++;
    this.timer = window.setTimeout(() => {
      this.scheduleNextChord();
    }, (duration - 0.5) * 1000);
  }
}

export const audioEngine = new AmbientAudioEngine();
