/* eslint-disable react-hooks/exhaustive-deps */
import type { NoteData, PostStatus, LoadNoteData } from 'src/types/post';

import { useState, useCallback } from 'react';

import usePostStore from 'src/store/PostStore';

import { POST_STATUS } from 'src/types/post';

export interface UseNoteDataHook extends NoteData {
  setCurrentNoteId: (id: string | null) => void;
  setNoteTitle: (title: string) => void;
  setNoteDescription: (description: string) => void;
  setNoteCoverImageUrl: (url: string) => void;
  setNoteStatus: (status: PostStatus) => void;
  setIsEditingExistingNote: (editing: boolean) => void;
  setOpenSaveDialog: (open: boolean) => void;
  updateStatus: (status: PostStatus) => Promise<void>;
  loadNoteData: (data: LoadNoteData) => void;
}

export const useNoteData = (): UseNoteDataHook => {
  // Hook del store
  const { updateStatus: updateStatusInStore } = usePostStore();

  // Estados individuales
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteDescription, setNoteDescription] = useState<string>('');
  const [noteCoverImageUrl, setNoteCoverImageUrl] = useState<string>('');
  const [noteStatus, setNoteStatus] = useState<PostStatus>(POST_STATUS.DRAFT);
  const [isEditingExistingNote, setIsEditingExistingNote] = useState<boolean>(false);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);

  // Función para cargar datos de una nota existente
  const loadNoteData = useCallback((data: LoadNoteData) => {
    if (data.title !== undefined) setNoteTitle(data.title);
    if (data.description !== undefined) setNoteDescription(data.description);
    if (data.coverImageUrl !== undefined) setNoteCoverImageUrl(data.coverImageUrl);
    if (data.status !== undefined) setNoteStatus(data.status);
  }, []);

  // Función para actualizar status automáticamente
  const updateStatus = useCallback(
    async (status: PostStatus) => {
      if (!currentNoteId) {
        console.warn('No hay nota seleccionada para actualizar el status');
        return;
      }

      try {
        const updatedPost = await updateStatusInStore(currentNoteId, status);
        if (updatedPost) {
          // Actualizar el estado local si la actualización fue exitosa
          setNoteStatus(status);
        }
      } catch (error) {
        console.error('Error actualizando status de la nota:', error);
        throw error;
      }
    },
    [currentNoteId, updateStatusInStore]
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
    updateStatus,
    loadNoteData,
  };
};
