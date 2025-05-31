import { Button } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';

import type { EmailComponentProps } from './types';

const ButtonComponent = ({
  component,
  index,
  isSelected,
  onSelect,
  updateComponentContent,
  handleSelectionUpdate,
  moveComponent,
  removeComponent,
  totalComponents,
}: EmailComponentProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleContentChange = (newContent: string) => {
    updateComponentContent(component.id, newContent);
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
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mb: 2,
          textTransform: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          ...(component.style || {}),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <SimpleTipTapEditor
          content={component.content}
          onChange={handleContentChange}
          onSelectionUpdate={handleSelectionUpdate}
          style={{ color: 'white', width: '100%', outline: 'none' }}
        />
      </Button>
    </ComponentWithToolbar>
  );
};

export default ButtonComponent;
