'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Stack,
  Switch,
  Slider,
  TextField,
  Accordion,
  Typography,
  IconButton,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
} from '@mui/material';

interface NewsletterFooterOptionsProps {
  selectedComponentId: string;
  selectedComponent: any;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

export default function NewsletterFooterOptions({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
  updateComponentStyle,
}: NewsletterFooterOptionsProps) {
  const props = selectedComponent?.props || {};

  const handlePropChange = (key: string, value: any) => {
    updateComponentProps(selectedComponentId, { [key]: value });
  };

  const handleGradientColorChange = (index: number, color: string) => {
    const newColors = [...(props.gradientColors || ['#f5f5f5', '#e0e0e0'])];
    newColors[index] = color;
    handlePropChange('gradientColors', newColors);
  };

  const handleSocialLinkChange = (index: number, field: string, value: any) => {
    const newSocialLinks = [...(props.socialLinks || [])];
    if (newSocialLinks[index]) {
      newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
      handlePropChange('socialLinks', newSocialLinks);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Configuración del Footer
      </Typography>

      {/* Información de la Empresa */}
      <Accordion defaultExpanded disableGutters sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2">Información de la Empresa</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Nombre de la Empresa"
              value={props.companyName || ''}
              onChange={(e) => handlePropChange('companyName', e.target.value)}
              size="small"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={props.showAddress || true}
                  onChange={(e) => handlePropChange('showAddress', e.target.checked)}
                />
              }
              label="Mostrar Dirección"
            />

            {props.showAddress && (
              <TextField
                fullWidth
                label="Dirección"
                value={props.address || ''}
                onChange={(e) => handlePropChange('address', e.target.value)}
                multiline
                rows={2}
                size="small"
              />
            )}

            <TextField
              fullWidth
              label="Email de Contacto"
              type="email"
              value={props.contactEmail || ''}
              onChange={(e) => handlePropChange('contactEmail', e.target.value)}
              size="small"
            />

            <TextField
              fullWidth
              label="Link de Cancelar Suscripción"
              value={props.unsubscribeLink || '#unsubscribe'}
              onChange={(e) => handlePropChange('unsubscribeLink', e.target.value)}
              size="small"
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Diseño y Colores */}
      <Accordion disableGutters sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2">Diseño y Colores</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              fullWidth
              type="color"
              label="Color del Texto"
              value={props.textColor || '#666666'}
              onChange={(e) => handlePropChange('textColor', e.target.value)}
              size="small"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={props.useGradient || false}
                  onChange={(e) => handlePropChange('useGradient', e.target.checked)}
                />
              }
              label="Usar Gradiente"
            />

            {props.useGradient ? (
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  type="color"
                  label="Color 1"
                  value={props.gradientColors?.[0] || '#f5f5f5'}
                  onChange={(e) => handleGradientColorChange(0, e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  type="color"
                  label="Color 2"
                  value={props.gradientColors?.[1] || '#e0e0e0'}
                  onChange={(e) => handleGradientColorChange(1, e.target.value)}
                  size="small"
                />
              </Stack>
            ) : (
              <TextField
                fullWidth
                type="color"
                label="Color de Fondo"
                value={props.backgroundColor || '#f5f5f5'}
                onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
                size="small"
              />
            )}

            {props.useGradient && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Dirección del Gradiente: {props.gradientDirection || 180}°
                </Typography>
                <Slider
                  value={props.gradientDirection || 180}
                  onChange={(e, value) => handlePropChange('gradientDirection', value)}
                  min={0}
                  max={360}
                  step={1}
                  size="small"
                />
              </Box>
            )}

            <Box>
              <Typography variant="body2" gutterBottom>
                Padding: {props.padding || 24}px
              </Typography>
              <Slider
                value={props.padding || 24}
                onChange={(e, value) => handlePropChange('padding', value)}
                min={8}
                max={60}
                step={4}
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="body2" gutterBottom>
                Tamaño de Fuente: {props.fontSize || 12}px
              </Typography>
              <Slider
                value={props.fontSize || 12}
                onChange={(e, value) => handlePropChange('fontSize', value)}
                min={8}
                max={18}
                step={1}
                size="small"
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Redes Sociales */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2">Redes Sociales</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={props.showSocial || true}
                  onChange={(e) => handlePropChange('showSocial', e.target.checked)}
                />
              }
              label="Mostrar Redes Sociales"
            />

            {props.showSocial && (
              <>
                <Typography variant="body2" color="text.secondary">
                  Configura las redes sociales que aparecerán en el footer
                </Typography>

                {(
                  props.socialLinks || [
                    { platform: 'twitter', url: 'https://twitter.com', enabled: true },
                    { platform: 'facebook', url: 'https://facebook.com', enabled: true },
                    { platform: 'instagram', url: 'https://instagram.com', enabled: true },
                    { platform: 'linkedin', url: 'https://linkedin.com', enabled: false },
                  ]
                ).map((link: any, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      backgroundColor: link.enabled ? 'action.hover' : 'action.disabled',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                        {link.platform}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleSocialLinkChange(index, 'enabled', !link.enabled)}
                        color={link.enabled ? 'primary' : 'default'}
                      >
                        <Icon icon={link.enabled ? 'mdi:eye' : 'mdi:eye-off'} />
                      </IconButton>
                    </Box>
                    <TextField
                      fullWidth
                      label={`URL de ${link.platform}`}
                      value={link.url || ''}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      disabled={!link.enabled}
                      size="small"
                    />
                  </Box>
                ))}
              </>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
