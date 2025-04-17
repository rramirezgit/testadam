import type React from "react"

export interface NewsletterComponent {
  id: string
  type: "heading" | "paragraph" | "bulletList" | "button" | "divider" | "spacer" | "image" | "category" | "gallery"
  content: string
  props?: Record<string, any>
  style?: React.CSSProperties
}
