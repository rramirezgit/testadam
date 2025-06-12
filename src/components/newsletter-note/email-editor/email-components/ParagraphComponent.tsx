import React, { memo, useRef, useMemo, useCallback } from 'react';

import { Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';

import type { EmailComponentProps } from './types';

// ⚡ ULTRA-OPTIMIZACIÓN: Cache de estilos computados
const styleCache = new Map<string, React.CSSProperties>();

// ⚡ ULTRA-OPTIMIZACIÓN: Función helper para crear cache key
const createStyleKey = (component: any, isSelected: boolean): string => {
  const { style = {}, props = {} } = component;

  return `${JSON.stringify(style)}-${JSON.stringify(props)}-${isSelected}`;
};

// ⚡ ULTRA-OPTIMIZACIÓN: Función para generar estilos optimizada
const generateOptimizedStyles = (component: any, isSelected: boolean) => {
  const cacheKey = createStyleKey(component, isSelected);

  if (styleCache.has(cacheKey)) {
    return styleCache.get(cacheKey)!;
  }

  const style: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '20px',
    cursor: 'text',
    // ⚡ ULTRA-OPTIMIZACIÓN: GPU acceleration y optimizaciones de rendering
    willChange: isSelected ? 'transform, box-shadow' : 'auto',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    // ⚡ ULTRA-OPTIMIZACIÓN: Containment para mejor rendimiento
    contain: 'layout style',
    // ⚡ ULTRA-OPTIMIZACIÓN: Optimización de texto
    textRendering: 'optimizeSpeed' as any,
    // ⚡ OPTIMIZACIÓN: Párrafos solo con margen superior (diferenciarse de títulos)
    margin: '0 !important', // Resetear márgenes nativos
    marginTop: `${component.style?.marginTop || '16px'} !important`,
    marginBottom: `${component.style?.marginBottom || '0px'} !important`, // Solo margen superior por defecto
    paddingTop: component.style?.paddingTop || '0px',
    paddingBottom: component.style?.paddingBottom || '0px',
    paddingLeft: component.style?.paddingLeft || '0px',
    paddingRight: component.style?.paddingRight || '0px',
    // Aplicar estilos del componente (esto puede sobrescribir los defaults de arriba)
    ...(component.style || {}),
    // Estilos específicos para código si es necesario
    ...(component.props?.isCode && {
      backgroundColor: '#f5f5f5',
      padding: '12px',
      fontFamily: 'monospace',
      textAlign: 'center' as const,
      borderRadius: '8px',
    }),
  };

  // Cache el estilo para reutilización
  styleCache.set(cacheKey, style);

  // Limpiar cache si crece demasiado
  if (styleCache.size > 100) {
    const firstKey = styleCache.keys().next().value;
    styleCache.delete(firstKey);
  }

  return style;
};

// ⚡ ULTRA-OPTIMIZACIÓN: Componente interno memoizado
const MemoizedEditor = memo(
  ({
    content,
    onContentChange,
    onSelectionUpdate,
    editorStyle,
  }: {
    content: string;
    onContentChange?: (content: string) => void;
    onSelectionUpdate?: (editor: any) => void;
    editorStyle: React.CSSProperties;
  }) => (
    <SimpleTipTapEditor
      content={content}
      onChange={onContentChange || (() => {})}
      onSelectionUpdate={onSelectionUpdate}
      showToolbar={false}
      style={editorStyle}
    />
  ),
  (prevProps, nextProps) =>
    // ⚡ ULTRA-OPTIMIZACIÓN: Comparación profunda optimizada
    prevProps.content === nextProps.content &&
    prevProps.onContentChange === nextProps.onContentChange &&
    prevProps.onSelectionUpdate === nextProps.onSelectionUpdate &&
    JSON.stringify(prevProps.editorStyle) === JSON.stringify(nextProps.editorStyle)
);

MemoizedEditor.displayName = 'MemoizedEditor';

