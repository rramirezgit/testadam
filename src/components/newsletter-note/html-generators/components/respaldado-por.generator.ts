/**
 * Generador de HTML para componente RespaldadoPor
 * Muestra información de respaldo con avatares opcionales
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { escapeHtml } from '../utils/html-utils';
import { tableAttrs } from '../utils/outlook-helpers';

import type { EmailComponent } from '../types';

export function generateRespaldadoPorHtml(component: EmailComponent): string {
  // ✅ Props de la sección principal
  const texto = component.props?.texto || 'Respaldado por';
  const nombre = component.props?.nombre || component.content || 'Redacción';
  const avatarUrl = component.props?.avatarUrl || '';
  const avatarTamano = component.props?.avatarTamano || 21;

  // ✅ Props de la sección adicional (Escritor con Propietario)
  const mostrarEscritorPropietario = component.props?.mostrarEscritorPropietario || false;
  const escritorNombre = component.props?.escritorNombre || 'Escritor';
  const escritorAvatarUrl = component.props?.escritorAvatarUrl || '';
  const propietarioNombre = component.props?.propietarioNombre || 'Propietario';
  const propietarioAvatarUrl = component.props?.propietarioAvatarUrl || '';

  // ✅ Estilos configurables
  const backgroundColor = component.props?.backgroundColor || '#f5f5f5';
  const borderRadius = component.props?.borderRadius || '12px';
  const padding = component.props?.padding || '6px 10px';
  const fontSize = component.props?.fontSize || '13px';
  const textColor = component.props?.textColor || '#9e9e9e';
  const nameColor = component.props?.nameColor || '#616161';
  const margin = component.style?.margin || '20px 0';

  // Construir HTML
  return `<table ${tableAttrs()} width="100%" style="margin: ${margin};">
  <tr>
    <td style="text-align: left;">
      <div style="display: inline-flex; align-items: center; gap: 6px; padding: ${padding}; background-color: ${backgroundColor}; border-radius: ${borderRadius};">
        <span style="font-size: ${fontSize}; color: ${textColor}; line-height: 1; font-weight: 400; vertical-align: middle; margin: auto 0px;">${escapeHtml(texto)}</span>
        ${
          avatarUrl
            ? `<img src="${avatarUrl}" alt="${escapeHtml(nombre)}" style="width: ${avatarTamano}px; height: ${avatarTamano}px; border-radius: 50%; object-fit: cover; vertical-align: middle; display: inline-block; margin: 0 6px;">`
            : ''
        }
        <span style="font-size: ${fontSize}; color: ${nameColor}; font-weight: 400; line-height: 1; vertical-align: middle; margin: auto 0px;">${escapeHtml(nombre)}</span>
        ${
          mostrarEscritorPropietario
            ? `
        <!-- Sección Adicional: Escritor con Propietario (inline) -->
        <span style="font-size: ${fontSize}; line-height: 1; font-weight: 400; vertical-align: middle; margin: auto 0px;">Escritor con</span>
        ${
          escritorAvatarUrl
            ? `<img src="${escritorAvatarUrl}" alt="${escapeHtml(escritorNombre)}" style="width: 21px; height: 21px; border-radius: 50%; object-fit: cover; vertical-align: middle; display: inline-block;">`
            : ''
        }
        <span style="font-size: ${fontSize}; font-weight: 400; line-height: 1; vertical-align: middle; margin: auto 0px;">${escapeHtml(escritorNombre)}</span>
        ${
          propietarioAvatarUrl
            ? `<img src="${propietarioAvatarUrl}" alt="${escapeHtml(propietarioNombre)}" style="width: 21px; height: 21px; border-radius: 50%; object-fit: cover; vertical-align: middle; display: inline-block;">`
            : ''
        }
        <span style="font-size: ${fontSize}; font-weight: 400; line-height: 1; vertical-align: middle; margin: auto 0px;">${escapeHtml(propietarioNombre)}</span>`
            : ''
        }
      </div>
    </td>
  </tr>
</table>`;
}
