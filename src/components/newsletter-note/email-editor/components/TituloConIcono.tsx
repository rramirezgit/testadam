import { Icon } from '@iconify/react';
import { useRef, useState, useEffect, useCallback } from 'react';

import { Box, Typography } from '@mui/material';

import SimpleTipTapEditor from '../../simple-tiptap-editor';

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
  isSelected?: boolean; // Para saber si el componente está seleccionado
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
  isSelected = false,
}: TituloConIconoProps) {
  // Estado para control de edición del título
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  const barRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Estilos para el degradado
  const gradientStyle =
    gradientType === 'linear'
      ? `linear-gradient(${gradientAngle}deg, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%)`
      : `radial-gradient(circle, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%)`;

  // Manejadores de eventos
  const handleIconClick = (event: React.MouseEvent) => {
    // NO usar stopPropagation - dejar que seleccione el componente
    setShowIconPicker(true);
  };

  const handleTitleClick = useCallback(
    (e: React.MouseEvent) => {
      // NO usar stopPropagation aquí - dejar que el evento burbujee para seleccionar el componente

      // Cancelar cualquier blur pendiente
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }

      // Si ya está en modo edición, mantener el foco
      if (isEditingTitle) return;

      // Convertir contenido a HTML si es necesario
      const content =
        titulo?.includes('<') && titulo?.includes('>') ? titulo : `<p>${titulo || ''}</p>`;
      setTempTitle(content);
      setIsEditingTitle(true);
    },
    [titulo, isEditingTitle]
  );

  const handleTitleBlur = useCallback(() => {
    // NO hacer nada aquí - dejar que el click outside maneje el cierre
    // Esto previene que el blur cierre el editor cuando se abren popovers/dialogs
  }, []);

  const handleEditorMouseDown = useCallback(() => {
    // Cancelar blur cuando hay interacción con el editor
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  }, []);

  // Detector de clics fuera del editor para cerrarlo
  useEffect(() => {
    if (!isEditingTitle) return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // No cerrar si el clic fue en:
      // - El editor mismo
      // - BubbleMenu
      // - Popover (selector de colores)
      // - Dialog (enlaces)
      // - Tooltips
      if (
        target.closest('.ProseMirror') ||
        target.closest('[role="tooltip"]') ||
        target.closest('.MuiPopover-root') ||
        target.closest('.MuiDialog-root') ||
        target.closest('.tippy-box')
      ) {
        return;
      }

      // Solo cerrar el editor (el guardado ya se hace en onChange)
      setIsEditingTitle(false);
    };

    // Agregar listener después de un pequeño delay para no capturar el clic que abrió el editor
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingTitle]);

  // Cleanup del timeout al desmontar
  useEffect(
    () => () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    },
    []
  );

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
          background: gradientStyle,
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

        {isEditingTitle ? (
          <Box
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleEditorMouseDown}
            sx={{
              flexGrow: 1,
              position: 'relative',
              zIndex: 1,
              '& .ProseMirror': {
                color: textColor,
                fontWeight: 'bold',
                fontSize: '1.2rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                lineHeight: '1.2',
                padding: '0 !important',
                minHeight: '1.2em !important',
              },
              '& .ProseMirror p': {
                margin: 0,
                padding: 0,
              },
              '& .ProseMirror p.is-editor-empty:first-child::before': {
                color: `${textColor}80`,
                opacity: 0.7,
              },
            }}
          >
            <SimpleTipTapEditor
              content={tempTitle}
              onChange={(newContent) => {
                setTempTitle(newContent);
                onTituloChange(newContent); // ✅ Guardar inmediatamente
              }}
              onBlur={handleTitleBlur}
              showToolbar={false}
              placeholder="Escribe el título aquí..."
              style={{
                color: textColor,
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}
            />
          </Box>
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
              '&:hover': {
                opacity: isSelected ? 0.8 : 1,
              },
              // Estilo para placeholder cuando está vacío
              '&:empty::before': {
                content: '"Haz clic para editar título"',
                color: `${textColor}80`,
                fontStyle: 'italic',
                opacity: 0.7,
              },
              // ⚡ Quitar márgenes de elementos HTML internos
              '& p, & h1, & h2, & h3, & h4, & h5, & h6': {
                margin: 0,
                padding: 0,
                display: 'inline',
              },
            }}
            dangerouslySetInnerHTML={{
              __html:
                titulo ||
                '<span style="color: ' +
                  textColor +
                  '80; font-style: italic; opacity: 0.7;">Haz clic para editar título</span>',
            }}
          />
        )}
      </Box>
    </Box>
  );
}
