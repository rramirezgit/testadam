"use client"

import { Dialog, Button, TextField, Typography, DialogTitle, DialogContent, DialogActions } from "@mui/material"

import type { BannerDialogProps } from "../types"

export default function BannerDialog({ open, onClose, bannerImageUrl, setBannerImageUrl, onSave }: BannerDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Banner Image</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Banner Image URL"
          value={bannerImageUrl}
          onChange={(e) => setBannerImageUrl(e.target.value)}
          margin="normal"
        />
        <Typography variant="caption" color="text.secondary">
          Enter a URL for your banner image
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(bannerImageUrl)}>
          Add Banner
        </Button>
      </DialogActions>
    </Dialog>
  )
}
