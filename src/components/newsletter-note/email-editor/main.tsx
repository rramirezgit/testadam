'use client';

import type React from 'react';
import type { PostStatus } from 'src/store/PostStore';
import type { SavedNote, EmailComponent } from 'src/types/saved-note';

import { useRef, useState, useEffect, useCallback } from 'react';

import { Box, Button } from '@mui/material';

import { usePost } from 'src/hooks/use-posts';

import usePostStore from 'src/store/PostStore';

import LeftPanel from './left-panel';
import RightPanel from './right-panel';
import IconPicker from './icon-picker';
import EditorHeader from './editor-header';
import EmailContent from './email-content';
import { CustomDialog } from './ui/custom-dialog';
import { useNoteData } from './hooks/useNoteData';
import NewsletterConfig from './newsletter-config';
import { CustomSnackbar } from './ui/custom-snackbar';
import { bannerOptions } from './data/banner-options';
import { emailTemplates } from './data/email-templates';
import { useVersionSync } from './hooks/useVersionSync';
import { type AutoSaveData } from './hooks/useAutoSave';
import { SaveNoteDialog } from './components/SaveNoteDialog';
import { useTextFormatting } from './hooks/useTextFormatting';
import { useEmailComponents } from './hooks/useEmailComponents';
import { useResizablePanels } from './hooks/useResizablePanels';
import { UnsavedChangesDialog } from './components/UnsavedChangesDialog';
import { getImageStats, validateAllImagesUploaded } from './utils/imageValidation';
import { generateNewsletterHtml, generateSingleNoteHtml } from '../newsletter-html-generator';
import {
  createNewComponent,
  addComponentToArray,
  moveComponentInArray,
  updateComponentInArray,
  removeComponentFromArray,
  updateComponentInArrayRecursive, // <-- importar la nueva función recursiva
  convertTextToList as convertParagraphToList,
} from './utils/componentHelpers';

import type { ComponentType, NewsletterNote, NewsletterHeader, NewsletterFooter } from './types';

// Update the interface to include newsletter props
interface EmailEditorProps {
  initialTemplate?: string;
  savedNotes?: any[];
  onSaveNote?: (noteData: any) => void;
  onClose: () => void;
  initialNote?: SavedNote | null;
  isNewsletterMode?: boolean;
  onSave?: (note: SavedNote) => void;
  // Nuevas props para newsletter
  newsletterNotes?: NewsletterNote[];
  onNewsletterNotesChange?: (notes: NewsletterNote[]) => void;
  newsletterHeader?: NewsletterHeader;
  newsletterFooter?: NewsletterFooter;
  onNewsletterConfigChange?: (config: {
    header: NewsletterHeader;
    footer: NewsletterFooter;
  }) => void;
  newsletterTitle?: string;
  newsletterDescription?: string;
  onNewsletterInfoChange?: (info: { title: string; description: string }) => void;
  // Nuevas props para el menú de envío
  newsletterList?: any[];
  currentNewsletterId?: string;
  saving?: boolean;
  setOpenSendDialog?: (open: boolean) => void;
  setOpenAprob?: (open: boolean) => void;
  setOpenSchedule?: (open: boolean) => void;
  setOpenSendSubs?: (open: boolean) => void;
}

