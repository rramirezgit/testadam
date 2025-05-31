import './editor-styles.css';

import type React from 'react';

import { useEffect } from 'react';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { useEditor, EditorContent } from '@tiptap/react';

import { Box } from '@mui/material';

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

export default function ExtendedTipTapEditor({
  content,
  onChange,
  style,
  className,
  placeholder = 'Escribe aquí...',
  onSelectionUpdate,
  isHeading = false,
  headingLevel = 2,
}: ExtendedTipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      FontFamily,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor: _editor }) => {
      onChange(_editor.getHTML());
    },
    onSelectionUpdate: ({ editor: _editor }) => {
      if (onSelectionUpdate) {
        onSelectionUpdate(_editor);
      }
    },
    editorProps: {
      attributes: {
        class: className || 'tiptap-editor',
        placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Aplicar formato de encabezado si es necesario
  useEffect(() => {
    if (editor && isHeading) {
      // Asegurarse de que headingLevel sea un número válido (1-6)
      const level = Math.min(Math.max(1, headingLevel || 2), 6) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.commands.toggleHeading({ level });
    }
  }, [editor, isHeading, headingLevel]);

  return (
    <Box className={className} style={{ ...style, position: 'relative' }}>
      <EditorContent editor={editor} />
    </Box>
  );
}
