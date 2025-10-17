import { Icon } from '@iconify/react';
import { useRef, useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Stack,
  Alert,
  Button,
  Divider,
  TextField,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material';

import { CustomDialog } from '../ui/custom-dialog';
import { isBase64Image } from '../utils/imageValidation';
import { useImageUpload } from '../right-panel/useImageUpload';

// ⚡ OPTIMIZACIÓN: Componente SaveNoteDialog para evitar duplicación
interface SaveNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  noteTitle: string;
  noteDescription?: string;
  noteCoverImageUrl?: string;
  imageStats?: {
    total: number;
    uploaded: number;
    pending: number;
    isAllUploaded: boolean;
    pendingUrls: string[];
  };
  // Nuevas props para edición
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onCoverImageChange?: (imageUrl: string) => void;
  // Loading del guardado
  saving?: boolean;
}

export const SaveNoteDialog: React.FC<SaveNoteDialogProps> = ({
  open,
  onClose: handleClose,
  onSave: handleSave,
  noteTitle,
  noteDescription = '',
  noteCoverImageUrl = '',
  imageStats,
  onTitleChange,
  onDescriptionChange,
  onCoverImageChange,
  saving = false,
}) => {
  // Estados locales para edición
  const [localTitle, setLocalTitle] = useState(noteTitle);
  const [localDescription, setLocalDescription] = useState(noteDescription);
  const [localCoverImage, setLocalCoverImage] = useState(noteCoverImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  // Actualizar estados locales cuando cambien las props
  useEffect(() => {
    setLocalTitle(noteTitle);
    setLocalDescription(noteDescription);
    setLocalCoverImage(noteCoverImageUrl);
  }, [noteTitle, noteDescription, noteCoverImageUrl, open]);

  // 🔥 SINCRONIZACIÓN AUTOMÁTICA: Actualizar título en tiempo real
  useEffect(() => {
    if (onTitleChange && localTitle !== noteTitle && open) {
      // Debounce para evitar demasiadas actualizaciones
      const timer = setTimeout(() => {
        onTitleChange(localTitle);
      }, 300); // Esperar 300ms después de que el usuario deje de escribir
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTitle, open]);

  // 🔥 SINCRONIZACIÓN AUTOMÁTICA: Actualizar descripción en tiempo real
  useEffect(() => {
    if (onDescriptionChange && localDescription !== noteDescription && open) {
      // Debounce para evitar demasiadas actualizaciones
      const timer = setTimeout(() => {
        onDescriptionChange(localDescription);
      }, 300); // Esperar 300ms después de que el usuario deje de escribir
      return () => {
        clearTimeout(timer);
      };
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localDescription, open]);

  // 🔥 SINCRONIZACIÓN AUTOMÁTICA: Actualizar imagen de portada en tiempo real
  useEffect(() => {
    if (
      onCoverImageChange &&
      localCoverImage !== noteCoverImageUrl &&
      !isBase64Image(localCoverImage) && // Solo sincronizar cuando la imagen esté en S3
      open
    ) {
      onCoverImageChange(localCoverImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localCoverImage, open]);

  const handleSaveClick = () => {
    // Verificar que la imagen de portada esté en S3 si existe
    if (localCoverImage && isBase64Image(localCoverImage)) {
      console.warn('⚠️ La imagen de portada aún no está en S3. Esperando...');
      return;
    }

    // Los cambios ya se han aplicado automáticamente gracias a los useEffect
    // Solo necesitamos llamar a la función de guardado
    handleSave();
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Primero actualizar con la imagen base64 para mostrar preview inmediato
        setLocalCoverImage(base64);

        // Luego subir automáticamente a S3
        try {
          const s3Url = await uploadImageToS3(base64, `note_cover_${Date.now()}`);
          setLocalCoverImage(s3Url);
          console.log('✅ Imagen de portada subida a S3:', s3Url);
        } catch (error) {
          console.error('❌ Error al subir la imagen de portada a S3:', error);
          // Mantener la imagen base64 si falla la subida
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setLocalCoverImage('');
  };

  const canSave =
    localTitle.trim() &&
    (!imageStats || imageStats.isAllUploaded) &&
    !uploading && // No permitir guardar mientras se sube la imagen a S3
    !saving && // No permitir guardar mientras se está guardando
    (!localCoverImage || !isBase64Image(localCoverImage)); // No permitir guardar si la portada está en base64

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <CustomDialog
        open={open}
        onClose={handleClose}
        title="Guardar Nota"
        actions={
          <>
            <Button onClick={handleClose} color="primary" disabled={uploading || saving}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveClick}
              color="primary"
              variant="contained"
              disabled={!canSave}
              startIcon={
                saving ? (
                  <Icon
                    icon="mdi:loading"
                    style={{
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                ) : undefined
              }
            >
              {uploading ? 'Subiendo a S3...' : saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </>
        }
      >
        <Box sx={{ minWidth: 500 }}>
          <Stack spacing={3}>
            {/* Título - Campo editable */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Icon icon="mdi:text-box-outline" style={{ fontSize: 20, color: '#1976d2' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Título *
                </Typography>
                <Chip
                  label={localTitle.trim() ? 'Completo' : 'Requerido'}
                  size="small"
                  color={localTitle.trim() ? 'success' : 'error'}
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Stack>
              <TextField
                fullWidth
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                placeholder="Ingresa el título de la nota"
                variant="outlined"
                size="small"
                error={!localTitle.trim()}
                helperText={!localTitle.trim() ? 'El título es obligatorio' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa',
                  },
                }}
              />
            </Box>

            <Divider />

            {/* Descripción - Campo editable */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Icon icon="mdi:text-subject" style={{ fontSize: 20, color: '#1976d2' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Descripción
                </Typography>
                <Chip
                  label={localDescription ? 'Opcional' : 'Vacío'}
                  size="small"
                  color={localDescription ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Stack>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                placeholder="Agrega una descripción para identificar mejor esta nota"
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f9fa',
                  },
                }}
              />
            </Box>

            <Divider />

            {/* Imagen de portada - Campo editable */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Icon icon="mdi:image-outline" style={{ fontSize: 20, color: '#1976d2' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Imagen de Portada
                </Typography>
                <Chip
                  label={localCoverImage ? 'Agregada' : 'Opcional'}
                  size="small"
                  color={localCoverImage ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              </Stack>

              {localCoverImage ? (
                <Box>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '2px solid #e0e0e0',
                    }}
                  >
                    <Box
                      component="img"
                      src={localCoverImage}
                      alt="Portada"
                      sx={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'cover',
                        opacity: uploading ? 0.6 : 1,
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveImage}
                      disabled={uploading}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                      }}
                      size="small"
                    >
                      <Icon icon="mdi:close" />
                    </IconButton>

                    {/* Indicador mientras sube a S3 */}
                    {uploading && isBase64Image(localCoverImage) && (
                      <Chip
                        icon={<Icon icon="mdi:cloud-upload-outline" />}
                        label={`Subiendo... ${uploadProgress}%`}
                        size="small"
                        color="info"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          fontWeight: 600,
                        }}
                      />
                    )}

                    {/* Indicador de éxito cuando está en S3 */}
                    {!uploading && !isBase64Image(localCoverImage) && (
                      <Chip
                        icon={<Icon icon="mdi:check-circle" />}
                        label="En S3"
                        size="small"
                        color="success"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                        }}
                      />
                    )}
                  </Box>

                  {/* Barra de progreso durante la subida */}
                  {uploading && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                      sx={{ mt: 1, borderRadius: 1 }}
                    />
                  )}
                </Box>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Icon icon="mdi:image-plus" />}
                  onClick={handleImageSelect}
                  sx={{
                    height: 100,
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    backgroundColor: '#f8f9fa',
                    '&:hover': {
                      backgroundColor: '#e9ecef',
                    },
                  }}
                >
                  Seleccionar imagen
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageFileChange}
              />
            </Box>

            {/* Estado de imágenes en el contenido */}
            {imageStats && imageStats.total > 0 && (
              <>
                <Divider />
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Icon
                      icon="mdi:image-multiple-outline"
                      style={{ fontSize: 20, color: '#1976d2' }}
                    />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Imágenes en el Contenido
                    </Typography>
                  </Stack>
                  <Alert
                    severity={imageStats.isAllUploaded ? 'success' : 'error'}
                    icon={
                      <Icon
                        icon={imageStats.isAllUploaded ? 'mdi:check-circle' : 'mdi:alert-circle'}
                      />
                    }
                  >
                    {imageStats.isAllUploaded ? (
                      <Typography variant="body2">
                        ✅ Todas las imágenes ({imageStats.total}) están subidas a S3
                      </Typography>
                    ) : (
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ⚠️ {imageStats.pending} de {imageStats.total} imagen(es) sin subir a S3
                        </Typography>
                        <Typography variant="caption">
                          Usa el botón &quot;Subir a S3&quot; en el panel de opciones de cada
                          imagen.
                        </Typography>
                      </Stack>
                    )}
                  </Alert>
                </Box>
              </>
            )}
          </Stack>
        </Box>
      </CustomDialog>
    </>
  );
};
