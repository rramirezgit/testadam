'use client';

import { Icon } from '@iconify/react';
import React, { useRef, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Tab,
  Tabs,
  Stack,
  Alert,
  Switch,
  Button,
  TextField,
  Accordion,
  Typography,
  IconButton,
  LinearProgress,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
} from '@mui/material';

import { isBase64Image } from './utils/imageValidation';
import { useImageUpload } from './right-panel/useImageUpload';

import type { NewsletterNote, NewsletterHeader, NewsletterFooter } from './types';

// Definición de temas predefinidos
const NEWSLETTER_THEMES = [
  {
    id: 'default',
    name: 'Default Adac',
    gradientColors: ['#FFF9CE', '#E2E5FA'],
    gradientDirection: 135,
    textColor: '#1e293b', // Texto oscuro para fondos claros
  },
  {
    id: 'warm',
    name: 'Calidez Sutil',
    gradientColors: ['#fef7ed', '#fed7aa'],
    gradientDirection: 135,
    textColor: '#7c2d12', // Texto marrón oscuro
  },
  {
    id: 'ocean',
    name: 'Brisa Marina',
    gradientColors: ['#f0f9ff', '#bae6fd'],
    gradientDirection: 135,
    textColor: '#0c4a6e', // Texto azul oscuro
  },
  {
    id: 'forest',
    name: 'Verde Sereno',
    gradientColors: ['#f0fdf4', '#bbf7d0'],
    gradientDirection: 135,
    textColor: '#14532d', // Texto verde oscuro
  },
  {
    id: 'lavender',
    name: 'Lavanda Suave',
    gradientColors: ['#faf5ff', '#e9d5ff'],
    gradientDirection: 135,
    textColor: '#581c87', // Texto púrpura oscuro
  },
  {
    id: 'rose',
    name: 'Rosa Delicado',
    gradientColors: ['#fff1f2', '#fecdd3'],
    gradientDirection: 135,
    textColor: '#881337', // Texto rosa oscuro
  },
  {
    id: 'golden',
    name: 'Dorado Refinado',
    gradientColors: ['#fffbeb', '#fde68a'],
    gradientDirection: 135,
    textColor: '#92400e', // Texto ámbar oscuro
  },
  {
    id: 'slate',
    name: 'Gris Sofisticado',
    gradientColors: ['#f8fafc', '#cbd5e1'],
    gradientDirection: 135,
    textColor: '#0f172a', // Texto muy oscuro
  },
];

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

  // Referencias para inputs de archivo
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const sponsorFileInputRef = useRef<HTMLInputElement>(null);

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // Función para manejar selección de archivo de logo
  const handleSelectLogoImage = () => {
    logoFileInputRef.current?.click();
  };

  // Función para manejar selección de archivo de banner
  const handleSelectBannerImage = () => {
    bannerFileInputRef.current?.click();
  };

  // Función para manejar selección de archivo de sponsor
  const handleSelectSponsorImage = () => {
    sponsorFileInputRef.current?.click();
  };

  // Función para manejar cambio de archivo de logo
  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onHeaderChange({ ...header, logo: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar cambio de archivo de banner
  const handleBannerFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onHeaderChange({ ...header, bannerImage: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar cambio de archivo de sponsor
  const handleSponsorFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onHeaderChange({
          ...header,
          sponsor: {
            ...header.sponsor,
            image: base64,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir logo a S3
  const handleUploadLogoToS3 = async () => {
    if (!header.logo || !isBase64Image(header.logo)) {
      alert('No hay imagen de logo para subir o ya está subida');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(header.logo, `newsletter_logo_${Date.now()}`);
      onHeaderChange({ ...header, logo: s3Url });
    } catch (error) {
      alert('Error al subir la imagen del logo a S3');
      console.error(error);
    }
  };

  // Función para subir banner a S3
  const handleUploadBannerToS3 = async () => {
    if (!header.bannerImage || !isBase64Image(header.bannerImage)) {
      alert('No hay imagen de banner para subir o ya está subida');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(header.bannerImage, `newsletter_banner_${Date.now()}`);
      onHeaderChange({ ...header, bannerImage: s3Url });
    } catch (error) {
      alert('Error al subir la imagen del banner a S3');
      console.error(error);
    }
  };

  // Función para subir imagen de sponsor a S3
  const handleUploadSponsorToS3 = async () => {
    if (!header.sponsor?.image || !isBase64Image(header.sponsor.image)) {
      alert('No hay imagen de sponsor para subir o ya está subida');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(header.sponsor.image, `newsletter_sponsor_${Date.now()}`);
      onHeaderChange({
        ...header,
        sponsor: {
          ...header.sponsor,
          image: s3Url,
        },
      });
    } catch (error) {
      alert('Error al subir la imagen del sponsor a S3');
      console.error(error);
    }
  };

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
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Información General
            </Typography>
            <TextField
              fullWidth
              label="Título del Newsletter"
              value={newsletterTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              sx={{ mb: 2 }}
              required
              error={!newsletterTitle || !newsletterTitle.trim()}
              helperText={
                !newsletterTitle || !newsletterTitle.trim() ? 'El título es obligatorio' : ''
              }
            />
            <TextField
              fullWidth
              label="Descripción"
              value={newsletterDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            {/* Sistema de Temas Simplificado */}
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
              🎨 Temas de Color
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selecciona un tema para aplicar al header del newsletter
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 2,
                mb: 3,
              }}
            >
              {NEWSLETTER_THEMES.map((theme) => (
                <Box
                  key={theme.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#1976d2',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => {
                    console.log('🎨 Aplicando tema:', theme.name);
                    console.log('📊 Header ANTES:', header);
                    console.log('📊 Footer ANTES:', footer);

                    // Lógica simple como el footer - APLICAR A AMBOS
                    const newHeader = {
                      ...header,
                      useGradient: true,
                      gradientColors: theme.gradientColors,
                      gradientDirection: theme.gradientDirection,
                      textColor: theme.textColor, // Color de texto que hace contraste
                    };

                    const newFooter = {
                      ...footer,
                      useGradient: true,
                      gradientColors: theme.gradientColors,
                      gradientDirection: theme.gradientDirection,
                      textColor: theme.textColor, // Color de texto que hace contraste
                    };

                    console.log('📤 Header NUEVO:', newHeader);
                    console.log('📤 Footer NUEVO:', newFooter);

                    onHeaderChange(newHeader);
                    onFooterChange(newFooter);

                    console.log('✅ Cambios aplicados');
                  }}
                >
                  {/* Vista previa del gradiente */}
                  <Box
                    sx={{
                      height: 50,
                      borderRadius: 1,
                      mb: 1,
                      backgroundImage: `linear-gradient(${theme.gradientDirection}deg, ${theme.gradientColors[0]} 0%, ${theme.gradientColors[1]} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.textColor, // Usar el color de texto del tema
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      border: '1px solid rgba(0,0,0,0.1)', // Borde sutil para definir mejor
                    }}
                  >
                    {theme.name}
                  </Box>
                </Box>
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
              Notas Seleccionadas ({selectedNotes.length})
            </Typography>
            {selectedNotes.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay notas seleccionadas para este newsletter.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {selectedNotes.map((note, index) => (
                  <Box
                    key={note.noteId}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {note.noteData?.title || 'Sin título'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {note.noteData?.summary || 'Sin resumen'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                        color="error"
                        onClick={() => onRemoveNote(note.noteId)}
                      >
                        <Icon icon="mdi:delete" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={onUndoChanges}
                startIcon={<Icon icon="mdi:undo" />}
              >
                Deshacer Cambios
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={onResetConfiguration}
                startIcon={<Icon icon="mdi:refresh" />}
              >
                Resetear Todo
              </Button>
            </Box>
          </Box>
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

            {/* Logo */}
            <Accordion disableGutters sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<Icon icon="mdi:chevron-down" />}>
                Logo
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={header.showLogo}
                        onChange={(e) => {
                          const newShowLogo = e.target.checked;
                          const defaultLogo =
                            'https://s3.amazonaws.com/s3.condoor.ai/adam/d5a5c0e8d1.png';
                          onHeaderChange({
                            ...header,
                            showLogo: newShowLogo,
                            logo: newShowLogo && !header.logo ? defaultLogo : header.logo,
                          });
                        }}
                        color="primary"
                      />
                    }
                    label="Mostrar Logo"
                  />

                  {header.showLogo && (
                    <>
                      {/* Vista previa del logo */}
                      {header.logo && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Vista previa:
                          </Typography>
                          <Box
                            sx={{
                              position: 'relative',
                              display: 'inline-block',
                              maxWidth: '200px',
                            }}
                          >
                            <img
                              src={header.logo}
                              alt="Logo preview"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '80px',
                                borderRadius: '4px',
                                border: '1px solid #e0e0e0',
                              }}
                            />
                            {isBase64Image(header.logo) && (
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

                      {/* Alertas de estado */}
                      {header.logo && isBase64Image(header.logo) && (
                        <Alert severity="warning" sx={{ mb: 2, fontSize: '0.875rem' }}>
                          ⚠️ Esta imagen debe subirse a S3 antes de guardar
                        </Alert>
                      )}

                      {header.logo && !isBase64Image(header.logo) && (
                        <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>
                          ✅ Imagen guardada correctamente
                        </Alert>
                      )}

                      {/* Botón para seleccionar imagen */}
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<Icon icon="mdi:image-plus" />}
                        onClick={handleSelectLogoImage}
                        sx={{ mb: 2 }}
                      >
                        {header.logo ? 'Cambiar Logo' : 'Seleccionar Logo'}
                      </Button>

                      {/* Campo URL manual */}
                      <TextField
                        fullWidth
                        label="URL del Logo (opcional)"
                        value={header.logo || ''}
                        onChange={(e) => onHeaderChange({ ...header, logo: e.target.value })}
                        placeholder="https://ejemplo.com/logo.png"
                        size="small"
                        sx={{ mb: 2 }}
                      />

                      {/* Altura del logo */}
                      <TextField
                        fullWidth
                        type="number"
                        label="Altura del Logo (px)"
                        value={header.logoHeight || 40}
                        onChange={(e) =>
                          onHeaderChange({ ...header, logoHeight: parseInt(e.target.value) || 40 })
                        }
                        inputProps={{ min: 20, max: 200 }}
                        size="small"
                      />

                      {/* Botón de subida a S3 */}
                      {header.logo && isBase64Image(header.logo) && (
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

                    {/* Vista previa de la imagen del sponsor */}
                    {header.sponsor?.image && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Vista previa:
                        </Typography>
                        <Box
                          sx={{
                            position: 'relative',
                            display: 'inline-block',
                            maxWidth: '200px',
                          }}
                        >
                          <img
                            src={header.sponsor.image}
                            alt="Sponsor preview"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '60px',
                              borderRadius: '4px',
                              border: '1px solid #e0e0e0',
                            }}
                          />
                          {isBase64Image(header.sponsor.image) && (
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

                    {/* Alertas de estado */}
                    {header.sponsor?.image && isBase64Image(header.sponsor.image) && (
                      <Alert severity="warning" sx={{ mb: 2, fontSize: '0.875rem' }}>
                        ⚠️ Esta imagen debe subirse a S3 antes de guardar
                      </Alert>
                    )}

                    {header.sponsor?.image && !isBase64Image(header.sponsor.image) && (
                      <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>
                        ✅ Imagen guardada correctamente
                      </Alert>
                    )}

                    {/* Botón para seleccionar imagen */}
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<Icon icon="mdi:image-plus" />}
                      onClick={handleSelectSponsorImage}
                      sx={{ mb: 2 }}
                    >
                      {header.sponsor?.image
                        ? 'Cambiar Imagen Sponsor'
                        : 'Seleccionar Imagen Sponsor'}
                    </Button>

                    {/* Campo URL manual */}
                    <TextField
                      fullWidth
                      label="URL de la imagen (opcional)"
                      value={header.sponsor?.image || ''}
                      onChange={(e) =>
                        onHeaderChange({
                          ...header,
                          sponsor: { ...header.sponsor, image: e.target.value },
                        })
                      }
                      placeholder="https://ejemplo.com/sponsor.png"
                      size="small"
                      sx={{ mb: 2 }}
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
                      size="small"
                    />

                    {/* Botón de subida a S3 */}
                    {header.sponsor?.image && isBase64Image(header.sponsor.image) && (
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

      {/* Inputs de archivo ocultos */}
      <input
        type="file"
        ref={logoFileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleLogoFileChange}
      />
      <input
        type="file"
        ref={bannerFileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleBannerFileChange}
      />
      <input
        type="file"
        ref={sponsorFileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleSponsorFileChange}
      />
    </Box>
  );
}
