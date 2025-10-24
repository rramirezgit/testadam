'use client';

import { Icon } from '@iconify/react';

import {
  Box,
  AppBar,
  Switch,
  Slider,
  Toolbar,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { CONFIG, SOCIAL_ICONS } from 'src/global-config';

import type { NewsletterFooter } from '../../types';

interface NewsletterFooterViewProps {
  newsletterFooter: NewsletterFooter;
  onFooterChange: (footer: NewsletterFooter) => void;
  setSelectedComponentId: (id: string | null) => void;
}

export default function NewsletterFooterView({
  newsletterFooter,
  onFooterChange,
  setSelectedComponentId,
}: NewsletterFooterViewProps) {
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
            Configuración del Footer
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, height: 0, p: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
          Redes Sociales
        </Typography>
        {newsletterFooter.socialLinks.map((link, index) => {
          const platformName = link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
          const iconUrl = SOCIAL_ICONS[link.platform.toLowerCase()];

          return (
            <Box key={index} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label={`${platformName === 'X' || platformName === 'Twitter' ? 'X' : platformName}`}
                value={link.url}
                onChange={(e) => {
                  const newSocialLinks = [...newsletterFooter.socialLinks];
                  newSocialLinks[index].url = e.target.value;
                  // Automáticamente habilitar/deshabilitar según tenga URL
                  newSocialLinks[index].enabled = e.target.value.trim() !== '';
                  onFooterChange({ ...newsletterFooter, socialLinks: newSocialLinks });
                }}
                placeholder="/usuario"
                InputProps={{
                  startAdornment: iconUrl && (
                    <InputAdornment position="start">
                      <Box
                        component="img"
                        src={iconUrl}
                        alt={link.platform}
                        sx={{
                          width: 25,
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
                  },
                }}
              />
            </Box>
          );
        })}

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
          Logo
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={newsletterFooter.showLogo || false}
              onChange={(e) => onFooterChange({ ...newsletterFooter, showLogo: e.target.checked })}
            />
          }
          label="Mostrar Logo"
          sx={{ mb: 2 }}
        />
        {newsletterFooter.showLogo && (
          <>
            <TextField
              fullWidth
              label="URL del Logo"
              value={newsletterFooter.logo || CONFIG.defaultLogoUrl}
              onChange={(e) => onFooterChange({ ...newsletterFooter, logo: e.target.value })}
              placeholder={CONFIG.defaultLogoUrl}
              sx={{ mb: 2 }}
              size="small"
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Altura del Logo: {newsletterFooter.logoHeight || 40.218}px
              </Typography>
              <Slider
                value={newsletterFooter.logoHeight || 40.218}
                onChange={(e, value) =>
                  onFooterChange({ ...newsletterFooter, logoHeight: value as number })
                }
                min={20}
                max={100}
                step={0.1}
                valueLabelDisplay="auto"
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
