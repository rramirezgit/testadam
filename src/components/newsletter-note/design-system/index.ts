// Design System - Newsletter Editor
// Centralized exports for all design system components and utilities

// Types
export * from './types';

// Data
export * from './data/templates';
// Utils
export * from './utils/color-utils';
export * from './utils/design-utils';

export * from './data/color-palettes';
export * from './data/default-configs';
export * from './utils/template-utils';

// Hooks
export { default as useDesignState } from './hooks/use-design-state';
export { default as useColorPalette } from './hooks/use-color-palette';
export { default as useTemplateManager } from './hooks/use-template-manager';

// Components - Pendientes Fase 2
// export { default as DesignPanel } from './components/design-panel';
// export { default as TemplateSelector } from './components/template-selector';
// export { default as ColorSystem } from './components/color-system';
// export { default as PreviewSystem } from './components/preview-system';
