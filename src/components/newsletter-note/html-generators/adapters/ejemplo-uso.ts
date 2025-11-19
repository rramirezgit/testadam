/**
 * EJEMPLOS DE USO: generateNewsletterFromObjDataWeb
 *
 * Este archivo muestra cómo usar la función para generar newsletters
 * desde tu OBJDATAWEB existente
 */

import { generateNewsletterFromObjDataWeb } from './objdataweb-adapter';

import type { HeaderConfig, FooterConfig } from '../types';

// =============================================================================
// EJEMPLO 1: Newsletter Básico
// =============================================================================

export function ejemplo1_NewsletterBasico() {
  // Tu OBJDATAWEB existente
  const objDataWeb = [
    {
      id: '1',
      type: 'heading',
      content: 'Bienvenido al Newsletter',
      props: { level: 1 },
      style: { color: '#1976d2', textAlign: 'center' },
    },
    {
      id: '2',
      type: 'paragraph',
      content: 'Este es el contenido del newsletter de esta semana.',
    },
    {
      id: '3',
      type: 'button',
      content: 'Leer Más',
      props: {
        url: 'https://example.com',
        backgroundColor: '#1976d2',
        textColor: '#ffffff',
      },
    },
  ];

  // Generar HTML
  const html = generateNewsletterFromObjDataWeb('Newsletter Semanal', 'Edición #42', objDataWeb);

  console.log('Newsletter generado!');
  return html;
}

// =============================================================================
// EJEMPLO 2: Newsletter con Header y Footer
// =============================================================================

export function ejemplo2_NewsletterCompleto() {
  const objDataWeb = [
    {
      id: '1',
      type: 'category',
      content: 'Tecnología',
      props: {
        color: '#e3f2fd',
        textColor: '#1976d2',
      },
    },
    {
      id: '2',
      type: 'heading',
      content: 'Nueva Actualización',
      props: { level: 2 },
    },
    {
      id: '3',
      type: 'imageText',
      content: '<p>Descripción de la actualización con <strong>novedades importantes</strong>.</p>',
      props: {
        imageUrl: 'https://example.com/imagen.jpg',
        imageAlt: 'Actualización',
        titleContent: '<p>Funcionalidad Premium</p>',
        layout: 'image-left',
        imageWidth: 40,
      },
    },
  ];

  // Header config
  const headerConfig: HeaderConfig = {
    title: 'Tech Weekly',
    subtitle: 'Lo mejor de la semana en tecnología',
    backgroundColor: '#1976d2',
    textColor: '#ffffff',
    alignment: 'center',
    logo: 'https://example.com/logo.png',
    showLogo: true,
    logoHeight: 60,
  };

  // Footer config
  const footerConfig: FooterConfig = {
    companyName: 'Mi Empresa Tech',
    address: 'Calle 123, Ciudad, País',
    backgroundColor: '#333333',
    textColor: '#ffffff',
    contactEmail: 'contacto@example.com',
    showAddress: true,
    showSocial: true,
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/miempresa', enabled: true },
      { platform: 'twitter', url: 'https://twitter.com/miempresa', enabled: true },
      { platform: 'linkedin', url: 'https://linkedin.com/company/miempresa', enabled: true },
    ],
  };

  const html = generateNewsletterFromObjDataWeb(
    'Newsletter Tech Weekly',
    'Edición #42 - Enero 2025',
    objDataWeb,
    headerConfig,
    footerConfig
  );

  return html;
}

// =============================================================================
// EJEMPLO 3: Newsletter con Componentes Complejos
// =============================================================================

