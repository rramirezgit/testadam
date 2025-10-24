import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type {
  MagicWriteAction,
  MagicWriteRequest,
  MagicWriteResponse,
} from 'src/types/magic-write';

import { createAxiosInstance } from 'src/utils/axiosInstance';

interface MagicWriteState {
  loading: boolean;
  error: string | null;
  lastResult: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  processMagicWrite: (
    action: MagicWriteAction,
    text: string,
    language?: string
  ) => Promise<string | null>;
  clearLastResult: () => void;
}

const useMagicWriteStore = create<MagicWriteState>()(
  devtools(
    (set, get) => ({
      loading: false,
      error: null,
      lastResult: null,

      setLoading: (loading: boolean) => set({ loading }),

      setError: (error: string | null) => set({ error }),

      processMagicWrite: async (action: MagicWriteAction, text: string, language?: string) => {
        try {
          console.log('🔄 processMagicWrite called:', { action, text, language });
          set({ loading: true, error: null });

          const axiosInstance = createAxiosInstance({ isIA: true });

          const requestData: MagicWriteRequest = {
            action,
            text,
          };

          // Solo agregar language si la acción es traducir
          if (action === 'traducir' && language) {
            requestData.language = language;
          }

          const response = await axiosInstance.post<MagicWriteResponse>(
            '/api/v1/magic-write',
            requestData
          );

          if (response.data && response.data.text) {
            console.log('✅ MagicWrite procesado exitosamente:', {
              responseStatus: response.status,
              textLength: response.data.text.length,
            });

            set({
              lastResult: response.data.text,
              loading: false,
            });

            return response.data.text;
          }

          set({ loading: false });
          return null;
        } catch (error: any) {
          console.error('❌ Error procesando MagicWrite:', {
            error,
            errorMessage: error.response?.data?.message,
            errorStatus: error.response?.status,
            errorData: error.response?.data,
          });

          const errorMessage = error.response?.data?.message || 'Error al procesar el texto con IA';
          set({
            loading: false,
            error: errorMessage,
          });

          return null;
        }
      },

      clearLastResult: () => set({ lastResult: null }),
    }),
    {
      name: 'magic-write-store',
    }
  )
);

export default useMagicWriteStore;
