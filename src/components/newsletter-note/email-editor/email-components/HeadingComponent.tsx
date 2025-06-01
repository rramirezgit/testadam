import { Box } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditorWithFlags from '../../simple-tiptap-editor-with-flags';

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
      {/* ✅ Box contenedor con CSS reset para permitir que TipTap controle los estilos */}
      <Box
        sx={{
          // CSS Reset que permite que TipTap controle completamente los estilos
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: 0,
            padding: 0,
            fontWeight: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            color: 'inherit',
            textAlign: 'inherit',
          },
          // ✅ Estilos base para que se vea como título por defecto
          fontSize:
            component.props?.level === 1
              ? '2.125rem'
              : component.props?.level === 2
                ? '1.875rem'
                : component.props?.level === 3
                  ? '1.5rem'
                  : '1.25rem',
          fontWeight: 'bold',
          lineHeight: 1.2,
          marginBottom: '0.5rem',
          ...(component.style || {}),
        }}
      >
        {/* @ts-expect-error - HeadingTag es una string pero usada como JSX element */}
        <HeadingTag>
          <SimpleTipTapEditorWithFlags
            content={component.content}
            onChange={handleContentChange}
            onSelectionUpdate={handleSelectionUpdate}
            style={{
              outline: 'none',
              width: '100%',
              minHeight: '1.5em',
            }}
            showToolbar={false}
            showDebugInfo={process.env.NODE_ENV === 'development'}
          />
        </HeadingTag>
      </Box>
    </ComponentWithToolbar>
  );
};

export default HeadingComponent;
