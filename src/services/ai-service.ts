/**
 * AI Service - Servicio para generación de contenido con IA
 * Sistema asíncrono con polling
 */

import type { NewsletterComponent } from 'src/types/newsletter-component';
import type {
  ValidationResult,
  TaskStatusResponse,
  GenerateNoteRequest,
  ParsedGeneratedContent,
  PollingProgressCallback,
  InitiateGenerationResponse,
} from 'src/types/ai-generation';

import { endpoints, createAxiosInstance } from 'src/utils/axiosInstance';

import useAiGenerationStore from 'src/store/AiGenerationStore';

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

/**
 * Configuración de polling
 * NOTA: TaskManagerStore maneja el polling en background sin timeout
 * Este config es solo para uso directo del servicio (no recomendado)
 */
const POLLING_CONFIG = {
  interval: 20000, // Consultar cada 20 segundos
  maxDuration: 60 * 60 * 1000, // Máximo 1 hora (muy generoso)
  maxAttempts: 180, // (60 min * 60 seg) / 20 seg = 180 intentos
};

// ============================================================================
// FUNCIONES PRINCIPALES
// ============================================================================

/**
 * Inicia la generación de una nota con IA (asíncrona)
 * Devuelve un taskId para hacer polling del estado
 *
 * @param request - Datos de la nota a generar
 * @returns Promise con taskId y estado inicial
 */
export async function initiateNoteGeneration(
  request: GenerateNoteRequest
): Promise<InitiateGenerationResponse> {
  try {
    console.log('🚀 Iniciando generación de nota con IA:', request);

    // Validar request
    const validation = validateNoteRequest(request);
    if (!validation.valid) {
      throw new Error(validation.errors.map((e) => e.message).join(', '));
    }

    // Crear instancia de axios para IA
    const axiosInstance = createAxiosInstance({ isIA: true });

    // Realizar petición inicial
    const response = await axiosInstance.post<InitiateGenerationResponse>(
      endpoints.ai.generateNote,
      request
    );

    console.log('✅ Generación iniciada, taskId:', response.data.taskId);

    return response.data;
  } catch (error: any) {
    console.error('❌ Error al iniciar generación:', error);
    throw new Error(error.response?.data?.message || 'Error al iniciar generación con IA');
  }
}

/**
 * Consulta el estado de una tarea de generación
 *
 * @param taskId - ID de la tarea
 * @returns Promise con el estado actual
 */
export async function checkTaskStatus(taskId: string): Promise<TaskStatusResponse> {
  try {
    const axiosInstance = createAxiosInstance({ isIA: true });

    const response = await axiosInstance.get<TaskStatusResponse>(endpoints.ai.checkStatus(taskId));

    return response.data;
  } catch (error: any) {
    console.error('❌ Error al consultar estado de tarea:', error);
    throw new Error(error.response?.data?.message || 'Error al consultar estado');
  }
}

/**
 * Realiza polling del estado de una tarea hasta que se complete
 * Con callback opcional para actualizar UI
 *
 * @param taskId - ID de la tarea
 * @param onProgress - Callback opcional para updates de progreso
 * @returns Promise con el contenido generado parseado
 */
export async function pollUntilComplete(
  taskId: string,
  onProgress?: PollingProgressCallback
): Promise<ParsedGeneratedContent> {
  let attempts = 0;
  const startTime = Date.now();

  console.log('🔄 Iniciando polling para taskId:', taskId);

  while (attempts < POLLING_CONFIG.maxAttempts) {
    // 🛑 Verificar si la generación fue cancelada
    const { isCancelled } = useAiGenerationStore.getState();
    if (isCancelled) {
      console.log('🛑 Polling detenido: generación cancelada por el usuario');
      throw new Error('Generación cancelada');
    }

    // Verificar timeout
    const elapsed = Date.now() - startTime;
    if (elapsed > POLLING_CONFIG.maxDuration) {
      throw new Error(
        'Timeout: La generación está tardando demasiado. Por favor, intenta de nuevo.'
      );
    }

    try {
      // Consultar estado
      const statusResponse = await checkTaskStatus(taskId);

      console.log(
        `📊 [Intento ${attempts + 1}] Estado: ${statusResponse.status} (${statusResponse.progress}%)`
      );

      // Notificar progreso si hay callback
      if (onProgress) {
        onProgress(statusResponse.status, statusResponse.progress, statusResponse.message);
      }

      // 🛑 Verificar de nuevo si fue cancelado antes de procesar resultados
      const { isCancelled: stillCancelled } = useAiGenerationStore.getState();
      if (stillCancelled) {
        console.log('🛑 Generación cancelada, ignorando resultados');
        throw new Error('Generación cancelada');
      }

      // Si completó exitosamente
      if (statusResponse.status === 'COMPLETED' && statusResponse.success && statusResponse.data) {
        console.log('✅ Generación completada exitosamente');
        return parseGeneratedContent(statusResponse.data);
      }

      // Si hay error o fallo explícito - DETENER POLLING
      if (statusResponse.status === 'ERROR' || statusResponse.status === 'FAILED') {
        console.log('❌ Generación falló, deteniendo polling');
        const errorMsg =
          statusResponse.error?.message || statusResponse.message || 'Error durante la generación';
        throw new Error(errorMsg);
      }

      // Si está COMPLETED pero con success=false - DETENER POLLING
      if (statusResponse.status === 'COMPLETED' && statusResponse.success === false) {
        console.log('❌ Generación completada con error, deteniendo polling');
        const errorMsg =
          statusResponse.error?.message || statusResponse.message || 'Error durante la generación';
        throw new Error(errorMsg);
      }

      // Esperar antes del siguiente intento
      await sleep(POLLING_CONFIG.interval);
      attempts++;
    } catch (error: any) {
      // Si es un error de la generación, propagarlo
      if (error.message && !error.response) {
        throw error;
      }

      // Si es error de red, reintentar
      console.warn('⚠️ Error en polling, reintentando...', error.message);
      await sleep(POLLING_CONFIG.interval);
      attempts++;
    }
  }

  throw new Error('Se alcanzó el número máximo de intentos de polling');
}

