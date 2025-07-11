'use client';

import type { EmailComponent } from 'src/types/saved-note';

import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Typography } from '@mui/material';

// Importar los componentes reales del editor de emails
import ImageComponent from './email-editor/email-components/ImageComponent';
import AuthorComponent from './email-editor/email-components/AuthorComponent';
import ButtonComponent from './email-editor/email-components/ButtonComponent';
import SpacerComponent from './email-editor/email-components/SpacerComponent';
import SummaryComponent from './email-editor/email-components/SummaryComponent';
import HeadingComponent from './email-editor/email-components/HeadingComponent';
import DividerComponent from './email-editor/email-components/DividerComponent';
import GalleryComponent from './email-editor/email-components/GalleryComponent';
import CategoryComponent from './email-editor/email-components/CategoryComponent';
import ParagraphComponent from './email-editor/email-components/ParagraphComponent';
import BulletListComponent from './email-editor/email-components/BulletListComponent';
import HerramientasComponent from './email-editor/email-components/HerramientasComponent';
import RespaldadoPorComponent from './email-editor/email-components/RespaldadoPorComponent';
import NoteContainerComponent from './email-editor/email-components/NoteContainerComponent';
import TituloConIconoComponent from './email-editor/email-components/TituloConIconoComponent';

interface NewsletterComponentRendererProps {
  component: EmailComponent;
  index?: number;
  isPreview?: boolean;
  showControls?: boolean;
  onContentChange?: (id: string, content: string) => void;
  onPropsChange?: (id: string, props: Record<string, any>) => void;
  onStyleChange?: (id: string, style: React.CSSProperties) => void;
  onSelectionUpdate?: (editor: any) => void;
  onMoveComponent?: (id: string, direction: 'up' | 'down') => void;
  onRemoveComponent?: (id: string) => void;
  selectedComponentId?: string | null;
  setSelectedComponentId?: (id: string | null) => void;
}

/**
 * Renderizador unificado de componentes de newsletter
 *
 * Este componente garantiza que las notas se vean EXACTAMENTE igual
 * tanto en el editor de notas como en el preview del newsletter.
 *
 * Utiliza los mismos componentes que el editor de emails para
 * mantener total consistencia visual.
 */
export default function NewsletterComponentRenderer({
  component,
  index = 0,
  isPreview = false,
  showControls = false,
  onContentChange,
  onPropsChange,
  onStyleChange,
  onSelectionUpdate,
  onMoveComponent,
  onRemoveComponent,
  selectedComponentId,
  setSelectedComponentId,
}: NewsletterComponentRendererProps) {
  // Props comunes para todos los componentes
  const commonProps = {
    component,
    selectedComponentId,
    setSelectedComponentId,
    updateComponentContent: onContentChange || (() => {}),
    updateComponentProps: onPropsChange || (() => {}),
    updateComponentStyle: onStyleChange || (() => {}),
    handleSelectionUpdate: onSelectionUpdate || (() => {}),
    moveComponent: onMoveComponent || (() => {}),
    removeComponent: onRemoveComponent || (() => {}),
    editMode: !isPreview && showControls,
  };

  // Para el modo preview, usar versión de solo lectura
  if (isPreview) {
    return (
      <Box
        sx={{
          mb: 2,
          '& .tiptap-editor': {
            border: 'none !important',
            padding: '0 !important',
          },
          '& .ProseMirror': {
            padding: '0 !important',
          },
          '& .email-component-controls': {
            display: 'none !important',
          },
        }}
      >
        {renderComponent(commonProps)}
      </Box>
    );
  }

  // Para el modo editor, usar versión completa
  return <Box sx={{ mb: 2 }}>{renderComponent(commonProps)}</Box>;
}

/**
 * Función que renderiza el componente específico
 * Usa exactamente los mismos componentes que el editor de emails
 */
function renderComponent(props: any) {
  const { component } = props;

  switch (component.type) {
    case 'category':
      return <CategoryComponent {...props} />;
    case 'author':
      return <AuthorComponent {...props} />;
    case 'summary':
      return <SummaryComponent {...props} />;
    case 'heading':
      return <HeadingComponent {...props} />;
    case 'paragraph':
      return <ParagraphComponent {...props} />;
    case 'button':
      return <ButtonComponent {...props} />;
    case 'divider':
      return <DividerComponent {...props} />;
    case 'noteContainer':
      return <NoteContainerComponent {...props} />;
    case 'bulletList':
      return <BulletListComponent {...props} />;
    case 'image':
      return <ImageComponent {...props} />;
    case 'gallery':
      return <GalleryComponent {...props} />;
    case 'tituloConIcono':
      return <TituloConIconoComponent {...props} />;
    case 'respaldadoPor':
      return <RespaldadoPorComponent {...props} />;
    case 'spacer':
      return <SpacerComponent {...props} />;
    case 'herramientas':
      return <HerramientasComponent {...props} />;

    // Fallbacks para componentes no reconocidos
    default:
      return (
        <Box
          sx={{
            p: 2,
            mb: 2,
            bgcolor: 'grey.100',
            borderLeft: '3px solid',
            borderColor: 'warning.main',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Icon icon="mdi:alert-circle" style={{ marginRight: 8, color: '#ff9800' }} />
            <Typography variant="caption" color="text.secondary">
              Componente: {component.type}
            </Typography>
          </Box>
          <Typography variant="body2">{component.content || 'Sin contenido disponible'}</Typography>
        </Box>
      );
  }
}

/**
 * Hook para convertir objdata a componentes renderizables
 */
export function useNewsletterComponents(objdata: EmailComponent[]) {
  return React.useMemo(
    () =>
      objdata.map((component, index) => ({
        ...component,
        index,
      })),
    [objdata]
  );
}

/**
 * Componente wrapper para renderizar una lista completa de componentes
 */
export function NewsletterComponentList({
  components,
  isPreview = false,
  showControls = false,
  onContentChange,
  onPropsChange,
  onStyleChange,
  onSelectionUpdate,
  onMoveComponent,
  onRemoveComponent,
  selectedComponentId,
  setSelectedComponentId,
}: {
  components: EmailComponent[];
  isPreview?: boolean;
  showControls?: boolean;
  onContentChange?: (id: string, content: string) => void;
  onPropsChange?: (id: string, props: Record<string, any>) => void;
  onStyleChange?: (id: string, style: React.CSSProperties) => void;
  onSelectionUpdate?: (editor: any) => void;
  onMoveComponent?: (id: string, direction: 'up' | 'down') => void;
  onRemoveComponent?: (id: string) => void;
  selectedComponentId?: string | null;
  setSelectedComponentId?: (id: string | null) => void;
}) {
  if (components.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Icon icon="mdi:file-document-outline" style={{ fontSize: 48, opacity: 0.3 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Esta nota no tiene contenido
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {components.map((component, index) => (
        <NewsletterComponentRenderer
          key={component.id}
          component={component}
          index={index}
          isPreview={isPreview}
          showControls={showControls}
          onContentChange={onContentChange}
          onPropsChange={onPropsChange}
          onStyleChange={onStyleChange}
          onSelectionUpdate={onSelectionUpdate}
          onMoveComponent={onMoveComponent}
          onRemoveComponent={onRemoveComponent}
          selectedComponentId={selectedComponentId}
          setSelectedComponentId={setSelectedComponentId}
        />
      ))}
    </Box>
  );
}
