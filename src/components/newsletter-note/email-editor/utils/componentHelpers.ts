import type { EmailComponent } from 'src/types/saved-note';

import type { ComponentType } from '../types';

// Función para crear un nuevo componente
export const createNewComponent = (
  type: ComponentType,
  activeVersion: 'newsletter' | 'web'
): EmailComponent => {
  const suffix = activeVersion === 'web' ? '-web' : '';
  const newComponent: EmailComponent = {
    id: `${type}-${Date.now()}${suffix}`,
    type,
    content:
      type === 'heading'
        ? 'New Heading'
        : type === 'paragraph'
          ? 'New paragraph text'
          : type === 'button'
            ? 'Button Text'
            : type === 'bulletList'
              ? 'List item'
              : type === 'category'
                ? 'Categoría'
                : type === 'author'
                  ? 'Autor'
                  : type === 'summary'
                    ? 'Resumen de la noticia'
                    : type === 'tituloConIcono'
                      ? 'Título con Icono'
                      : type === 'respaldadoPor'
                        ? 'Respaldado por texto'
                        : type === 'newsletterHeaderReusable'
                          ? 'Header Newsletter'
                          : type === 'newsletterFooterReusable'
                            ? 'Footer Newsletter'
                            : '',
    props:
      type === 'heading'
        ? { level: 2 }
        : type === 'button'
          ? { variant: 'contained', color: 'primary' }
          : type === 'image'
            ? { src: '', alt: 'Placeholder image' }
            : type === 'bulletList'
              ? { items: ['List item 1'], listStyle: 'disc', listColor: '#000000' }
              : type === 'summary'
                ? {
                    summaryType: 'resumen',
                    label: 'Resumen',
                    icon: 'https://img.icons8.com/color/48/note.png',
                    backgroundColor: '#f8f9fa',
                    textColor: '#495057',
                  }
                : type === 'tituloConIcono'
                  ? {
                      icon: 'https://img.icons8.com/color/48/line-chart.png',
                      gradientColor1: '#4facfe',
                      gradientColor2: '#00f2fe',
                      gradientType: 'linear',
                      textColor: '#ffffff',
                    }
                  : type === 'respaldadoPor'
                    ? {
                        texto: 'Respaldado por',
                        nombre: 'Redacción',
                        avatarUrl: '',
                        avatarTamano: 21,
                        mostrarEscritorPropietario: false,
                        escritorNombre: 'Escritor',
                        escritorAvatarUrl: '',
                        propietarioNombre: 'Propietario',
                        propietarioAvatarUrl: '',
                      }
                    : type === 'newsletterHeaderReusable'
                      ? {
                          title: 'Newsletter Semanal',
                          subtitle: 'Las mejores noticias y actualizaciones',
                          logo: '',
                          logoAlt: 'Logo',
                          bannerImage: '',
                          backgroundColor: '#FFF9CE',
                          textColor: '#333333',
                          alignment: 'center',
                          useGradient: true,
                          gradientColors: ['#FFF9CE', '#E2E5FA'],
                          gradientDirection: 135,
                          showLogo: true,
                          showBanner: false,
                          logoHeight: 60,
                          padding: 32,
                          sponsor: {
                            enabled: false,
                            label: 'Juntos con',
                            image: '',
                            imageAlt: 'Sponsor',
                          },
                        }
                      : type === 'newsletterFooterReusable'
                        ? {
                            companyName: 'Tu Empresa',
                            showAddress: true,
                            address: 'Calle, Ciudad, País',
                            contactEmail: 'contacto@tuempresa.com',
                            unsubscribeLink: '#unsubscribe',
                            textColor: '#666666',
                            backgroundColor: '#f5f5f5',
                            useGradient: false,
                            gradientColors: ['#f5f5f5', '#e0e0e0'],
                            gradientDirection: 180,
                            padding: 24,
                            fontSize: 14,
                            showSocial: false,
                            socialLinks: [],
                          }
                        : {},
    style:
      type === 'button'
        ? {
            backgroundColor: '#3f51b5',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }
        : type === 'bulletList'
          ? {
              listStyleType: 'disc',
              color: '#000000',
              marginLeft: '20px',
            }
          : type === 'newsletterHeaderReusable'
            ? {
                padding: '32px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FFF9CE 0%, #E2E5FA 100%)',
                borderRadius: '8px',
                marginBottom: '20px',
              }
            : type === 'newsletterFooterReusable'
              ? {
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  marginTop: '20px',
                }
              : {},
  };

  return newComponent;
};

