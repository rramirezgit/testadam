import type { EmailComponent } from 'src/types/saved-note';

import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import {
  Box,
  Card,
  Chip,
  Alert,
  Stack,
  Button,
  Dialog,
  Slider,
  Switch,
  Tooltip,
  Accordion,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  ToggleButton,
  DialogContent,
  DialogActions,
  LinearProgress,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  ToggleButtonGroup,
} from '@mui/material';

import useAuthStore from 'src/store/AuthStore';

import GeneralColorPicker from 'src/components/newsletter-note/general-color-picker';

import ImageCropDialog from './ImageCropDialog';
import ImageSourceModal from './ImageSourceModal';
import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';
import { convertImageToOptimalFormat } from './imgPreview';

interface ImageTextOptionsProps {
  component: EmailComponent;
  updateComponentProps: (componentId: string, props: Record<string, any>) => void;
}

// Presets de configuración predefinidos
const PRESETS = [
  {
    name: 'Minimalista',
    color: '#667eea',
    config: {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      titleColor: '#667eea',
      borderRadius: 0,
      padding: 24,
      spacing: 20,
      imageBackgroundColor: 'transparent',
      imageContainerBackgroundColor: '',
    },
  },
  {
    name: 'Elegante',
    color: '#764ba2',
    config: {
      backgroundColor: '#f8f9fa',
      textColor: '#4a5568',
      titleColor: '#2d3748',
      borderRadius: 12,
      padding: 24,
      spacing: 16,
      imageBackgroundColor: '#ffffff',
      imageContainerBackgroundColor: '#e2e8f0',
    },
  },
  {
    name: 'Moderno',
    color: '#00b894',
    config: {
      backgroundColor: '#ecfdf5',
      textColor: '#065f46',
      titleColor: '#047857',
      borderRadius: 16,
      padding: 20,
      spacing: 20,
      imageBackgroundColor: 'transparent',
      imageContainerBackgroundColor: '#d1fae5',
    },
  },
  {
    name: 'Cálido',
    color: '#fd79a8',
    config: {
      backgroundColor: '#fff5f7',
      textColor: '#831843',
      titleColor: '#be185d',
      borderRadius: 20,
      padding: 24,
      spacing: 16,
      imageBackgroundColor: 'transparent',
      imageContainerBackgroundColor: '#fce7f3',
    },
  },
  {
    name: 'Profesional',
    color: '#1565c0',
    config: {
      backgroundColor: '#e3f2fd',
      textColor: '#0d47a1',
      titleColor: '#1565c0',
      borderRadius: 8,
      padding: 20,
      spacing: 16,
      imageBackgroundColor: '#ffffff',
      imageContainerBackgroundColor: '#bbdefb',
    },
  },
  {
    name: 'Oscuro',
    color: '#2c3e50',
    config: {
      backgroundColor: '#2c3e50',
      textColor: '#ecf0f1',
      titleColor: '#3498db',
      borderRadius: 12,
      padding: 24,
      spacing: 20,
      imageBackgroundColor: 'transparent',
      imageContainerBackgroundColor: '#34495e',
    },
  },
];

