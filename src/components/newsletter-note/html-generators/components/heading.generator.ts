/**
 * Generador de HTML para componente Heading
 * Usa etiquetas semánticas <h1> a <h6>
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { EMAIL_STYLES } from '../utils/email-styles';
import { outlookCenterWrapper } from '../utils/outlook-helpers';
import { stylesToString, cleanTipTapHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

export function generateHeadingHtml(component: EmailComponent): string {
  // Determinar nivel del heading (1-6)
  const level = Math.min(Math.max(component.props?.level || 2, 1), 6) as 1 | 2 | 3 | 4 | 5 | 6;
  const Tag = `h${level}` as const;

  // Obtener estilos base para el nivel
  const baseStyles = EMAIL_STYLES.heading(level);

  // ✅ Respetar TODOS los estilos personalizados del usuario
  const customStyles = component.style || {};

  // Merge de estilos: base + personalizados (personalizados tienen prioridad)
  const mergedStyles = { ...baseStyles, ...customStyles };

  // Convertir a string inline
  const styleString = stylesToString(mergedStyles);

  // Limpiar contenido HTML de TipTap
  const content = cleanTipTapHtml(component.content || '');

  // ✅ Manejar alineación (especialmente para centrado en Outlook)
  const alignment = component.props?.align || component.style?.textAlign;

  if (alignment === 'center') {
    // Para Outlook, usar tabla wrapper
    return outlookCenterWrapper(
      `<${Tag} style="${styleString}; text-align: center;">${content}</${Tag}>`
    );
  }

  // Aplicar alineación si existe
  const finalStyle = alignment ? `${styleString}; text-align: ${alignment}` : styleString;

  return `<${Tag} style="${finalStyle}">${content}</${Tag}>`;
}
