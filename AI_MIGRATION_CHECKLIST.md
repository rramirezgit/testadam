# CHECKLIST PARA CAMBIOS MASIVOS EN SISTEMA DE IA
## Guía Paso a Paso para Refactorización Segura

---

## 🎯 PROPÓSITO

Este documento proporciona checklists específicos para diferentes tipos de cambios masivos en el sistema de IA, asegurando que no se olvide ningún componente crítico.

---

## 📋 CHECKLIST 1: CAMBIAR ESTRUCTURA DE REQUEST/RESPONSE

### Escenario: Backend cambia formato de datos

#### Fase 1: Actualizar Tipos (TypeScript)

- [ ] **1.1 Tipos de Generación de Notas**
  - [ ] Abrir `src/types/ai-generation.ts`
  - [ ] Actualizar `GenerateNoteRequest`
  - [ ] Actualizar `TaskStatusResponse`
  - [ ] Actualizar `GeneratedContentData`
  - [ ] Actualizar `ParsedGeneratedContent`
  - [ ] Actualizar constantes (`TASK_PROGRESS_MAP`, `TASK_STATUS_MESSAGES`)

- [ ] **1.2 Tipos de Magic Write**
  - [ ] Abrir `src/types/magic-write.ts`
  - [ ] Actualizar `MagicWriteRequest`
  - [ ] Actualizar `MagicWriteResponse`
  - [ ] Si cambian acciones: actualizar `MagicWriteAction`
  - [ ] Si cambian categorías: actualizar `AI_OPTIONS`

- [ ] **1.3 Tipos de Generación de Imágenes**
  - [ ] Abrir `src/types/media-ai.ts`
  - [ ] Actualizar `GenerateImageRequest`
  - [ ] Actualizar `GenerateImageResponse`
  - [ ] Actualizar `MediaAiGeneration`
  - [ ] Actualizar `MediaAiMetadata`

#### Fase 2: Actualizar Servicios

- [ ] **2.1 Servicio de Generación de Notas**
  - [ ] Abrir `src/services/ai-service.ts`
  - [ ] Actualizar función `parseGeneratedContent()`
    - [ ] Verificar parseo de `objData`
    - [ ] Verificar parseo de `objDataWeb`
    - [ ] Añadir/remover campos según nuevo formato
  - [ ] Actualizar función `validateNoteRequest()`
    - [ ] Añadir/remover validaciones
  - [ ] Actualizar manejo de errores en `pollUntilComplete()`

#### Fase 3: Actualizar Stores

- [ ] **3.1 AiGenerationStore**
  - [ ] Abrir `src/store/AiGenerationStore.ts`
  - [ ] Actualizar construcción de `request` en `generateNote()`
  - [ ] Verificar manejo de respuesta
  - [ ] Actualizar estado si hay nuevos campos

- [ ] **3.2 MagicWriteStore**
  - [ ] Abrir `src/store/MagicWriteStore.ts`
  - [ ] Actualizar construcción de `requestData` en `processMagicWrite()`
  - [ ] Actualizar procesamiento de `response.data`

- [ ] **3.3 MediaAiStore**
  - [ ] Abrir `src/store/MediaAiStore.ts`
  - [ ] Actualizar construcción de `requestBody` en `generateImage()`
  - [ ] Actualizar procesamiento en `pollStatus()`

#### Fase 4: Actualizar Componentes UI

- [ ] **4.1 AINoteModal**
  - [ ] Abrir `src/components/newsletter-note/ai-creation/AINoteModal.tsx`
  - [ ] Verificar uso de nuevos campos en formulario
  - [ ] Actualizar callback `onInjectAIData()` si cambia estructura

- [ ] **4.2 AIGenerationProgress**
  - [ ] Abrir `src/components/newsletter-note/ai-creation/AIGenerationProgress.tsx`
  - [ ] Actualizar `STATUS_CONFIG` si cambian estados
  - [ ] Actualizar mensajes si cambian

- [ ] **4.3 ImageAiGenerator**
  - [ ] Abrir `src/components/newsletter-note/email-editor/right-panel/ImageAiGenerator.tsx`
  - [ ] Verificar render de metadata
  - [ ] Verificar construcción de request

#### Fase 5: Testing

