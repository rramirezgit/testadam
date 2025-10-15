export interface NewsletterHeader {
  title: string;
  subtitle?: string;
  logo?: string;
  bannerImage?: string;
  backgroundColor: string;
  textColor: string;
  alignment: string;
  useGradient?: boolean;
  gradientColors?: string[];
  gradientDirection?: number;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface NewsletterFooter {
  companyName: string;
  address?: string;
  contactEmail?: string;
  socialLinks?: SocialLink[];
  unsubscribeLink?: string;
  backgroundColor: string;
  textColor: string;
}

export interface NewsletterNote {
  noteId: string;
  order: number;
  noteData: any; // SavedNote
}

export interface Newsletter {
  id: string;
  subject: string; // Cambiado de 'title' a 'subject' para coincidir con el backend
  description?: string;
  notes?: NewsletterNote[]; // Opcional ya que puede no venir en la lista
  dateCreated?: string; // Opcional
  dateModified?: string; // Opcional
  createdAt: string; // Agregado para coincidir con el backend
  scheduleDate?: string; // Agregado para coincidir con el backend
  header?: NewsletterHeader;
  footer?: NewsletterFooter;
  content?: any;
  objData?: any; // Agregado para contenido de componentes
  design?: any;
  generatedHtml?: string;
  status?: string; // DRAFT, REVIEW, APPROVED, PUBLISHED
}
