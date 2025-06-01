'use client';

import React from 'react';

import { Box, Chip, Typography } from '@mui/material';

// Editores
import TipTapEditorComponent from './tiptap-editor-component';
import { useNewsletterEditorFlags } from '../../hooks/use-feature-flags';
import TipTapEditorComponentUnified from './tiptap-editor-component-unified';

interface TipTapEditorComponentWithFlagsProps {
  content: string;
  onChange: (content: string) => void;
  showToolbar?: boolean;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  editorType?: 'paragraph' | 'heading' | 'button';
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  showDebugInfo?: boolean; // Para mostrar qué versión se está usando
}

/**
 * Wrapper del TiptapEditorComponent que implementa feature flags
 *
 * Este componente decide automáticamente qué versión del editor usar
 * basándose en los feature flags configurados.
 *
 * USADO EN:
 * - Componentes de newsletter con toolbar personalizada
 * - Editores con tipos específicos (paragraph, heading, button)
 */
export default function TipTapEditorComponentWithFlags({
  content,
  onChange,
  showToolbar = true,
  style,
  className,
  placeholder = 'Escribe aquí...',
  editorType = 'paragraph',
  headingLevel = 2,
  showDebugInfo = false,
}: TipTapEditorComponentWithFlagsProps) {
  const { useUnifiedTiptapEditorComponent, enableMetadata, logUsage } = useNewsletterEditorFlags();

  // Log del uso para métricas
  React.useEffect(() => {
    logUsage('useUnifiedTiptapEditorComponent', useUnifiedTiptapEditorComponent);
  }, [useUnifiedTiptapEditorComponent, logUsage]);

  // Callback para metadata en versión unificada
  const handleChange = (newContent: string) => {
    if (enableMetadata && useUnifiedTiptapEditorComponent) {
      console.log('[Newsletter] TiptapEditorComponent with metadata enabled');
    }

    // Mantener compatibilidad total con API original
    onChange(newContent);
  };

  // Renderizar información de debug en desarrollo
  const renderDebugInfo = () => {
    if (!showDebugInfo || process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <Box sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          TiptapEditorComponent:
        </Typography>
        <Chip
          size="small"
          label={useUnifiedTiptapEditorComponent ? 'Unificado' : 'Original'}
          color={useUnifiedTiptapEditorComponent ? 'success' : 'default'}
          variant="outlined"
        />
        {enableMetadata && (
          <Chip size="small" label="Metadata ON" color="info" variant="outlined" />
        )}
        {showToolbar && (
          <Chip size="small" label="Toolbar ON" color="secondary" variant="outlined" />
        )}
        <Chip size="small" label={editorType} color="primary" variant="outlined" />
        {editorType === 'heading' && (
          <Chip size="small" label={`H${headingLevel}`} color="warning" variant="outlined" />
        )}
      </Box>
    );
  };

  return (
    <Box>
      {renderDebugInfo()}

      {useUnifiedTiptapEditorComponent ? (
        // ✅ Versión Unificada - Nueva arquitectura
        <TipTapEditorComponentUnified
          content={content}
          onChange={handleChange}
          showToolbar={showToolbar}
          style={style}
          className={className}
          placeholder={placeholder}
          editorType={editorType}
          headingLevel={headingLevel}
        />
      ) : (
        // ❌ Versión Original - Para rollback o usuarios no en A/B test
        <TipTapEditorComponent
          content={content}
          onChange={onChange}
          showToolbar={showToolbar}
          style={style}
          className={className}
          placeholder={placeholder}
          editorType={editorType}
          headingLevel={headingLevel}
        />
      )}
    </Box>
  );
}

/**
 * MIGRATION STATUS: Ready for Phase 3
 *
 * COMPONENTES A MIGRAR:
 * 1. Email Editor components
 * 2. Newsletter specialized editors
 * 3. Toolbar-enabled components
 *
 * ROLLOUT STRATEGY:
 * - Development: 100% unified (testing)
 * - Staging: 25% A/B testing
 * - Production: 10% → 25% → 50% gradual rollout
 */
