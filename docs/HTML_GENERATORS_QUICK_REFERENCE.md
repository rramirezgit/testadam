# Referencia Rápida: Generadores HTML

## 🚀 Quick Start

### Importación Básica

```typescript
import { 
  renderComponentToHtml,
  generateNewsletterTemplate 
} from './html-generators';
import type { EmailComponent } from './html-generators/types';
```

### Generar HTML de un Componente

```typescript
const component: EmailComponent = {
  id: 'heading-1',
  type: 'heading',
  content: 'Mi Título',
  props: { level: 1 },
  style: { color: '#1976d2' }
};

const html = renderComponentToHtml(component);
```

---

## 📋 Tipos de Componentes Disponibles

### Componentes Básicos

| Type | Descripción | Props Principales |
|------|-------------|-------------------|
| `heading` | Títulos h1-h6 | `level` (1-6) |
| `paragraph` | Párrafos de texto | `isCode` (boolean) |
| `bulletList` | Listas con bullets | `items` (string[]) |
| `divider` | Línea divisora | `height`, `color` |
| `image` | Imagen responsive | `src`, `alt`, `link` |
| `spacer` | Espaciado vertical | `height` |

### Componentes de Contenido

| Type | Descripción | Props Principales |
|------|-------------|-------------------|
| `button` | Botón con link | `url`, `backgroundColor`, `textColor` |
| `category` | Tags/categorías | `color`, `textColor`, `categorias[]` |
| `summary` | Caja de resumen | `type` (resumen/concepto/dato/tip/analogia) |
| `author` | Info de autor | `name`, `avatar`, `bio` |
| `gallery` | Galería de imágenes | `images[]` (src, alt, link) |

### Componentes Complejos

| Type | Descripción | Props Principales |
|------|-------------|-------------------|
| `imageText` | Imagen + texto | `imageUrl`, `titleContent`, `layout`, `imageWidth` |
| `tituloConIcono` | Título con icono | `icon`, `textColor`, `iconSize`, `fontSize` |
| `textWithIcon` | Texto con icono | `icon`, `iconColor`, `backgroundColor` |
| `herramientas` | Lista de herramientas | `herramientas[]` |
| `respaldadoPor` | Sponsors | `sponsors[]` |
| `twoColumns` | 2-3 columnas | `numberOfColumns`, `layout`, `columns[]` |
| `noteContainer` | Contenedor anidado | `componentsData[]`, `noteTitle` |

### Componentes Estructurales

| Type | Descripción | Props Principales |
|------|-------------|-------------------|
| `newsletterHeaderReusable` | Header completo | Ver HeaderConfig |
| `newsletterFooterReusable` | Footer completo | Ver FooterConfig |

---

## 🎨 Props Comunes por Componente

### `heading`

```typescript
{
  level: 1,                    // 1-6 (h1, h2, h3, etc.)
  style: {
    color: '#333',
    textAlign: 'center',       // 'left', 'center', 'right'
    fontSize: '28px'
  }
}
```

### `paragraph`

```typescript
{
  isCode: false,               // true = estilo monospace
  style: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#374151',
    margin: '16px 0'
  }
}
```

### `image`

```typescript
{
  src: 'https://example.com/image.jpg',
  alt: 'Descripción',
  link: 'https://example.com',  // Opcional
  width: '100%',
  height: 'auto',
  style: {
    borderRadius: '8px',
    margin: '25px 0'
  }
}
```

### `button`

```typescript
{
  url: 'https://example.com',
  backgroundColor: '#1976d2',
  textColor: '#ffffff',
  padding: '15px 30px',
  borderRadius: '6px',
  fontWeight: '600',
  fontSize: '16px'
}
```

### `category`

```typescript
// Single category
{
  color: '#e3f2fd',
  textColor: '#1976d2',
  borderRadius: 16,
  padding: 4,
  fontSize: 14
}

// Multiple categories
{
  categorias: [
    { texto: 'IA', colorFondo: '#e3f2fd', colorTexto: '#1976d2' },
    { texto: 'ML', colorFondo: '#f3e5f5', colorTexto: '#8e24aa' }
  ]
}
```

