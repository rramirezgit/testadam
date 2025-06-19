import { Icon } from '@iconify/react';

import { Box, Chip, Paper, Stack, Button, Divider, TextField, Typography } from '@mui/material';

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
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {/* Header mejorado */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          📝 Configurar Bloque Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Personaliza el estilo y contenido de tu bloque informativo
        </Typography>
      </Box>

      {/* Selector de tipo mejorado */}
      <Paper
        elevation={2}
        sx={{
          mb: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >
        <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Icon icon="mdi:format-list-bulleted-type" />
            Tipo de Bloque
          </Typography>
        </Box>

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
                  icon={<Icon icon={config.icon} />}
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

          {/* Descripción del tipo seleccionado */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor,
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon icon={icon} style={{ fontSize: 14, color: iconColor }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: textColor }}>
                {label}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {typeConfig.description}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Personalización mejorada */}
      <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2, backgroundColor: 'secondary.main', color: 'white' }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Icon icon="mdi:palette" />
            Personalización
          </Typography>
        </Box>

        <Box sx={{ p: 2 }}>
          {/* Texto personalizado */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
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
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

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
                  Icono
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <GeneralColorPicker
                  selectedColor={iconColor}
                  onChange={(color) =>
                    updateComponentProps(selectedComponentId, { iconColor: color })
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
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {/* Renderizar PNG o icono legacy */}
              {icon.startsWith('http') ? (
                <img
                  src={icon}
                  alt="Icon"
                  style={{
                    width: 24,
                    height: 24,
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Icon icon={icon} style={{ fontSize: 24, color: iconColor }} />
              )}
            </Box>
            <Button
              variant="outlined"
              size="medium"
              onClick={() => setShowIconPicker(true)}
              startIcon={<Icon icon="mdi:swap-horizontal" />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Cambiar Icono
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Vista previa mejorada */}
      <Paper elevation={3} sx={{ overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: 2, backgroundColor: 'success.main', color: 'white' }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Icon icon="mdi:eye" />
            Vista Previa
          </Typography>
        </Box>

        <Box sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Box
            sx={{
              backgroundColor,
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.08)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {/* Header preview mejorada */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                padding: '16px 20px 12px 20px',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                {/* Renderizar PNG o icono legacy en preview */}
                {icon.startsWith('http') ? (
                  <img
                    src={icon}
                    alt="Icon"
                    style={{
                      width: 18,
                      height: 18,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <Icon icon={icon} style={{ fontSize: 18, color: iconColor }} />
                )}
              </Box>

              <Typography
                variant="subtitle1"
                sx={{
                  color: textColor,
                  fontWeight: 600,
                  fontSize: '16px',
                  letterSpacing: '-0.01em',
                }}
              >
                {label}
              </Typography>
            </Box>

            {/* Content preview mejorada */}
            <Box sx={{ padding: '16px 20px 20px 20px' }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#6c757d',
                  fontSize: '15px',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                }}
              >
                Escribe el contenido aquí...
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
