'use client';

import { Box, Button, Typography, Paper, Divider, IconButton, Chip } from '@mui/material';
import { Icon } from '@iconify/react';
import type { SidebarProps } from './types';
import type { NewsletterNote } from 'src/types/newsletter';

export default function Sidebar({
  sidebarTab,
  setSidebarTab,
  selectedNotes,
  notes,
  handleAddNote,
  handleRemoveNote,
  handleEditNote,
  handleCreateNewNote,
}: SidebarProps) {
  return (
    <Box sx={{ width: 280, borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <Box sx={{ display: 'flex', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Button
          variant={sidebarTab === 'notes' ? 'contained' : 'text'}
          onClick={() => setSidebarTab('notes')}
          sx={{ flex: 1, borderRadius: 0, py: 1 }}
        >
          NOTES
        </Button>
        <Button
          variant={sidebarTab === 'create' ? 'contained' : 'text'}
          onClick={() => setSidebarTab('create')}
          sx={{ flex: 1, borderRadius: 0, py: 1 }}
        >
          CREATE
        </Button>
      </Box>

      {sidebarTab === 'notes' && (
        <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected Notes ({selectedNotes.length})
          </Typography>
          {selectedNotes.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              {selectedNotes.map((note) => (
                <Paper
                  key={note.noteId}
                  variant="outlined"
                  sx={{ mb: 1, p: 1.5, position: 'relative' }}
                >
                  <Box sx={{ pr: 6 }}>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                      {note.noteData.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {new Date(
                        note.noteData.dateModified || note.noteData.dateCreated
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton size="small" onClick={() => handleEditNote(note.noteData)}>
                      <Icon icon="mdi:pencil" width={16} />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleRemoveNote(note.noteId)}>
                      <Icon icon="mdi:close" width={16} />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Paper sx={{ p: 2, textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No notes selected yet
              </Typography>
            </Paper>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="subtitle1">Available Notes</Typography>
            <Button size="small" startIcon={<Icon icon="mdi:plus" />} onClick={handleCreateNewNote}>
              New
            </Button>
          </Box>

          {notes.length > 0 ? (
            <Box>
              {notes
                .filter((note) => !selectedNotes.some((selected) => selected.noteId === note.id))
                .map((note) => (
                  <Paper
                    key={note.id}
                    variant="outlined"
                    sx={{ mb: 1, p: 1.5, position: 'relative', cursor: 'pointer' }}
                    onClick={() => {
                      const newNote: NewsletterNote = {
                        noteId: note.id,
                        order: selectedNotes.length,
                        noteData: note,
                      };
                      handleAddNote(newNote);
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium" noWrap>
                        {note.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(note.dateModified || note.dateCreated).toLocaleDateString()}
                        </Typography>
                        <Chip
                          size="small"
                          label={note.templateType}
                          sx={{ height: 18, fontSize: '0.625rem' }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
            </Box>
          ) : (
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notes available
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {sidebarTab === 'create' && (
        <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Create New Note
          </Typography>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Icon icon="mdi:plus" />}
            onClick={handleCreateNewNote}
            sx={{ mb: 2 }}
          >
            Create Note
          </Button>
          <Typography variant="body2" color="text.secondary">
            Create a new note to add to your newsletter. You can use any of the available templates
            or start from scratch.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
