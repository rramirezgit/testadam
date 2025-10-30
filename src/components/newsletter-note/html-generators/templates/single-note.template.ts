/**
 * Template para nota individual (sin header y footer de newsletter)
 * Usa los mismos estilos de componentes que el newsletter
 */

import { escapeHtml } from '../utils/html-utils';
import { EMAIL_RESET_CSS } from '../utils/email-styles';
import { outlookMetaTags } from '../utils/outlook-helpers';

import type { ContainerConfig } from '../types';

export function generateSingleNoteTemplate(
  noteTitle: string,
  noteDescription: string,
  componentsHtml: string,
  containerConfig?: ContainerConfig
): string {
  // ✅ Configuración del contenedor con valores por defecto
  const config = {
    borderWidth: containerConfig?.borderWidth ?? 1,
    borderColor: containerConfig?.borderColor ?? '#e5e7eb',
    borderRadius: containerConfig?.borderRadius ?? 12,
    padding: containerConfig?.padding ?? 30,
    maxWidth: containerConfig?.maxWidth ?? 560,
  };

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(noteTitle)}</title>
  ${outlookMetaTags()}
  <style type="text/css">
    ${EMAIL_RESET_CSS}
    
    body {
      background-color: #f8f9fa !important;
    }
    
    /* Container principal - CONFIGURABLE */
    .email-container {
      max-width: ${config.maxWidth}px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: ${config.borderRadius}px;
      border: ${config.borderWidth}px solid ${config.borderColor};
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    /* Contenido de la nota - CONFIGURABLE */
    .note-content {
      padding: ${config.padding}px;
    }
    
    /* Note title */
    .note-title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 20px 0;
      line-height: 1.3;
      letter-spacing: -0.25px;
    }
    
    /* Note description */
    .note-description {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 32px 0;
      line-height: 1.5;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 20px 10px !important;
        border-radius: ${Math.max(config.borderRadius - 4, 0)}px !important;
        max-width: calc(100% - 20px) !important;
      }
      
      .note-content {
        padding: ${Math.max(config.padding - 10, 10)}px !important;
      }
      
      .note-title {
        font-size: 20px !important;
      }
      
      .note-description {
        font-size: 15px !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="note-content">
      <div class="components">
        ${componentsHtml}
      </div>
    </div>
  </div>
</body>
</html>`;
}
