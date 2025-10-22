/**
 * Generador de HTML para componente NewsletterFooter (Footer reutilizable)
 * Footer configurable con información de empresa, redes sociales y copyright
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';
import { tableAttrs } from '../utils/outlook-helpers';

import type { EmailComponent } from '../types';

export function generateNewsletterFooterHtml(component: EmailComponent): string {
  const props = component.props || {};

  // ✅ Crear el estilo de fondo
  let backgroundStyle = '';
  if (props.useGradient && props.gradientColors && props.gradientColors.length >= 2) {
    backgroundStyle = `background: linear-gradient(${props.gradientDirection || 180}deg, ${props.gradientColors[0]}, ${props.gradientColors[1]});`;
  } else {
    backgroundStyle = `background-color: ${props.backgroundColor || '#f5f5f5'};`;
  }

  // ✅ Props de configuración
  const footerTextColor = props.textColor || '#333333';
  const padding = props.padding ? `${props.padding / 8}px` : '24px';
  const fontSize = props.fontSize || 14;
  const borderRadius = props.borderRadius || '8px';
  const margin = props.margin || '32px 0 0 0';

  let footerHtml = `<table ${tableAttrs()} width="100%" style="${backgroundStyle} margin: ${margin}; border-radius: ${borderRadius}; border: 1px solid #e0e0e0;">
  <tr>
    <td style="padding: ${padding}; text-align: center;">`;

  // ✅ Nombre de la empresa
  footerHtml += `<h3 style="font-weight: 600; color: ${footerTextColor}; margin: 0 0 8px 0; font-size: ${fontSize + 4}px;">${escapeHtml(props.companyName || 'Tu Empresa')}</h3>`;

  // ✅ Dirección
  if (props.showAddress && props.address) {
    footerHtml += `<p style="color: ${footerTextColor}; margin: 0 0 8px 0; font-size: ${fontSize}px;">${escapeHtml(props.address)}</p>`;
  }

  // ✅ Email de contacto
  if (props.contactEmail) {
    footerHtml += `<p style="color: ${footerTextColor}; margin: 0 0 16px 0; font-size: ${fontSize}px;">Contacto: ${escapeHtml(props.contactEmail)}</p>`;
  }

  // ✅ Redes sociales
  if (props.showSocial && props.socialLinks) {
    const enabledSocialLinks = props.socialLinks.filter((link: any) => link.enabled);
    if (enabledSocialLinks.length > 0) {
      footerHtml += `<p style="color: ${footerTextColor}; margin: 0 0 16px 0; font-size: ${fontSize - 2}px;">`;
      footerHtml += enabledSocialLinks
        .map((link: any) => link.platform.charAt(0).toUpperCase() + link.platform.slice(1))
        .join(' • ');
      footerHtml += '</p>';
    }
  }

  // ✅ Copyright
  footerHtml += `<p style="color: ${footerTextColor}; margin: 0; font-size: ${fontSize - 2}px;">© ${new Date().getFullYear()} ${escapeHtml(props.companyName || 'Tu Empresa')}. Todos los derechos reservados.</p>`;

  footerHtml += `
    </td>
  </tr>
</table>`;

  return footerHtml;
}
