import type { PostStatus } from 'src/types/post';
import type { EmailComponent } from 'src/types/saved-note';

import { isStatusDisabled } from 'src/types/post';

import { findComponentById } from '../../utils/componentHelpers';

// Función para determinar si un status está deshabilitado (usando la función centralizada)
export const checkStatusDisabled = (
  noteStatus: string,
  targetStatus: string,
  currentNoteId?: string
): boolean =>
  isStatusDisabled(noteStatus as PostStatus, targetStatus as PostStatus, !!currentNoteId);

// Nueva función para manejar componentes inyectados específicamente
export const handleInjectedComponentSelection = (
  componentId: string,
  allComponents: EmailComponent[]
) => {
  console.log('🔧 Handling injected component selection:', componentId);

  // Verificar si es un componente inyectado
  const isInjected = componentId.includes('-injected-');

  if (isInjected) {
    console.log('📋 Componente inyectado detectado:', {
      componentId,
      baseId: componentId.split('-injected-')[0],
      timestamp: componentId.split('-injected-')[1]?.split('-')[0],
      index: componentId.split('-injected-')[1]?.split('-')[1],
    });
  }
  // Buscar el componente en toda la estructura
  const foundComponent = findComponentById(allComponents, componentId);

  if (foundComponent) {
    console.log('✅ Componente encontrado:', {
      id: foundComponent.id,
      type: foundComponent.type,
      isInjected,
    });
  } else {
    console.log('❌ Componente NO encontrado:', componentId);

    // Debug adicional para componentes inyectados
    if (isInjected) {
      const noteContainers = allComponents.filter((c) => c.type === 'noteContainer');
      console.log(
        '🔍 Buscando en contenedores de nota:',
        noteContainers.map((c) => ({
          id: c.id,
          containedComponents: c.props?.componentsData?.length || 0,
          componentIds: c.props?.componentsData?.map((comp: any) => comp.id) || [],
        }))
      );
    }
  }

  return foundComponent;
};
