'use client';

import type React from 'react';
import type { Editor } from '@tiptap/react';
import type { SavedNote, EmailComponent } from 'src/types/saved-note';

import { v4 as uuidv4 } from 'uuid';
import { useRef, useState, useEffect } from 'react';

import { Box, Button, TextField } from '@mui/material';

import { useStore } from 'src/lib/store';

import LeftPanel from './left-panel';
import RightPanel from './right-panel';
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

  // Actualizar el contenido de un componente
  const updateComponentContent = (id: string, content: string) => {
    const components = getActiveComponents();
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, content } : component
    );
    updateActiveComponents(updatedComponents);
  };

  // Actualizar las propiedades de un componente
  const updateComponentProps = (id: string, props: Record<string, any>) => {
    const components = getActiveComponents();
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, props: { ...component.props, ...props } } : component
    );
    updateActiveComponents(updatedComponents);
  };

  // Actualizar el estilo de un componente
  const updateComponentStyle = (id: string, style: React.CSSProperties) => {
    const components = getActiveComponents();
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, style: { ...component.style, ...style } } : component
    );
    updateActiveComponents(updatedComponents);
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
    setActiveVersion(newVersion);
    setSelectedComponentId(null); // Deseleccionar componente al cambiar de versión
  };

  // Función para inicializar la versión web si no existe
  const initializeWebVersion = () => {
    // Si no hay componentes web para la plantilla actual, copiar los de newsletter
    if (activeVersion === 'web') {
      switch (activeTemplate) {
        case 'news':
          if (newsComponentsWebState.length === 0) {
            const webComponents = newsComponentsState.map((comp) => ({
              ...comp,
              id: comp.id.includes('-web') ? comp.id : `${comp.id}-web`,
            }));
            setNewsComponentsWeb(webComponents);
          }
          break;
        case 'notion':
          if (notionComponentsWebState.length === 0) {
            // Clonar componentes de newsletter y añadir sufijo -web a los IDs
            const webComponents = notionComponentsState.map((comp) => ({
              ...comp,
              id: comp.id.includes('-web') ? comp.id : `${comp.id}-web`,
            }));
            setNotionComponentsWeb(webComponents);
          }
          break;
        case 'plaid':
          if (plaidComponentsWebState.length === 0) {
            const webComponents = plaidComponentsState.map((comp) => ({
              ...comp,
              id: comp.id.includes('-web') ? comp.id : `${comp.id}-web`,
            }));
            setPlaidComponentsWeb(webComponents);
          }
          break;
        case 'stripe':
          if (stripeComponentsWebState.length === 0) {
            const webComponents = stripeComponentsState.map((comp) => ({
              ...comp,
              id: comp.id.includes('-web') ? comp.id : `${comp.id}-web`,
            }));
            setStripeComponentsWeb(webComponents);
          }
          break;
        case 'vercel':
          if (vercelComponentsWebState.length === 0) {
            const webComponents = vercelComponentsState.map((comp) => ({
              ...comp,
              id: comp.id.includes('-web') ? comp.id : `${comp.id}-web`,
            }));
            setVercelComponentsWeb(webComponents);
          }
          break;
        case 'blank':
          if (blankComponentsWebState.length === 0) {
            const webComponents = blankComponentsState.map((comp) => ({
              ...comp,
              id: comp.id.includes('-web') ? comp.id : `${comp.id}-web`,
            }));
            setBlankComponentsWeb(webComponents);
          }
          break;
        default:
          break;
      }
    }
  };

  // Efecto para inicializar la versión web cuando se cambia a ella
  useEffect(() => {
    initializeWebVersion();
  }, [activeVersion, activeTemplate]);

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
      dateCreated: currentNoteId ? '' : new Date().toISOString(),
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

  // Modificar handleSelectionUpdate para detectar selección de texto
  const handleSelectionUpdate = (editor: Editor) => {
    setActiveEditor(editor);

    // Verificar si hay texto seleccionado
    const { from, to } = editor.state.selection;
    setHasTextSelection(from !== to);

    // Actualizar los controles de formato basados en el estado del editor
    if (editor) {
      const newFormats = [];
      if (editor.isActive('bold')) newFormats.push('bold');
      if (editor.isActive('italic')) newFormats.push('italic');
      if (editor.isActive('underline')) newFormats.push('underlined');
      if (editor.isActive('strike')) newFormats.push('strikethrough');

      // Importante: actualizar el estado con los nuevos formatos
      setTextFormat(newFormats);

      // Actualizar alineación
      let newAlignment = 'left';
      if (editor.isActive({ textAlign: 'center' })) newAlignment = 'center';
      else if (editor.isActive({ textAlign: 'right' })) newAlignment = 'right';
      else if (editor.isActive({ textAlign: 'justify' })) newAlignment = 'justify';

      // Actualizar el estado de alineación
      setSelectedAlignment(newAlignment);

      // Actualizar color si está disponible
      const marks = editor.getAttributes('textStyle');
      if (marks.color) {
        setSelectedColor(marks.color);
      }

      // Actualizar fuente y tamaño si están disponibles
      if (marks.fontFamily) {
        setSelectedFont(marks.fontFamily);
      }

      // Actualizar peso de fuente
      const textStyle = editor.getAttributes('textStyle');
      if (textStyle.fontWeight) {
        setSelectedFontWeight(textStyle.fontWeight);
      }

      // Verificar si el componente seleccionado es una lista
      if (selectedComponentId) {
        const components = getActiveComponents();
        const component = components.find((comp) => comp.id === selectedComponentId);

        if (component && component.type === 'bulletList') {
          // Actualizar los estados de estilo de lista
          setListStyle((component.props.listStyle || 'disc') as any);
          setListColor(component.props.listColor || '#000000');
        }
      }
    }
  };

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
      />

      {/* Contenedor principal */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Panel izquierdo - Componentes */}
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
            addListItem={addListItem}
            removeListItem={removeListItem}
            updateListItem={updateListItem}
            editMode={editMode}
            selectedBanner={selectedBanner}
            bannerOptions={bannerOptions}
            emailBackground={emailBackground}
            showGradient={showGradient}
            gradientColors={gradientColors}
          />
        </Box>

        {/* Panel derecho - Formato y estilo */}
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
          setSelectedAlignment={setSelectedAlignment}
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
          hasTextSelection={hasTextSelection}
          listStyle={listStyle}
          updateListStyle={updateListStyle}
          listColor={listColor}
          updateListColor={updateListColor}
          convertTextToList={convertTextToList}
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
    </Box>
  );
};

export default EmailEditorMain;
