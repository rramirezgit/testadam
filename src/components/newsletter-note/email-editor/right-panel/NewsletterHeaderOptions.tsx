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
  FormControl,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
} from '@mui/material';

interface NewsletterHeaderOptionsProps {
  selectedComponentId: string;
  selectedComponent: any;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

export default function NewsletterHeaderOptions({
  selectedComponentId,
  selectedComponent,
  updateComponentProps,
  updateComponentStyle,
}: NewsletterHeaderOptionsProps) {
  const props = selectedComponent?.props || {};

  const handlePropChange = (key: string, value: any) => {
    updateComponentProps(selectedComponentId, { [key]: value });
  };

  const handleGradientColorChange = (index: number, color: string) => {
    const newColors = [...(props.gradientColors || ['#287FA9', '#1E2B62'])]; // ; || ['#FFF9CE', '#E2E5FA'])]
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
        Configuración del Header de Newsletter
      </Typography>

      {/* Contenido Básico */}
      <Accordion defaultExpanded disableGutters sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2">Contenido</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Título"
              value={props.title || ''}
              onChange={(e) => handlePropChange('title', e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="Subtítulo"
              value={props.subtitle || ''}
              onChange={(e) => handlePropChange('subtitle', e.target.value)}
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
            <FormControl fullWidth size="small">
              <Typography variant="body2" gutterBottom>
                Alineación
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['left', 'center', 'right'].map((align) => (
                  <Box
                    key={align}
                    onClick={() => handlePropChange('alignment', align)}
                    sx={{
                      flex: 1,
                      p: 1,
                      border: 1,
                      borderColor: props.alignment === align ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      textAlign: 'center',
                      backgroundColor: props.alignment === align ? 'primary.light' : 'transparent',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Icon
                      icon={
                        align === 'left'
                          ? 'mdi:format-align-left'
                          : align === 'center'
                            ? 'mdi:format-align-center'
                            : 'mdi:format-align-right'
                      }
                    />
                  </Box>
                ))}
              </Box>
            </FormControl>

            <TextField
              fullWidth
              type="color"
              label="Color del Texto"
              value={props.textColor || '#333333'}
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
                  value={props.gradientColors?.[0] || '#FFF9CE'}
                  onChange={(e) => handleGradientColorChange(0, e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  type="color"
                  label="Color 2"
                  value={props.gradientColors?.[1] || '#E2E5FA'}
                  onChange={(e) => handleGradientColorChange(1, e.target.value)}
                  size="small"
                />
              </Stack>
            ) : (
              <TextField
                fullWidth
                type="color"
                label="Color de Fondo"
                value={props.backgroundColor || '#FFF9CE'}
                onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
                size="small"
              />
            )}

            {props.useGradient && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Dirección del Gradiente: {props.gradientDirection || 224}°
                </Typography>
                <Slider
                  value={props.gradientDirection || 224}
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
                Padding: {props.padding || 32}px
              </Typography>
              <Slider
                value={props.padding || 32}
                onChange={(e, value) => handlePropChange('padding', value)}
                min={8}
                max={80}
                step={4}
                size="small"
              />
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Logo */}
      <Accordion disableGutters sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2">Logo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={props.showLogo || false}
                  onChange={(e) => handlePropChange('showLogo', e.target.checked)}
                />
              }
              label="Mostrar Logo"
            />

            {props.showLogo && (
              <>
                <TextField
                  fullWidth
                  label="URL del Logo"
                  value={props.logo || ''}
                  onChange={(e) => handlePropChange('logo', e.target.value)}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Texto Alternativo"
                  value={props.logoAlt || ''}
                  onChange={(e) => handlePropChange('logoAlt', e.target.value)}
                  size="small"
                />
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Altura del Logo: {props.logoHeight || 60}px
                  </Typography>
                  <Slider
                    value={props.logoHeight || 60}
                    onChange={(e, value) => handlePropChange('logoHeight', value)}
                    min={20}
                    max={120}
                    step={5}
                    size="small"
                  />
                </Box>
              </>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Banner */}
      <Accordion disableGutters sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2">Banner</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={props.showBanner || false}
                  onChange={(e) => handlePropChange('showBanner', e.target.checked)}
                />
              }
              label="Mostrar Banner"
            />
            {props.showBanner && (
              <TextField
                fullWidth
                label="URL del Banner"
                value={props.bannerImage || ''}
                onChange={(e) => handlePropChange('bannerImage', e.target.value)}
                size="small"
                helperText="Imagen que aparecerá debajo del título"
              />
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Sponsor */}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
          <Typography variant="subtitle2">Sponsor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={props.sponsor?.enabled || false}
                  onChange={(e) =>
                    handlePropChange('sponsor', {
                      ...props.sponsor,
                      enabled: e.target.checked,
                    })
                  }
                />
              }
              label="Mostrar Sponsor"
            />

            {props.sponsor?.enabled && (
              <>
                <TextField
                  fullWidth
                  label="Etiqueta del Sponsor"
                  value={props.sponsor?.label || 'Juntos con'}
                  onChange={(e) =>
                    handlePropChange('sponsor', {
                      ...props.sponsor,
                      label: e.target.value,
                    })
                  }
                  size="small"
                />
                <TextField
                  fullWidth
                  label="URL de la Imagen"
                  value={props.sponsor?.image || ''}
                  onChange={(e) =>
                    handlePropChange('sponsor', {
                      ...props.sponsor,
                      image: e.target.value,
                    })
                  }
                  size="small"
                />
                <TextField
                  fullWidth
                  label="Texto Alternativo"
                  value={props.sponsor?.imageAlt || 'Sponsor'}
                  onChange={(e) =>
                    handlePropChange('sponsor', {
                      ...props.sponsor,
                      imageAlt: e.target.value,
                    })
                  }
                  size="small"
                />
              </>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
