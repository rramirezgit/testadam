export type ComponentType =
  | "heading"
  | "paragraph"
  | "button"
  | "divider"
  | "bulletList"
  | "image"
  | "spacer"
  | "category"
  | "author"
  | "summary"
  | "gallery"

export interface EmailEditorProps {
  initialTemplate?: string
  onSave?: (emailData: any) => void
  savedNotes?: any[]
  onSaveNote?: (noteData: any) => void
  onClose: () => void
  initialNote?: any | null
  isNewsletterMode?: boolean
  onSave?: (note: any) => void
}
