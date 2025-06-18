'use client';

import type { Article } from 'src/store/PostStore';

import { Icon } from '@iconify/react';

import { Box, Grid, Button, Typography } from '@mui/material';

import NoteCard from './notes-card';

interface NotesGridProps {
  notes: Article[];
  onOpenNote: (note: Article) => void;
  onDeleteNote: (noteId: string) => void;
  onCreateNew: () => void;
}

export default function NotesGrid({
  notes,
  onOpenNote,
  onDeleteNote,
  onCreateNew,
}: NotesGridProps) {
  // Caso sin notas guardadas
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
        <Icon
          icon="mdi:note-outline"
          width={64}
          height={64}
          style={{ opacity: 0.5, marginBottom: 16 }}
        />
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
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={note.id}>
          <NoteCard note={note} onOpen={onOpenNote} onDelete={onDeleteNote} />
        </Grid>
      ))}
    </Grid>
  );
}
