# Flujo del Botón de IA en el Header

## Descripción General

El botón de IA en el header del editor permite iniciar la generación de contenido con IA y monitorear el progreso de la generación incluso después de cerrar el modal.

### Flujo Visual Resumido

```
Usuario hace clic en "Generar con IA"
              ↓
    ¿Ya está generando?
         ↙      ↘
      SÍ         NO
       ↓          ↓
  Abrir modal   ¿Hay contenido?
  (ver prog.)    ↙        ↘
              SÍ           NO
               ↓            ↓
         Confirmar      Abrir modal
          o Cancel      directamente
               ↓
          Abrir modal

Usuario genera contenido en modal
              ↓
    Usuario cierra modal
              ↓
  Generación continúa en background
              ↓
    Botón muestra progreso con animación
              ↓
  Usuario puede reabrir modal (clic en botón)
              ↓
    Generación completa (100%)
              ↓
  Contenido se inyecta automáticamente
              ↓
    Modal se cierra (si está abierto)
              ↓
  Botón vuelve a estado normal
```

## Requisitos de Visibilidad

El botón **solo** es visible cuando:

1. ✅ No está en modo view-only (`!isViewOnly`)
2. ✅ El template activo es `'news'` (`activeTemplate === 'news'`)
3. ✅ El estado de la nota es editable:
   - `DRAFT` (Borrador)
   - `REVIEW` (En Revisión)
   - `REJECTED` (Rechazado)
4. ✅ La función `onAIGenerateClick` está disponible

## Estados del Botón

### Estado Normal (No generando)

```tsx
<Button variant="outlined" startIcon={<Icon icon="mdi:magic-staff" />}>
  Generar con IA
</Button>
```

