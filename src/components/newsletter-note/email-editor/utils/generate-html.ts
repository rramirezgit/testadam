import type { EmailComponent } from 'src/types/saved-note';
import type { BannerOption } from 'src/components/newsletter-note/banner-selector';

export async function generateEmailHtml(
  components: EmailComponent[],
  activeTemplate: string,
  selectedBanner: string | null,
  bannerOptions: BannerOption[],
  emailBackground: string,
  showGradient: boolean,
  gradientColors: string[]
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

    // Añadir contenido según el template con el fondo personalizado
    switch (activeTemplate) {
      case 'news':
        emailHtml += `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; ${backgroundStyle}">\n`;

        // Procesar componentes de noticias
        components.forEach((component) => {
          switch (component.type) {
            case 'category':
              const categoryColors = Array.isArray(component.props?.color)
                ? component.props.color
                : [component.props?.color || '#4caf50'];
              const categoryItems = component.props?.items || [component.content];

              emailHtml += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">\n`;
              categoryItems.forEach((item, index) => {
                const itemColor = categoryColors[index % categoryColors.length] || '#4caf50';
                emailHtml += `<div style="display: inline-block; background-color: ${itemColor}; color: white; padding: 4px 12px; border-radius: 16px; font-size: 14px;">${item}</div>\n`;
              });
              emailHtml += `</div>\n`;
              break;
            case 'heading':
              emailHtml += `<h${component.props?.level || 1} style="color: #333; font-size: ${component.props?.level === 1 ? '28px' : '22px'}; margin: 16px 0 20px 0; line-height: 1.3;">${component.content}</h${component.props?.level || 1}>\n`;
              break;
            case 'author':
              emailHtml += `<div style="color: #666; font-size: 14px; margin-bottom: 20px;">${component.props?.author ? component.props.author : component.content}${component.props?.date ? ` • ${component.props.date}` : ''}</div>\n`;
              break;
            case 'summary':
              emailHtml += `<div style="background-color: #f5f7fa; padding: 16px; border-left: 4px solid #4caf50; margin-bottom: 24px; border-radius: 4px;">
                <div style="font-weight: bold; margin-bottom: 8px; display: flex; align-items: center;">
                  ${component.props?.label || 'Resumen'}
                </div>
                <div style="color: #444; font-size: 15px;">${component.content}</div>
              </div>\n`;
              break;
            case 'paragraph':
              emailHtml += `<p style="color: #333; font-size: 16px; line-height: 1.6; margin: 16px 0;">${component.content}</p>\n`;
              break;
            case 'image':
              emailHtml += `<div style="text-align: center; margin: 24px 0;"><img src="${component.props?.src || '/placeholder.svg'}" alt="${component.props?.alt || 'Image'}" style="max-width: 100%; height: auto; border-radius: 8px;"></div>\n`;
              break;
            case 'button':
              emailHtml += `<div style="text-align: center; margin: 24px 0;">
                <a href="#" style="background-color: #4caf50; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; display: inline-block; font-weight: bold;">${component.content}</a>
              </div>\n`;
              break;
            case 'divider':
              emailHtml += `<hr style="border: 0; border-top: 1px solid #eaeaea; margin: 24px 0;">\n`;
              break;
            case 'bulletList':
              const items = component.props?.items || [];
              const listStyle = component.props?.listStyle || 'disc';
              const listColor = component.props?.listColor || '#000000';

              // Determinar si es una lista ordenada
              const isOrderedList =
                listStyle === 'decimal' ||
                listStyle === 'lower-alpha' ||
                listStyle === 'upper-alpha' ||
                listStyle === 'lower-roman' ||
                listStyle === 'upper-roman';

              // Para listas compatibles con email, usamos tablas
              let listHtml = '';

              items.forEach((item, index) => {
                if (isOrderedList) {
                  // Estilo para listas ordenadas con números/letras
                  const marker = getOrderedListMarker(index + 1, listStyle);

                  // Usar un formato altamente compatible con clientes de email
                  listHtml += `
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
                      <tbody>
                        <tr>
                          <td width="30" valign="top" style="padding-right:10px;">
                            <div style="background-color:${listColor};border-radius:50%;color:white;font-size:12px;font-weight:bold;height:24px;width:24px;line-height:24px;text-align:center;">${marker}</div>
                          </td>
                          <td valign="top">
                            <div style="font-size:14px;line-height:24px;margin:0;">${item}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  `;
                } else {
                  // Estilo para listas no ordenadas con diferentes tipos de viñetas
                  let bulletHtml = '';

                  // Usar formatos simples y altamente compatibles
                  if (listStyle === 'disc' || listStyle === 'circle') {
                    // Círculo sólido o hueco
                    bulletHtml = `<div style="background-color:${listStyle === 'disc' ? listColor : 'transparent'};border:${listStyle === 'circle' ? `1px solid ${listColor}` : '0'};border-radius:50%;height:8px;width:8px;margin-top:8px;"></div>`;
                  } else if (listStyle === 'square') {
                    // Cuadrado
                    bulletHtml = `<div style="background-color:${listColor};height:8px;width:8px;margin-top:8px;"></div>`;
                  } else {
                    // Bullet estándar como fallback
                    bulletHtml = `<div style="font-size:18px;line-height:18px;color:${listColor};">&bull;</div>`;
                  }

                  // Usar un formato altamente compatible con clientes de email
                  listHtml += `
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
                      <tbody>
                        <tr>
                          <td width="30" valign="top" style="padding-right:10px;">
                            <div style="text-align:center;">${bulletHtml}</div>
                          </td>
                          <td valign="top">
                            <div style="font-size:14px;line-height:24px;margin:0;">${item}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  `;
                }
              });

              emailHtml += listHtml;
              break;
            case 'spacer':
              emailHtml += `<div style="height: 32px;"></div>\n`;
              break;
            case 'gallery':
              const galleryLayout = component.props?.layout || 'single';
              const galleryImages = component.props?.images || [];

              if (galleryLayout === 'single' && galleryImages.length > 0) {
                emailHtml += `<div style="text-align: center; margin: 24px 0;"><img src="${galleryImages[0]?.src || '/placeholder.svg'}" alt="${galleryImages[0]?.alt || 'Gallery image'}" style="max-width: 100%; height: auto; border-radius: 8px;"></div>\n`;
              } else if (galleryLayout === 'double' && galleryImages.length > 0) {
                emailHtml += `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;"><tr>`;
                for (let i = 0; i < Math.min(2, galleryImages.length); i++) {
                  emailHtml += `<td width="50%" style="padding: 0 4px;"><img src="${galleryImages[i]?.src || '/placeholder.svg'}" alt="${galleryImages[i]?.alt || `Gallery image ${i + 1}`}" style="width: 100%; height: auto; border-radius: 8px;"></td>`;
                }
                emailHtml += `</tr></table>\n`;
              } else if (galleryLayout === 'grid' && galleryImages.length > 0) {
                emailHtml += `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 24px 0;">`;
                for (let row = 0; row < 2; row++) {
                  emailHtml += `<tr>`;
                  for (let col = 0; col < 2; col++) {
                    const idx = row * 2 + col;
                    if (idx < galleryImages.length) {
                      emailHtml += `<td width="50%" style="padding: 4px;"><img src="${galleryImages[idx]?.src || '/placeholder.svg'}" alt="${galleryImages[idx]?.alt || `Gallery image ${idx + 1}`}" style="width: 100%; height: auto; border-radius: 8px;"></td>`;
                    } else {
                      emailHtml += `<td width="50%" style="padding: 4px;"></td>`;
                    }
                  }
                  emailHtml += `</tr>`;
                }
                emailHtml += `</table>\n`;
              }
              break;
          }
        });

        emailHtml += `<div style="color: #898989; font-size: 12px; line-height: 22px; margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center;">
          © ${new Date().getFullYear()} Nuestro Boletín de Noticias. Todos los derechos reservados.<br>
          Si no deseas recibir más emails como este, puedes <a href="#" style="color: #4caf50; text-decoration: underline;">darte de baja</a>.
        </div>\n`;
        emailHtml += `</div>\n`;
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
            case 'spacer':
              emailHtml += `<div style="height: 32px;"></div>\n`;
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
            case 'spacer':
              emailHtml += `<div style="height: 32px;"></div>\n`;
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
            case 'spacer':
              emailHtml += `<div style="height: 32px;"></div>\n`;
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
            case 'spacer':
              emailHtml += `<tr><td style="height: 32px;"></td></tr>\n`;
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
