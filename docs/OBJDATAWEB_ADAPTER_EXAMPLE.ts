/**
 * EJEMPLO DE ADAPTADOR OBJDATAWEB → EmailComponent
 * 
 * Este archivo muestra cómo convertir tu formato OBJDATAWEB existente
 * al formato EmailComponent que los generadores HTML esperan.
 * 
 * INSTRUCCIONES:
 * 1. Copia este archivo a tu otro proyecto
 * 2. Ajusta las interfaces según tu estructura real de OBJDATAWEB
 * 3. Completa los mapeos de tipos
 * 4. Usa las funciones de ejemplo para generar HTML
 */

import type { EmailComponent, HeaderConfig, FooterConfig } from '../src/components/newsletter-note/html-generators/types';
import { renderComponentToHtml, generateNewsletterTemplate } from '../src/components/newsletter-note/html-generators';

// =============================================================================
// PASO 1: DEFINE TU ESTRUCTURA OBJDATAWEB
// =============================================================================

/**
 * Reemplaza esto con tu estructura real de OBJDATAWEB
 */
interface ObjDataWebItem {
  // Ajusta según tu estructura real
  id?: string;
  tipo: string;                    // Ej: 'titulo', 'parrafo', 'imagen', etc.
  contenido?: string;              // Contenido de texto
  configuracion?: Record<string, any>;  // Props específicos
  estilos?: Record<string, any>;   // Estilos CSS
  
  // Propiedades específicas (ajustar según tu caso)
  url?: string;
  alt?: string;
  nivel?: number;
  // ... más propiedades
}

// =============================================================================
// PASO 2: MAPEO DE TIPOS
// =============================================================================

/**
 * Mapea tus tipos OBJDATAWEB a los tipos EmailComponent
 * 
 * Tipos disponibles en EmailComponent:
 * - heading, paragraph, bulletList, divider, image
 * - button, category, summary, author, spacer
 * - gallery, tituloConIcono, herramientas, respaldadoPor
 * - imageText, textWithIcon, twoColumns
 * - newsletterHeaderReusable, newsletterFooterReusable, noteContainer
 */
const TYPE_MAPPING: Record<string, string> = {
  // Componentes básicos
  'titulo': 'heading',
  'parrafo': 'paragraph',
  'texto': 'paragraph',
  'lista': 'bulletList',
  'divisor': 'divider',
  'linea': 'divider',
  'imagen': 'image',
  'espaciador': 'spacer',
  
  // Componentes de contenido
  'boton': 'button',
  'categoria': 'category',
  'tag': 'category',
  'resumen': 'summary',
  'autor': 'author',
  'galeria': 'gallery',
  
  // Componentes complejos
  'imagen-texto': 'imageText',
  'texto-imagen': 'imageText',
  'titulo-icono': 'tituloConIcono',
  'texto-icono': 'textWithIcon',
  'columnas': 'twoColumns',
  'dos-columnas': 'twoColumns',
  'herramientas': 'herramientas',
  'respaldado': 'respaldadoPor',
  
  // Contenedores
  'contenedor': 'noteContainer',
  'caja': 'noteContainer',
  
  // Estructurales
  'header': 'newsletterHeaderReusable',
  'footer': 'newsletterFooterReusable',
};

// =============================================================================
// PASO 3: FUNCIONES DE ADAPTACIÓN
// =============================================================================

/**
 * Convierte un item OBJDATAWEB a EmailComponent
 */
