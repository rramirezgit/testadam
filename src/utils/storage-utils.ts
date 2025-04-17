import type { SavedNote } from 'src/types/saved-note';

const STORAGE_KEY = 'email_editor_notes';

export const saveNoteToStorage = (note: SavedNote): void => {
  try {
    // Get existing notes
    const existingNotesJson = localStorage.getItem(STORAGE_KEY);
    const existingNotes: SavedNote[] = existingNotesJson ? JSON.parse(existingNotesJson) : [];

    // Check if note already exists (update) or is new (add)
    const noteIndex = existingNotes.findIndex((n) => n.id === note.id);

    if (noteIndex >= 0) {
      // Update existing note
      existingNotes[noteIndex] = note;
    } else {
      // Add new note
      existingNotes.push(note);
    }

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingNotes));
  } catch (error) {
    console.error('Error saving note to localStorage:', error);
  }
};

export const getAllNotesFromStorage = (): SavedNote[] => {
  try {
    const notesJson = localStorage.getItem(STORAGE_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error('Error retrieving notes from localStorage:', error);
    return [];
  }
};

export const getNoteFromStorage = (noteId: string): SavedNote | null => {
  try {
    const notes = getAllNotesFromStorage();
    return notes.find((note) => note.id === noteId) || null;
  } catch (error) {
    console.error('Error retrieving note from localStorage:', error);
    return null;
  }
};

export const deleteNoteFromStorage = (noteId: string): void => {
  try {
    const notes = getAllNotesFromStorage();
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Error deleting note from localStorage:', error);
  }
};
