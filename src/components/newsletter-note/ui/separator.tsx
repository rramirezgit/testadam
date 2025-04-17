"use client"

import * as React from "react"
import { Divider } from "@mui/material"

interface SeparatorProps {
  orientation?: "horizontal" | "vertical"
  className?: string
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ orientation = "horizontal", className, ...props }, ref) => {
    return (
      <Divider
        ref={ref}
        orientation={orientation}
        className={className}
        flexItem={orientation === "vertical"}
        {...props}
      />
    )
  },
)

Separator.displayName = "Separator"
