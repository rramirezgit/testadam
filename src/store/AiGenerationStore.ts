/**
 * Store para manejar generación de contenido con IA
 * Sistema asíncrono con polling
 */

import type {
  TaskStatus,
  GenerateNoteRequest,
  ParsedGeneratedContent,
} from 'src/types/ai-generation';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { generateNoteComplete } from 'src/services/ai-service';

import useAuthStore from './AuthStore';

// ============================================================================
// TIPOS DEL STORE
// ============================================================================

interface AiGenerationState {
  // Estado de generación actual
  loading: boolean;
  taskId: string | null;
  status: TaskStatus | null;
  progress: number;
  message: string;
  error: string | null;
  isCancelled: boolean; // Flag para indicar si se canceló

  // Contenido generado
  currentGeneration: ParsedGeneratedContent | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (status: TaskStatus, progress: number, message: string) => void;
  clearCurrentGeneration: () => void;

  /**
   * Genera una nota con IA (flujo completo)
   * Inicia generación + polling automático
   */
  generateNote: (
    prompt: string,
    title?: string,
    category?: string,
    template?: 'NEWS' | 'ARTICLE' | 'GUIDE' | 'TUTORIAL'
  ) => Promise<ParsedGeneratedContent | null>;

  /**
   * Cancela la generación actual (detiene polling)
   */
  cancelGeneration: () => void;
}

// ============================================================================
// STORE
// ============================================================================

const useAiGenerationStore = create<AiGenerationState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      loading: false,
      taskId: null,
      status: null,
      progress: 0,
      message: '',
      error: null,
      isCancelled: false,
      currentGeneration: null,

      // Setters
      setLoading: (loading: boolean) => set({ loading }),

      setError: (error: string | null) => set({ error, loading: false }),

      setProgress: (status: TaskStatus, progress: number, message: string) => {
        set({ status, progress, message });
      },

      clearCurrentGeneration: () => {
        set({
          currentGeneration: null,
          error: null,
          status: null,
          progress: 0,
          message: '',
          taskId: null,
          isCancelled: false,
        });
      },

      // Generar nota completa
      generateNote: async (
        prompt: string,
        title?: string,
        category?: string,
        template: 'NEWS' | 'ARTICLE' | 'GUIDE' | 'TUTORIAL' = 'NEWS'
      ) => {
        try {
          console.log('🤖 [AiGenerationStore] Iniciando generación de nota');

          set({
            loading: true,
            error: null,
            currentGeneration: null,
            status: 'PENDING',
            progress: 0,
            message: 'Iniciando generación...',
            isCancelled: false, // Resetear flag de cancelación
          });

          // Obtener userId y plan desde AuthStore
          const authState = useAuthStore.getState();
          if (!authState.user?.id) {
            throw new Error('Usuario no autenticado');
          }

          const request: GenerateNoteRequest = {
            prompt,
            title,
            category,
            template,
            userId: authState.user.id,
            plan: authState.user?.plan?.name || null,
          };

          // Generar nota con polling automático
          const result = await generateNoteComplete(request, (status, progress, message) => {
            // Callback de progreso
            console.log(`📊 Progreso: ${status} (${progress}%) - ${message}`);
            set({ status, progress, message });
          });

          console.log('✅ [AiGenerationStore] Generación completada exitosamente');

          set({
            currentGeneration: result,
            loading: false,
            status: 'COMPLETED',
            progress: 100,
            message: '¡Generación completada!',
          });

          return result;
        } catch (err: any) {
          console.error('❌ [AiGenerationStore] Error al generar nota:', err);

          const errorMessage =
            err.response?.data?.message || err.message || 'Error al generar la nota';

          set({
            loading: false,
            error: errorMessage,
            status: 'ERROR',
            progress: 0,
          });

          return null;
        }
      },

      // Cancelar generación
      cancelGeneration: () => {
        console.log('🛑 Cancelando generación');
        set({
          loading: false,
          status: null,
          progress: 0,
          message: '',
          taskId: null,
          isCancelled: true, // Marcar como cancelado
        });
      },
    }),
    {
      name: 'ai-generation-store',
    }
  )
);

export default useAiGenerationStore;