- [ ] **5.1 Pruebas de Integración**
  - [ ] Crear nota con IA desde cero
  - [ ] Editar texto con IA (todas las acciones)
  - [ ] Generar imagen con IA (todas las resoluciones)
  - [ ] Verificar polling funciona correctamente
  - [ ] Verificar cancelación (notas)
  - [ ] Verificar historial (imágenes)

- [ ] **5.2 Pruebas de Errores**
  - [ ] Simular error 401 (sesión expirada)
  - [ ] Simular error 500 del backend
  - [ ] Simular timeout
  - [ ] Verificar mensajes de error claros

#### Fase 6: Documentación

- [ ] Actualizar `docs/AI_DATA_STRUCTURE.md`
- [ ] Actualizar `AI_SYSTEM_INVENTORY.md`
- [ ] Añadir ejemplos de nuevo formato
- [ ] Actualizar diagramas si aplica

---

## 📋 CHECKLIST 2: CAMBIAR ENDPOINTS O URLS

### Escenario: Backend cambia rutas de API

#### Fase 1: Actualizar Configuración Base

- [ ] **1.1 URLs de Servidor**
  - [ ] Abrir `src/global-config.ts`
  - [ ] Actualizar `serverUrl` si cambió
  - [ ] Actualizar `serverUrlIA` si cambió
  - [ ] Verificar variables de entorno si se usan

#### Fase 2: Actualizar Definición de Endpoints

- [ ] **2.1 Endpoints de IA**
  - [ ] Abrir `src/utils/axiosInstance.ts`
  - [ ] Actualizar `endpoints.ai.generateNote`
  - [ ] Actualizar `endpoints.ai.generateNewsletter`
  - [ ] Actualizar `endpoints.ai.checkStatus`

- [ ] **2.2 Endpoints de Magic Write**
  - [ ] Actualizar `endpoints.magicWrite.process`

- [ ] **2.3 Endpoints de Media AI**
  - [ ] Actualizar `endpoints.mediaAi.generate`
  - [ ] Actualizar `endpoints.mediaAi.status`
  - [ ] Actualizar `endpoints.mediaAi.history`
  - [ ] Actualizar `endpoints.mediaAi.delete`

#### Fase 3: Verificar Uso en Stores

- [ ] **3.1 AiGenerationStore**
  - [ ] Verificar que usa `endpoints.ai.generateNote`
  - [ ] Verificar que usa `endpoints.ai.checkStatus`

- [ ] **3.2 MagicWriteStore**
  - [ ] Verificar que usa `endpoints.magicWrite.process`
  - [ ] Si usa URL hardcodeada, cambiar a usar constante

- [ ] **3.3 MediaAiStore**
  - [ ] Verificar que usa `endpoints.mediaAi.*`
  - [ ] Si usa URLs hardcodeadas, cambiar a constantes

#### Fase 4: Verificar Servicios

- [ ] **4.1 ai-service.ts**
  - [ ] Verificar que usa `endpoints.ai.generateNote`
  - [ ] Verificar que usa `endpoints.ai.checkStatus`
  - [ ] No debe haber URLs hardcodeadas

#### Fase 5: Testing

- [ ] **5.1 Pruebas de Conectividad**
  - [ ] Verificar que todas las requests llegan al servidor correcto
  - [ ] Usar DevTools Network tab para verificar URLs
  - [ ] Probar en desarrollo y producción si aplica

- [ ] **5.2 Pruebas Funcionales**
  - [ ] Generar nota con IA
  - [ ] Editar texto con IA
  - [ ] Generar imagen con IA
  - [ ] Verificar historial de imágenes

---

## 📋 CHECKLIST 3: CAMBIAR AUTENTICACIÓN O AUTORIZACIÓN

### Escenario: Cambios en cómo se envía userId, plan o tokens

#### Fase 1: Actualizar Interceptores

- [ ] **1.1 Axios Interceptors**
  - [ ] Abrir `src/utils/axiosInstance.ts`
  - [ ] Actualizar interceptor de request
    - [ ] Cambiar cómo se obtiene token
    - [ ] Cambiar header `Authorization` si es necesario
    - [ ] Añadir headers adicionales si se requieren
  - [ ] Actualizar interceptor de response
    - [ ] Cambiar manejo de error 401
    - [ ] Actualizar lógica de logout

