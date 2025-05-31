import type { Editor } from '@tiptap/react';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import {
  Box,
  Paper,
  Popover,
  Tooltip,
  TextField,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

interface TextoToolbarProps {
  editor: Editor | null;
}

export default function TextoToolbar({ editor }: TextoToolbarProps) {
  const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);
  const [color, setColor] = useState<string>('#000000');
  const [linkAnchorEl, setLinkAnchorEl] = useState<null | HTMLElement>(null);
  const [linkUrl, setLinkUrl] = useState<string>('https://');

  // Si no hay editor o no está enfocado, no mostrar
  if (!editor || !editor.isFocused) {
    return null;
  }

  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const applyColor = () => {
    editor.chain().focus().setColor(color).run();
    handleColorClose();
  };

  const handleLinkClick = (event: React.MouseEvent<HTMLElement>) => {
    // Si hay texto seleccionado, mostrar el popover para crear un enlace
    if (editor.state.selection.empty) return;
    setLinkAnchorEl(event.currentTarget);
  };

  const handleLinkClose = () => {
    setLinkAnchorEl(null);
    setLinkUrl('https://');
  };

  const applyLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    handleLinkClose();
  };

  const toggleBold = () => {
    editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };

  const toggleUnderline = () => {
    editor.chain().focus().toggleUnderline().run();
  };

  const setTextAlign = (alignment: string) => {
    switch (alignment) {
      case 'left':
        editor.chain().focus().setTextAlign('left').run();
        break;
      case 'center':
        editor.chain().focus().setTextAlign('center').run();
        break;
      case 'right':
        editor.chain().focus().setTextAlign('right').run();
        break;
      case 'justify':
        editor.chain().focus().setTextAlign('justify').run();
        break;
      default:
        editor.chain().focus().setTextAlign('left').run();
        break;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: -45,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        padding: '4px',
        borderRadius: '4px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <Tooltip title="Negrita">
        <IconButton
          size="small"
          onClick={toggleBold}
          color={editor.isActive('bold') ? 'primary' : 'default'}
        >
          <Icon icon="mdi:format-bold" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Cursiva">
        <IconButton
          size="small"
          onClick={toggleItalic}
          color={editor.isActive('italic') ? 'primary' : 'default'}
        >
          <Icon icon="mdi:format-italic" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Subrayado">
        <IconButton
          size="small"
          onClick={toggleUnderline}
          color={editor.isActive('underline') ? 'primary' : 'default'}
        >
          <Icon icon="mdi:format-underline" />
        </IconButton>
      </Tooltip>

      <Box sx={{ mx: 0.5, height: '24px', borderLeft: '1px solid #ddd' }} />

      <Tooltip title="Alineación">
        <ToggleButtonGroup
          size="small"
          exclusive
          value={
            editor.isActive({ textAlign: 'left' })
              ? 'left'
              : editor.isActive({ textAlign: 'center' })
                ? 'center'
                : editor.isActive({ textAlign: 'right' })
                  ? 'right'
                  : editor.isActive({ textAlign: 'justify' })
                    ? 'justify'
                    : 'left'
          }
          onChange={(_, value) => value && setTextAlign(value)}
        >
          <ToggleButton value="left">
            <Icon icon="mdi:format-align-left" />
          </ToggleButton>
          <ToggleButton value="center">
            <Icon icon="mdi:format-align-center" />
          </ToggleButton>
          <ToggleButton value="right">
            <Icon icon="mdi:format-align-right" />
          </ToggleButton>
          <ToggleButton value="justify">
            <Icon icon="mdi:format-align-justify" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Tooltip>

      <Box sx={{ mx: 0.5, height: '24px', borderLeft: '1px solid #ddd' }} />

      <Tooltip title="Color del texto">
        <IconButton size="small" onClick={handleColorClick}>
          <Icon icon="mdi:format-color-text" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Enlace">
        <IconButton
          size="small"
          onClick={handleLinkClick}
          color={editor.isActive('link') ? 'primary' : 'default'}
        >
          <Icon icon="mdi:link" />
        </IconButton>
      </Tooltip>

      {/* Popover para seleccionar color */}
      <Popover
        open={Boolean(colorAnchorEl)}
        anchorEl={colorAnchorEl}
        onClose={handleColorClose}
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
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map(
              (c) => (
                <Box
                  key={c}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: c,
                    border: c === color ? '2px solid #000' : '1px solid #ddd',
                    cursor: 'pointer',
                  }}
                  onClick={() => setColor(c)}
                />
              )
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              label="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              sx={{ width: 150 }}
            />
            <IconButton onClick={applyColor} color="primary">
              <Icon icon="mdi:check" />
            </IconButton>
          </Box>
        </Box>
      </Popover>

      {/* Popover para crear enlace */}
      <Popover
        open={Boolean(linkAnchorEl)}
        anchorEl={linkAnchorEl}
        onClose={handleLinkClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            label="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            sx={{ width: 250 }}
          />
          <IconButton onClick={applyLink} color="primary">
            <Icon icon="mdi:check" />
          </IconButton>
        </Box>
      </Popover>
    </Paper>
  );
}
