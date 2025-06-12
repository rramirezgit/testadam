import {
  Box,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import type { DividerOptionsProps } from './types';

const DividerOptions = ({ selectedComponentId, updateComponentStyle }: DividerOptionsProps) => (
  <>
    <Typography variant="subtitle2" gutterBottom>
      Estilo de separador
    </Typography>
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Tipo de línea</InputLabel>
        <Select
          label="Tipo de línea"
          defaultValue="solid"
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, { borderStyle: e.target.value });
          }}
        >
          <MenuItem value="solid">Sólida</MenuItem>
          <MenuItem value="dashed">Guiones</MenuItem>
          <MenuItem value="dotted">Punteada</MenuItem>
          <MenuItem value="double">Doble</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="caption" display="block" gutterBottom>
        Color
      </Typography>
      <TextField
        type="color"
        fullWidth
        size="small"
        defaultValue="#DDDDDD"
        onChange={(e) => {
          updateComponentStyle(selectedComponentId!, { borderColor: e.target.value });
        }}
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" display="block" gutterBottom>
        Grosor (px)
      </Typography>
      <TextField
        type="number"
        fullWidth
        size="small"
        defaultValue={1}
        InputProps={{ inputProps: { min: 1, max: 10 } }}
        onChange={(e) => {
          updateComponentStyle(selectedComponentId!, { borderWidth: `${e.target.value}px` });
        }}
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" display="block" gutterBottom>
        Ancho (%)
      </Typography>
      <TextField
        type="number"
        fullWidth
        size="small"
        defaultValue={100}
        InputProps={{ inputProps: { min: 10, max: 100 } }}
        onChange={(e) => {
          updateComponentStyle(selectedComponentId!, { width: `${e.target.value}%` });
        }}
        sx={{ mb: 2 }}
      />

      <Typography variant="caption" display="block" gutterBottom>
        Alineación
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <Select
          defaultValue="center"
          onChange={(e) => {
            updateComponentStyle(selectedComponentId!, {
              margin:
                e.target.value === 'left'
                  ? '0 auto 0 0'
                  : e.target.value === 'right'
                    ? '0 0 0 auto'
                    : '0 auto',
            });
          }}
        >
          <MenuItem value="left">Izquierda</MenuItem>
          <MenuItem value="center">Centro</MenuItem>
          <MenuItem value="right">Derecha</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </>
);

export default DividerOptions;
