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

```typescript
{
  id: "heading-1",
  type: "heading",
  content: "Título de la noticia",
  props: { level: 1 }  // 1, 2, 3, 4, 5, 6
}
```

#### 2. paragraph

Párrafos de texto.

```typescript
{
  id: "paragraph-1",
  type: "paragraph",
  content: "Contenido del párrafo...",
  props: {
    isCode: false  // true para bloques de código
  }
}
```

#### 3. bulletList

Listas con viñetas.

```typescript
{
  id: "list-1",
  type: "bulletList",
  content: "",
  props: {
    items: [
      "Primer punto de la lista",
      "Segundo punto de la lista",
      "Tercer punto de la lista"
    ],
    listStyle: "disc",        // disc, circle, square
    listColor: "#000000"
  }
}
```

#### 4. image

Imágenes.

```typescript
{
  id: "image-1",
  type: "image",
  content: "",
  props: {
    src: "https://example.com/image.jpg",
    alt: "Descripción de la imagen"
  }
}
```

#### 5. button

Botones call-to-action.

```typescript
{
  id: "button-1",
  type: "button",
  content: "Leer más",
  props: {
    url: "https://example.com/article",
    variant: "contained",     // contained, outlined, text
    color: "#1976d2"
  }
}
```

#### 6. divider

Líneas divisoras.

```typescript
{
  id: "divider-1",
  type: "divider",
  content: "",
  props: {}
}
```

#### 7. spacer

Espacios verticales.

```typescript
{
  id: "spacer-1",
  type: "spacer",
  content: "",
  props: {
    height: 20  // altura en píxeles
  }
}
```

### Componentes de Noticias

#### 8. tituloConIcono

Título con icono y gradiente (solo para newsletter).

```typescript
{
  id: "tituloConIcono-1",
  type: "tituloConIcono",
  content: "Título de la noticia",
  props: {
    icon: "https://img.icons8.com/color/48/line-chart.png",
    gradientColor1: "rgba(255, 184, 77, 0.08)",
    gradientColor2: "rgba(243, 156, 18, 0.00)",
    gradientType: "linear",
    gradientAngle: 180,
    colorDistribution: 0,
    textColor: "#E67E22"
  }
}
```

#### 9. category

Etiqueta de categoría.

```typescript
{
  id: "category-1",
  type: "category",
  content: "Tecnología",
  props: {
    color: "#e3f2fd",
    textColor: "#1565c0"
  }
}
```

#### 10. summary

Resumen o destacado.

```typescript
{
  id: "summary-1",
  type: "summary",
  content: "Resumen de la noticia...",
  props: {
    summaryType: "resumen",  // resumen, destacado
    label: "Resumen",
    icon: "https://img.icons8.com/color/48/note.png",
    backgroundColor: "#f8f9fa",
    textColor: "#495057"
  }
}
```

#### 11. respaldadoPor

Información de autor/redactor.

```typescript
{
  id: "respaldadoPor-1",
  type: "respaldadoPor",
  content: "Respaldado por texto",
  props: {
    texto: "Respaldado por",
    nombre: "Redacción",
    avatarUrl: "https://s3.amazonaws.com/s3.condoor.ai/adam/9a6ed0c855.webp",
    avatarTamano: 21,
    mostrarEscritorPropietario: false,
    escritorNombre: "Escritor",
    escritorAvatarUrl: "",
    propietarioNombre: "Propietario",
    propietarioAvatarUrl: ""
  }
}
```

### Componentes Compuestos

#### 12. gallery

Galería de imágenes.

```typescript
{
  id: "gallery-1",
  type: "gallery",
  content: "",
  props: {
    images: [
      { url: "https://example.com/1.jpg", caption: "Imagen 1" },
      { url: "https://example.com/2.jpg", caption: "Imagen 2" }
    ],
    layout: "grid"  // grid, single, carousel
  }
}
```

#### 13. imageText

Imagen con texto al lado.

