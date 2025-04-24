'use client';

import type React from 'react';
import type { EmailComponent } from 'src/types/saved-note';
import type { BannerOption } from 'src/components/newsletter-note/banner-selector';

import { Icon } from '@iconify/react';

import {
  Box,
  Tab,
  Tabs,
  Grid,
  Paper,
  AppBar,
  Button,
  Select,
  Switch,
  Toolbar,
  Divider,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
  ToggleButton,
  FormControlLabel,
  ToggleButtonGroup,
} from '@mui/material';

import TextColorPicker from './color-picker/TextColorPicker';

interface RightPanelProps {
  selectedComponentId: string | null;
  rightPanelTab: number;
  setRightPanelTab: (tab: number) => void;
  getActiveComponents: () => EmailComponent[];
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  updateComponentContent: (id: string, content: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  selectedFontSize: string;
  setSelectedFontSize: (size: string) => void;
  selectedFontWeight: string;
  setSelectedFontWeight: (weight: string) => void;
  selectedAlignment: string;
  textFormat: string[];
  applyTextFormat: (format: string) => void;
  applyTextAlignment: (alignment: string) => void;
  applyTextColor: (color: string) => void;
  applyFontSize: (size: string) => void;
  applyFontFamily: (font: string) => void;
  emailBackground: string;
  setEmailBackground: (color: string) => void;
  selectedBanner: string | null;
  setSelectedBanner: (banner: string | null) => void;
  showGradient: boolean;
  setShowGradient: (show: boolean) => void;
  gradientColors: string[];
  setGradientColors: (colors: string[]) => void;
  bannerOptions: BannerOption[];
  setSelectedAlignment: (alignment: string) => void;
  hasTextSelection: boolean;
  listStyle?: string;
  updateListStyle: (listId: string, listStyleType: string) => void;
  listColor?: string;
  updateListColor: (listId: string, color: string) => void;
  convertTextToList: (componentId: string | null, listType: 'ordered' | 'unordered') => void;
  setShowIconPicker: (show: boolean) => void;
}

// Componente para opciones de estilo de lista (extraído fuera del componente principal)
const ListStyleOptions = ({
  selectedComponentId,
  listStyle,
  updateListStyle,
  listColor,
  updateListColor,
}: {
  selectedComponentId: string | null;
  listStyle?: string;
  updateListStyle: (listId: string, listStyleType: string) => void;
  listColor?: string;
  updateListColor: (listId: string, color: string) => void;
}) => {
  if (!selectedComponentId) return null;

  // Determinar si es una lista ordenada
  const isOrderedList =
    listStyle === 'decimal' ||
    listStyle === 'lower-alpha' ||
    listStyle === 'upper-alpha' ||
    listStyle === 'lower-roman' ||
    listStyle === 'upper-roman';

  // Opciones para listas no ordenadas
  const unorderedListOptions = [
    { value: 'disc', label: 'Punto (•)' },
    { value: 'circle', label: 'Círculo (○)' },
    { value: 'square', label: 'Cuadrado (■)' },
  ];

  // Opciones para listas ordenadas
  const orderedListOptions = [
    { value: 'decimal', label: 'Números (1, 2, 3)' },
    { value: 'lower-alpha', label: 'Letras minúsculas (a, b, c)' },
    { value: 'upper-alpha', label: 'Letras mayúsculas (A, B, C)' },
    { value: 'lower-roman', label: 'Números romanos minúsculos (i, ii, iii)' },
    { value: 'upper-roman', label: 'Números romanos mayúsculos (I, II, III)' },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Tipo de Estilo de Lista
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="list-type-label">Tipo de Lista</InputLabel>
        <Select
          labelId="list-type-label"
          id="list-type"
          value={isOrderedList ? 'ordered' : 'unordered'}
          label="Tipo de Lista"
          onChange={(e) => {
            if (e.target.value === 'ordered' && selectedComponentId) {
              updateListStyle(selectedComponentId, 'decimal');
            } else if (e.target.value === 'unordered' && selectedComponentId) {
              updateListStyle(selectedComponentId, 'disc');
            }
          }}
        >
          <MenuItem value="unordered">Lista con viñetas</MenuItem>
          <MenuItem value="ordered">Lista numerada</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle2" gutterBottom>
        Estilo de viñeta
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="bullet-style-label">Estilo de Viñeta</InputLabel>
        <Select
          labelId="bullet-style-label"
          id="bullet-style"
          value={listStyle}
          label="Estilo de Viñeta"
          onChange={(e) => {
            if (selectedComponentId) {
              updateListStyle(selectedComponentId, e.target.value);
            }
          }}
        >
          {isOrderedList
            ? orderedListOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            : unorderedListOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
        </Select>
      </FormControl>

      <Typography variant="subtitle2" gutterBottom>
        Color
      </Typography>
      <TextColorPicker
        selectedColor={listColor || '#000000'}
        applyTextColor={(color) => {
          if (selectedComponentId) {
            updateListColor(selectedComponentId, color);
          }
        }}
      />
    </Box>
  );
};

export default function RightPanel({
  selectedComponentId,
  rightPanelTab,
  setRightPanelTab,
  getActiveComponents,
  updateComponentProps,
  updateComponentStyle,
  updateComponentContent,
  selectedColor,
  setSelectedColor,
  selectedFont,
  setSelectedFont,
  selectedFontSize,
  setSelectedFontSize,
  selectedFontWeight,
  setSelectedFontWeight,
  selectedAlignment,
  textFormat,
  applyTextFormat,
  applyTextAlignment,
  applyTextColor,
  applyFontSize,
  applyFontFamily,
  emailBackground,
  setEmailBackground,
  selectedBanner,
  setSelectedBanner,
  showGradient,
  setShowGradient,
  gradientColors,
  setGradientColors,
  bannerOptions,
  setSelectedAlignment,
  hasTextSelection,
  listStyle,
  updateListStyle,
  listColor,
  updateListColor,
  convertTextToList,
  setShowIconPicker,
}: RightPanelProps) {
  // Si no hay componente seleccionado, mostrar un mensaje
  const renderEmptyState = () => (
    <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
      <Icon icon="mdi:cursor-text" style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
      <Typography variant="h6" gutterBottom>
        Selecciona un componente
      </Typography>
      <Typography variant="body2">
        Haz clic en cualquier elemento del email para editar su formato y estilo.
      </Typography>
    </Box>
  );

  // Obtener el componente seleccionado
  const selectedComponent = selectedComponentId
    ? getActiveComponents().find((comp) => comp.id === selectedComponentId)
    : null;

  if (!selectedComponent) {
    return (
      <Box
        sx={{
          width: 280,
          borderLeft: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
        }}
      >
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
              Diseño
            </Typography>
          </Toolbar>
        </AppBar>
        {renderEmptyState()}
      </Box>
    );
  }

  // Determinar el tipo de componente
  const componentType = selectedComponent.type;

  // Renderizar las opciones específicas para imágenes
  const renderImageOptions = () => (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Vista previa
      </Typography>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        {selectedComponent.props?.src ? (
          <img
            src={selectedComponent.props.src}
            alt={selectedComponent.props.alt || 'Vista previa'}
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100px',
              border: '2px dashed #ccc',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            No hay imagen seleccionada
          </Box>
        )}
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Texto alternativo
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Texto alternativo"
        value={selectedComponent.props?.alt || ''}
        onChange={(e) => updateComponentProps(selectedComponentId!, { alt: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Dimensiones
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          type="number"
          size="small"
          label="Ancho"
          InputProps={{ endAdornment: <Typography variant="caption">px</Typography> }}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { width: `${e.target.value}px` });
          }}
          sx={{ width: '50%' }}
        />
        <TextField
          type="number"
          size="small"
          label="Alto"
          InputProps={{ endAdornment: <Typography variant="caption">px</Typography> }}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { height: `${e.target.value}px` });
          }}
          sx={{ width: '50%' }}
        />
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Alineación
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => updateComponentStyle(selectedComponentId!, { margin: '0 auto 0 0' })}
          color="default"
        >
          <Icon icon="mdi:format-align-left" />
        </IconButton>
        <IconButton
          onClick={() => updateComponentStyle(selectedComponentId!, { margin: '0 auto' })}
          color="default"
        >
          <Icon icon="mdi:format-align-center" />
        </IconButton>
        <IconButton
          onClick={() => updateComponentStyle(selectedComponentId!, { margin: '0 0 0 auto' })}
          color="default"
        >
          <Icon icon="mdi:format-align-right" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<Icon icon="mdi:content-save" />}
          onClick={() => {
            // Aquí iría la lógica para guardar la imagen en el backend
            alert('Imagen guardada en formato base64');
          }}
        >
          Guardar imagen
        </Button>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<Icon icon="mdi:delete" />}
          onClick={() => {
            // Eliminar la imagen
            updateComponentProps(selectedComponentId!, { src: '' });
          }}
        >
          Eliminar
        </Button>
      </Box>
    </>
  );

  // Renderizar las opciones específicas para galería
  const renderGalleryOptions = () => {
    const layout = selectedComponent.props?.layout || 'single';
    const images = selectedComponent.props?.images || [];

    // Determinar cuántas imágenes mostrar según el layout
    const getImageCount = (layoutType: string) => {
      switch (layoutType) {
        case 'single':
          return 1;
        case 'double':
          return 2;
        case 'grid':
          return 4;
        case 'feature':
          return 3;
        case 'masonry':
          return 3;
        case 'hero':
          return 3;
        default:
          return 1;
      }
    };

    return (
      <>
        <Typography variant="subtitle2" gutterBottom>
          Tipo de layout
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant={layout === 'single' ? 'contained' : 'outlined'}
            onClick={() => updateComponentProps(selectedComponentId!, { layout: 'single' })}
            sx={{ minWidth: '80px', flex: '1 0 auto', mb: 1 }}
          >
            1 Imagen
          </Button>
          <Button
            variant={layout === 'double' ? 'contained' : 'outlined'}
            onClick={() => updateComponentProps(selectedComponentId!, { layout: 'double' })}
            sx={{ minWidth: '80px', flex: '1 0 auto', mb: 1 }}
          >
            2 Imágenes
          </Button>
          <Button
            variant={layout === 'grid' ? 'contained' : 'outlined'}
            onClick={() => updateComponentProps(selectedComponentId!, { layout: 'grid' })}
            sx={{ minWidth: '80px', flex: '1 0 auto', mb: 1 }}
          >
            4 Imágenes
          </Button>
          <Button
            variant={layout === 'feature' ? 'contained' : 'outlined'}
            onClick={() => updateComponentProps(selectedComponentId!, { layout: 'feature' })}
            sx={{ minWidth: '80px', flex: '1 0 auto', mb: 1 }}
          >
            3 Imágenes (Destacada)
          </Button>
          <Button
            variant={layout === 'masonry' ? 'contained' : 'outlined'}
            onClick={() => updateComponentProps(selectedComponentId!, { layout: 'masonry' })}
            sx={{ minWidth: '80px', flex: '1 0 auto', mb: 1 }}
          >
            3 Imágenes (Mosaico)
          </Button>
          <Button
            variant={layout === 'hero' ? 'contained' : 'outlined'}
            onClick={() => updateComponentProps(selectedComponentId!, { layout: 'hero' })}
            sx={{ minWidth: '80px', flex: '1 0 auto', mb: 1 }}
          >
            3 Imágenes (Hero)
          </Button>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Imágenes de la galería
        </Typography>
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {Array.from({ length: getImageCount(layout) }).map((_, index) => {
            const image = images[index] || { src: '/placeholder.svg', alt: `Imagen ${index + 1}` };
            return (
              <Grid
                key={index}
                sx={{
                  mb: 1,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 80,
                      mb: 1,
                      backgroundImage: `url(${image.src || '/placeholder.svg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 1,
                    }}
                  />
                  <TextField
                    size="small"
                    placeholder="URL de la imagen"
                    value={image.src || ''}
                    onChange={(e) => {
                      const newImages = [...images];
                      if (!newImages[index]) {
                        newImages[index] = { src: '', alt: `Imagen ${index + 1}` };
                      }
                      newImages[index].src = e.target.value;
                      updateComponentProps(selectedComponentId!, { images: newImages });
                    }}
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    size="small"
                    placeholder="Texto alternativo"
                    value={image.alt || ''}
                    onChange={(e) => {
                      const newImages = [...images];
                      if (!newImages[index]) {
                        newImages[index] = { src: '/placeholder.svg', alt: '' };
                      }
                      newImages[index].alt = e.target.value;
                      updateComponentProps(selectedComponentId!, { images: newImages });
                    }}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Typography variant="subtitle2" gutterBottom>
          Espaciado entre imágenes
        </Typography>
        <TextField
          type="number"
          size="small"
          fullWidth
          InputProps={{
            inputProps: { min: 0, max: 20 },
            endAdornment: <Typography variant="caption">px</Typography>,
          }}
          defaultValue={8}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { gap: `${e.target.value}px` });
          }}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle2" gutterBottom>
          Bordes de imágenes
        </Typography>
        <TextField
          type="number"
          size="small"
          fullWidth
          InputProps={{
            inputProps: { min: 0, max: 20 },
            endAdornment: <Typography variant="caption">px</Typography>,
          }}
          defaultValue={8}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { borderRadius: `${e.target.value}px` });
          }}
          sx={{ mb: 3 }}
        />
      </>
    );
  };

  // Renderizar las opciones específicas para botones
  const renderButtonOptions = () => (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Texto del botón
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={selectedComponent.content}
        onChange={(e) => updateComponentContent(selectedComponentId!, e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        URL del botón
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="https://ejemplo.com"
        value={selectedComponent.props?.href || ''}
        onChange={(e) => updateComponentProps(selectedComponentId!, { href: e.target.value })}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Color del botón
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {[
            '#3f51b5',
            '#f44336',
            '#4caf50',
            '#ff9800',
            '#2196f3',
            '#9c27b0',
            '#607d8b',
            '#000000',
          ].map((color) => (
            <IconButton
              key={color}
              onClick={() => updateComponentStyle(selectedComponentId!, { backgroundColor: color })}
              sx={{
                width: 36,
                height: 36,
                backgroundColor: color,
                border: '1px solid #ddd',
                '&:hover': { backgroundColor: color, opacity: 0.9 },
              }}
            />
          ))}
        </Box>
        <TextField
          type="color"
          fullWidth
          size="small"
          onChange={(e) =>
            updateComponentStyle(selectedComponentId!, { backgroundColor: e.target.value })
          }
        />
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Color del texto
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {['#ffffff', '#000000', '#f5f5f5', '#212121'].map((color) => (
            <IconButton
              key={color}
              onClick={() => updateComponentStyle(selectedComponentId!, { color })}
              sx={{
                width: 36,
                height: 36,
                backgroundColor: color,
                border: '1px solid #ddd',
                '&:hover': { backgroundColor: color, opacity: 0.9 },
              }}
            />
          ))}
        </Box>
        <TextField
          type="color"
          fullWidth
          size="small"
          onChange={(e) => updateComponentStyle(selectedComponentId!, { color: e.target.value })}
        />
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Ancho del botón
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => updateComponentStyle(selectedComponentId!, { width: 'auto' })}
          sx={{ mr: 1 }}
        >
          Auto
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => updateComponentStyle(selectedComponentId!, { width: '100%' })}
        >
          Completo
        </Button>
      </Box>
    </>
  );

  // Renderizar las opciones para texto (párrafos, títulos, listas)
  const renderTextOptions = () => {
    // Verificar si el componente seleccionado es un párrafo
    const isParagraphComponent = selectedComponent?.type === 'paragraph';

    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
          <ToggleButtonGroup
            value={textFormat}
            onChange={(event, newFormats) => {
              // Verificar si es un array y tiene al menos un elemento
              const clickedFormat = (event.currentTarget as HTMLButtonElement).value;

              // Aplicar el formato
              applyTextFormat(clickedFormat);
            }}
            aria-label="text formatting"
            color="primary"
            disabled={!hasTextSelection} // Desactivar si no hay texto seleccionado
            sx={{
              border: 'none',
            }}
          >
            <ToggleButton value="bold" aria-label="bold" selected={textFormat.includes('bold')}>
              <Icon icon="mdi:format-bold" />
            </ToggleButton>
            <ToggleButton
              value="italic"
              aria-label="italic"
              selected={textFormat.includes('italic')}
            >
              <Icon icon="mdi:format-italic" />
            </ToggleButton>
            <ToggleButton
              value="underlined"
              aria-label="underlined"
              selected={textFormat.includes('underlined')}
            >
              <Icon icon="mdi:format-underline" />
            </ToggleButton>
            <ToggleButton
              value="strikethrough"
              aria-label="strikethrough"
              selected={textFormat.includes('strikethrough')}
            >
              <Icon icon="mdi:format-strikethrough" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <ToggleButtonGroup
            value={selectedAlignment}
            exclusive
            color="primary"
            sx={{
              border: 'none',
            }}
            onChange={(event, newAlignment) => {
              if (newAlignment !== null) {
                setSelectedAlignment(newAlignment);
                applyTextAlignment(newAlignment);
              }
            }}
            aria-label="text alignment"
          >
            <ToggleButton
              value="left"
              aria-label="left aligned"
              selected={selectedAlignment === 'left'}
            >
              <Icon icon="mdi:format-align-left" />
            </ToggleButton>
            <ToggleButton
              value="center"
              aria-label="center aligned"
              selected={selectedAlignment === 'center'}
            >
              <Icon icon="mdi:format-align-center" />
            </ToggleButton>
            <ToggleButton
              value="right"
              aria-label="right aligned"
              selected={selectedAlignment === 'right'}
            >
              <Icon icon="mdi:format-align-right" />
            </ToggleButton>
            <ToggleButton
              value="justify"
              aria-label="justified"
              selected={selectedAlignment === 'justify'}
            >
              <Icon icon="mdi:format-align-justify" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {componentType === 'heading' && (
          <ToggleButtonGroup
            value={selectedComponent.props?.level}
            exclusive
            color="primary"
            onChange={(event, newLevel) =>
              updateComponentProps(selectedComponentId!, { level: newLevel })
            }
            aria-label="Nivel de título"
            sx={{ mb: 3, border: 'none' }}
          >
            <ToggleButton value={1} aria-label="H1">
              H1
            </ToggleButton>
            <ToggleButton value={2} aria-label="H2">
              H2
            </ToggleButton>
            <ToggleButton value={3} aria-label="H3">
              H3
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="font-family-select-label">Fuente</InputLabel>
          <Select
            labelId="font-family-select-label"
            id="font-family-select"
            value={selectedFont}
            label="Fuente"
            onChange={(e) => {
              setSelectedFont(e.target.value);
              applyFontFamily(e.target.value);
            }}
          >
            <MenuItem value="Public Sans">Public Sans</MenuItem>
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Helvetica">Helvetica</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Georgia">Georgia</MenuItem>
            <MenuItem value="Courier New">Courier New</MenuItem>
            <MenuItem value="Verdana">Verdana</MenuItem>
            <MenuItem value="Tahoma">Tahoma</MenuItem>
            <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
            <MenuItem value="Palatino">Palatino</MenuItem>
            <MenuItem value="Bookman">Bookman</MenuItem>
            <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="font-weight-select-label">Peso de fuente</InputLabel>
          <Select
            labelId="font-weight-select-label"
            id="font-weight-select"
            value={selectedFontWeight}
            label="Peso de fuente"
            onChange={(e) => {
              setSelectedFontWeight(e.target.value);
              updateComponentStyle(selectedComponentId!, { fontWeight: e.target.value });
            }}
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="bold">Negrita</MenuItem>
            <MenuItem value="lighter">Ligero</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="font-size-select-label">Tamaño de fuente</InputLabel>
          <Select
            labelId="font-size-select-label"
            id="font-size-select"
            value={selectedFontSize}
            label="Tamaño de fuente"
            onChange={(e) => {
              setSelectedFontSize(e.target.value);
              applyFontSize(e.target.value);
            }}
          >
            <MenuItem value="12">12px</MenuItem>
            <MenuItem value="14">14px</MenuItem>
            <MenuItem value="16">16px</MenuItem>
            <MenuItem value="18">18px</MenuItem>
            <MenuItem value="20">20px</MenuItem>
            <MenuItem value="24">24px</MenuItem>
            <MenuItem value="28">28px</MenuItem>
            <MenuItem value="32">32px</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle2" gutterBottom>
          Color de texto
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextColorPicker selectedColor={selectedColor} applyTextColor={applyTextColor} />
        </Box>

        {/* Añadir botones para convertir a lista si es un párrafo */}
        {isParagraphComponent && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Convertir a lista
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:format-list-bulleted" />}
                onClick={() => convertTextToList(selectedComponentId, 'unordered')}
                fullWidth
                size="small"
              >
                Lista con viñetas
              </Button>
              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:format-list-numbered" />}
                onClick={() => convertTextToList(selectedComponentId, 'ordered')}
                fullWidth
                size="small"
              >
                Lista numerada
              </Button>
            </Box>
          </Box>
        )}

        {/* Mostrar opciones de estilo de lista si es un componente de lista */}
        {selectedComponent?.type === 'bulletList' && (
          <ListStyleOptions
            selectedComponentId={selectedComponentId}
            listStyle={listStyle}
            updateListStyle={updateListStyle}
            listColor={listColor}
            updateListColor={updateListColor}
          />
        )}
      </Box>
    );
  };

  // Renderizar las opciones para el diseño
  const renderDesignOptions = () => (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Espaciado
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" display="block" gutterBottom>
          Margen superior
        </Typography>
        <TextField
          type="number"
          size="small"
          fullWidth
          InputProps={{
            inputProps: { min: 0, max: 100 },
            endAdornment: <Typography variant="caption">px</Typography>,
          }}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { marginTop: `${e.target.value}px` });
          }}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" display="block" gutterBottom>
          Margen inferior
        </Typography>
        <TextField
          type="number"
          size="small"
          fullWidth
          InputProps={{
            inputProps: { min: 0, max: 100 },
            endAdornment: <Typography variant="caption">px</Typography>,
          }}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { marginBottom: `${e.target.value}px` });
          }}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" display="block" gutterBottom>
          Relleno
        </Typography>
        <TextField
          type="number"
          size="small"
          fullWidth
          InputProps={{
            inputProps: { min: 0, max: 100 },
            endAdornment: <Typography variant="caption">px</Typography>,
          }}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { padding: `${e.target.value}px` });
          }}
        />
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Bordes
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" display="block" gutterBottom>
          Radio de borde
        </Typography>
        <TextField
          type="number"
          size="small"
          fullWidth
          InputProps={{
            inputProps: { min: 0, max: 50 },
            endAdornment: <Typography variant="caption">px</Typography>,
          }}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { borderRadius: `${e.target.value}px` });
          }}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" display="block" gutterBottom>
          Color de borde
        </Typography>
        <TextField
          type="color"
          size="small"
          fullWidth
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { borderColor: e.target.value });
          }}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" display="block" gutterBottom>
          Ancho de borde
        </Typography>
        <TextField
          type="number"
          size="small"
          fullWidth
          InputProps={{
            inputProps: { min: 0, max: 10 },
            endAdornment: <Typography variant="caption">px</Typography>,
          }}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, {
              borderWidth: `${e.target.value}px`,
              borderStyle: 'solid',
            });
          }}
        />
      </Box>
    </>
  );

  // Renderizar las opciones para el fondo
  const renderBackgroundOptions = () => (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Color de fondo
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {['#FFFFFF', '#F5F5F5', '#EEEEEE', '#E0F7FA', '#E8F5E9', '#FFF8E1', '#FFEBEE'].map(
            (color) => (
              <IconButton
                key={color}
                onClick={() => {
                  updateComponentStyle(selectedComponentId!, { backgroundColor: color });
                }}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: color,
                  border: '1px solid #ddd',
                  '&:hover': { opacity: 0.9 },
                }}
              />
            )
          )}
        </Box>
        <TextField
          type="color"
          fullWidth
          size="small"
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { backgroundColor: e.target.value });
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Fondo del email
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" display="block" gutterBottom>
          Color de fondo
        </Typography>
        <TextField
          type="color"
          fullWidth
          size="small"
          value={emailBackground}
          onChange={(e) => setEmailBackground(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="caption" display="block" gutterBottom>
          Banner predefinido
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {bannerOptions.map((option) => (
            <Box
              key={option.id}
              sx={{
                width: 70,
                height: 70,
                cursor: 'pointer',
                border: selectedBanner === option.id ? '2px solid #3f51b5' : '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundImage: `url(${option.preview})`,
                backgroundSize: 'cover',
                '&:hover': {
                  borderColor: '#3f51b5',
                },
              }}
              onClick={() => setSelectedBanner(option.id)}
            />
          ))}
        </Box>

        <Typography variant="caption" display="block" gutterBottom>
          Gradiente
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Button
            variant={showGradient ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setShowGradient(!showGradient)}
            sx={{ mr: 1 }}
          >
            {showGradient ? 'Desactivar' : 'Activar'}
          </Button>
          {showGradient && (
            <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
              <TextField
                type="color"
                size="small"
                value={gradientColors[0]}
                onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])}
                sx={{ width: '50%' }}
              />
              <TextField
                type="color"
                size="small"
                value={gradientColors[1]}
                onChange={(e) => setGradientColors([gradientColors[0], e.target.value])}
                sx={{ width: '50%' }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );

  // Renderizar las opciones específicas para el componente summary
  const renderSummaryOptions = () => {
    const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
    if (!component) return null;

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
          value={component.props?.label || 'Resumen'}
          onChange={(e) => updateComponentProps(selectedComponentId!, { label: e.target.value })}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle2" gutterBottom>
          Color del borde
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
            {['#4caf50', '#2196f3', '#f44336', '#ff9800', '#9c27b0', '#607d8b', '#000000'].map(
              (color) => (
                <IconButton
                  key={color}
                  onClick={() => updateComponentProps(selectedComponentId!, { borderColor: color })}
                  sx={{
                    width: 36,
                    height: 36,
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
            value={component.props?.borderColor || '#4caf50'}
            onChange={(e) =>
              updateComponentProps(selectedComponentId!, { borderColor: e.target.value })
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
            <Icon icon={component.props?.icon || 'mdi:text-box-outline'} />
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
          value={component.props?.iconColor || '#000000'}
          onChange={(e) =>
            updateComponentProps(selectedComponentId!, { iconColor: e.target.value })
          }
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
          value={component.props?.iconSize || 24}
          onChange={(e) =>
            updateComponentProps(selectedComponentId!, { iconSize: Number(e.target.value) })
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
            value={component.props?.titleColor || '#000000'}
            onChange={(e) =>
              updateComponentProps(selectedComponentId!, { titleColor: e.target.value })
            }
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="font-weight-label">Grosor del título</InputLabel>
            <Select
              labelId="font-weight-label"
              value={component.props?.titleFontWeight || 'normal'}
              label="Grosor del título"
              onChange={(e) =>
                updateComponentProps(selectedComponentId!, { titleFontWeight: e.target.value })
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
              value={component.props?.titleFontFamily || 'inherit'}
              label="Fuente del título"
              onChange={(e) =>
                updateComponentProps(selectedComponentId!, { titleFontFamily: e.target.value })
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
              checked={component.props?.useGradient || false}
              onChange={(e) =>
                updateComponentProps(selectedComponentId!, { useGradient: e.target.checked })
              }
            />
          }
          label="Usar gradiente"
          sx={{ mb: 2 }}
        />

        {component.props?.useGradient ? (
          <>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="gradient-type-label">Tipo de gradiente</InputLabel>
              <Select
                labelId="gradient-type-label"
                value={component.props?.gradientType || 'linear'}
                label="Tipo de gradiente"
                onChange={(e) =>
                  updateComponentProps(selectedComponentId!, { gradientType: e.target.value })
                }
              >
                <MenuItem value="linear">Lineal</MenuItem>
                <MenuItem value="radial">Radial</MenuItem>
              </Select>
            </FormControl>

            {component.props?.gradientType === 'linear' && (
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="gradient-direction-label">Dirección</InputLabel>
                <Select
                  labelId="gradient-direction-label"
                  value={component.props?.gradientDirection || 'to right'}
                  label="Dirección"
                  onChange={(e) =>
                    updateComponentProps(selectedComponentId!, {
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
                value={component.props?.gradientColor1 || '#f5f7fa'}
                onChange={(e) =>
                  updateComponentProps(selectedComponentId!, { gradientColor1: e.target.value })
                }
              />
              <TextField
                type="color"
                fullWidth
                size="small"
                label="Color 2"
                value={component.props?.gradientColor2 || '#c3cfe2'}
                onChange={(e) =>
                  updateComponentProps(selectedComponentId!, { gradientColor2: e.target.value })
                }
              />
            </Box>
          </>
        ) : (
          <TextField
            type="color"
            fullWidth
            size="small"
            label="Color de fondo"
            value={component.props?.backgroundColor || '#f5f7fa'}
            onChange={(e) =>
              updateComponentProps(selectedComponentId!, { backgroundColor: e.target.value })
            }
            sx={{ mb: 2 }}
          />
        )}
      </Box>
    );
  };

  // Renderizar opciones para componentes de categoría
  const renderCategoryOptions = () => {
    if (!selectedComponentId) return null;

    const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
    if (!component || component.type !== 'category') return null;

    const categoryItems = component.props?.items || [component.content];
    const categoryColors = Array.isArray(component.props?.color)
      ? component.props.color
      : [component.props?.color || '#4caf50'];

    // Propiedades de estilo
    const borderRadius = component.props?.borderRadius || 16;
    const padding = component.props?.padding || 4;
    const textColor = component.props?.textColor || 'white';
    const fontWeight = component.props?.fontWeight || 'bold';
    const fontSize = component.props?.fontSize || 14;

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Categorías
        </Typography>

        {categoryItems.map((item, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
            <Typography variant="subtitle2" gutterBottom>
              Categoría {index + 1}
            </Typography>

            <TextField
              fullWidth
              size="small"
              label="Texto"
              value={item}
              onChange={(e) => {
                const newItems = [...categoryItems];
                newItems[index] = e.target.value;
                updateComponentProps(selectedComponentId, { items: newItems });
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              type="color"
              fullWidth
              size="small"
              label="Color de fondo"
              value={categoryColors[index] || '#4caf50'}
              onChange={(e) => {
                const newColors = [...categoryColors];
                newColors[index] = e.target.value;
                updateComponentProps(selectedComponentId, { color: newColors });
              }}
              sx={{ mb: 1 }}
            />
          </Box>
        ))}

        {categoryItems.length < 5 && (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Icon icon="mdi:plus" />}
            onClick={() => {
              const newItems = [...categoryItems, 'Nueva categoría'];
              const newColors = [...categoryColors, '#2196f3'];
              updateComponentProps(selectedComponentId, {
                items: newItems,
                color: newColors,
              });
            }}
            sx={{ mb: 2 }}
          >
            Añadir categoría
          </Button>
        )}

        {categoryItems.length > 1 && (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<Icon icon="mdi:minus" />}
            onClick={() => {
              const newItems = categoryItems.slice(0, -1);
              const newColors = categoryColors.slice(0, -1);
              updateComponentProps(selectedComponentId, {
                items: newItems,
                color: newColors,
              });
            }}
            sx={{ mb: 3 }}
          >
            Eliminar última categoría
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
          Color del texto
        </Typography>
        <TextField
          type="color"
          fullWidth
          size="small"
          value={textColor}
          onChange={(e) =>
            updateComponentProps(selectedComponentId, {
              textColor: e.target.value,
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
  };

  return (
    <Box
      sx={{
        width: 280,
        borderLeft: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="subtitle1" component="div" sx={{ flexGrow: 1 }}>
            Diseño
          </Typography>
        </Toolbar>
      </AppBar>

      <Tabs
        value={rightPanelTab}
        onChange={(e, newValue) => setRightPanelTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab
          label={
            componentType === 'image'
              ? 'Imagen'
              : componentType === 'button'
                ? 'Botón'
                : componentType === 'gallery'
                  ? 'Galería'
                  : componentType === 'summary'
                    ? 'Texto'
                    : componentType === 'category'
                      ? 'Categorías'
                      : 'Tipografía'
          }
        />
        {componentType === 'summary' && <Tab label="Summary" />}
        <Tab label="Diseño" />
        <Tab label="Fondo" />
      </Tabs>

      <Box sx={{ overflow: 'auto' }}>
        {rightPanelTab === 0 && (
          <>
            {componentType === 'image' && renderImageOptions()}
            {componentType === 'gallery' && renderGalleryOptions()}
            {componentType === 'button' && renderButtonOptions()}
            {componentType === 'category' && renderCategoryOptions()}
            {(componentType === 'heading' ||
              componentType === 'paragraph' ||
              componentType === 'bulletList' ||
              componentType === 'summary') &&
              renderTextOptions()}
          </>
        )}

        {rightPanelTab === 1 && componentType === 'summary' && renderSummaryOptions()}
        {rightPanelTab === (componentType === 'summary' ? 2 : 1) && renderDesignOptions()}
        {rightPanelTab === (componentType === 'summary' ? 3 : 2) && renderBackgroundOptions()}
      </Box>
    </Box>
  );
}
