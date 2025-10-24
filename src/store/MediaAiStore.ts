import type {
  MediaAiGeneration,
  GenerateImageRequest,
  GenerateImageResponse,
  MediaAiHistoryResponse,
} from 'src/types/media-ai';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { endpoints, createAxiosInstance } from 'src/utils/axiosInstance';

interface MediaAiState {
  loading: boolean;
  error: string | null;
  currentGeneration: MediaAiGeneration | null;
  history: MediaAiGeneration[];
  pollingId: string | null;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentGeneration: () => void;

  generateImage: (
    prompt: string,
    resolution?: 'cuadrado' | 'retrato' | 'paisaje',
    userId?: string
  ) => Promise<string | null>;

  pollStatus: (generationId: string) => Promise<MediaAiGeneration | null>;

  fetchHistory: (userId?: string, limit?: number) => Promise<void>;

  deleteGeneration: (id: string, userId?: string) => Promise<void>;
}

const useMediaAiStore = create<MediaAiState>()(
  devtools(
    (set, get) => ({
      loading: false,
      error: null,
      currentGeneration: null,
      history: [],
      pollingId: null,

      setLoading: (loading: boolean) => set({ loading }),

      setError: (error: string | null) => set({ error }),

      clearCurrentGeneration: () => set({ currentGeneration: null, error: null }),

      generateImage: async (prompt: string, resolution = 'cuadrado', userId?: string) => {
        try {
          console.log('🎨 Iniciando generación de imagen:', { prompt, resolution, userId });
          set({ loading: true, error: null, currentGeneration: null });

          const axiosInstance = createAxiosInstance({ isIA: true });

          const requestBody: GenerateImageRequest = {
            prompt,
            type: 'IMAGE',
            resolution,
          };

          if (userId) {
            requestBody.userId = userId;
          }

          const response = await axiosInstance.post<GenerateImageResponse>(
            endpoints.mediaAi.generate,
            requestBody
          );

          if (response.data?.id) {
            console.log('✅ Generación iniciada:', response.data.id);
            set({ pollingId: response.data.id });
            return response.data.id;
          }

          throw new Error('No se recibió ID de generación');
        } catch (err: any) {
          console.error('❌ Error al iniciar generación:', err);
          const errorMessage =
            err.response?.data?.message || 'Error al iniciar la generación de imagen';
          set({ loading: false, error: errorMessage });
          return null;
        }
      },

      pollStatus: async (generationId: string) => {
        try {
          const axiosInstance = createAxiosInstance({ isIA: true });
          const response = await axiosInstance.get<MediaAiGeneration>(
            endpoints.mediaAi.status(generationId)
          );

          if (response.data) {
            const generation = response.data;
            console.log('📊 Estado de generación:', generation.status);

            set({ currentGeneration: generation });

            // Si completó o falló, detener loading
            if (generation.status === 'COMPLETED' || generation.status === 'FAILED') {
              set({ loading: false, pollingId: null });

              if (generation.status === 'FAILED') {
                set({ error: generation.error || 'Error al generar la imagen' });
              }
            }

            return generation;
          }

          return null;
        } catch (err: any) {
          console.error('❌ Error al consultar estado:', err);
          const errorMessage = err.response?.data?.message || 'Error al consultar el estado';
          set({ loading: false, error: errorMessage, pollingId: null });
          return null;
        }
      },

      fetchHistory: async (userId?: string, limit = 10) => {
        try {
          const axiosInstance = createAxiosInstance({ isIA: true });
          const params = new URLSearchParams();

          if (userId) {
            params.append('userId', userId);
          }
          params.append('limit', limit.toString());

          const url = `${endpoints.mediaAi.history}?${params.toString()}`;
          const response = await axiosInstance.get<MediaAiHistoryResponse>(url);

          if (response.data?.data) {
            console.log('📚 Historial cargado:', response.data.data.length, 'elementos');
            set({ history: response.data.data });
          }
        } catch (err: any) {
          console.error('❌ Error al cargar historial:', err);
          // No establecer error aquí, el historial es opcional
        }
      },

      deleteGeneration: async (id: string, userId?: string) => {
        try {
          const axiosInstance = createAxiosInstance({ isIA: true });
          const params = userId ? `?userId=${userId}` : '';
          await axiosInstance.delete(`${endpoints.mediaAi.delete(id)}${params}`);

          // Actualizar historial removiendo el elemento eliminado
          const currentHistory = get().history;
          set({ history: currentHistory.filter((item) => item.id !== id) });

          console.log('🗑️ Generación eliminada:', id);
        } catch (err: any) {
          console.error('❌ Error al eliminar generación:', err);
          throw err;
        }
      },
    }),
    { name: 'media-ai-store' }
  )
);

export default useMediaAiStore;
