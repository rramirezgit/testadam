'use client';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import { Box, Popover, Tooltip, IconButton, Typography } from '@mui/material';

import ColorPickerModal from './email-editor/color-picker/color-picker-modal';
import { useCustomColors } from './email-editor/color-picker/use-custom-colors';

interface GeneralColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
  label?: string;
  showLabel?: boolean;
  allowReset?: boolean;
  size?: 'small' | 'medium' | 'large';
  defaultColors?: string[];
}

const GeneralColorPicker: React.FC<GeneralColorPickerProps> = ({
  selectedColor,
  onChange,
  label,
  showLabel = true,
  allowReset = true,
  size = 'medium',
  defaultColors = [
    '#000000',
    '#808080',
    '#D3D3D3',
    '#00CED1',
    '#008B8B',
    '#FFA500',
    '#008000',
    '#FF4500',
  ],
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { customColors, addCustomColor, removeCustomColor } = useCustomColors();

  const sizeMap = {
    small: 20,
    medium: 24,
    large: 32,
  };

  const colorSize = sizeMap[size];

  const handleAddColor = (color: string) => {
    addCustomColor(color);
    onChange(color);
  };

  const handleRemoveColor = () => {
    onChange('');
  };

  const handleColorSelect = (color: string) => {
    onChange(color);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {showLabel && label && (
        <Typography variant="caption" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {/* Colores predeterminados */}
        {defaultColors.map((color) => (
          <Box
            key={color}
            onClick={() => handleColorSelect(color)}
            sx={{
              width: colorSize,
              height: colorSize,
              borderRadius: '50%',
              background: color,
              cursor: 'pointer',
              border: selectedColor === color ? '2px solid #8800F3' : '1px solid #ddd',
              boxShadow: selectedColor === color ? '0 0 8px rgba(136, 0, 243, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              },
            }}
          />
        ))}

        {/* Colores personalizados */}
        {customColors.map((color) => (
          <Tooltip
            key={color}
            title={
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  removeCustomColor(color);
                }}
                sx={{
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Eliminar color personalizado
              </Box>
            }
            placement="top"
            arrow
          >
            <Box
              onClick={() => handleColorSelect(color)}
              sx={{
                width: colorSize,
                height: colorSize,
                borderRadius: '50%',
                background: color,
                cursor: 'pointer',
                border: selectedColor === color ? '2px solid #8800F3' : '1px solid #ddd',
                boxShadow: selectedColor === color ? '0 0 8px rgba(136, 0, 243, 0.3)' : 'none',
                position: 'relative',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#8800F3',
                  fontSize: 8,
                },
              }}
            />
          </Tooltip>
        ))}

        {/* Botón de reset */}
        {allowReset && (
          <Tooltip title="Reiniciar color">
            <IconButton
              onClick={handleRemoveColor}
              sx={{
                width: colorSize,
                padding: 0,
                height: colorSize,
                border: '1px solid #ddd',
                backgroundColor: '#f5f5f5',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Icon icon="mdi:format-color-reset" width={12} height={12} />
            </IconButton>
          </Tooltip>
        )}

        {/* Botón para abrir selector personalizado */}
        <Tooltip title="Seleccionar color personalizado">
          <IconButton
            onClick={(event) => setAnchorEl(event.currentTarget)}
            sx={{
              width: colorSize,
              height: colorSize,
              borderRadius: '50%',
              background:
                'conic-gradient(from 180deg at 50% 50%, #FF362F 0deg, #FFF260 23.399999141693115deg, #8EFF38 64.80000257492065deg, #3CFF9D 88.20000171661377deg, #3A55FF 122.40000128746033deg, #29EAFF 170.9999978542328deg, #5A5DFF 248.39999914169312deg, #B32FFF 300.59999227523804deg, #FF21C7 360deg)',
              border: '1px solid #ddd',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              },
            }}
          />
        </Tooltip>
      </Box>

      {/* Popover para selector de color personalizado */}
      <Popover
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box p={2}>
          <ColorPickerModal onClose={() => setAnchorEl(null)} onSelect={handleAddColor} />
        </Box>
      </Popover>
    </Box>
  );
};

export default GeneralColorPicker;
