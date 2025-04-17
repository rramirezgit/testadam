"use client"

import * as React from "react"
import { Box, Button } from "@mui/material"

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
}

export const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }: TabsProps) => {
  const [tabValue, setTabValue] = React.useState(defaultValue || value || "")

  React.useEffect(() => {
    if (value !== undefined) {
      setTabValue(value)
    }
  }, [value])

  const handleChange = (newValue: string) => {
    setTabValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  // Render children as a simple container
  return (
    <Box className={className} {...props}>
      {children}
    </Box>
  )
}

interface TabsListProps {
  className?: string
  children?: React.ReactNode
}

export const TabsList = ({ className, children, ...props }: TabsListProps) => {
  return (
    <Box className={className} sx={{ display: "flex" }} {...props}>
      {children}
    </Box>
  )
}

interface TabsTriggerProps {
  value: string
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export const TabsTrigger = ({ value, className, children, onClick, ...props }: TabsTriggerProps) => {
  // Convert to a button
  return (
    <Button variant="text" className={className} onClick={onClick} {...props}>
      {children}
    </Button>
  )
}

interface TabsContentProps {
  value: string
  className?: string
  children?: React.ReactNode
}

export const TabsContent = ({ value, className, children, ...props }: TabsContentProps) => {
  return (
    <Box role="tabpanel" className={className} {...props}>
      {children}
    </Box>
  )
}
