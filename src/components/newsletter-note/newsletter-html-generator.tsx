'use client';

import type { NewsletterNote } from 'src/types/newsletter';
import type { EmailComponent } from 'src/types/saved-note';

/**
 * Generador de HTML unificado para newsletters
 *
 * Garantiza que el HTML generado sea consistente con
 * lo que se ve en el editor y en el preview.
 */

interface HeaderConfig {
  title: string;
  subtitle?: string;
  logo?: string;
  bannerImage?: string;
  backgroundColor: string;
  textColor: string;
  alignment: string;
  useGradient?: boolean;
  gradientColors?: string[];
  gradientDirection?: number;
  sponsor?: {
    enabled: boolean;
    label?: string;
    image?: string;
    imageAlt?: string;
  };
}

interface FooterConfig {
  companyName: string;
  address?: string;
  contactEmail?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
  unsubscribeLink?: string;
  backgroundColor: string;
  textColor: string;
  useGradient?: boolean;
  gradientColors?: string[];
  gradientDirection?: number;
}

export function generateNewsletterHtml(
  title: string,
  description: string,
  selectedNotes: NewsletterNote[],
  header: HeaderConfig,
  footer: FooterConfig
): string {
  // Header background style
  let headerBackgroundStyle = `background-color: ${header.backgroundColor};`;
  if (header.useGradient && header.gradientColors && header.gradientColors.length >= 2) {
    headerBackgroundStyle = `background: linear-gradient(${header.gradientDirection || 180}deg, ${header.gradientColors[0]}, ${header.gradientColors[1]});`;
  }

  // Footer background style
  let footerBackgroundStyle = `background-color: ${footer.backgroundColor};`;
  if (footer.useGradient && footer.gradientColors && footer.gradientColors.length >= 2) {
    footerBackgroundStyle = `background: linear-gradient(${footer.gradientDirection || 180}deg, ${footer.gradientColors[0]}, ${footer.gradientColors[1]});`;
  }

  let html = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title || 'Newsletter'}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    
    /* Base styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
    }
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    /* Header */
    .email-header {
      ${headerBackgroundStyle}
      color: ${header.textColor};
      text-align: ${header.alignment};
      padding: 40px 30px;
      border-radius: 0px 0px 4px 4px;
      margin-bottom: 24px;
    }
    
    .header-title {
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px 0;
      line-height: 1.2;
      letter-spacing: -0.5px;
    }
    
    .header-subtitle {
      font-size: 18px;
      margin: 0;
      opacity: 0.85;
      font-weight: 400;
    }
    
    /* Content */
    .email-content {
      padding: 0 30px;
    }
    
    .newsletter-description {
      padding: 30px 0;
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 40px;
    }
    
    .newsletter-description p {
      font-size: 18px;
      color: #6b7280;
      margin: 0;
      line-height: 1.5;
    }
    
    /* Notes - Clean design without borders */
    .note-section {
      margin-bottom: 24px;
    }
    
    .note-section:last-child {
      margin-bottom: 40px;
    }
    
    .note-title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 20px 0;
      line-height: 1.3;
      letter-spacing: -0.25px;
    }
    
    /* Components - Minimal design */
    /* ⚡ NUEVO: Títulos como párrafos - sin márgenes nativos */
    .component-heading {
      font-weight: 600;
      margin: 0 !important; /* Sin márgenes nativos porque son <p> */
      line-height: 1.3;
      color: #111827;
      letter-spacing: -0.25px;
      display: block; /* Comportamiento de bloque como los headers */
    }
    /* Los tamaños de fuente se aplican inline según el nivel */
    
    /* ⚡ CRITICAL: Párrafos sin márgenes nativos para respetar configuración personalizada */
    .component-paragraph {
      margin: 0 !important; /* Resetear márgenes nativos */
      line-height: 1.7;
      font-size: 16px;
      color: #374151;
    }
    
    .component-summary {
      background-color: #f8fafc;
      border-left: 3px solid #3b82f6;
      padding: 20px 24px;
      margin: 25px 0;
      border-radius: 0 6px 6px 0;
    }
    
    .component-bulletlist {
      margin: 20px 0;
      padding-left: 24px;
    }
    
    .component-bulletlist li {
      margin: 10px 0;
      line-height: 1.6;
      color: #374151;
    }
    
    .component-divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 40px 0;
      height: 1px;
    }
    
    .component-image {
      text-align: center;
      margin: 30px 0;
    }
    
    .component-image img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
      margin: 0 auto;
    }
    
    .component-button {
      text-align: center;
      margin: 30px 0;
    }
    
    .component-button a {
      display: inline-block;
      padding: 14px 28px;
      background-color: #3b82f6;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    
    .component-category {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 500;
      margin: 3px 6px 3px 0;
      text-decoration: none;
    }
    
    .component-titulo-icono {
      margin: 30px 0;
    }
    
    .titulo-icono-bar {
      border-radius: 8px;
    }
    
    .titulo-icono-content {
      padding: 16px 20px;
    }
    
    .titulo-icono-icon {
      display: inline-block;
      margin-right: 10px;
      font-size: 20px;
      vertical-align: middle;
    }
    
    .titulo-icono-text {
      font-size: 18px;
      font-weight: 600;
      vertical-align: middle;
    }
    
    /* Footer */
    .email-footer {
      ${footerBackgroundStyle}
      color: ${footer.textColor};
      text-align: center;
      padding: 40px 30px;
      margin-top: 50px;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-company {
      font-weight: 600;
      margin-bottom: 12px;
      font-size: 16px;
    }
    
    .footer-address {
      margin: 8px 0;
      opacity: 0.75;
      font-size: 14px;
    }
    
    .footer-links {
      margin: 20px 0;
    }
    
    .footer-links a {
      color: ${footer.textColor} !important;
      text-decoration: none;
      margin: 0 12px;
      font-size: 14px;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
    }
    
    .footer-unsubscribe {
      margin-top: 25px;
      font-size: 12px;
      opacity: 0.6;
    }
    
    .footer-unsubscribe a {
      color: ${footer.textColor} !important;
      text-decoration: none;
    }
    
    .footer-unsubscribe a:hover {
      text-decoration: underline;
    }
    
    /* Responsive */
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-header { padding: 30px 20px !important; }
      .email-content { padding: 0 20px !important; }
      .email-footer { padding: 30px 20px !important; }
      .newsletter-description { padding: 20px 0 !important; }
      .header-title { font-size: 28px !important; }
      .note-title { font-size: 22px !important; }
      .component-heading.h1 { font-size: 24px !important; }
      .component-heading.h2 { font-size: 22px !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" >
    <tr>
      <td>
        <div class="email-container">
          <!-- Header -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
            <tr>
              <td class="email-header">
                ${header.logo ? `<img src="${header.logo}" alt="Logo" style="max-height: 60px; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">` : ''}
                ${
                  header.sponsor && header.sponsor.enabled
                    ? `<div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 10px;">
                  <span style="font-size: 16px; color: #333; margin-bottom: 4px;">${header.sponsor.label || 'Juntos con'}</span>
                  <img src="${header.sponsor.image || ''}" alt="${header.sponsor.imageAlt || 'Sponsor'}" style="max-height: 48px; display: block;" />
                </div>`
                    : ''
                }
                ${header.title || title ? `<p class="header-title">${header.title || title || ''}</p>` : ''}
                ${header.subtitle ? `<p class="header-subtitle">${header.subtitle}</p>` : ''}
                ${header.bannerImage ? `<img src="${header.bannerImage}" alt="Banner" style="width: 100%; margin-top: 20px; border-radius: 8px;">` : ''}
              </td>
            </tr>
          </table>
          
          <!-- Content -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td class="email-content">
               `;

  // Add each note's content using clean design
  selectedNotes.forEach((newsletterNote, noteIndex) => {
    const note = newsletterNote.noteData;
    html += `<div class="note-section">`;

    // Añadir el contenedor interno con borde personalizable
    const containerBorderWidth = note.containerBorderWidth ?? 1;
    const containerBorderColor = note.containerBorderColor ?? '#e0e0e0';
    const containerBorderRadius = note.containerBorderRadius ?? 12;
    const containerPadding = note.containerPadding ?? 10;
    const containerMaxWidth = note.containerMaxWidth ?? 560;

    html += `<div style="max-width: ${containerMaxWidth}px; margin: 0 auto; padding: ${containerPadding}px; border-radius: ${containerBorderRadius}px; border: ${containerBorderWidth}px solid ${containerBorderColor};">`;
    // html += `<p class="note-title">${note.title || 'Untitled Note'}</p>`;

    // Render each component using the unified system
    const objData = JSON.parse(note.objData);
    objData.forEach((component: any) => {
      html += renderComponentToHtml(component);
    });

    html += `</div>`; // Cerrar contenedor interno
    html += `</div>`;
  });

  html += `              </td>
            </tr>
          </table>
          
          <!-- Footer -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td class="email-footer">
                <p class="footer-company">${footer.companyName}</p>
                ${footer.address ? `<p class="footer-address">${footer.address}</p>` : ''}
                ${footer.contactEmail ? `<p style="margin: 12px 0; font-size: 14px;">Contacto: <a href="mailto:${footer.contactEmail}" style="color: ${footer.textColor} !important; text-decoration: none;">${footer.contactEmail}</a></p>` : ''}
                <div class="footer-links">
                  ${
                    footer.socialLinks
                      ?.map(
                        (link) =>
                          `<a href="${link.url}">${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</a>`
                      )
                      .join(' • ') || ''
                  }
                </div>
                <div class="footer-unsubscribe">
                  <a href="${footer.unsubscribeLink || '#'}">Cancelar suscripción</a> • 
                  <a href="#">Ver en navegador</a>
                </div>
                <p style="margin: 20px 0 0 0; font-size: 12px; opacity: 0.6;">© ${new Date().getFullYear()} ${footer.companyName}. Todos los derechos reservados.</p>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return html;
}

/**
 * Renderiza un componente individual a HTML
 * Mantiene consistencia con el renderizador visual
 * Optimizado para máxima compatibilidad con clientes de correo
 */
function renderComponentToHtml(component: EmailComponent): string {
  switch (component.type) {
    case 'heading':
      const headingClass = `component-heading`;

      // ⚡ NUEVO: Tamaño fijo para todos los títulos como <p>
      let headingInlineStyles = `font-weight: bold; line-height: 1.3; color: #333333; font-size: 1.5rem;`;

      if (component.style) {
        const customStyles = Object.entries(component.style)
          .map(([key, value]) => {
            // Convertir camelCase a kebab-case para CSS
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
          })
          .join('; ');
        headingInlineStyles += ' ' + customStyles;
      } else {
        // Valores por defecto si no hay estilos personalizados
        headingInlineStyles += ' margin-top: 16px; margin-bottom: 16px;';
      }

      // ⚡ NUEVO: Usar <p> en lugar de <h1>, <h2>, etc.
      return `<p class="${headingClass}" style="${headingInlineStyles}">${component.content}</p>`;

    case 'paragraph':
      // ⚡ CRITICAL: Aplicar estilos personalizados de espaciado respetando configuración del usuario
      let paragraphInlineStyles = 'line-height: 1.6; font-size: 16px;';
      if (component.style) {
        const customStyles = Object.entries(component.style)
          .map(([key, value]) => {
            // Convertir camelCase a kebab-case para CSS
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
          })
          .join('; ');
        paragraphInlineStyles += ' ' + customStyles;
      } else {
        // Valores por defecto para párrafos: solo margen superior
        paragraphInlineStyles += ' margin-top: 16px; margin-bottom: 0px;';
      }

      return `<div class="component-paragraph" style="${paragraphInlineStyles}">${component.content}</div>`;

    case 'bulletList':
      const items = component.props?.items || [];
      let listHtml =
        '<ul class="component-bulletlist" style="margin: 15px 0; padding-left: 30px;">';
      items.forEach((item: string) => {
        listHtml += `<li style="margin: 8px 0; line-height: 1.5;">${escapeHtml(item)}</li>`;
      });
      listHtml += '</ul>';
      return listHtml;

    case 'divider':
      return '<hr class="component-divider" style="border: none; border-top: 2px solid #e0e0e0; margin: 30px 0; height: 1px;">';

    case 'image':
      const src = component.props?.src || '/placeholder.svg';
      const alt = component.props?.alt || 'Image';
      return `<div class="component-image" style="text-align: center; margin: 25px 0;">
        <img src="${src}" alt="${escapeHtml(alt)}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto;">
      </div>`;

    case 'button':
      const buttonText = component.content || 'Button';
      const buttonUrl = component.props?.url || '#';
      return `<div class="component-button" style="text-align: center; margin: 25px 0;">
        <a href="${buttonUrl}" style="display: inline-block; padding: 15px 30px; background-color: #1976d2; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${escapeHtml(buttonText)}</a>
      </div>`;

    case 'category':
      // Verificar si hay múltiples categorías o una sola
      if (component.props?.categorias && Array.isArray(component.props.categorias)) {
        // Renderizar múltiples categorías con sus colores personalizados
        const borderRadius = component.props?.borderRadius || 16;
        const padding = component.props?.padding || 4;
        const fontSize = component.props?.fontSize || 14;
        const fontWeight = component.props?.fontWeight || 'bold';

        let categoriasHtml = '<div class="component-category-group" style="margin: 15px 0;">';
        component.props.categorias.forEach((categoria: any) => {
          categoriasHtml += `<span class="component-category" style="
            display: inline-block;
            background-color: ${categoria.colorFondo || '#e3f2fd'};
            color: ${categoria.colorTexto || '#1976d2'};
            padding-top: ${padding}px;
            padding-bottom: ${padding}px;
            padding-left: ${padding * 2}px;
            padding-right: ${padding * 2}px;
            border-radius: ${borderRadius}px;
            font-size: ${fontSize}px;
            font-weight: ${fontWeight};
            margin: 0 6px 6px 0;
            text-decoration: none;
            line-height: 1.2;
            vertical-align: top;
          ">${escapeHtml(categoria.texto)}</span>`;
        });
        categoriasHtml += '</div>';
        return categoriasHtml;
      } else {
        // Renderizar categoría única (legacy) - también usar las propiedades configurables
        const backgroundColor = component.props?.color || component.props?.colorFondo || '#e3f2fd';
        const textColor = component.props?.textColor || component.props?.colorTexto || '#1976d2';
        const borderRadius = component.props?.borderRadius || 16;
        const padding = component.props?.padding || 4;
        const fontSize = component.props?.fontSize || 14;
        const fontWeight = component.props?.fontWeight || 'bold';

        return `<div class="component-category-group" style="margin: 15px 0;">
          <span class="component-category" style="
            display: inline-block;
            background-color: ${backgroundColor};
            color: ${textColor};
            padding-top: ${padding}px;
            padding-bottom: ${padding}px;
            padding-left: ${padding * 2}px;
            padding-right: ${padding * 2}px;
            border-radius: ${borderRadius}px;
            font-size: ${fontSize}px;
            font-weight: ${fontWeight};
            margin: 0 6px 6px 0;
            text-decoration: none;
            line-height: 1.2;
            vertical-align: top;
          ">${escapeHtml(component.content)}</span>
        </div>`;
      }

    case 'summary':
      // Obtener configuración del tipo de summary (exactamente igual que SummaryComponent)
      const summaryType = component.props?.summaryType || 'resumen';
      const SUMMARY_TYPES = {
        resumen: {
          label: 'Resumen',
          icon: 'mdi:note-text-outline',
          backgroundColor: '#f8f9fa',
          iconColor: '#6c757d',
          textColor: '#495057',
        },
        concepto: {
          label: 'Concepto',
          icon: 'mdi:lightbulb-outline',
          backgroundColor: '#e7f3ff',
          iconColor: '#0066cc',
          textColor: '#003d7a',
        },
        dato: {
          label: 'Dato',
          icon: 'mdi:lightbulb-on',
          backgroundColor: '#fff8e1',
          iconColor: '#f57c00',
          textColor: '#e65100',
        },
        tip: {
          label: 'TIP',
          icon: 'mdi:rocket-launch',
          backgroundColor: '#f3e5f5',
          iconColor: '#8e24aa',
          textColor: '#4a148c',
        },
        analogia: {
          label: 'Analogía',
          icon: 'mdi:brain',
          backgroundColor: '#e8f5e8',
          iconColor: '#388e3c',
          textColor: '#1b5e20',
        },
      };

      const typeConfig = SUMMARY_TYPES[summaryType] || SUMMARY_TYPES.resumen;
      // Usar valores personalizados o por defecto (igual que SummaryComponent)
      const summaryBgColor = component.props?.backgroundColor || typeConfig.backgroundColor;
      const summaryIconColor = component.props?.iconColor || typeConfig.iconColor;
      const summaryTextColor = component.props?.textColor || typeConfig.textColor;
      const summaryIcon = component.props?.icon || typeConfig.icon;
      const summaryLabel = component.props?.label || typeConfig.label;

      // ⚡ MEJORADO: Usar URL directa del PNG (compatible con emails)
      let iconUrl = '';

      // Si el icono ya es una URL completa (PNG de Icons8), usarla directamente
      if (summaryIcon.startsWith('http')) {
        iconUrl = summaryIcon;
      }
      // Fallback para iconos legacy (convertir a Icons8 PNG)
      else if (summaryIcon.includes(':')) {
        // Extraer el nombre del icono de formato collection:name
        const iconName = summaryIcon.split(':')[1] || summaryIcon.split(':')[0];
        iconUrl = `https://img.icons8.com/color/48/${iconName}.png`;
      }
      // Si es solo un nombre de icono, usar Icons8 PNG
      else {
        iconUrl = `https://img.icons8.com/color/48/${summaryIcon}.png`;
      }

      // ⚡ NUEVO: HTML que coincide EXACTAMENTE con SummaryComponent
      return `<div style="position: relative; width: 100%; margin: 25px 0;">
        <div style="
          background-color: ${summaryBgColor};
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.08);
          overflow: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        ">
          <!-- Header idéntico al SummaryComponent -->
          <div style="
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px 12px 20px;
            border-bottom: 1px solid rgba(0,0,0,0.05);
          ">
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background-color: rgba(255,255,255,0.7);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              border: 1px solid rgba(255,255,255,0.3);
            ">
              <img src="${iconUrl}" width="18" height="18" alt="${summaryLabel}" style="display: block; max-width: 18px; max-height: 18px;">
            </div>
            <span style="
              color: ${summaryTextColor};
              font-weight: 600;
              font-size: 16px;
              letter-spacing: -0.01em;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            ">${summaryLabel}</span>
          </div>
          
          <!-- Contenido idéntico al SummaryComponent -->
          <div style="padding: 16px 20px 20px 20px;">
            <div style="
              color: #6c757d;
              font-size: 15px;
              line-height: 1.6;
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            ">${component.content}</div>
          </div>
        </div>
      </div>`;

    case 'author':
      const authorName = component.props?.name || component.content;
      const authorEmail = component.props?.email || '';
      return `<div class="component-author" style="margin: 15px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
        <strong style="font-size: 16px; color: #333333;">${escapeHtml(authorName)}</strong>
        ${authorEmail ? `<br><a href="mailto:${authorEmail}" style="color: #1976d2; text-decoration: none; font-size: 14px;">${escapeHtml(authorEmail)}</a>` : ''}
      </div>`;

    case 'spacer':
      const height = component.props?.height || 20;
      return `<div style="height: ${height}px; line-height: ${height}px; font-size: 1px;">&nbsp;</div>`;

    case 'gallery':
      const images = component.props?.images || [];
      const spacing = component.props?.spacing || 8;
      const borderRadius = component.props?.borderRadius || 8;

      // Asegurar que siempre tengamos exactamente 4 imágenes para la cuadrícula 2x2
      const galleryImages = Array.from(
        { length: 4 },
        (_, idx) => images[idx] || { src: '', alt: `Imagen ${idx + 1}` }
      );

      let galleryHtml = '<div class="component-gallery" style="margin: 25px 0;">';
      galleryHtml += `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">`;

      // Primera fila (imágenes 1 y 2)
      galleryHtml += '<tr>';
      galleryHtml += `<td style="text-align: center; vertical-align: top; width: 50%; padding: ${spacing}px;">`;
      if (galleryImages[0].src) {
        galleryHtml += `<img src="${galleryImages[0].src}" alt="${escapeHtml(galleryImages[0].alt || '')}" style="width: 100%; max-width: 200px; height: 150px; object-fit: cover; border-radius: ${borderRadius}px; display: block; margin: 0 auto;">`;
      } else {
        galleryHtml += `<div style="width: 100%; max-width: 200px; height: 150px; background-color: #f5f5f5; border-radius: ${borderRadius}px; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 1px solid #e0e0e0;">
          <span style="color: #9e9e9e; font-size: 14px;">${escapeHtml(galleryImages[0].alt)}</span>
        </div>`;
      }
      galleryHtml += '</td>';

      galleryHtml += `<td style="text-align: center; vertical-align: top; width: 50%; padding: ${spacing}px;">`;
      if (galleryImages[1].src) {
        galleryHtml += `<img src="${galleryImages[1].src}" alt="${escapeHtml(galleryImages[1].alt || '')}" style="width: 100%; max-width: 200px; height: 150px; object-fit: cover; border-radius: ${borderRadius}px; display: block; margin: 0 auto;">`;
      } else {
        galleryHtml += `<div style="width: 100%; max-width: 200px; height: 150px; background-color: #f5f5f5; border-radius: ${borderRadius}px; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 1px solid #e0e0e0;">
          <span style="color: #9e9e9e; font-size: 14px;">${escapeHtml(galleryImages[1].alt)}</span>
        </div>`;
      }
      galleryHtml += '</td>';
      galleryHtml += '</tr>';

      // Segunda fila (imágenes 3 y 4)
      galleryHtml += '<tr>';
      galleryHtml += `<td style="text-align: center; vertical-align: top; width: 50%; padding: ${spacing}px;">`;
      if (galleryImages[2].src) {
        galleryHtml += `<img src="${galleryImages[2].src}" alt="${escapeHtml(galleryImages[2].alt || '')}" style="width: 100%; max-width: 200px; height: 150px; object-fit: cover; border-radius: ${borderRadius}px; display: block; margin: 0 auto;">`;
      } else {
        galleryHtml += `<div style="width: 100%; max-width: 200px; height: 150px; background-color: #f5f5f5; border-radius: ${borderRadius}px; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 1px solid #e0e0e0;">
          <span style="color: #9e9e9e; font-size: 14px;">${escapeHtml(galleryImages[2].alt)}</span>
        </div>`;
      }
      galleryHtml += '</td>';

      galleryHtml += `<td style="text-align: center; vertical-align: top; width: 50%; padding: ${spacing}px;">`;
      if (galleryImages[3].src) {
        galleryHtml += `<img src="${galleryImages[3].src}" alt="${escapeHtml(galleryImages[3].alt || '')}" style="width: 100%; max-width: 200px; height: 150px; object-fit: cover; border-radius: ${borderRadius}px; display: block; margin: 0 auto;">`;
      } else {
        galleryHtml += `<div style="width: 100%; max-width: 200px; height: 150px; background-color: #f5f5f5; border-radius: ${borderRadius}px; display: flex; align-items: center; justify-content: center; margin: 0 auto; border: 1px solid #e0e0e0;">
          <span style="color: #9e9e9e; font-size: 14px;">${escapeHtml(galleryImages[3].alt)}</span>
        </div>`;
      }
      galleryHtml += '</td>';
      galleryHtml += '</tr>';

      galleryHtml += '</table></div>';
      return galleryHtml;

    case 'tituloConIcono':
      const gradientColor1 = component.props?.gradientColor1 || 'rgba(78, 205, 196, 0.06)';
      const gradientColor2 = component.props?.gradientColor2 || 'rgba(38, 166, 154, 0.00)';
      const gradientType = component.props?.gradientType || 'linear';
      const gradientAngle = component.props?.gradientAngle || 180;
      const colorDistribution = component.props?.colorDistribution || 0;
      const textColor = component.props?.textColor || '#00C3C3';

      const gradientStyle =
        gradientType === 'linear'
          ? `background: linear-gradient(${gradientAngle}deg, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%);`
          : `background: radial-gradient(circle, ${gradientColor1} ${colorDistribution}%, ${gradientColor2} 100%);`;

      // Generar URL del icono PNG para TituloConIcono (compatible con emails)
      let tituloIconUrl = '';
      const tituloIcon = component.props?.icon || 'chart-line';

      if (tituloIcon.startsWith('http')) {
        tituloIconUrl = tituloIcon;
      } else if (tituloIcon.includes(':')) {
        // Extraer nombre del icono de formato collection:name
        const iconName = tituloIcon.split(':')[1] || tituloIcon.split(':')[0];
        tituloIconUrl = `https://img.icons8.com/color/48/${iconName}.png`;
      } else {
        tituloIconUrl = `https://img.icons8.com/color/48/${tituloIcon}.png`;
      }

      return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0px;">
        <tr>
          <td style="${gradientStyle} border-radius: 8px; padding: 16px 20px; text-align: left;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="vertical-align: middle; padding-right: 12px;">
                  <img src="${tituloIconUrl}" width="24" height="24" alt="Icono" style="display: block; max-width: 24px; max-height: 24px;">
                </td>
                <td style="vertical-align: middle;">
                  <span style="font-size: 20px; font-weight: bold; color: ${textColor}; line-height: 1.2;">${escapeHtml(component.content)}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;

    case 'herramientas':
      // Obtener herramientas del componente
      const herramientas = component.props?.herramientas || [
        {
          id: '1',
          nombre: 'Herramienta',
          icono: 'mdi:hammer-wrench',
          colorFondo: '#f3f4f6',
          colorTexto: '#374151',
          colorIcono: '#6b7280',
        },
      ];

      const herramientasBackgroundColor = component.props?.backgroundColor || '#ffffff';
      const herramientasOpacity = component.props?.opacity || 100;
      const herramientasBorderRadius = component.props?.borderRadius || 12;

      // Función para aplicar opacidad solo al color de fondo
      const getBackgroundColorWithOpacity = (color: string, opacityValue: number) => {
        if (color.startsWith('#')) {
          const hex = color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return `rgba(${r}, ${g}, ${b}, ${opacityValue / 100})`;
        }
        return color.includes('rgba')
          ? color.replace(/[\d.]+\)$/g, `${opacityValue / 100})`)
          : color;
      };

      return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
        <tr>
          <td style="background-color: ${getBackgroundColorWithOpacity(herramientasBackgroundColor, herramientasOpacity)}; border-radius: ${herramientasBorderRadius}px; border: 1px solid rgba(0,0,0,0.08); padding: 20px;">
            <!-- Header -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="vertical-align: middle; padding-right: 16px;">
                  <div style="width: 40px; height: 40px; border-radius: 10px; background-color: #fbbf24; box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3); display: flex; align-items: center; justify-content: center;">
                    <img src="https://api.iconify.design/mdi/hammer-wrench.svg?color=%23ffffff&height=20" width="20" height="20" alt="Herramientas" style="display: block;">
                  </div>
                </td>
                <td style="vertical-align: middle;">
                  <span style="color: #1f2937; font-weight: 600; font-size: 20px; letter-spacing: -0.01em;">Herramientas</span>
                </td>
              </tr>
            </table>
            
            <!-- Herramientas -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px;">
              <tr>
                <td>
                  ${herramientas
                    .map((herramienta: any) => {
                      // Generar URL del icono PNG para herramientas (compatible con emails)
                      let herramientaIconUrl = '';
                      const herramientaIcon = herramienta.icono || 'hammer-wrench';

                      if (herramientaIcon.startsWith('http')) {
                        herramientaIconUrl = herramientaIcon;
                      } else if (herramientaIcon.includes(':')) {
                        // Extraer nombre del icono de formato collection:name
                        const iconName =
                          herramientaIcon.split(':')[1] || herramientaIcon.split(':')[0];
                        herramientaIconUrl = `https://img.icons8.com/color/48/${iconName}.png`;
                      } else {
                        herramientaIconUrl = `https://img.icons8.com/color/48/${herramientaIcon}.png`;
                      }

                      return `
                    <span style="
                      display: inline-flex;
                      align-items: center;
                      gap: 6px;
                      background-color: ${herramienta.colorFondo};
                      color: ${herramienta.colorTexto};
                      padding: 8px 12px;
                      margin: 0 6px 6px 0;
                      border-radius: 8px;
                      font-size: 14px;
                      font-weight: 500;
                      border: 1px solid rgba(0,0,0,0.08);
                      text-decoration: none;
                      vertical-align: top;
                    ">
                      <img src="${herramientaIconUrl}" width="16" height="16" alt="${herramienta.nombre}" style="display: inline-block; vertical-align: middle; max-width: 16px; max-height: 16px;">
                      ${escapeHtml(herramienta.nombre)}
                    </span>
                  `;
                    })
                    .join('')}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;

    case 'respaldadoPor':
      // Obtener configuraciones del componente respaldadoPor
      const respaldadoTexto = component.props?.texto || 'Respaldado por';
      const respaldadoNombre = component.props?.nombre || component.content || 'Redacción';
      const respaldadoAvatarUrl = component.props?.avatarUrl || '';
      const respaldadoAvatarTamano = component.props?.avatarTamano || 21;

      // Configuraciones para sección adicional
      const mostrarEscritorPropietario = component.props?.mostrarEscritorPropietario || false;
      const escritorNombre = component.props?.escritorNombre || 'Escritor';
      const escritorAvatarUrl = component.props?.escritorAvatarUrl || '';
      const propietarioNombre = component.props?.propietarioNombre || 'Propietario';
      const propietarioAvatarUrl = component.props?.propietarioAvatarUrl || '';

      const respaldadoHtml = `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
        <tr>
          <td style="text-align: left;">
            <!-- Sección Principal: Respaldado por -->
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; background-color: #f5f5f5; border-radius: 12px;">
              <span style="font-size: 13px; color: #9e9e9e; line-height: 1; font-weight: 400; vertical-align: middle; margin: auto 0px;">${escapeHtml(respaldadoTexto)}</span>
              ${
                respaldadoAvatarUrl
                  ? `<img src="${respaldadoAvatarUrl}" alt="${escapeHtml(respaldadoNombre)}" style="width: ${respaldadoAvatarTamano}px; height: ${respaldadoAvatarTamano}px; border-radius: 50%; object-fit: cover; vertical-align: middle; display: inline-block;">`
                  : ''
              }
              <span style="font-size: 13px; color: #616161; font-weight: 400; line-height: 1; vertical-align: middle; margin: auto 0px;">${escapeHtml(respaldadoNombre)}</span>
              ${
                mostrarEscritorPropietario
                  ? `
              <!-- Sección Adicional: Escritor con Propietario (inline) -->
              <span style="font-size: 13px; line-height: 1; font-weight: 400; vertical-align: middle; margin: auto 0px;">Escritor con</span>
              ${
                escritorAvatarUrl
                  ? `<img src="${escritorAvatarUrl}" alt="${escapeHtml(escritorNombre)}" style="width: 21px; height: 21px; border-radius: 50%; object-fit: cover; vertical-align: middle; display: inline-block;">`
                  : ''
              }
              <span style="font-size: 13px; font-weight: 400; line-height: 1; vertical-align: middle; margin: auto 0px;">${escapeHtml(escritorNombre)}</span>
              ${
                propietarioAvatarUrl
                  ? `<img src="${propietarioAvatarUrl}" alt="${escapeHtml(propietarioNombre)}" style="width: 21px; height: 21px; border-radius: 50%; object-fit: cover; vertical-align: middle; display: inline-block;">`
                  : ''
              }
              <span style="font-size: 13px; font-weight: 400; line-height: 1; vertical-align: middle; margin: auto 0px;">${escapeHtml(propietarioNombre)}</span>`
                  : ''
              }
            </div>
          </td>
        </tr>
      </table>`;

      return respaldadoHtml;

    case 'imageText':
      const imageTextImageUrl = component.props?.imageUrl || '';
      const imageTextImageAlt = component.props?.imageAlt || 'Imagen';
      const imageTextTitle = component.props?.title || 'Título';
      const imageTextDescription = component.props?.description || 'Descripción';
      const imageTextImageWidth = component.props?.imageWidth || 40;
      const imageTextSpacing = component.props?.spacing || 16;
      const imageTextBorderRadius = component.props?.borderRadius || 8;
      const imageTextBackgroundColor = component.props?.backgroundColor || '#ffffff';
      const imageTextTextColor = component.props?.textColor || '#333333';
      const imageTextTitleColor = component.props?.titleColor || '#000000';
      const imageTextFontSize = component.props?.fontSize || 14;
      const imageTextTitleSize = component.props?.titleSize || 20;

      return `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0; background-color: ${imageTextBackgroundColor}; border-radius: ${imageTextBorderRadius}px;">
          <tr>
            <td style="padding: 16px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <!--[if mso | IE]>
                  <td style="width: ${imageTextImageWidth}%; vertical-align: top;">
                  <![endif]-->
                  <td style="width: ${imageTextImageWidth}%; vertical-align: top; padding-right: ${imageTextSpacing}px;" class="mobile-stack">
                    ${imageTextImageUrl ? `<img src="${imageTextImageUrl}" alt="${escapeHtml(imageTextImageAlt)}" style="width: 100%; height: auto; border-radius: ${imageTextBorderRadius}px; display: block;">` : `<div style="width: 100%; height: 150px; background-color: #f5f5f5; border-radius: ${imageTextBorderRadius}px; display: flex; align-items: center; justify-content: center; color: #9e9e9e; font-size: 14px;">${escapeHtml(imageTextImageAlt)}</div>`}
                  </td>
                  <!--[if mso | IE]>
                  </td>
                  <td style="width: ${100 - imageTextImageWidth}%; vertical-align: top;">
                  <![endif]-->
                  <td style="width: ${100 - imageTextImageWidth}%; vertical-align: top;" class="mobile-stack">
                    <h3 style="color: ${imageTextTitleColor}; font-size: ${imageTextTitleSize}px; font-weight: bold; margin: 0 0 8px 0; line-height: 1.2;">${escapeHtml(imageTextTitle)}</h3>
                    <p style="color: ${imageTextTextColor}; font-size: ${imageTextFontSize}px; line-height: 1.5; margin: 0;">${escapeHtml(imageTextDescription)}</p>
                  </td>
                  <!--[if mso | IE]>
                  </td>
                  <![endif]-->
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <style>
          @media only screen and (max-width: 600px) {
            .mobile-stack {
              display: block !important;
              width: 100% !important;
              padding-right: 0 !important;
              padding-bottom: ${imageTextSpacing}px !important;
            }
          }
        </style>
      `;

    case 'textWithIcon':
      const textIconIcon = component.props?.icon || 'mdi:information-outline';
      const textIconIconColor = component.props?.iconColor || '#2196f3';
      const textIconIconSize = component.props?.iconSize || 24;
      const textIconTitle = component.props?.title || 'Título con Icono';
      const textIconDescription = component.props?.description || 'Escribe el contenido aquí...';
      const textIconTitleColor = component.props?.titleColor || '#000000';
      const textIconTextColor = component.props?.textColor || '#333333';
      const textIconBackgroundColor = component.props?.backgroundColor || '#ffffff';
      const textIconTitleSize = component.props?.titleSize || 20;
      const textIconFontSize = component.props?.fontSize || 14;
      const textIconAlignment = component.props?.alignment || 'left';
      const textIconSpacing = component.props?.spacing || 12;
      const textIconBorderRadius = component.props?.borderRadius || 8;
      const textIconPadding = component.props?.padding || 16;

      // Mapeo básico de iconos MDI a símbolos Unicode/HTML para correos
      const iconMap: Record<string, string> = {
        'mdi:information-outline': 'ℹ️',
        'mdi:check-circle-outline': '✅',
        'mdi:alert-circle-outline': '⚠️',
        'mdi:lightbulb-outline': '💡',
        'mdi:star-outline': '⭐',
        'mdi:heart-outline': '❤️',
        'mdi:fire': '🔥',
        'mdi:trending-up': '📈',
        'mdi:rocket-launch-outline': '🚀',
        'mdi:shield-check-outline': '🛡️',
        'mdi:clock-outline': '⏰',
        'mdi:account-group-outline': '👥',
      };

      const iconSymbol = iconMap[textIconIcon] || '•';
      const alignmentStyle =
        textIconAlignment === 'center'
          ? 'center'
          : textIconAlignment === 'right'
            ? 'right'
            : 'left';

      return `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
          <tr>
            <td style="background-color: ${textIconBackgroundColor}; border-radius: ${textIconBorderRadius}px; padding: ${textIconPadding}px; text-align: ${alignmentStyle};">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="vertical-align: middle; padding-right: ${textIconSpacing}px;">
                    <span style="font-size: ${textIconIconSize}px; color: ${textIconIconColor}; line-height: 1;">${iconSymbol}</span>
                  </td>
                  <td style="vertical-align: middle;">
                    <h3 style="color: ${textIconTitleColor}; font-size: ${textIconTitleSize}px; font-weight: bold; margin: 0; line-height: 1.2; display: inline;">${escapeHtml(textIconTitle)}</h3>
                  </td>
                </tr>
              </table>
              ${textIconDescription ? `<p style="color: ${textIconTextColor}; font-size: ${textIconFontSize}px; line-height: 1.5; margin: 8px 0 0 0;">${escapeHtml(textIconDescription)}</p>` : ''}
            </td>
          </tr>
        </table>
      `;

    case 'twoColumns':
      const twoColLeftColumn = component.props?.leftColumn || {
        imageUrl: '',
        imageAlt: 'Imagen',
        title: 'Título',
        description: 'Descripción',
      };
      const twoColRightColumn = component.props?.rightColumn || {
        imageUrl: '',
        imageAlt: 'Imagen',
        title: 'Título',
        description: 'Descripción',
      };
      const twoColSpacing = component.props?.spacing || 16;
      const twoColBorderRadius = component.props?.borderRadius || 8;
      const twoColBackgroundColor = component.props?.backgroundColor || '#ffffff';
      const twoColTextColor = component.props?.textColor || '#333333';
      const twoColTitleColor = component.props?.titleColor || '#000000';
      const twoColFontSize = component.props?.fontSize || 14;
      const twoColTitleSize = component.props?.titleSize || 18;
      const twoColColumnPadding = component.props?.columnPadding || 16;

      const renderTwoColumn = (columnData: any) => `
        <td style="width: 50%; vertical-align: top; padding: ${twoColColumnPadding}px; background-color: ${twoColBackgroundColor}; border-radius: ${twoColBorderRadius}px; text-align: center;" class="mobile-column">
          ${columnData.imageUrl ? `<img src="${columnData.imageUrl}" alt="${escapeHtml(columnData.imageAlt)}" style="width: 100%; height: auto; max-height: 200px; border-radius: ${twoColBorderRadius}px; object-fit: cover; display: block; margin-bottom: 16px;">` : `<div style="width: 100%; height: 150px; background-color: #f5f5f5; border-radius: ${twoColBorderRadius}px; display: flex; align-items: center; justify-content: center; color: #9e9e9e; font-size: 14px; margin-bottom: 16px;">${escapeHtml(columnData.imageAlt)}</div>`}
          <h3 style="color: ${twoColTitleColor}; font-size: ${twoColTitleSize}px; font-weight: bold; margin: 0 0 8px 0; line-height: 1.2;">${escapeHtml(columnData.title)}</h3>
          <p style="color: ${twoColTextColor}; font-size: ${twoColFontSize}px; line-height: 1.5; margin: 0;">${escapeHtml(columnData.description)}</p>
        </td>
      `;

      return `
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 20px 0;">
          <tr>
            <td style="padding: 0 0 ${twoColSpacing}px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-spacing: ${twoColSpacing}px;">
                <tr>
                  <!--[if mso | IE]>
                  <td style="width: 50%; vertical-align: top;">
                  <![endif]-->
                  ${renderTwoColumn(twoColLeftColumn)}
                  <!--[if mso | IE]>
                  </td>
                  <td style="width: 50%; vertical-align: top;">
                  <![endif]-->
                  ${renderTwoColumn(twoColRightColumn)}
                  <!--[if mso | IE]>
                  </td>
                  <![endif]-->
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <style>
          @media only screen and (max-width: 600px) {
            .mobile-column {
              display: block !important;
              width: 100% !important;
              margin-bottom: ${twoColSpacing}px !important;
            }
          }
        </style>
      `;

    default:
      return `<div class="component-unknown" style="background-color: #fff3e0; border-left: 3px solid #ff9800; padding: 15px; margin: 15px 0; border-radius: 0 4px 4px 0;">
        <strong style="color: #f57c00;">Componente: ${component.type}</strong><br>
        <span style="color: #333333;">${escapeHtml(component.content || 'Sin contenido disponible')}</span>
      </div>`;
  }
}

/**
 * Escapa caracteres HTML para prevenir XSS
 */
function escapeHtml(text: string): string {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Genera HTML escapado para AWS SES
 */
export function generateEscapedHtml(html: string): string {
  return html.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

/**
 * Genera HTML para una nota individual (sin header y footer)
 * Usa los mismos estilos de componentes que el newsletter
 */
export function generateSingleNoteHtml(
  noteTitle: string,
  noteDescription: string,
  components: EmailComponent[],
  containerConfig?: {
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    padding?: number;
    maxWidth?: number;
  }
): string {
  // Configuración del contenedor con valores por defecto
  const config = {
    borderWidth: containerConfig?.borderWidth ?? 1,
    borderColor: containerConfig?.borderColor ?? '#e5e7eb',
    borderRadius: containerConfig?.borderRadius ?? 12,
    padding: containerConfig?.padding ?? 30,
    maxWidth: containerConfig?.maxWidth ?? 560,
  };

  const html = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(noteTitle)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    
    /* Base styles */
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #f8f9fa;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
    }
    
    /* Container principal - CONFIGURABLE */
    .email-container {
      max-width: ${config.maxWidth}px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: ${config.borderRadius}px;
      border: ${config.borderWidth}px solid ${config.borderColor};
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    /* Contenido de la nota - CONFIGURABLE */
    .note-content {
      padding: ${config.padding}px;
    }
    
    /* Note title - Mismo estilo que las notas en el newsletter */
    .note-title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 20px 0;
      line-height: 1.3;
      letter-spacing: -0.25px;
    }
    
    /* Note description */
    .note-description {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 32px 0;
      line-height: 1.5;
    }
    
    /* Components - Mismos estilos que el newsletter */
    .component-heading {
      font-weight: 600;
      margin: 0 !important;
      line-height: 1.3;
      color: #111827;
      letter-spacing: -0.25px;
      display: block;
    }
    
    .component-paragraph {
      margin: 0 !important;
      line-height: 1.7;
      font-size: 16px;
      color: #374151;
    }
    
    .component-summary {
      background-color: #f8fafc;
      border-left: 3px solid #3b82f6;
      padding: 20px 24px;
      margin: 25px 0;
      border-radius: 0 6px 6px 0;
    }
    
    .component-bulletlist {
      margin: 20px 0;
      padding-left: 24px;
    }
    
    .component-bulletlist li {
      margin: 10px 0;
      line-height: 1.6;
      color: #374151;
    }
    
    .component-divider {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 40px 0;
      height: 1px;
    }
    
    .component-image {
      text-align: center;
      margin: 0px 0px 25px 0px;
    }
    
    .component-image img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
      margin: 0 auto;
    }
    
    .component-button {
      text-align: center;
      margin: 30px 0;
    }
    
    .component-button a {
      display: inline-block;
      padding: 14px 28px;
      background-color: #3b82f6;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    
    .component-category {
      display: inline-block;
      background-color: #e3f2fd;
      color: #1976d2;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
      margin: 5px 5px 5px 0;
      text-decoration: none;
    }
    
    .component-author {
      margin: 25px 0;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border-left: 3px solid #28a745;
    }
    
    .component-spacer {
      display: block;
      height: 20px;
      line-height: 20px;
      font-size: 1px;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 20px 10px !important;
        border-radius: ${Math.max(config.borderRadius - 4, 0)}px !important;
        max-width: calc(100% - 20px) !important;
      }
      
      .note-content {
        padding: ${Math.max(config.padding - 10, 10)}px !important;
      }
      
      .note-title {
        font-size: 20px !important;
      }
      
      .note-description {
        font-size: 15px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="note-content">
      <div class="components">
        ${components.map((component) => renderComponentToHtml(component)).join('')}
      </div>
    </div>
  </div>
</body>
</html>`;

  return html;
}
