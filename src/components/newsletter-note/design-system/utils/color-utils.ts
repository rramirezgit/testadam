// ============================================================================
// COLOR UTILITIES - Newsletter Design System
// ============================================================================

import type { ColorAccessibility } from '../types';

/**
 * Convierte un color hexadecimal a RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Convierte RGB a hexadecimal
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number): string => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Convierte un color hexadecimal a HSL
 */
export const hexToHsl = (hex: string): { h: number; s: number; l: number } | null => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

/**
 * Convierte HSL a hexadecimal
 */
export const hslToHex = (h: number, s: number, l: number): string => {
  h = h % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return rgbToHex(r, g, b);
};

/**
 * Calcula la luminancia relativa de un color
 */
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  const [rSRGB, gSRGB, bSRGB] = [r, g, b].map((c) => {
    const normalized = c / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rSRGB + 0.7152 * gSRGB + 0.0722 * bSRGB;
};

/**
 * Calcula el ratio de contraste entre dos colores
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Verifica si dos colores cumplen con los estándares de accesibilidad WCAG
 */
export const checkColorAccessibility = (color1: string, color2: string): ColorAccessibility => {
  const contrastRatio = getContrastRatio(color1, color2);
  const roundedRatio = Math.round(contrastRatio * 100) / 100;

  const wcagAA = contrastRatio >= 4.5;
  const wcagAAA = contrastRatio >= 7.0;

  const recommendations: string[] = [];
  if (!wcagAA) {
    recommendations.push('Considera usar colores con mayor contraste');
    recommendations.push('Ratio mínimo requerido: 4.5:1 para WCAG AA');
  } else if (wcagAA && !wcagAAA) {
    recommendations.push('Cumple WCAG AA, considera mejorar para AAA');
    recommendations.push('Para WCAG AAA se necesita ratio 7:1');
  } else {
    recommendations.push('Excelente contraste para máxima accesibilidad');
    recommendations.push('Cumple con WCAG AAA');
  }

  return {
    wcagAA,
    wcagAAA,
    contrastRatio: roundedRatio,
    recommendations,
  };
};

/**
 * Ajusta la luminosidad de un color
 */
export const adjustLightness = (hex: string, amount: number): string => {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newLightness = Math.max(0, Math.min(100, hsl.l + amount));
  return hslToHex(hsl.h, hsl.s, newLightness);
};

/**
 * Ajusta la saturación de un color
 */
export const adjustSaturation = (hex: string, amount: number): string => {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newSaturation = Math.max(0, Math.min(100, hsl.s + amount));
  return hslToHex(hsl.h, newSaturation, hsl.l);
};

/**
 * Rota el matiz de un color
 */
export const rotateHue = (hex: string, degrees: number): string => {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;

  const newHue = (hsl.h + degrees) % 360;
  return hslToHex(newHue < 0 ? newHue + 360 : newHue, hsl.s, hsl.l);
};

/**
 * Genera una variación más clara de un color
 */
export const lighten = (hex: string, amount: number = 10): string => adjustLightness(hex, amount);

/**
 * Genera una variación más oscura de un color
 */
export const darken = (hex: string, amount: number = 10): string => adjustLightness(hex, -amount);

/**
 * Genera una variación más saturada de un color
 */
export const saturate = (hex: string, amount: number = 10): string => adjustSaturation(hex, amount);

/**
 * Genera una variación menos saturada de un color
 */
export const desaturate = (hex: string, amount: number = 10): string =>
  adjustSaturation(hex, -amount);

/**
 * Valida si una cadena es un color hexadecimal válido
 */
export const isValidHex = (hex: string): boolean => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

/**
 * Convierte un color de 3 dígitos a 6 dígitos
 */
export const expandHex = (hex: string): string => {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
};

/**
 * Obtiene el color de texto óptimo (blanco o negro) para un fondo dado
 */
export const getOptimalTextColor = (backgroundColor: string): string => {
  const contrastWithWhite = getContrastRatio(backgroundColor, '#ffffff');
  const contrastWithBlack = getContrastRatio(backgroundColor, '#000000');

  return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000';
};

/**
 * Genera una paleta monocromática basada en un color base
 */
export const generateMonochromaticPalette = (baseColor: string, steps: number = 5): string[] => {
  const hsl = hexToHsl(baseColor);
  if (!hsl) return [baseColor];

  const palette: string[] = [];
  const lightnesStep = 80 / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const lightness = 10 + i * lightnesStep;
    palette.push(hslToHex(hsl.h, hsl.s, lightness));
  }

  return palette;
};

/**
 * Mezcla dos colores
 */
export const mixColors = (color1: string, color2: string, ratio: number = 0.5): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio);

  return rgbToHex(r, g, b);
};

/**
 * Convierte un color a escala de grises
 */
export const toGrayscale = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  // Usar la fórmula de luminancia percibida
  const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
  return rgbToHex(gray, gray, gray);
};
