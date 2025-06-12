'use client';

import type React from 'react';
import type { Editor } from '@tiptap/react';
import type { SavedNote, EmailComponent } from 'src/types/saved-note';

import { Icon } from '@iconify/react';
import { useRef, useState, useEffect, useCallback } from 'react';

import { Box, Chip, Stack, Button, Avatar, Typography } from '@mui/material';

import { usePost } from 'src/hooks/use-posts';

import { useStore } from 'src/lib/store';
import usePostStore from 'src/store/PostStore';

import LeftPanel from './left-panel';
import RightPanel from './right-panel';
import IconPicker from './icon-picker';
import EditorHeader from './editor-header';
import EmailContent from './email-content';
import { CustomDialog } from './ui/custom-dialog';
import { CustomSnackbar } from './ui/custom-snackbar';
import { bannerOptions } from './data/banner-options';
import { emailTemplates } from './data/email-templates';
import { generateEmailHtml } from './utils/generate-html';
import { getImageStats, validateAllImagesUploaded } from './utils/imageValidation';
import {
  newsComponents,
  plaidComponents,
  notionComponents,
  stripeComponents,
  vercelComponents,
  newsComponentsWeb,
  plaidComponentsWeb,
  notionComponentsWeb,
  stripeComponentsWeb,
  vercelComponentsWeb,
} from './data/template-components';

import type { ComponentType } from './types';

// ⚡ OPTIMIZACIÓN: Componente SaveNoteDialog para evitar duplicación
interface SaveNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  noteTitle: string;
  noteDescription?: string;
  noteCoverImageUrl?: string;
  imageStats?: {
    total: number;
    uploaded: number;
    pending: number;
    isAllUploaded: boolean;
    pendingUrls: string[];
  };
}

