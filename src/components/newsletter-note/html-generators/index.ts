/**
 * Punto de entrada principal para generadores de HTML de emails
 * Exporta todas las funciones y tipos necesarios
 */

// ===== TIPOS =====
export type * from './types';

// ===== UTILIDADES =====
export * from './utils/html-utils';
export * from './utils/email-styles';
export * from './utils/outlook-helpers';

// ===== GENERADORES DE COMPONENTES BÁSICOS =====
import { generateHeadingHtml } from './components/heading.generator';
import { generateParagraphHtml } from './components/paragraph.generator';
import { generateBulletListHtml } from './components/bulletlist.generator';
import { generateDividerHtml } from './components/divider.generator';
import { generateImageHtml } from './components/image.generator';

// ===== GENERADORES DE COMPONENTES DE CONTENIDO =====
import { generateButtonHtml } from './components/button.generator';
import { generateCategoryHtml } from './components/category.generator';
import { generateSummaryHtml } from './components/summary.generator';
import { generateAuthorHtml } from './components/author.generator';
import { generateSpacerHtml } from './components/spacer.generator';

// ===== GENERADORES DE COMPONENTES COMPLEJOS =====
import { generateGalleryHtml } from './components/gallery.generator';
import { generateTituloConIconoHtml } from './components/titulo-con-icono.generator';
import { generateHerramientasHtml } from './components/herramientas.generator';
import { generateRespaldadoPorHtml } from './components/respaldado-por.generator';
import { generateImageTextHtml } from './components/image-text.generator';
import { generateTextWithIconHtml } from './components/text-with-icon.generator';
import { generateTwoColumnsHtml } from './components/two-columns.generator';

// ===== GENERADORES ESTRUCTURALES =====
import { generateNewsletterHeaderHtml } from './components/newsletter-header.generator';
import { generateNewsletterFooterHtml } from './components/newsletter-footer.generator';
import {
  generateNoteContainerHtml,
  setRenderComponentToHtml,
} from './components/note-container.generator';

// ===== TEMPLATES =====
export { generateNewsletterTemplate } from './templates/newsletter.template';
export { generateSingleNoteTemplate } from './templates/single-note.template';
export type { NewsletterNote } from './templates/newsletter.template';

import type { EmailComponent } from './types';
import { escapeHtml } from './utils/html-utils';

/**
 * Función principal que renderiza cualquier componente a HTML
 * Mantiene 100% de retrocompatibilidad con el código existente
 */
export function renderComponentToHtml(component: EmailComponent): string {
  switch (component.type) {
    // ===== COMPONENTES BÁSICOS =====
    case 'heading':
      return generateHeadingHtml(component);

    case 'paragraph':
      return generateParagraphHtml(component);

    case 'bulletList':
      return generateBulletListHtml(component);

    case 'divider':
      return generateDividerHtml(component);

    case 'image':
      return generateImageHtml(component);

    // ===== COMPONENTES DE CONTENIDO =====
    case 'button':
      return generateButtonHtml(component);

    case 'category':
      return generateCategoryHtml(component);

    case 'summary':
      return generateSummaryHtml(component);

    case 'author':
      return generateAuthorHtml(component);

    case 'spacer':
      return generateSpacerHtml(component);

    // ===== COMPONENTES COMPLEJOS =====
    case 'gallery':
      return generateGalleryHtml(component);

    case 'tituloConIcono':
      return generateTituloConIconoHtml(component);

    case 'herramientas':
      return generateHerramientasHtml(component);

    case 'respaldadoPor':
      return generateRespaldadoPorHtml(component);

    case 'imageText':
      return generateImageTextHtml(component);

    case 'textWithIcon':
      return generateTextWithIconHtml(component);

    case 'twoColumns':
      return generateTwoColumnsHtml(component);

    // ===== COMPONENTES ESTRUCTURALES =====
    case 'newsletterHeaderReusable':
      return generateNewsletterHeaderHtml(component);

    case 'newsletterFooterReusable':
      return generateNewsletterFooterHtml(component);

    case 'noteContainer':
      return generateNoteContainerHtml(component);

    // ===== COMPONENTE DESCONOCIDO =====
    default:
      return `<div class="component-unknown" style="background-color: #fff3e0; border-left: 3px solid #ff9800; padding: 15px; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <strong style="color: #f57c00;">Componente: ${component.type}</strong><br>
        <span style="color: #333333;">${escapeHtml(component.content || 'Sin contenido disponible')}</span>
      </div>`;
  }
}

// ✅ Inyectar la función renderComponentToHtml en el generador de note-container
// para evitar importación circular
setRenderComponentToHtml(renderComponentToHtml);

/**
 * Re-exportar generadores individuales para uso directo si es necesario
 */
export {
  // Básicos
  generateHeadingHtml,
  generateParagraphHtml,
  generateBulletListHtml,
  generateDividerHtml,
  generateImageHtml,
  // Contenido
  generateButtonHtml,
  generateCategoryHtml,
  generateSummaryHtml,
  generateAuthorHtml,
  generateSpacerHtml,
  // Complejos
  generateGalleryHtml,
  generateTituloConIconoHtml,
  generateHerramientasHtml,
  generateRespaldadoPorHtml,
  generateImageTextHtml,
  generateTextWithIconHtml,
  generateTwoColumnsHtml,
  // Estructurales
  generateNewsletterHeaderHtml,
  generateNewsletterFooterHtml,
  generateNoteContainerHtml,
};
