/**
 * Tipos para el sistema de gestión de tareas de IA en background
 */

import type { TaskStatus, ParsedGeneratedContent } from './ai-generation';

/**
 * Tarea de generación de IA
 */
export interface Task {
  taskId: string;
  status: TaskStatus;
  progress: number;
  message: string;
  title?: string;
  category?: string;
  prompt: string;
  createdAt: string;
  updatedAt?: string;
  data?: ParsedGeneratedContent;
  error?: string;
  // Campos para soporte de newsletters
  newsletterId?: string; // ID único del newsletter al que pertenece
  noteIndexInNewsletter?: number; // Índice/orden de la nota dentro del newsletter
  isSaved?: boolean; // Indica si la nota ya fue guardada en la base de datos
  savedPostId?: string; // ID del post guardado en la base de datos
}

/**
 * Item simplificado para listas de tareas
 */
export interface TaskListItem {
  taskId: string;
  title: string;
  progress: number;
  status: TaskStatus;
  message: string;
}

/**
 * Configuración de polling para tareas en background
 */
export interface TaskPollingConfig {
  interval: number;
  maxDuration: number;
  maxAttempts: number;
}

