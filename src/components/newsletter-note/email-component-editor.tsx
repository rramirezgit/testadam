"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Box, Typography } from "@mui/material"
import TiptapEditor from "./tiptap-editor"
import type { Editor } from "@tiptap/react"

interface EmailComponentEditorProps {
  content: string
  onChange: (content: string) => void
  onSelectionUpdate?: (editor: Editor) => void
  componentType: "heading" | "paragraph" | "button"
  level?: 1 | 2 | 3 | 4 | 5 | 6
  style?: React.CSSProperties
  isSelected: boolean
}

export default function EmailComponentEditor({
  content,
  onChange,
  onSelectionUpdate,
  componentType,
  level = 2,
  style,
  isSelected,
}: EmailComponentEditorProps) {
  const [editorContent, setEditorContent] = useState(content)

  useEffect(() => {
    setEditorContent(content)
  }, [content])

  const handleChange = (htmlContent: string, rawText: string) => {
    setEditorContent(htmlContent)
    // Para React Email, usamos el texto plano o un HTML simplificado
    // dependiendo del componente
    onChange(rawText)
  }

  // Determinar el componente y variante según el tipo
  const getComponent = () => {
    switch (componentType) {
      case "heading":
        return {
          component: `h${level}`,
          variant: level === 1 ? "h4" : level === 2 ? "h5" : "h6",
        }
      case "paragraph":
        return {
          component: "p",
          variant: "body1",
        }
      case "button":
        return {
          component: "div",
          variant: "button",
        }
      default:
        return {
          component: "p",
          variant: "body1",
        }
    }
  }

  const { component, variant } = getComponent()

  return (
    <Box sx={{ position: "relative", mb: 2 }}>
      <Typography component={component as any} variant={variant as any} sx={{ mb: 0, ...style }}>
        <TiptapEditor
          content={editorContent}
          onChange={handleChange}
          onSelectionUpdate={onSelectionUpdate}
          style={{
            outline: "none",
            padding: "4px",
            borderRadius: "4px",
            transition: "all 0.2s",
            border: isSelected ? "1px solid rgba(63, 81, 181, 0.5)" : "1px solid transparent",
            "&:hover": {
              border: "1px solid #e0e0e0",
            },
          }}
        />
      </Typography>
    </Box>
  )
}
