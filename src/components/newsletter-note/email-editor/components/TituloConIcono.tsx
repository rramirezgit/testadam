import { Icon } from '@iconify/react';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import { useEditor, EditorContent } from '@tiptap/react';
import { useRef, useMemo, useState, useCallback } from 'react';

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

// Editor TipTap simplificado para títulos
function TituloTipTapEditor({
  content,
  onChange,
  textColor,
  onBlur,
}: {
  content: string;
  onChange: (content: string) => void;
  textColor: string;
  onBlur: () => void;
}) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'titulo-paragraph',
          },
        },
      }),
      TextStyle,
      Color,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor: tipTapEditor }) => {
      onChange(tipTapEditor.getHTML());
    },
    onBlur,
    editorProps: {
      attributes: {
        class: 'titulo-editor',
        placeholder: 'Escribe el título...',
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    autofocus: true,
    editable: true,
  });

  return (
    <Box
      sx={{
        flexGrow: 1,
        '& .titulo-editor': {
          padding: '0 !important',
          minHeight: 'auto !important',
          border: 'none !important',
          borderRadius: '0 !important',
          backgroundColor: 'transparent !important',
          outline: 'none',
          color: textColor,
          fontWeight: 'bold',
          fontSize: '1.2rem',
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          lineHeight: '1.2',
          '& .ProseMirror': {
            padding: '0 !important',
            minHeight: 'auto !important',
            outline: 'none',
            color: textColor,
            fontWeight: 'bold',
            fontSize: '1.2rem',
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            lineHeight: '1.2',
            '& p': {
              margin: '0 !important',
              padding: '0 !important',
              color: textColor,
              fontWeight: 'bold',
              fontSize: '1.2rem',
              fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
              lineHeight: '1.2',
            },
            '& p.is-editor-empty:first-child::before': {
              content: 'attr(data-placeholder)',
              position: 'absolute',
              color: `${textColor}80`,
              pointerEvents: 'none',
              height: 0,
              opacity: 0.6,
            },
            // ⚡ PREVENIR MÁRGENES EXTRAÑOS: Asegurar que no hay márgenes en elementos de formato
            '& strong, & b': {
              margin: '0 !important',
              padding: '0 !important',
              fontWeight: 'bold !important',
            },
            '& em, & i': {
              margin: '0 !important',
              padding: '0 !important',
              fontStyle: 'italic !important',
            },
            '& u': {
              margin: '0 !important',
              padding: '0 !important',
              textDecoration: 'underline !important',
            },
            '& a': {
              margin: '0 !important',
              padding: '0 !important',
              color: 'inherit !important',
              textDecoration: 'underline !important',
            },
          },
        },
      }}
    >
      {editor && <EditorContent editor={editor} />}
    </Box>
  );
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
  const [tempTitle, setTempTitle] = useState('');

  const barRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null);

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

  // Función para extraer texto plano del HTML
  const extractPlainText = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const handleTitleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setTempTitle(extractPlainText(titulo));
      setIsEditingTitle(true);
    },
    [titulo]
  );

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTitle(e.target.value);
  }, []);

  const handleTitleSubmit = useCallback(() => {
    // Si el título está vacío, usar un placeholder
    const finalTitle = tempTitle.trim() || 'Título sin contenido';
    if (finalTitle !== extractPlainText(titulo)) {
      onTituloChange(finalTitle);
    }
    setIsEditingTitle(false);
  }, [onTituloChange, tempTitle, titulo]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleTitleSubmit();
      } else if (e.key === 'Escape') {
        setIsEditingTitle(false);
        setTempTitle(extractPlainText(titulo));
      }
    },
    [handleTitleSubmit, titulo]
  );

  const handleTitleBlur = useCallback(() => {
    handleTitleSubmit();
  }, [handleTitleSubmit]);

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
          // ⚡ PREVENIR DESBORDAMIENTO: Asegurar que el contenedor no se desborde
          maxWidth: '100%',
          overflow: 'hidden',
          wordWrap: 'break-word',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
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
          <TextField
            value={tempTitle}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleBlur}
            autoFocus
            variant="standard"
            fullWidth
            placeholder="Escribe el título aquí..."
            sx={{
              '& .MuiInput-root': {
                color: textColor,
                fontWeight: 'bold',
                fontSize: '1.2rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                lineHeight: '1.2',
                '&:before': {
                  borderBottom: 'none',
                },
                '&:after': {
                  borderBottom: `2px solid ${textColor}`,
                },
                '&:hover:not(.Mui-disabled):before': {
                  borderBottom: 'none',
                },
              },
              '& .MuiInput-input': {
                padding: 0,
                color: textColor,
                fontWeight: 'bold',
                fontSize: '1.2rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                lineHeight: '1.2',
                // ⚡ PREVENIR DESBORDAMIENTO: Ajustar palabras largas en el input
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
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
              cursor: 'pointer',
              // ⚡ PREVENIR DESBORDAMIENTO: Ajustar palabras largas dentro del contenedor
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '100%',
              // ⚡ PREVENIR COMPONENTE VACÍO: Asegurar que siempre haya contenido clickeable
              minHeight: '1.2em',
              '&:hover': {
                opacity: 0.8,
              },
              // Estilo para placeholder cuando está vacío
              '&:empty::before': {
                content: '"Haz clic para editar título"',
                color: `${textColor}80`,
                fontStyle: 'italic',
                opacity: 0.7,
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
