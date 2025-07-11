import React, { memo, useRef, useMemo, useCallback } from 'react';

import { Box } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';

import type { EmailComponentProps } from './types';

// ⚡ ULTRA-OPTIMIZACIÓN: Cache de estilos computados para headings
const headingStyleCache = new Map<string, React.CSSProperties>();

// ⚡ ULTRA-OPTIMIZACIÓN: Función helper para crear cache key
const createHeadingStyleKey = (component: any, isSelected: boolean): string => {
  const { style = {}, props = {} } = component;

  return `${JSON.stringify(style)}-${JSON.stringify(props)}-${isSelected}`;
};

// ⚡ ULTRA-OPTIMIZACIÓN: Función para generar estilos optimizada para headings
const generateOptimizedHeadingStyles = (component: any, isSelected: boolean) => {
  const cacheKey = createHeadingStyleKey(component, isSelected);

  if (headingStyleCache.has(cacheKey)) {
    return headingStyleCache.get(cacheKey)!;
  }

  const level = component.props?.level || 2;

  const style: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '24px',
    cursor: 'text',
    // ⚡ ULTRA-OPTIMIZACIÓN: GPU acceleration y optimizaciones de rendering
    willChange: isSelected ? 'transform, box-shadow' : 'auto',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    // ⚡ ULTRA-OPTIMIZACIÓN: Containment para mejor rendimiento
    contain: 'layout style',
    // ⚡ ULTRA-OPTIMIZACIÓN: Optimización específica para títulos
    textRendering: 'optimizeSpeed' as any,
    fontKerning: 'none',
    // Aplicar estilos del componente
    ...(component.style || {}),
  };

  // Cache el estilo para reutilización
  headingStyleCache.set(cacheKey, style);

  // Limpiar cache si crece demasiado
  if (headingStyleCache.size > 100) {
    const firstKey = headingStyleCache.keys().next().value;
    headingStyleCache.delete(firstKey);
  }

  return style;
};

// ⚡ ULTRA-OPTIMIZACIÓN: Componente interno memoizado para headings
const MemoizedHeadingEditor = memo(
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

MemoizedHeadingEditor.displayName = 'MemoizedHeadingEditor';

// ⚡ ULTRA-OPTIMIZACIÓN: Componente principal con memo avanzado
const HeadingComponent = memo(
  ({
    component,
    index,
    isSelected,
    onSelect,
    onComponentSelect,
    updateComponentContent,
    handleSelectionUpdate,
    moveComponent,
    removeComponent,
    totalComponents,
  }: EmailComponentProps) => {
    const lastRenderTime = useRef(performance.now());

    // ⚡ NUEVO: Ya no necesitamos determinar tag HTML, usamos <p> siempre
    // Mantenemos la referencia al nivel para los estilos de fuente

    // ⚡ ULTRA-OPTIMIZAÇÃO: Memoización de estilos con cache
    const containerStyles = useMemo(
      () => generateOptimizedHeadingStyles(component, isSelected),
      [component.style, component.props, isSelected]
    );

    // ⚡ ULTRA-OPTIMIZAÇÃO: Memoización de estilos del editor
    const editorStyle = useMemo(
      () => ({
        outline: 'none',
        // ⚡ ULTRA-OPTIMIZACIÓN: Optimizaciones específicas del texto para títulos
        fontDisplay: 'swap' as const,
        textSizeAdjust: 'none',
        WebkitFontSmoothing: 'antialiased' as const,
        MozOsxFontSmoothing: 'grayscale' as const,
        // ⚡ ULTRA-OPTIMIZAÇÃO: Optimización para títulos grandes
        textTransform: 'none' as const,
      }),
      []
    );

    // ⚡ ULTRA-OPTIMIZAÇÃO: Memoización de estilos del párrafo-título
    const boxStyles = useMemo(
      () => ({
        // ⚡ NUEVO: Tamaño fijo para todos los títulos como <p>
        fontSize: '1.5rem', // Tamaño fijo de título
        fontWeight: component.style?.fontWeight || 'bold',
        // ⚡ OPTIMIZACIÓN: Espaciado ultra-compacto por defecto (sin márgenes nativos!)
        margin: '0', // Sin márgenes nativos porque es un <p>
        marginTop: component.style?.marginTop || '0px',
        marginBottom: component.style?.marginBottom || '0px',
        paddingTop: component.style?.paddingTop || '0px',
        paddingBottom: component.style?.paddingBottom || '0px',
        paddingLeft: component.style?.paddingLeft || '0px',
        paddingRight: component.style?.paddingRight || '0px',
        lineHeight: component.style?.lineHeight || 1.2,
        color: component.style?.color || 'text.primary',
        textAlign: component.style?.textAlign || 'left',
        display: 'block',
        ...containerStyles,
      }),
      [containerStyles, component.style] // Ya no dependemos del nivel
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

        // Usar onComponentSelect si está disponible (para componentes dentro de notas)
        if (onComponentSelect) {
          onComponentSelect(component.id);
        } else if (onSelect) {
          // Usar onSelect para componentes normales
          onSelect();
        }
      },
      [onSelect, onComponentSelect, component.id]
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

    // ⚡ ULTRA-OPTIMIZAÇÃO: Log de rendimiento (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      const currentTime = performance.now();
      const renderTime = currentTime - lastRenderTime.current;
      if (renderTime > 16) {
        // Solo si toma más de 1 frame (16ms)
        console.log(
          `HeadingComponent ${component.id} (H${component.props?.level || 2}) render took ${renderTime.toFixed(2)}ms`
        );
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
        <Box component="div" sx={boxStyles}>
          <MemoizedHeadingEditor
            content={component.content}
            onContentChange={handleContentChange}
            onSelectionUpdate={handleSelectionUpdateMemo}
            editorStyle={editorStyle}
          />
        </Box>
      </ComponentWithToolbar>
    );
  },
  (prevProps, nextProps) => {
    // ⚡ ULTRA-OPTIMIZAÇÃO: Comparación optimizada con early returns
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

HeadingComponent.displayName = 'HeadingComponent';

export default HeadingComponent;