export function adaptSingleItem(
  item: ObjDataWebItem,
  index: number
): EmailComponent {
  // 1. Mapear el tipo
  const mappedType = TYPE_MAPPING[item.tipo] || item.tipo;
  
  // 2. Crear componente base
  const component: EmailComponent = {
    id: item.id || `component-${index}`,
    type: mappedType,
    content: item.contenido || '',
    props: { ...(item.configuracion || {}) },
    style: { ...(item.estilos || {}) },
  };
  
  // 3. Transformaciones específicas por tipo
  switch (mappedType) {
    case 'heading':
      // Si tienes 'nivel' en lugar de 'level'
      if (item.nivel && !component.props?.level) {
        component.props = { ...component.props, level: item.nivel };
      }
      break;
      
    case 'image':
      // Si tienes propiedades diferentes para imagen
      if (item.url && !component.props?.src) {
        component.props = { ...component.props, src: item.url };
      }
      if (item.alt && !component.props?.alt) {
        component.props = { ...component.props, alt: item.alt };
      }
      break;
      
    case 'button':
      // Si tienes 'enlace' en lugar de 'url'
      if (item.configuracion?.enlace && !component.props?.url) {
        component.props = { ...component.props, url: item.configuracion.enlace };
      }
      break;
      
    case 'imageText':
      // Asegurar que tenga las propiedades necesarias
      component.props = {
        imageUrl: item.configuracion?.imagenUrl || item.configuracion?.imageUrl || '',
        imageAlt: item.configuracion?.imagenAlt || item.configuracion?.imageAlt || 'Imagen',
        titleContent: item.configuracion?.titulo || item.configuracion?.titleContent || '<p>Título</p>',
        layout: item.configuracion?.layout || 'image-left',
        ...component.props,
      };
      break;
      
    case 'category':
      // Si tienes múltiples categorías
      if (item.configuracion?.categorias) {
        component.props = {
          ...component.props,
          categorias: item.configuracion.categorias,
        };
      }
      break;
      
    case 'noteContainer':
      // Si tiene componentes anidados
      if (item.configuracion?.componentes) {
        const nestedComponents = item.configuracion.componentes.map(
          (nested: ObjDataWebItem, idx: number) => adaptSingleItem(nested, idx)
        );
        component.props = {
          ...component.props,
          componentsData: nestedComponents,
        };
      }
      break;
  }
  
  return component;
}

/**
 * Convierte array completo de OBJDATAWEB a EmailComponent[]
 */
export function adaptObjDataWebArray(
  objDataWeb: ObjDataWebItem[]
): EmailComponent[] {
  return objDataWeb.map((item, index) => adaptSingleItem(item, index));
}

/**
 * Parsea string JSON de OBJDATAWEB y lo convierte a EmailComponent[]
 */
export function parseAndAdaptObjDataWeb(
  objDataWebString: string
): EmailComponent[] {
  try {
    const parsed = JSON.parse(objDataWebString);
    const dataArray = Array.isArray(parsed) ? parsed : [parsed];
    return adaptObjDataWebArray(dataArray);
  } catch (error) {
    console.error('Error parseando OBJDATAWEB:', error);
    return [];
  }
}

// =============================================================================
// PASO 4: FUNCIONES DE GENERACIÓN HTML
// =============================================================================

/**
 * Genera HTML de componentes desde OBJDATAWEB (sin template completo)
 */
export function generateHtmlFromObjDataWeb(
  objDataWeb: ObjDataWebItem[]
): string {
  // 1. Adaptar a EmailComponent[]
  const components = adaptObjDataWebArray(objDataWeb);
  
  // 2. Renderizar cada componente
  const htmlParts = components.map(component => {
    try {
      return renderComponentToHtml(component);
    } catch (error) {
      console.error(`Error renderizando componente ${component.id}:`, error);
      return `<!-- Error renderizando componente ${component.type} -->`;
    }
  });
  
  // 3. Unir todo
  return htmlParts.join('\n\n');
}

/**
 * Genera HTML de componentes desde string JSON de OBJDATAWEB
 */
export function generateHtmlFromObjDataWebString(
  objDataWebString: string
): string {
  const components = parseAndAdaptObjDataWeb(objDataWebString);
  return components
    .map(comp => renderComponentToHtml(comp))
    .join('\n\n');
}

/**
 * Genera Newsletter completo desde OBJDATAWEB
 */
export function generateNewsletterFromObjDataWeb(
  title: string,
  description: string,
  objDataWeb: ObjDataWebItem[],
  headerConfig?: HeaderConfig | null,
  footerConfig?: FooterConfig | null
): string {
  // 1. Generar HTML de componentes
  const componentsHtml = generateHtmlFromObjDataWeb(objDataWeb);
  
  // 2. Envolver en template completo
  return generateNewsletterTemplate(
    title,
    description,
    componentsHtml,
    headerConfig || null,
    footerConfig || null
  );
}

/**
 * Genera Newsletter completo desde string JSON de OBJDATAWEB
 */
export function generateNewsletterFromObjDataWebString(
  title: string,
  description: string,
  objDataWebString: string,
  headerConfig?: HeaderConfig | null,
  footerConfig?: FooterConfig | null
): string {
  const objDataWeb = JSON.parse(objDataWebString);
  const dataArray = Array.isArray(objDataWeb) ? objDataWeb : [objDataWeb];
  return generateNewsletterFromObjDataWeb(
    title,
    description,
    dataArray,
    headerConfig,
    footerConfig
  );
}