#### Fase 2: Actualizar Stores

- [ ] **2.1 AiGenerationStore**
  - [ ] Abrir `src/store/AiGenerationStore.ts`
  - [ ] Actualizar cómo se obtiene `authState`
  - [ ] Actualizar construcción de `userId` y `plan`
  - [ ] Verificar manejo si `userId` es null

- [ ] **2.2 MagicWriteStore**
  - [ ] Abrir `src/store/MagicWriteStore.ts`
  - [ ] Actualizar obtención de `authState`
  - [ ] Actualizar añadido de `userId` y `plan` al request

- [ ] **2.3 MediaAiStore**
  - [ ] Abrir `src/store/MediaAiStore.ts`
  - [ ] Actualizar obtención de `authState`
  - [ ] Actualizar añadido de `userId` y `plan` al request

#### Fase 3: Actualizar Tipos si Aplica

- [ ] **3.1 Tipos de Requests**
  - [ ] Actualizar `GenerateNoteRequest` si cambia `userId` o `plan`
  - [ ] Actualizar `MagicWriteRequest` si cambia
  - [ ] Actualizar `GenerateImageRequest` si cambia

#### Fase 4: Testing de Seguridad

- [ ] **4.1 Pruebas con Usuario Autenticado**
  - [ ] Login y generar nota
  - [ ] Login y editar texto
  - [ ] Login y generar imagen
  - [ ] Verificar que token se envía correctamente

- [ ] **4.2 Pruebas sin Autenticación**
  - [ ] Intentar generar sin login
  - [ ] Verificar redirección a login
  - [ ] Verificar mensaje de error apropiado

- [ ] **4.3 Pruebas de Expiración**
  - [ ] Dejar sesión expirar
  - [ ] Intentar generar con sesión expirada
  - [ ] Verificar logout automático
  - [ ] Verificar redirección a login

---

## 📋 CHECKLIST 4: AÑADIR NUEVA FUNCIONALIDAD DE IA

### Escenario: Implementar generación de videos con IA

#### Fase 1: Planificación

- [ ] **1.1 Diseño**
  - [ ] Definir flujo de usuario
  - [ ] Definir estructura de datos
  - [ ] Definir endpoints necesarios
  - [ ] Definir estados de polling

#### Fase 2: Backend (si aplica)

- [ ] **2.1 API**
  - [ ] Endpoint para iniciar generación
  - [ ] Endpoint para consultar estado
  - [ ] Endpoint para historial
  - [ ] Endpoint para eliminar

#### Fase 3: Frontend - Tipos

- [ ] **3.1 Crear/Actualizar Tipos**
  - [ ] Crear `src/types/video-ai.ts` (o extender `media-ai.ts`)
  - [ ] Definir `GenerateVideoRequest`
  - [ ] Definir `GenerateVideoResponse`
  - [ ] Definir `VideoAiGeneration`
  - [ ] Definir estados y metadata

#### Fase 4: Frontend - Store

- [ ] **4.1 Crear/Actualizar Store**
  - [ ] Crear `src/store/VideoAiStore.ts` (o extender `MediaAiStore`)
  - [ ] Implementar `generateVideo()`
  - [ ] Implementar `pollStatus()`
  - [ ] Implementar `fetchHistory()`
  - [ ] Implementar `deleteGeneration()`
  - [ ] Definir estado inicial

#### Fase 5: Frontend - Endpoints

- [ ] **5.1 Añadir Endpoints**
  - [ ] Abrir `src/utils/axiosInstance.ts`
  - [ ] Añadir `endpoints.videoAi.generate`
  - [ ] Añadir `endpoints.videoAi.status`
  - [ ] Añadir `endpoints.videoAi.history`
  - [ ] Añadir `endpoints.videoAi.delete`

#### Fase 6: Frontend - Componentes UI

- [ ] **6.1 Crear Componente Generador**
  - [ ] Crear `VideoAiGenerator.tsx`
  - [ ] Formulario con prompt
  - [ ] Selector de configuración (duración, estilo, etc.)
  - [ ] Botón "Generar Video"
  - [ ] Área de preview con player
  - [ ] Estados: loading, preview, error