```typescript
{
  id: "imageText-1",
  type: "imageText",
  content: "Texto descriptivo...",
  props: {
    imageUrl: "https://example.com/image.jpg",
    imagePosition: "left",  // left, right
    imageWidth: "50%"
  }
}
```

#### 14. twoColumns

Contenido en dos columnas.

```typescript
{
  id: "twoColumns-1",
  type: "twoColumns",
  content: "",
  props: {
    leftContent: "Contenido columna izquierda",
    rightContent: "Contenido columna derecha"
  }
}
```

## Ejemplo Completo: Nota de Noticias

### Newsletter (objData) - Versión Resumida

```typescript
const newsletterComponents: EmailComponent[] = [
  {
    id: 'tituloConIcono-1',
    type: 'tituloConIcono',
    content: 'OpenAI lanza GPT-4 Turbo con mejoras significativas',
    props: {
      icon: 'https://img.icons8.com/color/48/artificial-intelligence.png',
      gradientColor1: 'rgba(139, 69, 255, 0.08)',
      gradientColor2: 'rgba(75, 0, 130, 0.00)',
      gradientType: 'linear',
      gradientAngle: 180,
      colorDistribution: 0,
      textColor: '#8B45FF',
    },
  },
  {
    id: 'image-1',
    type: 'image',
    content: '',
    props: {
      src: 'https://example.com/gpt4-turbo.jpg',
      alt: 'GPT-4 Turbo logo',
    },
  },
  {
    id: 'category-1',
    type: 'category',
    content: 'Inteligencia Artificial',
    props: {
      color: '#f3e5f5',
      textColor: '#6a1b9a',
    },
  },
  {
    id: 'heading-1',
    type: 'heading',
    content: 'GPT-4 Turbo: Más rápido y económico',
    props: { level: 2 },
  },
  {
    id: 'respaldadoPor-1',
    type: 'respaldadoPor',
    content: '',
    props: {
      texto: 'Por',
      nombre: 'Redacción Tech',
      avatarUrl: 'https://s3.amazonaws.com/s3.condoor.ai/adam/avatar.webp',
      avatarTamano: 21,
      mostrarEscritorPropietario: false,
    },
  },
  {
    id: 'summary-1',
    type: 'summary',
    content:
      'OpenAI presenta GPT-4 Turbo con contexto de 128K tokens, 3x más barato y capacidades mejoradas para aplicaciones empresariales.',
    props: {
      summaryType: 'resumen',
      label: 'Resumen',
      icon: 'https://img.icons8.com/color/48/note.png',
      backgroundColor: '#f8f9fa',
      textColor: '#495057',
    },
  },
  {
    id: 'paragraph-1',
    type: 'paragraph',
    content:
      'La nueva versión de GPT-4 incluye soporte para 128,000 tokens de contexto, reducción del 66% en costos y mejoras en seguimiento de instrucciones.',
    props: {},
  },
  {
    id: 'bulletList-1',
    type: 'bulletList',
    content: '',
    props: {
      items: [
        'Ventana de contexto de 128K tokens (equivalente a 300 páginas)',
        'Precio: $0.01 por 1K tokens de entrada (66% más barato)',
        'Mayor precisión en seguimiento de instrucciones',
        'Soporte para JSON mode y function calling mejorado',
      ],
      listStyle: 'disc',
      listColor: '#666666',
    },
  },
  {
    id: 'button-1',
    type: 'button',
    content: 'Leer artículo completo',
    props: {
      url: 'https://openai.com/blog/gpt-4-turbo',
      variant: 'contained',
      color: '#8B45FF',
    },
  },
];
```

### Web (objDataWeb) - Versión Extendida

