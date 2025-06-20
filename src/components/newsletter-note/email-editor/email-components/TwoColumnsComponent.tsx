import { useRef } from 'react';

import { Box, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import { useImageUpload } from '../right-panel/useImageUpload';

import type { EmailComponentProps } from './types';

interface ColumnData {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

const TwoColumnsComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const leftImageFileInputRef = useRef<HTMLInputElement>(null);
  const rightImageFileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImageToS3 } = useImageUpload();
  const leftColumn: ColumnData = component.props?.leftColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Escribe el contenido aquí...',
  };

  const rightColumn: ColumnData = component.props?.rightColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Escribe el contenido aquí...',
  };

  const spacing = component.props?.spacing || 16;
  const borderRadius = component.props?.borderRadius || 8;
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const textColor = component.props?.textColor || '#333333';
  const titleColor = component.props?.titleColor || '#000000';
  const fontSize = component.props?.fontSize || 14;
  const titleSize = component.props?.titleSize || 18;
  const columnPadding = component.props?.columnPadding || 16;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleImageClick = (e: React.MouseEvent, column: 'left' | 'right') => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect();
    }
    if (column === 'left') {
      leftImageFileInputRef.current?.click();
    } else {
      rightImageFileInputRef.current?.click();
    }
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    column: 'left' | 'right'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Primero actualizar con la imagen base64 para mostrar preview
        const currentColumn = column === 'left' ? leftColumn : rightColumn;
        const updatedColumn = { ...currentColumn, imageUrl: base64 };
        updateComponentProps(component.id, { [`${column}Column`]: updatedColumn });

        // Luego subir automáticamente a S3
        try {
          const s3Url = await uploadImageToS3(base64, `twocolumns_${column}_${Date.now()}`);
          const finalUpdatedColumn = { ...currentColumn, imageUrl: s3Url };
          updateComponentProps(component.id, { [`${column}Column`]: finalUpdatedColumn });
        } catch (error) {
          console.error('Error al subir la imagen a S3:', error);
          // Mantener la imagen base64 si falla la subida
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderColumn = (columnData: ColumnData, columnKey: 'left' | 'right') => (
    <Box
      sx={{
        flex: 1,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        p: `${columnPadding}px`,
        textAlign: 'center',
      }}
    >
      {/* Imagen de la columna */}
      <Box sx={{ mb: 2 }}>
        {columnData.imageUrl ? (
          <img
            src={columnData.imageUrl}
            alt={columnData.imageAlt}
            onClick={(e) => handleImageClick(e, columnKey)}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: 200,
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
            onClick={(e) => handleImageClick(e, columnKey)}
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

      {/* Título de la columna */}
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
        {columnData.title}
      </Typography>

      {/* Descripción de la columna */}
      <Typography
        variant="body1"
        sx={{
          color: textColor,
          fontSize: `${fontSize}px`,
          lineHeight: 1.5,
        }}
      >
        {columnData.description}
      </Typography>
    </Box>
  );

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
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: `${spacing}px`,
          }}
        >
          {renderColumn(leftColumn, 'left')}
          {renderColumn(rightColumn, 'right')}
        </Box>

        {/* Inputs ocultos para archivos */}
        <input
          type="file"
          ref={leftImageFileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={(e) => handleImageFileChange(e, 'left')}
        />
        <input
          type="file"
          ref={rightImageFileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={(e) => handleImageFileChange(e, 'right')}
        />
      </Box>
    </ComponentWithToolbar>
  );
};

export default TwoColumnsComponent;
