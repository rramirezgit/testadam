import { Icon } from '@iconify/react';

import {
  Box,
  Button,
  Switch,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import type { SummaryOptionsProps } from './types';

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
  const label = component.props?.label || 'Resumen';
  const borderColor = component.props?.borderColor || '#4caf50';
  const icon = component.props?.icon || 'mdi:text-box-outline';
  const iconColor = component.props?.iconColor || '#000000';
  const iconSize = component.props?.iconSize || 24;
  const titleColor = component.props?.titleColor || '#000000';
  const titleFontWeight = component.props?.titleFontWeight || 'normal';
  const titleFontFamily = component.props?.titleFontFamily || 'inherit';
  const useGradient = component.props?.useGradient || false;
  const gradientType = component.props?.gradientType || 'linear';
  const gradientDirection = component.props?.gradientDirection || 'to right';
  const gradientColor1 = component.props?.gradientColor1 || '#f5f7fa';
  const gradientColor2 = component.props?.gradientColor2 || '#c3cfe2';
  const backgroundColor = component.props?.backgroundColor || '#f5f7fa';

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Configuración del resumen
      </Typography>

      <Typography variant="subtitle2" gutterBottom>
        Etiqueta
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={label}
        onChange={(e) => updateComponentProps(selectedComponentId, { label: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Color del borde
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {['#4caf50', '#2196f3', '#f44336', '#ff9800', '#9c27b0', '#607d8b', '#000000'].map(
            (color) => (
              <Button
                key={color}
                onClick={() => updateComponentProps(selectedComponentId, { borderColor: color })}
                sx={{
                  width: 36,
                  height: 36,
                  minWidth: 36,
                  backgroundColor: color,
                  border: '1px solid #ddd',
                  '&:hover': { backgroundColor: color, opacity: 0.9 },
                }}
              />
            )
          )}
        </Box>
        <TextField
          type="color"
          fullWidth
          size="small"
          value={borderColor}
          onChange={(e) =>
            updateComponentProps(selectedComponentId, { borderColor: e.target.value })
          }
        />
      </Box>

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
          <Icon icon={icon} />
        </Box>
        <Button variant="outlined" size="small" onClick={() => setShowIconPicker(true)}>
          Cambiar icono
        </Button>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Color del icono
      </Typography>
      <TextField
        type="color"
        fullWidth
        size="small"
        value={iconColor}
        onChange={(e) => updateComponentProps(selectedComponentId, { iconColor: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Tamaño del icono
      </Typography>
      <TextField
        type="number"
        fullWidth
        size="small"
        InputProps={{
          inputProps: { min: 16, max: 48 },
          endAdornment: <Typography variant="caption">px</Typography>,
        }}
        value={iconSize}
        onChange={(e) =>
          updateComponentProps(selectedComponentId, { iconSize: Number(e.target.value) })
        }
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Título
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          type="color"
          fullWidth
          size="small"
          label="Color del título"
          value={titleColor}
          onChange={(e) =>
            updateComponentProps(selectedComponentId, { titleColor: e.target.value })
          }
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="font-weight-label">Grosor del título</InputLabel>
          <Select
            labelId="font-weight-label"
            value={titleFontWeight}
            label="Grosor del título"
            onChange={(e) =>
              updateComponentProps(selectedComponentId, { titleFontWeight: e.target.value })
            }
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="bold">Negrita</MenuItem>
            <MenuItem value="lighter">Fino</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel id="font-family-label">Fuente del título</InputLabel>
          <Select
            labelId="font-family-label"
            value={titleFontFamily}
            label="Fuente del título"
            onChange={(e) =>
              updateComponentProps(selectedComponentId, { titleFontFamily: e.target.value })
            }
          >
            <MenuItem value="inherit">Por defecto</MenuItem>
            <MenuItem value="'Roboto', sans-serif">Roboto</MenuItem>
            <MenuItem value="'Playfair Display', serif">Playfair Display</MenuItem>
            <MenuItem value="'Montserrat', sans-serif">Montserrat</MenuItem>
            <MenuItem value="'Open Sans', sans-serif">Open Sans</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Fondo
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={useGradient}
            onChange={(e) =>
              updateComponentProps(selectedComponentId, { useGradient: e.target.checked })
            }
          />
        }
        label="Usar gradiente"
        sx={{ mb: 2 }}
      />

      {useGradient ? (
        <>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="gradient-type-label">Tipo de gradiente</InputLabel>
            <Select
              labelId="gradient-type-label"
              value={gradientType}
              label="Tipo de gradiente"
              onChange={(e) =>
                updateComponentProps(selectedComponentId, { gradientType: e.target.value })
              }
            >
              <MenuItem value="linear">Lineal</MenuItem>
              <MenuItem value="radial">Radial</MenuItem>
            </Select>
          </FormControl>

          {gradientType === 'linear' && (
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="gradient-direction-label">Dirección</InputLabel>
              <Select
                labelId="gradient-direction-label"
                value={gradientDirection}
                label="Dirección"
                onChange={(e) =>
                  updateComponentProps(selectedComponentId, {
                    gradientDirection: e.target.value,
                  })
                }
              >
                <MenuItem value="to right">Hacia la derecha</MenuItem>
                <MenuItem value="to left">Hacia la izquierda</MenuItem>
                <MenuItem value="to bottom">Hacia abajo</MenuItem>
                <MenuItem value="to top">Hacia arriba</MenuItem>
                <MenuItem value="to bottom right">Hacia abajo-derecha</MenuItem>
                <MenuItem value="to bottom left">Hacia abajo-izquierda</MenuItem>
                <MenuItem value="to top right">Hacia arriba-derecha</MenuItem>
                <MenuItem value="to top left">Hacia arriba-izquierda</MenuItem>
              </Select>
            </FormControl>
          )}

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              type="color"
              fullWidth
              size="small"
              label="Color 1"
              value={gradientColor1}
              onChange={(e) =>
                updateComponentProps(selectedComponentId, { gradientColor1: e.target.value })
              }
            />
            <TextField
              type="color"
              fullWidth
              size="small"
              label="Color 2"
              value={gradientColor2}
              onChange={(e) =>
                updateComponentProps(selectedComponentId, { gradientColor2: e.target.value })
              }
            />
          </Box>

          <Box
            sx={{
              height: 24,
              width: '100%',
              borderRadius: 1,
              mb: 2,
              background:
                gradientType === 'linear'
                  ? `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`
                  : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`,
            }}
          />
        </>
      ) : (
        <TextField
          type="color"
          fullWidth
          size="small"
          label="Color de fondo"
          value={backgroundColor}
          onChange={(e) =>
            updateComponentProps(selectedComponentId, { backgroundColor: e.target.value })
          }
          sx={{ mb: 2 }}
        />
      )}
    </Box>
  );
}
