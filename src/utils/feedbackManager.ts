// Sound and Haptic Feedback Utilities
export class FeedbackManager {
  private static audioContext: AudioContext | null = null;
  private static isAudioEnabled = true;
  private static isHapticEnabled = true;

  // Initialize audio context safely
  private static initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio context initialization failed:', error);
        this.isAudioEnabled = false;
      }
    }
  }

  // Play a simple beep sound
  static playBeep(frequency: number = 800, duration: number = 100) {
    if (!this.isAudioEnabled || typeof window === 'undefined') return;

    try {
      this.initAudioContext();
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Audio playback failed:', error);
      this.isAudioEnabled = false;
    }
  }

  // Play success sound
  static playSuccess() {
    this.playBeep(600, 150);
    setTimeout(() => this.playBeep(800, 150), 200);
  }

  // Play error sound
  static playError() {
    this.playBeep(300, 200);
    setTimeout(() => this.playBeep(200, 200), 300);
  }

  // Play message sent sound
  static playMessageSent() {
    this.playBeep(1000, 100);
  }

  // Play message received sound
  static playMessageReceived() {
    this.playBeep(500, 120);
    setTimeout(() => this.playBeep(700, 120), 150);
  }

  // Play typing sound
  static playTyping() {
    this.playBeep(400, 50);
  }

  // Haptic feedback for mobile devices
  static vibrate(pattern: number | number[] = 50) {
    if (!this.isHapticEnabled || typeof window === 'undefined') return;

    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      this.isHapticEnabled = false;
    }
  }

  // Light vibration for button press
  static vibrateLight() {
    this.vibrate(10);
  }

  // Medium vibration for important actions
  static vibrateMedium() {
    this.vibrate(50);
  }

  // Heavy vibration for errors
  static vibrateHeavy() {
    this.vibrate([100, 50, 100]);
  }

  // Combined feedback for message sent
  static feedbackMessageSent() {
    this.playMessageSent();
    this.vibrateLight();
  }

  // Combined feedback for message received
  static feedbackMessageReceived() {
    this.playMessageReceived();
    this.vibrateLight();
  }

  // Combined feedback for success
  static feedbackSuccess() {
    this.playSuccess();
    this.vibrateMedium();
  }

  // Combined feedback for error
  static feedbackError() {
    this.playError();
    this.vibrateHeavy();
  }

  // Enable/disable audio
  static setAudioEnabled(enabled: boolean) {
    this.isAudioEnabled = enabled;
    localStorage.setItem('chatAudioEnabled', enabled.toString());
  }

  // Enable/disable haptic feedback
  static setHapticEnabled(enabled: boolean) {
    this.isHapticEnabled = enabled;
    localStorage.setItem('chatHapticEnabled', enabled.toString());
  }

  // Load settings from localStorage
  static loadSettings() {
    const audioEnabled = localStorage.getItem('chatAudioEnabled');
    const hapticEnabled = localStorage.getItem('chatHapticEnabled');
    
    if (audioEnabled !== null) {
      this.isAudioEnabled = audioEnabled === 'true';
    }
    if (hapticEnabled !== null) {
      this.isHapticEnabled = hapticEnabled === 'true';
    }
  }

  // Check if audio is enabled
  static isAudioOn() {
    return this.isAudioEnabled;
  }

  // Check if haptic is enabled
  static isHapticOn() {
    return this.isHapticEnabled;
  }
}

// Initialize settings on load
if (typeof window !== 'undefined') {
  try {
    FeedbackManager.loadSettings();
  } catch (error) {
    console.warn('Failed to load feedback settings:', error);
  }
}
