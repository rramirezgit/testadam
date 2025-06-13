'use client';

import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  List,
  Chip,
  Button,
  Divider,
  ListItem,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';

import { useStore } from 'src/lib/store';
import usePostStore from 'src/store/PostStore';

import type { NewsletterNote } from './types';

interface ContentLibraryProps {
  selectedNotes: NewsletterNote[];
  onAddNote: (note: NewsletterNote) => void;
  onEditNote: (note: any) => void;
}

export default function ContentLibrary({
  selectedNotes,
  onAddNote,
  onEditNote,
}: ContentLibraryProps) {
  // Zustand store for local notes
  const { notes, loadNotes } = useStore();

  // PostStore for backend notes
  const { findAll: findAllPosts, findById: findPostById, loading: loadingPosts } = usePostStore();

  // State for backend notes
  const [backendNotes, setBackendNotes] = useState<any[]>([]);
  const [loadingBackendNotes, setLoadingBackendNotes] = useState(false);

  // Load backend notes
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
    } finally {
      setLoadingBackendNotes(false);
    }
  };

  // Load notes on mount
  useEffect(() => {
    loadNotes();
    loadBackendNotes();
  }, [loadNotes]);

  // Add backend note to newsletter with complete data via findById
  const handleAddBackendNote = async (noteId: string, noteTitle: string) => {
    try {
      // Verificar si ya está agregada
      const isAlreadySelected = selectedNotes.some((selected) => selected.noteId === noteId);
      if (isAlreadySelected) {
        console.log('Note already selected:', noteTitle);
        return;
      }

      console.log('🔍 Fetching complete note data for:', noteTitle, noteId);

      // Hacer findById para obtener los datos completos de la nota
      const fullNoteResponse = await findPostById(noteId);

      if (!fullNoteResponse) {
        console.error('❌ No se pudo obtener la nota completa:', noteId);
        return;
      }

      console.log('✅ Full note data retrieved:', {
        id: fullNoteResponse.id,
        title: fullNoteResponse.title,
        hasObjData: !!fullNoteResponse.objData,
        hasObjDataWeb: !!fullNoteResponse.objDataWeb,
        hasConfigPost: !!fullNoteResponse.configPost,
      });

      // Crear objeto compatible con SavedNote con datos completos
      const savedNote = {
        id: fullNoteResponse.id,
        title: fullNoteResponse.title,
        configNote: fullNoteResponse.configPost || '{}',
        objData: fullNoteResponse.objData || '[]',
        objDataWeb: fullNoteResponse.objDataWeb || '[]',
      };

      // Crear NewsletterNote
      const newNote: NewsletterNote = {
        noteId: fullNoteResponse.id,
        order: selectedNotes.length,
        noteData: savedNote,
      };

      console.log('📝 Adding note to newsletter:', {
        noteId: newNote.noteId,
        title: savedNote.title,
        objDataLength: JSON.parse(savedNote.objData).length,
      });

      onAddNote(newNote);
    } catch (error) {
      console.error('❌ Error adding backend note:', error);
    }
  };

  // CSS para ocultar scrollbars
  const hideScrollbarStyles = {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
    '-ms-overflow-style': 'none',
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon="mdi:library" style={{ marginRight: 8 }} />
          Biblioteca de Contenido
        </Typography>

        {/* Botón para recargar notas del backend */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Icon icon="mdi:refresh" />}
          onClick={loadBackendNotes}
          disabled={loadingBackendNotes}
          sx={{ mb: 1 }}
        >
          {loadingBackendNotes ? 'Cargando...' : 'Actualizar Notas'}
        </Button>

        {/* Información de las notas del backend */}
        {backendNotes.length > 0 && (
          <Box sx={{ mt: 1, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="caption" color="info.contrastText">
              {backendNotes.length} notas en borrador disponibles
            </Typography>
          </Box>
        )}
      </Box>

      {/* Lista de notas */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1, ...hideScrollbarStyles }}>
        {/* Notas del Backend (DRAFT) */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, px: 1, color: 'text.secondary' }}>
            Notas en Borrador ({backendNotes.length})
          </Typography>

          {loadingBackendNotes ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Cargando notas...
              </Typography>
            </Box>
          ) : backendNotes.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Icon icon="mdi:note-outline" style={{ fontSize: 48, opacity: 0.3 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No hay notas en borrador
              </Typography>
            </Box>
          ) : (
            <List dense>
              {backendNotes.map((note) => {
                const isSelected = selectedNotes.some((selected) => selected.noteId === note.id);

                return (
                  <ListItem key={note.id} disablePadding sx={{ mb: 1 }}>
                    <Card
                      elevation={isSelected ? 3 : 1}
                      sx={{
                        width: '100%',
                        border: isSelected ? 2 : 1,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { elevation: 2 },
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                            {note.title}
                          </Typography>
                          {isSelected && (
                            <Chip
                              size="small"
                              label="Agregada"
                              color="primary"
                              sx={{ ml: 1, height: 20 }}
                            />
                          )}
                        </Box>

                        {/* Descripción si existe */}
                        {note.description && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 0.5 }}
                          >
                            {note.description.length > 50
                              ? `${note.description.substring(0, 50)}...`
                              : note.description}
                          </Typography>
                        )}

                        <Typography variant="caption" color="text.secondary" display="block">
                          {(() => {
                            try {
                              const configNote = JSON.parse(note.configPost || '{}');
                              const objData = JSON.parse(note.objData || '[]');
                              const templateType = configNote.templateType || 'unknown';
                              return `${templateType} • ${objData.length} componentes`;
                            } catch {
                              return 'Template desconocido • 0 componentes';
                            }
                          })()}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" display="block">
                          {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                        </Typography>

                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<Icon icon="mdi:pencil" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              const savedNote = {
                                id: note.id,
                                title: note.title,
                                configNote: note.configPost,
                                objData: note.objData,
                                objDataWeb: note.objDataWeb,
                              };
                              onEditNote(savedNote);
                            }}
                          >
                            Editar
                          </Button>
                          {!isSelected && (
                            <Button
                              size="small"
                              startIcon={<Icon icon="mdi:plus" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddBackendNote(note.id, note.title);
                              }}
                            >
                              Agregar
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>

        {/* Separador */}
        <Divider sx={{ my: 2 }} />

        {/* Notas Locales */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, px: 1, color: 'text.secondary' }}>
            Notas Locales ({notes.length})
          </Typography>

          {notes.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No hay notas locales
              </Typography>
            </Box>
          ) : (
            <List dense>
              {notes.map((note) => {
                const isSelected = selectedNotes.some((selected) => selected.noteId === note.id);
                return (
                  <ListItem key={note.id} disablePadding sx={{ mb: 1 }}>
                    <Card
                      elevation={isSelected ? 3 : 1}
                      sx={{
                        width: '100%',
                        border: isSelected ? 2 : 1,
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { elevation: 2 },
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                            {note.title}
                          </Typography>
                          {isSelected && (
                            <Chip
                              size="small"
                              label="Agregada"
                              color="secondary"
                              sx={{ ml: 1, height: 20 }}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {(() => {
                            try {
                              const configNote = JSON.parse(note.configNote);
                              const objData = JSON.parse(note.objData);
                              return `${configNote.templateType} • ${objData.length} componentes`;
                            } catch {
                              return 'Unknown template • 0 componentes';
                            }
                          })()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {(() => {
                            try {
                              const configNote = JSON.parse(note.configNote);
                              return new Date(
                                configNote.dateModified || configNote.dateCreated
                              ).toLocaleDateString();
                            } catch {
                              return 'Unknown date';
                            }
                          })()}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<Icon icon="mdi:pencil" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditNote(note);
                            }}
                          >
                            Editar
                          </Button>
                          {!isSelected && (
                            <Button
                              size="small"
                              startIcon={<Icon icon="mdi:plus" />}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newNote: NewsletterNote = {
                                  noteId: note.id,
                                  order: selectedNotes.length,
                                  noteData: note,
                                };
                                onAddNote(newNote);
                              }}
                            >
                              Agregar
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
}
