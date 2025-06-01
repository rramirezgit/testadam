'use client';

import type React from 'react';

import { Box } from '@mui/material';

import { UnifiedEditor } from '../unified-editor';

interface SimpleTipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  onSelectionUpdate?: (editor: any) => void;
  showToolbar?: boolean;
}

/**
 * SimpleTipTapEditor migrado al sistema unificado
 *
 * MIGRACIÓN:
 * - ✅ Misma API de props para compatibilidad
 * - ✅ Funcionalidad simple con placeholder
 * - ✅ Configuración simple optimizada
 * - ✅ Mejor UX con toolbar básica
 */
export default function SimpleTipTapEditor({
  content,
  onChange,
  style,
  className,
  placeholder = 'Escribe aquí...',
  onSelectionUpdate,
  showToolbar = true,
}: SimpleTipTapEditorProps) {
  const handleChange = (output: string) => {
    onChange(output);
  };

  return (
    <Box className={className} style={style}>
      <UnifiedEditor
        variant="simple"
        value={content}
        onChange={handleChange}
        onSelectionUpdate={onSelectionUpdate}
        placeholder={placeholder}
        outputFormat="html"
        extensions={{
          // Configuración simple pero funcional
          bold: true,
          italic: true,
          underline: true,
          textColor: true,
          fontFamily: true,
          textAlign: true,
          bulletList: true,
          orderedList: true,
          heading: { levels: [1, 2, 3] },
          link: false, // Mantener simplicidad
          image: false,
        }}
        toolbar={{
          enabled: showToolbar,
          position: 'top',
          groups: ['format', 'align', 'list', 'history'],
        }}
        minHeight={showToolbar ? 120 : 'auto'}
        sx={{
          // ✅ Sin borde ni padding cuando no hay toolbar (inline text)
          border: showToolbar ? '1px solid' : 'none',
          borderColor: showToolbar ? 'divider' : 'transparent',
          borderRadius: showToolbar ? 1 : 0,
          '& .unified-editor-content': {
            padding: showToolbar ? 2 : 0,
          },
          '& .ProseMirror': {
            padding: showToolbar ? '16px' : '0 !important',
            minHeight: showToolbar ? 'inherit' : 'auto',
          },
        }}
      />
    </Box>
  );
}
