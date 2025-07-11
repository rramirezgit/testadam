'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Switch,
  Slider,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  FormControlLabel,
} from '@mui/material';

import { ColorPicker } from '../../../color-utils';

interface NewsletterFooterReusableOptionsProps {
  selectedComponentId: string | null;
  selectedComponent: any;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  updateComponentStyle: (id: string, style: React.CSSProperties) => void;
}

const NewsletterFooterReusableOptions: React.FC<NewsletterFooterReusableOptionsProps> = ({
  selectedComponent,
  updateComponentProps,
  updateComponentStyle,
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
      updateProp('socialLinks', newSocialLinks);
    }
  };

  const addSocialLink = () => {
    const newSocialLinks = [
      ...(props.socialLinks || []),
      {
        platform: 'twitter',
        url: '',
        enabled: true,
      },
    ];
    updateProp('socialLinks', newSocialLinks);
  };

  const removeSocialLink = (index: number) => {
    const newSocialLinks = [...(props.socialLinks || [])];
    newSocialLinks.splice(index, 1);
    updateProp('socialLinks', newSocialLinks);
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
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Mostrar dirección
            </Typography>
            <Switch
              checked={props.showAddress || true}
              onChange={(e) => updateProp('showAddress', e.target.checked)}
              size="small"
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
          />

          <TextField
            label="Link de Cancelar Suscripción"
            value={props.unsubscribeLink || '#unsubscribe'}
            onChange={(e) => updateProp('unsubscribeLink', e.target.value)}
            fullWidth
            size="small"
            placeholder="#unsubscribe"
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
                      const colors = props.gradientColors || ['#f5f5f5', '#e0e0e0'];
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
                      const colors = props.gradientColors || ['#f5f5f5', '#e0e0e0'];
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
            />
          </Box>

          {props.showSocial && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {(props.socialLinks || []).map((link: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Red Social {index + 1}
                    </Typography>
                    <IconButton size="small" onClick={() => removeSocialLink(index)} color="error">
                      <Icon icon="mdi:delete" />
                    </IconButton>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={link.enabled || false}
                        onChange={(e) => handleSocialLinkChange(index, 'enabled', e.target.checked)}
                        size="small"
                      />
                    }
                    label="Habilitado"
                  />

                  <TextField
                    label="Plataforma"
                    value={link.platform || ''}
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="twitter, facebook, instagram..."
                  />

                  <TextField
                    label="URL"
                    value={link.url || ''}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="https://twitter.com/..."
                  />
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<Icon icon="mdi:plus" />}
                onClick={addSocialLink}
                fullWidth
              >
                Agregar Red Social
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NewsletterFooterReusableOptions;
