'use client';

import type React from 'react';

import { useEffect } from 'react';
import Color from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';
import { useEditor, type Editor, EditorContent } from '@tiptap/react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string, rawText: string) => void;
  onSelectionUpdate?: (editor: Editor) => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function TiptapEditor({
  content,
  onChange,
  onSelectionUpdate,
  style,
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor: _editor }) => {
      // Proporcionar tanto el HTML como el texto plano
      onChange(_editor.getHTML(), _editor.getText());
    },
    onSelectionUpdate: ({ editor: _editor }) => {
      if (onSelectionUpdate) {
        onSelectionUpdate(_editor);
      }
    },
  });

  // Actualizar el contenido cuando cambia desde props
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className={className} style={{ ...style }}>
      <EditorContent editor={editor} />
    </div>
  );
}
