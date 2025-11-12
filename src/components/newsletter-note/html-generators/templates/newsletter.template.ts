/**
 * Template principal para Newsletter completo
 * Incluye estructura HTML completa con DOCTYPE, head, body, header y footer
 */

import { escapeHtml } from '../utils/html-utils';
import { EMAIL_RESET_CSS } from '../utils/email-styles';
import { tableAttrs, outlookMetaTags } from '../utils/outlook-helpers';

import type { HeaderConfig, FooterConfig } from '../types';

function getSocialIconUrlForTemplate(platform: string): string {
  const icons: Record<string, string> = {
    instagram: 'https://s3.amazonaws.com/s3.condoor.ai/adam/47b192e0d0.png',
    facebook: 'https://s3.amazonaws.com/s3.condoor.ai/adam/e673e848a3.png',
    x: 'https://s3.amazonaws.com/s3.condoor.ai/adam/e6db6baccf8.png',
    twitter: 'https://s3.amazonaws.com/s3.condoor.ai/adam/e6db6baccf8.png', // Twitter es X
    tiktok: 'https://s3.amazonaws.com/s3.condoor.ai/adam/8ffcbf79bb.png',
    linkedin: 'https://s3.amazonaws.com/s3.condoor.ai/adam/ee993e33c6e.png',
  };
  return icons[platform] || '';
}

export interface NewsletterNote {
  noteId: string;
  order: number;
  noteData: {
    id: string;
    title: string;
    objData: string; // JSON string de componentes
    objDataWeb?: string;
    configNote?: string;
    containerBorderWidth?: number;
    containerBorderColor?: string;
    containerBorderRadius?: number;
    containerPadding?: number;
    containerMaxWidth?: number;
  };
}

export interface ApprovalButtonsConfig {
  newsletterId: string;
  baseUrl: string;
}

export function generateNewsletterTemplate(
  title: string,
  description: string,
  notesHtmlContent: string,
  header: HeaderConfig | null,
  footer: FooterConfig | null,
  approvalButtons?: ApprovalButtonsConfig
): string {
  // ✅ Estilos de fondo del header (solo si existe)
  let headerBackgroundStyle = '';
  if (header) {
    headerBackgroundStyle = `background-color: ${header.backgroundColor};`;
    if (header.useGradient && header.gradientColors && header.gradientColors.length >= 2) {
      headerBackgroundStyle = `background: linear-gradient(${header.gradientDirection || 180}deg, ${header.gradientColors[0]}, ${header.gradientColors[1]});`;
    }
  }

  // ✅ Estilos de fondo del footer (solo si existe)
  let footerBackgroundStyle = '';
  if (footer) {
    footerBackgroundStyle = `background-color: ${footer.backgroundColor};`;
    if (footer.useGradient && footer.gradientColors && footer.gradientColors.length >= 2) {
      footerBackgroundStyle = `background: linear-gradient(${footer.gradientDirection || 180}deg, ${footer.gradientColors[0]}, ${footer.gradientColors[1]});`;
    }
  }

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(title || 'Newsletter')}</title>
  ${outlookMetaTags()}
  <style type="text/css">
    ${EMAIL_RESET_CSS}
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    
    ${
      header
        ? `
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
    `
        : ''
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
    
    /* Notes */
    .note-section {
      margin-bottom: 24px;
    }
    
    .note-section:last-child {
      margin-bottom: 40px;
    }
    
    /* Footer */
    ${
      footer
        ? `
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
    `
        : ''
    }
    
    /* Responsive */
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .email-header { padding: 30px 20px !important; }
      .email-content { padding: 0 20px !important; }
      .email-footer { padding: 30px 20px !important; }
      .newsletter-description { padding: 20px 0 !important; }
      .header-title { font-size: 28px !important; }
    }
  </style>
</head>
<body>
  <table ${tableAttrs()} width="100%">
    <tr>
      <td>
        <div class="email-container">
          ${
            header
              ? `
          <!-- Header -->
          <table ${tableAttrs()} width="100%" style="margin-bottom: 24px;">
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
                ${header.title ? `<p class="header-title">${escapeHtml(header.title)}</p>` : ''}
                ${header.subtitle ? `<p class="header-subtitle">${escapeHtml(header.subtitle)}</p>` : ''}
                ${header.bannerImage ? `<img src="${header.bannerImage}" alt="Banner" style="width: 100%; margin-top: 20px; border-radius: 8px;">` : ''}
              </td>
            </tr>
          </table>
          `
              : ''
          }
          
          <!-- Content -->
          <table ${tableAttrs()} width="100%">
            <tr>
              <td class="email-content">
                ${notesHtmlContent}
              </td>
            </tr>
          </table>
          
          ${
            footer
              ? `
          <!-- Footer -->
          <table ${tableAttrs()} width="100%">
            <tr>
              <td class="email-footer" style="text-align: left;">
                ${footer.logo ? `<img src="${footer.logo}" alt="Logo" style="height: ${footer.logoHeight || 40.218}px; margin-bottom: 16px; display: block;">` : ''}
                
                <div style="margin-bottom: 16px;">
                  ${
                    footer.socialLinks
                      ?.filter((link) => link.enabled)
                      ?.map((link) => {
                        const iconUrl = getSocialIconUrlForTemplate(link.platform.toLowerCase());
                        return iconUrl
                          ? `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-right: 12px; text-decoration: none;">
                              <img src="${iconUrl}" alt="${link.platform}" style="width: 24px; height: 24px; display: block;" />
                            </a>`
                          : '';
                      })
                      .join('') || ''
                  }
                </div>
                
                <div style="color: ${footer.textColor}; font-size: 14px; line-height: 1.5;">
                  ${footer.footerText || ''}
                </div>
              </td>
            </tr>
          </table>
          `
              : ''
          }
          
          ${
            approvalButtons
              ? `
          <!-- Approval Buttons -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 40px;">
            <tr>
              <td style="padding: 0 30px;">
                <div style="background-color: #f9fafb; padding: 32px; border-radius: 12px; text-align: center; border: 1px solid #e5e7eb;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 24px 0; font-weight: 500;">
                    ¿Deseas aprobar este newsletter?
                  </p>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                    <tr>
                      <td style="padding: 0 8px;">
                        <a href="${approvalButtons.baseUrl}/edit/newsletter/${approvalButtons.newsletterId}?action=approve" 
                           style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                          ✓ Aprobar
                        </a>
                      </td>
                      <td style="padding: 0 8px;">
                        <a href="${approvalButtons.baseUrl}/edit/newsletter/${approvalButtons.newsletterId}?action=reject" 
                           style="display: inline-block; padding: 14px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                          ✕ Rechazar
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
          `
              : ''
          }
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
