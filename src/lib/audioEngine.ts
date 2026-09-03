// Web Audio API + Speech Synthesis podcast audio engine

class SimulatorAudioEngine {
  private audioCtx: AudioContext | null = null;
  private oscInterval: any = null;
  private isPlaying: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onTickCallback: ((seconds: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private elapsedSeconds: number = 0;
  private timerInterval: any = null;

  public start(
    textToSpeak: string,
    language: 'ru' | 'en',
    onTick: (seconds: number) => void,
    onEnd: () => void
  ) {
    this.stop();
    this.isPlaying = true;
    this.onTickCallback = onTick;
    this.onEndCallback = onEnd;
    this.elapsedSeconds = 0;

    // Start timer tick
    this.timerInterval = setInterval(() => {
      if (this.isPlaying) {
        this.elapsedSeconds += 1;
        if (this.onTickCallback) {
          this.onTickCallback(this.elapsedSeconds);
        }
      }
    }, 1000);

    // 1. Play ambient studio lofi drone/chords using Web Audio API
    this.startAmbientBeat();

    // 2. Play speech synthesis voice
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const spokenText =
        language === 'ru'
          ? 'Привет всем! Сегодня в подкасте говорим о том, как закрывать B2B-сделки на миллионы через экспертный контент. Главная ошибка большинства фаундеров — записывать часовой подкаст и просто положить его в архив. Если из этого не сделано 15 постов в соцсети — вы теряете 90 процентов охвата.'
          : 'Welcome everyone! Today we are discussing how to turn a single recording into an omnichannel distribution engine. The biggest mistake founders make is recording a high-value podcast and leaving it in an archive. RepurposeFlow transforms it into 15 publish-ready social assets in three minutes.';

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.lang = language === 'ru' ? 'ru-RU' : 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Find natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) =>
        language === 'ru' ? v.lang.startsWith('ru') : v.lang.startsWith('en')
      );
      if (match) utterance.voice = match;

      utterance.onend = () => {
        this.stop();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }

  private startAmbientBeat() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.audioCtx = new AudioCtx();

      const playChord = () => {
        if (!this.audioCtx || !this.isPlaying) return;

        const frequencies = [220, 277.18, 329.63, 440]; // A major warm chord
        frequencies.forEach((freq) => {
          const osc = this.audioCtx!.createOscillator();
          const gain = this.audioCtx!.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime);

          gain.gain.setValueAtTime(0.015, this.audioCtx!.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx!.currentTime + 2.5);

          osc.connect(gain);
          gain.connect(this.audioCtx!.destination);

          osc.start();
          osc.stop(this.audioCtx!.currentTime + 2.6);
        });
      };

      playChord();
      this.oscInterval = setInterval(playChord, 3000);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.oscInterval) {
      clearInterval(this.oscInterval);
      this.oscInterval = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }
}

export const audioEngine = new SimulatorAudioEngine();
