import type React from 'react';

export interface EmailComponent {
  id: string;
  type:
    | 'heading'
    | 'paragraph'
    | 'bulletList'
    | 'button'
    | 'divider'
    | 'spacer'
    | 'image'
    | 'category'
    | 'author'
    | 'summary'
    | 'news'
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
    | 'fileAttachment';
  content: string;
  props: {
    level?: number;
    variant?: string;
    color?: string;
    src?: string;
    alt?: string;
    items?: string[]; // Para listas
    listStyle?: string; // Estilo de lista
    listColor?: string; // Color de los bullets
    [key: string]: any;
  };
  style?: React.CSSProperties;
  meta?: {
    isDefaultContent?: boolean;
    defaultContentSnapshot?: string;
    defaultPropsSnapshot?: Record<string, any>;
    defaultStyleSnapshot?: React.CSSProperties;
  };
}

export interface ConfigNote {
  templateType: string;
  dateCreated: string;
  dateModified: string;
  emailBackground?: string;
  selectedBanner?: string | null;
  showGradient?: boolean;
  gradientColors?: string[];
  activeVersion?: 'newsletter' | 'web';
  containerBorderWidth?: number;
  containerBorderColor?: string;
  containerBorderRadius?: number;
  containerPadding?: number;
  containerMaxWidth?: number;
}

export interface SavedNote {
  id: string;
  title: string;
  configNote: string; // JSON string escapado
  objData: string; // JSON string escapado de EmailComponent[]
  objDataWeb?: string; // JSON string escapado de EmailComponent[]
  // Campos opcionales para compatibilidad con código existente
  aiGenerated?: boolean;
  imageUrl?: string;
  createdAt?: string;
  // Metadatos de categorización
  contentTypeId?: string;
  categoryId?: string;
  subcategoryId?: string;
}
