import { Icon } from '@iconify/react';

import { Box, Button, TextField, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

const GalleryComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <ComponentWithToolbar
      isSelected={isSelected}
      index={index}
      totalComponents={totalComponents}
      componentId={component.id}
      moveComponent={moveComponent}
      removeComponent={removeComponent}
      onClick={handleClick}
    >
      <Box sx={{ textAlign: 'center', mb: 2, ...(component.style || {}) }}>
        <Typography variant="subtitle2" gutterBottom>
          Galería de imágenes -{' '}
          {component.props?.layout === 'single'
            ? 'Una imagen'
            : component.props?.layout === 'double'
              ? 'Dos imágenes'
              : component.props?.layout === 'feature'
                ? 'Tres imágenes (Destacada)'
                : component.props?.layout === 'masonry'
                  ? 'Tres imágenes (Mosaico)'
                  : component.props?.layout === 'hero'
                    ? 'Tres imágenes (Hero)'
                    : 'Cuadrícula (4 imágenes)'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          {(component.props?.images || [])
            .slice(
              0,
              component.props?.layout === 'single'
                ? 1
                : component.props?.layout === 'double'
                  ? 2
                  : component.props?.layout === 'grid'
                    ? 4
                    : 3
            )
            .map((img, idx) => (
              <img
                key={idx}
                src={img?.src || '/placeholder.svg'}
                alt={img?.alt || `Gallery image ${idx + 1}`}
                style={{
                  maxWidth:
                    component.props?.layout === 'single'
                      ? '100%'
                      : component.props?.layout === 'double'
                        ? '48%'
                        : component.props?.layout === 'grid'
                          ? '48%'
                          : component.props?.layout === 'feature' && idx < 2
                            ? '30%'
                            : component.props?.layout === 'feature' && idx === 2
                              ? '65%'
                              : component.props?.layout === 'masonry' && idx === 0
                                ? '65%'
                                : component.props?.layout === 'masonry' && idx > 0
                                  ? '30%'
                                  : component.props?.layout === 'hero' && idx === 0
                                    ? '100%'
                                    : '48%',
                  height: 'auto',
                  margin: '0 auto',
                  borderRadius: '8px',
                }}
              />
            ))}
        </Box>
        {isSelected && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" display="block" gutterBottom>
              Tipo de layout
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={component.props?.layout || 'single'}
              onChange={(e) => updateComponentProps(component.id, { layout: e.target.value })}
              sx={{ mb: 2 }}
            >
              <option value="single">Una imagen</option>
              <option value="double">Dos imágenes</option>
              <option value="grid">Cuadrícula (4 imágenes)</option>
              <option value="feature">Tres imágenes (Destacada)</option>
              <option value="masonry">Tres imágenes (Mosaico)</option>
              <option value="hero">Tres imágenes (Hero)</option>
            </TextField>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Icon icon="mdi:pencil" />}
              onClick={(e) => {
                e.stopPropagation();
                // Aquí iría la lógica para editar las imágenes de la galería
              }}
            >
              Editar imágenes
            </Button>
          </Box>
        )}
      </Box>
    </ComponentWithToolbar>
  );
};

export default GalleryComponent;
