'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Paper, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';

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

  const handleSelect = () => {
    onSelect();
    if (onComponentSelect) {
      onComponentSelect(component.id);
    }
  };

  const backgroundStyle = (() => {
    if (props.useGradient && props.gradientColors && props.gradientColors.length >= 2) {
      const gradient = `linear-gradient(${props.gradientDirection || 135}deg, ${props.gradientColors[0]}, ${props.gradientColors[1]})`;
      return {
        background: gradient,
      };
    }
    return {
      backgroundColor: props.backgroundColor || '#f5f5f5',
    };
  })();

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
          mb: 3,
          p: props.padding ? props.padding / 8 : 3,
          border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.2s',
          ...backgroundStyle,
          textAlign: props.alignment || 'center',
          position: 'relative',
          '&:hover': {
            elevation: 2,
            borderColor: '#1976d2',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Logo si está habilitado */}
          {props.showLogo && props.logo && (
            <Box sx={{ mb: 2 }}>
              <img
                src={props.logo}
                alt={props.logoAlt || 'Logo'}
                style={{
                  maxHeight: props.logoHeight || 60,
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </Box>
          )}

          {/* Sponsor si está habilitado */}
          {props.sponsor?.enabled && props.sponsor?.image && (
            <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: props.textColor, mb: 1 }}>
                {props.sponsor.label || 'Juntos con'}
              </Typography>
              <img
                src={props.sponsor.image}
                alt={props.sponsor.imageAlt || 'Sponsor'}
                style={{ maxHeight: 48 }}
              />
            </Box>
          )}

          {/* Título solo si no está vacío */}
          {props.title && props.title.trim() !== '' && (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: props.textColor || '#333333',
                mb: 1,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {props.title}
            </Typography>
          )}

          {/* Subtítulo solo si no está vacío */}
          {props.subtitle && props.subtitle.trim() !== '' && (
            <Typography
              variant="subtitle1"
              sx={{
                color: props.textColor || '#666666',
                mb: 2,
                fontStyle: 'italic',
              }}
            >
              {props.subtitle}
            </Typography>
          )}

          {/* Banner image si está habilitado y existe */}
          {props.showBanner && props.bannerImage && (
            <Box sx={{ mt: 2 }}>
              <img
                src={props.bannerImage}
                alt="Banner"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  display: 'block',
                }}
              />
            </Box>
          )}

          {/* Indicador de edición */}
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#1976d2',
              color: 'white',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              opacity: isSelected ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
          >
            <Icon icon="mdi:pencil" width={12} height={12} />
          </Box>
        </Box>
      </Paper>
    </ComponentWithToolbar>
  );
};

export default NewsletterHeaderReusableComponent;
