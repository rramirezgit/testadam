# SISTEMA DE INTELIGENCIA ARTIFICIAL
## Documentación Completa del Sistema de IA

---

<div align="center">

**🤖 Generación de Notas · ✍️ Edición de Texto · 🎨 Generación de Imágenes**

*Documentación creada el 2025-11-10*

</div>

---

## 📖 BIENVENIDA

Este sistema integra **3 funcionalidades principales de IA** en el editor de newsletters:

1. **Generación de Notas Completas** - Crear contenido desde cero con prompts
2. **Edición de Texto con IA (Magic Write)** - Mejorar, traducir y transformar texto
3. **Generación de Imágenes con IA** - Crear imágenes personalizadas por descripción

Este conjunto de documentos te proporciona **todo lo necesario** para entender, modificar y mantener el sistema.

---

## 🗂️ DOCUMENTACIÓN DISPONIBLE

### 📚 Para Entender el Sistema

#### 1. **AI_SYSTEM_INVENTORY.md** 
*Inventario Exhaustivo del Sistema*

- ✅ **Usa esto si:** Necesitas entender TODO el sistema en profundidad
- 📄 **Contenido:** Descripción detallada de cada componente, tipos, stores, servicios
- 🎯 **Ideal para:** Nuevos desarrolladores, onboarding, referencia completa
- 📏 **Extensión:** ~800 líneas, lectura completa

[👉 Abrir AI_SYSTEM_INVENTORY.md](./AI_SYSTEM_INVENTORY.md)

---

#### 2. **AI_SYSTEM_QUICK_REFERENCE.md**
*Referencia Rápida Visual*

- ✅ **Usa esto si:** Necesitas consultar algo rápidamente durante desarrollo
- 📄 **Contenido:** Diagramas visuales, tablas comparativas, comandos útiles
- 🎯 **Ideal para:** Desarrollo día a día, consultas rápidas
- 📏 **Extensión:** ~600 líneas, organizado por funcionalidad

[👉 Abrir AI_SYSTEM_QUICK_REFERENCE.md](./AI_SYSTEM_QUICK_REFERENCE.md)

---

#### 3. **AI_ARCHITECTURE_MAP.md**
*Mapa de Arquitectura*

- ✅ **Usa esto si:** Necesitas entender cómo se conectan las piezas
- 📄 **Contenido:** Diagramas de capas, flujos de datos, dependencias
- 🎯 **Ideal para:** Diseño de features, refactorización, debugging
- 📏 **Extensión:** ~500 líneas, altamente visual

[👉 Abrir AI_ARCHITECTURE_MAP.md](./AI_ARCHITECTURE_MAP.md)

---

### 🛠️ Para Hacer Cambios

#### 4. **AI_MIGRATION_CHECKLIST.md**
*Checklists para Cambios Masivos*

- ✅ **Usa esto si:** Vas a hacer cambios en múltiples archivos
- 📄 **Contenido:** 7 checklists detallados para diferentes escenarios
- 🎯 **Ideal para:** Migraciones, refactorizaciones, cambios en APIs
- 📏 **Extensión:** ~800 líneas, paso a paso

**Escenarios incluidos:**
1. Cambiar estructura de request/response
2. Cambiar endpoints o URLs
3. Cambiar autenticación/autorización
4. Añadir nueva funcionalidad de IA
5. Optimizar polling
6. Migrar a nuevo backend
7. Refactorizar componentes UI

[👉 Abrir AI_MIGRATION_CHECKLIST.md](./AI_MIGRATION_CHECKLIST.md)

---

#### 5. **AI_FILES_INDEX.md**
*Índice de Todos los Archivos*

- ✅ **Usa esto si:** Necesitas encontrar un archivo específico rápidamente
- 📄 **Contenido:** Lista de 31 archivos con descripción de una línea
- 🎯 **Ideal para:** Búsqueda rápida, navegación del codebase
- 📏 **Extensión:** ~600 líneas, organizado por tipo

[👉 Abrir AI_FILES_INDEX.md](./AI_FILES_INDEX.md)

---

### 📚 Documentación Existente (en `/docs`)

#### 6. **docs/AI_INTEGRATION_GUIDE.md**
*Guía de Integración Original*

- Arquitectura frontend/backend
- Flujo de trabajo paso a paso
- Ejemplos de uso
- Troubleshooting

[👉 Abrir docs/AI_INTEGRATION_GUIDE.md](./docs/AI_INTEGRATION_GUIDE.md)

---

#### 7. **docs/AI_DATA_STRUCTURE.md**
*Estructura de Datos de IA*

- Formato de `objData` y `objDataWeb`
- Estructura de componentes
- Ejemplos de respuestas del backend

