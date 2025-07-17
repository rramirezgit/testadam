import type { ComponentType, NewsletterNote } from '../types';

// Nueva interfaz para controlar qué componentes están habilitados
export interface EnabledComponents {
  // Componentes de Texto
  heading?: boolean;
  paragraph?: boolean;
  bulletList?: boolean;
  textWithIcon?: boolean;

  // Componentes de Multimedia
  image?: boolean;
  gallery?: boolean;
  imageText?: boolean;
  twoColumns?: boolean;
  chart?: boolean;

  // Componentes de Diseño
  button?: boolean;
  divider?: boolean;
  spacer?: boolean;

  // Componentes de Noticias
  category?: boolean;
  author?: boolean;
  summary?: boolean;
  tituloConIcono?: boolean;
  herramientas?: boolean;
  respaldadoPor?: boolean;
  newsletterHeaderReusable?: boolean;
  newsletterFooterReusable?: boolean;
}

export interface LeftPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: (categories: Record<string, boolean>) => void;
  addComponent: (type: ComponentType) => void;
  emailTemplates: {
    id: string;
    name: string;
    description: string;
    image?: string;
    icon?: React.ReactNode;
  }[];
  activeTemplate: string;
  setActiveTemplate: (template: string) => void;
  generatingEmail: boolean;
  handleGenerateEmailHtml: () => void;
  setOpenSaveDialog: (open: boolean) => void;
  activeVersion: string;
  setActiveVersion: (version: 'web' | 'newsletter') => void;
  // Nuevas props para newsletter
  isNewsletterMode?: boolean;
  newsletterNotes?: NewsletterNote[];
  onAddNewsletterNote?: (note: NewsletterNote) => void;
  onEditNote?: (note: any) => void;
  // Nueva prop para controlar componentes habilitados
  enabledComponents?: EnabledComponents;
  // Nuevas props para notas disponibles
  availableNotes?: any[];
  loadingNotes?: boolean;
  onInjectNote?: (noteId: string) => void;
  onRefreshNotes?: () => void;
}
