// ============================================================================
// DESIGN UTILITIES - Newsletter Design System
// ============================================================================

import type { DeviceType, SpacingScale, BreakpointSettings } from '../types';

/**
 * Obtiene el breakpoint para un dispositivo
 */
export const getBreakpointForDevice = (
  device: DeviceType,
  breakpoints: BreakpointSettings
): number => {
  switch (device) {
    case 'mobile':
      return breakpoints.sm;
    case 'tablet':
      return breakpoints.md;
    case 'desktop':
      return breakpoints.lg;
    default:
      return breakpoints.md;
  }
};

/**
 * Calcula el spacing usando la escala de espaciado
 */
export const getSpacing = (
  scale: keyof SpacingScale['scale'],
  spacingConfig: SpacingScale
): number => spacingConfig.scale[scale];

/**
 * Genera clases CSS para espaciado responsivo
 */
export const generateResponsiveSpacing = (
  property: 'margin' | 'padding',
  spacing: number,
  unit: string = 'px'
): string => `${property}: ${spacing}${unit};`;

/**
 * Calcula el número de columnas para un grid responsivo
 */
export const calculateGridColumns = (
  deviceWidth: number,
  breakpoints: BreakpointSettings
): number => {
  if (deviceWidth < breakpoints.sm) return 1;
  if (deviceWidth < breakpoints.md) return 2;
  if (deviceWidth < breakpoints.lg) return 3;
  return 4;
};

/**
 * Genera CSS para un contenedor responsivo
 */
export const generateContainerCSS = (
  maxWidth: string,
  padding: number,
  center: boolean = true
): string =>
  `
    max-width: ${maxWidth};
    padding: 0 ${padding}px;
    ${center ? 'margin: 0 auto;' : ''}
  `.trim();

/**
 * Calcula el ancho óptimo para emails
 */
export const getOptimalEmailWidth = (device: DeviceType): number => {
  switch (device) {
    case 'mobile':
      return 320;
    case 'tablet':
      return 480;
    case 'desktop':
      return 600;
    default:
      return 600;
  }
};

/**
 * Genera media queries para responsive design
 */
export const generateMediaQuery = (minWidth: number, css: string): string =>
  `@media (min-width: ${minWidth}px) { ${css} }`;

/**
 * Calcula el aspect ratio de una imagen
 */
export const calculateAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
};

/**
 * Genera estilos para un botón responsivo
 */
export const generateButtonStyles = (
  fontSize: number,
  padding: { x: number; y: number },
  borderRadius: number
): string =>
  `
    font-size: ${fontSize}px;
    padding: ${padding.y}px ${padding.x}px;
    border-radius: ${borderRadius}px;
    display: inline-block;
    text-decoration: none;
    border: none;
    cursor: pointer;
  `.trim();

/**
 * Convierte pixel a rem
 */
export const pxToRem = (px: number, baseFontSize: number = 16): string => `${px / baseFontSize}rem`;

/**
 * Convierte rem a pixel
 */
export const remToPx = (rem: number, baseFontSize: number = 16): number => rem * baseFontSize;

/**
 * Genera estilos de grid CSS
 */
export const generateGridStyles = (columns: number, gap: number, unit: string = 'px'): string =>
  `
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: ${gap}${unit};
  `.trim();

/**
 * Calcula el ancho de columna en un grid
 */
export const calculateColumnWidth = (
  containerWidth: number,
  columns: number,
  gap: number
): number => (containerWidth - gap * (columns - 1)) / columns;

/**
 * Genera estilos flex para centrado
 */
export const generateFlexCenter = (direction: 'row' | 'column' = 'row'): string =>
  `
    display: flex;
    flex-direction: ${direction};
    align-items: center;
    justify-content: center;
  `.trim();

/**
 * Calcula el line-height óptimo para la legibilidad
 */
export const calculateOptimalLineHeight = (fontSize: number): number => {
  // Fórmula para line-height óptimo basado en el tamaño de fuente
  if (fontSize <= 12) return 1.4;
  if (fontSize <= 16) return 1.5;
  if (fontSize <= 24) return 1.4;
  if (fontSize <= 32) return 1.3;
  return 1.2;
};

/**
 * Genera estilos de texto responsivo
 */
export const generateResponsiveText = (
  desktopSize: number,
  mobileSize?: number,
  breakpoint: number = 768
): string => {
  const mobile = mobileSize || Math.max(14, desktopSize * 0.85);
  return `
    font-size: ${mobile}px;
    @media (min-width: ${breakpoint}px) {
      font-size: ${desktopSize}px;
    }
  `.trim();
};

/**
 * Calcula el contraste de color para texto
 */
export const getTextColorForBackground = (backgroundColor: string): 'dark' | 'light' => {
  // Función simple para determinar si usar texto claro u oscuro
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'dark' : 'light';
};

/**
 * Genera estilos para animaciones suaves
 */
export const generateTransition = (
  property: string = 'all',
  duration: number = 300,
  easing: string = 'ease'
): string => `transition: ${property} ${duration}ms ${easing};`;

/**
 * Calcula el tamaño óptimo de fuente para dispositivos
 */
export const getOptimalFontSize = (
  baseSize: number,
  device: DeviceType,
  scaleFactor: number = 1
): number => {
  const deviceMultipliers = {
    mobile: 0.9,
    tablet: 0.95,
    desktop: 1,
    email: 1,
  };

  return Math.round(baseSize * deviceMultipliers[device] * scaleFactor);
};

/**
 * Genera estilos para sombras consistentes
 */
export const generateBoxShadow = (elevation: 'low' | 'medium' | 'high' = 'medium'): string => {
  const shadows = {
    low: '0 1px 3px rgba(0, 0, 0, 0.12)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    high: '0 10px 25px rgba(0, 0, 0, 0.15)',
  };

  return `box-shadow: ${shadows[elevation]};`;
};

/**
 * Valida si un valor está dentro de un rango
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Genera estilos para bordes redondeados responsivos
 */
export const generateResponsiveBorderRadius = (baseRadius: number, device: DeviceType): string => {
  const deviceMultipliers = {
    mobile: 0.8,
    tablet: 0.9,
    desktop: 1,
    email: 1,
  };

  const radius = Math.round(baseRadius * deviceMultipliers[device]);
  return `border-radius: ${radius}px;`;
};
