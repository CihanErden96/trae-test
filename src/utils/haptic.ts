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
let touchStartTime = 0;
let touchEndTime = 0;

// Touch event timing'i için
const trackTouchTiming = {
  start: () => {
    touchStartTime = Date.now();
  },
  end: () => {
    touchEndTime = Date.now();
    return touchEndTime - touchStartTime;
  },
  getDuration: () => touchEndTime - touchStartTime
};

// User interaction'ı tespit etmek için
const enableHapticOnFirstInteraction = () => {
  if (!hasUserInteracted) {
    hasUserInteracted = true;
    // İlk user interaction'da haptic'i test et
    testHapticSupport();
  }
};

// Haptic desteğini test et
const testHapticSupport = async () => {
  try {
    // Navigator.vibrate desteğini kontrol et
    if ('vibrate' in navigator) {
      // Kısa bir test vibrasyonu
      const result = navigator.vibrate(1);
      if (result) {
        isHapticEnabled = true;
        console.log('Haptic feedback enabled');
        return;
      }
    }

    // iOS Safari için Web API kontrol
    if ('permissions' in navigator) {
      try {
        // @ts-expect-error - Experimental vibrate permission API
        const permission = await navigator.permissions.query({ name: 'vibrate' });
        if (permission.state === 'granted') {
          isHapticEnabled = true;
        }
      } catch {
        // Vibrate permission API desteklenmiyorsa, varsayılan olarak etkinleştir
        isHapticEnabled = true;
      }
    } else {
      // Permission API yoksa, varsayılan olarak etkinleştir
      isHapticEnabled = true;
    }
  } catch (error) {
    console.warn('Haptic feedback test failed:', error);
    isHapticEnabled = false;
  }
};

// PWA için gelişmiş vibration patterns
const vibrateWithFallback = (pattern: number | number[], touchDuration?: number) => {
  if (!hasUserInteracted) {
    console.warn('Haptic feedback requires user interaction first');
    return false;
  }

  if (!isHapticEnabled) {
    return false;
  }

  try {
    if ('vibrate' in navigator) {
      // Touch duration'a göre vibration intensity'yi ayarla
      let adjustedPattern = pattern;
      if (touchDuration && typeof pattern === 'number') {
        // Uzun basma için daha güçlü haptic
        if (touchDuration > 200) {
          adjustedPattern = Math.min(pattern * 1.5, 50);
        }
      }
      return navigator.vibrate(adjustedPattern);
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

  // Touch timing'i track et
  trackTouch: trackTouchTiming,

  // Hafif dokunma (buton tıklamaları için) - onTouchEnd için optimize edildi
  light: (touchDuration?: number) => {
    enableHapticOnFirstInteraction();
    
    const success = vibrateWithFallback(10, touchDuration);
    
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

  // Orta şiddette dokunma (önemli aksiyonlar için) - onTouchEnd için optimize edildi
  medium: (touchDuration?: number) => {
    enableHapticOnFirstInteraction();
    
    const success = vibrateWithFallback(20, touchDuration);
    
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback('medium');
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
    
    return success;
  },

  // Güçlü dokunma (silme, onaylama gibi kritik aksiyonlar için) - onTouchEnd için optimize edildi
  heavy: (touchDuration?: number) => {
    enableHapticOnFirstInteraction();
    
    let pattern: number | number[] = [30, 10, 30];
    // Uzun basma için daha güçlü pattern
    if (touchDuration && touchDuration > 300) {
      pattern = [40, 15, 40, 15, 40];
    }
    
    const success = vibrateWithFallback(pattern, touchDuration);
    
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback('heavy');
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
    
    return success;
  },

  // Touch end için özel haptic feedback
  touchEnd: (touchDuration?: number) => {
    enableHapticOnFirstInteraction();
    
    let intensity = 25; // Varsayılan hafif
  
    
    const success = vibrateWithFallback(intensity, touchDuration);
    
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback('light');
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
    
    return success;
  },

  // Başarı feedback'i
  success: () => {
    enableHapticOnFirstInteraction();
    
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
    enableHapticOnFirstInteraction();
    
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
    enableHapticOnFirstInteraction();
    
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
  // İlk user interaction'ı bekle - touchend hariç
  const initHapticOnInteraction = () => {
    hapticFeedback.init();
    // Event listener'ları kaldır
    document.removeEventListener('click', initHapticOnInteraction);
    document.removeEventListener('keydown', initHapticOnInteraction);
  };

  // Sadece click ve keydown event'lerini dinle - touchend kaldırıldı
  document.addEventListener('click', initHapticOnInteraction, { once: true });
  document.addEventListener('keydown', initHapticOnInteraction, { once: true });
}