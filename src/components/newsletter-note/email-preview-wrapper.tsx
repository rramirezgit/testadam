"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { Box, Paper } from "@mui/material"

interface EmailPreviewWrapperProps {
  children: React.ReactNode
}

export function EmailPreviewWrapper({ children }: EmailPreviewWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Limpiar cualquier contenido previo para evitar problemas de DOM
    if (containerRef.current) {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
    }
  }, [children])

  return (
    <Paper
      elevation={1}
      sx={{
        overflow: "hidden",
        bgcolor: "white",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
      }}
    >
      <Box ref={containerRef}>{children}</Box>
    </Paper>
  )
}
