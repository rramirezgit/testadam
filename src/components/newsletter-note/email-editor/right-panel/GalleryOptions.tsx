import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import {
  Box,
  Card,
  Alert,
  Stack,
  Button,
  Slider,
  Divider,
  Tooltip,
  Skeleton,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import useAuthStore from 'src/store/AuthStore';

import ImageCropDialog from './ImageCropDialog';
import ImageSourceModal from './ImageSourceModal';
import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';
import { validateFileSize, convertImageToOptimalFormat } from './imgPreview';

import type { GalleryOptionsProps } from './types';

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

const GalleryOptions = ({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
}: GalleryOptionsProps) => {
  // Obtener usuario autenticado
  const user = useAuthStore((state) => state.user);

  const [showCropDialog, setShowCropDialog] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [openAITab, setOpenAITab] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState('');
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  const [isLoadingForEdit, setIsLoadingForEdit] = useState(false);

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

  // Obtener imagen seleccionada desde el componente
  const selectedImageIndex = selectedComponent.props?.selectedImageIndex ?? null;

  // Valores reactivos de configuración global
  const spacing = selectedComponent.props?.spacing ?? 8;
  const borderRadius = selectedComponent.props?.borderRadius ?? 8;

  // Función para convertir URL de imagen a base64 usando endpoint
  const convertImageUrlToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const { createAxiosInstance } = await import('src/utils/axiosInstance');
      const axiosInstance = createAxiosInstance();

      const response = await axiosInstance.get('/media/fetch-base64', {
        params: {
          mediaUrl: imageUrl,
        },
      });

      if (!response.data) {
        throw new Error('No se recibió data del servidor');
      }

      const base64String = response.data;

      if (typeof base64String !== 'string' || !base64String.startsWith('data:image/')) {
        throw new Error('Formato de base64 inválido recibido del servidor');
      }

      return base64String;
    } catch (error) {
      console.error('Error fetching base64 from endpoint:', error);
      throw new Error(
        error instanceof Error
          ? `Error al descargar la imagen: ${error.message}`
          : 'Error desconocido al descargar la imagen'
      );
    }
  };

  // Auto-upload a S3
  const autoUploadToS3 = async (base64Image: string, imageIndex: number) => {
    if (!isBase64Image(base64Image)) return base64Image;

    try {
      const s3Url = await uploadImageToS3(base64Image, `gallery_${imageIndex}_${Date.now()}`);
      return s3Url;
    } catch (error) {
      console.error('Error en auto-upload:', error);
      return base64Image;
    }
  };

  // Manejar selección de archivo
  const handleSelectImage = (imageIndex: number) => {
    setEditingImageIndex(imageIndex);
    setShowSourceModal(true);
  };

  // Manejar selección desde PC
  const handleSelectFromPC = () => {
    setShowSourceModal(false);
    if (editingImageIndex !== null) {
      setTimeout(() => {
        imageFileInputRefs[editingImageIndex].current?.click();
      }, 100);
    }
  };

  // Manejar generación con IA
  const handleGenerateWithAI = () => {
    setShowSourceModal(false);
    setOpenAITab(true);
    setShowCropDialog(true);
  };

  // Manejar cambio de archivo
  const handleImageFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageIndex: number
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
      setEditingImageIndex(imageIndex);
      setShowCropDialog(true);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error al procesar la imagen');
    }
  };

  // Manejar edición de imagen existente
  const handleEditImage = async (imageIndex: number) => {
    const image = galleryImages[imageIndex];
    if (!image.src || isBase64Image(image.src)) return;

    setIsLoadingForEdit(true);
    try {
      const base64 = await convertImageUrlToBase64(image.src);
      setTempImageForCrop(base64);
      setEditingImageIndex(imageIndex);
      setShowCropDialog(true);
    } catch (error) {
      console.error('Error loading image for edit:', error);
      alert('Error al cargar la imagen para edición');
    } finally {
      setIsLoadingForEdit(false);
    }
  };

  // Manejar guardar crop
  const handleSaveCroppedImage = async (croppedImage: string) => {
    if (editingImageIndex === null) return;

    const finalImageUrl = await autoUploadToS3(croppedImage, editingImageIndex);

    const newImages = [...galleryImages];
    newImages[editingImageIndex] = {
      ...newImages[editingImageIndex],
      src: finalImageUrl,
    };

    updateComponentProps(selectedComponentId!, { images: newImages });
    setTempImageForCrop('');
    setEditingImageIndex(null);
  };

  // Manejar eliminación de imagen
  const handleDeleteImage = (imageIndex: number) => {
    const newImages = [...galleryImages];
    newImages[imageIndex] = { src: '', alt: `Imagen ${imageIndex + 1}` };
    updateComponentProps(selectedComponentId!, { images: newImages });
  };

  // Función para actualizar una imagen específica
  const updateImage = (imageIndex: number, updates: Partial<GalleryImage>) => {
    const newImages = [...galleryImages];
    newImages[imageIndex] = { ...newImages[imageIndex], ...updates };
    updateComponentProps(selectedComponentId!, { images: newImages });
  };

  // Si no hay imagen seleccionada, mostrar empty state
  if (selectedImageIndex === null || selectedImageIndex === undefined) {
    return (
      <Box sx={{ p: 2 }}>
        {/* Configuración global siempre visible */}
        <Card elevation={1} sx={{ borderRadius: 0, border: 'none', boxShadow: 'none' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Icon icon="mdi:tune" fontSize={20} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Configuración Global
            </Typography>
          </Stack>

          {/* Espaciado entre imágenes */}
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Icon icon="mdi:arrow-expand-horizontal" fontSize={18} color="text.secondary" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Espaciado entre imágenes: {spacing}px
              </Typography>
            </Stack>
            <Slider
              size="small"
              value={spacing}
              onChange={(_, value) => {
                updateComponentProps(selectedComponentId!, {
                  ...selectedComponent.props,
                  spacing: value as number,
                });
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
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Icon icon="mdi:border-radius" fontSize={18} color="text.secondary" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Bordes redondeados: {borderRadius}px
              </Typography>
            </Stack>
            <Slider
              size="small"
              value={borderRadius}
              onChange={(_, value) => {
                updateComponentProps(selectedComponentId!, {
                  ...selectedComponent.props,
                  borderRadius: value as number,
                });
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
        </Card>
      </Box>
    );
  }

  // Si hay selección, mostrar editor
  const currentImage = galleryImages[selectedImageIndex];
  const canEditCurrentImage =
    currentImage.src &&
    !isBase64Image(currentImage.src) &&
    !currentImage.src.startsWith('/assets/');

  return (
    <Box>
      {/* Header con imagen seleccionada */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6">Editando: Imagen {selectedImageIndex + 1}</Typography>
      </Stack>

      {/* Preview grande con overlay */}
      {currentImage.src && (
        <Box
          sx={{
            mb: 3,
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'grey.50',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 2,
            borderColor: 'primary.light',
            '&:hover .image-overlay': {
              opacity: 1,
            },
          }}
        >
          {isLoadingForEdit ? (
            <Skeleton variant="rectangular" width="100%" height={200} />
          ) : (
            <>
              {/* Imagen */}
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                }}
              />

              {/* Overlay con botones */}
              <Box
                className="image-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                {/* Botón Cambiar Imagen */}
                <Tooltip title="Cambiar imagen" arrow>
                  <IconButton
                    color="primary"
                    onClick={() => handleSelectImage(selectedImageIndex)}
                    disabled={uploading || isLoadingForEdit}
                    sx={{
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    <Icon icon="mdi:image-plus" width={24} />
                  </IconButton>
                </Tooltip>

                {/* Botón Editar Imagen */}
                {canEditCurrentImage && (
                  <Tooltip title="Editar imagen" arrow>
                    <IconButton
                      color="info"
                      onClick={() => handleEditImage(selectedImageIndex)}
                      disabled={uploading || isLoadingForEdit}
                      sx={{
                        backgroundColor: 'white',
                        '&:hover': {
                          backgroundColor: 'info.light',
                          color: 'white',
                        },
                      }}
                    >
                      <Icon icon="mdi:image-edit" width={24} />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Botón Eliminar */}
                <Tooltip title="Eliminar imagen" arrow>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteImage(selectedImageIndex)}
                    disabled={uploading || isLoadingForEdit}
                    sx={{
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'white',
                      },
                    }}
                  >
                    <Icon icon="mdi:delete" width={24} />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Botón inicial para seleccionar imagen si no hay imagen */}
      {!currentImage.src && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          startIcon={<Icon icon="mdi:image-plus" />}
          onClick={() => handleSelectImage(selectedImageIndex)}
          disabled={uploading || isLoadingForEdit}
          sx={{ mb: 3, py: 1.5 }}
        >
          Subir Imagen
        </Button>
      )}

      {/* Texto alternativo */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Texto alternativo
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={currentImage.alt || ''}
        onChange={(e) => updateImage(selectedImageIndex, { alt: e.target.value })}
        placeholder={`Descripción de la imagen ${selectedImageIndex + 1}`}
        disabled={uploading || isLoadingForEdit}
        helperText="Describe la imagen para mejorar la accesibilidad"
        sx={{ mb: 3 }}
      />

      {/* URL de enlace */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Enlace (opcional)
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="https://ejemplo.com"
        value={currentImage.link || ''}
        onChange={(e) => updateImage(selectedImageIndex, { link: e.target.value })}
        disabled={uploading || isLoadingForEdit}
        helperText="Si agregas una URL, la imagen será clickeable en el correo electrónico"
        sx={{ mb: 3 }}
      />

      {/* Progress bar si está subiendo */}
      {uploading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Subiendo imagen: {uploadProgress}%
          </Typography>
          <Box sx={{ width: '100%', mt: 1 }}>
            <Box
              sx={{
                height: 4,
                bgcolor: 'primary.main',
                borderRadius: 2,
                width: `${uploadProgress}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Configuración global */}
      <Card elevation={1} sx={{ p: 2, borderRadius: 0, border: 'none', boxShadow: 'none' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Configuración Global
          </Typography>
        </Stack>

        {/* Espaciado entre imágenes */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Icon icon="mdi:arrow-expand-horizontal" fontSize={18} color="text.secondary" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Espaciado entre imágenes: {spacing}px
            </Typography>
          </Stack>
          <Slider
            size="small"
            value={spacing}
            onChange={(_, value) => {
              updateComponentProps(selectedComponentId!, {
                ...selectedComponent.props,
                spacing: value as number,
              });
            }}
            min={0}
            max={20}
            marks={[
              { value: 0, label: '0' },
              { value: 8, label: '8' },
              { value: 16, label: '16' },
              { value: 20, label: '20' },
            ]}
            disabled={uploading || isLoadingForEdit}
          />
        </Box>

        {/* Bordes redondeados */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Icon icon="mdi:border-radius" fontSize={18} color="text.secondary" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Bordes redondeados: {borderRadius}px
            </Typography>
          </Stack>
          <Slider
            size="small"
            value={borderRadius}
            onChange={(_, value) => {
              updateComponentProps(selectedComponentId!, {
                ...selectedComponent.props,
                borderRadius: value as number,
              });
            }}
            min={0}
            max={20}
            marks={[
              { value: 0, label: '0' },
              { value: 8, label: '8' },
              { value: 12, label: '12' },
              { value: 20, label: '20' },
            ]}
            disabled={uploading || isLoadingForEdit}
          />
        </Box>
      </Card>

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

      {/* Modal de selección de origen */}
      <ImageSourceModal
        open={showSourceModal}
        onClose={() => {
          setShowSourceModal(false);
          setEditingImageIndex(null);
        }}
        onSelectFromPC={handleSelectFromPC}
        onGenerateWithAI={handleGenerateWithAI}
      />

      {/* Dialog de crop */}
      <ImageCropDialog
        open={showCropDialog}
        onClose={() => {
          setShowCropDialog(false);
          setTempImageForCrop('');
          setEditingImageIndex(null);
          setOpenAITab(false);
        }}
        onSave={handleSaveCroppedImage}
        initialImage={tempImageForCrop}
        currentAspectRatio={undefined}
        initialTab={openAITab ? 'ai' : 'edit'}
        userId={user?.id}
        plan={user?.plan?.name}
      />
    </Box>
  );
};

export default GalleryOptions;
