/**
 * Generador de HTML para componente BulletList
 * Usa etiquetas semánticas <ul> y <li>
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';
import { EMAIL_STYLES } from '../utils/email-styles';

import type { EmailComponent } from '../types';

export function generateBulletListHtml(component: EmailComponent): string {
  // ✅ Obtener items del array de props
  const items = component.props?.items || [];

  if (items.length === 0) {
    return '';
  }

  // ✅ Estilos configurables
  const margin = component.style?.margin || EMAIL_STYLES.bulletList.margin;
  const paddingLeft = component.style?.paddingLeft || EMAIL_STYLES.bulletList.paddingLeft;
  const color = component.style?.color || EMAIL_STYLES.bulletListItem.color;
  const lineHeight = component.style?.lineHeight || EMAIL_STYLES.bulletListItem.lineHeight;

  // Construir HTML de la lista
  let html = `<ul class="component-bulletlist" style="margin: ${margin}; padding-left: ${paddingLeft};">`;

  items.forEach((item: string) => {
    // ✅ Estilos inline para cada item (compatibilidad con clientes de correo)
    html += `<li style="margin: 10px 0; line-height: ${lineHeight}; color: ${color};">${escapeHtml(item)}</li>`;
  });

  html += '</ul>';

  return html;
}
