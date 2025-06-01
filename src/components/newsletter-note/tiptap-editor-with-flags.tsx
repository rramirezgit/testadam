'use client';

import React from 'react';

import { Box, Chip, Typography } from '@mui/material';

// Editores
import TiptapEditor from './tiptap-editor';
import TiptapEditorUnified from './tiptap-editor-unified';
import { useNewsletterEditorFlags } from '../../hooks/use-feature-flags';

interface TiptapEditorWithFlagsProps {
  content: string;
  onChange: (content: string, rawText: string) => void;
  onSelectionUpdate?: (editor: any) => void;
  style?: React.CSSProperties;
  className?: string;
  showDebugInfo?: boolean; // Para mostrar qué versión se está usando
}

/**
 * Wrapper del TiptapEditor que implementa feature flags
 *
 * Este componente decide automáticamente qué versión del editor usar
 * basándose en los feature flags configurados.
 *
 * IMPLEMENTACIÓN DE FEATURE FLAGS:
 * - En desarrollo: Usa versión unificada para testing
 * - En staging: A/B testing con 25% de usuarios
 * - En producción: Rollout gradual controlado
 */
export default function TiptapEditorWithFlags({
  content,
  onChange,
  onSelectionUpdate,
  style,
  className,
  showDebugInfo = false,
}: TiptapEditorWithFlagsProps) {
  const { useUnifiedTiptapEditor, enableMetadata, logUsage } = useNewsletterEditorFlags();

  // Log del uso para métricas
  React.useEffect(() => {
    logUsage('useUnifiedTiptapEditor', useUnifiedTiptapEditor);
  }, [useUnifiedTiptapEditor, logUsage]);

  // Callback mejorado que incluye metadata si está habilitada
  const handleChange = (htmlContent: string, textContent?: string) => {
    if (enableMetadata) {
      // En versión unificada, podemos acceder a metadata
      console.log('[Newsletter] Editor usage with metadata enabled');
    }

    // Mantener compatibilidad con la API original
    onChange(htmlContent, textContent || '');
  };

  // Renderizar información de debug en desarrollo
  const renderDebugInfo = () => {
    if (!showDebugInfo || process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <Box sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Newsletter Editor:
        </Typography>
        <Chip
          size="small"
          label={useUnifiedTiptapEditor ? 'Unificado' : 'Original'}
          color={useUnifiedTiptapEditor ? 'success' : 'default'}
          variant="outlined"
        />
        {enableMetadata && (
          <Chip size="small" label="Metadata ON" color="info" variant="outlined" />
        )}
      </Box>
    );
  };

  return (
    <Box>
      {renderDebugInfo()}

      {useUnifiedTiptapEditor ? (
        // ✅ Versión Unificada - Nueva arquitectura
        <TiptapEditorUnified
          content={content}
          onChange={handleChange}
          onSelectionUpdate={onSelectionUpdate}
          style={style}
          className={className}
        />
      ) : (
        // ❌ Versión Original - Para rollback o usuarios no en A/B test
        <TiptapEditor
          content={content}
          onChange={onChange}
          onSelectionUpdate={onSelectionUpdate}
          style={style}
          className={className}
        />
      )}
    </Box>
  );
}

/**
 * GUÍA DE IMPLEMENTACIÓN:
 *
 * 1. REEMPLAZAR EN COMPONENTES:
 *
 * // Antes:
 * import TiptapEditor from './tiptap-editor';
 * <TiptapEditor content={content} onChange={onChange} />
 *
 * // Después:
 * import TiptapEditorWithFlags from './tiptap-editor-with-flags';
 * <TiptapEditorWithFlags content={content} onChange={onChange} />
 *
 *
 * 2. CONFIGURAR FEATURE FLAGS:
 *
 * // Development: Siempre unificado
 * useUnifiedTiptapEditor: true
 *
 * // Staging: A/B testing
 * enableABTesting: true
 * abTestingPercentage: 25
 *
 * // Production: Rollout controlado
 * useUnifiedTiptapEditor: false // Iniciar conservador
 *
 *
 * 3. MONITOREO:
 *
 * - Logs automáticos en desarrollo
 * - Métricas de uso en analytics
 * - A/B testing con usuarios reales
 * - Rollback instantáneo si hay problemas
 *
 *
 * 4. ROLLOUT GRADUAL:
 *
 * Semana 1: 10% usuarios → Validar estabilidad
 * Semana 2: 25% usuarios → Confirmar performance
 * Semana 3: 50% usuarios → Testing extensivo
 * Semana 4: 100% usuarios → Migración completa
 */
