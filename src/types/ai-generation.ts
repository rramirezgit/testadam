/**
 * Tipos para el sistema de generación de contenido con IA
 * Sistema asíncrono con polling
 */

import type { NewsletterComponent } from './newsletter-component';

// ============================================================================
// TIPOS DE ESTADO
// ============================================================================

/**
 * Estados posibles de una tarea de generación
 */
export type TaskStatus =
  | 'PENDING' // Tarea en cola
  | 'GENERATING_IMAGE' // Generando imagen con IA
  | 'GENERATING_WEB_CONTENT' // Generando contenido web extendido
  | 'GENERATING_NEWSLETTER_CONTENT' // Generando contenido newsletter resumido
  | 'COMPLETED' // Generación completada exitosamente
  | 'ERROR' // Error en el proceso
  | 'FAILED'; // Fallo en la generación (del backend)

/**
 * Mapeo de estados a progreso (%)
 */
export const TASK_PROGRESS_MAP: Record<TaskStatus, number> = {
  PENDING: 0,
  GENERATING_IMAGE: 25,
  GENERATING_WEB_CONTENT: 50,
  GENERATING_NEWSLETTER_CONTENT: 75,
  COMPLETED: 100,
  ERROR: 0,
  FAILED: 0,
};

/**
 * Mensajes por estado
 */
export const TASK_STATUS_MESSAGES: Record<TaskStatus, string> = {
  PENDING: 'Iniciando generación...',
  GENERATING_IMAGE: 'Generando imagen con IA...',
  GENERATING_WEB_CONTENT: 'Generando contenido web...',
  GENERATING_NEWSLETTER_CONTENT: 'Generando contenido de newsletter...',
  COMPLETED: '¡Generación completada!',
  ERROR: 'Error en la generación',
  FAILED: 'Generación fallida',
};

// ============================================================================
// REQUEST TYPES
// ============================================================================

/**
 * Request para iniciar generación de nota
 */
export interface GenerateNoteRequest {
  prompt: string;
  category?: string;
  title?: string;
  template?: 'NEWS' | 'ARTICLE' | 'GUIDE' | 'TUTORIAL';
  userId: string;
  plan: string | null;
}

/**
 * Response al iniciar generación (devuelve taskId)
 */
export interface InitiateGenerationResponse {
  taskId: string;
  status: TaskStatus;
  message: string;
}

// ============================================================================
// POLLING TYPES
// ============================================================================

/**
 * Metadata de generación
 */
export interface GenerationMetadata {
  generatedAt: string;
  promptUsed: string;
  model: string;
  tokensUsed: number;
}

/**
 * Datos de contenido generado (cuando está completado)
 * ⚠️ IMPORTANTE: objData y objDataWeb vienen como STRING JSON
 */
export interface GeneratedContentData {
  objData: string; // STRING JSON que debe parsearse a NewsletterComponent[]
  objDataWeb: string; // STRING JSON que debe parsearse a NewsletterComponent[]
  title: string;
  content: string;
  description: string;
  origin: string;
  coverImageUrl: string;
  metadata: GenerationMetadata;
}

/**
 * Response del polling de estado
 */
export interface TaskStatusResponse {
  taskId: string;
  status: TaskStatus;
  progress: number;
  message: string;
  success: boolean;
  createdAt: string;
  updatedAt: string;
  data?: GeneratedContentData;
  error?: {
    code: string;
    message: string;
  };
}

// ============================================================================
// PARSED TYPES
// ============================================================================

/**
 * Contenido parseado (después de JSON.parse)
 */
export interface ParsedGeneratedContent {
  objData: NewsletterComponent[];
  objDataWeb: NewsletterComponent[];
  title: string;
  content: string;
  description: string;
  origin: string;
  coverImageUrl: string;
  metadata: GenerationMetadata;
}

// ============================================================================
// CALLBACK TYPES
// ============================================================================

/**
 * Callback para actualizaciones de progreso durante el polling
 */
export type PollingProgressCallback = (
  status: TaskStatus,
  progress: number,
  message: string
) => void;

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Error de generación
 */
export interface GenerationError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Resultado de validación
 */
export interface ValidationResult {
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
}
