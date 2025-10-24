import { Icon } from '@iconify/react';
import React, { memo, useCallback } from 'react';

import { Box, IconButton } from '@mui/material';

import type { ComponentWithToolbarProps } from './types';

// Toolbar con flechas arriba/abajo y botón eliminar
const ComponentToolbar = memo(
  ({
    componentId,
    index,
    totalComponents,
    moveComponent,
    removeComponent,
  }: {
    componentId: string;
    index: number;
    totalComponents: number;
    moveComponent: (id: string, direction: 'up' | 'down') => void;
    removeComponent: (id: string) => void;
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
          zIndex: 10,
        }}
      >
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
            moveComponent={moveComponent}
            removeComponent={removeComponent}
          />
        )}
        {children}
      </Box>
    );
  }
);

ComponentWithToolbar.displayName = 'ComponentWithToolbar';

export default ComponentWithToolbar;
