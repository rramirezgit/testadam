import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Chip, Tooltip, Typography, IconButton } from '@mui/material';

import type { AutoSaveState } from '../hooks/useAutoSave';

interface AutoSaveIndicatorProps {
  autoSaveState: AutoSaveState;
  onToggleAutoSave?: () => void;
  onForceSave?: () => void;
  isEnabled?: boolean;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
  autoSaveState,
  onToggleAutoSave,
  onForceSave,
  isEnabled = true,
}) => {
  console.log('🔍 AutoSaveIndicator rendering with state:', autoSaveState);

  const { isAutoSaving, lastSaved, hasUnsavedChanges, changeCount, lastError } = autoSaveState;

  // Determinar el estado visual
  const getStatusConfig = () => {
    if (lastError) {
      return {
        color: 'error' as const,
        icon: 'mdi:alert-circle',
        label: 'Error al guardar',
        description: lastError.message,
      };
    }

    if (isAutoSaving) {
      return {
        color: 'info' as const,
        icon: 'mdi:loading',
        label: 'Guardando...',
        description: 'Guardando cambios automáticamente',
      };
    }

    if (hasUnsavedChanges) {
      return {
        color: 'warning' as const,
        icon: 'mdi:clock-outline',
        label: `${changeCount} cambios`,
        description: 'Hay cambios sin guardar',
      };
    }

    if (lastSaved) {
      return {
        color: 'success' as const,
        icon: 'mdi:check-circle',
        label: 'Guardado',
        description: `Último guardado: ${lastSaved.toLocaleTimeString()}`,
      };
    }

    return {
      color: 'default' as const,
      icon: 'mdi:content-save',
      label: 'Listo',
      description: 'Listo para guardar',
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1,
        borderRadius: 1,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 1,
        '@keyframes spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      }}
    >
      {/* Indicador principal */}
      <Tooltip title={statusConfig.description} arrow>
        <Chip
          size="small"
          icon={
            <Icon
              icon={statusConfig.icon}
              style={{
                fontSize: '16px',
                animation: isAutoSaving ? 'spin 1s linear infinite' : undefined,
              }}
            />
          }
          label={statusConfig.label}
          color={statusConfig.color}
          variant={hasUnsavedChanges || isAutoSaving ? 'filled' : 'outlined'}
        />
      </Tooltip>

      {/* Información adicional */}
      {lastSaved && !hasUnsavedChanges && !isAutoSaving && (
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {lastSaved.toLocaleTimeString()}
        </Typography>
      )}

      {/* Botones de control */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {/* Botón para toggle auto-guardado */}
        {onToggleAutoSave && (
          <Tooltip title={isEnabled ? 'Desactivar auto-guardado' : 'Activar auto-guardado'} arrow>
            <IconButton
              size="small"
              onClick={onToggleAutoSave}
              color={isEnabled ? 'primary' : 'default'}
              sx={{ p: 0.5 }}
            >
              <Icon
                icon={isEnabled ? 'mdi:auto-fix' : 'mdi:auto-fix-off'}
                style={{ fontSize: '16px' }}
              />
            </IconButton>
          </Tooltip>
        )}

        {/* Botón para forzar guardado */}
        {onForceSave && hasUnsavedChanges && !isAutoSaving && (
          <Tooltip title="Guardar ahora" arrow>
            <IconButton size="small" onClick={onForceSave} color="primary" sx={{ p: 0.5 }}>
              <Icon icon="mdi:content-save" style={{ fontSize: '16px' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* CSS personalizado agregado al sx del Box principal */}
    </Box>
  );
};
