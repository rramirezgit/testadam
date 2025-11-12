# ÍNDICE RÁPIDO DE ARCHIVOS DEL SISTEMA DE IA
## Referencia de Una Línea por Archivo

---

## 🎯 CÓMO USAR ESTE DOCUMENTO

Este es un índice de **todos los archivos** relacionados con IA en el proyecto. Cada archivo incluye:
- 📁 Ruta completa
- 📝 Descripción de una línea
- 🏷️ Tags para búsqueda rápida

**Uso:** Busca (Ctrl+F) por funcionalidad, nombre de archivo, o tag.

---

## 📦 SERVICIOS

### `src/services/ai-service.ts`
**Descripción:** Servicio principal para generación de notas con IA, maneja polling asíncrono  
**Tags:** #service #notas #polling #async #validation  
**Funciones clave:** `generateNoteComplete()`, `pollUntilComplete()`, `parseGeneratedContent()`

---

## 🗂️ STORES (ESTADO GLOBAL)

### `src/store/AiGenerationStore.ts`
**Descripción:** Store Zustand para estado de generación de notas con IA  
**Tags:** #store #zustand #notas #state #loading  
**Acción principal:** `generateNote()`

### `src/store/MagicWriteStore.ts`
**Descripción:** Store Zustand para edición de texto con IA (Magic Write)  
**Tags:** #store #zustand #texto #magicwrite #edit  
**Acción principal:** `processMagicWrite()`

### `src/store/MediaAiStore.ts`
**Descripción:** Store Zustand para generación de imágenes con IA  
**Tags:** #store #zustand #imagenes #media #polling  
**Acciones principales:** `generateImage()`, `pollStatus()`, `fetchHistory()`

---

## 📐 TIPOS TYPESCRIPT

### `src/types/ai-generation.ts`
**Descripción:** Tipos para generación de notas con IA (requests, responses, estados)  
**Tags:** #types #typescript #notas #polling #task-status  
**Tipos clave:** `GenerateNoteRequest`, `TaskStatusResponse`, `ParsedGeneratedContent`

### `src/types/magic-write.ts`
**Descripción:** Tipos para edición de texto con IA, incluye 19 acciones y categorías  
**Tags:** #types #typescript #texto #magicwrite #actions  
**Tipos clave:** `MagicWriteAction`, `AI_OPTIONS`, `SUPPORTED_LANGUAGES`

### `src/types/media-ai.ts`
**Descripción:** Tipos para generación de imágenes con IA, incluye resoluciones  
**Tags:** #types #typescript #imagenes #media #resolution  
**Tipos clave:** `GenerateImageRequest`, `MediaAiGeneration`, `MediaAiResolution`

---

## 🎨 COMPONENTES UI - GENERACIÓN DE NOTAS

### `src/components/newsletter-note/ai-creation/AINoteModal.tsx`
**Descripción:** Modal principal para crear notas completas con IA (formulario + validación)  
**Tags:** #ui #modal #notas #form #validation  
**Props principales:** `open`, `onClose`, `onInjectAIData`

### `src/components/newsletter-note/ai-creation/AIGenerationProgress.tsx`
**Descripción:** Barra de progreso animada para generación de notas con estados visuales  
**Tags:** #ui #progress #animation #loading #states  
**Props principales:** `status`, `progress`, `onCancel`

### `src/components/newsletter-note/ai-creation/AINewsletterModal.tsx`
**Descripción:** Modal para crear newsletters completos con IA (⚠️ EN DESARROLLO)  
**Tags:** #ui #modal #newsletter #wip #pending  
**Estado:** No funcional, lanza error

### `src/components/newsletter-note/ai-creation/prompt-suggestions.ts`
**Descripción:** Sugerencias de prompts predefinidas por categoría para notas  
**Tags:** #data #prompts #suggestions #categories  
**Funciones:** `getAllPromptSuggestions()`, `getPromptsByCategory()`

### `src/components/newsletter-note/ai-creation/types.ts`
**Descripción:** Tipos locales para componentes de creación con IA  
**Tags:** #types #local #form #state

---

## 🎨 COMPONENTES UI - EDICIÓN DE TEXTO

