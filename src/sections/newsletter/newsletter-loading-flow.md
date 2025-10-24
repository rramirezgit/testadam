# Flujo de Carga de Newsletters desde Backend

## Descripción

Este documento explica el flujo implementado para cargar newsletters desde el backend cuando se accede a `newsletter-view.tsx`.

## Flujo Completo

### 1. Carga Inicial (Component Mount)

```typescript
// En newsletter-view.tsx
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos de newsletters...');

      await loadNotes();
      await loadNewsletters(); // Llama al backend

      console.log('✅ Datos de newsletters cargados exitosamente');
    } catch (error) {
      console.error('❌ Error cargando datos de newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [loadNotes, loadNewsletters]);
```

### 2. Store Global (src/lib/store.ts)

```typescript
loadNewsletters: async () => {
  try {
    console.log('🔄 Cargando newsletters desde backend...');
    const { findAllNewsletters } = usePostStore.getState();
    const newsletters = await findAllNewsletters();

    set({ newsletters });
    console.log('✅ Newsletters cargados desde backend:', newsletters.length);
  } catch (error) {
    console.error('❌ Error cargando newsletters:', error);
    set({ newsletters: [] });
  }
};
```

### 3. PostStore (src/store/PostStore.ts)

```typescript
findAllNewsletters: async () => {
  try {
    console.log('🔄 findAllNewsletters called');
    set({ loading: true, error: null });
    const axiosInstance = createAxiosInstance();

    const response = await axiosInstance.get(endpoints.newsletter.findAll);

    console.log('✅ Newsletters obtenidos exitosamente:', {
      responseStatus: response.status,
      newslettersCount: response.data?.length || 0,
      newsletters: response.data,
    });

    set({ loading: false });
    return response.data || [];
  } catch (error: any) {
    console.error('❌ Error obteniendo newsletters:', error);
    set({ loading: false, error: errorMessage });
    return [];
  }
};
```

### 4. Endpoint (src/utils/axiosInstance.ts)

```typescript
newsletter: {
  findAll: '/newsletters', // GET /newsletters
  create: '/newsletters',
  update: (id: string) => `/newsletters/${id}`,
  // ...
}
```

## Filtrado por Estado

### Tabs Disponibles

```typescript
const TABS: Tab[] = [
  { label: 'Borradores', value: 'DRAFT' },
  { label: 'Review', value: 'REVIEW' },
  { label: 'Aprobados', value: 'APPROVED' },
  { label: 'Michin', value: 'PUBLISHED' },
];
```

### Filtrado en el Render

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

## Tipos Actualizados

### Newsletter Type

```typescript
export interface Newsletter {
  id: string;
  title: string;
  description?: string;
  notes: NewsletterNote[];
  dateCreated: string;
  dateModified: string;
  header?: NewsletterHeader;
  footer?: NewsletterFooter;
  content?: any;
  design?: any;
  generatedHtml?: string;
  status?: string; // DRAFT, REVIEW, APPROVED, PUBLISHED
}
```

## Logs de Debugging

### Carga Exitosa

```
🔄 Cargando datos de newsletters...
🔄 Cargando newsletters desde backend...
🔄 findAllNewsletters called
✅ Newsletters obtenidos exitosamente: { responseStatus: 200, newslettersCount: 5 }
✅ Newsletters cargados desde backend: 5
✅ Datos de newsletters cargados exitosamente
```

### Error en Carga

```
🔄 Cargando datos de newsletters...
🔄 Cargando newsletters desde backend...
🔄 findAllNewsletters called
❌ Error obteniendo newsletters: { error, errorStatus: 500 }
❌ Error cargando newsletters: Error
❌ Error cargando datos de newsletters: Error
```

## Refresh Automático

### Al Cerrar Editor

```typescript
useEffect(() => {
  const refreshData = async () => {
    if (!openEditor && !openNewsletterEditor) {
      try {
        console.log('🔄 Refrescando datos después de cerrar editor...');
        await loadNotes();
        await loadNewsletters();
        console.log('✅ Datos refrescados exitosamente');
      } catch (error) {
        console.error('❌ Error refrescando datos:', error);
      }
    }
  };

  refreshData();
}, [openEditor, openNewsletterEditor, loadNotes, loadNewsletters]);
```

## Ventajas del Nuevo Flujo

1. **Datos Reales**: Los newsletters se cargan desde el backend
2. **Filtrado por Estado**: Muestra newsletters según su estado actual
3. **Refresh Automático**: Se actualiza al cerrar editores
4. **Manejo de Errores**: Logs detallados y fallback a array vacío
5. **Loading States**: Indicadores de carga apropiados

## Consideraciones

1. **Autenticación**: El endpoint requiere token de autenticación
2. **Caching**: Los datos se mantienen en el store global
3. **Error Handling**: Si falla la carga, se muestra array vacío
4. **Performance**: Solo se carga cuando es necesario

## Troubleshooting

### No se cargan newsletters

- Verificar token de autenticación
- Revisar logs del backend
- Comprobar endpoint `/newsletters`

### Error de red

- Verificar conexión a internet
- Revisar configuración de axios
- Comprobar URL del backend

### Filtrado incorrecto

- Verificar propiedad `status` en newsletters
- Revisar valores de los tabs
- Comprobar lógica de filtrado
