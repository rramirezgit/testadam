import { Icon } from '@iconify/react';

import {
  Box,
  Paper,
  Button,
  Select,
  Slider,
  Divider,
  MenuItem,
  InputLabel,
  Typography,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import ListStyleOptions from './ListStyleOptions';

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
    <Box>
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
              applyTextAlignment(newAlignment, selectedComponentId, updateComponentStyle);
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

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="font-family-select-label">Fuente</InputLabel>
        <Select
          labelId="font-family-select-label"
          id="font-family-select"
          value={selectedFont}
          label="Fuente"
          onChange={(e) => {
            setSelectedFont(e.target.value);
            applyFontFamily(e.target.value, selectedComponentId, updateComponentStyle);
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
            applyFontSize(e.target.value, selectedComponentId, updateComponentStyle);
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

      {/* <Typography variant="subtitle2" gutterBottom>
        Color de texto
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextColorPicker selectedColor={selectedColor} applyTextColor={applyTextColor} />
      </Box> */}

      {/* ⚡ NUEVO: Controles de Espaciado */}
      <Paper elevation={1} sx={{ p: 1, mb: 3, bgcolor: 'grey.50' }}>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Icon icon="mdi:format-line-spacing" />
          Espaciado
        </Typography>

        {/* Márgenes */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Margen Superior
          </Typography>
          <Slider
            value={parseInt(String(selectedComponent?.style?.marginTop || '16').replace('px', ''))}
            onChange={(_, value) => {
              updateComponentStyle(selectedComponentId!, { marginTop: `${value}px` });
            }}
            min={0}
            max={50}
            step={2}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}px`}
            size="small"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Margen Inferior
          </Typography>
          <Slider
            value={parseInt(
              String(
                selectedComponent?.style?.marginBottom ||
                  (componentType === 'paragraph' ? '0' : '16')
              ).replace('px', '')
            )}
            onChange={(_, value) => {
              updateComponentStyle(selectedComponentId!, { marginBottom: `${value}px` });
            }}
            min={0}
            max={50}
            step={2}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}px`}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Padding */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Padding Superior
          </Typography>
          <Slider
            value={parseInt(String(selectedComponent?.style?.paddingTop || '0').replace('px', ''))}
            onChange={(_, value) => {
              updateComponentStyle(selectedComponentId!, { paddingTop: `${value}px` });
            }}
            min={0}
            max={30}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}px`}
            size="small"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Padding Inferior
          </Typography>
          <Slider
            value={parseInt(
              String(selectedComponent?.style?.paddingBottom || '0').replace('px', '')
            )}
            onChange={(_, value) => {
              updateComponentStyle(selectedComponentId!, { paddingBottom: `${value}px` });
            }}
            min={0}
            max={30}
            step={1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}px`}
            size="small"
          />
        </Box>

        {/* Presets de espaciado */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Presets de Espaciado
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              updateComponentStyle(selectedComponentId!, {
                marginTop: '8px',
                marginBottom: '8px',
                paddingTop: '0px',
                paddingBottom: '0px',
              });
            }}
            sx={{ fontSize: '0.75rem' }}
          >
            Compacto
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              updateComponentStyle(selectedComponentId!, {
                marginTop: '16px',
                marginBottom: '16px',
                paddingTop: '0px',
                paddingBottom: '0px',
              });
            }}
            sx={{ fontSize: '0.75rem' }}
          >
            Normal
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              updateComponentStyle(selectedComponentId!, {
                marginTop: '24px',
                marginBottom: '24px',
                paddingTop: '4px',
                paddingBottom: '4px',
              });
            }}
            sx={{ fontSize: '0.75rem' }}
          >
            Amplio
          </Button>
        </Box>
      </Paper>

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
