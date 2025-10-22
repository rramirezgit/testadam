/**
 * Generador de HTML para componente TextWithIcon
 * Texto con icono y configuración flexible
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { tableAttrs } from '../utils/outlook-helpers';
import { escapeHtml, cleanTipTapHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

/**
 * Mapeo básico de iconos MDI a símbolos Unicode/Emoji para correos
 * (Los iconos SVG no son soportados en todos los clientes)
 */
const ICON_MAP: Record<string, string> = {
  'mdi:information-outline': 'ℹ️',
  'mdi:check-circle-outline': '✅',
  'mdi:alert-circle-outline': '⚠️',
  'mdi:lightbulb-outline': '💡',
  'mdi:star-outline': '⭐',
  'mdi:heart-outline': '❤️',
  'mdi:fire': '🔥',
  'mdi:trending-up': '📈',
  'mdi:rocket-launch-outline': '🚀',
  'mdi:shield-check-outline': '🛡️',
  'mdi:clock-outline': '⏰',
  'mdi:account-group-outline': '👥',
};

export function generateTextWithIconHtml(component: EmailComponent): string {
  // ✅ Props del componente
  const icon = component.props?.icon || 'mdi:information-outline';
  const iconColor = component.props?.iconColor || '#2196f3';
  const iconSize = component.props?.iconSize || 24;
  const title = component.props?.title || 'Título con Icono';
  const description = component.props?.description || 'Escribe el contenido aquí...';

  // ✅ Props de estilo
  const titleColor = component.props?.titleColor || '#000000';
  const textColor = component.props?.textColor || '#333333';
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const titleSize = component.props?.titleSize || 20;
  const fontSize = component.props?.fontSize || 14;
  const alignment = component.props?.alignment || 'left';
  const spacing = component.props?.spacing || 12;
  const borderRadius = component.props?.borderRadius || 8;
  const padding = component.props?.padding || 16;
  const margin = component.style?.margin || '20px 0';

  // ✅ Obtener símbolo del icono
  const iconSymbol = ICON_MAP[icon] || '•';

  const alignmentStyle =
    alignment === 'center' ? 'center' : alignment === 'right' ? 'right' : 'left';

  return `<table ${tableAttrs()} width="100%" style="margin: ${margin};">
  <tr>
    <td style="background-color: ${backgroundColor}; border-radius: ${borderRadius}px; padding: ${padding}px; text-align: ${alignmentStyle};">
      <table ${tableAttrs()} style="margin: 0 auto;">
        <tr>
          <td style="vertical-align: middle; padding-right: ${spacing}px;">
            <span style="font-size: ${iconSize}px; color: ${iconColor}; line-height: 1;">${iconSymbol}</span>
          </td>
          <td style="vertical-align: middle;">
            <h3 style="color: ${titleColor}; font-size: ${titleSize}px; font-weight: bold; margin: 0; line-height: 1.2; display: inline;">${escapeHtml(title)}</h3>
          </td>
        </tr>
      </table>
      ${description ? `<p style="color: ${textColor}; font-size: ${fontSize}px; line-height: 1.5; margin: 8px 0 0 0;">${cleanTipTapHtml(description)}</p>` : ''}
    </td>
  </tr>
</table>`;
}
