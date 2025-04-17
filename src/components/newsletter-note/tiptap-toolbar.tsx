"use client"

import type React from "react"

import { Box, ToggleButtonGroup, ToggleButton, IconButton, Tooltip } from "@mui/material"
import { Icon } from "@iconify/react"
import type { Editor } from "@tiptap/react"
import { useState } from "react"

interface TipTapToolbarProps {
  editor: Editor | null
}

export default function TipTapToolbar({ editor }: TipTapToolbarProps) {
  const [alignment, setAlignment] = useState("left")

  if (!editor) {
    return null
  }

  const handleAlignmentChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment)
      editor.chain().focus().setTextAlign(newAlignment).run()
    }
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
      <ToggleButtonGroup size="small">
        <ToggleButton
          value="bold"
          selected={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="bold"
        >
          <Icon icon="mdi:format-bold" />
        </ToggleButton>
        <ToggleButton
          value="italic"
          selected={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="italic"
        >
          <Icon icon="mdi:format-italic" />
        </ToggleButton>
        <ToggleButton
          value="underline"
          selected={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="underline"
        >
          <Icon icon="mdi:format-underline" />
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup size="small" value={alignment} exclusive onChange={handleAlignmentChange}>
        <ToggleButton value="left" aria-label="align left">
          <Icon icon="mdi:format-align-left" />
        </ToggleButton>
        <ToggleButton value="center" aria-label="align center">
          <Icon icon="mdi:format-align-center" />
        </ToggleButton>
        <ToggleButton value="right" aria-label="align right">
          <Icon icon="mdi:format-align-right" />
        </ToggleButton>
        <ToggleButton value="justify" aria-label="align justify">
          <Icon icon="mdi:format-align-justify" />
        </ToggleButton>
      </ToggleButtonGroup>

      <Box>
        <Tooltip title="Deshacer">
          <IconButton size="small" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Icon icon="mdi:undo" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Rehacer">
          <IconButton size="small" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Icon icon="mdi:redo" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}
