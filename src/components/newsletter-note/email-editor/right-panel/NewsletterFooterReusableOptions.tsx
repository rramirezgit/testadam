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
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { CONFIG, SOCIAL_ICONS } from 'src/global-config';

import { ColorPicker } from '../../../color-utils';
import SimpleTipTapEditor from '../../simple-tiptap-editor';

interface NewsletterFooterReusableOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: any;
  updateComponentProps: (id: string, props: Record<string, any>, options?: { content?: string }) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
  isViewOnly?: boolean;
}

const NewsletterFooterReusableOptions: React.FC<NewsletterFooterReusableOptionsProps> = ({
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

  const handleSocialLinkChange = (index: number, field: string, value: any) => {
    const newSocialLinks = [...(props.socialLinks || [])];
    if (newSocialLinks[index]) {
      newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
      // Automáticamente habilitar/deshabilitar según tenga URL
      if (field === 'url') {
        newSocialLinks[index].enabled = value.trim() !== '';
      }
      updateProp('socialLinks', newSocialLinks);
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* INFORMACIÓN DE LA EMPRESA */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:office-building" />
          Información de la Empresa
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nombre de la Empresa"
            value={props.companyName || ''}
            onChange={(e) => updateProp('companyName', e.target.value)}
            fullWidth
            size="small"
            placeholder="Tu Empresa"
            disabled={isViewOnly}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Mostrar dirección
            </Typography>
            <Switch
              checked={props.showAddress || true}
              onChange={(e) => updateProp('showAddress', e.target.checked)}
              size="small"
              disabled={isViewOnly}
            />
          </Box>

          {props.showAddress && (
            <TextField
              label="Dirección"
              value={props.address || ''}
              onChange={(e) => updateProp('address', e.target.value)}
              fullWidth
              multiline
              rows={2}
              size="small"
              placeholder="Calle, Ciudad, País"
              disabled={isViewOnly}
            />
          )}

          <TextField
            label="Email de Contacto"
            type="email"
            value={props.contactEmail || ''}
            onChange={(e) => updateProp('contactEmail', e.target.value)}
            fullWidth
            size="small"
            placeholder="contacto@tuempresa.com"
            disabled={isViewOnly}
          />

          <TextField
            label="Link de Cancelar Suscripción"
            value={props.unsubscribeLink || '#unsubscribe'}
            onChange={(e) => updateProp('unsubscribeLink', e.target.value)}
            fullWidth
            size="small"
            placeholder="#unsubscribe"
            disabled={isViewOnly}
          />
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
          <FormControlLabel
            control={
              <Switch
                checked={props.showLogo || false}
                onChange={(e) => updateProp('showLogo', e.target.checked)}
                size="small"
                disabled={isViewOnly}
              />
            }
            label="Mostrar Logo"
          />

          {props.showLogo && (
            <>
              <TextField
                label="URL del Logo"
                value={props.logo || CONFIG.defaultLogoUrl}
                onChange={(e) => updateProp('logo', e.target.value)}
                placeholder={CONFIG.defaultLogoUrl}
                fullWidth
                size="small"
                disabled={isViewOnly}
              />
              <Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                  Altura del Logo: {props.logoHeight || 40.218}px
                </Typography>
                <Slider
                  value={props.logoHeight || 40.218}
                  onChange={(e, value) => updateProp('logoHeight', value)}
                  min={20}
                  max={100}
                  step={0.1}
                  valueLabelDisplay="auto"
                  disabled={isViewOnly}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>

      <Divider />

      {/* TEXTO DEL FOOTER */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:text" />
          Texto del Footer
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              position: 'relative',
              pointerEvents: isViewOnly ? 'none' : 'auto',
              opacity: isViewOnly ? 0.6 : 1,
            }}
          >
            <SimpleTipTapEditor
              content={props.footerText || ''}
              onChange={(content) => updateProp('footerText', content)}
              showToolbar
              placeholder="Este correo electrónico se le envió como miembro registrado..."
              style={{ minHeight: '100px' }}
            />
          </Box>
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
          {/* Color del texto */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Color del texto
            </Typography>
            <ColorPicker
              color={props.textColor || '#666666'}
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
                    color={props.gradientColors?.[0] || '#f5f5f5'}
                    onChange={(color) => {
                      const colors = props.gradientColors || ['#287FA9', '#1E2B62']; // ['#f5f5f5', '#e0e0e0'];
                      updateProp('gradientColors', [color, colors[1]]);
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Color 2 del gradiente
                  </Typography>
                  <ColorPicker
                    color={props.gradientColors?.[1] || '#e0e0e0'}
                    onChange={(color) => {
                      const colors = props.gradientColors || ['#287FA9', '#1E2B62']; // ['#f5f5f5', '#e0e0e0'];
                      updateProp('gradientColors', [colors[0], color]);
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Dirección: {props.gradientDirection || 180}°
                  </Typography>
                  <Slider
                    value={props.gradientDirection || 180}
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
              max={60}
              step={4}
              marks
              size="small"
              disabled={isViewOnly}
            />
          </Box>

          {/* Tamaño de fuente */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Tamaño de fuente: {props.fontSize || 14}px
            </Typography>
            <Slider
              value={props.fontSize || 14}
              onChange={(_, value) => updateProp('fontSize', value)}
              min={10}
              max={24}
              step={1}
              marks
              size="small"
              disabled={isViewOnly}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* REDES SOCIALES */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon="mdi:share-variant" />
          Redes Sociales
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Mostrar redes sociales
            </Typography>
            <Switch
              checked={props.showSocial || false}
              onChange={(e) => updateProp('showSocial', e.target.checked)}
              size="small"
              disabled={isViewOnly}
            />
          </Box>

          {props.showSocial && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(props.socialLinks || []).map((link: any, index: number) => {
                const platformName = link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
                const iconUrl = SOCIAL_ICONS[link.platform.toLowerCase()];

                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color: '#637381',
                        mb: 0.5,
                      }}
                    >
                      {platformName === 'X' || platformName === 'Twitter' ? 'X' : platformName}
                    </Typography>

                    <TextField
                      value={link.url || ''}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      fullWidth
                      size="small"
                      placeholder="/usuario"
                      disabled={isViewOnly}
                      InputProps={{
                        startAdornment: iconUrl && (
                          <InputAdornment position="start">
                            <Box
                              component="img"
                              src={iconUrl}
                              alt={link.platform}
                              sx={{
                                width: 20,
                                height: 20,
                                display: 'block',
                                opacity: 0.7,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'white',
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NewsletterFooterReusableOptions;
