"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Tabs,
  Tab,
  Paper,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CodeIcon from "@mui/icons-material/Code"
import VisibilityIcon from "@mui/icons-material/Visibility"

interface HtmlPreviewDialogProps {
  open: boolean
  onClose: () => void
  html: string
  onCopy: () => void
}

export default function HtmlPreviewDialog({ open, onClose, html, onCopy }: HtmlPreviewDialogProps) {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        HTML Preview
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="html preview tabs">
          <Tab icon={<VisibilityIcon />} label="Preview" />
          <Tab icon={<CodeIcon />} label="HTML Code" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 3, height: "70vh" }}>
        {activeTab === 0 ? (
          <Box sx={{ height: "100%", border: "1px solid #e0e0e0", borderRadius: "4px" }}>
            <iframe
              srcDoc={html}
              title="Newsletter HTML Preview"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </Box>
        ) : (
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              overflow: "auto",
              p: 2,
              backgroundColor: "#f5f5f5",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {html}
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button startIcon={<ContentCopyIcon />} onClick={onCopy} variant="contained" color="primary" sx={{ mr: 1 }}>
          Copy HTML
        </Button>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
