import type { EmailComponent } from 'src/types/saved-note';

import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import {
  Box,
  Tab,
  Card,
  Chip,
  Tabs,
  Alert,
  Stack,
  Slider,
  Button,
  Tooltip,
  Accordion,
  TextField,
  IconButton,
  Typography,
  ToggleButton,
  LinearProgress,
  AccordionDetails,
  AccordionSummary,
  ToggleButtonGroup,
} from '@mui/material';

import useAuthStore from 'src/store/AuthStore';

import GeneralColorPicker from 'src/components/newsletter-note/general-color-picker';

import ImageCropDialog from './ImageCropDialog';
import ImageSourceModal from './ImageSourceModal';
import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';
import { convertImageToOptimalFormat } from './imgPreview';

interface ColumnData {
  imageUrl: string;
  imageAlt: string;
  titleContent: string;
  content: string;
}

interface MultiColumnsOptionsProps {
  component: EmailComponent;
  updateComponentProps: (componentId: string, props: Record<string, any>) => void;
  selectedColumn?: string;
}

const defaultColumn: ColumnData = {
  imageUrl: '',
  imageAlt: 'Imagen',
  titleContent: '<p>Título</p>',
  content: '<p>Escribe el contenido aquí...</p>',
};

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

// Función de migración
const migrateOldFormat = (props: any): any => {
  if (props?.columns && Array.isArray(props.columns)) {
    return props;
  }

  const leftColumn = props?.leftColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Escribe el contenido aquí...',
  };

  const rightColumn = props?.rightColumn || {
    imageUrl: '',
    imageAlt: 'Imagen',
    title: 'Título',
    description: 'Escribe el contenido aquí...',
  };

  return {
    ...props,
    numberOfColumns: 2,
    layout: 'image-top',
    columns: [
      {
        imageUrl: leftColumn.imageUrl || '',
        imageAlt: leftColumn.imageAlt || 'Imagen',
        titleContent: leftColumn.title ? `<p>${leftColumn.title}</p>` : '<p>Título</p>',
        content: leftColumn.description
          ? `<p>${leftColumn.description}</p>`
          : '<p>Escribe el contenido aquí...</p>',
      },
      {
        imageUrl: rightColumn.imageUrl || '',
        imageAlt: rightColumn.imageAlt || 'Imagen',
        titleContent: rightColumn.title ? `<p>${rightColumn.title}</p>` : '<p>Título</p>',
        content: rightColumn.description
          ? `<p>${rightColumn.description}</p>`
          : '<p>Escribe el contenido aquí...</p>',
      },
    ],
  };
};