// =============================================================================
// PASO 5: EJEMPLOS DE USO
// =============================================================================

/**
 * EJEMPLO 1: Convertir un solo componente
 */
export function ejemplo1_ComponenteIndividual() {
  const objDataItem: ObjDataWebItem = {
    tipo: 'titulo',
    contenido: 'Bienvenido al Newsletter',
    nivel: 1,
    estilos: {
      color: '#1976d2',
      textAlign: 'center'
    }
  };
  
  const emailComponent = adaptSingleItem(objDataItem, 0);
  const html = renderComponentToHtml(emailComponent);
  
  console.log('HTML generado:', html);
  return html;
}

/**
 * EJEMPLO 2: Convertir array de componentes
 */
export function ejemplo2_ArrayDeComponentes() {
  const objDataWeb: ObjDataWebItem[] = [
    {
      tipo: 'categoria',
      contenido: 'Tecnología',
      configuracion: {
        color: '#e3f2fd',
        textColor: '#1976d2'
      }
    },
    {
      tipo: 'titulo',
      contenido: 'Nueva Funcionalidad',
      nivel: 2
    },
    {
      tipo: 'parrafo',
      contenido: 'Hemos lanzado una nueva funcionalidad que...'
    },
    {
      tipo: 'boton',
      contenido: 'Ver Más',
      configuracion: {
        url: 'https://example.com/feature',
        backgroundColor: '#1976d2',
        textColor: '#ffffff'
      }
    }
  ];
  
  const html = generateHtmlFromObjDataWeb(objDataWeb);
  
  console.log('HTML generado:', html);
  return html;
}

/**
 * EJEMPLO 3: Generar Newsletter completo
 */
export function ejemplo3_NewsletterCompleto() {
  const objDataWeb: ObjDataWebItem[] = [
    {
      tipo: 'titulo',
      contenido: 'Novedades de Enero',
      nivel: 1
    },
    {
      tipo: 'imagen-texto',
      contenido: '<p>Descripción del producto con <strong>texto en negrita</strong>.</p>',
      configuracion: {
        imageUrl: 'https://example.com/product.jpg',
        imageAlt: 'Producto XYZ',
        titleContent: '<p>Producto XYZ</p>',
        layout: 'image-left',
        imageWidth: 40,
        spacing: 20,
        borderRadius: 12,
        backgroundColor: '#f5f5f5'
      }
    },
    {
      tipo: 'dos-columnas',
      configuracion: {
        numberOfColumns: 2,
        layout: 'image-top',
        columns: [
          {
            imageUrl: 'https://example.com/col1.jpg',
            imageAlt: 'Columna 1',
            titleContent: '<p>Característica 1</p>',
            content: '<p>Descripción de la característica 1</p>'
          },
          {
            imageUrl: 'https://example.com/col2.jpg',
            imageAlt: 'Columna 2',
            titleContent: '<p>Característica 2</p>',
            content: '<p>Descripción de la característica 2</p>'
          }
        ]
      }
    }
  ];
  
  const headerConfig: HeaderConfig = {
    title: 'Newsletter Semanal',
    subtitle: 'Edición #42',
    backgroundColor: '#1976d2',
    textColor: '#ffffff',
    alignment: 'center',
    logo: 'https://example.com/logo.png',
    showLogo: true,
    logoHeight: 60
  };
  
  const footerConfig: FooterConfig = {
    companyName: 'Mi Empresa',
    address: 'Calle 123, Ciudad, País',
    backgroundColor: '#333333',
    textColor: '#ffffff',
    contactEmail: 'contact@example.com',
    showAddress: true,
    showSocial: true,
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/empresa', enabled: true },
      { platform: 'twitter', url: 'https://twitter.com/empresa', enabled: true },
      { platform: 'linkedin', url: 'https://linkedin.com/company/empresa', enabled: true }
    ]
  };
  
  const fullHtml = generateNewsletterFromObjDataWeb(
    'Newsletter Enero 2025',
    'Últimas novedades y actualizaciones',
    objDataWeb,
    headerConfig,
    footerConfig
  );
  
  console.log('Newsletter completo generado');
  return fullHtml;
}

/**
 * EJEMPLO 4: Desde string JSON (caso común en APIs)
 */
