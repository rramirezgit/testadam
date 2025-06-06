"use client"

import { Dialog, Button, TextField, Typography, DialogTitle, DialogContent, DialogActions } from "@mui/material"

import type { LogoDialogProps } from "../types"

export default function LogoDialog({ open, onClose, logoUrl, setLogoUrl, onSave }: LogoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Logo</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Logo URL"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          margin="normal"
        />
        <Typography variant="caption" color="text.secondary">
          Enter a URL for your logo image
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(logoUrl)}>
          Add Logo
        </Button>
      </DialogActions>
    </Dialog>
  )
}
