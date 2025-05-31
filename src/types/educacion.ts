import type { EducacionComponent } from './educacion-component';

export interface EducacionHeader {
  title: string;
  subtitle?: string;
  logo?: string;
  bannerImage?: string;
  backgroundColor: string;
  textColor: string;
  alignment: 'left' | 'center' | 'right';
  useGradient?: boolean;
  gradientColors?: string[];
  gradientDirection?: number;
}

export interface EducacionFooter {
  companyName: string;
  address?: string;
  contactEmail?: string;
  socialLinks?: { platform: string; url: string }[];
  unsubscribeLink?: string;
  backgroundColor: string;
  textColor: string;
}

export interface EducacionDesign {
  backgroundColor: string;
  selectedBanner?: string;
  fontFamily?: string;
  customCss?: string;
}

export interface Educacion {
  id: string;
  title: string;
  description?: string;
  dateCreated: string;
  dateModified: string;
  author?: string;
  content: EducacionComponent[];
  header: EducacionHeader;
  footer: EducacionFooter;
  design: EducacionDesign;
  // Propiedades específicas para contenido web
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  isResponsive?: boolean;
  pageLayout?: 'fixed' | 'fluid';
  customScripts?: string[];
}
