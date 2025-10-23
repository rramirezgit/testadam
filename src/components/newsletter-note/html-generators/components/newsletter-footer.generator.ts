/**
 * Generador de HTML para componente NewsletterFooter (Footer reutilizable)
 * Footer configurable con información de empresa, redes sociales y copyright
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';
import { tableAttrs } from '../utils/outlook-helpers';

import type { EmailComponent } from '../types';

function getSocialIconUrl(platform: string): string {
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

function cleanTipTapHtml(html: string): string {
  if (!html) return '';
  if (!html.includes('<')) return html;
  const cleaned = html
    .replace(/<p class="tiptap-paragraph">/g, '<p style="margin: 0 0 8px 0;">')
    .trim();
  return cleaned;
}

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
  const padding = props.padding ? `${props.padding / 8}px` : '24px';
  const borderRadius = props.borderRadius || '8px';
  const margin = props.margin || '32px 0 0 0';
  const textColor = props.textColor || '#666';

  let footerHtml = `<table ${tableAttrs()} width="100%" style="${backgroundStyle} margin: ${margin}; border-radius: ${borderRadius}; border: 1px solid #e0e0e0;">
  <tr>
    <td style="padding: ${padding}; text-align: left;">`;

  // ✅ Logo
  if (props.showLogo && props.logo) {
    const logoHeight = props.logoHeight || 40.218;
    footerHtml += `<div style="margin-bottom: 16px;">
      <img src="${props.logo}" alt="Logo" style="height: ${logoHeight}px; display: block;">
    </div>`;
  }

  // ✅ Redes sociales con íconos
  if (props.showSocial && props.socialLinks) {
    const enabledSocialLinks = props.socialLinks.filter((link: any) => link.enabled);
    if (enabledSocialLinks.length > 0) {
      footerHtml += `<div style="margin-bottom: 16px;">`;
      enabledSocialLinks.forEach((link: any) => {
        const iconUrl = getSocialIconUrl(link.platform.toLowerCase());
        if (iconUrl) {
          footerHtml += `<a href="${link.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-right: 12px;">
            <img src="${iconUrl}" alt="${escapeHtml(link.platform)}" style="width: 24px; height: 24px; display: block;" />
          </a>`;
        }
      });
      footerHtml += `</div>`;
    }
  }

  // ✅ Texto del footer (HTML de TipTap)
  if (props.footerText) {
    const cleanedText = cleanTipTapHtml(props.footerText);
    footerHtml += `<div style="color: ${textColor}; font-size: 14px; line-height: 1.5;">${cleanedText}</div>`;
  }

  footerHtml += `
    </td>
  </tr>
</table>`;

  return footerHtml;
}
