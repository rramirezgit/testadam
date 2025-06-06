"use client"

import { Icon } from "@iconify/react"

import { Button } from "@mui/material"

interface ComponentSelectorProps {
  icon: string
  label: string
  onClick: () => void
}

export function ComponentSelector({ icon, label, onClick }: ComponentSelectorProps) {
  const getIcon = () => {
    switch (icon) {
      case "Heading":
        return <Icon icon="mdi:format-header-1" />
      case "Text":
        return <Icon icon="mdi:format-text" />
      case "List":
        return <Icon icon="mdi:format-list-bulleted" />
      case "Button":
        return <Icon icon="mdi:button-cursor" />
      case "SeparatorHorizontal":
        return <Icon icon="mdi:minus" />
      case "ArrowUpDown":
        return <Icon icon="mdi:arrow-up-down" />
      case "Image":
        return <Icon icon="mdi:image" />
      default:
        return null
    }
  }

  return (
    <Button
      variant="outlined"
      className="h-auto py-4 flex flex-col items-center justify-center gap-2"
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "16px",
        height: "auto",
      }}
    >
      {getIcon()}
      <span style={{ fontSize: "0.75rem" }}>{label}</span>
    </Button>
  )
}
