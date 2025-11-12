# REFERENCIA RÁPIDA - SISTEMA DE IA
## Mapa Visual para Cambios Masivos

---

## 🗂️ ORGANIZACIÓN POR FUNCIONALIDAD

### 1️⃣ GENERACIÓN DE NOTAS COMPLETAS CON IA

```
📦 BACKEND ENDPOINTS
├─ POST /api/v1/ai/generate-note      → Inicia generación
└─ GET  /api/v1/ai/status/:taskId     → Consulta estado

📦 SERVICIOS
└─ src/services/ai-service.ts
   ├─ initiateNoteGeneration()
   ├─ checkTaskStatus()
   ├─ pollUntilComplete()
   ├─ generateNoteComplete()          ⭐ Función principal
   ├─ parseGeneratedContent()
   └─ validateNoteRequest()

📦 ESTADO (ZUSTAND)
└─ src/store/AiGenerationStore.ts
   ├─ generateNote()                  ⭐ Acción principal
   ├─ cancelGeneration()
   ├─ clearCurrentGeneration()
   └─ Estado: loading, status, progress, currentGeneration

📦 TIPOS
└─ src/types/ai-generation.ts
   ├─ GenerateNoteRequest
   ├─ TaskStatusResponse
   ├─ ParsedGeneratedContent
   └─ TaskStatus (PENDING → COMPLETED)

📦 COMPONENTES UI
├─ src/components/newsletter-note/ai-creation/
│  ├─ AINoteModal.tsx                 ⭐ Modal principal
│  ├─ AIGenerationProgress.tsx        ⭐ Barra de progreso
│  ├─ AINewsletterModal.tsx           ⚠️  EN DESARROLLO
│  └─ prompt-suggestions.ts           📝 Prompts predefinidos
```

**CARACTERÍSTICAS CLAVE:**
- ✅ Sistema asíncrono con polling cada 2.5s
- ✅ Progreso visual: 0% → 25% → 50% → 75% → 100%
- ✅ Soporte para cancelación
- ✅ Validación de prompts
- ✅ Auto-cierre al completar
- ✅ Inyección en editor

**FLUJO:**
```
Usuario → AINoteModal → generateNote() → initiateNoteGeneration() 
→ polling → COMPLETED → parseGeneratedContent() → onInjectAIData()
```

---

### 2️⃣ EDICIÓN DE TEXTO CON IA (MAGIC WRITE)

```
📦 BACKEND ENDPOINTS
└─ POST /api/v1/magic-write            → Procesa texto

📦 ESTADO (ZUSTAND)
└─ src/store/MagicWriteStore.ts
   ├─ processMagicWrite()              ⭐ Acción principal
   ├─ clearLastResult()
   └─ Estado: loading, error, lastResult

📦 TIPOS
└─ src/types/magic-write.ts
   ├─ MagicWriteAction (19 acciones)
   ├─ MagicWriteRequest
   ├─ MagicWriteResponse
   ├─ AI_OPTIONS                       📝 Config de categorías
   └─ SUPPORTED_LANGUAGES              🌐 8 idiomas

📦 COMPONENTES UI
├─ src/components/newsletter-note/email-editor/ai-menu/
│  ├─ AIAssistantModal.tsx            ⭐ Modal principal
│  ├─ TextComparisonView.tsx          👁️  Vista comparación
│  ├─ AIOptionCard.tsx                🎴 Tarjeta de opción
│  └─ LanguageSelector.tsx            🌍 Selector de idioma
│
└─ src/components/newsletter-note/
   └─ simple-tiptap-editor.tsx        ⭐ Editor con botón IA
```

**ACCIONES DISPONIBLES:**
```
✅ Corrección
   ├─ corregir_errores
   └─ mejorar_texto

✅ Generación
   ├─ generador (ampliar ideas)
   ├─ generador_parrafos
   ├─ generador_descripcion
   ├─ generador_ensayos
   └─ continuar_texto

✅ Organización
   ├─ brain_storming
   ├─ listas
   └─ cuestionario

✅ Transformación
   ├─ reescribir
   ├─ parafrasear
   └─ resumir

✅ Títulos
   └─ generador_titulos

✅ Traducción
   └─ traducir (+ selector idioma)
```

**FLUJO:**
```
Usuario selecciona texto → Click botón IA → AIAssistantModal 
→ Selecciona acción → processMagicWrite() → Vista comparación 
→ Aplicar cambios → Reemplaza en editor
```

---

### 3️⃣ GENERACIÓN DE IMÁGENES CON IA

