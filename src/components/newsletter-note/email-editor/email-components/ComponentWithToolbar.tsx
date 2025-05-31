import { Icon } from '@iconify/react';

import { Box, Divider, IconButton } from '@mui/material';

import type { ComponentWithToolbarProps } from './types';

const ComponentWithToolbar = ({
  isSelected,
  index,
  totalComponents,
  componentId,
  moveComponent,
  removeComponent,
  children,
  onClick,
}: ComponentWithToolbarProps) => {
  // Component toolbar that appears when selected
  const ComponentToolbar = () => (
    <Box
      sx={{
        position: 'absolute',
        top: '-36px',
        right: '0',
        display: 'flex',
        gap: '4px',
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 10,
      }}
    >
      <IconButton
        size="small"
        onClick={() => moveComponent(componentId, 'up')}
        disabled={index === 0}
        sx={{
          width: '28px',
          height: '28px',
          color: index === 0 ? 'rgba(0,0,0,0.26)' : 'rgba(0,0,0,0.54)',
        }}
      >
        <Icon icon="mdi:arrow-up" width={16} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => moveComponent(componentId, 'down')}
        disabled={index === totalComponents - 1}
        sx={{
          width: '28px',
          height: '28px',
          color: index === totalComponents - 1 ? 'rgba(0,0,0,0.26)' : 'rgba(0,0,0,0.54)',
        }}
      >
        <Icon icon="mdi:arrow-down" width={16} />
      </IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
      <IconButton
        size="small"
        color="error"
        onClick={() => removeComponent(componentId)}
        sx={{ width: '28px', height: '28px' }}
      >
        <Icon icon="mdi:delete" width={16} />
      </IconButton>
    </Box>
  );

  return (
    <Box
      sx={{
        position: 'relative',
        border: isSelected ? '2px solid #3f51b5' : 'none',
        borderRadius: '4px',
      }}
      onClick={onClick}
    >
      {isSelected && <ComponentToolbar />}
      {children}
    </Box>
  );
};

export default ComponentWithToolbar;