```typescript
const webComponents: EmailComponent[] = [
  {
    id: 'heading-1-web',
    type: 'heading',
    content: 'OpenAI lanza GPT-4 Turbo: Una revolución en IA accesible',
    props: { level: 1 },
  },
  {
    id: 'image-1-web',
    type: 'image',
    content: '',
    props: {
      src: 'https://example.com/gpt4-turbo-banner.jpg',
      alt: 'Banner de lanzamiento GPT-4 Turbo',
    },
  },
  {
    id: 'category-1-web',
    type: 'category',
    content: 'Inteligencia Artificial',
    props: {
      color: '#f3e5f5',
      textColor: '#6a1b9a',
    },
  },
  {
    id: 'respaldadoPor-1-web',
    type: 'respaldadoPor',
    content: '',
    props: {
      texto: 'Escrito por',
      nombre: 'María González',
      avatarUrl: 'https://s3.amazonaws.com/s3.condoor.ai/adam/avatar-maria.webp',
      avatarTamano: 21,
      mostrarEscritorPropietario: true,
      escritorNombre: 'María González',
      escritorAvatarUrl: 'https://s3.amazonaws.com/s3.condoor.ai/adam/avatar-maria.webp',
    },
  },
  {
    id: 'summary-1-web',
    type: 'summary',
    content:
      'En un evento especial, OpenAI ha presentado GPT-4 Turbo, una versión mejorada de su modelo de lenguaje que promete democratizar el acceso a la IA con precios más bajos, mayor capacidad y funcionalidades empresariales avanzadas.',
    props: {
      summaryType: 'resumen',
      label: 'Lo que necesitas saber',
      icon: 'https://img.icons8.com/color/48/note.png',
      backgroundColor: '#f8f9fa',
      textColor: '#495057',
    },
  },
  {
    id: 'heading-2-web',
    type: 'heading',
    content: 'Características principales',
    props: { level: 2 },
  },
  {
    id: 'paragraph-1-web',
    type: 'paragraph',
    content:
      'GPT-4 Turbo representa un salto cualitativo en la tecnología de modelos de lenguaje. Con una ventana de contexto ampliada a 128,000 tokens, el modelo puede procesar el equivalente a más de 300 páginas de texto en una sola consulta, abriendo nuevas posibilidades para aplicaciones que requieren análisis de documentos extensos.',
    props: {},
  },
  {
    id: 'heading-3-web',
    type: 'heading',
    content: 'Reducción significativa de costos',
    props: { level: 3 },
  },
  {
    id: 'paragraph-2-web',
    type: 'paragraph',
    content:
      'Uno de los anuncios más impactantes es la reducción del 66% en los costos de uso. El precio de entrada se establece en $0.01 por cada 1,000 tokens, mientras que la salida cuesta $0.03 por 1,000 tokens, haciendo que la tecnología sea más accesible para empresas de todos los tamaños.',
    props: {},
  },
  {
    id: 'bulletList-1-web',
    type: 'bulletList',
    content: '',
    props: {
      items: [
        'Ventana de contexto de 128K tokens: Procesa documentos largos sin fragmentar',
        'Pricing reducido: $0.01 por 1K tokens de entrada (66% más económico)',
        'Mayor precisión: Mejoras en seguimiento de instrucciones complejas',
        'JSON mode nativo: Respuestas estructuradas garantizadas',
        'Function calling mejorado: Integración más robusta con sistemas externos',
        'Conocimiento actualizado: Datos hasta abril de 2023',
      ],
      listStyle: 'disc',
      listColor: '#333333',
    },
  },
  {
    id: 'heading-4-web',
    type: 'heading',
    content: 'Impacto en la industria',
    props: { level: 3 },
  },
  {
    id: 'paragraph-3-web',
    type: 'paragraph',
    content:
      'Esta actualización posiciona a OpenAI como líder indiscutible en el mercado de IA generativa empresarial. Empresas como Shopify, Canva y Discord ya están implementando GPT-4 Turbo en sus productos, reportando mejoras significativas en experiencia de usuario y reducción de costos operativos.',
    props: {},
  },
  {
    id: 'imageText-1-web',
    type: 'imageText',
    content:
      "Los desarrolladores pueden comenzar a usar GPT-4 Turbo inmediatamente a través de la API de OpenAI. El modelo está disponible con el identificador 'gpt-4-1106-preview' y se convertirá en el modelo estable en las próximas semanas.",
    props: {
      imageUrl: 'https://example.com/api-dashboard.jpg',
      imagePosition: 'right',
      imageWidth: '40%',
    },
  },
  {
    id: 'heading-5-web',
    type: 'heading',
    content: '¿Qué significa para los desarrolladores?',
    props: { level: 3 },
  },
  {
    id: 'paragraph-4-web',
    type: 'paragraph',
    content:
      'Para la comunidad de desarrolladores, GPT-4 Turbo abre un mundo de posibilidades. La capacidad de procesar contextos más largos permite crear aplicaciones más sofisticadas, desde asistentes de investigación que pueden analizar papers completos hasta sistemas de atención al cliente que mantienen conversaciones complejas sin perder el hilo.',
    props: {},
  },
  {
    id: 'divider-1-web',
    type: 'divider',
    content: '',
    props: {},
  },
  {
    id: 'summary-2-web',
    type: 'summary',
    content:
      'GPT-4 Turbo marca un antes y un después en la accesibilidad de la IA avanzada. Con costos reducidos y capacidades ampliadas, más organizaciones podrán aprovechar el poder de los modelos de lenguaje en sus operaciones diarias.',
    props: {
      summaryType: 'destacado',
      label: 'Conclusión',
      icon: 'https://img.icons8.com/color/48/checked.png',
      backgroundColor: '#e8f5e9',
      textColor: '#2e7d32',
    },
  },
];
```

