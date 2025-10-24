/* eslint-disable react-hooks/exhaustive-deps */
import type React from 'react';

import { memo, useRef, useMemo, useState, useCallback } from 'react';

import { Box, TextField, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';

import type { EmailComponentProps } from './types';

const SUMMARY_TYPES = {
  resumen: {
    label: 'Resumen',
    icon: 'https://img.icons8.com/color/48/note.png',
    backgroundColor: '#f8f9fa',
    textColor: '#495057',
  },
  concepto: {
    label: 'Concepto',
    icon: 'https://img.icons8.com/color/48/light-on.png',
    backgroundColor: '#e7f3ff',
    textColor: '#003d7a',
  },
  dato: {
    label: 'Dato',
    icon: 'https://img.icons8.com/color/48/info.png',
    backgroundColor: '#fff8e1',
    textColor: '#e65100',
  },
  tip: {
    label: 'TIP',
    icon: 'https://img.icons8.com/color/48/rocket.png',
    backgroundColor: '#f3e5f5',
    textColor: '#4a148c',
  },
  analogia: {
    label: 'Analogía',
    icon: 'https://img.icons8.com/color/48/brain.png',
    backgroundColor: '#e8f5e8',
    textColor: '#1b5e20',
  },
} as const;

type SummaryType = keyof typeof SUMMARY_TYPES;

const summaryStyleCache = new Map<string, React.CSSProperties>();

const createSummaryStyleKey = (component: any, isSelected: boolean, typeConfig: any): string => {
  const { style = {}, props = {} } = component;
  return `${JSON.stringify(style)}-${JSON.stringify(props)}-${isSelected}-${JSON.stringify(typeConfig)}`;
};

const generateOptimizedSummaryStyles = (component: any, isSelected: boolean, typeConfig: any) => {
  const cacheKey = createSummaryStyleKey(component, isSelected, typeConfig);

  if (summaryStyleCache.has(cacheKey)) {
    return summaryStyleCache.get(cacheKey)!;
  }

  const backgroundColor = component.props?.backgroundColor || typeConfig.backgroundColor;

  const style: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    cursor: 'text',
    willChange: isSelected ? 'transform, box-shadow' : 'auto',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    contain: 'layout style',
    textRendering: 'optimizeSpeed' as any,
    fontKerning: 'none',
    backgroundColor,
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.08)',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    // Aplicar estilos del componente
    ...(component.style || {}),
  };

  // Cache el estilo para reutilización
  summaryStyleCache.set(cacheKey, style);

  // Limpiar cache si crece demasiado
  if (summaryStyleCache.size > 100) {
    const firstKey = summaryStyleCache.keys().next().value;
    summaryStyleCache.delete(firstKey);
  }

  return style;
};

const MemoizedSummaryEditor = memo(
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
    prevProps.content === nextProps.content &&
    prevProps.onContentChange === nextProps.onContentChange &&
    prevProps.onSelectionUpdate === nextProps.onSelectionUpdate &&
    JSON.stringify(prevProps.editorStyle) === JSON.stringify(nextProps.editorStyle)
);

MemoizedSummaryEditor.displayName = 'MemoizedSummaryEditor';

