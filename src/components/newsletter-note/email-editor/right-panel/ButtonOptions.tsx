import { Box, Button, TextField, IconButton, Typography } from '@mui/material';

import type { ButtonOptionsProps } from './types';

const ButtonOptions = ({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
  updateComponentStyle,
  updateComponentContent,
}: ButtonOptionsProps) => (
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

export default ButtonOptions;
