// Importar tipos centralizados
import type {
  Post,
  Meta,
  Article,
  PostStatus,
  ApiResponse,
  PostFilters,
  SendTestData,
  SendEmailData,
  UpdatePostData,
  CreatePostData,
  NewsletterFilters,
} from 'src/types/post';

import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from 'zustand/middleware';

import { endpoints, createAxiosInstance } from 'src/utils/axiosInstance';

import { generateEscapedHtml } from 'src/components/newsletter-note/newsletter-html-generator';

// Interfaces para metadata
interface ContentType {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Audience {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  imageUrl: string;
  contentType: {
    id: string;
    name: string;
  };
  subcategories: Subcategory[];
}

interface PostState {
  loading: boolean;
  posts: Article[];
  currentPost: Post | null;
  meta: Meta | null;
  error: string | null;

  // Metadata states
  contentTypes: ContentType[];
  audiences: Audience[];
  categories: Category[];
  loadingMetadata: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // CRUD Operations
  findAll: (filters?: PostFilters) => Promise<ApiResponse | null>;
  findById: (id: string) => Promise<Post | null>;
  create: (data: CreatePostData) => Promise<Post | null>;
  update: (id: string, data: UpdatePostData) => Promise<Post | null>;
  updateStatus: (id: string, status: PostStatus) => Promise<Post | null>;
  delete: (id: string) => Promise<boolean>;
  sendEmail: (postId: string, emails: string[], htmlContent: string) => Promise<boolean>;

  // Email sending operations
  sendPostForReview: (postId: string, emails: string[], htmlContent: string) => Promise<boolean>;
  sendNewsletterForReview: (
    newsletterId: string,
    emails: string[],
    htmlContent: string
  ) => Promise<boolean>;
  sendNewsletter: (newsletterId: string, htmlContent: string) => Promise<boolean>;
  requestNewsletterApproval: (
    newsletterId: string,
    approverEmails: string[],
    subject: string,
    htmlContent: string
  ) => Promise<boolean>;

  // Newsletter operations
  createNewsletter: (subject: string, newsletterData: any) => Promise<any>;
  updateNewsletter: (id: string, newsletterData: any) => Promise<any>;
  deleteNewsletter: (id: string) => Promise<boolean>;
  findAllNewsletters: (filters?: NewsletterFilters) => Promise<any[]>;
  findNewsletterById: (id: string) => Promise<any>;
  approveNewsletter: (id: string) => Promise<boolean>;
  rejectNewsletter: (id: string) => Promise<boolean>;
  scheduleNewsletter: (
    id: string,
    scheduleDate: string,
    subject: string,
    content: string
  ) => Promise<boolean>;
  unscheduleNewsletter: (
    id: string,
    subject: string,
    content: string,
    objData: string,
    scheduleDate: string
  ) => Promise<boolean>;
  sendNewsletterNow: (id: string, subject: string, content: string) => Promise<boolean>;

  // Metadata operations
  loadContentTypes: () => Promise<ContentType[]>;
  loadAudiences: () => Promise<Audience[]>;
  loadCategories: (contentTypeId: string) => Promise<Category[]>;

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

