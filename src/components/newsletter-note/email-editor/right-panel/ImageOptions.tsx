import { Icon } from '@iconify/react';

import { Box, Button, TextField, Typography } from '@mui/material';

import type { ImageOptionsProps } from './types';

const ImageOptions = ({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
}: ImageOptionsProps) => (
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

export default ImageOptions;
