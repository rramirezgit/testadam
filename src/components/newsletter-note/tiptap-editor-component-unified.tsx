'use client';

import type React from 'react';

import { Box } from '@mui/material';

import { UnifiedEditor, type ToolbarGroup } from '../unified-editor';

interface TipTapEditorComponentProps {
  content: string;
  onChange: (content: string) => void;
  showToolbar?: boolean;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  editorType?: 'paragraph' | 'heading' | 'button';
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * TipTapEditorComponent migrado al sistema unificado
 *
 * MIGRACIÓN:
 * - ✅ Misma API de props para compatibilidad
 * - ✅ Soporte para tipos de componente (paragraph, heading, button)
 * - ✅ Configuración dinámica según tipo
 * - ✅ Mejor integración con Material-UI
 */
export default function TipTapEditorComponent({
  content,
  onChange,
  showToolbar = true,
  style,
  className,
  placeholder = 'Escribe aquí...',
  editorType = 'paragraph',
  headingLevel = 2,
}: TipTapEditorComponentProps) {
  const handleChange = (output: string) => {
    // El editor original devolvía getText(), mantenemos compatibilidad
    onChange(output);
  };

  // Configurar extensiones según el tipo
  const getExtensionConfig = () => {
    const baseConfig = {
      bold: true,
      italic: true,
      underline: true,
      textColor: true,
      fontFamily: true,
    };

    if (editorType === 'button') {
      return {
        ...baseConfig,
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        textAlign: false,
        link: false,
      };
    }

    return {
      ...baseConfig,
      textAlign: true,
      heading: editorType === 'heading' ? { levels: [headingLevel] } : false,
      bulletList: editorType === 'paragraph',
      orderedList: editorType === 'paragraph',
    };
  };

  // Configurar toolbar según el tipo
  const getToolbarConfig = () => {
    if (!showToolbar) return { enabled: false };

    if (editorType === 'button') {
      return {
        enabled: true,
        position: 'top' as const,
        groups: ['format', 'color'] as ToolbarGroup[],
      };
    }

    return {
      enabled: true,
      position: 'top' as const,
      groups: ['format', 'color', 'align', 'history'] as ToolbarGroup[],
    };
  };

  // Estilos dinámicos según el tipo
  const getEditorStyles = () => {
    if (editorType === 'heading') {
      const fontSize =
        {
          1: '24px',
          2: '20px',
          3: '18px',
          4: '16px',
          5: '14px',
          6: '12px',
        }[headingLevel] || '16px';

      return {
        '& .ProseMirror': {
          fontSize,
          fontWeight: 'bold',
          marginBottom: '16px',
        },
      };
    }

    if (editorType === 'button') {
      return {
        '& .ProseMirror': {
          color: 'white',
          textAlign: 'center',
          padding: '8px 16px',
          backgroundColor: 'primary.main',
          borderRadius: 1,
        },
      };
    }

    return {};
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={getEditorStyles()}>
        <UnifiedEditor
          variant="component"
          componentType={editorType === 'paragraph' ? 'paragraph' : 'heading'}
          headingLevel={headingLevel}
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          outputFormat="text" // Mantener compatibilidad con API original
          extensions={getExtensionConfig()}
          toolbar={getToolbarConfig()}
          className={className}
          style={style}
          minHeight={editorType === 'button' ? 40 : 60}
          sx={{
            border: editorType === 'button' ? 'none' : '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
  );
}
