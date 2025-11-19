# Guía de Testing y Validación de Generadores HTML

## 🎯 Objetivo

Esta guía te ayudará a:
1. Comparar el HTML generado en ambos proyectos
2. Asegurar paridad entre implementaciones
3. Detectar problemas de compatibilidad
4. Validar renders en diferentes clientes de email

---

## 📋 Checklist de Validación

### Fase 1: Validación Estructural

- [ ] ✅ Todos los archivos críticos copiados
- [ ] ✅ Imports funcionan correctamente
- [ ] ✅ TypeScript compila sin errores
- [ ] ✅ Adaptador OBJDATAWEB creado
- [ ] ✅ Mapeo de tipos completado

### Fase 2: Validación Funcional

- [ ] ✅ Componentes básicos renderizan HTML
- [ ] ✅ Componentes complejos renderizan HTML
- [ ] ✅ Templates completos generan HTML
- [ ] ✅ Estilos inline se aplican correctamente
- [ ] ✅ HTML escapa caracteres especiales

### Fase 3: Validación Visual

- [ ] ✅ Renders idénticos en Gmail
- [ ] ✅ Renders idénticos en Outlook
- [ ] ✅ Renders idénticos en Apple Mail
- [ ] ✅ Layout responsive funciona en mobile
- [ ] ✅ Imágenes se cargan correctamente

---

## 🧪 Suite de Tests de Comparación

### Test 1: Componente Básico

**adam-pro:**
```typescript
const component: EmailComponent = {
  id: 'test-1',
  type: 'heading',
  content: 'Test Heading',
  props: { level: 1 },
  style: { color: '#1976d2' }
};

const htmlAdam = renderComponentToHtml(component);
console.log(htmlAdam);
```

**otro-proyecto:**
```typescript
const objDataWeb = {
  tipo: 'titulo',
  contenido: 'Test Heading',
  nivel: 1,
  estilos: { color: '#1976d2' }
};

const emailComponent = adaptSingleItem(objDataWeb, 0);
const htmlOtro = renderComponentToHtml(emailComponent);
console.log(htmlOtro);
```

**Validación:**
```typescript
// Ambos deberían producir HTML similar
assert(htmlAdam.includes('<h1'));
assert(htmlAdam.includes('Test Heading'));
assert(htmlAdam.includes('color: #1976d2'));
```

---

### Test 2: Componente Complejo (ImageText)

**adam-pro:**
```typescript
const imageTextComponent: EmailComponent = {
  id: 'test-2',
  type: 'imageText',
  content: '<p>Descripción del producto</p>',
  props: {
    imageUrl: 'https://example.com/product.jpg',
    imageAlt: 'Producto',
    titleContent: '<p>Producto XYZ</p>',
    layout: 'image-left',
    imageWidth: 40,
    spacing: 16,
    borderRadius: 8
  }
};

const htmlAdam = renderComponentToHtml(imageTextComponent);
```

**otro-proyecto:**
```typescript
const objDataWeb = {
  tipo: 'imagen-texto',
  contenido: '<p>Descripción del producto</p>',
  configuracion: {
    imagenUrl: 'https://example.com/product.jpg',
    imagenAlt: 'Producto',
    titulo: '<p>Producto XYZ</p>',
    layout: 'image-left',
    imageWidth: 40,
    spacing: 16,
    borderRadius: 8
  }
};

const emailComponent = adaptSingleItem(objDataWeb, 0);
const htmlOtro = renderComponentToHtml(emailComponent);
```

**Validación:**
```typescript
// Verificar estructura de tabla
assert(htmlAdam.includes('<table'));
assert(htmlAdam.includes('role="presentation"'));

// Verificar imagen
assert(htmlAdam.includes('https://example.com/product.jpg'));
assert(htmlAdam.includes('alt="Producto"'));

// Verificar contenido
assert(htmlAdam.includes('Producto XYZ'));
assert(htmlAdam.includes('Descripción del producto'));
```

---

### Test 3: Newsletter Completo

**adam-pro:**
```typescript
const components: EmailComponent[] = [
  { id: '1', type: 'heading', content: 'Newsletter', props: { level: 1 } },
  { id: '2', type: 'paragraph', content: 'Contenido del newsletter' },
  { id: '3', type: 'button', content: 'Ver Más', props: { url: 'https://example.com' } }
];

const componentsHtml = components.map(c => renderComponentToHtml(c)).join('\n');
const fullHtml = generateNewsletterTemplate(
  'Newsletter Test',
  'Descripción',
  componentsHtml,
  headerConfig,
  footerConfig
);
```

