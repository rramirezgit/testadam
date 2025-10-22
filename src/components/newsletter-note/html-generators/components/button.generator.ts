/**
 * Generador de HTML para componente Button
 * Usa tablas para máxima compatibilidad con Outlook
 * Compatible con Gmail, Outlook y Apple Mail
 */

import { cleanTipTapHtml } from '../utils/html-utils';
import { tableAttrs } from '../utils/outlook-helpers';

import type { EmailComponent } from '../types';

export function generateButtonHtml(component: EmailComponent): string {
  // ✅ Props del botón
  const buttonText = component.content || 'Button';
  const buttonUrl = component.props?.url || '#';

  // ✅ Estilos configurables
  const backgroundColor =
    component.props?.backgroundColor || component.style?.backgroundColor || '#1976d2';
  const textColor = component.props?.textColor || component.style?.color || '#ffffff';
  const padding = component.props?.padding || '15px 30px';
  const borderRadius = component.props?.borderRadius || '6px';
  const fontSize = component.props?.fontSize || '16px';
  const fontWeight = component.props?.fontWeight || '600';
  const margin = component.style?.margin || '25px 0';

  // Estilos inline del enlace (botón)
  const buttonStyles = [
    `display: inline-block`,
    `padding: ${padding}`,
    `background-color: ${backgroundColor}`,
    `color: ${textColor} !important`,
    `text-decoration: none`,
    `border-radius: ${borderRadius}`,
    `font-weight: ${fontWeight}`,
    `font-size: ${fontSize}`,
  ].join('; ');

  const content = cleanTipTapHtml(buttonText);

  // ✅ Usar tabla para máxima compatibilidad (especialmente Outlook)
  return `<table ${tableAttrs()} width="100%" style="margin: ${margin};">
  <tr>
    <td class="component-button" style="text-align: center;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${buttonUrl}" style="height:50px;v-text-anchor:middle;width:200px;" arcsize="12%" stroke="f" fillcolor="${backgroundColor}">
        <w:anchorlock/>
        <center style="color:${textColor};font-family:sans-serif;font-size:${fontSize};font-weight:${fontWeight};">
          ${content}
        </center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${buttonUrl}" style="${buttonStyles}">${content}</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
}
