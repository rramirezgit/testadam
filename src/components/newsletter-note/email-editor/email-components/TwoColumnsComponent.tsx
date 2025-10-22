import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import { Box, Skeleton, TextField, Typography } from '@mui/material';

import { isBase64Image } from '../utils/imageValidation';
import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';
import ImageCropDialog from '../right-panel/ImageCropDialog';
import { useImageUpload } from '../right-panel/useImageUpload';
import { validateFileSize, convertImageToOptimalFormat } from '../right-panel/imgPreview';

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
  updateComponentContent,
  moveComponent,
  removeComponent,
  totalComponents,
  onColumnSelect,
}: EmailComponentProps) => {
  const leftImageFileInputRef = useRef<HTMLInputElement>(null);
  const rightImageFileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImageToS3 } = useImageUpload();

  // Estados para controlar qué campo está siendo editado
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  // Estados para crop dialog
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState('');
  const [editingColumn, setEditingColumn] = useState<'left' | 'right' | null>(null);
  const [isLoadingForEdit, setIsLoadingForEdit] = useState(false);

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

  // Función para manejar la selección de una columna específica
  const handleColumnClick = (columnKey: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();

    // Primero seleccionar el componente si no está seleccionado
    if (!isSelected) {
      onSelect();
    }

    // Notificar al panel lateral qué columna está seleccionada
    if (onColumnSelect) {
      onColumnSelect(component.id, columnKey);
    }
  };

  // Función para iniciar edición de un campo
  const startEditing = (fieldKey: string, currentValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      onSelect();
      return;
    }
    setEditingField(fieldKey);
    setEditingValue(currentValue);
  };

  // Función para finalizar edición
  const finishEditing = () => {
    setEditingField(null);
    setEditingValue('');
  };

  // Función para actualizar el contenido de una columna
  const updateColumnContent = (
    column: 'left' | 'right',
    field: 'title' | 'description',
    value: string
  ) => {
    const currentColumn = column === 'left' ? leftColumn : rightColumn;
    const updatedColumn = { ...currentColumn, [field]: value };
    updateComponentProps(component.id, { [`${column}Column`]: updatedColumn });
  };

  // Función para manejar Enter en campos de texto
  const handleKeyDown = (
    e: React.KeyboardEvent,
    column: 'left' | 'right',
    field: 'title' | 'description'
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      updateColumnContent(column, field, editingValue);
      finishEditing();
    } else if (e.key === 'Escape') {
      finishEditing();
    }
  };

  const handleImageClick = (e: React.MouseEvent, column: 'left' | 'right') => {
    e.stopPropagation();

    // Seleccionar la columna
    handleColumnClick(column, e);

    // Abrir selector de archivo
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
      setEditingColumn(column);
      setShowCropDialog(true);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error al procesar la imagen');
    }
  };

  const handleEditExistingImage = async (column: 'left' | 'right') => {
    const columnData = column === 'left' ? leftColumn : rightColumn;
    const currentImageSrc = columnData.imageUrl;

    if (!currentImageSrc || isBase64Image(currentImageSrc)) return;

    setIsLoadingForEdit(true);
    try {
      // Descargar imagen como base64 desde el endpoint
      const { createAxiosInstance } = await import('src/utils/axiosInstance');
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get('/media/fetch-base64', {
        params: { mediaUrl: currentImageSrc },
      });

      const base64Image = response.data;
      setTempImageForCrop(base64Image);
      setEditingColumn(column);
      setShowCropDialog(true);
    } catch (error) {
      console.error('Error loading image for edit:', error);
      alert('Error al cargar la imagen para edición');
    } finally {
      setIsLoadingForEdit(false);
    }
  };

  const handleSaveCroppedImage = async (croppedImage: string) => {
    if (!editingColumn) return;

    try {
      // Auto-upload a S3
      const s3Url = await uploadImageToS3(
        croppedImage,
        `twocolumns_${editingColumn}_${Date.now()}`
      );

      const currentColumn = editingColumn === 'left' ? leftColumn : rightColumn;
      const updatedColumn = { ...currentColumn, imageUrl: s3Url };
      updateComponentProps(component.id, { [`${editingColumn}Column`]: updatedColumn });

      setTempImageForCrop('');
      setEditingColumn(null);
    } catch (error) {
      console.error('Error uploading cropped image:', error);
      alert('Error al subir la imagen');
    }
  };

  const renderEditableTitle = (columnData: ColumnData, columnKey: 'left' | 'right') => {
    const fieldKey = `${columnKey}-title`;
    const isEditing = editingField === fieldKey;

    if (isEditing) {
      return (
        <TextField
          value={editingValue}
          onChange={(e) => setEditingValue(e.target.value)}
          onBlur={() => {
            updateColumnContent(columnKey, 'title', editingValue);
            finishEditing();
          }}
          onKeyDown={(e) => handleKeyDown(e, columnKey, 'title')}
          autoFocus
          fullWidth
          variant="standard"
          sx={{
            '& .MuiInput-root': {
              fontSize: `${titleSize}px`,
              fontWeight: 'bold',
              color: titleColor,
            },
            '& .MuiInput-input': {
              textAlign: 'center',
              padding: 0,
            },
            mb: 1,
          }}
        />
      );
    }

    return (
      <Typography
        variant="h6"
        onClick={(e) => {
          handleColumnClick(columnKey, e);
          startEditing(fieldKey, columnData.title, e);
        }}
        sx={{
          color: titleColor,
          fontSize: `${titleSize}px`,
          fontWeight: 'bold',
          mb: 1,
          lineHeight: 1.2,
          cursor: isSelected ? 'text' : 'pointer',
          minHeight: '1.2em',
          position: 'relative',
          '&:hover': isSelected
            ? {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                borderRadius: '4px',
                padding: '2px 4px',
                margin: '-2px -4px',
              }
            : {},
        }}
      >
        {columnData.title}
      </Typography>
    );
  };

  const renderEditableDescription = (columnData: ColumnData, columnKey: 'left' | 'right') => (
    <Box
      onClick={(e) => handleColumnClick(columnKey, e)}
      sx={{
        color: textColor,
        fontSize: `${fontSize}px`,
        lineHeight: 1.5,
        cursor: 'text',
        minHeight: '1.5em',
        position: 'relative',
        '& p': {
          margin: 0,
          color: textColor,
        },
        '& p:empty::before': {
          content: '"Escribe el contenido aquí..."',
          color: '#adb5bd',
          fontStyle: 'italic',
        },
      }}
    >
      <SimpleTipTapEditor
        content={columnData.description}
        onChange={(newContent) => updateColumnContent(columnKey, 'description', newContent)}
        showToolbar={false}
        style={{
          outline: 'none',
          textAlign: 'center',
        }}
      />
    </Box>
  );

  const renderImage = (columnData: ColumnData, columnKey: 'left' | 'right') => {
    if (columnData.imageUrl) {
      return (
        <Box
          onClick={(e) => handleImageClick(e, columnKey)}
          sx={{
            position: 'relative',
            width: '100%',
            mb: 2,
            cursor: 'pointer',
            '&:hover .edit-overlay': {
              opacity: 1,
            },
          }}
        >
          {isLoadingForEdit && editingColumn === columnKey ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              sx={{ borderRadius: `${borderRadius}px` }}
            />
          ) : (
            <img
              src={columnData.imageUrl}
              alt={columnData.imageAlt}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 200,
                borderRadius: `${borderRadius}px`,
                objectFit: 'cover',
                display: 'block',
              }}
            />
          )}

          {isSelected && !isLoadingForEdit && (
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
        onClick={(e) => handleImageClick(e, columnKey)}
        sx={{
          width: '100%',
          height: 150,
          backgroundColor: '#f5f5f5',
          borderRadius: `${borderRadius}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #e0e0e0',
          color: '#9e9e9e',
          cursor: 'pointer',
          mb: 2,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#eeeeee',
            borderColor: '#2196f3',
            color: '#2196f3',
          },
        }}
      >
        <Icon icon="mdi:image-plus" fontSize={40} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Click para subir
        </Typography>
      </Box>
    );
  };

  const renderColumn = (columnData: ColumnData, columnKey: 'left' | 'right') => (
    <Box
      onClick={(e) => handleColumnClick(columnKey, e)}
      sx={{
        flex: 1,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        p: `${columnPadding}px`,
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        border: isSelected ? '2px solid #2196f3' : '1px solid #e0e0e0',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#2196f3',
          boxShadow: '0 2px 8px rgba(33,150,243,0.2)',
        },
      }}
    >
      {/* Imagen arriba */}
      {renderImage(columnData, columnKey)}

      {/* Título en el centro */}
      {renderEditableTitle(columnData, columnKey)}

      {/* Descripción abajo */}
      {renderEditableDescription(columnData, columnKey)}
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
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onChange={(e) => handleImageFileChange(e, 'left')}
        />
        <input
          type="file"
          ref={rightImageFileInputRef}
          style={{ display: 'none' }}
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onChange={(e) => handleImageFileChange(e, 'right')}
        />

        {/* Dialog de crop */}
        <ImageCropDialog
          open={showCropDialog}
          onClose={() => {
            setShowCropDialog(false);
            setTempImageForCrop('');
            setEditingColumn(null);
          }}
          onSave={handleSaveCroppedImage}
          initialImage={tempImageForCrop}
          currentAspectRatio={undefined}
        />
      </Box>
    </ComponentWithToolbar>
  );
};

export default TwoColumnsComponent;
