import type React from 'react';

import { useState } from 'react';

import { Box, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditorWithFlags from '../../simple-tiptap-editor-with-flags';

import type { EmailComponentProps } from './types';

const SummaryComponent = ({
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
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleContentChange = (newContent: string) => {
    updateComponentContent(component.id, newContent);
  };

  const handleSelectIcon = (iconName: string) => {
    updateComponentProps(component.id, { icon: iconName });
  };

  const iconColor = component.props?.iconColor || '#000000';
  const iconSize = component.props?.iconSize || 24;
  const titleColor = component.props?.titleColor || '#000000';
  const titleFontWeight = component.props?.titleFontWeight || 'normal';
  const titleFontFamily = component.props?.titleFontFamily || 'inherit';

  // Configuración del gradiente
  const useGradient = component.props?.useGradient || false;
  const gradientType = component.props?.gradientType || 'linear';
  const gradientDirection = component.props?.gradientDirection || 'to right';
  const gradientColor1 = component.props?.gradientColor1 || '#f5f7fa';
  const gradientColor2 = component.props?.gradientColor2 || '#c3cfe2';

  const backgroundStyle = useGradient
    ? {
        background:
          gradientType === 'linear'
            ? `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`
            : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`,
      }
    : { backgroundColor: component.props?.backgroundColor || '#f5f7fa' };

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
          padding: '16px',
          borderLeft: `4px solid ${component.props?.borderColor || '#4caf50'}`,
          borderRadius: '4px',
          ...backgroundStyle,
          ...(component.style || {}),
        }}
      >
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: titleColor,
            fontWeight: titleFontWeight,
            fontFamily: titleFontFamily,
          }}
        >
          {component.props?.label || 'Resumen'}
        </Typography>
        <Typography variant="body2">
          <SimpleTipTapEditorWithFlags
            content={component.content}
            onChange={handleContentChange}
            onSelectionUpdate={handleSelectionUpdate}
            style={{ outline: 'none' }}
            showToolbar={false}
          />
        </Typography>
      </Box>
    </ComponentWithToolbar>
  );
};

export default SummaryComponent;