- [ ] **6.2 Integrar en Editor**
  - [ ] Añadir botón/opción en UI existente
  - [ ] Crear modal o dialog si es necesario
  - [ ] Implementar callback de integración

#### Fase 7: Frontend - Progreso/Feedback

- [ ] **7.1 Componente de Progreso**
  - [ ] Crear o reutilizar componente de progreso
  - [ ] Definir estados visuales
  - [ ] Implementar polling UI

#### Fase 8: Testing Completo

- [ ] **8.1 Pruebas Funcionales**
  - [ ] Generar video exitosamente
  - [ ] Cancelar generación
  - [ ] Manejar errores
  - [ ] Ver historial
  - [ ] Eliminar del historial
  - [ ] Usar video generado en contenido

- [ ] **8.2 Pruebas de Performance**
  - [ ] Verificar que polling no bloquea UI
  - [ ] Verificar memoria con videos grandes
  - [ ] Verificar carga de historial

#### Fase 9: Documentación

- [ ] Actualizar `AI_SYSTEM_INVENTORY.md`
- [ ] Actualizar `AI_SYSTEM_QUICK_REFERENCE.md`
- [ ] Actualizar `AI_ARCHITECTURE_MAP.md`
- [ ] Crear guía de uso específica si necesario

---

## 📋 CHECKLIST 5: OPTIMIZAR POLLING

### Escenario: Mejorar performance del sistema de polling

#### Fase 1: Análisis

- [ ] **1.1 Identificar Problemas**
  - [ ] Medir tiempos de generación reales
  - [ ] Identificar cuellos de botella
  - [ ] Revisar logs de backend
  - [ ] Analizar tasa de éxito/fallo

#### Fase 2: Actualizar Configuración

- [ ] **2.1 Configuración de Polling de Notas**
  - [ ] Abrir `src/services/ai-service.ts`
  - [ ] Ajustar `POLLING_CONFIG.interval`
  - [ ] Ajustar `POLLING_CONFIG.maxDuration`
  - [ ] Ajustar `POLLING_CONFIG.maxAttempts`
  - [ ] Considerar polling adaptativo

- [ ] **2.2 Polling de Imágenes**
  - [ ] Abrir `ImageAiGenerator.tsx`
  - [ ] Ajustar delays en `startPolling()`
  - [ ] Ajustar `maxAttempts`
  - [ ] Verificar factor de incremento (1.5x)

#### Fase 3: Implementar Mejoras

- [ ] **3.1 Polling Inteligente**
  - [ ] Implementar backoff exponencial
  - [ ] Implementar jitter aleatorio
  - [ ] Añadir timeout por etapa
  - [ ] Implementar circuit breaker

- [ ] **3.2 Optimizar Requests**
  - [ ] Añadir etags si backend soporta
  - [ ] Implementar long polling si backend soporta
  - [ ] Usar WebSockets si backend soporta

#### Fase 4: Añadir Telemetría

- [ ] **4.1 Logging**
  - [ ] Añadir logs de tiempo de generación
  - [ ] Añadir logs de intentos de polling
  - [ ] Añadir logs de errores específicos

- [ ] **4.2 Métricas**
  - [ ] Tiempo promedio de generación
  - [ ] Tasa de éxito/fallo
  - [ ] Número de reintentos promedio

#### Fase 5: Testing

- [ ] **5.1 Pruebas de Carga**
  - [ ] Generar múltiples notas simultáneamente
  - [ ] Verificar que polling no se acumula
  - [ ] Verificar cancelación funciona bajo carga

- [ ] **5.2 Pruebas de Latencia**
  - [ ] Simular latencia de red alta
  - [ ] Verificar timeouts apropiados
  - [ ] Verificar experiencia de usuario

---

## 📋 CHECKLIST 6: MIGRAR A NUEVO BACKEND

### Escenario: Cambiar completamente de servidor de IA

#### Fase 1: Preparación

- [ ] **1.1 Documentar Estado Actual**
  - [ ] Documentar endpoints actuales
  - [ ] Documentar formato de datos actual
  - [ ] Documentar flujos actuales
  - [ ] Crear backups

#### Fase 2: Configuración

