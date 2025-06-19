import { Icon } from '@iconify/react';

import { Box, IconButton } from '@mui/material';

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
  className,
  editable = false,
  borderRadius = 16,
  padding = 4,
  fontSize = 14,
  fontWeight = 500,
}: CategoriasProps) {
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

  return (
    <Box className={`news-Categorias ${className || ''}`} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {categorias.map((categoria) => (
          <Box
            key={categoria.id}
            sx={{
              display: 'inline-block',
              backgroundColor: categoria.colorFondo,
              color: categoria.colorTexto,
              paddingTop: `${padding}px`,
              paddingBottom: `${padding}px`,
              paddingLeft: `${padding * 2}px`,
              paddingRight: `${padding * 2}px`,
              borderRadius: `${borderRadius}px`,
              fontSize: `${fontSize}px`,
              fontWeight,
              margin: '0 6px 6px 0',
              textDecoration: 'none',
              lineHeight: 1.2,
              verticalAlign: 'top',
              cursor: 'default',
            }}
          >
            {categoria.texto}
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
