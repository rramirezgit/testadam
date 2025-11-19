'use client';

import { useState, useEffect } from 'react';

import { useRouter, usePathname } from 'src/routes/hooks';

import useAuthStore from 'src/store/AuthStore';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  // Usar el nuevo store de autenticación con los flags adicionales
  const { isAuthenticated, loading, isHydrated, isVerifyingSession } = useAuthStore();

  useEffect(() => {
    console.log('AuthGuard - Estado:', {
      isAuthenticated,
      loading,
      isHydrated,
      isVerifyingSession,
      pathname,
    });

    // Esperar a que el store esté hidratado antes de tomar decisiones
    if (!isHydrated) {
      console.log('AuthGuard - Esperando hidratación del store...');
      return;
    }

    // Si estamos verificando la sesión con /profile, esperar
    if (isVerifyingSession) {
      console.log('AuthGuard - Verificando sesión con /profile...');
      return;
    }

    // Si hay operaciones de carga en curso, esperar
    if (loading) {
      console.log('AuthGuard - Esperando operación de carga...');
      return;
    }

    // Ya tenemos toda la información necesaria para decidir
    if (!isAuthenticated) {
      // Usuario no autenticado, redirigir al login preservando la ruta destino
      const queryString = new URLSearchParams({ returnTo: pathname }).toString();
      const redirectPath = `/auth/login?${queryString}`;

      console.log('AuthGuard - Usuario no autenticado, redirigiendo a:', redirectPath);
      router.replace(redirectPath);
    } else {
      // Usuario autenticado y verificado, permitir acceso
      console.log('AuthGuard - Usuario autenticado y verificado, mostrando contenido protegido');
      setChecked(true);
    }
  }, [isAuthenticated, loading, isHydrated, isVerifyingSession, pathname, router]);

  // Mostrar splash mientras:
  // 1. El store no esté hidratado
  // 2. Se esté verificando la sesión con /profile
  // 3. Haya operaciones de carga en curso
  // 4. No hayamos terminado la verificación inicial
  if (!isHydrated || isVerifyingSession || loading || (!checked && isAuthenticated)) {
    return <SplashScreen />;
  }

  // Si no está autenticado, mostrar splash mientras redirige
  if (!isAuthenticated) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
