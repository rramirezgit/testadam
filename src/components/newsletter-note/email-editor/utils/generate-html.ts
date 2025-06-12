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

    // Crear HTML básico manualmente para asegurar que tenemos algo válido
    let emailHtml =
      '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>Email Template</title>\n</head>\n<body>\n';

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

    // Añadir contenido según el template con el fondo personalizado
    switch (activeTemplate) {
      case 'news':
        emailHtml += `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; ${backgroundStyle}">\n`;
        emailHtml += `<div style="max-width: ${containerStyles.maxWidth}px; margin: 0 auto; padding: ${containerStyles.padding}px; border-radius: ${containerStyles.borderRadius}px; border: ${containerStyles.borderWidth}px solid ${containerStyles.borderColor};">\n`;

        // Procesar componentes de noticias
        components.forEach((component) => {
          switch (component.type) {
            case 'heading': {
              const level = component.props?.level || 2;
              emailHtml += `<h${level} style="color: #333; margin-bottom: 16px; line-height: 1.3;">${component.content}</h${level}>\n`;
              break;
            }

            case 'paragraph': {
              emailHtml += `<p style="color: #333; font-size: 16px; line-height: 1.6; margin: 16px 0;">${component.content}</p>\n`;
              break;
            }

            case 'image': {
              emailHtml += `<div style="text-align: center; margin: 24px 0;"><img src="${component.props?.src || '/placeholder.svg'}" alt="${component.props?.alt || 'Image'}" style="max-width: 100%; height: auto; border-radius: 8px;"></div>\n`;
              break;
            }

            case 'button': {
              emailHtml += `<div style="text-align: center; margin: 24px 0;">
                <a href="#" style="background-color: #4caf50; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">${component.content}</a>
              </div>\n`;
              break;
            }

            case 'divider': {
              emailHtml += `<hr style="border: 0; border-top: 1px solid #eaeaea; margin: 24px 0;">\n`;
              break;
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
              const titleFontFamily = component.props?.titleFontFamily || 'inherit';
              const borderColor = component.props?.borderColor || '#4caf50';

              emailHtml += `<div style="${summaryBgStyle} padding: 16px; border-left: 4px solid ${borderColor}; margin-bottom: 24px; border-radius: 4px;">
                <div style="font-weight: ${titleFontWeight}; margin-bottom: 8px; display: flex; align-items: center; color: ${titleColor}; font-family: ${titleFontFamily};">
                  <img src="https://api.iconify.design/${(component.props?.icon || 'mdi:text-box-outline').replace(':', '/')}.svg?color=${encodeURIComponent(iconColor)}&height=${iconSize}" style="margin-right: 8px;" width="${iconSize}" height="${iconSize}" />
                  ${component.props?.label || 'Resumen'}
                </div>
                <div style="color: #444; font-size: 15px;">${component.content}</div>
              </div>\n`;
              break;
            }

            case 'category': {
              const categoryColor = component.props?.color || '#4caf50';
              const categoryItems = component.props?.items || [component.content];
              // Obtener las propiedades de estilo
              const borderRadius = component.props?.borderRadius || 16;
              const padding = component.props?.padding || 4;
              const textColor = component.props?.textColor || 'white';
              const fontWeight = component.props?.fontWeight || 'bold';
              const fontSize = component.props?.fontSize || 14;

              emailHtml += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">\n`;

              if (Array.isArray(categoryItems)) {
                categoryItems.forEach((item, index) => {
                  const itemColor = Array.isArray(categoryColor)
                    ? categoryColor[index % categoryColor.length]
                    : categoryColor;

                  emailHtml += `<span style="display: inline-block; background-color: ${itemColor}; color: ${textColor}; padding: ${padding}px ${padding * 3}px; border-radius: ${borderRadius}px; font-size: ${fontSize}px; font-weight: ${fontWeight};">${item}</span>\n`;
                });
              } else {
                emailHtml += `<span style="display: inline-block; background-color: ${categoryColor}; color: ${textColor}; padding: ${padding}px ${padding * 3}px; border-radius: ${borderRadius}px; font-size: ${fontSize}px; font-weight: ${fontWeight};">${component.content}</span>\n`;
              }

              emailHtml += `</div>\n`;
              break;
            }

            case 'author': {
              emailHtml += `<div style="margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: bold; color: #555;">${component.props?.author || 'Author'}</span>
                ${component.props?.date ? `<span style="color: #777; font-size: 14px;">${component.props.date}</span>` : ''}
                <span style="color: #777; font-size: 14px;">${component.content}</span>
              </div>\n`;
              break;
            }

            case 'bulletList': {
              const items = component.props?.items || [];
              if (items.length > 0) {
                emailHtml += '<ul style="margin: 16px 0; padding-left: 24px;">\n';
                items.forEach((item) => {
                  emailHtml += `<li style="margin-bottom: 8px; color: #333;">${item}</li>\n`;
                });
                emailHtml += '</ul>\n';
              }
              break;
            }

            case 'gallery': {
              const images = component.props?.images || [];
              if (images.length > 0) {
                emailHtml +=
                  '<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 24px 0;">\n';
                images.forEach((img) => {
                  const imgWidth = 100 / Math.min(images.length, 3);
                  emailHtml += `<div style="flex: 0 0 ${imgWidth}%; max-width: ${imgWidth}%;">
                    <img src="${img.src}" alt="${img.alt || ''}" style="width: 100%; border-radius: 4px; height: auto;">
                  </div>\n`;
                });
                emailHtml += '</div>\n';
              }
              break;
            }

            case 'spacer': {
              const height = component.props?.height || 32;
              emailHtml += `<div style="height: ${height}px;"></div>\n`;
              break;
            }

            case 'tituloConIcono': {
              const icon = component.props?.icon || 'mdi:newspaper-variant-outline';
              const gradientType = component.props?.gradientType || 'linear';
              const gradientColor1 = component.props?.gradientColor1 || '#4facfe';
              const gradientColor2 = component.props?.gradientColor2 || '#00f2fe';
              const textColor = component.props?.textColor || '#ffffff';

              const gradientStyle =
                gradientType === 'linear'
                  ? `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`
                  : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`;

              emailHtml += `<div style="background: ${gradientStyle}; padding: 12px 16px; border-radius: 8px 8px 0 0; margin-bottom: 0; display: flex; align-items: center;">
                <img src="https://api.iconify.design/${icon.replace(':', '/')}.svg?color=${encodeURIComponent(textColor)}" style="margin-right: 12px; width: 24px; height: 24px;" />
                <h2 style="margin: 0; color: ${textColor}; font-weight: bold; font-size: 20px;">${component.content}</h2>
              </div>\n`;
              break;
            }

            case 'respaldadoPor': {
              const texto = component.props?.texto || 'Respaldado por';
              const nombre = component.props?.nombre || 'Redacción';
              const avatarUrl = component.props?.avatarUrl || '/default-avatar.png';
              const avatarTamano = component.props?.avatarTamano || 36;

              emailHtml += `<div style="display: flex; align-items: center; gap: 8px; margin: 16px 0;">
                <span style="color: #666; font-size: 14px;">${texto}</span>
                <img src="${avatarUrl}" alt="${nombre}" style="width: ${avatarTamano}px; height: ${avatarTamano}px; border-radius: 50%;" />
                <span style="font-weight: 500;">${nombre}</span>
              </div>\n`;
              break;
            }

            default: {
              break;
            }
          }
        });

        emailHtml += `<div style="color: #898989; font-size: 12px; line-height: 22px; margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center;">
          © ${new Date().getFullYear()} Nuestro Boletín de Noticias. Todos los derechos reservados.<br>
          Si no deseas recibir más emails como este, puedes <a href="#" style="color: #4caf50; text-decoration: underline;">darte de baja</a>.
        </div>\n`;
        emailHtml += `</div>\n`; // Cerrar contenedor interno
        emailHtml += `</div>\n`; // Cerrar contenedor principal
        break;

      case 'notion':
        emailHtml += `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; ${backgroundStyle}">\n`;
        // Procesar componentes
        components.forEach((component) => {
          switch (component.type) {
            case 'heading':
              emailHtml += `<h${component.props?.level || 1} style="color: #333; font-size: ${component.props?.level === 1 ? '24px' : '20px'}; margin: 40px 0;">${component.content}</h${component.props?.level || 1}>\n`;
              break;
            case 'paragraph':
              if (component.props?.isCode) {
                emailHtml += `<div style="background-color: #f4f4f4; padding: 16px; border-radius: 5px; border: 1px solid #eee; color: #333; font-family: monospace;">${component.content}</div>\n`;
              } else {
                emailHtml += `<p style="color: #333; font-size: 14px; margin: 24px 0;">${component.content}</p>\n`;
              }
              break;
            case 'button':
              emailHtml += `<a href="https://notion.so" style="background-color: #2754C5; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block;">${component.content}</a>\n`;
              break;
            case 'divider':
              emailHtml += `<hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;">\n`;
              break;
            case 'bulletList':
              const items = component.props?.items || [];
              emailHtml += `<ul style="padding-left: 20px;">\n`;
              items.forEach((item) => {
                emailHtml += `  <li style="margin-bottom: 8px;">${item}</li>\n`;
              });
              emailHtml += `</ul>\n`;
              break;
            case 'image':
              emailHtml += `<div style="text-align: center; margin: 20px 0;"><img src="${component.props?.src || '/placeholder.svg'}" alt="${component.props?.alt || 'Image'}" style="max-width: 100%; height: auto;"></div>\n`;
              break;
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
              const titleFontFamily = component.props?.titleFontFamily || 'inherit';
              const borderColor = component.props?.borderColor || '#2754C5';

              emailHtml += `<div style="${summaryBgStyle} padding: 16px; border-left: 4px solid ${borderColor}; margin-bottom: 24px; border-radius: 4px;">
                <div style="font-weight: ${titleFontWeight}; margin-bottom: 8px; display: flex; align-items: center; color: ${titleColor}; font-family: ${titleFontFamily};">
                  <img src="https://api.iconify.design/${(component.props?.icon || 'mdi:text-box-outline').replace(':', '/')}.svg?color=${encodeURIComponent(iconColor)}&height=${iconSize}" style="margin-right: 8px;" width="${iconSize}" height="${iconSize}" />
                  ${component.props?.label || 'Resumen'}
                </div>
                <div style="color: #333; font-size: 14px;">${component.content}</div>
              </div>\n`;
              break;
            }
            case 'spacer':
              emailHtml += `<div style="height: 32px;"></div>\n`;
              break;
            default:
              // Handle unknown component types
              break;
          }
        });
        emailHtml += `<div style="color: #898989; font-size: 12px; line-height: 22px; margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px;">
        <a href="https://notion.so" style="color: #2754C5; text-decoration: underline;">Notion.so</a>, the all-in-one-workspace<br>
        for your notes, tasks, wikis, and databases.
      </div>\n`;
        emailHtml += `</div>\n`;
        break;

      case 'plaid':
        emailHtml += `<div style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 0; ${backgroundStyle}">\n`;
        emailHtml += `<div style="background-color: #ffffff; border: 1px solid #eee; border-radius: 5px; box-shadow: 0 5px 10px rgba(20,50,70,.2); margin: 20px auto; max-width: 360px; padding: 68px 0 130px;">\n`;
        emailHtml += `<div style="margin: 0 auto; text-align: center;"><img src="https://plaid.com/assets/img/logo-dark.svg" width="212" height="88" alt="Plaid"></div>\n`;

        // Procesar componentes
        components.forEach((component) => {
          switch (component.type) {
            case 'heading':
              emailHtml += `<div style="color: #0a85ea; font-size: 11px; font-weight: 700; height: 16px; letter-spacing: 0; line-height: 16px; margin: 16px 8px 8px 8px; text-transform: uppercase; text-align: center;">${component.content}</div>\n`;
              break;
            case 'paragraph':
              if (component.props?.isCode) {
                emailHtml += `<div style="background: rgba(0,0,0,.05); border-radius: 4px; margin: 16px auto 14px; vertical-align: middle; width: 280px;">
                <div style="color: #000; display: inline-block; font-family: HelveticaNeue-Bold; font-size: 32px; font-weight: 700; letter-spacing: 6px; line-height: 40px; padding: 8px 0; margin: 0 auto; width: 100%; text-align: center;">${component.content}</div>\n`;
              } else {
                emailHtml += `<p style="color: #444; font-size: 15px; letter-spacing: 0; line-height: 23px; padding: 0 40px; margin: 0; text-align: center;">${component.content}</p>\n`;
              }
              break;
            case 'button':
              emailHtml += `<div style="text-align: center; margin: 20px 0;">
              <a href="#" style="background-color: #0a85ea; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block;">${component.content}</a>
            </div>\n`;
              break;
            case 'divider':
              emailHtml += `<hr style="border-color: #eee; margin: 20px 0;">\n`;
              break;
            case 'bulletList':
              const items = component.props?.items || [];
              emailHtml += `<ul style="padding-left: 20px;">\n`;
              items.forEach((item) => {
                emailHtml += `  <li style="color: #444; font-size: 15px; margin: 8px 0; text-align: left;">${item}</li>\n`;
              });
              emailHtml += `</ul>\n`;
              break;
            case 'image':
              emailHtml += `<div style="text-align: center; margin: 20px 0;"><img src="${component.props?.src || '/placeholder.svg'}" alt="${component.props?.alt || 'Image'}" style="max-width: 100%; height: auto;"></div>\n`;
              break;
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
              const titleFontFamily = component.props?.titleFontFamily || 'inherit';
              const borderColor = component.props?.borderColor || '#0a85ea';

              emailHtml += `<tr><td style="padding: 0 20px;"><div style="${summaryBgStyle} padding: 16px; border-left: 4px solid ${borderColor}; margin: 20px 0; border-radius: 4px;">
                <div style="font-weight: ${titleFontWeight}; margin-bottom: 8px; display: flex; align-items: center; color: ${titleColor}; font-family: ${titleFontFamily};">
                  <img src="https://api.iconify.design/${(component.props?.icon || 'mdi:text-box-outline').replace(':', '/')}.svg?color=${encodeURIComponent(iconColor)}&height=${iconSize}" style="margin-right: 8px;" width="${iconSize}" height="${iconSize}" />
                  ${component.props?.label || 'Resumen'}
                </div>
                <div style="font-size: 16px; line-height: 1.5; margin: 0;">${component.content}</div>
              </div></td></tr>\n`;
              break;
            }
            case 'spacer':
              emailHtml += `<div style="height: 32px;"></div>\n`;
              break;
            case 'tituloConIcono': {
              const icon = component.props?.icon || 'mdi:newspaper-variant-outline';
              const gradientType = component.props?.gradientType || 'linear';
              const gradientColor1 = component.props?.gradientColor1 || '#4facfe';
              const gradientColor2 = component.props?.gradientColor2 || '#00f2fe';
              const textColor = component.props?.textColor || '#ffffff';

              const gradientStyle =
                gradientType === 'linear'
                  ? `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`
                  : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`;

              emailHtml += `<div style="background: ${gradientStyle}; padding: 12px 16px; border-radius: 8px 8px 0 0; margin: 20px auto; max-width: 280px; display: flex; align-items: center;">
                <img src="https://api.iconify.design/${icon.replace(':', '/')}.svg?color=${encodeURIComponent(textColor)}" style="margin-right: 12px; width: 24px; height: 24px;" />
                <h2 style="margin: 0; color: ${textColor}; font-weight: bold; font-size: 20px; text-align: left;">${component.content}</h2>
              </div>\n`;
              break;
            }
            case 'respaldadoPor': {
              const texto = component.props?.texto || 'Respaldado por';
              const nombre = component.props?.nombre || 'Redacción';
              const avatarUrl = component.props?.avatarUrl || '/default-avatar.png';
              const avatarTamano = component.props?.avatarTamano || 36;

              emailHtml += `<div style="display: flex; align-items: center; gap: 8px; margin: 16px auto; max-width: 280px;">
                <span style="color: #666; font-size: 14px;">${texto}</span>
                <img src="${avatarUrl}" alt="${nombre}" style="width: ${avatarTamano}px; height: ${avatarTamano}px; border-radius: 50%;" />
                <span style="font-weight: 500;">${nombre}</span>
              </div>\n`;
              break;
            }
            default:
              // Handle unknown component types
              break;
          }
        });

        emailHtml += `</div>\n`;
        emailHtml += `<div style="color: #000; font-size: 12px; font-weight: 800; letter-spacing: 0; line-height: 23px; margin: 20px 0 0; text-align: center; text-transform: uppercase;">Securely powered by Plaid.</div>\n`;
        emailHtml += `</div>\n`;
        break;

      case 'stripe':
        emailHtml += `<div style="background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; margin: 0; padding: 0; ${backgroundStyle}">\n`;
        emailHtml += `<div style="background-color: #ffffff; margin: 0 auto; padding: 20px 0 48px; margin-bottom: 64px; max-width: 600px;">\n`;
        emailHtml += `<div style="padding: 0 48px;">\n`;
        emailHtml += `<img src="https://stripe.com/img/v3/home/twitter.png" width="49" height="21" alt="Stripe">\n`;
        emailHtml += `<hr style="border-color: #e6ebf1; margin: 20px 0;">\n`;

        // Procesar componentes
        components.forEach((component) => {
          switch (component.type) {
            case 'heading':
              emailHtml += `<h${component.props?.level || 1} style="color: #525f7f; font-size: 24px; font-weight: bold; margin: 30px 0;">${component.content}</h${component.props?.level || 1}>\n`;
              break;
            case 'paragraph':
              emailHtml += `<p style="color: #525f7f; font-size: 16px; line-height: 24px; text-align: left;">${component.content}</p>\n`;
              break;
            case 'button':
              emailHtml += `<a href="https://dashboard.stripe.com/login" style="background-color: #656ee8; border-radius: 5px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; text-align: center; display: block; width: 100%; padding: 10px;">${component.content}</a>\n`;
              break;
            case 'divider':
              emailHtml += `<hr style="border-color: #e6ebf1; margin: 20px 0;">\n`;
              break;
            case 'bulletList':
              const items = component.props?.items || [];
              emailHtml += `<ul style="padding-left: 20px;">\n`;
              items.forEach((item) => {
                emailHtml += `  <li style="color: #525f7f; font-size: 16px; line-height: 24px; margin: 8px 0;">${item}</li>\n`;
              });
              emailHtml += `</ul>\n`;
              break;
            case 'image':
              emailHtml += `<div style="text-align: center; margin: 20px 0;"><img src="${component.props?.src || '/placeholder.svg'}" alt="${component.props?.alt || 'Image'}" style="max-width: 100%; height: auto;"></div>\n`;
              break;
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
              const titleFontFamily = component.props?.titleFontFamily || 'inherit';
              const borderColor = component.props?.borderColor || '#656ee8';

              emailHtml += `<div style="${summaryBgStyle} padding: 16px; border-left: 4px solid ${borderColor}; margin-bottom: 24px; border-radius: 4px;">
                <div style="font-weight: ${titleFontWeight}; margin-bottom: 8px; display: flex; align-items: center; color: ${titleColor}; font-family: ${titleFontFamily};">
                  <img src="https://api.iconify.design/${(component.props?.icon || 'mdi:text-box-outline').replace(':', '/')}.svg?color=${encodeURIComponent(iconColor)}&height=${iconSize}" style="margin-right: 8px;" width="${iconSize}" height="${iconSize}" />
                  ${component.props?.label || 'Resumen'}
                </div>
                <div style="color: #525f7f; font-size: 16px; line-height: 24px; text-align: left;">${component.content}</div>
              </div>\n`;
              break;
            }
            case 'spacer':
              emailHtml += `<div style="height: 32px;"></div>\n`;
              break;
            case 'tituloConIcono': {
              const icon = component.props?.icon || 'mdi:newspaper-variant-outline';
              const gradientType = component.props?.gradientType || 'linear';
              const gradientColor1 = component.props?.gradientColor1 || '#4facfe';
              const gradientColor2 = component.props?.gradientColor2 || '#00f2fe';
              const textColor = component.props?.textColor || '#ffffff';

              const gradientStyle =
                gradientType === 'linear'
                  ? `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`
                  : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`;

              emailHtml += `<div style="background: ${gradientStyle}; padding: 12px 16px; border-radius: 8px 8px 0 0; margin-bottom: 0; display: flex; align-items: center;">
                <img src="https://api.iconify.design/${icon.replace(':', '/')}.svg?color=${encodeURIComponent(textColor)}" style="margin-right: 12px; width: 24px; height: 24px;" />
                <h2 style="margin: 0; color: ${textColor}; font-weight: bold; font-size: 20px;">${component.content}</h2>
              </div>\n`;
              break;
            }
            case 'respaldadoPor': {
              const texto = component.props?.texto || 'Respaldado por';
              const nombre = component.props?.nombre || 'Redacción';
              const avatarUrl = component.props?.avatarUrl || '/default-avatar.png';
              const avatarTamano = component.props?.avatarTamano || 36;

              emailHtml += `<div style="display: flex; align-items: center; gap: 8px; margin: 16px 0;">
                <span style="color: #525f7f; font-size: 14px;">${texto}</span>
                <img src="${avatarUrl}" alt="${nombre}" style="width: ${avatarTamano}px; height: ${avatarTamano}px; border-radius: 50%;" />
                <span style="font-weight: 500; color: #525f7f;">${nombre}</span>
              </div>\n`;
              break;
            }
            default:
              // Handle unknown component types
              break;
          }
        });

        emailHtml += `<hr style="border-color: #e6ebf1; margin: 20px 0;">\n`;
        emailHtml += `<p style="color: #8898aa; font-size: 12px, line-height: 16px;">Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080

You received this email because you're a Stripe user.
</p>\n`;
        emailHtml += `</div>\n`;
        emailHtml += `</div>\n`;
        emailHtml += `<div style="margin: 0 auto; max-width: 600px; padding: 0 48px;">\n`;
        emailHtml += `<p style="color: #aab7c4; font-size: 11px; line-height: 16px; margin-bottom: 0; text-align: center;">© 2024 Stripe</p>\n`;
        emailHtml += `</div>\n`;
        emailHtml += `</div>\n`;
        break;

      case 'vercel':
        emailHtml += `<div style="background-color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin: 0; padding: 0; ${backgroundStyle}">\n`;
        emailHtml += `<table width="100%" border="0" cellspacing="0" cellpadding="0">\n`;
        emailHtml += `<tr>\n`;
        emailHtml += `<td align="center" style="padding: 10px 0;">\n`;
        emailHtml += `<table width="600" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #ddd;">\n`;
        emailHtml += `<tr>\n`;
        emailHtml += `<td style="padding: 20px; text-align: left;">\n`;
        emailHtml += `<img src="https://assets.vercel.com/image/upload/v1587460039/www/logo-dark.png" alt="Vercel" width="80" />\n`;
        emailHtml += `</td>\n`;
        emailHtml += `</tr>\n`;

        // Procesar componentes
        components.forEach((component) => {
          switch (component.type) {
            case 'heading':
              emailHtml += `<tr><td style="padding: 0 20px;"><h${component.props?.level || 1} style="font-size: 24px; font-weight: bold; margin: 20px 0;">${component.content}</h${component.props?.level || 1}></td></tr>\n`;
              break;
            case 'paragraph':
              emailHtml += `<tr><td style="padding: 0 20px;"><p style="font-size: 16px; line-height: 1.5; margin: 20px 0;">${component.content}</p></td></tr>\n`;
              break;
            case 'button':
              emailHtml += `<tr><td style="padding: 20px; text-align: center;">
              <a href="https://vercel.com" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">${component.content}</a>
            </td></tr>\n`;
              break;
            case 'divider':
              emailHtml += `<tr><td style="padding: 0 20px;"><hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;"></td></tr>\n`;
              break;
            case 'bulletList':
              const items = component.props?.items || [];
              emailHtml += `<tr><td style="padding: 0 20px;"><ul style="padding-left: 20px;">\n`;
              items.forEach((item) => {
                emailHtml += `  <li style="font-size: 16px; line-height: 1.5; margin: 10px 0;">${item}</li>\n`;
              });
              emailHtml += `</ul></td></tr>\n`;
              break;
            case 'image':
              emailHtml += `<tr><td style="padding: 20px; text-align: center;"><img src="${component.props?.src || '/placeholder.svg'}" alt="${component.props?.alt || 'Image'}" style="max-width: 100%; height: auto;"></td></tr>\n`;
              break;
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
              const titleFontFamily = component.props?.titleFontFamily || 'inherit';
              const borderColor = component.props?.borderColor || '#000000';

              emailHtml += `<tr><td style="padding: 0 20px;"><div style="${summaryBgStyle} padding: 16px; border-left: 4px solid ${borderColor}; margin: 20px 0; border-radius: 4px;">
                <div style="font-weight: ${titleFontWeight}; margin-bottom: 8px; display: flex; align-items: center; color: ${titleColor}; font-family: ${titleFontFamily};">
                  <img src="https://api.iconify.design/${(component.props?.icon || 'mdi:text-box-outline').replace(':', '/')}.svg?color=${encodeURIComponent(iconColor)}&height=${iconSize}" style="margin-right: 8px;" width="${iconSize}" height="${iconSize}" />
                  ${component.props?.label || 'Resumen'}
                </div>
                <div style="font-size: 16px; line-height: 1.5; margin: 0;">${component.content}</div>
              </div></td></tr>\n`;
              break;
            }
            case 'spacer':
              emailHtml += `<tr><td style="height: 32px;"></td></tr>\n`;
              break;
            case 'tituloConIcono': {
              const icon = component.props?.icon || 'mdi:newspaper-variant-outline';
              const gradientType = component.props?.gradientType || 'linear';
              const gradientColor1 = component.props?.gradientColor1 || '#4facfe';
              const gradientColor2 = component.props?.gradientColor2 || '#00f2fe';
              const textColor = component.props?.textColor || '#ffffff';

              const gradientStyle =
                gradientType === 'linear'
                  ? `linear-gradient(to right, ${gradientColor1}, ${gradientColor2})`
                  : `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`;

              emailHtml += `<tr><td style="padding: 0 20px;">
                <div style="background: ${gradientStyle}; padding: 12px 16px; border-radius: 8px 8px 0 0; margin: 20px 0; display: flex; align-items: center;">
                  <img src="https://api.iconify.design/${icon.replace(':', '/')}.svg?color=${encodeURIComponent(textColor)}" style="margin-right: 12px; width: 24px; height: 24px;" />
                  <h2 style="margin: 0; color: ${textColor}; font-weight: bold; font-size: 20px;">${component.content}</h2>
                </div>
              </td></tr>\n`;
              break;
            }
            case 'respaldadoPor': {
              const texto = component.props?.texto || 'Respaldado por';
              const nombre = component.props?.nombre || 'Redacción';
              const avatarUrl = component.props?.avatarUrl || '/default-avatar.png';
              const avatarTamano = component.props?.avatarTamano || 36;

              emailHtml += `<tr><td style="padding: 0 20px;">
                <div style="display: flex; align-items: center; gap: 8px; margin: 16px 0;">
                  <span style="color: #525f7f; font-size: 14px;">${texto}</span>
                  <img src="${avatarUrl}" alt="${nombre}" style="width: ${avatarTamano}px; height: ${avatarTamano}px; border-radius: 50%;" />
                  <span style="font-weight: 500; color: #525f7f;">${nombre}</span>
                </div>
              </td></tr>\n`;
              break;
            }
            default:
              // Handle unknown component types
              break;
          }
        });

        emailHtml += `<tr>\n`;
        emailHtml += `<td style="padding: 20px; text-align: center; font-size: 12px; color: #888;">\n`;
        emailHtml += `Vercel Inc. • San Francisco, CA\n`;
        emailHtml += `</td>\n`;
        emailHtml += `</tr>\n`;
        emailHtml += `</table>\n`;
        emailHtml += `</td>\n`;
        emailHtml += `</tr>\n`;
        emailHtml += `</table>\n`;
        emailHtml += `</div>\n`;
        break;

      default:
        emailHtml += '<div>No template selected</div>';
    }

    emailHtml += '</body>\n</html>';

    return emailHtml;
  } catch (error) {
    console.error('Error generating email HTML:', error);
    throw error;
  }
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