- [ ] **2.1 URLs y Endpoints**
  - [ ] Actualizar `src/global-config.ts`
    - [ ] Nueva `serverUrlIA`
  - [ ] Actualizar `src/utils/axiosInstance.ts`
    - [ ] Todos los `endpoints.ai.*`
    - [ ] Todos los `endpoints.magicWrite.*`
    - [ ] Todos los `endpoints.mediaAi.*`

#### Fase 3: Adaptadores (si formatos difieren)

- [ ] **3.1 Crear Funciones Adaptadoras**
  - [ ] Crear `src/adapters/ai-adapters.ts`
  - [ ] Función para adaptar request de notas
  - [ ] Función para adaptar response de notas
  - [ ] Función para adaptar request de texto
  - [ ] Función para adaptar response de texto
  - [ ] Función para adaptar request de imágenes
  - [ ] Función para adaptar response de imágenes

#### Fase 4: Actualizar Stores

- [ ] **4.1 Integrar Adaptadores**
  - [ ] `AiGenerationStore.ts`: usar adaptadores
  - [ ] `MagicWriteStore.ts`: usar adaptadores
  - [ ] `MediaAiStore.ts`: usar adaptadores

#### Fase 5: Actualizar Servicios

- [ ] **5.1 ai-service.ts**
  - [ ] Actualizar `parseGeneratedContent()` si formato cambió
  - [ ] Actualizar manejo de estados
  - [ ] Actualizar manejo de errores

#### Fase 6: Testing Exhaustivo

- [ ] **6.1 Testing por Funcionalidad**
  - [ ] Generar nota simple
  - [ ] Generar nota con título y categoría
  - [ ] Todas las acciones de Magic Write
  - [ ] Generar imagen en todas las resoluciones
  - [ ] Polling de estados
  - [ ] Cancelaciones
  - [ ] Historial
  - [ ] Manejo de errores

- [ ] **6.2 Testing de Migración**
  - [ ] Probar con datos antiguos (si aplica)
  - [ ] Verificar compatibilidad
  - [ ] Plan de rollback si falla

#### Fase 7: Monitoreo Post-Migración

- [ ] **7.1 Observación**
  - [ ] Monitorear logs de errores
  - [ ] Monitorear tiempos de respuesta
  - [ ] Monitorear tasa de éxito
  - [ ] Recolectar feedback de usuarios

---

## 📋 CHECKLIST 7: REFACTORIZAR COMPONENTES UI

### Escenario: Mejorar experiencia de usuario de IA

#### Fase 1: Identificar Mejoras

- [ ] **1.1 UX Review**
  - [ ] Identificar puntos de fricción
  - [ ] Recolectar feedback de usuarios
  - [ ] Identificar casos de uso no cubiertos

#### Fase 2: Diseñar Mejoras

- [ ] **2.1 Mockups/Wireframes**
  - [ ] Crear diseños de nuevas interfaces
  - [ ] Validar con stakeholders
  - [ ] Definir interacciones

#### Fase 3: Implementar Cambios

- [ ] **3.1 AINoteModal**
  - [ ] Implementar nuevos diseños
  - [ ] Mantener compatibilidad con callbacks existentes
  - [ ] Añadir animaciones/transiciones

- [ ] **3.2 AIAssistantModal**
  - [ ] Actualizar layout
  - [ ] Mejorar comparación de textos
  - [ ] Optimizar categorías de opciones

- [ ] **3.3 ImageAiGenerator**
  - [ ] Mejorar preview
  - [ ] Mejorar historial
  - [ ] Añadir filtros/búsqueda

#### Fase 4: Actualizar Componentes Compartidos

- [ ] **4.1 AIGenerationProgress**
  - [ ] Mejorar animaciones
  - [ ] Añadir información más detallada
  - [ ] Mejorar responsividad

#### Fase 5: Accesibilidad

- [ ] **5.1 A11y Check**
  - [ ] Añadir ARIA labels
  - [ ] Verificar navegación por teclado
  - [ ] Verificar contraste de colores
  - [ ] Añadir textos alternativos

#### Fase 6: Performance UI

- [ ] **6.1 Optimización**
  - [ ] Memoizar componentes pesados
  - [ ] Lazy load componentes grandes
  - [ ] Optimizar re-renders

