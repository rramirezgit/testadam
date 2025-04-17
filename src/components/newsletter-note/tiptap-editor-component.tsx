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
import { Box } from "@mui/material"
import TipTapToolbar from "./tiptap-toolbar"

interface TipTapEditorComponentProps {
  content: string
  onChange: (content: string) => void
  showToolbar?: boolean
  style?: React.CSSProperties
  className?: string
  placeholder?: string
  editorType?: "paragraph" | "heading" | "button"
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

export default function TipTapEditorComponent({
  content,
  onChange,
  showToolbar = true,
  style,
  className,
  placeholder = "Escribe aquí...",
  editorType = "paragraph",
  headingLevel = 2,
}: TipTapEditorComponentProps) {
  // Configurar extensiones según el tipo de editor
  const getExtensions = () => {
    const baseExtensions = [TextStyle, Color, FontFamily, Underline]

    if (editorType === "button") {
      return [
        StarterKit.configure({
          heading: false,
          bulletList: false,
          orderedList: false,
          blockquote: false,
          codeBlock: false,
        }),
        ...baseExtensions,
      ]
    }

    return [
      StarterKit,
      ...baseExtensions,
      TextAlign.configure({
        types: [editorType === "heading" ? "heading" : "paragraph"],
      }),
    ]
  }

  const editor = useEditor({
    extensions: getExtensions(),
    content,
    onUpdate: ({ editor }) => {
      // Para React Email, usamos el texto plano
      onChange(editor.getText())
    },
    editorProps: {
      attributes: {
        class: className || "tiptap-editor",
        placeholder,
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getText()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  // Aplicar estilos según el tipo de editor
  const getEditorStyle = () => {
    const baseStyle = {
      ...style,
    }

    if (editorType === "heading") {
      return {
        ...baseStyle,
        fontSize: headingLevel === 1 ? "24px" : headingLevel === 2 ? "20px" : "16px",
        fontWeight: "bold",
        marginBottom: "16px",
      }
    }

    if (editorType === "button") {
      return {
        ...baseStyle,
        color: "white",
        width: "100%",
      }
    }

    return baseStyle
  }

  return (
    <Box sx={{ width: "100%" }}>
      {showToolbar && editor && <TipTapToolbar editor={editor} />}
      <Box sx={getEditorStyle()}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  )
}
