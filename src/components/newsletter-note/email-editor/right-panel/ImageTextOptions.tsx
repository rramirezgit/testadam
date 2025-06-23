import type { EmailComponent } from 'src/types/saved-note';

import { useRef } from 'react';
import { Icon } from '@iconify/react';

import { Box, Chip, Slider, Button, Avatar, Divider, TextField, Typography } from '@mui/material';

import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';

interface ImageTextOptionsProps {
  component: EmailComponent;
  updateComponentProps: (componentId: string, props: Record<string, any>) => void;
}

const ImageTextOptions = ({ component, updateComponentProps }: ImageTextOptionsProps) => {
  // Referencias para input de archivos
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading } = useImageUpload();

  const imageUrl = component.props?.imageUrl || '';
  const imageAlt = component.props?.imageAlt || 'Imagen';
  const title = component.props?.title || 'Título';
  const description = component.props?.description || 'Escribe el contenido aquí...';
  const imageWidth = component.props?.imageWidth || 40;
  const spacing = component.props?.spacing || 16;
  const borderRadius = component.props?.borderRadius || 8;
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const textColor = component.props?.textColor || '#333333';
  const titleColor = component.props?.titleColor || '#000000';
  const fontSize = component.props?.fontSize || 14;
  const titleSize = component.props?.titleSize || 20;

  // Función para manejar selección de archivos
  const handleSelectImage = () => {
    imageFileInputRef.current?.click();
  };

  // Función para manejar cambios de archivos con subida automática a S3
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

  const handleInputChange = (field: string, value: any) => {
    updateComponentProps(component.id, { [field]: value });
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Sección de Imagen */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        📷 Imagen
      </Typography>

      {/* Preview de la imagen actual */}
      {imageUrl && (
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Avatar
            src={imageUrl}
            alt={imageAlt}
            variant="rounded"
            sx={{
              width: 120,
              height: 90,
              margin: '0 auto',
              border: '2px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          {isBase64Image(imageUrl) && uploading && (
            <Typography variant="caption" color="info.main" sx={{ display: 'block', mt: 0.5 }}>
              📤 Subiendo a S3...
            </Typography>
          )}
          {isBase64Image(imageUrl) && (
            <Chip size="small" label="Subiendo..." color="warning" sx={{ mt: 1 }} />
          )}
        </Box>
      )}

      {/* Botón para cambiar imagen */}
      <Button
        variant="contained"
        size="medium"
        startIcon={<Icon icon="mdi:camera-plus" />}
        onClick={handleSelectImage}
        fullWidth
        sx={{
          mb: 2,
          py: 1.5,
          textTransform: 'none',
        }}
      >
        {imageUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
      </Button>

      {/* Input oculto para archivos */}
      <input
        type="file"
        ref={imageFileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageFileChange}
      />

      <TextField
        label="Texto alternativo"
        value={imageAlt}
        onChange={(e) => handleInputChange('imageAlt', e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <TextField
        label="URL de imagen (manual)"
        value={imageUrl}
        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
        fullWidth
        size="small"
        placeholder="https://ejemplo.com/imagen.jpg"
        helperText="Puedes pegar una URL directamente en lugar de subir un archivo"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* Sección de Contenido */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        📝 Contenido
      </Typography>

      <TextField
        label="Título"
        value={title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />

      <TextField
        label="Descripción"
        value={description}
        onChange={(e) => handleInputChange('description', e.target.value)}
        fullWidth
        multiline
        rows={3}
        size="small"
        sx={{ mb: 2 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* Sección de Diseño */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        🎨 Diseño
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Ancho de imagen: {imageWidth}%
          </Typography>
          <Slider
            value={imageWidth}
            onChange={(_, value) => handleInputChange('imageWidth', value)}
            min={20}
            max={60}
            marks={[
              { value: 20, label: '20%' },
              { value: 40, label: '40%' },
              { value: 60, label: '60%' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Espaciado: {spacing}px
          </Typography>
          <Slider
            value={spacing}
            onChange={(_, value) => handleInputChange('spacing', value)}
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
            onChange={(_, value) => handleInputChange('borderRadius', value)}
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
            onChange={(_, value) => handleInputChange('titleSize', value)}
            min={14}
            max={28}
            marks={[
              { value: 14, label: '14' },
              { value: 20, label: '20' },
              { value: 28, label: '28' },
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
            onChange={(_, value) => handleInputChange('fontSize', value)}
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
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Sección de Colores */}
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
        🎨 Colores
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField
          label="Color de fondo"
          type="color"
          value={backgroundColor}
          onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="Color del título"
          type="color"
          value={titleColor}
          onChange={(e) => handleInputChange('titleColor', e.target.value)}
          fullWidth
          size="small"
        />
      </Box>

      <TextField
        label="Color del texto"
        type="color"
        value={textColor}
        onChange={(e) => handleInputChange('textColor', e.target.value)}
        fullWidth
        size="small"
      />
    </Box>
  );
};

export default ImageTextOptions;
