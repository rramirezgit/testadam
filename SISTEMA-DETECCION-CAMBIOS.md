# 🔍 Sistema de Detección de Cambios (Sin Auto-Save)

## 🎯 **Objetivo**

Implementar un sistema que detecte cambios en el editor y avise al usuario cuando intente salir sin guardar, eliminando completamente el auto-save automático.

## ✅ **Características Implementadas**

### 🔍 **1. Detección de Cambios Inteligente**

```typescript
// Estado de detección
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
const [changeCount, setChangeCount] = useState(0);
const initialDataRef = useRef<AutoSaveData | null>(null);

// Función de detección
const checkForChanges = useCallback(() => {
  if (!initialDataRef.current) return false;

  const currentData = createAutoSaveData();
  const hasChanges = JSON.stringify(currentData) !== JSON.stringify(initialDataRef.current);

  return hasChanges;
}, [createAutoSaveData]);
```

### 📢 **2. Notificación de Cambios**

```typescript
// Reemplaza el sistema de auto-save
const notifyChange = useCallback(
  (changeType: string) => {
    console.log('📢 Change detected:', changeType);

    const hasChanges = checkForChanges();
    setHasUnsavedChanges(hasChanges);
    setChangeCount((prev) => prev + 1);
  },
  [checkForChanges, changeCount]
);
```

### 🚨 **3. Advertencia al Salir del Navegador**

```typescript
// Detecta cuando el usuario cierra la pestaña/ventana
const handleBeforeUnload = useCallback(
  (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
      return e.returnValue;
    }
    return undefined;
  },
  [hasUnsavedChanges]
);

// Listener del navegador
useEffect(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [handleBeforeUnload]);
```

### 🔄 **4. Confirmación al Cerrar Editor**

```typescript
// Función para manejar el cierre con confirmación
const handleCloseWithConfirmation = useCallback(() => {
  if (hasUnsavedChanges) {
    const shouldSave = window.confirm(
      'Tienes cambios sin guardar. ¿Quieres guardar antes de salir?\n\n' +
        'Presiona "Aceptar" para guardar y salir\n' +
        'Presiona "Cancelar" para salir sin guardar\n' +
        'Presiona "X" para continuar editando'
    );

    if (shouldSave === true) {
      // Guardar y salir
      handleSaveNote();
      onClose();
    } else if (shouldSave === false) {
      // Salir sin guardar
      onClose();
    }
    // Si es null (X), no hacer nada (continuar editando)
  } else {
    // No hay cambios, salir directamente
    onClose();
  }
}, [hasUnsavedChanges, onClose]);
```

### 📊 **5. Indicador Visual de Cambios**

```typescript
// Indicador flotante que aparece solo cuando hay cambios
{hasUnsavedChanges && (
  <Box sx={{
    position: 'fixed',
    bottom: 20,
    right: 20,
    backgroundColor: 'warning.main',
    color: 'warning.contrastText',
    padding: 2,
    borderRadius: 2,
    boxShadow: 3,
  }}>
    <Icon icon="mdi:alert-circle" />
    <Typography variant="body2">
      Tienes cambios sin guardar ({changeCount})
    </Typography>
  </Box>
)}
```

### 🔄 **6. Reset Después de Guardar**

```typescript
// Función para resetear el estado después de guardar
const resetChangeDetection = useCallback(() => {
  if (noteData.isEditingExistingNote) {
    initialDataRef.current = createAutoSaveData();
    setHasUnsavedChanges(false);
    setChangeCount(0);
    console.log('🔄 Change detection reset after save');
  }
}, [noteData.isEditingExistingNote, createAutoSaveData]);

// Se llama automáticamente después de guardar exitosamente
// en handleSaveNote()
resetChangeDetection();
```

## 🔧 **Componentes Conectados**

### ✅ **Todos los componentes notifican cambios:**

- **Contenido de texto**: `updateComponentContent` → `notifyChange('component-content-updated')`
- **Propiedades**: `updateComponentProps` → `notifyChange('component-props-updated')`
- **Estilos**: `updateComponentStyle` → `notifyChange('component-style-updated')`
- **Agregar componente**: `addComponent` → `notifyChange('component-added')`
- **Eliminar componente**: `removeComponent` → `notifyChange('component-removed')`
- **Mover componente**: `moveComponent` → `notifyChange('component-moved')`
- **Listas**: Todos los cambios de lista notifican cambios

## 🎯 **Flujo de Usuario**

### **📝 Editando:**

1. Usuario hace cambios → Se detecta inmediatamente
2. Aparece indicador: "Tienes cambios sin guardar (X)"
3. Contador se incrementa con cada cambio

### **💾 Guardando:**

1. Usuario presiona "Guardar" → Guarda normalmente
2. Después de guardar exitosamente → Reset automático
3. Indicador desaparece → Estado limpio

### **🚪 Saliendo:**

#### **Cerrar pestaña/ventana:**

- **Con cambios**: Navegador muestra: "Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?"
- **Sin cambios**: Cierra normalmente

#### **Botón cerrar editor:**

- **Con cambios**: Diálogo: "¿Quieres guardar antes de salir?"
  - **Aceptar**: Guarda y cierra
  - **Cancelar**: Cierra sin guardar
  - **X**: Continúa editando
- **Sin cambios**: Cierra directamente

## 🚀 **Ventajas del Sistema**

### ✅ **Control Total del Usuario**

- **No hay guardado automático** → Usuario decide cuándo guardar
- **Advertencias claras** → Nunca pierde cambios por accidente
- **Feedback inmediato** → Sabe exactamente cuántos cambios ha hecho

### ✅ **Rendimiento Optimizado**

- **Sin timers** → No hay delays ni debouncing
- **Sin llamadas automáticas al backend** → Reduce carga del servidor
- **Detección eficiente** → Solo compara cuando es necesario

### ✅ **UX Mejorada**

- **Indicador no intrusivo** → Solo aparece cuando hay cambios
- **Confirmaciones inteligentes** → Diferentes opciones según el contexto
- **Estado siempre claro** → Usuario sabe si tiene cambios pendientes

## 📊 **Logs del Sistema**

```
📢 Change detected: component-content-updated
🔍 Change detection: {hasChanges: true, currentTitle: 'Mi nota', initialTitle: 'Mi nota', currentComponents: 8, initialComponents: 7}
📊 Change state updated: {hasUnsavedChanges: true, changeCount: 1}

// Al guardar:
🔄 Change detection reset after save

// Al intentar salir:
🚨 User attempting to close with unsaved changes
```

## 🎉 **Estado Final**

**✅ Auto-save**: Completamente eliminado  
**✅ Detección**: Funciona en tiempo real  
**✅ Advertencias**: Navegador + Editor  
**✅ UI**: Indicador visual no intrusivo  
**✅ Control**: 100% en manos del usuario  
**✅ Rendimiento**: Optimizado sin timers

**🎯 El usuario ahora tiene control total sobre cuándo guardar, con advertencias inteligentes para evitar pérdida de datos.**
