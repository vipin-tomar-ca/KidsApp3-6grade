// Text-to-Speech utility using Web Speech API
export interface TextToSpeechConfig {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

class TextToSpeechService {
  private synth: SpeechSynthesis;
  private defaultConfig: TextToSpeechConfig = {
    rate: 0.8,
    pitch: 1.2,
    volume: 0.8,
    voice: null
  };

  constructor() {
    this.synth = window.speechSynthesis;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  speak(text: string, config: TextToSpeechConfig = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      const finalConfig = { ...this.defaultConfig, ...config };

      utterance.rate = finalConfig.rate || 0.8;
      utterance.pitch = finalConfig.pitch || 1.2;
      utterance.volume = finalConfig.volume || 0.8;

      // Use a child-friendly voice if available
      if (finalConfig.voice) {
        utterance.voice = finalConfig.voice;
      } else {
        const voices = this.getVoices();
        const childFriendlyVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('zira') || 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman')
        );
        if (childFriendlyVoice) {
          utterance.voice = childFriendlyVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);

      this.synth.speak(utterance);
    });
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  setDefaultConfig(config: TextToSpeechConfig): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }
}

export const textToSpeech = new TextToSpeechService();