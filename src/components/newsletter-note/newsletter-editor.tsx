'use client';

import type { SavedNote } from 'src/types/saved-note';
import type { Newsletter, NewsletterNote } from 'src/types/newsletter';

import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Chip,
  Tabs,
  Card,
  List,
  Paper,
  AppBar,
  Button,
  Dialog,
  Toolbar,
  Divider,
  ListItem,
  TextField,
  Typography,
  IconButton,
  CardContent,
  CircularProgress,
} from '@mui/material';

import { useStore } from 'src/lib/store';
import usePostStore from 'src/store/PostStore';

import EmailEditor from './email-editor';
import {
  generateEscapedHtml,
  generateNewsletterHtml as generateFullNewsletterHtml,
} from './newsletter-html-generator';

// Custom Snackbar component
const CustomSnackbar = ({
  open,
  message,
  severity,
  onClose,
}: {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}) => {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open, onClose]);

  if (!open) return null;

  const bgColor =
    severity === 'success'
      ? '#4caf50'
      : severity === 'error'
        ? '#f44336'
        : severity === 'warning'
          ? '#ff9800'
          : '#2196f3';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bgColor,
        color: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span>{message}</span>
      <IconButton size="small" style={{ marginLeft: '8px', color: 'white' }} onClick={onClose}>
        <Icon icon="mdi:close" />
      </IconButton>
    </div>
  );
};

interface NewsletterEditorProps {
  onClose: () => void;
  initialNewsletter?: Newsletter | null;
}

// Interfaz local para SocialLink con enabled
interface LocalSocialLink {
  platform: string;
  url: string;
  enabled: boolean;
}

