'use client';

import type { SavedNote } from 'src/types/saved-note';

import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Menu,
  AppBar,
  Button,
  Toolbar,
  Tooltip,
  MenuItem,
  Typography,
  IconButton,
  ToggleButton,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
} from '@mui/material';

interface EditorHeaderProps {
  onClose: () => void;
  isEditingExistingNote: boolean;
  initialNote?: SavedNote | null;
  activeVersion: 'newsletter' | 'web';
  handleVersionChange: (newVersion: 'newsletter' | 'web') => void;
  openSaveDialog: () => void;
  syncEnabled?: boolean;
  toggleSync?: () => void;
  transferToWeb?: () => void;
  transferToNewsletter?: () => void;
}

export default function EditorHeader({
  onClose,
  isEditingExistingNote,
  initialNote,
  activeVersion,
  handleVersionChange,
  openSaveDialog,
  syncEnabled = false,
  toggleSync = () => {},
  transferToWeb = () => {},
  transferToNewsletter = () => {},
}: EditorHeaderProps) {
  // Estado para el menú de transferencia
  const [transferMenuAnchor, setTransferMenuAnchor] = useState<null | HTMLElement>(null);
  const openTransferMenu = Boolean(transferMenuAnchor);

  // Abrir el menú de transferencia
  const handleTransferMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTransferMenuAnchor(event.currentTarget);
  };

  // Cerrar el menú de transferencia
  const handleTransferMenuClose = () => {
    setTransferMenuAnchor(null);
  };

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

        {/* Botón de transferencia con menú desplegable */}
        <Tooltip title="Transferir contenido entre versiones">
          <IconButton
            color="primary"
            onClick={handleTransferMenuClick}
            sx={{ mr: 2 }}
            aria-controls={openTransferMenu ? 'transfer-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openTransferMenu ? 'true' : undefined}
          >
            <Icon icon="cil:transfer" />
          </IconButton>
        </Tooltip>

        {/* Menú de transferencia */}
        <Menu
          id="transfer-menu"
          anchorEl={transferMenuAnchor}
          open={openTransferMenu}
          onClose={handleTransferMenuClose}
          MenuListProps={{
            'aria-labelledby': 'transfer-button',
          }}
        >
          <MenuItem
            onClick={() => {
              transferToNewsletter();
              handleTransferMenuClose();
            }}
            disabled={activeVersion === 'newsletter'}
          >
            <ListItemIcon>
              <Icon icon="cil:arrow-left" />
            </ListItemIcon>
            <ListItemText>Copiar contenido de Web a Newsletter</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              transferToWeb();
              handleTransferMenuClose();
            }}
            disabled={activeVersion === 'web'}
          >
            <ListItemIcon>
              <Icon icon="cil:arrow-right" />
            </ListItemIcon>
            <ListItemText>Copiar contenido de Newsletter a Web</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleSync();
              handleTransferMenuClose();
            }}
          >
            <ListItemIcon>
              <Icon icon={syncEnabled ? 'mdi:sync-off' : 'mdi:sync'} />
            </ListItemIcon>
            <ListItemText>
              {syncEnabled
                ? 'Desactivar sincronización automática'
                : 'Activar sincronización automática'}
            </ListItemText>
          </MenuItem>
        </Menu>

        <Button
          variant="outlined"
          color="inherit"
          sx={{ mr: 1 }}
          startIcon={<Icon icon="mdi:file-document-edit-outline" />}
        >
          Borrador
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Icon icon="material-symbols:save" />}
          onClick={openSaveDialog}
        >
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
