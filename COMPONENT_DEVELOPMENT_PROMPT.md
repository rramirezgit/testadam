# 🚀 Prompt para Desarrollo de Componentes - Adam Pro

## 📋 **Contexto del Proyecto**

Estás desarrollando componentes para **Adam Pro**, un proyecto Next.js con TypeScript que utiliza:

### **Stack Tecnológico**

- **Framework**: Next.js 15.2.4 + TypeScript 5.8.2
- **UI Library**: Material-UI (MUI) 7.0.1
- **State Management**: Zustand 5.0.3
- **Styling**: Emotion (@emotion/react, @emotion/styled)
- **Icons**: Iconify (@iconify/react)
- **Forms**: React Hook Form 7.55.0 + Zod 3.24.2
- **Animations**: Framer Motion 12.16.0
- **Editor**: TipTap (@tiptap/react) 2.11.7
- **Charts**: ApexCharts 4.5.0
- **Internationalization**: i18next 24.2.3

### **Arquitectura del Proyecto**

```
src/
├── components/           # Componentes reutilizables
│   ├── [component-name]/
│   │   ├── index.tsx    # Export principal
│   │   ├── types.ts     # Interfaces y tipos
│   │   ├── [component].tsx  # Componente principal
│   │   └── README.md    # Documentación
├── types/               # Tipos globales
├── sections/            # Páginas y vistas
├── layouts/             # Layouts de la aplicación
├── hooks/               # Custom hooks
├── utils/               # Utilidades
└── store/               # Estado global (Zustand)
```

## 🎯 **Convenciones de Desarrollo**

### **1. Estructura de Archivos**

```typescript
// ✅ Estructura recomendada
src/components/[component-name]/
├── index.tsx           # Re-export del componente principal
├── types.ts            # Interfaces y tipos específicos
├── [component].tsx     # Componente principal
├── [component].styles.tsx  # Estilos personalizados (si es necesario)
├── hooks/              # Hooks específicos del componente
│   └── use[Component].ts
├── utils/              # Utilidades específicas
│   └── [component]-utils.ts
└── README.md           # Documentación del componente
```

### **2. Convenciones de Nomenclatura**

```typescript
// ✅ Nomenclatura correcta
- Componentes: PascalCase (MyComponent)
- Archivos: kebab-case (my-component.tsx)
- Interfaces: PascalCase con sufijo Props (MyComponentProps)
- Hooks: camelCase con prefijo use (useMyComponent)
- Tipos: PascalCase (MyComponentType)
- Constantes: UPPER_SNAKE_CASE (DEFAULT_CONFIG)
```

### **3. Patrón de Props**

```typescript
// ✅ Patrón de props recomendado
interface MyComponentProps {
  // Props requeridas
  value: string;
  onChange: (value: string) => void;

  // Props opcionales con valores por defecto
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;

  // Props de estilo
  className?: string;
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;

  // Props de comportamiento
  autoFocus?: boolean;
  placeholder?: string;

  // Props de estado
  error?: boolean;
  loading?: boolean;
  helperText?: React.ReactNode;

  // Props de slots (para composición)
  slotProps?: {
    wrapper?: BoxProps;
    icon?: IconButtonProps;
    label?: TypographyProps;
  };

  // Props de callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}
```

### **4. Patrón de Componente**

```typescript
// ✅ Estructura de componente recomendada
'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { MyComponentProps } from './types';

import { forwardRef } from 'react';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  (
    {
      value,
      onChange,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      className,
      sx,
      style,
      autoFocus = false,
      placeholder,
      error = false,
      loading = false,
      helperText,
      slotProps,
      onBlur,
      onFocus,
      onKeyDown,
      ...other
    },
    ref
  ) => {
    // Estados locales
    const [isFocused, setIsFocused] = useState(false);

    // Handlers
    const handleChange = useCallback((newValue: string) => {
      onChange?.(newValue);
    }, [onChange]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    // Render
    return (
      <Box
        ref={ref}
        className={className}
        sx={[
          {
            // Estilos base
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            // ... más estilos
          },
          sx,
        ]}
        style={style}
        {...other}
      >
        {/* Contenido del componente */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Icono */}
          {slotProps?.icon && (
            <Iconify
              icon="mdi:star"
              sx={{ color: 'text.secondary' }}
              {...slotProps.icon}
            />
          )}

          {/* Contenido principal */}
          <Typography
            variant="body1"
            color={error ? 'error' : 'text.primary'}
            {...slotProps?.label}
          >
            {value || placeholder}
          </Typography>
        </Stack>

        {/* Helper text */}
        {helperText && (
          <Typography
            variant="caption"
            color={error ? 'error' : 'text.secondary'}
            sx={{ mt: 0.5 }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    );
  }
);

MyComponent.displayName = 'MyComponent';

export default MyComponent;
```

