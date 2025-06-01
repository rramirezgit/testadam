import type React from 'react';
import type { Editor } from '@tiptap/react';
import type { Theme, SxProps } from '@mui/material/styles';

// Variantes de editor disponibles
export type EditorVariant =
  | 'minimal' // Solo texto básico
  | 'simple' // Formato básico (bold, italic, underline)
  | 'standard' // Formato completo sin multimedia
  | 'full' // Todas las funcionalidades
  | 'newsletter' // Optimizado para newsletters
  | 'education' // Optimizado para contenido educativo
  | 'component'; // Para componentes específicos (headings, buttons)

// Tipos de output del editor
export type OutputFormat = 'html' | 'text' | 'both' | 'markdown';

// Configuración de extensiones
export interface ExtensionConfig {
  // Formato de texto
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;

  // Colores y tipografía
  textColor?: boolean;
  backgroundColor?: boolean;
  fontFamily?: boolean;
  fontSize?: boolean;

  // Alineación
  textAlign?: boolean;

  // Listas
  bulletList?: boolean;
  orderedList?: boolean;

  // Enlaces y multimedia
  link?: boolean;
  image?: boolean;
  youtube?: boolean;

  // Código
  codeInline?: boolean;
  codeBlock?: boolean;
  codeHighlight?: boolean;

  // Tablas
  table?: boolean;

  // Estructura
  heading?: boolean | { levels: number[] };
  paragraph?: boolean;
  blockquote?: boolean;
  horizontalRule?: boolean;

  // Utilidades
  placeholder?: boolean;
  undo?: boolean;
  redo?: boolean;
}

// Configuración de toolbar
export interface ToolbarConfig {
  enabled?: boolean;
  position?: 'top' | 'bottom' | 'floating';
  sticky?: boolean;
  groups?: ToolbarGroup[];
  customTools?: React.ReactNode[];
}

export type ToolbarGroup =
  | 'format' // bold, italic, underline, strike
  | 'color' // text color, background color
  | 'align' // text alignment
  | 'list' // bullet list, ordered list
  | 'insert' // link, image, youtube
  | 'structure' // heading levels, blockquote
  | 'table' // table operations
  | 'code' // code inline, code block
  | 'history' // undo, redo
  | 'view'; // fullscreen, preview

// Props del editor unificado
export interface UnifiedEditorProps {
  // Contenido
  value?: string;
  defaultValue?: string;
  placeholder?: string;

  // Configuración
  variant?: EditorVariant;
  outputFormat?: OutputFormat;
  extensions?: ExtensionConfig;
  toolbar?: ToolbarConfig;

  // Callbacks
  onChange?: (value: string, metadata?: EditorMetadata) => void;
  onSelectionUpdate?: (editor: Editor) => void;
  onBlur?: (editor: Editor) => void;
  onFocus?: (editor: Editor) => void;

  // Comportamiento
  editable?: boolean;
  autoFocus?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;

  // Estilo y layout
  className?: string;
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
  minHeight?: number | string;
  maxHeight?: number | string;
  fullScreen?: boolean;

  // Especialización por componente
  componentType?: 'heading' | 'paragraph' | 'button' | 'caption';
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;

  // Estados
  error?: boolean;
  helperText?: React.ReactNode;
  loading?: boolean;

  // Avanzado
  enableCollaboration?: boolean;
  collaborationRoom?: string;
  enableAI?: boolean;
  customExtensions?: any[];
}

// Metadata que acompaña al onChange
export interface EditorMetadata {
  htmlContent: string;
  textContent: string;
  markdownContent?: string;
  wordCount: number;
  characterCount: number;
  characterCountWithoutSpaces?: number;
  readingTime: number; // en minutos
  isEmpty: boolean;
  hasImages: boolean;
  hasLinks: boolean;
  hasTables: boolean;
  hasYoutube?: boolean;
  hasCodeBlocks?: boolean;

  // Conteos detallados (opcional)
  counts?: {
    images: number;
    links: number;
    headings: number;
    lists: number;
    tables: number;
    paragraphs: number;
    codeBlocks: number;
  };

  // Estructura (opcional)
  headingStructure?: Array<{ level: number; text: string; id?: string }>;

  // Análisis de calidad (opcional)
  readabilityScore?: number;

  // Metadata adicional (opcional)
  lastModified?: string;
  contentHash?: string;
}

// Configuraciones predefinidas para cada variante
export interface VariantConfig {
  extensions: ExtensionConfig;
  toolbar: ToolbarConfig;
  outputFormat: OutputFormat;
}

// Context para el editor
export interface EditorContextValue {
  editor: Editor | null;
  variant: EditorVariant;
  isLoading: boolean;
  metadata: EditorMetadata | null;
}
