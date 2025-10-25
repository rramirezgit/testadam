/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import type React from 'react';
import type { PostStatus } from 'src/store/PostStore';
import type { SavedNote, EmailComponent } from 'src/types/saved-note';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

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
import { CustomSnackbar } from './ui/custom-snackbar';
import { bannerOptions } from './data/banner-options';
import { emailTemplates } from './data/email-templates';
import { useVersionSync } from './hooks/useVersionSync';
import { type AutoSaveData } from './hooks/useAutoSave';
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
  findComponentById as findComponentByIdUtil,
  convertTextToList as convertParagraphToList,
} from './utils/componentHelpers';

import type { ComponentType, NewsletterNote, NewsletterHeader, NewsletterFooter } from './types';

// Update the interface to include newsletter props
interface EmailEditorMainProps {
  initialTemplate?: string;
  defaultTemplate?: string; // Template predeterminado para saltar el modal de selección
  excludeTemplates?: string[]; // Templates a excluir del modal de selección
  savedNotes?: any[];
  onSaveNote?: (noteData: any) => void;
  onClose: () => void;
  initialNote?: SavedNote | null;
  isNewsletterMode?: boolean;
  onSave?: (note: SavedNote) => void;
  onSaveRedirect?: (id: string) => void; // Callback para redirección después de guardar
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
  // Nuevas props para carga de newsletter existente
  initialComponents?: any[] | null;
  onNewsletterIdChange?: (id: string) => void;
  initialCoverImageUrl?: string;
  newsletterStatus?: string;
  onNewsletterUpdate?: () => void;
  // Props para modo view-only
  isViewOnly?: boolean;
  onCreateCopy?: () => void;
  // Props para preview HTML
  showPreview?: boolean;
  onTogglePreview?: () => void;
  newsletterHtmlPreview?: string;
}