[👉 Abrir docs/AI_DATA_STRUCTURE.md](./docs/AI_DATA_STRUCTURE.md)

---

#### 8. **docs/IMPLEMENTATION_SUMMARY.md**
*Resumen de Implementación*

- Resumen ejecutivo
- Decisiones arquitectónicas
- Estado de implementación

[👉 Abrir docs/IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)

---

#### 9. **docs/AI_HEADER_BUTTON_FLOW.md**
*Flujo del Botón de IA*

- Flujo específico del botón en header
- Diagrama de interacciones

[👉 Abrir docs/AI_HEADER_BUTTON_FLOW.md](./docs/AI_HEADER_BUTTON_FLOW.md)

---

## 🚀 INICIO RÁPIDO

### Si eres nuevo en el sistema:

**Paso 1:** Lee el resumen ejecutivo (5 min)
```
👉 Lee la sección "RESUMEN EJECUTIVO" más abajo en este documento
```

**Paso 2:** Explora el inventario completo (20-30 min)
```
👉 Abre AI_SYSTEM_INVENTORY.md
```

**Paso 3:** Revisa los flujos visuales (10-15 min)
```
👉 Abre AI_ARCHITECTURE_MAP.md
```

**Paso 4:** Ten a mano la referencia rápida
```
👉 Mantén abierto AI_SYSTEM_QUICK_REFERENCE.md mientras desarrollas
```

---

### Si vas a hacer cambios:

**Paso 1:** Identifica el tipo de cambio
```
- ¿Cambiar estructura de datos?
- ¿Cambiar endpoints?
- ¿Añadir nueva funcionalidad?
- ¿Refactorizar UI?
```

**Paso 2:** Abre el checklist correspondiente
```
👉 Abre AI_MIGRATION_CHECKLIST.md
👉 Busca el checklist para tu caso
```

**Paso 3:** Identifica archivos a modificar
```
👉 Usa AI_FILES_INDEX.md para encontrar archivos rápidamente
```

**Paso 4:** Sigue el checklist paso a paso
```
✅ Marca cada checkbox a medida que completas
```

---

## 📊 RESUMEN EJECUTIVO

### El Sistema en 3 Minutos

El sistema de IA consta de **3 capas principales**:

```
┌─────────────────────────────────────┐
│  CAPA UI (React Components)         │  13 componentes
├─────────────────────────────────────┤
│  CAPA ESTADO (Zustand Stores)       │   3 stores
├─────────────────────────────────────┤
│  CAPA SERVICIO (Logic + HTTP)       │   1 servicio + axios
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│  BACKEND APIs                        │   3 grupos de endpoints
└─────────────────────────────────────┘
```

### Las 3 Funcionalidades

#### 1️⃣ Generación de Notas
```
Usuario → AINoteModal → AiGenerationStore → ai-service 
→ POST /api/v1/ai/generate-note → Polling cada 2.5s 
→ COMPLETED → Inyectar en editor
```

**Archivos clave:**
- UI: `AINoteModal.tsx`, `AIGenerationProgress.tsx`
- Estado: `AiGenerationStore.ts`
- Servicio: `ai-service.ts`
- Tipos: `ai-generation.ts`

---

#### 2️⃣ Edición de Texto (Magic Write)
```
Usuario selecciona texto → AIAssistantModal → Elige acción 
→ MagicWriteStore → POST /api/v1/magic-write 
→ Response → Comparación → Aplicar cambios
```

**Archivos clave:**
- UI: `AIAssistantModal.tsx`, `TextComparisonView.tsx`
- Estado: `MagicWriteStore.ts`
- Tipos: `magic-write.ts` (19 acciones)

**Acciones disponibles:** Corrección, Generación, Organización, Transformación, Títulos, Traducción

---

#### 3️⃣ Generación de Imágenes
```
Usuario → ImageAiGenerator → Prompt + Resolución 
→ MediaAiStore → POST /api/v1/media-ai/generate 
→ Polling progresivo → COMPLETED + resultUrl → Preview
```

**Archivos clave:**
- UI: `ImageAiGenerator.tsx`, `ImageCropDialog.tsx`
- Estado: `MediaAiStore.ts`
- Tipos: `media-ai.ts`

**Resoluciones:** Cuadrado (1:1), Retrato (9:16), Paisaje (16:9)

---

### Archivos Críticos (Top 5)

1. **`axiosInstance.ts`** - Define TODOS los endpoints
2. **`ai-service.ts`** - Lógica de polling para notas
3. **`AiGenerationStore.ts`** - Estado de generación de notas
4. **`MagicWriteStore.ts`** - Estado de edición de texto
5. **`MediaAiStore.ts`** - Estado de generación de imágenes

