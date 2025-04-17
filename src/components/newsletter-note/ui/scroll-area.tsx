"use client"

import * as React from "react"
import { Box } from "@mui/material"

interface ScrollAreaProps {
  className?: string
  children?: React.ReactNode
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ className, children, ...props }, ref) => {
  return (
    <Box
      ref={ref}
      className={className}
      sx={{
        overflowY: "auto",
        overflowX: "hidden",
        height: "100%",
        width: "100%",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#bdbdbd",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#9e9e9e",
        },
      }}
      {...props}
    >
      {children}
    </Box>
  )
})

ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, orientation = "vertical", ...props }, ref) => {
    return null // Material UI no necesita un ScrollBar separado
  },
)

ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