### `src/components/newsletter-note/email-editor/ai-menu/AIAssistantModal.tsx`
**Descripción:** Modal principal del asistente de IA para editar texto (vista dividida)  
**Tags:** #ui #modal #texto #magicwrite #assistant  
**Props principales:** `open`, `selectedText`, `onApply`

### `src/components/newsletter-note/email-editor/ai-menu/TextComparisonView.tsx`
**Descripción:** Vista de comparación lado a lado: texto original vs resultado  
**Tags:** #ui #comparison #diff #syntax-highlight  
**Props principales:** `originalText`, `resultText`, `loading`

### `src/components/newsletter-note/email-editor/ai-menu/AIOptionCard.tsx`
**Descripción:** Tarjeta individual de opción de IA (corrección, generación, etc.)  
**Tags:** #ui #card #option #clickable  
**Props principales:** `option`, `onClick`, `disabled`

### `src/components/newsletter-note/email-editor/ai-menu/LanguageSelector.tsx`
**Descripción:** Selector de idioma para traducción con IA (8 idiomas soportados)  
**Tags:** #ui #selector #language #translation  
**Props principales:** `open`, `onSelectLanguage`

---

## 🎨 COMPONENTES UI - GENERACIÓN DE IMÁGENES

### `src/components/newsletter-note/email-editor/right-panel/ImageAiGenerator.tsx`
**Descripción:** Generador principal de imágenes con IA (prompt + resolución + historial)  
**Tags:** #ui #generator #imagenes #prompt #history  
**Props principales:** `onImageGenerated`, `userId`

### `src/components/newsletter-note/email-editor/right-panel/ImageCropDialog.tsx`
**Descripción:** Dialog con 2 tabs: editor tradicional de imagen + generador IA  
**Tags:** #ui #dialog #tabs #image #crop  
**Props principales:** `open`, `onSave`, `initialTab`

### `src/components/newsletter-note/email-editor/right-panel/ImageOptions.tsx`
**Descripción:** Opciones de imagen con botón "Generar con IA" para imagen única  
**Tags:** #ui #options #image #single #integration  
**Props principales:** `selectedComponent`, `updateComponentProps`

### `src/components/newsletter-note/email-editor/right-panel/GalleryOptions.tsx`
**Descripción:** Opciones de galería con botón "Generar con IA" por imagen  
**Tags:** #ui #options #gallery #multiple #integration  
**Props principales:** `selectedComponent`, `updateComponentProps`

---

## 🎨 COMPONENTES UI - EDITORES

### `src/components/newsletter-note/simple-tiptap-editor.tsx`
**Descripción:** Editor TipTap con botón de IA en toolbar para texto seleccionado  
**Tags:** #editor #tiptap #integration #toolbar #selection  
**Props principales:** `content`, `onChange`, `showAIButton`

---

## ⚙️ CONFIGURACIÓN Y UTILIDADES

### `src/utils/axiosInstance.ts`
**Descripción:** Cliente HTTP con interceptores, definición de endpoints de IA  
**Tags:** #http #axios #endpoints #interceptor #auth  
**Funciones:** `createAxiosInstance()`, constante `endpoints`

### `src/global-config.ts`
**Descripción:** Configuración global incluyendo URLs de servidores (principal y IA)  
**Tags:** #config #urls #env #server  
**Variables:** `serverUrl`, `serverUrlIA`

---

## 📚 DOCUMENTACIÓN

### `docs/AI_INTEGRATION_GUIDE.md`
**Descripción:** Guía completa de integración del sistema de IA con ejemplos  
**Tags:** #docs #guide #integration #examples  
**Contenido:** Arquitectura, flujo, uso, troubleshooting

### `docs/AI_DATA_STRUCTURE.md`
**Descripción:** Estructura de datos de respuestas de IA (objData, objDataWeb)  
**Tags:** #docs #data #structure #format  
**Contenido:** Formato de componentes, ejemplos de respuestas

### `docs/IMPLEMENTATION_SUMMARY.md`
**Descripción:** Resumen ejecutivo de implementación del sistema de IA  
**Tags:** #docs #summary #overview  
**Contenido:** Resumen técnico, decisiones arquitectónicas

