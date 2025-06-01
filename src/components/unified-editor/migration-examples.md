# 🔄 Guía de Migración al Editor Unificado

Esta guía te ayudará a migrar todos los editores existentes al nuevo **UnifiedEditor**.

## 📝 Migración por Editor

### 1. TiptapEditor → UnifiedEditor

**Antes:**

```tsx
import TiptapEditor from 'src/components/newsletter-note/tiptap-editor';

<TiptapEditor
  content={content}
  onChange={(html, text) => setContent(html)}
  onSelectionUpdate={handleSelection}
  className="my-editor"
/>;
```

**Después:**

```tsx
import { UnifiedEditor } from 'src/components/unified-editor';

<UnifiedEditor
  variant="newsletter"
  value={content}
  onChange={(output, metadata) => {
    setContent(output);
    // metadata incluye html, text, wordCount, etc.
  }}
  onSelectionUpdate={handleSelection}
  className="my-editor"
/>;
```

### 2. SimpleTipTapEditor → UnifiedEditor

**Antes:**

```tsx
import SimpleTipTapEditor from 'src/components/newsletter-note/simple-tiptap-editor';

<SimpleTipTapEditor
  content={content}
  onChange={setContent}
  placeholder="Escribe aquí..."
  className="simple-editor"
/>;
```

**Después:**

```tsx
import { UnifiedEditor } from 'src/components/unified-editor';

<UnifiedEditor
  variant="simple"
  value={content}
  onChange={(output) => setContent(output)}
  placeholder="Escribe aquí..."
  className="simple-editor"
/>;
```

### 3. TipTapEditorComponent → UnifiedEditor

**Antes:**

```tsx
import TipTapEditorComponent from 'src/components/newsletter-note/tiptap-editor-component';

<TipTapEditorComponent
  content={content}
  onChange={setContent}
  showToolbar={true}
  editorType="heading"
  headingLevel={2}
/>;
```

**Después:**

```tsx
import { UnifiedEditor } from 'src/components/unified-editor';

<UnifiedEditor
  variant="component"
  value={content}
  onChange={(output) => setContent(output)}
  componentType="heading"
  headingLevel={2}
  toolbar={{ enabled: true }}
/>;
```

### 4. ExtendedTipTapEditor → UnifiedEditor

**Antes:**

```tsx
import ExtendedTipTapEditor from 'src/components/educacion/extended-tiptap-editor';

<ExtendedTipTapEditor
  content={content}
  onChange={setContent}
  isHeading={true}
  headingLevel={3}
  placeholder="Contenido educativo..."
/>;
```

**Después:**

```tsx
import { UnifiedEditor } from 'src/components/unified-editor';

<UnifiedEditor
  variant="education"
  value={content}
  onChange={(output) => setContent(output)}
  componentType="heading"
  headingLevel={3}
  placeholder="Contenido educativo..."
/>;
```

### 5. Editor (principal) → UnifiedEditor

**Antes:**

```tsx
import { Editor } from 'src/components/editor';

<Editor
  value={content}
  onChange={setContent}
  placeholder="Write something awesome..."
  fullItem={true}
  error={hasError}
  helperText="Error message"
/>;
```

**Después:**

```tsx
import { UnifiedEditor } from 'src/components/unified-editor';

<UnifiedEditor
  variant="full"
  value={content}
  onChange={(output) => setContent(output)}
  placeholder="Write something awesome..."
  error={hasError}
  helperText="Error message"
  minHeight={400}
/>;
```

## 🎨 Configuración Avanzada

### Configuración Personalizada

```tsx
import { UnifiedEditor } from 'src/components/unified-editor';

<UnifiedEditor
  variant="standard"
  value={content}
  onChange={handleChange}
  // Personalizar extensiones
  extensions={{
    bold: true,
    italic: true,
    underline: false,
    textColor: true,
    image: false,
    table: true,
  }}
  // Personalizar toolbar
  toolbar={{
    enabled: true,
    position: 'top',
    sticky: true,
    groups: ['format', 'align', 'insert', 'history'],
  }}
  // Configuraciones adicionales
  outputFormat="both" // html, text, both, markdown
  autoSave={true}
  autoSaveInterval={5000}
  // Metadata callback
  onChange={(output, metadata) => {
    setContent(output);
    setWordCount(metadata?.wordCount || 0);
    setReadingTime(metadata?.readingTime || 0);
  }}
/>;
```

