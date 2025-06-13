import type React from 'react';

import { Icon } from '@iconify/react';

import { Box, Chip, Stack, Button, Avatar, Typography } from '@mui/material';

import { CustomDialog } from '../ui/custom-dialog';

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
}

export const SaveNoteDialog: React.FC<SaveNoteDialogProps> = ({
  open,
  onClose: handleClose,
  onSave: handleSave,
  noteTitle,
  noteDescription = '',
  noteCoverImageUrl = '',
  imageStats,
}) => {
  const handleSaveClick = () => {
    handleSave();
  };

  const canSave = noteTitle.trim() && (!imageStats || imageStats.isAllUploaded);

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      title="Guardar Nota"
      actions={
        <>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSaveClick} color="primary" variant="contained" disabled={!canSave}>
            Guardar
          </Button>
        </>
      }
    >
      <Box sx={{ minWidth: 400 }}>
        {/* Panel de información de la nota */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem', fontWeight: 600 }}>
            Información de la Nota
          </Typography>

          <Stack spacing={2}>
            {/* Título */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<Icon icon="mdi:text-box-outline" />}
                  label={noteTitle ? `Título: ${noteTitle}` : 'Sin título'}
                  color={noteTitle ? 'success' : 'warning'}
                  variant={noteTitle ? 'filled' : 'outlined'}
                  size="small"
                />
              </Stack>
            </Box>

            {/* Descripción */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<Icon icon="mdi:text-subject" />}
                  label={noteDescription ? 'Descripción agregada' : 'Sin descripción'}
                  color={noteDescription ? 'success' : 'warning'}
                  variant={noteDescription ? 'filled' : 'outlined'}
                  size="small"
                />
              </Stack>
              {noteDescription && (
                <Box sx={{ mt: 1, p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    <strong>Descripción:</strong> {noteDescription}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Imagen de portada */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  icon={<Icon icon="mdi:image-outline" />}
                  label={noteCoverImageUrl ? 'Imagen de portada agregada' : 'Sin imagen de portada'}
                  color={noteCoverImageUrl ? 'success' : 'warning'}
                  variant={noteCoverImageUrl ? 'filled' : 'outlined'}
                  size="small"
                />
                {/* Vista previa de la imagen si existe */}
                {noteCoverImageUrl && (
                  <Avatar
                    src={noteCoverImageUrl}
                    alt="Portada"
                    sx={{ width: 32, height: 32 }}
                    variant="rounded"
                  />
                )}
              </Stack>
            </Box>

            {/* Estado de imágenes en el contenido */}
            {imageStats && imageStats.total > 0 && (
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    icon={<Icon icon="mdi:image-multiple-outline" />}
                    label={`Imágenes: ${imageStats.uploaded}/${imageStats.total} en S3`}
                    color={imageStats.isAllUploaded ? 'success' : 'error'}
                    variant={imageStats.isAllUploaded ? 'filled' : 'outlined'}
                    size="small"
                  />
                </Stack>
                {!imageStats.isAllUploaded && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 2,
                      backgroundColor: '#ffebee',
                      borderRadius: 1,
                      border: '1px solid #f44336',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      ⚠️ {imageStats.pending} imagen(es) sin subir a S3
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '0.8rem', mt: 0.5 }}
                    >
                      Sube todas las imágenes usando el botón &quot;Subir a S3&quot; en el panel de
                      opciones antes de guardar.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* Mensaje de ayuda si falta información */}
            {(!noteTitle ||
              !noteDescription ||
              !noteCoverImageUrl ||
              (imageStats && !imageStats.isAllUploaded)) && (
              <Box
                sx={{
                  p: 2,
                  backgroundColor: imageStats && !imageStats.isAllUploaded ? '#ffebee' : '#fff3cd',
                  borderRadius: 1,
                  border:
                    imageStats && !imageStats.isAllUploaded
                      ? '1px solid #f44336'
                      : '1px solid #ffeaa7',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  <Icon
                    icon="mdi:information-outline"
                    style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
                  />
                  {imageStats && !imageStats.isAllUploaded
                    ? 'Sube todas las imágenes a S3 antes de guardar la nota.'
                    : 'Completa la información en el panel derecho (pestaña de Información Básica) para optimizar tu nota.'}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </CustomDialog>
  );
};
