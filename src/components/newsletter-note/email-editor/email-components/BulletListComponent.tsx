import React, { memo, useMemo, useCallback } from 'react';

import { Box } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import {
  buildListHtml,
  normaliseListStyle,
  DEFAULT_PLACEHOLDER_COLOR,
  shouldUsePlaceholderColor,
} from './utils';

import type { EmailComponentProps } from './types';

const BulletListComponent = memo(
  ({
    component,
    index,
    isSelected,
    onSelect,
    moveComponent,
    removeComponent,
    totalComponents,
    renderCustomContent,
  }: EmailComponentProps) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect();
      },
      [onSelect]
    );

    // Memoizar las propiedades de la lista
    const listProps = useMemo(() => {
      const items = component.props?.items || ['Elemento de lista'];
      const listStyle = normaliseListStyle(component.props?.listStyle);
      const explicitListColor = component.props?.listColor;
      const explicitTextColor = component.props?.textColor;

      const defaultHtml = buildListHtml(items, listStyle);
      const html =
        component.content && component.content.trim().length > 0 ? component.content : defaultHtml;

      const placeholderActive =
        component.meta?.isDefaultContent &&
        !!component.meta?.defaultContentSnapshot &&
        component.meta.defaultContentSnapshot.trim() === html.trim();

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

      return { html, listStyle, displayListColor, displayTextColor };
    }, [component]);

    const { html, listStyle, displayListColor, displayTextColor } = listProps;

    const listStyles = useMemo(
      () => ({
        '& ul, & ol': {
          margin: 0,
          paddingLeft: '1.5rem',
          listStyleType: listStyle,
        },
        '& li': {
          color: displayTextColor,
        },
        '& li::marker': {
          color: displayListColor,
        },
      }),
      [listStyle, displayListColor, displayTextColor]
    );

    if (renderCustomContent) {
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
          {renderCustomContent(component)}
        </ComponentWithToolbar>
      );
    }

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
        <Box sx={{ pl: 2, ...listStyles }} dangerouslySetInnerHTML={{ __html: html }} />
      </ComponentWithToolbar>
    );
  }
);

BulletListComponent.displayName = 'BulletListComponent';

export default BulletListComponent;
