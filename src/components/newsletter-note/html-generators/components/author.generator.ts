/**
 * Generador de HTML para componente Author
 * Muestra información del autor con email opcional
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

export function generateAuthorHtml(component: EmailComponent): string {
  // ✅ Props del autor
  const authorName = component.props?.name || component.content || 'Autor';
  const authorEmail = component.props?.email || '';

  // ✅ Estilos configurables
  const backgroundColor =
    component.props?.backgroundColor || component.style?.backgroundColor || '#f8f9fa';
  const borderRadius = component.props?.borderRadius || '8px';
  const padding = component.props?.padding || '15px';
  const margin = component.style?.margin || '15px 0';
  const borderLeft = component.props?.borderLeft || '3px solid #28a745';

  const containerStyles = [
    `margin: ${margin}`,
    `padding: ${padding}`,
    `background-color: ${backgroundColor}`,
    `border-radius: ${borderRadius}`,
    `border-left: ${borderLeft}`,
  ].join('; ');

  return `<div class="component-author" style="${containerStyles}">
  <strong style="font-size: 16px; color: #333333;">${escapeHtml(authorName)}</strong>
  ${authorEmail ? `<br><a href="mailto:${authorEmail}" style="color: #1976d2; text-decoration: none; font-size: 14px;">${escapeHtml(authorEmail)}</a>` : ''}
</div>`;
}
