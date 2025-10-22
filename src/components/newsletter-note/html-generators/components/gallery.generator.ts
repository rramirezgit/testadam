/**
 * Generador de HTML para componente Gallery
 * Galería 2x2 usando tablas para máxima compatibilidad
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';
import { tableAttrs } from '../utils/outlook-helpers';

import type { GalleryImage, EmailComponent } from '../types';

export function generateGalleryHtml(component: EmailComponent): string {
  // ✅ Props configurables
  const images = component.props?.images || [];
  const spacing = component.props?.spacing || 8;
  const borderRadius = component.props?.borderRadius || 8;
  const margin = component.style?.margin || '25px 0';

  // ✅ Asegurar que siempre tengamos exactamente 4 imágenes para la cuadrícula 2x2
  const galleryImages: GalleryImage[] = Array.from(
    { length: 4 },
    (_, idx) => images[idx] || { src: '', alt: `Imagen ${idx + 1}` }
  );

  return `<table ${tableAttrs()} width="100%" style="margin: ${margin};">
  <tr>
    <td>
      <table ${tableAttrs()} width="100%">
        <!-- Primera fila (imágenes 1 y 2) -->
        <tr>
          ${renderGalleryCell(galleryImages[0], spacing, borderRadius)}
          ${renderGalleryCell(galleryImages[1], spacing, borderRadius)}
        </tr>
        <!-- Segunda fila (imágenes 3 y 4) -->
        <tr>
          ${renderGalleryCell(galleryImages[2], spacing, borderRadius)}
          ${renderGalleryCell(galleryImages[3], spacing, borderRadius)}
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

/**
 * Renderiza una celda individual de la galería
 */
function renderGalleryCell(image: GalleryImage, spacing: number, borderRadius: number): string {
  const cellStyles = `text-align: center; vertical-align: top; width: 50%; padding: ${spacing}px;`;

  if (image.src) {
    const imgStyles = `width: 100%; max-width: 200px; height: 150px; object-fit: cover; border-radius: ${borderRadius}px; display: block; margin: 0 auto;`;
    return `<td style="${cellStyles}">
      <img src="${image.src}" alt="${escapeHtml(image.alt || '')}" style="${imgStyles}">
    </td>`;
  } else {
    // Placeholder para imagen vacía
    const placeholderStyles = `width: 100%; max-width: 200px; height: 150px; background-color: #f5f5f5; border-radius: ${borderRadius}px; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 1px solid #e0e0e0;`;
    return `<td style="${cellStyles}">
      <div style="${placeholderStyles}">
        <span style="color: #9e9e9e; font-size: 14px;">${escapeHtml(image.alt)}</span>
      </div>
    </td>`;
  }
}
