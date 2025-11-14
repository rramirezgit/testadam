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
  TextField,
  IconButton,
  Typography,
  CardContent,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import useAuthStore from 'src/store/AuthStore';
import useTaskManagerStore from 'src/store/TaskManagerStore';
import { initiateNoteGeneration } from 'src/services/ai-service';

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

const AVAILABLE_CATEGORIES = [
  { value: 'Especies Marinas', label: 'Especies Marinas', color: '#e3f2fd' },
  { value: 'Acuarios', label: 'Acuarios', color: '#fff3e0' },
  { value: 'Conservación', label: 'Conservación', color: '#e8f5e9' },
  { value: 'Salud Marina', label: 'Salud Marina', color: '#e0f2f1' },
  { value: 'Cría', label: 'Cría y Reproducción', color: '#f3e5f5' },
  { value: 'Corales', label: 'Corales', color: '#fce4ec' },
  { value: 'Invertebrados', label: 'Invertebrados', color: '#fff8e1' },
  { value: 'Equipamiento', label: 'Equipamiento', color: '#fbe9e7' },
];

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
  const [formState, setFormState] = useState<NoteFormState>({
    title: '',
    category: '',
    prompt: '',
    status: 'idle',
    error: null,
  });

  // Estado para menú de sugerencias
  const [promptMenuOpen, setPromptMenuOpen] = useState<boolean>(false);
  const [selectedSuggestionCategory, setSelectedSuggestionCategory] = useState<string>('Todos');

  // Ref para el contenedor del diálogo
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setFormState({
        title: '',
        category: '',
        prompt: '',
        status: 'idle',
        error: null,
      });
    }
  }, [open]);

  // Actualizar campos
  const handleChange = (field: keyof NoteFormState, value: string) => {
    setFormState({
      ...formState,
      [field]: value,
      error: null, // Limpiar error al editar
    });
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
    handleChange('prompt', suggestion.prompt);

    // Auto-rellenar categoría si coincide
    if (!formState.category && AVAILABLE_CATEGORIES.some((c) => c.value === suggestion.category)) {
      setFormState({
        ...formState,
        prompt: suggestion.prompt,
        category: suggestion.category,
      });
    }

    handleClosePromptMenu();
  };

  // Validar formulario
  const validateForm = (): string | null => {
    if (!formState.prompt.trim()) {
      return 'El prompt es obligatorio';
    }

    // Sin validaciones de longitud - se permite cualquier tamaño de prompt

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
      // Construir request
      const request = {
        prompt: formState.prompt,
        title: formState.title || undefined,
        category: formState.category || undefined,
        template: 'NEWS' as const,
        userId: user.id,
        plan: user.plan?.name || null,
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
        category: formState.category,
        prompt: formState.prompt,
        createdAt: new Date().toISOString(),
      });

      // Iniciar polling en background
      startPolling(response.taskId);

      // Cerrar modal inmediatamente
      onClose();

      // Limpiar formulario
      setFormState({
        title: '',
        category: '',
        prompt: '',
        status: 'idle',
        error: null,
      });
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
        {/* Error message */}
        {formState.error && (
          <Card sx={{ mb: 3, border: 1, borderColor: 'error.main', bgcolor: 'error.lighter' }}>
            <CardContent sx={{ py: 1.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Icon icon="solar:danger-circle-bold" width={20} color="#d32f2f" />
                <Typography variant="body2" color="error.dark">
                  {formState.error}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}

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

        {/* Título (opcional) */}
        <Box sx={{ mb: 3 }}>
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
            onChange={(e) => handleChange('title', e.target.value)}
            disabled={formState.status === 'generating'}
            helperText={`${formState.title.length}/200 caracteres`}
          />
        </Box>

        {/* Categoría */}
        {/* <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Categoría (opcional)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Selecciona una categoría para tu nota
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
            {AVAILABLE_CATEGORIES.map((cat) => (
              <Chip
                key={cat.value}
                label={cat.label}
                onClick={() => handleChange('category', cat.value)}
                color={formState.category === cat.value ? 'primary' : 'default'}
                variant={formState.category === cat.value ? 'filled' : 'outlined'}
                disabled={formState.status === 'generating'}
              />
            ))}
            {formState.category && (
              <Chip
                label="Limpiar"
                size="small"
                onDelete={() => handleChange('category', '')}
                disabled={formState.status === 'generating'}
              />
            )}
          </Stack>
        </Box> */}

        {/* Prompt */}
        <Box sx={{ mb: 2 }}>
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
            onChange={(e) => handleChange('prompt', e.target.value)}
            disabled={formState.status === 'generating'}
            // helperText={`${formState.prompt.length}/2000 caracteres`}
          />
        </Box>

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
