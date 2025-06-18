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
        let categoriasHtml = '<div class="component-category-group" style="margin: 15px 0;">';
        component.props.categorias.forEach((categoria: any) => {
          categoriasHtml += `<span class="component-category" style="
            display: inline-block;
            background-color: ${categoria.colorFondo || '#e3f2fd'};
            color: ${categoria.colorTexto || '#1976d2'};
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            margin: 5px 5px 5px 0;
            text-decoration: none;
          ">${escapeHtml(categoria.texto)}</span>`;
        });
        categoriasHtml += '</div>';
        return categoriasHtml;
      } else {
        // Renderizar categoría única (legacy)
        const backgroundColor = component.props?.color || component.props?.colorFondo || '#e3f2fd';
        const textColor = component.props?.textColor || component.props?.colorTexto || '#1976d2';
        return `<span class="component-category" style="
          display: inline-block;
          background-color: ${backgroundColor};
          color: ${textColor};
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          margin: 5px 5px 5px 0;
          text-decoration: none;
        ">${escapeHtml(component.content)}</span>`;
      }

    case 'summary':
      // Obtener configuración del tipo de summary
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
      const summaryBgColor = component.props?.backgroundColor || typeConfig.backgroundColor;
      const summaryIconColor = component.props?.iconColor || typeConfig.iconColor;
      const summaryTextColor = component.props?.textColor || typeConfig.textColor;
      const summaryIcon = component.props?.icon || typeConfig.icon;
      const summaryLabel = component.props?.label || typeConfig.label;

      return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
        <tr>
          <td style="background-color: ${summaryBgColor}; border-radius: 12px; border: 1px solid rgba(0,0,0,0.08); overflow: hidden;">
            <!-- Header -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="padding: 16px 20px 12px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="vertical-align: middle; padding-right: 12px;">
                        <div style="width: 32px; height: 32px; border-radius: 8px; background-color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center;">
                          <img src="https://api.iconify.design/${summaryIcon.replace(':', '/')}.svg?color=${encodeURIComponent(summaryIconColor)}&height=18" width="18" height="18" alt="${summaryLabel}" style="display: block;">
                        </div>
                      </td>
                      <td style="vertical-align: middle;">
                        <span style="color: ${summaryTextColor}; font-weight: 600; font-size: 16px; letter-spacing: -0.01em; display: block;">${summaryLabel}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <!-- Content -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td style="padding: 16px 20px 20px 20px;">
                  <div style="color: #6c757d; font-size: 15px; line-height: 1.6; margin: 0;">${component.content}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;

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
      let galleryHtml = '<div class="component-gallery" style="margin: 25px 0;">';
      galleryHtml +=
        '<table role="presentation" cellspacing="0" cellpadding="5" border="0" width="100%"><tr>';
      images.forEach((img: any, index: number) => {
        if (index % 3 === 0 && index > 0) {
          galleryHtml += '</tr><tr>';
        }
        galleryHtml += `<td style="text-align: center; vertical-align: top; width: 33.33%;">
          <img src="${img.src}" alt="${escapeHtml(img.alt || '')}" style="width: 100%; max-width: 150px; height: 100px; object-fit: cover; border-radius: 4px; display: block; margin: 0 auto;">
        </td>`;
      });
      galleryHtml += '</tr></table></div>';
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

      return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0px;">
        <tr>
          <td style="${gradientStyle} border-radius: 8px; padding: 16px 20px; text-align: left;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="vertical-align: middle; padding-right: 12px;">
                  <span style="font-size: 24px; color: ${textColor};">📰</span>
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
                    .map(
                      (herramienta: any) => `
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
                      <img src="https://api.iconify.design/${herramienta.icono.replace(':', '/')}.svg?color=${encodeURIComponent(herramienta.colorIcono)}&height=16" width="16" height="16" alt="${herramienta.nombre}" style="display: inline-block; vertical-align: middle;">
                      ${escapeHtml(herramienta.nombre)}
                    </span>
                  `
                    )
                    .join('')}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>`;

    case 'respaldadoPor':
      return `<div class="component-respaldado" style="text-align: center; padding: 15px; background-color: #f0f0f0; border-radius: 8px; margin: 20px 0;">
        <div style="font-size: 12px; color: #666666; margin-bottom: 5px;">Respaldado por</div>
        <strong style="font-size: 16px; color: #333333;">${escapeHtml(component.content)}</strong>
      </div>`;

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
