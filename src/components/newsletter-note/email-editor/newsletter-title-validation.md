# Validación Obligatoria del Título del Newsletter

## Descripción

Se ha implementado la validación obligatoria del título del newsletter para que se envíe como `subject` al guardar y sea un campo requerido.

## Cambios Realizados

### 1. **Validación en EditorHeader**

#### Antes:

```typescript
// Preparar datos del newsletter para crear uno nuevo
const subject = initialNote?.title || 'Nuevo Newsletter';
```

#### Después:

```typescript
// Validar que el título sea obligatorio
if (!newsletterTitle || !newsletterTitle.trim()) {
  throw new Error(
    'El título del newsletter es obligatorio. Por favor ingresa un título en la configuración del newsletter.'
  );
}

const subject = newsletterTitle.trim();
```

### 2. **Props Actualizadas**

#### EditorHeaderProps:

```typescript
interface EditorHeaderProps {
  // ... otras props
  // Nueva prop para el título del newsletter
  newsletterTitle?: string;
}
```

#### EditorHeader Component:

```typescript
export default function EditorHeader({
  // ... otras props
  newsletterTitle = '',
}: EditorHeaderProps) {
  // ...
}
```

### 3. **Flujo de Datos**

#### EmailEditorMain → EditorHeader:

```typescript
<EditorHeader
  // ... otras props
  // Nueva prop para el título del newsletter
  newsletterTitle={newsletterTitle}
/>
```

### 4. **Validación en NewsletterConfig**

#### Campo de Título Actualizado:

```typescript
<TextField
  fullWidth
  label="Título del Newsletter"
  value={newsletterTitle}
  onChange={(e) => onTitleChange(e.target.value)}
  sx={{ mb: 2 }}
  required
  error={!newsletterTitle || !newsletterTitle.trim()}
  helperText={!newsletterTitle || !newsletterTitle.trim() ? 'El título es obligatorio' : ''}
/>
```

## Flujo Completo

### 1. **Usuario ingresa título en configuración**

```typescript
// En NewsletterConfig
<TextField
  value={newsletterTitle}
  onChange={(e) => onTitleChange(e.target.value)}
  required
  error={!newsletterTitle || !newsletterTitle.trim()}
  helperText={!newsletterTitle || !newsletterTitle.trim() ? 'El título es obligatorio' : ''}
/>
```

### 2. **Título se propaga al editor**

```typescript
// En EmailEditorMain
onNewsletterInfoChange={({ title: newTitle, description: newDescription }) => {
  if (newTitle !== undefined) {
    setTitle(newTitle);
  }
  // ...
}}
```

### 3. **Validación al guardar**

```typescript
// En EditorHeader - handleSaveNewsletter
if (!newsletterTitle || !newsletterTitle.trim()) {
  throw new Error(
    'El título del newsletter es obligatorio. Por favor ingresa un título en la configuración del newsletter.'
  );
}

const subject = newsletterTitle.trim();
```

### 4. **Envío al backend**

```typescript
// En PostStore - createNewsletter
const sendData = {
  subject, // Título del newsletter como subject
  content: newsletterData.content,
};
```

## Validaciones Implementadas

### 1. **Validación Visual**

- Campo marcado como `required`
- Error visual cuando está vacío
- Helper text explicativo

### 2. **Validación de Guardado**

- Verificación antes de enviar al backend
- Error descriptivo si no hay título
- Prevención de guardado sin título

### 3. **Validación de Datos**

- Verificación de string vacío
- Trim de espacios en blanco
- Validación de longitud mínima

## Mensajes de Error

### 1. **Error Visual (TextField)**

```
El título es obligatorio
```

### 2. **Error de Guardado**

```
El título del newsletter es obligatorio. Por favor ingresa un título en la configuración del newsletter.
```

## Comportamiento del Sistema

### 1. **Estado Vacío**

- Campo muestra error visual
- Botón de guardar no funciona
- Mensaje de error descriptivo

### 2. **Estado Válido**

- Campo sin error visual
- Botón de guardar habilitado
- Título se envía como `subject`

### 3. **Guardado Exitoso**

- Título se usa como `subject` en el backend
- Newsletter se crea con el título correcto
- Confirmación de guardado exitoso

## Consideraciones Técnicas

### 1. **Propagación de Datos**

- Título fluye desde NewsletterConfig → EmailEditorMain → EditorHeader
- Validación en múltiples puntos
- Estado sincronizado entre componentes

### 2. **Manejo de Errores**

- Error descriptivo y específico
- Prevención de guardado sin datos válidos
- UX mejorada con feedback visual

### 3. **Compatibilidad**

- Mantiene compatibilidad con flujo existente
- No afecta otros campos
- Validación no intrusiva

## Resultado

- ✅ Título del newsletter es obligatorio
- ✅ Validación visual en el campo
- ✅ Validación al guardar
- ✅ Título se envía como `subject` al backend
- ✅ Mensajes de error descriptivos
- ✅ UX mejorada con feedback claro