// Función para convertir párrafo a lista
export const convertTextToList = (
  component: EmailComponent,
  listType: 'ordered' | 'unordered',
  activeVersion: 'newsletter' | 'web'
): EmailComponent => {
  // Limpiar el contenido HTML para extraer solo el texto
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = component.content;
  const textContent = tempDiv.textContent || tempDiv.innerText || component.content;

  // Dividir el contenido por líneas para crear múltiples elementos de lista
  const listItems = textContent
    .split(/\r?\n/)
    .filter((item) => item.trim() !== '')
    .map((item) => item.trim());

  // Si no hay elementos después de dividir, usar el texto completo
  const items = listItems.length > 0 ? listItems : [textContent];

  // Crear un nuevo componente de lista con el contenido limpio
  const newListComponent: EmailComponent = {
    id: `bulletList-${Date.now()}${activeVersion === 'web' ? '-web' : ''}`,
    type: 'bulletList',
    content: '',
    props: {
      items,
      listStyle: listType === 'ordered' ? 'decimal' : 'disc',
      listColor: '#000000',
    },
    style: {
      listStyleType: listType === 'ordered' ? 'decimal' : 'disc',
      color: '#000000',
      marginLeft: '20px',
    },
  };

  return newListComponent;
};

// Función para mover un componente en la lista
export const moveComponentInArray = (
  components: EmailComponent[],
  componentId: string,
  direction: 'up' | 'down'
): EmailComponent[] => {
  const index = components.findIndex((component) => component.id === componentId);

  if (index === -1) return components;
  if (direction === 'up' && index === 0) return components;
  if (direction === 'down' && index === components.length - 1) return components;

  const newComponents = [...components];
  const component = newComponents[index];

  if (direction === 'up') {
    newComponents[index] = newComponents[index - 1];
    newComponents[index - 1] = component;
  } else {
    newComponents[index] = newComponents[index + 1];
    newComponents[index + 1] = component;
  }

  return newComponents;
};

// Función para eliminar un componente de la lista
export const removeComponentFromArray = (
  components: EmailComponent[],
  componentId: string
): EmailComponent[] => components.filter((component) => component.id !== componentId);

// Función para agregar un componente a la lista
export const addComponentToArray = (
  components: EmailComponent[],
  newComponent: EmailComponent
): EmailComponent[] => [...components, newComponent];

// Función para actualizar un componente en la lista
export const updateComponentInArray = (
  components: EmailComponent[],
  componentId: string,
  updates: Partial<EmailComponent>
): EmailComponent[] =>
  components.map((component) =>
    component.id === componentId ? { ...component, ...updates } : component
  );

// Función para reemplazar un componente en la lista
export const replaceComponentInArray = (
  components: EmailComponent[],
  oldComponentId: string,
  newComponent: EmailComponent
): EmailComponent[] => {
  const index = components.findIndex((comp) => comp.id === oldComponentId);
  if (index === -1) return components;

  const updatedComponents = [...components];
  updatedComponents.splice(index, 1, newComponent);
  return updatedComponents;
};

// Función recursiva para actualizar un componente en cualquier nivel de anidamiento
export const updateComponentInArrayRecursive = (
  components: EmailComponent[],
  componentId: string,
  updates: Partial<EmailComponent>
): EmailComponent[] =>
  components.map((component) => {
    if (component.id === componentId) {
      // Si es el componente objetivo, actualizarlo
      return { ...component, ...updates };
    }
    // Si es un contenedor de nota con componentes anidados
    if (
      component.props &&
      component.props.componentsData &&
      Array.isArray(component.props.componentsData)
    ) {
      const updatedChildren = updateComponentInArrayRecursive(
        component.props.componentsData,
        componentId,
        updates
      );
      // Solo crear nueva referencia si hubo cambios en los hijos
      if (updatedChildren !== component.props.componentsData) {
        return {
          ...component,
          props: {
            ...component.props,
            componentsData: updatedChildren,
          },
        };
      }
    }
    // Si no es el objetivo ni tiene hijos a actualizar, devolver igual
    return component;
  });

// Función recursiva para buscar un componente por id en toda la estructura
export function findComponentById(
  components: EmailComponent[],
  id: string
): EmailComponent | undefined {
  for (const comp of components) {
    if (comp.id === id) return comp;
    if (comp.props?.componentsData && Array.isArray(comp.props.componentsData)) {
      const found = findComponentById(comp.props.componentsData, id);
      if (found) return found;
    }
  }
  return undefined;
}

// Nueva función para verificar si un componente es inyectado
export function isInjectedComponent(componentId: string): boolean {
  return componentId.includes('-injected-');
}

// Nueva función para obtener el ID base de un componente inyectado
export function getBaseComponentId(injectedId: string): string {
  if (!isInjectedComponent(injectedId)) {
    return injectedId;
  }

  // Extraer el ID base antes del patrón -injected-
  const parts = injectedId.split('-injected-');
  return parts[0];
}

// Nueva función para filtrar componentes inyectados
export function filterInjectedComponents(components: EmailComponent[]): EmailComponent[] {
  return components.filter((component) => !isInjectedComponent(component.id));
}

// Nueva función para obtener solo componentes inyectados
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

// Nueva función para debugging de componentes
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
