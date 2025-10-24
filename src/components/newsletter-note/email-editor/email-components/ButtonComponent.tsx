import type React from 'react';

import { memo, useRef, useMemo, useCallback } from 'react';

import { Button } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';

import type { EmailComponentProps } from './types';

// ⚡ ULTRA-OPTIMIZACIÓN: Cache de estilos computados para buttons
const buttonStyleCache = new Map<string, React.CSSProperties>();

// ⚡ ULTRA-OPTIMIZACIÓN: Función helper para crear cache key
const createButtonStyleKey = (component: any, isSelected: boolean): string => {
  const { style = {}, props = {} } = component;
  return `${JSON.stringify(style)}-${JSON.stringify(props)}-${isSelected}`;
};

// ⚡ ULTRA-OPTIMIZACIÓN: Función para generar estilos optimizada para buttons
const generateOptimizedButtonStyles = (component: any, isSelected: boolean) => {
  const cacheKey = createButtonStyleKey(component, isSelected);

  if (buttonStyleCache.has(cacheKey)) {
    return buttonStyleCache.get(cacheKey)!;
  }

  const style: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    cursor: 'pointer',
    // ⚡ ULTRA-OPTIMIZACIÓN: GPU acceleration y optimizaciones de rendering
    willChange: isSelected ? 'transform, box-shadow' : 'auto',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    // ⚡ ULTRA-OPTIMIZACIÓN: Containment para mejor rendimiento
    contain: 'layout style',
    // ⚡ ULTRA-OPTIMIZACIÓN: Optimización específica para buttons
    textRendering: 'optimizeSpeed' as any,
    fontKerning: 'none',
    mb: 2,
    textTransform: 'none',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    // Aplicar estilos del componente
    ...(component.style || {}),
  };

  // Cache el estilo para reutilización
  buttonStyleCache.set(cacheKey, style);

  // Limpiar cache si crece demasiado
  if (buttonStyleCache.size > 100) {
    const firstKey = buttonStyleCache.keys().next().value;
    buttonStyleCache.delete(firstKey);
  }

  return style;
};

// ⚡ ULTRA-OPTIMIZACIÓN: Componente interno memoizado para buttons
const MemoizedButtonEditor = memo(
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
      showAIButton={false}
    />
  ),
  (prevProps, nextProps) =>
    // ⚡ ULTRA-OPTIMIZACIÓN: Comparación profunda optimizada
    prevProps.content === nextProps.content &&
    prevProps.onContentChange === nextProps.onContentChange &&
    prevProps.onSelectionUpdate === nextProps.onSelectionUpdate &&
    JSON.stringify(prevProps.editorStyle) === JSON.stringify(nextProps.editorStyle)
);

MemoizedButtonEditor.displayName = 'MemoizedButtonEditor';

// ⚡ ULTRA-OPTIMIZACIÓN: Componente principal con memo avanzado
const ButtonComponent = memo(
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

    // ⚡ ULTRA-OPTIMIZAÇÃO: Memoización de estilos con cache
    const containerStyles = useMemo(
      () => generateOptimizedButtonStyles(component, isSelected),
      [component.style, component.props, isSelected]
    );

    // ⚡ ULTRA-OPTIMITZACIÓ: Memoización de estilos del editor
    const editorStyle = useMemo(
      () => ({
        color: 'white',
        width: '100%',
        outline: 'none',
        // ⚡ ULTRA-OPTIMIZACIÓN: Optimizaciones específicas del texto para buttons
        fontDisplay: 'swap' as const,
        textSizeAdjust: 'none',
        WebkitFontSmoothing: 'antialiased' as const,
        MozOsxFontSmoothing: 'grayscale' as const,
        textAlign: 'center' as const,
      }),
      []
    );

    // ⚡ ULTRA-OPTIMITZACIÓ: Callback memoizado con throttling integrado
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
        console.log('🔵 ButtonComponent clicked:', component.id, { onSelect: !!onSelect });
        if (onSelect) {
          // Llamar inmediatamente en lugar de defer para debugging
          onSelect();
          console.log('🟢 ButtonComponent onSelect called for:', component.id);
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

    // ⚡ ULTRA-OPTIMIZAÇÃO: Manejo de clics del botón optimizado
    const handleButtonClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    // ⚡ ULTRA-OPTIMIZACIÓN: Log de rendimiento (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      const currentTime = performance.now();
      const renderTime = currentTime - lastRenderTime.current;
      if (renderTime > 16) {
        // Solo si toma más de 1 frame (16ms)
        console.log(`ButtonComponent ${component.id} render took ${renderTime.toFixed(2)}ms`);
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={containerStyles}
          onClick={handleButtonClick}
        >
          <MemoizedButtonEditor
            content={component.content}
            onContentChange={handleContentChange}
            onSelectionUpdate={handleSelectionUpdateMemo}
            editorStyle={editorStyle}
          />
        </Button>
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

ButtonComponent.displayName = 'ButtonComponent';

export default ButtonComponent;
