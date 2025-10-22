/* eslint-disable react-hooks/exhaustive-deps */
import 'react-image-crop/dist/ReactCrop.css';
import 'src/styles/react-crop.css';

import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';

import {
  Box,
  Alert,
  Stack,
  Button,
  Slider,
  Select,
  Switch,
  Tooltip,
  Skeleton,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  InputLabel,
  FormControl,
  LinearProgress,
  FormControlLabel,
} from '@mui/material';

import GeneralColorPicker from 'src/components/newsletter-note/general-color-picker';

import ImageCropDialog from './ImageCropDialog';
import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';
import { validateFileSize, convertImageToOptimalFormat } from './imgPreview';

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
      // Convertir al formato óptimo (PNG si tiene transparencia, WebP si no)
      const processedBase64 = await convertImageToOptimalFormat(file, 0.9);
      setTempImage(processedBase64);
      setShowCropDialog(true);
    } catch (error) {
      console.error('Error processing image:', error);
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
      {/* {!uploadMessage && !isProcessing && (
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
      )} */}

      {/* Vista previa de la imagen con botones integrados */}
      {currentImageSrc && (
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
                src={currentImageSrc}
                alt={selectedComponent.props?.alt || 'Preview'}
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
                    onClick={handleSelectImage}
                    disabled={isProcessing}
                    sx={{
                      backgroundColor: 'background.paper',
                      width: 56,
                      height: 56,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon icon="mdi:image-plus" width={28} />
                  </IconButton>
                </Tooltip>

                {/* Botón Editar Imagen */}
                {canEditImage && (
                  <Tooltip title="Editar imagen actual" arrow>
                    <IconButton
                      onClick={handleEditExistingImage}
                      disabled={isProcessing}
                      sx={{
                        backgroundColor: 'background.paper',
                        width: 56,
                        height: 56,
                        '&:hover': {
                          backgroundColor: 'info.main',
                          color: 'info.contrastText',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon icon="mdi:image-edit" width={28} />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Botón Eliminar/Restablecer */}
                <Tooltip title="Restablecer imagen" arrow>
                  <IconButton
                    onClick={handleResetToDefault}
                    disabled={isProcessing}
                    sx={{
                      backgroundColor: 'background.paper',
                      width: 56,
                      height: 56,
                      '&:hover': {
                        backgroundColor: 'error.main',
                        color: 'error.contrastText',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon icon="mdi:delete-outline" width={28} />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
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

      {/* URL de enlace */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Enlace (opcional)
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="https://ejemplo.com"
        value={selectedComponent.props?.link || ''}
        onChange={(e) => updateComponentProps(selectedComponentId!, { link: e.target.value })}
        disabled={isProcessing}
        helperText="Si agregas una URL, la imagen será clickeable en el correo electronico"
        sx={{ mb: 3 }}
      />

      {/* Altura de la imagen */}
      {currentImageSrc && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Altura de la imagen
          </Typography>

          {/* Switch para altura automática */}
          <FormControlLabel
            control={
              <Switch
                checked={selectedComponent.props?.style?.height === 'auto'}
                onChange={(e) => {
                  updateComponentProps(selectedComponentId!, {
                    style: {
                      ...selectedComponent.props?.style,
                      height: e.target.checked ? 'auto' : '400px',
                    },
                  });
                }}
                disabled={isProcessing}
              />
            }
            label="Altura automática"
            sx={{ mb: 2 }}
          />

          {/* Slider solo visible cuando NO es auto */}
          {selectedComponent.props?.style?.height !== 'auto' && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2 }}>
                <Slider
                  value={
                    selectedComponent.props?.style?.height
                      ? parseInt(selectedComponent.props.style.height as string)
                      : 400
                  }
                  onChange={(_, newValue) => {
                    updateComponentProps(selectedComponentId!, {
                      style: {
                        ...selectedComponent.props?.style,
                        height: `${newValue}px`,
                      },
                    });
                  }}
                  min={100}
                  max={800}
                  step={50}
                  marks={[
                    { value: 100, label: '100px' },
                    { value: 400, label: '400px' },
                    { value: 800, label: '800px' },
                  ]}
                  valueLabelDisplay="auto"
                  disabled={isProcessing}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                Controla la altura del contenedor de la imagen
              </Typography>

              {/* Color de fondo del contenedor */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Color de fondo del contenedor
                </Typography>
                <GeneralColorPicker
                  selectedColor={selectedComponent.props?.style?.containerBackgroundColor || ''}
                  onChange={(color) => {
                    updateComponentProps(selectedComponentId!, {
                      style: {
                        ...selectedComponent.props?.style,
                        containerBackgroundColor: color,
                      },
                    });
                  }}
                  label=""
                  showLabel={false}
                  allowReset
                  size="medium"
                  defaultColors={[
                    '#FFFFFF',
                    '#F5F5F5',
                    '#E0E0E0',
                    '#000000',
                    '#808080',
                    '#FFA500',
                    '#008000',
                    '#FF4500',
                  ]}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  Define el color de fondo del contenedor de la imagen
                </Typography>
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Ajuste de imagen - Solo visible cuando NO es altura automática */}
      {currentImageSrc && selectedComponent.props?.style?.height !== 'auto' && (
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
      )}

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
