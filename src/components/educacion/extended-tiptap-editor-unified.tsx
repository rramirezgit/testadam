'use client';

import type React from 'react';

import { Box } from '@mui/material';

import { UnifiedEditor, type ToolbarGroup, type EditorMetadata } from '../unified-editor';

interface ExtendedTipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  onSelectionUpdate?: (editor: any) => void;
  isHeading?: boolean;
  headingLevel?: number;
}

export default function ExtendedTipTapEditorUnified({
  content,
  onChange,
  style,
  className,
  placeholder = 'Escribe aquí...',
  onSelectionUpdate,
  isHeading = false,
  headingLevel = 2,
}: ExtendedTipTapEditorProps) {
  const handleChange = (value: string, metadata?: EditorMetadata) => {
    // Mantener compatibilidad con la API original
    onChange(value);
  };

  const handleSelectionUpdate = (editor: any) => {
    // Llamar onSelectionUpdate si está disponible
    if (onSelectionUpdate) {
      onSelectionUpdate(editor);
    }
  };

  // Configurar extensiones específicas para educación
  const extensions = {
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    textColor: true,
    backgroundColor: false,
    fontFamily: true,
    fontSize: false,
    textAlign: true,
    bulletList: true,
    orderedList: true,
    link: true,
    image: false, // Deshabilitado en el editor básico de educación
    heading: isHeading ? { levels: [headingLevel] } : true,
    blockquote: true,
    horizontalRule: false,
    placeholder: true,
    undo: true,
    redo: true,
  };

  // Configurar toolbar específica para educación
  const toolbarGroups: ToolbarGroup[] = [
    'format',
    'color',
    'align',
    'list',
    'insert',
    'structure',
    'history',
  ];

  return (
    <Box
      component="div"
      className={className}
      style={{
        ...style,
        position: 'relative',
        // Asegurar que el contenedor no cause problemas de hidratación
        display: 'block',
        width: '100%',
      }}
    >
      <UnifiedEditor
        variant="education"
        value={content}
        onChange={handleChange}
        onSelectionUpdate={handleSelectionUpdate}
        placeholder={placeholder}
        extensions={extensions}
        toolbar={{
          enabled: true,
          position: 'top',
          groups: toolbarGroups,
        }}
        outputFormat="html"
        minHeight={80}
        className="tiptap-editor-education"
        componentType={isHeading ? 'heading' : 'paragraph'}
        headingLevel={
          isHeading
            ? (Math.min(Math.max(1, headingLevel || 2), 6) as 1 | 2 | 3 | 4 | 5 | 6)
            : undefined
        }
        // Configuración específica para evitar problemas de hidratación
        editable
        autoFocus={false}
        style={{
          // Asegurar estructura HTML válida
          display: 'block',
          position: 'relative',
        }}
      />
    </Box>
  );
}
