"use client"

import { useEffect, useState } from "react"
import { Box, Paper, Typography, CircularProgress } from "@mui/material"
import type { PreviewTabProps } from "../types"
import { generateNewsletterHtml, isColorDark } from "../utils"

export default function PreviewTab({ header, footer, title, description, selectedNotes }: PreviewTabProps) {
  const [html, setHtml] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  // Generar el HTML cuando cambian los datos o cuando se monta el componente
  useEffect(() => {
    setLoading(true)
    try {
      const generatedHtml = generateNewsletterHtml(title, description, header, footer, selectedNotes, isColorDark)
      setHtml(generatedHtml)
    } catch (error) {
      console.error("Error generating HTML preview:", error)
    } finally {
      setLoading(false)
    }
  }, [title, description, header, footer, selectedNotes])

  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Newsletter Preview (HTML)
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80%" }}>
          <CircularProgress />
        </Box>
      ) : selectedNotes.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1">Add notes to preview your newsletter</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 2,
            height: "calc(100% - 60px)",
            overflow: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            bgcolor: "#fff",
          }}
        >
          <iframe
            srcDoc={html}
            title="Newsletter Preview"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </Box>
      )}
    </Paper>
  )
}
