// ============================================================================
// TEMPLATE UTILITIES - Newsletter Design System
// ============================================================================

import type { HeaderTemplate, FooterTemplate, TemplateCategory, ComponentTemplate } from '../types';

/**
 * Valida si un template es válido
 */
export const validateTemplate = (
  template: HeaderTemplate | FooterTemplate | ComponentTemplate
): boolean =>
  !!(template.id && template.name && template.category && template.description && template.preview);

/**
 * Valida si un header template está completo
 */
export const validateHeaderTemplate = (template: HeaderTemplate): boolean =>
  validateTemplate(template) && !!(template.template && template.template.title);

/**
 * Valida si un footer template está completo
 */
export const validateFooterTemplate = (template: FooterTemplate): boolean =>
  validateTemplate(template) && !!(template.template && template.template.companyName);

/**
 * Extrae los colores principales de un template
 */
export const extractTemplateColors = (template: HeaderTemplate | FooterTemplate): string[] => {
  const colors: string[] = [];

  if (template.template.backgroundColor) {
    colors.push(template.template.backgroundColor);
  }

  if (template.template.textColor) {
    colors.push(template.template.textColor);
  }

  if ('gradientColors' in template.template && template.template.gradientColors) {
    colors.push(...template.template.gradientColors);
  }

  return colors.filter((color, index, array) => array.indexOf(color) === index);
};

/**
 * Genera un template personalizado basado en otro template
 */
export const createCustomTemplate = <T extends HeaderTemplate | FooterTemplate>(
  baseTemplate: T,
  customizations: Partial<T['template']>,
  metadata: {
    name?: string;
    description?: string;
    category?: TemplateCategory;
  } = {}
): T =>
  ({
    ...baseTemplate,
    id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: metadata.name || `${baseTemplate.name} (Custom)`,
    description: metadata.description || `Custom version of ${baseTemplate.name}`,
    category: metadata.category || baseTemplate.category,
    isPremium: false,
    template: {
      ...baseTemplate.template,
      ...customizations,
    },
  }) as T;

/**
 * Convierte un template a CSS
 */
export const templateToCSS = (
  template: HeaderTemplate | FooterTemplate,
  selector: string = '.newsletter-template'
): string => {
  const styles: string[] = [];

  if (template.template.backgroundColor) {
    styles.push(`background-color: ${template.template.backgroundColor}`);
  }

  if (template.template.textColor) {
    styles.push(`color: ${template.template.textColor}`);
  }

  if (
    'gradientColors' in template.template &&
    template.template.showGradient &&
    template.template.gradientColors
  ) {
    const direction = template.template.gradientDirection || 0;
    const gradient = `linear-gradient(${direction}deg, ${template.template.gradientColors.join(', ')})`;
    styles.push(`background: ${gradient}`);
  }

  // Usar text-align center como default para templates de newsletter
  styles.push('text-align: center');

  return `${selector} {\n  ${styles.join(';\n  ')}\n}`;
};

/**
 * Optimiza un template para email clients
 */
export const optimizeTemplateForEmail = <T extends HeaderTemplate | FooterTemplate>(
  template: T,
  emailClient: 'outlook' | 'gmail' | 'apple-mail' | 'generic' = 'generic'
): T => {
  const optimized = { ...template };

  // Outlook no soporta gradientes, convertir a color sólido
  if (emailClient === 'outlook' && 'showGradient' in optimized.template) {
    (optimized.template as any).showGradient = false;
  }

  // Simplificar fonts para mejor compatibilidad
  if (emailClient === 'outlook' || emailClient === 'generic') {
    // Usar solo web-safe fonts
    if ('useCustomFont' in optimized.template) {
      (optimized.template as any).useCustomFont = false;
    }
  }

  return optimized;
};

/**
 * Calcula el score de calidad de un template
 */
export const calculateTemplateQuality = (
  template: HeaderTemplate | FooterTemplate | ComponentTemplate
): number => {
  let score = 0;

  // Validaciones básicas (40 puntos)
  if (template.name && template.name.length > 3) score += 10;
  if (template.description && template.description.length > 20) score += 10;
  if (template.preview && template.preview.length > 0) score += 10;
  if ('tags' in template && template.tags && template.tags.length > 0) score += 10;

  // Contenido del template (40 puntos)
  if ('template' in template) {
    if (template.template.backgroundColor) score += 10;
    if (template.template.textColor) score += 10;

    if ('title' in template.template && template.template.title) score += 10;
    if ('companyName' in template.template && template.template.companyName) score += 10;
  }

  // Características avanzadas (20 puntos)
  if ('template' in template) {
    if ('showGradient' in template.template && template.template.showGradient) score += 5;
    if ('backgroundPattern' in template.template && template.template.backgroundPattern) score += 5;
    if ('animation' in template.template && template.template.animation) score += 5;
    if ('socialIconStyle' in template.template && template.template.socialIconStyle) score += 5;
  }

  return Math.min(score, 100);
};

/**
 * Encuentra templates similares basado en características
 */
