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
            icon={component.props?.icon || 'mdi:chart-line'}
            gradientColor1={component.props?.gradientColor1 || 'rgba(255, 184, 77, 0.08)'}
            gradientColor2={component.props?.gradientColor2 || 'rgba(243, 156, 18, 0.00)'}
            gradientType={component.props?.gradientType || 'linear'}
            gradientAngle={component.props?.gradientAngle || 180}
            colorDistribution={component.props?.colorDistribution || 0}
            textColor={component.props?.textColor || '#E67E22'}
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
          onSelectIcon={(iconUrl) => {
            handleIconChangeTitulo(iconUrl);
            setShowIconPickerTitulo(false);
          }}
          currentIcon={component.props?.icon || 'mdi:chart-line'}
        />
      )}
    </Box>
  );
};

export default TituloConIconoComponent;
