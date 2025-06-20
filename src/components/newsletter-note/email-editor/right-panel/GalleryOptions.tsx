import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import {
  Box,
  Chip,
  Grid,
  Paper,
  Button,
  Slider,
  Avatar,
  TextField,
  Typography,
  LinearProgress,
} from '@mui/material';

import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';

import type { GalleryOptionsProps } from './types';

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

const GalleryOptions = ({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
  updateComponentStyle,
}: GalleryOptionsProps) => {
  const [editingImageIndex, setEditingImageIndex] = useState<number>(0);

  // Referencias para input de archivos
  const imageFileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // Obtener las imágenes actuales o inicializar con 4 imágenes vacías
  const images: GalleryImage[] = selectedComponent.props?.images || [
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

  const spacing = selectedComponent.props?.spacing || 8;
  const borderRadius = selectedComponent.props?.borderRadius || 8;
  const selectedImageIndex = selectedComponent.props?.selectedImageIndex ?? editingImageIndex;

  // Funciones para manejar selección de archivos
  const handleSelectImage = (imageIndex: number) => {
    imageFileInputRefs[imageIndex].current?.click();
  };

  // Función para manejar cambios de archivos con subida automática a S3
  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageIndex: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Primero actualizar con la imagen base64 para mostrar preview
        const newImages = [...galleryImages];
        newImages[imageIndex] = { ...newImages[imageIndex], src: base64 };
        updateComponentProps(selectedComponentId!, { images: newImages });

        // Luego subir automáticamente a S3
        try {
          const s3Url = await uploadImageToS3(base64, `gallery_${imageIndex}_${Date.now()}`);
          const updatedImages = [...galleryImages];
          updatedImages[imageIndex] = { ...updatedImages[imageIndex], src: s3Url };
          updateComponentProps(selectedComponentId!, { images: updatedImages });
        } catch (error) {
          console.error('Error al subir la imagen a S3:', error);
          // Mantener la imagen base64 si falla la subida
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para actualizar una imagen específica
  const updateImage = (imageIndex: number, updates: Partial<GalleryImage>) => {
    const newImages = [...galleryImages];
    newImages[imageIndex] = { ...newImages[imageIndex], ...updates };
    updateComponentProps(selectedComponentId!, { images: newImages });
  };

  const currentImage = galleryImages[selectedImageIndex];

  return (
    <Box sx={{ p: 2 }}>
      {/* Selector de imagen */}
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon="mdi:view-grid" />
        Galería de 4 Imágenes
      </Typography>

      {/* Grid de miniaturas para seleccionar imagen */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Selecciona una imagen para editar
        </Typography>
        <Grid container spacing={1}>
          {galleryImages.map((image, idx) => (
            <Grid key={idx} size={{ xs: 6 }}>
              <Paper
                elevation={selectedImageIndex === idx ? 3 : 1}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  border: selectedImageIndex === idx ? '2px solid #2196f3' : '1px solid #e0e0e0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: 3,
                  },
                }}
                onClick={() => {
                  setEditingImageIndex(idx);
                  updateComponentProps(selectedComponentId!, { selectedImageIndex: idx });
                }}
              >
                <Box
                  sx={{
                    height: 60,
                    mb: 1,
                    backgroundImage: image.src ? `url(${image.src})` : 'none',
                    backgroundColor: image.src ? 'transparent' : '#f5f5f5',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {!image.src && (
                    <Icon icon="mdi:image-outline" width="24" height="24" color="#9e9e9e" />
                  )}
                </Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                    Imagen {idx + 1}
                  </Typography>
                  {image.src && isBase64Image(image.src) && (
                    <Chip size="small" label="Subiendo..." color="warning" />
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Editor de imagen seleccionada */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Icon icon="mdi:image-edit" />
          Editando: Imagen {selectedImageIndex + 1}
        </Typography>

        {/* Preview de la imagen actual */}
        {currentImage.src && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Avatar
              src={currentImage.src}
              alt={currentImage.alt}
              variant="rounded"
              sx={{
                width: 120,
                height: 90,
                margin: '0 auto',
                border: '2px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
            {isBase64Image(currentImage.src) && uploading && (
              <Typography variant="caption" color="info.main" sx={{ display: 'block', mt: 0.5 }}>
                📤 Subiendo a S3...
              </Typography>
            )}
          </Box>
        )}

        {/* Botón para cambiar imagen */}
        <Button
          variant="contained"
          size="medium"
          startIcon={<Icon icon="mdi:camera-plus" />}
          onClick={() => handleSelectImage(selectedImageIndex)}
          fullWidth
          sx={{
            mb: 2,
            py: 1.5,
            textTransform: 'none',
          }}
        >
          {currentImage.src ? 'Cambiar Imagen' : 'Subir Imagen'}
        </Button>

        {/* Texto alternativo */}
        <TextField
          fullWidth
          label="Texto alternativo"
          value={currentImage.alt || ''}
          onChange={(e) => updateImage(selectedImageIndex, { alt: e.target.value })}
          placeholder={`Descripción de la imagen ${selectedImageIndex + 1}`}
          size="small"
          sx={{ mb: 2 }}
        />

        {/* URL manual */}
        <TextField
          fullWidth
          label="URL de la imagen (opcional)"
          value={currentImage.src || ''}
          onChange={(e) => updateImage(selectedImageIndex, { src: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
          size="small"
          helperText="Puedes pegar una URL directamente en lugar de subir un archivo"
        />
      </Box>

      {/* Configuración global de la galería */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Icon icon="mdi:tune" />
          Configuración Global
        </Typography>

        {/* Espaciado entre imágenes */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Espaciado entre imágenes: {spacing}px
          </Typography>
          <Slider
            size="small"
            value={spacing}
            onChange={(_, value) => {
              updateComponentProps(selectedComponentId!, { spacing: value as number });
            }}
            min={0}
            max={20}
            marks={[
              { value: 0, label: '0' },
              { value: 8, label: '8' },
              { value: 16, label: '16' },
              { value: 20, label: '20' },
            ]}
          />
        </Box>

        {/* Bordes redondeados */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Bordes redondeados: {borderRadius}px
          </Typography>
          <Slider
            size="small"
            value={borderRadius}
            onChange={(_, value) => {
              updateComponentProps(selectedComponentId!, { borderRadius: value as number });
            }}
            min={0}
            max={20}
            marks={[
              { value: 0, label: '0' },
              { value: 8, label: '8' },
              { value: 12, label: '12' },
              { value: 20, label: '20' },
            ]}
          />
        </Box>
      </Box>

      {/* Progreso de subida */}
      {uploading && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Subiendo: {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Inputs de archivo ocultos */}
      {imageFileInputRefs.map((ref, idx) => (
        <input
          key={idx}
          type="file"
          ref={ref}
          style={{ display: 'none' }}
          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
          onChange={(e) => handleImageFileChange(e, idx)}
        />
      ))}
    </Box>
  );
};

export default GalleryOptions;
