/**
 * Generador de HTML para componente ImageText
 * Layout de imagen + texto con múltiples configuraciones
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { tableAttrs } from '../utils/outlook-helpers';
import { escapeHtml, cleanTipTapHtml } from '../utils/html-utils';
import { getVariantConfig } from '../../email-editor/constants/image-text-variants';

import type { EmailComponent } from '../types';

export function generateImageTextHtml(component: EmailComponent): string {
  // ✅ Obtener configuración de la variante seleccionada
  const variant = component.props?.variant || 'default';
  const variantConfig = getVariantConfig(variant);
  const isAvatarVariant = variant === 'avatarSinBorde';

  // ✅ Props del componente con fallback a valores de variante
  const imageUrl = component.props?.imageUrl || variantConfig.defaultImageUrl || '';
  const imageAlt = component.props?.imageAlt || 'Imagen';
  const titleContent = component.props?.titleContent || '<p>Título</p>';
  const description = component.content || '<p>Descripción</p>';

  // ✅ Props de configuración de layout con fallback a variante
  const layout = component.props?.layout || 'image-left'; // 'image-left', 'image-right', 'image-top', 'image-bottom'
  const imageWidth = component.props?.imageWidth || 40; // Porcentaje
  const spacing = component.props?.spacing ?? variantConfig.spacing;
  const borderRadius = component.props?.borderRadius ?? variantConfig.borderRadius;
  const padding = component.props?.padding ?? variantConfig.padding;

  // ✅ Props de estilo de imagen con fallback a variante
  const imageHeight = component.props?.imageHeight ?? variantConfig.imageHeight ?? 'auto';
  const imageFixedWidth = component.props?.imageFixedWidth ?? variantConfig.imageFixedWidth;
  const imageObjectFit =
    component.props?.imageObjectFit ?? (variantConfig.imageObjectFit || 'contain');
  const imageBackgroundColor = component.props?.imageBackgroundColor || 'transparent';
  const imageContainerBackgroundColor = component.props?.imageContainerBackgroundColor || '';
  const imageBorderRadius = component.props?.imageBorderRadius ?? variantConfig.imageBorderRadius;

  // ✅ Props de fondo con imagen con fallback a variante
  const backgroundImageUrl =
    component.props?.backgroundImageUrl ?? variantConfig.backgroundImageUrl;
  const backgroundSize = component.props?.backgroundSize ?? variantConfig.backgroundSize ?? 'cover';
  const backgroundPosition =
    component.props?.backgroundPosition ?? variantConfig.backgroundPosition ?? 'center';
  const backgroundRepeat =
    component.props?.backgroundRepeat ?? variantConfig.backgroundRepeat ?? 'no-repeat';

  // ✅ Props de contenedor con fallback a variante
  const minHeight = component.props?.minHeight ?? variantConfig.minHeight;
  const alignItems = component.props?.alignItems ?? variantConfig.alignItems;

  // ✅ Props de estilo de texto con fallback a variante
  const backgroundColor = component.props?.backgroundColor ?? variantConfig.backgroundColor;
  const textColor = component.props?.textColor ?? variantConfig.textColor;
  const titleColor = component.props?.titleColor ?? variantConfig.titleColor;
  const fontSize = component.props?.fontSize || 14;
  const titleSize = component.props?.titleSize || 20;
  const margin = component.style?.margin || '20px 0';

  // ✅ Props de variantes (bordes) con fallback a variante
  const borderColor = component.props?.borderColor ?? variantConfig.borderColor;
  const borderWidth = component.props?.borderWidth ?? variantConfig.borderWidth;

  // ✅ Determinar si el layout es horizontal o vertical
  const isHorizontal = layout === 'image-left' || layout === 'image-right';
  const isImageFirst = layout === 'image-left' || layout === 'image-top';

  // ✅ Determinar el radio de borde efectivo para la imagen
  const effectiveImageBorderRadius = imageBorderRadius || `${borderRadius}px`;

  // ✅ Estilos para el contenedor de imagen
  const imageContainerStyles = [
    imageHeight !== 'auto' && imageContainerBackgroundColor
      ? `background-color: ${imageContainerBackgroundColor}`
      : null,
    `border-radius: ${effectiveImageBorderRadius}`,
    `overflow: hidden`,
    `display: inline-block`, // Cambiar a inline-block para que respete width/height
    `line-height: 0`,
    imageHeight !== 'auto' ? `height: ${imageHeight}` : null,
    imageFixedWidth ? `width: ${imageFixedWidth}` : null,
  ]
    .filter(Boolean)
    .join('; ');

  // ✅ Estilos para la imagen
  const imageStyles = [
    imageFixedWidth ? `width: ${imageFixedWidth}` : `width: 100%`,
    imageHeight !== 'auto' ? `height: ${imageHeight}` : `height: auto`,
    `object-fit: ${imageObjectFit}`,
    !imageContainerBackgroundColor ? `background-color: ${imageBackgroundColor}` : null,
    `border-radius: ${effectiveImageBorderRadius}`,
    `display: block`,
    `margin: 0`, // Sin márgenes
  ]
    .filter(Boolean)
    .join('; ');

  const placeholderStyles = [
    imageFixedWidth ? `width: ${imageFixedWidth}` : `width: 100%`,
    imageHeight !== 'auto' ? `height: ${imageHeight}` : `height: 150px`,
    `background-color: #f5f5f5`,
    `border-radius: ${effectiveImageBorderRadius}`,
    `border: 1px solid #e0e0e0`,
    `line-height: 0`,
    `display: block`,
  ]
    .filter(Boolean)
    .join('; ');

  // ✅ Centrar imagen si tiene imageFixedWidth y es layout vertical
  const shouldCenterImage = imageFixedWidth && !isHorizontal;
  const imageCenterWrapper = shouldCenterImage ? 'text-align: center;' : '';

  // ✅ Renderizar imagen o placeholder
  const imageHtml = imageUrl
    ? `<div style="${imageCenterWrapper}">
         <div style="${imageContainerStyles}">
           <img src="${imageUrl}" alt="${escapeHtml(imageAlt)}" style="${imageStyles}">
         </div>
       </div>`
    : `<div style="${imageCenterWrapper}">
         <div style="${placeholderStyles}"></div>
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

  const columnVerticalAlignStyle =
    alignItems === 'center' ? 'vertical-align: middle;' : 'vertical-align: top;';

  const responsiveStyles = isAvatarVariant
    ? ''
    : `<style>
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

  // ✅ Generar HTML según el layout
  if (isHorizontal) {
    // Layouts horizontales: imagen y texto en columnas
    // Si hay imageFixedWidth, usar ese ancho en lugar del porcentaje
    const imageColumnStyle = imageFixedWidth
      ? `width: ${imageFixedWidth}; min-width: ${imageFixedWidth}; max-width: ${imageFixedWidth};`
      : `width: ${imageWidth}%;`;

    const imageColumn = `<!--[if mso | IE]>
          <td style="${imageColumnStyle} ${columnVerticalAlignStyle}">
          <![endif]-->
          <td style="${imageColumnStyle} ${columnVerticalAlignStyle} padding-right: ${isImageFirst ? spacing : 0}px; padding-left: ${!isImageFirst ? spacing : 0}px; padding-top: 0;" class="mobile-stack">
            ${imageHtml}
          </td>
          <!--[if mso | IE]>
          </td>
          <![endif]-->`;

    const textColumn = `<!--[if mso | IE]>
          <td style="${columnVerticalAlignStyle}">
          <![endif]-->
          <td style="${columnVerticalAlignStyle} padding-top: 0;" class="mobile-stack">
            ${textHtml}
          </td>
          <!--[if mso | IE]>
          </td>
          <![endif]-->`;

    const borderStyle = borderWidth > 0 ? `border: ${borderWidth}px solid ${borderColor};` : '';
    const backgroundImageStyle = backgroundImageUrl
      ? `background-image: url(${backgroundImageUrl}); background-size: ${backgroundSize}; background-position: ${backgroundPosition}; background-repeat: ${backgroundRepeat};`
      : '';
    const minHeightStyle = minHeight ? `min-height: ${minHeight};` : '';
    const verticalAlignStyle =
      alignItems === 'center' ? 'vertical-align: middle;' : 'vertical-align: top;';

    return `<table ${tableAttrs()} width="100%" style="margin: ${margin}; background-color: ${backgroundColor}; ${backgroundImageStyle} border-radius: ${borderRadius}px; ${borderStyle} ${minHeightStyle}">
  <tr>
    <td style="padding: ${padding}px; ${verticalAlignStyle}">
      <table ${tableAttrs()} width="100%" style="${minHeight ? 'height: 100%;' : ''}">
        <tr>
          ${isImageFirst ? imageColumn + textColumn : textColumn + imageColumn}
        </tr>
      </table>
    </td>
  </tr>
</table>
${responsiveStyles}`;
  }
  // Layouts verticales: imagen y texto en filas
  const imageRow = `<tr>
    <td style="${columnVerticalAlignStyle} padding-bottom: ${isImageFirst ? spacing : 0}px; padding-top: ${!isImageFirst ? spacing : 0}px;">
      ${imageHtml}
    </td>
  </tr>`;

  const textRow = `<tr>
    <td style="${columnVerticalAlignStyle}">
      ${textHtml}
    </td>
  </tr>`;

  const borderStyle = borderWidth > 0 ? `border: ${borderWidth}px solid ${borderColor};` : '';
  const backgroundImageStyle = backgroundImageUrl
    ? `background-image: url(${backgroundImageUrl}); background-size: ${backgroundSize}; background-position: ${backgroundPosition}; background-repeat: ${backgroundRepeat};`
    : '';
  const minHeightStyle = minHeight ? `min-height: ${minHeight};` : '';
  const verticalAlignStyle =
    alignItems === 'center' ? 'vertical-align: middle;' : 'vertical-align: top;';

  return `<table ${tableAttrs()} width="100%" style="margin: ${margin}; background-color: ${backgroundColor}; ${backgroundImageStyle} border-radius: ${borderRadius}px; ${borderStyle} ${minHeightStyle}">
  <tr>
    <td style="padding: ${padding}px; ${verticalAlignStyle}">
      <table ${tableAttrs()} width="100%" style="${minHeight ? 'height: 100%;' : ''}">
        ${isImageFirst ? imageRow + textRow : textRow + imageRow}
      </table>
    </td>
  </tr>
</table>
${responsiveStyles}`;
}