```
📦 BACKEND ENDPOINTS
├─ POST   /api/v1/media-ai/generate       → Inicia generación
├─ GET    /api/v1/media-ai/status/:id     → Consulta estado
├─ GET    /api/v1/media-ai/history        → Historial
└─ DELETE /api/v1/media-ai/:id            → Elimina generación

📦 ESTADO (ZUSTAND)
└─ src/store/MediaAiStore.ts
   ├─ generateImage()                  ⭐ Acción principal
   ├─ pollStatus()
   ├─ fetchHistory()
   ├─ deleteGeneration()
   ├─ clearCurrentGeneration()
   └─ Estado: loading, currentGeneration, history

📦 TIPOS
└─ src/types/media-ai.ts
   ├─ GenerateImageRequest
   ├─ MediaAiGeneration
   ├─ MediaAiStatus (PENDING → COMPLETED)
   └─ MediaAiResolution (cuadrado, retrato, paisaje)

📦 COMPONENTES UI
├─ src/components/newsletter-note/email-editor/right-panel/
│  ├─ ImageAiGenerator.tsx            ⭐ Generador principal
│  ├─ ImageCropDialog.tsx             🔲 Dialog con tabs
│  ├─ ImageOptions.tsx                ⚙️  Integrador (imagen única)
│  └─ GalleryOptions.tsx              ⚙️  Integrador (galería)
```

**RESOLUCIONES:**
```
📐 cuadrado  → 1024x1024  (1:1)   → Posts, thumbnails
📐 retrato   → 1024x1792  (9:16)  → Stories, móvil vertical
📐 paisaje   → 1792x1024  (16:9)  → Banners, desktop
```

**CARACTERÍSTICAS:**
- ✅ Polling progresivo (2s → 10s)
- ✅ Preview de imagen generada
- ✅ Historial con grid visual
- ✅ Eliminar del historial
- ✅ Metadata (size, model, quality)
- ✅ Opción "Generar Otra"

**FLUJO:**
```
Usuario → ImageAiGenerator → generateImage() → Polling 
→ COMPLETED + resultUrl → Preview → onImageGenerated() 
→ Actualiza componente
```

---

## 🔌 CONFIGURACIÓN Y UTILIDADES

### 📄 `src/utils/axiosInstance.ts`
```typescript
// Crear instancia
createAxiosInstance({ isIA: true })  // Servidor de IA
createAxiosInstance({ isIA: false }) // Backend principal

// Endpoints
endpoints.ai.generateNote              // Notas
endpoints.magicWrite.process           // Texto
endpoints.mediaAi.generate             // Imágenes
endpoints.mediaAi.status(id)
endpoints.mediaAi.history
endpoints.mediaAi.delete(id)
endpoints.ai.checkStatus(taskId)
```

### 📄 `src/global-config.ts`
```typescript
CONFIG.serverUrl      // Backend principal
CONFIG.serverUrlIA    // Servidor de IA
```

### 🔐 Autenticación
Todos los stores obtienen:
```typescript
const authState = useAuthStore.getState();
const userId = authState.user?.id;
const plan = authState.user?.plan?.name || null;
```

---

## 📊 TABLA COMPARATIVA

| Funcionalidad | Store | Servicio | Endpoint Principal | Polling | Cancelable |
|--------------|-------|----------|-------------------|---------|-----------|
| **Notas IA** | AiGenerationStore | ai-service.ts | `/api/v1/ai/generate-note` | ✅ Cada 2.5s | ✅ Sí |
| **Texto IA** | MagicWriteStore | - | `/api/v1/magic-write` | ❌ Directo | ❌ No |
| **Imágenes IA** | MediaAiStore | - | `/api/v1/media-ai/generate` | ✅ Progresivo | ❌ No |

---

## 🎯 PUNTOS DE ENTRADA PARA USUARIOS

### 1. **Crear Nota con IA**
```
Ubicación: Header del editor
Componente: AINoteModal
Trigger: Botón "Crear con IA"
```

### 2. **Editar Texto con IA**
```
Ubicación: Toolbar del editor (SimpleTipTapEditor)
Componente: AIAssistantModal
Trigger: Seleccionar texto + Click botón IA
```

### 3. **Generar Imagen con IA**
```
Ubicación A: Modal de selección de imagen
Ubicación B: Tab "IA" en ImageCropDialog
Componente: ImageAiGenerator
Trigger: Click "Generar con IA"
```

---

## 🔄 DEPENDENCIAS ENTRE MÓDULOS

```
SimpleTipTapEditor
    ↓ usa
AIAssistantModal
    ↓ usa
MagicWriteStore
    ↓ llama
POST /api/v1/magic-write


AINoteModal
    ↓ usa
AIGenerationProgress
    ↓ usa
AiGenerationStore
    ↓ usa
ai-service.ts
    ↓ llama
POST /api/v1/ai/generate-note
GET  /api/v1/ai/status/:taskId


ImageOptions / GalleryOptions
    ↓ abre
ImageCropDialog (tab IA)
    ↓ embebe
ImageAiGenerator
    ↓ usa
MediaAiStore
    ↓ llama
POST /api/v1/media-ai/generate
GET  /api/v1/media-ai/status/:id
```

