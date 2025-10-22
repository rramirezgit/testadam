/**
 * Generador de HTML para componente Paragraph
 * Usa etiqueta semántica <p> o <div> según configuración
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { EMAIL_STYLES } from '../utils/email-styles';
import { stylesToString, cleanTipTapHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

export function generateParagraphHtml(component: EmailComponent): string {
  // Obtener estilos base
  const baseStyles = { ...EMAIL_STYLES.paragraph };

  // ✅ Respetar TODOS los estilos personalizados del componente
  const customStyles = component.style || {};

  // Merge de estilos: base + personalizados
  const mergedStyles = { ...baseStyles, ...customStyles };

  // Convertir a string inline
  const styleString = stylesToString(mergedStyles);

  // Limpiar contenido HTML de TipTap
  const content = cleanTipTapHtml(component.content || '');

  // ✅ Manejar párrafos de código (isCode prop)
  if (component.props?.isCode) {
    const codeStyles = {
      backgroundColor: '#f4f4f4',
      padding: '16px',
      borderRadius: '5px',
      border: '1px solid #eee',
      color: '#333',
      fontFamily: 'monospace',
      ...customStyles,
    };

    return `<div style="${stylesToString(codeStyles)}">${content}</div>`;
  }

  // ✅ Usar div para mayor control de espaciado (como en el código original)
  // El código original usa <div class="component-paragraph"> en lugar de <p>
  return `<div class="component-paragraph" style="${styleString}">${content}</div>`;
}
