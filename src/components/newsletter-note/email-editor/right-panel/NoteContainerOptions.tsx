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

  // NUEVAS PROPS para newsletter
  isNewsletterMode?: boolean;
  updateNewsletterNoteComponentProps?: (
    noteId: string,
    componentId: string,
    props: Record<string, any>
  ) => void;
  updateNewsletterNoteComponentStyle?: (
    noteId: string,
    componentId: string,
    style: React.CSSProperties
  ) => void;
}

export default function NoteContainerOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
  updateComponentStyle,
  isNewsletterMode = false,
  updateNewsletterNoteComponentProps,
  updateNewsletterNoteComponentStyle,
}: NoteContainerOptionsProps) {
  if (!selectedComponentId) return null;

  const component = findComponentById(getActiveComponents(), selectedComponentId);
  if (!component || component.type !== 'noteContainer') return null;

  const noteTitle = component.props?.noteTitle || 'Nota Inyectada';
  const componentsData = component.props?.componentsData || [];

  // Detectar si este noteContainer está en un newsletter
  // Los noteContainers en newsletters tienen IDs con formato especial
  const isInNewsletter = isNewsletterMode && component.id.includes('-note-');

  // Extraer noteId y componentId real si está en newsletter
  const extractNewsletterInfo = () => {
    if (!isInNewsletter) return null;

    // Formato esperado: "noteId-note-componentId" o similar
    const parts = component.id.split('-note-');
    if (parts.length >= 2) {
      return {
        noteId: parts[0],
        componentId: parts[1],
      };
    }
    return null;
  };

  const newsletterInfo = extractNewsletterInfo();

  // Wrapper para updateComponentProps que usa la función correcta
  const handleUpdateProps = (props: Record<string, any>) => {
    if (newsletterInfo && updateNewsletterNoteComponentProps) {
      console.log('📝 Updating newsletter note props:', {
        noteId: newsletterInfo.noteId,
        componentId: newsletterInfo.componentId,
        props,
      });
      updateNewsletterNoteComponentProps(newsletterInfo.noteId, newsletterInfo.componentId, props);
    } else {
      console.log('📝 Updating regular component props:', {
        componentId: selectedComponentId,
        props,
      });
      updateComponentProps(selectedComponentId!, props);
    }
  };

  // Wrapper para updateComponentStyle que usa la función correcta
  const handleUpdateStyle = (style: React.CSSProperties) => {
    if (newsletterInfo && updateNewsletterNoteComponentStyle) {
      console.log('🎨 Updating newsletter note style:', {
        noteId: newsletterInfo.noteId,
        componentId: newsletterInfo.componentId,
        style,
      });
      updateNewsletterNoteComponentStyle(newsletterInfo.noteId, newsletterInfo.componentId, style);
    } else {
      console.log('🎨 Updating regular component style:', {
        componentId: selectedComponentId,
        style,
      });
      updateComponentStyle(selectedComponentId!, style);
    }
  };

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
          handleUpdateProps({
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
            handleUpdateStyle({
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
          handleUpdateStyle({
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
          handleUpdateStyle({
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
          handleUpdateStyle({
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
            handleUpdateStyle({
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
