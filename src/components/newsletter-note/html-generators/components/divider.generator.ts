/**
 * Generador de HTML para componente Divider
 * Usa etiqueta semántica <hr>
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { EMAIL_STYLES } from '../utils/email-styles';

import type { EmailComponent } from '../types';

export function generateDividerHtml(component: EmailComponent): string {
  // ✅ Estilos base del divider
  const baseStyles = { ...EMAIL_STYLES.divider };

  // ✅ Respetar estilos personalizados
  const customBorderColor = component.style?.borderColor || component.props?.borderColor;
  const customBorderWidth = component.style?.borderWidth || component.props?.borderWidth;
  const customMargin = component.style?.margin;

  // Aplicar personalizaciones
  if (customBorderColor) {
    baseStyles.borderTop = `${customBorderWidth || '2px'} solid ${customBorderColor}`;
  }

  if (customMargin) {
    baseStyles.margin = customMargin;
  }

  // Construir string de estilos
  const styleString = Object.entries(baseStyles)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');

  return `<hr class="component-divider" style="${styleString}">`;
}
