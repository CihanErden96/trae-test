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
const vibrateWithFallback = (pattern: number | number[]) => {
  if (!hasUserInteracted) {
    console.warn('Haptic feedback requires user interaction first');
    return false;
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

  // Hafif dokunma (buton tıklamaları için) - onTouchEnd için optimize edildi
  light: () => {
    enableHapticOnFirstInteraction();
    
    const success = vibrateWithFallback(10);
    
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
  medium: () => {
    enableHapticOnFirstInteraction();
    
    const success = vibrateWithFallback(20);
    
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
  heavy: () => {
    enableHapticOnFirstInteraction();
    
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

  // Touch end için özel haptic feedback - Güçlü titreşim
  touchEnd: () => {
    enableHapticOnFirstInteraction();
    
    const pattern: number | number[] = [25, 10, 25]; // Güçlü pattern
    const hapticType = 'heavy';
    
    const success = vibrateWithFallback(pattern);
    
    if ('hapticFeedback' in window && window.hapticFeedback) {
      try {
        window.hapticFeedback(hapticType);
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