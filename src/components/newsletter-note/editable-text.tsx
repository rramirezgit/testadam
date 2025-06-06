"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"

import { Box, TextField, Typography } from "@mui/material"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  editMode: boolean
  className?: string
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div" | "a"
  href?: string
}

export function EditableText({ value, onChange, editMode, className, as = "p", href }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // Colocar el cursor al final del texto
      const length = inputRef.current.value.length
      inputRef.current.setSelectionRange(length, length)
    }
  }, [isEditing])

  const handleClick = () => {
    if (editMode) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      setIsEditing(false)
      onChange(text)
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setText(value) // Revertir a valor original
    }
  }

  if (isEditing) {
    return (
      <TextField
        inputRef={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        multiline
        fullWidth
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            fontFamily: "inherit",
            fontSize: "inherit",
            fontWeight: "inherit",
            padding: "4px",
          },
        }}
        className={className}
      />
    )
  }

  // Mapear el tipo de componente a la variante de Typography de Material UI
  const getVariant = () => {
    switch (as) {
      case "h1":
        return "h4"
      case "h2":
        return "h5"
      case "h3":
        return "h6"
      case "h4":
        return "subtitle1"
      case "h5":
        return "subtitle2"
      case "h6":
        return "subtitle2"
      case "p":
        return "body1"
      case "span":
        return "body2"
      case "div":
        return "body1"
      case "a":
        return "body1"
      default:
        return "body1"
    }
  }

  return (
    <Box
      component={as === "a" ? "a" : "div"}
      href={as === "a" ? href : undefined}
      onClick={handleClick}
      sx={{
        cursor: editMode ? "text" : "default",
        padding: "4px",
        borderRadius: "4px",
        "&:hover": editMode
          ? {
              backgroundColor: "rgba(63, 81, 181, 0.08)",
              outline: "1px dashed rgba(63, 81, 181, 0.5)",
            }
          : {},
      }}
      className={className}
    >
      <Typography variant={getVariant()} component="div">
        {text}
      </Typography>
    </Box>
  )
}
