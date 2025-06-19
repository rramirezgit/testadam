import { Box } from '@mui/material';

import RespaldadoPor from '../components/RespaldadoPor';
import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

const RespaldadoPorComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  // Handlers para la sección principal
  const handleTextoChange = (newText: string) => {
    updateComponentProps(component.id, { texto: newText });
  };

  const handleNombreChange = (newName: string) => {
    updateComponentProps(component.id, { nombre: newName });
  };

  const handleAvatarChange = (newUrl: string) => {
    updateComponentProps(component.id, { avatarUrl: newUrl });
  };

  const handleTamanoChange = (newSize: number) => {
    updateComponentProps(component.id, { avatarTamano: newSize });
  };

  // Handlers para la sección adicional (Escritor con Propietario)
  const handleMostrarEscritorPropietarioChange = (mostrar: boolean) => {
    updateComponentProps(component.id, { mostrarEscritorPropietario: mostrar });
  };

  const handleEscritorNombreChange = (newName: string) => {
    updateComponentProps(component.id, { escritorNombre: newName });
  };

  const handleEscritorAvatarChange = (newUrl: string) => {
    updateComponentProps(component.id, { escritorAvatarUrl: newUrl });
  };

  const handlePropietarioNombreChange = (newName: string) => {
    updateComponentProps(component.id, { propietarioNombre: newName });
  };

  const handlePropietarioAvatarChange = (newUrl: string) => {
    updateComponentProps(component.id, { propietarioAvatarUrl: newUrl });
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        mb: 2,
        cursor: 'pointer',
        '&:hover': {
          opacity: 0.9,
        },
        transition: 'opacity 0.2s ease-in-out',
      }}
    >
      <ComponentWithToolbar
        isSelected={isSelected}
        index={index}
        totalComponents={totalComponents}
        componentId={component.id}
        moveComponent={moveComponent}
        removeComponent={removeComponent}
        onClick={handleClick}
      >
        <RespaldadoPor
          // Props principales
          texto={component.props?.texto || 'Respaldado por'}
          nombre={component.props?.nombre || 'Redacción'}
          avatarUrl={component.props?.avatarUrl || ''}
          avatarTamano={component.props?.avatarTamano || 21}
          // Props de la sección adicional
          mostrarEscritorPropietario={component.props?.mostrarEscritorPropietario || false}
          escritorNombre={component.props?.escritorNombre || 'Escritor'}
          escritorAvatarUrl={component.props?.escritorAvatarUrl || ''}
          propietarioNombre={component.props?.propietarioNombre || 'Propietario'}
          propietarioAvatarUrl={component.props?.propietarioAvatarUrl || ''}
          // Handlers principales
          onTextoChange={handleTextoChange}
          onNombreChange={handleNombreChange}
          onAvatarChange={handleAvatarChange}
          onTamanoChange={handleTamanoChange}
        />
      </ComponentWithToolbar>
    </Box>
  );
};

export default RespaldadoPorComponent;