### Uso con Context

```tsx
import { useEditorContext } from 'src/components/unified-editor';

function EditorStats() {
  const { editor, metadata } = useEditorContext();

  return (
    <div>
      <p>Palabras: {metadata?.wordCount || 0}</p>
      <p>Tiempo de lectura: {metadata?.readingTime || 0} min</p>
      <p>Tiene imágenes: {metadata?.hasImages ? 'Sí' : 'No'}</p>
    </div>
  );
}
```

## 🔧 Migración Paso a Paso

### Paso 1: Instalar el Editor Unificado

```bash
# No requiere nuevas dependencias, usa las existentes de Tiptap
```

### Paso 2: Actualizar Imports

```tsx
// Reemplazar
import TiptapEditor from 'src/components/newsletter-note/tiptap-editor';
import SimpleTipTapEditor from 'src/components/newsletter-note/simple-tiptap-editor';
// ... otros editores

// Con
import { UnifiedEditor } from 'src/components/unified-editor';
```

### Paso 3: Actualizar Props

- `content` → `value`
- `onChange(html, text)` → `onChange(output, metadata)`
- `showToolbar` → `toolbar={{ enabled: true }}`
- `editorType` → `componentType`

### Paso 4: Actualizar Handlers

```tsx
// Antes
const handleChange = (html: string, text: string) => {
  setContent(html);
  setPlainText(text);
};

// Después
const handleChange = (output: string, metadata?: EditorMetadata) => {
  setContent(output);
  if (metadata) {
    setPlainText(metadata.textContent);
    setWordCount(metadata.wordCount);
    setReadingTime(metadata.readingTime);
  }
};
```

## 📈 Beneficios de la Migración

### ✅ Ventajas Inmediatas

- **-70% menos código** duplicado
- **Configuración unificada** y consistente
- **Mejor rendimiento** con lazy loading
- **Metadata automática** (palabras, tiempo de lectura, etc.)
- **Auto-save** integrado
- **Mejor accesibilidad**

### ✅ Ventajas a Largo Plazo

- **Mantenimiento centralizado**
- **Nuevas funcionalidades** automáticas para todos
- **Testing** unificado
- **Documentación** consolidada
- **Bundle size** optimizado

## 🔄 Cronograma de Migración Sugerido

### Semana 1: Newsletter

- Migrar `TiptapEditor`
- Migrar `SimpleTipTapEditor`
- Actualizar componentes de newsletter

### Semana 2: Educación

- Migrar `ExtendedTipTapEditor`
- Actualizar sección de educación
- Pruebas de funcionalidad

### Semana 3: General

- Migrar `TipTapEditorComponent`
- Migrar `Editor` principal
- Limpieza de código obsoleto

### Semana 4: Optimización

- Bundle analysis
- Performance testing
- Documentación final

## 🧪 Testing

```tsx
// Ejemplo de test unitario
import { render, screen } from '@testing-library/react';
import { UnifiedEditor } from 'src/components/unified-editor';

test('renders unified editor with newsletter variant', () => {
  render(<UnifiedEditor variant="newsletter" value="<p>Test content</p>" onChange={jest.fn()} />);

  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
```

## 🚨 Consideraciones

### ⚠️ Breaking Changes

- API de `onChange` cambió (ahora incluye metadata)
- Algunas props fueron renombradas
- Configuración de toolbar es diferente

### ✅ Compatibilidad

- Todas las extensiones de Tiptap siguen funcionando
- Estilos CSS existentes se mantienen
- Funcionalidad core idéntica

### 🔄 Rollback Plan

- Mantener editores viejos durante 2 semanas
- Feature flags para habilitar/deshabilitar
- Monitoring de errores
