// Función auxiliar para determinar si un color es oscuro
export const isColorDark = (color: string): boolean => {
  // Si el color es en formato hex (#RRGGBB)
  if (color.startsWith("#")) {
    const r = Number.parseInt(color.slice(1, 3), 16)
    const g = Number.parseInt(color.slice(3, 5), 16)
    const b = Number.parseInt(color.slice(5, 7), 16)
    // Fórmula para calcular la luminosidad percibida
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
  }
  // Si el color es en formato rgb o rgba
  else if (color.startsWith("rgb")) {
    const match = color.match(/(\d+)/g)
    if (match && match.length >= 3) {
      const r = Number.parseInt(match[0])
      const g = Number.parseInt(match[1])
      const b = Number.parseInt(match[2])
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
    }
  }
  return false
}

// Función para generar el HTML de una nota individual
export const generateNoteHtml = (note: any, isColorDark: (color: string) => boolean) => {
  let noteHtml = ""

  // Determinar el estilo de fondo para esta nota
  let backgroundStyle = ""
  let textColorStyle = ""

  if (note.selectedBanner) {
    // Para imágenes de fondo
    backgroundStyle = `background-image: url('${note.selectedBanner}'); background-size: cover; background-position: center;`
    textColorStyle = "color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.5);"
  } else if (note.showGradient && note.gradientColors && note.gradientColors.length >= 2) {
    // Para gradientes
    backgroundStyle = `background: linear-gradient(to bottom, ${note.gradientColors[0]}, ${note.gradientColors[1]});`
    // Determinar si el gradiente es oscuro para usar texto claro
    const isFirstColorDark = isColorDark(note.gradientColors[0])
    const isSecondColorDark = isColorDark(note.gradientColors[1])
    if (isFirstColorDark || isSecondColorDark) {
      textColorStyle = "color: #ffffff;"
    }
  } else if (note.emailBackground) {
    // Para colores sólidos
    backgroundStyle = `background-color: ${note.emailBackground};`
    // Determinar si el color es oscuro para usar texto claro
    if (isColorDark(note.emailBackground)) {
      textColorStyle = "color: #ffffff;"
    }
  } else {
    backgroundStyle = "background-color: #ffffff;"
  }

  // Abrir el contenedor de la nota con su estilo de fondo
  noteHtml += `<div class="note-container" style="${backgroundStyle} ${textColorStyle} padding: 20px; margin-bottom: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">`
  noteHtml += `<div class="note-title" style="font-size: 20px; font-weight: bold; margin-bottom: 15px;">${note.title || "Untitled Note"}</div>`

  // Procesar cada componente en la nota
  note.objdata.forEach((component: any) => {
    switch (component.type) {
      case "category":
        const categoryColors = Array.isArray(component.props?.color)
          ? component.props.color
          : [component.props?.color || "#4caf50"]
        const categoryItems = component.props?.items || [component.content]

        noteHtml += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">\n`
        categoryItems.forEach((item: string, index: number) => {
          const itemColor = categoryColors[index % categoryColors.length] || "#4caf50"
          noteHtml += `<div style="display: inline-block; background-color: ${itemColor}; color: white; padding: 4px 12px; border-radius: 16px; font-size: 14px;">${item}</div>\n`
        })
        noteHtml += `</div>\n`
        break
      case "heading":
        const level = component.props?.level || 2
        noteHtml += `<h${level} style="margin: 15px 0; font-size: ${24 - level * 2}px;">${component.content}</h${level}>\n`
        break
      case "paragraph":
        if (component.props?.isCode) {
          noteHtml += `<div style="background-color: rgba(244, 244, 244, 0.8); padding: 16px; border-radius: 5px; border: 1px solid #eee; color: #333; font-family: monospace;">${component.content}</div>\n`
        } else {
          noteHtml += `<p style="margin: 10px 0;">${component.content}</p>\n`
        }
        break
      case "button":
        noteHtml += `<a href="#" style="display: inline-block; background-color: #3f51b5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 0;">${component.content}</a>\n`
        break
      case "divider":
        noteHtml += `<hr style="border: 0; border-top: 1px solid rgba(238, 238, 238, 0.4); margin: 20px 0;">\n`
        break
      case "bulletList":
        const items = component.props?.items || []
        noteHtml += `<ul style="padding-left: 20px; margin: 15px 0;">\n`
        items.forEach((item: string) => {
          noteHtml += `<li style="margin-bottom: 8px;">${item}</li>\n`
        })
        noteHtml += `</ul>\n`
        break
      case "image":
        noteHtml += `<div style="text-align: center; margin: 15px 0;"><img src="${component.props?.src || "/placeholder.svg"}" alt="${component.props?.alt || "Image"}" style="max-width: 100%; height: auto;"></div>\n`
        break
      case "spacer":
        noteHtml += `<div style="height: 32px;"></div>\n`
        break

      case "gallery":
        const galleryLayout = component.props?.layout || "single"
        const galleryImages = component.props?.images || []

        if (galleryLayout === "single" && galleryImages.length > 0) {
          // Diseño de una sola imagen
          noteHtml += `<div style="text-align: center; margin: 15px 0;"><img src="${galleryImages[0]?.src || "/placeholder.svg"}" alt="${galleryImages[0]?.alt || "Gallery image"}" style="max-width: 100%; height: auto; border-radius: 8px;"></div>\n`
        } else if (galleryLayout === "double" && galleryImages.length > 0) {
          // Diseño de dos imágenes lado a lado
          noteHtml += `<table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0;">
            <tr>
              <td width="50%" style="padding-right: 4px;">
                <img src="${galleryImages[0]?.src || "/placeholder.svg"}" alt="${galleryImages[0]?.alt || "Gallery image 1"}" style="width: 100%; height: auto; border-radius: 8px;">
              </td>
              <td width="50%" style="padding-left: 4px;">
                <img src="${galleryImages.length > 1 ? galleryImages[1]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 1 ? galleryImages[1]?.alt || "Gallery image 2" : "Gallery image 2"}" style="width: 100%; height: auto; border-radius: 8px;">
              </td>
            </tr>
          </table>\n`
        } else if (galleryLayout === "feature" && galleryImages.length > 0) {
          // Diseño de 3 imágenes con una destacada a la derecha
          noteHtml += `<table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0;">
            <tr>
              <td width="50%" valign="top">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding-right: 4px; padding-bottom: 4px;">
                      <img src="${galleryImages[0]?.src || "/placeholder.svg"}" alt="${galleryImages[0]?.alt || "Gallery image 1"}" style="width: 100%; height: auto; border-radius: 8px;">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-right: 4px; padding-top: 4px;">
                      <img src="${galleryImages.length > 1 ? galleryImages[1]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 1 ? galleryImages[1]?.alt || "Gallery image 2" : "Gallery image 2"}" style="width: 100%; height: auto; border-radius: 8px;">
                    </td>
                  </tr>
                </table>
              </td>
              <td width="50%" style="padding-left: 4px;">
                <img src="${galleryImages.length > 2 ? galleryImages[2]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 2 ? galleryImages[2]?.alt || "Gallery image 3" : "Gallery image 3"}" style="width: 100%; height: auto; border-radius: 8px;">
              </td>
            </tr>
          </table>\n`
        } else if (galleryLayout === "masonry" && galleryImages.length > 0) {
          // Diseño de 3 imágenes con una destacada a la izquierda
          noteHtml += `<table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0;">
            <tr>
              <td width="50%" style="padding-right: 4px;">
                <img src="${galleryImages[0]?.src || "/placeholder.svg"}" alt="${galleryImages[0]?.alt || "Gallery image 1"}" style="width: 100%; height: auto; border-radius: 8px;">
              </td>
              <td width="50%" valign="top">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="padding-left: 4px; padding-bottom: 4px;">
                      <img src="${galleryImages.length > 1 ? galleryImages[1]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 1 ? galleryImages[1]?.alt || "Gallery image 2" : "Gallery image 2"}" style="width: 100%; height: auto; border-radius: 8px;">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-left: 4px; padding-top: 4px;">
                      <img src="${galleryImages.length > 2 ? galleryImages[2]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 2 ? galleryImages[2]?.alt || "Gallery image 3" : "Gallery image 3"}" style="width: 100%; height: auto; border-radius: 8px;">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>\n`
        } else if (galleryLayout === "hero" && galleryImages.length > 0) {
          // Diseño de 3 imágenes con una grande arriba y dos pequeñas abajo
          noteHtml += `<table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0;">
            <tr>
              <td style="padding-bottom: 8px;">
                <img src="${galleryImages[0]?.src || "/placeholder.svg"}" alt="${galleryImages[0]?.alt || "Gallery image 1"}" style="width: 100%; height: auto; border-radius: 8px;">
              </td>
            </tr>
            <tr>
              <td>
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td width="50%" style="padding-right: 4px;">
                      <img src="${galleryImages.length > 1 ? galleryImages[1]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 1 ? galleryImages[1]?.alt || "Gallery image 2" : "Gallery image 2"}" style="width: 100%; height: auto; border-radius: 8px;">
                    </td>
                    <td width="50%" style="padding-left: 4px;">
                      <img src="${galleryImages.length > 2 ? galleryImages[2]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 2 ? galleryImages[2]?.alt || "Gallery image 3" : "Gallery image 3"}" style="width: 100%; height: auto; border-radius: 8px;">
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>\n`
        } else if (galleryLayout === "grid" && galleryImages.length > 0) {
          // Diseño de cuadrícula 2x2
          noteHtml += `<table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 15px 0;">
            <tr>
              <td width="50%" style="padding-right: 4px; padding-bottom: 8px;">
                <img src="${galleryImages[0]?.src || "/placeholder.svg"}" alt="${galleryImages[0]?.alt || "Gallery image 1"}" style="width: 100%; height: auto; border-radius: 8px;">
              </td>
              <td width="50%" style="padding-left: 4px; padding-bottom: 8px;">
                <img src="${galleryImages.length > 1 ? galleryImages[1]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 1 ? galleryImages[1]?.alt || "Gallery image 2" : "Gallery image 2"}" style="width: 100%; height: auto; border-radius: 8px;">
              </td>
            </tr>
            <tr>
              <td width="50%" style="padding-right: 4px; padding-top: 0px;">
                <img src="${galleryImages.length > 2 ? galleryImages[2]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 2 ? galleryImages[2]?.alt || "Gallery image 3" : "Gallery image 3"}" style="width: 100%; height: auto; border-radius: 8px;">
              </td>
              <td width="50%" style="padding-left: 4px; padding-top: 0px;">
                <img src="${galleryImages.length > 3 ? galleryImages[3]?.src : "/placeholder.svg"}" alt="${galleryImages.length > 3 ? galleryImages[3]?.alt || "Gallery image 4" : "Gallery image 4"}" style="width: 100%; height: auto; border-radius: 8px;">
              </td>
            </tr>
          </table>\n`
        }
        break
    }
  })

  // Cerrar el contenedor de la nota
  noteHtml += `</div>\n`

  return noteHtml
}

