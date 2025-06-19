/* eslint-disable react-hooks/exhaustive-deps */
import 'react-image-crop/dist/ReactCrop.css';
import 'src/styles/react-crop.css';

import type { DependencyList } from 'react';
import type { Crop, PixelCrop } from 'react-image-crop';

import { m } from 'framer-motion';
import { Icon } from '@iconify/react';
import ReactCrop from 'react-image-crop';
import { useRef, useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Alert,
  Stack,
  Button,
  Slider,
  Divider,
  TextField,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';

import ColorPicker from './ColorPicker';
import { imgPreview } from './imgPreview';
import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';

import type { ImageOptionsProps } from './types';

const ImageOptions = ({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
}: ImageOptionsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Estados para crop
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [adjustImageCrop, setAdjustImageCrop] = useState(true);

  // Estados para imagen
  const [originalImage, setOriginalImage] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [showCropOptions, setShowCropOptions] = useState(false);

  // 🚀 NUEVO: Estados para confirmar crop
  const [pendingCrop, setPendingCrop] = useState<string>('');
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  // Estados para upload automático
  const [isAutoUploading, setIsAutoUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');

  // 🚀 NUEVO: Estados para editar imagen existente
  const [isLoadingForEdit, setIsLoadingForEdit] = useState(false);

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // 🚀 NUEVO: Auto-trigger file picker si no hay imagen al seleccionar el componente
  useEffect(() => {
    const currentImageSrc = selectedComponent.props?.src;
    if (selectedComponentId && (!currentImageSrc || currentImageSrc === '')) {
      // Pequeño delay para evitar problemas de rendering
      const timer = setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [selectedComponentId]);

  // 🚀 NUEVO: Función para convertir URL de imagen a base64 usando endpoint
  const convertImageUrlToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      // Usar el endpoint del backend para obtener el base64
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

      // El endpoint retorna directamente el string base64
      const base64String = response.data;

      // Verificar que sea un base64 válido
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

  // 🚀 NUEVO: Manejar edición de imagen existente
  const handleEditExistingImage = async () => {
    const currentImageSrc = selectedComponent.props?.src;
    if (!currentImageSrc || isBase64Image(currentImageSrc)) return;

    setIsLoadingForEdit(true);
    setUploadMessage('Cargando imagen para edición...');

    try {
      // Convertir la imagen de S3 a base64
      const base64Image = await convertImageUrlToBase64(currentImageSrc);

      // Configurar los estados para edición
      setOriginalImage(base64Image);
      setCroppedImage(base64Image);
      setShowCropOptions(false);

      // Reset crop settings
      setCrop(undefined);
      setCompletedCrop(undefined);
      setScale(1);
      setRotate(0);
      setPendingCrop('');
      setHasPendingChanges(false);

      setUploadMessage('✅ Imagen cargada para edición');

      // Limpiar mensaje después de 2 segundos
      setTimeout(() => {
        setUploadMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error al cargar imagen para edición:', error);
      setUploadMessage('❌ Error al cargar la imagen para edición');

      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setUploadMessage('');
      }, 5000);
    } finally {
      setIsLoadingForEdit(false);
    }
  };

  // 🚀 NUEVO: Auto-upload después de seleccionar imagen
  const autoUploadToS3 = async (base64Image: string, reason: string) => {
    if (!isBase64Image(base64Image)) return base64Image;

    setIsAutoUploading(true);
    setUploadMessage(`Subiendo imagen automáticamente (${reason})...`);

    try {
      const s3Url = await uploadImageToS3(base64Image, `newsletter_image_${Date.now()}`);
      setUploadMessage('✅ Imagen subida automáticamente a S3');

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setUploadMessage('');
      }, 3000);

      return s3Url;
    } catch (error) {
      console.error('Error en auto-upload:', error);
      setUploadMessage('❌ Error al subir imagen automáticamente');

      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setUploadMessage('');
      }, 5000);

      return base64Image; // Retornar la imagen original si falla
    } finally {
      setIsAutoUploading(false);
    }
  };

  // Debounce hook personalizado
  function useDebounceEffect(fn: any, waitTime: number, deps?: DependencyList) {
    useEffect(() => {
      const time = setTimeout(() => {
        fn(...(deps || []));
      }, waitTime);

      return () => {
        clearTimeout(time);
      };
    }, deps);
  }

  // 🚀 MODIFICADO: Solo generar preview del crop sin subir automáticamente
  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef?.current && croppedImage) {
        const croppedBase64 = imgPreview(imgRef.current, completedCrop, scale, rotate);
        setPendingCrop(croppedBase64);
        setHasPendingChanges(true);
        setShowCropOptions(true);
      }
    },
    300,
    [completedCrop, scale, rotate, bgColor, adjustImageCrop]
  );

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar el tipo de archivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert(
        'Tipo de archivo no válido. Por favor selecciona una imagen PNG, JPG, JPEG, WEBP o GIF.'
      );
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result as string;
      setOriginalImage(base64String);
      setCroppedImage(base64String);

      // 🚀 Auto-upload después de seleccionar imagen
      const finalImageUrl = await autoUploadToS3(base64String, 'imagen seleccionada');

      updateComponentProps(selectedComponentId!, {
        src: finalImageUrl,
        alt: file.name,
        style: { backgroundColor: bgColor },
      });

      // Reset crop settings
      setCrop(undefined);
      setCompletedCrop(undefined);
      setScale(1);
      setRotate(0);
      setShowCropOptions(false);
      setPendingCrop('');
      setHasPendingChanges(false);
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefault = () => {
    setOriginalImage('');
    setCroppedImage('');
    setShowCropOptions(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    setRotate(0);
    setBgColor('#ffffff');
    setAdjustImageCrop(true);
    setPendingCrop('');
    setHasPendingChanges(false);

    updateComponentProps(selectedComponentId!, {
      src: '',
      alt: 'Imagen por defecto',
      style: { backgroundColor: '#ffffff' },
    });
  };

  const handleDeleteImage = () => {
    handleResetToDefault();
  };

  const handleResetCrop = () => {
    if (originalImage) {
      setCroppedImage(originalImage);
      updateComponentProps(selectedComponentId!, {
        src: originalImage,
        style: {
          backgroundColor: bgColor,
          objectFit: adjustImageCrop ? 'contain' : 'cover',
        },
      });
      setCrop(undefined);
      setCompletedCrop(undefined);
      setScale(1);
      setRotate(0);
      setShowCropOptions(false);
      setPendingCrop('');
      setHasPendingChanges(false);
    }
  };

  // 🚀 NUEVO: Confirmar y guardar el crop
  const handleSaveCrop = async () => {
    if (!pendingCrop) return;

    // Subir el crop a S3
    const finalImageUrl = await autoUploadToS3(pendingCrop, 'crop confirmado');

    updateComponentProps(selectedComponentId!, {
      src: finalImageUrl,
      style: {
        ...selectedComponent.props?.style,
        backgroundColor: bgColor,
        objectFit: adjustImageCrop ? 'contain' : 'cover',
      },
    });

    // Limpiar estados de crop pendiente
    setPendingCrop('');
    setHasPendingChanges(false);
  };

  const onImageLoad = () => {
    // Image loaded, ready for cropping
  };

  const currentImageSrc = selectedComponent.props?.src;
  const needsUpload = isBase64Image(currentImageSrc);
  const isProcessing = uploading || isAutoUploading || isLoadingForEdit;

  // 🚀 NUEVO: Determinar si se puede editar la imagen
  const canEditImage =
    currentImageSrc && !needsUpload && !currentImageSrc.startsWith('/assets/') && !croppedImage;

  return (
    <>
      {/* 🚀 ELIMINADA: Vista previa - simplificamos la interfaz */}

      {/* 🚀 NUEVO: Progress bar para upload automático */}
      {isProcessing && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            {uploadMessage || `Procesando: ${uploadProgress}%`}
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* 🚀 NUEVO: Mensaje de estado del upload automático */}
      {uploadMessage && !isProcessing && (
        <Alert
          severity={uploadMessage.includes('✅') ? 'success' : 'error'}
          sx={{ mb: 2, fontSize: '0.875rem' }}
        >
          {uploadMessage}
        </Alert>
      )}

      {/* 🚀 NUEVO: Alerta para cambios pendientes */}
      {hasPendingChanges && !isProcessing && (
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
          📝 Tienes cambios de crop pendientes. Haz clic en &quot;Guardar&quot; para aplicarlos.
        </Alert>
      )}

      {/* Alertas simplificadas */}
      {!uploadMessage && !isProcessing && !hasPendingChanges && (
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

      {/* 🚀 NUEVO: Botón inicial para seleccionar imagen (solo si no hay imagen) */}
      {!currentImageSrc && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<Icon icon="mdi:image-plus" />}
          onClick={handleSelectImage}
          disabled={isProcessing}
          sx={{ mb: 2 }}
        >
          Seleccionar imagen
        </Button>
      )}

      {/* Texto alternativo */}
      <Typography variant="subtitle2" gutterBottom>
        Texto alternativo
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Describe la imagen"
        value={selectedComponent.props?.alt || ''}
        onChange={(e) => updateComponentProps(selectedComponentId!, { alt: e.target.value })}
        disabled={isProcessing}
        sx={{ mb: 3 }}
      />

      {/* Opciones de edición avanzada */}
      {croppedImage && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Opciones de edición
          </Typography>

          {/* Color de fondo */}
          <ColorPicker
            label="Color de fondo"
            name="bgColor"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />

          {/* Opciones de crop con animación */}
          {showCropOptions && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Escalar
                </Typography>
                <Slider
                  size="small"
                  value={scale}
                  step={0.1}
                  min={0.5}
                  max={3}
                  marks
                  valueLabelDisplay="auto"
                  onChange={(_, newValue) => setScale(Number(newValue))}
                  disabled={isProcessing}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Rotar
                </Typography>
                <Slider
                  size="small"
                  value={rotate}
                  step={1}
                  min={-180}
                  max={180}
                  marks
                  valueLabelDisplay="auto"
                  onChange={(_, newValue) => setRotate(Number(newValue))}
                  disabled={isProcessing}
                />
              </Box>
            </m.div>
          )}

          {/* Botones de acción */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <IconButton
              onClick={handleResetCrop}
              disabled={!croppedImage || isProcessing}
              title="Resetear crop"
            >
              <Icon icon="mdi:restore" />
            </IconButton>
            <IconButton
              onClick={handleDeleteImage}
              disabled={!croppedImage || isProcessing}
              title="Eliminar imagen"
              color="error"
            >
              <Icon icon="mdi:delete" />
            </IconButton>
          </Stack>
        </>
      )}

      {/* React Crop */}
      {croppedImage && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Editor de imagen
          </Typography>
          <Box sx={{ mb: 2, opacity: isProcessing ? 0.5 : 1, transition: 'opacity 0.3s ease' }}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              style={{ width: '100%' }}
              disabled={isProcessing}
            >
              <img
                ref={imgRef}
                alt="Crop editor"
                src={croppedImage}
                onLoad={onImageLoad}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  backgroundColor: bgColor,
                  objectFit: 'contain',
                  maxWidth: '100%',
                }}
              />
            </ReactCrop>
          </Box>
        </>
      )}

      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle2" gutterBottom>
        Opciones de imagen
      </Typography>

      <Stack spacing={1.5}>
        {/* Botón cambiar/editar imagen */}
        {currentImageSrc && !croppedImage && (
          <Stack direction="column" spacing={1}>
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
        )}

        {/* Botón cambiar imagen cuando está en modo edición */}
        {croppedImage && (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<Icon icon="mdi:image-plus" />}
            onClick={handleSelectImage}
            disabled={isProcessing}
          >
            Cambiar imagen
          </Button>
        )}

        {/* Botón guardar crop */}
        <LoadingButton
          variant="contained"
          color={hasPendingChanges ? 'success' : 'secondary'}
          fullWidth
          startIcon={<Icon icon="mdi:content-save" />}
          onClick={handleSaveCrop}
          loading={isAutoUploading}
          disabled={!pendingCrop || isProcessing}
        >
          {hasPendingChanges ? 'Guardar Crop' : 'Guardar Crop'}
        </LoadingButton>

        {/* Botón imagen por defecto */}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Icon icon="mdi:restore" />}
          onClick={handleResetToDefault}
          disabled={isProcessing}
        >
          Imagen por defecto
        </Button>
      </Stack>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImageOptions;
