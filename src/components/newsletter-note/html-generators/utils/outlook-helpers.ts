/**
 * Helpers específicos para Microsoft Outlook
 * Incluye comentarios condicionales MSO y soluciones para bugs conocidos
 */

/**
 * Envuelve contenido en comentarios condicionales para Outlook
 */
export function wrapInMso(content: string): string {
  return `<!--[if mso]>${content}<![endif]-->`;
}

/**
 * Envuelve contenido en comentarios condicionales para NO Outlook
 */
export function wrapNotMso(content: string): string {
  return `<!--[if !mso]><!-->${content}<!--<![endif]-->`;
}

/**
 * Genera tabla wrapper para centrado en Outlook
 */
export function outlookCenterWrapper(content: string, width: string = '100%'): string {
  return `
    <!--[if mso]>
    <table role="presentation" width="${width}" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center">
    <![endif]-->
    ${content}
    <!--[if mso]>
        </td>
      </tr>
    </table>
    <![endif]-->
  `;
}

/**
 * Genera tabla wrapper para layout de columnas en Outlook
 */
export function outlookColumnsWrapper(
  leftContent: string,
  rightContent: string,
  leftWidth: string = '50%',
  rightWidth: string = '50%'
): string {
  return `
    <!--[if mso]>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="width: ${leftWidth}; vertical-align: top;">
    <![endif]-->
    ${leftContent}
    <!--[if mso]>
        </td>
        <td style="width: ${rightWidth}; vertical-align: top;">
    <![endif]-->
    ${rightContent}
    <!--[if mso]>
        </td>
      </tr>
    </table>
    <![endif]-->
  `;
}

/**
 * Genera meta tags específicos para Outlook
 */
export function outlookMetaTags(): string {
  return `
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
  `;
}

/**
 * Genera VML para botón con border-radius en Outlook
 */
export function outlookButtonVml(
  url: string,
  text: string,
  backgroundColor: string,
  textColor: string,
  width: number,
  height: number
): string {
  return `
    <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      href="${url}" 
      style="height:${height}px;v-text-anchor:middle;width:${width}px;" 
      arcsize="10%" 
      stroke="f" 
      fillcolor="${backgroundColor}">
      <w:anchorlock/>
      <center style="color:${textColor};font-family:sans-serif;font-size:16px;font-weight:bold;">
        ${text}
      </center>
    </v:roundrect>
    <![endif]-->
  `;
}

/**
 * Atributos de tabla para máxima compatibilidad
 */
export const TABLE_ATTRS = {
  role: 'presentation',
  cellspacing: '0',
  cellpadding: '0',
  border: '0',
} as const;

/**
 * Genera string de atributos de tabla
 */
export function tableAttrs(): string {
  return 'role="presentation" cellspacing="0" cellpadding="0" border="0"';
}

/**
 * Fix para height en celdas de Outlook
 */
export function outlookHeightFix(height: number): string {
  return `
    <!--[if mso]>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td style="height: ${height}px; line-height: ${height}px; font-size: 1px;">&nbsp;</td>
      </tr>
    </table>
    <![endif]-->
    <!--[if !mso]><!-->
    <div style="height: ${height}px; line-height: ${height}px; font-size: 1px;">&nbsp;</div>
    <!--<![endif]-->
  `;
}
