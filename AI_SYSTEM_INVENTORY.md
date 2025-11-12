# INVENTARIO COMPLETO DEL SISTEMA DE IA

## Sistema de Generación de Notas, Texto e Imágenes con IA

---

## 📋 ÍNDICE

1. [Servicios Core de IA](#1-servicios-core-de-ia)
2. [Stores de Estado (Zustand)](#2-stores-de-estado-zustand)
3. [Tipos TypeScript](#3-tipos-typescript)
4. [Componentes de UI - Generación de Notas](#4-componentes-de-ui---generación-de-notas)
5. [Componentes de UI - Edición de Texto con IA](#5-componentes-de-ui---edición-de-texto-con-ia)
6. [Componentes de UI - Generación de Imágenes](#6-componentes-de-ui---generación-de-imágenes)
7. [Endpoints y Configuración](#7-endpoints-y-configuración)
8. [Documentación](#8-documentación)
9. [Flujos de Integración](#9-flujos-de-integración)

---

## 1. SERVICIOS CORE DE IA

### 📄 `src/services/ai-service.ts`

**Propósito:** Servicio principal para generación de contenido con IA (notas completas)

**Funciones Principales:**

- `initiateNoteGeneration(request)` - Inicia la generación asíncrona
- `checkTaskStatus(taskId)` - Consulta el estado de una tarea
- `pollUntilComplete(taskId, onProgress)` - Realiza polling hasta completar
- `generateNoteComplete(request, onProgress)` - Función conveniente todo-en-uno
- `parseGeneratedContent(data)` - Parsea JSON strings del backend
- `validateNoteRequest(request)` - Valida requests antes de enviar

**Características:**

- Sistema asíncrono con polling cada 2.5 segundos
- Máximo 5 minutos de espera
- Soporte para cancelación
- Callbacks de progreso
- Validación de requests

**Configuración de Polling:**

```typescript
{
  interval: 2500,        // 2.5 segundos entre consultas
  maxDuration: 300000,   // 5 minutos máximo
  maxAttempts: 120       // 120 intentos máximo
}
```

---

## 2. STORES DE ESTADO (ZUSTAND)

### 📄 `src/store/AiGenerationStore.ts`

**Propósito:** Estado global para generación de notas con IA

**Estado:**

- `loading: boolean` - Indica si está generando
- `taskId: string | null` - ID de la tarea actual
- `status: TaskStatus | null` - Estado actual (PENDING, GENERATING_IMAGE, etc.)
- `progress: number` - Progreso 0-100%
- `message: string` - Mensaje descriptivo
- `error: string | null` - Error si hay
- `isCancelled: boolean` - Flag de cancelación
- `currentGeneration: ParsedGeneratedContent | null` - Contenido generado

**Acciones:**

- `generateNote(prompt, title?, category?, template?)` - Genera nota completa
- `cancelGeneration()` - Cancela generación actual
- `clearCurrentGeneration()` - Limpia estado
- `setLoading(loading)`, `setError(error)`, `setProgress(...)`

**Estados de Tarea:**

- `PENDING` (0%) - En cola
- `GENERATING_IMAGE` (25%) - Generando imagen
- `GENERATING_WEB_CONTENT` (50%) - Contenido web
- `GENERATING_NEWSLETTER_CONTENT` (75%) - Contenido newsletter
- `COMPLETED` (100%) - Completado
- `ERROR` / `FAILED` - Errores

---

### 📄 `src/store/MagicWriteStore.ts`

**Propósito:** Estado global para edición de texto con IA (Magic Write)

**Estado:**

- `loading: boolean`
- `error: string | null`
- `lastResult: string | null` - Último texto generado

**Acciones:**

- `processMagicWrite(action, text, language?)` - Procesa texto con IA
- `clearLastResult()` - Limpia resultado

**Acciones Disponibles:**

- Corrección: `corregir_errores`, `mejorar_texto`
- Generación: `generador`, `generador_parrafos`, `generador_descripcion`, `generador_ensayos`, `continuar_texto`
- Organización: `brain_storming`, `listas`, `cuestionario`
- Transformación: `reescribir`, `parafrasear`, `resumir`
- Títulos: `generador_titulos`
- Traducción: `traducir` (con selector de idioma)

---

### 📄 `src/store/MediaAiStore.ts`

**Propósito:** Estado global para generación de imágenes con IA

**Estado:**

- `loading: boolean`
- `error: string | null`
- `currentGeneration: MediaAiGeneration | null` - Generación actual
- `history: MediaAiGeneration[]` - Historial de generaciones
- `pollingId: string | null` - ID de generación en polling

**Acciones:**

- `generateImage(prompt, resolution?, userId?)` - Inicia generación
- `pollStatus(generationId)` - Consulta estado
- `fetchHistory(userId?, limit?)` - Carga historial
- `deleteGeneration(id, userId?)` - Elimina generación
- `clearCurrentGeneration()` - Limpia estado actual

**Resoluciones Soportadas:**

- `cuadrado` - 1024x1024 (1:1)
- `retrato` - 1024x1792 (9:16)
- `paisaje` - 1792x1024 (16:9)

**Estados de Generación:**

- `PENDING` - En cola
- `PROCESSING` - Procesando
- `COMPLETED` - Completado con `resultUrl`
- `FAILED` - Falló con mensaje de error

---

## 3. TIPOS TYPESCRIPT

### 📄 `src/types/ai-generation.ts`

**Tipos para generación de notas con IA**

```typescript
// Estados de tarea
type TaskStatus =
  | 'PENDING'
  | 'GENERATING_IMAGE'
  | 'GENERATING_WEB_CONTENT'
  | 'GENERATING_NEWSLETTER_CONTENT'
  | 'COMPLETED'
  | 'ERROR'
  | 'FAILED';

// Request
interface GenerateNoteRequest {
  prompt: string;
  category?: string;
  title?: string;
  template?: 'NEWS' | 'ARTICLE' | 'GUIDE' | 'TUTORIAL';
  userId: string;
  plan: string | null;
}

// Response inicial
interface InitiateGenerationResponse {
  taskId: string;
  status: TaskStatus;
  message: string;
}

// Response de polling
interface TaskStatusResponse {
  taskId: string;
  status: TaskStatus;
  progress: number;
  message: string;
  success: boolean;
  data?: GeneratedContentData;
  error?: { code: string; message: string };
}

// Contenido parseado
interface ParsedGeneratedContent {
  objData: NewsletterComponent[]; // Versión newsletter
  objDataWeb: NewsletterComponent[]; // Versión web extendida
  title: string;
  content: string;
  description: string;
  origin: string;
  coverImageUrl: string;
  metadata: GenerationMetadata;
}
```

---

### 📄 `src/types/magic-write.ts`

**Tipos para edición de texto con IA**

```typescript
// Acciones disponibles
type MagicWriteAction =
  | 'generador'
  | 'brain_storming'
  | 'generador_parrafos'
  | 'corregir_errores'
  | 'mejorar_texto'
  | 'generador_descripcion'
  | 'listas'
  | 'reescribir'
  | 'parafrasear'
  | 'generador_ensayos'
  | 'generador_titulos'
  | 'continuar_texto'
  | 'resumir'
  | 'cuestionario'
  | 'traducir';

// Request
interface MagicWriteRequest {
  action: MagicWriteAction;
  text: string;
  language?: string; // Solo para traducir
  userId?: string;
  plan?: string | null;
}

// Response
interface MagicWriteResponse {
  text: string; // HTML formateado
}

// Categorías
type AICategoryType =
  | 'correction'
  | 'generation'
  | 'organization'
  | 'transformation'
  | 'titles'
  | 'translation';

// Idiomas soportados
const SUPPORTED_LANGUAGES = [
  'inglés',
  'francés',
  'alemán',
  'italiano',
  'portugués',
  'chino',
  'japonés',
  'ruso',
];
```

---

### 📄 `src/types/media-ai.ts`

**Tipos para generación de imágenes con IA**

```typescript
// Estados
type MediaAiStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// Resoluciones
type MediaAiResolution = 'cuadrado' | 'retrato' | 'paisaje';

// Request
interface GenerateImageRequest {
  prompt: string;
  type: MediaAiType; // 'IMAGE' | 'VIDEO' | 'GIF' | 'AUDIO'
  userId?: string;
  resolution?: MediaAiResolution;
  plan?: string | null;
}

// Response inicial
interface GenerateImageResponse {
  id: string;
  prompt: string;
  type: MediaAiType;
  status: MediaAiStatus;
  createdAt: string;
  updatedAt: string;
}

// Generación completa
interface MediaAiGeneration {
  id: string;
  prompt: string;
  type: MediaAiType;
  status: MediaAiStatus;
  resultUrl?: string; // URL de la imagen generada
  error?: string | null;
  metadata?: MediaAiMetadata;
  createdAt: string;
  updatedAt: string;
}

// Metadata
interface MediaAiMetadata {
  size: string; // "1024x1024"
  resolution: MediaAiResolution;
  model: string;
  quality: string;
  style: string;
  generatedAt: string;
}
```

---

## 4. COMPONENTES DE UI - GENERACIÓN DE NOTAS

### 📄 `src/components/newsletter-note/ai-creation/AINoteModal.tsx`

**Modal principal para crear notas con IA**

**Props:**

```typescript
{
  open: boolean
  onClose: () => void
  selectedTemplate?: string
  onInjectAIData?: (data: AIGeneratedData) => void
}
```

**Características:**

- Formulario con título (opcional), categoría (opcional) y prompt (requerido)
- Sugerencias de prompts por categoría
- Validación de formulario
- Integración con `AiGenerationStore`
- Muestra `AIGenerationProgress` durante generación
- Auto-cierre al completar exitosamente
- Soporte para cancelación

**Categorías Disponibles:**

- Especies Marinas, Acuarios, Conservación, Salud Marina, Cría, Corales, Invertebrados, Equipamiento

---

### 📄 `src/components/newsletter-note/ai-creation/AIGenerationProgress.tsx`

**Componente para mostrar progreso de generación**

**Props:**

```typescript
{
  status: TaskStatus
  progress: number       // 0-100
  message?: string
  onCancel?: () => void
  showCancel?: boolean
}
```

**Características:**

- Barra de progreso animada con shimmer effect
- Iconos y colores por estado
- Mensajes descriptivos por fase
- Estimación de tiempo (2-3 minutos)
- Botón de cancelación
- Información contextual por estado

**Estados Visuales:**

- PENDING - Gris, hourglass icon
- GENERATING_IMAGE - Azul, gallery icon
- GENERATING_WEB_CONTENT - Naranja, document icon
- GENERATING_NEWSLETTER_CONTENT - Morado, letter icon
- COMPLETED - Verde, check icon
- ERROR/FAILED - Rojo, error icon

---

### 📄 `src/components/newsletter-note/ai-creation/AINewsletterModal.tsx`

**Modal para crear newsletters completos con IA (EN DESARROLLO)**

**Props:**

```typescript
{
  open: boolean
  onClose: () => void
}
```

**Características:**

- Generación de múltiples notas (1-10)
- Prompt individual por nota
- Sugerencias de prompts
- **NOTA:** Actualmente lanza error "Funcionalidad en desarrollo"

---

### 📄 `src/components/newsletter-note/ai-creation/prompt-suggestions.ts`

**Sugerencias de prompts precargadas**

**Funciones:**

- `getAllPromptSuggestions()` - Todas las sugerencias
- `getPromptsByCategory(category)` - Filtradas por categoría
- `getUniqueCategories()` - Lista de categorías únicas

---

## 5. COMPONENTES DE UI - EDICIÓN DE TEXTO CON IA

### 📄 `src/components/newsletter-note/email-editor/ai-menu/AIAssistantModal.tsx`

**Modal principal del asistente de IA para edición de texto**

**Props:**

```typescript
{
  open: boolean
  onClose: () => void
  selectedText: string           // Texto seleccionado a procesar
  onApply: (newText: string) => void  // Callback para aplicar cambios
}
```

**Características:**

- Vista dividida: original vs resultado
- Opciones de IA organizadas por categorías (acordeones)
- Selector de idiomas para traducción
- Comparación visual de textos
- Botones "Aplicar cambios" / "Cancelar"
- Integración con `MagicWriteStore`

**Subcomponentes:**

- `AIOptionCard` - Tarjeta individual de opción
- `LanguageSelector` - Selector de idioma para traducciones
- `TextComparisonView` - Vista de comparación de textos

---

### 📄 `src/components/newsletter-note/simple-tiptap-editor.tsx`

**Editor TipTap con integración de IA**

**Props incluyen:**

```typescript
{
  content: string
  onChange: (content: string) => void
  showAIButton?: boolean  // Por defecto true
  // ... otros props de editor
}
```

**Características:**

- Botón de IA en toolbar (cuando hay texto seleccionado)
- Abre `AIAssistantModal` al hacer clic
- Reemplaza texto seleccionado con resultado de IA
- Mantiene formato HTML

**Funciones IA:**

- `handleAIClick()` - Abre modal con texto seleccionado
- `handleApplyAIResult(newText)` - Aplica cambios en el editor

---

## 6. COMPONENTES DE UI - GENERACIÓN DE IMÁGENES

### 📄 `src/components/newsletter-note/email-editor/right-panel/ImageAiGenerator.tsx`

**Generador de imágenes con IA**

**Props:**

```typescript
{
  onImageGenerated: (imageUrl: string) => void
  userId?: string
}
```

**Características:**

- Campo de prompt multilinea
- Selector de resolución (cuadrado, retrato, paisaje)
- Botón "Generar Imagen"
- Preview de imagen generada con metadata
- Polling progresivo (2s → 10s)
- Historial de generaciones (grid)
- Opciones: "Usar esta Imagen" / "Generar Otra"
- Eliminación de imágenes del historial
- Integración con `MediaAiStore`

**Estados:**

- Formulario inicial
- Generando (con spinner y mensaje)
- Preview con imagen generada
- Error con opción de reintentar
- Historial (cuando no está generando)

---

### 📄 `src/components/newsletter-note/email-editor/right-panel/ImageCropDialog.tsx`

**Dialog con tabs: Editor de imágenes + Generador IA**

**Props:**

```typescript
{
  open: boolean
  onClose: () => void
  onSave: (imageData: ImageData) => void
  initialImage?: string
  currentAspectRatio?: number
  initialTab?: 'edit' | 'ai'
}
```

**Características:**

- Dos tabs: "Editar" y "IA"
- Tab "IA" embebe `ImageAiGenerator`
- Tab "Editar" para crop/filtros tradicionales
- Integración en componentes de imagen

---

### 📄 `src/components/newsletter-note/email-editor/right-panel/ImageOptions.tsx`

**Opciones de imagen con botón "Generar con IA"**

**Características:**

- Botón "Generar con IA" en modal de selección de fuente
- Abre `ImageCropDialog` con tab IA
- Callback `onImageGenerated` actualiza componente

---

### 📄 `src/components/newsletter-note/email-editor/right-panel/GalleryOptions.tsx`

**Opciones de galería con soporte IA**

**Características:**

- Similar a `ImageOptions`
- Botón "Generar con IA" por imagen
- Manejo de múltiples imágenes

---

## 7. ENDPOINTS Y CONFIGURACIÓN

### 📄 `src/utils/axiosInstance.ts`

**Cliente HTTP y configuración de endpoints**

**Función:**

```typescript
createAxiosInstance({ isIA?: boolean })
```

- `isIA: false` → `CONFIG.serverUrl` (backend principal)
- `isIA: true` → `CONFIG.serverUrlIA` (servidor de IA)

**Endpoints de IA:**

```typescript
endpoints = {
  // Magic Write
  magicWrite: {
    process: '/api/v1/magic-write',
  },

  // Media AI (imágenes)
  mediaAi: {
    generate: '/api/v1/media-ai/generate',
    status: (id) => `/api/v1/media-ai/status/${id}`,
    history: '/api/v1/media-ai/history',
    delete: (id) => `/api/v1/media-ai/${id}`,
  },

  // AI Generation (notas)
  ai: {
    generateNote: '/api/v1/ai/generate-note',
    generateNewsletter: '/api/v1/ai/generate-newsletter', // NO IMPLEMENTADO
    checkStatus: (taskId) => `/api/v1/ai/status/${taskId}`,
  },
};
```

**Interceptores:**

- Añade `Authorization: Bearer ${token}`
- Manejo de errores 401 (logout automático)
- Timeout: 80 segundos

---

### 📄 `src/global-config.ts`

**Configuración global**

```typescript
{
  serverUrl: string; // Backend principal
  serverUrlIA: string; // Servidor de IA
}
```

---

## 8. DOCUMENTACIÓN

### 📄 `docs/AI_INTEGRATION_GUIDE.md`

**Guía de integración del sistema de IA**

Contiene:

- Arquitectura del sistema
- Flujo de trabajo completo
- Ejemplos de uso
- Troubleshooting

### 📄 `docs/AI_DATA_STRUCTURE.md`

**Estructura de datos de IA**

Contiene:

- Formato de `objData` y `objDataWeb`
- Estructura de componentes
- Ejemplos de respuestas

### 📄 `docs/IMPLEMENTATION_SUMMARY.md`

**Resumen de implementación**

### 📄 `docs/AI_HEADER_BUTTON_FLOW.md`

**Flujo del botón de IA en header**

---

## 9. FLUJOS DE INTEGRACIÓN

### 🔄 FLUJO 1: Generación de Nota con IA

```
Usuario abre AINoteModal
  ↓
Completa formulario (prompt, título?, categoría?)
  ↓
Click "Generar Nota"
  ↓
AiGenerationStore.generateNote()
  ↓
ai-service.generateNoteComplete()
  ↓
1. initiateNoteGeneration() → POST /api/v1/ai/generate-note
   ← Backend devuelve taskId
  ↓
2. pollUntilComplete(taskId)
   Cada 2.5s: GET /api/v1/ai/status/:taskId
   ↓
   Estado: PENDING (0%)
   ↓
   Estado: GENERATING_IMAGE (25%)
   ↓
   Estado: GENERATING_WEB_CONTENT (50%)
   ↓
   Estado: GENERATING_NEWSLETTER_CONTENT (75%)
   ↓
   Estado: COMPLETED (100%) + data
  ↓
3. parseGeneratedContent(data)
   - JSON.parse(objData)
   - JSON.parse(objDataWeb)
  ↓
Store actualiza: currentGeneration
  ↓
Modal ejecuta: onInjectAIData(result)
  ↓
Editor recibe componentes y renderiza
  ↓
Modal se cierra automáticamente
```

**Componentes Involucrados:**

1. `AINoteModal` (UI)
2. `AIGenerationProgress` (UI progreso)
3. `AiGenerationStore` (estado)
4. `ai-service` (lógica)
5. `axiosInstance` (HTTP)

---

### 🔄 FLUJO 2: Edición de Texto con IA (Magic Write)

```
Usuario selecciona texto en SimpleTipTapEditor
  ↓
Click botón "IA" en toolbar
  ↓
SimpleTipTapEditor.handleAIClick()
  - Guarda rango de selección
  - Extrae HTML del fragmento
  ↓
Abre AIAssistantModal
  ↓
Usuario selecciona acción (ej: "Mejorar texto")
  ↓
AIAssistantModal.handleOptionClick()
  ↓
MagicWriteStore.processMagicWrite(action, text)
  ↓
POST /api/v1/magic-write
  Body: { action, text, userId, plan }
  ↓
Backend procesa con IA (LLM)
  ↓
← Respuesta: { text: "texto mejorado en HTML" }
  ↓
Store actualiza: lastResult
  ↓
TextComparisonView muestra: original vs resultado
  ↓
Usuario click "Aplicar cambios"
  ↓
AIAssistantModal.handleApply()
  ↓
Callback: onApply(newText)
  ↓
SimpleTipTapEditor.handleApplyAIResult()
  - Borra texto seleccionado
  - Inserta nuevo texto
  ↓
Modal se cierra
```

**Componentes Involucrados:**

1. `SimpleTipTapEditor` (editor)
2. `AIAssistantModal` (UI principal)
3. `TextComparisonView` (comparación)
4. `AIOptionCard` (tarjetas de opciones)
5. `LanguageSelector` (para traducciones)
6. `MagicWriteStore` (estado)
7. `axiosInstance` (HTTP)

---

### 🔄 FLUJO 3: Generación de Imagen con IA

```
Usuario abre ImageCropDialog (tab "IA")
o
Usuario click "Generar con IA" en ImageOptions
  ↓
Se muestra ImageAiGenerator
  ↓
Usuario escribe prompt y selecciona resolución
  ↓
Click "Generar Imagen"
  ↓
MediaAiStore.generateImage(prompt, resolution)
  ↓
POST /api/v1/media-ai/generate
  Body: { prompt, type: 'IMAGE', resolution, userId, plan }
  ↓
Backend inicia generación
  ↓
← Respuesta: { id: "gen-123", status: "PENDING" }
  ↓
Store guarda: pollingId = "gen-123"
  ↓
ImageAiGenerator.startPolling("gen-123")
  ↓
Polling progresivo (2s, 3s, 4.5s, ... hasta 10s)
  Cada iteración: GET /api/v1/media-ai/status/:id
  ↓
  Estado: PENDING
  ↓
  Estado: PROCESSING
  ↓
  Estado: COMPLETED + resultUrl
  ↓
Store actualiza: currentGeneration
  ↓
ImageAiGenerator muestra preview
  ↓
Usuario click "Usar esta Imagen"
  ↓
Callback: onImageGenerated(resultUrl)
  ↓
Componente padre actualiza imagen
  ↓
Dialog se cierra
```

**Adicionalmente:**

- Historial se carga al montar: `fetchHistory()`
- Usuario puede eliminar del historial: `deleteGeneration(id)`
- Usuario puede generar otra: `handleGenerateAnother()`

**Componentes Involucrados:**

1. `ImageAiGenerator` (UI principal)
2. `ImageCropDialog` (contenedor con tabs)
3. `ImageOptions` / `GalleryOptions` (integradores)
4. `MediaAiStore` (estado)
5. `axiosInstance` (HTTP)

---

## 📊 RESUMEN DE ARCHIVOS

### **Servicios (1 archivo)**

- `src/services/ai-service.ts`

### **Stores (3 archivos)**

- `src/store/AiGenerationStore.ts`
- `src/store/MagicWriteStore.ts`
- `src/store/MediaAiStore.ts`

### **Tipos (3 archivos)**

- `src/types/ai-generation.ts`
- `src/types/magic-write.ts`
- `src/types/media-ai.ts`

### **Componentes UI - Generación de Notas (4 archivos)**

- `src/components/newsletter-note/ai-creation/AINoteModal.tsx`
- `src/components/newsletter-note/ai-creation/AIGenerationProgress.tsx`
- `src/components/newsletter-note/ai-creation/AINewsletterModal.tsx`
- `src/components/newsletter-note/ai-creation/prompt-suggestions.ts`

### **Componentes UI - Edición de Texto (5+ archivos)**

- `src/components/newsletter-note/email-editor/ai-menu/AIAssistantModal.tsx`
- `src/components/newsletter-note/email-editor/ai-menu/AIOptionCard.tsx`
- `src/components/newsletter-note/email-editor/ai-menu/LanguageSelector.tsx`
- `src/components/newsletter-note/email-editor/ai-menu/TextComparisonView.tsx`
- `src/components/newsletter-note/simple-tiptap-editor.tsx` (integración)

### **Componentes UI - Generación de Imágenes (4 archivos)**

- `src/components/newsletter-note/email-editor/right-panel/ImageAiGenerator.tsx`
- `src/components/newsletter-note/email-editor/right-panel/ImageCropDialog.tsx`
- `src/components/newsletter-note/email-editor/right-panel/ImageOptions.tsx`
- `src/components/newsletter-note/email-editor/right-panel/GalleryOptions.tsx`

### **Configuración (2 archivos)**

- `src/utils/axiosInstance.ts`
- `src/global-config.ts`

### **Documentación (4 archivos)**

- `docs/AI_INTEGRATION_GUIDE.md`
- `docs/AI_DATA_STRUCTURE.md`
- `docs/IMPLEMENTATION_SUMMARY.md`
- `docs/AI_HEADER_BUTTON_FLOW.md`

---

## 🎯 PUNTOS DE INTEGRACIÓN CRÍTICOS

### 1. **Autenticación**

Todos los stores obtienen `userId` y `plan` de:

```typescript
const authState = useAuthStore.getState();
const userId = authState.user?.id;
const plan = authState.user?.plan?.name || null;
```

### 2. **Instancia Axios**

Todos los requests usan:

```typescript
const axiosInstance = createAxiosInstance({ isIA: true });
```

### 3. **Callbacks de Integración**

- **AINoteModal:** `onInjectAIData(data)` → Inyecta componentes en editor
- **AIAssistantModal:** `onApply(newText)` → Reemplaza texto en editor
- **ImageAiGenerator:** `onImageGenerated(imageUrl)` → Actualiza imagen

### 4. **Almacenamiento de URLs**

Las imágenes generadas:

- Backend devuelve `resultUrl` (S3 URL)
- Frontend usa directamente en componentes de imagen
- Se guarda en `objData` / `objDataWeb`

---

## ⚠️ CONSIDERACIONES IMPORTANTES

### **1. Cancelación de Generaciones**

- Solo notas soportan cancelación completa
- Imágenes: no se puede cancelar (backend ya procesando)
- Texto: se puede cerrar modal pero request ya enviado

### **2. Validaciones**

- Notas: prompt obligatorio, sin límite de longitud
- Texto: texto obligatorio (viene de selección)
- Imágenes: prompt obligatorio

### **3. Timeouts**

- Generación de notas: 5 minutos máximo
- Generación de imágenes: 30 intentos de polling
- Requests HTTP: 80 segundos

### **4. Errores 401**

El interceptor de axios:

- Limpia localStorage
- Redirige a `/auth/login`
- Importante para sesiones expiradas

### **5. Formato de Datos**

- `objData` y `objDataWeb` vienen como **STRING JSON** del backend
- Deben parsearse: `JSON.parse(data.objData)`
- Son arrays de `NewsletterComponent[]`

---

## 🚀 PRÓXIMAS FUNCIONALIDADES

### **En Desarrollo:**

1. `AINewsletterModal` - Generación de newsletters completos
2. Generación de videos/GIFs con IA
3. Regeneración parcial de secciones

### **Pendientes:**

1. Historial de generaciones de notas
2. Templates personalizados
3. Fine-tuning de modelos
4. A/B testing de prompts

---

## 📞 CONTACTO Y SOPORTE

Para dudas sobre el sistema de IA:

- Revisar documentación en `/docs`
- Logs del store: DevTools → Redux (Zustand)
- Logs de requests: Console → Network tab

---

**Fecha de actualización:** 2025-11-10
**Versión del documento:** 1.0
