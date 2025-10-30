'use client';

import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

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
  LinearProgress,
} from '@mui/material';

// import { generateNewsletter } from 'src/services/ai-service'; // TODO: Implementar generación de newsletters
import {
  getUniqueCategories,
  getPromptsByCategory,
  getAllPromptSuggestions,
} from './prompt-suggestions';

import type { PromptSuggestion, NewsletterFormState } from './types';

interface AINewsletterModalProps {
  open: boolean;
  onClose: () => void;
}

const MIN_NOTES = 1;
const MAX_NOTES = 10;

export default function AINewsletterModal({ open, onClose }: AINewsletterModalProps) {
  // Estado del formulario
  const [formState, setFormState] = useState<NewsletterFormState>({
    notesCount: 3,
    prompts: ['', '', ''],
    status: 'idle',
    error: null,
    progress: 0,
  });

  // Estado para menús de sugerencias
  const [promptMenuOpen, setPromptMenuOpen] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setFormState({
        notesCount: 3,
        prompts: ['', '', ''],
        status: 'idle',
        error: null,
        progress: 0,
      });
    }
  }, [open]);

  // Actualizar array de prompts cuando cambia la cantidad
  const handleNotesCountChange = (count: number) => {
    const validCount = Math.max(MIN_NOTES, Math.min(MAX_NOTES, count));
    const newPrompts = Array(validCount)
      .fill('')
      .map((_, i) => formState.prompts[i] || '');

    setFormState({
      ...formState,
      notesCount: validCount,
      prompts: newPrompts,
    });
  };

  // Actualizar un prompt específico
  const handlePromptChange = (index: number, value: string) => {
    const newPrompts = [...formState.prompts];
    newPrompts[index] = value;
    setFormState({ ...formState, prompts: newPrompts });
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
    if (formState.prompts.every((p) => !p.trim())) {
      return 'Debes ingresar al menos un prompt';
    }

    const emptyPrompts = formState.prompts.filter((p) => !p.trim()).length;
    if (emptyPrompts > 0) {
      return `Tienes ${emptyPrompts} prompt(s) vacío(s). Completa todos los campos o reduce la cantidad de notas.`;
    }

    // Sin validaciones de longitud - se permite cualquier tamaño de prompt

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

    setFormState({
      ...formState,
      status: 'generating',
      error: null,
      progress: 0,
    });

    try {
      // TODO: Implementar generación de newsletters con IA
      console.error('⚠️ Generación de newsletters completos aún no implementada');
      throw new Error(
        'Funcionalidad en desarrollo. Por favor, use la generación de notas individuales.'
      );

      // // Llamar al servicio de IA
      // const response = await generateNewsletter({
      //   prompts: formState.prompts.filter((p) => p.trim()),
      // });

      // // Verificar que la respuesta sea exitosa
      // if (!response.success) {
      //   throw new Error(response.error?.message || 'Error al generar el newsletter');
      // }

      // // Guardar datos generados en sessionStorage para el editor
      // sessionStorage.setItem(
      //   'ai-newsletter-data',
      //   JSON.stringify({
      //     notes: response.data.notes,
      //     metadata: response.data.metadata,
      //     timestamp: new Date().toISOString(),
      //   })
      // );

      // // Redirigir al editor de newsletter
      // router.push('/new/newsletter?aiGenerated=true');
    } catch (error: any) {
      console.error('Error generando newsletter con IA:', error);
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
              Crear Newsletter con IA
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <Icon icon="solar:close-circle-linear" width={24} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
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
          Describe qué contenido quieres generar para cada nota del newsletter
        </Typography>

        <Stack spacing={2}>
          {formState.prompts.map((prompt, index) => (
            <Card key={`prompt-${index}`} sx={{ border: 1, borderColor: 'divider' }}>
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
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ej: Escribe sobre una nueva especie de coral descubierta en la Gran Barrera de Coral, incluyendo sus características únicas y su importancia para el ecosistema marino..."
                  value={prompt}
                  onChange={(e) => handlePromptChange(index, e.target.value)}
                  disabled={formState.status === 'generating'}
                  helperText={`${prompt.length} caracteres`}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Loading state */}
        {formState.status === 'generating' && (
          <Box sx={{ mt: 3 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Generando newsletter... Esto puede tomar algunos minutos
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
          Generar Newsletter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
