import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';

import { endpoints, createAxiosInstance } from 'src/utils/axiosInstance';

// Interfaces
interface Author {
  id: string;
  email: string;
  name: string;
  avatar: string;
  idAuth0: string;
  country: string;
  state: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string | null;
  objDataWeb: string;
  objData: string;
  configPost: string;
  description: string | null;
  origin: string;
  coverImageUrl: string;
  slug: string | null;
  status: string;
  active: boolean;
  publishedAt: string | null;
  publishOnAdac: boolean;
  highlight: boolean;
  newsletterId: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryIDs: string[];
  subcategoryIDs: string[];
  sourceUrl: string | null;
  sourceIcon: string | null;
  aiTag: string | null;
  sentiment: string | null;
  sentimentStats: string | null;
  aiRegion: string | null;
  embedding: any[];
  author: Author;
  categories: Category[];
  subcategories: Subcategory[];
}

interface Article {
  id: string;
  title: string;
  coverImageUrl: string;
  publishOnAdac: boolean;
  origin: string;
  status: string;
  highlight: boolean;
  newsletterId: string;
  createdAt: string;
}

interface Meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

interface ApiResponse {
  data: Article[];
  meta: Meta;
}

interface UpdatePostData {
  title?: string;
  objData?: string;
  objDataWeb?: string;
  configPost?: string;
  coverImageUrl?: string;
  highlight?: boolean;
  content?: string;
  description?: string;
  status?: string;
  publishOnAdac?: boolean;
}

interface CreatePostData {
  title: string;
  objData?: string;
  objDataWeb?: string;
  configPost?: string;
  description?: string;
  coverImageUrl?: string;
  newsletterId?: string;
  origin?: string;
  highlight?: boolean;
}

interface PostFilters {
  page?: number;
  perPage?: number;
  status?: string;
  origin?: string;
  highlight?: boolean;
  publishOnAdac?: boolean;
  search?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  usedInNewsletter?: boolean;
  orderBy?: string;
  newsletterId?: string;
}

interface PostState {
  loading: boolean;
  posts: Article[];
  currentPost: Post | null;
  meta: Meta | null;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // CRUD Operations
  findAll: (filters?: PostFilters) => Promise<ApiResponse | null>;
  findById: (id: string) => Promise<Post | null>;
  create: (data: CreatePostData) => Promise<Post | null>;
  update: (id: string, data: UpdatePostData) => Promise<Post | null>;
  delete: (id: string) => Promise<boolean>;

  // Utility functions
  clearCurrentPost: () => void;
  clearPosts: () => void;
  refreshPosts: () => Promise<void>;
}

const usePostStore = create<PostState>()(
  devtools(
    persist(
      (set, get) => ({
        loading: false,
        posts: [],
        currentPost: null,
        meta: null,
        error: null,

        setLoading: (loading: boolean) => set({ loading }),

        setError: (error: string | null) => set({ error }),

        findAll: async (filters?: PostFilters) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            // Construir query parameters
            const params = new URLSearchParams();
            if (filters) {
              Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                  params.append(key, String(value));
                }
              });
            }

            const url = `${endpoints.post.findAll}${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await axiosInstance.get<ApiResponse>(url);

            if (response.data) {
              set({
                posts: response.data.data,
                meta: response.data.meta,
                loading: false,
              });
              return response.data;
            }

            set({ loading: false });
            return null;
          } catch (error: any) {
            console.error('Error al obtener posts:', error);
            const errorMessage = error.response?.data?.message || 'Error al cargar los posts';
            set({
              loading: false,
              error: errorMessage,
            });
            return null;
          }
        },

        findById: async (id: string) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.get<Post>(endpoints.post.findById(id));

            if (response.data) {
              set({
                currentPost: response.data,
                loading: false,
              });
              return response.data;
            }

            set({ loading: false });
            return null;
          } catch (error: any) {
            console.error('Error al obtener post:', error);
            const errorMessage = error.response?.data?.message || 'Error al cargar el post';
            set({
              loading: false,
              error: errorMessage,
              currentPost: null,
            });
            return null;
          }
        },

        create: async (data: CreatePostData) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.post<Post>(endpoints.post.create, data);

            if (response.data) {
              // Actualizar la lista de posts si existe
              const currentPosts = get().posts;
              set({
                posts: [response.data as any, ...currentPosts], // Agregar al inicio
                currentPost: response.data,
                loading: false,
              });
              return response.data;
            }

            set({ loading: false });
            return null;
          } catch (error: any) {
            console.error('Error al crear post:', error);
            const errorMessage = error.response?.data?.message || 'Error al crear el post';
            set({
              loading: false,
              error: errorMessage,
            });
            return null;
          }
        },

        update: async (id: string, data: UpdatePostData) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.patch<Post>(endpoints.post.update(id), data);

            if (response.data) {
              // Actualizar en la lista de posts si existe
              const currentPosts = get().posts;
              const updatedPosts = currentPosts.map((post) =>
                post.id === id ? { ...post, ...data } : post
              );

              // Actualizar currentPost si es el mismo que se está editando
              const currentPost = get().currentPost;
              const updatedCurrentPost =
                currentPost?.id === id ? { ...currentPost, ...response.data } : currentPost;

              set({
                posts: updatedPosts,
                currentPost: updatedCurrentPost,
                loading: false,
              });

              return response.data;
            }

            set({ loading: false });
            return null;
          } catch (error: any) {
            console.error('Error al actualizar post:', error);
            const errorMessage = error.response?.data?.message || 'Error al actualizar el post';
            set({
              loading: false,
              error: errorMessage,
            });
            return null;
          }
        },

        delete: async (id: string) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            await axiosInstance.delete(endpoints.post.delete(id));

            // Remover de la lista de posts
            const currentPosts = get().posts;
            const filteredPosts = currentPosts.filter((post) => post.id !== id);

            // Limpiar currentPost si es el que se eliminó
            const currentPost = get().currentPost;
            const updatedCurrentPost = currentPost?.id === id ? null : currentPost;

            set({
              posts: filteredPosts,
              currentPost: updatedCurrentPost,
              loading: false,
            });

            return true;
          } catch (error: any) {
            console.error('Error al eliminar post:', error);
            const errorMessage = error.response?.data?.message || 'Error al eliminar el post';
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }
        },

        clearCurrentPost: () => set({ currentPost: null }),

        clearPosts: () => set({ posts: [], meta: null }),

        refreshPosts: async () => {
          const { findAll } = get();
          await findAll();
        },
      }),
      {
        name: 'post-storage',
        storage: createJSONStorage(() => localStorage),
        // Solo persistir datos no sensibles
        partialize: (state) => ({
          posts: state.posts,
          meta: state.meta,
          // No persistir currentPost para evitar datos obsoletos
        }),
      }
    ),
    {
      name: 'post-store',
    }
  )
);

export default usePostStore;

// Exportar tipos para uso externo
export type {
  Post,
  Meta,
  Author,
  Article,
  Category,
  ApiResponse,
  PostFilters,
  Subcategory,
  UpdatePostData,
  CreatePostData,
};
