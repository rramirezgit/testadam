/**
 * Generador de HTML para componente Spacer
 * Crea espacios verticales configurables
 * Compatible con Gmail, Outlook y Apple Mail
 */

import type { EmailComponent } from '../types';

export function generateSpacerHtml(component: EmailComponent): string {
  // ✅ Altura configurable
  const height = component.props?.height || 20;

  // ✅ Para Outlook, usar tabla para garantizar el height
  return `
<!--[if mso]>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
  <tr>
    <td style="height: ${height}px; line-height: ${height}px; font-size: 1px;">&nbsp;</td>
  </tr>
</table>
<![endif]-->
<!--[if !mso]><!-->
<div class="component-spacer" style="height: ${height}px; line-height: ${height}px; font-size: 1px;">&nbsp;</div>
<!--<![endif]-->`;
}
