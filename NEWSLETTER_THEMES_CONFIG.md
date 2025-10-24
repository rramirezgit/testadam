# 📧 Configuración de Temas de Newsletter

## 📖 Descripción

Este documento explica cómo configurar y personalizar los temas de newsletter en Adam Pro usando variables de entorno.

---

## 🚀 Uso Básico

Los temas de newsletter se cargan automáticamente desde dos fuentes:

1. **Temas por defecto** (hardcoded en `src/config/newsletter-config.ts`)
2. **Variable de entorno** `NEXT_PUBLIC_NEWSLETTER_THEMES` (opcional, sobrescribe los temas por defecto)

---

## ⚙️ Configuración con Variables de Entorno

### Para Desarrollo Local

1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega la variable `NEXT_PUBLIC_NEWSLETTER_THEMES` con tu configuración personalizada
3. Reinicia el servidor de desarrollo

```bash
# .env.local
NEXT_PUBLIC_NEWSLETTER_THEMES=[{"id":"custom","name":"Mi Tema","gradientColors":["#FF0000","#0000FF"],"gradientDirection":90,"textColor":"#000000"}]
```

### Para Producción/Servidores

Las variables de entorno se pueden configurar de varias formas según tu plataforma:

#### **Vercel**

1. Ve a Project Settings → Environment Variables
2. Agrega `NEXT_PUBLIC_NEWSLETTER_THEMES` con tu valor JSON
3. Redeploy la aplicación

#### **Netlify**

1. Ve a Site Settings → Environment Variables
2. Agrega `NEXT_PUBLIC_NEWSLETTER_THEMES` con tu valor JSON
3. Redeploy la aplicación

#### **Docker**

```dockerfile
ENV NEXT_PUBLIC_NEWSLETTER_THEMES='[{"id":"custom","name":"Mi Tema",...}]'
```

#### **Servidor Linux/Unix**

```bash
export NEXT_PUBLIC_NEWSLETTER_THEMES='[{"id":"custom","name":"Mi Tema",...}]'
```

---

## 🎨 Estructura de un Tema

Cada tema debe tener la siguiente estructura:

```typescript
{
  id: string; // Identificador único (ej: "ocean", "warm")
  name: string; // Nombre descriptivo (ej: "Brisa Marina")
  gradientColors: [
    // Array con exactamente 2 colores
    string, // Color inicial en hex (ej: "#f0f9ff")
    string, // Color final en hex (ej: "#bae6fd")
  ];
  gradientDirection: number; // Dirección en grados 0-360 (ej: 135)
  textColor: string; // Color del texto en hex (ej: "#0c4a6e")
}
```

---

## 📝 Ejemplos

### Ejemplo 1: Un solo tema personalizado

```bash
NEXT_PUBLIC_NEWSLETTER_THEMES=[{"id":"brand","name":"Tema Corporativo","gradientColors":["#1a1a2e","#16213e"],"gradientDirection":180,"textColor":"#ffffff"}]
```

### Ejemplo 2: Múltiples temas personalizados

```bash
NEXT_PUBLIC_NEWSLETTER_THEMES=[{"id":"sunset","name":"Atardecer","gradientColors":["#ff6b6b","#feca57"],"gradientDirection":45,"textColor":"#2d3436"},{"id":"forest","name":"Bosque","gradientColors":["#0be881","#05c46b"],"gradientDirection":135,"textColor":"#1e3a20"}]
```

### Ejemplo 3: JSON formateado (para referencia, usar en una línea en .env)

```json
[
  {
    "id": "ocean",
    "name": "Océano Profundo",
    "gradientColors": ["#00d2ff", "#3a7bd5"],
    "gradientDirection": 120,
    "textColor": "#001f3f"
  },
  {
    "id": "fire",
    "name": "Fuego Ardiente",
    "gradientColors": ["#f12711", "#f5af19"],
    "gradientDirection": 90,
    "textColor": "#ffffff"
  }
]
```

---

## 🛠️ Herramientas para Crear JSON en Una Línea

Para convertir JSON multi-línea a una sola línea:

### Online

- [JSONFormatter.org](https://jsonformatter.org/json-minifier)
- [FreeFormatter.com](https://www.freeformatter.com/json-minifier.html)

### Línea de comandos

```bash
# Con jq
echo '{"id":"test"}' | jq -c

# Con node
node -e "console.log(JSON.stringify(require('./mi-tema.json')))"
```

---

## 🎨 Paletas de Colores Recomendadas

### Gradientes Suaves y Profesionales

| Nombre          | Color 1   | Color 2   | Uso                             |
| --------------- | --------- | --------- | ------------------------------- |
| Cielo Sereno    | `#e0f7fa` | `#80deea` | Temas corporativos frescos      |
| Rosa Moderno    | `#fce4ec` | `#f8bbd0` | Newsletters femeninos/lifestyle |
| Verde Menta     | `#e8f5e9` | `#a5d6a7` | Salud y bienestar               |
| Gris Elegante   | `#f5f5f5` | `#e0e0e0` | Minimalista profesional         |
| Morado Vibrante | `#f3e5f5` | `#ce93d8` | Creatividad e innovación        |

---

## 🐛 Troubleshooting

### Los temas no se cargan desde .env

1. **Verifica el nombre de la variable**: Debe ser exactamente `NEXT_PUBLIC_NEWSLETTER_THEMES`
2. **Reinicia el servidor**: Next.js solo lee variables al iniciar
3. **Verifica el JSON**: Usa un validador JSON online
4. **Revisa la consola**: Busca errores de parsing en la consola del navegador

### Error: "Cannot parse NEXT_PUBLIC_NEWSLETTER_THEMES"

- El JSON está mal formateado
- Asegúrate de escapar comillas si es necesario según tu plataforma
- Verifica que no haya saltos de línea en el valor

### Los temas se ven incorrectos

- Verifica que los colores sean hex válidos (formato: `#RRGGBB`)
- El gradientDirection debe ser un número entre 0 y 360
- Los colores de texto deben tener buen contraste con el fondo

---

## 📚 Archivos Relacionados

- `src/config/newsletter-config.ts` - Configuración y lógica de temas
- `src/global-config.ts` - Configuración global que importa los temas
- `src/components/newsletter-note/email-editor/right-panel.tsx` - Uso de los temas en el editor
- `.env.local.example` - Archivo de ejemplo con todas las variables

---

## 🤝 Contribuir

Si quieres agregar temas por defecto al sistema:

1. Edita `src/config/newsletter-config.ts`
2. Agrega tu tema al array `DEFAULT_NEWSLETTER_THEMES`
3. Asegúrate de seguir la estructura TypeScript definida
4. Crea un pull request con tu propuesta

---

## 📞 Soporte

Para preguntas o problemas:

- Revisa los logs de la consola del navegador
- Verifica que la variable esté disponible: `console.log(process.env.NEXT_PUBLIC_NEWSLETTER_THEMES)`
- Consulta la documentación de Next.js sobre [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
