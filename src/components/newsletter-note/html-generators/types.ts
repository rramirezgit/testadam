/**
 * Tipos compartidos para generadores de HTML de emails
 */

export interface EmailComponent {
  id: string;
  type: string;
  content?: string;
  props?: Record<string, any>;
  style?: Record<string, any>;
}

export interface HeaderConfig {
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
  sponsor?: {
    enabled: boolean;
    label?: string;
    image?: string;
    imageAlt?: string;
  };
  showLogo?: boolean;
  logoAlt?: string;
  logoHeight?: number;
  showBanner?: boolean;
  padding?: number;
}

export interface FooterConfig {
  companyName: string;
  address?: string;
  contactEmail?: string;
  socialLinks?: Array<{ platform: string; url: string; enabled?: boolean }>;
  unsubscribeLink?: string;
  backgroundColor: string;
  textColor: string;
  useGradient?: boolean;
  gradientColors?: string[];
  gradientDirection?: number;
  showAddress?: boolean;
  showSocial?: boolean;
  padding?: number;
  fontSize?: number;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface Herramienta {
  id: string;
  nombre: string;
  icono: string;
  colorFondo: string;
  colorTexto: string;
  colorIcono: string;
}

export interface Categoria {
  texto: string;
  colorFondo: string;
  colorTexto: string;
}

export interface ContainerConfig {
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
  maxWidth?: number;
}
