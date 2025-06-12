'use client';

import type { SavedNote } from 'src/types/saved-note';
import type { NewsletterNote } from 'src/types/newsletter';

import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import {
  Box,
  List,
  Chip,
  Paper,
  Divider,
  ListItem,
  Checkbox,
  TextField,
  Typography,
  IconButton,
  ListItemText,
  ListItemIcon,
  InputAdornment,
} from '@mui/material';

import { useStore } from 'src/lib/store';

interface NoteSelectorProps {
  selectedNotes: NewsletterNote[];
  onNotesChange: (notes: NewsletterNote[]) => void;
}

export default function NoteSelector({ selectedNotes, onNotesChange }: NoteSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>(
    selectedNotes.map((note) => note.noteId)
  );

  // Use Zustand store
  const { notes, loadNotes } = useStore();

  // Load available notes
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle note selection
  const handleNoteToggle = (note: SavedNote) => {
    const currentIndex = selectedNoteIds.indexOf(note.id);
    const newSelectedNoteIds = [...selectedNoteIds];

    if (currentIndex === -1) {
      // Add the note
      newSelectedNoteIds.push(note.id);
    } else {
      // Remove the note
      newSelectedNoteIds.splice(currentIndex, 1);
    }

    setSelectedNoteIds(newSelectedNoteIds);

    // Update the selected notes with order
    const newSelectedNotes: NewsletterNote[] = newSelectedNoteIds.map((noteId, index) => {
      // Check if the note was already selected (to preserve any edits)
      const existingNote = selectedNotes.find((n) => n.noteId === noteId);

      if (existingNote) {
        return { ...existingNote, order: index };
      }

      // Otherwise create a new entry
      const noteData = notes.find((n) => n.id === noteId);
      return {
        noteId,
        order: index,
        noteData: noteData!,
      };
    });

    onNotesChange(newSelectedNotes);
  };

  // Move a note up or down in the order
  const moveNote = (noteId: string, direction: 'up' | 'down') => {
    const index = selectedNoteIds.indexOf(noteId);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedNoteIds.length - 1) return;

    const newSelectedNoteIds = [...selectedNoteIds];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap positions
    [newSelectedNoteIds[index], newSelectedNoteIds[newIndex]] = [
      newSelectedNoteIds[newIndex],
      newSelectedNoteIds[index],
    ];

    setSelectedNoteIds(newSelectedNoteIds);

    // Update the selected notes with new order
    const newSelectedNotes: NewsletterNote[] = newSelectedNoteIds.map((id, idx) => {
      const existingNote = selectedNotes.find((n) => n.noteId === id);

      if (existingNote) {
        return { ...existingNote, order: idx };
      }

      const noteData = notes.find((n) => n.id === id);
      return {
        noteId: id,
        order: idx,
        noteData: noteData!,
      };
    });

    onNotesChange(newSelectedNotes);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Select Notes for Newsletter
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icon icon="mdi:magnify" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      <Divider />

      {selectedNoteIds.length > 0 && (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Notes ({selectedNoteIds.length})
            </Typography>
            <Paper variant="outlined" sx={{ mb: 2 }}>
              <List dense disablePadding>
                {selectedNoteIds.map((noteId, index) => {
                  const note = notes.find((n) => n.id === noteId);
                  if (!note) return null;

                  return (
                    <ListItem
                      key={noteId}
                      secondaryAction={
                        <Box>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => moveNote(noteId, 'up')}
                            disabled={index === 0}
                          >
                            <Icon icon="mdi:arrow-up" width={18} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => moveNote(noteId, 'down')}
                            disabled={index === selectedNoteIds.length - 1}
                          >
                            <Icon icon="mdi:arrow-down" width={18} />
                          </IconButton>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleNoteToggle(note)}
                          >
                            <Icon icon="mdi:close" width={18} />
                          </IconButton>
                        </Box>
                      }
                      sx={{
                        borderBottom:
                          index < selectedNoteIds.length - 1
                            ? '1px solid rgba(0,0,0,0.08)'
                            : 'none',
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={note.title || 'Untitled Note'}
                        secondary={`${(() => {
                          try {
                            const configNote = JSON.parse(note.configNote);
                            return format(
                              new Date(configNote.dateModified || configNote.dateCreated),
                              'MMM d, yyyy'
                            );
                          } catch {
                            return 'Unknown date';
                          }
                        })()}`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Box>
          <Divider />
        </>
      )}

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List>
          {filteredNotes.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No notes found"
                secondary={searchQuery ? 'Try a different search term' : 'Create some notes first'}
              />
            </ListItem>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNoteIds.includes(note.id);

              return (
                <ListItem
                  key={note.id}
                  onClick={() => handleNoteToggle(note)}
                  sx={{
                    borderLeft: isSelected ? '4px solid' : '4px solid transparent',
                    borderLeftColor: isSelected ? 'primary.main' : 'transparent',
                    backgroundColor: isSelected ? 'rgba(63, 81, 181, 0.08)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      disableRipple
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2">{note.title || 'Untitled Note'}</Typography>
                        <Chip
                          size="small"
                          label={(() => {
                            try {
                              const configNote = JSON.parse(note.configNote);
                              return configNote.templateType || 'Unknown';
                            } catch {
                              return 'Unknown';
                            }
                          })()}
                          sx={{ ml: 1, height: 20, fontSize: '0.625rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" component="span" color="text.secondary">
                        {(() => {
                          try {
                            const configNote = JSON.parse(note.configNote);
                            return format(
                              new Date(configNote.dateModified || configNote.dateCreated),
                              'MMM d, yyyy'
                            );
                          } catch {
                            return 'Unknown date';
                          }
                        })()}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })
          )}
        </List>
      </Box>
    </Box>
  );
}
