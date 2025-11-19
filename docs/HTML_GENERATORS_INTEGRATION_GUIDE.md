# Guía de Integración: Generadores HTML para OBJDATAWEB

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Inventario Completo de Archivos](#inventario-completo-de-archivos)
4. [Cómo Copiar al Otro Proyecto](#cómo-copiar-al-otro-proyecto)
5. [Crear Adaptador OBJDATAWEB → EmailComponent](#crear-adaptador-objdataweb--emailcomponent)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Mantener Ambos Proyectos Sincronizados](#mantener-ambos-proyectos-sincronizados)

---

## 📖 Descripción General

Este sistema de generadores HTML convierte componentes estructurados (tipo `EmailComponent`) en HTML compatible con **Gmail**, **Outlook** y **Apple Mail**.

### ¿Qué hace?

- Recibe un objeto `EmailComponent` con `type`, `content`, `props` y `style`
- Renderiza HTML inline con tablas para máxima compatibilidad
- Soporta 20+ tipos de componentes (heading, paragraph, image, button, etc.)
- Incluye helpers específicos para Outlook y estilos base para emails

### Flujo de Datos

```
OBJDATAWEB (formato específico)
    ↓
Adaptador (transformación)
    ↓
EmailComponent[] (formato estándar)
    ↓
renderComponentToHtml() / generateNewsletterTemplate()
    ↓
HTML final (compatible con clientes de email)
```

---

## 🏗️ Arquitectura del Sistema

### Estructura de Carpetas

```
src/components/newsletter-note/html-generators/
├── index.ts                          # ⭐ Punto de entrada principal
├── types.ts                          # ⭐ Tipos TypeScript
├── utils/
│   ├── html-utils.ts                 # ⭐ Utilidades HTML (escape, limpieza, estilos)
│   ├── email-styles.ts               # ⭐ Estilos base para componentes
│   └── outlook-helpers.ts            # ⭐ Helpers para Microsoft Outlook
├── templates/
│   ├── newsletter.template.ts        # ⭐ Template completo con header/footer
│   └── single-note.template.ts       # ⭐ Template para nota individual
└── components/                        # Generadores individuales por tipo
    ├── heading.generator.ts
    ├── paragraph.generator.ts
    ├── bulletlist.generator.ts
    ├── image.generator.ts
    ├── button.generator.ts
    ├── divider.generator.ts
    ├── category.generator.ts
    ├── summary.generator.ts
    ├── author.generator.ts
    ├── spacer.generator.ts
    ├── gallery.generator.ts
    ├── image-text.generator.ts       # ⭐ Componente complejo (imagen + texto)
    ├── titulo-con-icono.generator.ts
    ├── text-with-icon.generator.ts
    ├── herramientas.generator.ts
    ├── respaldado-por.generator.ts
    ├── multi-columns.generator.ts    # ⭐ Layouts de 2-3 columnas
    ├── newsletter-header.generator.ts
    ├── newsletter-footer.generator.ts
    └── note-container.generator.ts   # ⭐ Contenedor anidado
```

---

## 📦 Inventario Completo de Archivos

### 🔵 Archivos OBLIGATORIOS (Core)

Estos archivos DEBEN copiarse para que el sistema funcione:

#### 1. **index.ts** - Punto de entrada principal

- **Función principal**: `renderComponentToHtml(component: EmailComponent): string`
- **Qué hace**: Switch que enruta cada tipo de componente a su generador
- **Dependencias**: Importa TODOS los generadores + tipos + utils

#### 2. **types.ts** - Definiciones de tipos TypeScript

```typescript
export interface EmailComponent {
  id: string;
  type: string;           // 'heading', 'paragraph', 'image', etc.
  content?: string;       // Contenido de texto/HTML
  props?: Record<string, any>;  // Propiedades específicas del componente
  style?: Record<string, any>;  // Estilos CSS personalizados
}

export interface HeaderConfig { ... }
export interface FooterConfig { ... }
export interface ContainerConfig { ... }
// ... más tipos
```

#### 3. **utils/html-utils.ts** - Utilidades HTML

- `escapeHtml(text: string)`: Escapa caracteres especiales (previene XSS)
- `cleanTipTapHtml(html: string)`: Limpia HTML de TipTap para emails
- `stylesToString(styles: Record<string, any>)`: Convierte objeto a CSS inline
- `camelToKebab(str: string)`: Convierte camelCase a kebab-case
- `hexToRgba(hex: string, opacity: number)`: Convierte HEX a RGBA
- `getIconUrl(icon: string)`: Procesa URLs de iconos (iconify, icons8)

#### 4. **utils/email-styles.ts** - Estilos base

- `EMAIL_STYLES`: Objeto con estilos por defecto para cada componente
- `SUMMARY_TYPES`: Configuraciones para tipos de resumen
- `EMAIL_RESET_CSS`: CSS reset para emails

#### 5. **utils/outlook-helpers.ts** - Helpers para Outlook

- `wrapInMso(content)`: Comentarios condicionales para Outlook
- `tableAttrs()`: Atributos de tabla para compatibilidad
- `outlookCenterWrapper()`: Wrapper para centrado
- `outlookColumnsWrapper()`: Layout de columnas para Outlook
- `outlookMetaTags()`: Meta tags específicos de Outlook
- `outlookButtonVml()`: Botones con border-radius en Outlook

#### 6. **templates/newsletter.template.ts** - Template completo

- `generateNewsletterTemplate()`: Genera HTML completo con DOCTYPE, head, body
- Incluye header, footer, content y estilos responsive
- Soporta gradientes, logos, banners, enlaces sociales

#### 7. **templates/single-note.template.ts** - Template de nota

- `generateSingleNoteTemplate()`: Genera HTML para nota individual
- Sin header/footer, solo contenedor con estilos configurables

---

### 🔵 Generadores de Componentes (components/)

Cada generador sigue el mismo patrón:

```typescript
export function generateXxxHtml(component: EmailComponent): string {
  // 1. Extraer props y estilos
  const prop1 = component.props?.prop1 || defaultValue;

  // 2. Aplicar estilos base + personalizados
  const mergedStyles = { ...EMAIL_STYLES.xxx, ...component.style };

  // 3. Generar HTML con tablas inline
  return `<table ...>...</table>`;
}
```

#### Lista de Generadores Disponibles:

| Generador                      | Archivo                          | Descripción                  | Complejidad |
| ------------------------------ | -------------------------------- | ---------------------------- | ----------- |
| `generateHeadingHtml`          | `heading.generator.ts`           | Títulos h1-h6                | ⚪ Básico   |
| `generateParagraphHtml`        | `paragraph.generator.ts`         | Párrafos de texto            | ⚪ Básico   |
| `generateBulletListHtml`       | `bulletlist.generator.ts`        | Listas con bullets           | ⚪ Básico   |
| `generateDividerHtml`          | `divider.generator.ts`           | Líneas divisoras             | ⚪ Básico   |
| `generateImageHtml`            | `image.generator.ts`             | Imágenes responsive          | ⚪ Básico   |
| `generateButtonHtml`           | `button.generator.ts`            | Botones con VML para Outlook | 🟡 Medio    |
| `generateCategoryHtml`         | `category.generator.ts`          | Tags/categorías con colores  | 🟡 Medio    |
| `generateSummaryHtml`          | `summary.generator.ts`           | Cajas de resumen con iconos  | 🟡 Medio    |
| `generateAuthorHtml`           | `author.generator.ts`            | Info de autor con avatar     | 🟡 Medio    |
| `generateSpacerHtml`           | `spacer.generator.ts`            | Espaciado vertical           | ⚪ Básico   |
| `generateGalleryHtml`          | `gallery.generator.ts`           | Galería de imágenes          | 🟡 Medio    |
| `generateImageTextHtml`        | `image-text.generator.ts`        | Imagen + texto (4 layouts)   | 🔴 Complejo |
| `generateTituloConIconoHtml`   | `titulo-con-icono.generator.ts`  | Título con icono             | 🟡 Medio    |
| `generateTextWithIconHtml`     | `text-with-icon.generator.ts`    | Texto con icono lateral      | 🟡 Medio    |
| `generateHerramientasHtml`     | `herramientas.generator.ts`      | Lista de herramientas        | 🟡 Medio    |
| `generateRespaldadoPorHtml`    | `respaldado-por.generator.ts`    | Sponsors/respaldos           | 🟡 Medio    |
| `generateMultiColumnsHtml`     | `multi-columns.generator.ts`     | 2-3 columnas responsive      | 🔴 Complejo |
| `generateNewsletterHeaderHtml` | `newsletter-header.generator.ts` | Header con logo/banner       | 🟡 Medio    |
| `generateNewsletterFooterHtml` | `newsletter-footer.generator.ts` | Footer con enlaces           | 🟡 Medio    |
| `generateNoteContainerHtml`    | `note-container.generator.ts`    | Contenedor anidado           | 🔴 Complejo |

---

## 📥 Cómo Copiar al Otro Proyecto

### Opción 1: Copiar Carpeta Completa (Recomendado)

```bash
# En el otro proyecto, copiar toda la carpeta
cp -r /ruta/adam-pro/src/components/newsletter-note/html-generators ./src/lib/
```

**Ventajas**:

- ✅ Incluye todo de una vez
- ✅ Fácil de mantener sincronizado
- ✅ No requiere configuración adicional

**Desventajas**:

- ⚠️ Puede incluir generadores no usados

---

### Opción 2: Copiar Solo lo Necesario (Minimalista)

Si solo necesitas algunos componentes, copia:

#### Paso 1: Estructura mínima

```bash
mkdir -p ./src/lib/html-generators/{utils,templates,components}
```

#### Paso 2: Archivos core obligatorios

```bash
# Core
cp html-generators/index.ts ./src/lib/html-generators/
cp html-generators/types.ts ./src/lib/html-generators/

# Utils
cp html-generators/utils/html-utils.ts ./src/lib/html-generators/utils/
cp html-generators/utils/email-styles.ts ./src/lib/html-generators/utils/
cp html-generators/utils/outlook-helpers.ts ./src/lib/html-generators/utils/

# Templates
cp html-generators/templates/newsletter.template.ts ./src/lib/html-generators/templates/
cp html-generators/templates/single-note.template.ts ./src/lib/html-generators/templates/
```

#### Paso 3: Generadores específicos que necesites

```bash
# Ejemplo: Solo necesito heading, paragraph, image, button
cp html-generators/components/heading.generator.ts ./src/lib/html-generators/components/
cp html-generators/components/paragraph.generator.ts ./src/lib/html-generators/components/
cp html-generators/components/image.generator.ts ./src/lib/html-generators/components/
cp html-generators/components/button.generator.ts ./src/lib/html-generators/components/
```

#### Paso 4: Actualizar index.ts

Edita `index.ts` para solo importar/exportar los generadores copiados:

```typescript
// Elimina las importaciones de generadores no copiados
// Por ejemplo, si no copiaste gallery.generator.ts, elimina:
// import { generateGalleryHtml } from './components/gallery.generator';

// Y elimina también del switch en renderComponentToHtml():
// case 'gallery':
//   return generateGalleryHtml(component);
```

---

### Opción 3: Crear Paquete NPM Compartido (Profesional)

Si planeas mantener múltiples proyectos sincronizados:

```bash
# En un repo separado o monorepo
npm init @tu-org/email-generators

# Publicar y usar en ambos proyectos
npm install @tu-org/email-generators
```

---

## 🔄 Crear Adaptador OBJDATAWEB → EmailComponent

### ¿Qué es OBJDATAWEB?

`OBJDATAWEB` es tu formato de datos específico. Necesitas crear un adaptador que lo convierta al formato `EmailComponent` que los generadores esperan.

### Ejemplo de Adaptador

```typescript
// src/lib/adapters/objdataweb-to-email-component.ts

import type { EmailComponent } from '../html-generators/types';

interface ObjDataWeb {
  // Define tu estructura actual
  tipo: string;
  contenido: string;
  configuracion?: Record<string, any>;
  estilos?: Record<string, any>;
}

/**
 * Convierte OBJDATAWEB al formato EmailComponent
 */
export function adaptObjDataWebToEmailComponent(objDataWeb: ObjDataWeb[]): EmailComponent[] {
  return objDataWeb.map((item, index) => {
    // Mapear tipos (ajustar según tu estructura)
    const typeMapping: Record<string, string> = {
      titulo: 'heading',
      parrafo: 'paragraph',
      imagen: 'image',
      boton: 'button',
      categoria: 'category',
      'imagen-texto': 'imageText',
      // ... más mapeos
    };

    return {
      id: item.id || `component-${index}`,
      type: typeMapping[item.tipo] || item.tipo,
      content: item.contenido || '',
      props: item.configuracion || {},
      style: item.estilos || {},
    };
  });
}

/**
 * Genera HTML desde OBJDATAWEB
 */
export function generateHtmlFromObjDataWeb(objDataWeb: ObjDataWeb[]): string {
  // 1. Convertir a EmailComponent[]
  const components = adaptObjDataWebToEmailComponent(objDataWeb);

  // 2. Renderizar cada componente
  const htmlParts = components.map((component) => renderComponentToHtml(component));

  // 3. Unir todo el HTML
  return htmlParts.join('\n');
}

/**
 * Genera Newsletter completo desde OBJDATAWEB
 */
export function generateNewsletterFromObjDataWeb(
  title: string,
  description: string,
  objDataWeb: ObjDataWeb[],
  headerConfig?: HeaderConfig,
  footerConfig?: FooterConfig
): string {
  // 1. Generar HTML de componentes
  const componentsHtml = generateHtmlFromObjDataWeb(objDataWeb);

  // 2. Envolver en template completo
  return generateNewsletterTemplate(title, description, componentsHtml, headerConfig, footerConfig);
}
```

### Ejemplo de Uso del Adaptador

```typescript
import { generateNewsletterFromObjDataWeb } from './adapters/objdataweb-to-email-component';

// Tu data existente
const miObjDataWeb = [
  {
    tipo: 'titulo',
    contenido: 'Bienvenido al Newsletter',
    configuracion: { level: 1 },
    estilos: { color: '#1976d2' },
  },
  {
    tipo: 'parrafo',
    contenido: 'Este es el contenido del newsletter...',
    configuracion: {},
    estilos: { fontSize: '16px' },
  },
  {
    tipo: 'imagen-texto',
    contenido: 'Descripción del producto',
    configuracion: {
      imageUrl: 'https://example.com/image.jpg',
      titleContent: 'Título del Producto',
      layout: 'image-left',
      imageWidth: 40,
    },
    estilos: {},
  },
];

// Generar HTML
const html = generateNewsletterFromObjDataWeb(
  'Mi Newsletter',
  'Edición de Enero 2025',
  miObjDataWeb,
  {
    title: 'Newsletter Semanal',
    subtitle: 'Edición #42',
    backgroundColor: '#1976d2',
    textColor: '#ffffff',
    alignment: 'center',
    logo: 'https://example.com/logo.png',
  },
  {
    companyName: 'Mi Empresa',
    address: 'Calle 123, Ciudad',
    backgroundColor: '#333333',
    textColor: '#ffffff',
    socialLinks: [
      { platform: 'instagram', url: 'https://instagram.com/...', enabled: true },
      { platform: 'twitter', url: 'https://twitter.com/...', enabled: true },
    ],
  }
);

// Ahora `html` contiene el HTML completo compatible con emails
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Componente Individual

```typescript
import { renderComponentToHtml } from './html-generators';

const component: EmailComponent = {
  id: 'heading-1',
  type: 'heading',
  content: 'Título Principal',
  props: { level: 1 },
  style: { color: '#1976d2', textAlign: 'center' },
};

const html = renderComponentToHtml(component);
// Resultado: <h1 style="font-size: 28px; color: #1976d2; ...">Título Principal</h1>
```

### Ejemplo 2: Componente Complejo (ImageText)

```typescript
const imageTextComponent: EmailComponent = {
  id: 'img-text-1',
  type: 'imageText',
  content: '<p>Esta es una descripción del producto con <strong>texto en negrita</strong>.</p>',
  props: {
    imageUrl: 'https://example.com/product.jpg',
    imageAlt: 'Producto XYZ',
    titleContent: '<p>Producto XYZ</p>',
    layout: 'image-left',
    imageWidth: 40,
    spacing: 20,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    textColor: '#333333',
    titleColor: '#000000',
    fontSize: 14,
    titleSize: 20,
  },
  style: { margin: '30px 0' },
};

const html = renderComponentToHtml(imageTextComponent);
```

### Ejemplo 3: Newsletter Completo

```typescript
import { renderComponentToHtml, generateNewsletterTemplate } from './html-generators';

const components: EmailComponent[] = [
  {
    id: 'cat-1',
    type: 'category',
    content: 'Tecnología',
    props: {
      color: '#e3f2fd',
      textColor: '#1976d2',
    },
  },
  {
    id: 'heading-1',
    type: 'heading',
    content: 'Nueva Funcionalidad',
    props: { level: 2 },
  },
  {
    id: 'para-1',
    type: 'paragraph',
    content: 'Hemos lanzado una nueva funcionalidad...',
  },
  {
    id: 'btn-1',
    type: 'button',
    content: 'Ver Más',
    props: {
      url: 'https://example.com/feature',
      backgroundColor: '#1976d2',
      textColor: '#ffffff',
    },
  },
];

// Renderizar componentes
const componentsHtml = components.map((comp) => renderComponentToHtml(comp)).join('\n');

// Generar newsletter completo
const fullHtml = generateNewsletterTemplate(
  'Newsletter Enero 2025',
  'Últimas novedades',
  componentsHtml,
  {
    title: 'Tech Weekly',
    subtitle: 'Edición #42',
    backgroundColor: '#1976d2',
    textColor: '#ffffff',
    alignment: 'center',
    logo: 'https://example.com/logo.png',
  },
  {
    companyName: 'Tech Corp',
    backgroundColor: '#333333',
    textColor: '#ffffff',
    contactEmail: 'contact@techcorp.com',
  }
);
```

---

## 🔄 Mantener Ambos Proyectos Sincronizados

### Estrategia 1: Script de Sincronización

Crea un script que copie cambios automáticamente:

```bash
#!/bin/bash
# sync-generators.sh

SOURCE_DIR="/ruta/adam-pro/src/components/newsletter-note/html-generators"
TARGET_DIR="./src/lib/html-generators"

echo "Sincronizando generadores HTML..."

# Copiar toda la carpeta
rsync -av --delete "$SOURCE_DIR/" "$TARGET_DIR/"

echo "✅ Sincronización completa"
```

Uso:

```bash
chmod +x sync-generators.sh
./sync-generators.sh
```

---

### Estrategia 2: Git Submodule

Si ambos proyectos están en Git:

```bash
# En el otro proyecto
git submodule add <url-del-repo-adam-pro> libs/adam-pro
ln -s libs/adam-pro/src/components/newsletter-note/html-generators src/lib/html-generators

# Actualizar
git submodule update --remote
```

---

### Estrategia 3: Symlink (Desarrollo Local)

Si ambos proyectos están en tu máquina:

```bash
# En el otro proyecto
ln -s /ruta/adam-pro/src/components/newsletter-note/html-generators ./src/lib/html-generators

# Los cambios en adam-pro se reflejan automáticamente
```

---

### Estrategia 4: Monorepo (Solución Definitiva)

Usar herramientas como **Turborepo** o **Nx**:

```
my-monorepo/
├── packages/
│   ├── email-generators/     # Paquete compartido
│   ├── adam-pro/             # Proyecto 1
│   └── otro-proyecto/        # Proyecto 2
└── package.json
```

Ambos proyectos importan desde `@my-org/email-generators`.

---

## 📝 Checklist de Integración

Usa esta lista para verificar tu integración:

- [ ] ✅ Copié toda la carpeta `html-generators` al otro proyecto
- [ ] ✅ Instalé las dependencias TypeScript necesarias
- [ ] ✅ Creé el adaptador `objdataweb-to-email-component.ts`
- [ ] ✅ Mapeé todos los tipos de componentes OBJDATAWEB → EmailComponent
- [ ] ✅ Probé generar HTML de componentes individuales
- [ ] ✅ Probé generar newsletter completo
- [ ] ✅ Verifiqué compatibilidad con Gmail
- [ ] ✅ Verifiqué compatibilidad con Outlook
- [ ] ✅ Verifiqué compatibilidad con Apple Mail
- [ ] ✅ Implementé estrategia de sincronización entre proyectos
- [ ] ✅ Documenté el proceso para mi equipo

---

## 🐛 Troubleshooting

### Problema: TypeScript no encuentra los tipos

**Solución**: Verifica que `types.ts` esté exportado correctamente:

```typescript
// index.ts
export type * from './types';
```

### Problema: Imágenes no se muestran en Outlook

**Solución**: Asegúrate de usar URLs absolutas (no relativas):

```typescript
// ❌ Mal
imageUrl: '/images/logo.png';

// ✅ Bien
imageUrl: 'https://example.com/images/logo.png';
```

### Problema: Estilos no se aplican en Gmail

**Solución**: Gmail no soporta `<style>` tags. Usa solo estilos inline:

```typescript
// Los generadores ya hacen esto automáticamente
stylesToString({ color: '#333', fontSize: '16px' });
// Output: "color: #333; font-size: 16px"
```

### Problema: Layout de columnas se rompe en mobile

**Solución**: Usa los estilos responsive incluidos en los generadores (clase `.mobile-column`).

---

## 📚 Recursos Adicionales

- **Guía de Email HTML**: https://www.caniemail.com/
- **Outlook Conditional Comments**: https://docs.microsoft.com/en-us/previous-versions/office/developer/office-2007/aa338201(v=office.12)
- **Email Acid (Testing)**: https://www.emailonacid.com/

---

## 🎯 Resumen Ejecutivo

### ¿Qué necesito copiar?

```
html-generators/
├── index.ts              ⭐ OBLIGATORIO
├── types.ts              ⭐ OBLIGATORIO
├── utils/                ⭐ OBLIGATORIO (completa)
├── templates/            ⭐ OBLIGATORIO (completa)
└── components/           ⚡ Opcional (copia solo los que uses)
```

### ¿Qué necesito crear?

1. **Adaptador**: `objdataweb-to-email-component.ts`
2. **Mapeo de tipos**: Tu formato → `EmailComponent`
3. **Función wrapper**: `generateHtmlFromObjDataWeb()`

### ¿Cómo mantengo sincronizado?

Elige una estrategia:

- 🟢 **Script de sincronización** (simple)
- 🟡 **Git submodule** (intermedio)
- 🔵 **Monorepo** (profesional)

---

**¿Dudas?** Revisa los ejemplos de uso o consulta el código fuente de `html-generators/index.ts` para ver todos los tipos de componentes soportados.
