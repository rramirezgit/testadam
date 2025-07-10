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
                        : '',
    props:
      type === 'heading'
        ? { level: 2 }
        : type === 'button'
          ? { variant: 'contained', color: 'primary' }
          : type === 'image'
            ? { src: 'https://via.placeholder.com/600x400', alt: 'Placeholder image' }
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
