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
  setHeader: (header: NewsletterHeader) => void;
  setFooter: (footer: NewsletterFooter) => void;
  setOpenHeaderDialog: (open: boolean) => void;
  setOpenFooterDialog: (open: boolean) => void;
  availableHeaders: HeaderTemplate[];
  availableFooters: FooterTemplate[];
  currentHeaderTemplate: HeaderTemplate | undefined;
  setCurrentHeaderTemplate: (template: HeaderTemplate | undefined) => void;
  currentFooterTemplate: FooterTemplate | undefined;
  setCurrentFooterTemplate: (template: FooterTemplate | undefined) => void;
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

export interface HeaderTemplate {
  id: string;
  name: string;
  preview: string;
  description: string;
  template: {
    title: string;
    subtitle: string;
    logo: string;
    bannerImage: string;
    backgroundColor: string;
    textColor: string;
    alignment: string;
    showGradient: boolean;
    gradientColors?: string[];
  };
}

export interface FooterTemplate {
  id: string;
  name: string;
  preview: string;
  description: string;
  template: {
    companyName: string;
    address: string;
    contactEmail: string;
    socialLinks: { platform: string; url: string }[];
    unsubscribeLink: string;
    backgroundColor: string;
    textColor: string;
    showGradient?: boolean;
    gradientColors?: string[];
  };
}

export interface SidebarProps {
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  selectedNotes: NewsletterNote[];
  notes: SavedNote[];
  handleAddNote: (note: NewsletterNote) => void;
  handleRemoveNote: (noteId: string) => void;
  handleEditNote: (note: SavedNote) => void;
  handleCreateNewNote: () => void;
  activeTab?: string;
  onSelectHeader?: (header: HeaderTemplate) => void;
  onSelectFooter?: (footer: FooterTemplate) => void;
  currentHeader?: HeaderTemplate;
  currentFooter?: FooterTemplate;
}
