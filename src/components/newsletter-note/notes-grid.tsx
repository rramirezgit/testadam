'use client';

import { Grid, Typography, Box, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import SavedNoteCard from './saved-note-card';
import type { SavedNote } from 'src/types/saved-note';

interface NotesGridProps {
  notes: SavedNote[];
  onOpenNote: (note: SavedNote) => void;
  onDeleteNote: (noteId: string) => void;
  onCreateNew: () => void;
}

export default function NotesGrid({
  notes,
  onOpenNote,
  onDeleteNote,
  onCreateNew,
}: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Icon icon="mdi:note-outline" style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }} />
        <Typography variant="h5" gutterBottom>
          No saved notes yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
          Create your first email template by clicking the button below.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon icon="mdi:plus" />}
          onClick={onCreateNew}
        >
          Create New Template
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {notes.map((note) => (
        <Grid item xs={12} sm={6} md={4} key={note.id}>
          <SavedNoteCard note={note} onOpen={onOpenNote} onDelete={onDeleteNote} />
        </Grid>
      ))}
    </Grid>
  );
}
