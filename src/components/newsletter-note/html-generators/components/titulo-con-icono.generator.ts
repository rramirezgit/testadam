/**
 * Generador de HTML para componente TituloConIcono
 * Título con icono personalizable (sin fondo)
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { tableAttrs } from '../utils/outlook-helpers';
import { escapeHtml, getIconUrl, cleanTipTapHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

export function generateTituloConIconoHtml(component: EmailComponent): string {
  // ✅ Props configurables
  const textColor = component.props?.textColor || '#00C3C3';
  const borderRadius = component.props?.borderRadius || '8px';
  const padding = component.props?.padding || '16px 20px';
  const iconSize = component.props?.iconSize || 24;
  const fontSize = component.props?.fontSize || '20px';
  const fontWeight = component.props?.fontWeight || 'bold';
  const margin = component.style?.margin || '0px';

  // ✅ Manejo de iconos (URLs, iconify, icons8)
  const icon = component.props?.icon || 'chart-line';
  const iconUrl = getIconUrl(icon);

  // ✅ Manejar contenido HTML de TipTap de forma segura
  const content =
    component.content?.includes('<') && component.content?.includes('>')
      ? cleanTipTapHtml(component.content)
      : escapeHtml(component.content || '');

  return `<table ${tableAttrs()} width="100%" style="margin: ${margin};">
  <tr>
    <td style="border-radius: ${borderRadius}; padding: ${padding}; text-align: left;">
      <table ${tableAttrs()}>
        <tr>
          <td style="vertical-align: middle; padding-right: 12px;">
            <img src="${iconUrl}" width="${iconSize}" height="${iconSize}" alt="Icono" style="display: block; max-width: ${iconSize}px; max-height: ${iconSize}px;">
          </td>
          <td style="vertical-align: middle;">
            <h1 style="font-size: ${fontSize}; margin: 0; font-weight: ${fontWeight}; color: ${textColor}; line-height: 1.2;">${content}</h1>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
