/**
 * Estilos CSS base para componentes de email
 * Estos estilos se aplicarán inline para máxima compatibilidad
 */

export const EMAIL_STYLES = {
  /**
   * Estilos para headings (h1-h6)
   */
  heading: (level: number) => ({
    fontSize: [28, 24, 20, 18, 16, 14][level - 1] + 'px',
    fontWeight: 'bold',
    lineHeight: '1.3',
    color: '#333333',
    margin: '16px 0',
    letterSpacing: '-0.25px',
  }),

  /**
   * Estilos para párrafos
   */
  paragraph: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#374151',
    margin: '16px 0 0 0',
  },

  /**
   * Estilos para listas
   */
  bulletList: {
    margin: '20px 0',
    paddingLeft: '24px',
  },

  bulletListItem: {
    margin: '10px 0',
    lineHeight: '1.6',
    color: '#374151',
  },

  /**
   * Estilos para divisores
   */
  divider: {
    border: 'none',
    borderTop: '2px solid #e0e0e0',
    margin: '30px 0',
    height: '1px',
  },

  /**
   * Estilos para imágenes
   */
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    display: 'block',
    margin: '0 auto',
  },

  imageWrapper: {
    textAlign: 'center' as const,
    margin: '25px 0',
  },

  /**
   * Estilos para botones
   */
  button: {
    display: 'inline-block',
    padding: '15px 30px',
    backgroundColor: '#1976d2',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '16px',
  },

  buttonWrapper: {
    textAlign: 'center' as const,
    margin: '25px 0',
  },

  /**
   * Estilos para categorías/tags
   */
  category: {
    display: 'inline-block',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    margin: '5px 5px 5px 0',
    textDecoration: 'none',
    lineHeight: '1.2',
    verticalAlign: 'top',
  },

  /**
   * Estilos para summary/cajas de resumen
   */
  summary: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.08)',
    margin: '25px 0',
    padding: '20px',
  },

  /**
   * Estilos para autor
   */
  author: {
    margin: '15px 0',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },

  /**
   * Tabla base para layouts (compatibilidad Outlook)
   */
  table: {
    cellspacing: '0',
    cellpadding: '0',
    border: '0',
    role: 'presentation',
  },
};

/**
 * Estilos específicos para tipos de summary
 */
export const SUMMARY_TYPES = {
  resumen: {
    label: 'Resumen',
    icon: 'mdi:note-text-outline',
    backgroundColor: '#f8f9fa',
    iconColor: '#6c757d',
    textColor: '#495057',
  },
  concepto: {
    label: 'Concepto',
    icon: 'mdi:lightbulb-outline',
    backgroundColor: '#e7f3ff',
    iconColor: '#0066cc',
    textColor: '#003d7a',
  },
  dato: {
    label: 'Dato',
    icon: 'mdi:lightbulb-on',
    backgroundColor: '#fff8e1',
    iconColor: '#f57c00',
    textColor: '#e65100',
  },
  tip: {
    label: 'TIP',
    icon: 'mdi:rocket-launch',
    backgroundColor: '#f3e5f5',
    iconColor: '#8e24aa',
    textColor: '#4a148c',
  },
  analogia: {
    label: 'Analogía',
    icon: 'mdi:brain',
    backgroundColor: '#e8f5e8',
    iconColor: '#388e3c',
    textColor: '#1b5e20',
  },
};

/**
 * Reset CSS para emails (aplicar en <head>)
 */
export const EMAIL_RESET_CSS = `
  /* Reset styles */
  body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
  
  /* Base styles */
  body {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333333;
  }
`;
