import {
  Box,
  Select,
  Divider,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import { findComponentById } from '../utils/componentHelpers';

interface NoteContainerOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => any[];
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

export default function NoteContainerOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
  updateComponentStyle,
}: NoteContainerOptionsProps) {
  if (!selectedComponentId) return null;

  const component = findComponentById(getActiveComponents(), selectedComponentId);
  if (!component || component.type !== 'noteContainer') return null;

  const noteTitle = component.props?.noteTitle || 'Nota Inyectada';
  const componentsData = component.props?.componentsData || [];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configuración de Nota
      </Typography>

      <TextField
        fullWidth
        label="Título de la nota"
        value={noteTitle}
        onChange={(e) => {
          updateComponentProps(selectedComponentId, {
            ...component.props,
            noteTitle: e.target.value,
          });
        }}
        sx={{ mb: 2 }}
        helperText="Título que aparecerá en el header de la nota"
      />

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Información de la nota
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Componentes contenidos: {componentsData.length}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID del contenedor: {component.id}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Estilos del contenedor
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Color del borde</InputLabel>
        <Select
          label="Color del borde"
          value={component.style?.borderColor || '#e0e0e0'}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId, {
              ...component.style,
              borderColor: e.target.value,
            });
          }}
        >
          <MenuItem value="#e0e0e0">Gris claro</MenuItem>
          <MenuItem value="#1976d2">Azul</MenuItem>
          <MenuItem value="#2e7d32">Verde</MenuItem>
          <MenuItem value="#ed6c02">Naranja</MenuItem>
          <MenuItem value="#d32f2f">Rojo</MenuItem>
          <MenuItem value="#9c27b0">Púrpura</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        size="small"
        label="Grosor del borde (px)"
        type="number"
        value={component.style?.borderWidth?.toString().replace('px', '') || '2'}
        onChange={(e) => {
          updateComponentStyle(selectedComponentId, {
            ...component.style,
            borderWidth: `${e.target.value}px`,
          });
        }}
        sx={{ mb: 2 }}
        InputProps={{ inputProps: { min: 1, max: 10 } }}
      />

      <TextField
        fullWidth
        size="small"
        label="Radio del borde (px)"
        type="number"
        value={component.style?.borderRadius?.toString().replace('px', '') || '12'}
        onChange={(e) => {
          updateComponentStyle(selectedComponentId, {
            ...component.style,
            borderRadius: `${e.target.value}px`,
          });
        }}
        sx={{ mb: 2 }}
        InputProps={{ inputProps: { min: 0, max: 50 } }}
      />

      <TextField
        fullWidth
        size="small"
        label="Padding interno (px)"
        type="number"
        value={component.style?.padding?.toString().replace('px', '') || '20'}
        onChange={(e) => {
          updateComponentStyle(selectedComponentId, {
            ...component.style,
            padding: `${e.target.value}px`,
          });
        }}
        sx={{ mb: 2 }}
        InputProps={{ inputProps: { min: 0, max: 100 } }}
      />

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Color de fondo</InputLabel>
        <Select
          label="Color de fondo"
          value={component.style?.backgroundColor || '#ffffff'}
          onChange={(e) => {
            updateComponentStyle(selectedComponentId, {
              ...component.style,
              backgroundColor: e.target.value,
            });
          }}
        >
          <MenuItem value="#ffffff">Blanco</MenuItem>
          <MenuItem value="#f8f9fa">Gris muy claro</MenuItem>
          <MenuItem value="#e3f2fd">Azul muy claro</MenuItem>
          <MenuItem value="#f3e5f5">Púrpura muy claro</MenuItem>
          <MenuItem value="#e8f5e8">Verde muy claro</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
