# Guía de Integración: Sistema de Generación con IA

## Resumen

Se ha implementado un sistema **asíncrono con polling** para la generación de contenido con IA. El backend genera contenido en segundo plano y el frontend consulta el estado cada 2.5 segundos hasta que se complete.

## Arquitectura

### Frontend

- **Store**: `src/store/AiGenerationStore.ts` - Maneja el estado de generación
- **Servicio**: `src/services/ai-service.ts` - Funciones de API
- **Tipos**: `src/types/ai-generation.ts` - Tipos TypeScript
- **UI**: `src/components/newsletter-note/ai-creation/AIGenerationProgress.tsx` - Componente de progreso

### Backend

- **Endpoint Inicio**: `POST /api/v1/ai/generate-note` → Devuelve `taskId`
- **Endpoint Status**: `GET /api/v1/ai/status/:taskId` → Devuelve estado actual

## Flujo de Trabajo

```
1. Usuario completa formulario
   ↓
2. Frontend: POST /api/v1/ai/generate-note
   ← Backend devuelve taskId
   ↓
3. Frontend: Inicia polling cada 2.5s
   GET /api/v1/ai/status/:taskId
   ↓
4. Backend responde con estado:
   - PENDING (0%)
   - GENERATING_IMAGE (25%)
   - GENERATING_WEB_CONTENT (50%)
   - GENERATING_NEWSLETTER_CONTENT (75%)
   - COMPLETED (100%) ← Incluye datos
   ↓
5. Frontend parsea JSON strings y muestra resultado
```

## Uso en Componentes

### Opción 1: Usando el Store (Recomendado)

```typescript
import useAiGenerationStore from 'src/store/AiGenerationStore';

function MyComponent() {
  const {
    loading,
    status,
    progress,
    message,
    error,
    generateNote,
    cancelGeneration,
  } = useAiGenerationStore();

  const handleGenerate = async () => {
    const result = await generateNote(
      'Crea una guía sobre pez payaso',
      'Guía del Pez Payaso', // título opcional
      'Especies Marinas', // categoría opcional
      'GUIDE' // template: NEWS | ARTICLE | GUIDE | TUTORIAL
    );

    if (result) {
      // result.objData - Array de componentes para newsletter
      // result.objDataWeb - Array de componentes para web
      console.log('Contenido generado:', result);
    }
  };

  return (
    <>
      {loading && status && (
        <AIGenerationProgress
          status={status}
          progress={progress}
          message={message}
          onCancel={cancelGeneration}
        />
      )}
      <button onClick={handleGenerate}>Generar</button>
    </>
  );
}
```

### Opción 2: Usando el Servicio Directamente

```typescript
import { generateNoteComplete } from 'src/services/ai-service';
import type { GenerateNoteRequest } from 'src/types/ai-generation';

async function generateContent() {
  const request: GenerateNoteRequest = {
    prompt: 'Crea una guía sobre...',
    title: 'Título opcional',
    category: 'Categoría',
    template: 'GUIDE',
    userId: currentUser.id,
    plan: currentUser.plan,
  };

  try {
    const result = await generateNoteComplete(request, (status, progress, message) => {
      // Callback de progreso
      console.log(`${progress}% - ${message}`);
    });

    // result.objData - Array de componentes para newsletter
    // result.objDataWeb - Array de componentes para web
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Formato de Datos

### ⚠️ IMPORTANTE: Parsing de JSON

El backend devuelve `objData` y `objDataWeb` como **STRING JSON**, no como arrays directos:

```typescript
// ❌ Incorrecto - Los datos NO vienen así
{
  objData: [{ id: 'heading-1', ... }],
  objDataWeb: [{ id: 'heading-1-web', ... }]
}

// ✅ Correcto - Los datos vienen así
{
  objData: "[{\"id\":\"heading-1\",...}]",  // STRING
  objDataWeb: "[{\"id\":\"heading-1-web\",...}]"  // STRING
}
```

El servicio `parseGeneratedContent()` se encarga del parsing automáticamente.

## Estados del Polling

| Estado                          | Progreso | Descripción                       |
| ------------------------------- | -------- | --------------------------------- |
| `PENDING`                       | 0%       | Tarea en cola                     |
| `GENERATING_IMAGE`              | 25%      | Generando imagen con DALL-E       |
| `GENERATING_WEB_CONTENT`        | 50%      | Generando contenido web extendido |
| `GENERATING_NEWSLETTER_CONTENT` | 75%      | Generando newsletter resumido     |
| `COMPLETED`                     | 100%     | ¡Completado!                      |
| `ERROR`                         | 0%       | Error en el proceso               |

## Configuración

### Timeouts y Polling

En `src/services/ai-service.ts`:

```typescript
const POLLING_CONFIG = {
  interval: 2500, // Consultar cada 2.5 segundos
  maxDuration: 5 * 60 * 1000, // Máximo 5 minutos
  maxAttempts: 120, // 120 intentos
};
```

### Endpoints

En `src/utils/axiosInstance.ts`:

```typescript
ai: {
  generateNote: '/api/v1/ai/generate-note',
  checkStatus: (taskId: string) => `/api/v1/ai/status/${taskId}`,
}
```

## Validaciones

El servicio valida automáticamente:

- ✅ Prompt obligatorio (10-2000 caracteres)
- ✅ Título opcional (max 200 caracteres)
- ✅ userId obligatorio
- ✅ Categoría opcional

## Manejo de Errores

```typescript
try {
  const result = await generateNote(prompt, title, category);
  if (!result) {
    // Error durante la generación
    console.error('Error:', error);
  }
} catch (error) {
  // Error de red o validación
  console.error('Error fatal:', error);
}
```

## Componentes Visuales

### AIGenerationProgress

Muestra progreso visual con:

- Barra de progreso animada
- Iconos por estado
- Mensajes contextuales
- Botón de cancelar (opcional)

```typescript
<AIGenerationProgress
  status="GENERATING_IMAGE"
  progress={25}
  message="Generando imagen con IA..."
  onCancel={() => cancelGeneration()}
  showCancel={true}
/>
```

## Testing

Para probar localmente:

```bash
# 1. Asegúrate de que el backend esté corriendo
# 2. Verifica la variable de entorno
echo $NEXT_PUBLIC_SERVER_URL_IA

# 3. Abre el modal de creación
# 4. Completa el prompt
# 5. Observa el progreso en la consola y UI
```

## Troubleshooting

### Error: "Timeout: La generación está tardando demasiado"

- El backend tardó más de 5 minutos
- Solución: Reintentar o verificar el backend

### Error: "Usuario no autenticado"

- No hay userId en AuthStore
- Solución: Verificar sesión del usuario

### Error: "Error al parsear el contenido generado"

- El backend no devolvió JSON válido
- Solución: Verificar formato de respuesta del backend

### El polling no se detiene

- Llamar a `cancelGeneration()` del store
- Al cerrar el modal, se limpia automáticamente

## Próximos Pasos

- [ ] Implementar generación de newsletters completos
- [ ] Agregar historial de generaciones
- [ ] Implementar templates personalizados
- [ ] Agregar regeneración de secciones específicas

## Referencias

- **Documentación Backend**: `docs/AI_DATA_STRUCTURE.md`
- **Tipos**: `src/types/ai-generation.ts`
- **Store**: `src/store/AiGenerationStore.ts`
- **Servicio**: `src/services/ai-service.ts`
