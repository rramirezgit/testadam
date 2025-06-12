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
    | 'tituloConIcono'
    | 'herramientas'
    | 'respaldadoPor';
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
}
