import { useRef } from 'react';

import { Box, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import { useImageUpload } from '../right-panel/useImageUpload';

import type { EmailComponentProps } from './types';

const ImageTextComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImageToS3 } = useImageUpload();

  const imageUrl = component.props?.imageUrl || '';
  const imageAlt = component.props?.imageAlt || 'Imagen';
  const title = component.props?.title || 'Título';
  const description = component.props?.description || 'Escribe el contenido aquí...';
  const imageWidth = component.props?.imageWidth || 40; // Porcentaje de ancho de la imagen
  const spacing = component.props?.spacing || 16;
  const borderRadius = component.props?.borderRadius || 8;
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const textColor = component.props?.textColor || '#333333';
  const titleColor = component.props?.titleColor || '#000000';
  const fontSize = component.props?.fontSize || 14;
  const titleSize = component.props?.titleSize || 20;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect();
    }
    imageFileInputRef.current?.click();
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Primero actualizar con la imagen base64 para mostrar preview
        updateComponentProps(component.id, { imageUrl: base64 });

        // Luego subir automáticamente a S3
        try {
          const s3Url = await uploadImageToS3(base64, `imagetext_${Date.now()}`);
          updateComponentProps(component.id, { imageUrl: s3Url });
        } catch (error) {
          console.error('Error al subir la imagen a S3:', error);
          // Mantener la imagen base64 si falla la subida
        }
      };
      reader.readAsDataURL(file);
    }
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
      <Box
        sx={{
          mb: 2,
          backgroundColor,
          borderRadius: `${borderRadius}px`,
          overflow: 'hidden',
          ...(component.style || {}),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: `${spacing}px`,
            alignItems: 'center',
            p: 2,
          }}
        >
          {/* Imagen */}
          <Box
            sx={{
              width: { xs: '100%', sm: `${imageWidth}%` },
              flexShrink: 0,
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                onClick={handleImageClick}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: `${borderRadius}px`,
                  objectFit: 'cover',
                  display: 'block',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            ) : (
              <Box
                onClick={handleImageClick}
                sx={{
                  width: '100%',
                  height: 150,
                  backgroundColor: '#f5f5f5',
                  borderRadius: `${borderRadius}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e0e0e0',
                  color: '#9e9e9e',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#eeeeee',
                    borderColor: '#2196f3',
                    color: '#2196f3',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Typography variant="body2">📷 Click para subir imagen</Typography>
              </Box>
            )}
          </Box>

          {/* Input oculto para archivos */}
          <input
            type="file"
            ref={imageFileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageFileChange}
          />

          {/* Contenido de texto */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: titleColor,
                fontSize: `${titleSize}px`,
                fontWeight: 'bold',
                mb: 1,
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: textColor,
                fontSize: `${fontSize}px`,
                lineHeight: 1.5,
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ComponentWithToolbar>
  );
};

export default ImageTextComponent;
