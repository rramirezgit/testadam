import { Icon } from '@iconify/react';

import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import ListStyleOptions from './ListStyleOptions';
import TextColorPicker from '../color-picker/TextColorPicker';

import type { TextOptionsProps } from './types';

const TextOptions = ({
  componentType,
  selectedComponent,
  selectedComponentId,
  hasTextSelection,
  textFormat,
  applyTextFormat,
  selectedAlignment,
  setSelectedAlignment,
  applyTextAlignment,
  selectedFont,
  setSelectedFont,
  applyFontFamily,
  selectedFontWeight,
  setSelectedFontWeight,
  selectedFontSize,
  setSelectedFontSize,
  applyFontSize,
  selectedColor,
  applyTextColor,
  updateComponentStyle,
  convertTextToList,
  listStyle,
  updateListStyle,
  listColor,
  updateListColor,
  updateComponentProps,
}: TextOptionsProps) => {
  // Verificar si el componente seleccionado es un párrafo
  const isParagraphComponent = selectedComponent?.type === 'paragraph';

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
        <ToggleButtonGroup
          value={textFormat}
          onChange={(event, newFormats) => {
            // Verificar si es un array y tiene al menos un elemento
            const clickedFormat = (event.currentTarget as HTMLButtonElement).value;

            // Aplicar el formato
            applyTextFormat(clickedFormat);
          }}
          aria-label="text formatting"
          color="primary"
          disabled={!hasTextSelection} // Desactivar si no hay texto seleccionado
          sx={{
            border: 'none',
          }}
        >
          <ToggleButton value="bold" aria-label="bold" selected={textFormat.includes('bold')}>
            <Icon icon="mdi:format-bold" />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic" selected={textFormat.includes('italic')}>
            <Icon icon="mdi:format-italic" />
          </ToggleButton>
          <ToggleButton
            value="underlined"
            aria-label="underlined"
            selected={textFormat.includes('underlined')}
          >
            <Icon icon="mdi:format-underline" />
          </ToggleButton>
          <ToggleButton
            value="strikethrough"
            aria-label="strikethrough"
            selected={textFormat.includes('strikethrough')}
          >
            <Icon icon="mdi:format-strikethrough" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <ToggleButtonGroup
          value={selectedAlignment}
          exclusive
          color="primary"
          sx={{
            border: 'none',
          }}
          onChange={(event, newAlignment) => {
            if (newAlignment !== null) {
              setSelectedAlignment(newAlignment);
              applyTextAlignment(newAlignment);
            }
          }}
          aria-label="text alignment"
        >
          <ToggleButton
            value="left"
            aria-label="left aligned"
            selected={selectedAlignment === 'left'}
          >
            <Icon icon="mdi:format-align-left" />
          </ToggleButton>
          <ToggleButton
            value="center"
            aria-label="center aligned"
            selected={selectedAlignment === 'center'}
          >
            <Icon icon="mdi:format-align-center" />
          </ToggleButton>
          <ToggleButton
            value="right"
            aria-label="right aligned"
            selected={selectedAlignment === 'right'}
          >
            <Icon icon="mdi:format-align-right" />
          </ToggleButton>
          <ToggleButton
            value="justify"
            aria-label="justified"
            selected={selectedAlignment === 'justify'}
          >
            <Icon icon="mdi:format-align-justify" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {componentType === 'heading' && (
        <ToggleButtonGroup
          value={selectedComponent?.props?.level}
          exclusive
          color="primary"
          onChange={(event, newLevel) =>
            updateComponentProps(selectedComponentId!, { level: newLevel })
          }
          aria-label="Nivel de título"
          sx={{ mb: 3, border: 'none' }}
        >
          <ToggleButton value={1} aria-label="H1">
            H1
          </ToggleButton>
          <ToggleButton value={2} aria-label="H2">
            H2
          </ToggleButton>
          <ToggleButton value={3} aria-label="H3">
            H3
          </ToggleButton>
        </ToggleButtonGroup>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="font-family-select-label">Fuente</InputLabel>
        <Select
          labelId="font-family-select-label"
          id="font-family-select"
          value={selectedFont}
          label="Fuente"
          onChange={(e) => {
            setSelectedFont(e.target.value);
            applyFontFamily(e.target.value);
          }}
        >
          <MenuItem value="Public Sans">Public Sans</MenuItem>
          <MenuItem value="Arial">Arial</MenuItem>
          <MenuItem value="Helvetica">Helvetica</MenuItem>
          <MenuItem value="Times New Roman">Times New Roman</MenuItem>
          <MenuItem value="Georgia">Georgia</MenuItem>
          <MenuItem value="Courier New">Courier New</MenuItem>
          <MenuItem value="Verdana">Verdana</MenuItem>
          <MenuItem value="Tahoma">Tahoma</MenuItem>
          <MenuItem value="Trebuchet MS">Trebuchet MS</MenuItem>
          <MenuItem value="Palatino">Palatino</MenuItem>
          <MenuItem value="Bookman">Bookman</MenuItem>
          <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="font-weight-select-label">Peso de fuente</InputLabel>
        <Select
          labelId="font-weight-select-label"
          id="font-weight-select"
          value={selectedFontWeight}
          label="Peso de fuente"
          onChange={(e) => {
            setSelectedFontWeight(e.target.value);
            updateComponentStyle(selectedComponentId!, { fontWeight: e.target.value });
          }}
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="bold">Negrita</MenuItem>
          <MenuItem value="lighter">Ligero</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="font-size-select-label">Tamaño de fuente</InputLabel>
        <Select
          labelId="font-size-select-label"
          id="font-size-select"
          value={selectedFontSize}
          label="Tamaño de fuente"
          onChange={(e) => {
            setSelectedFontSize(e.target.value);
            applyFontSize(e.target.value);
          }}
        >
          <MenuItem value="12">12px</MenuItem>
          <MenuItem value="14">14px</MenuItem>
          <MenuItem value="16">16px</MenuItem>
          <MenuItem value="18">18px</MenuItem>
          <MenuItem value="20">20px</MenuItem>
          <MenuItem value="24">24px</MenuItem>
          <MenuItem value="28">28px</MenuItem>
          <MenuItem value="32">32px</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle2" gutterBottom>
        Color de texto
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextColorPicker selectedColor={selectedColor} applyTextColor={applyTextColor} />
      </Box>

      {/* Añadir botones para convertir a lista si es un párrafo */}
      {isParagraphComponent && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Convertir a lista
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:format-list-bulleted" />}
              onClick={() => convertTextToList(selectedComponentId, 'unordered')}
              fullWidth
              size="small"
            >
              Lista con viñetas
            </Button>
            <Button
              variant="outlined"
              startIcon={<Icon icon="mdi:format-list-numbered" />}
              onClick={() => convertTextToList(selectedComponentId, 'ordered')}
              fullWidth
              size="small"
            >
              Lista numerada
            </Button>
          </Box>
        </Box>
      )}

      {/* Mostrar opciones de estilo de lista si es un componente de lista */}
      {selectedComponent?.type === 'bulletList' && (
        <ListStyleOptions
          selectedComponentId={selectedComponentId}
          listStyle={listStyle}
          updateListStyle={updateListStyle}
          listColor={listColor}
          updateListColor={updateListColor}
        />
      )}
    </Box>
  );
};

export default TextOptions;