**otro-proyecto:**
```typescript
const objDataWeb = [
  { tipo: 'titulo', contenido: 'Newsletter', nivel: 1 },
  { tipo: 'parrafo', contenido: 'Contenido del newsletter' },
  { tipo: 'boton', contenido: 'Ver Más', configuracion: { url: 'https://example.com' } }
];

const fullHtml = generateNewsletterFromObjDataWeb(
  'Newsletter Test',
  'Descripción',
  objDataWeb,
  headerConfig,
  footerConfig
);
```

**Validación:**
```typescript
// Estructura completa
assert(fullHtml.includes('<!DOCTYPE html>'));
assert(fullHtml.includes('<html xmlns='));
assert(fullHtml.includes('</html>'));

// Header
assert(fullHtml.includes('Newsletter Test'));

// Footer
assert(fullHtml.includes('contactEmail'));

// Contenido
assert(fullHtml.includes('Newsletter'));
assert(fullHtml.includes('Contenido del newsletter'));
assert(fullHtml.includes('Ver Más'));
```

---

## 🔍 Herramientas de Comparación

### Comparador de HTML

```typescript
/**
 * Compara dos strings HTML ignorando espacios en blanco
 */
export function compareHtml(html1: string, html2: string): {
  match: boolean;
  differences: string[];
} {
  // Normalizar HTML
  const normalize = (html: string) => html
    .replace(/\s+/g, ' ')           // Múltiples espacios a uno
    .replace(/>\s+</g, '><')        // Espacios entre tags
    .trim();
  
  const norm1 = normalize(html1);
  const norm2 = normalize(html2);
  
  const match = norm1 === norm2;
  const differences: string[] = [];
  
  if (!match) {
    // Encontrar diferencias
    if (norm1.length !== norm2.length) {
      differences.push(`Longitud diferente: ${norm1.length} vs ${norm2.length}`);
    }
    
    // Comparar línea por línea
    const lines1 = norm1.split('\n');
    const lines2 = norm2.split('\n');
    
    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
      if (lines1[i] !== lines2[i]) {
        differences.push(`Línea ${i + 1} difiere:\n  Adam: ${lines1[i]?.substring(0, 100)}\n  Otro: ${lines2[i]?.substring(0, 100)}`);
      }
    }
  }
  
  return { match, differences };
}
```

### Extractor de Estilos

```typescript
/**
 * Extrae todos los estilos inline de un HTML
 */
export function extractInlineStyles(html: string): Record<string, string[]> {
  const styleRegex = /style="([^"]*)"/g;
  const styles: Record<string, string[]> = {};
  
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    const styleString = match[1];
    const properties = styleString.split(';').map(s => s.trim()).filter(Boolean);
    
    properties.forEach(prop => {
      const [key, value] = prop.split(':').map(s => s.trim());
      if (key && value) {
        if (!styles[key]) {
          styles[key] = [];
        }
        if (!styles[key].includes(value)) {
          styles[key].push(value);
        }
      }
    });
  }
  
  return styles;
}
```

### Validador de Estructura

```typescript
/**
 * Valida que un HTML tenga la estructura esperada
 */
export function validateHtmlStructure(html: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validar estructura básica
  if (!html.includes('<!DOCTYPE html>')) {
    errors.push('Falta DOCTYPE');
  }
  
  if (!html.includes('<html')) {
    errors.push('Falta tag <html>');
  }
  
  if (!html.includes('</html>')) {
    errors.push('Falta cierre </html>');
  }
  
  // Validar meta tags
  if (!html.includes('<meta charset')) {
    errors.push('Falta meta charset');
  }
  
  if (!html.includes('viewport')) {
    warnings.push('Falta meta viewport (puede afectar responsive)');
  }
  
  // Validar tablas para emails
  const tableCount = (html.match(/<table/g) || []).length;
  if (tableCount === 0) {
    warnings.push('No hay tablas (necesarias para layout de emails)');
  }
  
  // Validar role="presentation"
  if (tableCount > 0 && !html.includes('role="presentation"')) {
    warnings.push('Tablas sin role="presentation" (puede afectar accesibilidad)');
  }
  
  // Validar estilos inline
  if (html.includes('<style>') && !html.includes('style="')) {
    warnings.push('Usa <style> tag pero no estilos inline (puede no funcionar en todos los clientes)');
  }
  
  // Validar imágenes
  const imgCount = (html.match(/<img/g) || []).length;
  const altCount = (html.match(/alt="/g) || []).length;
  if (imgCount > altCount) {
    warnings.push(`${imgCount - altCount} imágenes sin atributo alt`);
  }
  
  // Validar links
  const linkRegex = /<a[^>]+href="([^"]*)"[^>]*>/g;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    const href = linkMatch[1];
    if (!href.startsWith('http')) {
      warnings.push(`Link con URL relativa: ${href}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
