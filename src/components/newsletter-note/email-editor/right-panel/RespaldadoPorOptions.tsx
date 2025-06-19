import { useRef } from 'react';
import { Icon } from '@iconify/react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Paper,
  Avatar,
  Button,
  Slider,
  Switch,
  Divider,
  TextField,
  Typography,
  LinearProgress,
  FormControlLabel,
} from '@mui/material';

import { useImageUpload } from './useImageUpload';
import { isBase64Image } from '../utils/imageValidation';

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

  const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
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

  // Funciones para manejar cambios de archivos
  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        updateComponentProps(selectedComponentId, { [field]: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para subir avatar a S3
  const handleUploadAvatarToS3 = async (field: string, currentUrl: string) => {
    if (!currentUrl || !isBase64Image(currentUrl)) {
      alert('No hay imagen de avatar para subir o ya está subida');
      return;
    }

    try {
      const s3Url = await uploadImageToS3(currentUrl, `respaldado_${field}_${Date.now()}`);
      updateComponentProps(selectedComponentId, { [field]: s3Url });
    } catch (error) {
      alert('Error al subir la imagen del avatar a S3');
      console.error(error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        📝 Configuración de Respaldo
      </Typography>

      {/* Sección Principal: Respaldado por */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon="mdi:shield-check" style={{ marginRight: 8, fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Respaldado por (Principal)
          </Typography>
        </Box>

        {/* Texto descriptivo */}
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
              mb: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
              },
            }}
          />
        </Box>

        {/* Nombre del autor */}
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
              mb: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
              },
            }}
          />
        </Box>

        {/* Avatar principal */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Avatar Principal
          </Typography>

          {avatarUrl && (
            <Box sx={{ mb: 1, textAlign: 'center' }}>
              <Avatar
                src={avatarUrl}
                alt={nombre}
                sx={{
                  width: Math.max(avatarTamano, 30),
                  height: Math.max(avatarTamano, 30),
                  border: '1px solid #e0e0e0',
                  margin: '0 auto',
                }}
              />
              {isBase64Image(avatarUrl) && (
                <Typography
                  variant="caption"
                  color="warning.main"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  ⚠️ Pendiente subir a S3
                </Typography>
              )}
            </Box>
          )}

          <Button
            variant="outlined"
            size="small"
            startIcon={<Icon icon="mdi:image-plus" />}
            onClick={handleSelectAvatar}
            sx={{ mb: 1, mr: 1 }}
          >
            {avatarUrl ? 'Cambiar' : 'Seleccionar'}
          </Button>

          {avatarUrl && isBase64Image(avatarUrl) && (
            <LoadingButton
              variant="contained"
              color="warning"
              size="small"
              startIcon={<Icon icon="mdi:cloud-upload" />}
              onClick={() => handleUploadAvatarToS3('avatarUrl', avatarUrl)}
              loading={uploading}
            >
              Subir S3
            </LoadingButton>
          )}

          <TextField
            fullWidth
            label="URL del Avatar"
            value={avatarUrl || ''}
            onChange={(e) =>
              updateComponentProps(selectedComponentId, { avatarUrl: e.target.value })
            }
            placeholder="https://ejemplo.com/avatar.jpg"
            size="small"
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
              },
            }}
          />
        </Box>

        {/* Tamaño del avatar */}
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
            max={40}
            marks={[
              { value: 16, label: '16px' },
              { value: 21, label: '21px' },
              { value: 30, label: '30px' },
              { value: 40, label: '40px' },
            ]}
          />
        </Box>
      </Paper>

      {/* Switch para activar sección adicional */}
      <FormControlLabel
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
      />

      {/* Sección Adicional: Escritor con Propietario */}
      {mostrarEscritorPropietario && (
        <Paper
          elevation={1}
          sx={{ p: 2, mb: 2, bgcolor: 'blue.50', border: '1px solid', borderColor: 'blue.200' }}
        >
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

            <TextField
              fullWidth
              size="small"
              label="Nombre del Escritor"
              value={escritorNombre}
              onChange={(e) =>
                updateComponentProps(selectedComponentId, { escritorNombre: e.target.value })
              }
              placeholder="Escritor"
              sx={{ mb: 1 }}
            />

            {escritorAvatarUrl && (
              <Box sx={{ mb: 1, textAlign: 'center' }}>
                <Avatar
                  src={escritorAvatarUrl}
                  alt={escritorNombre}
                  sx={{
                    width: 30,
                    height: 30,
                    border: '1px solid #e0e0e0',
                    margin: '0 auto',
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Icon icon="mdi:image-plus" />}
                onClick={handleSelectEscritorAvatar}
              >
                Avatar Escritor
              </Button>

              {escritorAvatarUrl && isBase64Image(escritorAvatarUrl) && (
                <LoadingButton
                  variant="contained"
                  color="warning"
                  size="small"
                  startIcon={<Icon icon="mdi:cloud-upload" />}
                  onClick={() => handleUploadAvatarToS3('escritorAvatarUrl', escritorAvatarUrl)}
                  loading={uploading}
                >
                  S3
                </LoadingButton>
              )}
            </Box>

            <TextField
              fullWidth
              label="URL Avatar Escritor"
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

            <TextField
              fullWidth
              size="small"
              label="Nombre del Propietario"
              value={propietarioNombre}
              onChange={(e) =>
                updateComponentProps(selectedComponentId, { propietarioNombre: e.target.value })
              }
              placeholder="Propietario"
              sx={{ mb: 1 }}
            />

            {propietarioAvatarUrl && (
              <Box sx={{ mb: 1, textAlign: 'center' }}>
                <Avatar
                  src={propietarioAvatarUrl}
                  alt={propietarioNombre}
                  sx={{
                    width: 30,
                    height: 30,
                    border: '1px solid #e0e0e0',
                    margin: '0 auto',
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Icon icon="mdi:image-plus" />}
                onClick={handleSelectPropietarioAvatar}
              >
                Avatar Propietario
              </Button>

              {propietarioAvatarUrl && isBase64Image(propietarioAvatarUrl) && (
                <LoadingButton
                  variant="contained"
                  color="warning"
                  size="small"
                  startIcon={<Icon icon="mdi:cloud-upload" />}
                  onClick={() =>
                    handleUploadAvatarToS3('propietarioAvatarUrl', propietarioAvatarUrl)
                  }
                  loading={uploading}
                >
                  S3
                </LoadingButton>
              )}
            </Box>

            <TextField
              fullWidth
              label="URL Avatar Propietario"
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

      <Divider sx={{ my: 2 }} />

      {/* Vista Previa */}
      <Paper elevation={2} sx={{ p: 2, bgcolor: 'grey.100' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon icon="mdi:eye-outline" style={{ marginRight: 8, fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Vista Previa
          </Typography>
        </Box>

        {/* Vista previa sección principal */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
            backgroundColor: '#f0f0f0',
            borderRadius: 1,
            mb: mostrarEscritorPropietario ? 2 : 0,
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '12px', color: '#666666' }}>
            {texto}
          </Typography>
          {avatarUrl && (
            <Avatar
              src={avatarUrl}
              alt={nombre}
              sx={{
                width: avatarTamano,
                height: avatarTamano,
              }}
            />
          )}
          <Typography variant="body2" sx={{ fontSize: '15px', color: '#333333', fontWeight: 500 }}>
            {nombre}
          </Typography>
        </Box>

        {/* Vista previa sección adicional */}
        {mostrarEscritorPropietario && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              backgroundColor: '#e3f2fd',
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" sx={{ fontSize: '12px', color: '#1565c0' }}>
              Escritor con
            </Typography>
            {escritorAvatarUrl && (
              <Avatar
                src={escritorAvatarUrl}
                alt={escritorNombre}
                sx={{
                  width: 21,
                  height: 21,
                }}
              />
            )}
            <Typography
              variant="body2"
              sx={{ fontSize: '15px', color: '#1565c0', fontWeight: 500 }}
            >
              {escritorNombre}
            </Typography>
            {propietarioAvatarUrl && (
              <Avatar
                src={propietarioAvatarUrl}
                alt={propietarioNombre}
                sx={{
                  width: 21,
                  height: 21,
                }}
              />
            )}
            <Typography
              variant="body2"
              sx={{ fontSize: '15px', color: '#1565c0', fontWeight: 500 }}
            >
              {propietarioNombre}
            </Typography>
          </Box>
        )}
      </Paper>

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
