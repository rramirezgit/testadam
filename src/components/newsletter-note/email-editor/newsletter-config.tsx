'use client';

import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import {
  Box,
  Tab,
  Tabs,
  Stack,
  Switch,
  Divider,
  TextField,
  Accordion,
  Typography,
  IconButton,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
} from '@mui/material';

import type { NewsletterNote, NewsletterHeader, NewsletterFooter } from './types';

// CSS para ocultar scrollbars
const hideScrollbarStyles = {
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none',
};

interface NewsletterConfigProps {
  newsletterTitle: string;
  newsletterDescription: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  selectedNotes: NewsletterNote[];
  onMoveNote: (noteId: string, direction: 'up' | 'down') => void;
  onRemoveNote: (noteId: string) => void;
  header: NewsletterHeader;
  footer: NewsletterFooter;
  onHeaderChange: (header: NewsletterHeader) => void;
  onFooterChange: (footer: NewsletterFooter) => void;
  onUndoChanges: () => void;
  onResetConfiguration: () => void;
}

export default function NewsletterConfig({
  newsletterTitle,
  newsletterDescription,
  onTitleChange,
  onDescriptionChange,
  selectedNotes,
  onMoveNote,
  onRemoveNote,
  header,
  footer,
  onHeaderChange,
  onFooterChange,
  onUndoChanges,
  onResetConfiguration,
}: NewsletterConfigProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Configuración del Newsletter</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton size="small" onClick={onUndoChanges} title="Deshacer cambios">
              <Icon icon="mdi:undo" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onResetConfiguration}
              title="Restablecer configuración"
            >
              <Icon icon="mdi:refresh" />
            </IconButton>
          </Box>
        </Box>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="General" />
          <Tab label="Header" />
          <Tab label="Footer" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto', ...hideScrollbarStyles }}>
        {activeTab === 0 && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Información General
              </Typography>
              <TextField
                fullWidth
                label="Título del Newsletter"
                value={newsletterTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Descripción"
                value={newsletterDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                multiline
                rows={3}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Resumen
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Notas seleccionadas: {selectedNotes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estado: {selectedNotes.length > 0 ? 'Listo para generar' : 'Necesita notas'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Orden de Notas
              </Typography>
              {selectedNotes.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No hay notas seleccionadas
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {selectedNotes.map((note, index) => (
                    <Box
                      key={note.noteId}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {index + 1}. {note.noteData.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => onMoveNote(note.noteId, 'up')}
                          disabled={index === 0}
                        >
                          <Icon icon="mdi:chevron-up" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onMoveNote(note.noteId, 'down')}
                          disabled={index === selectedNotes.length - 1}
                        >
                          <Icon icon="mdi:chevron-down" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => onRemoveNote(note.noteId)}
                          color="error"
                        >
                          <Icon icon="mdi:close" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Configuración del Header
            </Typography>

            {/* Datos básicos */}
            <Accordion defaultExpanded disableGutters sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                Datos
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Título del Header"
                    value={header.title}
                    onChange={(e) => onHeaderChange({ ...header, title: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label="Subtítulo"
                    value={header.subtitle}
                    onChange={(e) => onHeaderChange({ ...header, subtitle: e.target.value })}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Colores y fondo */}
            <Accordion disableGutters sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                Colores y Fondo
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={header.useGradient}
                        onChange={(e) =>
                          onHeaderChange({ ...header, useGradient: e.target.checked })
                        }
                        color="primary"
                      />
                    }
                    label="Usar Gradiente"
                  />

                  {header.useGradient ? (
                    <Stack direction="row" spacing={1}>
                      <TextField
                        fullWidth
                        type="color"
                        label="Gradiente 1"
                        value={header.gradientColors[0]}
                        onChange={(e) => {
                          const newColors = [...header.gradientColors];
                          newColors[0] = e.target.value;
                          onHeaderChange({ ...header, gradientColors: newColors });
                        }}
                      />
                      <TextField
                        fullWidth
                        type="color"
                        label="Gradiente 2"
                        value={header.gradientColors[1]}
                        onChange={(e) => {
                          const newColors = [...header.gradientColors];
                          newColors[1] = e.target.value;
                          onHeaderChange({ ...header, gradientColors: newColors });
                        }}
                      />
                    </Stack>
                  ) : (
                    <TextField
                      fullWidth
                      type="color"
                      label="Color de Fondo"
                      value={header.backgroundColor}
                      onChange={(e) =>
                        onHeaderChange({ ...header, backgroundColor: e.target.value })
                      }
                    />
                  )}

                  <TextField
                    fullWidth
                    type="color"
                    label="Color del Texto"
                    value={header.textColor}
                    onChange={(e) => onHeaderChange({ ...header, textColor: e.target.value })}
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Sponsor */}
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                Sponsor
              </AccordionSummary>
              <AccordionDetails>
                <FormControlLabel
                  control={
                    <Switch
                      checked={header.sponsor?.enabled || false}
                      onChange={(e) =>
                        onHeaderChange({
                          ...header,
                          sponsor: { ...header.sponsor, enabled: e.target.checked },
                        })
                      }
                      color="primary"
                    />
                  }
                  label="Mostrar Sponsor"
                />
                {header.sponsor?.enabled && (
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Texto del Sponsor"
                      value={header.sponsor?.label || ''}
                      onChange={(e) =>
                        onHeaderChange({
                          ...header,
                          sponsor: { ...header.sponsor, label: e.target.value },
                        })
                      }
                    />
                    <TextField
                      fullWidth
                      label="URL de la imagen"
                      value={header.sponsor?.image || ''}
                      onChange={(e) =>
                        onHeaderChange({
                          ...header,
                          sponsor: { ...header.sponsor, image: e.target.value },
                        })
                      }
                    />
                    <TextField
                      fullWidth
                      label="Alt de la imagen"
                      value={header.sponsor?.imageAlt || ''}
                      onChange={(e) =>
                        onHeaderChange({
                          ...header,
                          sponsor: { ...header.sponsor, imageAlt: e.target.value },
                        })
                      }
                    />
                  </Stack>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Configuración del Footer
            </Typography>
            <TextField
              fullWidth
              label="Nombre de la Empresa"
              value={footer.companyName}
              onChange={(e) => onFooterChange({ ...footer, companyName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Dirección"
              value={footer.address}
              onChange={(e) => onFooterChange({ ...footer, address: e.target.value })}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email de Contacto"
              type="email"
              value={footer.contactEmail}
              onChange={(e) => onFooterChange({ ...footer, contactEmail: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Color de Fondo"
              type="color"
              value={footer.backgroundColor}
              onChange={(e) => onFooterChange({ ...footer, backgroundColor: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Color del Texto"
              type="color"
              value={footer.textColor}
              onChange={(e) => onFooterChange({ ...footer, textColor: e.target.value })}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
              Redes Sociales
            </Typography>
            {footer.socialLinks.map((link, index) => (
              <Box
                key={index}
                sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {link.platform}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const newSocialLinks = [...footer.socialLinks];
                      newSocialLinks[index].enabled = !newSocialLinks[index].enabled;
                      onFooterChange({ ...footer, socialLinks: newSocialLinks });
                    }}
                    color={link.enabled ? 'primary' : 'default'}
                  >
                    <Icon icon={link.enabled ? 'mdi:eye' : 'mdi:eye-off'} />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label={`URL de ${link.platform}`}
                  value={link.url}
                  onChange={(e) => {
                    const newSocialLinks = [...footer.socialLinks];
                    newSocialLinks[index].url = e.target.value;
                    onFooterChange({ ...footer, socialLinks: newSocialLinks });
                  }}
                  disabled={!link.enabled}
                  size="small"
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