export const EmailEditorMain: React.FC<EmailEditorMainProps> = ({
  initialTemplate = 'blank',
  defaultTemplate,
  excludeTemplates = [],
  onSave,
  onSaveRedirect,
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
  // Nuevas props para carga de newsletter existente
  initialComponents = null,
  onNewsletterIdChange = () => {},
  initialCoverImageUrl = '',
  newsletterStatus = '',
  onNewsletterUpdate = () => {},
  // Props para modo view-only
  isViewOnly = false,
  onCreateCopy = () => {},
  // Props para preview HTML
  showPreview = false,
  onTogglePreview = () => {},
  newsletterHtmlPreview = '',
}) => {
  // Estados básicos del editor
  const [activeTab, setActiveTab] = useState<string>('contenido');
  // Si hay defaultTemplate, usarlo; sino usar initialTemplate
  const [activeTemplate, setActiveTemplate] = useState<string>(defaultTemplate || initialTemplate);
  // ⚡ CRÍTICO: Si es modo newsletter, inicializar en 'newsletter', sino 'web'
  const [activeVersion, setActiveVersion] = useState<'newsletter' | 'web'>(
    isNewsletterMode ? 'newsletter' : 'web'
  );
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<'left' | 'right'>('left');

  // Función para cambiar plantilla y resetear selección
  const handleTemplateChange = useCallback(
    (templateId: string) => {
      console.log('🔄 Cambiando plantilla de', activeTemplate, 'a', templateId);
      setActiveTemplate(templateId);
      // Storyboard solo soporta versión web
      if (templateId === 'storyboard') {
        setActiveVersion('web');
      }
      setSelectedComponentId(null); // Resetear componente seleccionado
      setRightPanelTab(0); // Resetear tab del panel derecho
      setIsContainerSelected(false); // Resetear selección del contenedor
      console.log('✅ Componente seleccionado reseteado al cambiar plantilla');
    },
    [activeTemplate]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    texto: true,
    multimedia: true,
    diseño: true,
    noticias: true,
    newsletter: true,
    produccion: true,
  });
  const [generatingEmail, setGeneratingEmail] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isContainerSelected, setIsContainerSelected] = useState<boolean>(false);

  // Estado para controlar cuándo mostrar errores de validación
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);

  // NUEVOS ESTADOS PARA NEWSLETTER
  const [editingNoteFromLibrary, setEditingNoteFromLibrary] = useState<SavedNote | null>(null);
  const [showNewsletterPreview, setShowNewsletterPreview] = useState<boolean>(false);
  const [newsletterHtml, setNewsletterHtml] = useState<string>('');
  const [generatingNewsletterHtml, setGeneratingNewsletterHtml] = useState<boolean>(false);
  const [generatedPreviewHtml, setGeneratedPreviewHtml] = useState<string>('');

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

  // Configurar componentes habilitados según el template activo
  const enabledComponents = useMemo(() => {
    // Configuración para Storyboard
    if (activeTemplate === 'storyboard') {
      return {
        // Componentes de Texto - Esenciales para guiones
        heading: true,
        paragraph: true,
        bulletList: true,
        textWithIcon: false,

        // Componentes de Multimedia - Para referencias visuales
        image: true,
        gallery: true,
        imageText: true,
        twoColumns: false,
        chart: false,

        // Componentes de Diseño - Separadores útiles
        button: false,
        divider: true,
        spacer: true,

        // Componentes de Noticias - Deshabilitados
        category: false,
        author: false,
        summary: false,
        tituloConIcono: false,
        herramientas: false,
        respaldadoPor: false,

        // Newsletter - Deshabilitados
        newsletterHeaderReusable: false,
        newsletterFooterReusable: false,

        // Componentes de Producción - ⭐ Clave para storyboards
        fileAttachment: true,
      };
    }

    // Configuración por defecto para otros templates
    return {
      heading: true,
      paragraph: true,
      bulletList: true,
      textWithIcon: true,
      image: true,
      gallery: true,
      imageText: true,
      twoColumns: true,
      chart: true,
      button: false,
      divider: true,
      spacer: false,
      category: true,
      author: false,
      summary: true,
      tituloConIcono: true,
      herramientas: false,
      respaldadoPor: true,
      newsletterHeaderReusable: isNewsletterMode,
      newsletterFooterReusable: isNewsletterMode,
      fileAttachment: false,
    };
  }, [activeTemplate, isNewsletterMode]);

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
    gradientColors: ['#287FA9', '#1E2B62'], //['#FFF9CE', '#E2E5FA'],
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
    gradientColors: ['#287FA9', '#1E2B62'], // ['#f5f5f5', '#e0e0e0'],
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

  // Estado para el guardado de la nota
  const [savingNote, setSavingNote] = useState(false);

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

  // Hook para cargar post específico si es edición
  const { loading: loadingPost, post: currentPost } = usePost(noteData.currentNoteId);

  // ⚡ Forzar activeVersion a 'newsletter' cuando está en modo newsletter
  useEffect(() => {
    if (isNewsletterMode && activeVersion !== 'newsletter') {
      console.log('🔧 Forzando activeVersion a "newsletter" (estaba en:', activeVersion, ')');
      setActiveVersion('newsletter');
    }
  }, [isNewsletterMode, activeVersion]);

  // Cargar componentes iniciales cuando se abre un newsletter existente
  useEffect(() => {
    if (initialComponents && isNewsletterMode) {
      console.log('📦 Cargando componentes iniciales del newsletter:', {
        componentsCount: initialComponents.length,
        components: initialComponents,
        activeTemplate,
        activeVersion,
        componentTypes: initialComponents.map((c) => ({ id: c.id, type: c.type })),
      });

      emailComponents.updateActiveComponents(activeTemplate, 'newsletter', initialComponents);

      // Verificar que se cargaron correctamente
      setTimeout(() => {
        const loadedComponents = emailComponents.getActiveComponents(activeTemplate, 'newsletter');
        console.log('✅ Componentes cargados verificación:', {
          loadedCount: loadedComponents.length,
          loadedTypes: loadedComponents.map((c) => ({ id: c.id, type: c.type })),
        });
      }, 100);
    }
  }, [initialComponents, isNewsletterMode, activeTemplate]);

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

  // NUEVA FUNCIÓN: Generar HTML del preview
  const handleGeneratePreviewHtml = useCallback(async () => {
    try {
      const currentHeader = newsletterHeader || defaultNewsletterHeader;
      const currentFooter = newsletterFooter || defaultNewsletterFooter;

      console.log('🔄 Generando Preview HTML...');

      // Obtener todos los componentes activos
      const activeComponents = getActiveComponents();

      console.log('📦 Preview - All components:', {
        totalComponents: activeComponents.length,
        componentTypes: activeComponents.map((c) => ({ id: c.id, type: c.type })),
      });

      // Importar la función de renderizado
      const { renderComponentToHtml } = await import('../html-generators/index');

      // Construir el HTML procesando todos los componentes en orden
      let contentHtml = '';

      activeComponents.forEach((component) => {
        if (component.type === 'noteContainer') {
          // Renderizar noteContainer con sus componentes internos
          const noteBorderWidth = component.props?.containerBorderWidth ?? 1;
          const noteBorderColor = component.props?.containerBorderColor ?? '#e0e0e0';
          const noteBorderRadius = component.props?.containerBorderRadius ?? 12;
          const notePadding = component.props?.containerPadding ?? 10;
          const noteMaxWidth = component.props?.containerMaxWidth ?? 560;

          contentHtml += `<div class="note-section">`;
          contentHtml += `<div style="max-width: ${noteMaxWidth}px; margin: 0 auto; padding: ${notePadding}px; border-radius: ${noteBorderRadius}px; border: ${noteBorderWidth}px solid ${noteBorderColor}; margin-bottom: 24px;">`;

          // Renderizar componentes internos
          const componentsData = component.props?.componentsData || [];
          componentsData.forEach((innerComponent: any) => {
            contentHtml += renderComponentToHtml(innerComponent);
          });

          contentHtml += `</div></div>`;
        } else {
          // Renderizar componente suelto directamente
          contentHtml += `<div style="margin-bottom: 16px;">`;
          contentHtml += renderComponentToHtml(component);
          contentHtml += `</div>`;
        }
      });

      // Importar y usar el generador de template
      const { generateNewsletterTemplate } = await import(
        '../html-generators/templates/newsletter.template'
      );

      const html = generateNewsletterTemplate(
        newsletterTitle || 'Newsletter',
        newsletterDescription || '',
        contentHtml,
        currentHeader,
        currentFooter
      );

      setGeneratedPreviewHtml(html);
      console.log('✅ Preview HTML generado:', {
        componentsCount: activeComponents.length,
        htmlLength: html.length,
        htmlPreview: html.substring(0, 200) + '...',
      });
    } catch (error) {
      console.error('❌ Error generando preview HTML:', error);
    }
  }, [
    getActiveComponents,
    newsletterHeader,
    newsletterFooter,
    defaultNewsletterHeader,
    defaultNewsletterFooter,
    newsletterTitle,
    newsletterDescription,
  ]);

  // Auto-generar preview cuando cambian las notas o se activa el preview
  useEffect(() => {
    if (showPreview && isNewsletterMode) {
      handleGeneratePreviewHtml();
    }
  }, [showPreview, isNewsletterMode, handleGeneratePreviewHtml]);

  // Wrapper para onTogglePreview que también genera el HTML
  const handleTogglePreviewWrapper = useCallback(() => {
    handleGeneratePreviewHtml();
    onTogglePreview();
  }, [handleGeneratePreviewHtml, onTogglePreview]);

  const handleHeaderChange = (newHeader: NewsletterHeader) => {
    const currentHeader = newsletterHeader || defaultNewsletterHeader;
    const currentFooter = newsletterFooter || defaultNewsletterFooter;
    console.log('📤 onNewsletterConfigChange ejecutado con:', {
      header: newHeader,
      footer: currentFooter,
    });
    onNewsletterConfigChange({ header: newHeader, footer: currentFooter });
    console.log('✅ onNewsletterConfigChange llamado');
  };

  const handleFooterChange = (newFooter: NewsletterFooter) => {
    const currentHeader = newsletterHeader || defaultNewsletterHeader;
    onNewsletterConfigChange({ header: currentHeader, footer: newFooter });
  };

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
        highlight: noteData.highlight,
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
          noteTitle: noteTitle || 'Nota Agregada',
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
      // Storyboard solo soporta versión web
      if (activeTemplate === 'storyboard' && newVersion === 'newsletter') {
        console.warn('Storyboard solo soporta versión web');
        return;
      }
      versionSync.handleVersionChange(newVersion);
      setActiveVersion(newVersion);
      setSelectedComponentId(null); // Deseleccionar componente al cambiar de versión
    },
    [versionSync, activeTemplate]
  );

  // Función para generar el HTML del email
  const handleGenerateEmailHtml = useCallback(async () => {
    setGeneratingEmail(true);
    try {
      const components = getActiveComponents();
      // En versión web: sin bordes ni ancho máximo
      // En versión newsletter: con bordes y ancho máximo
      const containerConfig =
        activeVersion === 'web'
          ? {
              borderWidth: 0,
              borderColor: 'transparent',
              borderRadius: 0,
              padding: 0,
              maxWidth: undefined,
            }
          : {
              borderWidth: containerBorderWidth,
              borderColor: containerBorderColor,
              borderRadius: containerBorderRadius,
              padding: containerPadding,
              maxWidth: containerMaxWidth,
            };

      // Usar generateSingleNoteHtml para generar HTML de la nota individual
      const html = generateSingleNoteHtml(
        noteData.noteTitle || 'Nota',
        noteData.noteDescription || '',
        components,
        containerConfig
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
    activeVersion,
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
      console.log('🔄 generateHtmlForSending called:', {
        isNewsletterMode,
        newsletterTitle,
        newsletterDescription,
        newsletterNotesCount: newsletterNotes.length,
        newsletterHeader: !!newsletterHeader,
        newsletterFooter: !!newsletterFooter,
      });

      if (isNewsletterMode) {
        // Para newsletters, procesar todos los componentes activos en orden
        console.log('📝 Generando HTML para newsletter con componentes activos...');
        const activeComponents = getActiveComponents();

        console.log('📦 All components for sending:', {
          totalComponents: activeComponents.length,
          componentTypes: activeComponents.map((c) => ({ id: c.id, type: c.type })),
        });

        // Importar funciones necesarias
        const { renderComponentToHtml } = await import('../html-generators/index');
        const { generateNewsletterTemplate } = await import(
          '../html-generators/templates/newsletter.template'
        );

        // Construir el HTML procesando todos los componentes en orden
        let contentHtml = '';

        activeComponents.forEach((component) => {
          if (component.type === 'noteContainer') {
            // Renderizar noteContainer con sus componentes internos
            const noteContainerBorderWidth = component.props?.containerBorderWidth ?? 1;
            const noteContainerBorderColor = component.props?.containerBorderColor ?? '#e0e0e0';
            const noteContainerBorderRadius = component.props?.containerBorderRadius ?? 12;
            const noteContainerPadding = component.props?.containerPadding ?? 10;
            const noteContainerMaxWidth = component.props?.containerMaxWidth ?? 560;

            contentHtml += `<div class="note-section">`;
            contentHtml += `<div style="max-width: ${noteContainerMaxWidth}px; margin: 0 auto; padding: ${noteContainerPadding}px; border-radius: ${noteContainerBorderRadius}px; border: ${noteContainerBorderWidth}px solid ${noteContainerBorderColor}; margin-bottom: 24px;">`;

            // Renderizar componentes internos
            const componentsData = component.props?.componentsData || [];
            componentsData.forEach((innerComponent: any) => {
              contentHtml += renderComponentToHtml(innerComponent);
            });

            contentHtml += `</div></div>`;
          } else {
            // Renderizar componente suelto directamente
            contentHtml += `<div style="margin-bottom: 16px;">`;
            contentHtml += renderComponentToHtml(component);
            contentHtml += `</div>`;
          }
        });

        const generatedNewsletterHtml = generateNewsletterTemplate(
          newsletterTitle || 'Newsletter',
          newsletterDescription || '',
          contentHtml,
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

        console.log('✅ HTML de newsletter generado:', {
          componentsCount: activeComponents.length,
          htmlLength: generatedNewsletterHtml.length,
          htmlPreview: generatedNewsletterHtml.substring(0, 200) + '...',
        });

        return generatedNewsletterHtml;
      } else {
        // ✅ NUEVO: Para notas individuales, usar generateSingleNoteHtml (sin header y footer)
        console.log('📝 Generando HTML para nota individual...');
        const components = getActiveComponents();
        const postData = currentPost; // Usar la variable ya existente del scope superior

        // Configuración del contenedor desde el panel derecho
        // En versión web: sin bordes ni ancho máximo
        // En versión newsletter: con bordes y ancho máximo
        const containerConfig =
          activeVersion === 'web'
            ? {
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 0,
                padding: 0,
                maxWidth: undefined,
              }
            : {
                borderWidth: containerBorderWidth,
                borderColor: containerBorderColor,
                borderRadius: containerBorderRadius,
                padding: containerPadding,
                maxWidth: containerMaxWidth,
              };

        const singleNoteHtml = generateSingleNoteHtml(
          postData?.title || noteData.noteTitle || 'Nota',
          postData?.description || noteData.noteDescription || '',
          components,
          containerConfig
        );

        console.log('✅ HTML de nota individual generado:', {
          htmlLength: singleNoteHtml.length,
          htmlPreview: singleNoteHtml.substring(0, 200) + '...',
          activeVersion,
          containerConfig,
        });

        return singleNoteHtml;
      }
    } catch (error) {
      console.error('❌ Error generating HTML for sending:', error);
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
    activeVersion,
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
  }, []);

  // Función para manejar la selección de componentes
  const handleComponentSelect = useCallback((componentId: string | null) => {
    setSelectedComponentId(componentId);

    // Si se selecciona un componente, resetear la selección del contenedor
    if (componentId) {
      setIsContainerSelected(false);
    }
  }, []);

  // 🔄 NUEVO: Sincronizar estados del panel derecho cuando cambia el componente seleccionado
  useEffect(() => {
    if (selectedComponentId) {
      const components = getActiveComponents();
      const selectedComponent = findComponentByIdUtil(components, selectedComponentId);

      if (selectedComponent) {
        const style = selectedComponent.style || {};

        // Actualizar alineación - solo si está definida
        if (style.textAlign !== undefined) {
          textFormatting.setSelectedAlignment(style.textAlign as string);
        } else {
          textFormatting.setSelectedAlignment('left');
        }

        // Actualizar color - solo si está definido
        if (style.color !== undefined) {
          textFormatting.setSelectedColor(style.color as string);
        } else {
          textFormatting.setSelectedColor('#000000');
        }

        // Actualizar fuente - solo si está definida
        if (style.fontFamily !== undefined) {
          textFormatting.setSelectedFont(style.fontFamily as string);
        } else {
          textFormatting.setSelectedFont('Public Sans');
        }

        // Actualizar tamaño de fuente - solo si está definido
        if (style.fontSize !== undefined) {
          const fontSizeValue = String(style.fontSize).replace('px', '');
          textFormatting.setSelectedFontSize(fontSizeValue);
        } else {
          textFormatting.setSelectedFontSize('16');
        }

        // Actualizar peso de fuente - solo si está definido
        if (style.fontWeight !== undefined) {
          textFormatting.setSelectedFontWeight(style.fontWeight as string);
        } else {
          textFormatting.setSelectedFontWeight('normal');
        }

        console.log('🔄 Estados del panel derecho sincronizados:', {
          componentId: selectedComponentId,
          componentType: selectedComponent.type,
          alignment: style.textAlign || 'left',
          color: style.color || '#000000',
          font: style.fontFamily || 'Public Sans',
          fontSize: style.fontSize || '16px',
          fontWeight: style.fontWeight || 'normal',
        });
      }
    }
  }, [selectedComponentId]);

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
    setSavingNote(true);

    // Activar validaciones visuales
    setShowValidationErrors(true);

    try {
      // Validaciones
      if (!noteData.noteTitle.trim()) {
        showNotification('El título es obligatorio', 'error');
        setSavingNote(false);
        // Asegurar que el panel derecho esté en la configuración de la nota
        setIsContainerSelected(true);
        return;
      }

      // Validar campos de metadata obligatorios
      if (!noteData.contentTypeId) {
        showNotification('El tipo de contenido es obligatorio', 'error');
        setSavingNote(false);
        setIsContainerSelected(true);
        return;
      }

      if (!noteData.audienceId) {
        showNotification('La audiencia es obligatoria', 'error');
        setSavingNote(false);
        setIsContainerSelected(true);
        return;
      }

      if (!noteData.categoryId) {
        showNotification('La categoría es obligatoria', 'error');
        setSavingNote(false);
        setIsContainerSelected(true);
        return;
      }

      if (!noteData.subcategoryId) {
        showNotification('La subcategoría es obligatoria', 'error');
        setSavingNote(false);
        setIsContainerSelected(true);
        return;
      }

      // Verificar que la imagen de portada esté en S3 si existe
      if (noteData.noteCoverImageUrl && noteData.noteCoverImageUrl.startsWith('data:image/')) {
        showNotification(
          '⚠️ La imagen de portada debe estar subida a S3 antes de guardar',
          'warning'
        );
        setSavingNote(false);
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

      let result;

      if (noteData.isEditingExistingNote && noteData.currentNoteId) {
        // Actualizar post existente - solo enviar campos de UpdatePostData
        const updateData = {
          title: noteData.noteTitle.trim(),
          description: noteData.noteDescription || '',
          coverImageUrl: noteData.noteCoverImageUrl || '',
          objData: objDataString,
          objDataWeb: objDataWebString,
          configPost: JSON.stringify(configPostObject),
          content: '', // Campo requerido por el backend (puede estar vacío)
          highlight: noteData.highlight,
          // ✅ Incluir campos de metadata que pueden ser editados
          contentTypeId: noteData.contentTypeId,
          audienceId: noteData.audienceId || null,
          categoryId: noteData.categoryId || null,
          subcategoryId: noteData.subcategoryId || null,
        };

        console.log('📝 Actualizando post existente:', {
          postId: noteData.currentNoteId,
          fields: Object.keys(updateData),
        });

        result = await updatePost(noteData.currentNoteId, updateData);
      } else {
        // Crear nuevo post - enviar campos de CreatePostData
        const createData = {
          title: noteData.noteTitle.trim(),
          description: noteData.noteDescription || '',
          coverImageUrl: noteData.noteCoverImageUrl || '',
          objData: objDataString,
          objDataWeb: objDataWebString,
          configPost: JSON.stringify(configPostObject),
          origin: 'ADAC',
          highlight: noteData.highlight,
          contentTypeId: noteData.contentTypeId,
          audienceId: noteData.audienceId || null,
          // El backend espera valores singulares, no arrays
          categoryId: noteData.categoryId || null,
          subcategoryId: noteData.subcategoryId || null,
        };

        console.log('📝 Creando post nuevo:', {
          fields: Object.keys(createData),
        });

        result = await createPost(createData);
        if (result) {
          noteData.setCurrentNoteId(result.id);
          noteData.setIsEditingExistingNote(true);

          // Redirigir a la ruta de edición si se proporciona el callback
          if (onSaveRedirect) {
            onSaveRedirect(result.id);
          }
        }
      }

      if (result) {
        const finalImageStats = getImageStats(objDataString, objDataWebString);

        const successMessage =
          finalImageStats.total > 0
            ? `Nota ${noteData.isEditingExistingNote ? 'actualizada' : 'guardada'} correctamente con ${finalImageStats.total} imagen(es) en S3`
            : `Nota ${noteData.isEditingExistingNote ? 'actualizada' : 'guardada'} correctamente`;

        showNotification(successMessage, 'success');

        // Resetear validaciones visuales después de guardar exitosamente
        setShowValidationErrors(false);

        // 🔄 NUEVO: Resetear detección de cambios después de guardar exitosamente
        resetChangeDetection();
      } else {
        throw new Error('No se pudo guardar la nota');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      showNotification('Error al guardar la nota', 'error');
    } finally {
      setSavingNote(false);
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

  // Cargar coverImageUrl inicial cuando es modo newsletter
  useEffect(() => {
    if (isNewsletterMode && initialCoverImageUrl) {
      console.log('🖼️ Cargando coverImageUrl inicial del newsletter:', initialCoverImageUrl);
      noteData.setNoteCoverImageUrl(initialCoverImageUrl);
    }
  }, [isNewsletterMode, initialCoverImageUrl, noteData]);

  // Cargar datos del post cuando se edite una nota existente
  useEffect(() => {
    if (currentPost && noteData.isEditingExistingNote) {
      // Extraer metadata usando categoryIDs y subcategoryIDs (arrays de strings)
      const contentTypeId = (currentPost as any).contentTypeId || '';
      const audienceId = (currentPost as any).audienceId || '';

      console.log('📝 Cargando metadata de nota existente (paso 1 - básicos):', {
        contentTypeId,
        audienceId,
      });

      // Solo cargar datos básicos primero (sin categoryId/subcategoryId)
      // Estos se setearán después cuando se carguen las categorías
      noteData.loadNoteData({
        title: currentPost.title,
        description: currentPost.description,
        coverImageUrl: currentPost.coverImageUrl,
        status: (currentPost.status as PostStatus) || 'DRAFT',
        contentTypeId,
        audienceId,
        highlight: (currentPost as any).highlight || false,
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
            // Storyboard solo soporta versión web
            if (configPost.templateType === 'storyboard') {
              setActiveVersion('web');
            } else {
              setActiveVersion(configPost.activeVersion);
            }
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

  // Setear categoryId y subcategoryId después de que se carguen las categorías
  useEffect(() => {
    // Solo ejecutar cuando:
    // 1. Se está editando una nota existente
    // 2. Ya se tiene contentTypeId
    // 3. Hay un currentPost con categoryIDs/subcategoryIDs
    if (noteData.isEditingExistingNote && noteData.contentTypeId && currentPost) {
      const categoryIDs = (currentPost as any).categoryIDs || [];
      const subcategoryIDs = (currentPost as any).subcategoryIDs || [];

      console.log('📝 Verificando categorías para cargar (paso 2):', {
        categoryIDs,
        subcategoryIDs,
        currentCategoryId: noteData.categoryId,
        currentSubcategoryId: noteData.subcategoryId,
      });

      // Setear categoryId solo si aún no está seteado y hay datos
      if (!noteData.categoryId && categoryIDs.length > 0) {
        console.log('✅ Seteando categoryId:', categoryIDs[0]);
        noteData.setCategoryId(categoryIDs[0]);
      }

      // Setear subcategoryId solo si aún no está seteado y hay datos
      if (!noteData.subcategoryId && subcategoryIDs.length > 0) {
        console.log('✅ Seteando subcategoryId:', subcategoryIDs[0]);
        noteData.setSubcategoryId(subcategoryIDs[0]);
      }
    }
  }, [
    noteData.contentTypeId,
    currentPost,
    noteData.isEditingExistingNote,
    noteData.categoryId,
    noteData.subcategoryId,
  ]);

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

  // NUEVA FUNCIÓN: Debugging específico para componentes inyectados
  const debugInjectedComponentSelection = useCallback(
    (componentId: string) => {
      console.log('🔍 Debugging injected component selection:', {
        componentId,
        isNewsletterMode,
        hasInjectedPattern: componentId.includes('-injected-'),
        hasDashPattern: componentId.includes('-'),
        components: getActiveComponents().map((c) => ({ id: c.id, type: c.type })),
      });

      // Buscar el componente en toda la estructura
      const foundComponent = findComponentByIdUtil(getActiveComponents(), componentId);

      if (foundComponent) {
        console.log('✅ Componente encontrado:', {
          id: foundComponent.id,
          type: foundComponent.type,
          isInjected: componentId.includes('-injected-'),
        });
      } else {
        console.log('❌ Componente NO encontrado:', componentId);

        // Debug adicional para componentes inyectados
        if (componentId.includes('-injected-')) {
          const noteContainers = getActiveComponents().filter((c) => c.type === 'noteContainer');
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
    },
    [isNewsletterMode, getActiveComponents]
  );

  // NUEVA FUNCIÓN: Manejo mejorado de selección de componentes inyectados
  const handleInjectedComponentSelection = useCallback(
    (componentId: string) => {
      console.log('🎯 handleInjectedComponentSelection called with:', componentId);

      // Debug del componente
      const debugResult = debugInjectedComponentSelection(componentId);

      if (debugResult) {
        console.log('✅ Componente encontrado y listo para edición:', {
          id: debugResult.id,
          type: debugResult.type,
          isInjected: componentId.includes('-injected-'),
        });
        return debugResult;
      } else {
        console.log('❌ Componente no encontrado, intentando búsqueda alternativa');

        // Búsqueda alternativa: buscar en contenedores de nota
        const components = getActiveComponents();
        const noteContainers = components.filter((c) => c.type === 'noteContainer');

        for (const container of noteContainers) {
          if (container.props?.componentsData) {
            const foundInContainer = container.props.componentsData.find(
              (comp: any) => comp.id === componentId
            );
            if (foundInContainer) {
              console.log('✅ Componente encontrado en contenedor:', {
                containerId: container.id,
                componentId: foundInContainer.id,
                componentType: foundInContainer.type,
              });
              return foundInContainer;
            }
          }
        }

        console.log('❌ Componente no encontrado en ninguna ubicación');
        return null;
      }
    },
    [debugInjectedComponentSelection, getActiveComponents]
  );

  // NUEVA FUNCIÓN: Obtener el ID real del componente para el panel
  const getComponentIdForPanel = useCallback(() => {
    if (isNewsletterMode && selectedComponentId && selectedComponentId.includes('-')) {
      console.log('🔧 getComponentIdForPanel - Processing:', selectedComponentId);

      // NO procesar los IDs especiales de newsletter header y footer
      if (
        selectedComponentId === 'newsletter-header' ||
        selectedComponentId === 'newsletter-footer'
      ) {
        console.log('✅ Es header/footer del newsletter, usando ID completo:', selectedComponentId);
        return selectedComponentId;
      }

      // Verificar si el componente existe en el array activo con su ID completo
      const components = getActiveComponents();
      const component = components.find((c) => c.id === selectedComponentId);

      if (component) {
        // Si encontramos el componente con su ID completo, usarlo directamente
        console.log('✅ Componente encontrado con ID completo:', selectedComponentId);
        return selectedComponentId;
      }

      // Verificar si es un componente inyectado (tiene el patrón -injected-)
      if (selectedComponentId.includes('-injected-')) {
        console.log('✅ Es un componente inyectado, usando ID completo:', selectedComponentId);
        return selectedComponentId;
      }

      // Si no se encontró, puede ser un componente dentro de una nota
      // (formato antiguo: noteId-componentId)
      const firstDashIndex = selectedComponentId.indexOf('-');
      const componentId = selectedComponentId.substring(firstDashIndex + 1);
      console.log('🔄 Componente de newsletter, extrayendo ID:', componentId);
      return componentId;
    }
    return selectedComponentId;
  }, [isNewsletterMode, selectedComponentId, getActiveComponents]);

  // NUEVA FUNCIÓN: Verificar que las actualizaciones se aplican correctamente
  const verifyComponentUpdate = useCallback(
    (componentId: string, updateType: string, data: any) => {
      console.log('🔍 Verificando actualización del componente:', {
        componentId,
        updateType,
        data,
        timestamp: new Date().toISOString(),
      });

      // Buscar el componente después de la actualización
      const components = getActiveComponents();
      const foundComponent = findComponentByIdUtil(components, componentId);

      if (foundComponent) {
        console.log('✅ Componente encontrado después de actualización:', {
          id: foundComponent.id,
          type: foundComponent.type,
          content: foundComponent.content?.substring(0, 50) + '...',
          hasProps: !!foundComponent.props,
          hasStyle: !!foundComponent.style,
        });

        // Verificar que los datos se aplicaron correctamente
        let updateVerified = false;

        switch (updateType) {
          case 'content':
            updateVerified = foundComponent.content === data;
            break;
          case 'props':
            // Verificar que al menos una prop se aplicó
            updateVerified = Object.keys(data).some(
              (key) => foundComponent.props && foundComponent.props[key] === data[key]
            );
            break;
          case 'style':
            // Verificar que al menos un estilo se aplicó
            updateVerified = Object.keys(data).some(
              (key) => foundComponent.style && foundComponent.style[key] === data[key]
            );
            break;
          default:
            updateVerified = false;
            break;
        }

        if (updateVerified) {
          console.log('✅ Actualización verificada correctamente');
        } else {
          console.warn('⚠️ Actualización no verificada, posible problema');
        }

        return updateVerified;
      } else {
        console.error('❌ Componente no encontrado después de actualización');
        return false;
      }
    },
    [getActiveComponents]
  );

  // NUEVA FUNCIÓN: Función de actualización que funciona tanto para newsletter como modo normal
  const updateComponentForPanel = useCallback(
    (updateType: 'content' | 'props' | 'style', id: string, data: any) => {
      console.log('🔄 updateComponentForPanel called:', {
        updateType,
        id,
        data,
        isNewsletterMode,
        selectedComponentId,
        isInjected: selectedComponentId?.includes('-injected-'),
      });

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
          console.log('✅ Es un contenedor de nota, usando funciones normales');
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

        // NUEVA LÓGICA: Manejar componentes inyectados específicamente
        if (selectedComponentId.includes('-injected-')) {
          console.log('🎯 Componente inyectado detectado, actualizando directamente');

          // Buscar el componente inyectado en los contenedores de nota
          const noteContainers = components.filter((c) => c.type === 'noteContainer');
          let componentUpdated = false;

          for (const container of noteContainers) {
            if (container.props?.componentsData) {
              const componentIndex = container.props.componentsData.findIndex(
                (comp: any) => comp.id === selectedComponentId
              );

              if (componentIndex !== -1) {
                console.log('✅ Componente inyectado encontrado en contenedor:', {
                  containerId: container.id,
                  componentId: selectedComponentId,
                  componentIndex,
                });

                // Crear una copia del contenedor con el componente actualizado
                const updatedContainer = {
                  ...container,
                  props: {
                    ...container.props,
                    componentsData: [...container.props.componentsData],
                  },
                };

                // Actualizar el componente específico
                const updatedComponent = {
                  ...updatedContainer.props.componentsData[componentIndex],
                };

                switch (updateType) {
                  case 'content':
                    updatedComponent.content = data;
                    break;
                  case 'props':
                    updatedComponent.props = { ...updatedComponent.props, ...data };
                    break;
                  case 'style':
                    updatedComponent.style = { ...updatedComponent.style, ...data };
                    break;
                  default:
                    console.warn('Unknown update type for injected component:', updateType);
                }

                updatedContainer.props.componentsData[componentIndex] = updatedComponent;

                // Actualizar el contenedor en la lista de componentes
                const updatedComponents = components.map((c) =>
                  c.id === container.id ? updatedContainer : c
                );

                updateActiveComponents(updatedComponents);
                componentUpdated = true;
                console.log('✅ Componente inyectado actualizado exitosamente');

                // Verificar que la actualización se aplicó correctamente
                setTimeout(() => {
                  verifyComponentUpdate(selectedComponentId, updateType, data);
                }, 100);

                break;
              }
            }
          }

          if (!componentUpdated) {
            console.warn('❌ No se pudo actualizar el componente inyectado:', selectedComponentId);
          }

          return;
        }

        // Si hay un componente seleccionado de una nota del newsletter (formato: noteId-componentId)
        if (selectedComponentId.includes('-') && !selectedComponentId.includes('-injected-')) {
          console.log('🔄 Componente de newsletter normal, procesando con funciones específicas');
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
      console.log('🔄 Modo normal, usando funciones originales');
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
  }, [findAllPosts]);

  // Cargar notas cuando se selecciona el template newsletter
  useEffect(() => {
    if (isNewsletterMode) {
      loadAvailableNotes();
    }
  }, [isNewsletterMode, loadAvailableNotes]);

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
        showNotification(`✅ Nota "${fullNote.title}" Agregada exitosamente`, 'success');
        console.log(`✅ Nota "${fullNote.title}" Agregada exitosamente`);
      } catch (error) {
        console.error('Error al inyectar la nota:', error);
        showNotification('Error al inyectar la nota', 'error');
      }
    },
    [findPostById, injectComponentsToNewsletter]
  );

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        flexDirection: 'column',
        background:
          'linear-gradient(180deg, rgba(83, 130, 186, 0.05) 0%, rgba(83, 132, 188, 0.03) 121.05%), #FFF;',
      }}
    >
      {/* Barra de navegación superior */}
      <EditorHeader
        onClose={handleCloseWithConfirmation}
        isEditingExistingNote={noteData.isEditingExistingNote}
        initialNote={initialNote}
        activeVersion={activeVersion}
        activeTemplate={activeTemplate}
        handleVersionChange={handleVersionChange}
        onSave={handleSaveNote}
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
        // Nueva prop para el título del newsletter
        newsletterTitle={newsletterTitle}
        // Nueva prop para obtener componentes activos
        getActiveComponents={getActiveComponents}
        // Nueva prop para actualizar el ID del newsletter
        onNewsletterIdChange={onNewsletterIdChange}
        // Nueva prop para la imagen de portada
        noteCoverImageUrl={noteData.noteCoverImageUrl}
        // Nueva prop para el ID de la nota actual
        currentNoteId={noteData.currentNoteId}
        // Nueva prop para mostrar notificaciones
        showNotification={showNotification}
        // Nuevas props para el status del newsletter y actualización
        newsletterStatus={newsletterStatus}
        onNewsletterUpdate={onNewsletterUpdate}
        // Props para modo view-only
        isViewOnly={isViewOnly}
        onCreateCopy={onCreateCopy}
        // Props para preview HTML
        showPreview={showPreview}
        onTogglePreview={handleTogglePreviewWrapper}
        newsletterHtmlPreview={generatedPreviewHtml || newsletterHtmlPreview}
      />

      {/* Contenedor principal */}
      {(() => {
        console.log('🔍 Preview Debug:', {
          showPreview,
          activeTemplate,
          isViewOnly,
          shouldShowPreview: showPreview && activeTemplate === 'newsletter',
        });
        return null;
      })()}
      {showPreview && activeTemplate === 'newsletter' ? (
        // Preview centrado sin paneles laterales
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            height: '100%',
            overflow: 'auto',
            p: 3,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '800px',
              backgroundColor: 'white',
              boxShadow: 3,
              borderRadius: 1,
            }}
          >
            <iframe
              srcDoc={generatedPreviewHtml || newsletterHtmlPreview}
              style={{
                width: '100%',
                height: 'calc(100vh - 150px)',
                border: 'none',
              }}
              title="Newsletter Preview"
            />
          </Box>
        </Box>
      ) : (
        // Editor normal con paneles laterales
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Panel izquierdo - Componentes */}
          <Box
            sx={(theme) => ({
              width: `${resizablePanels.leftPanelWidth}px`,
              minWidth: `${resizablePanels.MIN_PANEL_WIDTH}px`,
              maxWidth: `${resizablePanels.MAX_PANEL_WIDTH}px`,
              flexShrink: 0,
              padding: '16px',
              paddingTop: '0px',
              background: 'transparent',
              position: 'relative',
            })}
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
              defaultTemplate={defaultTemplate}
              excludeTemplates={excludeTemplates}
              initialNote={initialNote}
              generatingEmail={generatingEmail}
              handleGenerateEmailHtml={handleGenerateEmailHtml}
              activeVersion={activeVersion}
              setActiveVersion={handleVersionChange}
              enabledComponents={enabledComponents}
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
              // Prop para modo view-only
              isViewOnly={isViewOnly}
            />

            {/* Barra de redimensionado izquierda */}
            <Box
              onMouseDown={resizablePanels.handleMouseDownLeft}
              sx={{
                position: 'absolute',
                top: 0,
                right: 12,
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
            sx={{ flexGrow: 1, overflow: 'auto', backgroundColor: 'transparent' }}
            ref={editorRef}
          >
            {/* Visualización de los componentes del email */}
            <EmailContent
              getActiveComponents={getActiveComponents}
              selectedComponentId={selectedComponentId}
              setSelectedComponentId={isViewOnly ? () => {} : setSelectedComponentId}
              onComponentSelect={isViewOnly ? () => {} : handleComponentSelect}
              updateComponentContent={isViewOnly ? () => {} : updateComponentContent}
              updateComponentProps={isViewOnly ? () => {} : updateComponentProps}
              updateComponentStyle={isViewOnly ? () => {} : updateComponentStyle}
              handleSelectionUpdate={isViewOnly ? () => {} : textFormatting.handleSelectionUpdate}
              moveComponent={isViewOnly ? () => {} : moveComponent}
              removeComponent={isViewOnly ? () => {} : removeComponent}
              addComponent={isViewOnly ? () => {} : addComponent}
              addListItem={isViewOnly ? () => {} : addListItem}
              removeListItem={isViewOnly ? () => {} : removeListItem}
              updateListItem={isViewOnly ? () => {} : updateListItem}
              editMode={isViewOnly ? false : editMode}
              isViewOnly={isViewOnly}
              selectedBanner={selectedBanner}
              bannerOptions={bannerOptions}
              emailBackground={emailBackground}
              showGradient={showGradient}
              gradientColors={gradientColors}
              onContainerClick={handleContainerSelect}
              isContainerSelected={isContainerSelected}
              containerBorderWidth={activeVersion === 'web' ? 0 : containerBorderWidth}
              containerBorderColor={activeVersion === 'web' ? 'transparent' : containerBorderColor}
              containerBorderRadius={activeVersion === 'web' ? 0 : containerBorderRadius}
              containerPadding={activeVersion === 'web' ? 0 : containerPadding}
              containerMaxWidth={activeVersion === 'web' ? undefined : containerMaxWidth}
              activeTemplate={activeTemplate}
              activeVersion={activeVersion}
              // Nuevas props para newsletter
              isNewsletterMode={isNewsletterMode}
              newsletterNotes={newsletterNotes}
              onMoveNewsletterNote={isViewOnly ? () => {} : handleMoveNewsletterNote}
              onRemoveNewsletterNote={isViewOnly ? () => {} : handleRemoveNewsletterNote}
              onEditNewsletterNote={isViewOnly ? () => {} : handleEditNoteFromLibrary}
              // Nuevas props para preview HTML
              showNewsletterPreview={showNewsletterPreview}
              newsletterHtml={newsletterHtml}
              // Nuevas funciones para editar componentes de newsletter
              updateNewsletterNoteComponentContent={
                isViewOnly ? () => {} : updateNewsletterNoteComponentContent
              }
              updateNewsletterNoteComponentProps={
                isViewOnly ? () => {} : updateNewsletterNoteComponentProps
              }
              updateNewsletterNoteComponentStyle={
                isViewOnly ? () => {} : updateNewsletterNoteComponentStyle
              }
              moveNewsletterNoteComponent={isViewOnly ? () => {} : moveNewsletterNoteComponent}
              removeNewsletterNoteComponent={isViewOnly ? () => {} : removeNewsletterNoteComponent}
              // Props para componentes de newsletter (header y footer)
              newsletterHeader={newsletterHeader || defaultNewsletterHeader}
              newsletterFooter={newsletterFooter || defaultNewsletterFooter}
              onNewsletterHeaderUpdate={
                isViewOnly
                  ? () => {}
                  : (header) =>
                      onNewsletterConfigChange({
                        header,
                        footer: newsletterFooter || defaultNewsletterFooter,
                      })
              }
              onNewsletterFooterUpdate={
                isViewOnly
                  ? () => {}
                  : (footer) =>
                      onNewsletterConfigChange({
                        header: newsletterHeader || defaultNewsletterHeader,
                        footer,
                      })
              }
              removeNoteContainer={isViewOnly ? () => {} : removeNoteContainer}
              onColumnSelect={isViewOnly ? () => {} : handleColumnSelect}
              selectedColumn={selectedColumn}
            />
          </Box>

          {/* Panel derecho - Formato y estilo */}
          <Box
            sx={(theme) => ({
              width: `${resizablePanels.rightPanelWidth}px`,
              minWidth: `${resizablePanels.MIN_PANEL_WIDTH}px`,
              maxWidth: `${resizablePanels.MAX_PANEL_WIDTH}px`,
              flexShrink: 0,
              padding: '16px',
              paddingTop: '0px',
              background: 'transparent',
              position: 'relative',
            })}
          >
            {/* Barra de redimensionado derecha */}
            <Box
              onMouseDown={resizablePanels.handleMouseDownRight}
              sx={{
                position: 'absolute',
                top: 0,
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
              selectedComponentId={getComponentIdForPanel()}
              setSelectedComponentId={setSelectedComponentId}
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
              applyTextAlignment={(alignment) =>
                textFormatting.applyTextAlignment(
                  alignment,
                  selectedComponentId,
                  updateComponentStyle
                )
              }
              applyTextColor={(color) =>
                textFormatting.applyTextColor(color, selectedComponentId, updateComponentStyle)
              }
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
              contentTypeId={noteData.contentTypeId}
              setContentTypeId={noteData.setContentTypeId}
              audienceId={noteData.audienceId}
              setAudienceId={noteData.setAudienceId}
              categoryId={noteData.categoryId}
              setCategoryId={noteData.setCategoryId}
              subcategoryId={noteData.subcategoryId}
              setSubcategoryId={noteData.setSubcategoryId}
              selectedColumn={selectedColumn}
              injectComponentsToNewsletter={injectComponentsToNewsletter}
              removeNoteContainer={removeNoteContainer}
              showValidationErrors={showValidationErrors}
              highlight={noteData.highlight}
              setHighlight={noteData.setHighlight}
              // Props para newsletter
              isNewsletterMode={isNewsletterMode}
              newsletterTitle={newsletterTitle}
              onNewsletterTitleChange={(title) =>
                onNewsletterInfoChange({ title, description: newsletterDescription })
              }
              newsletterDescription={newsletterDescription}
              onNewsletterDescriptionChange={(description) =>
                onNewsletterInfoChange({ title: newsletterTitle, description })
              }
              newsletterHeader={newsletterHeader || defaultNewsletterHeader}
              newsletterFooter={newsletterFooter || defaultNewsletterFooter}
              onHeaderChange={handleHeaderChange}
              onFooterChange={handleFooterChange}
              onNewsletterConfigChange={onNewsletterConfigChange}
              newsletterStatus={newsletterStatus}
              currentNewsletterId={currentNewsletterId}
              onNewsletterUpdate={onNewsletterUpdate}
              // Prop para modo view-only
              isViewOnly={isViewOnly}
            />
          </Box>
        </Box>
      )}

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