### `summary`

```typescript
{
  type: 'resumen',  // 'resumen', 'concepto', 'dato', 'tip', 'analogia'
  backgroundColor: '#f8fafc',
  borderRadius: 12,
  padding: 20
}
```

### `imageText`

```typescript
{
  imageUrl: 'https://example.com/image.jpg',
  imageAlt: 'Descripción',
  titleContent: '<p>Título</p>',
  layout: 'image-left',        // 'image-left', 'image-right', 'image-top', 'image-bottom'
  imageWidth: 40,              // Porcentaje (solo para layouts horizontales)
  spacing: 16,                 // Espaciado entre imagen y texto
  borderRadius: 8,
  padding: 16,
  backgroundColor: '#ffffff',
  textColor: '#333333',
  titleColor: '#000000',
  fontSize: 14,
  titleSize: 20,
  
  // Avanzado
  imageHeight: 'auto',         // o '200px'
  imageObjectFit: 'contain',   // 'contain', 'cover', 'fill'
  imageBackgroundColor: 'transparent',
  borderColor: 'transparent',
  borderWidth: 0
}
```

### `tituloConIcono`

```typescript
{
  icon: 'chart-line',          // URL o nombre de icon
  textColor: '#00C3C3',
  iconSize: 24,
  fontSize: '20px',
  fontWeight: 'bold',
  borderRadius: '8px',
  padding: '16px 20px'
}
```

### `twoColumns` / `multiColumns`

```typescript
{
  numberOfColumns: 2,          // 2 o 3
  layout: 'image-top',         // 'image-left', 'image-right', 'image-top', 'image-bottom'
  spacing: 16,
  borderRadius: 8,
  backgroundColor: '#ffffff',
  textColor: '#333333',
  titleColor: '#000000',
  fontSize: 14,
  titleSize: 18,
  padding: 16,
  imageWidth: 40,              // Para layouts horizontales
  imageHeight: 'auto',
  imageObjectFit: 'contain',
  
  columns: [
    {
      imageUrl: 'https://example.com/col1.jpg',
      imageAlt: 'Columna 1',
      titleContent: '<p>Título Columna 1</p>',
      content: '<p>Descripción columna 1</p>'
    },
    {
      imageUrl: 'https://example.com/col2.jpg',
      imageAlt: 'Columna 2',
      titleContent: '<p>Título Columna 2</p>',
      content: '<p>Descripción columna 2</p>'
    }
  ]
}
```

### `noteContainer`

```typescript
{
  noteTitle: 'Título del Contenedor',
  containerStyle: {
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px',
    backgroundColor: '#ffffff'
  },
  componentsData: [
    { id: '1', type: 'heading', content: 'Subtítulo', props: { level: 3 } },
    { id: '2', type: 'paragraph', content: 'Texto dentro' }
  ]
}
```

---

## 📐 Templates

### Newsletter Completo

```typescript
import { generateNewsletterTemplate } from './html-generators';
import type { HeaderConfig, FooterConfig } from './html-generators/types';

const headerConfig: HeaderConfig = {
  title: 'Newsletter Semanal',
  subtitle: 'Edición #42',
  backgroundColor: '#1976d2',
  textColor: '#ffffff',
  alignment: 'center',
  logo: 'https://example.com/logo.png',
  showLogo: true,
  logoHeight: 60,
  showBanner: false,
  bannerImage: '',
  padding: 40,
  
  // Gradiente (opcional)
  useGradient: true,
  gradientColors: ['#1976d2', '#64b5f6'],
  gradientDirection: 180,
  
  // Sponsor (opcional)
  sponsor: {
    enabled: true,
    label: 'Juntos con',
    image: 'https://example.com/sponsor.png',
    imageAlt: 'Sponsor'
  }
};

const footerConfig: FooterConfig = {
  companyName: 'Mi Empresa',
  address: 'Calle 123, Ciudad',
  contactEmail: 'contact@example.com',
  backgroundColor: '#333333',
  textColor: '#ffffff',
  showAddress: true,
  showSocial: true,
  showLogo: true,
  logo: 'https://example.com/logo.png',
  logoHeight: 40,
  padding: 40,
  fontSize: 14,
  footerText: 'Texto adicional del footer',
  
  // Redes sociales
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/...', enabled: true },
    { platform: 'twitter', url: 'https://twitter.com/...', enabled: true },
    { platform: 'linkedin', url: 'https://linkedin.com/...', enabled: true },
    { platform: 'facebook', url: 'https://facebook.com/...', enabled: false }
  ],
  
  // Gradiente (opcional)
  useGradient: false,
  gradientColors: ['#333333', '#555555'],
  gradientDirection: 180
};

const componentsHtml = `<h1>Contenido aquí</h1>`;

const fullHtml = generateNewsletterTemplate(
  'Newsletter Enero 2025',
  'Últimas novedades',
  componentsHtml,
  headerConfig,
  footerConfig
);
```

