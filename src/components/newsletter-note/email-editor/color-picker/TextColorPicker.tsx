// src/components/newsletter-note/email-editor/color-picker/TextColorPicker.tsx

'use client';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import { Box, Popover, Tooltip, IconButton } from '@mui/material';

import ColorPickerModal from './color-picker-modal';
import { useCustomColors } from './use-custom-colors';

interface TextColorPickerProps {
  selectedColor: string;
  applyTextColor: (color: string) => void;
}

const TextColorPicker: React.FC<TextColorPickerProps> = ({ selectedColor, applyTextColor }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { customColors, addCustomColor, removeCustomColor } = useCustomColors(); // Usar el hook

  const defaultColors = [
    '#000000',
    '#808080',
    '#D3D3D3',
    '#00CED1',
    '#008B8B',
    '#FFA500',
    '#008000',
    '#FF4500',
  ];

  const handleAddColor = (color: string) => {
    addCustomColor(color); // Usar la función del hook
    applyTextColor(color);
  };

  const handleRemoveColor = () => {
    applyTextColor('');
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {defaultColors.map((color) => (
          <Box
            key={color}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyTextColor(color)}
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: color,
              cursor: 'pointer',
              border: selectedColor === color ? '1px solid #8800F3' : 'none',
              '&:hover': { backgroundColor: color, opacity: 0.9 },
            }}
          />
        ))}
        {customColors.map((color) => (
          <Tooltip
            key={color}
            title={
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  removeCustomColor(color);
                }}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Eliminar
              </button>
            }
            sx={{
              background: 'transparent',
            }}
            placement="top"
            arrow
          >
            <Box
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyTextColor(color)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: color,
                cursor: 'pointer',
                border: selectedColor === color ? '1px solid #8800F3' : 'none',
                '&:hover': { backgroundColor: color, opacity: 0.9 },
              }}
            />
          </Tooltip>
        ))}
        <IconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleRemoveColor}
          sx={{
            width: 24,
            height: 24,
            border: '1px solid #ddd',
            '&:hover': { opacity: 0.9 },
          }}
        >
          <Icon icon="mdi:format-color-reset" />
        </IconButton>
        <IconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background:
              'conic-gradient(from 180deg at 50% 50%, #FF362F 0deg, #FFF260 23.399999141693115deg, #8EFF38 64.80000257492065deg, #3CFF9D 88.20000171661377deg, #3A55FF 122.40000128746033deg, #29EAFF 170.9999978542328deg, #5A5DFF 248.39999914169312deg, #B32FFF 300.59999227523804deg, #FF21C7 360deg)',
            border: 'none',
            '&:hover': { opacity: 0.9 },
          }}
        />
      </Box>
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
        PaperProps={{
          onMouseDown: (e) => e.preventDefault(), // Prevenir blur del editor
        }}
      >
        <Box p={2}>
          <ColorPickerModal onClose={() => setAnchorEl(null)} onSelect={handleAddColor} />
        </Box>
      </Popover>
    </>
  );
};

export default TextColorPicker;