#### Fase 7: Testing UI

- [ ] **7.1 Visual Testing**
  - [ ] Probar en diferentes tamaños de pantalla
  - [ ] Probar en diferentes navegadores
  - [ ] Probar con diferentes temas (si aplica)

- [ ] **7.2 Interacción Testing**
  - [ ] Probar todos los flujos de usuario
  - [ ] Probar casos edge (textos muy largos, etc.)
  - [ ] Probar manejo de errores visual

---

## 🚨 CHECKLIST DE EMERGENCIA: ROLLBACK

### Escenario: Cambios causaron problemas en producción

#### Acción Inmediata

- [ ] **1. Evaluar Impacto**
  - [ ] ¿Afecta a todos los usuarios?
  - [ ] ¿Funcionalidad crítica rota?
  - [ ] ¿Pérdida de datos?

#### Git Rollback

- [ ] **2.1 Revertir Cambios**
  - [ ] Identificar commit problemático
  - [ ] `git revert <commit-hash>` o
  - [ ] `git reset --hard <commit-hash-anterior>`
  - [ ] Push a branch principal

#### Config Rollback

- [ ] **2.2 Revertir Configuración**
  - [ ] Si cambió `global-config.ts`, revertir URLs
  - [ ] Si cambió endpoints, revertir
  - [ ] Si cambió interceptores, revertir

#### Comunicación

- [ ] **3. Notificar**
  - [ ] Notificar a equipo
  - [ ] Notificar a usuarios si es necesario
  - [ ] Documentar qué salió mal

#### Post-Mortem

- [ ] **4. Análisis**
  - [ ] Identificar causa raíz
  - [ ] Documentar lecciones aprendidas
  - [ ] Actualizar checklists para prevenir

---

## 📊 MATRIZ DE IMPACTO

| Tipo de Cambio | Archivos Afectados | Riesgo | Tiempo Estimado |
|----------------|-------------------|--------|----------------|
| **Estructura de datos** | 10-15 | 🔴 Alto | 4-6 horas |
| **Endpoints** | 5-8 | 🟡 Medio | 1-2 horas |
| **Autenticación** | 5-10 | 🔴 Alto | 3-4 horas |
| **Nueva funcionalidad** | 15-20 | 🟡 Medio | 1-2 días |
| **Optimizar polling** | 3-5 | 🟢 Bajo | 2-3 horas |
| **Migrar backend** | 20-30 | 🔴 Alto | 1-2 días |
| **Refactor UI** | 10-15 | 🟡 Medio | 1 día |

**Riesgo:**
- 🔴 Alto: Puede romper funcionalidad core, requiere testing exhaustivo
- 🟡 Medio: Puede causar bugs menores, requiere testing normal
- 🟢 Bajo: Cambios localizados, testing mínimo

---

## 💡 MEJORES PRÁCTICAS

### Antes de Empezar
1. ✅ Crear rama de feature
2. ✅ Leer documentación relevante
3. ✅ Hacer backup de archivos críticos
4. ✅ Notificar al equipo

### Durante el Cambio
1. ✅ Hacer commits pequeños y frecuentes
2. ✅ Escribir mensajes de commit descriptivos
3. ✅ Probar cada cambio antes del siguiente
4. ✅ Documentar decisiones importantes

### Después del Cambio
1. ✅ Testing exhaustivo
2. ✅ Code review
3. ✅ Actualizar documentación
4. ✅ Merge a develop/staging primero
5. ✅ Monitorear en staging
6. ✅ Deploy a producción con plan de rollback

---

## 📞 RECURSOS DE AYUDA

- **Inventario Completo:** `AI_SYSTEM_INVENTORY.md`
- **Referencia Rápida:** `AI_SYSTEM_QUICK_REFERENCE.md`
- **Mapa de Arquitectura:** `AI_ARCHITECTURE_MAP.md`
- **Guía de Integración:** `docs/AI_INTEGRATION_GUIDE.md`
- **Estructura de Datos:** `docs/AI_DATA_STRUCTURE.md`

---

**Nota:** Marca cada checkbox con [x] a medida que completes cada paso. Esto te ayudará a no olvidar ningún componente crítico.

**Última actualización:** 2025-11-10

