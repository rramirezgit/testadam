"use client"
import { Box, ToggleButtonGroup, ToggleButton, IconButton, Tooltip } from "@mui/material"
import { Icon } from "@iconify/react"
import type { Editor } from "@tiptap/react"

interface FormattingToolbarProps {
  editor: Editor | null
}

export default function FormattingToolbar({ editor }: FormattingToolbarProps) {
  if (!editor) {
    return null
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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

      <ToggleButtonGroup size="small">
        <ToggleButton
          value="left"
          selected={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          aria-label="align left"
        >
          <Icon icon="mdi:format-align-left" />
        </ToggleButton>
        <ToggleButton
          value="center"
          selected={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          aria-label="align center"
        >
          <Icon icon="mdi:format-align-center" />
        </ToggleButton>
        <ToggleButton
          value="right"
          selected={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          aria-label="align right"
        >
          <Icon icon="mdi:format-align-right" />
        </ToggleButton>
        <ToggleButton
          value="justify"
          selected={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          aria-label="align justify"
        >
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
