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
  Toolbar,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

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
}

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
        URL de la imagen
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="URL de la imagen"
        value={selectedComponent.props?.src || ''}
        onChange={(e) => updateComponentProps(selectedComponentId!, { src: e.target.value })}
        sx={{ mb: 3 }}
      />

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
                item
                xs={layout === 'single' ? 12 : 6}
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
  const renderTextOptions = () => (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Formato de texto
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => applyTextFormat('bold')}
          color={textFormat.includes('bold') ? 'primary' : 'default'}
          sx={{ border: textFormat.includes('bold') ? '1px solid' : 'none' }}
        >
          <Icon icon="mdi:format-bold" />
        </IconButton>
        <IconButton
          onClick={() => applyTextFormat('italic')}
          color={textFormat.includes('italic') ? 'primary' : 'default'}
          sx={{ border: textFormat.includes('italic') ? '1px solid' : 'none' }}
        >
          <Icon icon="mdi:format-italic" />
        </IconButton>
        <IconButton
          onClick={() => applyTextFormat('underlined')}
          color={textFormat.includes('underlined') ? 'primary' : 'default'}
          sx={{ border: textFormat.includes('underlined') ? '1px solid' : 'none' }}
        >
          <Icon icon="mdi:format-underline" />
        </IconButton>
        <IconButton
          onClick={() => applyTextFormat('strikethrough')}
          color={textFormat.includes('strikethrough') ? 'primary' : 'default'}
          sx={{ border: textFormat.includes('strikethrough') ? '1px solid' : 'none' }}
        >
          <Icon icon="mdi:format-strikethrough" />
        </IconButton>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Alineación
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => applyTextAlignment('left')}
          color={selectedAlignment === 'left' ? 'primary' : 'default'}
          sx={{ border: selectedAlignment === 'left' ? '1px solid' : 'none' }}
        >
          <Icon icon="mdi:format-align-left" />
        </IconButton>
        <IconButton
          onClick={() => applyTextAlignment('center')}
          color={selectedAlignment === 'center' ? 'primary' : 'default'}
          sx={{ border: selectedAlignment === 'center' ? '1px solid' : 'none' }}
        >
          <Icon icon="mdi:format-align-center" />
        </IconButton>
        <IconButton
          onClick={() => applyTextAlignment('right')}
          color={selectedAlignment === 'right' ? 'primary' : 'default'}
          sx={{ border: selectedAlignment === 'right' ? '1px solid' : 'none' }}
        >
          <Icon icon="mdi:format-align-right" />
        </IconButton>
        <IconButton
          onClick={() => applyTextAlignment('justify')}
          color={selectedAlignment === 'justify' ? 'primary' : 'default'}
          sx={{ border: selectedAlignment === 'justify' ? '1px solid' : 'none' }}
        >
          <Icon icon="mdi:format-align-justify" />
        </IconButton>
      </Box>

      {componentType === 'heading' && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Nivel de título
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Button
              variant={selectedComponent.props?.level === 1 ? 'contained' : 'outlined'}
              size="small"
              onClick={() => updateComponentProps(selectedComponentId!, { level: 1 })}
              sx={{ mr: 1 }}
            >
              H1
            </Button>
            <Button
              variant={selectedComponent.props?.level === 2 ? 'contained' : 'outlined'}
              size="small"
              onClick={() => updateComponentProps(selectedComponentId!, { level: 2 })}
              sx={{ mr: 1 }}
            >
              H2
            </Button>
            <Button
              variant={selectedComponent.props?.level === 3 ? 'contained' : 'outlined'}
              size="small"
              onClick={() => updateComponentProps(selectedComponentId!, { level: 3 })}
            >
              H3
            </Button>
          </Box>
        </>
      )}

      <Typography variant="subtitle2" gutterBottom>
        Fuente
      </Typography>
      <TextField
        select
        fullWidth
        size="small"
        value={selectedFont}
        onChange={(e) => {
          setSelectedFont(e.target.value);
          applyFontFamily(e.target.value);
        }}
        sx={{ mb: 2 }}
      >
        <option value="Public Sans">Public Sans</option>
        <option value="Arial">Arial</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
      </TextField>

      <Typography variant="subtitle2" gutterBottom>
        Tamaño de fuente
      </Typography>
      <TextField
        select
        fullWidth
        size="small"
        value={selectedFontSize}
        onChange={(e) => {
          setSelectedFontSize(e.target.value);
          applyFontSize(e.target.value);
        }}
        sx={{ mb: 2 }}
      >
        <option value="12">12px</option>
        <option value="14">14px</option>
        <option value="16">16px</option>
        <option value="18">18px</option>
        <option value="20">20px</option>
        <option value="24">24px</option>
        <option value="28">28px</option>
        <option value="32">32px</option>
      </TextField>

      <Typography variant="subtitle2" gutterBottom>
        Color de texto
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          {[
            '#000000',
            '#4285F4',
            '#34A853',
            '#FBBC05',
            '#EA4335',
            '#9C27B0',
            '#2196F3',
            '#FF9800',
          ].map((color) => (
            <IconButton
              key={color}
              onClick={() => {
                setSelectedColor(color);
                applyTextColor(color);
              }}
              sx={{
                width: 36,
                height: 36,
                backgroundColor: color,
                border: selectedColor === color ? '2px solid #000' : '1px solid #ddd',
                '&:hover': { backgroundColor: color, opacity: 0.9 },
              }}
            />
          ))}
        </Box>
        <TextField
          type="color"
          fullWidth
          size="small"
          value={selectedColor}
          onChange={(e) => {
            setSelectedColor(e.target.value);
            applyTextColor(e.target.value);
          }}
        />
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Peso de fuente
      </Typography>
      <TextField
        select
        fullWidth
        size="small"
        value={selectedFontWeight}
        onChange={(e) => {
          setSelectedFontWeight(e.target.value);
          updateComponentStyle(selectedComponentId!, { fontWeight: e.target.value });
        }}
        sx={{ mb: 2 }}
      >
        <option value="normal">Normal</option>
        <option value="bold">Negrita</option>
        <option value="lighter">Ligero</option>
      </TextField>
    </>
  );

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
        variant="fullWidth"
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
                  : 'Tipografía'
          }
        />
        <Tab label="Diseño" />
        <Tab label="Fondo" />
      </Tabs>

      <Box sx={{ p: 2, overflow: 'auto' }}>
        {rightPanelTab === 0 && (
          <>
            {componentType === 'image' && renderImageOptions()}
            {componentType === 'gallery' && renderGalleryOptions()}
            {componentType === 'button' && renderButtonOptions()}
            {(componentType === 'heading' ||
              componentType === 'paragraph' ||
              componentType === 'bulletList' ||
              componentType === 'summary') &&
              renderTextOptions()}
          </>
        )}

        {rightPanelTab === 1 && renderDesignOptions()}
        {rightPanelTab === 2 && renderBackgroundOptions()}
      </Box>
    </Box>
  );
}
