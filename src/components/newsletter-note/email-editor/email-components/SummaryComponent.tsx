import type React from 'react';

import { useState } from 'react';
import { Icon } from '@iconify/react';

import { Box, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditorWithFlags from '../../simple-tiptap-editor-with-flags';

import type { EmailComponentProps } from './types';

// Definición de tipos de summary con sus configuraciones
const SUMMARY_TYPES = {
  resumen: {
    label: 'Resumen',
    icon: 'mdi:note-text-outline',
    backgroundColor: '#f8f9fa',
    iconColor: '#6c757d',
    textColor: '#495057',
  },
  concepto: {
    label: 'Concepto',
    icon: 'mdi:lightbulb-outline',
    backgroundColor: '#e7f3ff',
    iconColor: '#0066cc',
    textColor: '#003d7a',
  },
  dato: {
    label: 'Dato',
    icon: 'mdi:lightbulb-on',
    backgroundColor: '#fff8e1',
    iconColor: '#f57c00',
    textColor: '#e65100',
  },
  tip: {
    label: 'TIP',
    icon: 'mdi:rocket-launch',
    backgroundColor: '#f3e5f5',
    iconColor: '#8e24aa',
    textColor: '#4a148c',
  },
  analogia: {
    label: 'Analogía',
    icon: 'mdi:brain',
    backgroundColor: '#e8f5e8',
    iconColor: '#388e3c',
    textColor: '#1b5e20',
  },
} as const;

type SummaryType = keyof typeof SUMMARY_TYPES;

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

  // Determinar el tipo de summary (por defecto 'resumen')
  const summaryType: SummaryType = (component.props?.summaryType as SummaryType) || 'resumen';
  const typeConfig = SUMMARY_TYPES[summaryType];

  // Permitir personalización pero usar valores por defecto del tipo
  const backgroundColor = component.props?.backgroundColor || typeConfig.backgroundColor;
  const iconColor = component.props?.iconColor || typeConfig.iconColor;
  const textColor = component.props?.textColor || typeConfig.textColor;
  const icon = component.props?.icon || typeConfig.icon;
  const label = component.props?.label || typeConfig.label;

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
          backgroundColor,
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.08)',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
          ...(component.style || {}),
        }}
      >
        {/* Header con icono y título */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            padding: '16px 20px 12px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <Icon
              icon={icon}
              style={{
                fontSize: 18,
                color: iconColor,
              }}
            />
          </Box>

          <Typography
            variant="subtitle1"
            sx={{
              color: textColor,
              fontWeight: 600,
              fontSize: '16px',
              letterSpacing: '-0.01em',
            }}
          >
            {label}
          </Typography>
        </Box>

        {/* Contenido */}
        <Box
          sx={{
            padding: '16px 20px 20px 20px',
          }}
        >
          <Box
            sx={{
              color: '#6c757d',
              fontSize: '15px',
              lineHeight: 1.6,
              '& p': {
                margin: 0,
                color: '#6c757d',
              },
              '& p:empty::before': {
                content: '"Escribe el contenido aquí..."',
                color: '#adb5bd',
                fontStyle: 'italic',
              },
            }}
          >
            <SimpleTipTapEditorWithFlags
              content={component.content}
              onChange={handleContentChange}
              onSelectionUpdate={handleSelectionUpdate}
              style={{ outline: 'none' }}
              showToolbar={false}
            />
          </Box>
        </Box>
      </Box>
    </ComponentWithToolbar>
  );
};

export default SummaryComponent;
