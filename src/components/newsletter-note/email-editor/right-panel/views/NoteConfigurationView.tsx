'use client';

import type { EmailComponent } from 'src/types/saved-note';

import { Icon } from '@iconify/react';
import { useRef, useState, useEffect, forwardRef, useCallback, useImperativeHandle } from 'react';

import {
  Box,
  Chip,
  Alert,
  AppBar,
  Button,
  Dialog,
  Select,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
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

import { CONFIG } from 'src/global-config';
import useAuthStore from 'src/store/AuthStore';
import usePostStore from 'src/store/PostStore';

import { UploadCover } from 'src/components/upload';

import { POST_STATUS } from 'src/types/post';

import ImageCropDialog from '../ImageCropDialog';
import ImageSourceModal from '../ImageSourceModal';
import ContainerOptions from '../ContainerOptions';
import ApprovalConfirmationModal from '../../ApprovalConfirmationModal';
import { generateTituloConIconoPropsFromCategory } from '../../constants/category-icons';

import type { Categoria } from '../../components/Categorias';
import type { NewsletterFooter, NewsletterHeader } from '../../types';

// Tipos para metadatos
interface ContentType {
  id: string;
  name: string;
}

interface Audience {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

// Definición de temas predefinidos para newsletter
const NEWSLETTER_THEMES = CONFIG.defaultThemesNewsletter;

// Colores para las categorías
const COLORES_SUAVES = [
  { colorFondo: '#e3f2fd', colorTexto: '#1565c0' },
  { colorFondo: '#f3e5f5', colorTexto: '#7b1fa2' },
  { colorFondo: '#e8f5e8', colorTexto: '#388e3c' },
  { colorFondo: '#fce4ec', colorTexto: '#c2185b' },
  { colorFondo: '#fff8e1', colorTexto: '#f57c00' },
  { colorFondo: '#e1f5fe', colorTexto: '#0277bd' },
  { colorFondo: '#fff3e0', colorTexto: '#e65100' },
  { colorFondo: '#f1f8e9', colorTexto: '#558b2f' },
  { colorFondo: '#e0f2f1', colorTexto: '#00695c' },
  { colorFondo: '#e8eaf6', colorTexto: '#3f51b5' },
  { colorFondo: '#fce4ec', colorTexto: '#ad1457' },
  { colorFondo: '#e8f5e8', colorTexto: '#2e7d32' },
];

export type NoteConfigurationField =
  | 'newsletterTitle'
  | 'noteTitle'
  | 'contentType'
  | 'audience'
  | 'category'
  | 'subcategory';

export interface NoteConfigurationViewHandle {
  focusField: (field: NoteConfigurationField) => void;
}

interface NoteConfigurationViewProps {
  containerTab: number;
  setContainerTab: (tab: number) => void;
  isNewsletterMode: boolean;
  localNewsletterTitle: string;
  setLocalNewsletterTitle: (title: string) => void;
  localNewsletterDescription: string;
  setLocalNewsletterDescription: (description: string) => void;
  localTitle: string;
  setLocalTitle: (title: string) => void;
  localDescription: string;
  setLocalDescription: (description: string) => void;
  highlight: boolean;
  setHighlight: (highlight: boolean) => void;
  showValidationErrors: boolean;
  currentNewsletterId?: string;
  newsletterStatus?: string;
  onNewsletterUpdate: () => void;
  showNotification: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  noteCoverImageUrl: string;
  setNoteCoverImageUrl: (url: string) => void;
  uploadImageToS3: (base64Image: string, fileName: string) => Promise<string>;
  uploading: boolean;
  uploadProgress: number;
  currentNoteId?: string;
  noteStatus: string;
  handleStatusChange: (status: string) => Promise<void>;
  checkStatusDisabled: (status: string) => boolean;
  webPublishError?: string | null;
  contentTypeId: string;
  setContentTypeId: (id: string) => void;
  audienceId: string;
  setAudienceId: (id: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  subcategoryId: string;
  setSubcategoryId: (id: string) => void;
  contentTypes: ContentType[];
  audiences: Audience[];
  categories: Category[];
  subcategories: any[];
  loadingMetadata: boolean;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (open: boolean) => void;
  handleDeleteNote: () => Promise<void>;
  newsletterHeader?: NewsletterHeader;
  newsletterFooter?: NewsletterFooter;
  onNewsletterConfigChange?: (config: {
    header: NewsletterHeader;
    footer: NewsletterFooter;
  }) => void;
  onHeaderChange: (header: NewsletterHeader) => void;
  onFooterChange: (footer: NewsletterFooter) => void;
  isViewOnly: boolean;
  containerBorderWidth: number;
  setContainerBorderWidth: (width: number) => void;
  containerBorderColor: string;
  setContainerBorderColor: (color: string) => void;
  containerBorderRadius: number;
  setContainerBorderRadius: (radius: number) => void;
  containerPadding: number;
  setContainerPadding: (padding: number) => void;
  containerMaxWidth: number;
  setContainerMaxWidth: (maxWidth: number) => void;
  // Nuevas props para sincronizar con componentes
  getActiveComponents?: () => EmailComponent[];
  updateComponentProps?: (
    id: string,
    props: Record<string, any>,
    options?: { content?: string }
  ) => void;
}

const NoteConfigurationView = forwardRef<NoteConfigurationViewHandle, NoteConfigurationViewProps>(
  (
    {
      containerTab,
      setContainerTab,
      isNewsletterMode,
      localNewsletterTitle,
      setLocalNewsletterTitle,
      localNewsletterDescription,
      setLocalNewsletterDescription,
      localTitle,
      setLocalTitle,
      localDescription,
      setLocalDescription,
      highlight,
      setHighlight,
      showValidationErrors,
      currentNewsletterId,
      newsletterStatus,
      onNewsletterUpdate,
      showNotification,
      noteCoverImageUrl,
      setNoteCoverImageUrl,
      uploadImageToS3,
      uploading,
      uploadProgress,
      currentNoteId,
      noteStatus,
      handleStatusChange,
      checkStatusDisabled,
      webPublishError,
      contentTypeId,
      setContentTypeId,
      audienceId,
      setAudienceId,
      categoryId,
      setCategoryId,
      subcategoryId,
      setSubcategoryId,
      contentTypes,
      audiences,
      categories,
      subcategories,
      loadingMetadata,
      openDeleteDialog,
      setOpenDeleteDialog,
      handleDeleteNote,
      newsletterHeader,
      newsletterFooter,
      onNewsletterConfigChange,
      onHeaderChange,
      onFooterChange,
      isViewOnly,
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
      getActiveComponents,
      updateComponentProps,
    },
    ref
  ) => {
    // Obtener usuario autenticado
    const user = useAuthStore((state) => state.user);

    const newsletterTitleRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
    const noteTitleRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);
    const contentTypeRef = useRef<HTMLInputElement | null>(null);
    const audienceRef = useRef<HTMLInputElement | null>(null);
    const categoryRef = useRef<HTMLInputElement | null>(null);
    const subcategoryRef = useRef<HTMLInputElement | null>(null);

    // Estados para el modal de confirmación de aprobación/rechazo
    const [showApprovalConfirmation, setShowApprovalConfirmation] = useState(false);
    const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);

    // Estados para el modal de confirmación de cambio de estado
    const [openStatusConfirmDialog, setOpenStatusConfirmDialog] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);
    const [openWebPublishErrorDialog, setOpenWebPublishErrorDialog] = useState(false);

    // Estados para modales de imagen de portada
    const [showImageSourceModal, setShowImageSourceModal] = useState(false);
    const [showImageCropDialog, setShowImageCropDialog] = useState(false);
    const [imageCropDialogTab, setImageCropDialogTab] = useState<'edit' | 'ai'>('edit');

    // Efecto para abrir modal de error cuando hay un error de publicación web
    useEffect(() => {
      if (webPublishError) {
        setOpenWebPublishErrorDialog(true);
      }
    }, [webPublishError]);

    const focusElement = useCallback((element: HTMLElement | null | undefined) => {
      if (!element) {
        return;
      }

      element.focus();

      // Aseguramos que el elemento sea visible en el panel
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, []);

    const focusField = useCallback(
      (field: NoteConfigurationField) => {
        setContainerTab(0);

        const focusAfterRender = () => {
          switch (field) {
            case 'newsletterTitle':
              focusElement(newsletterTitleRef.current);
              break;
            case 'noteTitle':
              focusElement(noteTitleRef.current);
              break;
            case 'contentType':
              focusElement(contentTypeRef.current);
              break;
            case 'audience':
              focusElement(audienceRef.current);
              break;
            case 'category':
              focusElement(categoryRef.current);
              break;
            case 'subcategory':
              focusElement(subcategoryRef.current);
              break;
            default:
              break;
          }
        };

        // Esperamos al siguiente ciclo de render para asegurar que el tab esté visible
        window.requestAnimationFrame(() => {
          window.setTimeout(focusAfterRender, 0);
        });
      },
      [focusElement, setContainerTab]
    );

    useImperativeHandle(
      ref,
      () => ({
        focusField,
      }),
      [focusField]
    );

    // Helper para buscar el primer componente de un tipo específico
    const findFirstComponentByType = useCallback(
      (components: EmailComponent[], type: string): EmailComponent | null => {
        for (const comp of components) {
          if (comp.type === type) {
            return comp;
          }
          if (comp.props?.componentsData && Array.isArray(comp.props.componentsData)) {
            const found = findFirstComponentByType(comp.props.componentsData, type);
            if (found) {
              return found;
            }
          }
        }
        return null;
      },
      []
    );

    // Sincronizar componente TituloConIcono cuando cambia la categoría
    const syncTituloConIconoComponent = useCallback(
      (category: { id: string; name: string; imageUrl?: string }) => {
        if (!getActiveComponents || !updateComponentProps) return;

        const tituloComponent = findFirstComponentByType(getActiveComponents(), 'tituloConIcono');
        if (!tituloComponent) {
          return;
        }

        const tituloProps = generateTituloConIconoPropsFromCategory(category);
        updateComponentProps(tituloComponent.id, tituloProps, { content: category.name });
      },
      [getActiveComponents, updateComponentProps, findFirstComponentByType]
    );

    // Sincronizar componente Category cuando cambia la subcategoría
    const syncCategoryComponent = useCallback(
      (subcategory: { id: string; name: string }) => {
        if (!getActiveComponents || !updateComponentProps) return;

        const categoryComponent = findFirstComponentByType(getActiveComponents(), 'categoria');
        if (!categoryComponent) {
          return;
        }

        const currentCategorias = categoryComponent.props?.categorias || [];

        // Crear la nueva categoría con color del primer slot
        const colores = COLORES_SUAVES[0]; // Usar el primer color
        const nuevaCategoria: Categoria = {
          id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          texto: subcategory.name,
          colorFondo: colores.colorFondo,
          colorTexto: colores.colorTexto,
        };

        // Si hay categorías, reemplazar la primera; si no, agregar una nueva
        const nuevasCategorias =
          currentCategorias.length > 0
            ? [nuevaCategoria, ...currentCategorias.slice(1)]
            : [nuevaCategoria];

        const textosCategorias = nuevasCategorias.map((cat) => cat.texto).join(', ');
        updateComponentProps(
          categoryComponent.id,
          { categorias: nuevasCategorias },
          { content: textosCategorias }
        );
      },
      [getActiveComponents, updateComponentProps, findFirstComponentByType]
    );

    // Handler para confirmar aprobación/rechazo
    const handleConfirmApprovalAction = async () => {
      if (!currentNewsletterId || !pendingAction) return;

      try {
        const { approveNewsletter, rejectNewsletter, findNewsletterById } = usePostStore.getState();

        if (pendingAction === 'approve') {
          await approveNewsletter(currentNewsletterId);
          showNotification('Newsletter aprobado correctamente', 'success');
        } else {
          await rejectNewsletter(currentNewsletterId);
          showNotification('Newsletter rechazado', 'info');
        }

        await findNewsletterById(currentNewsletterId);
        if (onNewsletterUpdate) onNewsletterUpdate();
      } catch (error) {
        console.error('Error al ejecutar acción:', error);
        showNotification(
          `Error al ${pendingAction === 'approve' ? 'aprobar' : 'rechazar'} el newsletter`,
          'error'
        );
      }
    };

    // Función para obtener el mensaje de confirmación según el estado
    const getStatusConfirmationMessage = (status: string): string => {
      switch (status) {
        case POST_STATUS.DRAFT:
          return '¿Confirmas cambiar a Borrador?';
        case POST_STATUS.REVIEW:
          return '¿Confirmas enviar a Revisión?';
        case POST_STATUS.APPROVED:
          return '¿Confirmas aprobar esta nota?';
        case POST_STATUS.PUBLISHED:
          return '¿Confirmas publicar esta nota?';
        case POST_STATUS.REJECTED:
          return '¿Confirmas rechazar esta nota?';
        default:
          return '¿Confirmas cambiar el estado?';
      }
    };

    // Handler para solicitar cambio de estado (abre modal de confirmación)
    const handleRequestStatusChange = (newStatus: string) => {
      setPendingStatus(newStatus);
      setOpenStatusConfirmDialog(true);
    };

    // Handler para confirmar cambio de estado
    const handleConfirmStatusChange = async () => {
      if (!pendingStatus) return;

      setOpenStatusConfirmDialog(false);
      await handleStatusChange(pendingStatus);
      setPendingStatus(null);
    };

    // Handler para cancelar cambio de estado
    const handleCancelStatusChange = () => {
      setOpenStatusConfirmDialog(false);
      setPendingStatus(null);
    };

    // Handler para reintentar publicación web
    const handleRetryWebPublish = async () => {
      if (!currentNoteId) return;

      try {
        const { publishOnWebsite } = usePostStore.getState();
        const success = await publishOnWebsite(currentNoteId);

        if (success) {
          showNotification('Nota publicada en la web exitosamente', 'success');
          setOpenWebPublishErrorDialog(false);
        } else {
          showNotification('Error al publicar en la web. Por favor, intenta de nuevo.', 'error');
        }
      } catch (error) {
        console.error('Error al reintentar publicación web:', error);
        showNotification('Error al publicar en la web. Por favor, intenta de nuevo.', 'error');
      }
    };

    // Handlers para imagen de portada
    const handleOpenImageSourceModal = () => {
      setShowImageSourceModal(true);
    };

    const handleSelectFromPC = () => {
      setShowImageSourceModal(false);
      // Crear un input file temporal para abrir el selector
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64String = reader.result as string;
            setNoteCoverImageUrl(base64String);
            try {
              const s3Url = await uploadImageToS3(base64String, `cover-${Date.now()}`);
              setNoteCoverImageUrl(s3Url);
            } catch (error) {
              console.error('Error al subir imagen de portada:', error);
              showNotification('Error al subir la imagen. Por favor, intenta de nuevo.', 'error');
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };

    const handleGenerateWithAI = () => {
      setShowImageSourceModal(false);
      setImageCropDialogTab('ai');
      setShowImageCropDialog(true);
    };

    const handleSaveFromCropDialog = async (imageBase64: string) => {
      setNoteCoverImageUrl(imageBase64);
      try {
        const s3Url = await uploadImageToS3(imageBase64, `cover-ai-${Date.now()}`);
        setNoteCoverImageUrl(s3Url);
        showNotification('Imagen guardada exitosamente', 'success');
      } catch (error) {
        console.error('Error al subir imagen generada:', error);
        showNotification('Error al subir la imagen. Por favor, intenta de nuevo.', 'error');
      }
      setShowImageCropDialog(false);
    };

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
        {/* Toggle de tabs - Solo en modo Newsletter */}
        {isNewsletterMode && (
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
        )}

        <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, height: 0 }}>
          {/* En modo Web: Mostrar siempre configuración (sin tabs) */}
          {/* En modo Newsletter: Mostrar según containerTab */}
          {(!isNewsletterMode || containerTab === 0) && (
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
                    disabled={isViewOnly}
                    inputRef={newsletterTitleRef}
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
                    disabled={isViewOnly}
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
                    inputRef={noteTitleRef}
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

                  {/* Checkbox Destacar - Visible en ambas plataformas */}
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

              {/* Botones de Aprobación/Rechazo - Solo en modo newsletter y estado PENDING_APPROVAL */}
              {isNewsletterMode &&
                currentNewsletterId &&
                newsletterStatus === 'PENDING_APPROVAL' && (
                  <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<Icon icon="mdi:check-circle" />}
                      onClick={() => {
                        setPendingAction('approve');
                        setShowApprovalConfirmation(true);
                      }}
                    >
                      Aprobar
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      startIcon={<Icon icon="mdi:close-circle" />}
                      onClick={() => {
                        setPendingAction('reject');
                        setShowApprovalConfirmation(true);
                      }}
                    >
                      Rechazar
                    </Button>
                  </Box>
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
                <Box
                  onClick={(e) => {
                    if (!uploading && !isViewOnly) {
                      e.stopPropagation();
                      handleOpenImageSourceModal();
                    }
                  }}
                  sx={{ cursor: uploading || isViewOnly ? 'default' : 'pointer' }}
                >
                  <UploadCover
                    value={noteCoverImageUrl}
                    disabled={uploading || isViewOnly}
                    onDrop={() => {}}
                    onRemove={(file: File | string) => setNoteCoverImageUrl('')}
                    sx={{ pointerEvents: 'none' }}
                  />
                </Box>
                {uploading && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Subiendo imagen: {uploadProgress}%
                    </Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                  </Box>
                )}
              </Box>

              {/* Botón para cancelar envío programado - Solo en modo newsletter y estado SCHEDULED */}
              {isNewsletterMode && currentNewsletterId && newsletterStatus === 'SCHEDULED' && (
                <Box sx={{ mb: 2 }}>
                  <Alert severity="info" sx={{ mb: 1 }}>
                    Este newsletter está programado para enviarse
                  </Alert>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="warning"
                    startIcon={<Icon icon="mdi:cancel" />}
                    onClick={async () => {
                      try {
                        // Necesitamos los datos del newsletter
                        const { unscheduleNewsletter, findNewsletterById } =
                          usePostStore.getState();
                        const newsletter = await findNewsletterById(currentNewsletterId);

                        await unscheduleNewsletter(
                          currentNewsletterId,
                          newsletter.subject,
                          newsletter.content || '',
                          newsletter.objData || '',
                          newsletter.scheduleDate
                        );

                        if (onNewsletterUpdate) onNewsletterUpdate();
                        showNotification('Envío programado cancelado', 'success');
                      } catch {
                        showNotification('Error al cancelar el envío', 'error');
                      }
                    }}
                  >
                    Cancelar Envío Programado
                  </Button>
                </Box>
              )}

              {/* Estado - Solo mostrar si la nota ya está guardada Y NO está en modo newsletter */}
              {currentNoteId && !isNewsletterMode && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    variant="filled"
                    value={noteStatus}
                    label="Estado"
                    onChange={(e) => handleRequestStatusChange(e.target.value)}
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

              {/* Configuración específica - Visible en ambas plataformas, modo normal, NO en newsletter */}
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
                    <InputLabel>{`Tipo de contenido${CONFIG.platform === 'ADAC' ? ' *' : ''}`}</InputLabel>
                    <Select
                      variant="filled"
                      value={contentTypeId}
                      label={`Tipo de contenido${CONFIG.platform === 'ADAC' ? ' *' : ''}`}
                      sx={{
                        '& .Mui-disabled': {
                          backgroundColor: 'background.neutral',
                        },
                      }}
                      onChange={(e) => setContentTypeId(e.target.value)}
                      disabled={loadingMetadata}
                      inputRef={contentTypeRef}
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

                  {/* Audiencia - Solo visible en ADAC */}
                  {CONFIG.platform === 'ADAC' && (
                    <FormControl
                      fullWidth
                      sx={{ mb: 2 }}
                      error={showValidationErrors && !audienceId}
                    >
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
                        inputRef={audienceRef}
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
                  )}

                  {/* Categoría */}
                  <FormControl
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={!contentTypeId}
                    error={showValidationErrors && contentTypeId && !categoryId}
                  >
                    <InputLabel>{`Categoría${CONFIG.platform === 'ADAC' ? ' *' : ''}`}</InputLabel>
                    <Select
                      variant="filled"
                      value={categoryId}
                      label={`Categoría${CONFIG.platform === 'ADAC' ? ' *' : ''}`}
                      sx={{
                        '& .Mui-disabled': {
                          backgroundColor: 'background.neutral',
                        },
                      }}
                      onChange={(e) => {
                        const nextCategoryId = e.target.value;
                        setCategoryId(nextCategoryId);

                        // Sincronizar con TituloConIcono si existe
                        const selectedCategory = categories.find(
                          (cat) => cat.id === nextCategoryId
                        );
                        if (selectedCategory) {
                          syncTituloConIconoComponent(selectedCategory);
                        }
                      }}
                      disabled={!contentTypeId || loadingMetadata}
                      inputRef={categoryRef}
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
                    <InputLabel>{`Subcategoría${CONFIG.platform === 'ADAC' ? ' *' : ''}`}</InputLabel>
                    <Select
                      variant="filled"
                      value={subcategoryId}
                      label={`Subcategoría${CONFIG.platform === 'ADAC' ? ' *' : ''}`}
                      sx={{
                        '& .Mui-disabled': {
                          backgroundColor: 'background.neutral',
                        },
                      }}
                      onChange={(e) => {
                        const nextSubcategoryId = e.target.value;
                        setSubcategoryId(nextSubcategoryId);

                        // Sincronizar con componente Category si existe
                        const selectedSubcategory = subcategories.find(
                          (sub) => sub.id === nextSubcategoryId
                        );
                        if (selectedSubcategory) {
                          syncCategoryComponent(selectedSubcategory);
                        }
                      }}
                      disabled={!categoryId || loadingMetadata}
                      inputRef={subcategoryRef}
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
                </>
              )}

              {/* Botón para eliminar la nota (solo si está guardada) - En ambas plataformas */}
              {currentNoteId && !isNewsletterMode && (
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

          {/* Tab 1: Diseño del Contenedor / Temas de Color - Solo en Newsletter */}
          {isNewsletterMode && containerTab === 1 && (
            <Box sx={{ p: 2 }}>
              {/* Si está en modo Newsletter, mostrar Temas de Color */}
              {newsletterHeader && newsletterFooter ? (
                <Box>
                  <Chip label="Temas de Color" variant="filled" sx={{ mb: 2 }} size="small" />
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
                          cursor: isViewOnly ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          opacity: isViewOnly ? 0.5 : 1,
                          pointerEvents: isViewOnly ? 'none' : 'auto',
                          '&:hover': {
                            borderColor: '#1976d2',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          },
                        }}
                        onClick={() => {
                          if (isViewOnly) return;

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

        {/* Modal de confirmación para aprobación/rechazo */}
        {pendingAction && currentNewsletterId && (
          <ApprovalConfirmationModal
            open={showApprovalConfirmation}
            onClose={() => {
              setShowApprovalConfirmation(false);
              setPendingAction(null);
            }}
            action={pendingAction}
            newsletterId={currentNewsletterId}
            onConfirm={handleConfirmApprovalAction}
          />
        )}

        {/* Modal para seleccionar origen de imagen */}
        <ImageSourceModal
          open={showImageSourceModal}
          onClose={() => setShowImageSourceModal(false)}
          onSelectFromPC={handleSelectFromPC}
          onGenerateWithAI={handleGenerateWithAI}
        />

        {/* Dialog para editar/generar imagen con IA */}
        <ImageCropDialog
          open={showImageCropDialog}
          onClose={() => setShowImageCropDialog(false)}
          onSave={handleSaveFromCropDialog}
          initialImage={noteCoverImageUrl || ''}
          currentAspectRatio={16 / 9}
          initialTab={imageCropDialogTab}
          userId={user?.id}
          plan={user?.plan?.name}
        />

        {/* Modal de confirmación para cambio de estado */}
        <Dialog
          open={openStatusConfirmDialog}
          onClose={handleCancelStatusChange}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirmar cambio de estado</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {pendingStatus && getStatusConfirmationMessage(pendingStatus)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelStatusChange} color="inherit">
              Cancelar
            </Button>
            <Button onClick={handleConfirmStatusChange} variant="contained" color="primary">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de error de publicación web */}
        <Dialog
          open={openWebPublishErrorDialog}
          onClose={() => setOpenWebPublishErrorDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Error al publicar en la web</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              La nota ha sido marcada como publicada, pero no se pudo publicar en la web.
            </DialogContentText>
            <DialogContentText>¿Deseas reintentar?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenWebPublishErrorDialog(false);
              }}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button onClick={handleRetryWebPublish} variant="contained" color="primary">
              Reintentar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
);

export default NoteConfigurationView;
