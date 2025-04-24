'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import Grid from '@mui/material/Grid';
import {
  Box,
  Dialog,
  Button,
  Switch,
  Slider,
  TextField,
  Typography,
  DialogTitle,
  FormControlLabel,
} from '@mui/material';

import ColorPicker from 'src/components/newsletter-note/color-picker';

import LogoDialog from './logo-dialog';
import BannerDialog from './banner-dialog';

import type { HeaderDialogProps } from '../types';

export default function HeaderDialog({ open, onClose, header, setHeader }: HeaderDialogProps) {
  const [openLogoDialog, setOpenLogoDialog] = useState(false);
  const [openBannerDialog, setOpenBannerDialog] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');

  const handleGradientColorChange = (index: number, color: string) => {
    const newGradientColors = [...(header.gradientColors || ['#f6f9fc', '#e9f2ff'])];
    newGradientColors[index] = color;
    setHeader({ ...header, gradientColors: newGradientColors });
  };

  const handleGradientDirectionChange = (event: Event, newValue: number | number[]) => {
    setHeader({ ...header, gradientDirection: newValue as number });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Newsletter Header</DialogTitle>
        <Box sx={{ px: 3, pb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Header Title"
                value={header.title}
                onChange={(e) => setHeader({ ...header, title: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Subtitle"
                value={header.subtitle}
                onChange={(e) => setHeader({ ...header, subtitle: e.target.value })}
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Text Alignment
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Button
                      variant={header.alignment === 'left' ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: 'left' })}
                    >
                      <Icon icon="mdi:format-align-left" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant={header.alignment === 'center' ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: 'center' })}
                    >
                      <Icon icon="mdi:format-align-center" />
                    </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant={header.alignment === 'right' ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => setHeader({ ...header, alignment: 'right' })}
                    >
                      <Icon icon="mdi:format-align-right" />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Background Style
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={header.useGradient || false}
                      onChange={(e) => setHeader({ ...header, useGradient: e.target.checked })}
                    />
                  }
                  label="Use Gradient Background"
                />

                {header.useGradient ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Gradient Colors
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" display="block" gutterBottom>
                          Start Color
                        </Typography>
                        <ColorPicker
                          color={(header.gradientColors && header.gradientColors[0]) || '#f6f9fc'}
                          onChange={(color) => handleGradientColorChange(0, color)}
                          label="Start"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" display="block" gutterBottom>
                          End Color
                        </Typography>
                        <ColorPicker
                          color={(header.gradientColors && header.gradientColors[1]) || '#e9f2ff'}
                          onChange={(color) => handleGradientColorChange(1, color)}
                          label="End"
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Gradient Direction: {header.gradientDirection || 180}°
                      </Typography>
                      <Slider
                        value={header.gradientDirection || 180}
                        onChange={handleGradientDirectionChange}
                        min={0}
                        max={360}
                        step={45}
                        marks={[
                          { value: 0, label: '0°' },
                          { value: 90, label: '90°' },
                          { value: 180, label: '180°' },
                          { value: 270, label: '270°' },
                          { value: 360, label: '360°' },
                        ]}
                        sx={{ mt: 1 }}
                      />
                      <Box sx={{ mt: 2, p: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: '40px',
                            borderRadius: '4px',
                            background: `linear-gradient(${header.gradientDirection || 180}deg, ${(header.gradientColors && header.gradientColors[0]) || '#f6f9fc'}, ${(header.gradientColors && header.gradientColors[1]) || '#e9f2ff'})`,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ mt: 1, display: 'block', textAlign: 'center' }}
                        >
                          Vista previa del gradiente
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block" gutterBottom>
                        Background
                      </Typography>
                      <ColorPicker
                        color={header.backgroundColor}
                        onChange={(color) => setHeader({ ...header, backgroundColor: color })}
                        label="Background"
                      />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" display="block" gutterBottom>
                        Text Color
                      </Typography>
                      <ColorPicker
                        color={header.textColor}
                        onChange={(color) => setHeader({ ...header, textColor: color })}
                        label="Text"
                      />
                    </Box>
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Logo
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Logo URL"
                    value={header.logo || ''}
                    onChange={(e) => setHeader({ ...header, logo: e.target.value })}
                  />
                  <Button
                    variant="outlined"
                    sx={{ ml: 1, minWidth: 'auto' }}
                    onClick={() => setOpenLogoDialog(true)}
                  >
                    <Icon icon="mdi:upload" />
                  </Button>
                </Box>
                {header.logo && (
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <img
                      src={header.logo || '/placeholder.svg'}
                      alt="Logo"
                      style={{ maxHeight: '50px' }}
                    />
                  </Box>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Banner Image
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Banner Image URL"
                    value={header.bannerImage || ''}
                    onChange={(e) => setHeader({ ...header, bannerImage: e.target.value })}
                  />
                  <Button
                    variant="outlined"
                    sx={{ ml: 1, minWidth: 'auto' }}
                    onClick={() => setOpenBannerDialog(true)}
                  >
                    <Icon icon="mdi:upload" />
                  </Button>
                </Box>
                {header.bannerImage && (
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <img
                      src={header.bannerImage || '/placeholder.svg'}
                      alt="Banner"
                      style={{ maxWidth: '100%' }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={onClose}>
              Apply
            </Button>
          </Box>
        </Box>
      </Dialog>

      <LogoDialog
        open={openLogoDialog}
        onClose={() => setOpenLogoDialog(false)}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
        onSave={(url: string) => {
          if (url) {
            setHeader({ ...header, logo: url });
          }
          setOpenLogoDialog(false);
        }}
      />

      <BannerDialog
        open={openBannerDialog}
        onClose={() => setOpenBannerDialog(false)}
        bannerImageUrl={bannerImageUrl}
        setBannerImageUrl={setBannerImageUrl}
        onSave={(url: string) => {
          if (url) {
            setHeader({ ...header, bannerImage: url });
          }
          setOpenBannerDialog(false);
        }}
      />
    </>
  );
}
