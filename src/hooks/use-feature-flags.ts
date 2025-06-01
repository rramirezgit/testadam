'use client';

import { useMemo } from 'react';

import useAuthStore from '../store/AuthStore';
import {
  type FeatureFlags,
  logFeatureFlagUsage,
  getFeatureFlagsWithEnvOverride,
} from '../config/feature-flags';

/**
 * Hook para acceder a feature flags con contexto de usuario
 * Integra con AuthStore para obtener userId automáticamente
 */
export function useFeatureFlags(): FeatureFlags & {
  logUsage: (flagName: keyof FeatureFlags, value: boolean) => void;
} {
  const { user } = useAuthStore();

  const flags = useMemo(() => {
    const userId = user?.sub || user?.email;
    return getFeatureFlagsWithEnvOverride(userId);
  }, [user]);

  const logUsage = (flagName: keyof FeatureFlags, value: boolean) => {
    const userId = user?.sub || user?.email;
    logFeatureFlagUsage(flagName, value, userId);
  };

  return {
    ...flags,
    logUsage,
  };
}

/**
 * Hook para feature flag específica con logging automático
 */
export function useFeatureFlag(flagName: keyof FeatureFlags): boolean {
  const flags = useFeatureFlags();
  const value = flags[flagName] as boolean;

  // Log del uso automático (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    flags.logUsage(flagName, value);
  }

  return value;
}

/**
 * Hook especializado para editores Newsletter
 */
export function useNewsletterEditorFlags() {
  const flags = useFeatureFlags();

  return {
    useUnifiedTiptapEditor: flags.useUnifiedTiptapEditor,
    useUnifiedSimpleTiptapEditor: flags.useUnifiedSimpleTiptapEditor,
    useUnifiedTiptapEditorComponent: flags.useUnifiedTiptapEditorComponent,
    enableMetadata: flags.enableEditorMetadata,
    logUsage: flags.logUsage,
  };
}

/**
 * Hook especializado para editores Educación
 */
export function useEducationEditorFlags() {
  const flags = useFeatureFlags();

  return {
    useUnifiedExtendedTiptapEditor: flags.useUnifiedExtendedTiptapEditor,
    useUnifiedEducacionEditor: flags.useUnifiedEducacionEditor,
    enableMetadata: flags.enableEditorMetadata,
    enableAutoSave: flags.enableAutoSave,
    logUsage: flags.logUsage,
  };
}

/**
 * Hook especializado para Editor Principal
 */
export function useMainEditorFlags() {
  const flags = useFeatureFlags();

  return {
    useUnifiedMainEditor: flags.useUnifiedMainEditor,
    enableMetadata: flags.enableEditorMetadata,
    enableAutoSave: flags.enableAutoSave,
    enableAdvancedToolbar: flags.enableAdvancedToolbar,
    logUsage: flags.logUsage,
  };
}