---

## 🚨 ÁREAS CRÍTICAS PARA CAMBIOS MASIVOS

### 🔴 ALTA PRIORIDAD (Afectan funcionalidad core)

1. **Cambios en Autenticación**
   - Impacta: TODOS los stores
   - Archivos: `AiGenerationStore.ts`, `MagicWriteStore.ts`, `MediaAiStore.ts`
   - Líneas: Donde se obtiene `authState.user?.id` y `plan`

2. **Cambios en Formato de Respuesta**
   - Impacta: Parseo de datos
   - Archivos: `ai-service.ts` (`parseGeneratedContent`)
   - Tipos: `ai-generation.ts`, `magic-write.ts`, `media-ai.ts`

3. **Cambios en Endpoints**
   - Impacta: TODAS las llamadas HTTP
   - Archivo: `axiosInstance.ts`
   - Constante: `endpoints`

4. **Cambios en URLs de Servidor**
   - Impacta: Enrutamiento de requests
   - Archivo: `global-config.ts`
   - Variables: `serverUrl`, `serverUrlIA`

### 🟡 MEDIA PRIORIDAD (Afectan experiencia de usuario)

5. **Cambios en Estados de Polling**
   - Impacta: UI de progreso
   - Archivos: `ai-generation.ts` (`TaskStatus`), `AIGenerationProgress.tsx`

6. **Cambios en Acciones de Magic Write**
   - Impacta: Opciones disponibles
   - Archivo: `magic-write.ts` (`MagicWriteAction`, `AI_OPTIONS`)

7. **Cambios en Resoluciones de Imágenes**
   - Impacta: Selector de tamaño
   - Archivos: `media-ai.ts`, `ImageAiGenerator.tsx` (`RESOLUTIONS`)

### 🟢 BAJA PRIORIDAD (Afectan presentación)

8. **Cambios en Mensajes/Labels**
   - Impacta: Textos visibles
   - Archivos: Múltiples componentes `.tsx`

9. **Cambios en Estilos/Colores**
   - Impacta: Apariencia visual
   - Archivos: Componentes con `sx` props

---

## 📝 CHECKLIST PARA CAMBIOS MASIVOS

### Si cambias **estructura de datos de IA**:
- [ ] `src/types/ai-generation.ts` - Tipos
- [ ] `src/types/magic-write.ts` - Tipos
- [ ] `src/types/media-ai.ts` - Tipos
- [ ] `src/services/ai-service.ts` - Parseo
- [ ] Stores correspondientes - Manejo de respuestas
- [ ] Componentes UI - Render de datos

### Si cambias **endpoints o autenticación**:
- [ ] `src/utils/axiosInstance.ts` - URLs y headers
- [ ] `src/global-config.ts` - Config de servidores
- [ ] Todos los stores - Requests
- [ ] Interceptores - Manejo de errores

### Si cambias **flujo de usuario**:
- [ ] Componentes UI principales (Modals)
- [ ] Callbacks de integración
- [ ] Estados de loading/error
- [ ] Validaciones

### Si añades **nueva funcionalidad de IA**:
- [ ] Nuevo endpoint en `axiosInstance.ts`
- [ ] Nuevo tipo en `src/types/`
- [ ] Nuevo store o extender existente
- [ ] Nuevo componente UI
- [ ] Integración en editor
- [ ] Documentación

---

## 🛠️ COMANDOS ÚTILES PARA BÚSQUEDA

```bash
# Buscar todos los usos de un store
grep -r "useAiGenerationStore" src/
grep -r "useMagicWriteStore" src/
grep -r "useMediaAiStore" src/

# Buscar todos los componentes que usan IA
find src/components -name "*AI*.tsx"
find src/components -name "*ai*.tsx"

# Buscar todos los endpoints de IA
grep -r "endpoints.ai" src/
grep -r "endpoints.magicWrite" src/
grep -r "endpoints.mediaAi" src/

# Buscar todos los tipos de IA
grep -r "GenerateNoteRequest" src/
grep -r "MagicWriteAction" src/
grep -r "MediaAiGeneration" src/
```

---

## 📚 DOCUMENTACIÓN RELACIONADA

- `AI_SYSTEM_INVENTORY.md` - Inventario completo detallado
- `docs/AI_INTEGRATION_GUIDE.md` - Guía de integración
- `docs/AI_DATA_STRUCTURE.md` - Estructura de datos
- `docs/IMPLEMENTATION_SUMMARY.md` - Resumen de implementación
- `docs/AI_HEADER_BUTTON_FLOW.md` - Flujo del botón header

---

**Uso sugerido:** Imprime este documento y usa como referencia durante refactorizaciones masivas.

**Última actualización:** 2025-11-10

