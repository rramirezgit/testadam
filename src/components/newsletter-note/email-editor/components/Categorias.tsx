import { useState } from 'react';
import { Icon } from '@iconify/react';

import { Box, Chip, Button, Popover, TextField, Typography, IconButton } from '@mui/material';

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
  className?: string;
  editable?: boolean; // Nueva prop para controlar si las categorías son editables
}

export default function Categorias({
  categorias,
  onCategoriasChange,
  className,
  editable = false,
}: CategoriasProps) {
  // Estado para el popover de edición
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [tempTexto, setTempTexto] = useState('');
  const [tempColorFondo, setTempColorFondo] = useState('');
  const [tempColorTexto, setTempColorTexto] = useState('');

  // Manejadores para editar categoría
  const handleEditClick = (event: React.MouseEvent<HTMLDivElement>, categoria: Categoria) => {
    // Solo activar el popover si el componente es editable
    if (!editable) return;

    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCategoriaEditando(categoria);
    setTempTexto(categoria.texto);
    setTempColorFondo(categoria.colorFondo);
    setTempColorTexto(categoria.colorTexto);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setCategoriaEditando(null);
  };

  const handleApplyChanges = () => {
    if (categoriaEditando) {
      const nuevasCategorias = categorias.map((cat) =>
        cat.id === categoriaEditando.id
          ? { ...cat, texto: tempTexto, colorFondo: tempColorFondo, colorTexto: tempColorTexto }
          : cat
      );
      onCategoriasChange(nuevasCategorias);
    }
    handleClosePopover();
  };

  const handleDeleteCategoria = () => {
    if (categoriaEditando) {
      const nuevasCategorias = categorias.filter((cat) => cat.id !== categoriaEditando.id);
      onCategoriasChange(nuevasCategorias);
      handleClosePopover();
    }
  };

  const handleAddCategoria = () => {
    // Verificar si ya hay 4 categorías
    if (categorias.length >= 4) {
      return; // No permitir agregar más de 4 categorías
    }

    const nuevaCategoria: Categoria = {
      id: `cat-${Date.now()}`,
      texto: 'Nueva categoría',
      colorFondo: '#e0f7fa',
      colorTexto: '#006064',
    };
    onCategoriasChange([...categorias, nuevaCategoria]);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'categoria-popover' : undefined;

  return (
    <Box className={`news-Categorias ${className || ''}`} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {categorias.map((categoria) => (
          <Chip
            key={categoria.id}
            label={categoria.texto}
            onClick={
              editable
                ? (e) => handleEditClick(e as React.MouseEvent<HTMLDivElement>, categoria)
                : undefined
            }
            sx={{
              backgroundColor: categoria.colorFondo,
              color: categoria.colorTexto,
              fontWeight: 'medium',
              cursor: editable ? 'pointer' : 'default',
              '&:hover': {
                backgroundColor: categoria.colorFondo,
                opacity: 0.9,
              },
            }}
          />
        ))}
        {editable && categorias.length < 4 && (
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

      {editable && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box sx={{ p: 2, width: 280 }}>
            <Typography variant="subtitle1" gutterBottom>
              Editar categoría
            </Typography>

            <TextField
              fullWidth
              label="Texto"
              value={tempTexto}
              onChange={(e) => setTempTexto(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Color de fondo
            </Typography>
            <TextField
              type="color"
              fullWidth
              value={tempColorFondo}
              onChange={(e) => setTempColorFondo(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography variant="subtitle2" gutterBottom>
              Color de texto
            </Typography>
            <TextField
              type="color"
              fullWidth
              value={tempColorTexto}
              onChange={(e) => setTempColorTexto(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <Typography variant="subtitle2">Vista previa:</Typography>
              <Chip
                label={tempTexto || 'Texto'}
                sx={{
                  backgroundColor: tempColorFondo,
                  color: tempColorTexto,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                onClick={handleDeleteCategoria}
                color="error"
                variant="outlined"
                startIcon={<Icon icon="mdi:delete" />}
              >
                Eliminar
              </Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={handleClosePopover} variant="outlined">
                  Cancelar
                </Button>
                <Button onClick={handleApplyChanges} variant="contained">
                  Aplicar
                </Button>
              </Box>
            </Box>
          </Box>
        </Popover>
      )}
    </Box>
  );
}
