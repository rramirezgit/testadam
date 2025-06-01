'use client';

import React from 'react';

import { Box, Chip, Typography } from '@mui/material';

// Editores
import { Editor } from './editor';
import { EditorUnified } from './editor-unified';
import { useMainEditorFlags } from '../../hooks/use-feature-flags';

import type { EditorProps } from './types';

interface EditorWithFlagsProps extends EditorProps {
  showDebugInfo?: boolean; // Para mostrar qué versión se está usando
}

/**
 * Wrapper del Editor principal que implementa feature flags
 *
 * Este componente decide automáticamente qué versión del editor usar
 * basándose en los feature flags configurados.
 *
 * USADO EN:
 * - Aplicaciones principales del sistema
 * - Editores avanzados con todas las funcionalidades
 * - Modo fullscreen y syntax highlighting
 */
export function EditorWithFlags({ showDebugInfo = false, ...props }: EditorWithFlagsProps) {
  const { useUnifiedMainEditor, enableMetadata, enableAdvancedToolbar, logUsage } =
    useMainEditorFlags();

  // Log del uso para métricas
  React.useEffect(() => {
    logUsage('useUnifiedMainEditor', useUnifiedMainEditor);
  }, [useUnifiedMainEditor, logUsage]);

  // Renderizar información de debug en desarrollo
  const renderDebugInfo = () => {
    if (!showDebugInfo || process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <Box sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          MainEditor:
        </Typography>
        <Chip
          size="small"
          label={useUnifiedMainEditor ? 'Unificado' : 'Original'}
          color={useUnifiedMainEditor ? 'success' : 'default'}
          variant="outlined"
        />
        {enableMetadata && (
          <Chip size="small" label="Metadata ON" color="info" variant="outlined" />
        )}
        {enableAdvancedToolbar && (
          <Chip size="small" label="Advanced Toolbar" color="secondary" variant="outlined" />
        )}
        {props.fullItem && (
          <Chip size="small" label="Full Item" color="warning" variant="outlined" />
        )}
      </Box>
    );
  };

  return (
    <Box>
      {renderDebugInfo()}

      {useUnifiedMainEditor ? (
        // ✅ Versión Unificada - Nueva arquitectura
        <EditorUnified {...props} />
      ) : (
        // ❌ Versión Original - Para rollback o usuarios no en A/B test
        <Editor {...props} />
      )}
    </Box>
  );
}

/**
 * MIGRATION STATUS: Ready for Phase 3
 *
 * COMPONENTES A MIGRAR:
 * 1. Aplicaciones principales del sistema
 * 2. Editores con funcionalidades completas
 * 3. Editor con fullscreen mode
 * 4. Editor con syntax highlighting
 *
 * ROLLOUT STRATEGY:
 * - Development: 100% unified (testing)
 * - Staging: 25% A/B testing
 * - Production: 10% → 25% → 50% gradual rollout
 */
