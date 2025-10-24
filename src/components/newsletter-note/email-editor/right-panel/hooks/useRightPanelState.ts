import { useState, useEffect } from 'react';

import { useNoteMetadata } from '../../hooks/useNoteMetadata';

interface UseRightPanelStateProps {
  noteTitle: string;
  noteDescription: string;
  newsletterTitle: string;
  newsletterDescription: string;
  setNoteTitle: (title: string) => void;
  setNoteDescription: (description: string) => void;
  onNewsletterTitleChange: (title: string) => void;
  onNewsletterDescriptionChange: (description: string) => void;
  contentTypeId: string;
  categoryId: string;
  currentNoteId?: string;
  setCategoryId: (id: string) => void;
  setSubcategoryId: (id: string) => void;
}

export function useRightPanelState({
  noteTitle,
  noteDescription,
  newsletterTitle,
  newsletterDescription,
  setNoteTitle,
  setNoteDescription,
  onNewsletterTitleChange,
  onNewsletterDescriptionChange,
  contentTypeId,
  categoryId,
  currentNoteId,
  setCategoryId,
  setSubcategoryId,
}: UseRightPanelStateProps) {
  // Estados locales para input inmediato (sin lag)
  const [localTitle, setLocalTitle] = useState(noteTitle);
  const [localDescription, setLocalDescription] = useState(noteDescription);

  // Estados locales para newsletter (debouncing)
  const [localNewsletterTitle, setLocalNewsletterTitle] = useState(newsletterTitle);
  const [localNewsletterDescription, setLocalNewsletterDescription] =
    useState(newsletterDescription);

  // Estado para los tabs del contenedor
  const [containerTab, setContainerTab] = useState(0);

  // Estado para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Hook para metadata de la nota
  const {
    contentTypes,
    audiences,
    categories,
    loading: loadingMetadata,
    loadCategories,
  } = useNoteMetadata();

  // Sincronizar estados locales cuando cambien las props externas
  useEffect(() => {
    setLocalTitle(noteTitle);
  }, [noteTitle]);

  useEffect(() => {
    setLocalDescription(noteDescription);
  }, [noteDescription]);

  useEffect(() => {
    setLocalNewsletterTitle(newsletterTitle);
  }, [newsletterTitle]);

  useEffect(() => {
    setLocalNewsletterDescription(newsletterDescription);
  }, [newsletterDescription]);

  // Debouncing para título - actualizar estado global después de 300ms sin cambios
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localTitle !== noteTitle) {
        setNoteTitle(localTitle);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTitle]);

  // Debouncing para descripción - actualizar estado global después de 300ms sin cambios
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localDescription !== noteDescription) {
        setNoteDescription(localDescription);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDescription]);

  // Debouncing para título de newsletter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localNewsletterTitle !== newsletterTitle) {
        onNewsletterTitleChange(localNewsletterTitle);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localNewsletterTitle]);

  // Debouncing para descripción de newsletter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localNewsletterDescription !== newsletterDescription) {
        onNewsletterDescriptionChange(localNewsletterDescription);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localNewsletterDescription]);

  // Cargar categorías cuando cambie el content type
  useEffect(() => {
    if (contentTypeId) {
      console.log('🔄 Content type cambió, cargando categorías para:', contentTypeId);
      loadCategories(contentTypeId);

      // Solo resetear categoría y subcategoría si NO hay una nota cargada
      // Si hay currentNoteId, significa que estamos cargando una nota existente
      // y las categorías se setearán desde main.tsx después de cargar
      if (!currentNoteId) {
        console.log('🧹 Reseteando categorías (nota nueva)');
        setCategoryId('');
        setSubcategoryId('');
      } else {
        console.log('📌 Manteniendo categorías (nota existente, se cargarán después)');
      }
    } else {
      // Si no hay content type, limpiar categorías
      console.log('🧹 Content type vacío, limpiando categorías');
      setCategoryId('');
      setSubcategoryId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentTypeId]); // Solo depender de contentTypeId

  // Resetear subcategoría cuando cambie la categoría (solo para notas nuevas)
  useEffect(() => {
    if (categoryId) {
      console.log('🔄 Categoría cambió a:', categoryId);

      // Solo resetear subcategoría si NO hay una nota cargada
      // Si hay currentNoteId, la subcategoría se cargará desde main.tsx
      if (!currentNoteId) {
        console.log('🧹 Reseteando subcategoría (nota nueva)');
        setSubcategoryId('');
      } else {
        console.log('📌 Manteniendo subcategoría (nota existente, se cargará después)');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]); // Solo depender de categoryId

  // Obtener subcategorías de la categoría seleccionada
  const selectedCategory = categories.find((cat) => cat.id === categoryId);
  const subcategories = selectedCategory?.subcategories || [];

  return {
    localTitle,
    setLocalTitle,
    localDescription,
    setLocalDescription,
    localNewsletterTitle,
    setLocalNewsletterTitle,
    localNewsletterDescription,
    setLocalNewsletterDescription,
    containerTab,
    setContainerTab,
    openDeleteDialog,
    setOpenDeleteDialog,
    contentTypes,
    audiences,
    categories,
    loadingMetadata,
    subcategories,
  };
}
