'use client';

import type { SavedNote } from 'src/types/saved-note';

import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';

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
  activeTemplate: string;
  handleVersionChange: (newVersion: 'newsletter' | 'web') => void;
  openSaveDialog: () => void;
  syncEnabled?: boolean;
  toggleSync?: () => void;
  transferToWeb?: () => void;
  transferToNewsletter?: () => void;
  noteStatus: string;
  isNewsletterMode?: boolean;
  onGenerateNewsletterHtml?: () => void;
  onToggleNewsletterView?: () => void;
  showNewsletterPreview?: boolean;
  generatingNewsletterHtml?: boolean;
  newsletterNotesCount?: number;
  newsletterList?: any[];
  currentNewsletterId?: string;
  saving?: boolean;
  setOpenSendDialog?: (open: boolean) => void;
  setOpenAprob?: (open: boolean) => void;
  setOpenSchedule?: (open: boolean) => void;
  setOpenSendSubs?: (open: boolean) => void;
}

export default function EditorHeader({
  onClose,
  isEditingExistingNote,
  initialNote,
  activeVersion,
  activeTemplate,
  handleVersionChange,
  openSaveDialog,
  syncEnabled = false,
  toggleSync = () => {},
  transferToWeb = () => {},
  transferToNewsletter = () => {},
  noteStatus,
  isNewsletterMode = false,
  onGenerateNewsletterHtml = () => {},
  onToggleNewsletterView = () => {},
  showNewsletterPreview = false,
  generatingNewsletterHtml = false,
  newsletterNotesCount = 0,
  newsletterList,
  currentNewsletterId,
  saving,
  setOpenSendDialog,
  setOpenAprob,
  setOpenSchedule,
  setOpenSendSubs,
}: EditorHeaderProps) {
  // Estado para el menú de transferencia
  const [transferMenuAnchor, setTransferMenuAnchor] = useState<null | HTMLElement>(null);
  const openTransferMenu = Boolean(transferMenuAnchor);

  // Estado para el menú de envío
  const [sendMenuAnchor, setSendMenuAnchor] = useState<null | HTMLElement>(null);
  const openSendMenu = Boolean(sendMenuAnchor);

  // Función para deshabilitar opciones del menú de envío
  const disableOption = useCallback(
    (option: 'Prueba' | 'Aprobacion' | 'Subscriptores' | 'schedule') => {
      if (saving) {
        return true;
      }

      const newsletter = newsletterList?.find((item) => item.id === currentNewsletterId);

      if (option === 'Aprobacion') {
        if (newsletter) {
          if (
            newsletter.status === 'APPROVED' ||
            newsletter.status === 'PENDING_APPROVAL' ||
            newsletter.status === 'SENDED'
          ) {
            return true;
          }
        }
      }

      if (option === 'Subscriptores' || option === 'schedule') {
        if (newsletter) {
          if (
            newsletter.status === 'DRAFT' ||
            newsletter.status === 'REJECTED' ||
            newsletter.status === 'SENDED' ||
            newsletter.status === 'PENDING_APPROVAL'
          ) {
            return true;
          }
        }
      }

      return false;
    },
    [currentNewsletterId, newsletterList, saving]
  );

  // Debug: Log del activeTemplate
  console.log('🔍 EditorHeader - activeTemplate:', activeTemplate);
  console.log('🔍 EditorHeader - activeTemplate === "news":', activeTemplate === 'news');

  // Abrir el menú de transferencia
  const handleTransferMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTransferMenuAnchor(event.currentTarget);
  };

  // Cerrar el menú de transferencia
  const handleTransferMenuClose = () => {
    setTransferMenuAnchor(null);
  };

  // Abrir el menú de envío
  const handleSendMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSendMenuAnchor(event.currentTarget);
  };

  // Cerrar el menú de envío
  const handleSendMenuClose = () => {
    setSendMenuAnchor(null);
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
          {isNewsletterMode
            ? 'Nuevo Newsletter'
            : isEditingExistingNote
              ? initialNote?.title || 'Editor de Email'
              : 'Nuevo Email'}
        </Typography>

        {/* Selector de versión Web/Newsletter - Solo para template 'news' */}
        {activeTemplate === 'news' ? (
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
                <Image
                  src="/assets/icons/apps/ic-news.svg"
                  alt="newsletter"
                  width={20}
                  height={20}
                />
                Newsletter
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1 }} />
        )}

        {/* Indicador de sincronización - Solo para template 'news' */}
        {activeTemplate === 'news' && syncEnabled && (
          <Tooltip title="Sincronización automática activa: Se sincroniza solo el contenido">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 1,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: 'info.light',
                color: 'info.dark',
              }}
            >
              <Icon icon="mdi:sync" style={{ fontSize: '16px', marginRight: '4px' }} />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                Sync
              </Typography>
            </Box>
          </Tooltip>
        )}

        {/* Botón de transferencia con menú desplegable - Solo para template 'news' */}
        {activeTemplate === 'news' && (
          <Tooltip title="Transferir y sincronizar contenido entre versiones">
            <IconButton
              color="primary"
              onClick={handleTransferMenuClick}
              sx={{
                mr: 2,
                backgroundColor: syncEnabled ? 'info.light' : 'transparent',
              }}
              aria-controls={openTransferMenu ? 'transfer-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openTransferMenu ? 'true' : undefined}
            >
              <Icon icon="cil:transfer" />
            </IconButton>
          </Tooltip>
        )}

        {/* Menú de transferencia - Solo para template 'news' */}
        {activeTemplate === 'news' && (
          <Menu
            id="transfer-menu"
            anchorEl={transferMenuAnchor}
            open={openTransferMenu}
            onClose={handleTransferMenuClose}
            MenuListProps={{
              'aria-labelledby': 'transfer-button',
            }}
            PaperProps={{
              sx: { minWidth: '280px' },
            }}
          >
            {/* Sección: Copiar solo contenido */}
            <Typography
              variant="overline"
              sx={{ px: 2, py: 1, color: 'text.secondary', fontSize: '0.75rem' }}
            >
              Copiar solo contenido
            </Typography>
            <MenuItem
              onClick={() => {
                transferToNewsletter();
                handleTransferMenuClose();
              }}
              disabled={activeVersion === 'newsletter'}
            >
              <ListItemIcon>
                <Icon icon="mdi:content-copy" />
              </ListItemIcon>
              <ListItemText
                primary="Copiar contenido a Newsletter"
                secondary="Solo el texto de componentes existentes"
              />
            </MenuItem>
            <MenuItem
              onClick={() => {
                transferToWeb();
                handleTransferMenuClose();
              }}
              disabled={activeVersion === 'web'}
            >
              <ListItemIcon>
                <Icon icon="mdi:content-copy" />
              </ListItemIcon>
              <ListItemText
                primary="Copiar contenido a Web"
                secondary="Solo el texto de componentes existentes"
              />
            </MenuItem>

            <Box sx={{ my: 1, mx: 2, borderTop: '1px solid', borderColor: 'divider' }} />

            {/* Sección: Sincronización */}
            <Typography
              variant="overline"
              sx={{ px: 2, py: 1, color: 'text.secondary', fontSize: '0.75rem' }}
            >
              Sincronización automática
            </Typography>
            <MenuItem
              onClick={() => {
                toggleSync();
                handleTransferMenuClose();
              }}
            >
              <ListItemIcon>
                <Icon icon={syncEnabled ? 'mdi:sync-off' : 'mdi:sync'} />
              </ListItemIcon>
              <ListItemText
                primary={syncEnabled ? 'Desactivar sincronización' : 'Activar sincronización'}
                secondary="Solo actualiza el contenido de componentes existentes"
              />
            </MenuItem>
          </Menu>
        )}

        {isNewsletterMode ? (
          <>
            {/* Contador de notas del newsletter */}
            <Button
              variant="outlined"
              color="inherit"
              sx={{ mr: 1 }}
              startIcon={<Icon icon="mdi:note-multiple" />}
            >
              {newsletterNotesCount} Notas
            </Button>

            {/* Botón para generar/alternar vista de preview HTML */}
            <Button
              variant={showNewsletterPreview ? 'contained' : 'outlined'}
              color="secondary"
              sx={{ mr: 1 }}
              startIcon={
                generatingNewsletterHtml ? (
                  <Icon icon="mdi:loading" className="animate-spin" />
                ) : (
                  <Icon icon={showNewsletterPreview ? 'mdi:eye-off' : 'mdi:eye'} />
                )
              }
              onClick={showNewsletterPreview ? onToggleNewsletterView : onGenerateNewsletterHtml}
              disabled={generatingNewsletterHtml}
            >
              {showNewsletterPreview ? 'Ver Notas' : 'Preview HTML'}
            </Button>

            {/* Botón de enviar newsletter */}
            <Button
              variant="contained"
              color="primary"
              endIcon={<Icon icon="mdi:chevron-down" />}
              sx={{ backgroundColor: '#4f46e5' }}
              onClick={handleSendMenuClick}
              aria-controls={openSendMenu ? 'send-menu-newsletter' : undefined}
              aria-haspopup="true"
              aria-expanded={openSendMenu ? 'true' : undefined}
            >
              Enviar Newsletter
            </Button>

            {/* Menú de envío para newsletter */}
            <Menu
              id="send-menu-newsletter"
              anchorEl={sendMenuAnchor}
              open={openSendMenu}
              onClose={handleSendMenuClose}
              MenuListProps={{
                'aria-labelledby': 'send-newsletter-button',
              }}
              PaperProps={{
                sx: { minWidth: '200px' },
              }}
            >
              <MenuItem
                disabled={disableOption('Prueba')}
                onClick={() => {
                  setOpenSendDialog?.(true);
                  handleSendMenuClose();
                }}
              >
                <ListItemIcon>
                  <Icon icon="mdi:test-tube" width={24} height={24} />
                </ListItemIcon>
                <ListItemText>Prueba</ListItemText>
              </MenuItem>

              <MenuItem
                disabled={disableOption('Aprobacion')}
                onClick={() => {
                  setOpenAprob?.(true);
                  handleSendMenuClose();
                }}
              >
                <ListItemIcon>
                  <Icon icon="mdi:check-circle-outline" width={24} height={24} />
                </ListItemIcon>
                <ListItemText>Aprobación</ListItemText>
              </MenuItem>

              <MenuItem
                disabled={disableOption('schedule')}
                onClick={() => {
                  setOpenSchedule?.(true);
                  handleSendMenuClose();
                }}
              >
                <ListItemIcon>
                  <Icon icon="material-symbols:schedule-outline" width={24} height={24} />
                </ListItemIcon>
                <ListItemText>Programar</ListItemText>
              </MenuItem>

              <MenuItem
                disabled={disableOption('Subscriptores')}
                onClick={() => {
                  setOpenSendSubs?.(true);
                  handleSendMenuClose();
                }}
              >
                <ListItemIcon>
                  <Icon icon="fluent-mdl2:group" width={24} height={24} />
                </ListItemIcon>
                <ListItemText>Enviar ahora</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              color="inherit"
              sx={{ mr: 1 }}
              startIcon={<Icon icon="mdi:file-document-edit-outline" />}
            >
              {noteStatus === 'DRAFT'
                ? 'Borrador'
                : noteStatus === 'REVIEW'
                  ? 'En Revisión'
                  : noteStatus === 'APPROVED'
                    ? 'Aprobado'
                    : noteStatus === 'PUBLISHED'
                      ? 'Publicado'
                      : 'Borrador'}
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
              onClick={handleSendMenuClick}
              aria-controls={openSendMenu ? 'send-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openSendMenu ? 'true' : undefined}
            >
              Enviar
            </Button>

            {/* Menú de envío */}
            <Menu
              id="send-menu"
              anchorEl={sendMenuAnchor}
              open={openSendMenu}
              onClose={handleSendMenuClose}
              MenuListProps={{
                'aria-labelledby': 'send-button',
              }}
              PaperProps={{
                sx: { minWidth: '200px' },
              }}
            >
              <MenuItem
                disabled={disableOption('Prueba')}
                onClick={() => {
                  setOpenSendDialog?.(true);
                  handleSendMenuClose();
                }}
              >
                <ListItemIcon>
                  <Icon icon="mdi:test-tube" width={24} height={24} />
                </ListItemIcon>
                <ListItemText>Prueba</ListItemText>
              </MenuItem>

              <MenuItem
                disabled={disableOption('Aprobacion')}
                onClick={() => {
                  setOpenAprob?.(true);
                  handleSendMenuClose();
                }}
              >
                <ListItemIcon>
                  <Icon icon="mdi:check-circle-outline" width={24} height={24} />
                </ListItemIcon>
                <ListItemText>Aprobación</ListItemText>
              </MenuItem>

              <MenuItem
                disabled={disableOption('schedule')}
                onClick={() => {
                  setOpenSchedule?.(true);
                  handleSendMenuClose();
                }}
              >
                <ListItemIcon>
                  <Icon icon="material-symbols:schedule-outline" width={24} height={24} />
                </ListItemIcon>
                <ListItemText>Programar</ListItemText>
              </MenuItem>

              <MenuItem
                disabled={disableOption('Subscriptores')}
                onClick={() => {
                  setOpenSendSubs?.(true);
                  handleSendMenuClose();
                }}
              >
                <ListItemIcon>
                  <Icon icon="fluent-mdl2:group" width={24} height={24} />
                </ListItemIcon>
                <ListItemText>Enviar ahora</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
