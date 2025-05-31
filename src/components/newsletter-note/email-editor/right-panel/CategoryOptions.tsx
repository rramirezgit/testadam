import { Icon } from '@iconify/react';

import {
  Box,
  Button,
  Select,
  Divider,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import type { CategoryOptionsProps } from './types';
import type { Categoria } from '../components/Categorias';

export default function CategoryOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
}: CategoryOptionsProps) {
  if (!selectedComponentId) return null;

  const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
  if (!component || component.type !== 'category') return null;

  // Convertir el color único a un array de categorías si es necesario
  const convertCategoryProps = (): Categoria[] => {
    // Si ya tenemos un array de categorías, usarlo
    if (component.props?.categorias) {
      return component.props.categorias;
    }

    // Si no, crear uno con el valor actual
    const items = component.props?.items || [component.content];
    const colors = Array.isArray(component.props?.color)
      ? component.props.color
      : [component.props?.color || '#4caf50'];

    return items.map((item, index) => ({
      id: `cat-${Date.now()}-${index}`,
      texto: item,
      colorFondo: colors[index] || '#4caf50',
      colorTexto: component.props?.textColor || 'white',
    }));
  };

  const categorias = convertCategoryProps();

  // Propiedades de estilo
  const borderRadius = component.props?.borderRadius || 16;
  const padding = component.props?.padding || 4;
  const fontSize = component.props?.fontSize || 14;
  const fontWeight = component.props?.fontWeight || 'bold';

  // Manejar edición de categoría
  const handleUpdateCategoria = (catId: string, field: keyof Categoria, value: string) => {
    const nuevasCategorias = categorias.map((cat) =>
      cat.id === catId ? { ...cat, [field]: value } : cat
    );
    updateComponentProps(selectedComponentId, { categorias: nuevasCategorias });
  };

  // Agregar nueva categoría
  const handleAddCategoria = () => {
    if (categorias.length >= 4) return; // Máximo 4 categorías

    const nuevaCategoria: Categoria = {
      id: `cat-${Date.now()}`,
      texto: 'Nueva categoría',
      colorFondo: '#2196f3',
      colorTexto: 'white',
    };

    updateComponentProps(selectedComponentId, {
      categorias: [...categorias, nuevaCategoria],
    });
  };

  // Eliminar categoría
  const handleRemoveCategoria = (catId: string) => {
    if (categorias.length <= 1) return; // Mantener al menos una categoría

    const nuevasCategorias = categorias.filter((cat) => cat.id !== catId);
    updateComponentProps(selectedComponentId, { categorias: nuevasCategorias });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Categorías
      </Typography>

      {categorias.map((categoria, index) => (
        <Box
          key={categoria.id}
          sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Categoría {index + 1}
          </Typography>

          <TextField
            fullWidth
            size="small"
            label="Texto"
            value={categoria.texto}
            onChange={(e) => handleUpdateCategoria(categoria.id, 'texto', e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" gutterBottom>
            Color de fondo
          </Typography>
          <TextField
            type="color"
            fullWidth
            size="small"
            value={categoria.colorFondo}
            onChange={(e) => handleUpdateCategoria(categoria.id, 'colorFondo', e.target.value)}
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" gutterBottom>
            Color de texto
          </Typography>
          <TextField
            type="color"
            fullWidth
            size="small"
            value={categoria.colorTexto}
            onChange={(e) => handleUpdateCategoria(categoria.id, 'colorTexto', e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <Typography variant="body2">Vista previa:</Typography>
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: categoria.colorFondo,
                color: categoria.colorTexto,
                borderRadius: `${borderRadius}px`,
                padding: `${padding}px 12px`,
                fontWeight,
                fontSize: `${fontSize}px`,
              }}
            >
              {categoria.texto}
            </Box>
          </Box>

          {categorias.length > 1 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Icon icon="mdi:delete" />}
              onClick={() => handleRemoveCategoria(categoria.id)}
              fullWidth
            >
              Eliminar categoría
            </Button>
          )}
        </Box>
      ))}

      {categorias.length < 4 && (
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Icon icon="mdi:plus" />}
          onClick={handleAddCategoria}
          sx={{ mb: 3 }}
        >
          Añadir categoría
        </Button>
      )}

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Estilo de Categorías
      </Typography>

      <Typography variant="subtitle2" gutterBottom>
        Bordes redondeados
      </Typography>
      <TextField
        type="number"
        fullWidth
        size="small"
        InputProps={{
          inputProps: { min: 0, max: 50 },
          endAdornment: <Typography variant="caption">px</Typography>,
        }}
        value={borderRadius}
        onChange={(e) =>
          updateComponentProps(selectedComponentId, {
            borderRadius: Number(e.target.value),
          })
        }
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Relleno interno
      </Typography>
      <TextField
        type="number"
        fullWidth
        size="small"
        InputProps={{
          inputProps: { min: 0, max: 20 },
          endAdornment: <Typography variant="caption">px</Typography>,
        }}
        value={padding}
        onChange={(e) =>
          updateComponentProps(selectedComponentId, {
            padding: Number(e.target.value),
          })
        }
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Tamaño de fuente
      </Typography>
      <TextField
        type="number"
        fullWidth
        size="small"
        InputProps={{
          inputProps: { min: 10, max: 24 },
          endAdornment: <Typography variant="caption">px</Typography>,
        }}
        value={fontSize}
        onChange={(e) =>
          updateComponentProps(selectedComponentId, {
            fontSize: Number(e.target.value),
          })
        }
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="font-weight-label">Grosor de fuente</InputLabel>
        <Select
          labelId="font-weight-label"
          value={fontWeight}
          label="Grosor de fuente"
          onChange={(e) =>
            updateComponentProps(selectedComponentId, {
              fontWeight: e.target.value,
            })
          }
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="bold">Negrita</MenuItem>
          <MenuItem value="lighter">Fino</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
