import type { EmailComponent } from 'src/types/saved-note';

import {
  Box,
  Stack,
  Alert,
  Button,
  Select,
  Slider,
  Divider,
  MenuItem,
  Typography,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';

import { findComponentById } from '../utils/componentHelpers';
import { generateTituloConIconoPropsFromCategory } from '../constants/category-icons';

import type { CategoryOptionsProps } from './types';
import type { Categoria } from '../components/Categorias';

const findFirstComponentByType = (
  components: EmailComponent[],
  type: string
): EmailComponent | null => {
  for (const component of components) {
    if (component.type === type) {
      return component;
    }

    if (component.props?.componentsData && Array.isArray(component.props.componentsData)) {
      const found = findFirstComponentByType(component.props.componentsData, type);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

export default function CategoryOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
  categoryId,
  setCategoryId,
  subcategoryId,
  setSubcategoryId,
  categories,
  subcategories,
  contentTypeId,
  loadingMetadata,
}: CategoryOptionsProps) {
  const component = selectedComponentId
    ? findComponentById(getActiveComponents(), selectedComponentId)
    : null;

  // 🔍 LOGGING: Detectar cuando el componente se monta/desmonta o sus props cambian
  // useEffect(() => {
  //   if (component && component.type === 'category') {
  //     console.log('🔄 [CategoryOptions] Component mounted/updated:', {
  //       selectedComponentId,
  //       categoryId,
  //       subcategoriesCount: subcategories.length,
  //       subcategories: subcategories.map((s) => ({ id: s.id, name: s.name })),
  //       componentCategorias: component.props?.categorias,
  //       componentContent: component.content,
  //     });
  //   }

  //   return () => {
  //     if (component) {
  //       console.log('🔻 [CategoryOptions] Component will unmount');
  //     }
  //   };
  // }, [selectedComponentId, categoryId, subcategories, component]);

  if (!selectedComponentId) return null;
  if (!component || component.type !== 'category') return null;

  const syncTituloConIconoComponent = (category: {
    id: string;
    name: string;
    imageUrl?: string;
  }) => {
    const tituloComponent = findFirstComponentByType(getActiveComponents(), 'tituloConIcono');
    if (!tituloComponent) {
      return;
    }

    const tituloProps = generateTituloConIconoPropsFromCategory(category);
    updateComponentProps(tituloComponent.id, tituloProps, { content: category.name });
  };

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

  // Paleta de colores suaves para subcategorías
  const coloresSuaves = [
    { colorFondo: '#e3f2fd', colorTexto: '#1565c0' },
    { colorFondo: '#f3e5f5', colorTexto: '#7b1fa2' },
    { colorFondo: '#e8f5e8', colorTexto: '#388e3c' },
    { colorFondo: '#fce4ec', colorTexto: '#c2185b' },
    { colorFondo: '#fff8e1', colorTexto: '#f57c00' },
    { colorFondo: '#e1f5fe', colorTexto: '#0277bd' },
    { colorFondo: '#fff3e0', colorTexto: '#e65100' },
    { colorFondo: '#f1f8e9', colorTexto: '#558b2f' },
    { colorFondo: '#e0f2f1', colorTexto: '#00695c' },
    { colorFondo: '#e8eaf6', colorTexto: '#3f51b5' },
    { colorFondo: '#fce4ec', colorTexto: '#ad1457' },
    { colorFondo: '#e8f5e8', colorTexto: '#2e7d32' },
  ];

  // Agregar subcategoría como badge visual
  const handleAddSubcategoria = (
    subcategoria: { id: string; name: string },
    colorIndex: number
  ) => {
    // Usar el componente del scope (se recalcula en cada render) en lugar de getActiveComponents()
    // que puede devolver un estado desactualizado debido a actualizaciones asíncronas de React
    const currentCategorias = component.props?.categorias || [];

    console.log('🎯 [CategoryOptions] handleAddSubcategoria:', {
      subcategoriaName: subcategoria.name,
      currentCategoriasCount: currentCategorias.length,
      currentCategorias: currentCategorias.map((c) => ({ id: c.id, texto: c.texto })),
    });

    if (currentCategorias.length >= 6) {
      console.log('⚠️ [CategoryOptions] Límite de 6 categorías alcanzado');
      return;
    }

    // Calcular el índice de color basado en el número de categorías existentes
    // para que los colores roten correctamente independientemente de qué subcategoría se seleccione
    const colorIndexCalculado = currentCategorias.length % coloresSuaves.length;
    const colores = coloresSuaves[colorIndexCalculado];

    console.log('🎨 [CategoryOptions] Color asignado:', {
      colorIndexCalculado,
      colorFondo: colores.colorFondo,
      colorTexto: colores.colorTexto,
    });

    const nuevaCategoria: Categoria = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID único
      texto: subcategoria.name,
      colorFondo: colores.colorFondo,
      colorTexto: colores.colorTexto,
    };

    // Agregar la nueva categoría al array actual, conservando todas las anteriores
    const nuevasCategorias = [...currentCategorias, nuevaCategoria];

    console.log('✅ [CategoryOptions] Nuevas categorías:', {
      totalCount: nuevasCategorias.length,
      nuevasCategorias: nuevasCategorias.map((c) => ({
        id: c.id,
        texto: c.texto,
        colorFondo: c.colorFondo,
      })),
    });

    // Actualizar las props y el contenido (texto plano) en una sola operación
    const textosCategorias = nuevasCategorias.map((cat) => cat.texto).join(', ');
    updateComponentProps(
      selectedComponentId,
      { categorias: nuevasCategorias },
      { content: textosCategorias }
    );

    if (!subcategoryId) {
      console.log('🔗 [CategoryOptions] Sincronizando subcategoría inicial:', subcategoria.id);
      setSubcategoryId(subcategoria.id);
    }
  };

  return (
    <Box>
      {/* Selector de categoría si no hay una seleccionada */}
      <Box sx={{ mb: 0 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          Seleccionar Categoría
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoryId}
            label="Categoría"
            onChange={(e) => {
              const nextCategoryId = e.target.value;
              setCategoryId(nextCategoryId);

              const selectedCategory = categories.find((cat) => cat.id === nextCategoryId);
              if (selectedCategory) {
                syncTituloConIconoComponent(selectedCategory);
              }
            }}
            disabled={!contentTypeId || loadingMetadata}
            size="small"
          >
            <MenuItem value="">
              <em>Seleccionar categoría</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Subcategorías rápidas cuando hay categoría seleccionada */}
      {categoryId && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Subcategorías
          </Typography>

          {loadingMetadata ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : subcategories.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 1,
              }}
            >
              {subcategories.map((subcategoria, index) => {
                const colores = coloresSuaves[index % coloresSuaves.length];
                return (
                  <Button
                    key={subcategoria.id}
                    variant="outlined"
                    size="small"
                    disabled={categorias.length >= 6}
                    onClick={() => handleAddSubcategoria(subcategoria, index)}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderColor: colores.colorFondo,
                      color: colores.colorTexto,
                      backgroundColor: `${colores.colorFondo}20`,
                      '&:hover': {
                        backgroundColor: colores.colorFondo,
                        color: colores.colorTexto,
                        borderColor: colores.colorFondo,
                      },
                      '&:disabled': {
                        opacity: 0.5,
                      },
                    }}
                  >
                    {subcategoria.name}
                  </Button>
                );
              })}
            </Box>
          ) : (
            <Alert severity="warning" sx={{ mt: 2 }}>
              No hay subcategorías disponibles para esta categoría
            </Alert>
          )}
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

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
