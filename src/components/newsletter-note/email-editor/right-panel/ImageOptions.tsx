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
  Chip,
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

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

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

  // Auto-crop cuando cambian los parámetros
  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef?.current && croppedImage) {
        const croppedBase64 = imgPreview(imgRef.current, completedCrop, scale, rotate);
        updateComponentProps(selectedComponentId!, {
          src: croppedBase64,
          style: {
            ...selectedComponent.props?.style,
            backgroundColor: bgColor,
            objectFit: adjustImageCrop ? 'contain' : 'cover',
          },
        });
        setShowCropOptions(true);
      }
    },
    100,
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
    reader.onload = () => {
      const base64String = reader.result as string;
      setOriginalImage(base64String);
      setCroppedImage(base64String);
      updateComponentProps(selectedComponentId!, {
        src: base64String,
        alt: file.name,
        style: { backgroundColor: bgColor },
      });
      // Reset crop settings
      setCrop(undefined);
      setCompletedCrop(undefined);
      setScale(1);
      setRotate(0);
      setShowCropOptions(false);
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
    }
  };

  const handleUploadToS3 = async () => {
    const currentSrc = selectedComponent.props?.src;
    if (!currentSrc || currentSrc.startsWith('/assets/')) {
      alert('No hay imagen para subir o es una imagen por defecto');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(currentSrc, `newsletter_image_${Date.now()}`);
      updateComponentProps(selectedComponentId!, { src: s3Url });
    } catch (error) {
      alert('Error al subir la imagen a S3');
      console.error(error);
    }
  };

  const onImageLoad = () => {
    // Image loaded, ready for cropping
  };

  const currentImageSrc = selectedComponent.props?.src;
  const needsUpload = isBase64Image(currentImageSrc);

  return (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Vista previa
      </Typography>
      <Box sx={{ mb: 3, textAlign: 'center', position: 'relative' }}>
        {currentImageSrc ? (
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={currentImageSrc}
              alt={selectedComponent.props.alt || 'Vista previa'}
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                backgroundColor: bgColor,
              }}
            />

            {/* Chip indicador para imágenes que necesitan subirse */}
            {needsUpload && (
              <Chip
                icon={<Icon icon="mdi:cloud-upload-outline" />}
                label="Pendiente subir"
                color="warning"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  fontSize: '0.7rem',
                  height: '20px',
                  backgroundColor: 'rgba(255, 152, 0, 0.9)',
                  color: 'white',
                  '& .MuiChip-icon': {
                    color: 'white',
                    fontSize: '14px',
                  },
                  '& .MuiChip-label': {
                    padding: '0 4px',
                  },
                  zIndex: 10,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            )}
          </Box>
        ) : (
          <Box
            sx={{
              height: '100px',
              border: '2px dashed #ccc',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            No hay imagen seleccionada
          </Box>
        )}
      </Box>

      {/* Alerta específica para imágenes que necesitan subirse */}
      {needsUpload ? (
        <Alert severity="warning" sx={{ mb: 2, fontSize: '0.875rem' }}>
          ⚠️ Esta imagen debe subirse a S3 antes de guardar la nota
        </Alert>
      ) : currentImageSrc && !currentImageSrc.startsWith('/assets/') ? (
        <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>
          ✅ Imagen guardada en S3 correctamente
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Selecciona una imagen para editarla con herramientas avanzadas de crop, escala y rotación.
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<Icon icon="mdi:image-plus" />}
        onClick={handleSelectImage}
        sx={{ mb: 2 }}
      >
        Seleccionar imagen
      </Button>

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
                />
              </Box>
            </m.div>
          )}

          {/* Botones de acción */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <IconButton onClick={handleResetCrop} disabled={!croppedImage} title="Resetear crop">
              <Icon icon="mdi:restore" />
            </IconButton>
            <IconButton
              onClick={handleDeleteImage}
              disabled={!croppedImage}
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
          <Box sx={{ mb: 2 }}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              style={{ width: '100%' }}
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

      {/* Subida a S3 */}
      {selectedComponent.props?.src && !selectedComponent.props.src.startsWith('/assets/') && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Almacenamiento
          </Typography>
          {uploading && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Subiendo: {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
          <LoadingButton
            variant={needsUpload ? 'contained' : 'outlined'}
            color={needsUpload ? 'warning' : 'secondary'}
            fullWidth
            startIcon={<Icon icon="mdi:cloud-upload" />}
            onClick={handleUploadToS3}
            loading={uploading}
            sx={{ mb: 2 }}
          >
            {needsUpload ? '⚠️ Subir a S3 (Requerido)' : 'Resubir a S3'}
          </LoadingButton>
        </>
      )}

      {/* Botones principales */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Icon icon="mdi:restore" />}
          onClick={handleResetToDefault}
        >
          Imagen por defecto
        </Button>
      </Box>

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
