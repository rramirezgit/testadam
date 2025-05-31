import { Icon } from '@iconify/react';

import {
  Box,
  Button,
  Select,
  Slider,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import type { TituloConIconoOptionsProps } from './types';

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
  const gradientColor1 = component.props?.gradientColor1 || '#4facfe';
  const gradientColor2 = component.props?.gradientColor2 || '#00f2fe';
  const gradientAngle = component.props?.gradientAngle || 90;
  const colorDistribution = component.props?.colorDistribution || 50;
  const textColor = component.props?.textColor || '#ffffff';
  const titulo = component.content || 'Título';

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
      <Typography variant="subtitle2" gutterBottom>
        Contenido del título
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={titulo}
        onChange={(e) => updateComponentProps(selectedComponentId, { content: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Color del texto
      </Typography>
      <TextField
        type="color"
        fullWidth
        size="small"
        value={textColor}
        onChange={(e) => updateComponentProps(selectedComponentId, { textColor: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Icono
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box
          sx={{
            mr: 2,
            p: 1,
            border: '1px solid #ddd',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
          }}
        >
          <Icon icon={component.props?.icon || 'mdi:newspaper-variant-outline'} />
        </Box>
        <Button variant="outlined" size="small" onClick={() => setShowIconPicker(true)}>
          Cambiar icono
        </Button>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Tipo de degradado
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="gradient-type-label">Tipo de degradado</InputLabel>
        <Select
          labelId="gradient-type-label"
          size="small"
          value={gradientType}
          label="Tipo de degradado"
          onChange={(e) =>
            updateComponentProps(selectedComponentId, { gradientType: e.target.value })
          }
        >
          <MenuItem value="linear">Lineal</MenuItem>
          <MenuItem value="radial">Radial</MenuItem>
        </Select>
      </FormControl>

      {gradientType === 'linear' && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Ángulo del degradado
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Slider
              value={gradientAngle}
              onChange={handleAngleChange}
              min={0}
              max={360}
              step={1}
              aria-labelledby="angle-slider"
              sx={{ flexGrow: 1, mr: 2 }}
            />
            <TextField
              type="number"
              size="small"
              value={gradientAngle}
              onChange={handleAngleInputChange}
              inputProps={{
                min: 0,
                max: 360,
                step: 1,
              }}
              sx={{ width: '80px' }}
            />
          </Box>
        </>
      )}

      <Typography variant="subtitle2" gutterBottom>
        Color inicial
      </Typography>
      <TextField
        type="color"
        fullWidth
        size="small"
        value={gradientColor1}
        onChange={(e) =>
          updateComponentProps(selectedComponentId, { gradientColor1: e.target.value })
        }
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Color final
      </Typography>
      <TextField
        type="color"
        fullWidth
        size="small"
        value={gradientColor2}
        onChange={(e) =>
          updateComponentProps(selectedComponentId, { gradientColor2: e.target.value })
        }
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Distribución de colores
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Slider
          value={colorDistribution}
          onChange={handleColorDistributionChange}
          min={0}
          max={100}
          step={1}
          aria-labelledby="color-distribution-slider"
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <TextField
          type="number"
          size="small"
          value={colorDistribution}
          onChange={handleColorDistributionInputChange}
          inputProps={{
            min: 0,
            max: 100,
            step: 1,
          }}
          sx={{ width: '80px' }}
        />
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Vista previa del degradado
      </Typography>
      <Box
        sx={{
          height: 24,
          width: '100%',
          borderRadius: 1,
          background:
            gradientType === 'linear'
              ? `linear-gradient(${gradientAngle}deg, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%)`
              : `radial-gradient(circle, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%)`,
          mb: 2,
        }}
      />
    </Box>
  );
}
