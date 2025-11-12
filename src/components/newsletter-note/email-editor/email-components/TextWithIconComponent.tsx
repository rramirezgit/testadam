import { Icon } from '@iconify/react';

import { Box, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import { DEFAULT_PLACEHOLDER_COLOR, shouldUsePlaceholderColor } from './utils';

import type { EmailComponentProps } from './types';

const TextWithIconComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const icon = component.props?.icon || 'mdi:information-outline';
  const iconColor = component.props?.iconColor || '#2196f3';
  const iconSize = component.props?.iconSize || 24;
  const title = component.props?.title || 'Título con Icono';
  const description = component.props?.description || 'Escribe el contenido aquí...';
  const titleColor = component.props?.titleColor || '#000000';
  const textColor = component.props?.textColor || '#333333';
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const titleSize = component.props?.titleSize || 20;
  const fontSize = component.props?.fontSize || 14;
  const alignment = component.props?.alignment || 'left';
  const spacing = component.props?.spacing || 12;
  const borderRadius = component.props?.borderRadius || 8;
  const padding = component.props?.padding || 16;

  const placeholderActive = shouldUsePlaceholderColor(
    component,
    (component.style?.color as string | undefined) || textColor || titleColor
  );
  const displayTitleColor = placeholderActive ? DEFAULT_PLACEHOLDER_COLOR : titleColor;
  const displayTextColor = placeholderActive ? DEFAULT_PLACEHOLDER_COLOR : textColor;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
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
          mb: 2,
          backgroundColor,
          borderRadius: `${borderRadius}px`,
          p: `${padding}px`,
          textAlign: alignment,
          ...(component.style || {}),
        }}
      >
        {/* Contenedor del icono y título */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
            gap: `${spacing}px`,
            mb: 1,
          }}
        >
          <Icon icon={icon} width={iconSize} height={iconSize} color={iconColor} />
          <Typography
            variant="h6"
            sx={{
              color: displayTitleColor,
              fontSize: `${titleSize}px`,
              fontWeight: 'bold',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Descripción */}
        {description && (
          <Typography
            variant="body1"
            sx={{
              color: displayTextColor,
              fontSize: `${fontSize}px`,
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </ComponentWithToolbar>
  );
};

export default TextWithIconComponent;
