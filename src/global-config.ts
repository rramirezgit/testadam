import { paths } from 'src/routes/paths';

import packageJson from '../package.json';
import { getNewsletterThemes } from './config/newsletter-config';

import type { NewsletterTheme } from './config/newsletter-config';

// ----------------------------------------------------------------------

export type Platform = 'ADAC' | 'MICHIN';

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
  emptyImageUrl: string;
  isStaticExport: boolean;
  defaultLogoUrl: string;
  defaultThemesNewsletter: NewsletterTheme[];
  serverUrlIA: string;
  platform: Platform;
  approverEmails: string[];
  appBaseUrl: string;
  auth: {
    method: 'jwt' | 'amplify' | 'firebase' | 'auth0';
    skip: boolean;
    redirectPath: string;
  };
  mapboxApiKey: string;
  firebase: {
    appId: string;
    apiKey: string;
    projectId: string;
    authDomain: string;
    storageBucket: string;
    measurementId: string;
    messagingSenderId: string;
  };
  amplify: { userPoolId: string; userPoolWebClientId: string; region: string };
  auth0: { clientId: string; domain: string; callbackUrl: string };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Adam Pro',
  appVersion: packageJson.version,
  serverUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  serverUrlIA: process.env.NEXT_PUBLIC_SERVER_URL_IA ?? '',
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? '',
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT ?? 'false'),
  emptyImageUrl: process.env.NEXT_PUBLIC_EMPTY_IMG ?? '',
  defaultLogoUrl: process.env.NEXT_PUBLIC_LOGO_NEWS ?? '',
  defaultThemesNewsletter: getNewsletterThemes(),
  platform: (process.env.NEXT_PUBLIC_PLATFORM as Platform) ?? 'ADAC',
  approverEmails: process.env.NEXT_PUBLIC_APPROVER_EMAILS
    ? process.env.NEXT_PUBLIC_APPROVER_EMAILS.split(';')
        .map((email) => email.trim())
        .filter(Boolean)
    : ['97.rramirez@gmail.com'],
  appBaseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL ?? '',
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
  /**
   * Mapbox
   */
  mapboxApiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? '',
  /**
   * Firebase
   */
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID ?? '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '',
  },
  /**
   * Amplify
   */
  amplify: {
    userPoolId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_ID ?? '',
    userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID ?? '',
    region: process.env.NEXT_PUBLIC_AWS_AMPLIFY_REGION ?? '',
  },
  /**
   * Auth0
   */
  auth0: {
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '',
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? '',
    callbackUrl: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL ?? '',
  },
};

// ----------------------------------------------------------------------

/**
 * MICHIN Platform Default Values
 * Used when creating/editing notes in MICHIN platform
 */
export const MICHIN_DEFAULTS = {
  categoryId: '666bb07ce9af1709095b27bb',
  subcategoryId: '666bb082e9af1709095b27dc',
  contentTypeId: '685b669ff73d025e8c926a76',
};

// ----------------------------------------------------------------------

/**
 * Social Media Icons URLs
 * Used in newsletter footer for social media links
 */
export const SOCIAL_ICONS: Record<string, string> = {
  instagram: 'https://s3.amazonaws.com/s3.condoor.ai/adam/47b192e0d0.png',
  facebook: 'https://s3.amazonaws.com/s3.condoor.ai/adam/e673e848a3.png',
  x: 'https://s3.amazonaws.com/s3.condoor.ai/adam/e6db6baccf8.png',
  twitter: 'https://s3.amazonaws.com/s3.condoor.ai/adam/e6db6baccf8.png', // Twitter es X
  tiktok: 'https://s3.amazonaws.com/s3.condoor.ai/adam/8ffcbf79bb.png',
  linkedin: 'https://s3.amazonaws.com/s3.condoor.ai/adam/ee993e33c6e.png',
};

// ----------------------------------------------------------------------

/**
 * Get the application base URL
 * Priority:
 * 1. NEXT_PUBLIC_APP_BASE_URL environment variable
 * 2. window.location.origin (client-side fallback)
 * 3. Empty string (server-side fallback)
 *
 * @returns Base URL without trailing slash
 */
export function getAppBaseUrl(): string {
  // Prioridad 1: Variable de entorno
  if (CONFIG.appBaseUrl) {
    // Remover trailing slash si existe
    return CONFIG.appBaseUrl.replace(/\/$/, '');
  }

  // Prioridad 2: window.location.origin (solo en cliente)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Prioridad 3: Fallback vacío (no debería llegar aquí en producción)
  console.warn('⚠️ getAppBaseUrl: No se pudo determinar la URL base de la aplicación');
  return '';
}
