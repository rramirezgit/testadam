import type { SavedNote } from 'src/types/saved-note';
import type { Newsletter, NewsletterNote } from 'src/types/newsletter';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  saveNoteToStorage,
  deleteNoteFromStorage,
  getAllNotesFromStorage,
} from 'src/utils/storage-utils';
import {
  saveNewsletterToStorage,
  deleteNewsletterFromStorage,
  getAllNewslettersFromStorage,
} from 'src/utils/newsletter-utils';

interface StoreState {
  notes: SavedNote[];
  newsletters: Newsletter[];
  selectedNotes: NewsletterNote[];
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
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      notes: [],
      newsletters: [],
      selectedNotes: [],

      loadNotes: () => {
        const notes = getAllNotesFromStorage();
        set({ notes });
      },

      addNote: (note: SavedNote) => {
        saveNoteToStorage(note);
        set((state) => ({ notes: [...state.notes, note] }));
      },

      updateNote: (note: SavedNote) => {
        saveNoteToStorage(note);
        set((state) => ({
          notes: state.notes.map((n) => (n.id === note.id ? note : n)),
          // Also update the note in selectedNotes if it exists
          selectedNotes: state.selectedNotes.map((n) =>
            n.noteId === note.id ? { ...n, noteData: note } : n
          ),
        }));
      },

      deleteNote: (noteId: string) => {
        deleteNoteFromStorage(noteId);
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
          // Also remove from selectedNotes if it exists
          selectedNotes: state.selectedNotes.filter((n) => n.noteId !== noteId),
        }));
      },

      loadNewsletters: () => {
        const newsletters = getAllNewslettersFromStorage();
        set({ newsletters });
      },

      addNewsletter: (newsletter: Newsletter) => {
        saveNewsletterToStorage(newsletter);
        set((state) => ({ newsletters: [...state.newsletters, newsletter] }));
      },

      updateNewsletter: (newsletter: Newsletter) => {
        saveNewsletterToStorage(newsletter);
        set((state) => ({
          newsletters: state.newsletters.map((n) => (n.id === newsletter.id ? newsletter : n)),
        }));
      },

      deleteNewsletter: (newsletterId: string) => {
        deleteNewsletterFromStorage(newsletterId);
        set((state) => ({
          newsletters: state.newsletters.filter((n) => n.id !== newsletterId),
        }));
      },

      setSelectedNotes: (notes: NewsletterNote[]) => {
        set({ selectedNotes: notes });
      },

      addSelectedNote: (note: NewsletterNote) => {
        set((state) => ({
          selectedNotes: [...state.selectedNotes, note],
        }));
      },

      removeSelectedNote: (noteId: string) => {
        set((state) => ({
          selectedNotes: state.selectedNotes.filter((n) => n.noteId !== noteId),
        }));
      },
    }),
    {
      name: 'email-editor-storage',
    }
  )
);
