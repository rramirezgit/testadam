import { Box, Select, MenuItem, InputLabel, Typography, FormControl } from '@mui/material';

import TextColorPicker from '../color-picker/TextColorPicker';

import type { ListStyleOptionsProps } from './types';

const ListStyleOptions = ({
  selectedComponentId,
  listStyle,
  updateListStyle,
  listColor,
  updateListColor,
}: ListStyleOptionsProps) => {
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

export default ListStyleOptions;