const SummaryComponent = memo(
  ({
    component,
    index,
    isSelected,
    onSelect,
    onComponentSelect,
    updateComponentContent,
    updateComponentProps,
    handleSelectionUpdate,
    moveComponent,
    removeComponent,
    totalComponents,
  }: EmailComponentProps) => {
    const lastRenderTime = useRef(performance.now());
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [tempLabel, setTempLabel] = useState('');

    const summaryType: SummaryType = (component.props?.summaryType as SummaryType) || 'resumen';
    const typeConfig = SUMMARY_TYPES[summaryType];

    const textColor = component.props?.textColor || typeConfig.textColor;
    const icon = component.props?.icon || typeConfig.icon;
    const label = component.props?.label || typeConfig.label;

    // ⚡ ULTRA-OPTIMIZACIÓN: Memoización de estilos con cache
    const containerStyles = useMemo(
      () => generateOptimizedSummaryStyles(component, isSelected, typeConfig),
      [component.style, component.props, isSelected, typeConfig]
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

    // ⚡ ULTRA-OPTIMIZAÇÃO: Memoización de estilos del contenido
    const contentBoxStyles = useMemo(
      () => ({
        color: '#6c757d',
        fontSize: '15px',
        lineHeight: 1.6,
        '& p': {
          margin: 0,
          color: '#6c757d',
        },
        '& p:empty::before': {
          content: '"Escribe el contenido aquí..."',
          color: '#adb5bd',
          fontStyle: 'italic',
        },
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

    const handleLabelClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setTempLabel(label);
        setIsEditingLabel(true);
      },
      [label]
    );

    const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setTempLabel(e.target.value);
    }, []);

    const handleLabelSubmit = useCallback(() => {
      if (updateComponentProps && tempLabel.trim() !== label) {
        updateComponentProps(component.id, { label: tempLabel.trim() });
      }
      setIsEditingLabel(false);
    }, [updateComponentProps, component.id, tempLabel, label]);

    const handleLabelKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleLabelSubmit();
        } else if (e.key === 'Escape') {
          setIsEditingLabel(false);
          setTempLabel(label);
        }
      },
      [handleLabelSubmit, label]
    );

    const handleLabelBlur = useCallback(() => {
      handleLabelSubmit();
    }, [handleLabelSubmit]);

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        console.log('🔵 SummaryComponent clicked:', component.id, {
          onSelect: !!onSelect,
          onComponentSelect: !!onComponentSelect,
        });

        // Usar onComponentSelect si está disponible (para componentes dentro de notas)
        if (onComponentSelect) {
          onComponentSelect(component.id);
          console.log('🟢 SummaryComponent onComponentSelect called for:', component.id);
        } else if (onSelect) {
          onSelect();
          console.log('🟢 SummaryComponent onSelect called for:', component.id);
        }
      },
      [onSelect, onComponentSelect, component.id]
    );

    const handleSelectionUpdateMemo = useCallback(
      (editor: any) => {
        if (isSelected && handleSelectionUpdate) {
          requestAnimationFrame(() => {
            handleSelectionUpdate(editor);
          });
        }
      },
      [isSelected, handleSelectionUpdate]
    );

    if (process.env.NODE_ENV === 'development') {
      const currentTime = performance.now();
      const renderTime = currentTime - lastRenderTime.current;
      if (renderTime > 16) {
        console.log(`SummaryComponent ${component.id} render took ${renderTime.toFixed(2)}ms`);
      }
      lastRenderTime.current = currentTime;
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
        <Box
          sx={{
            ...containerStyles,
          }}
        >
          {/* Header con icono y título */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              padding: '16px 20px 12px 20px',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              {/* Renderizar PNG (solo URLs) */}
              <img
                src={icon}
                alt="Icon"
                style={{
                  width: 18,
                  height: 18,
                  objectFit: 'contain',
                  display: 'block',
                }}
                onError={(e) => {
                  // Fallback si la imagen no carga
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Box>

            {/* Título editable */}
            {isEditingLabel ? (
              <TextField
                value={tempLabel}
                onChange={handleLabelChange}
                onKeyDown={handleLabelKeyDown}
                onBlur={handleLabelBlur}
                autoFocus
                variant="standard"
                size="small"
                sx={{
                  '& .MuiInput-root': {
                    color: textColor,
                    fontWeight: 600,
                    fontSize: '16px',
                    letterSpacing: '-0.01em',
                    '&:before': {
                      borderBottom: 'none',
                    },
                    '&:after': {
                      borderBottom: `2px solid ${textColor}`,
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottom: 'none',
                    },
                  },
                  '& .MuiInput-input': {
                    padding: 0,
                  },
                }}
              />
            ) : (
              <Typography
                variant="subtitle1"
                onClick={handleLabelClick}
                sx={{
                  color: textColor,
                  fontWeight: 600,
                  fontSize: '16px',
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                {label}
              </Typography>
            )}
          </Box>

          {/* Contenido */}
          <Box
            sx={{
              padding: '16px 20px 20px 20px',
            }}
          >
            <Box sx={contentBoxStyles}>
              <MemoizedSummaryEditor
                content={component.content}
                onContentChange={handleContentChange}
                onSelectionUpdate={handleSelectionUpdateMemo}
                editorStyle={editorStyle}
              />
            </Box>
          </Box>
        </Box>
      </ComponentWithToolbar>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.component.id !== nextProps.component.id) return false;
    if (prevProps.component.content !== nextProps.component.content) return false;
    if (prevProps.isSelected !== nextProps.isSelected) return false;
    if (prevProps.index !== nextProps.index) return false;

    if (JSON.stringify(prevProps.component.style) !== JSON.stringify(nextProps.component.style))
      return false;
    if (JSON.stringify(prevProps.component.props) !== JSON.stringify(nextProps.component.props))
      return false;

    return true;
  }
);

SummaryComponent.displayName = 'SummaryComponent';

export default SummaryComponent;
