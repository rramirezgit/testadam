/**
 * Generador de HTML para componente NoteContainer
 * Contenedor que puede albergar otros componentes dentro
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

// Importación circular se resolverá en el index.ts
let renderComponentToHtmlFn: ((component: EmailComponent) => string) | null = null;

/**
 * Permite inyectar la función renderComponentToHtml para evitar importación circular
 */
export function setRenderComponentToHtml(fn: (component: EmailComponent) => string): void {
  renderComponentToHtmlFn = fn;
}

export function generateNoteContainerHtml(component: EmailComponent): string {
  const componentsData = component.props?.componentsData || [];
  const noteTitle = component.props?.noteTitle || 'Nota';
  const containerStyle = component.props?.containerStyle || {};

  // ✅ Leer estilos configurables desde props o component.style
  const borderWidth =
    component.props?.containerBorderWidth?.toString().replace('px', '') ||
    component.style?.borderWidth?.toString().replace('px', '') ||
    '2';
  const borderColor =
    component.props?.containerBorderColor || component.style?.borderColor || '#e0e0e0';
  const borderRadius =
    component.props?.containerBorderRadius?.toString().replace('px', '') ||
    component.style?.borderRadius?.toString().replace('px', '') ||
    '12';
  const padding =
    component.props?.containerPadding?.toString().replace('px', '') ||
    component.style?.padding?.toString().replace('px', '') ||
    '24';
  const backgroundColor =
    component.props?.containerBackgroundColor || component.style?.backgroundColor || '#ffffff';

  // ✅ Convertir estilos del contenedor a CSS inline
  const containerCss = Object.entries(containerStyle)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');

  // ✅ Estilos configurables del contenedor (maxWidth fijo en 560px)
  const configurableStyles = [
    `border: ${borderWidth}px solid ${borderColor}`,
    `border-radius: ${borderRadius}px`,
    `padding: ${padding}px`,
    `max-width: 560px`,
    `margin: 24px auto`,
    `background-color: ${backgroundColor}`,
  ].join('; ');

  const finalStyles = containerCss || configurableStyles;

  // ✅ Renderizar los componentes internos
  let innerComponentsHtml = '';

  if (renderComponentToHtmlFn && componentsData.length > 0) {
    innerComponentsHtml = componentsData
      .map((comp: EmailComponent) => renderComponentToHtmlFn!(comp))
      .join('');
  } else if (componentsData.length === 0) {
    innerComponentsHtml = `<div class="note-container-empty" style="
      min-height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 0.875rem;
      font-style: italic;
      background-color: rgba(25, 118, 210, 0.05);
      border-radius: 8px;
      border: 1px dashed #1976d2;
      padding: 16px;
      text-align: center;
    ">Contenedor vacío</div>`;
  }

  return `<div class="note-container" style="${finalStyles}">
  <div class="note-title" style="font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #333;">
    ${escapeHtml(noteTitle)}
  </div>
  <div class="note-content">
    ${innerComponentsHtml}
  </div>
</div>`;
}