---

### Estadísticas

- **Total de archivos:** 31
- **Líneas de código:** ~5,100
- **Componentes UI:** 13
- **Stores:** 3
- **Servicios:** 1
- **Endpoints:** 9
- **Tipos:** 3 archivos principales

---

## 🎯 CASOS DE USO COMUNES

### Caso 1: "Quiero entender cómo funciona la generación de notas"

1. Lee: `AI_SYSTEM_INVENTORY.md` → Sección "GENERACIÓN DE NOTAS COMPLETAS CON IA"
2. Revisa: `AI_ARCHITECTURE_MAP.md` → "FLUJO 1: GENERACIÓN DE NOTA CON IA"
3. Archivos a explorar:
   - `src/components/newsletter-note/ai-creation/AINoteModal.tsx`
   - `src/store/AiGenerationStore.ts`
   - `src/services/ai-service.ts`

---

### Caso 2: "Quiero cambiar los endpoints de IA"

1. Abre: `AI_MIGRATION_CHECKLIST.md` → "CHECKLIST 2: CAMBIAR ENDPOINTS O URLS"
2. Sigue paso a paso
3. Archivos principales a modificar:
   - `src/global-config.ts` (URLs base)
   - `src/utils/axiosInstance.ts` (definición de endpoints)

---

### Caso 3: "Quiero añadir una nueva acción de Magic Write"

1. Lee: `AI_SYSTEM_QUICK_REFERENCE.md` → "2️⃣ EDICIÓN DE TEXTO CON IA"
2. Archivos a modificar:
   - `src/types/magic-write.ts` → Añadir a `MagicWriteAction` y `AI_OPTIONS`
   - Backend → Implementar nueva acción
3. Componente UI ya está preparado (automáticamente renderiza nuevas opciones)

---

### Caso 4: "Quiero debuggear un error en generación de imágenes"

1. Consulta: `AI_ARCHITECTURE_MAP.md` → "FLUJO 3: GENERACIÓN DE IMAGEN CON IA"
2. Verifica:
   - Estado en DevTools → Zustand store `media-ai-store`
   - Network tab → Requests a `/api/v1/media-ai/*`
3. Logs clave:
   - `MediaAiStore.ts` → Logs con emoji 🎨
   - `ImageAiGenerator.tsx` → Logs de polling

---

### Caso 5: "Quiero optimizar el tiempo de polling"

1. Abre: `AI_MIGRATION_CHECKLIST.md` → "CHECKLIST 5: OPTIMIZAR POLLING"
2. Archivos a ajustar:
   - `src/services/ai-service.ts` → `POLLING_CONFIG`
   - `src/components/.../ImageAiGenerator.tsx` → `startPolling()` delays

---

## 🔧 HERRAMIENTAS Y SCRIPTS

### Comandos útiles

```bash
# Buscar todos los componentes de IA
find src/components -name "*AI*.tsx" -o -name "*ai*.tsx"

# Buscar uso de un store
grep -r "useAiGenerationStore" src/

# Buscar todos los endpoints
grep -r "endpoints\." src/utils/axiosInstance.ts

# Contar LOC de stores
wc -l src/store/*AiStore.ts src/store/*WriteStore.ts
```

---

## 📋 GLOSARIO RÁPIDO

| Término | Significado |
|---------|-------------|
| **objData** | Array de componentes para versión newsletter (resumida) |
| **objDataWeb** | Array de componentes para versión web (extendida) |
| **Polling** | Consulta periódica del estado de una tarea asíncrona |
| **Magic Write** | Sistema de edición de texto con IA (19 acciones) |
| **TaskStatus** | Estado de generación: PENDING → GENERATING_X → COMPLETED |
| **MediaAi** | Sistema de generación de medios (imágenes, videos, etc.) |
| **Resolution** | Tamaño de imagen: cuadrado, retrato, paisaje |

---

## 🚨 ADVERTENCIAS Y PRECAUCIONES

### ⚠️ NO modificar sin checklist:
- `axiosInstance.ts` - Afecta TODAS las requests
- `global-config.ts` - Afecta URLs globales
- Stores - Afectan múltiples componentes

### ⚠️ Funcionalidades en desarrollo:
- `AINewsletterModal.tsx` - Generación de newsletters completos (NO funcional)

### ⚠️ Formato de datos:
- `objData` y `objDataWeb` vienen como **STRING JSON** del backend
- Deben parsearse con `JSON.parse()`
- Ver `ai-service.ts` → `parseGeneratedContent()`

### ⚠️ Autenticación:
- Todos los stores obtienen `userId` y `plan` de `AuthStore`
- Error 401 → logout automático y redirección
- Timeout de requests: 80 segundos

