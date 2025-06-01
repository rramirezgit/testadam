'use client';

import React from 'react';

import { Box, Chip, Typography } from '@mui/material';

// Editores
import ExtendedTipTapEditor from './extended-tiptap-editor';
import { useEducationEditorFlags } from '../../hooks/use-feature-flags';
import ExtendedTipTapEditorUnified from './extended-tiptap-editor-unified';

interface ExtendedTipTapEditorWithFlagsProps {
  content: string;
  onChange: (content: string) => void;
  isHeading?: boolean;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  onSelectionUpdate?: (editor: any) => void;
  showDebugInfo?: boolean; // Para mostrar qué versión se está usando
}

/**
 * Wrapper del ExtendedTipTapEditor que implementa feature flags
 *
 * Este componente decide automáticamente qué versión del editor usar
 * basándose en los feature flags configurados.
 *
 * USADO EN:
 * - educacion-editor.tsx (5 instancias)
 * - Componentes de contenido educativo avanzado
 */
export default function ExtendedTipTapEditorWithFlags({
  content,
  onChange,
  isHeading = false,
  headingLevel = 2,
  placeholder,
  style,
  className,
  onSelectionUpdate,
  showDebugInfo = false,
}: ExtendedTipTapEditorWithFlagsProps) {
  const { useUnifiedExtendedTiptapEditor, enableMetadata, logUsage } = useEducationEditorFlags();

  // Log del uso para métricas
  React.useEffect(() => {
    logUsage('useUnifiedExtendedTiptapEditor', useUnifiedExtendedTiptapEditor);
  }, [useUnifiedExtendedTiptapEditor, logUsage]);

  // Callback para metadata en versión unificada
  const handleChange = (htmlContent: string) => {
    if (enableMetadata && useUnifiedExtendedTiptapEditor) {
      console.log('[Educación] ExtendedTiptapEditor with metadata enabled');
    }

    // Mantener compatibilidad total con API original
    onChange(htmlContent);
  };

  // Renderizar información de debug en desarrollo
  const renderDebugInfo = () => {
    if (!showDebugInfo || process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <Box sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          ExtendedTiptapEditor:
        </Typography>
        <Chip
          size="small"
          label={useUnifiedExtendedTiptapEditor ? 'Unificado' : 'Original'}
          color={useUnifiedExtendedTiptapEditor ? 'success' : 'default'}
          variant="outlined"
        />
        {enableMetadata && (
          <Chip size="small" label="Metadata ON" color="info" variant="outlined" />
        )}
        {isHeading && (
          <Chip size="small" label={`H${headingLevel}`} color="secondary" variant="outlined" />
        )}
      </Box>
    );
  };

  return (
    <Box>
      {renderDebugInfo()}

      {useUnifiedExtendedTiptapEditor ? (
        // ✅ Versión Unificada - Nueva arquitectura
        <ExtendedTipTapEditorUnified
          content={content}
          onChange={handleChange}
          isHeading={isHeading}
          headingLevel={headingLevel}
          placeholder={placeholder}
          style={style}
          className={className}
          onSelectionUpdate={onSelectionUpdate}
        />
      ) : (
        // ❌ Versión Original - Para rollback o usuarios no en A/B test
        <ExtendedTipTapEditor
          content={content}
          onChange={onChange}
          isHeading={isHeading}
          headingLevel={headingLevel}
          placeholder={placeholder}
          style={style}
          className={className}
          onSelectionUpdate={onSelectionUpdate}
        />
      )}
    </Box>
  );
}

/**
 * MIGRATION STATUS: Ready for Phase 2
 *
 * COMPONENTS TO MIGRATE:
 * 1. educacion-editor.tsx (5 instancias) ✅
 * 2. Componentes educativos avanzados
 *
 * ROLLOUT STRATEGY:
 * - Development: 100% unified (testing)
 * - Staging: 25% A/B testing
 * - Production: 10% → 25% → 50% gradual rollout
 */
