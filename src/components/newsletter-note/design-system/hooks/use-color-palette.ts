/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState, useCallback } from 'react';

import {
  colorPalettes,
  getPaletteById,
  getFeaturedPalettes,
  getPalettesByCategory,
  getAccessiblePalettes,
  colorPaletteCategories,
} from '../data/color-palettes';

import type {
  ColorPalette,
  ColorHarmony,
  CustomColorSet,
  ColorHarmonyType,
  ColorAccessibility,
  ColorPaletteCategory,
  UseColorPaletteReturn,
} from '../types';

// ============================================================================
// USE COLOR PALETTE HOOK - Newsletter Design System
// ============================================================================

/**
 * Hook para gestionar paletas de colores del design system
 * Incluye funciones para seleccionar, generar armonías, validar accesibilidad
 */
export const useColorPalette = (): UseColorPaletteReturn => {
  // Estado para la paleta seleccionada
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(() => {
    // Inicializar con la primera palette destacada
    const featured = getFeaturedPalettes(1);
    return featured[0] || null;
  });

  // Estado para colores personalizados
  const [customColors, setCustomColors] = useState<CustomColorSet>({});

  // Estado para filtro de categorías
  const [selectedCategory, setSelectedCategory] = useState<ColorPaletteCategory | 'all'>('all');

  // Función para establecer paleta activa
  const setPalette = useCallback((palette: ColorPalette) => {
    setSelectedPalette(palette);
  }, []);

  // Función para actualizar color personalizado
  const updateCustomColor = useCallback((key: string, color: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [key]: color,
    }));
  }, []);

  // Función para eliminar color personalizado
  const removeCustomColor = useCallback((key: string) => {
    setCustomColors((prev) => {
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Función para limpiar colores personalizados
  const clearCustomColors = useCallback(() => {
    setCustomColors({});
  }, []);

  // Función para generar armonía de colores
  const generateHarmony = useCallback((baseColor: string, type: ColorHarmonyType): ColorHarmony => {
    // Convertir color hex a HSL para cálculos
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0,
        s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
          default:
            h = 0;
            break;
        }
        h /= 6;
      }

      return [h * 360, s * 100, l * 100];
    };

    // Convertir HSL a hex
    const hslToHex = (h: number, s: number, l: number) => {
      h = h % 360;
      s = Math.max(0, Math.min(100, s)) / 100;
      l = Math.max(0, Math.min(100, l)) / 100;

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r = 0,
        g = 0,
        b = 0;

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

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const [baseH, baseS, baseL] = hexToHsl(baseColor);
    const colors: string[] = [baseColor];

    switch (type) {
      case 'complementary':
        colors.push(hslToHex((baseH + 180) % 360, baseS, baseL));
        break;

      case 'triadic':
        colors.push(hslToHex((baseH + 120) % 360, baseS, baseL));
        colors.push(hslToHex((baseH + 240) % 360, baseS, baseL));
        break;

      case 'analogous':
        colors.push(hslToHex((baseH + 30) % 360, baseS, baseL));
        colors.push(hslToHex((baseH - 30 + 360) % 360, baseS, baseL));
        break;

      case 'tetradic':
        colors.push(hslToHex((baseH + 90) % 360, baseS, baseL));
        colors.push(hslToHex((baseH + 180) % 360, baseS, baseL));
        colors.push(hslToHex((baseH + 270) % 360, baseS, baseL));
        break;

      case 'split-complementary':
        colors.push(hslToHex((baseH + 150) % 360, baseS, baseL));
        colors.push(hslToHex((baseH + 210) % 360, baseS, baseL));
        break;

      case 'monochromatic':
        colors.push(hslToHex(baseH, baseS, Math.max(0, baseL - 20)));
        colors.push(hslToHex(baseH, baseS, Math.min(100, baseL + 20)));
        colors.push(hslToHex(baseH, baseS, Math.max(0, baseL - 40)));
        colors.push(hslToHex(baseH, baseS, Math.min(100, baseL + 40)));
        break;

      default:
        break;
    }

    const descriptions = {
      complementary: 'Colores opuestos en el círculo cromático que crean contraste fuerte',
      triadic: 'Tres colores equidistantes que crean vibración equilibrada',
      analogous: 'Colores adyacentes que crean armonía tranquila',
      tetradic: 'Cuatro colores en forma rectangular para máxima variedad',
      'split-complementary': 'Variación del complementario con menor contraste',
      monochromatic: 'Variaciones del mismo color para armonía sutil',
    };

    return {
      type,
      baseColor,
      colors,
      description: descriptions[type],
    };
  }, []);

  // Función para verificar accesibilidad de colores
  const checkAccessibility = useCallback((color1: string, color2: string): ColorAccessibility => {
    // Calcular luminancia relativa
    const getLuminance = (hex: string) => {
      const rgb = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)]
        .map((c) => parseInt(c, 16) / 255)
        .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));

      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    const contrastRatio = (brightest + 0.05) / (darkest + 0.05);

    const wcagAA = contrastRatio >= 4.5;
    const wcagAAA = contrastRatio >= 7.0;

    const recommendations = [];
    if (!wcagAA) {
      recommendations.push('Considera usar colores con mayor contraste');
    }
    if (wcagAA && !wcagAAA) {
      recommendations.push('Cumple WCAG AA, considera mejorar para AAA');
    }
    if (wcagAAA) {
      recommendations.push('Excelente contraste para máxima accesibilidad');
    }

    return {
      wcagAA,
      wcagAAA,
      contrastRatio: Math.round(contrastRatio * 100) / 100,
      recommendations,
    };
  }, []);

  // Función para exportar paleta en diferentes formatos
  const exportPalette = useCallback(
    (format: 'json' | 'css' | 'figma'): string => {
      if (!selectedPalette) return '';

      switch (format) {
        case 'json':
          return JSON.stringify(
            {
              ...selectedPalette,
              customColors,
              exportDate: new Date().toISOString(),
            },
            null,
            2
          );

        case 'css':
          const cssVars = Object.entries(selectedPalette)
            .filter(([key]) => typeof selectedPalette[key as keyof ColorPalette] === 'string')
            .map(([key, value]) => `  --${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
            .join('\n');

          const customCssVars = Object.entries(customColors)
            .map(([key, value]) => `  --custom-${key}: ${value};`)
            .join('\n');

          return `:root {\n${cssVars}${customCssVars ? '\n' + customCssVars : ''}\n}`;

        case 'figma':
          // Formato compatible con Figma tokens
          const figmaTokens = {
            colors: {
              ...Object.fromEntries(
                Object.entries(selectedPalette)
                  .filter(([key]) => typeof selectedPalette[key as keyof ColorPalette] === 'string')
                  .map(([key, value]) => [key, { value, type: 'color' }])
              ),
              custom: Object.fromEntries(
                Object.entries(customColors).map(([key, value]) => [key, { value, type: 'color' }])
              ),
            },
          };
          return JSON.stringify(figmaTokens, null, 2);

        default:
          return '';
      }
    },
    [selectedPalette, customColors]
  );

  // Función para importar paleta
  const importPalette = useCallback(
    (data: string, format: 'json' | 'css' | 'figma'): ColorPalette | null => {
      try {
        switch (format) {
          case 'json':
            const jsonData = JSON.parse(data);
            if (jsonData.id && jsonData.name && jsonData.primary) {
              return jsonData as ColorPalette;
            }
            break;

          case 'css':
            // Extraer variables CSS simples
            const cssMatches = data.match(/--[\w-]+:\s*#[0-9a-fA-F]{6};/g);
            if (cssMatches) {
              const colors = cssMatches.reduce(
                (acc, match) => {
                  const [property, value] = match.split(':');
                  const key = property
                    .replace('--', '')
                    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                  acc[key] = value.replace(';', '').trim();
                  return acc;
                },
                {} as Record<string, string>
              );

              if (colors.primary) {
                return {
                  id: `imported_${Date.now()}`,
                  name: 'Imported Palette',
                  category: 'corporate',
                  description: 'Imported from CSS',
                  ...colors,
                } as ColorPalette;
              }
            }
            break;

          case 'figma':
            const figmaData = JSON.parse(data);
            if (figmaData.colors) {
              const colors = Object.fromEntries(
                Object.entries(figmaData.colors).map(([key, token]: [string, any]) => [
                  key,
                  token.value,
                ])
              );

              if (colors.primary) {
                return {
                  id: `figma_${Date.now()}`,
                  name: 'Figma Palette',
                  category: 'corporate',
                  description: 'Imported from Figma',
                  ...colors,
                } as ColorPalette;
              }
            }
            break;

          default:
            console.warn(`Unsupported import format: ${format}`);
            break;
        }
      } catch (error) {
        console.error('Error importing palette:', error);
      }

      return null;
    },
    []
  );

  // Paletas filtradas por categoría
  const filteredPalettes = useMemo(() => {
    if (selectedCategory === 'all') {
      return colorPalettes;
    }
    return getPalettesByCategory(selectedCategory);
  }, [selectedCategory]);

  // Estadísticas de paletas
  const paletteStats = useMemo(
    () => ({
      total: colorPalettes.length,
      accessible: getAccessiblePalettes().length,
      byCategory: colorPaletteCategories.reduce(
        (acc, category) => {
          acc[category] = getPalettesByCategory(category).length;
          return acc;
        },
        {} as Record<ColorPaletteCategory, number>
      ),
      customColorsCount: Object.keys(customColors).length,
    }),
    [customColors]
  );

  return {
    // Paletas disponibles
    colorPalettes: filteredPalettes,
    categories: colorPaletteCategories,

    // Paleta seleccionada
    selectedPalette,
    setPalette,

    // Colores personalizados
    customColors,
    updateCustomColor,
    removeCustomColor,
    clearCustomColors,

    // Filtros
    selectedCategory,
    setSelectedCategory,

    // Paletas especiales
    accessiblePalettes: getAccessiblePalettes(),
    featuredPalettes: getFeaturedPalettes(),

    // Funciones de utilidad
    generateHarmony,
    checkAccessibility,

    // Import/Export
    exportPalette,
    importPalette,

    // Estadísticas
    paletteStats,

    // Funciones de conveniencia
    getPaletteById: (id: string) => getPaletteById(id),
    getPalettesByCategory: (category: ColorPaletteCategory) => getPalettesByCategory(category),
  };
};

export default useColorPalette;
