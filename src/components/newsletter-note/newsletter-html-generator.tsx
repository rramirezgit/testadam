'use client';

/**
 * Generador de HTML unificado para newsletters
 *
 * NOTA: Este archivo ahora usa los generadores modulares de html-generators/
 * Se mantiene por retrocompatibilidad pero delega la generación a los nuevos módulos
 *
 * Para editar la generación de HTML de componentes, ver:
 * - html-generators/components/ - Generadores individuales
 * - html-generators/templates/ - Templates completos
 * - html-generators/index.ts - Exportaciones y función principal
 */

import type { NewsletterNote } from 'src/types/newsletter';
import type { EmailComponent } from 'src/types/saved-note';

import {
  type FooterConfig,
  type HeaderConfig,
  type ContainerConfig,
  renderComponentToHtml,
  generateNewsletterTemplate,
  generateSingleNoteTemplate,
} from './html-generators';

// ===== RE-EXPORTAR TIPOS PARA RETROCOMPATIBILIDAD =====
export type { HeaderConfig, FooterConfig, ContainerConfig };

/**
 * Genera HTML completo para un newsletter con múltiples notas
 * Compatible con Gmail, Outlook y Apple Mail
 */
export function generateNewsletterHtml(
  title: string,
  description: string,
  selectedNotes: NewsletterNote[],
  header: HeaderConfig,
  footer: FooterConfig,
  approvalButtons?: { newsletterId: string; baseUrl: string }
): string {
  // ✅ Generar HTML de todas las notas usando los nuevos generadores modulares
  let notesHtml = '';

  selectedNotes.forEach((newsletterNote) => {
    const note = newsletterNote.noteData;
    notesHtml += `<div class="note-section">`;

    // Añadir el contenedor interno con borde personalizable
    const containerBorderWidth = note.containerBorderWidth ?? 1;
    const containerBorderColor = note.containerBorderColor ?? '#e0e0e0';
    const containerBorderRadius = note.containerBorderRadius ?? 12;
    const containerPadding = note.containerPadding ?? 10;
    const containerMaxWidth = note.containerMaxWidth ?? 560;

    notesHtml += `<div style="max-width: ${containerMaxWidth}px; margin: 0 auto; padding: ${containerPadding}px; border-radius: ${containerBorderRadius}px; border: ${containerBorderWidth}px solid ${containerBorderColor};">`;

    // Renderizar cada componente usando el sistema unificado
    // Verificar si objData ya es un objeto o es un string JSON
    const objData = typeof note.objData === 'string' 
      ? JSON.parse(note.objData) 
      : note.objData;
    
    objData.forEach((component: EmailComponent) => {
      notesHtml += renderComponentToHtml(component);
    });

    notesHtml += `</div>`; // Cerrar contenedor interno
    notesHtml += `</div>`;
  });

  // ✅ Usar el nuevo template modular
  return generateNewsletterTemplate(title, description, notesHtml, header, footer, approvalButtons);
}

/**
 * Genera HTML escapado para AWS SES
 */
export function generateEscapedHtml(html: string): string {
  return html.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

/**
 * Genera HTML para una nota individual (sin header y footer de newsletter)
 * Usa los mismos estilos de componentes que el newsletter
 */
export function generateSingleNoteHtml(
  noteTitle: string,
  noteDescription: string,
  components: EmailComponent[],
  containerConfig?: ContainerConfig
): string {
  // ✅ Generar HTML de todos los componentes usando los nuevos generadores
  const componentsHtml = components
    .map((component) => {
      // Verificar si es un contenedor de nota
      if (component.type === 'noteContainer') {
        return renderComponentToHtml(component);
      } else {
        return renderComponentToHtml(component);
      }
    })
    .join('');

  // ✅ Usar el nuevo template modular
  return generateSingleNoteTemplate(noteTitle, noteDescription, componentsHtml, containerConfig);
}
