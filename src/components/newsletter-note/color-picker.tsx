'use client';

import type React from 'react';

import { useState } from 'react';

import { Box, Popover, TextField, Typography } from '@mui/material';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [inputValue, setInputValue] = useState(color);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setInputValue(newColor);
    onChange(newColor);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {label && (
        <Typography variant="caption" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '4px',
          bgcolor: color,
          cursor: 'pointer',
          border: '1px solid #ddd',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
        }}
        onClick={handleClick}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2 }}>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            style={{ width: '100%', height: 40, padding: 0, border: 'none' }}
          />
          <TextField
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => onChange(inputValue)}
            sx={{ mt: 1, width: 120 }}
            InputProps={{
              startAdornment: <Box sx={{ mr: 1 }}>#</Box>,
            }}
          />
        </Box>
      </Popover>
    </Box>
  );
}
