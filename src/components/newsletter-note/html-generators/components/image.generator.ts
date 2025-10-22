/**
 * Generador de HTML para componente Image
 * Usa etiqueta semántica <img> con wrapper de tabla para Outlook
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';
import { tableAttrs } from '../utils/outlook-helpers';

import type { EmailComponent } from '../types';

export function generateImageHtml(component: EmailComponent): string {
  // ✅ Props de imagen
  const src = component.props?.src || '/placeholder.svg';
  const alt = component.props?.alt || 'Image';
  const link = component.props?.link || '';

  // ✅ Estilos configurables del componente
  const imageBackgroundColor = component.style?.backgroundColor || 'transparent';
  const containerBackgroundColor = component.props?.style?.containerBackgroundColor || '';
  const objectFit = component.style?.objectFit || 'contain';
  const height = component.style?.height || component.props?.style?.height || 'auto';
  const borderRadius = component.style?.borderRadius || component.props?.borderRadius || '8px';
  const margin = component.style?.margin || '0px 0px 25px 0px';

  console.log('📧 Configuración de imagen para email:', {
    height,
    objectFit,
    imageBackgroundColor,
    containerBackgroundColor,
    link,
    hasLink: !!link,
  });

  // Estilos del contenedor (td)
  const containerStyles = [
    `text-align: center`,
    height !== 'auto' && containerBackgroundColor
      ? `background-color: ${containerBackgroundColor}`
      : null,
  ]
    .filter(Boolean)
    .join('; ');

  // Construir estilos inline de la imagen
  const imgStyles = [
    `max-width: 100%`,
    `width: 100%`,
    `height: ${height}`, // ✅ Usar la altura directamente (auto o XXXpx)
    `background-color: ${imageBackgroundColor}`,
    `object-fit: ${objectFit}`,
    `border-radius: ${borderRadius}`,
    `display: block`,
    `margin: 0 auto`,
  ].join('; ');

  // ✅ Construir el HTML de la imagen
  const imageHtml = `<img src="${src}" alt="${escapeHtml(alt)}" style="${imgStyles}">`;

  // ✅ Si hay un enlace, envolver la imagen en un <a>
  const imageContent = link
    ? `<a href="${link}" target="_blank" rel="noopener noreferrer" style="display: inline-block; text-decoration: none;">${imageHtml}</a>`
    : imageHtml;

  // ✅ Usar tabla para máxima compatibilidad (especialmente Outlook)
  return `<table ${tableAttrs()} width="100%" style="margin: ${margin};">
  <tr>
    <td class="component-image" style="${containerStyles}">
      ${imageContent}
    </td>
  </tr>
</table>`;
}
