// Haptic Feedback Utility for PWA - Optimized Version

// Window interface'ini genişletiyoruz
declare global {
  interface Window {
    hapticFeedback?: (type: string) => void;
    DeviceMotionEvent?: typeof DeviceMotionEvent;
  }
}

// Haptic feedback türleri ve kullanım alanları
export enum HapticType {
  // Temel etkileşimler
  LIGHT = 'light',           // Hafif dokunmalar: buton hover, toggle, checkbox
  MEDIUM = 'medium',         // Orta şiddette: buton tıklama, seçim, navigasyon
  HEAVY = 'heavy',           // Güçlü: silme, onaylama, kritik aksiyonlar
  
  // Durum bildirimleri
  SUCCESS = 'success',       // Başarılı işlemler: kaydetme, gönderme
  ERROR = 'error',           // Hata durumları: form hatası, işlem başarısız
  WARNING = 'warning',       // Uyarılar: dikkat gerektiren durumlar
  
  // Özel durumlar
  SELECTION = 'selection',   // Öğe seçimi, liste navigasyonu
  NOTIFICATION = 'notification', // Bildirimler, alert'ler
  IMPACT = 'impact'          // Çarpışma, sürükle-bırak
}

// PWA için haptic feedback durumunu takip etmek
let isHapticEnabled = false;
let hasUserInteracted = false;

// Haptic pattern'ları optimize edilmiş versiyonlar
const HAPTIC_PATTERNS: Record<HapticType, number[]> = {
  [HapticType.LIGHT]: [10],
  [HapticType.MEDIUM]: [20],
  [HapticType.HEAVY]: [40],
  [HapticType.SUCCESS]: [10, 5, 10],
  [HapticType.ERROR]: [30, 10, 30, 10, 30],
  [HapticType.WARNING]: [25, 15, 25],
  [HapticType.SELECTION]: [8],
  [HapticType.NOTIFICATION]: [15, 10, 15],
  [HapticType.IMPACT]: [50]
};

// Sayfa yüklendiğinde hemen haptic'i etkinleştir
const initializeHapticImmediately = () => {
  try {
    if ('vibrate' in navigator) {
      isHapticEnabled = true;
      hasUserInteracted = true;
      // Haptic feedback başlatıldı
    } else {
      isHapticEnabled = true;
      hasUserInteracted = true;
      // iOS Safari için haptic etkinleştirildi
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
    testHapticSupportSync();
  }
};

// Haptic desteğini senkron olarak test et
const testHapticSupportSync = () => {
  try {
    if ('vibrate' in navigator) {
      isHapticEnabled = true;
      // Haptic feedback etkinleştirildi
      return;
    }
    isHapticEnabled = true;
  } catch (error) {
    console.warn('Haptic feedback test failed:', error);
    isHapticEnabled = false;
  }
};

// PWA için gelişmiş vibration patterns
const vibrateWithFallback = (pattern: number | number[]) => {
  if (!isHapticEnabled) {
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

// iOS Safari haptic feedback desteği
const triggerIOSHaptic = (type: string) => {
  if ('hapticFeedback' in window && window.hapticFeedback) {
    try {
      window.hapticFeedback(type);
      return true;
    } catch (error) {
      console.warn('iOS haptic feedback failed:', error);
      return false;
    }
  }
  return false;
};

// Ana haptic feedback fonksiyonu
const triggerHaptic = (type: HapticType): boolean => {
  const pattern = HAPTIC_PATTERNS[type];
  const vibrationSuccess = vibrateWithFallback(pattern);
  const iosSuccess = triggerIOSHaptic(type);
  
  return vibrationSuccess || iosSuccess;
};

export const hapticFeedback = {
  // İlk kullanıcı etkileşiminde haptic'i etkinleştir
  init: () => {
    enableHapticOnFirstInteraction();
  },

  // Haptic durumunu kontrol et
  isEnabled: () => isHapticEnabled,

  // Temel etkileşimler
  light: () => triggerHaptic(HapticType.LIGHT),
  medium: () => triggerHaptic(HapticType.MEDIUM),
  heavy: () => triggerHaptic(HapticType.HEAVY),

  // Durum bildirimleri
  success: () => triggerHaptic(HapticType.SUCCESS),
  error: () => triggerHaptic(HapticType.ERROR),
  warning: () => triggerHaptic(HapticType.WARNING),

  // Özel durumlar
  selection: () => triggerHaptic(HapticType.SELECTION),
  notification: () => triggerHaptic(HapticType.NOTIFICATION),
  impact: () => triggerHaptic(HapticType.IMPACT),

  // Kontekstüel haptic feedback'ler
  button: {
    primary: () => triggerHaptic(HapticType.MEDIUM),
    secondary: () => triggerHaptic(HapticType.LIGHT),
    danger: () => triggerHaptic(HapticType.WARNING),
    success: () => triggerHaptic(HapticType.SUCCESS)
  },

  navigation: {
    open: () => triggerHaptic(HapticType.MEDIUM),
    close: () => triggerHaptic(HapticType.LIGHT),
    back: () => triggerHaptic(HapticType.LIGHT),
    select: () => triggerHaptic(HapticType.SELECTION)
  },

  form: {
    submit: () => triggerHaptic(HapticType.SUCCESS),
    cancel: () => triggerHaptic(HapticType.LIGHT),
    error: () => triggerHaptic(HapticType.ERROR),
    validate: () => triggerHaptic(HapticType.LIGHT)
  },

  action: {
    create: () => triggerHaptic(HapticType.SUCCESS),
    edit: () => triggerHaptic(HapticType.MEDIUM),
    delete: () => triggerHaptic(HapticType.HEAVY),
    save: () => triggerHaptic(HapticType.SUCCESS),
    cancel: () => triggerHaptic(HapticType.LIGHT)
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