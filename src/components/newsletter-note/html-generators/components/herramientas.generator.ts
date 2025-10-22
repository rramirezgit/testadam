/**
 * Generador de HTML para componente Herramientas
 * Lista de herramientas con iconos y colores personalizados
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { tableAttrs } from '../utils/outlook-helpers';
import { hexToRgba, escapeHtml, getIconUrl } from '../utils/html-utils';

import type { Herramienta, EmailComponent } from '../types';

export function generateHerramientasHtml(component: EmailComponent): string {
  // ✅ Obtener herramientas del componente
  const herramientas: Herramienta[] = component.props?.herramientas || [
    {
      id: '1',
      nombre: 'Herramienta',
      icono: 'mdi:hammer-wrench',
      colorFondo: '#f3f4f6',
      colorTexto: '#374151',
      colorIcono: '#6b7280',
    },
  ];

  // ✅ Props configurables del contenedor
  const backgroundColor = component.props?.backgroundColor || '#ffffff';
  const opacity = component.props?.opacity || 100;
  const borderRadius = component.props?.borderRadius || 12;
  const margin = component.style?.margin || '25px 0';
  const padding = component.props?.padding || '20px';

  // ✅ Aplicar opacidad al color de fondo
  const backgroundColorWithOpacity = hexToRgba(backgroundColor, opacity);

  // Header del componente
  const headerHtml = `<table ${tableAttrs()}>
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
  </table>`;

  // ✅ Renderizar herramientas individuales
  const herramientasHtml = herramientas
    .map((herramienta) => {
      const iconUrl = getIconUrl(herramienta.icono);

      const herramientaStyles = [
        `display: inline-flex`,
        `align-items: center`,
        `gap: 6px`,
        `background-color: ${herramienta.colorFondo}`,
        `color: ${herramienta.colorTexto}`,
        `padding: 8px 12px`,
        `margin: 0 6px 6px 0`,
        `border-radius: 8px`,
        `font-size: 14px`,
        `font-weight: 500`,
        `border: 1px solid rgba(0,0,0,0.08)`,
        `text-decoration: none`,
        `vertical-align: top`,
      ].join('; ');

      return `<span style="${herramientaStyles}">
        <img src="${iconUrl}" width="16" height="16" alt="${herramienta.nombre}" style="display: inline-block; vertical-align: middle; max-width: 16px; max-height: 16px;">
        ${escapeHtml(herramienta.nombre)}
      </span>`;
    })
    .join('');

  return `<table ${tableAttrs()} width="100%" style="margin: ${margin};">
  <tr>
    <td style="background-color: ${backgroundColorWithOpacity}; border-radius: ${borderRadius}px; border: 1px solid rgba(0,0,0,0.08); padding: ${padding};">
      <!-- Header -->
      ${headerHtml}
      
      <!-- Herramientas -->
      <table ${tableAttrs()} width="100%" style="margin-top: 20px;">
        <tr>
          <td>
            ${herramientasHtml}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}
