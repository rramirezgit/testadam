/**
 * Generador de HTML para componente NewsletterHeader (Header reutilizable)
 * Header con imagen de fondo
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';
import { tableAttrs } from '../utils/outlook-helpers';
import { getHeaderConfig } from '../../email-editor/constants/newsletter-header-variants';

import type { EmailComponent } from '../types';

export function generateNewsletterHeaderHtml(component: EmailComponent): string {
  const props = component.props || {};
  const config = getHeaderConfig();

  // ✅ Props con fallback a configuración
  const headerTextColor = props.textColor ?? config.textColor;
  const padding = props.padding ? `${props.padding / 8}px` : `${config.padding / 8}px`;
  const alignment = props.alignment ?? config.alignment;
  const borderRadius = props.borderRadius ?? config.borderRadius;
  const margin = props.margin ?? config.margin;
  const backgroundImageUrl = props.backgroundImageUrl ?? config.backgroundImageUrl;
  const backgroundSize = props.backgroundSize ?? config.backgroundSize;
  const backgroundPosition = props.backgroundPosition ?? config.backgroundPosition;
  const backgroundRepeat = props.backgroundRepeat ?? config.backgroundRepeat;
  const minHeight = props.minHeight ?? config.minHeight;

  // ✅ Crear el estilo de fondo con imagen
  const backgroundStyle = `background-image: url(${backgroundImageUrl}); background-size: ${backgroundSize}; background-position: ${backgroundPosition}; background-repeat: ${backgroundRepeat};`;
  const additionalStyles = `min-height: ${minHeight};`;

  // ✅ Construir el HTML
  let headerHtml = `<table ${tableAttrs()} width="100%" style="${backgroundStyle} margin: ${margin}; border-radius: ${borderRadius}; ${additionalStyles} border: 1px solid #e0e0e0;">
  <tr>
    <td style="padding: ${padding}; text-align: ${alignment};">`;

  // ✅ Logo (oculto por ahora - no mostrar en header con fondo)
  // Logo deshabilitado para esta configuración

  // ✅ Sponsor (oculto temporalmente)
  // Sponsor deshabilitado temporalmente

  // ✅ Título
  if (props.title && props.title.trim() !== '') {
    headerHtml += `<h1 style="font-weight: 700; color: ${headerTextColor}; margin: 0 0 8px 0; font-size: 24px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${escapeHtml(props.title)}</h1>`;
  }

  // ✅ Subtítulo
  if (props.subtitle && props.subtitle.trim() !== '') {
    headerHtml += `<p style="color: ${headerTextColor}; margin: 0 0 16px 0; font-style: italic; font-size: 16px;">${escapeHtml(props.subtitle)}</p>`;
  }

  // ✅ Banner image
  if (props.showBanner && props.bannerImage) {
    headerHtml += `<div style="margin-top: 16px;">
      <img src="${props.bannerImage}" alt="Banner" style="width: 100%; border-radius: ${borderRadius}; display: block;">
    </div>`;
  }

  headerHtml += `
    </td>
  </tr>
</table>`;

  return headerHtml;
}
