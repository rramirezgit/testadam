import type { EmailComponent } from 'src/types/saved-note';

import { useRef, useState, useEffect, useCallback } from 'react';

// Tipos para el auto-guardado
export interface AutoSaveData {
  title: string;
  description: string;
  coverImageUrl: string;
  components: EmailComponent[];
  componentsWeb: EmailComponent[];
  config: {
    templateType: string;
    emailBackground: string;
    selectedBanner: any;
    showGradient: boolean;
    gradientColors: string[];
    activeVersion: 'newsletter' | 'web';
    containerBorderWidth: number;
    containerBorderColor: string;
    containerBorderRadius: number;
    containerPadding: number;
    containerMaxWidth: number;
  };
}

export interface AutoSaveOptions {
  enabled: boolean;
  interval: number; // en milisegundos
  onSave?: (data: AutoSaveData) => Promise<void>;
  onError?: (error: Error) => void;
  onSuccess?: (data: AutoSaveData) => void;
  debounceDelay?: number; // tiempo de debounce para agrupar cambios rápidos
}

export interface AutoSaveState {
  isAutoSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  changeCount: number;
  lastError: Error | null;
}

export interface UseAutoSaveReturn {
  // Estado
  autoSaveState: AutoSaveState;

  // Funciones de control
  enableAutoSave: () => void;
  disableAutoSave: () => void;
  toggleAutoSave: () => void;

  // Función para marcar cambios manualmente
  markChange: (changeType?: string) => void;

  // Función para resetear cambios
  resetChanges: () => void;

  // Función para forzar guardado inmediato
  forceSave: () => Promise<void>;

  // Función para actualizar datos
  updateData: (data: Partial<AutoSaveData>) => void;
}

