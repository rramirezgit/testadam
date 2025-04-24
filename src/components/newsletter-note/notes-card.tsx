// src/components/SavedNoteCard.tsx

'use client';

import type { SavedNote } from 'src/types/saved-note';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Button,
  CardMedia,
  Typography,
  IconButton,
  CardContent,
  CardActions,
} from '@mui/material';

interface NoteCardProps {
  note: SavedNote & { aiGenerated?: boolean };
  onOpen: (note: SavedNote) => void;
  onDelete: (noteId: string) => void;
}

export default function NoteCard({ note, onOpen, onDelete }: NoteCardProps) {
  const [fecha, setFecha] = useState<string>('');
  const [hora, setHora] = useState<string>('');

  useEffect(() => {
    if (note?.createdAt) {
      setFecha(format(new Date(note.createdAt), "dd 'de' MMMM yyyy", { locale: es }));
      setHora(format(new Date(note.createdAt), 'hh:mm a'));
    }
  }, [note?.createdAt]);

  return (
    <Card
      onClick={() => onOpen(note)}
      sx={{
        borderRadius: 2,
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: 3,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Cabecera con imagen */}
      <Box sx={{ position: 'relative' }}>
        {note?.imageUrl ? (
          <CardMedia component="img" height={140} image={note.imageUrl} alt={note.title} />
        ) : (
          <Box
            sx={{
              height: 140,
              bgcolor: 'grey.300',
            }}
          />
        )}

        {/* Chip IA */}
        {note?.aiGenerated && (
          <Chip
            label="IA"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              bgcolor: 'primary.main',
              color: 'common.white',
            }}
          />
        )}

        {/* Menú de acciones */}
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255,255,255,0.8)',
          }}
          onClick={() => {}}
        >
          <Icon icon="mdi:dots-vertical" />
        </IconButton>
      </Box>

      {/* Contenido */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" gutterBottom noWrap>
          {note?.title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            mt: 0.5,
            '& svg': { fontSize: 16, opacity: 0.7, mr: 0.5 },
          }}
        >
          <Icon icon="mdi:calendar" />
          <Typography variant="caption" noWrap sx={{ mr: 1 }}>
            {fecha}
          </Typography>
          <Icon icon="mdi:clock-outline" />
          <Typography variant="caption" noWrap>
            {hora}
          </Typography>
        </Box>
      </CardContent>

      {/* Opciones extra (por ejemplo: borrar) */}
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button size="small" color="error" onClick={() => onDelete(note.id)}>
          Eliminar
        </Button>
      </CardActions>
    </Card>
  );
}