### **5. Patrón de Types**

```typescript
// ✅ Archivo types.ts
import type { Theme, SxProps } from '@mui/material/styles';
import type { BoxProps, ButtonProps, TypographyProps } from '@mui/material';

// Tipos específicos del componente
export type MyComponentVariant = 'primary' | 'secondary' | 'outlined';
export type MyComponentSize = 'small' | 'medium' | 'large';

// Props del componente
export interface MyComponentProps {
  // Props requeridas
  value: string;
  onChange: (value: string) => void;

  // Props opcionales
  variant?: MyComponentVariant;
  size?: MyComponentSize;
  disabled?: boolean;

  // Props de estilo
  className?: string;
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;

  // Props de comportamiento
  autoFocus?: boolean;
  placeholder?: string;

  // Props de estado
  error?: boolean;
  loading?: boolean;
  helperText?: React.ReactNode;

  // Props de slots
  slotProps?: {
    wrapper?: BoxProps;
    icon?: ButtonProps;
    label?: TypographyProps;
  };

  // Props de callbacks
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

// Tipos internos
export interface MyComponentState {
  isFocused: boolean;
  isHovered: boolean;
}

// Tipos de eventos
export interface MyComponentChangeEvent {
  value: string;
  isValid: boolean;
}
```

### **6. Patrón de Export**

```typescript
// ✅ Archivo index.tsx
export { default } from './MyComponent';
export type { MyComponentProps, MyComponentVariant, MyComponentSize } from './types';
```

## 🎨 **Integración con Material-UI**

### **1. Uso de Theme**

```typescript
// ✅ Uso correcto del theme
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2),
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      {/* Contenido */}
    </Box>
  );
};
```

### **2. Responsive Design**

```typescript
// ✅ Diseño responsive
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',                    // Mobile
      sm: 'repeat(2, 1fr)',         // Tablet
      md: 'repeat(3, 1fr)',         // Desktop
      lg: 'repeat(4, 1fr)',         // Large
    },
    gap: { xs: 2, sm: 3, md: 4 },
  }}
>
  {/* Contenido */}
</Box>
```

### **3. Breakpoints**

```typescript
// ✅ Breakpoints del proyecto
const breakpoints = {
  xs: 0, // Extra small devices (phones)
  sm: 600, // Small devices (tablets)
  md: 900, // Medium devices (desktops)
  lg: 1200, // Large devices (large desktops)
  xl: 1536, // Extra large devices
};
```

## 🔧 **Integración con TipTap Editor**

### **1. Componente de Editor**

```typescript
// ✅ Componente de editor TipTap
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface EditorComponentProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

const EditorComponent = ({ content, onChange, placeholder, editable = true }: EditorComponentProps) => {
  const editor = useEditor({
    content,
    editable,
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <EditorContent editor={editor} />
    </Box>
  );
};
```

## 📊 **Integración con Zustand Store**

### **1. Patrón de Store**

```typescript
// ✅ Store con Zustand
import { create } from 'zustand';

interface MyComponentStore {
  // Estado
  data: MyComponentData[];
  loading: boolean;
  error: string | null;

  // Acciones
  setData: (data: MyComponentData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Acciones asíncronas
  fetchData: () => Promise<void>;
  saveData: (data: MyComponentData) => Promise<void>;
}

export const useMyComponentStore = create<MyComponentStore>((set, get) => ({
  // Estado inicial
  data: [],
  loading: false,
  error: null,

  // Acciones
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Acciones asíncronas
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/my-component');
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  saveData: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/my-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const savedData = await response.json();
      set((state) => ({
        data: [...state.data, savedData],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## 🎯 **Integración con Newsletter System**

### **1. Componente de Newsletter**

```typescript
// ✅ Componente compatible con newsletter
import type { EmailComponent } from 'src/types/saved-note';

interface NewsletterComponentProps {
  component: EmailComponent;
  isSelected: boolean;
  onSelect: () => void;
  updateComponentContent: (id: string, content: string) => void;
  updateComponentProps: (id: string, props: Record<string, any>) => void;
  removeComponent: (id: string) => void;
}

