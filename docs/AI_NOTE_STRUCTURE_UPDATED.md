# Documentación Técnica: Estructura de Datos para IA

## Objetivo

Este documento describe la estructura de datos que el backend debe generar al crear newsletters y notas usando IA. El sistema maneja dos versiones de contenido: **Newsletter** (versión resumida para emails) y **Web** (versión extendida para el sitio web).

## Estructura Base: EmailComponent

Cada elemento de contenido es un `EmailComponent` con la siguiente estructura:

```typescript
interface EmailComponent {
  id: string; // ID único del componente
  type: ComponentType; // Tipo de componente (ver tipos disponibles)
  content: string; // Contenido textual principal
  props: {
    // Propiedades específicas del tipo
    level?: number;
    variant?: string;
    color?: string;
    src?: string;
    alt?: string;
    items?: string[];
    [key: string]: any;
  };
  style?: React.CSSProperties; // Estilos CSS opcionales
}
```

## Tipos de Componentes Disponibles

### Componentes Básicos

#### 1. heading
Encabezados de diferentes niveles.

```json
{
  "id": "heading-1",
  "type": "heading",
  "content": "Título de la noticia",
  "props": { "level": 1 }
}
```

**Niveles disponibles:** 1, 2, 3, 4, 5, 6

#### 2. paragraph
Párrafos de texto.

```json
{
  "id": "paragraph-1",
  "type": "paragraph",
  "content": "Contenido del párrafo...",
  "props": {
    "isCode": false
  }
}
```

**Props:**
- `isCode`: Boolean - True para bloques de código

#### 3. bulletList
Listas con viñetas.

```json
{
  "id": "list-1",
  "type": "bulletList",
  "content": "",
  "props": {
    "items": [
      "Primer punto de la lista",
      "Segundo punto de la lista",
      "Tercer punto de la lista"
    ],
    "listStyle": "disc",
    "listColor": "#000000"
  }
}
```

**Props:**
- `items`: Array de strings - Elementos de la lista
- `listStyle`: "disc" | "circle" | "square"
- `listColor`: String (hex color)

#### 4. image
Imágenes.

```json
{
  "id": "image-1",
  "type": "image",
  "content": "",
  "props": {
    "src": "https://example.com/image.jpg",
    "alt": "Descripción de la imagen"
  }
}
```

**Props obligatorias:**
- `src`: URL de la imagen
- `alt`: Texto alternativo

#### 5. button
Botones call-to-action.

```json
{
  "id": "button-1",
  "type": "button",
  "content": "Leer más",
  "props": {
    "url": "https://example.com/article",
    "variant": "contained",
    "color": "#1976d2"
  }
}
```

**Props:**
- `url`: URL de destino
- `variant`: "contained" | "outlined" | "text"
- `color`: String (hex color)

#### 6. divider
Líneas divisoras.

```json
{
  "id": "divider-1",
  "type": "divider",
  "content": "",
  "props": {}
}
```

#### 7. spacer
Espacios verticales.

```json
{
  "id": "spacer-1",
  "type": "spacer",
  "content": "",
  "props": {
    "height": 20
  }
}
```

**Props:**
- `height`: Número - Altura en píxeles

### Componentes de Noticias

#### 8. tituloConIcono
**Indicador visual de categoría con icono y gradiente (solo para newsletter).**

⚠️ **IMPORTANTE:** Este componente debe sincronizarse con el `categoryId` de la nota.

```json
{
  "id": "tituloConIcono-1",
  "type": "tituloConIcono",
  "content": "Mercado",
  "props": {
    "categoryId": "cat-123",
    "categoryName": "Mercado",
    "icon": "https://img.icons8.com/color/48/line-chart.png",
    "gradientColor1": "rgba(255, 184, 77, 0.08)",
    "gradientColor2": "rgba(243, 156, 18, 0.00)",
    "gradientType": "linear",
    "gradientAngle": 180,
    "colorDistribution": 0,
    "textColor": "#E67E22"
  }
}
```

**Props obligatorias:**
- `categoryId`: String - ID de la categoría seleccionada (debe coincidir con el categoryId de la configuración)
- `categoryName`: String - Nombre de la categoría
- `icon`: URL del icono (PNG de Icons8 o similar)

**Props opcionales:**
- `gradientColor1`: String (rgba) - Color inicial del gradiente
- `gradientColor2`: String (rgba) - Color final del gradiente
- `gradientType`: "linear" | "radial"
- `gradientAngle`: Number (0-360) - Ángulo del gradiente lineal
- `colorDistribution`: Number (0-100) - Punto de distribución de colores
- `textColor`: String (hex) - Color del texto

