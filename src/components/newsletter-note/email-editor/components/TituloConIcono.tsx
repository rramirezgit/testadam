import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';

import { Box, TextField, Typography } from '@mui/material';

// Tipos para las propiedades del componente
interface TituloConIconoProps {
  titulo: string;
  icon: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientType: 'linear' | 'radial';
  gradientAngle: number;
  colorDistribution: number; // Porcentaje que ocupa el primer color (0-100)
  textColor: string;
  onTituloChange: (nuevoTitulo: string) => void;
  onIconChange: (nuevoIcono: string) => void;
  onGradientChange: (tipo: 'linear' | 'radial', color1: string, color2: string) => void;
  setShowIconPicker: (show: boolean) => void;
  className?: string;
}

export default function TituloConIcono({
  titulo,
  icon,
  gradientColor1,
  gradientColor2,
  gradientType,
  gradientAngle = 90,
  colorDistribution = 50, // Valor por defecto: 50%
  textColor = '#ffffff',
  onTituloChange,
  onIconChange,
  onGradientChange,
  setShowIconPicker,
  className,
}: TituloConIconoProps) {
  // Estado para control de edición del título
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitulo, setTempTitulo] = useState(titulo);

  const barRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Estilos para el degradado
  const gradientStyle =
    gradientType === 'linear'
      ? `linear-gradient(${gradientAngle}deg, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%)`
      : `radial-gradient(circle, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%)`;

  // Manejadores de eventos
  const handleIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowIconPicker(true);
  };

  const handleTitleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsEditingTitle(true);
    // Enfoca el input después de renderizarlo
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitulo(event.target.value);
  };

  const handleTitleBlur = () => {
    if (tempTitulo !== titulo) {
      onTituloChange(tempTitulo);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (tempTitulo !== titulo) {
        onTituloChange(tempTitulo);
      }
      setIsEditingTitle(false);
    } else if (event.key === 'Escape') {
      setTempTitulo(titulo);
      setIsEditingTitle(false);
    }
  };

  return (
    <Box className={`news-TituloConIcono ${className || ''}`}>
      <Box
        ref={barRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderRadius: '8px 8px 0 0',
          background: gradientStyle,
          cursor: 'pointer',
        }}
      >
        <Box
          ref={iconRef}
          onClick={handleIconClick}
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: textColor,
          }}
        >
          <Icon icon={icon} width={24} height={24} />
        </Box>

        {isEditingTitle ? (
          <TextField
            inputRef={inputRef}
            fullWidth
            value={tempTitulo}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            variant="standard"
            autoFocus
            sx={{
              flexGrow: 1,
              '& .MuiInputBase-input': {
                color: textColor,
                fontWeight: 'bold',
                fontSize: '1.2rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                padding: '0',
              },
              '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                borderBottomColor: 'none',
                borderBottomWidth: '0px',
              },
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottomColor: 'none',
                borderBottomWidth: '0px',
              },
            }}
          />
        ) : (
          <Typography
            ref={tituloRef}
            onClick={handleTitleClick}
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 'bold',
              flexGrow: 1,
              color: textColor,
              cursor: 'text',
            }}
          >
            {titulo}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
