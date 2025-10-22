/**
 * Utilidades para manipulación de HTML
 */

/**
 * Escapa caracteres HTML para prevenir XSS
 */
export function escapeHtml(text: string): string {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Limpia el HTML del TipTap editor para hacerlo compatible con emails
 * Mantiene formato básico (strong, em, u, a, span con color) y elimina clases y elementos incompatibles
 */
export function cleanTipTapHtml(html: string): string {
  if (!html) return '';

  return (
    html
      // Remover elementos de TipTap que no son compatibles con emails
      .replace(/<p[^>]*class="[^"]*tiptap[^"]*"[^>]*>/gi, '')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '')
      // Mantener solo elementos básicos de formato
      .replace(/<strong[^>]*>/gi, '<strong>')
      .replace(/<\/strong>/gi, '</strong>')
      .replace(/<em[^>]*>/gi, '<em>')
      .replace(/<\/em>/gi, '</em>')
      .replace(/<u[^>]*>/gi, '<u>')
      .replace(/<\/u>/gi, '</u>')
      .replace(
        /<a[^>]*href="([^"]*)"[^>]*>/gi,
        '<a href="$1" style="color: inherit; text-decoration: underline;">'
      )
      .replace(/<\/a>/gi, '</a>')
      // Preservar spans con estilos de color (TipTap usa esto para colores de texto)
      .replace(/<span[^>]*style="([^"]*color[^"]*)"[^>]*>/gi, '<span style="$1">')
      .replace(/<\/span>/gi, '</span>')
      // Remover cualquier otro elemento HTML no compatible
      .replace(/<(?!\/?(strong|em|u|a|span)\b)[^>]*>/gi, '')
      .trim()
  );
}

/**
 * Convierte nombres de propiedades de camelCase a kebab-case para CSS
 * Ejemplo: backgroundColor -> background-color
 */
export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Convierte un objeto de estilos a string CSS inline
 */
export function stylesToString(styles: Record<string, any>): string {
  return Object.entries(styles)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ');
}

/**
 * Convierte color HEX a RGBA con opacidad
 */
export function hexToRgba(hex: string, opacity: number): string {
  if (hex.startsWith('#')) {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  }

  // Si ya es rgba, ajustar opacidad
  if (hex.includes('rgba')) {
    return hex.replace(/[\d.]+\)$/g, `${opacity / 100})`);
  }

  return hex;
}

/**
 * Procesa URL de iconos (soporta URLs directas, iconify format, icons8)
 */
export function getIconUrl(icon: string): string {
  if (!icon) return '';

  // Si es URL completa, usar directamente
  if (icon.startsWith('http')) {
    return icon;
  }

  // Si es formato iconify (collection:name)
  if (icon.includes(':')) {
    const iconName = icon.split(':')[1] || icon.split(':')[0];
    return `https://img.icons8.com/color/48/${iconName}.png`;
  }

  // Por defecto, usar icons8
  return `https://img.icons8.com/color/48/${icon}.png`;
}