**Reglas especiales:**
- El `content` DEBE ser igual al nombre de la categoría
- El `categoryId` DEBE coincidir con el `categoryId` de la configuración de la nota
- Los colores y gradientes se asignan automáticamente según la categoría
- El icono se asigna desde un pool predefinido si la categoría no tiene uno

#### 9. category
Etiqueta de categoría.

```json
{
  "id": "category-1",
  "type": "category",
  "content": "Tecnología",
  "props": {
    "color": "#e3f2fd",
    "textColor": "#1565c0"
  }
}
```

**Props:**
- `color`: String (hex) - Color de fondo
- `textColor`: String (hex) - Color del texto

#### 10. summary
Resumen o destacado.

```json
{
  "id": "summary-1",
  "type": "summary",
  "content": "Resumen de la noticia...",
  "props": {
    "summaryType": "resumen",
    "label": "Resumen",
    "icon": "https://img.icons8.com/color/48/note.png",
    "backgroundColor": "#f8f9fa",
    "textColor": "#495057"
  }
}
```

**Props:**
- `summaryType`: "resumen" | "destacado"
- `label`: String - Etiqueta a mostrar
- `icon`: URL del icono
- `backgroundColor`: String (hex)
- `textColor`: String (hex)

#### 11. respaldadoPor
Información de autor/redactor.

```json
{
  "id": "respaldadoPor-1",
  "type": "respaldadoPor",
  "content": "",
  "props": {
    "texto": "Respaldado por",
    "nombre": "Redacción",
    "avatarUrl": "https://s3.amazonaws.com/s3.condoor.ai/adam/avatar.webp",
    "avatarTamano": 21,
    "mostrarEscritorPropietario": false,
    "escritorNombre": "Escritor",
    "escritorAvatarUrl": "",
    "propietarioNombre": "Propietario",
    "propietarioAvatarUrl": ""
  }
}
```

### Componentes Compuestos

#### 12. gallery
Galería de imágenes.

```json
{
  "id": "gallery-1",
  "type": "gallery",
  "content": "",
  "props": {
    "images": [
      { "url": "https://example.com/1.jpg", "caption": "Imagen 1" },
      { "url": "https://example.com/2.jpg", "caption": "Imagen 2" }
    ],
    "layout": "grid"
  }
}
```

**Props:**
- `images`: Array de objetos con `url` y `caption`
- `layout`: "grid" | "single" | "carousel"

#### 13. imageText
Imagen con texto al lado.

```json
{
  "id": "imageText-1",
  "type": "imageText",
  "content": "Texto descriptivo...",
  "props": {
    "imageUrl": "https://example.com/image.jpg",
    "imagePosition": "left",
    "imageWidth": "50%"
  }
}
```

**Props:**
- `imageUrl`: URL de la imagen
- `imagePosition`: "left" | "right"
- `imageWidth`: String (porcentaje o px)

#### 14. twoColumns
Contenido en dos columnas.

```json
{
  "id": "twoColumns-1",
  "type": "twoColumns",
  "content": "",
  "props": {
    "leftContent": "Contenido columna izquierda",
    "rightContent": "Contenido columna derecha"
  }
}
```

## Sincronización de Componentes con Configuración

### TituloConIcono y Categoría

El componente `tituloConIcono` debe sincronizarse automáticamente con la categoría seleccionada en la configuración de la nota:

1. El `content` debe ser igual al `category.name`
2. El `props.categoryId` debe ser igual al `categoryId` de la configuración
3. Los colores y gradientes se asignan automáticamente según la categoría
4. El icono se asigna desde un pool predefinido si la categoría no tiene uno

**Ejemplo de sincronización correcta:**

```json
// Configuración de la nota
{
  "categoryId": "cat-tech-123",
  "categoryName": "Tecnología"
}

// Componente tituloConIcono (debe coincidir)
{
  "id": "tituloConIcono-1",
  "type": "tituloConIcono",
  "content": "Tecnología",
  "props": {
    "categoryId": "cat-tech-123",
    "categoryName": "Tecnología",
    "icon": "https://img.icons8.com/color/48/computer.png",
    "gradientColor1": "rgba(156, 136, 255, 0.08)",
    "gradientColor2": "rgba(124, 77, 255, 0.00)",
    "textColor": "#6C63FF"
  }
}
```

### Category Component

El componente `category` también debe coincidir con la categoría seleccionada y usar los colores predefinidos del sistema.

## Ejemplo Completo: Nota de Noticias

### Newsletter (objData) - Versión Resumida

