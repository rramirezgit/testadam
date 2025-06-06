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
  Grid,
  Tabs,
  Card,
  Paper,
  Switch,
  AppBar,
  Button,
  Dialog,
  Toolbar,
  Divider,
  TextField,
  Typography,
  IconButton,
  CardHeader,
  CardContent,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

import { useStore } from 'src/lib/store';

import EmailEditor from 'src/components/newsletter-note/email-editor';
import NewsletterDesignSystem from 'src/components/newsletter-note/newsletter-design-system';
import { NewsletterComponentList } from 'src/components/newsletter-note/newsletter-component-renderer';
import {
  generateEscapedHtml,
  generateNewsletterHtml as generateUnifiedHtml,
} from 'src/components/newsletter-note/newsletter-html-generator';

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

export default function NewsletterEditor({ onClose, initialNewsletter }: NewsletterEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<NewsletterNote[]>([]);
  const [editingNote, setEditingNote] = useState<SavedNote | null>(null);
  const [openNoteEditor, setOpenNoteEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [newsletterId, setNewsletterId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('setup');
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

  const [header, setHeader] = useState({
    title: '',
    subtitle: 'Your weekly newsletter',
    logo: '',
    bannerImage: '',
    backgroundColor: '#3f51b5',
    textColor: '#ffffff',
    alignment: 'center',
    useGradient: false,
    gradientColors: ['#3f51b5', '#2196f3'],
    gradientDirection: 180,
  });

  const [footer, setFooter] = useState({
    companyName: 'Your Company',
    address: '123 Main St, City, Country',
    contactEmail: 'contact@example.com',
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com' },
      { platform: 'facebook', url: 'https://facebook.com' },
      { platform: 'instagram', url: 'https://instagram.com' },
    ],
    unsubscribeLink: '#unsubscribe',
    backgroundColor: '#f5f5f5',
    textColor: '#666666',
    useGradient: false,
    gradientColors: ['#f5f5f5', '#e0e0e0'],
    gradientDirection: 180,
  });

  // Use Zustand store
  const {
    addNewsletter,
    updateNewsletter,
    selectedNotes: storeSelectedNotes,
    setSelectedNotes: setStoreSelectedNotes,
    notes,
    loadNotes,
  } = useStore();

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

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
        setFooter({ ...footer, ...initialNewsletter.footer });
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
  };

  const handleSaveNewsletter = () => {
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
      const newsletter: Newsletter = {
        id: isEditingExisting ? newsletterId : uuidv4(),
        title: title.trim(),
        description: description.trim(),
        notes: selectedNotes,
        dateCreated: isEditingExisting
          ? initialNewsletter?.dateCreated || new Date().toISOString()
          : new Date().toISOString(),
        dateModified: new Date().toISOString(),
        header,
        footer,
        content: initialNewsletter?.content,
        design: initialNewsletter?.design,
      };

      if (isEditingExisting) {
        updateNewsletter(newsletter);
      } else {
        addNewsletter(newsletter);
        setStoreSelectedNotes([]);
      }

      showSnackbar('Newsletter guardado exitosamente', 'success');

      setTimeout(() => {
        onClose();
      }, 1000);
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

  const generateNewsletterHtml = () => {
    setGenerating(true);
    try {
      const html = generateUnifiedHtml(title, description, selectedNotes, header, footer);
      const escaped = generateEscapedHtml(html);

      setGeneratedHtml(html);
      setEscapedHtml(escaped);
      setOpenHtmlPreview(true);
    } catch (error) {
      console.error('Error generating HTML:', error);
      showSnackbar('Error al generar el HTML', 'error');
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

  // Banner de configuración prominente
  const renderConfigurationBanner = () => (
    <Paper
      elevation={2}
      sx={{
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon="mdi:cog" style={{ fontSize: 24, marginRight: 8 }} />
          <Typography variant="h6">Configuración del Newsletter</Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Título del Newsletter"
              variant="outlined"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Descripción"
              variant="outlined"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.8)' },
                '& .MuiInputBase-input': { color: 'white' },
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Chip
            icon={<Icon icon="mdi:email-outline" />}
            label={`${selectedNotes.length} notas agregadas`}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
          />
          <Chip
            icon={<Icon icon="mdi:palette" />}
            label="Header configurado"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
          />
          <Chip
            icon={<Icon icon="mdi:information" />}
            label="Footer configurado"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
          />
        </Box>
      </Box>
    </Paper>
  );

  return (
    <>
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
            onClick={generateNewsletterHtml}
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

      <Box sx={{ p: 3 }}>
        {/* Banner de configuración prominente */}
        {renderConfigurationBanner()}

        {/* Tabs mejorados */}
        <Paper elevation={1} sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              value="setup"
              label="Configuración"
              icon={<Icon icon="mdi:cog" />}
              iconPosition="start"
            />
            <Tab
              value="content"
              label="Contenido"
              icon={<Icon icon="mdi:file-document-multiple" />}
              iconPosition="start"
            />
            <Tab
              value="design"
              label="Diseño"
              icon={<Icon icon="mdi:palette" />}
              iconPosition="start"
            />
            <Tab
              value="preview"
              label="Vista Previa"
              icon={<Icon icon="mdi:eye" />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Contenido de los tabs */}
        {activeTab === 'setup' && (
          <Grid container spacing={3}>
            {/* Header Configuration */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader
                  title="Configuración del Header"
                  avatar={<Icon icon="mdi:format-header-1" style={{ fontSize: 24 }} />}
                />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Título del Header"
                      value={header.title}
                      onChange={(e) => setHeader({ ...header, title: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Subtítulo"
                      value={header.subtitle}
                      onChange={(e) => setHeader({ ...header, subtitle: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="URL del Logo"
                      value={header.logo}
                      onChange={(e) => setHeader({ ...header, logo: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Color de Fondo
                      </Typography>
                      <input
                        type="color"
                        value={header.backgroundColor}
                        onChange={(e) => setHeader({ ...header, backgroundColor: e.target.value })}
                        style={{ width: 40, height: 40, border: 'none', borderRadius: 4 }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Color del Texto
                      </Typography>
                      <input
                        type="color"
                        value={header.textColor}
                        onChange={(e) => setHeader({ ...header, textColor: e.target.value })}
                        style={{ width: 40, height: 40, border: 'none', borderRadius: 4 }}
                      />
                    </Box>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={header.useGradient || false}
                        onChange={(e) => setHeader({ ...header, useGradient: e.target.checked })}
                      />
                    }
                    label="Usar Gradiente"
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Footer Configuration */}
            <Grid item xs={12} md={6}>
              <Card elevation={2}>
                <CardHeader
                  title="Configuración del Footer"
                  avatar={<Icon icon="mdi:page-layout-footer" style={{ fontSize: 24 }} />}
                />
                <CardContent>
                  <TextField
                    fullWidth
                    label="Nombre de la Compañía"
                    value={footer.companyName}
                    onChange={(e) => setFooter({ ...footer, companyName: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Dirección"
                    value={footer.address}
                    onChange={(e) => setFooter({ ...footer, address: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email de Contacto"
                    value={footer.contactEmail}
                    onChange={(e) => setFooter({ ...footer, contactEmail: e.target.value })}
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Color de Fondo
                      </Typography>
                      <input
                        type="color"
                        value={footer.backgroundColor}
                        onChange={(e) => setFooter({ ...footer, backgroundColor: e.target.value })}
                        style={{ width: 40, height: 40, border: 'none', borderRadius: 4 }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block">
                        Color del Texto
                      </Typography>
                      <input
                        type="color"
                        value={footer.textColor}
                        onChange={(e) => setFooter({ ...footer, textColor: e.target.value })}
                        style={{ width: 40, height: 40, border: 'none', borderRadius: 4 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 'content' && (
          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Typography variant="h5">Gestión de Contenido</Typography>
              <Button
                variant="contained"
                startIcon={<Icon icon="mdi:plus" />}
                onClick={handleCreateNewNote}
              >
                Crear Nueva Nota
              </Button>
            </Box>

            {selectedNotes.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Icon icon="mdi:email-outline" style={{ fontSize: 64, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  No hay notas agregadas
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Agrega notas para construir tu newsletter
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Icon icon="mdi:plus" />}
                  onClick={handleCreateNewNote}
                >
                  Crear Primera Nota
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {selectedNotes.map((note, index) => (
                  <Grid item xs={12} key={note.noteId}>
                    <Card elevation={1} sx={{ position: 'relative' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            color="primary"
                            sx={{ mr: 2 }}
                          />
                          <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {note.noteData.title}
                          </Typography>
                          <Box>
                            <IconButton size="small" onClick={() => handleEditNote(note.noteData)}>
                              <Icon icon="mdi:pencil" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleMoveNote(note.noteId, 'up')}
                              disabled={index === 0}
                            >
                              <Icon icon="mdi:arrow-up" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleMoveNote(note.noteId, 'down')}
                              disabled={index === selectedNotes.length - 1}
                            >
                              <Icon icon="mdi:arrow-down" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveNote(note.noteId)}
                              color="error"
                            >
                              <Icon icon="mdi:delete" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {note.noteData.objdata.length} componentes • Modificado:{' '}
                          {new Date(
                            note.noteData.dateModified || note.noteData.dateCreated
                          ).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Notas Disponibles
            </Typography>
            <Grid container spacing={2}>
              {notes
                .filter((note) => !selectedNotes.some((selected) => selected.noteId === note.id))
                .map((note) => (
                  <Grid item xs={12} md={6} key={note.id}>
                    <Card
                      elevation={1}
                      sx={{ cursor: 'pointer', '&:hover': { elevation: 3 } }}
                      onClick={() => {
                        const newNote: NewsletterNote = {
                          noteId: note.id,
                          order: selectedNotes.length,
                          noteData: note,
                        };
                        handleAddNote(newNote);
                      }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" noWrap>
                          {note.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {note.templateType} • {note.objdata.length} componentes
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}

        {activeTab === 'design' && (
          <NewsletterDesignSystem
            header={header}
            footer={footer}
            selectedNotes={selectedNotes}
            onHeaderUpdate={setHeader}
            onFooterUpdate={setFooter}
            onNotesReorder={setSelectedNotes}
            onTemplateApply={(template) => {
              showSnackbar(`Template "${template.name}" aplicado exitosamente`, 'success');
            }}
          />
        )}

        {activeTab === 'preview' && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Vista Previa del Newsletter
            </Typography>
            {selectedNotes.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">
                  Agrega notas para ver la vista previa de tu newsletter
                </Typography>
              </Paper>
            ) : (
              <Paper elevation={1} sx={{ p: 3 }}>
                {/* Header Preview */}
                <Box
                  sx={{
                    backgroundColor: header.backgroundColor,
                    background: header.useGradient
                      ? `linear-gradient(${header.gradientDirection || 135}deg, ${(header.gradientColors || ['#667eea', '#764ba2']).join(', ')})`
                      : header.backgroundColor,
                    color: header.textColor,
                    textAlign: header.alignment as 'left' | 'center' | 'right',
                    p: 3,
                    mb: 2,
                    borderRadius: '4px 4px 0 0',
                  }}
                >
                  <Typography variant="h4" gutterBottom>
                    {header.title || title || 'Título del Newsletter'}
                  </Typography>
                  {header.subtitle && (
                    <Typography variant="subtitle1">{header.subtitle}</Typography>
                  )}
                </Box>

                {description && (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, px: 2 }}>
                    {description}
                  </Typography>
                )}

                {/* Notes Preview usando el renderizador unificado */}
                <Box sx={{ px: 2 }}>
                  {selectedNotes.map((newsletterNote, index) => (
                    <Paper key={newsletterNote.noteId} variant="outlined" sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main' }}>
                        {index + 1}. {newsletterNote.noteData.title}
                      </Typography>

                      {/* Renderizar contenido usando el sistema unificado */}
                      <NewsletterComponentList
                        components={newsletterNote.noteData.objdata}
                        isPreview
                        showControls={false}
                      />

                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
                        <Typography variant="caption" color="text.secondary">
                          {newsletterNote.noteData.objdata.length} componentes • Última
                          modificación:{' '}
                          {new Date(
                            newsletterNote.noteData.dateModified ||
                              newsletterNote.noteData.dateCreated
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>

                {/* Footer Preview */}
                <Box
                  sx={{
                    backgroundColor: footer.backgroundColor,
                    background: footer.useGradient
                      ? `linear-gradient(${footer.gradientDirection || 180}deg, ${(footer.gradientColors || ['#f5f5f5', '#e0e0e0']).join(', ')})`
                      : footer.backgroundColor,
                    color: footer.textColor,
                    textAlign: 'center',
                    p: 2,
                    mt: 2,
                    borderRadius: '0 0 4px 4px',
                    fontSize: '0.875rem',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {footer.companyName}
                  </Typography>
                  {footer.address && <Typography variant="body2">{footer.address}</Typography>}
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    © {new Date().getFullYear()} {footer.companyName}
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        )}
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
        maxWidth="md"
        fullWidth
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              HTML Generado
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
            <Tab value="preview" label="Vista Previa" />
            <Tab value="escaped" label="HTML Escapado (AWS SES)" />
          </Tabs>

          {activeHtmlTab === 'preview' && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 2,
                maxHeight: '400px',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
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
                maxHeight: '400px',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {escapedHtml}
            </Paper>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenHtmlPreview(false)} sx={{ mr: 1 }}>
              Cerrar
            </Button>
            <Button
              onClick={() => handleCopyHtml(activeHtmlTab === 'escaped')}
              variant="contained"
              color="primary"
            >
              Copiar HTML {activeHtmlTab === 'escaped' ? 'Escapado' : ''}
            </Button>
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
    </>
  );
}
