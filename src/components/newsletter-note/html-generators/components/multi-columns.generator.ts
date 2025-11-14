/**
 * Generador de HTML para componente MultiColumns
 * Layout de 2-3 columnas con imagen, título y descripción en cada una
 * Cada columna es esencialmente un ImageTextComponent completo
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { tableAttrs } from '../utils/outlook-helpers';
import { escapeHtml, cleanTipTapHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

interface ColumnData {
  imageUrl: string;
  imageAlt: string;
  titleContent: string;
  content: string;
}

// Función de migración para compatibilidad con formato antiguo
const migrateOldFormat = (props: any): any => {
  if (props?.columns && Array.isArray(props.columns)) {
    return props;
  }

  const leftColumn = props?.leftColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Descripción',
  };

  const rightColumn = props?.rightColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Descripción',
  };

  return {
    ...props,
    numberOfColumns: 2,
    layout: 'image-top',
    columns: [
      {
        imageUrl: leftColumn.imageUrl || '',
        imageAlt: leftColumn.imageAlt || 'Imagen',
        titleContent: leftColumn.title ? `<p>${leftColumn.title}</p>` : '<p>Título</p>',
        content: leftColumn.description ? `<p>${leftColumn.description}</p>` : '<p>Descripción</p>',
      },
      {
        imageUrl: rightColumn.imageUrl || '',
        imageAlt: rightColumn.imageAlt || 'Imagen',
        titleContent: rightColumn.title ? `<p>${rightColumn.title}</p>` : '<p>Título</p>',
        content: rightColumn.description
          ? `<p>${rightColumn.description}</p>`
          : '<p>Descripción</p>',
      },
    ],
  };
};

export function generateMultiColumnsHtml(component: EmailComponent): string {
  // Migrar props si es necesario
  const migratedProps = migrateOldFormat(component.props);

  // ✅ Props globales
  const numberOfColumns = migratedProps?.numberOfColumns || 2;
  const layout = migratedProps?.layout || 'image-top';
  const spacing = migratedProps?.spacing || 16;
  const borderRadius = migratedProps?.borderRadius || 8;
  const backgroundColor = migratedProps?.backgroundColor || '#ffffff';
  const textColor = migratedProps?.textColor || '#333333';
  const titleColor = migratedProps?.titleColor || '#000000';
  const fontSize = migratedProps?.fontSize || 14;
  const titleSize = migratedProps?.titleSize || 18;
  const padding = migratedProps?.padding || 16;
  const imageWidth = migratedProps?.imageWidth || 40;
  const imageHeight = migratedProps?.imageHeight || 'auto';
  const imageObjectFit = migratedProps?.imageObjectFit || 'contain';
  const imageBackgroundColor = migratedProps?.imageBackgroundColor || 'transparent';
  const imageContainerBackgroundColor = migratedProps?.imageContainerBackgroundColor || '';
  const margin = component.style?.margin || '20px 0';

  // ✅ Columnas individuales
  const defaultColumn: ColumnData = {
    imageUrl: '',
    imageAlt: 'Imagen',
    titleContent: '<p>Título</p>',
    content: '<p>Descripción</p>',
  };

  const columns: ColumnData[] = migratedProps?.columns || [defaultColumn, defaultColumn];

  // Determinar si el layout es horizontal o vertical
  const isHorizontal = layout === 'image-left' || layout === 'image-right';
  const isImageFirst = layout === 'image-left' || layout === 'image-top';
  const textWidth = 100 - imageWidth;

  // Calcular ancho de columnas
  const columnWidth = numberOfColumns === 2 ? '50%' : '33.33%';
  const columnWidthPercent = numberOfColumns === 2 ? 50 : 33.33;

  /**
   * Renderiza una imagen
   */
  const renderImage = (columnData: ColumnData): string => {
    const imageContainerStyles = [
      imageHeight !== 'auto' && imageContainerBackgroundColor
        ? `background-color: ${imageContainerBackgroundColor}`
        : null,
      `border-radius: ${borderRadius}px`,
      `overflow: hidden`,
      `display: flex`,
      `align-items: center`,
      `justify-content: center`,
      imageHeight !== 'auto' ? `height: ${imageHeight}` : null,
      !isHorizontal ? `margin-bottom: 16px` : null,
    ]
      .filter(Boolean)
      .join('; ');

    const imageStyles = [
      `max-width: 100%`,
      `width: 100%`,
      imageHeight !== 'auto' ? `height: 100%` : `height: auto`,
      `object-fit: ${imageObjectFit}`,
      !imageContainerBackgroundColor ? `background-color: ${imageBackgroundColor}` : null,
      `border-radius: ${borderRadius}px`,
      `display: block`,
    ]
      .filter(Boolean)
      .join('; ');

    if (columnData.imageUrl) {
      return `<div style="${imageContainerStyles}">
        <img src="${columnData.imageUrl}" alt="${escapeHtml(columnData.imageAlt)}" style="${imageStyles}">
      </div>`;
    }

    return `<div style="width: 100%; min-height: 150px; background-color: #f5f5f5; border-radius: ${borderRadius}px; display: flex; align-items: center; justify-content: center; color: #9e9e9e; font-size: 14px; margin-bottom: ${isHorizontal ? 0 : 16}px;">
      ${escapeHtml(columnData.imageAlt)}
    </div>`;
  };

  /**
   * Renderiza el contenido de texto (título + descripción)
   */
  const renderTextContent = (
    columnData: ColumnData
  ): string => `<div style="line-height: 1.2; word-break: break-word; overflow-wrap: break-word;">
      <div style="color: ${titleColor}; font-size: ${titleSize}px; font-weight: bold; margin: 0 0 8px 0; line-height: 1.2; word-break: break-word; overflow-wrap: break-word;">
        ${cleanTipTapHtml(columnData.titleContent)}
      </div>
      <div style="color: ${textColor}; font-size: ${fontSize}px; line-height: 1.5; margin: 0; word-break: break-word; overflow-wrap: break-word;">
        ${cleanTipTapHtml(columnData.content)}
      </div>
    </div>`;

  /**
   * Renderiza una columna completa con layout horizontal (imagen a la izquierda o derecha)
   */
  const renderHorizontalColumn = (columnData: ColumnData): string => {
    const imageSection = `<td style="width: ${imageWidth}%; vertical-align: top; padding-right: ${isImageFirst ? spacing : 0}px; padding-left: ${!isImageFirst ? spacing : 0}px;" class="mobile-stack-inner">
      ${renderImage(columnData)}
    </td>`;

    const textSection = `<td style="width: ${textWidth}%; vertical-align: top;" class="mobile-stack-inner">
      ${renderTextContent(columnData)}
    </td>`;

    return `<table ${tableAttrs()} width="100%">
      <tr>
        ${isImageFirst ? imageSection + textSection : textSection + imageSection}
      </tr>
    </table>`;
  };

  /**
   * Renderiza una columna completa con layout vertical (imagen arriba o abajo)
   */
  const renderVerticalColumn = (columnData: ColumnData): string => {
    const imageRow = `<tr>
      <td>
        ${renderImage(columnData)}
      </td>
    </tr>`;

    const textRow = `<tr>
      <td>
        ${renderTextContent(columnData)}
      </td>
    </tr>`;

    return `<table ${tableAttrs()} width="100%">
      ${isImageFirst ? imageRow + textRow : textRow + imageRow}
    </table>`;
  };

  /**
   * Renderiza una columna individual (celda de la tabla principal)
   */
  const renderColumn = (columnData: ColumnData, index: number): string => {
    const columnContent = isHorizontal
      ? renderHorizontalColumn(columnData)
      : renderVerticalColumn(columnData);

    return `<!--[if mso | IE]>
    <td style="width: ${columnWidthPercent}%; vertical-align: top;">
    <![endif]-->
    <td style="width: ${columnWidthPercent}%; min-width: ${columnWidthPercent}%; max-width: ${columnWidthPercent}%; vertical-align: top; background-color: ${backgroundColor}; border-radius: ${borderRadius}px; padding: ${padding}px; box-sizing: border-box; word-break: break-word; overflow-wrap: break-word;" class="mobile-column">
      ${columnContent}
    </td>
    <!--[if mso | IE]>
    </td>
    <![endif]-->`;
  };

  // Renderizar todas las columnas
  const columnsHtml = columns
    .slice(0, numberOfColumns)
    .map((col, idx) => renderColumn(col, idx))
    .join('\n');

  return `<table ${tableAttrs()} width="100%" style="margin: ${margin}; table-layout: fixed;">
  <tr>
    <td style="padding: 0;">
      <table ${tableAttrs()} width="100%" style="border-spacing: ${spacing}px; table-layout: fixed;">
        <tr>
          ${columnsHtml}
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
      min-width: 100% !important;
      max-width: 100% !important;
      margin-bottom: ${spacing}px !important;
    }
    .mobile-column:last-child {
      margin-bottom: 0 !important;
    }
    .mobile-stack-inner {
      display: block !important;
      width: 100% !important;
      padding-right: 0 !important;
      padding-left: 0 !important;
      padding-bottom: ${spacing}px !important;
    }
  }
</style>`;
}

// Mantener la función antigua para compatibilidad
export function generateTwoColumnsHtml(component: EmailComponent): string {
  return generateMultiColumnsHtml(component);
}
