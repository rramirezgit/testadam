'use client';

import type { PostStatus } from 'src/types/post';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  Alert,
  AppBar,
  Button,
  Dialog,
  Select,
  Switch,
  Toolbar,
  MenuItem,
  Snackbar,
  Checkbox,
  Accordion,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  DialogTitle,
  ToggleButton,
  DialogActions,
  DialogContent,
  LinearProgress,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  DialogContentText,
  ToggleButtonGroup,
} from '@mui/material';

import usePostStore from 'src/store/PostStore';

import { UploadCover } from 'src/components/upload';

import { POST_STATUS, isStatusDisabled } from 'src/types/post';

import TextOptions from './right-panel/TextOptions';
import ImageOptions from './right-panel/ImageOptions';
import ButtonOptions from './right-panel/ButtonOptions';
import { isBase64Image } from './utils/imageValidation';
import { useNoteMetadata } from './hooks/useNoteMetadata';
import DividerOptions from './right-panel/DividerOptions';
import GalleryOptions from './right-panel/GalleryOptions';
import SummaryOptions from './right-panel/SummaryOptions';
import CategoryOptions from './right-panel/CategoryOptions';
import { findComponentById } from './utils/componentHelpers';
import ContainerOptions from './right-panel/ContainerOptions';
import ImageTextOptions from './right-panel/ImageTextOptions';
import { useImageUpload } from './right-panel/useImageUpload';
import TwoColumnsOptions from './right-panel/TwoColumnsOptions';
// Importaciones de hooks y utilidades
import ChartOptions from './email-components/options/ChartOptions';
import HerramientasOptions from './right-panel/HerramientasOptions';
import TextWithIconOptions from './right-panel/TextWithIconOptions';
import NoteContainerOptions from './right-panel/NoteContainerOptions';
import RespaldadoPorOptions from './right-panel/RespaldadoPorOptions';
import TituloConIconoOptions from './right-panel/TituloConIconoOptions';
import NewsletterFooterOptions from './right-panel/NewsletterFooterOptions';
import NewsletterFooterReusableOptions from './right-panel/NewsletterFooterReusableOptions';
import NewsletterHeaderReusableOptions from './right-panel/NewsletterHeaderReusableOptions';

import type { RightPanelProps } from './right-panel/types';

// Definición de temas predefinidos para newsletter
const NEWSLETTER_THEMES = [
  {
    id: 'default',
    name: 'Default Adac',
    gradientColors: ['#FFF9CE', '#E2E5FA'],
    gradientDirection: 135,
    textColor: '#1e293b', // Texto oscuro para fondos claros
  },
  {
    id: 'warm',
    name: 'Calidez Sutil',
    gradientColors: ['#fef7ed', '#fed7aa'],
    gradientDirection: 135,
    textColor: '#7c2d12', // Texto marrón oscuro
  },
  {
    id: 'ocean',
    name: 'Brisa Marina',
    gradientColors: ['#f0f9ff', '#bae6fd'],
    gradientDirection: 135,
    textColor: '#0c4a6e', // Texto azul oscuro
  },
  {
    id: 'forest',
    name: 'Verde Sereno',
    gradientColors: ['#f0fdf4', '#bbf7d0'],
    gradientDirection: 135,
    textColor: '#14532d', // Texto verde oscuro
  },
  {
    id: 'lavender',
    name: 'Lavanda Suave',
    gradientColors: ['#faf5ff', '#e9d5ff'],
    gradientDirection: 135,
    textColor: '#581c87', // Texto púrpura oscuro
  },
  {
    id: 'rose',
    name: 'Rosa Delicado',
    gradientColors: ['#fff1f2', '#fecdd3'],
    gradientDirection: 135,
    textColor: '#881337', // Texto rosa oscuro
  },
  {
    id: 'golden',
    name: 'Dorado Refinado',
    gradientColors: ['#fffbeb', '#fde68a'],
    gradientDirection: 135,
    textColor: '#92400e', // Texto ámbar oscuro
  },
  {
    id: 'slate',
    name: 'Gris Sofisticado',
    gradientColors: ['#f8fafc', '#cbd5e1'],
    gradientDirection: 135,
    textColor: '#0f172a', // Texto muy oscuro
  },
];

// ¡Todos los componentes han sido implementados!

