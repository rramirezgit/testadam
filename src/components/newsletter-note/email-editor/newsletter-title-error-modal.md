# Modal de Error para Título del Newsletter

## Descripción

Se ha implementado un modal de error que se muestra cuando el usuario intenta guardar un newsletter sin haber ingresado un título. El modal proporciona instrucciones claras sobre cómo solucionar el problema.

## Implementación

### 1. **Estado del Modal**

```typescript
// Estado para el modal de error del título
const [openTitleErrorDialog, setOpenTitleErrorDialog] = useState(false);
```

### 2. **Validación en handleSaveNewsletter**

```typescript
// Validar que el título sea obligatorio
if (!newsletterTitle || !newsletterTitle.trim()) {
  setOpenTitleErrorDialog(true);
  return;
}
```

### 3. **Componente Modal**

```typescript
<Dialog
  open={openTitleErrorDialog}
  onClose={() => setOpenTitleErrorDialog(false)}
  aria-labelledby="title-error-dialog-title"
  aria-describedby="title-error-dialog-description"
  maxWidth="sm"
  fullWidth
>
  <DialogTitle
    id="title-error-dialog-title"
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      color: 'error.main',
    }}
  >
    <Icon icon="mdi:alert-circle" color="#d32f2f" />
    Título Requerido
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="title-error-dialog-description">
      El título del newsletter es obligatorio para poder guardarlo. Por favor, ingresa un título en la sección de "Configuración del Newsletter" antes de intentar guardar.
    </DialogContentText>
    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        📝 Para agregar el título:
      </Typography>
      <Typography variant="body2" color="text.secondary">
        1. Haz clic en el panel derecho "Configuración del Newsletter"
      </Typography>
      <Typography variant="body2" color="text.secondary">
        2. En la pestaña "General", completa el campo "Título del Newsletter"
      </Typography>
      <Typography variant="body2" color="text.secondary">
        3. Intenta guardar nuevamente
      </Typography>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setOpenTitleErrorDialog(false)}
      variant="outlined"
      color="primary"
    >
      Entendido
    </Button>
  </DialogActions>
</Dialog>
```

## Características del Modal

### 1. **Diseño Visual**

- **Icono de alerta**: Icono de alerta rojo para indicar error
- **Título claro**: "Título Requerido"
- **Color de error**: Usa el color de error del tema
- **Diseño responsive**: `maxWidth="sm"` y `fullWidth`

### 2. **Contenido Informativo**

- **Descripción clara**: Explica por qué se muestra el modal
- **Instrucciones paso a paso**: Guía al usuario sobre cómo solucionar el problema
- **Caja de instrucciones**: Área destacada con pasos específicos

### 3. **Accesibilidad**

- **ARIA labels**: `aria-labelledby` y `aria-describedby`
- **Navegación por teclado**: Modal se puede cerrar con Escape
- **Focus management**: Manejo automático del foco

### 4. **Interacción**

- **Botón "Entendido"**: Permite cerrar el modal
- **Cierre con Escape**: Modal se cierra con la tecla Escape
- **Cierre con clic fuera**: Se puede cerrar haciendo clic fuera del modal

## Flujo de Usuario

### 1. **Usuario intenta guardar sin título**

```typescript
// Usuario hace clic en "Guardar Newsletter"
// Sistema valida el título
if (!newsletterTitle || !newsletterTitle.trim()) {
  setOpenTitleErrorDialog(true); // Modal se abre
  return; // No continúa con el guardado
}
```

### 2. **Modal se muestra**

- Aparece modal con error visual
- Muestra instrucciones claras
- Usuario puede leer las instrucciones

### 3. **Usuario sigue las instrucciones**

- Va al panel derecho "Configuración del Newsletter"
- Completa el campo "Título del Newsletter"
- Intenta guardar nuevamente

### 4. **Guardado exitoso**

- Título válido presente
- Modal no se muestra
- Newsletter se guarda correctamente

## Ventajas del Modal

### 1. **UX Mejorada**

- **Feedback claro**: Usuario entiende exactamente qué hacer
- **No bloqueante**: Modal se puede cerrar fácilmente
- **Instrucciones específicas**: Pasos claros para solucionar

### 2. **Prevención de Errores**

- **Validación temprana**: Se valida antes de enviar al backend
- **Mensaje descriptivo**: Explica por qué no se puede guardar
- **Solución incluida**: No solo dice el problema, sino cómo solucionarlo

### 3. **Accesibilidad**

- **ARIA compliant**: Cumple con estándares de accesibilidad
- **Navegación por teclado**: Funciona sin mouse
- **Screen reader friendly**: Compatible con lectores de pantalla

## Mensajes del Modal

### 1. **Título del Modal**

```
Título Requerido
```

### 2. **Descripción Principal**

```
El título del newsletter es obligatorio para poder guardarlo. Por favor, ingresa un título en la sección de "Configuración del Newsletter" antes de intentar guardar.
```

### 3. **Instrucciones Paso a Paso**

```
📝 Para agregar el título:
1. Haz clic en el panel derecho "Configuración del Newsletter"
2. En la pestaña "General", completa el campo "Título del Newsletter"
3. Intenta guardar nuevamente
```

### 4. **Botón de Acción**

```
Entendido
```

## Consideraciones Técnicas

### 1. **Imports Necesarios**

```typescript
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
```

### 2. **Estado del Modal**

```typescript
const [openTitleErrorDialog, setOpenTitleErrorDialog] = useState(false);
```

### 3. **Validación**

```typescript
if (!newsletterTitle || !newsletterTitle.trim()) {
  setOpenTitleErrorDialog(true);
  return;
}
```

### 4. **Cierre del Modal**

```typescript
onClose={() => setOpenTitleErrorDialog(false)}
```

## Resultado

- ✅ **Modal informativo**: Muestra claramente el problema
- ✅ **Instrucciones específicas**: Guía al usuario paso a paso
- ✅ **UX mejorada**: No bloquea la experiencia del usuario
- ✅ **Accesible**: Cumple con estándares de accesibilidad
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Consistente**: Usa el diseño del sistema existente
