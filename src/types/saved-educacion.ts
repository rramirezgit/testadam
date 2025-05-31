import type { Educacion } from './educacion';

export interface SavedEducacion {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  dateCreated: string;
  dateModified: string;
  autor?: string;
  thumbnail?: string;
  educacion: Educacion;
}
