"use client"

import type React from "react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import FontFamily from "@tiptap/extension-font-family"
import Underline from "@tiptap/extension-underline"
import { useEffect } from "react"

interface SimpleTipTapEditorProps {
  content: string
  onChange: (content: string) => void
  style?: React.CSSProperties
  className?: string
  placeholder?: string
  onSelectionUpdate?: (editor: any) => void
}

export default function SimpleTipTapEditor({
  content,
  onChange,
  style,
  className,
  placeholder = "Escribe aquí...",
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
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      // Para React Email, usamos el texto plano
      onChange(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      if (onSelectionUpdate) {
        onSelectionUpdate(editor)
      }
    },
    editorProps: {
      attributes: {
        class: className || "tiptap-editor",
        placeholder,
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className={className} style={style}>
      <EditorContent editor={editor} />
    </div>
  )
}
