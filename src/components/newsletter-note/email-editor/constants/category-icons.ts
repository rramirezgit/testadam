/**
 * Pool de iconos y utilidades para asignar iconos a categorías
 * Los iconos se asignan automáticamente basándose en el nombre o ID de la categoría
 */

// Pool de iconos PNG de Icons8 para asignar automáticamente
export const CATEGORY_ICON_POOL = [
  'https://img.icons8.com/color/48/line-chart.png',
  'https://img.icons8.com/color/48/light-on.png',
  'https://img.icons8.com/color/48/star.png',
  'https://img.icons8.com/color/48/calendar.png',
  'https://img.icons8.com/color/48/error.png',
  'https://img.icons8.com/color/48/folder-tree.png',
  'https://img.icons8.com/color/48/graph.png',
  'https://img.icons8.com/color/48/conference-call.png',
  'https://img.icons8.com/color/48/artificial-intelligence.png',
  'https://img.icons8.com/color/48/note.png',
  'https://img.icons8.com/color/48/computer.png',
  'https://img.icons8.com/color/48/rocket.png',
  'https://img.icons8.com/color/48/news.png',
  'https://img.icons8.com/color/48/business.png',
  'https://img.icons8.com/color/48/brain.png',
  'https://img.icons8.com/color/48/worldwide-location.png',
  'https://img.icons8.com/color/48/trophy.png',
  'https://img.icons8.com/color/48/movie.png',
  'https://img.icons8.com/color/48/heart-health.png',
  'https://img.icons8.com/color/48/money-bag.png',
];

// Mapeo de nombres de categorías conocidas a iconos específicos
const KNOWN_CATEGORY_ICONS: Record<string, string> = {
  // Nombres en español
  Mercado: 'https://img.icons8.com/color/48/line-chart.png',
  Innovación: 'https://img.icons8.com/color/48/light-on.png',
  Innovacion: 'https://img.icons8.com/color/48/light-on.png',
  'Invitación Especial': 'https://img.icons8.com/color/48/star.png',
  'Invitacion Especial': 'https://img.icons8.com/color/48/star.png',
  'Nota del Día': 'https://img.icons8.com/color/48/calendar.png',
  'Nota del Dia': 'https://img.icons8.com/color/48/calendar.png',
  Urgente: 'https://img.icons8.com/color/48/error.png',
  Recursos: 'https://img.icons8.com/color/48/folder-tree.png',
  Tendencias: 'https://img.icons8.com/color/48/graph.png',
  Comunidad: 'https://img.icons8.com/color/48/conference-call.png',

  // Categorías generales
  Tecnología: 'https://img.icons8.com/color/48/computer.png',
  Tecnologia: 'https://img.icons8.com/color/48/computer.png',
  Negocios: 'https://img.icons8.com/color/48/business.png',
  Ciencia: 'https://img.icons8.com/color/48/brain.png',
  Política: 'https://img.icons8.com/color/48/worldwide-location.png',
  Politica: 'https://img.icons8.com/color/48/worldwide-location.png',
  Deportes: 'https://img.icons8.com/color/48/trophy.png',
  Entretenimiento: 'https://img.icons8.com/color/48/movie.png',
  Salud: 'https://img.icons8.com/color/48/heart-health.png',
  Economía: 'https://img.icons8.com/color/48/money-bag.png',
  Economia: 'https://img.icons8.com/color/48/money-bag.png',
  IA: 'https://img.icons8.com/color/48/artificial-intelligence.png',
  'Inteligencia Artificial': 'https://img.icons8.com/color/48/artificial-intelligence.png',
  Noticias: 'https://img.icons8.com/color/48/news.png',
};