- **Texto**: "Generar con IA"
- **Icono**: Varita mágica (`mdi:magic-staff`)
- **Color**: Morado (#8B45FF)
- **Acción**: Abre el modal de creación con IA

### Estado Generando (En progreso)

```tsx
<Tooltip title="Haz clic para ver el progreso detallado">
  <AnimateBorder duration={3} slotProps={...}>
    <Button onClick={onAIGenerateClick} startIcon={<Icon icon="svg-spinners:blocks-shuffle-3" />}>
      <Box>
        <Typography>Generando...</Typography>
        <Typography>{progress}%</Typography>
      </Box>
    </Button>
  </AnimateBorder>
</Tooltip>
```

- **Animación**: Borde animado con `AnimateBorder` (color morado)
- **Texto**: "Generando..." + porcentaje
- **Icono**: Spinner animado (`svg-spinners:blocks-shuffle-3`)
- **Color**: Morado semi-transparente
- **Estado**: **Clickeable** (puede reabrir el modal)
- **Tooltip**: "Haz clic para ver el progreso detallado"
- **Progreso**: Muestra el % de avance (0-100%)
- **Acción al clic**: Reabre el modal para ver progreso detallado

## Flujo de Uso

### 1. Iniciar Generación

1. Usuario hace clic en "Generar con IA"
2. Se abre el modal `AINoteModal`
3. Usuario completa el formulario:
   - Prompt (obligatorio, mín. 10 caracteres)
   - Título (opcional)
   - Categoría (opcional)
4. Usuario hace clic en "Generar Nota"
5. Se inicia la generación y el botón muestra el progreso

### 2. Cerrar Modal Durante Generación

El usuario tiene dos opciones durante la generación:

#### Opción A: Cerrar Modal (Continuar en Background)

- **Botón**: "Cerrar" (azul, variant contained)
- **Acción**:
  - ✅ Cierra el modal
  - ✅ La generación continúa en background
  - ✅ El botón del header muestra la animación y progreso
- **Uso**: Cuando el usuario quiere hacer otras cosas mientras espera

#### Opción B: Cancelar Generación

- **Botón**: "Cancelar Generación" (rojo, variant outlined)
- **Acción**:
  - 🛑 Detiene el polling
  - 🛑 Cancela la generación
  - ✅ Cierra el modal
  - ✅ El botón vuelve al estado normal
- **Uso**: Cuando el usuario quiere abortar completamente

### 3. Progreso en el Header

Cuando el modal está cerrado pero la generación continúa:

```
┌─────────────────────────────┐
│  🔄 Generando...            │
│     25%                     │
└─────────────────────────────┘
  ↑ Animación de borde morado
```

**Información mostrada:**

- Animación de borde pulsante (3 segundos por ciclo)
- Texto "Generando..."
- Porcentaje de progreso (actualizado en tiempo real)

### 4. Reabrir Modal Durante Generación

Si el usuario cerró el modal pero quiere ver el progreso detallado:

1. **Hace clic en el botón del header** (con la animación de progreso)
2. **El modal se reabre** mostrando:
   - El formulario usado (título, categoría, prompt)
   - El componente de progreso con barra y mensajes
   - Los botones "Cancelar Generación" y "Cerrar"
3. **Puede volver a cerrar** sin afectar la generación
4. **Puede cancelar** si decide abortar

### 5. Completar Generación

Cuando la generación termina:

1. ✅ El contenido se inyecta automáticamente al editor
2. ✅ Se muestra notificación de éxito
3. ✅ Si el modal está abierto, se cierra automáticamente después de 1 segundo
4. ✅ El botón vuelve al estado normal "Generar con IA"
5. ✅ El store limpia el estado de generación

## Estados del Polling

Durante la generación, el sistema pasa por estos estados:

| Estado                          | Progreso | Mensaje                              | Duración Aproximada |
| ------------------------------- | -------- | ------------------------------------ | ------------------- |
| `PENDING`                       | 0%       | Iniciando generación...              | ~2s                 |
| `GENERATING_IMAGE`              | 25%      | Generando imagen con IA...           | ~30-60s             |
| `GENERATING_WEB_CONTENT`        | 50%      | Generando contenido web...           | ~30-60s             |
| `GENERATING_NEWSLETTER_CONTENT` | 75%      | Generando contenido de newsletter... | ~30-60s             |
| `COMPLETED`                     | 100%     | Generación completada exitosamente   | -                   |

**Tiempo total estimado**: 2-3 minutos

## Manejo de Errores

Si ocurre un error durante la generación:

1. ❌ El polling se detiene
2. ❌ Se muestra mensaje de error
3. 🔄 El botón vuelve al estado normal
4. 🔄 El usuario puede intentar de nuevo

## Archivos Involucrados

### 1. Header del Editor

**Archivo**: `src/components/newsletter-note/email-editor/editor-header.tsx`

- Renderiza el botón de IA
- Lee el estado del store (`loading`, `progress`)
- Condiciona la animación según el estado

### 2. Store de Generación

**Archivo**: `src/store/AiGenerationStore.ts`

- Maneja el estado global de generación
- Ejecuta el polling
- Almacena progreso y estado

### 3. Modal de Creación

**Archivo**: `src/components/newsletter-note/ai-creation/AINoteModal.tsx`

- Formulario de creación
- Inicia la generación
- Puede cerrarse sin detener el proceso

### 4. Componente de Progreso

**Archivo**: `src/components/newsletter-note/ai-creation/AIGenerationProgress.tsx`

- Barra de progreso visual
- Mensajes de estado
- Usado dentro del modal

### 5. Animación de Borde

**Archivo**: `src/components/animate/animate-border.tsx`

- Componente reutilizable de animación
- Crea el efecto de borde pulsante
- Usado en el botón del header

## Notas Técnicas

### Detección de Estado al Hacer Clic

Cuando el usuario hace clic en el botón de IA, el sistema verifica:

```typescript
const handleAIGenerateClick = () => {
  // Verificar si ya está generando
  const { loading: isGenerating } = useAiGenerationStore.getState();

  if (isGenerating) {
    // Reabrir modal para ver progreso
    setShowAIModal(true);
    return;
  }

  // Si no está generando, verificar contenido existente
  const components = getActiveComponents();

  if (components && components.length > 0) {
    // Mostrar confirmación para reemplazar
    setShowAIConfirmDialog(true);
  } else {
    // Abrir modal directamente
    setShowAIModal(true);
  }
};
```

**Flujo inteligente:**

1. Si está generando → Reabre modal (sin confirmación)
2. Si hay contenido → Muestra confirmación
3. Si está vacío → Abre modal directamente

### Cierre Automático del Modal

El modal se cierra automáticamente cuando:

```typescript
useEffect(() => {
  if (open && generationStatus === 'COMPLETED' && !loading) {
    setTimeout(() => onClose(), 1000);
  }
}, [open, generationStatus, loading]);
```

- ✅ Solo si el modal está abierto
- ✅ Solo si la generación completó exitosamente
- ⏱️ Espera 1 segundo para que el usuario vea el 100%

### Cancelación Inteligente

El sistema verifica la cancelación en dos puntos clave:

```typescript
// 1. Antes de cada iteración del polling
const { isCancelled } = useAiGenerationStore.getState();
if (isCancelled) {
  throw new Error('Generación cancelada');
}

// 2. Antes de procesar resultados
if (stillCancelled) {
  console.log('🛑 Generación cancelada, ignorando resultados');
  throw new Error('Generación cancelada');
}
```

### Animación Personalizada

La animación del borde usa:

- **Duración**: 3 segundos por ciclo
- **Color primario**: #8B45FF (morado)
- **Color de contorno**: rgba(139, 69, 255, 0.2) (morado semi-transparente)
- **Tamaño del borde**: 2px
- **Tamaño del efecto**: 120px

### Persistencia del Estado

El estado de generación persiste en el store de Zustand, por lo que:

- ✅ El progreso se mantiene al cerrar/abrir el modal
- ✅ El botón del header siempre refleja el estado actual
- ✅ No se pierde información al navegar por el editor

## Mejoras Futuras

Posibles mejoras a considerar:

1. 🔔 **Notificación cuando complete**: Enviar notificación del navegador cuando termine
2. 🔊 **Sonido de completado**: Reproducir sonido al terminar
3. 📊 **Historial de generaciones**: Guardar historial de generaciones recientes
4. ⏸️ **Pausar generación**: Permitir pausar y reanudar (si el backend lo soporta)
5. 🔄 **Reintentar automático**: Reintentar automáticamente si falla

## Debugging

Para depurar el sistema:

```javascript
// Ver estado actual del store
console.log(useAiGenerationStore.getState());

// Ver logs del polling
// Buscar en consola: 📊 [Intento X] Estado: ...

// Ver estado de cancelación
// Buscar en consola: 🛑 Polling detenido: ...
```
