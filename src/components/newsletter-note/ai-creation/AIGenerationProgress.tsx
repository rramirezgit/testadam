/**
 * Componente para mostrar el progreso de generación con IA
 * Muestra barra de progreso y mensajes según el estado
 */

'use client';

import type { TaskStatus } from 'src/types/ai-generation';

import { Icon } from '@iconify/react';

import { Box, Card, Stack, Button, Typography, CardContent } from '@mui/material';

import { TASK_STATUS_MESSAGES } from 'src/types/ai-generation';

// ============================================================================
// TIPOS
// ============================================================================

interface AIGenerationProgressProps {
  status: TaskStatus;
  progress: number;
  message?: string;
  onCancel?: () => void;
  showCancel?: boolean;
}

// ============================================================================
// CONFIGURACIÓN DE ICONOS Y COLORES
// ============================================================================

const STATUS_CONFIG: Record<
  TaskStatus,
  {
    icon: string;
    color: string;
    bgColor: string;
  }
> = {
  PENDING: {
    icon: 'solar:hourglass-line-bold',
    color: '#9e9e9e',
    bgColor: '#f5f5f5',
  },
  GENERATING_IMAGE: {
    icon: 'solar:gallery-add-bold',
    color: '#2196f3',
    bgColor: '#e3f2fd',
  },
  GENERATING_WEB_CONTENT: {
    icon: 'solar:document-add-bold',
    color: '#ff9800',
    bgColor: '#fff3e0',
  },
  GENERATING_NEWSLETTER_CONTENT: {
    icon: 'solar:letter-bold',
    color: '#9c27b0',
    bgColor: '#f3e5f5',
  },
  COMPLETED: {
    icon: 'solar:check-circle-bold',
    color: '#4caf50',
    bgColor: '#e8f5e9',
  },
  ERROR: {
    icon: 'solar:close-circle-bold',
    color: '#f44336',
    bgColor: '#ffebee',
  },
};

// ============================================================================
// COMPONENTE
// ============================================================================

export default function AIGenerationProgress({
  status,
  progress,
  message,
  onCancel,
  showCancel = true,
}: AIGenerationProgressProps) {
  const config = STATUS_CONFIG[status];
  const displayMessage = message || TASK_STATUS_MESSAGES[status];

  return (
    <Card
      sx={{
        border: 2,
        borderColor: config.color,
        bgcolor: config.bgColor,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ py: 3 }}>
        <Stack spacing={3}>
          {/* Icono y título */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 2,
              }}
            >
              <Icon icon={config.icon} width={28} style={{ color: config.color }} />
            </Box>

            <Box flex={1}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Generando contenido con IA
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {displayMessage}
              </Typography>
            </Box>

            {/* Progreso numérico */}
            <Box textAlign="right">
              <Typography variant="h4" fontWeight={700} sx={{ color: config.color }}>
                {progress}%
              </Typography>
            </Box>
          </Box>

          {/* Barra de progreso con animación - Custom */}
          <Box
            sx={{
              width: '100%',
              height: 10,
              bgcolor: 'rgba(0,0,0,0.12)',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {/* Barra de progreso rellena */}
            <Box
              sx={{
                width: `${progress}%`,
                height: '100%',
                bgcolor: config.color,
                borderRadius: 3,
                position: 'relative',
                transition: 'width 0.5s ease-out',
                boxShadow: `0 0 15px ${config.color}60`,
                // Animación shimmer
                ...(status !== 'COMPLETED' &&
                  status !== 'ERROR' && {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`,
                      animation: 'shimmer 2s infinite',
                    },
                  }),
                '@keyframes shimmer': {
                  '0%': {
                    transform: 'translateX(-100%)',
                  },
                  '100%': {
                    transform: 'translateX(200%)',
                  },
                },
              }}
            />
          </Box>

          {/* Detalles por estado */}
          {status === 'GENERATING_IMAGE' && (
            <Card variant="outlined" sx={{ bgcolor: 'white' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Icon icon="solar:lightbulb-bolt-linear" width={20} color={config.color} />
                  <Typography variant="body2" color="text.secondary">
                    Generando imagen optimizada para tu contenido...
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}

          {status === 'GENERATING_WEB_CONTENT' && (
            <Card variant="outlined" sx={{ bgcolor: 'white' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Icon icon="solar:document-text-linear" width={20} color={config.color} />
                  <Typography variant="body2" color="text.secondary">
                    Creando versión extendida para la web con más detalles...
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}

          {status === 'GENERATING_NEWSLETTER_CONTENT' && (
            <Card variant="outlined" sx={{ bgcolor: 'white' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Icon icon="solar:letter-linear" width={20} color={config.color} />
                  <Typography variant="body2" color="text.secondary">
                    Optimizando contenido para newsletter (versión resumida)...
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Botón cancelar */}
          {showCancel && onCancel && status !== 'COMPLETED' && status !== 'ERROR' && (
            <Box display="flex" justifyContent="flex-end">
              <Button
                size="small"
                color="inherit"
                onClick={onCancel}
                startIcon={<Icon icon="solar:close-circle-linear" />}
              >
                Cancelar
              </Button>
            </Box>
          )}

          {/* Información de tiempo estimado */}
          {status !== 'COMPLETED' && status !== 'ERROR' && (
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Tiempo estimado: 2-3 minutos
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
