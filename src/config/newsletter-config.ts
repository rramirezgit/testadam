/**
 * Newsletter Configuration
 *
 * Este archivo centraliza la configuración de newsletters incluyendo temas,
 * colores y otras opciones personalizables.
 *
 * Los temas pueden ser sobrescritos usando la variable de entorno:
 * NEXT_PUBLIC_NEWSLETTER_THEMES
 */

// ----------------------------------------------------------------------

export type NewsletterTheme = {
  id: string;
  name: string;
  gradientColors: [string, string];
  gradientDirection: number;
  textColor: string;
};

// ----------------------------------------------------------------------

/**
 * Temas por defecto para newsletters
 * Estos temas proporcionan diferentes esquemas de color para personalizar newsletters
 */
const DEFAULT_NEWSLETTER_THEMES: NewsletterTheme[] = [
  //   {
  //     id: 'default',
  //     name: 'Default Adac',
  //     gradientColors: ['#FFF9CE', '#E2E5FA'],
  //     gradientDirection: 135,
  //     textColor: '#1e293b', // Texto oscuro para fondos claros
  //   },
  {
    id: 'ocean-deep',
    name: '',
    gradientColors: ['#287FA9', '#1E2B62'],
    gradientDirection: 135,
    textColor: '#ffffff', // Texto blanco para fondos oscuros
  },
  {
    id: 'deep-coral',
    name: '',
    gradientColors: ['#FF6B6B', '#4A1A3D'],
    gradientDirection: 135,
    textColor: '#ffffff', // Texto blanco
  },
  {
    id: '',
    name: '',
    gradientColors: ['#FF8C42', '#C1272D'],
    gradientDirection: 135,
    textColor: '#ffffff', // Texto blanco
  },
  {
    id: 'golden-dawn',
    name: '',
    gradientColors: ['#F7971E', '#542344'],
    gradientDirection: 135,
    textColor: '#ffffff', // Texto blanco
  },
  {
    id: 'emerald-depth',
    name: '',
    gradientColors: ['#11998E', '#1B4332'],
    gradientDirection: 135,
    textColor: '#ffffff', // Texto blanco
  },
  //   {
  //     id: 'warm',
  //     name: 'Calidez Sutil',
  //     gradientColors: ['#fef7ed', '#fed7aa'],
  //     gradientDirection: 135,
  //     textColor: '#7c2d12', // Texto marrón oscuro
  //   },
  //   {
  //     id: 'ocean',
  //     name: 'Brisa Marina',
  //     gradientColors: ['#f0f9ff', '#bae6fd'],
  //     gradientDirection: 135,
  //     textColor: '#0c4a6e', // Texto azul oscuro
  //   },
  //   {
  //     id: 'forest',
  //     name: 'Verde Sereno',
  //     gradientColors: ['#f0fdf4', '#bbf7d0'],
  //     gradientDirection: 135,
  //     textColor: '#14532d', // Texto verde oscuro
  //   },
  //   {
  //     id: 'lavender',
  //     name: 'Lavanda Suave',
  //     gradientColors: ['#faf5ff', '#e9d5ff'],
  //     gradientDirection: 135,
  //     textColor: '#581c87', // Texto púrpura oscuro
  //   },
  //   {
  //     id: 'rose',
  //     name: 'Rosa Delicado',
  //     gradientColors: ['#fff1f2', '#fecdd3'],
  //     gradientDirection: 135,
  //     textColor: '#881337', // Texto rosa oscuro
  //   },
  //   {
  //     id: 'golden',
  //     name: 'Dorado Refinado',
  //     gradientColors: ['#fffbeb', '#fde68a'],
  //     gradientDirection: 135,
  //     textColor: '#92400e', // Texto ámbar oscuro
  //   },
  //   {
  //     id: 'slate',
  //     name: 'Gris Sofisticado',
  //     gradientColors: ['#f8fafc', '#cbd5e1'],
  //     gradientDirection: 135,
  //     textColor: '#0f172a', // Texto muy oscuro
  //   },
];

// ----------------------------------------------------------------------

/**
 * Obtiene los temas de newsletter desde variables de entorno o usa los por defecto
 *
 * @returns Array de temas de newsletter
 */
export function getNewsletterThemes(): NewsletterTheme[] {
  // Intentar leer desde variable de entorno
  const envThemes = process.env.NEXT_PUBLIC_NEWSLETTER_THEMES;

  if (envThemes) {
    try {
      const parsedThemes = JSON.parse(envThemes);

      // Validar que sea un array y tenga la estructura correcta
      if (Array.isArray(parsedThemes) && parsedThemes.length > 0) {
        console.log('✅ Temas de newsletter cargados desde variable de entorno');
        return parsedThemes as NewsletterTheme[];
      }
    } catch (error) {
      console.error('❌ Error parsing NEXT_PUBLIC_NEWSLETTER_THEMES:', error);
      console.log('🔄 Usando temas por defecto');
    }
  }

  // Retornar temas por defecto
  return DEFAULT_NEWSLETTER_THEMES;
}

// ----------------------------------------------------------------------

/**
 * Busca un tema específico por su ID
 *
 * @param themeId - ID del tema a buscar
 * @returns El tema encontrado o el tema por defecto
 */
export function getNewsletterThemeById(themeId: string): NewsletterTheme {
  const themes = getNewsletterThemes();
  return themes.find((theme) => theme.id === themeId) || themes[0];
}

// ----------------------------------------------------------------------

/**
 * Configuración exportada para usar en el proyecto
 */
export const NEWSLETTER_CONFIG = {
  themes: getNewsletterThemes(),
  defaultThemeId: 'default',

  // Puedes agregar más configuraciones aquí
  maxTitleLength: 100,
  maxDescriptionLength: 500,

  // Opciones de exportación
  exportFormats: ['html', 'pdf', 'json'] as const,

  // Límites de componentes
  maxComponentsPerNewsletter: 50,
} as const;

// ----------------------------------------------------------------------

export type NewsletterConfig = typeof NEWSLETTER_CONFIG;
