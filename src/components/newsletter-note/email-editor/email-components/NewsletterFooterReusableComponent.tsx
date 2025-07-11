'use client';

import { Icon } from '@iconify/react';
import React, { useMemo } from 'react';

import { Box, Paper, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

const NewsletterFooterReusableComponent: React.FC<EmailComponentProps> = ({
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

  // Crear el estilo de fondo basado en la configuración del footer
  const backgroundStyle = useMemo(() => {
    if (props.useGradient && props.gradientColors && props.gradientColors.length >= 2) {
      return {
        backgroundImage: `linear-gradient(${props.gradientDirection || 180}deg, ${props.gradientColors[0]} 0%, ${props.gradientColors[1]} 100%)`,
      };
    }
    return { backgroundColor: props.backgroundColor || '#f5f5f5' };
  }, [props]);

  // Filtrar redes sociales habilitadas
  const enabledSocialLinks = useMemo(
    () => props.socialLinks?.filter((link: any) => link.enabled) || [],
    [props.socialLinks]
  );

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
          mt: 4,
          p: props.padding ? props.padding / 8 : 3,
          border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.2s',
          ...backgroundStyle,
          textAlign: 'center',
          position: 'relative',
          '&:hover': {
            elevation: 2,
            borderColor: '#1976d2',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: props.textColor || '#333',
              mb: 1,
              fontSize: props.fontSize ? `${props.fontSize + 4}px` : '1.125rem',
            }}
          >
            {props.companyName || 'Tu Empresa'}
          </Typography>

          {props.showAddress && props.address && (
            <Typography
              variant="body2"
              sx={{
                color: props.textColor || '#666',
                mb: 1,
                fontSize: props.fontSize ? `${props.fontSize}px` : '0.875rem',
              }}
            >
              {props.address}
            </Typography>
          )}

          {props.contactEmail && (
            <Typography
              variant="body2"
              sx={{
                color: props.textColor || '#666',
                mb: 2,
                fontSize: props.fontSize ? `${props.fontSize}px` : '0.875rem',
              }}
            >
              Contacto: {props.contactEmail}
            </Typography>
          )}

          {props.showSocial && enabledSocialLinks.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  color: props.textColor || '#666',
                  fontSize: props.fontSize ? `${props.fontSize - 2}px` : '0.75rem',
                }}
              >
                {enabledSocialLinks
                  .map(
                    (link: any) => link.platform.charAt(0).toUpperCase() + link.platform.slice(1)
                  )
                  .join(' • ')}
              </Typography>
            </Box>
          )}

          <Typography
            variant="caption"
            sx={{
              color: props.textColor || '#999',
              fontSize: props.fontSize ? `${props.fontSize - 2}px` : '0.75rem',
            }}
          >
            © {new Date().getFullYear()} {props.companyName || 'Tu Empresa'}. Todos los derechos
            reservados.
          </Typography>

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

export default NewsletterFooterReusableComponent;
