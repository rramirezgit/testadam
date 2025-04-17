"use client"

import type React from "react"
import { Paper, Typography, Box } from "@mui/material"

interface CustomDialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions: React.ReactNode
}

export const CustomDialog = ({ open, onClose, title, children, actions }: CustomDialogProps) => {
  if (!open) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
      onClick={onClose}
    >
      <Paper
        style={{
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
          padding: "16px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h6" style={{ marginBottom: "16px" }}>
          {title}
        </Typography>
        {children}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>{actions}</Box>
      </Paper>
    </div>
  )
}