export default function NewsletterEditor({ onClose, initialNewsletter }: NewsletterEditorProps) {
  const [title, setTitle] = useState('Mi Newsletter Semanal');
  const [description, setDescription] = useState('Las mejores noticias y actualizaciones');
  const isInitialLoad = React.useRef(true);
  const [selectedNotes, setSelectedNotes] = useState<NewsletterNote[]>([]);
  const [editingNote, setEditingNote] = useState<SavedNote | null>(null);
  const [openNoteEditor, setOpenNoteEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [newsletterId, setNewsletterId] = useState<string>('');
  const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [openHtmlPreview, setOpenHtmlPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeHtmlTab, setActiveHtmlTab] = useState('preview');
  const [escapedHtml, setEscapedHtml] = useState('');
  const [rightPanelTab, setRightPanelTab] = useState('general');
  const [activeTab, setActiveTab] = useState('temas');

  // Estados para configuración avanzada
  const [globalStyles, setGlobalStyles] = useState({
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    lineHeight: 1.6,
    primaryColor: '#3f51b5',
    secondaryColor: '#2196f3',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    linkColor: '#1976d2',
    borderRadius: 4,
    spacing: 16,
    maxWidth: 600,
  });

  const [header, setHeader] = useState({
    title: 'Newsletter Semanal',
    subtitle: 'Las mejores noticias y actualizaciones',
    logo: 'https://ejemplo.com/logo.png',
    bannerImage: '',
    backgroundColor: '#FFF9CE',
    textColor: '#333333',
    alignment: 'center',
    useGradient: true,
    gradientColors: ['#FFF9CE', '#E2E5FA'],
    gradientDirection: 224,
    showLogo: true,
    logoHeight: 60,
    padding: 32,
  });

  const [footer, setFooter] = useState({
    companyName: 'Tu Empresa',
    address: '123 Calle Principal, Ciudad, País',
    contactEmail: 'contacto@ejemplo.com',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com', enabled: true },
      { platform: 'facebook', url: 'https://facebook.com', enabled: true },
      { platform: 'instagram', url: 'https://instagram.com', enabled: true },
      { platform: 'linkedin', url: 'https://linkedin.com', enabled: false },
    ] as LocalSocialLink[],
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

  // Configuración inicial para undo
  const [initialConfig, setInitialConfig] = useState({
    header,
    footer,
    globalStyles,
  });

  // Temas prediseñados
  const predefinedThemes = [
    {
      id: 'default',
      name: '🌅 Aurora (Defecto)',
      description: 'Gradiente suave y elegante',
      header: {
        backgroundColor: '#FFF9CE',
        textColor: '#333333',
        useGradient: true,
        gradientColors: ['#FFF9CE', '#E2E5FA'],
        gradientDirection: 224,
      },
      footer: {
        backgroundColor: '#f8f9fa',
        textColor: '#6c757d',
        useGradient: false,
      },
      globalStyles: {
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        linkColor: '#6366f1',
      },
    },
    {
      id: 'sunset',
      name: '🌅 Atardecer',
      description: 'Colores cálidos del atardecer',
      header: {
        backgroundColor: '#FF6B6B',
        textColor: '#ffffff',
        useGradient: true,
        gradientColors: ['#FF6B6B', '#FFE66D'],
        gradientDirection: 135,
      },
      footer: {
        backgroundColor: '#2C3E50',
        textColor: '#ECF0F1',
        useGradient: false,
      },
      globalStyles: {
        primaryColor: '#FF6B6B',
        secondaryColor: '#FFE66D',
        linkColor: '#FF6B6B',
      },
    },
    {
      id: 'ocean',
      name: '🌊 Océano',
      description: 'Azules profundos y refrescantes',
      header: {
        backgroundColor: '#667eea',
        textColor: '#ffffff',
        useGradient: true,
        gradientColors: ['#667eea', '#764ba2'],
        gradientDirection: 180,
      },
      footer: {
        backgroundColor: '#2c3e50',
        textColor: '#ecf0f1',
        useGradient: true,
        gradientColors: ['#2c3e50', '#34495e'],
        gradientDirection: 180,
      },
      globalStyles: {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        linkColor: '#667eea',
      },
    },
    {
      id: 'forest',
      name: '🌲 Bosque',
      description: 'Verdes naturales y terrosos',
      header: {
        backgroundColor: '#56ab2f',
        textColor: '#ffffff',
        useGradient: true,
        gradientColors: ['#56ab2f', '#a8e6cf'],
        gradientDirection: 45,
      },
      footer: {
        backgroundColor: '#2d5016',
        textColor: '#ffffff',
        useGradient: false,
      },
      globalStyles: {
        primaryColor: '#56ab2f',
        secondaryColor: '#a8e6cf',
        linkColor: '#56ab2f',
      },
    },
    {
      id: 'corporate',
      name: '💼 Corporativo',
      description: 'Elegante y profesional',
      header: {
        backgroundColor: '#2c3e50',
        textColor: '#ffffff',
        useGradient: true,
        gradientColors: ['#2c3e50', '#3498db'],
        gradientDirection: 90,
      },
      footer: {
        backgroundColor: '#34495e',
        textColor: '#bdc3c7',
        useGradient: false,
      },
      globalStyles: {
        primaryColor: '#2c3e50',
        secondaryColor: '#3498db',
        linkColor: '#3498db',
      },
    },
    {
      id: 'vibrant',
      name: '🎨 Vibrante',
      description: 'Colores energéticos y llamativos',
      header: {
        backgroundColor: '#ff0084',
        textColor: '#ffffff',
        useGradient: true,
        gradientColors: ['#ff0084', '#ff6600'],
        gradientDirection: 315,
      },
      footer: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        useGradient: true,
        gradientColors: ['#1a1a1a', '#333333'],
        gradientDirection: 180,
      },
      globalStyles: {
        primaryColor: '#ff0084',
        secondaryColor: '#ff6600',
        linkColor: '#ff0084',
      },
    },
    {
      id: 'minimal',
      name: '⚪ Minimalista',
      description: 'Limpio y simple',
      header: {
        backgroundColor: '#ffffff',
        textColor: '#2c3e50',
        useGradient: false,
        gradientColors: ['#ffffff', '#f8f9fa'],
        gradientDirection: 180,
      },
      footer: {
        backgroundColor: '#f8f9fa',
        textColor: '#6c757d',
        useGradient: false,
      },
      globalStyles: {
        primaryColor: '#2c3e50',
        secondaryColor: '#95a5a6',
        linkColor: '#3498db',
      },
    },
  ];

  // Use Zustand store
  const {
    addNewsletter,
    updateNewsletter,
    selectedNotes: storeSelectedNotes,
    setSelectedNotes: setStoreSelectedNotes,
    notes,
    loadNotes,
  } = useStore();

  // PostStore for backend notes
  const { findAll: findAllPosts, findById: findPostById, loading: loadingPosts } = usePostStore();

  // State for backend notes
  const [backendNotes, setBackendNotes] = useState<any[]>([]);
  const [loadingBackendNotes, setLoadingBackendNotes] = useState(false);

  // Load notes from backend
  const loadBackendNotes = async () => {
    setLoadingBackendNotes(true);
    try {
      const response = await findAllPosts({
        status: 'DRAFT', // Por ahora DRAFT, luego será APPROVED
        perPage: 50, // Limitar a 50 notas
      });

      if (response && response.data) {
        setBackendNotes(response.data);
      }
    } catch (error) {
      console.error('Error loading backend notes:', error);
      showSnackbar('Error al cargar las notas', 'error');
    } finally {
      setLoadingBackendNotes(false);
    }
  };

  // Add backend note to newsletter with full data
  const handleAddBackendNote = async (noteId: string, noteTitle: string) => {
    try {
      setLoadingBackendNotes(true);

      // Hacer findById para obtener toda la información
      const fullNote = await findPostById(noteId);

      if (!fullNote) {
        showSnackbar('Error al cargar la nota completa', 'error');
        return;
      }

      // Crear objeto compatible con SavedNote
      const savedNote: SavedNote = {
        id: fullNote.id,
        title: fullNote.title,
        configNote: fullNote.configPost || '{}',
        objData: fullNote.objData || '[]',
        objDataWeb: fullNote.objDataWeb || '[]',
      };

      // Verificar si ya está agregada
      const isAlreadySelected = selectedNotes.some((selected) => selected.noteId === noteId);
      if (isAlreadySelected) {
        showSnackbar('Esta nota ya está agregada al newsletter', 'warning');
        return;
      }

      // Crear NewsletterNote con toda la información
      const newNote: NewsletterNote = {
        noteId: fullNote.id,
        order: selectedNotes.length,
        noteData: savedNote,
      };

      // Agregar al newsletter
      setSelectedNotes((prev) => [...prev, newNote]);
      showSnackbar(`Nota "${noteTitle}" agregada al newsletter`, 'success');
    } catch (error) {
      console.error('Error adding backend note:', error);
      showSnackbar('Error al agregar la nota al newsletter', 'error');
    } finally {
      setLoadingBackendNotes(false);
    }
  };

  // Load notes on component mount
  useEffect(() => {
    loadNotes(); // Mantener las notas locales
    loadBackendNotes(); // Cargar notas del backend
  }, [loadNotes]);

  // Auto-regenerate HTML when any configuration changes
  useEffect(() => {
    // Skip auto-generation on very first load to avoid double generation
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      // Still generate on first load if we have notes
      if (selectedNotes.length > 0) {
        const timeoutId = setTimeout(() => {
          try {
            const html = generateFullNewsletterHtml(
              title,
              description,
              selectedNotes,
              header,
              footer
            );
            const escaped = generateEscapedHtml(html);
            setGeneratedHtml(html);
            setEscapedHtml(escaped);
          } catch (error) {
            console.error('Error generating initial HTML:', error);
          }
        }, 100);
        return () => clearTimeout(timeoutId);
      }
      return undefined;
    }

    // Clear HTML if no notes
    if (selectedNotes.length === 0) {
      setGeneratedHtml('');
      setEscapedHtml('');
      return undefined;
    }

    // Auto-regenerate with debouncing
    const timeoutId = setTimeout(() => {
      setGenerating(true);
      try {
        console.log('Auto-regenerating HTML with new configuration...', {
          theme: globalStyles.primaryColor,
          headerBg: header.backgroundColor,
          headerUseGradient: header.useGradient,
          headerGradientColors: header.gradientColors,
          footerBg: footer.backgroundColor,
          footerCompany: footer.companyName,
          footerSocialLinks: footer.socialLinks.map((link) => ({
            platform: link.platform,
            enabled: link.enabled,
          })),
          title,
          description,
          notesCount: selectedNotes.length,
        });
        const html = generateFullNewsletterHtml(title, description, selectedNotes, header, footer);
        const escaped = generateEscapedHtml(html);
        setGeneratedHtml(html);
        setEscapedHtml(escaped);
      } catch (error) {
        console.error('Error auto-generating HTML:', error);
      } finally {
        setGenerating(false);
      }
    }, 200); // Reduced debounce time for faster response

    return () => clearTimeout(timeoutId);
  }, [selectedNotes, title, description, header, footer, globalStyles]);

  // Load initial newsletter if provided
  useEffect(() => {
    if (initialNewsletter) {
      setTitle(initialNewsletter.title);
      setDescription(initialNewsletter.description || '');
      setSelectedNotes(initialNewsletter.notes);
      setIsEditingExisting(true);
      setNewsletterId(initialNewsletter.id);

      // Load header and footer if available
      if (initialNewsletter.header) {
        setHeader({ ...header, ...initialNewsletter.header });
      }

      if (initialNewsletter.footer) {
        // Convert SocialLink[] to LocalSocialLink[] by adding enabled property
        const convertedFooter = {
          ...initialNewsletter.footer,
          socialLinks: initialNewsletter.footer.socialLinks.map((link) => ({
            ...link,
            enabled: true, // Default to enabled
          })) as LocalSocialLink[],
        };
        setFooter({ ...footer, ...convertedFooter });
      }
    } else {
      // If creating a new newsletter, use the selected notes from the store
      if (storeSelectedNotes.length > 0) {
        setSelectedNotes(storeSelectedNotes);
      }
      setNewsletterId(uuidv4());
    }
  }, [initialNewsletter, storeSelectedNotes]);

  const handleAddNote = (note: NewsletterNote) => {
    setSelectedNotes((prev) => [...prev, note]);
    showSnackbar('Nota agregada al newsletter', 'success');
  };

  const handleRemoveNote = (noteId: string) => {
    setSelectedNotes((prev) => prev.filter((note) => note.noteId !== noteId));
    showSnackbar('Nota eliminada del newsletter', 'info');
  };

  const handleMoveNote = (noteId: string, direction: 'up' | 'down') => {
    const noteIndex = selectedNotes.findIndex((note) => note.noteId === noteId);
    if (noteIndex === -1) return;

    const newNotes = [...selectedNotes];
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

    setSelectedNotes(updatedNotes);
  };

  const handleEditNote = (note: SavedNote) => {
    setEditingNote(note);
    setIsCreatingNewNote(false);
    setOpenNoteEditor(true);
  };

  const handleCreateNewNote = () => {
    setEditingNote(null);
    setIsCreatingNewNote(true);
    setOpenNoteEditor(true);
  };

  const handleSaveNote = (updatedNote: SavedNote) => {
    if (isCreatingNewNote) {
      // Add the new note to the newsletter
      const newNewsletterNote: NewsletterNote = {
        noteId: updatedNote.id,
        order: selectedNotes.length,
        noteData: updatedNote,
      };
      setSelectedNotes((prev) => [...prev, newNewsletterNote]);
      showSnackbar('Nueva nota creada y agregada al newsletter', 'success');
    } else {
      // Update the existing note in the selected notes array
      setSelectedNotes((prev) =>
        prev.map((note) =>
          note.noteId === updatedNote.id
            ? {
                ...note,
                noteData: updatedNote,
              }
            : note
        )
      );
      showSnackbar('Nota actualizada exitosamente', 'success');
    }

    setOpenNoteEditor(false);
    setEditingNote(null);
    setIsCreatingNewNote(false);

    // Refresh notes
    loadNotes();
    loadBackendNotes(); // También recargar las notas del backend
  };

  const handleSaveNewsletter = async () => {
    if (!title.trim()) {
      showSnackbar('Por favor ingresa un título para el newsletter', 'error');
      return;
    }

    if (selectedNotes.length === 0) {
      showSnackbar('Por favor agrega al menos una nota al newsletter', 'error');
      return;
    }

    setIsSaving(true);

    try {
      // Generar el HTML completo del newsletter
      const newsletterHtml = generateFullNewsletterHtml(
        title,
        description,
        selectedNotes,
        header,
        footer
      );

      // Crear el objeto que se enviará al backend
      const newsletterPayload = {
        subject: title,
        content: newsletterHtml,
        // Datos adicionales del newsletter
        description,
        notesCount: selectedNotes.length,
        notes: selectedNotes.map((note) => ({
          noteId: note.noteId,
          order: note.order,
          title: note.noteData.title,
        })),
        configuration: {
          header,
          footer,
          globalStyles,
        },
        createdAt: new Date().toISOString(),
        id: newsletterId,
      };

      console.log('Newsletter payload to send to backend:', newsletterPayload);

      // TODO: Función para enviar al backend
      const sendNewsletterToBackend = async (payload: any) => {
        // Simular llamada al backend
        console.log('📧 Enviando newsletter al backend...');
        console.log('📄 Subject:', payload.subject);
        console.log('📝 Content (HTML):', payload.content.substring(0, 200) + '...');
        console.log('🔧 Configuration:', payload.configuration);
        console.log('📊 Notes included:', payload.notesCount);

        // Aquí iría la llamada real al backend:
        // const response = await fetch('/api/newsletters', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload)
        // });
        // return response.json();

        return { success: true, id: payload.id };
      };

      // Enviar al backend
      await sendNewsletterToBackend(newsletterPayload);

      // También guardar en el store local para mantener funcionalidad existente
      const newsletter: Newsletter = {
        id: newsletterId,
        title,
        description,
        notes: selectedNotes,
        dateCreated: isEditingExisting
          ? initialNewsletter?.dateCreated || new Date().toISOString()
          : new Date().toISOString(),
        dateModified: new Date().toISOString(),
        header,
        footer: {
          ...footer,
          socialLinks: footer.socialLinks.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        },
        content: newsletterHtml,
        design: { globalStyles },
      };

      if (isEditingExisting) {
        updateNewsletter(newsletter);
      } else {
        addNewsletter(newsletter);
      }

      showSnackbar(
        `Newsletter ${isEditingExisting ? 'actualizado' : 'guardado'} exitosamente`,
        'success'
      );

      // Limpiar estado después de guardar
      setStoreSelectedNotes([]);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving newsletter:', error);
      showSnackbar('Error al guardar el newsletter', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleGenerateNewsletterHtml = (showNotification = false) => {
    setGenerating(true);
    try {
      // Usar las funciones importadas correctamente
      const html = generateFullNewsletterHtml(title, description, selectedNotes, header, footer);
      const escaped = generateEscapedHtml(html);
      setGeneratedHtml(html);
      setEscapedHtml(escaped);

      if (showNotification) {
        setOpenHtmlPreview(true);
        showSnackbar('HTML generado exitosamente', 'success');
      }
    } catch (error) {
      console.error('Error generando HTML:', error);
      if (showNotification) {
        showSnackbar('Error generando HTML', 'error');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyHtml = (useEscaped = false) => {
    const htmlToCopy = useEscaped ? escapedHtml : generatedHtml;
    navigator.clipboard
      .writeText(htmlToCopy)
      .then(() => {
        showSnackbar('HTML copiado al portapapeles', 'success');
      })
      .catch((err) => {
        console.error('Error al copiar HTML:', err);
        showSnackbar('Error al copiar HTML', 'error');
      });
  };

  const handleResetConfiguration = () => {
    setHeader(initialConfig.header);
    setFooter(initialConfig.footer);
    setGlobalStyles(initialConfig.globalStyles);
    showSnackbar('Configuración restablecida', 'info');
  };

  const handleUndoChanges = () => {
    setHeader(initialConfig.header);
    setFooter(initialConfig.footer);
    setGlobalStyles(initialConfig.globalStyles);
    showSnackbar('Cambios deshechos', 'info');
  };

  // CSS para ocultar scrollbars pero mantener funcionalidad
  const hideScrollbarStyles = {
    /* Webkit browsers (Chrome, Safari, Edge) */
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    /* Firefox */
    scrollbarWidth: 'none',
    /* IE y Edge legacy */
    '-ms-overflow-style': 'none',
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* AppBar superior */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button startIcon={<Icon icon="mdi:chevron-left" />} sx={{ mr: 2 }} onClick={onClose}>
            Volver
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {isEditingExisting ? 'Editar Newsletter' : 'Nuevo Newsletter'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Icon icon="mdi:code-tags" />}
            onClick={() => handleGenerateNewsletterHtml(true)}
            disabled={generating || selectedNotes.length === 0}
            sx={{ mr: 2 }}
          >
            {generating ? <CircularProgress size={24} color="inherit" /> : 'Generar HTML'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon="mdi:content-save" />}
            onClick={handleSaveNewsletter}
            disabled={isSaving}
          >
            {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Guardar Newsletter'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Layout de 3 paneles */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Panel Izquierdo - Biblioteca de Contenido */}
        <Box
          sx={{
            width: 320,
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header del panel izquierdo */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Icon icon="mdi:library" style={{ marginRight: 8 }} />
              Biblioteca de Contenido
            </Typography>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={handleCreateNewNote}
              sx={{ mb: 2 }}
            >
              Nueva Nota
            </Button>

            {/* Botón para recargar notas del backend */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Icon icon="mdi:refresh" />}
              onClick={loadBackendNotes}
              disabled={loadingBackendNotes}
              sx={{ mb: 1 }}
            >
              {loadingBackendNotes ? 'Cargando...' : 'Actualizar Notas'}
            </Button>

            {/* Información de las notas del backend */}
            {backendNotes.length > 0 && (
              <Box sx={{ mt: 1, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="caption" color="info.contrastText">
                  {backendNotes.length} notas en borrador disponibles
                </Typography>
              </Box>
            )}
          </Box>

          {/* Lista de notas disponibles */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 1, ...hideScrollbarStyles }}>
            {/* Notas del Backend (DRAFT) */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, px: 1, color: 'text.secondary' }}>
                Notas en Borrador ({backendNotes.length})
              </Typography>

              {loadingBackendNotes ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Cargando notas...
                  </Typography>
                </Box>
              ) : backendNotes.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Icon icon="mdi:note-outline" style={{ fontSize: 48, opacity: 0.3 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No hay notas en borrador
                  </Typography>
                </Box>
              ) : (
                <List dense>
                  {backendNotes.map((note) => {
                    // Crear un objeto compatible con SavedNote para la selección
                    const savedNote: SavedNote = {
                      id: note.id,
                      title: note.title,
                      configNote: note.configPost,
                      objData: note.objData,
                      objDataWeb: note.objDataWeb,
                    };

                    const isSelected = selectedNotes.some(
                      (selected) => selected.noteId === note.id
                    );

                    return (
                      <ListItem key={note.id} disablePadding sx={{ mb: 1 }}>
                        <Card
                          elevation={isSelected ? 3 : 1}
                          sx={{
                            width: '100%',
                            border: isSelected ? 2 : 1,
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { elevation: 2 },
                          }}
                          onClick={() => {
                            if (!isSelected) {
                              handleAddBackendNote(note.id, note.title);
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                                {note.title}
                              </Typography>
                              {isSelected && (
                                <Chip
                                  size="small"
                                  label="Agregada"
                                  color="primary"
                                  sx={{ ml: 1, height: 20 }}
                                />
                              )}
                            </Box>

                            {/* Descripción si existe */}
                            {note.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 0.5 }}
                              >
                                {note.description.length > 50
                                  ? `${note.description.substring(0, 50)}...`
                                  : note.description}
                              </Typography>
                            )}

                            <Typography variant="caption" color="text.secondary" display="block">
                              {(() => {
                                try {
                                  const configNote = JSON.parse(note.configPost || '{}');
                                  const objData = JSON.parse(note.objData || '[]');
                                  const templateType = configNote.templateType || 'unknown';
                                  return `${templateType} • ${objData.length} componentes`;
                                } catch {
                                  return 'Template desconocido • 0 componentes';
                                }
                              })()}
                            </Typography>

                            <Typography variant="caption" color="text.secondary" display="block">
                              {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                            </Typography>

                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                startIcon={<Icon icon="mdi:pencil" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditNote(savedNote);
                                }}
                              >
                                Editar
                              </Button>
                              {!isSelected && (
                                <Button
                                  size="small"
                                  startIcon={<Icon icon="mdi:plus" />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddBackendNote(note.id, note.title);
                                  }}
                                >
                                  Agregar
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>

            {/* Separador */}
            <Divider sx={{ my: 2 }} />

            {/* Notas Locales (mantener por compatibilidad) */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, px: 1, color: 'text.secondary' }}>
                Notas Locales ({notes.length})
              </Typography>

              {notes.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay notas locales
                  </Typography>
                </Box>
              ) : (
                <List dense>
                  {notes.map((note) => {
                    const isSelected = selectedNotes.some(
                      (selected) => selected.noteId === note.id
                    );
                    return (
                      <ListItem key={note.id} disablePadding sx={{ mb: 1 }}>
                        <Card
                          elevation={isSelected ? 3 : 1}
                          sx={{
                            width: '100%',
                            border: isSelected ? 2 : 1,
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { elevation: 2 },
                          }}
                          onClick={() => {
                            if (!isSelected) {
                              const newNote: NewsletterNote = {
                                noteId: note.id,
                                order: selectedNotes.length,
                                noteData: note,
                              };
                              handleAddNote(newNote);
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                                {note.title}
                              </Typography>
                              {isSelected && (
                                <Chip
                                  size="small"
                                  label="Agregada"
                                  color="secondary"
                                  sx={{ ml: 1, height: 20 }}
                                />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {(() => {
                                try {
                                  const configNote = JSON.parse(note.configNote);
                                  const objData = JSON.parse(note.objData);
                                  return `${configNote.templateType} • ${objData.length} componentes`;
                                } catch {
                                  return 'Unknown template • 0 componentes';
                                }
                              })()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {(() => {
                                try {
                                  const configNote = JSON.parse(note.configNote);
                                  return new Date(
                                    configNote.dateModified || configNote.dateCreated
                                  ).toLocaleDateString();
                                } catch {
                                  return 'Unknown date';
                                }
                              })()}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              <Button
                                size="small"
                                startIcon={<Icon icon="mdi:pencil" />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditNote(note);
                                }}
                              >
                                Editar
                              </Button>
                              {!isSelected && (
                                <Button
                                  size="small"
                                  startIcon={<Icon icon="mdi:plus" />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newNote: NewsletterNote = {
                                      noteId: note.id,
                                      order: selectedNotes.length,
                                      noteData: note,
                                    };
                                    handleAddNote(newNote);
                                  }}
                                >
                                  Agregar
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
          </Box>
        </Box>

        {/* Panel Central - Preview */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box
            sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Vista Previa del Newsletter</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:code-tags" />}
                onClick={() => handleGenerateNewsletterHtml(true)}
                disabled={selectedNotes.length === 0 || generating}
              >
                {generating ? <CircularProgress size={20} /> : 'Generar HTML'}
              </Button>
              <Button
                variant="contained"
                startIcon={<Icon icon="mdi:content-save" />}
                onClick={handleSaveNewsletter}
                disabled={isSaving || selectedNotes.length === 0}
              >
                {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Guardar Newsletter'}
              </Button>
            </Box>
          </Box>

          {generating ? (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: 'grey.50',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={64} sx={{ mx: 'auto', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                Generando vista previa...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aplicando cambios de configuración
              </Typography>
            </Paper>
          ) : generatedHtml ? (
            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Newsletter: {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedNotes.length} nota{selectedNotes.length !== 1 ? 's' : ''} seleccionada
                  {selectedNotes.length !== 1 ? 's' : ''}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <iframe
                  srcDoc={generatedHtml}
                  title="Vista Previa del Newsletter"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: 'grey.50',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {/* <Icon icon="mdi:code-tags" width={64} height={64} style={{ opacity: 0.3 }} /> */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                HTML no generado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Haz clic en &quot;Generar HTML&quot; para ver la vista previa del newsletter
              </Typography>
              <Button
                variant="contained"
                startIcon={<Icon icon="mdi:code-tags" />}
                onClick={() => handleGenerateNewsletterHtml(true)}
                disabled={generating}
                sx={{ alignSelf: 'center' }}
              >
                {generating ? <CircularProgress size={20} color="inherit" /> : 'Generar HTML'}
              </Button>
            </Paper>
          )}
        </Box>

        {/* Panel Derecho - Configuraciones */}
        <Box
          sx={{
            width: 350,
            borderLeft: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6">Configuración del Newsletter</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={handleUndoChanges} title="Deshacer cambios">
                  <Icon icon="mdi:undo" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleResetConfiguration}
                  title="Restablecer configuración"
                >
                  <Icon icon="mdi:refresh" />
                </IconButton>
              </Box>
            </Box>
            <Tabs
              value={rightPanelTab}
              onChange={(e, newValue) => setRightPanelTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab value="general" label="General" />
              <Tab value="temas" label="Temas" />
              <Tab value="header" label="Header" />
              <Tab value="footer" label="Footer" />
            </Tabs>
          </Box>

          <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto', ...hideScrollbarStyles }}>
            {rightPanelTab === 'general' && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Información General
                  </Typography>
                  <TextField
                    fullWidth
                    label="Título del Newsletter"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={3}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Resumen
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Notas seleccionadas: {selectedNotes.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estado: {selectedNotes.length > 0 ? 'Listo para generar' : 'Necesita notas'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Orden de Notas
                  </Typography>
                  {selectedNotes.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No hay notas seleccionadas
                    </Typography>
                  ) : (
                    <List dense>
                      {selectedNotes.map((note, index) => (
                        <ListItem
                          key={note.noteId}
                          secondaryAction={
                            <Box>
                              <IconButton
                                size="small"
                                onClick={() => handleMoveNote(note.noteId, 'up')}
                                disabled={index === 0}
                              >
                                <Icon icon="mdi:chevron-up" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleMoveNote(note.noteId, 'down')}
                                disabled={index === selectedNotes.length - 1}
                              >
                                <Icon icon="mdi:chevron-down" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveNote(note.noteId)}
                                color="error"
                              >
                                <Icon icon="mdi:close" />
                              </IconButton>
                            </Box>
                          }
                        >
                          <Typography variant="body2">
                            {index + 1}. {note.noteData.title}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </>
            )}

            {rightPanelTab === 'temas' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Temas Prediseñados
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Selecciona un tema para aplicar colores y estilos predefinidos
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {predefinedThemes.map((theme) => (
                    <Card
                      key={theme.id}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { elevation: 3 },
                      }}
                      onClick={() => {
                        console.log(`Aplicando tema: ${theme.name}`, theme);
                        // Aplicar tema
                        setHeader((prev) => {
                          const newHeader = { ...prev, ...theme.header };
                          console.log('Nuevo header:', newHeader);
                          return newHeader;
                        });
                        setFooter((prev) => {
                          const newFooter = { ...prev, ...theme.footer };
                          console.log('Nuevo footer:', newFooter);
                          return newFooter;
                        });
                        setGlobalStyles((prev) => {
                          const newGlobalStyles = { ...prev, ...theme.globalStyles };
                          console.log('Nuevos globalStyles:', newGlobalStyles);
                          return newGlobalStyles;
                        });
                        showSnackbar(
                          `Tema "${theme.name}" aplicado - Vista previa actualizándose...`,
                          'success'
                        );
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {theme.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                          {theme.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                          {theme.header.gradientColors.map((color, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 16,
                                height: 16,
                                backgroundColor: color,
                                borderRadius: '50%',
                                border: '1px solid rgba(0,0,0,0.1)',
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {rightPanelTab === 'header' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Configuración del Header
                </Typography>
                <TextField
                  fullWidth
                  label="Título del Header"
                  value={header.title}
                  onChange={(e) => {
                    console.log('Cambiando título del header:', e.target.value);
                    setHeader((prev) => ({ ...prev, title: e.target.value }));
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Subtítulo"
                  value={header.subtitle}
                  onChange={(e) => setHeader((prev) => ({ ...prev, subtitle: e.target.value }))}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="URL del Logo"
                  value={header.logo}
                  onChange={(e) => setHeader((prev) => ({ ...prev, logo: e.target.value }))}
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Colores y Fondo
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2">Usar Gradiente</Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setHeader((prev) => ({ ...prev, useGradient: !prev.useGradient }))
                      }
                      color={header.useGradient ? 'primary' : 'default'}
                    >
                      <Icon
                        icon={header.useGradient ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}
                      />
                    </IconButton>
                  </Box>
                </Box>

                {header.useGradient ? (
                  <>
                    <TextField
                      fullWidth
                      label="Color de Gradiente 1"
                      type="color"
                      value={header.gradientColors[0]}
                      onChange={(e) => {
                        console.log('Cambiando color gradiente 1:', e.target.value);
                        const newGradientColors = [...header.gradientColors];
                        newGradientColors[0] = e.target.value;
                        setHeader((prev) => ({ ...prev, gradientColors: newGradientColors }));
                      }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Color de Gradiente 2"
                      type="color"
                      value={header.gradientColors[1]}
                      onChange={(e) => {
                        const newGradientColors = [...header.gradientColors];
                        newGradientColors[1] = e.target.value;
                        setHeader((prev) => ({ ...prev, gradientColors: newGradientColors }));
                      }}
                      sx={{ mb: 2 }}
                    />
                  </>
                ) : (
                  <TextField
                    fullWidth
                    label="Color de Fondo"
                    type="color"
                    value={header.backgroundColor}
                    onChange={(e) =>
                      setHeader((prev) => ({ ...prev, backgroundColor: e.target.value }))
                    }
                    sx={{ mb: 2 }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Color del Texto"
                  type="color"
                  value={header.textColor}
                  onChange={(e) => setHeader((prev) => ({ ...prev, textColor: e.target.value }))}
                  sx={{ mb: 2 }}
                />
              </Box>
            )}

            {rightPanelTab === 'footer' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Configuración del Footer
                </Typography>
                <TextField
                  fullWidth
                  label="Nombre de la Empresa"
                  value={footer.companyName}
                  onChange={(e) => {
                    console.log('Cambiando nombre de empresa:', e.target.value);
                    setFooter((prev) => ({ ...prev, companyName: e.target.value }));
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Dirección"
                  value={footer.address}
                  onChange={(e) => setFooter((prev) => ({ ...prev, address: e.target.value }))}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email de Contacto"
                  type="email"
                  value={footer.contactEmail}
                  onChange={(e) => setFooter((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Color de Fondo"
                  type="color"
                  value={footer.backgroundColor}
                  onChange={(e) => {
                    console.log('Cambiando color de fondo del footer:', e.target.value);
                    setFooter((prev) => ({ ...prev, backgroundColor: e.target.value }));
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Color del Texto"
                  type="color"
                  value={footer.textColor}
                  onChange={(e) => setFooter((prev) => ({ ...prev, textColor: e.target.value }))}
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                  Redes Sociales
                </Typography>
                {footer.socialLinks.map((link, index) => (
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
                          console.log(`Cambiando estado de ${link.platform}: ${!link.enabled}`);
                          const newSocialLinks = [...footer.socialLinks];
                          newSocialLinks[index].enabled = !newSocialLinks[index].enabled;
                          setFooter((prev) => {
                            const newFooter = { ...prev, socialLinks: newSocialLinks };
                            console.log('Footer actualizado con nuevas redes sociales:', newFooter);
                            return newFooter;
                          });
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
                        console.log(`Cambiando URL de ${link.platform}: ${e.target.value}`);
                        const newSocialLinks = [...footer.socialLinks];
                        newSocialLinks[index].url = e.target.value;
                        setFooter((prev) => {
                          const newFooter = { ...prev, socialLinks: newSocialLinks };
                          console.log('Footer actualizado con nueva URL:', newFooter);
                          return newFooter;
                        });
                      }}
                      disabled={!link.enabled}
                      size="small"
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Note Editor Dialog */}
      <Dialog fullScreen open={openNoteEditor} onClose={() => setOpenNoteEditor(false)}>
        <EmailEditor
          onClose={() => setOpenNoteEditor(false)}
          initialNote={editingNote}
          isNewsletterMode
          onSave={handleSaveNote}
        />
      </Dialog>

      {/* HTML Preview Dialog */}
      <Dialog
        open={openHtmlPreview}
        onClose={() => setOpenHtmlPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              HTML Generado - Newsletter
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => setOpenHtmlPreview(false)}>
              <Icon icon="mdi:close" />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 2 }}>
          <Tabs
            value={activeHtmlTab || 'preview'}
            onChange={(e, newValue) => setActiveHtmlTab(newValue)}
          >
            <Tab
              value="preview"
              label="Vista Previa"
              icon={<Icon icon="mdi:eye" />}
              iconPosition="start"
            />
            <Tab
              value="html"
              label="Código HTML"
              icon={<Icon icon="mdi:code-tags" />}
              iconPosition="start"
            />
            <Tab
              value="escaped"
              label="HTML Escapado (AWS SES)"
              icon={<Icon icon="mdi:aws" />}
              iconPosition="start"
            />
          </Tabs>

          {activeHtmlTab === 'preview' && (
            <Box sx={{ mt: 2 }}>
              <Paper
                variant="outlined"
                sx={{
                  height: '600px',
                  overflow: 'hidden',
                }}
              >
                <iframe
                  srcDoc={generatedHtml}
                  title="Vista Previa del Newsletter"
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </Paper>
            </Box>
          )}

          {activeHtmlTab === 'html' && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 2,
                maxHeight: '600px',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                bgcolor: '#f5f5f5',
              }}
            >
              {generatedHtml}
            </Paper>
          )}

          {activeHtmlTab === 'escaped' && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 2,
                maxHeight: '600px',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                bgcolor: '#f5f5f5',
              }}
            >
              {escapedHtml}
            </Paper>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={() => setOpenHtmlPreview(false)} variant="outlined">
              Cerrar
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={() => handleCopyHtml(false)}
                variant="contained"
                color="primary"
                startIcon={<Icon icon="mdi:content-copy" />}
              >
                Copiar HTML Normal
              </Button>
              <Button
                onClick={() => handleCopyHtml(true)}
                variant="contained"
                color="secondary"
                startIcon={<Icon icon="mdi:aws" />}
              >
                Copiar HTML AWS
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* Snackbar for notifications */}
      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
}
