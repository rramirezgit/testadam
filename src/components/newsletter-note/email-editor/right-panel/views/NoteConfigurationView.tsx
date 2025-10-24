'use client';

import { Icon } from '@iconify/react';

import {
  Box,
  Chip,
  Alert,
  AppBar,
  Button,
  Dialog,
  Select,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  DialogTitle,
  ToggleButton,
  DialogActions,
  DialogContent,
  LinearProgress,
  FormControlLabel,
  DialogContentText,
  ToggleButtonGroup,
} from '@mui/material';

import { CONFIG } from 'src/global-config';
import usePostStore from 'src/store/PostStore';

import { UploadCover } from 'src/components/upload';

import { POST_STATUS } from 'src/types/post';

import ContainerOptions from '../ContainerOptions';

import type { NewsletterFooter, NewsletterHeader } from '../../types';

// Tipos para metadatos
interface ContentType {
  id: string;
  name: string;
}

interface Audience {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

// Definición de temas predefinidos para newsletter
const NEWSLETTER_THEMES = CONFIG.defaultThemesNewsletter;

interface NoteConfigurationViewProps {
  containerTab: number;
  setContainerTab: (tab: number) => void;
  isNewsletterMode: boolean;
  localNewsletterTitle: string;
  setLocalNewsletterTitle: (title: string) => void;
  localNewsletterDescription: string;
  setLocalNewsletterDescription: (description: string) => void;
  localTitle: string;
  setLocalTitle: (title: string) => void;
  localDescription: string;
  setLocalDescription: (description: string) => void;
  highlight: boolean;
  setHighlight: (highlight: boolean) => void;
  showValidationErrors: boolean;
  currentNewsletterId?: string;
  newsletterStatus?: string;
  onNewsletterUpdate: () => void;
  showNotification: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  noteCoverImageUrl: string;
  setNoteCoverImageUrl: (url: string) => void;
  uploadImageToS3: (base64Image: string, fileName: string) => Promise<string>;
  uploading: boolean;
  uploadProgress: number;
  currentNoteId?: string;
  noteStatus: string;
  handleStatusChange: (status: string) => Promise<void>;
  checkStatusDisabled: (status: string) => boolean;
  contentTypeId: string;
  setContentTypeId: (id: string) => void;
  audienceId: string;
  setAudienceId: (id: string) => void;
  categoryId: string;
  setCategoryId: (id: string) => void;
  subcategoryId: string;
  setSubcategoryId: (id: string) => void;
  contentTypes: ContentType[];
  audiences: Audience[];
  categories: Category[];
  subcategories: any[];
  loadingMetadata: boolean;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (open: boolean) => void;
  handleDeleteNote: () => Promise<void>;
  newsletterHeader?: NewsletterHeader;
  newsletterFooter?: NewsletterFooter;
  onNewsletterConfigChange?: (config: {
    header: NewsletterHeader;
    footer: NewsletterFooter;
  }) => void;
  onHeaderChange: (header: NewsletterHeader) => void;
  onFooterChange: (footer: NewsletterFooter) => void;
  isViewOnly: boolean;
  containerBorderWidth: number;
  setContainerBorderWidth: (width: number) => void;
  containerBorderColor: string;
  setContainerBorderColor: (color: string) => void;
  containerBorderRadius: number;
  setContainerBorderRadius: (radius: number) => void;
  containerPadding: number;
  setContainerPadding: (padding: number) => void;
  containerMaxWidth: number;
  setContainerMaxWidth: (maxWidth: number) => void;
}

export default function NoteConfigurationView({
  containerTab,
  setContainerTab,
  isNewsletterMode,
  localNewsletterTitle,
  setLocalNewsletterTitle,
  localNewsletterDescription,
  setLocalNewsletterDescription,
  localTitle,
  setLocalTitle,
  localDescription,
  setLocalDescription,
  highlight,
  setHighlight,
  showValidationErrors,
  currentNewsletterId,
  newsletterStatus,
  onNewsletterUpdate,
  showNotification,
  noteCoverImageUrl,
  setNoteCoverImageUrl,
  uploadImageToS3,
  uploading,
  uploadProgress,
  currentNoteId,
  noteStatus,
  handleStatusChange,
  checkStatusDisabled,
  contentTypeId,
  setContentTypeId,
  audienceId,
  setAudienceId,
  categoryId,
  setCategoryId,
  subcategoryId,
  setSubcategoryId,
  contentTypes,
  audiences,
  categories,
  subcategories,
  loadingMetadata,
  openDeleteDialog,
  setOpenDeleteDialog,
  handleDeleteNote,
  newsletterHeader,
  newsletterFooter,
  onNewsletterConfigChange,
  onHeaderChange,
  onFooterChange,
  isViewOnly,
  containerBorderWidth,
  setContainerBorderWidth,
  containerBorderColor,
  setContainerBorderColor,
  containerBorderRadius,
  setContainerBorderRadius,
  containerPadding,
  setContainerPadding,
  containerMaxWidth,
  setContainerMaxWidth,
}: NoteConfigurationViewProps) {
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
          pointerEvents: 'none', // Permitir eventos de scroll a través del pseudo-elemento
        },
      })}
    >
      <AppBar position="static" color="default" elevation={0} sx={{ flexShrink: 0 }}>
        {/* ToggleButtonGroup para tabs */}
        <Box
          sx={{
            p: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <ToggleButtonGroup
            value={containerTab}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null) {
                setContainerTab(newValue);
              }
            }}
            aria-label="Configuración de nota"
            size="small"
            color="primary"
            sx={{
              width: '100%',
              border: 'none',
              '& .MuiToggleButton-root': {
                flex: 1,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                padding: { xs: '4px 6px', sm: '6px 8px' },
                border: 'none',
              },
            }}
          >
            <ToggleButton value={1} aria-label="diseno-contenedor">
              Diseño
            </ToggleButton>
            <ToggleButton value={0} aria-label="informacion-basica">
              Configuración
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </AppBar>

      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, height: 0 }}>
        {/* Tab 0: Información Básica */}
        {containerTab === 0 && (
          <Box sx={{ p: 2 }}>
            <Chip label="General" variant="filled" sx={{ mb: 2 }} size="small" />

            {/* Modo Newsletter: mostrar campos de newsletter */}
            {isNewsletterMode ? (
              <>
                {/* Título del Newsletter */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Título del Newsletter"
                  value={localNewsletterTitle}
                  onChange={(e) => setLocalNewsletterTitle(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                  multiline
                  rows={3}
                  disabled={isViewOnly}
                />

                {/* Descripción del Newsletter */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Descripción"
                  value={localNewsletterDescription}
                  onChange={(e) => setLocalNewsletterDescription(e.target.value)}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                  disabled={isViewOnly}
                />
              </>
            ) : (
              <>
                {/* Modo Normal: mostrar campos de nota */}

                {/* Título */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Título de la nota"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                  multiline
                  rows={3}
                  error={showValidationErrors && !localTitle.trim()}
                  helperText={
                    showValidationErrors && !localTitle.trim()
                      ? '⚠️ El título es obligatorio para guardar la nota'
                      : ''
                  }
                />

                {/* Descripción */}
                <TextField
                  fullWidth
                  variant="filled"
                  label="Descripción"
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />

                {/* Checkbox Destacar - Solo en modo normal */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={highlight}
                      onChange={(e) => setHighlight(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Destacar"
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {/* Botones de Aprobación/Rechazo - Solo en modo newsletter y estado PENDING_APPROVAL */}
            {isNewsletterMode && currentNewsletterId && newsletterStatus === 'PENDING_APPROVAL' && (
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<Icon icon="mdi:check-circle" />}
                  onClick={async () => {
                    try {
                      const { approveNewsletter, findNewsletterById } = usePostStore.getState();
                      await approveNewsletter(currentNewsletterId);
                      await findNewsletterById(currentNewsletterId);
                      if (onNewsletterUpdate) onNewsletterUpdate();
                      showNotification('Newsletter aprobado correctamente', 'success');
                    } catch {
                      showNotification('Error al aprobar el newsletter', 'error');
                    }
                  }}
                >
                  Aprobar
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={<Icon icon="mdi:close-circle" />}
                  onClick={async () => {
                    try {
                      const { rejectNewsletter, findNewsletterById } = usePostStore.getState();
                      await rejectNewsletter(currentNewsletterId);
                      await findNewsletterById(currentNewsletterId);
                      if (onNewsletterUpdate) onNewsletterUpdate();
                      showNotification('Newsletter rechazado', 'info');
                    } catch {
                      showNotification('Error al rechazar el newsletter', 'error');
                    }
                  }}
                >
                  Rechazar
                </Button>
              </Box>
            )}

            {/* Portada de nota / newsletter */}

            {/* Componente de upload de imagen de portada */}
            <Box sx={{ mb: 2 }}>
              <Chip
                label={isNewsletterMode ? 'Portada del Newsletter' : 'Portada de nota'}
                variant="filled"
                sx={{ mb: 2 }}
                size="small"
              />
              <UploadCover
                value={noteCoverImageUrl}
                disabled={uploading || isViewOnly}
                onDrop={async (acceptedFiles: File[]) => {
                  const file = acceptedFiles[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const base64String = reader.result as string;
                      // Mostrar preview temporalmente
                      setNoteCoverImageUrl(base64String);

                      try {
                        // Subir automáticamente a S3
                        const s3Url = await uploadImageToS3(base64String, `cover-${Date.now()}`);
                        // Actualizar con la URL de S3
                        setNoteCoverImageUrl(s3Url);
                      } catch (error) {
                        console.error('Error al subir imagen de portada:', error);
                        // Mantener el base64 en caso de error para que el usuario pueda intentar de nuevo
                        showNotification(
                          'Error al subir la imagen. Por favor, intenta de nuevo.',
                          'error'
                        );
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                onRemove={(file: File | string) => setNoteCoverImageUrl('')}
              />
              {uploading && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Subiendo imagen: {uploadProgress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}
            </Box>

            {/* Botón para cancelar envío programado - Solo en modo newsletter y estado SCHEDULED */}
            {isNewsletterMode && currentNewsletterId && newsletterStatus === 'SCHEDULED' && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="info" sx={{ mb: 1 }}>
                  Este newsletter está programado para enviarse
                </Alert>
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  startIcon={<Icon icon="mdi:cancel" />}
                  onClick={async () => {
                    try {
                      // Necesitamos los datos del newsletter
                      const { unscheduleNewsletter, findNewsletterById } = usePostStore.getState();
                      const newsletter = await findNewsletterById(currentNewsletterId);

                      await unscheduleNewsletter(
                        currentNewsletterId,
                        newsletter.subject,
                        newsletter.content || '',
                        newsletter.objData || '',
                        newsletter.scheduleDate
                      );

                      if (onNewsletterUpdate) onNewsletterUpdate();
                      showNotification('Envío programado cancelado', 'success');
                    } catch {
                      showNotification('Error al cancelar el envío', 'error');
                    }
                  }}
                >
                  Cancelar Envío Programado
                </Button>
              </Box>
            )}

            {/* Estado - Solo mostrar si la nota ya está guardada Y NO está en modo newsletter */}
            {currentNoteId && !isNewsletterMode && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  variant="filled"
                  value={noteStatus}
                  label="Estado"
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <MenuItem
                    value={POST_STATUS.DRAFT}
                    disabled={checkStatusDisabled(POST_STATUS.DRAFT)}
                  >
                    Borrador
                  </MenuItem>
                  <MenuItem
                    value={POST_STATUS.REVIEW}
                    disabled={checkStatusDisabled(POST_STATUS.REVIEW)}
                  >
                    En Revisión
                  </MenuItem>
                  <MenuItem
                    value={POST_STATUS.APPROVED}
                    disabled={checkStatusDisabled(POST_STATUS.APPROVED)}
                  >
                    Aprobado
                  </MenuItem>
                  <MenuItem
                    value={POST_STATUS.PUBLISHED}
                    disabled={checkStatusDisabled(POST_STATUS.PUBLISHED)}
                  >
                    Publicado
                  </MenuItem>
                  <MenuItem
                    value={POST_STATUS.REJECTED}
                    disabled={checkStatusDisabled(POST_STATUS.REJECTED)}
                  >
                    Rechazado
                  </MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Configuración específica - Solo en modo normal, NO en newsletter */}
            {!isNewsletterMode && (
              <>
                <Chip
                  label="Configuración específica"
                  variant="filled"
                  sx={{ mb: 2 }}
                  size="small"
                />

                {/* Tipo de contenido */}
                <FormControl
                  fullWidth
                  sx={{ mb: 2 }}
                  error={showValidationErrors && !contentTypeId}
                >
                  <InputLabel>Tipo de contenido *</InputLabel>
                  <Select
                    variant="filled"
                    value={contentTypeId}
                    label="Tipo de contenido *"
                    sx={{
                      '& .Mui-disabled': {
                        backgroundColor: 'background.neutral',
                      },
                    }}
                    onChange={(e) => setContentTypeId(e.target.value)}
                    disabled={loadingMetadata}
                  >
                    <MenuItem value="">
                      <em>Seleccionar</em>
                    </MenuItem>
                    {contentTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {showValidationErrors && !contentTypeId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      ⚠️ El tipo de contenido es obligatorio
                    </Typography>
                  )}
                </FormControl>

                {/* Audiencia */}
                <FormControl fullWidth sx={{ mb: 2 }} error={showValidationErrors && !audienceId}>
                  <InputLabel>Audiencia *</InputLabel>
                  <Select
                    variant="filled"
                    value={audienceId}
                    label="Audiencia *"
                    sx={{
                      '& .Mui-disabled': {
                        backgroundColor: 'background.neutral',
                      },
                    }}
                    onChange={(e) => setAudienceId(e.target.value)}
                    disabled={loadingMetadata}
                  >
                    <MenuItem value="">
                      <em>Seleccionar</em>
                    </MenuItem>
                    {audiences.map((audience) => (
                      <MenuItem key={audience.id} value={audience.id}>
                        {audience.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {showValidationErrors && !audienceId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      ⚠️ La audiencia es obligatoria
                    </Typography>
                  )}
                </FormControl>

                {/* Categoría */}
                <FormControl
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled={!contentTypeId}
                  error={showValidationErrors && contentTypeId && !categoryId}
                >
                  <InputLabel>Categoría *</InputLabel>
                  <Select
                    variant="filled"
                    value={categoryId}
                    label="Categoría *"
                    sx={{
                      '& .Mui-disabled': {
                        backgroundColor: 'background.neutral',
                      },
                    }}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={!contentTypeId || loadingMetadata}
                  >
                    <MenuItem value="">
                      <em>Seleccionar</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {showValidationErrors && contentTypeId && !categoryId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      ⚠️ La categoría es obligatoria
                    </Typography>
                  )}
                  {!contentTypeId && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      Selecciona un tipo de contenido primero
                    </Typography>
                  )}
                </FormControl>

                {/* Subcategoría */}
                <FormControl
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled={!categoryId}
                  error={showValidationErrors && categoryId && !subcategoryId}
                >
                  <InputLabel>Subcategoría *</InputLabel>
                  <Select
                    variant="filled"
                    value={subcategoryId}
                    label="Subcategoría *"
                    sx={{
                      '& .Mui-disabled': {
                        backgroundColor: 'background.neutral',
                      },
                    }}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    disabled={!categoryId || loadingMetadata}
                  >
                    <MenuItem value="">
                      <em>Seleccionar</em>
                    </MenuItem>
                    {subcategories.map((subcategory) => (
                      <MenuItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {showValidationErrors && categoryId && !subcategoryId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      ⚠️ La subcategoría es obligatoria
                    </Typography>
                  )}
                  {!categoryId && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      Selecciona una categoría primero
                    </Typography>
                  )}
                </FormControl>

                {/* Botón para eliminar la nota (solo si está guardada) */}
                {currentNoteId && (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Icon icon="mdi:delete-outline" />}
                    onClick={() => setOpenDeleteDialog(true)}
                    sx={{
                      backgroundColor: 'rgba(255, 72, 66, 0.08)',
                      color: 'error.main',
                      border: 'none',
                      height: 48,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 72, 66, 0.16)',
                        borderColor: 'error.main',
                      },
                    }}
                  >
                    Eliminar nota
                  </Button>
                )}
              </>
            )}
          </Box>
        )}

        {/* Tab 1: Diseño del Contenedor / Temas de Color (Newsletter) */}
        {containerTab === 1 && (
          <Box sx={{ p: 2 }}>
            {/* Si está en modo Newsletter, mostrar Temas de Color */}
            {isNewsletterMode && newsletterHeader && newsletterFooter ? (
              <Box>
                <Chip label="Temas de Color" variant="filled" sx={{ mb: 2 }} size="small" />
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
                        cursor: isViewOnly ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: isViewOnly ? 0.5 : 1,
                        pointerEvents: isViewOnly ? 'none' : 'auto',
                        '&:hover': {
                          borderColor: '#1976d2',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                      }}
                      onClick={() => {
                        if (isViewOnly) return;

                        // Aplicar tema a header y footer
                        const newHeader = {
                          ...newsletterHeader,
                          useGradient: true,
                          gradientColors: theme.gradientColors,
                          gradientDirection: theme.gradientDirection,
                          textColor: theme.textColor,
                        };

                        const newFooter = {
                          ...newsletterFooter,
                          useGradient: true,
                          gradientColors: theme.gradientColors,
                          gradientDirection: theme.gradientDirection,
                          textColor: theme.textColor,
                        };

                        // Usar onNewsletterConfigChange para actualizar header y footer en una sola operación
                        if (onNewsletterConfigChange) {
                          onNewsletterConfigChange({ header: newHeader, footer: newFooter });
                        } else {
                          // Fallback a las funciones individuales si no está disponible
                          onHeaderChange(newHeader);
                          onFooterChange(newFooter);
                        }
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
                          color: theme.textColor,
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
                      >
                        {theme.name}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              /* Modo normal: Opciones de diseño del contenedor */
              <ContainerOptions
                containerBorderWidth={containerBorderWidth}
                setContainerBorderWidth={setContainerBorderWidth}
                containerBorderColor={containerBorderColor}
                setContainerBorderColor={setContainerBorderColor}
                containerBorderRadius={containerBorderRadius}
                setContainerBorderRadius={setContainerBorderRadius}
                containerPadding={containerPadding}
                setContainerPadding={setContainerPadding}
                containerMaxWidth={containerMaxWidth}
                setContainerMaxWidth={setContainerMaxWidth}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Diálogo de confirmación para eliminar nota */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Eliminar nota?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta nota
            permanentemente?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteNote} color="error" variant="contained" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
