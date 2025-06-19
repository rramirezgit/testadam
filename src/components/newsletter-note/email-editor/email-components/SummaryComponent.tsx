import type React from 'react';

import { Icon } from '@iconify/react';
import { memo, useRef, useMemo, useState, useCallback } from 'react';

import { Box, Typography } from '@mui/material';

import ComponentWithToolbar from './ComponentWithToolbar';
import SimpleTipTapEditor from '../../simple-tiptap-editor';

import type { EmailComponentProps } from './types';

// Definición de tipos de summary con sus configuraciones
const SUMMARY_TYPES = {
  resumen: {
    label: 'Resumen',
    icon: 'mdi:note-text-outline',
    backgroundColor: '#f8f9fa',
    iconColor: '#6c757d',
    textColor: '#495057',
  },
  concepto: {
    label: 'Concepto',
    icon: 'mdi:lightbulb-outline',
    backgroundColor: '#e7f3ff',
    iconColor: '#0066cc',
    textColor: '#003d7a',
  },
  dato: {
    label: 'Dato',
    icon: 'mdi:lightbulb-on',
    backgroundColor: '#fff8e1',
    iconColor: '#f57c00',
    textColor: '#e65100',
  },
  tip: {
    label: 'TIP',
    icon: 'mdi:rocket-launch',
    backgroundColor: '#f3e5f5',
    iconColor: '#8e24aa',
    textColor: '#4a148c',
  },
  analogia: {
    label: 'Analogía',
    icon: 'mdi:brain',
    backgroundColor: '#e8f5e8',
    iconColor: '#388e3c',
    textColor: '#1b5e20',
  },
} as const;

type SummaryType = keyof typeof SUMMARY_TYPES;

// ⚡ ULTRA-OPTIMIZACIÓN: Cache de estilos computados para summaries
const summaryStyleCache = new Map<string, React.CSSProperties>();

// ⚡ ULTRA-OPTIMIZACIÓN: Función helper para crear cache key
const createSummaryStyleKey = (component: any, isSelected: boolean, typeConfig: any): string => {
  const { style = {}, props = {} } = component;
  return `${JSON.stringify(style)}-${JSON.stringify(props)}-${isSelected}-${JSON.stringify(typeConfig)}`;
};

// ⚡ ULTRA-OPTIMIZACIÓN: Función para generar estilos optimizada para summaries
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
    // ⚡ ULTRA-OPTIMIZACIÓN: GPU acceleration y optimizaciones de rendering
    willChange: isSelected ? 'transform, box-shadow' : 'auto',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    // ⚡ ULTRA-OPTIMIZACIÓN: Containment para mejor rendimiento
    contain: 'layout style',
    // ⚡ ULTRA-OPTIMIZACIÓN: Optimización específica para summaries
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

// ⚡ ULTRA-OPTIMIZACIÓN: Componente interno memoizado para summaries
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
    />
  ),
  (prevProps, nextProps) =>
    // ⚡ ULTRA-OPTIMIZACIÓN: Comparación profunda optimizada
    prevProps.content === nextProps.content &&
    prevProps.onContentChange === nextProps.onContentChange &&
    prevProps.onSelectionUpdate === nextProps.onSelectionUpdate &&
    JSON.stringify(prevProps.editorStyle) === JSON.stringify(nextProps.editorStyle)
);

MemoizedSummaryEditor.displayName = 'MemoizedSummaryEditor';

// ⚡ ULTRA-OPTIMIZACIÓN: Componente principal con memo avanzado
const SummaryComponent = memo(
  ({
    component,
    index,
    isSelected,
    onSelect,
    updateComponentContent,
    updateComponentProps,
    handleSelectionUpdate,
    moveComponent,
    removeComponent,
    totalComponents,
  }: EmailComponentProps) => {
    const lastRenderTime = useRef(performance.now());
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    // Determinar el tipo de summary (por defecto 'resumen')
    const summaryType: SummaryType = (component.props?.summaryType as SummaryType) || 'resumen';
    const typeConfig = SUMMARY_TYPES[summaryType];

    // Permitir personalización pero usar valores por defecto del tipo
    const iconColor = component.props?.iconColor || typeConfig.iconColor;
    const textColor = component.props?.textColor || typeConfig.textColor;
    const icon = component.props?.icon || typeConfig.icon;
    const label = component.props?.label || typeConfig.label;

    // ⚡ ULTRA-OPTIMIZAÇÃO: Memoización de estilos con cache
    const containerStyles = useMemo(
      () => generateOptimizedSummaryStyles(component, isSelected, typeConfig),
      [component.style, component.props, isSelected, typeConfig]
    );

    // ⚡ ULTRA-OPTIMIZAÇÃO: Memoización de estilos del editor
    const editorStyle = useMemo(
      () => ({
        outline: 'none',
        // ⚡ ULTRA-OPTIMIZACIÓN: Optimizaciones específicas del texto para summaries
        fontDisplay: 'swap' as const,
        textSizeAdjust: 'none',
        WebkitFontSmoothing: 'antialiased' as const,
        MozOsxFontSmoothing: 'grayscale' as const,
      }),
      []
    );

    // ⚡ ULTRA-OPTIMITZACIÓ: Memoización de estilos del contenido
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

    // ⚡ ULTRA-OPTIMIZAÇÃO: Manejo de clics optimizado
    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        console.log('🔵 SummaryComponent clicked:', component.id, { onSelect: !!onSelect });
        if (onSelect) {
          // Llamar inmediatamente en lugar de defer para debugging
          onSelect();
          console.log('🟢 SummaryComponent onSelect called for:', component.id);
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
        console.log(`SummaryComponent ${component.id} render took ${renderTime.toFixed(2)}ms`);
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
        <Box
          sx={{
            ...containerStyles,
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transform: 'translateY(-1px)',
            },
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
              {/* Renderizar PNG o icono legacy */}
              {icon.startsWith('http') ? (
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
              ) : (
                <Icon
                  icon={icon}
                  style={{
                    fontSize: 18,
                    color: iconColor,
                  }}
                />
              )}
            </Box>

            <Typography
              variant="subtitle1"
              sx={{
                color: textColor,
                fontWeight: 600,
                fontSize: '16px',
                letterSpacing: '-0.01em',
              }}
            >
              {label}
            </Typography>
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

SummaryComponent.displayName = 'SummaryComponent';

export default SummaryComponent;
