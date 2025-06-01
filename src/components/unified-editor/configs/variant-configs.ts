import type { VariantConfig, EditorVariant } from '../types';

// Configuraciones predefinidas para cada variante
export const VARIANT_CONFIGS: Record<EditorVariant, VariantConfig> = {
  // Editor mínimo - solo texto plano
  minimal: {
    extensions: {
      bold: false,
      italic: false,
      underline: false,
      textColor: false,
      fontFamily: false,
      textAlign: false,
      bulletList: false,
      orderedList: false,
      link: false,
      image: false,
      heading: false,
      placeholder: true,
      undo: true,
      redo: true,
    },
    toolbar: {
      enabled: false,
    },
    outputFormat: 'text',
  },

  // Editor simple - formato básico
  simple: {
    extensions: {
      bold: true,
      italic: true,
      underline: true,
      strike: false,
      textColor: false,
      fontFamily: false,
      textAlign: true,
      bulletList: true,
      orderedList: true,
      link: false,
      image: false,
      heading: { levels: [1, 2, 3] },
      placeholder: true,
      undo: true,
      redo: true,
    },
    toolbar: {
      enabled: true,
      position: 'top',
      groups: ['format', 'align', 'list', 'history'],
    },
    outputFormat: 'html',
  },

  // Editor estándar - formato completo sin multimedia
  standard: {
    extensions: {
      bold: true,
      italic: true,
      underline: true,
      strike: true,
      textColor: true,
      backgroundColor: false,
      fontFamily: true,
      textAlign: true,
      bulletList: true,
      orderedList: true,
      link: true,
      image: false,
      youtube: false,
      codeInline: true,
      codeBlock: false,
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      blockquote: true,
      horizontalRule: true,
      placeholder: true,
      undo: true,
      redo: true,
    },
    toolbar: {
      enabled: true,
      position: 'top',
      groups: ['format', 'color', 'align', 'list', 'insert', 'structure', 'history'],
    },
    outputFormat: 'html',
  },

  // Editor completo - todas las funcionalidades
  full: {
    extensions: {
      bold: true,
      italic: true,
      underline: true,
      strike: true,
      textColor: true,
      backgroundColor: true,
      fontFamily: true,
      fontSize: true,
      textAlign: true,
      bulletList: true,
      orderedList: true,
      link: true,
      image: true,
      youtube: true,
      codeInline: true,
      codeBlock: true,
      codeHighlight: true,
      table: true,
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      blockquote: true,
      horizontalRule: true,
      placeholder: true,
      undo: true,
      redo: true,
    },
    toolbar: {
      enabled: true,
      position: 'top',
      sticky: true,
      groups: [
        'format',
        'color',
        'align',
        'list',
        'insert',
        'structure',
        'table',
        'code',
        'history',
        'view',
      ],
    },
    outputFormat: 'both',
  },

  // Editor para newsletters
  newsletter: {
    extensions: {
      bold: true,
      italic: true,
      underline: true,
      strike: false,
      textColor: true,
      backgroundColor: false,
      fontFamily: true,
      fontSize: false,
      textAlign: true,
      bulletList: true,
      orderedList: true,
      link: true,
      image: true,
      youtube: false,
      codeInline: false,
      codeBlock: false,
      table: false,
      heading: { levels: [1, 2, 3] },
      blockquote: false,
      horizontalRule: true,
      placeholder: true,
      undo: true,
      redo: true,
    },
    toolbar: {
      enabled: true,
      position: 'top',
      groups: ['format', 'color', 'align', 'list', 'insert', 'structure', 'history'],
    },
    outputFormat: 'both',
  },

  // Editor para educación
  education: {
    extensions: {
      bold: true,
      italic: true,
      underline: true,
      strike: true,
      textColor: true,
      backgroundColor: false,
      fontFamily: true,
      fontSize: false,
      textAlign: true,
      bulletList: true,
      orderedList: true,
      link: true,
      image: true,
      youtube: true,
      codeInline: true,
      codeBlock: true,
      codeHighlight: true,
      table: true,
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      blockquote: true,
      horizontalRule: true,
      placeholder: true,
      undo: true,
      redo: true,
    },
    toolbar: {
      enabled: true,
      position: 'top',
      sticky: true,
      groups: [
        'format',
        'color',
        'align',
        'list',
        'insert',
        'structure',
        'table',
        'code',
        'history',
      ],
    },
    outputFormat: 'both',
  },

  // Editor para componentes específicos
  component: {
    extensions: {
      bold: true,
      italic: true,
      underline: true,
      strike: false,
      textColor: true,
      backgroundColor: false,
      fontFamily: true,
      fontSize: false,
      textAlign: true,
      bulletList: false,
      orderedList: false,
      link: false,
      image: false,
      heading: true,
      blockquote: false,
      horizontalRule: false,
      placeholder: true,
      undo: true,
      redo: true,
    },
    toolbar: {
      enabled: true,
      position: 'top',
      groups: ['format', 'color', 'align', 'history'],
    },
    outputFormat: 'html',
  },
};

// Función para obtener configuración de variante
export function getVariantConfig(variant: EditorVariant): VariantConfig {
  return VARIANT_CONFIGS[variant];
}

// Función para obtener configuración merged (base + overrides)
export function getMergedConfig(
  variant: EditorVariant,
  overrides?: Partial<VariantConfig>
): VariantConfig {
  const baseConfig = getVariantConfig(variant);

  if (!overrides) return baseConfig;

  return {
    extensions: { ...baseConfig.extensions, ...overrides.extensions },
    toolbar: { ...baseConfig.toolbar, ...overrides.toolbar },
    outputFormat: overrides.outputFormat || baseConfig.outputFormat,
  };
}
