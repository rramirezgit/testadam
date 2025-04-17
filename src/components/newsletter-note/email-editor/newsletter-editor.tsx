'use client';

import { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { EmailEditorMain } from './main';
import { useStore } from 'src/lib/store';
import type { SavedNote } from 'src/types/saved-note';

interface NewsletterEditorProps {
  onClose: () => void;
}

export default function NewsletterEditor({ onClose }: NewsletterEditorProps) {
  const { notes, selectedNotes, addSelectedNote, removeSelectedNote, updateSelectedNoteOrder } =
    useStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<SavedNote | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isEditing ? (
        // Editor de email para editar o crear una nota
        <EmailEditorMain
          initialNote={editingNote}
          isNewsletterMode={true}
          onSave={handleSaveEditedNote}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        // Vista del editor de newsletter
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
            <Typography variant="h6">Editor de Newsletter</Typography>
            <Box>
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
              {sortedSelectedNotes.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    No hay notas seleccionadas para el newsletter. Selecciona notas del panel
                    izquierdo.
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
      )}
    </Box>
  );
}
