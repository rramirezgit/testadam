import { Icon } from '@iconify/react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Button,
  Select,
  Slider,
  Divider,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  CardContent,
} from '@mui/material';

import TextColorPicker from '../color-picker/TextColorPicker';
import { findComponentById } from '../utils/componentHelpers';

import type { CategoryOptionsProps } from './types';
import type { Categoria } from '../components/Categorias';

export default function CategoryOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
}: CategoryOptionsProps) {
  if (!selectedComponentId) return null;

  const component = findComponentById(getActiveComponents(), selectedComponentId);
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
  const fontWeight = component.props?.fontWeight || 'normal';

  // Manejar edición de categoría
  const handleUpdateCategoria = (catId: string, field: keyof Categoria, value: string) => {
    const nuevasCategorias = categorias.map((cat) =>
      cat.id === catId ? { ...cat, [field]: value } : cat
    );
    updateComponentProps(selectedComponentId, { categorias: nuevasCategorias });
  };

  // Manejar actualización múltiple de categoría (para presets)
  const handleUpdateCategoriaMultiple = (catId: string, updates: Partial<Categoria>) => {
    const nuevasCategorias = categorias.map((cat) =>
      cat.id === catId ? { ...cat, ...updates } : cat
    );
    updateComponentProps(selectedComponentId, { categorias: nuevasCategorias });
  };

  // Agregar nueva categoría
  const handleAddCategoria = () => {
    if (categorias.length >= 6) return; // Máximo 6 categorías

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

  // Definir presets de colores para categorías individuales
  const colorPresets = [
    { name: 'Azul', bg: '#e3f2fd', text: '#1565c0' },
    { name: 'Morado', bg: '#f3e5f5', text: '#7b1fa2' },
    { name: 'Rojo', bg: '#fce4ec', text: '#c2185b' },
    { name: 'Verde', bg: '#e8f5e8', text: '#388e3c' },
    { name: 'Amarillo', bg: '#fff3e0', text: '#f57c00' },
    { name: 'Celeste', bg: '#e1f5fe', text: '#0277bd' },
  ];

  // Sistema de categorías rápidas prediseñadas
  const categoriasRapidas = [
    { texto: 'Tecnología', colorFondo: '#e3f2fd', colorTexto: '#1565c0' },
    { texto: 'IA & Machine Learning', colorFondo: '#f3e5f5', colorTexto: '#7b1fa2' },
    { texto: 'Desarrollo Web', colorFondo: '#e8f5e8', colorTexto: '#388e3c' },
    { texto: 'Diseño UX/UI', colorFondo: '#fce4ec', colorTexto: '#c2185b' },
    { texto: 'Marketing Digital', colorFondo: '#fff8e1', colorTexto: '#f57c00' },
    { texto: 'Productividad', colorFondo: '#e1f5fe', colorTexto: '#0277bd' },
    { texto: 'Startups', colorFondo: '#fff3e0', colorTexto: '#e65100' },
    { texto: 'Finanzas', colorFondo: '#e8f5e8', colorTexto: '#2e7d32' },
    { texto: 'Salud & Bienestar', colorFondo: '#f1f8e9', colorTexto: '#558b2f' },
    { texto: 'Educación', colorFondo: '#e0f2f1', colorTexto: '#00695c' },
    { texto: 'Ciencia', colorFondo: '#e8eaf6', colorTexto: '#3f51b5' },
    { texto: 'Entretenimiento', colorFondo: '#fce4ec', colorTexto: '#ad1457' },
  ];

  // Agregar categoría rápida prediseñada
  const handleAddCategoriaRapida = (categoriaRapida: {
    texto: string;
    colorFondo: string;
    colorTexto: string;
  }) => {
    if (categorias.length >= 6) return;

    const nuevaCategoria: Categoria = {
      id: Date.now().toString(),
      texto: categoriaRapida.texto,
      colorFondo: categoriaRapida.colorFondo,
      colorTexto: categoriaRapida.colorTexto,
    };

    const nuevasCategorias = [...categorias, nuevaCategoria];
    updateComponentProps(selectedComponentId, { categorias: nuevasCategorias });
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Categorías rápidas prediseñadas */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          Categorías Rápidas
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 1,
          }}
        >
          {categoriasRapidas.map((categoria, index) => (
            <Button
              key={index}
              variant="outlined"
              size="small"
              disabled={categorias.length >= 6}
              onClick={() => handleAddCategoriaRapida(categoria)}
              startIcon={<Icon icon="mdi:plus" />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderColor: categoria.colorFondo,
                color: categoria.colorTexto,
                backgroundColor: `${categoria.colorFondo}20`,
                '&:hover': {
                  backgroundColor: categoria.colorFondo,
                  color: categoria.colorTexto,
                  borderColor: categoria.colorFondo,
                },
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              {categoria.texto}
            </Button>
          ))}
        </Box>

        {categorias.length >= 6 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Has alcanzado el límite de 6 categorías. Elimina alguna para agregar nuevas.
          </Alert>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Configuración individual de categorías */}
      <Typography variant="subtitle1" gutterBottom>
        Categorías ({categorias.length}/6)
      </Typography>

      {categorias.map((categoria, index) => (
        <Card
          key={categoria.id}
          variant="outlined"
          sx={{ mb: 2, border: '2px solid', borderColor: categoria.colorFondo }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Categoría {index + 1}
              </Typography>
              {categorias.length > 1 && (
                <Button
                  size="small"
                  color="error"
                  startIcon={<Icon icon="mdi:delete" />}
                  onClick={() => handleRemoveCategoria(categoria.id)}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  Eliminar
                </Button>
              )}
            </Box>

            <TextField
              fullWidth
              size="small"
              label="Texto de la categoría"
              value={categoria.texto}
              onChange={(e) => handleUpdateCategoria(categoria.id, 'texto', e.target.value)}
              sx={{ mb: 3 }}
              placeholder="Ej: Tecnología, Marketing, etc."
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                Color de fondo
              </Typography>
              <TextColorPicker
                selectedColor={categoria.colorFondo}
                applyTextColor={(color) => handleUpdateCategoria(categoria.id, 'colorFondo', color)}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>
                Color de texto
              </Typography>
              <TextColorPicker
                selectedColor={categoria.colorTexto}
                applyTextColor={(color) => handleUpdateCategoria(categoria.id, 'colorTexto', color)}
              />
            </Box>

            {/* Presets rápidos */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                Presets rápidos:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                {colorPresets.map((preset) => (
                  <Chip
                    key={preset.name}
                    label={preset.name}
                    size="small"
                    clickable
                    onClick={() => {
                      handleUpdateCategoriaMultiple(categoria.id, {
                        colorFondo: preset.bg,
                        colorTexto: preset.text,
                      });
                    }}
                    sx={{
                      backgroundColor: preset.bg,
                      color: preset.text,
                      fontSize: '11px',
                      height: '24px',
                      '&:hover': {
                        backgroundColor: preset.bg,
                        opacity: 0.8,
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Botón para agregar nueva categoría */}
      {categorias.length < 6 && (
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Icon icon="mdi:plus" />}
          onClick={handleAddCategoria}
          sx={{
            mb: 3,
            borderStyle: 'dashed',
            borderWidth: 2,
            py: 1.5,
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
            },
          }}
        >
          Añadir nueva categoría
        </Button>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Configuración de estilo global */}
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Estilo Global
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Bordes redondeados: {borderRadius}px
        </Typography>
        <Slider
          size="small"
          value={borderRadius}
          onChange={(_, value) => {
            if (selectedComponentId) {
              updateComponentProps(selectedComponentId, {
                borderRadius: value as number,
              });
            }
          }}
          min={0}
          max={50}
          marks={[
            { value: 0, label: '0' },
            { value: 12, label: '12' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
          ]}
          sx={{
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          0 = rectangular, 50 = completamente redondo
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Relleno interno: {padding}px
        </Typography>
        <Slider
          size="small"
          value={padding}
          onChange={(_, value) => {
            if (selectedComponentId) {
              updateComponentProps(selectedComponentId, {
                padding: value as number,
              });
            }
          }}
          min={0}
          max={20}
          marks={[
            { value: 0, label: '0' },
            { value: 5, label: '5' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
          ]}
          sx={{
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Espaciado dentro de cada categoría
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Tamaño de fuente: {fontSize}px
        </Typography>
        <Slider
          size="small"
          value={fontSize}
          onChange={(_, value) => {
            if (selectedComponentId) {
              updateComponentProps(selectedComponentId, {
                fontSize: value as number,
              });
            }
          }}
          min={10}
          max={24}
          marks={[
            { value: 10, label: '10' },
            { value: 14, label: '14' },
            { value: 18, label: '18' },
            { value: 24, label: '24' },
          ]}
          sx={{
            '& .MuiSlider-thumb': {
              width: 20,
              height: 20,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          Tamaño del texto de las categorías
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="font-weight-label">Grosor de fuente</InputLabel>
          <Select
            labelId="font-weight-label"
            value={fontWeight}
            label="Grosor de fuente"
            onChange={(e) => {
              if (selectedComponentId) {
                updateComponentProps(selectedComponentId, {
                  fontWeight: e.target.value,
                });
              }
            }}
          >
            <MenuItem value="300">Fino (300)</MenuItem>
            <MenuItem value="normal">Normal (400)</MenuItem>
            <MenuItem value="500">Medio (500)</MenuItem>
            <MenuItem value="bold">Negrita (700)</MenuItem>
            <MenuItem value="900">Extra negrita (900)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Presets de estilo global */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Estilos predefinidos
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if (selectedComponentId) {
                updateComponentProps(selectedComponentId, {
                  borderRadius: 16,
                  padding: 4,
                  fontSize: 14,
                  fontWeight: 'bold',
                });
              }
            }}
          >
            Moderno
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if (selectedComponentId) {
                updateComponentProps(selectedComponentId, {
                  borderRadius: 4,
                  padding: 6,
                  fontSize: 12,
                  fontWeight: 'normal',
                });
              }
            }}
          >
            Clásico
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              if (selectedComponentId) {
                updateComponentProps(selectedComponentId, {
                  borderRadius: 50,
                  padding: 8,
                  fontSize: 13,
                  fontWeight: '500',
                });
              }
            }}
          >
            Pastilla
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