### `docs/AI_HEADER_BUTTON_FLOW.md`
**Descripción:** Flujo específico del botón de IA en header del editor  
**Tags:** #docs #flow #header #ui  
**Contenido:** Diagrama de flujo, interacciones

---

## 📖 DOCUMENTACIÓN DE REFERENCIA (ESTE REPO)

### `AI_SYSTEM_INVENTORY.md`
**Descripción:** Inventario exhaustivo del sistema de IA con todos los detalles  
**Tags:** #docs #inventory #complete #reference  
**Uso:** Referencia completa para entender todo el sistema

### `AI_SYSTEM_QUICK_REFERENCE.md`
**Descripción:** Referencia rápida visual del sistema de IA con diagramas  
**Tags:** #docs #reference #quick #visual  
**Uso:** Consulta rápida durante desarrollo

### `AI_ARCHITECTURE_MAP.md`
**Descripción:** Mapa de arquitectura con diagramas de capas y flujos  
**Tags:** #docs #architecture #diagrams #flows  
**Uso:** Entender arquitectura y dependencias

### `AI_MIGRATION_CHECKLIST.md`
**Descripción:** Checklists paso a paso para cambios masivos en sistema de IA  
**Tags:** #docs #checklist #migration #refactor  
**Uso:** Guía para refactorizaciones seguras

### `AI_FILES_INDEX.md`
**Descripción:** Este archivo, índice rápido de todos los archivos relacionados con IA  
**Tags:** #docs #index #files #quick  
**Uso:** Encontrar archivos rápidamente

---

## 🔍 BÚSQUEDA RÁPIDA POR FUNCIONALIDAD

### Quiero trabajar en: **Generación de Notas**
```
Componentes UI:
  - AINoteModal.tsx
  - AIGenerationProgress.tsx
  - prompt-suggestions.ts

Store:
  - AiGenerationStore.ts

Servicio:
  - ai-service.ts

Tipos:
  - ai-generation.ts

Endpoints:
  - axiosInstance.ts → endpoints.ai.*
```

### Quiero trabajar en: **Edición de Texto (Magic Write)**
```
Componentes UI:
  - AIAssistantModal.tsx
  - TextComparisonView.tsx
  - AIOptionCard.tsx
  - LanguageSelector.tsx
  - simple-tiptap-editor.tsx

Store:
  - MagicWriteStore.ts

Tipos:
  - magic-write.ts

Endpoints:
  - axiosInstance.ts → endpoints.magicWrite.*
```

### Quiero trabajar en: **Generación de Imágenes**
```
Componentes UI:
  - ImageAiGenerator.tsx
  - ImageCropDialog.tsx
  - ImageOptions.tsx
  - GalleryOptions.tsx

Store:
  - MediaAiStore.ts

Tipos:
  - media-ai.ts

Endpoints:
  - axiosInstance.ts → endpoints.mediaAi.*
```

### Quiero cambiar: **Autenticación**
```
Archivos a revisar:
  - axiosInstance.ts (interceptores)
  - AiGenerationStore.ts (obtención de userId/plan)
  - MagicWriteStore.ts (obtención de userId/plan)
  - MediaAiStore.ts (obtención de userId/plan)
```

### Quiero cambiar: **Endpoints o URLs**
```
Archivos a cambiar:
  - global-config.ts (URLs base)
  - axiosInstance.ts (definición de endpoints)
  
Archivos a verificar (deben usar constantes):
  - AiGenerationStore.ts
  - MagicWriteStore.ts
  - MediaAiStore.ts
  - ai-service.ts
```

### Quiero cambiar: **Formato de Datos**
```
1. Actualizar tipos:
   - ai-generation.ts
   - magic-write.ts
   - media-ai.ts

2. Actualizar parseo:
   - ai-service.ts (parseGeneratedContent)

3. Actualizar stores:
   - AiGenerationStore.ts
   - MagicWriteStore.ts
   - MediaAiStore.ts

4. Actualizar componentes UI que renderizan datos
```

---

## 📊 ESTADÍSTICAS DEL SISTEMA