// Paleta de colores y gradientes predefinidos para categorías
export const CATEGORY_COLOR_PRESETS = [
  {
    gradientColor1: 'rgba(255, 184, 77, 0.08)',
    gradientColor2: 'rgba(243, 156, 18, 0.00)',
    textColor: '#E67E22',
  },
  {
    gradientColor1: 'rgba(82, 196, 26, 0.07)',
    gradientColor2: 'rgba(56, 158, 13, 0.00)',
    textColor: '#27AE60',
  },
  {
    gradientColor1: 'rgba(156, 136, 255, 0.08)',
    gradientColor2: 'rgba(124, 77, 255, 0.00)',
    textColor: '#6C63FF',
  },
  {
    gradientColor1: 'rgba(78, 205, 196, 0.06)',
    gradientColor2: 'rgba(38, 166, 154, 0.00)',
    textColor: '#00C3C3',
  },
  {
    gradientColor1: 'rgba(255, 107, 107, 0.07)',
    gradientColor2: 'rgba(231, 76, 60, 0.00)',
    textColor: '#E74C3C',
  },
  {
    gradientColor1: 'rgba(74, 144, 226, 0.06)',
    gradientColor2: 'rgba(53, 122, 189, 0.00)',
    textColor: '#3498DB',
  },
  {
    gradientColor1: 'rgba(155, 89, 182, 0.07)',
    gradientColor2: 'rgba(142, 68, 173, 0.00)',
    textColor: '#8E44AD',
  },
  {
    gradientColor1: 'rgba(255, 159, 67, 0.08)',
    gradientColor2: 'rgba(255, 118, 117, 0.00)',
    textColor: '#FF6B35',
  },
];

/**
 * Función hash simple para convertir un string en un número
 * Usado para asignar consistentemente iconos/colores basados en ID
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + char;
    // eslint-disable-next-line no-bitwise
    hash = hash & hash; // Convertir a 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Obtiene el icono apropiado para una categoría
 *
 * @param categoryName - Nombre de la categoría
 * @param categoryId - ID de la categoría (usado para hash si no hay icono conocido)
 * @param categoryImageUrl - URL de imagen de la categoría (opcional, de la BD)
 * @returns URL del icono a usar
 */
export function getIconForCategory(
  categoryName: string,
  categoryId: string,
  categoryImageUrl?: string
): string {
  // 1. Si la categoría tiene una imagen URL definida, usarla
  if (categoryImageUrl && categoryImageUrl.trim() !== '') {
    return categoryImageUrl;
  }

  // 2. Si es una categoría conocida, usar su icono específico
  const knownIcon = KNOWN_CATEGORY_ICONS[categoryName];
  if (knownIcon) {
    return knownIcon;
  }

  // 3. Buscar coincidencia parcial (insensible a mayúsculas y acentos)
  const normalizedName = categoryName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const [key, icon] of Object.entries(KNOWN_CATEGORY_ICONS)) {
    const normalizedKey = key
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (normalizedName.includes(normalizedKey) || normalizedKey.includes(normalizedName)) {
      return icon;
    }
  }

  // 4. Si no hay coincidencia, asignar del pool basado en hash del ID
  const index = hashCode(categoryId) % CATEGORY_ICON_POOL.length;
  return CATEGORY_ICON_POOL[index];
}

/**
 * Obtiene los colores de gradiente para una categoría
 *
 * @param categoryId - ID de la categoría
 * @returns Objeto con colores de gradiente y texto
 */
export function getColorsForCategory(categoryId: string) {
  const index = hashCode(categoryId) % CATEGORY_COLOR_PRESETS.length;
  return CATEGORY_COLOR_PRESETS[index];
}

/**
 * Genera las props completas para un componente TituloConIcono basado en una categoría
 *
 * @param category - Objeto categoría con id, name e imageUrl opcional
 * @returns Props para el componente TituloConIcono
 */
export function generateTituloConIconoPropsFromCategory(category: {
  id: string;
  name: string;
  imageUrl?: string;
}) {
  const icon = getIconForCategory(category.name, category.id, category.imageUrl);
  const colors = getColorsForCategory(category.id);

  return {
    categoryId: category.id,
    categoryName: category.name,
    icon,
    ...colors,
    gradientType: 'linear' as const,
    gradientAngle: 180,
    colorDistribution: 0,
  };
}
