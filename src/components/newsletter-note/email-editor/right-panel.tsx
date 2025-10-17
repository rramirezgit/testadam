'use client';

import type { PostStatus } from 'src/types/post';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Chip,
  Alert,
  AppBar,
  Button,
  Dialog,
  Select,
  Toolbar,
  MenuItem,
  Snackbar,
  Checkbox,
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
}: RightPanelProps) {
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

  // Cargar categorías cuando cambie el content type
  useEffect(() => {
    if (contentTypeId) {
      console.log('🔄 Content type cambió, cargando categorías para:', contentTypeId);
      loadCategories(contentTypeId);
      // Resetear categoría y subcategoría cuando cambie el content type
      setCategoryId('');
      setSubcategoryId('');
    } else {
      // Si no hay content type, limpiar categorías
      console.log('🧹 Content type vacío, limpiando categorías');
      setCategoryId('');
      setSubcategoryId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentTypeId]); // Solo depender de contentTypeId

  // Resetear subcategoría cuando cambie la categoría
  useEffect(() => {
    if (categoryId) {
      console.log('🔄 Categoría cambió a:', categoryId);
    }
    setSubcategoryId('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]); // Solo depender de categoryId

  // Obtener subcategorías de la categoría seleccionada
  const selectedCategory = categories.find((cat) => cat.id === categoryId);
  const subcategories = selectedCategory?.subcategories || [];

  // PostStore para cargar notas
  const {
    findAll: findAllPosts,
    findById: findPostById,
    loading: loadingPosts,
    posts,
    delete: deletePost,
  } = usePostStore();

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
              {/* Título */}
              <TextField
                fullWidth
                variant="filled"
                label="Título de la nota"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                sx={{ mb: 2 }}
                required
                multiline
                rows={3}
                error={showValidationErrors && !noteTitle.trim()}
                helperText={
                  showValidationErrors && !noteTitle.trim()
                    ? '⚠️ El título es obligatorio para guardar la nota'
                    : ''
                }
              />

              {/* Descripción */}
              <TextField
                fullWidth
                variant="filled"
                label="Descripción"
                value={noteDescription}
                onChange={(e) => setNoteDescription(e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />

              {/* Checkbox Destacar */}
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

              {/* Portada de nota */}

              {/* Componente de upload de imagen de portada */}
              <Box sx={{ mb: 2 }}>
                <Chip label="Portada de nota" variant="filled" sx={{ mb: 2 }} size="small" />
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

              {/* Estado - Solo mostrar si la nota ya está guardada */}
              {currentNoteId && (
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

              {/* Configuración específica */}
              <Chip label="Configuración específica" variant="filled" sx={{ mb: 2 }} size="small" />

              {/* Tipo de contenido */}
              <FormControl fullWidth sx={{ mb: 2 }} error={showValidationErrors && !contentTypeId}>
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
            </Box>
          )}

          {/* Tab 1: Diseño del Contenedor */}
          {containerTab === 1 && (
            <Box sx={{ p: 2 }}>
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

      <Tabs
        value={rightPanelTab}
        onChange={(e, newValue) => setRightPanelTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
          '& .MuiTab-root': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            minWidth: { xs: 'auto', sm: 72 },
            padding: { xs: '6px 8px', sm: '12px 16px' },
          },
        }}
      >
        {/* Para Summary y RespaldadoPor, solo mostrar la tab de configuración */}
        {componentType === 'summary' || componentType === 'respaldadoPor'
          ? [<Tab key="config" label="📝 Configuración" />]
          : [
              <Tab
                key="main"
                label={
                  componentType === 'image'
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
                                          : 'Tipografía'
                }
              />,
              ...(componentType === 'herramientas'
                ? [<Tab key="herramientas-config" label="Configuración" />]
                : []),
              // <Tab key="smart" label="🎨 Smart" />,
            ]}
      </Tabs>

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
