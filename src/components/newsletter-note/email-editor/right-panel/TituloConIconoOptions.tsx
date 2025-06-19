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
  TextField,
  Typography,
  FormControl,
} from '@mui/material';

import GeneralColorPicker from 'src/components/newsletter-note/general-color-picker';

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
    description: 'Naranja sutil para finanzas',
  },
  {
    id: 'innovacion',
    name: 'Innovación',
    icon: 'https://img.icons8.com/color/48/light-on.png',
    gradientColor1: 'rgba(82, 196, 26, 0.07)',
    gradientColor2: 'rgba(56, 158, 13, 0.00)',
    textColor: '#27AE60',
    description: 'Verde natural muy sutil',
  },
  {
    id: 'invitacion',
    name: 'Invitación Especial',
    icon: 'https://img.icons8.com/color/48/star.png',
    gradientColor1: 'rgba(156, 136, 255, 0.08)',
    gradientColor2: 'rgba(124, 77, 255, 0.00)',
    textColor: '#6C63FF',
    description: 'Violeta elegante y sutil',
  },
  {
    id: 'nota-dia',
    name: 'Nota del Día',
    icon: 'https://img.icons8.com/color/48/calendar.png',
    gradientColor1: 'rgba(78, 205, 196, 0.06)',
    gradientColor2: 'rgba(38, 166, 154, 0.00)',
    textColor: '#00C3C3',
    description: 'Turquesa muy suave',
  },
  {
    id: 'urgente',
    name: 'Urgente',
    icon: 'https://img.icons8.com/color/48/error.png',
    gradientColor1: 'rgba(255, 107, 107, 0.07)',
    gradientColor2: 'rgba(231, 76, 60, 0.00)',
    textColor: '#E74C3C',
    description: 'Rojo muy sutil para urgencia',
  },
  {
    id: 'recursos',
    name: 'Recursos',
    icon: 'https://img.icons8.com/color/48/folder-tree.png',
    gradientColor1: 'rgba(74, 144, 226, 0.06)',
    gradientColor2: 'rgba(53, 122, 189, 0.00)',
    textColor: '#3498DB',
    description: 'Azul corporativo sutil',
  },
  {
    id: 'tendencias',
    name: 'Tendencias',
    icon: 'https://img.icons8.com/color/48/graph.png',
    gradientColor1: 'rgba(155, 89, 182, 0.07)',
    gradientColor2: 'rgba(142, 68, 173, 0.00)',
    textColor: '#8E44AD',
    description: 'Púrpura moderno muy sutil',
  },
  {
    id: 'comunidad',
    name: 'Comunidad',
    icon: 'https://img.icons8.com/color/48/conference-call.png',
    gradientColor1: 'rgba(255, 159, 67, 0.08)',
    gradientColor2: 'rgba(255, 118, 117, 0.00)',
    textColor: '#FF6B35',
    description: 'Coral cálido y sutil',
  },
];

export default function TituloConIconoOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
  setShowIconPicker,
}: TituloConIconoOptionsProps) {
  if (!selectedComponentId) return null;

  const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
  if (!component || component.type !== 'tituloConIcono') return null;

  // Valores por defecto si no existen
  const gradientType = component.props?.gradientType || 'linear';
  const gradientColor1 = component.props?.gradientColor1 || 'rgba(255, 184, 77, 0.08)';
  const gradientColor2 = component.props?.gradientColor2 || 'rgba(243, 156, 18, 0.00)';
  const gradientAngle = component.props?.gradientAngle || 180;
  const colorDistribution = component.props?.colorDistribution || 0;
  const textColor = component.props?.textColor || '#E67E22';
  const titulo = component.content || 'Título';

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
    <Box sx={{ p: 2 }}>
      {/* Sección de Estilos Preestablecidos */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
        🎨 Estilos Preestablecidos
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Aplica un estilo completo con gradiente, ícono y colores predefinidos
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {PRESET_GRADIENTS.map((preset) => (
            <Paper
              key={preset.id}
              elevation={1}
              sx={{
                p: 1,
                cursor: 'pointer',
                border: '2px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-1px)',
                },
              }}
              onClick={() => handlePresetSelect(preset)}
            >
              {/* Vista previa del gradiente */}
              <Box
                sx={{
                  height: 32,
                  borderRadius: 1,
                  background: `linear-gradient(180deg, ${preset.gradientColor1} 0%, ${preset.gradientColor2} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 0.5,
                  position: 'relative',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: preset.textColor,
                    fontWeight: 'bold',
                    fontSize: '0.65rem',
                  }}
                >
                  {preset.name}
                </Typography>
              </Box>

              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ fontSize: '0.6rem', lineHeight: 1.2 }}
              >
                {preset.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Configuración Manual Profesional */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        ⚙️ Configuración Avanzada
      </Typography>

      {/* Sección: Contenido */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon="mdi:text-box-outline" style={{ marginRight: 8, fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Contenido del Título
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="small"
          value={titulo}
          onChange={(e) => updateComponentProps(selectedComponentId, { content: e.target.value })}
          placeholder="Escriba el título aquí..."
          sx={{
            mb: 1,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Este será el texto principal que aparecerá en la barra
        </Typography>
      </Paper>

      {/* Sección: Apariencia Visual */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon="mdi:palette-outline" style={{ marginRight: 8, fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Apariencia Visual
          </Typography>
        </Box>

        {/* Icono */}
        <Box sx={{ mb: 2 }}>
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
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            El icono aparecerá a la izquierda del título
          </Typography>
        </Box>

        {/* Color del texto */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Color del Texto
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <GeneralColorPicker
              selectedColor={textColor}
              onChange={(newColor) =>
                updateComponentProps(selectedComponentId, { textColor: newColor })
              }
              label="Texto e Icono"
              size="medium"
            />
            <Box sx={{ flex: 1 }}>
              <Chip
                size="small"
                label={textColor.toUpperCase()}
                sx={{
                  backgroundColor: textColor,
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  height: 24,
                  minWidth: 80,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                Color que tendrá el texto y el icono
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Sección: Configuración de Gradiente */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon="mdi:gradient-horizontal" style={{ marginRight: 8, fontSize: 18 }} />
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
              <TextField
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
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              0° = horizontal, 90° = vertical hacia arriba, 180° = vertical hacia abajo
            </Typography>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <TextField
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
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            0% = degradado muy suave, 100% = degradado más intenso
          </Typography>
        </Box>
      </Paper>

      {/* Sección: Vista Previa */}
      <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.100' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon="mdi:eye-outline" style={{ marginRight: 8, fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Vista Previa en Tiempo Real
          </Typography>
        </Box>

        <Box
          sx={{
            height: 56,
            borderRadius: 2,
            background:
              gradientType === 'linear'
                ? `linear-gradient(${gradientAngle}deg, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%)`
                : `radial-gradient(circle, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            px: 3,
            border: '2px solid',
            borderColor: 'grey.300',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Icono */}
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
                marginRight: 12,
                zIndex: 2,
              }}
            />
          ) : (
            <Icon
              icon={component.props?.icon || 'mdi:newspaper-variant-outline'}
              style={{
                fontSize: 24,
                color: textColor,
                marginRight: 12,
                zIndex: 2,
              }}
            />
          )}

          {/* Texto */}
          <Typography
            variant="h6"
            sx={{
              color: textColor,
              fontWeight: 'bold',
              fontSize: '1rem',
              zIndex: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {titulo || 'Vista Previa'}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1, textAlign: 'center' }}
        >
          Así se verá tu título con imagen en el newsletter
        </Typography>
      </Paper>
    </Box>
  );
}
