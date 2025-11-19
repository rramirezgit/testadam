import {
  Box,
  Button,
  Select,
  Slider,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  FormControl,
} from '@mui/material';

import GeneralColorPicker from '../../general-color-picker';
import { findComponentById } from '../utils/componentHelpers';

interface NoteContainerOptionsProps {
  selectedComponentId: string | null;
  getActiveComponents: () => any[];
  updateComponentProps: (
    id: string,
    props: Record<string, any>,
    options?: { content?: string }
  ) => void;
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

      // También actualizar props para que los cambios persistan
      if (updateNewsletterNoteComponentProps) {
        updateNewsletterNoteComponentProps(newsletterInfo.noteId, newsletterInfo.componentId, {
          ...component.props,
          containerBorderWidth: style.borderWidth,
          containerBorderColor: style.borderColor,
          containerBorderRadius: style.borderRadius,
          containerPadding: style.padding,
        });
      }
    } else {
      console.log('🎨 Updating regular component style:', {
        componentId: selectedComponentId,
        style,
      });
      updateComponentStyle(selectedComponentId!, style);

      // También actualizar props para componentes regulares
      updateComponentProps(selectedComponentId!, {
        ...component.props,
        containerBorderWidth: style.borderWidth,
        containerBorderColor: style.borderColor,
        containerBorderRadius: style.borderRadius,
        containerPadding: style.padding,
      });
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

      {/* Grosor del borde */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Grosor del borde
        </Typography>
        <Slider
          value={parseInt(
            (component.props?.containerBorderWidth || component.style?.borderWidth)
              ?.toString()
              .replace('px', '') || '2'
          )}
          onChange={(_, newValue) => {
            handleUpdateStyle({
              ...component.style,
              borderWidth: `${newValue}px`,
            });
          }}
          min={0}
          max={10}
          step={1}
          marks
          valueLabelDisplay="auto"
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          {parseInt(
            (component.props?.containerBorderWidth || component.style?.borderWidth)
              ?.toString()
              .replace('px', '') || '2'
          )}
          px
        </Typography>
      </Box>

      {/* Color del borde */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Color del borde
        </Typography>
        <GeneralColorPicker
          selectedColor={
            component.props?.containerBorderColor || component.style?.borderColor || '#e0e0e0'
          }
          onChange={(newColor) => {
            handleUpdateStyle({
              ...component.style,
              borderColor: newColor,
            });
          }}
          label=""
          size="small"
        />
      </Box>

      {/* Radio del borde */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Radio del borde
        </Typography>
        <Slider
          value={parseInt(
            (component.props?.containerBorderRadius || component.style?.borderRadius)
              ?.toString()
              .replace('px', '') || '12'
          )}
          onChange={(_, newValue) => {
            handleUpdateStyle({
              ...component.style,
              borderRadius: `${newValue}px`,
            });
          }}
          min={0}
          max={50}
          step={1}
          marks={[
            { value: 0, label: '0' },
            { value: 12, label: '12' },
            { value: 24, label: '24' },
            { value: 50, label: '50' },
          ]}
          valueLabelDisplay="auto"
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          {parseInt(
            (component.props?.containerBorderRadius || component.style?.borderRadius)
              ?.toString()
              .replace('px', '') || '12'
          )}
          px
        </Typography>
      </Box>

      {/* Padding interno */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
          Espaciado interno
        </Typography>
        <Slider
          value={parseInt(
            (component.props?.containerPadding || component.style?.padding)
              ?.toString()
              .replace('px', '') || '20'
          )}
          onChange={(_, newValue) => {
            handleUpdateStyle({
              ...component.style,
              padding: `${newValue}px`,
            });
          }}
          min={0}
          max={50}
          step={1}
          marks={[
            { value: 0, label: '0' },
            { value: 10, label: '10' },
            { value: 20, label: '20' },
            { value: 30, label: '30' },
            { value: 50, label: '50' },
          ]}
          valueLabelDisplay="auto"
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" color="text.secondary">
          {parseInt(
            (component.props?.containerPadding || component.style?.padding)
              ?.toString()
              .replace('px', '') || '20'
          )}
          px
        </Typography>
      </Box>

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

      {/* Presets de estilos */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
          Estilos predefinidos
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              handleUpdateStyle({
                ...component.style,
                borderWidth: '1px',
                borderColor: '#e0e0e0',
                borderRadius: '12px',
                padding: '10px',
              });
            }}
          >
            Predeterminado
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              handleUpdateStyle({
                ...component.style,
                borderWidth: '2px',
                borderColor: '#1976d2',
                borderRadius: '8px',
                padding: '20px',
              });
            }}
          >
            Moderno
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              handleUpdateStyle({
                ...component.style,
                borderWidth: '0px',
                borderColor: 'transparent',
                borderRadius: '0px',
                padding: '0px',
              });
            }}
          >
            Sin borde
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
