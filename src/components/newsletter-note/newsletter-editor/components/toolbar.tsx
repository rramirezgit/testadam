"use client"

import { Icon } from "@iconify/react"

import { Box, Button, TextField, CircularProgress, Toolbar as MuiToolbar } from "@mui/material"

interface ToolbarProps {
  title: string
  setTitle: (title: string) => void
  onClose: () => void
  toggleSidebar: () => void
  openSidebar: boolean
  handleGenerateHtml: () => void
  generating: boolean
  handleSaveNewsletter: () => void
  isSaving: boolean
  selectedNotesLength: number
}

export default function Toolbar({
  title,
  setTitle,
  onClose,
  toggleSidebar,
  openSidebar,
  handleGenerateHtml,
  generating,
  handleSaveNewsletter,
  isSaving,
  selectedNotesLength,
}: ToolbarProps) {
  return (
    <MuiToolbar>
      <Button startIcon={<Icon icon="mdi:chevron-left" />} sx={{ mr: 2 }} onClick={onClose}>
        Back
      </Button>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Newsletter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ width: 300, mr: 2 }}
      />
      <Box sx={{ flexGrow: 1 }} />

      <Button variant="outlined" color="primary" sx={{ mr: 1 }}>
        Notes Mode
      </Button>
      <Button variant="outlined" sx={{ mr: 2 }}>
        Content Editor
      </Button>

      <Button
        variant="outlined"
        startIcon={openSidebar ? <Icon icon="mdi:chevron-left" /> : <Icon icon="mdi:chevron-right" />}
        onClick={toggleSidebar}
        sx={{ mr: 2 }}
      >
        {openSidebar ? "Hide Sidebar" : "Show Sidebar"}
      </Button>
      <Button
        variant="outlined"
        startIcon={<Icon icon="mdi:code-tags" />}
        onClick={handleGenerateHtml}
        disabled={generating || selectedNotesLength === 0}
        sx={{ mr: 2 }}
      >
        {generating ? <CircularProgress size={24} color="inherit" /> : "Generate HTML"}
      </Button>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Icon icon="mdi:content-save" />}
        onClick={handleSaveNewsletter}
        disabled={isSaving}
      >
        {isSaving ? <CircularProgress size={24} color="inherit" /> : "Save Newsletter"}
      </Button>
    </MuiToolbar>
  )
}
