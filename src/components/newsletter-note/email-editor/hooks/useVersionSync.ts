import type { EmailComponent } from 'src/types/saved-note';

import { useState, useCallback } from 'react';

interface UseVersionSyncProps {
  activeTemplate: string;
  activeVersion: 'newsletter' | 'web';
  getActiveComponents: (template: string, version: 'newsletter' | 'web') => EmailComponent[];
  updateActiveComponents: (
    template: string,
    version: 'newsletter' | 'web',
    components: EmailComponent[]
  ) => void;
  getOtherVersionComponents: (template: string, version: 'newsletter' | 'web') => EmailComponent[];
  onShowNotification?: (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning'
  ) => void;
}

export const useVersionSync = ({
  activeTemplate,
  activeVersion,
  getActiveComponents,
  updateActiveComponents,
  getOtherVersionComponents,
  onShowNotification,
}: UseVersionSyncProps) => {
  // Estado para la sincronización automática
  const [syncEnabled, setSyncEnabled] = useState<boolean>(false);
  const [lastSyncedVersion, setLastSyncedVersion] = useState<'newsletter' | 'web' | null>(null);

  // Función para activar/desactivar la sincronización
  const toggleSync = useCallback(() => {
    if (!syncEnabled) {
      onShowNotification?.('Sincronización automática activada', 'success');
    } else {
      onShowNotification?.('Sincronización automática desactivada', 'info');
    }
    setSyncEnabled(!syncEnabled);
  }, [syncEnabled, onShowNotification]);

  // Función para sincronizar contenido entre versiones
  const syncContent = useCallback(
    (sourceVersion: 'newsletter' | 'web', targetVersion: 'newsletter' | 'web') => {
      const sourceComponents = getActiveComponents(activeTemplate, sourceVersion);
      const targetComponents = getOtherVersionComponents(activeTemplate, targetVersion);

      // Si no hay componentes en el origen, mostrar mensaje y salir
      if (sourceComponents.length === 0) {
        onShowNotification?.(
          `No hay contenido en ${sourceVersion === 'newsletter' ? 'Newsletter' : 'Web'} para transferir`,
          'warning'
        );
        return;
      }

      // Iterar sobre los componentes de destino existentes y actualizar sus valores
      // con los componentes correspondientes del origen, manteniendo la estructura y posición
      const updatedTargetComponents = targetComponents.map((targetComponent) => {
        // Obtener sufijo correcto para buscar el componente equivalente
        const targetSuffix = targetVersion === 'web' ? '-web' : '';
        const sourceSuffix = sourceVersion === 'web' ? '-web' : '';

        // Extraer el ID base (sin sufijo)
        let baseId = targetComponent.id;
        if (baseId.endsWith(targetSuffix)) {
          baseId = baseId.substring(0, baseId.length - targetSuffix.length);
        }

        // Crear el ID equivalente en el origen
        const sourceId = baseId + sourceSuffix;

        // Buscar el componente correspondiente en el origen
        const sourceComponent = sourceComponents.find(
          (comp) =>
            comp.id === sourceId || // Buscar por ID exacto
            // O buscar por ID base si los sufijos no coinciden
            (comp.id.endsWith(sourceSuffix) &&
              comp.id.substring(0, comp.id.length - sourceSuffix.length) === baseId)
        );

        // Si existe el componente en el origen, actualizar valores pero mantener ID y posición
        if (sourceComponent) {
          return {
            ...targetComponent,
            content: sourceComponent.content,
            props: { ...targetComponent.props, ...sourceComponent.props },
            style: { ...targetComponent.style, ...sourceComponent.style },
          };
        }

        // Si no existe, mantener el componente de destino sin cambios
        return targetComponent;
      });

      // Actualizar los componentes de destino (manteniendo la estructura)
      updateActiveComponents(activeTemplate, targetVersion, updatedTargetComponents);

      onShowNotification?.(
        `Valores sincronizados de ${sourceVersion === 'newsletter' ? 'Newsletter' : 'Web'} a ${targetVersion === 'newsletter' ? 'Newsletter' : 'Web'}`,
        'success'
      );
    },
    [
      activeTemplate,
      getActiveComponents,
      getOtherVersionComponents,
      updateActiveComponents,
      onShowNotification,
    ]
  );

  // Función para cambiar entre versiones (newsletter y web)
  const handleVersionChange = useCallback(
    (newVersion: 'newsletter' | 'web') => {
      // Si la sincronización está activada, sincronizar contenido antes de cambiar
      if (syncEnabled && activeVersion !== newVersion) {
        syncContent(activeVersion, newVersion);
        setLastSyncedVersion(activeVersion);
      }
    },
    [syncEnabled, activeVersion, syncContent]
  );

  // Función para transferir contenido de Newsletter a Web
  const transferToWeb = useCallback(() => {
    syncContent('newsletter', 'web');
    onShowNotification?.(
      'Valores transferidos de Newsletter a Web (solo actualiza componentes existentes)',
      'info'
    );
  }, [syncContent, onShowNotification]);

  // Función para transferir contenido de Web a Newsletter
  const transferToNewsletter = useCallback(() => {
    syncContent('web', 'newsletter');
    onShowNotification?.(
      'Valores transferidos de Web a Newsletter (solo actualiza componentes existentes)',
      'info'
    );
  }, [syncContent, onShowNotification]);

  // Función de utilidad para mostrar una notificación de sincronización
  const showSyncNotification = useCallback(
    (fromVersion: 'newsletter' | 'web', toVersion: 'newsletter' | 'web') => {
      onShowNotification?.(
        `Valores sincronizados de ${fromVersion === 'newsletter' ? 'Newsletter' : 'Web'} a ${toVersion === 'newsletter' ? 'Newsletter' : 'Web'}`,
        'info'
      );
    },
    [onShowNotification]
  );

  // Función para sincronizar automáticamente cuando se actualiza un componente
  const syncComponentUpdate = useCallback(
    (
      componentId: string,
      updateData: { content?: string; props?: Record<string, any>; style?: React.CSSProperties }
    ) => {
      if (!syncEnabled) return;

      const otherVersion = activeVersion === 'newsletter' ? 'web' : 'newsletter';
      const suffix = componentId.endsWith('-web') ? '-web' : '';
      const baseId = suffix ? componentId.slice(0, -suffix.length) : componentId;
      const otherVersionId = otherVersion === 'web' ? `${baseId}-web` : baseId;

      // Obtener componentes de la otra versión
      const otherVersionComponents = getOtherVersionComponents(activeTemplate, otherVersion);

      // Verificar si el componente existe en la otra versión
      const componentExists = otherVersionComponents.some((comp) => comp.id === otherVersionId);

      if (componentExists) {
        // Actualizar el componente correspondiente en la otra versión
        const updatedOtherVersionComponents = otherVersionComponents.map((component) => {
          if (component.id === otherVersionId) {
            const updatedComponent = { ...component };
            if (updateData.content !== undefined) {
              updatedComponent.content = updateData.content;
            }
            if (updateData.props) {
              updatedComponent.props = { ...updatedComponent.props, ...updateData.props };
            }
            if (updateData.style) {
              updatedComponent.style = { ...updatedComponent.style, ...updateData.style };
            }
            return updatedComponent;
          }
          return component;
        });

        // Guardar los componentes actualizados
        updateActiveComponents(activeTemplate, otherVersion, updatedOtherVersionComponents);

        // Mostrar notificación sutil
        showSyncNotification(activeVersion, otherVersion);
      }
    },
    [
      syncEnabled,
      activeVersion,
      activeTemplate,
      getOtherVersionComponents,
      updateActiveComponents,
      showSyncNotification,
    ]
  );

  return {
    syncEnabled,
    lastSyncedVersion,
    toggleSync,
    syncContent,
    handleVersionChange,
    transferToWeb,
    transferToNewsletter,
    showSyncNotification,
    syncComponentUpdate,
  };
};
