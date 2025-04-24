'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

import { Box, Button, TextField } from '@mui/material';

interface ColorPickerModalProps {
  initialColor?: string;
  onClose: () => void;
  onSelect: (color: string) => void;
}

export default function ColorPickerModal({
  initialColor = '#000000',
  onClose,
  onSelect,
}: ColorPickerModalProps) {
  const [color, setColor] = useState(initialColor);

  const handleColorChange = (newColor: string) => {
    setColor(newColor.toUpperCase());
  };

  const handleSubmit = () => {
    onSelect(color);
    onClose();
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={color}
          onChange={(e) => setColor(e.target.value.toUpperCase())}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#F3F4F6',
            },
          }}
        />
      </Box>

      <HexColorPicker color={color} onChange={handleColorChange} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
        <Button size="small" variant="outlined" onClick={onClose} sx={{ borderRadius: 1 }}>
          Cancelar
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#6366F1',
            '&:hover': { backgroundColor: '#4F46E5' },
            borderRadius: 1,
          }}
        >
          Seleccionar
        </Button>
      </Box>
    </>
  );
}
