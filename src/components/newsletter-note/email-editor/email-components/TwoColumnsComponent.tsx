import { useRef, useState } from 'react';

import { Box, TextField, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';
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

  const renderEditableDescription = (columnData: ColumnData, columnKey: 'left' | 'right') => {
    const fieldKey = `${columnKey}-description`;
    const isEditingDescription = editingField === fieldKey;

    return (
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
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
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

      {/* Título editable */}
      {renderEditableTitle(columnData, columnKey)}

      {/* Descripción editable con TipTap */}
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
