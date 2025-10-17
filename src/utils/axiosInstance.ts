import axios from 'axios';

import { getStorage } from '../hooks/use-local-storage';

export const createAxiosInstance = () => {
  const accessToken = getStorage('AUTH_TOKEN');
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
    },
    timeout: 80000, // 80 segundos
  });

  instance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor para debugging y manejo de errores
  instance.interceptors.response.use(
    (response) => {
      console.log(`Respuesta exitosa de ${response.config.url}:`, response.status);
      return response;
    },
    (error) => {
      console.error(
        `Error en petición a ${error.config?.url}:`,
        error.response?.status,
        error.message
      );

      // Manejo de errores 401 - Sesión expirada o no autorizada
      if (error.response?.status === 401) {
        console.warn('⚠️ Error 401: Sesión expirada o no autorizada. Redirigiendo al login...');

        // Limpiar todo el localStorage
        localStorage.removeItem('AUTH_TOKEN');
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('post-storage');
        sessionStorage.clear();

        // Redirigir al login
        // Usar window.location para forzar una recarga completa y limpiar el estado
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const loginUrl = `/auth/login?returnTo=${encodeURIComponent(currentPath)}`;
          window.location.href = loginUrl;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
  },
  user: {
    profile: '/auth/userinfo',
    updateProfile: '/user/profile',
  },
  post: {
    findAll: '/posts',
    findById: (id: string) => `/posts/${id}`,
    create: '/posts',
    update: (id: string) => `/posts/${id}`,
    delete: (id: string) => `/posts/${id}`,
    sendForReview: '/email/send',
    updateStatus: (id: string, status: string) => `/posts/status/${id}/${status}`,
  },
  newsletter: {
    create: '/newsletters',
    findAll: '/newsletters',
    update: (id: string) => `/newsletters/${id}`,
    send: (id: string) => `/newsletters/${id}/send`,
    sendForReview: (id: string) => `/newsletters/${id}/send-for-review`,
    requestApproval: (id: string) => `/newsletters/${id}/request-approval`,
  },
  // Metadata endpoints
  contentType: {
    findAll: '/content-type',
  },
  audience: {
    findAll: '/audience',
  },
  category: {
    findAll: '/categories',
  },
};