export const useAutoSave = (
  initialData: AutoSaveData,
  options: AutoSaveOptions
): UseAutoSaveReturn => {
  console.log('🚀 useAutoSave initializing with data:', {
    title: initialData.title,
    componentsCount: initialData.components.length,
    componentsWebCount: initialData.componentsWeb.length,
  });

  // Estados
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    isAutoSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    changeCount: 0,
    lastError: null,
  });

  // Referencias para datos actuales
  const currentDataRef = useRef<AutoSaveData>(initialData);
  // Inicializar lastSavedDataRef con datos vacíos para forzar que siempre haya diferencia inicialmente
  const lastSavedDataRef = useRef<AutoSaveData>({
    title: '',
    description: '',
    coverImageUrl: '',
    components: [],
    componentsWeb: [],
    config: {
      templateType: '',
      emailBackground: '#ffffff',
      selectedBanner: null,
      showGradient: false,
      gradientColors: [],
      activeVersion: 'newsletter',
      containerBorderWidth: 0,
      containerBorderColor: '#e0e0e0',
      containerBorderRadius: 0,
      containerPadding: 0,
      containerMaxWidth: 0,
    },
  });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isEnabledRef = useRef(options.enabled);
  const isInitializedRef = useRef(false);

  // Función para crear un hash simple de los datos para detectar cambios
  const createDataHash = useCallback((data: AutoSaveData): string => {
    try {
      // Crear una versión limpia y determinística de los datos
      const serializable = {
        title: data.title || '',
        description: data.description || '',
        coverImageUrl: data.coverImageUrl || '',
        components: data.components.map((comp) => ({
          id: comp.id || '',
          type: comp.type || '',
          content: comp.content || '',
          style: comp.style || {},
          props: comp.props || {},
        })),
        componentsWeb: data.componentsWeb.map((comp) => ({
          id: comp.id || '',
          type: comp.type || '',
          content: comp.content || '',
          style: comp.style || {},
          props: comp.props || {},
        })),
        config: {
          templateType: data.config?.templateType || '',
          emailBackground: data.config?.emailBackground || '#ffffff',
          selectedBanner: data.config?.selectedBanner || null,
          showGradient: data.config?.showGradient || false,
          gradientColors: data.config?.gradientColors || [],
          activeVersion: data.config?.activeVersion || 'newsletter',
          containerBorderWidth: data.config?.containerBorderWidth || 0,
          containerBorderColor: data.config?.containerBorderColor || '#e0e0e0',
          containerBorderRadius: data.config?.containerBorderRadius || 0,
          containerPadding: data.config?.containerPadding || 0,
          containerMaxWidth: data.config?.containerMaxWidth || 0,
        },
      };

      // Usar stringify con espacio para hacer el hash más estable
      const hashString = JSON.stringify(serializable, null, 0);
      console.log(
        '🔗 Hash created, length:',
        hashString.length,
        'for data with',
        data.components.length,
        'components'
      );
      return hashString;
    } catch (error) {
      console.error('❌ Error creating data hash:', error);
      return JSON.stringify(data);
    }
  }, []);

  // Función para detectar si hay cambios
  const hasChanges = useCallback((): boolean => {
    try {
      const currentHash = createDataHash(currentDataRef.current);
      const lastSavedHash = createDataHash(lastSavedDataRef.current);
      const hasChangesResult = currentHash !== lastSavedHash;

      console.log('🔍 DETAILED Hash comparison:', {
        current: {
          title: currentDataRef.current.title,
          componentsCount: currentDataRef.current.components.length,
          firstComponentId: currentDataRef.current.components[0]?.id,
          firstComponentContent: currentDataRef.current.components[0]?.content?.substring(0, 30),
          hashStart: currentHash.substring(0, 50),
          hashEnd: currentHash.substring(currentHash.length - 50),
        },
        lastSaved: {
          title: lastSavedDataRef.current.title,
          componentsCount: lastSavedDataRef.current.components.length,
          firstComponentId: lastSavedDataRef.current.components[0]?.id,
          firstComponentContent: lastSavedDataRef.current.components[0]?.content?.substring(0, 30),
          hashStart: lastSavedHash.substring(0, 50),
          hashEnd: lastSavedHash.substring(lastSavedHash.length - 50),
        },
        hashesEqual: currentHash === lastSavedHash,
        hashLengthsCurrent: currentHash.length,
        hashLengthsLastSaved: lastSavedHash.length,
        hasChanges: hasChangesResult,
      });

      // TEMPORAL: Log completo para debugging específico
      if (!hasChangesResult && currentDataRef.current.components.length > 0) {
        console.log('🚨 NO CHANGES DETECTED - Full debug:', {
          currentDataLength: JSON.stringify(currentDataRef.current).length,
          lastSavedDataLength: JSON.stringify(lastSavedDataRef.current).length,
          currentFirstComponent: currentDataRef.current.components[0],
          lastSavedFirstComponent: lastSavedDataRef.current.components[0],
        });
      }

      return hasChangesResult;
    } catch (error) {
      console.error('❌ Error in hasChanges:', error);
      return false;
    }
  }, [createDataHash]);

  // Función para realizar el guardado
  const performSave = useCallback(async () => {
    if (!hasChanges() || !options.onSave) {
      console.log('⚪ performSave: No changes or no onSave function');
      return;
    }

    try {
      console.log('💾 performSave: Starting save process');
      console.log('📋 Before save - current data:', {
        title: currentDataRef.current.title,
        componentsCount: currentDataRef.current.components.length,
        firstComponentContent: currentDataRef.current.components[0]?.content?.substring(0, 30),
      });

      setAutoSaveState((prev) => ({
        ...prev,
        isAutoSaving: true,
        lastError: null,
      }));

      await options.onSave(currentDataRef.current);

      // ⚡ IMPORTANTE: Marcar como guardado exitosamente SOLO aquí
      console.log('✅ Save successful, updating lastSavedDataRef');
      console.log('📋 Before update lastSavedDataRef:', {
        title: lastSavedDataRef.current.title,
        componentsCount: lastSavedDataRef.current.components.length,
      });

      lastSavedDataRef.current = { ...currentDataRef.current };

      console.log('📋 After update lastSavedDataRef:', {
        title: lastSavedDataRef.current.title,
        componentsCount: lastSavedDataRef.current.components.length,
      });

      setAutoSaveState((prev) => ({
        ...prev,
        isAutoSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
        lastError: null,
      }));

      options.onSuccess?.(currentDataRef.current);

      console.log('✅ Auto-guardado exitoso:', new Date().toLocaleTimeString());
    } catch (error) {
      const saveError = error as Error;

      console.error('❌ Error en performSave:', saveError);
      setAutoSaveState((prev) => ({
        ...prev,
        isAutoSaving: false,
        lastError: saveError,
      }));

      options.onError?.(saveError);
    }
  }, [hasChanges, options]);

  // Función para manejar cambios con debounce
  const handleChange = useCallback(() => {
    console.log('🚀 AutoSave handleChange called, enabled:', isEnabledRef.current);

    if (!isEnabledRef.current) {
      console.log('⚪ AutoSave disabled, skipping');
      return;
    }

    // Actualizar estado de cambios - SIEMPRE mostrar actividad
    setAutoSaveState((prev) => ({
      ...prev,
      hasUnsavedChanges: true, // Siempre marcar como que hay cambios
      changeCount: prev.changeCount + 1,
    }));

    // Limpiar timeout anterior
    if (debounceTimeoutRef.current) {
      console.log('🕐 Clearing previous debounce timeout');
      clearTimeout(debounceTimeoutRef.current);
    }

    // Programar guardado con debounce mínimo
    const debounceDelay = options.debounceDelay || 100;
    console.log('⏰ Setting debounce timeout for', debounceDelay, 'ms');

    debounceTimeoutRef.current = setTimeout(async () => {
      console.log('⏰ Debounce timeout fired, starting auto-save with fresh data');

      // ⚡ CRÍTICO: Esperar un poco para que React actualice el estado
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Actualizar los datos justo antes de guardar
      const freshData = currentDataRef.current;
      console.log('📊 Fresh data for save:', {
        title: freshData.title,
        componentsCount: freshData.components.length,
        firstComponentContent: freshData.components[0]?.content?.substring(0, 50) + '...',
      });

      console.log('💾 Starting auto-save with updated data...');
      performSave();
    }, debounceDelay);
  }, [performSave, options.debounceDelay]);

  // Función para actualizar datos
  const updateData = useCallback((newData: Partial<AutoSaveData>) => {
    console.log('📝 updateData called with changes:', Object.keys(newData));

    // ⚡ CRÍTICO: Verificar si newData es completo o parcial
    const isCompleteData =
      newData.title !== undefined &&
      newData.components !== undefined &&
      newData.componentsWeb !== undefined;

    const oldData = { ...currentDataRef.current };

    if (isCompleteData) {
      // Si es data completo, reemplazar completamente
      currentDataRef.current = newData as AutoSaveData;
      console.log('🔄 COMPLETE data replacement');
    } else {
      // Si es parcial, hacer merge
      currentDataRef.current = {
        ...currentDataRef.current,
        ...newData,
      };
      console.log('🔄 PARTIAL data merge');
    }

    console.log('📊 Data updated:', {
      title: currentDataRef.current.title,
      componentsCount: currentDataRef.current.components.length,
      componentsWebCount: currentDataRef.current.componentsWeb.length,
      oldTitle: oldData.title,
      oldComponentsCount: oldData.components.length,
    });

    // TEMPORAL: Log detallado de primer componente para debugging
    const firstComponent = currentDataRef.current.components[0];
    if (firstComponent) {
      console.log('🔍 FIRST COMPONENT DEBUG:', {
        id: firstComponent.id,
        contentLength: firstComponent.content?.length || 0,
        contentStart: firstComponent.content?.substring(0, 50) || '',
      });
    }

    // No llamar handleChange aquí - será llamado por markChange
  }, []);

  // Función para marcar cambio manual
  const markChange = useCallback(
    (changeType?: string) => {
      console.log('🏷️ markChange called with changeType:', changeType || 'genérico');
      handleChange();
    },
    [handleChange]
  );

  // Funciones de control
  const enableAutoSave = useCallback(() => {
    isEnabledRef.current = true;

    // Iniciar intervalo de verificación
    if (options.interval > 0) {
      intervalRef.current = setInterval(() => {
        if (hasChanges()) {
          performSave();
        }
      }, options.interval);
    }

    console.log('🟢 Auto-guardado habilitado');
  }, [hasChanges, performSave, options.interval]);

  const disableAutoSave = useCallback(() => {
    isEnabledRef.current = false;

    // Limpiar timeouts e intervalos
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    console.log('🔴 Auto-guardado deshabilitado');
  }, []);

  const toggleAutoSave = useCallback(() => {
    if (isEnabledRef.current) {
      disableAutoSave();
    } else {
      enableAutoSave();
    }
  }, [enableAutoSave, disableAutoSave]);

  const resetChanges = useCallback(() => {
    lastSavedDataRef.current = { ...currentDataRef.current };
    setAutoSaveState((prev) => ({
      ...prev,
      hasUnsavedChanges: false,
      changeCount: 0,
    }));
  }, []);

  const forceSave = useCallback(async () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    await performSave();
  }, [performSave]);

  // Inicializar auto-guardado si está habilitado - solo una vez
  useEffect(() => {
    if (options.enabled) {
      enableAutoSave();
    }

    return () => {
      disableAutoSave();
    };
  }, [options.enabled, enableAutoSave, disableAutoSave]);

  // Actualizar SOLO los datos actuales cuando cambian los datos iniciales
  // NO actualizar lastSavedDataRef para mantener la detección de cambios
  useEffect(() => {
    if (!isInitializedRef.current) {
      // Primera inicialización
      console.log('🎯 First initialization with data:', {
        title: initialData.title,
        componentsCount: initialData.components.length,
      });
      currentDataRef.current = initialData;
      isInitializedRef.current = true;
    } else {
      // Re-renders posteriores - solo actualizar currentDataRef si los datos han cambiado realmente
      const currentHash = JSON.stringify(currentDataRef.current);
      const newHash = JSON.stringify(initialData);

      if (currentHash !== newHash) {
        console.log('🔄 Data actually changed, updating currentDataRef');
        currentDataRef.current = initialData;
      } else {
        console.log('🔒 Data unchanged, preserving references');
      }
    }
  }, [initialData]);

  return {
    autoSaveState,
    enableAutoSave,
    disableAutoSave,
    toggleAutoSave,
    markChange,
    resetChanges,
    forceSave,
    updateData,
  };
};
