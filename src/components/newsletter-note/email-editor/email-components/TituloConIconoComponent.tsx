import { useState, useEffect } from 'react';

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
  onComponentSelect,
  updateComponentContent,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
  categoryId, // Nueva prop para el categoryId de la nota actual
}: EmailComponentProps & { categoryId?: string }) => {
  const [showIconPickerTitulo, setShowIconPickerTitulo] = useState(false);

  // 🔍 LOGGING: Detectar cuando el componente se monta/desmonta o sus props cambian
  useEffect(() => {
    console.log('🔄 [TituloConIconoComponent] Component mounted/updated:', {
      componentId: component.id,
      content: component.content,
      categoryId: component.props?.categoryId,
      categoryName: component.props?.categoryName,
      icon: component.props?.icon,
      textColor: component.props?.textColor,
      effectiveCategoryId: component.props?.categoryId || categoryId,
    });

    return () => {
      console.log('🔻 [TituloConIconoComponent] Component will unmount:', component.id);
    };
  }, [component.id, component.content, component.props, categoryId]);

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

  const handleAIClick = () => {
    // IA support puede ser añadido en el futuro
  };

  // Priorizar el categoryId guardado en las props del componente sobre el de la nota
  const effectiveCategoryId = component.props?.categoryId || categoryId;

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
        mb="0px"
      >
        <Box sx={{ overflow: 'visible' }}>
          <TituloConIcono
            titulo={component.content}
            icon={component.props?.icon || 'mdi:chart-line'}
            textColor={component.props?.textColor || '#E67E22'}
            onTituloChange={handleTituloChange}
            onIconChange={handleIconChangeTitulo}
            setShowIconPicker={setShowIconPickerTitulo}
            isSelected={isSelected}
            categoryId={effectiveCategoryId}
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