```

---

## 📊 Test Cases Completos

### Suite de Tests Automatizados

```typescript
import { describe, it, expect } from 'vitest'; // o jest

describe('HTML Generators Compatibility', () => {
  describe('Componentes Básicos', () => {
    it('debería generar heading idéntico', () => {
      const adam = generateFromAdam('heading', 'Test');
      const otro = generateFromObjData('titulo', 'Test');
      
      const comparison = compareHtml(adam, otro);
      expect(comparison.match).toBe(true);
    });
    
    it('debería generar paragraph idéntico', () => {
      const adam = generateFromAdam('paragraph', 'Test');
      const otro = generateFromObjData('parrafo', 'Test');
      
      const comparison = compareHtml(adam, otro);
      expect(comparison.match).toBe(true);
    });
    
    it('debería generar image idéntico', () => {
      const adam = generateFromAdam('image', '', { src: 'test.jpg' });
      const otro = generateFromObjData('imagen', '', { url: 'test.jpg' });
      
      const comparison = compareHtml(adam, otro);
      expect(comparison.match).toBe(true);
    });
  });
  
  describe('Componentes Complejos', () => {
    it('debería generar imageText idéntico', () => {
      const props = {
        imageUrl: 'test.jpg',
        titleContent: 'Title',
        layout: 'image-left'
      };
      
      const adam = generateFromAdam('imageText', 'Content', props);
      const otro = generateFromObjData('imagen-texto', 'Content', props);
      
      const comparison = compareHtml(adam, otro);
      expect(comparison.match).toBe(true);
    });
    
    it('debería generar multiColumns idéntico', () => {
      const props = {
        numberOfColumns: 2,
        columns: [
          { imageUrl: 'col1.jpg', titleContent: 'Col 1', content: 'Content 1' },
          { imageUrl: 'col2.jpg', titleContent: 'Col 2', content: 'Content 2' }
        ]
      };
      
      const adam = generateFromAdam('twoColumns', '', props);
      const otro = generateFromObjData('dos-columnas', '', props);
      
      const comparison = compareHtml(adam, otro);
      expect(comparison.match).toBe(true);
    });
  });
  
  describe('Templates', () => {
    it('debería generar newsletter completo', () => {
      const components = [
        { type: 'heading', content: 'Title' },
        { type: 'paragraph', content: 'Content' }
      ];
      
      const adam = generateNewsletterAdam(components);
      const otro = generateNewsletterOtro(components);
      
      const validation = validateHtmlStructure(otro);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });
  
  describe('Estilos', () => {
    it('debería aplicar estilos inline correctamente', () => {
      const component = {
        type: 'paragraph',
        content: 'Test',
        style: { fontSize: '16px', color: '#333' }
      };
      
      const html = renderComponentToHtml(component);
      
      expect(html).toContain('font-size: 16px');
      expect(html).toContain('color: #333');
    });
    
    it('debería escapar HTML correctamente', () => {
      const component = {
        type: 'paragraph',
        content: '<script>alert("xss")</script>'
      };
      
      const html = renderComponentToHtml(component);
      
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });
  });
});
```

---

## 🌐 Testing en Clientes de Email

### Gmail Web

**Método 1: Envío de prueba**
```typescript
// Enviar email de prueba a tu cuenta de Gmail
const html = generateNewsletterFromObjDataWeb(...);
sendTestEmail('tu-email@gmail.com', 'Test Newsletter', html);
```

**Método 2: Gmail Inspector (extensión Chrome)**
- Instala "Gmail HTML Inspector"
- Pega el HTML generado
- Inspecciona estilos aplicados

### Outlook Desktop

**Método 1: Litmus**
```bash
# Usa Litmus para testing automatizado
npm install -g litmus-cli
litmus test newsletter.html --clients outlook-2016,outlook-2019
```

**Método 2: Manual**
- Envía email de prueba a cuenta Outlook
- Abre en Outlook Desktop (Windows)
- Verifica layout y estilos

### Apple Mail

**Método 1: iPhone Simulator**
```bash
# Abre el simulador de iOS
open -a Simulator

# Envía email de prueba y verifica en Mail app
```

**Método 2: Manual**
- Envía email a tu cuenta iCloud
- Abre en Mail app (Mac/iPhone)
- Verifica responsive y estilos

---

## 📝 Template de Reporte de Testing

```markdown
# Reporte de Testing - Generadores HTML

**Fecha**: [FECHA]
**Tester**: [NOMBRE]
**Versión**: [VERSION]

## Resumen Ejecutivo

- Total tests: XX
- Pasados: XX
- Fallidos: XX
- Pendientes: XX

## Resultados por Componente

### Componentes Básicos

| Componente | Adam-Pro | Otro Proyecto | Match | Notas |
|------------|----------|---------------|-------|-------|
| heading    | ✅       | ✅            | ✅    | -     |
| paragraph  | ✅       | ✅            | ✅    | -     |
| image      | ✅       | ✅            | ✅    | -     |
| button     | ✅       | ✅            | ⚠️    | Diferencias menores en padding |
| divider    | ✅       | ✅            | ✅    | -     |

### Componentes Complejos

| Componente | Adam-Pro | Otro Proyecto | Match | Notas |
|------------|----------|---------------|-------|-------|
| imageText  | ✅       | ✅            | ✅    | -     |
| twoColumns | ✅       | ✅            | ✅    | -     |
| noteContainer | ✅    | ✅            | ✅    | -     |

### Clientes de Email

| Cliente | Gmail | Outlook | Apple Mail | Yahoo | Otros |
|---------|-------|---------|------------|-------|-------|
| Layout  | ✅    | ✅      | ✅         | ✅    | -     |
| Estilos | ✅    | ⚠️      | ✅         | ✅    | -     |
| Responsive | ✅ | ❌      | ✅         | ✅    | -     |

## Problemas Encontrados

1. **[PROBLEMA]**
   - Descripción: [...]
   - Severidad: Alta/Media/Baja
   - Afecta a: [componente/cliente]
   - Solución propuesta: [...]

2. **[PROBLEMA]**
   - ...

## Recomendaciones

1. [RECOMENDACIÓN 1]
2. [RECOMENDACIÓN 2]
3. [RECOMENDACIÓN 3]

## Conclusión

[RESUMEN DE LOS RESULTADOS Y SIGUIENTE PASOS]
```

---

## 🚀 Checklist de Deployment

Antes de usar en producción:

- [ ] Todos los tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] HTML validado en al menos 3 clientes de email
- [ ] Responsive funciona en mobile
- [ ] Imágenes se cargan correctamente
- [ ] Links funcionan correctamente
- [ ] Texto alternativo en todas las imágenes
- [ ] Sin errores de lint/TypeScript
- [ ] Documentación actualizada
- [ ] Equipo entrenado en uso de generadores

---

## 📚 Recursos Adicionales

### Herramientas Online

- **HTML Email Validator**: https://validator.w3.org/
- **Can I Email**: https://www.caniemail.com/
- **Email Markup Validator**: https://www.validity.com/resource-center/email-markup-validator/
- **Litmus**: https://litmus.com/ (de pago)
- **Email on Acid**: https://www.emailonacid.com/ (de pago)

### Testing Gratuito

- **Mailpit**: Self-hosted SMTP testing
- **Mailtrap**: Email sandbox para desarrollo
- **Putsmail**: Envío de HTML de prueba

### Librerías de Testing

```bash
npm install --save-dev vitest @testing-library/dom
npm install --save-dev jest jsdom
```

---

## 💡 Tips Finales

1. **Automatiza los tests** - Integra en CI/CD
2. **Mantén un repositorio de ejemplos** - HTML de referencia
3. **Documenta las diferencias** - Entre clientes de email
4. **Prueba en dispositivos reales** - No solo simuladores
5. **Monitorea métricas** - Tasas de apertura, clics, etc.
6. **Mantén ambos proyectos sincronizados** - Usa el script de sync
7. **Versiona los cambios** - Git tags para releases
8. **Comunica cambios al equipo** - Changelog actualizado

---

**¿Problemas?** Consulta `HTML_GENERATORS_QUICK_REFERENCE.md` o revisa los ejemplos en `OBJDATAWEB_ADAPTER_EXAMPLE.ts`.

