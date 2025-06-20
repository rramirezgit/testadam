import { useState } from 'react';
import { Icon } from '@iconify/react';

import { Box, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

interface GalleryImage {
  src: string;
  alt: string;
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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // Inicializar con 4 imágenes vacías si no existen
  const images = component.props?.images || [
    { src: '', alt: 'Imagen 1' },
    { src: '', alt: 'Imagen 2' },
    { src: '', alt: 'Imagen 3' },
    { src: '', alt: 'Imagen 4' },
  ];

  // Asegurar que siempre tengamos exactamente 4 imágenes
  const galleryImages: GalleryImage[] = Array.from(
    { length: 4 },
    (_, idx) => images[idx] || { src: '', alt: `Imagen ${idx + 1}` }
  );

  const spacing = component.props?.spacing || 8;
  const borderRadius = component.props?.borderRadius || 8;

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

    // Seleccionar la imagen específica para editar
    setSelectedImageIndex(imageIndex);
    // Actualizar el componente para indicar qué imagen está seleccionada
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
      <Box sx={{ mb: 2, ...(component.style || {}) }}>
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
                border:
                  isSelected && selectedImageIndex === idx
                    ? '3px solid #2196f3'
                    : '1px solid #e0e0e0',
                transition: 'all 0.2s ease',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  border: isSelected ? '2px solid #2196f3' : '2px solid #bdbdbd',
                  transform: 'scale(1.02)',
                },
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
                    color: '#9e9e9e',
                    gap: 1,
                  }}
                >
                  <Icon icon={getPlaceholderIcon(idx)} width="32" height="32" />
                  <Typography variant="caption" sx={{ textAlign: 'center' }}>
                    {image.alt}
                  </Typography>
                </Box>
              )}

              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {idx + 1}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </ComponentWithToolbar>
  );
};

export default GalleryComponent;
