'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Typography } from '@mui/material';

import EmailComponentRenderer from './index';

import type { EmailComponentProps } from './types';

interface NoteContainerComponentProps extends EmailComponentProps {
  removeNoteContainer?: (containerId: string) => void;
  getActiveComponents?: () => any[];
  onComponentSelect?: (componentId: string) => void; // Nueva prop para selección de componentes
}

export default function NoteContainerComponent({
  component,
  isSelected,
  onSelect,
  removeComponent,
  removeNoteContainer,
  totalComponents,
  getActiveComponents,
  updateComponentContent,
  updateComponentProps,
  handleSelectionUpdate,
  moveComponent,
  onColumnSelect,
  onComponentSelect,
}: NoteContainerComponentProps) {
  const noteTitle = component.props?.noteTitle || 'Nota Inyectada';
  const containedComponents = component.props?.containedComponents || [];

  const handleRemove = () => {
    if (removeNoteContainer) {
      removeNoteContainer(component.id);
    } else {
      removeComponent(component.id);
    }
  };

  // Obtener los componentes contenidos para renderizarlos
  const componentsData = component.props?.componentsData || [];
  const containedComponentObjects = componentsData.length > 0 ? componentsData : [];

  // ⚡ DEBUG: Log de renderizado del contenedor de nota
  console.log('🔵 NoteContainerComponent:', {
    componentId: component.id,
    componentType: component.type,
    noteTitle,
    componentsDataLength: componentsData.length,
    containedComponentObjects: containedComponentObjects.map((c) => ({ id: c.id, type: c.type })),
  });

  return (
    <Box
      sx={{
        position: 'relative',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        padding: '24px',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        // '&:hover': {
        //   borderColor: '#1976d2',
        //   backgroundColor: '#f8f9fa',
        //   transform: 'translateY(-2px)',
        //   boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        // },
        // ...(isSelected && {
        //   borderColor: '#1976d2',
        //   borderWidth: '3px',
        //   boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
        // }),
      }}
      onClick={(e) => {
        // Solo seleccionar el contenedor si se hace clic en el header o en áreas vacías
        const target = e.target as HTMLElement;
        const isClickOnHeader = target.closest('[data-note-header]');
        const isClickOnContent = target.closest('[data-note-content]');

        if (isClickOnHeader || !isClickOnContent) {
          onSelect();
        }
      }}
    >
      {/* Contenido del contenedor - Renderizar los componentes aquí */}
      <Box data-note-content>
        {containedComponentObjects.length > 0 ? (
          containedComponentObjects.map((containedComponent, index) => (
            <Box key={containedComponent.id} sx={{ mb: 2 }}>
              <EmailComponentRenderer
                component={containedComponent}
                index={index}
                isSelected={false}
                onSelect={() => {
                  // Permitir selección de componentes individuales dentro de la nota
                  if (onComponentSelect) {
                    onComponentSelect(containedComponent.id);
                  }
                }}
                updateComponentContent={(id: string, content: string) => {
                  // Actualizar contenido de un componente dentro de la nota
                  const updatedComponents = containedComponentObjects.map((comp) =>
                    comp.id === id ? { ...comp, content } : comp
                  );

                  const updatedComponent = {
                    ...component,
                    props: {
                      ...component.props,
                      componentsData: updatedComponents,
                    },
                  };

                  if (updateComponentProps) {
                    updateComponentProps(component.id, updatedComponent.props);
                  }
                }}
                updateComponentProps={(id: string, props: Record<string, any>) => {
                  // Actualizar props de un componente dentro de la nota
                  const updatedComponents = containedComponentObjects.map((comp) =>
                    comp.id === id ? { ...comp, props: { ...comp.props, ...props } } : comp
                  );

                  const updatedComponent = {
                    ...component,
                    props: {
                      ...component.props,
                      componentsData: updatedComponents,
                    },
                  };

                  if (updateComponentProps) {
                    updateComponentProps(component.id, updatedComponent.props);
                  }
                }}
                handleSelectionUpdate={handleSelectionUpdate || (() => {})}
                moveComponent={(id: string, direction: 'up' | 'down') => {
                  // Mover componentes dentro del contenedor de la nota
                  if (moveComponent) {
                    const currentIndex = containedComponentObjects.findIndex(
                      (comp) => comp.id === id
                    );
                    if (currentIndex === -1) return;

                    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
                    if (newIndex < 0 || newIndex >= containedComponentObjects.length) return;

                    const updatedComponents = [...containedComponentObjects];
                    const [movedComponent] = updatedComponents.splice(currentIndex, 1);
                    updatedComponents.splice(newIndex, 0, movedComponent);

                    // Actualizar los componentes en el contenedor
                    const updatedComponent = {
                      ...component,
                      props: {
                        ...component.props,
                        componentsData: updatedComponents,
                      },
                    };

                    if (updateComponentProps) {
                      updateComponentProps(component.id, updatedComponent.props);
                    }
                  }
                }}
                removeComponent={(componentId: string) => {
                  // Eliminar componente del contenedor de la nota
                  const updatedComponents = containedComponentObjects.filter(
                    (comp) => comp.id !== componentId
                  );

                  const updatedComponent = {
                    ...component,
                    props: {
                      ...component.props,
                      componentsData: updatedComponents,
                    },
                  };

                  if (updateComponentProps) {
                    updateComponentProps(component.id, updatedComponent.props);
                  }
                }}
                totalComponents={containedComponentObjects.length}
                onColumnSelect={onColumnSelect || (() => {})}
                onComponentSelect={onComponentSelect}
              />
            </Box>
          ))
        ) : (
          <Box
            sx={{
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
              fontSize: '0.875rem',
              fontStyle: 'italic',
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
              borderRadius: '8px',
              border: '1px dashed #1976d2',
              padding: '16px',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Icon
                icon="mdi:arrow-down"
                style={{ fontSize: 24, color: '#1976d2', marginBottom: 8 }}
              />
              <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                Los componentes de la nota aparecerán aquí
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
                Haz clic para seleccionar este contenedor
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