const ImageTextOptions = ({ component, updateComponentProps }: ImageTextOptionsProps) => {
  // Obtener usuario autenticado
  const user = useAuthStore((state) => state.user);

  // Referencias para input de archivos
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para imagen
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [tempImage, setTempImage] = useState<string>('');
  const [cropDialogInitialTab, setCropDialogInitialTab] = useState<'edit' | 'ai'>('edit');

  // Estados para upload y errores
  const [isAutoUploading, setIsAutoUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Estados para acordeones (todos abiertos por defecto)
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('imagen');

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // Props del componente
  const imageUrl = component.props?.imageUrl || '';
  const imageAlt = component.props?.imageAlt || 'Imagen';
  const imageLink = component.props?.imageLink || '';
  const imageWidth = component.props?.imageWidth || 40;
  const spacing = component.props?.spacing || 16;
  const borderRadius = component.props?.borderRadius || 8;
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const textColor = component.props?.textColor || '#333333';
  const titleColor = component.props?.titleColor || '#000000';
  const fontSize = component.props?.fontSize || 14;
  const titleSize = component.props?.titleSize || 20;
  const padding = component.props?.padding || 16;

  // Props de imagen
  const imageHeight = component.props?.imageHeight || 'auto';
  const imageObjectFit = component.props?.imageObjectFit || 'contain';
  const imageContainerBackgroundColor = component.props?.imageContainerBackgroundColor || '';

  // Layout prop
  const layout = component.props?.layout || 'image-left';

  // Handler genérico para actualizar props
  const handleInputChange = (field: string, value: any) => {
    updateComponentProps(component.id, { [field]: value });
  };

  // Handler para aplicar un preset completo
  const handleApplyPreset = (preset: Record<string, any>) => {
    updateComponentProps(component.id, preset);
  };

  // Función para manejar selección desde PC
  const handleSelectFromPC = () => {
    setShowSourceModal(false);
    setCropDialogInitialTab('edit');
    fileInputRef.current?.click();
  };

  // Función para manejar generación con IA
  const handleGenerateWithAI = () => {
    setShowSourceModal(false);
    setCropDialogInitialTab('ai');
    // Abrir el ImageCropDialog directamente en modo IA
    setTempImage(''); // No hay imagen temporal cuando se genera con IA
    setShowCropDialog(true);
  };

  // Función para manejar cambios de archivos
  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        setTempImage(base64);
        setShowCropDialog(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para auto-upload con manejo de errores
  const autoUploadToS3 = async (base64Image: string): Promise<string> => {
    if (!isBase64Image(base64Image)) return base64Image;

    setIsAutoUploading(true);
    setUploadMessage('Subiendo imagen automáticamente...');

    try {
      // Validar tamaño de la imagen
      const sizeInBytes = Math.ceil((base64Image.length * 3) / 4);
      const sizeInMB = sizeInBytes / (1024 * 1024);

      if (sizeInMB > 1) {
        setUploadMessage('Optimizando imagen...');
        // Convertir a formato óptimo si es muy pesada
        try {
          // Convertir base64 a Blob
          const response = await fetch(base64Image);
          const blob = await response.blob();
          const file = new File([blob], 'image.png', { type: blob.type });

          // Optimizar
          const optimizedBase64 = await convertImageToOptimalFormat(file, 0.85);
          base64Image = optimizedBase64;
        } catch (conversionError) {
          console.error('Error al optimizar:', conversionError);
          throw new Error(
            'No se pudo optimizar la imagen. Por favor, intenta con una imagen más pequeña.'
          );
        }
      }

      // Subir a S3
      setUploadMessage('Subiendo a S3...');
      const s3Url = await uploadImageToS3(base64Image, `imagetext_${Date.now()}`);
      setUploadMessage('✅ Imagen subida correctamente');

      setTimeout(() => {
        setUploadMessage('');
      }, 3000);

      return s3Url;
    } catch (error) {
      console.error('Error en auto-upload:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'Error desconocido al subir la imagen';
      setErrorMessage(errorMsg);
      setShowErrorDialog(true);
      setUploadMessage('');
      throw error;
    } finally {
      setIsAutoUploading(false);
    }
  };

  // Función para guardar imagen después del crop
  const handleSaveCroppedImage = async (croppedBase64: string) => {
    setShowCropDialog(false);

    // Primero actualizar con la imagen base64 para mostrar preview
    updateComponentProps(component.id, { imageUrl: croppedBase64 });

    // Luego subir automáticamente a S3
    try {
      const s3Url = await autoUploadToS3(croppedBase64);
      updateComponentProps(component.id, { imageUrl: s3Url });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      // Mantener la imagen base64 si falla la subida
    }
  };

  // Función para abrir el modal de selección
  const handleSelectImage = () => {
    setShowSourceModal(true);
  };

  // Handler para eliminar imagen
  const handleResetImage = () => {
    updateComponentProps(component.id, { imageUrl: '' });
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

  const needsUpload = isBase64Image(imageUrl);
  const isProcessing = uploading || isAutoUploading;

  return (
    <Box>
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
          severity={uploadMessage.includes('✅') ? 'success' : 'warning'}
          sx={{ mb: 2, fontSize: '0.875rem' }}
        >
          {uploadMessage}
        </Alert>
      )}
      {/* ======================== */}
      {/* ACORDEÓN: IMAGEN */}
      {/* ======================== */}
      <Accordion
        expanded={expandedAccordion === 'imagen'}
        onChange={handleAccordionChange('imagen')}
        defaultExpanded
      >
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Imagen
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Vista previa de la imagen con botones integrados */}
          {imageUrl && (
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
              {/* Imagen */}
              <img
                src={imageUrl}
                alt={imageAlt}
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

                {/* Botón Eliminar/Restablecer */}
                <Tooltip title="Eliminar imagen" arrow>
                  <IconButton
                    onClick={handleResetImage}
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

              {/* Indicador de subida */}
              {needsUpload && (
                <Chip
                  label="Subiendo..."
                  color="warning"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                  }}
                />
              )}
            </Box>
          )}

          {/* Botón inicial para seleccionar imagen */}
          {!imageUrl && (
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
            value={imageAlt}
            onChange={(e) => handleInputChange('imageAlt', e.target.value)}
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
            value={imageLink}
            onChange={(e) => handleInputChange('imageLink', e.target.value)}
            disabled={isProcessing}
            helperText="Si agregas una URL, la imagen será clickeable"
            sx={{ mb: 3 }}
          />

          {/* Altura de la imagen */}
          {imageUrl && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Altura de la imagen
              </Typography>

              {/* Switch para altura automática */}
              <FormControlLabel
                control={
                  <Switch
                    checked={imageHeight === 'auto'}
                    onChange={(e) => {
                      handleInputChange('imageHeight', e.target.checked ? 'auto' : '300px');
                    }}
                    disabled={isProcessing}
                  />
                }
                label="Altura automática"
                sx={{ mb: 2 }}
              />

              {/* Slider solo visible cuando NO es auto */}
              {imageHeight !== 'auto' && (
                <>
                  <Slider
                    value={parseInt(imageHeight) || 300}
                    onChange={(_, newValue) => {
                      handleInputChange('imageHeight', `${newValue}px`);
                    }}
                    min={100}
                    max={600}
                    step={50}
                    marks={[
                      { value: 100, label: '100px' },
                      { value: 300, label: '300px' },
                      { value: 600, label: '600px' },
                    ]}
                    valueLabelDisplay="auto"
                    disabled={isProcessing}
                    sx={{ mb: 2 }}
                  />

                  {/* Ajuste de imagen */}
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                    Ajuste de imagen
                  </Typography>
                  <ToggleButtonGroup
                    value={imageObjectFit}
                    exclusive
                    onChange={(_, value) => {
                      if (value) handleInputChange('imageObjectFit', value);
                    }}
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    <ToggleButton value="contain">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Icon icon="mdi:fit-to-screen" width={20} />
                        <Typography variant="caption">Contener</Typography>
                      </Stack>
                    </ToggleButton>
                    <ToggleButton value="cover">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Icon icon="mdi:crop" width={20} />
                        <Typography variant="caption">Cubrir</Typography>
                      </Stack>
                    </ToggleButton>
                  </ToggleButtonGroup>

                  {/* Color de fondo del contenedor */}
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                    Color de fondo del contenedor
                  </Typography>
                  <GeneralColorPicker
                    selectedColor={imageContainerBackgroundColor}
                    onChange={(color) => handleInputChange('imageContainerBackgroundColor', color)}
                    label=""
                    showLabel={false}
                    allowReset
                    size="medium"
                  />
                </>
              )}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* ======================== */}
      {/* ACORDEÓN: ESTILOS PREDEFINIDOS */}
      {/* ======================== */}
      <Accordion
        expanded={expandedAccordion === 'presets'}
        onChange={handleAccordionChange('presets')}
      >
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Estilos Predefinidos
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1.5}>
            {PRESETS.map((preset) => (
              <Card
                key={preset.name}
                elevation={0}
                onClick={() => handleApplyPreset(preset.config)}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  backgroundColor: preset.color + '15',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      backgroundColor: preset.color,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {preset.name}
                  </Typography>
                  <Icon icon="mdi:chevron-right" width={20} style={{ color: preset.color }} />
                </Stack>
              </Card>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* ======================== */}
      {/* ACORDEÓN: LAYOUT */}
      {/* ======================== */}
      <Accordion
        expanded={expandedAccordion === 'layout'}
        onChange={handleAccordionChange('layout')}
      >
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Layout
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Selector visual de layout */}
          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={layout}
              exclusive
              onChange={(_, newLayout) => {
                if (newLayout) handleInputChange('layout', newLayout);
              }}
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="image-left">
                <Stack alignItems="center" spacing={0.5}>
                  <Icon icon="mdi:view-split-vertical" width={24} />
                  <Typography variant="caption">Izq</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="image-right">
                <Stack alignItems="center" spacing={0.5}>
                  <Icon
                    icon="mdi:view-split-vertical"
                    width={24}
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <Typography variant="caption">Der</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="image-top">
                <Stack alignItems="center" spacing={0.5}>
                  <Icon icon="mdi:view-split-horizontal" width={24} />
                  <Typography variant="caption">Arriba</Typography>
                </Stack>
              </ToggleButton>
              <ToggleButton value="image-bottom">
                <Stack alignItems="center" spacing={0.5}>
                  <Icon
                    icon="mdi:view-split-horizontal"
                    width={24}
                    style={{ transform: 'scaleY(-1)' }}
                  />
                  <Typography variant="caption">Abajo</Typography>
                </Stack>
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Ancho de imagen - Solo visible en layouts horizontales */}
            {(layout === 'image-left' || layout === 'image-right') && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
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
                />
              </Box>
            )}

            {/* Espaciado */}
            <Box>
              <Typography variant="body2" gutterBottom>
                Espaciado: {spacing}px
              </Typography>
              <Slider
                value={spacing}
                onChange={(_, value) => handleInputChange('spacing', value)}
                min={8}
                max={48}
                marks={[
                  { value: 8, label: '8' },
                  { value: 24, label: '24' },
                  { value: 48, label: '48' },
                ]}
              />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* ======================== */}
      {/* ACORDEÓN: TEXTO */}
      {/* ======================== */}
      <Accordion expanded={expandedAccordion === 'texto'} onChange={handleAccordionChange('texto')}>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Texto
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Tamaños de texto */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Tamaño del título: {titleSize}px
            </Typography>
            <Slider
              value={titleSize}
              onChange={(_, value) => handleInputChange('titleSize', value)}
              min={14}
              max={32}
              marks={[
                { value: 14, label: '14' },
                { value: 20, label: '20' },
                { value: 32, label: '32' },
              ]}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" gutterBottom>
              Tamaño del texto: {fontSize}px
            </Typography>
            <Slider
              value={fontSize}
              onChange={(_, value) => handleInputChange('fontSize', value)}
              min={12}
              max={20}
              marks={[
                { value: 12, label: '12' },
                { value: 14, label: '14' },
                { value: 20, label: '20' },
              ]}
            />
          </Box>

          {/* Colores de texto */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Color del título
            </Typography>
            <GeneralColorPicker
              selectedColor={titleColor}
              onChange={(color) => handleInputChange('titleColor', color)}
              label=""
              showLabel={false}
              size="medium"
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Color del texto
            </Typography>
            <GeneralColorPicker
              selectedColor={textColor}
              onChange={(color) => handleInputChange('textColor', color)}
              label=""
              showLabel={false}
              size="medium"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* ======================== */}
      {/* ACORDEÓN: DISEÑO GENERAL */}
      {/* ======================== */}
      <Accordion
        expanded={expandedAccordion === 'diseno'}
        onChange={handleAccordionChange('diseno')}
      >
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Diseño General
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Color de fondo del componente */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Color de fondo del componente
            </Typography>
            <GeneralColorPicker
              selectedColor={backgroundColor}
              onChange={(color) => handleInputChange('backgroundColor', color)}
              label=""
              showLabel={false}
              size="medium"
            />
          </Box>

          {/* Border radius */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Bordes redondeados: {borderRadius}px
            </Typography>
            <Slider
              value={borderRadius}
              onChange={(_, value) => handleInputChange('borderRadius', value)}
              min={0}
              max={24}
              marks={[
                { value: 0, label: '0' },
                { value: 8, label: '8' },
                { value: 24, label: '24' },
              ]}
            />
          </Box>

          {/* Padding */}
          <Box>
            <Typography variant="body2" gutterBottom>
              Espaciado interno: {padding}px
            </Typography>
            <Slider
              value={padding}
              onChange={(_, value) => handleInputChange('padding', value)}
              min={8}
              max={32}
              marks={[
                { value: 8, label: '8' },
                { value: 16, label: '16' },
                { value: 32, label: '32' },
              ]}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Input oculto para archivos */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleImageFileChange}
      />

      {/* Modal de selección de fuente de imagen */}
      <ImageSourceModal
        open={showSourceModal}
        onClose={() => setShowSourceModal(false)}
        onSelectFromPC={handleSelectFromPC}
        onGenerateWithAI={handleGenerateWithAI}
      />

      {/* Dialog de crop de imagen */}
      <ImageCropDialog
        open={showCropDialog}
        onClose={() => setShowCropDialog(false)}
        onSave={handleSaveCroppedImage}
        initialImage={tempImage}
        currentAspectRatio={undefined}
        initialTab={cropDialogInitialTab}
        userId={user?.id}
        plan={user?.plan?.name}
      />

      {/* Modal de error */}
      <Dialog
        open={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon icon="mdi:alert-circle" width={28} color="error" />
            <Typography variant="h6">Error al subir la imagen</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            La imagen generada es demasiado pesada para ser subida. Por favor, intenta lo siguiente:
          </Typography>
          <Box component="ul" sx={{ mt: 2, pl: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Genera una imagen con dimensiones más pequeñas
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Usa una imagen diferente
            </Typography>
            <Typography component="li" variant="body2">
              Si es una imagen local, comprime la imagen antes de subirla
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowErrorDialog(false)} variant="contained" color="primary">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageTextOptions;
