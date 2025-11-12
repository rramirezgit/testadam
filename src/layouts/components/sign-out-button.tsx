import type { ButtonProps } from '@mui/material/Button';

import { useCallback } from 'react';

import Button from '@mui/material/Button';

import { CONFIG } from 'src/global-config';
import useAuthStore from 'src/store/AuthStore';
import usePostStore from 'src/store/PostStore';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';
import { signOut as amplifySignOut } from 'src/auth/context/amplify/action';
import { signOut as firebaseSignOut } from 'src/auth/context/firebase/action';

// ----------------------------------------------------------------------

const signOut =
  (CONFIG.auth.method === 'firebase' && firebaseSignOut) ||
  (CONFIG.auth.method === 'amplify' && amplifySignOut) ||
  jwtSignOut;

type Props = ButtonProps & {
  onClose?: () => void;
};

export function SignOutButton({ onClose, sx, ...other }: Props) {
  const { checkUserSession } = useAuthContext();

  const { logout } = useAuthStore();
  const { clearPosts, clearCurrentPost } = usePostStore();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      await checkUserSession?.();

      // Limpiar datos del PostStore
      clearPosts();
      clearCurrentPost();

      // Limpiar cualquier otro dato persistido en localStorage
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('post-storage');
      localStorage.removeItem('AUTH_TOKEN');

      // Limpiar sessionStorage también por si acaso
      sessionStorage.clear();

      onClose?.();

      // Mostrar mensaje de éxito
      toast.success('Sesión cerrada correctamente');

      // Redirigir al login después del logout (forzar recarga completa)
      window.location.href = '/auth/login';
    } catch (error) {
      console.error(error);
      toast.error('Error al cerrar sesión');
      // Asegurar redirección incluso si hay error
      window.location.href = '/auth/login';
    }
  }, [checkUserSession, onClose, clearPosts, clearCurrentPost]);

  const handleLogoutAuth0 = useCallback(async () => {
    try {
      // Limpiar datos del AuthStore
      await logout();

      // Limpiar datos del PostStore
      clearPosts();
      clearCurrentPost();

      // Limpiar cualquier otro dato persistido en localStorage
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('post-storage');
      localStorage.removeItem('AUTH_TOKEN');

      // Limpiar sessionStorage también por si acaso
      sessionStorage.clear();

      onClose?.();

      // Mostrar mensaje de éxito
      toast.success('Sesión cerrada correctamente');

      // Redirigir al login y forzar recarga completa
      window.location.href = '/auth/login';
    } catch (error) {
      console.error(error);
      toast.error('Error al cerrar sesión');
      // Asegurar redirección incluso si hay error
      window.location.href = '/auth/login';
    }
  }, [onClose, logout, clearPosts, clearCurrentPost]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={CONFIG.auth.method === 'auth0' ? handleLogoutAuth0 : handleLogout}
      sx={sx}
      {...other}
    >
      Cerrar Sesión
    </Button>
  );
}
