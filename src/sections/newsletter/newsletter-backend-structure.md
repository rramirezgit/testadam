# Estructura del Backend para Newsletters

## Respuesta del Endpoint GET /newsletters

### Estructura de Respuesta

```json
{
  "data": [
    {
      "id": "67901d5cfb505b2c6e4819eb",
      "subject": "Prueba Schedule Newsletter con update",
      "status": "DRAFT",
      "createdAt": "2025-01-21T22:19:07.973Z",
      "scheduleDate": "2025-01-21T22:19:07.973Z"
    },
    {
      "id": "678fb990e79188ad77dbacfc",
      "subject": "{{subject_newsletter}}",
      "status": "DRAFT",
      "createdAt": "2025-01-21T15:13:19.873Z",
      "scheduleDate": "2025-01-21T16:00:00.000Z"
    }
  ]
}
```

## Cambios Realizados

### 1. PostStore.ts - Manejo de Estructura

```typescript
findAllNewsletters: async () => {
  // ...
  const response = await axiosInstance.get(endpoints.newsletter.findAll);

  // Manejar la estructura { data: [...] }
  const newsletters = response.data?.data || response.data || [];

  console.log('✅ Newsletters obtenidos exitosamente:', {
    responseStatus: response.status,
    newslettersCount: newsletters.length,
    responseData: response.data,
    newsletters: newsletters,
  });

  return newsletters;
};
```

### 2. Types - Newsletter Interface Actualizada

```typescript
export interface Newsletter {
  id: string;
  subject: string; // Cambiado de 'title' a 'subject'
  description?: string;
  notes?: NewsletterNote[]; // Opcional ya que puede no venir en la lista
  dateCreated?: string; // Opcional
  dateModified?: string; // Opcional
  createdAt: string; // Agregado para coincidir con el backend
  scheduleDate?: string; // Agregado para coincidir con el backend
  header?: NewsletterHeader;
  footer?: NewsletterFooter;
  content?: any;
  design?: any;
  generatedHtml?: string;
  status?: string; // DRAFT, REVIEW, APPROVED, PUBLISHED
}
```

### 3. NewsletterCard.tsx - Actualizaciones

```typescript
// Cambio de title a subject
<Typography variant="h6" component="div" noWrap sx={{ maxWidth: '80%' }}>
  {newsletter.subject || 'Untitled Newsletter'}
</Typography>

// Manejo de notes opcional
<Chip
  size="small"
  label={`${newsletter.notes?.length || 0} note${(newsletter.notes?.length || 0) !== 1 ? 's' : ''}`}
  icon={<Icon icon="mdi:note-multiple" width={16} />}
/>

// Verificación de notes antes de renderizar
{newsletter.notes && newsletter.notes.length > 0 && (
  // Renderizar lista de notas
)}

// Cambio de fechas
<Typography variant="caption" color="text.secondary">
  Created: {newsletter.createdAt ? format(new Date(newsletter.createdAt), 'MMM d, yyyy') : ''}
</Typography>
<Typography variant="caption" color="text.secondary">
  Schedule: {newsletter.scheduleDate ? format(new Date(newsletter.scheduleDate), 'MMM d, yyyy') : 'Not scheduled'}
</Typography>
```

## Campos del Backend

### Campos Principales

- `id`: Identificador único del newsletter
- `subject`: Título del newsletter (antes era `title`)
- `status`: Estado del newsletter (DRAFT, REVIEW, APPROVED, PUBLISHED)
- `createdAt`: Fecha de creación
- `scheduleDate`: Fecha programada para envío

### Campos Opcionales

- `description`: Descripción del newsletter
- `notes`: Array de notas incluidas en el newsletter
- `content`: Contenido HTML del newsletter
- `objData`: Configuración de componentes
- `config`: Configuración adicional

## Filtrado por Estado

### Lógica de Filtrado

```typescript
{newsletters
  .filter((newsletter) => {
    switch (tab) {
      case 'DRAFT':
        return newsletter.status === 'DRAFT' || !newsletter.status;
      case 'REVIEW':
        return newsletter.status === 'REVIEW';
      case 'APPROVED':
        return newsletter.status === 'APPROVED';
      case 'PUBLISHED':
        return newsletter.status === 'PUBLISHED';
      default:
        return true;
    }
  })
  .map((newsletter) => (
    <NewsletterCard
      newsletter={newsletter}
      onOpen={handleOpenNewsletterEditor}
      onDelete={handleDeleteNewsletter}
    />
  ))}
```

## Logs de Debugging

### Carga Exitosa

```
🔄 findAllNewsletters called
✅ Newsletters obtenidos exitosamente: {
  responseStatus: 200,
  newslettersCount: 2,
  responseData: { data: [...] },
  newsletters: [...]
}
✅ Newsletters cargados desde backend: 2
```

### Estructura de Datos

```typescript
// Ejemplo de newsletter cargado
{
  id: "67901d5cfb505b2c6e4819eb",
  subject: "Prueba Schedule Newsletter con update",
  status: "DRAFT",
  createdAt: "2025-01-21T22:19:07.973Z",
  scheduleDate: "2025-01-21T22:19:07.973Z"
}
```

## Consideraciones

1. **Estructura Anidada**: El backend retorna `{ data: [...] }` en lugar de array directo
2. **Campos Opcionales**: Algunos campos pueden no estar presentes en la lista
3. **Fechas**: Usar `createdAt` y `scheduleDate` en lugar de `dateCreated`/`dateModified`
4. **Título**: Usar `subject` en lugar de `title`
5. **Estado**: El campo `status` determina en qué tab se muestra

## Troubleshooting

### Newsletter no aparece

- Verificar que el `status` coincida con el tab activo
- Comprobar que la estructura `{ data: [...] }` se maneje correctamente
- Revisar logs de carga

### Error en renderizado

- Verificar que `notes` sea opcional
- Comprobar que `subject` existe en lugar de `title`
- Revisar fechas (`createdAt`, `scheduleDate`)

### Filtrado incorrecto

- Verificar valores de `status` en el backend
- Comprobar lógica de filtrado por tab
- Revisar valores por defecto para newsletters sin status
