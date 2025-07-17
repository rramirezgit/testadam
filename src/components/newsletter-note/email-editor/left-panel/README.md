# Left Panel - Estructura Modular

Este directorio contiene la implementación modular del panel izquierdo del editor de emails/newsletter.

## Estructura de Archivos

```
left-panel/
├── index.tsx                    # Componente principal (re-export)
├── types.ts                     # Tipos e interfaces
├── components/                  # Componentes modulares
│   ├── ComponentCategories.tsx  # Categorías de componentes
│   ├── TemplateModal.tsx        # Modal de selección de plantillas
│   └── NotesModal.tsx          # Modal de notas disponibles
└── README.md                   # Esta documentación
```

## Componentes

### `index.tsx`

Componente principal que orquesta todos los subcomponentes. Maneja:

- Estados de tabs (contenido/biblioteca)
- Estados de modales
- Lógica de filtrado y búsqueda
- Integración con el sistema de newsletter

### `types.ts`

Define las interfaces principales:

- `EnabledComponents`: Controla qué componentes están habilitados
- `LeftPanelProps`: Props del componente principal

### `ComponentCategories.tsx`

Renderiza las categorías de componentes (Texto, Multimedia, Diseño, Noticias, Newsletter).
Cada categoría se muestra solo si tiene componentes habilitados.

### `TemplateModal.tsx`

Modal para seleccionar plantillas de email. Incluye:

- Grid de plantillas disponibles
- Preview visual de cada plantilla
- Selección interactiva

### `NotesModal.tsx`

Modal para inyectar notas disponibles en el newsletter. Incluye:

- Filtro de búsqueda por título
- Lista de notas con preview
- Estados de carga y error

## Beneficios de la Modularización

1. **Mantenibilidad**: Cada componente tiene una responsabilidad específica
2. **Reutilización**: Los modales pueden ser reutilizados en otros contextos
3. **Testabilidad**: Cada módulo puede ser testeado independientemente
4. **Legibilidad**: Código más fácil de entender y navegar
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades

## Uso

El componente se usa exactamente igual que antes, ya que mantiene la misma interfaz pública:

```tsx
import LeftPanel from './left-panel';

<LeftPanel
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  // ... resto de props
/>;
```

## Migración

La migración fue transparente:

- Se mantuvieron todas las props y funcionalidades
- No se requieren cambios en el código que usa el componente
- Se preservó toda la lógica de negocio
- Se mantuvieron todos los estilos y comportamiento de UI
