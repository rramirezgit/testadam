'use client';

import type React from 'react';
import type { Editor } from '@tiptap/react';
import type { SavedNote, EmailComponent } from 'src/types/saved-note';

import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';

import { Box, Button, TextField } from '@mui/material';

import { useStore } from 'src/lib/store';

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

// Update the interface to include initialNote, isNewsletterMode, and onSave
interface EmailEditorProps {
  onClose: () => void;
  initialNote?: SavedNote | null;
  isNewsletterMode?: boolean;
  onSave?: (note: SavedNote) => void;
}

export default function EmailEditor({
  onClose,
  initialNote,
  isNewsletterMode = false,
  onSave,
}: EmailEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('contenido');
  const [activeTemplate, setActiveTemplate] = useState('notion');
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

  // Estado para la sincronización automática
  const [syncEnabled, setSyncEnabled] = useState<boolean>(false);
  const [lastSyncedVersion, setLastSyncedVersion] = useState<'newsletter' | 'web' | null>(null);

  // Use Zustand store
  const { addNote, updateNote, addSelectedNote } = useStore();

  // Estado para los componentes de cada plantilla
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

  // Estado para los componentes de cada plantilla
  const [blankComponentsState, setBlankComponents] = useState<EmailComponent[]>([]);
  const [blankComponentsWebState, setBlankComponentsWeb] = useState<EmailComponent[]>([]);

  // Obtener los componentes activos según la plantilla seleccionada y la versión activa
  const getActiveComponents = () => {
    if (activeVersion === 'web') {
      // Retornar componentes de la versión web
      switch (activeTemplate) {
        case 'blank':
          return blankComponentsWebState;
        case 'news':
          return newsComponentsWebState;
        case 'notion':
          return notionComponentsWebState;
        case 'plaid':
          return plaidComponentsWebState;
        case 'stripe':
          return stripeComponentsWebState;
        case 'vercel':
          return vercelComponentsWebState;
        default:
          return blankComponentsWebState;
      }
    } else {
      // Retornar componentes de la versión newsletter
      switch (activeTemplate) {
        case 'blank':
          return blankComponentsState;
        case 'news':
          return newsComponentsState;
        case 'notion':
          return notionComponentsState;
        case 'plaid':
          return plaidComponentsState;
        case 'stripe':
          return stripeComponentsState;
        case 'vercel':
          return vercelComponentsState;
        default:
          return blankComponentsState;
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

  // Función de utilidad para mostrar una notificación de sincronización
  const showSyncNotification = (
    fromVersion: 'newsletter' | 'web',
    toVersion: 'newsletter' | 'web'
  ) => {
    // Si ya hay una notificación abierta, no mostrar otra para evitar spam
    if (openSnackbar) return;

    setSnackbarMessage(
      `Cambios sincronizados de ${fromVersion === 'newsletter' ? 'Newsletter' : 'Web'} a ${toVersion === 'newsletter' ? 'Newsletter' : 'Web'}`
    );
    setSnackbarSeverity('info');
    setOpenSnackbar(true);

    // Ocultar automáticamente después de 1.5 segundos
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 1500);
  };

  // Actualizar el contenido de un componente
  const updateComponentContent = (id: string, content: string) => {
    const components = getActiveComponents();
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, content } : component
    );
    updateActiveComponents(updatedComponents);
    debugger;
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
      debugger;
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
    }
  };

  // Actualizar las propiedades de un componente
  const updateComponentProps = (id: string, props: Record<string, any>) => {
    const components = getActiveComponents();
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, props: { ...component.props, ...props } } : component
    );
    updateActiveComponents(updatedComponents);
    debugger;
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
          component.id === otherVersionId
            ? { ...component, props: { ...component.props, ...props } }
            : component
        );

        // Guardar los componentes actualizados
        updateOtherVersionComponents(otherVersion, updatedOtherVersionComponents);

        // Mostrar notificación sutil
        showSyncNotification(activeVersion, otherVersion);
      }
    }
  };

  // Actualizar el estilo de un componente
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
        // Actualizar el componente correspondiente en la otra versión
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
    }
  };

  // Añadir un nuevo componente
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
                      : '',
      props:
        type === 'heading'
          ? { level: 2 }
          : type === 'bulletList'
            ? { items: ['Item 1', 'Item 2', 'Item 3'] }
            : type === 'image'
              ? { src: '', alt: 'Image' }
              : type === 'gallery'
                ? {
                    layout: 'single',
                    images: [
                      { src: '/colorful-abstract-flow.png', alt: 'Gallery image 1' },
                      { src: '/abstract-geometric-shapes.png', alt: 'Gallery image 2' },
                      { src: '/abstract-geometric-shapes.png', alt: 'Gallery image 3' },
                      { src: '/abstract-geometric-shapes.png', alt: 'Gallery image 4' },
                    ],
                  }
                : type === 'category'
                  ? { color: '#4caf50', items: ['Categoría'] }
                  : type === 'author'
                    ? { author: 'Autor', date: new Date().toLocaleDateString() }
                    : type === 'summary'
                      ? { icon: 'mdi:text-box-outline', label: 'Resumen' }
                      : {},
      style: {},
    };

    updateActiveComponents([...components, newComponent]);
    setSelectedComponentId(newComponent.id);

    // Usar setTimeout para dar tiempo al DOM a actualizarse
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

  // Función para cambiar entre versiones web y newsletter
  const handleVersionChange = (newVersion: 'newsletter' | 'web') => {
    // Si la sincronización está activada, sincronizar contenido antes de cambiar
    if (syncEnabled && activeVersion !== newVersion) {
      syncContent(activeVersion, newVersion);
      setLastSyncedVersion(activeVersion);
    }

    setActiveVersion(newVersion);
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

    // Si no hay componentes en el origen, mostrar mensaje y salir
    if (sourceComponents.length === 0) {
      setSnackbarMessage(
        `No hay contenido en ${sourceVersion === 'newsletter' ? 'Newsletter' : 'Web'} para transferir`
      );
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    // Modificar los componentes para la versión de destino
    targetComponents = sourceComponents.map((component) => {
      // Crear sufijo adecuado según destino
      const idSuffix = targetVersion === 'web' ? '-web' : '';
      const sourceIdSuffix = sourceVersion === 'web' ? '-web' : '';

      // Eliminar sufijo antiguo si existe
      let baseId = component.id;
      if (baseId.endsWith(sourceIdSuffix)) {
        baseId = baseId.substring(0, baseId.length - sourceIdSuffix.length);
      }

      // Crear nuevo ID con el sufijo correcto
      const newId = baseId + idSuffix;

      return {
        ...component,
        id: newId,
      };
    });

    // Actualizar los componentes de destino
    if (targetVersion === 'web') {
      switch (activeTemplate) {
        case 'blank':
          setBlankComponentsWeb(targetComponents);
          break;
        case 'news':
          setNewsComponentsWeb(targetComponents);
          break;
        case 'notion':
          setNotionComponentsWeb(targetComponents);
          break;
        case 'plaid':
          setPlaidComponentsWeb(targetComponents);
          break;
        case 'stripe':
          setStripeComponentsWeb(targetComponents);
          break;
        case 'vercel':
          setVercelComponentsWeb(targetComponents);
          break;
        default:
          break;
      }
    } else {
      switch (activeTemplate) {
        case 'blank':
          setBlankComponents(targetComponents);
          break;
        case 'news':
          setNewsComponents(targetComponents);
          break;
        case 'notion':
          setNotionComponents(targetComponents);
          break;
        case 'plaid':
          setPlaidComponents(targetComponents);
          break;
        case 'stripe':
          setStripeComponents(targetComponents);
          break;
        case 'vercel':
          setVercelComponents(targetComponents);
          break;
        default:
          break;
      }
    }

    setSnackbarMessage(
      `Contenido sincronizado de ${sourceVersion === 'newsletter' ? 'Newsletter' : 'Web'} a ${targetVersion === 'newsletter' ? 'Newsletter' : 'Web'}`
    );
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
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
  const handleSaveNote = (title: string) => {
    // Create a note object with the current state
    const noteId = currentNoteId || uuidv4();

    // Guardar los componentes según la versión activa
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

    const note: SavedNote = {
      id: noteId,
      title,
      templateType: activeTemplate,
      dateCreated: currentNoteId ? undefined : new Date().toISOString(),
      dateModified: new Date().toISOString(),
      objdata,
      objdataWeb,
      emailBackground,
      selectedBanner,
      showGradient,
      gradientColors,
      activeVersion,
    };

    // If in newsletter mode, call the onSave callback
    if (isNewsletterMode && onSave) {
      onSave(note);
      onClose();
      return;
    }

    // Use Zustand store to save the note
    if (isEditingExistingNote) {
      updateNote(note);
    } else {
      addNote(note);

      // Also add to selected notes for newsletter
      addSelectedNote({
        noteId: note.id,
        order: 0,
        noteData: note,
      });
    }

    // Update current note ID
    setCurrentNoteId(noteId);
    setIsEditingExistingNote(true);

    // Show success message
    setSnackbarMessage(`Note ${currentNoteId ? 'updated' : 'saved'} successfully`);
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
    setOpenSaveDialog(false);
  };

  // Add this function to load an existing note
  const loadNote = (note: SavedNote) => {
    // Set the note ID
    setCurrentNoteId(note.id);
    setIsEditingExistingNote(true);

    // Set the template type
    setActiveTemplate(note.templateType || 'notion');

    // Set active version if available
    if (note.activeVersion) {
      setActiveVersion(note.activeVersion);
    }

    // Load the components for newsletter version
    switch (note.templateType) {
      case 'blank':
        setBlankComponents(note.objdata);
        if (note.objdataWeb) setBlankComponentsWeb(note.objdataWeb);
        break;
      case 'news':
        setNewsComponents(note.objdata);
        if (note.objdataWeb) setNewsComponentsWeb(note.objdataWeb);
        break;
      case 'notion':
        setNotionComponents(note.objdata);
        if (note.objdataWeb) setNotionComponentsWeb(note.objdataWeb);
        break;
      case 'plaid':
        setPlaidComponents(note.objdata);
        if (note.objdataWeb) setPlaidComponentsWeb(note.objdataWeb);
        break;
      case 'stripe':
        setStripeComponents(note.objdata);
        if (note.objdataWeb) setStripeComponentsWeb(note.objdataWeb);
        break;
      case 'vercel':
        setVercelComponents(note.objdata);
        if (note.objdataWeb) setVercelComponentsWeb(note.objdataWeb);
        break;
      default:
        // Default to notion if template type is unknown
        setNotionComponents(note.objdata);
        if (note.objdataWeb) setNotionComponentsWeb(note.objdataWeb);
        setActiveTemplate('notion');
    }

    // Set background settings
    setEmailBackground(note.emailBackground || '#ffffff');
    setSelectedBanner(note.selectedBanner || null);
    setShowGradient(note.showGradient || false);
    setGradientColors(note.gradientColors || ['#f6f9fc', '#e9f2ff']);
  };

  // Cargar la nota inicial si existe
  useEffect(() => {
    if (initialNote) {
      loadNote(initialNote);
    }
  }, [initialNote]);

  const handleSelectionUpdate = (editor: Editor) => {
    setActiveEditor(editor);

    // Actualizar los controles de formato basados en el estado del editor
    if (editor) {
      const newFormats = [];
      if (editor.isActive('bold')) newFormats.push('bold');
      if (editor.isActive('italic')) newFormats.push('italic');
      if (editor.isActive('underline')) newFormats.push('underlined');
      if (editor.isActive('strike')) newFormats.push('strikethrough');

      setTextFormat(newFormats);

      // Actualizar alineación
      let newAlignment = 'left';
      if (editor.isActive({ textAlign: 'center' })) newAlignment = 'center';
      else if (editor.isActive({ textAlign: 'right' })) newAlignment = 'right';
      else if (editor.isActive({ textAlign: 'justify' })) newAlignment = 'justify';

      setSelectedAlignment(newAlignment);

      // Actualizar color si está disponible
      const marks = editor.getAttributes('textStyle');
      if (marks.color) {
        setSelectedColor(marks.color);
      }
    }
  };

  // Aplicar formato al texto seleccionado
  const applyTextFormat = (format: string) => {
    if (!activeEditor) return;

    switch (format) {
      case 'bold':
        activeEditor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        activeEditor.chain().focus().toggleItalic().run();
        break;
      case 'underlined':
        activeEditor.chain().focus().toggleUnderline().run();
        break;
      case 'strikethrough':
        activeEditor.chain().focus().toggleStrike().run();
        break;
      default:
        break;
    }
  };

  // Aplicar alineación al texto seleccionado
  const applyTextAlignment = (alignment: string) => {
    if (!activeEditor) return;
    activeEditor.chain().focus().setTextAlign(alignment).run();
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
        gradientColors
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

  // Función para actualizar un ítem de lista
  const updateListItem = (componentId: string, index: number, content: string) => {
    const components = getActiveComponents();
    const component = components.find((c) => c.id === componentId);

    if (component && component.props?.items && Array.isArray(component.props.items)) {
      const newItems = [...component.props.items];
      newItems[index] = content;

      updateComponentProps(componentId, { items: newItems });
    }
  };

  // Función para añadir un ítem a la lista
  const addListItem = (componentId: string) => {
    const components = getActiveComponents();
    const component = components.find((c) => c.id === componentId);

    if (component && component.props?.items && Array.isArray(component.props.items)) {
      const newItems = [...component.props.items, 'Nuevo ítem'];

      updateComponentProps(componentId, { items: newItems });
    }
  };

  // Función para eliminar un ítem de la lista
  const removeListItem = (componentId: string, index: number) => {
    const components = getActiveComponents();
    const component = components.find((c) => c.id === componentId);

    if (component && component.props?.items && Array.isArray(component.props.items)) {
      const newItems = [...component.props.items];
      newItems.splice(index, 1);

      updateComponentProps(componentId, { items: newItems });
    }
  };

  // Estado para controlar el selector de iconos
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [hasTextSelection, setHasTextSelection] = useState(false);
  const [listStyle, setListStyle] = useState<string>('disc');
  const [listColor, setListColor] = useState('#000000');

  // Función para transferir contenido de Newsletter a Web
  const transferToWeb = () => {
    syncContent('newsletter', 'web');
  };

  // Función para transferir contenido de Web a Newsletter
  const transferToNewsletter = () => {
    syncContent('web', 'newsletter');
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

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      {/* Barra de navegación superior */}
      <EditorHeader
        onClose={onClose}
        isEditingExistingNote={isEditingExistingNote}
        initialNote={initialNote}
        activeVersion={activeVersion}
        handleVersionChange={handleVersionChange}
        openSaveDialog={() => setOpenSaveDialog(true)}
        syncEnabled={syncEnabled}
        toggleSync={toggleSync}
        transferToWeb={transferToWeb}
        transferToNewsletter={transferToNewsletter}
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
          Sincronización automática activada. Los cambios se transferirán automáticamente entre las
          versiones Web y Newsletter.
        </Box>
      )}

      {/* Contenedor principal */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Panel izquierdo - Componentes */}
        <LeftPanel
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          expandedCategories={expandedCategories}
          setExpandedCategories={setExpandedCategories}
          activeVersion={activeVersion}
          setActiveVersion={setActiveVersion}
          addComponent={addComponent}
          emailTemplates={emailTemplates}
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
          generatingEmail={generatingEmail}
          handleGenerateEmailHtml={handleGenerateEmailHtml}
          setOpenSaveDialog={setOpenSaveDialog}
        />

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
            updateComponentContent={updateComponentContent}
            updateComponentProps={updateComponentProps}
            updateComponentStyle={updateComponentStyle}
            handleSelectionUpdate={handleSelectionUpdate}
            moveComponent={moveComponent}
            removeComponent={removeComponent}
            addComponent={addComponent}
            editMode={editMode}
            selectedBanner={selectedBanner}
            bannerOptions={bannerOptions}
            emailBackground={emailBackground}
            showGradient={showGradient}
            gradientColors={gradientColors}
            addListItem={addListItem}
            removeListItem={removeListItem}
            updateListItem={updateListItem}
          />
        </Box>

        {/* Panel derecho - Formato y estilo */}
        <RightPanel
          selectedComponentId={selectedComponentId}
          rightPanelTab={rightPanelTab}
          setRightPanelTab={setRightPanelTab}
          getActiveComponents={getActiveComponents}
          setSelectedAlignment={setSelectedAlignment}
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
          hasTextSelection={!!activeEditor && activeEditor.isActive('textStyle')}
          listStyle={listStyle}
          updateListStyle={setListStyle}
          listColor={listColor}
          updateListColor={setListColor}
          convertTextToList={() => {}}
          setShowIconPicker={setShowIconPicker}
        />
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

      {/* Diálogo para guardar la nota */}
      <CustomDialog
        open={openSaveDialog}
        onClose={() => setOpenSaveDialog(false)}
        title="Guardar Nota"
        actions={
          <>
            <Button onClick={() => setOpenSaveDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                const title = prompt('Por favor, introduce un título para la nota:');
                if (title) {
                  handleSaveNote(title);
                }
              }}
              color="primary"
            >
              Guardar
            </Button>
          </>
        }
      >
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Título de la nota"
          type="text"
          fullWidth
        />
      </CustomDialog>

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
}
