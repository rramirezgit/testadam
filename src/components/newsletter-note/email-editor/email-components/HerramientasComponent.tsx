import type React from 'react';

import { Icon } from '@iconify/react';

import { Box, Chip, Typography, IconButton } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

// Tipo para una herramienta individual
interface Herramienta {
  id: string;
  nombre: string;
  icono: string;
  colorFondo: string;
  colorTexto: string;
  colorIcono: string;
}

// Herramientas por defecto
const DEFAULT_HERRAMIENTAS: Herramienta[] = [
  {
    id: '1',
    nombre: 'Herramienta',
    icono: 'mdi:hammer-wrench',
    colorFondo: '#f3f4f6',
    colorTexto: '#374151',
    colorIcono: '#6b7280',
  },
];

const HerramientasComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentContent,
  updateComponentProps,
  handleSelectionUpdate,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  // Obtener herramientas del componente o usar las por defecto
  const herramientas: Herramienta[] = component.props?.herramientas || DEFAULT_HERRAMIENTAS;
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const borderRadius = component.props?.borderRadius || 12;
  const opacity = component.props?.opacity || 100;

  // Aplicar opacidad solo al color de fondo
  const getBackgroundColorWithOpacity = (color: string, opacityValue: number) => {
    // Convertir hex a rgba si es necesario
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacityValue / 100})`;
    }
    // Si ya es rgba o rgb, mantenerlo pero ajustar opacidad
    return color.includes('rgba') ? color.replace(/[\d.]+\)$/g, `${opacityValue / 100})`) : color;
  };

  // Función para agregar nueva herramienta
  const handleAddHerramienta = () => {
    const newHerramienta: Herramienta = {
      id: Date.now().toString(),
      nombre: 'Nueva Herramienta',
      icono: 'mdi:plus',
      colorFondo: '#f3f4f6',
      colorTexto: '#374151',
      colorIcono: '#6b7280',
    };

    const updatedHerramientas = [...herramientas, newHerramienta];
    updateComponentProps(component.id, { herramientas: updatedHerramientas });
  };

  // Función para remover herramienta
  const handleRemoveHerramienta = (herramientaId: string) => {
    if (herramientas.length > 1) {
      const updatedHerramientas = herramientas.filter((h) => h.id !== herramientaId);
      updateComponentProps(component.id, { herramientas: updatedHerramientas });
    }
  };

  return (
    <ComponentWithToolbar
      isSelected={isSelected}
      index={index}
      totalComponents={totalComponents}
      componentId={component.id}
      moveComponent={moveComponent}
      removeComponent={removeComponent}
      onClick={handleClick}
    >
      <Box
        sx={{
          backgroundColor: getBackgroundColorWithOpacity(backgroundColor, opacity),
          borderRadius: `${borderRadius}px`,
          border: '1px solid rgba(0,0,0,0.08)',
          padding: '20px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
          ...(component.style || {}),
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: '#fbbf24',
              boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
            }}
          >
            <Icon
              icon="mdi:hammer-wrench"
              style={{
                fontSize: 20,
                color: '#ffffff',
              }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: '#1f2937',
              fontWeight: 600,
              fontSize: '20px',
              letterSpacing: '-0.01em',
            }}
          >
            Herramientas
          </Typography>
        </Box>

        {/* Herramientas */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
          {herramientas.map((herramienta) => (
            <Box
              key={herramienta.id}
              sx={{
                position: 'relative',
                display: 'inline-block',
                '&:hover .remove-btn': {
                  opacity: 1,
                },
              }}
            >
              <Chip
                icon={
                  <Icon
                    icon={herramienta.icono}
                    style={{
                      fontSize: 16,
                      color: herramienta.colorIcono,
                    }}
                  />
                }
                label={herramienta.nombre}
                sx={{
                  backgroundColor: herramienta.colorFondo,
                  color: herramienta.colorTexto,
                  fontWeight: 500,
                  fontSize: '14px',
                  height: 36,
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  },
                  '& .MuiChip-label': {
                    paddingLeft: '8px',
                    paddingRight: '12px',
                  },
                  '& .MuiChip-icon': {
                    marginLeft: '8px',
                    marginRight: '4px',
                  },
                }}
              />

              {/* Botón de remover (solo visible en hover y si hay más de 1) */}
              {herramientas.length > 1 && (
                <IconButton
                  className="remove-btn"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveHerramienta(herramienta.id);
                  }}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 20,
                    height: 20,
                    backgroundColor: '#ef4444',
                    color: 'white',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#dc2626',
                    },
                  }}
                >
                  <Icon icon="mdi:close" style={{ fontSize: 12 }} />
                </IconButton>
              )}
            </Box>
          ))}

          {/* Botón para agregar nueva herramienta */}
          <IconButton
            onClick={handleAddHerramienta}
            sx={{
              width: 36,
              height: 36,
              border: '2px dashed #d1d5db',
              borderRadius: '8px',
              color: '#6b7280',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb',
                color: '#4b5563',
              },
            }}
          >
            <Icon icon="mdi:plus" style={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </ComponentWithToolbar>
  );
};

export default HerramientasComponent;
