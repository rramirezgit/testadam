import { Icon } from '@iconify/react';
import { useRef, useCallback } from 'react';

import { Box, Typography } from '@mui/material';

import usePostStore from 'src/store/PostStore';

// Tipos para las propiedades del componente
interface TituloConIconoProps {
  titulo: string;
  icon: string;
  textColor: string;
  onTituloChange: (nuevoTitulo: string) => void;
  onIconChange: (nuevoIcono: string) => void;
  setShowIconPicker: (show: boolean) => void;
  className?: string;
  isSelected?: boolean; // Para saber si el componente está seleccionado
  categoryId?: string; // ID de la categoría de la nota actual
}

export default function TituloConIcono({
  titulo,
  icon,
  textColor = '#ffffff',
  onTituloChange,
  onIconChange,
  setShowIconPicker,
  className,
  isSelected = false,
  categoryId,
}: TituloConIconoProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null);

  // Obtener categorías del store
  const categories = usePostStore((state) => state.categories);

  // Buscar el nombre de la categoría basado en el categoryId
  const categoryName = categoryId ? categories.find((cat) => cat.id === categoryId)?.name : null;

  // El título a mostrar es el nombre de la categoría o un placeholder
  const displayTitle = categoryName || 'Categoria';
  const isPlaceholder = !categoryName;

  // Manejadores de eventos
  const handleIconClick = (event: React.MouseEvent) => {
    // NO usar stopPropagation - dejar que seleccione el componente
    setShowIconPicker(true);
  };

  const handleTitleClick = useCallback((e: React.MouseEvent) => {
    // NO usar stopPropagation aquí - dejar que el evento burbujee para seleccionar el componente
    // Este componente ahora solo muestra la categoría, no es editable en línea
  }, []);

  return (
    <Box
      className={`news-TituloConIcono ${className || ''}`}
      sx={{ overflow: 'visible', position: 'relative' }}
    >
      <Box
        ref={barRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderRadius: '8px 8px 0 0',
          cursor: 'pointer',
          // ⚡ PREVENIR DESBORDAMIENTO: Asegurar que el contenedor no se desborde
          maxWidth: '100%',
          overflow: 'visible', // Cambiar a visible para que el BubbleMenu sea visible
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          position: 'relative',
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
          {/* Renderizado condicional para PNG URLs vs iconos legacy */}
          {icon && icon.startsWith('http') ? (
            <img
              src={icon}
              alt="Icono"
              style={{
                width: 24,
                height: 24,
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <Icon icon={icon} width={24} height={24} />
          )}
        </Box>

        <Typography
          ref={tituloRef}
          onClick={handleTitleClick}
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 'bold',
            flexGrow: 1,
            color: isPlaceholder ? `${textColor}60` : textColor,
            cursor: 'pointer',
            // ⚡ ELIMINAR MÁRGENES: Quitar márgenes por defecto de Typography
            margin: 0,
            padding: 0,
            // ⚡ PREVENIR DESBORDAMIENTO: Ajustar palabras largas dentro del contenedor
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            maxWidth: '100%',
            // ⚡ PREVENIR COMPONENTE VACÍO: Asegurar que siempre haya contenido clickeable
            minHeight: '1.2em',
            lineHeight: '1.2',
            fontSize: '1.2rem',
            fontStyle: isPlaceholder ? 'italic' : 'normal',
            opacity: isPlaceholder ? 0.6 : 1,
            '&:hover': {
              opacity: isSelected ? 0.8 : isPlaceholder ? 0.5 : 1,
            },
            // ⚡ Quitar márgenes de elementos HTML internos
            '& p, & h1, & h2, & h3, & h4, & h5, & h6': {
              margin: 0,
              padding: 0,
              display: 'inline',
            },
          }}
        >
          {displayTitle}
        </Typography>
      </Box>
    </Box>
  );
}
