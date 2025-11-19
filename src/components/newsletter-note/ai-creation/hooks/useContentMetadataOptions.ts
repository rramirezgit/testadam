import { useCallback, useEffect, useState } from 'react';

import usePostStore, {
  type MetadataCategory,
  type MetadataSubcategory,
} from 'src/store/PostStore';

type CategoryWithTree = MetadataCategory & {
  subcategories?: MetadataSubcategory[];
};

interface LoadingMap {
  [contentTypeId: string]: boolean;
}

interface CategoryMap {
  [contentTypeId: string]: CategoryWithTree[];
}

export function useContentMetadataOptions() {
  const contentTypes = usePostStore((state) => state.contentTypes);
  const loadContentTypes = usePostStore((state) => state.loadContentTypes);
  const loadCategories = usePostStore((state) => state.loadCategories);
  const loadingMetadata = usePostStore((state) => state.loadingMetadata);

  const [categoriesByContentType, setCategoriesByContentType] = useState<CategoryMap>({});
  const [loadingCategoriesMap, setLoadingCategoriesMap] = useState<LoadingMap>({});

  useEffect(() => {
    if (contentTypes.length === 0) {
      loadContentTypes();
    }
  }, [contentTypes.length, loadContentTypes]);

  const ensureCategories = useCallback(
    async (contentTypeId: string) => {
      if (!contentTypeId) {
        return [];
      }

      if (categoriesByContentType[contentTypeId]) {
        return categoriesByContentType[contentTypeId];
      }

      setLoadingCategoriesMap((prev) => ({ ...prev, [contentTypeId]: true }));
      const data = await loadCategories(contentTypeId);
      setCategoriesByContentType((prev) => ({
        ...prev,
        [contentTypeId]: (data || []) as CategoryWithTree[],
      }));
      setLoadingCategoriesMap((prev) => ({ ...prev, [contentTypeId]: false }));
      return (data || []) as CategoryWithTree[];
    },
    [categoriesByContentType, loadCategories]
  );

  const getCategories = useCallback(
    (contentTypeId: string) => categoriesByContentType[contentTypeId] || [],
    [categoriesByContentType]
  );

  const getSubcategories = useCallback(
    (contentTypeId: string, categoryId: string) => {
      const categories = categoriesByContentType[contentTypeId] || [];
      const category = categories.find((cat) => cat.id === categoryId);
      return category?.subcategories || [];
    },
    [categoriesByContentType]
  );

  const isLoadingCategories = useCallback(
    (contentTypeId: string) => Boolean(loadingCategoriesMap[contentTypeId]),
    [loadingCategoriesMap]
  );

  return {
    contentTypes,
    loadingContentTypes: loadingMetadata && contentTypes.length === 0,
    ensureCategories,
    getCategories,
    getSubcategories,
    isLoadingCategories,
  };
}