const SaveNoteDialog: React.FC<SaveNoteDialogProps> = ({
  open,
  onClose: handleClose,
  onSave: handleSave,
  noteTitle,
  noteDescription = '',
  noteCoverImageUrl = '',
  imageStats,
}) => {
  const handleSaveClick = () => {
    handleSave();
  };

  const canSave = noteTitle.trim() && (!imageStats || imageStats.isAllUploaded);

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      title="Guardar Nota"
      actions={
        <>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveClick} color="primary" variant="contained" disabled={!canSave}>
            Guardar
          </Button>
        </>
      }
    >
      <Box sx={{ minWidth: 400 }}>
        {/* Panel de información de la nota */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Información de la Nota
          </Typography>

          <Stack spacing={2}>
            {/* Título */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<Icon icon="mdi:text-box-outline" />}
                  label={noteTitle ? `Título: ${noteTitle}` : 'Sin título'}
                  color={noteTitle ? 'success' : 'warning'}
                  variant={noteTitle ? 'filled' : 'outlined'}
                  size="small"
                />
              </Stack>
            </Box>

            {/* Descripción */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<Icon icon="mdi:text-subject" />}
                  label={noteDescription ? 'Descripción agregada' : 'Sin descripción'}
                  color={noteDescription ? 'success' : 'warning'}
                  variant={noteDescription ? 'filled' : 'outlined'}
                  size="small"
                />
              </Stack>
              {noteDescription && (
                <Box sx={{ mt: 1, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    <strong>Descripción:</strong> {noteDescription}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Imagen de portada */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<Icon icon="mdi:image-outline" />}
                  label={noteCoverImageUrl ? 'Imagen de portada agregada' : 'Sin imagen de portada'}
                  color={noteCoverImageUrl ? 'success' : 'warning'}
                  variant={noteCoverImageUrl ? 'filled' : 'outlined'}
                  size="small"
                />
                {/* Vista previa de la imagen si existe */}
                {noteCoverImageUrl && (
                  <Avatar
                    src={noteCoverImageUrl}
                    alt="Portada"
                    sx={{ width: 32, height: 32 }}
                    variant="rounded"
                  />
                )}
              </Stack>
            </Box>

            {/* Estado de imágenes en el contenido */}
            {imageStats && imageStats.total > 0 && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    icon={<Icon icon="mdi:image-multiple-outline" />}
                    label={`Imágenes: ${imageStats.uploaded}/${imageStats.total} en S3`}
                    color={imageStats.isAllUploaded ? 'success' : 'error'}
                    variant={imageStats.isAllUploaded ? 'filled' : 'outlined'}
                    size="small"
                  />
                </Stack>
                {!imageStats.isAllUploaded && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      backgroundColor: '#ffebee',
                      borderRadius: 1,
                      border: '1px solid #f44336',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      ⚠️ {imageStats.pending} imagen(es) sin subir a S3
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '0.8rem', mt: 0.5 }}
                    >
                      Sube todas las imágenes usando el botón &quot;Subir a S3&quot; en el panel de
                      opciones antes de guardar.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Mensaje de ayuda si falta información */}
            {(!noteTitle ||
              !noteDescription ||
              !noteCoverImageUrl ||
              (imageStats && !imageStats.isAllUploaded)) && (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: imageStats && !imageStats.isAllUploaded ? '#ffebee' : '#fff3cd',
                  borderRadius: 1,
                  border:
                    imageStats && !imageStats.isAllUploaded
                      ? '1px solid #f44336'
                      : '1px solid #ffeaa7',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <Icon
                    icon="mdi:information-outline"
                    style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                  />
                  {imageStats && !imageStats.isAllUploaded
                    ? 'Sube todas las imágenes a S3 antes de guardar la nota.'
                    : 'Completa la información en el panel derecho (pestaña de Información Básica) para optimizar tu nota.'}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </CustomDialog>
  );
};

// Update the interface to include initialNote, isNewsletterMode, and onSave
interface EmailEditorProps {
  initialTemplate?: string;
  savedNotes?: any[];
  onSaveNote?: (noteData: any) => void;
  onClose: () => void;
  initialNote?: SavedNote | null;
  isNewsletterMode?: boolean;
  onSave?: (note: SavedNote) => void;
}

// Crear una plantilla vacía
const emptyTemplate: EmailComponent[] = [];

export const EmailEditorMain: React.FC<EmailEditorProps> = ({
  initialTemplate = 'blank',
  onSave,
  savedNotes = [],
  onSaveNote,
  onClose = () => {},
  initialNote = null,
  isNewsletterMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<string>('contenido');
  const [activeTemplate, setActiveTemplate] = useState('blank'); // Cambiar a 'blank' por defecto

  // Debug: Log del activeTemplate cuando cambie
  console.log('🔍 EmailEditorMain - activeTemplate state:', activeTemplate);
  const [editMode, setEditMode] = useState(true);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    texto: true,
    multimedia: false,
    diseño: false,
  });
  const [activeDesignTab, setActiveDesignTab] = useState(0);
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedFont, setSelectedFont] = useState('Public Sans');
  const [selectedFontWeight, setSelectedFontWeight] = useState('Regular');
  const [selectedFontSize, setSelectedFontSize] = useState('16');
  const [selectedAlignment, setSelectedAlignment] = useState('left');
  const [textFormat, setTextFormat] = useState<string[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);

  // Estado para diálogos y notificaciones
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [emailHtml, setEmailHtml] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');

  // Inside the EmailEditor component, add these state variables
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [isEditingExistingNote, setIsEditingExistingNote] = useState(false);

  // Estado para el panel derecho
  const [rightPanelTab, setRightPanelTab] = useState(0);

  // Estado para la versión activa (newsletter o web)
  const [activeVersion, setActiveVersion] = useState<'newsletter' | 'web'>('newsletter');

  // Estados para la información de la nota
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteCoverImageUrl, setNoteCoverImageUrl] = useState('');
  const [noteStatus, setNoteStatus] = useState('DRAFT');

  // Use Zustand store
  const { addNote, updateNote, addSelectedNote } = useStore();

  // Estado para los componentes de cada plantilla
  const [blankComponentsState, setBlankComponents] = useState<EmailComponent[]>(emptyTemplate);
  const [blankComponentsWebState, setBlankComponentsWeb] =
    useState<EmailComponent[]>(emptyTemplate);
  const [notionComponentsState, setNotionComponents] = useState<EmailComponent[]>(notionComponents);
  const [notionComponentsWebState, setNotionComponentsWeb] =
    useState<EmailComponent[]>(notionComponentsWeb);
  const [plaidComponentsState, setPlaidComponents] = useState<EmailComponent[]>(plaidComponents);
  const [plaidComponentsWebState, setPlaidComponentsWeb] =
    useState<EmailComponent[]>(plaidComponentsWeb);
  const [stripeComponentsState, setStripeComponents] = useState<EmailComponent[]>(stripeComponents);
  const [stripeComponentsWebState, setStripeComponentsWeb] =
    useState<EmailComponent[]>(stripeComponentsWeb);
  const [vercelComponentsState, setVercelComponents] = useState<EmailComponent[]>(vercelComponents);
  const [vercelComponentsWebState, setVercelComponentsWeb] =
    useState<EmailComponent[]>(vercelComponentsWeb);
  const [newsComponentsState, setNewsComponents] = useState<EmailComponent[]>(newsComponents);
  const [newsComponentsWebState, setNewsComponentsWeb] =
    useState<EmailComponent[]>(newsComponentsWeb);

  // Añadir nuevos estados para el banner y fondos
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [emailBackground, setEmailBackground] = useState('#ffffff');
  const [showGradient, setShowGradient] = useState(false);
  const [gradientColors, setGradientColors] = useState(['#f6f9fc', '#e9f2ff']);

  // Añade un nuevo estado para rastrear si hay texto seleccionado
  const [hasTextSelection, setHasTextSelection] = useState(false);

  // Añadir nuevos estados para el estilo de lista
  const [listStyle, setListStyle] = useState<
    | 'disc'
    | 'circle'
    | 'square'
    | 'decimal'
    | 'lower-alpha'
    | 'upper-alpha'
    | 'lower-roman'
    | 'upper-roman'
  >('disc');
  const [listColor, setListColor] = useState('#000000');

  // Estado para el selector de iconos
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Estados para paneles redimensionables
  const [leftPanelWidth, setLeftPanelWidth] = useState(320); // Ancho inicial
  const [rightPanelWidth, setRightPanelWidth] = useState(320); // Ancho inicial
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // Configuración de límites para los paneles
  const MIN_PANEL_WIDTH = 280;
  const MAX_PANEL_WIDTH = 500;

  // Estado para la sincronización automática
  const [syncEnabled, setSyncEnabled] = useState<boolean>(false);
  const [lastSyncedVersion, setLastSyncedVersion] = useState<'newsletter' | 'web' | null>(null);

  // Estados para el diseño del borde del contenedor principal
  const [isContainerSelected, setIsContainerSelected] = useState(false);
  const [containerBorderWidth, setContainerBorderWidth] = useState(1);
  const [containerBorderColor, setContainerBorderColor] = useState('#e0e0e0');
  const [containerBorderRadius, setContainerBorderRadius] = useState(12);
  const [containerPadding, setContainerPadding] = useState(10);
  const [containerMaxWidth, setContainerMaxWidth] = useState(560);

  // PostStore integration
  const { create: createPost, update: updatePost } = usePostStore();

  // Hook para cargar post específico si es edición
  const { loading: loadingPost, post: currentPost } = usePost(currentNoteId);

  // Obtener los componentes activos según la plantilla seleccionada y la versión activa
  const getActiveComponents = () => {
    if (activeVersion === 'newsletter') {
      switch (activeTemplate) {
        case 'blank':
          return blankComponentsState;
        case 'notion':
          return notionComponentsState;
        case 'plaid':
          return plaidComponentsState;
        case 'stripe':
          return stripeComponentsState;
        case 'vercel':
          return vercelComponentsState;
        case 'news':
          return newsComponentsState;
        default:
          return blankComponentsState; // Por defecto, usar la plantilla vacía
      }
    } else {
      switch (activeTemplate) {
        case 'blank':
          return blankComponentsWebState;
        case 'notion':
          return notionComponentsWebState;
        case 'plaid':
          return plaidComponentsWebState;
        case 'stripe':
          return stripeComponentsWebState;
        case 'vercel':
          return vercelComponentsWebState;
        case 'news':
          return newsComponentsWebState;
        default:
          return blankComponentsWebState; // Por defecto, usar la plantilla vacía
      }
    }
  };

  // Actualizar los componentes activos según la versión
  const updateActiveComponents = (components: EmailComponent[]) => {
    if (activeVersion === 'web') {
      // Actualizar componentes de la versión web
      switch (activeTemplate) {
        case 'blank':
          setBlankComponentsWeb(components);
          break;
        case 'news':
          setNewsComponentsWeb(components);
          break;
        case 'notion':
          setNotionComponentsWeb(components);
          break;
        case 'plaid':
          setPlaidComponentsWeb(components);
          break;
        case 'stripe':
          setStripeComponentsWeb(components);
          break;
        case 'vercel':
          setVercelComponentsWeb(components);
          break;
        default:
          break;
      }
    } else {
      // Actualizar componentes de la versión newsletter
      switch (activeTemplate) {
        case 'blank':
          setBlankComponents(components);
          break;
        case 'news':
          setNewsComponents(components);
          break;
        case 'notion':
          setNotionComponents(components);
          break;
        case 'plaid':
          setPlaidComponents(components);
          break;
        case 'stripe':
          setStripeComponents(components);
          break;
        case 'vercel':
          setVercelComponents(components);
          break;
        default:
          break;
      }
    }
  };

  // ⚡ Optimización: Actualizar el contenido de un componente con sincronización
  const updateComponentContent = useCallback(
    (id: string, content: string) => {
      const components = getActiveComponents();

      // Solo actualizar si el contenido realmente cambió
      const currentComponent = components.find((comp) => comp.id === id);
      if (currentComponent && currentComponent.content === content) {
        return; // No hay cambios, evitar re-render
      }

      const updatedComponents = components.map((component) =>
        component.id === id ? { ...component, content } : component
      );
      updateActiveComponents(updatedComponents);

      // Si la sincronización automática está activa, actualizar también en la otra versión
      if (syncEnabled) {
        const otherVersion = activeVersion === 'newsletter' ? 'web' : 'newsletter';
        const suffix = id.endsWith('-web') ? '-web' : '';
        const baseId = suffix ? id.slice(0, -suffix.length) : id;
        const otherVersionId = otherVersion === 'web' ? `${baseId}-web` : baseId;

        // Obtener componentes de la otra versión
        const otherVersionComponents = getOtherVersionComponents(otherVersion);

        // Verificar si el componente existe en la otra versión
        const componentExists = otherVersionComponents.some((comp) => comp.id === otherVersionId);

        if (componentExists) {
          // Actualizar el componente correspondiente en la otra versión
          const updatedOtherVersionComponents = otherVersionComponents.map((component) =>
            component.id === otherVersionId ? { ...component, content } : component
          );

          // Guardar los componentes actualizados
          updateOtherVersionComponents(otherVersion, updatedOtherVersionComponents);

          // Mostrar notificación sutil
          showSyncNotification(activeVersion, otherVersion);
        }
        // Importante: No creamos nuevos componentes en la otra versión si no existen
      }
    },
    [getActiveComponents, updateActiveComponents, syncEnabled, activeVersion]
  );

  // Actualizar las propiedades de un componente con sincronización
  const updateComponentProps = (id: string, props: Record<string, any>) => {
    const components = getActiveComponents();
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, props: { ...component.props, ...props } } : component
    );
    updateActiveComponents(updatedComponents);

    // Si la sincronización automática está activa, actualizar también en la otra versión
    if (syncEnabled) {
      const otherVersion = activeVersion === 'newsletter' ? 'web' : 'newsletter';
      const suffix = id.endsWith('-web') ? '-web' : '';
      const baseId = suffix ? id.slice(0, -suffix.length) : id;
      const otherVersionId = otherVersion === 'web' ? `${baseId}-web` : baseId;

      // Obtener componentes de la otra versión
      const otherVersionComponents = getOtherVersionComponents(otherVersion);

      // Verificar si el componente existe en la otra versión
      const componentExists = otherVersionComponents.some((comp) => comp.id === otherVersionId);

      if (componentExists) {
        // Preservar las propiedades existentes y actualizar solo las nuevas
        const updatedOtherVersionComponents = otherVersionComponents.map((component) =>
          component.id === otherVersionId
            ? { ...component, props: { ...component.props, ...props } }
            : component
        );

        // Guardar los componentes actualizados
        updateOtherVersionComponents(otherVersion, updatedOtherVersionComponents);

        // Mostrar notificación sutil
        showSyncNotification(activeVersion, otherVersion);
      }
      // Importante: No creamos nuevos componentes en la otra versión si no existen
    }
  };

  // Actualizar el estilo de un componente con sincronización
  const updateComponentStyle = (id: string, style: React.CSSProperties) => {
    const components = getActiveComponents();
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, style: { ...component.style, ...style } } : component
    );
    updateActiveComponents(updatedComponents);

    // Si la sincronización automática está activa, actualizar también en la otra versión
    if (syncEnabled) {
      const otherVersion = activeVersion === 'newsletter' ? 'web' : 'newsletter';
      const suffix = id.endsWith('-web') ? '-web' : '';
      const baseId = suffix ? id.slice(0, -suffix.length) : id;
      const otherVersionId = otherVersion === 'web' ? `${baseId}-web` : baseId;

      // Obtener componentes de la otra versión
      const otherVersionComponents = getOtherVersionComponents(otherVersion);

      // Verificar si el componente existe en la otra versión
      const componentExists = otherVersionComponents.some((comp) => comp.id === otherVersionId);

      if (componentExists) {
        // Preservar los estilos existentes y actualizar solo los nuevos
        const updatedOtherVersionComponents = otherVersionComponents.map((component) =>
          component.id === otherVersionId
            ? { ...component, style: { ...component.style, ...style } }
            : component
        );

        // Guardar los componentes actualizados
        updateOtherVersionComponents(otherVersion, updatedOtherVersionComponents);

        // Mostrar notificación sutil
        showSyncNotification(activeVersion, otherVersion);
      }
      // Importante: No creamos nuevos componentes en la otra versión si no existen
    }
  };

  // Actualizar la función addComponent para incluir propiedades de lista
  const addComponent = (type: ComponentType) => {
    const components = getActiveComponents();
    const suffix = activeVersion === 'web' ? '-web' : '';
    const newComponent: EmailComponent = {
      id: `${type}-${Date.now()}${suffix}`,
      type,
      content:
        type === 'heading'
          ? 'New Heading'
          : type === 'paragraph'
            ? 'New paragraph text'
            : type === 'button'
              ? 'Button Text'
              : type === 'bulletList'
                ? 'List item'
                : type === 'category'
                  ? 'Categoría'
                  : type === 'author'
                    ? 'Autor'
                    : type === 'summary'
                      ? 'Resumen de la noticia'
                      : type === 'tituloConIcono'
                        ? 'Título con Icono'
                        : type === 'respaldadoPor'
                          ? 'Respaldado por texto'
                          : '',
      props:
        type === 'heading'
          ? { level: 2 }
          : type === 'button'
            ? { variant: 'contained', color: 'primary' }
            : type === 'image'
              ? { src: 'https://via.placeholder.com/600x400', alt: 'Placeholder image' }
              : type === 'bulletList'
                ? { items: ['List item 1'], listStyle: 'disc', listColor: '#000000' }
                : type === 'tituloConIcono'
                  ? {
                      icon: 'mdi:newspaper-variant-outline',
                      gradientColor1: '#4facfe',
                      gradientColor2: '#00f2fe',
                      gradientType: 'linear',
                      textColor: '#ffffff',
                    }
                  : type === 'respaldadoPor'
                    ? {
                        texto: 'Respaldado por',
                        nombre: 'Redacción',
                        avatarUrl: '/default-avatar.png',
                        avatarTamano: 36,
                      }
                    : {},
      style:
        type === 'button'
          ? {
              backgroundColor: '#3f51b5',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }
          : type === 'bulletList'
            ? {
                listStyleType: 'disc',
                color: '#000000',
                marginLeft: '20px',
              }
            : {},
    };

    // Actualizar los componentes activos con el nuevo componente
    updateActiveComponents([...components, newComponent]);
    setSelectedComponentId(newComponent.id);

    // Scroll al nuevo componente
    setTimeout(() => {
      if (editorRef.current) {
        try {
          editorRef.current.scrollTop = editorRef.current.scrollHeight;
        } catch (error) {
          console.error('Error al hacer scroll:', error);
        }
      }
    }, 100);
  };

  // Eliminar un componente
  const removeComponent = (id: string) => {
    const components = getActiveComponents();
    const updatedComponents = components.filter((component) => component.id !== id);
    updateActiveComponents(updatedComponents);
    setSelectedComponentId(null);
  };

  // Mover un componente hacia arriba o abajo
  const moveComponent = (id: string, direction: 'up' | 'down') => {
    const components = getActiveComponents();
    const index = components.findIndex((component) => component.id === id);

    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === components.length - 1) return;

    const newComponents = [...components];
    const component = newComponents[index];

    if (direction === 'up') {
      newComponents[index] = newComponents[index - 1];
      newComponents[index - 1] = component;
    } else {
      newComponents[index] = newComponents[index + 1];
      newComponents[index + 1] = component;
    }

    updateActiveComponents(newComponents);
  };

  // Función para cambiar entre versiones (newsletter y web)
  const handleVersionChange = (newVersion: 'newsletter' | 'web') => {
    // Si la sincronización está activada, sincronizar contenido antes de cambiar
    if (syncEnabled && activeVersion !== newVersion) {
      syncContent(activeVersion, newVersion);
      setLastSyncedVersion(activeVersion);
    }

    setActiveVersion(newVersion);
    setSelectedComponentId(null); // Deseleccionar componente al cambiar de versión
  };

  // Función para activar/desactivar la sincronización
  const toggleSync = () => {
    // Si se está activando la sincronización, sincronizar contenido actual
    if (!syncEnabled) {
      setSnackbarMessage('Sincronización automática activada');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage('Sincronización automática desactivada');
      setSnackbarSeverity('info');
      setOpenSnackbar(true);
    }

    setSyncEnabled(!syncEnabled);
  };

  // Función para sincronizar contenido entre versiones
  const syncContent = (
    sourceVersion: 'newsletter' | 'web',
    targetVersion: 'newsletter' | 'web'
  ) => {
    let sourceComponents: EmailComponent[] = [];
    let targetComponents: EmailComponent[] = [];

    // Obtener componentes de origen según la versión
    if (sourceVersion === 'newsletter') {
      switch (activeTemplate) {
        case 'blank':
          sourceComponents = [...blankComponentsState];
          break;
        case 'news':
          sourceComponents = [...newsComponentsState];
          break;
        case 'notion':
          sourceComponents = [...notionComponentsState];
          break;
        case 'plaid':
          sourceComponents = [...plaidComponentsState];
          break;
        case 'stripe':
          sourceComponents = [...stripeComponentsState];
          break;
        case 'vercel':
          sourceComponents = [...vercelComponentsState];
          break;
        default:
          sourceComponents = [...blankComponentsState];
      }
    } else {
      switch (activeTemplate) {
        case 'blank':
          sourceComponents = [...blankComponentsWebState];
          break;
        case 'news':
          sourceComponents = [...newsComponentsWebState];
          break;
        case 'notion':
          sourceComponents = [...notionComponentsWebState];
          break;
        case 'plaid':
          sourceComponents = [...plaidComponentsWebState];
          break;
        case 'stripe':
          sourceComponents = [...stripeComponentsWebState];
          break;
        case 'vercel':
          sourceComponents = [...vercelComponentsWebState];
          break;
        default:
          sourceComponents = [...blankComponentsWebState];
      }
    }

    // Obtener componentes de destino según la versión
    if (targetVersion === 'newsletter') {
      switch (activeTemplate) {
        case 'blank':
          targetComponents = [...blankComponentsState];
          break;
        case 'news':
          targetComponents = [...newsComponentsState];
          break;
        case 'notion':
          targetComponents = [...notionComponentsState];
          break;
        case 'plaid':
          targetComponents = [...plaidComponentsState];
          break;
        case 'stripe':
          targetComponents = [...stripeComponentsState];
          break;
        case 'vercel':
          targetComponents = [...vercelComponentsState];
          break;
        default:
          targetComponents = [...blankComponentsState];
      }
    } else {
      switch (activeTemplate) {
        case 'blank':
          targetComponents = [...blankComponentsWebState];
          break;
        case 'news':
          targetComponents = [...newsComponentsWebState];
          break;
        case 'notion':
          targetComponents = [...notionComponentsWebState];
          break;
        case 'plaid':
          targetComponents = [...plaidComponentsWebState];
          break;
        case 'stripe':
          targetComponents = [...stripeComponentsWebState];
          break;
        case 'vercel':
          targetComponents = [...vercelComponentsWebState];
          break;
        default:
          targetComponents = [...blankComponentsWebState];
      }
    }

    // Si no hay componentes en el origen, mostrar mensaje y salir
    if (sourceComponents.length === 0) {
      setSnackbarMessage(
        `No hay contenido en ${sourceVersion === 'newsletter' ? 'Newsletter' : 'Web'} para transferir`
      );
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    // Iterar sobre los componentes de destino existentes y actualizar sus valores
    // con los componentes correspondientes del origen, manteniendo la estructura y posición
    const updatedTargetComponents = targetComponents.map((targetComponent) => {
      // Obtener sufijo correcto para buscar el componente equivalente
      const targetSuffix = targetVersion === 'web' ? '-web' : '';
      const sourceSuffix = sourceVersion === 'web' ? '-web' : '';

      // Extraer el ID base (sin sufijo)
      let baseId = targetComponent.id;
      if (baseId.endsWith(targetSuffix)) {
        baseId = baseId.substring(0, baseId.length - targetSuffix.length);
      }

      // Crear el ID equivalente en el origen
      const sourceId = baseId + sourceSuffix;

      // Buscar el componente correspondiente en el origen
      const sourceComponent = sourceComponents.find(
        (comp) =>
          comp.id === sourceId || // Buscar por ID exacto
          // O buscar por ID base si los sufijos no coinciden
          (comp.id.endsWith(sourceSuffix) &&
            comp.id.substring(0, comp.id.length - sourceSuffix.length) === baseId)
      );

      // Si existe el componente en el origen, actualizar valores pero mantener ID y posición
      if (sourceComponent) {
        return {
          ...targetComponent,
          content: sourceComponent.content,
          props: { ...targetComponent.props, ...sourceComponent.props },
          style: { ...targetComponent.style, ...sourceComponent.style },
        };
      }

      // Si no existe, mantener el componente de destino sin cambios
      return targetComponent;
    });

    // Actualizar los componentes de destino (manteniendo la estructura)
    if (targetVersion === 'web') {
      switch (activeTemplate) {
        case 'blank':
          setBlankComponentsWeb(updatedTargetComponents);
          break;
        case 'news':
          setNewsComponentsWeb(updatedTargetComponents);
          break;
        case 'notion':
          setNotionComponentsWeb(updatedTargetComponents);
          break;
        case 'plaid':
          setPlaidComponentsWeb(updatedTargetComponents);
          break;
        case 'stripe':
          setStripeComponentsWeb(updatedTargetComponents);
          break;
        case 'vercel':
          setVercelComponentsWeb(updatedTargetComponents);
          break;
        default:
          break;
      }
    } else {
      switch (activeTemplate) {
        case 'blank':
          setBlankComponents(updatedTargetComponents);
          break;
        case 'news':
          setNewsComponents(updatedTargetComponents);
          break;
        case 'notion':
          setNotionComponents(updatedTargetComponents);
          break;
        case 'plaid':
          setPlaidComponents(updatedTargetComponents);
          break;
        case 'stripe':
          setStripeComponents(updatedTargetComponents);
          break;
        case 'vercel':
          setVercelComponents(updatedTargetComponents);
          break;
        default:
          break;
      }
    }

    setSnackbarMessage(
      `Valores sincronizados de ${sourceVersion === 'newsletter' ? 'Newsletter' : 'Web'} a ${targetVersion === 'newsletter' ? 'Newsletter' : 'Web'}`
    );
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  // Función para transferir contenido de Newsletter a Web
  const transferToWeb = () => {
    syncContent('newsletter', 'web');
    setSnackbarMessage(
      'Valores transferidos de Newsletter a Web (solo actualiza componentes existentes)'
    );
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  // Función para transferir contenido de Web a Newsletter
  const transferToNewsletter = () => {
    syncContent('web', 'newsletter');
    setSnackbarMessage(
      'Valores transferidos de Web a Newsletter (solo actualiza componentes existentes)'
    );
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  // Funciones para el redimensionado de paneles
  const handleMouseDownLeft = () => {
    setIsResizingLeft(true);
  };

  const handleMouseDownRight = () => {
    setIsResizingRight(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.min(Math.max(e.clientX, MIN_PANEL_WIDTH), MAX_PANEL_WIDTH);
        setLeftPanelWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.min(
          Math.max(window.innerWidth - e.clientX, MIN_PANEL_WIDTH),
          MAX_PANEL_WIDTH
        );
        setRightPanelWidth(newWidth);
      }
    },
    [isResizingLeft, isResizingRight, MIN_PANEL_WIDTH, MAX_PANEL_WIDTH]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizingLeft(false);
    setIsResizingRight(false);
  }, []);

  // Effect para manejar eventos globales de mouse
  useEffect(() => {
    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
    return undefined;
  }, [isResizingLeft, isResizingRight, handleMouseMove, handleMouseUp]);

  // Función de utilidad para mostrar una notificación de sincronización
  const showSyncNotification = (
    fromVersion: 'newsletter' | 'web',
    toVersion: 'newsletter' | 'web'
  ) => {
    // Si ya hay una notificación abierta, no mostrar otra para evitar spam
    if (openSnackbar) return;

    setSnackbarMessage(
      `Valores sincronizados de ${fromVersion === 'newsletter' ? 'Newsletter' : 'Web'} a ${toVersion === 'newsletter' ? 'Newsletter' : 'Web'}`
    );
    setSnackbarSeverity('info');
    setOpenSnackbar(true);

    // Ocultar automáticamente después de 1.5 segundos
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 1500);
  };

  // Función de utilidad para obtener los componentes de la otra versión
  const getOtherVersionComponents = (otherVersion: 'newsletter' | 'web'): EmailComponent[] => {
    if (otherVersion === 'web') {
      switch (activeTemplate) {
        case 'blank':
          return [...blankComponentsWebState];
        case 'news':
          return [...newsComponentsWebState];
        case 'notion':
          return [...notionComponentsWebState];
        case 'plaid':
          return [...plaidComponentsWebState];
        case 'stripe':
          return [...stripeComponentsWebState];
        case 'vercel':
          return [...vercelComponentsWebState];
        default:
          return [...blankComponentsWebState];
      }
    } else {
      switch (activeTemplate) {
        case 'blank':
          return [...blankComponentsState];
        case 'news':
          return [...newsComponentsState];
        case 'notion':
          return [...notionComponentsState];
        case 'plaid':
          return [...plaidComponentsState];
        case 'stripe':
          return [...stripeComponentsState];
        case 'vercel':
          return [...vercelComponentsState];
        default:
          return [...blankComponentsState];
      }
    }
  };

  // Función de utilidad para actualizar los componentes de la otra versión
  const updateOtherVersionComponents = (
    otherVersion: 'newsletter' | 'web',
    components: EmailComponent[]
  ) => {
    if (otherVersion === 'web') {
      switch (activeTemplate) {
        case 'blank':
          setBlankComponentsWeb(components);
          break;
        case 'news':
          setNewsComponentsWeb(components);
          break;
        case 'notion':
          setNotionComponentsWeb(components);
          break;
        case 'plaid':
          setPlaidComponentsWeb(components);
          break;
        case 'stripe':
          setStripeComponentsWeb(components);
          break;
        case 'vercel':
          setVercelComponentsWeb(components);
          break;
        default:
          break;
      }
    } else {
      switch (activeTemplate) {
        case 'blank':
          setBlankComponents(components);
          break;
        case 'news':
          setNewsComponents(components);
          break;
        case 'notion':
          setNotionComponents(components);
          break;
        case 'plaid':
          setPlaidComponents(components);
          break;
        case 'stripe':
          setStripeComponents(components);
          break;
        case 'vercel':
          setVercelComponents(components);
          break;
        default:
          break;
      }
    }
  };

  // Efecto para sincronizar contenido cuando se activa la sincronización
  useEffect(() => {
    if (syncEnabled && lastSyncedVersion !== activeVersion) {
      // Cuando el usuario cambia un componente en la versión activa, actualizar la otra versión
      const otherVersion = activeVersion === 'newsletter' ? 'web' : 'newsletter';
      syncContent(activeVersion, otherVersion);
      setLastSyncedVersion(activeVersion);
    }
  }, [
    syncEnabled,
    activeVersion,
    lastSyncedVersion,
    blankComponentsState,
    blankComponentsWebState,
    newsComponentsState,
    newsComponentsWebState,
    notionComponentsState,
    notionComponentsWebState,
    plaidComponentsState,
    plaidComponentsWebState,
    stripeComponentsState,
    stripeComponentsWebState,
    vercelComponentsState,
    vercelComponentsWebState,
  ]);

  // Add this function to handle saving notes
  const handleSaveNote = async () => {
    try {
      // Validaciones
      if (!noteTitle.trim()) {
        setSnackbarMessage('El título es obligatorio');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      // Obtener componentes según la plantilla activa
      let objdata = notionComponentsState;
      let objdataWeb = notionComponentsWebState;

      switch (activeTemplate) {
        case 'news':
          objdata = newsComponentsState;
          objdataWeb = newsComponentsWebState;
          break;
        case 'notion':
          objdata = notionComponentsState;
          objdataWeb = notionComponentsWebState;
          break;
        case 'plaid':
          objdata = plaidComponentsState;
          objdataWeb = plaidComponentsWebState;
          break;
        case 'stripe':
          objdata = stripeComponentsState;
          objdataWeb = stripeComponentsWebState;
          break;
        case 'vercel':
          objdata = vercelComponentsState;
          objdataWeb = vercelComponentsWebState;
          break;
        case 'blank':
          objdata = blankComponentsState;
          objdataWeb = blankComponentsWebState;
          break;
        default:
          break;
      }

      // 🔍 NUEVA VALIDACIÓN: Verificar que todas las imágenes estén subidas a S3
      const objDataString = JSON.stringify(objdata);
      const objDataWebString = JSON.stringify(objdataWeb);

      const imageValidation = validateAllImagesUploaded(objDataString, objDataWebString);

      if (!imageValidation.isValid) {
        const imageStats = getImageStats(objDataString, objDataWebString);
        setSnackbarMessage(
          `⚠️ Hay ${imageStats.pending} imagen(es) sin subir a S3. Sube todas las imágenes antes de guardar.`
        );
        setSnackbarSeverity('warning');
        setOpenSnackbar(true);

        // Log detallado para debugging
        console.log('🚫 Guardado bloqueado por imágenes pendientes:');
        console.log('📊 Estadísticas de imágenes:', imageStats);
        console.log('🔗 URLs pendientes:', imageValidation.pendingImages);
        return;
      }

      // Crear objeto de configuración
      const configPostObject = {
        templateType: activeTemplate,
        dateCreated: currentNoteId ? '' : new Date().toISOString(),
        dateModified: new Date().toISOString(),
        emailBackground,
        selectedBanner,
        showGradient,
        gradientColors,
        activeVersion,
        containerBorderWidth,
        containerBorderColor,
        containerBorderRadius,
        containerPadding,
        containerMaxWidth,
      };

      // Preparar datos para el POST/PATCH
      const postData = {
        title: noteTitle.trim(),
        description: noteDescription || '',
        coverImageUrl: noteCoverImageUrl || '',
        objData: objDataString,
        objDataWeb: objDataWebString,
        configPost: JSON.stringify(configPostObject),
        origin: 'ADAC',
        highlight: false,
      };

      let result;

      if (isEditingExistingNote && currentNoteId) {
        // Actualizar post existente
        result = await updatePost(currentNoteId, postData);
      } else {
        // Crear nuevo post
        result = await createPost(postData);
        if (result) {
          setCurrentNoteId(result.id);
          setIsEditingExistingNote(true);
        }
      }

      if (result) {
        // Log de éxito con estadísticas de imágenes
        const finalImageStats = getImageStats(objDataString, objDataWebString);
        console.log('✅ Nota guardada exitosamente');
        console.log('📊 Imágenes en la nota:', finalImageStats);

        // Show success message
        const successMessage =
          finalImageStats.total > 0
            ? `Nota ${isEditingExistingNote ? 'actualizada' : 'guardada'} correctamente con ${finalImageStats.total} imagen(es) en S3`
            : `Nota ${isEditingExistingNote ? 'actualizada' : 'guardada'} correctamente`;

        setSnackbarMessage(successMessage);
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setOpenSaveDialog(false);
      } else {
        throw new Error('No se pudo guardar la nota');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setSnackbarMessage('Error al guardar la nota');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // Add this function to load an existing note
  const loadNote = (note: SavedNote) => {
    // Set the note ID
    setCurrentNoteId(note.id);
    setIsEditingExistingNote(true);

    // Parse the configNote JSON string
    const configNote = JSON.parse(note.configNote);

    // Parse the objData JSON strings
    const objDataParsed = JSON.parse(note.objData);
    const objDataWebParsed = note.objDataWeb ? JSON.parse(note.objDataWeb) : null;

    // Set the template type
    setActiveTemplate(configNote.templateType || 'notion');

    // Set active version if available
    if (configNote.activeVersion) {
      setActiveVersion(configNote.activeVersion);
    }

    // Load the components for newsletter version
    switch (configNote.templateType) {
      case 'blank':
        setBlankComponents(objDataParsed);
        if (objDataWebParsed) setBlankComponentsWeb(objDataWebParsed);
        break;
      case 'news':
        setNewsComponents(objDataParsed);
        if (objDataWebParsed) setNewsComponentsWeb(objDataWebParsed);
        break;
      case 'notion':
        setNotionComponents(objDataParsed);
        if (objDataWebParsed) setNotionComponentsWeb(objDataWebParsed);
        break;
      case 'plaid':
        setPlaidComponents(objDataParsed);
        if (objDataWebParsed) setPlaidComponentsWeb(objDataWebParsed);
        break;
      case 'stripe':
        setStripeComponents(objDataParsed);
        if (objDataWebParsed) setStripeComponentsWeb(objDataWebParsed);
        break;
      case 'vercel':
        setVercelComponents(objDataParsed);
        if (objDataWebParsed) setVercelComponentsWeb(objDataWebParsed);
        break;
      default:
        // Default to notion if template type is unknown
        setNotionComponents(objDataParsed);
        if (objDataWebParsed) setNotionComponentsWeb(objDataWebParsed);
        setActiveTemplate('notion');
    }

    // Set background settings
    setEmailBackground(configNote.emailBackground || '#ffffff');
    setSelectedBanner(configNote.selectedBanner || null);
    setShowGradient(configNote.showGradient || false);
    setGradientColors(configNote.gradientColors || ['#f6f9fc', '#e9f2ff']);

    // Set container settings
    setContainerBorderWidth(configNote.containerBorderWidth ?? 1);
    setContainerBorderColor(configNote.containerBorderColor ?? '#e0e0e0');
    setContainerBorderRadius(configNote.containerBorderRadius ?? 12);
    setContainerPadding(configNote.containerPadding ?? 10);
    setContainerMaxWidth(configNote.containerMaxWidth ?? 560);
  };

  // Cargar la nota inicial si existe
  useEffect(() => {
    if (initialNote && initialNote.id) {
      // Si tenemos una nota inicial, configurar para edición y cargar por ID
      setCurrentNoteId(initialNote.id);
      setIsEditingExistingNote(true);
      setNoteTitle(initialNote.title || '');

      // Si es una nota legacy (SavedNote), cargar de la forma anterior
      if (initialNote.configNote) {
        loadNote(initialNote);
      }
      // Si es desde el PostStore, el useEffect de currentPost se encargará de cargarla
    }
  }, [initialNote]);

  // ⚡ Optimización: handleSelectionUpdate con debouncing y optimizaciones
  const handleSelectionUpdate = useCallback(
    (editor: Editor) => {
      // Usar requestAnimationFrame para diferir actualizaciones pesadas
      requestAnimationFrame(() => {
        setActiveEditor(editor);

        // Verificar si hay texto seleccionado
        const { from, to } = editor.state.selection;
        const hasSelection = from !== to;
        setHasTextSelection(hasSelection);

        // Solo actualizar formatos si hay cambios significativos
        if (editor) {
          const newFormats = [];
          if (editor.isActive('bold')) newFormats.push('bold');
          if (editor.isActive('italic')) newFormats.push('italic');
          if (editor.isActive('underline')) newFormats.push('underlined');
          if (editor.isActive('strike')) newFormats.push('strikethrough');

          // Solo actualizar si hay cambios
          setTextFormat((prevFormats) => {
            if (JSON.stringify(prevFormats) !== JSON.stringify(newFormats)) {
              return newFormats;
            }
            return prevFormats;
          });

          // Actualizar alineación solo si cambió
          let newAlignment = 'left';
          if (editor.isActive({ textAlign: 'center' })) newAlignment = 'center';
          else if (editor.isActive({ textAlign: 'right' })) newAlignment = 'right';
          else if (editor.isActive({ textAlign: 'justify' })) newAlignment = 'justify';

          setSelectedAlignment((prevAlignment) => {
            if (prevAlignment !== newAlignment) {
              return newAlignment;
            }
            return prevAlignment;
          });

          // Actualizar atributos de texto de forma optimizada
          const marks = editor.getAttributes('textStyle');
          if (marks.color) {
            setSelectedColor((prevColor) => {
              if (prevColor !== marks.color) {
                return marks.color;
              }
              return prevColor;
            });
          }

          if (marks.fontFamily) {
            setSelectedFont((prevFont) => {
              if (prevFont !== marks.fontFamily) {
                return marks.fontFamily;
              }
              return prevFont;
            });
          }

          if (marks.fontWeight) {
            setSelectedFontWeight((prevWeight) => {
              if (prevWeight !== marks.fontWeight) {
                return marks.fontWeight;
              }
              return prevWeight;
            });
          }
        }
      });
    },
    [selectedComponentId, getActiveComponents]
  );

  // Aplicar formato al texto seleccionado
  const applyTextFormat = (format: string) => {
    if (!activeEditor) return;

    // Crear una copia del array actual de formatos
    const newFormats = [...textFormat];

    switch (format) {
      case 'bold':
        activeEditor.chain().focus().toggleBold().run();
        // Actualizar el estado inmediatamente
        if (activeEditor.isActive('bold')) {
          if (!newFormats.includes('bold')) newFormats.push('bold');
        } else {
          const index = newFormats.indexOf('bold');
          if (index > -1) newFormats.splice(index, 1);
        }
        break;
      case 'italic':
        activeEditor.chain().focus().toggleItalic().run();
        if (activeEditor.isActive('italic')) {
          if (!newFormats.includes('italic')) newFormats.push('italic');
        } else {
          const index = newFormats.indexOf('italic');
          if (index > -1) newFormats.splice(index, 1);
        }
        break;
      case 'underlined':
        activeEditor.chain().focus().toggleUnderline().run();
        if (activeEditor.isActive('underline')) {
          if (!newFormats.includes('underlined')) newFormats.push('underlined');
        } else {
          const index = newFormats.indexOf('underlined');
          if (index > -1) newFormats.splice(index, 1);
        }
        break;
      case 'strikethrough':
        activeEditor.chain().focus().toggleStrike().run();
        if (activeEditor.isActive('strike')) {
          if (!newFormats.includes('strikethrough')) newFormats.push('strikethrough');
        } else {
          const index = newFormats.indexOf('strikethrough');
          if (index > -1) newFormats.splice(index, 1);
        }
        break;
      default:
        break;
    }

    // Actualizar el estado con los nuevos formatos
    setTextFormat(newFormats);
  };

  // Aplicar alineación al texto seleccionado
  const applyTextAlignment = (alignment: string) => {
    if (!activeEditor) return;
    activeEditor.chain().focus().setTextAlign(alignment).run();
    setSelectedAlignment(alignment);
  };

  // Aplicar color al texto seleccionado
  const applyTextColor = (color: string) => {
    if (!activeEditor) return;
    activeEditor.chain().focus().setColor(color).run();
  };

  // Aplicar tamaño de fuente al texto seleccionado
  const applyFontSize = (size: string) => {
    if (!activeEditor || !selectedComponentId) return;

    // Actualizar el estilo del componente
    updateComponentStyle(selectedComponentId, { fontSize: `${size}px` });
  };

  // Aplicar fuente al texto seleccionado
  const applyFontFamily = (font: string) => {
    if (!activeEditor || !selectedComponentId) return;

    // Actualizar el estilo del componente
    updateComponentStyle(selectedComponentId, { fontFamily: font });
  };

  // Función para generar el HTML del email
  const handleGenerateEmailHtml = async () => {
    setGeneratingEmail(true);
    try {
      const components = getActiveComponents();
      const html = await generateEmailHtml(
        components,
        activeTemplate,
        selectedBanner,
        bannerOptions,
        emailBackground,
        showGradient,
        gradientColors,
        containerBorderWidth,
        containerBorderColor,
        containerBorderRadius,
        containerPadding,
        containerMaxWidth
      );

      setEmailHtml(html);
      setOpenPreviewDialog(true);
    } catch (error) {
      console.error('Error generating email HTML:', error);
      setSnackbarMessage('Error generating email HTML');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setGeneratingEmail(false);
    }
  };

  // Añadir función para agregar un elemento a la lista
  const addListItem = (listId: string) => {
    const components = getActiveComponents();
    const component = components.find((comp) => comp.id === listId);

    if (component && component.type === 'bulletList') {
      const items = component.props.items || [];
      const updatedProps = {
        ...component.props,
        items: [...items, 'New list item'],
      };

      updateComponentProps(listId, updatedProps);
    }
  };

  // Añadir función para eliminar un elemento de la lista
  const removeListItem = (listId: string, itemIndex: number) => {
    const components = getActiveComponents();
    const component = components.find((comp) => comp.id === listId);

    if (component && component.type === 'bulletList') {
      const items = [...(component.props.items || [])];
      if (items.length > 1) {
        // Mantener al menos un elemento
        items.splice(itemIndex, 1);
        const updatedProps = {
          ...component.props,
          items,
        };

        updateComponentProps(listId, updatedProps);
      } else {
        // Mostrar mensaje si se intenta eliminar el último elemento
        setSnackbarMessage('La lista debe tener al menos un elemento');
        setSnackbarSeverity('info');
        setOpenSnackbar(true);
      }
    }
  };

  // Añadir función para actualizar un elemento de la lista
  const updateListItem = (listId: string, itemIndex: number, content: string) => {
    const components = getActiveComponents();
    const component = components.find((comp) => comp.id === listId);

    if (component && component.type === 'bulletList') {
      const items = [...(component.props.items || [])];
      items[itemIndex] = content;

      const updatedProps = {
        ...component.props,
        items,
      };

      updateComponentProps(listId, updatedProps);
    }
  };

  // Añadir función para cambiar el estilo de la lista
  const updateListStyle = (listId: string, listStyleType: string) => {
    // Actualizar el estilo visual del componente
    updateComponentStyle(listId, { listStyleType });

    // Actualizar las propiedades del componente
    const components = getActiveComponents();
    const component = components.find((comp) => comp.id === listId);

    if (component && component.type === 'bulletList') {
      const updatedProps = {
        ...component.props,
        listStyle: listStyleType,
      };

      updateComponentProps(listId, updatedProps);

      // Actualizar el estado global
      setListStyle(listStyleType as any);
    }
  };

  // Añadir función para cambiar el color de los bullets
  const updateListColor = (listId: string, color: string) => {
    // Actualizar el estilo visual del componente
    updateComponentStyle(listId, { color });

    // Actualizar las propiedades del componente
    const components = getActiveComponents();
    const component = components.find((comp) => comp.id === listId);

    if (component && component.type === 'bulletList') {
      const updatedProps = {
        ...component.props,
        listColor: color,
      };

      updateComponentProps(listId, updatedProps);

      // Actualizar el estado global
      setListColor(color);
    }
  };

  // Modificar la función convertTextToList para limpiar el HTML
  // Función para manejar la selección del contenedor principal
  const handleContainerSelect = () => {
    console.log('🎨 Contenedor principal seleccionado');
    setIsContainerSelected(true);
    setSelectedComponentId(null); // Deseleccionar cualquier componente
    setRightPanelTab(0); // Ir a la primera pestaña que mostrará las opciones del contenedor
  };

  // Función para manejar la selección de componentes (deselecciona el contenedor)
  const handleComponentSelect = (componentId: string | null) => {
    setSelectedComponentId(componentId);
    if (componentId) {
      setIsContainerSelected(false); // Deseleccionar el contenedor cuando se selecciona un componente
    }
  };

  const convertTextToList = (componentId: string | null, listType: 'ordered' | 'unordered') => {
    if (!componentId) return;

    const components = getActiveComponents();
    const component = components.find((comp) => comp.id === componentId);

    if (component && component.type === 'paragraph') {
      // Limpiar el contenido HTML para extraer solo el texto
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = component.content;
      const textContent = tempDiv.textContent || tempDiv.innerText || component.content;

      // Dividir el contenido por líneas para crear múltiples elementos de lista
      const listItems = textContent
        .split(/\r?\n/)
        .filter((item) => item.trim() !== '')
        .map((item) => item.trim());

      // Si no hay elementos después de dividir, usar el texto completo
      const items = listItems.length > 0 ? listItems : [textContent];

      // Crear un nuevo componente de lista con el contenido limpio
      const newListComponent: EmailComponent = {
        id: `bulletList-${Date.now()}${activeVersion === 'web' ? '-web' : ''}`,
        type: 'bulletList',
        content: '',
        props: {
          items,
          listStyle: listType === 'ordered' ? 'decimal' : 'disc',
          listColor: '#000000',
        },
        style: {
          listStyleType: listType === 'ordered' ? 'decimal' : 'disc',
          color: '#000000',
          marginLeft: '20px',
        },
      };

      // Encontrar la posición del componente actual
      const currentIndex = components.findIndex((comp) => comp.id === componentId);

      // Reemplazar el párrafo con la lista
      const updatedComponents = [...components];
      updatedComponents.splice(currentIndex, 1, newListComponent);

      // Actualizar los componentes
      updateActiveComponents(updatedComponents);

      // Seleccionar el nuevo componente
      setSelectedComponentId(newListComponent.id);

      // Actualizar los estados de estilo de lista
      setListStyle(listType === 'ordered' ? 'decimal' : 'disc');

      // Mostrar mensaje de éxito
      setSnackbarMessage('Párrafo convertido a lista');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    }
  };

  // Cargar datos del post cuando se edite una nota existente
  useEffect(() => {
    if (currentPost && isEditingExistingNote) {
      setNoteTitle(currentPost.title || '');
      setNoteDescription(currentPost.description || '');
      setNoteCoverImageUrl(currentPost.coverImageUrl || '');
      setNoteStatus(currentPost.status || 'DRAFT');

      // También cargar los datos del editor si existen
      if (currentPost.objData) {
        try {
          const objDataParsed = JSON.parse(currentPost.objData);
          const objDataWebParsed = currentPost.objDataWeb
            ? JSON.parse(currentPost.objDataWeb)
            : null;
          const configPost = currentPost.configPost ? JSON.parse(currentPost.configPost) : {};

          // Cargar los componentes según el template
          loadPostComponents(
            configPost.templateType || 'blank',
            objDataParsed,
            objDataWebParsed,
            configPost
          );
        } catch (error) {
          console.error('Error parsing post data:', error);
        }
      }
    }
  }, [currentPost, isEditingExistingNote]);

  // Función auxiliar para cargar componentes del post
  const loadPostComponents = (templateType: string, objData: any, objDataWeb: any, config: any) => {
    // Set the template type
    setActiveTemplate(templateType);

    // Set active version if available
    if (config.activeVersion) {
      setActiveVersion(config.activeVersion);
    }

    // Load the components for newsletter version
    switch (templateType) {
      case 'blank':
        setBlankComponents(objData);
        if (objDataWeb) setBlankComponentsWeb(objDataWeb);
        break;
      case 'news':
        setNewsComponents(objData);
        if (objDataWeb) setNewsComponentsWeb(objDataWeb);
        break;
      case 'notion':
        setNotionComponents(objData);
        if (objDataWeb) setNotionComponentsWeb(objDataWeb);
        break;
      case 'plaid':
        setPlaidComponents(objData);
        if (objDataWeb) setPlaidComponentsWeb(objDataWeb);
        break;
      case 'stripe':
        setStripeComponents(objData);
        if (objDataWeb) setStripeComponentsWeb(objDataWeb);
        break;
      case 'vercel':
        setVercelComponents(objData);
        if (objDataWeb) setVercelComponentsWeb(objDataWeb);
        break;
      default:
        setNotionComponents(objData);
        if (objDataWeb) setNotionComponentsWeb(objDataWeb);
        setActiveTemplate('notion');
    }

    // Set background settings
    setEmailBackground(config.emailBackground || '#ffffff');
    setSelectedBanner(config.selectedBanner || null);
    setShowGradient(config.showGradient || false);
    setGradientColors(config.gradientColors || ['#f6f9fc', '#e9f2ff']);

    // Set container settings
    setContainerBorderWidth(config.containerBorderWidth ?? 1);
    setContainerBorderColor(config.containerBorderColor ?? '#e0e0e0');
    setContainerBorderRadius(config.containerBorderRadius ?? 12);
    setContainerPadding(config.containerPadding ?? 10);
    setContainerMaxWidth(config.containerMaxWidth ?? 560);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      {/* Barra de navegación superior */}
      <EditorHeader
        onClose={onClose}
        isEditingExistingNote={isEditingExistingNote}
        initialNote={initialNote}
        activeVersion={activeVersion}
        activeTemplate={activeTemplate}
        handleVersionChange={handleVersionChange}
        openSaveDialog={() => setOpenSaveDialog(true)}
        syncEnabled={syncEnabled}
        toggleSync={toggleSync}
        transferToWeb={transferToWeb}
        transferToNewsletter={transferToNewsletter}
        noteStatus={noteStatus}
      />

      {/* Aviso de sincronización automática */}
      {syncEnabled && (
        <Box
          sx={{
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            py: 0.5,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            color: 'primary.main',
            borderBottom: '1px solid rgba(25, 118, 210, 0.15)',
          }}
        >
          <Icon icon="mdi:sync" style={{ marginRight: '0.5rem', fontSize: '1rem' }} />
          Sincronización automática activada. Solo se actualizarán los valores de componentes
          existentes manteniendo su estructura y posición.
        </Box>
      )}

      {/* Contenedor principal */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Panel izquierdo - Componentes */}
        <Box
          sx={{
            width: `${leftPanelWidth}px`,
            minWidth: `${MIN_PANEL_WIDTH}px`,
            maxWidth: `${MAX_PANEL_WIDTH}px`,
            flexShrink: 0,
            borderRight: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          <LeftPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            expandedCategories={expandedCategories}
            setExpandedCategories={setExpandedCategories}
            addComponent={addComponent}
            emailTemplates={emailTemplates}
            activeTemplate={activeTemplate}
            setActiveTemplate={setActiveTemplate}
            generatingEmail={generatingEmail}
            handleGenerateEmailHtml={handleGenerateEmailHtml}
            setOpenSaveDialog={setOpenSaveDialog}
            activeVersion={activeVersion}
            setActiveVersion={handleVersionChange}
          />

          {/* Barra de redimensionado izquierda */}
          <Box
            onMouseDown={handleMouseDownLeft}
            sx={{
              position: 'absolute',
              top: 0,
              right: -2,
              width: '4px',
              height: '100%',
              cursor: 'col-resize',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
              zIndex: 1,
            }}
          />
        </Box>

        {/* Área central - Editor de email */}
        <Box
          sx={{ flexGrow: 1, p: 3, overflow: 'auto', backgroundColor: '#f5f7fa' }}
          ref={editorRef}
        >
          {/* Visualización de los componentes del email */}
          <EmailContent
            getActiveComponents={getActiveComponents}
            selectedComponentId={selectedComponentId}
            setSelectedComponentId={handleComponentSelect}
            updateComponentContent={updateComponentContent}
            updateComponentProps={updateComponentProps}
            updateComponentStyle={updateComponentStyle}
            handleSelectionUpdate={handleSelectionUpdate}
            moveComponent={moveComponent}
            removeComponent={removeComponent}
            addComponent={addComponent}
            addListItem={addListItem}
            removeListItem={removeListItem}
            updateListItem={updateListItem}
            editMode={editMode}
            selectedBanner={selectedBanner}
            bannerOptions={bannerOptions}
            emailBackground={emailBackground}
            showGradient={showGradient}
            gradientColors={gradientColors}
            onContainerClick={handleContainerSelect}
            isContainerSelected={isContainerSelected}
            containerBorderWidth={containerBorderWidth}
            containerBorderColor={containerBorderColor}
            containerBorderRadius={containerBorderRadius}
            containerPadding={containerPadding}
            containerMaxWidth={containerMaxWidth}
            activeTemplate={activeTemplate}
            activeVersion={activeVersion}
          />
        </Box>

        {/* Panel derecho - Formato y estilo */}
        <Box
          sx={{
            width: `${rightPanelWidth}px`,
            minWidth: `${MIN_PANEL_WIDTH}px`,
            maxWidth: `${MAX_PANEL_WIDTH}px`,
            flexShrink: 0,
            borderLeft: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          {/* Barra de redimensionado derecha */}
          <Box
            onMouseDown={handleMouseDownRight}
            sx={{
              position: 'absolute',
              top: 0,
              left: -2,
              width: '4px',
              height: '100%',
              cursor: 'col-resize',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
              zIndex: 1,
            }}
          />

          <RightPanel
            selectedComponentId={selectedComponentId}
            rightPanelTab={rightPanelTab}
            setRightPanelTab={setRightPanelTab}
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
            noteTitle={noteTitle}
            setNoteTitle={setNoteTitle}
            noteDescription={noteDescription}
            setNoteDescription={setNoteDescription}
            noteCoverImageUrl={noteCoverImageUrl}
            setNoteCoverImageUrl={setNoteCoverImageUrl}
            noteStatus={noteStatus}
            setNoteStatus={setNoteStatus}
          />
        </Box>
      </Box>

      {/* Diálogo de vista previa */}
      <CustomDialog
        open={openPreviewDialog}
        onClose={() => setOpenPreviewDialog(false)}
        title="Vista previa del email"
        actions={
          <>
            <Button onClick={() => setOpenPreviewDialog(false)} color="primary">
              Cerrar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(emailHtml);
                setSnackbarMessage('HTML copiado al portapapeles');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
              }}
            >
              Copiar HTML
            </Button>
          </>
        }
      >
        <iframe
          srcDoc={emailHtml}
          title="Email Preview"
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        />
      </CustomDialog>

      {/* Snackbar para mensajes */}
      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setOpenSnackbar(false)}
      />

      {/* Save note dialog */}
      <SaveNoteDialog
        open={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        onSave={handleSaveNote}
        noteTitle={noteTitle}
        noteDescription={noteDescription}
        noteCoverImageUrl={noteCoverImageUrl}
        imageStats={getImageStats(
          JSON.stringify(getActiveComponents()),
          JSON.stringify(
            activeVersion === 'newsletter'
              ? getActiveComponents()
              : getOtherVersionComponents('web')
          )
        )}
      />

      {/* IconPicker dialog */}
      {selectedComponentId && (
        <IconPicker
          open={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          onSelectIcon={(iconName) => {
            const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
            if (component && component.type === 'summary') {
              updateComponentProps(selectedComponentId, { icon: iconName });
            }
            setShowIconPicker(false);
          }}
          currentIcon={
            getActiveComponents().find((comp) => comp.id === selectedComponentId)?.props?.icon ||
            'mdi:text-box-outline'
          }
        />
      )}
    </Box>
  );
};

export default EmailEditorMain;
