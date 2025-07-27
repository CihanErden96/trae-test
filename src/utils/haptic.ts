// Haptic Feedback Utility

// Window interface'ini genişletiyoruz
declare global {
  interface Window {
    hapticFeedback?: (type: string) => void;
  }
}

export const hapticFeedback = {
  // Hafif dokunma (buton tıklamaları için)
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    // iOS Safari için haptic feedback
    if ('hapticFeedback' in window && window.hapticFeedback) {
      window.hapticFeedback('light');
    }
  },

  // Orta şiddette dokunma (önemli aksiyonlar için)
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    if ('hapticFeedback' in window && window.hapticFeedback) {
      window.hapticFeedback('medium');
    }
  },

  // Güçlü dokunma (silme, onaylama gibi kritik aksiyonlar için)
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
    if ('hapticFeedback' in window && window.hapticFeedback) {
      window.hapticFeedback('heavy');
    }
  },

  // Başarı feedback'i
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 5, 10]);
    }
    if ('hapticFeedback' in window && window.hapticFeedback) {
      window.hapticFeedback('success');
    }
  },

  // Hata feedback'i
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 20, 50, 20, 50]);
    }
    if ('hapticFeedback' in window && window.hapticFeedback) {
      window.hapticFeedback('error');
    }
  },

  // Uyarı feedback'i
  warning: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 15, 30]);
    }
    if ('hapticFeedback' in window && window.hapticFeedback) {
      window.hapticFeedback('warning');
    }
  }
};

// React hook olarak kullanım için
export const useHaptic = () => {
  return hapticFeedback;
};