## Reglas y Mejores Prácticas

### IDs Únicos

- Newsletter: sufijo numérico (`heading-1`, `paragraph-1`)
- Web: sufijo `-web` (`heading-1-web`, `paragraph-1-web`)

### Diferencias Newsletter vs Web

| Aspecto     | Newsletter (objData) | Web (objDataWeb)            |
| ----------- | -------------------- | --------------------------- |
| Longitud    | Resumido, conciso    | Extendido, detallado        |
| Componentes | 5-10 elementos       | 10-20 elementos             |
| Párrafos    | 1-2 oraciones        | 3-5 oraciones               |
| Estructura  | Linear, simple       | Jerárquica con subsecciones |
| Objetivo    | Captar atención      | Profundizar información     |

### Validaciones Backend

1. **IDs únicos**: No debe haber IDs duplicados en el mismo array
2. **Contenido obligatorio**: `heading`, `paragraph`, `category` deben tener content
3. **Props requeridas**: `image` debe tener `src` y `alt`
4. **Límites de longitud**:
   - Newsletter: content de párrafos max 200 caracteres
   - Web: content de párrafos max 500 caracteres
5. **URLs válidas**: Validar formato de URLs en images y buttons

### Categorías Recomendadas

```typescript
const categories = {
  Tecnología: { color: '#e3f2fd', textColor: '#1565c0' },
  Negocios: { color: '#fff3e0', textColor: '#e65100' },
  Ciencia: { color: '#e8f5e9', textColor: '#2e7d32' },
  Política: { color: '#fce4ec', textColor: '#c2185b' },
  Deportes: { color: '#fff8e1', textColor: '#f57f17' },
  Entretenimiento: { color: '#f3e5f5', textColor: '#6a1b9a' },
  Salud: { color: '#e0f2f1', textColor: '#00695c' },
  Economía: { color: '#fbe9e7', textColor: '#bf360c' },
};
```

## Sistema Asíncrono con Polling

El backend implementa un sistema **asíncrono** donde la generación se realiza en segundo plano y el frontend consulta el estado mediante polling.

### Flujo de Trabajo

1. **Iniciar Generación**: POST devuelve `taskId`
2. **Polling**: Consultar estado cada 2-3 segundos
3. **Estados de Progreso**: PENDING → GENERATING_IMAGE → GENERATING_WEB_CONTENT → GENERATING_NEWSLETTER_CONTENT → COMPLETED
4. **Obtener Resultado**: Cuando `status: "COMPLETED"`, los datos están en `data`

### Request Inicial

