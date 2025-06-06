"use client"

import { useEffect } from "react"
import { Icon } from "@iconify/react"

import { IconButton } from "@mui/material"

import type { CustomSnackbarProps } from "../types"

export default function CustomSnackbar({ open, message, severity, onClose }: CustomSnackbarProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [open, onClose])

  if (!open) return null

  const bgColor =
    severity === "success"
      ? "#4caf50"
      : severity === "error"
        ? "#f44336"
        : severity === "warning"
          ? "#ff9800"
          : "#2196f3"

  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: bgColor,
        color: "white",
        padding: "8px 16px",
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
      }}
    >
      <span>{message}</span>
      <IconButton size="small" style={{ marginLeft: "8px", color: "white" }} onClick={onClose}>
        <Icon icon="mdi:close" />
      </IconButton>
    </div>
  )
}
