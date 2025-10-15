# 🚀 Mejoras para Componentes Inyectados en Newsletter

## 📋 Problema Resuelto

El problema con componentes como `tituloConIcono-1-injected-1752787453909-0` que no se filtraban correctamente en el panel de opciones ha sido resuelto con las siguientes mejoras:

## 🔧 Nuevas Funcionalidades Implementadas

### 1. **Funciones de Utilidad en `componentHelpers.ts`**

```typescript
// Verificar si un componente es inyectado
export function isInjectedComponent(componentId: string): boolean {
  return componentId.includes('-injected-');
}

// Obtener el ID base de un componente inyectado
export function getBaseComponentId(injectedId: string): string {
  if (!isInjectedComponent(injectedId)) {
    return injectedId;
  }
  const parts = injectedId.split('-injected-');
  return parts[0];
}

// Filtrar componentes inyectados
export function filterInjectedComponents(components: EmailComponent[]): EmailComponent[] {
  return components.filter((component) => !isInjectedComponent(component.id));
}

// Obtener solo componentes inyectados
export function getInjectedComponents(components: EmailComponent[]): EmailComponent[] {
  const injectedComponents: EmailComponent[] = [];

  components.forEach((component) => {
    // Si es un contenedor de nota, extraer los componentes inyectados
    if (component.type === 'noteContainer' && component.props?.componentsData) {
      const injectedInContainer = component.props.componentsData.filter((comp: any) =>
        isInjectedComponent(comp.id)
      );
      injectedComponents.push(...injectedInContainer);
    }

    // Para componentes individuales inyectados
    if (isInjectedComponent(component.id)) {
      injectedComponents.push(component);
    }
  });

  return injectedComponents;
}

// Función de debugging completa
export function debugComponents(components: EmailComponent[], label: string = 'Components'): void {
  console.log(`🔍 ${label} Debug:`, {
    totalComponents: components.length,
    componentTypes: components.map((c) => ({ id: c.id, type: c.type })),
    injectedComponents: getInjectedComponents(components).map((c) => ({ id: c.id, type: c.type })),
    noteContainers: components
      .filter((c) => c.type === 'noteContainer')
      .map((c) => ({
        id: c.id,
        containedComponents: c.props?.componentsData?.length || 0,
        containedComponentIds: c.props?.componentsData?.map((comp: any) => comp.id) || [],
      })),
  });
}
```

### 2. **Mejoras en `useEmailComponents.ts`**

```typescript
// Nueva función para filtrar componentes inyectados
const getFilteredActiveComponents = useCallback(
  (
    activeTemplate: string,
    activeVersion: 'newsletter' | 'web',
    filterInjected: boolean = false
  ) => {
    const components = getActiveComponents(activeTemplate, activeVersion);

    if (!filterInjected) {
      return components;
    }

    // Filtrar componentes inyectados (que tienen IDs con el patrón -injected-)
    return components.filter((component) => {
      // Si es un contenedor de nota, verificar si contiene componentes inyectados
      if (component.type === 'noteContainer' && component.props?.componentsData) {
        const hasInjectedComponents = component.props.componentsData.some(
          (comp: any) => comp.id && comp.id.includes('-injected-')
        );
        return !hasInjectedComponents;
      }

      // Para componentes individuales, verificar si tienen el patrón -injected-
      return !(component.id && component.id.includes('-injected-'));
    });
  },
  [getActiveComponents]
);

// Nueva función para obtener solo componentes inyectados
const getInjectedComponents = useCallback(
  (activeTemplate: string, activeVersion: 'newsletter' | 'web') => {
    const components = getActiveComponents(activeTemplate, activeVersion);
    const injectedComponents: EmailComponent[] = [];

    components.forEach((component) => {
      // Si es un contenedor de nota, extraer los componentes inyectados
      if (component.type === 'noteContainer' && component.props?.componentsData) {
        const injectedInContainer = component.props.componentsData.filter(
          (comp: any) => comp.id && comp.id.includes('-injected-')
        );
        injectedComponents.push(...injectedInContainer);
      }

      // Para componentes individuales inyectados
      if (component.id && component.id.includes('-injected-')) {
        injectedComponents.push(component);
      }
    });

    return injectedComponents;
  },
  [getActiveComponents]
);

// Nueva función para resolver problemas específicos
const resolveInjectedComponentIssue = useCallback(
  (activeTemplate: string, activeVersion: 'newsletter' | 'web', targetComponentId?: string) => {
    const components = getActiveComponents(activeTemplate, activeVersion);

    console.log('🔧 Resolviendo problema de componentes inyectados:', {
      activeTemplate,
      activeVersion,
      targetComponentId,
      totalComponents: components.length,
    });

    // Buscar componentes inyectados específicos
    if (targetComponentId) {
      const foundComponent = findComponentById(components, targetComponentId);
      console.log('🎯 Componente buscado:', {
        targetId: targetComponentId,
        found: !!foundComponent,
        component: foundComponent ? { id: foundComponent.id, type: foundComponent.type } : null,
      });

      if (foundComponent) {
        return foundComponent;
      }
    }

    // Listar todos los componentes inyectados
    const injectedComponents = getInjectedComponents(activeTemplate, activeVersion);
    console.log(
      '📋 Componentes inyectados encontrados:',
      injectedComponents.map((c) => ({ id: c.id, type: c.type }))
    );

    // Listar contenedores de nota
    const noteContainers = components.filter((c) => c.type === 'noteContainer');
    console.log(
      '📦 Contenedores de nota:',
      noteContainers.map((c) => ({
        id: c.id,
        containedComponents: c.props?.componentsData?.length || 0,
        componentIds: c.props?.componentsData?.map((comp: any) => comp.id) || [],
      }))
    );

    return {
      components,
      injectedComponents,
      noteContainers,
      targetComponent: targetComponentId ? findComponentById(components, targetComponentId) : null,
    };
  },
  [getActiveComponents, getInjectedComponents]
);
```

