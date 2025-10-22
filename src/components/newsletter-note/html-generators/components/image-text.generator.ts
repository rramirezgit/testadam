/**
 * Generador de HTML para componente ImageText
 * Layout de imagen + texto en dos columnas
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { tableAttrs } from '../utils/outlook-helpers';
import { escapeHtml, cleanTipTapHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

export function generateImageTextHtml(component: EmailComponent): string {
  // ✅ Props del componente
  const imageUrl = component.props?.imageUrl || '';
  const imageAlt = component.props?.imageAlt || 'Imagen';
  const title = component.props?.title || 'Título';
  const description = component.props?.description || 'Descripción';

  // ✅ Props de configuración de layout
  const imageWidth = component.props?.imageWidth || 40; // Porcentaje
  const spacing = component.props?.spacing || 16;
  const borderRadius = component.props?.borderRadius || 8;

  // ✅ Props de estilo
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const textColor = component.props?.textColor || '#333333';
  const titleColor = component.props?.titleColor || '#000000';
  const fontSize = component.props?.fontSize || 14;
  const titleSize = component.props?.titleSize || 20;
  const margin = component.style?.margin || '20px 0';
  const padding = component.props?.padding || '16px';

  const textWidth = 100 - imageWidth;

  // ✅ Renderizar imagen o placeholder
  const imageHtml = imageUrl
    ? `<img src="${imageUrl}" alt="${escapeHtml(imageAlt)}" style="width: 100%; height: auto; border-radius: ${borderRadius}px; display: block;">`
    : `<div style="width: 100%; height: 150px; background-color: #f5f5f5; border-radius: ${borderRadius}px; display: flex; align-items: center; justify-content: center; color: #9e9e9e; font-size: 14px;">${escapeHtml(imageAlt)}</div>`;

  return `<table ${tableAttrs()} width="100%" style="margin: ${margin}; background-color: ${backgroundColor}; border-radius: ${borderRadius}px;">
  <tr>
    <td style="padding: ${padding};">
      <table ${tableAttrs()} width="100%">
        <tr>
          <!--[if mso | IE]>
          <td style="width: ${imageWidth}%; vertical-align: top;">
          <![endif]-->
          <td style="width: ${imageWidth}%; vertical-align: top; padding-right: ${spacing}px;" class="mobile-stack">
            ${imageHtml}
          </td>
          <!--[if mso | IE]>
          </td>
          <td style="width: ${textWidth}%; vertical-align: top;">
          <![endif]-->
          <td style="width: ${textWidth}%; vertical-align: top;" class="mobile-stack">
            <h3 style="color: ${titleColor}; font-size: ${titleSize}px; font-weight: bold; margin: 0 0 8px 0; line-height: 1.2;">${escapeHtml(title)}</h3>
            <p style="color: ${textColor}; font-size: ${fontSize}px; line-height: 1.5; margin: 0;">${cleanTipTapHtml(description)}</p>
          </td>
          <!--[if mso | IE]>
          </td>
          <![endif]-->
        </tr>
      </table>
    </td>
  </tr>
</table>

<style>
  @media only screen and (max-width: 600px) {
    .mobile-stack {
      display: block !important;
      width: 100% !important;
      padding-right: 0 !important;
      padding-bottom: ${spacing}px !important;
    }
  }
</style>`;
}
