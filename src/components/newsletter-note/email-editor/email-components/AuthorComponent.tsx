import { Icon } from '@iconify/react';

import { Box, TextField, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

const AuthorComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentProps,
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
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center', mb: 2, ...(component.style || {}) }}
      >
        <Icon icon="mdi:account" style={{ marginRight: 8 }} />
        {component.props?.author || component.content}
        {component.props?.date && ` • ${component.props.date}`}
      </Typography>
      {isSelected && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" display="block" gutterBottom>
            Autor
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={component.props?.author || ''}
            onChange={(e) => updateComponentProps(component.id, { author: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Fecha
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={component.props?.date || ''}
            onChange={(e) => updateComponentProps(component.id, { date: e.target.value })}
          />
        </Box>
      )}
    </ComponentWithToolbar>
  );
};

export default AuthorComponent;
