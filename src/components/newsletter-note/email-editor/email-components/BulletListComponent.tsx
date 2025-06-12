import React, { memo, useMemo, useCallback } from 'react';

import { Box } from '@mui/material';

import { getOrderedListMarker } from './utils';
import ComponentWithToolbar from './ComponentWithToolbar';

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
      const items = component.props?.items || ['Item 1', 'Item 2', 'Item 3'];
      const listStyle = component.props?.listStyle || 'disc';
      const listColor = component.props?.listColor || '#000000';

      // Determinar si es una lista ordenada
      const isOrderedList =
        listStyle === 'decimal' ||
        listStyle === 'lower-alpha' ||
        listStyle === 'upper-alpha' ||
        listStyle === 'lower-roman' ||
        listStyle === 'upper-roman';

      return { items, listStyle, listColor, isOrderedList };
    }, [component.props?.items, component.props?.listStyle, component.props?.listColor]);

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

    const { items, listStyle, listColor, isOrderedList } = listProps;

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
        <Box sx={{ pl: 2 }}>
          {items.map((item, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: 1,
              }}
            >
              {isOrderedList ? (
                // Marcador para listas ordenadas - Estilo unificado con círculo y número
                <Box
                  sx={{
                    minWidth: '24px',
                    mr: 2,
                    backgroundColor: listColor,
                    borderRadius: '50%',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    height: '24px',
                    width: '24px',
                    lineHeight: '24px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getOrderedListMarker(i + 1, listStyle)}
                </Box>
              ) : (
                // Marcador para listas no ordenadas - Estilo unificado
                <Box
                  sx={{
                    minWidth: '24px',
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {listStyle === 'disc' && (
                    <Box
                      sx={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: listColor,
                      }}
                    />
                  )}
                  {listStyle === 'circle' && (
                    <Box
                      sx={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        border: `1px solid ${listColor}`,
                        backgroundColor: 'transparent',
                      }}
                    />
                  )}
                  {listStyle === 'square' && (
                    <Box
                      sx={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: listColor,
                      }}
                    />
                  )}
                </Box>
              )}
              <Box sx={{ flexGrow: 1 }}>{item}</Box>
            </Box>
          ))}
        </Box>
      </ComponentWithToolbar>
    );
  }
);

BulletListComponent.displayName = 'BulletListComponent';

export default BulletListComponent;
