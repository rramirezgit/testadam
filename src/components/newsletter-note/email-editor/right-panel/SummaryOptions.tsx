import { Icon } from '@iconify/react';

import { Box, Paper, Button, TextField, Typography } from '@mui/material';

import GeneralColorPicker from 'src/components/newsletter-note/general-color-picker';

import type { SummaryOptionsProps } from './types';

// Tipos de summary disponibles (igual que en SummaryComponent)
const SUMMARY_TYPES = {
  resumen: {
    label: 'Resumen',
    icon: 'mdi:note-text-outline',
    backgroundColor: '#f8f9fa',
    iconColor: '#6c757d',
    textColor: '#495057',
    description: 'Para resúmenes generales',
  },
  concepto: {
    label: 'Concepto',
    icon: 'mdi:lightbulb-outline',
    backgroundColor: '#e7f3ff',
    iconColor: '#0066cc',
    textColor: '#003d7a',
    description: 'Para explicar conceptos',
  },
  dato: {
    label: 'Dato',
    icon: 'mdi:lightbulb-on',
    backgroundColor: '#fff8e1',
    iconColor: '#f57c00',
    textColor: '#e65100',
    description: 'Para datos importantes',
  },
  tip: {
    label: 'TIP',
    icon: 'mdi:rocket-launch',
    backgroundColor: '#f3e5f5',
    iconColor: '#8e24aa',
    textColor: '#4a148c',
    description: 'Para consejos útiles',
  },
  analogia: {
    label: 'Analogía',
    icon: 'mdi:brain',
    backgroundColor: '#e8f5e8',
    iconColor: '#388e3c',
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

  const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
  if (!component || component.type !== 'summary') return null;

  // Opciones con valores por defecto
  const summaryType: SummaryType = (component.props?.summaryType as SummaryType) || 'resumen';
  const typeConfig = SUMMARY_TYPES[summaryType];

  const label = component.props?.label || typeConfig.label;
  const icon = component.props?.icon || typeConfig.icon;
  const iconColor = component.props?.iconColor || typeConfig.iconColor;
  const textColor = component.props?.textColor || typeConfig.textColor;
  const backgroundColor = component.props?.backgroundColor || typeConfig.backgroundColor;

  // Función para cambiar el tipo completo
  const handleTypeChange = (newType: SummaryType) => {
    const newTypeConfig = SUMMARY_TYPES[newType];
    updateComponentProps(selectedComponentId, {
      summaryType: newType,
      label: newTypeConfig.label,
      icon: newTypeConfig.icon,
      iconColor: newTypeConfig.iconColor,
      textColor: newTypeConfig.textColor,
      backgroundColor: newTypeConfig.backgroundColor,
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
        📝 Configuración del Bloque
      </Typography>

      {/* Selector de tipo */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          Tipo de Bloque
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
          {(Object.keys(SUMMARY_TYPES) as SummaryType[]).map((type) => {
            const config = SUMMARY_TYPES[type];
            const isSelected = summaryType === type;

            return (
              <Paper
                key={type}
                elevation={isSelected ? 3 : 1}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #1976d2' : '1px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#1976d2',
                    transform: 'translateY(-1px)',
                  },
                }}
                onClick={() => handleTypeChange(type)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '6px',
                      backgroundColor: config.backgroundColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon icon={config.icon} style={{ fontSize: 14, color: config.iconColor }} />
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                    {config.label}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: '0.65rem', lineHeight: 1.2 }}
                >
                  {config.description}
                </Typography>
              </Paper>
            );
          })}
        </Box>
      </Paper>

      {/* Personalización */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          🎨 Personalización
        </Typography>

        {/* Texto personalizado */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Texto del encabezado
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={label}
            onChange={(e) => updateComponentProps(selectedComponentId, { label: e.target.value })}
            placeholder="Ej: Resumen, Concepto, etc."
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
              },
            }}
          />
        </Box>

        {/* Colores */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <GeneralColorPicker
              selectedColor={backgroundColor}
              onChange={(color) =>
                updateComponentProps(selectedComponentId, { backgroundColor: color })
              }
              label="Fondo"
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <GeneralColorPicker
              selectedColor={iconColor}
              onChange={(color) => updateComponentProps(selectedComponentId, { iconColor: color })}
              label="Icono"
              size="small"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <GeneralColorPicker
              selectedColor={textColor}
              onChange={(color) => updateComponentProps(selectedComponentId, { textColor: color })}
              label="Texto"
              size="small"
            />
          </Box>
        </Box>

        {/* Icono personalizado */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              border: '1px solid #ddd',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              bgcolor: 'white',
            }}
          >
            <Icon icon={icon} style={{ fontSize: 20, color: iconColor }} />
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowIconPicker(true)}
            startIcon={<Icon icon="mdi:swap-horizontal" />}
          >
            Cambiar Icono
          </Button>
        </Box>
      </Paper>

      {/* Vista previa */}
      <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.100' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
          👁️ Vista Previa
        </Typography>

        <Box
          sx={{
            backgroundColor,
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Header preview */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              padding: '12px 16px 8px 16px',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <Icon icon={icon} style={{ fontSize: 14, color: iconColor }} />
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: textColor,
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {label}
            </Typography>
          </Box>

          {/* Content preview */}
          <Box sx={{ padding: '12px 16px 16px 16px' }}>
            <Typography
              variant="caption"
              sx={{
                color: '#6c757d',
                fontSize: '13px',
                fontStyle: 'italic',
              }}
            >
              Escribe el contenido aquí...
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
