import { Box, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

const SpacerComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
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
          height: '32px',
          mb: 2,
          ...(component.style || {}),
          border: isSelected ? '1px dashed rgba(0,0,0,0.1)' : 'none',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isSelected && (
          <Typography variant="caption" color="text.secondary">
            Espacio
          </Typography>
        )}
      </Box>
    </ComponentWithToolbar>
  );
};

export default SpacerComponent;
