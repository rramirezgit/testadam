'use client';

import type { SavedNote } from 'src/types/saved-note';

import Image from 'next/image';
import { Icon } from '@iconify/react';

import {
  Box,
  AppBar,
  Button,
  Toolbar,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

interface EditorHeaderProps {
  onClose: () => void;
  isEditingExistingNote: boolean;
  initialNote?: SavedNote | null;
  activeVersion: 'newsletter' | 'web';
  handleVersionChange: (newVersion: 'newsletter' | 'web') => void;
  openSaveDialog: () => void;
}

export default function EditorHeader({
  onClose,
  isEditingExistingNote,
  initialNote,
  activeVersion,
  handleVersionChange,
  openSaveDialog,
}: EditorHeaderProps) {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ minHeight: '56px' }}>
        <Button
          startIcon={<Icon icon="mingcute:left-line" />}
          onClick={onClose}
          variant="outlined"
          sx={{
            mr: 1,
            height: '42px',
          }}
        >
          Volver
        </Button>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {isEditingExistingNote ? initialNote?.title || 'Editor de Email' : 'Nuevo Email'}
        </Typography>

        {/* Selector de versión Web/Newsletter */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mx: 2,
            flexGrow: 1,
            justifyContent: 'center',
          }}
        >
          <ToggleButtonGroup
            value={activeVersion}
            exclusive
            color="primary"
            onChange={(e, newValue) => {
              if (newValue !== null) {
                handleVersionChange(newValue);
              }
            }}
            sx={{
              border: 'none',
            }}
            aria-label="Versión del contenido"
            size="small"
          >
            <ToggleButton value="web" aria-label="web version">
              <Image src="/assets/icons/apps/ic-notes.svg" alt="web" width={20} height={20} />
              Web
            </ToggleButton>
            <ToggleButton value="newsletter" aria-label="newsletter version">
              <Image src="/assets/icons/apps/ic-news.svg" alt="newsletter" width={20} height={20} />
              Newsletter
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Button
          variant="outlined"
          color="inherit"
          sx={{ mr: 1 }}
          startIcon={<Icon icon="mdi:file-document-edit-outline" />}
        >
          Borrador
        </Button>
        <Button variant="contained" color="primary" onClick={openSaveDialog} sx={{ mr: 1 }}>
          Guardar
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<Icon icon="mdi:chevron-down" />}
          sx={{ backgroundColor: '#4f46e5' }}
        >
          Enviar
        </Button>
      </Toolbar>
    </AppBar>
  );
}