const MultiColumnsOptions = ({
  component,
  updateComponentProps,
  selectedColumn,
}: MultiColumnsOptionsProps) => {
  // Obtener usuario autenticado
  const user = useAuthStore((state) => state.user);

  // Migrar props si es necesario
  const migratedProps = migrateOldFormat(component.props);

  // Referencias para input de archivos
  const imageFileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null]);

  // Estados para imagen
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [tempImage, setTempImage] = useState<string>('');
  const [cropDialogInitialTab, setCropDialogInitialTab] = useState<'edit' | 'ai'>('edit');

  // Estados para upload y errores
  const [isAutoUploading, setIsAutoUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');

  // Estado para el tab activo (columna seleccionada)
  const [activeColumnTab, setActiveColumnTab] = useState(0);

  // Estados para acordeones
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>('imagen');

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // Props globales
  const numberOfColumns = migratedProps?.numberOfColumns || 2;
  const layout = migratedProps?.layout || 'image-top';
  const spacing = migratedProps?.spacing || 16;
  const borderRadius = migratedProps?.borderRadius || 8;
  const backgroundColor = migratedProps?.backgroundColor || '#ffffff';
  const textColor = migratedProps?.textColor || '#333333';
  const titleColor = migratedProps?.titleColor || '#000000';
  const fontSize = migratedProps?.fontSize || 14;
  const titleSize = migratedProps?.titleSize || 18;
  const padding = migratedProps?.padding || 16;
  const imageWidth = migratedProps?.imageWidth || 40;
  // const imageHeight = migratedProps?.imageHeight || 'auto';
  // const imageObjectFit = migratedProps?.imageObjectFit || 'contain';
  // const imageBackgroundColor = migratedProps?.imageBackgroundColor || 'transparent';
  // const imageContainerBackgroundColor = migratedProps?.imageContainerBackgroundColor || '';

  // Columnas individuales
  const columns: ColumnData[] = migratedProps?.columns || [defaultColumn, defaultColumn];

  // Asegurar que siempre haya el número correcto de columnas
  const ensuredColumns = [...columns];
  while (ensuredColumns.length < numberOfColumns) {
    ensuredColumns.push({ ...defaultColumn });
  }

  const currentColumn = ensuredColumns[activeColumnTab] || defaultColumn;
  const isHorizontal = layout === 'image-left' || layout === 'image-right';

  // Función para cambiar el número de columnas
  const handleNumberOfColumnsChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: 2 | 3 | null
  ) => {
    if (newValue === null) return;

    const updatedColumns = [...ensuredColumns];

    if (newValue === 3 && updatedColumns.length === 2) {
      updatedColumns.push({ ...defaultColumn });
    } else if (newValue === 2 && updatedColumns.length === 3) {
      updatedColumns.pop();
    }

    const updates: any = {
      numberOfColumns: newValue,
      columns: updatedColumns,
    };

    // Si cambia a 3 columnas, forzar restricciones
    if (newValue === 3) {
      // Solo permitir layouts verticales
      if (layout !== 'image-top' && layout !== 'image-bottom') {
        updates.layout = 'image-top';
      }
      // Limitar spacing a máximo 8px
      if (spacing > 8) {
        updates.spacing = 8;
      }
      // Limitar padding a máximo 8px
      if (padding > 8) {
        updates.padding = 8;
      }
    }

    updateComponentProps(component.id, updates);
  };

  // Función para manejar selección desde PC
  const handleSelectFromPC = () => {
    setShowSourceModal(false);
    setCropDialogInitialTab('edit');
    imageFileInputRefs.current[activeColumnTab]?.click();
  };

  // Función para manejar generación con IA
  const handleGenerateWithAI = () => {
    setShowSourceModal(false);
    setCropDialogInitialTab('ai');
    setTempImage('');
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
      const sizeInBytes = Math.ceil((base64Image.length * 3) / 4);
      const sizeInMB = sizeInBytes / (1024 * 1024);

      if (sizeInMB > 1) {
        setUploadMessage('Optimizando imagen...');
        try {
          const response = await fetch(base64Image);
          const blob = await response.blob();
          const file = new File([blob], 'image.png', { type: blob.type });
          const optimizedBase64 = await convertImageToOptimalFormat(file, 0.85);
          base64Image = optimizedBase64;
        } catch (conversionError) {
          console.error('Error al optimizar:', conversionError);
          throw new Error(
            'No se pudo optimizar la imagen. Por favor, intenta con una imagen más pequeña.'
          );
        }
      }

      setUploadMessage('Subiendo a S3...');
      const s3Url = await uploadImageToS3(
        base64Image,
        `multicolumn_${activeColumnTab}_${Date.now()}`
      );
      setUploadMessage('✅ Imagen subida correctamente');

      setTimeout(() => {
        setUploadMessage('');
      }, 3000);

      return s3Url;
    } catch (error) {
      console.error('Error en auto-upload:', error);
      setUploadMessage('');
      throw error;
    } finally {
      setIsAutoUploading(false);
    }
  };

  // Función para guardar imagen después del crop
  const handleSaveCroppedImage = async (croppedBase64: string) => {
    setShowCropDialog(false);

    const updatedColumns = [...ensuredColumns];
    updatedColumns[activeColumnTab] = {
      ...updatedColumns[activeColumnTab],
      imageUrl: croppedBase64,
    };
    updateComponentProps(component.id, { columns: updatedColumns });

    try {
      const s3Url = await autoUploadToS3(croppedBase64);
      const finalUpdatedColumns = [...updatedColumns];
      finalUpdatedColumns[activeColumnTab] = {
        ...finalUpdatedColumns[activeColumnTab],
        imageUrl: s3Url,
      };
      updateComponentProps(component.id, { columns: finalUpdatedColumns });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
    }
  };

  // Función para abrir el modal de selección
  const handleSelectImage = () => {
    setShowSourceModal(true);
  };

  // Handler para eliminar imagen
  const handleResetImage = () => {
    const updatedColumns = [...ensuredColumns];
    updatedColumns[activeColumnTab] = { ...updatedColumns[activeColumnTab], imageUrl: '' };
    updateComponentProps(component.id, { columns: updatedColumns });
  };

  const handleColumnChange = (columnIndex: number, field: keyof ColumnData, value: any) => {
    const updatedColumns = [...ensuredColumns];
    updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], [field]: value };
    updateComponentProps(component.id, { columns: updatedColumns });
  };

  const handleGlobalChange = (field: string, value: any) => {
    updateComponentProps(component.id, { [field]: value });
  };

  // Handler para aplicar un preset completo
  const handleApplyPreset = (preset: Record<string, any>) => {
    updateComponentProps(component.id, preset);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    };

  const needsUpload = isBase64Image(currentColumn.imageUrl);
  const isProcessing = uploading || isAutoUploading;

  return (
    <Box>
      {/* Progress bar para operaciones */}
      {isProcessing && (
        <Box sx={{ mb: 2, p: 2 }}>
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
          sx={{ mb: 2, mx: 2, fontSize: '0.875rem' }}
        >
          {uploadMessage}
        </Alert>
      )}

      {/* Selector de número de columnas - FUERA DE ACORDEONES */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Número de Columnas
        </Typography>
        <ToggleButtonGroup
          value={numberOfColumns}
          exclusive
          size="small"
          onChange={handleNumberOfColumnsChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Icon icon="mdi:numeric-2-box" width={24} />
            </Stack>
          </ToggleButton>
          <ToggleButton value={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Icon icon="mdi:numeric-3-box" width={24} />
            </Stack>
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Selector de columna para editar - CON ICONOS */}
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Editar Columna
        </Typography>
        <Tabs
          value={activeColumnTab}
          onChange={(_, newValue) => setActiveColumnTab(newValue)}
          variant="fullWidth"
          sx={{ mb: 0 }}
        >
          {ensuredColumns.slice(0, numberOfColumns).map((_, idx) => (
            <Tab
              key={idx}
              icon={<Icon icon="mdi:image-area" width={20} />}
              label={`Col ${idx + 1}`}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

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
          {currentColumn.imageUrl && (
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
                src={currentColumn.imageUrl}
                alt={currentColumn.imageAlt}
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

                {/* Botón Eliminar */}
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
          {!currentColumn.imageUrl && (
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
            value={currentColumn.imageAlt}
            onChange={(e) => handleColumnChange(activeColumnTab, 'imageAlt', e.target.value)}
            disabled={isProcessing}
            sx={{ mb: 3 }}
          />

          {/* URL manual */}
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            URL de imagen (manual)
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={currentColumn.imageUrl}
            onChange={(e) => handleColumnChange(activeColumnTab, 'imageUrl', e.target.value)}
            disabled={isProcessing}
            helperText="Puedes pegar una URL directamente"
            sx={{ mb: 3 }}
          />
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
                if (newLayout) handleGlobalChange('layout', newLayout);
              }}
              fullWidth
              sx={{ mb: 2 }}
            >
              {/* Solo mostrar layouts verticales si hay 3 columnas */}
              {numberOfColumns === 2 && (
                <>
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
                </>
              )}
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
            {isHorizontal && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Ancho de imagen: {imageWidth}%
                </Typography>
                <Slider
                  value={imageWidth}
                  onChange={(_, value) => handleGlobalChange('imageWidth', value)}
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
                Espaciado: {spacing}px {numberOfColumns === 3 && '(máx 8px)'}
              </Typography>
              <Slider
                value={spacing}
                onChange={(_, value) => handleGlobalChange('spacing', value)}
                min={8}
                max={numberOfColumns === 3 ? 8 : 48}
                marks={
                  numberOfColumns === 3
                    ? [{ value: 8, label: '8' }]
                    : [
                        { value: 8, label: '8' },
                        { value: 24, label: '24' },
                        { value: 48, label: '48' },
                      ]
                }
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
              onChange={(_, value) => handleGlobalChange('titleSize', value)}
              min={14}
              max={32}
              marks={[
                { value: 14, label: '14' },
                { value: 18, label: '18' },
                { value: 32, label: '32' },
              ]}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" gutterBottom>
              Tamaño del texto: {fontSize}px
            </Typography>
            <Slider
              value={fontSize}
              onChange={(_, value) => handleGlobalChange('fontSize', value)}
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
              onChange={(color) => handleGlobalChange('titleColor', color)}
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
              onChange={(color) => handleGlobalChange('textColor', color)}
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
              onChange={(color) => handleGlobalChange('backgroundColor', color)}
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
              onChange={(_, value) => handleGlobalChange('borderRadius', value)}
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
              Espaciado interno: {padding}px {numberOfColumns === 3 && '(máx 8px)'}
            </Typography>
            <Slider
              value={padding}
              onChange={(_, value) => handleGlobalChange('padding', value)}
              min={8}
              max={numberOfColumns === 3 ? 8 : 32}
              marks={
                numberOfColumns === 3
                  ? [{ value: 8, label: '8' }]
                  : [
                      { value: 8, label: '8' },
                      { value: 16, label: '16' },
                      { value: 32, label: '32' },
                    ]
              }
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Inputs ocultos para archivos */}
      {ensuredColumns.slice(0, numberOfColumns).map((_, idx) => (
        <input
          key={idx}
          type="file"
          ref={(el) => {
            imageFileInputRefs.current[idx] = el;
          }}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleImageFileChange}
        />
      ))}

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
    </Box>
  );
};

export default MultiColumnsOptions;
