/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import 'react-image-crop/dist/ReactCrop.css';

import type { SavedNote } from 'src/types/saved-note';
import type { Newsletter, NewsletterNote } from 'src/types/newsletter';

import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import { Box, Button, Dialog, Typography, IconButton } from '@mui/material';

import { useStore } from 'src/lib/store';
import usePostStore from 'src/store/PostStore';

import EmailEditor from './email-editor';
import { generateNewsletterHtml as generateFullNewsletterHtml } from './newsletter-html-generator';

import type { NewsletterHeader, NewsletterFooter } from './email-editor/types';

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
  defaultTemplate?: string;
}

// Interfaz para tracking de ediciones de notas
interface NoteEditTracker {
  noteId: string;
  noteTitle: string;
  hasUnsavedChanges: boolean;
  lastModified: Date;
}

export default function NewsletterEditor({
  onClose,
  initialNewsletter,
  defaultTemplate,
}: NewsletterEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

  // Estados para tracking de ediciones de notas
  const [noteEditTrackers, setNoteEditTrackers] = useState<NoteEditTracker[]>([]);
  const [showSaveChangesDialog, setShowSaveChangesDialog] = useState(false);
  const [pendingSaveAction, setPendingSaveAction] = useState<(() => void) | null>(null);

  // Estados para el menú de envío
  const [newsletterList, setNewsletterList] = useState<any[]>([]);
  const [currentNewsletterId, setCurrentNewsletterId] = useState<string>('');
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [openAprob, setOpenAprob] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openSendSubs, setOpenSendSubs] = useState(false);

  // Estados para configuración del newsletter
  const [header, setHeader] = useState<NewsletterHeader>({
    title: '',
    subtitle: '',
    logo: 'https://s3.amazonaws.com/s3.condoor.ai/adam/d5a5c0e8d1.png',
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
      image:
        'https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.5.1/mercadolibre/logo__large_plus.png',
      imageAlt: 'Mercado Libre',
    },
  });

  const [footer, setFooter] = useState<NewsletterFooter>({
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
        status: 'DRAFT',
        perPage: 50,
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

      const fullNote = await findPostById(noteId);

      if (!fullNote) {
        showSnackbar('Error al cargar la nota completa', 'error');
        return;
      }

      const savedNote: SavedNote = {
        id: fullNote.id,
        title: fullNote.title,
        configNote: fullNote.configPost || '{}',
        objData: fullNote.objData || '[]',
        objDataWeb: fullNote.objDataWeb || '[]',
      };

      const isAlreadySelected = selectedNotes.some((selected) => selected.noteId === noteId);
      if (isAlreadySelected) {
        showSnackbar('Esta nota ya está agregada al newsletter', 'warning');
        return;
      }

      const newNote: NewsletterNote = {
        noteId: fullNote.id,
        order: selectedNotes.length,
        noteData: savedNote,
      };

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
    loadNotes();
    loadBackendNotes();
  }, [loadNotes]);

  // Load initial newsletter if provided
  useEffect(() => {
    if (initialNewsletter) {
      setTitle(initialNewsletter.title);
      setDescription(initialNewsletter.description || '');
      setSelectedNotes(initialNewsletter.notes);
      setIsEditingExisting(true);
      setNewsletterId(initialNewsletter.id);

      if (initialNewsletter.header) {
        setHeader({ ...header, ...initialNewsletter.header });
      }

      if (initialNewsletter.footer) {
        const convertedFooter = {
          ...initialNewsletter.footer,
          socialLinks: initialNewsletter.footer.socialLinks.map((link) => ({
            ...link,
            enabled: true,
          })),
        };
        setFooter({ ...footer, ...convertedFooter });
      }
    } else {
      if (storeSelectedNotes.length > 0) {
        setSelectedNotes(storeSelectedNotes);
      }
      setNewsletterId(uuidv4());
    }
  }, [initialNewsletter, storeSelectedNotes]);

  const handleSaveNote = (updatedNote: SavedNote) => {
    if (isCreatingNewNote) {
      const newNewsletterNote: NewsletterNote = {
        noteId: updatedNote.id,
        order: selectedNotes.length,
        noteData: updatedNote,
      };
      setSelectedNotes((prev) => [...prev, newNewsletterNote]);
      showSnackbar('Nueva nota creada y agregada al newsletter', 'success');
    } else {
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

    loadNotes();
    loadBackendNotes();
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
      const newsletterHtml = generateFullNewsletterHtml(
        title,
        description,
        selectedNotes,
        header,
        footer
      );

      const newsletterPayload = {
        subject: title,
        content: newsletterHtml,
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
        },
        createdAt: new Date().toISOString(),
        id: newsletterId,
      };

      console.log('Newsletter payload to send to backend:', newsletterPayload);

      const sendNewsletterToBackend = async (payload: any) => {
        console.log('📧 Enviando newsletter al backend...');
        console.log('📄 Subject:', payload.subject);
        console.log('📝 Content (HTML):', payload.content.substring(0, 200) + '...');
        console.log('🔧 Configuration:', payload.configuration);
        console.log('📊 Notes included:', payload.notesCount);

        return { success: true, id: payload.id };
      };

      await sendNewsletterToBackend(newsletterPayload);

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

  // Función para trackear ediciones de notas
  const trackNoteEdit = (noteId: string, noteTitle: string) => {
    setNoteEditTrackers((prev) => {
      const existing = prev.find((tracker) => tracker.noteId === noteId);
      if (existing) {
        return prev.map((tracker) =>
          tracker.noteId === noteId
            ? { ...tracker, hasUnsavedChanges: true, lastModified: new Date() }
            : tracker
        );
      } else {
        return [
          ...prev,
          {
            noteId,
            noteTitle,
            hasUnsavedChanges: true,
            lastModified: new Date(),
          },
        ];
      }
    });
  };

  // Función para marcar una nota como guardada
  const markNoteSaved = (noteId: string) => {
    setNoteEditTrackers((prev) =>
      prev.map((tracker) =>
        tracker.noteId === noteId ? { ...tracker, hasUnsavedChanges: false } : tracker
      )
    );
  };

  // Función para manejar el guardado de notas con tracking
  const handleSaveNoteWithTracking = (updatedNote: SavedNote) => {
    handleSaveNote(updatedNote);
    markNoteSaved(updatedNote.id);
  };

  // Función para verificar si hay cambios sin guardar antes de guardar el newsletter
  const checkUnsavedChangesBeforeSave = () => {
    const unsavedNotes = noteEditTrackers.filter((tracker) => tracker.hasUnsavedChanges);

    if (unsavedNotes.length > 0) {
      setPendingSaveAction(() => handleSaveNewsletter);
      setShowSaveChangesDialog(true);
      return;
    }

    handleSaveNewsletter();
  };

  // Función para confirmar el guardado con cambios sin guardar
  const handleConfirmSaveWithUnsavedChanges = async () => {
    setShowSaveChangesDialog(false);

    if (pendingSaveAction) {
      await pendingSaveAction();
      setPendingSaveAction(null);
    }
  };

  // Función para cancelar el guardado y permitir guardar las notas primero
  const handleCancelSaveAndEditNotes = () => {
    setShowSaveChangesDialog(false);
    setPendingSaveAction(null);
    showSnackbar('Guarda las notas modificadas antes de guardar el newsletter', 'info');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Renderizar directamente el EmailEditor en modo Newsletter */}
      <EmailEditor
        onClose={onClose}
        isNewsletterMode
        defaultTemplate={defaultTemplate}
        newsletterNotes={selectedNotes}
        onNewsletterNotesChange={setSelectedNotes}
        newsletterHeader={header}
        newsletterFooter={footer}
        onNewsletterConfigChange={({ header: newHeader, footer: newFooter }) => {
          console.log('📥 onNewsletterConfigChange ejecutado con:', { newHeader, newFooter });
          if (newHeader) {
            console.log('🔄 Actualizando header...');
            setHeader((prev) => {
              const updatedHeader = {
                ...prev,
                ...newHeader,
                sponsor: newHeader.sponsor || prev.sponsor,
              };
              console.log('✅ Header actualizado a:', updatedHeader);
              return updatedHeader;
            });
          }
          if (newFooter) {
            console.log('🔄 Actualizando footer...');
            setFooter((prev) => ({ ...prev, ...newFooter }));
          }
        }}
        newsletterTitle={title}
        newsletterDescription={description}
        onNewsletterInfoChange={({ title: newTitle, description: newDescription }) => {
          if (newTitle !== undefined) {
            setTitle(newTitle);
          }
          if (newDescription !== undefined) {
            setDescription(newDescription);
          }
        }}
        onSave={handleSaveNoteWithTracking}
        newsletterList={newsletterList}
        currentNewsletterId={currentNewsletterId}
        saving={isSaving}
        setOpenSendDialog={setOpenSendDialog}
        setOpenAprob={setOpenAprob}
        setOpenSchedule={setOpenSchedule}
        setOpenSendSubs={setOpenSendSubs}
      />

      {/* Note Editor Dialog */}
      <Dialog fullScreen open={openNoteEditor} onClose={() => setOpenNoteEditor(false)}>
        <EmailEditor
          onClose={() => setOpenNoteEditor(false)}
          initialNote={editingNote}
          isNewsletterMode={false}
          onSave={handleSaveNoteWithTracking}
        />
      </Dialog>

      {/* Dialog para confirmar guardado con cambios sin guardar */}
      <Dialog
        open={showSaveChangesDialog}
        onClose={() => setShowSaveChangesDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Cambios sin guardar
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tienes notas con cambios sin guardar. ¿Qué deseas hacer?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCancelSaveAndEditNotes}>
              Cancelar y editar notas
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleConfirmSaveWithUnsavedChanges}
            >
              Guardar de todas formas
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
    </Box>
  );
}
