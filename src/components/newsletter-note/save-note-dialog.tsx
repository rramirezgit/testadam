"use client"

import { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"

interface SaveNoteDialogProps {
  open: boolean
  onClose: () => void
  onSave: (title: string) => void
  defaultTitle?: string
  isEditing?: boolean
}

export default function SaveNoteDialog({
  open,
  onClose,
  onSave,
  defaultTitle = "",
  isEditing = false,
}: SaveNoteDialogProps) {
  const [title, setTitle] = useState(defaultTitle)

  const handleSave = () => {
    onSave(title || "Untitled Note")
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Update Note" : "Save Note"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Note Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your note"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {isEditing ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
