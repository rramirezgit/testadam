/**
 * Punto de entrada principal para generadores de HTML de emails
 * Exporta todas las funciones y tipos necesarios
 */

// ===== UTILIDADES =====
export * from './utils/html-utils';

export * from './utils/email-styles';
export * from './utils/outlook-helpers';
// ===== TEMPLATES =====
export { generateNewsletterTemplate } from './templates/newsletter.template';

import { generateImageHtml } from './components/image.generator';
// ===== GENERADORES DE COMPONENTES DE CONTENIDO =====
import { generateButtonHtml } from './components/button.generator';
import { generateAuthorHtml } from './components/author.generator';
import { generateSpacerHtml } from './components/spacer.generator';
// ===== GENERADORES DE COMPONENTES BÁSICOS =====
import { generateHeadingHtml } from './components/heading.generator';
import { generateDividerHtml } from './components/divider.generator';
import { generateSummaryHtml } from './components/summary.generator';
// ===== GENERADORES DE COMPONENTES COMPLEJOS =====
import { generateGalleryHtml } from './components/gallery.generator';
import { generateCategoryHtml } from './components/category.generator';
import { generateParagraphHtml } from './components/paragraph.generator';
import { generateImageTextHtml } from './components/image-text.generator';
import { generateBulletListHtml } from './components/bulletlist.generator';
import { generateHerramientasHtml } from './components/herramientas.generator';
import { generateTextWithIconHtml } from './components/text-with-icon.generator';
import { generateRespaldadoPorHtml } from './components/respaldado-por.generator';
import { generateTituloConIconoHtml } from './components/titulo-con-icono.generator';
// ===== GENERADORES ESTRUCTURALES =====
import { generateNewsletterHeaderHtml } from './components/newsletter-header.generator';
import { generateNewsletterFooterHtml } from './components/newsletter-footer.generator';
import {
  generateTwoColumnsHtml,
  generateMultiColumnsHtml,
} from './components/multi-columns.generator';
import {
  setRenderComponentToHtml,
  generateNoteContainerHtml,
} from './components/note-container.generator';

export { generateSingleNoteTemplate } from './templates/single-note.template';
// ===== ADAPTADORES =====
export {
  generateHtmlFromObjDataWeb,
  generateNewsletterFromObjDataWeb,
  generateSingleNoteFromObjDataWeb,
} from './adapters/objdataweb-adapter';
// ===== TIPOS =====
export type * from './types';

export type { NewsletterNote } from './templates/newsletter.template';

import { escapeHtml } from './utils/html-utils';

import type { EmailComponent } from './types';

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
      return generateImageTextHtml(component);
    // return generateSummaryHtml(component);

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
      return generateMultiColumnsHtml(component);

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
  generateImageHtml,
  // Contenido
  generateButtonHtml,
  generateAuthorHtml,
  generateSpacerHtml,
  // Básicos
  generateHeadingHtml,
  generateDividerHtml,
  generateSummaryHtml,
  // Complejos
  generateGalleryHtml,
  generateCategoryHtml,
  generateParagraphHtml,
  generateImageTextHtml,
  generateBulletListHtml,
  generateTwoColumnsHtml,
  generateHerramientasHtml,
  generateTextWithIconHtml,
  generateMultiColumnsHtml,
  generateRespaldadoPorHtml,
  generateNoteContainerHtml,
  generateTituloConIconoHtml,
  // Estructurales
  generateNewsletterHeaderHtml,
  generateNewsletterFooterHtml,
};
