'use client';

import type React from 'react';

import { useState } from 'react';

import { Box, Tab, Tabs, Grid, Button, Typography } from '@mui/material';

import ColorPicker from '../../color-picker';
import BannerSelector from '../../banner-selector';
import { galleryLayouts } from '../../gallery-selector';
import useNewsletterEditor from '../hooks/use-newsletter-editor';
import { bannerOptions } from '../../email-editor/data/banner-options';

export default function DesignTab() {
  const {
    newsletter,
    selectedComponent,
    updateNewsletter,
    updateComponent,
    openHeaderDialog,
    openFooterDialog,
    openBannerDialog,
  } = useNewsletterEditor();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleGalleryLayoutChange = (layout: string) => {
    if (selectedComponent && selectedComponent.type === 'gallery') {
      updateComponent({
        ...selectedComponent,
        layout,
      });
    }
  };

  const renderGalleryOptions = () => {
    if (!selectedComponent || selectedComponent.type !== 'gallery') return null;

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Diseño
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Tipo de layout
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {galleryLayouts.map((layout) => (
            <Grid item xs={12} sm={6} key={layout.id}>
              <Button
                variant={selectedComponent.layout === layout.id ? 'contained' : 'outlined'}
                fullWidth
                onClick={() => handleGalleryLayoutChange(layout.id)}
                sx={{
                  justifyContent: 'center',
                  height: '48px',
                  textTransform: 'none',
                }}
              >
                {layout.name}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Typography variant="subtitle2" gutterBottom>
          Imágenes de la galería
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => {
            // Esta funcionalidad se maneja en el componente padre
          }}
          sx={{ mb: 2 }}
        >
          Editar imágenes
        </Button>
      </Box>
    );
  };

  const renderBackgroundOptions = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Fondo
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Color de fondo
      </Typography>
      <ColorPicker
        color={newsletter.backgroundColor || '#ffffff'}
        onChange={(color) => updateNewsletter({ backgroundColor: color })}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Banner
      </Typography>
      <BannerSelector
        options={bannerOptions}
        selectedBanner={newsletter.banner || null}
        onSelect={(bannerId) => updateNewsletter({ banner: bannerId })}
      />
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={openBannerDialog}
        sx={{ mt: 2 }}
      >
        Personalizar banner
      </Button>
    </Box>
  );

  const renderGeneralOptions = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Diseño
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={openHeaderDialog}
        sx={{ mb: 2 }}
      >
        Editar encabezado
      </Button>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={openFooterDialog}
        sx={{ mb: 2 }}
      >
        Editar pie de página
      </Button>
    </Box>
  );

  const ImageDesignOptions = ({ component, onUpdate }) => {
    const [imageData, setImageData] = useState({
      alt: component.data.alt || '',
      width: component.data.width || '100%',
    });

    const handleSaveImage = () => {
      alert('Imagen guardada en formato base64');
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setImageData((prev) => ({ ...prev, [name]: value }));
      onUpdate({ ...component.data, [name]: value });
    };

    return (
      <div className="image-design-options">
        <div className="form-group">
          <label htmlFor="alt">Texto alternativo</label>
          <input
            type="text"
            id="alt"
            name="alt"
            value={imageData.alt}
            onChange={handleChange}
            placeholder="Describe la imagen"
          />
        </div>

        <div className="form-group">
          <label htmlFor="width">Ancho</label>
          <input
            type="text"
            id="width"
            name="width"
            value={imageData.width}
            onChange={handleChange}
            placeholder="100%, 300px, etc."
          />
        </div>

        <div className="form-group">
          <button
            className="save-image-button"
            onClick={handleSaveImage}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Guardar Imagen
          </button>
        </div>
      </div>
    );
  };

  const renderComponentOptions = (selectedComponent, handleComponentUpdate) => {
    if (!selectedComponent) return null;

    switch (selectedComponent.type) {
      case 'image':
        return (
          <ImageDesignOptions component={selectedComponent} onUpdate={handleComponentUpdate} />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="design tabs" sx={{ mb: 2 }}>
        <Tab
          label="GALERÍA"
          disabled={!selectedComponent || selectedComponent.type !== 'gallery'}
        />
        <Tab label="DISEÑO" />
        <Tab label="FONDO" />
      </Tabs>

      {activeTab === 0 && renderGalleryOptions()}
      {activeTab === 1 && renderGeneralOptions()}
      {activeTab === 2 && renderBackgroundOptions()}
    </Box>
  );
}
