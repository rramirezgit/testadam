import 'react-image-crop/dist/ReactCrop.css';
import 'src/styles/react-crop.css';

import type { Crop, PixelCrop } from 'react-image-crop';

import { Icon } from '@iconify/react';
import ReactCrop from 'react-image-crop';
import { useRef, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Stack,
  Dialog,
  AppBar,
  Slider,
  Button,
  Tooltip,
  Toolbar,
  Typography,
  ToggleButton,
  DialogContent,
  ToggleButtonGroup,
} from '@mui/material';

import { imgPreview } from './imgPreview';
import ImageAiGenerator from './ImageAiGenerator';

import type { CropRatio, ImageCropDialogProps } from './types';

// Ratios predefinidos
const CROP_RATIOS: CropRatio[] = [
  { label: '16:9', value: 16 / 9, icon: 'mdi:rectangle' },
  { label: '4:3', value: 4 / 3, icon: 'mdi:rectangle' },
  { label: '1:1', value: 1, icon: 'mdi:square' },
  { label: 'Libre', value: undefined, icon: 'mdi:crop-free' },
];

export default function ImageCropDialog({
  open,
  onClose,
  onSave,
  initialImage,
  currentAspectRatio,
  initialTab = 'edit',
}: ImageCropDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  // Estado para tabs
  const [activeTab, setActiveTab] = useState<'edit' | 'ai'>(initialTab);

  // Imagen actual (puede cambiar si se genera una nueva con IA)
  const [currentImage, setCurrentImage] = useState<string>(initialImage);

  // Estados para crop
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState<number | undefined>(currentAspectRatio);
  // const [objectFit, setObjectFit] = useState<'contain' | 'cover'>('contain'); // Not used currently

  // Estado para preview
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewDimensions, setPreviewDimensions] = useState({ width: 0, height: 0 });

  // Sincronizar currentImage con initialImage
  useEffect(() => {
    setCurrentImage(initialImage);
  }, [initialImage]);

  // Sincronizar activeTab con initialTab cuando se abre el modal
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Efecto para generar preview en tiempo real
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (completedCrop?.width && completedCrop?.height && imgRef?.current && currentImage) {
        try {
          const croppedBase64 = imgPreview(imgRef.current, completedCrop, scale, rotate);
          setPreviewImage(croppedBase64);
          setPreviewDimensions({
            width: completedCrop.width,
            height: completedCrop.height,
          });
        } catch (error) {
          console.error('Error generando preview:', error);
        }
      }
    }, 150); // Reducido para mayor responsividad

    return () => clearTimeout(timeoutId);
  }, [completedCrop, scale, rotate, currentImage]);

  // Manejar imagen generada con IA
  const handleImageGenerated = useCallback((imageUrl: string) => {
    setCurrentImage(imageUrl);
    setActiveTab('edit');
    // Resetear crop para la nueva imagen
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    setRotate(0);
    setPreviewImage('');
  }, []);

  // Manejar cambio de ratio
  const handleRatioChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRatio: number | undefined
  ) => {
    if (newRatio === selectedRatio) return;

    setSelectedRatio(newRatio);

    // Si hay una imagen cargada, crear un crop inicial con el nuevo ratio
    if (imgRef.current && newRatio !== undefined) {
      const { width, height } = imgRef.current;
      const centerX = width / 2;
      const centerY = height / 2;

      // Calcular dimensiones del crop basado en el ratio
      let cropWidth = width * 0.8;
      let cropHeight = cropWidth / newRatio;

      // Ajustar si el crop es muy alto
      if (cropHeight > height * 0.8) {
        cropHeight = height * 0.8;
        cropWidth = cropHeight * newRatio;
      }

      const newCrop: Crop = {
        unit: 'px',
        x: centerX - cropWidth / 2,
        y: centerY - cropHeight / 2,
        width: cropWidth,
        height: cropHeight,
      };

      setCrop(newCrop);
    } else if (newRatio === undefined) {
      // Modo libre - resetear crop
      setCrop(undefined);
    }
  };

  // Callbacks para ReactCrop
  const handleCropChange = useCallback((_, percentCrop: Crop) => {
    setCrop(percentCrop);
  }, []);

  const handleCropComplete = useCallback((pixelCrop: PixelCrop) => {
    setCompletedCrop(pixelCrop);
  }, []);

  const onImageLoad = useCallback(() => {
    // Inicializar crop si hay un ratio seleccionado
    if (selectedRatio !== undefined && imgRef.current) {
      const { width, height } = imgRef.current;
      const centerX = width / 2;
      const centerY = height / 2;

      let cropWidth = width * 0.8;
      let cropHeight = cropWidth / selectedRatio;

      if (cropHeight > height * 0.8) {
        cropHeight = height * 0.8;
        cropWidth = cropHeight * selectedRatio;
      }

      const initialCrop: Crop = {
        unit: 'px',
        x: centerX - cropWidth / 2,
        y: centerY - cropHeight / 2,
        width: cropWidth,
        height: cropHeight,
      };

      setCrop(initialCrop);
    }
  }, [selectedRatio]);

  // Manejar aplicar cambios
  const handleApply = () => {
    if (previewImage) {
      onSave(previewImage);
    } else if (currentImage) {
      // Si no hay crop, usar imagen actual (puede ser la original o generada con IA)
      onSave(currentImage);
    }
    handleClose();
  };

  // Manejar cancelar
  const handleClose = () => {
    // Resetear estados
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1);
    setRotate(0);
    setPreviewImage('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '95vh',
          maxHeight: '900px',
        },
      }}
    >
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {activeTab === 'edit' ? 'Editar imagen' : 'Generar imagen con IA'}
          </Typography>

          {/* Toggle entre Editar e IA */}
          <ToggleButtonGroup
            value={activeTab}
            exclusive
            onChange={(_, newValue) => newValue && setActiveTab(newValue)}
            size="small"
            sx={{ mr: 2 }}
          >
            <ToggleButton value="edit">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Icon icon="mdi:image-edit" width={18} />
                <Typography variant="caption">Editar</Typography>
              </Stack>
            </ToggleButton>
            <ToggleButton value="ai">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Icon icon="mdi:sparkles" width={18} />
                <Typography variant="caption">IA</Typography>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button color="inherit" onClick={handleClose} sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            disabled={!currentImage}
            startIcon={<Icon icon="mdi:check" />}
          >
            Aplicar
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent sx={{ p: 3 }}>
        {activeTab === 'ai' ? (
          /* Modo IA - Generador de imágenes */
          <ImageAiGenerator onImageGenerated={handleImageGenerated} userId={undefined} />
        ) : (
          /* Modo Editar - Editor de imágenes tradicional */
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              height: '100%',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* Columna izquierda - Editor de imagen */}
            <Box sx={{ flex: { xs: '1 1 auto', md: '2 1 0' }, minWidth: 0 }}>
              <Card
                elevation={1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: 'grey.50',
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Vista de edición
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    backgroundColor: 'grey.100',
                    overflow: 'auto',
                  }}
                >
                  {currentImage ? (
                    <ReactCrop
                      crop={crop}
                      onChange={handleCropChange}
                      onComplete={handleCropComplete}
                      aspect={selectedRatio}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    >
                      <img
                        ref={imgRef}
                        alt="Editor"
                        src={currentImage}
                        onLoad={onImageLoad}
                        style={{
                          transform: `scale(${scale}) rotate(${rotate}deg)`,
                          objectFit: 'contain',
                          maxWidth: '100%',
                          maxHeight: '600px',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    </ReactCrop>
                  ) : (
                    <Typography color="text.secondary">No hay imagen para editar</Typography>
                  )}
                </Box>
              </Card>
            </Box>

            {/* Columna derecha - Controles */}
            <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 0' }, minWidth: 0 }}>
              <Stack spacing={2} sx={{ height: '100%' }}>
                {/* Sección 1: Ratios predefinidos */}
                <Card elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Proporción de aspecto
                  </Typography>
                  <ToggleButtonGroup
                    value={selectedRatio}
                    exclusive
                    onChange={handleRatioChange}
                    aria-label="aspect ratio"
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    {CROP_RATIOS.map((ratio) => (
                      <Tooltip key={ratio.label} title={ratio.label}>
                        <ToggleButton value={ratio.value} aria-label={ratio.label}>
                          <Stack direction="column" alignItems="center" spacing={0.5}>
                            <Icon icon={ratio.icon} style={{ fontSize: 20 }} />
                            <Typography variant="caption">{ratio.label}</Typography>
                          </Stack>
                        </ToggleButton>
                      </Tooltip>
                    ))}
                  </ToggleButtonGroup>
                </Card>

                {/* Sección 2: Ajustes */}
                <Card elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  {/* Escala */}
                  <Box sx={{ mt: 2, px: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Icon icon="mdi:magnify" style={{ fontSize: 20, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Escala: {scale.toFixed(1)}x
                      </Typography>
                    </Stack>
                    <Slider
                      size="small"
                      value={scale}
                      step={0.1}
                      min={0.5}
                      max={3}
                      marks={[
                        { value: 0.5, label: '0.5x' },
                        { value: 1, label: '1x' },
                        { value: 2, label: '2x' },
                        { value: 3, label: '3x' },
                      ]}
                      valueLabelDisplay="auto"
                      onChange={(_, newValue) => setScale(Number(newValue))}
                    />
                  </Box>

                  {/* Rotación */}
                  <Box sx={{ mt: 3, px: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                      <Icon
                        icon="mdi:rotate-right"
                        style={{ fontSize: 20, color: 'text.secondary' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Rotación: {rotate}°
                      </Typography>
                    </Stack>
                    <Slider
                      size="small"
                      value={rotate}
                      step={1}
                      min={-180}
                      max={180}
                      marks={[
                        { value: -180, label: '-180°' },
                        { value: 0, label: '0°' },
                        { value: 180, label: '180°' },
                      ]}
                      valueLabelDisplay="auto"
                      onChange={(_, newValue) => setRotate(Number(newValue))}
                    />
                  </Box>
                </Card>

                {/* Sección 3: Configuración */}
                {/* <Card elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Configuración
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                  <InputLabel>Ajuste de imagen</InputLabel>
                  <Select
                    value={objectFit}
                    label="Ajuste de imagen"
                    onChange={(e) => setObjectFit(e.target.value as 'contain' | 'cover')}
                  >
                    <MenuItem value="contain">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Icon icon="mdi:fit-to-screen" />
                        <Typography>Contener (mostrar toda)</Typography>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="cover">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Icon icon="mdi:fullscreen" />
                        <Typography>Cubrir (llenar espacio)</Typography>
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Card> */}

                {/* Sección 4: Vista previa */}
                {previewImage && (
                  <Card elevation={2} sx={{ p: 2, borderRadius: 2, flexGrow: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Vista previa del resultado
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        p: 1,
                        border: 2,
                        borderColor: 'primary.main',
                        borderRadius: 1,
                        backgroundColor: 'grey.50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 150,
                      }}
                    >
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px',
                          objectFit: 'contain',
                          borderRadius: 4,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      Dimensiones: {Math.round(previewDimensions.width)} x{' '}
                      {Math.round(previewDimensions.height)} px
                    </Typography>
                  </Card>
                )}
              </Stack>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
