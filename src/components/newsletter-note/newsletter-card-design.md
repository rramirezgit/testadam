# NewsletterCard - Nuevo Diseño Igual a Notas

## Descripción

La `NewsletterCard` ahora tiene el mismo diseño que la `SavedNoteCard`, proporcionando una experiencia visual consistente en toda la aplicación.

## Cambios Realizados

### 1. Estructura Visual

```typescript
// Antes: Header con fondo azul
<Box sx={{
  backgroundColor: '#3f51b5',
  color: 'white',
}}>

// Ahora: Header limpio como las notas
<Box sx={{
  borderBottom: '1px solid rgba(0,0,0,0.08)',
}}>
```

### 2. Preview de Contenido

```typescript
// Nueva función para obtener preview del contenido
const getContentPreview = () => {
  try {
    const content = newsletter.content || newsletter.objData;
    if (!content) return 'Empty newsletter';

    const objData = typeof content === 'string' ? JSON.parse(content) : content;
    if (!objData || objData.length === 0) return 'Empty newsletter';

    // Buscar primer párrafo o heading
    const firstTextItem = objData.find(
      (item: any) => item.type === 'paragraph' || item.type === 'heading'
    );

    if (firstTextItem) {
      const text = String(firstTextItem.content || '');
      return text.length > 100 ? `${text.substring(0, 100)}...` : text;
    }

    return 'No text content';
  } catch (error) {
    return 'Error parsing newsletter content';
  }
};
```

### 3. Contador de Componentes

```typescript
// Nueva función para contar componentes por tipo
const getComponentCounts = () => {
  try {
    const content = newsletter.content || newsletter.objData;
    if (!content) return {};

    const objData = typeof content === 'string' ? JSON.parse(content) : content;
    if (!objData) return {};

    return objData.reduce(
      (acc: any, item: any) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  } catch (error) {
    return {};
  }
};
```

### 4. Chips de Componentes

```typescript
// Mostrar chips con conteo de componentes
{Object.entries(componentCounts).map(([type, count]) => (
  <Chip
    key={type}
    size="small"
    label={`${count} ${type}${Number(count) > 1 ? 's' : ''}`}
    icon={
      <Icon
        icon={
          type === 'heading' ? 'mdi:format-header-1'
          : type === 'paragraph' ? 'mdi:format-paragraph'
          : type === 'button' ? 'mdi:button-cursor'
          : type === 'image' ? 'mdi:image'
          : type === 'divider' ? 'mdi:minus'
          : type === 'newsletter' ? 'mdi:email-newsletter'
          : 'mdi:code-tags'
        }
        width={16}
      />
    }
  />
))}
```

### 5. Información de Pie

```typescript
// Antes: Created y Schedule
<Typography>Created: {newsletter.createdAt}</Typography>
<Typography>Schedule: {newsletter.scheduleDate}</Typography>

// Ahora: Status y Created
<Typography>Status: {newsletter.status || 'DRAFT'}</Typography>
<Typography>{newsletter.createdAt}</Typography>
```

## Características del Nuevo Diseño

### 1. **Header Limpio**

- Sin fondo de color
- Solo borde inferior
- Título y menú de opciones

### 2. **Preview de Contenido**

- Extrae texto del primer párrafo o heading
- Limita a 100 caracteres con "..."
- Manejo de errores robusto

### 3. **Chips de Componentes**

- Muestra conteo de cada tipo de componente
- Iconos específicos para cada tipo
- Chip "Newsletter" por defecto si no hay componentes

### 4. **Información de Estado**

- Muestra el status del newsletter
- Fecha de creación
- Formato consistente con las notas

### 5. **Menú de Opciones**

- Edit y Delete
- Mismo comportamiento que las notas

## Tipos Actualizados

### Newsletter Interface

```typescript
export interface Newsletter {
  id: string;
  subject: string;
  description?: string;
  notes?: NewsletterNote[];
  dateCreated?: string;
  dateModified?: string;
  createdAt: string;
  scheduleDate?: string;
  header?: NewsletterHeader;
  footer?: NewsletterFooter;
  content?: any;
  objData?: any; // Agregado para contenido de componentes
  design?: any;
  generatedHtml?: string;
  status?: string;
}
```

## Ventajas del Nuevo Diseño

1. **Consistencia Visual**: Mismo diseño que las notas
2. **Información Relevante**: Preview del contenido real
3. **Conteo de Componentes**: Muestra qué tipos de elementos contiene
4. **Estado Claro**: Status y fecha de creación
5. **Manejo de Errores**: Robustez en parsing de datos

## Ejemplo de Renderizado

```typescript
// Newsletter con contenido
{
  subject: "Newsletter de Prueba",
  content: "[{\"type\":\"heading\",\"content\":\"Título\"},{\"type\":\"paragraph\",\"content\":\"Contenido del newsletter...\"}]",
  status: "DRAFT",
  createdAt: "2025-01-21T22:19:07.973Z"
}

// Renderiza:
// - Header: "Newsletter de Prueba"
// - Preview: "Título"
// - Chips: "1 heading", "1 paragraph"
// - Footer: "Status: DRAFT", "Jan 21, 2025"
```

## Consideraciones

1. **Parsing de Contenido**: Maneja tanto `content` como `objData`
2. **Fallbacks**: Valores por defecto para campos faltantes
3. **Iconos**: Mapeo específico para cada tipo de componente
4. **Performance**: Parsing solo cuando es necesario
5. **Accesibilidad**: Mismo comportamiento que las notas
