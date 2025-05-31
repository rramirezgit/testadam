import { Box, Avatar, Typography } from '@mui/material';

interface RespaldadoPorProps {
  texto: string;
  nombre: string;
  avatarUrl: string;
  avatarTamano: number;
  onTextoChange: (nuevoTexto: string) => void;
  onNombreChange: (nuevoNombre: string) => void;
  onAvatarChange: (nuevoAvatar: string) => void;
  onTamanoChange: (nuevoTamano: number) => void;
  className?: string;
}

export default function RespaldadoPor({
  texto,
  nombre,
  avatarUrl,
  avatarTamano,
  onTextoChange,
  onNombreChange,
  onAvatarChange,
  onTamanoChange,
  className,
}: RespaldadoPorProps) {
  return (
    <Box className={`news-RespaldadoPor ${className || ''}`}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
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
