import { useEffect } from 'react';

import usePostStore from 'src/store/PostStore';

export const useNoteMetadata = () => {
  const {
    contentTypes,
    audiences,
    categories,
    loadingMetadata: loading,
    loadContentTypes,
    loadAudiences,
    loadCategories,
    error,
  } = usePostStore();

  // Cargar datos iniciales (content types y audiences)
  useEffect(() => {
    if (contentTypes.length === 0) {
      loadContentTypes();
    }
    if (audiences.length === 0) {
      loadAudiences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo cargar al montar el componente

  return {
    contentTypes,
    audiences,
    categories,
    loading,
    error,
    loadCategories,
  };
};
