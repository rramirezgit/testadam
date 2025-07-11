'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Chip, Typography, IconButton } from '@mui/material';

import type { EmailComponentProps } from './types';

interface ComponentContainerComponentProps extends EmailComponentProps {
  removeNoteContainer?: (containerId: string) => void;
}

export default function ComponentContainerComponent({
  component,
  isSelected,
  onSelect,
  removeComponent,
  removeNoteContainer,
  totalComponents,
}: ComponentContainerComponentProps) {
  const isComponentContainer = component.props?.isComponentContainer;
  const noteTitle = component.props?.noteTitle || 'Nota Inyectada';
  const componentIndex = component.props?.componentIndex || 0;
  const totalComponentsInNote = component.props?.totalComponents || 1;
  const containedComponentId = component.props?.containedComponentId;

  if (!isComponentContainer) {
    return null;
  }

  const handleRemove = () => {
    if (removeNoteContainer) {
      removeNoteContainer(component.id);
    } else {
      removeComponent(component.id);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        // border: '2px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px 0',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        // '&:hover': {
        //   borderColor: '#1976d2',
        //   backgroundColor: '#f8f9fa',
        //   transform: 'translateY(-1px)',
        //   boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        // },
        // ...(isSelected && {
        //   borderColor: '#1976d2',
        //   borderWidth: '3px',
        //   boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
        // }),
      }}
      onClick={onSelect}
    >
      {/* Header del contenedor */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          pb: 1,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}
          >
            {componentIndex + 1}
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: '#333',
                fontSize: '0.9rem',
              }}
            >
              {noteTitle}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#666',
                fontSize: '0.7rem',
              }}
            >
              Componente {componentIndex + 1} de {totalComponentsInNote}
            </Typography>
          </Box>
        </Box>

        {/* Controles del contenedor */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label="Componente"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontSize: '0.6rem' }}
          />

          {isSelected && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              sx={{
                color: '#d32f2f',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                },
              }}
            >
              <Icon icon="mdi:delete" fontSize="14px" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Contenido del contenedor */}
      <Box
        sx={{
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.8rem',
          fontStyle: 'italic',
          backgroundColor: 'rgba(25, 118, 210, 0.05)',
          borderRadius: '6px',
          border: '1px dashed #1976d2',
          padding: '12px',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Icon icon="mdi:arrow-down" style={{ fontSize: 20, color: '#1976d2', marginBottom: 6 }} />
          <Typography
            variant="caption"
            sx={{ color: '#1976d2', fontWeight: 500, display: 'block' }}
          >
            El componente aparecerá aquí
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#666', display: 'block', mt: 0.5, fontSize: '0.65rem' }}
          >
            ID: {containedComponentId?.substring(0, 8)}...
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
