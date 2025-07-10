import type { EmailComponent } from 'src/types/saved-note';
import type { BannerOption } from 'src/components/newsletter-note/banner-selector';

export async function generateEmailHtml(
  components: EmailComponent[],
  activeTemplate: string,
  selectedBanner: string | null,
  bannerOptions: BannerOption[],
  emailBackground: string,
  showGradient: boolean,
  gradientColors: string[],
  containerBorderWidth?: number,
  containerBorderColor?: string,
  containerBorderRadius?: number,
  containerPadding?: number,
  containerMaxWidth?: number
): Promise<string> {
  try {
    console.log(
      'Generando HTML para template:',
      activeTemplate,
      'con',
      components.length,
      'componentes'
    );

    // Crear HTML básico con estructura limpia para emails
    let emailHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
    img { border: 0; display: block; outline: none; text-decoration: none; }
    table { border-collapse: collapse; }
    .container { max-width: 600px; margin: 0 auto; }
  </style>
</head>
<body>`;

    // Determinar el estilo de fondo basado en la selección
    let backgroundStyle = '';
    if (selectedBanner) {
      const banner = bannerOptions.find((b) => b.id === selectedBanner);
      if (banner) {
        if (banner.gradient) {
          backgroundStyle = `background: linear-gradient(to bottom, ${banner.gradient[0]}, ${banner.gradient[1]});`;
        } else if (banner.pattern) {
          // Aplicar patrones como fondos
          if (banner.pattern === 'dots') {
            backgroundStyle = `background-color: ${banner.color}; background-image: radial-gradient(#00000010 1px, transparent 1px); background-size: 10px 10px;`;
          } else if (banner.pattern === 'lines') {
            backgroundStyle = `background-color: ${banner.color}; background-image: linear-gradient(#00000010 1px, transparent 1px); background-size: 100% 10px;`;
          }
        } else {
          backgroundStyle = `background-color: ${banner.color};`;
        }
      } else {
        backgroundStyle = `background-color: ${emailBackground};`;
      }
    } else if (showGradient) {
      backgroundStyle = `background: linear-gradient(to bottom, ${gradientColors[0]}, ${gradientColors[1]});`;
    } else {
      backgroundStyle = `background-color: ${emailBackground};`;
    }

    // Configurar estilos del contenedor
    const containerStyles = {
      borderWidth: containerBorderWidth ?? 1,
      borderColor: containerBorderColor ?? '#e0e0e0',
      borderRadius: containerBorderRadius ?? 12,
      padding: containerPadding ?? 10,
      maxWidth: containerMaxWidth ?? 560,
    };

    // Crear tabla principal para compatibilidad con clientes de email
    emailHtml += `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${backgroundStyle}">
  <tr>
    <td align="center" style="padding: 20px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: ${containerStyles.maxWidth}px; width: 100%; background-color: white; border-radius: ${containerStyles.borderRadius}px; border: ${containerStyles.borderWidth}px solid ${containerStyles.borderColor};">
        <tr>
          <td style="padding: ${containerStyles.padding}px;">`;

    // Procesar componentes según el template
    switch (activeTemplate) {
      case 'news':
      case 'blank':
      default:
        // Procesar componentes
        components.forEach((component) => {
          emailHtml += generateComponentHtml(component);
        });
        break;
    }

    // Cerrar estructura de tabla
    emailHtml += `
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

    // Limpiar HTML final
    const cleanHtml = emailHtml
      .replace(/\n\s*\n/g, '\n') // Eliminar líneas vacías múltiples
      .replace(/\s+/g, ' ') // Normalizar espacios
      .replace(/>\s+</g, '><') // Eliminar espacios entre tags
      .trim();

    console.log('✅ HTML generado exitosamente, longitud:', cleanHtml.length);
    return cleanHtml;
  } catch (error) {
    console.error('❌ Error generando HTML:', error);
    throw new Error('Error al generar el HTML del email');
  }
}

// Función auxiliar para generar HTML de componentes individuales
function generateComponentHtml(component: EmailComponent): string {
  switch (component.type) {
    case 'heading': {
      const level = component.props?.level || 2;
      return `<h${level} style="color: #333; margin: 16px 0; line-height: 1.3; font-weight: bold;">${escapeHtml(component.content)}</h${level}>`;
    }

    case 'paragraph': {
      return `<p style="color: #333; font-size: 16px; line-height: 1.6; margin: 16px 0;">${escapeHtml(component.content)}</p>`;
    }

    case 'image': {
      const src = component.props?.src || '/placeholder.svg';
      const alt = component.props?.alt || 'Image';
      return `<div style="text-align: center; margin: 24px 0;"><img src="${src}" alt="${escapeHtml(alt)}" style="max-width: 100%; height: auto; border-radius: 8px;"></div>`;
    }

    case 'button': {
      const href = component.props?.href || '#';
      const bgColor = component.props?.backgroundColor || '#4caf50';
      const textColor = component.props?.textColor || 'white';
      return `<div style="text-align: center; margin: 24px 0;"><a href="${href}" style="background-color: ${bgColor}; color: ${textColor}; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">${escapeHtml(component.content)}</a></div>`;
    }

    case 'divider': {
      return `<hr style="border: 0; border-top: 1px solid #eaeaea; margin: 24px 0;">`;
    }

    case 'summary': {
      const summaryBgStyle = component.props?.useGradient
        ? `background: ${
            component.props?.gradientType === 'linear'
              ? `linear-gradient(${component.props?.gradientDirection || 'to right'}, ${component.props?.gradientColor1 || '#f5f7fa'}, ${component.props?.gradientColor2 || '#c3cfe2'})`
              : `radial-gradient(circle, ${component.props?.gradientColor1 || '#f5f7fa'}, ${component.props?.gradientColor2 || '#c3cfe2'})`
          };`
        : `background-color: ${component.props?.backgroundColor || '#f5f7fa'};`;

      const iconColor = component.props?.iconColor || '#000000';
      const iconSize = component.props?.iconSize || '24px';
      const titleColor = component.props?.titleColor || '#000000';
      const titleFontWeight = component.props?.titleFontWeight || 'normal';
      const borderColor = component.props?.borderColor || '#4caf50';
      const icon = component.props?.icon || 'mdi:text-box-outline';

      return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="${summaryBgStyle} border-left: 4px solid ${borderColor}; margin: 24px 0; border-radius: 4px;">
        <tr>
          <td style="padding: 16px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="vertical-align: middle; padding-right: 8px;">
                  <img src="https://api.iconify.design/${icon.replace(':', '/')}.svg?color=${encodeURIComponent(iconColor)}&height=${iconSize}" width="${iconSize}" height="${iconSize}" alt="${component.props?.label || 'Resumen'}" style="display: block;">
                </td>
                <td style="vertical-align: middle;">
                  <div style="font-weight: ${titleFontWeight}; color: ${titleColor}; margin-bottom: 8px;">${escapeHtml(component.props?.label || 'Resumen')}</div>
                </td>
              </tr>
            </table>
            <div style="color: #444; font-size: 15px; line-height: 1.5;">${escapeHtml(component.content)}</div>
          </td>
        </tr>
      </table>`;
    }

    case 'category': {
      const categoryColor = component.props?.color || '#4caf50';
      const categoryItems = component.props?.items || [component.content];
      const borderRadius = component.props?.borderRadius || 16;
      const padding = component.props?.padding || 4;
      const textColor = component.props?.textColor || 'white';
      const fontWeight = component.props?.fontWeight || 'normal';
      const fontSize = component.props?.fontSize || 14;

      let categoryHtml = '<div style="margin: 16px 0;">';

      if (Array.isArray(categoryItems)) {
        categoryItems.forEach((item, index) => {
          const itemColor = Array.isArray(categoryColor)
            ? categoryColor[index % categoryColor.length]
            : categoryColor;

          categoryHtml += `<span style="display: inline-block; background-color: ${itemColor}; color: ${textColor}; padding: ${padding}px ${padding * 3}px; border-radius: ${borderRadius}px; font-size: ${fontSize}px; font-weight: ${fontWeight}; margin: 0 4px 4px 0;">${escapeHtml(item)}</span>`;
        });
      } else {
        categoryHtml += `<span style="display: inline-block; background-color: ${categoryColor}; color: ${textColor}; padding: ${padding}px ${padding * 3}px; border-radius: ${borderRadius}px; font-size: ${fontSize}px; font-weight: ${fontWeight};">${escapeHtml(component.content)}</span>`;
      }

      categoryHtml += '</div>';
      return categoryHtml;
    }

    case 'bulletList': {
      const items = component.props?.items || [];
      if (items.length === 0) return '';

      let listHtml = '<ul style="margin: 16px 0; padding-left: 24px;">';
      items.forEach((item) => {
        listHtml += `<li style="margin-bottom: 8px; color: #333; line-height: 1.5;">${escapeHtml(item)}</li>`;
      });
      listHtml += '</ul>';
      return listHtml;
    }

    case 'spacer': {
      const height = component.props?.height || 32;
      return `<div style="height: ${height}px; line-height: ${height}px; font-size: 1px;">&nbsp;</div>`;
    }

    default:
      return `<div style="background-color: #fff3e0; border-left: 3px solid #ff9800; padding: 15px; margin: 15px 0; border-radius: 0 4px 4px 0;"><strong style="color: #f57c00;">Componente: ${component.type}</strong><br><span style="color: #333333;">${escapeHtml(component.content || 'Sin contenido disponible')}</span></div>`;
  }
}

// Función para escapar HTML
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Función auxiliar para generar el marcador de lista ordenada
const getOrderedListMarker = (index: number, listStyle: string): string => {
  switch (listStyle) {
    case 'decimal':
      return `${index}`;
    case 'lower-alpha':
      // Letras minúsculas (a, b, c...)
      return `${String.fromCharCode(96 + index)}`;
    case 'upper-alpha':
      // Letras mayúsculas (A, B, C...)
      return `${String.fromCharCode(64 + index)}`;
    case 'lower-roman':
      // Números romanos minúsculos (i, ii, iii...)
      return `${toRoman(index).toLowerCase()}`;
    case 'upper-roman':
      // Números romanos mayúsculos (I, II, III...)
      return `${toRoman(index)}`;
    default:
      return `${index}`;
  }
};

// Función para convertir números a numerales romanos
const toRoman = (num: number): string => {
  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' },
  ];

  let result = '';
  let remaining = num;

  for (const { value, numeral } of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
};
