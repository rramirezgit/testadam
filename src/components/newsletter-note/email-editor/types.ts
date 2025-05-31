export type ComponentType =
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'divider'
  | 'bulletList'
  | 'image'
  | 'spacer'
  | 'category'
  | 'author'
  | 'summary'
  | 'gallery'
  | 'tituloConIcono'
  | 'respaldadoPor';

export interface EmailEditorProps {
  initialTemplate?: string;
  savedNotes?: any[];
  onSaveNote?: (noteData: any) => void;
  onClose: () => void;
  initialNote?: any | null;
  isNewsletterMode?: boolean;
  onSave?: (note: any) => void;
}