---

## 📞 SOPORTE Y AYUDA

### Tengo una pregunta sobre...

**...cómo funciona algo:**
→ `AI_SYSTEM_INVENTORY.md` (búsqueda Ctrl+F)

**...qué archivo modificar:**
→ `AI_FILES_INDEX.md` (búsqueda por funcionalidad)

**...cómo hacer un cambio:**
→ `AI_MIGRATION_CHECKLIST.md` (busca el checklist apropiado)

**...cómo se conectan las piezas:**
→ `AI_ARCHITECTURE_MAP.md` (diagramas visuales)

**...consulta rápida durante desarrollo:**
→ `AI_SYSTEM_QUICK_REFERENCE.md` (siempre abierto)

---

### Debugging

1. **Problema:** "No funciona la generación"
   - Verifica Network tab → ¿Llega el request?
   - Verifica DevTools → Zustand store → ¿Qué estado tiene?
   - Revisa console.log → ¿Hay errores?

2. **Problema:** "Polling no termina"
   - Verifica: ¿Backend responde COMPLETED?
   - Verifica: ¿maxAttempts alcanzado?
   - Revisa logs de polling en console

3. **Problema:** "Error 401"
   - Token expirado → Relogin
   - Verifica: localStorage tiene 'AUTH_TOKEN'
   - Interceptor debería redirigir automáticamente

---

## 🗺️ ROADMAP FUTURO

### En Desarrollo
- [ ] Generación de newsletters completos
- [ ] Generación de videos con IA
- [ ] Generación de GIFs animados

### Pendientes
- [ ] Historial de generaciones de notas
- [ ] Templates personalizados de prompts
- [ ] Fine-tuning de modelos
- [ ] A/B testing de prompts
- [ ] Regeneración parcial de secciones
- [ ] Sugerencias de mejora automáticas

---

## 📈 MÉTRICAS Y KPIs

### Performance
- **Tiempo promedio generación nota:** 2-3 minutos
- **Tiempo promedio generación imagen:** 10-30 segundos
- **Tiempo promedio Magic Write:** 5-15 segundos
- **Tasa de éxito:** Monitorear en producción

### Uso
- **Generaciones por día:** TBD
- **Acción más usada (Magic Write):** TBD
- **Resolución más usada (Imágenes):** TBD

---

## 🎓 RECURSOS ADICIONALES

### Enlaces Útiles
- [OpenAI API Docs](https://platform.openai.com/docs)
- [DALL-E API](https://platform.openai.com/docs/guides/images)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [Axios Docs](https://axios-http.com/docs/intro)

### Convenciones del Código
- **Stores:** PascalCase, sufijo `Store.ts`
- **Componentes:** PascalCase, `.tsx`
- **Tipos:** kebab-case, `.ts`
- **Logs:** Usar emoji para fácil identificación (🚀, ✅, ❌, 📊, etc.)

---

## ✅ CHECKLIST DE ONBOARDING

Para nuevos desarrolladores:

- [ ] Leer este README completo
- [ ] Leer `AI_SYSTEM_INVENTORY.md` (secciones relevantes)
- [ ] Explorar `AI_ARCHITECTURE_MAP.md` (entender flujos)
- [ ] Revisar código de un store (ej: `AiGenerationStore.ts`)
- [ ] Revisar código de un componente (ej: `AINoteModal.tsx`)
- [ ] Probar generar nota en local
- [ ] Probar editar texto con Magic Write
- [ ] Probar generar imagen
- [ ] Revisar Network tab durante uso
- [ ] Explorar Zustand DevTools durante uso
- [ ] Leer al menos 1 checklist de `AI_MIGRATION_CHECKLIST.md`

**Tiempo estimado:** 2-3 horas

---

## 📅 HISTORIAL DE CAMBIOS

### 2025-11-10 - Creación de Documentación Completa
- ✅ Creado sistema completo de documentación
- ✅ 5 documentos nuevos de referencia
- ✅ 4 documentos existentes organizados
- ✅ Checklists para 7 escenarios de cambios
- ✅ Índice completo de 31 archivos
- ✅ Diagramas de arquitectura y flujos

---

## 📜 LICENCIA Y CONTACTO

**Proyecto:** Adam Pro - Newsletter Editor con IA  
**Organización:** Neodaten  
**Fecha de documentación:** 2025-11-10  
**Versión:** 1.0

---

<div align="center">

**¿Preguntas? ¿Sugerencias?**

Actualiza la documentación si encuentras algo desactualizado o faltante.

---

*"Un sistema bien documentado es un sistema mantenible"*

</div>

