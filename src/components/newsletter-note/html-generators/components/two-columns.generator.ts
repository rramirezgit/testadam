/**
 * Generador de HTML para componente TwoColumns
 * Layout de dos columnas con imagen, título y descripción en cada una
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { tableAttrs } from '../utils/outlook-helpers';
import { escapeHtml, cleanTipTapHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

interface ColumnData {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

export function generateTwoColumnsHtml(component: EmailComponent): string {
  // ✅ Props de las columnas
  const leftColumn: ColumnData = component.props?.leftColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Descripción',
  };

  const rightColumn: ColumnData = component.props?.rightColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Descripción',
  };

  // ✅ Props de configuración
  const spacing = component.props?.spacing || 16;
  const borderRadius = component.props?.borderRadius || 8;
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const textColor = component.props?.textColor || '#333333';
  const titleColor = component.props?.titleColor || '#000000';
  const fontSize = component.props?.fontSize || 14;
  const titleSize = component.props?.titleSize || 18;
  const columnPadding = component.props?.columnPadding || 16;
  const margin = component.style?.margin || '20px 0';

  /**
   * Renderiza una columna individual
   */
  const renderColumn = (columnData: ColumnData): string => {
    const imageHtml = columnData.imageUrl
      ? `<img src="${columnData.imageUrl}" alt="${escapeHtml(columnData.imageAlt)}" style="width: 100%; height: auto; max-height: 200px; border-radius: ${borderRadius}px; object-fit: cover; display: block; margin-bottom: 16px;">`
      : `<div style="width: 100%; height: 150px; background-color: #f5f5f5; border-radius: ${borderRadius}px; display: flex; align-items: center; justify-content: center; color: #9e9e9e; font-size: 14px; margin-bottom: 16px;">${escapeHtml(columnData.imageAlt)}</div>`;

    return `<td style="width: 50%; vertical-align: top; padding: ${columnPadding}px; background-color: ${backgroundColor}; border-radius: ${borderRadius}px; text-align: center;" class="mobile-column">
      ${imageHtml}
      <h3 style="color: ${titleColor}; font-size: ${titleSize}px; font-weight: bold; margin: 0 0 8px 0; line-height: 1.2;">${escapeHtml(columnData.title)}</h3>
      <p style="color: ${textColor}; font-size: ${fontSize}px; line-height: 1.5; margin: 0;">${cleanTipTapHtml(columnData.description)}</p>
    </td>`;
  };

  return `<table ${tableAttrs()} width="100%" style="margin: ${margin};">
  <tr>
    <td style="padding: 0 0 ${spacing}px 0;">
      <table ${tableAttrs()} width="100%" style="border-spacing: ${spacing}px;">
        <tr>
          <!--[if mso | IE]>
          <td style="width: 50%; vertical-align: top;">
          <![endif]-->
          ${renderColumn(leftColumn)}
          <!--[if mso | IE]>
          </td>
          <td style="width: 50%; vertical-align: top;">
          <![endif]-->
          ${renderColumn(rightColumn)}
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
    .mobile-column {
      display: block !important;
      width: 100% !important;
      margin-bottom: ${spacing}px !important;
    }
  }
</style>`;
}
