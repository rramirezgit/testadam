/* eslint-disable react-hooks/exhaustive-deps */
import 'react-image-crop/dist/ReactCrop.css';
import 'src/styles/react-crop.css';

import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Alert,
  Stack,
  Button,
  Select,
  Divider,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  LinearProgress,
} from '@mui/material';

import ImageCropDialog from './ImageCropDialog';
import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';
import { validateFileSize, convertImageToWebP } from './imgPreview';

import type { ImageOptionsProps } from './types';

const ImageOptions = ({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
}: ImageOptionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para imagen
  const [tempImage, setTempImage] = useState<string>('');
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [adjustImageCrop, setAdjustImageCrop] = useState(true);

  // Estados para upload automático
  const [isAutoUploading, setIsAutoUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [isLoadingForEdit, setIsLoadingForEdit] = useState(false);

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // Auto-trigger file picker si no hay imagen al seleccionar el componente
  useEffect(() => {
    const currentImageSrc = selectedComponent.props?.src;
    if (selectedComponentId && (!currentImageSrc || currentImageSrc === '')) {
      const timer = setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [selectedComponentId]);

  // Actualizar el ajuste de imagen inmediatamente
  useEffect(() => {
    if (selectedComponentId && selectedComponent.props?.src) {
      updateComponentProps(selectedComponentId, {
        style: {
          ...selectedComponent.props?.style,
          objectFit: adjustImageCrop ? 'contain' : 'cover',
        },
      });
    }
  }, [adjustImageCrop]);

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

  // Auto-upload después de guardar crop
  const autoUploadToS3 = async (base64Image: string, reason: string) => {
    if (!isBase64Image(base64Image)) return base64Image;

    setIsAutoUploading(true);
    setUploadMessage(`Subiendo imagen automáticamente (${reason})...`);

    try {
      const s3Url = await uploadImageToS3(base64Image, `newsletter_image_${Date.now()}`);
      setUploadMessage('✅ Imagen subida automáticamente a S3');

      setTimeout(() => {
        setUploadMessage('');
      }, 3000);

      return s3Url;
    } catch (error) {
      console.error('Error en auto-upload:', error);
      setUploadMessage('❌ Error al subir imagen automáticamente');

      setTimeout(() => {
        setUploadMessage('');
      }, 5000);

      return base64Image;
    } finally {
      setIsAutoUploading(false);
    }
  };

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      // Convertir a WebP (excepto GIF que se mantiene como GIF)
      const processedBase64 = await convertImageToWebP(file, 0.9);
      setTempImage(processedBase64);
      setShowCropDialog(true);
    } catch (error) {
      console.error('Error converting to WebP:', error);
      alert('Error al procesar la imagen');
    }
  };

  const handleEditExistingImage = async () => {
    const currentImageSrc = selectedComponent.props?.src;
    if (!currentImageSrc || isBase64Image(currentImageSrc)) return;

    setIsLoadingForEdit(true);
    setUploadMessage('Cargando imagen para edición...');

    try {
      const base64Image = await convertImageUrlToBase64(currentImageSrc);
      setTempImage(base64Image);
      setShowCropDialog(true);
      setUploadMessage('');
    } catch (error) {
      console.error('Error al cargar imagen para edición:', error);
      setUploadMessage('❌ Error al cargar la imagen para edición');

      setTimeout(() => {
        setUploadMessage('');
      }, 5000);
    } finally {
      setIsLoadingForEdit(false);
    }
  };

  const handleSaveCroppedImage = async (croppedImage: string) => {
    const finalImageUrl = await autoUploadToS3(croppedImage, 'imagen editada');

    updateComponentProps(selectedComponentId!, {
      src: finalImageUrl,
      style: {
        objectFit: adjustImageCrop ? 'contain' : 'cover',
        width: selectedComponent.props?.style?.width || '100%',
        height: selectedComponent.props?.style?.height || 'auto',
      },
    });

    setTempImage('');
  };

  const handleResetToDefault = () => {
    updateComponentProps(selectedComponentId!, {
      src: '',
      alt: 'Imagen por defecto',
      style: {
        objectFit: 'contain',
        width: '100%',
        height: 'auto',
      },
    });
  };

  const currentImageSrc = selectedComponent.props?.src;
  const needsUpload = isBase64Image(currentImageSrc);
  const isProcessing = uploading || isAutoUploading || isLoadingForEdit;
  const canEditImage = currentImageSrc && !needsUpload && !currentImageSrc.startsWith('/assets/');

  return (
    <>
      {/* Progress bar para operaciones */}
      {isProcessing && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            {uploadMessage || `Procesando: ${uploadProgress}%`}
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Mensaje de estado */}
      {uploadMessage && !isProcessing && (
        <Alert
          severity={uploadMessage.includes('✅') ? 'success' : 'error'}
          sx={{ mb: 2, fontSize: '0.875rem' }}
        >
          {uploadMessage}
        </Alert>
      )}

      {/* Alertas de estado */}
      {!uploadMessage && !isProcessing && (
        <>
          {needsUpload ? (
            <Alert severity="warning" sx={{ mb: 2, fontSize: '0.875rem' }}>
              🔄 Esta imagen se subirá automáticamente a S3
            </Alert>
          ) : currentImageSrc && !currentImageSrc.startsWith('/assets/') ? (
            <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>
              ✅ Imagen guardada correctamente
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
              📷 Selecciona una imagen para editarla con herramientas avanzadas de crop, escala y
              rotación.
            </Alert>
          )}
        </>
      )}

      {/* Vista previa de la imagen */}
      {currentImageSrc && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            backgroundColor: 'grey.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
          }}
        >
          {isLoadingForEdit ? (
            <Skeleton variant="rectangular" width="100%" height={180} />
          ) : (
            <img
              src={currentImageSrc}
              alt={selectedComponent.props?.alt || 'Preview'}
              style={{
                maxWidth: '100%',
                maxHeight: '180px',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          )}
        </Box>
      )}

      {/* Botón inicial para seleccionar imagen */}
      {!currentImageSrc && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          startIcon={<Icon icon="mdi:image-plus" />}
          onClick={handleSelectImage}
          disabled={isProcessing}
          sx={{ mb: 3, py: 1.5 }}
        >
          Seleccionar imagen
        </Button>
      )}

      {/* Texto alternativo */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Texto alternativo
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Describe la imagen para accesibilidad"
        value={selectedComponent.props?.alt || ''}
        onChange={(e) => updateComponentProps(selectedComponentId!, { alt: e.target.value })}
        disabled={isProcessing}
        sx={{ mb: 3 }}
      />

      {/* Ajuste de imagen */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Ajuste de imagen
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Modo de ajuste</InputLabel>
        <Select
          value={adjustImageCrop ? 'contain' : 'cover'}
          label="Modo de ajuste"
          onChange={(e) => setAdjustImageCrop(e.target.value === 'contain')}
          disabled={isProcessing}
        >
          <MenuItem value="contain">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Icon icon="mdi:fit-to-screen" />
              <Box>
                <Typography variant="body2">Contener</Typography>
                <Typography variant="caption" color="text.secondary">
                  Mostrar toda la imagen
                </Typography>
              </Box>
            </Stack>
          </MenuItem>
          <MenuItem value="cover">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Icon icon="mdi:fullscreen" />
              <Box>
                <Typography variant="body2">Cubrir</Typography>
                <Typography variant="caption" color="text.secondary">
                  Llenar el espacio disponible
                </Typography>
              </Box>
            </Stack>
          </MenuItem>
        </Select>
      </FormControl>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Opciones de imagen
      </Typography>

      <Stack spacing={1.5}>
        {/* Botones principales */}
        {currentImageSrc ? (
          <Stack direction="column" spacing={1.5}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<Icon icon="mdi:image-plus" />}
              onClick={handleSelectImage}
              disabled={isProcessing}
            >
              Cambiar imagen
            </Button>

            {canEditImage && (
              <LoadingButton
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<Icon icon="mdi:image-edit" />}
                onClick={handleEditExistingImage}
                loading={isLoadingForEdit}
                disabled={isProcessing}
              >
                Editar actual
              </LoadingButton>
            )}
          </Stack>
        ) : null}

        {/* Botón imagen por defecto */}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Icon icon="mdi:restore" />}
          onClick={handleResetToDefault}
          disabled={isProcessing || !currentImageSrc}
        >
          Restablecer
        </Button>
      </Stack>

      {/* Input file oculto */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleFileChange}
      />

      {/* Dialog de crop */}
      <ImageCropDialog
        open={showCropDialog}
        onClose={() => {
          setShowCropDialog(false);
          setTempImage('');
        }}
        onSave={handleSaveCroppedImage}
        initialImage={tempImage}
        currentAspectRatio={undefined}
      />
    </>
  );
};

export default ImageOptions;
