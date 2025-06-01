'use client';

import type React from 'react';
import type { Editor } from '@tiptap/react';

import { UnifiedEditor } from '../unified-editor';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string, rawText: string) => void;
  onSelectionUpdate?: (editor: Editor) => void;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * TiptapEditor migrado al sistema unificado
 *
 * MIGRACIÓN:
 * - ✅ Misma API de props para compatibilidad
 * - ✅ Misma funcionalidad (HTML + texto plano)
 * - ✅ Configuración newsletter optimizada
 * - ✅ Mejor rendimiento y metadata automática
 */
export default function TiptapEditor({
  content,
  onChange,
  onSelectionUpdate,
  style,
  className,
}: TiptapEditorProps) {
  const handleChange = (output: string, metadata?: any) => {
    // Mantener compatibilidad con la API original
    // onChange(html, texto)
    onChange(output, metadata?.textContent || '');
  };

  return (
    <div className={className} style={style}>
      <UnifiedEditor
        variant="newsletter"
        value={content}
        onChange={handleChange}
        onSelectionUpdate={onSelectionUpdate}
        outputFormat="html"
        placeholder="Escribe tu contenido..."
        extensions={{
          // Configuración específica para newsletter
          bold: true,
          italic: true,
          underline: false,
          textColor: true,
          fontFamily: true,
          textAlign: true,
          bulletList: true,
          orderedList: true,
          link: true,
          image: false, // Generalmente newsletters no necesitan imágenes inline
          heading: { levels: [1, 2, 3] },
        }}
        toolbar={{
          enabled: false, // Editor original no tenía toolbar visible
        }}
        minHeight={100}
        sx={{
          '& .unified-editor-content': {
            minHeight: 'auto',
          },
        }}
      />
    </div>
  );
}
