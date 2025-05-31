'use client';

import type React from 'react';

import { useEffect } from 'react';
import Color from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { useEditor, EditorContent } from '@tiptap/react';

import { Box } from '@mui/material';

interface SimpleTipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
  onSelectionUpdate?: (editor: any) => void;
}

export default function SimpleTipTapEditor({
  content,
  onChange,
  style,
  className,
  placeholder = 'Escribe aquí...',
  onSelectionUpdate,
}: SimpleTipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor: _editor }) => {
      // Para React Email, usamos el texto plano
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

  return (
    <Box className={className} style={style}>
      <EditorContent editor={editor} />
    </Box>
  );
}