export function ejemplo4_DesdeJSON() {
  // Simula lo que podrías recibir de una API o BD
  const objDataWebJSON = `[
    {
      "tipo": "titulo",
      "contenido": "Título desde JSON",
      "nivel": 1
    },
    {
      "tipo": "parrafo",
      "contenido": "Párrafo desde JSON"
    }
  ]`;
  
  const html = generateHtmlFromObjDataWebString(objDataWebJSON);
  
  console.log('HTML desde JSON:', html);
  return html;
}

/**
 * EJEMPLO 5: Componente con categorías múltiples
 */
export function ejemplo5_CategoriasMultiples() {
  const objDataItem: ObjDataWebItem = {
    tipo: 'categoria',
    configuracion: {
      categorias: [
        { texto: 'IA', colorFondo: '#e3f2fd', colorTexto: '#1976d2' },
        { texto: 'Machine Learning', colorFondo: '#f3e5f5', colorTexto: '#8e24aa' },
        { texto: 'Python', colorFondo: '#e8f5e9', colorTexto: '#388e3c' }
      ]
    }
  };
  
  const emailComponent = adaptSingleItem(objDataItem, 0);
  const html = renderComponentToHtml(emailComponent);
  
  console.log('Categorías múltiples:', html);
  return html;
}

/**
 * EJEMPLO 6: Componente anidado (noteContainer)
 */
export function ejemplo6_ComponenteAnidado() {
  const objDataItem: ObjDataWebItem = {
    tipo: 'contenedor',
    configuracion: {
      noteTitle: 'Contenedor de Ejemplo',
      containerStyle: {
        border: '2px solid #1976d2',
        borderRadius: '16px',
        padding: '24px',
        backgroundColor: '#f5f5f5'
      },
      componentes: [
        {
          tipo: 'titulo',
          contenido: 'Título dentro del contenedor',
          nivel: 3
        },
        {
          tipo: 'parrafo',
          contenido: 'Este párrafo está dentro del contenedor'
        },
        {
          tipo: 'boton',
          contenido: 'Acción',
          configuracion: {
            url: 'https://example.com',
            backgroundColor: '#1976d2',
            textColor: '#ffffff'
          }
        }
      ]
    }
  };
  
  const emailComponent = adaptSingleItem(objDataItem, 0);
  const html = renderComponentToHtml(emailComponent);
  
  console.log('Contenedor anidado:', html);
  return html;
}

// =============================================================================
// PASO 6: HELPER PARA DEBUGGING
// =============================================================================

/**
 * Imprime la estructura de un EmailComponent para debugging
 */
export function debugEmailComponent(component: EmailComponent): void {
  console.log('=== EmailComponent Debug ===');
  console.log('ID:', component.id);
  console.log('Type:', component.type);
  console.log('Content:', component.content?.substring(0, 100) + '...');
  console.log('Props:', JSON.stringify(component.props, null, 2));
  console.log('Style:', JSON.stringify(component.style, null, 2));
  console.log('===========================');
}

/**
 * Valida que un componente tenga las propiedades mínimas requeridas
 */
export function validateEmailComponent(component: EmailComponent): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!component.id) {
    errors.push('Falta propiedad: id');
  }
  
  if (!component.type) {
    errors.push('Falta propiedad: type');
  }
  
  // Validaciones específicas por tipo
  switch (component.type) {
    case 'image':
      if (!component.props?.src) {
        errors.push('Imagen requiere props.src');
      }
      break;
      
    case 'button':
      if (!component.props?.url) {
        errors.push('Botón requiere props.url');
      }
      break;
      
    case 'imageText':
      if (!component.props?.imageUrl) {
        errors.push('ImageText requiere props.imageUrl');
      }
      if (!component.props?.titleContent) {
        errors.push('ImageText requiere props.titleContent');
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// =============================================================================
// EXPORTACIONES
// =============================================================================

export default {
  // Funciones principales
  adaptSingleItem,
  adaptObjDataWebArray,
  parseAndAdaptObjDataWeb,
  generateHtmlFromObjDataWeb,
  generateHtmlFromObjDataWebString,
  generateNewsletterFromObjDataWeb,
  generateNewsletterFromObjDataWebString,
  
  // Helpers
  debugEmailComponent,
  validateEmailComponent,
  
  // Ejemplos
  ejemplos: {
    ejemplo1_ComponenteIndividual,
    ejemplo2_ArrayDeComponentes,
    ejemplo3_NewsletterCompleto,
    ejemplo4_DesdeJSON,
    ejemplo5_CategoriasMultiples,
    ejemplo6_ComponenteAnidado,
  }
};

