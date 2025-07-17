'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Grid,
  Card,
  Chip,
  Alert,
  Button,
  Avatar,
  Dialog,
  TextField,
  Typography,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

interface NotesModalProps {
  open: boolean;
  onClose: () => void;
  notesFilter: string;
  setNotesFilter: (filter: string) => void;
  availableNotes: any[];
  loadingNotes: boolean;
  onInjectNote: (noteId: string) => void;
  onRefreshNotes: () => void;
}

export default function NotesModal({
  open,
  onClose,
  notesFilter,
  setNotesFilter,
  availableNotes,
  loadingNotes,
  onInjectNote,
  onRefreshNotes,
}: NotesModalProps) {
  // Filtrar notas por título
  const filteredNotes = availableNotes.filter((note) =>
    note.title?.toLowerCase().includes(notesFilter.toLowerCase())
  );

  // Función para manejar la inyección de nota y cerrar el modal
  const handleInjectNote = (noteId: string) => {
    onInjectNote(noteId);
    onClose();
    setNotesFilter('');
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setNotesFilter('');
      }}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:file-document-multiple" style={{ fontSize: '1.5rem' }} />
          <Typography variant="h6">Notas Disponibles</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selecciona notas para inyectar en el template de newsletter
        </Typography>
      </DialogTitle>

      <DialogContent>
        {/* Filtro de búsqueda */}
        <TextField
          fullWidth
          placeholder="Buscar por título..."
          value={notesFilter}
          onChange={(e) => setNotesFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="mdi:magnify" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Lista de notas */}
        {loadingNotes ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : availableNotes.length === 0 ? (
          <Alert severity="info">No hay notas disponibles para inyectar</Alert>
        ) : filteredNotes.length === 0 ? (
          <Alert severity="warning">No se encontraron notas que coincidan con la búsqueda</Alert>
        ) : (
          <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            <Grid container spacing={2}>
              {filteredNotes.map((note) => (
                <Grid size={{ xs: 12, sm: 6 }} key={note.id}>
                  <Card
                    onClick={() => handleInjectNote(note.id)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        {note.coverImageUrl && (
                          <Avatar
                            src={note.coverImageUrl}
                            variant="rounded"
                            sx={{ width: 60, height: 60, flexShrink: 0 }}
                          />
                        )}
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              lineHeight: 1.3,
                              mb: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {note.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip
                              label={note.status}
                              size="small"
                              color={note.status === 'DRAFT' ? 'default' : 'primary'}
                            />
                            {note.highlight && (
                              <Chip label="Destacado" size="small" color="warning" />
                            )}
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {new Date(note.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={() => {
            onClose();
            setNotesFilter('');
          }}
        >
          Cerrar
        </Button>
        <Button
          variant="outlined"
          startIcon={<Icon icon="mdi:refresh" />}
          onClick={onRefreshNotes}
          disabled={loadingNotes}
        >
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
