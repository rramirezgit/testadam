import type React from 'react';

import { Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditorWithFlags from '../../simple-tiptap-editor-with-flags';

import type { EmailComponentProps } from './types';

const ParagraphComponent = ({
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
      <Typography
        variant="body1"
        component="p"
        style={{
          ...(component.props?.isCode && {
            backgroundColor: '#f5f5f5',
            padding: '12px',
            fontFamily: 'monospace',
            textAlign: 'center',
            borderRadius: '8px',
          }),
          ...(component.style || {}),
        }}
      >
        <SimpleTipTapEditorWithFlags
          content={component.content}
          onChange={handleContentChange}
          onSelectionUpdate={handleSelectionUpdate}
          style={{ outline: 'none' }}
          showToolbar={false}
        />
      </Typography>
    </ComponentWithToolbar>
  );
};

export default ParagraphComponent;
