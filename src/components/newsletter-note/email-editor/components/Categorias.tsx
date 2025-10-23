import { useState } from 'react';
import { Icon } from '@iconify/react';

import { Box, IconButton } from '@mui/material';

import SimpleTipTapEditor from '../../simple-tiptap-editor';

// Tipo para una categoría
export interface Categoria {
  id: string;
  texto: string;
  colorFondo: string;
  colorTexto: string;
}

interface CategoriasProps {
  categorias: Categoria[];
  onCategoriasChange: (categorias: Categoria[]) => void;
  onCategoriaUpdate?: (catId: string, field: keyof Categoria, value: string) => void;
  className?: string;
  editable?: boolean;
  // Nuevas props para estilos configurables
  borderRadius?: number;
  padding?: number;
  fontSize?: number;
  fontWeight?: number | string;
}

export default function Categorias({
  categorias,
  onCategoriasChange,
  onCategoriaUpdate,
  className,
  editable = false,
  borderRadius = 16,
  padding = 4,
  fontSize = 14,
  fontWeight = 500,
}: CategoriasProps) {
  // Estado para tracking de edición
  const [editingCategoriaId, setEditingCategoriaId] = useState<string | null>(null);
  const [tempTexto, setTempTexto] = useState<string>('');

  const handleAddCategoria = () => {
    // Verificar si ya hay 6 categorías (actualizado el límite)
    if (categorias.length >= 6) {
      return;
    }

    const nuevaCategoria: Categoria = {
      id: `cat-${Date.now()}`,
      texto: 'Nueva categoría',
      colorFondo: '#e3f2fd',
      colorTexto: '#1565c0',
    };
    onCategoriasChange([...categorias, nuevaCategoria]);
  };

  // Handler para click en categoría
  const handleCategoriaClick = (cat: Categoria) => {
    if (!editable) return;
    setEditingCategoriaId(cat.id);
    setTempTexto(cat.texto);
  };

  // Helper para extraer texto plano del HTML
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Handler para blur (finalizar edición)
  const handleBlur = () => {
    if (editingCategoriaId && onCategoriaUpdate) {
      // Extraer solo el texto plano, sin HTML
      const plainText = stripHtml(tempTexto);
      // Solo actualizar si el texto realmente cambió
      const currentCategoria = categorias.find((cat) => cat.id === editingCategoriaId);
      if (currentCategoria && plainText !== currentCategoria.texto) {
        onCategoriaUpdate(editingCategoriaId, 'texto', plainText);
      }
    }
    setEditingCategoriaId(null);
  };

  // Handler para eliminar categoría
  const handleRemoveCategoria = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (categorias.length <= 1) return; // Mantener al menos una categoría

    const nuevasCategorias = categorias.filter((cat) => cat.id !== catId);
    onCategoriasChange(nuevasCategorias);
  };

  return (
    <Box className={`news-Categorias ${className || ''}`} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {categorias.map((categoria) => (
          <Box
            key={categoria.id}
            sx={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: categoria.colorFondo,
              color: categoria.colorTexto,
              paddingTop: `${padding}px`,
              paddingBottom: `${padding}px`,
              paddingLeft: `${padding * 2}px`,
              paddingRight: `${padding * 2}px`,
              borderRadius: `${borderRadius}px`,
              fontSize: `${fontSize}px`,
              fontWeight,
              margin: editable && categorias.length > 1 ? '8px 8px 6px 0' : '0 6px 6px 0',
              textDecoration: 'none',
              lineHeight: 1.2,
              verticalAlign: 'top',
              cursor: editable ? 'pointer' : 'default',
              '&:hover': editable
                ? {
                    opacity: 0.9,
                    '& .delete-button': {
                      opacity: 1,
                    },
                  }
                : {},
            }}
            onClick={() => handleCategoriaClick(categoria)}
          >
            {editingCategoriaId === categoria.id ? (
              <Box
                sx={{
                  minWidth: '60px',
                  '& .ProseMirror': {
                    color: categoria.colorTexto,
                    fontSize: `${fontSize}px`,
                    fontWeight,
                    padding: '0 !important',
                    minHeight: '1.2em !important',
                    lineHeight: 1.2,
                  },
                  '& .ProseMirror p': {
                    margin: 0,
                    padding: 0,
                  },
                  '& .ProseMirror p.is-editor-empty:first-child::before': {
                    color: `${categoria.colorTexto}80`,
                    opacity: 0.7,
                  },
                }}
              >
                <SimpleTipTapEditor
                  key={`editor-${categoria.id}-${categoria.colorFondo}-${categoria.colorTexto}`}
                  content={tempTexto}
                  onChange={(newContent) => {
                    // Solo actualizar el estado local, no guardar aún
                    setTempTexto(newContent);
                  }}
                  onBlur={handleBlur}
                  showToolbar={false}
                  placeholder="Escribe aquí..."
                  style={{
                    color: categoria.colorTexto,
                    fontSize: `${fontSize}px`,
                    fontWeight,
                  }}
                  showBackgroundColorPicker
                  backgroundColor={categoria.colorFondo}
                  onBackgroundColorChange={(color) => {
                    // Actualizar color de fondo inmediatamente
                    if (onCategoriaUpdate) {
                      onCategoriaUpdate(categoria.id, 'colorFondo', color);
                    }
                  }}
                  onTextColorChange={(color) => {
                    // Actualizar color de texto inmediatamente
                    if (onCategoriaUpdate) {
                      onCategoriaUpdate(categoria.id, 'colorTexto', color);
                    }
                  }}
                />
              </Box>
            ) : (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                }}
              >
                {categoria.texto}
              </Box>
            )}

            {/* Botón eliminar - visible solo en hover, lado derecho */}
            {editable && categorias.length > 1 && (
              <IconButton
                size="small"
                className="delete-button"
                onClick={(e) => handleRemoveCategoria(categoria.id, e)}
                sx={{
                  position: 'absolute',
                  right: -6,
                  top: -6,
                  width: 18,
                  height: 18,
                  padding: 0,
                  backgroundColor: '#ef5350',
                  color: 'white',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  opacity: 0, // Oculto por defecto
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                    transform: 'scale(1.15)',
                  },
                  zIndex: 10,
                }}
              >
                <Icon icon="mdi:close" width={14} height={14} />
              </IconButton>
            )}
          </Box>
        ))}
        {editable && categorias.length < 6 && (
          <IconButton
            size="small"
            onClick={handleAddCategoria}
            sx={{
              border: '1px dashed #ccc',
              borderRadius: '16px',
              padding: '4px 8px',
              height: '32px',
            }}
          >
            <Icon icon="mdi:plus" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
