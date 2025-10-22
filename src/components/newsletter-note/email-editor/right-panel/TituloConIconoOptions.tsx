import { Icon } from '@iconify/react';

import {
  Box,
  Chip,
  Paper,
  Button,
  Select,
  Slider,
  Divider,
  MenuItem,
  Accordion,
  Typography,
  FormControl,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';

import GeneralColorPicker from 'src/components/newsletter-note/general-color-picker';

import { findComponentById } from '../utils/componentHelpers';

import type { TituloConIconoOptionsProps } from './types';

// Gradientes preestablecidos sutiles con iconos PNG
const PRESET_GRADIENTS = [
  {
    id: 'mercado',
    name: 'Mercado',
    icon: 'https://img.icons8.com/color/48/line-chart.png',
    gradientColor1: 'rgba(255, 184, 77, 0.08)',
    gradientColor2: 'rgba(243, 156, 18, 0.00)',
    textColor: '#E67E22',
  },
  {
    id: 'innovacion',
    name: 'Innovación',
    icon: 'https://img.icons8.com/color/48/light-on.png',
    gradientColor1: 'rgba(82, 196, 26, 0.07)',
    gradientColor2: 'rgba(56, 158, 13, 0.00)',
    textColor: '#27AE60',
  },
  {
    id: 'invitacion',
    name: 'Invitación Especial',
    icon: 'https://img.icons8.com/color/48/star.png',
    gradientColor1: 'rgba(156, 136, 255, 0.08)',
    gradientColor2: 'rgba(124, 77, 255, 0.00)',
    textColor: '#6C63FF',
  },
  {
    id: 'nota-dia',
    name: 'Nota del Día',
    icon: 'https://img.icons8.com/color/48/calendar.png',
    gradientColor1: 'rgba(78, 205, 196, 0.06)',
    gradientColor2: 'rgba(38, 166, 154, 0.00)',
    textColor: '#00C3C3',
  },
  {
    id: 'urgente',
    name: 'Urgente',
    icon: 'https://img.icons8.com/color/48/error.png',
    gradientColor1: 'rgba(255, 107, 107, 0.07)',
    gradientColor2: 'rgba(231, 76, 60, 0.00)',
    textColor: '#E74C3C',
  },
  {
    id: 'recursos',
    name: 'Recursos',
    icon: 'https://img.icons8.com/color/48/folder-tree.png',
    gradientColor1: 'rgba(74, 144, 226, 0.06)',
    gradientColor2: 'rgba(53, 122, 189, 0.00)',
    textColor: '#3498DB',
  },
  {
    id: 'tendencias',
    name: 'Tendencias',
    icon: 'https://img.icons8.com/color/48/graph.png',
    gradientColor1: 'rgba(155, 89, 182, 0.07)',
    gradientColor2: 'rgba(142, 68, 173, 0.00)',
    textColor: '#8E44AD',
  },
  {
    id: 'comunidad',
    name: 'Comunidad',
    icon: 'https://img.icons8.com/color/48/conference-call.png',
    gradientColor1: 'rgba(255, 159, 67, 0.08)',
    gradientColor2: 'rgba(255, 118, 117, 0.00)',
    textColor: '#FF6B35',
  },
];

export default function TituloConIconoOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
  setShowIconPicker,
}: TituloConIconoOptionsProps) {
  if (!selectedComponentId) return null;

  const component = findComponentById(getActiveComponents(), selectedComponentId);
  if (!component || component.type !== 'tituloConIcono') return null;

  // Valores por defecto si no existen
  const gradientType = component.props?.gradientType || 'linear';
  const gradientColor1 = component.props?.gradientColor1 || 'rgba(255, 184, 77, 0.08)';
  const gradientColor2 = component.props?.gradientColor2 || 'rgba(243, 156, 18, 0.00)';
  const gradientAngle = component.props?.gradientAngle || 180;
  const colorDistribution = component.props?.colorDistribution || 0;
  const textColor = component.props?.textColor || '#E67E22';

  // Función para aplicar un gradiente preestablecido
  const handlePresetSelect = (preset: (typeof PRESET_GRADIENTS)[0]) => {
    updateComponentProps(selectedComponentId, {
      gradientColor1: preset.gradientColor1,
      gradientColor2: preset.gradientColor2,
      textColor: preset.textColor,
      icon: preset.icon,
      gradientType: 'linear',
      gradientAngle: 180,
      colorDistribution: 0,
    });
  };

  // Función para manejar el cambio de ángulo
  const handleAngleChange = (event: Event, newValue: number | number[]) => {
    updateComponentProps(selectedComponentId, { gradientAngle: newValue as number });
  };

  // Función para manejar el cambio de ángulo a través del input
  const handleAngleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 360) {
      updateComponentProps(selectedComponentId, { gradientAngle: value });
    }
  };

  // Función para manejar el cambio en la distribución de colores
  const handleColorDistributionChange = (event: Event, newValue: number | number[]) => {
    updateComponentProps(selectedComponentId, { colorDistribution: newValue as number });
  };

  // Función para manejar el cambio en la distribución de colores a través del input
  const handleColorDistributionInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      updateComponentProps(selectedComponentId, { colorDistribution: value });
    }
  };

  return (
    <Box>
      {/* Sección de Estilos Preestablecidos */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Estilos Preestablecidos
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
          }}
        >
          {PRESET_GRADIENTS.map((preset) => (
            <Box
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              sx={{
                height: 40,
                borderRadius: 1,
                background: `linear-gradient(180deg, ${preset.gradientColor1} 0%, ${preset.gradientColor2} 100%)`,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'grey.200',
                transition: 'all 0.15s',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateX(2px)',
                },
              }}
            >
              <img
                src={preset.icon}
                alt={preset.name}
                style={{
                  width: 18,
                  height: 18,
                  objectFit: 'contain',
                  display: 'block',
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: preset.textColor,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {preset.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Configuración Avanzada en Acordeón */}
      <Accordion defaultExpanded={false} elevation={0} sx={{ '&:before': { display: 'none' } }}>
        <AccordionSummary
          expandIcon={<Icon icon="mdi:chevron-down" />}
          sx={{
            px: 0,
            minHeight: 'auto',
            '&.Mui-expanded': { minHeight: 'auto' },
            '& .MuiAccordionSummary-content': { my: 1 },
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Configuración Avanzada
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 1 }}>
          {/* Sección: Apariencia Visual */}
          <Paper elevation={0} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Apariencia Visual
              </Typography>
            </Box>

            {/* Icono */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Icono
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    bgcolor: 'white',
                    border: '2px solid',
                    borderColor: 'grey.200',
                  }}
                >
                  {/* Renderizado condicional para PNG URLs vs iconos legacy */}
                  {component.props?.icon && component.props.icon.startsWith('http') ? (
                    <img
                      src={component.props.icon}
                      alt="Icono seleccionado"
                      style={{
                        width: 24,
                        height: 24,
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <Icon
                      icon={component.props?.icon || 'mdi:chart-line'}
                      style={{ fontSize: 24, color: textColor }}
                    />
                  )}
                </Paper>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowIconPicker(true)}
                  startIcon={<Icon icon="mdi:swap-horizontal" />}
                  sx={{ height: 'fit-content' }}
                >
                  Cambiar
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Sección: Configuración de Gradiente */}
          <Paper elevation={0} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Configuración de Gradiente
              </Typography>
            </Box>

            {/* Tipo de gradiente */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Tipo de Degradado
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={gradientType}
                  onChange={(e) =>
                    updateComponentProps(selectedComponentId, { gradientType: e.target.value })
                  }
                  sx={{ bgcolor: 'white' }}
                >
                  <MenuItem value="linear">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon icon="mdi:vector-line" />
                      Lineal
                    </Box>
                  </MenuItem>
                  <MenuItem value="radial">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon icon="mdi:circle-outline" />
                      Radial
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Ángulo del gradiente (solo para linear) */}
            {gradientType === 'linear' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                  Dirección del Degradado
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3 }}>
                  <Slider
                    value={gradientAngle}
                    onChange={handleAngleChange}
                    min={0}
                    max={360}
                    step={15}
                    marks={[
                      { value: 0, label: '0°' },
                      { value: 90, label: '90°' },
                      { value: 180, label: '180°' },
                      { value: 270, label: '270°' },
                    ]}
                    sx={{ flexGrow: 1 }}
                  />
                  {/* <TextField
                    type="number"
                    size="small"
                    value={gradientAngle}
                    onChange={handleAngleInputChange}
                    inputProps={{ min: 0, max: 360, step: 15 }}
                    sx={{
                      width: 80,
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'white',
                      },
                    }}
                  /> */}
                </Box>
              </Box>
            )}

            {/* Colores del gradiente */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
                Colores del Degradado
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                {/* Color inicial */}
                <Box sx={{ flex: 1 }}>
                  <GeneralColorPicker
                    selectedColor={gradientColor1}
                    onChange={(newColor) =>
                      updateComponentProps(selectedComponentId, { gradientColor1: newColor })
                    }
                    label="Color Inicial"
                    size="medium"
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1, textAlign: 'center' }}
                  >
                    Opacidad baja
                  </Typography>
                </Box>

                {/* Color final */}
                <Box sx={{ flex: 1 }}>
                  <GeneralColorPicker
                    selectedColor={gradientColor2}
                    onChange={(newColor) =>
                      updateComponentProps(selectedComponentId, { gradientColor2: newColor })
                    }
                    label="Color Final"
                    size="medium"
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1, textAlign: 'center' }}
                  >
                    Transparente
                  </Typography>
                </Box>
              </Box>

              {/* Chips de colores para referencia */}
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Chip
                  size="small"
                  label={gradientColor1}
                  sx={{
                    backgroundColor: gradientColor1,
                    color: '#fff',
                    fontSize: '0.6rem',
                    height: 20,
                    minWidth: 90,
                  }}
                />
                <Chip
                  size="small"
                  label={gradientColor2}
                  sx={{
                    backgroundColor: gradientColor2,
                    color: '#fff',
                    fontSize: '0.6rem',
                    height: 20,
                    minWidth: 90,
                  }}
                />
              </Box>
            </Box>

            {/* Distribución de colores */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Intensidad del Degradado
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 4 }}>
                <Slider
                  value={colorDistribution}
                  onChange={handleColorDistributionChange}
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: 'Suave' },
                    { value: 50, label: 'Medio' },
                    { value: 100, label: 'Intenso' },
                  ]}
                  sx={{ flexGrow: 1 }}
                />
                {/* <TextField
                  type="number"
                  size="small"
                  value={colorDistribution}
                  onChange={handleColorDistributionInputChange}
                  inputProps={{ min: 0, max: 100, step: 5 }}
                  sx={{
                    width: 80,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                    },
                  }}
                /> */}
              </Box>
            </Box>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
