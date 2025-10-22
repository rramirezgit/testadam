/**
 * Generador de HTML para componente Summary (Cajas de resumen)
 * Soporta diferentes tipos: resumen, concepto, dato, tip, analogía
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { SUMMARY_TYPES } from '../utils/email-styles';
import { tableAttrs } from '../utils/outlook-helpers';
import { getIconUrl, cleanTipTapHtml } from '../utils/html-utils';

import type { EmailComponent } from '../types';

export function generateSummaryHtml(component: EmailComponent): string {
  // ✅ Obtener tipo de summary
  const summaryType = component.props?.summaryType || 'resumen';
  const typeConfig =
    SUMMARY_TYPES[summaryType as keyof typeof SUMMARY_TYPES] || SUMMARY_TYPES.resumen;

  // ✅ Usar valores personalizados o por defecto
  const backgroundColor = component.props?.backgroundColor || typeConfig.backgroundColor;
  const iconColor = component.props?.iconColor || typeConfig.iconColor;
  const textColor = component.props?.textColor || typeConfig.textColor;
  const icon = component.props?.icon || typeConfig.icon;
  const label = component.props?.label || typeConfig.label;

  // ✅ Obtener URL del icono (compatible con emails)
  const iconUrl = getIconUrl(icon);

  const content = cleanTipTapHtml(component.content || '');

  // ✅ Estilos configurables
  const borderRadius = component.props?.borderRadius || '12px';
  const padding = component.props?.padding || '20px';
  const margin = component.style?.margin || '25px 0';

  // Construir HTML usando tabla para máxima compatibilidad
  return `<table ${tableAttrs()} width="100%" style="margin: ${margin};">
  <tr>
    <td>
      <div style="
        background-color: ${backgroundColor};
        border-radius: ${borderRadius};
        border: 1px solid rgba(0,0,0,0.08);
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      ">
        <!-- Header -->
        <table ${tableAttrs()} width="100%">
          <tr>
            <td style="
              padding: 16px 20px 12px 20px;
              border-bottom: 1px solid rgba(0,0,0,0.05);
            ">
              <table ${tableAttrs()}>
                <tr>
                  <td style="
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background-color: rgba(255,255,255,0.7);
                    border: 1px solid rgba(255,255,255,0.3);
                    text-align: center;
                    vertical-align: middle;
                  ">
                    <img src="${iconUrl}" width="18" height="18" alt="${label}" style="display: block; margin: auto;">
                  </td>
                  <td style="padding-left: 12px; vertical-align: middle;">
                    <span style="
                      color: ${textColor};
                      font-weight: 600;
                      font-size: 16px;
                      letter-spacing: -0.01em;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                    ">${label}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Contenido -->
        <table ${tableAttrs()} width="100%">
          <tr>
            <td style="padding: 16px 20px 20px 20px;">
              <div style="
                color: #6c757d;
                font-size: 15px;
                line-height: 1.6;
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
              ">${content}</div>
            </td>
          </tr>
        </table>
      </div>
    </td>
  </tr>
</table>`;
}
