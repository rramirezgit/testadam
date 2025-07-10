/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from 'react';

import usePostStore, {
  type PostFilters,
  type UpdatePostData,
  type CreatePostData,
} from 'src/store/PostStore';

/**
 * Hook personalizado para manejar posts con funcionalidades comunes
 */
export const usePosts = (initialFilters?: PostFilters) => {
  const {
    loading,
    posts,
    currentPost,
    meta,
    error,
    findAll,
    findById,
    create,
    update,
    delete: deletePost,
    clearCurrentPost,
    clearPosts,
    refreshPosts,
    setError,
  } = usePostStore();

  // Ref para almacenar los filtros anteriores y detectar cambios
  const prevFiltersRef = useRef<PostFilters | undefined>(initialFilters);

  // Función para comparar filtros profundamente
  const areFiltersEqual = (filters1?: PostFilters, filters2?: PostFilters) => {
    if (!filters1 && !filters2) return true;
    if (!filters1 || !filters2) return false;

    const keys1 = Object.keys(filters1);
    const keys2 = Object.keys(filters2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every(
      (key) => filters1[key as keyof PostFilters] === filters2[key as keyof PostFilters]
    );
  };

  // Cargar posts automáticamente cuando cambien los filtros
  useEffect(() => {
    const hasFiltersChanged = !areFiltersEqual(prevFiltersRef.current, initialFilters);

    if (hasFiltersChanged || posts.length === 0) {
      console.log('🔄 Cargando posts con filtros:', initialFilters);
      findAll(initialFilters);
      prevFiltersRef.current = initialFilters;
    }
  }, [
    findAll,
    initialFilters?.status,
    initialFilters?.page,
    initialFilters?.perPage,
    initialFilters?.title,
    initialFilters?.search,
    initialFilters?.origin,
    initialFilters?.highlight,
    initialFilters?.startDate,
    initialFilters?.endDate,
    initialFilters?.usedInNewsletter,
    initialFilters?.orderBy,
    initialFilters?.newsletterId,
    initialFilters?.publishOnAdac,
  ]);

  const createPost = async (data: CreatePostData) => {
    const result = await create(data);
    if (result) {
      // Opcional: Refrescar la lista después de crear
      await refreshPosts();
    }
    return result;
  };

  const updatePost = async (id: string, data: UpdatePostData) => {
    const result = await update(id, data);
    return result;
  };

  const removePost = async (id: string) => {
    const result = await deletePost(id);
    if (result) {
      // Opcional: Mensaje de éxito
      console.log('Post eliminado correctamente');
    }
    return result;
  };

  const loadPost = async (id: string) => {
    const result = await findById(id);
    return result;
  };

  const searchPosts = async (searchTerm: string, additionalFilters?: PostFilters) => {
    const filters = {
      search: searchTerm,
      ...additionalFilters,
    };
    return await findAll(filters);
  };

  const loadMorePosts = async (page: number) => {
    const filters = {
      ...initialFilters,
      page,
    };
    return await findAll(filters);
  };

  // Función para filtrar posts por status
  const filterByStatus = async (status: string) => {
    const filters = {
      ...initialFilters,
      status,
    };
    return await findAll(filters as PostFilters);
  };

  // Función para filtrar posts destacados
  const loadHighlightedPosts = async () => {
    const filters = {
      ...initialFilters,
      highlight: true,
    };
    return await findAll(filters);
  };

  return {
    // Estado
    loading,
    posts,
    currentPost,
    meta,
    error,

    // Acciones básicas
    createPost,
    updatePost,
    removePost,
    loadPost,

    // Acciones de búsqueda y filtrado
    searchPosts,
    loadMorePosts,
    filterByStatus,
    loadHighlightedPosts,

    // Acciones de utilidad
    clearCurrentPost,
    clearPosts,
    refreshPosts,
    setError,

    // Información de paginación
    hasNextPage: meta ? meta.currentPage < meta.lastPage : false,
    hasPrevPage: meta ? meta.currentPage > 1 : false,
    totalPages: meta?.lastPage || 0,
    currentPage: meta?.currentPage || 1,
    totalPosts: meta?.total || 0,
  };
};

/**
 * Hook específico para cargar un post individual
 */
export const usePost = (postId?: string) => {
  const {
    loading,
    currentPost,
    error,
    findById,
    update,
    delete: deletePost,
    clearCurrentPost,
  } = usePostStore();

  useEffect(() => {
    if (postId) {
      findById(postId);
    }

    return () => {
      // Limpiar al desmontar
      clearCurrentPost();
    };
  }, [postId, findById, clearCurrentPost]);

  const updateCurrentPost = async (data: UpdatePostData) => {
    if (!currentPost) return null;
    return await update(currentPost.id, data);
  };

  const deleteCurrentPost = async () => {
    if (!currentPost) return false;
    return await deletePost(currentPost.id);
  };

  return {
    loading,
    post: currentPost,
    error,
    updatePost: updateCurrentPost,
    deletePost: deleteCurrentPost,
    clearPost: clearCurrentPost,
  };
};

export default usePosts;
