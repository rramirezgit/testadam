'use client';

import React from 'react';

import { Box, Paper, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import { getHeaderConfig } from '../constants/newsletter-header-variants';

import type { EmailComponentProps } from './types';

const NewsletterHeaderReusableComponent: React.FC<EmailComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onComponentSelect,
  updateComponentProps,
  updateComponentStyle,
  index,
  moveComponent,
  removeComponent,
  totalComponents,
}) => {
  const props = component.props || {};
  const config = getHeaderConfig();

  // Props con fallback a configuración
  const textColor = props.textColor ?? config.textColor;
  const alignment = props.alignment ?? config.alignment;
  const padding = props.padding ? props.padding / 8 : config.padding / 8;
  const borderRadius = props.borderRadius ?? config.borderRadius;
  const backgroundImageUrl = props.backgroundImageUrl ?? config.backgroundImageUrl;
  const backgroundSize = props.backgroundSize ?? config.backgroundSize;
  const backgroundPosition = props.backgroundPosition ?? config.backgroundPosition;
  const backgroundRepeat = props.backgroundRepeat ?? config.backgroundRepeat;
  const minHeight = props.minHeight ?? config.minHeight;

  const handleSelect = () => {
    onSelect();
    if (onComponentSelect) {
      onComponentSelect(component.id);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    minHeight,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <ComponentWithToolbar
      isSelected={isSelected}
      index={index}
      totalComponents={totalComponents}
      componentId={component.id}
      moveComponent={moveComponent}
      removeComponent={removeComponent}
      onClick={handleSelect}
    >
      <Paper
        elevation={isSelected ? 3 : 1}
        sx={{
          p: padding,
          textAlign: alignment,
          border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
          borderRadius,
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
          overflow: 'hidden',
          ...backgroundStyle,
          '&:hover': {
            borderColor: '#1976d2',
          },
        }}
        onClick={handleSelect}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Logo deshabilitado en esta configuración */}

          {/* Sponsor deshabilitado temporalmente */}

          {/* Título */}
          {props.title && props.title.trim() !== '' && (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: textColor,
                mb: 1,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {props.title}
            </Typography>
          )}

          {/* Subtítulo */}
          {props.subtitle && props.subtitle.trim() !== '' && (
            <Typography
              variant="subtitle1"
              sx={{
                color: textColor,
                mb: 2,
                fontStyle: 'italic',
              }}
            >
              {props.subtitle}
            </Typography>
          )}

          {/* Banner deshabilitado en esta configuración */}
        </Box>
      </Paper>
    </ComponentWithToolbar>
  );
};

export default React.memo(NewsletterHeaderReusableComponent);