export const findSimilarTemplates = <T extends HeaderTemplate | FooterTemplate>(
  targetTemplate: T,
  allTemplates: T[],
  limit: number = 5
): T[] => {
  const similarities = allTemplates
    .filter((t) => t.id !== targetTemplate.id)
    .map((template) => {
      let similarity = 0;

      // Misma categoría (+30 puntos)
      if (template.category === targetTemplate.category) similarity += 30;

      // Tags en común (+5 puntos por tag)
      if ('tags' in template && 'tags' in targetTemplate) {
        const commonTags = template.tags.filter((tag) => targetTemplate.tags?.includes(tag));
        similarity += commonTags.length * 5;
      }

      // Colores similares (+20 puntos)
      const templateColors = extractTemplateColors(template);
      const targetColors = extractTemplateColors(targetTemplate);
      const colorMatch = templateColors.some((color) => targetColors.includes(color));
      if (colorMatch) similarity += 20;

      // Mismo tipo de layout (+15 puntos)
      if ('layoutType' in template.template && 'layoutType' in targetTemplate.template) {
        if (template.template.layoutType === targetTemplate.template.layoutType) similarity += 15;
      }

      return { template, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similarities.map((s) => s.template);
};

/**
 * Exporta un template a JSON
 */
export const exportTemplateToJSON = (
  template: HeaderTemplate | FooterTemplate | ComponentTemplate
): string => {
  const exportData = {
    ...template,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    type:
      'template' in template ? ('title' in template.template ? 'header' : 'footer') : 'component',
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Importa un template desde JSON
 */
export const importTemplateFromJSON = (
  jsonData: string
): HeaderTemplate | FooterTemplate | ComponentTemplate | null => {
  try {
    const data = JSON.parse(jsonData);

    // Validar estructura básica
    if (!data.id || !data.name || !data.template) {
      return null;
    }

    // Limpiar datos de exportación
    delete data.exportDate;
    delete data.version;
    delete data.type;

    return data as HeaderTemplate | FooterTemplate | ComponentTemplate;
  } catch (error) {
    console.error('Error importing template:', error);
    return null;
  }
};

/**
 * Genera un preview URL para un template
 */
export const generateTemplatePreview = (
  template: HeaderTemplate | FooterTemplate,
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  const dimensions = {
    small: '200x150',
    medium: '400x300',
    large: '800x600',
  };

  const baseUrl = '/api/template-preview';
  const params = new URLSearchParams({
    id: template.id,
    size: dimensions[size],
    category: template.category,
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Valida si un template es compatible con un email client
 */
export const isTemplateCompatible = (
  template: HeaderTemplate | FooterTemplate,
  emailClient: string
): boolean => {
  // Outlook limitaciones
  if (emailClient === 'outlook') {
    if ('showGradient' in template.template && template.template.showGradient) {
      return false;
    }
    if ('useCustomFont' in template.template && template.template.useCustomFont) {
      return false;
    }
  }

  return true;
};

/**
 * Genera recomendaciones para mejorar un template
 */
export const generateTemplateRecommendations = (
  template: HeaderTemplate | FooterTemplate | ComponentTemplate
): string[] => {
  const recommendations: string[] = [];

  // Validar nombre
  if (!template.name || template.name.length < 5) {
    recommendations.push('Considera usar un nombre más descriptivo');
  }

  // Validar descripción
  if (!template.description || template.description.length < 20) {
    recommendations.push('Agrega una descripción más detallada');
  }

  // Validar tags
  if ('tags' in template && (!template.tags || template.tags.length === 0)) {
    recommendations.push('Agrega tags para mejorar la búsqueda');
  }

  // Validaciones específicas del template
  if ('template' in template) {
    if (!template.template.backgroundColor) {
      recommendations.push('Define un color de fondo');
    }

    if (!template.template.textColor) {
      recommendations.push('Define un color de texto');
    }

    // Verificar contraste
    if (template.template.backgroundColor && template.template.textColor) {
      // Simplificado: solo check si son muy similares
      if (template.template.backgroundColor === template.template.textColor) {
        recommendations.push('El color de texto y fondo son iguales');
      }
    }
  }

  return recommendations;
};

/**
 * Calcula estadísticas de uso de un conjunto de templates
 */
export const calculateTemplateStats = (
  templates: (HeaderTemplate | FooterTemplate | ComponentTemplate)[]
): {
  totalTemplates: number;
  byCategory: Record<TemplateCategory, number>;
  avgQuality: number;
  mostUsedTags: string[];
} => {
  const stats = {
    totalTemplates: templates.length,
    byCategory: {} as Record<TemplateCategory, number>,
    avgQuality: 0,
    mostUsedTags: [] as string[],
  };

  // Contar por categoría
  templates.forEach((template) => {
    stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1;
  });

  // Calcular calidad promedio
  const totalQuality = templates.reduce(
    (sum, template) => sum + calculateTemplateQuality(template),
    0
  );
  stats.avgQuality = Math.round(totalQuality / templates.length);

  // Tags más usados
  const tagCounts: Record<string, number> = {};
  templates.forEach((template) => {
    if ('tags' in template && template.tags) {
      template.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  stats.mostUsedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag);

  return stats;
};
