// Haptic Feedback Utility for PWA

// Window interface'ini genişletiyoruz
declare global {
  interface Window {
    hapticFeedback?: (type: string) => void;
    DeviceMotionEvent?: typeof DeviceMotionEvent;
  }
}

// PWA için haptic feedback durumunu takip etmek
let isHapticEnabled = false;
let hasUserInteracted = false;

// Sayfa yüklendiğinde hemen haptic'i etkinleştir
const initializeHapticImmediately = () => {
  try {
    if ('vibrate' in navigator) {
      isHapticEnabled = true;
      hasUserInteracted = true; // Hemen user interaction olduğunu varsay
      console.log('Haptic feedback initialized immediately');
    } else {
      isHapticEnabled = true;
      hasUserInteracted = true;
      console.log('Haptic feedback enabled for iOS Safari');
    }
  } catch (error) {
    console.warn('Haptic initialization failed:', error);
    isHapticEnabled = false;
  }
};

// User interaction'ı tespit etmek için
const enableHapticOnFirstInteraction = () => {
  if (!hasUserInteracted) {
    hasUserInteracted = true;
    // İlk user interaction'da haptic'i hemen test et (senkron)
    testHapticSupportSync();
  }
};

// Haptic desteğini senkron olarak test et
const testHapticSupportSync = () => {
  try {
    // Navigator.vibrate desteğini kontrol et
    if ('vibrate' in navigator) {
      isHapticEnabled = true;
      console.log('Haptic feedback enabled');
      return;
    }

    // iOS Safari veya diğer tarayıcılar için varsayılan olarak etkinleştir
    isHapticEnabled = true;
  } catch (error) {
    console.warn('Haptic feedback test failed:', error);
    isHapticEnabled = false;
  }
};

// PWA için gelişmiş vibration patterns
const vibrateWithFallback = (pattern: number | number[]) => {
  if (!isHapticEnabled) {
    // Eğer henüz etkinleştirilmemişse, hemen etkinleştir
    initializeHapticImmediately();
  }

  if (!isHapticEnabled) {
    return false;
  }

  try {
    if ('vibrate' in navigator) {
      return navigator.vibrate(pattern);
    }
    return false;
  } catch (error) {
    console.warn('Vibration failed:', error);
    return false;
  }
};

export const hapticFeedback = {
  // İlk kullanıcı etkileşiminde haptic'i etkinleştir
  init: () => {
    enableHapticOnFirstInteraction();
  },

  // Haptic durumunu kontrol et
  isEnabled: () => isHapticEnabled,

  // Hafif dokunma (buton tıklamaları için)
  light: () => {
    const success = vibrateWithFallback([15, 10, 15]);
    
    // iOS Safari için haptic feedback
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback('light');
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
    
    return success;
  },

  // Orta şiddette dokunma (önemli aksiyonlar için)
  medium: () => {
    const success = vibrateWithFallback([20, 10, 20]);
    
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback('medium');
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
    
    return success;
  },

  // Güçlü dokunma (silme, onaylama gibi kritik aksiyonlar için)
  heavy: () => {
    const pattern: number | number[] = [30, 10, 30];
    
    const success = vibrateWithFallback(pattern);
    
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback('heavy');
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
    
    return success;
  },

  // Başarı feedback'i
  success: () => {
    const success = vibrateWithFallback([10, 5, 10]);
    
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback('success');
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
    
    return success;
  },

  // Hata feedback'i
  error: () => {
    const success = vibrateWithFallback([50, 20, 50, 20, 50]);
    
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback('error');
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
    
    return success;
  },

  // Uyarı feedback'i
  warning: () => {
    const success = vibrateWithFallback([30, 15, 30]);
    
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback('warning');
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
    
    return success;
  }
};

// React hook olarak kullanım için
export const useHaptic = () => {
  return hapticFeedback;
};

// PWA için document ready'de haptic'i initialize et
if (typeof window !== 'undefined') {
  // Sayfa yüklendiğinde hemen haptic'i etkinleştir
  initializeHapticImmediately();

  // Ek güvenlik için user interaction'da da kontrol et
  const ensureHapticEnabled = () => {
    if (!isHapticEnabled) {
      initializeHapticImmediately();
    }
  };

  // Çeşitli user interaction event'lerini dinle (backup olarak)
  document.addEventListener('touchstart', ensureHapticEnabled, { once: true, passive: true });
  document.addEventListener('click', ensureHapticEnabled, { once: true });
  document.addEventListener('keydown', ensureHapticEnabled, { once: true });
}