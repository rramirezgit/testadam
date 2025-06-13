# 🚀 Sistema de Auto-guardado Inteligente

## 📝 **Resumen**

He implementado un sistema completo de auto-guardado que detecta TODOS los cambios en tiempo real en tu editor de notas. Este sistema es altamente eficiente y configurable.

## 🎯 **Características Principales**

### ✅ **Detección Automática de Cambios**

- **Texto**: Cada letra que agregues/elimines
- **Colores**: Cambios de colores en texto o componentes
- **Componentes**: Agregar, mover, eliminar componentes
- **Estilos**: Cambios en márgenes, fuentes, tamaños
- **Configuración**: Plantillas, fondos, banners

### ✅ **Guardado Inteligente**

- **Debounce**: Agrupa cambios rápidos (espera 2 segundos de inactividad)
- **Verificación por Intervalos**: Revisa cada 30 segundos si hay cambios
- **Solo para Notas Existentes**: No hace auto-guardado en notas nuevas (evita spam)
- **Detección de Cambios por Hash**: Compara el estado actual vs. último guardado

### ✅ **Indicador Visual**

- **Estados en Tiempo Real**: Guardando, Cambios pendientes, Guardado, Error
- **Contador de Cambios**: Muestra cuántos cambios han ocurrido
- **Última Hora de Guardado**: Timestamp del último auto-guardado
- **Controles**: Botones para activar/desactivar y forzar guardado

## 🏗️ **Estructura de Archivos Creados**

```
src/components/newsletter-note/email-editor/
├── hooks/
│   └── useAutoSave.ts           # Hook principal del auto-guardado
└── components/
    └── AutoSaveIndicator.tsx    # Componente visual del estado
```

## 🔧 **Objeto que se Envía al Backend**

El sistema rastrea y envía exactamente el mismo objeto que tu función `handleSaveNote` actual:

```typescript
interface AutoSaveData {
  title: string; // Título de la nota
  description: string; // Descripción
  coverImageUrl: string; // URL de imagen de portada
  components: EmailComponent[]; // Componentes de newsletter
  componentsWeb: EmailComponent[]; // Componentes de web
  config: {
    templateType: string; // Plantilla activa
    emailBackground: string; // Color de fondo
    selectedBanner: any; // Banner seleccionado
    showGradient: boolean; // Si usa gradiente
    gradientColors: string[]; // Colores del gradiente
    activeVersion: string; // Versión activa (newsletter/web)
    containerBorderWidth: number; // Ancho del borde
    containerBorderColor: string; // Color del borde
    containerBorderRadius: number; // Borde redondeado
    containerPadding: number; // Padding interno
    containerMaxWidth: number; // Ancho máximo
  };
}
```

## 🚀 **Cómo Integrar el Sistema**

### 1. **En tu componente EmailEditorMain:**

```typescript
import { useAutoSave, type AutoSaveData } from './hooks/useAutoSave';
import { AutoSaveIndicator } from './components/AutoSaveIndicator';

// 1. Configurar el auto-guardado
const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

// 2. Función para crear datos actuales
const createAutoSaveData = (): AutoSaveData => ({
  title: noteData.noteTitle,
  description: noteData.noteDescription,
  coverImageUrl: noteData.noteCoverImageUrl,
  components: emailComponents.getActiveComponents(activeTemplate, 'newsletter'),
  componentsWeb: emailComponents.getActiveComponents(activeTemplate, 'web'),
  config: {
    templateType: activeTemplate,
    emailBackground,
    selectedBanner,
    showGradient,
    gradientColors,
    activeVersion,
    containerBorderWidth,
    containerBorderColor,
    containerBorderRadius,
    containerPadding,
    containerMaxWidth,
  },
});

// 3. Función de guardado (usa tu lógica existente)
const autoSaveFunction = async (data: AutoSaveData) => {
  if (!noteData.isEditingExistingNote || !noteData.currentNoteId) return;

  const postData = {
    title: data.title,
    description: data.description,
    coverImageUrl: data.coverImageUrl,
    objData: JSON.stringify(data.components),
    objDataWeb: JSON.stringify(data.componentsWeb),
    configPost: JSON.stringify({
      ...data.config,
      dateModified: new Date().toISOString(),
    }),
    origin: 'ADAC',
    highlight: false,
  };

  await updatePost(noteData.currentNoteId, postData);
};

// 4. Configurar el hook
const autoSave = useAutoSave(createAutoSaveData(), {
  enabled: autoSaveEnabled,
  interval: 30000, // Verificar cada 30 segundos
  debounceDelay: 2000, // Esperar 2 segundos tras cambio
  onSave: autoSaveFunction,
  onError: (error) => showNotification('Error auto-guardado: ' + error.message, 'error'),
  onSuccess: () => console.log('✅ Auto-guardado exitoso'),
});

// 5. Función para notificar cambios
const notifyAutoSave = (changeType: string) => {
  if (autoSaveEnabled) {
    autoSave.updateData(createAutoSaveData());
    autoSave.markChange(changeType);
  }
};
```

