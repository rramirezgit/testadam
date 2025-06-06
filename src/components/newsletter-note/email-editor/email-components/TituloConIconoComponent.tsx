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

  const handleGradientChange = (type: 'linear' | 'radial', color1: string, color2: string) => {
    updateComponentProps(component.id, {
      gradientType: type,
      gradientColor1: color1,
      gradientColor2: color2,
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
            gradientColor1={component.props?.gradientColor1 || 'rgba(78, 205, 196, 0.06)'}
            gradientColor2={component.props?.gradientColor2 || 'rgba(38, 166, 154, 0.00)'}
            gradientType={component.props?.gradientType || 'linear'}
            gradientAngle={component.props?.gradientAngle || 180}
            colorDistribution={component.props?.colorDistribution || 0}
            textColor={component.props?.textColor || '#00C3C3'}
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
