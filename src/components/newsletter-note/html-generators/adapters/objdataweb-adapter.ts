/* eslint-disable default-case */
/**
 * Adaptador OBJDATAWEB → EmailComponent
 * Convierte el formato OBJDATAWEB a EmailComponent para generar HTML
 */

import { renderComponentToHtml } from '../index';
import { generateNewsletterTemplate } from '../templates/newsletter.template';
import { generateSingleNoteTemplate } from '../templates/single-note.template';

import type { HeaderConfig, FooterConfig, EmailComponent } from '../types';

/**
 * Mapeo de tipos OBJDATAWEB → EmailComponent
 */
const TYPE_MAPPING: Record<string, string> = {
  // Componentes básicos
  titulo: 'heading',
  parrafo: 'paragraph',
  texto: 'paragraph',
  lista: 'bulletList',
  divisor: 'divider',
  linea: 'divider',
  imagen: 'image',
  espaciador: 'spacer',

  // Componentes de contenido
  boton: 'button',
  categoria: 'category',
  tag: 'category',
  resumen: 'summary',
  autor: 'author',
  galeria: 'gallery',

  // Componentes complejos
  'imagen-texto': 'imageText',
  'texto-imagen': 'imageText',
  'titulo-icono': 'tituloConIcono',
  'texto-icono': 'textWithIcon',
  columnas: 'twoColumns',
  'dos-columnas': 'twoColumns',
  herramientas: 'herramientas',
  respaldado: 'respaldadoPor',

  // Contenedores
  contenedor: 'noteContainer',
  caja: 'noteContainer',

  // Estructurales
  header: 'newsletterHeaderReusable',
  footer: 'newsletterFooterReusable',
};

/**
 * Convierte un item OBJDATAWEB a EmailComponent
 */
export function adaptObjDataWebItem(item: any, index: number): EmailComponent {
  // Mapear el tipo
  const mappedType = TYPE_MAPPING[item.type] || item.type;

  // Crear componente base
  const component: EmailComponent = {
    id: item.id || `component-${index}`,
    type: mappedType,
    content: item.content || '',
    props: { ...(item.props || {}) },
    style: { ...(item.style || {}) },
  };

  // Transformaciones específicas por tipo si es necesario
  switch (mappedType) {
    case 'noteContainer':
      // Si tiene componentes anidados, adaptarlos recursivamente
      if (item.props?.componentsData) {
        component.props = {
          ...component.props,
          componentsData: item.props.componentsData.map((nested: any, idx: number) =>
            adaptObjDataWebItem(nested, idx)
          ),
        };
      }
      break;
  }

  return component;
}

/**
 * Convierte array de OBJDATAWEB a EmailComponent[]
 */
export function adaptObjDataWebArray(objDataWeb: any[]): EmailComponent[] {
  return objDataWeb.map((item, index) => adaptObjDataWebItem(item, index));
}

/**
 * Parsea string JSON de OBJDATAWEB y lo convierte a EmailComponent[]
 */
export function parseAndAdaptObjDataWeb(objDataWebString: string): EmailComponent[] {
  try {
    const parsed = JSON.parse(objDataWebString);
    const dataArray = Array.isArray(parsed) ? parsed : [parsed];
    return adaptObjDataWebArray(dataArray);
  } catch (error) {
    console.error('Error parseando OBJDATAWEB:', error);
    return [];
  }
}

/**
 * Genera HTML de componentes desde OBJDATAWEB (sin template completo)
 */
export function generateHtmlFromObjDataWeb(objDataWeb: any[]): string {
  // 1. Adaptar a EmailComponent[]
  const components = adaptObjDataWebArray(objDataWeb);

  // 2. Renderizar cada componente
  const htmlParts = components.map((component) => {
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
export function generateHtmlFromObjDataWebString(objDataWebString: string): string {
  const components = parseAndAdaptObjDataWeb(objDataWebString);
  return components.map((comp) => renderComponentToHtml(comp)).join('\n\n');
}

/**
 * ⭐ FUNCIÓN PRINCIPAL: Genera Newsletter completo desde OBJDATAWEB
 */
export function generateNewsletterFromObjDataWeb(
  title: string,
  description: string,
  objDataWeb: any[],
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

/**
 * Genera nota individual desde OBJDATAWEB
 */
export function generateSingleNoteFromObjDataWeb(
  noteTitle: string,
  noteDescription: string,
  objDataWeb: any[],
  containerConfig?: {
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    padding?: number;
    maxWidth?: number;
  }
): string {
  const componentsHtml = generateHtmlFromObjDataWeb(objDataWeb);
  return generateSingleNoteTemplate(noteTitle, noteDescription, componentsHtml, containerConfig);
}
