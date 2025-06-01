'use client';

import React, { useState } from 'react';

import { Box, Card, Alert, Divider, Typography, CardContent } from '@mui/material';

// Editores para demostración
import SimpleTipTapEditorWithFlags from './simple-tiptap-editor-with-flags';

export default function NewsletterToolbarFixDemo() {
  const [contentWithToolbar, setContentWithToolbar] = useState(
    '<h2>🔧 Editor CON toolbar (antes)</h2><p>Este editor muestra la toolbar interna que era el problema. Las opciones aparecen duplicadas entre la toolbar del editor y el panel lateral.</p>'
  );

  const [contentWithoutToolbar, setContentWithoutToolbar] = useState(
    '<h2>✅ Editor SIN toolbar (después)</h2><p>Este editor tiene la toolbar <strong>oculta</strong>. Las opciones de edición aparecen solo en el panel lateral como debe ser en newsletter/notas.</p>'
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🎯 Demo: Newsletter Toolbar Fix
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Demostración del problema corregido: los editores de newsletter/notas ahora ocultan su
        toolbar interna para que las opciones de edición aparezcan únicamente en el panel lateral
        derecho.
      </Typography>

      {/* Alert explicativo */}
      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>✅ Problema Corregido:</strong> Todos los componentes de Newsletter
          (HeadingComponent, ButtonComponent, ParagraphComponent, SummaryComponent) ahora usan{' '}
          <code>showToolbar={'{false}'}</code>
          para ocultar la toolbar interna redundante.
        </Typography>
      </Alert>

      {/* Comparación lado a lado */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* ANTES: Con toolbar */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error.main">
                ❌ ANTES: Con Toolbar (Problema)
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                showToolbar={'{true}'} - Toolbar visible causando duplicación
              </Typography>

              <Box sx={{ border: '2px solid', borderColor: 'error.light', borderRadius: 1, p: 1 }}>
                <SimpleTipTapEditorWithFlags
                  content={contentWithToolbar}
                  onChange={(content) => setContentWithToolbar(content)}
                  showToolbar
                  placeholder="Editor con toolbar visible..."
                />
              </Box>

              <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                ⚠️ Toolbar interna visible = opciones duplicadas en panel lateral
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* DESPUÉS: Sin toolbar */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                ✅ DESPUÉS: Sin Toolbar (Corregido)
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                showToolbar={'{false}'} - Toolbar oculta, opciones solo en panel lateral
              </Typography>

              <Box
                sx={{ border: '2px solid', borderColor: 'success.light', borderRadius: 1, p: 1 }}
              >
                <SimpleTipTapEditorWithFlags
                  content={contentWithoutToolbar}
                  onChange={(content) => setContentWithoutToolbar(content)}
                  showToolbar={false}
                  placeholder="Editor sin toolbar interna..."
                />
              </Box>

              <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                ✅ Sin toolbar interna = opciones solo en panel lateral como debe ser
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Archivos corregidos */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📁 Archivos Corregidos
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Los siguientes componentes fueron actualizados para usar{' '}
            <code>showToolbar={'{false}'}</code>:
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Componentes Newsletter:
              </Typography>
              <ul>
                <li>HeadingComponent.tsx</li>
                <li>ButtonComponent.tsx</li>
                <li>ParagraphComponent.tsx</li>
                <li>SummaryComponent.tsx</li>
                <li>newsletter-content-editor.tsx (4 instancias)</li>
              </ul>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Sistema de Props:
              </Typography>
              <ul>
                <li>SimpleTipTapEditorWithFlags (interface actualizada)</li>
                <li>SimpleTipTapEditor (showToolbar agregado)</li>
                <li>SimpleTipTapEditorUnified (toolbar condicional)</li>
                <li>Default: showToolbar = false para newsletter</li>
              </ul>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" color="text.secondary">
            <strong>Resultado:</strong> Los editores de newsletter/notas ahora se ven limpios sin
            toolbars duplicadas. Las opciones de edición (bold, italic, alignment, etc.) aparecen
            únicamente en el panel lateral derecho donde corresponde según el diseño.
          </Typography>
        </CardContent>
      </Card>

      {/* Instrucciones de testing */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧪 Testing
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Para verificar que el fix funciona en la aplicación real:
          </Typography>

          <Box
            component="pre"
            sx={{
              p: 2,
              backgroundColor: 'grey.100',
              borderRadius: 1,
              fontSize: '0.875rem',
              overflow: 'auto',
            }}
          >
            {`// 1. Abrir cualquier newsletter/nota
// 2. Agregar un título, párrafo, botón o resumen
// 3. Verificar que NO aparece la toolbar interna del TipTap
// 4. Verificar que las opciones están solo en el panel lateral

// Rutas para testing:
/newsletter-note/newsletter-toolbar-fix-demo  // Este demo
/newsletter-note/feature-flags-demo           // Demo general
/newsletter-content-editor                    // Editor real`}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
