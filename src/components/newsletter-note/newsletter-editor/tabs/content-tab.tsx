'use client';

import { Icon } from '@iconify/react';

import { Box, Paper, Button, Divider, TextField, Typography, IconButton } from '@mui/material';

import type { ContentTabProps } from '../types';

export default function ContentTab({
  title,
  description,
  setTitle,
  setDescription,
  selectedNotes,
  handleCreateNewNote,
  handleEditNote,
  handleRemoveNote,
  handleMoveNote,
}: ContentTabProps) {
  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Newsletter Details
        </Typography>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Newsletter Content</Typography>
          <Button
            variant="outlined"
            startIcon={<Icon icon="mdi:plus" />}
            onClick={handleCreateNewNote}
          >
            Add New Note
          </Button>
        </Box>

        {selectedNotes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Icon icon="mdi:email-outline" style={{ fontSize: 48, opacity: 0.5 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              No notes added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select notes from the sidebar or create a new note to add to your newsletter
            </Typography>
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:plus" />}
              onClick={handleCreateNewNote}
            >
              Create New Note
            </Button>
          </Box>
        ) : (
          <Box>
            {selectedNotes.map((note, index) => (
              <Paper
                key={note.noteId}
                variant="outlined"
                sx={{ mb: 2, position: 'relative', overflow: 'hidden' }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    bgcolor: 'rgba(0,0,0,0.03)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        mr: 2,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                      {note.noteData.title}
                    </Typography>
                    <Box>
                      <IconButton size="small" onClick={() => handleEditNote(note.noteData)}>
                        <Icon icon="mdi:pencil" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleMoveNote(note.noteId, 'up')}
                        disabled={index === 0}
                      >
                        <Icon icon="mdi:arrow-up" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleMoveNote(note.noteId, 'down')}
                        disabled={index === selectedNotes.length - 1}
                      >
                        <Icon icon="mdi:arrow-down" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleRemoveNote(note.noteId)}>
                        <Icon icon="mdi:delete" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: note.noteData.emailBackground || '#ffffff',
                    backgroundImage: note.noteData.selectedBanner
                      ? `url(${note.noteData.selectedBanner})`
                      : 'none',
                    backgroundSize: note.noteData.selectedBanner ? 'cover' : 'auto',
                    background:
                      note.noteData.showGradient && note.noteData.gradientColors
                        ? `linear-gradient(to bottom, ${note.noteData.gradientColors[0]}, ${note.noteData.gradientColors[1]})`
                        : undefined,
                  }}
                >
                  {/* Contenedor con borde de la nota */}
                  <Box
                    sx={{
                      maxWidth: `${note.noteData.containerMaxWidth ?? 560}px`,
                      margin: '0 auto',
                      padding: `${note.noteData.containerPadding ?? 10}px`,
                      borderRadius: `${note.noteData.containerBorderRadius ?? 12}px`,
                      border: `${note.noteData.containerBorderWidth ?? 1}px solid ${note.noteData.containerBorderColor ?? '#e0e0e0'}`,
                    }}
                  >
                    <Box sx={{ maxHeight: 200, overflow: 'hidden', position: 'relative' }}>
                      {note.noteData.objdata.slice(0, 3).map((component, compIndex) => {
                        switch (component.type) {
                          case 'category':
                            return null;
                          case 'heading':
                            return (
                              <Typography
                                key={compIndex}
                                variant={component.props?.level === 1 ? 'h5' : 'h6'}
                                gutterBottom
                              >
                                {component.content}
                              </Typography>
                            );
                          case 'paragraph':
                            return (
                              <Typography key={compIndex} variant="body2" gutterBottom>
                                {component.content}
                              </Typography>
                            );
                          case 'button':
                            return (
                              <Button
                                key={compIndex}
                                variant="contained"
                                size="small"
                                sx={{ mt: 1, mb: 1 }}
                                disabled
                              >
                                {component.content}
                              </Button>
                            );
                          case 'divider':
                            return <Divider key={compIndex} sx={{ my: 1 }} />;
                          default:
                            return null;
                        }
                      })}
                      {note.noteData.objdata.length > 3 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 60,
                            background:
                              'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
                          }}
                        />
                      )}
                    </Box>
                    {note.noteData.objdata.length > 3 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 1 }}
                      >
                        + {note.noteData.objdata.length - 3} more components
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
