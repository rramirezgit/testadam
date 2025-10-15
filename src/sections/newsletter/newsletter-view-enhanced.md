# Newsletter View - Mejoras Implementadas

## Descripción

Se ha replicado la funcionalidad avanzada de `notes-view.tsx` en `newsletter-view.tsx`, incluyendo filtros, búsqueda, paginación y manejo de templates.

## Funcionalidades Implementadas

### 1. **Búsqueda con Debounce**

```typescript
const handleSearch = useCallback(
  (value: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      setSearchTerm(value);
      setFilters((prev) => ({ ...prev, page: 1 }));
    }, 500);

    setSearchTimeout(newTimeout);
  },
  [searchTimeout]
);
```

### 2. **Filtros de Templates**

```typescript
// Filtro prominente de templates
<Box sx={{ mb: 3 }}>
  <Typography variant="h6" sx={{ mb: 2 }}>
    Filtrar por Template
  </Typography>

  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
    <Chip
      label="Todos los templates"
      onClick={() => handleTemplateChange('all')}
      color={selectedTemplate === 'all' ? 'primary' : 'default'}
      variant={selectedTemplate === 'all' ? 'filled' : 'outlined'}
      sx={{ cursor: 'pointer' }}
    />

    {emailTemplates.map((template) => (
      <Chip
        key={template.id}
        label={template.name}
        onClick={() => handleTemplateChange(template.id)}
        color={selectedTemplate === template.id ? 'primary' : 'default'}
        variant={selectedTemplate === template.id ? 'filled' : 'outlined'}
        sx={{ cursor: 'pointer' }}
      />
    ))}
  </Box>
</Box>
```

### 3. **Tabs Mejorados**

```typescript
// Filtro de Estado - Ahora secundario
<Box sx={{ mb: 3 }}>
  <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
    Estado de los newsletters
  </Typography>
  <Tabs
    value={tab}
    onChange={handleChangeTab}
    sx={{
      '& .MuiTab-root': {
        minHeight: '40px',
        fontSize: '0.875rem',
        textTransform: 'none',
      },
    }}
  >
    {TABS.map((tabItem: Tab) => (
      <Tab key={tabItem.value} label={tabItem.label} value={tabItem.value} />
    ))}
  </Tabs>
</Box>
```

### 4. **Paginación**

```typescript
{/* Paginación */}
{newsletters.length > 0 && (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Pagination
        count={Math.ceil(newsletters.length / filters.perPage)}
        page={filters.page}
        onChange={handlePageChange}
        color="primary"
        showFirstButton
        showLastButton
      />
      <Typography variant="body2" color="text.secondary">
        Mostrando {Math.min(filters.perPage, newsletters.length)} de {newsletters.length} newsletters
        {selectedTemplate !== 'all' && (
          <span>
            {' '}
            del template &quot;{emailTemplates.find((t) => t.id === selectedTemplate)?.name}
            &quot;
          </span>
        )}
      </Typography>
    </Box>
  </Box>
)}
```

### 5. **Modal de Filtros Avanzados**

```typescript
<Modal open={openFiltersModal} onClose={() => setOpenFiltersModal(false)}>
  <Paper sx={{ /* estilos */ }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h6">Filtros Avanzados</Typography>
      <IconButton onClick={() => setOpenFiltersModal(false)}>
        <Iconify icon="solar:close-circle-bold" />
      </IconButton>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Template y Origen */}
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <FormControl fullWidth>
          <InputLabel>Template</InputLabel>
          <Select value={selectedTemplate} label="Template" onChange={handleTemplateChange}>
            <MenuItem value="all">Todos los templates</MenuItem>
            {emailTemplates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Origen</InputLabel>
          <Select value={filters.origin} label="Origen" onChange={handleFilterChange}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="IA">IA</MenuItem>
            <MenuItem value="ADAC">ADAC</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Elementos por página */}
      <FormControl fullWidth>
        <InputLabel>Elementos por página</InputLabel>
        <Select value={filters.perPage} label="Elementos por página" onChange={handleFilterChange}>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>

      {/* Fechas */}
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          type="date"
          label="Fecha de inicio"
          value={filters.startDate}
          onChange={handleFilterChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="Fecha de fin"
          value={filters.endDate}
          onChange={handleFilterChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* Destacados */}
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.highlight}
            onChange={handleFilterChange}
          />
        }
        label="Solo newsletters destacados"
      />
    </Box>

    <Divider sx={{ my: 3 }} />

    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
      <Button variant="outlined" onClick={handleClearFilters}>
        Limpiar Filtros
      </Button>
      <Button variant="contained" onClick={() => setOpenFiltersModal(false)}>
        Aplicar Filtros
      </Button>
    </Box>
  </Paper>
</Modal>
```

## Estados Agregados

### Estados de Filtros

```typescript
const [searchTerm, setSearchTerm] = useState('');
const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
const [openFiltersModal, setOpenFiltersModal] = useState(false);
const [selectedTemplate, setSelectedTemplate] = useState<string>('all');

const [filters, setFilters] = useState({
  origin: '',
  startDate: '',
  endDate: '',
  highlight: false,
  perPage: 20,
  page: 1,
});
```

### Funciones de Manejo

```typescript
const handleSearch = useCallback(
  (value: string) => {
    /* ... */
  },
  [searchTimeout]
);
const handleTemplateChange = (templateId: string) => {
  /* ... */
};
const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
  /* ... */
};
const handleFilterChange = (key: string, value: any) => {
  /* ... */
};
const handleClearFilters = () => {
  /* ... */
};
```

## Imports Agregados

### React Hooks

```typescript
import { useState, useEffect, useCallback } from 'react';
```

### Material-UI Components

```typescript
import {
  Chip,
  Modal,
  Paper,
  Select,
  Divider,
  Checkbox,
  MenuItem,
  InputLabel,
  Pagination,
  FormControl,
  FormControlLabel,
} from '@mui/material';
```

### Templates

```typescript
import { emailTemplates } from 'src/components/newsletter-note/email-editor/data/email-templates';
```

## Ventajas del Nuevo Sistema

1. **Búsqueda Inteligente**: Debounce de 500ms para evitar requests excesivos
2. **Filtros Avanzados**: Template, origen, fechas, destacados
3. **Paginación**: Control de elementos por página
4. **UI Consistente**: Mismo diseño que notes-view
5. **Filtros de Template**: Chips interactivos para filtrar por template
6. **Modal de Filtros**: Interfaz avanzada para filtros complejos
7. **Estado Persistente**: Filtros se mantienen entre navegaciones
8. **Responsive**: Diseño adaptativo para móviles

## Flujo de Usuario

1. **Carga Inicial**: Se cargan todos los newsletters
2. **Búsqueda**: Usuario escribe en el campo de búsqueda
3. **Filtro de Templates**: Usuario selecciona template específico
4. **Filtro de Estado**: Usuario cambia entre tabs (DRAFT, REVIEW, etc.)
5. **Filtros Avanzados**: Usuario abre modal para filtros complejos
6. **Paginación**: Usuario navega entre páginas de resultados
7. **Acciones**: Usuario edita o elimina newsletters

## Consideraciones

1. **Performance**: Debounce en búsqueda para evitar sobrecarga
2. **UX**: Filtros prominentes y accesibles
3. **Responsive**: Diseño adaptativo para diferentes pantallas
4. **Consistencia**: Mismo patrón que notes-view
5. **Extensibilidad**: Fácil agregar nuevos filtros
