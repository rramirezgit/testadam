// Componente principal
export { UnifiedEditor } from './unified-editor';

// Componentes
export { UnifiedToolbar } from './components/unified-toolbar';

export { useEditorMetadata } from './hooks/use-editor-metadata';

// Context
export { EditorContext, useEditorContext } from './context/editor-context';
// Hooks
export { useExtensionBuilder, useCombinedExtensions } from './hooks/use-extension-builder';

// Configuraciones
export { VARIANT_CONFIGS, getMergedConfig, getVariantConfig } from './configs/variant-configs';

// Tipos
export type {
  OutputFormat,
  ToolbarGroup,
  EditorVariant,
  ToolbarConfig,
  VariantConfig,
  EditorMetadata,
  ExtensionConfig,
  UnifiedEditorProps,
  EditorContextValue,
} from './types';