### 2. **En el Header (para mostrar el indicador):**

```tsx
<AutoSaveIndicator
  autoSaveState={autoSave.autoSaveState}
  onToggleAutoSave={() => setAutoSaveEnabled(!autoSaveEnabled)}
  onForceSave={autoSave.forceSave}
  isEnabled={autoSaveEnabled}
/>
```

### 3. **Detectar Cambios en Tiempo Real:**

```typescript
// Cuando se actualiza contenido de componente
const updateComponentContent = (id: string, content: string) => {
  // ... tu lógica existente ...
  notifyAutoSave(`Contenido actualizado: ${id}`);
};

// Cuando se cambian propiedades
const updateComponentProps = (id: string, props: any) => {
  // ... tu lógica existente ...
  notifyAutoSave(`Props actualizada: ${id}`);
};

// Cuando se cambia el título
noteData.setNoteTitle = (title: string) => {
  // ... lógica existente ...
  notifyAutoSave('Título actualizado');
};
```

## 🎨 **Indicador Visual**

El componente `AutoSaveIndicator` muestra:

- 🟢 **Verde "Guardado"**: Todo está sincronizado
- 🟡 **Amarillo "X cambios"**: Hay cambios pendientes
- 🔵 **Azul "Guardando..."**: Procesando el guardado
- 🔴 **Rojo "Error"**: Hubo un problema al guardar

## ⚙️ **Configuración Avanzada**

```typescript
const autoSaveOptions = {
  enabled: true,
  interval: 30000, // ms entre verificaciones
  debounceDelay: 2000, // ms para agrupar cambios
  onSave: autoSaveFunction,
  onError: handleError,
  onSuccess: handleSuccess,
};
```

## 📊 **Estados de Auto-guardado**

```typescript
interface AutoSaveState {
  isAutoSaving: boolean; // ¿Está guardando ahora?
  lastSaved: Date | null; // Cuándo fue el último guardado
  hasUnsavedChanges: boolean; // ¿Hay cambios sin guardar?
  changeCount: number; // Número de cambios desde último guardado
  lastError: Error | null; // Último error si existe
}
```

## 🛡️ **Ventajas del Sistema**

1. **Eficiencia**: Solo guarda cuando realmente hay cambios
2. **Rendimiento**: Usa debouncing para agrupar cambios rápidos
3. **Seguridad**: Solo auto-guarda notas existentes, no nuevas
4. **Transparencia**: Indicador visual siempre muestra el estado
5. **Control**: Se puede activar/desactivar fácilmente
6. **Flexibilidad**: Configurable según necesidades

## 🔥 **¡Listo para Usar!**

El sistema está completamente implementado y listo. Solo necesitas:

1. **Integrar los hooks** en tu `EmailEditorMain`
2. **Agregar el indicador** en tu header
3. **Llamar `notifyAutoSave()`** en tus funciones de cambio existentes

¿Quieres que proceda con la integración completa en tu código? 🚀