### Nota Individual

```typescript
import { generateSingleNoteTemplate } from './html-generators';
import type { ContainerConfig } from './html-generators/types';

const containerConfig: ContainerConfig = {
  borderWidth: 1,
  borderColor: '#e5e7eb',
  borderRadius: 12,
  padding: 30,
  maxWidth: 560
};

const componentsHtml = `<h1>Contenido de la nota</h1>`;

const html = generateSingleNoteTemplate(
  'Título de la Nota',
  'Descripción de la nota',
  componentsHtml,
  containerConfig
);
```

---

## 🛠️ Utilidades

### Escapar HTML

```typescript
import { escapeHtml } from './html-generators/utils/html-utils';

const safe = escapeHtml('<script>alert("xss")</script>');
// Resultado: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### Limpiar HTML de TipTap

```typescript
import { cleanTipTapHtml } from './html-generators/utils/html-utils';

const html = '<p class="tiptap">Texto con <strong>negrita</strong></p>';
const clean = cleanTipTapHtml(html);
// Resultado: "Texto con <strong>negrita</strong>"
```

### Convertir Estilos a String

```typescript
import { stylesToString } from './html-generators/utils/html-utils';

const styles = { fontSize: '16px', color: '#333', textAlign: 'center' };
const css = stylesToString(styles);
// Resultado: "font-size: 16px; color: #333; text-align: center"
```

### Convertir HEX a RGBA

```typescript
import { hexToRgba } from './html-generators/utils/html-utils';

const rgba = hexToRgba('#1976d2', 50);
// Resultado: "rgba(25, 118, 210, 0.5)"
```

### Procesar URL de Icono

```typescript
import { getIconUrl } from './html-generators/utils/html-utils';

// URL completa (se devuelve tal cual)
getIconUrl('https://example.com/icon.png');
// Resultado: "https://example.com/icon.png"

// Formato iconify
getIconUrl('mdi:rocket-launch');
// Resultado: "https://img.icons8.com/color/48/rocket-launch.png"

// Nombre directo (icons8)
getIconUrl('chart-line');
// Resultado: "https://img.icons8.com/color/48/chart-line.png"
```

---

## 🎯 Patterns Comunes

### Pattern 1: Lista de Componentes

```typescript
const components: EmailComponent[] = [
  { id: '1', type: 'heading', content: 'Título', props: { level: 1 } },
  { id: '2', type: 'paragraph', content: 'Párrafo 1' },
  { id: '3', type: 'paragraph', content: 'Párrafo 2' },
  { id: '4', type: 'button', content: 'Acción', props: { url: 'https://...' } }
];

const html = components.map(c => renderComponentToHtml(c)).join('\n');
```

### Pattern 2: Componente Condicional

```typescript
function renderConditional(showImage: boolean): string {
  const components: EmailComponent[] = [];
  
  if (showImage) {
    components.push({
      id: 'img-1',
      type: 'image',
      props: { src: 'https://...', alt: 'Imagen' }
    });
  }
  
  components.push({
    id: 'text-1',
    type: 'paragraph',
    content: 'Texto siempre visible'
  });
  
  return components.map(c => renderComponentToHtml(c)).join('\n');
}
```

### Pattern 3: Loop de Datos

```typescript
interface Product {
  name: string;
  image: string;
  description: string;
  price: string;
}

