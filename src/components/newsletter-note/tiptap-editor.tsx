"use client"

import type React from "react"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import FontFamily from "@tiptap/extension-font-family"
import TextAlign from "@tiptap/extension-text-align"
import { useEffect } from "react"

interface TiptapEditorProps {
  content: string
  onChange: (content: string, rawText: string) => void
  onSelectionUpdate?: (editor: Editor) => void
  style?: React.CSSProperties
  className?: string
}

export default function TiptapEditor({ content, onChange, onSelectionUpdate, style, className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      // Proporcionar tanto el HTML como el texto plano
      onChange(editor.getHTML(), editor.getText())
    },
    onSelectionUpdate: ({ editor }) => {
      if (onSelectionUpdate) {
        onSelectionUpdate(editor)
      }
    },
  })

  // Actualizar el contenido cuando cambia desde props
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className={className} style={{ ...style }}>
      <EditorContent editor={editor} />
    </div>
  )
}
