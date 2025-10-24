'use client';

import { Icon } from '@iconify/react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  AppBar,
  Button,
  Switch,
  Toolbar,
  Accordion,
  TextField,
  Typography,
  IconButton,
  LinearProgress,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
} from '@mui/material';

import { CONFIG } from 'src/global-config';

import { isBase64Image } from '../../utils/imageValidation';

import type { NewsletterHeader } from '../../types';

interface NewsletterHeaderViewProps {
  newsletterHeader: NewsletterHeader;
  onHeaderChange: (header: NewsletterHeader) => void;
  handleLogoFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSponsorFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadLogoToS3: () => Promise<void>;
  handleUploadSponsorToS3: () => Promise<void>;
  uploading: boolean;
  uploadProgress: number;
  setSelectedComponentId: (id: string | null) => void;
}

export default function NewsletterHeaderView({
  newsletterHeader,
  onHeaderChange,
  handleLogoFileChange,
  handleSponsorFileChange,
  handleUploadLogoToS3,
  handleUploadSponsorToS3,
  uploading,
  uploadProgress,
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

        {/* Logo */}
        <Accordion disableGutters sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>Logo</AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Switch
                  checked={newsletterHeader.showLogo}
                  onChange={(e) => {
                    const newShowLogo = e.target.checked;
                    const defaultLogo = CONFIG.defaultLogoUrl;
                    onHeaderChange({
                      ...newsletterHeader,
                      showLogo: newShowLogo,
                      logo:
                        newShowLogo && !newsletterHeader.logo ? defaultLogo : newsletterHeader.logo,
                    });
                  }}
                  color="primary"
                />
              }
              label="Mostrar Logo"
            />

            {newsletterHeader.showLogo && (
              <>
                {/* Vista previa del logo */}
                {newsletterHeader.logo && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Vista previa:
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '200px' }}>
                      <img
                        src={newsletterHeader.logo}
                        alt="Logo preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '80px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                        }}
                      />
                      {isBase64Image(newsletterHeader.logo) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(255, 152, 0, 0.9)',
                            color: 'white',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Icon icon="mdi:cloud-upload-outline" fontSize="12px" />
                          Subir a S3
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Botón para seleccionar imagen */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Icon icon="mdi:image-plus" />}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif';
                    input.onchange = (e) => handleLogoFileChange(e as any);
                    input.click();
                  }}
                  sx={{ mb: 2 }}
                >
                  {newsletterHeader.logo ? 'Cambiar Logo' : 'Seleccionar Logo'}
                </Button>

                {/* Campo URL manual */}
                <TextField
                  fullWidth
                  label="URL del Logo (opcional)"
                  value={newsletterHeader.logo || ''}
                  onChange={(e) => onHeaderChange({ ...newsletterHeader, logo: e.target.value })}
                  placeholder="https://ejemplo.com/logo.png"
                  size="small"
                  sx={{ mb: 2 }}
                />

                {/* Altura del logo */}
                <TextField
                  fullWidth
                  type="number"
                  label="Altura del Logo (px)"
                  value={newsletterHeader.logoHeight || 40}
                  onChange={(e) =>
                    onHeaderChange({
                      ...newsletterHeader,
                      logoHeight: parseInt(e.target.value) || 40,
                    })
                  }
                  inputProps={{ min: 20, max: 200 }}
                  size="small"
                />

                {/* Botón de subida a S3 */}
                {newsletterHeader.logo && isBase64Image(newsletterHeader.logo) && (
                  <>
                    {uploading && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Subiendo: {uploadProgress}%
                        </Typography>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                      </Box>
                    )}
                    <LoadingButton
                      variant="contained"
                      color="warning"
                      fullWidth
                      startIcon={<Icon icon="mdi:cloud-upload" />}
                      onClick={handleUploadLogoToS3}
                      loading={uploading}
                      sx={{ mb: 2 }}
                    >
                      ⚠️ Subir Logo a S3 (Requerido)
                    </LoadingButton>
                  </>
                )}
              </>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Sponsor */}
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>Sponsor</AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Switch
                  checked={newsletterHeader.sponsor?.enabled || false}
                  onChange={(e) =>
                    onHeaderChange({
                      ...newsletterHeader,
                      sponsor: { ...newsletterHeader.sponsor, enabled: e.target.checked },
                    })
                  }
                  color="primary"
                />
              }
              label="Mostrar Sponsor"
            />
            {newsletterHeader.sponsor?.enabled && (
              <>
                <TextField
                  fullWidth
                  label="Texto del Sponsor"
                  value={newsletterHeader.sponsor?.label || ''}
                  onChange={(e) =>
                    onHeaderChange({
                      ...newsletterHeader,
                      sponsor: { ...newsletterHeader.sponsor, label: e.target.value },
                    })
                  }
                  sx={{ mb: 2, mt: 2 }}
                />

                {/* Vista previa de la imagen del sponsor */}
                {newsletterHeader.sponsor?.image && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Vista previa:
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '200px' }}>
                      <img
                        src={newsletterHeader.sponsor.image}
                        alt="Sponsor preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '60px',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0',
                        }}
                      />
                      {isBase64Image(newsletterHeader.sponsor.image) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(255, 152, 0, 0.9)',
                            color: 'white',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Icon icon="mdi:cloud-upload-outline" fontSize="12px" />
                          Subir a S3
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Botón para seleccionar imagen */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Icon icon="mdi:image-plus" />}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/png,image/jpeg,image/jpg,image/webp,image/gif';
                    input.onchange = (e) => handleSponsorFileChange(e as any);
                    input.click();
                  }}
                  sx={{ mb: 2 }}
                >
                  {newsletterHeader.sponsor?.image
                    ? 'Cambiar Imagen Sponsor'
                    : 'Seleccionar Imagen Sponsor'}
                </Button>

                {/* Campo URL manual */}
                <TextField
                  fullWidth
                  label="URL de la imagen (opcional)"
                  value={newsletterHeader.sponsor?.image || ''}
                  onChange={(e) =>
                    onHeaderChange({
                      ...newsletterHeader,
                      sponsor: { ...newsletterHeader.sponsor, image: e.target.value },
                    })
                  }
                  placeholder="https://ejemplo.com/sponsor.png"
                  size="small"
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Alt de la imagen"
                  value={newsletterHeader.sponsor?.imageAlt || ''}
                  onChange={(e) =>
                    onHeaderChange({
                      ...newsletterHeader,
                      sponsor: { ...newsletterHeader.sponsor, imageAlt: e.target.value },
                    })
                  }
                  size="small"
                />

                {/* Botón de subida a S3 */}
                {newsletterHeader.sponsor?.image &&
                  isBase64Image(newsletterHeader.sponsor.image) && (
                    <>
                      {uploading && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Subiendo: {uploadProgress}%
                          </Typography>
                          <LinearProgress variant="determinate" value={uploadProgress} />
                        </Box>
                      )}
                      <LoadingButton
                        variant="contained"
                        color="warning"
                        fullWidth
                        startIcon={<Icon icon="mdi:cloud-upload" />}
                        onClick={handleUploadSponsorToS3}
                        loading={uploading}
                        sx={{ mb: 2 }}
                      >
                        ⚠️ Subir Imagen Sponsor a S3 (Requerido)
                      </LoadingButton>
                    </>
                  )}
              </>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