/**
 * Función conveniente que combina initiate + polling
 * Útil cuando no necesitas mostrar progreso granular
 *
 * @param request - Datos de la nota a generar
 * @param onProgress - Callback opcional para updates de progreso
 * @returns Promise con el contenido generado
 */
export async function generateNoteComplete(
  request: GenerateNoteRequest,
  onProgress?: PollingProgressCallback
): Promise<ParsedGeneratedContent> {
  try {
    console.log('🤖 Generando nota completa (initiate + polling)');

    // Iniciar generación
    const initiateResponse = await initiateNoteGeneration(request);

    // Hacer polling hasta completar
    const result = await pollUntilComplete(initiateResponse.taskId, onProgress);

    return result;
  } catch (error: any) {
    console.error('❌ Error en generación completa:', error);
    throw error;
  }
}

// ============================================================================
// FUNCIONES DE PARSING
// ============================================================================

/**
 * Parsea los datos generados por el backend
 * ⚠️ IMPORTANTE: objData y objDataWeb vienen como STRING JSON
 *
 * @param data - Datos crudos del backend
 * @returns Datos parseados con arrays de componentes
 */
export function parseGeneratedContent(data: {
  objData: string;
  objDataWeb: string;
  title: string;
  content: string;
  description: string;
  origin: string;
  coverImageUrl: string;
  metadata: any;
}): ParsedGeneratedContent {
  try {
    console.log('🔍 Parseando contenido generado...');

    // Parsear JSON strings a arrays
    const objData = JSON.parse(data.objData) as NewsletterComponent[];
    const objDataWeb = JSON.parse(data.objDataWeb) as NewsletterComponent[];

    console.log('✅ Contenido parseado:', {
      objDataLength: objData.length,
      objDataWebLength: objDataWeb.length,
    });

    return {
      objData,
      objDataWeb,
      title: data.title,
      content: data.content,
      description: data.description,
      origin: data.origin,
      coverImageUrl: data.coverImageUrl,
      metadata: data.metadata,
    };
  } catch (error: any) {
    console.error('❌ Error al parsear contenido generado:', error);
    throw new Error('Error al parsear el contenido generado. Formato inválido.');
  }
}

// ============================================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================================

/**
 * Valida un request de generación de nota
 *
 * @param request - Request a validar
 * @returns Resultado de validación
 */
export function validateNoteRequest(request: GenerateNoteRequest): ValidationResult {
  const errors: Array<{ field: string; message: string }> = [];

  // Validar prompt
  if (!request.prompt || request.prompt.trim().length === 0) {
    errors.push({ field: 'prompt', message: 'El prompt es obligatorio' });
  }

  // Sin validaciones de longitud - se permite cualquier tamaño de prompt

  // Validar título (opcional)
  if (request.title && request.title.length > 200) {
    errors.push({ field: 'title', message: 'El título no puede exceder 200 caracteres' });
  }

  // Validar userId
  if (!request.userId) {
    errors.push({ field: 'userId', message: 'userId es obligatorio' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Recupera tareas desde localStorage
 * Filtra solo tareas no completadas/con error para reiniciar polling
 *
 * @returns Array de tareas pendientes/en progreso
 */
export function recoverTasksFromLocalStorage(): any[] {
  try {
    const stored = localStorage.getItem('ai-tasks');
    if (!stored) return [];

    const tasks = JSON.parse(stored);

    // Filtrar solo tareas no completadas ni con error
    const pendingTasks = tasks.filter(
      (t: any) => t.status !== 'COMPLETED' && t.status !== 'ERROR' && t.status !== 'FAILED'
    );

    console.log('🔄 Recuperadas tareas desde localStorage:', pendingTasks.length);

    return pendingTasks;
  } catch (error) {
    console.error('❌ Error al recuperar tareas desde localStorage:', error);
    return [];
  }
}

/**
 * Sleep helper para esperar entre polling
 *
 * @param ms - Milisegundos a esperar
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
