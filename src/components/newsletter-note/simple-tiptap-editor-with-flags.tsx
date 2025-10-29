'use client';

import React from 'react';

import { Box } from '@mui/material';

// Editores
import SimpleTipTapEditor from './simple-tiptap-editor';
import SimpleTipTapEditorUnified from './simple-tiptap-editor-unified';
import { useNewsletterEditorFlags } from '../../hooks/use-feature-flags';

interface SimpleTipTapEditorWithFlagsProps {
  content: string;
  onChange: (content: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  className?: string;
  onSelectionUpdate?: (editor: any) => void;
  showToolbar?: boolean; // Para controlar si mostrar la toolbar
  showDebugInfo?: boolean; // Para mostrar qué versión se está usando
}

/**
 * Wrapper del SimpleTipTapEditor que implementa feature flags
 *
 * Este componente decide automáticamente qué versión del editor usar
 * basándose en los feature flags configurados.
 *
 * USADO EN:
 * - HeadingComponent
 * - ButtonComponent
 * - ParagraphComponent
 * - SummaryComponent
 * - newsletter-content-editor
 */
export default function SimpleTipTapEditorWithFlags({
  content,
  onChange,
  style,
  placeholder,
  className,
  onSelectionUpdate,
  showToolbar = false, // Por defecto FALSE para newsletter components
  showDebugInfo = false,
}: SimpleTipTapEditorWithFlagsProps) {
  const { useUnifiedSimpleTiptapEditor, enableMetadata, logUsage } = useNewsletterEditorFlags();

  // Log del uso para métricas
  React.useEffect(() => {
    logUsage('useUnifiedSimpleTiptapEditor', useUnifiedSimpleTiptapEditor);
  }, [useUnifiedSimpleTiptapEditor, logUsage]);

  // Callback para metadata en versión unificada
  const handleChange = (htmlContent: string) => {
    if (enableMetadata && useUnifiedSimpleTiptapEditor) {
      console.log('[Newsletter] SimpleTiptapEditor with metadata enabled');
    }

    // Mantener compatibilidad total con API original
    onChange(htmlContent);
  };

  return (
    <Box>
      {/* {renderDebugInfo()} */}

      {useUnifiedSimpleTiptapEditor ? (
        // ✅ Versión Unificada - Nueva arquitectura
        <SimpleTipTapEditorUnified
          content={content}
          onChange={handleChange}
          style={style}
          placeholder={placeholder}
          className={className}
          onSelectionUpdate={onSelectionUpdate}
          showToolbar={showToolbar}
        />
      ) : (
        // ❌ Versión Original - Para rollback o usuarios no en A/B test
        <SimpleTipTapEditor
          content={content}
          onChange={onChange}
          style={style}
          placeholder={placeholder}
          className={className}
          onSelectionUpdate={onSelectionUpdate}
          showToolbar={showToolbar}
        />
      )}
    </Box>
  );
}

/**
 * MIGRATION STATUS: Ready for Phase 1
 *
 * COMPONENTS TO MIGRATE:
 * 1. HeadingComponent.tsx ✅
 * 2. ButtonComponent.tsx ✅
 * 3. ParagraphComponent.tsx ✅
 * 4. SummaryComponent.tsx ✅
 * 5. newsletter-content-editor.tsx ✅
 *
 * ROLLOUT STRATEGY:
 * - Development: 100% unified (testing)
 * - Staging: 25% A/B testing
 * - Production: 10% → 25% → 50% gradual rollout
 */
