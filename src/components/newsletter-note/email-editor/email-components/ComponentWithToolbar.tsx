import { Icon } from '@iconify/react';
import React, { memo, useCallback } from 'react';

import { Box, IconButton } from '@mui/material';

import type { ComponentWithToolbarProps } from './types';

// Toolbar con flechas arriba/abajo, botón eliminar y botón de IA
const ComponentToolbar = memo(
  ({
    componentId,
    index,
    totalComponents,
    componentType,
    moveComponent,
    removeComponent,
    onAIClick,
  }: {
    componentId: string;
    index: number;
    totalComponents: number;
    componentType?: string;
    moveComponent: (id: string, direction: 'up' | 'down') => void;
    removeComponent: (id: string) => void;
    onAIClick?: () => void;
  }) => {
    const handleMoveUp = useCallback(() => {
      moveComponent(componentId, 'up');
    }, [componentId, moveComponent]);

    const handleMoveDown = useCallback(() => {
      moveComponent(componentId, 'down');
    }, [componentId, moveComponent]);

    const handleRemove = useCallback(() => {
      removeComponent(componentId);
    }, [componentId, removeComponent]);

    const handleAIClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onAIClick) {
          onAIClick();
        }
      },
      [onAIClick]
    );

    // Mostrar botón de IA solo para párrafos, headings y títulos con icono
    const showAIButton =
      componentType && ['paragraph', 'heading', 'tituloConIcono'].includes(componentType);

    return (
      <Box
        sx={{
          position: 'absolute',
          top: '-36px',
          right: '0',
          display: 'flex',
          gap: '4px',
          background: 'white',
          // border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 100,
        }}
      >
        {/* Botón de IA - solo para párrafos, headings y títulos */}
        {showAIButton && onAIClick && (
          <IconButton
            size="small"
            onClick={handleAIClick}
            sx={{
              width: '28px',
              height: '28px',
              color: '#667eea',
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.08)',
              },
            }}
            title="Asistente de IA"
          >
            <Icon icon="mdi:magic-staff" width={18} />
          </IconButton>
        )}

        <IconButton
          size="small"
          onClick={handleMoveUp}
          disabled={index === 0}
          sx={{ width: '28px', height: '28px' }}
        >
          <Icon icon="mdi:chevron-up" width={16} />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleMoveDown}
          disabled={index === totalComponents - 1}
          sx={{ width: '28px', height: '28px' }}
        >
          <Icon icon="mdi:chevron-down" width={16} />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={handleRemove}
          sx={{ width: '28px', height: '28px' }}
        >
          <Icon icon="mdi:delete" width={16} />
        </IconButton>
      </Box>
    );
  }
);

ComponentToolbar.displayName = 'ComponentToolbar';

const ComponentWithToolbar = memo(
  ({
    isSelected,
    index,
    totalComponents,
    componentId,
    componentType,
    moveComponent,
    removeComponent,
    children,
    onClick,
    isViewOnly = false,
    onAIClick,
  }: ComponentWithToolbarProps) => {
    const showToolbar = isSelected && !isViewOnly;
    // noteContainer tiene su propio borde, no agregar borde adicional
    const isNoteContainer = componentType === 'noteContainer';

    const handleClick = (e: React.MouseEvent) => {
      if (isViewOnly) return;
      e.stopPropagation();
      onClick(e);
    };

    return (
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          // No agregar borde para noteContainer ya que tiene su propio estilo
          border:
            !isNoteContainer && isSelected && !isViewOnly
              ? '2px dashed #1976d2'
              : '2px dashed transparent',
          borderRadius: '8px',
          transition: 'border-color 0.2s ease',
          cursor: isViewOnly ? 'default' : 'pointer',
          '&:hover': {
            borderColor:
              isViewOnly || isNoteContainer ? 'transparent' : isSelected ? '#1976d2' : '#e0e0e0',
          },
        }}
        onClick={handleClick}
      >
        {showToolbar && (
          <ComponentToolbar
            componentId={componentId}
            index={index}
            totalComponents={totalComponents}
            componentType={componentType}
            moveComponent={moveComponent}
            removeComponent={removeComponent}
            onAIClick={onAIClick}
          />
        )}
        {children}
      </Box>
    );
  }
);

ComponentWithToolbar.displayName = 'ComponentWithToolbar';

export default ComponentWithToolbar;
