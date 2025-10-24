/**
 * Newsletter Theme Helper
 *
 * Utilidades para crear y validar temas de newsletter fácilmente
 */

import type { NewsletterTheme } from './newsletter-config';

// ----------------------------------------------------------------------

/**
 * Crea un nuevo tema de newsletter con validación básica
 *
 * @param theme - Objeto con las propiedades del tema
 * @returns NewsletterTheme validado
 * @throws Error si el tema no es válido
 */
export function createNewsletterTheme(theme: Partial<NewsletterTheme>): NewsletterTheme {
  if (!theme.id || !theme.name) {
    throw new Error('El tema debe tener id y name');
  }

  if (!theme.gradientColors || theme.gradientColors.length !== 2) {
    throw new Error('gradientColors debe ser un array con exactamente 2 colores');
  }

  if (!isValidHexColor(theme.gradientColors[0]) || !isValidHexColor(theme.gradientColors[1])) {
    throw new Error('Los colores del gradiente deben ser hex válidos (#RRGGBB)');
  }

  if (!theme.textColor || !isValidHexColor(theme.textColor)) {
    throw new Error('textColor debe ser un color hex válido (#RRGGBB)');
  }

  const direction = theme.gradientDirection ?? 135;
  if (direction < 0 || direction > 360) {
    throw new Error('gradientDirection debe estar entre 0 y 360');
  }

  return {
    id: theme.id,
    name: theme.name,
    gradientColors: theme.gradientColors as [string, string],
    gradientDirection: direction,
    textColor: theme.textColor,
  };
}

// ----------------------------------------------------------------------

/**
 * Valida si un string es un color hexadecimal válido
 *
 * @param color - String a validar
 * @returns true si es un color hex válido
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

// ----------------------------------------------------------------------

/**
 * Convierte un array de temas a JSON string para usar en .env
 *
 * @param themes - Array de temas
 * @returns JSON string minificado
 */
export function themesToEnvString(themes: NewsletterTheme[]): string {
  return JSON.stringify(themes);
}

// ----------------------------------------------------------------------

/**
 * Parse un string de temas desde variable de entorno
 *
 * @param envString - String JSON desde .env
 * @returns Array de temas parseado o null si hay error
 */
export function parseThemesFromEnv(envString: string): NewsletterTheme[] | null {
  try {
    const parsed = JSON.parse(envString);

    if (!Array.isArray(parsed)) {
      console.error('❌ NEXT_PUBLIC_NEWSLETTER_THEMES debe ser un array');
      return null;
    }

    // Validar cada tema
    const validatedThemes = parsed.map((theme, index) => {
      try {
        return createNewsletterTheme(theme);
      } catch (error) {
        console.error(`❌ Error en tema índice ${index}:`, error);
        throw error;
      }
    });

    return validatedThemes;
  } catch (error) {
    console.error('❌ Error parseando NEXT_PUBLIC_NEWSLETTER_THEMES:', error);
    return null;
  }
}

// ----------------------------------------------------------------------

/**
 * Genera CSS para el gradiente de un tema
 *
 * @param theme - Tema de newsletter
 * @returns String con el CSS del gradiente
 */
export function getThemeGradientCSS(theme: NewsletterTheme): string {
  const [color1, color2] = theme.gradientColors;
  return `linear-gradient(${theme.gradientDirection}deg, ${color1}, ${color2})`;
}

// ----------------------------------------------------------------------

/**
 * Calcula el contraste entre dos colores (WCAG 2.0)
 * Útil para verificar accesibilidad del texto sobre el gradiente
 *
 * @param hex1 - Color 1 en hex
 * @param hex2 - Color 2 en hex
 * @returns Ratio de contraste
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    /* eslint-disable no-bitwise */
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = ((rgb >> 0) & 0xff) / 255;
    /* eslint-enable no-bitwise */

    const [rs, gs, bs] = [r, g, b].map((c) => {
      if (c <= 0.03928) return c / 12.92;
      return Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// ----------------------------------------------------------------------

/**
 * Verifica si un tema tiene buen contraste de texto (WCAG AA)
 *
 * @param theme - Tema a verificar
 * @returns true si cumple con WCAG AA (ratio >= 4.5)
 */
export function hasGoodTextContrast(theme: NewsletterTheme): boolean {
  // Verificar contraste contra ambos colores del gradiente
  const ratio1 = getContrastRatio(theme.textColor, theme.gradientColors[0]);
  const ratio2 = getContrastRatio(theme.textColor, theme.gradientColors[1]);

  // Debe cumplir WCAG AA (4.5:1) contra al menos uno de los colores
  return ratio1 >= 4.5 || ratio2 >= 4.5;
}

// ----------------------------------------------------------------------

/**
 * Ejemplo de uso:
 *
 * ```typescript
 * const miTema = createNewsletterTheme({
 *   id: 'mi-tema',
 *   name: 'Mi Tema Personalizado',
 *   gradientColors: ['#ff0000', '#0000ff'],
 *   gradientDirection: 90,
 *   textColor: '#ffffff'
 * });
 *
 * console.log('Tema válido:', miTema);
 * console.log('CSS:', getThemeGradientCSS(miTema));
 * console.log('Buen contraste:', hasGoodTextContrast(miTema));
 *
 * // Para generar el string para .env:
 * const envString = themesToEnvString([miTema]);
 * console.log('NEXT_PUBLIC_NEWSLETTER_THEMES=' + envString);
 * ```
 */
