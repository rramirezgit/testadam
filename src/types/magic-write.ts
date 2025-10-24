// Tipos para MagicWrite API

// Acciones disponibles en MagicWrite
export type MagicWriteAction =
  | 'generador'
  | 'brain_storming'
  | 'generador_parrafos'
  | 'corregir_errores'
  | 'mejorar_texto'
  | 'generador_descripcion'
  | 'listas'
  | 'reescribir'
  | 'parafrasear'
  | 'generador_ensayos'
  | 'generador_titulos'
  | 'continuar_texto'
  | 'resumir'
  | 'cuestionario'
  | 'traducir';

// Request a la API
export interface MagicWriteRequest {
  action: MagicWriteAction;
  text: string;
  language?: string; // Solo para traducción
}

// Response de la API
export interface MagicWriteResponse {
  text: string; // Texto procesado con formato HTML
}

// Categorías de opciones de IA
export type AICategoryType =
  | 'correction'
  | 'generation'
  | 'organization'
  | 'transformation'
  | 'titles'
  | 'translation';

// Interfaz para una opción de IA
export interface AIOption {
  id: MagicWriteAction;
  label: string;
  description: string;
  icon: string;
  category: AICategoryType;
}

// Interfaz para categoría de opciones
export interface AIOptionCategory {
  id: AICategoryType;
  label: string;
  icon: string;
  color: string;
  options: AIOption[];
}

// Idiomas soportados para traducción
export interface LanguageOption {
  code: string;
  label: string;
  icon: string;
}

// Configuración de opciones de IA agrupadas por categoría
export const AI_OPTIONS: AIOptionCategory[] = [
  {
    id: 'correction',
    label: 'Corrección',
    icon: 'mdi:check-circle-outline',
    color: '#10b981',
    options: [
      {
        id: 'corregir_errores',
        label: 'Corregir errores',
        description: 'Corrige ortografía y gramática',
        icon: 'mdi:text-box-check',
        category: 'correction',
      },
      {
        id: 'mejorar_texto',
        label: 'Mejorar texto',
        description: 'Mejora redacción y fluidez',
        icon: 'mdi:format-text',
        category: 'correction',
      },
    ],
  },
  {
    id: 'generation',
    label: 'Generación',
    icon: 'mdi:file-document-edit',
    color: '#3b82f6',
    options: [
      {
        id: 'generador',
        label: 'Ampliar ideas',
        description: 'Expande y desarrolla conceptos',
        icon: 'mdi:lightbulb-on',
        category: 'generation',
      },
      {
        id: 'generador_parrafos',
        label: 'Generar párrafos',
        description: 'Crea contenido extenso',
        icon: 'mdi:text',
        category: 'generation',
      },
      {
        id: 'generador_descripcion',
        label: 'Generar descripción',
        description: 'Crea descripciones breves',
        icon: 'mdi:text-short',
        category: 'generation',
      },
      {
        id: 'generador_ensayos',
        label: 'Generar ensayo',
        description: 'Desarrolla ensayos estructurados',
        icon: 'mdi:file-document',
        category: 'generation',
      },
      {
        id: 'continuar_texto',
        label: 'Continuar texto',
        description: 'Completa el texto inacabado',
        icon: 'mdi:arrow-right-bold',
        category: 'generation',
      },
    ],
  },
  {
    id: 'organization',
    label: 'Organización',
    icon: 'mdi:format-list-bulleted',
    color: '#8b5cf6',
    options: [
      {
        id: 'brain_storming',
        label: 'Lluvia de ideas',
        description: 'Organiza ideas en formato lista',
        icon: 'mdi:brain',
        category: 'organization',
      },
      {
        id: 'listas',
        label: 'Crear lista',
        description: 'Estructura información en listas',
        icon: 'mdi:format-list-checkbox',
        category: 'organization',
      },
      {
        id: 'cuestionario',
        label: 'Crear cuestionario',
        description: 'Genera preguntas relevantes',
        icon: 'mdi:help-box',
        category: 'organization',
      },
    ],
  },
  {
    id: 'transformation',
    label: 'Transformación',
    icon: 'mdi:swap-horizontal',
    color: '#f59e0b',
    options: [
      {
        id: 'reescribir',
        label: 'Reescribir',
        description: 'Reescribe conservando significado',
        icon: 'mdi:pencil',
        category: 'transformation',
      },
      {
        id: 'parafrasear',
        label: 'Parafrasear',
        description: 'Parafrasea manteniendo coherencia',
        icon: 'mdi:format-quote-close',
        category: 'transformation',
      },
      {
        id: 'resumir',
        label: 'Resumir',
        description: 'Sintetiza los puntos clave',
        icon: 'mdi:text-box-minus',
        category: 'transformation',
      },
    ],
  },
  {
    id: 'titles',
    label: 'Títulos',
    icon: 'mdi:format-title',
    color: '#ec4899',
    options: [
      {
        id: 'generador_titulos',
        label: 'Generar títulos',
        description: 'Crea títulos llamativos',
        icon: 'mdi:format-header-1',
        category: 'titles',
      },
    ],
  },
  {
    id: 'translation',
    label: 'Traducción',
    icon: 'mdi:translate',
    color: '#06b6d4',
    options: [
      {
        id: 'traducir',
        label: 'Traducir',
        description: 'Traduce a otro idioma',
        icon: 'mdi:google-translate',
        category: 'translation',
      },
    ],
  },
];

// Idiomas soportados
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'inglés', label: 'Inglés', icon: 'twemoji:flag-united-states' },
  { code: 'francés', label: 'Francés', icon: 'twemoji:flag-france' },
  { code: 'alemán', label: 'Alemán', icon: 'twemoji:flag-germany' },
  { code: 'italiano', label: 'Italiano', icon: 'twemoji:flag-italy' },
  { code: 'portugués', label: 'Portugués', icon: 'twemoji:flag-portugal' },
  { code: 'chino', label: 'Chino', icon: 'twemoji:flag-china' },
  { code: 'japonés', label: 'Japonés', icon: 'twemoji:flag-japan' },
  { code: 'ruso', label: 'Ruso', icon: 'twemoji:flag-russia' },
];
