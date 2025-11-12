import type { EmailComponent } from 'src/types/saved-note';

import React, { useMemo, useCallback } from 'react';

import { Box } from '@mui/material';

import SimpleTipTapEditor from '../simple-tiptap-editor';
import {
  buildListHtml,
  isOrderedListStyle,
  normaliseListStyle,
  extractListItemsFromHtml,
  DEFAULT_PLACEHOLDER_COLOR,
  shouldUsePlaceholderColor,
} from './email-components/utils';

interface EmailListProps {
  component: EmailComponent;
  updateComponentContent: (id: string, content: string) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
}

export const EmailList: React.FC<EmailListProps> = ({
  component,
  updateComponentContent,
  updateComponentProps,
}) => {
  const listStyle = normaliseListStyle(component.props?.listStyle);

  const parsedItems = useMemo(
    () => extractListItemsFromHtml(component.content || ''),
    [component.content]
  );
  const items = useMemo(() => {
    if (parsedItems.length) {
      return parsedItems;
    }
    if (component.props?.items && component.props.items.length) {
      return component.props.items as string[];
    }
    return ['Elemento de lista'];
  }, [parsedItems, component.props?.items]);

  const editorContent = useMemo(() => {
    if (component.content && component.content.trim().length > 0) {
      return component.content;
    }
    return buildListHtml(items, listStyle);
  }, [component.content, items, listStyle]);

  const explicitListColor = component.props?.listColor;
  const explicitTextColor = component.props?.textColor;
  const placeholderActive =
    component.meta?.isDefaultContent &&
    !!component.meta?.defaultContentSnapshot &&
    component.meta.defaultContentSnapshot.trim() === editorContent.trim();

  const usePlaceholderColor = shouldUsePlaceholderColor(
    component,
    (component.style?.color as string | undefined) || explicitTextColor || explicitListColor
  );

  const displayTextColor =
    explicitTextColor ||
    (placeholderActive || usePlaceholderColor ? DEFAULT_PLACEHOLDER_COLOR : '#000000');
  const displayListColor =
    explicitListColor ||
    (placeholderActive || usePlaceholderColor ? DEFAULT_PLACEHOLDER_COLOR : displayTextColor);

  const listSx = useMemo(
    () => ({
      // Aplicar estilos de espaciado del componente
      marginTop: component.style?.marginTop,
      marginBottom: component.style?.marginBottom,
      paddingTop: component.style?.paddingTop,
      paddingBottom: component.style?.paddingBottom,
      // Aplicar estilos de texto
      textAlign: component.style?.textAlign,
      fontSize: component.style?.fontSize,
      fontFamily: component.style?.fontFamily,
      fontWeight: component.style?.fontWeight,
      '& .ProseMirror ul, & .ProseMirror ol': {
        margin: 0,
        paddingLeft: '1.5rem',
        listStyleType: listStyle,
      },
      '& .ProseMirror li': {
        color: displayTextColor,
      },
      '& .ProseMirror li::marker': {
        color: displayListColor,
      },
    }),
    [displayListColor, displayTextColor, listStyle, component.style]
  );

  const handleContentChange = useCallback(
    (newHtml: string) => {
      const derivedListStyle =
        typeof window !== 'undefined' && newHtml.includes('<ol')
          ? isOrderedListStyle(listStyle)
            ? listStyle
            : 'decimal'
          : !isOrderedListStyle(listStyle)
            ? listStyle
            : 'disc';

      const newItems = typeof window !== 'undefined' ? extractListItemsFromHtml(newHtml) : items;

      updateComponentContent(component.id, newHtml);
      updateComponentProps(component.id, {
        ...(component.props ?? {}),
        items: newItems.length ? newItems : items,
        listStyle: derivedListStyle,
      });
    },
    [component.id, component.props, items, listStyle, updateComponentContent, updateComponentProps]
  );

  return (
    <Box>
      <Box
        sx={{
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          padding: 1,
          transition: 'border-color 0.2s ease',
          '&:hover': {
            borderColor: 'primary.light',
          },
          ...listSx,
        }}
      >
        <SimpleTipTapEditor
          content={editorContent}
          onChange={handleContentChange}
          showToolbar
          isPlaceholder={placeholderActive}
          placeholderColor={DEFAULT_PLACEHOLDER_COLOR}
          style={{
            color: displayTextColor,
            fontSize: component.style?.fontSize,
            fontFamily: component.style?.fontFamily,
            fontWeight: component.style?.fontWeight,
            textAlign: component.style?.textAlign,
          }}
        />
      </Box>
    </Box>
  );
};

export default EmailList;
