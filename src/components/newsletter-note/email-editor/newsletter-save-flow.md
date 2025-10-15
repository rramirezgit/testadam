# Flujo de Guardar Newsletter

## Descripción

Este documento explica cómo funciona el flujo de guardar newsletter en el editor de email.

## Componentes Involucrados

### 1. EditorHeader (editor-header.tsx)

**Función principal:** `handleSaveNewsletter()`

```typescript
const handleSaveNewsletter = async () => {
  // 1. Verificar si es modo newsletter
  if (!isNewsletterMode) {
    openSaveDialog(); // Usar flujo normal de notas
    return;
  }

  // 2. Generar HTML si no está disponible
  let content = htmlContent;
  if (!content && onGenerateHtml) {
    content = await onGenerateHtml();
  }

  // 3. Preparar datos del newsletter
  const subject = initialNote?.title || 'Nuevo Newsletter';
  const newsletterData = {
    content,
    status: 'DRAFT',
    notes: newsletterList || [],
  };

  // 4. Llamar a la función del store
  const result = await createNewsletter(subject, newsletterData);
};
```

**Botón de guardar:**

- Aparece solo en modo newsletter
- Se deshabilita cuando `saving` es true
- Llama a `handleSaveNewsletter` al hacer click

### 2. PostStore (PostStore.ts)

**Función:** `createNewsletter(subject: string, newsletterData: any)`

```typescript
createNewsletter: async (subject: string, newsletterData: any) => {
  try {
    set({ loading: true, error: null });
    const axiosInstance = createAxiosInstance();

    const sendData = {
      subject,
      ...newsletterData,
    };

    const response = await axiosInstance.post(endpoints.newsletter.create, sendData);

    set({ loading: false });
    return response.data;
  } catch (error) {
    // Manejo de errores
    return null;
  }
};
```

### 3. AxiosInstance (axiosInstance.ts)

**Endpoint:** `/newsletters`

```typescript
newsletter: {
  create: '/newsletters',
  // ... otros endpoints
}
```

## Flujo Completo

### 1. Usuario hace click en "Guardar"

```typescript
// En editor-header.tsx
<Button onClick={handleSaveNewsletter}>
  Guardar
</Button>
```

### 2. Verificación de modo

```typescript
if (!isNewsletterMode) {
  openSaveDialog(); // Flujo normal de notas
  return;
}
```

### 3. Generación de HTML

```typescript
let content = htmlContent;
if (!content && onGenerateHtml) {
  content = await onGenerateHtml();
}
```

### 4. Preparación de datos

```typescript
const subject = initialNote?.title || 'Nuevo Newsletter';
const newsletterData = {
  content, // HTML generado
  status: 'DRAFT', // Estado inicial
  notes: newsletterList || [], // Lista de notas
  // Configuración completa de componentes (objData)
  objData: JSON.stringify(newsletterComponents),
  // Configuración del newsletter
  config: {
    templateType: 'newsletter',
    dateCreated: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    activeVersion: 'newsletter',
  },
};
```

### 5. Llamada al store

```typescript
const result = await createNewsletter(subject, newsletterData);
```

### 6. Petición HTTP

```typescript
// POST /newsletters
{
  "subject": "Título del Newsletter",
  "content": "<html>...</html>",
  "status": "DRAFT",
  "notes": [...],
  "objData": "[{\"noteId\":\"123\",\"title\":\"Nota 1\",\"objData\":\"[...]\",\"objDataWeb\":\"[...]\",\"configPost\":\"{...}\"}]",
  "config": {
    "templateType": "newsletter",
    "dateCreated": "2024-01-01T00:00:00Z",
    "dateModified": "2024-01-01T00:00:00Z",
    "activeVersion": "newsletter"
  }
}
```

### 7. Respuesta del servidor

```typescript
// Respuesta exitosa
{
  "id": "newsletter_123",
  "subject": "Título del Newsletter",
  "status": "DRAFT",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Estados y Loading

### Estados del botón

- **Normal:** Botón habilitado
- **Guardando:** Botón deshabilitado (`saving: true`)
- **Error:** Muestra error en consola

### Indicadores visuales

```typescript
<Button
  disabled={saving}
  startIcon={<Icon icon="material-symbols:save" />}
>
  Guardar
</Button>
```

## Manejo de Errores

### Errores comunes

1. **HTML no generado:**

   ```typescript
   if (!content) {
     throw new Error('No se pudo generar el contenido HTML');
   }
   ```

2. **Error de red:**

   ```typescript
   catch (error) {
     console.error('❌ Error guardando newsletter:', error);
     // El store maneja el error automáticamente
   }
   ```

3. **Respuesta del servidor:**
   ```typescript
   if (!result) {
     throw new Error('Error al guardar newsletter');
   }
   ```

## Logs de Debugging

### Logs importantes

```typescript
console.log('🔄 handleSaveNewsletter called:', {
  isNewsletterMode,
  hasOnGenerateHtml: !!onGenerateHtml,
  hasHtmlContent: !!htmlContent,
});

console.log('📤 Guardando newsletter con objData:', {
  subject,
  newsletterData: {
    contentLength: newsletterData.content.length,
    status: newsletterData.status,
    notesCount: newsletterData.notes.length,
    objDataLength: newsletterData.objData.length,
    componentsCount: newsletterComponents.length,
  },
});

console.log('✅ Newsletter guardado exitosamente:', result);
```

## Diferencias con Notas Normales

### Newsletter vs Nota

| Aspecto      | Newsletter                 | Nota Normal         |
| ------------ | -------------------------- | ------------------- |
| **Endpoint** | `/newsletters`             | `/posts`            |
| **Función**  | `createNewsletter()`       | `create()`          |
| **Datos**    | `subject + newsletterData` | `CreatePostData`    |
| **Estado**   | `DRAFT` por defecto        | Según configuración |
| **HTML**     | Generado automáticamente   | Según template      |

### Flujo condicional

```typescript
const handleSaveNewsletter = async () => {
  if (!isNewsletterMode) {
    openSaveDialog(); // Flujo de notas
    return;
  }

  // Flujo de newsletter
  await createNewsletter(subject, newsletterData);
};
```

## Próximos Pasos

1. **Actualizar ID:** Después de guardar, actualizar `currentNewsletterId`
2. **Validación:** Agregar validaciones de datos
3. **Feedback:** Mostrar mensajes de éxito/error al usuario
4. **Optimización:** Cachear datos para evitar regeneración innecesaria