        // Metadata states
        contentTypes: [],
        audiences: [],
        categories: [],
        loadingMetadata: false,

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
                // Solo agregar el parámetro si tiene un valor válido
                if (value !== undefined && value !== null && value !== '') {
                  // Para booleanos, siempre agregar incluso si es false
                  if (typeof value === 'boolean' || value !== false) {
                    params.append(key, String(value));
                  }
                }
              });
            }

            const url = `${endpoints.post.findAll}${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await axiosInstance.get<ApiResponse>(url);

            if (response.data) {
              set({
                posts: response.data.data as Article[],
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
                currentPost: response.data as Post,
                loading: false,
              });
              return response.data as Post;
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

        updateStatus: async (id: string, status: string) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.patch<Post>(
              endpoints.post.updateStatus(id, status.toLowerCase())
            );

            if (response.data) {
              // Actualizar en la lista de posts si existe
              const currentPosts = get().posts;
              const updatedPosts = currentPosts.map((post) =>
                post.id === id ? { ...post, status } : post
              );

              // Actualizar currentPost si es el mismo que se está editando
              const currentPost = get().currentPost;
              const updatedCurrentPost =
                currentPost?.id === id ? { ...currentPost, status } : currentPost;
              set({
                posts: updatedPosts as Article[],
                currentPost: updatedCurrentPost as Post,
                loading: false,
              });

              return response.data;
            }

            set({ loading: false });
            return null;
          } catch (error: any) {
            console.error('Error al actualizar status del post:', error);
            const errorMessage = error.response?.data?.message || 'Error al actualizar el status';
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

        sendPostForReview: async (postId: string, emails: string[], htmlContent: string) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const currentPost = get().currentPost;
            const subject = currentPost?.title || `Post ${postId}`;
            // No escapar el HTML para envío normal de emails
            const content = htmlContent;

            const sendData: SendTestData = {
              subject,
              content,
              reviewerEmails: emails,
            };

            await axiosInstance.post(endpoints.post.sendForReview, sendData);
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('Error enviando post para revisión:', error);
            const errorMessage = error.response?.data?.message || 'Error al enviar el post';
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }
        },

        sendEmail: async (postId: string, emails: string[], htmlContent: string) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const currentPost = get().currentPost;
            const subject = currentPost?.title || `Post ${postId}`;
            // No escapar el HTML para envío normal de emails
            const content = htmlContent;

            const sendData: SendEmailData = {
              subject,
              content,
              emails,
            };

            await axiosInstance.post(endpoints.post.sendEmail, sendData);
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('Error enviando post para revisión:', error);
            const errorMessage = error.response?.data?.message || 'Error al enviar el post';
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }
        },

        sendNewsletterForReview: async (
          newsletterId: string,
          emails: string[],
          htmlContent: string
        ) => {
          try {
            console.log('🔄 sendNewsletterForReview called:', {
              newsletterId,
              emails,
              htmlContentLength: htmlContent.length,
              htmlContentPreview: htmlContent.substring(0, 200) + '...',
            });

            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            // No escapar el HTML para envío normal de emails
            const content = htmlContent;
            const sendData: SendTestData = {
              subject: `Newsletter ${newsletterId} - Prueba`,
              content,
              reviewerEmails: emails,
            };

            const response = await axiosInstance.post(
              endpoints.newsletter.sendForReview(newsletterId),
              sendData
            );

            console.log('✅ Newsletter enviado exitosamente:', {
              responseStatus: response.status,
              responseData: response.data,
            });

            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('❌ Error enviando newsletter para revisión:', {
              error,
              errorMessage: error.response?.data?.message,
              errorStatus: error.response?.status,
              errorData: error.response?.data,
            });
            const errorMessage = error.response?.data?.message || 'Error al enviar el newsletter';
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }
        },

        sendNewsletter: async (newsletterId: string, htmlContent: string) => {
          try {
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            // Para envío masivo, sí usar escape si es necesario para AWS SES
            const escapedContent = generateEscapedHtml(htmlContent);
            const sendData = {
              content: escapedContent,
            };

            await axiosInstance.post(endpoints.newsletter.send(newsletterId), sendData);
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('Error enviando newsletter:', error);
            const errorMessage = error.response?.data?.message || 'Error al enviar el newsletter';
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }
        },

        requestNewsletterApproval: async (
          newsletterId: string,
          approverEmails: string[],
          subject: string,
          htmlContent: string
        ) => {
          try {
            console.log('🔄 requestNewsletterApproval called:', {
              newsletterId,
              approverEmails,
              subject,
            });
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const sendData = {
              approverEmails,
              subject,
              content: htmlContent,
            };

            await axiosInstance.post(endpoints.newsletter.requestApproval(newsletterId), sendData);
            console.log('✅ Solicitud de aprobación enviada exitosamente');
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('❌ Error solicitando aprobación del newsletter:', error);
            const errorMessage = error.response?.data?.message || 'Error al solicitar aprobación';
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }
        },

        createNewsletter: async (subject: string, newsletterData: any) => {
          try {
            console.log('🔄 createNewsletter called:', {
              subject,
              newsletterData,
            });

            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const sendData = {
              subject,
              content: newsletterData.content,
              // ...newsletterData,
            };

            const response = await axiosInstance.post(endpoints.newsletter.create, sendData);

            console.log('✅ Newsletter creado exitosamente:', {
              responseStatus: response.status,
              responseData: response.data,
            });

            set({ loading: false });
            return response.data;
          } catch (error: any) {
            console.error('❌ Error creando newsletter:', {
              error,
              errorMessage: error.response?.data?.message,
              errorStatus: error.response?.status,
              errorData: error.response?.data,
            });
            const errorMessage = error.response?.data?.message || 'Error al crear el newsletter';
            set({
              loading: false,
              error: errorMessage,
            });
            return null;
          }
        },

        updateNewsletter: async (id: string, newsletterData: any) => {
          try {
            console.log('🔄 updateNewsletter called:', {
              id,
              newsletterData,
            });

            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.patch(
              endpoints.newsletter.update(id),
              newsletterData
            );

            console.log('✅ Newsletter actualizado exitosamente:', {
              responseStatus: response.status,
              responseData: response.data,
            });

            set({ loading: false });
            return response.data;
          } catch (error: any) {
            console.error('❌ Error actualizando newsletter:', {
              error,
              errorMessage: error.response?.data?.message,
              errorStatus: error.response?.status,
              errorData: error.response?.data,
            });
            const errorMessage =
              error.response?.data?.message || 'Error al actualizar el newsletter';
            set({
              loading: false,
              error: errorMessage,
            });
            return null;
          }
        },

        deleteNewsletter: async (id: string) => {
          try {
            console.log('🔄 deleteNewsletter called:', { id });
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            await axiosInstance.delete(endpoints.newsletter.delete(id));

            console.log('✅ Newsletter eliminado exitosamente');
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('❌ Error eliminando newsletter:', {
              error,
              errorMessage: error.response?.data?.message,
              errorStatus: error.response?.status,
              errorData: error.response?.data,
            });
            const errorMessage = error.response?.data?.message || 'Error al eliminar el newsletter';
            set({
              loading: false,
              error: errorMessage,
            });
            return false;
          }
        },

        findAllNewsletters: async (filters?: NewsletterFilters) => {
          try {
            console.log('🔄 findAllNewsletters called', { filters });
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            // Construir query parameters
            const params = new URLSearchParams();
            if (filters) {
              Object.entries(filters).forEach(([key, value]) => {
                // Solo agregar el parámetro si tiene un valor válido
                if (value !== undefined && value !== null && value !== '') {
                  // Para booleanos, siempre agregar incluso si es false
                  if (typeof value === 'boolean' || value !== false) {
                    params.append(key, String(value));
                  }
                }
              });
            }

            const url = `${endpoints.newsletter.findAll}${params.toString() ? `?${params.toString()}` : ''}`;

            const response = await axiosInstance.get(url);

            // Manejar la estructura { data: [...] }
            const newsletters = response.data?.data || response.data || [];

            console.log('✅ Newsletters obtenidos exitosamente:', {
              responseStatus: response.status,
              newslettersCount: newsletters.length,
              filters,
              responseData: response.data,
              newsletters,
            });

            set({ loading: false });
            return newsletters;
          } catch (error: any) {
            console.error('❌ Error obteniendo newsletters:', {
              error,
              errorMessage: error.response?.data?.message,
              errorStatus: error.response?.status,
              errorData: error.response?.data,
            });
            const errorMessage = error.response?.data?.message || 'Error al obtener newsletters';
            set({
              loading: false,
              error: errorMessage,
            });
            return [];
          }
        },

        findNewsletterById: async (id: string) => {
          try {
            console.log('🔄 findNewsletterById called:', { id });
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.get(endpoints.newsletter.findById(id));

            console.log('✅ Newsletter obtenido exitosamente:', {
              responseStatus: response.status,
              responseData: response.data,
            });

            set({ loading: false });
            return response.data;
          } catch (error: any) {
            console.error('❌ Error obteniendo newsletter:', {
              error,
              errorMessage: error.response?.data?.message,
              errorStatus: error.response?.status,
              errorData: error.response?.data,
            });
            const errorMessage = error.response?.data?.message || 'Error al obtener el newsletter';
            set({
              loading: false,
              error: errorMessage,
            });
            return null;
          }
        },

        approveNewsletter: async (id: string) => {
          try {
            console.log('🔄 approveNewsletter called:', { id });
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            await axiosInstance.patch(endpoints.newsletter.review(id), { approved: true });

            console.log('✅ Newsletter aprobado exitosamente');
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('❌ Error aprobando newsletter:', error);
            const errorMessage = error.response?.data?.message || 'Error al aprobar el newsletter';
            set({ loading: false, error: errorMessage });
            return false;
          }
        },

        rejectNewsletter: async (id: string) => {
          try {
            console.log('🔄 rejectNewsletter called:', { id });
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            await axiosInstance.patch(endpoints.newsletter.review(id), { approved: false });

            console.log('✅ Newsletter rechazado exitosamente');
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('❌ Error rechazando newsletter:', error);
            const errorMessage = error.response?.data?.message || 'Error al rechazar el newsletter';
            set({ loading: false, error: errorMessage });
            return false;
          }
        },

        sendNewsletterNow: async (id: string, subject: string, content: string) => {
          try {
            console.log('🔄 sendNewsletterNow called:', { id, subject });
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            await axiosInstance.post(endpoints.newsletter.send(id), { subject, content });

            console.log('✅ Newsletter enviado exitosamente');
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('❌ Error enviando newsletter:', error);
            const errorMessage = error.response?.data?.message || 'Error al enviar el newsletter';
            set({ loading: false, error: errorMessage });
            return false;
          }
        },

        scheduleNewsletter: async (
          id: string,
          scheduleDate: string,
          subject: string,
          content: string
        ) => {
          try {
            console.log('🔄 scheduleNewsletter called:', { id, scheduleDate, subject });
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            await axiosInstance.post(endpoints.newsletter.schedule(id), {
              scheduleDate,
              subject,
              content,
            });

            console.log('✅ Newsletter programado exitosamente');
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('❌ Error programando newsletter:', error);
            const errorMessage =
              error.response?.data?.message || 'Error al programar el newsletter';
            set({ loading: false, error: errorMessage });
            return false;
          }
        },

        unscheduleNewsletter: async (
          id: string,
          subject: string,
          content: string,
          objData: string,
          scheduleDate: string
        ) => {
          try {
            console.log('🔄 unscheduleNewsletter called:', { id });
            set({ loading: true, error: null });
            const axiosInstance = createAxiosInstance();

            await axiosInstance.patch(endpoints.newsletter.unschedule(id), {
              subject,
              content,
              objData,
              scheduleDate,
            });

            console.log('✅ Newsletter desprogramado exitosamente');
            set({ loading: false });
            return true;
          } catch (error: any) {
            console.error('❌ Error desprogramando newsletter:', error);
            const errorMessage =
              error.response?.data?.message || 'Error al desprogramar el newsletter';
            set({ loading: false, error: errorMessage });
            return false;
          }
        },

        // Metadata operations
        loadContentTypes: async () => {
          try {
            set({ loadingMetadata: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.get<ContentType[]>(endpoints.contentType.findAll);

            if (response.data) {
              set({
                contentTypes: response.data,
                loadingMetadata: false,
              });
              return response.data;
            }

            set({ loadingMetadata: false });
            return [];
          } catch (error: any) {
            console.error('Error cargando tipos de contenido:', error);
            const errorMessage =
              error.response?.data?.message || 'Error al cargar tipos de contenido';
            set({
              loadingMetadata: false,
              error: errorMessage,
            });
            return [];
          }
        },

        loadAudiences: async () => {
          try {
            set({ loadingMetadata: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.get<Audience[]>(endpoints.audience.findAll);

            if (response.data) {
              set({
                audiences: response.data,
                loadingMetadata: false,
              });
              return response.data;
            }

            set({ loadingMetadata: false });
            return [];
          } catch (error: any) {
            console.error('Error cargando audiencias:', error);
            const errorMessage = error.response?.data?.message || 'Error al cargar audiencias';
            set({
              loadingMetadata: false,
              error: errorMessage,
            });
            return [];
          }
        },

        loadCategories: async (contentTypeId: string) => {
          try {
            if (!contentTypeId) {
              set({ categories: [] });
              return [];
            }

            set({ loadingMetadata: true, error: null });
            const axiosInstance = createAxiosInstance();

            const response = await axiosInstance.get<Category[]>(
              `${endpoints.category.findAll}?contentTypeId=${contentTypeId}`
            );

            if (response.data) {
              set({
                categories: response.data,
                loadingMetadata: false,
              });
              return response.data;
            }

            set({ loadingMetadata: false, categories: [] });
            return [];
          } catch (error: any) {
            console.error('Error cargando categorías:', error);
            const errorMessage = error.response?.data?.message || 'Error al cargar categorías';
            set({
              loadingMetadata: false,
              error: errorMessage,
              categories: [],
            });
            return [];
          }
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

// Exportar tipos de metadata
export type {
  Audience,
  ContentType,
  Category as MetadataCategory,
  Subcategory as MetadataSubcategory,
};

// Exportar tipos para uso externo (manteniendo compatibilidad)
export type {
  Post,
  Meta,
  Author,
  Article,
  Category,
  PostStatus,
  ApiResponse,
  PostFilters,
  Subcategory,
  SendTestData,
  SendEmailData,
  UpdatePostData,
  CreatePostData,
  NewsletterFilters,
  SendNewsletterData,
} from 'src/types/post';
