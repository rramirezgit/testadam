import { useRef } from 'react';
import { Icon } from '@iconify/react';

import {
  Box,
  Paper,
  Avatar,
  Button,
  Slider,
  TextField,
  Typography,
  LinearProgress,
} from '@mui/material';

import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';
import { findComponentById } from '../utils/componentHelpers';

import type { RespaldadoPorOptionsProps } from './types';

export default function RespaldadoPorOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
}: RespaldadoPorOptionsProps) {
  // Referencias para input de archivo
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const escritorAvatarFileInputRef = useRef<HTMLInputElement>(null);
  const propietarioAvatarFileInputRef = useRef<HTMLInputElement>(null);

  // Hook para subida de imágenes
  const { uploadImageToS3, uploading, uploadProgress } = useImageUpload();

  if (!selectedComponentId) return null;

  const component = findComponentById(getActiveComponents(), selectedComponentId);
  if (!component || component.type !== 'respaldadoPor') return null;

  // Valores por defecto para sección principal
  const texto = component.props?.texto || 'Respaldado por';
  const nombre = component.props?.nombre || 'Redacción';
  const avatarUrl = component.props?.avatarUrl || '';
  const avatarTamano = component.props?.avatarTamano || 21;

  // Valores para sección adicional "Escritor con Propietario"
  const mostrarEscritorPropietario = component.props?.mostrarEscritorPropietario || false;
  const escritorNombre = component.props?.escritorNombre || 'Escritor';
  const escritorAvatarUrl = component.props?.escritorAvatarUrl || '';
  const propietarioNombre = component.props?.propietarioNombre || 'Propietario';
  const propietarioAvatarUrl = component.props?.propietarioAvatarUrl || '';

  // Funciones para manejar selección de archivos
  const handleSelectAvatar = () => avatarFileInputRef.current?.click();
  const handleSelectEscritorAvatar = () => escritorAvatarFileInputRef.current?.click();
  const handleSelectPropietarioAvatar = () => propietarioAvatarFileInputRef.current?.click();

  // Funciones para manejar cambios de archivos con subida automática a S3
  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        // Primero actualizar con la imagen base64 para mostrar preview
        updateComponentProps(selectedComponentId, { [field]: base64 });

        // Luego subir automáticamente a S3
        try {
          const s3Url = await uploadImageToS3(base64, `respaldado_${field}_${Date.now()}`);
          updateComponentProps(selectedComponentId, { [field]: s3Url });
        } catch (error) {
          console.error('Error al subir la imagen a S3:', error);
          // Mantener la imagen base64 si falla la subida
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Sección Principal: Respaldado por */}
      <Paper elevation={0}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon="mdi:shield-check" style={{ marginRight: 8, fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Respaldado por (Principal)
          </Typography>
        </Box>

        {/* Avatar principal - PRIMERO */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Avatar Principal
          </Typography>

          {avatarUrl && (
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Avatar
                src={avatarUrl}
                alt={nombre}
                sx={{
                  width: Math.max(avatarTamano, 40),
                  height: Math.max(avatarTamano, 40),
                  border: '2px solid #e0e0e0',
                  margin: '0 auto',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              {isBase64Image(avatarUrl) && uploading && (
                <Typography variant="caption" color="info.main" sx={{ display: 'block', mt: 0.5 }}>
                  📤 Subiendo a S3...
                </Typography>
              )}
            </Box>
          )}

          <Button
            variant="contained"
            size="medium"
            color="primary"
            startIcon={<Icon icon="mdi:camera-plus" />}
            onClick={handleSelectAvatar}
            fullWidth
            sx={{
              mb: 2,
              textTransform: 'none',
            }}
          >
            {avatarUrl ? 'Cambiar Avatar' : 'Subir Avatar'}
          </Button>

          <TextField
            fullWidth
            label="URL del Avatar (opcional)"
            value={avatarUrl || ''}
            onChange={(e) =>
              updateComponentProps(selectedComponentId, { avatarUrl: e.target.value })
            }
            placeholder="https://ejemplo.com/avatar.jpg"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
              },
            }}
          />
        </Box>

        {/* Nombre del autor - SEGUNDO */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Nombre del Autor
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={nombre}
            onChange={(e) => updateComponentProps(selectedComponentId, { nombre: e.target.value })}
            placeholder="Redacción"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
              },
            }}
          />
        </Box>

        {/* Texto descriptivo - TERCERO */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Texto Descriptivo
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={texto}
            onChange={(e) => updateComponentProps(selectedComponentId, { texto: e.target.value })}
            placeholder="Respaldado por"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
              },
            }}
          />
        </Box>

        {/* Tamaño del avatar - CUARTO */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Tamaño del Avatar: {avatarTamano}px
          </Typography>
          <Slider
            size="small"
            value={avatarTamano}
            onChange={(_, value) =>
              updateComponentProps(selectedComponentId, { avatarTamano: value as number })
            }
            min={16}
            max={50}
            marks={[
              { value: 16, label: '16' },
              { value: 25, label: '25' },
              { value: 35, label: '35' },
              { value: 50, label: '50' },
            ]}
            sx={{
              '& .MuiSlider-thumb': {
                width: 20,
                height: 20,
              },
            }}
          />
        </Box>
      </Paper>

      {/* Switch para activar sección adicional */}
      {/* <FormControlLabel
        control={
          <Switch
            checked={mostrarEscritorPropietario}
            onChange={(e) =>
              updateComponentProps(selectedComponentId, {
                mostrarEscritorPropietario: e.target.checked,
              })
            }
            color="primary"
          />
        }
        label="Mostrar sección 'Escritor con Propietario'"
        sx={{ mb: 2 }}
      /> */}

      {/* Sección Adicional: Escritor con Propietario */}
      {mostrarEscritorPropietario && (
        <Paper elevation={0} sx={{}}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Icon icon="mdi:account-group" style={{ marginRight: 8, fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Escritor con Propietario
            </Typography>
          </Box>

          {/* Escritor */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'primary.main' }}>
              👤 Escritor
            </Typography>

            {/* Avatar del Escritor */}
            {escritorAvatarUrl && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Avatar
                  src={escritorAvatarUrl}
                  alt={escritorNombre}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    margin: '0 auto',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
                {isBase64Image(escritorAvatarUrl) && uploading && (
                  <Typography
                    variant="caption"
                    color="info.main"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    📤 Subiendo a S3...
                  </Typography>
                )}
              </Box>
            )}

            <Button
              variant="contained"
              size="medium"
              startIcon={<Icon icon="mdi:camera-plus" />}
              onClick={handleSelectEscritorAvatar}
              fullWidth
              sx={{
                mb: 2,
                py: 1.5,
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              {escritorAvatarUrl ? 'Cambiar Avatar' : 'Subir Avatar'}
            </Button>

            <TextField
              fullWidth
              size="small"
              label="Nombre del Escritor"
              value={escritorNombre}
              onChange={(e) =>
                updateComponentProps(selectedComponentId, { escritorNombre: e.target.value })
              }
              placeholder="Escritor"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="URL Avatar Escritor (opcional)"
              value={escritorAvatarUrl || ''}
              onChange={(e) =>
                updateComponentProps(selectedComponentId, { escritorAvatarUrl: e.target.value })
              }
              size="small"
            />
          </Box>

          {/* Propietario */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'primary.main' }}>
              🏢 Propietario
            </Typography>

            {/* Avatar del Propietario */}
            {propietarioAvatarUrl && (
              <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Avatar
                  src={propietarioAvatarUrl}
                  alt={propietarioNombre}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    margin: '0 auto',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
                {isBase64Image(propietarioAvatarUrl) && uploading && (
                  <Typography
                    variant="caption"
                    color="info.main"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    📤 Subiendo a S3...
                  </Typography>
                )}
              </Box>
            )}

            <Button
              variant="contained"
              size="medium"
              startIcon={<Icon icon="mdi:camera-plus" />}
              onClick={handleSelectPropietarioAvatar}
              fullWidth
              sx={{
                mb: 2,
                py: 1.5,
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              {propietarioAvatarUrl ? 'Cambiar Avatar' : 'Subir Avatar'}
            </Button>

            <TextField
              fullWidth
              size="small"
              label="Nombre del Propietario"
              value={propietarioNombre}
              onChange={(e) =>
                updateComponentProps(selectedComponentId, { propietarioNombre: e.target.value })
              }
              placeholder="Propietario"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="URL Avatar Propietario (opcional)"
              value={propietarioAvatarUrl || ''}
              onChange={(e) =>
                updateComponentProps(selectedComponentId, { propietarioAvatarUrl: e.target.value })
              }
              size="small"
            />
          </Box>
        </Paper>
      )}

      {/* Progreso de subida */}
      {uploading && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Subiendo: {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Inputs de archivo ocultos */}
      <input
        type="file"
        ref={avatarFileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={(e) => handleAvatarFileChange(e, 'avatarUrl')}
      />
      <input
        type="file"
        ref={escritorAvatarFileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={(e) => handleAvatarFileChange(e, 'escritorAvatarUrl')}
      />
      <input
        type="file"
        ref={propietarioAvatarFileInputRef}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={(e) => handleAvatarFileChange(e, 'propietarioAvatarUrl')}
      />
    </Box>
  );
}
