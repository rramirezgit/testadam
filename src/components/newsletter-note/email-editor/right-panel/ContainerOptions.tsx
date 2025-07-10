'use client';

import { Box, Slider, Button, TextField, Typography } from '@mui/material';

import GeneralColorPicker from '../../general-color-picker';

interface ContainerOptionsProps {
  containerBorderWidth: number;
  setContainerBorderWidth: (width: number) => void;
  containerBorderColor: string;
  setContainerBorderColor: (color: string) => void;
  containerBorderRadius: number;
  setContainerBorderRadius: (radius: number) => void;
  containerPadding: number;
  setContainerPadding: (padding: number) => void;
  containerMaxWidth: number;
  setContainerMaxWidth: (width: number) => void;
}

export default function ContainerOptions({
  containerBorderWidth,
  setContainerBorderWidth,
  containerBorderColor,
  setContainerBorderColor,
  containerBorderRadius,
  setContainerBorderRadius,
  containerPadding,
  setContainerPadding,
  containerMaxWidth,
  setContainerMaxWidth,
}: ContainerOptionsProps) {
  return (
    <Box sx={{ p: 2 }}>
      {/* Ancho del borde */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Grosor del borde
        </Typography>
        <Slider
          value={containerBorderWidth}
          onChange={(_, newValue) => setContainerBorderWidth(newValue as number)}
          min={0}
          max={10}
          step={1}
          marks
          valueLabelDisplay="auto"
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          {containerBorderWidth}px
        </Typography>
      </Box>

      {/* Color del borde */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Color del borde
        </Typography>
        <GeneralColorPicker
          selectedColor={containerBorderColor}
          onChange={(newColor) => setContainerBorderColor(newColor)}
          label=""
          size="small"
        />
      </Box>

      {/* Radio del borde */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Radio del borde
        </Typography>
        <Slider
          value={containerBorderRadius}
          onChange={(_, newValue) => setContainerBorderRadius(newValue as number)}
          min={0}
          max={50}
          step={1}
          marks={[
            { value: 0, label: '0' },
            { value: 12, label: '12' },
            { value: 24, label: '24' },
            { value: 50, label: '50' },
          ]}
          valueLabelDisplay="auto"
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          {containerBorderRadius}px
        </Typography>
      </Box>

      {/* Padding interno */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Espaciado interno
        </Typography>
        <Slider
          value={containerPadding}
          onChange={(_, newValue) => setContainerPadding(newValue as number)}
          min={0}
          max={50}
          step={1}
          marks={[
            { value: 0, label: '0' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
            { value: 30, label: '30' },
            { value: 50, label: '50' },
          ]}
          valueLabelDisplay="auto"
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          {containerPadding}px
        </Typography>
      </Box>

      {/* Ancho máximo */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Ancho máximo
        </Typography>
        <TextField
          fullWidth
          type="number"
          value={containerMaxWidth}
          onChange={(e) => setContainerMaxWidth(parseInt(e.target.value) || 560)}
          inputProps={{ min: 200, max: 800, step: 10 }}
          size="small"
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          Rango recomendado: 400px - 600px
        </Typography>
      </Box>

      {/* Presets */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
          Estilos predefinidos
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setContainerBorderWidth(1);
              setContainerBorderColor('#e0e0e0');
              setContainerBorderRadius(12);
              setContainerPadding(10);
              setContainerMaxWidth(560);
            }}
          >
            Predeterminado
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setContainerBorderWidth(2);
              setContainerBorderColor('#1976d2');
              setContainerBorderRadius(8);
              setContainerPadding(20);
              setContainerMaxWidth(500);
            }}
          >
            Moderno
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              setContainerBorderWidth(0);
              setContainerBorderColor('#transparent');
              setContainerBorderRadius(0);
              setContainerPadding(0);
              setContainerMaxWidth(600);
            }}
          >
            Sin borde
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
