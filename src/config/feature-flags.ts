/**
 * Sistema de Feature Flags para Adam-Pro Editor Unificado
 *
 * Permite controlar la migración gradual de editores originales
 * al sistema unificado sin breaking changes.
 */

export interface FeatureFlags {
  // Editores Newsletter
  useUnifiedTiptapEditor: boolean;
  useUnifiedSimpleTiptapEditor: boolean;
  useUnifiedTiptapEditorComponent: boolean;

  // Editores Educación
  useUnifiedExtendedTiptapEditor: boolean;
  useUnifiedEducacionEditor: boolean;

  // Editor Principal
  useUnifiedMainEditor: boolean;

  // Configuraciones adicionales
  enableEditorMetadata: boolean;
  enableAutoSave: boolean;
  enableAdvancedToolbar: boolean;

  // A/B Testing
  enableABTesting: boolean;
  abTestingPercentage: number; // 0-100
}

// Configuración por ambiente
const developmentFlags: FeatureFlags = {
  // Newsletter - Activado para desarrollo
  useUnifiedTiptapEditor: true,
  useUnifiedSimpleTiptapEditor: true,
  useUnifiedTiptapEditorComponent: true,

  // Educación - Activado para desarrollo
  useUnifiedExtendedTiptapEditor: true,
  useUnifiedEducacionEditor: false, // Pendiente migración completa

  // Editor Principal - Activado para desarrollo
  useUnifiedMainEditor: true,

  // Features adicionales
  enableEditorMetadata: true,
  enableAutoSave: true,
  enableAdvancedToolbar: true,

  // A/B Testing desactivado en desarrollo
  enableABTesting: false,
  abTestingPercentage: 0,
};

const stagingFlags: FeatureFlags = {
  // Newsletter - 50% rollout
  useUnifiedTiptapEditor: true,
  useUnifiedSimpleTiptapEditor: true,
  useUnifiedTiptapEditorComponent: false, // Gradual rollout

  // Educación - 25% rollout
  useUnifiedExtendedTiptapEditor: false, // Testing controlado
  useUnifiedEducacionEditor: false,

  // Editor Principal - Disabled en staging
  useUnifiedMainEditor: false,

  // Features adicionales
  enableEditorMetadata: true,
  enableAutoSave: false, // No en staging aún
  enableAdvancedToolbar: true,

  // A/B Testing activado
  enableABTesting: true,
  abTestingPercentage: 25, // 25% de usuarios
};

const productionFlags: FeatureFlags = {
  // Newsletter - Rollout conservador
  useUnifiedTiptapEditor: false, // Inicio conservador
  useUnifiedSimpleTiptapEditor: false,
  useUnifiedTiptapEditorComponent: false,

  // Educación - Disabled en producción inicial
  useUnifiedExtendedTiptapEditor: false,
  useUnifiedEducacionEditor: false,

  // Editor Principal - Disabled en producción
  useUnifiedMainEditor: false,

  // Features adicionales desactivadas inicialmente
  enableEditorMetadata: false,
  enableAutoSave: false,
  enableAdvancedToolbar: false,

  // A/B Testing controlado
  enableABTesting: false,
  abTestingPercentage: 0,
};

// Feature flags por usuario (para A/B testing)
export function getUserFeatureFlags(userId?: string): FeatureFlags {
  const baseFlags = getEnvironmentFeatureFlags();

  if (!baseFlags.enableABTesting || !userId) {
    return baseFlags;
  }

  // Hash simple del user ID para consistencia
  const userHash = hashUserId(userId);
  const isInABTest = userHash % 100 < baseFlags.abTestingPercentage;

  if (isInABTest) {
    // Usuario en A/B test - activar features unificadas
    return {
      ...baseFlags,
      useUnifiedTiptapEditor: true,
      useUnifiedSimpleTiptapEditor: true,
      enableEditorMetadata: true,
    };
  }

  return baseFlags;
}

// Hash simple para consistencia de usuario
function hashUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash * 31 + char) % 1000000; // Evitar operadores bitwise
  }
  return Math.abs(hash);
}

// Obtener flags por ambiente
export function getEnvironmentFeatureFlags(): FeatureFlags {
  const env = process.env.NODE_ENV;

  if (env === 'production') {
    return productionFlags;
  } else if (env === 'test') {
    return stagingFlags; // Usar staging flags para test
  } else {
    return developmentFlags; // default para development y otros
  }
}

// Hook personalizado para usar feature flags
export function useFeatureFlags(userId?: string): FeatureFlags {
  return getUserFeatureFlags(userId);
}

// Variables de entorno override (opcional)
export function getFeatureFlagsWithEnvOverride(userId?: string): FeatureFlags {
  const baseFlags = getUserFeatureFlags(userId);

  return {
    ...baseFlags,
    // Override con variables de entorno si existen
    useUnifiedTiptapEditor:
      process.env.NEXT_PUBLIC_USE_UNIFIED_TIPTAP_EDITOR === 'true'
        ? true
        : baseFlags.useUnifiedTiptapEditor,

    useUnifiedSimpleTiptapEditor:
      process.env.NEXT_PUBLIC_USE_UNIFIED_SIMPLE_TIPTAP_EDITOR === 'true'
        ? true
        : baseFlags.useUnifiedSimpleTiptapEditor,

    useUnifiedMainEditor:
      process.env.NEXT_PUBLIC_USE_UNIFIED_MAIN_EDITOR === 'true'
        ? true
        : baseFlags.useUnifiedMainEditor,

    enableEditorMetadata:
      process.env.NEXT_PUBLIC_ENABLE_EDITOR_METADATA === 'true'
        ? true
        : baseFlags.enableEditorMetadata,
  };
}

// Utilidades para logging y monitoring
export function logFeatureFlagUsage(flagName: keyof FeatureFlags, value: boolean, userId?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[FeatureFlag] ${flagName}: ${value}`, { userId });
  }

  // En producción, enviar a analytics/monitoring
  if (process.env.NODE_ENV === 'production') {
    // Aquí se puede integrar con sistemas como DataDog, Mixpanel, etc.
    // analytics.track('feature_flag_used', { flag: flagName, value, userId });
  }
}

// Configuración de rollout por fases
export const ROLLOUT_PHASES = {
  PHASE_1_NEWSLETTER: {
    name: 'Newsletter Rollout',
    duration: '2 semanas',
    flags: ['useUnifiedTiptapEditor', 'useUnifiedSimpleTiptapEditor'],
    targetPercentage: 50,
    successCriteria: ['0 errores críticos', 'performance >= baseline', 'user satisfaction > 95%'],
  },
  PHASE_2_EDUCATION: {
    name: 'Education Rollout',
    duration: '2 semanas',
    flags: ['useUnifiedExtendedTiptapEditor'],
    targetPercentage: 25,
    successCriteria: ['0 errores críticos', 'funcionalidad preservada', 'metadata funcionando'],
  },
  PHASE_3_MAIN_EDITOR: {
    name: 'Main Editor Rollout',
    duration: '3 semanas',
    flags: ['useUnifiedMainEditor'],
    targetPercentage: 10, // Muy conservador
    successCriteria: ['fullscreen funcionando', 'syntax highlighting', '0 breaking changes'],
  },
} as const;

export default {
  getEnvironmentFeatureFlags,
  getUserFeatureFlags,
  getFeatureFlagsWithEnvOverride,
  useFeatureFlags,
  logFeatureFlagUsage,
  ROLLOUT_PHASES,
};