```bash
curl --location 'http://localhost:44444/api/v1/ai/generate-note' \
--header 'Content-Type: application/json' \
--data '{
    "prompt": "Crea una noticia sobre...",
    "category": "Tecnología",
    "title": "Título de la noticia",
    "template": "NEWS",
    "userId": "userId123",
    "plan": "free"
}'
```

**Response Inicial:**

```json
{
  "taskId": "69005308a8d89a7d4bfd2df4",
  "status": "PENDING",
  "message": "Generación de noticia iniciada"
}
```

### Polling Status

```bash
curl --location 'http://localhost:44444/api/v1/ai/status/:taskId'
```

**Estados Posibles:**

```typescript
type TaskStatus =
  | 'PENDING' // 0% - Tarea en cola
  | 'GENERATING_IMAGE' // 25% - Generando imagen
  | 'GENERATING_WEB_CONTENT' // 50% - Generando contenido web
  | 'GENERATING_NEWSLETTER_CONTENT' // 75% - Generando newsletter
  | 'COMPLETED' // 100% - Completado
  | 'ERROR'; // Error en proceso
```

**Response en Progreso:**

```json
{
  "taskId": "69005308a8d89a7d4bfd2df4",
  "status": "GENERATING_IMAGE",
  "progress": 25,
  "message": "Generando imagen con IA...",
  "success": false,
  "createdAt": "2025-10-28T05:22:15.524Z",
  "updatedAt": "2025-10-28T05:22:17.222Z"
}
```

**Response Completado:**

```json
{
  "taskId": "69005308a8d89a7d4bfd2df4",
  "status": "COMPLETED",
  "progress": 100,
  "message": "Generación completada exitosamente",
  "success": true,
  "createdAt": "2025-10-28T05:22:15.524Z",
  "updatedAt": "2025-10-28T05:25:42.548Z",
  "data": {
    "objData": "[{\"id\":\"...\"}]", // ⚠️ STRING JSON
    "objDataWeb": "[{\"id\":\"...\"}]", // ⚠️ STRING JSON
    "title": "Socialismo o capitalismo",
    "content": "Durante décadas...",
    "description": "Este informe revisa...",
    "origin": "AI",
    "coverImageUrl": "https://...",
    "metadata": {
      "generatedAt": "2025-10-28T05:25:42.548Z",
      "promptUsed": "Crea una noticia...",
      "model": "gpt-5-nano",
      "tokensUsed": 23483
    }
  }
}
```

### IMPORTANTE: Parsing de Datos

⚠️ **`objData` y `objDataWeb` vienen como STRINGS JSON**, no como arrays. El frontend DEBE parsearlos:

```typescript
const response = await pollStatus(taskId);
if (response.status === 'COMPLETED' && response.data) {
  const objData = JSON.parse(response.data.objData) as EmailComponent[];
  const objDataWeb = JSON.parse(response.data.objDataWeb) as EmailComponent[];
  // Usar objData y objDataWeb parseados
}
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
    };
  };
  error?: {
    code: string;
    message: string;
  };
}
```

## Ejemplo de Request

```typescript
// POST /api/ai/generate-note
{
  "prompt": "Crea una noticia sobre el lanzamiento de GPT-4 Turbo",
  "category": "Tecnología",
  "title": "OpenAI lanza GPT-4 Turbo",
  "template": "news"
}
```

## Notas Técnicas

- Usar siempre URLs de imágenes reales y accesibles
- Los avatares deben apuntar a S3: `https://s3.amazonaws.com/s3.condoor.ai/adam/`
- Iconos pueden usar img.icons8.com o almacenamiento propio
- Mantener consistencia en el formato de fechas (ISO 8601)
- Los colores deben estar en formato hexadecimal o rgba
- **Polling**: Consultar estado cada 2-3 segundos, máximo 5 minutos de timeout
- **Parsing**: Siempre parsear `objData` y `objDataWeb` con `JSON.parse()`
- **URLs temporales**: Las URLs de DALL-E expiran en ~2 horas, descargar y almacenar en S3
