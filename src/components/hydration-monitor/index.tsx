'use client';

import { useEffect } from 'react';

export function HydrationMonitor() {
  useEffect(() => {
    let reloadCount = 0;
    const startTime = Date.now();

    // Monitorear errores de hydration
    const handleError = (event: ErrorEvent) => {
      if (
        event.message.includes('hydration') ||
        event.message.includes('Text content does not match')
      ) {
        console.error('🚨 HYDRATION ERROR DETECTED:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Monitorear errores no manejados que podrían causar recargas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 UNHANDLED PROMISE REJECTION:', {
        reason: event.reason,
        timestamp: new Date().toISOString(),
      });
    };

    // Detectar recargas frecuentes
    const detectFrequentReloads = () => {
      reloadCount += 1;
      const timeElapsed = Date.now() - startTime;

      if (reloadCount > 3 && timeElapsed < 10000) {
        // Más de 3 recargas en 10 segundos
        console.error('🚨 FREQUENT RELOAD DETECTED:', {
          reloadCount,
          timeElapsed,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Monitorear cambios en window.location
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = (...args) => {
      console.log('📍 HISTORY PUSH STATE:', args[2]);
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = (...args) => {
      console.log('📍 HISTORY REPLACE STATE:', args[2]);
      return originalReplaceState.apply(this, args);
    };

    // Detectar cambios en window.location.href
    let currentHref = window.location.href;
    const checkHrefChange = () => {
      if (window.location.href !== currentHref) {
        console.log('📍 LOCATION HREF CHANGED:', {
          from: currentHref,
          to: window.location.href,
          timestamp: new Date().toISOString(),
        });
        currentHref = window.location.href;
      }
    };

    const hrefCheckInterval = setInterval(checkHrefChange, 100);

    // Agregar event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('beforeunload', detectFrequentReloads);

    console.log('🔍 HydrationMonitor iniciado:', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('beforeunload', detectFrequentReloads);
      clearInterval(hrefCheckInterval);

      // Restaurar funciones originales
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;

      console.log('🔍 HydrationMonitor limpiado');
    };
  }, []);

  return null; // Este componente no renderiza nada visible
}