// Función para generar el HTML completo del newsletter
export const generateNewsletterHtml = (
  title: string,
  description: string,
  header: any,
  footer: any,
  selectedNotes: any[],
  isColorDark: (color: string) => boolean,
) => {
  // Start with basic HTML structure
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || "Newsletter"}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    .content-wrapper {
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .newsletter-header {
      text-align: ${header.alignment};
      margin-bottom: 0;
      background-color: ${header.backgroundColor};
      color: ${header.textColor};
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .newsletter-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .newsletter-subtitle {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .newsletter-description {
      font-size: 16px;
      color: #666;
      margin: 20px;
    }
    .notes-container {
      padding: 20px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: ${footer.textColor};
      padding: 20px;
      background-color: ${footer.backgroundColor};
      border-radius: 0 0 8px 8px;
    }
    .social-links {
      margin: 10px 0;
    }
    .social-link {
      display: inline-block;
      margin: 0 5px;
      color: ${footer.textColor};
      text-decoration: underline;
    }
    /* Estilos para tablas de galería */
    table.gallery-table {
      border-collapse: collapse;
      width: 100%;
      margin: 15px 0;
    }
    table.gallery-table td {
      padding: 4px;
    }
    table.gallery-table img {
      width: 100%;
      height: auto;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="content-wrapper">
    <div class="newsletter-header">
      ${header.logo ? `<img src="${header.logo}" alt="Logo" style="max-height: 50px; margin-bottom: 10px;"><br>` : ""}
      <div class="newsletter-title">${header.title || title || "Newsletter"}</div>
      ${header.subtitle ? `<div class="newsletter-subtitle">${header.subtitle}</div>` : ""}
      ${header.bannerImage ? `<img src="${header.bannerImage}" alt="Banner" style="width: 100%; margin-top: 10px;">` : ""}
    </div>
    
    ${description ? `<div class="newsletter-description">${description}</div>` : ""}
    
    <div class="notes-container">`

  // Add each note's content using the dedicated function
  selectedNotes.forEach((newsletterNote) => {
    html += generateNoteHtml(newsletterNote.noteData, isColorDark)
  })

  // Close notes container and add footer
  html += `</div>
    
    <div class="footer">
      <p style="margin: 5px 0;"><strong>${footer.companyName}</strong></p>
      ${footer.address ? `<p style="margin: 5px 0;">${footer.address}</p>` : ""}
      ${footer.contactEmail ? `<p style="margin: 5px 0;">Contact: <a href="mailto:${footer.contactEmail}" style="color: ${footer.textColor}">${footer.contactEmail}</a></p>` : ""}
      <div class="social-links">
        ${
          footer.socialLinks
            ?.map(
              (link: any) =>
                `<a href="${link.url}" class="social-link" target="_blank" style="color: ${footer.textColor};">${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}</a>`,
            )
            .join(" | ") || ""
        }
      </div>
      <p style="margin-top: 10px;">
        <a href="${footer.unsubscribeLink || "#"}" style="color: ${footer.textColor}">Unsubscribe</a> |
        <a href="#" style="color: ${footer.textColor}">View in browser</a>
      </p>
      <p style="margin: 5px 0;">© ${new Date().getFullYear()} ${footer.companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`

  return html
}
