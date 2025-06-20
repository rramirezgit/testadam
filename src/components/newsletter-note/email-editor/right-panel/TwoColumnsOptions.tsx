import type { EmailComponent } from 'src/types/saved-note';

import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Chip,
  Slider,
  Button,
  Avatar,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';

interface ColumnData {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
}

interface TwoColumnsOptionsProps {
  component: EmailComponent;
  updateComponentProps: (componentId: string, props: Record<string, any>) => void;
}

const TwoColumnsOptions = ({ component, updateComponentProps }: TwoColumnsOptionsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  // Referencias para input de archivos (una para cada columna)
  const leftImageFileInputRef = useRef<HTMLInputElement>(null);
  const rightImageFileInputRef = useRef<HTMLInputElement>(null);

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading } = useImageUpload();

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

  // Función para manejar selección de archivos
  const handleSelectImage = (column: 'left' | 'right') => {
    if (column === 'left') {
      leftImageFileInputRef.current?.click();
    } else {
      rightImageFileInputRef.current?.click();
    }
  };

  // Función para manejar cambios de archivos con subida automática a S3
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

  const handleColumnChange = (column: 'left' | 'right', field: string, value: any) => {
    const currentColumn = column === 'left' ? leftColumn : rightColumn;
    const updatedColumn = { ...currentColumn, [field]: value };
    updateComponentProps(component.id, { [`${column}Column`]: updatedColumn });
  };

  const handleGlobalChange = (field: string, value: any) => {
    updateComponentProps(component.id, { [field]: value });
  };

  const currentColumn = activeTab === 0 ? leftColumn : rightColumn;
  const columnKey = activeTab === 0 ? 'left' : 'right';

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="mdi:view-column" />
        Dos Columnas
      </Typography>

      {/* Tabs para seleccionar columna */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
        variant="fullWidth"
      >
        <Tab label="📄 Columna Izq." />
        <Tab label="📄 Columna Der." />
      </Tabs>

      {/* Contenido de la columna seleccionada */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        📝 Contenido - {activeTab === 0 ? 'Izquierda' : 'Derecha'}
      </Typography>

      {/* Preview de la imagen actual */}
      {currentColumn.imageUrl && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Avatar
            src={currentColumn.imageUrl}
            alt={currentColumn.imageAlt}
            variant="rounded"
            sx={{
              width: 120,
              height: 90,
              margin: '0 auto',
              border: '2px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          {isBase64Image(currentColumn.imageUrl) && uploading && (
            <Typography variant="caption" color="info.main" sx={{ display: 'block', mt: 0.5 }}>
              📤 Subiendo a S3...
            </Typography>
          )}
          {isBase64Image(currentColumn.imageUrl) && (
            <Chip size="small" label="Subiendo..." color="warning" sx={{ mt: 1 }} />
          )}
        </Box>
      )}

      {/* Botón para cambiar imagen */}
      <Button
        variant="contained"
        size="medium"
        startIcon={<Icon icon="mdi:camera-plus" />}
        onClick={() => handleSelectImage(columnKey)}
        fullWidth
        sx={{
          mb: 2,
          py: 1.5,
          textTransform: 'none',
        }}
      >
        {currentColumn.imageUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
      </Button>

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

      <TextField
        label="Texto alternativo"
        value={currentColumn.imageAlt}
        onChange={(e) => handleColumnChange(columnKey, 'imageAlt', e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <TextField
        label="URL de imagen (manual)"
        value={currentColumn.imageUrl}
        onChange={(e) => handleColumnChange(columnKey, 'imageUrl', e.target.value)}
        fullWidth
        size="small"
        placeholder="https://ejemplo.com/imagen.jpg"
        helperText="Puedes pegar una URL directamente en lugar de subir un archivo"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Título"
        value={currentColumn.title}
        onChange={(e) => handleColumnChange(columnKey, 'title', e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Descripción"
        value={currentColumn.description}
        onChange={(e) => handleColumnChange(columnKey, 'description', e.target.value)}
        fullWidth
        multiline
        rows={3}
        size="small"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* Configuración Global */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        🎨 Configuración Global
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Espaciado: {spacing}px
          </Typography>
          <Slider
            value={spacing}
            onChange={(_, value) => handleGlobalChange('spacing', value)}
            min={8}
            max={32}
            marks={[
              { value: 8, label: '8' },
              { value: 16, label: '16' },
              { value: 32, label: '32' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Bordes: {borderRadius}px
          </Typography>
          <Slider
            value={borderRadius}
            onChange={(_, value) => handleGlobalChange('borderRadius', value)}
            min={0}
            max={20}
            marks={[
              { value: 0, label: '0' },
              { value: 8, label: '8' },
              { value: 20, label: '20' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tamaño título: {titleSize}px
          </Typography>
          <Slider
            value={titleSize}
            onChange={(_, value) => handleGlobalChange('titleSize', value)}
            min={14}
            max={24}
            marks={[
              { value: 14, label: '14' },
              { value: 18, label: '18' },
              { value: 24, label: '24' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tamaño texto: {fontSize}px
          </Typography>
          <Slider
            value={fontSize}
            onChange={(_, value) => handleGlobalChange('fontSize', value)}
            min={12}
            max={18}
            marks={[
              { value: 12, label: '12' },
              { value: 14, label: '14' },
              { value: 18, label: '18' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Padding columnas: {columnPadding}px
          </Typography>
          <Slider
            value={columnPadding}
            onChange={(_, value) => handleGlobalChange('columnPadding', value)}
            min={8}
            max={24}
            marks={[
              { value: 8, label: '8' },
              { value: 16, label: '16' },
              { value: 24, label: '24' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Colores */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        🎨 Colores
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField
          label="Color de fondo"
          type="color"
          value={backgroundColor}
          onChange={(e) => handleGlobalChange('backgroundColor', e.target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="Color del título"
          type="color"
          value={titleColor}
          onChange={(e) => handleGlobalChange('titleColor', e.target.value)}
          fullWidth
          size="small"
        />
      </Box>

      <TextField
        label="Color del texto"
        type="color"
        value={textColor}
        onChange={(e) => handleGlobalChange('textColor', e.target.value)}
        fullWidth
        size="small"
      />
    </Box>
  );
};

export default TwoColumnsOptions;
