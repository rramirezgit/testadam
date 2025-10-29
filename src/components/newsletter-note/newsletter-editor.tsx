/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import 'react-image-crop/dist/ReactCrop.css';

import type { SavedNote } from 'src/types/saved-note';
import type { Newsletter, NewsletterNote } from 'src/types/newsletter';

import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState, useEffect } from 'react';

import { Box, Button, Dialog, Typography, IconButton } from '@mui/material';

import { useStore } from 'src/lib/store';
import { CONFIG } from 'src/global-config';
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
  onSaveRedirect?: (id: string) => void; // Callback para redirección después de guardar
  aiGeneratedData?: any; // Datos generados por IA (objData, objDataWeb)
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
  onSaveRedirect,
  aiGeneratedData,
}: NewsletterEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
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
  const [newsletterStatus, setNewsletterStatus] = useState<string>('');
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [openAprob, setOpenAprob] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openSendSubs, setOpenSendSubs] = useState(false);

  // Estado para los componentes iniciales del newsletter
  const [initialComponents, setInitialComponents] = useState<any[] | null>(null);

  // Estado para preview HTML
  const [showPreview, setShowPreview] = useState(false);

  // Cargar datos generados por IA si existen
  useEffect(() => {
    if (aiGeneratedData && aiGeneratedData.objData && aiGeneratedData.objDataWeb) {
      console.log('📦 Cargando datos generados por IA:', aiGeneratedData);
      // En el futuro, aquí se podría procesar el objData para convertirlo en notas del newsletter
      // Por ahora, simplemente notificar que se recibieron los datos
      showSnackbar('Contenido generado con IA cargado exitosamente', 'success');
    }
  }, [aiGeneratedData]);

  // Estados para configuración del newsletter
  const [header, setHeader] = useState<NewsletterHeader>({
    title: '',
    subtitle: '',
    logo: CONFIG.defaultLogoUrl,
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
      { platform: 'instagram', url: '', enabled: false },
      { platform: 'facebook', url: '', enabled: false },
      { platform: 'x', url: '', enabled: false },
      { platform: 'tiktok', url: '', enabled: false },
      { platform: 'linkedin', url: '', enabled: false },
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
    showLogo: true,
    logo: CONFIG.defaultLogoUrl,
    logoHeight: 40.218,
    footerText: `<p class="tiptap-paragraph">Este correo electrónico se le envió como miembro registrado de Michin. El uso del servicio y del sitio web está sujeto a nuestros <a href="#" style="color: #1976d2;">Términos de uso</a> y <a href="#" style="color: #1976d2;">Declaración de privacidad</a>.</p><p class="tiptap-paragraph">Si no quieres recibir mas estos emails <a href="#unsubscribe" style="color: #1976d2;">Unsubscribe</a></p>`,
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
  const {
    findAll: findAllPosts,
    findById: findPostById,
    loading: loadingPosts,
    findNewsletterById,
    createNewsletter: createNewsletterBackend,
  } = usePostStore();

  // Router for navigation
  const router = useRouter();

  // Generar HTML del newsletter para preview
  const newsletterHtmlPreview = useMemo(
    () => generateFullNewsletterHtml(title, description, selectedNotes, header, footer),
    [title, description, selectedNotes, header, footer]
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load initial newsletter if provided
  useEffect(() => {
    const loadNewsletterData = async () => {
      if (initialNewsletter && initialNewsletter.id) {
        try {
          console.log('🔄 Cargando newsletter existente:', initialNewsletter.id);

          // Consultar el newsletter completo desde el backend
          const fullNewsletter = await findNewsletterById(initialNewsletter.id);

          if (fullNewsletter) {
            console.log('✅ Newsletter completo cargado:', fullNewsletter);

            // Setear el título, descripción y coverImageUrl
            setTitle(fullNewsletter.subject || '');
            setDescription(fullNewsletter.description || '');
            setCoverImageUrl(fullNewsletter.coverImageUrl || '');
            setIsEditingExisting(true);
            setNewsletterId(fullNewsletter.id);
            setCurrentNewsletterId(fullNewsletter.id);
            setNewsletterStatus(fullNewsletter.status || 'DRAFT');

            // Parsear objData si existe
            if (fullNewsletter.objData) {
              try {
                const parsedComponents = JSON.parse(fullNewsletter.objData);

                // Filtrar noteContainers para ver cuántos hay
                const noteContainers = parsedComponents.filter(
                  (c: any) => c.type === 'noteContainer'
                );

                console.log('📦 Componentes parseados del newsletter:', {
                  totalComponents: parsedComponents.length,
                  noteContainersCount: noteContainers.length,
                  allComponents: parsedComponents.map((c: any) => ({ id: c.id, type: c.type })),
                  noteContainers: noteContainers.map((n: any) => ({
                    id: n.id,
                    title: n.props?.noteTitle,
                    componentsCount: n.props?.componentsData?.length || 0,
                  })),
                });

                // Setear los componentes para pasarlos al EmailEditor
                setInitialComponents(parsedComponents);
              } catch (parseError) {
                console.error('❌ Error parseando objData:', parseError);
                setInitialComponents(null);
              }
            } else {
              console.warn('⚠️ El newsletter no tiene objData');
              setInitialComponents(null);
            }

            // Si tiene configuración de header/footer, cargarla
            if (fullNewsletter.configuration) {
              if (fullNewsletter.configuration.header) {
                setHeader({ ...header, ...fullNewsletter.configuration.header });
              }
              if (fullNewsletter.configuration.footer) {
                const convertedFooter = {
                  ...fullNewsletter.configuration.footer,
                  socialLinks: fullNewsletter.configuration.footer.socialLinks.map((link: any) => ({
                    ...link,
                    enabled: true,
                  })),
                };
                setFooter({ ...footer, ...convertedFooter });
              }
            }
          }
        } catch (error) {
          console.error('❌ Error cargando newsletter:', error);
          showSnackbar('Error al cargar el newsletter', 'error');
        }
      } else {
        // Newsletter nuevo
        if (storeSelectedNotes.length > 0) {
          setSelectedNotes(storeSelectedNotes);
        }
        const newId = uuidv4();
        setNewsletterId(newId);
      }
    };

    loadNewsletterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNewsletter, storeSelectedNotes]);

  // Función para recargar el newsletter después de actualizaciones
  const handleNewsletterUpdate = async () => {
    if (currentNewsletterId) {
      try {
        console.log('🔄 Recargando newsletter después de actualización...');
        const fullNewsletter = await findNewsletterById(currentNewsletterId);
        if (fullNewsletter) {
          setNewsletterStatus(fullNewsletter.status || 'DRAFT');
          console.log('✅ Status actualizado:', fullNewsletter.status);
        }
      } catch (error) {
        console.error('❌ Error recargando newsletter:', error);
      }
    }
  };

  // Detectar si el newsletter está en modo view-only
  const isViewOnly = newsletterStatus === 'SENDED';

  console.log('🔍 Newsletter Status Debug:', {
    newsletterStatus,
    isViewOnly,
    showPreview,
    computedShowPreview: isViewOnly || showPreview,
  });

  // Función para crear una copia del newsletter
  const handleCreateCopy = async () => {
    try {
      showSnackbar('Creando copia del newsletter...', 'info');

      // 1. Generar HTML del newsletter actual
      const newsletterHtml = generateFullNewsletterHtml(
        title,
        description,
        selectedNotes,
        header,
        footer
      );

      // 2. Crear nuevo newsletter con estado DRAFT
      const copyPayload = {
        subject: `Copia - ${title}`,
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
        status: 'DRAFT',
        coverImageUrl,
      };

      // 3. Llamar a createNewsletter del backend
      const result = await createNewsletterBackend(copyPayload.subject, copyPayload);

      // 4. Redirigir a editar la copia
      if (result && result.id) {
        showSnackbar('Copia creada exitosamente en estado DRAFT', 'success');

        // Usar router si está disponible
        if (router) {
          setTimeout(() => {
            router.push(`/edit/newsletter/${result.id}`);
          }, 1000);
        } else {
          // Fallback si no hay router
          setTimeout(() => {
            window.location.href = `/edit/newsletter/${result.id}`;
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error creando copia:', error);
      showSnackbar('Error al crear la copia del newsletter', 'error');
    }
  };

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
        subject: title,
        description,
        notes: selectedNotes,
        createdAt: isEditingExisting
          ? initialNewsletter?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
        dateCreated: initialNewsletter?.dateCreated,
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

        // Redirigir a la ruta de edición si se proporciona el callback
        if (onSaveRedirect) {
          setTimeout(() => {
            onSaveRedirect(newsletterId);
          }, 500);
          return; // Salir temprano para no llamar onClose
        }
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
            console.log('🔍 Header anterior:', header);
            console.log('🔍 Nuevo header recibido:', newHeader);
            // Forzar una nueva referencia de objeto para que React detecte el cambio
            setHeader({ ...newHeader });
            console.log('✅ Header actualizado con nueva referencia');
          }
          if (newFooter) {
            console.log('🔄 Actualizando footer...');
            // Forzar una nueva referencia de objeto para que React detecte el cambio
            setFooter({ ...newFooter });
            console.log('✅ Footer actualizado con nueva referencia');
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
        initialComponents={initialComponents}
        initialCoverImageUrl={coverImageUrl}
        onNewsletterIdChange={(newId: string) => {
          console.log('🆔 Newsletter ID actualizado:', newId);
          setCurrentNewsletterId(newId);
          setNewsletterId(newId);
        }}
        newsletterStatus={newsletterStatus}
        onNewsletterUpdate={handleNewsletterUpdate}
        isViewOnly={isViewOnly}
        onCreateCopy={handleCreateCopy}
        showPreview={isViewOnly || showPreview}
        onTogglePreview={() => {
          setShowPreview(!showPreview);
          // El HTML ya se genera automáticamente via useMemo en línea 217-220
        }}
        newsletterHtmlPreview={newsletterHtmlPreview}
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
