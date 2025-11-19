import type { EmailComponent } from 'src/types/saved-note';

// ============================================================================
// REQUEST TYPES
// ============================================================================

/**
 * Request para generar una nota individual con IA
 */
export interface AINoteRequest {
  /** Prompt detallado para generar la nota */
  prompt: string;
  /** Título de la nota (opcional, puede generarlo la IA) */
  title?: string;
  /** Categoría de la nota */
  category?: string;
  /** Template a usar (por defecto: "news") */
  template?: string;
  /** Configuración adicional */
  config?: {
    /** Longitud deseada (short, medium, long) */
    length?: 'short' | 'medium' | 'long';
    /** Tono del contenido (formal, casual, technical) */
    tone?: 'formal' | 'casual' | 'technical';
    /** Incluir imágenes */
    includeImages?: boolean;
  };
}

/**
 * Request para generar un newsletter completo con múltiples notas
 */
export interface AINewsletterRequest {
  /** Array de prompts, uno por cada nota */
  prompts: string[];
  /** Título del newsletter (opcional) */
  title?: string;
  /** Descripción del newsletter (opcional) */
  description?: string;
  /** Configuración adicional para cada nota */
  notesConfig?: {
    /** Template para todas las notas (default: "news") */
    template?: string;
    /** Categorías para cada nota (orden corresponde a prompts) */
    categories?: string[];
    /** Longitud para cada nota */
    lengths?: Array<'short' | 'medium' | 'long'>;
  };
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

/**
 * Metadata de la generación por IA
 */
export interface AIMetadata {
  /** Timestamp de generación (ISO 8601) */
  generatedAt: string;
  /** Prompt usado para la generación */
  promptUsed: string;
  /** Modelo de IA utilizado */
  model: string;
  /** Tokens consumidos en la generación */
  tokensUsed: number;
  /** Tiempo de generación en milisegundos */
  generationTime?: number;
}

/**
 * Respuesta de generación de IA para una nota
 */
export interface AIGenerationResponse {
  /** Indica si la generación fue exitosa */
  success: boolean;
  /** Datos generados */
  data: {
    /** Componentes para versión newsletter (resumida) */
    objData: EmailComponent[];
    /** Componentes para versión web (extendida) */
    objDataWeb: EmailComponent[];
    /** Título generado (si no se proporcionó) */
    title?: string;
    /** Categoría detectada/asignada */
    category?: string;
    /** Metadata de la generación */
    metadata: AIMetadata;
  };
  /** Error si la generación falló */
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Datos de una nota generada (usado internamente)
 */
export interface AINoteData {
  /** ID único de la nota */
  id: string;
  /** Título de la nota */
  title: string;
  /** Categoría de la nota */
  category?: string;
  /** Componentes para newsletter */
  objData: EmailComponent[];
  /** Componentes para web */
  objDataWeb: EmailComponent[];
  /** Orden en el newsletter */
  order: number;
  /** Prompt usado para generar */
  prompt: string;
}

/**
 * Respuesta completa para generación de newsletter
 */
export interface AINewsletterResponse {
  /** Indica si la generación fue exitosa */
  success: boolean;
  /** Datos del newsletter generado */
  data: {
    /** Array de notas generadas */
    notes: AINoteData[];
    /** Título del newsletter (si se proporcionó) */
    title?: string;
    /** Descripción del newsletter */
    description?: string;
    /** Metadata general */
    metadata: {
      totalNotes: number;
      totalTokens: number;
      generationTime: number;
      timestamp: string;
    };
  };
  /** Error si alguna nota falló */
  error?: {
    code: string;
    message: string;
    failedPrompts?: number[];
  };
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Estado de generación
 */
export type GenerationStatus =
  | 'idle' // Sin actividad
  | 'validating' // Validando inputs
  | 'generating' // Generando contenido
  | 'success' // Generación exitosa
  | 'error'; // Error en generación

/**
 * Sugerencia de prompt
 */
export interface PromptSuggestion {
  /** ID único de la sugerencia */
  id: string;
  /** Categoría de la sugerencia */
  category: string;
  /** Título/nombre de la sugerencia */
  title: string;
  /** Texto del prompt */
  prompt: string;
  /** Variables que el usuario puede personalizar */
  variables?: Array<{
    name: string;
    placeholder: string;
    description: string;
  }>;
  /** Tags para búsqueda */
  tags?: string[];
}

/**
 * Estado del formulario de newsletter
 */
export interface NewsletterNoteForm {
  /** Prompt para la nota */
  prompt: string;
  /** Tipo de contenido seleccionado */
  contentTypeId: string;
  /** Categoría seleccionada */
  categoryId: string;
  /** Subcategoría seleccionada */
  subcategoryId: string;
  /** Controla si la IA debe generar recursos multimedia */
  mediaGenerationAI: boolean;
}

export interface NewsletterFormState {
  /** Cantidad de notas a generar */
  notesCount: number;
  /** Datos de cada nota */
  notes: NewsletterNoteForm[];
  /** Estado de generación */
  status: GenerationStatus;
  /** Mensaje de error si aplica */
  error: string | null;
  /** Progreso de generación (0-100) */
  progress: number;
}

/**
 * Estado del formulario de nota
 */
export interface NoteFormState {
  /** Título de la nota */
  title: string;
  /** Prompt detallado */
  prompt: string;
  /** Tipo de contenido seleccionado */
  contentTypeId: string;
  /** Categoría seleccionada */
  categoryId: string;
  /** Subcategoría seleccionada */
  subcategoryId: string;
  /** Controla si la IA debe generar recursos multimedia */
  mediaGenerationAI: boolean;
  /** Estado de generación */
  status: GenerationStatus;
  /** Mensaje de error si aplica */
  error: string | null;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Resultado de validación
 */
export interface ValidationResult {
  /** Indica si los datos son válidos */
  valid: boolean;
  /** Errores encontrados */
  errors: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Configuración de validación
 */
export interface ValidationConfig {
  /** Longitud mínima del prompt */
  minPromptLength: number;
  /** Longitud máxima del prompt */
  maxPromptLength: number;
  /** Número mínimo de notas en newsletter */
  minNotes: number;
  /** Número máximo de notas en newsletter */
  maxNotes: number;
  /** Categorías permitidas */
  allowedCategories?: string[];
}
