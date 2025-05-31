import { Box, Grid, Paper, Button, TextField, Typography } from '@mui/material';

import type { GalleryOptionsProps } from './types';

const GalleryOptions = ({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
  updateComponentStyle,
}: GalleryOptionsProps) => {
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
            <Grid item key={index} xs={12}>
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

export default GalleryOptions;