### Archivos por Tipo:
- **Servicios:** 1
- **Stores:** 3
- **Tipos:** 3
- **Componentes UI:** 13
- **Config/Utils:** 2
- **Documentación:** 9
- **Total:** 31 archivos

### Líneas de Código Estimadas:
- **Servicios:** ~300 LOC
- **Stores:** ~500 LOC (~170 cada uno)
- **Tipos:** ~600 LOC (~200 cada uno)
- **Componentes UI:** ~3500 LOC (~270 promedio)
- **Config/Utils:** ~200 LOC
- **Total estimado:** ~5100 LOC

### Funcionalidades:
- ✅ Generación de Notas con IA
- ✅ Edición de Texto con IA (19 acciones)
- ✅ Generación de Imágenes con IA (3 resoluciones)
- ⚠️  Generación de Newsletters (en desarrollo)

---

## 🎯 ARCHIVOS MÁS IMPORTANTES (TOP 10)

| # | Archivo | Razón |
|---|---------|-------|
| 1 | `axiosInstance.ts` | Define todos los endpoints, usado por todos |
| 2 | `ai-service.ts` | Lógica core de polling para notas |
| 3 | `AiGenerationStore.ts` | Estado principal de notas |
| 4 | `MagicWriteStore.ts` | Estado principal de texto |
| 5 | `MediaAiStore.ts` | Estado principal de imágenes |
| 6 | `AINoteModal.tsx` | UI principal de generación |
| 7 | `AIAssistantModal.tsx` | UI principal de edición |
| 8 | `ImageAiGenerator.tsx` | UI principal de imágenes |
| 9 | `ai-generation.ts` | Tipos críticos de notas |
| 10 | `magic-write.ts` | Define 19 acciones de IA |

---

## 🚀 COMANDOS ÚTILES

### Buscar uso de un archivo:
```bash
# Buscar importaciones de un store
grep -r "useAiGenerationStore" src/

# Buscar uso de un tipo
grep -r "GenerateNoteRequest" src/

# Buscar uso de un endpoint
grep -r "endpoints.ai" src/
```

### Encontrar todos los archivos de IA:
```bash
# Por nombre
find src/ -name "*AI*.tsx" -o -name "*ai*.ts"

# Por contenido
grep -r "import.*AiGenerationStore" src/
```

### Contar líneas de código:
```bash
# Contar LOC en stores
wc -l src/store/*AiStore.ts src/store/*WriteStore.ts

# Contar LOC total de IA
find src/ -name "*ai*.ts*" -exec wc -l {} + | tail -1
```

---

## 📝 NOTAS FINALES

### Archivos NO modificables directamente:
- `node_modules/` (obviamente)
- `.next/` (build output)

### Archivos de solo lectura (ejemplos, no modificar):
- `docs/*.md` (excepto para actualizar documentación)

### Archivos críticos (modificar con precaución):
- `axiosInstance.ts` - Afecta TODAS las requests
- `global-config.ts` - Afecta URLs globales
- Stores - Afectan múltiples componentes

### Convenciones de nombres:
- **Stores:** `*Store.ts` (PascalCase)
- **Tipos:** `*.ts` sin `-` (kebab-case para archivos)
- **Componentes:** `*.tsx` (PascalCase)
- **Utilidades:** `*.ts` (kebab-case)

---

## 🔗 LINKS RÁPIDOS A DOCUMENTACIÓN

- [📦 Inventario Completo](./AI_SYSTEM_INVENTORY.md)
- [⚡ Referencia Rápida](./AI_SYSTEM_QUICK_REFERENCE.md)
- [🏗️ Arquitectura](./AI_ARCHITECTURE_MAP.md)
- [✅ Checklists de Migración](./AI_MIGRATION_CHECKLIST.md)
- [📚 Guía de Integración](./docs/AI_INTEGRATION_GUIDE.md)
- [📐 Estructura de Datos](./docs/AI_DATA_STRUCTURE.md)

---

**Uso sugerido:** Imprime esta página o ten abierta en una pestaña mientras trabajas en el sistema de IA.

**Última actualización:** 2025-11-10  
**Versión:** 1.0

