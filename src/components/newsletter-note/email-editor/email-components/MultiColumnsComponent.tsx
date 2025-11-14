import { useRef, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';
import ImageCropDialog from '../right-panel/ImageCropDialog';
import { useImageUpload } from '../right-panel/useImageUpload';
import { DEFAULT_PLACEHOLDER_COLOR, shouldUsePlaceholderColor } from './utils';
import { validateFileSize, convertImageToOptimalFormat } from '../right-panel/imgPreview';

import type { EmailComponentProps } from './types';

interface ColumnData {
  imageUrl: string;
  imageAlt: string;
  titleContent: string; // HTML de TipTap
  content: string; // Descripción, HTML de TipTap
}

const defaultColumn: ColumnData = {
  imageUrl: '',
  imageAlt: 'Imagen',
  titleContent: '<p>Título</p>',
  content: '<p>Escribe el contenido aquí...</p>',
};

// Función de migración de datos antiguos
const migrateOldFormat = (props: any): any => {
  // Si ya tiene el formato nuevo, retornar tal cual
  if (props?.columns && Array.isArray(props.columns)) {
    return props;
  }

  // Migrar formato antiguo (leftColumn/rightColumn) al nuevo (columns array)
  const leftColumn = props?.leftColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Escribe el contenido aquí...',
  };

  const rightColumn = props?.rightColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Escribe el contenido aquí...',
  };

  // Convertir al nuevo formato
  return {
    ...props,
    numberOfColumns: 2,
    layout: 'image-top',
    columns: [
      {
        imageUrl: leftColumn.imageUrl || '',
        imageAlt: leftColumn.imageAlt || 'Imagen',
        titleContent: leftColumn.title ? `<p>${leftColumn.title}</p>` : '<p>Título</p>',
        content: leftColumn.description
          ? `<p>${leftColumn.description}</p>`
          : '<p>Escribe el contenido aquí...</p>',
      },
      {
        imageUrl: rightColumn.imageUrl || '',
        imageAlt: rightColumn.imageAlt || 'Imagen',
        titleContent: rightColumn.title ? `<p>${rightColumn.title}</p>` : '<p>Título</p>',
        content: rightColumn.description
          ? `<p>${rightColumn.description}</p>`
          : '<p>Escribe el contenido aquí...</p>',
      },
    ],
  };
};

const MultiColumnsComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  updateComponentContent,
  moveComponent,
  removeComponent,
  totalComponents,
  onColumnSelect,
}: EmailComponentProps) => {
  const imageFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { uploadImageToS3 } = useImageUpload();

  // Estados para crop dialog
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState('');
  const [editingColumnIndex, setEditingColumnIndex] = useState<number | null>(null);

  // Migrar props si es necesario
  const migratedProps = migrateOldFormat(component.props);

  // Props globales
  const numberOfColumns = migratedProps?.numberOfColumns || 2;
  const layout = migratedProps?.layout || 'image-top';
  const spacing = migratedProps?.spacing || 16;
  const borderRadius = migratedProps?.borderRadius || 8;
  const backgroundColor = migratedProps?.backgroundColor || '#ffffff';
  const baseTextColor = migratedProps?.textColor || '#333333';
  const baseTitleColor = migratedProps?.titleColor || '#000000';
  const fontSize = migratedProps?.fontSize || 14;
  const titleSize = migratedProps?.titleSize || 18;
  const padding = migratedProps?.padding || 16;
  const imageWidth = migratedProps?.imageWidth || 40;
  const imageHeight = migratedProps?.imageHeight || 'auto';
  const imageObjectFit = migratedProps?.imageObjectFit || 'contain';
  const imageBackgroundColor = migratedProps?.imageBackgroundColor || 'transparent';
  const imageContainerBackgroundColor = migratedProps?.imageContainerBackgroundColor || '';

  // Columnas individuales
  const columns: ColumnData[] = migratedProps?.columns || [defaultColumn, defaultColumn];

  const placeholderActive = shouldUsePlaceholderColor(
    component,
    (component.style?.color as string | undefined) || baseTextColor || baseTitleColor
  );
  const displayTextColor = placeholderActive ? DEFAULT_PLACEHOLDER_COLOR : baseTextColor;
  const displayTitleColor = placeholderActive ? DEFAULT_PLACEHOLDER_COLOR : baseTitleColor;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  // Función para manejar la selección de una columna específica
  const handleColumnClick = (columnIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();

    // Primero seleccionar el componente si no está seleccionado
    if (!isSelected) {
      onSelect();
    }

    // Notificar al panel lateral qué columna está seleccionada
    if (onColumnSelect) {
      onColumnSelect(component.id, `column-${columnIndex}`);
    }
  };

  // Función para actualizar el contenido de una columna
  const updateColumnContent = (
    columnIndex: number,
    field: 'titleContent' | 'content',
    value: string
  ) => {
    const updatedColumns = [...columns];
    updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], [field]: value };
    updateComponentProps(component.id, { columns: updatedColumns });
  };

  const handleImageClick = (e: React.MouseEvent, columnIndex: number) => {
    e.stopPropagation();

    // Seleccionar la columna
    handleColumnClick(columnIndex, e);

    // Abrir selector de archivo
    imageFileInputRefs.current[columnIndex]?.click();
  };

  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    columnIndex: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert(
        'Tipo de archivo no válido. Por favor selecciona una imagen PNG, JPG, JPEG, WEBP o GIF.'
      );
      return;
    }

    // Validar tamaño del archivo
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) {
      alert(
        `⚠️ La imagen es demasiado grande (${sizeValidation.sizeMB}MB).\n\n` +
          `Por favor, reduce el tamaño a menos de 1MB para optimizar la carga en la web.\n\n` +
          `Puedes usar herramientas como TinyPNG o Squoosh para comprimir la imagen.`
      );
      return;
    }

    try {
      // Convertir al formato óptimo (PNG si tiene transparencia, WebP si no)
      const processedBase64 = await convertImageToOptimalFormat(file, 0.9);
      setTempImageForCrop(processedBase64);
      setEditingColumnIndex(columnIndex);
      setShowCropDialog(true);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error al procesar la imagen');
    }
  };

  const handleSaveCroppedImage = async (croppedImage: string) => {
    if (editingColumnIndex === null) return;

    try {
      // Auto-upload a S3
      const s3Url = await uploadImageToS3(
        croppedImage,
        `multicolumn_${editingColumnIndex}_${Date.now()}`
      );

      const updatedColumns = [...columns];
      updatedColumns[editingColumnIndex] = {
        ...updatedColumns[editingColumnIndex],
        imageUrl: s3Url,
      };
      updateComponentProps(component.id, { columns: updatedColumns });

      setTempImageForCrop('');
      setEditingColumnIndex(null);
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      alert('Error al subir la imagen');
    }
  };

  // Determinar la dirección del layout
  const isHorizontal = layout === 'image-left' || layout === 'image-right';
  const isImageFirst = layout === 'image-left' || layout === 'image-top';

  const renderImage = (columnData: ColumnData, columnIndex: number) => {
    if (columnData.imageUrl) {
      return (
        <Box
          onClick={(e) => handleImageClick(e, columnIndex)}
          sx={{
            position: 'relative',
            width: '100%',
            mb: isHorizontal ? 0 : 2,
            cursor: 'pointer',
            '&:hover .edit-overlay': {
              opacity: 1,
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              backgroundColor:
                imageHeight !== 'auto' && imageContainerBackgroundColor
                  ? imageContainerBackgroundColor
                  : 'transparent',
              borderRadius: `${borderRadius}px`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: imageHeight === 'auto' ? 'auto' : imageHeight,
            }}
          >
            <img
              src={columnData.imageUrl}
              alt={columnData.imageAlt}
              style={{
                maxWidth: '100%',
                width: '100%',
                height: imageHeight === 'auto' ? 'auto' : '100%',
                objectFit: imageObjectFit as React.CSSProperties['objectFit'],
                backgroundColor: !imageContainerBackgroundColor
                  ? imageBackgroundColor
                  : 'transparent',
                borderRadius: `${borderRadius}px`,
                display: 'block',
              }}
            />
          </Box>

          {isSelected && (
            <Box
              className="edit-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: `${borderRadius}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s ease',
                color: 'white',
              }}
            >
              <Typography variant="body2">✏️ Click para editar</Typography>
            </Box>
          )}
        </Box>
      );
    }

    return (
      <Box
        onClick={(e) => handleImageClick(e, columnIndex)}
        sx={{
          width: '100%',
          height: imageHeight === 'auto' ? 150 : imageHeight,
          backgroundColor: '#f5f5f5',
          borderRadius: `${borderRadius}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #e0e0e0',
          color: '#9e9e9e',
          cursor: 'pointer',
          mb: isHorizontal ? 0 : 2,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#eeeeee',
            borderColor: '#2196f3',
            color: '#2196f3',
          },
        }}
      >
        <img src={CONFIG.emptyImageUrl} alt="Imagen vacía" style={{ maxWidth: '80px' }} />
      </Box>
    );
  };

  const renderTextContent = (columnData: ColumnData, columnIndex: number) => (
    <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
      {/* Título editable con TipTap */}
      <Box
        onClick={(e) => handleColumnClick(columnIndex, e)}
        sx={{
          mb: 1,
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          '& p': {
            margin: 0,
            color: displayTitleColor,
            fontSize: `${titleSize}px`,
            fontWeight: 'bold',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          },
        }}
      >
        <SimpleTipTapEditor
          content={columnData.titleContent}
          onChange={(newContent) => updateColumnContent(columnIndex, 'titleContent', newContent)}
          showToolbar={false}
          style={{
            outline: 'none',
            fontSize: `${titleSize}px`,
            fontWeight: 'bold',
            color: displayTitleColor,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
          showAIButton={false}
          isPlaceholder={placeholderActive}
          placeholderColor={DEFAULT_PLACEHOLDER_COLOR}
          placeholder="Título"
        />
      </Box>

      {/* Descripción editable con TipTap */}
      <Box
        onClick={(e) => handleColumnClick(columnIndex, e)}
        sx={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          '& p': {
            margin: 0,
            color: displayTextColor,
            fontSize: `${fontSize}px`,
            lineHeight: 1.5,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          },
        }}
      >
        <SimpleTipTapEditor
          content={columnData.content}
          onChange={(newContent) => updateColumnContent(columnIndex, 'content', newContent)}
          showToolbar={false}
          style={{
            outline: 'none',
            fontSize: `${fontSize}px`,
            color: displayTextColor,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
          showAIButton={false}
          isPlaceholder={placeholderActive}
          placeholderColor={DEFAULT_PLACEHOLDER_COLOR}
          placeholder="Escribe el contenido aquí..."
        />
      </Box>
    </Box>
  );

  const renderColumn = (columnData: ColumnData, columnIndex: number) => {
    const imageElement = isHorizontal ? (
      <Box
        sx={{
          width: { xs: '100%', sm: `${imageWidth}%` },
          flexShrink: 0,
        }}
      >
        {renderImage(columnData, columnIndex)}
      </Box>
    ) : (
      renderImage(columnData, columnIndex)
    );

    const textElement = renderTextContent(columnData, columnIndex);

    // Ancho fijo por columna para evitar inconsistencias
    const columnWidthPercent = numberOfColumns === 2 ? '50%' : '33.33%';

    return (
      <Box
        key={columnIndex}
        onClick={(e) => handleColumnClick(columnIndex, e)}
        sx={{
          width: { xs: '100%', sm: `calc(${columnWidthPercent} - ${spacing / 2}px)` },
          minWidth: { xs: '100%', sm: `calc(${columnWidthPercent} - ${spacing / 2}px)` },
          maxWidth: { xs: '100%', sm: `calc(${columnWidthPercent} - ${spacing / 2}px)` },
          flex: 'none',
          backgroundColor,
          borderRadius: `${borderRadius}px`,
          p: `${padding}px`,
          position: 'relative',
          cursor: 'pointer',
          border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: isHorizontal ? { xs: 'column', sm: 'row' } : 'column',
          gap: isHorizontal ? `${spacing}px` : 0,
          alignItems: isHorizontal ? 'flex-start' : 'stretch',
          overflow: 'hidden',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          '&:hover': {
            borderColor: '#2196f3',
            boxShadow: '0 2px 8px rgba(33,150,243,0.2)',
          },
        }}
      >
        {/* Renderizar imagen y texto según el layout */}
        {isImageFirst ? (
          <>
            {imageElement}
            {textElement}
          </>
        ) : (
          <>
            {textElement}
            {imageElement}
          </>
        )}
      </Box>
    );
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
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: `${spacing}px`,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          {columns
            .slice(0, numberOfColumns)
            .map((columnData, idx) => renderColumn(columnData, idx))}
        </Box>

        {/* Inputs ocultos para archivos */}
        {columns.slice(0, numberOfColumns).map((_, idx) => (
          <input
            key={idx}
            type="file"
            ref={(el) => {
              imageFileInputRefs.current[idx] = el;
            }}
            style={{ display: 'none' }}
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={(e) => handleImageFileChange(e, idx)}
          />
        ))}

        {/* Dialog de crop */}
        <ImageCropDialog
          open={showCropDialog}
          onClose={() => {
            setShowCropDialog(false);
            setTempImageForCrop('');
            setEditingColumnIndex(null);
          }}
          onSave={handleSaveCroppedImage}
          initialImage={tempImageForCrop}
          currentAspectRatio={undefined}
        />
      </Box>
    </ComponentWithToolbar>
  );
};

export default MultiColumnsComponent;