export default function RightPanel({
  selectedComponentId,
  setSelectedComponentId,
  rightPanelTab,
  setRightPanelTab,
  getActiveComponents,
  updateComponentProps,
  updateComponentStyle,
  updateComponentContent,
  selectedColor,
  setSelectedColor,
  selectedFont,
  setSelectedFont,
  selectedFontSize,
  setSelectedFontSize,
  selectedFontWeight,
  setSelectedFontWeight,
  selectedAlignment,
  textFormat,
  applyTextFormat,
  applyTextAlignment,
  applyTextColor,
  applyFontSize,
  applyFontFamily,
  emailBackground,
  setEmailBackground,
  selectedBanner,
  setSelectedBanner,
  showGradient,
  setShowGradient,
  gradientColors,
  setGradientColors,
  bannerOptions,
  setSelectedAlignment,
  hasTextSelection,
  listStyle,
  updateListStyle,
  listColor,
  updateListColor,
  convertTextToList,
  setShowIconPicker,
  isContainerSelected,
  setIsContainerSelected,
  containerBorderWidth,
  setContainerBorderWidth,
  containerBorderColor,
  setContainerBorderColor,
  containerBorderRadius,
  setContainerBorderRadius,
  containerPadding,
  setContainerPadding,
  containerMaxWidth,
  setContainerMaxWidth,
  activeTemplate,
  activeVersion,
  currentNoteId,
  noteTitle,
  setNoteTitle,
  noteDescription,
  setNoteDescription,
  noteCoverImageUrl,
  setNoteCoverImageUrl,
  noteStatus,
  setNoteStatus,
  updateStatus,
  contentTypeId,
  setContentTypeId,
  audienceId,
  setAudienceId,
  categoryId,
  setCategoryId,
  subcategoryId,
  setSubcategoryId,
  selectedColumn,
  injectComponentsToNewsletter,
  showValidationErrors = false,
  highlight,
  setHighlight,
  // Props para newsletter
  isNewsletterMode = false,
  newsletterTitle = '',
  onNewsletterTitleChange = () => {},
  newsletterDescription = '',
  onNewsletterDescriptionChange = () => {},
  newsletterHeader,
  newsletterFooter,
  onHeaderChange = () => {},
  onFooterChange = () => {},
  onNewsletterConfigChange,
}: RightPanelProps) {
  // Estados locales para input inmediato (sin lag)
  const [localTitle, setLocalTitle] = useState(noteTitle);
  const [localDescription, setLocalDescription] = useState(noteDescription);

  // Estados locales para newsletter (debouncing)
  const [localNewsletterTitle, setLocalNewsletterTitle] = useState(newsletterTitle);
  const [localNewsletterDescription, setLocalNewsletterDescription] =
    useState(newsletterDescription);

  // Estado para los tabs del contenedor
  const [containerTab, setContainerTab] = useState(0);

  // Estado para el diálogo de confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // Hook para metadata de la nota
  const {
    contentTypes,
    audiences,
    categories,
    loading: loadingMetadata,
    loadCategories,
  } = useNoteMetadata();

  // Sincronizar estados locales cuando cambien las props externas
  useEffect(() => {
    setLocalTitle(noteTitle);
  }, [noteTitle]);

  useEffect(() => {
    setLocalDescription(noteDescription);
  }, [noteDescription]);

  useEffect(() => {
    setLocalNewsletterTitle(newsletterTitle);
  }, [newsletterTitle]);

  useEffect(() => {
    setLocalNewsletterDescription(newsletterDescription);
  }, [newsletterDescription]);

  // Debouncing para título - actualizar estado global después de 300ms sin cambios
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localTitle !== noteTitle) {
        setNoteTitle(localTitle);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTitle]);

  // Debouncing para descripción - actualizar estado global después de 300ms sin cambios
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localDescription !== noteDescription) {
        setNoteDescription(localDescription);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDescription]);

  // Debouncing para título de newsletter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localNewsletterTitle !== newsletterTitle) {
        onNewsletterTitleChange(localNewsletterTitle);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localNewsletterTitle]);

  // Debouncing para descripción de newsletter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localNewsletterDescription !== newsletterDescription) {
        onNewsletterDescriptionChange(localNewsletterDescription);
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localNewsletterDescription]);

  // Cargar categorías cuando cambie el content type
  useEffect(() => {
    if (contentTypeId) {
      console.log('🔄 Content type cambió, cargando categorías para:', contentTypeId);
      loadCategories(contentTypeId);

      // Solo resetear categoría y subcategoría si NO hay una nota cargada
      // Si hay currentNoteId, significa que estamos cargando una nota existente
      // y las categorías se setearán desde main.tsx después de cargar
      if (!currentNoteId) {
        console.log('🧹 Reseteando categorías (nota nueva)');
        setCategoryId('');
        setSubcategoryId('');
      } else {
        console.log('📌 Manteniendo categorías (nota existente, se cargarán después)');
      }
    } else {
      // Si no hay content type, limpiar categorías
      console.log('🧹 Content type vacío, limpiando categorías');
      setCategoryId('');
      setSubcategoryId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentTypeId]); // Solo depender de contentTypeId

  // Resetear subcategoría cuando cambie la categoría (solo para notas nuevas)
  useEffect(() => {
    if (categoryId) {
      console.log('🔄 Categoría cambió a:', categoryId);

      // Solo resetear subcategoría si NO hay una nota cargada
      // Si hay currentNoteId, la subcategoría se cargará desde main.tsx
      if (!currentNoteId) {
        console.log('🧹 Reseteando subcategoría (nota nueva)');
        setSubcategoryId('');
      } else {
        console.log('📌 Manteniendo subcategoría (nota existente, se cargará después)');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]); // Solo depender de categoryId

  // Obtener subcategorías de la categoría seleccionada
  const selectedCategory = categories.find((cat) => cat.id === categoryId);
  const subcategories = selectedCategory?.subcategories || [];

  // PostStore para cargar notas
  const { delete: deletePost } = usePostStore();

  // Estado para notificaciones
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Función para mostrar notificaciones
  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Función para cerrar notificaciones
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Función para determinar si un status está deshabilitado (usando la función centralizada)
  const checkStatusDisabled = (targetStatus: string): boolean =>
    isStatusDisabled(noteStatus as PostStatus, targetStatus as PostStatus, !!currentNoteId);

  // Función para manejar cambio de status
  const handleStatusChange = async (newStatus: string) => {
    if (!currentNoteId) {
      console.warn('No se puede cambiar el estado de una nota no guardada');
      return;
    }

    try {
      await updateStatus(newStatus as PostStatus);
      // No necesitamos llamar setNoteStatus aquí porque updateStatus ya lo hace internamente
    } catch (error) {
      console.error('Error al actualizar el status:', error);
      // Mantener el status actual en caso de error
    }
  };

  // Función para eliminar la nota
  const handleDeleteNote = async () => {
    if (!currentNoteId) {
      showNotification('No hay nota para eliminar', 'error');
      return;
    }

    try {
      const success = await deletePost(currentNoteId);
      if (success) {
        showNotification('Nota eliminada correctamente', 'success');
        setOpenDeleteDialog(false);

        // Recargar la página después de un breve delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification('Error al eliminar la nota', 'error');
      }
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      showNotification('Error al eliminar la nota', 'error');
    }
  };

  // ======================
  // NEWSLETTER FUNCTIONS
  // ======================

  // Función para manejar selección de archivo de logo
  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && newsletterHeader) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onHeaderChange({ ...newsletterHeader, logo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar selección de archivo de sponsor
  const handleSponsorFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && newsletterHeader?.sponsor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onHeaderChange({
          ...newsletterHeader,
          sponsor: {
            ...newsletterHeader.sponsor,
            image: base64,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir logo a S3
  const handleUploadLogoToS3 = async () => {
    if (!newsletterHeader?.logo || !isBase64Image(newsletterHeader.logo)) {
      alert('No hay imagen de logo para subir o ya está subida');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(newsletterHeader.logo, `newsletter_logo_${Date.now()}`);
      onHeaderChange({ ...newsletterHeader, logo: s3Url });
    } catch (error) {
      alert('Error al subir la imagen del logo a S3');
      console.error(error);
    }
  };

  // Función para subir imagen de sponsor a S3
  const handleUploadSponsorToS3 = async () => {
    if (!newsletterHeader?.sponsor?.image || !isBase64Image(newsletterHeader.sponsor.image)) {
      alert('No hay imagen de sponsor para subir o ya está subida');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(
        newsletterHeader.sponsor.image,
        `newsletter_sponsor_${Date.now()}`
      );
      onHeaderChange({
        ...newsletterHeader,
        sponsor: {
          ...newsletterHeader.sponsor,
          image: s3Url,
        },
      });
    } catch (error) {
      alert('Error al subir la imagen del sponsor a S3');
      console.error(error);
    }
  };

  // Obtener todos los componentes activos
  const allComponents = getActiveComponents();

  // Debug de componentes activos si hay un componente seleccionado
  if (process.env.NODE_ENV === 'development' && selectedComponentId) {
    console.log('🎯 RightPanel - All Components Debug:', {
      totalComponents: allComponents.length,
      componentTypes: allComponents.map((c) => ({ id: c.id, type: c.type })),
      selectedComponentId,
      isInjected: selectedComponentId ? selectedComponentId.includes('-injected-') : false,
    });
  }

  // ⚡ DEBUG: Log de selección mejorado
  console.log('🎯 RightPanel selectedComponentId:', selectedComponentId);
  console.log(
    '🎯 RightPanel isInjectedComponent:',
    selectedComponentId ? selectedComponentId.includes('-injected-') : false
  );

  // Nueva función para manejar componentes inyectados específicamente
  const handleInjectedComponentSelection = (componentId: string) => {
    console.log('🔧 Handling injected component selection:', componentId);

    // Verificar si es un componente inyectado
    const isInjected = componentId.includes('-injected-');

    if (isInjected) {
      console.log('📋 Componente inyectado detectado:', {
        componentId,
        baseId: componentId.split('-injected-')[0],
        timestamp: componentId.split('-injected-')[1]?.split('-')[0],
        index: componentId.split('-injected-')[1]?.split('-')[1],
      });
    }
    // Buscar el componente en toda la estructura
    const foundComponent = findComponentById(allComponents, componentId);

    if (foundComponent) {
      console.log('✅ Componente encontrado:', {
        id: foundComponent.id,
        type: foundComponent.type,
        isInjected,
      });
    } else {
      console.log('❌ Componente NO encontrado:', componentId);

      // Debug adicional para componentes inyectados
      if (isInjected) {
        const noteContainers = allComponents.filter((c) => c.type === 'noteContainer');
        console.log(
          '🔍 Buscando en contenedores de nota:',
          noteContainers.map((c) => ({
            id: c.id,
            containedComponents: c.props?.componentsData?.length || 0,
            componentIds: c.props?.componentsData?.map((comp: any) => comp.id) || [],
          }))
        );
      }
    }

    return foundComponent;
  };

  // Usar la nueva función para obtener el componente seleccionado
  const selectedComponent = selectedComponentId
    ? handleInjectedComponentSelection(selectedComponentId)
    : null;

  const componentType = selectedComponent?.type;

  // Debug para newsletter header/footer
  console.log('🔍 RightPanel Debug:', {
    selectedComponentId,
    isNewsletterMode,
    hasNewsletterHeader: !!newsletterHeader,
    hasNewsletterFooter: !!newsletterFooter,
  });

  // ======================
  // NEWSLETTER HEADER EDIT
  // ======================
  if (selectedComponentId === 'newsletter-header' && isNewsletterMode && newsletterHeader) {
    console.log('✅ Renderizando opciones del HEADER');

    return (
      <Box
        sx={(theme) => ({
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          background: 'transparent',
          borderRadius: 2,
          '&::before': {
            ...theme.mixins.borderGradient({
              padding: '2px',
              color: `linear-gradient(to bottom left, #FFFFFF, #C6C6FF61)`,
            }),
            pointerEvents: 'none',
          },
        })}
      >
        <AppBar position="static" color="default" elevation={0} sx={{ flexShrink: 0 }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setSelectedComponentId(null)}>
              <Icon icon="mdi:arrow-left" />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
              Configuración del Header
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, height: 0, p: 2 }}>
          {/* Datos básicos del header */}
          <Accordion defaultExpanded disableGutters sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>Datos</AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Título del Header"
                value={newsletterHeader.title}
                onChange={(e) => onHeaderChange({ ...newsletterHeader, title: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Subtítulo"
                value={newsletterHeader.subtitle}
                onChange={(e) => onHeaderChange({ ...newsletterHeader, subtitle: e.target.value })}
              />
            </AccordionDetails>
          </Accordion>

          {/* Logo */}
          <Accordion disableGutters sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>Logo</AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={newsletterHeader.showLogo}
                    onChange={(e) => {
                      const newShowLogo = e.target.checked;
                      const defaultLogo =
                        'https://s3.amazonaws.com/s3.condoor.ai/adam/d5a5c0e8d1.png';
                      onHeaderChange({
                        ...newsletterHeader,
                        showLogo: newShowLogo,
                        logo:
                          newShowLogo && !newsletterHeader.logo
                            ? defaultLogo
                            : newsletterHeader.logo,
                      });
                    }}
                    color="primary"
                  />
                }
                label="Mostrar Logo"
              />

              {newsletterHeader.showLogo && (
                <>
                  {/* Vista previa del logo */}
                  {newsletterHeader.logo && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Vista previa:
                      </Typography>
                      <Box
                        sx={{ position: 'relative', display: 'inline-block', maxWidth: '200px' }}
                      >
                        <img
                          src={newsletterHeader.logo}
                          alt="Logo preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '80px',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0',
                          }}
                        />
                        {isBase64Image(newsletterHeader.logo) && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(255, 152, 0, 0.9)',
                              color: 'white',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Icon icon="mdi:cloud-upload-outline" fontSize="12px" />
                            Subir a S3
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Alertas de estado */}
                  {/* {newsletterHeader.logo && isBase64Image(newsletterHeader.logo) && (
                    <Alert severity="warning" sx={{ mb: 2, fontSize: '0.875rem' }}>
                      ⚠️ Esta imagen debe subirse a S3 antes de guardar
                    </Alert>
                  )} */}

                  {/* {newsletterHeader.logo && !isBase64Image(newsletterHeader.logo) && (
                    <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>
                      ✅ Imagen guardada correctamente
                    </Alert>
                  )} */}

                  {/* Botón para seleccionar imagen */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Icon icon="mdi:image-plus" />}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif';
                      input.onchange = (e) => handleLogoFileChange(e as any);
                      input.click();
                    }}
                    sx={{ mb: 2 }}
                  >
                    {newsletterHeader.logo ? 'Cambiar Logo' : 'Seleccionar Logo'}
                  </Button>

                  {/* Campo URL manual */}
                  <TextField
                    fullWidth
                    label="URL del Logo (opcional)"
                    value={newsletterHeader.logo || ''}
                    onChange={(e) => onHeaderChange({ ...newsletterHeader, logo: e.target.value })}
                    placeholder="https://ejemplo.com/logo.png"
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  {/* Altura del logo */}
                  <TextField
                    fullWidth
                    type="number"
                    label="Altura del Logo (px)"
                    value={newsletterHeader.logoHeight || 40}
                    onChange={(e) =>
                      onHeaderChange({
                        ...newsletterHeader,
                        logoHeight: parseInt(e.target.value) || 40,
                      })
                    }
                    inputProps={{ min: 20, max: 200 }}
                    size="small"
                  />

                  {/* Botón de subida a S3 */}
                  {newsletterHeader.logo && isBase64Image(newsletterHeader.logo) && (
                    <>
                      {uploading && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Subiendo: {uploadProgress}%
                          </Typography>
                          <LinearProgress variant="determinate" value={uploadProgress} />
                        </Box>
                      )}
                      <LoadingButton
                        variant="contained"
                        color="warning"
                        fullWidth
                        startIcon={<Icon icon="mdi:cloud-upload" />}
                        onClick={handleUploadLogoToS3}
                        loading={uploading}
                        sx={{ mb: 2 }}
                      >
                        ⚠️ Subir Logo a S3 (Requerido)
                      </LoadingButton>
                    </>
                  )}
                </>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Sponsor */}
          <Accordion disableGutters>
            <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
              Sponsor
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={newsletterHeader.sponsor?.enabled || false}
                    onChange={(e) =>
                      onHeaderChange({
                        ...newsletterHeader,
                        sponsor: { ...newsletterHeader.sponsor, enabled: e.target.checked },
                      })
                    }
                    color="primary"
                  />
                }
                label="Mostrar Sponsor"
              />
              {newsletterHeader.sponsor?.enabled && (
                <>
                  <TextField
                    fullWidth
                    label="Texto del Sponsor"
                    value={newsletterHeader.sponsor?.label || ''}
                    onChange={(e) =>
                      onHeaderChange({
                        ...newsletterHeader,
                        sponsor: { ...newsletterHeader.sponsor, label: e.target.value },
                      })
                    }
                    sx={{ mb: 2, mt: 2 }}
                  />

                  {/* Vista previa de la imagen del sponsor */}
                  {newsletterHeader.sponsor?.image && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Vista previa:
                      </Typography>
                      <Box
                        sx={{ position: 'relative', display: 'inline-block', maxWidth: '200px' }}
                      >
                        <img
                          src={newsletterHeader.sponsor.image}
                          alt="Sponsor preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '60px',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0',
                          }}
                        />
                        {isBase64Image(newsletterHeader.sponsor.image) && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(255, 152, 0, 0.9)',
                              color: 'white',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                            }}
                          >
                            <Icon icon="mdi:cloud-upload-outline" fontSize="12px" />
                            Subir a S3
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Alertas de estado */}
                  {/* {newsletterHeader.sponsor?.image &&
                    isBase64Image(newsletterHeader.sponsor.image) && (
                      <Alert severity="warning" sx={{ mb: 2, fontSize: '0.875rem' }}>
                        ⚠️ Esta imagen debe subirse a S3 antes de guardar
                      </Alert>
                    )} */}

                  {/* {newsletterHeader.sponsor?.image &&
                    !isBase64Image(newsletterHeader.sponsor.image) && (
                      <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>
                        ✅ Imagen guardada correctamente
                      </Alert>
                    )} */}

                  {/* Botón para seleccionar imagen */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Icon icon="mdi:image-plus" />}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif';
                      input.onchange = (e) => handleSponsorFileChange(e as any);
                      input.click();
                    }}
                    sx={{ mb: 2 }}
                  >
                    {newsletterHeader.sponsor?.image
                      ? 'Cambiar Imagen Sponsor'
                      : 'Seleccionar Imagen Sponsor'}
                  </Button>

                  {/* Campo URL manual */}
                  <TextField
                    fullWidth
                    label="URL de la imagen (opcional)"
                    value={newsletterHeader.sponsor?.image || ''}
                    onChange={(e) =>
                      onHeaderChange({
                        ...newsletterHeader,
                        sponsor: { ...newsletterHeader.sponsor, image: e.target.value },
                      })
                    }
                    placeholder="https://ejemplo.com/sponsor.png"
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Alt de la imagen"
                    value={newsletterHeader.sponsor?.imageAlt || ''}
                    onChange={(e) =>
                      onHeaderChange({
                        ...newsletterHeader,
                        sponsor: { ...newsletterHeader.sponsor, imageAlt: e.target.value },
                      })
                    }
                    size="small"
                  />

                  {/* Botón de subida a S3 */}
                  {newsletterHeader.sponsor?.image &&
                    isBase64Image(newsletterHeader.sponsor.image) && (
                      <>
                        {uploading && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              Subiendo: {uploadProgress}%
                            </Typography>
                            <LinearProgress variant="determinate" value={uploadProgress} />
                          </Box>
                        )}
                        <LoadingButton
                          variant="contained"
                          color="warning"
                          fullWidth
                          startIcon={<Icon icon="mdi:cloud-upload" />}
                          onClick={handleUploadSponsorToS3}
                          loading={uploading}
                          sx={{ mb: 2 }}
                        >
                          ⚠️ Subir Imagen Sponsor a S3 (Requerido)
                        </LoadingButton>
                      </>
                    )}
                </>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    );
  }

  // ======================
  // NEWSLETTER FOOTER EDIT
  // ======================
  if (selectedComponentId === 'newsletter-footer' && isNewsletterMode && newsletterFooter) {
    console.log('✅ Renderizando opciones del FOOTER');
    return (
      <Box
        sx={(theme) => ({
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          background: 'transparent',
          borderRadius: 2,
          '&::before': {
            ...theme.mixins.borderGradient({
              padding: '2px',
              color: `linear-gradient(to bottom left, #FFFFFF, #C6C6FF61)`,
            }),
            pointerEvents: 'none',
          },
        })}
      >
        <AppBar position="static" color="default" elevation={0} sx={{ flexShrink: 0 }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setSelectedComponentId(null)}>
              <Icon icon="mdi:arrow-left" />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
              Configuración del Footer
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, height: 0, p: 2 }}>
          <TextField
            fullWidth
            label="Nombre de la Empresa"
            value={newsletterFooter.companyName}
            onChange={(e) => onFooterChange({ ...newsletterFooter, companyName: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Dirección"
            value={newsletterFooter.address}
            onChange={(e) => onFooterChange({ ...newsletterFooter, address: e.target.value })}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email de Contacto"
            type="email"
            value={newsletterFooter.contactEmail}
            onChange={(e) => onFooterChange({ ...newsletterFooter, contactEmail: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Color de Fondo"
            type="color"
            value={newsletterFooter.backgroundColor}
            onChange={(e) =>
              onFooterChange({ ...newsletterFooter, backgroundColor: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Color del Texto"
            type="color"
            value={newsletterFooter.textColor}
            onChange={(e) => onFooterChange({ ...newsletterFooter, textColor: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
            Redes Sociales
          </Typography>
          {newsletterFooter.socialLinks.map((link, index) => (
            <Box
              key={index}
              sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {link.platform}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => {
                    const newSocialLinks = [...newsletterFooter.socialLinks];
                    newSocialLinks[index].enabled = !newSocialLinks[index].enabled;
                    onFooterChange({ ...newsletterFooter, socialLinks: newSocialLinks });
                  }}
                  color={link.enabled ? 'primary' : 'default'}
                >
                  <Icon icon={link.enabled ? 'mdi:eye' : 'mdi:eye-off'} />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                label={`URL de ${link.platform}`}
                value={link.url}
                onChange={(e) => {
                  const newSocialLinks = [...newsletterFooter.socialLinks];
                  newSocialLinks[index].url = e.target.value;
                  onFooterChange({ ...newsletterFooter, socialLinks: newSocialLinks });
                }}
                disabled={!link.enabled}
                size="small"
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // Determinar si debemos mostrar la configuración de la nota
  const shouldShowNoteConfiguration =
    !selectedComponent ||
    (isContainerSelected &&
      ((activeTemplate !== 'news' &&
        activeTemplate !== 'market' &&
        activeTemplate !== 'storyboard') ||
        activeVersion === 'newsletter'));

  // Renderizar configuración de la nota (consolidado)
  if (shouldShowNoteConfiguration) {
    return (
      <Box
        sx={(theme) => ({
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          background: 'transparent',
          borderRadius: 2,
          '&::before': {
            ...theme.mixins.borderGradient({
              padding: '2px',
              color: `linear-gradient(to bottom left, #FFFFFF, #C6C6FF61)`,
            }),
            pointerEvents: 'none', // Permitir eventos de scroll a través del pseudo-elemento
          },
        })}
      >
        <AppBar position="static" color="default" elevation={0} sx={{ flexShrink: 0 }}>
          {/* ToggleButtonGroup para tabs */}
          <Box
            sx={{
              p: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <ToggleButtonGroup
              value={containerTab}
              exclusive
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  setContainerTab(newValue);
                }
              }}
              aria-label="Configuración de nota"
              size="small"
              color="primary"
              sx={{
                width: '100%',
                border: 'none',
                '& .MuiToggleButton-root': {
                  flex: 1,
                  fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  padding: { xs: '4px 6px', sm: '6px 8px' },
                  border: 'none',
                },
              }}
            >
              <ToggleButton value={1} aria-label="diseno-contenedor">
                Diseño
              </ToggleButton>
              <ToggleButton value={0} aria-label="informacion-basica">
                Configuración
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </AppBar>

        <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, height: 0 }}>
          {/* Tab 0: Información Básica */}
          {containerTab === 0 && (
            <Box sx={{ p: 2 }}>
              <Chip label="General" variant="filled" sx={{ mb: 2 }} size="small" />

              {/* Modo Newsletter: mostrar campos de newsletter */}
              {isNewsletterMode ? (
                <>
                  {/* Título del Newsletter */}
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Título del Newsletter"
                    value={localNewsletterTitle}
                    onChange={(e) => setLocalNewsletterTitle(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                    multiline
                    rows={3}
                  />

                  {/* Descripción del Newsletter */}
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Descripción"
                    value={localNewsletterDescription}
                    onChange={(e) => setLocalNewsletterDescription(e.target.value)}
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                  {/* Modo Normal: mostrar campos de nota */}
                  {/* Título */}
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Título de la nota"
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    sx={{ mb: 2 }}
                    required
                    multiline
                    rows={3}
                    error={showValidationErrors && !localTitle.trim()}
                    helperText={
                      showValidationErrors && !localTitle.trim()
                        ? '⚠️ El título es obligatorio para guardar la nota'
                        : ''
                    }
                  />

                  {/* Descripción */}
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Descripción"
                    value={localDescription}
                    onChange={(e) => setLocalDescription(e.target.value)}
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />

                  {/* Checkbox Destacar - Solo en modo normal */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={highlight}
                        onChange={(e) => setHighlight(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Destacar"
                    sx={{ mb: 2 }}
                  />
                </>
              )}

              {/* Portada de nota / newsletter */}

              {/* Componente de upload de imagen de portada */}
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={isNewsletterMode ? 'Portada del Newsletter' : 'Portada de nota'}
                  variant="filled"
                  sx={{ mb: 2 }}
                  size="small"
                />
                <UploadCover
                  value={noteCoverImageUrl}
                  disabled={uploading}
                  onDrop={async (acceptedFiles: File[]) => {
                    const file = acceptedFiles[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = async () => {
                        const base64String = reader.result as string;
                        // Mostrar preview temporalmente
                        setNoteCoverImageUrl(base64String);

                        try {
                          // Subir automáticamente a S3
                          const s3Url = await uploadImageToS3(base64String, `cover-${Date.now()}`);
                          // Actualizar con la URL de S3
                          setNoteCoverImageUrl(s3Url);
                        } catch (error) {
                          console.error('Error al subir imagen de portada:', error);
                          // Mantener el base64 en caso de error para que el usuario pueda intentar de nuevo
                          showNotification(
                            'Error al subir la imagen. Por favor, intenta de nuevo.',
                            'error'
                          );
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  onRemove={(file: File | string) => setNoteCoverImageUrl('')}
                />
                {uploading && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Subiendo imagen: {uploadProgress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                )}
              </Box>

              {/* Estado - Solo mostrar si la nota ya está guardada Y NO está en modo newsletter */}
              {currentNoteId && !isNewsletterMode && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    variant="filled"
                    value={noteStatus}
                    label="Estado"
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <MenuItem
                      value={POST_STATUS.DRAFT}
                      disabled={checkStatusDisabled(POST_STATUS.DRAFT)}
                    >
                      Borrador
                    </MenuItem>
                    <MenuItem
                      value={POST_STATUS.REVIEW}
                      disabled={checkStatusDisabled(POST_STATUS.REVIEW)}
                    >
                      En Revisión
                    </MenuItem>
                    <MenuItem
                      value={POST_STATUS.APPROVED}
                      disabled={checkStatusDisabled(POST_STATUS.APPROVED)}
                    >
                      Aprobado
                    </MenuItem>
                    <MenuItem
                      value={POST_STATUS.PUBLISHED}
                      disabled={checkStatusDisabled(POST_STATUS.PUBLISHED)}
                    >
                      Publicado
                    </MenuItem>
                    <MenuItem
                      value={POST_STATUS.REJECTED}
                      disabled={checkStatusDisabled(POST_STATUS.REJECTED)}
                    >
                      Rechazado
                    </MenuItem>
                  </Select>
                </FormControl>
              )}

              {/* Configuración específica - Solo en modo normal, NO en newsletter */}
              {!isNewsletterMode && (
                <>
                  <Chip
                    label="Configuración específica"
                    variant="filled"
                    sx={{ mb: 2 }}
                    size="small"
                  />

                  {/* Tipo de contenido */}
                  <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    error={showValidationErrors && !contentTypeId}
                  >
                    <InputLabel>Tipo de contenido *</InputLabel>
                    <Select
                      variant="filled"
                      value={contentTypeId}
                      label="Tipo de contenido *"
                      sx={{
                        '& .Mui-disabled': {
                          backgroundColor: 'background.neutral',
                        },
                      }}
                      onChange={(e) => setContentTypeId(e.target.value)}
                      disabled={loadingMetadata}
                    >
                      <MenuItem value="">
                        <em>Seleccionar</em>
                      </MenuItem>
                      {contentTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {showValidationErrors && !contentTypeId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        ⚠️ El tipo de contenido es obligatorio
                      </Typography>
                    )}
                  </FormControl>

                  {/* Audiencia */}
                  <FormControl fullWidth sx={{ mb: 2 }} error={showValidationErrors && !audienceId}>
                    <InputLabel>Audiencia *</InputLabel>
                    <Select
                      variant="filled"
                      value={audienceId}
                      label="Audiencia *"
                      sx={{
                        '& .Mui-disabled': {
                          backgroundColor: 'background.neutral',
                        },
                      }}
                      onChange={(e) => setAudienceId(e.target.value)}
                      disabled={loadingMetadata}
                    >
                      <MenuItem value="">
                        <em>Seleccionar</em>
                      </MenuItem>
                      {audiences.map((audience) => (
                        <MenuItem key={audience.id} value={audience.id}>
                          {audience.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {showValidationErrors && !audienceId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        ⚠️ La audiencia es obligatoria
                      </Typography>
                    )}
                  </FormControl>

                  {/* Categoría */}
                  <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={!contentTypeId}
                    error={showValidationErrors && contentTypeId && !categoryId}
                  >
                    <InputLabel>Categoría *</InputLabel>
                    <Select
                      variant="filled"
                      value={categoryId}
                      label="Categoría *"
                      sx={{
                        '& .Mui-disabled': {
                          backgroundColor: 'background.neutral',
                        },
                      }}
                      onChange={(e) => setCategoryId(e.target.value)}
                      disabled={!contentTypeId || loadingMetadata}
                    >
                      <MenuItem value="">
                        <em>Seleccionar</em>
                      </MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {showValidationErrors && contentTypeId && !categoryId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        ⚠️ La categoría es obligatoria
                      </Typography>
                    )}
                    {!contentTypeId && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        Selecciona un tipo de contenido primero
                      </Typography>
                    )}
                  </FormControl>

                  {/* Subcategoría */}
                  <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={!categoryId}
                    error={showValidationErrors && categoryId && !subcategoryId}
                  >
                    <InputLabel>Subcategoría *</InputLabel>
                    <Select
                      variant="filled"
                      value={subcategoryId}
                      label="Subcategoría *"
                      sx={{
                        '& .Mui-disabled': {
                          backgroundColor: 'background.neutral',
                        },
                      }}
                      onChange={(e) => setSubcategoryId(e.target.value)}
                      disabled={!categoryId || loadingMetadata}
                    >
                      <MenuItem value="">
                        <em>Seleccionar</em>
                      </MenuItem>
                      {subcategories.map((subcategory) => (
                        <MenuItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {showValidationErrors && categoryId && !subcategoryId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        ⚠️ La subcategoría es obligatoria
                      </Typography>
                    )}
                    {!categoryId && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        Selecciona una categoría primero
                      </Typography>
                    )}
                  </FormControl>

                  {/* Botón para eliminar la nota (solo si está guardada) */}
                  {currentNoteId && (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<Icon icon="mdi:delete-outline" />}
                      onClick={() => setOpenDeleteDialog(true)}
                      sx={{
                        backgroundColor: 'rgba(255, 72, 66, 0.08)',
                        color: 'error.main',
                        border: 'none',
                        height: 48,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 72, 66, 0.16)',
                          borderColor: 'error.main',
                        },
                      }}
                    >
                      Eliminar nota
                    </Button>
                  )}
                </>
              )}
            </Box>
          )}

          {/* Tab 1: Diseño del Contenedor / Temas de Color (Newsletter) */}
          {containerTab === 1 && (
            <Box sx={{ p: 2 }}>
              {/* Si está en modo Newsletter, mostrar Temas de Color */}
              {isNewsletterMode && newsletterHeader && newsletterFooter ? (
                <Box>
                  <Chip label="🎨 Temas de Color" variant="filled" sx={{ mb: 2 }} size="small" />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Selecciona un tema para aplicar al header y footer del newsletter
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    {NEWSLETTER_THEMES.map((theme) => (
                      <Box
                        key={theme.id}
                        sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: 2,
                          p: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: '#1976d2',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          },
                        }}
                        onClick={() => {
                          // Aplicar tema a header y footer
                          const newHeader = {
                            ...newsletterHeader,
                            useGradient: true,
                            gradientColors: theme.gradientColors,
                            gradientDirection: theme.gradientDirection,
                            textColor: theme.textColor,
                          };

                          const newFooter = {
                            ...newsletterFooter,
                            useGradient: true,
                            gradientColors: theme.gradientColors,
                            gradientDirection: theme.gradientDirection,
                            textColor: theme.textColor,
                          };

                          // Usar onNewsletterConfigChange para actualizar header y footer en una sola operación
                          if (onNewsletterConfigChange) {
                            onNewsletterConfigChange({ header: newHeader, footer: newFooter });
                          } else {
                            // Fallback a las funciones individuales si no está disponible
                            onHeaderChange(newHeader);
                            onFooterChange(newFooter);
                          }
                        }}
                      >
                        {/* Vista previa del gradiente */}
                        <Box
                          sx={{
                            height: 50,
                            borderRadius: 1,
                            mb: 1,
                            backgroundImage: `linear-gradient(${theme.gradientDirection}deg, ${theme.gradientColors[0]} 0%, ${theme.gradientColors[1]} 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: theme.textColor,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        >
                          {theme.name}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ) : (
                /* Modo normal: Opciones de diseño del contenedor */
                <ContainerOptions
                  containerBorderWidth={containerBorderWidth}
                  setContainerBorderWidth={setContainerBorderWidth}
                  containerBorderColor={containerBorderColor}
                  setContainerBorderColor={setContainerBorderColor}
                  containerBorderRadius={containerBorderRadius}
                  setContainerBorderRadius={setContainerBorderRadius}
                  containerPadding={containerPadding}
                  setContainerPadding={setContainerPadding}
                  containerMaxWidth={containerMaxWidth}
                  setContainerMaxWidth={setContainerMaxWidth}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Diálogo de confirmación para eliminar nota */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">¿Eliminar nota?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta nota
              permanentemente?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteNote} color="error" variant="contained" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  // Renderizar opciones de componente específico
  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        background: theme.palette.background.paper,
      })}
    >
      <AppBar position="static" color="default" elevation={0} sx={{ flexShrink: 0 }}>
        <Toolbar sx={{ minHeight: { xs: 48, sm: 56 } }}>
          <IconButton
            edge="start"
            onClick={() => setSelectedComponentId(null)}
            sx={{ mr: 1 }}
            size="small"
          >
            <Icon icon="mdi:arrow-left" />
          </IconButton>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            Diseño
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          p: 1,
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <ToggleButtonGroup
          value={rightPanelTab}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setRightPanelTab(newValue);
            }
          }}
          aria-label="Opciones de componente"
          size="small"
          color="primary"
          sx={{
            width: '100%',
            border: 'none',
            '& .MuiToggleButton-root': {
              flex: 1,
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              padding: { xs: '4px 6px', sm: '6px 8px' },
              border: 'none',
            },
          }}
        >
          <ToggleButton value={0} aria-label="principal">
            {componentType === 'summary' || componentType === 'respaldadoPor'
              ? '📝 Configuración'
              : componentType === 'image'
                ? 'Imagen'
                : componentType === 'button'
                  ? 'Botón'
                  : componentType === 'gallery'
                    ? 'Galería'
                    : componentType === 'chart'
                      ? 'Gráfica'
                      : componentType === 'category'
                        ? 'Categorías'
                        : componentType === 'tituloConIcono'
                          ? 'Título'
                          : componentType === 'herramientas'
                            ? 'Herramientas'
                            : componentType === 'divider'
                              ? 'Separador'
                              : componentType === 'noteContainer'
                                ? 'Nota'
                                : componentType === 'newsletterHeaderReusable'
                                  ? 'Header Newsletter'
                                  : componentType === 'newsletterFooterReusable'
                                    ? 'Footer Newsletter'
                                    : (componentType as string) === 'newsletter-footer'
                                      ? 'Footer Newsletter'
                                      : 'Tipografía'}
          </ToggleButton>

          {/* Segundo tab solo para herramientas */}
          {componentType === 'herramientas' && (
            <ToggleButton value={1} aria-label="configuracion">
              Configuración
            </ToggleButton>
          )}

          {/* Tab IA para todos los componentes (excepto algunos específicos) */}
          {componentType !== 'divider' &&
            componentType !== 'spacer' &&
            componentType !== 'noteContainer' && (
              <ToggleButton value={componentType === 'herramientas' ? 2 : 1} aria-label="ia">
                🤖 IA
              </ToggleButton>
            )}
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, height: 0, p: { xs: 1, sm: 2 } }}
      >
        {rightPanelTab === 0 && (
          <>
            {/* Para Summary, mostrar directamente las opciones de configuración */}
            {componentType === 'summary' && (
              <SummaryOptions
                selectedComponentId={selectedComponentId}
                getActiveComponents={getActiveComponents}
                updateComponentProps={updateComponentProps}
                setShowIconPicker={setShowIconPicker}
              />
            )}

            {/* Para RespaldadoPor, mostrar directamente las opciones de configuración */}
            {componentType === 'respaldadoPor' && (
              <RespaldadoPorOptions
                selectedComponentId={selectedComponentId}
                getActiveComponents={getActiveComponents}
                updateComponentProps={updateComponentProps}
              />
            )}

            {componentType === 'image' && (
              <ImageOptions
                selectedComponentId={selectedComponentId}
                selectedComponent={selectedComponent}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
              />
            )}

            {componentType === 'gallery' && (
              <GalleryOptions
                selectedComponentId={selectedComponentId}
                selectedComponent={selectedComponent}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
              />
            )}

            {componentType === 'imageText' && (
              <ImageTextOptions
                component={selectedComponent}
                updateComponentProps={updateComponentProps}
              />
            )}

            {componentType === 'twoColumns' && (
              <TwoColumnsOptions
                component={selectedComponent}
                updateComponentProps={updateComponentProps}
                selectedColumn={selectedColumn}
              />
            )}

            {componentType === 'textWithIcon' && (
              <TextWithIconOptions
                component={selectedComponent}
                updateComponentProps={updateComponentProps}
              />
            )}

            {componentType === 'chart' && (
              <ChartOptions
                component={selectedComponent}
                updateComponentProps={updateComponentProps}
              />
            )}

            {componentType === 'button' && (
              <ButtonOptions
                selectedComponentId={selectedComponentId}
                selectedComponent={selectedComponent}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
                updateComponentContent={updateComponentContent}
              />
            )}

            {componentType === 'divider' && (
              <DividerOptions
                selectedComponentId={selectedComponentId}
                selectedComponent={selectedComponent}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
              />
            )}

            {/* ELIMINADO: Solo header global se configura automáticamente */}

            {componentType === 'newsletterHeaderReusable' && (
              <NewsletterHeaderReusableOptions
                selectedComponentId={selectedComponentId}
                selectedComponent={selectedComponent}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
              />
            )}

            {componentType === 'newsletterFooterReusable' && (
              <NewsletterFooterReusableOptions
                selectedComponentId={selectedComponentId}
                selectedComponent={selectedComponent}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
              />
            )}

            {(componentType as string) === 'newsletter-footer' && (
              <NewsletterFooterOptions
                selectedComponentId={selectedComponentId}
                selectedComponent={selectedComponent}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
              />
            )}

            {(componentType === 'heading' ||
              componentType === 'paragraph' ||
              componentType === 'bulletList') && (
              <TextOptions
                componentType={componentType}
                selectedComponent={selectedComponent}
                selectedComponentId={selectedComponentId}
                setSelectedComponentId={setSelectedComponentId}
                getActiveComponents={getActiveComponents}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
                updateComponentContent={updateComponentContent}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
                selectedFontSize={selectedFontSize}
                setSelectedFontSize={setSelectedFontSize}
                selectedFontWeight={selectedFontWeight}
                setSelectedFontWeight={setSelectedFontWeight}
                selectedAlignment={selectedAlignment}
                textFormat={textFormat}
                applyTextFormat={applyTextFormat}
                applyTextAlignment={applyTextAlignment}
                applyTextColor={applyTextColor}
                applyFontSize={applyFontSize}
                applyFontFamily={applyFontFamily}
                emailBackground={emailBackground}
                setEmailBackground={setEmailBackground}
                selectedBanner={selectedBanner}
                setSelectedBanner={setSelectedBanner}
                showGradient={showGradient}
                setShowGradient={setShowGradient}
                gradientColors={gradientColors}
                setGradientColors={setGradientColors}
                bannerOptions={bannerOptions}
                setSelectedAlignment={setSelectedAlignment}
                hasTextSelection={hasTextSelection}
                listStyle={listStyle}
                updateListStyle={updateListStyle}
                listColor={listColor}
                updateListColor={updateListColor}
                convertTextToList={convertTextToList}
                setShowIconPicker={setShowIconPicker}
                isContainerSelected={isContainerSelected}
                setIsContainerSelected={setIsContainerSelected}
                containerBorderWidth={containerBorderWidth}
                setContainerBorderWidth={setContainerBorderWidth}
                containerBorderColor={containerBorderColor}
                setContainerBorderColor={setContainerBorderColor}
                containerBorderRadius={containerBorderRadius}
                setContainerBorderRadius={setContainerBorderRadius}
                containerPadding={containerPadding}
                setContainerPadding={setContainerPadding}
                containerMaxWidth={containerMaxWidth}
                setContainerMaxWidth={setContainerMaxWidth}
                activeTemplate={activeTemplate}
                activeVersion={activeVersion}
                currentNoteId={currentNoteId}
                noteTitle={noteTitle}
                setNoteTitle={setNoteTitle}
                noteDescription={noteDescription}
                setNoteDescription={setNoteDescription}
                noteCoverImageUrl={noteCoverImageUrl}
                setNoteCoverImageUrl={setNoteCoverImageUrl}
                noteStatus={noteStatus}
                setNoteStatus={setNoteStatus}
                updateStatus={updateStatus}
                contentTypeId={contentTypeId}
                setContentTypeId={setContentTypeId}
                audienceId={audienceId}
                setAudienceId={setAudienceId}
                categoryId={categoryId}
                setCategoryId={setCategoryId}
                subcategoryId={subcategoryId}
                setSubcategoryId={setSubcategoryId}
                highlight={highlight}
                setHighlight={setHighlight}
                selectedColumn={selectedColumn}
                injectComponentsToNewsletter={injectComponentsToNewsletter}
              />
            )}

            {componentType === 'category' && (
              <CategoryOptions
                selectedComponentId={selectedComponentId}
                getActiveComponents={getActiveComponents}
                updateComponentProps={updateComponentProps}
              />
            )}

            {componentType === 'tituloConIcono' && (
              <TituloConIconoOptions
                selectedComponentId={selectedComponentId}
                getActiveComponents={getActiveComponents}
                updateComponentProps={updateComponentProps}
                setShowIconPicker={setShowIconPicker}
              />
            )}

            {componentType === 'noteContainer' && (
              <NoteContainerOptions
                selectedComponentId={selectedComponentId}
                getActiveComponents={getActiveComponents}
                updateComponentProps={updateComponentProps}
                updateComponentStyle={updateComponentStyle}
              />
            )}

            {/* Herramientas - solo en tab 0 cuando NO es summary */}
            {componentType === 'herramientas' && (
              <HerramientasOptions
                selectedComponentId={selectedComponentId}
                getActiveComponents={getActiveComponents}
                updateComponentProps={updateComponentProps}
                setShowIconPicker={setShowIconPicker}
              />
            )}
          </>
        )}

        {/* Tab 1: Solo para herramientas (configuración) */}
        {rightPanelTab === 1 && componentType === 'herramientas' && (
          <HerramientasOptions
            selectedComponentId={selectedComponentId}
            getActiveComponents={getActiveComponents}
            updateComponentProps={updateComponentProps}
            setShowIconPicker={setShowIconPicker}
          />
        )}

        {/* Tab IA: Para todos los componentes (valor 1 para la mayoría, 2 para herramientas) */}
        {((rightPanelTab === 1 && componentType !== 'herramientas') ||
          (rightPanelTab === 2 && componentType === 'herramientas')) && (
          <Box>
            <Chip label="🤖 Asistente IA" variant="filled" sx={{ mb: 2 }} size="small" />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Próximamente: Herramientas de IA para mejorar tu contenido
            </Typography>

            {/* Opciones de IA según tipo de componente */}
            {(componentType === 'heading' ||
              componentType === 'paragraph' ||
              componentType === 'bulletList') && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                  Opciones para texto:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:magic-staff" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Reescribir con IA
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:text-box-plus-outline" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Expandir contenido
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:text-box-minus-outline" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Resumir texto
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:translate" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Traducir
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:spellcheck" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Corregir ortografía
                </Button>
              </Box>
            )}

            {componentType === 'image' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                  Opciones para imagen:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:image-auto-adjust" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Generar descripción ALT
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:image-search" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Sugerir imágenes similares
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:palette" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Generar con IA (DALL-E)
                </Button>
              </Box>
            )}

            {componentType === 'button' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                  Opciones para botón:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:target" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Optimizar CTA
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:ab-testing" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Generar variaciones A/B
                </Button>
              </Box>
            )}

            {componentType === 'gallery' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                  Opciones para galería:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:image-multiple" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Generar captions automáticos
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:palette-swatch" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Sugerir tema visual coherente
                </Button>
              </Box>
            )}

            {componentType === 'chart' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1 }}>
                  Opciones para gráfica:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:chart-line" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Generar insights automáticos
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled
                  startIcon={<Icon icon="mdi:text-box" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Crear descripción textual
                </Button>
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 2, fontSize: '0.75rem' }}>
              💡 Las funcionalidades de IA estarán disponibles próximamente. Podrás mejorar tu
              contenido con un solo clic.
            </Alert>
          </Box>
        )}
      </Box>

      {/* Diálogo de confirmación para eliminar nota */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Eliminar nota?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta nota
            permanentemente?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteNote} color="error" variant="contained" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
