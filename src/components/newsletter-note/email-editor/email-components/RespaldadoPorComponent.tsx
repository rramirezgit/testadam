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

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        mb: 2,
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
          texto={component.props?.texto || 'Respaldado por'}
          nombre={component.props?.nombre || 'Redacción'}
          avatarUrl={component.props?.avatarUrl || '/default-avatar.png'}
          avatarTamano={component.props?.avatarTamano || 36}
          onTextoChange={(newText) => updateComponentProps(component.id, { texto: newText })}
          onNombreChange={(newName) => updateComponentProps(component.id, { nombre: newName })}
          onAvatarChange={(newUrl) => updateComponentProps(component.id, { avatarUrl: newUrl })}
          onTamanoChange={(newSize) =>
            updateComponentProps(component.id, { avatarTamano: newSize })
          }
        />
      </ComponentWithToolbar>
    </Box>
  );
};

export default RespaldadoPorComponent;
