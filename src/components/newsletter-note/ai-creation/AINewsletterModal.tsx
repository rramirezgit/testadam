'use client';

import { nanoid } from 'nanoid';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Dialog,
  Select,
  Switch,
  MenuItem,
  TextField,
  IconButton,
  InputLabel,
  Typography,
  CardContent,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  LinearProgress,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import useAuthStore from 'src/store/AuthStore';
import useTaskManagerStore from 'src/store/TaskManagerStore';
import { initiateNoteGeneration } from 'src/services/ai-service';

import { useContentMetadataOptions } from './hooks/useContentMetadataOptions';
import {
  getUniqueCategories,
  getPromptsByCategory,
  getAllPromptSuggestions,
} from './prompt-suggestions';

import type { PromptSuggestion, NewsletterNoteForm, NewsletterFormState } from './types';

interface AINewsletterModalProps {
  open: boolean;
  onClose: () => void;
}

const MIN_NOTES = 1;
const MAX_NOTES = 4;

const createEmptyNote = (): NewsletterNoteForm => ({
  prompt: '',
  contentTypeId: '',
  categoryId: '',
  subcategoryId: '',
  mediaGenerationAI: false,
});

export default function AINewsletterModal({ open, onClose }: AINewsletterModalProps) {
  // Auth store para obtener userId y plan
  const user = useAuthStore((state) => state.user);

  // Task Manager Store
  const addTask = useTaskManagerStore((state) => state.addTask);
  const startPolling = useTaskManagerStore((state) => state.startPolling);

  // Estado del formulario
  const [formState, setFormState] = useState<NewsletterFormState>({
    notesCount: 1,
    notes: Array.from({ length: 3 }, () => createEmptyNote()),
    status: 'idle',
    error: null,
    progress: 0,
  });

  const {
    contentTypes,
    loadingContentTypes,
    ensureCategories,
    getCategories,
    getSubcategories,
    isLoadingCategories,
  } = useContentMetadataOptions();

  // Estado para menús de sugerencias
  const [promptMenuOpen, setPromptMenuOpen] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setFormState({
        notesCount: 1,
        notes: Array.from({ length: 1 }, () => createEmptyNote()),
        status: 'idle',
        error: null,
        progress: 0,
      });
    }
  }, [open]);

  // Actualizar array de notas cuando cambia la cantidad
  const handleNotesCountChange = (count: number) => {
    const validCount = Math.max(MIN_NOTES, Math.min(MAX_NOTES, count));
    setFormState((prev) => {
      const nextNotes =
        prev.notes.length >= validCount
          ? prev.notes.slice(0, validCount)
          : [
              ...prev.notes,
              ...Array.from({ length: validCount - prev.notes.length }, () => createEmptyNote()),
            ];

      return {
        ...prev,
        notesCount: validCount,
        notes: nextNotes,
      };
    });
  };

  // Actualizar un prompt específico
  const handlePromptChange = (index: number, value: string) => {
    setFormState((prev) => {
      const nextNotes = [...prev.notes];
      nextNotes[index] = { ...nextNotes[index], prompt: value };
      return { ...prev, notes: nextNotes };
    });
  };

  const handleNoteMetadataChange = (index: number, changes: Partial<NewsletterNoteForm>): void => {
    setFormState((prev) => {
      const nextNotes = [...prev.notes];
      nextNotes[index] = { ...nextNotes[index], ...changes };
      return { ...prev, notes: nextNotes };
    });
  };

  const handleNoteContentTypeChange = async (index: number, value: string) => {
    handleNoteMetadataChange(index, {
      contentTypeId: value,
      categoryId: '',
      subcategoryId: '',
    });
    if (value) {
      await ensureCategories(value);
    }
  };

  const handleNoteCategoryChange = (index: number, value: string) => {
    handleNoteMetadataChange(index, {
      categoryId: value,
      subcategoryId: '',
    });
  };

  const handleNoteSubcategoryChange = (index: number, value: string) => {
    handleNoteMetadataChange(index, { subcategoryId: value });
  };

  const handleNoteMediaToggle = (index: number, checked: boolean) => {
    handleNoteMetadataChange(index, { mediaGenerationAI: checked });
  };

  // Abrir menú de sugerencias
  const handleOpenPromptMenu = (index: number) => {
    setPromptMenuOpen(index);
  };

  // Cerrar menú de sugerencias
  const handleClosePromptMenu = () => {
    setPromptMenuOpen(null);
    setSelectedCategory('Todos');
  };

  // Seleccionar sugerencia
  const handleSelectSuggestion = (suggestion: PromptSuggestion) => {
    if (promptMenuOpen !== null) {
      handlePromptChange(promptMenuOpen, suggestion.prompt);
    }
    handleClosePromptMenu();
  };

  // Validar formulario
  const validateForm = (): string | null => {
    if (formState.notes.every((note) => !note.prompt.trim())) {
      return 'Debes ingresar al menos un prompt';
    }

    const emptyPrompts = formState.notes.filter((note) => !note.prompt.trim()).length;
    if (emptyPrompts > 0) {
      return `Tienes ${emptyPrompts} prompt(s) vacío(s). Completa todos los campos o reduce la cantidad de notas.`;
    }

    for (let index = 0; index < formState.notes.length; index += 1) {
      const note = formState.notes[index];
      const noteNumber = index + 1;

      if (!note.contentTypeId) {
        return `Selecciona el tipo de contenido para la nota ${noteNumber}`;
      }

      if (!note.categoryId) {
        return `Selecciona una categoría para la nota ${noteNumber}`;
      }

      if (!note.subcategoryId) {
        return `Selecciona una subcategoría para la nota ${noteNumber}`;
      }
    }

    return null;
  };

  // Generar newsletter
  const handleGenerate = async () => {
    const validationError = validateForm();
    if (validationError) {
      setFormState({
        ...formState,
        error: validationError,
      });
      return;
    }

    if (!user?.id) {
      setFormState({
        ...formState,
        error: 'No se pudo obtener el ID del usuario',
      });
      return;
    }

    setFormState({
      ...formState,
      status: 'generating',
      error: null,
      progress: 0,
    });

    try {
      // Generar un ID único para este newsletter
      const newsletterId = nanoid();
      const notesToGenerate = formState.notes;

      console.log('🚀 Iniciando generación de newsletter con', notesToGenerate.length, 'notas');
      console.log('📝 Newsletter ID:', newsletterId);

      // Iniciar generación de cada nota como tarea independiente
      const taskPromises = notesToGenerate.map(async (note, index) => {
        try {
          if (note.contentTypeId) {
            await ensureCategories(note.contentTypeId);
          }

          const categoriesSnapshot = getCategories(note.contentTypeId);
          const categoryName = categoriesSnapshot.find(
            (category) => category.id === note.categoryId
          )?.name;
          const prompt = note.prompt.trim();

          // Iniciar generación en el backend (SIN newsletterId ni noteIndexInNewsletter)
          const response = await initiateNoteGeneration({
            prompt,
            template: 'NEWS',
            userId: user.id,
            plan: user.plan?.name || null,
            contentTypeId: note.contentTypeId,
            categoryId: note.categoryId,
            subcategoryId: note.subcategoryId,
            category: categoryName,
            mediaGenerationAI: note.mediaGenerationAI,
          });

          // Crear tarea en el store (AQUÍ sí agregamos newsletterId e index para agrupar en frontend)
          const task = {
            taskId: response.taskId,
            status: response.status,
            progress: 0,
            message: response.message,
            prompt,
            title: `Nota ${index + 1}`,
            createdAt: new Date().toISOString(),
            category: categoryName,
            // Campos solo para uso del frontend
            newsletterId,
            noteIndexInNewsletter: index,
          };

          // Agregar al store y comenzar polling
          addTask(task);
          startPolling(response.taskId);

          console.log(`✅ Tarea ${index + 1}/${notesToGenerate.length} iniciada:`, response.taskId);

          return response.taskId;
        } catch (error: any) {
          console.error(`❌ Error al iniciar tarea ${index + 1}:`, error);
          throw error;
        }
      });

      // Esperar a que todas las tareas se hayan iniciado
      await Promise.all(taskPromises);

      console.log('✅ Todas las tareas del newsletter iniciadas correctamente');

      // Cerrar el modal inmediatamente
      onClose();

      // Las tareas aparecerán en el TasksDrawer agrupadas por newsletterId
    } catch (error: any) {
      console.error('❌ Error generando newsletter con IA:', error);
      setFormState({
        ...formState,
        status: 'error',
        error: error.message || 'Error al generar el newsletter. Por favor, intenta de nuevo.',
      });
    }
  };

  // Obtener sugerencias filtradas
  const getFilteredSuggestions = () => {
    if (selectedCategory === 'Todos') {
      return getAllPromptSuggestions();
    }
    return getPromptsByCategory(selectedCategory);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h6" fontWeight={600}>
              Crear Comunicado con IA
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <Icon icon="solar:close-circle-linear" width={24} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Cantidad de notas */}
        <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Cantidad de notas
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Selecciona cuántas notas quieres incluir en tu newsletter
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                onClick={() => handleNotesCountChange(formState.notesCount - 1)}
                disabled={formState.notesCount <= MIN_NOTES || formState.status === 'generating'}
                size="small"
              >
                <Icon icon="solar:minus-circle-bold" width={28} />
              </IconButton>
              <TextField
                value={formState.notesCount}
                onChange={(e) => handleNotesCountChange(parseInt(e.target.value, 10) || MIN_NOTES)}
                type="number"
                inputProps={{ min: MIN_NOTES, max: MAX_NOTES }}
                disabled={formState.status === 'generating'}
                sx={{ width: 100, textAlign: 'center' }}
              />
              <IconButton
                onClick={() => handleNotesCountChange(formState.notesCount + 1)}
                disabled={formState.notesCount >= MAX_NOTES || formState.status === 'generating'}
                size="small"
              >
                <Icon icon="solar:add-circle-bold" width={28} />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                (Mínimo {MIN_NOTES}, Máximo {MAX_NOTES})
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Prompts para cada nota */}
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Prompts para cada nota
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Describe qué contenido quieres generar para cada nota del comunicado
        </Typography>

        <Stack spacing={2}>
          {formState.notes.map((note, index) => {
            const categoriesForNote = getCategories(note.contentTypeId);
            const subcategoriesForNote = getSubcategories(note.contentTypeId, note.categoryId);
            const loadingCategoriesForNote = note.contentTypeId
              ? isLoadingCategories(note.contentTypeId)
              : false;

            return (
              <Card key={`note-${index}`} sx={{ border: 1, borderColor: 'divider' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Nota {index + 1}
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<Icon icon="solar:lightbulb-bolt-linear" />}
                      onClick={() => handleOpenPromptMenu(index)}
                      disabled={formState.status === 'generating'}
                    >
                      Sugerencias
                    </Button>
                  </Box>
                  <FormControlLabel
                    sx={{ mb: 1.5 }}
                    control={
                      <Switch
                        color="primary"
                        checked={note.mediaGenerationAI}
                        onChange={(e) => handleNoteMediaToggle(index, e.target.checked)}
                        disabled={formState.status === 'generating'}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Incluir imágenes generadas por IA
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Actívalo para acompañar el texto con imágenes generadas automáticamente.
                        </Typography>
                      </Box>
                    }
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Ej: Escribe sobre una nueva especie de coral descubierta en la Gran Barrera de Coral, incluyendo sus características únicas y su importancia para el ecosistema marino..."
                    value={note.prompt}
                    onChange={(e) => handlePromptChange(index, e.target.value)}
                    disabled={formState.status === 'generating'}
                    helperText={`${note.prompt.length} caracteres`}
                  />

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} mt={1}>
                    <Box flex={1}>
                      <FormControl
                        fullWidth
                        disabled={formState.status === 'generating' || loadingContentTypes}
                      >
                        <InputLabel>
                          {loadingContentTypes ? 'Cargando tipos...' : 'Tipo de contenido *'}
                        </InputLabel>
                        <Select
                          variant="filled"
                          value={note.contentTypeId}
                          label="Tipo de contenido *"
                          onChange={(e) => handleNoteContentTypeChange(index, e.target.value)}
                          endAdornment={
                            loadingContentTypes ? (
                              <CircularProgress
                                size={20}
                                sx={{ position: 'absolute', right: 32, pointerEvents: 'none' }}
                              />
                            ) : null
                          }
                        >
                          <MenuItem value="">
                            <em>Selecciona</em>
                          </MenuItem>
                          {contentTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {loadingContentTypes && (
                        <Typography variant="caption" color="primary.main" sx={{ mt: 0.5 }}>
                          Cargando tipos de contenido...
                        </Typography>
                      )}
                    </Box>

                    <Box flex={1}>
                      <FormControl
                        fullWidth
                        disabled={
                          formState.status === 'generating' ||
                          !note.contentTypeId ||
                          loadingCategoriesForNote
                        }
                      >
                        <InputLabel>
                          {loadingCategoriesForNote ? 'Cargando categorías...' : 'Categoría *'}
                        </InputLabel>
                        <Select
                          variant="filled"
                          value={note.categoryId}
                          label="Categoría *"
                          onChange={(e) => handleNoteCategoryChange(index, e.target.value)}
                          endAdornment={
                            loadingCategoriesForNote ? (
                              <CircularProgress
                                size={20}
                                sx={{ position: 'absolute', right: 32, pointerEvents: 'none' }}
                              />
                            ) : null
                          }
                        >
                          <MenuItem value="">
                            <em>Selecciona</em>
                          </MenuItem>
                          {categoriesForNote.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {loadingCategoriesForNote ? (
                        <Typography variant="caption" color="primary.main" sx={{ mt: 0.5 }}>
                          Cargando categorías...
                        </Typography>
                      ) : !note.contentTypeId ? (
                        <Typography variant="caption" color="text.secondary">
                          Selecciona un tipo de contenido primero.
                        </Typography>
                      ) : note.contentTypeId &&
                        categoriesForNote.length === 0 &&
                        !loadingCategoriesForNote ? (
                        <Typography variant="caption" color="text.secondary">
                          No hay categorías disponibles para este tipo.
                        </Typography>
                      ) : null}
                    </Box>

                    <Box flex={1}>
                      <FormControl
                        fullWidth
                        disabled={
                          formState.status === 'generating' ||
                          !note.categoryId ||
                          subcategoriesForNote.length === 0
                        }
                      >
                        <InputLabel>Subcategoría *</InputLabel>
                        <Select
                          variant="filled"
                          value={note.subcategoryId}
                          label="Subcategoría *"
                          onChange={(e) => handleNoteSubcategoryChange(index, e.target.value)}
                        >
                          <MenuItem value="">
                            <em>Selecciona</em>
                          </MenuItem>
                          {subcategoriesForNote.map((subcategory) => (
                            <MenuItem key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {!note.categoryId ? (
                        <Typography variant="caption" color="text.secondary">
                          Selecciona una categoría para ver las opciones disponibles.
                        </Typography>
                      ) : note.categoryId && subcategoriesForNote.length === 0 ? (
                        <Typography variant="caption" color="warning.main">
                          Esta categoría no tiene subcategorías configuradas.
                        </Typography>
                      ) : null}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        {/* Loading state */}
        {formState.status === 'generating' && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Generando comunicado... Esto puede tomar algunos minutos
            </Typography>
          </Box>
        )}

        {/* Dialog de sugerencias centrado */}
        <Dialog
          open={promptMenuOpen !== null}
          onClose={handleClosePromptMenu}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              maxHeight: '80vh',
            },
          }}
        >
          <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1.5}>
                <Typography variant="h6" fontWeight={600}>
                  Sugerencias de Prompts
                  {promptMenuOpen !== null && ` - Nota ${promptMenuOpen + 1}`}
                </Typography>
              </Box>
              <IconButton onClick={handleClosePromptMenu} size="small">
                <Icon icon="solar:close-circle-linear" width={24} />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            {/* Categorías */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Filtrar por categoría
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                <Chip
                  label="Todos"
                  size="small"
                  onClick={() => setSelectedCategory('Todos')}
                  color={selectedCategory === 'Todos' ? 'primary' : 'default'}
                  clickable
                />
                {getUniqueCategories().map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    onClick={() => setSelectedCategory(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                    clickable
                  />
                ))}
              </Stack>
            </Box>

            {/* Lista de sugerencias */}
            <Stack spacing={2}>
              {getFilteredSuggestions().map((suggestion) => (
                <Card
                  key={suggestion.id}
                  sx={{
                    cursor: 'pointer',
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 1,
                    },
                  }}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {suggestion.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {suggestion.prompt}
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                      {suggestion.tags?.map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button onClick={handleClosePromptMenu} sx={{ minWidth: 100 }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </DialogContent>

      {/* Error message - Siempre visible arriba de los botones */}
      {formState.error && (
        <Box sx={{ px: 3, pb: 2 }}>
          <Card sx={{ border: 1.5, borderColor: 'error.main', bgcolor: 'error.lighter' }}>
            <CardContent sx={{ py: 1.5, px: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Icon icon="solar:danger-circle-bold" width={22} color="#d32f2f" />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="error.dark" gutterBottom>
                    Error en la validación
                  </Typography>
                  <Typography variant="body2" color="error.dark">
                    {formState.error}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          onClick={onClose}
          disabled={formState.status === 'generating'}
          sx={{ minWidth: 100 }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleGenerate}
          disabled={formState.status === 'generating'}
          sx={{ minWidth: 180 }}
        >
          Generar Comunicado
        </Button>
      </DialogActions>
    </Dialog>
  );
}
