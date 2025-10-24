import { useState } from 'react';

import { Box } from '@mui/material';

import IconPicker from '../icon-picker';
import ComponentWithToolbar from './ComponentWithToolbar';
import TituloConIcono from '../components/TituloConIcono';
import AIAssistantModal from '../ai-menu/AIAssistantModal';

import type { EmailComponentProps } from './types';

const TituloConIconoComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  onComponentSelect,
  updateComponentContent,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const [showIconPickerTitulo, setShowIconPickerTitulo] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔵 TituloConIconoComponent clicked:', component.id, {
      onSelect: !!onSelect,
      onComponentSelect: !!onComponentSelect,
    });

    // Usar onComponentSelect si está disponible (para componentes dentro de notas)
    if (onComponentSelect) {
      onComponentSelect(component.id);
      console.log('🟢 TituloConIconoComponent onComponentSelect called for:', component.id);
    } else if (onSelect) {
      onSelect();
      console.log('🟢 TituloConIconoComponent onSelect called for:', component.id);
    }
  };

  const handleTituloChange = (newContent: string) => {
    console.log('💾 Guardando contenido:', newContent);
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

  const handleAIClick = () => {
    setShowAIModal(true);
  };

  const handleAIModalClose = () => {
    setShowAIModal(false);
  };

  const handleApplyAIResult = (newText: string) => {
    updateComponentContent(component.id, newText);
    setShowAIModal(false);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <ComponentWithToolbar
        isSelected={isSelected}
        index={index}
        totalComponents={totalComponents}
        componentId={component.id}
        componentType="tituloConIcono"
        moveComponent={moveComponent}
        removeComponent={removeComponent}
        onClick={handleClick}
        onAIClick={handleAIClick}
      >
        <Box sx={{ overflow: 'visible' }}>
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
            isSelected={isSelected}
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

      {/* Modal de Asistente de IA */}
      <AIAssistantModal
        open={showAIModal}
        onClose={handleAIModalClose}
        selectedText={component.content || ''}
        onApply={handleApplyAIResult}
      />
    </Box>
  );
};

export default TituloConIconoComponent;