export function ejemplo3_ComponentesComplejos() {
  const objDataWeb = [
    {
      id: '1',
      type: 'tituloConIcono',
      content: 'Nuevas Funcionalidades',
      props: {
        icon: 'rocket',
        textColor: '#00C3C3',
        iconSize: 32,
        fontSize: '24px',
      },
    },
    {
      id: '2',
      type: 'twoColumns',
      props: {
        numberOfColumns: 2,
        layout: 'image-top',
        columns: [
          {
            imageUrl: 'https://example.com/feature1.jpg',
            imageAlt: 'Feature 1',
            titleContent: '<p>Característica 1</p>',
            content: '<p>Descripción de la primera característica.</p>',
          },
          {
            imageUrl: 'https://example.com/feature2.jpg',
            imageAlt: 'Feature 2',
            titleContent: '<p>Característica 2</p>',
            content: '<p>Descripción de la segunda característica.</p>',
          },
        ],
      },
    },
    {
      id: '3',
      type: 'divider',
    },
    {
      id: '4',
      type: 'summary',
      content: 'Recuerda que puedes contactarnos en cualquier momento.',
      props: {
        type: 'tip',
      },
    },
  ];

  const html = generateNewsletterFromObjDataWeb(
    'Newsletter de Features',
    'Nuevas funcionalidades disponibles',
    objDataWeb
  );

  return html;
}

// =============================================================================
// EJEMPLO 4: Desde JSON String (caso real con BD/API)
// =============================================================================

export function ejemplo4_DesdeJSONString() {
  // Simula lo que recibirías de una base de datos
  const objDataWebJSON = `[
    {
      "id": "1",
      "type": "heading",
      "content": "Newsletter desde JSON",
      "props": { "level": 1 }
    },
    {
      "id": "2",
      "type": "paragraph",
      "content": "Este contenido viene de un string JSON."
    },
    {
      "id": "3",
      "type": "button",
      "content": "Ver Más",
      "props": {
        "url": "https://example.com",
        "backgroundColor": "#1976d2",
        "textColor": "#ffffff"
      }
    }
  ]`;

  // Parsear y generar
  const objDataWeb = JSON.parse(objDataWebJSON);

  const html = generateNewsletterFromObjDataWeb(
    'Newsletter desde BD',
    'Cargado dinámicamente',
    objDataWeb
  );

  return html;
}

// =============================================================================
// EJEMPLO 5: Uso Real - Integración con tu sistema
// =============================================================================

/**
 * Ejemplo de cómo integrar con tu sistema existente
 */
export async function ejemplo5_IntegracionReal(newsletterId: string) {
  // 1. Obtener datos de tu BD/API
  const newsletterData = await fetchNewsletterData(newsletterId);

  // 2. Parsear el OBJDATAWEB
  const objDataWeb = JSON.parse(newsletterData.objDataWeb);

  // 3. Preparar header y footer
  const headerConfig: HeaderConfig = {
    title: newsletterData.title,
    subtitle: newsletterData.subtitle,
    backgroundColor: newsletterData.headerBgColor || '#1976d2',
    textColor: '#ffffff',
    alignment: 'center',
    logo: newsletterData.logoUrl,
    showLogo: true,
  };

  const footerConfig: FooterConfig = {
    companyName: 'Mi Empresa',
    backgroundColor: '#333333',
    textColor: '#ffffff',
    contactEmail: 'contacto@example.com',
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/...', enabled: true },
      { platform: 'twitter', url: 'https://twitter.com/...', enabled: true },
    ],
  };

  // 4. Generar HTML final
  const html = generateNewsletterFromObjDataWeb(
    newsletterData.title,
    newsletterData.description,
    objDataWeb,
    headerConfig,
    footerConfig
  );

  // 5. Usar el HTML (enviar email, guardar, preview, etc.)
  return html;
}

// Función mock para el ejemplo
async function fetchNewsletterData(id: string) {
  return {
    title: 'Newsletter Semanal',
    subtitle: 'Edición #42',
    description: 'Lo mejor de la semana',
    headerBgColor: '#1976d2',
    logoUrl: 'https://example.com/logo.png',
    objDataWeb: JSON.stringify([
      {
        id: '1',
        type: 'heading',
        content: 'Contenido del Newsletter',
        props: { level: 1 },
      },
    ]),
  };
}

// =============================================================================
// EXPORTAR TODOS LOS EJEMPLOS
// =============================================================================

export default {
  ejemplo1_NewsletterBasico,
  ejemplo2_NewsletterCompleto,
  ejemplo3_ComponentesComplejos,
  ejemplo4_DesdeJSONString,
  ejemplo5_IntegracionReal,
};
