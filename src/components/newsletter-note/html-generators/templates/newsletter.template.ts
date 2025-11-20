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

/**
 * Reemplaza placeholders dinámicos en el texto
 * @param text - Texto con placeholders
 * @param context - Contexto con subscriberId y appBaseUrl
 * @returns Texto con placeholders reemplazados
 */
function replacePlaceholders(text: string, context?: NewsletterGenerationContext): string {
  if (!text) return '';
  
  let result = text;
  
  // Reemplazar #unsubscribe con la URL real si tenemos el subscriberId
  if (context?.subscriberId && context?.appBaseUrl) {
    const unsubscribeUrl = `${context.appBaseUrl}/unsubscribe/${context.subscriberId}`;
    result = result.replace(/#unsubscribe/g, unsubscribeUrl);
  }
  
  return result;
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

export interface NewsletterGenerationContext {
  subscriberId?: string;
  appBaseUrl?: string;
}

export function generateNewsletterTemplate(
  title: string,
  description: string,
  notesHtmlContent: string,
  header: HeaderConfig | null,
  footer: FooterConfig | null,
  approvalButtons?: ApprovalButtonsConfig,
  context?: NewsletterGenerationContext
): string {
  // ✅ Estilos de fondo del header con imagen (solo si existe)
  let headerBackgroundStyle = '';
  if (header) {
    const backgroundImageUrl = header.backgroundImageUrl || 'https://s3.amazonaws.com/s3.condoor.ai/pala/408ef0ed15.webp';
    const backgroundSize = header.backgroundSize || 'cover';
    const backgroundPosition = header.backgroundPosition || 'top center';
    const backgroundRepeat = header.backgroundRepeat || 'no-repeat';
    const minHeight = header.minHeight || '331px';
    const borderRadius = header.borderRadius || '38px 38px 0 0';
    
    headerBackgroundStyle = `background-image: url(${backgroundImageUrl}); background-size: ${backgroundSize}; background-position: ${backgroundPosition}; background-repeat: ${backgroundRepeat}; min-height: ${minHeight}; border-radius: ${borderRadius};`;
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
    
    /* Responsive */
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .header-title { font-size: 28px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;">
  <!-- Wrapper principal centrado -->
  <table ${tableAttrs()} width="100%" style="background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 0;">
        <!-- Contenedor de 600px -->
        <table ${tableAttrs()} class="email-container" width="600" style="width: 600px; max-width: 600px; margin: 0 auto;">
          <tr>
            <td style="padding: 0;">
              ${
                header
                  ? `
              <!-- Header con imagen de fondo -->
              <table ${tableAttrs()} width="100%" style="${headerBackgroundStyle} margin-bottom: ${header.margin || '24px'}; border: 1px solid #e0e0e0;">
                <tr>
                  <td style="padding: ${header.padding ? header.padding / 8 : 32}px; text-align: ${header.alignment}; color: ${header.textColor};">
                    ${header.title ? `<p style="font-size: 32px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.2; letter-spacing: -0.5px; color: ${header.textColor}; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${escapeHtml(header.title)}</p>` : ''}
                    ${header.subtitle ? `<p style="font-size: 18px; margin: 0; opacity: 0.85; font-weight: 400; color: ${header.textColor}; font-style: italic;">${escapeHtml(header.subtitle)}</p>` : ''}
                  </td>
                </tr>
              </table>
              `
                  : ''
              }
              
              <!-- Content -->
              <table ${tableAttrs()} width="100%">
                <tr>
                  <td style="padding: 0;">
                    ${notesHtmlContent}
                  </td>
                </tr>
              </table>
              
              ${
                footer
                  ? `
              <!-- Footer con estilos inline -->
              <table ${tableAttrs()} width="100%" style="${footerBackgroundStyle} margin-top: 50px; border-radius: 8px;">
                <tr>
                  <td style="padding: 40px 30px; text-align: left; color: ${footer.textColor};">
                    ${footer.logo ? `<img src="${footer.logo}" alt="Logo" style="height: ${footer.logoHeight || 40.218}px; margin-bottom: 16px; display: block; border: 0;">` : ''}
                    
                    <div style="margin-bottom: 16px;">
                      ${
                        footer.socialLinks
                          ?.filter((link) => link.enabled)
                          ?.map((link) => {
                            const iconUrl = getSocialIconUrlForTemplate(
                              link.platform.toLowerCase()
                            );
                            return iconUrl
                              ? `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-right: 12px; text-decoration: none;">
                                  <img src="${iconUrl}" alt="${link.platform}" style="width: 24px; height: 24px; display: block; border: 0;" />
                                </a>`
                              : '';
                          })
                          .join('') || ''
                      }
                    </div>
                    
                    <div style="color: ${footer.textColor}; font-size: 14px; line-height: 1.5;">
                      ${replacePlaceholders(footer.footerText || '', context)}
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
              <table ${tableAttrs()} width="100%" style="margin-top: 40px;">
                <tr>
                  <td style="padding: 0 30px;">
                    <table ${tableAttrs()} width="100%" style="background-color: #f9fafb; border-radius: 12px; border: 1px solid #e5e7eb;">
                      <tr>
                        <td style="padding: 32px; text-align: center;">
                          <p style="font-size: 16px; color: #374151; margin: 0 0 24px 0; font-weight: 500;">
                            ¿Deseas aprobar este newsletter?
                          </p>
                          <table ${tableAttrs()} align="center">
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
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              `
                  : ''
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
