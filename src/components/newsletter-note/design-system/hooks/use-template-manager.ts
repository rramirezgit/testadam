import { useMemo, useState, useCallback } from 'react';

import {
  headerTemplates,
  footerTemplates,
  componentTemplates,
  templateCategories,
} from '../data/templates';

import type {
  HeaderTemplate,
  FooterTemplate,
  TemplateCategory,
  ComponentTemplate,
  UseTemplateManagerReturn,
} from '../types';

// ============================================================================
// USE TEMPLATE MANAGER HOOK - Newsletter Design System
// ============================================================================

/**
 * Hook para gestionar templates del design system
 * Incluye funciones para filtrar, buscar, aplicar y crear templates personalizados
 */
export const useTemplateManager = (): UseTemplateManagerReturn => {
  // Estado local para templates personalizados
  const [customTemplates, setCustomTemplates] = useState<{
    headers: HeaderTemplate[];
    footers: FooterTemplate[];
    components: ComponentTemplate[];
  }>({
    headers: [],
    footers: [],
    components: [],
  });

  // Estado para filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');

  // Combinar templates predefinidos con personalizados
  const allHeaderTemplates = useMemo(
    () => [...headerTemplates, ...customTemplates.headers],
    [customTemplates.headers]
  );

  const allFooterTemplates = useMemo(
    () => [...footerTemplates, ...customTemplates.footers],
    [customTemplates.footers]
  );

  const allComponentTemplates = useMemo(
    () => [...componentTemplates, ...customTemplates.components],
    [customTemplates.components]
  );

  // Función para obtener templates por categoría
  const getTemplatesByCategoryAndType = useCallback(
    (
      category: TemplateCategory,
      type?: 'header' | 'footer' | 'component'
    ): (HeaderTemplate | FooterTemplate | ComponentTemplate)[] => {
      let templates: (HeaderTemplate | FooterTemplate | ComponentTemplate)[] = [];

      if (!type || type === 'header') {
        templates = [...templates, ...allHeaderTemplates.filter((t) => t.category === category)];
      }

      if (!type || type === 'footer') {
        templates = [...templates, ...allFooterTemplates.filter((t) => t.category === category)];
      }

      if (!type || type === 'component') {
        templates = [...templates, ...allComponentTemplates.filter((t) => t.category === category)];
      }

      return templates;
    },
    [allHeaderTemplates, allFooterTemplates, allComponentTemplates]
  );

  // Función para buscar templates
  const searchAllTemplates = useCallback(
    (
      query: string,
      type?: 'header' | 'footer' | 'component'
    ): (HeaderTemplate | FooterTemplate | ComponentTemplate)[] => {
      const lowerQuery = query.toLowerCase();
      let allTemplates: (HeaderTemplate | FooterTemplate | ComponentTemplate)[] = [];

      if (!type || type === 'header') allTemplates = [...allTemplates, ...allHeaderTemplates];
      if (!type || type === 'footer') allTemplates = [...allTemplates, ...allFooterTemplates];
      if (!type || type === 'component') allTemplates = [...allTemplates, ...allComponentTemplates];

      return allTemplates.filter((template) => {
        const searchInName = template.name.toLowerCase().includes(lowerQuery);
        const searchInDescription = template.description.toLowerCase().includes(lowerQuery);

        // Check tags based on template type
        let searchInTags = false;
        if ('tags' in template) {
          searchInTags = template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
        }

        return searchInName || searchInDescription || searchInTags;
      });
    },
    [allHeaderTemplates, allFooterTemplates, allComponentTemplates]
  );

  // Función para obtener templates filtrados
  const getFilteredTemplates = useCallback(
    (type?: 'header' | 'footer' | 'component') => {
      let templates: (HeaderTemplate | FooterTemplate | ComponentTemplate)[] = [];

      // Aplicar filtro de categoría
      if (selectedCategory === 'all') {
        if (!type || type === 'header') templates = [...templates, ...allHeaderTemplates];
        if (!type || type === 'footer') templates = [...templates, ...allFooterTemplates];
        if (!type || type === 'component') templates = [...templates, ...allComponentTemplates];
      } else {
        templates = getTemplatesByCategoryAndType(selectedCategory, type);
      }

      // Aplicar búsqueda si hay query
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        templates = templates.filter((template) => {
          const searchInName = template.name.toLowerCase().includes(lowerQuery);
          const searchInDescription = template.description.toLowerCase().includes(lowerQuery);

          let searchInTags = false;
          if ('tags' in template) {
            searchInTags = template.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
          }

          return searchInName || searchInDescription || searchInTags;
        });
      }

      return templates;
    },
    [
      selectedCategory,
      searchQuery,
      allHeaderTemplates,
      allFooterTemplates,
      allComponentTemplates,
      getTemplatesByCategoryAndType,
    ]
  );

  // Función para crear template personalizado
  const createCustomTemplate = useCallback(
    (
      template: Partial<HeaderTemplate | FooterTemplate | ComponentTemplate>,
      type: 'header' | 'footer' | 'component'
    ) => {
      const newTemplate = {
        id: `custom_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: template.name || `Custom ${type}`,
        category: template.category || 'modern',
        preview: template.preview || '/assets/templates/custom-preview.jpg',
        description: template.description || `Custom ${type} template`,
        isPremium: false,
        ...template,
      } as HeaderTemplate | FooterTemplate | ComponentTemplate;

      setCustomTemplates((prev) => ({
        ...prev,
        [type === 'header' ? 'headers' : type === 'footer' ? 'footers' : 'components']: [
          ...(type === 'header'
            ? prev.headers
            : type === 'footer'
              ? prev.footers
              : prev.components),
          newTemplate,
        ],
      }));

      return newTemplate;
    },
    []
  );

  // Función para eliminar template personalizado
  const deleteCustomTemplate = useCallback(
    (id: string, type: 'header' | 'footer' | 'component') => {
      setCustomTemplates((prev) => ({
        ...prev,
        [type === 'header' ? 'headers' : type === 'footer' ? 'footers' : 'components']: (type ===
        'header'
          ? prev.headers
          : type === 'footer'
            ? prev.footers
            : prev.components
        ).filter((template) => template.id !== id),
      }));
    },
    []
  );

  // Función para duplicar template
  const duplicateTemplate = useCallback(
    (
      template: HeaderTemplate | FooterTemplate | ComponentTemplate,
      type: 'header' | 'footer' | 'component'
    ) => {
      const duplicatedTemplate = {
        ...template,
        id: `duplicate_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${template.name} (Copy)`,
        isPremium: false,
      };

      return createCustomTemplate(duplicatedTemplate, type);
    },
    [createCustomTemplate]
  );

  // Función para exportar templates personalizados
  const exportCustomTemplates = useCallback(() => {
    const exportData = {
      headers: customTemplates.headers,
      footers: customTemplates.footers,
      components: customTemplates.components,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    return JSON.stringify(exportData, null, 2);
  }, [customTemplates]);

  // Función para importar templates personalizados
  const importCustomTemplates = useCallback((jsonData: string) => {
    try {
      const importData = JSON.parse(jsonData);

      if (importData.headers || importData.footers || importData.components) {
        setCustomTemplates({
          headers: importData.headers || [],
          footers: importData.footers || [],
          components: importData.components || [],
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error importing templates:', error);
      return false;
    }
  }, []);

  // Funciones de conveniencia para obtener templates por tipo
  const getHeaderTemplates = useCallback(
    () => getFilteredTemplates('header') as HeaderTemplate[],
    [getFilteredTemplates]
  );
  const getFooterTemplates = useCallback(
    () => getFilteredTemplates('footer') as FooterTemplate[],
    [getFilteredTemplates]
  );
  const getComponentTemplates = useCallback(
    () => getFilteredTemplates('component') as ComponentTemplate[],
    [getFilteredTemplates]
  );

  // Obtener templates destacados
  const getFeaturedHeaderTemplates = useCallback(
    (limit = 3) => allHeaderTemplates.slice(0, limit),
    [allHeaderTemplates]
  );

  const getFeaturedFooterTemplates = useCallback(
    (limit = 3) => allFooterTemplates.slice(0, limit),
    [allFooterTemplates]
  );

  // Estadísticas de templates
  const templateStats = useMemo(
    () => ({
      total: allHeaderTemplates.length + allFooterTemplates.length + allComponentTemplates.length,
      headers: allHeaderTemplates.length,
      footers: allFooterTemplates.length,
      components: allComponentTemplates.length,
      custom:
        customTemplates.headers.length +
        customTemplates.footers.length +
        customTemplates.components.length,
      byCategory: templateCategories.reduce(
        (acc, category) => {
          acc[category] = getTemplatesByCategoryAndType(category).length;
          return acc;
        },
        {} as Record<TemplateCategory, number>
      ),
    }),
    [
      allHeaderTemplates.length,
      allFooterTemplates.length,
      allComponentTemplates.length,
      customTemplates,
      templateCategories,
      getTemplatesByCategoryAndType,
    ]
  );

  return {
    // Templates por tipo
    headerTemplates: allHeaderTemplates,
    footerTemplates: allFooterTemplates,
    componentTemplates: allComponentTemplates,

    // Categorías disponibles
    categories: templateCategories,

    // Funciones de filtrado
    getFilteredTemplates,
    getHeaderTemplates,
    getFooterTemplates,
    getComponentTemplates,
    getTemplatesByCategory: getTemplatesByCategoryAndType,

    // Funciones de búsqueda
    searchTemplates: searchAllTemplates,

    // Estado de filtros
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,

    // Templates destacados
    getFeaturedHeaderTemplates,
    getFeaturedFooterTemplates,

    // Gestión de templates personalizados
    createCustomTemplate,
    deleteCustomTemplate: (id: string, type: 'header' | 'footer' | 'component') =>
      deleteCustomTemplate(id, type),
    duplicateTemplate,

    // Import/Export
    exportCustomTemplates,
    importCustomTemplates,

    // Estadísticas
    templateStats,

    // Templates personalizados
    customTemplates,
  };
};

export default useTemplateManager;
