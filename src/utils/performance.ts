// Performance utilities - Optimized

// Debounce function for search and input optimization
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll and resize events
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy loading utility for large datasets
export const createLazyLoader = <T>(
  data: T[],
  pageSize: number = 10
) => {
  let currentPage = 0;
  
  return {
    loadMore: () => {
      const start = currentPage * pageSize;
      const end = start + pageSize;
      currentPage++;
      return data.slice(start, end);
    },
    hasMore: () => currentPage * pageSize < data.length,
    reset: () => { currentPage = 0; }
  };
};

// Memory optimization for large objects
export const memoize = <T extends (...args: unknown[]) => unknown>(fn: T): T => {
  const cache = new Map();
  return ((...args: unknown[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
  } else {
    fn();
  }
};