import 'src/global.css';

import type { Metadata, Viewport } from 'next';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { CONFIG } from 'src/global-config';
import { primary } from 'src/theme/core/palette';
import { LocalizationProvider } from 'src/locales';
import { detectLanguage } from 'src/locales/server';
import { themeConfig, ThemeProvider } from 'src/theme';
import { I18nProvider } from 'src/locales/i18n-provider';

import { Snackbar } from 'src/components/snackbar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { detectSettings } from 'src/components/settings/server';
import { HydrationMonitor } from 'src/components/hydration-monitor';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';
import { AuthProvider as Auth0AuthProvider } from 'src/auth/context/auth0';
import { AuthProvider as AmplifyAuthProvider } from 'src/auth/context/amplify';
import { AuthProvider as FirebaseAuthProvider } from 'src/auth/context/firebase';

// ----------------------------------------------------------------------

const AuthProvider =
  (CONFIG.auth.method === 'amplify' && AmplifyAuthProvider) ||
  (CONFIG.auth.method === 'firebase' && FirebaseAuthProvider) ||
  (CONFIG.auth.method === 'auth0' && Auth0AuthProvider) ||
  JwtAuthProvider;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      lang: 'en',
      i18nLang: undefined,
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  } else {
    const [lang, settings] = await Promise.all([detectLanguage(), detectSettings()]);

    return {
      lang: lang ?? 'en',
      i18nLang: lang ?? 'en',
      cookieSettings: settings,
      dir: settings.direction,
    };
  }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const appConfig = await getAppConfig();

  return (
    <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          defaultMode={themeConfig.enableSystemMode ? 'system' : themeConfig.defaultMode}
        />

        <I18nProvider lang={appConfig.i18nLang}>
          <AuthProvider>
            <SettingsProvider
              defaultSettings={defaultSettings}
              cookieSettings={appConfig.cookieSettings}
            >
              <LocalizationProvider>
                <AppRouterCacheProvider options={{ key: 'css' }}>
                  <ThemeProvider
                    modeStorageKey={themeConfig.modeStorageKey}
                    defaultMode={themeConfig.enableSystemMode ? 'system' : themeConfig.defaultMode}
                  >
                    <MotionLazy>
                      <CheckoutProvider>
                        <Snackbar />
                        {/* <ProgressBar /> */}
                        <HydrationMonitor />
                        <SettingsDrawer defaultSettings={defaultSettings} />
                        {children}
                      </CheckoutProvider>
                    </MotionLazy>
                  </ThemeProvider>
                </AppRouterCacheProvider>
              </LocalizationProvider>
            </SettingsProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
