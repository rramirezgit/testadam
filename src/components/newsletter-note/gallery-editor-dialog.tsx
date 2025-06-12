'use client';

import type React from 'react';

import { useState, useEffect } from 'react';

import {
  Box,
  Tab,
  Grid,
  Tabs,
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import GallerySelector, { galleryLayouts } from './gallery-selector';

interface GalleryImage {
  src: string;
  alt?: string;
  href?: string;
}

interface GalleryEditorDialogProps {
  open: boolean;
  onClose: () => void;
  initialImages: GalleryImage[];
  initialLayout: string;
  onSave: (images: GalleryImage[], layout: string) => void;
}

export default function GalleryEditorDialog({
  open,
  onClose,
  initialImages,
  initialLayout,
  onSave,
}: GalleryEditorDialogProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages || []);
  const [layout, setLayout] = useState<string>(initialLayout || 'single');
  const [activeTab, setActiveTab] = useState(0);

  // Encontrar el layout seleccionado
  const selectedLayoutOption = galleryLayouts.find((l) => l.id === layout) || galleryLayouts[0];

  // Determinar cuántas imágenes necesitamos para el layout actual
  const requiredImages = (selectedLayoutOption as any).imageCount;

  // Asegurar que tenemos suficientes imágenes para el layout
  const ensureImages = () => {
    const newImages = [...images];
    while (newImages.length < requiredImages) {
      newImages.push({ src: '/placeholder.svg', alt: `Image ${newImages.length + 1}` });
    }
    setImages(newImages);
  };

  // Actualizar cuando cambia el layout
  useEffect(() => {
    ensureImages();
  }, [layout]);

  const handleSave = () => {
    // Limitar al número necesario de imágenes para el layout
    const finalImages = images.slice(0, requiredImages).map((img) => ({
      ...img,
      src: img.src || '/placeholder.svg', // Asegurarnos de que siempre haya una URL
    }));
    onSave(finalImages, layout);
    onClose();
  };

  const updateImage = (index: number, field: keyof GalleryImage, value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Renderizar la vista previa según el layout
  const renderPreview = () => {
    if (layout === 'single') {
      return (
        <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: '4px' }}>
          <img
            src={images[0]?.src || '/placeholder.svg'}
            alt={images[0]?.alt || 'Preview'}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Box>
      );
    }

    if (layout === 'double') {
      return (
        <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: '4px' }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <img
                src={images[0]?.src || '/placeholder.svg'}
                alt={images[0]?.alt || 'Preview'}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <img
                src={images[1]?.src || '/placeholder.svg'}
                alt={images[1]?.alt || 'Preview'}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
        </Box>
      );
    }

    if (layout === 'feature') {
      return (
        <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: '4px' }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <Grid container direction="column" spacing={1}>
                <Grid size={{ xs: 1 }}>
                  <img
                    src={images[0]?.src || '/placeholder.svg'}
                    alt={images[0]?.alt || 'Preview'}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <img
                    src={images[1]?.src || '/placeholder.svg'}
                    alt={images[1]?.alt || 'Preview'}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <img
                src={images[2]?.src || '/placeholder.svg'}
                alt={images[2]?.alt || 'Preview'}
                style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
              />
            </Grid>
          </Grid>
        </Box>
      );
    }

    if (layout === 'masonry') {
      return (
        <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: '4px' }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <img
                src={images[0]?.src || '/placeholder.svg'}
                alt={images[0]?.alt || 'Preview'}
                style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Grid container direction="column" spacing={1}>
                <Grid size={{ xs: 1 }}>
                  <img
                    src={images[1]?.src || '/placeholder.svg'}
                    alt={images[1]?.alt || 'Preview'}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <img
                    src={images[2]?.src || '/placeholder.svg'}
                    alt={images[2]?.alt || 'Preview'}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      );
    }

    if (layout === 'hero') {
      return (
        <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: '4px' }}>
          <Grid container direction="column" spacing={1}>
            <Grid size={{ xs: 1 }}>
              <img
                src={images[0]?.src || '/placeholder.svg'}
                alt={images[0]?.alt || 'Preview'}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid size={{ xs: 1 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <img
                    src={images[1]?.src || '/placeholder.svg'}
                    alt={images[1]?.alt || 'Preview'}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <img
                    src={images[2]?.src || '/placeholder.svg'}
                    alt={images[2]?.alt || 'Preview'}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      );
    }

    if (layout === 'grid') {
      return (
        <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: '4px' }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <img
                src={images[0]?.src || '/placeholder.svg'}
                alt={images[0]?.alt || 'Preview'}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <img
                src={images[1]?.src || '/placeholder.svg'}
                alt={images[1]?.alt || 'Preview'}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <img
                src={images[2]?.src || '/placeholder.svg'}
                alt={images[2]?.alt || 'Preview'}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <img
                src={images[3]?.src || '/placeholder.svg'}
                alt={images[3]?.alt || 'Preview'}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Grid>
          </Grid>
        </Box>
      );
    }

    return null;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editor de Galería</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <GallerySelector selectedLayout={layout} onSelectLayout={setLayout} />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="gallery tabs">
              <Tab label="Imágenes" />
              <Tab label="Vista Previa" />
            </Tabs>

            {activeTab === 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Configurar Imágenes ({requiredImages} necesarias)
                </Typography>
                {images.slice(0, requiredImages).map((image, index) => (
                  <Box
                    key={index}
                    sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: '8px' }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Imagen {index + 1}
                    </Typography>
                    <TextField
                      fullWidth
                      label="URL de la imagen"
                      value={image.src}
                      onChange={(e) => updateImage(index, 'src', e.target.value)}
                      margin="dense"
                    />
                    <TextField
                      fullWidth
                      label="Texto alternativo"
                      value={image.alt || ''}
                      onChange={(e) => updateImage(index, 'alt', e.target.value)}
                      margin="dense"
                    />
                    <TextField
                      fullWidth
                      label="Enlace (opcional)"
                      value={image.href || ''}
                      onChange={(e) => updateImage(index, 'href', e.target.value)}
                      margin="dense"
                      helperText="Deja en blanco si no quieres que la imagen sea un enlace"
                    />
                  </Box>
                ))}
              </Box>
            )}

            {activeTab === 1 && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  minHeight: '300px',
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Vista Previa
                </Typography>
                {renderPreview()}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar Galería
        </Button>
      </DialogActions>
    </Dialog>
  );
}
