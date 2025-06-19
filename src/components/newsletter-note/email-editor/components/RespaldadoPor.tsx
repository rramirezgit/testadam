import { Box, Avatar, Typography } from '@mui/material';

interface RespaldadoPorProps {
  texto: string;
  nombre: string;
  avatarUrl: string;
  avatarTamano: number;
  mostrarEscritorPropietario?: boolean;
  escritorNombre?: string;
  escritorAvatarUrl?: string;
  propietarioNombre?: string;
  propietarioAvatarUrl?: string;
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
  mostrarEscritorPropietario = false,
  escritorNombre = 'Escritor',
  escritorAvatarUrl = '',
  propietarioNombre = 'Propietario',
  propietarioAvatarUrl = '',
  onTextoChange,
  onNombreChange,
  onAvatarChange,
  onTamanoChange,
  className,
}: RespaldadoPorProps) {
  return (
    <Box className={`news-RespaldadoPor ${className || ''}`} sx={{ margin: '0' }}>
      {/* Sección Principal: Respaldado por */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          padding: '6px 10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          marginBottom: mostrarEscritorPropietario ? 1 : 0,
        }}
      >
        {/* Texto descriptivo */}
        <Typography
          variant="caption"
          sx={{
            fontSize: '13px',
            color: '#9e9e9e',
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          {texto}
        </Typography>

        {/* Avatar (solo si hay URL) */}
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

        {/* Nombre del autor */}
        <Typography
          variant="body2"
          sx={{
            fontSize: '13px',
            color: '#616161',
            fontWeight: 400,
            lineHeight: 1,
          }}
        >
          {nombre}
        </Typography>

        {/* Sección Adicional: Escritor con Propietario */}
        {mostrarEscritorPropietario && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              padding: '6px 10px',
              borderRadius: '12px',
              marginTop: 1,
            }}
          >
            {/* Texto "Escritor con" */}
            <Typography
              variant="caption"
              sx={{
                fontSize: '13px',
                lineHeight: 1,
                fontWeight: 400,
              }}
            >
              Escritor con
            </Typography>

            {/* Avatar del Escritor */}
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

            {/* Nombre del Escritor */}
            <Typography
              variant="body2"
              sx={{
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {escritorNombre}
            </Typography>

            {/* Avatar del Propietario */}
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

            {/* Nombre del Propietario */}
            <Typography
              variant="body2"
              sx={{
                fontSize: '13px',
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {propietarioNombre}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