```json
[
  {
    "id": "tituloConIcono-1",
    "type": "tituloConIcono",
    "content": "Inteligencia Artificial",
    "props": {
      "categoryId": "cat-ia-456",
      "categoryName": "Inteligencia Artificial",
      "icon": "https://img.icons8.com/color/48/artificial-intelligence.png",
      "gradientColor1": "rgba(139, 69, 255, 0.08)",
      "gradientColor2": "rgba(75, 0, 130, 0.00)",
      "gradientType": "linear",
      "gradientAngle": 180,
      "colorDistribution": 0,
      "textColor": "#8B45FF"
    }
  },
  {
    "id": "image-1",
    "type": "image",
    "content": "",
    "props": {
      "src": "https://example.com/gpt4-turbo.jpg",
      "alt": "GPT-4 Turbo logo"
    }
  },
  {
    "id": "category-1",
    "type": "category",
    "content": "Inteligencia Artificial",
    "props": {
      "color": "#f3e5f5",
      "textColor": "#6a1b9a"
    }
  },
  {
    "id": "heading-1",
    "type": "heading",
    "content": "GPT-4 Turbo: Más rápido y económico",
    "props": { "level": 2 }
  },
  {
    "id": "respaldadoPor-1",
    "type": "respaldadoPor",
    "content": "",
    "props": {
      "texto": "Por",
      "nombre": "Redacción Tech",
      "avatarUrl": "https://s3.amazonaws.com/s3.condoor.ai/adam/avatar.webp",
      "avatarTamano": 21,
      "mostrarEscritorPropietario": false
    }
  },
  {
    "id": "summary-1",
    "type": "summary",
    "content": "OpenAI presenta GPT-4 Turbo con contexto de 128K tokens, 3x más barato.",
    "props": {
      "summaryType": "resumen",
      "label": "Resumen",
      "icon": "https://img.icons8.com/color/48/note.png",
      "backgroundColor": "#f8f9fa",
      "textColor": "#495057"
    }
  },
  {
    "id": "paragraph-1",
    "type": "paragraph",
    "content": "La nueva versión de GPT-4 incluye soporte para 128,000 tokens de contexto.",
    "props": {}
  },
  {
    "id": "bulletList-1",
    "type": "bulletList",
    "content": "",
    "props": {
      "items": [
        "Ventana de contexto de 128K tokens (equivalente a 300 páginas)",
        "Precio: $0.01 por 1K tokens de entrada (66% más barato)",
        "Mayor precisión en seguimiento de instrucciones",
        "Soporte para JSON mode y function calling mejorado"
      ],
      "listStyle": "disc",
      "listColor": "#666666"
    }
  },
  {
    "id": "button-1",
    "type": "button",
    "content": "Leer artículo completo",
    "props": {
      "url": "https://openai.com/blog/gpt-4-turbo",
      "variant": "contained",
      "color": "#8B45FF"
    }
  }
]
```

### Web (objDataWeb) - Versión Extendida

```json
[
  {
    "id": "heading-1-web",
    "type": "heading",
    "content": "OpenAI lanza GPT-4 Turbo: Una revolución en IA accesible",
    "props": { "level": 1 }
  },
  {
    "id": "image-1-web",
    "type": "image",
    "content": "",
    "props": {
      "src": "https://example.com/gpt4-turbo-banner.jpg",
      "alt": "Banner de lanzamiento GPT-4 Turbo"
    }
  },
  {
    "id": "category-1-web",
    "type": "category",
    "content": "Inteligencia Artificial",
    "props": {
      "color": "#f3e5f5",
      "textColor": "#6a1b9a"
    }
  },
  {
    "id": "respaldadoPor-1-web",
    "type": "respaldadoPor",
    "content": "",
    "props": {
      "texto": "Escrito por",
      "nombre": "María González",
      "avatarUrl": "https://s3.amazonaws.com/s3.condoor.ai/adam/avatar-maria.webp",
      "avatarTamano": 21,
      "mostrarEscritorPropietario": true,
      "escritorNombre": "María González",
      "escritorAvatarUrl": "https://s3.amazonaws.com/s3.condoor.ai/adam/avatar-maria.webp"
    }
  },
  {
    "id": "summary-1-web",
    "type": "summary",
    "content": "En un evento especial, OpenAI ha presentado GPT-4 Turbo, una versión mejorada de su modelo de lenguaje.",
    "props": {
      "summaryType": "resumen",
      "label": "Lo que necesitas saber",
      "icon": "https://img.icons8.com/color/48/note.png",
      "backgroundColor": "#f8f9fa",
      "textColor": "#495057"
    }
  },
  {
    "id": "heading-2-web",
    "type": "heading",
    "content": "Características principales",
    "props": { "level": 2 }
  },
  {
    "id": "paragraph-1-web",
    "type": "paragraph",
    "content": "GPT-4 Turbo representa un salto cualitativo en la tecnología de modelos de lenguaje.",
    "props": {}
  }
]
```

## Reglas y Mejores Prácticas

### IDs Únicos

- **Newsletter:** Sufijo numérico (`heading-1`, `paragraph-1`)
- **Web:** Sufijo `-web` (`heading-1-web`, `paragraph-1-web`)