export const EmailEditorMain: React.FC<EmailEditorProps> = ({
  initialTemplate = 'blank',
  onSave,
  savedNotes = [],
  onSaveNote,
  onClose = () => {},
  initialNote = null,
  isNewsletterMode = false,
  // Nuevas props para newsletter
  newsletterNotes = [],
  onNewsletterNotesChange = () => {},
  newsletterHeader,
  newsletterFooter,
  onNewsletterConfigChange = () => {},
  newsletterTitle = '',
  newsletterDescription = '',
  onNewsletterInfoChange = () => {},
  // Nuevas props para el menú de envío
  newsletterList = [],
  currentNewsletterId,
  saving = false,
  setOpenSendDialog,
  setOpenAprob,
  setOpenSchedule,
  setOpenSendSubs,
}) => {
  // Estados básicos del editor
  const [activeTab, setActiveTab] = useState<string>('contenido');
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate);
  const [activeVersion, setActiveVersion] = useState<'newsletter' | 'web'>('newsletter');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<'left' | 'right'>('left');

  // Función para cambiar plantilla y resetear selección
  const handleTemplateChange = useCallback(
    (templateId: string) => {
      console.log('🔄 Cambiando plantilla de', activeTemplate, 'a', templateId);
      setActiveTemplate(templateId);
      setSelectedComponentId(null); // Resetear componente seleccionado
      setRightPanelTab(0); // Resetear tab del panel derecho
      setIsContainerSelected(false); // Resetear selección del contenedor
      setIsNewsletterContainerSelected(false); // Resetear selección del contenedor newsletter
      console.log('✅ Componente seleccionado reseteado al cambiar plantilla');
    },
    [activeTemplate]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    basic: true,
  });
  const [generatingEmail, setGeneratingEmail] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isContainerSelected, setIsContainerSelected] = useState<boolean>(false);

  // NUEVOS ESTADOS PARA NEWSLETTER
  const [isNewsletterContainerSelected, setIsNewsletterContainerSelected] =
    useState<boolean>(false);
  const [editingNoteFromLibrary, setEditingNoteFromLibrary] = useState<SavedNote | null>(null);
  const [showNewsletterPreview, setShowNewsletterPreview] = useState<boolean>(false);
  const [newsletterHtml, setNewsletterHtml] = useState<string>('');
  const [generatingNewsletterHtml, setGeneratingNewsletterHtml] = useState<boolean>(false);

  // Estados de diseño
  const [emailBackground, setEmailBackground] = useState<string>('#ffffff');
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [showGradient, setShowGradient] = useState<boolean>(false);
  const [gradientColors, setGradientColors] = useState<string[]>(['#f6f9fc', '#e9f2ff']);
  const [containerBorderWidth, setContainerBorderWidth] = useState<number>(1);
  const [containerBorderColor, setContainerBorderColor] = useState<string>('#e0e0e0');
  const [containerBorderRadius, setContainerBorderRadius] = useState<number>(12);
  const [containerPadding, setContainerPadding] = useState<number>(10);
  const [containerMaxWidth, setContainerMaxWidth] = useState<number>(560);

  // Estados para newsletter por defecto si no se proporcionan
  const [defaultNewsletterHeader] = useState<NewsletterHeader>({
    title: 'Newsletter Semanal',
    subtitle: 'Las mejores noticias y actualizaciones',
    logo: '',
    logoAlt: 'Logo',
    bannerImage: '',
    backgroundColor: '#FFF9CE',
    textColor: '#333333',
    alignment: 'center',
    useGradient: true,
    gradientColors: ['#FFF9CE', '#E2E5FA'],
    gradientDirection: 135,
    showLogo: true,
    showBanner: false,
    logoHeight: 60,
    padding: 32,
    sponsor: {
      enabled: false,
      label: 'Juntos con',
      image: '',
      imageAlt: 'Sponsor',
    },
  });

  const [defaultNewsletterFooter] = useState<NewsletterFooter>({
    companyName: 'Tu Empresa',
    address: '123 Calle Principal, Ciudad, País',
    contactEmail: 'contacto@ejemplo.com',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com', enabled: true },
      { platform: 'facebook', url: 'https://facebook.com', enabled: true },
      { platform: 'instagram', url: 'https://instagram.com', enabled: true },
      { platform: 'linkedin', url: 'https://linkedin.com', enabled: false },
    ],
    unsubscribeLink: '#unsubscribe',
    backgroundColor: '#f5f5f5',
    textColor: '#666666',
    useGradient: false,
    gradientColors: ['#f5f5f5', '#e0e0e0'],
    gradientDirection: 180,
    showSocial: true,
    showAddress: true,
    padding: 24,
    fontSize: 12,
  });

  // Estados para lista
  const [listStyle, setListStyle] = useState<'disc' | 'circle' | 'square' | 'decimal' | 'none'>(
    'disc'
  );

  // Estados adicionales que faltaban
  const [listColor, setListColor] = useState('#000000');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Estados para diálogos y notificaciones
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [emailHtml, setEmailHtml] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');

  // Estado para el diálogo de cambios sin guardar
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);

  // Estado para el panel derecho
  const [rightPanelTab, setRightPanelTab] = useState(0);

  // Referencias
  const editorRef = useRef<HTMLDivElement>(null);

  // PostStore integration
  const {
    create: createPost,
    update: updatePost,
    findAll: findAllPosts,
    findById: findPostById,
  } = usePostStore();

  // Usar hooks personalizados
  const emailComponents = useEmailComponents();
  const noteData = useNoteData();
  const textFormatting = useTextFormatting();
  const resizablePanels = useResizablePanels();

  // Hook para cargar post específico si es edición
  const { loading: loadingPost, post: currentPost } = usePost(noteData.currentNoteId);

  // FUNCIONES PARA NEWSLETTER
  const handleAddNewsletterNote = useCallback(
    (note: NewsletterNote) => {
      const updatedNotes = [...newsletterNotes, note];
      onNewsletterNotesChange(updatedNotes);
      showNotification('Nota agregada al newsletter', 'success');
    },
    [newsletterNotes, onNewsletterNotesChange]
  );

  const handleMoveNewsletterNote = useCallback(
    (noteId: string, direction: 'up' | 'down') => {
      const noteIndex = newsletterNotes.findIndex((note) => note.noteId === noteId);
      if (noteIndex === -1) return;

      const newNotes = [...newsletterNotes];
      const noteToMove = newNotes[noteIndex];

      if (direction === 'up' && noteIndex > 0) {
        newNotes[noteIndex] = newNotes[noteIndex - 1];
        newNotes[noteIndex - 1] = noteToMove;
      } else if (direction === 'down' && noteIndex < newNotes.length - 1) {
        newNotes[noteIndex] = newNotes[noteIndex + 1];
        newNotes[noteIndex + 1] = noteToMove;
      }

      // Update order property
      const updatedNotes = newNotes.map((note, index) => ({
        ...note,
        order: index,
      }));

      onNewsletterNotesChange(updatedNotes);
    },
    [newsletterNotes, onNewsletterNotesChange]
  );

  const handleRemoveNewsletterNote = useCallback(
    (noteId: string) => {
      const updatedNotes = newsletterNotes.filter((note) => note.noteId !== noteId);
      onNewsletterNotesChange(updatedNotes);
      showNotification('Nota eliminada del newsletter', 'info');
    },
    [newsletterNotes, onNewsletterNotesChange]
  );

  const handleEditNoteFromLibrary = useCallback((note: SavedNote) => {
    setEditingNoteFromLibrary(note);
    // Aquí puedes abrir un modal o navegar a la edición
    showNotification(`Editando nota: ${note.title}`, 'info');
  }, []);

  // NUEVA FUNCIÓN: Generar HTML del Newsletter
  const handleGenerateNewsletterHtml = useCallback(async () => {
    if (newsletterNotes.length === 0) {
      showNotification('Agrega al menos una nota para generar el preview', 'warning');
      return;
    }

    setGeneratingNewsletterHtml(true);
    try {
      const currentHeader = newsletterHeader || defaultNewsletterHeader;
      const currentFooter = newsletterFooter || defaultNewsletterFooter;

      const html = generateNewsletterHtml(
        newsletterTitle || 'Newsletter',
        newsletterDescription || '',
        newsletterNotes,
        currentHeader,
        currentFooter
      );

      setNewsletterHtml(html);
      setShowNewsletterPreview(true);
      showNotification('Preview HTML generado exitosamente', 'success');
    } catch (error) {
      console.error('Error generando HTML del newsletter:', error);
      showNotification('Error al generar el preview HTML', 'error');
    } finally {
      setGeneratingNewsletterHtml(false);
    }
  }, [
    newsletterNotes,
    newsletterHeader,
    newsletterFooter,
    defaultNewsletterHeader,
    defaultNewsletterFooter,
    newsletterTitle,
    newsletterDescription,
  ]);

  // NUEVA FUNCIÓN: Toggle entre vista de notas y preview HTML
  const handleToggleNewsletterView = useCallback(() => {
    setShowNewsletterPreview(!showNewsletterPreview);
  }, [showNewsletterPreview]);

  const handleNewsletterContainerClick = useCallback(() => {
    console.log('🏠 Newsletter container clicked');
    setIsNewsletterContainerSelected(true);
    setIsContainerSelected(false);
    setSelectedComponentId(null);
  }, []);

  // Log cuando newsletterHeader cambie
  useEffect(() => {
    console.log('🔄 newsletterHeader cambió a:', newsletterHeader);
  }, [newsletterHeader]);

  // Log cuando newsletterFooter cambie
  useEffect(() => {
    console.log('🔄 newsletterFooter cambió a:', newsletterFooter);
  }, [newsletterFooter]);

  const handleHeaderChange = useCallback(
    (newHeader: NewsletterHeader) => {
      console.log('🔄 handleHeaderChange ejecutado con:', newHeader);
      console.log('📊 newsletterHeader actual:', newsletterHeader);
      console.log('📊 defaultNewsletterHeader:', defaultNewsletterHeader);
      const currentHeader = newsletterHeader || defaultNewsletterHeader;
      const currentFooter = newsletterFooter || defaultNewsletterFooter;
      console.log('📤 Llamando onNewsletterConfigChange con:', {
        header: newHeader,
        footer: currentFooter,
      });
      onNewsletterConfigChange({ header: newHeader, footer: currentFooter });
      console.log('✅ onNewsletterConfigChange llamado');
    },
    [
      newsletterHeader,
      newsletterFooter,
      defaultNewsletterHeader,
      defaultNewsletterFooter,
      onNewsletterConfigChange,
    ]
  );

  const handleFooterChange = useCallback(
    (newFooter: NewsletterFooter) => {
      const currentHeader = newsletterHeader || defaultNewsletterHeader;
      onNewsletterConfigChange({ header: currentHeader, footer: newFooter });
    },
    [newsletterHeader, newsletterFooter, defaultNewsletterHeader, onNewsletterConfigChange]
  );

  // Función para mostrar notificaciones
  const showNotification = useCallback(
    (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setOpenSnackbar(true);
    },
    []
  );

  // Inicializar hook de sincronización
  const versionSync = useVersionSync({
    activeTemplate,
    activeVersion,
    getActiveComponents: emailComponents.getActiveComponents,
    updateActiveComponents: emailComponents.updateActiveComponents,
    getOtherVersionComponents: emailComponents.getOtherVersionComponents,
    onShowNotification: showNotification,
  });

  // ⚡ NUEVO: Sistema de Auto-guardado (movido aquí para estar disponible antes)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(true);

  // Función para crear los datos de auto-guardado
  const createAutoSaveData = useCallback(
    (): AutoSaveData => ({
      title: noteData.noteTitle,
      description: noteData.noteDescription,
      coverImageUrl: noteData.noteCoverImageUrl,
      components: emailComponents.getActiveComponents(activeTemplate, 'newsletter'),
      componentsWeb: emailComponents.getActiveComponents(activeTemplate, 'web'),
      config: {
        templateType: activeTemplate,
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
      },
    }),
    [
      noteData.noteTitle,
      noteData.noteDescription,
      noteData.noteCoverImageUrl,
      emailComponents,
      activeTemplate,
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
    ]
  );

  // Función de auto-guardado que usa la misma lógica que handleSaveNote
  const autoSaveFunction = useCallback(
    async (data: AutoSaveData) => {
      console.log('🎯 autoSaveFunction called with data:', {
        title: data.title,
        componentsCount: data.components.length,
      });

      console.log('🔒 Checking conditions:', {
        isEditingExistingNote: noteData.isEditingExistingNote,
        currentNoteId: noteData.currentNoteId,
        canAutoSave: noteData.isEditingExistingNote && noteData.currentNoteId,
      });

      // Solo hacer auto-guardado si estamos editando una nota existente
      if (!noteData.isEditingExistingNote || !noteData.currentNoteId) {
        console.log('❌ Auto-save cancelled: Not editing existing note or no noteId');
        return;
      }

      console.log('✅ Conditions met, proceeding with auto-save');

      const objDataString = JSON.stringify(data.components);
      const objDataWebString = JSON.stringify(data.componentsWeb);

      // Crear objeto de configuración
      const configPostObject = {
        ...data.config,
        dateModified: new Date().toISOString(),
      };

      // Preparar datos para el PATCH
      const postData = {
        title: data.title.trim(),
        description: data.description || '',
        coverImageUrl: data.coverImageUrl || '',
        objData: objDataString,
        objDataWeb: objDataWebString,
        configPost: JSON.stringify(configPostObject),
        origin: 'ADAC',
        highlight: false,
      };

      console.log('�� Calling updatePost with noteId:', noteData.currentNoteId);

      // Actualizar post existente
      await updatePost(noteData.currentNoteId, postData);

      console.log('✅ updatePost completed successfully');
    },
    [noteData.isEditingExistingNote, noteData.currentNoteId, updatePost]
  );

  // 🔍 NUEVO: Sistema de detección de cambios (sin auto-save)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const initialDataRef = useRef<AutoSaveData | null>(null);

  // Inicializar datos de referencia
  useEffect(() => {
    if (noteData.isEditingExistingNote && !initialDataRef.current) {
      initialDataRef.current = createAutoSaveData();
      console.log('📊 Initial data set for change detection');
    }
  }, [noteData.isEditingExistingNote, createAutoSaveData]);

  // Función para detectar si hay cambios
  const checkForChanges = useCallback(() => {
    if (!initialDataRef.current) return false;

    const currentData = createAutoSaveData();
    const hasChanges = JSON.stringify(currentData) !== JSON.stringify(initialDataRef.current);

    console.log('🔍 Change detection:', {
      hasChanges,
      currentTitle: currentData.title,
      initialTitle: initialDataRef.current.title,
      currentComponents: currentData.components.length,
      initialComponents: initialDataRef.current.components.length,
    });

    return hasChanges;
  }, [createAutoSaveData]);

  // Función para notificar cambios (reemplaza notifyChange)
  const notifyChange = useCallback(
    (changeType: string) => {
      console.log('📢 Change detected:', changeType);

      const hasChanges = checkForChanges();
      setHasUnsavedChanges(hasChanges);
      setChangeCount((prev) => prev + 1);

      console.log('📊 Change state updated:', {
        hasUnsavedChanges: hasChanges,
        changeCount: changeCount + 1,
      });
    },
    [checkForChanges, changeCount]
  );

  // 🚨 NUEVO: Sistema de advertencia al salir
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
        return e.returnValue;
      }
      return undefined;
    },
    [hasUnsavedChanges]
  );

  // Agregar listener para beforeunload
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // Función para manejar el cierre con confirmación
  const handleCloseWithConfirmation = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedChangesDialog(true);
    } else {
      // No hay cambios, salir directamente
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  // Funciones para el diálogo se declararán después de handleSaveNote

  // Función para resetear el estado de cambios después de guardar
  const resetChangeDetection = useCallback(() => {
    if (noteData.isEditingExistingNote) {
      initialDataRef.current = createAutoSaveData();
      setHasUnsavedChanges(false);
      setChangeCount(0);
      console.log('🔄 Change detection reset after save');
    }
  }, [noteData.isEditingExistingNote, createAutoSaveData]);

  // Obtener los componentes activos
  const getActiveComponents = useCallback(
    () => emailComponents.getActiveComponents(activeTemplate, activeVersion),
    [emailComponents, activeTemplate, activeVersion]
  );

  // Actualizar los componentes activos
  const updateActiveComponents = useCallback(
    (components: any[]) => {
      emailComponents.updateActiveComponents(activeTemplate, activeVersion, components);
    },
    [emailComponents, activeTemplate, activeVersion]
  );

  // ⚡ Optimización: Actualizar el contenido de un componente con sincronización
  const updateComponentContent = useCallback(
    (id: string, content: string) => {
      console.log('🟡 updateComponentContent called:', {
        id,
        content: content.substring(0, 50) + '...',
      });

      const components = getActiveComponents();

      // Solo actualizar si el contenido realmente cambió
      // Buscar recursivamente el componente actual
      const findComponentById = (comps: any[]): any => {
        for (const comp of comps) {
          if (comp.id === id) return comp;
          if (comp.props && Array.isArray(comp.props.componentsData)) {
            const found = findComponentById(comp.props.componentsData);
            if (found) return found;
          }
        }
        return null;
      };
      const currentComponent = findComponentById(components);
      if (currentComponent && currentComponent.content === content) {
        console.log('🔵 No changes detected, skipping update');
        return; // No hay cambios, evitar re-render
      }

      console.log('🟢 Content changed, updating component');
      const updatedComponents = updateComponentInArrayRecursive(components, id, { content });
      updateActiveComponents(updatedComponents);

      // Sincronizar automáticamente si está habilitado
      versionSync.syncComponentUpdate(id, { content });

      // Notificar cambio detectado
      console.log('🔴 Notifying change: component-content-updated');
      notifyChange('component-content-updated');
    },
    [getActiveComponents, updateActiveComponents, versionSync, notifyChange]
  );

  // Actualizar las propiedades de un componente con sincronización
  const updateComponentProps = useCallback(
    (id: string, props: Record<string, any>) => {
      const components = getActiveComponents();
      // Buscar recursivamente el componente actual
      const findComponentById = (comps: any[]): any => {
        for (const comp of comps) {
          if (comp.id === id) return comp;
          if (comp.props && Array.isArray(comp.props.componentsData)) {
            const found = findComponentById(comp.props.componentsData);
            if (found) return found;
          }
        }
        return null;
      };
      const component = findComponentById(components);
      if (!component) return;

      const updatedProps = { ...component.props, ...props };
      const updatedComponents = updateComponentInArrayRecursive(components, id, {
        props: updatedProps,
      });
      updateActiveComponents(updatedComponents);

      // Sincronizar automáticamente si está habilitado
      versionSync.syncComponentUpdate(id, { props });

      // Notificar al auto-guardado
      notifyChange('component-props-updated');
    },
    [getActiveComponents, updateActiveComponents, versionSync, notifyChange]
  );

  // Actualizar el estilo de un componente con sincronización
  const updateComponentStyle = useCallback(
    (id: string, style: React.CSSProperties) => {
      const components = getActiveComponents();
      // Buscar recursivamente el componente actual
      const findComponentById = (comps: any[]): any => {
        for (const comp of comps) {
          if (comp.id === id) return comp;
          if (comp.props && Array.isArray(comp.props.componentsData)) {
            const found = findComponentById(comp.props.componentsData);
            if (found) return found;
          }
        }
        return null;
      };
      const component = findComponentById(components);
      if (!component) return;

      const updatedStyle = { ...component.style, ...style };
      const updatedComponents = updateComponentInArrayRecursive(components, id, {
        style: updatedStyle,
      });
      updateActiveComponents(updatedComponents);

      // Sincronizar automáticamente si está habilitado
      versionSync.syncComponentUpdate(id, { style });

      // Notificar al auto-guardado
      notifyChange('component-style-updated');
    },
    [getActiveComponents, updateActiveComponents, versionSync, notifyChange]
  );

  // Agregar un componente
  const addComponent = useCallback(
    (type: ComponentType) => {
      const components = getActiveComponents();
      const newComponent = createNewComponent(type, activeVersion);

      // Actualizar los componentes activos con el nuevo componente
      const updatedComponents = addComponentToArray(components, newComponent);
      updateActiveComponents(updatedComponents);
      setSelectedComponentId(newComponent.id);

      // Notificar al auto-guardado
      notifyChange('component-added');

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
    },
    [getActiveComponents, updateActiveComponents, activeVersion, notifyChange]
  );

  // Nueva función para inyectar componentes al newsletter
  const injectComponentsToNewsletter = useCallback(
    (components: EmailComponent[], noteTitle?: string) => {
      if (activeTemplate !== 'newsletter' || activeVersion !== 'newsletter') {
        console.warn('Solo se pueden inyectar componentes en template newsletter');
        return;
      }

      const currentComponents = getActiveComponents();
      const timestamp = Date.now();

      // Generar IDs únicos para los nuevos componentes
      const newComponents = components.map((component, index) => ({
        ...component,
        id: `${component.id}-injected-${timestamp}-${index}`,
      }));

      // Crear un contenedor para toda la nota con bordes
      const noteContainer: EmailComponent = {
        id: `note-container-${timestamp}`,
        type: 'noteContainer', // Cambiar de 'divider' a 'noteContainer'
        content: '',
        props: {
          noteTitle: noteTitle || 'Nota Inyectada',
          containerStyle: {
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            margin: '20px 0',
            backgroundColor: '#ffffff',
            position: 'relative',
          },
          // Agregar referencia a los componentes que pertenecen a esta nota
          containedComponents: newComponents.map((comp) => comp.id),
          // Almacenar los componentes completos en el contenedor
          componentsData: newComponents,
        },
        style: {
          border: '2px solid #e0e0e0',
          borderRadius: '12px',
          padding: '20px',
          margin: '20px 0',
          backgroundColor: '#ffffff',
          position: 'relative',
        },
      };

      // Agregar solo el contenedor de la nota (los componentes se renderizan dentro)
      const updatedComponents = [...currentComponents, noteContainer];
      updateActiveComponents(updatedComponents);

      // Notificar al auto-guardado
      notifyChange('components-injected');
    },
    [activeTemplate, activeVersion, getActiveComponents, updateActiveComponents, notifyChange]
  );

  // Eliminar un componente
  const removeComponent = useCallback(
    (id: string) => {
      const components = getActiveComponents();
      const updatedComponents = removeComponentFromArray(components, id);
      updateActiveComponents(updatedComponents);
      setSelectedComponentId(null);

      // Notificar al auto-guardado
      notifyChange('component-removed');
    },
    [getActiveComponents, updateActiveComponents, notifyChange]
  );

  // Mover un componente hacia arriba o abajo
  const moveComponent = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const components = getActiveComponents();
      const updatedComponents = moveComponentInArray(components, id, direction);
      updateActiveComponents(updatedComponents);

      // Notificar al auto-guardado
      notifyChange('component-moved');
    },
    [getActiveComponents, updateActiveComponents, notifyChange]
  );

  // Función para cambiar entre versiones (newsletter y web)
  const handleVersionChange = useCallback(
    (newVersion: 'newsletter' | 'web') => {
      versionSync.handleVersionChange(newVersion);
      setActiveVersion(newVersion);
      setSelectedComponentId(null); // Deseleccionar componente al cambiar de versión
    },
    [versionSync]
  );

  // Función para generar el HTML del email
  const handleGenerateEmailHtml = useCallback(async () => {
    setGeneratingEmail(true);
    try {
      const components = getActiveComponents();

      // Usar generateSingleNoteHtml para generar HTML de la nota individual
      const html = generateSingleNoteHtml(
        noteData.noteTitle || 'Nota',
        noteData.noteDescription || '',
        components,
        {
          borderWidth: containerBorderWidth,
          borderColor: containerBorderColor,
          borderRadius: containerBorderRadius,
          padding: containerPadding,
          maxWidth: containerMaxWidth,
        }
      );

      setEmailHtml(html);
      setOpenPreviewDialog(true);
    } catch (error) {
      console.error('Error generating email HTML:', error);
      showNotification('Error generating email HTML', 'error');
    } finally {
      setGeneratingEmail(false);
    }
  }, [
    getActiveComponents,
    noteData.noteTitle,
    noteData.noteDescription,
    containerBorderWidth,
    containerBorderColor,
    containerBorderRadius,
    containerPadding,
    containerMaxWidth,
    showNotification,
  ]);

  // Función para generar HTML sin mostrar preview (para envío de pruebas)
  const generateHtmlForSending = useCallback(async (): Promise<string> => {
    try {
      if (isNewsletterMode) {
        // Para newsletters, usar el generador de newsletter
        const { generateNewsletterHtml: generateNewsletterHtmlFn } = await import(
          '../newsletter-html-generator'
        );
        return generateNewsletterHtmlFn(
          newsletterTitle || 'Newsletter',
          newsletterDescription || '',
          newsletterNotes,
          newsletterHeader || {
            title: 'Newsletter',
            subtitle: '',
            logo: '',
            bannerImage: '',
            backgroundColor: '#ffffff',
            textColor: '#333333',
            alignment: 'center',
          },
          newsletterFooter || {
            companyName: 'Mi Empresa',
            address: '',
            contactEmail: '',
            socialLinks: [],
            unsubscribeLink: '',
            backgroundColor: '#f5f5f5',
            textColor: '#666666',
          }
        );
      } else {
        // ✅ NUEVO: Para notas individuales, usar generateSingleNoteHtml (sin header y footer)
        const components = getActiveComponents();
        const postData = currentPost; // Usar la variable ya existente del scope superior

        // Configuración del contenedor desde el panel derecho
        const containerConfig = {
          borderWidth: containerBorderWidth,
          borderColor: containerBorderColor,
          borderRadius: containerBorderRadius,
          padding: containerPadding,
          maxWidth: containerMaxWidth,
        };

        return generateSingleNoteHtml(
          postData?.title || noteData.noteTitle || 'Nota',
          postData?.description || noteData.noteDescription || '',
          components,
          containerConfig
        );
      }
    } catch (error) {
      console.error('Error generating HTML for sending:', error);
      throw new Error('No se pudo generar el contenido HTML');
    }
  }, [
    isNewsletterMode,
    newsletterTitle,
    newsletterDescription,
    newsletterNotes,
    newsletterHeader,
    newsletterFooter,
    getActiveComponents,
    noteData.noteTitle,
    noteData.noteDescription,
    currentPost,
    // Agregar las configuraciones del contenedor
    containerBorderWidth,
    containerBorderColor,
    containerBorderRadius,
    containerPadding,
    containerMaxWidth,
  ]);

  // Función para manejar la selección del contenedor principal
  const handleContainerSelect = useCallback(() => {
    console.log('🎨 Contenedor principal seleccionado');
    setIsContainerSelected(true);
    setSelectedComponentId(null);
    setRightPanelTab(0);

    // Si estamos en modo newsletter, también establecer el estado del newsletter container
    if (isNewsletterMode) {
      setIsNewsletterContainerSelected(true);
    }
  }, [isNewsletterMode]);

  // Función para manejar la selección de componentes
  const handleComponentSelect = useCallback((componentId: string | null) => {
    console.log('🎯 Component selected:', componentId);
    setSelectedComponentId(componentId);

    // Si se selecciona un componente, resetear la selección del contenedor
    if (componentId) {
      setIsContainerSelected(false);
      setIsNewsletterContainerSelected(false);
    }
  }, []);

  // Función para convertir texto a lista
  const convertTextToList = useCallback(
    (componentId: string | null, listType: 'ordered' | 'unordered') => {
      if (!componentId) return;

      const components = getActiveComponents();
      const component = components.find((comp) => comp.id === componentId);

      if (component && component.type === 'paragraph') {
        const newListComponent = convertParagraphToList(component, listType, activeVersion);

        // Reemplazar el párrafo con la lista
        const updatedComponents = updateComponentInArray(components, componentId, newListComponent);
        updateActiveComponents(updatedComponents);

        // Seleccionar el nuevo componente
        setSelectedComponentId(newListComponent.id);

        // Actualizar los estados de estilo de lista
        setListStyle(listType === 'ordered' ? 'decimal' : 'disc');

        showNotification('Párrafo convertido a lista', 'success');
      }
    },
    [getActiveComponents, updateActiveComponents, activeVersion, showNotification]
  );

  // Función wrapper para convertTextToList que cumple con la interfaz esperada
  const handleConvertTextToList = useCallback(
    (componentId: string | null, listType: 'ordered' | 'unordered') => {
      convertTextToList(componentId, listType);
    },
    [convertTextToList]
  );

  // Función para manejar el guardado de notas
  const handleSaveNote = useCallback(async () => {
    try {
      // Validaciones
      if (!noteData.noteTitle.trim()) {
        showNotification('El título es obligatorio', 'error');
        return;
      }

      // Obtener componentes según la plantilla activa
      const objdata = emailComponents.getActiveComponents(activeTemplate, 'newsletter');
      const objdataWeb = emailComponents.getActiveComponents(activeTemplate, 'web');

      // Verificar que todas las imágenes estén subidas a S3
      const objDataString = JSON.stringify(objdata);
      const objDataWebString = JSON.stringify(objdataWeb);

      const imageValidation = validateAllImagesUploaded(objDataString, objDataWebString);

      if (!imageValidation.isValid) {
        const imageStats = getImageStats(objDataString, objDataWebString);
        showNotification(
          `⚠️ Hay ${imageStats.pending} imagen(es) sin subir a S3. Sube todas las imágenes antes de guardar.`,
          'warning'
        );
        return;
      }

      // Crear objeto de configuración
      const configPostObject = {
        templateType: activeTemplate,
        dateCreated: noteData.currentNoteId ? '' : new Date().toISOString(),
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
        title: noteData.noteTitle.trim(),
        description: noteData.noteDescription || '',
        coverImageUrl: noteData.noteCoverImageUrl || '',
        objData: objDataString,
        objDataWeb: objDataWebString,
        configPost: JSON.stringify(configPostObject),
        origin: 'ADAC',
        highlight: false,
      };

      let result;

      if (noteData.isEditingExistingNote && noteData.currentNoteId) {
        // Actualizar post existente
        result = await updatePost(noteData.currentNoteId, postData);
      } else {
        // Crear nuevo post
        result = await createPost(postData);
        if (result) {
          noteData.setCurrentNoteId(result.id);
          noteData.setIsEditingExistingNote(true);
        }
      }

      if (result) {
        const finalImageStats = getImageStats(objDataString, objDataWebString);

        const successMessage =
          finalImageStats.total > 0
            ? `Nota ${noteData.isEditingExistingNote ? 'actualizada' : 'guardada'} correctamente con ${finalImageStats.total} imagen(es) en S3`
            : `Nota ${noteData.isEditingExistingNote ? 'actualizada' : 'guardada'} correctamente`;

        showNotification(successMessage, 'success');
        noteData.setOpenSaveDialog(false);

        // 🔄 NUEVO: Resetear detección de cambios después de guardar exitosamente
        resetChangeDetection();
      } else {
        throw new Error('No se pudo guardar la nota');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      showNotification('Error al guardar la nota', 'error');
    }
  }, [
    noteData,
    emailComponents,
    activeTemplate,
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
    createPost,
    updatePost,
    showNotification,
    resetChangeDetection,
  ]);

  // Funciones para el diálogo de cambios sin guardar
  const handleSaveAndExit = useCallback(async () => {
    setShowUnsavedChangesDialog(false);
    await handleSaveNote();
    onClose();
  }, [handleSaveNote, onClose]);

  const handleExitWithoutSaving = useCallback(() => {
    setShowUnsavedChangesDialog(false);
    onClose();
  }, [onClose]);

  const handleContinueEditing = useCallback(() => {
    setShowUnsavedChangesDialog(false);
  }, []);

  // Añadir función para agregar un elemento a la lista
  const addListItem = useCallback(
    (listId: string) => {
      const components = getActiveComponents();
      const component = components.find((comp) => comp.id === listId);

      if (component && component.type === 'bulletList') {
        const items = component.props.items || [];
        const updatedProps = {
          ...component.props,
          items: [...items, 'New list item'],
        };

        updateComponentProps(listId, updatedProps);
        notifyChange('list-item-added');
      }
    },
    [getActiveComponents, updateComponentProps, notifyChange]
  );

  // Añadir función para eliminar un elemento de la lista
  const removeListItem = useCallback(
    (listId: string, itemIndex: number) => {
      const components = getActiveComponents();
      const component = components.find((comp) => comp.id === listId);

      if (component && component.type === 'bulletList') {
        const items = [...(component.props.items || [])];
        if (items.length > 1) {
          items.splice(itemIndex, 1);
          const updatedProps = {
            ...component.props,
            items,
          };

          updateComponentProps(listId, updatedProps);
          notifyChange('list-item-removed');
        } else {
          showNotification('La lista debe tener al menos un elemento', 'info');
        }
      }
    },
    [getActiveComponents, updateComponentProps, showNotification, notifyChange]
  );

  // Añadir función para actualizar un elemento de la lista
  const updateListItem = useCallback(
    (listId: string, itemIndex: number, content: string) => {
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
        notifyChange('list-item-updated');
      }
    },
    [getActiveComponents, updateComponentProps, notifyChange]
  );

  // Añadir función para cambiar el estilo de la lista
  const updateListStyle = useCallback(
    (listId: string, listStyleType: string) => {
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
        setListStyle(listStyleType as any);
        notifyChange('list-style-updated');
      }
    },
    [getActiveComponents, updateComponentProps, updateComponentStyle, notifyChange]
  );

  // Añadir función para cambiar el color de los bullets
  const updateListColor = useCallback(
    (listId: string, color: string) => {
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
        setListColor(color);
        notifyChange('list-color-updated');
      }
    },
    [getActiveComponents, updateComponentProps, updateComponentStyle, notifyChange]
  );

  // Cargar la nota inicial si existe
  useEffect(() => {
    if (initialNote && initialNote.id) {
      noteData.setCurrentNoteId(initialNote.id);
      noteData.setIsEditingExistingNote(true);
      noteData.setNoteTitle(initialNote.title || '');

      // Si es una nota legacy (SavedNote), cargar de la forma anterior
      if (initialNote.configNote) {
        // Cargar nota existente (implementar si es necesario)
      }
    }
  }, [initialNote]);

  // Cargar datos del post cuando se edite una nota existente
  useEffect(() => {
    if (currentPost && noteData.isEditingExistingNote) {
      noteData.loadNoteData({
        title: currentPost.title,
        description: currentPost.description,
        coverImageUrl: currentPost.coverImageUrl,
        status: (currentPost.status as PostStatus) || 'DRAFT',
      });

      // También cargar los datos del editor si existen
      if (currentPost.objData) {
        try {
          const objDataParsed = JSON.parse(currentPost.objData);
          const objDataWebParsed = currentPost.objDataWeb
            ? JSON.parse(currentPost.objDataWeb)
            : null;
          const configPost = currentPost.configPost ? JSON.parse(currentPost.configPost) : {};

          // Cargar los componentes según el template
          emailComponents.loadPostComponents(
            configPost.templateType || 'blank',
            objDataParsed,
            objDataWebParsed
          );

          // Set template and other settings
          handleTemplateChange(configPost.templateType || 'blank');
          if (configPost.activeVersion) {
            setActiveVersion(configPost.activeVersion);
          }
          setEmailBackground(configPost.emailBackground || '#ffffff');
          setSelectedBanner(configPost.selectedBanner || null);
          setShowGradient(configPost.showGradient || false);
          setGradientColors(configPost.gradientColors || ['#f6f9fc', '#e9f2ff']);
          setContainerBorderWidth(configPost.containerBorderWidth ?? 1);
          setContainerBorderColor(configPost.containerBorderColor ?? '#e0e0e0');
          setContainerBorderRadius(configPost.containerBorderRadius ?? 12);
          setContainerPadding(configPost.containerPadding ?? 10);
          setContainerMaxWidth(configPost.containerMaxWidth ?? 560);
        } catch (error) {
          console.error('Error parsing post data:', error);
        }
      }
    }
  }, [currentPost]);

  // NUEVA FUNCIÓN: Actualizar contenido de componente en nota del newsletter
  const updateNewsletterNoteComponentContent = useCallback(
    (noteId: string, componentId: string, content: string) => {
      const updatedNotes = newsletterNotes.map((note) => {
        if (note.noteId === noteId) {
          try {
            const noteComponents = JSON.parse(note.noteData.objData || '[]');
            const updatedComponents = noteComponents.map((comp: any) =>
              comp.id === componentId ? { ...comp, content } : comp
            );

            return {
              ...note,
              noteData: {
                ...note.noteData,
                objData: JSON.stringify(updatedComponents),
              },
            };
          } catch (error) {
            console.error('Error updating newsletter note component content:', error);
            return note;
          }
        }
        return note;
      });

      onNewsletterNotesChange(updatedNotes);
      showNotification('Contenido actualizado', 'success');
    },
    [newsletterNotes, onNewsletterNotesChange]
  );

  // NUEVA FUNCIÓN: Actualizar props de componente en nota del newsletter
  const updateNewsletterNoteComponentProps = useCallback(
    (noteId: string, componentId: string, props: Record<string, any>) => {
      const updatedNotes = newsletterNotes.map((note) => {
        if (note.noteId === noteId) {
          try {
            const noteComponents = JSON.parse(note.noteData.objData || '[]');
            const updatedComponents = noteComponents.map((comp: any) =>
              comp.id === componentId ? { ...comp, ...props } : comp
            );

            return {
              ...note,
              noteData: {
                ...note.noteData,
                objData: JSON.stringify(updatedComponents),
              },
            };
          } catch (error) {
            console.error('Error updating newsletter note component props:', error);
            return note;
          }
        }
        return note;
      });

      onNewsletterNotesChange(updatedNotes);
    },
    [newsletterNotes, onNewsletterNotesChange]
  );

  // NUEVA FUNCIÓN: Actualizar estilo de componente en nota del newsletter
  const updateNewsletterNoteComponentStyle = useCallback(
    (noteId: string, componentId: string, style: React.CSSProperties) => {
      const updatedNotes = newsletterNotes.map((note) => {
        if (note.noteId === noteId) {
          try {
            const noteComponents = JSON.parse(note.noteData.objData || '[]');
            const updatedComponents = noteComponents.map((comp: any) =>
              comp.id === componentId ? { ...comp, style: { ...comp.style, ...style } } : comp
            );

            return {
              ...note,
              noteData: {
                ...note.noteData,
                objData: JSON.stringify(updatedComponents),
              },
            };
          } catch (error) {
            console.error('Error updating newsletter note component style:', error);
            return note;
          }
        }
        return note;
      });

      onNewsletterNotesChange(updatedNotes);
    },
    [newsletterNotes, onNewsletterNotesChange]
  );

  // NUEVA FUNCIÓN: Mover componente dentro de una nota del newsletter
  const moveNewsletterNoteComponent = useCallback(
    (noteId: string, componentId: string, direction: 'up' | 'down') => {
      const updatedNotes = newsletterNotes.map((note) => {
        if (note.noteId === noteId) {
          try {
            const noteComponents = JSON.parse(note.noteData.objData || '[]');
            const componentIndex = noteComponents.findIndex((comp: any) => comp.id === componentId);

            if (componentIndex === -1) return note;

            const newComponents = [...noteComponents];
            if (direction === 'up' && componentIndex > 0) {
              [newComponents[componentIndex], newComponents[componentIndex - 1]] = [
                newComponents[componentIndex - 1],
                newComponents[componentIndex],
              ];
            } else if (direction === 'down' && componentIndex < newComponents.length - 1) {
              [newComponents[componentIndex], newComponents[componentIndex + 1]] = [
                newComponents[componentIndex + 1],
                newComponents[componentIndex],
              ];
            }

            return {
              ...note,
              noteData: {
                ...note.noteData,
                objData: JSON.stringify(newComponents),
              },
            };
          } catch (error) {
            console.error('Error moving newsletter note component:', error);
            return note;
          }
        }
        return note;
      });

      onNewsletterNotesChange(updatedNotes);
      showNotification('Componente movido', 'success');
    },
    [newsletterNotes, onNewsletterNotesChange]
  );

  // NUEVA FUNCIÓN: Eliminar componente de una nota del newsletter
  const removeNewsletterNoteComponent = useCallback(
    (noteId: string, componentId: string) => {
      const updatedNotes = newsletterNotes.map((note) => {
        if (note.noteId === noteId) {
          try {
            const noteComponents = JSON.parse(note.noteData.objData || '[]');
            const updatedComponents = noteComponents.filter((comp: any) => comp.id !== componentId);

            return {
              ...note,
              noteData: {
                ...note.noteData,
                objData: JSON.stringify(updatedComponents),
              },
            };
          } catch (error) {
            console.error('Error removing newsletter note component:', error);
            return note;
          }
        }
        return note;
      });

      onNewsletterNotesChange(updatedNotes);
      showNotification('Componente eliminado', 'info');
    },
    [newsletterNotes, onNewsletterNotesChange]
  );

  // NUEVA FUNCIÓN: Obtener componente específico de una nota del newsletter
  const getNewsletterNoteComponent = useCallback(
    (noteId: string, componentId: string) => {
      console.log('🔍 getNewsletterNoteComponent called with:', { noteId, componentId });

      const note = newsletterNotes.find((n) => n.noteId === noteId);
      if (!note) {
        console.log('❌ Note not found:', noteId);
        return null;
      }

      console.log('✅ Note found:', note.noteData.title);

      try {
        const noteComponents = JSON.parse(note.noteData.objData || '[]');
        console.log(
          '📊 Note components:',
          noteComponents.length,
          noteComponents.map((c) => ({ id: c.id, type: c.type }))
        );

        const component = noteComponents.find((comp: any) => comp.id === componentId);
        console.log('🎯 Component found:', component ? component.type : 'NOT FOUND');
        console.log('🔍 Looking for componentId:', componentId);
        console.log(
          '🔍 Available component IDs:',
          noteComponents.map((c) => c.id)
        );

        return component || null;
      } catch (error) {
        console.error('Error parsing newsletter note components:', error);
        return null;
      }
    },
    [newsletterNotes]
  );

  // NUEVA FUNCIÓN: Obtener todos los componentes activos (incluyendo componentes de newsletter)
  const getActiveComponentsForPanel = useCallback(
    () =>
      // Siempre devolver la estructura completa de componentes activos
      // para que findComponentById pueda buscar recursivamente
      emailComponents.getActiveComponents(activeTemplate, activeVersion),
    [emailComponents, activeTemplate, activeVersion]
  );

  // NUEVA FUNCIÓN: Obtener el ID real del componente para el panel
  const getComponentIdForPanel = useCallback(() => {
    if (isNewsletterMode && selectedComponentId && selectedComponentId.includes('-')) {
      // Verificar si es un componente de nota del newsletter (formato: noteId-componentId)
      const components = getActiveComponents();
      const component = components.find((c) => c.id === selectedComponentId);

      if (component && component.props?.isNoteContainer) {
        // Es un contenedor de nota, usar el ID completo
        return selectedComponentId;
      }

      // Es un componente dentro de una nota del newsletter (formato: noteId-componentId)
      const firstDashIndex = selectedComponentId.indexOf('-');
      const componentId = selectedComponentId.substring(firstDashIndex + 1);
      return componentId;
    }
    return selectedComponentId;
  }, [isNewsletterMode, selectedComponentId, getActiveComponents]);

  // NUEVA FUNCIÓN: Función de actualización que funciona tanto para newsletter como modo normal
  const updateComponentForPanel = useCallback(
    (updateType: 'content' | 'props' | 'style', id: string, data: any) => {
      // Si está en modo newsletter
      if (isNewsletterMode && selectedComponentId) {
        // Manejar componentes especiales de newsletter (header y footer)
        if (selectedComponentId === 'newsletter-header') {
          const currentHeader = newsletterHeader || defaultNewsletterHeader;
          let updatedHeader = { ...currentHeader };

          switch (updateType) {
            case 'content':
              updatedHeader.title = data;
              break;
            case 'props':
              updatedHeader = { ...updatedHeader, ...data };
              break;
            case 'style':
              // Los estilos se pueden aplicar como props también
              updatedHeader = { ...updatedHeader, ...data };
              break;
            default:
              console.warn('Unknown update type for newsletter header:', updateType);
          }

          onNewsletterConfigChange({
            header: updatedHeader,
            footer: newsletterFooter || defaultNewsletterFooter,
          });
          return;
        }

        if (selectedComponentId === 'newsletter-footer') {
          const currentFooter = newsletterFooter || defaultNewsletterFooter;
          let updatedFooter = { ...currentFooter };

          switch (updateType) {
            case 'content':
              updatedFooter.companyName = data;
              break;
            case 'props':
              updatedFooter = { ...updatedFooter, ...data };
              break;
            case 'style':
              // Los estilos se pueden aplicar como props también
              updatedFooter = { ...updatedFooter, ...data };
              break;
            default:
              console.warn('Unknown update type for newsletter footer:', updateType);
          }

          onNewsletterConfigChange({
            header: newsletterHeader || defaultNewsletterHeader,
            footer: updatedFooter,
          });
          return;
        }

        // Verificar si es un contenedor de nota
        const components = getActiveComponents();
        const selectedComponent = components.find((c) => c.id === selectedComponentId);

        if (selectedComponent && selectedComponent.props?.isNoteContainer) {
          // Es un contenedor de nota, usar las funciones normales
          switch (updateType) {
            case 'content':
              updateComponentContent(id, data);
              break;
            case 'props':
              updateComponentProps(id, data);
              break;
            case 'style':
              updateComponentStyle(id, data);
              break;
            default:
              console.warn('Unknown update type for note container component:', updateType);
          }
          return;
        }

        // Si hay un componente seleccionado de una nota del newsletter
        if (selectedComponentId.includes('-')) {
          // Dividir correctamente: el noteId es la primera parte hasta el primer '-'
          // y el componentId es todo lo que sigue después del primer '-'
          const firstDashIndex = selectedComponentId.indexOf('-');
          const noteId = selectedComponentId.substring(0, firstDashIndex);
          const componentId = selectedComponentId.substring(firstDashIndex + 1);

          switch (updateType) {
            case 'content':
              updateNewsletterNoteComponentContent(noteId, componentId, data);
              break;
            case 'props':
              updateNewsletterNoteComponentProps(noteId, componentId, data);
              break;
            case 'style':
              updateNewsletterNoteComponentStyle(noteId, componentId, data);
              break;
            default:
              console.warn('Unknown update type for newsletter component:', updateType);
          }
          return;
        }
      }

      // Modo normal - usar las funciones originales
      switch (updateType) {
        case 'content':
          updateComponentContent(id, data);
          break;
        case 'props':
          updateComponentProps(id, data);
          break;
        case 'style':
          updateComponentStyle(id, data);
          break;
        default:
          console.warn('Unknown update type for normal component:', updateType);
      }
    },
    [
      isNewsletterMode,
      selectedComponentId,
      newsletterHeader,
      newsletterFooter,
      defaultNewsletterHeader,
      defaultNewsletterFooter,
      onNewsletterConfigChange,
      updateNewsletterNoteComponentContent,
      updateNewsletterNoteComponentProps,
      updateNewsletterNoteComponentStyle,
      updateComponentContent,
      updateComponentProps,
      updateComponentStyle,
      getActiveComponents,
    ]
  );

  // Función para manejar la selección de columna
  const handleColumnSelect = useCallback(
    (componentId: string, column: 'left' | 'right') => {
      // Solo actualizar si es un componente TwoColumns
      const components = getActiveComponents();
      const component = components.find((c) => c.id === componentId);
      if (component && component.type === 'twoColumns') {
        setSelectedColumn(column);
      }
    },
    [getActiveComponents]
  );

  // Función para eliminar un contenedor de nota y todos sus componentes
  const removeNoteContainer = useCallback(
    (containerId: string) => {
      const components = getActiveComponents();
      const container = components.find((comp) => comp.id === containerId);

      if (!container) {
        console.warn('No se encontró el contenedor');
        return;
      }

      // Si es un contenedor de nota
      if (container.props?.isNoteContainer) {
        // Solo eliminar el contenedor (los componentes están almacenados dentro)
        const updatedComponents = components.filter((comp) => comp.id !== containerId);

        updateActiveComponents(updatedComponents);
        setSelectedComponentId(null);

        // Notificar al auto-guardado
        notifyChange('container-removed');

        showNotification('Nota eliminada exitosamente', 'success');
        return;
      }

      // Si es un contenedor de componente individual (legacy)
      if (container.props?.isComponentContainer) {
        const containedComponentId = container.props.containedComponentId;

        // Filtrar el contenedor y su componente contenido
        const updatedComponents = components.filter(
          (comp) => comp.id !== containerId && comp.id !== containedComponentId
        );

        updateActiveComponents(updatedComponents);
        setSelectedComponentId(null);

        // Notificar al auto-guardado
        notifyChange('container-removed');

        showNotification('Componente eliminado exitosamente', 'success');
        return;
      }

      console.warn('Tipo de contenedor no reconocido');
    },
    [getActiveComponents, updateActiveComponents, setSelectedComponentId, notifyChange]
  );

  // Estados para notas disponibles
  const [availableNotes, setAvailableNotes] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Función para cargar notas disponibles
  const loadAvailableNotes = useCallback(async () => {
    if (activeTemplate !== 'newsletter') return;

    setLoadingNotes(true);
    try {
      const response = await findAllPosts({
        status: 'DRAFT',
        perPage: 50,
      });

      if (response && response.data) {
        setAvailableNotes(response.data);
      }
    } catch (error) {
      console.error('Error al cargar notas disponibles:', error);
    } finally {
      setLoadingNotes(false);
    }
  }, [activeTemplate, findAllPosts]);

  // Cargar notas cuando se selecciona el template newsletter
  useEffect(() => {
    if (activeTemplate === 'newsletter' && activeVersion === 'newsletter') {
      loadAvailableNotes();
    }
  }, [activeTemplate, activeVersion, loadAvailableNotes]);

  // Función para inyectar una nota en el template
  const injectNoteIntoNewsletter = useCallback(
    async (noteId: string) => {
      try {
        const fullNote = await findPostById(noteId);

        if (!fullNote) {
          console.error('No se pudo cargar la nota completa');
          showNotification('Error al cargar la nota completa', 'error');
          return;
        }

        // Parsear los componentes de la nota
        let noteComponents = [];
        try {
          noteComponents = JSON.parse(fullNote.objData || '[]');
        } catch (error) {
          console.error('Error al parsear componentes de la nota:', error);
          showNotification('Error al procesar los componentes de la nota', 'error');
          return;
        }

        if (noteComponents.length === 0) {
          console.warn('La nota no tiene componentes para inyectar');
          showNotification('La nota no tiene componentes para inyectar', 'warning');
          return;
        }

        // Usar la función de inyección existente
        injectComponentsToNewsletter(noteComponents, fullNote.title);
        showNotification(`✅ Nota "${fullNote.title}" inyectada exitosamente`, 'success');
        console.log(`✅ Nota "${fullNote.title}" inyectada exitosamente`);
      } catch (error) {
        console.error('Error al inyectar la nota:', error);
        showNotification('Error al inyectar la nota', 'error');
      }
    },
    [findPostById, injectComponentsToNewsletter]
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      {/* Barra de navegación superior */}
      <EditorHeader
        onClose={handleCloseWithConfirmation}
        isEditingExistingNote={noteData.isEditingExistingNote}
        initialNote={initialNote}
        activeVersion={activeVersion}
        activeTemplate={activeTemplate}
        handleVersionChange={handleVersionChange}
        openSaveDialog={() => noteData.setOpenSaveDialog(true)}
        syncEnabled={versionSync.syncEnabled}
        toggleSync={versionSync.toggleSync}
        transferToWeb={versionSync.transferToWeb}
        transferToNewsletter={versionSync.transferToNewsletter}
        noteStatus={noteData.noteStatus}
        isNewsletterMode={isNewsletterMode}
        // Nuevas props para newsletter
        onGenerateNewsletterHtml={handleGenerateNewsletterHtml}
        onToggleNewsletterView={handleToggleNewsletterView}
        showNewsletterPreview={showNewsletterPreview}
        generatingNewsletterHtml={generatingNewsletterHtml}
        newsletterNotesCount={newsletterNotes.length}
        // Nuevas props para el menú de envío
        newsletterList={newsletterList}
        currentNewsletterId={currentNewsletterId}
        saving={saving}
        setOpenSendDialog={setOpenSendDialog}
        setOpenAprob={setOpenAprob}
        setOpenSchedule={setOpenSchedule}
        setOpenSendSubs={setOpenSendSubs}
        // Nueva prop para generar HTML para envío
        onGenerateHtml={generateHtmlForSending}
      />

      {/* Contenedor principal */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Panel izquierdo - Componentes */}
        <Box
          sx={{
            width: `${resizablePanels.leftPanelWidth}px`,
            minWidth: `${resizablePanels.MIN_PANEL_WIDTH}px`,
            maxWidth: `${resizablePanels.MAX_PANEL_WIDTH}px`,
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
            setActiveTemplate={handleTemplateChange}
            generatingEmail={generatingEmail}
            handleGenerateEmailHtml={handleGenerateEmailHtml}
            setOpenSaveDialog={() => noteData.setOpenSaveDialog(true)}
            activeVersion={activeVersion}
            setActiveVersion={handleVersionChange}
            // Nuevas props para newsletter
            isNewsletterMode={isNewsletterMode}
            newsletterNotes={newsletterNotes}
            onAddNewsletterNote={handleAddNewsletterNote}
            onEditNote={handleEditNoteFromLibrary}
            // Nuevas props para notas disponibles
            availableNotes={availableNotes}
            loadingNotes={loadingNotes}
            onInjectNote={injectNoteIntoNewsletter}
            onRefreshNotes={loadAvailableNotes}
          />

          {/* Barra de redimensionado izquierda */}
          <Box
            onMouseDown={resizablePanels.handleMouseDownLeft}
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
            setSelectedComponentId={setSelectedComponentId}
            onComponentSelect={handleComponentSelect}
            updateComponentContent={updateComponentContent}
            updateComponentProps={updateComponentProps}
            updateComponentStyle={updateComponentStyle}
            handleSelectionUpdate={textFormatting.handleSelectionUpdate}
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
            // Nuevas props para newsletter
            isNewsletterMode={isNewsletterMode}
            newsletterNotes={newsletterNotes}
            onMoveNewsletterNote={handleMoveNewsletterNote}
            onRemoveNewsletterNote={handleRemoveNewsletterNote}
            onEditNewsletterNote={handleEditNoteFromLibrary}
            // Nuevas props para preview HTML
            showNewsletterPreview={showNewsletterPreview}
            newsletterHtml={newsletterHtml}
            // Nuevas funciones para editar componentes de newsletter
            updateNewsletterNoteComponentContent={updateNewsletterNoteComponentContent}
            updateNewsletterNoteComponentProps={updateNewsletterNoteComponentProps}
            updateNewsletterNoteComponentStyle={updateNewsletterNoteComponentStyle}
            moveNewsletterNoteComponent={moveNewsletterNoteComponent}
            removeNewsletterNoteComponent={removeNewsletterNoteComponent}
            onNewsletterContainerClick={handleNewsletterContainerClick}
            // Props para componentes de newsletter (header y footer)
            newsletterHeader={newsletterHeader || defaultNewsletterHeader}
            newsletterFooter={newsletterFooter || defaultNewsletterFooter}
            onNewsletterHeaderUpdate={(header) =>
              onNewsletterConfigChange({
                header,
                footer: newsletterFooter || defaultNewsletterFooter,
              })
            }
            onNewsletterFooterUpdate={(footer) =>
              onNewsletterConfigChange({
                header: newsletterHeader || defaultNewsletterHeader,
                footer,
              })
            }
            removeNoteContainer={removeNoteContainer}
            onColumnSelect={handleColumnSelect}
            selectedColumn={selectedColumn}
          />
        </Box>

        {/* Panel derecho - Formato y estilo */}
        <Box
          sx={{
            width: `${resizablePanels.rightPanelWidth}px`,
            minWidth: `${resizablePanels.MIN_PANEL_WIDTH}px`,
            maxWidth: `${resizablePanels.MAX_PANEL_WIDTH}px`,
            flexShrink: 0,
            borderLeft: '1px solid #e0e0e0',
            position: 'relative',
          }}
        >
          {/* Barra de redimensionado derecha */}
          <Box
            onMouseDown={resizablePanels.handleMouseDownRight}
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

          {/* Renderizar NewsletterConfig si está en modo newsletter y el contenedor está seleccionado */}
          {isNewsletterMode && isNewsletterContainerSelected ? (
            <NewsletterConfig
              newsletterTitle={newsletterTitle}
              newsletterDescription={newsletterDescription}
              onTitleChange={(title) =>
                onNewsletterInfoChange({ title, description: newsletterDescription })
              }
              onDescriptionChange={(description) =>
                onNewsletterInfoChange({ title: newsletterTitle, description })
              }
              selectedNotes={newsletterNotes}
              onMoveNote={handleMoveNewsletterNote}
              onRemoveNote={handleRemoveNewsletterNote}
              header={newsletterHeader || defaultNewsletterHeader}
              footer={newsletterFooter || defaultNewsletterFooter}
              onHeaderChange={handleHeaderChange}
              onFooterChange={handleFooterChange}
              onUndoChanges={() => {}}
              onResetConfiguration={() => {}}
            />
          ) : (
            <RightPanel
              selectedComponentId={getComponentIdForPanel()}
              rightPanelTab={rightPanelTab}
              setRightPanelTab={setRightPanelTab}
              getActiveComponents={
                isNewsletterMode ? getActiveComponentsForPanel : getActiveComponents
              }
              updateComponentProps={(id, props) => updateComponentForPanel('props', id, props)}
              updateComponentStyle={(id, style) => updateComponentForPanel('style', id, style)}
              updateComponentContent={(id, content) =>
                updateComponentForPanel('content', id, content)
              }
              selectedColor={textFormatting.selectedColor}
              setSelectedColor={textFormatting.setSelectedColor}
              selectedFont={textFormatting.selectedFont}
              setSelectedFont={textFormatting.setSelectedFont}
              selectedFontSize={textFormatting.selectedFontSize}
              setSelectedFontSize={textFormatting.setSelectedFontSize}
              selectedFontWeight={textFormatting.selectedFontWeight}
              setSelectedFontWeight={textFormatting.setSelectedFontWeight}
              selectedAlignment={textFormatting.selectedAlignment}
              textFormat={textFormatting.textFormat}
              applyTextFormat={textFormatting.applyTextFormat}
              applyTextAlignment={textFormatting.applyTextAlignment}
              applyTextColor={textFormatting.applyTextColor}
              applyFontSize={(size) =>
                textFormatting.applyFontSize(size, selectedComponentId, updateComponentStyle)
              }
              applyFontFamily={(font) =>
                textFormatting.applyFontFamily(font, selectedComponentId, updateComponentStyle)
              }
              emailBackground={emailBackground}
              setEmailBackground={setEmailBackground}
              selectedBanner={selectedBanner}
              setSelectedBanner={setSelectedBanner}
              showGradient={showGradient}
              setShowGradient={setShowGradient}
              gradientColors={gradientColors}
              setGradientColors={setGradientColors}
              bannerOptions={bannerOptions}
              setSelectedAlignment={textFormatting.setSelectedAlignment}
              hasTextSelection={textFormatting.hasTextSelection}
              listStyle={listStyle}
              updateListStyle={updateListStyle}
              listColor={listColor}
              updateListColor={updateListColor}
              convertTextToList={handleConvertTextToList}
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
              currentNoteId={noteData.currentNoteId}
              noteTitle={noteData.noteTitle}
              setNoteTitle={noteData.setNoteTitle}
              noteDescription={noteData.noteDescription}
              setNoteDescription={noteData.setNoteDescription}
              noteCoverImageUrl={noteData.noteCoverImageUrl}
              setNoteCoverImageUrl={noteData.setNoteCoverImageUrl}
              noteStatus={noteData.noteStatus}
              setNoteStatus={noteData.setNoteStatus}
              updateStatus={noteData.updateStatus}
              selectedColumn={selectedColumn}
              injectComponentsToNewsletter={injectComponentsToNewsletter}
              removeNoteContainer={removeNoteContainer}
            />
          )}
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
                showNotification('HTML copiado al portapapeles', 'success');
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

      {/* 🔍 NUEVO: Indicador de cambios */}
      {/* {hasUnsavedChanges && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1300,
            backgroundColor: 'warning.main',
            color: 'warning.contrastText',
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Icon icon="mdi:alert-circle" />
          <Typography variant="body2">Tienes cambios sin guardar ({changeCount})</Typography>
        </Box>
      )} */}

      {/* Snackbar para mensajes */}
      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setOpenSnackbar(false)}
      />

      {/* Save note dialog */}
      <SaveNoteDialog
        open={noteData.openSaveDialog}
        onClose={() => noteData.setOpenSaveDialog(false)}
        onSave={handleSaveNote}
        noteTitle={noteData.noteTitle}
        noteDescription={noteData.noteDescription}
        noteCoverImageUrl={noteData.noteCoverImageUrl}
        imageStats={getImageStats(
          JSON.stringify(getActiveComponents()),
          JSON.stringify(
            emailComponents.getOtherVersionComponents(
              activeTemplate,
              activeVersion === 'newsletter' ? 'web' : 'newsletter'
            )
          )
        )}
      />

      {/* IconPicker dialog */}
      {selectedComponentId && (
        <IconPicker
          open={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          onSelectIcon={(iconUrl) => {
            const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
            if (
              component &&
              (component.type === 'summary' || component.type === 'tituloConIcono')
            ) {
              updateComponentProps(selectedComponentId, { icon: iconUrl });
            }
            setShowIconPicker(false);
          }}
          currentIcon={
            getActiveComponents().find((comp) => comp.id === selectedComponentId)?.props?.icon ||
            'mdi:text-box-outline'
          }
        />
      )}

      {/* UnsavedChangesDialog */}
      <UnsavedChangesDialog
        open={showUnsavedChangesDialog}
        onClose={handleContinueEditing}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSaving={handleExitWithoutSaving}
        changeCount={changeCount}
      />
    </Box>
  );
};

export default EmailEditorMain;
