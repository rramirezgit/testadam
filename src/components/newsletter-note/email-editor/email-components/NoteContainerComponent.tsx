'use client';

import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Typography } from '@mui/material';

import useTaskManagerStore from 'src/store/TaskManagerStore';

import EmailComponentRenderer from './index';
import ComponentWithToolbar from './ComponentWithToolbar';

import type { EmailComponentProps } from './types';

interface NoteContainerComponentProps extends EmailComponentProps {
  removeNoteContainer?: (containerId: string) => void;
  getActiveComponents?: () => any[];
  onComponentSelect?: (componentId: string) => void; // Nueva prop para selección de componentes
  selectedComponentId?: string | null; // Nueva prop para saber qué componente está seleccionado
  // Props para guardar notas individuales de AI
  aiNewsletterId?: string;
  onSaveAINote?: (noteIndex: number, taskId: string) => void;
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
  selectedComponentId, // Nueva prop
  aiNewsletterId,
  onSaveAINote,
}: NoteContainerComponentProps) {
  const noteTitle = component.props?.noteTitle || 'Nota Inyectada';
  const aiMetadata = component.props?._aiMetadata;

  // Suscribirse al TaskManagerStore para obtener el estado actualizado en tiempo real
  const taskFromStore = useTaskManagerStore((state) =>
    aiMetadata?.taskId ? state.getTaskById(aiMetadata.taskId) : null
  );

  // Obtener estilos configurables desde props o usar defaults
  const borderWidth =
    component.props?.containerBorderWidth?.toString().replace('px', '') ||
    component.style?.borderWidth?.toString().replace('px', '') ||
    '2';
  const borderColor =
    component.props?.containerBorderColor || component.style?.borderColor || '#e0e0e0';
  const borderRadius =
    component.props?.containerBorderRadius?.toString().replace('px', '') ||
    component.style?.borderRadius?.toString().replace('px', '') ||
    '12';
  const padding =
    component.props?.containerPadding?.toString().replace('px', '') ||
    component.style?.padding?.toString().replace('px', '') ||
    '24';
  const backgroundColor =
    component.props?.containerBackgroundColor || component.style?.backgroundColor || '#ffffff';

  const handleRemove = () => {
    if (removeNoteContainer) {
      removeNoteContainer(component.id);
    } else {
      removeComponent(component.id);
    }
  };

  // Handler para guardar nota de AI
  const handleSaveAINote = () => {
    if (aiMetadata && onSaveAINote && aiNewsletterId) {
      // Extraer el índice de la nota desde el ID del componente
      // o desde los props si está disponible
      const noteIndex = component.props?.noteIndex || 0;
      onSaveAINote(noteIndex, aiMetadata.taskId);
    }
  };

  // Obtener los componentes contenidos para renderizarlos
  const componentsData = component.props?.componentsData || [];
  const containedComponentObjects = componentsData.length > 0 ? componentsData : [];

  // Determinar si es una nota de IA
  const isAIGeneratedNote = Boolean(aiMetadata && aiNewsletterId);
  // Usar el estado del store si existe, sino usar el metadata del componente
  const isNoteSaved = Boolean(taskFromStore?.isSaved ?? aiMetadata?.isSaved);

  // ⚡ DEBUG: Log de renderizado del contenedor de nota
  console.log('🔵 NoteContainerComponent:', {
    componentId: component.id,
    componentType: component.type,
    noteTitle,
    componentsDataLength: componentsData.length,
    containedComponentObjects: containedComponentObjects.map((c) => ({ id: c.id, type: c.type })),
    selectedComponentId,
    isSelected,
    isAIGeneratedNote,
    isNoteSaved,
    taskFromStore: taskFromStore
      ? { taskId: taskFromStore.taskId, isSaved: taskFromStore.isSaved }
      : null,
  });

  return (
    <ComponentWithToolbar
      isSelected={isSelected}
      index={component.props?.noteIndex || 0}
      totalComponents={totalComponents}
      componentId={component.id}
      componentType="noteContainer"
      moveComponent={moveComponent}
      removeComponent={handleRemove}
      onClick={onSelect}
      isAIGeneratedNote={isAIGeneratedNote}
      onSaveClick={!isNoteSaved ? handleSaveAINote : undefined}
    >
      <Box
        sx={{
          position: 'relative',
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: `${borderRadius}px`,
          padding: `${padding}px`,
          backgroundColor,
          margin: '0 auto',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Contenido del contenedor - Renderizar los componentes aquí */}
        <Box data-note-content>
          {containedComponentObjects.length > 0 ? (
            containedComponentObjects.map((containedComponent, index) => (
              // <ComponentWithToolbar
              //   key={containedComponent.id}
              //   isSelected={containedComponent.id === selectedComponentId} // Los componentes internos se seleccionan individualmente
              //   index={index}
              //   totalComponents={containedComponentObjects.length}
              //   componentId={containedComponent.id}
              //   moveComponent={(id: string, direction: 'up' | 'down') => {
              //     // Mover componentes dentro del contenedor de la nota
              //     const currentIndex = containedComponentObjects.findIndex((comp) => comp.id === id);
              //     if (currentIndex === -1) return;

              //     const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
              //     if (newIndex < 0 || newIndex >= containedComponentObjects.length) return;

              //     const updatedComponents = [...containedComponentObjects];
              //     const [movedComponent] = updatedComponents.splice(currentIndex, 1);
              //     updatedComponents.splice(newIndex, 0, movedComponent);

              //     // Actualizar los componentes en el contenedor
              //     const updatedComponent = {
              //       ...component,
              //       props: {
              //         ...component.props,
              //         componentsData: updatedComponents,
              //       },
              //     };

              //     if (updateComponentProps) {
              //       updateComponentProps(component.id, updatedComponent.props);
              //     }
              //   }}
              //   removeComponent={(componentId: string) => {
              //     // Eliminar componente del contenedor de la nota
              //     const updatedComponents = containedComponentObjects.filter(
              //       (comp) => comp.id !== componentId
              //     );

              //     const updatedComponent = {
              //       ...component,
              //       props: {
              //         ...component.props,
              //         componentsData: updatedComponents,
              //       },
              //     };

              //     if (updateComponentProps) {
              //       updateComponentProps(component.id, updatedComponent.props);
              //     }
              //   }}
              //   onClick={() => {
              //     // Permitir selección de componentes individuales dentro de la nota
              //     if (onComponentSelect) {
              //       console.log(
              //         '🎯 NoteContainerComponent: Seleccionando componente interno:',
              //         containedComponent.id
              //       );
              //       onComponentSelect(containedComponent.id);
              //     }
              //   }}
              // >
              <EmailComponentRenderer
                key={containedComponent.id}
                component={containedComponent}
                index={index}
                isSelected={containedComponent.id === selectedComponentId}
                onSelect={() => {
                  // Permitir selección de componentes individuales dentro de la nota
                  if (onComponentSelect) {
                    console.log(
                      '🎯 NoteContainerComponent EmailComponentRenderer: Seleccionando componente interno:',
                      containedComponent.id
                    );
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
                selectedComponentId={selectedComponentId}
                // Pasar categoryId desde los metadatos del contenedor si el componente es TituloConIcono
                {...(containedComponent.type === 'tituloConIcono' && {
                  categoryId: component.props?.noteMetadata?.categoryId,
                })}
              />
              // </ComponentWithToolbar>
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
    </ComponentWithToolbar>
  );
}
