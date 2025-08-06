// Audio fallback utilities for handling audio errors gracefully
export class AudioFallbackService {
  private static isAudioSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  static checkAudioSupport(): boolean {
    return this.isAudioSupported;
  }

  static createSilentAudioFallback() {
    // Create a simple fallback for when audio services fail
    return {
      play: () => console.log('Audio playback requested but not available'),
      pause: () => console.log('Audio pause requested but not available'),
      stop: () => console.log('Audio stop requested but not available'),
      isPlaying: false,
      error: 'Audio services are currently unavailable'
    };
  }

  static handleAudioError(error: any, context: string = 'Audio') {
    console.warn(`${context} error:`, error);
    
    // Return user-friendly error message
    return {
      success: false,
      message: `${context} is temporarily unavailable. This doesn't affect your learning progress!`,
      fallback: this.createSilentAudioFallback()
    };
  }

  static testAudioCapability(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (!this.isAudioSupported) {
          resolve(false);
          return;
        }

        // Test speech synthesis
        const utterance = new SpeechSynthesisUtterance('test');
        utterance.volume = 0; // Silent test
        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(false);
        
        window.speechSynthesis.speak(utterance);
        
        // Timeout after 1 second
        setTimeout(() => {
          window.speechSynthesis.cancel();
          resolve(false);
        }, 1000);
      } catch (error) {
        resolve(false);
      }
    });
  }
}

// Enhanced error boundary for audio components
export const withAudioFallback = (audioFunction: () => any, fallbackMessage?: string) => {
  try {
    return audioFunction();
  } catch (error) {
    console.warn('Audio operation failed, using fallback:', error);
    return AudioFallbackService.handleAudioError(error, fallbackMessage || 'Audio');
  }
};