### Diferencias Newsletter vs Web

| Aspecto | Newsletter (objData) | Web (objDataWeb) |
|---------|---------------------|------------------|
| Longitud | Resumido, conciso | Extendido, detallado |
| Componentes | 5-10 elementos | 10-20 elementos |
| Párrafos | 1-2 oraciones | 3-5 oraciones |
| Estructura | Linear, simple | Jerárquica con subsecciones |
| Objetivo | Captar atención | Profundizar información |

### Componentes Vinculados a Configuración

Algunos componentes deben sincronizarse con la configuración de la nota:

1. **tituloConIcono:**
   - Debe usar `category.name` como content
   - Debe incluir `categoryId` en props
   - No usar textos personalizados
   - Sincronizar automáticamente con la categoría de la configuración

2. **category:**
   - Debe coincidir con la categoría seleccionada
   - Usar los colores predefinidos del sistema

### Validaciones Backend

1. **IDs únicos:** No debe haber IDs duplicados en el mismo array
2. **Contenido obligatorio:** `heading`, `paragraph`, `category` deben tener `content`
3. **Props requeridas:** `image` debe tener `src` y `alt`
4. **Límites de longitud:**
   - Newsletter: content de párrafos max 200 caracteres
   - Web: content de párrafos max 500 caracteres
5. **URLs válidas:** Validar formato de URLs en `images` y `buttons`
6. **Sincronización de categorías:** Validar que `tituloConIcono.props.categoryId` coincida con `categoryId` de la nota

### Categorías Recomendadas

```javascript
const categories = {
  'Tecnología': { color: '#e3f2fd', textColor: '#1565c0' },
  'Negocios': { color: '#fff3e0', textColor: '#e65100' },
  'Ciencia': { color: '#e8f5e9', textColor: '#2e7d32' },
  'Política': { color: '#fce4ec', textColor: '#c2185b' },
  'Deportes': { color: '#fff8e1', textColor: '#f57f17' },
  'Entretenimiento': { color: '#f3e5f5', textColor: '#6a1b9a' },
  'Salud': { color: '#e0f2f1', textColor: '#00695c' },
  'Economía': { color: '#fbe9e7', textColor: '#bf360c' },
};
```

## Formato de Respuesta del Backend

```typescript
interface AIGenerationResponse {
  success: boolean;
  data: {
    objData: EmailComponent[]; // Versión newsletter
    objDataWeb: EmailComponent[]; // Versión web
    metadata: {
      generatedAt: string; // ISO timestamp
      promptUsed: string; // Prompt enviado
      model: string; // Modelo IA usado
      tokensUsed: number; // Tokens consumidos
      categoryId: string; // ID de la categoría asignada
      categoryName: string; // Nombre de la categoría
    };
  };
  error?: {
    code: string;
    message: string;
  };
}
```

### Ejemplo de Request

```json
{
  "prompt": "Crea una noticia sobre el lanzamiento de GPT-4 Turbo",
  "category": "Tecnología",
  "categoryId": "cat-tech-123",
  "title": "OpenAI lanza GPT-4 Turbo",
  "template": "news"
}
```

## Notas Técnicas

- Usar siempre URLs de imágenes reales y accesibles
- Los avatares deben apuntar a S3: `https://s3.amazonaws.com/s3.condoor.ai/adam/`
- Iconos pueden usar `img.icons8.com` o almacenamiento propio
- Mantener consistencia en el formato de fechas (ISO 8601)
- Los colores deben estar en formato hexadecimal o rgba
- **CRÍTICO:** El componente `tituloConIcono` SIEMPRE debe incluir `categoryId` y `categoryName` que coincidan con la configuración de la nota

## Cambios Importantes en esta Versión

### Actualización del Componente tituloConIcono

**Antes:** Era un título genérico personalizable

**Ahora:** Es un indicador de categoría vinculado a la configuración de la nota

**Cambios clave:**
1. Agregadas props obligatorias: `categoryId` y `categoryName`
2. El `content` debe ser el nombre de la categoría
3. Sincronización automática con la categoría de la configuración
4. Iconos y colores se asignan automáticamente según la categoría

**Ejemplo de migración:**

```diff
// ANTES ❌
{
  "id": "tituloConIcono-1",
  "type": "tituloConIcono",
  "content": "Título personalizado",
  "props": {
    "icon": "...",
    "textColor": "#E67E22"
  }
}

// AHORA ✅
{
  "id": "tituloConIcono-1",
  "type": "tituloConIcono",
  "content": "Tecnología",
  "props": {
+   "categoryId": "cat-tech-123",
+   "categoryName": "Tecnología",
    "icon": "...",
    "textColor": "#E67E22"
  }
}
```

---

**Última actualización:** $(date +%Y-%m-%d)
**Versión:** 2.0

