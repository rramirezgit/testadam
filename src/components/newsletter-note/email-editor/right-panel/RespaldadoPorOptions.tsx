import { Icon } from '@iconify/react';

import { Box, Avatar, Button, Slider, TextField, Typography } from '@mui/material';

import type { RespaldadoPorOptionsProps } from './types';

export default function RespaldadoPorOptions({
  selectedComponentId,
  getActiveComponents,
  updateComponentProps,
}: RespaldadoPorOptionsProps) {
  if (!selectedComponentId) return null;

  const component = getActiveComponents().find((comp) => comp.id === selectedComponentId);
  if (!component || component.type !== 'respaldadoPor') return null;

  // Valores por defecto si no existen
  const texto = component.props?.texto || 'Respaldado por';
  const nombre = component.props?.nombre || 'Redacción';
  const avatarUrl = component.props?.avatarUrl || '/default-avatar.png';
  const avatarTamano = component.props?.avatarTamano || 36;

  // Función para manejar la carga de archivos de avatar
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateComponentProps(selectedComponentId, { avatarUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Configuración de respaldo
      </Typography>

      <Typography variant="subtitle2" gutterBottom>
        Texto
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={texto}
        onChange={(e) => updateComponentProps(selectedComponentId, { texto: e.target.value })}
        placeholder="Respaldado por"
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Nombre
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={nombre}
        onChange={(e) => updateComponentProps(selectedComponentId, { nombre: e.target.value })}
        placeholder="Nombre del autor"
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        URL del avatar
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          value={avatarUrl}
          onChange={(e) => updateComponentProps(selectedComponentId, { avatarUrl: e.target.value })}
        />
        <Button variant="outlined" component="label" sx={{ minWidth: 'auto', p: '4px 8px' }}>
          <Icon icon="mdi:upload" />
          <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
        </Button>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Tamaño del avatar: {avatarTamano}px
      </Typography>
      <Slider
        size="small"
        value={avatarTamano}
        onChange={(_, value) =>
          updateComponentProps(selectedComponentId, { avatarTamano: value as number })
        }
        min={20}
        max={60}
        sx={{ mb: 3 }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Vista previa
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1,
          border: '1px solid #ddd',
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          {texto}
        </Typography>
        <Avatar
          src={avatarUrl}
          alt={nombre}
          sx={{
            width: avatarTamano,
            height: avatarTamano,
          }}
        />
        <Typography variant="body2" fontWeight="medium">
          {nombre}
        </Typography>
      </Box>
    </Box>
  );
}
