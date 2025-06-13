'use client';

import type React from 'react';
import type { SavedNote } from 'src/types/saved-note';

import { Icon } from '@iconify/react';
import { useRef, useState, useEffect, useCallback } from 'react';

import { Box, Button, Typography } from '@mui/material';

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
import { generateEmailHtml } from './utils/generate-html';
import { SaveNoteDialog } from './components/SaveNoteDialog';
import { useTextFormatting } from './hooks/useTextFormatting';
import { useEmailComponents } from './hooks/useEmailComponents';
import { useResizablePanels } from './hooks/useResizablePanels';
import { UnsavedChangesDialog } from './components/UnsavedChangesDialog';
import { getImageStats, validateAllImagesUploaded } from './utils/imageValidation';
import {
  createNewComponent,
  addComponentToArray,
  moveComponentInArray,
  updateComponentInArray,
  removeComponentFromArray,
  convertTextToList as convertParagraphToList,
} from './utils/componentHelpers';

import type { ComponentType } from './types';

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

export const EmailEditorMain: React.FC<EmailEditorProps> = ({
  initialTemplate = 'blank',
  onSave,
  savedNotes = [],
  onSaveNote,
  onClose = () => {},
  initialNote = null,
  isNewsletterMode = false,
}) => {
  // Estados básicos del editor
  const [activeTab, setActiveTab] = useState<string>('contenido');
  const [activeTemplate, setActiveTemplate] = useState<string>(initialTemplate);
  const [activeVersion, setActiveVersion] = useState<'newsletter' | 'web'>('newsletter');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    basic: true,
  });
  const [generatingEmail, setGeneratingEmail] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isContainerSelected, setIsContainerSelected] = useState<boolean>(false);

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
  const { create: createPost, update: updatePost } = usePostStore();

  // Usar hooks personalizados
  const emailComponents = useEmailComponents();
  const noteData = useNoteData();
  const textFormatting = useTextFormatting();
  const resizablePanels = useResizablePanels();

  // Hook para cargar post específico si es edición
  const { loading: loadingPost, post: currentPost } = usePost(noteData.currentNoteId);

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

      console.log('🚀 Calling updatePost with noteId:', noteData.currentNoteId);

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
      const currentComponent = components.find((comp) => comp.id === id);
      if (currentComponent && currentComponent.content === content) {
        console.log('🔵 No changes detected, skipping update');
        return; // No hay cambios, evitar re-render
      }

      console.log('🟢 Content changed, updating component');
      const updatedComponents = updateComponentInArray(components, id, { content });
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
      const component = components.find((comp) => comp.id === id);
      if (!component) return;

      const updatedProps = { ...component.props, ...props };
      const updatedComponents = updateComponentInArray(components, id, { props: updatedProps });
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
      const component = components.find((comp) => comp.id === id);
      if (!component) return;

      const updatedStyle = { ...component.style, ...style };
      const updatedComponents = updateComponentInArray(components, id, { style: updatedStyle });
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
      showNotification('Error generating email HTML', 'error');
    } finally {
      setGeneratingEmail(false);
    }
  }, [
    getActiveComponents,
    activeTemplate,
    selectedBanner,
    emailBackground,
    showGradient,
    gradientColors,
    containerBorderWidth,
    containerBorderColor,
    containerBorderRadius,
    containerPadding,
    containerMaxWidth,
    showNotification,
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
    if (componentId) {
      setIsContainerSelected(false);
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
        status: (currentPost.status as 'draft' | 'published' | 'archived') || 'draft',
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
          setActiveTemplate(configPost.templateType || 'blank');
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
      />

      {/* Banner de sincronización automática */}
      {versionSync.syncEnabled && (
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

      {/* ❌ ELIMINADO: Indicador de Auto-guardado */}

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
            setActiveTemplate={setActiveTemplate}
            generatingEmail={generatingEmail}
            handleGenerateEmailHtml={handleGenerateEmailHtml}
            setOpenSaveDialog={() => noteData.setOpenSaveDialog(true)}
            activeVersion={activeVersion}
            setActiveVersion={handleVersionChange}
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
            setSelectedComponentId={handleComponentSelect}
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

          <RightPanel
            selectedComponentId={selectedComponentId}
            rightPanelTab={rightPanelTab}
            setRightPanelTab={setRightPanelTab}
            getActiveComponents={getActiveComponents}
            updateComponentProps={updateComponentProps}
            updateComponentStyle={updateComponentStyle}
            updateComponentContent={updateComponentContent}
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
            noteTitle={noteData.noteTitle}
            setNoteTitle={noteData.setNoteTitle}
            noteDescription={noteData.noteDescription}
            setNoteDescription={noteData.setNoteDescription}
            noteCoverImageUrl={noteData.noteCoverImageUrl}
            setNoteCoverImageUrl={noteData.setNoteCoverImageUrl}
            noteStatus={noteData.noteStatus}
            setNoteStatus={noteData.setNoteStatus}
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
      {hasUnsavedChanges && (
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
      )}

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
