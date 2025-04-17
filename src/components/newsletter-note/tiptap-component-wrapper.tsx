"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Box, IconButton } from "@mui/material"
import { Icon } from "@iconify/react"
import TiptapEditor from "./tiptap-editor"
import FormattingToolbar from "./formatting-toolbar"
import type { Editor } from "@tiptap/react"

interface TiptapComponentWrapperProps {
  id: string
  content: string
  onChange: (id: string, content: string) => void
  onMove: (id: string, direction: "up" | "down") => void
  onRemove: (id: string) => void
  isSelected: boolean
  index: number
  totalComponents: number
  componentType: "heading" | "paragraph" | "button"
  style?: React.CSSProperties
}

export default function TiptapComponentWrapper({
  id,
  content,
  onChange,
  onMove,
  onRemove,
  isSelected,
  index,
  totalComponents,
  componentType,
  style,
}: TiptapComponentWrapperProps) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleSelectionUpdate = (newEditor: Editor) => {
    setEditor(newEditor)
  }

  const handleChange = (htmlContent: string, rawText: string) => {
    onChange(id, rawText)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Aquí podrías implementar la lógica para seleccionar este componente
  }

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "relative",
        padding: "8px",
        margin: "4px 0",
        border: isSelected ? "2px solid #3f51b5" : "1px solid transparent",
        borderRadius: "4px",
        transition: "all 0.2s",
        "&:hover": {
          border: "1px solid #e0e0e0",
        },
      }}
      onClick={handleClick}
    >
      <TiptapEditor
        content={content}
        onChange={handleChange}
        onSelectionUpdate={handleSelectionUpdate}
        style={{
          ...style,
          fontFamily: componentType === "heading" ? "inherit" : style?.fontFamily,
          fontSize: componentType === "heading" ? "inherit" : style?.fontSize,
        }}
      />

      {isSelected && (
        <>
          <Box sx={{ mt: 2, mb: 1 }}>
            <FormattingToolbar editor={editor} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "4px",
              right: "4px",
              display: "flex",
              gap: "4px",
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              padding: "2px",
            }}
          >
            <IconButton size="small" onClick={() => onMove(id, "up")} disabled={index === 0}>
              <Icon icon="mdi:arrow-up" width={16} />
            </IconButton>
            <IconButton size="small" onClick={() => onMove(id, "down")} disabled={index === totalComponents - 1}>
              <Icon icon="mdi:arrow-down" width={16} />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => onRemove(id)}>
              <Icon icon="mdi:delete" width={16} />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  )
}
