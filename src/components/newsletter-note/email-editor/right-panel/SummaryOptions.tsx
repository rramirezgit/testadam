import { Icon } from '@iconify/react';

import { Box, Chip, Paper, Stack, Button, Divider, Typography } from '@mui/material';

import GeneralColorPicker from 'src/components/newsletter-note/general-color-picker';

import { findComponentById } from '../utils/componentHelpers';

import type { SummaryOptionsProps } from './types';

// Tipos de summary disponibles (igual que en SummaryComponent)
const SUMMARY_TYPES = {
  resumen: {
    label: 'Resumen',
    icon: 'https://img.icons8.com/color/48/note.png',
    backgroundColor: '#f8f9fa',
    textColor: '#495057',
    description: 'Para resúmenes generales',
  },
  concepto: {
    label: 'Concepto',
    icon: 'https://img.icons8.com/color/48/light-on.png',
    backgroundColor: '#e7f3ff',
    textColor: '#003d7a',
    description: 'Para explicar conceptos',
  },
  dato: {
    label: 'Dato',
    icon: 'https://img.icons8.com/color/48/info.png',
    backgroundColor: '#fff8e1',
    textColor: '#e65100',
    description: 'Para datos importantes',
  },
  tip: {
    label: 'TIP',
    icon: 'https://img.icons8.com/color/48/rocket.png',
    backgroundColor: '#f3e5f5',
    textColor: '#4a148c',
    description: 'Para consejos útiles',
  },
  analogia: {
    label: 'Analogía',
    icon: 'https://img.icons8.com/color/48/brain.png',
    backgroundColor: '#e8f5e8',
    textColor: '#1b5e20',
    description: 'Para comparaciones',
  },
} as const;

type SummaryType = keyof typeof SUMMARY_TYPES;

export default function SummaryOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
  setShowIconPicker,
}: SummaryOptionsProps) {
  if (!selectedComponentId) return null;

  const component = findComponentById(getActiveComponents(), selectedComponentId);
  if (!component || component.type !== 'summary') return null;

  // Opciones con valores por defecto
  const summaryType: SummaryType = (component.props?.summaryType as SummaryType) || 'resumen';
  const typeConfig = SUMMARY_TYPES[summaryType];

  // const label = component.props?.label || typeConfig.label; // No usado actualmente
  const icon = component.props?.icon || typeConfig.icon;
  const textColor = component.props?.textColor || typeConfig.textColor;
  const backgroundColor = component.props?.backgroundColor || typeConfig.backgroundColor;

  // Función para cambiar el tipo completo
  const handleTypeChange = (newType: SummaryType) => {
    const newTypeConfig = SUMMARY_TYPES[newType];
    updateComponentProps(selectedComponentId, {
      summaryType: newType,
      label: newTypeConfig.label,
      icon: newTypeConfig.icon,
      textColor: newTypeConfig.textColor,
      backgroundColor: newTypeConfig.backgroundColor,
    });
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {/* Header mejorado */}

      {/* Selector de tipo mejorado */}
      <Paper
        elevation={2}
        sx={{
          mb: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            {(Object.keys(SUMMARY_TYPES) as SummaryType[]).map((type) => {
              const config = SUMMARY_TYPES[type];
              const isSelected = summaryType === type;

              return (
                <Chip
                  key={type}
                  label={config.label}
                  variant={isSelected ? 'filled' : 'outlined'}
                  color={isSelected ? 'primary' : 'default'}
                  onClick={() => handleTypeChange(type)}
                  icon={
                    <img
                      src={config.icon}
                      alt={config.label}
                      style={{
                        width: 16,
                        height: 16,
                        objectFit: 'contain',
                      }}
                    />
                  }
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                  }}
                />
              );
            })}
          </Stack>
        </Box>
      </Paper>

      {/* Personalización mejorada */}
      <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2 }}>
          {/* Colores en una disposición más elegante */}
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Colores del bloque
          </Typography>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ minWidth: 60 }}>
                <Typography variant="caption" color="text.secondary">
                  Fondo
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <GeneralColorPicker
                  selectedColor={backgroundColor}
                  onChange={(color) =>
                    updateComponentProps(selectedComponentId, { backgroundColor: color })
                  }
                  label=""
                  size="small"
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ minWidth: 60 }}>
                <Typography variant="caption" color="text.secondary">
                  Texto
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <GeneralColorPicker
                  selectedColor={textColor}
                  onChange={(color) =>
                    updateComponentProps(selectedComponentId, { textColor: color })
                  }
                  label=""
                  size="small"
                />
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Icono personalizado mejorado */}
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Icono personalizado
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowIconPicker(true);
              }}
              sx={{
                p: 2,
                border: '2px dashed #ddd',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                bgcolor: 'grey.50',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {/* Renderizar PNG (solo URLs) */}
              <img
                src={icon}
                alt="Icon"
                style={{
                  width: 24,
                  height: 24,
                  objectFit: 'contain',
                  display: 'block',
                  pointerEvents: 'none',
                }}
                // onError={(e) => {
                //   // Fallback si la imagen no carga
                //   e.currentTarget.style.display = 'none';
                // }}
              />
            </Box>
            <Button
              variant="outlined"
              size="medium"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Abriendo IconPicker...'); // Debug
                setShowIconPicker(true);
              }}
              startIcon={<Icon icon="mdi:swap-horizontal" />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                flex: 1,
              }}
            >
              Cambiar Icono
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
