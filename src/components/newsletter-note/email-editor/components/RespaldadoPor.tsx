import { useRef, useState, useEffect, useCallback } from 'react';

import { Box, Avatar, Typography } from '@mui/material';

import SimpleTipTapEditor from '../../simple-tiptap-editor';

/**
 * Función helper para renderizar HTML de TipTap como contenido seguro
 * Extrae y renderiza el contenido manteniendo el formato visual
 */
function renderTipTapContent(html: string): React.ReactNode {
  if (!html) return '';

  // Si no contiene HTML, retornar tal cual
  if (!html.includes('<')) return html;

  // Renderizar usando dangerouslySetInnerHTML de forma segura
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

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
  onEscritorNombreChange?: (nuevoNombre: string) => void;
  onPropietarioNombreChange?: (nuevoNombre: string) => void;
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
  onEscritorNombreChange,
  onPropietarioNombreChange,
  className,
}: RespaldadoPorProps) {
  // Estados para controlar edición inline
  const [isEditingTexto, setIsEditingTexto] = useState(false);
  const [isEditingNombre, setIsEditingNombre] = useState(false);
  const [isEditingEscritor, setIsEditingEscritor] = useState(false);
  const [isEditingPropietario, setIsEditingPropietario] = useState(false);
  const [tempTexto, setTempTexto] = useState('');
  const [tempNombre, setTempNombre] = useState('');
  const [tempEscritorNombre, setTempEscritorNombre] = useState('');
  const [tempPropietarioNombre, setTempPropietarioNombre] = useState('');

  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handlers para activar edición
  const handleTextoClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (isEditingTexto) return;
      const content =
        texto?.includes('<') && texto?.includes('>') ? texto : `<p>${texto || ''}</p>`;
      setTempTexto(content);
      setIsEditingTexto(true);
    },
    [texto, isEditingTexto]
  );

  const handleNombreClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (isEditingNombre) return;
      const content =
        nombre?.includes('<') && nombre?.includes('>') ? nombre : `<p>${nombre || ''}</p>`;
      setTempNombre(content);
      setIsEditingNombre(true);
    },
    [nombre, isEditingNombre]
  );

  const handleEscritorClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (isEditingEscritor) return;
      const content =
        escritorNombre?.includes('<') && escritorNombre?.includes('>')
          ? escritorNombre
          : `<p>${escritorNombre || ''}</p>`;
      setTempEscritorNombre(content);
      setIsEditingEscritor(true);
    },
    [escritorNombre, isEditingEscritor]
  );

  const handlePropietarioClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (isEditingPropietario) return;
      const content =
        propietarioNombre?.includes('<') && propietarioNombre?.includes('>')
          ? propietarioNombre
          : `<p>${propietarioNombre || ''}</p>`;
      setTempPropietarioNombre(content);
      setIsEditingPropietario(true);
    },
    [propietarioNombre, isEditingPropietario]
  );

  // Detector de clicks fuera del editor
  useEffect(() => {
    if (!isEditingTexto && !isEditingNombre && !isEditingEscritor && !isEditingPropietario)
      return undefined;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // No cerrar si el clic fue en elementos del editor
      if (
        target.closest('.ProseMirror') ||
        target.closest('[role="tooltip"]') ||
        target.closest('.MuiPopover-root') ||
        target.closest('.MuiDialog-root') ||
        target.closest('.tippy-box')
      ) {
        return;
      }

      // Cerrar todos los editores
      setIsEditingTexto(false);
      setIsEditingNombre(false);
      setIsEditingEscritor(false);
      setIsEditingPropietario(false);
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingTexto, isEditingNombre, isEditingEscritor, isEditingPropietario]);

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
        {isEditingTexto ? (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              minWidth: '60px',
              '& .ProseMirror': {
                fontSize: '13px',
                color: '#9e9e9e',
                lineHeight: 1,
                fontWeight: 400,
                padding: '0 !important',
                minHeight: '1.2em !important',
              },
              '& .ProseMirror p': {
                margin: 0,
                padding: 0,
              },
            }}
          >
            <SimpleTipTapEditor
              content={tempTexto}
              onChange={(newContent) => {
                setTempTexto(newContent);
                onTextoChange(newContent);
              }}
              showToolbar={false}
              placeholder="Respaldado por"
              style={{
                fontSize: '13px',
                color: '#9e9e9e',
                fontWeight: 400,
              }}
            />
          </Box>
        ) : (
          <Typography
            variant="caption"
            onClick={handleTextoClick}
            sx={{
              fontSize: '13px',
              color: '#9e9e9e',
              lineHeight: 1,
              fontWeight: 400,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            {renderTipTapContent(texto)}
          </Typography>
        )}

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
        {isEditingNombre ? (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              minWidth: '60px',
              '& .ProseMirror': {
                fontSize: '13px',
                color: '#616161',
                lineHeight: 1,
                fontWeight: 400,
                padding: '0 !important',
                minHeight: '1.2em !important',
              },
              '& .ProseMirror p': {
                margin: 0,
                padding: 0,
              },
            }}
          >
            <SimpleTipTapEditor
              content={tempNombre}
              onChange={(newContent) => {
                setTempNombre(newContent);
                onNombreChange(newContent);
              }}
              showToolbar={false}
              placeholder="Redacción"
              style={{
                fontSize: '13px',
                color: '#616161',
                fontWeight: 400,
              }}
            />
          </Box>
        ) : (
          <Typography
            variant="body2"
            onClick={handleNombreClick}
            sx={{
              fontSize: '13px',
              color: '#616161',
              fontWeight: 400,
              lineHeight: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            {renderTipTapContent(nombre)}
          </Typography>
        )}

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
            {isEditingEscritor ? (
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                  minWidth: '60px',
                  '& .ProseMirror': {
                    fontSize: '13px',
                    lineHeight: 1,
                    fontWeight: 400,
                    padding: '0 !important',
                    minHeight: '1.2em !important',
                  },
                  '& .ProseMirror p': {
                    margin: 0,
                    padding: 0,
                  },
                }}
              >
                <SimpleTipTapEditor
                  content={tempEscritorNombre}
                  onChange={(newContent) => {
                    setTempEscritorNombre(newContent);
                    if (onEscritorNombreChange) {
                      onEscritorNombreChange(newContent);
                    }
                  }}
                  showToolbar={false}
                  placeholder="Escritor"
                  style={{
                    fontSize: '13px',
                    fontWeight: 400,
                  }}
                />
              </Box>
            ) : (
              <Typography
                variant="body2"
                onClick={handleEscritorClick}
                sx={{
                  fontSize: '13px',
                  fontWeight: 400,
                  lineHeight: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                {renderTipTapContent(escritorNombre)}
              </Typography>
            )}

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
            {isEditingPropietario ? (
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{
                  minWidth: '60px',
                  '& .ProseMirror': {
                    fontSize: '13px',
                    lineHeight: 1,
                    fontWeight: 400,
                    padding: '0 !important',
                    minHeight: '1.2em !important',
                  },
                  '& .ProseMirror p': {
                    margin: 0,
                    padding: 0,
                  },
                }}
              >
                <SimpleTipTapEditor
                  content={tempPropietarioNombre}
                  onChange={(newContent) => {
                    setTempPropietarioNombre(newContent);
                    if (onPropietarioNombreChange) {
                      onPropietarioNombreChange(newContent);
                    }
                  }}
                  showToolbar={false}
                  placeholder="Propietario"
                  style={{
                    fontSize: '13px',
                    fontWeight: 400,
                  }}
                />
              </Box>
            ) : (
              <Typography
                variant="body2"
                onClick={handlePropietarioClick}
                sx={{
                  fontSize: '13px',
                  fontWeight: 400,
                  lineHeight: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                {renderTipTapContent(propietarioNombre)}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