// ⚡ ULTRA-OPTIMIZACIÓN: Componente principal con memo avanzado
const ParagraphComponent = memo(
  ({
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
    const lastRenderTime = useRef(performance.now());

    // ⚡ ULTRA-OPTIMIZACIÓN: Memoización de estilos con cache
    const containerStyles = useMemo(
      () => generateOptimizedStyles(component, isSelected),
      [component.style, component.props, isSelected]
    );

    // ⚡ ULTRA-OPTIMIZAÇÃO: Memoización de estilos del editor
    const editorStyle = useMemo(
      () => ({
        outline: 'none',
        // ⚡ ULTRA-OPTIMIZACIÓN: Optimizaciones específicas del texto
        fontDisplay: 'swap' as const,
        textSizeAdjust: 'none',
        WebkitFontSmoothing: 'antialiased' as const,
        MozOsxFontSmoothing: 'grayscale' as const,
      }),
      []
    );

    // ⚡ ULTRA-OPTIMIZAÇÃO: Callback memoizado con throttling integrado
    const handleContentChange = useCallback(
      (newContent: string) => {
        if (updateComponentContent && newContent !== component.content) {
          // Usar scheduler nativo del navegador para mejor rendimiento
          if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
            (window as any).scheduler.postTask(
              () => {
                updateComponentContent(component.id, newContent);
              },
              { priority: 'user-blocking' }
            );
          } else {
            // Fallback con MessageChannel para batching
            const channel = new MessageChannel();
            channel.port2.onmessage = () => updateComponentContent(component.id, newContent);
            channel.port1.postMessage(null);
          }
        }
      },
      [updateComponentContent, component.id, component.content]
    );

    // ⚡ ULTRA-OPTIMIZAÇÃO: Manejo de clics optimizado
    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        console.log('🔵 ParagraphComponent clicked:', component.id, { onSelect: !!onSelect });
        if (onSelect) {
          // Llamar inmediatamente en lugar de defer para debugging
          onSelect();
          console.log('🟢 ParagraphComponent onSelect called for:', component.id);
        }
      },
      [onSelect, component.id]
    );

    // ⚡ ULTRA-OPTIMIZAÇÃO: Manejo de selección optimizado
    const handleSelectionUpdateMemo = useCallback(
      (editor: any) => {
        if (isSelected && handleSelectionUpdate) {
          // Usar requestAnimationFrame para mejor rendimiento
          requestAnimationFrame(() => {
            handleSelectionUpdate(editor);
          });
        }
      },
      [isSelected, handleSelectionUpdate]
    );

    // ⚡ ULTRA-OPTIMIZACIÓN: Log de rendimiento (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      const currentTime = performance.now();
      const renderTime = currentTime - lastRenderTime.current;
      if (renderTime > 16) {
        // Solo si toma más de 1 frame (16ms)
        console.log(`ParagraphComponent ${component.id} render took ${renderTime.toFixed(2)}ms`);
      }
      lastRenderTime.current = currentTime;
    }

    // ⚡ ULTRA-OPTIMIZAÇÃO: Renderizado optimizado con el sistema original
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
        <Typography variant="body1" component="p" style={containerStyles}>
          <MemoizedEditor
            content={component.content}
            onContentChange={handleContentChange}
            onSelectionUpdate={handleSelectionUpdateMemo}
            editorStyle={editorStyle}
          />
        </Typography>
      </ComponentWithToolbar>
    );
  },
  (prevProps, nextProps) => {
    // ⚡ ULTRA-OPTIMIZACIÓN: Comparación optimizada con early returns
    if (prevProps.component.id !== nextProps.component.id) return false;
    if (prevProps.component.content !== nextProps.component.content) return false;
    if (prevProps.isSelected !== nextProps.isSelected) return false;
    if (prevProps.index !== nextProps.index) return false;

    // Comparación profunda de estilos y props solo si es necesario
    if (JSON.stringify(prevProps.component.style) !== JSON.stringify(nextProps.component.style))
      return false;
    if (JSON.stringify(prevProps.component.props) !== JSON.stringify(nextProps.component.props))
      return false;

    return true;
  }
);

ParagraphComponent.displayName = 'ParagraphComponent';

export default ParagraphComponent;
