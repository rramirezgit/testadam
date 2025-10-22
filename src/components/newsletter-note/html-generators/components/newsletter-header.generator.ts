/**
 * Generador de HTML para componente NewsletterHeader (Header reutilizable)
 * Header configurable con logo, sponsor, título, subtítulo y banner
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';
import { tableAttrs } from '../utils/outlook-helpers';

import type { EmailComponent } from '../types';

export function generateNewsletterHeaderHtml(component: EmailComponent): string {
  const props = component.props || {};

  // ✅ Crear el estilo de fondo
  let backgroundStyle = '';
  if (props.useGradient && props.gradientColors && props.gradientColors.length >= 2) {
    backgroundStyle = `background: linear-gradient(${props.gradientDirection || 135}deg, ${props.gradientColors[0]}, ${props.gradientColors[1]});`;
  } else {
    backgroundStyle = `background-color: ${props.backgroundColor || '#f5f5f5'};`;
  }

  // ✅ Props de configuración
  const headerTextColor = props.textColor || '#333333';
  const padding = props.padding ? `${props.padding / 8}px` : '24px';
  const alignment = props.alignment || 'center';
  const borderRadius = props.borderRadius || '8px';
  const margin = props.margin || '0 0 24px 0';

  let headerHtml = `<table ${tableAttrs()} width="100%" style="${backgroundStyle} margin: ${margin}; border-radius: ${borderRadius}; border: 1px solid #e0e0e0;">
  <tr>
    <td style="padding: ${padding}; text-align: ${alignment};">`;

  // ✅ Logo
  if (props.showLogo && props.logo) {
    const logoHeight = props.logoHeight || 60;
    headerHtml += `<div style="margin-bottom: 16px;">
      <img src="${props.logo}" alt="${props.logoAlt || 'Logo'}" style="max-height: ${logoHeight}px; display: block; margin: 0 auto;">
    </div>`;
  }

  // ✅ Sponsor
  if (props.sponsor?.enabled && props.sponsor?.image) {
    headerHtml += `<div style="margin-bottom: 16px;">
      <div style="color: ${headerTextColor}; margin-bottom: 8px; font-size: 14px;">${escapeHtml(props.sponsor.label || 'Juntos con')}</div>
      <img src="${props.sponsor.image}" alt="${props.sponsor.imageAlt || 'Sponsor'}" style="max-height: 48px;">
    </div>`;
  }

  // ✅ Título
  if (props.title && props.title.trim() !== '') {
    headerHtml += `<h1 style="font-weight: 700; color: ${headerTextColor}; margin: 0 0 8px 0; font-size: 24px; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">${escapeHtml(props.title)}</h1>`;
  }

  // ✅ Subtítulo
  if (props.subtitle && props.subtitle.trim() !== '') {
    headerHtml += `<p style="color: ${headerTextColor}; margin: 0 0 16px 0; font-style: italic; font-size: 16px;">${escapeHtml(props.subtitle)}</p>`;
  }

  // ✅ Banner image
  if (props.showBanner && props.bannerImage) {
    headerHtml += `<div style="margin-top: 16px;">
      <img src="${props.bannerImage}" alt="Banner" style="width: 100%; border-radius: ${borderRadius}; display: block;">
    </div>`;
  }

  headerHtml += `
    </td>
  </tr>
</table>`;

  return headerHtml;
}
