import type { SavedNote } from 'src/types/saved-note';
import type { SavedEducacion } from 'src/types/saved-educacion';
import type { Newsletter, NewsletterNote } from 'src/types/newsletter';

import { create } from 'zustand';

interface StoreState {
  notes: SavedNote[];
  newsletters: Newsletter[];
  selectedNotes: NewsletterNote[];
  educaciones: SavedEducacion[];
  loadNotes: () => void;
  addNote: (note: SavedNote) => void;
  updateNote: (note: SavedNote) => void;
  deleteNote: (noteId: string) => void;
  loadNewsletters: () => void;
  addNewsletter: (newsletter: Newsletter) => void;
  updateNewsletter: (newsletter: Newsletter) => void;
  deleteNewsletter: (newsletterId: string) => void;
  setSelectedNotes: (notes: NewsletterNote[]) => void;
  addSelectedNote: (note: NewsletterNote) => void;
  removeSelectedNote: (noteId: string) => void;
  loadEducaciones: () => void;
  addEducacion: (educacion: SavedEducacion) => void;
  updateEducacion: (educacion: SavedEducacion) => void;
  deleteEducacion: (educacionId: string) => void;
}

export const useStore = create<StoreState>()((set, get) => ({
  // Estados iniciales en memoria únicamente
  notes: [],
  newsletters: [],
  selectedNotes: [],
  educaciones: [],

  // ⚡ Funciones para notas (solo en memoria)
  loadNotes: () => {
    // No hacer nada - las notas solo existen en memoria durante la sesión
    console.log('📝 Notas cargadas desde memoria');
  },

  addNote: (note: SavedNote) => {
    set((state) => ({
      notes: [...state.notes, note],
    }));
    console.log('✅ Nota agregada a memoria:', note.title);
  },

  updateNote: (note: SavedNote) => {
    set((state) => ({
      notes: state.notes.map((n) => (n.id === note.id ? note : n)),
      // También actualizar en selectedNotes si existe
      selectedNotes: state.selectedNotes.map((n) =>
        n.noteId === note.id ? { ...n, noteData: note } : n
      ),
    }));
    console.log('🔄 Nota actualizada en memoria:', note.title);
  },

  deleteNote: (noteId: string) => {
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== noteId),
      // También remover de selectedNotes si existe
      selectedNotes: state.selectedNotes.filter((n) => n.noteId !== noteId),
    }));
    console.log('🗑️ Nota eliminada de memoria:', noteId);
  },

  // ⚡ Funciones para newsletters (solo en memoria - el backend se maneja directamente desde PostStore)
  loadNewsletters: () => {
    // No hacer nada - los newsletters se cargan directamente desde PostStore
    console.log('📰 Newsletters cargados desde PostStore');
  },

  addNewsletter: (newsletter: Newsletter) => {
    set((state) => ({ newsletters: [...state.newsletters, newsletter] }));
    console.log('✅ Newsletter agregado a memoria:', newsletter.subject);
  },

  updateNewsletter: (newsletter: Newsletter) => {
    set((state) => ({
      newsletters: state.newsletters.map((n) => (n.id === newsletter.id ? newsletter : n)),
    }));
    console.log('🔄 Newsletter actualizado en memoria:', newsletter.subject);
  },

  deleteNewsletter: (newsletterId: string) => {
    set((state) => ({
      newsletters: state.newsletters.filter((n) => n.id !== newsletterId),
    }));
    console.log('🗑️ Newsletter eliminado de memoria:', newsletterId);
  },

  // ⚡ Funciones para notas seleccionadas (solo en memoria)
  setSelectedNotes: (notes: NewsletterNote[]) => {
    set({ selectedNotes: notes });
    console.log('📋 Notas seleccionadas actualizadas:', notes.length);
  },

  addSelectedNote: (note: NewsletterNote) => {
    set((state) => {
      // Evitar duplicados
      const exists = state.selectedNotes.some((n) => n.noteId === note.noteId);
      if (exists) {
        console.log('⚠️ Nota ya existe en seleccionadas:', note.noteId);
        return state;
      }
      return {
        selectedNotes: [...state.selectedNotes, note],
      };
    });
    console.log('✅ Nota agregada a seleccionadas:', note.noteId);
  },

  removeSelectedNote: (noteId: string) => {
    set((state) => ({
      selectedNotes: state.selectedNotes.filter((n) => n.noteId !== noteId),
    }));
    console.log('🗑️ Nota removida de seleccionadas:', noteId);
  },

  // ⚡ Funciones para educaciones (solo en memoria)
  loadEducaciones: () => {
    // No hacer nada - las educaciones solo existen en memoria durante la sesión
    console.log('🎓 Educaciones cargadas desde memoria');
  },

  addEducacion: (educacion: SavedEducacion) => {
    set((state) => ({ educaciones: [...state.educaciones, educacion] }));
    console.log('✅ Educación agregada a memoria:', educacion.title);
  },

  updateEducacion: (educacion: SavedEducacion) => {
    set((state) => ({
      educaciones: state.educaciones.map((e) => (e.id === educacion.id ? educacion : e)),
    }));
    console.log('🔄 Educación actualizada en memoria:', educacion.title);
  },

  deleteEducacion: (educacionId: string) => {
    set((state) => ({
      educaciones: state.educaciones.filter((e) => e.id !== educacionId),
    }));
    console.log('🗑️ Educación eliminada de memoria:', educacionId);
  },
}));
