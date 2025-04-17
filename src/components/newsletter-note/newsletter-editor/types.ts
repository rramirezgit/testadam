import type { SavedNote } from 'src/types/saved-note';
import type { NewsletterNote, NewsletterHeader, NewsletterFooter } from 'src/types/newsletter';

export interface PreviewTabProps {
  header: NewsletterHeader;
  footer: NewsletterFooter;
  title: string;
  description: string;
  selectedNotes: NewsletterNote[];
  isColorDark?: (color: string) => boolean;
}

export interface ContentTabProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  selectedNotes: NewsletterNote[];
  handleRemoveNote: (noteId: string) => void;
  handleMoveNote: (noteId: string, direction: 'up' | 'down') => void;
  handleEditNote: (note: SavedNote) => void;
  handleCreateNewNote: () => void;
}

export interface DesignTabProps {
  header: NewsletterHeader;
  footer: NewsletterFooter;
  setOpenHeaderDialog: (open: boolean) => void;
  setOpenFooterDialog: (open: boolean) => void;
}

export interface HeaderDialogProps {
  open: boolean;
  onClose: () => void;
  header: NewsletterHeader;
  setHeader: (header: NewsletterHeader) => void;
}

export interface FooterDialogProps {
  open: boolean;
  onClose: () => void;
  footer: NewsletterFooter;
  setFooter: (footer: NewsletterFooter) => void;
}

export interface HtmlPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  html: string;
  onCopy: () => void;
}

export interface NewsletterEditorProps {
  onClose: () => void;
  initialNewsletter?: any;
}
