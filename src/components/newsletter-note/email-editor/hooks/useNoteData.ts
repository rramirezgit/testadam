import { useState, useCallback } from 'react';

export interface NoteData {
  currentNoteId: string | null;
  noteTitle: string;
  noteDescription: string;
  noteCoverImageUrl: string;
  noteStatus: 'draft' | 'published' | 'archived';
  isEditingExistingNote: boolean;
  openSaveDialog: boolean;
}

export interface UseNoteDataHook extends NoteData {
  setCurrentNoteId: (id: string | null) => void;
  setNoteTitle: (title: string) => void;
  setNoteDescription: (description: string) => void;
  setNoteCoverImageUrl: (url: string) => void;
  setNoteStatus: (status: 'draft' | 'published' | 'archived') => void;
  setIsEditingExistingNote: (editing: boolean) => void;
  setOpenSaveDialog: (open: boolean) => void;
  loadNoteData: (data: {
    title?: string;
    description?: string;
    coverImageUrl?: string;
    status?: 'draft' | 'published' | 'archived';
  }) => void;
}

export const useNoteData = (): UseNoteDataHook => {
  // Estados individuales
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteDescription, setNoteDescription] = useState<string>('');
  const [noteCoverImageUrl, setNoteCoverImageUrl] = useState<string>('');
  const [noteStatus, setNoteStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [isEditingExistingNote, setIsEditingExistingNote] = useState<boolean>(false);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);

  // Función para cargar datos de una nota existente
  const loadNoteData = useCallback(
    (data: {
      title?: string;
      description?: string;
      coverImageUrl?: string;
      status?: 'draft' | 'published' | 'archived';
    }) => {
      if (data.title !== undefined) setNoteTitle(data.title);
      if (data.description !== undefined) setNoteDescription(data.description);
      if (data.coverImageUrl !== undefined) setNoteCoverImageUrl(data.coverImageUrl);
      if (data.status !== undefined) setNoteStatus(data.status);
    },
    []
  );

  // Memoizar todas las funciones setter para evitar re-renders
  const memoizedSetCurrentNoteId = useCallback(setCurrentNoteId, []);
  const memoizedSetNoteTitle = useCallback(setNoteTitle, []);
  const memoizedSetNoteDescription = useCallback(setNoteDescription, []);
  const memoizedSetNoteCoverImageUrl = useCallback(setNoteCoverImageUrl, []);
  const memoizedSetNoteStatus = useCallback(setNoteStatus, []);
  const memoizedSetIsEditingExistingNote = useCallback(setIsEditingExistingNote, []);
  const memoizedSetOpenSaveDialog = useCallback(setOpenSaveDialog, []);

  return {
    // Estados
    currentNoteId,
    noteTitle,
    noteDescription,
    noteCoverImageUrl,
    noteStatus,
    isEditingExistingNote,
    openSaveDialog,

    // Funciones memoizadas
    setCurrentNoteId: memoizedSetCurrentNoteId,
    setNoteTitle: memoizedSetNoteTitle,
    setNoteDescription: memoizedSetNoteDescription,
    setNoteCoverImageUrl: memoizedSetNoteCoverImageUrl,
    setNoteStatus: memoizedSetNoteStatus,
    setIsEditingExistingNote: memoizedSetIsEditingExistingNote,
    setOpenSaveDialog: memoizedSetOpenSaveDialog,
    loadNoteData,
  };
};
