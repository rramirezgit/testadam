/**
 * Generador de HTML para componente Category (Tags/Categorías)
 * Soporta categorías múltiples con colores personalizados
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml, cleanTipTapHtml } from '../utils/html-utils';

import type { Categoria, EmailComponent } from '../types';

export function generateCategoryHtml(component: EmailComponent): string {
  // ✅ Props configurables
  const borderRadius = component.props?.borderRadius || 16;
  const padding = component.props?.padding || 4;
  const fontSize = component.props?.fontSize || 14;
  const fontWeight = component.props?.fontWeight || 'normal';
  const margin = component.style?.margin || '15px 0';

  // ✅ Verificar si hay múltiples categorías
  if (component.props?.categorias && Array.isArray(component.props.categorias)) {
    let html = `<div class="component-category-group" style="margin: ${margin};">`;

    component.props.categorias.forEach((categoria: Categoria) => {
      const bgColor = categoria.colorFondo || '#e3f2fd';
      const textColor = categoria.colorTexto || '#1976d2';

      const categoryStyles = [
        `display: inline-block`,
        `background-color: ${bgColor}`,
        `color: ${textColor}`,
        `padding-top: ${padding}px`,
        `padding-bottom: ${padding}px`,
        `padding-left: ${padding * 2}px`,
        `padding-right: ${padding * 2}px`,
        `border-radius: ${borderRadius}px`,
        `font-size: ${fontSize}px`,
        `font-weight: ${fontWeight}`,
        `margin: 0 6px 6px 0`,
        `text-decoration: none`,
        `line-height: 1.2`,
        `vertical-align: top`,
      ].join('; ');

      html += `<span class="component-category" style="${categoryStyles}">${escapeHtml(categoria.texto)}</span>`;
    });

    html += '</div>';
    return html;
  }

  // ✅ Categoría única (legacy - mantener compatibilidad)
  const backgroundColor = component.props?.color || component.props?.colorFondo || '#e3f2fd';
  const textColor = component.props?.textColor || component.props?.colorTexto || '#1976d2';

  const categoryStyles = [
    `display: inline-block`,
    `background-color: ${backgroundColor}`,
    `color: ${textColor}`,
    `padding-top: ${padding}px`,
    `padding-bottom: ${padding}px`,
    `padding-left: ${padding * 2}px`,
    `padding-right: ${padding * 2}px`,
    `border-radius: ${borderRadius}px`,
    `font-size: ${fontSize}px`,
    `font-weight: ${fontWeight}`,
    `margin: 0 6px 6px 0`,
    `text-decoration: none`,
    `line-height: 1.2`,
    `vertical-align: top`,
  ].join('; ');

  return `<div class="component-category-group" style="margin: ${margin};">
  <span class="component-category" style="${categoryStyles}">${cleanTipTapHtml(component.content || '')}</span>
</div>`;
}