function renderProducts(products: Product[]): string {
  const components: EmailComponent[] = products.map((product, idx) => ({
    id: `product-${idx}`,
    type: 'imageText',
    content: `<p>${product.description}</p><p><strong>Precio: ${product.price}</strong></p>`,
    props: {
      imageUrl: product.image,
      imageAlt: product.name,
      titleContent: `<p>${product.name}</p>`,
      layout: 'image-left',
      imageWidth: 30
    }
  }));
  
  return components.map(c => renderComponentToHtml(c)).join('\n');
}
```

### Pattern 4: Sección con Header

```typescript
function renderSection(title: string, items: string[]): string {
  const components: EmailComponent[] = [
    {
      id: 'section-title',
      type: 'heading',
      content: title,
      props: { level: 2 }
    },
    {
      id: 'section-divider',
      type: 'divider'
    },
    {
      id: 'section-list',
      type: 'bulletList',
      props: { items }
    }
  ];
  
  return components.map(c => renderComponentToHtml(c)).join('\n');
}
```

---

## 🐛 Troubleshooting Rápido

### Problema: Imagen no se muestra

**Solución**: Usa URL absoluta

```typescript
// ❌ Mal
props: { src: '/images/logo.png' }

// ✅ Bien
props: { src: 'https://example.com/images/logo.png' }
```

### Problema: Estilos no se aplican

**Solución**: Usa estilos inline (los generadores ya lo hacen)

```typescript
// ✅ Los generadores convierten automáticamente
style: { fontSize: '16px', color: '#333' }
// → "font-size: 16px; color: #333"
```

### Problema: Layout de columnas se rompe en mobile

**Solución**: Los generadores incluyen CSS responsive automáticamente

```typescript
// ✅ Ya incluido en generateMultiColumnsHtml
@media only screen and (max-width: 600px) {
  .mobile-column {
    width: 100% !important;
  }
}
```

### Problema: Outlook no respeta border-radius

**Solución**: Usa `outlookButtonVml` para botones o acepta que Outlook tiene limitaciones

```typescript
// Los generadores ya usan VML cuando es necesario
// Para otros elementos, Outlook simplemente ignora border-radius
```

---

## 📱 Testing Checklist

Prueba tu HTML en:

- [ ] Gmail (web)
- [ ] Gmail (app iOS/Android)
- [ ] Outlook (desktop)
- [ ] Outlook.com (web)
- [ ] Apple Mail (iOS/macOS)
- [ ] Yahoo Mail
- [ ] Protonmail

**Herramientas**:
- [Litmus](https://litmus.com/)
- [Email on Acid](https://www.emailonacid.com/)
- [Can I Email](https://www.caniemail.com/)

---

## 🔗 Enlaces Útiles

- **Documentación completa**: `HTML_GENERATORS_INTEGRATION_GUIDE.md`
- **Ejemplo de adaptador**: `OBJDATAWEB_ADAPTER_EXAMPLE.ts`
- **Tipos TypeScript**: `html-generators/types.ts`
- **Código fuente**: `html-generators/index.ts`

---

## 💡 Tips Finales

1. **Siempre escapa el contenido del usuario** con `escapeHtml()`
2. **Usa URLs absolutas** para imágenes y links
3. **Prueba en múltiples clientes** antes de enviar
4. **Mantén el HTML simple** - las tablas son tus amigas
5. **Evita CSS externo** - solo inline styles
6. **No uses JavaScript** - los emails no lo soportan
7. **Optimiza las imágenes** - tamaño < 500KB
8. **Incluye texto alternativo** en todas las imágenes
9. **Proporciona versión texto plano** para accesibilidad
10. **Respeta las leyes anti-spam** (CAN-SPAM, GDPR, etc.)

