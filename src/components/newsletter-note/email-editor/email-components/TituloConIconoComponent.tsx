import { useState } from 'react';

import { Box } from '@mui/material';

import IconPicker from '../icon-picker';
import ComponentWithToolbar from './ComponentWithToolbar';
import TituloConIcono from '../components/TituloConIcono';

import type { EmailComponentProps } from './types';

const TituloConIconoComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentContent,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const [showIconPickerTitulo, setShowIconPickerTitulo] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleTituloChange = (newContent: string) => {
    updateComponentContent(component.id, newContent);
  };

  const handleIconChangeTitulo = (newIcon: string) => {
    updateComponentProps(component.id, { icon: newIcon });
  };

  // Esta función ya no se usa directamente en TituloConIcono, pero se mantiene para el panel lateral
  const handleGradientChange = (type: 'linear' | 'radial', color1: string, color2: string) => {
    updateComponentProps(component.id, {
      gradientType: type,
      gradientColor1: color1,
      gradientColor2: color2,
    });
  };

  // Nueva función para manejar cambios en el ángulo del gradiente
  const handleGradientAngleChange = (angle: number) => {
    updateComponentProps(component.id, {
      gradientAngle: angle,
    });
  };

  // Nueva función para manejar cambios en la distribución de colores
  const handleColorDistributionChange = (distribution: number) => {
    updateComponentProps(component.id, {
      colorDistribution: distribution,
    });
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
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
        <Box>
          <TituloConIcono
            titulo={component.content}
            icon={component.props?.icon || 'mdi:newspaper-variant-outline'}
            gradientColor1={component.props?.gradientColor1 || '#4facfe'}
            gradientColor2={component.props?.gradientColor2 || '#00f2fe'}
            gradientType={component.props?.gradientType || 'linear'}
            gradientAngle={component.props?.gradientAngle || 90}
            colorDistribution={component.props?.colorDistribution || 50}
            textColor={component.props?.textColor || '#ffffff'}
            onTituloChange={handleTituloChange}
            onIconChange={handleIconChangeTitulo}
            onGradientChange={handleGradientChange}
            setShowIconPicker={setShowIconPickerTitulo}
          />
        </Box>
      </ComponentWithToolbar>

      {showIconPickerTitulo && (
        <IconPicker
          open={showIconPickerTitulo}
          onClose={() => setShowIconPickerTitulo(false)}
          onSelectIcon={(iconName) => {
            handleIconChangeTitulo(iconName);
            setShowIconPickerTitulo(false);
          }}
          currentIcon={component.props?.icon || 'mdi:newspaper-variant-outline'}
        />
      )}
    </Box>
  );
};

export default TituloConIconoComponent;
