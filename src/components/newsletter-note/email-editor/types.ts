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
  | 'imageText'
  | 'twoColumns'
  | 'textWithIcon'
  | 'tituloConIcono'
  | 'herramientas'
  | 'respaldadoPor'
  | 'chart'
  | 'noteContainer'
  | 'newsletterHeaderReusable'
  | 'newsletterFooterReusable'
  | 'fileAttachment'; // Nuevo componente para adjuntar archivos en storyboards

// Tipos para el newsletter
export interface NewsletterNote {
  noteId: string;
  order: number;
  noteData: any; // SavedNote
}

export interface NewsletterHeader {
  title: string;
  subtitle: string;
  logo: string;
  logoAlt: string;
  bannerImage: string;
  backgroundColor: string;
  textColor: string;
  alignment: string;
  useGradient: boolean;
  gradientColors: string[];
  gradientDirection: number;
  showLogo: boolean;
  showBanner: boolean;
  logoHeight: number;
  padding: number;
  sponsor?: {
    enabled: boolean;
    label: string;
    image: string;
    imageAlt: string;
  };
}

export interface NewsletterFooter {
  companyName: string;
  address: string;
  contactEmail: string;
  socialLinks: {
    platform: string;
    url: string;
    enabled: boolean;
  }[];
  unsubscribeLink: string;
  backgroundColor: string;
  textColor: string;
  useGradient: boolean;
  gradientColors: string[];
  gradientDirection: number;
  showSocial: boolean;
  showAddress: boolean;
  padding: number;
  fontSize: number;
  logo?: string;
  logoHeight?: number;
  showLogo?: boolean;
  footerText?: string;
}

export interface EmailEditorProps {
  initialTemplate?: string;
  defaultTemplate?: string; // Template predeterminado para saltar el modal de selección
  excludeTemplates?: string[]; // Templates a excluir del modal de selección
  savedNotes?: any[];
  onSaveNote?: (noteData: any) => void;
  onClose: () => void;
  initialNote?: any | null;
  isNewsletterMode?: boolean;
  onSave?: (note: any) => void;
  // Nuevas props para newsletter
  newsletterNotes?: NewsletterNote[];
  onNewsletterNotesChange?: (notes: NewsletterNote[]) => void;
  newsletterHeader?: NewsletterHeader;
  newsletterFooter?: NewsletterFooter;
  onNewsletterConfigChange?: (config: {
    header: NewsletterHeader;
    footer: NewsletterFooter;
  }) => void;
  newsletterTitle?: string;
  newsletterDescription?: string;
  onNewsletterInfoChange?: (info: { title: string; description: string }) => void;
  // Nuevas props para el menú de envío
  newsletterList?: any[];
  currentNewsletterId?: string;
  saving?: boolean;
  setOpenSendDialog?: (open: boolean) => void;
  setOpenAprob?: (open: boolean) => void;
  setOpenSchedule?: (open: boolean) => void;
  setOpenSendSubs?: (open: boolean) => void;
  // Nuevas props para carga de newsletter existente
  initialComponents?: any[] | null;
  onNewsletterIdChange?: (id: string) => void;
  // Prop para la imagen de portada inicial
  initialCoverImageUrl?: string;
}
