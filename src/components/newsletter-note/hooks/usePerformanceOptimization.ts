import { useRef, useEffect, useCallback } from 'react';

// ⚡ ULTRA-OPTIMIZACIÓN: Clase para manejo avanzado de performance
class PerformanceManager {
  private frameId: number | null = null;
  private isThrottling = false;
  private pendingUpdates = new Set<() => void>();
  private observer: PerformanceObserver | null = null;

  constructor() {
    // Configurar observer de performance si está disponible
    if (typeof PerformanceObserver !== 'undefined') {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 16) {
            // Más de 1 frame
            console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });

      try {
        this.observer.observe({ entryTypes: ['measure'] });
      } catch {
        // Fallback si no se puede observar
        this.observer = null;
      }
    }
  }

  // ⚡ Batch de actualizaciones usando requestAnimationFrame
  batchUpdate(callback: () => void): void {
    this.pendingUpdates.add(callback);

    if (!this.frameId) {
      this.frameId = requestAnimationFrame(() => {
        const updates = Array.from(this.pendingUpdates);
        this.pendingUpdates.clear();
        this.frameId = null;

        // Ejecutar todas las actualizaciones en un solo frame
        updates.forEach((update) => {
          try {
            update();
          } catch (error) {
            console.error('Error in batched update:', error);
          }
        });
      });
    }
  }

  // ⚡ Throttling avanzado con priority
  throttle<T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
    priority: 'low' | 'normal' | 'high' = 'normal'
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
      const now = performance.now();
      const timeSinceLastCall = now - lastCall;

      const actualDelay = priority === 'high' ? delay / 2 : priority === 'low' ? delay * 2 : delay;

      if (timeSinceLastCall >= actualDelay) {
        lastCall = now;
        fn(...args);
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastCall = performance.now();
          timeoutId = null;
          fn(...args);
        }, actualDelay - timeSinceLastCall);
      }
    };
  }

  // ⚡ Measure performance de funciones
  measure<T>(name: string, fn: () => T): T {
    if (this.observer) {
      performance.mark(`${name}-start`);
    }

    try {
      const result = fn();

      if (this.observer) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
      }

      return result;
    } finally {
      if (this.observer) {
        try {
          performance.clearMarks(`${name}-start`);
          performance.clearMarks(`${name}-end`);
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }

  // ⚡ Cleanup
  destroy(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    this.pendingUpdates.clear();

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// ⚡ ULTRA-OPTIMIZACIÓN: Instancia global del manager
const globalPerformanceManager = new PerformanceManager();

// ⚡ ULTRA-OPTIMIZACIÓN: Hook principal de optimización
export const usePerformanceOptimization = () => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const slowRenders = useRef(0);

  // ⚡ Contador de renders para debugging
  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();
    const renderTime = now - lastRenderTime.current;

    if (renderTime > 16) {
      // Más de 1 frame
      slowRenders.current += 1;
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Slow render #${slowRenders.current}: ${renderTime.toFixed(2)}ms`);
      }
    }

    lastRenderTime.current = now;
  });

  // ⚡ Batch update optimizado
  const batchUpdate = useCallback((callback: () => void) => {
    globalPerformanceManager.batchUpdate(callback);
  }, []);

  // ⚡ Throttle optimizado con diferentes prioridades
  const createThrottledCallback = useCallback(
    <T extends (...args: any[]) => void>(
      callback: T,
      delay: number,
      priority: 'low' | 'normal' | 'high' = 'normal'
    ) => globalPerformanceManager.throttle(callback, delay, priority),
    []
  );

  // ⚡ Debounce optimizado con scheduler
  const createDebouncedCallback = useCallback(
    <T extends (...args: any[]) => void>(callback: T, delay: number) => {
      let timeoutId: NodeJS.Timeout | null = null;

      return (...args: Parameters<T>) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          timeoutId = null;
          // Usar scheduler si está disponible
          if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
            (window as any).scheduler.postTask(() => callback(...args), {
              priority: 'user-blocking',
            });
          } else {
            callback(...args);
          }
        }, delay);
      };
    },
    []
  );

  // ⚡ Measure performance wrapper
  const measurePerformance = useCallback(
    <T>(name: string, fn: () => T): T => globalPerformanceManager.measure(name, fn),
    []
  );

  // ⚡ Scheduler optimizado para callbacks
  const scheduleCallback = useCallback(
    (callback: () => void, priority: 'low' | 'normal' | 'high' = 'normal') => {
      if (priority === 'low') {
        setTimeout(callback, 0);
      } else if (priority === 'high') {
        callback();
      } else {
        requestAnimationFrame(callback);
      }
    },
    []
  );

  // ⚡ Stats de performance para debugging
  const getStats = useCallback(
    () => ({
      totalRenders: renderCount.current,
      slowRenders: slowRenders.current,
      slowRenderPercentage:
        renderCount.current > 0 ? (slowRenders.current / renderCount.current) * 100 : 0,
    }),
    []
  );

  // ⚡ Cleanup al desmontar
  useEffect(
    () => () => {
      // El manager global se mantiene, solo limpiamos referencias locales
    },
    []
  );

  return {
    batchUpdate,
    createThrottledCallback,
    createDebouncedCallback,
    measurePerformance,
    scheduleCallback,
    getStats,
  };
};

// ⚡ Hook específico para optimizar editores TipTap
export const useTipTapOptimization = () => {
  const { batchUpdate, createThrottledCallback, createDebouncedCallback, measurePerformance } =
    usePerformanceOptimization();

  // ⚡ Optimización específica para onChange de TipTap
  const optimizeOnChange = useCallback(
    (callback: (content: string) => void) =>
      createDebouncedCallback((content: string) => {
        measurePerformance('tiptap-content-change', () => {
          callback(content);
        });
      }, 50), // 50ms debounce para escritura fluida
    [createDebouncedCallback, measurePerformance]
  );

  // ⚡ Optimización específica para onSelectionUpdate
  const optimizeSelectionUpdate = useCallback(
    (callback: (editor: any) => void) =>
      createThrottledCallback(
        (editor: any) => {
          measurePerformance('tiptap-selection-update', () => {
            callback(editor);
          });
        },
        8,
        'high'
      ), // 8ms throttle con alta prioridad para respuesta inmediata
    [createThrottledCallback, measurePerformance]
  );

  // ⚡ Batch de múltiples actualizaciones de contenido
  const batchContentUpdates = useCallback(
    (updates: Array<() => void>) => {
      batchUpdate(() => {
        measurePerformance('batch-content-updates', () => {
          updates.forEach((update) => update());
        });
      });
    },
    [batchUpdate, measurePerformance]
  );

  return {
    optimizeOnChange,
    optimizeSelectionUpdate,
    batchContentUpdates,
  };
};

// ⚡ Cleanup global al cerrar la app
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalPerformanceManager.destroy();
  });
}

export default usePerformanceOptimization;
