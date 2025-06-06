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

export interface SavedNote {
  id: string;
  title: string;
  templateType: string;
  dateCreated: string;
  dateModified: string;
  objdata: EmailComponent[];
  objdataWeb?: EmailComponent[]; // Nueva propiedad para la versión web
  emailBackground?: string;
  selectedBanner?: string | null;
  showGradient?: boolean;
  gradientColors?: string[];
  aiGenerated?: boolean;
  imageUrl?: string;
  createdAt?: string;
  activeVersion?: 'newsletter' | 'web'; // Para rastrear qué versión está activa
}
