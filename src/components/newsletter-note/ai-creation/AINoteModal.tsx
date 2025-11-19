'use client';

import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';

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

import type { NoteFormState, PromptSuggestion } from './types';

interface AINoteModalProps {
  open: boolean;
  onClose: () => void;
  selectedTemplate?: string; // Template seleccionado previamente (opcional)
  onInjectAIData?: (data: {
    objData: any[];
    objDataWeb: any[];
    title?: string;
    description?: string;
    coverImageUrl?: string;
    origin?: string;
  }) => void; // Callback para inyectar datos generados
}

const INITIAL_FORM_STATE: NoteFormState = {
  title: '',
  prompt: '',
  contentTypeId: '',
  categoryId: '',
  subcategoryId: '',
  mediaGenerationAI: true,
  status: 'idle',
  error: null,
};

export default function AINoteModal({
  open,
  onClose,
  selectedTemplate,
  onInjectAIData = () => {},
}: AINoteModalProps) {
  // Store de tareas en background
  const addTask = useTaskManagerStore((state) => state.addTask);
  const startPolling = useTaskManagerStore((state) => state.startPolling);

  // Auth store para obtener userId y plan
  const user = useAuthStore((state) => state.user);

  // Estado del formulario
  const [formState, setFormState] = useState<NoteFormState>(INITIAL_FORM_STATE);

  const {
    contentTypes,
    loadingContentTypes,
    ensureCategories,
    getCategories,
    getSubcategories,
    isLoadingCategories,
  } = useContentMetadataOptions();

  // Estado para menú de sugerencias
  const [promptMenuOpen, setPromptMenuOpen] = useState<boolean>(false);
  const [selectedSuggestionCategory, setSelectedSuggestionCategory] = useState<string>('Todos');

  // Ref para el contenedor del diálogo
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const isGenerating = formState.status === 'generating';

  const categoriesForSelectedType = getCategories(formState.contentTypeId);
  const subcategoriesForSelectedCategory = getSubcategories(
    formState.contentTypeId,
    formState.categoryId
  );
  const handleContentTypeSelect = async (value: string) => {
    handleFieldChange('contentTypeId', value);
    handleFieldChange('categoryId', '');
    handleFieldChange('subcategoryId', '');
    if (value) {
      await ensureCategories(value);
    }
  };

  const handleCategorySelect = (value: string) => {
    handleFieldChange('categoryId', value);
    handleFieldChange('subcategoryId', '');
  };

  const handleSubcategorySelect = (value: string) => {
    handleFieldChange('subcategoryId', value);
  };

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setFormState(INITIAL_FORM_STATE);
    }
  }, [open]);

  useEffect(() => {
    if (open && formState.contentTypeId) {
      ensureCategories(formState.contentTypeId);
    }
  }, [ensureCategories, formState.contentTypeId, open]);

  // Actualizar campos
  const handleFieldChange = <K extends keyof NoteFormState>(field: K, value: NoteFormState[K]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      error: null,
    }));
  };

  // Abrir menú de sugerencias
  const handleOpenPromptMenu = () => {
    setPromptMenuOpen(true);
  };

  // Cerrar menú de sugerencias
  const handleClosePromptMenu = () => {
    setPromptMenuOpen(false);
    setSelectedSuggestionCategory('Todos');
  };

  // Seleccionar sugerencia
  const handleSelectSuggestion = (suggestion: PromptSuggestion) => {
    handleFieldChange('prompt', suggestion.prompt);

    handleClosePromptMenu();
  };

  // Validar formulario
  const validateForm = (): string | null => {
    if (!formState.prompt.trim()) {
      return 'El prompt es obligatorio';
    }

    if (!formState.contentTypeId) {
      return 'Selecciona un tipo de contenido para la nota';
    }

    if (!formState.categoryId) {
      return 'Selecciona una categoría para la nota';
    }

    if (!formState.subcategoryId) {
      return 'Selecciona una subcategoría para la nota';
    }

    return null;
  };

  // Generar nota
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
        error: 'Usuario no autenticado',
      });
      return;
    }

    setFormState({
      ...formState,
      status: 'generating',
      error: null,
    });

    try {
      const categoriesSnapshot = getCategories(formState.contentTypeId);
      const categoryName = categoriesSnapshot.find(
        (category) => category.id === formState.categoryId
      )?.name;

      // Construir request
      const request = {
        prompt: formState.prompt,
        title: formState.title || undefined,
        template: 'NEWS' as const,
        userId: user.id,
        plan: user.plan?.name || null,
        category: categoryName,
        contentTypeId: formState.contentTypeId,
        categoryId: formState.categoryId,
        subcategoryId: formState.subcategoryId,
        mediaGenerationAI: formState.mediaGenerationAI,
      };

      // Iniciar generación (obtener taskId)
      const response = await initiateNoteGeneration(request);

      console.log('✅ Tarea iniciada:', response.taskId);

      // Registrar tarea en TaskManagerStore
      addTask({
        taskId: response.taskId,
        status: 'PENDING',
        progress: 0,
        message: 'Iniciando generación...',
        title: formState.title || formState.prompt,
        category: categoryName,
        prompt: formState.prompt,
        createdAt: new Date().toISOString(),
      });

      // Iniciar polling en background
      startPolling(response.taskId);

      // Cerrar modal inmediatamente
      onClose();

      // Limpiar formulario
      setFormState(INITIAL_FORM_STATE);
    } catch (error: any) {
      console.error('Error iniciando generación de nota:', error);
      setFormState({
        ...formState,
        status: 'error',
        error: error.message || 'Error al iniciar la generación. Por favor, intenta de nuevo.',
      });
    }
  };

  // Obtener sugerencias filtradas
  const getFilteredSuggestions = () => {
    if (selectedSuggestionCategory === 'Todos') {
      return getAllPromptSuggestions();
    }
    return getPromptsByCategory(selectedSuggestionCategory);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h6" fontWeight={600}>
              Crear Bloque Web con IA
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <Icon icon="solar:close-circle-linear" width={24} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent ref={dialogContentRef} sx={{ p: 3 }}>
        {/* Información */}
        <Card
          sx={{ mb: 3, bgcolor: 'primary.lighter', border: 1, borderColor: 'primary.light', mt: 1 }}
        >
          <CardContent sx={{ py: 1.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Typography variant="body2" color="primary.dark">
                La IA generará contenido especializado sobre vida marina y el cuidado de especies.
                Puedes editar el contenido después de la generación.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, border: 1, borderColor: 'divider' }}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Título (opcional)
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Si no lo completas, la IA generará un título basado en el prompt
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ej: Guía completa para el cuidado del Pez Payaso"
                  value={formState.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  disabled={formState.status === 'generating'}
                  helperText={`${formState.title.length}/200 caracteres`}
                />
              </Box>

              <Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Prompt detallado
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<Icon icon="solar:lightbulb-bolt-linear" />}
                    onClick={handleOpenPromptMenu}
                    disabled={formState.status === 'generating'}
                  >
                    Ver sugerencias
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Describe con detalle qué contenido quieres generar
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Ej: Crea una guía completa sobre el cuidado del Pez Payaso en acuarios marinos. Incluye requisitos de agua, alimentación, comportamiento, compatibilidad con otras especies, enfermedades comunes y su relación con las anémonas. Usa un tono profesional e informativo."
                  value={formState.prompt}
                  onChange={(e) => handleFieldChange('prompt', e.target.value)}
                  disabled={formState.status === 'generating'}
                />
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" mb={1}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Metadatos del bloque
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ayuda a la IA a clasificar correctamente la nota seleccionando el tipo de
                    contenido, la categoría y la subcategoría.
                  </Typography>
                </Box>
                <Chip
                  label="Obligatorio"
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, mt: { xs: 2, sm: 0 } }}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Box flex={1}>
                  <FormControl fullWidth disabled={isGenerating || loadingContentTypes}>
                    <InputLabel>
                      {loadingContentTypes ? 'Cargando tipos...' : 'Tipo de contenido *'}
                    </InputLabel>
                    <Select
                      variant="filled"
                      value={formState.contentTypeId}
                      label="Tipo de contenido *"
                      onChange={(e) => handleContentTypeSelect(e.target.value)}
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
                  {loadingContentTypes ? (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="primary.main">
                        Cargando tipos de contenido...
                      </Typography>
                    </Stack>
                  ) : !formState.contentTypeId ? (
                    <Typography variant="caption" color="text.secondary">
                      Selecciona el tipo de contenido antes de continuar.
                    </Typography>
                  ) : null}
                </Box>

                <Box flex={1}>
                  <FormControl
                    fullWidth
                    disabled={
                      isGenerating ||
                      !formState.contentTypeId ||
                      isLoadingCategories(formState.contentTypeId)
                    }
                  >
                    <InputLabel>
                      {isLoadingCategories(formState.contentTypeId)
                        ? 'Cargando categorías...'
                        : 'Categoría *'}
                    </InputLabel>
                    <Select
                      variant="filled"
                      value={formState.categoryId}
                      label="Categoría *"
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      endAdornment={
                        isLoadingCategories(formState.contentTypeId) ? (
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
                      {categoriesForSelectedType.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {isLoadingCategories(formState.contentTypeId) ? (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="primary.main">
                        Cargando categorías...
                      </Typography>
                    </Stack>
                  ) : !formState.contentTypeId ? (
                    <Typography variant="caption" color="text.secondary">
                      Primero selecciona un tipo de contenido.
                    </Typography>
                  ) : formState.contentTypeId &&
                    categoriesForSelectedType.length === 0 &&
                    !isLoadingCategories(formState.contentTypeId) ? (
                    <Typography variant="caption" color="text.secondary">
                      No hay categorías disponibles para este tipo de contenido.
                    </Typography>
                  ) : null}
                </Box>

                <Box flex={1}>
                  <FormControl
                    fullWidth
                    disabled={
                      isGenerating ||
                      !formState.categoryId ||
                      subcategoriesForSelectedCategory.length === 0
                    }
                  >
                    <InputLabel>Subcategoría *</InputLabel>
                    <Select
                      variant="filled"
                      value={formState.subcategoryId}
                      label="Subcategoría *"
                      onChange={(e) => handleSubcategorySelect(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Selecciona</em>
                      </MenuItem>
                      {subcategoriesForSelectedCategory.map((subcategory) => (
                        <MenuItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {!formState.categoryId ? (
                    <Typography variant="caption" color="text.secondary">
                      Selecciona una categoría para ver las subcategorías disponibles.
                    </Typography>
                  ) : formState.categoryId && subcategoriesForSelectedCategory.length === 0 ? (
                    <Typography variant="caption" color="warning.main">
                      Esta categoría no tiene subcategorías configuradas.
                    </Typography>
                  ) : null}
                </Box>
              </Stack>

              <FormControlLabel
                sx={{ mt: 1, alignItems: 'flex-start' }}
                control={
                  <Switch
                    color="primary"
                    checked={formState.mediaGenerationAI}
                    onChange={(e) => handleFieldChange('mediaGenerationAI', e.target.checked)}
                    disabled={isGenerating}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Incluir imágenes generadas por IA
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Desactiva esta opción si prefieres generar solo texto (sin placeholders ni
                      imágenes automáticas).
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </CardContent>
        </Card>
        {/* Dialog de sugerencias centrado */}
        <Dialog
          open={promptMenuOpen}
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
                  onClick={() => setSelectedSuggestionCategory('Todos')}
                  color={selectedSuggestionCategory === 'Todos' ? 'primary' : 'default'}
                  clickable
                />
                {getUniqueCategories().map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    size="small"
                    onClick={() => setSelectedSuggestionCategory(category)}
                    color={selectedSuggestionCategory === category ? 'primary' : 'default'}
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
          sx={{ minWidth: 140 }}
        >
          {formState.status === 'generating' ? 'Iniciando...' : 'Generar Bloque Web'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
