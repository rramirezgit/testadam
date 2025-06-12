/* eslint-disable consistent-return */
import { useState, useEffect, useCallback } from 'react';

import { defaultDesignState } from '../data/default-configs';
import { getFeaturedPalettes } from '../data/color-palettes';

import type {
  DesignState,
  ColorPalette,
  HeaderTemplate,
  FooterTemplate,
  CustomColorSet,
  DesignHistoryEntry,
  UseDesignStateReturn,
} from '../types';

// ============================================================================
// USE DESIGN STATE HOOK - Newsletter Design System
// ============================================================================

/**
 * Hook central para gestionar el estado completo del design system
 * Incluye manejo de historia para undo/redo, templates, colores y configuraciones
 */
export const useDesignState = (): UseDesignStateReturn => {
  // Estado principal del diseño
  const [designState, setDesignState] = useState<DesignState>(() => {
    // Inicializar con palette destacada por defecto
    const featuredPalettes = getFeaturedPalettes(1);
    return {
      ...defaultDesignState,
      colorPalette: featuredPalettes[0] || null,
    };
  });

  // Estado para tracking de cambios
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Función para crear un snapshot del estado actual
  const createSnapshot = useCallback(
    (description: string): DesignHistoryEntry => ({
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      description,
      state: { ...designState },
    }),
    [designState]
  );

  // Función para actualizar el estado de diseño
  const updateDesign = useCallback((updates: Partial<DesignState>) => {
    setDesignState((prevState) => {
      const newState = { ...prevState, ...updates };

      // Auto-guardar snapshot si hay cambios significativos
      const significantChanges = [
        'headerTemplate',
        'footerTemplate',
        'colorPalette',
        'typography',
        'layout',
      ];

      const hasSignificantChange = significantChanges.some(
        (key) =>
          key in updates &&
          updates[key as keyof DesignState] !== prevState[key as keyof DesignState]
      );

      if (hasSignificantChange) {
        // Crear nuevo snapshot y actualizar historia
        const snapshot = {
          id: `auto_${Date.now()}`,
          timestamp: Date.now(),
          description: 'Auto-saved changes',
          state: prevState,
        };

        const newHistory = [...newState.history];

        // Mantener solo últimos 50 snapshots
        if (newHistory.length >= 50) {
          newHistory.shift();
        }

        newHistory.push(snapshot);

        newState.history = newHistory;
        newState.historyIndex = newHistory.length - 1;
      }

      return newState;
    });

    setHasUnsavedChanges(true);
  }, []);

  // Función para guardar snapshot manual
  const saveSnapshot = useCallback(
    (description: string) => {
      const snapshot = createSnapshot(description);

      setDesignState((prevState) => {
        const newHistory = [...prevState.history];

        // Eliminar snapshots futuros si estamos en medio de la historia
        if (prevState.historyIndex < newHistory.length - 1) {
          newHistory.splice(prevState.historyIndex + 1);
        }

        // Agregar nuevo snapshot
        newHistory.push(snapshot);

        // Mantener límite de historia
        if (newHistory.length > 100) {
          newHistory.shift();
        }

        return {
          ...prevState,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      });
    },
    [createSnapshot]
  );

  // Función para deshacer cambios
  const undo = useCallback(() => {
    setDesignState((prevState) => {
      if (prevState.historyIndex <= 0 || prevState.history.length === 0) {
        return prevState;
      }

      const previousIndex = prevState.historyIndex - 1;
      const previousSnapshot = prevState.history[previousIndex];

      if (previousSnapshot && previousSnapshot.state) {
        return {
          ...prevState,
          ...previousSnapshot.state,
          history: prevState.history,
          historyIndex: previousIndex,
        } as DesignState;
      }

      return prevState;
    });

    setHasUnsavedChanges(true);
  }, []);

  // Función para rehacer cambios
  const redo = useCallback(() => {
    setDesignState((prevState) => {
      if (prevState.historyIndex >= prevState.history.length - 1) {
        return prevState;
      }

      const nextIndex = prevState.historyIndex + 1;
      const nextSnapshot = prevState.history[nextIndex];

      if (nextSnapshot && nextSnapshot.state) {
        return {
          ...prevState,
          ...nextSnapshot.state,
          history: prevState.history,
          historyIndex: nextIndex,
        } as DesignState;
      }

      return prevState;
    });

    setHasUnsavedChanges(true);
  }, []);

  // Función para reset completo
  const resetDesign = useCallback(() => {
    const featuredPalettes = getFeaturedPalettes(1);
    const resetState = {
      ...defaultDesignState,
      colorPalette: featuredPalettes[0] || null,
    };

    // Guardar snapshot antes del reset
    saveSnapshot('Before reset');

    setDesignState(resetState);
    setHasUnsavedChanges(false);
  }, [saveSnapshot]);

  // Funciones de utilidad para checks rápidos
  const canUndo = designState.historyIndex > 0 && designState.history.length > 0;
  const canRedo = designState.historyIndex < designState.history.length - 1;

  // Función para aplicar template
  const applyHeaderTemplate = useCallback(
    (template: HeaderTemplate) => {
      updateDesign({
        headerTemplate: template,
      });
      saveSnapshot(`Applied header template: ${template.name}`);
    },
    [updateDesign, saveSnapshot]
  );

  const applyFooterTemplate = useCallback(
    (template: FooterTemplate) => {
      updateDesign({
        footerTemplate: template,
      });
      saveSnapshot(`Applied footer template: ${template.name}`);
    },
    [updateDesign, saveSnapshot]
  );

  const applyColorPalette = useCallback(
    (palette: ColorPalette) => {
      updateDesign({
        colorPalette: palette,
      });
      saveSnapshot(`Applied color palette: ${palette.name}`);
    },
    [updateDesign, saveSnapshot]
  );

  // Función para actualizar colores personalizados
  const updateCustomColors = useCallback(
    (customColors: Partial<CustomColorSet>) => {
      updateDesign({
        customColors: {
          ...designState.customColors,
          ...customColors,
        },
      });
    },
    [updateDesign, designState.customColors]
  );

  // Auto-save snapshot cada 5 minutos si hay cambios
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveInterval = setInterval(
      () => {
        saveSnapshot('Auto-save (5min)');
        setHasUnsavedChanges(false);
      },
      5 * 60 * 1000
    ); // 5 minutos

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, saveSnapshot]);

  // Debug info en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 Design State Updated:', {
        hasHeader: !!designState.headerTemplate,
        hasFooter: !!designState.footerTemplate,
        colorPalette: designState.colorPalette?.name,
        historyLength: designState.history.length,
        currentIndex: designState.historyIndex,
        canUndo,
        canRedo,
      });
    }
  }, [designState, canUndo, canRedo]);

  return {
    // Estado principal
    designState,

    // Funciones de actualización
    updateDesign,
    resetDesign,

    // Historia (undo/redo)
    canUndo,
    canRedo,
    undo,
    redo,
    saveSnapshot,

    // Aplicar templates
    applyHeaderTemplate,
    applyFooterTemplate,
    applyColorPalette,
    updateCustomColors,

    // Estado de cambios
    hasUnsavedChanges,
  };
};

export default useDesignState;
