import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';

import type { EmailComponentProps } from './types';

const HeadingComponent = ({
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
  const HeadingTag = `h${component.props?.level || 2}`;

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
      {/* @ts-expect-error - HeadingTag es una string pero usada como JSX element */}
      <HeadingTag style={component.style || {}}>
        <SimpleTipTapEditor
          content={component.content}
          onChange={handleContentChange}
          onSelectionUpdate={handleSelectionUpdate}
          style={{ outline: 'none' }}
        />
      </HeadingTag>
    </ComponentWithToolbar>
  );
};

export default HeadingComponent;
