'use client';

import { Icon } from '@iconify/react';

import {
  Box,
  AppBar,
  Toolbar,
  Accordion,
  TextField,
  Typography,
  IconButton,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import type { NewsletterHeader } from '../../types';

interface NewsletterHeaderViewProps {
  newsletterHeader: NewsletterHeader;
  onHeaderChange: (header: NewsletterHeader) => void;
  setSelectedComponentId: (id: string | null) => void;
}

export default function NewsletterHeaderView({
  newsletterHeader,
  onHeaderChange,
  setSelectedComponentId,
}: NewsletterHeaderViewProps) {
  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        background: 'transparent',
        borderRadius: 2,
        '&::before': {
          ...theme.mixins.borderGradient({
            padding: '2px',
            color: `linear-gradient(to bottom left, #FFFFFF, #C6C6FF61)`,
          }),
          pointerEvents: 'none',
        },
      })}
    >
      <AppBar position="static" color="default" elevation={0} sx={{ flexShrink: 0 }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => setSelectedComponentId(null)}>
            <Icon icon="mdi:arrow-left" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Configuración del Header
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, height: 0, p: 2 }}>
        {/* Datos básicos del header */}
        <Accordion defaultExpanded disableGutters sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>Datos</AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              label="Título del Header"
              value={newsletterHeader.title}
              onChange={(e) => onHeaderChange({ ...newsletterHeader, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Subtítulo"
              value={newsletterHeader.subtitle}
              onChange={(e) => onHeaderChange({ ...newsletterHeader, subtitle: e.target.value })}
            />
          </AccordionDetails>
        </Accordion>

        {/* Logo - Deshabilitado */}
        {/* Sponsor - Deshabilitado temporalmente */}
        {/* Banner - Deshabilitado */}

        {/* Color de texto */}
        <Accordion disableGutters sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
            Color de Texto
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                label="Color de Texto"
                value={newsletterHeader.textColor}
                onChange={(e) => onHeaderChange({ ...newsletterHeader, textColor: e.target.value })}
                sx={{ mb: 2 }}
              />
              <input
                type="color"
                value={newsletterHeader.textColor}
                onChange={(e) => onHeaderChange({ ...newsletterHeader, textColor: e.target.value })}
                style={{ width: '50px', height: '40px', cursor: 'pointer', border: 'none' }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Alineación */}
        <Accordion disableGutters sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
            Alineación
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => onHeaderChange({ ...newsletterHeader, alignment: 'left' })}
                sx={{
                  border:
                    newsletterHeader.alignment === 'left' ? '2px solid #1976d2' : '1px solid #ccc',
                }}
              >
                <Icon icon="mdi:format-align-left" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onHeaderChange({ ...newsletterHeader, alignment: 'center' })}
                sx={{
                  border:
                    newsletterHeader.alignment === 'center'
                      ? '2px solid #1976d2'
                      : '1px solid #ccc',
                }}
              >
                <Icon icon="mdi:format-align-center" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onHeaderChange({ ...newsletterHeader, alignment: 'right' })}
                sx={{
                  border:
                    newsletterHeader.alignment === 'right' ? '2px solid #1976d2' : '1px solid #ccc',
                }}
              >
                <Icon icon="mdi:format-align-right" />
              </IconButton>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Espaciado */}
        <Accordion disableGutters sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
            Espaciado
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              type="number"
              label="Padding (px)"
              value={newsletterHeader.padding}
              onChange={(e) =>
                onHeaderChange({ ...newsletterHeader, padding: Number(e.target.value) })
              }
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
