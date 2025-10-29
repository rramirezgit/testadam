import type { MediaAiResolution } from 'src/types/media-ai';

import { Icon } from '@iconify/react';
import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Stack,
  Alert,
  Button,
  Tooltip,
  TextField,
  Typography,
  IconButton,
  ToggleButton,
  CircularProgress,
  ToggleButtonGroup,
} from '@mui/material';

import useMediaAiStore from 'src/store/MediaAiStore';

interface ImageAiGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
  userId?: string;
}

// Configuración de resoluciones
const RESOLUTIONS = [
  {
    value: 'cuadrado' as MediaAiResolution,
    label: 'Cuadrado',
    icon: 'mdi:square',
    size: '1024x1024',
    ratio: '1:1',
  },
  {
    value: 'retrato' as MediaAiResolution,
    label: 'Retrato',
    icon: 'mdi:rectangle-outline',
    size: '1024x1792',
    ratio: '9:16',
  },
  {
    value: 'paisaje' as MediaAiResolution,
    label: 'Paisaje',
    icon: 'mdi:rectangle',
    size: '1792x1024',
    ratio: '16:9',
  },
];

export default function ImageAiGenerator({ onImageGenerated, userId }: ImageAiGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<MediaAiResolution>('cuadrado');
  const [isPolling, setIsPolling] = useState(false);

  const {
    loading,
    error,
    currentGeneration,
    history,
    generateImage,
    pollStatus,
    fetchHistory,
    deleteGeneration,
    clearCurrentGeneration,
  } = useMediaAiStore();

  // Cargar historial al montar
  useEffect(() => {
    fetchHistory(userId, 10);
  }, [userId, fetchHistory]);

  // Polling progresivo
  const startPolling = useCallback(
    async (generationId: string) => {
      setIsPolling(true);
      let delay = 2000; // Empezar en 2 segundos
      const maxDelay = 10000; // Máximo 10 segundos
      let attempts = 0;
      const maxAttempts = 30;

      const poll = async (): Promise<void> => {
        if (attempts >= maxAttempts) {
          setIsPolling(false);
          return;
        }

        const result = await pollStatus(generationId);

        if (result && (result.status === 'COMPLETED' || result.status === 'FAILED')) {
          setIsPolling(false);
          return;
        }

        attempts += 1;
        delay = Math.min(delay * 1.5, maxDelay);

        setTimeout(poll, delay);
      };

      poll();
    },
    [pollStatus]
  );

  // Manejar generación
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }

    const generationId = await generateImage(prompt, resolution, userId);

    if (generationId) {
      startPolling(generationId);
    }
  };

  // Usar imagen generada
  const handleUseImage = () => {
    if (currentGeneration?.resultUrl) {
      onImageGenerated(currentGeneration.resultUrl);
    }
  };

  // Generar otra imagen
  const handleGenerateAnother = () => {
    clearCurrentGeneration();
    setPrompt('');
  };

  // Usar imagen del historial
  const handleUseHistoryImage = (imageUrl: string) => {
    onImageGenerated(imageUrl);
  };

  // Eliminar del historial
  const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteGeneration(id, userId);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  // Estado de generación
  const isGenerating = loading || isPolling;
  const hasPreview = currentGeneration?.status === 'COMPLETED' && currentGeneration?.resultUrl;
  const hasFailed = currentGeneration?.status === 'FAILED';

  // Mensaje dinámico según estado
  const getStatusMessage = () => {
    if (!currentGeneration) return '';

    switch (currentGeneration.status) {
      case 'PENDING':
        return 'En cola de generación...';
      case 'PROCESSING':
        return 'Generando tu imagen con IA...';
      case 'COMPLETED':
        return '¡Imagen generada exitosamente!';
      case 'FAILED':
        return 'Error al generar la imagen';
      default:
        return '';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Formulario de generación */}
      {!hasPreview && (
        <Card
          elevation={0}
          sx={{
            p: 3,
            color: 'text.primary',
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe la imagen que quieres generar... Ej: Un paisaje futurista con robots y montañas al atardecer"
              disabled={isGenerating}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'divider',
                  },
                },
              }}
            />

            <Box>
              <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                Resolución:
              </Typography>
              <ToggleButtonGroup
                value={resolution}
                exclusive
                onChange={(_, newValue) => newValue && setResolution(newValue)}
                aria-label="resolution"
                fullWidth
                size="small"
                disabled={isGenerating}
                sx={{
                  '& .MuiToggleButton-root': {
                    color: 'text.secondary',
                    borderColor: 'divider',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiTypography-root': {
                        color: 'white',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  },
                }}
              >
                {RESOLUTIONS.map((res) => (
                  <ToggleButton key={res.value} value={res.value}>
                    <Stack direction="column" alignItems="center" spacing={0.5}>
                      <Icon icon={res.icon} width={20} />
                      <Typography variant="caption">{res.label}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.65rem' }}>
                        {res.ratio}
                      </Typography>
                    </Stack>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              startIcon={
                isGenerating ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  <Icon icon="mdi:creation" />
                )
              }
            >
              {isGenerating ? 'Generando...' : 'Generar Imagen'}
            </Button>
          </Stack>
        </Card>
      )}

      {/* Estado de generación */}
      {isGenerating && !hasPreview && (
        <Card elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={50} />
            <Typography variant="h6" color="primary">
              {getStatusMessage()}
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Esto puede tomar entre 10-30 segundos
            </Typography>
          </Stack>
        </Card>
      )}

      {/* Preview de imagen generada */}
      {hasPreview && (
        <Card
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            animation: 'fadeIn 0.5s ease-in',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Icon icon="mdi:check-circle" width={24} height={24} color="#10b981" />
              <Typography variant="h6" fontWeight={600}>
                ¡Imagen Generada!
              </Typography>
            </Box>

            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: 'success.main',
                backgroundColor: 'grey.100',
              }}
            >
              <img
                src={currentGeneration.resultUrl}
                alt="Generated"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  maxHeight: '400px',
                  objectFit: 'contain',
                }}
              />
            </Box>

            {currentGeneration.metadata && (
              <Typography variant="caption" color="text.secondary">
                Dimensiones: {currentGeneration.metadata.size} • Modelo:{' '}
                {currentGeneration.metadata.model}
              </Typography>
            )}

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={handleUseImage}
                startIcon={<Icon icon="mdi:check" />}
              >
                Usar esta Imagen
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleGenerateAnother}
                startIcon={<Icon icon="mdi:refresh" />}
              >
                Generar Otra
              </Button>
            </Stack>
          </Stack>
        </Card>
      )}

      {/* Error */}
      {(error || hasFailed) && (
        <Alert
          severity="error"
          onClose={() => clearCurrentGeneration()}
          action={
            <Button color="inherit" size="small" onClick={() => clearCurrentGeneration()}>
              Reintentar
            </Button>
          }
        >
          {error || currentGeneration?.error || 'Error al generar la imagen'}
        </Alert>
      )}

      {/* Historial */}
      {history.length > 0 && !isGenerating && (
        <Card elevation={1} sx={{ p: 2, borderRadius: 2, flexGrow: 1, overflow: 'auto' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
            Historial de Generaciones
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 1.5,
            }}
          >
            {history
              .filter((item) => item.status === 'COMPLETED' && item.resultUrl)
              .map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '2px solid transparent',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                      '& .delete-btn': {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => handleUseHistoryImage(item.resultUrl!)}
                >
                  <img
                    src={item.resultUrl}
                    alt={item.prompt}
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <Tooltip title={item.prompt}>
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 0.5,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        fontSize: '0.65rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.prompt}
                    </Typography>
                  </Tooltip>
                  <IconButton
                    className="delete-btn"
                    size="small"
                    onClick={(e) => handleDeleteHistory(item.id, e)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(220, 38, 38, 0.95)',
                      },
                    }}
                  >
                    <Icon icon="mdi:delete" width={16} />
                  </IconButton>
                </Box>
              ))}
          </Box>
        </Card>
      )}
    </Box>
  );
}
