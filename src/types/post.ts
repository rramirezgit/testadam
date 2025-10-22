// Tipos centralizados para Posts/Notes

// Estados posibles de una nota/post
export const POST_STATUS = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

// Transiciones permitidas entre estados
export const ALLOWED_STATUS_TRANSITIONS: Record<PostStatus, PostStatus[]> = {
  [POST_STATUS.DRAFT]: [POST_STATUS.REVIEW],
  [POST_STATUS.REVIEW]: [POST_STATUS.APPROVED, POST_STATUS.DRAFT],
  [POST_STATUS.APPROVED]: [POST_STATUS.PUBLISHED, POST_STATUS.REJECTED],
  [POST_STATUS.PUBLISHED]: [
    POST_STATUS.DRAFT,
    POST_STATUS.REVIEW,
    POST_STATUS.APPROVED,
    POST_STATUS.REJECTED,
  ],
  [POST_STATUS.REJECTED]: [POST_STATUS.DRAFT, POST_STATUS.REVIEW],
};

// Función helper para verificar si una transición es válida
export const isValidStatusTransition = (
  currentStatus: PostStatus,
  targetStatus: PostStatus
): boolean => ALLOWED_STATUS_TRANSITIONS[currentStatus]?.includes(targetStatus) || false;

// Función helper para verificar si un estado está disponible
export const isStatusDisabled = (
  currentStatus: PostStatus | null,
  targetStatus: PostStatus,
  hasNoteId: boolean
): boolean => {
  // Si no hay ID de nota, solo permitir DRAFT
  if (!hasNoteId) {
    return targetStatus !== POST_STATUS.DRAFT;
  }

  // Si no hay estado actual, permitir todos
  if (!currentStatus) return false;

  // Verificar si la transición es válida
  return !isValidStatusTransition(currentStatus, targetStatus);
};

// Autor
export interface Author {
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

// Categoría
export interface Category {
  id: string;
  name: string;
}

// Subcategoría
export interface Subcategory {
  id: string;
  name: string;
}

// Post completo
export interface Post {
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
  status: PostStatus;
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

// Artículo simplificado para listas
export interface Article {
  id: string;
  title: string;
  coverImageUrl: string;
  publishOnAdac: boolean;
  origin: string;
  status: PostStatus;
  highlight: boolean;
  newsletterId: string;
  createdAt: string;
}

// Metadatos de paginación
export interface Meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}

// Respuesta de la API
export interface ApiResponse {
  data: Article[];
  meta: Meta;
}

// Datos para actualizar un post
export interface UpdatePostData {
  title?: string;
  objData?: string;
  objDataWeb?: string;
  configPost?: string;
  coverImageUrl?: string;
  highlight?: boolean;
  content?: string;
  description?: string;
  status?: PostStatus;
  publishOnAdac?: boolean;
  // Campos de metadata (opcionales en update)
  contentTypeId?: string;
  audienceId?: string;
  categoryId?: string;
  subcategoryId?: string;
}

// Datos para crear un post
export interface CreatePostData {
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

// Filtros para búsqueda de posts
export interface PostFilters {
  page?: number;
  perPage?: number;
  status?: PostStatus;
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

// Datos para envío de test
export interface SendTestData {
  subject: string;
  content: string;
  approverEmails?: string[];
  reviewerEmails?: string[];
}

export interface SendEmailData {
  subject: string;
  content: string;
  emails: string[];
}

// Datos para envío de newsletter
export interface SendNewsletterData {
  subject: string;
  content: string;
  approverEmails: string[];
}

// Datos de nota para el editor
export interface NoteData {
  currentNoteId: string | null;
  noteTitle: string;
  noteDescription: string;
  noteCoverImageUrl: string;
  noteStatus: PostStatus;
  isEditingExistingNote: boolean;
  openSaveDialog: boolean;
}

// Datos para cargar una nota
export interface LoadNoteData {
  title?: string;
  description?: string;
  coverImageUrl?: string;
  status?: PostStatus;
  contentTypeId?: string;
  audienceId?: string;
  categoryId?: string;
  subcategoryId?: string;
  highlight?: boolean;
}
