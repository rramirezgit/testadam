import { Box, TextField, Typography } from '@mui/material';

import type { DesignOptionsProps } from './types';

const DesignOptions = ({ selectedComponentId, updateComponentStyle }: DesignOptionsProps) => (
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

export default DesignOptions;
