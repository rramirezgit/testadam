/**
 * Generador de HTML para componente ImageText
 * Layout de imagen + texto con múltiples configuraciones
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { tableAttrs } from '../utils/outlook-helpers';
import { escapeHtml, cleanTipTapHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

export function generateImageTextHtml(component: EmailComponent): string {
  // ✅ Props del componente
  const imageUrl = component.props?.imageUrl || '';
  const imageAlt = component.props?.imageAlt || 'Imagen';
  const titleContent = component.props?.titleContent || '<p>Título</p>';
  const description = component.content || '<p>Descripción</p>';

  // ✅ Props de configuración de layout
  const layout = component.props?.layout || 'image-left'; // 'image-left', 'image-right', 'image-top', 'image-bottom'
  const imageWidth = component.props?.imageWidth || 40; // Porcentaje
  const spacing = component.props?.spacing || 16;
  const borderRadius = component.props?.borderRadius || 8;
  const padding = component.props?.padding || 16;

  // ✅ Props de estilo de imagen
  const imageHeight = component.props?.imageHeight || 'auto';
  const imageFixedWidth = component.props?.imageFixedWidth || '';
  const imageObjectFit = component.props?.imageObjectFit || 'contain';
  const imageBackgroundColor = component.props?.imageBackgroundColor || 'transparent';
  const imageContainerBackgroundColor = component.props?.imageContainerBackgroundColor || '';

  // ✅ Props de estilo de texto
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const textColor = component.props?.textColor || '#333333';
  const titleColor = component.props?.titleColor || '#000000';
  const fontSize = component.props?.fontSize || 14;
  const titleSize = component.props?.titleSize || 20;
  const margin = component.style?.margin || '20px 0';

  // ✅ Props de variantes (bordes)
  const borderColor = component.props?.borderColor || 'transparent';
  const borderWidth = component.props?.borderWidth || 0;

  // ✅ Determinar si el layout es horizontal o vertical
  const isHorizontal = layout === 'image-left' || layout === 'image-right';
  const isImageFirst = layout === 'image-left' || layout === 'image-top';

  // ✅ Estilos para el contenedor de imagen
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
    imageFixedWidth ? `width: ${imageFixedWidth}` : null,
    // NO centrar con margin auto, dejar alineación natural
  ]
    .filter(Boolean)
    .join('; ');

  // ✅ Estilos para la imagen
  const imageStyles = [
    `max-width: 100%`,
    imageFixedWidth ? `width: ${imageFixedWidth}` : `width: 100%`,
    imageHeight !== 'auto' ? `height: ${imageHeight}` : `height: auto`,
    `object-fit: ${imageObjectFit}`,
    !imageContainerBackgroundColor ? `background-color: ${imageBackgroundColor}` : null,
    `border-radius: ${borderRadius}px`,
    `display: block`,
  ]
    .filter(Boolean)
    .join('; ');

  // ✅ Renderizar imagen o placeholder
  const imageHtml = imageUrl
    ? `<div style="${imageContainerStyles}">
         <img src="${imageUrl}" alt="${escapeHtml(imageAlt)}" style="${imageStyles}">
       </div>`
    : `<div style="width: 100%; min-height: 150px; background-color: #f5f5f5; border-radius: ${borderRadius}px; display: flex; align-items: center; justify-content: center; color: #9e9e9e; font-size: 14px;">
         ${escapeHtml(imageAlt)}
       </div>`;

  // ✅ Renderizar contenido de texto
  const textHtml = `<div style="line-height: 1.2;">
    <div style="color: ${titleColor}; font-size: ${titleSize}px; font-weight: bold; margin: 0 0 8px 0; line-height: 1.2;">
      ${cleanTipTapHtml(titleContent)}
    </div>
    <div style="color: ${textColor}; font-size: ${fontSize}px; line-height: 1.5; margin: 0;">
      ${cleanTipTapHtml(description)}
    </div>
  </div>`;

  // ✅ Generar HTML según el layout
  if (isHorizontal) {
    // Layouts horizontales: imagen y texto en columnas
    // Si hay imageFixedWidth, usar ese ancho en lugar del porcentaje
    const imageColumnStyle = imageFixedWidth
      ? `width: ${imageFixedWidth}; min-width: ${imageFixedWidth}; max-width: ${imageFixedWidth};`
      : `width: ${imageWidth}%;`;

    const imageColumn = `<!--[if mso | IE]>
          <td style="${imageColumnStyle} vertical-align: top;">
          <![endif]-->
          <td style="${imageColumnStyle} vertical-align: top; padding-right: ${isImageFirst ? spacing : 0}px; padding-left: ${!isImageFirst ? spacing : 0}px; padding-top: 0;" class="mobile-stack">
            ${imageHtml}
          </td>
          <!--[if mso | IE]>
          </td>
          <![endif]-->`;

    const textColumn = `<!--[if mso | IE]>
          <td style="vertical-align: top;">
          <![endif]-->
          <td style="vertical-align: top; padding-top: 0;" class="mobile-stack">
            ${textHtml}
          </td>
          <!--[if mso | IE]>
          </td>
          <![endif]-->`;

    const borderStyle = borderWidth > 0 ? `border: ${borderWidth}px solid ${borderColor};` : '';
    return `<table ${tableAttrs()} width="100%" style="margin: ${margin}; background-color: ${backgroundColor}; border-radius: ${borderRadius}px; ${borderStyle}">
  <tr>
    <td style="padding: ${padding}px;">
      <table ${tableAttrs()} width="100%">
        <tr>
          ${isImageFirst ? imageColumn + textColumn : textColumn + imageColumn}
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
      padding-left: 0 !important;
      padding-bottom: ${spacing}px !important;
    }
  }
</style>`;
  }
  // Layouts verticales: imagen y texto en filas
  const imageRow = `<tr>
    <td style="padding-bottom: ${isImageFirst ? spacing : 0}px; padding-top: ${!isImageFirst ? spacing : 0}px;">
      ${imageHtml}
    </td>
  </tr>`;

  const textRow = `<tr>
    <td>
      ${textHtml}
    </td>
  </tr>`;

  const borderStyle = borderWidth > 0 ? `border: ${borderWidth}px solid ${borderColor};` : '';
  return `<table ${tableAttrs()} width="100%" style="margin: ${margin}; background-color: ${backgroundColor}; border-radius: ${borderRadius}px; ${borderStyle}">
  <tr>
    <td style="padding: ${padding}px;">
      <table ${tableAttrs()} width="100%">
        ${isImageFirst ? imageRow + textRow : textRow + imageRow}
      </table>
    </td>
  </tr>
</table>`;
}
