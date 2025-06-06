import type React from "react"

import { Box } from "@mui/material"

interface BannerPreviewProps {
  color?: string
  gradient?: string[]
  pattern?: string
  height?: number
  children?: React.ReactNode
}

export default function BannerPreview({ color, gradient, pattern, height = 80, children }: BannerPreviewProps) {
  const style: React.CSSProperties = {
    height,
    width: "100%",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #ddd",
  }

  if (gradient) {
    style.background = `linear-gradient(to bottom, ${gradient[0]}, ${gradient[1]})`
  } else if (pattern) {
    if (pattern === "dots") {
      style.backgroundColor = color || "#f8f9fa"
      style.backgroundImage = "radial-gradient(#00000010 1px, transparent 1px)"
      style.backgroundSize = "10px 10px"
    } else if (pattern === "lines") {
      style.backgroundColor = color || "#f8f9fa"
      style.backgroundImage = "linear-gradient(#00000010 1px, transparent 1px)"
      style.backgroundSize = "100% 10px"
    }
  } else {
    style.backgroundColor = color || "#ffffff"
  }

  return <Box sx={style}>{children}</Box>
}
