// Configuración de variantes para el componente ImageText
// Cada variante incluye colores, estilos y una imagen predefinida

export interface ImageTextVariantConfig {
  name: string;
  displayName: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  titleColor: string;
  padding: number;
  spacing: number;
  borderRadius: number;
  defaultImageUrl: string;
  imageHeight?: string; // Altura fija opcional
  imageFixedWidth?: string; // Ancho fijo opcional
  // Opcional: gradiente de fondo
  backgroundGradient?: string;
  // Opcionales: imagen de fondo
  backgroundImageUrl?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  // Opcionales: estilos de imagen específicos
  imageBorderRadius?: string;
  imageObjectFit?: string;
  // Opcionales: estilos de contenedor
  minHeight?: string;
  alignItems?: string; // 'center', 'flex-start', 'flex-end'
}

export const IMAGE_TEXT_VARIANTS: Record<string, ImageTextVariantConfig> = {
  default: {
    name: 'default',
    displayName: 'Predeterminado',
    backgroundColor: '#ffffff',
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: '#333333',
    titleColor: '#000000',
    padding: 16,
    spacing: 16,
    borderRadius: 8,
    defaultImageUrl: '',
    imageHeight: 'auto',
    imageFixedWidth: undefined,
  },
  rojo: {
    name: 'rojo',
    displayName: 'Rojo',
    backgroundColor: '#FF000029', // Fondo rojo muy claro
    borderColor: '#fca5a5', // Borde rojo claro
    borderWidth: 2,
    textColor: '#333333',
    titleColor: '#000000',
    padding: 20,
    spacing: 16,
    borderRadius: 12,
    defaultImageUrl: 'https://s3.amazonaws.com/s3.condoor.ai/michinadam/13754c49ec9.png',
    imageHeight: '112px',
    imageFixedWidth: '112px',
  },
  amarillo: {
    name: 'amarillo',
    displayName: 'Amarillo',
    backgroundColor: '#FFC83629', // Fondo amarillo muy claro
    borderColor: '#fde047', // Borde amarillo claro
    borderWidth: 2,
    textColor: '#333333',
    titleColor: '#000000',
    padding: 20,
    spacing: 16,
    borderRadius: 12,
    defaultImageUrl: 'https://s3.amazonaws.com/s3.condoor.ai/michinadam/4ea118dcec3.png',
    imageHeight: '112px',
    imageFixedWidth: '112px',
  },
  azulClaro: {
    name: 'azulClaro',
    displayName: 'Azul',
    backgroundColor: '#00649429', // Fondo azul muy claro
    borderColor: '#93c5fd', // Borde azul claro
    borderWidth: 2,
    textColor: '#333333',
    titleColor: '#000000',
    padding: 20,
    spacing: 16,
    borderRadius: 12,
    defaultImageUrl: 'https://s3.amazonaws.com/s3.condoor.ai/michinadam/d4a9f80f89.png',
    imageHeight: '112px',
    imageFixedWidth: '112px',
  },
  azulOscuro: {
    name: 'azulOscuro',
    displayName: 'Azul 2',
    backgroundColor: '#00649429', // Fondo azul oscuro
    borderColor: '#3b82f6', // Borde azul medio
    borderWidth: 2,
    textColor: '#333333',
    titleColor: '#000000',
    padding: 20,
    spacing: 16,
    borderRadius: 12,
    defaultImageUrl: 'https://s3.amazonaws.com/s3.condoor.ai/michinadam/4b7c6c19c1.png',
    imageHeight: '112px',
    imageFixedWidth: '112px',
  },
  avatarSinBorde: {
    name: 'avatarSinBorde',
    displayName: 'Avatar',
    backgroundColor: 'transparent', // Sin color de fondo
    borderColor: 'transparent',
    borderWidth: 0, // Sin borde
    textColor: '#FFFFFF', // Texto blanco
    titleColor: '#FFFFFF', // Título blanco
    padding: 20,
    spacing: 16,
    borderRadius: 12,
    defaultImageUrl: '', // Sin imagen predeterminada
    imageHeight: '59px', // Avatar pequeño
    imageFixedWidth: '59px',
    // Fondo con imagen
    backgroundImageUrl: 'https://s3.amazonaws.com/s3.condoor.ai/michinadam/65bdac4b03.webp',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    // Estilo de imagen circular como avatar
    imageBorderRadius: '100px',
    imageObjectFit: 'cover',
    // Estilos de contenedor
    minHeight: '200px',
    alignItems: 'center', // Centrado vertical
  },
};

// Helper para obtener la configuración de una variante
export const getVariantConfig = (variantName?: string): ImageTextVariantConfig => {
  const name = variantName || 'default';
  return IMAGE_TEXT_VARIANTS[name] || IMAGE_TEXT_VARIANTS.default;
};

// Lista de variantes disponibles para mostrar en el selector
export const VARIANT_OPTIONS = Object.values(IMAGE_TEXT_VARIANTS);
