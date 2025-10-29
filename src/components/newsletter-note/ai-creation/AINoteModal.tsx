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

import useAiGenerationStore from 'src/store/AiGenerationStore';

import AIGenerationProgress from './AIGenerationProgress';
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
  // Store de generación IA
  const {
    loading,
    status: generationStatus,
    progress,
    message: progressMessage,
    error: generationError,
    generateNote,
    cancelGeneration,
    clearCurrentGeneration,
  } = useAiGenerationStore();

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

  // Ref para el contenedor del diálogo (para auto-scroll)
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll suave cuando aparece el progreso
  useEffect(() => {
    if (loading && generationStatus && dialogContentRef.current) {
      // Pequeño delay para asegurar que el componente se haya renderizado
      setTimeout(() => {
        dialogContentRef.current?.scrollTo({
          top: dialogContentRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 300);
    }
  }, [loading, generationStatus]);

  // Detectar cuando la generación termina exitosamente (si el modal está abierto)
  useEffect(() => {
    if (open && generationStatus === 'COMPLETED' && !loading) {
      // Pequeño delay para que el usuario vea el 100%
      setTimeout(() => {
        onClose();
        // Limpiar formulario después de completar exitosamente
        setFormState({
          title: '',
          category: '',
          prompt: '',
          status: 'idle',
          error: null,
        });
      }, 1000);
    }
  }, [open, generationStatus, loading, onClose]);

  // Limpiar formulario y store cuando se cierra el modal (solo si NO está generando)
  useEffect(() => {
    if (!open && !loading) {
      // Solo limpiar si NO está generando
      // Así el usuario puede reabrir el modal y ver lo que había escrito
      setFormState({
        title: '',
        category: '',
        prompt: '',
        status: 'idle',
        error: null,
      });
      clearCurrentGeneration();
    }
  }, [open, loading, clearCurrentGeneration]);

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

    if (formState.prompt.length < 10) {
      return 'El prompt debe tener al menos 10 caracteres';
    }

    if (formState.prompt.length > 2000) {
      return 'El prompt no puede exceder 2000 caracteres';
    }

    if (formState.title && formState.title.length > 200) {
      return 'El título no puede exceder 200 caracteres';
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

    setFormState({
      ...formState,
      status: 'generating',
      error: null,
    });

    try {
      // Llamar al store para generar (con polling automático)
      const result = await generateNote(
        formState.prompt,
        formState.title || undefined,
        formState.category || undefined,
        'NEWS'
      );

      // Verificar que se haya completado exitosamente
      if (!result) {
        throw new Error(generationError || 'Error al generar la nota');
      }

      // Inyectar los datos generados en el editor
      onInjectAIData({
        objData: result.objData,
        objDataWeb: result.objDataWeb,
        title: result.title,
        description: result.description,
        coverImageUrl: result.coverImageUrl,
        origin: result.origin,
      });

      // El cierre automático del modal se maneja en el useEffect que detecta COMPLETED
    } catch (error: any) {
      console.error('Error generando nota con IA:', error);
      setFormState({
        ...formState,
        status: 'error',
        error: error.message || 'Error al generar la nota. Por favor, intenta de nuevo.',
      });
    }
  };

  // Cancelar generación
  const handleCancel = () => {
    cancelGeneration();

    // Limpiar el formulario cuando se cancela
    setFormState({
      title: '',
      category: '',
      prompt: '',
      status: 'idle',
      error: null,
    });
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
              Crear Nota con IA
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
                La IA generará contenido especializado sobre acuariofilia, vida marina y cuidado de
                especies. Puedes editar el contenido después de la generación.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Título (opcional) */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Título de la nota (opcional)
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
        <Box sx={{ mb: 3 }}>
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
        </Box>

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
            helperText={`${formState.prompt.length}/2000 caracteres`}
          />
        </Box>

        {/* Loading state con progreso */}
        {formState.status === 'generating' && loading && generationStatus && (
          <Box sx={{ mt: 3 }}>
            <AIGenerationProgress
              status={generationStatus}
              progress={progress}
              message={progressMessage}
              onCancel={handleCancel}
              showCancel
            />
          </Box>
        )}

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
        {formState.status === 'generating' ? (
          <>
            {/* Cuando está generando: botón para cancelar generación */}
            <Button onClick={handleCancel} color="error" variant="outlined" sx={{ minWidth: 140 }}>
              Cancelar Generación
            </Button>
            {/* Botón para cerrar modal sin cancelar */}
            <Button onClick={onClose} variant="contained" sx={{ minWidth: 100 }}>
              Cerrar
            </Button>
          </>
        ) : (
          <>
            {/* Cuando no está generando: flujo normal */}
            <Button onClick={onClose} sx={{ minWidth: 100 }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleGenerate} sx={{ minWidth: 140 }}>
              Generar Nota
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
