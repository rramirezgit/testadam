'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Switch,
  Slider,
  Divider,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { ColorPicker } from '../../../color-utils';

interface NewsletterHeaderReusableOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: any;
  updateComponentProps: (id: string, props: Record<string, any>, options?: { content?: string }) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  isViewOnly?: boolean;
}

const NewsletterHeaderReusableOptions: React.FC<NewsletterHeaderReusableOptionsProps> = ({
  selectedComponent,
  updateComponentProps,
  updateComponentStyle,
  isViewOnly = false,
}) => {
  const props = selectedComponent?.props || {};

  const updateProp = (key: string, value: any) => {
    if (updateComponentProps && selectedComponent) {
      updateComponentProps(selectedComponent.id, { [key]: value });
    }
  };

  const updateSponsorProp = (key: string, value: any) => {
    const currentSponsor = props.sponsor || {};
    updateProp('sponsor', { ...currentSponsor, [key]: value });
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* CONTENIDO */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:text-box" />
          Contenido
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Título"
            value={props.title || ''}
            onChange={(e) => updateProp('title', e.target.value)}
            fullWidth
            size="small"
            disabled={isViewOnly}
          />

          <TextField
            label="Subtítulo"
            value={props.subtitle || ''}
            onChange={(e) => updateProp('subtitle', e.target.value)}
            fullWidth
            multiline
            rows={2}
            size="small"
            disabled={isViewOnly}
          />
        </Box>
      </Box>

      <Divider />

      {/* DISEÑO Y COLORES */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:palette" />
          Diseño y Colores
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Alineación */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Alineación
            </Typography>
            <ToggleButtonGroup
              value={props.alignment || 'center'}
              exclusive
              onChange={(_, value) => value && updateProp('alignment', value)}
              size="small"
              fullWidth
              disabled={isViewOnly}
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
            </ToggleButtonGroup>
          </Box>

          {/* Color del texto */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Color del texto
            </Typography>
            <ColorPicker
              color={props.textColor || '#333333'}
              onChange={(color) => updateProp('textColor', color)}
            />
          </Box>

          {/* Fondo: Gradiente o Color Sólido */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Usar gradiente
              </Typography>
              <Switch
                checked={props.useGradient || false}
                onChange={(e) => updateProp('useGradient', e.target.checked)}
                size="small"
                disabled={isViewOnly}
              />
            </Box>

            {props.useGradient ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Color 1 del gradiente
                  </Typography>
                  <ColorPicker
                    color={props.gradientColors?.[0] || '#FFF9CE'}
                    onChange={(color) => {
                      const colors = props.gradientColors || ['#287FA9', '#1E2B62']; // ['#FFF9CE', '#E2E5FA'];
                      updateProp('gradientColors', [color, colors[1]]);
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Color 2 del gradiente
                  </Typography>
                  <ColorPicker
                    color={props.gradientColors?.[1] || '#E2E5FA'}
                    onChange={(color) => {
                      const colors = props.gradientColors || ['#287FA9', '#1E2B62']; // ['#FFF9CE', '#E2E5FA'];
                      updateProp('gradientColors', [colors[0], color]);
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Dirección: {props.gradientDirection || 135}°
                  </Typography>
                  <Slider
                    value={props.gradientDirection || 135}
                    onChange={(_, value) => updateProp('gradientDirection', value)}
                    min={0}
                    max={360}
                    step={45}
                    marks
                    size="small"
                    disabled={isViewOnly}
                  />
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Color de fondo
                </Typography>
                <ColorPicker
                  color={props.backgroundColor || '#f5f5f5'}
                  onChange={(color) => updateProp('backgroundColor', color)}
                />
              </Box>
            )}
          </Box>

          {/* Padding */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Espaciado: {props.padding || 24}px
            </Typography>
            <Slider
              value={props.padding || 24}
              onChange={(_, value) => updateProp('padding', value)}
              min={8}
              max={80}
              step={8}
              marks
              size="small"
              disabled={isViewOnly}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* LOGO */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:image" />
          Logo
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Mostrar logo
            </Typography>
            <Switch
              checked={props.showLogo || false}
              onChange={(e) => updateProp('showLogo', e.target.checked)}
              size="small"
              disabled={isViewOnly}
            />
          </Box>

          {props.showLogo && (
            <>
              <TextField
                label="URL del logo"
                value={props.logo || ''}
                onChange={(e) => updateProp('logo', e.target.value)}
                fullWidth
                size="small"
                placeholder="https://ejemplo.com/logo.png"
                disabled={isViewOnly}
              />

              <TextField
                label="Texto alternativo"
                value={props.logoAlt || ''}
                onChange={(e) => updateProp('logoAlt', e.target.value)}
                fullWidth
                size="small"
                placeholder="Descripción del logo"
                disabled={isViewOnly}
              />

              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Altura del logo: {props.logoHeight || 60}px
                </Typography>
                <Slider
                  value={props.logoHeight || 60}
                  onChange={(_, value) => updateProp('logoHeight', value)}
                  min={30}
                  max={120}
                  step={10}
                  marks
                  size="small"
                  disabled={isViewOnly}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Divider />

      {/* BANNER */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:image-multiple" />
          Banner
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Mostrar banner
            </Typography>
            <Switch
              checked={props.showBanner || false}
              onChange={(e) => updateProp('showBanner', e.target.checked)}
              size="small"
              disabled={isViewOnly}
            />
          </Box>

          {props.showBanner && (
            <TextField
              label="URL del banner"
              value={props.bannerImage || ''}
              onChange={(e) => updateProp('bannerImage', e.target.value)}
              fullWidth
              size="small"
              placeholder="https://ejemplo.com/banner.jpg"
              disabled={isViewOnly}
            />
          )}
        </Box>
      </Box>

      <Divider />

      {/* SPONSOR */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:handshake" />
          Sponsor
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Mostrar sponsor
            </Typography>
            <Switch
              checked={props.sponsor?.enabled || false}
              onChange={(e) => updateSponsorProp('enabled', e.target.checked)}
              size="small"
              disabled={isViewOnly}
            />
          </Box>

          {props.sponsor?.enabled && (
            <>
              <TextField
                label="Etiqueta del sponsor"
                value={props.sponsor?.label || ''}
                onChange={(e) => updateSponsorProp('label', e.target.value)}
                fullWidth
                size="small"
                placeholder="Juntos con"
                disabled={isViewOnly}
              />

              <TextField
                label="URL de la imagen del sponsor"
                value={props.sponsor?.image || ''}
                onChange={(e) => updateSponsorProp('image', e.target.value)}
                fullWidth
                size="small"
                placeholder="https://ejemplo.com/sponsor.png"
                disabled={isViewOnly}
              />

              <TextField
                label="Texto alternativo"
                value={props.sponsor?.imageAlt || ''}
                onChange={(e) => updateSponsorProp('imageAlt', e.target.value)}
                fullWidth
                size="small"
                placeholder="Logo del sponsor"
                disabled={isViewOnly}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NewsletterHeaderReusableOptions;
