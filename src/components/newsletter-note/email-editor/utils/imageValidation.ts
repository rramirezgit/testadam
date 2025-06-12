// Función para verificar si una imagen es base64 (no subida a S3)
export const isBase64Image = (src?: string): boolean => {
  if (!src) return false;
  return src.startsWith('data:image/') || (src.includes('base64') && !src.startsWith('http'));
};

// Función para encontrar todas las imágenes en un objeto de componentes
export const findImagesInComponents = (components: any[]): string[] => {
  const images: string[] = [];

  const searchInComponent = (component: any) => {
    if (!component) return;

    // Buscar en props
    if (component.props?.src && typeof component.props.src === 'string') {
      images.push(component.props.src);
    }

    // Buscar en arrays de imágenes (para galerías)
    if (component.props?.images && Array.isArray(component.props.images)) {
      component.props.images.forEach((img: any) => {
        if (img.src && typeof img.src === 'string') {
          images.push(img.src);
        }
      });
    }

    // Buscar en props anidados (recursivo)
    Object.values(component.props || {}).forEach((value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(searchInComponent);
        } else {
          searchInComponent(value);
        }
      }
    });

    // Buscar en children si existen
    if (component.children && Array.isArray(component.children)) {
      component.children.forEach(searchInComponent);
    }
  };

  components.forEach(searchInComponent);
  return images;
};

// Función principal para validar todas las imágenes
export const validateAllImagesUploaded = (
  objData: string,
  objDataWeb: string
): {
  isValid: boolean;
  pendingImages: string[];
  totalImages: number;
} => {
  try {
    // Parsear los objetos JSON
    const componentsData = JSON.parse(objData || '[]');
    const componentsWebData = JSON.parse(objDataWeb || '[]');

    // Encontrar todas las imágenes
    const allImages = [
      ...findImagesInComponents(componentsData),
      ...findImagesInComponents(componentsWebData),
    ];

    // Filtrar imágenes base64 (pendientes de subir)
    const pendingImages = allImages.filter(isBase64Image);

    return {
      isValid: pendingImages.length === 0,
      pendingImages,
      totalImages: allImages.length,
    };
  } catch (error) {
    console.error('Error validating images:', error);
    return {
      isValid: false,
      pendingImages: [],
      totalImages: 0,
    };
  }
};

// Función para obtener estadísticas de imágenes
export const getImageStats = (objData: string, objDataWeb: string) => {
  const validation = validateAllImagesUploaded(objData, objDataWeb);
  const uploadedImages = validation.totalImages - validation.pendingImages.length;

  return {
    total: validation.totalImages,
    uploaded: uploadedImages,
    pending: validation.pendingImages.length,
    isAllUploaded: validation.isValid,
    pendingUrls: validation.pendingImages,
  };
};
