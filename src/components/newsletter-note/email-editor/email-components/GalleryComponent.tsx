import { Icon } from '@iconify/react';

import { Box, Chip, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

interface GalleryImage {
  src: string;
  alt: string;
  link?: string;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const GalleryComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  // Inicializar con 4 imágenes vacías si no existen
  const images = component.props?.images || [
    { src: CONFIG.emptyImageUrl, alt: 'Imagen 1' },
    { src: CONFIG.emptyImageUrl, alt: 'Imagen 2' },
    { src: CONFIG.emptyImageUrl, alt: 'Imagen 3' },
    { src: CONFIG.emptyImageUrl, alt: 'Imagen 4' },
  ];

  // Asegurar que siempre tengamos exactamente 4 imágenes
  const galleryImages: GalleryImage[] = Array.from(
    { length: 4 },
    (_, idx) => images[idx] || { src: CONFIG.emptyImageUrl, alt: `Imagen ${idx + 1}` }
  );

  const spacing = component.props?.spacing || 8;
  const borderRadius = component.props?.borderRadius || 8;
  const selectedImageIndex = component.props?.selectedImageIndex;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleImageClick = (e: React.MouseEvent, imageIndex: number) => {
    e.stopPropagation();

    // Si el componente no está seleccionado, seleccionarlo primero
    if (!isSelected) {
      onSelect();
    }

    // Seleccionar la imagen específica para editar en el panel derecho
    updateComponentProps(component.id, { selectedImageIndex: imageIndex });
  };

  const getPlaceholderIcon = (iconIdx: number) => {
    const icons = [
      'mdi:image-outline',
      'mdi:image-multiple-outline',
      'mdi:camera-outline',
      'mdi:picture-in-picture-outline',
    ];
    return icons[iconIdx] || 'mdi:image-outline';
  };

  return (
    <ComponentWithToolbar
      isSelected={isSelected}
      index={index}
      totalComponents={totalComponents}
      componentId={component.id}
      moveComponent={moveComponent}
      removeComponent={removeComponent}
      onClick={handleClick}
    >
      <Box sx={{ ...(component.style || {}) }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: `${spacing}px`,
            maxWidth: '100%',
          }}
        >
          {galleryImages.map((image, idx) => (
            <Box
              key={idx}
              onClick={(e) => handleImageClick(e, idx)}
              sx={{
                position: 'relative',
                aspectRatio: '4/3',
                borderRadius: `${borderRadius}px`,
                overflow: 'hidden',
                cursor: 'pointer',
                border: isSelected && selectedImageIndex === idx ? '2px solid' : '1px solid',
                borderColor: isSelected && selectedImageIndex === idx ? 'primary.main' : 'divider',
                transition: 'all 0.2s ease',
                backgroundColor: image.src ? 'transparent' : 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {image.src ? (
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'grey.500',
                    gap: 1,
                    p: 2,
                  }}
                >
                  <Icon icon={getPlaceholderIcon(idx)} width="40" height="40" />
                  <Typography variant="caption" sx={{ textAlign: 'center', fontWeight: 500 }}>
                    Click para subir
                  </Typography>
                </Box>
              )}

              {/* Badge con número de posición */}
              <Chip
                size="small"
                label={idx + 1}
                color={isSelected && selectedImageIndex === idx ? 'primary' : 'default'}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  fontWeight: 'bold',
                  boxShadow: 1,
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </ComponentWithToolbar>
  );
};

export default GalleryComponent;
