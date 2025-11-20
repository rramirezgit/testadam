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
  // Metadata para tracking de notas generadas por IA
  _aiMetadata?: {
    taskId: string;
    isSaved: boolean;
    savedPostId?: string;
  };
}

export interface NewsletterHeader {
  title: string;
  subtitle: string;
  textColor: string;
  alignment: string;
  padding?: number;
  borderRadius?: string;
  margin?: string;
  backgroundImageUrl?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  minHeight?: string;
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
  // Props para el flujo de aprobación/programación
  newsletterStatus?: string;
  onNewsletterUpdate?: () => void;
  // Props para modo view-only
  isViewOnly?: boolean;
  onCreateCopy?: () => void;
  // Props para preview HTML
  showPreview?: boolean;
  onTogglePreview?: () => void;
  newsletterHtmlPreview?: string;
  // Prop para modo creación con IA
  isAICreation?: boolean;
  fromAI?: boolean;
  aiTaskId?: string;
  aiNewsletterId?: string;
  // Función para guardar newsletter desde el header (con modal de targetStores)
  onSaveNewsletter?: () => void | Promise<void>;
}

// Tipos para el análisis editorial
export interface EditorialAnalysisError {
  numero: number;
  tipo: string;
  severidad: 'CRÍTICO' | 'MODERADO' | 'MENOR';
  problema: string;
  correccion: string;
  ubicacion: string;
  explicacion: string;
  categoria: string;
}

export interface EditorialAnalysisSummary {
  titulo: string;
  evaluacion: string;
  recomendaciones: string;
  puede_publicar: boolean;
  errores_criticos: number;
  errores_moderados: number;
  errores_menores: number;
}

export interface EditorialAnalysisStatistics {
  tiempo_analisis: string;
  palabras_analizadas: number;
  parrafos_revisados: number;
  tiempo_analisis_ms: number;
  timestamp: string;
}

export interface EditorialAnalysisOpinion {
  score: number;
  estado: string;
  titulo: string;
  subtitulo: string;
  errores: EditorialAnalysisError[];
  resumen: EditorialAnalysisSummary;
  estadisticas: EditorialAnalysisStatistics;
}

export interface EditorialAnalysisResponse {
  score: number;
  estado: string;
  puede_publicar: boolean;
  tiempo_analisis_ms: number;
  opinion: EditorialAnalysisOpinion;
}
