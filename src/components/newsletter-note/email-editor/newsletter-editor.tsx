'use client';

import type { SavedNote } from 'src/types/saved-note';
import type { Newsletter } from 'src/types/newsletter';

import { useState } from 'react';

import { Box, Fab, Paper, Button, Typography } from '@mui/material';

import { useStore } from 'src/lib/store';

import { EmailEditorMain } from './main';
import { DesignPanel } from '../design-system/components/design-panel';

interface NewsletterEditorProps {
  onClose: () => void;
}

export default function NewsletterEditor({ onClose }: NewsletterEditorProps) {
  const { notes, selectedNotes, addSelectedNote, removeSelectedNote, updateSelectedNoteOrder } =
    useStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<SavedNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ NUEVO: Estado para el Design System
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false);
  const [newsletter, setNewsletter] = useState<Newsletter>({
    id: 'newsletter-' + Date.now(),
    title: 'Mi Newsletter',
    description: 'Newsletter personalizado',
    header: undefined,
    footer: undefined,
  });

  // Ordenar las notas seleccionadas por orden
  const sortedSelectedNotes = [...selectedNotes].sort((a, b) => a.order - b.order);

  // Manejar la selección de una nota
  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setEditingNote(note);
    }
  };

  // Manejar la edición de una nota
  const handleEditNote = () => {
    if (selectedNoteId) {
      const note = notes.find((n) => n.id === selectedNoteId);
      if (note) {
        setEditingNote(note);
        setIsEditing(true);
      }
    }
  };

  // Manejar el guardado de una nota editada
  const handleSaveEditedNote = (updatedNote: SavedNote) => {
    setIsEditing(false);
    setEditingNote(null);
    // La actualización de la nota ya se maneja en el EmailEditor
  };

  // Manejar la adición de una nota al newsletter
  const handleAddToNewsletter = () => {
    if (selectedNoteId) {
      const note = notes.find((n) => n.id === selectedNoteId);
      if (note) {
        // Calcular el siguiente orden
        const nextOrder =
          sortedSelectedNotes.length > 0
            ? sortedSelectedNotes[sortedSelectedNotes.length - 1].order + 1
            : 0;

        // Añadir la nota al newsletter
        addSelectedNote({
          noteId: selectedNoteId,
          order: nextOrder,
          noteData: note,
        });
      }
    }
  };

  // Manejar la eliminación de una nota del newsletter
  const handleRemoveFromNewsletter = (noteId: string) => {
    removeSelectedNote(noteId);
  };

  // Manejar el cambio de orden de las notas
  const handleMoveNote = (noteId: string, direction: 'up' | 'down') => {
    const noteIndex = sortedSelectedNotes.findIndex((n) => n.noteId === noteId);
    if (noteIndex === -1) return;

    if (direction === 'up' && noteIndex > 0) {
      // Intercambiar con la nota anterior
      const prevNote = sortedSelectedNotes[noteIndex - 1];
      const currentNote = sortedSelectedNotes[noteIndex];

      updateSelectedNoteOrder(prevNote.noteId, currentNote.order);
      updateSelectedNoteOrder(currentNote.noteId, prevNote.order);
    } else if (direction === 'down' && noteIndex < sortedSelectedNotes.length - 1) {
      // Intercambiar con la nota siguiente
      const nextNote = sortedSelectedNotes[noteIndex + 1];
      const currentNote = sortedSelectedNotes[noteIndex];

      updateSelectedNoteOrder(nextNote.noteId, currentNote.order);
      updateSelectedNoteOrder(currentNote.noteId, nextNote.order);
    }
  };

  // Crear una nueva nota
  const handleCreateNewNote = () => {
    setEditingNote(null);
    setIsEditing(true);
  };

  // ✅ NUEVO: Función para actualizar newsletter desde Design System
  const handleUpdateNewsletter = (updates: Partial<Newsletter>) => {
    setNewsletter((prev) => ({
      ...prev,
      ...updates,
      updatedAt: Date.now(),
    }));
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {isEditing ? (
        // Editor de email para editar o crear una nota
        <EmailEditorMain
          initialNote={editingNote}
          isNewsletterMode
          onSave={handleSaveEditedNote}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        // Vista del editor de newsletter
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Barra superior */}
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h6">Editor de Newsletter</Typography>
                {/* ✅ NUEVO: Indicador de Design System activo */}
                {newsletter.header || newsletter.footer ? (
                  <Typography variant="caption" color="primary">
                    🎨 Design System aplicado
                  </Typography>
                ) : null}
              </Box>
              <Box>
                {/* ✅ NUEVO: Botón para abrir Design System */}
                <Button
                  variant="outlined"
                  onClick={() => setIsDesignPanelOpen(true)}
                  sx={{ mr: 1 }}
                  startIcon={<span>🎨</span>}
                >
                  Design System
                </Button>
                <Button variant="outlined" onClick={onClose} sx={{ mr: 1 }}>
                  Cancelar
                </Button>
                <Button variant="contained" color="primary">
                  Guardar Newsletter
                </Button>
              </Box>
            </Box>

            {/* Contenido principal */}
            <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
              {/* Panel izquierdo - Notas disponibles */}
              <Box sx={{ width: 300, p: 2, borderRight: '1px solid #e0e0e0', overflow: 'auto' }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Notas Disponibles
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCreateNewNote}
                  sx={{ mb: 2 }}
                >
                  Crear Nueva Nota
                </Button>
                {notes.map((note) => (
                  <Paper
                    key={note.id}
                    elevation={selectedNoteId === note.id ? 3 : 1}
                    sx={{
                      p: 2,
                      mb: 2,
                      cursor: 'pointer',
                      bgcolor: selectedNoteId === note.id ? '#f0f7ff' : 'white',
                    }}
                    onClick={() => handleSelectNote(note.id)}
                  >
                    <Typography variant="subtitle2">{note.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(note.dateModified).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        size="small"
                        onClick={handleEditNote}
                        disabled={selectedNoteId !== note.id}
                      >
                        Editar
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        onClick={handleAddToNewsletter}
                        disabled={
                          selectedNoteId !== note.id ||
                          selectedNotes.some((n) => n.noteId === note.id)
                        }
                      >
                        Añadir
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Box>

              {/* Panel central - Newsletter */}
              <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Contenido del Newsletter
                </Typography>

                {/* ✅ NUEVO: Vista previa de diseño aplicado */}
                {(newsletter.header || newsletter.footer) && (
                  <Paper sx={{ p: 2, mb: 2, bgcolor: 'primary.lighter' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      🎨 Diseño Personalizado Aplicado
                    </Typography>
                    {newsletter.header && (
                      <Typography variant="caption" display="block">
                        Header: {newsletter.header.name}
                      </Typography>
                    )}
                    {newsletter.footer && (
                      <Typography variant="caption" display="block">
                        Footer: {newsletter.footer.name}
                      </Typography>
                    )}
                  </Paper>
                )}

                {sortedSelectedNotes.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                      No hay notas seleccionadas para el newsletter.
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      💡 Selecciona notas del panel izquierdo o personaliza el diseño con el Design
                      System
                    </Typography>
                  </Paper>
                ) : (
                  sortedSelectedNotes.map((selectedNote, index) => {
                    const note = selectedNote.noteData;
                    return (
                      <Paper key={selectedNote.noteId} elevation={2} sx={{ p: 2, mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2">{note.title}</Typography>
                          <Box>
                            <Button
                              size="small"
                              disabled={index === 0}
                              onClick={() => handleMoveNote(selectedNote.noteId, 'up')}
                            >
                              ↑
                            </Button>
                            <Button
                              size="small"
                              disabled={index === sortedSelectedNotes.length - 1}
                              onClick={() => handleMoveNote(selectedNote.noteId, 'down')}
                            >
                              ↓
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveFromNewsletter(selectedNote.noteId)}
                            >
                              Eliminar
                            </Button>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            p: 1,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            bgcolor: '#f9f9f9',
                            maxHeight: 200,
                            overflow: 'auto',
                          }}
                        >
                          {/* Aquí podríamos mostrar una vista previa del contenido */}
                          <Typography variant="body2" color="textSecondary">
                            Vista previa del contenido...
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  })
                )}
              </Box>
            </Box>
          </Box>

          {/* ✅ NUEVO: Botón flotante para activar Design System */}
          <Fab
            color="primary"
            onClick={() => setIsDesignPanelOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
          >
            🎨
          </Fab>

          {/* ✅ NUEVO: Design Panel */}
          <DesignPanel
            isOpen={isDesignPanelOpen}
            onClose={() => setIsDesignPanelOpen(false)}
            newsletter={newsletter}
            onUpdateNewsletter={handleUpdateNewsletter}
          />
        </>
      )}
    </Box>
  );
}