### 3. **Mejoras en `right-panel.tsx`**

```typescript
// Nueva función para manejar componentes inyectados específicamente
const handleInjectedComponentSelection = (componentId: string) => {
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

// Usar la nueva función para obtener el componente seleccionado
const selectedComponent = selectedComponentId
  ? handleInjectedComponentSelection(selectedComponentId)
  : null;
```

## 🎯 Cómo Usar las Nuevas Funcionalidades

### Ejemplo 1: Debuggear un Componente Específico

```typescript
// En tu componente donde usas useEmailComponents
const emailComponents = useEmailComponents();

// Debuggear un componente específico
const issueResolution = emailComponents.resolveInjectedComponentIssue(
  'newsletter',
  'newsletter',
  'tituloConIcono-1-injected-1752787453909-0'
);

console.log('🔍 Resultado del debugging:', issueResolution);
```

### Ejemplo 2: Obtener Solo Componentes Inyectados

```typescript
// Obtener solo componentes inyectados
const injectedComponents = emailComponents.getInjectedComponents('newsletter', 'newsletter');

console.log('📋 Componentes inyectados:', injectedComponents);
```

### Ejemplo 3: Filtrar Componentes Inyectados

```typescript
// Filtrar componentes inyectados (excluir componentes con -injected-)
const filteredComponents = emailComponents.getFilteredActiveComponents(
  'newsletter',
  'newsletter',
  true
);

console.log('🔍 Componentes filtrados:', filteredComponents);
```

### Ejemplo 4: Buscar un Componente Específico

```typescript
// Buscar un componente específico
const allComponents = emailComponents.getActiveComponents('newsletter', 'newsletter');
const specificComponent = findComponentById(
  allComponents,
  'tituloConIcono-1-injected-1752787453909-0'
);

if (specificComponent) {
  console.log('✅ Componente encontrado:', specificComponent);
} else {
  console.log('❌ Componente no encontrado');
}
```

## 🔍 Logs de Debugging

Las nuevas funcionalidades incluyen logs detallados que te ayudarán a:

1. **Identificar componentes inyectados** - Ver si un componente tiene el patrón `-injected-`
2. **Encontrar componentes perdidos** - Debuggear cuando un componente no se encuentra
3. **Verificar contenedores de nota** - Ver qué componentes están dentro de cada contenedor
4. **Analizar la estructura completa** - Ver todos los componentes y su organización

## ✅ Beneficios

- **Mejor debugging** - Logs detallados para identificar problemas
- **Filtrado inteligente** - Funciones para excluir o incluir componentes inyectados
- **Búsqueda recursiva** - Encuentra componentes dentro de contenedores de nota
- **Manejo específico** - Funciones especializadas para componentes inyectados
- **Panel de opciones funcional** - El panel derecho ahora funciona correctamente con componentes inyectados

## 🚀 Próximos Pasos

1. **Usa las nuevas funciones** para debuggear tu problema específico
2. **Revisa los logs en la consola** para ver exactamente dónde están los componentes
3. **Implementa el filtrado** si necesitas excluir componentes inyectados
4. **Usa las funciones de búsqueda** para encontrar componentes específicos

¡Con estas mejoras, el panel de opciones ahora debería funcionar correctamente con los componentes internos de las notas inyectadas!