const NewsletterComponent = ({
  component,
  isSelected,
  onSelect,
  updateComponentContent,
  updateComponentProps,
  removeComponent,
}: NewsletterComponentProps) => {
  return (
    <Box
      onClick={onSelect}
      sx={{
        border: isSelected ? '2px solid' : '1px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        borderRadius: 1,
        p: 2,
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
        },
      }}
    >
      {/* Contenido del componente */}
      <Typography variant="body1">{component.content}</Typography>

      {/* Controles de edición */}
      {isSelected && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <IconButton size="small" onClick={() => removeComponent(component.id)}>
            <Iconify icon="mdi:delete" />
          </IconButton>
        </Stack>
      )}
    </Box>
  );
};
```

## 📝 **Documentación del Componente**

### **1. README.md**

````markdown
# MyComponent

Componente reutilizable para [descripción breve].

## Uso

```tsx
import MyComponent from 'src/components/my-component';

<MyComponent
  value="Hello World"
  onChange={(value) => console.log(value)}
  variant="primary"
  size="medium"
/>;
```
````

## Props

| Prop       | Tipo                                     | Default     | Descripción                     |
| ---------- | ---------------------------------------- | ----------- | ------------------------------- |
| `value`    | `string`                                 | -           | Valor del componente            |
| `onChange` | `(value: string) => void`                | -           | Callback cuando cambia el valor |
| `variant`  | `'primary' \| 'secondary' \| 'outlined'` | `'primary'` | Variante visual                 |
| `size`     | `'small' \| 'medium' \| 'large'`         | `'medium'`  | Tamaño del componente           |

## Ejemplos

### Básico

```tsx
<MyComponent value="Texto" onChange={handleChange} />
```

### Con variante

```tsx
<MyComponent value="Texto" onChange={handleChange} variant="secondary" size="large" />
```

### Con error

```tsx
<MyComponent value="Texto" onChange={handleChange} error={true} helperText="Campo requerido" />
```

````

## 🧪 **Testing**

### **1. Estructura de Tests**
```typescript
// ✅ Test del componente
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from 'src/theme';

import MyComponent from './MyComponent';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithTheme(
      <MyComponent value="Test" onChange={() => {}} />
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const handleChange = jest.fn();

    renderWithTheme(
      <MyComponent value="Test" onChange={handleChange} />
    );

    // Simular cambio
    fireEvent.click(screen.getByText('Test'));

    expect(handleChange).toHaveBeenCalled();
  });
});
````

## 🚀 **Prompt para Crear Componentes**

```
Necesito crear un componente [NOMBRE_DEL_COMPONENTE] para el proyecto Adam Pro.

**Especificaciones:**
- [Descripción detallada de la funcionalidad]
- [Props requeridas y opcionales]
- [Comportamiento esperado]
- [Integración con el sistema de newsletter si es necesario]

**Requisitos técnicos:**
- Usar Material-UI (MUI) para el diseño
- Seguir las convenciones de TypeScript del proyecto
- Integrar con el sistema de temas
- Ser responsive
- Incluir documentación completa
- Seguir el patrón de props del proyecto
- Usar Iconify para iconos
- Incluir estados de loading y error si es necesario

**Stack del proyecto:**
- Next.js 15.2.4 + TypeScript 5.8.2
- Material-UI 7.0.1
- Zustand 5.0.3
- Emotion para styling
- Iconify para iconos
- React Hook Form + Zod
- Framer Motion para animaciones

**Estructura esperada:**
```

src/components/[component-name]/
├── index.tsx
├── types.ts
├── [component].tsx
├── hooks/ (si es necesario)
├── utils/ (si es necesario)
└── README.md

```

Por favor, crea el componente siguiendo todas las convenciones del proyecto y asegúrate de que sea completamente integrable con el sistema existente.
```

## ✅ **Checklist de Calidad**

- [ ] **TypeScript**: Tipos bien definidos y sin `any`
- [ ] **Props**: Interface completa con valores por defecto
- [ ] **Material-UI**: Uso correcto del theme y componentes
- [ ] **Responsive**: Diseño adaptativo con breakpoints
- [ ] **Accessibility**: ARIA labels y navegación por teclado
- [ ] **Performance**: Memoización cuando sea necesario
- [ ] **Testing**: Tests unitarios incluidos
- [ ] **Documentation**: README completo con ejemplos
- [ ] **Error Handling**: Estados de error manejados
- [ ] **Loading States**: Estados de carga cuando sea necesario
- [ ] **Theme Integration**: Uso correcto del sistema de temas
- [ ] **Icon Integration**: Iconify para iconos
- [ ] **Export Pattern**: Re-exports correctos
- [ ] **File Structure**: Estructura de archivos consistente
- [ ] **Naming**: Convenciones de nomenclatura seguidas

---

**¡Listo para crear componentes que se integren perfectamente con Adam Pro! 🚀**
